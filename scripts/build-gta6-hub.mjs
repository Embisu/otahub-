// Sinh trang hub "Đếm ngược GTA 6" (VI /dem-nguoc-gta-6, EN /en/gta-6-countdown) từ scripts/gta6-hub-content.mjs.
// Khung chung (menu, footer, script) lấy từ chính bài viết mẫu để luôn khớp với phần còn lại của site.
//
// Chạy:  node scripts/build-gta6-hub.mjs           (ghi 2 trang + đăng ký sitemap / search.js nếu chưa có)
//        node scripts/build-gta6-hub.mjs --check   (chỉ báo trang lệch so với nội dung, mã thoát 1 nếu lệch)
import fs from 'node:fs';
import { vi, en, UPDATED, OFFICIAL } from './gta6-hub-content.mjs';

const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const rel = (f) => new URL(f, root);
const read = (f) => fs.readFileSync(rel(f), 'utf8');
const exists = (f) => fs.existsSync(rel(f));
const VER = '20261002a';
const ORIGIN = 'https://otahub.asia';
const TEMPLATE = { vi: 'top-game-mobile-cay-cuoc-dang-choi-2026-aniimo-dragon-nest.html', en: 'en/best-grind-worthy-mobile-rpgs-2026-aniimo-dragon-nest.html' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (lang) => {
  const [y, m, d] = UPDATED.split('-').map(Number);
  return lang === 'vi' ? `${d}/${m}/${y}` : `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${d}, ${y}`;
};

// Mã GA luôn lấy từ bài mẫu tiếng Việt (bài mẫu EN hiện chưa có GA)
function gaFromVi() {
  const h = read(TEMPLATE.vi);
  const a = h.match(/<script>\/\* GA tải sau[\s\S]*?<\/script>/);
  const b = h.match(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/);
  if (!a || !b) throw new Error('Bài mẫu VI thiếu GA');
  return a[0] + '\n' + b[0];
}

// ---------- khung chung lấy từ bài mẫu ----------
function chrome(lang) {
  const h = read(TEMPLATE[lang]);
  const grab = (re, what) => { const m = h.match(re); if (!m) throw new Error(`Bài mẫu ${lang} thiếu ${what}`); return m[0]; };
  const css = ['article-style', 'clamp.v2', 'mobile-fix'].map((n) => grab(new RegExp(`<link rel="stylesheet" href="/assets/${n.replace('.', '\\.')}\\.css\\?v=[^"]+">`), n + '.css')).join('\n');
  const body = grab(/<div class="search-overlay"[\s\S]*?<\/nav>\s*<nav class="mobile-nav"[\s\S]*?<\/nav>/, 'khung menu');
  let tail = grab(/<footer>[\s\S]*<\/body>/, 'footer');
  tail = tail.replace(/function copyArticleLink[\s\S]*?\n}\n/, '').replace('</body>', '').trim();
  return {
    ga: gaFromVi(),
    fonts: grab(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<\/noscript>/, 'font'),
    css, body, tail
  };
}

// ---------- tin GTA 6 lấy từ chỉ mục tìm kiếm (assets/search.js) ----------
// Cùng bộ lọc với assets/gta6-hub.js, nên bài mới đăng sẽ tự xuất hiện ngay cả khi chưa build lại trang.
export const GTA6_RE = /\bGTA\s*(?:6|VI)\b|Grand Theft Auto\s*(?:6|VI)\b/i;
function coverageItems(lang, hubPaths) {
  const js = read('assets/search.js');
  const m = js.match(/window\.IDX\s*=\s*(\[[\s\S]*?\n\]);?/);
  if (!m) throw new Error('Không đọc được window.IDX trong assets/search.js');
  return JSON.parse(m[1])
    .filter((x) => (lang === 'en') === /^\/en\//.test(x.url) && !hubPaths.includes(x.url) && GTA6_RE.test(x.title + ' ' + (x.tags || []).join(' ')))
    .map((x, i) => ({ ...x, i }))
    .sort((p, q) => (q.date || '').localeCompare(p.date || '') || p.i - q.i)
    .map((x) => {
      const rest = (x.img || '').startsWith('/assets/img/') ? x.img.slice('/assets/img/'.length) : '';
      const thumb = rest && exists('assets/img/_t/' + rest + '.webp') ? '/assets/img/_t/' + rest + '.webp' : x.img;
      return { title: x.title, url: x.url, img: thumb, date: x.date || '', cat: x.cat || 'Gaming' };
    });
}

// ---------- các khối ----------
const sec = (id, inner, extra = '') => `<section class="g6-sec${extra}" id="${id}"><div class="g6-wrap">${inner}</div></section>`;
const head = (c, lead) => `<div class="g6-eyebrow">${esc(c.eyebrow)}</div><h2>${esc(c.h)}</h2>${lead ? `<p class="g6-lead">${esc(lead)}</p>` : ''}`;

function build(T, lang) {
  const C = chrome(lang);
  const url = ORIGIN + T.path, alt = ORIGIN + T.altPath;
  const viUrl = lang === 'vi' ? url : alt, enUrl = lang === 'vi' ? alt : url;
  const news = coverageItems(lang, [vi.path, en.path]);
  const dateLabel = fmtDate(lang);

  const hero = `<section class="g6-hero" id="top"><div class="g6-hero-bg" role="img" aria-label="${esc(T.intro.alt)}"></div><div class="g6-wrap g6-hero-in">
<span class="g6-kicker">${esc(T.hero.kicker)}</span>
<h1 class="g6-title">${T.hero.title}</h1>
<p class="g6-sub">${esc(T.hero.sub)}</p>
<div data-countdown>
<div class="g6-count" role="timer" aria-label="${esc(T.hero.kicker)}">${['d', 'h', 'm', 's'].map((u) => `<div class="g6-tile"><b data-u="${u}">--</b><span>${esc(T.hero.units[u])}</span></div>`).join('')}</div>
<div class="g6-launched">${esc(T.hero.launched)}</div>
<div class="g6-count-note" style="margin-top:12px"><span>${esc(T.hero.note)}</span><div class="g6-seg" role="group" aria-label="${esc(T.hero.note)}"><button type="button" data-mode="vn" aria-pressed="true">${esc(T.hero.optVN)}</button><button type="button" data-mode="us" aria-pressed="false">${esc(T.hero.optUS)}</button></div></div>
</div>
<div class="g6-cta"><a class="g6-btn pri" href="${T.hero.cta1[1]}">${esc(T.hero.cta1[0])}</a><a class="g6-btn" href="${T.hero.cta2[1]}">${esc(T.hero.cta2[0])}</a></div>
<div class="g6-count-note">${esc(T.ui.by)} · ${esc(T.ui.updated)} ${dateLabel}</div>
</div></section>`;

  const chips = `<nav class="g6-chips" aria-label="${esc(T.hero.kicker)}"><div class="g6-chips-in">${T.chips.map(([id, l]) => `<a class="g6-chip" href="#${id}">${esc(l)}</a>`).join('')}</div></nav>`;

  const intro = sec('tong-quan', `<div class="g6-split"><div>${head(T.intro, '')}${T.intro.p.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
<figure class="g6-fig"><img src="${T.intro.img}" alt="${esc(T.intro.alt)}" width="${T.intro.iw}" height="${T.intro.ih}" loading="lazy"><figcaption>${esc(T.intro.cap)}</figcaption></figure></div>`);

  const facts = sec('nhanh', `${head(T.facts, '')}<div class="g6-facts">${T.facts.items.map(([k, v, s]) => `<div class="g6-fact"><small>${esc(k)}</small><strong>${esc(v)}</strong><span>${esc(s)}</span></div>`).join('')}</div>`);

  const timeline = sec('moc', `${head(T.timeline, T.timeline.lead)}<ol class="g6-tl">${T.timeline.items.map(([d, t, p, st]) => `<li class="${st}"><time>${esc(d)}</time><div><h3>${esc(t)}</h3><p>${esc(p)}</p></div></li>`).join('')}</ol>`);

  const S = T.story;
  const story = sec('nhan-vat', `${head(S, S.lead)}<blockquote class="g6-quote">“${esc(S.quote)}”<cite>${esc(S.quoteBy)}</cite></blockquote>
<div class="g6-leads">${S.leads.map((l) => `<article class="g6-lead-card"><div class="role">${esc(l.role)}</div><h3>${esc(l.name)}</h3>${l.p.map((p) => `<p>${esc(p)}</p>`).join('')}<div class="g6-tags">${l.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div></article>`).join('')}</div>
<p class="g6-lead" style="max-width:none">${esc(S.relation)}</p>
<h3 style="font-family:var(--fd);font-size:20px;margin:6px 0 12px">${esc(S.castH)}</h3>
<div class="g6-cast">${S.cast.map(([n, d]) => `<div><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join('')}</div><p class="g6-note">${esc(S.castNote)}</p>`);

  const M = T.map;
  const map = sec('ban-do', `${head(M, M.lead)}<div class="g6-map" data-tabs><div class="g6-tablist" role="tablist" aria-label="${esc(M.h)}">${M.regions.map(([id, n, r], i) => `<button class="g6-tab" role="tab" id="tab-${id}" aria-controls="pan-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(n)}<i>${esc(r)}</i></button>`).join('')}</div>
<div>${M.regions.map(([id, n, r, d, col], i) => `<div class="g6-panel g6-region" role="tabpanel" id="pan-${id}" aria-labelledby="tab-${id}" style="--rc:${col}"${i ? ' hidden' : ''}><div class="real">${esc(r)}</div><h3>${esc(n)}</h3><p>${esc(d)}</p></div>`).join('')}</div></div><p class="g6-note">${esc(M.note)}</p>`);

  const G = T.gameplay;
  const gameplay = sec('gameplay', `${head(G, G.lead)}<div class="g6-feats">${G.items.map(([t, p], i) => `<article class="g6-feat"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join('')}</div>
<h3 style="font-family:var(--fd);font-size:20px;margin:26px 0 0">${esc(G.actsH)}</h3><div class="g6-acts">${G.acts.map((a) => `<span>${esc(a)}</span>`).join('')}</div><p class="g6-note">${esc(G.actsNote)}</p>`);

  const A = T.arsenal;
  const arsenal = sec('kho', `${head(A, A.lead)}<div data-tabs><div class="g6-tablist" role="tablist" aria-label="${esc(A.h)}">${A.tabs.map((t, i) => `<button class="g6-tab" role="tab" id="tab-${t.id}" aria-controls="pan-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.label)} (${t.items.length})</button>`).join('')}</div>
${A.tabs.map((t, i) => `<div class="g6-panel" role="tabpanel" id="pan-${t.id}" aria-labelledby="tab-${t.id}"${i ? ' hidden' : ''}><ul class="g6-items">${t.items.map(([n, s]) => `<li><b>${esc(n)}</b>${s ? `<span>${esc(s)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>`);

  const E = T.editions;
  const editions = sec('phien-ban', `${head(E, E.lead)}<div class="g6-eds">${E.cards.map((c) => `<article class="g6-ed${c.hot ? ' hot' : ''}">${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}<h3>${esc(c.name)}</h3><div class="price">${esc(c.price)}</div><ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}</div>
${E.notes.map((n) => `<p class="g6-note">${esc(n)}</p>`).join('')}<div class="g6-cta" style="margin-top:18px"><a class="g6-btn pri" href="${OFFICIAL}" target="_blank" rel="noopener">${esc(E.cta)}</a></div>`);

  const V = T.videos;
  const videos = sec('video', `${head(V, V.lead)}<div class="g6-vids">${V.items.map((v) => `<div class="g6-vid">${v.ext ? `<a class="g6-play" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" style="background-image:url('${v.thumb}')" aria-label="${esc(V.watch)}: ${esc(v.t)}"></a>` : `<button type="button" class="g6-play" data-yt="${v.id}" style="background-image:url('${v.thumb}')" aria-label="${esc(V.play)}: ${esc(v.t)}"></button>`}<div class="g6-vid-b"><b>${esc(v.t)}</b><span>${esc(v.d)}</span><noscript> <a href="https://www.youtube.com/watch?v=${v.id}">YouTube</a></noscript></div></div>`).join('')}</div>`);

  const H = T.history;
  const history = sec('lich-su', `${head(H, H.lead)}<div class="g6-hist">${H.items.map(([y, t, k, p, cls]) => `<article${cls ? ` class="${cls}"` : ''}><time>${esc(y)}</time><h3>${esc(t)}</h3><small>${esc(k)}</small><p>${esc(p)}</p></article>`).join('')}</div>`);

  const P = T.pending;
  const pending = sec('cho', `${head(P, P.lead)}<div class="g6-cast">${P.items.map(([t, d]) => `<div><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>`);

  const F = T.faq;
  const faq = sec('faq', `${head(F, '')}<div class="g6-faq">${F.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`);

  const N = T.news;
  const fmt = (d) => (d ? (lang === 'vi' ? d.split('-').reverse().join('/') : new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })) : '');
  const newsSec = sec('tin', `${head(N, N.lead)}<div class="g6-news" id="g6-news" data-lang="${lang}" data-more="${esc(N.more)}" data-exclude="${vi.path},${en.path}">${news.map((n) => `<a href="${n.url}"><img src="${n.img}" alt="" width="640" height="360" loading="lazy"><div><small>${esc(n.cat)}${n.date ? ' · ' + esc(fmt(n.date)) : ''}</small><b>${esc(n.title)}</b></div></a>`).join('')}</div>`);

  const src = `<div class="g6-wrap"><div class="g6-sources"><strong>${esc(T.sources.h)}</strong><br>${esc(T.sources.p)}<br>${T.sources.links.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(l)}</a>`).join(' · ')}</div></div>`;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#page', url, name: T.meta.title, description: T.meta.description, inLanguage: T.htmlLang, dateModified: UPDATED, isPartOf: { '@type': 'WebSite', name: 'OtaHub', url: ORIGIN },
        about: { '@id': url + '#game' }, primaryImageOfPage: T.meta.ogImage, author: { '@type': 'Organization', name: 'OtaHub', url: ORIGIN } },
      { '@type': 'VideoGame', '@id': url + '#game', name: 'Grand Theft Auto VI', url: OFFICIAL, gamePlatform: ['PlayStation 5', 'Xbox Series X|S'], genre: ['Action-adventure', 'Open world'], datePublished: '2026-11-19',
        publisher: { '@type': 'Organization', name: 'Rockstar Games' }, author: { '@type': 'Organization', name: 'Rockstar Games' }, image: T.meta.ogImage },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: T.ui.crumbHome, item: ORIGIN + T.home },
        { '@type': 'ListItem', position: 2, name: T.ui.crumbSec, item: ORIGIN + T.ui.secUrl },
        { '@type': 'ListItem', position: 3, name: T.jsonName, item: url }] },
      { '@type': 'FAQPage', mainEntity: T.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  };

  const headHtml = `<!DOCTYPE html>
<html lang="${T.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(T.meta.title)}</title>
<link rel="alternate" hreflang="vi" href="${viUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${viUrl}">
<link rel="canonical" href="${url}">
<meta name="description" content="${esc(T.meta.description)}">
<meta name="keywords" content="${esc(T.meta.keywords)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="author" content="OtaHub">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="${lang === 'vi' ? 'vi_VN' : 'en_US'}">
<meta property="og:title" content="${esc(T.meta.title)} · OtaHub">
<meta property="og:description" content="${esc(T.meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${T.meta.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(T.meta.title)} · OtaHub">
<meta name="twitter:description" content="${esc(T.meta.description)}">
<meta name="twitter:image" content="${T.meta.ogImage}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${C.fonts}
${C.ga}
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
${C.css}
<link rel="stylesheet" href="/assets/gta6-hub.css?v=${VER}">
</head>
<body>
${C.body}
<main class="g6">
${hero}
${chips}
${intro}
${facts}
${timeline}
${story}
${map}
${gameplay}
${arsenal}
${editions}
${videos}
${history}
${pending}
${faq}
${newsSec}
${src}
</main>
${C.tail}
<script defer src="/assets/search.js"></script>
<script defer src="/assets/gta6-hub.js?v=${VER}"></script>
</body>
</html>
`;
  return headHtml;
}

// ---------- đăng ký sitemap + search.js ----------
function register() {
  let sm = read('sitemap.xml'), changed = false;
  for (const T of [vi, en]) {
    const loc = ORIGIN + T.path;
    if (!sm.includes(`<loc>${loc}</loc>`)) { sm = sm.replace('</urlset>', `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${UPDATED}</lastmod>\n  </url>\n</urlset>`); changed = true; }
  }
  if (changed) fs.writeFileSync(rel('sitemap.xml'), sm);
  let js = read('assets/search.js');
  const entries = [en, vi].filter((T) => !js.includes(`"url": "${T.path}"`)).map((T) => `  {
    "title": ${JSON.stringify(T.meta.title)},
    "url": "${T.path}",
    "cat": "Gaming",
    "date": "${UPDATED}",
    "excerpt": ${JSON.stringify(T.meta.description)},
    "img": "/assets/img/gta6-official-art.jpg",
    "tags": []
  },`);
  if (entries.length) { js = js.replace('window.IDX = [\n', 'window.IDX = [\n' + entries.join('\n') + '\n'); fs.writeFileSync(rel('assets/search.js'), js); }
  return changed || entries.length > 0;
}

let stale = false;
for (const [T, file] of [[vi, 'dem-nguoc-gta-6.html'], [en, 'en/gta-6-countdown.html']]) {
  const html = build(T, T.lang);
  const cur = exists(file) ? read(file) : '';
  if (cur === html) { console.log(`${file}: đã khớp`); continue; }
  if (CHECK) { stale = true; console.log(`${file}: LỆCH so với nội dung`); continue; }
  fs.writeFileSync(rel(file), html);
  console.log(`${file}: đã ghi (${(html.length / 1024).toFixed(0)} KB)`);
}
if (!CHECK) console.log(register() ? 'Đã đăng ký sitemap / search.js' : 'sitemap / search.js đã có');
if (CHECK && stale) process.exit(1);
