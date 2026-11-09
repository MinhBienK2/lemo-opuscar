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
import glob, json, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gate  # noqa: E402

CHANNEL = os.path.dirname(HERE)
LIB = os.path.abspath(os.path.join(CHANNEL, '..', '..'))
TRIES = 2

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
        return bool(glob.glob(os.path.join(ep, '*.mp4')))
    if gate.why_open(ep, step) is not None: return False
    if step == 'script':
        return os.path.isfile(os.path.join(ep, 'src/timeline.js'))
    return True


def next_leg(ep, start=None):
    seen = start is None
    for leg in LEGS:
        seen = seen or leg[0] == start
        if seen and not done(ep, leg[1]): return leg
    return None


def prompt(ep, leg, question):
    rel = os.path.relpath(ep, LIB)
    n, step, what, crit = leg
    first = '' if os.path.isdir(ep) else (
        f'Thư mục tập chưa có: tạo nó theo bước 1 của skill, với câu hỏi "{question}".\n')
    return (f'Dùng skill `tram-nghi-nhieu`. Tập: `{rel}`' + (f' — câu hỏi: "{question}"' if question else '') + '.\n'
            + first +
            f'Phiên này làm đúng một chặng: {what}. '
            + ('Đây là chặng đầu tiên, chưa chặng nào xong trước đó. ' if n == '1'
               else 'Các chặng trước đã xong; ') + 'Chặng sau do một phiên mới làm.\n'
            f'Bắt đầu bằng `python3 channels/tram-nghi-nhieu/tools/gate.py status {rel}`: nó cho biết tập đang ở đâu.\n'
            f'Chặng xong khi: {crit}.\n'
            'Phiên chạy không có người dùng: điền chỗ thiếu bằng mặc định hợp lý của skill, và đi tiếp.\n'
            'Khi chặng xong, câu trả lời cuối của bạn là tóm tắt cho phiên sau, tối đa tám dòng: đã làm gì, các mục MỞ, '
            'và điều chặng sau cần biết mà tệp của tập chưa nói. Rồi dừng.')


def run_session(ep, leg, question):
    cli = os.environ.get('LEMO_STEP_CLI', 'claude')
    model = os.environ.get('LEMO_STEP_MODEL')
    cmd = [cli, '-p', '--dangerously-skip-permissions', '--output-format', 'json'] + \
          (['--model', model] if model else []) + [prompt(ep, leg, question)]
    t0 = time.time()
    r = subprocess.run(cmd, cwd=LIB, stdin=subprocess.DEVNULL, capture_output=True, text=True)
    try:
        res = json.loads(r.stdout)
    except ValueError:
        res = {'result': (r.stdout or r.stderr)[-2000:], 'is_error': True}
    u = res.get('usage') or {}
    row = {'leg': leg[0], 'at': time.strftime('%Y-%m-%d %H:%M'), 'seconds': round(time.time() - t0),
           'turns': res.get('num_turns'), 'session': res.get('session_id'),
           'tokens_in': sum(u.get(k, 0) or 0 for k in ('input_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens')),
           'tokens_out': u.get('output_tokens'), 'cost_usd': res.get('total_cost_usd'), 'error': res.get('is_error', r.returncode != 0)}
    if os.path.isdir(ep):
        os.makedirs(os.path.join(ep, 'out'), exist_ok=True)
        with open(os.path.join(ep, 'out', 'sessions.jsonl'), 'a', encoding='utf-8') as f:
            f.write(json.dumps(row, ensure_ascii=False) + '\n')
    return row, res.get('result') or ''


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
    tries = {}
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
        tries[leg[0]] = tries.get(leg[0], 0) + 1
        if tries[leg[0]] > TRIES:
            print(f'episode: chặng {leg[0]} ({leg[1]}) chưa xong sau {TRIES} phiên. '
                  f'`gate.py status {os.path.relpath(ep, LIB)}` cho biết vì sao; đây là chỗ cần người quyết.')
            return 1
        print(f'episode: chặng {leg[0]} ({leg[1]}), phiên {tries[leg[0]]}/{TRIES}…', flush=True)
        row, text = run_session(ep, leg, question)
        print(f"episode: xong phiên sau {row['seconds']} s · {row['turns']} lượt · "
              f"{(row['tokens_in'] or 0) / 1e6:.1f} M token vào · {row['tokens_out']} ra")
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
        open(os.path.join(ep, 'x.mp4'), 'w').write('')
        expect(done(ep, 'deliver'), 'an mp4 in the folder is a delivered film')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('episode selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
