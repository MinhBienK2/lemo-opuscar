"""Chặn việc mở thêm một việc nặng khi máy đã quá tải, và chặn hai vòng chấm cùng một tập.

Claude Code gọi hook này **trước** mỗi lần dùng công cụ `Bash` (PreToolUse). Đầu vào là JSON trên
stdin; đầu ra là mã thoát:

- `0` — cho qua;
- `2` — **chặn**, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Một máy 15 GiB chạy năm phiên làm phim cùng lúc thì hết swap và mọi thứ chậm:
ngày 09-11-2026 lúc 16:30, `free -g` cho `Mem 10/15, free 0, swap 7/7`, load average **25,7** trên
12 nhân. Tờ nhịp điện một tập 60 câu mất **51 phút** thay vì vài phút, và vòng chấm bị đồng hồ
giết **đúng 3600 s** — dấu hiệu của "chết vì hết giờ" chứ không phải "chết vì lỗi". Phiên thấy
vòng chấm chết thì mở vòng mới, vòng mới lại chết, lại mở vòng mới: **vòng lặp kẹt do tài nguyên,
không phải do logic của phim**. Nguyên nhân gốc có thể không nằm trong tập nào, nên chỉ sửa từng
tập thì không bao giờ hết.

**Hai luật.**

1. **Máy quá tải thì không mở thêm việc nặng.** Ngưỡng: load 1 phút > 1,5 × số nhân, hoặc
   `MemAvailable` < 1 GiB, hoặc swap đã dùng ≥ 80 %.
2. **Một tập, một vòng chấm.** Mở vòng `--props` rồi mở thêm vòng `--storyboard` **cùng lúc** là
   hai vòng chấm trên hai trạng thái khác nhau của cùng một mã nguồn: vòng sau phán trên mã mà
   vòng trước chưa ổn định, và cả hai cùng tranh nhau CPU. Thứ tự của cổng là props → storyboard →
   assets → picture → final; mỗi vòng sau đứng trên kết quả vòng trước.

Cách làm đúng khi bị chặn: **đợi** việc đang chạy xong rồi chạy lại lệnh này (`run_in_background`
rồi chờ thông báo job xong — đừng vòng lặp thăm dò bằng cách đọc lại output của job). Không sửa
tệp để "né" chặn.

    python3 tools/hook_load.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import re
import sys

# Ngưỡng. Chọn rộng để không chặn việc bình thường, nhưng phải chặn đúng lúc máy thật sự kẹt.
LOAD_FACTOR = 1.5      # load 1 phút > 1,5 × số nhân
MEM_FREE_MIB = 1024    # MemAvailable dưới 1 GiB
SWAP_USED = 0.80       # swap đã dùng ≥ 80 %

# Lệnh nặng: dựng khung hình, chấm, trộn âm thanh, dựng phim.
# Chỉ khớp khi lệnh **thực thi** công cụ đó, không khớp khi lệnh chỉ *nhắc* tên nó
# (`ps | grep review.sh` là cách soi trạng thái, không phải việc nặng).
HEAVY = re.compile(
    r'(?:^|[\s;&|(])(?:sh|bash|zsh|dash)\s+(?:[\w./=-]+\s+)*\S*review\.sh\b'
    r'|(?:^|[\s;&|(])node\s+\S*beatsheet\.mjs\b'
    r'|(?:^|[\s;&|(])node\s+\S*core/render/(?:video|readcheck|scenecheck|sourcewatch|sourcecheck)\.mjs\b'
    r'|(?:^|[\s;&|(])(?:sh|bash|zsh)\s+(?:[\w./=-]+\s+)*\S*core/render/mux\.sh\b'
    r'|(?:^|[\s;&|(])ffmpeg\s+-')

# Tập: `channels/.../tap-xx-...` — dùng để biết hai vòng có thuộc cùng một tập không.
EPISODE = re.compile(r'(channels/[^\s"\'|;&]*?/tap-[^\s"\'|;&/]+)')

LOAD_MSG = (
    'Máy đang quá tải (%s), nên việc nặng này sẽ không xong trong thời gian cho phép.\n\n'
    'Đây là nguyên nhân gốc của các vòng chấm "chết đúng giờ" và của vòng lặp mở-vòng-mới. '
    '**Cách làm đúng: đợi bên trong một job nền, để harness báo khi xong** — đừng vòng lặp `sleep` '
    'rồi thử lại (đó là dò giữa chừng, luật R5):\n\n'
    '    Bash(command="until awk \'{exit !($1 < 12)}\' /proc/loadavg; do sleep 30; done; '
    'sh channels/tram-nghi-nhieu/tools/review.sh <tập> --props", run_in_background=true)\n\n'
    'Một lần gọi công cụ, không vòng dò, và bạn được báo khi nó xong. Nếu tập này đã có một vòng chấm '
    'chạy thì đừng mở vòng thứ hai — hãy sửa theo phán quyết vòng đó rồi chạy vòng kế tiếp.\n\n'
    'Nếu tải đến từ chương trình khác trên máy (không phải việc của bạn), hãy nói với người dùng '
    'thay vì cố chạy tiếp: máy hết swap thì mọi vòng chấm đều chết, và mở thêm vòng chỉ khiến nó '
    'chết nhanh hơn.\n')

SAME_EP_MSG = (
    'Tập %s đang có một vòng chấm chạy (%s), và bạn đang mở thêm vòng thứ hai trên cùng tập.\n\n'
    'Hai vòng chấm cùng một tập là hai phán quyết trên hai trạng thái khác nhau của cùng một mã '
    'nguồn, và chúng tranh nhau CPU — máy này không đủ tài nguyên cho cả hai.\n\n'
    'Cách làm đúng: chạy **một vòng một lúc**, theo đúng thứ tự của cổng '
    '(props → storyboard → assets → picture → final). Đợi vòng đang chạy xong, đọc phán quyết '
    'của nó, sửa theo nó, rồi mới mở vòng kế tiếp.\n')


def loadavg1():
    try:
        with open('/proc/loadavg') as f:
            return float(f.read().split()[0])
    except OSError:
        return None


def meminfo():
    """(MemAvailable MiB, tỉ lệ swap đã dùng)."""
    try:
        with open('/proc/meminfo') as f:
            kv = {}
            for line in f:
                k, _, rest = line.partition(':')
                kv[k] = int(rest.strip().split()[0])
    except (OSError, ValueError, IndexError):
        return None, None
    avail = kv.get('MemAvailable')
    total = kv.get('MemTotal')
    swap_total = kv.get('SwapTotal')
    swap_free = kv.get('SwapFree')
    if avail is None or total is None:
        return None, None
    used_ratio = None
    if swap_total:
        used_ratio = 1.0 - (swap_free or 0) / swap_total
    return avail // 1024, used_ratio


def over_capacity():
    """(lý do, mô tả) nếu máy quá tải; None nếu còn khoảng."""
    cores = os.cpu_count() or 1
    load = loadavg1()
    avail, swap_used = meminfo()
    reasons = []
    detail = []
    if load is not None and load > cores * LOAD_FACTOR:
        reasons.append('load')
        detail.append('load %.1f trên %d nhân' % (load, cores))
    if avail is not None and avail < MEM_FREE_MIB:
        reasons.append('mem')
        detail.append('RAM khả dụng %d MiB' % avail)
    if swap_used is not None and swap_used >= SWAP_USED:
        reasons.append('swap')
        detail.append('swap đã dùng %d%%' % round(swap_used * 100))
    if not reasons:
        return None
    return '+'.join(reasons), ', '.join(detail)


def parse_jobs():
    """Mọi việc nặng đang chạy: [(tập, phạm vi, mô tả), ...].

    Chỉ nhận dòng lệnh **bắt đầu** bằng một lời gọi thật (`sh … review.sh …`, `node … beatsheet.mjs …`).
    Dòng nào chỉ *nhắc* tên công cụ (lệnh soi trạng thái, hay lệnh của chính hook này) thì bỏ qua —
    nếu không, chính lệnh đang hỏi cũng thành một "vòng chấm đang chạy" và chặn nhầm.
    """
    try:
        out = os.popen('ps -eo args --no-headers 2>/dev/null').read()
    except OSError:
        return []
    head = r'^(?:timeout\s+(?:-\S+\s+\d+\s+)?\d+\s+)?(?:/bin/)?(?:sh|bash|zsh|dash)\s+'
    rev = re.compile(head + r'.*?review\.sh\s+(\S+)(?:\s+--([\w-]+))?')
    beat = re.compile(head.replace('(?:sh|bash|zsh|dash)', 'node') + r'.*?beatsheet\.mjs\s+(\S+)')
    jobs = []
    for line in out.splitlines():
        line = line.strip()
        if 'hook_load' in line:
            continue
        m = rev.match(line)
        if m:
            ep = m.group(1)
            if 'tap-' in ep:
                jobs.append((ep, m.group(2) or '', ep.rsplit('/', 1)[-1]))
            continue
        m = beat.match(line)
        if m:
            ep = m.group(1)
            if 'tap-' in ep:
                jobs.append((ep, 'beatsheet', ep.rsplit('/', 1)[-1]))
    return jobs


def running_rounds(episode):
    """Các vòng chấm đang chạy cho tập này: [(mô tả lệnh), ...]."""
    return ['%s %s' % (name, scope) for (ep, scope, name) in parse_jobs() if episode in ep]


def heavy_jobs():
    """Mọi việc nặng đang chạy trên máy, gọn để gửi cho người làm: ['tap-03 --props', ...].

    Nhờ vậy phiên bị chặn biết **ai** đang chiếm máy, thay vì phải đi hỏi.
    """
    jobs = []
    seen = set()
    for (ep, scope, name) in parse_jobs():
        label = re.sub(r'[^\w.\- ]', '', '%s %s' % (name, scope)).strip()
        if label and label not in seen:
            seen.add(label)
            jobs.append(label)
    return jobs


def decide(command, over=None, rounds=None, jobs=None):
    """(mã thoát, thông điệp) cho một lệnh Bash.

    `over` = lý do máy quá tải (nếu có), `rounds` = các vòng chấm đang chạy cho cùng tập,
    `jobs` = mọi việc nặng đang chạy trên máy.
    """
    if not command or not HEAVY.search(command):
        return 0, ''
    m = EPISODE.search(command)
    episode = m.group(1) if m else None

    # Chỉ những vòng chấm **cùng tập** mới xung đột: hai tập khác nhau thì chỉ tranh CPU.
    if episode and rounds:
        same = [r for r in rounds if episode in r]
        if same:
            return 2, SAME_EP_MSG % (episode, '; '.join(same[:3]))
    if over:
        reason, detail = over
        msg = LOAD_MSG % detail
        if jobs:
            msg += '\nĐang chạy trên máy lúc này: %s\n' % '; '.join(jobs[:6])
        return 2, msg
    return 0, ''


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--selftest':
        return selftest()
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    cmd = ''
    try:
        cmd = data.get('tool_input', {}).get('command', '') or ''
    except AttributeError:
        pass
    if not HEAVY.search(cmd or ''):
        return 0
    m = EPISODE.search(cmd)
    episode = m.group(1) if m else None
    rounds = running_rounds(episode) if episode else []
    over = over_capacity()
    code, msg = decide(cmd, over=over, rounds=rounds, jobs=heavy_jobs())
    if code:
        sys.stderr.write(msg)
    return code


def selftest():
    """Các ca thử bằng tham số giả — không phụ thuộc tải thật của máy."""
    cases = [
        # (lệnh, quá tải?, vòng đang chạy, mã thoát kỳ vọng)
        ('ls -la', ('load', 'x'), [], 0),
        ('python3 tools/check_shots.py tap-01', ('load', 'x'), [], 0),
        ('sh channels/tram-nghi-nhieu/tools/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x --props',
         None, [], 0),
        ('sh channels/tram-nghi-nhieu/tools/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x --props',
         ('load+swap', 'load 25 trên 12 nhân, swap 100%'), [], 2),
        ('node channels/tram-nghi-nhieu/tools/beatsheet.mjs channels/tram-nghi-nhieu/series/do-vat/tap-01-x --out x',
         ('load', 'load 25'), [], 2),
        ('sh channels/tram-nghi-nhieu/tools/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x --storyboard',
         None, ['sh channels/tram-nghi-nhieu/tools/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x --props'],
         2),
        ('sh channels/tram-nghi-nhieu/tools/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-02-y --props',
         None, ['sh channels/tram-nghi-nhieu/tools/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x --props'],
         0),
        ('sh core/render/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x',
         ('mem', 'RAM khả dụng 400 MiB'), [], 2),
        ('ffmpeg -i a.mp4 b.mp4', ('load', 'x'), [], 2),
        # Nhắc tên công cụ không phải là chạy nó — cách soi trạng thái phải đi qua.
        ('ps -eo args | grep review.sh', ('load', 'x'), [], 0),
        ('ls channels/tram-nghi-nhieu/tools/review.sh', ('load', 'x'), [], 0),
        ('cat review.md | grep -c beatsheet', ('load', 'x'), [], 0),
        # Lệnh bọc vẫn là lệnh nặng.
        ('timeout 900 sh core/render/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x',
         None, [], 0),
        ('timeout 900 sh core/render/review.sh channels/tram-nghi-nhieu/series/do-vat/tap-01-x',
         ('load', 'load 25'), [], 2),
    ]
    bad = 0
    for cmd, over, rounds, want in cases:
        code, msg = decide(cmd, over=over, rounds=rounds)
        ok = code == want
        bad += 0 if ok else 1
        print('%-4s rc=%d (mong đợi %d)  %s' % ('ok' if ok else 'FAIL', code, want, cmd[:78]))
    print('%d/%d ok' % (len(cases) - bad, len(cases)))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
