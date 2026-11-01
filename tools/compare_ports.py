#!/usr/bin/env python3
"""So sánh cùng một tập phim được dựng bằng nhiều engine.

    python3 tools/compare_ports.py --label "Remotion" ~/Documents/remotion-explainer/out/tap-03-nghich-ly-lua-chon.mp4 \
                                   --label "HyperFrames" ~/Documents/hyperframes-explainer/out/tap-03-nghich-ly-lua-chon.mp4 \
                                   --sheet out/compare

Báo cáo cho mỗi bản: thời lượng, độ phân giải, fps, codec, âm lượng tích hợp (LUFS), số khung
đen, các đoạn đứng yên (dead frame), và số phụ đề/cảnh. Có thể xuất contact sheet PNG để so
mắt. Không sửa gì trong repo; chỉ đọc video và ghi ra file khi được yêu cầu.
"""
import argparse
import json
import os
import re
import subprocess
import sys


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    r = run(
        [
            "ffprobe", "-v", "error", "-show_streams", "-show_format",
            "-of", "json", path,
        ]
    )
    if r.returncode != 0:
        raise SystemExit(f"ffprobe failed for {path}: {r.stderr.strip()}")
    return json.loads(r.stdout)


def summarise(path):
    info = probe(path)
    v = next((s for s in info["streams"] if s.get("codec_type") == "video"), None)
    a = next((s for s in info["streams"] if s.get("codec_type") == "audio"), None)
    dur = float(info["format"].get("duration", 0))
    fps = 0.0
    if v and v.get("avg_frame_rate", "0/0") != "0/0":
        num, den = v["avg_frame_rate"].split("/")
        fps = float(num) / float(den) if float(den) else 0.0

    # loudness
    lufs = None
    r = run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
         "ebur128=framelog=verbose", "-f", "null", "-"]
    )
    m = re.findall(r"I:\s*(-?[\d.]+)\s*LUFS", r.stderr)
    if m:
        lufs = float(m[-1])

    # black frames + frozen stretches
    r = run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", path,
         "-vf", "blackdetect=d=0.4:pix_th=0.10,freezedetect=n=-60dB:d=1.0", "-f", "null", "-"]
    )
    blacks = re.findall(r"black_start:([\d.]+)", r.stderr)
    blacks_end = re.findall(r"black_end:([\d.]+)", r.stderr)
    black_total = sum(float(b) - float(a) for a, b in zip(blacks, blacks_end))
    freezes = re.findall(r"freeze_start:\s*([\d.]+)", r.stderr)
    freeze_durs = [float(x) for x in re.findall(r"freeze_duration:\s*([\d.]+)", r.stderr)]

    return {
        "path": os.path.abspath(path),
        "size_mb": round(os.path.getsize(path) / 1e6, 2),
        "duration_s": round(dur, 2),
        "resolution": f"{v['width']}x{v['height']}" if v else "-",
        "fps": round(fps, 2),
        "video_codec": v.get("codec_name") if v else None,
        "audio_codec": a.get("codec_name") if a else None,
        "audio_channels": a.get("channels") if a else None,
        "lufs": lufs,
        "black_seconds": round(black_total, 2),
        "freeze_spans": len(freezes),
        "longest_freeze_s": round(max(freeze_durs), 2) if freeze_durs else 0.0,
    }


def contact_sheet(path, out_png, frames=12, cols=4, width=640):
    # ffmpeg tile: lấy frames đều theo thời lượng
    dur = probe(path)["format"].get("duration")
    try:
        dur = float(dur)
    except (TypeError, ValueError):
        dur = 0.0
    step = dur / frames if dur else 1.0
    tmp = out_png + ".tmp.mp4"
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path,
         "-vf", f"fps=1/{step:.4f},scale={width}:-1,tile={cols}x{frames // cols}",
         "-frames:v", "1", out_png])
    if os.path.exists(tmp):
        os.remove(tmp)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--label", action="append", default=[], help="nhãn của bản (lặp lại theo thứ tự)")
    ap.add_argument("videos", nargs="+")
    ap.add_argument("--sheet", help="ghi contact sheet vào thư mục này")
    ap.add_argument("--json", help="ghi bản tóm tắt JSON vào đây")
    args = ap.parse_args()

    rows = []
    for i, v in enumerate(args.videos):
        label = args.label[i] if i < len(args.label) else os.path.basename(os.path.dirname(v))
        s = summarise(v)
        s["label"] = label
        rows.append(s)

    cols = ["label", "duration_s", "resolution", "fps", "video_codec", "audio_codec",
            "lufs", "black_seconds", "freeze_spans", "longest_freeze_s", "size_mb"]
    widths = {c: max(len(c), max(len(str(r[c])) for r in rows)) for c in cols}
    print(" | ".join(c.ljust(widths[c]) for c in cols))
    print("-+-".join("-" * widths[c] for c in cols))
    for r in rows:
        print(" | ".join(str(r[c]).ljust(widths[c]) for c in cols))

    if args.sheet:
        os.makedirs(args.sheet, exist_ok=True)
        for r in rows:
            safe = re.sub(r"[^A-Za-z0-9_-]+", "-", r["label"])
            sheet = os.path.join(args.sheet, f"sheet-{safe}.png")
            contact_sheet(r["path"], sheet)
            r["sheet"] = sheet
            print(f"sheet: {sheet}")

    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        print(f"json: {args.json}")


if __name__ == "__main__":
    sys.exit(main())
