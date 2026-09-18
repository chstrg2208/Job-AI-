/**
 * TBR SOP AI Assistant - Universal Everywhere Floating Content Script
 * Backed by 35 Official Standard Operating Procedures (E:\Job\Quy Trình)
 * Strict Grounding (Zero Hallucination) & Mandatory Source Attribution
 * Ultra Modern SaaS & Glassmorphism Design
 */

(function () {
  const isPopup = window.location.protocol === 'chrome-extension:';

  // Prevent injection inside iframes (e.g. ad frames, widgets)
  if (window.top !== window && !isPopup) {
    return;
  }

  let isCollapsed = false;
  let barElement = null;
  let chatHistory = [];

  if (isPopup) {
    document.body.classList.add('tbr-in-popup');
  }

  function showToast(message) {
    let toast = document.getElementById('tbr-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tbr-toast';
      toast.className = 'tbr-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '🛡️ ' + message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  /**
   * High-fidelity Markdown Formatter & Citation Highlighter
   */
  function formatMarkdown(text) {
    if (!text) return '';

    // 1. Sanitize HTML entities
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Format Source Citations
    escaped = escaped.replace(/(?:📖|📚)\s*(?:Nguồn trích dẫn|Nguồn|Tài liệu tham khảo|Văn bản đối chiếu):\s*([^\n]+(?:\n(?:[ \t]*[•\-\*].*|[ \t]*[A-Za-z0-9].*))*)/gi, (match, p1) => {
      const cleanCitation = p1.trim().replace(/\n/g, '<br/>');
      return `<div class="tbr-citation-box">
        <div class="tbr-citation-header">
          <span>📖</span> NGUỒN TRÍCH DẪN XÁC MINH (SOP GỐC)
        </div>
        <div class="tbr-citation-body">${cleanCitation}</div>
      </div>`;
    });

    // 3. Headings
    escaped = escaped.replace(/^### (.*$)/gim, '<div class="tbr-md-h4">$1</div>');
    escaped = escaped.replace(/^## (.*$)/gim, '<div class="tbr-md-h3">$1</div>');
    escaped = escaped.replace(/^# (.*$)/gim, '<div class="tbr-md-h2">$1</div>');

    // 4. Bold
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 5. Inline Code
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="tbr-inline-code">$1</code>');

    // 6. Lists
    escaped = escaped.replace(/^[•\-\*]\s+(.+)$/gim, '<li class="tbr-md-li">$1</li>');
    escaped = escaped.replace(/((?:<li class="tbr-md-li">.*<\/li>\s*)+)/g, '<ul class="tbr-md-ul">$1</ul>');

    // 7. Paragraph line breaks
    escaped = escaped.replace(/\n\n+/g, '<div style="height:8px;"></div>');
    escaped = escaped.replace(/\n/g, '<br/>');

    return escaped;
  }

  function renderWelcomeCard() {
    const chatBody = document.getElementById('tbr-chat-body');
    if (!chatBody) return;

    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'tbr-welcome-card';
    welcomeDiv.id = 'tbr-welcome-banner';
    welcomeDiv.innerHTML = `
      <div class="tbr-welcome-header">
        <div class="tbr-welcome-icon">🛡️</div>
        <div>
          <div class="tbr-welcome-title">TBR SOP AI COPILOT</div>
          <div class="tbr-welcome-badge">Trợ Lý Vận Hành Quy Trình Nội Bộ Chuẩn</div>
        </div>
      </div>

      <div class="tbr-welcome-desc">
        Hệ thống AI được kết nối và xác minh trực tiếp bởi <strong>35 Bộ Quy Trình Chuẩn</strong> (Team Tiger Truong - The Best Rate Insurance).
      </div>

      <div class="tbr-feature-grid">
        <div class="tbr-feature-item">
          <div class="tbr-feature-icon">⚡</div>
          <div class="tbr-feature-content">
            <div class="tbr-feature-title">Zero Hallucination (Không Suy Đoán)</div>
            <div class="tbr-feature-sub">100% câu trả lời đều dựa trên văn bản SOP chính thức, tuyệt đối không đoán mò.</div>
          </div>
        </div>

        <div class="tbr-feature-item">
          <div class="tbr-feature-icon">📖</div>
          <div class="tbr-feature-content">
            <div class="tbr-feature-title">Dẫn Nguồn Minh Bạch</div>
            <div class="tbr-feature-sub">Luôn chỉ rõ Tên quy trình, Mã văn bản, Bước và Trang đối chiếu.</div>
          </div>
        </div>

        <div class="tbr-feature-item">
          <div class="tbr-feature-icon">👨‍💼</div>
          <div class="tbr-feature-content">
            <div class="tbr-feature-title">Quy Tắc Đôn Đốc & Phê Duyệt</div>
            <div class="tbr-feature-sub">Deal trung gian không ngâm quá 3 ngày; ca đặc biệt ngoài quy trình chuyển Quản lý Tiger Truong.</div>
          </div>
        </div>
      </div>

      <div class="tbr-welcome-footer">
        👉 Bạn đang vướng bước nào trong công việc? Hãy gõ câu hỏi vào ô bên dưới để mình giải đáp và dẫn nguồn ngay nhé!
      </div>
    `;

    chatBody.appendChild(welcomeDiv);
  }

  function appendMessage(role, text) {
    const chatBody = document.getElementById('tbr-chat-body');
    if (!chatBody) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `tbr-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'tbr-msg-avatar';
    avatar.innerText = role === 'ai' ? '🛡️' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'tbr-msg-bubble';

    if (role === 'ai') {
      bubble.innerHTML = formatMarkdown(text);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'tbr-copy-btn';
      copyBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy Hướng Dẫn</span>
      `;
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerHTML = '<span>✅ Đã Copy!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy Hướng Dẫn</span>
            `;
          }, 2000);
        });
      });
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(copyBtn);
    } else {
      bubble.innerText = text;
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    chatHistory.push({ role, text });
  }

  async function handleUserSend(textToSend) {
    const input = document.getElementById('tbr-chat-input');
    const sendBtn = document.getElementById('tbr-send-btn');
    const msg = textToSend || (input ? input.value.trim() : '');
    if (!msg) return;

    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }

    appendMessage('user', msg);

    const chatBody = document.getElementById('tbr-chat-body');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'tbr-msg ai';
    loadingDiv.id = 'tbr-loading-msg';
    loadingDiv.innerHTML = `
      <div class="tbr-msg-avatar">🛡️</div>
      <div class="tbr-msg-bubble tbr-loading-bubble">
        <div class="tbr-typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <div class="tbr-loading-text">Đang đối chiếu và trích dẫn 35 bộ quy trình chính thức...</div>
      </div>
    `;
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (sendBtn) sendBtn.disabled = true;

    try {
      if (!window.TBRGemini) {
        throw new Error('Chưa tải được thư viện kết nối AI');
      }

      const apiKey = await window.TBRGemini.getApiKey();
      if (!apiKey) {
        document.getElementById('tbr-key-drawer')?.classList.add('open');
        throw new Error('Vui lòng nhập Google Gemini API Key ở biểu tượng ⚙️ góc trên!');
      }

      const aiReply = await window.TBRGemini.askSOP(msg, chatHistory);
      loadingDiv.remove();
      appendMessage('ai', aiReply);
    } catch (err) {
      loadingDiv.remove();
      const errMsg = String(err?.message || err || '');
      if (errMsg.includes('Extension context invalidated')) {
        appendMessage('ai', `🔄 **Tiện ích vừa được cập nhật phiên bản mới!**\n\nDo tiện ích vừa được Reload trong trang quản lý Chrome, bạn chỉ cần bấm **phím F5 (Tải lại trang web này)** một lần là có thể tiếp tục hỏi đáp bình thường nhé!`);
      } else {
        appendMessage('ai', `⚠️ ${errMsg || 'Không thể kết nối đến hệ thống tri thức.'}`);
      }
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  async function updateKbStats() {
    if (!window.TBRGemini) return;
    const statsEl = document.getElementById('tbr-kb-stats');
    if (!statsEl) return;
    const custom = await window.TBRGemini.getCustomSopsOnly();
    const dbCount = (window.TBR_SOPS_DATABASE && window.TBR_SOPS_DATABASE.length) || 35;
    if (!custom) {
      statsEl.innerText = `${dbCount} Quy Trình Chuẩn (133K ký tự)`;
    } else {
      statsEl.innerText = `${dbCount} Gốc + ${custom.length.toLocaleString()} ký tự`;
    }
  }

  function createSOPAssistant() {
    if (document.getElementById('tbr-urgent-bar')) return;

    barElement = document.createElement('div');
    barElement.id = 'tbr-urgent-bar';

    const sopCount = (window.TBR_SOPS_DATABASE && window.TBR_SOPS_DATABASE.length) || 35;

    barElement.innerHTML = `
      <div class="tbr-chat-header" id="tbr-drag-handle">
        <div class="tbr-chat-title">
          <div class="tbr-ai-avatar">🛡️</div>
          <div>
            <div class="tbr-title-text">TBR SOP ASSISTANT</div>
            <div class="tbr-subtitle">
              <span class="tbr-status-dot"></span> ${sopCount} Quy Trình • Zero Hallucination
            </div>
          </div>
        </div>
        <div class="tbr-controls">
          <button class="tbr-icon-btn" id="tbr-kb-toggle-btn" title="Xem danh mục 35 Quy trình nội bộ">📚</button>
          <button class="tbr-icon-btn" id="tbr-gear-btn" title="Cài đặt Gemini API Key">⚙️</button>
          <button class="tbr-icon-btn" id="tbr-clear-btn" title="Làm mới đoạn chat">🧹</button>
          ${!isPopup ? `
            <button class="tbr-icon-btn" id="tbr-collapse-btn" title="Thu nhỏ / Phóng to">➖</button>
            <button class="tbr-icon-btn" id="tbr-close-btn" title="Tạm ẩn">✕</button>
          ` : ''}
        </div>
      </div>

      <!-- Settings Drawer for API Key -->
      <div class="tbr-key-drawer" id="tbr-key-drawer">
        <div class="tbr-drawer-header">
          <span>🔑 Google Gemini API Key:</span>
          <div style="display:flex; gap:4px;">
            <button class="tbr-kb-btn secondary" id="tbr-toggle-key-visibility" title="Hiện/Ẩn Key" style="padding:2px 7px; font-size:10px;">👁️ Xem Key</button>
            <button class="tbr-kb-btn secondary" id="tbr-copy-key-btn" title="Copy Key" style="padding:2px 7px; font-size:10px;">📋 Copy</button>
          </div>
        </div>
        <div class="tbr-input-group">
          <input type="password" class="tbr-key-input" id="tbr-key-input" placeholder="Dán Gemini API Key (AQ.Ab...)" />
          <button class="tbr-btn-save" id="tbr-save-key-btn">Lưu Key</button>
        </div>
        <div class="tbr-key-hint">
          <a href="https://aistudio.google.com/app/apikey" target="_blank">👉 Quản lý / Lấy lại API Key tại Google AI Studio</a>
        </div>
      </div>

      <!-- Knowledge Base Manager Drawer -->
      <div class="tbr-kb-drawer" id="tbr-kb-drawer">
        <div class="tbr-drawer-header">
          <span>📚 Kho Tri Thức 35 Quy Trình (Team Tiger Truong)</span>
          <span class="tbr-kb-stats" id="tbr-kb-stats">35 Quy Trình Chuẩn</span>
        </div>
        <textarea class="tbr-kb-textarea" id="tbr-custom-sop-input" placeholder="Dán thêm quy định, thông báo mới của công ty nếu có..."></textarea>
        <div class="tbr-kb-actions">
          <button class="tbr-kb-btn primary" id="tbr-save-sop-text-btn">💾 Nạp Thêm Vào AI</button>
          <button class="tbr-kb-btn secondary" id="tbr-view-sop-btn">👁️ Danh Mục 35 Quy Trình</button>
          <button class="tbr-kb-btn danger" id="tbr-reset-sop-btn">🗑️ Reset Về Gốc</button>
        </div>
      </div>

      <!-- Chat Feed -->
      <div class="tbr-chat-body" id="tbr-chat-body"></div>

      <!-- Input Footer -->
      <div class="tbr-chat-footer">
        <div class="tbr-input-wrapper">
          <textarea class="tbr-chat-input" id="tbr-chat-input" placeholder="Hỏi quy trình (ví dụ: Ngày thanh toán company là ngày mấy?)..." rows="1"></textarea>
          <button class="tbr-send-btn" id="tbr-send-btn" title="Gửi câu hỏi (Enter)">
            <span>Gửi</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div class="tbr-footer-hint">
          <span>Nhấn <strong>Enter</strong> để gửi • <strong>Shift + Enter</strong> để xuống dòng</span>
          <span>100% Căn cứ SOP</span>
        </div>
      </div>
    `;

    document.body.appendChild(barElement);

    // Initial greeting card
    renderWelcomeCard();

    // Restore position & collapsed state from chrome.storage
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['tbr_sop_pos', 'tbr_sop_collapsed'], (res) => {
        if (!isPopup && res.tbr_sop_pos) {
          barElement.style.top = res.tbr_sop_pos.top;
          barElement.style.right = res.tbr_sop_pos.right;
        }
        if (res.tbr_sop_collapsed) {
          isCollapsed = true;
          barElement.classList.add('collapsed');
          const colBtn = document.getElementById('tbr-collapse-btn');
          if (colBtn) colBtn.innerText = '➕';
        }
      });
    }

    bindEvents();
    updateKbStats();
  }

  function bindEvents() {
    const handle = document.getElementById('tbr-drag-handle');
    let isDragging = false;
    let startX, startY, initialTop, initialRight;

    if (!isPopup && handle) {
      handle.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = barElement.getBoundingClientRect();
        initialTop = rect.top;
        initialRight = window.innerWidth - rect.right;
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dy = e.clientY - startY;
        const dx = startX - e.clientX;
        const newTop = Math.max(10, initialTop + dy);
        const newRight = Math.max(10, initialRight + dx);
        barElement.style.top = `${newTop}px`;
        barElement.style.right = `${newRight}px`;
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
              tbr_sop_pos: { top: barElement.style.top, right: barElement.style.right }
            });
          }
        }
      });
    }

    const collapseBtn = document.getElementById('tbr-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCollapse();
      });
    }

    // Clicking collapsed bar anywhere expands it
    barElement.addEventListener('click', (e) => {
      if (isCollapsed) {
        toggleCollapse();
      }
    });

    function toggleCollapse() {
      isCollapsed = !isCollapsed;
      barElement.classList.toggle('collapsed', isCollapsed);
      if (collapseBtn) collapseBtn.innerText = isCollapsed ? '➕' : '➖';
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ tbr_sop_collapsed: isCollapsed });
      }
    }

    // Close button
    const closeBtn = document.getElementById('tbr-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        barElement.classList.add('tbr-hidden');
        showToast('Trợ lý đã được ẩn. Nhấp biểu tượng tiện ích trên Chrome để mở lại!');
      });
    }

    // Clear chat button
    const clearBtn = document.getElementById('tbr-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatHistory = [];
        const chatBody = document.getElementById('tbr-chat-body');
        if (chatBody) {
          chatBody.innerHTML = '';
          renderWelcomeCard();
        }
        showToast('Đã làm mới đoạn chat!');
      });
    }

    // Toggle API Key Drawer
    const gearBtn = document.getElementById('tbr-gear-btn');
    const keyDrawer = document.getElementById('tbr-key-drawer');
    const keyInput = document.getElementById('tbr-key-input');
    const kbDrawer = document.getElementById('tbr-kb-drawer');

    gearBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      keyDrawer.classList.toggle('open');
      kbDrawer.classList.remove('open');
      if (keyDrawer.classList.contains('open') && window.TBRGemini) {
        const saved = await window.TBRGemini.getApiKey();
        if (saved) keyInput.value = saved;
      }
    });

    document.getElementById('tbr-save-key-btn').addEventListener('click', async () => {
      const val = keyInput.value.trim();
      if (val && window.TBRGemini) {
        await window.TBRGemini.setApiKey(val);
        showToast('🔑 Đã lưu Google Gemini API Key!');
        keyDrawer.classList.remove('open');
      }
    });

    const toggleKeyBtn = document.getElementById('tbr-toggle-key-visibility');
    if (toggleKeyBtn) {
      toggleKeyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (keyInput.type === 'password') {
          keyInput.type = 'text';
          toggleKeyBtn.innerText = '🔒 Ẩn Key';
        } else {
          keyInput.type = 'password';
          toggleKeyBtn.innerText = '👁️ Xem Key';
        }
      });
    }

    const copyKeyBtn = document.getElementById('tbr-copy-key-btn');
    if (copyKeyBtn) {
      copyKeyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = keyInput.value.trim();
        if (!val) {
          showToast('Chưa có Key để copy.');
          return;
        }
        navigator.clipboard.writeText(val).then(() => {
          showToast('📋 Đã copy API Key!');
          copyKeyBtn.innerText = '✅ Đã chép';
          setTimeout(() => { copyKeyBtn.innerText = '📋 Copy'; }, 2000);
        });
      });
    }

    // Toggle Knowledge Base Drawer
    const kbToggleBtn = document.getElementById('tbr-kb-toggle-btn');
    const customSopInput = document.getElementById('tbr-custom-sop-input');

    kbToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      kbDrawer.classList.toggle('open');
      keyDrawer.classList.remove('open');
      updateKbStats();
    });

    // Save pasted custom SOP
    document.getElementById('tbr-save-sop-text-btn').addEventListener('click', async () => {
      const text = customSopInput.value.trim();
      if (!text) {
        showToast('Vui lòng nhập nội dung trước.');
        return;
      }
      if (window.TBRGemini) {
        await window.TBRGemini.saveCustomSop(`[QUY ĐỊNH BỔ SUNG NẠP THỦ CÔNG (${new Date().toLocaleDateString('vi-VN')}]:\n${text}`);
        customSopInput.value = '';
        await updateKbStats();
        showToast('✅ Đã nạp thêm quy định mới vào AI!');
        appendMessage('ai', '📥 Đã lưu thành công văn bản bổ sung vào kho tri thức của AI!');
      }
    });

    // View current SOPs
    document.getElementById('tbr-view-sop-btn').addEventListener('click', async () => {
      const sops = window.TBR_SOPS_DATABASE || [];
      let listText = `📖 **DANH MỤC 35 QUY TRÌNH NỘI BỘ ĐÃ ĐƯỢC NẠP SẴN (E:\\Job\\Quy Trình):**\n\n`;
      sops.slice(0, 20).forEach((s, idx) => {
        listText += `• **${idx + 1}.** ${s.title} *(${s.pages} trang)*\n`;
      });
      if (sops.length > 20) {
        listText += `• ... và **${sops.length - 20} quy trình khác** (Tổng cộng 35 quy trình, hơn 133.000 ký tự).\n\n`;
      }
      listText += `\n📖 Nguồn trích dẫn: Thư viện 35 File PDF Quy Trình Nội Bộ - The Best Rate Insurance`;
      appendMessage('ai', listText);
    });

    // Reset SOPs to default
    document.getElementById('tbr-reset-sop-btn').addEventListener('click', async () => {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ tài liệu tùy chỉnh và khôi phục về 35 Quy Trình Chuẩn nạp sẵn của công ty?')) {
        if (window.TBRGemini) {
          await window.TBRGemini.clearCustomSops();
          await updateKbStats();
          showToast('🔄 Đã khôi phục về 35 Quy Trình Gốc!');
          appendMessage('ai', '🔄 Đã đặt lại kho tri thức về 35 Bộ Quy Trình Vận Hành Chuẩn nạp sẵn của công ty.');
        }
      }
    });

    // Chat input auto-expand and sending
    const input = document.getElementById('tbr-chat-input');
    const sendBtn = document.getElementById('tbr-send-btn');

    if (input) {
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 90) + 'px';
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserSend();
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => handleUserSend());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSOPAssistant);
  } else {
    createSOPAssistant();
  }
})();
