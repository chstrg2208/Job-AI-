/**
 * TBR AI Assistant - Popup Logic with Google Gemini Integration
 */

document.addEventListener('DOMContentLoaded', async () => {
  const elRte = document.getElementById('pop-val-rte');
  const elNewRenew = document.getElementById('pop-val-newrenew');
  const elNeed1st = document.getElementById('pop-val-need1st');
  const el1stDone = document.getElementById('pop-val-1stdone');

  const apiKeyInput = document.getElementById('pop-api-key');
  const saveKeyBtn = document.getElementById('pop-save-key');
  const geminiBtn = document.getElementById('pop-gemini-btn');
  const geminiOutput = document.getElementById('pop-gemini-output');
  const geminiStatus = document.getElementById('pop-gemini-status');
  const copyBtn = document.getElementById('pop-copy-btn');
  const rteBanner = document.getElementById('pop-rte-banner');

  let currentData = {
    rte: 0,
    newRenew: 0,
    need1stPay: 0,
    firstPayDone: 0,
    waitingDoc: 0,
    quoted: 0,
    active: 0
  };

  let geminiResult = '';

  // Load saved API key
  if (window.TBRGemini) {
    const savedKey = await window.TBRGemini.getApiKey();
    if (savedKey) {
      apiKeyInput.value = savedKey;
    }
  }

  saveKeyBtn.addEventListener('click', async () => {
    const val = apiKeyInput.value.trim();
    if (val && window.TBRGemini) {
      await window.TBRGemini.setApiKey(val);
      saveKeyBtn.innerText = '✅ Đã lưu';
      setTimeout(() => {
        saveKeyBtn.innerText = 'Lưu';
      }, 1500);
    }
  });

  // Load latest stats from storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['tbr_latest_stats'], (res) => {
      if (res.tbr_latest_stats) {
        currentData = {
          ...currentData,
          ...res.tbr_latest_stats,
          need1stPay: res.tbr_latest_stats.need1st || res.tbr_latest_stats.need1stPay || 0,
          firstPayDone: res.tbr_latest_stats.firstDone || res.tbr_latest_stats.firstPayDone || 0
        };
        updateUI();
      }
    });
  }

  function updateUI() {
    if (elRte) elRte.innerText = currentData.rte || 0;
    if (elNewRenew) elNewRenew.innerText = currentData.newRenew || 0;
    if (elNeed1st) elNeed1st.innerText = currentData.need1stPay || 0;
    if (el1stDone) el1stDone.innerText = currentData.firstPayDone || 0;
  }

  // Run Gemini AI
  geminiBtn.addEventListener('click', async () => {
    if (!window.TBRGemini) return;

    const key = await window.TBRGemini.getApiKey();
    if (!key) {
      apiKeyInput.focus();
      geminiOutput.innerText = '👉 Vui lòng dán Google Gemini API Key vào ô trên và bấm Lưu trước!';
      return;
    }

    geminiBtn.innerText = '⚡ Đang gọi Gemini...';
    geminiBtn.disabled = true;
    geminiStatus.innerText = '⏳ Thinking...';
    geminiStatus.style.color = '#ffa940';
    geminiOutput.innerText = '🤖 Google Gemini AI đang phân tích dữ liệu và soạn thảo văn bản đôn đốc...';

    try {
      const response = await window.TBRGemini.generateDispatch(currentData);
      geminiResult = response;
      geminiOutput.innerText = response;
      geminiStatus.innerText = '✅ Active';
      geminiStatus.style.color = '#b7eb8f';
    } catch (err) {
      console.error('Gemini error:', err);
      geminiStatus.innerText = '❌ Lỗi API';
      geminiStatus.style.color = '#ff4d4f';
      geminiOutput.innerText = `Lỗi: ${err.message}. Hãy kiểm tra lại API Key.`;
    } finally {
      geminiBtn.innerText = '⚡ Kích Hoạt Gemini AI';
      geminiBtn.disabled = false;
    }
  });

  // Copy button
  copyBtn.addEventListener('click', () => {
    let text = geminiResult;
    if (!text) {
      const today = new Date().toLocaleDateString('vi-VN');
      text = `🚨 [THÔNG BÁO ĐÔN ĐỐC - TEAM TIGER TRUONG - ${today}]
──────────────────────────────
⚠️ CÁC TRƯỜNG CẦN XỬ LÝ GẤP (NGUY CƠ NGÂM QUÁ 3 NGÀY):
• 💳 [ENROLLED - NEED 1ST PAYMENT] (${currentData.need1stPay} deals): Giục khách đóng tiền đợt 1 ngay để giữ hợp đồng!
• 🔄 [ENROLLED - 1ST PAYMENT DONE] (${currentData.firstPayDone} deals): Support đối soát hãng để chuyển sang ACTIVE trong tháng!
• 📞 [NEW OPPORTUNITY / CALL TO RENEW] (${currentData.newRenew} deals): Khách mới và tái tục cần gọi tư vấn!

🔥 KHAY VIỆC ANH TIGER:
• [READY TO ENROLL]: ${currentData.rte} deal ${currentData.rte > 0 ? '⚠️ (CHỜ ANH TIGER BẤM ENROLL)' : '✅'}
──────────────────────────────
👉 Đề nghị Support (Anya, Sean, Ivy, Sarah) tập trung rà soát và xử lý dứt điểm để đẩy sang RTE cho anh Tiger nhé!`;
    }

    navigator.clipboard.writeText(text).then(() => {
      const orig = copyBtn.innerText;
      copyBtn.innerText = '✅ Đã Copy!';
      setTimeout(() => {
        copyBtn.innerText = orig;
      }, 2000);
    });
  });

  // Click RTE banner
  rteBanner.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            const btn = document.getElementById('tbr-btn-rte');
            if (btn) btn.click();
          }
        });
      }
    });
  });
});
