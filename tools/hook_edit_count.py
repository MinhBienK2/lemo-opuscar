"""Chặn khi một phiên sửa **cùng một tệp** quá nhiều lần.

Claude Code gọi hook này **trước** mỗi lần dùng công cụ `Edit` hoặc `Write` (PreToolUse).
Đầu vào là JSON trên stdin; đầu ra là mã thoát:

- `0` — cho qua;
- `2` — **chặn** lần sửa này, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Một lượt sửa là một lượt của phiên, và mỗi lượt trả lại **toàn bộ ngữ cảnh**
(input + cache đọc + cache tạo). Sửa cùng một tệp nhiều lần là cách tốn kém nhất mà một phiên làm
phim có thể tốn tiền — và nó đo được: trong các phiên `2tocom/MiniMax-M3.1-Flash` đang chạy, một
tệp bị sửa **65 lần**, một tệp khác 41 lần, trong khi cùng những phiên đó đọc lại tệp vừa sửa
13 lần. Sửa và đọc lại là hai vòng của cùng một cái vô ích.

Ngưỡng là **20 lần sửa cùng một tệp trong một phiên** — cao hơn nhiều so với việc thật (một tập
được sửa 8–15 lần là bình thường), và chỉ nhắm vào cái bệnh đang chảy máu. Khi chặn, thông điệp
nói đúng cách làm đúng: **gom các sửa vào một lần** bằng `tools/replace.py --batch`, công cụ đã có
sẵn trong thư viện và ghi tệp nguyên tử.

    python3 tools/hook_edit_count.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import sys
import time

STATE = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'lemo-edit-counts.json')
LIMIT = 20        # chặn từ lần sửa thứ LIMIT+1 của cùng một tệp trong một phiên
WINDOW = 14400    # quên tệp đã sửa quá 4 giờ trước đó (một phiên dài có thể làm lại từ đầu)

MESSAGE = (
    'Bạn đã sửa %s %d lần trong phiên này. Mỗi lượt sửa là một lượt của phiên, và mỗi lượt trả lại '
    '**toàn bộ ngữ cảnh** — đây là cách tốn kém nhất mà một phiên làm phim tốn tiền (đo được: một '
    'tệp bị sửa 65 lần trong một phiên).\n'
    'Cách làm đúng: **gom các sửa của một tệp vào một lần**. Thư viện có sẵn công cụ cho việc đó:\n'
    '  python3 tools/replace.py %s --batch edits.json\n'
    'trong đó `edits.json` là một danh sách `{"old": ..., "new": ..., "count": 1}`; công cụ đếm số '
    'lần khớp và **không ghi gì cả** nếu không khớp đúng số lần nó nói. Bản sửa dài hơn vài dòng thì '
    'viết ra một tệp rồi dùng `--batch -` để đọc từ stdin.\n'
    'Nếu bản sửa quá dài để gom, hãy sửa hết một lần bằng công cụ, rồi đọc lại **một đoạn** '
    '(Read với `offset`/`limit`) để kiểm tra — đọc cả tệp sẽ bị chặn.\n')


def decide(path, session, state, now=None):
    """(mã thoát, thông điệp) cho một lần sửa tệp."""
    if not path:
        return 0, ''
    now = now if now is not None else time.time()
    seen = state.setdefault(session, {})
    first, count = seen.get(path, (now, 0))
    if now - first > WINDOW:
        first, count = now, 0
    count += 1
    seen[path] = (first, count)
    if count <= LIMIT:
        return 0, ''
    return 2, MESSAGE % (path, count, path)


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
        data = json.loads(sys.stdin.read())
    except ValueError:
        return 0
    ti = data.get('tool_input') or {}
    path = ti.get('file_path') or ''
    session = data.get('session_id') or 'default'
    state = load_state()
    rc, message = decide(path, session, state)
    if path:
        save_state(state)
    if rc != 0:
        sys.stderr.write(message)
    return rc


def selftest():
    state = {}
    path = '/tmp/lemo-episodes/tap/src/film.js'
    # LIMIT lần sửa thì còn cho qua
    for i in range(LIMIT):
        rc, msg = decide(path, 's1', state)
        assert rc == 0, (i, rc)
    print('ok   %d lần sửa cùng một tệp → rc=0 (cho qua)' % LIMIT)
    # lần sửa thứ LIMIT+1 thì chặn
    rc, msg = decide(path, 's1', state)
    assert rc == 2, rc
    assert 'replace.py' in msg and '--batch' in msg, msg
    print('ok   lần sửa thứ %d → rc=2, thông điệp nói gom sửa bằng replace.py --batch' % (LIMIT + 1))
    # phiên khác: bộ đếm riêng
    rc, _ = decide(path, 's2', state)
    assert rc == 0, rc
    print('ok   phiên khác → rc=0')
    # tệp khác: bộ đếm riêng
    rc, _ = decide('/tmp/lemo-episodes/tap/src/set.js', 's1', state)
    assert rc == 0, rc
    print('ok   tệp khác → rc=0')
    # quá cửa sổ thời gian thì đếm lại
    state['s1'][path] = (time.time() - WINDOW - 10, 99)
    rc, _ = decide(path, 's1', state)
    assert rc == 0, rc
    print('ok   quá cửa sổ thời gian → rc=0')
    # không có đường dẫn thì không chặn
    rc, _ = decide('', 's1', state)
    assert rc == 0, rc
    print('ok   không có đường dẫn → rc=0')
    print('6 ca đều đúng')
    return 0


if __name__ == '__main__':
    sys.exit(main())
