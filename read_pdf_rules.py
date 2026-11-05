import os, zlib, re

pdf_files = [
    r"E:\Job\Quy Trình\19. QUY TRÌNH ĐỔI NPN , Xử Lý hồ sơ bị Other Party - updated 02.2025.pdf",
    r"E:\Job\Quy Trình\24. QUY TRÌNH UNLOCK AOR- updated 05.2025.pdf",
    r"E:\Job\Quy Trình\18 QUY TRÌNH GỬI KHÁCH HÀNG MỚI CHO AGENT - Phong Nguyen - Wendy.pdf",
    r"E:\Job\Quy Trình\Quy trình chuyển Second Change.pdf",
    r"E:\Job\Quy Trình\2. QUY TRÌNH TẠO CONTACT VA DEAL 02-2026w.pdf"
]

def extract_text_from_pdf(fp):
    with open(fp, "rb") as f:
        data = f.read()
    
    text_chunks = []
    # Find all streams
    streams = re.findall(rb'stream\r?\n(.*?)\r?\nendstream', data, re.DOTALL)
    for s in streams:
        decomp = s
        try:
            decomp = zlib.decompress(s)
        except:
            pass
        # find text in parentheses (text) Tj or [(text)] TJ
        matches = re.findall(rb'\((.*?)\)', decomp)
        for m in matches:
            try:
                t = m.decode('utf-8', errors='ignore')
                if len(t) > 2:
                    text_chunks.append(t)
            except:
                pass
    return ' '.join(text_chunks)

for fp in pdf_files:
    if os.path.exists(fp):
        t = extract_text_from_pdf(fp)
        print(f"=== {os.path.basename(fp)} (len: {len(t)}) ===")
        # search keywords
        for kw in ["agent", "ngay", "ngày", "tuần", "tuan", "thời gian", "thoi gian", "consent", "đổi", "doi", "hour", "giờ"]:
            matches = [m.start() for m in re.finditer(kw, t, re.IGNORECASE)]
            if matches:
                print(f"  KW '{kw}': {len(matches)} matches")
        # print snippet
        if len(t) > 0:
            print("  SAMPLE:", t[:300])
