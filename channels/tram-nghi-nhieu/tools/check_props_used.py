"""Every prop in the catalogue must be on the screen — python3 check_props_used.py <episode>

The props catalogue (`src/props.js` → `export const PROPS`) is what the props critic judges: every
object of the film, alone, from three views. The film itself builds its scene in `src/set.js` and
`src/film.js`, which call the same factories. So the catalogue and the film are two lists of the same
things — and nothing checks that they are the **same** list.

A prop in the catalogue that the film never calls is dead work: the critic spent rounds judging it, and
the viewer never sees it. Worse, it usually means the *film* is missing something: tap-03's catalogue
held "nắp chai nhựa có ren dọc" while the film never placed it — and the outline reviewer, reading the
treatment, independently asked for "nắp chai rời trên bàn" on screen. Two tools, one hole.

This check says which catalogue props the film never calls. Two ways out, and both are right: put the
prop on screen, or take it out of the catalogue. A catalogue is a promise about the film, and a promise
that is not kept is the same as no catalogue.

Exit code: 0 every catalogue prop is on screen; 1 some are not; 2 usage.
"""
import os
import re
import sys

# the words that look like calls but are not
NOT_A_CALL = {'if', 'for', 'while', 'switch', 'return', 'function', 'new', 'get', 'set', 'add',
              'push', 'visible', 'group', 'update', 'setState', 'await', 'typeof', 'of', 'in'}


def catalogue(src):
    """[(name, body)] of the catalogue, or [] when there is none"""
    p = os.path.join(src, 'props.js')
    if not os.path.isfile(p):
        return [], ''
    text = open(p, encoding='utf-8').read()
    i = text.find('export const PROPS')
    if i < 0:
        return [], text
    end = text.find('\n};', i)
    if end < 0:
        return [], text
    body = text[i:end]
    entries = re.findall(r"^\s*'([^']+)'\s*:\s*\(\)\s*=>\s*([\s\S]{0,500}?)(?=^\s*'[^']+'\s*:|\Z)",
                          body, re.M)
    return entries, text[:i] + text[end:]


def called_elsewhere(name, text):
    """is the factory called — not merely defined — somewhere outside the catalogue?"""
    return bool(re.search(r'(?<!function )\b' + re.escape(name) + r'\s*\(', text))


def dead_props(src):
    """the catalogue props the film never calls"""
    entries, outside = catalogue(src)
    for f in sorted(os.listdir(src)):
        if f.endswith('.js') and f != 'props.js':
            outside += open(os.path.join(src, f), encoding='utf-8').read()
    dead = []
    for name, entry in entries:
        factories = [n for n in re.findall(r'\b([a-zA-Z_]\w*)\s*\(', entry) if n not in NOT_A_CALL]
        if factories and not any(called_elsewhere(n, outside) for n in factories):
            dead.append(name)
    return dead


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    ep = sys.argv[1]
    src = os.path.join(ep, 'src')
    if not os.path.isdir(src):
        print(f'check_props_used: {ep} has no src/')
        return 2
    dead = dead_props(src)
    if not dead:
        print(f'check_props_used: every prop of the catalogue is on screen ({len(catalogue(src)[0])} vật)')
        return 0
    print(f'check_props_used: {len(dead)} vật trong danh mục không xuất hiện trong phim:')
    for d in dead:
        print(f'  - {d}')
    print('  hoặc đưa vật đó lên màn hình, hoặc bỏ nó khỏi danh mục — danh mục là lời hứa về phim.')
    return 1


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm"""
    import shutil
    import tempfile
    cases = []
    tmp = tempfile.mkdtemp(prefix='props-used-selftest-')
    try:
        def episode(name, props_js, other_js):
            src = os.path.join(tmp, name, 'src')
            os.makedirs(src, exist_ok=True)
            open(os.path.join(src, 'props.js'), 'w', encoding='utf-8').write(props_js)
            open(os.path.join(src, 'set.js'), 'w', encoding='utf-8').write(other_js)
            return os.path.join(tmp, name)

        CATALOG = """export function createBottle() { return {}; }
export function createCap() { return {}; }
export const PROPS = {
  'chai nhựa có nắp': () => createBottle(),
  'nắp chai rời': () => createCap(),
};
"""
        ep = episode('used', CATALOG,
                     "import * as P from './props.js';\nconst b = P.createBottle();\nconst c = P.createCap();\n")
        cases.append(('mọi vật trong danh mục đều lên màn hình thì đạt', main_ok(ep), dead_props(os.path.join(ep, 'src')), ''))

        ep = episode('dead', CATALOG, "import * as P from './props.js';\nconst b = P.createBottle();\n")
        dead = dead_props(os.path.join(ep, 'src'))
        cases.append(('vật trong danh mục mà phim không dùng thì không đạt', dead == ['nắp chai rời'], dead, ''))

        # a factory that is only *defined* is not used: the definition is not a call
        ep = episode('defined-only', CATALOG, "import * as P from './props.js';\n")
        dead = dead_props(os.path.join(ep, 'src'))
        cases.append(('chỉ định nghĩa mà không gọi thì vẫn là vật chết',
                      dead == ['chai nhựa có nắp', 'nắp chai rời'], dead, ''))

        # no catalogue at all: nothing to check, and nothing to fail
        ep = episode('empty', "export function x() {}\n", "const a = 1;\n")
        cases.append(('tập chưa có danh mục thì không đạt lỗi nào', dead_props(os.path.join(ep, 'src')) == [],
                      dead_props(os.path.join(ep, 'src')), ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    failed = 0
    for name, ok, got, extra in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' + (f'  [{str(got)[:200]}]' if not ok else ''))
        if not ok:
            failed += 1
    if failed:
        print(f'check_props_used --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'check_props_used --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main_ok(ep):
    """the check's own verdict on an episode, without printing"""
    return not dead_props(os.path.join(ep, 'src'))


if __name__ == '__main__':
    if '--selftest' in sys.argv[1:]:
        sys.exit(selftest())
    sys.exit(main())
