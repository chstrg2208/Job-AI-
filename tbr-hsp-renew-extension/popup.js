(function () {
  'use strict';

  const STORAGE_KEY = 'tbrHspClientData';
  const P = window.TBRParser;

  function renderSummary(saved) {
    const box = document.getElementById('summary');
    if (!box) return;
    if (!saved || (!saved.rawNote && (!saved.overrides || Object.keys(saved.overrides).length === 0))) {
      box.textContent = 'Chưa có dữ liệu khách nào được nạp. Hãy bấm "Gửi data sang HealthSherpa" ở tab CRM hoặc dán Note trực tiếp trên bảng HealthSherpa.';
      return;
    }
    const d = P.parseCrmNote(saved.rawNote || '', saved.overrides || {});
    box.innerHTML = '';
    const rows = [
      ['Khách hàng', (d.members || []).join(' + ') || '(chưa có)'],
      ['Email thật', d.email || '(chưa có)'],
      ['Phone', d.phone || '(giữ nguyên)'],
      ['County', d.county || '(chưa có)'],
      ['Income 2027', d.income !== null ? `$${d.income.toLocaleString('en-US')}` : '(chưa có)'],
      ['Enrolled addr', d.enrolledAddress ? P.formatAddress(d.enrolledAddress) : '(chưa có)'],
      ['Mailing addr', d.sameMailingAsEnrolled ? 'Giống Enrolled' : P.formatAddress(d.mailingAddress)]
    ];
    for (const [k, v] of rows) {
      const div = document.createElement('div');
      div.className = 'row';
      const lbl = document.createElement('span');
      lbl.className = 'lbl';
      lbl.textContent = `${k}: `;
      const val = document.createElement('span');
      val.textContent = v;
      div.appendChild(lbl);
      div.appendChild(val);
      box.appendChild(div);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get([STORAGE_KEY], res => renderSummary(res[STORAGE_KEY]));

    document.getElementById('btn-show').addEventListener('click', () => {
      if (!chrome.tabs) return;
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'TBR_SHOW_PANEL' });
        }
        window.close();
      });
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      chrome.storage.local.remove([STORAGE_KEY], () => {
        renderSummary(null);
      });
    });
  });
})();
