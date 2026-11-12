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
TOTAL = 10         # chặn từ lần đọc thứ 10 của cùng một tệp trong cả phiên — kể cả khi tệp vừa được sửa
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

TOTAL_MESSAGE = (
    'Bạn đã đọc tệp %s %d lần trong phiên này. Lần đọc gần nhất là sau lần **sửa của chính bạn**, '
    'nên nó không mang gì mới: nội dung tệp đó nằm trong ngữ cảnh của bạn rồi. Mỗi lần đọc cả tệp '
    'là hàng chục nghìn token của phiên (luật R11).\n'
    'Cách làm đúng: đọc **đúng đoạn** cần (Read với `offset`/`limit`) hoặc `grep -n "<tên hàm>" %s`; '
    'và giữ `src/MAP.md` (tên hàm → dòng) bên cạnh mã — `python3 tools/check_map.py <tập>` kiểm tra nó.\n')


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
    rec = seen.get(path)
    if rec is None:
        first, last_mt, count, total = now, mt, 0, 0
    elif len(rec) == 4:
        first, last_mt, count, total = rec
    else:                       # state cũ, chỉ có ba số
        first, last_mt, count = rec
        total = count
    if now - first > WINDOW:
        first, count, total = now, 0, 0
    total += 1
    changed = (last_mt != mt)     # tệp đã đổi: đọc lại là việc, không phải lãng phí
    count = 1 if changed else count + 1
    seen[path] = (first, mt, count, total)
    # Tệp bị đọc lại nhiều nhất trong các phiên đo được là **tệp vừa sửa** — mà tệp vừa sửa thì
    # mtime đã đổi, nên luật "tệp không đổi" không bao giờ bắt được nó. Nên có thêm một luật: đọc
    # cả tệp quá TOTAL lần trong một phiên thì chặn, bất kể tệp có đổi hay không (M26).
    if total > TOTAL:
        return 2, TOTAL_MESSAGE % (path, total, path)
    if changed:
        return 0, ''
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
        # M26: tệp VỪA SỬA thì luật "tệp không đổi" không bắt được — nhưng đọc lại tệp vừa sửa
        # cũng không mang gì mới, nên có thêm luật: đọc cả tệp quá TOTAL lần trong một phiên thì chặn
        state5 = {}
        for i in range(TOTAL):
            time.sleep(0.001)
            with open(big, 'a') as f:
                f.write('\n// sửa\n')
            rc, _ = decide(big, 's6', state5)
            assert rc == 0, (i, rc)
        print('ok   %d lần đọc (mỗi lần sau một lần sửa) → rc=0' % TOTAL)
        rc, msg = decide(big, 's6', state5)
        assert rc == 2, rc
        assert 'vừa sửa' in msg or 'sửa của chính bạn' in msg, msg
        print('ok   lần đọc thứ %d (dù tệp vừa được sửa) → rc=2' % (TOTAL + 1))
        # M26: hai tập khác nhau có cùng một tên tệp (src/film.js) — bộ đếm phải tính theo ĐƯỜNG DẪN
        # ĐẦY ĐỦ, nếu không thì phiên làm ba tập sẽ bị chặn oang vì tệp của tập này.
        other = None
        try:
            with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, dir=os.path.dirname(big)) as f:
                f.write('x' * (BIG + 500))
                other = f.name
            state6 = {}
            for i in range(TOTAL + 2):
                with open(big, 'a') as f:
                    f.write('\n// sửa\n')
                rc, _ = decide(big, 's7', state6)
            assert rc == 2, rc
            rc, _ = decide(other, 's7', state6)
            assert rc == 0, rc
            print('ok   cùng tên tệp ở tập khác → bộ đếm riêng (đường dẫn đầy đủ)')
        finally:
            if other:
                try:
                    os.unlink(other)
                except OSError:
                    pass
    finally:
        for p in (big, small):
            try:
                os.unlink(p)
            except OSError:
                pass
    print('%d ca đều đúng' % 13)
    return 0


if __name__ == '__main__':
    sys.exit(main())
