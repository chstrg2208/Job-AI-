const fs = require('fs');

const raw = fs.readFileSync('E:/Job/florida_blue_hoa_dao_aptc_loss.csv', 'utf8').trim().split('\n');
const headers = raw[0].split(',');
const rows = raw.slice(1).map(line => {
  const cols = line.split(',');
  return {
    lastName: cols[0],
    firstName: cols[1],
    fullName: cols[1] + ' ' + cols[0],
    dob: cols[2],
    email: cols[3],
    mobile: cols[4],
    phone: cols[5],
    planName: cols[6],
    contractId: cols[7],
    memberCount: parseInt(cols[8] || '1'),
    effectiveDate: cols[9],
    expDate: cols[10],
    currentAptc: parseFloat(cols[14] || '0'),
    futureAptc: parseFloat(cols[15] || '0'),
    diffAptc: parseFloat(cols[16] || '0'),
    agentName: cols[17],
    npn: cols[19]
  };
});

console.log('Total records:', rows.length);

const lost100 = rows.filter(r => r.futureAptc === 0);
const reducedPartial = rows.filter(r => r.futureAptc > 0 && r.diffAptc < 0);
const increased = rows.filter(r => r.diffAptc > 0);
const unchanged = rows.filter(r => r.diffAptc === 0);

console.log('--- PHÂN LOẠI APTC 2026 -> 2027 ---');
console.log('Mất trắng 100% APTC (Future = $0):', lost100.length);
console.log('Bị giảm một phần (Future > 0 & Diff < 0):', reducedPartial.length);
console.log('Được tăng APTC (Diff > 0):', increased.length);
console.log('Không đổi (Diff = 0):', unchanged.length);

console.log('\n--- DANH SÁCH 13 CA MẤT TRẮNG 100% APTC (KHẨN CẤP NHẤT) ---');
lost100.forEach((r, idx) => {
  console.log(`${idx+1}. ${r.fullName} | DOB: ${r.dob} | Phone: ${r.mobile || r.phone} | Plan: ${r.planName} | Current APTC: $${r.currentAptc} -> Future: $0 (Mất -$${r.currentAptc})`);
});

console.log('\n--- DANH SÁCH BỊ GIẢM MỘT PHẦN (DIFF < 0) ---');
reducedPartial.forEach((r, idx) => {
  console.log(`${idx+1}. ${r.fullName} | Phone: ${r.mobile || r.phone} | Current: $${r.currentAptc} -> Future: $${r.futureAptc} (Giảm -$${Math.abs(r.diffAptc)})`);
});

// Match with Team Tiger deals
const dealsJson = JSON.parse(fs.readFileSync('E:/Job/crm_team_tiger_all_deals.json', 'utf8'));
const matchedDeals = [];
for (const r of rows) {
  const match = dealsJson.allDeals.find(d => {
    const dName = (d.clientName || d.name || '').toLowerCase();
    const fName = r.firstName.toLowerCase();
    const lName = r.lastName.toLowerCase();
    return dName.includes(fName) && dName.includes(lName);
  });
  if (match) {
    matchedDeals.push({ subscriber: r.fullName, dealId: match.id, dealCode: match.code, dealName: match.name, owner: match.dealOwner, support: match.supportAgent, stage: match.stageName, diffAptc: r.diffAptc, futureAptc: r.futureAptc, phone: r.mobile || r.phone });
  }
}

console.log('\n--- ĐỐI SOÁT VỚI TEAM TIGER ---');
console.log('Số hồ sơ match trong Team Tiger CRM:', matchedDeals.length);
matchedDeals.forEach(m => console.log(`- ${m.subscriber} | Code: ${m.dealCode} | Support: ${m.support} | Owner: ${m.owner} | Stage: ${m.stage} | Diff: $${m.diffAptc} (Future: $${m.futureAptc})`));
