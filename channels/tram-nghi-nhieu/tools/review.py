#!/usr/bin/env python3
"""Independent review of one step of a Trạm Nghĩ Nhiều episode, item by item.

  sh channels/tram-nghi-nhieu/tools/review.sh <episode> <step> [--again id,id|all]
      step: outline | script | look | props | picture | final

The rubric of each step is .agents/skills/tram-nghi-nhieu/step*/RUBRIC.md: a table of criteria, each CHẶN (blocks)
or GÓP Ý (advice). A fresh critic session (claude -p, in a scratch folder outside the repo) answers one row per item
and criterion:   <item> | <criterion> | ĐẠT|LỖI | <what it sees> | SỬA: <fix>
The tool decides, not the critic: an item passes when every CHẶN criterion is ĐẠT.

Scope. Only an item that is new, changed since it was judged, or asked for with --again goes to the critic. An item
that failed and has not changed is not judged again: it is listed as still to fix. An item that fails three times
becomes OPEN: the step closes anyway and the item stays listed in the reports. Look and picture compare what the
viewer sees (a small fingerprint of the frame, plus the line's text and labels), so a code edit re-judges only the
frames it changed.

Writes review/<step>.json (the state gate.py reads), review/<step>-<round>.md (what this round's critic said) and
review/<STEP>.md (the current summary: what to fix, what is open, the advice).
Exit: 0 the step is closed; 1 items to fix (listed); 2 could not run (the reason is printed: not a verdict).
Env: LEMO_CRITIC_MODEL (model for claude -p), CRITIC_TIMEOUT (seconds per critic call, default 900 + 90 per item).
"""
import base64, datetime, fcntl, glob, json, os, re, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gate  # noqa: E402

CHANNEL = os.path.dirname(HERE)
LIB = os.path.abspath(os.path.join(CHANNEL, '..', '..'))
STEP_DIR = {'outline': 'step1-outline', 'script': 'step2-script', 'look': 'step3-storyboard',
            'props': 'step5-props-code', 'picture': 'step6-assembly', 'final': 'step7-delivery'}
BATCH = {'outline': 1, 'script': 200, 'look': 12, 'props': 12, 'picture': 20, 'final': 1}
# Lô quá lớn thì người chấm không trả lời đủ: một lô mười hai khung hình thì người chấm
# bỏ dở, và vòng chấm không chấm được gì cả. `LEMO_CRITIC_BATCH` giới hạn lô nhỏ lại
# cho một vòng cần chạy nhanh (nhiều lô nhỏ hơn, mỗi lô chắc chắn hết).
_LIMIT = os.environ.get('LEMO_CRITIC_BATCH')
if _LIMIT:
    BATCH = {k: min(v, int(_LIMIT)) for k, v in BATCH.items()}
TRIES = 3   # failures before an item is OPEN
# Trần số vòng cho MỖI BƯỚC. Một bước chấm đi mãi thì không có đường ra: vòng N+1 chấm lại đúng
# những mục vòng N vừa chấm, và mỗi vòng lại mở ra một vòng mới (M1). Khi vòng chạm trần, bước đóng
# lại với những mục còn lại ở trạng thái MỞ — cùng luật "sai ba lần thì thành MỞ" áp cho cả bước.
# Số vòng đã chạy nằm trong state (`round`), nên trần này sống qua cả những lần khởi chạy lại.
MAX_ROUNDS = {'outline': 4, 'script': 6, 'look': 8, 'props': 8, 'picture': 8, 'final': 1}
_ROUND_LIMIT = os.environ.get('LEMO_MAX_ROUNDS')
if _ROUND_LIMIT:
    MAX_ROUNDS = {k: int(_ROUND_LIMIT) for k in MAX_ROUNDS}
OLD_FLAGS = {'--outline': 'outline', '--script': 'script', '--storyboard': 'look', '--props': 'props',
             '--final': 'final'}


class CannotRun(Exception):
    """the round could not run: not a verdict about the film"""


def say(*a): print('review:', *a, file=sys.stderr)


# ——— the rubric ———

ROW_RE = re.compile(r'^\|\s*([a-z0-9-]+)\s*\|\s*(CHẶN|GÓP Ý)\s*\|\s*(.+?)\s*\|\s*$', re.M)


def rubric(step):
    """(full text, [(id, kind, question)])"""
    for root in (os.path.join(LIB, '.agents/skills'), os.path.join(LIB, '.claude/skills'),
                 os.path.expanduser('~/.agents/skills'), os.path.expanduser('~/.claude/skills')):
        p = os.path.join(root, 'tram-nghi-nhieu', STEP_DIR[step], 'RUBRIC.md')
        if os.path.isfile(p):
            text = open(p, encoding='utf-8').read()
            crit = ROW_RE.findall(text)
            if not crit: raise CannotRun(f'{p} không có bảng tiêu chí (| id | CHẶN/GÓP Ý | câu hỏi |)')
            return text, crit
    raise CannotRun(f'không tìm thấy RUBRIC.md của bước {step} ({STEP_DIR[step]})')


# ——— the critic's answer ———

VERD = {'ĐẠT': 'ĐẠT', 'DAT': 'ĐẠT', 'PASS': 'ĐẠT', 'LỖI': 'LỖI', 'LOI': 'LỖI', 'FAIL': 'LỖI'}


def parse(text, ids, crit_ids):
    """{item: {criterion: (ĐẠT|LỖI, seen, fix)}} from the critic's rows; rows naming unknown items are dropped"""
    out = {}
    for raw in (text or '').splitlines():
        s = raw.strip().strip('`').strip()
        s = re.sub(r'^[-*]\s+', '', s).strip('|').strip()
        parts = [p.strip() for p in s.split('|')]
        if len(parts) < 4: continue
        item, cid, v = parts[0].strip('`*#: '), parts[1].strip('`*: ').lower(), parts[2].strip('`* ').upper()
        if item not in ids or cid not in crit_ids or v not in VERD: continue
        rest = parts[3:]
        fix = ''
        for i, p in enumerate(rest):
            m = re.match(r'^SỬA\s*:\s*(.*)$', p, re.I)
            if m: fix = ' | '.join([m.group(1)] + rest[i + 1:]).strip(); rest = rest[:i]; break
        seen = ' | '.join(rest).strip()
        if not seen: continue   # a verdict without evidence is not an answer
        out.setdefault(item, {})[cid] = (VERD[v], seen, fix)
    return out


# ——— fingerprints: "has what the viewer sees changed?" ———

def fingerprint(path):
    from PIL import Image
    im = Image.open(path).convert('L').resize((48, 27), Image.BILINEAR)
    return base64.b64encode(im.tobytes()).decode()


def fp_close(a, b):
    if not a or not b: return False
    x, y = base64.b64decode(a), base64.b64decode(b)
    if len(x) != len(y): return False
    d = [abs(p - q) for p, q in zip(x, y)]
    return max(d) <= 32 and sum(d) / len(d) <= 3


# ——— the critic ———

def claude(prompt, cwd, timeout):
    cli = os.environ.get('LEMO_CRITIC_CLI', 'claude')
    if not shutil.which(cli): raise CannotRun(f"không có người chấm: lệnh '{cli}' chưa cài")
    model = os.environ.get('LEMO_CRITIC_MODEL')
    cmd = [cli, '-p', '--dangerously-skip-permissions'] + (['--model', model] if model else []) + [prompt]
    try:
        r = subprocess.run(cmd, cwd=cwd, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired as e:
        return (e.stdout.decode() if isinstance(e.stdout, bytes) else e.stdout) or ''
    return r.stdout or ''


def critic_id():
    return f"{os.environ.get('LEMO_CRITIC_CLI', 'claude')} -p" + (f" --model {os.environ['LEMO_CRITIC_MODEL']}"
                                                                    if os.environ.get('LEMO_CRITIC_MODEL') else '')


BAR = ('## Chuẩn chấm\n'
       'Người xem của kênh xem một lần, trên điện thoại. Câu CHẶN là LỖI khi bạn chỉ ra được một chỗ cụ thể làm người '
       'xem đó không thấy, đọc sai, hay hiểu sai điều mục này phải nói. Một chỗ có thể làm đẹp hơn mà người xem vẫn '
       'thấy và hiểu đúng thì câu CHẶN là ĐẠT, và điều đó ghi ở GÓP Ý.')


def prompt_for(rubric_text, crit, batch, prev, cwd, extra=''):
    must = [c for c, k, _ in crit if k == 'CHẶN']
    advice = [c for c, k, _ in crit if k != 'CHẶN']
    T = [f"Bạn là người chấm độc lập cho một tập của kênh Trạm Nghĩ Nhiều: phim giải thích khoa học bằng diorama 3D "
         f"toon. Bạn chưa từng thấy mã nguồn hay ghi chú của người làm phim. Mọi thứ bạn cần nằm trong thư mục làm việc "
         f"{cwd}; đừng tìm tệp ở nơi khác.", '', rubric_text.strip(), '', BAR, '']
    if extra: T += [extra.strip(), '']
    T += [f'## MỤC cần chấm ({len(batch)})'] + [it['label'] for it in batch] + ['']
    if prev:
        T += ['## Lần chấm trước nói các mục này còn lỗi: xem đã sửa chưa'] + prev + ['']
    T += ['## Cách trả lời',
          'Chỉ in các dòng theo mẫu dưới đây, mỗi dòng một ô. Không bảng markdown, không tiêu đề, không lời dẫn.',
          '<mã mục> | <mã tiêu chí> | ĐẠT hoặc LỖI | <thấy gì: điều cụ thể bạn thấy, ở chỗ nào> | SỬA: <cách sửa, chỉ khi LỖI>',
          f"- Mỗi mục phải có một dòng cho MỖI tiêu chí CHẶN: {', '.join(must)}.",
          f"- Tiêu chí GÓP Ý ({', '.join(advice) or 'không có'}): chỉ viết khi có điều đáng nói.",
          '- "thấy gì" là bằng chứng bạn tự thấy trong tệp hay ảnh. Một lời chung chung thì không phải bằng chứng.',
          '- Mở ảnh ở cỡ thật, từng ảnh một.',
          'Viết xong các dòng thì dừng. Đừng để việc nào chạy nền sau câu trả lời.']
    return '\n'.join(T)


# ——— one round: decide the scope, ask, record ———

def scope(st, items, again=()):
    """split the items into (to judge, still failing and unchanged, unchanged and closed)

    "Has this item changed?" is answered by the *source* that made it, not by the picture alone.
    The picture fingerprint is a 48x27 grey blur: it cannot see a shape that moved inside it, so a
    vật whose code was rewritten came out "unchanged" and kept a verdict nobody gave it (M13) — and
    the gate then reported that code as judged. The digest of the source is exact and free
    (`props_catalog.digest` already hashes the prop and the helpers it imports), so it is asked
    first: if the source moved, the item is judged again whatever the blur says.

    Một bước KẾ HOẠCH (`gate.PLANS`: outline, look) đã đóng thì không mở lại: "sau đó có sửa thì
    cũng vậy" (gate.py:14). Nếu nó mở lại thì bước kế tiếp bị chặn và vòng lặp quay lại (M3) — đó là
    cái đã giữ ba tập 45 giờ. Muốn chấm lại thì nói rõ: `--again`.
    """
    judge, failing, kept = [], [], []
    plan_closed = bool(st.get('closed')) and not again
    for it in items:
        rec = st['items'].get(it['id'])
        same = bool(rec) and rec.get('key') == it.get('key') and ('fp' not in it or fp_close(rec.get('fp'), it['fp']))
        if rec and it.get('src') and rec.get('src') and rec.get('src') != it.get('src'):
            same = False   # the code moved: this is a different item, not the one that was judged
        if plan_closed and rec and rec.get('verdict') in gate.CLOSED:
            kept.append(it)   # bước kế hoạch đã đóng: giữ phán quyết cũ
        elif not same or 'all' in again or it['id'] in again or rec.get('verdict') not in ('PASS', 'OPEN', 'FAIL'):
            judge.append(it)
        elif rec['verdict'] == 'FAIL':
            failing.append(it)
        else:
            kept.append(it)
    return judge, failing, kept


def previous_rows(st, batch):
    rows = []
    for it in batch:
        for c, (v, seen, fix) in rows_of(st['items'].get(it['id'], {})).items():
            if v == 'LỖI': rows.append(f"{it['id']} | {c} | LỖI | {seen} | SỬA: {fix}")
    return rows


def judge(st, crit, batch, ask, rnd):
    """ask the critic about one batch, record the verdicts; returns the items it did not answer in full"""
    must = [c for c, k, _ in crit if k == 'CHẶN']
    ids = [it['id'] for it in batch]
    got = parse(ask(batch, previous_rows(st, batch)), set(ids), {c for c, _, _ in crit})
    missing = [it for it in batch if not all(c in got.get(it['id'], {}) for c in must)]
    if missing:   # one more chance for what the critic skipped
        again = parse(ask(missing, previous_rows(st, missing)), {it['id'] for it in missing}, {c for c, _, _ in crit})
        for k, v in again.items(): got.setdefault(k, {}).update(v)
        missing = [it for it in batch if not all(c in got.get(it['id'], {}) for c in must)]
    for it in batch:
        if it in missing: continue
        rows = got[it['id']]
        old = st['items'].get(it['id'], {})
        failed = any(rows[c][0] == 'LỖI' for c in must)
        tries = old.get('fails', 0) + (1 if failed else 0)
        verdict = 'PASS' if not failed else ('OPEN' if tries >= TRIES else 'FAIL')
        # OPEN là kết cục, không phải một phán quyết tạm: "sai ba lần thì thành MỞ, bước đóng và đi
        # tiếp, mục đó nằm trong báo cáo cho người dùng" (SKILL.md). Một vòng sau đạt ĐẠT thì phán
        # quyết đó biến mất khỏi báo cáo (M15). Nó giữ nguyên MỞ; số lần sai vẫn đếm lên.
        if old.get('verdict') == 'OPEN':
            verdict = 'OPEN'
        rec = {k: v for k, v in it.items() if k in ('key', 'fp', 'src', 'name')}
        rec.update(verdict=verdict, fails=tries, round=rnd, rows=rows)
        st['items'][it['id']] = rec
    return missing


def judge_changed(st, critic):
    """the judge of this step changed since the last round — say so, loudly.

    Một mục được người A chấm ĐẠT rồi người B chấm LỖI thì vòng sau phải chấm lại, và người đọc báo
    cáo không biết tiêu chuẩn nào đã dùng cho mục nào (P9). Một tập nên dùng MỘT người chấm suốt tập;
    đổi người giữa chừng là một quyết định có chủ ý, và những mục đã chấm phải chấm lại (`--again all`)
    để tiêu chuẩn là một.
    """
    seen = st.get('critic')
    if seen and seen != critic:
        return (f'người chấm của bước này đã đổi: vòng trước dùng "{seen}", vòng này dùng "{critic}". '
                f'Mọi mục đã chấm phải chấm lại để tiêu chuẩn là một '
                f'(chạy lại với --again all), nếu không thì hai tiêu chuẩn nằm chung một báo cáo.')
    return None


def run(ep, step, items, crit, ask, again=(), report=None):
    """the engine: scope → ask in batches → record. Returns (judged, failing, missing)."""
    st = gate.load(ep, step)
    todo, failing, kept = scope(st, items, again)
    for it in kept:   # unchanged and closed: refresh what the gate checks (a source edit that changed no pixel)
        for k in ('key', 'src', 'name'):
            # 'src' is refreshed ONLY when the source itself did not move. A source that moved is
            # exactly what scope() sends back for judging, so a kept item's 'src' is its own by
            # definition — overwriting it here is what turned "nobody looked at this code" into
            # "ĐẠT" (M13). Keep the verdict's own digest.
            if k in it and not (k == 'src' and st['items'][it['id']].get('src') != it.get('src')):
                st['items'][it['id']][k] = it[k]
    missing = []
    if todo:
        st['round'] = st.get('round', 0) + 1
        cap = MAX_ROUNDS.get(step)
        if cap and st['round'] > cap:
            # Chạm trần số vòng. Bước này không chấm nữa: mọi mục còn lại thành MỞ, bước đóng lại,
            # và báo cáo nói rõ vì sao (M1). Một bước chấm đi mãi không có đường ra — nó chỉ có
            # đường ra khi ai đó nói "dừng lại".
            st['round'] = cap
            for it in todo:
                rec = st['items'].get(it['id'], {})
                rec = dict(rec)
                rec.update(verdict='OPEN', fails=max(rec.get('fails', 0), TRIES), round=st['round'])
                st['items'][it['id']] = rec
            say(f'bước {step} đã chạm trần {cap} vòng: {len(todo)} mục chưa được chấm là ĐẠT '
                f'chuyển thành MỞ và bước đóng lại.')
            todo = []
        else:
            for i in range(0, len(todo), BATCH[step]):
                missing += judge(st, crit, todo[i:i + BATCH[step]], ask, st['round'])
                gate.save(ep, step, st)
    ids = {it['id'] for it in items}
    st['items'] = {k: v for k, v in st['items'].items() if k in ids}   # items the episode no longer has
    gate.save(ep, step, st)
    if report and todo: report(st, todo, missing)
    return st, todo, failing, missing


# ——— reports ———

def rows_of(rec):
    """{criterion: (verdict, seen, fix)} — an item migrated from the old stamp has rows as a list"""
    v = rec.get('rows')
    return v if isinstance(v, dict) else {}


def write_reports(ep, step, crit, st, judged, missing):
    kinds = {c: k for c, k, _ in crit}
    rnd = st['round']
    stamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    R = [f'# {step} — vòng {rnd}', '', f'Người chấm: {critic_id()} · {stamp} · {len(judged)} mục được chấm', '']
    for it in judged:
        rec = st['items'].get(it['id'])
        if not rec or it in missing:
            R.append(f"## {it['id']} — người chấm chưa trả lời đủ"); R.append(''); continue
        R.append(f"## {it['id']} — {rec['verdict']}" + (f" ({rec['name']})" if rec.get('name') else ''))
        for c, (v, seen, fix) in rows_of(rec).items():
            R.append(f"- {c} [{kinds.get(c, '?')}] {v}: {seen}" + (f' → SỬA: {fix}' if fix else ''))
        R.append('')
    open(os.path.join(ep, 'review', f'{step}-{rnd}.md'), 'w', encoding='utf-8').write('\n'.join(R))
    summary(ep, step, crit, st)


def summary(ep, step, crit, st):
    kinds = {c: k for c, k, _ in crit}
    by = {'FAIL': [], 'OPEN': [], 'PASS': []}
    for k, r in st['items'].items(): by.setdefault(r.get('verdict'), []).append((k, r))
    S = [f'# {step}: tóm tắt sau vòng {st.get("round", 0)}', '',
         f"{len(by['PASS'])} ĐẠT · {len(by['OPEN'])} MỞ · {len(by['FAIL'])} PHẢI SỬA", '']

    def rows(r, want):
        return [f"  - {c}: {seen}" + (f' → SỬA: {fix}' if fix else '')
                for c, (v, seen, fix) in rows_of(r).items() if want(c, v)]
    if by['FAIL']:
        S += ['## Phải sửa (lỗi CHẶN)']
        for k, r in by['FAIL']:
            S += [f"- {k}" + (f" ({r['name']})" if r.get('name') else '') + f" — lần sai {r['fails']}/{TRIES}"]
            S += rows(r, lambda c, v: v == 'LỖI' and kinds.get(c) == 'CHẶN')
        S.append('')
    if by['OPEN']:
        S += ['## Mở (sai 3 lần; bước vẫn đi tiếp, ghi lại để rút kinh nghiệm)']
        for k, r in by['OPEN']:
            S += [f"- {k}" + (f" ({r['name']})" if r.get('name') else '')] + rows(r, lambda c, v: v == 'LỖI')
        S.append('')
    advice = [(k, r) for k, r in st['items'].items()
              if any(v == 'LỖI' and kinds.get(c) != 'CHẶN' for c, (v, _, _) in rows_of(r).items())]
    if advice:
        S += ['## Góp ý (không chặn)']
        for k, r in advice:
            S += [f'- {k}'] + rows(r, lambda c, v: v == 'LỖI' and kinds.get(c) != 'CHẶN')
        S.append('')
    open(os.path.join(ep, 'review', f'{step.upper()}.md'), 'w', encoding='utf-8').write('\n'.join(S))


# ——— machine checks that run before any critic ———

def machine(ep, *tools):
    for t in tools:
        name, *args = (t,) if isinstance(t, str) else t
        r = subprocess.run([sys.executable, os.path.join(HERE, name), *args, ep], capture_output=True, text=True)
        out = (r.stdout + r.stderr).strip()
        if r.returncode == 1:
            print(out, file=sys.stderr)
            return f'{name} chặn (đọc lý do ở trên), sửa rồi chạy lại'
        if r.returncode not in (0, 1): raise CannotRun(f'{name} không chạy được: {out[-400:]}')
    return None


def node(*args):
    env = dict(os.environ); env.setdefault('LEMO_ANGLE', 'vulkan')
    r = subprocess.run(['node', *args], cwd=LIB, capture_output=True, text=True, env=env)
    if r.returncode != 0: raise CannotRun(f"node {' '.join(args[:2])} lỗi: {(r.stderr or r.stdout)[-600:]}")
    return r.stdout


# ——— each step: its items and how the critic sees them ———

def copy(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy(src, dst)


def prepare(ep, step, W, again=()):
    """(items, extra prompt text, blocking reason or None); copies what the critic sees into W"""
    rel = os.path.relpath(ep, LIB)
    if step == 'outline':
        for f in ('TREATMENT.md', 'research/FACTS.md'):
            if not os.path.isfile(os.path.join(ep, f)): raise CannotRun(f'thiếu {f}')
        why = machine(ep, 'check_treatment.py', 'check_research.py')
        copy(os.path.join(ep, 'TREATMENT.md'), os.path.join(W, 'TREATMENT.md'))
        copy(os.path.join(ep, 'research/FACTS.md'), os.path.join(W, 'FACTS.md'))
        copy(os.path.join(CHANNEL, 'STRATEGY.md'), os.path.join(W, 'STRATEGY.md'))
        return [{'id': 'dan-y', 'key': gate.outline_key(ep), 'label': 'dan-y — TREATMENT.md cùng FACTS.md'}], \
            'Tệp: TREATMENT.md, FACTS.md, STRATEGY.md (đường lối của kênh).', why
    L = gate.lines(ep)
    if step in ('script', 'picture', 'final') and not L: raise CannotRun('chưa có voice/lines.json')
    if step == 'script':
        digits = [x['id'] for x in L if re.search(r'\d', x['text'])]
        if digits:
            return [], '', f"câu có chữ số (đọc số thành chữ): {', '.join(digits)}"
        why = machine(ep, 'check_voice_facts.py')
        audit = subprocess.run([sys.executable, os.path.join(LIB, 'tools/check_script.py'), ep],
                               capture_output=True, text=True)
        open(os.path.join(W, 'MAY-DO.txt'), 'w').write((audit.stdout + audit.stderr)[:3000])
        copy(os.path.join(ep, 'voice/lines.json'), os.path.join(W, 'lines.json'))
        for f, d in (('TREATMENT.md', 'TREATMENT.md'), ('research/FACTS.md', 'FACTS.md')):
            if os.path.isfile(os.path.join(ep, f)): copy(os.path.join(ep, f), os.path.join(W, d))
        keys = gate.line_keys(ep)
        return [{'id': str(x['id']), 'key': keys[str(x['id'])], 'label': f"{x['id']} — {x['text']}"} for x in L], \
            'Tệp: lines.json (cả lời kể), TREATMENT.md, FACTS.md, MAY-DO.txt (máy đo lặp từ và nhịp, chỉ để tham khảo).', why
    if step == 'look':
        H = gate.hero_files(ep)
        if not H: raise CannotRun(f'{rel}/review/hero/ chưa có ảnh: dựng khung hình chính bằng core/render/still.mjs vào đó')
        why = machine(ep, 'check_storyboard.py')
        for k, p in H.items(): copy(p, os.path.join(W, 'hero', k + os.path.splitext(p)[1]))
        for p in glob.glob(os.path.join(CHANNEL, 'demo/stills/*.jpg'))[:4]: copy(p, os.path.join(W, 'ref', os.path.basename(p)))
        copy(os.path.join(CHANNEL, 'STYLE.md'), os.path.join(W, 'STYLE.md'))
        if os.path.isfile(os.path.join(ep, 'LOOK.md')): copy(os.path.join(ep, 'LOOK.md'), os.path.join(W, 'LOOK.md'))
        return [{'id': k, 'key': '', 'fp': fingerprint(p), 'label': f'{k} — hero/{os.path.basename(p)}'} for k, p in H.items()], \
            'Tệp: STYLE.md, LOOK.md, ảnh mẫu của kênh trong ref/.', why
    if step == 'props':
        if not os.path.isfile(os.path.join(ep, 'COMPONENTS_SPEC.md')):
            return [], '', 'chưa có COMPONENTS_SPEC.md (bước 4: danh sách linh kiện trước khi dựng vật)'
        import props_catalog
        probs = props_catalog.problems(ep)
        if probs: return [], '', 'danh mục vật: ' + '; '.join(probs)
        why = machine(ep, 'check_props_refs.py')
        st = gate.load(ep, 'props')
        cat = props_catalog.catalog(ep)
        if not cat: raise CannotRun('tập chưa có vật nào (src/props/ hay src/props.js)')
        items, need = [], []
        for x in cat:
            src = props_catalog.digest(ep, x)
            rec = st['items'].get(x['id'])
            it = {'id': x['id'], 'name': x['name'], 'src': src, 'key': ''}
            if rec and rec.get('src') == src and rec.get('fp') and x['id'] not in again and 'all' not in again:
                it['fp'] = rec['fp']   # source unchanged: same picture, no render
            else: need.append(x)
            items.append(it)
        if need:
            sel = os.path.join(W, 'only.json'); json.dump([x['name'] for x in need], open(sel, 'w'), ensure_ascii=False)
            node('channels/tram-nghi-nhieu/tools/propcheck.mjs', rel, '--out', os.path.join(W, 'render'), '--only', sel)
            made = {p['name']: p['f'] for p in json.load(open(os.path.join(W, 'render/props.json')))}
            for it in items:
                if it['name'] in made: it['fp'] = fingerprint(made[it['name']]); it['img'] = made[it['name']]
            lost = [x['name'] for x in need if x['name'] not in made]
            if lost: raise CannotRun(f"propcheck không dựng được: {', '.join(lost)}")
        for it in items:
            it['label'] = f"{it['id']} — {it['name']} — ảnh p/{it['id']}.jpg"
            if 'img' in it: copy(it.pop('img'), os.path.join(W, 'p', it['id'] + '.jpg'))
        copy(os.path.join(CHANNEL, 'STYLE.md'), os.path.join(W, 'STYLE.md'))
        return items, 'Tệp: STYLE.md, BLIND.md (tên do người xem không biết tên định dựng gọi).', why
    if step == 'picture':
        ph = gate.placeholders(ep)
        if ph: return [], '', f"{', '.join(ph)} vẫn là file giữ chỗ"
        # the flags (DARK SAME RUN NUM, phủ) go to the critic as hints; only what the machine measures blocks
        why = machine(ep, 'check_labels.py', 'check_label_anchors.py', ('check_shots.py', '--note'), 'check_props_used.py')
        B = beats(ep, rel)
        keys = gate.line_keys(ep)
        items, prev = [], None
        for b in B:
            lid = str(b.get('id') or f"c{b['n']}")
            f = os.path.join(LIB, b['f']) if not os.path.isabs(b['f']) else b['f']
            shown = b.get('shown') or []
            it = {'id': lid, 'key': gate.sha((keys.get(lid, '') + json.dumps(shown, ensure_ascii=False)).encode()),
                  'src': keys.get(lid, ''), 'fp': fingerprint(f), 'f': f, 'prev': prev}
            flags = ' '.join(b.get('flags') or []) or '—'
            cover = f"{int(round(100 * b['cover']))}%" if b.get('cover') is not None else '?'
            it['label'] = (f"{lid} — b/{lid}.jpg — lời: {b.get('text', '')} — nhãn: "
                           f"{' · '.join(shown) or '(không có)'} — cờ: {flags} — phủ {cover}")
            items.append(it); prev = f
        for it in items:
            copy(it.pop('f'), os.path.join(W, 'b', it['id'] + '.jpg'))
            p = it.pop('prev')
            if p: copy(p, os.path.join(W, 'b', it['id'] + '-truoc.jpg'))
        it_keys = {it['id'] for it in items}
        missing = [k for k in keys if k not in it_keys]
        if missing: raise CannotRun(f"tờ nhịp không có khung cho {', '.join(missing[:8])}")
        return items, '', why
    raise CannotRun(f'bước không biết: {step}')


def beats(ep, rel):
    """the beat sheet of the whole film, rendered unless review/beatsheet/ is newer than every source"""
    out = os.path.join(ep, 'review', 'beatsheet')
    bj = os.path.join(out, 'beats.json')
    srcs = [f for f in gate.picture_files(ep) if os.path.isfile(f)] + [os.path.join(ep, 'voice/lines.json')]
    srcs += glob.glob(os.path.join(ep, 'voice/proc/dur.json'))
    fresh = os.path.isfile(bj) and os.path.getmtime(bj) >= max(os.path.getmtime(f) for f in srcs)
    if fresh:
        B = json.load(open(bj, encoding='utf-8'))
        if not any(b.get('skipped') for b in B):
            say('dùng lại tờ nhịp review/beatsheet/: không tệp nào đổi sau lần dựng đó')
            return B
    say('dựng tờ nhịp (một khung mỗi câu, ~20 s mỗi câu)…')
    node('channels/tram-nghi-nhieu/tools/beatsheet.mjs', rel, '--out', os.path.relpath(out, LIB))
    return json.load(open(bj, encoding='utf-8'))


def blind_names(items, W, ask_raw):
    """a second critic names each prop without its intended name; writes W/BLIND.md"""
    todo = [it for it in items if os.path.isfile(os.path.join(W, 'p', it['id'] + '.jpg'))]
    if not todo: return
    B = os.path.join(W, 'blind'); os.makedirs(B, exist_ok=True)
    alias = {}
    for i, it in enumerate(todo, 1):
        a = f'x{i:02d}'; alias[a] = it['id']; shutil.copy(os.path.join(W, 'p', it['id'] + '.jpg'), os.path.join(B, a + '.jpg'))
    text = ask_raw(
        f"Thư mục này có {len(todo)} ảnh x01.jpg…; mỗi ảnh là MỘT vật 3D kiểu hoạt hình nhìn từ ba phía trên nền trơn. "
        "Mở từng ảnh ở cỡ thật và gọi tên vật như một người xem bình thường sẽ gọi. In mỗi ảnh một dòng, không gì khác:\n"
        "x01 | <tên vật> | chắc: cao|vừa|thấp | <chi tiết làm bạn gọi tên như vậy>", B, 600 + 60 * len(todo))
    rows = []
    for line in (text or '').splitlines():
        m = re.match(r'^\s*[-*]?\s*(x\d{2})\b\s*\|\s*(.+)$', line.strip())
        if m and m.group(1) in alias: rows.append(f'{alias[m.group(1)]} | tên mù: {m.group(2).strip()}')
    open(os.path.join(W, 'BLIND.md'), 'w', encoding='utf-8').write(
        '# Tên mù (người gọi tên không biết tên định dựng)\n\n' + ('\n'.join(rows) or '(người gọi tên không trả lời)') + '\n')


def final(ep, W, rubric_text, crit, ask_raw):
    """report only: frames of the finished film, one per line → review/FINAL-QA.md; never blocks"""
    movies = sorted(glob.glob(os.path.join(ep, '*.mp4')), key=os.path.getmtime)
    if not movies: raise CannotRun('chưa có phim .mp4 trong thư mục tập')
    mp4 = movies[-1]
    bj = os.path.join(ep, 'review/beatsheet/beats.json')
    if not os.path.isfile(bj): raise CannotRun('cần review/beatsheet/beats.json (thời điểm từng câu): chạy review picture trước')
    B = json.load(open(bj, encoding='utf-8'))
    os.makedirs(os.path.join(W, 'f'), exist_ok=True)
    shown = []
    for b in B:
        lid = str(b.get('id') or f"c{b['n']}")
        t = b['t0'] + 0.6 * (b['t1'] - b['t0'])
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{t:.2f}', '-i', mp4, '-frames:v', '1',
                        '-vf', 'scale=1280:-1', '-q:v', '3', os.path.join(W, 'f', lid + '.jpg')], check=False)
        shown.append(f"{lid}: {' · '.join(b.get('shown') or []) or '—'}")
    open(os.path.join(W, 'shown.txt'), 'w', encoding='utf-8').write('\n'.join(shown) + '\n')
    copy(os.path.join(ep, 'voice/lines.json'), os.path.join(W, 'lines.json'))
    batch = [{'id': 'phim', 'label': f'phim — {os.path.basename(mp4)} — {len(B)} khung trong f/'}]
    text = ask_raw(prompt_for(rubric_text, crit, batch, [], W), W, 900 + 30 * len(B))
    got = parse(text, {'phim'}, {c for c, _, _ in crit}).get('phim', {})
    if not got: raise CannotRun('người chấm nghiệm thu không trả lời theo mẫu')
    R = [f'# Nghiệm thu: {os.path.basename(mp4)}', '',
         f"Người chấm: {critic_id()} · {datetime.datetime.now():%Y-%m-%d %H:%M} · báo cáo, không chặn", '']
    for line in (text or '').splitlines():
        p = parse(line, {'phim'}, {c for c, _, _ in crit}).get('phim')
        if p:
            for c, (v, seen, fix) in p.items(): R.append(f'- {c} {v}: {seen}' + (f' → SỬA: {fix}' if fix else ''))
    open(os.path.join(ep, 'review/FINAL-QA.md'), 'w', encoding='utf-8').write('\n'.join(R) + '\n')
    print(f'review final: báo cáo ở {os.path.relpath(ep, LIB)}/review/FINAL-QA.md (không chặn)')
    return 0


# ——— the command ———

def main(argv):
    a = list(argv)
    if a[:1] == ['--selftest']: return selftest()
    if not a or not os.path.isdir(a[0]): say(__doc__); return 2
    ep = os.path.abspath(a.pop(0))
    step, again, rng = None, [], None
    while a:
        x = a.pop(0)
        if x in gate.STEPS: step = x
        elif x in OLD_FLAGS: step = OLD_FLAGS[x]
        elif x == '--again' and a: again = a.pop(0).split(',')
        elif x == '--assets':
            print('review: bước 4 không còn vòng chấm riêng; COMPONENTS_SPEC.md được máy kiểm ở vòng props và picture.'); return 0
        elif x in ('--lines', '--chapter', '--scene') and a:
            a.pop(0); rng = x   # the picture round already re-judges only the lines whose frame changed
        elif x == '--video':
            say('--video đã bỏ: phim dựng xong là xong; báo cáo nghiệm thu là: review.sh <tập> final'); return 2
        else:
            say(f'không hiểu: {x}'); return 2
    if step is None: step = 'picture'
    if rng: say(f'{rng} không cần nữa: vòng picture chỉ chấm lại những câu có hình đổi')
    prev = gate.PREV.get(step)
    if prev and step != 'final':
        why = gate.why_open(ep, prev)
        if why:
            say(f'bước trước ({prev}) chưa xong: {why}. Chạy trước: {gate.run_cmd(ep, prev)}'); return 2
    import layout
    for r in layout.report(ep): say('bố cục: ' + r)   # never blocks: the round goes on
    os.makedirs(os.path.join(ep, 'review'), exist_ok=True)
    lock = open(os.path.join(ep, 'review', f'.lock-{step}'), 'w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        say(f'một vòng {step} đang chạy trên tập này: chờ nó xong (harness báo), rồi đọc review/{step.upper()}.md'); return 2
    W = tempfile.mkdtemp(prefix=f'lemo-review-{step}-')
    try:
        return _main(ep, step, again, W)
    except CannotRun as e:
        say(f'vòng chấm không chạy được (đây không phải phán quyết về phim): {e}'); return 2
    finally:
        shutil.rmtree(W, ignore_errors=True)


def _main(ep, step, again, W):
    rubric_text, crit = rubric(step)

    def ask_raw(prompt, cwd, timeout):
        return claude(prompt, cwd, int(os.environ.get('CRITIC_TIMEOUT') or timeout))
    if step == 'final': return final(ep, W, rubric_text, crit, ask_raw)
    items, extra, block = prepare(ep, step, W, again)
    if block:
        say(f'máy chặn trước khi tốn một vòng chấm: {block}'); return 1
    if step == 'props':
        st = gate.load(ep, 'props')
        todo, _, _ = scope(st, items, again)
        blind_names(todo, W, ask_raw)
    images = step in ('look', 'props', 'picture')

    def ask(batch, prev):
        say(f'người chấm đang chấm {len(batch)} mục ({step})…')
        return ask_raw(prompt_for(rubric_text, crit, batch, prev, W, extra), W,
                       900 + (90 if images else 10) * len(batch))
    # P9: người chấm là một phần của tiêu chuẩn. Nếu nó đổi giữa chừng thì những mục đã chấm phải
    # chấm lại để tiêu chuẩn là một; nếu không, báo cáo có hai tiêu chuẩn trong một state.
    critic = critic_id()
    before = gate.load(ep, step)
    changed = judge_changed(before, critic)
    if changed and 'all' not in again:
        say(changed)
        say('chạy lại với --again all để chấm lại toàn bộ dưới người chấm mới.')
        return 2
    st, todo, failing, missing = run(ep, step, items, crit, ask, again,
                                     report=lambda s, j, m: write_reports(ep, step, crit, s, j, m))
    st['critic'] = critic
    capped = st.get('round') and st['round'] >= MAX_ROUNDS.get(step, 10 ** 6) and not todo and not missing
    if step == 'picture' and not missing:
        st['src'] = gate.picture_src(ep)   # every frame of this code has been looked at
    if step in gate.PLANS:
        # Một BƯỚC KẾ HOẠCH (outline, look) đã đóng thì đóng: "sau đó có sửa thì cũng vậy" (gate.py).
        # Nhưng phạm vi của vòng lại quyết bằng dấu vân tay ảnh, nên một vật sửa xong làm dấu vân
        # tay của nó đổi, vòng sau chấm lại nó, và `closed` bị tính lại thành False — bước kế tiếp bị
        # chặn, và vòng lặp quay lại (M3). Nay một bước kế hoạch đã đóng thì KHÔNG mở lại; muốn chấm
        # lại thì nói rõ (`--again`).
        if st.get('closed') and not again:
            pass                      # đã đóng thì giữ nguyên đóng
        else:
            st['closed'] = not missing and all(r.get('verdict') in gate.CLOSED for r in st['items'].values())
    gate.save(ep, step, st)
    if not todo: summary(ep, step, crit, st)
    fails = [k for k, r in st['items'].items() if r.get('verdict') == 'FAIL']
    opened = [k for k, r in st['items'].items() if r.get('verdict') == 'OPEN']
    rel = os.path.relpath(ep, LIB)
    print(f'review {step}: {len(todo) - len(missing)} mục được chấm lần này, {len(fails)} phải sửa, {len(opened)} mở; '
          f'tóm tắt: {rel}/review/{step.upper()}.md')
    if failing: print(f"  chưa sửa từ lần trước (không chấm lại khi chưa đổi; --again <mã> để chấm lại): {', '.join(i['id'] for i in failing)}")
    if missing:
        say(f"người chấm không trả lời đủ cho: {', '.join(i['id'] for i in missing)} — chạy lại lệnh này"); return 2
    if fails: return 1
    if capped:
        print(f'review {step}: XONG (đã chạm trần {MAX_ROUNDS[step]} vòng — mục chưa ĐẠT nằm ở MỞ, xem {rel}/review/{step.upper()}.md)')
        return 0
    print(f'review {step}: XONG')
    return 0


# ——— selftest: the engine with a stand-in critic, no GPU, no model ———

def selftest():
    tmp = tempfile.mkdtemp(prefix='review-selftest-')
    ok = True

    def expect(cond, what):
        nonlocal ok
        print(('ok   ' if cond else 'FAIL ') + what); ok = ok and cond
    try:
        crit = [('a', 'CHẶN', 'q'), ('b', 'CHẶN', 'q'), ('g', 'GÓP Ý', 'q')]
        txt = ('c1 | a | ĐẠT | thấy áo ở giữa khung | \n- `c1` | b | LỖI | nhãn bị cắt ở mép trên | SỬA: hạ nhãn\n'
               '| c2 | a | DAT | ok rõ |\nc2 | b | ĐẠT | |\nc9 | a | ĐẠT | x\nnói linh tinh')
        p = parse(txt, {'c1', 'c2'}, {'a', 'b', 'g'})
        expect(p['c1']['b'] == ('LỖI', 'nhãn bị cắt ở mép trên', 'hạ nhãn'), 'parses a row with a fix, in a list item')
        expect('b' not in p.get('c2', {}), 'a verdict without evidence is not an answer')
        expect('c9' not in p, 'rows for items not asked about are dropped')
        ep = os.path.join(tmp, 'tap'); os.makedirs(os.path.join(ep, 'review'))
        answers = {}
        calls = []

        def ask(batch, prev):
            calls.append([it['id'] for it in batch])
            return '\n'.join(f"{it['id']} | {c} | {answers.get((it['id'], c), 'ĐẠT')} | thấy {it['id']}" for it in batch for c in ('a', 'b'))
        items = [{'id': 'c1', 'key': 'k1'}, {'id': 'c2', 'key': 'k2'}, {'id': 'c3', 'key': 'k3'}]
        answers[('c2', 'b')] = 'LỖI'
        st, todo, failing, missing = run(ep, 'script', items, crit, ask)
        expect(len(todo) == 3 and st['items']['c2']['verdict'] == 'FAIL' and st['items']['c1']['verdict'] == 'PASS',
               'first round judges every item; the tool decides FAIL from a CHẶN LỖI')
        calls.clear()
        st, todo, failing, missing = run(ep, 'script', items, crit, ask)
        expect(not calls and [i['id'] for i in failing] == ['c2'], 'nothing changed: no critic call, c2 still to fix')
        items[1]['key'] = 'k2b'
        st, todo, failing, missing = run(ep, 'script', items, crit, ask)
        expect(calls == [['c2']] and st['items']['c2']['fails'] == 2, 'only the changed item goes back to the critic')
        st, todo, failing, missing = run(ep, 'script', items, crit, ask, again=['c2'])
        expect(st['items']['c2']['verdict'] == 'OPEN', 'third failure → OPEN')
        answers.clear(); items[0]['key'] = 'k1b'
        st, todo, failing, missing = run(ep, 'script', items, crit, ask)
        expect(st['items']['c1']['verdict'] == 'PASS' and st['items']['c2']['verdict'] == 'OPEN', 'OPEN stays open')

        # M13: a source that moved is a different item, even when the picture looks the same. The
        # 48x27 blur cannot see a shape that moved inside it, so the digest of the source decides.
        ep2 = os.path.join(tmp, 'tap2'); os.makedirs(os.path.join(ep2, 'review'))
        pitems = [{'id': 'p1', 'key': 'k1', 'src': 'digest-A'}]
        answers.clear(); answers[('p1', 'a')] = 'ĐẠT'; answers[('p1', 'b')] = 'ĐẠT'
        calls.clear()
        st, todo, failing, missing = run(ep2, 'props', pitems, crit, ask)
        expect(len(calls) == 1 and st['items']['p1']['verdict'] == 'PASS', 'a new prop is judged once')
        calls.clear()
        st, todo, failing, missing = run(ep2, 'props', pitems, crit, ask)
        expect(not calls and st['items']['p1']['src'] == 'digest-A', 'an unchanged prop is not judged again')
        pitems[0]['src'] = 'digest-B'   # the code moved; the picture may still look the same
        calls.clear()
        st, todo, failing, missing = run(ep2, 'props', pitems, crit, ask)
        expect(calls == [['p1']], 'a prop whose source moved goes back to the critic even if the picture is the same')
        expect(st['items']['p1']['src'] == 'digest-B', 'and the verdict now belongs to the new source')

        # M15: OPEN là kết cục — một vòng sau đạt ĐẠT thì phán quyết MỞ không bị xoá.
        ep3 = os.path.join(tmp, 'tap3'); os.makedirs(os.path.join(ep3, 'review'))
        oitems = [{'id': 'o1', 'key': 'ko'}]
        answers.clear(); answers[('o1', 'a')] = 'LỖI'; answers[('o1', 'b')] = 'LỖI'
        st, todo, failing, missing = run(ep3, 'script', oitems, crit, ask)
        expect(st['items']['o1']['verdict'] == 'FAIL', 'a failing item is FAIL')
        for n in range(2):
            oitems[0]['key'] = 'ko' + str(n + 1)   # the fixer changed it: judge it again
            st, todo, failing, missing = run(ep3, 'script', oitems, crit, ask)
        expect(st['items']['o1']['verdict'] == 'OPEN', 'three failures → OPEN')
        answers.clear(); answers[('o1', 'a')] = 'ĐẠT'; answers[('o1', 'b')] = 'ĐẠT'
        oitems[0]['key'] = 'ko3'
        st, todo, failing, missing = run(ep3, 'script', oitems, crit, ask)
        expect(st['items']['o1']['verdict'] == 'OPEN' and st['items']['o1']['fails'] == 3,
               'an OPEN item stays OPEN in the report even when a later round passes it')

        # M1: a step has a round cap; at the cap the rest becomes OPEN and the step closes.
        ep4 = os.path.join(tmp, 'tap4'); os.makedirs(os.path.join(ep4, 'review'))
        cap = MAX_ROUNDS.get('script', 0)
        xitems = [{'id': 'x1', 'key': 'kx'}]
        answers.clear(); answers[('x1', 'a')] = 'ĐẠT'; answers[('x1', 'b')] = 'ĐẠT'
        for n in range(cap + 2):
            xitems[0]['key'] = 'kx' + str(n)
            st, todo, failing, missing = run(ep4, 'script', xitems, crit, ask)
        expect(st['round'] <= cap, f'the round counter never passes the cap ({cap})')
        expect(st['items']['x1']['verdict'] == 'OPEN', 'at the cap the rest of the step becomes OPEN')

        # P9: người chấm là một phần của tiêu chuẩn — đổi người giữa chừng thì phải chấm lại.
        expect(judge_changed({'critic': 'a'}, 'a') is None, 'the same judge is fine')
        msg = judge_changed({'critic': 'a'}, 'b')
        expect(msg is not None and '--again all' in msg, 'a changed judge says so and asks for --again all')
        expect(judge_changed({}, 'b') is None, 'a step with no judge yet is not a change')

        # M3: một bước KẾ HOẠCH (outline, look) đã đóng thì không mở lại. Nếu nó mở lại thì bước kế
        # tiếp bị chặn, và vòng lặp quay lại — đó là cái đã giữ ba tập 45 giờ.
        ep5 = os.path.join(tmp, 'tap5'); os.makedirs(os.path.join(ep5, 'review'))
        from PIL import Image
        fa = os.path.join(tmp, 'fpA.png'); fb = os.path.join(tmp, 'fpB.png')
        Image.new('RGB', (480, 270), (120, 120, 120)).save(fa)
        im = Image.new('RGB', (480, 270), (120, 120, 120))
        for x in range(300, 400):
            for y in range(20, 60): im.putpixel((x, y), (250, 250, 250))
        im.save(fb)
        answers.clear(); answers[('l1', 'a')] = 'ĐẠT'; answers[('l1', 'b')] = 'ĐẠT'
        litems = [{'id': 'l1', 'key': '', 'fp': fingerprint(fa)}]
        st, todo, failing, missing = run(ep5, 'look', litems, crit, ask)
        expect(st.get('round') == 1 and st['items']['l1']['verdict'] == 'PASS', 'the first look round judges the item')
        st['closed'] = True
        gate.save(ep5, 'look', st)
        litems[0]['fp'] = fingerprint(fb)   # vật được sửa -> dấu vân tay đổi
        calls.clear()
        st, todo, failing, missing = run(ep5, 'look', litems, crit, ask)
        expect(not calls, 'a closed plan step is not re-judged when a fingerprint moves')
        expect(st.get('closed') is True, 'and it stays closed')

        def lazy(batch, prev):
            return '\n'.join(f"{it['id']} | a | ĐẠT | thấy" for it in batch)
        items.append({'id': 'c4', 'key': 'k4'})
        st, todo, failing, missing = run(ep, 'script', items, crit, lazy)
        expect([i['id'] for i in missing] == ['c4'] and 'c4' not in st['items'], 'an item without every CHẶN row stays unjudged')
        from PIL import Image
        a, b, c = (os.path.join(tmp, n) for n in ('a.png', 'b.png', 'c.png'))
        Image.new('RGB', (480, 270), (120, 120, 120)).save(a)
        im = Image.new('RGB', (480, 270), (120, 120, 120)); im.putpixel((5, 5), (124, 124, 124)); im.save(b)
        im = Image.new('RGB', (480, 270), (120, 120, 120))
        for x in range(300, 400):
            for y in range(20, 60): im.putpixel((x, y), (250, 250, 250))
        im.save(c)
        expect(fp_close(fingerprint(a), fingerprint(b)), 'a frame with noise counts as the same picture')
        expect(not fp_close(fingerprint(a), fingerprint(c)), 'a moved label is a changed picture')
        text, cr = rubric('props')
        expect(any(k == 'CHẶN' for _, k, _ in cr) and any(k == 'GÓP Ý' for _, k, _ in cr), 'the props rubric parses')
        for s in gate.STEPS:
            t, cr = rubric(s)
            must = [x for x in cr if x[1] == 'CHẶN']
            expect(len(must) <= 5 and (s == 'final' or len(must) >= 3), f'rubric {s}: {len(must)} CHẶN criteria')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('review selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
