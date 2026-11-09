"""Chặn việc đọc lại một tệp lớn mà tệp đó không hề đổi.

Claude Code gọi hook này **trước** mỗi lần dùng công cụ `Read` (PreToolUse). Đầu vào là JSON trên
stdin; đầu ra là mã thoát:

- `0` — cho qua;
- `2` — **chặn** lần đọc này, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Đọc cả một tệp hai trăm kilobyte để tìm đúng một hàm là mua không được gì: tệp lớn
mỗi lần đọc lại là hàng chục nghìn token, và đội hình cảu một phiên dài (luật R11 trong
`CODING_STANDARDS.md`). Phiên tập 02 đọc lại `src/film.js` **46 lần**, `src/props.js` 27 lần,
`src/set.js` 21 lần; phiên tập 03 đọc lại `src/props.js` 30 lần. Cả hai đều đã có `src/MAP.md`
(tên hàm → dòng) — nhưng bản đồ thì bị bỏ quên khi mã đổi.

Luật ở đây là **mtime**: đọc lại một tệp mà tệp **không đổi** thì lần đọc đó không mang tin mới
gì, nên từ lần thứ ba trở đi thì chặn. Đọc lại sau khi vừa sửa tệp thì mtime đã đổi, nên vẫn
được phép — đó là việc bình thường.

Ngưỡng kích thước là **8 KB**, không phải 40 KB: những tệp bị đọc lại nhiều nhất trong các tập
trước có cả tệp 14–23 KB (`src/film.js` của tập 04 là 23 KB, `src/props.js` 17 KB) — một ngưỡng
40 KB đã bỏ sót chúng, và bỏ sót thì guard vô dụng đúng ở chỗ cần nó nhất. Dưới 8 KB thì một
lần đọc rẻ đến mức lời nhắc "dùng grep" là vô nghĩa.

Lời nhắc trong lời cảnh báo nói cách làm đúng: `grep -n "<tên hàm>" <tệp>` rồi đọc đúng đoạn
(`offset`/`limit`), và giữ `src/MAP.md` bên cạnh mã.

**Ảnh là một trường hợp riêng.** Một lần mở ảnh tốn ~1 MB ngữ cảnh, và người chấm hình mở lại
đúng một tờ sheet 13–17 lần trong một vòng (tập 01) — nên chặn cả ảnh là đúng (luật R12). Nhưng
lời nhắc "dùng `grep`" với một tấm ảnh là vô nghĩa, nên ảnh có lời nhắc riêng.

    python3 tools/hook_stale_read.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import re
import sys
import time

STATE = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'lemo-stale-reads.json')
LIMIT = 3          # chặn từ lần đọc thứ 3 của cùng một tệp khi tệp không đổi
WINDOW = 7200      # quên tệp đã đọc quá 2 giờ trước đó
BIG = 8 * 1024     # tệp nhỏ hơn thì đọc cả cũng được

MESSAGE = (
    'Bạn đã đọc tệp %s %d lần mà tệp không đổi (mtime %s). Lần đọc thứ %d không mang tin mới gì, '
    'mà mỗi lần đọc cả tệp là hàng chục nghìn token của phiên bạn (luật R11).\n'
    'Cách làm đúng: `grep -n "<tên hàm>" %s` rồi đọc đúng đoạn cần (Read với `offset`/`limit`); '
    'và giữ `src/MAP.md` (tên hàm → dòng) bên cạnh mã — `python3 tools/check_map.py <tập>` kiểm tra nó.\n')

IMAGE_MESSAGE = (
    'Bạn đã mở ảnh %s %d lần mà ảnh không đổi. Mỗi lần mở ảnh là ~1 MB ngữ cảnh, và lần mở thứ ba '
    'trở đi không thấy gì mới (luật R12: mỗi ảnh riêng chỉ mở một lần).\n'
    'Cách làm đúng: nhìn **tờ sheet** trước để quyết định cả phim; chỉ mở ảnh riêng cho câu có cờ máy, '
    'câu phủ dưới 15 %%, hoặc câu bạn nghi ngờ. Muốn xem lại cùng một ảnh thì dùng công cụ xem ảnh '
    'của riêng bạn, đừng mở lại vào ngữ cảnh.\n')


def mtime_of(path):
    try:
        return os.path.getmtime(path)
    except OSError:
        return None


def is_image(path):
    """Ảnh thì lời nhắc phải khác: `grep` không áp dụng cho một tấm ảnh."""
    return os.path.splitext(path)[1].lower() in ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp')


def decide(path, session, state, now=None, ranged=False):
    """(mã thoát, thông điệp) cho một lần đọc tệp.

    `ranged` = lần đọc có `offset`/`limit`, tức đọc **một đoạn** — đó là cách làm đúng, nên nó
    không bị đếm và không bị chặn. Chỉ lần đọc **cả tệp** mới tiêu token và mới bị đếm.
    """
    if not path:
        return 0, ''
    if ranged:
        return 0, ''
    now = now if now is not None else time.time()
    mt = mtime_of(path)
    if mt is None:          # tệp không tồn tại (đã bị xoá): không chặn
        return 0, ''
    try:
        size = os.path.getsize(path)
    except OSError:
        return 0, ''
    if size < BIG:          # tệp nhỏ: đọc cả cũng rẻ, không chặn
        return 0, ''
    seen = state.setdefault(session, {})
    first, last_mt, count = seen.get(path, (now, mt, 0))
    if now - first > WINDOW:
        first, count = now, 0
    if last_mt != mt:       # tệp đã đổi: đọc lại là việc, không phải lãng phí
        seen[path] = (first, mt, 1)
        return 0, ''
    count += 1
    seen[path] = (first, mt, count)
    if count < LIMIT:
        return 0, ''
    if is_image(path):
        return 2, IMAGE_MESSAGE % (path, count)
    return 2, MESSAGE % (path, count, time.strftime('%H:%M:%S', time.localtime(mt)), count, path)


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
    # đọc một đoạn (offset/limit) là cách làm đúng: không đếm, không chặn
    ranged = ('offset' in ti) or ('limit' in ti)
    state = load_state()
    rc, message = decide(path, session, state, ranged=ranged)
    if path:
        save_state(state)
    if rc != 0:
        sys.stderr.write(message)
    return rc


def selftest():
    import tempfile
    big = None
    small = None
    try:
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
            f.write('x' * (BIG + 500))
            big = f.name
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
            f.write('x' * 1000)
            small = f.name
        state = {}
        # lần 1, 2 cho qua; lần 3 chặn (tệp lớn, không đổi)
        for i in range(3):
            rc, msg = decide(big, 's1', state)
            assert rc == (0 if i < 2 else 2), (i, rc)
            assert (msg != '') == (rc != 0)
            print('ok   lần đọc %d của tệp lớn không đổi → rc=%d' % (i + 1, rc))
        # sửa tệp → mtime đổi → đọc lại được phép
        time.sleep(0.01)
        with open(big, 'w') as f:
            f.write('y' * (BIG + 600))
        rc, _ = decide(big, 's1', state)
        assert rc == 0, rc
        print('ok   tệp vừa đổi → rc=0 (đọc lại là việc)')
        # phiên khác
        rc, _ = decide(big, 's2', state)
        assert rc == 0, rc
        print('ok   phiên khác → rc=0')
        # tệp không tồn tại
        rc, _ = decide('/tmp/khong-ton-tai-xyz.js', 's1', state)
        assert rc == 0, rc
        print('ok   tệp không tồn tại → rc=0')
        # quá cửa sổ thời gian
        state['s1'][big] = (time.time() - WINDOW - 10, os.path.getmtime(big), 99)
        rc, _ = decide(big, 's1', state)
        assert rc == 0, rc
        print('ok   quá cửa sổ thời gian → rc=0')
        # tệp nhỏ thì cho qua luôn
        state2 = {}
        for i in range(5):
            rc, _ = decide(small, 's3', state2)
            assert rc == 0, rc
        print('ok   tệp nhỏ → rc=0')
        # đọc một đoạn (offset/limit) thì không bị đếm, không bị chặn
        state3 = {}
        for i in range(6):
            rc, _ = decide(big, 's4', state3, ranged=True)
            assert rc == 0, rc
        print('ok   đọc đoạn (offset/limit) → rc=0 (không bị đếm)')
        # ảnh: vẫn chặn lần thứ ba, nhưng lời nhắc phải nói về ảnh chứ không nói "dùng grep"
        img = None
        try:
            with tempfile.NamedTemporaryFile('wb', suffix='.jpg', delete=False) as f:
                f.write(b'x' * (BIG + 500))
                img = f.name
            state4 = {}
            for i in range(3):
                rc, msg = decide(img, 's5', state4)
                assert rc == (0 if i < 2 else 2), (i, rc)
            assert 'ảnh' in msg and 'grep' not in msg, msg
            print('ok   ảnh mở lại lần thứ 3 → rc=2, lời nhắc nói về ảnh (không nói "grep")')
        finally:
            if img:
                try:
                    os.unlink(img)
                except OSError:
                    pass
    finally:
        for p in (big, small):
            try:
                os.unlink(p)
            except OSError:
                pass
    print('%d ca đều đúng' % 10)
    return 0


if __name__ == '__main__':
    sys.exit(main())
