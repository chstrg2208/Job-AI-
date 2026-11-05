# 📋 QUY TRÌNH TẠO COMPANIES & TẠO CONTACT TRONG CONTACT DETAIL (HUBSPOT CRM)
**The Best Rate Insurance - Chuẩn hóa Nghiệp vụ Quản lý Khách hàng & Hồ sơ**
*Phiên bản: 09/2026 - Cập nhật trực tiếp theo chỉ đạo nghiệp vụ*

---

## 🎯 VỊ TRÍ THAO TÁC TRÊN GIAO DIỆN HUBSPOT CRM
Khi mở **Contact Detail** của một khách hàng (Ví dụ: `Oanh Thi Nguyen`):
Nhìn sang **Cột bên phải (Right Sidebar)**, bạn sẽ thấy các phân mục quản lý liên kết:
1. Mục **`Companies (0)`** kèm nút **`+` (Add company / Create company)**.
2. Mục **`Contacts (0)`** kèm nút **`+` (Add contact / Create contact)** nằm bên dưới phần Deals/Tickets.

---

## 🏢 PHẦN 1: QUY ĐỊNH TẠO COMPANY (Trong Contact Detail)
Khi bấm nút **`+` tại mục Companies**, hệ thống quy định phân loại rõ ràng làm **2 dạng**:

### 🔹 Dạng 1: Chung nơi làm việc, chung nhà thờ, cơ sở, hội đoàn
* **Mục đích:** Gom nhóm các khách hàng có chung nguồn gốc xuất phát, cùng làm việc hoặc cùng sinh hoạt cộng đồng để quản lý tập trung và chăm sóc khách hàng.
* **Đối tượng áp dụng:**
  * Khách hàng làm chung một tiệm nail, tiệm tóc, nhà hàng, hãng xưởng.
  * Khách hàng sinh hoạt chung một giáo xứ/nhà thờ, chùa, hội đoàn người Việt.
* **Quy tắc đặt tên Company:**
  * Đặt tên theo đúng tên Nơi làm việc / Tên Cơ sở / Tên Nhà thờ hoặc Hội đoàn.
  * *Ví dụ:* `Luxury Nails & Spa Dallas`, `Nha Tho Cac Thanh Tu Dao Houston`, `Xuong May Austin`.

---

### 🔹 Dạng 2: Đổi Agent (Change Agent / Chuyển giao quản lý hồ sơ)
> ⚠️ **LƯU Ý BẢO MẬT TUYỆT ĐỐI:** **QUY TRÌNH NÀY CHỈ DÀNH RIÊNG CHO NỘI BỘ MANAGER & SUPPORT TEAM! TUYỆT ĐỐI KHÔNG ĐƯỢC CHO AGENT BIẾT VỀ CƠ CHẾ NÀY.**
* **Mục đích:** Khi một khách hàng chuyển từ Agent cũ sang Agent mới (khác Contact Owner / Lead Owner), tạo Company để gom nhóm và liên kết các phiên bản hồ sơ của khách qua các thời kỳ, đảm bảo không bị đứt đoạn lịch sử, tránh trùng lặp email và tránh xung đột dữ liệu giữa các Agent.
* **Định dạng tên Company BẮT BUỘC:**
  $$\mathbf{"\text{Tên Khách Hàng - Contact}"}$$
* **YÊU CẦU HỒ SƠ BẮT BUỘC:**
  * **Bắt buộc phải có FILE CHECK CURRENT PLAN** (File chụp màn hình/tra cứu gói bảo hiểm hiện tại của khách hàng trên Marketplace hoặc Portal hãng để xác minh tình trạng active, tên hãng, gói bảo hiểm và AOR hiện thời).
  * File check current plan phải được đính kèm vào mục **Customer Documents** hoặc pin tại **Note của Contact/Deal** trước khi hoàn tất thủ tục đổi Agent.
* **QUY ĐỊNH DEAL OWNER:**
  * **Deal Owner BẮT BUỘC là người tạo Company đó** (Ai thực hiện thao tác tạo Company tiếp nhận hồ sơ thì chọn Deal Owner là chính người đó).
* **QUY ĐỊNH ĐIỀN TRƯỜNG NOTE TRONG COMPANY DETAIL (BẮT BUỘC):**
  * Tại trường **`Note`** của Company, bắt buộc phải ghi rõ tiến trình chuyển giao theo cú pháp chuẩn:
    $$\mathbf{\text{“move Agent A -> Agent B since MM/YYYY”}}\quad \text{hoặc}\quad \mathbf{\text{“Agent A -> Agent B since MM/YYYY”}}$$
  * *Ý nghĩa:*
    * `Agent A`: Tên Agent cũ chuyển đi.
    * `Agent B`: Tên Agent mới tiếp nhận hồ sơ.
    * `since MM/YYYY`: Mốc thời gian (tháng/năm) bắt đầu chuyển giao hiệu lực (Ví dụ: `10/2026`).
  * *Ví dụ thực tế (theo chuẩn hướng dẫn của Manager Wendy Vo):*
    👉 `move agent a -> agent B since 10/2026`
* **Ví dụ thực tế toàn diện:**
  * Khách hàng tên **Oanh Thi Nguyen** đổi từ Agent Ha To sang Agent Wendy Vo từ tháng 10/2026:
    * Tên Company: 👉 **`Oanh Thi Nguyen - Contact`**
    * File đính kèm: 👉 **File Check Current Plan** (chụp từ Marketplace/Carrier portal).
    * Trường Note của Company: 👉 **`move Ha To -> Wendy Vo since 10/2026`**
    * Deal Owner của Deal mới: 👉 **Wendy Vo** (người tạo Company).

* **QUY TẮC BẢO MẬT DANH TÍNH & KỊCH BẢN GIAO TIẾP CỦA SUPPORT (BẮT BUỘC 100%):**
  * 🔒 **Bảo mật danh tính 2 chiều:**
    * Support **TUYỆT ĐỐI KHÔNG ĐƯỢC NÊU TÊN Agent cũ** cho Agent mới biết.
    * Ngược lại, **TUYỆT ĐỐI KHÔNG ĐƯỢC NÊU TÊN Agent mới** cho Agent cũ biết.
    * *(Mục đích: Tránh gây mâu thuẫn cá nhân, tranh chấp khách hàng hoặc gây khó dễ cho khách).*
  * 💬 **Kịch bản khi làm việc với Support của Agent cũ (Giao tiếp Support với Support):**
    * Chỉ nói đúng nguyên văn:
      👉 *“Kéo về bên team em, kêu agent cũ làm việc lại với khách.”*
  * 💬 **Kịch bản khi nói chuyện với Agent của mình (Agent mới tiếp nhận):**
    * Nói rõ theo đúng quy chuẩn:
      👉 *“Khách này đang đi với 1 agent khác của công ty, xin thời gian để thông báo với agent cũ và yêu cầu khách ký consent.”*

---

## 👥 PHẦN 2: QUY ĐỊNH TẠO CONTACT (Trong Contact Detail)
Khi bấm nút **`+` tại mục Contacts** (nằm ở thanh bên phải của Contact chính), chỉ có **1 dạng duy nhất**:

### 🔹 Dạng duy nhất: Gia đình có nhiều hộ nhỏ (Multi-Household Family)
* **Bối cảnh thực tế:** Trong một đại gia đình lớn sống chung một nhà hoặc cùng huyết thống, nhưng được tách ra thành các hộ thuế (Tax Household) riêng biệt hoặc làm các hồ sơ bảo hiểm riêng (Ví dụ: Bố mẹ là 1 hộ bảo hiểm, con cái trên 26 tuổi hoặc con đã lập gia đình là 1 hộ bảo hiểm riêng).
* **Mục đích:**
  * Giúp Agent/Support khi mở hồ sơ của người đứng đầu (bố/mẹ) là nhìn thấy ngay toàn bộ các Contact thành viên khác trong gia đình.
  * Thuận tiện cho việc:
    * Chăm sóc khách hàng trọn gói cả gia đình.
    * Gom bill, nhắc lịch thanh toán phí bảo hiểm hàng tháng (1st payment & autopay).
    * Theo dõi các thủ tục giấy tờ, upload tài liệu bổ sung mà không bị bỏ sót.
* **Cách thao tác:**
  * Tại **Contact chính** (chủ hộ lớn), kéo xuống mục **`Contacts`** ở cột bên phải.
  * Bấm nút **`+` (Add Contact)** $\rightarrow$ Tìm kiếm Contact của thành viên hộ nhỏ để liên kết (hoặc tạo mới nếu thành viên đó chưa có trên Hub).

---

## 📌 BẢNG TỔNG KẾT NHANH ĐỂ ÁP DỤNG HÀNG NGÀY:

| Mục liên kết trên CRM | Dạng phân loại | Trường hợp áp dụng | Quy tắc đặt tên / Thao tác |
| :--- | :--- | :--- | :--- |
| **Companies** | **Dạng 1** | Chung nơi làm việc, tiệm nail, nhà thờ, hội đoàn | Đặt theo tên cơ sở / nơi làm việc / nhà thờ |
| **Companies** | **Dạng 2** | **Đổi Agent** (Chuyển giao khách hàng) | • **Bắt buộc có FILE CHECK CURRENT PLAN**<br>• Đặt tên Company: **`"Tên Khách Hàng - Contact"`**<br>• **Deal Owner là người tạo Company đó**<br>• **Trường Note:** `move Agent A -> Agent B since MM/YYYY` |
| **Contacts** | **Dạng 1 (Duy nhất)** | **Gia đình gồm nhiều hộ nhỏ** (tách hồ sơ/thuế riêng) | Bấm `+ Contacts` để liên kết các hộ nhỏ vào chung Contact người đại diện |
