#!/usr/bin/env python3
"""test_review_room.py — một vòng chấm không được mở trên một máy đã quá tải.

Máy 15 GiB này dựng năm tập cùng lúc, và một vòng chấm mở ra trên máy đã hết swap thì bị **kernel
giết** — không phải chết vì hết giờ, mà chết không thèm báo: không có bản chấm, không có dòng log,
một giờ việc biến mất. Vòng chấm `--storyboard` của tập 03 chết kiểu đó lúc 16:27.

Nên vòng chấm hỏi máy **trước khi** nó tốn gì: `review.sh` gọi `hook_load.over_capacity()` — cùng một
luật, cùng một con số với cái chặn ở dòng lệnh — và nếu máy không còn chỗ thì vòng **không mở**, nói rõ
lý do, và để người làm chạy lại sau.

Bài này chạy `review.sh` thật với trạng thái máy **giả** (`LEMO_ROOM_STATE`), nên kết quả không phụ
thuộc vào việc máy đang bận hay không — và vòng chấm thật, người chấm thật, không tốn một giây nào.

    python3 channels/tram-nghi-nhieu/tools/test_review_room.py --selftest
"""
import os
import shutil
import subprocess
import sys
import tempfile

LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
REVIEW_SH = os.path.join(LIB, "channels", "tram-nghi-nhieu", "tools", "review.sh")

OVER = "máy đang quá tải"        # review.sh nói câu này khi máy không còn chỗ
ROOM = "vòng này mở được"          # và câu này khi máy còn chỗ
PAST = "needs TREATMENT.md"        # dấu hiệu cho biết vòng đã đi qua kiểm tra máy và đi tiếp


def run_review(episode, *flags, state=None, room_check=None, timeout=120):
    """chạy review.sh trên một tập giả; trả về (mã thoát, toàn bộ lời in ra)"""
    env = dict(os.environ)
    env.pop("LEMO_ROOM_CHECK", None)
    if state is not None:
        env["LEMO_ROOM_STATE"] = state
    if room_check is not None:
        env["LEMO_ROOM_CHECK"] = room_check
    proc = subprocess.run(
        ["sh", REVIEW_SH, episode] + list(flags),
        capture_output=True, text=True, timeout=timeout, cwd=LIB, env=env,
    )
    return proc.returncode, proc.stdout + proc.stderr


def make_episode(root, name):
    ep = os.path.join(root, name)
    os.makedirs(os.path.join(ep, "review"), exist_ok=True)
    return ep


def selftest():
    if not os.path.isfile(REVIEW_SH):
        print("FAIL review.sh không có ở %s" % REVIEW_SH)
        return 1
    failures = []

    def check(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    root = tempfile.mkdtemp(prefix="lemo-room-")
    try:
        # 1. máy quá tải: vòng không mở, và nói đúng lý do
        ep = make_episode(root, "tap-1")
        rc, out = run_review(ep, "--outline", state="OVER|load 25 trên 12 nhân, swap 92%|412|92")
        check("máy quá tải thì vòng không mở", OVER in out, "rc=%d out=%s" % (rc, out.strip()[:200]))
        check("vòng bị từ chối thì không đi tiếp", PAST not in out, out.strip()[:200])

        # 2. máy còn chỗ: vòng mở
        ep = make_episode(root, "tap-2")
        rc, out = run_review(ep, "--outline", state="OK|-|7093|76")
        check("máy còn chỗ thì vòng mở", ROOM in out and PAST in out,
              "rc=%d out=%s" % (rc, out.strip()[:200]))

        # 3. kiểm tra máy tắt: đó là cách chạy thử, và một bài kiểm thử không được phụ thuộc tải máy
        ep = make_episode(root, "tap-3")
        rc, out = run_review(ep, "--outline", state="OVER|load 25 trên 12 nhân|412|92", room_check="off")
        check("tắt kiểm tra máy thì vòng mở", PAST in out and OVER not in out,
              "rc=%d out=%s" % (rc, out.strip()[:200]))

        # 4. vòng bị từ chối không để lại khoá chết: vòng sau phải mở được
        ep = make_episode(root, "tap-4")
        run_review(ep, "--outline", state="OVER|load 25 trên 12 nhân|412|92")
        rc, out = run_review(ep, "--outline", state="OK|-|7093|76")
        check("vòng bị từ chối không giữ khoá", PAST in out, out.strip()[:200])
    finally:
        shutil.rmtree(root, ignore_errors=True)

    for f in failures:
        print("FAIL %s" % f)
    print("%d ca đều đúng" % (4 - len(failures)) if not failures else "%d ca sai" % len(failures))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(selftest())
