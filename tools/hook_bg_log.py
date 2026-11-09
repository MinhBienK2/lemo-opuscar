"""Chặn vòng dò: đọc lại tệp log của chính job nền mình tạo ra.

Claude Code gọi hook này **trước** mỗi lần chạy lệnh `Bash` (PreToolUse). Đầu vào là JSON trên
stdin; đầu ra là mã thoát:

- `0` — cho qua (không in gì);
- `2` — **chặn** lệnh này, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Một vòng chấm dài chạy nền thì harness đã mang output về cho phiên rồi. Nhưng
phiên tập 02 đã chuyển output của job nền ra tệp của riêng mình (`> /tmp/round_props.log`) rồi
**đọc lại tệp đó 34 lần trong 70 phút** — mỗi lần kèm `date` và `ps -o etime=` để xem vòng chấm
còn sống không. Đó không phải làm việc, đó là một vòng dò ăn hết lượt của phiên (luật R5b trong
`CODING_STANDARDS.md`).

Nên luật ở đây là **đếm**: lần đọc thứ 3 trở đi của *cùng một tệp log* trong cùng một phiên thì
chặn, kèm lời nhắc đúng cách làm thay thế. Lần 1 và lần 2 thì cho qua — đọc log một lần sau khi
job xong là việc bình thường, không phải lỗi.

Cách dùng thay thế, in trong lời nhắc: chạy job nền **không** có `>` (harness mang output về), rồi
đọc output đó **một lần** lúc harness báo xong.

    python3 tools/hook_bg_log.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import re
import sys
import time

STATE = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'lemo-bglog-reads.json')
LIMIT = 3          # chặn từ lần đọc thứ 3 trở đi của cùng một tệp
WINDOW = 7200      # quên tệp đã đọc quá 2 giờ trước đó (phiên dài, tệp cũ không còn liên quan)

# đọc một tệp log: `cat /tmp/x.log`, `tail -20 /tmp/x.log`, `head -n 5 …`, `grep … /tmp/x.log`
READ = re.compile(
    r'\b(?:cat|tail|head|less|more|grep|rg|awk|sed)\b[^|;&]*'
    # đường dẫn phải bắt đầu ở đầu một đoạn đường dẫn: không được bắt giữa chừng
    r'(?<![/\w])(?P<path>(?:/[\w.\-]+)+\.log)\b')

MESSAGE = (
    'Bạn đã đọc tệp log %s %d lần trong phiên này. Đọc lại một tệp mà job nền không ghi vào nữa '
    'là vòng dò, không phải việc (luật R5b): mỗi lần đọc lại tiêu tốn một lượt của phiên mà không '
    'thay đổi được gì.\n'
    'Cách làm đúng: chạy job nền mà KHÔNG chuyển output ra tệp của riêng mình '
    '(bỏ `> /tmp/....log 2>&1`), để harness mang output về và đọc output đó MỘT lần lúc harness '
    'báo xong. Nếu cần nhật ký lâu dài thì để chính công cụ ghi nó ra '
    '(ví dụ `review.sh` ghi `review/PROPS-REVIEW.md`).\n')


def paths_in(command):
    """Các tệp log mà lệnh này đọc."""
    out = []
    for m in READ.finditer(command or ''):
        p = m.group('path')
        if p not in out:
            out.append(p)
    return out


def decide(command, session, state):
    """(mã thoát, thông điệp) cho một lệnh. `state` là dict phiên → {đường dẫn: (lần đầu, số lần)}."""
    paths = paths_in(command)
    if not paths:
        return 0, ''
    now = time.time()
    seen = state.setdefault(session, {})
    blocked = None
    for p in paths:
        first, count = seen.get(p, (now, 0))
        if now - first > WINDOW:          # quá cửa sổ thời gian: coi như lần đầu
            first, count = now, 0
        count += 1
        seen[p] = (first, count)
        if count >= LIMIT and blocked is None:
            blocked = (p, count)
    if blocked is None:
        return 0, ''
    p, count = blocked
    return 2, MESSAGE % (p, count)


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
    command = ((data.get('tool_input') or {}).get('command')) or ''
    session = data.get('session_id') or 'default'
    state = load_state()
    rc, message = decide(command, session, state)
    if rc != 0 or paths_in(command):
        save_state(state)
    if rc != 0:
        sys.stderr.write(message)
    return rc


def selftest():
    cases = [
        ('cat /tmp/round_props.log', ['/tmp/round_props.log']),
        ('tail -20 /tmp/round_storyboard.log; echo x', ['/tmp/round_storyboard.log']),
        ('grep -n foo /tmp/a.log', ['/tmp/a.log']),
        ('ls -l /tmp/out.mp4', []),
        ('sh review.sh <tap> --props', []),
        ('cat /tmp/lemo-review-abc/blind/BLIND.md', []),
    ]
    for cmd, want in cases:
        got = paths_in(cmd)
        assert got == want, (cmd, got, want)
        print('ok   đọc %-44s → %s' % (cmd[:44], got))
    state = {}
    for i in range(3):
        rc, msg = decide('cat /tmp/x.log', 's1', state)
        assert rc == (0 if i < 2 else 2), (i, rc)
        assert (msg != '') == (rc != 0)
        print('ok   lần đọc %d của cùng tệp → rc=%d' % (i + 1, rc))
    rc, _ = decide('cat /tmp/x.log', 's2', state)
    assert rc == 0, rc
    print('ok   phiên khác → rc=0')
    rc, _ = decide('cat /tmp/y.log', 's1', state)
    assert rc == 0, rc
    print('ok   tệp khác → rc=0')
    state['s1']['/tmp/x.log'] = (time.time() - WINDOW - 10, 99)
    rc, _ = decide('cat /tmp/x.log', 's1', state)
    assert rc == 0, rc
    print('ok   quá cửa sổ thời gian → rc=0')
    print('%d ca đều đúng' % (len(cases) + 6))
    return 0


if __name__ == '__main__':
    sys.exit(main())
