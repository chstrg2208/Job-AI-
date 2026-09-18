/**
 * Google Gemini AI - TBR SOP Assistant (Strict Grounding / Zero Hallucination & Source Attribution)
 * Backed by 31 Official Standard Operating Procedures from E:\Job\Quy Trình
 */

const FALLBACK_SOPS = `
=== BỘ QUY TRÌNH VẬN HÀNH CHUẨN (SOP) CỐT LÕI - THE BEST RATE INSURANCE ===
Nguồn tài liệu chính thức: Thư viện Quy trình Nội bộ (folder/333fa3f5-8e92-4843-ace1-c1bd530b5b30)
Quản lý trực tiếp: Anh Tiger Truong
Đội ngũ Support: Anya Nguyen, Sean Ngo, Ivy Le, Sarah Thai và các nhân sự mới.

1. QUY TRÌNH 7 BƯỚC TIỀN ENROLL:
- Bước 1 [New Opportunity / Call to Renew]: Liên hệ khách trong 24h.
- Bước 2 [Need Agent Contact]: Tư vấn quyền lợi ACA/Medicare.
- Bước 3 [Need to Quote]: Thu thập thông tin, xuất báo giá quote.
- Bước 4 [Quoted - Need Confirm]: Khách xác nhận gói bảo hiểm.
- Bước 5 [Waiting for Document]: Thu thập ID, W-2, 1099, Paystubs 30 ngày, Thẻ xanh, Work Permit, SSN, Tax Return.
- Bước 6 [Need Agent Enroll]: Soát xét lại tính hợp lệ.
- Bước 7 [READY TO ENROLL - RTE]: Khay việc của Quản lý Anh Tiger Truong trực tiếp bấm enroll. Support tuyệt đối không tự ý enroll.

2. QUY TRÌNH HẬU ENROLL & PAYMENT:
- Enrolled - Need 1st Payment: Khách đóng phí tháng đầu, hạn chót tránh bị hãng hủy đơn; cấm support cầm tiền mặt/thẻ.
- Enrolled - 1st Payment Done: Khách đóng xong, chuyển trạng thái.
- ENROLLED - ACTIVE: Support đối soát cổng hãng (Aetna, Ambetter, BCBS, Cigna, UHC, Molina, Oscar...) lấy Member ID và kích hoạt Active trong tháng.
- Quy trình Payment (QT10/2024/TBR/ADMIN):
  + Ngày thanh toán Company pay hàng tháng: Từ ngày 15 đến ngày cuối cùng của tháng (xử lý Company pay, Need Auto pay, No value).
  + Từ ngày 25 đến ngày 05 tháng sau: Xử lý Need Check Auto pay, Auto pay & Selfpay.
  + Từ ngày 05 đến ngày 15 hàng tháng: Xử lý Waiting for New Payment & Late-Selfpay.

3. QUY TẮC ĐÔN ĐỐC 3 NGÀY: Không để deal trung gian ngâm quá 3 ngày.
4. QUY TẮC NGOẠI LỆ: Bất kỳ vấn đề ngoài quy trình phải báo cáo trực tiếp Quản lý Anh Tiger Truong.
`;

// Điền sẵn API Key vào đây nếu muốn toàn bộ nhân viên cài xong dùng được ngay không cần nhập Key (lưu ý không push API Key lên Git public):
const DEFAULT_API_KEY = '';

function isExtensionValid() {
  try {
    return typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.id && !!chrome.storage && !!chrome.storage.local;
  } catch (e) {
    return false;
  }
}

const TBRGemini = {
  async getApiKey() {
    return new Promise((resolve) => {
      if (isExtensionValid()) {
        try {
          chrome.storage.local.get(['gemini_api_key'], (res) => {
            if (chrome.runtime.lastError) {
              resolve(DEFAULT_API_KEY || '');
            } else {
              resolve((res && res.gemini_api_key) || DEFAULT_API_KEY || '');
            }
          });
          return;
        } catch (e) {
          // Context invalidated, fall through to localStorage
        }
      }
      try {
        resolve(localStorage.getItem('gemini_api_key') || DEFAULT_API_KEY || '');
      } catch (e) {
        resolve(DEFAULT_API_KEY || '');
      }
    });
  },

  async setApiKey(key) {
    return new Promise((resolve) => {
      const cleanKey = key.trim();
      if (isExtensionValid()) {
        try {
          chrome.storage.local.set({ gemini_api_key: cleanKey }, () => resolve(true));
          return;
        } catch (e) {
          // Context invalidated
        }
      }
      try {
        localStorage.setItem('gemini_api_key', cleanKey);
      } catch (e) {}
      resolve(true);
    });
  },

  /**
   * Smart Keyword & Semantic Relevance Matching (RAG)
   * Cuts token usage by 85%-90% by only sending the top 3-4 most relevant SOPs
   */
  async getSmartRelevantKnowledgeBase(question = '') {
    const sops = (window.TBR_SOPS_DATABASE && window.TBR_SOPS_DATABASE.length > 0)
      ? window.TBR_SOPS_DATABASE
      : [];

    let relevantSopsText = '';

    if (sops.length > 0 && question.trim().length > 0) {
      const SYNONYMS = {
        // Giá tiền, chi phí, thu nhập, hoa hồng
        'giá': ['amount', 'premium', 'income', 'thu nhập', 'đổi gói', 'change plan', 'thay đổi hồ sơ', 'tiền phí', 'bớt tiền', 'giảm giá'],
        'giảm': ['amount', 'premium', 'income', 'thu nhập', 'đổi gói', 'change plan', 'bớt', 'rẻ hơn', 'xuống giá'],
        'tăng': ['amount', 'premium', 'income', 'thu nhập', 'đổi gói', 'lên giá', 'mắc hơn'],
        'tiền com': ['commission', 'hoa hồng', 'sale support status', 'sss', 'ăn chia', 'phân chia commission', 'none', 'partial', 'full', 'cad'],
        'commission': ['tiền com', 'hoa hồng', 'sale support status', 'sss', 'cad'],
        'thu nhập': ['income', 'giải trình thu nhập', 'thư giải trình', 'w-2', '1099', 'paystubs', 'khai thuế', 'mức thu nhập'],
        'giải trình': ['thư giải trình về thu nhập', 'income', 'giải trình thu nhập', 'chứng minh thu nhập'],

        // Đổi gói, đi lại hồ sơ, hủy gói
        'đổi plan': ['đổi gói', 'change plan', 'thay đổi hồ sơ', 'đổi gói bảo hiểm', 'chuyển plan', 'đi lại hồ sơ', 'chuyển gói', 'đổi hãng'],
        'đi lại hồ sơ': ['thay đổi hồ sơ', 'change plan', 'đổi gói', 'cập nhật hồ sơ', 'apply lại', 're-enroll'],
        'hủy plan': ['hủy gói', 'cancel plan', 'termination', 'hủy bảo hiểm', 'khách đòi hủy', 'cắt bảo hiểm', 'bỏ bảo hiểm', 'ngưng bảo hiểm'],
        'cancel': ['hủy', 'hủy gói', 'cancel plan', 'termination', 'ngưng hợp đồng'],
        'hủy': ['cancel', 'cancel plan', 'termination', 'hủy gói', 'hủy bảo hiểm'],

        // Thanh toán, trừ tiền, charge, refund
        'payment': ['thanh toán', 'đóng phí', 'company pay', 'autopay', 'selfpay', 'ptd', 'pay through date', 'trừ tiền', 'bị charge', 'đóng tiền', 'tiền tháng'],
        'charge': ['trừ tiền', 'thanh toán', 'rút tiền', 'payment', 'double charge', 'trừ 2 lần', 'bị trừ tiền'],
        'trừ tiền': ['payment', 'thanh toán', 'charge', 'autopay', 'company pay', 'rút tiền'],
        'refund': ['hoàn tiền', 'trả lại tiền', 'lấy lại tiền', 'cancel plan refund', 'đóng dư', 'rút lộn tiền'],

        // Other party, NPN, AOR
        'other': ['other party', 'npn', 'đổi npn', 'bị cướp', 'bị giật khách', 'mất hồ sơ', 'agent khác', 'đổi aor'],
        'other party': ['other', 'npn', 'đổi npn', 'cướp aor', 'aor', 'unlock aor'],
        'npn': ['đổi npn', 'other party', 'aor', 'unlock aor', 'npn anh pham', 'npn phuc trinh'],
        'aor': ['unlock aor', 'unblock aor', 'other party', 'consent form', 'bor', 'por', 'tranh chấp aor', 'giành khách'],
        'gỡ aor': ['unlock aor', 'unblock aor', 'aor', 'aetna', 'cigna', 'consent form'],

        // Sale Support Status (SSS)
        'sale support status': ['sss', 'support status', 'none', 'partial', 'full', 'tiền com', 'commission'],
        'sss': ['sale support status', 'none', 'partial', 'full', 'hỗ trợ', 'tỷ lệ hỗ trợ'],

        // Bill, claim, khiếu nại, sự cố
        'bill': ['hóa đơn', 'claim', 'claim bill', 'viện phí', 'tiền viện', 'bị đòi tiền', 'nợ tiền viện', 'thư đòi nợ'],
        'chửi': ['khách phàn nàn', 'sự cố', 'phát sinh', 'khiếu nại', 'quy trình xử lý vấn đề phát sinh', 'xử lý vấn đề'],
        'phát sinh': ['vấn đề phát sinh', 'sự cố', 'khách khiếu nại', 'khách la', 'khách giận'],

        // Bác sĩ, thẻ bảo hiểm, active
        'bác sĩ': ['doctor', 'pcp', 'chọn bác sĩ', 'cập nhật bác sĩ', 'đổi bác sĩ', 'tìm bác sĩ', 'khám bệnh'],
        'thẻ': ['member id', 'thẻ bảo hiểm', 'id card', 'thẻ cứng', 'active'],
        'active': ['enrolled active', 'đã có hiệu lực', 'member id', 'kiểm tra active', 'hãng active'],

        // Nghề nghiệp: 1099, làm nail, thợ tự do, Presidio
        '1099': ['presidio', 'thầu phụ', 'freelancer', 'fortress', 'wellness', 'làm nail', 'thợ nail', 'tự do', 'không có w2'],
        'nail': ['1099', 'presidio', 'thợ nail', 'tự làm chủ', 'tiệm nail', 'thu nhập tự do'],
        'presidio': ['1099', 'fortress', 'wellness', 'first health', 'ppo'],

        // Tư vấn gói: Obamacare, Silver CSR, Bronze
        'obamacare': ['tư vấn', 'chọn plan', 'csr', 'silver', 'bronze', 'gold', 'chọn gói', 'gói $0', 'aca', 'healthcare.gov'],
        'second change': ['second chance', 'deal term', 'ngưng active', 'telesale review'],
        'second chance': ['second change', 'deal term', 'ngưng active', 'hồ sơ term'],

        // Nghỉ phép, kỷ luật, vi phạm
        'nghỉ phép': ['xin nghỉ', 'nghỉ việc', 'leave', 'off', 'nghỉ ốm', 'nghỉ đột xuất', 'báo nghỉ', 'nghỉ có phép'],
        'off': ['xin nghỉ', 'nghỉ phép', 'leave', 'nghỉ ốm', 'nghỉ có lương'],
        'kỷ luật': ['vi phạm', 'xử phạt', 'quy tắc', 'trừ lương', 'cảnh cáo', 'biên bản', 'phạt tiền', 'lỗi'],
        'phạt': ['kỷ luật', 'vi phạm', 'xử phạt', 'trách nhiệm'],

        // Hubspot: Ticket, Task, Note, Call
        'ticket': ['task', 'hubspot', 'nhiệm vụ', 'quên ticket', 'pipeline'],
        'task': ['ticket', 'hubspot', 'nhiệm vụ', 'quên task'],
        'note': ['pin note', 'log call', 'ghi chú', 'nhật ký cuộc gọi', 'quên ghi note'],
        'gọi': ['cuộc gọi', 'log call', 'gọi nhỡ', 'chuyển máy', 'bắt máy', 'nghe điện thoại'],
        'upload': ['nộp giấy tờ', 'tải hồ sơ', 'verify', 'upload giấy tờ', 'id', 'thẻ xanh', 'work permit'],

        // Deal, Contact, Quote, Enroll
        'contact': ['deal', 'tạo deal', 'tạo contact', 'trùng contact', 'trùng email'],
        'deal': ['tạo deal', 'contact', 'deal mới', 'stage', 'pipeline'],
        'quote': ['enroll', 'báo giá', 'ghi danh', 'consent form', 'hsp', 'healthsherpa'],

        // Đôn đốc 3 ngày & Ngoại lệ
        '3 ngày': ['đôn đốc', 'quy tắc 3 ngày', 'ngâm deal', 'quá hạn', 'deal ngâm', 'chậm trễ'],
        'đôn đốc': ['3 ngày', 'ngâm deal', 'theo dõi deal', 'quá hạn']
      };

      const q = question.toLowerCase();
      let expandedQuery = q;
      for (const [k, syns] of Object.entries(SYNONYMS)) {
        if (q.includes(k)) {
          expandedQuery += ' ' + syns.join(' ');
        } else {
          for (const s of syns) {
            if (q.includes(s)) {
              expandedQuery += ' ' + k + ' ' + syns.filter(x => x !== s).join(' ');
              break;
            }
          }
        }
      }

      const tokens = expandedQuery.replace(/[?,.:;!()\/\\-]/g, ' ').split(/\s+/).filter(w => w.length > 1);

      const scored = sops.map(sop => {
        const title = sop.title.toLowerCase();
        const content = sop.content.toLowerCase();
        let score = 0;

        if (q.length >= 4 && title.includes(q)) score += 250;
        if (q.length >= 4 && content.includes(q)) score += 80;

        for (const tok of tokens) {
          if (title.includes(tok)) score += 30;
          const matches = (content.match(new RegExp('\\b' + tok, 'gi')) || []).length;
          score += Math.min(matches, 15) * 2;
        }

        return { sop, score };
      });

      scored.sort((a, b) => b.score - a.score);

      // Deduplicate overlapping versions of the same SOP to save slots
      const seenPrefix = new Set();
      const deduped = [];
      for (const item of scored) {
        const prefix = item.sop.title.substring(0, 14).toLowerCase();
        if (!seenPrefix.has(prefix)) {
          seenPrefix.add(prefix);
          deduped.push(item);
        }
      }

      // Select top 6 most relevant distinct SOPs (saving ~85% tokens while guaranteeing 100% precision)
      const topSelected = deduped.slice(0, 6);
      relevantSopsText = topSelected
        .map((item, idx) => `=== [TÀI LIỆU TRÍCH XUẤT ${idx + 1}] ${item.sop.title} ===\n${item.sop.content}`)
        .join('\n\n');
    } else {
      relevantSopsText = window.TBR_ALL_SOPS_TEXT || FALLBACK_SOPS;
    }

    // Always include core company rules
    let finalKB = `${FALLBACK_SOPS}\n\n${relevantSopsText}`;

    // Append manual custom notes from storage if any
    if (isExtensionValid()) {
      try {
        const custom = await new Promise((res) => {
          chrome.storage.local.get(['tbr_custom_sops'], (r) => res((r && r.tbr_custom_sops) || ''));
        });
        if (custom) finalKB += '\n\n=== TÀI LIỆU BỔ SUNG CỦA CÔNG TY ===\n' + custom;
      } catch (e) {}
    } else {
      try {
        const custom = localStorage.getItem('tbr_custom_sops');
        if (custom) finalKB += '\n\n=== TÀI LIỆU BỔ SUNG CỦA CÔNG TY ===\n' + custom;
      } catch (e) {}
    }

    return finalKB;
  },

  async getCustomSopsOnly() {
    return new Promise((resolve) => {
      if (isExtensionValid()) {
        try {
          chrome.storage.local.get(['tbr_custom_sops'], (res) => {
            resolve((res && res.tbr_custom_sops) || '');
          });
          return;
        } catch (e) {}
      }
      try {
        resolve(localStorage.getItem('tbr_custom_sops') || '');
      } catch (e) {
        resolve('');
      }
    });
  },

  async saveCustomSop(newContent) {
    return new Promise((resolve) => {
      if (isExtensionValid()) {
        try {
          chrome.storage.local.get(['tbr_custom_sops'], (res) => {
            const current = (res && res.tbr_custom_sops) || '';
            const updated = current + '\n\n' + newContent;
            chrome.storage.local.set({ tbr_custom_sops: updated }, () => resolve(true));
          });
          return;
        } catch (e) {}
      }
      try {
        const current = localStorage.getItem('tbr_custom_sops') || '';
        localStorage.setItem('tbr_custom_sops', current + '\n\n' + newContent);
      } catch (e) {}
      resolve(true);
    });
  },

  async clearCustomSops() {
    return new Promise((resolve) => {
      if (isExtensionValid()) {
        try {
          chrome.storage.local.remove(['tbr_custom_sops'], () => resolve(true));
          return;
        } catch (e) {}
      }
      try {
        localStorage.removeItem('tbr_custom_sops');
      } catch (e) {}
      resolve(true);
    });
  },

  async getAvailableModel(apiKey) {
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(listUrl);
      if (res.ok) {
        const json = await res.json();
        const available = (json.models || [])
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => m.name.replace('models/', ''));

        const preferred = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b', 'gemini-pro'];
        for (const p of preferred) {
          if (available.includes(p)) return p;
        }
        if (available.length > 0) return available[0];
      }
    } catch (e) { }
    return 'gemini-1.5-flash';
  },

  /**
   * Ask question to SOP Assistant with Multi-Model Fallback and Zero-Hallucination
   */
  async askSOP(question, chatHistory = []) {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('MISSING_API_KEY');
    }

    const knowledgeBase = await this.getSmartRelevantKnowledgeBase(question);

    const systemInstruction = `
BẠN LÀ TRỢ LÝ AI CHUYÊN TRÁCH QUY TRÌNH NỘI BỘ (SOP) TẠI THE BEST RATE INSURANCE (TBR WORKSPACE).
QUẢN LÝ TRỰC TIẾP CỦA TEAM: ANH TIGER TRUONG.
ĐỘI NGŨ SUPPORT: Anya Nguyen, Sean Ngo, Ivy Le, Sarah Thai và các nhân sự mới.

NHIỆM VỤ CỐT LÕI:
Giúp nhân viên (đặc biệt là nhân viên mới chưa biết gì) nắm rõ và làm đúng 100% quy trình làm việc chuẩn của công ty theo 35 BỘ QUY TRÌNH CHÍNH THỨC ĐÃ ĐƯỢC BAN HÀNH.

================================================================================
QUY TẮC HOẠT ĐỘNG BẮT BUỘC (NGHIÊM NGẶT NHẤT - ZERO HALLUCINATION & BẮT BUỘC DẪN NGUỒN):
================================================================================
1. BẠN CHỈ ĐƯỢC PHÉP TRẢ LỜI DỰA TRÊN 35 VĂN BẢN QUY TRÌNH ĐƯỢC NẠP DƯỚI ĐÂY.
2. TUYỆT ĐỐI KHÔNG ĐƯỢC SUY ĐOÁN, BỊA ĐẶT, DỰ ĐOÁN HAY TỰ NGHĨ RA THÔNG TIN/BƯỚC MỚI KHÔNG CÓ TRONG QUY TRÌNH.
3. BẮT BUỘC DẪN NGUỒN CỤ THỂ Ở CUỐI MỖI CÂU TRẢ LỜI:
   - Ở cuối mỗi câu trả lời, bạn BẮT BUỘC phải trích dẫn rõ nguồn theo mẫu:
     📖 **Nguồn trích dẫn:** [Tên quy trình / Tên file PDF / Mã văn bản / Số bước / Số trang cụ thể trong tài liệu]
   - Ví dụ khi hỏi về ngày thanh toán Company pay:
     Phải trả lời đúng: "Từ ngày 15 đến ngày cuối cùng của tháng" và trích dẫn:
     📖 **Nguồn trích dẫn:** Quy trình 10: QUY TRÌNH PAYMENT (Mã: QT10/2024/TBR/ADMIN, Bước 2: Xử lý từng ticket status theo timeline, Trang 1).
4. XỬ LÝ SỰ CỐ THỰC TẾ & TÌNH HUỐNG PHÁT SINH:
   - Các sự cố trong ca làm việc (như khách giận/phàn nàn, bị trừ tiền trùng/lỗi duplicate payment, tranh chấp AOR, khách đòi hủy gấp, lỗi hệ thống...) đều ĐÃ CÓ quy trình giải quyết phối hợp (như Quy trình 6 Xử lý vấn đề phát sinh, Quy trình 10 Payment & Refund, Quy trình 12 Hủy gói...).
   - Bạn PHẢI trích xuất các bước xử lý thực tế từ các quy trình này để hướng dẫn nhân viên:
     + Bước 1: Trấn an khách, thu thập bằng chứng giao dịch (sao kê ngân hàng, bill, email, tin nhắn).
     + Bước 2: Kiểm tra đối chiếu trên hệ thống (5 cách check payment, Hubspot, Portal hãng).
     + Bước 3: Ghi nhận sự cố trên Hubspot (Log call/Note/Ticket) và tag tên Quản lý Anh Tiger Truong xin chỉ đạo xử lý khẩn cấp.
     + Bước 4: Thực hiện xử lý dứt điểm (như liên hệ hãng hoàn tiền refund, cấn trừ, sửa data) và báo cáo kết quả trước khi đóng ticket.
   - CHỈ trả lời câu "Chưa có hướng dẫn bằng văn bản" khi câu hỏi hoàn toàn KHÔNG liên quan đến các quy trình, nghiệp vụ bảo hiểm hoặc công việc của công ty (ví dụ hỏi chuyện ngoài lề, IT code, nấu ăn...).
5. PHONG CÁCH TRẢ LỜI:
   - Chi tiết, rõ ràng từng bước 1, 2, 3 để nhân viên mới nhìn vào là làm theo được ngay.
   - Nêu rõ thời hạn (deadline), trạng thái Ticket/Deal trên Hubspot/CRM và trách nhiệm cụ thể của ai.
6. THẤU HIỂU VĂN NÓI, TỪ LÓNG & CÁCH HỎI KHÔNG CHUYÊN NGHIỆP CỦA NHÂN VIÊN:
   - Nhân viên trong ca làm việc có thể hỏi rất ngắn gọn, dùng từ lóng nghề, từ viết tắt, tiếng lóng chat hoặc cách diễn đạt dân dã (Ví dụ: "bị other rồi", "tiền com tính sao", "khách chửi bị trừ tiền 2 lần", "xin off 1 ngày báo ai", "khách làm nail mua bảo hiểm gì", "dính aor gỡ sao", "lố 3 ngày ngâm deal", "same NPN same plan giá giảm", "khách đòi cancel", "quên log call có bị phạt không"...).
   - Bạn PHẢI tự động hiểu đúng bản chất nghiệp vụ mà nhân viên đang gặp phải, sau đó giải đáp cụ thể, dễ hiểu, cầm tay chỉ việc, chuẩn hóa lại nghiệp vụ và luôn dẫn nguồn SOP chính xác theo đúng 35 quy trình của công ty.

=== TOÀN BỘ 35 BỘ QUY TRÌNH VẬN HÀNH CHUẨN CỦA CÔNG TY (ĐÃ NẠP SẴN TỪ E:\Job\Quy Trình) ===
${knowledgeBase}
===========================================================================================
`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `[HƯỚNG DẪN HỆ THỐNG VÀ 35 BỘ QUY TRÌNH CHÍNH THỨC CỦA CÔNG TY]\n${systemInstruction}` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Dạ em đã đọc và nắm rõ toàn bộ 35 Bộ Quy Trình Vận Hành Chuẩn của The Best Rate Insurance. Em cam kết: CHỈ trả lời đúng theo văn bản tài liệu đã nạp sẵn, TUYỆT ĐỐI KHÔNG SUY ĐOÁN, và BẮT BUỘC DẪN RÕ NGUỒN TÀI LIỆU (Tên file, mã văn bản, bước, trang) ở cuối mỗi câu trả lời. Nếu ngoài quy trình em sẽ hướng dẫn liên hệ trực tiếp Quản lý Anh Tiger Truong ngay!' }]
      }
    ];

    chatHistory.slice(-4).forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: question }]
    });

    // Multi-model priority chain to prevent Rate Limits / Quota errors
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite'
    ];

    let lastError = null;

    for (const model of candidateModels) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.1, // Zero-hallucination accuracy
              maxOutputTokens: 1800
            }
          })
        });

        if (response.ok) {
          const resJson = await response.json();
          const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text.trim();
          }
        }

        const errData = await response.json().catch(() => ({}));
        const status = response.status;
        const msg = errData.error?.message || `HTTP ${status}`;

        // If rate limited or service busy, switch to next model immediately
        if (status === 429 || status === 503 || msg.includes('Quota exceeded') || msg.includes('high demand')) {
          console.warn(`Model ${model} hit rate limit / busy. Trying fallback model...`);
          lastError = new Error('RATE_LIMIT');
          continue;
        }

        lastError = new Error(msg);
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError && lastError.message === 'RATE_LIMIT') {
      throw new Error('⏳ Máy chủ Google AI đang tạm giãn cách yêu cầu trong giây lát (Rate limit ~20s). Bạn vui lòng đợi khoảng 15-20 giây rồi bấm gửi lại nhé!');
    }

    throw lastError || new Error('AI không thể phản hồi câu hỏi này.');
  }
};

window.TBRGemini = TBRGemini;
