"""Chặn việc nặng khi máy quá tải, và nói rõ đang có gì chạy.

Claude Code gọi hook này **trước** mỗi lần dùng công cụ `Bash` (PreToolUse). Đầu vào là JSON trên
stdin; đầu ra là mã thoát:

- `0` — cho qua;
- `2` — **chặn**, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Ba phiên làm phim chạy song song (bản ghi 2026-11-11) đã làm máy hết bộ nhớ: swap
7 691/7 813 MB đã dùng, và trong chính transcript có một job bị hệ điều hành dừng — *"stopped because
the system is running low on memory"*. Job đó là một vòng chấm: nó bị giết **giữa chừng**, nên tập mất
trắng một vòng chấm đã chạy 42 phút và phải chạy lại từ đầu. Cái chết đó không có dấu vết trong
`review/`, nên người đọc báo cáo tưởng phim sai.

Thứ tự ưu tiên cũng ngược: đúng thứ phải dừng trước là việc **nặng** (dựng hình, tờ nhịp, người
chấm), không phải việc nhẹ. Máy không biết việc nào nặng, nên chỗ này biết: nó đọc cái lệnh sắp chạy.

**Ngưỡng.** Tải trên số lõi, bộ nhớ khả dụng, và swap. Ngưỡng đặt cho máy 12 lõi / 16 GB; chỉnh
bằng `LEMO_LOAD_MAX`, `LEMO_MEM_MIN_MB`, `LEMO_SWAP_MAX` khi cần.

    python3 tools/hook_load.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import re
import sys
import time

CORES = os.cpu_count() or 4
LOAD_MAX = float(os.environ.get('LEMO_LOAD_MAX', 0) or CORES * 1.5)
MEM_MIN_MB = int(os.environ.get('LEMO_MEM_MIN_MB', 0) or 1200)
SWAP_MAX = int(os.environ.get('LEMO_SWAP_MAX', 0) or 80)

# Việc nặng: dựng hình, tờ nhịp, dựng phim, người chấm. Việc nhẹ thì vẫn cho chạy — người làm
# phải đọc được báo cáo và sửa được mã trong lúc máy đang kẹt.
#
# `review.sh` và `episode.py` KHÔNG nằm trong đây: chúng là người lái, không phải việc nặng. Chúng
# tự xếp hàng (core/render/slot.mjs giữ hai chỗ dựng cho cả máy), nên chặn chúng chỉ là làm runner
# chết thay vì cho nó chờ. Việc ăn bộ nhớ thật sự là những lệnh dựng hình.
HEAVY = re.compile(
    r'beatsheet\.mjs|video\.mjs|still\.mjs|propcheck\.mjs|'
    r'sourcecheck\.mjs|readcheck\.mjs|scenecheck\.mjs|drawcheck\.mjs|filmcheck\.mjs|mux\.sh|build\.sh')

# `claude -p` là người chấm: nó mở ảnh cỡ thật, mà ảnh thì nặng. Nó không nằm trong HEAVY (vì
# `git commit -m "… claude -p"` không phải là đang chấm), nên nó có một mẫu riêng: `claude` phải
# đứng ở vị trí một lệnh (đầu dòng, sau `;`/`&`/`|`, hoặc sau `env VAR=…`).
CRITIC = re.compile(r'(?:^|[;&|]\s*|\benv\s+(?:\w+=\S+\s+)*)(?:\S*/)?claude\s+-p\b')

# Một mẫu trong `grep -E "beatsheet.mjs"` không phải là việc đang chạy. Nội dung trong dấu nháy bị
# bỏ trước khi so: `ps ... | grep -E "beatsheet.mjs"` là một câu hỏi trạng thái (vòng dò — hook_poll
# lo), không phải một lệnh dựng hình.
QUOTED = re.compile(r'"[^"]*"|\'[^\']*\'')

# Một tệp được *nêu tên* trong một lệnh khác không phải việc đang chạy: `git add …/episode.py` không
# chạy episode.py. Nên chỉ lệnh mà máy sẽ **chạy** mới tính: công cụ nặng phải là lệnh đầu tiên, hoặc
# đi sau một lệnh chạy được (python3, node, sh, bash…).
TOOL = re.compile(r'(?<![\w./-])(beatsheet\.mjs|video\.mjs|still\.mjs|propcheck\.mjs|'
                   r'sourcecheck\.mjs|readcheck\.mjs|scenecheck\.mjs|'
                   r'drawcheck\.mjs|filmcheck\.mjs|mux\.sh|build\.sh)(?![\w-])')
RUNNER = re.compile(r'(?:^|[;&|]\s*|\b(?:python3?|node|sh|bash|npx|env)\s+)\S*'
                    r'(?:beatsheet\.mjs|video\.mjs|still\.mjs|propcheck\.mjs|'
                    r'sourcecheck\.mjs|readcheck\.mjs|scenecheck\.mjs|drawcheck\.mjs|filmcheck\.mjs|'
                    r'mux\.sh|build\.sh)')


def strip_quoted(command):
    return QUOTED.sub(' ', command or '')


def read_mem():
    """(MemAvailable MB, swap used %, swap total MB)"""
    avail_mb = swap_used = swap_total = 0
    try:
        with open('/proc/meminfo') as f:
            for line in f:
                if line.startswith('MemAvailable:'):
                    avail_mb = int(line.split()[1]) // 1024
                elif line.startswith('SwapTotal:'):
                    swap_total = int(line.split()[1]) // 1024
                elif line.startswith('SwapFree:'):
                    swap_used = swap_total - int(line.split()[1]) // 1024
    except OSError:
        pass
    pct = int(100 * swap_used / swap_total) if swap_total else 0
    return avail_mb, pct, swap_total


def load1():
    try:
        return float(open('/proc/loadavg').read().split()[0])
    except (OSError, ValueError):
        return 0.0


def running_jobs():
    """những việc nặng đang chạy, để người làm biết phải xếp hàng thay vì đoán"""
    out = []
    try:
        pids = [p for p in os.listdir('/proc') if p.isdigit()]
    except OSError:
        return out
    for pid in pids:
        try:
            cmd = open(f'/proc/{pid}/cmdline', 'rb').read().replace(b'\0', b' ').decode('utf-8', 'replace')
        except OSError:
            continue
        # chỉ tính việc thật sự đang chạy: một lệnh `grep` có tên công cụ trong mẫu thì không phải
        # công cụ đang chạy
        if RUNNER.search(strip_quoted(cmd)) and 'hook_load' not in cmd:
            out.append(cmd.strip()[:110])
    return out[:6]


def overload(load=None, mem=None):
    """(có quá tải không, lý do)"""
    load = load1() if load is None else load
    avail_mb, swap_pct, _ = read_mem() if mem is None else mem
    if load > LOAD_MAX:
        return True, f'tải máy {load:.1f} (trần {LOAD_MAX:.1f} trên {CORES} lõi)'
    if avail_mb < MEM_MIN_MB:
        return True, f'bộ nhớ khả dụng chỉ còn {avail_mb} MB (cần ≥ {MEM_MIN_MB} MB)'
    if swap_pct >= SWAP_MAX:
        return True, f'swap đã dùng {swap_pct}% (trần {SWAP_MAX}%)'
    return False, ''


MESSAGE = (
    'Máy đang quá tải: %s.\n\n'
    'Việc này nặng (dựng hình, tờ nhịp, người chấm), và khi máy hết bộ nhớ thì chính việc này bị hệ '
    'điều hành giết **giữa chừng** — vòng chấm chạy 42 phút rồi mất trắng, và trong `review/` không còn '
    'dấu vết nào để biết nó đã chạy.\n\n'
    'Cách làm đúng: **xếp hàng**. Đợi việc đang chạy xong rồi hãy làm việc này; trong lúc đó làm việc '
    'nhẹ (đọc mã, viết lời, đọc báo cáo). Nếu phải chạy ngay, hãy chạy nó ở chế độ nền '
    '(`run_in_background=true`) để hệ điều hành không giết nó khi bộ nhớ chật.\n')

JOB_MESSAGE = (
    'Đang chạy trên máy này (đừng chạy thêm việc nặng lúc này):\n%s\n')


def decide(command, load=None, mem=None, jobs=None):
    """(mã thoát, thông điệp) cho một lệnh Bash"""
    c = command or ''
    # so trên phần lệnh không nằm trong dấu nháy: một mẫu grep không phải là việc đang chạy.
    # `claude -p` thì so trên lệnh GỐC: dấu nháy của nó là nội dung câu lệnh, không phải tên công cụ.
    bare = strip_quoted(c)
    heavy = bool(RUNNER.search(bare)) or bool(CRITIC.search(c))
    if not heavy:
        return 0, ''          # việc nhẹ: không chặn, dù máy có kẹt
    over, why = overload(load, mem)
    if not over:
        return 0, ''
    msg = MESSAGE % why
    if jobs is None:
        jobs = running_jobs()
    if jobs:
        msg += JOB_MESSAGE % '\n'.join('  - ' + j for j in jobs)
    return 2, msg


def main():
    if '--selftest' in sys.argv:
        return selftest()
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    cmd = ''
    try:
        cmd = data.get('tool_input', {}).get('command', '') or ''
    except AttributeError:
        return 0
    code, msg = decide(cmd)
    if code:
        sys.stderr.write(msg)
    return code


def selftest():
    cases = [
        # (lệnh, tải, (mem khả dụng MB, swap %, swap tổng MB), mã thoát kỳ vọng)
        ('git status --short', 12.0, (6000, 10, 8000), 0),
        ('cat review/PICTURE.md', 12.0, (6000, 10, 8000), 0),
        ('node core/render/still.mjs ep 12.5', 3.0, (6000, 10, 8000), 0),
        ('node core/render/still.mjs ep 12.5', 20.0, (6000, 10, 8000), 2),
        ('node core/render/still.mjs ep 12.5', 3.0, (500, 10, 8000), 2),
        ('node core/render/still.mjs ep 12.5', 3.0, (6000, 90, 8000), 2),
        ('claude -p "chấm"', 20.0, (6000, 10, 8000), 2),
        ('claude -p "chấm"', 3.0, (6000, 10, 8000), 0),
        # một tệp được NÊU TÊN trong lệnh khác không phải việc đang chạy
        ('git add tools/hook_load.py channels/tram-nghi-nhieu/tools/review.py', 20.0, (6000, 10, 8000), 0),
        ('git commit -m "fix review.py and claude -p path"', 20.0, (6000, 10, 8000), 0),
        ('ps -eo pid,etime,args | grep -E "beatsheet.mjs" | grep -v grep', 20.0, (6000, 10, 8000), 0),
        # người lái (review.sh, episode.py) thì không chặn: nó tự xếp hàng, chặn nó chỉ làm nó chết
        ('sh channels/tram-nghi-nhieu/tools/review.sh ep picture', 20.0, (6000, 10, 8000), 0),
        ('python3 channels/tram-nghi-nhieu/tools/episode.py ep', 20.0, (6000, 10, 8000), 0),
    ]
    bad = 0
    for cmd, load, mem, want in cases:
        code, msg = decide(cmd, load=load, mem=mem, jobs=[])
        ok = code == want
        bad += 0 if ok else 1
        print('%-4s rc=%d (mong đợi %d)  load=%.1f mem=%s  %s'
              % ('ok' if ok else 'FAIL', code, want, load, mem, cmd[:50]))
    print('%d/%d ok' % (len(cases) - bad, len(cases)))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
