#!/usr/bin/env python3
"""review.sh's critic() must tell a JUDGEMENT apart from a LIST.

Two kinds of reviewer answer pass through the same function. A judge answers with a verdict line
("VERDICT: PASS") — a round without one is a reviewer that never answered, and the round must die
(exit 2) rather than be filed as a judgement about the film. The blind namers of the props round
answer with a LIST of names; they were never asked for a verdict, so demanding one there killed a
round that had done its job (the peer that reported it had burned two nine-minute rounds on it).

This test runs the real critic() of review.sh — extracted from the file, not copied — against a stub
reviewer, and checks that each shape of answer is read the way it should be.

    python3 channels/tram-nghi-nhieu/tools/test_review_critic.py --selftest
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REVIEW = HERE / "review.sh"

# The CLI's own noise: a warning about connectors and a warning about the model name. They are printed
# before the answer, every time, and they are not an answer.
WARNINGS = (
    "⚠ claude.ai connectors are disabled because ANTHROPIC_API_KEY or another auth source is set\n"
    "[claude-code:unrecognized_model] {\"model\":\"2tocom/MiniMax-M3.1-Flash[1m]\"}\n"
)

STUB = r"""#!/bin/sh
# The stub reviewer: it prints what STUB_MODE says, and writes STUB_WRITE if it is told to.
case "${STUB_MODE:-warn}" in
  warn)    printf '%s' "$WARNINGS" ;;
  list)    printf '%s' "$WARNINGS"; printf '#1 TÊN: củ sạc 60W | CHẮC: cao | THẤY: vỏ trắng\n' ;;
  verdict) printf '%s' "$WARNINGS"; printf 'VERDICT: PASS\n' ;;
  silent)  : ;;
esac
if [ -n "${STUB_WRITE:-}" ]; then printf 'answer\n' > "$STUB_WRITE"; fi
exit 0
"""


def critic_function():
    """The critic() of review.sh, taken from the file."""
    src = REVIEW.read_text(encoding="utf-8")
    start = src.index("critic() {")
    end = src.index("\n}\n", start) + 3
    return src[start:end]


def run_critic(tmp, fn, prompt, second_arg=None, mode="list", write=None):
    """Run the real critic() with a stub reviewer; return its exit code."""
    stub = Path(tmp) / "stub-cli"
    stub.write_text(STUB, encoding="utf-8")
    stub.chmod(0o755)
    work = Path(tmp) / "work"
    work.mkdir(exist_ok=True)
    harness = Path(tmp) / "harness.sh"
    harness.write_text(
        "#!/bin/sh\n"
        "CLI=" + str(stub) + "\n"
        "LEMO_CRITIC_MODEL=\n"
        "CRITIC_TIMEOUT=30\n"
        "W=" + str(work) + "\n"
        + fn
        + "\ncritic \"$1\" " + (second_arg if second_arg else "") + "\n",
        encoding="utf-8",
    )
    env = dict(os.environ, STUB_MODE=mode, WARNINGS=WARNINGS)
    if write:
        env["STUB_WRITE"] = write
    proc = subprocess.run(
        ["sh", str(harness), prompt],
        cwd=str(work), env=env, capture_output=True, text=True, timeout=120,
    )
    return proc.returncode, proc.stderr


def cases():
    fn = critic_function()
    tmp = tempfile.mkdtemp(prefix="lemo-critic-")
    try:
        # a judge that answers with a verdict: the round runs
        rc, err = run_critic(tmp, fn, "chấm phim", mode="verdict")
        assert rc == 0, f"a verdict answer must pass, got {rc}: {err}"

        # a judge that answers with something else: the round dies, loudly
        rc, err = run_critic(tmp, fn, "chấm phim", mode="list")
        assert rc == 2, f"an answer without a verdict must exit 2, got {rc}: {err}"
        assert "không có dòng VERDICT nào" in err, f"the reason must be said: {err}"

        # a reviewer that says nothing at all: the round dies too
        rc, err = run_critic(tmp, fn, "chấm phim", mode="silent")
        assert rc == 2, f"a silent reviewer must exit 2, got {rc}: {err}"

        # the blind namer: a list, no verdict — the round runs (the regression)
        rc, err = run_critic(tmp, fn, "gọi tên mù", "no-verdict", mode="list")
        assert rc == 0, f"a list answer must pass in a no-verdict phase, got {rc}: {err}"

        # the blind namer that only produced the CLI's warnings: still no answer
        rc, err = run_critic(tmp, fn, "gọi tên mù", "no-verdict", mode="warn")
        assert rc == 2, f"the CLI's warnings are not an answer, got {rc}: {err}"

        # the blind namer that wrote the file and said nothing: the file IS the answer
        rc, err = run_critic(tmp, fn, "gọi tên mù", "no-verdict", mode="silent", write="BLIND.md")
        assert rc == 0, f"the file the reviewer wrote is the answer, got {rc}: {err}"
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    if "--selftest" in sys.argv:
        try:
            cases()
        except AssertionError as exc:
            print(f"FAIL {exc}")
            return 1
        print("ok  the critic tells a judgement from a list")
        return 0
    print(__doc__)
    return 0


if __name__ == "__main__":
    sys.exit(main())
