"""
CÔNG CỤ TEST & TRA CỨU HỒ SƠ OBAMACARE 2026 (FPL + H/A + CARRIER MATRIX)
The Best Rate Insurance - Phát triển cho Support & Agent
"""

import os, sys, zipfile, io, xml.etree.ElementTree as ET

ZIP_PATH = r"C:\Users\PC\.gemini\antigravity\brain\42fb349a-8c5c-4657-8ba5-38f877951f8f\scratch\py2026_medical.zip"

# BẢNG FPL 2026 THE BEST RATE INSURANCE (48 STATES)
FPL_GUIDELINES_2026 = {
    1: {'100': 15650, '138': 21597, '150': 23475, '200': 31300, '250': 39125, '300': 46950, '400': 62600},
    2: {'100': 21150, '138': 29187, '150': 31725, '200': 42300, '250': 52875, '300': 63450, '400': 84600},
    3: {'100': 26650, '138': 36777, '150': 39975, '200': 53300, '250': 66625, '300': 79950, '400': 106600},
    4: {'100': 32150, '138': 44367, '150': 48225, '200': 64300, '250': 80375, '300': 96450, '400': 128600},
    5: {'100': 37650, '138': 51957, '150': 56475, '200': 75300, '250': 94125, '300': 112950, '400': 150600},
    6: {'100': 43150, '138': 59547, '150': 64725, '200': 86300, '250': 107875, '300': 129450, '400': 172600},
    7: {'100': 48650, '138': 67137, '150': 72975, '200': 97300, '250': 121625, '300': 145950, '400': 194600},
    8: {'100': 54150, '138': 74727, '150': 81225, '200': 108300, '250': 135375, '300': 162450, '400': 216600},
}

# Các bang KHÔNG mở rộng Medicaid (Non-expansion): 100% - 150% FPL là được ACA Silver CSR 94%
NON_EXPANSION_STATES = {'TX', 'FL', 'GA', 'MS', 'AL', 'SC', 'TN', 'WY', 'KS', 'WI'}

ZIP_SAMPLE_MAPPING = {
    'TX': {
        'Harris': 'Houston (77001 - 77099)',
        'Dallas': 'Dallas / Garland / Irving (75201 - 75287)',
        'Tarrant': 'Fort Worth / Arlington (76101 - 76199)',
        'Travis': 'Austin (78701 - 78799)',
        'Bexar': 'San Antonio (78201 - 78299)',
        'Fort Bend': 'Sugar Land / Richmond (77478 - 77479)',
        'Collin': 'Plano / Frisco (75023 - 75075)'
    },
    'IN': {
        'Marion': 'Indianapolis (46201 - 46299)',
        'Lake': 'Gary / Hammond (46401 - 46327)',
        'Allen': 'Fort Wayne (46801 - 46899)'
    }
}

def evaluate_fpl(state, h, a, income):
    state = state.upper()
    fpl_row = FPL_GUIDELINES_2026.get(h)
    if not fpl_row:
        base_100 = 54150 + (h - 8) * 5500
        pct = (income / base_100) * 100
    else:
        base_100 = fpl_row['100']
        pct = (income / base_100) * 100

    is_non_expansion = state in NON_EXPANSION_STATES
    medicaid_risk = False
    csr_tier = None
    status_msg = ""

    if pct < 100:
        if is_non_expansion:
            status_msg = f"❌ Dưới 100% FPL ({pct:.1f}%): Rơi vào Medicaid Gap tại bang {state} (KHÔNG có trợ cấp ACA)."
        else:
            status_msg = f"⚠️ Dưới 100% FPL ({pct:.1f}%): Bị chuyển sang Medicaid người lớn tại bang {state}."
            medicaid_risk = True
    elif 100 <= pct < 138:
        if is_non_expansion:
            status_msg = f"✅ ĐẠT KHUNG VÀNG MAX CSR 94% ({pct:.1f}% FPL): Gói Silver $0/tháng, Deductible $0, Copay $0! (Do {state} là bang Non-expansion)."
            csr_tier = "Silver CSR 94%"
        else:
            status_msg = f"⚠️ BỊ CHUYỂN MEDICAID ({pct:.1f}% FPL): Bang {state} có mở rộng Medicaid (ngưỡng 138%). Cần tăng thu nhập lên trên 138% để mua ACA!"
            medicaid_risk = True
    elif 138 <= pct <= 150:
        status_msg = f"🌟 ĐẠT KHUNG VÀNG TỐI ĐA CSR 94% ({pct:.1f}% FPL): Hưởng Silver $0/tháng, Deductible $0, Copay $0 toàn quốc!"
        csr_tier = "Silver CSR 94%"
    elif 150 < pct <= 200:
        status_msg = f"👍 ĐẠT KHUNG CSR 87% ({pct:.1f}% FPL): Gói Silver giá siêu rẻ ($0 - $20/tháng), Deductible thấp."
        csr_tier = "Silver CSR 87%"
    elif 200 < pct <= 250:
        status_msg = f"ℹ️ ĐẠT KHUNG CSR 73% ({pct:.1f}% FPL): Vẫn được giảm Deductible gói Silver."
        csr_tier = "Silver CSR 73%"
    elif 250 < pct <= 400:
        status_msg = f"ℹ️ HƯỞNG TRỢ GIÁ APTC THƯỜNG ({pct:.1f}% FPL): Được giảm phí hàng tháng, nhưng không còn giảm Deductible (hết hạn CSR)."
        csr_tier = "Standard (Không CSR)"
    else:
        status_msg = f"⚠️ VƯỢT TRẦN 400% FPL ({pct:.1f}% FPL): Trợ cấp bị giảm mạnh hoặc không được trợ cấp."
        csr_tier = "Vượt trần 400%"

    return pct, csr_tier, status_msg, medicaid_risk

def query_carrier_matrix(state, target_county=None):
    state = state.upper()
    if not os.path.exists(ZIP_PATH):
        return None

    with zipfile.ZipFile(ZIP_PATH, 'r') as outer_zip:
        xlsx_bytes = outer_zip.read("individual_market_medical.xlsx")

    with zipfile.ZipFile(io.BytesIO(xlsx_bytes), 'r') as inner_zip:
        ss_xml = inner_zip.read("xl/sharedStrings.xml")
        root = ET.fromstring(ss_xml)
        shared_strings = []
        for si in root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            shared_strings.append(t.text if t is not None else '')

        plans_by_county = {}
        with inner_zip.open("xl/worksheets/sheet1.xml") as s1:
            for event, elem in ET.iterparse(s1, events=('end',)):
                if elem.tag.endswith('row'):
                    r_num = elem.get('r')
                    if r_num not in ('1', '2'):
                        c_a = elem.find(f'{{http://schemas.openxmlformats.org/spreadsheetml/2006/main}}c[@r="A{r_num}"]')
                        if c_a is not None:
                            t_attr = c_a.get('t')
                            v = c_a.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                            val = shared_strings[int(v.text)] if (t_attr == 's' and v is not None and v.text) else (v.text if v is not None else '')
                            if val == state:
                                row_data = {}
                                for c in elem.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                                    r_attr = c.get('r')
                                    col = ''.join([ch for ch in r_attr if ch.isalpha()])
                                    t_c = c.get('t')
                                    vc = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                                    valc = shared_strings[int(vc.text)] if (t_c == 's' and vc is not None and vc.text) else (vc.text if vc is not None else '')
                                    row_data[col] = valc
                                
                                cty = row_data.get('C')
                                if target_county and target_county.lower() not in cty.lower():
                                    elem.clear()
                                    continue
                                
                                metal = row_data.get('D')
                                if metal in ('Silver', 'Bronze'):
                                    p_str = row_data.get('AB', '').replace('$', '').replace(',', '').strip()
                                    try:
                                        p = float(p_str)
                                        if p > 0:
                                            if cty not in plans_by_county:
                                                plans_by_county[cty] = {'Silver': [], 'Bronze': []}
                                            plans_by_county[cty][metal].append({
                                                'issuer': row_data.get('E'),
                                                'plan': row_data.get('H'),
                                                'premium': p
                                            })
                                    except ValueError:
                                        pass
                    elem.clear()
    return plans_by_county

def run_test(state='TX', h=1, a=1, income=22100, county='Harris'):
    pct, csr_tier, status_msg, medicaid_risk = evaluate_fpl(state, h, a, income)
    
    print("\n" + "="*80)
    print(f"🎯 KẾT QUẢ TEST HỒ SƠ OBAMACARE 2026:")
    print(f"• Tiểu bang: {state.upper()} | Hộ: H{h} (Household) | Mua bảo hiểm: A{a} (Applying)")
    print(f"• Thu nhập khai báo (Income): ${income:,.2f}/năm")
    print("="*80)
    print(f"📊 1. PHÂN TÍCH CHUẨN NGHÈO (FPL CHECK):")
    print(f"   - Tỷ lệ % FPL: {pct:.1f}%")
    print(f"   - Quyền lợi CSR: {csr_tier if csr_tier else 'Không đủ điều kiện'}")
    print(f"   - Đánh giá: {status_msg}")
    print(f"\n🏢 2. TRA CỨU HÃNG BẢO HIỂM TỐT NHẤT TẠI KHU VỰC ({county if county else 'Toàn Bang'}):")

    plans = query_carrier_matrix(state, county)
    if plans:
        for cty, metals in plans.items():
            silvers = sorted(metals['Silver'], key=lambda x: x['premium'])
            bronzes = sorted(metals['Bronze'], key=lambda x: x['premium'])
            print(f"\n   📍 Quận: {cty}")
            if silvers:
                print(f"   🏆 Hãng đứng đầu gói Silver (Cơ hội $0 CSR cao nhất):")
                for s in silvers[:3]:
                    print(f"      • {s['issuer']}: {s['plan']} (Base: ${s['premium']:.2f}/tháng)")
            if bronzes:
                print(f"   🥉 Hãng đứng đầu gói Bronze (Base rẻ nhất):")
                for b in bronzes[:2]:
                    print(f"      • {b['issuer']}: {b['plan']} (Base: ${b['premium']:.2f}/tháng)")
    else:
        print(f"   (Không tìm thấy dữ liệu cho quận {county} hoặc bang {state} thuộc nhóm SBM).")
    print("\n" + "="*80)

if __name__ == "__main__":
    if len(sys.argv) >= 5:
        st = sys.argv[1]
        h = int(sys.argv[2])
        a = int(sys.argv[3])
        inc = float(sys.argv[4])
        cty = sys.argv[5] if len(sys.argv) > 5 else None
        run_test(st, h, a, inc, cty)
    else:
        # Chạy test mẫu mặc định (Case Huy Dinh Tran: TX, H1, A1, $22,100, Harris)
        run_test('TX', 1, 1, 22100, 'Harris')
