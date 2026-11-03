#!/usr/bin/env python3
"""Sinh board.json cho tập 01 — "Tại sao ngủ 30 phút lại tệ hơn không ngủ?".

Board là dữ liệu (SKILL.md §3): mỗi cảnh có nơi chốn, người của câu chuyện, các khung hình
(shot) và các nhịp (beat) neo vào một từ của lời. Khung hình nói "cỡ cảnh, chế độ người dẫn,
camera, vì sao quay thế"; nhịp nói "ai làm gì, vật gì đổi, nhãn ghi lên, tiếng vang lên".

Cổng kiểm tra: tools/check_board.py — nhãn đúng 7 loại, mỗi cảnh mở bằng khung wide, người dẫn
(desk + scene) chiếm 15–45 % thời lượng, có ít nhất một khung pip hoặc react, có một khoảng
lặng, và một nhịp đánh dấu "aha".

Thứ tự nhịp của mỗi cảnh phải trùng với bảng nhịp trong src/film.js (CHOREO): bộ đạo cụ đổi
trạng thái đúng lúc nhịp vang lên. Số trong bảng dưới là thứ tự đó.
"""
import json, os

EP = os.path.dirname(os.path.abspath(__file__))

def lab(kind, text, xy=None, to=None, on=False, defn=None, stay=False, color=None):
    d = {'kind': kind, 'text': text}
    if xy is not None: d['xy'] = xy
    if to is not None: d['to'] = to
    if on: d['on'] = True
    if defn is not None: d['def'] = defn
    if stay: d['stay'] = True
    if color is not None: d['color'] = color
    return d

SCENES = [
 dict(id='vanphong',
   place='văn phòng buổi chiều thứ Sáu, sofa da ở góc phải, cửa sổ kính lọc nắng, đồng hồ treo tường',
   light='nắng chiều xiên qua cửa sổ, bóng dài trên sàn',
   cast=['host'], lines=['hook1', 'hook2', 'hook3'], amb='office', music='A', in_=('iris', 'iris_open'),
   shots=[
    ('vanphong_van_wide', None, 'wide', 'scene', 'hold', 'văn phòng chiều thứ Sáu, Kẻ gục trên sofa da',
     'mở bằng nơi chốn thật để thấy chỗ Kẻ ngủ gục và cái đồng hồ hẹn giờ'),
    ('vanphong_van_phone', 'hook1@hẹn', 'insert', 'none', 'push', 'điện thoại đếm ngược ba mươi phút trên bàn',
     'cái đồng hồ hẹn giờ là điều kiện của cả tập, nên phải thấy rõ con số'),
    ('vanphong_van_wake', 'hook2@dậy', 'medium', 'scene', 'push', 'Kẻ giật mình ngồi dậy, tóc rối, mí mắt nặng',
     'cảm giác nặng đầu chỉ hiện ra được trên khuôn mặt lúc vừa mở mắt'),
    ('vanphong_van_clock', 'hook2@nặng', 'insert', 'none', 'pan', 'đồng hồ treo tường, kim chạy qua vạch đầu tiên',
     'đồng hồ đứng yên giữa lúc não còn mơ hồ, để thấy nửa tiếng trôi qua'),
    ('vanphong_van_desk', 'hook3@Ngủ', 'medium', 'scene', 'pull', 'Kẻ nhún vai, tay hạ xuống bàn',
     'một cú nhún vai thay cho lời than: câu hỏi đang treo trong không khí'),
   ],
   beats=[
    ('hook1@start', 'host', 'Kẻ Nghĩ Nhiều gục xuống sofa da, một tay đặt lên bụng', 'ngực Kẻ phập phồng chậm', None, None, None),
    ('hook1@gục', 'host', 'Kẻ hít một hơi dài, vai trĩu xuống', 'vai Kẻ chùa xuống', None, None, None),
    ('hook1@hẹn', 'host', 'Kẻ cầm điện thoại lên, ngón tay bấm giờ hẹn', 'màn hình điện thoại sáng lên', None, ('button', 'ngón tay bấm nút hẹn giờ'), None),
    ('hook1@end', 'host', 'Kẻ úp điện thoại lên ngực, mắt khép lại', 'Kẻ ngả đầu sang đệm', None, None, None),
    ('hook2@dậy', 'host', 'Chuông báo thức reo, Kẻ giật mình ngồi dậy', 'tóc Kẻ rối, mí mắt nặng trĩu',
     lab('number', '30 phút', [1180, 420], [1330, 640], color='#F0525B'), ('phone_buzz', 'điện thoại rung trên ngực'), None),
    ('hook2@laptop', 'host', 'Kẻ mở laptop lên đùi, hai tay gõ thử vài phím', 'màn hình laptop sáng lên', None, ('plastic_click', 'bản lề laptop mở ra'), None),
    ('hook2@nặng', 'host', 'Kẻ xoa thái dương, mí mắt nặng trĩu', 'cọng tóc đèn trên đầu rũ xuống', None, None, None),
    ('hook2@Người', 'host', 'Kẻ dừng tay, ngẩng lên đọc dòng chữ trên màn hình', 'con trỏ dừng giữa dòng', None, None, None),
    ('hook2@giác', 'host', 'Kẻ chạm ngón tay vào dòng chữ đang đọc', 'thẻ thuật ngữ sleep inertia hiện ra',
     lab('term', 'sleep inertia', [80, 110], defn='cảm giác lười nhác, lơ mơ lúc vừa mới dậy', stay=True, color='#F2A541'),
     ('label_in', 'thẻ thuật ngữ trượt vào khung'), None),
    ('hook2@end', 'host', 'Kẻ nhìn xuống màn hình, con trỏ không đi đâu', 'Kẻ chớp mắt, mặt nặng nề', None, None, None),
    ('hook3@Ngủ', 'host', 'Kẻ nhước lên nhìn đồng hồ treo tường, tay chỉ theo kim giây', 'kim đồng hồ chạy qua vạch đầu tiên', None, None, None),
    ('hook3@end', 'host', 'Kẻ nhún vai, mặt đầy nghi hoặc', 'Kẻ hạ tay xuống bàn', None, None, None),
   ]),

 dict(id='nha_ke',
   place='góc đọc sách của Kẻ Nghĩ Nhiều ở nhà, kệ sách, đèn bàn vàng, sổ tay mở trên bàn',
   light='đèn bàn vàng ấm từ trên, cửa sổ đêm ngoài khung',
   cast=['host'], lines=['intro', 'hook4', 'roi1'], amb='room', music='A', in_=('cut', None),
   shots=[
    ('nha_ke_ke_wide', None, 'wide', 'desk', 'hold', 'Kẻ Nghĩ Nhiều bước vào khung, tay giơ chào',
     'người dẫn bước vào thế giới câu chuyện của chính mình, một lần, để gọi tên chủ đề'),
    ('nha_ke_ke_note', 'hook4@Mình', 'insert', 'none', 'push', 'sổ tay mở ra, câu hỏi vừa viết xuống',
     'viết câu hỏi ra là cách biến chủ đề thành việc của người xem'),
    ('nha_ke_ke_belief', 'roi1@start', 'medium', 'desk', 'hold', 'Kẻ tự nói ra cách hiểu phổ biến, tay chỉ vào dòng mình vừa viết',
     'cách hiểu quen thuộc phải do chính người dẫn nói ra, thì cảnh sau mới lật được'),
    ('nha_ke_ke_close', 'roi1@Ngủ#2', 'close', 'react', 'hold', 'cận mặt Kẻ lúc nghe Rối đoán sai',
     'một cú liếc mắt đủ nói: lời Rối không đúng'),
   ],
   beats=[
    ('intro@Mình', 'host', 'Kẻ bước tới giữa khung, tay giơ chào', 'Kẻ dừng giữa khung',
     lab('name', 'Kẻ Nghĩ Nhiều', [960, 250], [900, 430], color='#F2A541'), None, None),
    ('intro@Hôm', 'host', 'Kẻ chỉ thẳng vào ống kính, giọng chắc lại', 'sợi tóc đèn sáng lên', None, None, None),
    ('intro@sao', 'host', 'Kẻ giơ tay lên đếm ngón, mắt nheo lại', 'Kẻ đếm từng ngón trên tay', None, None, None),
    ('intro@end', 'host', 'Kẻ hạ tay, mắt nhìn thẳng vào người xem', 'Kẻ đứng yên, vai thẳng', None, None, None),
    ('hook4@Mình', 'host', 'Kẻ mở sổ tay, viết câu hỏi xuống giấy', 'nét chữ chạy trên trang sổ',
     lab('name', 'sổ tay', [1320, 760], [960, 660], color='#F2A541'), ('pen_scribble', 'bút viết câu hỏi vào sổ tay'), None),
    ('hook4@đúng', 'host', 'Kẻ gạch chân một dòng trong sổ rồi ngẩng lên', 'nét gạch chân đè lên dòng vừa viết', None, ('pen_cross', 'bút gạch chân một dòng trong sổ tay'), None),
    ('roi1@start', 'host', 'Kẻ nói ra cách hiểu phổ biến: ngủ trưa hai mươi phút là chuẩn', 'nét chữ trong sổ dừng lại', None, None, None),
    ('roi1@trưa', 'host', 'Kẻ gõ bút xuống sổ, lắc đầu như thể đã nói đúng', 'nét gạch chân mới chạy dọc dòng', None, ('pen_tick', 'bút gõ xuống sổ tay'), None),
    ('roi1@chuẩn', 'host', 'Kẻ chỉ ngón tay vào dòng "hai mươi phút là chuẩn" trong sổ', 'ngón tay dừng trên dòng chữ', None, None, None),
    ('roi1@Ngủ#2', 'host', 'Kẻ gật đầu, hai tay khoanh trước ngực, tin là đúng', 'Kẻ khoanh tay, vai thẳng', None, None, None),
    ('roi1@end', 'host', 'Kẻ gạch chân dòng mình vừa viết rồi nhún vai', 'nét gạch chân đè lên dòng đã viết', None, ('pen_cross', 'bút gạch chân dòng đã viết'), None),
   ]),

 dict(id='phongthi',
   place='phòng thí nghiệm giấc ngủ, ba giường có điện cực, màn hình đo bên phải, tủ thiết bị',
   light='đèn trắng phòng thí nghiệm, ánh xanh từ màn hình đo',
   cast=['extra:nguoi_lab', 'extra:nguoi_tham_gia'], lines=['lab1', 'lab2', 'lab3', 'lab4', 'lab5'],
   amb='lab', music='B', in_=('whip', 'whoosh_soft'),
   shots=[
    ('phongthi_lab_wide', None, 'wide', 'none', 'hold', 'phòng thí nghiệm: ba giường, màn hình đo, nhân viên đứng cạnh giường',
     'nơi chuyện xảy ra phải có người thật và thiết bị thật, không chỉ có đồ vật'),
    ('phongthi_lab_form', 'lab2@Họ', 'insert', 'none', 'push', 'tờ phiếu thí nghiệm trên tay, dòng số người và giờ ngủ',
     'phiếu là thứ định nghĩa thí nghiệm, người xem phải đọc được nó'),
    ('phongthi_lab_beds', 'lab3@Trước', 'medium', 'none', 'pan', 'ba chiếc giường thí nghiệm được khoanh lần lượt',
     'ba chiếc giường là ba nhóm; thấy cùng lúc thì người xem mới đếm được'),
    ('phongthi_lab_test', 'lab4@Rồi', 'medium', 'none', 'push', 'giường thí nghiệm và bảng điểm đếm lỗi',
     'đo bằng cái đếm, không bằng cảm giác: đèn bật là làm bài ngay'),
   ],
   beats=[
    ('lab1@Mình', 'none', 'phòng thí nghiệm: đường sóng chạy trên màn hình đo', 'màn hình đo sáng lên', None, None, None),
    ('lab1@nhóm', 'extra:nguoi_lab', 'nhân viên phòng thí nghiệm bước vào phòng, tay cầm tờ phiếu', 'nhân viên dừng cạnh màn hình đo', None, None, None),
    ('lab1@người', 'extra:nguoi_lab', 'nhân viên chỉ vào màn hình đo bên phải', 'đường sóng chạy trên màn hình', None, ('beep', 'máy đo báo một nhịp'), None),
    ('lab1@giác', 'extra:nguoi_lab', 'nhân viên kiểm tra điện cực trên đầu người tham gia', 'đèn đỏ trên tủ thiết bị nhấp nháy', None, ('metal_tap', 'nhân viên gõ vào tủ thiết bị'), None),
    ('lab2@Họ', 'extra:nguoi_lab', 'nhân viên đưa một tờ phiếu thí nghiệm cho người tham gia', 'tờ phiếu nằm trên tay người tham gia',
     lab('doc', 'phiếu thí nghiệm', [820, 560], [900, 640], color='#F2A541'), ('paper_flip', 'tờ phiếu được đưa qua'), None),
    ('lab2@người', 'extra:nguoi_tham_gia', 'người tham gia đọc phiếu, ngón tay dõ theo dòng chữ', 'ngón tay dừng ở dòng số người tham gia', None, None, None),
    ('lab2@tiếng', 'extra:nguoi_tham_gia', 'người tham gia dừng ngón tay ở ô giờ ngủ trên phiếu', 'ô giờ ngủ được khoanh tròn', None, ('pen_circle', 'bút khoanh ô giờ ngủ trên phiếu'), None),
    ('lab2@end', 'extra:nguoi_tham_gia', 'người tham gia gật đầu một cái, mắt vẫn dán vào phiếu', 'tờ phiếu nằm nghiêng trên bàn', None, None, None),
    ('lab3@Trước', 'extra:nguoi_lab', 'ba chiếc giường thí nghiệm hiện ra dọc hành lang', 'cả ba giường cùng sáng đèn',
     lab('number', '3 nhóm', [300, 470], [470, 700], color='#F0525B'), None, None),
    ('lab3@ngủ#1', 'extra:nguoi_lab', 'nhân viên đưa tay chỉ vào chiếc giường thứ nhất', 'chiếc giường thứ nhất được khoanh sáng',
     lab('number', '10 phút', [270, 500], [270, 690], color='#F2A541'), ('wood_knock', 'tay gõ lên khung giường thứ nhất'), None),
    ('lab3@ngủ#2', 'extra:nguoi_lab', 'nhân viên trượt tay sang chiếc giường thứ hai', 'chiếc giường thứ hai được khoanh sáng',
     lab('number', '20 phút', [620, 500], [620, 690], color='#67E8F9'), None, None),
    ('lab3@ngủ#3', 'extra:nguoi_lab', 'nhân viên dừng tay ở chiếc giường thứ ba', 'chiếc giường thứ ba được khoanh sáng',
     lab('number', '30 phút', [970, 500], [970, 690], color='#F0525B'), None, None),
    ('lab3@end', 'extra:nguoi_lab', 'nhân viên đứng giữa ba chiếc giường, mắt nhìn từng cái', 'ba chiếc giường giữ nguyên vị trí', None, None, None),
    ('lab4@Rồi', 'extra:nguoi_tham_gia', 'đèn phòng bật, người tham gia nằm xuống giường thí nghiệm', 'đèn trắng hắt lên màn hình đo', None, ('light_on', 'đèn phòng thí nghiệm bật lên'), None),
    ('lab5@Hiệu', 'extra:nguoi_lab', 'bảng điểm đếm số lần trả lời sai mỗi giây sáng lên', 'con số trên bảng điểm tăng dần',
     lab('doc', 'bảng điểm', [1620, 300], [1500, 380], color='#F2A541'), ('count_tick', 'bộ đếm nhảy thêm một lần sai'), None),
   ]),

 dict(id='banhanh',
   place='phòng họp có bảng ghim giấy A3, thước kẻ treo ngang, ghim đỏ, đèn bàn hắt một vòng sáng lên bảng',
   light='đèn bàn hắt một vòng sáng lên tờ giấy, nền tối',
   cast=['extra:nguoi_lab', 'host'], lines=['roi2', 'win1', 'win2', 'win3', 'win4', 'win5'],
   amb='hum', music='C', in_=('cut', None), silence=('win5@Nó-1', 1.2),
   shots=[
    ('banhanh_board_wide', None, 'wide', 'none', 'hold', 'tờ giấy A3 trên bảng ghim, một cột cao vẽ tay bên phải',
     'cảnh so sánh thuần: một tờ giấy, ba cột, và người xem phải tự so'),
    ('banhanh_board_r', 'win1@Nhóm', 'close', 'none', 'push', 'cột cao nhất Rối vẽ bên phải tờ giấy',
     'lời đoán sai của Rối phải hiện ra bằng mắt trước khi bị lật', {'focus': [1290, 460], 'amount': .40}),
    ('banhanh_board_three', 'win2@Nhóm', 'medium', 'none', 'hold', 'ba cột thật vẽ tay trên giấy',
     'ba cột là toàn bộ cái cần so, không thêm gì vào', {'focus': [1290, 460], 'amount': .34}),
    ('banhanh_board_clock', 'win2@lạ', 'insert', 'none', 'push', 'chiếc đồng hồ nhỏ chạy trên trục thời gian',
     'đồng hồ nhỏ là thứ biến ba cột thành một câu chuyện có mốc thời gian', {'focus': [1140, 560], 'amount': .42}),
    ('banhanh_board_cross', 'win3@Còn', 'medium', 'none', 'hold', 'cột ba mươi phút tụt xuống dưới vạch gốc',
     'đường cong lao xuống phải thấy ngay trên cả bảng, không cần con số'),
    ('banhanh_board_strike', 'win4@Nói', 'medium', 'none', 'pull', 'người vẽ đứng trước bảng, ba cột và đồng hồ nhỏ',
     'người vẽ phải bước lùi ra để ba cột nói thay'),
    ('banhanh_board_aha', 'win5@Nó', 'medium', 'none', 'hold', 'ngón tay đặt vào cột hai mươi phút đang rỗng',
     'khoảng trống phải được chạm vào thì người xem mới thấy nó'),
    ('banhanh_board_gap', 'win5@nằm', 'close', 'none', 'push', 'vòng tròn đỏ khoanh khoảng trống giữa hai cột',
     'khoảng trống phải được khoanh thành một vật thể, người xem mới nhớ mãi', {'focus': [1290, 500], 'amount': .46}),
   ],
   beats=[
    ('roi2@Chắc', 'host', 'người dẫn nói ra cách hiểu phổ biến: ngủ lâu nhất thì tỉnh nhất', 'khoảng giấy bên phải trống', None, None, None),
    ('roi2@lâu', 'host', 'trên tờ giấy, một cột cao vẽ tay mọc lên bên phải — cách hiểu của người dẫn', 'một cột tím cao mọc lên bên phải',
     None, ('pen_scribble', 'bút vẽ cột cao lên tờ giấy'), None),
    ('roi2@nhất', 'host', 'người dẫn vẽ cột đó cao hơn nữa, như đang tự thuyết phục mình', 'cột tím vươn lên đỉnh bảng', None, ('whoosh_soft', 'cột vừa vẽ bị đẩy lên cao hơn'), None),
    ('roi2@Ai', 'host', 'người dẫn nói tiếp: ai cũng vậy mà', 'cột tím vẫn đứng cao nhất bảng', None, None, None),
    ('roi2@chứ', 'host', 'người dẫn dừng lại, chờ xem có ai bác lại không', 'cột tím đứng lại ở mép bảng', None, None, None),
    ('win1@Nhóm', 'extra:nguoi_lab', 'nhân viên vẽ ba cột thật lên bảng, cạnh cột Rối vừa vẽ', 'ba cột mới hiện ra trên tờ giấy', None, ('pen_scribble', 'bút vẽ ba cột lên tờ giấy'), None),
    ('win1@tỉnh', 'extra:nguoi_lab', 'nhân viên gõ đầu ngón tay vào cột mười phút', 'cột mười phút được tô sáng', None, None, None),
    ('win1@cảm', 'extra:nguoi_lab', 'nhân viên vẽ mũi tên từ cột mười phút sang vạch đầu tiên', 'mũi tên chạm vạch đầu tiên', None, None, None),
    ('win1@hiệu', 'extra:nguoi_lab', 'nhân viên gõ nhẹ vào cột mười phút một cái, gật đầu', 'cột mười phút sáng đậm', None, ('pen_tick', 'ngón tay gõ lên cột mười phút'), None),
    ('win2@Nhóm', 'extra:nguoi_lab', 'nhân viên chuyển tay sang cột hai mươi phút đang rỗng', 'tay nhân viên dừng ở cột hai mươi phút', None, None, None),
    ('win2@lạ', 'extra:nguoi_lab', 'nhân viên vẽ một chiếc đồng hồ nhỏ cạnh trục thời gian', 'chiếc đồng hồ nhỏ hiện ra trên giấy', None, None, None),
    ('win2@trống', 'extra:nguoi_lab', 'kim đồng hồ nhỏ chạy qua vùng trống trên trục', 'vùng trống trên trục được tô', None, ('timer_tick', 'kim đồng hồ nhỏ chạy dọc trục'), None),
    ('win2@một', 'extra:nguoi_lab', 'kim đồng hồ nhỏ dừng ở mốc ba mươi lăm phút', 'mốc ba mươi lăm phút được khoanh trên trục', None, None, None),
    ('win2@end', 'extra:nguoi_lab', 'nhân viên gõ vào cột hai mươi phút một cái rồi rút tay về', 'cột hai mươi phút được tô nhạt', None, None, None),
    ('win3@Còn', 'extra:nguoi_lab', 'nhân viên gõ vào cột ba mươi phút, cột tụt xuống', 'cột ba mươi phút rơi xuống dưới vạch gốc', None, ('impact_soft', 'đường cong chạm đáy'), None),
    ('win3@tệ', 'extra:nguoi_lab', 'nhân viên vẽ đường cong lao xuống từ đỉnh cột ba mươi phút', 'đường cong lao xuống dưới vạch gốc', None, None, None),
    ('win4@Nói', 'extra:nguoi_lab', 'nhân viên gạch chân lên nhánh hai mươi phút dưới cột rỗng', 'nét gạch chân đè lên nhánh hai mươi phút', None, ('pen_cross', 'bút gạch chân lên nhánh hai mươi phút'), None),
    ('win4@phải', 'extra:nguoi_lab', 'nhân viên viết thêm lên bảng, tay trái đè góc tờ giấy', 'dòng chữ mới xuất hiện trên bảng', None, ('marker', 'bút viết dòng chữ lên bảng'), None),
    ('win4@không', 'extra:nguoi_lab', 'nhân viên bước lùi ra, ngắm cả ba cột', 'nhân viên đứng lùi, ba cột hiện rõ', None, None, None),
    ('win5@Lợi', 'extra:nguoi_lab', 'nhân viên đưa tay về chiếc đồng hồ nhỏ ở mốc ba mươi lăm phút', 'kim đồng hồ đứng yên ở mốc', None, None, None),
    ('win5@Nó', 'extra:nguoi_lab', 'nhân viên đặt ngón tay vào cột hai mươi phút đang rỗng', 'ngón tay chạm đúng khoảng trống', None, None, None),
    ('win5@nằm', 'extra:nguoi_lab', 'nhân viên vẽ vòng tròn quanh cột rỗng, tay vẫn chưa rời', 'vòng tròn khoanh khoảng trống giữa hai cột',
     lab('stamp', 'khoảng trống', [1400, 430], color='#F0525B'), ('pen_circle', 'bút vẽ vòng tròn quanh khoảng trống'), ['aha']),
    ('win5@mở', 'extra:nguoi_lab', 'nhân viên chỉ vào vạch đầu tiên trên trục thời gian', 'vạch đầu tiên được khoanh', None, None, None),
    ('win5@chưa', 'extra:nguoi_lab', 'nhân viên rút tay về, nhìn cột rỗng đã khoanh', 'khoảng trống vẫn trống giữa hai cột', None, None, None),
    ('win5@tê', 'extra:nguoi_lab', 'nhân viên gõ ngón tay xuống cột rỗng một cái', 'ngón tay gõ xuống khoảng trống', None, None, None),
    ('win5@end', 'extra:nguoi_lab', 'nhân viên đứng yên trước bảng, ba cột và khoảng trống', 'khoảng trống vẫn được khoanh tròn', None, None, None),
   ]),

 dict(id='giacsau',
   place='buồng đo đường sóng não, màn hình EEG lớn, bảng điện tử bên phải, giường có điện cực',
   light='xanh màn hình hắt lên mặt người nằm, đèn ngủ vàng ở đầu giường',
   cast=['extra:nguoi_lab', 'extra:nguoi_tham_gia'], lines=['mech1', 'mech2', 'mech3', 'mech4', 'mech5'],
   amb='lab', music='D', in_=('cut', None),
   shots=[
    ('giacsau_eeg_wide', None, 'wide', 'none', 'hold', 'buồng đo với màn hình EEG bên trái và bảng điện tử bên phải',
     'cơ chế phải thấy được bằng mắt: đường sóng lao xuống vùng sâu trước lúc chuông reo'),
    ('giacsau_eeg_trace', 'mech1@đủ', 'insert', 'none', 'push', 'đường sóng lao xuống đáy vùng giấc ngủ sâu rồi bò lên',
     'vùng sâu là nơi mọi thứ bị kẹt, nên phải nhìn thấy đường sóng đi vào và đi ra'),
    ('giacsau_eeg_bars', 'mech2@Nhóm', 'medium', 'none', 'hold', 'hai thanh đo phút ngủ sâu trên bảng điện tử',
     'hai con số đặt cạnh nhau tự nói sự chênh lệch, không cần lời giải thích'),
    ('giacsau_eeg_dots', 'mech3@người', 'medium', 'none', 'hold', 'mười chấm người, tám chấm được tô đậm',
     'tỉ lệ tám trên mười đọc thành hình, thành đám đông, không thành lời'),
    ('giacsau_eeg_shallow', 'mech4@lớn', 'insert', 'none', 'hold', 'vùng giấc ngủ nông mở ra bên trái bảng',
     'hai vùng đặt cạnh nhau để người xem tự so với nhau'),
    ('giacsau_eeg_stamp', 'mech5@nằm', 'close', 'none', 'hold', 'con dấu đỏ đập lên vùng giấc ngủ sâu',
     'kết luận phải có dấu ấn, người xem mới tin'),
   ],
   beats=[
    ('mech1@Vì', 'extra:nguoi_lab', 'đường sóng trên màn hình bắt đầu lao xuống', 'vùng giấc ngủ sâu hiện ra trên màn hình', None, None, None),
    ('mech1@đủ', 'extra:nguoi_lab', 'nhân viên chỉ vào đáy vùng sâu trên màn hình', 'vùng sâu được tô đậm trên màn hình',
     lab('term', 'giấc ngủ sâu', [80, 110], defn='giấc ngủ chậm, não hồi phục chậm nhất', stay=True, color='#8B5CF6'), None, None),
    ('mech1@sâu', 'extra:nguoi_lab', 'một vạch nhỏ chỉ vào đáy vùng sâu', 'vạch chỉ đáy vùng sâu hiện ra', None, ('pen_tick', 'bút vẽ vạch chỉ đáy vùng sâu'), None),
    ('mech1@chưa#2', 'extra:nguoi_lab', 'một vạch ngang đánh dấu đáy vùng sâu', 'vạch ngang nằm ngang đáy vùng sâu', None, None, None),
    ('mech1@end', 'extra:nguoi_lab', 'đường sóng đi lại phía trên, vùng sâu vẫn tô đậm', 'vùng sâu giữ nguyên màu', None, None, None),
    ('mech2@Nhóm', 'extra:nguoi_lab', 'hai thanh đo thời gian ngủ sâu mọc lên trên bảng điện tử', 'hai thanh đo dài ngắn đứng cạnh nhau', None, ('blip_up', 'bảng điện tử báo hai thanh đo'), None),
    ('mech2@phút', 'extra:nguoi_lab', 'con trỏ lướt từ thanh dài sang thanh ngắn', 'con trỏ dừng ở thanh ngắn', None, None, None),
    ('mech2@phút#2', 'extra:nguoi_lab', 'vạch đo của thanh ngắn gần như bằng không', 'vạch đo của thanh ngắn gần bằng không', None, None, None),
    ('mech2@end', 'extra:nguoi_lab', 'hai thanh đo đứng yên trên bảng', 'bảng điện tử giữ nguyên hai thanh', None, None, None),
    ('mech3@người', 'extra:nguoi_lab', 'mười chấm người hiện ra trên bảng, tám chấm được tô đậm', 'tám chấm trong số mười chấm sáng lên', None, ('blip_up', 'mười chấm người hiện ra trên bảng'), None),
    ('mech3@lâu', 'extra:nguoi_lab', 'một vạch nhỏ chỉ vào nhóm chấm được tô', 'vạch chỉ nhóm tám chấm hiện ra', None, None, None),
    ('mech3@đúng', 'extra:nguoi_lab', 'tám chấm được tô vẫn sáng trên bảng', 'bảng giữ nguyên mười chấm', None, None, None),
    ('mech4@Còn', 'extra:nguoi_lab', 'mười chấm thứ hai vẽ sang vùng ngủ nông', 'vùng ngủ nông mở ra bên trái bảng', None, None, None),
    ('mech4@lớn', 'extra:nguoi_lab', 'vùng ngủ nông được khoanh trên bảng', 'khung vùng ngủ nông hiện ra', None, ('blip_up', 'nhóm chấm thứ hai hiện ra ở vùng nông'), None),
    ('mech5@Vì', 'extra:nguoi_lab', 'con trỏ dừng ở đáy vùng ngủ sâu', 'đáy vùng ngủ sâu được khoanh đậm', None, None, None),
    ('mech5@nằm', 'extra:nguoi_lab', 'một mũi tên vẽ từ đáy vùng sâu bò lên trên', 'mũi tên nối đáy vùng sâu với đỉnh', None, None, None),
    ('mech5@não', 'extra:nguoi_lab', 'con dấu đỏ đập xuống vùng ngủ sâu', 'vùng ngủ sâu mang dấu đỏ', None, ('stamp', 'con dấu đỏ đập xuống bảng'), None),
    ('mech5@được', 'extra:nguoi_lab', 'vùng sâu giữ nguyên dấu đỏ', 'dấu đỏ nằm yên trên vùng sâu', None, None, None),
    ('mech5@end', 'extra:nguoi_lab', 'màn hình EEG vẫn chạy, vùng sâu đã được đóng dấu', 'đường sóng vẫn chạy trên màn hình', None, None, None),
   ]),

 dict(id='tudanhgia',
   place='bàn đo của phòng thí nghiệm, ba phiếu tự đánh giá, bảng đo lớn, cốc nước',
   light='đèn bàn trắng lạnh, bóng đèn dài trên mặt bàn gỗ',
   cast=['extra:nguoi_tham_gia'], lines=['self1', 'self2', 'self3', 'self4'],
   amb='room', music='E', in_=('light', 'light_on'),
   shots=[
    ('tudanhgia_desk_wide', None, 'wide', 'none', 'hold', 'bàn đo với ba tờ phiếu bên trái và bảng đo lớn bên phải',
     'cú lật của tập phải đặt hai vật cạnh nhau trong một khung: cảm giác và đồng hồ'),
    ('tudanhgia_desk_sheets', 'self2@Nhưng', 'insert', 'none', 'hold', 'ba tờ phiếu tự đánh giá, cả ba mang dấu tốt',
     'cảm giác của cả ba nhóm đều tốt — đó mới là nghịch lý'),
    ('tudanhgia_desk_clock', 'self3@Tức', 'close', 'none', 'push', 'chiếc đồng hồ đo tụt xuống dưới vạch gốc',
     'đồng hồ đo nói ngược lại với cảm giác, và nói thẳng bằng hai thanh'),
    ('tudanhgia_desk_strip', 'self4@Cảm', 'insert', 'none', 'pan', 'dải thang tự chấm vẫn thẳng tắp',
     'cái dải phẳng là hình ảnh của việc không ai biết mình đang tệ'),
   ],
   beats=[
    ('self1@Chuyện', 'extra:nguoi_tham_gia', 'tờ phiếu tự đánh giá đầu tiên mở ra trên bàn', 'phiếu nằm nghiêng trên bàn', None, None, None),
    ('self1@Trong', 'extra:nguoi_tham_gia', 'ba tờ phiếu tự đánh giá xếp thành hàng', 'ba phiếu nằm cạnh nhau',
     lab('doc', 'phiếu tự đánh giá', [420, 500], [430, 600], color='#F2A541'), None, None),
    ('self1@ngủ', 'extra:nguoi_tham_gia', 'một tờ phiếu bị úp xuống, úp sát cạnh bàn', 'tờ phiếu úp nằm sát mép bàn', None, ('paper_flip', 'tờ phiếu úp xuống úp sát mép bàn'), None),
    ('self1@chấm', 'extra:nguoi_tham_gia', 'ngón tay lần theo cả ba dấu tốt trên phiếu', 'ngón tay dừng ở dấu tốt thứ ba', None, None, None),
    ('self1@tốt', 'extra:nguoi_tham_gia', 'cả ba phiếu cùng mang dấu tốt', 'ba dấu tốt sáng cùng lúc', None, None, None),
    ('self1@end', 'extra:nguoi_tham_gia', 'tờ phiếu úp nằm yên, không ai đụng tới', 'khung hình đứng yên trên phiếu úp', None, None, None),
    ('self2@Nhưng', 'extra:nguoi_tham_gia', 'chiếc bảng đo bên phải sáng lên', 'màn hình bảng đo sáng lên', None, ('beep', 'bảng đo báo một nhịp'), None),
    ('self2@ngược', 'extra:nguoi_tham_gia', 'kim đồng hồ tụt xuống dưới vạch gốc', 'kim nằm dưới vạch gốc',
     lab('number', '4,3 lần/s', [1620, 300], [1560, 380], color='#67E8F9'), ('blip_down', 'kim đồng hồ trượt xuống dưới vạch gốc'), None),
    ('self2@ở', 'extra:nguoi_tham_gia', 'các mốc đo đầu tiên sau khi dậy được đánh dấu', 'ba vạch dọc đồng hồ hiện ra', None, ('pen_tick', 'bút đánh dấu các mốc đo'), None),
    ('self2@ngủ', 'extra:nguoi_tham_gia', 'con trỏ dừng ở nhóm ngủ lâu trên đồng hồ', 'nhóm ngủ lâu được khoanh', None, None, None),
    ('self2@sai', 'extra:nguoi_tham_gia', 'con trỏ gõ vào thanh thấp hơn, mặt nghiêm lại', 'thanh sau khi dậy thấp hơn thanh trước khi ngủ', None, None, None),
    ('self2@end', 'extra:nguoi_tham_gia', 'hai thanh đo đứng cạnh nhau trên màn hình', 'hai thanh đo hiện rõ', None, None, None),
    ('self3@Tức', 'extra:nguoi_tham_gia', 'dải thang tự chấm vẫn thẳng tắp từ đầu đến cuối', 'dải thang tự chấm không đổi',
     lab('term', 'cảm giác tỉnh', [80, 110], defn='tự đánh giá là cảm nhận, không phải đo', stay=True, color='#67E8F9'), None, None),
    ('self3@biết', 'extra:nguoi_tham_gia', 'không một biểu đồ nào nói cho ai biết', 'khung hình vẫn im lặng', None, None, None),
    ('self3@không#2', 'extra:nguoi_tham_gia', 'chiếc đồng hồ đo trên bàn nhảy một nhịp', 'đồng hồ nhảy nhịp rồi đứng yên', None, ('tick', 'đồng hồ đo nhảy một nhịp'), None),
    ('self3@end', 'extra:nguoi_tham_gia', 'một tờ giấy nằm dài trên bàn, không ai nhặt', 'tờ giấy nằm nguyên trên bàn', None, None, None),
    ('self4@Cảm', 'extra:nguoi_tham_gia', 'tờ phiếu tự đánh giá bị đẩy sang một bên bàn', 'tờ phiếu nằm sát mép bàn', None, ('paper_slide', 'tờ phiếu bị đẩy sang mép bàn'), None),
    ('self4@không', 'extra:nguoi_tham_gia', 'một tờ giấy in kết quả được đặt sang phía bên kia', 'tờ giấy in nằm bên kia tờ phiếu', None, None, None),
   ]),

 dict(id='quantcafe',
   place='quầy cà phê nhỏ ven đường, máy pha, kệ tách, bàn gỗ sát cửa sổ',
   light='đèn vàng quầy bar, nắng chiều lọt qua cửa kính',
   cast=['extra:nhan_vien_quan', 'host'], lines=['roi3', 'cafe1', 'cafe2', 'cafe3', 'cafe4'],
   amb='cafe', music='F', in_=('whip', 'whoosh_soft'),
   shots=[
    ('quantcafe_cafe_wide', None, 'wide', 'none', 'hold', 'quầy cà phê ven đường với máy pha, kệ tách và bàn gỗ',
     'câu hỏi đời thường phải ở quán cà phê, không ở phòng thí nghiệm'),
    ('quantcafe_cafe_cup', 'cafe2@Nhưng', 'insert', 'none', 'push', 'tách cà phê đặt cạnh chiếc gối trên bàn gỗ',
     'vị trí của tách nói hết: uống trước khi nằm'),
    ('quantcafe_cafe_bar', 'cafe3@Nói', 'medium', 'none', 'hold', 'thanh ba mươi phút đầu vẽ trên mặt quầy',
     'cà phê sau khi dậy đến trễ, phải thấy đoạn trễ'),
    ('quantcafe_cafe_back', 'cafe4@Và', 'close', 'none', 'hold', 'tách cà phê quay lại cạnh chiếc gối',
     'quyết định nằm ở chỗ tách đặt, nên khung này phải thấy rõ vị trí'),
   ],
   beats=[
    ('roi3@Vậy', 'host', 'người dẫn nói ra cách hiểu phổ biến: cứ uống cà phê ngay sau khi dậy là tỉnh ngay', 'ly cà phê đặt trên mặt quầy', None, None, None),
    ('roi3@đá', 'extra:nhan_vien_quan', 'nhân viên quán chỉ vào đá trong ly, mắt tròn xoe', 'ngón tay chĩa vào đá trong ly', None, None, None),
    ('roi3@chứ', 'extra:nhan_vien_quan', 'nhân viên quán chống tay lên quầy, nghiêng đầu', 'nhân viên quán đứng tựa quầy', None, None, None),
    ('cafe1@Cà', 'extra:nhan_vien_quan', 'nhân viên quán đặt tách cà phê xuống bàn gỗ cạnh chiếc gối', 'tách cà phê nằm cạnh gối',
     lab('name', 'tách cà phê', [1420, 600], [1360, 690], color='#67E8F9'), ('cup_set', 'tách cà phê đặt xuống bàn'), None),
    ('cafe1@Người', 'extra:nhan_vien_quan', 'một vòng xanh nhạt lan quanh tách cà phê', 'vòng xanh lan rộng quanh tách', None, None, None),
    ('cafe1@trước', 'extra:nhan_vien_quan', 'vòng xanh lan tới tận chiếc gối', 'vòng xanh chạm tới mép gối', None, ('ting', 'vòng xanh chạm tới mép gối'), None),
    ('cafe1@giảm', 'extra:nhan_vien_quan', 'vòng xanh đậm lại quanh tách', 'vòng xanh đứng yên', None, None, None),
    ('cafe1@rõ', 'extra:nhan_vien_quan', 'tách cà phê vẫn nằm cạnh gối', 'tách cà phê yên vị trí cũ', None, None, None),
    ('cafe2@Nhưng', 'extra:nhan_vien_quan', 'nhân viên quán đẩy tách sang bàn phía sau, xa khỏi gối', 'tách cà phê nằm xa gối',
     lab('place', 'bàn phía sau', [700, 620], [560, 690], color='#67E8F9'), ('wood_set', 'tách cà phê bị đẩy trên mặt quầy'), None),
    ('cafe2@đến', 'extra:nhan_vien_quan', 'một thanh thời gian ba mươi phút đầu được vẽ ra', 'thanh thời gian mọc lên trên quầy', None, None, None),
    ('cafe2@Đoạn', 'extra:nhan_vien_quan', 'đoạn đầu của thanh thời gian được tô đậm', 'đoạn đầu tô đậm thành vùng tối',
     lab('term', 'đoạn tệ nhất', [80, 110], defn='phần đầu sau khi dậy, lúc não còn mơ hồ', stay=True, color='#F0525B'),
     ('pen_cross', 'bút tô đậm đoạn đầu của thanh thời gian'), None),
    ('cafe2@cứu', 'extra:nhan_vien_quan', 'tách cà phê nằm ngoài vùng tối trên thanh thời gian', 'tách cà phê nằm ngoài vùng tô đậm', None, None, None),
    ('cafe2@end', 'extra:nhan_vien_quan', 'nhân viên quán đẩy tách đi xa hơn nữa', 'tách cà phê trượt xa hơn', None, None, None),
    ('cafe3@Nói', 'extra:nhan_vien_quan', 'nhân viên quán đặt lại tách lên bàn cạnh gối', 'tách cà phê quay lại cạnh gối', None, ('cup_set', 'tách cà phê đặt lại cạnh gối'), None),
    ('cafe3@xuống', 'extra:nhan_vien_quan', 'một chiếc gối nhỏ được vẽ lên cạnh tách', 'chiếc gối nhỏ hiện ra', None, ('pen_circle', 'bút vẽ chiếc gối nhỏ cạnh tách'), None),
    ('cafe3@đừng', 'extra:nhan_vien_quan', 'vị trí tách ở bàn phía sau bị gạch chân', 'nét gạch chân đè lên vị trí cũ', None, ('pen_cross', 'bút gạch chân vị trí tách cà phê'), None),
    ('cafe4@Và', 'extra:nhan_vien_quan', 'đồng hồ đếm ngược trên tường chạy về gần không', 'kim đồng hồ về sát mốc không',
     lab('time', 'đồng hồ đếm ngược', [1080, 180], [1080, 260], color='#67E8F9'), ('timer_tick', 'kim đồng hồ đếm ngược chạy về không'), None),
    ('cafe4@cà', 'extra:nhan_vien_quan', 'con trỏ dừng ở chiếc đồng hồ đếm ngược', 'con trỏ chỉ chiếc đồng hồ', None, None, None),
    ('cafe4@end', 'extra:nhan_vien_quan', 'chiếc đồng hồ vẫn treo, kim đứng yên', 'khung hình quay lại bàn', None, None, None),
   ]),

 dict(id='chiphi',
   place='bàn làm việc tối, hồ sơ giấy bọc bìa cứng, lịch ngủ mười bốn ô đêm, con dấu đỏ',
   light='đèn bàn vàng tập trung, nền tối, hạt phim rõ',
   cast=['extra:nguoi_luu_tru', 'host'], lines=['roi4', 'cost1', 'cost2', 'cost3'],
   amb='room', music='G', in_=('cut', None),
   shots=[
    ('chiphi_file_wide', None, 'wide', 'none', 'hold', 'bàn làm việc tối với bìa hồ sơ giấy và Rối đứng giữa khung',
     'cảnh này nặng hơn các cảnh trước: dùng ngôn ngữ hồ sơ'),
    ('chiphi_file_open', 'cost1@nặng', 'medium', 'none', 'push', 'bìa hồ sơ thiếu ngủ mở ra trên bàn',
     'hồ sơ mở ra là bằng chứng, không phải lời kể'),
    ('chiphi_file_grid', 'cost1@ngủ#2', 'insert', 'none', 'pan', 'mười bốn ô đêm trong lịch ngủ',
     'mười bốn đêm phải thấy đếm được, không chỉ nghe'),
    ('chiphi_file_stamp', 'cost3@Và', 'close', 'none', 'hold', 'con dấu đỏ đập giữa hồ sơ',
     'dấu kết luận đến đúng lúc người ta không nhận ra mình mệt'),
   ],
   beats=[
    ('roi4@Thì', 'host', 'người dẫn nói ra cách hiểu phổ biến: thì cứ đừng ngủ trưa, giữ mình tỉnh là hơn', 'bàn trống dưới đèn vàng', None, None, None),
    ('roi4@giữ', 'host', 'người dẫn chỉ vào phía cửa sổ, như đang tìm một cách nữa', 'ánh sáng đèn bàn hắc ra mép bàn', None, None, None),
    ('roi4@chứ', 'extra:nguoi_luu_tru', 'người lưu trữ bước tới, đặt bìa hồ sơ xuống bàn', 'bìa hồ sơ nằm giữa bàn', None, ('paper_flip', 'bìa hồ sơ giấy đặt xuống bàn'), None),
    ('cost1@Còn', 'extra:nguoi_luu_tru', 'người lưu trữ mở bìa hồ sơ thiếu ngủ trên bàn', 'hồ sơ mở, ghim đỏ ở góc', None, ('paper_flip', 'bìa hồ sơ giấy mở ra'), None),
    ('cost1@nặng', 'extra:nguoi_luu_tru', 'trang lịch ngủ mười bốn ô đêm lật ra', 'dãy ô đêm hiện ra trên trang', None, ('page_turn', 'trang lịch ngủ lật sang'), None),
    ('cost1@ngủ#2', 'extra:nguoi_luu_tru', 'ngón tay gõ vào ô thứ tư của dãy ô đêm', 'ô thứ tư được tô sáng', None, ('hand_tap', 'ngón tay gõ lên ô thứ tư'), None),
    ('cost1@tích', 'extra:nguoi_luu_tru', 'một mũi tên được vẽ từ ô thứ tư sang ô cuối', 'mũi tên nối ô thứ tư với ô cuối', None, None, None),
    ('cost1@thiếu', 'extra:nguoi_luu_tru', 'người lưu trữ gõ ngón tay dọc theo dãy ô đêm', 'dãy ô đêm được gõ từng ô', None, None, None),
    ('cost1@end', 'extra:nguoi_luu_tru', 'cả dãy ô đêm nằm nghiêng trên trang hồ sơ', 'dãy ô đêm giữ nguyên', None, None, None),
    ('cost2@giờ', 'extra:nguoi_luu_tru', 'con trỏ dừng ở ô sáu giờ', 'ô sáu giờ được khoanh sáng',
     lab('number', '6 giờ', [860, 480], [900, 560], color='#F0525B'), None, None),
    ('cost2@tương', 'extra:nguoi_luu_tru', 'hai đêm tối được khoanh tròn trên dãy ô', 'vòng tròn tím quanh hai ô cuối',
     lab('number', '2 đêm', [1640, 640], [1560, 660], color='#4F86C6'), ('pen_circle', 'bút khoanh tròn hai đêm tối'), None),
    ('cost2@end', 'extra:nguoi_luu_tru', 'con trỏ rời khỏi dãy ô, hai vòng tròn vẫn còn', 'hai đêm tối vẫn được khoanh', None, None, None),
    ('cost3@Và', 'extra:nguoi_luu_tru', 'dải thang tự chấm vẫn thẳng dọc mép bảng, con dấu đỏ đập xuống giữa hồ sơ', 'dải thang phẳng lì, con dấu đỏ nằm trên bìa hồ sơ', None, ('stamp', 'con dấu đỏ đập xuống bìa hồ sơ'), None),
    ('cost3@ra', 'extra:nguoi_luu_tru', 'con dấu đỏ nằm im trên bìa hồ sơ', 'con dấu đỏ nằm trên bìa hồ sơ', None, None, None),
    ('cost3@end', 'extra:nguoi_luu_tru', 'hồ sơ nằm yên dưới con dấu đỏ', 'khung hình đứng yên', None, None, None),
   ]),

 dict(id='hanhdong',
   place='bàn làm việc buổi tối của Kẻ Nghĩ Nhiều ở nhà, đèn bàn vàng, cửa sổ đêm, điện thoại, tách cà phê, sổ tay, giường ở góc',
   light='đèn bàn vàng ấm, cửa sổ ngoài trời tối đen',
   cast=['host'], lines=['act1', 'act2', 'act3', 'act4', 'close1', 'close2', 'close3'],
   amb='night', music='G', in_=('cut', None),
   shots=[
    ('hanhdong_desk_wide', None, 'wide', 'desk', 'hold', 'bàn làm việc tối với đèn bàn vàng và chiếc điện thoại',
     'hành động phải được làm trong cảnh, không nói mới'),
    ('hanhdong_desk_alarm', 'act2@Muốn', 'insert', 'desk', 'push', 'ô phút trên điện thoại đổi từ ba mươi sang mười',
     'gõ lại con số là thay đổi thật, không phải lời khuyên'),
    ('hanhdong_desk_cup', 'act3@Uống', 'insert', 'desk', 'hold', 'tách cà phê đặt cạnh chiếc gối giường',
     'thứ tự tách cà phê và giấc ngủ là thứ người xem chép lại được'),
    ('hanhdong_desk_note', 'act4@Muốn', 'medium', 'desk', 'hold', 'sổ tay ghi chú và tờ bảng điểm trên bàn',
     'lời khuyên phải nằm trên giấy trước khi trở thành thói quen'),
    ('hanhdong_desk_cards', 'close1@Ngủ', 'medium', 'desk', 'hold', 'ba thẻ số xếp cạnh nhau trên bàn',
     'ba thẻ là cách người xem tự chọn con số của mình'),
    ('hanhdong_desk_end', 'close2@nghị', 'close', 'desk', 'push', 'Kẻ nằm xuống, đèn ngủ nhỏ cạnh gối',
     'kết bằng hành động nhỏ, không bằng lời dặn', {'focus': [960, 720], 'amount': .14}),
    ('hanhdong_desk_title', 'close3@Trạm', 'medium', 'desk', 'hold', 'thẻ tiêu đề của kênh trượt vào giữa khung tối',
     'khung hình tối dần để lời chào tạm biệt làm chốt tập'),
   ],
   beats=[
    ('act1@Nên', 'host', 'Kẻ mở ứng dụng báo thức trên điện thoại, hai ngón gõ', 'màn hình điện thoại sáng lên', None, ('button', 'ngón tay bấm ứng dụng báo thức'), None),
    ('act1@Giữ', 'host', 'Kẻ gõ số ba mươi vào ô phút rồi bấm lưu', 'ô phút hiện ba mươi', None, None, None),
    ('act1@phút', 'host', 'ngón tay dừng trên ô phút, đếm lại một lần', 'ngón tay giữ nguyên trên ô phút', None, None, None),
    ('act1@nguy', 'host', 'Kẻ úp màn hình xuống, đẩy chiếc máy tính bảng sang xa', 'máy tính bảng trượt sang xa', None, ('plastic_click', 'nắp điện thoại úp xuống mặt bàn'), None),
    ('act1@end', 'host', 'Kẻ đặt điện thoại úp xuống, quay lại bàn', 'điện thoại nằm úp trên bàn', None, None, None),
    ('act2@Muốn', 'host', 'Kẻ mở lại báo thức, gõ số mười vào ô phút', 'ô phút đổi từ ba mươi sang mười', None, ('button', 'ngón tay bấm lại ứng dụng báo thức'), None),
    ('act2@thay', 'host', 'Kẻ bấm lưu, bộ đếm bắt đầu chạy', 'bộ đếm trên điện thoại chạy từ mười', None, None, None),
    ('act2@end', 'host', 'Kẻ gõ vào ô mười một lần rồi đứng dậy', 'Kẻ đứng lên khỏi ghế', None, None, None),
    ('act3@Uống', 'host', 'Kẻ đặt tách cà phê lên bàn cạnh chiếc gối giường', 'tách cà phê nằm cạnh gối',
     lab('name', 'tách cà phê', [1640, 560], [1560, 640], color='#67E8F9'), ('cup_set', 'tách cà phê đặt xuống bàn'), None),
    ('act3@nó', 'host', 'ánh sáng nhẹ nhấp nháy quanh tách cà phê', 'quầng sáng nhấp nháy quanh tách', None, None, None),
    ('act3@để', 'host', 'Kẻ với lấy sổ tay, ngồi xuống mép giường', 'Kẻ ngồi xuống mép giường', None, ('page_turn', 'Kẻ lật trang sổ tay'), None),
    ('act4@Muốn', 'host', 'Kẻ kéo tờ bảng điểm vào giữa bàn', 'tờ bảng điểm nằm giữa bàn', None, ('paper_flip', 'tờ bảng điểm được kéo vào giữa bàn'), None),
    ('act4@bạn', 'host', 'Kẻ ghi một dòng vào sổ tay, bút dừng lại', 'nét chữ mới trong sổ tay', None, ('pen_scribble', 'bút ghi một dòng vào sổ tay'), None),
    ('act4@không', 'host', 'Kẻ gạch chân dòng vừa ghi, rồi gập sổ lại', 'nét gạch chân đè lên dòng vừa ghi', None, ('pen_cross', 'bút gạch chân dòng vừa ghi'), None),
    ('act4@end', 'host', 'Kẻ nhìn xuống tờ bảng điểm một lần nữa', 'tờ bảng điểm nằm yên giữa bàn', None, None, None),
    ('close1@Ngủ', 'host', 'Kẻ đặt thẻ ba mươi phút xuống bàn', 'thẻ ba mươi phút nằm trên bàn', None, ('card_set', 'thẻ số đầu tiên đặt xuống bàn'), None),
    ('close1@trưa', 'host', 'Kẻ đẩy thẻ ba mươi phút ra rìa bàn', 'thẻ ba mươi phút trượt ra rìa bàn', None, ('card_set', 'thẻ ba mươi phút trượt ra rìa bàn'), None),
    ('close1@thôi', 'host', 'Kẻ đặt thẻ mười phút vào giữa, ngón gõ hai lần', 'thẻ mười phút nằm giữa bàn', None, ('card_set', 'thẻ mười phút đặt xuống giữa bàn'), None),
    ('close1@cà', 'host', 'Kẻ xếp thẻ cà phê cạnh thẻ mười phút', 'thẻ cà phê nằm cạnh thẻ mười phút', None, None, None),
    ('close1@end', 'host', 'Kẻ nhìn ba thẻ, gật đầu một cái', 'ba thẻ nằm thành hàng', None, None, None),
    ('close2@nghị', 'host', 'Kẻ với công tắc đèn bàn, ánh sáng tắt dần', 'ánh sáng trong phòng tắt dần', None, ('switch', 'công tắc đèn bàn bật xuống'), None),
    ('close2@nghị', 'host', 'Kẻ chỉ vào con số ba mươi phút trên thẻ, gật đầu', 'ngón tay dừng trên thẻ ba mươi phút', None, None, None),
    ('close2@Nhưng', 'host', 'Kẻ lắc đầu, tay vẫn đặt trên nắp đèn', 'Kẻ lắc đầu ngay dưới ánh đèn mờ', None, None, None),
    ('close2@ngủ', 'host', 'Kẻ nằm xuống, chỉ còn đèn ngủ nhỏ', 'Kẻ nằm trên giường', None, ('light_off', 'đèn ngủ nhỏ thắp lại trên bàn'), None),
    ('close2@đừng', 'host', 'Kẻ kéo chăn lên vai, mắt nhắm', 'chăn phủ lên vai Kẻ', None, ('cloth_rustle', 'chăn kéo lên vai'), None),
    ('close2@end', 'host', 'Kẻ nằm im, sợi tóc đèn nằm ngang trên gối', 'phòng tối, chỉ còn hơi thở', None, None, None),
    ('close3@Trạm', 'none', 'thẻ tiêu đề của kênh trượt vào giữa khung', 'thẻ tiêu đề hiện ra giữa khung', None, ('paper_slide', 'thẻ tiêu đề trượt vào giữa khung'), None),
    ('close3@hẹn', 'none', 'khung hình chìm dần vào bóng tối', 'khung hình tối dần', None, None, None),
    ('close3@kỳ', 'none', 'cả khung hình tối lặng, chỉ còn hơi thở đều', 'khung hình tối hẳn', None, None, None),
   ]),
]

PALETTE = {
 'term': {'color': '#F2A541', 'name': 'khái niệm mới'},
 'name': {'color': '#F2A541', 'name': 'tên của vật'},
 'place': {'color': '#67E8F9', 'name': 'nơi chốn'},
 'time': {'color': '#67E8F9', 'name': 'mốc thời gian'},
 'number': {'color': '#F0525B', 'name': 'con số của vật'},
 'doc': {'color': '#F2A541', 'name': 'tài liệu của câu chuyện'},
 'stamp': {'color': '#F0525B', 'name': 'dấu kết luận'},
 'calm': {'color': '#67E8F9', 'name': 'số đo trung tính'},
 'target': {'color': '#F2A541', 'name': 'có lợi'},
 'rival': {'color': '#4F86C6', 'name': 'xấu, mất lợi'},
 'deep': {'color': '#8B5CF6', 'name': 'giấc ngủ sâu'},
 'warn': {'color': '#F0525B', 'name': 'cảnh báo'},
}


def main():
    scenes = []
    for sc in SCENES:
        shots = []
        for sh in sc['shots']:
            sh_id, at, size, host, cam, subject, why = sh[:7]
            x = {'id': sh_id, 'size': size, 'host': host, 'cam': cam, 'subject': subject, 'why': why}
            if at: x['at'] = at
            if len(sh) > 7: x.update(sh[7])
            shots.append(x)
        beats = []
        for j, (at, who, do, change, label, sfx, flags) in enumerate(sc['beats']):
            b = {'id': '%s_b%02d' % (sc['id'], j + 1), 'at': at, 'who': who, 'do': do, 'change': change}
            if label: b['label'] = label
            if sfx: b['sfx'] = {'type': sfx[0], 'cause': sfx[1]}
            if flags: b['flags'] = flags
            beats.append(b)
        s = {'id': sc['id'], 'place': sc['place'], 'light': sc['light'], 'cast': sc['cast'],
             'lines': sc['lines'], 'shots': shots, 'beats': beats, 'amb': sc['amb'], 'music': sc['music']}
        tr, sfx_in = sc['in_']
        s['in'] = {'tr': tr}
        if sfx_in: s['in']['sfx'] = sfx_in
        if 'silence' in sc: s['silence'] = {'at': sc['silence'][0], 'd': sc['silence'][1]}
        scenes.append(s)

    board = {'ink': '#FAF8F5', 'palette': PALETTE, 'scenes': scenes}
    json.dump(board, open(os.path.join(EP, 'board.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('board.json: %d cảnh, %d khung, %d nhịp' % (
        len(scenes), sum(len(s['shots']) for s in scenes), sum(len(s['beats']) for s in scenes)))


if __name__ == '__main__':
    main()
