// Trang chuyên mục Gaming / Anime / Manga (VI + EN) và trang Top List: dựng lại từ phân loại lưu TRONG từng bài.
//
// Mỗi bài thuộc trang chuyên mục mang 3 thẻ meta (nguồn sự thật, sửa được ở admin → ô "Mục con"):
//   <meta name="otahub:hub" content="game|anime|manga">
//   <meta name="otahub:type" content="tin-tuc|ra-mat|danh-gia|...">   đúng 1 mục con → 1 tab
//   <meta name="otahub:facet" content="pc|mobile|multi|manga|manhwa|manhua|">  nhóm phụ (nền tảng / xuất xứ)
// Danh sách mục con, nhãn và gợi ý tự động: assets/hub-taxonomy.js (dùng chung với admin).
//
// Bài chưa có meta: bản EN lấy theo bản VI (hreflang); bản VI dùng OVERRIDE hoặc gợi ý tự động, rồi GHI meta vào bài.
//
// Chạy:  node scripts/sync-hub-articles.mjs           (ghi meta còn thiếu + dựng trang chuyên mục, Top List)
//        node scripts/sync-hub-articles.mjs --check   (chỉ báo, thoát mã 1 nếu cần cập nhật)
import fs from 'node:fs';
import vm from 'node:vm';
import { read, write, loadReviews } from './lib/review-scores.mjs';

const CHECK = process.argv.includes('--check');
const exists = (p) => fs.existsSync(new URL('../' + p, import.meta.url));
const ctx = { window: {} };
vm.runInNewContext(read('assets/hub-taxonomy.js'), ctx);
const TX = ctx.window.OT_TAXONOMY;

// Chỉ dùng khi bài CHƯA có meta (gợi ý tự động sai / bài ghi sai chuyên mục). null = không thuộc trang chuyên mục.
const OVERRIDE = {
  'jujutsu-kaisen-juju-fes-2026-anniversary': { hub: 'anime', type: 'tin-tuc' },
  'avengers-doomsday-homework-watchlist': { hub: null },
  'huong-dan': { hub: 'game', type: 'huong-dan', facet: 'multi' },
  'detective-conan-final-chapter': { hub: 'manga', type: 'tin-tuc', facet: 'manga' },
  'order-of-the-sinking-star-ps5': { type: 'ra-mat' },
  'made-in-abyss-awakening-mystery': { type: 'phim-rap' },
  'dragon-ball-super-beerus-goku-doi-dau-than-huy-diet-beerus': { type: 'lich-chieu' },
  'dynamite-blue-game-rpg-chien-thuat-cyberpunk-kosmos12': { type: 'ra-mat' },
  'big-walk-house-house': { type: 'ra-mat' }
};
const PAGES = [
  { file: 'gaming.html', hub: 'game', lang: 'vi', p: 'gaming', data: 'GAMING_FEATURED_DATA' },
  { file: 'anime.html', hub: 'anime', lang: 'vi', p: 'anime', data: 'ANIME_FEATURED_DATA' },
  { file: 'manga.html', hub: 'manga', lang: 'vi', p: 'manga', data: 'MANGA_FEATURED_DATA' },
  { file: 'en/gaming.html', hub: 'game', lang: 'en', p: 'gaming', data: 'GAMING_FEATURED_DATA' },
  { file: 'en/anime.html', hub: 'anime', lang: 'en', p: 'anime', data: 'ANIME_FEATURED_DATA' },
  { file: 'en/manga.html', hub: 'manga', lang: 'en', p: 'manga', data: 'MANGA_FEATURED_DATA' }
];
const TAG_CLASS = { 'e-magazine': 'tv', 'tin-tuc': 'tc', 'ra-mat': 'tc', 'lich-chieu': 'ts', 'phim-rap': 'ta', 'chuong-moi': 'ts', 'chuyen-the': 'tv', 'danh-gia': 'ta', 'huong-dan': 'tg', esports: 'tv', 'goc-nhin': 'tv', 'top-list': 'ta' };
const TOP_LINK = { vi: { game: '🏆 Top Game', anime: '🏆 Top Anime', manga: '🏆 Top Manga' }, en: { game: '🏆 Top Games', anime: '🏆 Top Anime', manga: '🏆 Top Manga' } };
const ALL = { vi: 'Tất cả', en: 'All' };
const SEC_TITLE = {
  vi: { all: { game: 'Tiêu điểm <em>Gaming</em>', anime: 'Tiêu điểm <em>Anime</em>', manga: 'Tiêu điểm <em>Truyện Tranh</em>' } },
  en: { all: { game: 'Gaming <em>Highlights</em>', anime: 'Anime <em>Highlights</em>', manga: 'Manga <em>Highlights</em>' } }
};

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const reviewType = new Map();
for (const f of ['reviews.html', 'en/reviews.html']) for (const r of loadReviews(f)) reviewType.set(String(r.url).split('?')[0], r.type);

// ---------- 1. đọc bài + phân loại ----------
const metaRe = (n) => new RegExp(`<meta name="otahub:${n}" content="([^"]*)">`);
function parse(f) {
  const s = read(f);
  const pt = s.match(/<meta property="article:published_time" content="([^"]+)"/);
  if (!pt || /<meta name="robots" content="[^"]*noindex/.test(s)) return null;
  const g = (re) => unesc((s.match(re) || [])[1] || '');
  const slug = f.replace(/^en\//, '').replace(/\.html$/, '');
  const ogImg = g(/<meta property="og:image" content="([^"]*)"/).replace(/^https:\/\/otahub\.asia/, '');
  const mins = (s.match(/(\d+)\s*(?:phút đọc|min read)/) || [])[1];
  return { f, s, slug, url: '/' + f.replace(/\.html$/, ''), en: f.startsWith('en/'), date: pt[1],
    sec: g(/<meta property="article:section" content="([^"]*)"/),
    title: g(/<meta property="og:title" content="([^"]*)"/).replace(/\s*·\s*OtaHub.*$/, '') || g(/<h1[^>]*>([^<]*)/),
    desc: g(/<meta name="description" content="([^"]*)"/),
    img: ogImg && exists(ogImg.slice(1).split('?')[0]) ? ogImg : '',
    author: g(/<meta name="author" content="([^"]*)"/) || 'OtaHub Editorial', mins: mins ? +mins : null,
    viAlt: g(/<link rel="alternate" hreflang="vi" href="https:\/\/otahub\.asia([^"]*)"/),
    meta: { hub: (s.match(metaRe('hub')) || [])[1], type: (s.match(metaRe('type')) || [])[1], facet: (s.match(metaRe('facet')) || [])[1] } };
}
function classify(a) {
  const o = OVERRIDE[a.slug] || {};
  let hub = 'hub' in o ? o.hub : { Gaming: 'game', Anime: 'anime', Manga: 'manga' }[a.sec];
  if (!('hub' in o) && a.sec === 'Reviews') hub = reviewType.get(a.url) || null;
  if (!hub) return { hub: 'none', type: '', facet: '' };
  const s = TX.suggest(hub, a.title + ' ' + a.slug.replace(/-/g, ' '), { isReview: reviewType.has(a.url) });
  return { hub, type: o.type || s.type, facet: 'facet' in o ? o.facet : s.facet };
}
const files = [...fs.readdirSync(new URL('../', import.meta.url)).filter((f) => f.endsWith('.html')),
  ...fs.readdirSync(new URL('../en/', import.meta.url)).filter((f) => f.endsWith('.html')).map((f) => 'en/' + f)]
  .filter((f) => !/^(en\/)?(admin|article|bai-viet)\.html$/.test(f));
const all = files.map(parse).filter(Boolean);
// Mỗi số E-Magazine (src/emag/*.mjs) là một thẻ bài ở trang Gaming: mục con "E-Magazine", nhóm lọc lấy từ spec.hubFacet
for (const f of fs.readdirSync(new URL('../src/emag/', import.meta.url)).filter((x) => x.endsWith('.mjs'))) {
  const spec = (await import(new URL('../src/emag/' + f, import.meta.url).href)).default;
  for (const lang of ['vi', 'en']) {
    const pg = spec.pages[lang];
    all.push({ f: pg.file, s: '', slug: spec.slug, url: pg.path, en: lang === 'en', date: spec.updated + 'T00:00:00+07:00', sec: 'Gaming',
      title: pg.meta.title, desc: pg.meta.description, img: spec.searchImg, author: 'OtaHub Editorial', mins: null, viAlt: '',
      meta: { hub: 'game', type: 'e-magazine', facet: spec.hubFacet || '' }, virtual: true });
  }
}
const byUrl = new Map(all.map((a) => [a.url, a]));
let backfilled = 0;
for (const a of [...all.filter((x) => !x.en), ...all.filter((x) => x.en)]) {
  if (a.meta.hub) { a.cls = { hub: a.meta.hub, type: a.meta.type || '', facet: a.meta.facet || '' }; continue; }
  const vi = a.en && a.viAlt && byUrl.get(a.viAlt.replace(/\/$/, ''));
  a.cls = vi && vi.cls ? { ...vi.cls } : classify(a);
  backfilled++;
  if (CHECK) continue;
  const tags = `<meta name="otahub:hub" content="${a.cls.hub}">\n<meta name="otahub:type" content="${a.cls.type}">\n<meta name="otahub:facet" content="${a.cls.facet}">`;
  const s2 = /<meta property="article:section"[^>]*>/.test(a.s)
    ? a.s.replace(/(<meta property="article:section"[^>]*>)/, `$1\n${tags}`)
    : a.s.replace(/(<meta property="article:published_time"[^>]*>)/, `$1\n${tags}`);
  write(a.f, s2);
}
if (backfilled) console.log(`${CHECK ? 'Thiếu phân loại' : 'Đã ghi phân loại vào'} ${backfilled} bài`);
// kiểm tra phân loại hợp lệ
for (const a of all) {
  const H = TX.hubs[a.cls.hub];
  if (a.cls.hub === 'none') continue;
  if (!H || !H.types.some((t) => t[0] === a.cls.type)) { console.error(`! ${a.f}: mục con "${a.cls.type}" không hợp lệ cho "${a.cls.hub}"`); process.exitCode = 1; }
}

// ---------- 2. dựng trang chuyên mục ----------
const thumb = (u) => {
  const p = (u || '').split('?')[0];
  if (!/^\/assets\/img\/(?!_[ts]\/)[^?#]+\.(jpe?g|png|webp|jfif)$/i.test(p)) return u;
  const t = '/assets/img/_t/' + p.slice(12) + '.webp';
  return exists(t.slice(1)) ? t : u;
};
const fmtDate = (iso, lang, short) => {
  const d = new Date(iso);
  if (lang === 'en') return d.toLocaleDateString('en-US', short ? { month: 'short', day: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' } : { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
  const v = new Date(d.getTime() + 7 * 3600e3);
  const dd = String(v.getUTCDate()).padStart(2, '0'), mm = String(v.getUTCMonth() + 1).padStart(2, '0');
  return short ? `${dd}/${mm}` : `${dd}/${mm}/${v.getUTCFullYear()}`;
};
const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

function card(a, P, style) {
  const label = TX.label(P.hub, 'type', a.cls.type, P.lang), cls = TAG_CLASS[a.cls.type] || 'tc';
  const img = thumb(a.img) || '/assets/img/placeholder.svg';
  const minsTxt = a.mins ? (P.lang === 'en' ? `${a.mins} min` : `${a.mins} phút`) : '';
  const attrs = `class="ac" data-type="${a.cls.type}" data-facet="${a.cls.facet}"`;
  if (style === 'manga') {
    return `<a href="${a.url}" ${attrs}>
          <div class="ac-thumb"><img src="${esc(img)}" alt="${esc(a.title)}" loading="lazy" width="640" height="360"></div>
          <div class="ac-info"><div><div class="ac-tags"><span class="tag ${cls}">${esc(label)}</span></div><div class="ac-title">${esc(a.title)}</div></div><div class="ac-meta"><span>${esc(a.author)} · ${fmtDate(a.date, P.lang)}</span></div></div>
        </a>`;
  }
  return `<a href="${a.url}" ${attrs}>
          <div class="ac-thumb"><img src="${esc(img)}" alt="${esc(a.title)}" loading="lazy" width="640" height="360"><span class="tag">${esc(label)}</span></div>
          <div class="ac-info"><div><div class="ac-top"><span class="tag ${cls}">${esc(label)}</span></div><div class="ac-title">${esc(a.title)}</div></div><div class="ac-meta"><span>${esc(a.author)}</span><span class="ac-meta-sep">·</span><span>${fmtDate(a.date, P.lang)}</span>${minsTxt ? `<span class="ac-meta-sep">·</span><span>${minsTxt}</span>` : ''}</div></div>
        </a>`;
}

function syncPage(P) {
  let html = read(P.file);
  const before = html;
  const H = TX.hubs[P.hub], L = P.lang === 'en' ? 2 : 1;
  const hidden = H.hiddenTypes || [];
  const list = all.filter((a) => a.cls.hub === P.hub && a.en === (P.lang === 'en') && !hidden.includes(a.cls.type)).sort((a, b) => (a.date < b.date ? 1 : -1));
  const count = (k) => list.filter((a) => a.cls.type === k).length;
  // a) thanh menu con: mục con (có bài) | E-Magazine, Top List ; hàng 2 (Gaming): chip nhóm phụ độc lập
  const tabs = H.types.filter(([k]) => k !== 'top-list' && !hidden.includes(k) && count(k));
  const topHref = (P.lang === 'en' ? '/en' : '') + '/top-list?loai=' + P.hub;
  const nameOf = (r) => esc(P.lang === 'en' ? r[2] : r[1]);
  const tokens = (a) => String(a.cls.facet || '').split(' ').filter(Boolean);
  const NL = String.fromCharCode(10);
  let sub = '';
  if (H.facetGroups) {
    // chỉ hiện chip có ít nhất 1 bài; nhóm còn dưới 1 chip có nghĩa thì ẩn
    const groups = H.facetGroups.map((g) => ({ ...g, items: g.items.filter(([k]) => list.some((a) => tokens(a).includes(k))) })).filter((g) => g.items.length);
    const chips = groups.flatMap((g, i) => [...(i ? ['    <div class="filter-sep"></div>'] : []),
      ...g.items.map(([k, vi, en]) => `    <button class="ffacet" data-facet="${k}" data-group="${g.key}">${esc(P.lang === 'en' ? en : vi)}</button>`)]);
    if (chips.length) sub = `
  <div class="filter-in filter-sub">
${chips.join(NL)}
  </div>`;
  } else {
    const facets = H.facets.filter(([k]) => k !== 'multi' && list.some((a) => a.cls.facet === k));
    if (facets.length > 1) sub = `
  <div class="filter-in filter-sub">
    <span class="ffacet-label">${esc(H.facetLabel[L - 1])}</span>
    <button class="ffacet on" data-facet="all">${ALL[P.lang]}</button>
${facets.map(([k, vi, en]) => `    <button class="ffacet" data-facet="${k}" data-group="origin" data-single="1">${esc(P.lang === 'en' ? en : vi)}</button>`).join(NL)}
  </div>`;
  }
  const emag = H.emag ? `    <a class="ftab femag" href="${P.lang === 'en' ? '/en' : ''}/e-magazine">${H.emag[P.lang === 'en' ? 1 : 0]}</a>
` : '';
  const bar = `<div class="filter-bar" data-hub="${P.hub}" data-prefix="${P.p}">
  <div class="filter-in">
    <button class="ftab on" data-type="all">${ALL[P.lang]} <span class="ftab-n">${list.length}</span></button>
${tabs.map(([k, vi, en]) => `    <button class="ftab" data-type="${k}">${esc(P.lang === 'en' ? en : vi)} <span class="ftab-n">${count(k)}</span></button>`).join(NL)}
    <div class="filter-sep"></div>
${emag}    <a class="ftab ftop" href="${topHref}">${TOP_LINK[P.lang][P.hub]}</a>
  </div>${sub}
</div>`;
  html = html.replace(/<div class="filter-bar"[^>]*>\s*<div class="filter-in">[\s\S]*?<\/div>\s*<\/div>/, () => bar);
  // b) danh sách bài
  const style = /<!-- ADMIN:ARTICLES_START -->[\s\S]*?class="ac-tags"/.test(html) ? 'manga' : 'default';
  html = html.replace(/(<!-- ADMIN:ARTICLES_START -->)[\s\S]*?(<!-- ADMIN:ARTICLES_END -->)/,
    (m, s1, s2) => `${s1}\n        ${list.map((a) => card(a, P, style)).join('\n        ')}\n      ${s2}`);
  // c) khối Tiêu điểm cho "Tất cả" và từng mục con
  const dm = html.match(new RegExp(`var ${P.data} = (\\{[\\s\\S]*?\\n\\});`));
  if (!dm) throw new Error(`${P.file}: thiếu ${P.data}`);
  const feat = {};
  for (const key of ['all', ...tabs.map((t) => t[0]), 'top-list']) {
    const pool = list.filter((a) => a.img && (key === 'all' || a.cls.type === key));
    if (!pool.length) continue;
    const [h, ...rest] = pool.slice(0, 5);
    const lab = (a) => TX.label(P.hub, 'type', a.cls.type, P.lang);
    const name = key === 'all' ? null : TX.label(P.hub, 'type', key, P.lang);
    feat[key] = {
      secTitle: key === 'all' ? SEC_TITLE[P.lang].all[P.hub] : `${esc(H[P.lang])} · <em>${esc(name)}</em>`,
      hero: { url: h.url, img: h.img, tag: lab(h), tagClass: TAG_CLASS[h.cls.type] || 'tc', title: h.title, sub: h.desc, meta: `${h.author} · ${fmtDate(h.date, P.lang)}` },
      sides: rest.map((a) => ({ url: a.url, img: thumb(a.img), tag: lab(a), tagClass: TAG_CLASS[a.cls.type] || 'tc', title: a.title, meta: `${a.author} · ${fmtDate(a.date, P.lang, true)}` }))
    };
  }
  const body = Object.entries(feat).map(([k, v]) => `  ${JSON.stringify(k)}: ${js(v)}`).join(',\n');
  html = html.replace(dm[0], () => `var ${P.data} = {\n${body}\n};`);
  // d) khối Tiêu điểm tĩnh = "Tất cả"
  const A = feat.all, p = P.p;
  if (A) {
    const setAttr = (id, attr, val) => { html = html.replace(new RegExp(`(<[^>]*\\bid="${id}"[^>]*?\\b${attr}=")[^"]*(")`), `$1${val}$2`).replace(new RegExp(`(<[^>]*\\b${attr}=")[^"]*("[^>]*\\bid="${id}")`), `$1${val}$2`); };
    const setText = (id, val) => { html = html.replace(new RegExp(`(<([a-z0-9]+)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`), (m, open, tag, close) => open + val + close); };
    setAttr(`${p}HeroCard`, 'href', A.hero.url);
    html = html.replace(new RegExp(`(id="${p}HeroImg" style="background-image:url\\()[^)]*(\\))`), `$1${A.hero.img}$2`);
    setText(`${p}HeroTag`, esc(A.hero.tag)); setAttr(`${p}HeroTag`, 'class', 'tag ' + A.hero.tagClass);
    setText(`${p}HeroTitle`, esc(A.hero.title)); setText(`${p}HeroSub`, esc(A.hero.sub)); setText(`${p}HeroMeta`, esc(A.hero.meta));
    setText(`${p}SecTitle`, A.secTitle);
    A.sides.forEach((s, i) => {
      setAttr(`${p}SideCard${i}`, 'href', s.url); setAttr(`${p}SideImg${i}`, 'src', s.img); setAttr(`${p}SideImg${i}`, 'alt', esc(s.title));
      setText(`${p}SideTag${i}`, esc(s.tag)); setAttr(`${p}SideTag${i}`, 'class', 'tag ' + s.tagClass);
      setText(`${p}SideTitle${i}`, esc(s.title)); setText(`${p}SideMeta${i}`, esc(s.meta));
    });
  }
  // e) bộ lọc dùng chung
  if (!html.includes('/assets/hub-filter.js')) html = html.replace('<script defer src="/assets/enhance.js', '<script defer src="/assets/hub-filter.js?v=20261002e"></script>\n<script defer src="/assets/enhance.js');
  const changed = html !== before;
  if (changed && !CHECK) write(P.file, html);
  console.log(`${P.file}: ${list.length} bài · ${tabs.map(([k]) => `${k}:${count(k)}`).join(' ')} · top-list:${count('top-list')}${changed ? (CHECK ? ' (cần cập nhật)' : ' (đã ghi)') : ''}`);
  return changed;
}

// ---------- 3. trang Top List (VI + EN) ----------
const CAT = { game: ['Game', 'var(--cyan)'], anime: ['Anime', 'var(--sakura)'], manga: ['Manga', 'var(--lavender, #a78bfa)'] };
function syncTopList(file, en) {
  if (!exists(file)) return false;
  let html = read(file);
  const before = html;
  const items = all.filter((a) => a.en === en && a.cls.type === 'top-list').sort((a, b) => (a.date < b.date ? 1 : -1)).map((a) => {
    const n = (a.title.match(/\b(?:top ?)?(\d{1,2})\b(?= (?:game|anime|manga|bộ|tựa|titles|series|games|best|đáng|được))/i) || a.title.match(/^top ?(\d{1,2})/i) || [])[1];
    return { id: a.slug.slice(0, 24), type: a.cls.hub, url: a.url, img: thumb(a.img), cat: CAT[a.cls.hub][0], catC: CAT[a.cls.hub][1], title: a.title, sub: '', desc: a.desc,
      author: a.author, date: fmtDate(a.date, en ? 'en' : 'vi'), iso: a.date, itemCount: n ? +n : null };
  });
  html = html.replace(/var TOPLIST = \[[\s\S]*?\n\];/, () => `var TOPLIST = [\n${items.map((x) => '  ' + js(x)).join(',\n')}\n];`);
  const changed = html !== before;
  if (changed && !CHECK) write(file, html);
  console.log(`${file}: ${items.length} bài Top List${changed ? (CHECK ? ' (cần cập nhật)' : ' (đã ghi)') : ''}`);
  return changed;
}

let changed = backfilled > 0;
for (const P of PAGES) if (syncPage(P)) changed = true;
if (syncTopList('top-list.html', false)) changed = true;
if (syncTopList('en/top-list.html', true)) changed = true;
if (CHECK && changed) process.exitCode = 1;
