#!/usr/bin/env python3
"""Make an episode one leg at a time, each leg in a fresh headless session.

  python3 channels/tram-nghi-nhieu/tools/episode.py <episode> ["Câu hỏi của tập?"] [--dry-run] [--from <leg>]
  python3 channels/tram-nghi-nhieu/tools/episode.py --selftest

A leg is one or two steps of the channel's skill that end on a state the gate can see:
  1 outline     review outline closed
  2 script      review script closed, and src/timeline.js exists (the voice is recorded)
  3 look        review look closed
  4-5 props     review props closed
  6 picture     review picture closed
  7 deliver     an .mp4 in the episode folder
For the first leg not done yet, the runner starts `claude -p` with a prompt that names only that leg, waits, and
checks the gate again. A leg gets at most TRIES sessions; then the runner stops and says which leg is stuck.

Why: one long session re-reads its whole context on every turn, and its context only grows (images, logs, tool
code read again after each compaction). A fresh session per leg starts small, reads the state from the gate, and
ends when its leg is done. What one leg must tell the next lives in the episode's files, not in a context.

Each session's cost lands in <episode>/out/sessions.jsonl: leg, seconds, turns, tokens in and out, cost, session id.
Env: LEMO_STEP_CLI (default claude), LEMO_STEP_MODEL (model for the sessions).
"""
import glob, json, os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gate  # noqa: E402

CHANNEL = os.path.dirname(HERE)
LIB = os.path.abspath(os.path.join(CHANNEL, '..', '..'))
TRIES = 2
MAX_CRASHES = 5   # how many times one leg may die on the wire before the runner blames the gateway

LEGS = [
    ('1', 'outline', 'bước 1 (`step1-outline/GUIDE.md`)', 'review outline XONG'),
    ('2', 'script', 'bước 2 (`step2-script/GUIDE.md`): lời kể, rồi giọng đọc và `src/timeline.js`',
     'review script XONG và có `src/timeline.js`'),
    ('3', 'look', 'bước 3 (`step3-storyboard/GUIDE.md`)', 'review look XONG'),
    ('4-5', 'props', 'bước 4 và bước 5 (`step4-component-breakdown/GUIDE.md`, `step5-props-code/GUIDE.md`)',
     'review props XONG'),
    ('6', 'picture', 'bước 6 (`step6-assembly/GUIDE.md`)', 'review picture XONG'),
    ('7', 'deliver', 'bước 7 (`step7-delivery/GUIDE.md`) tới mục **Xong** của nó: dựng phim và cổng bàn giao',
     'có tệp .mp4 trong thư mục tập và `sh core/render/review.sh <tập>` thoát mã 0'),
]


def done(ep, step):
    """is this leg done, by what the gate and the folder show"""
    if not os.path.isdir(ep): return False
    if step == 'deliver':
        # Chặng bàn giao xong khi CỔNG BÀN GIAO xanh và phim trên đĩa là phim của mã nguồn hiện tại.
        # Chỉ có một tệp .mp4 trong thư mục thì chưa đủ: một phim cũ nằm lại đó trong khi src/ đã
        # đi tiếp, và runner sẽ báo "mọi chặng đã xong" với một phim không còn thuộc về mã này (M17).
        films = glob.glob(os.path.join(ep, '*.mp4'))
        if not films: return False
        if gate.why_open(ep, 'picture') is not None: return False
        # Vân tay thuộc về chính phim đó: tệp viết CẠNH phim lúc phim được bàn giao. Vân tay của
        # lần dựng (out/source-fingerprint.json) nói về mã lúc lần dựng BẮT ĐẦU, nên một lần dựng
        # bị bỏ dở để lại một vân tay bảo lãnh cho một phim không tồn tại (M24).
        snap = os.path.join(ep, 'out', 'source-fingerprint.json')
        sides = [os.path.splitext(f)[0] + '.fingerprint.json' for f in films]
        if not any(os.path.isfile(s) for s in sides) and not os.path.isfile(snap): return False
        r = subprocess.run(['node', os.path.join(LIB, 'core', 'render', 'sourcecheck.mjs'), ep, snap],
                           capture_output=True, text=True, cwd=LIB)
        return r.returncode == 0
    if gate.why_open(ep, step) is not None: return False
    if step == 'script':
        return os.path.isfile(os.path.join(ep, 'src/timeline.js'))
    return True


def is_crash(row):
    """did this session die on the wire, rather than on the leg's own account?

    A crash is infrastructure: the gateway 5xx'd, the tunnel fell, the process died before it
    printed a result. It does NOT spend the leg's session budget, because the leg never got a
    fair session. A session that ran and blew its own budget (max turns, max USD) is not a
    crash — that IS the leg's account, and it spends the budget (M18).

    Rows written before M18 carry no 'crash' field; an error row without one is read as a crash,
    so the three episodes that lost a leg to the 530 keep that leg's budget.
    """
    if 'crash' in row:
        return bool(row['crash'])
    return bool(row.get('error'))


def budget(ep):
    """({leg: sessions spent}, {leg: crashes}) — both counted from the episode's own log.

    One source of truth for both counters, and it survives the runner being restarted — which is
    exactly what happens when it is killed (M14). A counter that lives in the runner's memory
    resets on every restart, and it counted a crashed session too, so a gateway outage looked
    like a stuck leg and the runner stopped with "đây là chỗ cần người quyết" (M18).
    """
    tries, crashes = {}, {}
    log = os.path.join(ep, 'out', 'sessions.jsonl')
    if not os.path.isfile(log): return tries, crashes
    try:
        lines = list(open(log, encoding='utf-8'))
    except OSError:
        return tries, crashes
    for line in lines:
        line = line.strip()
        if not line: continue
        try:
            row = json.loads(line)
        except ValueError:
            continue          # one torn line must not drop every row after it
        if not isinstance(row, dict): continue
        leg = str(row.get('leg', ''))
        if not leg: continue
        tries.setdefault(leg, 0)
        crashes.setdefault(leg, 0)
        if is_crash(row):
            crashes[leg] = crashes.get(leg, 0) + 1
        else:
            tries[leg] = tries.get(leg, 0) + 1
    return tries, crashes


def used_tries(ep):
    """the leg's spent sessions; a session that died on the wire does not spend one"""
    return budget(ep)[0]


def next_leg(ep, start=None):
    seen = start is None
    for leg in LEGS:
        seen = seen or leg[0] == start
        if seen and not done(ep, leg[1]): return leg
    return None


def handover_path(ep, leg_id):
    return os.path.join(ep, 'out', f'leg-{leg_id}.md')


def write_handover(ep, leg_id, text, session=None):
    """the leg's own summary, kept in the episode so the NEXT leg can read it.

    The summary used to live only in the runner's stdout, which dies with the runner — so the
    next leg started blind and re-derived what the previous one already knew (M19).
    """
    if not text.strip(): return None
    p = handover_path(ep, leg_id)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(f'<!-- bàn giao chặng {leg_id} · phiên {session or "?"} -->\n\n')
        f.write(text.strip() + '\n')
    return p


def resume_note(ep, leg_id):
    """the note a crashed leg left for its successor, if it names this leg.

    The file's first line may say `leg: 3`; a note for another leg is stale and is ignored, so
    a note left behind by an earlier leg cannot mislead a later one.
    """
    p = os.path.join(ep, 'out', 'resume-note.md')
    if not os.path.isfile(p): return ''
    try:
        text = open(p, encoding='utf-8').read()
    except OSError:
        return ''
    m = re.search(r'leg:\s*([0-9\-]+)', text[:400])
    if m and m.group(1) != leg_id: return ''
    return text.strip()


def prompt(ep, leg, question):
    rel = os.path.relpath(ep, LIB)
    n, step, what, crit = leg
    first = ''
    if not os.path.isdir(ep):
        ep_rel = os.path.relpath(ep, os.path.join(LIB, 'channels', 'tram-nghi-nhieu'))
        first = (f'Thư mục tập chưa có: tạo nó bằng scaffold trước, rồi làm bước 1.\n'
                 f'  sh core/render/new_episode.sh tram-nghi-nhieu {ep_rel} "{question}"\n')
    hands = []
    for lg, _name, _w, _c in LEGS:
        if lg == n: break
        hp = handover_path(ep, lg)
        if os.path.isfile(hp):
            try:
                ht = open(hp, encoding='utf-8').read().strip()
            except OSError:
                ht = ''
            if ht:
                hands.append(f'  - {os.path.relpath(hp, LIB)} (chặng {lg}):\n' +
                             '\n'.join('    ' + s for s in ht.splitlines()))
    hand = ''
    if hands:
        hand = ('Các chặng trước đã để lại bàn giao trong tập; đọc trước khi làm, đừng dò lại từ đầu:\n'
                + '\n'.join(hands) + '\n')
    note = resume_note(ep, n)
    if note:
        hand += (f'Ghi chú tiếp tục cho chặng này (do phiên trước bỏ lại) — đọc và làm theo:\n{note}\n')
    return (f'Dùng skill `tram-nghi-nhieu`. Tập: `{rel}`' + (f' — câu hỏi: "{question}"' if question else '') + '.\n'
            + first +
            f'Phiên này làm đúng một chặng: {what}. '
            + ('Đây là chặng đầu tiên, chưa chặng nào xong trước đó. ' if n == '1'
               else 'Các chặng trước đã xong; ') + 'Chặng sau do một phiên mới làm.\n'
            f'Bắt đầu bằng `python3 channels/tram-nghi-nhieu/tools/gate.py status {rel}`: nó cho biết tập đang ở đâu.\n'
            + hand +
            f'Chặng xong khi: {crit}.\n'
            'Phiên chạy không có người dùng: điền chỗ thiếu bằng mặc định hợp lý của skill, và đi tiếp.\n'
            'Khi chặng xong, câu trả lời cuối của bạn là tóm tắt cho phiên sau, tối đa tám dòng: đã làm gì, các mục MỞ, '
            'và điều chặng sau cần biết mà tệp của tập chưa nói. Rồi dừng.')


TRANSPORT_MARKERS = ('API Error', 'Cloudflare', 'ECONNRESET', 'ECONNREFUSED', 'fetch failed',
                     'socket hang up', 'overloaded', 'tunnel', '502', '503', '529')


def parse_result(stdout):
    """the CLI's JSON result, if one arrived. A crash often prints noise before it, so the first
    '{' that parses is taken; no result at all is None — and that IS a crash."""
    text = (stdout or '').strip()
    if not text: return None
    try:
        return json.loads(text)
    except ValueError:
        pass
    dec = json.JSONDecoder()
    for i, ch in enumerate(text):
        if ch != '{': continue
        try:
            obj, _ = dec.raw_decode(text, i)
        except ValueError:
            continue
        if isinstance(obj, dict): return obj
    return None


def classify(res, parsed, returncode):
    """(crash, api_status) for one finished session.

    The wire died: no result at all, or an HTTP status from the API, or the CLI's own words
    about a tunnel or a reset. The leg's own account: the session ran and stopped because it
    used up its turns or its dollars — that spends the budget (M18).
    """
    if not parsed:
        return True, None
    api = res.get('api_error_status')
    if not res.get('is_error', returncode != 0):
        return False, api
    if (res.get('subtype') or '') in ('error_max_turns', 'error_max_budget_usd'):
        return False, api
    if api is not None:
        return True, api
    text = str(res.get('result') or '') + ' ' + str(res.get('error') or '')
    if any(m in text for m in TRANSPORT_MARKERS):
        return True, api
    return False, api


def run_session(ep, leg, question):
    cli = os.environ.get('LEMO_STEP_CLI', 'claude')
    model = os.environ.get('LEMO_STEP_MODEL')
    cmd = [cli, '-p', '--dangerously-skip-permissions', '--output-format', 'json'] + \
          (['--model', model] if model else []) + [prompt(ep, leg, question)]
    t0 = time.time()
    r = subprocess.run(cmd, cwd=LIB, stdin=subprocess.DEVNULL, capture_output=True, text=True)
    res = parse_result(r.stdout)
    parsed = res is not None
    if not parsed:
        res = {}
    crash, api = classify(res, parsed, r.returncode)
    errored = bool(res.get('is_error', r.returncode != 0))
    u = res.get('usage') or {}
    row = {'leg': leg[0], 'at': time.strftime('%Y-%m-%d %H:%M'), 'seconds': round(time.time() - t0),
           'turns': res.get('num_turns'), 'session': res.get('session_id'),
           'tokens_in': sum(u.get(k, 0) or 0 for k in ('input_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens')),
           'tokens_out': u.get('output_tokens'), 'cost_usd': res.get('total_cost_usd'), 'error': errored,
           'crash': crash, 'api_error_status': api,
           'error_kind': ('crash' if crash else ('leg' if errored else None))}
    if os.path.isdir(ep):
        os.makedirs(os.path.join(ep, 'out'), exist_ok=True)
        with open(os.path.join(ep, 'out', 'sessions.jsonl'), 'a', encoding='utf-8') as f:
            f.write(json.dumps(row, ensure_ascii=False) + '\n')
    text = res.get('result') or ''
    if not text and not parsed:
        text = (r.stdout or r.stderr)[-2000:]
    if not crash:
        write_handover(ep, leg[0], text, res.get('session_id'))
    return row, text


def main(argv):
    a = list(argv)
    if a[:1] == ['--selftest']: return selftest()
    dry = '--dry-run' in a
    a = [x for x in a if x != '--dry-run']
    start = None
    if '--from' in a:
        i = a.index('--from'); start = a[i + 1] if i + 1 < len(a) else None; del a[i:i + 2]
    if not a: print(__doc__, file=sys.stderr); return 2
    ep, question = os.path.abspath(a[0]), (a[1] if len(a) > 1 else '')
    if not os.path.isdir(ep) and not question:
        print('episode: tập chưa có thư mục: cho câu hỏi của tập làm tham số thứ hai', file=sys.stderr); return 2
    while True:
        leg = next_leg(ep, start)
        if leg is None:
            print('episode: mọi chặng đã xong; phim:', ', '.join(glob.glob(os.path.join(ep, '*.mp4'))))
            print('episode: báo cáo nghiệm thu (không chặn): sh channels/tram-nghi-nhieu/tools/review.sh '
                  f'{os.path.relpath(ep, LIB)} final')
            return 0
        if dry:
            print(f'=== chặng {leg[0]} ({leg[1]}) chưa xong; phiên sẽ nhận:\n{prompt(ep, leg, question)}')
            return 0
        # Một bộ đếm, đọc lại từ sổ của tập mỗi vòng: không có bộ đếm thứ hai trong RAM để tranh với nó (M14, M18).
        tries, crashes = budget(ep)
        spent = tries.get(leg[0], 0)
        dead = crashes.get(leg[0], 0)
        if spent >= TRIES:
            print(f'episode: chặng {leg[0]} ({leg[1]}) chưa xong sau {TRIES} phiên. '
                  f'`gate.py status {os.path.relpath(ep, LIB)}` cho biết vì sao; đây là chỗ cần người quyết.')
            return 1
        if dead >= MAX_CRASHES:
            print(f'episode: chặng {leg[0]} ({leg[1]}) đã chết {dead} lần vì hạ tầng (không phải vì chặng). '
                  f'Cổng inference có còn sống không? Xem `api_error_status` trong {os.path.relpath(ep, LIB)}/out/sessions.jsonl.')
            return 1
        print(f'episode: chặng {leg[0]} ({leg[1]}), phiên {spent + 1}/{TRIES}…', flush=True)
        row, text = run_session(ep, leg, question)
        print(f"episode: xong phiên sau {row['seconds']} s · {row['turns']} lượt · "
              f"{(row['tokens_in'] or 0) / 1e6:.1f} M token vào · {row['tokens_out']} ra")
        if row.get('crash'):
            print(f"episode: phiên chết vì hạ tầng (api {row.get('api_error_status')}); "
                  f"chặng này chưa dùng lượt nào — thử lại.")
        print('\n'.join('  ' + s for s in text.strip().splitlines()[-12:]), flush=True)


def selftest():
    import shutil, tempfile
    tmp = tempfile.mkdtemp(prefix='episode-selftest-')
    ok = True

    def expect(cond, what):
        nonlocal ok
        print(('ok   ' if cond else 'FAIL ') + what); ok = ok and cond
    try:
        ep = os.path.join(tmp, 'tap')
        expect(next_leg(ep)[0] == '1', 'no folder yet: the first leg is the outline')
        expect('câu hỏi' in prompt(ep, LEGS[0], 'Vì sao?') and 'tạo nó' in prompt(ep, LEGS[0], 'Vì sao?'),
               'the first prompt carries the question and says to make the folder')
        os.makedirs(os.path.join(ep, 'research')); os.makedirs(os.path.join(ep, 'voice')); os.makedirs(os.path.join(ep, 'src'))
        open(os.path.join(ep, 'TREATMENT.md'), 'w').write('t'); open(os.path.join(ep, 'research/FACTS.md'), 'w').write('f')
        json.dump([{'id': 'c1', 'text': 'một'}], open(os.path.join(ep, 'voice/lines.json'), 'w'))
        gate.save(ep, 'outline', {'step': 'outline', 'round': 1, 'closed': True, 'items': {'dan-y': {'verdict': 'PASS'}}})
        gate.save(ep, 'script', {'step': 'script', 'round': 1,
                                 'items': {k: {'key': v, 'verdict': 'PASS'} for k, v in gate.line_keys(ep).items()}})
        expect(next_leg(ep)[0] == '2', 'script closed but no voice yet: the script leg is not done')
        open(os.path.join(ep, 'src/timeline.js'), 'w').write('//')
        expect(next_leg(ep)[0] == '3', 'voice recorded: the next leg is the look')
        p = prompt(ep, next_leg(ep), '')
        expect('đúng một chặng' in p and 'bước 3' in p and 'bước 4' not in p, 'a prompt names its own leg and no other')
        expect(next_leg(ep, '6')[0] == '6', '--from starts at the leg named')
        # M17: một tệp .mp4 trong thư mục CHƯA phải là phim đã bàn giao. Chặng bàn giao xong khi
        # cổng bàn giao xanh và phim là phim của mã nguồn hiện tại.
        open(os.path.join(ep, 'x.mp4'), 'w').write('')
        expect(not done(ep, 'deliver'), 'an mp4 alone is not a delivered film: the gate and the source check decide')
        # trần số phiên của một chặng sống qua lần khởi chạy lại của runner (M14)
        os.makedirs(os.path.join(ep, 'out'), exist_ok=True)
        with open(os.path.join(ep, 'out', 'sessions.jsonl'), 'w', encoding='utf-8') as f:
            f.write(json.dumps({'leg': '3', 'session': 's1', 'error': False}) + '\n')
            f.write(json.dumps({'leg': '3', 'session': 's2', 'error': False}) + '\n')
            f.write(json.dumps({'leg': '4', 'session': 's3', 'error': True}) + '\n')
        used = used_tries(ep)
        expect(used.get('3') == 2 and used.get('4') == 0,
               'the retry budget counts the sessions already in the log, and a failed one does not use a try')
        # M18: phiên chết vì hạ tầng không dùng lượt của chặng; một dòng sổ bị cắt không làm mất
        # ngân sách của các dòng sau nó; hai bộ đếm là hai điều khác nhau.
        with open(os.path.join(ep, 'out/sessions.jsonl'), 'a', encoding='utf-8') as f:
            f.write('{"leg": "5", "session": "s4", "cra\n')                       # dòng bị cắt giữa chừng
            f.write(json.dumps({'leg': '5', 'session': 's5', 'crash': True}) + '\n')
            f.write(json.dumps({'leg': '5', 'session': 's6', 'crash': False}) + '\n')
        tries, crashes = budget(ep)
        expect(tries.get('5') == 1 and crashes.get('5') == 1,
               'a session that died on the wire does not spend the leg, and a torn line does not drop the rows after it')
        expect(classify({'is_error': True, 'api_error_status': 530}, True, 0)[0],
               'an API error from the gateway is a crash, not the leg own account')
        expect(not classify({'is_error': True, 'subtype': 'error_max_turns'}, True, 0)[0],
               'a session that ran out of turns spends the leg budget')
        expect(not classify({'is_error': False}, True, 0)[0] and classify({}, False, 1)[0],
               'a clean session is not a crash, and a session with no result at all is')
        expect(parse_result('noise before {"is_error": true, "api_error_status": 503}') is not None,
               'a result that arrives behind noise is still read')
        # M19: bàn giao của một chặng nằm trong tập, nên chặng sau đọc được thay vì dò lại từ đầu.
        write_handover(ep, '2', 'đã làm: lời kể 3 câu\nmục MỞ: c02')
        expect(os.path.isfile(handover_path(ep, '2')), 'a leg leaves its handover inside the episode')
        p2 = prompt(ep, next_leg(ep), '')
        expect('leg-2.md' in p2 and 'đã làm: lời kể 3 câu' in p2,
               'the next leg is pointed at the previous leg handover and the text is in the prompt')
        # ghi chú tiếp tục: chỉ dùng khi nó nói đúng chặng đang làm
        with open(os.path.join(ep, 'out/resume-note.md'), 'w', encoding='utf-8') as f:
            f.write('<!-- leg: 3 -->\nđừng dựng lại ảnh cũ\n')
        expect('đừng dựng lại ảnh cũ' in prompt(ep, next_leg(ep), ''),
               'a note left for this leg is passed to the session')
        with open(os.path.join(ep, 'out/resume-note.md'), 'w', encoding='utf-8') as f:
            f.write('<!-- leg: 9 -->\nnhầm chặng\n')
        expect('nhầm chặng' not in prompt(ep, next_leg(ep), ''),
               'a note for another leg is stale and is not passed on')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('episode selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
