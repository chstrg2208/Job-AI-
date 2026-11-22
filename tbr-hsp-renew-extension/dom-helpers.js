(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TBRDom = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Detect the current HealthSherpa application screen purely from visible text & active sidebar label.
   * @param {string} bodyText
   * @param {string} [activeSidebarText]
   * @returns {string}
   */
  function detectStepFromText(bodyText, activeSidebarText) {
    const t = (bodyText || '').replace(/\s+/g, ' ');
    const side = (activeSidebarText || '').replace(/\s+/g, ' ').trim();

    if (/Privacy,\s*consent,\s*and\s*the\s*use\s*of\s*your\s*information/i.test(t) ||
        (/Privacy statement/i.test(t) && /Store consent outside of HealthSherpa/i.test(t))) {
      return 'PRIVACY_STATEMENT';
    }

    // Check Finalize screens BEFORE Primary contact review
    if (/Take a few minutes to review the information you gave us/i.test(t) ||
        (/Coverage county:/i.test(t) && /Household income/i.test(t) && /Basic household questions/i.test(t))) {
      return 'FINALIZE_REVIEW';
    }

    if (/Renewal of eligibility/i.test(t) ||
        /Tax attestation/i.test(t) ||
        (/Sign and submit/i.test(t) && /sign electronically/i.test(t))) {
      return 'FINALIZE_MANUAL';
    }

    // Primary contact sub-screens
    if (/Review this summary to see if any changes are needed/i.test(t) && /Edit this section/i.test(t)) {
      return 'PRIMARY_REVIEW';
    }
    if (/Are you applying for coverage\?/i.test(t) && /Social Security Number/i.test(t)) {
      return 'PRIMARY_YOUR_INFO';
    }
    if (/Enter your permanent address/i.test(t) || /Is your mailing address the same as your permanent address\?/i.test(t)) {
      return 'PRIMARY_HOME_ADDRESS';
    }
    if (/How would you like to get notices about your application\?/i.test(t) ||
        (/Contact details/i.test(t) && /Written language/i.test(t))) {
      return 'PRIMARY_CONTACT_DETAILS';
    }

    // Household sub-screens
    if (/Who's applying for coverage\?/i.test(t) && /eligible for cost savings\?/i.test(t)) {
      return 'HOUSEHOLD_WHOS_APPLYING';
    }
    if (/Medicare eligibility/i.test(t) && /enrolled in Medicare Part A or C/i.test(t)) {
      return 'HOUSEHOLD_MEDICARE';
    }
    if (/^Applicant relationships$/i.test(side) ||
        (/Applicant relationships/i.test(t) && (/related to/i.test(t) || /Select a relationship/i.test(t)))) {
      return 'HOUSEHOLD_APPLICANT_RELATIONSHIPS';
    }
    if (/Applicant addresses/i.test(t) && /Does everyone applying for coverage live with you/i.test(t)) {
      return 'HOUSEHOLD_RESIDENCE';
    }
    if (/Your tax information/i.test(t) && (/Are you married\?/i.test(t) || /federal income tax return/i.test(t))) {
      return 'HOUSEHOLD_TAX';
    }

    // Additional information
    if (/Other family relationships/i.test(t) ||
        /live with any other people under 19/i.test(t) ||
        /live with another parent/i.test(t)) {
      return 'ADDITIONAL_OTHER_REL';
    }

    // Members / Applicants sub-screens
    if (/US citizen or US national\?/i.test(t) || /currently incarcerated/i.test(t)) {
      return 'MEMBERS_APPLICANT_1';
    }
    if (/naturalized or derived citizen\?/i.test(t) || /\bis\s+.+?\s+pregnant\?/i.test(t)) {
      return 'MEMBERS_APPLICANT_2';
    }

    // Income
    if (/Current income for/i.test(t) ||
        (/Deductions for/i.test(t) && /Yearly income for/i.test(t)) ||
        /Does\s+.+?\s+currently get any income\?/i.test(t)) {
      return 'INCOME';
    }

    // Additional questions sub-screens
    if (/Extra help/i.test(t) && (/disability or mental health condition/i.test(t) || /found not eligible for/i.test(t))) {
      return 'EXTRA_HELP';
    }
    if (/Existing coverage information/i.test(t) || /currently enrolled in health coverage\?/i.test(t)) {
      return 'COVERAGE';
    }
    if (/Employer Sponsored Coverage/i.test(t) || /offered health coverage through their own job\?/i.test(t)) {
      return 'EMPLOYER_COVERAGE';
    }
    if (/Upcoming changes/i.test(t) && /Recent changes/i.test(t)) {
      return 'ADDITIONAL_QUESTIONS_SEP';
    }

    if (/Sign and submit/i.test(side) || /Tax attestation/i.test(side) || /Agreements/i.test(side)) {
      return 'FINALIZE_MANUAL';
    }

    return 'UNKNOWN';
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitFor(fn, timeoutMs, intervalMs) {
    const timeout = timeoutMs || 4000;
    const interval = intervalMs || 150;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const res = await fn();
        if (res) return res;
      } catch (_) {}
      await sleep(interval);
    }
    return null;
  }

  function isVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function getAppPageText() {
    if (!document.body) return '';
    return Array.from(document.body.children)
      .filter(el => el.id !== 'tbr-hsp-panel' && !/^(SCRIPT|STYLE|NOSCRIPT|FOOTER)$/i.test(el.tagName))
      .map(el => el.innerText || '')
      .join('\n');
  }

  /**
   * Check whether a native input OR its visible label/wrapper is rendered on screen
   * (HealthSherpa often hides native checkbox/radio inputs with opacity:0 or 0px size).
   * @param {Element} el
   * @param {Element | Document} [root]
   * @returns {boolean}
   */
  function isInputOrLabelVisible(el, root) {
    if (!el || el.closest('#tbr-hsp-panel')) return false;
    if (isVisible(el)) return true;
    const scope = root || document;
    const lbl = el.closest('label') || (el.id && scope.querySelector(`label[for="${CSS.escape(el.id)}"]`));
    if (lbl && isVisible(lbl)) return true;
    if (el.parentElement && isVisible(el.parentElement)) return true;
    return false;
  }

  /**
   * Find all user-facing checkboxes within root (including visually hidden native inputs).
   * @param {Element | Document} [root]
   * @returns {HTMLInputElement[]}
   */
  function getVisibleCheckboxes(root) {
    const scope = root || document;
    return Array.from(scope.querySelectorAll('input[type="checkbox"]'))
      .filter(cb => isInputOrLabelVisible(cb, scope));
  }

  /**
   * Toggle a checkbox reliably for React / custom-styled checkboxes.
   * @param {HTMLInputElement} cb
   * @param {boolean} shouldCheck
   * @param {Element | Document} [root]
   * @returns {boolean}
   */
  function setCheckboxChecked(cb, shouldCheck, root) {
    if (!cb) return false;
    const target = Boolean(shouldCheck);
    if (Boolean(cb.checked) === target) return true;

    const scope = root || document;
    const lbl = cb.closest('label') || (cb.id && scope.querySelector(`label[for="${CSS.escape(cb.id)}"]`));
    const targets = [lbl, cb.parentElement, cb].filter(Boolean);

    for (const clickTarget of targets) {
      try {
        clickTarget.click();
      } catch (_) {}
      if (Boolean(cb.checked) === target) return true;
    }

    // Fallback for React-controlled inputs if click didn't flip native checked state
    const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked');
    if (desc && desc.set) {
      desc.set.call(cb, target);
      cb.dispatchEvent(new Event('input', { bubbles: true }));
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return Boolean(cb.checked) === target;
  }

  function isFieldLocked(el) {
    if (!el) return true;
    if (el.disabled || el.readOnly) return true;
    if (el.getAttribute('aria-disabled') === 'true' || el.getAttribute('aria-readonly') === 'true') return true;
    const parent = el.closest('[class*="disabled"], [class*="readOnly"], [class*="readonly"]');
    if (parent) return true;
    return false;
  }

  /**
   * Set value on a React-controlled <input> or <textarea>.
   * @param {HTMLInputElement | HTMLTextAreaElement} el
   * @param {string} value
   * @returns {{ ok: boolean, locked?: boolean }}
   */
  function setReactInputValue(el, value) {
    if (!el) return { ok: false, locked: false };
    if (isFieldLocked(el)) return { ok: false, locked: true };

    const targetVal = value == null ? '' : String(value);
    el.focus();
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) {
      desc.set.call(el, targetVal);
    } else {
      el.value = targetVal;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    return { ok: true, locked: false };
  }

  function normText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function stripSuffixColon(s) {
    return normText(s).replace(/[:*?()]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Find the tightest heading/card container for a section heading (e.g. "Home address" vs "Mailing Address").
   * @param {RegExp} headingRegex
   * @param {Element | Document} [root]
   * @returns {Element | null}
   */
  function findSectionContainer(headingRegex, root) {
    const scope = root || document;
    const headings = Array.from(scope.querySelectorAll('h1, h2, h3, h4, h5, legend, p, div, span'))
      .filter(el => {
        if (!isVisible(el)) return false;
        if (el.closest('#tbr-hsp-panel')) return false;
        // Prefer leaf/short headings
        if (el.children.length > 2) return false;
        const txt = normText(el.textContent);
        return txt.length > 0 && txt.length < 120 && headingRegex.test(txt);
      });

    if (headings.length === 0) return null;
    const headingEl = headings[headings.length - 1];
    let cur = headingEl.parentElement;
    while (cur && cur !== document.body) {
      const inputs = cur.querySelectorAll('input, select, [role="combobox"]');
      if (inputs.length >= 2) {
        // Make sure it does NOT also swallow a sibling heading like "Mailing Address" when searching "Home address"
        const childHeadingCount = Array.from(cur.querySelectorAll('h2, h3, h4')).filter(h => isVisible(h)).length;
        if (childHeadingCount <= 1 || cur.contains(headingEl)) {
          return cur;
        }
      }
      cur = cur.parentElement;
    }
    return headingEl.parentElement;
  }

  /**
   * Find an input/select/combobox control associated with a label regex within a scope.
   * @param {RegExp} labelRegex
   * @param {Element | Document} [root]
   * @returns {Element | null}
   */
  function findControlByLabel(labelRegex, root) {
    const scope = root || document;
    const candidates = Array.from(scope.querySelectorAll('label, span, div, p'))
      .filter(el => {
        if (!isVisible(el)) return false;
        if (el.closest('#tbr-hsp-panel')) return false;
        if (el.children.length > 2) return false;
        const txt = stripSuffixColon(el.textContent);
        return txt.length > 0 && txt.length < 120 && labelRegex.test(txt);
      });

    for (const lbl of candidates) {
      if (lbl.tagName === 'LABEL') {
        const forId = lbl.getAttribute('for');
        if (forId) {
          const target = scope.querySelector(`#${CSS.escape(forId)}`) || document.getElementById(forId);
          if (target && !target.closest('#tbr-hsp-panel')) return target;
        }
        const inside = lbl.querySelector('input, select, textarea, [role="combobox"]');
        if (inside) return inside;
      }

      // Walk up 1..3 levels to find paired control
      let p = lbl.parentElement;
      for (let depth = 0; depth < 3 && p; depth++) {
        if (p.closest('#tbr-hsp-panel')) break;
        const controls = Array.from(p.querySelectorAll('input:not([type="hidden"]), select, textarea, [role="combobox"]'))
          .filter(c => !c.closest('#tbr-hsp-panel') && isVisible(c));
        if (controls.length === 1) return controls[0];
        if (controls.length > 1 && depth === 0) return controls[0];
        p = p.parentElement;
      }
    }
    return null;
  }

  /**
   * Find the dropdown wrapper (native <select> or React-Select container) for a label.
   * @param {RegExp} labelRegex
   * @param {Element | Document} [root]
   * @returns {Element | null}
   */
  function findDropdownByLabel(labelRegex, root) {
    const ctrl = findControlByLabel(labelRegex, root);
    if (!ctrl) return null;
    if (ctrl.tagName === 'SELECT') return ctrl;
    return ctrl.closest('[class*="container"], [class*="Select"], [class*="select"]') || ctrl.parentElement || ctrl;
  }

  /**
   * Select an option in either a native <select> or React-Select component.
   * @param {Element} containerOrSelect
   * @param {string} targetText
   * @returns {Promise<{ ok: boolean, actualText: string }>}
   */
  async function selectDropdownOption(containerOrSelect, targetText) {
    if (!containerOrSelect || !targetText) return { ok: false, actualText: '' };
    const needle = normText(targetText).toLowerCase();

    if (containerOrSelect.tagName === 'SELECT') {
      const sel = containerOrSelect;
      if (isFieldLocked(sel)) return { ok: false, actualText: sel.value };
      const opts = Array.from(sel.options);
      const best = opts.find(o => normText(o.textContent).toLowerCase() === needle) ||
                   opts.find(o => normText(o.textContent).toLowerCase().startsWith(needle)) ||
                   opts.find(o => normText(o.textContent).toLowerCase().includes(needle));
      if (!best) return { ok: false, actualText: sel.value };
      const desc = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value');
      if (desc && desc.set) desc.set.call(sel, best.value);
      else sel.value = best.value;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return { ok: true, actualText: normText(best.textContent) };
    }

    // Check if already matches without disturbing
    const curSingle = containerOrSelect.querySelector('[class*="singleValue"], [class*="single-value"]');
    if (curSingle && normText(curSingle.textContent).toLowerCase() === needle) {
      return { ok: true, actualText: normText(curSingle.textContent) };
    }

    // Clear existing value if a clear button exists
    const clearBtn = containerOrSelect.querySelector('[class*="clearIndicator"], [aria-label*="clear" i]');
    if (clearBtn) {
      clearBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      clearBtn.click();
      await sleep(120);
    }

    // Open menu via control/input
    const control = containerOrSelect.querySelector('[class*="control"]') || containerOrSelect;
    const input = containerOrSelect.querySelector('input[role="combobox"], input[type="text"], input:not([type="hidden"])');

    control.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    control.click();
    if (input) {
      input.focus();
      setReactInputValue(input, targetText);
    }

    // Wait for menu options to render
    const bestOpt = await waitFor(() => {
      const opts = Array.from(document.querySelectorAll('[role="option"], [id*="react-select"][id*="-option-"], [class*="option"]'))
        .filter(o => isVisible(o) && !o.closest('#tbr-hsp-panel'));
      if (opts.length === 0) return null;
      return opts.find(o => normText(o.textContent).toLowerCase() === needle) ||
             opts.find(o => normText(o.textContent).toLowerCase().startsWith(needle)) ||
             opts.find(o => normText(o.textContent).toLowerCase().includes(needle)) ||
             null;
    }, 2200, 120);

    if (!bestOpt) {
      return { ok: false, actualText: normText(containerOrSelect.textContent) };
    }

    bestOpt.scrollIntoView({ block: 'nearest' });
    bestOpt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    bestOpt.click();
    await sleep(250);

    const updatedText = normText((containerOrSelect.querySelector('[class*="singleValue"], [class*="single-value"]') || containerOrSelect).textContent);
    const verified = updatedText.toLowerCase().includes(needle);
    return { ok: verified, actualText: updatedText };
  }

  /**
   * Select a radio choice under a matching question heading/prompt.
   * @param {RegExp} questionRegex
   * @param {RegExp} choiceRegex
   * @param {Element | Document} [root]
   * @returns {boolean}
   */
  function selectRadioByQuestion(questionRegex, choiceRegex, root) {
    const scope = root || document;
    const textEls = Array.from(scope.querySelectorAll('p, div, span, legend, label, h2, h3, h4'))
      .filter(el => isVisible(el) && !el.closest('#tbr-hsp-panel') && questionRegex.test(normText(el.textContent)));

    // Pick tightest element (smallest textContent length)
    textEls.sort((a, b) => a.textContent.length - b.textContent.length);

    for (const qEl of textEls) {
      let box = qEl.parentElement;
      for (let i = 0; i < 4 && box; i++) {
        if (box.closest('#tbr-hsp-panel')) break;
        const radios = Array.from(box.querySelectorAll('input[type="radio"]')).filter(r => !r.closest('#tbr-hsp-panel'));
        if (radios.length >= 2) {
          for (const radio of radios) {
            const lbl = radio.closest('label') ||
                        (radio.id && box.querySelector(`label[for="${CSS.escape(radio.id)}"]`)) ||
                        radio.parentElement;
            const txt = normText(lbl ? lbl.textContent : '');
            if (choiceRegex.test(txt)) {
              if (!radio.checked) {
                if (lbl) lbl.click();
                if (!radio.checked && radio.parentElement) radio.parentElement.click();
                if (!radio.checked) radio.click();
              }
              return true;
            }
          }
          break;
        }
        box = box.parentElement;
      }
    }
    return false;
  }

  /**
   * Set checkbox state for the checkbox matching a label regex.
   * @param {RegExp} textRegex
   * @param {boolean} shouldCheck
   * @param {Element | Document} [root]
   * @returns {boolean}
   */
  function setCheckboxByText(textRegex, shouldCheck, root) {
    const scope = root || document;
    const boxes = getVisibleCheckboxes(scope);
    for (const cb of boxes) {
      const container = cb.closest('label') ||
                        (cb.id && scope.querySelector(`label[for="${CSS.escape(cb.id)}"]`)) ||
                        cb.parentElement?.parentElement ||
                        cb.parentElement;
      const txt = normText(container ? container.textContent : '');
      if (textRegex.test(txt)) {
        return setCheckboxChecked(cb, shouldCheck, scope);
      }
    }

    // Fallback for custom ARIA role="checkbox" buttons
    const roleBoxes = Array.from(scope.querySelectorAll('[role="checkbox"]'))
      .filter(el => !el.closest('#tbr-hsp-panel') && isVisible(el));
    for (const rb of roleBoxes) {
      const txt = normText((rb.closest('label') || rb.parentElement || rb).textContent);
      if (textRegex.test(txt)) {
        const cur = rb.getAttribute('aria-checked') === 'true';
        if (cur !== Boolean(shouldCheck)) rb.click();
        return rb.getAttribute('aria-checked') === String(Boolean(shouldCheck));
      }
    }
    return false;
  }

  /**
   * Click a visible enabled button matching regex.
   * @param {RegExp} textRegex
   * @param {Element | Document} [root]
   * @returns {boolean}
   */
  function clickButtonByText(textRegex, root) {
    const scope = root || document;
    const btns = Array.from(scope.querySelectorAll('button, [role="button"], a[href]'))
      .filter(el => {
        if (el.closest('#tbr-hsp-panel')) return false;
        if (!isVisible(el)) return false;
        if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
        return textRegex.test(normText(el.textContent));
      });
    if (btns.length === 0) return false;
    const btn = btns[0];
    btn.scrollIntoView({ block: 'center' });
    btn.click();
    return true;
  }

  /**
   * Extract the active step name shown in the HealthSherpa left sidebar.
   * @returns {string}
   */
  function getActiveSidebarText() {
    const navLinks = Array.from(document.querySelectorAll('aside a, nav a, aside li, nav li, [class*="sidebar"] *'))
      .filter(el => !el.closest('#tbr-hsp-panel') && isVisible(el));
    for (const el of navLinks) {
      if (el.getAttribute('aria-current') === 'step' || el.getAttribute('aria-current') === 'page' ||
          /active|current/i.test(el.className || '')) {
        const txt = normText(el.textContent);
        if (txt && txt.length < 60) return txt;
      }
    }
    return '';
  }

  return {
    detectStepFromText,
    sleep,
    waitFor,
    isVisible,
    getAppPageText,
    isInputOrLabelVisible,
    getVisibleCheckboxes,
    setCheckboxChecked,
    isFieldLocked,
    setReactInputValue,
    normText,
    findSectionContainer,
    findControlByLabel,
    findDropdownByLabel,
    selectDropdownOption,
    selectRadioByQuestion,
    setCheckboxByText,
    clickButtonByText,
    getActiveSidebarText
  };
});
