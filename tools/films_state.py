#!/usr/bin/env python3
"""The state of every film under production, in one screen: python3 tools/films_state.py

One block per film: the stamps (which step has passed and is still valid), the last verdict, the rounds
that died without one, and whether there is a movie yet — then one line that says where the film stands.

Why it exists: a supervisor with several films running needs the whole board at once, and the way to get
it is to write a shell loop that calls each channel's gate. That loop was written by hand (again) while
watching six episodes, and a hand-written loop is where the next supervisor starts from scratch. The
gate already knows the truth — this only asks it, once per film, and prints the answer in a form a
person can scan.

    python3 tools/films_state.py            # every film the discovery module knows
    python3 tools/films_state.py --film channels/x/y    # one film, in full

Exit code: 0 always (this is a report, not a judgement); 2 when the discovery module cannot be run.
"""
import json
import os
import subprocess
import sys

LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
STEPS = ('outline', 'script', 'props', 'storyboard', 'assets', 'picture', 'final')


def films():
    """the films the discovery module knows: it is the one that knows where films live"""
    out = subprocess.run(['node', os.path.join(LIB, 'core', 'render', 'films.mjs'), '--films'],
                         capture_output=True, text=True, cwd=LIB)
    if out.returncode != 0:
        return None
    return [x for x in out.stdout.split() if x]


def gate_for(film):
    """the gate that judges this film: the channel's own, when the film lives in a channel"""
    rel = os.path.relpath(film, LIB)
    if rel.startswith('channels' + os.sep):
        parts = rel.split(os.sep)
        if len(parts) > 2:
            g = os.path.join(LIB, 'channels', parts[1], 'tools', 'gate.py')
            if os.path.isfile(g):
                return g
    return None


def parse_state(text):
    """the gate's own words, read into facts: a stamp, a dead round, a verdict, a movie"""
    state = {'passed': [], 'stale': [], 'missing': [], 'dead': [], 'verdict': None, 'movie': None}
    for line in text.splitlines():
        s = line.strip()
        if not s:
            continue
        head = s.split()[0] if s.split() else ''
        if head in STEPS:
            if 'còn hiệu lực' in s:
                state['passed'].append(head)
            elif 'hết hiệu lực' in s:
                state['stale'].append(head)
            elif 'chưa có PASS' in s:
                state['missing'].append(head)
        elif s.startswith('vòng chấm') and ('chết' in s or 'GIẾT' in s or 'ĐÃ CHẾT' in s):
            # "vòng chấm ĐÃ CHẾT: storyboard — …" → the scope is what follows the colon
            scope = s.split(':', 1)[1].split('—')[0].strip() if ':' in s else s
            state['dead'].append(scope)
        elif s.startswith('last verdict:'):
            state['verdict'] = s.split(':', 1)[1].strip()
        elif s.startswith('movie:'):
            state['movie'] = s.split(':', 1)[1].strip()
    return state


def read_state(film):
    """the gate's own words about one film, and the facts they carry"""
    gate = gate_for(film)
    if not gate:
        return None
    r = subprocess.run([sys.executable, gate, 'status', film], capture_output=True, text=True, cwd=LIB)
    text = r.stdout + r.stderr
    state = parse_state(text)
    state['gate'] = gate
    state['text'] = text
    return state


def one_line(name, state):
    """the sentence a supervisor can read in one go: where the film stands, and what blocks it"""
    if state is None:
        return "%-28s (không có cổng cho tập này)" % name
    bits = []
    if state['passed']:
        bits.append('%d/%d tem còn hiệu lực' % (len(state['passed']), len(STEPS)))
    else:
        bits.append('chưa có tem nào')
    if state['stale']:
        bits.append('tem hết hiệu lực: ' + ', '.join(state['stale']))
    if state['missing']:
        bits.append('thiếu: ' + ', '.join(state['missing']))
    if state['dead']:
        bits.append('vòng chết: ' + ', '.join(sorted(set(state['dead']))))
    if state['verdict']:
        bits.append('phán quyết: ' + state['verdict'])
    bits.append('phim: ' + (state['movie'] or 'chưa có'))
    return "%-28s %s" % (name, ' · '.join(bits))


def selftest():
    """the summary is the part that can go wrong quietly: a stamp read as valid when it is stale"""
    failures = []

    def check(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    sample = """gate: cảnh báo — OUTLINE.pass chấm một dàn ý khác với hiện tại
outline     PASS còn hiệu lực
script      PASS còn hiệu lực
props       PASS đã hết hiệu lực: bản chấm PROPS-DIRECTORS-CUT.md không còn là bản đã PASS
storyboard  chưa có PASS
vòng chấm ĐÃ CHẾT: storyboard — vòng chấm chết (exit 2) lúc 17:42:26
last verdict: VERDICT: REJECTED (review/FINAL-QA-REVIEW-1.md)
movie: a.mp4
"""

    st = parse_state(sample)
    check("tem còn hiệu lực được đếm", st['passed'] == ['outline', 'script'], str(st['passed']))
    check("tem hết hiệu lực không bị tính là còn", st['stale'] == ['props'], str(st['stale']))
    check("bước chưa chấm được đếm riêng", st['missing'] == ['storyboard'], str(st['missing']))
    check("vòng chết được nhận", st['dead'] == ['storyboard'], str(st['dead']))
    check("phán quyết được đọc", 'REJECTED' in (st['verdict'] or ''), str(st['verdict']))
    check("phim được đọc", st['movie'] == 'a.mp4', str(st['movie']))
    line = one_line('tap-x', st)
    check("dòng tóm tắt nói tem hết hiệu lực", 'hết hiệu lực: props' in line, line)
    check("dòng tóm tắt không nói tem hết hiệu lực là còn hiệu lực",
          '2/7 tem còn hiệu lực' in line, line)
    for f in failures:
        print("FAIL %s" % f)
    print("%d ca đều đúng" % (7 - len(failures)) if not failures else "%d ca sai" % len(failures))
    return 1 if failures else 0


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    args = [a for a in sys.argv[1:] if a != '--film']
    if '--film' in sys.argv:
        i = sys.argv.index('--film')
        target = sys.argv[i + 1] if i + 1 < len(sys.argv) else None
        if not target:
            print(__doc__)
            sys.exit(2)
        film = target if os.path.isabs(target) else os.path.join(LIB, target)
        st = read_state(film)
        if st is None:
            print("films_state: không có cổng cho %s" % film)
            sys.exit(2)
        print(st['text'])
        sys.exit(0)
    fs = films()
    if fs is None:
        print("films_state: công cụ dò phim không chạy được (node core/render/films.mjs --films)", file=sys.stderr)
        sys.exit(2)
    for rel in sorted(fs):
        film = os.path.join(LIB, rel)
        if not os.path.isdir(os.path.join(film, 'src')):
            continue
        st = read_state(film)
        print(one_line(os.path.basename(rel), st))
    sys.exit(0)
