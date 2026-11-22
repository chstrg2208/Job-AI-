# ⚡ TBR HealthSherpa Renew 2027 Helper (0 Token)

Tiện ích Chrome chạy **100% nội bộ bằng JavaScript** (không tốn token, không gửi dữ liệu ra ngoài), hỗ trợ đi hồ sơ **Renew 2027 trên HealthSherpa** từ `Privacy statement` cho tới **`Finalize → Review`**, tự dừng hỏi ở các bước nhạy cảm và dừng lại để bạn tự làm **3 bước cuối (`Agreements → Tax attestation → Sign and submit`)**.

---

## 1. Cài đặt lên Chrome (1 phút)

1. Mở Google Chrome (hoặc Chrome trên máy Remote Splashtop) và vào:
   ```text
   chrome://extensions/
   ```
2. Bật công tắc **Developer mode** ở góc trên bên phải.
3. Bấm **Load unpacked** ở góc trên bên trái.
4. Chọn đúng thư mục:
   ```text
   E:\Job\tbr-hsp-renew-extension
   ```
5. F5 lại tab **HealthSherpa** và tab **TBR CRM** đang mở.

---

## 2. Cách sử dụng hàng ngày (2 lượt nhanh)

### Bước chuẩn bị dữ liệu (chọn 1 trong 2 cách):
* **Cách A (từ tab CRM `app.thebestrateins.com`):** Mở Contact/Deal khách, bôi đen đoạn Note RTE (nếu cần) rồi bấm nút **`📋 Gửi data sang HealthSherpa`** ở góc dưới bên phải — dữ liệu tự bay sang tab HealthSherpa.
* **Cách B (Dán trực tiếp):** Ở bảng nổi bên phải trên HealthSherpa, dán thẳng Note RTE + Email thật của khách vào ô **Dữ liệu khách** (phần mềm tự tách `Enrolled address`, `Mailing address`, `County`, `Income`, `HH / Apply`, `Email`).

### Lượt 1: Mở Edit hồ sơ Renew 2027 $\rightarrow$ đi tới `Review`
1. Bạn tự vào đúng khách và bấm mở **Edit** hồ sơ 2027 trên HealthSherpa.
2. Trên bảng nổi góc phải, bấm **`▶ Chạy tự động đến Review`**.
3. Phần mềm tự điền tuần tự:
   * **Privacy statement:** Tích 2 ô + chọn `Store consent outside of HealthSherpa`.
   * **Primary contact:** Cập nhật **Home address**, **County**, **Mailing address**; kiểm tra Email/Phone (nếu bị khóa ở Lượt 1 thì tự ghi chú nhắc sửa ở Lượt 2).
   * **Household:** `Cost savings = Yes`, kiểm tra số người apply, bỏ trống Medicare, `Residence = Yes`, và **dừng hỏi bạn xác nhận mục Khai thuế (`Tax household`)**.
   * **Additional information / Members:** Mặc định `No` cho các câu sàng lọc phụ, giữ nguyên quốc tịch/di trú.
   * **Income:** Tự đổi thu nhập sang mức mới (`Yearly`) và bấm `Save` nếu có 1 nguồn thu nhập (tự `No` cho trẻ em; tự dừng hỏi nếu có nhiều nguồn thu nhập).
   * **Extra help:** Tự phát hiện bé dưới 18/19 tuổi $\rightarrow$ gợi ý tích **Denied Medicaid** (`11/01/2026`) và **dừng hỏi bạn xác nhận**.
   * **Coverage / Employer / Additional questions:** Chọn `No` cho `currently enrolled`, bỏ trống hoàn toàn **SEP** (vì Renew 2027).
4. **Dừng hẳn tại `Finalize → Review`:** Hiện bảng kiểm tra Xanh ✅ / Vàng ⚠️ / Đỏ 🚨 (báo ngay nếu County chưa lưu hoặc Email cần đổi ở Lượt 2).
5. Bạn kiểm tra xong rồi tự làm **3 bước cuối** (`Agreements → Tax attestation → Sign and submit`).

### Lượt 2: Cập nhật Email / Phone / County sau khi Submit lần đầu
1. Mở lại **Edit** trên hồ sơ vừa Submit (lúc này ô Email & Phone đã mở khóa).
2. Bấm **`🔧 Lượt 2 (Email/County)`** để phần mềm tự điền Email thật / Phone / County mới và kiểm tra lại lần cuối.
