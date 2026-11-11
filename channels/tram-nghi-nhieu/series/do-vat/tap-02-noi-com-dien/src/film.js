// Trang phim: 48 nhát, mỗi câu lời kể một nhát, theo shot list của LOOK.md.
// Mỗi nhát bám vào câu nó mang (V.L[id].t0/t1) nên nhịp quay đúng với lời kể.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, markBeat, cardWindow } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, eio, eo, lerp, clamp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildBep, buildCatNgang, buildNoiCu } from './set.js';

const V = await loadVoice(build);
const F = film({ fov: 38 }), camera = F.camera;

const BEP = buildBep();        // N1 · bếp buổi sáng
const CAT = buildCatNgang();   // N2 · nồi cơm bị cưa ngang
const CU = buildNoiCu();       // N3 · nồi cơm đời đầu bị cưa ngang
const setOf = { N1: BEP, N2: CAT, N3: CU };

// ── 48 nhát ──────────────────────────────────────────────────────────────
// sh(set, câu, tiêu cự, vị trí máy, điểm nhìn, đẩy máy trong nhát)
const sh = (s, id, fov, p, l, d = [0, 0, 0]) => ({
  s, ids: [id], fov,
  pose: u => {
    const pp = typeof p === 'function' ? p() : p;
    const ll = typeof l === 'function' ? l() : l;
    return { p: [pp[0] + d[0] * ss(u), pp[1] + d[1] * ss(u), pp[2] + d[2] * ss(u)], l: ll };
  },
});

const LP = (o, x = 0, y = 0, z = 0) => { const v = new THREE.Vector3(x, y, z); o.localToWorld(v); return v; };
const off = (a, dx, dy, dz) => { const p = a(); return [p[0] + dx, p[1] + dy, p[2] + dz]; };

// các điểm neo trên chính vật
const A = {
  cooker: () => LP(BEP.cooker, 0, .16, 0).toArray(),
  lamp: () => LP(BEP.cooker.lamp, 0, 0, 0).toArray(),
  mouth: () => LP(BEP.cooker, 0, .30, 0).toArray(),
  vent: () => LP(BEP.cooker.vent, 0, .05, 0).toArray(),
  clock: () => LP(BEP.clock, 0, 0, .05).toArray(),
  bowl: () => LP(BEP.bowl, 0, .07, 0).toArray(),
  bag: () => LP(BEP.bag, 0, .14, 0).toArray(),
  oldBase: () => LP(BEP.old, 0, .09, 0).toArray(),
  expA: () => LP(BEP.expA, 0, .12, 0).toArray(),
  expB: () => LP(BEP.expB, 0, .12, 0).toArray(),
};

const SHOTS = [
  // ── N1 · buổi sáng: cái nồi đang nấu ──
  // c1: câu kể ba thứ — nồi cơm điện, mặt bàn gỗ, và CỬA SỔ. Khung cũ chỉ có
  // một góc cửa sổ ở mép trên, người xem không đọc ra "dưới cửa sổ"; máy phải
  // ngẩng lên một chút để cửa sổ vào khung, còn nồi vẫn giữ đúng cỡ.
  sh('N1', 'c1', 46, [-.10, 1.05, 2.30], [-.95, .50, .40], [0, 0, -.03]),   // cả bếp: bàn gỗ, cửa sổ nắng, nồi cơm đang nấu
  sh('N1', 'c2', 34, () => off(A.cooker, .52, .30, .92), A.cooker, [0, 0, -.02]), // vỏ nồi: một khối kín, không có mắt mũi
  sh('N1', 'c3', 26, () => off(A.lamp, .15, .09, .40), A.lamp, [0, 0, -.01]),   // đèn báo chuyển từ đỏ sang hổ phách
  sh('N1', 'c4', 36, () => off(A.cooker, .62, .34, 1.15), A.cooker, [0, 0, -.03]), // cả cái nồi: đèn hổ phách, hơi nước đã tắt
  sh('N1', 'c5', 28, () => off(A.cooker, .30, .06, .58), A.cooker, [0, 0, -.02]), // nhìn thấp vào thân nồi: một vật kín
  // c6: câu kể là "nó chỉ biết một thứ thôi: nhiệt", nên hình phải là cái đèn
  // báo hổ phách — thứ duy nhất trên nồi lúc này còn nói về nhiệt. Máy đứng
  // thấp ở mặt trước, đủ rộng để nắp VÀ mặt đèn cùng nằm trong khung; trước
  // đây máy đứng sát nắp nên đèn bị mép dưới và phụ đề cắt mất. Đèn lệch tâm
  // khung nên nó "thở" được (xem noi-com-dien.js): khung này có nhịp.
  sh('N1', 'c6', 32, [-.98, .40, 1.82], [-.90, .185, .90], [0, -.02, -.10]), // máy đẩy vào cái đèn hổ phách
  // ── N2 · dưới đáy nồi: mâm nhiệt, đầu dò nhiệt ──
  sh('N2', 'c7', 34, [.150, .430, .360], [0, .045, 0], [0, 0, -.025]),      // cả thiết bị: mâm nhiệt tròn, dây điện trở xoắn quanh vành
  sh('N2', 'c8', 32, [.150, .245, .340], [0, .055, -.005], [0, 0, -.015]),         // chính giữa mâm nhiệt: viên cầu trên lò xo
  sh('N2', 'c9', 22, [.022, .075, .200], [0, .048, -.003], [0, 0, -.010]),        // lò xo ép viên cầu vào đáy nồi
  sh('N2', 'c10', 14, [.055, .092, .150], [0, .052, -.002], [0, 0, -.009]), // cận viên cầu: đầu dò nhiệt
  sh('N2', 'c11', 34, [.56, .36, .72], [.335, .145, .29], [0, 0, -.03]),      // cầu đo điện trở: mười kiloôm rồi một kiloôm
  // c12: hai dây mảnh nằm trong khe giữa bo mạch và mâm nhiệt, nên máy phải
  // xuống THẤP hơn mặt đáy nồi: từ trên xuống, mặt đáy và mâm nhiệt che hết
  // hai sợi dây. Máy ở độ cao của mặt đáy thì khung chỉ có bo mạch.
  // c12 và c32 nhìn vào khe dưới mâm nhiệt: máy phải nghiêng XUỐNG một chút,
  // nếu không tấm mâm nhiệt trên đầu chiếm mất nửa trên khung — một mảng
  // kem phẳng không có gì đọc được.
  // Máy nay đứng sát mặt phẳng cưa và lệch sang trái: con chip ở đầu bên trái
  // nằm trọn trong khung (trước đây bị cắt ở mép), hai dây chạy chéo ra bên
  // phải về phía lỗ mâm, và dải bàn trống ở đáy khung chỉ còn một dải mỏng.
  sh('N2', 'c12', 26, [-.030, .044, .060], [-.072, .030, -.025], [0, 0, -.005]), // hai dây chạy từ viên cầu xuống bo mạch
  sh('N2', 'c13', 24, [-.010, .052, .092], [-.072, .0255, -.042], [0, 0, -.012]), // bo mạch đo điện trở, tính ra nhiệt độ
  sh('N2', 'c14', 36, [.34, .18, .50], [0, .05, 0], [0, 0, -.02]),          // con số là nhiệt độ đáy nồi
  sh('N2', 'c15', 42, [.34, .26, .54], [0, .115, 0], [0, 0, -.03]),          // rộng: cơm trên cao, cảm biến sát đáy
  sh('N2', 'c16', 30, [.240, .195, .400], [0, .050, 0], [0, 0, -.02]),         // dây điện trở nóng lên trước
  // c17: "đáy nồi ấm lên, nước và gạo nóng theo" — hình phải thấy được cả ba
  // tầng (đáy, lớp nước, lớp gạo) và làn nhiệt đi từ đáy lên qua nước vào
  // gạo. Máy đẩy sát vào mặt cưa, lệch sang phải, để mặt cưa chiếm gần hết
  // khung thay vì để nửa khung là tường gạch trơn và một phần ba là mặt bàn
  // trống. Góc cũ (xa, cao) không đọc ra được đáy nồi nào đang nóng.
  sh('N2', 'c17', 32, [.220, .145, .360], [.050, .130, .005], [0, 0, -.012]), // nhiệt đi từ đáy nồi lên nước và lên gạo
  sh('N2', 'c18', 30, [.245, .275, .480], [.130, .150, .010], [0, 0, -.012]), // lớp nước sôi, nhiệt kế ở vạch sôi
  sh('N2', 'c19', 34, [.150, .186, .112], [.075, .170, .010], [0, 0, -.006]), // nhiệt kế: cột thủy ngữ ở vạch sôi
  sh('N2', 'c20', 30, [.34, .30, .50], [0, .140, 0], [0, 0, -.02]),         // lớp nước ở đáy, lớp gạo nằm trên
  // hai câu cận hạt: máy vào sát mặt cắt, khung phải là hạt gạo, không phải cả
  // lớp nước bên dưới
  sh('N2', 'c21', 18, [-.062, .148, .055], [-.048, .1255, .004], [0, 0, -.006]), // hạt gạo cưa: tinh bột bắt đầu hồ hóa
  // c22 phải có hình riêng, không lặp lại c21: c21 là cận cảnh nhìn xuống
  // mặt cắt của hạt, c22 là cận cảnh NHÌN NGANG ở mặt nước, từ bên phải,
  // nơi nước thấm vào hạt — máy ở ngang mực nước nên người xem thấy rõ
  // giọt nước mọc lên từ mặt nước và chui vào thân hạt.
  sh('N2', 'c22', 15, [-.014, .126, .052], [-.048, .1215, .004], [0, 0, -.004]), // nước bị hút vào hạt gạo
  sh('N2', 'c23', 30, [.300, .215, .490], [0, .130, 0], [0, 0, -.020]),     // nồi còn sôi mà cơm đã chín
  // c24: máy hạ xuống sát đáy nồi, không đứng xa nhìn cả cái nồi. Ở khung này
  // phải đọc được ba thứ cùng lúc: mặt cưa của lớp nước nằm ngay trên đáy
  // nồi, viên cầu đầu dò nhiệt ép lên đáy, và thang chia của nhiệt kế với con
  // số 100 cùng vạch sôi đỏ ở bên phải. Khung rộng thì con số nhỏ xíu, đọc
  // không nổi; khung sát thì đáy nồi lại không có mặt cưa để nhận ra.
  sh('N2', 'c24', 30, [.145, .130, .430], [.035, .095, .010], [0, 0, -.020]),   // đáy nồi bị ghim ở vạch sôi
  sh('N2', 'c25', 30, [.330, .195, .520], [0, .110, 0], [0, 0, -.020]),     // nồi đứng yên, chờ
  sh('N2', 'c26', 26, [.430, .118, .215], [.020, .092, -.010], [0, 0, -.018]),     // nhìn ngang: nồi đứng yên đó, chờ
  // ── N1 · đồng hồ trên tường chạy ──
  sh('N1', 'c27', 30, () => off(A.clock, .30, .17, .78), A.clock, [0, 0, -.02]), // kim đồng hồ chạy nhanh
  // ── N2 · nước cạn, nhiệt độ nhảy vọt ──
  sh('N2', 'c28', 36, [.34, .24, .54], [0, .115, 0], [0, 0, -.03]),          // nước trong nồi cạn hết
  // c29: máy cúi vào trong miệng cưa, nhìn chéo xuống khoảng trống đáy nồi.
  // Khung phải đọc ra là đáy nồi (mặt cưa có độ dày, không phải một mảng kem
  // trơn), trên thành còn vệt nước cũ ở đúng mực nước cũ, và con chip ở góc
  // trái phải rơi ra ngoài khung — vật của câu khác không được kéo mắt.
  sh('N2', 'c29', 26, [.140, .115, .400], [.020, .078, .005], [0, 0, -.014]),  // không còn gì để hấp nhiệt
  sh('N2', 'c30', 26, [.148, .232, .150], [.078, .181, .008], [0, 0, -.010]), // cột thủy ngữ vượt vạch một trăm độ
  // máy đứng bên trái cột, nhìn chéo sang phải: cột thủy ngữ phải đứng trên
  // nền tối của tấm thang, không đứng trên nền sáng của thành nồi
  sh('N2', 'c31', 16, [.020, .192, .085], [.062, .1870, .012], [0, 0, -.004]), // đỉnh cột thủy ngữ: đó là tín hiệu
  // c32: dải sáng chạy trên hai dây, nên máy cũng phải xuống thấp, vào đúng khe
  // giữa bo mạch và mâm nhiệt — từ trên xuống thì dây bị mâm nhiệt che.
  // c32: máy nhìn TỪ phía con chip ngược lại, nên dải sáng chạy ra về phía máy
  // quay và kết thúc ở con chip. Cùng góc với c12 thì hai câu thành một
  // khung, mà câu này kể chuyện khác (dải sáng) nên phải có hình riêng.
  sh('N2', 'c32', 28, [-.028, .040, .082], [-.082, .0290, -.022], [0, 0, -.006]),  // dải sáng trên dây chạy nhanh hơn
  sh('N2', 'c33', 32, [.31, .14, .54], [0, .045, 0], [0, 0, -.02]),         // bo mạch ra lệnh, dây điện trở tắt
  sh('N2', 'c34', 30, [.27, .15, .43], [0, .050, 0], [0, 0, -.02]),         // dây điện trở bật tắt
  // khung phải có cả cột thủy ngữ ở bảy mươi độ lẫn vạch sôi: câu kể là "thấp
  // hơn nhiệt độ sôi", không thấy cột thì không có gì so
  sh('N2', 'c35', 30, [.100, .168, .160], [.085, .1440, .010], [0, 0, -.010]), // giữ ở bảy mươi độ
  // ── N1 → N3 · về những nồi cơm đời đầu ──
  sh('N1', 'c36', 46, [.35, .95, 2.05], [-.75, .22, .82], [0, 0, -.05]),    // nồi hiện đại và nồi đời đầu cạnh nhau
  sh('N3', 'c37', 30, [.420, .300, .520], [0, .130, -.010], [0, 0, -.006]), // nồi cơm đời đầu bị cưa: công tắc nhiệt cơ ở đáy
  sh('N3', 'c38', 28, [.052, .052, .160], [.010, .030, -.068], [0, 0, -.008]), // thanh lưỡng kim cong ra bấm tách tiếp điểm
  sh('N3', 'c39', 13, [.052, .036, .100], [.041, .027, -.068], [0, 0, -.006]), // tiếp điểm đã tách, dây điện trở tắt
  // ── N1 · thử: hai nồi, một nhiều nước một ít nước ──
  sh('N1', 'c40', 38, [.850, .510, 1.250], [.665, .295, .858], [0, 0, -.02]),  // rót nhiều nước vào nồi trái
  sh('N1', 'c41', 44, [.930, .380, 1.800], [.930, .085, .820], [0, 0, -.03]), // hai nồi cạnh nhau, một nhiều một ít nước
  // c42: máy phải thấy ĐÈN của nồi phải. Ở góc cũ, đèn báo nằm sau vỏ nồi nên
  // khung chỉ có đèn đỏ của nồi trái — người xem không thấy "đèn chuyển sang
  // giữ ấm". Góc mới lùi sang phải: đèn hổ phách của nồi phải lọt vào khung,
  // đèn đỏ của nồi trái vẫn còn ở mép trái, và cột thủy ngữ vẫn vượt vạch 100.
  sh('N1', 'c42', 42, [1.62, .270, 1.30], [1.29, .125, .83], [0, 0, -.010]), // nồi phải cạn nước, đèn chuyển sang giữ ấm
  sh('N1', 'c43', 24, [.395, .165, 1.065], [.615, .110, .820], [0, 0, -.015]), // nồi trái vẫn còn nước, vẫn sôi
  // ── N1 · kết ──
  sh('N1', 'c44', 36, () => off(A.mouth, .50, .22, .86), A.mouth, [0, 0, -.03]), // nồi chỉ biết mực nước
  sh('N2', 'c45', 30, [.200, .230, .340], [-.020, .090, -.020], [0, 0, -.015]),   // đáy nồi khô: vệt nước còn lại trên thành
  sh('N1', 'c46', 36, [-.340, .920, 1.580], [-1.030, .400, .760], [0, 0, -.02]), // bàn tay mở nắp: cơm trắng, hạt nở ra
  sh('N1', 'c47', 32, [-.520, .330, 1.020], [-.470, .130, .430], [0, 0, -.02]),   // lời khuyên: túi gạo và bát đong nước
  sh('N1', 'c48', 32, [-.092, .180, .656], [-.240, .076, .502], [0, 0, -.015]), // bát đong nước: xem lại lượng nước đã đổ
];

const MARK = SHOTS.map(s => ({ t0: V.L[s.ids[0]].t0, t1: V.L[s.ids[s.ids.length - 1]].t1 }));

// ── thẻ thuật ngữ ───────────────────────────────────────────────────────
const CARDS = [
  { id: 'mamnhiot', text: 'MÂM NHIỆT', at: () => [-.095, .049, -.055], lines: ['c7'], size: 28 },
  // "DÂY ĐIỆN TRỞ" phải chỉ vào DÂY: mũi tên phải chạm vào cuộn dây quanh
  // vành, không chỉ vào vành trắng trên. Neo đặt đúng lên một điểm của cuộn
  // dây (cuộn dây là đường xoắn quanh vành, bán kính 180 mm, ba vòng nối dần
  // từ 36 mm lên 92 mm). Không dùng dx: ở thẻ nhãn, dx đẩy cả mũi tên đi theo,
  // nên mũi tên lệch khỏi điểm neo.
  //
  // Điểm neo phải nằm TRÊN ĐƯỜNG XOẮN, không chỉ đúng góc quanh trục: đường
  // xoắn có ba vòng nên cùng một góc ấy có ba cao độ khác nhau. Neo cũ
  // ([-.055,.0704,-.1693]) rơi vào khoảng giữa hai vòng, nên mũi tên dừng ở
  // dải kem của vành mâm chứ không chạm vào dây. Neo nay lấy đúng vòng trên
  // cùng (vòng 3, cao độ 88,6 mm) ở góc quanh trục 270°, và đó cũng là chỗ
  // duy nhất của vòng đó không bị vành mâm che: mũi tên rơi đúng vào dải
  // dây nâu đồng, tách bạch với mâm nhiệt mà nhãn kia chỉ vào.
  { id: 'daydientro', text: 'DÂY ĐIỆN TRỞ', at: () => [.0113, .0886, -.1796], lines: ['c7'], size: 22 },
  { id: 'daudo', text: 'ĐẦU DÒ NHIỆT', at: () => [0, .060, .006], lines: ['c10'], size: 26 },
  // "BO MẠCH" phải chỉ vào mặt bo xanh trống, không phải lên mặt con chip: nhãn gọi
  // tên vật thì mũi tên phải chỉ đúng vật đó, không chỉ vào thứ nằm trên nó.
  // Neo phải nằm trong khung: nếu neo vượt ra ngoài khung thì thẻ bị dồn sát mép
  // phải và bị cắt. Mũi tên chỉ vào khoảng bo xanh trống giữa con chip và
  // chỗ hai dây vừa chạm bo.
  { id: 'bomach', text: 'BO MẠCH', at: () => [-.050, .0235, -.038], lines: ['c13'], size: 28 },
  // Mũi tên phải chỉ vào CỘT THỦY NGỮ ĐỎ, không phải vào phần ống kính trống
  // phía trên: ống kính màu xám trên nền xám không tự nó đọc ra là nhiệt kế.
  // Cột đỏ ở vạch sôi (100 °C) dừng ở cao độ 170 mm; neo đặt thấp hơn một chút,
  // trong lòng cột, để mũi tên chạm vào thứ đang đỏ.
  { id: 'nhietke', text: 'NHIỆT KẾ', at: () => [.0609, .1520, .012], lines: ['c19'], size: 26 },
  // Neo của thẻ là chỗ MŨI TÊN chạm tới: rig đặt đầu mũi tên đúng vào điểm
  // chiếu của neo, còn thân thẻ luôn nằm ở bên trên-phải mũi tên. Thẻ không
  // bao giờ nằm bên trái mục tiêu, nên mũi tên không thể chỉ vào mép trái của
  // vạch — chỉ chỉ vào mép phải được. Vạch sôi nằm sát chữ "100", mà chữ "120"
  // lại nằm ngay phía trên nó, nên thẻ chỉ vào mép phải của chữ "100" rồi trôi
  // sang nền tối bên phải thang: không đè lên số nào cả.
  // Nhãn phải đủ lâu để người xem đọc xong: thẻ vào (pop-in) mất 0,35 s và
  // thẻ ra (pop-out) mất 0,2 s, nên phần đọc được chỉ còn cửa sổ trừ 0,55 s.
  // Thẻ này KHÔNG dẫn sớm (lead 0): dẫn 0,5 s là thẻ hiện lên ở cuối câu
  // trước (c17), nên câu c17 lại có "TRĂM ĐỘ" trong danh sách nhãn mà khung
  // của c17 không có thẻ nào — người chấm hình đọc đúng là khung và danh sách
  // không khớp. Nay thẻ hiện đúng lúc hết câu c17, tức trong khoảng lặng
  // giữa hai câu, và câu c18 ("nước sôi ở khoảng một trăm độ") đọc nó kèm.
  // Cửa sổ còn 2,19 s nên phần đọc được dài 1,64 s — đủ cho một thẻ hai chữ.
  { id: 'tramnuoc', text: 'TRĂM ĐỘ', at: () => [.1148, .1745, .012], lines: ['c18'], size: 30, hold: 0.15 },
  { id: 'tramnuoc2', text: 'TRĂM ĐỘ', at: () => [.1148, .1745, .012], lines: ['c24'], size: 30 },
  { id: 'tramnuoc3', text: 'TRĂM ĐỘ', at: () => [.1148, .1745, .012], lines: ['c35'], size: 30 },
  { id: 'vuottram', text: '100 °C', at: () => [.1148, .1745, .012], lines: ['c30'], size: 32 },
  // Thẻ này có 2,02 s cửa sổ nên đọc được 1,47 s nếu không dẫn sớm. Dẫn
  // 0,5 s là thẻ hiện lên ở cuối câu trước (c30), nên câu c30 lại có "ĐỈNH
  // CỘT" trong danh sách nhãn mà khung của c30 không có thẻ nào — cùng lớp
  // lỗi với thẻ "TRĂM ĐỘ" ở c17/c18. Nay thẻ hiện đúng lúc hết câu c30,
  // tức trong khoảng lặng giữa hai câu, và câu c31 ("và đó chính là tín hiệu")
  // đọc nó kèm. Thẻ "100 °C" ở câu trước đã tắt trước đó (xem khối sửa
  // bên dưới) nên không có lúc hai thẻ cùng trên một cái thang nhiệt.
  { id: 'dinhtop', text: 'ĐỈNH CỘT', at: () => [.0609, .1868, .012], lines: ['c31'], size: 22, hold: 0.3 },
  { id: 'hohoa', text: 'HỒ HÓA 60 °C', at: () => [-.050, .128, .010], lines: ['c21'], size: 26 },
  // Mũi tên phải chỉ vào HẠT GẠO, đúng chỗ nước chui vào, chứ không chỉ vào
  // mặt nước phẳng bên dưới: chỉ vào nước trơn thì người xem không biết nước
  // bị hút vào đâu. Điểm neo lấy từ chính bối cảnh (điểm nước chui vào hạt).
  // Cửa sổ của thẻ này dài 2,02 s, tức phần đọc được là 1,47 s. Thẻ KHÔNG
  // dẫn sớm nữa (lead 0): dẫn 0,95 s là thẻ hiện lên ở cuối câu trước
  // (c21), nên câu c21 lại có "NƯỚC HÚT VÀO HẠT" trong danh sách nhãn mà
  // khung của c21 không có thẻ nào — người chấm hình đọc đúng là khung và
  // danh sách không khớp. Nay thẻ hiện đúng lúc hết câu c21, tức trong khoảng
  // lặng giữa hai câu, và câu c22 ("và nước thì bị hút vào hạt gạo") đọc nó
  // kèm. Giữ thêm 0,4 s ở cuối để phần đọc được dài 1,88 s; thẻ tắt hẳn
  // trước khi câu c23 bắt đầu nên không dính vào câu sau.
  { id: 'nuocvaohat', text: 'NƯỚC HÚT VÀO HẠT', at: () => CAT.absorb.at.toArray(), lines: ['c22'], size: 22, hold: 0.7 },
  { id: 'baymuoi', text: 'BẢY MƯỜI ĐỘ', at: () => [.0749, .1440, .012], lines: ['c35'], size: 26 },
  // Mũi tên VẾT NƯỚC phải chạm vào DẢI NÂU trên thành nồi (vệt nước cũ ở
  // đúng mực nước cũ), không chỉ vào một mảng thành trơn: neo đặt đúng lên
  // dải nâu, ở phía bên phải khung nơi dải nâu lộ ra rõ.
  // Đo từ khung: dải nâu ở x=1250 chạy quanh y=495, nên neo là điểm trên
  // mặt phẳng của dải (z=.0185) ở đúng chỗ đó — trước đây neo đặt cao hơn,
  // mũi tên rơi xuống mặt cơm trắng và gọi nhầm sang vật khác.
  //
  // Thẻ này chỉ ở câu c29, KHÔNG ở câu c28: ở c28 lớp cơm đã rơi xuống đáy
  // và mặt cưa của nó (đến cao độ .147) che kín vệt nước cũ (cao độ .118) —
  // mũi tên chỉ vào một hạt cơm, người xem không thấy vệt nước thì thẻ gọi
  // tên vô nghĩa. Ở c29 lớp cơm đã đi khỏi khung, dải nâu lộ ra rõ và mũi
  // tên chạm đúng vào nó.
  //
  // Thẻ "ĐÁY NỒI" thì giữ ở cả c28 và c29: đáy nồi luôn lộ ra ở đáy khung.
  // Câu c28 đọc ra là "nồi cạn nước" bằng cảnh lớp cơm rơi sát đáy, đáy nồi
  // trơn không còn lớp nước nào, và thẻ "ĐÁY NỒI" chỉ vào đúng chỗ đó.
  { id: 'vetnuoc', text: 'VẾT NƯỚC', at: () => [.0641, .1245, .0185], lines: ['c29'], size: 24, hold: 0.5 },
  // Mũi tên ĐÁY NỒI phải chạm vào dải xám của đáy nồi nằm DƯỚI lớp cơm,
  // không chỉ vào đường viền giữa lớp cơm và đáy.
  { id: 'daynnhoi', text: 'ĐÁY NỒI', at: () => [-.055, .052, .002], lines: ['c28', 'c29'], size: 24 },
  // Cùng một câu gọi tên nhưng HAI khung hình, hai toạ độ: thẻ luôn nằm ở
  // bên trên-phải mũi tên, nên mũi tên chỉ vào được đúng vật thì thẻ phải nằm
  // chỗ trống. Ở c38 (cận cảnh thanh lưỡng kim) thẻ nằm cao hơn; Ở c37 (cảnh
  // rộng, thẻ nằm ngay trên dải cam) thẻ phải sát dải cam hơn, không được đè
  // lên cục tiếp điểm màu cam ở mép phải.
  { id: 'luoigkim37', text: 'THANH LƯỠNG KIM', at: () => [.008, .0325, -.070], lines: ['c37'], size: 24, dy: -9 },
  { id: 'luoigkim38', text: 'THANH LƯỠNG KIM', at: () => [.008, .0325, -.070], lines: ['c38'], size: 24, dy: -110 },
  // Đầu mũi tên của nhãn phải chạm vào đèn, nhưng thẻ nhãn luôn nằm ở bên
  // trên-phải mũi tên: neo đúng tâm đèn thì thẻ nằm đè lên đèn. Neo ở mép
  // trên của đèn thì thẻ nằm ngay trên đèn, không đè lên.
  { id: 'dengiao', text: 'ĐÈN BÁO', at: () => LP(BEP.cooker.lamp, 0, .012, 0).toArray(), lines: ['c3'], size: 24 },
  // "NHIỆT ĐỘ" không được chỉ vào con chip — con chip là nơi TÍNH ra con số,
  // còn câu kể là con số đó là nhiệt độ của ĐÁY NỒI. Mũi tên chỉ vào viên
  // cầu đầu dò nhiệt, tức đúng chỗ đo, nằm sát đáy nồi.
  { id: 'nhietdo', text: 'NHIỆT ĐỘ', at: () => [0, .0535, .005], lines: ['c14'], size: 26 },
  // c11 kể HAI con số. Màn hình đồng hồ hiện cả hai ("10 kΩ" và "1 kΩ") nên
  // người xem thấy số tụt xuống ngay trong khung. Chỉ một nhãn thôi — "MỘT
  // KILOÔM" — và nó chỉ hiện từ lúc lời kể sang "khi nóng lên"; trước đó không
  // có nhãn nào, để người xem không phải đoán nhãn nào là nhãn nào.
  // Neo đúng chữ "1" trên màn hình (màn hình nằm ở [0,.050,.021] trong máy đo,
  // canvas 320×200; chữ "1" của hàng dưới nằm ở canvas x≈72…130, y=148):
  // mũi tên chạm vào CON SỐ, không chạm vào khung màn hình.
  { id: 'moikiloo', text: 'MỘT KILOÔM', at: () => [.3058, .1305, .2765], lines: ['c11'], size: 24 },
];
for (const C of CARDS) Object.assign(C, cardWindow(C, V));
// Thẻ "100 °C" ở câu c30 và thẻ "ĐỈNH CỘT" ở câu c31 cùng chỉ vào một cái
// thang nhiệt: thẻ "ĐỈNH CỘT" hiện sớm 0,5 s trước câu c31, nên thẻ "100 °C"
// phải tắt trước đó, không để hai thẻ cùng lúc trên màn hình.
{
  const vt = CARDS.find(c => c.id === 'vuottram');
  vt.t1 = V.L.c30.t1 - 0.55;
}
// câu c11 kể hai con số: đồng hồ đổi số đúng lúc lời kể sang "khi nóng lên"
// (sau câu "lúc mát là mười kiloôm"), và thẻ đổi theo đúng nhịp đó.
// Nhãn hiện ra ở đúng lúc số tụt xuống, và sớm hơn 0,2 s so với lúc số tụt
// trước đây, để nhãn còn đủ thời gian đọc (thẻ vào mất 0,35 s, thẻ ra mất
// 0,2 s, nên phần đọc được ngắn hơn cửa sổ 0,55 s).
{
  const a = V.L.c11, T = a.t0 + 0.84;
  const m = CARDS.find(c => c.id === 'moikiloo');
  m.t0 = T; m.t1 = a.t1;
}

// độ sáng vệt sáng theo từng câu
const FOCUS = {
  c1: 1.0, c2: 1.5, c3: 2.0, c4: 1.2, c5: 1.4, c6: 1.4, c7: 1.2, c8: 1.6, c9: 1.8, c10: 2.0,
  c11: 1.8, c12: 1.6, c13: 1.8, c14: 1.5, c15: 1.1, c16: 1.7, c17: 1.5, c18: 1.8, c19: 2.0, c20: 1.7,
  c21: 2.2, c22: 2.2, c23: 1.2, c24: 1.6, c25: 1.1, c26: 1.4, c27: 1.8, c28: 1.4, c29: 1.8, c30: 2.0,
  c31: 2.2, c32: 1.8, c33: 1.6, c34: 1.7, c35: 2.0, c36: 1.0, c37: 1.0, c38: 1.0, c39: 1.0, c40: 1.1,
  c41: 1.5, c42: 1.7, c43: 1.7, c44: 1.5, c45: 1.8, c46: 1.7, c47: 1.2, c48: 1.6,
};
// Độ sáng vệt sáng theo từng câu. Câu mở nắp cần nồi tối hơn: nắng trưa rọi thẳng
// vào mớ cơm thì cháy trắng, mất hết hạt gạo. Câu siêu cận đỉnh cột thủy ngữ
// cũng vậy: tấm thang chia trắng dưới ánh đèn mạnh thì cháy trắng cả khung,
// mất nét mực và mất nền tối của kênh.
const DIM = { c15: .82, c23: .88, c25: .86, c29: .85, c31: .66, c36: .92, c37: .86, c38: .86, c39: .86, c40: .90, c46: .68, c47: .80, c48: .88 };

function shotAt(t) {
  for (let i = 0; i < SHOTS.length; i++) {
    if (t < MARK[i].t1 || i === SHOTS.length - 1) {
      const s = SHOTS[i];
      const u = clamp((t - MARK[i].t0) / Math.max(.001, MARK[i].t1 - MARK[i].t0));
      const { p, l } = s.pose(u);
      return { sh: s, i, u, pos: p, look: l };
    }
  }
}

// ── trạng thái của vật theo câu đang kể ────────────────────────────────
const inRange = (id, a, b) => { const n = +id.slice(1); return n >= a && n <= b; };

function stateBep(id, t) {
  const B = BEP;
  // vật nào có mặt trong khung
  const oldOn = inRange(id, 36, 39);
  const expOn = inRange(id, 40, 43);
  const advOn = inRange(id, 47, 48);
  B.old.visible = oldOn;
  B.expA.visible = expOn; B.expB.visible = expOn;
  B.wA.visible = expOn; B.wB.visible = expOn;
  B.tA.visible = expOn; B.tB.visible = expOn;
  B.bowl.visible = advOn; B.bag.visible = advOn;

  // đèn báo trên nồi: đỏ khi đang nấu, hổ phách từ lúc chuyển sang giữ ấm
  const k = clamp((t - V.L.c3.t0) / 1.4);
  B.cooker.setIndicator(id === 'c1' || id === 'c2' ? 'red' : (k >= 1 ? 'amber' : 'red'));
  // hơi nước: dày lúc đang nấu, mỏng đi rồi tắt hẳn; ở câu c44 nồi đã chuyển
  // sang giữ ấm nên vẫn còn một sợi hơi mỏng bay lên từ lỗ nắm.
  // Ở c6 KHÔNG có hơi nước: câu c4 đã nói "tiếng sôi tắt hẳn" và khung c5
  // hoàn toàn không có hơi, câu c6 lại bốc hơi lên thì hình phủ định lại câu
  // trước. Câu c6 nói về nhiệt, nên hình của nó là cái đèn hổ phách.
  let steam = id === 'c1' ? 1 : id === 'c2' ? .85 : id === 'c3' ? .85 * (1 - k) : id === 'c44' ? .30 : 0;
  // nắp: đóng cho tới câu mở nắp
  if (id === 'c46') {
    const kk = clamp((t - V.L.c46.t0) / 1.0);
    B.cooker.setLid(kk);
    steam = kk > .12 ? .55 * (1 - kk) : 0;
  } else if (id === 'c47' || id === 'c48') {
    B.cooker.setLid(1);
  } else {
    B.cooker.setLid(0);
  }
  B.cooker.setSteam(steam, t);
  // cơm trong nồi: nở ra khi đã chín
  B.rice.setCooked(id === 'c46' || id === 'c47' || id === 'c48' ? 1 : .25);

  // bàn tay: rót nước ở hai câu thí nghiệm, nâng nắp ở câu mở nồi
  const pourOn = id === 'c40' || id === 'c41';
  B.handRig.visible = pourOn;
  B.handLid.visible = id === 'c46';
  B.pourCup.visible = pourOn;
  B.streamMesh.visible = pourOn;
  B.splash.visible = pourOn;
  if (pourOn) {
    const left = id === 'c40';
    const potX = left ? .62 : 1.24;
    const kk = clamp((t - V.L[id].t0) / (V.L[id].t1 - V.L[id].t0));
    // tay cầm bát úp ngược trên miệng nồi: ngón tay chỉ thẳng xuống, mu bàn tay
    // quay về phía máy quay để người xem thấy rõ đó là bàn tay
    B.handRig.position.set(potX + .05, .54, .92);
    B.handRig.rotation.set(0, .35, -1.57);
    B.hand.pose(.62, .30);
    B.pourCup.setWater(false);
    // dòng nước: từ miệng bát rơi xuống mặt nước trong nồi, một vệt nước có bề dày
    B.pourCup.updateWorldMatrix(true, false);
    const rim = B.pourCup.localToWorld(new THREE.Vector3(0, B.pourCup.rim ?? .070, 0));
    const lvl = left ? lerp(.085, .138, kk) : lerp(.085, .110, kk);
    const to = new THREE.Vector3(potX, lvl, .82);
    B.setStream(rim, to);
  } else if (id === 'c46') {
    // bàn tay nắm núm nắp: bàn tay gắn thẳng vào núm (xem set.js), nên nó đi theo
    // vòng bản lề khi nắp mở, không trôi ra khỏi chỗ
  }

  // đồng hồ trên tường: chạy bình thường, ở c27 thì chạy thật nhanh
  B.setHour(id === 'c27' ? 8 + (t - V.L.c27.t0) * 6 : 8 + (t / 60) * .02);
  // vệt nắng trượt trên tường: chỉ ở câu về đồng hồ. Kim đồng hồ quay nhanh
  // nhưng chỉ là một sợi mảnh, người xem không thấy thời gian trôi; vệt nắng
  // chạy qua tường và qua mặt đồng hồ thì thấy rõ.
  if (id === 'c27') {
    const kk = clamp((t - V.L.c27.t0) / Math.max(.001, V.L.c27.t1 - V.L.c27.t0));
    B.setSunPatch(1, 1.05 + kk * 1.45);
  } else {
    B.setSunPatch(0, 1.05);
  }

  // hai nồi thí nghiệm: nồi trái nhiều nước, nồi phải ít nước nên cạn trước
  if (expOn) {
    const kk = clamp((t - V.L[id].t0) / (V.L[id].t1 - V.L[id].t0));
    const dry = id === 'c42' || id === 'c43';
    if (id === 'c40') { B.wA.setLevel(lerp(.085, .130, kk)); B.wB.setLevel(.085); }
    else if (id === 'c41') { B.wA.setLevel(.130); B.wB.setLevel(lerp(.085, .108, kk)); }
    // câu "nồi bên phải cạn nước trước": mực nước phải tụt thật, tới đáy
    // rồi mới tắt hẳn — nước không được biến mất bằng một cú cắt giữa
    // khung, vì lúc đó người xem thấy nước bốc hơi chứ không thấy nồi cạn.
    else if (id === 'c42') { B.wA.setLevel(.130); B.wB.setLevel(lerp(.100, .063, Math.min(1, Math.max(0, (kk - .10) / .78)))); }
    else { B.wA.setLevel(.130); B.wB.setLevel(.062); }
    B.wA.setBoil(id === 'c41' || dry ? 1 : 0);
    B.wB.setBoil(id === 'c41' ? 1 : 0);
    // Nồi phải đã cạn thì nước phải biến mất hẳn: một vũng nước còn lại ở
    // đáy nồi làm nồi trông như còn nước, và câu "nồi bên phải cạn nước trước"
    // sẽ không đúng.
    if (id === 'c42') B.wB.visible = kk < .92;
    else if (id === 'c43') B.wB.visible = false;
    B.tA.setTemp(100);
    B.tB.setTemp(dry ? 108 : 100);
    B.expA.setLamp('red'); B.expB.setLamp(dry ? 'amber' : 'red');
    B.expA.setHeat(.8); B.expB.setHeat(dry ? 0 : .8);
  }
}

function stateCat(id, t) {
  const C = CAT;
  // từ c29 nước đã cạn; ở những câu kể cơ chế dưới đáy thì nước và gạo không vào khung
  const dry = inRange(id, 29, 45);
  const water = !inRange(id, 7, 16) && !dry;
  C.water.visible = water;
  // lớp gạo nằm trên lớp nước; khi nước cạn hết thì gạo rơi xuống đáy nồi
  C.rice.visible = !inRange(id, 7, 14) && id !== 'c16' && id !== 'c29' && id !== 'c45';
  // câu c45 ("nó biết nước đã cạn") phải thấy đáy nồi khô: lớp cơm đã cạn nằm
  // sát đáy (đúng như LOOK c45) và trên thành còn vệt nước ở đúng mực nước cũ.
  // Một nồi trống trơn thì người xem không thấy đáy nồi ở đâu cả.
  C.riceDry.visible = id === 'c45';
  const dryK = id === 'c28' ? clamp((t - V.L.c28.t0) / (V.L.c28.t1 - V.L.c28.t0)) : (dry ? 1 : 0);
  // ở câu "nước trong nồi cạn hết", nước phải tụt nhanh để giữa câu đã thấy rõ
  // là nồi cạn; lớp cơm rơi theo mặt nước xuống đáy nồi, và khi nước đã cạn
  // hẳn thì dưới lớp gạo không còn lớp nước nào
  const dryK2 = id === 'c28' ? Math.min(1, dryK * 2.2) : dryK;
  C.rice.position.y = lerp(.118, .060, dryK2);
  if (id === 'c28') {
    C.water.setLevel(lerp(.118, .0605, dryK2));
    if (dryK2 >= .96) C.water.visible = false;
  }
  // ở hai câu đầu của cảnh cưa và ở câu dây điện trở, nồi trong được bỏ đi, để thấy
  // trọn mâm nhiệt tròn, dây điện trở xoắn quanh vành và viên cầu ở chính giữa
  C.dev.potCut.visible = id !== 'c7' && id !== 'c8' && id !== 'c16';
  // vòng dây điện trở quanh vành: ở ba câu kể về hai dây mảnh thì vòng đỏ này
  // che mất đúng thứ cần kể, nên ẩn đi
  C.dev.setCoil(!(id === 'c12' || id === 'c13' || id === 'c32'));
  // vệt nước còn lại trên thành nồi: hiện ở câu "nước đã cạn hết" và ở câu
  // "nó biết nước đã cạn" — cùng một vệt ở đúng mực nước cũ. Câu "không còn
  // gì để hấp nhiệt" cũng phải thấy vệt này: đáy nồi trơn chỉ đọc ra là đáy
  // nồi khô khi có dấu vết của mực nước cũ ở ngay trên đó.
  C.vethnuoc.visible = id === 'c45' || id === 'c28' || id === 'c29';
  // hạt gạo bị cưa phóng to: chỉ hai câu cận hạt mới có mặt trong khung
  C.grain.visible = id === 'c21' || id === 'c22';
  // dòng hạt nước chạy vào hạt gạo: chỉ ở câu "nước thì bị hút vào hạt gạo"
  C.absorb.visible = id === 'c22';
  // ở câu "nước bị hút vào hạt", hạt phải chạm mặt nước, không trôi lơ lửng
  // phía trên; ở câu hồ hóa thì hạt nằm giữa lớp gạo cho thấy tinh bột
  C.grain.position.y = id === 'c22' ? .1218 : .1245;
  // ở hai câu cận hạt gạo, ẩn các hạt rời để hạt cưa đứng ra
  C.rice.grains.visible = id !== 'c21' && id !== 'c22';
  // ở hai câu cận hạt, máy vào sát mặt cưa: mặt cưa phải là hạt thật có bóng
  // đổ, không phải hạt vẽ trên một tấm phẳng. Ở các khung rộng, hạt thật bé
  // quá, viền mực của chúng dính thành một mảng đen — nên dùng vân vẽ.
  if (C.rice.setCutDetail) C.rice.setCutDetail(id === 'c21' || id === 'c22');
  C.thermo.visible = inRange(id, 18, 27) || inRange(id, 30, 31) || id === 'c35';
  C.water.setBoil(inRange(id, 18, 25) && id !== 'c21' && id !== 'c22' ? 1 : 0);
  C.heat.visible = id === 'c16' || id === 'c17' || id === 'c34';
  // Dải sáng chỉ lên ở hai câu kể về nó (c32, c33). Ở câu c12 người xem phải
  // thấy HAI DÂY mảnh đỏ chạy lên bo; dải sáng bật sớm thì câu đó không còn
  // hình riêng, và c12 với c32 thành hai khung giống nhau.
  C.signal.visible = inRange(id, 32, 33);
  C.meter.visible = id === 'c11';
  C.steam.visible = id === 'c18' || id === 'c19';
  // đèn nhỏ trước bo mạch: chỉ bật ở câu nhìn vào chip
  C.chipLight.intensity = 0;

  // dây điện trở: nóng lúc nấu, tắt lúc nước cạn, bật tắt lúc giữ ấm
  const heatK = inRange(id, 16, 27) ? 1 : (inRange(id, 28, 33) ? .15 : (id === 'c34' ? .55 : .2));
  C.dev.setHeat(heatK);
  // nhiệt kế: ở vạch sôi, rồi vượt lên trên một trăm độ, rồi tụt về bảy mươi
  const temp = id === 'c30' || id === 'c31' ? 112 : id === 'c35' ? 70 : 100;
  C.thermo.setTemp(temp);
  // làn nhiệt: mỏng dần khi nồi chuyển sang giữ ấm
  C.heat.update(t, id === 'c16' ? .2 : id === 'c17' ? .7 : id === 'c34' ? .3 : 1);
  // Dải sáng phải chạy trọn dọc theo dây: giấu bớt các đám sáng thì dải sáng
  // đứt thành vài chấm rời rạc, người xem không thấy nó chạy trên dây.
  C.signal.update(t, 1);
  // dòng nước hút vào hạt cũng phải được cập nhật mỗi khung hình, nếu không
  // các hạt nước đứng yên ở gốc toạ độ và dòng hút nước không có trong hình
  if (C.absorb.visible && C.absorb.update) C.absorb.update(t, 1);
  C.steam.update(t, 1);
  // gạo: nở ra khi cơm chín
  if (C.rice.setCooked) C.rice.setCooked(inRange(id, 23, 27) ? 1 : .35);
  if (C.riceDry.setCooked) C.riceDry.setCooked(1);
  // cầu đo điện trở: màn hình hiện CẢ HAI số (mười kiloôm lúc mát, một kiloôm
  // khi nóng), số đang đo thì sáng, số kia mờ — người xem thấy số tụt xuống
  // ngay trong khung, chứ không phải chờ câu sau mới thấy.
  if (id === 'c11') {
    const live = t - V.L.c11.t0 < .84 ? '10 kΩ' : '1 kΩ';
    if (C.meter.setReadings) C.meter.setReadings('10 kΩ', '1 kΩ', live);
    else C.meter.setReading(live);
  }
}

function stateCu(id, t) {
  const U = CU;
  // Thanh lưỡng kim cong dần, bấm tách tiếp điểm, dây điện trở tắt.
  // Cong tới hết cỡ đúng lúc tiếng "cạch" (119.82) chứ không phải hết câu
  // trước (119.22): tiếp điểm phải còn khép cho tới khi thanh cong đủ độ,
  // và tia lửa chỉ lóe lúc hai đầu rời nhau.
  const k = clamp((t - V.L.c38.t0) / (119.82 - V.L.c38.t0));
  U.old.setHeat(k);
}

// ── âm thanh ────────────────────────────────────────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });
const amb = (kind, t0, t1) => ev('amb', t0, { kind, t1: +t1.toFixed(3) });

amb('room', 0, 22.51);
amb('low', 22.51, 40.09);
amb('hum', 40.09, 59.74);
amb('low', 59.74, 91.04);
amb('hum', 91.04, 110.61);
amb('low', 110.61, 121.76);
amb('room', 121.76, 138.94);
amb('room', 138.94, V.end);

for (const [t, cue] of [[0, 'A'], [22.51, 'B'], [40.09, 'C'], [59.74, 'D'],
  [91.04, 'E'], [110.61, 'F'], [121.76, 'G'], [138.94, 'end']])
  ev('music', t, { cue });

// foley: chỉ ở chỗ có vật thật sự kêu.
// Tên sự kiện phải là tên tiếng có thật trong core/audio/foley.py (hoặc trong FX
// của mix.py của kênh): một tên không có tiếng làm mix.py dừng cả phim lúc trộn.
ev('whoosh_soft', 2.40, { v: .45 });     // nồi bắt đầu sôi
ev('whoosh_soft', 10.10, { v: .35 });
ev('blip_up', 12.60, { v: .35 });       // đèn báo chuyển sang hổ phách
ev('blip_down', 13.93, { v: .45 });     // tiếng sôi tắt hẳn
ev('blip_up', 31.98, { v: .25 });
ev('blip_up', 42.69, { v: .30 });       // mạch điện đo
ev('blip_down', 91.04, { v: .40 });     // nhiệt độ nhảy vọt
ev('blip_up', 94.69, { v: .40 });       // đó là tín hiệu
ev('blip_down', 99.56, { v: .40 });     // dây điện trở tắt
ev('blip_up', 103.11, { v: .25 });      // bật tắt lúc giữ ấm
ev('switch', 112.75, { v: .40 });       // nút bấm cơ của nồi đời đầu
ev('blip_down', 119.82, { v: .40 });    // mạch mở, dây điện trở tắt
ev('pour', 122.40, { v: .40 });         // rót nhiều nước vào nồi trái
ev('pour', 125.60, { v: .30 });         // rót ít nước vào nồi phải
ev('blip_up', 128.20, { v: .35 });      // đèn báo sang giữ ấm
ev('whoosh_soft', 139.40, { v: .50 });  // bàn tay mở nắp
ev('whoosh_hard', 140.10, { v: .55 });  // hơi nước bùng ra
ev('cup_set', 144.20, { v: .35 });      // bát đong nước đặt xuống

// ── mốc nhịp ────────────────────────────────────────────────────────────
for (const id of Object.keys(V.L)) {
  const t0 = V.L[id].t0, t1 = V.L[id].t1, tm = (t0 + t1) / 2;
  const s = shotAt(tm);
  const C = CARDS.find(c => c.lines.includes(id));
  const at = C ? (typeof C.at === 'function' ? C.at(tm) : C.at) : s.look;
  camera.fov = s.sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  const [x, y] = toScreen(new THREE.Vector3(...at), camera);
  markBeat(ev, id, t0, +(t1 - t0).toFixed(3), [+x.toFixed(1), +y.toFixed(1)]);
}

window.DUR = V.end;
window.EV = EV;

window.render = t => {
  const s = shotAt(t);
  const shot = s.sh, id = shot.ids[0];
  camera.fov = shot.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();

  if (shot.s === 'N1') {
    stateBep(id, t);
    // vệt sáng đặt vào điểm đang kể, đứng ở phía máy quay để vật đổ bóng về phía sau
    const fx = FOCUS[id] ?? 1.0;
    const fwd = new THREE.Vector3(s.look[0] - s.pos[0], 0, s.look[2] - s.pos[2]).normalize();
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    // câu về đồng hồ: vệt sáng phải rộng và mờ, nếu không mép vệt sáng lọt vào
    // khung thành một mảng sáng hình chữ nhật dán trên tường
    const wide = id === 'c27';
    const rx = wide ? 1.90 : .70, fz = wide ? 1.40 : .30;
    BEP.spot.target.position.set(s.look[0], s.look[1], s.look[2]);
    if (wide) {
      // đèn từ trước-trên-trái: đồng hồ đổ bóng xuống tường bên phải, các lọ
      // trên kệ cũng đổ bóng. Đèn đặt bên phải sẽ ném bóng đồng hồ sang trái,
      // tách thành một vệt tối lơ lửng không giống bóng của nó.
      BEP.spot.position.set(s.look[0] - 1.00, s.look[1] + 1.10, s.look[2] + 1.10);
    } else {
      BEP.spot.position.set(
        s.look[0] + right.x * rx - fwd.x * fz,
        s.look[1] + (wide ? 1.05 : 1.15),
        s.look[2] + right.z * rx - fwd.z * fz);
    }
    // câu về đồng hồ trên tường: đèn chính ngắm vào đồng hồ để nó đổ bóng lên tường
    BEP.aimKey(id === 'c27' ? new THREE.Vector3(1.80, 1.58, .03) : BEP.focus);
    BEP.update(t, { dim: DIM[id] ?? 1, focus: fx, exp: inRange(id, 40, 43) ? 1 : 0, open: (id === 'c46' || id === 'c47' || id === 'c48') ? 1 : (id === 'c44' ? .5 : 0) });
  } else if (shot.s === 'N2') {
    stateCat(id, t);
    const fx = FOCUS[id] ?? 1.0;
    CAT.spot.target.position.set(s.look[0], s.look[1], s.look[2]);
    CAT.spot.position.set(
      s.look[0] * .35 + .55, s.look[1] + .70, s.look[2] * .35 + .95);
    CAT.update(t, { dim: DIM[id] ?? 1, focus: fx });
  } else {
    stateCu(id, t);
    const fx = FOCUS[id] ?? 1.0;
    CU.spot.target.position.set(s.look[0], s.look[1], s.look[2]);
    CU.spot.position.set(s.look[0] * .4 + .45, s.look[1] + .60, s.look[2] * .4 + .85);
    CU.update(t, { dim: DIM[id] ?? 1, focus: fx });
  }

  const set2 = setOf[shot.s];
  F.frame(set2.scene, {
    t, thick: 3.4, ref: 1.6, key: set2.key,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    overlay: (g, tt) => {
      const out = [];
      const s2 = V.sub(tt);
      if (s2) subtitle(g, s2);
      for (const C of CARDS) {
        const size = C.size ?? 40;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const [ax, ay] = toScreen(new THREE.Vector3(...(typeof C.at === 'function' ? C.at(tt) : C.at)), camera);
        let x = ax + bw / 2 + 26 + (C.dx || 0), y = ay - bh / 2 - 44 + (C.dy || 0);
        x = clamp(x, bw / 2 + 30, 1916 - bw / 2);
        y = clamp(y, bh / 2 + 8, 876 - bh / 2 - 48);
        const b = label(g, C.text, x, y, tt, C.t0, C.t1, { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

// chẩn đoán
window.WORLD = () => {
  const wp = o => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v.toArray().map(n => +n.toFixed(3)); };
  return {
    cooker: wp(BEP.cooker), lamp: wp(BEP.cooker.lamp), clock: wp(BEP.clock),
    bowl: wp(BEP.bowl), bag: wp(BEP.bag), old: wp(BEP.old),
    expA: wp(BEP.expA), expB: wp(BEP.expB),
    bead: wp(CAT.dev), thermo: wp(CAT.thermo), grain: wp(CAT.grain),
    bimetal: wp(CU.old),
  };
};
window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.pos.map(v => +v.toFixed(3)), look: s.look.map(v => +v.toFixed(3)),
    mark: MARK.map(m => [+m.t0.toFixed(2), +m.t1.toFixed(2)]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };window.__THREE = THREE; window.__cam = camera; window.__pick = t => setOf[shotAt(t).sh.s];
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
