(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TBRParser = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STATE_MAP = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
    FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
    IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
    ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
    MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
    NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
    NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
    PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
    TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
    WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
  };

  const STATE_REVERSE = {};
  for (const [code, name] of Object.entries(STATE_MAP)) {
    STATE_REVERSE[name.toLowerCase()] = code;
  }

  const FORBIDDEN_EMAIL_DOMAINS = [
    'tbri.co', 'tbri.com', 'tbr.co', 'thebestrateins.com',
    'ushin.com', 'ushins.com', 'proton.me', 'protonmail.com',
    'qeyet.com', 'b3hgt.com'
  ];

  /**
   * Check whether an email belongs to a forbidden company or internal placeholder domain.
   * @param {string} email
   * @returns {{ forbidden: boolean, reason: string | null }}
   */
  function isForbiddenEmail(email) {
    if (!email || typeof email !== 'string') {
      return { forbidden: false, reason: null };
    }
    const clean = email.trim().toLowerCase();
    const atIdx = clean.lastIndexOf('@');
    if (atIdx === -1) return { forbidden: false, reason: null };
    const domain = clean.slice(atIdx + 1);
    for (const d of FORBIDDEN_EMAIL_DOMAINS) {
      if (domain === d || domain.endsWith('.' + d)) {
        return {
          forbidden: true,
          reason: `Email dùng domain bị cấm (${domain}). Bắt buộc đổi sang email thật của khách hàng.`
        };
      }
    }
    if (/\btbr\b|\btbri\b|\bushin\b/i.test(domain)) {
      return {
        forbidden: true,
        reason: `Email nghi vấn domain nội bộ (${domain}). Vui lòng kiểm tra và đổi sang email thật của khách.`
      };
    }
    return { forbidden: false, reason: null };
  }

  /**
   * Normalize US state input (code or full name) into { stateCode, stateName }.
   * @param {string} raw
   * @returns {{ stateCode: string, stateName: string }}
   */
  function normalizeState(raw) {
    if (!raw) return { stateCode: '', stateName: '' };
    const cleaned = raw.trim().replace(/[.,]+$/, '');
    const upper = cleaned.toUpperCase();
    if (STATE_MAP[upper]) {
      return { stateCode: upper, stateName: STATE_MAP[upper] };
    }
    const code = STATE_REVERSE[cleaned.toLowerCase()];
    if (code) {
      return { stateCode: code, stateName: STATE_MAP[code] };
    }
    return { stateCode: upper, stateName: cleaned };
  }

  /**
   * Parse a US street address into components, handling extra commas before ZIP and Apt/Ste units.
   * Examples:
   *   "3030 Cheverny Dr, Katy, TX 77493"
   *   "9110 Arvada Bay Ct, Richmond, TX, 77407"
   *   "123 Main St Apt 4B, Sugar Land, TX 77478"
   *   "123 Main St, Suite 200, Fort Worth, TX 76102"
   * @param {string} raw
   * @returns {{ raw: string, street: string, apt: string, city: string, stateCode: string, stateName: string, zip: string } | null}
   */
  function parseUSAddress(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const cleaned = raw.replace(/\s+/g, ' ').trim().replace(/,+$/, '');
    if (!cleaned) return null;

    let zip = '';
    let rest = cleaned;
    const zipMatch = rest.match(/[,\s]+(\d{5})(?:-\d{4})?$/);
    if (zipMatch) {
      zip = zipMatch[1];
      rest = rest.slice(0, zipMatch.index).trim().replace(/,+$/, '');
    }

    let stateCode = '';
    let stateName = '';
    const parts = rest.split(',').map(p => p.trim()).filter(Boolean);

    if (parts.length >= 2) {
      const last = parts[parts.length - 1];
      const stCheck = normalizeState(last);
      if (STATE_MAP[stCheck.stateCode]) {
        stateCode = stCheck.stateCode;
        stateName = stCheck.stateName;
        parts.pop();
      } else {
        const trailingState = last.match(/^(.*?)\s+([A-Za-z]{2})$/);
        if (trailingState && STATE_MAP[trailingState[2].toUpperCase()]) {
          const s = normalizeState(trailingState[2]);
          stateCode = s.stateCode;
          stateName = s.stateName;
          parts[parts.length - 1] = trailingState[1].trim();
        }
      }
    }

    let city = '';
    if (parts.length >= 2) {
      city = parts.pop();
    }

    let street = '';
    let apt = '';

    // Check if an explicit Apt/Ste/Unit token was a middle comma segment (e.g., "123 Main St, Suite 200, Fort Worth")
    const unitRegex = /^(?:(?:apt|apartment|ste|suite|unit|bldg|lot|fl|floor|rm|room)\b\.?\s*|#)\s*[\w-]+$/i;
    if (parts.length >= 2 && unitRegex.test(parts[parts.length - 1])) {
      apt = parts.pop();
    }
    street = parts.join(', ').trim();

    // Also split trailing inline unit if present (e.g., "123 Main St Apt 4B")
    if (!apt && street) {
      const inlineUnit = street.match(/^(.*?)[,\s]+((?:apt|apartment|ste|suite|unit)\b\.?\s*[\w-]+|#\s*[\w-]+)$/i);
      if (inlineUnit) {
        street = inlineUnit[1].trim().replace(/,+$/, '');
        apt = inlineUnit[2].trim();
      }
    }

    return {
      raw: cleaned,
      street,
      apt,
      city,
      stateCode,
      stateName,
      zip
    };
  }

  /**
   * Format normalized single-line address for comparison & UI display.
   * @param {{ street?: string, apt?: string, city?: string, stateCode?: string, zip?: string } | null} addr
   * @returns {string}
   */
  function formatAddress(addr) {
    if (!addr) return '';
    const line1 = [addr.street, addr.apt].filter(Boolean).join(' ');
    const line2 = [addr.city, [addr.stateCode, addr.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    return [line1, line2].filter(Boolean).join(', ');
  }

  /**
   * Normalize street string for loose equality comparison.
   * @param {string} s
   * @returns {string}
   */
  function normStr(s) {
    return (s || '').toLowerCase().replace(/[.,#]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Check whether two parsed addresses refer to the same physical location.
   * @param {ReturnType<typeof parseUSAddress>} a
   * @param {ReturnType<typeof parseUSAddress>} b
   * @returns {boolean}
   */
  function addressesMatch(a, b) {
    if (!a || !b) return false;
    const streetA = normStr([a.street, a.apt].filter(Boolean).join(' '));
    const streetB = normStr([b.street, b.apt].filter(Boolean).join(' '));
    if (streetA && streetB && streetA === streetB) {
      if (a.zip && b.zip) return a.zip === b.zip;
      return true;
    }
    return normStr(a.raw) === normStr(b.raw);
  }

  /**
   * Normalize County name (strips "County", trailing commas, and optional ", XX" state suffix).
   * @param {string} raw
   * @returns {string}
   */
  function normalizeCounty(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let s = raw.replace(/\s+/g, ' ').trim();
    s = s.replace(/[,.;]+$/, '').trim();
    // Strip trailing state code like "Harris, TX"
    s = s.replace(/,\s*[A-Za-z]{2}$/, '').trim();
    s = s.replace(/\s+county$/i, '').trim();
    return s;
  }

  /**
   * Parse yearly income expressions such as "$30k", "30k", "$30,000.00", "30000".
   * @param {string | number} raw
   * @returns {number | null}
   */
  function parseIncome(raw) {
    if (typeof raw === 'number' && !Number.isNaN(raw)) return Math.round(raw);
    if (!raw || typeof raw !== 'string') return null;
    const m = raw.replace(/,/g, '').match(/\$?\s*(\d+(?:\.\d+)?)\s*(k)?/i);
    if (!m) return null;
    let val = parseFloat(m[1]);
    if (Number.isNaN(val)) return null;
    if (m[2]) val *= 1000;
    return Math.round(val);
  }

  /**
   * Normalize US phone number into { digits, formatted }.
   * @param {string} raw
   * @returns {{ digits: string, formatted: string } | null}
   */
  function parsePhone(raw) {
    if (!raw || typeof raw !== 'string') return null;
    let digits = raw.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.slice(1);
    }
    if (digits.length !== 10) return null;
    const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return { digits, formatted };
  }

  /**
   * Calculate age in full years given DOB ("MM/DD/YYYY" or "YYYY-MM-DD").
   * @param {string} dobStr
   * @param {Date | number} [refDate]
   * @returns {number | null}
   */
  function calculateAge(dobStr, refDate) {
    if (!dobStr || typeof dobStr !== 'string') return null;
    const s = dobStr.trim();
    let year, month, day;
    let m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (m) {
      month = parseInt(m[1], 10);
      day = parseInt(m[2], 10);
      year = parseInt(m[3], 10);
    } else {
      m = s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
      if (!m) return null;
      year = parseInt(m[1], 10);
      month = parseInt(m[2], 10);
      day = parseInt(m[3], 10);
    }

    let ref;
    if (refDate instanceof Date) {
      ref = refDate;
    } else if (typeof refDate === 'number') {
      ref = new Date(refDate, 10, 22); // Nov 22 of reference year
    } else {
      ref = new Date();
    }

    let age = ref.getFullYear() - year;
    const mDiff = (ref.getMonth() + 1) - month;
    if (mDiff < 0 || (mDiff === 0 && ref.getDate() < day)) {
      age -= 1;
    }
    return age;
  }

  /**
   * Split member list strings like "Kim Lam + William Nguyen" or "A, B & C".
   * @param {string} raw
   * @returns {string[]}
   */
  function splitMemberList(raw) {
    if (!raw || typeof raw !== 'string') return [];
    return raw
      .split(/\s*[+&/,;]\s*/)
      .map(s => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  /**
   * Parse CRM RTE Note text and merge optional manual UI overrides.
   * @param {string} rawText
   * @param {Record<string, any>} [overrides]
   */
  function parseCrmNote(rawText, overrides) {
    const text = (rawText || '').replace(/\r\n/g, '\n');
    const ov = overrides || {};

    let plan = '';
    let premium = '';
    let effectiveDate = '';
    let hhSize = null;
    let applyCount = null;
    let income = null;
    let members = [];
    let enrolledAddressRaw = '';
    let mailingAddressRaw = '';
    let county = '';
    let authorizedPortal = '';
    let email = '';
    let phoneRaw = '';
    let denyMedicaidMembers = [];
    let denyMedicaidDate = '11/01/2026';

    const lines = text.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.replace(/^[-*•\s]+/, '').trim();
      if (!line) continue;

      let m;
      if ((m = line.match(/^Plan\s*:\s*(.+)$/i))) {
        plan = m[1].trim();
      } else if ((m = line.match(/^Premium\s*:\s*(.+)$/i))) {
        premium = m[1].trim();
      } else if ((m = line.match(/^(?:Broker\s+)?Effective\s+date\s*:\s*(.+)$/i))) {
        effectiveDate = m[1].trim();
      } else if ((m = line.match(/^Apply\s+(?:for\s+)?members?\s*:\s*(.+)$/i))) {
        members = splitMemberList(m[1]);
      } else if ((m = line.match(/^(?:Enrolled|Enrollment|Home|Permanent)\s+address\s*:\s*(.+)$/i))) {
        enrolledAddressRaw = m[1].trim();
      } else if ((m = line.match(/^Mailing\s+address\s*:\s*(.+)$/i))) {
        mailingAddressRaw = m[1].trim();
      } else if ((m = line.match(/^County\s*:\s*(.+)$/i))) {
        county = normalizeCounty(m[1]);
      } else if ((m = line.match(/^Authorized(?:\s+portal)?\s*:\s*(.+)$/i))) {
        authorizedPortal = m[1].trim();
      } else if ((m = line.match(/^(?:Client\s+)?E-?mail(?:\s+address)?\s*:\s*(.+)$/i))) {
        const em = m[1].match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
        if (em) email = em[0].trim();
      } else if ((m = line.match(/^(?:Phone|Tel|SĐT)(?:\s+number)?\s*:\s*(.+)$/i))) {
        phoneRaw = m[1].trim();
      } else if ((m = line.match(/^(?:Deny\s+Medicaid|Denied\s+Medicaid|Under\s*18|Dưới\s*18|<18)\s*:\s*(.+)$/i))) {
        denyMedicaidMembers = splitMemberList(m[1]);
      } else if ((m = line.match(/^(?:Denied\s+Date|Medicaid\s+(?:Denied\s+)?Date)\s*:\s*(.+)$/i))) {
        denyMedicaidDate = m[1].trim();
      }

      // HH & Apply & Income on combined line: "HH 2 A 2 Income $30k" or "H2A2 Income 30000"
      const hhMatch = line.match(/\bH(?:H)?\s*:?\s*(\d+)\s*A\s*:?\s*(\d+)\b/i);
      if (hhMatch) {
        hhSize = parseInt(hhMatch[1], 10);
        applyCount = parseInt(hhMatch[2], 10);
      }
      const incInline = line.match(/\bIncome\s*:\s*\$?\s*([\d,.]+k?)/i) || line.match(/\bIncome\s+\$?\s*([\d,.]+k?)/i);
      if (incInline) {
        const parsedInc = parseIncome(incInline[1]);
        if (parsedInc !== null) income = parsedInc;
      }

      // Standalone email line (e.g., "lambaokim@gmail.com")
      if (!email && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(line)) {
        email = line;
      }

      // Standalone phone line
      if (!phoneRaw && /^(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(line)) {
        phoneRaw = line;
      }
    }

    // Also scan whole text for any email if still missing
    if (!email && text) {
      const emails = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
      const nonForbidden = emails.find(e => !isForbiddenEmail(e).forbidden);
      email = nonForbidden || emails[0] || '';
    }

    // Apply overrides cleanly
    const finalEnrolledRaw = ov.enrolledAddressRaw !== undefined ? ov.enrolledAddressRaw : enrolledAddressRaw;
    const finalMailingRaw = ov.mailingAddressRaw !== undefined ? ov.mailingAddressRaw : mailingAddressRaw;
    const enrolledAddress = typeof finalEnrolledRaw === 'object' && finalEnrolledRaw !== null
      ? finalEnrolledRaw
      : parseUSAddress(finalEnrolledRaw);
    const mailingAddress = typeof finalMailingRaw === 'object' && finalMailingRaw !== null
      ? finalMailingRaw
      : parseUSAddress(finalMailingRaw);

    const finalCounty = normalizeCounty(ov.county !== undefined ? ov.county : county);
    const finalEmail = (ov.email !== undefined ? ov.email : email).trim();
    const finalPhoneObj = parsePhone(ov.phone !== undefined ? ov.phone : phoneRaw);
    const finalIncome = ov.income !== undefined && ov.income !== '' ? parseIncome(String(ov.income)) : income;
    const finalMembers = Array.isArray(ov.members)
      ? ov.members
      : (typeof ov.members === 'string' && ov.members.trim() ? splitMemberList(ov.members) : members);

    const finalDenyMembers = Array.isArray(ov.denyMedicaidMembers)
      ? ov.denyMedicaidMembers
      : (typeof ov.denyMedicaidMembers === 'string'
        ? splitMemberList(ov.denyMedicaidMembers)
        : denyMedicaidMembers);
    const finalDenyDate = (ov.denyMedicaidDate !== undefined ? ov.denyMedicaidDate : denyMedicaidDate) || '11/01/2026';

    if (hhSize === null && ov.hhSize) hhSize = parseInt(ov.hhSize, 10) || null;
    if (applyCount === null && ov.applyCount) applyCount = parseInt(ov.applyCount, 10) || null;
    if (applyCount === null && finalMembers.length > 0) applyCount = finalMembers.length;

    let sameMailingAsEnrolled = true;
    if (mailingAddress && enrolledAddress) {
      sameMailingAsEnrolled = addressesMatch(enrolledAddress, mailingAddress);
    } else if (mailingAddress && !enrolledAddress) {
      sameMailingAsEnrolled = false;
    }

    const emailCheck = isForbiddenEmail(finalEmail);

    return {
      rawText: text,
      plan,
      premium,
      effectiveDate,
      hhSize,
      applyCount,
      income: finalIncome,
      members: finalMembers,
      enrolledAddress,
      mailingAddress,
      sameMailingAsEnrolled,
      county: finalCounty,
      authorizedPortal,
      email: finalEmail,
      emailForbidden: emailCheck.forbidden,
      emailForbiddenReason: emailCheck.reason,
      phone: finalPhoneObj ? finalPhoneObj.formatted : '',
      phoneDigits: finalPhoneObj ? finalPhoneObj.digits : '',
      denyMedicaidMembers: finalDenyMembers,
      denyMedicaidDate: finalDenyDate,
      lockedEmailPass1: Boolean(ov.lockedEmailPass1),
      lockedPhonePass1: Boolean(ov.lockedPhonePass1)
    };
  }

  /**
   * Audit extracted Finalize -> Review page values against target CRM data.
   * @param {{
   *   homeAddress?: string,
   *   coverageCounty?: string,
   *   mailingAddress?: string,
   *   email?: string,
   *   phone?: string,
   *   members?: Array<{ name: string, applying?: boolean }>,
   *   expectedIncome2027?: number | string,
   *   hasSepChecked?: boolean
   * }} reviewExtracted
   * @param {ReturnType<typeof parseCrmNote> & { pass?: number }} targetData
   */
  function auditReviewData(reviewExtracted, targetData) {
    const rev = reviewExtracted || {};
    const tgt = targetData || {};
    const results = [];

    // 1. Coverage county
    if (tgt.county) {
      const actualCounty = normalizeCounty(rev.coverageCounty || '');
      const expectedCounty = normalizeCounty(tgt.county);
      const match = actualCounty && expectedCounty && actualCounty.toLowerCase() === expectedCounty.toLowerCase();
      results.push({
        field: 'Coverage county',
        status: match ? 'ok' : 'error',
        expected: expectedCounty,
        actual: rev.coverageCounty || '(trống)',
        message: match
          ? `Khớp County (${expectedCounty})`
          : `LỆCH COUNTY! Hệ thống đang ghi "${rev.coverageCounty || '(trống)'}" thay vì "${expectedCounty}" (lỗi HealthSherpa lưu 1 lần không nhận — cần Edit Primary contact chọn lại County lần 2).`,
        actionHint: match ? null : 'edit_county'
      });
    }

    // 2. Email
    const revEmail = (rev.email || '').trim();
    const revEmailCheck = isForbiddenEmail(revEmail);
    if (revEmailCheck.forbidden) {
      results.push({
        field: 'Email',
        status: 'error',
        expected: tgt.email || '(email thật của khách)',
        actual: revEmail,
        message: `CẢNH BÁO COMPLIANCE: Email hiện tại là domain bị cấm (${revEmail}). Cần đổi ngay sang email thật của khách sau khi Submit.`,
        actionHint: 'edit_email_pass2'
      });
    } else if (tgt.email) {
      const emailMatch = revEmail.toLowerCase() === tgt.email.toLowerCase();
      const isPass2 = tgt.pass === 2;
      results.push({
        field: 'Email',
        status: emailMatch ? 'ok' : (isPass2 ? 'error' : 'warn'),
        expected: tgt.email,
        actual: revEmail || '(trống)',
        message: emailMatch
          ? `Khớp Email (${tgt.email})`
          : `Email hiện đang là "${revEmail || '(trống)'}" (cần đổi sang "${tgt.email}" ở Lượt 2 sau khi bấm Submit lần đầu).`,
        actionHint: emailMatch ? null : 'edit_email_pass2'
      });
    }

    // 3. Phone
    if (tgt.phoneDigits) {
      const actualDigits = (rev.phone || '').replace(/\D/g, '').replace(/^1(\d{10})$/, '$1');
      const phoneMatch = actualDigits === tgt.phoneDigits;
      results.push({
        field: 'Phone',
        status: phoneMatch ? 'ok' : (tgt.pass === 2 ? 'error' : 'warn'),
        expected: tgt.phone,
        actual: rev.phone || '(trống)',
        message: phoneMatch
          ? `Khớp Phone (${tgt.phone})`
          : `Số Phone hiện đang là "${rev.phone || '(trống)'}" (khác CRM "${tgt.phone}" — đổi ở Lượt 2 nếu bị khóa ở Lượt 1).`,
        actionHint: phoneMatch ? null : 'edit_email_pass2'
      });
    }

    // 4. Home address
    if (tgt.enrolledAddress) {
      const parsedRevHome = parseUSAddress(rev.homeAddress || '');
      const homeMatch = addressesMatch(parsedRevHome, tgt.enrolledAddress);
      results.push({
        field: 'Home address',
        status: homeMatch ? 'ok' : 'error',
        expected: formatAddress(tgt.enrolledAddress),
        actual: rev.homeAddress || '(trống)',
        message: homeMatch
          ? `Khớp Enrolled/Home address`
          : `LỆCH ĐỊA CHỈ THƯỜNG TRÚ! Hiện tại: "${rev.homeAddress || '(trống)'}", cần: "${formatAddress(tgt.enrolledAddress)}".`,
        actionHint: homeMatch ? null : 'edit_address'
      });
    }

    // 5. Mailing address
    const expectedMailing = tgt.sameMailingAsEnrolled ? tgt.enrolledAddress : tgt.mailingAddress;
    if (expectedMailing) {
      const parsedRevMail = parseUSAddress(rev.mailingAddress || '');
      const mailMatch = addressesMatch(parsedRevMail, expectedMailing);
      results.push({
        field: 'Mailing address',
        status: mailMatch ? 'ok' : 'error',
        expected: formatAddress(expectedMailing),
        actual: rev.mailingAddress || '(trống)',
        message: mailMatch
          ? `Khớp Mailing address`
          : `LỆCH MAILING ADDRESS! Hiện tại: "${rev.mailingAddress || '(trống)'}", cần: "${formatAddress(expectedMailing)}".`,
        actionHint: mailMatch ? null : 'edit_address'
      });
    }

    // 6. Expected income 2027
    if (tgt.income !== null && tgt.income !== undefined) {
      const actualInc = parseIncome(String(rev.expectedIncome2027 ?? ''));
      const diff = actualInc !== null ? Math.abs(actualInc - tgt.income) : Infinity;
      const incOk = diff <= 12;
      results.push({
        field: 'Income 2027',
        status: incOk ? 'ok' : 'error',
        expected: `$${tgt.income.toLocaleString('en-US')}`,
        actual: actualInc !== null ? `$${actualInc.toLocaleString('en-US')}` : '(không đọc được)',
        message: incOk
          ? `Khớp Income 2027 ($${actualInc.toLocaleString('en-US')})`
          : `LỆCH INCOME! Hiện tại $${actualInc ?? '?'} khác mục tiêu $${tgt.income.toLocaleString('en-US')}.`,
        actionHint: incOk ? null : 'edit_income'
      });
    }

    // 7. Applying members count
    if (Array.isArray(rev.members) && tgt.applyCount) {
      const applyingMembers = rev.members.filter(m => m.applying !== false);
      const countOk = applyingMembers.length === tgt.applyCount;
      results.push({
        field: 'Thành viên Apply',
        status: countOk ? 'ok' : 'error',
        expected: `${tgt.applyCount} người (${(tgt.members || []).join(' + ')})`,
        actual: `${applyingMembers.length} người (${applyingMembers.map(m => m.name).join(', ')})`,
        message: countOk
          ? `Khớp ${applyingMembers.length} người apply`
          : `LỆCH SỐ NGƯỜI APPLY! Review có ${applyingMembers.length} người, CRM ghi ${tgt.applyCount} người.`,
        actionHint: countOk ? null : 'edit_members'
      });
    }

    // 8. SEP check for Renew 2027
    if (typeof rev.hasSepChecked === 'boolean') {
      results.push({
        field: 'SEP (Renew 2027)',
        status: rev.hasSepChecked ? 'error' : 'ok',
        expected: 'Không tích SEP',
        actual: rev.hasSepChecked ? 'Có mục SEP bị tích!' : 'Không tích SEP',
        message: rev.hasSepChecked
          ? 'CẢNH BÁO: Renew 2027 không cần chọn SEP nhưng bản Review đang có mục SEP được chọn.'
          : 'Chuẩn Renew 2027 (không chọn SEP)',
        actionHint: rev.hasSepChecked ? 'edit_sep' : null
      });
    }

    return results;
  }

  return {
    STATE_MAP,
    FORBIDDEN_EMAIL_DOMAINS,
    isForbiddenEmail,
    normalizeState,
    parseUSAddress,
    formatAddress,
    addressesMatch,
    normalizeCounty,
    parseIncome,
    parsePhone,
    calculateAge,
    splitMemberList,
    parseCrmNote,
    auditReviewData
  };
});
