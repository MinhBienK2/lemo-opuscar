#!/usr/bin/env python3
"""test_review_lock.py — chứng minh rằng hai người chấm không thể chấm cùng một phần.

`review.sh` lấy một khoá theo từng phần (một thư mục `.review-<phần>.lock` trong thư mục tập)
trước khi gọi người chấm. Khoá tồn tại vì một lý do cụ thể: hai người chấm cùng một tập thì hai
bản chấm đè lên nhau, vòng bị đếm hai lần, và ngân sách vòng bị tiêu mất hai lần.

Khoá phải đúng ba điều, và mỗi điều là một ca kiểm thử ở đây:

1. Có khoá sống thì vòng thứ hai **bị chặn** — chấm trùng là một lỗi, không phải một lần làm việc.
2. Khoá **chết** (vòng bị giết) thì phải được lấy lại, không phải bị ngoan ngoãn chờ mãi.
3. Khoá của **phần khác** thì không được chặn: chấm vật dựng và chấm dàn ý là hai việc song song hợp lệ.

Chạy: `python3 channels/tram-nghi-nhieu/tools/test_review_lock.py --selftest`
"""
import os
import shutil
import subprocess
import sys
import tempfile

LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
REVIEW_SH = os.path.join(LIB, "channels", "tram-nghi-nhieu", "tools", "review.sh")

BLOCKED = "đã có một vòng chấm"       # review.sh nói câu này khi bị khoá chặn
PAST_LOCK = "needs TREATMENT.md"           # và nói câu này khi đã đi qua khoá rồi chết vì thiếu dàn ý


def run_review(episode, *flags, timeout=120):
    """chạy review.sh trên một tập giả; trả về (mã thoát, toàn bộ lời in ra)"""
    env = dict(os.environ)
    # the box check must not decide the result of a test: the machine's load is not the subject here
    env["LEMO_ROOM_CHECK"] = "off"
    proc = subprocess.run(
        ["sh", REVIEW_SH, episode] + list(flags),
        capture_output=True, text=True, timeout=timeout, cwd=LIB, env=env,
    )
    return proc.returncode, proc.stdout + proc.stderr


def dead_pid():
    """một pid chắc chắn không còn sống: một tiến trình vừa kết thúc"""
    proc = subprocess.Popen(["true"])
    proc.wait()
    return proc.pid


def make_episode(root, name="tap-gia"):
    ep = os.path.join(root, name)
    os.makedirs(os.path.join(ep, "review"), exist_ok=True)
    return ep


def hold(ep, scope, pid):
    """giữ khoá như một vòng chấm đang chạy"""
    lock = os.path.join(ep, ".review-%s.lock" % scope)
    os.makedirs(lock, exist_ok=True)
    with open(os.path.join(lock, "pid"), "w", encoding="utf-8") as fh:
        fh.write(str(pid))
    return lock


def selftest():
    if not os.path.isfile(REVIEW_SH):
        print("FAIL review.sh không có ở %s" % REVIEW_SH)
        return 1
    failures = []

    def check(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    root = tempfile.mkdtemp(prefix="lemo-lock-")
    try:
        # 1. khoá sống: vòng thứ hai bị chặn
        ep = make_episode(root, "tap-1")
        hold(ep, "outline", os.getpid())
        rc, out = run_review(ep, "--outline")
        check("khoá sống chặn vòng thứ hai", rc != 0 and BLOCKED in out,
              "rc=%d out=%s" % (rc, out.strip()[:200]))
        check("vòng bị chặn không chạy tiếp", PAST_LOCK not in out, out.strip()[:200])

        # 2. khoá chết: vòng sau lấy lại khoá và đi tiếp
        ep = make_episode(root, "tap-2")
        hold(ep, "outline", dead_pid())
        rc, out = run_review(ep, "--outline")
        check("khoá chết được lấy lại", BLOCKED not in out and PAST_LOCK in out,
              "rc=%d out=%s" % (rc, out.strip()[:200]))

        # 3. khoá của phần khác không chặn
        ep = make_episode(root, "tap-3")
        hold(ep, "props", os.getpid())
        rc, out = run_review(ep, "--outline")
        check("khoá phần khác không chặn", BLOCKED not in out and PAST_LOCK in out,
              "rc=%d out=%s" % (rc, out.strip()[:200]))

        # 4. sau khi vòng chạy xong, khoá của chính nó không còn sót lại
        ep = make_episode(root, "tap-4")
        rc, out = run_review(ep, "--outline")
        leftover = [p for p in os.listdir(ep) if p.startswith(".review-") and p.endswith(".lock")]
        check("khoá được dọn khi vòng kết thúc", not leftover, str(leftover))
    finally:
        shutil.rmtree(root, ignore_errors=True)

    if failures:
        print("\n%d ca hỏng" % len(failures))
        return 1
    print("\n4 ca đều đúng")
    return 0


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        sys.exit(selftest())
    print(__doc__)
    sys.exit(0)
