# TỔNG HỢP MEETING: TÂM PHAN & TIGER TRƯƠNG (13/11/2026)

- **Nguồn video:** `E:\Job\Video\RingCentral_Video_meeting_2026-11-13_23-04-39.mp4` (Thời lượng: 21:43 | 3:05 PM – 3:24 PM ngày 11/13/2026)
- **Thành phần tham gia:** Chị **Tâm Phan** (`Tam Phan`), **Tiger Trương** (`Tiger Truong`), và **Quỳnh Trâm Nguyễn** (`Quynh Tram Nguyen` tham gia trao đổi một case từ `08:54` – `12:46`).

---

## 1. Cách check Medicaid & kiểm tra Level `QMB` / `QMB+` cho hồ sơ Dual D-SNP

### Nguyên tắc bắt buộc
* **Không chỉ dựa vào SimplyEnroll (SunFire):** Đôi khi SimplyEnroll hiển thị `QMB+`, nhưng cổng của hãng lại không ghi nhận → sẽ bị *pending*, không enroll được. Muốn enroll hãng nào thì **kiểm tra trực tiếp trên Portal của chính hãng đó** (portal này không ra thì kiểm tra chéo sang portal khác).
* Cần thông tin cụ thể của khách (tên, ngày sinh, Zipcode, kèm **SSN hoặc Medicaid ID / Medicare Number MBI**). Nếu chỉ hỏi miệng không có thông tin định danh thì không tra được.

### Cách kiểm tra trên từng hệ thống
1. **UHC Jarvis (`uhcjarvis.com`):**
   * Vào `Sales Tools` → `Medicare & Medicaid Eligibility Lookup` → chọn tab **`Medicaid Eligibility`**.
   * Nhập `State`, `Zip Code`, `County`, `First Name`, `Last Name`, `Gender`, `Date of Birth`, `Proposed Effective Date` (`01/01/2027`), chọn `Medicaid Number` hoặc `SSN` (`Medicare Number (Optional)` — bắt buộc nếu cần confirm Integrated SEP), tích `Permission: Yes` → bấm **`Check Medicaid Eligibility`**.
2. **Devoted (`agent.devoted.com`):**
   * Vào mục **`Eligibility`** → bấm **`Add New Prospect Eligibility Query`** (`Consolidated Eligibility Check`) để kiểm tra Medicare hoặc Medicaid.
3. **Humana Vantage (`agentportal.humana.com`):**
   * Chọn `Retail Business` & HPN → vào `Vantage Portal` → mục `Quote & Enroll` chọn **`Eligibility Verification`** → tab **`DSNP Eligibility`** (`Plan Year 2027`, nhập State, tên, DOB, Gender + SSN/Medicaid ID & Medicare ID).
4. **Cách cho Agent tự check:**
   * Nếu Agent có **SimplyEnroll (`sunfirematrix.com`)**: nhập `Zip Code` + `Medicare Number (MBI)` + `Date of Birth` ngay ở màn hình `Needs Assessment` (`Customer lookup`, tích BEQ Consent) trước khi vào xem plan (vì nếu bỏ qua bước đầu, khi bấm `Enroll` gói D-SNP bên trong vẫn hỏi số).
   * Nếu không tra được qua SimplyEnroll: lên thẳng **Portal Medicaid của tiểu bang** (ví dụ bang Mississippi: `medicaid.ms.gov` → `MESA MEMBER PORTAL` hoặc tạo/đăng nhập `ACCESS MS` tại `access.ms.gov`) hoặc gọi tổng đài Medicaid bang.

### Thực hành kiểm tra case khách Mississippi (`SA NGUYEN`)
* **Thông tin khách:** Tên `SA NGUYEN`, `DOB: 01/01/1956`, `Medicaid ID: 902029222`, Zip `39530` (`Harrison County, MS`), thẻ xanh dương *Mississippi Division of Medicaid*, chưa có SSN/MBI.
* **Kết quả tra trên UHC Jarvis:** `Medicaid Level = QMB` (**QMB Only**, không phải `QMB+`).
  * Hệ thống UHC Jarvis báo `Eligible = Yes` với một số gói (như `UHC Dual Complete MS-Q1 (PPO D-SNP)` `H1889-045-002`, `UHC Dual Complete MS-S4`), `No` với `UHC Dual Complete MS-S3`.
* **Quy tắc đọc điều kiện nhận Level trên SimplyEnroll (`D-SNP`):**
  * Phải bấm mở từng plan và xem dòng **`Medicaid accepted`**:
    * Có chữ **`QMB Only`** hoặc **`All level`** → Khách `QMB Only` **vào được** (ví dụ `Devoted Dual Choice Plus 003 MS` `H7333-003-000`: `QMB Only, QMB+, SLMB+, Full FBDE`).
    * Chỉ ghi **`QMB+, SLMB+, Full FBDE`** (không có `QMB Only`, ví dụ `WellCare Magnolia Health Dual Liberty` `H1416-044-000`, `Humana Gold Plus SNP-DE` `H1036-328-000`) → Khách `QMB Only` **KHÔNG vào được**.

---

## 2. Xử lý tồn đọng Dashboard Team Tiger Truong (Chỉ đạo CEO Phúc Trịnh)

### Deadline & Thứ tự ưu tiên
* **Deadline Medicare:** Hết ngày **`07/12`** là đóng, không làm Medicare được nữa → Phải **dọn sạch tồn đọng Medicare sớm** để tập trung toàn lực cho **Obamacare**.
* CEO **Phúc Trịnh** yêu cầu không giữ hồ sơ kẹt ở các stage chờ:
  1. Ưu tiên 1: **`New Opportunity / Call to Renew`**
  2. Ưu tiên 2: **`Waiting for Document`**
  3. Ưu tiên 3: **`Need Agent Contact`**

### Tình hình Team Tiger Truong (`861` deals Obamacare 2027 | `108` deals Medicare 2027)
1. **Medicare 2027:**
   * **`New Opportunity / Call to Renew` (`4` deals):** `Anya Nguyen` 3 deals (*Chan T Nguyen*, *Kim Anh L Nguyen*, *Hai Van Truong*), `Ivy Le` 1 deal (của Trí Châu) → Tiger xử lý dứt điểm sớm.
   * **`Waiting for Document` (`7` deals):** `Sean Ngo` 3, `Anya Nguyen` 3, `Sarah Thai` 1.
   * **`Need Agent Contact` (`11` deals):** `Sean Ngo` 7, `Ivy Le` 3, `Sarah Thai` 1 (chủ yếu khách của Trí Châu, Khánh Nguyễn và 1–2 deal của Trần Nguyễn Lê) → nhắc Agent liên hệ để move stage.
2. **Obamacare 2027 — Xử lý `81` deals `New Opportunity / Call to Renew` (`72` deals của Khánh Nguyễn):**
   * Support đã gọi xong nhóm `New Opportunity` của Khánh Nguyễn (`Anya` phụ trách `72` deals), còn lại là trường hợp không gọi được / chờ Khánh gọi lại khách.
   * **Hướng chốt:** Gửi danh sách nhắc anh Khánh gọi/quote lại; đồng thời Tiger **nhờ IT chuyển toàn bộ `72` deals này từ `New Opportunity / Call to Renew` sang `Need Agent Contact`** để làm sạch pipeline `New Opp`.

### Chuẩn hóa `Waiting for Document` & Khách cũ thiếu Consent Form (CF)
* **Ghi rõ giấy tờ đang chờ ở dòng đầu tiên** (ngay trên tên Deal hoặc đầu ghi chú, ví dụ `SOA - ...`, `Need CF ...`). Không để trống khiến không biết đang đợi gì; các deal chỉ đang *chờ Agent confirm* (như một ca ghi check phí) thì không được để ở `Waiting for Document`.
* **Quy tắc Khách cũ thiếu Consent Form (OB):** Với **khách cũ của mình**, dù chưa thu được Consent Form vẫn **phải chạy Quote và đẩy đi (`Need to Quote` → `Ready to Enroll`) để enroll giữ bảo hiểm trước**, sau đó collect CF bổ sung (vẫn note cần CF). Tiger đã và đang áp dụng cho nhóm Trí Châu (đẩy hơn chục ca).

---

## 3. Hai case cụ thể được xử lý trực tiếp

1. **Case `Hải Vân Trương / Hải Vân Đoàn` (`D26014275` — `Khanh Nguyen` / `Anya Nguyen`):**
   * **Phần Obamacare (Quỳnh Trâm hỏi cho chị Hải Vân):** Trước kia hai vợ chồng mua chung OB; tháng 7 chồng tách sang Medicare (được anh Phúc hỗ trợ). Năm trước vì khách mổ tim nên hạ income để lấy plan MOOP thấp (chấp nhận đóng thuế bổ sung cuối năm nếu lệch). Năm nay khách **đã mổ xong, chỉ cần tái khám (check-up)** → Chị Tâm hướng dẫn Quỳnh Trâm nhắn tên `Hải Vân Đoàn` vào task để check lại income đã khai & số tháng chênh lệch nhằm ước tính phần thuế phải hoàn; khi chọn gói mới thì so sánh giữa tiền thuế đóng lại cuối năm với lợi ích MOOP — nếu không còn rủi ro phẫu thuật lớn thì chọn gói bình thường đúng income thực tế để đỡ bị phạt cuối năm.
   * **Phần Medicare (`11/2026` & `01/2027`):** Deal `11/2026` đã enroll `Wellpoint Select (HMO-POS)` (`$0`, đã upload SOA, `Enrolled - Active`, hiệu lực `11/01/2026`). Vì tháng 11–12 chưa đủ **3 tháng** để Agent có commission (`cần ít nhất 3 tháng active`), thông thường phải giữ **Auto-renew** sang `2027` chứ ít ai đổi ở tháng 1. Do đang có ý định của anh Khánh (nhắc chuyển `Select`/`Wellcare`?), Tiger cần **nhắn thẳng vào group anh Khánh xác nhận giữ Auto-renew hay đổi plan** để move deal `2027` khỏi stage `New Opportunity`.
