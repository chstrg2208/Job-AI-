# TBR SOP AI Assistant - Team Tiger Truong (v3.7.0 Tối Ưu Hóa Cao Cấp)

Tiện ích mở rộng Google Chrome (Manifest V3) tích hợp trí tuệ nhân tạo (Google Gemini AI) hỗ trợ toàn diện đội ngũ Support và Quản lý tại **The Best Rate Insurance (TBR Workspace - `app.thebestrateins.com`)**.

---

## ⚡ Các Tính Năng Tối Ưu Mới Nhất (Version 3.7.0)

1. **⚡ Local Smart Q&A Cache (Bộ Nhớ Đệm Thông Minh - 0 Token, 0ms)**:
   - Các câu hỏi phổ biến của nhân viên sau khi được giải đáp lần đầu sẽ tự động lưu vào bộ nhớ đệm.
   - Khi hỏi lại (kể cả diễn đạt hơi khác câu chữ), hệ thống trả về **NGAY LẬP TỨC 0ms, KHÔNG TỐN 1 TOKEN NÀO** lên Google.

2. **🔑 Multi-Key Rotation (Xoay Vòng Nhiều API Key Miễn Phí)**:
   - Cho phép nhập 2–3 API Key miễn phí (cách nhau dấu phẩy trong mục Cài đặt ⚙️).
   - Tự động luân chuyển và chia tải đều cho 30 nhân viên. Tự nhảy sang Key tiếp theo nếu 1 Key bị đầy hạn mức rate limit (15-20 req/phút của gói Free).

3. **🎯 Quick Action Chips (Gợi Ý 1-Chạm Câu Hỏi Thường Gặp)**:
   - Đặt sẵn các nút bấm tiện lợi ngay trên khung chat:
     - `⚡ Same NPN same plan`
     - `💳 Lịch đóng Company Pay`
     - `🔄 Đổi gói bảo hiểm / Plan`
     - `🚫 Xử lý Other Party & AOR`
     - `📄 Hồ sơ giấy tờ Income`
     - `⏳ Quy tắc đôn đốc 3 ngày`
   - Nhân viên chỉ cần nhấp 1 chạm là nhận được hướng dẫn chi tiết ngay.

4. **📋 Bộ 3 Nút Copy Nghiệp Vụ Tiện Dụng**:
   - `📋 Copy Chi Tiết`: Sao chép toàn bộ văn bản hướng dẫn và nguồn SOP.
   - `📝 Copy Ticket Note`: Tự động rút gọn thành định dạng ghi chú chuẩn để dán vào Deal / Ticket trên CRM Hubspot.
   - `💬 Copy Gửi Khách`: Tự động định dạng thành tin nhắn lịch sự, ngắn gọn để gửi khách qua SMS / Zalo.

5. **🔄 Cloud Auto-Sync Từ GitHub**:
   - Tích hợp nút `🔄 Đồng Bộ GitHub` trong mục 📚 Kho Tri Thức.
   - Khi Quản lý cập nhật quy trình mới lên GitHub repository, nhân viên chỉ cần bấm đồng bộ là cập nhật ngay mà không cần cài lại extension!

6. **🎯 Extreme RAG Token Compression**:
   - Chỉ lọc trích xuất 2-3 quy trình sát nhất, đưa số lượng token gửi lên Google xuống chỉ còn ~1.000 token/lượt (tiết kiệm hơn 92% so với ban đầu).

---

## 📌 Tổng Quan Thư Mục Dự Án
- `tbr-extension/`: Mã nguồn Extension hoàn chỉnh (Manifest V3, v3.7.0).
- `Quy Trình/`: Toàn bộ 35 file PDF văn bản quy trình chuẩn chính thức của TBR.
- `TBR-SOP-AI-Assistant.zip`: Gói cài đặt đóng gói sẵn cập nhật mới nhất.
- `THONG_BAO_VA_HUONG_DAN_NHAN_VIEN.txt`: Hướng dẫn chi tiết gửi nhân viên.
- `CHROME_WEBSTORE_SUBMISSION_GUIDE.txt`: Bản mô tả và giải trình nộp Chrome Web Store.

---

## 🚀 Hướng Dẫn Cài Đặt Cho Nhân Viên

1. Tải repository này về máy tính hoặc giải nén file `TBR-SOP-AI-Assistant.zip`.
2. Mở Google Chrome, truy cập: `chrome://extensions/`.
3. Bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
4. Bấm nút **Load unpacked** (Tải tiện ích đã giải nén) và chọn thư mục `tbr-extension`.
5. Bấm vào biểu tượng tiện ích góc trên bên phải Chrome ➔ Nhập Gemini API Key và bấm **Lưu Key** (có thể dán 2-3 key cách nhau dấu phẩy).
6. Mở trang TBR Workspace (`app.thebestrateins.com`), trợ lý sẽ tự động xuất hiện phục vụ công việc!
