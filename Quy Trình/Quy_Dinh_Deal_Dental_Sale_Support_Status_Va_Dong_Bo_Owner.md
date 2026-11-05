# 🦷 QUY ĐỊNH XỬ LÝ HỒ SƠ DENTAL, PHÂN BỔ DEAL OWNER, SALE SUPPORT STATUS & ĐỒNG BỘ OWNER TRÊN CRM
**The Best Rate Insurance - Chuẩn hóa Nghiệp vụ Quản lý & Vận hành Hubspot CRM**  
*Cập nhật: 07/10/2026 - Theo chỉ đạo trực tiếp từ Manager Wendy Vo & Ban Quản Lý*

---

## 📌 PHẦN 1: QUY TẮC ĐỒNG BỘ OWNER TRÊN HỆ THỐNG CRM
> ⚠️ **NGUYÊN TẮC CỐT LÕI VỀ OWNER:**
> Danh sách Owner trên toàn bộ các phân hệ CRM **BẮT BUỘC PHẢI GIỐNG NHAU** và **PHẢI LÀ TÀI KHOẢN (ACCOUNT) CỦA AGENT**.

* **Contact Owner:** Bắt buộc phải là account của Agent. Hệ thống có bao nhiêu account Agent thì hiển thị đầy đủ bấy nhiêu account để chọn. Tuyệt đối không chọn/để tên công ty (`The Best Rate Insurance`) hay nhân viên hỗ trợ (`Platform Staff`).
* **Tính đồng nhất xuyên suốt (4 Phân hệ):**
  1. **Owner của Contact** (Contact Owner)
  2. **Owner của Deal** (Deal Owner)
  3. **Owner của Ticket** (Ticket Owner)
  4. **Owner khi Upload Document** (Document Owner)
  👉 **Tất cả 4 mục trên đều sử dụng chung danh sách Account Agent**, đảm bảo hồ sơ được gán đúng người phụ trách và không bị phân tán thông tin.

---

## 🦷 PHẦN 2: QUY CHUẨN HỒ SƠ DENTAL DATA (MANHATTAN LIFE / UHC - DENTAL / DVH)

### 🏷️ 1. Thông tin sản phẩm áp dụng
* **Carrier (Hãng bảo hiểm):** Manhattan Life / UHC - Dental.
* **Sub product (Dòng sản phẩm):** Dental / Dental - Vision - Hearing (DVH).

---

### ⚠️ 2. Lưu ý sống còn về Deal Owner & Nguồn khách
> 📌 **Chỉ đạo trực tiếp từ Wendy Vo:**  
> *"Team mọi người nhắc support data của các deal Dental. Lưu ý phải để đúng deal owner là agent nếu nguồn khách từ agent, trừ tr.hợp đặc biệt đã thỏa thuận với agent được phép lấy 100% dental.*  
> *- Nếu deal owner để tên support thì deal sẽ được mặc định chuyển về cty và không count cho agent.*  
> *- Deal của agent thì SSS chỉ được để PARTIAL hoặc NONE.*  
> *- Deal của công ty thì SSS = FULL."*  
>  
> *"Team xem lại rule dental lần nữa để cập nhật SSS cho đúng nha.*  
> *Lưu ý: khách của agent thì dù mình làm hết, cũng là partial. Chỉ có khách của cty thì mới là FULL."*

* **Quy tắc Deal Owner:**
  * Khách từ nguồn của Agent $\rightarrow$ **Deal Owner BẮT BUỘC là AGENT**.
  * **Hậu quả nếu để sai:** Nếu Deal Owner để tên Support thì hệ thống sẽ **mặc định chuyển deal về Công ty và KHÔNG TÍNH (count) cho Agent**.
  * Ngoại lệ duy nhất: Trường hợp đặc biệt đã có thỏa thuận trước với Agent được phép lấy 100% dental.

---

### 📊 3. Ma trận phân bổ Sale Support Status (SSS), Tỷ lệ chia (Split) & Bonus
*(Căn cứ theo Bảng chuẩn Dental Data Excel)*

| STT | Loại nguồn khách | Lead Owner | Deal Owner | Quote & Close Deal By | Support Agent | Sale Support Status (SSS) | Agent Split | Company Bonus |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Khách Agent (Agent tự quote & close)** | **Agent** | **Agent** | **Agent** | Support | **`NONE`** | **0.7** (Agent 70%) | **No** (Không có bonus) |
| **2** | **Khách Agent (Support làm hết / xử lý)** | **Agent** | **Agent** | **Người xử lý hồ sơ** | Support | **`PARTIAL`** | **0.5** (Agent 50%) | **Người xử lý hồ sơ** |
| **3** | **Khách Công ty** | **Company** | **Người xử lý hồ sơ** | **Người xử lý hồ sơ** | Support | **`FULL`** | **0** (0%) | **Người xử lý hồ sơ** |

---

### 🔍 4. Giải thích thuật ngữ & Hướng dẫn thao tác
* **Support agent deal:** Là nhân sự Support phụ trách của Contact đó.
* **Người xử lý hồ sơ:** Là nhân sự trực tiếp hoàn tất hồ sơ, xử lý quote, ghi danh (enroll) $\rightarrow$ **Được nhận Company Bonus**.
* **Nguyên tắc chọn Sale Support Status (SSS):**
  * **Deal của Agent:** SSS **CHỈ ĐƯỢC CHỌN `PARTIAL` HOẶC `NONE`**. Dù Support có làm thay toàn bộ quy trình thì SSS vẫn là `PARTIAL` (hưởng 5/5 split).
  * **Deal của Công ty:** SSS **BẮT BUỘC LÀ `FULL`**.

---

### 📷 5. Ví dụ đối chiếu thực tế trên CRM
1. **Ví dụ Deal khách Agent (Case: Thạch Thị Ngọc Hà):**
   * **Deal Name:** `Thach Thi Ngoc Ha`
   * **Deal Owner:** `Zoe Nguyen` (Agent)
   * **Sale Support Status:** `Partial`
   * **Split:** `0` (hoặc tính theo hệ số split 50%)
2. **Ví dụ Deal khách Công ty (Case: Clinton Vũ):**
   * **Deal Name:** `Clinton Vu - Dental $1000`
   * **Deal Owner:** `Emily Nguyen` (Người xử lý hồ sơ / Support)
   * **Sale Support Status:** `Full`
   * **Split:** `0.0`
   * **Qualified Commission:** `Monthly Payment`
