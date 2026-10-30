"""Đặt phần sửa của bảng cảnh vào ba file bảng cảnh: python src/apply_patch.py /tmp/patch.json

  python src/apply_patch.py /tmp/patch.json

patch = { patch: { <tên cảnh>: { drop: [số thứ tự dòng thẻ], reanchor: {số: {at, k}}, add: [{t, at, k, col}] } },
          pushes: { <tên cảnh>: số giây dời cảnh } }
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = ['shots.js', 'shots_a.js', 'shots_b.js']


def shot_blocks(src):
    """cắt file thành các khối cảnh: { tên cảnh: (start, end) }"""
    out = {}
    for m in re.finditer(r"\{ n: '([^']+)', at: '", src):   # a shot, not the items of a beat
        start = m.start()
        nxt = re.search(r"\n\s*\{ n: '", src[m.end():])   # the next shot, whatever its indentation
        end = m.end() + nxt.start() if nxt else len(src)
        out[m.group(1)] = (start, end)
    return out


def main():
    data = json.load(open(sys.argv[1], encoding='utf-8'))
    patch, pushes = data.get('patch', {}), data.get('pushes', {})
    for f in FILES:
        path = os.path.join(HERE, f)
        if not os.path.exists(path):
            continue
        src = open(path, encoding='utf-8').read()
        blocks = shot_blocks(src)
        edits = []          # (start, end, new text)
        for name in list(patch) + [n for n in pushes if n not in patch]:
            spec = patch.get(name, {'drop': [], 'reanchor': {}, 'add': []})
            if name not in blocks:
                continue
            s0, s1 = blocks[name]
            block = src[s0:s1]
            lines = re.findall(r"\{ t: '[^']*', at: '[^']+', k: \d+(?:, col: [^}]+)? \}", block)
            new_lines = []
            for j, l in enumerate(lines):
                if j in spec.get('drop', []):
                    continue
                r = spec.get('reanchor', {}).get(str(j))
                if r:
                    col = re.search(r"col: ([^,}]+)", l)
                    l = "{ t: '%s', at: '%s', k: %d, col: %s }" % (re.search(r"t: '([^']*)'", l).group(1), r['at'], r['k'], col.group(1) if col else 'PAL.hoodie.f')
                new_lines.append(l)
            for a in spec.get('add', []):
                new_lines.append("{ t: '%s', at: '%s', k: %d, col: %s }" % (a['t'], a['at'], a['k'], a['col']))
            if lines and new_lines != lines:
                first = block.index(lines[0])
                last = block.index(lines[-1]) + len(lines[-1])
                block = block[:first] + ', '.join(new_lines) + block[last:]
            if name in pushes:
                block = re.sub(r"off: -?[\d.]+", 'off: %.1f' % (pushes[name] if name in pushes else 0), block, count=1)
            edits.append((s0, s1, block))
        for s0, s1, block in sorted(edits, reverse=True):
            src = src[:s0] + block + src[s1:]
        open(path, 'w', encoding='utf-8').write(src)
        print(f, 'patched', len(edits), 'shots')


if __name__ == '__main__':
    main()
