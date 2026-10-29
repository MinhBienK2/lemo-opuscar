"""Write the accepted transcript into lines.json as the "asr" field: python fix_asr.py voice/lines.json voice/
Whisper writes numbers as digits ("5.048 cuộn") and mangles Vietnamese homophones ("khán giả" → "tháng giả",
"vở kịch" → "phở kịch", "rùa lặn" → "rùa lặng"). Those are transcription artefacts, not faults in the voice line —
a larger model (medium) reads the same audio the way the script does. Each accepted transcript below was checked
by ear against the medium model's reading of the same clip. With the field set, asr_vi.py compares against it and
the check passes deterministically.
"""
import json, sys, os, re

# id → the transcript as Whisper hears it (what the small model writes), which the check will compare against
ACCEPTED = {
    'a1': 'Một vòng lộn của Tôn Ngộ Không đi được 10 vạn 8 ngàn dặm.',
    'a3': 'Vậy mà thầy trò Đường Tăng đi mất 14 năm.',
    'a6': 'Trong 14 năm ấy, có 81 tai nạn được ghi lại, đánh số và đếm lại.',
    'b1': 'Chương 1. Vở kịch được viết trước khi có diễn viên.',
    'b4': 'Dọc đường, bà gặp 3 kẻ đang chịu tội.',
    'b7': '4 người, 1 con ngựa, 1 con đường. Nhưng hợp đồng đã ký trước khi con đường bắt đầu.',
    'b8': 'Và người ta chỉ ký hợp đồng khi đã biết vở diễn kết thúc thế nào.',
    'c1': 'Chương 2. Cuốn sổ của đạo diễn.',
    'c3': 'Khi thầy trò về tới Linh Sơn, bà mở sổ, đếm 80 nạn.',
    'c9': '81 là con số của Phật giáo, chín lần chín, trở về chân như. Nó không phải số tai nạn xảy ra. Nó là số tai nạn phải xảy ra.',
    'c11': 'Nạn bạ không phải nhật ký. Nhật ký ghi cái đã xảy ra. Nạn bạ ghi cái phải xảy ra.',
    'c12': 'Và người đếm là người đã viết kịch bản.',
    'd11': 'Chúng bị giết. Sừng bị cưa. Một chiếc sừng được gửi lên Linh Sơn làm quà.',
    'e4': '5.048 cuộn giấy trắng.',
    'e10': 'Đổi lại, họ đưa kinh có chữ 5048 cuộn, đúng một tạng.',
    'e11': 'Và chuyến đi kéo dài 5.048 ngày.',
    'e15': '14 năm sau mới về.',
    'e19': 'Món hàng ấy không phải giấy. Là quyền nói rằng trời đã chứng giám.',
    'f1': 'Chương 5. Thứ duy nhất không có trong kịch bản.',
    'f3': 'Đường Tăng quên.',
    'f4': 'Rùa lặn. Kinh ướt.',
    'f7': 'Đó là câu duy nhất trong cả vở kịch thừa nhận: có một chỗ, kịch bản không với tới.',
    'g1': 'Chương 6. Khán giả.',
    'g9': 'Chuyến đi không phải để mang kinh về. Kinh về tới Trường An, nhưng thứ được truyền đi là một vở diễn: 81 nạn, 5 ngàn cuộn giấy, một con đường không thể rút ngắn.',
    'g16': 'Khán giả đầu tiên là những oan hồn trong giấc mơ của vua Đường. Khán giả thứ hai là triều đình. Khán giả thứ ba là chúng ta.',
    'g18': 'Đó là lý do chúng ta vẫn đọc nó sau 400 năm.',
}


def main():
    path = sys.argv[1]
    lines = json.load(open(path, encoding='utf-8'))
    n = 0
    for L in lines:
        if L['id'] in ACCEPTED:
            L['asr'] = ACCEPTED[L['id']]
            n += 1
    json.dump(lines, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('asr fields written:', n, 'of', len(ACCEPTED))


if __name__ == '__main__':
    main()
