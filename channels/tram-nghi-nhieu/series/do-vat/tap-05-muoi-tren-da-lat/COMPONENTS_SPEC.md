# COMPONENTS_SPEC — Tại sao rắc muối lên đá lạnh thì đá tan nhanh hơn?

Bóc tách từ `TREATMENT.md` (25 câu, 25 nhát) và `voice/lines.json` (25 câu). Mỗi linh kiện là một hàm
riêng trong `src/props.js` (vật) hoặc `src/set.js` (bối cảnh). Quy ước chung: một đơn vị = 1 mét,
mặt quầy ở `y = 0`, máy quay luôn nhìn từ `+z`.

Quy ước vật liệu: `toon()` của `rig/kit.js`, texture vẽ bằng `canvasTex` có seed, ánh sáng một đèn
chính có hướng. Vật trong suốt (ly, bình, que nhiệt kế) đưa vào `fxLayer()` để không bị viền mực
đè lên; thứ vô hình (ion, phân tử nước, dòng nhiệt) vẽ bằng `glowMat()` để chỉ chỗ đó mới sáng.

**Bản đồ nhát theo nơi chốn** (lấy từ bảng `SHOTS` trong `src/film.js`):

| Nơi chốn | Câu |
|---|---|
| K · bếp buổi sáng | c1–c7, c10, c18 |
| L · bàn thí nghiệm | c8–c9, c19–c22 |
| P · mặt vũng nước quanh viên đá | c11–c12, c17 |
| N · mặt đá ở cấp nano | c13–c16 |
| K2 · bếp buổi chiều | c23–c25 |

---

## Nhóm 1 · Props (vật thật)

| Tên component | Vai trò & Shot | Cự ly | Trạng thái động | Hàm (đúng chữ ký thật) |
|---|---|---|---|---|
| **Khay inox** | K (c1–c3, c5, c10), K2 (c23, c25). Tô inox sâu 0,78 × 0,52 m, bốn thành thấp 0,055 m; đá, vũng nước và hộp muối đều nằm trong khay. | Medium · Close | Không (đứng yên suốt phim) | `steelTray({ w = .78, d = .52, h = .055 } = {})` |
| **Viên đá có muối** | K (c1–c5, c10), K2 (c23–c25). Khối đá 0,15 m, cạnh nhuềm tròn, lớp nước bám ở đáy; **rỉ nước và nhỏ dần suốt phim** và biến mất hẳn ở c25. | Close (c5) · Medium | `setMelt(k)`: k = 0 là viên mới, k = 1 là còn một nắm nhỏ — nó nhỏ đi và thấp xuống | `iceCube({ s = .15, seed = 7 } = {})` |
| **Vệt muối trên mặt viên đá** | K (c1, c5, c10). Mảnh muối trắng nằm trên mặt viên đá có muối; **tan dần** rồi mất hẳn ở c10. | Close | `setDissolve(k)`: k = 0 còn nguyên, k = 1 tan hết, chỉ còn mặt đá ướt | `saltPatch({ w = .075, d = .062 } = {})` |
| **Viên đá đối chứng** | K (c2, c7, c10, c25). Cùng kích thước, **không rắc muối**, đứng yên và rí ít. | Medium | `setMelt(0)` — luôn nguyên vẹn | `iceCube({ s = .15, seed = 21 } = {})` |
| **Lớp băng mờ trên đá đối chứng** | K (c7). Giọt nước trên mặt đá đối chứng đóng băng thành lưới tinh thể mờ; **chỉ mọc ở c7**, và ở c25 đã phủ kín. | Siêu cận | `setGrow(k)`: k = 0 mặt đá trơn, k = 1 lưới tinh thể đã phủ | `frostPatch({ s = .085 } = {})` |
| **Vũng nước quanh viên đá** | K (c5, c10, c25). Vũng loang dưới viên đá có muối; **lan ra suốt phim**. | Close | `setLevel(k)`: k = 0 vũng nhỏ, k = 1 vũng trải rộng | `puddle({ R = .15 } = {})` |
| **Dòng nước chảy xuống mép đá** | K (c5). Nước mủng chảy thành dòng nhỏ xuống mép viên đá; bật ra ở c5 rồi nhỏ dần. | Siêu cận | `setFlow(k)`: k = 0 khô, k = 1 dòng nước chảy | `meltStream({ len = .075 } = {})` |
| **Que nhiệt kế cắm trong vũng** | K (c10, c18). Ống thủy tinh, cột thủy nghiện đỏ, một vạch mốc không độ; cột đỏ **đứng vừa dưới vạch không độ** ở c10 và **tụt thêm một chút** ở c18. | Siêu cận | `setTemp(c)`: vị trí đầu cột đỏ theo nhiệt độ; vạch không độ nằm ở 55 % chiều cao que | `thermo({ h = .3, zero = .55 } = {})` |
| **Hộp muối** | K (c1, hậu cảnh), K2 (c23, c25). Hộp nhạt dạng tô nông; **trong hộp cạn dần suốt phim** và cạn hẳn ở c23. | Medium | `setUsed(k)`: k = 1 đáy hộp lộ ra | `saltTin({ w = .17, d = .17, h = .07, seed = 5 } = {})` |
| **Túi muối** | K (c1, hậu cảnh), K2 (c23, c25). Túi mềm, miệng kẹp, có miếng nhãn. **Ở c23 nó được đặt xuống** cạnh hộp muối — đó là lý do nó đổi chỗ giữa hai cảnh. | Medium | Vị trí do phim đặt theo câu | `saltBag({ w = .16, h = .2, d = .07, color = '#e6ecf5' } = {})` |
| **Hộp đá** | K (c1), K2 (c25, hậu cảnh). Hộp xốp giữ đá vỡ; đứng yên, không ai cầm. | Hậu cảnh | Không | `iceBox({ w = .3, h = .19, d = .22, seed = 13 } = {})` |
| **Chiếc búa** | K (c4), K2 (c25). Búa sắt, cán gỗ, đầu búa có vết muối bám; **đặt yên từ đầu phim đến cuối phim, không ai cầm**. | Close (c4) | Không | `hammer({ len = .3 } = {})` |
| **Hai ly thuỷ tinh** | K (c6). Một ly nước sạch, một ly nước muối; **nhìn xuyên qua** để đọc cột đỏ bên trong. | Trung cảnh | `setFill(k)`: mặt nước dâng lên | `tumbler({ h = .16, r = .045 } = {})` |
| **Que nhiệt kế ở bếp** | K (c6). Một que trong mỗi ly; cột đỏ trong ly nước muối **thấp hơn** cột đỏ trong ly nước sạch. Que lệch về phía trước 2,2 cm so với que khuấy để **không đứng chồng lên que khuấy** — nếu chồng nhau thì cột đỏ biến mất sau que trắng. | Trung cảnh | `setTemp(c)` | `thermo({ h = .3, zero = .55, perDeg = .006 } = {})` |
| **Que khuấy ở bếp** | K (c6). Que thủy tinh trong ly nước muối, cầm bởi tay thòi xuống từ trên khung; quay quanh trục khi câu đang khuấy. | Trung cảnh | Xoay quanh trục đứng | `stirRod({ len = .22 } = {})` |
| **Vệt muối trong ly nước muối ở bếp** | K (c6). Vệt trắng lắng trên nền nước trong ly; **tan dần** khi que khuấy quay. | Trung cảnh | `setDissolve(k)` | `saltPatch({ w = .03, d = .03 } = {})` |
| **Bát toàn đá vỡ** | K2 (c24). Bát toàn đá vỡ, muối trộn quanh túi zip. | Close | Không | `bowlOfIce({ R = .17, h = .09, seed = 29 } = {})` |
| **Túi zip có sữa đặc** | K2 (c24). Túi trong suốt, khóa zip ở miệng, nằm giữa bát đá. | Close | Không | `zipBag({ w = .15, h = .2, d = .05 } = {})` |
| **Bàn tay** | K (c1 bóp muối, c3 rửa muối, c6 cho muối vào ly), L (c9 cầm que khuấy, c19 đặt bát muối), K2 (c23 đặt túi muối xuống). | Close · Medium | `pose(curl, spread)`; vị trí và tư thế do phim đặt theo câu (`gripSide`, `gripDown`) | `buildHand({ skin: '#e3a983', sleeve: '#56688f' })` của rig, dùng lại y hệt ở K, L, K2 |

## Nhóm 2 · Bối cảnh (nơi chốn)

| Tên component | Vai trò & Shot | Cự ly | Trạng thái động | Hàm (đúng chữ ký thật) |
|---|---|---|---|---|
| **Bếp** | K (c1–c7, c10, c18) và K2 (c23–c25) — **cùng một căn bếp, hai lần sáng**: buổi sáng có nắng ấm từ cửa sổ bên trái, buổi chiều ánh sáng ngả đỏ. Quầy gỗ, gạch men trên tường, vòi nước, cây xanh. | Toàn cảnh · Trung cảnh | `S.update(t, { light })` đổi cường độ sáng theo câu; `S.cams` cho sẵn bốn cự ly | `kitchen(scene, { time })` của rig, gọi trong `buildKitchen(scene, { time = 'morning', bagAt = 'back' } = {})` |
| **Bàn thí nghiệm** | L (c8–c9, c19–c22). Bàn gỗ, đèn bàn trắng lạnh rọi xuống, tấm bìa nhẹ bên trái. | Toàn cảnh · Close | `S.update(t, { light })`; đèn bàn đổi màu sang `#cfe0ff` và cường độ 5,2 | `desk(scene, { time: 'night' })` của rig, gọi trong `buildLab(scene)` |
| **Bể đá muối** | L (c8, c19, c20). Tô inox rộng 0,26 m đầy đá vỡ trộn muối; **là vật làm lạnh** của phép đo, nên nó phải có mặt ngay từ c8. | Trung cảnh | Không | `iceBath({ R = .26, h = .11, seed = 17 } = {})` |
| **Bốn bình thuỷ tinh** | L (c8, c9, c20, c22). Xếp hàng trong bể đá muối: bình nước sạch, bình 10 %, bình nửa đặc, bình đậm. **Bình loãng đóng băng trước, bình đậm vẫn trong veo** — độ đậm phải thấy bằng mắt. | Trung cảnh · Siêu cận | `setFreeze(k)`: lớp băng mờ mọc từ thành bình vào | `beaker({ h = .2, r = .05, liquid = '#cfe9f7' } = {})` |
| **Ba que nhiệt kế ở bàn thí nghiệm** | L (c9, c19, c21). Cắm trong bình 10 %, bình nửa đặc và bình đậm; **phải đứng cao hơn mặt đá vỡ**, nếu không cột thủy nghiện bị đá che. | Close | `setTemp(c)`; cột đỏ của bình đậm dừng ở mốc −21 °C | `thermo({ h = .3, zero = .55 } = {})` |
| **Que khuấy** | L (c9). Que thủy tinh dài trong bình 10 %, cầm tay khuấy. | Close | Xoay quanh trục đứng khi câu đang khuấy | `stirRod({ len = .26 } = {})` |
| **Tinh thể muối hai nước** | L (c22). Lăng trụ và mảnh trong suốt mọc trên thành bình đậm; **chỉ xuất hiện ở c22**. | Siêu cận | `setGrow(k)`: k = 0 chưa có, k = 1 đã mọc | `hydrate({ n = 9, seed = 67 } = {})` |
| **Bát muối ở bàn thí nghiệm** | L (c19). Tô muối nhạt trước mặt bể đá muối; trong bát là vệt muối trắng **đang tan**, và một **dòng lượn nhiệt** chạy từ vũng nước vào bát. Tay bám vào **mép trái** bát (không nằm ngang qua nó) để bát còn thấy được. | Trung cảnh | `setDissolve(k)` cho vệt muối; `squiggle` có `uHead`/`uLen` đẩy đầu dòng lượn | `saltTin({ w = .17, d = .17, h = .07, seed = 9 } = {})` + `saltPatch({ w = .075, d = .065 } = {})` + `squiggle(PAL.orange, PAL.red)` |
| **Mặt vũng nước** | P (c11, c12, c17). Mặt nước trải tới chân trời; máy quay nằm **sát mặt nước**, nên đi vào bên trong vũng nước mà vẫn giữ được phương hướng. | Siêu cận · Trung cảnh | `setLevel(1)` — phẳng, trong | `puddle({ R = 1.2 } = {})` |
| **Mặt đá ở cấp nano** | N (c13–c16). Mặt phẳng tinh thể có lưới phân tử; lớp nước phủ trên mặt là một tấm mỏng **mỏng dần đi** ở c16. Trên mặt đá có một **vệt muối tan dần** (c14) — vệt là con của tấm mặt đá nên cùng tan theo. | Siêu cận | `setLayer(thin, wet)`: `thin` 0 = nguyên dày, 1 = mỏng nhất; `wet` 0 = trong suốt, 1 = đục | `iceFace({ s = .5 } = {})`, lớp nước là `face.userData.layer`, vệt muối là `saltPatch({ w = .075, d = .062 } = {})` |

## Nhóm 3 · Thứ vô hình, vẽ thành hình minh hoạ

| Tên component | Vai trò & Shot | Cự ly | Trạng thái động | Hàm (đúng chữ ký thật) |
|---|---|---|---|---|
| **Ion của muối** | P (c11, c17), N (c15). Cầu tím Na⁺ và cầu xanh Cl⁻, mỗi cầu có một vành điện tích đứng thẳng để máy quay thấy như vòng bao quanh cầu. Ở N chúng mọc lên **đúng tại mặt đá**, dưới lớp nước mỏng. | Siêu cận | `update(t)`: trôi lơ lửng quanh tâm, nhấp nhô nhẹ | `ions({ n = 16, s = .5, seed = 53, band = null } = {})` — `band = [y thấp, độ dày]` kẹp ion sát một mặt phẳng |
| **Phân tử nước** | N (c14). Hạt trắng bay tới mặt đá rồi dính vào. | Siêu cận | `update(t)`: bay theo chu kỳ 3 giây từ xa tới mặt đá | `molecules({ n = 34, s = .5, seed = 41 } = {})` |
| **Hạt phân tử nước trong vũng** | P (c11). Những chấm trắng nhỏ trôi quanh mảnh đá — "trong nước có nhiều hạt hơn". | Siêu cận | Hạt rời rạc, không có chu kỳ rõ | `glowDots(30, .005, '#e8f6ff', 1.1)` + `setDot(...)` của rig |
| **Hạt muối rơi** | K (c1). Dòng hạt trắng đi từ tay xuống viên đá. | Close | `update(t, power)`: chạy khi power > 0 | `particleStream(scene, { from, to, count, size, color, speed, spread })` của rig |
| **Hạt muối tan trong vũng** | P (c17). Hạt muối nhỏ rơi xuống mặt nước cạnh mảnh đá rồi **vỡ ra**. | Siêu cận | `setFall(k)` cho hạt rơi, `setDissolve(k)` cho hạt nhỏ dần và biến mất | `saltGrain({ s = .03 } = {})` |
| **Dòng nhiệt** | P (c17). Nhiệt là thứ vô hình, phải thành vật thể có vật lý: một đường sáng uốn lượn mọc lên từ hạt muối đang tan. | Siêu cận | `U.uHead` đẩy đầu đường lên, `U.uLen` đặt chiều dài vệt, `U.uAmp` và `U.uFreq` đặt độ uốn | `squiggle(PAL.orange, PAL.red)` của rig — `m.U` là các uniform của shader |

## Rủi ro lắp ghép kỹ thuật — và cách đã xử lý

1. **Que nhiệt kế bị đá vỡ che.** Cột thủy nghiện là thứ phải đọc, nhưng que cắm trong bể đá muối thì nằm dưới mặt đá. **Đã xử lý:** cả ba que ở bàn thí nghiệm đứng ở `y = 0,115`, cao hơn mặt đá vỡ, và máy của c20–c22 lùi ra khỏi bể đá muối thay vì đứng bên trong nó.
2. **Vật trong suốt bị viền mực đè.** Ly, bình và que nhiệt kế là thứ phải **nhìn xuyên qua** để thấy cột đỏ bên trong. **Đã xử lý:** vật liệu của chúng có `transparent: true` và `depthWrite: false`, và được đưa vào `fxLayer()` để không có viền mực đè lên.
3. **Lớp nước trên mặt đá che mất lưới tinh thể.** Lớp phủ đặc biến cảnh nano thành một tấm trắng. **Đã xử lý:** lớp nước là một tấm **mỏng** (`scale.y` nhỏ dần theo `thin`), độ đục do `wet` điều khiển, và mặt đá lấy màu xanh nhạt để lưới phân tử hiện ra.
4. **Ion trông như vũng nước.** Vành điện tích nằm ngang thì nhìn từ trên xuống thành một đĩa méo. **Đã xử lý:** vành đứng thẳng trong mặt phẳng XY, cầu ion trông ra là cầu ion.
5. **Bàn tay của rig dài 0,55 m, đứng gần máy là một khối lớn không đọc ra là tay.** **Đã xử lý:** ở c23 tay ở tư thế ấn túi muối xuống, cán tay chạy ra khỏi mép trên khung, trong khung chỉ còn bàn tay, túi muối và hộp muối cạn.
6. **Cảnh vũng nước và cảnh bếp nằm chồng toạ độ.** Bếp và bàn thí nghiệm của rig chiếm cùng một thế giới. **Đã xử lý:** mỗi nơi chốn là một `THREE.Scene` riêng (`K`, `K2`, `L`, `P`, `N`) trong `src/film.js`; chỉ một cảnh được bật theo câu.
7. **Thẻ số phải trỏ vào đúng vật.** **Đã xử lý:** thẻ **-21 °C** lấy điểm neo từ chính que nhiệt kế của bình đậm (`denseColumn`), nên mũi tên chỉ vào đầu cột đỏ chứ không vào vạch không độ; thẻ **10 %** neo vào bình nước muối mười phần trăm.
8. **Muối phải có nguồn và phải cạn đi.** Túi muối đứng ở hậu cảnh ở khung mở và được đặt xuống ở c23; hộp muối là thứ rắc ra và **cạn dần** suốt phim. **Đã xử lý:** `KL` ghi rõ chỗ của từng vật, và `setUsed(k)` cho hộp muối.
9. **Cánh tay của rig dài 0,55 m: nằm ngang thì chiếm trọn khung.** **Đã xử lý:** `gripDown()` xoay bàn tay xuống (`rotation.z = -π/2`), ngón tay chỉ xuống dưới và **cánh tay rút lên trên khung**; dùng cho c6 (que khuấy ở bếp) và c9 (que khuấy ở bàn thí nghiệm). Tay bám bát ở c19 dùng `gripSide()` ở **mép trái** của bát.
10. **Thẻ số không mở ra được.** `cardWindow(C, V)` trả về **một đối tượng** `{t0, t1}`, còn bảng `windows` của thẻ là danh sách **cặp** `[t0, t1]`. **Đã xử lý:** `C.windows = [[w.t0, w.t1]]`, và mỗi thẻ có `lead`/`hold` để nó còn đọc được sau câu của nó.
11. **Cột đỏ của que nhiệt kế phải vươn cao hơn miệng bình** nếu thẻ `-21 °C` phải chỉ vào được nó. Thang que ở bàn thí nghiệm có `perDeg = .0031`, `zero = .66` → đầu cột ở −21 °C nằm ở `y ≈ .248`, **trên** miệng bình (`.225`). **Đã xử lý:** máy của c21 đứng cao hơn miệng bể để không xuyên qua đá vỡ.

## Máy quay — những gì đã đổi sau vòng chấm hình ảnh lần 1

Bảng `SHOTS` trong `src/film.js` là nơi duy nhất quyết định máy đứng đâu. Những thay đổi còn lại sau vòng chấm đầu:

- **Nhiều nhát lùi thay vì tiến vào.** Người xem đã biết nơi chốn từ những nhát trước; đi vào thêm chỉ làm khung đầy hạt. C2, C10, C12, C15, C18, C19, C20, C23, C25 đều **lùi**; C1 đứng yên (`d = [0,0,0]`) vì đó là nhát mở đầu và tay phải là người chuyển động.
- **Hai nhát mở rộng rồi đi vào trong một câu**: C8 và C19 có `fov` → `fov2` (34° → 26°, 26° → 24°) và `dLook` riêng. Kênh ép **một câu = một nhát**, nên không thể cắt thành hai; cách duy nhất là máy tự mở rộng rồi đi vào trong cùng nhát.
- **Thang khoảng cách của cảnh nano đảo lại.** C13 (rộng, nhìn xuống) → C14 (sát mặt đá) → C15 (lùi ra) → C16 (nâng lên nhìn xuống lớp nước): người xem phải thấy **cả** mặt đá lẫn lớp nước mỏng đi, không được chỉ thấy một mảng trống.
- **Ánh sáng tách theo nơi chốn.** `set.update(t, { light })` nhận cường độ theo nơi: bếp sáng .78, bếp chiều .74, bàn thí nghiệm .86, vũng nước .72, nano .80. Bếp chiều khác bếp sáng **cả màu** (rig đổi màu key sang hổ phách), không chỉ khác độ sáng.
- **Nhiệt kế không được chồng lên que khuấy.** Que ở bếp lệch 2,2 cm về phía trước, que ở bàn thí nghiệm lệch 2 cm — nếu chồng nhau, cột đỏ biến mất sau que trắng.

