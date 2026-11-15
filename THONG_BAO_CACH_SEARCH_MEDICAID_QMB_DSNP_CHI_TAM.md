# 📢 THÔNG BÁO NỘI BỘ: HƯỚNG DẪN TRA CỨU MEDICAID & KIỂM TRA LEVEL `QMB` / `QMB+` CHO HỒ SƠ DUAL D-SNP

* **Phạm vi áp dụng:** Toàn thể Đội ngũ Support, Manager & Agent — **The Best Rate Insurance (Team Tiger Trương)**
* **Nguồn nghiệp vụ:** Hướng dẫn trực tiếp từ Chị **Tâm Phan (`Tam Phan`)** trong cuộc họp ngày **13/11/2026** ([Tong_Hop_Meeting_Tam_Phan_Tiger_2026-11-13.md](file:///E:/Job/Video/Tong_Hop_Meeting_Tam_Phan_Tiger_2026-11-13.md)), đối chiếu cùng quy chuẩn xử lý lỗi `MATCHING RULES INELIGIBLE` ([ChiDao_Manager_Moi.md](file:///E:/Job/ChiDao_Manager_Moi.md)).

---

## ⚠️ 1. NGUYÊN TẮC BẮT BUỘC TRƯỚC KHI CHECK & ENROLL D-SNP

1. **Không chỉ dựa vào SimplyEnroll (`SunFire`):**
   * Có trường hợp SimplyEnroll hiển thị `QMB+`, nhưng cổng của hãng bảo hiểm lại **không ghi nhận dữ liệu Medicaid** → đơn sẽ bị **Pending / Denied**, không enroll được.
   * **Quy tắc vàng:** **Muốn enroll hãng nào thì BẮT BUỘC kiểm tra trực tiếp trên Portal của chính hãng đó.** Nếu portal hãng này chưa lên dữ liệu, kiểm tra chéo sang các portal còn lại.
2. **Phải thu thập đủ thông tin định danh trước khi tra cứu:**
   * Bắt buộc có: **Họ tên**, **Ngày sinh (`DOB`)**, **Tiểu bang (`State`)**, **Zip Code**, kèm ít nhất 1 mã định danh: **SSN** hoặc **Medicaid ID** / **Medicare Number (`MBI`)**.
   * Không hỏi miệng chung chung khi chưa có thông tin định danh cụ thể của khách.
3. **Phân vai Agent vs Support:**
   * Agent chịu trách nhiệm thu thập thông tin khách & tư vấn quyền lợi gói; Support dùng các cổng bên dưới để tra cứu điều kiện Medicaid, xác nhận mức `QMB`/`QMB+`, và báo Agent chốt plan trước khi chuyển `RTE`.

---

## 🖥️ 2. BỐN CỔNG TRA CỨU MEDICAID & QUY TRÌNH THAO TÁC CHUẨN

| # | Hệ thống / Cổng | Đường dẫn thao tác trên Portal | Dữ liệu đầu vào bắt buộc | Ghi chú thực chiến |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **UHC Jarvis**<br>(`uhcjarvis.com`) | `Sales Tools` → `Medicare & Medicaid Eligibility Lookup` → Tab **`Medicaid Eligibility`** | `State`, `Zip Code`, `County`, `First Name`, `Last Name`, `Gender`, `Date of Birth`, `Proposed Effective Date` *(VD: `01/01/2027`)*, chọn **`Medicaid Number`** hoặc **`SSN`**, tích **`Permission: Yes`** → bấm **`Check Medicaid Eligibility`** | Nhập thêm `Medicare Number (Optional)` nếu cần confirm **Integrated SEP**. Kết quả trả về luôn **Medicaid Level** (`QMB`, `QMB+`...) và cột **`Eligible = Yes / No`** theo từng gói UHC *(VD case `SA NGUYEN`: `MS-Q1`, `MS-S4` = `Yes`; `MS-S3` = `No`)*. |
| **2** | **Devoted Agent Portal**<br>(`agent.devoted.com`) | Mục **`Eligibility`** → Bấm **`Add New Prospect Eligibility Query`** (`Consolidated Eligibility Check`) | Thông tin định danh khách + mã số Medicare/Medicaid hoặc SSN | Kiểm tra đồng thời cả tình trạng **Medicare** và **Medicaid**. |
| **3** | **Humana Vantage**<br>(`agentportal.humana.com`) | Chọn `Retail Business` & HPN → Vào **`Vantage Portal`** → Mục `Quote & Enroll` → **`Eligibility Verification`** → Tab **`DSNP Eligibility`** | Chọn `Plan Year 2027`, nhập `State`, Họ tên, `DOB`, `Gender`, kèm `SSN` / `Medicaid ID` & `Medicare ID (MBI)` | Kiểm tra trực tiếp điều kiện hợp lệ các gói D-SNP của Humana trước khi nộp đơn. |
| **4** | **SimplyEnroll** (`sunfirematrix.com`) **& Portal Medicaid Bang** | • **SimplyEnroll:** Nhập ở bước đầu **`Needs Assessment`** (`Customer lookup`, tích **`BEQ Consent`**)<br>• **Portal Medicaid Bang:** Lên trực tiếp cổng tiểu bang hoặc gọi tổng đài Medicaid bang *(VD Mississippi: `medicaid.ms.gov` → `MESA MEMBER PORTAL`, hoặc `access.ms.gov`)* | **SimplyEnroll:** **`Zip Code` + `Medicare Number (MBI)` + `Date of Birth`**<br>**Portal bang:** Thông tin định danh / Medicaid ID của khách | Phải nhập MBI & DOB ngay màn hình `Needs Assessment` đầu tiên; nếu bỏ qua, khi vào trong bấm `Enroll` gói D-SNP hệ thống vẫn bắt nhập lại. Dùng Portal bang khi tất cả cổng hãng & SimplyEnroll đều không ra dữ liệu. |

---

## 🔍 3. CÁCH ĐỌC MỨC MEDICAID (`QMB` vs `QMB+`) TRÊN SIMPLYENROLL ĐỂ CHỌN ĐÚNG GÓI

Khi đã tra được **Medicaid Level** của khách (đặc biệt khi khách chỉ có **`QMB` / `QMB Only`** mà không phải **`QMB+`**), trên SimplyEnroll **BẮT BUỘC bấm mở chi tiết từng gói D-SNP** và đọc kỹ dòng **`Medicaid accepted`**:

* ✅ **KHÁCH `QMB Only` APPLY ĐƯỢC:** Khi dòng `Medicaid accepted` ghi rõ **`QMB Only`** hoặc **`All level`**.
  * *Ví dụ thực tế:* `Devoted Dual Choice Plus 003 MS` (`H7333-003-000`) hiển thị **`QMB Only, QMB+, SLMB+, Full FBDE`**; hoặc các gói chuyên `QMB Only` như `Humana Dual QMB Only (PPO D-SNP)`.
* ❌ **KHÁCH `QMB Only` KHÔNG APPLY ĐƯỢC:** Khi dòng `Medicaid accepted` **chỉ** liệt kê **`QMB+, SLMB+, Full FBDE`** (không có chữ `QMB Only`).
  * *Ví dụ thực tế:* `WellCare Magnolia Health Dual Liberty` (`H1416-044-000`), `Humana Gold Plus SNP-DE` (`H1036-328-000`).

### 📌 Case Study Mẫu Từ Cuộc Họp (`SA NGUYEN` — Mississippi)
* **Hồ sơ thực tế:** Khách cầm thẻ xanh dương *Mississippi Division of Medicaid*, `Medicaid ID: 902029222`, `DOB: 01/01/1956`, Zip `39530` (*Harrison County, MS*), chưa có SSN/MBI trên tay.
* **Kiểm tra chéo trên UHC Jarvis:** Hệ thống trả kết quả **`Medicaid Level = QMB`** *(tức `QMB Only`, không phải `QMB+`)*.
* **Kết quả gói được nhận:** UHC Jarvis báo `Eligible = Yes` với `UHC Dual Complete MS-Q1 (PPO D-SNP)` (`H1889-045-002`) và `UHC Dual Complete MS-S4`, báo `No` với `UHC Dual Complete MS-S3`.

---

## 🛠️ 4. XỬ LÝ NHANH KHI ĐƠN D-SNP BỊ BÁO LỖI `MATCHING RULES INELIGIBLE` (UHC JARVIS)

Nếu sau khi submit đơn thấy trạng thái **`Action required` (dấu chấm cam) — Reason: `MATCHING RULES INELIGIBLE`**, cần rà soát ngay 4 nguyên nhân:
1. Khách **chưa có / đã hết hạn Medicaid** tại tiểu bang đó.
2. **Sai cấp độ Medicaid** (khách là Partial Dual như `QMB Only` / `SLMB` / `QI` nhưng gói chọn lại yêu cầu Full Dual `QMB+` / `FBDE`).
3. **Sai lệch định danh:** Số `Medicaid ID` gõ sai, hoặc Họ tên / `DOB` giữa Medicare và Sở Medicaid không khớp từng ký tự.
4. **Lệch vùng phục vụ (`County / Service Area`)** so với Plan Code đã nộp.

**Quy trình gỡ vướng:**
1. Xin ảnh chụp **2 mặt thẻ Medicaid** của khách để đối chiếu lại `Medicaid ID`, họ tên, ngày sinh và tình trạng Active.
2. Gọi **UHC Producer Help Desk (`1-888-381-8581`)**, đọc `MBI` + `Plan Code` để hỏi chính xác nguyên nhân hệ thống không match.
3. Nếu sai/thiếu số Medicaid: Nộp mẫu **`Missing/Incomplete Application Update Request Form`** *(có sẵn dưới mục `Important Documents` trên portal)* để cập nhật. Nếu khách thực sự không còn đủ điều kiện Medicaid → đổi ngay sang gói **Medicare Advantage Non-SNP** (hoặc **C-SNP** nếu có bệnh mãn tính) để kịp hiệu lực **`01/01/2027`**.

---

## 📋 MẪU TIN NHẮN COPY GỬI NHANH TRONG GROUP TEAM

> **[THÔNG BÁO TEAM SUPPORT & AGENT] QUY TRÌNH CHECK MEDICAID (`QMB` / `QMB+`) CHO HỒ SƠ DUAL D-SNP**
> 
> Cả team lưu ý: Không chỉ nhìn **SimplyEnroll** để chốt D-SNP vì đôi khi SimplyEnroll hiện `QMB+` nhưng portal hãng không ghi nhận sẽ bị pending. Muốn đi gói hãng nào phải check thẳng trên Portal hãng đó:
> 1. **UHC Jarvis (`uhcjarvis.com`):** `Sales Tools` → `Medicare & Medicaid Eligibility Lookup` → tab `Medicaid Eligibility` (nhập State, Zip, County, Tên, Gender, DOB, Effective `01/01/2027`, Medicaid ID hoặc SSN, tích `Permission: Yes`).
> 2. **Devoted (`agent.devoted.com`):** `Eligibility` → `Add New Prospect Eligibility Query` (`Consolidated Eligibility Check`).
> 3. **Humana Vantage (`agentportal.humana.com`):** `Retail Business` & HPN → `Vantage Portal` → `Quote & Enroll` → `Eligibility Verification` → tab `DSNP Eligibility` (`Plan Year 2027`).
> 4. **SimplyEnroll / Portal Medicaid bang:** Nhập Zip + MBI + DOB ngay tại màn hình đầu `Needs Assessment` (tích `BEQ Consent`). Nếu chưa ra thì check thẳng Portal Medicaid tiểu bang *(VD MS: `medicaid.ms.gov` → `MESA MEMBER PORTAL` hoặc `access.ms.gov`)*.
> 
> ⚠️ **Khi chọn gói trên SimplyEnroll:** Mở chi tiết từng gói, xem dòng **`Medicaid accepted`** — nếu khách chỉ có **`QMB Only`** thì chỉ được chọn gói có ghi **`QMB Only`** hoặc **`All level`**; tuyệt đối tránh các gói chỉ ghi `QMB+, SLMB+, Full FBDE`.
