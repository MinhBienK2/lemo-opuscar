#!/usr/bin/env python3
"""
Orchestration Pipeline for Series Production in Lemo-Opuscar.
Coordinates MiniMax M3.1 Flash (Producer) and Gemini 3.8 Flash (Reviewer) in a continuous,
self-optimizing production loop across 30 series episodes.

Usage:
  python3 tools/orchestrate_series.py --episodes 1           # Run the benchmark episode
  python3 tools/orchestrate_series.py --series nghich-ly     # Run specific series
  python3 tools/orchestrate_series.py --all                  # Run all scheduled episodes
"""

import os
import re
import sys
import json
import time
import argparse
import subprocess
from pathlib import Path

LIB = Path(__file__).resolve().parent.parent
PYTHON_BIN = str(LIB / ".venv" / "bin" / "python") if (LIB / ".venv" / "bin" / "python").exists() else sys.executable
CHANNEL = "tram-nghi-nhieu"
CHANNEL_DIR = LIB / "channels" / CHANNEL
os.environ["LEMO_REMOTE_FFMPEG"] = "muse"
SUPERVISION_DIR = LIB / "improvements" / "supervision"
SUPERVISION_DIR.mkdir(parents=True, exist_ok=True)
FEEDBACK_FILE = SUPERVISION_DIR / "series_feedback.json"
REPORT_FILE = SUPERVISION_DIR / "SERIES_REPORT.md"

PRODUCER_MODEL = "2tocom/MiniMax-M3.1-Flash"
REVIEWER_MODEL = "gemini-3.8-flash"

# ——— Catalog of 30 Episodes across 4 Series Pillars ———
CATALOG = [
    # Pillar 1: Nghịch lý đời thường (Everyday Paradoxes)
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-03-suy-nghi-3-gio-sang",
        "title": "Trạm Nghĩ Nhiều — tập 03: Tại sao bộ não luôn tự dựng kịch bản thảm họa lúc 3 giờ sáng?",
        "type": "short",
        "runtime_target": "1:00",
        "premise": "Khi cơ thể mệt mỏi vào ban đêm, vỏ não trước trán (Prefrontal Cortex) giảm hoạt động kiểm soát lý tính, trong khi hạch hạnh nhân (Amygdala) vẫn phát tín hiệu báo động, khiến não khuếch đại những nỗi sợ vi mô thành kịch bản thảm họa sinh tồn."
    },
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-02-cang-co-cang-met",
        "title": "Trạm Nghĩ Nhiều — tập 02: Nghịch lý kiểm soát: Tại sao càng cố nắm giữ, ta càng kiệt quệ?",
        "type": "medium",
        "runtime_target": "2:30",
        "premise": "Nỗ lực kiểm soát mọi biến số ngẫu nhiên của cuộc sống dẫn đến kiệt quệ nhận thức (Cognitive Depletion) và hội chứng quá tải lo âu."
    },
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-04-muon-quen-lai-nho",
        "title": "Trạm Nghĩ Nhiều — tập 04: Hiệu ứng gấu trắng: Càng cố quên, não càng khắc sâu",
        "type": "short",
        "runtime_target": "1:30",
        "premise": "Hiệu ứng phản phục (Ironic Process Theory): Quá trình theo dõi vô thức liên tục kiểm tra xem ta đã quên chưa, vô tình nhắc lại ký ức cần xóa."
    },
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-05-nghich-ly-lua-chon",
        "title": "Trạm Nghĩ Nhiều — tập 05: Nghịch lý lựa chọn: Càng nhiều cơ hội, càng kém hạnh phúc",
        "type": "medium",
        "runtime_target": "2:15",
        "premise": "Paradox of Choice của Barry Schwartz: Quá nhiều lựa chọn dẫn đến tê liệt quyết định và nỗi hối hận chi phí cơ hội."
    },
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-06-hieu-ung-chim-moi",
        "title": "Trạm Nghĩ Nhiều — tập 06: Bẫy chim mồi: Cách các menu thao túng ví tiền của bạn",
        "type": "short",
        "runtime_target": "1:45",
        "premise": "Decoy Effect trong kinh tế học hành vi: Lựa chọn thứ ba bất đối xứng ép não bộ chọn phương án đắt tiền nhất."
    },
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-07-hoi-chung-ke-mao-danh",
        "title": "Trạm Nghĩ Nhiều — tập 07: Kẻ mạo danh trong gương: Nỗi sợ bị vạch trần",
        "type": "medium",
        "runtime_target": "2:45",
        "premise": "Impostor Phenomenon: Người có năng lực cao thường đánh giá thấp thành tựu của mình và sợ bị xem là kẻ ăn may."
    },
    {
        "series": "series/nghich-ly-doi-thuong",
        "episode": "tap-08-ap-luc-phai-tich-cuc",
        "title": "Trạm Nghĩ Nhiều — tập 08: Sự tích cực độc hại: Khi nụ cười gượng ép làm tổn thương bạn",
        "type": "short",
        "runtime_target": "1:30",
        "premise": "Toxic Positivity: Kìm nén cảm xúc tiêu cực làm tăng huyết áp và phản ứng stress của hệ thần kinh giao cảm."
    },

    # Pillar 2: Vết bầm thần kinh (Neuroscience Deep Dives - Includes 10-minute long-form)
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-02-dopamine-detox",
        "title": "Trạm Nghĩ Nhiều — tập 02: Giải mã Dopamine: Bản chất sinh học và hiểu lầm về 'Cai nghiện Dopamine'",
        "type": "long",
        "runtime_target": "10:00",
        "premise": "Dopamine không phải hormone sung sướng mà là chất dẫn truyền động lực dự đoán phần thưởng (Reward Prediction Error). 'Dopamine detox' trên mạng là ngụy khoa học, giải pháp thực sự là điều hòa ngưỡng cảm thụ."
    },
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-03-amygdala-hijack",
        "title": "Trạm Nghĩ Nhiều — tập 03: Cơn giận 6 giây: Khi hạch hạnh nhân cướp quyền não bộ",
        "type": "medium",
        "runtime_target": "3:30",
        "premise": "Amygdala Hijack: Tín hiệu cảm xúc đi tắt vào hạch hạnh nhân nhanh hơn 30ms trước khi vỏ não kịp phân tích lý lẽ."
    },
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-04-tri-nho-sai-lech",
        "title": "Trạm Nghĩ Nhiều — tập 04: Ký ức giả: Não bộ tự viết lại quá khứ của bạn như thế nào?",
        "type": "medium",
        "runtime_target": "4:00",
        "premise": "Memory Reconsolidation: Mỗi lần nhớ lại một kỷ niệm, não giải nén và nén lại cùng với cảm xúc hiện tại, tạo ra các chi tiết bịa đặt."
    },
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-05-cortisol-bao-mon",
        "title": "Trạm Nghĩ Nhiều — tập 05: Cortisol và stress mãn tính: Não bộ bị teo nhỏ ra sao?",
        "type": "long",
        "runtime_target": "8:00",
        "premise": "Cortisol liều cao kéo dài làm thoái hóa tế bào hồi hải mã (Hippocampus), suy giảm trí nhớ ngắn hạn và gia tăng tính kích động."
    },
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-06-than-kinh-guong",
        "title": "Trạm Nghĩ Nhiều — tập 06: Tế bào thần kinh gương: Tại sao ta đau khi thấy người khác vấp ngã?",
        "type": "short",
        "runtime_target": "2:00",
        "premise": "Mirror Neurons phản chiếu hành động và cảm giác của đối phương, tạo nên nền tảng sinh học của sự đồng cảm và học hỏi xã hội."
    },
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-07-song-nao-giac-ngu",
        "title": "Trạm Nghĩ Nhiều — tập 07: Hệ thống Glymphatic: Bộ não tự rửa trôi độc tố trong giấc ngủ sâu",
        "type": "medium",
        "runtime_target": "5:00",
        "premise": "Dịch não tủy (CSF) co giãn và dọn dẹp các mảng bám Beta-Amyloid trong pha ngủ sâu (Slow-wave sleep)."
    },
    {
        "series": "series/vet-bam-than-kinh",
        "episode": "tap-08-nhua-than-kinh",
        "title": "Trạm Nghĩ Nhiều — tập 08: Tính mềm dẻo não bộ: Bạn có thực sự thay đổi được sau tuổi 25?",
        "type": "long",
        "runtime_target": "8:30",
        "premise": "Neuroplasticity và Myelination: Cơ chế hình thành đường dẫn thần kinh mới thông qua nỗ lực tập trung và giấc ngủ củng cố."
    },

    # Pillar 3: Tâm lý hành vi (Behavioral Psychology)
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-02-hieu-ung-khan-gia",
        "title": "Trạm Nghĩ Nhiều — tập 02: Hiệu ứng ánh đèn sân khấu: Không ai nhìn vết bẩn trên áo bạn",
        "type": "short",
        "runtime_target": "1:45",
        "premise": "Spotlight Effect: Con người thường đánh giá quá cao mức độ người khác chú ý đến ngoại hình hay sai lầm nhỏ của mình."
    },
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-03-thoi-quen-nguyen-tu",
        "title": "Trạm Nghĩ Nhiều — tập 03: Vòng lặp thói quen: Gợi ý, Khát khao, Hành động, Phần thưởng",
        "type": "medium",
        "runtime_target": "3:30",
        "premise": "Habit Loop: Cách hạch nền (Basal Ganglia) tự động hóa các chuỗi hành vi và mẹo thiết kế môi trường để bẻ gãy thói quen xấu."
    },
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-04-hieu-ung-dunning-kruger",
        "title": "Trạm Nghĩ Nhiều — tập 04: Đỉnh cao của sự thiếu hiểu biết: Hiệu ứng Dunning-Kruger",
        "type": "short",
        "runtime_target": "2:00",
        "premise": "Người có kiến thức sơ sài về một lĩnh vực thường quá tự tin vì chưa đủ nhận thức để thấy sự phức tạp của vấn đề."
    },
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-05-tam-ly-bay-dan",
        "title": "Trạm Nghĩ Nhiều — tập 05: Tư duy tập thể: Khi cả phòng họp cùng gật đầu sai lầm",
        "type": "medium",
        "runtime_target": "3:00",
        "premise": "Groupthink: Áp lực hòa nhập xã hội và mong muốn đồng thuận khiến cá nhân kìm nén phản biện hợp lý."
    },
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-06-thien-kien-xac-nhan",
        "title": "Trạm Nghĩ Nhiều — tập 06: Thiên kiến xác nhận: Não chỉ nghe điều nó muốn tin",
        "type": "short",
        "runtime_target": "2:00",
        "premise": "Confirmation Bias: Bộ lọc nhận thức tự động ghi nhớ bằng chứng ủng hộ quan điểm cá nhân và gạt bỏ bằng chứng trái chiều."
    },
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-07-tri-hoan-tra-thu",
        "title": "Trạm Nghĩ Nhiều — tập 07: Thức khuya trả thù: Tại sao ta không chịu đi ngủ dù rất mệt?",
        "type": "short",
        "runtime_target": "1:50",
        "premise": "Revenge Bedtime Procrastination: Trì hoãn giấc ngủ là hành vi vô thức nhằm đòi lại quyền kiểm soát thời gian sau một ngày bị bó buộc."
    },
    {
        "series": "series/tam-ly-hanh-vi",
        "episode": "tap-08-noi-so-bi-bo-roi",
        "title": "Trạm Nghĩ Nhiều — tập 08: FOMO: Nỗi sợ bị bỏ lỡ và thuật toán gây nghiện",
        "type": "medium",
        "runtime_target": "2:30",
        "premise": "Fear of Missing Out: Nỗi sợ tách rời khỏi bầy đàn thời nguyên thủy bị các mạng xã hội khai thác thông qua thông báo đỏ."
    },

    # Pillar 4: Không gian & Tâm trạng (Spatial & Environmental Psychology)
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-01-anh-sang-va-tram-cam",
        "title": "Trạm Nghĩ Nhiều — tập 01: Ánh sáng và tâm trạng: Nhịp sinh học sụp đổ như thế nào?",
        "type": "medium",
        "runtime_target": "3:00",
        "premise": "Tế bào hạch võng mạc cảm quang nội tại (ipRGCs) dẫn truyền ánh sáng xanh ức chế Melatonin, phá hủy chu kỳ ngủ và tâm trạng."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-02-can-phong-lon-xon",
        "title": "Trạm Nghĩ Nhiều — tập 02: Bàn làm việc bừa bộn và hormone căng thẳng",
        "type": "short",
        "runtime_target": "1:50",
        "premise": "Visual Clutter quá tải trường thị giác, buộc vỏ não liên tục phân bổ tài nguyên ức chế các vật thể nhiễu, làm tăng mức Cortisol nền."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-03-am-thanh-trang",
        "title": "Trạm Nghĩ Nhiều — tập 03: Tiếng ồn trắng và màu sắc của âm thanh trong sự tập trung",
        "type": "short",
        "runtime_target": "2:10",
        "premise": "White, Pink và Brown noise che lấp các biến động âm thanh đột ngột (Auditory masking), bảo vệ sự tập trung của thùy đỉnh."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-04-khong-gian-xanh",
        "title": "Trạm Nghĩ Nhiều — tập 04: Biophilia: Nhìn vào cây xanh hạ nhịp tim trong 3 phút",
        "type": "short",
        "runtime_target": "1:40",
        "premise": "Attention Restoration Theory: Các kích thích mềm mại của thiên nhiên (Soft fascination) giúp hồi phục sự chú ý có chủ đích."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-05-goc-lam-viec-ly-tuong",
        "title": "Trạm Nghĩ Nhiều — tập 05: Công thái học thị giác: Thiết kế góc làm việc không mỏi não",
        "type": "medium",
        "runtime_target": "3:20",
        "premise": "Quy tắc khoảng cách mắt, góc nghiêng 20 độ và ánh sáng tương phản giúp giảm áp lực nhận thức lên hệ thần kinh thị giác."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-06-hieu-ung-trang-nhat",
        "title": "Trạm Nghĩ Nhiều — tập 06: Hiệu ứng khởi đầu mới: Tâm lý học của ngày thứ Hai và mùng Một",
        "type": "short",
        "runtime_target": "2:00",
        "premise": "Fresh Start Effect của Katy Milkman: Các mốc ranh giới thời gian tạo ra sự tách biệt tâm lý với những sai lầm trong quá khứ."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-07-ap-luc-thoi-gian",
        "title": "Trạm Nghĩ Nhiều — tập 07: Định luật Parkinson: Công việc luôn nở ra để vừa khít thời hạn",
        "type": "medium",
        "runtime_target": "2:40",
        "premise": "Parkinson's Law: Khi có nhiều thời gian, não bộ phức tạp hóa nhiệm vụ một cách vô thức để lấp đầy khoảng trống."
    },
    {
        "series": "series/khong-gian-tam-trang",
        "episode": "tap-08-tieng-on-thi-thanh",
        "title": "Trạm Nghĩ Nhiều — tập 08: Tiếng còi xe và sự suy giảm nhận thức đô thị",
        "type": "medium",
        "runtime_target": "3:00",
        "premise": "Ô nhiễm tiếng ồn đô thị mức >65dB kích hoạt trục HPA (Hypothalamic-Pituitary-Adrenal), suy giảm khả năng tập trung sâu."
    }
]


def load_feedback():
    if FEEDBACK_FILE.exists():
        try:
            return json.loads(FEEDBACK_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []


def save_feedback(data):
    FEEDBACK_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def run_cmd(cmd, cwd=None, check=True):
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if check and res.returncode != 0:
        print(f"[CMD ERROR] {cmd}\nSTDOUT: {res.stdout}\nSTDERR: {res.stderr}", file=sys.stderr)
        raise RuntimeError(f"Command failed: {cmd}")
    return res


def call_omp(model, prompt):
    """Invokes OMP non-interactively with the requested model using --no-tools and --thinking=low for fast completion."""
    print(f"  [OMP] Invoking {model}...")
    t0 = time.time()
    res = subprocess.run(
        ["omp", "-p", "--no-tools", "--thinking=low", f"--model={model}", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    dt = time.time() - t0
    print(f"  [OMP] Done in {dt:.1f}s (exit {res.returncode})")
    if res.returncode != 0:
        print(f"  [OMP ERROR] {res.stderr[:200]}", file=sys.stderr)
    return res.stdout.strip()

def scaffold_episode(item):
    ep_dir = CHANNEL_DIR / item["series"] / item["episode"]
    if ep_dir.exists():
        print(f"  [Scaffold] Episode directory already exists: {ep_dir.relative_to(LIB)}")
        return ep_dir

    rel_series_ep = f"{item['series']}/{item['episode']}"
    cmd = f"sh core/render/new_episode.sh {CHANNEL} {rel_series_ep} \"{item['title']}\""
    print(f"  [Scaffold] Running: {cmd}")
    run_cmd(cmd, cwd=LIB)
    return ep_dir


def parse_json_response(raw_text):
    s = raw_text.strip()
    if s.startswith("```json"):
        s = s[7:]
    elif s.startswith("```"):
        s = s[3:]
    if s.endswith("```"):
        s = s[:-3]
    s = s.strip()
    try:
        return json.loads(s)
    except Exception:
        start = s.find("{")
        end = s.rfind("}")
        if start != -1 and end != -1:
            return json.loads(s[start:end+1])
        raise ValueError(f"Could not parse JSON from response: {raw_text[:300]}")


def produce_episode(item, ep_dir, past_feedback):
    """
    Two-stage production by MiniMax M3.1 Flash:
    Stage 1: Research FACTS.md, 2-Column STORYBOARD.md, voice/lines.json
    Stage 2: Voice synthesis and word timing
    Stage 3: Kinetic animation code src/timeline.js & src/film.js using rig/motion.js
    """
    print(f"\n🎬 === PRODUCING: {item['title']} ===")
    
    # Extract accumulated review insights
    feedback_notes = ""
    if past_feedback:
        recent = past_feedback[-3:]
        directives = []
        for f in recent:
            directives.extend(f.get("directives_for_next", []))
        if directives:
            feedback_notes = "\n### REVIEWER DIRECTIVES FROM PREVIOUS EPISODES (MUST FOLLOW):\n" + "\n".join(f"- {d}" for d in set(directives))

    # --- Stage 1: Storyboard & Script ---
    print("  [Stage 1] Designing 2-column Audio-Visual Storyboard & Script with MiniMax...")
    prompt_s1 = f"""You are the World-Class 2D Motion Director for the channel "Trạm Nghĩ Nhiều".
Topic: {item['title']}
Premise: {item['premise']}
Target Runtime: {item['runtime_target']} ({item['type']})
{feedback_notes}

### REQUIREMENTS:
1. NO STATIC CARDS / BORING TEMPLATES: Every scene must have a vivid physical visual metaphor.
2. TWO-COLUMN STORYBOARD: Each line must specify:
   - `subject_action`: physical action of the host or subject.
   - `metaphor_prop`: physical prop (e.g., giant ticking bomb clock, amygdala pulsing beacon, smoke puff thoughts).
   - `camera_move`: zoom, pan, tilt, track.
   - `transition_out`: seamless transition to next scene.
3. LINES: 10 to 16 lines in Vietnamese with phonetic numbers.

Output ONLY valid JSON. Do not call any tools. Do not output any markdown before or after the JSON.
JSON Format:
{{
  "facts_md": "... scientific citations with DOI ...",
  "storyboard_md": "... markdown table of 2-column storyboard ...",
  "lines_json": [
    {{"id": "hook", "text": "...", "say": "...", "rate": "+0%", "pitch": "+0Hz"}},
    ...
  ]
}}
"""
    res_s1 = call_omp(PRODUCER_MODEL, prompt_s1)
    data_s1 = parse_json_response(res_s1)

    (ep_dir / "research" / "FACTS.md").write_text(data_s1["facts_md"], encoding="utf-8")
    (ep_dir / "STORYBOARD.md").write_text(data_s1["storyboard_md"], encoding="utf-8")
    (ep_dir / "voice" / "lines.json").write_text(json.dumps(data_s1["lines_json"], ensure_ascii=False, indent=2), encoding="utf-8")
    print("  [Stage 1] Storyboard & lines written.")

    # --- Synthesize Audio & Word Times ---
    synthesize_voice_and_timeline(ep_dir)
    dur_data = json.loads((ep_dir / "voice" / "proc" / "dur.json").read_text(encoding="utf-8"))
    lines_data = json.loads((ep_dir / "voice" / "lines.json").read_text(encoding="utf-8"))

    # --- Stage 2: Generate timeline.js (Deterministic) and Code film.js (MiniMax) ---
    print("  [Stage 2] Generating src/timeline.js and coding Kinetic src/film.js...")
    timeline_code = generate_timeline_js(lines_data)
    (ep_dir / "src" / "timeline.js").write_text(timeline_code, encoding="utf-8")

    line_ids = [l["id"] for l in lines_data]
    prompt_s2 = f"""You are the Lead Canvas 2D Animator for "Trạm Nghĩ Nhiều".
Write the full JavaScript implementation of src/film.js for:
Title: {item['title']}
Line IDs: {line_ids}
Durations: {json.dumps(dur_data)}
Storyboard:
{(ep_dir / "STORYBOARD.md").read_text(encoding="utf-8")[:2500]}
### API SIGNATURES:
// spring(t, duration=0.6, bounces=2.5, decay=5.0) -> number (bouncy 0 to 1)
// squash(t, peakTime=0.15, dur=0.45, amount=0.28) -> {{ sx, sy }}
// wiggle(t, freq=6, amp=1, seed=0) -> number
// particlePuff(g, x, y, progress, {{ color, count, radius }})
// particleSparks(g, x, y, progress, {{ color, count }})
// speedBurst(g, cx, cy, progress, {{ color, count }})
// kineticCamera(g, t, {{ zoom=1, ox=0, oy=0, drift=true, target=[960,540] }})
// irisTransition(g, cx, cy, progress, fill='#12131A')
// occlusionWipe(g, progress, dir='leftToRight', fill='#12131A')
// figure(g, {{ s=1.0, E: expr('worried'|'happy'|'tired'|'shocked'|'smile'), talk, lean=0, shrug=0 }})
// cel(g, pathOrPolyOrRect, {{ f, s, so:[dx,dy], l, lw }})
// rect(x0, y0, x1, y1)  (IMPORTANT: x0 < x1 and y0 < y1)
// ellP(cx, cy, rx, ry), line(g, pts, stroke, lw)
// ground(g, col='#12131A'), text(g, str, x, y, {{ font: font(800, 44), fill='#FAF8F5', stroke, sw, align='center'|'left'|'right' }})
// ease.out(p), ease.inOut(p), ease.back(p), seg(t, a, b), clamp01(t)

### WORKING SKELETON TO FOLLOW:
const cv = document.getElementById('c'), G = cv.getContext('2d');
let TL, READY = false;

async function init() {{
  const [dur, words, lips] = await Promise.all([
    fetch('voice/proc/dur.json').then(r => r.json()).catch(() => ({{}})),
    fetch('voice/words.json').then(r => r.json()).catch(() => ({{}})),
    fetch('voice/lips.json').then(r => r.json()).catch(() => ({{}}))
  ]);
  TL = build(dur, words, lips);
  window.DUR = TL.end;
  window.READY = true;
  READY = true;
}}
init();

window.render = function(t) {{
  if (!READY || !TL) {{ ground(G, '#12131A'); return; }}
  G.save();
  G.setTransform(1, 0, 0, 1, 0, 0);
  G.clearRect(0, 0, W, H);
  ground(G, '#12131A');
  const L = TL.L, talk = TL.talk(t);

  // Implement each shot from the storyboard using L['line_id'].t0:
  // Example:
  // if (t < L['next_line'].t0) {{
  //   const lt = t - L['cur_line'].t0;
  //   kineticCamera(G, t, {{ zoom: 1.0 + lt * 0.02, drift: true }});
  //   ... draw metaphor props and character ...
  // }}

  // Subtitles:
  if (TL.cues) {{
    for (const c of TL.cues) {{
      if (t >= c.t0 && t < c.t1) {{
        text(G, c.text, 960, 960, {{ font: font(800, 44), fill: '#FAF8F5', stroke: '#12131A', sw: 8, align: 'center', noreg: true }});
        break;
      }}
    }}
  }}
  G.restore();
}};
window.TEXTS = (t) => [];
window.EV = [];

DO NOT CALL ANY TOOLS. DO NOT OUTPUT XML OR <invoke> TAGS.
Output ONLY the pure JavaScript code of src/film.js wrapped in a single ```javascript ... ``` codeblock.
"""
    res_s2 = call_omp(PRODUCER_MODEL, prompt_s2)
    
    # Clean code from response
    film_code = res_s2.strip()
    if "```javascript" in film_code:
        film_code = film_code.split("```javascript")[1].split("```")[0].strip()
    elif "```js" in film_code:
        film_code = film_code.split("```js")[1].split("```")[0].strip()
    elif "```" in film_code:
        film_code = film_code.split("```")[1].split("```")[0].strip()

    film_code = clean_film_js(film_code)
    (ep_dir / "src" / "film.js").write_text(film_code, encoding="utf-8")
    print("  [Stage 2] src/timeline.js and src/film.js successfully written.")


def clean_film_js(film_code):
    import re
    # 1. Auto-replace raw fillText calls
    film_code = re.sub(r'(\w+)\.fillText\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)', r'text(\1, \2, \3, \4)', film_code)
    # 2. Fix duplicate variable declarations across script
    for var in ['grad', 'p', 'lt', 'sp', 'sq', 'sc', 'rot', 'alpha', 'breath', 'cx', 'cy', 'w', 'h', 'r']:
        pattern = rf'\b(?:const|let)\s+{var}\s*='
        matches = list(re.finditer(pattern, film_code))
        if len(matches) > 1:
            idx = 0
            def repl(m, v=var):
                nonlocal idx; idx += 1
                return f'let {v} =' if idx == 1 else f'{v} ='
            film_code = re.sub(pattern, repl, film_code)
    # 3. Reconcile imports
    return reconcile_imports(film_code)


def reconcile_imports(film_code):
    import re
    code_no_imports = re.sub(r"^import\s+.*?;\s*\n", "", film_code, flags=re.MULTILINE).strip()
    defined_symbols = set(re.findall(r"^(?:export\s+)?(?:function|class|const|let|var)\s+([\w$]+)", code_no_imports, re.MULTILINE))
    cel_symbols = ["cel", "path", "poly", "ellP", "line", "W", "H", "TAU", "rect", "rrect"]
    needed_cel = [s for s in cel_symbols if s not in defined_symbols]

    motion_symbols = ["spring", "squash", "wiggle", "kineticTrigger", "particlePuff", "particleSparks", "speedBurst", "kineticCamera", "irisTransition", "occlusionWipe"]
    needed_motion = [s for s in motion_symbols if s not in defined_symbols]

    char_symbols = ["figure", "expr", "blendE", "PAL", "roi"]
    needed_char = [s for s in char_symbols if s not in defined_symbols]

    broll_symbols = ["ground", "text", "font", "reg", "REG", "INK", "CREAM", "ease", "seg", "clamp01"]
    needed_broll = [s for s in broll_symbols if s not in defined_symbols]

    imports = []
    if needed_motion: imports.append("import { " + ", ".join(needed_motion) + " } from '../../../../rig/motion.js';")
    if needed_char: imports.append("import { " + ", ".join(needed_char) + " } from '../../../../rig/character.js';")
    if needed_cel: imports.append("import { " + ", ".join(needed_cel) + " } from '../../../../rig/cel.js';")
    if needed_broll: imports.append("import { " + ", ".join(needed_broll) + " } from '../../../../rig/broll.js';")
    if "build" not in defined_symbols: imports.append("import { build } from './timeline.js';")

    return "\n".join(imports) + "\n\n" + code_no_imports
def generate_timeline_js(lines):
    seq_entries = []
    subs_dict = {}
    for i, L in enumerate(lines):
        lid = L["id"]
        gap = 0.45 if i == 0 else 0.75
        seq_entries.append(f"  ['{lid}', {gap}]")
        words = L["text"].split()
        if len(words) > 7:
            half = len(words) // 2
            part1 = " ".join(words[:half]).replace("'", "\\'")
            part2 = " ".join(words[half:]).replace("'", "\\'")
            w_key = words[half].replace("'", "\\'")
            subs_dict[lid] = f"['{part1}', ['{w_key}', '{part2}']]"
        else:
            clean_txt = L["text"].replace("'", "\\'")
            subs_dict[lid] = f"['{clean_txt}']"

    seq_str = ",\n".join(seq_entries)
    subs_str = ",\n".join(f"  '{lid}': {val}" for lid, val in subs_dict.items())

    return f"""// Timeline generated for Trạm Nghĩ Nhiều
export const SEQ = [
{seq_str},
];
export const TAIL = 3.6;

export const SUBS = {{
{subs_str},
}};

const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\w]/g, '');

function wordIndex(ws, want, from = 0) {{
  const t = norm(want);
  if (!t) return -1;
  for (let i = from; i < ws.length; i++) if (norm(ws[i].w) === t) return i;
  for (let i = from; i < ws.length; i++) {{ const n = norm(ws[i].w); if (n && (n.startsWith(t) || t.startsWith(n))) return i; }}
  return -1;
}}

export function build(dur, words, lips) {{
  const L = {{}}; let t = 0;
  for (const [id, gap] of SEQ) {{ t += gap; L[id] = {{ id, t0: t, t1: t + (dur[id] || 2.5) }}; t += (dur[id] || 2.5); }}
  const end = t + TAIL;

  const w = (id, k) => {{
    const ws = words[id] || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const x = ws[i] || {{ t0: 0 }};
    return L[id].t0 + Math.max(0, Math.min(dur[id] || 2.5, x.t0));
  }};

  const cues = [], ids = SEQ.map(s => s[0]);
  ids.forEach((id, n) => {{
    const ws = words[id] || [];
    const parts = SUBS[id].map(p => typeof p === 'string' ? {{ text: p, key: null }} : {{ text: p[1], key: p[1].split(' ')[0] }});
    const total = parts.reduce((a, p) => a + p.text.length, 0);
    let acc = 0, prev = 0;
    parts.forEach((p, i) => {{
      const share = acc / total; acc += p.text.length;
      let t0 = L[id].t0;
      if (i > 0) {{
        const wi = wordIndex(ws, p.key, prev);
        t0 = wi >= 0 ? L[id].t0 + ws[wi].t0 : L[id].t0 + (dur[id] || 2.5) * share;
        prev = Math.max(prev, wi);
      }}
      const nextT = i + 1 < parts.length ? L[id].t0 + (dur[id] || 2.5) * (acc / total) : (n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end);
      const t1 = Math.min(nextT, Math.max(L[id].t1 + .6, t0 + 1.8));
      cues.push({{ id, text: p.text, t0: +t0.toFixed(3), t1: +t1.toFixed(3) }});
    }});
  }});

  const talk = t => {{
    for (const id of ids) {{
      const l = L[id];
      if (t >= l.t0 && t < l.t1) {{
        const lp = lips[id] || {{ o: [0.3], b: [0.5] }};
        const i = Math.min(lp.o.length - 1, Math.floor((t - l.t0) * 12) * 2);
        return {{ o: lp.o[i], b: lp.b[i] }};
      }}
    }}
    return {{ o: 0, b: .5 }};
  }};

  return {{ L, end, w, cues, talk }};
}}
"""


def synthesize_voice_and_timeline(ep_dir):
    """
    Generates TTS, word timings, and lip sync data.
    If online edge-tts or Whisper model is constrained, generates robust proportional word sync.
    """
    print("  [Audio/Sync] Generating voice assets and timeline sync...")
    voice_dir = ep_dir / "voice"
    lines_file = voice_dir / "lines.json"
    lines = json.loads(lines_file.read_text(encoding="utf-8"))

    dur_data = {}
    words_data = {}
    lips_data = {}

    # Run edge-tts with venv python
    tts_py = CHANNEL_DIR / "voice" / "tts_vi.py"
    try:
        run_cmd(f"{PYTHON_BIN} {tts_py} {lines_file} {voice_dir}", cwd=ep_dir)
        dur_json = voice_dir / "dur.json"
        if dur_json.exists():
            dur_data = json.loads(dur_json.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"  [TTS Fallback] edge-tts skipped ({e}), generating proportional duration model.")
        for L in lines:
            num_words = max(1, len(L["text"].split()))
            dur_data[L["id"]] = round(max(1.4, num_words * 0.38 + 0.4), 2)
        (voice_dir / "dur.json").write_text(json.dumps(dur_data, indent=1), encoding="utf-8")
    # Generate words.json with word timestamps
    for L in lines:
        lid = L["id"]
        total_dur = dur_data.get(lid, 2.0)
        word_list = L["text"].split()
        n = len(word_list)
        w_dur = (total_dur - 0.2) / max(1, n)
        cur_t = 0.1
        w_entries = []
        for w in word_list:
            w_entries.append({"w": w, "t0": round(cur_t, 3), "t1": round(cur_t + w_dur * 0.9, 3)})
            cur_t += w_dur
        words_data[lid] = w_entries

        # lips sync
        frames = int(total_dur * 24)
        lips_data[lid] = {
            "o": [round(0.4 + 0.4 * (i % 3 == 0), 2) for i in range(frames)],
            "b": [0.5 for _ in range(frames)]
        }

    (voice_dir / "words.json").write_text(json.dumps(words_data, ensure_ascii=False, indent=0), encoding="utf-8")
    (voice_dir / "lips.json").write_text(json.dumps(lips_data), encoding="utf-8")
    proc_dir = voice_dir / "proc"
    proc_dir.mkdir(exist_ok=True)
    (proc_dir / "dur.json").write_text(json.dumps(dur_data, indent=0), encoding="utf-8")
    print(f"  [Audio/Sync] Successfully synchronized {len(lines)} voice lines.")


def check_and_review(item, ep_dir):
    """
    Runs mechanical gate checks, then calls Gemini 3.8 Flash to evaluate
    script quality, visual metaphor depth, and animation fluidity.
    """
    print(f"\n🔍 === REVIEWING: {item['title']} ===")

    # 1. Syntax check with self-healing
    print("  [Gate] Checking JS syntax with auto-repair...")
    for _ in range(5):
        chk = subprocess.run(["node", "--check", "src/film.js", "src/timeline.js"], cwd=ep_dir, capture_output=True, text=True)
        if chk.returncode == 0:
            break
        m = re.search(r"Identifier '(\w+)' has already been declared", chk.stderr)
        if m:
            v = m.group(1)
            fpath = ep_dir / "src" / "film.js"
            fsrc = fpath.read_text(encoding="utf-8")
            idx = 0
            def r(match):
                nonlocal idx; idx += 1
                return f"let {v} =" if idx == 1 else f"{v} ="
            fpath.write_text(re.sub(rf"\b(?:const|let)\s+{v}\s*=", r, fsrc), encoding="utf-8")
            continue
        print(f"  [Syntax Notice] {chk.stderr.strip()[:200]}")
        break

    # 2. filmcheck and drawcheck with self-healing
    print("  [Gate] Running filmcheck and drawcheck...")
    fc = subprocess.run(["node", str(LIB / "core" / "render" / "filmcheck.mjs"), str(ep_dir)], capture_output=True, text=True)
    dc = subprocess.run(["node", str(LIB / "core" / "render" / "drawcheck.mjs"), str(ep_dir)], capture_output=True, text=True)
    if "raw fillText()" in dc.stderr or "raw fillText()" in dc.stdout:
        fpath = ep_dir / "src" / "film.js"
        fsrc = fpath.read_text(encoding="utf-8")
        fsrc = re.sub(r'(\w+)\.fillText\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)', r'text(\1, \2, \3, \4)', fsrc)
        fpath.write_text(fsrc, encoding="utf-8")
        dc = subprocess.run(["node", str(LIB / "core" / "render" / "drawcheck.mjs"), str(ep_dir)], capture_output=True, text=True)
    gate_output = f"filmcheck:\n{fc.stdout}\n{fc.stderr}\n\ndrawcheck:\n{dc.stdout}\n{dc.stderr}"
    print(f"  [Gate Output] filmcheck: {'PASS' if fc.returncode == 0 else 'FAIL'}, drawcheck: {'PASS' if dc.returncode == 0 else 'FAIL'}")
    # 3. Gemini Reviewer Call
    storyboard = (ep_dir / "STORYBOARD.md").read_text(encoding="utf-8") if (ep_dir / "STORYBOARD.md").exists() else ""
    lines = (ep_dir / "voice" / "lines.json").read_text(encoding="utf-8") if (ep_dir / "voice" / "lines.json").exists() else ""
    film_code = (ep_dir / "src" / "film.js").read_text(encoding="utf-8") if (ep_dir / "src" / "film.js").exists() else ""

    prompt = f"""You are the Lead Critic & Film Quality Reviewer for animated explainer films.
Review this newly produced 2D animated episode objectively against the highest creative standards (Kurzgesagt, Ted-Ed, Vox).

Episode Title: {item['title']}
Target Runtime: {item['runtime_target']}
Premise: {item['premise']}

### MECHANICAL GATE CHECK RESULTS:
{gate_output}

### 2-COLUMN STORYBOARD:
{storyboard[:3000]}

### VOICE SCRIPT:
{lines[:1500]}

### ANIMATION CODE (SAMPLE):
{film_code[:3500]}

Please review strictly and return a JSON object with:
{{
  "episode": "{item['episode']}",
  "script_metaphor_score": <number 1-10>,
  "motion_dynamism_score": <number 1-10>,
  "code_architecture_score": <number 1-10>,
  "gate_passed": <true/false>,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "directives_for_next": [
    "<Actionable directive 1 for the next episode producer>",
    "<Actionable directive 2 for the next episode producer>"
  ],
  "verdict_summary": "<concise paragraph in Vietnamese>"
}}
Output ONLY valid JSON.
"""

    review_res = call_omp(REVIEWER_MODEL, prompt)
    clean = review_res
    if clean.startswith("```json"):
        clean = clean[7:]
    if clean.startswith("```"):
        clean = clean[3:]
    if clean.endswith("```"):
        clean = clean[:-3]
    clean = clean.strip()

    try:
        review_data = json.loads(clean)
    except Exception:
        start = clean.find("{")
        end = clean.rfind("}")
        review_data = json.loads(clean[start:end+1])

    print(f"  [Reviewer Scores] Metaphor: {review_data.get('script_metaphor_score')}/10 | Motion: {review_data.get('motion_dynamism_score')}/10 | Code: {review_data.get('code_architecture_score')}/10")
    print(f"  [Verdict] {review_data.get('verdict_summary')}")
    return review_data


def render_episode(item, ep_dir):
    """Renders the actual MP4 video file and offloads heavy x264 encode to VPS muse."""
    print(f"\n🎥 === RENDERING MP4 VIDEO (OFFLOADED TO VPS MUSE): {item['title']} ===")
    bsh = ep_dir / "build.sh"
    if bsh.exists():
        btxt = bsh.read_text(encoding="utf-8")
        if "LC_ALL=C awk" not in btxt:
            btxt = btxt.replace('awk -v d="$PS"', 'LC_ALL=C awk -v d="$PS"')
            bsh.write_text(btxt, encoding="utf-8")

    cmd = "REVIEW=0 sh build.sh"
    t0 = time.time()
    res = subprocess.run(cmd, shell=True, cwd=ep_dir, capture_output=True, text=True)
    dt = time.time() - t0
    if res.returncode != 0:
        print(f"  [Render Warning] {res.stderr[-300:]}", file=sys.stderr)
    else:
        mp4s = list(ep_dir.glob("*.mp4"))
        if mp4s:
            sz = mp4s[0].stat().st_size / (1024 * 1024)
            print(f"  [Render Complete] {mp4s[0].name} ({sz:.1f} MB) in {dt:.1f}s (Muxed on VPS muse)")


def update_report(all_reviews):
    content = ["# Series Production & Autonomous Optimization Report", "", f"Last Updated: {time.strftime('%Y-%m-%d %H:%M:%S')}", ""]
    content.append("| Episode | Series | Metaphor | Motion | Code | Gate | MP4 Video | Verdict |")
    content.append("|---|---|---|---|---|---|---|---|")
    
    for r in all_reviews:
        ep = r.get("episode", "")
        series = r.get("series", "")
        m_sc = r.get("script_metaphor_score", 0)
        mo_sc = r.get("motion_dynamism_score", 0)
        c_sc = r.get("code_architecture_score", 0)
        gate = "PASS" if r.get("gate_passed") else "WARN"
        ep_dir = CHANNEL_DIR / series / ep
        mp4s = list(ep_dir.glob("*.mp4")) if ep_dir.exists() else []
        video_status = f"✅ {mp4s[0].stat().st_size / (1024*1024):.1f} MB" if mp4s else "⏳ Pending"
        verdict = r.get("verdict_summary", "").replace("\n", " ")[:60] + "..."
        content.append(f"| `{ep}` | `{series}` | **{m_sc}/10** | **{mo_sc}/10** | **{c_sc}/10** | {gate} | {video_status} | {verdict} |")

    content.append("\n## Latest Self-Optimization Directives:")
    if all_reviews:
        latest = all_reviews[-1]
        for d in latest.get("directives_for_next", []):
            content.append(f"- 💡 {d}")

    REPORT_FILE.write_text("\n".join(content), encoding="utf-8")
    print(f"  [Report] Updated {REPORT_FILE.relative_to(LIB)}")


def main():
    parser = argparse.ArgumentParser(description="Orchestrate Series Production")
    parser.add_argument("--episodes", type=int, default=1, help="Number of episodes to produce and review")
    parser.add_argument("--series", type=str, default="", help="Filter by series keyword")
    parser.add_argument("--all", action="store_true", help="Run all 30 episodes")
    parser.add_argument("--force", action="store_true", help="Force rebuild even if already reviewed")
    args = parser.parse_args()

    items = CATALOG
    if args.series:
        items = [x for x in items if args.series in x["series"]]
    if not args.all:
        items = items[:args.episodes]

    print(f"🚀 Starting Series Orchestration Loop with {len(items)} episode(s)...")
    past_feedback = load_feedback()
    done_episodes = {f["episode"] for f in past_feedback if f.get("gate_passed")}

    for i, item in enumerate(items, 1):
        print(f"\n=======================================================")
        print(f"EPISODE {i}/{len(items)}: {item['title']}")
        print(f"=======================================================")

        ep_dir = scaffold_episode(item)
        has_mp4 = bool(list(ep_dir.glob("*.mp4")))
        has_code = (ep_dir / "src" / "film.js").exists()

        if item["episode"] in done_episodes and has_mp4 and not args.force:
            print(f"  [Resume] Episode {item['episode']} already produced, reviewed, and rendered. Skipping to next...")
            continue

        if not has_code or args.force:
            produce_episode(item, ep_dir, past_feedback)
            review = check_and_review(item, ep_dir)
            review["series"] = item["series"]
            past_feedback.append(review)
            save_feedback(past_feedback)

        if not has_mp4 or args.force:
            render_episode(item, ep_dir)

        update_report(past_feedback)
if __name__ == "__main__":
    main()
