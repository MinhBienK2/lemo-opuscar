"""Chặn hai thói quen đo được trong log của các phiên làm phim: dò trạng thái, và tự dựng tờ ảnh.

Claude Code gọi hook này **trước** mỗi lần dùng công cụ `Bash` (PreToolUse). Đầu vào là JSON trên
stdin; đầu ra là mã thoát:

- `0` — cho qua;
- `2` — **chặn**, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Hai thói quen này đã đo được trong log thật của ba phiên:

- *Dò trạng thái* (luật R9): `ls -l --time-style=+%H:%M:%S src/props.js; date +%H:%M:%S` chạy
  **12 lần**, `ls /tmp/lemo-review-*/beats | wc -l` chạy **8 lần**, và output của job nền bị đọc lại
  5–7 lần mỗi tệp. Mỗi lần là một lượt của phiên mà không thay đổi được gì — và lần thứ ba trở đi
  thì lặp lại *cùng một câu hỏi* mà câu trả lời chưa đổi.
- *Tự dựng tờ ảnh bằng ffmpeg* (luật R10): **15 lần** ở tập 01 và **4 lần** ở tập 02, trong khi
  thư viện đã có `core/render/sheet.py` (xếp các khung lại, đặt tên từng khung) và `tools/frames_at.py`
  (lấy khung từ chính mp4 rồi dán thành tờ).

**Cách làm đúng.** Muốn biết một việc còn chạy không: chạy nó ở chế độ nền và đợi harness báo xong,
hoặc hỏi **một lần** bằng `ps -o etime= -p <pid>`. Muốn xem nhiều khung cùng lúc: dùng
`tools/frames_at.py` và `core/render/sheet.py`.

    python3 tools/hook_poll.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import re
import sys
import time

STATE = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'lemo-polls.json')
LIMIT = 3          # chặn từ lần thứ 3 của cùng một hình dạng lệnh dò
WINDOW = 7200      # quên lệnh dò cũ hơn 2 giờ

# Dấu hiệu của "còn chạy không?": lệnh có hỏi trạng thái một tệp (`ls`, `stat`, `wc`, `du`) VÀ có hỏi
# giờ (`date`). Hai thứ đó đứng cạnh nhau là dấu hiệu của một vòng dò; một lệnh chỉ hỏi giờ thì không.
HAS_DATE = re.compile(r'\bdate\b')
HAS_CHECK = re.compile(r'\b(?:ls|stat|wc|du)\b')

# Ba hình dạng chờ, và mỗi hình dạng một khoá đếm riêng. Ba phiên làm phim 38 giờ (bản ghi
# 2026-11-11) chờ bằng cả ba: `until [ -f … ]; do sleep 20; done`, `for i in $(seq 1 230); do … sleep 30; done`
# và `sleep 280; echo waited`. Lệnh cũ chỉ bắt được hình dạng `date` + `ls`, và khoá đếm là *toàn bộ
# câu lệnh* nên một phiên đổi câu lệnh mỗi lần thì không lần nào chạm ngưỡng (M5). Ở đây khoá là
# *hình dạng trừu tượng*: cùng một kiểu chờ thì đếm chung, bất kể câu chữ khác nhau.
WAIT_LOOP = re.compile(r'\b(?:until|while|for)\b[^\n]*\bsleep\b')
BARE_SLEEP = re.compile(r'^\s*sleep\s+\d+')
PROC_QUERY = re.compile(r'\bpgrep\b|\bps\b[^\n]*(?:\betime\b|\bgrep\b)')

# Tự dựng tờ ảnh: dán khung đã thu nhỏ bằng `tile=`. (ffmpeg trộn âm, nối tệp, `-filter_complex` nói chung: cho qua.)
MONTAGE = re.compile(r'ffmpeg[^\n]*?\btile=')

POLL_MESSAGE = (
    'Bạn đã chạy lệnh dò trạng thái này %d lần trong phiên này:\n'
    '    %s\n\n'
    'Dò trạng thái là vòng dò, không phải việc (luật R9): lần thứ ba trở đi thì câu hỏi y hệt nhau '
    'và câu trả lời chưa đổi, mỗi lần lại tốn một lượt của phiên.\n\n'
    'Cách làm đúng: chạy việc đó ở chế độ nền (`run_in_background=true`) rồi **đợi harness báo xong**; '
    'cần hỏi tiến độ thì hỏi **một lần** bằng `ps -o etime= -p <pid>`, đừng hỏi lại.\n')

MONTAGE_MESSAGE = (
    'Bạn đang tự dựng một tờ ảnh bằng ffmpeg. Thư viện đã có sẵn công cụ làm đúng việc này '
    '(luật R10):\n'
    '  - `python3 tools/frames_at.py <mp4> <beats.json> <out.jpg> [--lines c1,c4-c7] [--cols 1] [--w 1200]`\n'
    '    — lấy khung từ **chính phim đã dựng**, cắt đúng giữa câu lời kể, rồi dán thành một tờ;\n'
    '  - `core/render/sheet.py` — xếp các khung lại và đặt tên từng khung.\n\n'
    'Tự viết bằng ffmpeg thì dán sai thứ tự, sai tỉ lệ, và tốn một lượt lớn để xếp lại.\n')


def shape_of(command):
    """Khóa của một hình dạng lệnh dò: bỏ số và dấu câu, để `date +%H:%M:%S` và `date +%H:%M` là một."""
    return re.sub(r'[\s0-9"\']+', ' ', command or '').strip()


def poll_kind(command):
    """(khoá đếm, có phải vòng dò không) — khoá là *hình dạng trừu tượng*, không phải câu lệnh.

    Một phiên dưới áp lực đổi câu lệnh mỗi lần, nên khoá là toàn bộ câu lệnh thì không lần nào
    chạm ngưỡng (M5). Ở đây cùng một *kiểu* chờ thì đếm chung: một vòng `until … sleep` vẫn là một
    vòng `until … sleep`, dù nó đổi tên tệp hay số giây.
    """
    c = command or ''
    if WAIT_LOOP.search(c):
        return 'wait:loop', True
    if BARE_SLEEP.match(c):
        return 'wait:sleep', True
    if HAS_DATE.search(c) and HAS_CHECK.search(c):
        return 'wait:date+check', True
    if PROC_QUERY.search(c):
        return 'wait:proc', True
    return '', False


def decide(command, session, state, now=None):
    """(mã thoát, thông điệp) cho một lệnh Bash. `state` là dict phiên → {hình dạng: (lần đầu, số lần)}."""
    if not command:
        return 0, ''
    if MONTAGE.search(command):
        return 2, MONTAGE_MESSAGE
    key, is_poll = poll_kind(command)
    if not is_poll:
        return 0, ''
    now = now if now is not None else time.time()
    seen = state.setdefault(session, {})
    first, count = seen.get(key, (now, 0))
    if now - first > WINDOW:
        first, count = now, 0
    count += 1
    seen[key] = (first, count)
    if count < LIMIT:
        return 0, ''
    return 2, POLL_MESSAGE % (count, command.strip()[:160])


def load_state():
    try:
        with open(STATE, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def save_state(state):
    try:
        tmp = STATE + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as f:
            json.dump(state, f)
        os.replace(tmp, STATE)
    except OSError:
        pass


def main():
    if '--selftest' in sys.argv:
        return selftest()
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    try:
        cmd = data.get('tool_input', {}).get('command', '') or ''
        session = data.get('session_id') or 'default'
    except AttributeError:
        return 0
    state = load_state()
    code, msg = decide(cmd, session, state)
    if code:
        save_state(state)
        sys.stderr.write(msg)
        return code
    save_state(state)
    return 0


def selftest():
    """Các ca thử bằng tham số giả — không phụ thuộc lịch sử thật của phiên này."""
    cases = [
        # (lệnh, số lần đã chạy trước, mã thoát kỳ vọng)
        ('ls -l src/props.js', 0, 0),
        ('ls -l --time-style=+%H:%M:%S src/props.js; date +%H:%M:%S', 0, 0),
        ('ls -l --time-style=+%H:%M:%S src/props.js; date +%H:%M:%S', 2, 2),
        ('ls /tmp/lemo-review-abc/beats | wc -l; date \'+%H:%M:%S\'', 2, 2),
        ('date +%H:%M:%S; ls -l src/props.js', 2, 2),
        # lệnh khác hình dạng thì không bị tính vào
        ('cat src/props.js | head -40', 0, 0),
        ('node --check src/props.js && echo OK', 0, 0),
        # tự dựng tờ ảnh: chặn ngay, không cần đến lần thứ ba
        ('ffmpeg -i a.mp4 -vf "tile=3x2" b.jpg', 0, 2),
        ('ffmpeg -i a.mp4 b.mp4', 0, 0),
        ('ffmpeg -i a.mp4 -vf scale=320:-1 b.jpg', 0, 0),
        ('ffmpeg -i a.wav -i b.wav -filter_complex "amix=inputs=2" c.wav', 0, 0),
        ('ffmpeg -i a.mp4 -filter_complex "[0:v]scale=320:-1,tile=3x2" b.jpg', 0, 2),
        ('for f in *.jpg; do echo $f; done', 0, 0),
        # ── ba hình dạng chờ thật của ba phiên 38 giờ (bản ghi 2026-11-11, M5) ──
        # vòng lặp chờ một tệp: cùng kiểu thì đếm chung, dù câu chữ khác nhau
        ('until [ -f "$EP/review/picture-4.md" ]; do pgrep -f "review.py.*tap-02" >/dev/null || break; sleep 10; done', 2, 2),
        ('until [ -f "$EP/review/props-13.md" ]; do sleep 10; done', 2, 2),
        ('for i in $(seq 1 230); do if [ -f $EP/review/props.json ]; then break; fi; sleep 20; done', 2, 2),
        ('i=0; while [ $i -lt 55 ]; do sleep 20; i=$((i+1)); done', 2, 2),
        # ngủ thẳng trong vỏ: cũng là vòng dò
        ('sleep 280; echo waited', 2, 2),
        ('sleep 290', 2, 2),
        # hỏi tiến trình: một lần thì được, nhiều lần thì chặn
        ('ps -eo pid,etime,args | grep -E "claude -p|episode.py" | grep -v grep', 2, 2),
        ('ps -o etime= -p 12345', 0, 0),
    ]
    bad = 0
    for cmd, seen_before, want in cases:
        state = {}
        if seen_before:
            key, _ = poll_kind(cmd)
            state['s'] = {key: (1000.0, seen_before)}
        code, msg = decide(cmd, 's', state, now=2000.0)
        ok = code == want
        bad += 0 if ok else 1
        print('%-4s rc=%d (mong đợi %d)  %s' % ('ok' if ok else 'FAIL', code, want, cmd[:72]))
    # khoá đếm là hình dạng trừu tượng: hai câu lệnh khác câu chữ cùng kiểu thì đếm chung
    state = {}
    decide('until [ -f "$EP/a.md" ]; do sleep 10; done', 's', state, now=2000.0)
    decide('until [ -f "$EP/b.md" ]; do sleep 20; done', 's', state, now=2000.0)
    code, _ = decide('until [ -f "$EP/c.md" ]; do sleep 30; done', 's', state, now=2000.0)
    ok = code == 2
    bad += 0 if ok else 1
    print('%-4s rc=%d (mong đợi 2)  %s' % ('ok' if ok else 'FAIL', code, 'ba câu khác câu chữ, cùng một kiểu chờ'))
    print('%d/%d ok' % (len(cases) + 1 - bad, len(cases) + 1))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
