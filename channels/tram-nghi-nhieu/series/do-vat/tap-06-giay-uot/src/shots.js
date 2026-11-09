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
  { ids: ['c9'], s: 'N2', pos: [0, .10, .98], look: [0, 0, .12], fov: 34, d: [0, 0, -.04] },
  { ids: ['c10'], s: 'N2', pos: [-.30, .11, .66], look: [-.10, .01, .13], fov: 26, d: [.02, 0, -.02] },
  { ids: ['c11'], s: 'N2', pos: [.08, .09, .50], look: [.01, .00, .16], fov: 21, d: [-.01, 0, -.015] },
  { ids: ['c12'], s: 'N2', pos: [0, .10, .92], look: [0, 0, .14], fov: 36, d: [0, 0, -.04] },
  // "Nước tới": máy áp vào đúng chỗ hai phân tử nước dừng lại — chúng bay vào
  // và ghép vào nhau ngay trong câu này, nên khung phải đủ gần để thấy chúng.
  { ids: ['c13'], s: 'N2', pos: [-.05, .03, .33], look: [-.045, .03, .175], fov: 22, d: [0, 0, -.012] },
  { ids: ['c14'], s: 'N2', pos: [.06, .09, .50], look: [-.02, .012, .17], fov: 26, d: [0, 0, -.01] },
  // "Các phân tử nước chen vào đúng chỗ các nhóm hydroxyl": chỗ chạm thứ hai
  // của mạng (hai sợi khác chỗ câu mười một), có một phân tử nước đã tới.
  { ids: ['c15'], s: 'N2', pos: [.14, .17, .42], look: [.02, .11, .17], fov: 22, d: [0, 0, -.012] },
  { ids: ['c16'], s: 'N2', pos: [.05, .07, .42], look: [.00, .00, .17], fov: 19, d: [0, 0, -.012] },
  // "Sợi cũng phồng lên": máy áp vào một đoạn sợi trơn (không có móc nối),
  // để thấy sợi **to ra** chứ không thấy lại cái móc.
  { ids: ['c17'], s: 'N2', pos: [-.26, -.02, .40], look: [-.24, -.06, .12], fov: 20, d: [0, 0, -.012] },
  // "Hai sợi bám lỏng dần": máy nhìn chỗ hai sợi chạm nhau lúc đang rời ra —
  // khe hở mở ra ở giữa, móc nối ở chỗ cũ đã tắt.
  { ids: ['c18'], s: 'N2', pos: [.10, .06, .44], look: [.02, .00, .15], fov: 22, d: [0, 0, -.012] },
  { ids: ['c19'], s: 'N2', pos: [.16, .08, .58], look: [.03, -.01, .16], fov: 25, d: [-.03, 0, -.02] },
  // "Nó nức lan ra": vệt nứt mở ra ở chỗ hai sợi chạm nhau.
  { ids: ['c20'], s: 'N2', pos: [-.02, .03, .42], look: [-.01, .00, .16], fov: 20, d: [.02, 0, -.015] },
  // "Nó nức lan ra": máy áp vào vệt nứt đang lan — vệt nứt là vật chính.
  { ids: ['c21'], s: 'N2', pos: [.09, .03, .38], look: [.01, -.02, .16], fov: 18, d: [0, 0, -.010] },
  // "Nước không cắt đứt sợi": máy lùi ra, thấy **cả** vệt nứt lẫn sợi vẫn
  // chạy qua không đứt — nứt là khe giữa hai sợi, không phải sợi bị cắt.
  { ids: ['c22'], s: 'N2', pos: [.24, .11, .62], look: [.02, -.02, .16], fov: 30, d: [0, 0, -.02] },
  { ids: ['c23'], s: 'N2', pos: [0, .34, 1.25], look: [0, .04, .14], fov: 38, d: [0, 0, .10] },
  // ── N3: bàn đo ──
  // Trục bàn: giá kẹp ở -.35 (vạt ngang chìa tới kẹp ở -.205, cao .50) · dải
  // giấy treo từ .49 xuống .29 · lực kế ở -.205, cao .235 · bát nước ở -.02 ·
  // đồng hồ độ ẩm ở .35 · mẻ giấy khăn ở .51 · túi giấy ở .65 · tờ giấy đã sấy ở .35.
  { ids: ['c24'], s: 'N3', pos: [.20, .56, 2.00], look: [.12, .07, .92], fov: 40, d: [.01, 0, -.03] },
  { ids: ['c25'], s: 'N3', pos: [.10, .46, 1.62], look: [-.20, .36, .95], fov: 30, d: [-.04, 0, -.03] },
  // "Kéo từ từ cho tới khi nó gãy": máy áp vào dải giấy thử và mặt thang lực
  // kế, để người xem thấy kim dâng lên cùng lúc dải giấy bị kéo.
  { ids: ['c26'], s: 'N3', pos: [.06, .34, 1.00], look: [-.17, .26, .95], fov: 26, d: [-.02, 0, -.02] },
  { ids: ['c27'], s: 'N3', pos: [.05, .36, 1.66], look: [-.05, .10, 1.02], fov: 40, d: [0, 0, -.02] },
  { ids: ['c28'], s: 'N3', pos: [.26, .16, 1.40], look: [.09, .06, 1.15], fov: 18, d: [0, 0, -.01] },
  // "Chín mươi phần trăm độ ẩm": máy lùi ra, đồng hồ độ ẩm (có thẻ 90 %) ở
  // góc phải, lực kế và dải giấy ở bên trái — người xem thấy cả hai mặt thang.
  { ids: ['c29'], s: 'N3', pos: [.34, .24, 1.32], look: [.04, .09, 1.10], fov: 28, d: [-.04, -.02, -.02] },
  // "Độ giãn cũng tăng": máy sang bên kẹp, thước kẻ vạch đứng cạnh dải giấy,
  // để đầu dải giấy đi qua từng vạch một là câu có hình riêng.
  { ids: ['c30'], s: 'N3', pos: [-.30, .34, 1.30], look: [-.20, .28, .94], fov: 30, d: [0, 0, -.02] },
  { ids: ['c31'], s: 'N3', pos: [-.02, .42, 1.50], look: [-.05, .18, .97], fov: 44, d: [0, 0, -.03] },
  { ids: ['c32'], s: 'N3', pos: [.20, .50, 1.58], look: [-.10, .31, 1.00], fov: 38, d: [0, 0, -.03] },
  { ids: ['c33'], s: 'N3', pos: [.10, .40, 1.02], look: [-.17, .30, .95], fov: 26, d: [.01, 0, -.02] },
  // "Ba đến mười phần trăm độ bền khô": máy nhìn **dải giấy ướt đang rách** —
  // vết rách nằm ở mép trên, nên máy lệch sang trái để mép rách và thẻ
  // "3–10 %" nằm chung một góc phải, còn cây thước đứng sau làm mốc cho
  // dải giấy. Dải giấy nằm ở nửa phải khung, không phải ở giữa.
  { ids: ['c34'], s: 'N3', pos: [-.06, .40, 1.12], look: [-.26, .39, .95], fov: 26, d: [-.02, 0, -.02] },
  // "Thấp hơn mười lăm phần trăm": máy lùi sang **phải** để mặt lực kế rơi
  // vào nửa trái khung — khung đối lập hẳn với nhát dải giấy ướt ở trên, và
  // kim đỏ đứng gần vạch không (dải giấy ướt rách trước khi lực kế kịp đọc).
  { ids: ['c35'], s: 'N3', pos: [.00, .26, 1.14], look: [-.14, .235, .95], fov: 24, d: [0, 0, -.012] },
  // "Thêm nhựa vào lúc ép": máy chỉ vào **hai vật của ngành** trên bàn — túi
  // bao bì dạng phẳng đứng trong giá, mẻ giấy khăn phía sau — thay vì cầm lực
  // kế (máy đo) làm vật chính.
  { ids: ['c36'], s: 'N3', pos: [.92, .30, 1.20], look: [.62, .02, .84], fov: 30, d: [0, 0, -.02] },
  // Góc giấy khăn bị cắt, lộ móc nối màu hồng: máy áp sát mặt bàn.
  { ids: ['c37'], s: 'N3', pos: [.50, .16, 1.02], look: [.45, .012, .71], fov: 20, d: [-.01, 0, -.01] },
  // "Một số loại khăn giấy và túi giấy": máy **lùi ra** — mẻ khăn giấy và túi
  // giấy cùng vào khung, ở trước là góc giấy khăn bị cắt lộ móc nối hồng
  // như ở dòng 37, và đêm mở ra phía sau.
  { ids: ['c38'], s: 'N3', pos: [.40, .34, 1.42], look: [.52, .02, .78], fov: 34, d: [0, 0, -.02] },
  // "Tờ giấy thường đã qua nước rồi sấy": máy hạ thấp gần mặt bàn, nhìn
  // ngang qua **hai tờ giấy cạnh nhau** — tờ đã sấy (nhăn, vệt ẩm còn hằn) và
  // tờ tươi (phẳng) — thay vì một toàn cảnh bàn đã xem ở câu trước.
  { ids: ['c39'], s: 'N3', pos: [.30, .16, 1.14], look: [.48, .02, .58], fov: 32, d: [0, 0, -.02] },
  { ids: ['c40'], s: 'N3', pos: [.56, .32, 1.24], look: [.36, .02, .57], fov: 26, d: [-.02, 0, -.02] },
  { ids: ['c41'], s: 'N3', pos: [.34, .20, .96], look: [.36, .015, .57], fov: 21, d: [0, 0, -.012] },
  // ── N1: lời chốt ──
  { ids: ['c42'], s: 'N1', pos: [-.56, .26, 1.16], look: [-.52, .03, .85], fov: 30, d: [-.02, 0, -.02] },
  { ids: ['c43'], s: 'N1', pos: [-.70, .44, 1.52], look: [-.76, .03, .83], fov: 36, d: [0, 0, -.03] },
];
