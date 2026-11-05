import zlib, re, glob

def check_pdf(fp):
    with open(fp, "rb") as f:
        data = f.read()
    streams = re.findall(rb'stream\r?\n(.*?)\r?\nendstream', data, re.DOTALL)
    full_text = []
    for s in streams:
        try:
            decomp = zlib.decompress(s)
            matches = re.findall(rb'\((.*?)\)', decomp)
            for m in matches:
                t = m.decode('utf-8', errors='ignore')
                if len(t) > 1 and not t.startswith('en-'):
                    full_text.append(t)
        except:
            pass
    content = ' '.join(full_text)
    content = re.sub(r'\s+', ' ', content)
    return content

for fp in glob.glob(r"E:\Job\Quy Trình\*.pdf"):
    txt = check_pdf(fp)
    # search for agent and time
    for m in re.finditer(r'(?:agent\s+cũ|đổi\s+agent|thời\s+gian|kéo\s+về|consent)', txt, re.IGNORECASE):
        start = max(0, m.start()-100)
        end = min(len(txt), m.end()+250)
        chunk = txt[start:end]
        if any(w in chunk.lower() for w in ['ngày', 'ngay', 'tuần', 'tuan', 'giờ', 'hour', 'day', 'hạn', 'deadline', 'thông báo', 'thong bao']):
            print(f"[{os.path.basename(fp)}] {chunk}")
            print("-"*50)
