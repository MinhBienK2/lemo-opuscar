#!/bin/sh
# Independent review: a fresh model session that never sees the code or the maker's notes judges one part of an
# episode and writes, line by line, what to fix. Every run exits 0 on PASS, 1 on FAIL, 2 when it cannot run.
#
#   sh channels/tram-nghi-nhieu/review.sh <episode> --outline                 TREATMENT.md + FACTS.md, before any line
#   sh channels/tram-nghi-nhieu/review.sh <episode> --script [--chapter n]    voice/lines.json, before any voice
#   sh channels/tram-nghi-nhieu/review.sh <episode> --props                   every object of src/props.js, alone
#   sh channels/tram-nghi-nhieu/review.sh <episode> --lines a-b               one scene just built (no stamp)
#   sh channels/tram-nghi-nhieu/review.sh <episode> [--chapter n]             the picture of a chapter / of the film
#   sh channels/tram-nghi-nhieu/review.sh <episode> --video [--chapter n]     after the render: four frames per line
#
# The judges' rules live directly in the skill: .agents/skills/tram-nghi-nhieu/step*/PROMPT_CRITIC.md
# The reports go to <episode>/review/:
#   OUTLINE-REVIEW[-n].md, SCRIPT-REVIEW[-<ch>]-n.md, PROPS-REVIEW-n.md, REVIEW[-<ch>|-lines-a-b][-video]-n.md,
# A PASS of --outline, --script, --props, of a chapter or of the whole film stamps what was judged (gate.py); the voice
# (tts_vi.py), the mix (mix.py) and the render (core/render/video.mjs) refuse an episode whose stamps do not hold.
# An episode with src/chapters.js is judged chapter by chapter: --script --chapter n and --chapter n.
#
# Rounds: the outline 4, the words 6 (per chapter), a scene 3, a chapter or the whole film 5. When the rounds are used
# up the episode needs the user, not another round: the script says so and exits 1.
#
# A machine flag (script: DIGIT LONG NOFACTS; picture: DARK SAME RUN NUM) fails its line unless the reviewer cleared it
# in the report with "CỜ SAI <FLAG>: <why>" (LONG and the picture flags only: a digit or a missing FACTS.md is never
# wrong). The maker cannot clear a flag.
#
# The reviewer: LEMO_CRITIC_CLI=omp|claude (default: omp when it is installed, else claude), LEMO_CRITIC_MODEL for the
# model (default: that tool's own default model, which may not be the model you are). Who judged is signed under every
# report and written into the stamp.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=$(cd "$HERE/../.." && pwd)
GATE="python3 $HERE/gate.py"
die() { echo "review: $*" >&2; exit 2; }
EP=$1; [ -n "$EP" ] && [ -d "$EP" ] || die "usage: review.sh <episode> [--outline | --script | --props | --lines a-b | --chapter n] [--video]"
EP=$(cd "$EP" && pwd); shift
LINES=""; VIDEO=0; SCRIPT=0; PROPS=0; OUTLINE=0; CHAPTER=""
while [ $# -gt 0 ]; do
  case "$1" in
    --lines) LINES=$2; shift 2 ;;
    --chapter|--scene) CHAPTER=$2; shift 2 ;;
    --video) VIDEO=1; shift ;;
    --script) SCRIPT=1; shift ;;
    --props) PROPS=1; shift ;;
    --outline) OUTLINE=1; shift ;;
    *) die "unknown: $1" ;;
  esac
done

# —— the reviewer ——
[ -n "$LEMO_CRITIC" ] && die "LEMO_CRITIC (any command as the reviewer) is gone: choose LEMO_CRITIC_CLI=omp|claude and LEMO_CRITIC_MODEL"
CLI=${LEMO_CRITIC_CLI:-$(command -v omp >/dev/null && echo omp || echo claude)}
case "$CLI" in omp|claude) command -v "$CLI" >/dev/null || die "the reviewer '$CLI' is not installed" ;; *) die "LEMO_CRITIC_CLI must be omp or claude" ;; esac
CRITIC_ID="$CLI -p ${LEMO_CRITIC_MODEL:+--model $LEMO_CRITIC_MODEL}"; [ -n "$LEMO_CRITIC_MODEL" ] || CRITIC_ID="$CRITIC_ID(model mặc định của $CLI)"
critic() {   # $1 = the prompt; runs in the current folder, leaves the reviewer's answer in out.txt
  if [ "$CLI" = omp ]; then omp -p ${LEMO_CRITIC_MODEL:+--model "$LEMO_CRITIC_MODEL"} --cwd "$PWD" "$1" < /dev/null > out.txt 2>&1 || true
  else claude -p ${LEMO_CRITIC_MODEL:+--model "$LEMO_CRITIC_MODEL"} --permission-mode acceptEdits "$1" < /dev/null > out.txt 2>&1 || true; fi
}
sign() { printf '\n---\nNgười chấm: %s · review.sh %s · %s\n' "$CRITIC_ID" "$1" "$(date '+%Y-%m-%d %H:%M')" >> "$2"; }
# next number of a report: next <prefix> → n for <prefix>n.md
next() { n=$(ls "$EP/review" 2>/dev/null | grep -cE "^$1[0-9]+\.md$" || true); echo $((n + 1)); }
# the flags still standing after the reviewer's "CỜ SAI": unflag <review> "<#n:A+B …>" "<flags it may clear>"
unflag() {
  python3 - "$1" "$2" "$3" <<'PY'
import re, sys
text, flagged, may = open(sys.argv[1], encoding='utf-8').read(), sys.argv[2].split(), set(sys.argv[3].split())
cleared, n = {}, None
for ln in text.split('\n'):
    m = re.match(r'#(\d+)\b', ln.strip())
    if m: n = int(m.group(1))
    elif ln.startswith('## '): n = None
    for c in re.finditer(r'CỜ SAI\s*:?\s*([A-Z][A-Z+, /]*)', ln):
        if n is not None: cleared.setdefault(n, set()).update(re.findall(r'[A-Z]{3,}', c.group(1)))
out = []
for f in flagged:
    k, fl = f.lstrip('#').split(':')
    left = [x for x in fl.split('+') if not (x in may and x in cleared.get(int(k), set()))]
    if left: out.append(f"#{k}:{'+'.join(left)}")
print(' '.join(out))
PY
}

mkdir -p "$EP/review"
W=$(mktemp -d "${TMPDIR:-/tmp}/lemo-review-XXXXXX")   # outside the repository: the reviewer is not shown the code
trap 'cd /; rm -rf "$W"' EXIT
CHID=""
if [ -n "$CHAPTER" ]; then
  R=$($GATE chapter "$EP" "$CHAPTER") || exit 2
  LINES=${R% *}; CHID=${R#* }
  echo "review: chapter $CHID -> lines $LINES" >&2
fi

# ——————————————————————————————————————————— the outline ———————————————————————————————————————————
if [ "$OUTLINE" = 1 ]; then
  [ -f "$EP/TREATMENT.md" ] && [ -f "$EP/research/FACTS.md" ] || die "--outline needs TREATMENT.md and research/FACTS.md"
  grep -q '<viết:' "$EP/TREATMENT.md" && die "TREATMENT.md still holds '<viết: …>' placeholders of the template: write them first"
  n=$(next OUTLINE-REVIEW-)
  if [ "$n" -gt 4 ]; then
    echo "review --outline: đã chấm 4 lần mà dàn ý vẫn chưa PASS. Dừng: báo người dùng các lỗi CHẶN còn lại của $EP/review/OUTLINE-REVIEW.md (câu hỏi có cần hẹp lại, đổi định dạng, dữ kiện nào thiếu nguồn) và hỏi hướng đi." >&2; exit 1
  fi
  cp "$EP/TREATMENT.md" "$EP/research/FACTS.md" "$HERE/STRATEGY.md" "$W/"
  p=$((n - 1)); [ -f "$EP/review/OUTLINE-REVIEW-$p.md" ] && cp "$EP/review/OUTLINE-REVIEW-$p.md" "$W/PREVIOUS.md"
  cd "$W"
  PREV=""; [ -f PREVIOUS.md ] && PREV="
Đây là lần chấm thứ $n. PREVIOUS.md là bản chấm lần trước của chính bạn; người làm đã sửa theo nó. Trước tiên xét từng lỗi trong đó: đã sửa chưa, sửa đúng chưa. Đừng đổi ý về điều lần trước bạn đã chấp nhận; mục đích là đưa dàn ý tới PASS."
  echo "review --outline: reviewer at work in $W…" >&2
  critic "$(cat "$LIB/.agents/skills/tram-nghi-nhieu/step1-outline/PROMPT_CRITIC.md")
$PREV
Thư mục làm việc của bạn: $W. Đọc TREATMENT.md, FACTS.md, STRATEGY.md (và PREVIOUS.md nếu có), rồi viết OUTLINE-REVIEW.md ở đó theo mẫu, và in lại nó."
  [ -s OUTLINE-REVIEW.md ] || cp out.txt OUTLINE-REVIEW.md
  sign "--outline" OUTLINE-REVIEW.md
  cp OUTLINE-REVIEW.md "$EP/review/OUTLINE-REVIEW-$n.md"; cp OUTLINE-REVIEW.md "$EP/review/OUTLINE-REVIEW.md"
  cat OUTLINE-REVIEW.md
  if grep -q '^VERDICT: *PASS' OUTLINE-REVIEW.md; then
    $GATE stamp "$EP" outline "$EP/review/OUTLINE-REVIEW-$n.md" --critic "$CRITIC_ID"; echo "review --outline: PASS"; exit 0
  fi
  echo "review --outline: FAIL (sửa TREATMENT.md và FACTS.md theo $EP/review/OUTLINE-REVIEW.md, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the props ———————————————————————————————————————————
if [ "$PROPS" = 1 ]; then
  echo "review --props: three views of every object…" >&2
  (cd "$LIB" && node channels/tram-nghi-nhieu/propcheck.mjs "$EP" --out "$W/p" >/dev/null) || exit 2
  mkdir -p "$W/blind"; cp "$W"/p/p_*.jpg "$W/blind/"
  N=$(ls "$W"/blind | wc -l)
  # 1. blind: this session never sees the names
  cd "$W/blind"
  critic "Trong thư mục này có $N ảnh p_01.jpg … Mỗi ảnh là MỘT vật dựng 3D kiểu hoạt hình, nhìn từ ba phía (chéo, ngang, trên xuống), đặt trên nền trơn. Mở từng ảnh. Với mỗi ảnh, nói nó là vật gì như một người xem bình thường sẽ gọi: một cụm danh từ tiếng Việt cụ thể (\"quả chuối chín\", \"con chip máy tính\", \"cục pin điện thoại bị cắt đôi\"), cả trạng thái nếu thấy (xanh/chín, nguyên/cắt đôi). Đừng đoán theo một câu chuyện nào. Nếu không chắc, viết KHÔNG RÕ và nói nó giống những gì. Viết BLIND.md ở đây, mỗi ảnh một dòng:
#n TÊN: <tên> | CHẮC: cao|vừa|thấp | THẤY: <những chi tiết làm bạn gọi tên như vậy; chi tiết nào lạ>
rồi in lại nó."
  [ -s BLIND.md ] || cp out.txt BLIND.md
  cd "$W"; cp blind/BLIND.md .
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
  n=$(next PROPS-REVIEW-)
  { cat PROPS-REVIEW.md; printf '\n## Người xem không biết tên đã gọi\n'; cat BLIND.md; } > R.md; sign "--props" R.md
  cp R.md "$EP/review/PROPS-REVIEW-$n.md"; cp R.md "$EP/review/PROPS-REVIEW.md"
  mkdir -p "$EP/review/props"; cp p/p_*.jpg "$EP/review/props/"
  cat R.md
  if grep -q '^VERDICT: *PASS' R.md; then $GATE stamp "$EP" props "$EP/review/PROPS-REVIEW-$n.md" --critic "$CRITIC_ID"; echo "review --props: PASS"; exit 0; fi
  echo "review --props: FAIL (sửa src/props.js theo $EP/review/PROPS-REVIEW.md, ảnh ở $EP/review/props/, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the words ———————————————————————————————————————————
if [ "$SCRIPT" = 1 ]; then
  [ -f "$EP/voice/lines.json" ] || die "--script: $EP/voice/lines.json not written yet"
  $GATE need "$EP" outline || { echo "review --script: chấm dàn ý trước: sh channels/tram-nghi-nhieu/review.sh $EP --outline" >&2; exit 1; }
  if [ -f "$EP/src/chapters.js" ] && [ -z "$CHID" ]; then
    echo "review --script: tập có src/chapters.js thì chấm lời từng chương (--script --chapter n); chấm cả lời một lần cũng được với tập ngắn, không với tập dài." >&2
  fi
  TAG=${CHID:+$CHID-}
  n=$(next "SCRIPT-REVIEW-$TAG")
  if [ "$n" -gt 6 ]; then
    echo "review --script: đã chấm 6 lần ${CHID:+chương $CHID }mà lời vẫn chưa PASS. Dừng: báo người dùng các lỗi CHẶN còn lại của $EP/review/SCRIPT-REVIEW${CHID:+-$CHID}.md và hỏi hướng đi (bỏ ý, đổi câu hỏi, dữ kiện nào cần nguồn). Đừng chấm lần thứ bảy." >&2; exit 1
  fi
  cp "$EP/voice/lines.json" "$HERE/STRATEGY.md" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
  p=$((n - 1)); [ -f "$EP/review/SCRIPT-REVIEW-$TAG$p.md" ] && cp "$EP/review/SCRIPT-REVIEW-$TAG$p.md" "$W/PREVIOUS.md"
  [ -f "$EP/review/script-lines-$TAG$p.json" ] && cp "$EP/review/script-lines-$TAG$p.json" "$W/PREVIOUS-lines.json"
  cp "$EP/voice/lines.json" "$EP/review/script-lines-$TAG$n.json"
  python3 "$LIB/tools/check_script.py" "$EP" > "$W/SCRIPT-AUDIT.txt" 2>&1 || true
  python3 - "$W" "$EP" "$n" "$LINES" <<'PY'
import json, sys, os, re
W, EP, n, rng = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
L = json.load(open(W + '/lines.json'))
a, b = (map(int, rng.split('-')) if rng else (1, len(L)))
norm = lambda t: re.sub(r'[\s"“”]+', ' ', t).strip().lower()
prev, rew = {}, set()   # text of a line the last review passed -> True; the rewrites it asked for
if os.path.exists(W + '/PREVIOUS.md') and os.path.exists(W + '/PREVIOUS-lines.json'):
    R = open(W + '/PREVIOUS.md').read(); PL = json.load(open(W + '/PREVIOUS-lines.json'))
    ok = {int(m.group(1)): m.group(2) == 'OK' for m in re.finditer(r'^#(\d+)\s+(OK|FAIL)', R, re.M)}
    prev = {norm(x['text']): ok.get(i, False) for i, x in enumerate(PL, 1)}
    rew = {norm(q) for q in re.findall(r'VIẾT LẠI: *"([^"]+)"', R)} | {norm(q) for q in re.findall(r'THÊM SAU #\d+: *"([^"]+)"', R)}
title = json.load(open(EP + '/film.json')).get('title', '') if os.path.exists(EP + '/film.json') else ''
facts = os.path.exists(W + '/FACTS.md')
part = L[a - 1:b]
T = [f"# Chấm kịch bản: {title or '(chưa có tên)'}", '',
     f"Cả tập {len(L)} câu, {sum(len(x['text'].split()) for x in L)} chữ."]
if (a, b) != (1, len(L)):
    T += [f"Lần này chỉ chấm câu {a}–{b} (một chương, {sum(len(x['text'].split()) for x in part)} chữ). lines.json có cả tập: đọc các câu ngoài khoảng để hiểu mạch và để bắt ý lặp lại với chương khác, nhưng chỉ ghi điểm và lỗi cho câu {a}–{b}. Mục F (nhịp, độ dài) xét cho chương này."]
T.append('')
if os.path.exists(W + '/SCRIPT-AUDIT.txt'):
    audit = open(W + '/SCRIPT-AUDIT.txt').read()
    if '[WARNINGS]' in audit or '[ERRORS]' in audit:
        T += ['## Cảnh báo trùng lặp & nhịp điệu từ máy (tools/check_script.py):', audit[:1500], '']
if not facts: T += ['Cờ cả tập: NOFACTS', '']
fl = []
for i, x in enumerate(L, 1):
    if not a <= i <= b: continue
    f = (['DIGIT'] if re.search(r'\d', x['text']) else []) + (['LONG'] if len(x['text'].split()) > 32 else []) + ([] if facts else ['NOFACTS'])
    if f: fl.append(f"#{i}:{'+'.join(f)}")
    k = norm(x['text'])
    st = '' if not prev else ('GIỮ' if prev.get(k) else 'THEO-BẠN' if k in rew else 'CHƯA-SỬA' if k in prev else 'MỚI')
    T.append(f"#{i}  cờ: {' '.join(f) or '—'}{'  lần trước: ' + st if st else ''}  lời: {x['text']}")
if prev:
    T += ['', f"## Đây là lần chấm thứ {n}", '',
          "PREVIOUS.md là bản chấm lần trước của chính bạn. Người viết đã sửa theo nó. Mục đích của lần này là đưa lời tới PASS, không phải chấm một bài mới:",
          "- Trước tiên, với từng lỗi trong PREVIOUS.md: đã sửa chưa, sửa đúng chưa.",
          "- `GIỮ`: câu lần trước bạn cho OK và chữ không đổi. Ghi OK, đừng chấm lại; chỉ được đánh lỗi nếu nó sai dữ kiện (CHẶN nhóm A) hay câu bên cạnh mới đổi làm nó sai.",
          "- `THEO-BẠN`: câu là nguyên văn câu VIẾT LẠI / THÊM SAU bạn đưa lần trước. Đừng đánh lỗi nhóm E, F mới cho nó: bạn đã chọn câu đó. Chỉ đánh lỗi nếu nó sai dữ kiện.",
          "- `CHƯA-SỬA`: lần trước FAIL mà chữ không đổi. `MỚI`: câu mới hay sửa theo cách khác. Hai loại này chấm đầy đủ.",
          "- Một lỗi mới chỉ là CHẶN khi đúng định nghĩa CHẶN. Đừng đổi ý về điều lần trước bạn đã chấp nhận, đừng viết lại câu theo một cách khác chỉ vì cách đó hay hơn."]
    if n >= 4:
        T += ["- Từ lần thứ tư, chỉ lỗi CHẶN giữ lời lại: không còn CHẶN thì lời qua, các lỗi NẶNG, NHẸ còn lại người viết tự sửa theo ghi chú của bạn. Vì thế hãy dùng CHẶN đúng và đủ: dữ kiện sai hay không nguồn, nhân quả sai chiều, câu chỉ dựng được bằng ẩn dụ, thuật ngữ bịa, kết không trả lời câu hỏi."]
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
open(W + '/flags.txt', 'w').write(' '.join(fl))
PY
  cd "$W"
  echo "review --script: reviewer at work in $W…" >&2
  critic "$(cat "$LIB/.agents/skills/tram-nghi-nhieu/step2-script/PROMPT_CRITIC.md")

$(cat TASK.md)

Thư mục làm việc của bạn: $W. Đọc lines.json, FACTS.md, STRATEGY.md (và PREVIOUS.md nếu có), rồi viết SCRIPT-REVIEW.md ở đó theo mẫu, và in lại nó."
  [ -s SCRIPT-REVIEW.md ] || cp out.txt SCRIPT-REVIEW.md
  FLAGGED=$(unflag SCRIPT-REVIEW.md "$(cat flags.txt)" "LONG")   # a digit or a missing FACTS.md is never wrong
  # from the fourth run only a CHẶN holds the words back
  if [ "$n" -ge 4 ] && [ -z "$FLAGGED" ] && ! grep -q '^VERDICT: *PASS' SCRIPT-REVIEW.md && ! grep -q '\[CHẶN\]' SCRIPT-REVIEW.md && grep -q '^#[0-9]' SCRIPT-REVIEW.md; then
    sed -i "s/^VERDICT:.*/VERDICT: PASS (lần chấm thứ $n, không còn lỗi CHẶN; sửa nốt các lỗi NẶNG bên dưới theo VIẾT LẠI rồi chạy --script thêm một lần để đóng dấu lời mới)/" SCRIPT-REVIEW.md
  fi
  { cat SCRIPT-REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > R.md
  sign "--script${CHID:+ --chapter $CHID}" R.md
  cp R.md "$EP/review/SCRIPT-REVIEW-$TAG$n.md"; cp R.md "$EP/review/SCRIPT-REVIEW${CHID:+-$CHID}.md"
  cat R.md
  if grep -q '^VERDICT: *PASS' R.md && [ -z "$FLAGGED" ]; then
    $GATE stamp "$EP" script "$EP/review/SCRIPT-REVIEW-$TAG$n.md" ${CHID:+--chapter "$CHID"} --critic "$CRITIC_ID"
    echo "review --script: PASS${CHID:+ (chương $CHID)}"; exit 0
  fi
  echo "review --script: FAIL (sửa lines.json theo $EP/review/SCRIPT-REVIEW${CHID:+-$CHID}.md, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the picture ———————————————————————————————————————————
if [ -f "$EP/src/chapters.js" ] && [ -z "$LINES" ]; then
  die "tập có src/chapters.js: chấm hình từng chương (--chapter n) hay từng cảnh (--lines a-b); cổng mở khi mọi chương PASS"
fi
$GATE need "$EP" outline script props || { echo "review: lời và vật phải PASS trước khi chấm hình (lệnh ở dòng trên)" >&2; exit 1; }
if [ -n "$CHID" ]; then $GATE placeholders "$EP" "$CHID" || exit 1
elif [ -z "$LINES" ]; then $GATE placeholders "$EP" || exit 1; fi
if [ -n "$CHID" ]; then SCOPE="$CHID-"; SCOPE_NAME="một chương"; LIMIT=5
elif [ -n "$LINES" ]; then SCOPE="lines-$LINES-"; SCOPE_NAME="một cảnh"; LIMIT=3
else SCOPE=""; SCOPE_NAME="cả phim"; LIMIT=5; fi
[ "$VIDEO" = 1 ] && SCOPE="${SCOPE}video-"
n=$(next "REVIEW-$SCOPE")
if [ "$n" -gt "$LIMIT" ]; then
  if [ "$SCOPE_NAME" = "một cảnh" ]; then
    echo "review: cảnh $LINES đã chấm $LIMIT lượt. Ghi vào LOOK.md câu nào còn FAIL và vì sao, rồi dựng cảnh sau; lần chấm chương (hay cả phim) sẽ bắt lại nó." >&2
  else
    echo "review: ${CHID:+chương $CHID}${CHID:-cả phim} đã chấm $LIMIT lượt mà chưa PASS. Dừng: báo người dùng điểm và các lỗi còn lại của $EP/review/REVIEW.md, hỏi hướng đi. Đừng bàn giao như một phim đã đạt." >&2
  fi
  exit 1
fi

mkdir -p "$W/beats" "$W/ref"
echo "review: beat frames…" >&2
REL=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$EP" "$LIB")   # the page server serves the library root
(cd "$LIB" && node channels/tram-nghi-nhieu/beatsheet.mjs "$REL" --out "$W/beats" ${LINES:+--lines "$LINES"} >/dev/null)
cp "$EP/voice/lines.json" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
cp "$W/beats/beats.json" "$W/"
for f in set_kitchen inside_banana flow cutaway_3; do [ -f "$HERE/demo/stills/$f.jpg" ] && cp "$HERE/demo/stills/$f.jpg" "$W/ref/"; done
rm -f "$W/beats/"sheet_*.jpg

MP4=""
if [ "$VIDEO" = 1 ]; then MP4=$(ls -t "$EP"/*.mp4 2>/dev/null | head -1); [ -n "$MP4" ] || die "--video: no mp4 in $EP yet"; fi
python3 - "$W" "$LINES" "$MP4" "$SCOPE_NAME" <<'EOF'
import json, sys, subprocess, os
W, rng, mp4, scope = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
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
rule = ("PASS khi mọi mục ≥ 4, không lỗi CHẶN, không câu FAIL" if scope == 'một cảnh'
        else "chấm như cả phim: PASS khi OVERALL ≥ 9, không lỗi CHẶN, không câu FAIL")
T = [f"# Chấm câu {a}–{b} ({scope}; {rule})", '']
if a > 1: T.append(f"Câu {a-1} (chỉ để so, không chấm): beats/b_{a-1:03d}.jpg")
for x in pick:
    s = f"#{x['n']}  beats/b_{x['n']:03d}.jpg" + (f"  strips/s_{x['n']:03d}.jpg" if mp4 else '')
    T.append(s + f"  cờ: {' '.join(x.get('flags') or []) or '—'}  lời: {x['text']}")
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
open(W + '/flags.txt', 'w').write(' '.join(f"#{x['n']}:{'+'.join(x['flags'])}" for x in pick if x.get('flags')))
EOF

cd "$W"
echo "review: reviewer at work in $W…" >&2
critic "$(cat "$LIB/.agents/skills/tram-nghi-nhieu/step6-assembly/PROMPT_CRITIC.md")

$(cat TASK.md)

Thư mục làm việc của bạn: $W. Mở từng ảnh của các câu trên, rồi viết REVIEW.md ở đó theo mẫu, và in lại nó."
[ -s REVIEW.md ] || cp out.txt REVIEW.md
# the machine flags stand unless the reviewer cleared them with "CỜ SAI <FLAG>: <why>"
FLAGGED=$(unflag REVIEW.md "$(cat flags.txt)" "DARK SAME RUN NUM")
{ cat REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > R.md
MODE="(cả phim)"; [ -n "$LINES" ] && MODE="--lines $LINES"; [ -n "$CHID" ] && MODE="--chapter $CHID"
[ "$VIDEO" = 1 ] && MODE="$MODE --video"
sign "$MODE" R.md
cp R.md "$EP/review/REVIEW-$SCOPE$n.md"; cp R.md "$EP/review/REVIEW.md"
cat R.md
if grep -q '^VERDICT: *PASS' R.md && [ -z "$FLAGGED" ]; then
  # only a review of a chapter or of the whole film, before the render, opens the gate
  if [ "$VIDEO" = 0 ] && [ -n "$CHID" ]; then $GATE stamp "$EP" picture "$EP/review/REVIEW-$SCOPE$n.md" --chapter "$CHID" --critic "$CRITIC_ID"
  elif [ "$VIDEO" = 0 ] && [ -z "$LINES" ]; then $GATE stamp "$EP" picture "$EP/review/REVIEW-$SCOPE$n.md" --critic "$CRITIC_ID"; fi
  echo "review: PASS"; exit 0
fi
echo "review: FAIL (sửa theo $EP/review/REVIEW.md, rồi chạy lại)"; exit 1
