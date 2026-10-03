"""Trang chủ (VI + EN): đặt Hero và giữ mọi danh sách theo thứ tự thời gian.

  python scripts/home-order.py                         xếp lại theo giờ đăng (không đổi Hero)
  python scripts/home-order.py --hero /vi-slug /en/en-slug   đưa bài lên Hero; Hero cũ xuống ĐẦU "Tiêu điểm tuần"
                                                       và danh sách mới nhất (không bao giờ bị đá khỏi trang chủ)
  python scripts/home-order.py --keep /vi-slug /en/en-slug   đưa lại một bài bị rơi khỏi trang chủ
  python scripts/home-order.py --check                 báo lỗi (exit 1) nếu danh sách lệch thứ tự hoặc Hero bị lặp

Sau mỗi lần chạy: "Tiêu điểm tuần" (s-art), "Tin mới nhất" (w-card) và dòng chạy (ticker) xếp theo
article:published_time (mới -> cũ), giữ nguyên số thẻ. Bài cũ nhất rơi khỏi "Tiêu điểm tuần" thành thẻ
nổi bật lớn (fc), fc cũ -> đầu hàng thẻ nhỏ (sc), sc cuối bị bỏ. Hero luôn đứng đầu dòng chạy.
Thông tin thẻ (tiêu đề, ảnh, chuyên mục, tác giả, ngày) đọc thẳng từ trang bài.
Trên Git Bash, đặt MSYS_NO_PATHCONV=1 để đường dẫn /slug không bị đổi thành đường dẫn Windows.
"""
import io, os, re, sys, html, datetime
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
E = lambda s: html.escape(s, quote=True)
U = lambda s: html.unescape(s)
def rd(p): return io.open(os.path.join(R, p), encoding='utf-8', newline='').read()


def page(href):
    p = os.path.join(R, href.lstrip('/') + '.html')
    return io.open(p, encoding='utf-8').read() if os.path.isfile(p) else ''


def meta(s, k):
    m = re.search(r'<meta (?:name|property)="' + re.escape(k) + r'" content="([^"]*)"', s)
    return U(m.group(1)) if m else ''


def pub(href):
    return meta(page(href), 'article:published_time') or '0000'


def thumb(src):
    if '/_t/' in src or '/_s/' in src: return src
    t = '/assets/img/_t/' + src[len('/assets/img/'):] + '.webp'
    return t if os.path.isfile(os.path.join(R, t.lstrip('/'))) else src


def original(src):
    m = re.match(r'/assets/img/_[ts]/(.+)\.webp$', src)
    return '/assets/img/' + m.group(1) if m else src


def fmt_date(iso, en):
    d = datetime.datetime.fromisoformat(iso.replace('Z', '+00:00')).astimezone(datetime.timezone(datetime.timedelta(hours=7)))
    return d.strftime('%m/%d/%Y' if en else '%d/%m/%Y')


def info(href, en):
    """Thông tin thẻ lấy thẳng từ trang bài (tiêu đề, ảnh bìa, chuyên mục, tác giả, ngày)."""
    s = page(href)
    title = re.sub(r'\s*·\s*OtaHub\s*$', '', U(re.search(r'<title>([^<]*)</title>', s).group(1)))
    img = re.sub(r'^https://otahub\.asia', '', meta(s, 'og:image'))
    return {'href': href, 'title': title, 'img': img, 'cat': meta(s, 'article:section') or 'Gaming',
            'by': meta(s, 'author') or 'OtaHub Editorial', 'date': fmt_date(meta(s, 'article:published_time'), en)}


def sart_html(i):
    return (f'    <article class="s-art"><a href="{i["href"]}" class="sa-link">\n'
            f'      <div class="sa-thumb"><img src="{thumb(i["img"])}" alt="{E(i["title"])}" width="1200" height="675" loading="lazy" decoding="async"></div>\n'
            f'      <div><div class="sa-c" style="color:var(--pink);font-weight:700">{E(i["cat"])}</div><div class="sa-t">{E(i["title"])}</div><div class="sa-m">{i["date"]} · {E(i["by"])}</div></div>\n'
            f'    </a></article>\n')


def wcard_html(i, ind):
    return (f'{ind}<article class="w-card"><a href="{i["href"]}" style="text-decoration:none;display:contents"><div class="wc-info"><div class="wc-c" style="color:var(--cyan)">{E(i["cat"])}</div>'
            f'<div class="wc-t">{E(i["title"])}</div><div class="wc-m">{E(i["by"])} · {i["date"]}</div></div><div class="wc-thumb"><img src="{thumb(i["img"])}" alt="{E(i["title"])}" loading="lazy" width="1200" height="675"></div></a></article>\n')


SC_MAX = 4                                     # số thẻ nhỏ (sc) trong khối Tin nổi bật
SART = r'    <article class="s-art"><a href="([^"]+)" class="sa-link">\n[\s\S]*?\n    </a></article>\n'
WCARD = r'[ \t]*<article class="w-card"><a href="([^"]+)".*</article>\n'
TICK = r'      <span class="tick-item">.*?<a href="([^"]+)".*</span>\n'


def resort(s, pattern, keep, extra=()):
    """Xếp lại một dãy thẻ liền nhau theo giờ đăng; thêm thẻ mới (extra), bỏ trùng, cắt còn `keep` thẻ. Trả về (s, các thẻ bị cắt)."""
    ms = list(re.finditer(pattern, s))
    if not ms: return s, []
    a, b = ms[0].start(), ms[-1].end()
    cards, seen = [], set()
    for href, blk in list(extra) + [(m.group(1), m.group(0)) for m in ms]:
        if href in seen or href == HERO_HREF: continue
        seen.add(href); cards.append((href, blk))
    cards.sort(key=lambda c: pub(c[0]), reverse=True)
    kept, dropped = cards[:keep], cards[keep:]
    return s[:a] + ''.join(b2 for _, b2 in kept) + s[b:], dropped


def to_fc(s, dropped_blk, en):
    """Thẻ rơi khỏi Tiêu điểm tuần -> fc; fc cũ -> đầu sc; bỏ sc cuối."""
    href = re.search(r'href="([^"]+)"', dropped_blk).group(1)
    i = info(href, en)
    fcm = re.search(r'    <a class="fc" href="([^"]+)">\n[\s\S]*?\n    </a>\n', s)
    if not fcm or fcm.group(1) == href: return s
    fb = fcm.group(0)
    ofc = {'href': fcm.group(1), 'img': re.search(r'background-image:url\(([^)]+)\)', fb).group(1),
           'title': U(re.search(r'<h2 class="fc-title">([^<]*)</h2>', fb).group(1)),
           'tag': U(re.search(r'<span class="tag tag-c">([^<]*)</span>', fb).group(1))}
    fmeta = re.search(r'<div class="fc-meta"><span>[^<]*</span> · ([^<]*)</div>', fb).group(1)
    desc = meta(page(href), 'description')
    new_fc = (f'    <a class="fc" href="{href}">\n'
              f'      <div class="fc-img" style="background-image:url({original(i["img"])})"></div><div class="fc-ov"></div>\n'
              f'      <div class="fc-body">\n'
              f'        <span class="tag tag-c">{E(i["cat"])}</span>\n'
              f'        <h2 class="fc-title">{E(i["title"])}</h2>\n'
              f'        <p class="fc-sub">{E(desc)}</p>\n'
              f'        <div class="fc-meta"><span>{E(i["cat"])}</span> · {E(i["by"])} · {i["date"]}</div>\n'
              f'      </div>\n    </a>\n')
    s = s.replace(fb, new_fc, 1)
    scs = list(re.finditer(r'    <a class="sc" href="([^"]+)">.*</a>\n', s))
    if any(m.group(1) == ofc['href'] for m in scs): return s
    new_sc = (f'    <a class="sc" href="{ofc["href"]}"><div class="sc-img"><img src="{thumb(ofc["img"])}" alt="{E(ofc["title"])}" loading="lazy" width="1200" height="675"></div>'
              f'<div class="sc-body"><span class="tag tag-c" style="margin-bottom:6px;padding:3px 8px;font-size:9px">{E(ofc["tag"])}</span>'
              f'<div class="sc-title">{E(ofc["title"])}</div><div class="sc-meta">{fmeta}</div></div></a>\n')
    if len(scs) >= SC_MAX:                    # đủ ô thì bỏ thẻ nhỏ cuối, thiếu ô thì chỉ chèn thêm
        last = scs[-1]
        s = s[:last.start()] + s[last.end():]
    return s.replace(scs[0].group(0), new_sc + scs[0].group(0), 1)


def sc_html(i):
    return (f'    <a class="sc" href="{i["href"]}"><div class="sc-img"><img src="{thumb(i["img"])}" alt="{E(i["title"])}" loading="lazy" width="1200" height="675"></div>'
            f'<div class="sc-body"><span class="tag tag-c" style="margin-bottom:6px;padding:3px 8px;font-size:9px">{E(i["cat"])}</span>'
            f'<div class="sc-title">{E(i["title"])}</div><div class="sc-meta">{E(i["by"])} · {i["date"]}</div></div></a>\n')


def fill_sc(s, en):
    """Khối Tin nổi bật luôn đủ SC_MAX thẻ nhỏ: thiếu thì lấy bài mới nhất trong Tin mới nhất chưa xuất hiện ở Hero / Tiêu điểm tuần / fc / sc."""
    scs = list(re.finditer(r'    <a class="sc" href="([^"]+)">.*</a>\n', s))
    if not scs or len(scs) >= SC_MAX: return s
    used = {HERO_HREF} | {m.group(1) for m in re.finditer(SART, s)} | {m.group(1) for m in scs}
    fc = re.search(r'<a class="fc" href="([^"]+)"', s)
    if fc: used.add(fc.group(1))
    add = ''
    for m in re.finditer(WCARD, s):
        if len(scs) + add.count('class="sc"') >= SC_MAX: break
        if m.group(1) not in used and page(m.group(1)): add += sc_html(info(m.group(1), en)); used.add(m.group(1))
    last = scs[-1]
    return s[:last.end()] + add + s[last.end():]


def order(f, en, push=(), new_hero=None):
    global HERO_HREF
    s = rd(f)
    hm = re.search(r'  <div class="hero-main" onclick="location.href=\'([^\']+)\'"[\s\S]*?\n  </div>\n', s)
    if new_hero:
        slug = new_hero
        hp = page(slug); hi = info(slug, en); sec = hi['cat']
        excerpt = U((re.search(r'<p class="art-hero-excerpt">([^<]*)</p>', hp) or [0, ''])[1]) or meta(hp, 'description')
        if hm.group(1) != slug:
            push = (hm.group(1),) + tuple(push)          # Hero cũ luôn được giữ lại trên trang chủ
            arrow = re.search(r'<svg width="14" height="14"[\s\S]*?</svg>', hm.group(0)).group(0)
            tag = ('FEATURED · ' if en else 'NỔI BẬT · ') + sec.upper()
            hero = (f'  <div class="hero-main" onclick="location.href=\'{slug}\'" style="cursor:pointer">\n'
                    f'    <div class="h-img" style="background-image:url({original(hi["img"])})"></div><div class="h-ov"></div><div class="h-scan"></div><div class="h-glow"></div>\n'
                    f'    <div class="h-content">\n'
                    f'      <span class="tag tag-s tag-live" id="h-tag" style="background:#ff2177;color:#fff">{tag}</span>\n'
                    f'      <h1 class="h-title" id="h-title">{E(hi["title"])}</h1>\n'
                    f'      <p class="h-sub" id="h-sub">{E(excerpt)}</p>\n'
                    f'      <div class="h-meta"><span class="h-meta-cat">{sec}</span><span class="h-meta-sep">·</span><span>{E(hi["by"])}</span><span class="h-meta-sep">·</span><span id="h-time">{hi["date"]}</span></div>\n'
                    f'      <a href="{slug}" class="read-more" id="h-read"><span>{"Read full article" if en else "Đọc toàn bài"}</span>{arrow}</a>\n'
                    f'    </div>\n  </div>\n')
            s = s.replace(hm.group(0), hero, 1)
            hm = re.search(r'  <div class="hero-main" onclick="location.href=\'([^\']+)\'"[\s\S]*?\n  </div>\n', s)
    HERO_HREF = hm.group(1)
    n_s = len(re.findall(SART, s)); n_w = len(re.findall(WCARD, s))
    ind = re.match(r'[ \t]*', re.search(WCARD, s).group(0)).group(0)
    infos = [info(h, en) for h in push]
    s, dropped = resort(s, SART, n_s, [(i['href'], sart_html(i)) for i in infos])
    for _, blk in reversed(dropped):            # cũ nhất trước, để bài mới hơn nằm ở fc
        s = to_fc(s, blk, en)
    s, _ = resort(s, WCARD, n_w, [(i['href'], wcard_html(i, ind)) for i in infos])
    s = fill_sc(s, en)
    # dòng chạy: Hero đứng đầu, các bài còn lại xếp theo giờ đăng, không cắt
    h = info(HERO_HREF, en)
    tk = f'      <span class="tick-item">🔥 <strong>{E(h["cat"])}:</strong> <a href="{HERO_HREF}" style="color:inherit;text-decoration:none">{E(h["title"])}</a></span>\n'
    s, _ = resort(s, TICK, 10 ** 6)          # resort() đã bỏ thẻ của Hero ra khỏi dãy
    first = re.search(TICK, s)
    s = s[:first.start()] + tk + s[first.start():]
    io.open(os.path.join(R, f), 'w', encoding='utf-8', newline='').write(s)
    print(f, '| hero:', HERO_HREF, '| s-art:', [m.group(1) for m in re.finditer(SART, s)][:4], '... rơi:', [d[0] for d in dropped])



def check(f):
    s = rd(f); bad = []
    hero = re.search(r'<div class="hero-main" onclick="location\.href=\'([^\']+)\'"', s).group(1)
    for name, pat in (('Tiêu điểm tuần', SART), ('Tin mới nhất', WCARD)):
        hrefs = [m.group(1) for m in re.finditer(pat, s)]
        if hero in hrefs: bad.append(f'{name}: lặp lại bài Hero {hero}')
        ts = [pub(h) for h in hrefs]
        for k in range(len(ts) - 1):
            if ts[k] < ts[k + 1]: bad.append(f'{name}: {hrefs[k]} ({ts[k][:16]}) đứng trên bài mới hơn {hrefs[k + 1]} ({ts[k + 1][:16]})')
    for b in bad: print(f, '|', b)
    return not bad


HERO_HREF = ''
if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--check']:
        ok = check('index.html') & check('en/index.html')
        print('trang chủ: thứ tự OK' if ok else 'trang chủ: lệch thứ tự, chạy python scripts/home-order.py'); sys.exit(0 if ok else 1)
    if a[:1] == ['--hero']:
        order('index.html', False, new_hero=a[1]); order('en/index.html', True, new_hero=a[2])
    elif a[:1] == ['--keep']:
        order('index.html', False, push=(a[1],)); order('en/index.html', True, push=(a[2],))
    else:
        order('index.html', False); order('en/index.html', True)
