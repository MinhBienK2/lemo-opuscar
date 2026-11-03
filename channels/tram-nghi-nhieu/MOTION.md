# Chuyển động: dựng `src/film.js` sao cho hình sống

Đọc hết file này trước khi viết dòng đầu tiên của `src/film.js`. Cổng `tools/check_motion.py` đo bản `.mp4`:

| Đo | Ngưỡng | `host-toon-test` | Một tập dựng kiểu bảng trạng thái |
|---|---|---|---|
| Số giây có thứ chuyển động thấy được | ≥ 55 % | 62 % | 30 % |
| Số khoảng 2 s có hành động lớn | ≥ 45 % | 58 % | 15 % |
| Đoạn đứng hình dài nhất, ngoài các `silence` | ≤ 10 s | 9 s | 16 s |
| Nhịp làm đổi vùng `xy` của nó | ≥ 75 % | — | 30/48 |

## 1. Một nhịp là một chuyển động

Mỗi nhịp trong board có năm trường:

- `at`: lúc bắt đầu;
- `move`: kiểu chuyển động;
- `d`: kéo dài bao lâu;
- `xy`: xảy ra ở đâu trên màn hình;
- `do`: ai làm gì với vật gì.

Trong code, nhịp là một tiến độ `p` chạy từ 0 → 1. Mọi thứ thay đổi trên hình đều là hàm của `p`: vị trí, góc, cỡ, màu, độ dài nét, con số.

```js
const p = BD.p('b_lay', T, 'back');   // 0 → 1 trong d giây của nhịp b_lay, vượt đà nhẹ ở cuối
```

Vật xuất hiện thì đi vào từ đâu đó. Tư thế đổi thì tay đi tới tư thế mới. Con số thì đếm lên. Một vật chỉ đứng yên khi câu chuyện cần nó đứng yên.

Một lỗi cổng bắt: vẽ một vật sau `if (x > 0)` mà không dùng `x`. Hãy truyền tiến độ vào hàm vẽ: `letter(g, x, y, BD.p('b_thu', T, 'back'))`.

## 2. Khung của một shot

Mỗi shot là một hàm. Hàm nhận thời gian và vẽ nơi chốn, người, vật, theo các nhịp của chính shot đó.

```js
import { span, keys, poseKeys, faceKeys, enter, travel, walkTo, count, drawOn, shake, landing, whip } from '../../../../rig/keys.js';

const SHOTS = {
  // nơi chốn ở cỡ rộng: Mai bước vào tiệm, đặt giỏ len lên quầy
  m_wide(g, T, sh) {
    S.tiemSua(g, T);                                         // nền có thứ sống riêng (mục 5)
    const w = walkTo(T, BD.t('b_vao'), 2.2, 1500, 1050);     // đi bộ, chân không trượt
    const k = BD.p('b_dat', T);                              // tay đưa giỏ xuống quầy
    const P = extra(g, { x: w.x, y: 900, look: MAI, walk: w.moving ? w.ph : null,
      armR: { from: 'hold', to: 'reach', k }, at: [980, 700], t: T,
      E: k > .9 ? 'happy' : 'neutral' });
    const hand = k < 1 ? P.handR : [980, 700];               // giỏ theo tay, rồi nằm trên quầy
    const [sx, sy] = landing(T, BD.t('b_dat') + BD.byId.b_dat.d);
    g.save(); g.translate(...hand); g.scale(sx, sy); basket(g); g.restore();
    S.tiemMat(g, T);
  },
};
```

Trong `render(T)`, gọi `SHOTS[sh.id](g, T, sh)` bên trong `BD.camera` (`SKILL.md` §4).

Mỗi shot có ít nhất một chuyển động chạy suốt shot, hoặc gần suốt: đi bộ, một vật lớn dần, máy theo người. Các nhịp nằm chồng lên chuyển động đó.

## 3. Sổ tay 17 kiểu `move`

| `move` | Khi nào | Code |
|---|---|---|
| `enter` | vật hoặc người vào khung: tờ thư rơi xuống bàn, thẻ trượt vào | `const e = enter(T, BD.t(id), { from: [0, -300], rot: .2 }); g.translate(x + e.x, y + e.y); g.rotate(e.rot); g.globalAlpha = e.a;` |
| `exit` | rời khung: `enter` với `t1` | `enter(T, t0, { from: [600, 0], t1: BD.t(id) })` |
| `walk` | người đi từ chỗ này sang chỗ kia | `const w = walkTo(T, BD.t(id), d, x0, x1); extra(g, { x: w.x, walk: w.ph, … })`; người dẫn: `legs: { mode: 'walk', ph: w.ph }` |
| `carry` | người cầm vật đi | tay `{ from: 'down', to: 'hold', k }`, rồi vẽ vật ở `P.handR`; người dẫn: `armR: { swing, prop: g => cup(g) }` |
| `travel` | vật bay theo đường cong: ném, đưa, rơi vào giỏ | `const [x, y] = travel(T, BD.t(id), d, A, B, 160);` rồi `landing(T, BD.t(id) + d)` lúc chạm |
| `grow` | chồng giấy cao lên, cột đo, cây lớn, đống việc dồn lên | chiều cao `h * BD.p(id, T)`; mỗi tờ vào trễ một chút: `span(T, t0 + i * .08, .3, 'back')` |
| `count` | con số **là** vật: đồng hồ chạy, bộ đếm, số người | `text(g, String(count(T, BD.t(id), d, 67)), …)` cạnh vật nó đếm |
| `draw` | nét tự vẽ: sợi chỉ kéo ra, vết nứt, mũi tên, đường đi trên bản đồ | `drawOn(g, pts, BD.p(id, T), col, 6)` |
| `break` | vật gãy, xé, cắt: kéo cắt sợi chỉ | hai nửa tách ra: `x ± 40 * p`, xoay `± .3 * p`, cộng `shake(T, t0)` |
| `transform` | vật đổi dạng A → B: áo len dở thành áo len xong, mặt buồn thành mặt vui | nội suy mọi số của hàm vẽ: `lerp(a, b, p)` cho cỡ, màu (`mix`), số mũi len |
| `swap` | đổi vật này lấy vật khác ở cùng chỗ | vật A `enter … t1`, vật B `enter` cùng lúc từ phía ngược lại |
| `open` | cửa, nắp hộp, sổ, ngăn kéo mở ra | góc hoặc bề rộng `* BD.p(id, T, 'back')` |
| `fall` | vật rơi, đổ, sụp | `y += 600 * ease.in(p)`, rồi `landing` và `shake` |
| `fill` | ly đầy, thanh pin đầy, màu loang | mực hoặc mức `= lerp(a, b, p)` |
| `work` | tay làm việc liên tục: móc len, gõ phím, viết, khuấy | `extra(g, { armL: 'knit', armR: 'knit', t: T })` (`type`, `write`, `stir`, `clap`) |
| `gesture` | tay của người dẫn: chỉ, xòe, đếm ngón | `armR: poseKeys(T, [[t0, { swing: 0 }], [BD.t(id), { swing: -.7 }]], .35)` |
| `act` | mặt và đầu diễn: nhăn, cười, lắc đầu | `E: faceKeys(T, [[0, 'neutral'], [BD.t(id), 'skeptical']])`, đầu `headRoll: Math.sin(…) * .1 * span(…)` |

`gesture` và `act` chỉ được chiếm ≤ 40 % số nhịp. Phần lớn nhịp phải làm một vật đổi trên hình.

## 4. Shot cận vẽ chủ thể ở cỡ của nó

Máy chỉ phóng tối đa 1,6× trên khung rộng. Cổng bắt những bộ ba `[2.4, x, y]`. Một shot cận là một hàm vẽ riêng:

- **Mặt người dẫn**: dùng `reactClose(g, T, { E, talk, at })`. Hoặc vẽ `figure(g, { s: 3, crop: 'bust', … })` sau khi `g.translate(W / 2, H * .84)`.
- **Mặt người trong truyện**: dùng `extra` với `s` khoảng 2,2. Đầu nằm ở `y − 496·s`, nên muốn đầu ở giữa khung (y = 470) thì đặt `y = 470 + 496·s`.
- **Bàn tay với vật**: vẽ vật to giữa khung, và vẽ tay mới cầm nó ở cùng cỡ. Ví dụ: kéo cắt sợi chỉ ở cỡ 3×, sợi chỉ là một `drawOn` dày 10 px.

Kiểm trên still: shot cận nào cũng thấy trọn mặt, hoặc trọn bàn tay với vật.

## 5. Nơi chốn có thứ sống của riêng nó

Mỗi hàm nơi chốn trong `src/sets.js` có ít nhất một vật chạy theo `T`, thuộc về nơi đó:

- tiệm may: kim máy khâu nhấp, cuộn len lắc khi sợi bị kéo;
- văn phòng đêm: màn hình nhấp nháy con trỏ, quạt trần quay;
- phòng thí nghiệm: kim đồng hồ chạy, bong bóng trong bình;
- đường phố: xe lướt qua phía sau, đèn tín hiệu đổi màu.

`ambientMotes` (bụi trong không khí) chỉ là lớp phủ, không thay thế được vật sống đó.

Tập 3–5 phút có 6–10 nơi chốn. Hai nơi cạnh nhau nên khác ánh sáng và khác màu chủ đạo.

## 6. Chuyển cảnh

- Cắt thẳng là mặc định.
- `whip(g, T, sh.t0, gPrev => drawShot(gPrev, prev, T), gNext => drawShot(gNext, sh, T))` dùng cho cú lật và cho chỗ đổi nơi chốn nhanh.
- Iris (`irisTransition`, `rig/motion.js`) dùng cho chỗ đi vào thế giới câu chuyện.

Tiếng `whoosh` đi cùng `whip`.

## 7. Khi `check_motion` FAIL

- **`action` thấp**: shot nào cũng chỉ có người đứng nói. Thêm một chuyển động chạy suốt shot (mục 2).
- **`big` thấp**: thiếu `enter`, `walk`, `travel`, `transform`. Vật hiện ra bằng cách mờ dần hoặc bật lên thì không đủ lớn để đo.
- **`dead` dài**: tìm khoảng giây đó trên contact sheet. Thường là một shot người dẫn ở bàn quá 8 s; cắt sang thế giới câu chuyện.
- **Nhịp không đổi vùng `xy`**: `xy` trong board sai chỗ, hoặc hàm vẽ không dùng `BD.p(id, T)` của nhịp đó.
