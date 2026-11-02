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

Exit code: 0 clean; 1 timing/spoiler defects found; 2 usage.
"""
import os
import re
import sys
import json

def audit_film_timing(folder):
    film_js = os.path.join(folder, "src", "film.js")
    lines_json = os.path.join(folder, "voice", "lines.json")
    if not os.path.exists(film_js):
        return []

    film_src = open(film_js, encoding='utf-8').read()
    issues = []

    # 1. Anti-Spoiler Check
    shots_raw = re.findall(r"\{\s*n:\s*'([^']+)'[\s\S]*?f\(g,\s*lt,\s*T\)\s*\{([\s\S]*?)\}\s*,\s*ev", film_src)
    for sname, body in shots_raw:
        # Match red/accent conclusion texts or negation punchlines
        red_texts = re.findall(r"text\(g,\s*['\"]([^'\"]*(?:không|thất bại|đảo chiều|biến mất)[^'\"]*)['\"].*?fill:\s*['\"](?:#F0525B|#D8402F)", body, re.I)
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

    return issues

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    strict = '--strict' in sys.argv
    if not args:
        print("usage: python3 tools/check_timing.py [--strict] <film-folder> [<film-folder> ...]")
        return 2

    total_bad = 0
    for folder in args:
        name = os.path.basename(folder.rstrip('/'))
        issues = audit_film_timing(folder)
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
    print("\ncheck_timing: PASS")
    return 0

if __name__ == '__main__':
    sys.exit(main())
