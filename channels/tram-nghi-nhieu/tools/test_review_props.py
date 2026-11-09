#!/usr/bin/env python3
"""test_review_props.py — vòng chấm vật dựng phải chạy được từ đầu đến cuối.

Đây là vòng chấm duy nhất hỏi người chấm hai câu khác nhau: hai pha gọi tên mù trả lời bằng một DANH
SÁCH tên vật, chứ không phải bằng một phán quyết. Một vòng chết oan ở đúng hai pha đó đã đốt mất hai vòng
chấm 9 phút của một tập thật, và không ai biết vì sao cho tới khi có người đọc mã.

Bài này chạy TRỌN vòng chấm vật dựng với một người chấm giả và một công cụ dựng ảnh giả: không GPU,
không trình duyệt, không tốn thời gian của người chấm thật — hai giây.

    python3 channels/tram-nghi-nhieu/tools/test_review_props.py --selftest
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
REVIEW_SH = os.path.join(LIB, "channels", "tram-nghi-nhieu", "tools", "review.sh")

# The CLI's own noise. It is printed before any answer, every time, and it is not an answer.
WARNINGS = (
    "⚠ claude.ai connectors are disabled because ANTHROPIC_API_KEY or another auth source is set\n"
    "[claude-code:unrecognized_model] {\"model\":\"2tocom/MiniMax-M3.1-Flash[1m]\"}\n"
)

# The stub that renders the three views of every object. It stands in for propcheck.mjs.
PROPCHECK = r"""#!/bin/sh
out=""
while [ $# -gt 0 ]; do
  case "$1" in --out) out=$2; shift 2;; *) shift;; esac
done
mkdir -p "$out"
printf 'jpeg' > "$out/p_01.jpg"
printf 'jpeg' > "$out/p_02.jpg"
printf '[{"n": 1, "name": "vật một", "f": "p_01.jpg"}, {"n": 2, "name": "vật hai", "f": "p_02.jpg"}]' > "$out/props.json"
"""

# The stub reviewer. It answers the phase it is asked about, by the file the prompt names.
CRITIC = r"""#!/bin/sh
prompt=""
for a in "$@"; do prompt="$a"; done
if [ -n "${PROMPT_DUMP:-}" ]; then printf '===PROMPT===\n%s\n' "$prompt" >> "$PROMPT_DUMP"; fi
case "$prompt" in
  *"Viết BLIND2.md"*)
    if [ "${FAKE_FAIL2:-0}" = 1 ]; then printf '%s' "$WARNINGS"; exit 0; fi
    printf '#2 TÊN: cục pin | CHẮC: cao | THẤY: hình trụ, hai đầu phẳng\n' > BLIND2.md
    cat BLIND2.md ;;
  *"Viết BLIND.md"*)
    if [ "${FAKE_FAIL1:-0}" = 1 ]; then printf '%s' "$WARNINGS"; exit 0; fi
    printf '#1 TÊN: quả cà chua | CHẮC: cao | THẤY: màu đỏ, tròn\n' > BLIND.md
    printf '#2 TÊN: cục pin | CHẮC: thấp | THẤY: hình trụ\n' >> BLIND.md
    cat BLIND.md ;;
  *"Viết PROPS-REVIEW.md"*)
    printf '#1 vật một — A — KHỚP — người xem gọi: quả cà chua\n  → SỬA: không cần sửa\n' > PROPS-REVIEW.md
    printf '#2 vật hai — B — KHỚP — người xem gọi: cục pin\n  → SỬA: không cần sửa\n' >> PROPS-REVIEW.md
    printf 'VERDICT: PASS\n' >> PROPS-REVIEW.md
    cat PROPS-REVIEW.md ;;
  *) printf '%s' "$WARNINGS" ;;
esac
exit 0
"""


def write_stub(directory, name, body):
    p = os.path.join(directory, name)
    with open(p, "w", encoding="utf-8") as fh:
        fh.write(body)
    os.chmod(p, 0o755)
    return p


def make_episode(root, name="tap-gia"):
    ep = os.path.join(root, name)
    os.makedirs(os.path.join(ep, "src"), exist_ok=True)
    os.makedirs(os.path.join(ep, "review"), exist_ok=True)
    with open(os.path.join(ep, "src", "props.js"), "w", encoding="utf-8") as fh:
        fh.write("// vật 1\n")
    return ep


def run_props(ep, stubs, extra=None, timeout=300):
    env = dict(os.environ)
    env.update({
        "LEMO_CRITIC_CLI": stubs["critic"],
        "PROPCHECK": stubs["propcheck"],
        "CRITIC_TIMEOUT": "60",
        "WARNINGS": WARNINGS,
    })
    env.update(extra or {})
    proc = subprocess.run(
        ["sh", REVIEW_SH, ep, "--props"],
        capture_output=True, text=True, timeout=timeout, cwd=LIB, env=env,
    )
    return proc.returncode, proc.stdout + proc.stderr


def selftest():
    if not os.path.isfile(REVIEW_SH):
        print("FAIL review.sh không có ở %s" % REVIEW_SH)
        return 1
    failures = []

    def check(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    root = tempfile.mkdtemp(prefix="lemo-props-")
    try:
        stubs = {
            "critic": write_stub(root, "stub-critic", CRITIC),
            "propcheck": write_stub(root, "stub-propcheck", PROPCHECK),
        }

        # 1. the round runs from end to end and stamps the episode
        ep = make_episode(root, "tap-1")
        dump = os.path.join(root, "prompts.txt")
        rc, out = run_props(ep, stubs, {"PROMPT_DUMP": dump})
        check("vòng chấm vật dựng chạy tới cuối", rc == 0, "rc=%d out=%s" % (rc, out.strip()[-400:]))
        check("vòng chấm báo PASS", "review --props: PASS" in out, out.strip()[-400:])
        check("tem props được đóng",
              os.path.isfile(os.path.join(ep, "review", "PROPS.pass")),
              str(os.listdir(os.path.join(ep, "review"))))
        rep = os.path.join(ep, "review", "PROPS-REVIEW-1.md")
        check("bản chấm vòng 1 được ghi", os.path.isfile(rep), str(os.listdir(os.path.join(ep, "review"))))
        if os.path.isfile(rep):
            body = open(rep, encoding="utf-8").read()
            check("bản chấm có phán quyết", "VERDICT: PASS" in body, body[-200:])
            check("bản chấm có tên người xem gọi", "quả cà chua" in body, body[-200:])
            check("bản chấm có số vòng", "ROUND:" in body, body[-200:])

        # 1b. the reviewer must receive the WHOLE prompt: a quote mark inside it used to cut the
        # rubric off, and the reviewer judged props it had never been told about
        prompts = open(dump, encoding="utf-8").read() if os.path.isfile(dump) else ""
        chunks = [c.strip() for c in prompts.split("===PROMPT===") if c.strip()]
        check("người chấm nhận đủ ba prompt", len(chunks) == 3, str(len(chunks)))
        for i, c in enumerate(chunks):
            # "Không bị cắt" nghĩa là prompt đi hết bộ tiêu chí, không phải là kết thúc bằng một câu
            # cụ thể: `critic()` nối thêm khối "Bối cảnh vòng chấm" vào sau prompt, nên câu cuối cùng
            # của prompt đã đổi. Cái cần giữ là tiêu chí vẫn trọn và khối bối cảnh vẫn có.
            check("prompt %d không bị cắt ở giữa" % (i + 1),
                  "in lại nó." in c and "Bối cảnh vòng chấm:" in c, c[-160:])
        check("người chấm nhận đủ tiêu chí KHỚP/HỎNG", "KHỚP" in prompts and "HỎNG" in prompts, "")
        check("người chấm nhận đủ hai nhóm A và B",
              "A. VẬT ĐỨNG RIÊNG" in prompts and "B. VẬT LÀ PHẦN HOẶC CƠ CHẾ" in prompts, "")
        check("người chấm được bảo viết PROPS-REVIEW.md", "Viết PROPS-REVIEW.md" in prompts, "")

        # 2. the blind names are missing: the round dies, and says why
        ep = make_episode(root, "tap-2")
        rc, out = run_props(ep, stubs, {"FAKE_FAIL1": "1"})
        check("lần gọi tên thứ nhất không có câu trả lời thì vòng chết", rc == 2, "rc=%d out=%s" % (rc, out.strip()[-400:]))
        check("vòng chết nói lý do", "không trả lời" in out, out.strip()[-400:])
        left = [f for f in os.listdir(os.path.join(ep, "review")) if f.startswith("PROPS-REVIEW-")]
        check("vòng chết không mất lượt chấm", not left, str(left))

        # 3. the second namer says nothing: the round goes on, and says what is missing
        ep = make_episode(root, "tap-3")
        rc, out = run_props(ep, stubs, {"FAKE_FAIL2": "1"})
        check("lần đoán thứ hai không có câu trả lời thì vòng vẫn đi tiếp", rc == 0,
              "rc=%d out=%s" % (rc, out.strip()[-400:]))
        check("vòng nói rõ phép đo bổ sung đã thiếu", "lần đoán thứ hai không trả lời" in out,
              out.strip()[-400:])
    finally:
        shutil.rmtree(root, ignore_errors=True)

    if failures:
        print("\n%d ca hỏng" % len(failures))
        return 1
    print("\n3 ca đều đúng")
    return 0


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        sys.exit(selftest())
    print(__doc__)
    sys.exit(0)
