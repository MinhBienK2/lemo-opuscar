#!/usr/bin/env python3
"""Xem các phiên đang chạy: việc cuối cùng, và có lặp lệnh không.

  python3 tools/session_watch.py <transcript.jsonl> [<transcript.jsonl> ...]

Đọc qua `tools/transcript.py` (một lần đọc cho cả Claude lẫn omp). In: mốc thời gian, lệnh
gần nhất, và các lệnh bị lặp lại trong cửa sổ thời gian gần đây — dấu hiệu của một phiên đang
quay vòng.
"""
import collections
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import transcript  # noqa: E402


def main(paths, window=80):
    for path in paths:
        events = list(transcript.events(path))
        name = os.path.basename(path)[:8]
        if not events:
            print(f"{name}: chưa có sự kiện nào")
            continue
        at, tool, args = events[-1]
        print(f"\n=== {name}  ({len(events)} sự kiện)  cuối cùng {at}  {tool} "
              f"{str(args.get('command') or args.get('path') or '')[:90]}")
        recent = events[-window:]
        counts = collections.Counter(
            (tool, str(args.get('command') or args.get('path') or '')) for _, tool, args in recent)
        for (t, cmd), n in counts.most_common(4):
            if n > 1 and cmd:
                print(f"   lặp {n}×  {t}: {cmd[:110]}")
        # a tool that keeps failing on the same file
        bad = collections.Counter()
        for _, tool, args in recent:
            if tool == 'bash':
                c = str(args.get('command') or '')
                if 'grep' in c or 'cat ' in c or 'ls ' in c:
                    bad[c] += 1
        for c, n in bad.most_common(3):
            if n >= 3:
                print(f"   dò tìm {n}×  {c[:110]}")


if __name__ == '__main__':
    main(sys.argv[1:])
