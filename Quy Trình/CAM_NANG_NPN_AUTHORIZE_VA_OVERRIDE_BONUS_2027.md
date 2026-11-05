# CẨM NANG NGHIỆP VỤ: NPN CÔNG TY VS. NPN AGENT, QUY TRÌNH AUTHORIZE HEALTHSHERPA & CHIẾN LƯỢC OVERRIDE BONUS 2027

**The Best Rate Insurance (TBR) - Tài liệu Chuẩn hóa Nghiệp vụ Quản lý & Vận hành Mùa Open Enrollment 2027**  
*Cập nhật: 19/10/2026 - Căn cứ theo Chỉ đạo Ban Quản Lý, CMS Compliance & Thực tế Vận hành HealthSherpa*

---

## 📌 PHẦN 1: BẢN CHẤT CỐT LÕI - NPN CÔNG TY VS. NPN AGENT

Mỗi cá nhân hoạt động trong ngành bảo hiểm y tế tại Hoa Kỳ đều được Cơ quan Quản lý Bảo hiểm Quốc gia (NAIC) cấp một mã số định danh hành nghề duy nhất gọi là **NPN (National Producer Number)**. Tại hệ thống vận hành của The Best Rate Insurance, dữ liệu và quy trình nộp đơn được phân định rạch ròi thành 2 nhóm:

### 1. Phân loại chi tiết 2 nhóm NPN

| Tiêu chí so sánh | 🏢 NPN CÔNG TY (Agency / Principal NPN) | 👤 NPN CỦA AGENT (Writing Agent NPN) |
| :--- | :--- | :--- |
| **Định danh sở hữu** | Là mã NPN của các Nhà sáng lập & Lãnh đạo cấp cao TBR:<br>• **AQP (`#20011862` - Anh Quế Phạm)**: Cổng chính Tổng Đại Lý của công ty.<br>• **ALP (`#19876750` - Anh Lân Phạm)**: Chuyên dùng cho hãng UHC và một số bang.<br>• **PT (`#18819956` - Phúc Trịnh)**: CEO, chuyên dùng cho Medicare, DVH (Manhattan Life, Uhone).<br>• **Tâm Phan**: NPN của Chị Tâm Phan. | Là mã số định danh cá nhân độc lập của từng Agent trực thuộc hoặc downline:<br>• **Hoa Đào (`#20664479`)**: Bắt buộc cho FL Blue & Florida Health Plans tại FL.<br>• **Nhi Trần (`#20461483`)**: Bắt buộc cho BCBS tại South Carolina.<br>• Các Agent độc lập khác (Zoe Nguyễn, Kevin Đặng, Tony...). |
| **Trường hợp áp dụng** | 1. Agent **chưa có Hợp đồng (Contract/Appointment)** với hãng tại tiểu bang đó (mượn NPN công ty).<br>2. Hợp đồng bảo hiểm ký trực tiếp giữa Carrier với Công ty.<br>3. Hồ sơ nguồn khách do Công ty phân bổ (Company Deals).<br>4. **Gom số lượng lớn để kích hoạt Tiền Thưởng (Bonus hãng)** (như Oscar > 50 members). | 1. Agent đã có Hợp đồng riêng với hãng bảo hiểm tại bang đó (thông qua tổng đại lý TBI hoặc AP Agency).<br>2. Khách hàng cá nhân do Agent tự tìm kiếm, tư vấn và chăm sóc.<br>3. Agent muốn ghi nhận sản lượng cá nhân và hưởng trọn vẹn hoa hồng hợp đồng. |
| **Cổng đăng nhập HealthSherpa (HSP)** | Đăng nhập trực tiếp bằng tài khoản Admin của **Công ty (Agency Portal AQP)**. | Đăng nhập bằng tài khoản cá nhân của **chính Agent đó (Agent Portal)**. |

---

## 🔑 PHẦN 2: QUY CHUẨN AUTHORIZE TRÊN HEALTHSHERPA 2027 (CMS COMPLIANCE)

Theo quy định nghiêm ngặt từ Trung tâm Dịch vụ Medicare & Medicaid (CMS) áp dụng cho niên độ 2026 - 2027: **Mọi thao tác tra cứu, chỉnh sửa, hoặc nộp đơn gia hạn (Renew) trên sàn HealthSherpa đều bắt buộc phải có Giấy Ủy Quyền Trước (Pre-Authorization) từ khách hàng.**

### 1. Rào cản kỹ thuật trên Cổng HealthSherpa Công ty (AQP)
* **Thực trạng hệ thống:** Khi Support đăng nhập vào tài khoản Agency của Anh Quế Phạm (AQP) để xem hồ sơ thuộc NPN của Agent con:
  * Hệ thống chỉ cho phép xem thông tin tổng quan bên ngoài (Sync Complete / Premier Partner Data).
  * **Nút `View details` bị hệ thống làm mờ (grayed out)**. Support không thể xem lịch sử hồ sơ, không xem được chi tiết thu nhập và **hoàn toàn KHÔNG THỂ bấm gửi yêu cầu Authorize giùm cho Agent**!
* **Nguyên nhân:** CMS bảo vệ quyền riêng tư của Writing Agent, không cho phép tài khoản mẹ (Agency) tự ý gửi link ủy quyền thay cho Agent con nếu hồ sơ đó đứng tên NPN của Agent con.

### 2. Quy tắc phân công thực hiện Authorize (Ai làm gì?)

```
                     ┌──────────────────────────────────────────────┐
                     │          HỒ SƠ CẦN AUTHORIZE 2027           │
                     └──────────────────────┬───────────────────────┘
                                            │
                     ┌──────────────────────┴───────────────────────┐
                     ▼                                              ▼
       [HỒ SƠ ĐỨNG TÊN NPN CÔNG TY]                    [HỒ SƠ ĐỨNG TÊN NPN AGENT]
         (AQP, ALP, PT, Tâm Phan)                   (Hoa Đào, Nhi Trần, Agent khác)
                     │                                              │
                     ▼                                              ▼
          🏢 SUPPORT CÔNG TY LÀM                         👤 BẮT BUỘC AGENT LÀM
    Support đăng nhập cổng HSP cty              Agent tự đăng nhập cổng HSP cá nhân
   (AQP/ALP/PT) bấm gửi link Authorize           bấm "Get Authorization" gửi cho khách
          qua SMS/Email cho khách                        (Áp dụng cả hồ sơ mới & cũ)
```

* **Lưu ý đặc biệt:** Cả hồ sơ mới (New) và hồ sơ cũ (Renew từ năm trước) đều **BẮT BUỘC PHẢI AUTHORIZE LẠI CHO NIÊN ĐỘ 2027**.

---

## 🌐 PHẦN 3: CƠ CHẾ "ĐI ACA TRỰC TIẾP" (HEALTHCARE.GOV) VS. "ĐI HEALTHSHERPA"

Trong thực tế vận hành, đội ngũ Support và Agent thường gặp tình huống khách hàng không kịp bấm link ủy quyền trên điện thoại. Khi đó, cơ chế **"Đi ACA"** là giải pháp thay thế hợp pháp:

### 1. "Đi ACA" nghĩa là gì?
* Là việc Support/Agent không dùng cổng trung gian HealthSherpa, mà **đăng nhập trực tiếp vào tài khoản người tiêu dùng của khách hàng trên trang web chính phủ `Healthcare.gov`** (sử dụng Username & Password cá nhân của khách do khách cung cấp hoặc Support tạo giúp).
* **Ưu điểm vượt trội:** Khi đăng nhập bằng tài khoản chính chủ của khách trên `Healthcare.gov`, hệ thống coi thao tác đó là do chính khách hàng thực hiện → **HOÀN TOÀN KHÔNG BỊ CHẶN BỞI BƯỚC PRE-AUTHORIZATION CỦA HEALTHSHERPA!**

### 2. Quy chuẩn ghi nhận trên Hubspot CRM (Chỉ đạo Quản lý Quỳnh Ngọc Nguyễn):
* **Trường hợp 1 (Hồ sơ có tài khoản ACA):** Support đăng nhập thẳng `Healthcare.gov` để nộp đơn renew cho khách. Sau khi hoàn tất, Support điền ghi chú (Note) trên Deal CRM là: **`Autho by ACA`**. Hồ sơ được coi là hợp lệ và sẵn sàng Active.
* **Trường hợp 2 (Hồ sơ KHÔNG CÓ tài khoản ACA):** Bắt buộc 100% phải gửi link xin Pre-Authorization qua HealthSherpa. Khách phải bấm đồng ý trên điện thoại/email thì Support mới có quyền renew gói 2027.

---

## 🎯 PHẦN 4: CHIẾN LƯỢC "OVERRIDE NPN QUA AQP" ĐỂ GIẬT BONUS OSCAR HEALTH 2027

### 1. Thuật ngữ "Override NPN" là gì?
Khi Support đăng nhập vào cổng HealthSherpa của một Agent để nộp đơn ghi danh cho khách:
* Tại bước cuối cùng trước khi submit (mục *Writing Agent Information / Broker NPN*), giao diện cho phép Support **xóa mã NPN mặc định của Agent và gõ đè (Override) mã NPN của Công ty (AQP `#20011862`) vào**.
* Khách hàng vẫn được ghi danh đúng gói bảo hiểm, nhưng trên hệ thống của hãng bảo hiểm, hợp đồng đó sẽ được ghi nhận doanh số cho mã AQP.

### 2. Tại sao BẮT BUỘC PHẢI OVERRIDE khi khách chọn hãng OSCAR HEALTH?
* **Điều kiện thưởng khắt khe của Oscar 2027:**
  * Tại 3 tiểu bang trọng điểm: **Florida (FL), Georgia (GA), Texas (TX)**, Oscar Health quy định ngưỡng tối thiểu để được nhận tiền thưởng Broker Bonus là: **> 50 MEMBERS** (tức từ 51 người trở lên).
  * Nếu để từng Agent đứng tên riêng lẻ: Mỗi Agent chỉ có khoảng 10 - 25 hồ sơ Oscar → **100% Agent đều dưới 51 members → TẤT CẢ AGENT ĐỀU BỊ TRƯỢT THƯỞNG ($0 BONUS)!**
* **Nước cờ chiến lược của Ban Quản Lý TBR:**
  * Dùng cổng của Agent để làm đơn và xin Authorize.
  * Khi khách chọn gói **Oscar** → Support lập tức **Override mã NPN thành AQP (`#20011862`)** để dồn toàn bộ số lượng member của toàn công ty về chung một mã AQP → **Dễ dàng vượt mốc 51 members để ăn trọn gói Bonus khổng lồ của Oscar**, sau đó Công ty phân phối lại tiền thưởng cho Agent!
  * Khi khách chọn các hãng khác mà Agent có contract (như Ambetter, BCBS, Molina...) → Giữ nguyên NPN riêng của Agent để Agent nhận trọn hoa hồng cá nhân.

---

## 🗺️ PHẦN 5: MA TRẬN PHÂN BỔ CỔNG CÔNG TY THEO TIỂU BANG (LICENSE 10.2026)

Để giải quyết tình trạng cổng AQP bị quá tải (dồn cổng), Ban Quản Lý (Chị Tâm Phan & Wendy Võ) quyết định chia tải theo tiểu bang dựa trên danh sách License hợp lệ:

| Cổng NPN Công ty | Người phụ trách chính | Các tiểu bang được phân bổ đảm nhiệm | Ghi chú nghiệp vụ |
| :---: | :---: | :--- | :--- |
| **AQP** | **Anh Quế Phạm** (`#20011862`) | **DE, MT, NH, WV** (các bang duy nhất chỉ AQP có hợp đồng hoàn tất); gánh các ca gom số Oscar tại **TX, FL, GA**. | Cổng Tổng Đại Lý công ty. |
| **ALP** | **Anh Lân Phạm** (`#19876750`) | **OK, NC, IN**; các hồ sơ chuyên biệt hãng **UHC** trên toàn quốc. | Không dùng ALP tại CT, DC, DE (chưa có license). |
| **PT** | **Phúc Trịnh** (`#18819956`) | **TN, SD, WI**; toàn bộ mảng **Medicare Part C** & bảo hiểm **DVH** (Manhattan Life, Uhone). | NPN chuyên trách Medicare & Dental. |
| **Manager Ports** | **Andy Võ, Quỳnh Ngọc, Trang Lê** | Tiểu bang **Texas (TX)** | Giảm tải cho AQP tại bang Texas. |

---

## 🚀 PHẦN 6: KẾ HOẠCH HÀNH ĐỘNG CHI TIẾT DÀNH CHO SUPPORT & MANAGER

1. **Đối với hồ sơ NPN Agent:**
   * IT xuất danh sách hồ sơ theo từng Agent → gửi cho Agent.
   * Kích hoạt cơ chế **Auto-Forward mã OTP email** từ email cá nhân của Agent về hộp thư chung của Manager Team → Support chủ động đăng nhập portal HSP của Agent để bấm gửi link Authorize hỗ trợ Agent.
2. **Đối với hồ sơ mượn NPN đặc thù:**
   * **Hoa Đào (FL):** Bắt buộc chuyển Authorize về cổng Hoa Đào (`#20664479`).
   * **Nhi Trần (SC):** Bán BCBS tại SC → Chuyển Authorize về cổng AQP.
3. **Tuân thủ thời hạn Payment 2027 (Bảo toàn Bonus Oscar):**
   * Support thực hiện nghiêm túc quy trình Payment tháng 1 - 4/2027 (giữ ở `Need Check Autopay`).
   * Đảm bảo khách hàng Oscar duy trì liên tục và đóng đủ tiền qua hết ngày 30/04/2027 để công ty và Agent nhận đủ 100% tiền thưởng Broker Bonus từ Oscar.
