#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bản chấm phải đọc được — kiểm bằng máy, không bằng mắt.

Công cụ đọc bản chấm bằng **mẫu** (regex). Người viết bản chấm là người, và người viết
theo nhiều cách: `VERDICT: PASS`, `**VERDICT: PASS**`, `## VERDICT: PASS`. Khi công cụ
không đọc được phán quyết thì **cả vòng chấm đó bị ném đi** — không phải phim bị trả
về, mà là công sức của một vòng biến mất im lặng.

Sự cố này đã xảy ra hai lần trong một tuần, mỗi lần một kiểu:

  - người chấm viết bản chấm vào `SCENE-REVIEW.md` (tên trong mẫu của nó), còn công cụ
    đọc `REVIEW.md` (tên trong dòng việc) → **một vòng chấm 35 kB thành 415 byte cảnh báo**;
  - người chấm trả lời trong chat bằng chữ đậm `**VERDICT: REJECT**`, còn công cụ tìm
    `VERDICT: PASS` ở đầu dòng → **phán quyết không tồn tại** (và một PASS viết đậm cũng
    sẽ ném vòng chấm đi).

Ba việc, mỗi việc một luật:

  1. **Mẫu của người chấm phải nêu đúng tên tệp mà công cụ đọc.** Mẫu trong
     `.agents/skills/tram-nghi-nhieu/step*/PROMPT_CRITIC.md` khai báo tên tệp đầu ra, và
     `review.sh` phải đọc đúng tên đó. Tên lệch nhau thì bản chấm rơi vào một tệp không
     ai đọc — vòng chấm mất trong im lặng.
  2. **Mọi bản chấm mà công cụ sẽ đọc phải có phán quyết mà công cụ đọc được.** Một bản
     chấm không có phán quyết đọc được là một vòng chấm đã mất.
  3. **Bước nào không có công cụ thì phải nói ra.** Một bước mà không ai chấm, không ai
     đóng tem, không ai đếm — không ai có thể bỏ qua nó, và không ai biết nó đã qua
     (N4 của đợt đúc kết này). Bước này là *cảnh báo*, không phải lỗi: nó là khoảng
     trống đã biết, và nó sẽ tự biến mất khi kênh thêm chế độ cho bước đó.

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_reports.py [<tập> ...]
        (không có đối số: kiểm cả kênh — mẫu và mọi bản chấm đã sinh)
Thoát mã 0 = mọi thứ khớp; 1 = có lỗi; 2 = không chạy được.
"""
import glob
import os
import re
import sys

# ——— nơi mọi thứ nằm ———

def channel_root():
    """thư mục kênh: thư mục cha của thư mục tools đang chứa tệp này"""
    here = os.path.dirname(os.path.abspath(__file__))
    return os.path.dirname(here)


def library_root():
    """gốc thư viện: thư mục cha của thư mục kênh"""
    return os.path.dirname(os.path.dirname(channel_root()))


# ——— phán quyết ———

# Đúng mẫu của gate.py: phán quyết ở đầu dòng, có thể có dấu #, có thể đậm.
# A verdict is ONE word. The templates print 'VERDICT: PASS | REJECT' as a placeholder, and a report that
# copies that line verbatim would read as a PASS — the placeholder is not an answer. A word that runs on
# ('PASSED') is not a verdict either.
VERDICT_WORD = re.compile(r'^#*\s*[*_]{0,2}VERDICT: *[*_]{0,2} *(\w+)(?![A-Za-z_])(?!\s*[*_]{0,2}\s*[|/+])', re.M)
# Tên tệp mà mẫu khai báo: "Định dạng Output Bắt buộc (`REVIEW.md`)"
DECLARED = re.compile(r'Định dạng Output Bắt buộc\s*\(`([^`]+)`\)')

# Bản cắt của đạo diễn: một đường thay thế để đóng dấu, và review.sh đọc nó.
CUT_RE = re.compile(r'^(OUTLINE|SCRIPT|PROPS|STORYBOARD|REVIEW)(?:-ch\d+)?-DIRECTORS-CUT$')
# Bản chấm thường, sau khi bỏ số vòng và phạm vi.
REVIEW_RE = re.compile(r'^(OUTLINE-REVIEW|SCRIPT-REVIEW|PROPS-CODE-REVIEW|PROPS-REVIEW'
                        r'|STORYBOARD-REVIEW|REVIEW)$')

# Bảy bước của kênh, và bước nào có công cụ đóng tem. `None` = bước chưa có công cụ.
# Danh sách này đi cùng các chế độ của review.sh: --outline --script --props
# --storyboard --chapter/--lines/--video.
STEP_KIND = {
    'step1-outline': 'outline',
    'step2-script': 'script',
    'step3-storyboard': 'storyboard',
    'step4-component-breakdown': None,
    'step5-props-code': 'props',
    'step6-assembly': 'picture',
    'step7-delivery': None,
}
# Tên tệp mà mỗi bước có công cụ phải khai báo, vì đó là tên review.sh đọc.
EXPECTED = {
    'outline': 'OUTLINE-REVIEW.md',
    'script': 'SCRIPT-REVIEW.md',
    'storyboard': 'STORYBOARD-REVIEW.md',
    'props': 'PROPS-REVIEW.md',
    'picture': 'REVIEW.md',
}


def verdict_word(text):
    """chữ phán quyết của một bản chấm (PASS, REJECT, FAIL, ACCEPTED_FOR_PUBLISH…),
    hay None nếu công cụ không đọc được"""
    m = VERDICT_WORD.search(text)
    return m.group(1) if m else None


def declares_file(template_text):
    """tên tệp mà mẫu khai báo, hay None nếu mẫu không khai báo"""
    m = DECLARED.search(template_text)
    return m.group(1) if m else None


def is_gated_report(name):
    """tệp này có phải loại bản chấm mà công cụ đọc và đóng tem không"""
    stem = name[:-3] if name.endswith('.md') else name
    if CUT_RE.match(stem):
        return True
    # bỏ số vòng, rồi bỏ phạm vi
    stem = re.sub(r'-\d+$', '', stem)
    stem = re.sub(r'-lines(-\d+){1,2}$', '', stem)
    stem = re.sub(r'-c\d+(-\d+)?$', '', stem)
    stem = re.sub(r'-ch\d+$', '', stem)
    stem = re.sub(r'-video$', '', stem)
    return bool(REVIEW_RE.match(stem))


def review_files(ep):
    """mọi bản chấm của một tập"""
    out = []
    for p in sorted(glob.glob(os.path.join(ep, 'review', '*.md'))):
        if is_gated_report(os.path.basename(p)):
            out.append(p)
    return out


def check_templates(ch):
    """luật 1: mẫu của mỗi bước có công cụ phải nêu đúng tên tệp công cụ đọc

    ([(đường dẫn mẫu, tên khai báo, tên đúng, đúng không)], [(đường dẫn mẫu, tên khai báo)])
    """
    review_sh = os.path.join(ch, 'tools', 'review.sh')
    if not os.path.isfile(review_sh):
        return None
    sh = open(review_sh, encoding='utf-8').read()
    ok, gaps = [], []
    for p in sorted(glob.glob(os.path.join(library_root(), '.agents', 'skills', '*',
                                           'step*', 'PROMPT_CRITIC.md'))):
        step = os.path.basename(os.path.dirname(p))
        if step not in STEP_KIND:
            continue                      # một bước mới chưa biết: bỏ qua, đừng đoán
        kind = STEP_KIND[step]
        txt = open(p, encoding='utf-8').read()
        name = declares_file(txt)
        if kind is None:
            gaps.append((p, name))
            continue
        want = EXPECTED[kind]
        good = name == want and want in sh
        ok.append((p, name, want, good))
    return ok, gaps


def check_reports(eps):
    """luật 2: mọi bản chấm mà công cụ sẽ đọc có phán quyết đọc được

    [(đường dẫn, lý do)]
    """
    out = []
    for ep in eps:
        for p in review_files(ep):
            txt = open(p, encoding='utf-8', errors='replace').read()
            if verdict_word(txt) is None:
                out.append((p, 'không có phán quyết mà công cụ đọc được'))
    return out


# ——— selftest ———

TPL = "## Định dạng Output Bắt buộc (`REVIEW.md`)\n"
TPL_OLD = "## Định dạng Output Bắt buộc (`SCENE-REVIEW.md`)\n"
OK_REPORT = "# Bản chấm\n\nVERDICT: PASS\n\n## NHẬN XÉT\n- c1 tốt\n"
BOLD_REPORT = "# Bản chấm\n\n**VERDICT: REJECT** — NHỊP_ĐIỆU=3\n"
HEAD_REPORT = "# Bản chấm\n\n## VERDICT: PASS\n"
NO_VERDICT = "# Bản chấm\n\n## NHẬN XÉT\n- c1 tốt\n"


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm"""
    cases = []

    for name, text, want in (('phán quyết thường', OK_REPORT, 'PASS'),
                             ('phán quyết đậm', BOLD_REPORT, 'REJECT'),
                             ('phán quyết dưới tiêu đề', HEAD_REPORT, 'PASS')):
        got = verdict_word(text)
        cases.append((f'{name} thì đọc được', got == want, got, ''))

    got = verdict_word(NO_VERDICT)
    cases.append(('bản chấm không có phán quyết thì không đọc được', got is None, got, ''))

    got = declares_file(TPL)
    cases.append(('mẫu khai báo tên tệp thì đọc được', got == 'REVIEW.md', got, ''))
    got = declares_file(TPL_OLD)
    cases.append(('mẫu cũ khai báo tên khác thì vẫn đọc được', got == 'SCENE-REVIEW.md', got, ''))

    for name, ok in (('REVIEW.md', True), ('REVIEW-4.md', True), ('REVIEW-c1-2.md', True),
                     ('REVIEW-lines-30-40.md', True), ('REVIEW-lines-30-40-1.md', True),
                     ('REVIEW-video-1.md', True), ('SCRIPT-REVIEW-1.md', True),
                     ('SCRIPT-REVIEW-ch1-2.md', True), ('PROPS-REVIEW.md', True),
                     ('PROPS-CODE-REVIEW.md', True), ('STORYBOARD-REVIEW-3.md', True),
                     ('OUTLINE-REVIEW.md', True), ('OUTLINE-REVIEW-2.md', True),
                     ('PROPS-DIRECTORS-CUT.md', True), ('STORYBOARD-DIRECTORS-CUT.md', True),
                     ('REVIEW-DIRECTORS-CUT.md', True), ('REVIEW-ch1-DIRECTORS-CUT.md', True),
                     ('ASSET-AUDIT-REPORT.md', False), ('ASSET-AUDIT-DIRECTORS-CUT.md', False),
                     ('FINAL-QA-REPORT.md', False), ('BLIND.md', False)):
        got = is_gated_report(name)
        cases.append((f'"{name}" là bản chấm công cụ đọc: {ok}', got == ok, got, ''))

    failed = 0
    for name, ok, got, extra in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' + (f'  [{got}]' if not ok else ''))
        if not ok:
            failed += 1
    if failed:
        print(f'check_reports --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'check_reports --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if argv and argv[0] == '--selftest':
        return selftest()
    ch = channel_root()
    if not os.path.isfile(os.path.join(ch, 'CHANNEL.md')):
        print('check_reports: không tìm thấy thư mục kênh', file=sys.stderr)
        return 2
    eps = argv or sorted(glob.glob(os.path.join(ch, 'series', '*', '*')))
    eps = [e for e in eps if os.path.isdir(e)]
    bad = 0

    tpl = check_templates(ch)
    if tpl is None:
        print('check_reports: không tìm thấy tools/review.sh của kênh', file=sys.stderr)
        return 2
    ok_rows, gaps = tpl
    wrong = [(p, name, want) for p, name, want, good in ok_rows if not good]
    if wrong:
        print(f'check_reports: {len(wrong)} mẫu người chấm nêu tên tệp mà review.sh không đọc')
        for p, name, want in wrong:
            print(f'  {os.path.relpath(p, library_root())}: nêu "{name}" — review.sh đọc "{want}"')
        bad += len(wrong)
    else:
        print(f'check_reports: {len(ok_rows)} mẫu người chấm đều nêu đúng tên tệp review.sh đọc')
    for p, name in gaps:
        print(f'check_reports: CẢNH BÁO — {os.path.relpath(p, library_root())} nêu "{name}" '
              f'nhưng bước này chưa có công cụ: bản chấm viết ra không ai đọc, không ai đếm')
    if gaps:
        print('  → một bước không có công cụ là một bước không ai có thể bỏ qua '
              '(thêm chế độ cho nó trong tools/review.sh)')

    bad_reports = check_reports(eps)
    if bad_reports:
        print(f'check_reports: {len(bad_reports)} bản chấm không có phán quyết mà công cụ đọc được')
        for p, why in bad_reports:
            print(f'  {os.path.relpath(p, library_root())}: {why}')
        bad += len(bad_reports)
    else:
        n = sum(1 for e in eps for f in review_files(e))
        print(f'check_reports: {n} bản chấm công cụ đọc đều có phán quyết đọc được')

    if bad:
        print('  → một bản chấm không đọc được là một vòng chấm đã mất: sửa cách viết, rồi chạy lại')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
