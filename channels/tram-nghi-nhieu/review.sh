#!/bin/sh
# Independent review: a fresh model session that sees only the pictures and the words of an episode (never its code,
# never the maker's notes) judges it with CRITIC.md and writes what to fix, line by line.
#   sh channels/tram-nghi-nhieu/review.sh <episode> [--lines 5-8] [--video]
#   sh channels/tram-nghi-nhieu/review.sh <episode> --script
#     --lines a-b  judge only these lines (a scene just built); default: every line
#     --video      also judge the finished film: four frames from the mp4 across each line
#     --props      judge every object of src/props.js alone (propcheck.mjs, three sides): a first session that is
#                  not told the names says what each object is, a second compares with the intended name; writes
#                  <episode>/review/PROPS-REVIEW.md. An object nobody can name is a stand-in, and the scenes would fail.
#     --script     judge the words alone (voice/lines.json against research/FACTS.md) with SCRIPT-CRITIC.md, before any
#                  voice or picture is made; writes <episode>/review/SCRIPT-REVIEW.md (and SCRIPT-REVIEW-<n>.md)
# Writes <episode>/review/REVIEW.md (and REVIEW-<n>.md, the history), prints it, exits 0 on PASS and 1 on FAIL.
# A PASS of --script, of --props, or of the whole film without --lines/--video, stamps what was judged (gate.py); mix.py
# builds only an episode whose three stamps still match.
# --script converges: from the second run the reviewer gets its last review, keeps the lines it passed that did not
# change, and checks its own rewrites instead of judging them anew; from the fourth run only a CHẶN holds the words back;
# after the sixth it stops (the words need the user, not a seventh review).
# A line with a machine flag (DARK SAME RUN NUM) fails even if the reviewer passed it.
# The reviewer: $LEMO_CRITIC if set (a command; the prompt is appended as its last argument, it runs in the review
# folder), else `omp -p` (with --model $LEMO_CRITIC_MODEL if set), else `claude -p`. Use your own model: a new session
# of it is independent enough, and it has your eyes.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=$(cd "$HERE/../.." && pwd)
EP=$1; [ -n "$EP" ] && [ -d "$EP" ] || { echo "usage: review.sh <episode> [--lines a-b] [--video]" >&2; exit 2; }
EP=$(cd "$EP" && pwd); shift
LINES=""; VIDEO=0; SCRIPT=0; PROPS=0
while [ $# -gt 0 ]; do case "$1" in --lines) LINES=$2; shift 2 ;; --video) VIDEO=1; shift ;; --script) SCRIPT=1; shift ;; --props) PROPS=1; shift ;; *) echo "unknown: $1" >&2; exit 2 ;; esac; done

W=$(mktemp -d "${TMPDIR:-/tmp}/lemo-review-XXXXXX")   # outside the repository: the reviewer cannot wander into the code
trap 'cd /; rm -rf "$W"' EXIT

critic() {   # $1 = the prompt; runs in $W, leaves the reviewer's answer in $W/out.txt
  cd "$W"
  if [ -n "$LEMO_CRITIC" ]; then sh -c "$LEMO_CRITIC \"\$1\"" _ "$1" < /dev/null > out.txt 2>&1 || true
  elif command -v omp >/dev/null; then omp -p ${LEMO_CRITIC_MODEL:+--model "$LEMO_CRITIC_MODEL"} --cwd "$W" "$1" < /dev/null > out.txt 2>&1 || true
  else claude -p "$1" < /dev/null > out.txt 2>&1 || true; fi
}

if [ "$PROPS" = 1 ]; then
  echo "review --props: three views of every object…" >&2
  (cd "$LIB" && node channels/tram-nghi-nhieu/propcheck.mjs "$EP" --out "$W/p" >/dev/null) || exit 2
  mkdir -p "$W/blind"; cp "$W"/p/p_*.jpg "$W/blind/"
  N=$(ls "$W"/blind | wc -l)
  # 1. blind: this session never sees the names
  cd "$W/blind"
  W0=$W; W="$W/blind"
  critic "Trong thư mục này có $N ảnh p_01.jpg … Mỗi ảnh là MỘT vật dựng 3D kiểu hoạt hình, nhìn từ ba phía (chéo, ngang, trên xuống), đặt trên nền trơn. Mở từng ảnh. Với mỗi ảnh, nói nó là vật gì như một người xem bình thường sẽ gọi: một cụm danh từ tiếng Việt cụ thể (\"quả chuối chín\", \"con chip máy tính\", \"cục pin điện thoại bị cắt đôi\"), cả trạng thái nếu thấy (xanh/chín, nguyên/cắt đôi). Đừng đoán theo một câu chuyện nào. Nếu không chắc, viết KHÔNG RÕ và nói nó giống những gì. Viết BLIND.md ở đây, mỗi ảnh một dòng:
#n TÊN: <tên> | CHẮC: cao|vừa|thấp | THẤY: <những chi tiết làm bạn gọi tên như vậy; chi tiết nào lạ>
rồi in lại nó."
  [ -s BLIND.md ] || cp out.txt BLIND.md
  W=$W0; cd "$W"; cp blind/BLIND.md .
  python3 -c "
import json; P=json.load(open('p/props.json'))
open('NAMES.md','w').write('\n'.join(f\"#{x['n']} {x['name']}  (p/p_{x['n']:02d}.jpg)\" for x in P)+'\n')"
  # 2. judge: the blind names against the intended ones
  critic "Bạn kiểm tra vật dựng cho kênh Trạm Nghĩ Nhiều, nơi mọi vật có thật phải dựng đúng là nó, nhìn một giây là biết (trực thăng ra trực thăng có cánh quạt, đuôi, càng; không bao giờ là một cái hộp thay cho nó). Một người xem khác, không biết vật định dựng là gì, đã gọi tên từng vật trong BLIND.md. NAMES.md là tên người làm định dựng. Ảnh ở p/.
Với từng vật: so tên mù với tên định dựng. KHỚP khi danh từ chính trong tên mù là đúng vật đó (từ đồng nghĩa được), trạng thái đúng (xanh/chín, nguyên/cắt đôi, chất liệu như thuỷ tinh/nhựa/kim loại), và độ chắc cao hoặc vừa. HỎNG khi: gọi thành một vật gần giống (bát thành đĩa, thuỷ tinh thành nhựa, chuối lốm đốm thành chuối chín), vật định dựng chỉ là một phần trong tên của vật khác (\"ống vàng có găng tay\" cho một bàn tay), KHÔNG RÕ, hay chắc thấp. Đừng nương tay: người xem phim chỉ có một giây. Riêng linh kiện kỹ thuật mà người thường không biết tên (thanh lưỡng kim, tiếp điểm công tắc, rơ-le, mâm nhiệt): KHỚP khi người xem tả đúng hình thật làm nên nó (hai lớp kim loại khác màu dán vào nhau; hai lá kim loại có đầu tiếp xúc bạc, nối dây điện; đĩa kim loại có dây điện trở) và không gọi nó thành một vật thường khác (kẹp quần áo, bản lề, bếp ga): đó là HỎNG. Mở ảnh của vật hỏng, chỉ ra vì sao nó bị gọi sai (thiếu bộ phận đặc trưng nào, tỉ lệ sai, màu hay chất liệu sai, trông như vật nào khác), và cách sửa bằng hình: thêm bộ phận gì, đổi hình dáng gì, chất liệu gì. Cả vật khớp cũng ghi chỗ còn thô (khối trơn, thiếu chi tiết bề mặt) nếu có.
Viết PROPS-REVIEW.md ở thư mục này theo mẫu:
VERDICT: PASS | FAIL      (PASS chỉ khi mọi vật KHỚP)
#n <tên định dựng> — KHỚP|HỎNG — người xem gọi: <tên mù>
  → SỬA: <cách sửa bằng hình>
rồi in lại nó."
  [ -s PROPS-REVIEW.md ] || cp out.txt PROPS-REVIEW.md
  mkdir -p "$EP/review"; n=$(ls "$EP/review" | grep -c '^PROPS-REVIEW-' || true); n=$((n + 1))
  { cat PROPS-REVIEW.md; printf '\n## Người xem không biết tên đã gọi\n'; cat BLIND.md; } > "$EP/review/PROPS-REVIEW-$n.md"
  cp "$EP/review/PROPS-REVIEW-$n.md" "$EP/review/PROPS-REVIEW.md"; mkdir -p "$EP/review/props"; cp p/p_*.jpg "$EP/review/props/"
  cat "$EP/review/PROPS-REVIEW.md"
  if grep -q '^VERDICT: *PASS' PROPS-REVIEW.md; then python3 "$HERE/gate.py" stamp "$EP" props "$EP/review/PROPS-REVIEW-$n.md"; echo "review --props: PASS"; exit 0; fi
  echo "review --props: FAIL (sửa src/props.js theo $EP/review/PROPS-REVIEW.md, ảnh ở $EP/review/props/, rồi chạy lại)"; exit 1
fi

if [ "$SCRIPT" = 1 ]; then
  [ -f "$EP/voice/lines.json" ] || { echo "review --script: $EP/voice/lines.json not written yet" >&2; exit 2; }
  mkdir -p "$EP/review"; n=$(ls "$EP/review" | grep -c '^SCRIPT-REVIEW-[0-9]*\.md$' || true); n=$((n + 1))
  if [ "$n" -gt 6 ]; then
    echo "review --script: đã chấm 6 lần mà lời vẫn chưa PASS. Dừng: ghi vào LOOK.md những lỗi CHẶN còn lại của $EP/review/SCRIPT-REVIEW.md và hỏi người dùng (câu hỏi có đổi được không, dữ kiện nào cần nguồn). Đừng chấm lần thứ bảy." >&2; exit 1
  fi
  cp "$EP/voice/lines.json" "$HERE/STRATEGY.md" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
  p=$((n - 1)); [ -f "$EP/review/SCRIPT-REVIEW-$p.md" ] && cp "$EP/review/SCRIPT-REVIEW-$p.md" "$W/PREVIOUS.md"
  [ -f "$EP/review/script-lines-$p.json" ] && cp "$EP/review/script-lines-$p.json" "$W/PREVIOUS-lines.json"
  cp "$EP/voice/lines.json" "$EP/review/script-lines-$n.json"
  python3 - "$W" "$EP" "$n" <<'PY'
import json, sys, os, re
W, EP, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
L = json.load(open(W + '/lines.json'))
norm = lambda t: re.sub(r'[\s"“”]+', ' ', t).strip().lower()
prev, rew = {}, set()   # text of a line the last review passed -> True; the rewrites it asked for
if os.path.exists(W + '/PREVIOUS.md') and os.path.exists(W + '/PREVIOUS-lines.json'):
    R = open(W + '/PREVIOUS.md').read(); PL = json.load(open(W + '/PREVIOUS-lines.json'))
    ok = {int(m.group(1)): m.group(2) == 'OK' for m in re.finditer(r'^#(\d+)\s+(OK|FAIL)', R, re.M)}
    prev = {norm(x['text']): ok.get(i, False) for i, x in enumerate(PL, 1)}
    rew = {norm(q) for q in re.findall(r'VIẾT LẠI: *"([^"]+)"', R)} | {norm(q) for q in re.findall(r'THÊM SAU #\d+: *"([^"]+)"', R)}
title = json.load(open(EP + '/film.json')).get('title', '') if os.path.exists(EP + '/film.json') else ''
facts = os.path.exists(W + '/FACTS.md')
T = [f"# Chấm kịch bản: {title or '(chưa có tên)'}", '', f"{len(L)} câu, {sum(len(x['text'].split()) for x in L)} chữ.", '']
if not facts: T += ['Cờ cả tập: NOFACTS', '']
fl = [] if facts else ['NOFACTS']
for i, x in enumerate(L, 1):
    f = (['DIGIT'] if re.search(r'\d', x['text']) else []) + (['LONG'] if len(x['text'].split()) > 32 else [])
    if f: fl.append(f"#{i}:{'+'.join(f)}")
    k = norm(x['text'])
    st = '' if not prev else ('GIỮ' if prev.get(k) else 'THEO-BẠN' if k in rew else 'CHƯA-SỬA' if k in prev else 'MỚI')
    T.append(f"#{i}  cờ: {' '.join(f) or '—'}{'  lần trước: ' + st if st else ''}  lời: {x['text']}")
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
if prev:
    T += ['', f"## Đây là lần chấm thứ {n}", '',
          "PREVIOUS.md là bản chấm lần trước của chính bạn. Người viết đã sửa theo nó. Mục đích của lần này là đưa lời tới PASS, không phải chấm một bài mới:",
          "- Trước tiên, với từng lỗi trong PREVIOUS.md: đã sửa chưa, sửa đúng chưa.",
          "- `GIỮ`: câu lần trước bạn cho OK và chữ không đổi. Ghi OK, đừng chấm lại; chỉ được đánh lỗi nếu nó sai dữ kiện (CHẶN nhóm A) hay câu bên cạnh mới đổi làm nó sai.",
          "- `THEO-BẠN`: câu là nguyên văn câu VIẾT LẠI / THÊM SAU bạn đưa lần trước. Đừng đánh lỗi nhóm E, F mới cho nó: bạn đã chọn câu đó. Chỉ đánh lỗi nếu nó sai dữ kiện.",
          "- `CHƯA-SỬA`: lần trước FAIL mà chữ không đổi. `MỚI`: câu mới hay sửa theo cách khác. Hai loại này chấm đầy đủ.",
          "- Một lỗi mới chỉ là CHẶN khi đúng định nghĩa CHẶN. Đừng đổi ý về điều lần trước bạn đã chấp nhận, đừng viết lại câu theo một cách khác chỉ vì cách đó hay hơn."]
    if n >= 4:
        T += [f"- Từ lần thứ tư, chỉ lỗi CHẶN giữ lời lại: không còn CHẶN thì lời qua, các lỗi NẶNG, NHẸ còn lại người viết tự sửa theo ghi chú của bạn. Vì thế hãy dùng CHẶN đúng và đủ: dữ kiện sai hay không nguồn, nhân quả sai chiều, câu chỉ dựng được bằng ẩn dụ, thuật ngữ bịa, kết không trả lời câu hỏi."]
    open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
open(W + '/flags.txt', 'w').write(' '.join(fl))
PY
  echo "review --script: reviewer at work in $W…" >&2
  critic "$(cat "$HERE/SCRIPT-CRITIC.md")

$(cat "$W/TASK.md")

Thư mục làm việc của bạn: $W. Đọc lines.json, FACTS.md, STRATEGY.md (và PREVIOUS.md nếu có), rồi viết SCRIPT-REVIEW.md ở đó theo mẫu, và in lại nó."
  [ -s SCRIPT-REVIEW.md ] || cp out.txt SCRIPT-REVIEW.md
  FLAGGED=$(cat flags.txt)
  # from the fourth run only a CHẶN holds the words back
  if [ "$n" -ge 4 ] && [ -z "$FLAGGED" ] && ! grep -q '^VERDICT: *PASS' SCRIPT-REVIEW.md && ! grep -q '\[CHẶN\]' SCRIPT-REVIEW.md && grep -q '^#[0-9]' SCRIPT-REVIEW.md; then
    sed -i "s/^VERDICT:.*/VERDICT: PASS (lần chấm thứ $n, không còn lỗi CHẶN; sửa nốt các lỗi NẶNG bên dưới theo VIẾT LẠI rồi chạy --script thêm một lần để đóng dấu lời mới)/" SCRIPT-REVIEW.md
  fi
  { cat SCRIPT-REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > "$EP/review/SCRIPT-REVIEW-$n.md"
  cp "$EP/review/SCRIPT-REVIEW-$n.md" "$EP/review/SCRIPT-REVIEW.md"
  cat "$EP/review/SCRIPT-REVIEW.md"
  if grep -q '^VERDICT: *PASS' "$EP/review/SCRIPT-REVIEW.md" && [ -z "$FLAGGED" ]; then python3 "$HERE/gate.py" stamp "$EP" script "$EP/review/SCRIPT-REVIEW-$n.md"; echo "review --script: PASS"; exit 0; fi
  echo "review --script: FAIL (sửa lines.json theo $EP/review/SCRIPT-REVIEW.md, rồi chạy lại)"; exit 1
fi

mkdir -p "$W/beats" "$W/ref"
echo "review: beat frames…" >&2
REL=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$EP" "$LIB")   # the page server serves the library root
(cd "$LIB" && node channels/tram-nghi-nhieu/beatsheet.mjs "$REL" --out "$W/beats" >/dev/null)
cp "$EP/voice/lines.json" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
cp "$W/beats/beats.json" "$W/"
for f in set_kitchen inside_banana flow cutaway_3; do [ -f "$HERE/demo/stills/$f.jpg" ] && cp "$HERE/demo/stills/$f.jpg" "$W/ref/"; done
rm -f "$W/beats/"sheet_*.jpg

MP4=""; [ "$VIDEO" = 1 ] && MP4=$(ls -t "$EP"/*.mp4 2>/dev/null | head -1)
python3 - "$W" "$LINES" "$MP4" <<'EOF'
import json, sys, subprocess, os
W, rng, mp4 = sys.argv[1], sys.argv[2], sys.argv[3]
B = json.load(open(W + '/beats.json'))
a, b = (map(int, rng.split('-')) if rng else (1, len(B)))
pick = [x for x in B if a <= x['n'] <= b]
if mp4:
    os.makedirs(W + '/strips', exist_ok=True)
    for x in pick:
        if x.get('missing'): continue
        t0, t1 = x['t0'], x['t1']; ins = []
        for k in range(4): ins += ['-ss', f"{t0 + (t1 - t0) * (k + .5) / 4:.2f}", '-i', mp4]
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex',
                        ''.join(f'[{k}:v]scale=480:-1,trim=end_frame=1[v{k}];' for k in range(4)) + ''.join(f'[v{k}]' for k in range(4)) + 'hstack=4',
                        '-frames:v', '1', f"{W}/strips/s_{x['n']:03d}.jpg"], check=False)
T = [f"# Chấm câu {a}–{b}" + (" (cả phim)" if (a, b) == (1, len(B)) else " (một cảnh; câu trước đó chỉ để so)"), '']
if a > 1: T.append(f"Câu {a-1} (chỉ để so, không chấm): beats/b_{a-1:03d}.jpg")
for x in pick:
    s = f"#{x['n']}  beats/b_{x['n']:03d}.jpg" + (f"  strips/s_{x['n']:03d}.jpg" if mp4 else '')
    T.append(s + f"  cờ: {' '.join(x.get('flags') or []) or '—'}  lời: {x['text']}")
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
EOF

PROMPT="$(cat "$HERE/CRITIC.md")

$(cat "$W/TASK.md")

Thư mục làm việc của bạn: $W. Mở từng ảnh của các câu trên, rồi viết REVIEW.md ở đó theo mẫu, và in lại nó."
echo "review: reviewer at work in $W…" >&2
critic "$PROMPT"
[ -s REVIEW.md ] || cp out.txt REVIEW.md

# the machine flags stand: a flagged line in range fails the review whatever the verdict says
FLAGGED=$(python3 -c "
import json,sys; B=json.load(open('beats.json')); r='$LINES'
a,b=(map(int,r.split('-')) if r else (1,len(B)))
print(' '.join(f\"#{x['n']}:{'+'.join(x['flags'])}\" for x in B if a<=x['n']<=b and x.get('flags')))")
mkdir -p "$EP/review"; n=$(ls "$EP/review" | grep -c '^REVIEW-' || true); n=$((n + 1))
{ cat REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > "$EP/review/REVIEW-$n.md"
cp "$EP/review/REVIEW-$n.md" "$EP/review/REVIEW.md"
cat "$EP/review/REVIEW.md"
if grep -q '^VERDICT: *PASS' "$EP/review/REVIEW.md" && [ -z "$FLAGGED" ]; then
  # the stamp the build asks for: only a review of the whole film, before the render, opens the gate
  [ -z "$LINES" ] && [ "$VIDEO" = 0 ] && python3 "$HERE/gate.py" stamp "$EP" picture "$EP/review/REVIEW-$n.md"
  echo "review: PASS"; exit 0
fi
echo "review: FAIL (sửa theo $EP/review/REVIEW.md, rồi chạy lại)"; exit 1
