// Trang hồ sơ tĩnh cho mọi tác phẩm trong assets/catalog.json (game, anime, manga), VI + EN.
//
//   /ho-so/<slug>        /en/profile/<slug>
//
// Mỗi thương hiệu một trang (nhóm khai báo trong assets/series.json): manga, anime từng mùa, phim,
// game chuyển thể... là các tab phiên bản trên cùng trang, mỗi tab có điểm, nhận định, thông tin và
// bài viết riêng; /ho-so/<slug>#<tab> mở sẵn tab đó (bảng xếp hạng, trang chủ dùng link dạng này).
//
// Nội dung từng phiên bản dựng bằng CHÍNH assets/detail.v2.js (chạy trong Node với DOM giả lập), nên
// trang tĩnh giống hệt trang động nhưng có sẵn trong HTML: tiêu đề, mô tả, canonical, hreflang, JSON-LD,
// thông tin, nhận định, bài viết liên quan. Google lập chỉ mục được, có trong sitemap.xml.
// Trang động /game-detail?t=... vẫn tồn tại cho tựa chưa có hồ sơ; tựa đã có hồ sơ và URL hồ sơ cũ
// /game|anime|manga/<slug> được worker/index.js chuyển hướng 301 (assets/profile-paths.json, profile-moves.json).
//
// Chạy:  node scripts/build-profiles.mjs          (ghi trang + profile-paths.json + sitemap + khối hồ sơ trong bài)
//        node scripts/build-profiles.mjs --check  (chỉ kiểm tra trang đã khớp dữ liệu)
// Chạy lại sau khi sửa assets/catalog.json hoặc assets/series.json (npm run scores đã gọi script này).
import fs from 'node:fs';
import vm from 'node:vm';
import { profileSeries, profilePaths, aliasPaths, legacyMoves, localize, pagePath, displayName, rewriteProfileLinks, PROFILE_TYPES as TYPES } from './lib/profile-paths.mjs';
import { profileMatchers, profilesForArticle, articleInfo } from './lib/profile-links.mjs';

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
const series = profileSeries(catalog);
const paths = profilePaths(catalog);          // "type|Khóa catalog" -> "/ho-so/slug" hoặc "/ho-so/slug#tab"
const aliases = aliasPaths(paths);
const allPaths = { ...paths, ...aliases };
const moves = legacyMoves(paths);             // "/anime/chainsaw-man" (URL cũ) -> đường dẫn mới
// Khóa phụ (also) -> khóa phiên bản; khóa -> thương hiệu + phiên bản
const editionOf = new Map();
for (const s of series) for (const e of s.editions) { editionOf.set(e.key, { s, e }); for (const k of e.also) editionOf.set(k, { s, e }); }

// ---- Chạy detail.v2.js với DOM giả lập ----
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const IDX = (() => { const w = {}; vm.runInNewContext(read('assets/search.js'), { window: w }); return w.IDX || []; })();

// ---- Bài viết <-> hồ sơ (scripts/lib/profile-links.mjs) ----
const SKIP = /^(?:en\/)?(?:admin|game-detail|anime-detail|manga-detail)\.html$/;
const htmlFiles = (dir) => fs.readdirSync(new URL(dir || '.', root), { withFileTypes: true }).flatMap((d) => {
  const rel = (dir ? dir + '/' : '') + d.name;
  if (d.isDirectory()) return ['en', 'author', 'en/author'].includes(rel) ? htmlFiles(rel) : [];
  return d.name.endsWith('.html') ? [rel] : [];
});
const idxByUrl = new Map(IDX.map((a) => [a.url || a.href, a]));
const matchers = profileMatchers(catalog);
const articles = htmlFiles('').filter((f) => !SKIP.test(f) && !/^(?:en\/)?article\.html$/.test(f)).flatMap((file) => {
  const html = read(file);
  if (!html.includes('<aside class="art-sidebar">')) return [];
  const url = '/' + file.replace(/\.html$/, '');
  const meta = idxByUrl.get(url);
  // Mỗi thương hiệu chỉ một mục (vd bài nhắc cả manga lẫn anime Chainsaw Man), giữ phiên bản khớp trước
  const seen = new Set();
  const picks = profilesForArticle(matchers, { ...articleInfo(html), cat: meta?.cat }, 8)
    .map((p) => ({ ...p, key: editionOf.get(p.key)?.e.key || p.key }))
    .filter((p) => { const s = editionOf.get(p.key)?.s.slug; if (seen.has(s)) return false; seen.add(s); return true; })
    .slice(0, 4);
  return [{ file, url, en: file.startsWith('en/'), date: meta?.date || '', picks }];
});
// "Khóa phiên bản" -> [url bài], mới nhất trước, bài nhắc tên trong tiêu đề trước bài chỉ gắn thẻ
const profileArticles = { vi: {}, en: {} };
for (const a of [...articles].sort((x, y) => y.date.localeCompare(x.date))) {
  for (const p of a.picks) (profileArticles[a.en ? 'en' : 'vi'][p.key] ||= []).push({ url: a.url, inTitle: p.inTitle });
}
for (const lang of Object.values(profileArticles)) {
  for (const k of Object.keys(lang)) lang[k] = lang[k].sort((x, y) => y.inTitle - x.inTitle).map((x) => x.url);
}

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
  const window = { IDX, OT_PROFILE_PATHS: allPaths, OT_PROFILE_ARTICLES: profileArticles[en ? 'en' : 'vi'], OT_PRERENDER: true };
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
// Poster dùng ảnh thu nhỏ 640px nếu đã có (scripts/build-thumbs.py), giống cách script đó viết lại trang
const thumbPoster = (html) => html.replace(/(class="ah-poster" src=")\/assets\/img\/(?!_[ts]\/|brand\/)([^"?#]+\.(?:jpe?g|png|webp|jfif))"/i,
  (m, pre, rel) => (exists(`assets/img/_t/${rel}.webp`) ? `${pre}/assets/img/_t/${rel}.webp"` : m));
const scoreOf = (key) => { const n = parseFloat(catalog[key].score); return isNaN(n) ? '' : n.toFixed(1); };

// s: thương hiệu; rs: kết quả render từng phiên bản (cùng thứ tự s.editions)
function pageHtml(s, en, rs) {
  const main = s.editions[0], r0 = rs[0];
  const multi = s.editions.length > 1;
  const tpl = read((en ? 'en/' : '') + main.type + '-detail.html');
  const url = ORIGIN + pagePath(s.slug, en);
  const viUrl = ORIGIN + pagePath(s.slug, false), enUrl = ORIGIN + pagePath(s.slug, true);
  const desc = r0.metas['meta[name="description"]'] || '';
  const robots = rs.some((r) => /^index/.test(r.metas['meta[name="robots"]'] || '')) ? 'index, follow, max-image-preview:large' : 'noindex, follow';
  const e0 = catalog[main.key];
  const img = e0.img && !/placeholder/.test(e0.img) ? ORIGIN + e0.img : ORIGIN + '/og-image.png';
  const name = en ? s.nameEn : s.name;   // tên hiển thị theo ngôn ngữ (series.json: name = tên Việt hóa, nameEn = tên gốc)
  const labels = s.editions.map((e) => (en ? e.labelEn : e.label));
  const title = multi ? `${name}: ${labels.join(', ')} · ${en ? 'Profile' : 'Hồ sơ'} · OtaHub` : r0.title.replace(displayName(main.key), name);
  const hub = { game: en ? ['Gaming', '/en/gaming'] : ['Gaming', '/gaming'], anime: en ? ['Anime', '/en/anime'] : ['Anime', '/anime'], manga: en ? ['Manga', '/en/manga'] : ['Manga', '/manga'] }[main.type];
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'OtaHub', item: ORIGIN + (en ? '/en/' : '/') },
    { '@type': 'ListItem', position: 2, name: hub[0], item: ORIGIN + hub[1] },
    { '@type': 'ListItem', position: 3, name, item: url }] };
  let html = tpl;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${escHtml(title)}</title>`);
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
  // Mỗi phiên bản một khối JSON-LD (VideoGame / TVSeries / Book), url trỏ đúng tab
  const schemas = rs.map((r, i) => { const o = JSON.parse(r.schema); o.url = url + (i ? '#' + s.editions[i].tab : ''); return ld(o); });
  html = setTag(html, /<\/head>/, `<style id="ot-detail-style">${r0.style}</style>\n${schemas.join('\n')}\n${ld(crumbs)}\n</head>`);
  let body;
  if (!multi) body = thumbPoster(r0.html).replace(/<h1 class="ah-title">[\s\S]*?<\/h1>/, () => `<h1 class="ah-title">${escHtml(name)}</h1>`);
  else {
    const tabs = s.editions.map((e, i) => {
      const sc = scoreOf(e.key);
      return `<a class="ed-tab${i ? '' : ' on'}" role="tab" href="#${e.tab}" data-ed="${e.tab}" aria-selected="${i ? 'false' : 'true'}">${escHtml(labels[i])}${sc ? ` <b>${sc}</b>` : ''}</a>`;
    }).join('');
    const bar = `<div class="ed-bar"><div class="ed-in"><span class="ed-name">${escHtml(name)}</span><div class="ed-tabs" role="tablist" aria-label="${en ? 'Editions' : 'Phiên bản'}">${tabs}</div></div></div>`;
    // Chỉ tab đầu có H1 và ảnh tải ngay; tab khác ẩn tới khi chọn
    const panels = rs.map((r, i) => {
      let h = thumbPoster(r.html);
      // phiên bản mang đúng tên thương hiệu (vd. manga "Jujutsu Kaisen") -> hiện tên theo ngôn ngữ (Chú Thuật Hồi Chiến)
      if (displayName(s.editions[i].key) === s.nameEn) h = h.replace(/<h1 class="ah-title">[\s\S]*?<\/h1>/, () => `<h1 class="ah-title">${escHtml(name)}</h1>`);
      if (i) h = h.replace(/<h1 class="ah-title">([\s\S]*?)<\/h1>/, '<h2 class="ah-title">$1</h2>').replace(' fetchpriority="high"', ' loading="lazy"');
      return `<div class="ed-panel" data-ed="${s.editions[i].tab}" role="tabpanel"${i ? ' hidden' : ''}>${h}</div>`;
    }).join('');
    body = bar + panels;
  }
  html = setTag(html, /<div id="detailRoot">[\s\S]*?<\/div><\/div>/, `<div id="detailRoot" data-prerendered>${body}</div>`);
  html = html.replace(/\/assets\/detail\.v2\.js\?v=[^"]+/, `/assets/detail.v2.js?v=${DETAIL_VER}`);
  return html;
}

// ---- Ghi ----
const pages = [];
for (const s of series) {
  for (const en of [false, true]) {
    const rs = [];
    for (const e of s.editions) {
      const r = await render(e.type, e.key, en);
      if (!r.html || /Đang kiểm chứng|Being verified/.test(r.html)) throw new Error(`Không dựng được hồ sơ ${e.type}|${e.key} (${en ? 'EN' : 'VI'})`);
      rs.push(r);
    }
    const html = pageHtml(s, en, rs);
    pages.push({ file: pagePath(s.slug, en).slice(1) + '.html', html, indexable: /<meta name="robots" content="index/.test(html), url: ORIGIN + pagePath(s.slug, en) });
  }
}

// Khối "Hồ sơ tác phẩm" đầu sidebar bài viết; đánh dấu bằng comment để chạy lại thay đúng khối cũ
const sbThumb = (img) => {
  const m = /^\/assets\/img\/(?!_[ts]\/|brand\/)([^?#]+\.(?:jpe?g|png|webp|jfif))$/i.exec(img || '');
  return m && exists(`assets/img/_s/${m[1]}.webp`) ? `/assets/img/_s/${m[1]}.webp` : (img || '/assets/img/placeholder.svg');
};
const TYPE_LABEL = { game: 'Game', anime: 'Anime', manga: 'Manga' };
function withProfileBlock(html, a) {
  html = html.replace(/<!-- PROFILE-LINKS -->[\s\S]*?<!-- \/PROFILE-LINKS -->/, '');
  if (!a.picks.length) return html;
  const items = a.picks.map((p) => {
    const { s, e } = editionOf.get(p.key);
    const multi = s.editions.length > 1;
    const cat = multi ? (a.en ? e.labelEn : e.label) : TYPE_LABEL[p.type];
    return `<a class="sb-art" href="${localize(paths[`${p.type}|${p.key}`], a.en)}"><img class="sb-thumb" src="${attrEsc(sbThumb(catalog[p.key].img))}" alt="" loading="lazy" width="76" height="60"><div><div class="sb-cat">${escHtml(cat)}</div><div class="sb-t">${escHtml(a.en ? s.nameEn : s.name)}</div></div></a>`;
  }).join('');
  const block = `<!-- PROFILE-LINKS --><div class="sidebar-block"><div class="sb-title">${a.en ? 'Title profiles' : 'Hồ sơ tác phẩm'}</div>${items}</div><!-- /PROFILE-LINKS -->`;
  return html.replace('<aside class="art-sidebar">', () => '<aside class="art-sidebar">' + block);
}
const articleUpdates = articles.map((a) => { const before = read(a.file); return { file: a.file, before, after: withProfileBlock(before, a) }; })
  .filter((u) => u.after !== u.before);

const pathsJson = JSON.stringify(allPaths, null, 1) + '\n';
const movesJson = JSON.stringify(moves, null, 1) + '\n';
if (CHECK) {
  const stale = pages.filter((p) => !exists(p.file) || read(p.file) !== p.html).map((p) => p.file).concat(articleUpdates.map((u) => u.file));
  const dataStale = [['assets/profile-paths.json', pathsJson], ['assets/profile-moves.json', movesJson]].filter(([f, s]) => !exists(f) || read(f) !== s).map(([f]) => f);
  const old = TYPES.flatMap((t) => [t, 'en/' + t]).filter(exists);
  if (stale.length || dataStale.length || old.length) { console.error(`Trang hồ sơ chưa cập nhật (${stale.length} trang${dataStale.length ? ' + ' + dataStale.join(', ') : ''}${old.length ? ' + thư mục cũ ' + old.join(', ') : ''}), chạy: node scripts/build-profiles.mjs`); process.exit(1); }
  console.log(`Hồ sơ tĩnh: ${pages.length} trang khớp dữ liệu.`);
  process.exit(0);
}

// Gỡ trang hồ sơ không còn trong catalog, và thư mục URL cũ /game|anime|manga/ (đã chuyển hướng 301)
const keep = new Set(pages.map((p) => p.file));
for (const dir of ['ho-so', 'en/profile']) {
  if (!exists(dir)) continue;
  for (const f of fs.readdirSync(new URL(dir + '/', root))) {
    if (f.endsWith('.html') && !keep.has(`${dir}/${f}`)) fs.unlinkSync(new URL(`${dir}/${f}`, root));
  }
}
for (const dir of TYPES.flatMap((t) => [t, 'en/' + t])) if (exists(dir)) fs.rmSync(new URL(dir + '/', root), { recursive: true });
for (const p of pages) write(p.file, p.html);
write('assets/profile-paths.json', pathsJson);
write('assets/profile-moves.json', movesJson);

// Link hồ sơ trên các trang -> URL mới: trang động (?t=) và URL tĩnh cũ (/anime/<slug>). Dữ liệu nguồn
// trong JS (vd const REVIEWS) giữ dạng ?t= vì các script chấm điểm dựa vào; link đó vẫn được worker chuyển hướng 301.
for (const u of articleUpdates) write(u.file, u.after);
let linkFiles = 0;
for (const file of htmlFiles('')) {
  if (SKIP.test(file)) continue;
  const before = read(file);
  const after = rewriteProfileLinks(before, allPaths, moves);
  if (after !== before) { write(file, after); linkFiles++; }
}

// Sitemap: chỉ hồ sơ đủ thông tin (detail.v2.js đặt index), khối riêng có đánh dấu để chạy lại an toàn
let sm = read('sitemap.xml');
sm = sm.replace(/\s*<!-- PROFILES:START -->[\s\S]*?<!-- PROFILES:END -->/, '');
const today = new Date().toISOString().slice(0, 10);
const entries = pages.filter((p) => p.indexable).map((p) => `  <url><loc>${p.url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
sm = sm.replace('</urlset>', `  <!-- PROFILES:START -->\n${entries.join('\n')}\n  <!-- PROFILES:END -->\n</urlset>`);
write('sitemap.xml', sm);
const multi = series.filter((s) => s.editions.length > 1).length;
console.log(`Hồ sơ tĩnh: ${pages.length} trang (${series.length} thương hiệu × VI/EN, ${multi} trang nhiều phiên bản, ${Object.keys(paths).length} khóa catalog), ${entries.length} trang đưa vào sitemap, ${Object.keys(aliases).length} tên gọi khác, ${Object.keys(moves).length} URL cũ chuyển hướng, đổi link ở ${linkFiles} trang, ${articles.filter((a) => a.picks.length).length}/${articles.length} bài có khối hồ sơ (cập nhật ${articleUpdates.length}).`);
