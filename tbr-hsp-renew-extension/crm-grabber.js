(function () {
  'use strict';

  if (window.__tbrCrmGrabberInitialized) return;
  window.__tbrCrmGrabberInitialized = true;

  const P = window.TBRParser;
  if (!P) return;

  const STORAGE_KEY = 'tbrHspClientData';

  function showToast(msg, isWarn) {
    let toast = document.getElementById('tbr-crm-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tbr-crm-toast';
      document.body.appendChild(toast);
    }
    toast.className = isWarn ? 'tbr-show tbr-toast-warn' : 'tbr-show';
    toast.textContent = msg;
    clearTimeout(toast.__timer);
    toast.__timer = setTimeout(() => {
      toast.classList.remove('tbr-show');
    }, 4500);
  }

  function extractBestNoteBlock() {
    const selected = window.getSelection ? window.getSelection().toString().trim() : '';
    if (selected && selected.length > 20) return selected;

    const candidates = Array.from(document.querySelectorAll('div, section, article, pre, p, td'))
      .filter(el => {
        if (el.closest('#tbr-crm-pill, #tbr-crm-toast')) return false;
        const txt = (el.innerText || '').trim();
        return txt.length >= 40 && txt.length <= 2000 &&
               /(Enrolled\s+address|Mailing\s+address|Ready\s+to\s+enroll|Apply\s+for\s+member)/i.test(txt) &&
               /(Income|County|Plan|Effective\s+date)/i.test(txt);
      });

    if (candidates.length > 0) {
      // Pick the tightest element containing the note keywords
      candidates.sort((a, b) => a.innerText.length - b.innerText.length);
      return candidates[0].innerText.trim();
    }

    return '';
  }

  function extractClientEmailAndPhone(noteText) {
    let email = '';
    let phone = '';

    // 1. Check mailto links or elements near "Email" label in main content (skip navbar/header)
    const bodyText = (document.body?.innerText || '');
    const emailLabeled = bodyText.match(/(?:^|\n)\s*Email(?:\s+address)?\s*[:\n]+\s*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/i);
    if (emailLabeled && !P.isForbiddenEmail(emailLabeled[1]).forbidden) {
      email = emailLabeled[1].trim();
    }

    if (!email) {
      const allEmails = (noteText + '\n' + bodyText).match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
      const cleanEmails = allEmails.filter(e => !P.isForbiddenEmail(e).forbidden && !/hubspot|pandadoc|thebestrate/i.test(e));
      if (cleanEmails.length > 0) email = cleanEmails[0];
    }

    // 2. Check Phone near label or inside contact panel
    const phoneLabeled = bodyText.match(/(?:^|\n)\s*Phone(?:\s+number)?\s*[:\n]+\s*((?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i);
    if (phoneLabeled) {
      const p = P.parsePhone(phoneLabeled[1]);
      if (p) phone = p.formatted;
    }

    return { email, phone };
  }

  function handleSend() {
    const rawNote = extractBestNoteBlock();
    const { email, phone } = extractClientEmailAndPhone(rawNote);
    const parsed = P.parseCrmNote(rawNote, {
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {})
    });

    const payload = {
      rawNote: rawNote || '',
      overrides: {
        ...(parsed.email ? { email: parsed.email } : {}),
        ...(parsed.phone ? { phone: parsed.phone } : {})
      },
      updatedAt: Date.now()
    };

    chrome.storage.local.set({ [STORAGE_KEY]: payload }, () => {
      const clientLabel = parsed.members?.length ? parsed.members[0] : (parsed.email || 'khách hàng');
      if (!rawNote && !parsed.email) {
        showToast('⚠️ Chưa thấy Note RTE trên trang này. Bạn có thể bôi đen đoạn Note rồi bấm lại nút này hoặc dán thẳng bên HealthSherpa.', true);
      } else {
        showToast(`✅ Đã gửi dữ liệu (${clientLabel}${parsed.county ? ` - ${parsed.county}` : ''}${parsed.email ? ` - ${parsed.email}` : ''}) sang HealthSherpa!`);
      }
    });
  }

  function init() {
    if (document.getElementById('tbr-crm-pill')) return;
    const btn = document.createElement('button');
    btn.id = 'tbr-crm-pill';
    btn.type = 'button';
    btn.textContent = '📋 Gửi data sang HealthSherpa';
    btn.title = 'Mẹo: Bôi đen đoạn Note RTE nếu trên trang có nhiều ghi chú, rồi bấm nút này.';
    btn.addEventListener('click', handleSend);
    document.body.appendChild(btn);
  }

  init();
})();
