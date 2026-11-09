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

# Tự dựng tờ ảnh: ffmpeg với filter phức tạp, hoặc dán khung bằng `tile=`.
MONTAGE = re.compile(r'ffmpeg[^\n]*?(?:-filter_complex|\btile=)')

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


def decide(command, session, state, now=None):
    """(mã thoát, thông điệp) cho một lệnh Bash. `state` là dict phiên → {hình dạng: (lần đầu, số lần)}."""
    if not command:
        return 0, ''
    if MONTAGE.search(command):
        return 2, MONTAGE_MESSAGE
    if not (HAS_DATE.search(command) and HAS_CHECK.search(command)):
        return 0, ''
    now = now if now is not None else time.time()
    key = shape_of(command)
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
        ('ls -l --time-style=+%H:%M:%S src/props.js; date +%H:%M:%S', 2, 2),
        ('cat src/props.js | head -40', 0, 0),
        ('node --check src/props.js && echo OK', 0, 0),
        # tự dựng tờ ảnh: chặn ngay, không cần đến lần thứ ba
        ('ffmpeg -i a.mp4 -filter_complex "tile=3x2" b.jpg', 0, 2),
        ('ffmpeg -i a.mp4 b.mp4', 0, 0),
        ('ffmpeg -i a.mp4 -vf scale=320:-1 b.jpg', 0, 0),
    ]
    bad = 0
    for cmd, seen_before, want in cases:
        state = {}
        if seen_before:
            state['s'] = {shape_of(cmd): (1000.0, seen_before)}
        code, msg = decide(cmd, 's', state, now=2000.0)
        ok = code == want
        bad += 0 if ok else 1
        print('%-4s rc=%d (mong đợi %d)  %s' % ('ok' if ok else 'FAIL', code, want, cmd[:72]))
    print('%d/%d ok' % (len(cases) - bad, len(cases)))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
