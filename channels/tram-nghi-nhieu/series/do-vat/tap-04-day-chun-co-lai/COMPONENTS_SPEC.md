# COMPONENTS_SPEC — Tại sao dây chun bị kéo căng rồi hơi nóng thì lại co lại?

Bóc tách linh kiện 3D của tập 04, đối chiếu với `voice/lines.json` (48 câu) và `LOOK.md` (48 nhát). Mọi vật có thật nằm trong `src/props.js`; bối cảnh và ánh sáng nằm trong `src/set.js`; chuyển động theo thời gian, thẻ số và sự kiện nằm trong `src/film.js`.

Quy ước: **LOD** = cự ly máy thấy vật (`C` cận cảnh / `M` trung cảnh / `B` hậu cảnh). **Trạng thái** = `Tĩnh` / `Động` (kèm câu nào trong `lines.json`).

**Luật số của tập:** chỉ ba con số được lên hình — `20 °C` (c30), `60 °C` (c32), `14 %` (c36). Mỗi con số là một vật trong khung, và mỗi con số có câu lời đọc nó. Không có con số nào khác được vẽ.

---

## Nhóm 1 — Đạo cụ ở bếp (N1)

| Tên | Xuất hiện ở | LOD | Trạng thái | Hàm trong `src/props.js` |
|---|---|---|---|---|
| **Hũ thủy tinh có nắp vặn** (`jar1`, `R = .068`, `H = .19`) — thân kính trong suốt có **vai và cổ** (thân thẳng như cốc nhựa thì không ai gọi là hũ thủy tinh), đáy kính, **nắp có ren xoắn ốc** chạy quanh thân nắm, mép nắp có vòng sáng, vệt kính mờ ở thân dưới, **nắp màu kem sáng** (`#e6dfcd`) — nắp trùng màu quầy thì vòng dây đỏ trên nắp không tách ra được; **răng cưa viền nắp là sọc nông nằm sát mép** (cao 11 mm, nhô ra ngoài mặt nắp chưa đến 1 mm): răng cao nhô ra 3–4 mm thì từ trên nhìn xuống cả vòng răng thành **một hàng rào** đứng quanh nắp và nó nuốt mất vòng dây | c1–c3, c7, c8, c27, c42, c43, c46–c48 | C/M | Tĩnh vị trí; **nắp là cái mà dây quấn vào** | `jar({R:.068, H:.19, lidColor:'#e6dfcd'})` |
| **Dây chun quấn quanh nắp** (`band1`, vòng băng dẹt, mặt cắt **bo tròn**, `R = .075`, **mỏng theo bán kính** `w = .007` và **rộng theo chiều cao** `h = .020`) — dây **đứng** quanh miệng nắp và nhô lên trên nắp, đúng dây chun thật; mặt cắt dẹt là điểm mấu chốt: cao su thật là dải dẹt, không phải sợi tròn; vòng có **chỗ hai đầu dán** (một đoạn hai lớp nổi lên) để nhìn từ trên xuống cũng biết đó là dây chun, không phải vành nhựa; màu **đậm** (`#c2183a`) để vòng dây tách khỏi nắp kem dưới ánh sáng buổi sáng | c1–c3, c7, c8, c27, c43, c46, c47, c48 | C | **Động: siết dần** (`setTighten(k)`: bán kính vòng nhỏ đi 5 %, mặt cắt **mỏng đi 10 %** theo bán kính và **thấp đi 32 %** theo chiều cao — dây bị kéo thì dẹp và mỏng đi; hình học được **dựng lại** khi mức siết đổi quá 2 %, chứ không scale cả vòng) trong lúc c2, và **lún xuống rãnh nắp** (`position.y` từ `.2055` xuống `.2005`) | `bandRing({R:.075, w:.007, h:.020, color:'#c2183a', shrink:.05})` |
| **Vết dây ăn vào rãnh nắp** (`groove1`, vòng mờ trên mặt nắp) — dấu vết của độ siết, không phải vẽ thêm | c1, c3, c8, c27, c43, c48 | C | Động: **sâu thêm theo độ siết** (`.2055 → .2015`, bán kính nhỏ đi 5 %) | `mesh(TorusGeometry(.0696,.0022))` trong `set.js` |
| **Hũ thứ hai lấy ra từ tủ lạnh** (`jar2` + `band2` + `groove2`, đặt bên phải hũ thứ nhất) — **chỉ hiện từ c42 trở đi** (`visible = k >= 42`), và nó là cái hũ mà c43 so sánh | c42, c43, c44, c46 | C | Tĩnh; dây của nó **lỏng hơn**: không siết (`setTighten` giữ 0) nên nó nổi cao hơn miệng nắp | `jar()` + `bandRing()` lần hai trong `set.js` |
| **Máy sấy tóc** (thân trụ, **lưới nan thẳng ở đuôi**, cổ tay cầm, công tắc trắng và **nút chỉnh nhiệt đỏ** trên tay cầm, **vòng dây treo ở gáy**, dây điện uốn cong, miệng máy có vành sáng và **lưới nan thẳng** ở `+x`) — đặt ở `(F.x − .50, .14, F.z)`, **tay cầm chạm mặt quầy**, miệng máy ở `y ≈ .19` ngang tầm dây quanh nắp (`y = .198`) | c2, c8, c47, c48 | C/M | Tĩnh vị trí (không bay); **tay cầm** bằng bàn tay `handK` | `hairdryer({color:'#f04462'})` |
| **Sợi thép mỏng làm đối chứng** (`wire`, `len = .30`, `r = .005`) — một đầu ghim cố định, đầu kia tự do. Sợi **đặc** (đường kính 5 mm) và có vân sáng dọc thân: sợi mảnh như ống hút thì người xem gọi là ống hút. Nằm ở **vế phải quầy** (`x = F.x + .70 … F.x + 1.00`), có nhát riêng của nó | c4 | C | **Động: dài ra 6 %** khi nung (`setLen(1 + .06·wireK)`), **đầu ghim đứng yên** (vị trí tính lại mỗi khung) | `steelWire({len:.30, r:.005})` |
| **Ghim** (`pinW`, đầu ghim của sợi thép; `pinS1`, `pinS2`, hai ghim của vòng dây chùng) — **đầu đĩa nhỏ ở trên + thân mảnh + mũi kim chĩa xuống**: một que trơn không ai gọi là ghim, và ghim có đế tròn dày ở dưới thì đọc ra là cọc sắt. Hai ghim của vòng dây chùng **nhô lên 8 mm** cho đầu đĩa thấy trên mặt dải | c4, c5, c6 | C | Tĩnh | `pin({color:'#b9bfd0'})` |
| **Thước gỗ nằm ngang** (`rul`, `len = .24`, vạch centimet và nửa centimet, **số to mỗi 5 cm**, vân gỗ có mắt, hai đầu vát, lỗ treo ở đầu thước) — nằm ngay **sau** sợi dây, nên vạch đo chiều dài dây; nằm ở vế phải quầy (`x = F.x + .90`) | c4 | C | Tĩnh | `ruler({len:.24, w:.05})` |
| **Vòng dây chùng** (`slack`, dải dẹt `len = .32`, **rộng 5 cm**, móc lỏng qua hai ghim, hai đầu lộ ra trước ghim; dải **cong nhẹ** và có **đoạn hai đầu dán chồng** — một thanh thẳng cứng đọc ra là que kem) — nằm **ngay cạnh mép hũ** (`x = F.x + .16`), trong một nhóm riêng để `setLen` không kéo dải về giữa quầy | c5, c6, c46 | C | **Động: dài ra 13 %** khi nung (`setLen(1 + .13·slackK)`) — **dây chùng nóng lên thì NỞ ra, ngược với dây đang kéo** | `bandStrip({len:.32, w:.050, h:.010, color:'#d8566a'})` |
| **Luồng hơi nóng** (`flowHot`, từ miệng máy sấy tóc tới `x = F.x + 1.05`) | c2, c8, c47, c48 | M | **Động** (`update(t, 1)`), và **chỉ hiện khi đang thổi** (`k ∈ [2,8]` hoặc `k ≥ 46`) | `heatFlow(...)` → `flow()` của rig |

---

## Nhóm 2 — Ruột sợi dây (N2): mạng chuỗi polymer

| Tên | Xuất hiện ở | LOD | Trạng thái | Hàm trong `src/props.js` |
|---|---|---|---|---|
| **Mạng chuỗi polymer** (8 sợi **chồng lên nhau** thành một mạng, mỗi sợi 64 hạt đường kính 2 cm, khoảng cách tâm hạt 2,6 cm — hạt **sát nhau** thì đọc ra là **dây xích** đúng như lời kể nói; hạt rời quá thì đọc ra là "mưa hạt rơi"; hạt **xen kẽ lớn–nhỏ**: hạt nhỏ là mắt nối giữa hai hạt lớn, hạt đều tăm tắp thì đọc ra là chuỗi bi) | c9–c13, c15, c18–c22, c45 | C/M/B | **Động**: `setCoil(k)` — `k = 1` là tự nhiên (hạt xoắn thành ốc), `k = 0` là bị kéo thẳng (hạt nằm trên đường thẳng); `setCoil` **dựng lại hạt** (gọi `update`), nếu không thì sợi bị kéo thẳng và sợi tự nhiên **giống hệt nhau**; **tự rung mỗi khung** (`update(t)`) | `chain({n:64, bead:.010, len:.82, turns:5, rad:.026+(i%3)*.009, color:'#f7bd27'/'#ff9a3d', seed:11+i})` |
| **Móc liên kết chéo** (6 **mắt xích vàng** to `r = .040`, nằm đúng chỗ hai sợi cắt nhau) — **cái làm cho mạng là mạng**, không phải mấy sợi rời. Mắt xích **mở hình chữ C** (có khe, có thanh ngang đan chéo như móc nối thật) và **hai sợi hạt xuyên qua lỗ**: một vòng đặc kín đọc ra là một hạt polymer, và người xem tưởng đó là hạt chứ không phải móc nối; vòng tím trên nền tím thì không đọc ra là gì | c9, c11, c18–c21 | C | Tĩnh vị trí, nghiêng nhẹ | `crosslink({r:.040, color:'#f0c76a', through:'x'})` |
| **Sợi chuỗi đơn ở tiền cảnh** (`strand`, 26 hạt đường kính 1,7 cm, khoảng cách hạt gần bằng đường kính, đặt ở `(-.12, .12, .46)`) — hình riêng cho câu "mỗi chuỗi là một dãy mắt xích dài": lấy hình từ đám hạt của mạng thì không được, đám hạt đó nhìn mọi câu giống nhau | c10 | C | **Động**: `setCoil(.55)` — sợi hơi uốn, **tự rung mỗi khung** | `chain({n:26, bead:.0085, len:.50, turns:1, rad:.05, color:'#ff9a3d', seed:91, spread:.12})` |
| **Nhóm bốn sợi cuộn** (`fam`, mỗi sợi 80 hạt, cuộn mỗi sợi một kiểu) — hình riêng cho các câu "một sợi cuộn thế này", "rất nhiều cách cuộn", "xếp khác đi" | c12, c13, c14, c17 | C | **Động**: `setCoil(k)`; **tự rung mỗi khung** | `strandFamily()` trong `set.js` (gọi `chain({n:80, bead:.0075, spread:.55})`) |
| **Khối cao su bị cắt** (mặt cắt toả ra, có 26 mảng màu làm mặt cắt không phẳng) — nền của cảnh N2 | c9–c26, c45 | B | Tĩnh | `mesh(rbox(7.0, 4.6, .5))` trong `set.js` |
| **Vệt nhiệt quét ngang mạng** (`heatFront`, mặt phẳng **quay mặt về phía máy**, texture mờ dần ở bốn cạnh) — mép cứng đọc ra là tấm kính màu chứ không phải hơi nóng | c22 | C | **Động**: quét ngang **trong phần mạng mà máy nhìn thấy** (`x` từ −.28 tới +.55), độ đục theo vị trí | `heatFront({len:1.2, w:.34})` |
| **Dải dây treo giữa hai điểm** (`sagBand`) — **một dải liền mạch** dựng bằng các lát cắt nối tiếp (nếu là chuỗi khối rời thì khe hở biến nó thành một cái lược), hai ghim ngang nhau; vùng nóng (trái) bị kéo thẳng, vùng lạnh (phải) thõng thành một vòng treo dưới dây | c23 | C | **Động**: `setSag(cold, taut)` — `cold` là độ thõng của vùng lạnh (0..1), `taut` là mức vùng nóng bị kéo thẳng (0..1); vùng nóng **ửng cam và tự sáng dần theo `taut`** (nhiệt thấy được là vào từ bên trái, không phải bật lên đã sẵn) | `sagBand()` trong `set.js` |
| **Hai mạng cạnh nhau** (3 sợi mát `#67e8f9` bên trái, 3 sợi nóng `#ff8a3d` bên phải, cùng số hạt, cùng chiều dài) — **cùng một mức kéo, khác độ cuộn** | c24 | C | **Động**: mạng nóng cuộn lại nhiều hơn mạng mát (`hotCoil`: .55 → .10; mạng mát đứng ở .85) | `chain({n:34, bead:.012, len:.30, turns:3, rad:.024})` |
| **Hai đoạn dây cùng một mức kéo** (`tensionSegment` ×2, mỗi đoạn có hai ghim và một quả cân treo giữa) — đoạn bên trái **mát** (dải đỏ `#c2183a`), đoạn bên phải **nóng** (dải cam `#ff8a3d`): hai dải phải **khác màu** thì câu "dây nóng co chặt hơn dây mát" mới đọc được trong một khung | c25, c26 | C | **Động**: `setPull(k)` — dây ngắn lại 18 %, quả cân **nhích lên**, dây đeo co theo | `tensionSegment()` trong `set.js` (quả cân `R = .055, H = .11`) |
| **Quả cân lớn treo giữa lát cắt** (`wgt`, `R = .05`, `H = .11`) — thân **kim loại** (vân sáng dọc, đáy tối hơn miệng) và **móc hình chữ J**; một thân nhựa màu hổ phách có vành đai quanh miệng và nắp kín thì đọc ra là hũ mật | c20, c25 | M | Tĩnh | `weight({R:.05, H:.11, color:'#c9973a'})` |

---

## Nhóm 3 — Bàn đo ban đêm (N3)

| Tên | Xuất hiện ở | LOD | Trạng thái | Hàm trong `src/props.js` |
|---|---|---|---|---|
| **Hai chân đế có đồng hồ đo lực** (`stand(GX = −.30)` và `stand(SX = .10)`): đế tròn, cột đứng cao `.41`, vạt kẹp đưa đồng hồ ra trước cột để dây treo không bị cột che. Hai cột **đứng sát nhau** (40 cm) để một khung hình đọc được cả hai đường lực–giãn | c28–c38 | M/C | Tĩnh vị trí | `dynamometer()` + khung chân đế trong `set.js` |
| **Đồng hồ đo lực** (`gauge`, mặt thang tròn, kim đỏ, **vạch là hình thật chứ không phải texture** — texture trên đĩa tròn bị cháy thành trắng dưới ánh sáng mạnh, và đồng hồ không đọc được vạch thì không phải đồng hồ; huy hiệu đơn vị là texture **nền tối** nên không bị cháy, in hai thang **`N`** (chữ lớn) và **`kgf`** (chữ nhỏ) như lực kế phòng thí nghiệm), **cung vạch có số của đồng hồ** in quanh mặt (số của đạo cụ, không phải con số phim nói — phim chỉ nói **14 %** qua thẻ) và một **vỏ ống kim loại phẳng** phía sau — **không có hai cửa sổ nhỏ bên hông**: hai ô vuông đọc ra là **la bàn**, không phải lực kế, và người xem không được thấy một cái lò xo cạnh dây đang bị kéo; **móc dưới là chữ J rõ ràng** (một vòng tròn nhỏ ở đáy thì đọc ra là đĩa cân của cân bàn) | c28, c35, c36, c37, c38 | C | **Động: kim xoay** (`setReading(k)`, kim luôn chỉ đúng vạch): lúc mát `.30`, lúc nóng `.52` (c36), rồi hai đường lực–giãn (c37–c38) | `dynamometer({R:.055})` |
| **Đồng hồ đo lực thứ hai** (`gauge2`, trên cột thép, cùng cỡ) | c37, c38 | C | **Động**: `.10` rồi `.74` — hai kim chạy **cùng lúc** để thấy thép lên đều, cao su vọt lên ở cuối | `dynamometer({R:.055})` |
| **Dây chun treo thẳng đứng** (`band`, dải `w = .020`, `t = .009`, treo từ `y = .30`; đầu trên **gập vòng qua đầu ghim**, dấu xuyên ghim trên dải) | c28–c38 | C | **Động: co lại dưới tải trọng** — `hangK = 1 − .22·deskK` khi nung (c31–c34); ở c35–c38 giữ ở một độ giãn cố định `1.10 + .28·ext` để hai lần đo là **cùng một độ giãn** | `strap({len:.16, w:.020, t:.009})` |
| **Quả cân vàng** (`wgt`, `R = .023`, **móc hình chữ J ở nắp** để móc vào dây treo) | c28–c34 | C | **Động**: y theo đáy dây (`bandBot − DROP`), nên **được nâng lên** khi dây co | `weight({R:.023, H:.05, color:'#c9973a'})` |
| **Thước đứng** (`rul`, `len = .42`, `w = .09`, số đếm **từ đáy lên**, vạch ở mép phải về phía quả cân, **có đế** để đứng vững) | c29, c33 | C | Tĩnh | `ruler({len:.42, w:.09, vertical:true})` |
| **Sợi thép treo** (`wire`, `len = .16`, `r = .003`) | c37, c38 | C | **Động: giãn ra 10 %** khi kéo (`wireK2 = 1 + .10·ext`) — thép cứng nên giãn ít hơn cao su | `steelWire({len:.16, r:.0022})` |
| **Quả cân thép** (`wgt2`, `#c7c9d8`) | **c28**, c37, c38 | C | **Động**: y theo đáy sợi thép | `weight({R:.023, H:.05, color:'#c7c9d8'})` |
| **Nhiệt kế chính** (`th`, `len = .28`, ống kính mờ + **bầu thủy ngân đỏ** + **cột thuỷ ngân xanh chạy lên trong ống** + **dải thang số nền tối dán sát ống** (đứng rời xa thì nó thành một tấm bảng treo), vạch trắng và số mỗi 10 °C từ 10 đến 40) — đo nhiệt của dây lúc thổi hơi nóng | c30, c32, c34 | C | **Động: cột dâng** (`setTemp(k)`, k = 0 là 20 °C, k = 1 là 60 °C) | `thermometer({len:.28})` |
| **Nhiệt kế nhỏ** (`th2`, `len = .20`) — **bầu nẹp nằm trong vòng dây**, đo riêng độ nóng sinh ra khi kéo | c39, c40, c41 | C | **Động**: cột dâng theo `jouleK` (0 → .55) | `thermometer({len:.20})` |
| **Vòng dây quanh bầu nhiệt kế** (`jb`, vòng cao su **dải dẹt** `R = .030` **nghiêng 55°** + một đuôi dây `.055` nằm sang trái, **hai đầu dán chồng** ở đoạn cuối) — **đây là cùng một sợi dây đã tháo khỏi móc**, dựng lại thành vòng quanh bầu nhiệt kế để hiệu ứng Joule có chỗ để xảy ra. Vòng là **dải dẹt nghiêng** chứ không phải vòng tròn có cánh: vòng tròn có cánh đọc ra thành kính lúp | c39, c40, c41 | C | **Động: tay giật đuôi dây** (`setYank(amp, phase)`: đuôi dây giãn rồi co, `s = 1 + .55·amp·(.5 + .5·sin)`) | `jouleBand({R:.030, tail:.055})` |
| **Máy sấy tóc ở bàn đo** (`dry`, ở `GX − .42`, tay cầm ở `GX − .62`) | c31, c34, c36 | C/M | Tĩnh vị trí; tay cầm bằng `handD3` | `hairdryer()` |
| **Luồng hơi nóng ở bàn đo** (`flowHot`, từ miệng máy tới dây chun ở `x = GX`) | c31, c34, c36 | M | **Động**, chỉ khi đang thổi (`k ∈ [31,34]` hoặc `k = 36`) | `heatFlow(...)` |
| **Bảng ghi chép trên tường** (`board`, 1,55 × 1,05 m, treo ngay sau bàn đo ở `x = −.08, y = .60`) — giấy nhớ có nét chữ vô nghĩa, ba tờ giấy trắng ghim, năm mảnh giấy màu. **Không vẽ đường cong lực–giãn lên bảng**: phần đó là câu chuyện của phim, không phải của nền. Bảng **rộng hơn 1,2 m** nên máy đo không tính nó là chủ thể: nó làm nền, không làm vật chính của cảnh | c28, c29, c33–c37 | B | Tĩnh | `rbox` + `canvasTex` trong `set.js` |

---

## Nhóm 4 — Tay (không có nhân vật)

| Tay | Xuất hiện ở | LOD | Trạng thái | Ghi chú |
|---|---|---|---|---|
| `handK` — tay cầm tay cầm máy sấy tóc ở bếp | c2, c8, c47, c48 | C | Động (đứng yên, ngón cuộn quanh tay cầm) | `gripSide(handK, N1.dryGrip.x − .20, …)` — cổ tay lùi 20 cm vì bàn tay dài 27 cm |
| `handK2` — tay cuốn dây quanh nắp ở lời chốt | c47 | C | Động | `gripDown` (ngón chỉ xuống) — chỉ xuất hiện đúng câu 47 |
| `handI` — tay kéo mạng chuỗi ra | c18–c21 | C | Động (kéo theo độ giãn của mạng) | tay quay ngược lại (`rotation.y = π`) để ngón nắm đúng mạng; **ngón nắm đúng hạt cuối** của sợi thứ tư (`z = −0.08`, cao độ `0.0225`): tay đặt ở `(.41·netScale + .119, .0675, −.062)`, và ngón tay gập quanh hạt nên **sợi xích chạy vào nắm tay**; bàn tay **nhỏ hơn** (`size .72`) để không nuốt cả khung với hạt xích 2 cm |
| `handD` — tay giữ dây ở một vạch thước | c35–c38 | C | Động (bất động ở vạch — đó là cái mốc của "cùng một độ giãn") | `gripSide(handD, N3.GX − .20, bandBot + .02, …)` |
| `handD2` — tay giữ quả cân của sợi thép | c37, c38 | C | Động | |
| `handD3` — tay cầm máy sấy tóc ở bàn đo | c31, c34, c36 | C | Động | |
| `handD4` — tay giật đuôi dây quanh bầu nhiệt kế | c39–c41 | C | **Động: giật qua lại** (theo `amp = .5 + .5·|sin(13t)|`) | vị trí tay tính mỗi khung theo độ giãn của đuôi dây |

---

## Nhóm 5 — Thẻ số (chỉ ba, mỗi thẻ có câu đọc)

| Thẻ | Câu | Nhìn gì | Vì sao đúng chỗ |
|---|---|---|---|
| `20 °C` | c30 | đỉnh cột thủy ngân của nhiệt kế chính | con số phải **là đỉnh một cột**, không phải chữ trôi; neo bằng toạ độ thế giới (`D.th.position` + chiều cao cột theo `tempK`) |
| `60 °C` | c32 | đỉnh cột thủy ngân, lúc cột đã dâng | cùng một cái neo với thẻ trên, nên người xem thấy **cùng một cột dài thêm** |
| `14 %` | c36 | mép phải mặt đồng hồ đo lực | **neo bằng toạ độ thế giới** `[N3.GX + .062, .381, N3.Z]` — không dùng `D.gauge.position` (đó là vị trí cục bộ trong chân đế, mũi tên sẽ chỉ ra khỏi đồng hồ) |

---

## Nhóm 6 — Bối cảnh và ánh sáng

| Nơi chốn | Dựng bằng | Ánh sáng | Ghi chú |
|---|---|---|---|
| **N1 bếp buổi sáng** | `kitchen(scene, {time:'morning'})` của rig, `noShaft(scene)` tắt đúng tia sáng hình nón (nó phủ một vệt kem lên cả khung), **ánh sáng chính +15 %** (`S.key.intensity *= 1.15`) cho các cận cảnh miệng hũ | sáng buổi sáng của set + nêm `#ffe6c4` cường độ .45 + **nêm ấm từ phía máy quay** (`DirectionalLight '#ffd9b0'` 1,7, đặt ở `(F.x − .30, .55, F.z + 1.1)` hắt vào máy sấy tóc): nắng đi từ cửa sổ ra **sau lưng vật**, nên mặt máy sấy tóc quay về khung là mặt tối và đọc ra là một cụng xanh lơ lửng | quầy ở `z ≈ .8`, tường gạch ở `z ≈ .2` |
| **N2 trong sợi dây** | nền tím gradient `#40326c → #251c42`, sương mù `#2c2350` từ 2.9 đến 6.4, khối cao su cắt ở `z = −1.45`, **vệt sáng từ trên rọi xuống mặt cắt** (`beam` alpha .13) | `keyLight` 3.5 từ trên-phải, `ambience` trời `#6f67b2` / đất `#41355f`, viền tím `#b79bff`, **nêm sáng mềm từ bên trái** `#ffd9b0` .85 (nhóm sợi tiền cảnh nằm ở phía tối) | cảnh này **tối hơn hẳn** bếp: đó là dấu hiệu "đã đi vào bên trong vật" |
| **N3 bàn đo ban đêm** | `desk(scene, {time:'night'})` của rig, `noShaft(scene)`, đèn bàn nới rộng (`angle = .78`, `intensity = 4.4`), thêm một đèn phụ `#cfe0ff` **1.05** từ phía máy quay để đọc được vạch thước, kim đồng hồ và cột thủy ngân, **bảng ghi chép** treo sau bàn đo | đèn bàn từ bên trái + nêm lạnh từ trước | mặt bàn ở `z = .91`; các cột đo ở `x = −.30` và `x = .10`; bộ Joule ở `x = .48` |

---

## Nhóm 7 — Sự kiện và nhịp

| Loại | Chỗ | Ghi chú |
|---|---|---|
| **Không khí** (`amb`) | đổi theo từng chặng: `kitchen` (bếp) → `low` (trong dây) → `night` (bàn đo) → `kitchen` (lời chốt) | một sự kiện cho mỗi chặng liên tiếp trong bảng nhát |
| **Nhạc** (`music`) | c1 (cue A), c9 (B), c28 (C), c42 (D), c47 (E), và `end` trước 2.2 giây cuối | mỗi chặng có một cue riêng |
| **Foley** | 30 sự kiện, chỉ ở nơi vật thật kêu: ghim (`metal_tap`), dây siết vào nắp (`plastic_set`), hũ đặt xuống (`glass_set`), luồng hơi (`whoosh_soft`), mạng cuộn lại (`cloth_rustle`), cột thủy ngân dâng (`blip_up`) | không có foley ở câu nào không có vật |
| **Mốc nhịp** (`markBeats`) | mỗi câu một điểm: điểm thẻ số nếu câu có thẻ, nếu không thì là **điểm máy đang nhìn** | mốc bám vào vật, không bám vào chữ trôi |
| **Sự kiện của phim** (`window.EV`) | tất cả nằm trong `EV` | `filmcheck` đòi `window.EV` không rỗng |

---

## Rủi ro lắp ghép đã xử lý

- **Thẻ `14 %` trỏ vào chỗ trống** — vì neo bằng `D.gauge.position` (vị trí cục bộ trong chân đế). Đã sửa thành toạ độ thế giới.
- **Dây treo biến mất khi đổi trạng thái** — `setLen(k)` phải giữ **đầu trên cố định** (`position.y = −len·s/2`), nếu gán `position.y` thì dây rời khỏi móc.
- **Tay không chạm vật** — bàn tay dài 27 cm (mu bàn tay ở +.11, ngón ở +.20…+.27), nên cổ tay phải lùi ~20 cm so với vật nó nắm.
- **Luồng hơi nóng đi dưới dây thay vì qua dây** — miệng máy phải ngang tầm dây (bếp: `y ≈ .19` so với dây ở `.198`; bàn đo: luồng đi tới `y = .22`).
- **Hiệu ứng Joule không có chỗ để xảy ra** — dây chun phải **quấn quanh bầu nhiệt kế** thật, và dây treo trên chân đế phải biến mất từ c39 (vì đó là cùng một sợi dây đã tháo ra).
- **Quả cân và dây không khớp chiều cao** — `D.wgt.position.y` phải tính từ `bandBot` (đáy dây sau khi co), không dùng hằng số.
- **Cảnh N3 trông như một mảng tường tím trống** — cột đo cao `.41` trên mặt bàn, còn tường là phần trên của khung, nên khung nào đặt cột giữa màn hình thì phần trên là tường. Đã dựng **bảng ghi chép 1,55 × 1,05 m** treo ngay sau bàn đo (`x = −.08, y = .60`) làm nền, và **đưa hai cột đo đứng sát nhau** (`GX = −.30`, `SX = .10`) để một khung hình đọc được cả hai đường lực–giãn thay vì một cột lơ lửng.
- **Bộ Joule chen chúc với cột thép** — chuyển cả bộ sang `x = .48` (tay giật đuôi dây tự theo vì nó đọc `N3.JX`), và bản ghi chép trên tường **không vẽ đường cong lực–giãn**: phần đo là câu chuyện của phim, không phải của nền.
