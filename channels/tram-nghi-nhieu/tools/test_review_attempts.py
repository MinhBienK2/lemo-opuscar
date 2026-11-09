#!/usr/bin/env python3
"""test_review_attempts.py — một vòng chấm không trả lời phải tiêu một lượt, để vòng lặp có giới hạn.

Một vòng chấm chết không để lại bản chấm, nên số *bản chấm* không tăng, nên ngân sách 5 lượt của vòng
đó không bao giờ chạm: người làm mở vòng lại, vòng lại chết, mở lại, mở lại… tap-02 đã mở vòng vật dựng
12 lần trong 9 giờ và chưa bao giờ đóng tem. Bài này chạy vòng vật dựng với một người chấm giả *không
trả lời*, và kiểm tra hai điều: mỗi lần mở đều được đếm, và vòng thứ chín thì công cụ từ chối mở nữa.

    python3 channels/tram-nghi-nhieu/tools/test_review_attempts.py --selftest
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
REVIEW_SH = os.path.join(LIB, "channels", "tram-nghi-nhieu", "tools", "review.sh")

WARNINGS = "⚠ claude.ai connectors are disabled\n"

PROPCHECK = r"""#!/bin/sh
out=""
while [ $# -gt 0 ]; do
  case "$1" in --out) out=$2; shift 2;; *) shift;; esac
done
mkdir -p "$out"
printf 'jpeg' > "$out/p_01.jpg"
printf '[{"n": 1, "name": "vật một", "f": "p_01.jpg"}]' > "$out/props.json"
"""

# The reviewer that never answers. It says what the CLI says before an answer: noise, not a verdict.
CRITIC = r"""#!/bin/sh
printf 'called\n' >> "$CALL_LOG"
printf '%s' "$WARNINGS"
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


def run_props(ep, stubs, log, timeout=300):
    env = dict(os.environ)
    env.update({
        "LEMO_CRITIC_CLI": stubs["critic"],
        "PROPCHECK": stubs["propcheck"],
        "CALL_LOG": log,
        "WARNINGS": WARNINGS,
        "CRITIC_TIMEOUT": "60",
        "LEMO_ROOM_CHECK": "off",
    })
    proc = subprocess.run(
        ["sh", REVIEW_SH, ep, "--props"],
        capture_output=True, text=True, timeout=timeout, cwd=LIB, env=env,
    )
    return proc.returncode, proc.stdout + proc.stderr


def calls(log):
    if not os.path.isfile(log):
        return 0
    with open(log, encoding="utf-8") as fh:
        return len(fh.read().split())


def selftest():
    if not os.path.isfile(REVIEW_SH):
        print("FAIL review.sh không có ở %s" % REVIEW_SH)
        return 1
    failures = []

    def check(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    root = tempfile.mkdtemp(prefix="lemo-attempts-")
    try:
        stubs = {
            "critic": write_stub(root, "stub-critic", CRITIC),
            "propcheck": write_stub(root, "stub-propcheck", PROPCHECK),
        }
        ep = make_episode(root)
        log = os.path.join(root, "calls.log")

        # eight openings: every one of them starts a reviewer, and every one of them leaves no report
        for i in range(8):
            rc, out = run_props(ep, stubs, log)
            check("lần mở %d không đóng tem" % (i + 1), rc != 0, "rc=%d" % rc)
        counter = os.path.join(ep, "review", ".attempts-props")
        counted = os.path.isfile(counter) and open(counter, encoding="utf-8").read().strip() == "8"
        check("tám lần mở thì đếm tám", counted,
              "đếm=%r" % (open(counter, encoding="utf-8").read().strip() if os.path.isfile(counter) else None))
        check("tám lần mở thì tám lần gọi người chấm", calls(log) == 8, "gọi=%d" % calls(log))
        check("không có bản chấm nào để lấy số báo cáo",
              not [f for f in os.listdir(os.path.join(ep, "review")) if f.startswith("PROPS-REVIEW-")])

        # the ninth opening: the tool must refuse, and must not start a reviewer
        rc, out = run_props(ep, stubs, log)
        check("lần mở thứ chín bị từ chối", rc == 1, "rc=%d" % rc)
        check("lần mở thứ chín không gọi người chấm nữa", calls(log) == 8, "gọi=%d" % calls(log))
        check("lời từ chối nói rõ mở mấy lần và còn mấy bản chấm",
              "đã mở" in out and "bản chấm" in out, out[-300:])
        check("lời từ chối chỉ ra chỗ đọc dấu vết",
              ".round-props.died" in out or ".round-props.running" in out, out[-300:])
    finally:
        shutil.rmtree(root, ignore_errors=True)

    if failures:
        print("\n%d ca sai" % len(failures))
        for f in failures:
            print(" -", f)
        return 1
    print("\n5 ca đều đúng")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else (print(__doc__), 0)[1])
