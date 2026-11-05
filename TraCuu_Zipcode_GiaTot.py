"""
CÔNG CỤ TRA CỨU: TỰ ĐỘNG TÍNH APTC & GIÁ THỰC TẾ KHÁCH PHẢI ĐÓNG THEO BANG, H, A, INCOME
The Best Rate Insurance - Phát triển cho Support & Agent
Dữ liệu: CMS Official PY2026 Qualified Health Plan + Bảng FPL 2026 TBR + Census Zipcode Mapping
"""

import os, sys, zipfile, io, csv, xml.etree.ElementTree as ET

DATA_DIR = r"C:\Users\PC\.gemini\antigravity\brain\42fb349a-8c5c-4657-8ba5-38f877951f8f\scratch"
ZIP_PATH = os.path.join(DATA_DIR, "py2026_medical.zip")
GEO_PATH = os.path.join(DATA_DIR, "geo-data.csv")

# BẢNG FPL 2026 CHUẨN CỦA THE BEST RATE INSURANCE (48 BANG NỘI ĐỊA)
FPL_100_2026 = {
    1: 15650, 2: 21150, 3: 26650, 4: 32150,
    5: 37650, 6: 43150, 7: 48650, 8: 54150
}

def get_applicable_percentage(pct_fpl):
    """
    Tính tỷ lệ đóng góp tối đa (Expected Contribution %) theo luật ACA / IRA:
    - Dưới hoặc bằng 150% FPL: 0.0% (Chính phủ tài trợ 100% gói Benchmark)
    - 150% - 200% FPL: từ 0.0% đến 2.0%
    - 200% - 250% FPL: từ 2.0% đến 4.0%
    - 250% - 300% FPL: từ 4.0% đến 6.0%
    - 300% - 400% FPL: từ 6.0% đến 8.5%
    - Trên 400% FPL: trần tối đa 8.5%
    """
    if pct_fpl <= 150.0:
        return 0.0
    elif pct_fpl <= 200.0:
        return 0.0 + (pct_fpl - 150.0) / (200.0 - 150.0) * 0.02
    elif pct_fpl <= 250.0:
        return 0.02 + (pct_fpl - 200.0) / (250.0 - 200.0) * 0.02
    elif pct_fpl <= 300.0:
        return 0.04 + (pct_fpl - 250.0) / (300.0 - 250.0) * 0.02
    elif pct_fpl <= 400.0:
        return 0.06 + (pct_fpl - 300.0) / (400.0 - 300.0) * 0.025
    else:
        return 0.085

def load_zip_mapping(target_state):
    county_zips = {}
    if not os.path.exists(GEO_PATH):
        return county_zips

    with open(GEO_PATH, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['state_abbr'].strip().upper() == target_state:
                cty = row['county'].strip().lower()
                zipc = row['zipcode'].strip()
                city = row['city'].strip()
                
                if cty not in county_zips:
                    county_zips[cty] = {'zips': [], 'cities': set()}
                county_zips[cty]['zips'].append(zipc)
                county_zips[cty]['cities'].add(city)
    return county_zips

def run_query(target_state='TX', h=1, a=1, income=None, top_n=15):
    target_state = target_state.strip().upper()

    has_client_info = (income is not None and income > 0)
    
    # 1. Tính toán FPL & Expected Contribution nếu có thông tin khách
    pct_fpl = 0.0
    monthly_expected_contrib = 0.0
    csr_status = "N/A"
    
    if has_client_info:
        base_100 = FPL_100_2026.get(h, 54150 + (h - 8) * 5500)
        pct_fpl = (income / base_100) * 100.0
        applicable_pct = get_applicable_percentage(pct_fpl)
        monthly_expected_contrib = (income * applicable_pct) / 12.0
        
        if pct_fpl <= 150.0:
            csr_status = "🌟 Khung Vàng CSR 94% (Max Trợ Giá)"
        elif pct_fpl <= 200.0:
            csr_status = "👍 CSR 87%"
        elif pct_fpl <= 250.0:
            csr_status = "ℹ️ CSR 73%"
        elif pct_fpl <= 400.0:
            csr_status = "Standard (Hết CSR, còn APTC)"
        else:
            csr_status = "Trần >400% FPL"

    print("\n" + "="*125)
    print(f"🔥 BẢNG TRA CỨU ZIPCODE & GIÁ THỰC TẾ KHÁCH TRẢ TẠI BANG: {target_state}")
    if has_client_info:
        print(f"📋 THÔNG TIN KHÁCH: Hộ H{h} | Mua bảo hiểm: A{a} | Thu nhập (Income): ${income:,.2f}/năm")
        print(f"📊 PHÂN TÍCH FPL: {pct_fpl:.1f}% FPL -> {csr_status} | Mức đóng góp tối thiểu: ${monthly_expected_contrib:.2f}/tháng")
    else:
        print("📌 Chế độ xem: Bảng giá gốc (Chưa nhập H, A, Income)")
    print("="*125 + "\n")

    if not os.path.exists(ZIP_PATH):
        print(f"❌ Lỗi: Không tìm thấy file dữ liệu CMS tại {ZIP_PATH}")
        return

    county_zip_map = load_zip_mapping(target_state)

    # 2. Đọc dữ liệu CMS Plan
    with zipfile.ZipFile(ZIP_PATH, 'r') as outer_zip:
        xlsx_bytes = outer_zip.read("individual_market_medical.xlsx")

    with zipfile.ZipFile(io.BytesIO(xlsx_bytes), 'r') as inner_zip:
        ss_xml = inner_zip.read("xl/sharedStrings.xml")
        root = ET.fromstring(ss_xml)
        shared_strings = []
        for si in root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            shared_strings.append(t.text if t is not None else '')

        county_plans = {}
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
                            if val == target_state:
                                row_data = {}
                                for c in elem.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                                    r_attr = c.get('r')
                                    col = ''.join([ch for ch in r_attr if ch.isalpha()])
                                    t_c = c.get('t')
                                    vc = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                                    valc = shared_strings[int(vc.text)] if (t_c == 's' and vc is not None and vc.text) else (vc.text if vc is not None else '')
                                    row_data[col] = valc
                                
                                cty = row_data.get('C')
                                metal = row_data.get('D')
                                if metal in ('Silver', 'Bronze'):
                                    p_str = row_data.get('AB', '').replace('$', '').replace(',', '').strip()
                                    try:
                                        p = float(p_str)
                                        if p > 0:
                                            if cty not in county_plans:
                                                county_plans[cty] = {'Silver': [], 'Bronze': [], 'rating_area': row_data.get('K')}
                                            county_plans[cty][metal].append({
                                                'issuer': row_data.get('E'),
                                                'plan': row_data.get('H'),
                                                'premium': p
                                            })
                                    except ValueError:
                                        pass
                    elem.clear()

    if not county_plans:
        print(f"⚠️ Không tìm thấy dữ liệu cho bang '{target_state}' trong file FFM của CMS.")
        return

    # 3. Tính toán APTC và Net Premium cho từng County
    ranking = []
    for cty, metals in county_plans.items():
        silvers = sorted(metals['Silver'], key=lambda x: x['premium'])
        bronzes = sorted(metals['Bronze'], key=lambda x: x['premium'])
        
        if silvers:
            best_silver = silvers[0]
            best_bronze = bronzes[0] if bronzes else None
            
            # Tìm SLCSP (Second Lowest Cost Silver Plan) tại County đó
            unique_silver_rates = sorted(list(set(s['premium'] for s in silvers)))
            slcsp_rate = unique_silver_rates[1] if len(unique_silver_rates) > 1 else unique_silver_rates[0]
            
            # Tính APTC cho số người A
            monthly_benchmark = slcsp_rate * a
            aptc = max(0.0, monthly_benchmark - monthly_expected_contrib) if has_client_info else 0.0
            
            # Tính giá thực tế khách phải trả
            net_silver = max(0.0, (best_silver['premium'] * a) - aptc) if has_client_info else best_silver['premium']
            net_bronze = max(0.0, (best_bronze['premium'] * a) - aptc) if (has_client_info and best_bronze) else (best_bronze['premium'] if best_bronze else 0.0)
            
            cty_clean = cty.replace(' County', '').strip().lower()
            geo_info = county_zip_map.get(cty_clean)
            
            sample_zips = []
            cities_str = ""
            if geo_info:
                sample_zips = geo_info['zips'][:4]
                top_cities = sorted(list(geo_info['cities']))[:2]
                cities_str = " / ".join(top_cities)
            
            ranking.append({
                'county': cty,
                'city': cities_str,
                'sample_zips': sample_zips,
                'total_zips': len(geo_info['zips']) if geo_info else 0,
                'best_silver_issuer': best_silver['issuer'],
                'base_silver': best_silver['premium'] * a,
                'slcsp': slcsp_rate * a,
                'aptc': aptc,
                'net_silver': net_silver,
                'best_bronze_issuer': best_bronze['issuer'] if best_bronze else "N/A",
                'net_bronze': net_bronze
            })

    # Sắp xếp theo giá Silver khách phải trả (Net Silver) trước, sau đó đến giá gốc
    ranking.sort(key=lambda x: (x['net_silver'], x['base_silver']))

    # 4. Hiển thị bảng kết quả
    if has_client_info:
        print(f"{'HẠNG':<5} | {'THÀNH PHỐ & QUẬN':<26} | {'ZIPCODE TIÊU BIỂU':<22} | {'HÃNG SILVER ĐỨNG ĐẦU':<24} | {'TRỢ GIÁ APTC':<14} | {'KHÁCH TRẢ (SILVER)':<19} | {'KHÁCH TRẢ (BRONZE)'}")
        print("-" * 135)
        for i, item in enumerate(ranking[:top_n], 1):
            city_cty = f"{item['city'][:12]} ({item['county']})" if item['city'] else item['county']
            zip_display = ", ".join(item['sample_zips'][:3])
            if item['total_zips'] > 3:
                zip_display += f" (+{item['total_zips']-3})"
            
            issuer = item['best_silver_issuer'][:22]
            aptc_str = f"+${item['aptc']:,.2f}/tháng"
            
            # Format làm nổi bật $0.00
            net_s_str = f"⭐️ ${item['net_silver']:.2f}/tháng" if item['net_silver'] == 0 else f"${item['net_silver']:.2f}/tháng"
            net_b_str = f"⭐️ ${item['net_bronze']:.2f}/tháng" if item['net_bronze'] == 0 else f"${item['net_bronze']:.2f}/tháng"
            
            print(f"#{i:<4} | {city_cty[:26]:<26} | {zip_display:<22} | {issuer:<24} | {aptc_str:<14} | {net_s_str:<19} | {net_b_str}")
    else:
        print(f"{'HẠNG':<5} | {'THÀNH PHỐ & QUẬN':<28} | {'CÁC ZIPCODE TIÊU BIỂU':<26} | {'HÃNG SILVER RẺ NHẤT':<28} | {'GIÁ GỐC'}")
        print("-" * 115)
        for i, item in enumerate(ranking[:top_n], 1):
            city_cty = f"{item['city'][:14]} ({item['county']})" if item['city'] else item['county']
            zip_display = ", ".join(item['sample_zips'][:3])
            if item['total_zips'] > 3:
                zip_display += f" (+{item['total_zips']-3})"
            issuer = item['best_silver_issuer'][:26]
            price = f"${item['base_silver']:.2f}/tháng"
            print(f"#{i:<4} | {city_cty[:28]:<28} | {zip_display:<26} | {issuer:<28} | {price}")

    print("\n" + "="*125)

if __name__ == "__main__":
    # Cú pháp: python TraCuu_Zipcode_GiaTot.py <BANG> [H] [A] [INCOME]
    st = sys.argv[1] if len(sys.argv) > 1 else 'TX'
    h = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    a = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    income = float(sys.argv[4]) if len(sys.argv) > 4 else None

    run_query(st, h, a, income)
