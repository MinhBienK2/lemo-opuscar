# Công cụ của kênh — chạy gì, và làm gì khi nó từ chối

Một tài liệu này thay cho việc đọc mã nguồn của công cụ. Một phiên làm phim đã đọc `review.sh`
85 lần, `rig/render.js` 60 lần, `gate.py` 30 lần — 449 lệnh, khoảng **350 nghìn token** ngữ cảnh —
chỉ để biết *chạy lệnh nào* và *khi nó từ chối thì làm gì*. Mỗi lần đọc là một lần đoán.

Các công cụ của `core/` có sẵn [`core/README.md`](../../../core/README.md); bảng này là của riêng kênh.

## Các lệnh

| Lệnh | Nó làm gì | Nó ghi đâu |
|---|---|---|
| `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --outline` | chấm dàn ý (`TREATMENT.md` + `research/FACTS.md`) | `review/OUTLINE-REVIEW.md`, tem `review/OUTLINE.pass` |
| `… --script` | chấm lời kể (`voice/lines.json`) | `review/SCRIPT-REVIEW.md`, tem `review/SCRIPT.pass` |
| `… --props` | chấm vật dựng: mỗi vật ba góc nhìn | `review/PROPS-REVIEW.md`, ảnh ở `review/props/`, tem `review/PROPS.pass` |
| `… --storyboard` | chấm dàn ý hình (`LOOK.md` + `src/film.js`) | `review/STORYBOARD-REVIEW.md`, tem `review/STORYBOARD.pass` |
| `… --assets` | so bảng đặc tả (`COMPONENTS_SPEC.md`) với mã dựng | `review/ASSET-AUDIT-REPORT.md`, tem `review/ASSETS.pass` |
| `…` (không cờ nào) | chấm hình: dựng tờ sheet rồi người chấm soi | `review/REVIEW.md`, tem `review/PICTURE.pass` |
| `… --chapter <id>` | chấm **một chương** của phim (`src/chapters.js`) | `review/REVIEW-<id>.md`, tem `review/PICTURE-<id>.pass` |
| `… --lines a-b` | chấm **một cảnh** (3 lượt) | `review/REVIEW-lines-a-b.md` |
| `… --video` | chấm phim đã dựng | `review/REVIEW-video.md` |
| `… --final` | nghiệm thu phim đã dựng (3 lượt) | `review/FINAL-QA-REPORT.md`, tem `review/FINAL.pass` |
| `python3 channels/tram-nghi-nhieu/tools/gate.py status <tập>` | tập đang ở đâu: tem nào có, tem nào không, vì sao | — |
| `python3 channels/tram-nghi-nhieu/tools/gate.py check --for render <tập>` | cổng: được dựng chưa | — |
| `node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <tập>/out/beats` | dựng tờ sheet (một khung cho mỗi câu) + cờ máy | `<tập>/out/beats/` |
| `python3 channels/tram-nghi-nhieu/tools/check_shots.py <tập>/out/beats` | đọc cờ máy ra thành **danh sách câu phải sửa** | — |
| `python3 channels/tram-nghi-nhieu/tools/check_labels.py <tập>` | nhãn có nằm ở câu gọi tên nó không; nhãn có vẽ số lời không đọc không | — |
| `python3 channels/tram-nghi-nhieu/tools/check_props_used.py <tập>` | vật nào trong danh mục chưa hề lên hình | — |
| `python3 channels/tram-nghi-nhieu/tools/check_research.py <tập>` | file nghiên cứu còn ô trống, mốc thiếu nguồn, Wikipedia đứng một mình | — |
| `python3 channels/tram-nghi-nhieu/tools/check_treatment.py <tập>` | dàn ý có đủ phần không (mốc, ba cấu trúc, lựa chọn) | — |
| `python3 channels/tram-nghi-nhieu/tools/check_storyboard.py <tập>` | `LOOK.md` có khớp lời kể không | — |
| `python3 channels/tram-nghi-nhieu/tools/check_voice_facts.py <tập>` | lời kể có nói cụm mà file nghiên cứu cấm không | — |
| `python3 channels/tram-nghi-nhieu/tools/check_delivery.py <tập>` | tập đủ giấy tờ bàn giao chưa | — |
| `python3 channels/tram-nghi-nhieu/tools/check_progress.py <tập>` | hai vòng chấm liên tiếp có so điểm không (`--all` cho cả kênh) | — |
| `python3 channels/tram-nghi-nhieu/tools/check_reports.py [<tập> …]` | các bản chấm có đủ phần và đúng mẫu không | — |
| `python3 channels/tram-nghi-nhieu/tools/check_prompts.py` | lời dặn nào trong `review.sh` bị shell cắt mất (một `"` chưa escape là mất 83 % lời dặn) | — |
| `.venv/bin/python channels/tram-nghi-nhieu/tools/mix.py <tập>` | nhạc, ambience, foley, master −14 LUFS | `<tập>/out/` |
| `python3 channels/tram-nghi-nhieu/tools/mk_timeline.py <tập>` | tính timeline từ giọng đọc | `src/timeline.js` |

Mọi lệnh chạy từ **gốc thư viện**. Mọi lệnh dựng hình (`still.mjs`, `beatsheet.mjs`, `review.sh`,
`build.sh`) cần `LEMO_ANGLE=vulkan` ở đầu lệnh.

## Thứ tự các bước, và điều kiện của từng bước

```
dàn ý → lời → vật dựng → dàn ý hình → bảng đặc tả → hình → dựng phim → âm thanh → bàn giao
```

Cổng mở theo thứ tự: bước sau **cần** tem của bước trước. `gate.py status <tập>` nói tập đang ở
đâu và còn thiếu gì.

Tập dài (> 30 câu) thì **chia chương trước** — `src/chapters.js`, mỗi chương
`{ id: 'ch1', lines: ['c1', 'c10'], files: [...] }`, các chương phủ hết các câu, đúng thứ tự — rồi
chấm `--chapter <id>` (5 lượt mỗi chương). Vòng chấm cả phim soi được khoảng 25 khung, tốn ~40 phút,
và cả phim chỉ có 5 lượt: một tập 60 câu không thể hội tụ theo đường cả phim.

## Vòng chấm

| Bước | Ngân sách | Báo cáo |
|---|---|---|
| dàn ý | 4 lượt | `review/OUTLINE-REVIEW.md` |
| lời | 6 lượt | `review/SCRIPT-REVIEW.md` |
| vật dựng | 5 lượt | `review/PROPS-REVIEW.md` |
| dàn ý hình | 5 lượt | `review/STORYBOARD-REVIEW.md` |
| bảng đặc tả | 5 lượt | `review/ASSET-AUDIT-REPORT.md` |
| hình (cả phim hoặc một chương) | 5 lượt | `review/REVIEW.md` |
| hình (một cảnh, `--lines a-b`) | 3 lượt | `review/REVIEW-lines-a-b.md` |
| nghiệm thu (`--final`) | 3 lượt | `review/FINAL-QA-REPORT.md` |

- **Một tập, một vòng, một phần.** Công cụ giữ khoá: mở vòng thứ hai khi vòng thứ nhất còn chạy là
  hai bản chấm đè lên nhau và hai vòng bị tính. Chờ, rồi đọc bản chấm vòng trước đã ghi.
- **Người chấm chỉ in câu trả lời khi đã xong.** Suốt thời gian nó nghĩ, tệp output gần như rỗng —
  đó là bình thường. Đừng mở tệp output để "kiểm tra xem còn sống không".
- **Cờ máy tự FAIL vòng.** `DARK SAME RUN NUM` (hình) và `DIGIT LONG NOFACTS` (lời) đứng cho tới khi
  người chấm ghi `CỜ SAI <CỜ>: <vì sao>` đúng câu đó. Đọc danh sách câu phải sửa **trước** khi mở
  vòng: `check_shots.py <tập>/out/beats`.
- **Tờ sheet được dùng lại.** Nếu mã không đổi từ lúc tờ sheet được dựng, vòng chấm dùng lại tờ đó
  thay vì dựng lại sáu mươi khung.

## Đạo diễn cắt — lối ra khi hết lượt

Hết lượt thì **không** chấm lần thứ sáu. Có ba lối ra, rẻ nhất trước:

1. `--lines a-b` — chấm lại đúng những câu đã sửa (3 lượt mỗi cảnh);
2. chia chương rồi chấm từng chương (nếu chưa có `src/chapters.js`);
3. **đạo diễn cắt**: viết một tệp trong `review/`, kết thúc bằng dòng `VERDICT: PASS`, nêu rõ cái gì
   đã cắt — và **viết sau lần sửa code cuối cùng**, vì cổng so mốc và từ chối một bản cắt cũ.

| Bước | Tệp bản cắt |
|---|---|
| vật dựng | `review/PROPS-DIRECTORS-CUT.md` |
| dàn ý hình | `review/STORYBOARD-DIRECTORS-CUT.md` |
| bảng đặc tả | `review/ASSET-AUDIT-DIRECTORS-CUT.md` |
| hình | `review/REVIEW-DIRECTORS-CUT.md` (`review/REVIEW-<chương>-DIRECTORS-CUT.md` nếu chấm theo chương) |

Dàn ý không có bản cắt: hết lượt thì báo người dùng các lỗi còn lại và hỏi hướng đi.

## Khi công cụ từ chối

| Công cụ nói | Nghĩa là | Làm gì |
|---|---|---|
| `đã có một vòng chấm … đang chạy` | một người chấm khác đang chạy trên phần đó | **Chờ.** Đọc bản chấm nó đã ghi trong `review/`. Đừng mở người chấm thứ hai. |
| `người chấm không trả lời trong …` | người chấm bị treo, **không phải** phán quyết về phim | Đọc `out.txt` trong thư mục làm việc của vòng đó, sửa nguyên nhân, chạy lại. Vòng bị treo không mất lượt. |
| `người chấm không trả lời (không có dòng VERDICT nào)` | vòng chấm không có phán quyết nào — người chấm đã không trả lời, **không phải** phán quyết về phim | Đọc `out.txt` trong thư mục làm việc của vòng đó (dòng cảnh báo của CLI như `unrecognized_model` không phải câu trả lời), sửa nguyên nhân rồi chạy lại. Vòng hỏng không mất lượt. |
| `lần đoán thứ hai không trả lời` | phép đo bổ sung của vòng chấm vật dựng không có | Vòng đi tiếp với một lần đoán. Muốn có lần đoán thứ hai thì chạy lại `--props`. |
| `đã chấm N lượt mà chưa PASS` | hết ngân sách của bước đó | Ba lối ra ở trên. **Đừng bàn giao như một phim đã đạt.** |
| `bản cắt không còn nói về code hiện tại` | bản cắt viết trước lần sửa code cuối | Sửa code xong, viết lại bản cắt, chạy lại. |
| `nhãn lệch câu, hoặc nhãn vẽ một con số mà lời kể không đọc` | `check_labels.py` bắt được | Sửa `src/film.js`: nhãn nằm ở câu gọi tên nó, mọi con số trên nhãn phải có lời kể đọc. |
| `dàn ý lệch lời kể` | `LOOK.md` không khớp `voice/lines.json` | Sửa `LOOK.md` cho khớp lời kể — lời kể là chuẩn. |
| `phim dài (N câu) mà chưa có src/chapters.js` | phim dài đang đi trên đường chấm cả phim | Chia chương (`src/chapters.js`) rồi chấm `--chapter <id>`. Quyết việc này lúc dàn ý thì rẻ hơn nhiều. |
| `TREATMENT.md còn chỗ của khuôn chưa viết` | dàn ý còn ô trống | Điền rồi chạy lại. |
| `cần TREATMENT.md và research/FACTS.md` | chưa có tài liệu nền | Viết `TREATMENT.md` và `research/FACTS.md` rồi chấm lại. |
| `COULD NOT RUN (exit 2)` | bài kiểm tra **không chạy được**, chưa phải phán quyết | Để code đứng yên rồi chạy lại; dòng ngay dưới nói lý do. |

## Sửa tệp của tập

Sửa bằng công cụ sửa file, không bằng shell: `edit` / `write`, hoặc một lệnh cho nhiều sửa dài:

```sh
python3 tools/replace.py --batch - <<'JSON'
[{"file": "src/film.js", "old": "...", "new": "..."},
 {"file": "src/props.js", "old": "...", "new": "..."}]
JSON
```

Mọi sửa được kiểm tra trước khi tệp nào bị ghi, và mỗi tệp được ghi nguyên tệp mới đè lên tệp cũ.
Luật đầy đủ: [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md) R1.

## Còn gì nữa

- Quy trình từng bước: `.agents/skills/tram-nghi-nhieu/step*/GUIDE.md`
- API của rig 3D: [`rig/README.md`](../rig/README.md)
- Công cụ dùng chung của thư viện: [`core/README.md`](../../../core/README.md)
