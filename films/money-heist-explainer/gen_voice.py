import os
import subprocess
import json
import soundfile as sf
import time

VOICE = "vi-VN-NamMinhNeural"
OUT_DIR = "films/money-heist-explainer/voices"
os.makedirs(OUT_DIR, exist_ok=True)

LINES = [
    {
        "id": "L01",
        "text": "Madrid, mười giờ sáng. Sáu mươi bảy con tin bị giam giữ bên trong Xưởng đúc tiền Hoàng gia Tây Ban Nha. Cảnh sát phong tỏa thủ đô. Nhưng họ không biết rằng, họ đang bước vào một cái bẫy hoàn hảo.",
        "display": "Madrid, 10:00 sáng. 67 con tin bị giam giữ bên trong Xưởng đúc tiền Hoàng gia Tây Ban Nha. Nhưng họ đang bước vào một cái bẫy hoàn hảo."
    },
    {
        "id": "L02",
        "text": "Chào các bạn, tôi là Ren. Nếu bạn nghĩ đây là một vụ cướp ngân hàng kinh điển, bạn đã bị Giáo sư lừa. Bởi vì điều kỳ lạ nhất: Băng cướp không hề chạm vào một xu nào trong két sắt.",
        "display": "Chào các bạn, tôi là Ren. Nếu nghĩ đây là vụ cướp ngân hàng kinh điển, bạn đã bị Giáo sư lừa: Họ không chạm vào một xu trong két sắt."
    },
    {
        "id": "L03",
        "text": "Hãy nhìn vào hiện trường bên trong. Thay vì vơ vét rồi tẩu thoát, Giáo sư ra lệnh cho đồng bọn cố thủ suốt mười một ngày. Mục tiêu thực sự: Bật toàn bộ các máy in tiền công nghiệp chạy hết công suất.",
        "display": "Hiện trường bên trong: Thay vì tẩu thoát, Giáo sư ra lệnh cố thủ 11 ngày để máy in công nghiệp chạy hết công suất."
    },
    {
        "id": "L04",
        "text": "Mỗi một giờ trôi qua kéo dài với cảnh sát, xưởng in cho ra lò tám triệu Euro tiền mặt mới tinh, hợp pháp, và không có số seri lưu trữ. Kế hoạch là in đúng hai phẩy bốn tỷ Euro.",
        "display": "Mỗi giờ trôi qua: Xưởng in ra 8.000.000 € tiền mặt mới tinh, không số seri. Mục tiêu: Đúng 2,4 tỷ Euro."
    },
    {
        "id": "L05",
        "text": "Để mua thời gian, Giáo sư bắt tất cả con tin mặc áo liền quần màu đỏ và đeo mặt nạ Salvador Dalí giống hệt cướp. Khi đặc nhiệm nhìn qua ống ngắm, họ hoàn toàn bị mù, không thể nổ súng.",
        "display": "Chiêu bài con tin: 67 con tin mặc đồ đỏ và đeo mặt nạ Dalí giống hệt cướp. Lực lượng bắn tỉa hoàn toàn bị vô hiệu hóa."
    },
    {
        "id": "L06",
        "text": "Và đây là đòn kết liễu: Trong khi cảnh sát chuẩn bị tấn công cửa chính, thì ngay dưới sàn kho tiền, băng cướp đã âm thầm đào xong một đường hầm dài một trăm tám mươi mét nối về nhà kho ngoại ô.",
        "display": "Cú đòn kết liễu: Đường hầm bí mật dài 180 mét khoét từ sàn kho tiền nối thẳng về nhà kho ngoại ô."
    },
    {
        "id": "L07",
        "text": "Hai phẩy bốn tỷ Euro được vận chuyển êm thấm. Giáo sư không cướp của ai cả. Họ tự in ra tiền, biến cuộc đào tẩu thành màn ảo thuật vĩ đại nhất lịch sử truyền thông.",
        "display": "2,4 tỷ Euro biến mất không dấu vết. Giáo sư biến vụ án thành màn ảo thuật vĩ đại nhất lịch sử truyền thông."
    }
]

def generate_line(item):
    lid = item["id"]
    txt = item["text"]
    mp3_path = os.path.join(OUT_DIR, f"{lid}.mp3")
    wav_path = os.path.join(OUT_DIR, f"{lid}.wav")

    if os.path.exists(wav_path) and os.path.getsize(wav_path) > 1000:
        print(f"  [{lid}] already exists, skipping.")
        return True

    for attempt in range(5):
        print(f"  [{lid}] Attempt {attempt+1}/5...")
        cmd = [
            ".venv/bin/edge-tts",
            "--voice", VOICE,
            "--rate=+3%",
            "--text", txt,
            "--write-media", mp3_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0 and os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 1000:
            subprocess.run(["ffmpeg", "-y", "-i", mp3_path, "-ar", "48000", "-ac", "1", wav_path], capture_output=True)
            if os.path.exists(mp3_path):
                os.remove(mp3_path)
            return True
        time.sleep(2.0 + attempt * 1.5)
    return False

def generate_all():
    durations = {}
    cues = []
    current_time = 1.0

    for item in LINES:
        ok = generate_line(item)
        if not ok:
            print(f"FAILED to generate {item['id']}")

    for item in LINES:
        lid = item["id"]
        wav_path = os.path.join(OUT_DIR, f"{lid}.wav")
        if os.path.exists(wav_path):
            info = sf.info(wav_path)
            dur = info.duration
            durations[lid] = round(dur, 2)
            cues.append({
                "id": lid,
                "t0": round(current_time, 2),
                "t1": round(current_time + dur, 2),
                "dur": round(dur, 2),
                "text": item["display"]
            })
            current_time += dur + 1.2

    total_dur = round(current_time + 1.5, 2)

    with open(os.path.join(OUT_DIR, "dur.json"), "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2, ensure_ascii=False)

    with open("films/money-heist-explainer/cues.json", "w", encoding="utf-8") as f:
        json.dump({"total_dur": total_dur, "cues": cues}, f, indent=2, ensure_ascii=False)

    print(f"\nALL LINES READY! Total timeline duration: {total_dur}s")
    for c in cues:
        print(f"  [{c['t0']:5.1f}s - {c['t1']:5.1f}s] ({c['dur']:4.1f}s) {c['id']}: {c['text'][:55]}...")

if __name__ == "__main__":
    generate_all()
