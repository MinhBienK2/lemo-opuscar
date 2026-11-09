#!/usr/bin/env python3
"""Kiểm tra bản chấm vật: mỗi vật có đúng một dòng phán quyết, và mỗi dòng nói rõ ảnh cho thấy gì.

    python3 props_report_check.py <tập> <bản-chấm.md> <BLIND.md> <số vật>

Vì sao có: vòng chấm vật là nơi giữ lời hứa của kênh — "mọi vật có thật phải dựng đúng là nó,
nhìn một giây là biết". Nhưng người chấm không đọc ảnh một mình: nó đọc ảnh VÀ đọc lời của người
đoán mù. Ở tập tap-01 (09-11) người đoán mù gọi một lưới sợi đan là "đống lọ thuỷ tinh" và một
bàn tay là "bàn chân", người chấm lấy đúng lời đó để phán HỎNG, và vòng FAIL vì hai vật đang
đúng bị đòi sửa. Người đọc bản chấm không có cách nào biết điều đó: dòng phán quyết chỉ có
tên của người đoán mù, không có lời của chính người chấm.

Nên bản chấm phải có hai điều, và công cụ này kiểm tra đúng hai điều đó:

1. **Mỗi vật có đúng một dòng phán quyết.** Một vật không có dòng nào là một vật chưa ai
   chấm — phim đi ra với nó mà không ai nhìn. Đây là lỗi chặn vòng.
2. **Mỗi dòng nói ảnh cho thấy gì** ("ảnh cho thấy: …"). Không có nó thì dòng chỉ là lời của
   người đoán mù được ghi lại, và không ai kiểm tra được. Đây là ghi chú, không chặn: người
   chấm có thể quên mà vẫn nói đúng.

Và một điều nữa, chỉ để in ra: **số trong BLIND.md có đáng tin không.** Người đoán mù tự đánh
số dòng của nó, nên số của nó có thể lệch với số của file ảnh (tập tap-01: mục #20 và #21 bị
hoán đổi, mục #25 thiếu hẳn). Khi dòng nào có tên file (`(p_20.jpg)`) thì tên file là sự thật,
và số trên dòng được sửa lại theo nó; khi không có tên file thì số trên dòng được giữ, và
bản chấm phải nói rõ là các số ấy không đáng tin.

Exit code: 0 khi không có lỗi chặn; 1 khi có vật chưa ai chấm (hoặc có dòng thừa/lặp); 2 khi
thiếu đối số.
"""
import os
import re
import sys

# "#20 mặt nước cận có gợn sóng — B — HỎNG — ảnh cho thấy: …"
VERDICT = re.compile(r'^#(\d+)\s+(.+?)\s+—\s+([AB])\s+—\s+(KHỚP|HỎNG)\b')
# "#20 (p_20.jpg) TÊN: …" — tên file là sự thật, số trên dòng có thể lệch
BLIND = re.compile(r'^#(\d+)\s*(?:\((p_\d+\.jpg)\)\s*)?TÊN:')
# the section the round appends: the blind names, not the verdicts
BLIND_HEADING = re.compile(r'^##\s+Người xem không biết tên đã gọi', re.M)


def verdict_lines(text):
    """the verdict part only: the blind names appended after the heading are not verdicts"""
    head = BLIND_HEADING.split(text)[0]
    out = []
    for line in head.splitlines():
        m = VERDICT.match(line)
        if m:
            out.append({'n': int(m.group(1)), 'name': m.group(2).strip(),
                        'group': m.group(3), 'verdict': m.group(4), 'line': line})
    return out


def blind_lines(text):
    """the blind names, re-keyed by the file name when the namer wrote one"""
    out, by_file = [], {}
    for line in text.splitlines():
        m = BLIND.match(line)
        if not m:
            continue
        n, fname = int(m.group(1)), m.group(2)
        real = int(re.search(r'(\d+)', fname).group(1)) if fname else n
        rec = {'typed': n, 'real': real, 'file': fname, 'line': line}
        out.append(rec)
        if fname:
            by_file.setdefault(real, []).append(rec)
    return out, by_file


def check(report, blind, n):
    """what is wrong with the report, and what is worth saying out loud"""
    errors, warnings = [], []

    vs = verdict_lines(report)
    seen = {}
    for v in vs:
        seen.setdefault(v['n'], []).append(v)
    for k in sorted(seen):
        if len(seen[k]) > 1:
            errors.append('vật #%d có %d dòng phán quyết — mỗi vật chỉ một dòng' % (k, len(seen[k])))
    missing = [i for i in range(1, n + 1) if i not in seen]
    extra = [k for k in sorted(seen) if k > n]
    if missing:
        errors.append('%d vật chưa có dòng phán quyết: %s' % (len(missing), ', '.join('#%d' % i for i in missing)))
    if extra:
        errors.append('có dòng phán quyết cho vật ngoài danh mục: %s' % ', '.join('#%d' % i for i in extra))
    if not vs:
        errors.append('bản chấm không có dòng phán quyết nào theo mẫu "#n <tên> — A|B — KHỚP|HỎNG"')

    # the judge's own reading of the image — the thing that makes the line auditable
    blind_text = blind or ''
    silent = [v['n'] for v in vs if 'ảnh cho thấy:' not in v['line']]
    if silent:
        warnings.append('%d dòng không nói "ảnh cho thấy:" (%s) — dòng đó chỉ là lời của người đoán mù, '
                        'không ai kiểm tra được' % (len(silent), ', '.join('#%d' % i for i in silent)))

    # the blind namer's own numbering: trustworthy only where it wrote the file name
    if blind_text:
        bl, by_file = blind_lines(blind_text)
        named = set(by_file)
        typed = set(r['typed'] for r in bl)
        missing_b = [i for i in range(1, n + 1) if i not in named and i not in typed]
        if missing_b:
            warnings.append('BLIND.md thiếu %d mục (%s) — có mục không được đánh số, nên số trong BLIND.md '
                            'không đáng tin; hãy mở ảnh p_NN.jpg và tự nhìn' % (len(missing_b), ', '.join('#%d' % i for i in missing_b)))
        dup = [i for i in sorted(typed) if sum(1 for r in bl if r['typed'] == i) > 1]
        if dup:
            warnings.append('BLIND.md có mục lặp số: %s' % ', '.join('#%d' % i for i in dup))
        mism = [(r['typed'], r['real']) for r in bl if r['file'] and r['typed'] != r['real']]
        if mism:
            warnings.append('BLIND.md đánh số lệch với tên file ở %d mục (%s) — số trên dòng không phải số của '
                            'file ảnh; lời đoán thuộc về ảnh khác' % (len(mism), ', '.join('%d→%d' % m for m in mism[:6])))
    return errors, warnings


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if len(argv) < 4:
        print(__doc__)
        return 2
    ep, report, blind = argv[1], argv[2], argv[3]
    n = int(argv[4]) if len(argv) > 4 else count_props(ep)
    text = open(report, encoding='utf8').read()
    btext = ''
    if blind and os.path.isfile(blind):
        btext = open(blind, encoding='utf8').read()
    else:
        # the round appends the blind names to the report itself; take them from there
        parts = BLIND_HEADING.split(text)
        if len(parts) > 1:
            btext = parts[1]
    errors, warnings = check(text, btext, n)
    for w in warnings:
        print('ghi chú: %s' % w)
    if errors:
        for e in errors:
            print('lỗi: %s' % e)
        print('props: bản chấm chưa đủ — %d lỗi; mỗi vật phải có đúng một dòng phán quyết.' % len(errors))
        return 1
    print('props: mọi vật đều có dòng phán quyết (%d vật).' % n)
    return 0


def count_props(ep):
    """how many props the catalogue holds"""
    p = os.path.join(ep, 'src', 'props.js')
    if not os.path.isfile(p):
        return 0
    src = open(p, encoding='utf8').read()
    i = src.find('export const PROPS')
    if i < 0:
        return 0
    return len(re.findall(r"^\s{2}'([^']+)'\s*:", src[i:], re.M))


def selftest():
    failures = []

    def check_case(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    report = """VERDICT: FAIL
#1 giàn phơi quần áo — A — KHỚP — ảnh cho thấy: hai cọc gỗ, dây phơi — người xem gọi: "giàn phơi"
#2 kẹp quần áo — A — HỎNG — ảnh cho thấy: hai ván gỗ có lò xo — người xem gọi: "kẹp gỗ"
#3 áo thun — A — KHỚP — ảnh cho thấy: áo phông kem — người xem gọi: "áo thun"
"""
    blind = "#1 TÊN: giàn phơi | CHẮC: cao\n#2 TÊN: kẹp gỗ | CHẮC: cao\n#3 TÊN: áo thun | CHẮC: vừa\n"
    errs, warns = check(report, blind, 3)
    check_case("bản chấm đủ mọi vật thì không lỗi", not errs, str(errs))
    check_case("mọi dòng đều có lời của người chấm thì không ghi chú",
               not [w for w in warns if 'ảnh cho thấy' in w], str(warns))

    errs, warns = check(report.replace('#3 áo thun — A — KHỚP — ảnh cho thấy: áo phông kem — người xem gọi: "áo thun"\n', ''), blind, 3)
    check_case("vật chưa ai chấm thì báo lỗi", any('chưa có dòng phán quyết' in e for e in errs), str(errs))

    errs, _ = check(report.replace('#2 kẹp quần áo — A — HỎNG', '#2 kẹp quần áo — A — HỎNG\n#2 kẹp quần áo — A — KHỚP'), blind, 3)
    check_case("vật có hai dòng thì báo lỗi", any('dòng phán quyết' in e for e in errs), str(errs))

    errs, warns = check(report.replace(' — ảnh cho thấy: hai cọc gỗ, dây phơi', ''), blind, 3)
    check_case("dòng không nói ảnh cho thấy gì thì ghi chú", any('ảnh cho thấy' in w for w in warns), str(warns))
    check_case("ghi chú gom nhiều dòng thành một dòng",
               len([w for w in warns if 'ảnh cho thấy' in w]) == 1, str(warns))

    # the blind namer numbered itself, and got it wrong: the file name is the truth
    blind_bad = "#1 TÊN: giàn phơi | CHẮC: cao\n#2 (p_03.jpg) TÊN: áo thun | CHẮC: cao\n#3 (p_02.jpg) TÊN: kẹp gỗ | CHẮC: cao\n"
    errs, warns = check(report, blind_bad, 3)
    check_case("số lệch với tên file thì ghi chú", any('lệch với tên file' in w for w in warns), str(warns))
    check_case("lệch số không chặn vòng", not errs, str(errs))

    errs, warns = check(report, "#1 TÊN: giàn phơi | CHẮC: cao\n#2 TÊN: kẹp | CHẮC: cao\n", 3)
    check_case("BLIND.md thiếu mục thì ghi chú", any('thiếu' in w for w in warns), str(warns))

    for f in failures:
        print("FAIL %s" % f)
    print("%d ca đều đúng" % (10 - len(failures)) if not failures else "%d ca sai" % len(failures))
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
