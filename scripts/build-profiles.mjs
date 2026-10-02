// Trang hồ sơ tĩnh cho mọi tác phẩm trong assets/catalog.json (game, anime, manga), VI + EN.
//
//   /game/<slug>   /anime/<slug>   /manga/<slug>        (+ /en/...)
//
// Nội dung dựng bằng CHÍNH assets/detail.v2.js (chạy trong Node với DOM giả lập), nên trang tĩnh
// giống hệt trang động cũ nhưng có sẵn trong HTML: tiêu đề, mô tả, canonical, hreflang, JSON-LD,
// thông tin, nhận định, bài viết liên quan. Google lập chỉ mục được, có trong sitemap.xml.
// Trang động cũ /game-detail?t=... vẫn tồn tại cho tựa chưa có hồ sơ; tựa đã có hồ sơ thì
// worker/index.js chuyển hướng 301 sang URL tĩnh (bảng assets/profile-paths.json do script này ghi).
//
// Chạy:  node scripts/build-profiles.mjs          (ghi trang + profile-paths.json + sitemap)
//        node scripts/build-profiles.mjs --check  (chỉ kiểm tra trang đã khớp dữ liệu)
// Chạy lại sau khi sửa assets/catalog.json (npm run scores đã gọi script này).
import fs from 'node:fs';
import vm from 'node:vm';
import { profilePaths, aliasPaths, displayName, rewriteProfileLinks, PROFILE_TYPES as TYPES } from './lib/profile-paths.mjs';

const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const exists = (f) => fs.existsSync(new URL(f, root));
const write = (f, s) => { fs.mkdirSync(new URL('.', new URL(f, root)), { recursive: true }); fs.writeFileSync(new URL(f, root), s, 'utf8'); };
const ORIGIN = 'https://otahub.asia';

const catalog = JSON.parse(read('assets/catalog.json'));
const detailSrc = read('assets/detail.v2.js');
const DETAIL_VER = (read('game-detail.html').match(/detail\.v2\.js\?v=([^"]+)"/) || [])[1];

// ---- Bảng đường dẫn (scripts/lib/profile-paths.mjs) ----
const paths = profilePaths(catalog);          // "type|Khóa catalog" -> "/type/slug"
const aliases = aliasPaths(paths);
const allPaths = { ...paths, ...aliases };

// ---- Chạy detail.v2.js với DOM giả lập ----
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const IDX = (() => { const w = {}; vm.runInNewContext(read('assets/search.js'), { window: w }); return w.IDX || []; })();

function render(type, key, en) {
  const out = { title: '', metas: {}, links: {}, schema: null, html: '', style: '' };
  const el = (tag) => {
    const node = { tag, attrs: {}, _text: '', textContent: '', innerHTML: '', children: [],
      setAttribute(n, v) { this.attrs[n] = v; }, getAttribute(n) { return this.attrs[n]; },
      hasAttribute(n) { return n in this.attrs; }, querySelector() { return null; } };
    if (tag === 'div') Object.defineProperty(node, 'innerHTML', { get() { return escHtml(this.textContent); }, set() {} });
    return node;
  };
  const metaNodes = {};
  const metaFor = (sel) => { if (!metaNodes[sel]) metaNodes[sel] = el('meta'); return metaNodes[sel]; };
  const rootEl = { attrs: {}, hasAttribute: () => false, querySelector: () => null, set innerHTML(v) { out.html = v; }, get innerHTML() { return out.html; } };
  const document = {
    getElementById: (id) => (id === 'detailRoot' ? rootEl : null),
    createElement: el,
    head: { appendChild(n) { if (n.tag === 'style') out.style = n.textContent; if (n.tag === 'script') out.schema = n.textContent; } },
    body: { getAttribute: (n) => (n === 'data-detail-type' ? type : null) },
    querySelector: (sel) => metaFor(sel),
    querySelectorAll: () => [],
    set title(v) { out.title = v; }, get title() { return out.title; }
  };
  const window = { IDX, OT_PROFILE_PATHS: allPaths, OT_PRERENDER: true };
  const fakeFetch = (url) => Promise.resolve({ ok: true, json: () => Promise.resolve(/catalog\.json/.test(url) ? catalog : allPaths) });
  const ctx = { document, window, location: { pathname: (en ? '/en/' : '/') + type + '-detail', search: '?t=' + encodeURIComponent(key) },
    URLSearchParams, fetch: fakeFetch, Promise, console, setTimeout, encodeURIComponent, JSON, Object, Array, Math, isNaN, parseFloat };
  vm.createContext(ctx);
  vm.runInContext(detailSrc, ctx);
  return new Promise((resolve) => setTimeout(() => {
    for (const [sel, node] of Object.entries(metaNodes)) {
      const v = node.attrs.content ?? node.attrs.href;
      if (v !== undefined) out.metas[sel] = v;
    }
    resolve(out);
  }, 0));
}

// ---- Ghép vào khung trang (game-detail.html / en/...) ----
const attrEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function setTag(html, re, replacement) {
  if (!re.test(html)) throw new Error('Khung trang thiếu thẻ: ' + re);
  return html.replace(re, () => replacement);
}
function pageHtml(type, key, en, r) {
  const tpl = read((en ? 'en/' : '') + type + '-detail.html');
  const e = catalog[key];
  const path = paths[`${type}|${key}`];
  const url = ORIGIN + (en ? '/en' : '') + path;
  const viUrl = ORIGIN + path, enUrl = ORIGIN + '/en' + path;
  const desc = r.metas['meta[name="description"]'] || '';
  const robots = r.metas['meta[name="robots"]'] || 'noindex, follow';
  const img = e.img && !/placeholder/.test(e.img) ? ORIGIN + e.img : ORIGIN + '/og-image.png';
  const name = displayName(key);
  const hub = { game: en ? ['Gaming', '/en/gaming'] : ['Gaming', '/gaming'], anime: en ? ['Anime', '/en/anime'] : ['Anime', '/anime'], manga: en ? ['Manga', '/en/manga'] : ['Manga', '/manga'] }[type];
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'OtaHub', item: ORIGIN + (en ? '/en/' : '/') },
    { '@type': 'ListItem', position: 2, name: hub[0], item: ORIGIN + hub[1] },
    { '@type': 'ListItem', position: 3, name, item: url }] };
  let html = tpl;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${escHtml(r.title)}</title>`);
  html = setTag(html, /<link rel="alternate" hreflang="vi" href="[^"]*">/, `<link rel="alternate" hreflang="vi" href="${viUrl}">`);
  html = setTag(html, /<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${enUrl}">`);
  html = setTag(html, /<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${viUrl}">`);
  html = setTag(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = setTag(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${attrEsc(desc)}">`);
  html = setTag(html, /<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${robots}">`);
  html = setTag(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${attrEsc(name + (en ? ' · Profile · OtaHub' : ' · Hồ sơ · OtaHub'))}">`);
  html = setTag(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  html = setTag(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${attrEsc(desc)}">`);
  html = setTag(html, /<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${img}">`);
  html = html.replace(/<meta name="twitter:image" content="[^"]*">/, () => `<meta name="twitter:image" content="${img}">`);
  html = html.replace(/<meta property="og:type" content="[^"]*">/, () => '<meta property="og:type" content="article">');
  const ld = (o) => `<script type="application/ld+json">${(typeof o === 'string' ? o : JSON.stringify(o)).replace(/</g, '\\u003c')}</script>`;
  html = setTag(html, /<\/head>/, `<style id="ot-detail-style">${r.style}</style>\n${ld(r.schema)}\n${ld(crumbs)}\n</head>`);
  // Poster dùng ảnh thu nhỏ 640px nếu đã có (scripts/build-thumbs.py), giống cách script đó viết lại trang
  const body = r.html.replace(/(class="ah-poster" src=")\/assets\/img\/(?!_[ts]\/|brand\/)([^"?#]+\.(?:jpe?g|png|webp|jfif))"/i,
    (m, pre, rel) => (exists(`assets/img/_t/${rel}.webp`) ? `${pre}/assets/img/_t/${rel}.webp"` : m));
  html = setTag(html, /<div id="detailRoot">[\s\S]*?<\/div><\/div>/, `<div id="detailRoot" data-prerendered>${body}</div>`);
  html = html.replace(/\/assets\/detail\.v2\.js\?v=[^"]+/, `/assets/detail.v2.js?v=${DETAIL_VER}`);
  return html;
}

// ---- Ghi ----
const pages = [];
for (const [pk, path] of Object.entries(paths)) {
  const [type, key] = [pk.slice(0, pk.indexOf('|')), pk.slice(pk.indexOf('|') + 1)];
  for (const en of [false, true]) {
    const r = await render(type, key, en);
    if (!r.html || /Đang kiểm chứng|Being verified/.test(r.html)) throw new Error(`Không dựng được hồ sơ ${pk} (${en ? 'EN' : 'VI'})`);
    pages.push({ file: (en ? 'en' : '') + path.replace(/^\//, en ? '/' : '') + '.html', html: pageHtml(type, key, en, r), indexable: /^index/.test(r.metas['meta[name="robots"]'] || ''), url: ORIGIN + (en ? '/en' : '') + path });
  }
}

if (CHECK) {
  const stale = pages.filter((p) => !exists(p.file) || read(p.file) !== p.html).map((p) => p.file);
  const pathsStale = !exists('assets/profile-paths.json') || read('assets/profile-paths.json') !== JSON.stringify(allPaths, null, 1) + '\n';
  if (stale.length || pathsStale) { console.error(`Trang hồ sơ chưa cập nhật (${stale.length} trang${pathsStale ? ' + profile-paths.json' : ''}), chạy: node scripts/build-profiles.mjs`); process.exit(1); }
  console.log(`Hồ sơ tĩnh: ${pages.length} trang khớp dữ liệu.`);
  process.exit(0);
}

// Gỡ trang hồ sơ cũ không còn trong catalog (đổi tên/xóa hồ sơ)
const keep = new Set(pages.map((p) => p.file));
for (const dir of TYPES.flatMap((t) => [t, 'en/' + t])) {
  if (!exists(dir)) continue;
  for (const f of fs.readdirSync(new URL(dir + '/', root))) {
    if (f.endsWith('.html') && !keep.has(`${dir}/${f}`)) fs.unlinkSync(new URL(`${dir}/${f}`, root));
  }
}
for (const p of pages) write(p.file, p.html);
write('assets/profile-paths.json', JSON.stringify(allPaths, null, 1) + '\n');

// Link trang hồ sơ động (?t=) trên các trang -> URL tĩnh. Dữ liệu nguồn trong JS (vd const REVIEWS)
// giữ dạng ?t= vì các script chấm điểm dựa vào; link đó vẫn được worker chuyển hướng 301.
let linkFiles = 0;
const SKIP = /^(?:en\/)?(?:admin|game-detail|anime-detail|manga-detail)\.html$/;
const htmlFiles = (dir) => fs.readdirSync(new URL(dir || '.', root), { withFileTypes: true }).flatMap((d) => {
  const rel = (dir ? dir + '/' : '') + d.name;
  if (d.isDirectory()) return ['en', 'author', 'en/author'].includes(rel) ? htmlFiles(rel) : [];
  return d.name.endsWith('.html') ? [rel] : [];
});
for (const file of htmlFiles('')) {
  if (SKIP.test(file)) continue;
  const before = read(file);
  const after = rewriteProfileLinks(before, allPaths);
  if (after !== before) { write(file, after); linkFiles++; }
}

// Sitemap: chỉ hồ sơ đủ thông tin (detail.v2.js đặt index), khối riêng có đánh dấu để chạy lại an toàn
let sm = read('sitemap.xml');
sm = sm.replace(/\s*<!-- PROFILES:START -->[\s\S]*?<!-- PROFILES:END -->/, '');
const today = new Date().toISOString().slice(0, 10);
const entries = pages.filter((p) => p.indexable).map((p) => `  <url><loc>${p.url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
sm = sm.replace('</urlset>', `  <!-- PROFILES:START -->\n${entries.join('\n')}\n  <!-- PROFILES:END -->\n</urlset>`);
write('sitemap.xml', sm);
console.log(`Hồ sơ tĩnh: ${pages.length} trang (${Object.keys(paths).length} tác phẩm × VI/EN), ${entries.length} trang đưa vào sitemap, ${Object.keys(aliases).length} tên gọi khác, đổi link ở ${linkFiles} trang.`);
