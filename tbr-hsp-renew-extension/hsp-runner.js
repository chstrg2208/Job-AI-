(function () {
  'use strict';

  if (window.__tbrHspHelperInitialized) return;
  window.__tbrHspHelperInitialized = true;

  const P = window.TBRParser;
  const D = window.TBRDom;
  if (!P || !D) return;

  const STORAGE_KEY = 'tbrHspClientData';
  const PREFS_KEY = 'tbrHspPrefs';

  const STEP_LABELS = {
    PRIVACY_STATEMENT: '1. Privacy statement',
    PRIMARY_REVIEW: '2. Primary contact (Summary)',
    PRIMARY_YOUR_INFO: '2a. Your information',
    PRIMARY_HOME_ADDRESS: '2b. Home & Mailing address',
    PRIMARY_CONTACT_DETAILS: '2c. Contact details (Email/Phone)',
    HOUSEHOLD_WHOS_APPLYING: '3a. Who\'s applying?',
    HOUSEHOLD_MEDICARE: '3b. Medicare eligibility',
    HOUSEHOLD_APPLICANT_RELATIONSHIPS: '3c. Applicant relationships',
    HOUSEHOLD_RESIDENCE: '3d. Residence',
    HOUSEHOLD_TAX: '3e. Tax household',
    ADDITIONAL_OTHER_REL: '4. Other family relationships',
    MEMBERS_APPLICANT_1: '5a. Members (Citizenship/Tobacco)',
    MEMBERS_APPLICANT_2: '5b. Members (Naturalized/Pregnant)',
    INCOME: '6. Income',
    EXTRA_HELP: '7a. Extra help / Denied Medicaid',
    COVERAGE: '7b. Existing coverage',
    EMPLOYER_COVERAGE: '7c. Employer coverage',
    ADDITIONAL_QUESTIONS_SEP: '7d. Additional questions (SEP)',
    FINALIZE_REVIEW: '8. Finalize -> Review (DỪNG)',
    FINALIZE_MANUAL: '9. Agreements / Sign (Tự làm)',
    UNKNOWN: 'Ngoài luồng Edit / Chưa nhận diện'
  };

  const state = {
    rawNote: '',
    overrides: {},
    parsed: null,
    prefs: {
      pauseOnTax: true,
      pauseOnMedicaid: true,
      collapsed: false
    },
    isRunning: false,
    passMode: 1, // 1 = normal pass to Review, 2 = post-submit Email/Phone/County pass
    resumeResolver: null,
    lockedEmailPass1: false,
    lockedPhonePass1: false,
    primaryApplying: true,
    autoDetectedChildren: []
  };

  function log(msg) {
    const logEl = document.getElementById('tbr-log');
    if (!logEl) return;
    const now = new Date().toTimeString().slice(0, 8);
    const item = document.createElement('div');
    item.className = 'tbr-log-item';
    item.textContent = `[${now}] ${msg}`;
    logEl.insertBefore(item, logEl.firstChild);
    while (logEl.children.length > 25) {
      logEl.removeChild(logEl.lastChild);
    }
  }

  function currentStep() {
    const bodyText = document.body ? document.body.innerText : '';
    const sideText = D.getActiveSidebarText();
    return D.detectStepFromText(bodyText, sideText);
  }

  function updateStepBadge() {
    const badge = document.getElementById('tbr-step-badge');
    if (!badge) return;
    const step = currentStep();
    badge.textContent = STEP_LABELS[step] || step;
  }

  function recomputeParsed() {
    state.parsed = P.parseCrmNote(state.rawNote, {
      ...state.overrides,
      lockedEmailPass1: state.lockedEmailPass1,
      lockedPhonePass1: state.lockedPhonePass1
    });
    return state.parsed;
  }

  function syncInputsFromState() {
    const d = recomputeParsed();
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = v || '';
    };
    setVal('tbr-note-input', state.rawNote);
    setVal('tbr-f-email', d.email);
    setVal('tbr-f-phone', d.phone);
    setVal('tbr-f-enrolled', d.enrolledAddress ? P.formatAddress(d.enrolledAddress) : (state.overrides.enrolledAddressRaw || ''));
    setVal('tbr-f-county', d.county);
    setVal('tbr-f-mailing', d.sameMailingAsEnrolled ? '' : (d.mailingAddress ? P.formatAddress(d.mailingAddress) : (state.overrides.mailingAddressRaw || '')));
    setVal('tbr-f-income', d.income !== null && d.income !== undefined ? String(d.income) : '');
    setVal('tbr-f-apply', d.applyCount ? String(d.applyCount) : '');
    setVal('tbr-f-medicaid', (d.denyMedicaidMembers || []).join(', '));
    setVal('tbr-f-medicaid-date', d.denyMedicaidDate || '11/01/2026');

    const emailEl = document.getElementById('tbr-f-email');
    if (emailEl) {
      emailEl.classList.remove('tbr-input-error', 'tbr-input-warn');
      if (!d.email) emailEl.classList.add('tbr-input-warn');
      else if (d.emailForbidden) emailEl.classList.add('tbr-input-error');
    }
  }

  function readOverridesFromInputs() {
    const getVal = id => (document.getElementById(id)?.value || '').trim();
    state.rawNote = document.getElementById('tbr-note-input')?.value || '';
    state.overrides = {
      email: getVal('tbr-f-email'),
      phone: getVal('tbr-f-phone'),
      enrolledAddressRaw: getVal('tbr-f-enrolled'),
      county: getVal('tbr-f-county'),
      mailingAddressRaw: getVal('tbr-f-mailing'),
      income: getVal('tbr-f-income'),
      applyCount: getVal('tbr-f-apply'),
      denyMedicaidMembers: getVal('tbr-f-medicaid'),
      denyMedicaidDate: getVal('tbr-f-medicaid-date') || '11/01/2026'
    };
    recomputeParsed();
    saveToStorage();
  }

  function saveToStorage() {
    if (!chrome?.storage?.local) return;
    chrome.storage.local.set({
      [STORAGE_KEY]: {
        rawNote: state.rawNote,
        overrides: state.overrides,
        updatedAt: Date.now()
      },
      [PREFS_KEY]: state.prefs
    });
  }

  function loadFromStorage() {
    if (!chrome?.storage?.local) return;
    chrome.storage.local.get([STORAGE_KEY, PREFS_KEY], res => {
      if (res[PREFS_KEY]) {
        state.prefs = { ...state.prefs, ...res[PREFS_KEY] };
        const taxCb = document.getElementById('tbr-opt-tax');
        const medCb = document.getElementById('tbr-opt-medicaid');
        if (taxCb) taxCb.checked = Boolean(state.prefs.pauseOnTax);
        if (medCb) medCb.checked = Boolean(state.prefs.pauseOnMedicaid);
        const panel = document.getElementById('tbr-hsp-panel');
        if (panel && state.prefs.collapsed) panel.classList.add('tbr-collapsed');
      }
      if (res[STORAGE_KEY]) {
        state.rawNote = res[STORAGE_KEY].rawNote || '';
        state.overrides = res[STORAGE_KEY].overrides || {};
        syncInputsFromState();
      }
    });
  }

  function clearPrompt() {
    const box = document.getElementById('tbr-prompt-box');
    if (box) {
      box.classList.remove('tbr-show');
      box.innerHTML = '';
    }
  }

  /**
   * Pause automation and present an interactive Vietnamese prompt with quick-decision buttons.
   * @param {string} title
   * @param {string} detail
   * @param {Array<{ label: string, className?: string, value: any }>} buttons
   */
  function askUser(title, detail, buttons) {
    return new Promise(resolve => {
      const box = document.getElementById('tbr-prompt-box');
      if (!box) return resolve('stop');
      box.innerHTML = '';
      box.classList.add('tbr-show');

      const t = document.createElement('div');
      t.className = 'tbr-prompt-title';
      t.textContent = title;
      box.appendChild(t);

      const d = document.createElement('div');
      d.className = 'tbr-prompt-detail';
      d.textContent = detail;
      box.appendChild(d);

      const actions = document.createElement('div');
      actions.className = 'tbr-prompt-actions';
      for (const btnSpec of buttons) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `tbr-btn ${btnSpec.className || 'tbr-btn-primary'}`;
        b.style.gridColumn = 'auto';
        b.style.flex = '1 1 auto';
        b.textContent = btnSpec.label;
        b.addEventListener('click', () => {
          clearPrompt();
          if (state.resumeResolver === resolve) state.resumeResolver = null;
          resolve(btnSpec.value);
        });
        actions.appendChild(b);
      }
      box.appendChild(actions);
      state.resumeResolver = resolve;
    });
  }

  function renderAuditResults(results) {
    const box = document.getElementById('tbr-audit-box');
    if (!box) return;
    box.innerHTML = '';
    box.classList.add('tbr-show');

    const title = document.createElement('div');
    title.className = 'tbr-section-title';
    title.innerHTML = '<span>🏁 ĐÃ ĐẾN TRANG REVIEW — BẠN TỰ LÀM 3 BƯỚC CUỐI</span>';
    box.appendChild(title);

    let hasCountyError = false;
    for (const r of results) {
      const row = document.createElement('div');
      row.className = `tbr-audit-row tbr-audit-${r.status}`;
      const icon = r.status === 'ok' ? '✅' : (r.status === 'warn' ? '⚠️' : '🚨');
      row.textContent = `${icon} ${r.field}: ${r.message}`;
      box.appendChild(row);
      if (r.actionHint === 'edit_county') hasCountyError = true;
    }

    if (hasCountyError) {
      const fixBtn = document.createElement('button');
      fixBtn.type = 'button';
      fixBtn.className = 'tbr-btn tbr-btn-danger';
      fixBtn.textContent = '🔧 Bấm Edit Primary contact sửa lại County ngay';
      fixBtn.addEventListener('click', () => {
        const primarySec = D.findSectionContainer(/^Primary contact$/i);
        if (primarySec && D.clickButtonByText(/^Edit$/i, primarySec)) {
          log('Đã bấm Edit Primary contact để sửa lại County.');
        } else {
          D.clickButtonByText(/^Edit$/i);
        }
      });
      box.appendChild(fixBtn);
    }

    const hint = document.createElement('div');
    hint.style.fontSize = '11.5px';
    hint.style.color = '#334155';
    hint.textContent = '📌 Nếu có Email/Phone bị khóa ở Lượt 1: bạn tự bấm Submit xong quay lại Edit rồi bấm nút "Lượt 2: Sửa Email / Phone / County".';
    box.appendChild(hint);
  }

  function clearAuditBox() {
    const box = document.getElementById('tbr-audit-box');
    if (box) {
      box.classList.remove('tbr-show');
      box.innerHTML = '';
    }
  }

  function setRunningUI(running) {
    state.isRunning = running;
    const runBtn = document.getElementById('tbr-btn-run');
    const stepBtn = document.getElementById('tbr-btn-step');
    const pass2Btn = document.getElementById('tbr-btn-pass2');
    const stopBtn = document.getElementById('tbr-btn-stop');
    if (runBtn) runBtn.disabled = running;
    if (stepBtn) stepBtn.disabled = running;
    if (pass2Btn) pass2Btn.disabled = running;
    if (stopBtn) stopBtn.disabled = !running;
  }

  function stopRunner(reason) {
    state.isRunning = false;
    if (state.resumeResolver) {
      const r = state.resumeResolver;
      state.resumeResolver = null;
      r('stop');
    }
    clearPrompt();
    setRunningUI(false);
    if (reason) log(reason);
  }

  async function clickContinueAndWait(prevStep) {
    const clicked = D.clickButtonByText(/^Continue$/i);
    if (!clicked) {
      log('⚠️ Chưa bấm được nút Continue (nút đang khóa hoặc chưa tìm thấy).');
      return false;
    }
    log(`Đã bấm Continue (từ ${STEP_LABELS[prevStep] || prevStep})...`);
    await D.waitFor(() => {
      const next = currentStep();
      return next !== prevStep && next !== 'UNKNOWN';
    }, 6000, 150);
    await D.sleep(350);
    updateStepBadge();
    return true;
  }

  // ==================== STEP HANDLERS ====================

  async function handlePrivacyStatement(autoContinue) {
    const boxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      .filter(cb => !cb.closest('#tbr-hsp-panel') && D.isVisible(cb));
    for (const cb of boxes) {
      if (!cb.checked) cb.click();
    }
    D.selectRadioByQuestion(/Consent/i, /Store consent outside of HealthSherpa/i);
    log('✅ Privacy: đã tích 2 cam kết & chọn Store consent outside of HealthSherpa.');
    if (autoContinue) await clickContinueAndWait('PRIVACY_STATEMENT');
  }

  function extractPrimaryReviewSummary() {
    const text = document.body ? document.body.innerText : '';
    const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const out = { permanentRaw: '', county: '', mailingRaw: '', email: '', phone: '' };

    for (let i = 0; i < lines.length; i++) {
      if (/^Permanent address$/i.test(lines[i])) {
        const vals = lines.slice(i + 5, i + 10);
        if (vals.length >= 5) {
          out.permanentRaw = `${vals[0]}, ${vals[1]}, ${vals[2]} ${vals[3]}`;
          out.county = vals[4];
        }
      }
      if (/^Mailing address$/i.test(lines[i])) {
        const vals = lines.slice(i + 4, i + 8);
        if (vals.length >= 4) {
          out.mailingRaw = `${vals[0]}, ${vals[1]}, ${vals[2]} ${vals[3]}`;
        }
      }
      if (/^Email$/i.test(lines[i]) && lines[i + 4] && /@/.test(lines[i + 4])) {
        out.email = lines[i + 4];
      }
    }
    const emMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    if (!out.email && emMatch) out.email = emMatch[0];
    const phMatch = text.match(/\(\d{3}\)\s*\d{3}-\d{4}/);
    if (phMatch) out.phone = phMatch[0];
    return out;
  }

  async function handlePrimaryReview(d, autoContinue) {
    const rev = extractPrimaryReviewSummary();
    let needsEdit = false;

    if (d.enrolledAddress && rev.permanentRaw) {
      if (!P.addressesMatch(P.parseUSAddress(rev.permanentRaw), d.enrolledAddress)) needsEdit = true;
    } else if (d.enrolledAddress || d.county) {
      needsEdit = true;
    }

    if (d.county && rev.county) {
      if (P.normalizeCounty(rev.county).toLowerCase() !== P.normalizeCounty(d.county).toLowerCase()) needsEdit = true;
    }

    if (!d.sameMailingAsEnrolled && d.mailingAddress && rev.mailingRaw) {
      if (!P.addressesMatch(P.parseUSAddress(rev.mailingRaw), d.mailingAddress)) needsEdit = true;
    }

    if (state.passMode === 2 && d.email && rev.email.toLowerCase() !== d.email.toLowerCase()) {
      needsEdit = true;
    }

    if (needsEdit) {
      log('Phát hiện thông tin cần sửa -> Bấm Edit this section.');
      D.clickButtonByText(/Edit this section/i);
      await D.sleep(600);
      return;
    }

    log('✅ Primary contact summary đã khớp.');
    if (autoContinue) await clickContinueAndWait('PRIMARY_REVIEW');
  }

  async function handlePrimaryYourInfo(d, autoContinue) {
    const fnEl = D.findControlByLabel(/^First name$/i);
    const lnEl = D.findControlByLabel(/^Last name$/i);
    const primaryName = [fnEl?.value, lnEl?.value].filter(Boolean).join(' ').trim();
    const shouldApply = P.shouldPersonApply(primaryName, d);
    const chooseNo = shouldApply === false && (d.members || []).length > 0;

    state.primaryApplying = !chooseNo;
    D.selectRadioByQuestion(/Are you applying for coverage\?/i, chooseNo ? /^No$/i : /^Yes$/i);
    log(`✅ Your information (${primaryName || 'Primary'}): Applying = ${chooseNo ? 'No' : 'Yes'}.`);
    if (autoContinue) await clickContinueAndWait('PRIMARY_YOUR_INFO');
  }

  async function fillAddressSection(sectionEl, addrObj, countyName, isMailing) {
    if (!sectionEl || !addrObj) return { countyOk: true };
    const streetRegex = isMailing ? /^Mailing address$/i : /^Street address$/i;
    const streetEl = D.findControlByLabel(streetRegex, sectionEl);
    if (streetEl) D.setReactInputValue(streetEl, addrObj.street);

    const aptEl = D.findControlByLabel(/^Apt\.?\s*\/?\s*Ste/i, sectionEl);
    if (aptEl && addrObj.apt) D.setReactInputValue(aptEl, addrObj.apt);

    const cityEl = D.findControlByLabel(/^City$/i, sectionEl);
    if (cityEl && addrObj.city) D.setReactInputValue(cityEl, addrObj.city);

    if (addrObj.stateName || addrObj.stateCode) {
      const stateDrop = D.findDropdownByLabel(/^State$/i, sectionEl);
      if (stateDrop) await D.selectDropdownOption(stateDrop, addrObj.stateName || addrObj.stateCode);
    }

    const zipEl = D.findControlByLabel(/^Zip code$/i, sectionEl);
    if (zipEl && addrObj.zip) D.setReactInputValue(zipEl, addrObj.zip);

    await D.sleep(350);

    if (countyName) {
      const countyDrop = D.findDropdownByLabel(/^County$/i, sectionEl);
      if (countyDrop) {
        let res = await D.selectDropdownOption(countyDrop, countyName);
        if (!res.ok) {
          await D.sleep(350);
          res = await D.selectDropdownOption(countyDrop, countyName);
        }
        return { countyOk: res.ok, actualCounty: res.actualText };
      }
    }
    return { countyOk: true };
  }

  async function handlePrimaryHomeAddress(d, autoContinue) {
    let homeCountyResult = { countyOk: true };
    if (d.enrolledAddress) {
      const homeScope = D.findSectionContainer(/^Home address$/i) || document;
      homeCountyResult = await fillAddressSection(homeScope, d.enrolledAddress, d.county, false);
      log(`✅ Home address: ${P.formatAddress(d.enrolledAddress)} (County: ${d.county || 'giữ nguyên'})`);
    } else if (d.county) {
      const homeScope = D.findSectionContainer(/^Home address$/i) || document;
      const countyDrop = D.findDropdownByLabel(/^County$/i, homeScope);
      if (countyDrop) homeCountyResult = { countyOk: (await D.selectDropdownOption(countyDrop, d.county)).ok };
    }

    if (d.sameMailingAsEnrolled) {
      D.selectRadioByQuestion(/mailing address the same as your permanent address/i, /^Yes$/i);
      log('✅ Mailing address: chọn Yes (giống Home address).');
    } else if (d.mailingAddress) {
      D.selectRadioByQuestion(/mailing address the same as your permanent address/i, /^No$/i);
      await D.sleep(300);
      const mailScope = D.findSectionContainer(/^Mailing Address$/i);
      if (mailScope) {
        await fillAddressSection(mailScope, d.mailingAddress, '', true);
        log(`✅ Mailing address: ${P.formatAddress(d.mailingAddress)}`);
      }
    }

    if (!homeCountyResult.countyOk && d.county) {
      const choice = await askUser(
        `⚠️ Chưa chọn được County "${d.county}"`,
        `HealthSherpa có thể chưa load kịp danh sách County cho ZIP mới hoặc cần bạn bấm chọn tay "${d.county}" ở mục Home address.\nHãy chọn "${d.county}" rồi bấm nút bên dưới:`,
        [
          { label: '✅ Đã chọn County xong, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng tại đây', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng để chỉnh County.');
    }

    if (autoContinue) await clickContinueAndWait('PRIMARY_HOME_ADDRESS');
  }

  async function handlePrimaryContactDetails(d, autoContinue) {
    const emailEl = D.findControlByLabel(/^Email address/i);
    if (emailEl && d.email) {
      const res = D.setReactInputValue(emailEl, d.email);
      if (res.locked) {
        if ((emailEl.value || '').trim().toLowerCase() !== d.email.toLowerCase()) {
          state.lockedEmailPass1 = true;
          log(`⚠️ Email đang bị khóa ở Lượt 1 (${emailEl.value}) — sẽ nhắc đổi sang ${d.email} ở Lượt 2.`);
        }
      } else {
        state.lockedEmailPass1 = false;
        log(`✅ Đã cập nhật Email thật: ${d.email}`);
      }
    } else if (emailEl && P.isForbiddenEmail(emailEl.value).forbidden) {
      const choice = await askUser(
        '🚨 Phát hiện Email công ty / domain bị cấm!',
        `Email hiện tại trên hồ sơ là "${emailEl.value}". Vui lòng nhập email thật của khách vào ô "Email thật" bên trên rồi bấm Tiếp tục:`,
        [
          { label: '✅ Đã nhập email thật, thử điền & đi tiếp', className: 'tbr-btn-success', value: 'retry' },
          { label: '⏭ Bỏ qua tạm (sửa ở Lượt 2)', className: 'tbr-btn-secondary', value: 'continue' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng kiểm tra Email.');
      if (choice === 'retry') {
        readOverridesFromInputs();
        return handlePrimaryContactDetails(state.parsed, autoContinue);
      }
    }

    const phoneEl = D.findControlByLabel(/^Phone number$/i);
    if (phoneEl && d.phoneDigits) {
      const res = D.setReactInputValue(phoneEl, d.phoneDigits);
      if (res.locked) {
        const curDigits = (phoneEl.value || '').replace(/\D/g, '');
        if (curDigits && curDigits !== d.phoneDigits) {
          state.lockedPhonePass1 = true;
          log(`⚠️ Phone đang bị khóa ở Lượt 1 (${phoneEl.value}).`);
        }
      } else {
        state.lockedPhonePass1 = false;
        log(`✅ Đã cập nhật Phone: ${d.phone}`);
      }
    }

    D.selectRadioByQuestion(/How would you like to get notices/i, /Send me paper notices/i);

    if (autoContinue) {
      await clickContinueAndWait('PRIMARY_CONTACT_DETAILS');
      if (state.passMode === 2) {
        await D.sleep(400);
        const choice = await askUser(
          '✅ Lượt 2 đã điền xong Contact details!',
          'Bạn kiểm tra lại xem màn hình tiếp theo có nhảy sang Review hoặc cần bấm mục "Review" ở cột trái hay không nhé:',
          [
            { label: '⏭ Chạy tự động qua hết tới Review', className: 'tbr-btn-primary', value: 'continue' },
            { label: '⏹ Dừng tại đây để tự bấm Review/Submit', className: 'tbr-btn-secondary', value: 'stop' }
          ]
        );
        if (choice === 'stop') return stopRunner('Đã xong Lượt 2 phần Contact details.');
      }
    }
  }

  function detectApplyingMembersOnPage() {
    const cards = Array.from(document.querySelectorAll('div, li, section'))
      .filter(el => !el.closest('#tbr-hsp-panel') && D.isVisible(el) && /\bborn\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(el.textContent));

    const found = [];
    const seen = new Set();
    // Sort tightest elements first
    cards.sort((a, b) => a.textContent.length - b.textContent.length);
    for (const c of cards) {
      const txt = D.normText(c.textContent);
      if (txt.length > 220) continue;
      const m = txt.match(/^(.+?)\s+(?:Child|Spouse|Parent|Dependent|Relative|Other).*?\bborn\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
      if (m) {
        const name = m[1].trim();
        const dob = m[2];
        const key = `${name}|${dob}`;
        if (!seen.has(key)) {
          seen.add(key);
          const age = P.calculateAge(dob, 2026);
          const editBtn = Array.from(c.querySelectorAll('button, a')).find(b => /^Edit$/i.test(D.normText(b.textContent))) || null;
          found.push({ name, dob, age, isApplying: /Applying/i.test(txt) && !/Not Applying/i.test(txt), editBtn });
        }
      }
    }
    return found;
  }

  async function syncOpenPersonEditCard(d) {
    const saveBtn = Array.from(document.querySelectorAll('button'))
      .find(b => !b.closest('#tbr-hsp-panel') && D.isVisible(b) && /^Save person$/i.test(D.normText(b.textContent)));
    if (!saveBtn) return false;

    const fn = D.findControlByLabel(/^First name$/i)?.value || '';
    const ln = D.findControlByLabel(/^Last name$/i)?.value || '';
    const personName = `${fn} ${ln}`.trim();
    const wantApply = P.shouldPersonApply(personName, d);
    if (wantApply !== null) {
      D.selectRadioByQuestion(/Is this person applying for coverage\?/i, wantApply ? /^Yes$/i : /^No$/i);
      await D.sleep(150);
    }
    saveBtn.click();
    await D.sleep(400);
    log(`✅ Đã cập nhật ${personName || 'thành viên'} (Applying = ${wantApply === false ? 'No' : 'Yes'}) và bấm Save person.`);
    return true;
  }

  async function handleHouseholdWhosApplying(d, autoContinue) {
    D.selectRadioByQuestion(/eligible for cost savings\?/i, /^Yes$/i);

    // If an inline Edit person form is currently open (e.g. Edit SHAYLA NGUYEN), handle/save it first
    await syncOpenPersonEditCard(d);

    let cards = detectApplyingMembersOnPage();
    // Auto-sync Applying Yes/No via Edit -> Save person if CRM member list explicitly specifies who applies
    if (d.members && d.members.length > 0 && d.applyCount && d.members.length === d.applyCount) {
      for (const card of cards) {
        const wantApply = P.shouldPersonApply(card.name, d);
        if (wantApply !== null && wantApply !== card.isApplying && card.editBtn) {
          card.editBtn.click();
          await D.waitFor(() => Array.from(document.querySelectorAll('button')).some(b => /^Save person$/i.test(D.normText(b.textContent))), 2000, 100);
          await syncOpenPersonEditCard(d);
          await D.sleep(300);
        }
      }
      cards = detectApplyingMembersOnPage();
    }

    const under19 = cards.filter(c => c.age !== null && c.age < 19).map(c => c.name);
    state.autoDetectedChildren = under19;

    if (under19.length > 0 && (!d.denyMedicaidMembers || d.denyMedicaidMembers.length === 0)) {
      state.overrides.denyMedicaidMembers = under19.join(', ');
      syncInputsFromState();
      saveToStorage();
      log(`🔎 Tự phát hiện bé <19 tuổi cần chú ý Denied Medicaid: ${under19.join(', ')}`);
    }

    const totalApplyingOnPage = (state.primaryApplying ? 1 : 0) + cards.filter(c => c.isApplying).length;
    if (d.applyCount && totalApplyingOnPage !== d.applyCount) {
      const choice = await askUser(
        '⚠️ Số người Apply trên HealthSherpa khác Note CRM!',
        `Trên HealthSherpa đang có ${totalApplyingOnPage} người apply (Primary=${state.primaryApplying ? 'Yes' : 'No'}, phụ thuộc Applying=${cards.filter(c => c.isApplying).length}), trong khi CRM ghi Apply = ${d.applyCount} người (${(d.members || []).join(' + ')}).\nVui lòng kiểm tra / Edit hoặc Add member rồi chọn:`,
        [
          { label: '✅ Đúng rồi, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng để tôi chỉnh lại', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng ở Who\'s applying.');
    } else {
      log(`✅ Who's applying: Cost savings = Yes (${totalApplyingOnPage} người).`);
    }

    if (autoContinue) await clickContinueAndWait('HOUSEHOLD_WHOS_APPLYING');
  }

  async function handleHouseholdMedicare(autoContinue) {
    const boxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      .filter(cb => !cb.closest('#tbr-hsp-panel') && D.isVisible(cb));
    const anyChecked = boxes.some(cb => cb.checked);
    if (anyChecked) {
      const choice = await askUser(
        '⚠️ Phát hiện người được tích Medicare!',
        'Mục Medicare đang có người được chọn. Renew Obamacare bình thường thì không tích ai. Hãy kiểm tra và chọn:',
        [
          { label: 'Bỏ tích tất cả & Đi tiếp', className: 'tbr-btn-primary', value: 'uncheck' },
          { label: 'Giữ nguyên & Đi tiếp', className: 'tbr-btn-secondary', value: 'continue' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng ở Medicare.');
      if (choice === 'uncheck') {
        for (const cb of boxes) {
          if (cb.checked) cb.click();
        }
      }
    } else {
      log('✅ Medicare: không tích ai.');
    }
    if (autoContinue) await clickContinueAndWait('HOUSEHOLD_MEDICARE');
  }

  async function handleApplicantRelationships(autoContinue) {
    // Check if any relationship select / React-Select is empty or "Select"
    const selects = Array.from(document.querySelectorAll('select, [class*="singleValue"], [class*="placeholder"]'))
      .filter(el => !el.closest('#tbr-hsp-panel') && D.isVisible(el));
    const hasUnselected = selects.some(el => {
      if (el.tagName === 'SELECT') return !el.value;
      return /^select\b/i.test(D.normText(el.textContent));
    });

    if (hasUnselected) {
      const choice = await askUser(
        '👨‍👩‍👧 Kiểm tra Quan hệ giữa các thành viên (Applicant relationships)',
        'Có mục quan hệ giữa các thành viên đang để trống ("Select"). Vui lòng chọn đúng quan hệ (vd: Brother or Sister / Spouse...) rồi bấm:',
        [
          { label: '✅ Đã chọn xong, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng tại đây', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng ở Applicant relationships.');
    } else {
      log('✅ Applicant relationships: đã có sẵn quan hệ hợp lệ.');
    }
    if (autoContinue) await clickContinueAndWait('HOUSEHOLD_APPLICANT_RELATIONSHIPS');
  }

  async function handleHouseholdResidence(autoContinue) {
    D.selectRadioByQuestion(/Does everyone applying for coverage live with you/i, /^Yes$/i);
    log('✅ Residence: chọn Yes.');
    if (autoContinue) await clickContinueAndWait('HOUSEHOLD_RESIDENCE');
  }

  function extractTaxSummary() {
    const txt = document.body ? document.body.innerText : '';
    const checkChoice = qRe => {
      const textEls = Array.from(document.querySelectorAll('p, div, span, legend, label'))
        .filter(el => D.isVisible(el) && !el.closest('#tbr-hsp-panel') && qRe.test(D.normText(el.textContent)));
      for (const el of textEls) {
        let box = el.parentElement;
        for (let i = 0; i < 3 && box; i++) {
          const checked = box.querySelector('input[type="radio"]:checked');
          if (checked) {
            const lbl = checked.closest('label') || checked.parentElement;
            return D.normText(lbl ? lbl.textContent : '');
          }
          box = box.parentElement;
        }
      }
      return '(chưa chọn)';
    };
    const deps = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .filter(cb => !cb.closest('#tbr-hsp-panel') && D.isVisible(cb))
      .map(cb => D.normText((cb.closest('label') || cb.parentElement)?.textContent || ''));

    return {
      married: checkChoice(/Are you married\?/i),
      fileTax: checkChoice(/federal income tax return/i),
      claimingDeps: checkChoice(/claiming any dependents/i),
      dependents: deps
    };
  }

  async function handleHouseholdTax(d, autoContinue) {
    const tax = extractTaxSummary();
    if (state.prefs.pauseOnTax) {
      const detail =
        `• Are you married?: ${tax.married}\n` +
        `• File tax return 2027?: ${tax.fileTax}\n` +
        `• Claiming dependents?: ${tax.claimingDeps}` +
        (tax.dependents.length ? `\n• Dependent đang tích: ${tax.dependents.join(', ')}` : '') +
        (d.hhSize ? `\n• Lưu ý CRM ghi: HH ${d.hhSize} (${(d.members || []).join(' + ')})` : '');

      const choice = await askUser(
        '🧾 Kiểm tra Khai thuế (Tax household)',
        detail,
        [
          { label: '✅ Khai thuế đúng rồi, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng để tôi sửa tay', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng tại Tax household.');
    } else {
      log(`✅ Tax household: Married=${tax.married}, FileTax=${tax.fileTax}, Claim=${tax.claimingDeps}.`);
    }
    if (autoContinue) await clickContinueAndWait('HOUSEHOLD_TAX');
  }

  async function handleOtherFamilyRel(autoContinue) {
    D.selectRadioByQuestion(/live with any other people under 19|live with another parent/i, /^No$/i);
    log('✅ Other family relationships: chọn No.');
    if (autoContinue) await clickContinueAndWait('ADDITIONAL_OTHER_REL');
  }

  async function handleMembers1(autoContinue) {
    const citizenYes = document.querySelector('input[type="radio"]:checked');
    // Check if US citizen? is answered No or blank
    const noCitRadio = Array.from(document.querySelectorAll('input[type="radio"]')).find(r => {
      const box = r.closest('div')?.parentElement;
      return box && /US citizen or US national\?/i.test(box.textContent) && /No/i.test((r.closest('label') || r.parentElement)?.textContent || '') && r.checked;
    });
    if (noCitRadio) {
      const choice = await askUser(
        '🛂 Thành viên không phải Công dân Mỹ (Non-US Citizen)',
        'Mục "US citizen or US national?" đang chọn No. Bạn kiểm tra tình trạng di trú (Thẻ xanh / Work Permit) bên dưới đã khớp chưa nhé:',
        [
          { label: '✅ Thông tin di trú đúng rồi, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng để tôi kiểm tra', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng ở Members (di trú).');
    }

    D.selectRadioByQuestion(/used tobacco 4 or more times/i, /^No$/i);
    D.selectRadioByQuestion(/currently incarcerated/i, /^No$/i);
    D.selectRadioByQuestion(/American Indian or Alaska Native/i, /^No$/i);
    D.selectRadioByQuestion(/Hispanic, Latino, or Spanish/i, /^No$/i);
    if (!citizenYes) {
      log('⚠️ Có câu hỏi Members 1 chưa có sẵn đáp án.');
    } else {
      log('✅ Members (phần 1): đã kiểm tra Tobacco/Incarcerated/AI-AN = No.');
    }
    if (autoContinue) await clickContinueAndWait('MEMBERS_APPLICANT_1');
  }

  async function handleMembers2(autoContinue) {
    D.selectRadioByQuestion(/pregnant\?/i, /^No$/i);
    log('✅ Members (phần 2): giữ nguyên thông tin Quốc tịch & Pregnant = No.');
    if (autoContinue) await clickContinueAndWait('MEMBERS_APPLICANT_2');
  }

  async function handleIncome(d, autoContinue) {
    const text = document.body ? document.body.innerText : '';
    const sideActive = D.getActiveSidebarText();
    const whoMatch = text.match(/Current income for\s+([^\n]+)/i);
    const currentPerson = whoMatch ? whoMatch[1].trim() : sideActive;
    const isChild = /\(Child\)/i.test(sideActive) ||
      (state.autoDetectedChildren || []).some(ch => currentPerson.toLowerCase().includes(ch.toLowerCase()));

    if (isChild) {
      const yesIncome = Array.from(document.querySelectorAll('input[type="radio"]')).find(r => {
        const box = r.closest('div')?.parentElement;
        return box && /currently get any income\?/i.test(box.textContent) && /^Yes$/i.test((r.closest('label') || r.parentElement)?.textContent || '') && r.checked;
      });
      if (yesIncome) {
        const choice = await askUser(
          `⚠️ Bé "${currentPerson}" đang chọn Có thu nhập (Yes)`,
          'Hồ sơ phụ thuộc dưới 18 tuổi thường chọn No income. Vui lòng kiểm tra xem bé có thu nhập riêng hay không:',
          [
            { label: 'Chọn No & Đi tiếp', className: 'tbr-btn-primary', value: 'set_no' },
            { label: 'Giữ nguyên & Đi tiếp', className: 'tbr-btn-secondary', value: 'continue' }
          ]
        );
        if (choice === 'stop') return stopRunner('Đã dừng ở Income (Child).');
        if (choice === 'set_no') {
          D.selectRadioByQuestion(/currently get any income\?/i, /^No$/i);
          await D.sleep(250);
        }
      } else {
        D.selectRadioByQuestion(/currently get any income\?/i, /^No$/i);
        log(`✅ Income (${currentPerson}): chọn No.`);
      }
      if (autoContinue) await clickContinueAndWait('INCOME');
      return;
    }

    // Adult / Primary applicant Income
    if (d.income === null || d.income === undefined) {
      const choice = await askUser(
        '💵 Chưa có mức Income mục tiêu',
        'Vui lòng nhập Income (VD: 30000) vào ô "Income ($/năm)" trên bảng bên phải hoặc tự chỉnh trên trang rồi bấm:',
        [
          { label: '✅ Đã chỉnh xong, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng tại đây', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng ở Income.');
      readOverridesFromInputs();
      if (autoContinue) await clickContinueAndWait('INCOME');
      return;
    }

    const totalMatch = text.match(/will be about\s*\$([\d,]+(?:\.\d{2})?)/i);
    const currentYearly = totalMatch ? P.parseIncome(totalMatch[1]) : null;
    if (currentYearly !== null && Math.abs(currentYearly - d.income) <= 12) {
      D.selectRadioByQuestion(/any deductions for/i, /^No$/i);
      D.selectRadioByQuestion(/Is this correct\?/i, /^Yes$/i);
      log(`✅ Income (${currentPerson}): đã khớp $${d.income.toLocaleString('en-US')}/năm.`);
      if (autoContinue) await clickContinueAndWait('INCOME');
      return;
    }

    const editBtns = Array.from(document.querySelectorAll('button'))
      .filter(b => !b.closest('#tbr-hsp-panel') && D.isVisible(b) && /^Edit$/i.test(D.normText(b.textContent)));

    if (editBtns.length !== 1) {
      const choice = await askUser(
        `💵 Cần chỉnh Income cho ${currentPerson} sang $${d.income.toLocaleString('en-US')}`,
        `Trang hiện có ${editBtns.length} nguồn thu nhập (${currentYearly !== null ? `tổng $${currentYearly.toLocaleString('en-US')}` : 'chưa có thu nhập'}).\nĐể an toàn cho hộ có nhiều nguồn thu nhập, nhờ bạn bấm Add/Edit về $${d.income.toLocaleString('en-US')} rồi bấm:`,
        [
          { label: '✅ Đã chỉnh xong, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng tại đây', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng để chỉnh Income.');
      if (autoContinue) await clickContinueAndWait('INCOME');
      return;
    }

    // 1 income row: click Edit -> update Amount & Yearly -> Save
    editBtns[0].click();
    const amountEl = await D.waitFor(() => D.findControlByLabel(/^Amount$/i), 2500, 100);
    if (!amountEl) {
      log('⚠️ Không tìm thấy ô Amount sau khi bấm Edit income.');
      return;
    }
    D.setReactInputValue(amountEl, String(d.income));
    const freqDrop = D.findDropdownByLabel(/^How often$/i);
    if (freqDrop) {
      await D.selectDropdownOption(freqDrop, 'Yearly');
    }
    await D.sleep(200);
    D.clickButtonByText(/^Save$/i);
    await D.waitFor(() => {
      const m = (document.body?.innerText || '').match(/will be about\s*\$([\d,]+(?:\.\d{2})?)/i);
      if (!m) return false;
      const val = P.parseIncome(m[1]);
      return val !== null && Math.abs(val - d.income) <= 12;
    }, 3000, 150);

    D.selectRadioByQuestion(/any deductions for/i, /^No$/i);
    D.selectRadioByQuestion(/Is this correct\?/i, /^Yes$/i);
    await D.sleep(200);
    log(`✅ Income (${currentPerson}): đã cập nhật ${currentYearly ?? '?'} -> $${d.income.toLocaleString('en-US')}/năm (Yearly).`);
    if (autoContinue) await clickContinueAndWait('INCOME');
  }

  function findDeniedMedicaidSection() {
    const els = Array.from(document.querySelectorAll('p, div, span, legend'))
      .filter(el => !el.closest('#tbr-hsp-panel') && D.isVisible(el) && /found not eligible for/i.test(D.normText(el.textContent)));
    els.sort((a, b) => a.textContent.length - b.textContent.length);
    for (const el of els) {
      let box = el.parentElement;
      for (let i = 0; i < 3 && box; i++) {
        const cbs = box.querySelectorAll('input[type="checkbox"]');
        if (cbs.length >= 1) return box;
        box = box.parentElement;
      }
    }
    return null;
  }

  async function handleExtraHelp(d, autoContinue) {
    const denySection = findDeniedMedicaidSection();
    const targets = d.denyMedicaidMembers && d.denyMedicaidMembers.length > 0
      ? d.denyMedicaidMembers
      : state.autoDetectedChildren;

    let tickedNames = [];
    if (denySection && targets.length > 0) {
      for (const name of targets) {
        const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const ok = D.setCheckboxByText(new RegExp(esc, 'i'), true, denySection);
        if (ok) tickedNames.push(name);
      }
      await D.sleep(300);
      // Fill denied date input(s) appearing after checking child name(s)
      const dateInputs = Array.from(denySection.parentElement.querySelectorAll('input[type="text"], input[placeholder*="MM"]'))
        .filter(inp => D.isVisible(inp) && !inp.closest('#tbr-hsp-panel'));
      for (const inp of dateInputs) {
        if (!inp.value || inp.value.trim() !== (d.denyMedicaidDate || '11/01/2026')) {
          D.setReactInputValue(inp, d.denyMedicaidDate || '11/01/2026');
        }
      }
    }

    if (state.prefs.pauseOnMedicaid && (targets.length > 0 || tickedNames.length > 0)) {
      const choice = await askUser(
        '🏥 Kiểm tra Deny Medicaid (<18/19 tuổi)',
        tickedNames.length > 0
          ? `Đã tự tích Deny Medicaid cho: ${tickedNames.join(', ')}\nNgày điền: ${d.denyMedicaidDate || '11/01/2026'}\n(2 ô câu hỏi phụ bên dưới để trống)`
          : `Phát hiện có thể cần check Deny Medicaid (${targets.join(', ')}) nhưng chưa khớp checkbox tự động. Bạn kiểm tra trên trang Extra help nhé:`,
        [
          { label: '✅ Chuẩn rồi, đi tiếp', className: 'tbr-btn-success', value: 'continue' },
          { label: '⏹ Dừng để tôi chỉnh', className: 'tbr-btn-danger', value: 'stop' }
        ]
      );
      if (choice === 'stop') return stopRunner('Đã dừng tại Extra help.');
    } else {
      log(`✅ Extra help: ${tickedNames.length ? `Deny Medicaid (${tickedNames.join(', ')})` : 'không tích bé nào'}.`);
    }

    if (autoContinue) await clickContinueAndWait('EXTRA_HELP');
  }

  async function handleCoverage(autoContinue) {
    // Select No for all "currently enrolled in health coverage?" radios
    const qEls = Array.from(document.querySelectorAll('p, div, span, legend'))
      .filter(el => !el.closest('#tbr-hsp-panel') && D.isVisible(el) && /currently enrolled in health coverage\?/i.test(D.normText(el.textContent)));

    const seenBoxes = new Set();
    for (const qEl of qEls) {
      let box = qEl.parentElement;
      for (let i = 0; i < 3 && box; i++) {
        const radios = box.querySelectorAll('input[type="radio"]');
        if (radios.length >= 2) {
          if (!seenBoxes.has(box)) {
            seenBoxes.add(box);
            for (const r of radios) {
              const lbl = r.closest('label') || r.parentElement;
              if (/^No$/i.test(D.normText(lbl?.textContent || '')) && !r.checked) {
                if (lbl) lbl.click();
                if (!r.checked) r.click();
              }
            }
          }
          break;
        }
        box = box.parentElement;
      }
    }
    log(`✅ Existing coverage: chọn No cho ${seenBoxes.size} câu hỏi (bỏ trống ICHRA).`);
    if (autoContinue) await clickContinueAndWait('COVERAGE');
  }

  async function handleEmployerCoverage(autoContinue) {
    log('✅ Employer coverage: bỏ trống tất cả.');
    if (autoContinue) await clickContinueAndWait('EMPLOYER_COVERAGE');
  }

  async function handleAdditionalSep(autoContinue) {
    // Renew 2027: ensure NO SEP checkboxes are checked
    const cbs = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      .filter(cb => !cb.closest('#tbr-hsp-panel') && D.isVisible(cb) && cb.checked);
    for (const cb of cbs) cb.click();
    log('✅ Additional questions (SEP): Renew 2027 bỏ trống hết SEP.');
    if (autoContinue) await clickContinueAndWait('ADDITIONAL_QUESTIONS_SEP');
  }

  function extractFinalizeReviewData() {
    const text = document.body ? document.body.innerText : '';
    const getFieldLine = regex => {
      const m = text.match(regex);
      return m ? m[1].trim() : '';
    };

    const phone = getFieldLine(/Phone number:\s*([^\n]+)/i);
    const email = getFieldLine(/Email:\s*([^\n]+)/i);
    const coverageCounty = getFieldLine(/Coverage county:\s*([^\n]+)/i);
    const homeAddress = getFieldLine(/Home address:\s*([^\n]+)/i);
    const mailingAddress = getFieldLine(/Mailing address:\s*([^\n]+)/i);

    // Members table
    const members = [];
    const tableRows = Array.from(document.querySelectorAll('table tr'))
      .filter(tr => !tr.closest('#tbr-hsp-panel') && D.isVisible(tr));
    for (const tr of tableRows) {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => D.normText(td.textContent));
      if (cells.length >= 7 && /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/.test(cells[1])) {
        members.push({
          name: cells[0],
          dob: cells[1],
          applying: /^Yes$/i.test(cells[6])
        });
      }
    }

    // Expected income in 2027 (sum all household member expected incomes in Income summary table)
    let expectedIncome2027 = null;
    for (const tr of tableRows) {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => D.normText(td.textContent));
      if (cells.length === 3 && /^\$/.test(cells[1]) && /^\$/.test(cells[2])) {
        const val = P.parseIncome(cells[2]);
        if (val !== null) expectedIncome2027 = (expectedIncome2027 || 0) + val;
      }
    }

    // Check Additional questions summary for SEP statements without "did not" / "were not"
    const sepPositive = /did lose coverage on or after|did get married on or after|were adopted or placed for foster care on or after|did move on or after|did gain eligible immigration status on or after/i.test(text);

    return {
      phone,
      email,
      coverageCounty,
      homeAddress,
      mailingAddress,
      members: members.length ? members : undefined,
      expectedIncome2027,
      hasSepChecked: sepPositive
    };
  }

  async function handleFinalizeReview(d) {
    const rev = extractFinalizeReviewData();
    const audit = P.auditReviewData(rev, { ...d, pass: state.passMode });
    renderAuditResults(audit);
    log('🏁 Đã dừng tại Finalize -> Review và kiểm tra đối chiếu dữ liệu!');
    stopRunner();
  }

  async function runSingleStep(autoContinue) {
    readOverridesFromInputs();
    const d = state.parsed;
    const step = currentStep();
    updateStepBadge();

    switch (step) {
      case 'PRIVACY_STATEMENT': return handlePrivacyStatement(autoContinue);
      case 'PRIMARY_REVIEW': return handlePrimaryReview(d, autoContinue);
      case 'PRIMARY_YOUR_INFO': return handlePrimaryYourInfo(d, autoContinue);
      case 'PRIMARY_HOME_ADDRESS': return handlePrimaryHomeAddress(d, autoContinue);
      case 'PRIMARY_CONTACT_DETAILS': return handlePrimaryContactDetails(d, autoContinue);
      case 'HOUSEHOLD_WHOS_APPLYING': return handleHouseholdWhosApplying(d, autoContinue);
      case 'HOUSEHOLD_MEDICARE': return handleHouseholdMedicare(autoContinue);
      case 'HOUSEHOLD_APPLICANT_RELATIONSHIPS': return handleApplicantRelationships(autoContinue);
      case 'HOUSEHOLD_RESIDENCE': return handleHouseholdResidence(autoContinue);
      case 'HOUSEHOLD_TAX': return handleHouseholdTax(d, autoContinue);
      case 'ADDITIONAL_OTHER_REL': return handleOtherFamilyRel(autoContinue);
      case 'MEMBERS_APPLICANT_1': return handleMembers1(autoContinue);
      case 'MEMBERS_APPLICANT_2': return handleMembers2(autoContinue);
      case 'INCOME': return handleIncome(d, autoContinue);
      case 'EXTRA_HELP': return handleExtraHelp(d, autoContinue);
      case 'COVERAGE': return handleCoverage(autoContinue);
      case 'EMPLOYER_COVERAGE': return handleEmployerCoverage(autoContinue);
      case 'ADDITIONAL_QUESTIONS_SEP': return handleAdditionalSep(autoContinue);
      case 'FINALIZE_REVIEW': return handleFinalizeReview(d);
      case 'FINALIZE_MANUAL':
        stopRunner('🛑 Đã tới 3 bước cuối (Agreements / Tax attestation / Sign and submit) — Phần mềm không tự động bấm.');
        return;
      default:
        stopRunner('⏸ Chưa nhận diện được trang HealthSherpa (hãy mở vào trong phần Edit hồ sơ).');
    }
  }

  async function runLoop(passMode) {
    if (state.isRunning) return;
    clearAuditBox();
    clearPrompt();
    state.passMode = passMode;
    setRunningUI(true);
    log(passMode === 2 ? '🔧 Bắt đầu Lượt 2 (Sửa Email / Phone / County)...' : '▶ Bắt đầu tự động điền Renew 2027 tới Review...');

    let guard = 0;
    while (state.isRunning && guard < 40) {
      guard += 1;
      const step = currentStep();
      if (step === 'FINALIZE_REVIEW' || step === 'FINALIZE_MANUAL' || step === 'UNKNOWN') {
        await runSingleStep(false);
        break;
      }
      await runSingleStep(true);
      await D.sleep(250);
    }

    if (guard >= 40) {
      stopRunner('⚠️ Đã dừng vì vượt quá 40 bước liên tiếp (tránh lặp vô hạn).');
    } else if (state.isRunning) {
      setRunningUI(false);
    }
  }

  // ==================== FLOATING PANEL UI ====================

  function buildPanel() {
    if (document.getElementById('tbr-hsp-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'tbr-hsp-panel';
    panel.innerHTML = `
      <div class="tbr-header" id="tbr-drag-handle">
        <div class="tbr-title-wrap">
          <div class="tbr-title">⚡ TBR Renew 2027 Helper</div>
          <div class="tbr-step-badge" id="tbr-step-badge">Đang kiểm tra trang...</div>
        </div>
        <div class="tbr-header-actions">
          <button type="button" class="tbr-icon-btn" id="tbr-btn-collapse" title="Thu gọn / Mở rộng">➖</button>
        </div>
      </div>
      <div class="tbr-body">
        <div class="tbr-section">
          <div class="tbr-section-title">
            <span>📋 Dữ liệu khách (CRM / Paste Note)</span>
            <span class="tbr-badge-tiny">0 Token</span>
          </div>
          <textarea id="tbr-note-input" placeholder="Dán Note CRM vào đây (hoặc bấm 'Gửi data sang HealthSherpa' ở tab CRM)..."></textarea>
          <div class="tbr-grid">
            <div class="tbr-field tbr-full">
              <label>Email thật của khách</label>
              <input id="tbr-f-email" type="text" placeholder="vd: lambaokim@gmail.com">
            </div>
            <div class="tbr-field">
              <label>Phone (nếu cần đổi)</label>
              <input id="tbr-f-phone" type="text" placeholder="(xxx) xxx-xxxx">
            </div>
            <div class="tbr-field">
              <label>County (Enrolled)</label>
              <input id="tbr-f-county" type="text" placeholder="vd: Waller">
            </div>
            <div class="tbr-field tbr-full">
              <label>Enrolled Address</label>
              <input id="tbr-f-enrolled" type="text" placeholder="3030 Cheverny Dr, Katy, TX 77493">
            </div>
            <div class="tbr-field tbr-full">
              <label>Mailing Address (trống nếu giống trên)</label>
              <input id="tbr-f-mailing" type="text" placeholder="9110 Arvada Bay Ct, Richmond, TX 77407">
            </div>
            <div class="tbr-field">
              <label>Income ($/năm)</label>
              <input id="tbr-f-income" type="text" placeholder="30000">
            </div>
            <div class="tbr-field">
              <label>Số người Apply</label>
              <input id="tbr-f-apply" type="text" placeholder="2">
            </div>
            <div class="tbr-field">
              <label>Deny Medicaid (&lt;18/19t)</label>
              <input id="tbr-f-medicaid" type="text" placeholder="William Nguyen">
            </div>
            <div class="tbr-field">
              <label>Ngày Denied</label>
              <input id="tbr-f-medicaid-date" type="text" value="11/01/2026">
            </div>
          </div>
          <div class="tbr-opts">
            <label><input type="checkbox" id="tbr-opt-tax" checked> Dừng hỏi xác nhận ở Khai thuế (Tax household)</label>
            <label><input type="checkbox" id="tbr-opt-medicaid" checked> Dừng hỏi xác nhận ở Deny Medicaid (&lt;18t)</label>
          </div>
        </div>

        <div class="tbr-controls">
          <button type="button" class="tbr-btn tbr-btn-primary" id="tbr-btn-run">▶ Chạy tự động đến Review</button>
          <button type="button" class="tbr-btn tbr-btn-secondary" id="tbr-btn-step">⏭ Điền trang này</button>
          <button type="button" class="tbr-btn tbr-btn-amber" id="tbr-btn-pass2">🔧 Lượt 2 (Email/County)</button>
          <button type="button" class="tbr-btn tbr-btn-danger" id="tbr-btn-stop" disabled>⏹ Dừng</button>
        </div>

        <div class="tbr-prompt-box" id="tbr-prompt-box"></div>
        <div class="tbr-audit-box" id="tbr-audit-box"></div>

        <div class="tbr-log" id="tbr-log">
          <div class="tbr-log-item">Sẵn sàng! Mở vào phần Edit hồ sơ rồi bấm ▶ để chạy.</div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Collapse toggle
    document.getElementById('tbr-btn-collapse').addEventListener('click', () => {
      panel.classList.toggle('tbr-collapsed');
      state.prefs.collapsed = panel.classList.contains('tbr-collapsed');
      saveToStorage();
    });

    // Live parse on note paste/input
    document.getElementById('tbr-note-input').addEventListener('input', e => {
      state.rawNote = e.target.value;
      // Reset manual text overrides when user pastes a new note
      state.overrides = {};
      syncInputsFromState();
      saveToStorage();
    });

    // Save edits to individual summary inputs
    const fieldIds = [
      'tbr-f-email', 'tbr-f-phone', 'tbr-f-county', 'tbr-f-enrolled',
      'tbr-f-mailing', 'tbr-f-income', 'tbr-f-apply', 'tbr-f-medicaid', 'tbr-f-medicaid-date'
    ];
    for (const fid of fieldIds) {
      document.getElementById(fid).addEventListener('change', readOverridesFromInputs);
    }

    document.getElementById('tbr-opt-tax').addEventListener('change', e => {
      state.prefs.pauseOnTax = e.target.checked;
      saveToStorage();
    });
    document.getElementById('tbr-opt-medicaid').addEventListener('change', e => {
      state.prefs.pauseOnMedicaid = e.target.checked;
      saveToStorage();
    });

    // Control buttons
    document.getElementById('tbr-btn-run').addEventListener('click', () => runLoop(1));
    document.getElementById('tbr-btn-step').addEventListener('click', () => runSingleStep(false));
    document.getElementById('tbr-btn-pass2').addEventListener('click', () => runLoop(2));
    document.getElementById('tbr-btn-stop').addEventListener('click', () => stopRunner('⏹ Đã bấm Dừng theo yêu cầu.'));

    // Draggable header
    const handle = document.getElementById('tbr-drag-handle');
    let dragStart = null;
    handle.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return;
      const rect = panel.getBoundingClientRect();
      dragStart = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    });
    document.addEventListener('mousemove', e => {
      if (!dragStart) return;
      panel.style.left = `${Math.max(0, e.clientX - dragStart.dx)}px`;
      panel.style.top = `${Math.max(0, e.clientY - dragStart.dy)}px`;
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
      dragStart = null;
    });

    // Listen for live CRM pushes from crm-grabber
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes[STORAGE_KEY]?.newValue) {
          const val = changes[STORAGE_KEY].newValue;
          if (val.rawNote !== state.rawNote || JSON.stringify(val.overrides) !== JSON.stringify(state.overrides)) {
            state.rawNote = val.rawNote || '';
            state.overrides = val.overrides || {};
            state.lockedEmailPass1 = false;
            state.lockedPhonePass1 = false;
            syncInputsFromState();
            log('📥 Đã nhận dữ liệu khách mới từ tab TBR CRM!');
          }
        }
      });
    }

    // Listen for popup commands
    if (chrome?.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(msg => {
        if (msg?.type === 'TBR_SHOW_PANEL') {
          panel.classList.remove('tbr-collapsed');
          state.prefs.collapsed = false;
          saveToStorage();
        }
      });
    }

    loadFromStorage();
    updateStepBadge();
    setInterval(updateStepBadge, 1000);
  }

  buildPanel();
})();
