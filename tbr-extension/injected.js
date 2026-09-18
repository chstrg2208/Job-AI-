/**
 * TBR Assistant - Injected Script (MAIN world at document_start)
 * Captures all API traffic and React Component data before page loads.
 */

(function () {
  console.log('[TBR Assistant] MAIN-world interceptor initialized at document_start.');

  const detectedStages = {};

  function sendData() {
    if (Object.keys(detectedStages).length > 0) {
      window.postMessage({
        type: 'TBR_RAW_DATA',
        payload: { stages: detectedStages }
      }, '*');
    }
  }

  // Recursive parser to find stage names and numeric values in any JSON structure
  function extractStagesFromObject(obj, depth = 0) {
    if (!obj || depth > 8) return;

    if (Array.isArray(obj)) {
      obj.forEach(item => extractStagesFromObject(item, depth + 1));
      return;
    }

    if (typeof obj === 'object') {
      // Common field names in reporting systems
      const stageName = obj.stage || obj.stageName || obj.name || obj.status || obj.label || obj.key || obj.title || obj.dealStage;
      const countVal = obj.count !== undefined ? obj.count : (obj.value !== undefined ? obj.value : (obj.dealCount !== undefined ? obj.dealCount : (obj.total !== undefined ? obj.total : null)));

      if (typeof stageName === 'string' && countVal !== null && !isNaN(Number(countVal))) {
        const clean = stageName.trim();
        const upper = clean.toUpperCase();
        if (upper.includes('ENROLLED') || upper.includes('PAYMENT') || upper.includes('OPPORTUNITY') || upper.includes('RENEW') || upper.includes('RTE') || upper.includes('READY') || upper.includes('ACTIVE') || upper.includes('DOCUMENT') || upper.includes('QUOTE')) {
          detectedStages[clean] = Number(countVal);
        }
      }

      // Check nested objects
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'object' && obj[k] !== null && k !== 'echartsInstance') {
          extractStagesFromObject(obj[k], depth + 1);
        }
      }
    }
  }

  // 1. Intercept Fetch API
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await origFetch.apply(this, args);
    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      const clone = res.clone();
      clone.json().then(json => {
        extractStagesFromObject(json);
        sendData();
      }).catch(() => {});
    } catch (e) {}
    return res;
  };

  // 2. Intercept XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__tbr_url = url;
    return origOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      try {
        if (this.responseType === '' || this.responseType === 'text' || this.responseType === 'json') {
          const text = typeof this.response === 'string' ? this.response : JSON.stringify(this.response);
          if (text && (text.includes('Enrolled') || text.includes('Payment') || text.includes('Obamacare') || text.includes('Medicare') || text.includes('stage'))) {
            const json = JSON.parse(text);
            extractStagesFromObject(json);
            sendData();
          }
        }
      } catch (e) {}
    });
    return origSend.apply(this, args);
  };

  // 3. React Fiber & ECharts DOM scanner
  function scanPageInternals() {
    try {
      // A. Scan ECharts instances
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        const chart = window.echarts?.getInstanceByDom(canvas) || window.echarts?.getInstanceByDom(canvas.parentElement);
        if (chart) {
          const opt = chart.getOption();
          if (opt) extractStagesFromObject(opt);
        }
      });

      // B. Scan React Fiber properties on cards
      const elements = document.querySelectorAll('.ant-card, [class*="card"], [class*="report"]');
      elements.forEach(el => {
        for (const k of Object.keys(el)) {
          if (k.startsWith('__reactFiber$') || k.startsWith('__reactProps$')) {
            extractStagesFromObject(el[k]);
          }
        }
      });

      sendData();
    } catch (e) {}
  }

  // Trigger scanning at hydration times
  window.addEventListener('load', () => {
    setTimeout(scanPageInternals, 1000);
    setTimeout(scanPageInternals, 2500);
  });

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'TBR_TRIGGER_SCAN') {
      scanPageInternals();
    }
  });
})();
