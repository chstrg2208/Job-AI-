"""
PRE-INDEX CMS QHP 2026 INTO SQLITE FOR ULTRA-FAST (0.01s) APP SEARCH
The Best Rate Insurance
"""

import os, zipfile, io, sqlite3, xml.etree.ElementTree as ET

DATA_DIR = r"C:\Users\PC\.gemini\antigravity\brain\42fb349a-8c5c-4657-8ba5-38f877951f8f\scratch"
ZIP_PATH = os.path.join(DATA_DIR, "py2026_medical.zip")
DB_PATH = r"E:\Job\cms_plans_2026.db"

if os.path.exists(DB_PATH):
    try:
        os.remove(DB_PATH)
    except:
        pass

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Tạo bảng plans
cur.execute("""
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT,
    county TEXT,
    rating_area TEXT,
    metal TEXT,
    issuer TEXT,
    plan_name TEXT,
    plan_type TEXT,
    premium_27 REAL
)
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_state_county ON plans (state, county, metal)")

print("Loading shared strings...")
with zipfile.ZipFile(ZIP_PATH, 'r') as outer_zip:
    xlsx_bytes = outer_zip.read("individual_market_medical.xlsx")

with zipfile.ZipFile(io.BytesIO(xlsx_bytes), 'r') as inner_zip:
    ss_xml = inner_zip.read("xl/sharedStrings.xml")
    root = ET.fromstring(ss_xml)
    shared_strings = []
    for si in root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
        t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
        shared_strings.append(t.text if t is not None else '')

    print("Inserting rows into SQLite database...")
    batch = []
    with inner_zip.open("xl/worksheets/sheet1.xml") as s1:
        for event, elem in ET.iterparse(s1, events=('end',)):
            if elem.tag.endswith('row'):
                r_num = elem.get('r')
                if r_num not in ('1', '2'):
                    row_data = {}
                    for c in elem.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                        r_attr = c.get('r')
                        col = ''.join([ch for ch in r_attr if ch.isalpha()])
                        t_c = c.get('t')
                        vc = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                        valc = shared_strings[int(vc.text)] if (t_c == 's' and vc is not None and vc.text) else (vc.text if vc is not None else '')
                        row_data[col] = valc

                    metal = row_data.get('D')
                    if metal in ('Silver', 'Bronze'):
                        p_str = row_data.get('AB', '').replace('$', '').replace(',', '').strip()
                        try:
                            p = float(p_str)
                            if p > 0:
                                batch.append((
                                    row_data.get('A'),
                                    row_data.get('C'),
                                    row_data.get('K'),
                                    metal,
                                    row_data.get('E'),
                                    row_data.get('H'),
                                    row_data.get('J'),
                                    p
                                ))
                        except ValueError:
                            pass

                    if len(batch) >= 5000:
                        cur.executemany("INSERT INTO plans (state, county, rating_area, metal, issuer, plan_name, plan_type, premium_27) VALUES (?,?,?,?,?,?,?,?)", batch)
                        conn.commit()
                        batch = []
                elem.clear()

    if batch:
        cur.executemany("INSERT INTO plans (state, county, rating_area, metal, issuer, plan_name, plan_type, premium_27) VALUES (?,?,?,?,?,?,?,?)", batch)
        conn.commit()

conn.close()
print("Database created successfully at:", DB_PATH)
