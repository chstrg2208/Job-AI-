'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const P = require('../parser.js');
const D = require('../dom-helpers.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL: ${name}\n  ${err && err.stack ? err.stack : err}`);
  }
}

// 1. Kim Lam exact CRM Note + Email parsing
test('parseCrmNote parses exact Kim Lam CRM note and standalone email', () => {
  const sampleNote = `11/03 Ready to enroll, agent confirm - Renew OB 01/2027

- Plan: Streamlined Silver EPO

- Premium: $55.17
- Effective date: 01.01.2027
- HH 2 A 2 Income $30k
- Apply for member: Kim Lam + William Nguyen
- Enrolled address: 3030 Cheverny Dr, Katy, TX 77493
- Mailing address: 9110 Arvada Bay Ct, Richmond, TX, 77407
- County: Waller County,
- Authorized portal: Jay Ly
lambaokim@gmail.com`;

  const res = P.parseCrmNote(sampleNote);
  assert.strictEqual(res.plan, 'Streamlined Silver EPO');
  assert.strictEqual(res.premium, '$55.17');
  assert.strictEqual(res.effectiveDate, '01.01.2027');
  assert.strictEqual(res.hhSize, 2);
  assert.strictEqual(res.applyCount, 2);
  assert.strictEqual(res.income, 30000);
  assert.deepStrictEqual(res.members, ['Kim Lam', 'William Nguyen']);
  assert.strictEqual(res.county, 'Waller');
  assert.strictEqual(res.authorizedPortal, 'Jay Ly');
  assert.strictEqual(res.email, 'lambaokim@gmail.com');
  assert.strictEqual(res.emailForbidden, false);
  assert.strictEqual(res.sameMailingAsEnrolled, false);

  assert.strictEqual(res.enrolledAddress.street, '3030 Cheverny Dr');
  assert.strictEqual(res.enrolledAddress.city, 'Katy');
  assert.strictEqual(res.enrolledAddress.stateCode, 'TX');
  assert.strictEqual(res.enrolledAddress.stateName, 'Texas');
  assert.strictEqual(res.enrolledAddress.zip, '77493');

  assert.strictEqual(res.mailingAddress.street, '9110 Arvada Bay Ct');
  assert.strictEqual(res.mailingAddress.city, 'Richmond');
  assert.strictEqual(res.mailingAddress.stateCode, 'TX');
  assert.strictEqual(res.mailingAddress.zip, '77407');
});

// 2. Address edge cases & missing Mailing address
test('parseUSAddress handles Apt/Ste, multi-word cities, extra comma before ZIP', () => {
  const a1 = P.parseUSAddress('123 Main St Apt 4B, Sugar Land, TX 77478');
  assert.strictEqual(a1.street, '123 Main St');
  assert.strictEqual(a1.apt, 'Apt 4B');
  assert.strictEqual(a1.city, 'Sugar Land');
  assert.strictEqual(a1.stateCode, 'TX');
  assert.strictEqual(a1.zip, '77478');

  const a2 = P.parseUSAddress('4500 Oak Ave, Suite 200, Fort Worth, TX, 76102');
  assert.strictEqual(a2.street, '4500 Oak Ave');
  assert.strictEqual(a2.apt, 'Suite 200');
  assert.strictEqual(a2.city, 'Fort Worth');
  assert.strictEqual(a2.zip, '76102');

  const noMailing = P.parseCrmNote('Enrolled address: 3030 Cheverny Dr, Katy, TX 77493\nCounty: Waller');
  assert.strictEqual(noMailing.sameMailingAsEnrolled, true);
  assert.strictEqual(noMailing.county, 'Waller');
});

// 3. Forbidden email detection
test('isForbiddenEmail flags company & placeholder domains while allowing real client emails', () => {
  assert.strictEqual(P.isForbiddenEmail('client@tbri.co').forbidden, true);
  assert.strictEqual(P.isForbiddenEmail('abc@ushin.com').forbidden, true);
  assert.strictEqual(P.isForbiddenEmail('x@proton.me').forbidden, true);
  assert.strictEqual(P.isForbiddenEmail('user@b3hgt.com').forbidden, true);
  assert.strictEqual(P.isForbiddenEmail('lambaokim@gmail.com').forbidden, false);
  assert.strictEqual(P.isForbiddenEmail('kimbaolam@outlook.com').forbidden, false);
});

// 4. Age calculation
test('calculateAge accurately separates under-18 child from adult', () => {
  const ref = new Date(2026, 10, 22);
  assert.strictEqual(P.calculateAge('10/15/2022', ref), 4);
  assert.strictEqual(P.calculateAge('01/01/1986', ref), 40);
  assert.strictEqual(P.calculateAge('2022-10-15', ref) < 18, true);
});

// 5. detectStepFromText across all 18 HealthSherpa screens
test('detectStepFromText identifies all 18 screens without collisions', () => {
  const cases = [
    ['Privacy statement Privacy, consent, and the use of your information Store consent outside of HealthSherpa', 'PRIVACY_STATEMENT'],
    ['Primary contact Review this summary to see if any changes are needed Edit this section Continue', 'PRIMARY_REVIEW'],
    ['Primary contact Your information First name Kim Date of birth 01/01/1986 Are you applying for coverage? Social Security Number', 'PRIMARY_YOUR_INFO'],
    ['Primary contact Home address Enter your permanent address Street address Is your mailing address the same as your permanent address?', 'PRIMARY_HOME_ADDRESS'],
    ['Primary contact Contact details Email address Phone number Written language How would you like to get notices about your application?', 'PRIMARY_CONTACT_DETAILS'],
    ['Household Who\'s applying for coverage? Do you want to see if you are eligible for cost savings?', 'HOUSEHOLD_WHOS_APPLYING'],
    ['Medicare Medicare eligibility Are any of these people currently enrolled in Medicare Part A or C, or will be in the next 3 months?', 'HOUSEHOLD_MEDICARE'],
    ['Applicant relationships How is Shayla Nguyen related to Jessica Nguyen?', 'HOUSEHOLD_APPLICANT_RELATIONSHIPS'],
    ['Residence Applicant addresses Does everyone applying for coverage live with you at the following address?', 'HOUSEHOLD_RESIDENCE'],
    ['Household Your tax information Are you married? Do you plan to file a federal income tax return for 2027?', 'HOUSEHOLD_TAX'],
    ['Other family relationships Does Kim Lam live with any other people under 19 who are not already on the application?', 'ADDITIONAL_OTHER_REL'],
    ['Applicants Your Information Primary applicant Have you used tobacco 4 or more times a week? Are you a US citizen or US national? Are you currently incarcerated?', 'MEMBERS_APPLICANT_1'],
    ['Applicants Your Information Primary applicant Is Kim a naturalized or derived citizen? Is Kim pregnant?', 'MEMBERS_APPLICANT_2'],
    ['Income information Current income for Kim Lam Deductions for Kim Lam Yearly income for Kim Lam', 'INCOME'],
    ['Additional questions Extra help Do any of these people have a disability or mental health condition Were any of these people found not eligible for Texas Medicaid', 'EXTRA_HELP'],
    ['Additional questions Existing coverage information Is Kim Lam currently enrolled in health coverage?', 'COVERAGE'],
    ['Employer Sponsored Coverage Will any of these people be offered health coverage through their own job?', 'EMPLOYER_COVERAGE'],
    ['Additional questions Upcoming changes Recent changes Lost qualifying health coverage Got married', 'ADDITIONAL_QUESTIONS_SEP'],
    ['Finalize Take a few minutes to review the information you gave us Coverage county: Harris, TX Household income Basic household questions', 'FINALIZE_REVIEW'],
    ['Finalize Agreements Renewal of eligibility I agree', 'FINALIZE_MANUAL'],
    ['Finalize Tax attestation I must file a federal income tax return for the 2027 tax year', 'FINALIZE_MANUAL'],
    ['Finalize Sign and submit type your full name below to sign electronically', 'FINALIZE_MANUAL']
  ];

  for (const [sample, expected] of cases) {
    assert.strictEqual(D.detectStepFromText(sample, ''), expected, `Expected ${expected} for: ${sample}`);
  }
});

// 6. auditReviewData on Kim Lam Review PDF
test('auditReviewData flags County error (Harris, TX vs Waller) and Email warning on Kim Lam Review', () => {
  const target = P.parseCrmNote(`
- HH 2 A 2 Income $30k
- Apply for member: Kim Lam + William Nguyen
- Enrolled address: 3030 Cheverny Dr, Katy, TX 77493
- Mailing address: 9110 Arvada Bay Ct, Richmond, TX, 77407
- County: Waller County,
lambaokim@gmail.com
`);

  const reviewExtracted = {
    homeAddress: '3030 Cheverny Dr , Katy, TX 77493',
    coverageCounty: 'Harris, TX',
    mailingAddress: '9110 Arvada Bay Ct , Richmond, TX 77407',
    email: 'kimbaolam@outlook.com',
    members: [
      { name: 'Kim Lam', applying: true },
      { name: 'William Nguyen', applying: true }
    ],
    expectedIncome2027: 30000,
    hasSepChecked: false
  };

  const results = P.auditReviewData(reviewExtracted, { ...target, pass: 1 });
  const byField = Object.fromEntries(results.map(r => [r.field, r]));

  assert.strictEqual(byField['Coverage county'].status, 'error');
  assert.strictEqual(byField['Coverage county'].actionHint, 'edit_county');
  assert.strictEqual(byField['Email'].status, 'warn');
  assert.strictEqual(byField['Email'].actionHint, 'edit_email_pass2');
  assert.strictEqual(byField['Home address'].status, 'ok');
  assert.strictEqual(byField['Mailing address'].status, 'ok');
  assert.strictEqual(byField['Income 2027'].status, 'ok');
  assert.strictEqual(byField['Thành viên Apply'].status, 'ok');
  assert.strictEqual(byField['SEP (Renew 2027)'].status, 'ok');
});

// 7. Manifest integrity check
test('manifest.json is valid JSON with required icons and content scripts', () => {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.strictEqual(manifest.manifest_version, 3);
  assert.strictEqual(manifest.content_scripts.length, 2);
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'icons', 'icon16.png')));
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'icons', 'icon48.png')));
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'icons', 'icon128.png')));
});

// 8. shouldPersonApply matching for Primary=No & inline Edit toggle
test('shouldPersonApply matches partial member list accurately', () => {
  const kidsOnly = P.parseCrmNote('- HH 3 A 2 Income $30k\n- Apply for member: SHAYLA NGUYEN + JESSICA NGUYEN');
  assert.strictEqual(P.shouldPersonApply('SHAYLA NGUYEN', kidsOnly), true);
  assert.strictEqual(P.shouldPersonApply('Shayla T Nguyen', kidsOnly), true);
  assert.strictEqual(P.shouldPersonApply('Kim Lam', kidsOnly), false);
});

// 9. Mailing address "same" handling on Quyen Pham note
test('parseCrmNote treats Mailing address: same as sameMailingAsEnrolled === true', () => {
  const note = `11/02 Ready to enroll, agent confirm - Renew OB 01/2027

- Plan: Ambetter Streamlined Silver EPO

- Premium: $24.05
- Effective date: 01.01.2027
- HH 3 A 3 Income $36k
- Apply for member: Quyen Pham + Shayla Nguyen + Jessica Nguyen
- Enrolled address: 6013 Figland St, Pearland, TX 77584
- Mailing address: same
- County: Brazoria County
- Authorized portal: Jay Ly `;

  const res = P.parseCrmNote(note);
  assert.strictEqual(res.sameMailingAsEnrolled, true);
  assert.strictEqual(res.mailingAddress, null);
  assert.strictEqual(res.county, 'Brazoria');
  assert.strictEqual(res.income, 36000);
  assert.strictEqual(res.applyCount, 3);
  assert.strictEqual(res.members.length, 3);
  assert.strictEqual(res.enrolledAddress.street, '6013 Figland St');
  assert.strictEqual(res.enrolledAddress.city, 'Pearland');
  assert.strictEqual(res.enrolledAddress.stateCode, 'TX');
  assert.strictEqual(res.enrolledAddress.zip, '77584');
});

// 10. getAppPageText excludes #tbr-hsp-panel so Who's applying? isn't hijacked by Privacy log text
test('getAppPageText excludes #tbr-hsp-panel and detectStepFromText returns HOUSEHOLD_WHOS_APPLYING', () => {
  const appText = `Household
Who's applying for coverage?
Do you want to see if you are eligible for cost savings?
Yes No
Applying for coverage
Kim Ngoc Thanh Nguyen
Spouse, born 10/19/1999 Applying Edit Remove
Minh N Doan
Child (including adopted children), born 9/21/2026 Applying Edit Remove
+ Add another applicant
Back Continue`;

  const prevDoc = global.document;
  try {
    global.document = {
      body: {
        children: [
          { id: 'root', tagName: 'DIV', innerText: appText },
          { id: 'tbr-hsp-panel', tagName: 'DIV', innerText: '1. Privacy statement\nStore consent outside of HealthSherpa' },
          { id: '', tagName: 'FOOTER', innerText: 'Privacy policy\nTerms' }
        ]
      }
    };
    const extracted = D.getAppPageText();
    assert.ok(!extracted.includes('Store consent outside of HealthSherpa'), 'should exclude #tbr-hsp-panel text');
    assert.strictEqual(D.detectStepFromText(extracted, "Who's applying?"), 'HOUSEHOLD_WHOS_APPLYING');
  } finally {
    if (prevDoc === undefined) delete global.document;
    else global.document = prevDoc;
  }
});

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
