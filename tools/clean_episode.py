"""Dọn một tập đã bàn giao, và để lại dấu vết.

    python3 tools/clean_episode.py <tập> [--dry-run] [--yes]

Đĩa của máy này chậm, và một lần dựng để lại ~1,1 GB trung gian trong `out/`. Nên có lúc phải dọn.

**Vì sao có công cụ này.** Ngày 12-11 lúc 02:35, phim của `do-vat/tap-02` biến mất khỏi thư mục
tập, và không ai để lại dấu vết: không ai biết nó là do một lần dọn tay hay do một lần dựng hỏng.
Người dọn thì nhớ là mình dọn — nhưng người đọc báo cáo thì không có cách nào biết. Một phim biến
mất không để lại dấu vết là lỗi của công cụ, không phải lỗi của người.

Nên công cụ này làm ba việc:

  - **chỉ xoá thứ dựng lại được** (`out/video.mp4`, `out/scratch/`, `out/sbx/`, `voice/.cache/`),
    và **không bao giờ** chạm vào thư mục gốc của tập — nơi có phim đã bàn giao, mã nguồn, dàn ý;
  - **để lại dấu vết**: ghi vào `out/cleaned.log` giờ, những gì đã xoá, và dung lượng lấy lại;
  - **từ chối chạy** nếu tập chưa có phim nào ở thư mục gốc, vì lúc đó `out/` có thể đang là
    nơi làm việc của một lần dựng đang chạy.

Mặc định công cụ chỉ **báo** những gì nó sẽ xoá; cần `--yes` thì mới xoá.
"""
import os
import shutil
import sys
import time

# Những thứ dựng lại được: build.sh tạo ra chúng, và dựng lại tạo ra chúng y hệt.
REGENERABLE = [
    ('out/video.mp4', 'trung gian chỉ có hình, 1,1 GB mỗi tập; phim đã ghép xoá rồi'),
    ('out/scratch', 'trang dựng thử và ghi chú tạm'),
    ('out/sbx', 'bộ nhớ đệm dựng'),
    ('voice/.cache', 'bộ nhớ đệm giọng đọc'),
]


def size_of(path):
    if os.path.isfile(path):
        return os.path.getsize(path)
    total = 0
    for root, _dirs, files in os.walk(path):
        for f in files:
            try:
                total += os.path.getsize(os.path.join(root, f))
            except OSError:
                pass
    return total


def films(ep):
    """những phim ở thư mục gốc của tập — thứ mà công cụ này không bao giờ xoá"""
    out = []
    try:
        for n in sorted(os.listdir(ep)):
            if n.endswith('.mp4') and os.path.isfile(os.path.join(ep, n)):
                out.append(n)
    except OSError:
        pass
    return out


def candidates(ep):
    """[(đường dẫn tuyệt đối, mô tả, dung lượng)] — những thứ sẽ xoá"""
    out = []
    for rel, why in REGENERABLE:
        p = os.path.join(ep, rel)
        if os.path.exists(p):
            out.append((p, rel, why, size_of(p)))
    return out


def clean(ep, yes=False):
    ep = os.path.abspath(ep)
    if not os.path.isdir(ep):
        print(f'clean: không có thư mục tập: {ep}', file=sys.stderr)
        return 2
    got = films(ep)
    if not got:
        # chưa có phim ở thư mục gốc: out/ có thể là nơi làm việc của một lần dựng đang chạy
        print('clean: tập này chưa có phim nào ở thư mục gốc — dọn lúc này có thể xoá tài liệu của '
              'một lần dựng đang chạy. Dừng lại.', file=sys.stderr)
        return 1
    cands = candidates(ep)
    if not cands:
        print('clean: không có gì để dọn.')
        return 0
    print(f'clean: {ep}')
    print(f'  phim ở thư mục gốc (không đụng vào): {", ".join(got)}')
    total = 0
    for p, rel, why, sz in cands:
        print(f'  sẽ xoá {rel} — {why} — {sz/1e6:.1f} MB')
        total += sz
    if not yes:
        print(f'  tổng {total/1e6:.1f} MB. Thêm --yes để xoá.')
        return 0
    log = os.path.join(ep, 'out', 'cleaned.log')
    os.makedirs(os.path.dirname(log), exist_ok=True)
    with open(log, 'a', encoding='utf-8') as f:
        f.write(f'\n=== {time.strftime("%Y-%m-%d %H:%M")} · dọn {ep}\n')
        for p, rel, why, sz in cands:
            f.write(f'  xoá {rel} — {why} — {sz} byte\n')
        f.write(f'  lấy lại {total} byte\n')
    for p, rel, why, sz in cands:
        if os.path.isdir(p):
            shutil.rmtree(p, ignore_errors=True)
        else:
            try:
                os.remove(p)
            except OSError:
                pass
    print(f'  đã xoá. Lấy lại {total/1e6:.1f} MB. Dấu vết: {os.path.relpath(log, ep)}')
    return 0


def selftest():
    import tempfile
    tmp = tempfile.mkdtemp(prefix='clean-')
    ok = True

    def expect(cond, what):
        nonlocal ok
        print(('ok   ' if cond else 'FAIL ') + what)
        ok = ok and cond

    try:
        ep = os.path.join(tmp, 'tap')
        os.makedirs(os.path.join(ep, 'out', 'scratch'))
        os.makedirs(os.path.join(ep, 'src'))
        os.makedirs(os.path.join(ep, 'voice', '.cache'))
        open(os.path.join(ep, 'out', 'video.mp4'), 'w').write('x' * 1000)
        open(os.path.join(ep, 'out', 'scratch', 'a.txt'), 'w').write('y')
        open(os.path.join(ep, 'src', 'film.js'), 'w').write('//')
        expect(clean(ep) == 1, 'an episode with no film in the root is refused')
        open(os.path.join(ep, 'phim.mp4'), 'w').write('z')
        expect(clean(ep) == 0, 'without --yes nothing is deleted')
        expect(os.path.isfile(os.path.join(ep, 'out', 'video.mp4')), 'the intermediate is still there')
        expect(clean(ep, yes=True) == 0, 'with --yes it deletes')
        expect(not os.path.exists(os.path.join(ep, 'out', 'video.mp4')), 'the intermediate is gone')
        expect(not os.path.exists(os.path.join(ep, 'out', 'scratch')), 'the scratch folder is gone')
        expect(os.path.isfile(os.path.join(ep, 'src', 'film.js')), 'the source is untouched')
        expect(os.path.isfile(os.path.join(ep, 'phim.mp4')), 'the delivered film is untouched')
        log = open(os.path.join(ep, 'out', 'cleaned.log'), encoding='utf-8').read()
        expect('video.mp4' in log and 'lấy lại' in log, 'a trace is left: what was removed and how much')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('clean selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    args = [a for a in sys.argv[1:] if a != '--yes']
    sys.exit(clean(args[0] if args else '.', '--yes' in sys.argv))
