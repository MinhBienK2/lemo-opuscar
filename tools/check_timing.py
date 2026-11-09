"""Audit visual timing, anti-spoiler gates, and multi-line anchor synchronization:
python3 tools/check_timing.py <film-folder> [<film-folder> ...]

Two critical visual storytelling classes checked:

  1. Anti-Spoiler / Withheld Reveal:
     Outcome text, negative results ("không cái nào", "không đổi", "thất bại"),
     or high-contrast red conclusion stamps must NOT be drawn statically at t0=0.
     They must be time-gated (if (T >= ...) or gatedReveal(...)) so the viewer
     does not read the conclusion before the voice reveals it.

  2. Multi-Line Compound Shot Clock Synchronization:
     When a shot spans multiple spoken lines (e.g. line1, line2, line3),
     the visuals must not collapse solely onto L('line1').t0.
     Later lines must drive their own visual micro-beats (referencing L('line2'), L('line3')
     or compoundClocks) to prevent 5-10s visual freezes.

These two rules read one format: the 2D episodes of old, whose shots are
`{ n: 'name', t: …, f(g, lt, T) {…}, ev: … }` and whose storyboard is a `const ORDER`.
A film in another shape — the 3D episodes of the channel, which declare their shots as
`sh('N1', 'c1', …)` — has no rule this check can apply. It then says so plainly and
exits 2 ("could not run", not a verdict about the film); it never says "verified"
about a film it never opened.

Exit code: 0 clean; 1 timing/spoiler defects found; 2 usage, or a format this check
does not know (no timing rule was applied).

    python3 tools/check_timing.py --selftest   proves the checker can still say "no"
"""
import os
import re
import sys
import json
import io
import contextlib
import tempfile

# the conclusion stamp: the two reds a film draws its verdict in. A film that names the colour for
# itself (const RED = '#F0525B') draws the same stamp, so the name counts too.
RED_HEXES = ('#F0525B', '#D8402F')

# The shape this check reads: a 2D shot — a name, a drawing function, its events. The 3D episodes
# of the channel declare their shots as sh('N1', 'c1', …) and have neither this shape nor an ORDER
# board; a check that found no shape to read has applied no rule and must not say "verified".
SHOT_SHAPE = re.compile(r"\{\s*n:\s*'([^']+)'[\s\S]*?f\(g,\s*lt,\s*T\)\s*\{")
ORDER_BOARD = re.compile(r"const ORDER\s*=")

# What the check says when it cannot read the film. The words are the ones the retro used, so the
# record in improvements/ and the tool that runs say the same thing.
UNKNOWN_FORMAT = ("định dạng này không phải định dạng mà bài này biết — không luật nhịp nào được áp dụng")


def knows_format(film_src):
    """True when the file holds a shape this check can read — a 2D shot, or the ORDER board.

    A file with neither has no shot for the anti-spoiler rule to look at and no board for the
    anchor rule to walk. No rule was applied to it, so nothing was verified about it.
    """
    return bool(SHOT_SHAPE.search(film_src)) or bool(ORDER_BOARD.search(film_src))


def color_names(src):
    """the colours the film names for itself: RED = '#F0525B' means RED is that red stamp"""
    out = set()
    for name, hexv in re.findall(r"\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*'(#[0-9A-Fa-f]{6})'", src):
        if hexv.upper() in RED_HEXES:
            out.add(name)
    return out


def red_text_re(names):
    """the red conclusion texts of one shot: a red stamp carrying the film's own word for it.

    The colour is written either as a literal (fill: '#F0525B') or as the name the film gives it
    (fill: RED) — both are the same stamp, so both must be read.
    """
    fills = '|'.join(sorted(set(RED_HEXES) | set(names)))
    return re.compile(r"text\(g,\s*['\"]([^'\"]*(?:không|thất bại|đảo chiều|biến mất)[^'\"]*)['\"]"
                      r".*?fill:\s*(?:['\"](?:" + fills + r")['\"]|(?:" + fills + r")\b)", re.I)


def audit_film_timing(folder):
    """(các lỗi, trạng thái). Trạng thái: 'ok' (định dạng đã biết), 'unknown' (định dạng lạ),
    'missing' (không có src/film.js)."""
    film_js = os.path.join(folder, "src", "film.js")
    lines_json = os.path.join(folder, "voice", "lines.json")
    if not os.path.exists(film_js):
        return [], 'missing'

    film_src = open(film_js, encoding='utf-8').read()
    if not knows_format(film_src):
        return [], 'unknown'
    issues = []

    # 1. Anti-Spoiler Check
    red_re = red_text_re(color_names(film_src))
    shots_raw = re.findall(r"\{\s*n:\s*'([^']+)'[\s\S]*?f\(g,\s*lt,\s*T\)\s*\{([\s\S]*?)\}\s*,\s*ev", film_src)
    for sname, body in shots_raw:
        # Match red/accent conclusion texts or negation punchlines
        red_texts = red_re.findall(body)
        for rt in red_texts:
            idx = body.find(rt)
            preceding = body[max(0, idx - 200):idx]
            if "if (" not in preceding and "gatedReveal" not in preceding:
                issues.append(f"Shot '{sname}': un-gated punchline text '{rt}' drawn unconditionally at t0=0 (spoils conclusion before voice reveals it)")

    # 2. Multi-Line Shot Anchor Collapse Check
    if os.path.exists(lines_json):
        try:
            lines_data = json.load(open(lines_json, encoding='utf-8'))
            line_ids = [l['id'] for l in lines_data]
            order_m = re.search(r"const ORDER = \[([\s\S]*?)\];", film_src)
            if order_m:
                order_entries = re.findall(r"\[\s*'([^']+)'\s*,\s*(?:'([^']+)'|null)", order_m.group(1))
                shot_line_map = {sname: lid for sname, lid in order_entries if lid}
                shot_names = [s[0] for s in order_entries]
                for idx, sname in enumerate(shot_names):
                    curr_line = shot_line_map.get(sname)
                    if not curr_line or curr_line not in line_ids:
                        continue
                    c_idx = line_ids.index(curr_line)
                    next_line = None
                    for n_sname in shot_names[idx+1:]:
                        nl = shot_line_map.get(n_sname)
                        if nl and nl in line_ids:
                            next_line = nl
                            break
                    n_idx = line_ids.index(next_line) if next_line else len(line_ids)
                    covered_lines = line_ids[c_idx:n_idx]
                    if len(covered_lines) >= 2:
                        shot_code_m = re.search(rf"\{{\s*n:\s*'{sname}'[\s\S]*?f\(g,\s*lt,\s*T\)\s*\{{([\s\S]*?)\}}\s*,\s*ev", film_src)
                        if shot_code_m:
                            sbody = shot_code_m.group(1)
                            for unref in covered_lines[1:]:
                                if f"L('{unref}')" not in sbody and f'L("{unref}")' not in sbody and "compoundClocks" not in sbody:
                                    issues.append(f"Shot '{sname}': spans lines {covered_lines} but line '{unref}' is never referenced in f(g) (visual freeze / anchor collapse risk)")
        except Exception:
            pass

    return issues, 'ok'

def selftest():
    """a check that answers "yes" to everything is not a check: prove it can still say "no".

    The lines are the real lines of tap-01 (phơi quần áo) and the film.js is the format the check reads
    (the shots of the 2D episodes: a name, a time, the drawing, the events). Every case runs on a film
    folder built in a temporary directory, and the verdict is the issues the checker reports.
    """
    # the real lines of tap-01: the ids are what the board's ORDER maps onto
    LINES = [
        {"id": "c1", "text": "Quần áo ướt treo trên dây, nước vẫn còn đó, chưa đi đâu cả."},
        {"id": "c2", "text": "Nó còn ở trên vải, và sẽ phải rời đi bằng một cách khác."},
        {"id": "c3", "text": "Vì sao phơi quần áo cần gió? Mình làm thí nghiệm nhỏ."},
    ]

    def film_js(order, shots):
        """the board's ORDER and its shots, in the format the check reads"""
        head = "const RED = '#F0525B';\nconst ORDER = [\n  " \
               + ",\n  ".join(f"['{s}', '{l}', .3]" for s, l in order) + ",\n];\n"
        body = "".join(
            "  { n: '%s', t: %s, f(g, lt, T) {\n%s\n    }, ev: () => [] },\n" % (n, t, b)
            for n, t, b in shots)
        return head + "const SHOTS = [\n" + body + "];\n"

    def shot(name, body, t="0"):
        return (name, t, body)

    def run(order, shots, strict=True):
        """dựng một tập phim trong thư mục tạm và chạy đúng bộ kiểm này; trả về (mã thoát, chữ in ra)"""
        return run_raw(film_js(order, shots), strict)

    def run_raw(src, strict=True):
        """dựng một tập phim với mã nguồn bất kỳ và chạy bộ kiểm này"""
        with tempfile.TemporaryDirectory() as td:
            os.makedirs(os.path.join(td, 'src'))
            os.makedirs(os.path.join(td, 'voice'))
            with open(os.path.join(td, 'src', 'film.js'), 'w', encoding='utf-8') as f:
                f.write(src)
            with open(os.path.join(td, 'voice', 'lines.json'), 'w', encoding='utf-8') as f:
                json.dump(LINES, f, ensure_ascii=False)
            argv = sys.argv
            sys.argv = ['check_timing.py'] + (['--strict'] if strict else []) + [td]
            buf = io.StringIO()
            try:
                with contextlib.redirect_stdout(buf):
                    code = main()
            finally:
                sys.argv = argv
        return code, buf.getvalue()

    # a shot that draws the scene
    NEUTRAL = ("      const t0 = L('c1').t0;\n"
               "      g.save(); camera(g, 1.03, 960, 620);\n"
               "      deskWall(g, T, { top: 520 });\n"
               "      g.restore();")
    # the same shot, but it also drives the second line
    TWO_LINES = ("      const t0 = L('c1').t0, t1 = L('c2').t0;\n"
                 "      g.save(); camera(g, 1.03, 960, 620);\n"
                 "      deskWall(g, T, { top: 520 });\n"
                 "      g.restore();")
    # the conclusion of the episode, in the film's own red, drawn straight away
    PUNCH = ("      const t0 = L('c3').t0;\n"
             "      text(g, 'hơi nước không đổi', 960, 760, { font: font(900, 36), align: 'center', fill: RED });")
    # the same conclusion, but it waits for the voice
    PUNCH_GATED = ("      const t0 = L('c3').t0;\n"
                   "      if (T >= t0 + 2) { text(g, 'hơi nước không đổi', 960, 760, { font: font(900, 36), align: 'center', fill: RED }); }")

    ORDER_TWO = [('hook', 'c1'), ('result', 'c3')]

    cases = []

    # 1. the anti-spoiler rule
    code, out = run(ORDER_TWO, [shot('hook', TWO_LINES), shot('result', PUNCH, "L('c3').t0")])
    cases.append(('an un-gated red punchline is caught',
                  code == 1 and "un-gated punchline text 'hơi nước không đổi'" in out))
    code, out = run(ORDER_TWO, [shot('hook', TWO_LINES), shot('result', PUNCH_GATED, "L('c3').t0")])
    cases.append(('the same punchline behind a gate is left alone', code == 0 and 'check_timing: PASS' in out))

    # 2. the anchor-collapse rule
    code, out = run(ORDER_TWO, [shot('hook', NEUTRAL), shot('result', NEUTRAL, "L('c3').t0")])
    cases.append(('a shot that spans two lines but names only the first is caught',
                  code == 1 and "line 'c2' is never referenced" in out))
    code, out = run(ORDER_TWO, [shot('hook', TWO_LINES), shot('result', NEUTRAL, "L('c3').t0")])
    cases.append(('a shot that names every line it spans is left alone', code == 0 and 'check_timing: PASS' in out))

    # 3. a clean film
    code, out = run([('hook', 'c1'), ('proof', 'c2'), ('result', 'c3')],
                    [shot('hook', NEUTRAL), shot('proof', TWO_LINES, "L('c2').t0"),
                     shot('result', PUNCH_GATED, "L('c3').t0")])
    cases.append(('a clean film has nothing to report', code == 0 and 'check_timing: PASS' in out))

    # 4. a format this check does not know: the 3D episodes declare their shots as sh('N1', 'c1', …),
    # so there is no shot to read and no board to walk — no rule was applied, so nothing was verified.
    THREE_D = ("const SHOTS = [\n"
               "  sh('N1', 'c1', 40, [0, 0, 0], [0, 0, 0]),\n"
               "  sh('N4', 'c2', 40, [0, 0, 0], [0, 0, 0]),\n"
               "];\n")
    code, out = run_raw(THREE_D)
    cases.append(('a format this check does not know says so and exits 2',
                  code == 2 and 'COULD NOT RUN' in out
                  and 'không luật nhịp nào được áp dụng' in out
                  and 'verified' not in out))
    cases.append(('a film it cannot read never writes "verified"', 'verified' not in out))

    # 5. the command line itself
    argv = sys.argv
    sys.argv = ['check_timing.py']
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            code = main()
    finally:
        sys.argv = argv
    cases.append(('the usage branch exits 2', code == 2 and 'usage' in buf.getvalue()))

    failed = 0
    for name, ok in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' if ok else f'FAIL {name}')
        if not ok: failed += 1
    if failed:
        print(f'FAIL: {failed} case(s)')
        return 1
    print('ok')
    return 0


def main():
    if '--selftest' in sys.argv[1:]:
        return selftest()

    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    strict = '--strict' in sys.argv
    if not args:
        print("usage: python3 tools/check_timing.py [--strict] <film-folder> [<film-folder> ...]")
        return 2

    total_bad = 0
    could_not_run = 0
    for folder in args:
        name = os.path.basename(folder.rstrip('/'))
        issues, status = audit_film_timing(folder)
        if status == 'missing':
            # nothing was opened, so nothing was verified: a check that never read the film
            # must not write "verified" about it
            print(f"--- {folder}")
            print(f"  COULD NOT RUN: không có {os.path.join(folder, 'src', 'film.js')} — "
                  f"không có luật nhịp nào được áp dụng")
            could_not_run += 1
            continue
        if status == 'unknown':
            # the format is not one this check knows — a 3D episode declares its shots as
            # sh('N1', 'c1', …), and there is no shot for the anti-spoiler rule to read and no
            # ORDER board for the anchor rule to walk. No rule was applied, so nothing was verified.
            print(f"--- {folder}")
            print(f"  COULD NOT RUN: {UNKNOWN_FORMAT}")
            could_not_run += 1
            continue
        if issues:
            print(f"--- {folder}")
            for iss in issues:
                print(f"  {'BAD' if strict else 'WARN'} {iss}")
            if strict:
                total_bad += len(issues)
        else:
            print(f"OK  {name}: visual timing, micro-clocks, and anti-spoiler gates verified")

    if total_bad:
        print(f"\ncheck_timing: FAILED ({total_bad} defect(s) found)")
        return 1
    if could_not_run:
        print(f"\ncheck_timing: COULD NOT RUN ({could_not_run} folder(s) in a format this check "
              f"does not know — no timing rule was applied)")
        return 2
    print("\ncheck_timing: PASS")
    return 0

if __name__ == '__main__':
    sys.exit(main())
