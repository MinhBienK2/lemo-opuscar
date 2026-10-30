"""Sinh src/shots_b.js cho các câu của chương 4, 5, 6 viết sau (c4_17..c6_25).

Chỉ số từ (k) của mỗi dòng trên thẻ được tính từ kịch bản, nên không có chỉ số sai.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LINES = {L['id']: L['text'] for L in json.load(open(os.path.join(ROOT, 'voice/lines.json'), encoding='utf-8'))}
norm = lambda s: re.sub(r'[^\w]', '', s.lower().replace('đ', 'd'))


def k_of(lid, text, after=0):
    ws = [norm(w) for w in LINES[lid].split()]
    for w in [norm(x) for x in text.split()]:
        if w not in ws:
            raise SystemExit(f'"{text}" — từ "{w}" không có trong câu {lid}')
    want = norm(text.split()[0])
    hits = [i for i, w in enumerate(ws) if w == want and i >= after]
    if not hits:
        raise SystemExit(f'không thấy "{text}" trong câu {lid}')
    return hits[0]


def q(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def card(title, sub, lines, w=860, h=None):
    out = "{ x: 560, y: 470, w: %d, h: %d, title: %s, sub: %s,\n      lines: [" % (w, h or (420 + 66 * len(lines)), q(title), q(sub))
    for text, lid, col in lines:
        out += "{ t: %s, at: %s, k: %d, col: %s }, " % (q(text), q(lid), k_of(lid, text), col)
    return out.rstrip(', ') + "] }"


TALK = 'talk'
SHOTS = [
    # ——— chương 4 ———
    dict(n='ch4p1', at='c4_17', beat=TALK, line='c4_17', keys="[[0, 'flat'], ['w', 6, 'talk']]",
         card=card('Ý CHÍ Ở ĐÚNG CHỖ', 'cuối chuỗi, không phải đầu', [
             ('lời nhắc "tập trung đi"', 'c4_18', 'PAL.red.f'),
             ('chỉ là một tiếng ồn', 'c4_18', 'PAL.cyan.f')])),
    dict(n='ch4p2', at='c4_19', beat=TALK, line='c4_19', keys="[[0, 'determined'], ['w', 6, 'talk']]",
         card=card('LÀM CHO VIỆC NÓ ĐÁNG', 'rút về một việc nhỏ, có phản hồi rõ', [
             ('một việc nhỏ, có phản hồi rõ ràng', 'c4_19', 'PAL.hoodie.f'),
             ('ba dòng thì não chịu làm', 'c4_20', 'PAL.cyan.f')])),
    dict(n='ch4p3', at='c4_21', beat=TALK, line='c4_21', keys="[[0, 'talk']]",
         card=card('PHẦN THƯỞNG Ở TRƯỚC MẶT', 'thì phần thưởng ở xa không còn là lý do để trốn', [
             ('phần thưởng ở ngay trước mặt', 'c4_21', 'PAL.cyan.f'),
             ('hứng thú thường đến sau khi bắt đầu', 'c4_22', 'PAL.hoodie.f')])),
    dict(n='ch4p4', at='c4_23', beat=TALK, line='c4_23', keys="[[0, 'determined'], ['w', 8, 'talk']]",
         card=card('CHỜ MÃI MỘT LẦN HỨNG THÚ', 'thì chờ mãi', [
             ('Hứng thú đến sau khi bắt đầu', 'c4_23', 'PAL.cyan.f'),
             ('bắt đầu bằng thứ nhỏ nhất', 'c4_24', 'PAL.hoodie.f')])),
    dict(n='ch4p5', at='c4_25', beat=TALK, line='c4_25', keys="[[0, 'flat'], ['w', 6, 'talk']]",
         card=card('KHI CHÁN', 'bộ não đi tìm phần thưởng', [
             ('nó chọn việc khó', 'c4_25', 'PAL.green.f'),
             ('không phải tín hiệu để nghỉ', 'c4_26', 'PAL.red.f')])),
    dict(n='ch4p6', at='c4_27', beat='compare', line='c4_27',
         leftHead='CÓ NHỮNG NGÀY', left='Tập trung được\\nrất lâu',
         rightHead='BA ĐIỀU KIỆN', right='Việc rõ\\nĐủ khó\\nPhản hồi ngay',
         pip=True),
    dict(n='ch4p7', at='c4_29', beat=TALK, line='c4_29', keys="[[0, 'determined'], ['w', 6, 'talk']]",
         card=card('MỘT VIỆC ĐÁNG TẬP TRUNG HƠN', 'chứ không phải tập trung mạnh hơn', [
             ('một việc đáng tập trung hơn', 'c4_29', 'PAL.hoodie.f'),
             ('viết ra, chia nhỏ, đặt mốc', 'c4_30', 'PAL.cyan.f')])),
    # ——— chương 5 ———
    dict(n='ch5q1', at='c5_17', beat=TALK, line='c5_17', keys="[[0, 'skeptical'], ['w', 8, 'talk']]",
         card=card('BẢY MẨU?', 'con số có thật, nhưng nó cũng cũ', [
             ('bảy thông tin cùng lúc', 'c5_17', 'PAL.muted'),
             ('bốn khối, không phải bảy', 'c5_18', 'PAL.cyan.f'),
             ('cách bộ não sắp xếp để không bị tràn', 'c5_19', 'PAL.green.f')])),
    dict(n='ch5q2', at='c5_20', beat=TALK, line='c5_20', keys="[[0, 'flat'], ['w', 10, 'talk']]",
         card=card('SAU MƯỜI LĂM PHÚT', 'đầu tắt dần? không có bằng chứng', [
             ('không có bằng chứng nào đúng như vậy', 'c5_20', 'PAL.red.f'),
             ('giữ được khoảng bốn mươi đến bốn mươi sáu phần trăm', 'c5_21', 'PAL.cyan.f'),
             ('hãy tin vào việc bạn đang làm', 'c5_22', 'PAL.green.f')])),
    dict(n='ch5q3', at='c5_23', beat='head', line='c5_23',
         thoughts=['quên thời gian', 'thời gian', 'không phải thứ họ đang tính'],
         label='trong lúc đó, thời gian không phải thứ họ đang tính'),
    dict(n='ch5q4', at='c5_25', beat='flow', line='c5_25',
         title='DÒNG CHẢY CẦN MỘT CÁI NEO',
         items=[dict(n='1', t='một việc', col='PAL.hoodie.f'), dict(n='2', t='một chỗ', col='PAL.cyan.f'), dict(n='3', t='một giờ', col='PAL.green.f')],
         pip=True),
    # ——— chương 6 ———
    dict(n='ch6p1', at='c6_14', beat=TALK, line='c6_14', keys="[[0, 'determined'], ['w', 10, 'talk']]",
         card=card('SỢ TRỄ TIN NHẮN', 'cái giá của việc trễ một tin nhắn', [
             ('có khi nhỏ hơn khoảng hai mươi lăm phút', 'c6_14', 'PAL.cyan.f'),
             ('không có tin nhắn nào khẩn cấp', 'c6_15', 'PAL.green.f')])),
    dict(n='ch6p2', at='c6_16', beat=TALK, line='c6_16', keys="[[0, 'talk']]",
         card=card('ĐỪNG CHỈ BẬT IM LẶNG', 'tắt hẳn từng ứng dụng một', [
             ('vẫn để bạn thấy có gì mới', 'c6_16', 'PAL.red.f')])),
    dict(n='ch6p3', at='c6_17', beat=TALK, line='c6_17', keys="[[0, 'determined']]",
         card=card('MỘT CÂU, NGẮN', 'đủ để làm theo mà không phải nghĩ', [
             ('viết quy tắc ra giấy, để trước mặt', 'c6_17', 'PAL.hoodie.f')])),
    dict(n='ch6p4', at='c6_18', beat=TALK, line='c6_18', keys="[[0, 'tired'], ['w', 8, 'talk']]",
         card=card('LÚC KHÓ NHẤT', 'và cũng là lúc ta hay lao vào sớm nhất', [
             ('Lau một cái cốc', 'c6_18', 'PAL.cyan.f'),
             ('Đi một vòng', 'c6_18', 'PAL.cyan.f')])),
    dict(n='ch6p5', at='c6_19', beat=TALK, line='c6_19', keys="[[0, 'smile'], ['w', 6, 'talk']]",
         card=card('DẤU HIỆU, KHÔNG PHẢI LỖI', 'cảm giác khó chịu kia', [
             ('là dấu hiệu, không phải lỗi', 'c6_19', 'PAL.green.f')])),
    dict(n='ch6p6', at='c6_20', beat=TALK, line='c6_20', keys="[[0, 'determined']]",
         card=card('BỘ NÃO CẦN BIẾT MÌNH ĐANG TIẾN', 'phản hồi tức thì', [
             ('một dấu tick, một dòng gạch', 'c6_20', 'PAL.hoodie.f'),
             ('một đồng hồ đếm', 'c6_20', 'PAL.cyan.f')])),
    dict(n='ch6p7', at='c6_21', beat=TALK, line='c6_21', keys="[[0, 'flat'], ['w', 8, 'talk']]",
         card=card('GIẤC NGỦ', 'tổng hợp bảy mươi nghiên cứu', [
             ('mất ngủ làm suy giảm khả năng giữ chú ý', 'c6_22', 'PAL.red.f'),
             ('đó là hiệu ứng mạnh, không nhỏ', 'c6_22', 'PAL.hoodie.f'),
             ('ngủ đủ là biện pháp, không phải phần thưởng', 'c6_23', 'PAL.green.f')])),
    dict(n='ch6p8', at='c6_24', beat=TALK, line='c6_24', keys="[[0, 'determined'], ['w', 8, 'talk']]",
         card=card('BỎ BỚT', 'đừng cố làm nhanh hơn', [
             ('hãy bỏ bớt, và làm từng thứ một', 'c6_24', 'PAL.hoodie.f')])),
    dict(n='ch6p9', at='c6_25', beat=TALK, line='c6_25', keys="[[0, 'smile'], ['w', 8, 'talk']]",
         card=card('MỤC TIÊU', 'không phải là không bao giờ đi lang thang', [
             ('biết mình đã tiêu bao nhiêu', 'c6_25', 'PAL.cyan.f'),
             ('hôm nay tiêu ít hơn hôm qua', 'c6_25', 'PAL.green.f')])),
]

EV_TALK = "[[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']]"

out = ['''// Bảng cảnh phần viết sau — chương 4, 5, 6 của tập 03 (sinh bởi src/mk_shots_b.py).
// Mỗi cảnh: { n (tên), at (câu neo), beat (loại hình), ...tham số, ev (sự kiện âm thanh) }.
// Sự kiện âm thanh có thời điểm **tương đối** so với đầu cảnh; film.js cộng thêm thời điểm của cảnh.
import { PAL } from './character.js';

export const SHOTS_B = [''']

for sh in SHOTS:
    out.append('  { n: %s, at: %s, off: -.2, beat: %s, line: %s,' % (q(sh['n']), q(sh['at']), q(sh['beat']), q(sh['line'])))
    for key in ('keys', 'card', 'leftHead', 'left', 'rightHead', 'right', 'title', 'items', 'thoughts', 'label'):
        if key not in sh:
            continue
        v = sh[key]
        if key == 'card':
            out.append('    card: %s,' % v)
        elif key == 'items':
            its = ', '.join("{ n: %s, t: %s, col: %s }" % (q(i['n']), q(i['t']), i['col']) for i in v)
            out.append('    items: [%s],' % its)
        elif key == 'thoughts':
            out.append('    thoughts: [%s],' % ', '.join(q(t) for t in v))
        elif key == 'keys':
            out.append('    keys: %s,' % v)
        else:
            out.append('    %s: %s,' % (key, q(v) if isinstance(v, str) else v))
    if sh.get('pip'):
        out.append('    pip: true, pipE: %s,' % q(sh.get('pipE', 'talk')))
    out.append('    ev: () => %s },' % (EV_TALK if sh['beat'] == TALK else "[[0, 'pop'], [0.6, 'ting']]"))
    out.append('')

out.append('];')
open(os.path.join(HERE, 'shots_b.js'), 'w', encoding='utf-8').write('\n'.join(out))
print('shots_b.js written:', len(SHOTS), 'shots')
