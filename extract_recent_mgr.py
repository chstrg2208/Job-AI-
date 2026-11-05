import os, glob, re, html

LEVELDB_DIR = r"C:\Users\PC\AppData\Roaming\RingCentral\IndexedDB\https_app.ringcentral.com_0.indexeddb.leveldb"
target_files = [os.path.join(LEVELDB_DIR, f) for f in ["027469.ldb", "027468.ldb", "027471.ldb", "027460.ldb"]]

pattern = re.compile(rb'text\"[\x00-\xff]{1,3}([\x20-\x7E\xC2-\xF4\x80-\xBF]{8,1500})\"')

for fpath in target_files:
    if not os.path.exists(fpath):
        continue
    with open(fpath, "rb") as f:
        data = f.read()
    print(f"=== File: {os.path.basename(fpath)} ===")
    for m in pattern.finditer(data):
        raw = m.group(1).decode('utf-8', errors='ignore')
        clean = html.unescape(re.sub(r'<[^>]+>', ' ', raw)).strip()
        clean = re.sub(r'\s+', ' ', clean)
        
        ctx = data[max(0, m.start()-500):min(len(data), m.end()+500)].decode('utf-8', errors='ignore')
        
        # Check if relevant to meeting, renew, OT, or manager group
        keywords = ["meeting", "OT", "Oanh", "renew", "simply enroll", "PTD", "4h 30", "thang 10", "Manager"]
        if any(k.lower() in clean.lower() for k in keywords) or "Manager Team" in ctx:
            print("---")
            print("MSG:", clean)
            # Find sender or group names near ctx
            names = re.findall(r'\"(?:name|creatorName|author|firstName|lastName|groupName|displayName)\"\:\"([^\"]+)\"', ctx)
            print("CONTEXT NAMES:", names[:5])
