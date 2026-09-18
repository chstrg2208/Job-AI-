# TBR SOP AI Assistant - Team Tiger Truong

Tiện ích mở rộng Google Chrome (Manifest V3) tích hợp trí tuệ nhân tạo (Google Gemini AI) hỗ trợ toàn diện đội ngũ Support và Quản lý tại **The Best Rate Insurance (TBR Workspace - `app.thebestrateins.com`)**.

---

## 📌 Tổng Quan Hệ Thống

Dự án bao gồm:
1. **Tiện ích Chrome Extension (`tbr-extension/`)**:
   - Tích hợp trực tiếp vào giao diện CRM TBR Workspace.
   - **Khay việc Quản lý (RTE - Ready To Enroll)**: Badge nhấp nháy đỏ, âm thanh chuông báo (Chime) khi có hồ sơ sẵn sàng enroll.
   - **Giám sát Deal Support**: Theo dõi tiến độ hồ sơ (Waiting for Document, Quoted, 1st Payment, Active...).
   - **TBR SOP AI Assistant (Trợ lý AI nội bộ)**:
     - Tích hợp Google Gemini AI với cơ chế **Smart RAG Dynamic Keyword Filtering** (giảm 85% Token, phản hồi tức thì dưới 1-2 giây).
     - Nạp toàn bộ **35 bộ Quy trình Vận hành Chuẩn (SOPs)** chính thức từ TBR.
     - Cơ chế Zero Hallucination: Luôn trích dẫn rõ điều khoản, số quyết định ban hành và đường link tài liệu gốc.
     - Khả năng hiểu ngôn ngữ giao tiếp thực tế của nhân viên (từ lóng ngành bảo hiểm: same NPN, same plan, đi lại hồ sơ, giữ deal, công ty trả tiền, company pay, đôn đốc...).
   - **1-Click Copy Báo Cáo Daily**: Tự động tổng hợp số liệu deal trong ngày để gửi nhóm Zalo/Telegram/Slack.

2. **Thư viện 35 Quy trình Vận hành Chuẩn (`Quy Trình/`)**:
   - Toàn bộ file PDF quy trình nội bộ chính thức được ban hành bởi The Best Rate Insurance.

3. **Gói cài đặt phân phối (`TBR-SOP-AI-Assistant.zip`)**:
   - File zip đóng gói sẵn, tiện lợi gửi cho nhân sự cài đặt hoặc tải lên Google Chrome Web Store.

4. **Tài liệu hướng dẫn**:
   - `THONG_BAO_VA_HUONG_DAN_NHAN_VIEN.txt`: Thông báo và 3 bước cài đặt cho nhân viên.
   - `CHROME_WEBSTORE_SUBMISSION_GUIDE.txt`: Tài liệu nộp và giải trình quyền riêng tư cho Google Chrome Web Store.

---

## 🚀 Hướng Dẫn Cài Đặt Cho Nhân Viên

### Cách 1: Cài đặt từ thư mục (Khuyên dùng)
1. Tải repository này về máy tính hoặc giải nén file `TBR-SOP-AI-Assistant.zip`.
2. Mở Google Chrome, truy cập đường dẫn: `chrome://extensions/`.
3. Bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
4. Bấm nút **Load unpacked** (Tải tiện ích đã giải nén) ở góc trên bên trái.
5. Chọn thư mục `tbr-extension`.
6. Truy cập vào trang làm việc TBR Workspace:
   ```text
   https://app.thebestrateins.com/service/general/dashboard?dashboardId=2a6cfd1c-9c69-42c4-158f-08ded82ee625
   ```
7. Trợ lý AI và Thanh công cụ sẽ tự động xuất hiện!

---

## 👥 Quản lý & Bản quyền
- **Team**: Tiger Truong - The Best Rate Insurance
- **Hệ thống hỗ trợ**: TBR Workspace CRM
