<!-- converted from Bien_Ban_Hop_BQL_30_10_2026_Tiger_Truong.xlsx -->

## Sheet: 1.TrachNhiem_Email_ChinhSach
| BIÊN BẢN HỌP BAN QUẢN LÝ - THE BEST RATE INSURANCE (TBR) |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| Thời gian: | 30/10/2026 | Chủ trì: | Tiger Truong (Support Manager) |  |  |
| Thành phần tham dự: | Tâm Phan, Wendy Võ, Phong Nguyễn, Lan Nguyen, Thủy Phan, HR Ruby, Support Team |  |  |  |  |
| PHẦN 1: CHUẨN HÓA PHÂN ĐỊNH TRÁCH NHIỆM AGENT VS SUPPORT & CHIA HOA HỒNG |  |  |  |  |  |
| Nhóm Khách Hàng | Đối Tượng Áp Dụng | Ranh Giới Trách Nhiệm | Tỷ Lệ Hoa Hồng | Trạng Thái CRM (SSS) | Mục Tiêu & Lưu Ý |
| Nhóm 1: Khách Cũ (Renew) | Tất cả Agent (Agent cũ & Agent mới) | Support hỗ trợ toàn diện phần Báo giá (Quote) & Ghi danh (Enroll) khi có yêu cầu. Khuyến khích Agent giỏi tự quote. | 70% Agent - 30% Support | NONE (Split 0.7) | Dữ liệu có sẵn, quy trình đơn giản, ít rủi ro, bảo vệ quan hệ với Agent. |
| Nhóm 2: Khách Mới của Agent MỚI | Agent mới gia nhập công ty | Support hỗ trợ TOÀN DIỆN A ĐẾN Z (hướng dẫn giấy tờ, chạy quote, lấy consent, theo dõi di trú, enroll). | 70% Agent - 30% Support | NONE (Split 0.7) | Bảo toàn hoa hồng cho Agent mới để khích lệ, đào tạo thực chiến và giữ chân khách. |
| Nhóm 3: Khách Mới của SENIOR AGENT | Agent cũ vào từ 6 tháng đến 1 năm trở lên | Mặc định Senior Agent PHẢI TỰ LÀM TỪ A ĐẾN Z (tự quote, tự lấy consent, tự nộp đơn). | 70% (Tự làm) HOẶC 50-50 (Nhờ Support) | Tự làm: NONE | Nhờ: PARTIAL (Split 0.5) | Nếu đùn đẩy cho Support làm thay, Support tạm châm chước nhưng BẮT BUỘC CHIA 50-50 để công bằng cho công sức backend. |
| PHẦN 2: CHÍNH SÁCH KHAI TỬ BLUEHOST & CHUẨN HÓA EMAIL AGENT |  |  |  |  |  |
| Hạng Mục | Thực Trạng Trước Đây | Rủi Ro / Nút Thắt | Quy Chuẩn Mới 2027 | Lộ Trình Triển Khai |  |
| Email Khách Hàng ACA (Bluehost) | Dùng Bluehost tạo unlimited email domain @ushins.com, @tbri.co cho khách. | CMS siết chặt bảo mật danh tính: Hàng ngàn khách chung 1 domain công ty sẽ bị CMS gắn cờ đỏ, khóa app và THU HỒI NPN ĐẠI LÝ vĩnh viễn. | KHAI TỬ tạo mới trên Bluehost. Bắt buộc dùng Email chính chủ của khách hoặc tạo Gmail riêng cho khách. Nhập Email + Pass vào CRM. | Chỉ giữ Bluehost duy trì (maintain) các khách cũ chưa kịp chuyển đổi. |  |
| Email Công Vụ Agent (@tbr-agent.com) | Agent dùng Google Workspace (@thebestrateins.com) tốn $12/user/tháng. | Chi phí nặng nề ($600/tháng x 50 agent = $7,200/năm). Agent hỏi vào Bluehost bị Support cấm gây hiểu lầm. | Chuyển toàn bộ sang domain @tbr-agent.com (cú pháp: ten.ho.bang@tbr-agent.com). Cấp Webmail riêng để Agent tự check mail. | Đổi ngay nhóm Inactive và New Agent. Agent Active giữ nguyên hết mùa OEP. |  |
| Nút thắt RingCentral & Hợp Đồng Hãng | Chị Ruby/HR sợ đổi email mất tin nhắn cũ và mất nhóm RingCentral; Chị Lan phát hiện Contract hãng đang dính email cũ. | Đổi email đột ngột trong mùa OEP sẽ làm gián đoạn liên lạc với các Hãng bảo hiểm (Carriers). | RingCentral quản lý theo Account ID (hỗ trợ migrate tin nhắn 100%). Giữ nguyên email cũ cho Agent Active trong suốt mùa OEP/AEP. | Sau mùa OEP (tháng 2/2027) sẽ triển khai 3 kịch bản chuyển đổi hợp đồng hãng đồng loạt. |  |
## Sheet: 2.KyThuat_KeoApp_IDme
| QUY TRÌNH KỸ THUẬT KÉO HỒ SƠ ACA & GIẢI QUYẾT LỖI AUTHORIZE / ID.ME (MÙA 2027) |  |  |  |  |
| --- | --- | --- | --- | --- |
| Chủ đề / Vấn đề | Triệu Chứng / Hiện Tượng | Nguyên Nhân Cốt Lõi | Quy Trình Xử Lý Chi Tiết | Hành Động Cốt Tử |
| Bí Quyết ID.me (Chị Thủy Phan) | Khách làm ID.me xong bấm link Authorize vẫn báo lỗi, không liên kết được. | MISMATCH thông tin: Thông tin trên ID.me bị lệch (tên, middle name, phone, địa chỉ) so với đơn đang lưu trên Healthcare.gov. | Bước 1: Tạo/khôi phục ID.me chính chủ bằng Email + SĐT hiện tại của khách -> Verify ID.
Bước 2: Vào Healthcare.gov của khách sửa thông tin đơn KHỚP 100% từng chữ với ID.me.
Bước 3: Mở lại link Authorize duyệt ngay lập tức. | Đảm bảo khớp từng khoảng trắng và ký tự giữa ID.me và Healthcare.gov. |
| Bẫy Duplicate App (Tử Huyệt Tháng 1) | Tạo ACA account mới nộp New App 2027 độc lập mà không kéo hồ sơ cũ về. | Giữa tháng 12 (15/12) CMS chạy Batch Auto Re-enrollment (BAR) tự động gia hạn đơn cũ 2026 với NPN cũ -> Trùng 2 app trên 1 SSN -> App mới bị CANCEL vào tháng 1! | BẮT BUỘC phải kéo (Claim/Link) đơn cũ 2026 về tài khoản mới -> Mở chính đơn cũ đó nộp gia hạn cho 2027 -> Điền NPN Agent mình vào mục Agent Help. | Tuyệt đối không nộp New App tách rời trên cùng 1 SSN. |
| Cảnh Báo Nút Auto-Renew | Thấy nút/banner 'Keep 2026 plan for 2027 / Auto-renew' trên Healthcare.gov của khách mới. | Đơn 2026 vốn thuộc về agent cũ. Nếu bấm thẳng nút Auto-renew, hệ thống sẽ gia hạn dưới NPN CŨ của agent ngoài ($0 commission cho công ty mình). | Không bấm Auto-renew thẳng! Phải bấm 'Update Application for 2027' -> Đi đến mục 'Agent or Broker Help' -> Xóa tên cũ, nhập đúng NPN Agent mình -> Rồi mới submit. | Bắt buộc kiểm tra và cập nhật NPN trước khi submit gia hạn. |
| Kỹ Năng Xác Định Chủ Hộ | Khách liên hệ là anh/chồng, nhưng người đứng tên bảo hiểm cũ lại là chị/vợ -> Search bằng SSN người liên hệ không ra đơn. | Support hỏi 'Ai là chủ hồ sơ?' khiến khách không hiểu thuật ngữ chuyên môn và trả lời sai. | HỎI CÂU HỎI VÀNG:
'Anh/chị ơi, trong nhà mình ai là người ĐỨNG TÊN ĐI ĐĂNG KÝ MUA BẢO HIỂM / KHAI THUẾ CHÍNH ạ?' -> Lấy đúng SSN người đó search. | Nếu kéo tên Chồng không được, lập tức ĐẢO VAI sang tên Vợ trong 1-2 phút. |
| Mẹo View-Only (Christy) | Khách bị fail Authorize 2 lần liên tục, hệ thống khóa không cho xem chi tiết đơn. | Kẽ hở hiển thị của portal khi thao tác lặp lại. | Bấm thoát ra ngoài (Remove/Refresh) rồi Add lại 2-3 lần -> Hệ thống mở giao diện XEM (View-Only) -> Soi bằng được Application ID và tên Chủ hộ. | Lấy được Application ID để kéo đơn trên web hoặc đọc cho tổng đài. |
| Bang Thường (Healthcare.gov) Kẹt Email | Healthcare.gov KHÔNG CÓ nút 'Find an existing application' như sàn bang (GA, CA). Gõ SSN vào bị báo đỏ vì agent cũ khóa email. | Trên sàn liên bang, chỉ có Tổng đài viên Marketplace (CMS) mới có quyền Unlink email cũ và Link sang email mới của khách. | GỌI 3 BÊN LÊN 1-800-318-2596 (5 phút):
Khách xác minh danh tính và yêu cầu: 'Gỡ email cũ và link Application ID [xxx] vào email mới [xxx] của tôi' -> F5 web là thấy đơn.
Hoặc: Yêu cầu tổng đài viên nộp gia hạn và gắn NPN Agent mình trực tiếp qua điện thoại. | Giải pháp tối thượng giải phóng 100% các ca kẹt email cũ ở bang thường. |
## Sheet: 3.ChienLuoc_Hang_Network
| CHIẾN LƯỢC SẢN PHẨM OBAMACARE $0 (ACA MÙA 2027) - BẢNG XẾP HẠNG HÃNG VÀ NETWORK |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Thứ Hạng (Tier) | Hãng Bảo Hiểm | Hoa Hồng (Payrate) | Chính Sách Bonus | Mạng Lưới Bệnh Viện Nổi Bật | Gói Trọng Tâm | Chiến Thuật Tư Vấn & Gom Deal |
| TOP 1 (Number One) | Ambetter Health | $25 / member | Bonus cao nhất thị trường 2027 | VÔ ĐỊCH MẠNG LƯỚI TẠI TEXAS:
- Memorial Hermann
- Houston Methodist
- Texas Children's Hospital
- Mạng lưới Kelsey-Seybold | Gold $0 (Quyền lợi cao, không đóng thêm tiền) | Ưu tiên gom tối đa khách hàng về Ambetter Health. Khách khỏe cần $0 đẩy thẳng vào Gold $0 (khuyên đổi PCP theo network). Khách bệnh cần viện lớn chốt ngay. |
| TOP 2 (Dự phòng chủ lực) | Oscar | $25 / member (Cap 5 members/policy) | Có chính sách bonus mùa vụ | Rất mạnh hệ thống Memorial Hermann | Silver / Gold $0 tùy khu vực | Dùng làm phương án dự phòng số 1 khi khách không match mạng lưới Ambetter nhưng thích hệ thống Memorial Hermann. |
| TOP 3 (Dự phòng theo nhu cầu) | Các hãng khác (Aetna, BCBS...) | Theo quy định chuẩn từng hãng | Tùy hãng | Mạng lưới riêng lẻ từng vùng | Bronze / Silver | Chỉ sử dụng khi khách hàng kiên quyết giữ bác sĩ riêng không nằm trong mạng lưới Ambetter và Oscar. |
| CHUYỂN DỊCH THỊ TRƯỜNG VÀ QUYẾT SÁCH ĐỐI VỚI HÃNG CŨ RỦI RO |  |  |  |  |  |  |
| Hiện Tượng Thị Trường | Phân Tích Chi Tiết | Quyết Sách Của Tiger Truong |  |  |  |  |
| Hãng cũ tăng giá mạnh | Trước đây khách mua vì rẻ hoặc vì có Kelsey-Seybold. Năm 2027 hãng cũ tăng giá khiến khách văng ra hàng loạt vì mất mức phí $0. | Không cố giữ khách ở hãng cũ giá đắt, chủ động tư vấn chuyển đổi sang Ambetter Gold $0. |  |  |  |  |
| Phá vỡ thế độc quyền Kelsey-Seybold | Trước đây chỉ hãng cũ có Kelsey. Năm 2027 Ambetter Health đã nhận trọn vẹn Kelsey-Seybold với mức giá rẻ hơn nhiều. | Tất cả khách thích Kelsey-Seybold đều được chuyển thẳng về Ambetter Health để tiết kiệm tiền cho khách và nhận bonus cao. |  |  |  |  |
| Loại bỏ hãng có nguy cơ Block Commission | Các hãng có rủi ro Cancel Back, Block Commission hoặc thủ tục NPN phức tạp (như UHC/Molina ở các bang $0 commission). | DẸP LUÔN, KHÔNG CẦN BÁN! Vì Ambetter và Oscar đã thay thế hoàn hảo về cả giá, network lẫn hoa hồng. |  |  |  |  |
## Sheet: 4.KeHoach_IT_Compliance
| KẾ HOẠCH HÀNH ĐỘNG, KỶ LUẬT COMPLIANCE & ĐỐI SOÁT IT HÀNG TUẦN |  |  |  |  |
| --- | --- | --- | --- | --- |
| Nhiệm Vụ / Hạng Mục | Bộ Phận Phụ Trách | Tần Suất / Deadline | Mục Đích & Cơ Chế Thực Hiện | Hành Động Khi Phát Hiện Lỗi |
| Kỷ luật Hợp đồng (Contract RTS) | Toàn bộ Agent | Bắt buộc trước khi enroll | Agent bắt buộc có Contract Active/RTS với hãng tại bang ghi danh mới được nhận hoa hồng. Phân định trách nhiệm pháp lý cá nhân, công ty không gánh thay. | Nếu nộp đơn không có contract -> $0 commission. Agent tự chịu trách nhiệm. |
| Kỷ luật Nhập Liệu Data Entry | Support Team | Hàng ngày trên từng Deal | Support bắt buộc nhập đúng 100% thông tin: Hãng, Bang, NPN, hình thức hỗ trợ (tự làm hay nhờ) trên CRM. | Dữ liệu sai lệch sẽ làm sai báo cáo hoa hồng và bị Manager cảnh cáo. |
| IT Weekly Contract Audit Report | IT Department | HÀNG TUẦN (Thứ 2 hàng tuần) | IT chạy script tự động đối chiếu giữa Danh sách Contract Active (HR) <-> Danh sách Đơn Enroll thực tế (CRM). | Phát hiện đơn nộp thiếu contract -> Bắn cờ đỏ báo Manager Tiger và Agent xử lý trong 24-48h. |
| Thông Báo Chính Thức Bằng Văn Bản | HR (Ruby) & IT | Ngay lập tức (Trước 31/10/2026) | Ban hành thông báo văn bản chính thức trên RingCentral/Email về: (1) Cấm tạo email khách trên Bluehost; (2) Cấp Webmail @tbr-agent.com cho Agent; (3) Bảo lưu email cũ cho Agent Active. | Chấm dứt hoàn toàn tình trạng hiểu lầm Support làm khó, thống nhất tư tưởng toàn công ty. |
| Xử lý Case Khẩn Cấp Florida Blue (01/11) | Ivy Le (Support) & Jay Ly (Agent) | Hạn chót 31/10/2026 | Case Hai Do (Mã Deal: D26005815): Hết hạn 31/10/2026 và áp dụng APTC mới từ 01/11/2026. Phải xử lý ngay để khách không bị gián đoạn bảo hiểm. | Ivy Le liên hệ Agent Jay Ly chốt plan gia hạn trong ngày. |