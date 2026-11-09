// shots.js — bảng nhát của tập 06: 43 nhát, đúng thứ tự câu lời kể.
//
// pos/look: vị trí máy và điểm nhìn. d: máy trượt trong nhát (luôn có lý do ở cột
// "Vì sao" của TREATMENT.md). Mỗi nhất ứng với đúng một câu trong voice/lines.json.
//
// Nơi chốn: N1 bếp buổi sáng · N2 trong tờ giấy · N3 bàn đo ban đêm.
export const SHOTS = [
  // ── N1: bếp ──
  // Tay ướt đè tờ giấy: máy phải thấy **cả tay lẫn tờ giấy**, nên nó đứng lùi
  // hơn, chứ không áp vào mép giấy.
  { ids: ['c1'], s: 'N1', pos: [-.78, .28, 1.20], look: [-.92, .03, .82], fov: 31, d: [.01, 0, -.02] },
  { ids: ['c2'], s: 'N1', pos: [-.86, .19, 1.06], look: [-.90, .012, .82], fov: 25, d: [-.01, 0, -.02] },
  // Tay khô đặt lên tờ khô: máy áp sát tờ khô và bàn tay, để người xem thấy
  // rõ tờ giấy **không** rách — tờ ướt không vào khung.
  { ids: ['c3'], s: 'N1', pos: [-.18, .22, 1.08], look: [-.46, .02, .86], fov: 26, d: [-.01, 0, -.01] },
  // "Nước mới là thủ phạm": máy nhìn **xuống bát nước** — nước nằm trong bát,
  // tay ướt ở mép bát; bát là vật chính của khung này.
  { ids: ['c4'], s: 'N1', pos: [-.95, .20, 1.20], look: [-1.18, .03, .92], fov: 26, d: [-.01, 0, -.02] },
  // "Kéo nhẹ là đứt": tay kéo mép tờ ướt — máy đứng gần tay, tờ giấy ở góc
  // khung, để người xem thấy tay kéo chứ không thấy một tờ giấy đứng yên.
  { ids: ['c5'], s: 'N1', pos: [-.66, .42, 1.02], look: [-.82, .16, .88], fov: 24, d: [.02, 0, -.02] },
  // Câu hỏi: máy đứng sau bát nước, nhìn qua bát ra tờ giấy đã rách — nước
  // ở tiền cảnh, tờ giấy ở giữa khung.
  { ids: ['c6'], s: 'N1', pos: [-1.30, .13, 1.10], look: [-1.02, .015, .87], fov: 28, d: [0, 0, -.02] },
  { ids: ['c7'], s: 'N1', pos: [-.84, .22, 1.14], look: [-.90, .015, .82], fov: 30, d: [-.05, -.03, -.16] },
  { ids: ['c8'], s: 'N1', pos: [-.90, .13, 1.02], look: [-.90, .010, .82], fov: 27, d: [-.02, -.02, -.30] },
  // ── N2: trong tờ giấy ──
  // Mạng sợi nằm trong mặt phẳng XY, quanh gốc toạ độ; máy đứng ở +z.
  { ids: ['c9'], s: 'N2', pos: [0, .12, 1.00], look: [0, .005, .14], fov: 34, d: [0, 0, -.04] },
  { ids: ['c10'], s: 'N2', pos: [-.26, .09, .62], look: [-.10, .005, .13], fov: 26, d: [.02, 0, -.02] },
  { ids: ['c11'], s: 'N2', pos: [.10, .10, .62], look: [.02, .004, .16], fov: 30, d: [-.01, 0, -.015] },
  { ids: ['c12'], s: 'N2', pos: [-.05, .10, .70], look: [.02, .00, .15], fov: 32, d: [0, 0, -.04] },
  // "Nước tới": máy áp vào đúng chỗ hai phân tử nước dừng lại — chúng bay vào
  // và ghép vào nhau ngay trong câu này, nên khung phải đủ gần để thấy chúng.
  { ids: ['c13'], s: 'N2', pos: [-.14, .12, .78], look: [.02, .01, .16], fov: 34, d: [0, 0, -.012] },
  { ids: ['c14'], s: 'N2', pos: [.12, .11, .62], look: [.03, .01, .16], fov: 28, d: [0, 0, -.01] },
  // "Các phân tử nước chen vào đúng chỗ các nhóm hydroxyl": chỗ chạm thứ hai
  // của mạng (hai sợi khác chỗ câu mười một), có một phân tử nước đã tới.
  { ids: ['c15'], s: 'N2', pos: [.10, .13, .58], look: [.02, .02, .16], fov: 26, d: [0, 0, -.012] },
  { ids: ['c16'], s: 'N2', pos: [-.18, .06, .60], look: [.00, .005, .15], fov: 30, d: [0, 0, -.012] },
  // "Sợi cũng phồng lên": máy áp vào một đoạn sợi trơn (không có móc nối),
  // để thấy sợi **to ra** chứ không thấy lại cái móc.
  { ids: ['c17'], s: 'N2', pos: [-.22, -.02, .52], look: [-.22, -.03, .12], fov: 26, d: [0, 0, -.012] },
  // "Hai sợi bám lỏng dần": máy nhìn chỗ hai sợi chạm nhau lúc đang rời ra —
  // khe hở mở ra ở giữa, móc nối ở chỗ cũ đã tắt.
  { ids: ['c18'], s: 'N2', pos: [.08, .07, .56], look: [.02, .00, .15], fov: 28, d: [0, 0, -.012] },
  { ids: ['c19'], s: 'N2', pos: [.14, .09, .66], look: [.02, -.01, .16], fov: 30, d: [-.03, 0, -.02] },
  // "Nó nức lan ra": vệt nứt mở ra ở chỗ hai sợi chạm nhau.
  { ids: ['c20'], s: 'N2', pos: [.00, .04, .54], look: [.01, .00, .16], fov: 24, d: [.02, 0, -.015] },
  // "Nó nức lan ra": máy áp vào vệt nứt đang lan — vệt nứt là vật chính.
  { ids: ['c21'], s: 'N2', pos: [.08, .04, .50], look: [.01, -.02, .16], fov: 22, d: [0, 0, -.010] },
  // "Nước không cắt đứt sợi": máy lùi ra, thấy **cả** vệt nứt lẫn sợi vẫn
  // chạy qua không đứt — nứt là khe giữa hai sợi, không phải sợi bị cắt.
  { ids: ['c22'], s: 'N2', pos: [.22, .12, .70], look: [.02, -.02, .16], fov: 32, d: [0, 0, -.02] },
  { ids: ['c23'], s: 'N2', pos: [0, .34, 1.25], look: [0, .04, .14], fov: 38, d: [0, 0, .10] },
  // ── N3: bàn đo ──
  // Trục bàn: giá kẹp ở -.35 (vạt ngang chìa tới kẹp ở -.205, cao .50) · dải
  // giấy treo từ .49 xuống .29 · lực kế ở -.205, cao .235 · bát nước ở -.02 ·
  // đồng hồ độ ẩm ở .35 · mẻ giấy khăn ở .51 · túi giấy ở .65 · tờ giấy đã sấy ở .35.
  { ids: ['c24'], s: 'N3', pos: [.16, .62, 2.00], look: [-.15, .20, .98], fov: 38, d: [.01, 0, -.03] },
  { ids: ['c25'], s: 'N3', pos: [-.10, .44, 1.55], look: [-.175, .35, .94], fov: 28, d: [-.04, 0, -.03] },
  // "Kéo từ từ cho tới khi nó gãy": máy áp vào dải giấy thử và mặt thang lực
  // kế, để người xem thấy kim dâng lên cùng lúc dải giấy bị kéo.
  { ids: ['c26'], s: 'N3', pos: [-.10, .28, 1.25], look: [-.175, .235, .94], fov: 26, d: [-.02, 0, -.02] },
  { ids: ['c27'], s: 'N3', pos: [.00, .20, 1.34], look: [-.012, .065, 1.09], fov: 28, d: [0, 0, -.02] },
  { ids: ['c28'], s: 'N3', pos: [.01, .12, 1.28], look: [-.012, .062, 1.09], fov: 30, d: [0, 0, -.01] },
  // "Chín mươi phần trăm độ ẩm": máy lùi ra, đồng hồ độ ẩm (có thẻ 90 %) ở
  // góc phải, lực kế và dải giấy ở bên trái — người xem thấy cả hai mặt thang.
  { ids: ['c29'], s: 'N3', pos: [-.09, .20, 1.72], look: [-.09, .14, 1.02], fov: 34, d: [-.04, -.02, -.02] },
  // "Độ giãn cũng tăng": máy sang bên kẹp, thước kẻ vạch đứng cạnh dải giấy,
  // để đầu dải giấy đi qua từng vạch một là câu có hình riêng.
  { ids: ['c30'], s: 'N3', pos: [-.09, .36, 1.40], look: [-.15, .30, .92], fov: 28, d: [0, 0, -.02] },
  { ids: ['c31'], s: 'N3', pos: [.16, .55, 1.95], look: [-.12, .22, .96], fov: 36, d: [0, 0, -.03] },
  { ids: ['c32'], s: 'N3', pos: [.45, .45, 2.05], look: [.30, .15, 1.10], fov: 42, d: [0, 0, -.03] },
  { ids: ['c33'], s: 'N3', pos: [.10, .40, 1.50], look: [-.15, .32, .94], fov: 30, d: [.01, 0, -.02] },
  // "Ba đến mười phần trăm độ bền khô": máy nhìn **dải giấy ướt đang rách** —
  // vết rách nằm ở mép trên, nên máy lệch sang trái để mép rách và thẻ
  // "3–10 %" nằm chung một góc phải, còn cây thước đứng sau làm mốc cho
  // dải giấy. Dải giấy nằm ở nửa phải khung, không phải ở giữa.
  { ids: ['c34'], s: 'N3', pos: [-.06, .40, 1.45], look: [-.175, .33, .94], fov: 30, d: [-.02, 0, -.02] },
  // "Thấp hơn mười lăm phần trăm": máy lùi sang **phải** để mặt lực kế rơi
  // vào nửa trái khung — khung đối lập hẳn với nhát dải giấy ướt ở trên, và
  // kim đỏ đứng gần vạch không (dải giấy ướt rách trước khi lực kế kịp đọc).
  { ids: ['c35'], s: 'N3', pos: [.02, .34, 1.58], look: [-.175, .30, .94], fov: 30, d: [0, 0, -.012] },
  // "Thêm nhựa vào lúc ép": máy chỉ vào **hai vật của ngành** trên bàn — túi
  // bao bì dạng phẳng đứng trong giá, mẻ giấy khăn phía sau — thay vì cầm lực
  // kế (máy đo) làm vật chính.
  { ids: ['c36'], s: 'N3', pos: [.70, .26, 1.30], look: [.66, .04, .88], fov: 28, d: [0, 0, -.02] },
  // Góc giấy khăn bị cắt, lộ móc nối màu hồng: máy áp sát mặt bàn.
  { ids: ['c37'], s: 'N3', pos: [.52, .13, 1.02], look: [.45, .015, .71], fov: 20, d: [-.01, 0, -.01] },
  // "Một số loại khăn giấy và túi giấy": máy **lùi ra** — mẻ khăn giấy và túi
  // giấy cùng vào khung, ở trước là góc giấy khăn bị cắt lộ móc nối hồng
  // như ở dòng 37, và đêm mở ra phía sau.
  { ids: ['c38'], s: 'N3', pos: [.64, .26, 1.45], look: [.58, .05, .85], fov: 32, d: [0, 0, -.02] },
  // "Tờ giấy thường đã qua nước rồi sấy": máy hạ thấp gần mặt bàn, nhìn
  // ngang qua **hai tờ giấy cạnh nhau** — tờ đã sấy (nhăn, vệt ẩm còn hằn) và
  // tờ tươi (phẳng) — thay vì một toàn cảnh bàn đã xem ở câu trước.
  { ids: ['c39'], s: 'N3', pos: [.40, .22, 1.20], look: [.35, .02, .57], fov: 28, d: [0, 0, -.02] },
  { ids: ['c40'], s: 'N3', pos: [.18, .26, 1.12], look: [.34, .02, .57], fov: 26, d: [-.02, 0, -.02] },
  { ids: ['c41'], s: 'N3', pos: [.34, .18, .98], look: [.36, .015, .57], fov: 22, d: [0, 0, -.012] },
  // ── N1: lời chốt ──
  { ids: ['c42'], s: 'N1', pos: [-.56, .26, 1.16], look: [-.52, .03, .85], fov: 30, d: [-.02, 0, -.02] },
  { ids: ['c43'], s: 'N1', pos: [-.70, .44, 1.52], look: [-.76, .03, .83], fov: 36, d: [0, 0, -.03] },
];
