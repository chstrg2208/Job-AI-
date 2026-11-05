import os, glob, re

# Let's inspect "18 QUY TRÌNH GỬI KHÁCH HÀNG MỚI CHO AGENT - Phong Nguyen - Wendy.pdf"
# and "19. QUY TRÌNH ĐỔI NPN , Xử Lý hồ sơ bị Other Party - updated 02.2025.pdf"
# and "20. QUY TRÌNH HỖ TRỢ AGENT Phong Nguyen-Wendy.pdf"
# and "Quy trình chuyển Second Change.pdf"

# Let's use PowerShell's built-in or pdftotext if available or regex on text strings
# Let's write a python script that searches all strings in all files in E:\Job\Quy Trình
for root, dirs, files in os.walk(r"E:\Job\Quy Trình"):
    for f in files:
        fp = os.path.join(root, f)
        try:
            with open(fp, "rb") as fl:
                data = fl.read()
            # search for patterns like 'agent' and 'ngay' or 'tuan' or 'gio'
            # let's find occurrences of b'agent'
            for m in re.finditer(rb'agent', data, re.IGNORECASE):
                chunk = data[max(0, m.start()-100):min(len(data), m.end()+200)]
                clean = ''.join(chr(b) if 32 <= b <= 126 else ' ' for b in chunk)
                if any(w in clean.lower() for w in ['tuan', 'week', 'hour', 'gio', 'day', 'ngay', '48', '24', '72', 'han']):
                    print(f"[{f}] {clean}")
                    print("-" * 40)
        except:
            pass
