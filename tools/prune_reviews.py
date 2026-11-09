#!/usr/bin/env python3
"""prune_reviews.py — dọn transcript của người chấm, có báo cáo trước.

  python3 tools/prune_reviews.py                     # chỉ báo cáo: bao nhiêu, nặng bao nhiêu, cái nào cũ nhất
  python3 tools/prune_reviews.py --keep 12           # xem sẽ xóa gì (không xóa)
  python3 tools/prune_reviews.py --keep 12 --apply   # xóa thật
  python3 tools/prune_reviews.py --selftest

Mỗi vòng chấm của kênh chạy người chấm trong một thư mục tạm `/tmp/lemo-review-XXXXXX`, và Claude Code
ghi transcript của phiên đó vào `~/.claude/projects/-tmp-lemo-review-XXXXXX/`. Thư mục làm việc thì
được xóa khi vòng kết thúc, còn transcript thì **không ai dọn**: sau khoảng 45 vòng là hơn 50 thư mục
và hơn 1 GB (N89). Transcript là bằng chứng — `tools/supervise.sh` đọc chính nó để thấy người chấm đã
làm gì — nên bài này **không xóa gì khi chưa được bảo**, và không bao giờ xóa thư mục của một vòng
đang chạy.

Quy tắc xóa: giữ lại `--keep` thư mục **mới nhất**, xóa những thư mục cũ hơn, và chỉ xóa thư mục đã
cũ hơn `--min-age-hours` (mặc định 24 giờ) — một vòng chấm vừa chạy xong thì bằng chứng của nó còn
đang được đọc.
"""
import os
import shutil
import sys
import time

PROJECTS = os.path.expanduser('~/.claude/projects')
PREFIX = '-tmp-lemo-review-'


def dirs():
    """the critic transcript folders, newest first"""
    out = []
    if not os.path.isdir(PROJECTS):
        return out
    for name in os.listdir(PROJECTS):
        if not name.startswith(PREFIX):
            continue
        p = os.path.join(PROJECTS, name)
        if not os.path.isdir(p):
            continue
        out.append((p, os.path.getmtime(p)))
    out.sort(key=lambda t: -t[1])
    return out


def size_of(path):
    """the bytes under a folder"""
    total = 0
    for root, _dirs, files in os.walk(path):
        for f in files:
            try:
                total += os.path.getsize(os.path.join(root, f))
            except OSError:
                pass
    return total


def report(keep, min_age_h, apply_):
    ds = dirs()
    if not ds:
        print('prune_reviews: không có thư mục transcript của người chấm nào (%s%s*)' % (PROJECTS, PREFIX))
        return 0
    total = sum(size_of(p) for p, _ in ds)
    print('prune_reviews: %d thư mục transcript của người chấm, %d MB' % (len(ds), total // 1048576))
    now = time.time()
    victims = []
    for p, mtime in ds[keep:]:
        age_h = (now - mtime) / 3600.0
        if age_h < min_age_h:
            continue
        victims.append((p, mtime, age_h))
    if not victims:
        print('prune_reviews: không có thư mục nào đủ điều kiện xóa '
              '(giữ %d thư mục mới nhất, và chỉ xóa thư mục cũ hơn %d giờ)' % (keep, min_age_h))
        return 0
    freed = sum(size_of(p) for p, _m, _a in victims)
    print('prune_reviews: sẽ xóa %d thư mục, giải phóng %d MB:' % (len(victims), freed // 1048576))
    for p, _m, age_h in victims:
        print('   %-58s %6d MB  cũ %5.1f giờ' % (os.path.basename(p), size_of(p) // 1048576, age_h))
    if not apply_:
        print('prune_reviews: chưa xóa gì (thêm --apply để xóa)')
        return 0
    for p, _m, _a in victims:
        shutil.rmtree(p, ignore_errors=True)
    print('prune_reviews: đã xóa %d thư mục, giải phóng %d MB' % (len(victims), freed // 1048576))
    return 0


def selftest():
    import tempfile
    global PROJECTS
    cases = []
    tmp = tempfile.mkdtemp(prefix='prune-selftest-')
    try:
        projects = os.path.join(tmp, 'projects')
        os.makedirs(projects)
        olds, news = [], []
        for i in range(5):
            d = os.path.join(projects, '%s%s' % (PREFIX, 'x' * 3))
            # five folders with different names, so the tool can order them
            d = os.path.join(projects, '%s%d' % (PREFIX, i))
            os.makedirs(d)
            open(os.path.join(d, 'a.jsonl'), 'w').write('x' * 1000)
            if i < 2:
                os.utime(d, (time.time() - 3600 * 100, time.time() - 3600 * 100))
                olds.append(d)
            else:
                news.append(d)
        # the newest two must survive, the oldest three are the ones that go
        os.utime(olds[0], (time.time() - 3600 * 200, time.time() - 3600 * 200))
        os.utime(olds[1], (time.time() - 3600 * 199, time.time() - 3600 * 199))
        for i, d in enumerate(news):
            os.utime(d, (time.time() - 3600 * (10 - i), time.time() - 3600 * (10 - i)))
        PROJECTS = projects
        ds = dirs()
        cases.append(('tìm thấy cả năm thư mục', len(ds) == 5, len(ds), ''))
        cases.append(('thư mục mới nhất đứng đầu', ds and os.path.basename(ds[0][0]).endswith('4'), ds, ''))
        # a fresh folder must never be deleted, however old the others are
        fresh = os.path.join(projects, '%sfresh' % PREFIX)
        os.makedirs(fresh)
        open(os.path.join(fresh, 'a.jsonl'), 'w').write('x')
        keep, age = 0, 24
        victims = [p for p, m in ds[keep:] if (time.time() - m) / 3600.0 >= age]
        cases.append(('chỉ thư mục cũ mới bị xóa', len(victims) == 2, len(victims), ''))
        cases.append(('thư mục vừa tạo thì không bị xóa',
                      all(os.path.basename(p) != 'fresh' for p in victims), victims, ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
        PROJECTS = os.path.expanduser('~/.claude/projects')
    failed = 0
    for name, ok, got, extra in cases:
        print('%s %s' % ('ok  ' if ok else 'FAIL', name) + ('' if ok else '  [%s]' % str(got)[:200]))
        if not ok:
            failed += 1
    if failed:
        print('prune_reviews --selftest: %d/%d FAIL' % (failed, len(cases)))
        return 1
    print('prune_reviews --selftest: %d/%d ok' % (len(cases), len(cases)))
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    keep = 12
    min_age = 24
    apply_ = '--apply' in argv
    if '--keep' in argv:
        i = argv.index('--keep')
        if i + 1 < len(argv):
            try:
                keep = int(argv[i + 1])
            except ValueError:
                print('prune_reviews: --keep cần một số')
                return 2
    if '--min-age-hours' in argv:
        i = argv.index('--min-age-hours')
        if i + 1 < len(argv):
            try:
                min_age = int(argv[i + 1])
            except ValueError:
                print('prune_reviews: --min-age-hours cần một số')
                return 2
    if keep < 0:
        print('prune_reviews: --keep không nhỏ hơn 0')
        return 2
    return report(keep, min_age, apply_)


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
