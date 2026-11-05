import zlib, re

fp = r"E:\Job\Quy Trình\19. QUY TRÌNH ĐỔI NPN , Xử Lý hồ sơ bị Other Party - updated 02.2025.pdf"
with open(fp, "rb") as f:
    data = f.read()

streams = re.findall(rb'stream\r?\n(.*?)\r?\nendstream', data, re.DOTALL)
full_text = []
for s in streams:
    try:
        decomp = zlib.decompress(s)
        # extract words
        matches = re.findall(rb'\((.*?)\)', decomp)
        for m in matches:
            t = m.decode('utf-8', errors='ignore')
            if len(t) > 1 and not t.startswith('en-'):
                full_text.append(t)
    except:
        pass

content = ' '.join(full_text)
# clean spaces
content = re.sub(r'\s+', ' ', content)
print("Total length:", len(content))
# print chunks of 500 chars
for i in range(0, min(len(content), 4000), 500):
    print(f"--- Chunk {i} ---")
    print(content[i:i+500])
