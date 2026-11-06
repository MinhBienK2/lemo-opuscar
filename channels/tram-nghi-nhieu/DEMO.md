# Demo của kênh

`demo/`: 18 giây, không lời. Vì sao điện thoại sạc dưới gối lại nóng.

| Thời điểm | Cảnh | Kỹ thuật đáng học |
|---|---|---|
| 0–4 s | Phòng ngủ ban đêm, điện thoại sạc dưới mép gối | Trăng đi qua lỗ cửa sổ thật (`wallWithHole`) in song cửa và bóng lá lay lên chăn; vệt sáng (`beam`) có bụi; nguồn ấm duy nhất là màn hình |
| 4–8 s | Theo dòng điện dọc dây sạc | Máy bám đường cong của dây, nhìn trước; hạt cyan chạy trên `CatmullRomCurve3`; loé cyan khi vào cổng |
| 8–13 s | Cắt bổ: pin, phễu, cửa hẹp | Electron theo bảng vận tốc (`speedTable`) dồn cục ở cửa; mỗi electron qua cửa bắn tia lửa có trọng lực; pin chuyển cyan → cam → đỏ; nhãn NHIỆT JOULE |
| 13–18 s | Nhiệt bị gối nhốt, tay kéo gối | Gợn nhiệt (`squiggle`) chạm trần thì gập xuống; tay lấy đà, giật có vượt đà; gợn thoát lên, máy nguội |

Render: `LEMO_ANGLE=vulkan node core/render/video.mjs channels/tram-nghi-nhieu/demo --fps 24 --workers 2` (≈ 40 s). Still: `node core/render/still.mjs channels/tram-nghi-nhieu/demo 2 11 17 --out /tmp/x`.

Điểm yếu còn lại (đừng chép): shot 4–8 s quá cận, nền chỉ là mảng mờ; các lớp pin là khối trơn, mặt pin kem quá sáng; tay là capsule ghép.

## `demo/cutaway/`: 8 giây, mặt cắt

Chai nước ngọt cắt dọc trên bàn ban đêm. Lúc chai còn đóng, khí tan trong nước thành những chấm cyan (`dissolved`). Nắp bật ra thì khí xì thành tia (`sparks`), bọt nở trên thành chai rồi nổi lên (`fizz`), cột bọt leo lên cổ và trào ra ngoài (`foam`). Đèn bàn (`pool`) rọi mặt cắt từ phía máy; trăng qua cửa sổ chỉ tạo dáng cho căn phòng. Ảnh: `demo/stills/cutaway_*.jpg`.

Điểm yếu còn lại: bóng trăng qua cửa sổ không in rõ lên bàn; cột bọt đều quá, giống một cái trụ; sách là khối trơn.
