"""Ảnh thu nhỏ cho thẻ bài (thumbnail) — giảm dung lượng trang chủ/hub/sidebar.

Thẻ bài trước đây tải nguyên ảnh gốc 1200–1920px (200–660 KB) cho khung chỉ 76–400px.
Script này:
  1. Tìm <img src="/assets/img/..."> NGOÀI thân bài (thẻ bài, sidebar, bảng xếp hạng...) và
     dữ liệu ảnh thẻ trong JS (img:'...' ở rankings/reviews, search.js).
  2. Tạo bản WebP:  /assets/img/_t/<đường-dẫn-gốc>.webp  (rộng tối đa 640px, thẻ thường)
                    /assets/img/_s/<đường-dẫn-gốc>.webp  (rộng tối đa 240px, ảnh nhỏ ≤160px)
  3. Đổi src sang bản thu nhỏ. Ảnh đầu bài (hero), ảnh trong thân bài, og:image giữ ảnh gốc.
Bản thu nhỏ chưa có (ảnh mới tải lên sau lần chạy) -> worker/index.js chuyển hướng về ảnh gốc.

Chạy lại sau khi đăng bài mới:  python scripts/build-thumbs.py --write
"""
import glob, io, os, re, subprocess, sys
from PIL import Image

WRITE = '--write' in sys.argv
EXT = ('.jpg', '.jpeg', '.png', '.webp', '.jfif')
SIZES = {'_t': 640, '_s': 240}

def load(p): return io.open(p, encoding='utf-8', newline='').read()
def save(p, s): io.open(p, 'w', encoding='utf-8', newline='').write(s)

def thumb_url(src, kind):
    path = src.split('?')[0]
    if not path.startswith('/assets/img/') or path.startswith(('/assets/img/_t/', '/assets/img/_s/', '/assets/img/brand/')):
        return None
    if not path.lower().endswith(EXT) or not os.path.isfile(path.lstrip('/')):
        return None
    return f'/assets/img/{kind}/' + path[len('/assets/img/'):] + '.webp'

needed = {}  # url thu nhỏ -> (file gốc, bề rộng tối đa)
def want(src, kind):
    u = thumb_url(src, kind)
    if u: needed[u] = (src.split('?')[0].lstrip('/'), SIZES[kind])
    return u

IMG = re.compile(r'<img\b[^>]*>')
def rewrite_tags(chunk):
    def fix(m):
        tag = m.group(0)
        sm = re.search(r'\ssrc="([^"]+)"', tag)
        if not sm: return tag
        w = re.search(r'\swidth="(\d+)"', tag); h = re.search(r'\sheight="(\d+)"', tag)
        small = (w and int(w.group(1)) <= 160) and (not h or int(h.group(1)) <= 160)
        u = want(sm.group(1), '_s' if small else '_t')
        return tag.replace(sm.group(0), f' src="{u}"', 1) if u else tag
    return IMG.sub(fix, chunk)

pages = [f for f in subprocess.run(['git', 'ls-files', '*.html'], capture_output=True, text=True).stdout.split()
         if not f.startswith(('templates/', 'docs/', 'src/')) and f not in ('admin.html',)]
changed = 0
for f in pages:
    s0 = load(f)
    # Giữ nguyên: thân bài (ảnh nội dung) và ảnh hero/figure đầu bài
    parts = re.split(r'(<article class="art-body"[\s\S]*?</article>|<figure class="art-hero"[\s\S]*?</figure>)', s0)
    s = ''.join(p if i % 2 else rewrite_tags(p) for i, p in enumerate(parts))
    # Dữ liệu thẻ trong JS (img:'/assets/img/..'): admin đọc/ghi lại các khối dữ liệu này nên
    # KHÔNG đổi URL ở đây; trang tự đổi lúc vẽ thẻ bằng hàm otThumb(). Chỉ cần tạo sẵn ảnh.
    for m in re.finditer(r"""\bimg:\s*['"](/assets/img/[^'"]+)['"]""", s):
        want(m.group(1), '_t'); want(m.group(1), '_s')
    if s != s0:
        changed += 1
        if WRITE: save(f, s)

# Lưu ý: KHÔNG đổi assets/search.js — admin đọc trường img trong đó làm ảnh đầu bài (Hero).
# Ảnh hồ sơ (assets/catalog.json): trang hồ sơ dùng bản _s cho thẻ gợi ý/bài liên quan
for m in re.finditer(r'"img":\s*"(/assets/img/[^"]+)"', load('assets/catalog.json')):
    want(m.group(1), '_s')

made = 0
for u, (orig, width) in sorted(needed.items()):
    out = u.lstrip('/')
    if os.path.isfile(out): continue
    if not WRITE: made += 1; continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    try:
        im = Image.open(orig); im.load()
        im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') and 'transparency' in im.info or im.mode == 'RGBA' else 'RGB')
        if im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(out, 'WEBP', quality=72, method=6)
        made += 1
    except Exception as e:
        print('  bỏ qua', orig, e)
print(f'trang đổi: {changed} | ảnh thu nhỏ cần: {len(needed)} | tạo mới: {made}')
