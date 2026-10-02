// Bộ dựng "E-Magazine OtaHub": đọc mọi spec trong src/emag/*.mjs, kiểm tra theo bộ quy tắc cứng, rồi sinh trang VI + EN.
// Form được KHÓA: không viết HTML tay cho e-magazine, chỉ viết spec. Xem docs/EMAGAZINE-GUIDE.md.
//
// Chạy:  node scripts/emag/build.mjs            kiểm tra rồi ghi trang + đăng ký sitemap / search.js
//        node scripts/emag/build.mjs --check    chỉ kiểm tra spec và báo trang lệch (mã thoát 1 nếu có lỗi hoặc lệch)
//        node scripts/emag/build.mjs gta6       chỉ dựng spec có slug này
import fs from 'node:fs';
import crypto from 'node:crypto';
import { SECTION_TYPES, validate } from './validate.mjs';
import { ICONS, esc } from './parts.mjs';

const CHECK = process.argv.includes('--check');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const root = new URL('../../', import.meta.url);
const rel = (f) => new URL(f, root);
const read = (f) => fs.readFileSync(rel(f), 'utf8');
const exists = (f) => fs.existsSync(rel(f));
const ORIGIN = 'https://otahub.asia';
const TEMPLATE = { vi: 'top-game-mobile-cay-cuoc-dang-choi-2026-aniimo-dragon-nest.html', en: 'en/best-grind-worthy-mobile-rpgs-2026-aniimo-dragon-nest.html' };
const hash = (f) => crypto.createHash('md5').update(fs.readFileSync(rel(f))).digest('hex').slice(0, 8);
const VER = { css: hash('assets/emag.css'), js: hash('assets/emag.js') };

// ---------- khung chung lấy từ bài mẫu (menu, footer, GA, font) ----------
function chrome(lang) {
  const h = read(TEMPLATE[lang]), v = read(TEMPLATE.vi);
  const grab = (src, re, what) => { const m = src.match(re); if (!m) throw new Error(`Bài mẫu thiếu ${what}`); return m[0]; };
  const css = ['article-style', 'clamp.v2', 'mobile-fix'].map((n) => grab(h, new RegExp(`<link rel="stylesheet" href="/assets/${n.replace('.', '\\.')}\\.css\\?v=[^"]+">`), n + '.css')).join('\n');
  let tail = grab(h, /<footer>[\s\S]*<\/body>/, 'footer').replace(/function copyArticleLink[\s\S]*?\n}\n/, '').replace('</body>', '').trim();
  return {
    css, tail,
    body: grab(h, /<div class="search-overlay"[\s\S]*?<nav class="mobile-nav"[\s\S]*?<\/nav>/, 'khung menu'),
    // GA luôn lấy từ bài mẫu VI (bài mẫu EN hiện chưa có GA)
    ga: grab(v, /<script>\/\* GA tải sau[\s\S]*?<\/script>/, 'GA') + '\n' + grab(v, /<script>\s*window\.dataLayer[\s\S]*?<\/script>/, 'gtag'),
    fonts: grab(h, /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<\/noscript>/, 'font')
  };
}

// ---------- tin tổng hợp từ chỉ mục tìm kiếm ----------
function newsItems(spec, lang, hubPaths) {
  const js = read('assets/search.js');
  const m = js.match(/window\.IDX\s*=\s*(\[[\s\S]*?\n\]);?/);
  if (!m) throw new Error('Không đọc được window.IDX trong assets/search.js');
  const re = new RegExp(spec.newsMatch, 'i');
  return JSON.parse(m[1])
    .filter((x) => (lang === 'en') === /^\/en\//.test(x.url) && !hubPaths.includes(x.url) && re.test(x.title + ' ' + (x.tags || []).join(' ')))
    .map((x, i) => ({ ...x, i }))
    .sort((p, q) => (q.date || '').localeCompare(p.date || '') || p.i - q.i)
    .map((x) => {
      const rest = (x.img || '').startsWith('/assets/img/') ? x.img.slice('/assets/img/'.length) : '';
      const thumb = rest && exists('assets/img/_t/' + rest + '.webp') ? '/assets/img/_t/' + rest + '.webp' : x.img;
      return { title: x.title, url: x.url, img: thumb, date: x.date || '', cat: x.cat || '' };
    });
}

// Nền bản đồ địa hình (đường đồng mức) sinh theo id khu vực, dùng khi chưa có ảnh chính thức
function topo(id, color) {
  let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const r = (n) => ((Math.sin(h * 0.001 + n * 12.9898) * 43758.5453) % 1 + 1) % 1;
  const cx = 300 + r(1) * 400, cy = 120 + r(2) * 80, ph = r(3) * 6.28, ph2 = r(4) * 6.28;
  const paths = [];
  for (let i = 1; i <= 9; i++) {
    const pts = [];
    for (let k = 0; k <= 48; k++) {
      const t = (k / 48) * Math.PI * 2, rad = 14 + i * 26;
      const x = cx + rad * 2.1 * Math.cos(t) * (1 + 0.09 * Math.sin(3 * t + ph + i * 0.4) + 0.05 * Math.sin(5 * t + ph2));
      const y = cy + rad * 0.82 * Math.sin(t) * (1 + 0.11 * Math.cos(2 * t + ph2 + i * 0.3));
      pts.push(`${k ? "L" : "M"}${x.toFixed(0)} ${y.toFixed(0)}`);
    }
    paths.push(`<path d="${pts.join('')}Z" fill="none" stroke="${color}" stroke-opacity="${(0.14 + 0.05 * (i % 3)).toFixed(2)}" stroke-width="${i % 4 === 0 ? 2 : 1.2}"/>`);
  }
  return `<svg class="em-topo" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${paths.join('')}</svg>`;
}
const daysLeft = (spec) => Math.max(0, Math.floor((Date.parse(spec.countdown.vn) - Date.parse(spec.updated + 'T12:00:00+07:00')) / 86400000));

// ---------- các khối ----------
const bg = (u) => `url('${u}')`;
const initials = (name) => (name.match(/\b[A-ZÀ-Ỹ]/g) || [name[0]]).slice(0, 2).join('');
const fmtDate = (lang, d) => (!d ? '' : lang === 'vi' ? d.split('-').reverse().join('/') : new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }));

function renderSection(s, ctx) {
  const { page, lang, spec } = ctx;
  const head = s.nav || s.eyebrow ? `<header class="em-head em-rv">${s.num ? `<span class="em-num" aria-hidden="true">${s.num}</span>` : ''}<div><div class="em-eyebrow">${esc(s.eyebrow || s.nav)}</div><h2>${esc(s.h)}</h2></div>${s.lead ? `<p class="em-lead">${esc(s.lead)}</p>` : ''}</header>` : '';
  const wrap = (inner) => `<section class="em-sec" id="${s.id}"><div class="em-wrap">${head}${inner}</div></section>`;
  switch (s.type) {
    case 'intro':
      return wrap(`<div class="em-intro"><div class="em-rv">${s.p.map((p) => `<p>${esc(p)}</p>`).join('')}</div><figure class="em-frame em-rv"><img src="${s.img.src}" alt="${esc(s.img.alt)}" width="${s.img.w}" height="${s.img.h}" loading="lazy"><figcaption>${esc(s.img.cap)}</figcaption></figure></div>`);
    case 'guides':
      return wrap(`<div class="em-guides">${s.items.map((g) => `<a class="em-guide em-rv" href="${g.href}" style="--img:${bg(g.img)}"><div><b>${esc(g.h)}</b><span>${esc(g.p)}</span></div></a>`).join('')}</div>`);
    case 'facts':
      return wrap(`<div class="em-bento">${s.items.map((f) => `<div class="em-fact em-rv${f.wide ? ' wide' : ''}${f.hl ? ' hl' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[f.icon]}</svg><small>${esc(f.k)}</small><strong>${esc(f.v)}</strong><span>${esc(f.s)}</span>${f.days ? `<div><span class="em-days" data-days data-fmt="${esc(page.ui.daysLeft)}">${esc(page.ui.daysLeft.replace('{n}', daysLeft(spec)))}</span></div>` : ''}</div>`).join('')}</div>`);
    case 'timeline': {
      let side = 0, marked = false;
      const todayAt = s.items.findIndex((t) => t.state !== 'done');
      const li = s.items.map((t, i) => {
        const out = [];
        if (i === todayAt && !marked) { marked = true; out.push(`<li class="em-tl-today" aria-label="${esc(page.ui.today)}"><span><i></i>${esc(page.ui.today)} · ${esc(page.ui.date)}</span></li>`); }
        const cls = t.state === 'next' ? 'next' : `${t.state} ${side++ % 2 ? 'cr' : 'cl'}`;
        const tag = t.kind ? `<span class="em-tl-tag k-${t.kind}">${esc(t.tag || t.kind)}</span>` : '';
        const img = t.img ? `<div class="em-tl-ph"><img src="${t.img}" alt="${esc(t.imgAlt || t.t)}" width="640" height="320" loading="lazy"></div>` : '';
        out.push(`<li class="${cls}"><div class="em-tl-d"><time>${esc(t.d)}</time></div><div class="em-tl-c em-rv">${img}${tag}<h3>${esc(t.t)}</h3><p>${esc(t.p)}</p></div></li>`);
        return out.join('');
      }).join('');
      return wrap(`<ol class="em-tl" data-tl>${li}</ol>`);
    }
    case 'people':
      return wrap(`<blockquote class="em-quote em-rv">“${esc(s.quote.text)}”<cite>${esc(s.quote.by)}</cite></blockquote>
<div class="em-people">${s.leads.map((l) => `<article class="em-person em-rv" style="--img:${bg(l.img.src)};--pos:${l.img.pos};--zoom:${l.img.zoom}"><div class="em-person-b"><div class="role">${esc(l.role)}</div><h3>${esc(l.name)}</h3>${l.p.map((p) => `<p>${esc(p)}</p>`).join('')}<div class="em-tags">${l.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div></div></article>`).join('')}</div>
<p class="em-relation em-rv">${esc(s.relation)}</p><h3 class="em-sub-h">${esc(s.castH)}</h3>
<div class="em-cast">${s.cast.map(([n, d]) => `<div class="em-rv"><span class="em-ava" aria-hidden="true">${esc(initials(n))}</span><b>${esc(n)}</b><span class="d">${esc(d)}</span></div>`).join('')}</div><p class="em-note-s">${esc(s.castNote)}</p>`);
    case 'regions':
      return wrap(`<div class="em-regions" data-tabs><div class="em-tablist" role="tablist" aria-label="${esc(s.h)}">${s.items.map((r, i) => `<button class="em-tab" role="tab" id="tab-${r.id}" aria-controls="pan-${r.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--rc:${r.color}">${esc(r.name)}<i>${esc(r.real)}</i></button>`).join('')}</div>
<div>${s.items.map((r, i) => `<article class="em-panel em-region" role="tabpanel" id="pan-${r.id}" aria-labelledby="tab-${r.id}" style="--rc:${r.color}"${i ? ' hidden' : ''}>${r.img
        ? `<div class="em-region-art"><img src="${r.img.src}" alt="${esc(r.img.alt)}" style="object-position:${r.img.pos}" width="1400" height="530" loading="lazy"></div>`
        : `<div class="em-region-art noimg">${topo(r.id, r.color)}<span class="soon">${esc(page.ui.soon)}</span><b aria-hidden="true">${esc(r.name[0])}</b></div>`}<div class="em-region-b"><div class="real">${esc(r.real)}</div><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p></div></article>`).join('')}</div></div><p class="em-note-s">${esc(s.note)}</p>`);
    case 'features':
      return wrap(`<div class="em-rows">${s.rows.map((r, i) => `<div class="em-row em-rv"><figure class="em-row-img"><img src="${r.img.src}" alt="${esc(r.img.alt)}" width="1000" height="563" loading="lazy"><figcaption>${esc(r.img.cap)}</figcaption></figure><div><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(r.h)}</h3><p>${esc(r.p)}</p></div></div>`).join('')}</div>
<div class="em-cards">${s.cards.map((c, i) => `<article class="em-card em-rv"><span class="n">${String(s.rows.length + i + 1).padStart(2, '0')}</span><h3>${esc(c.h)}</h3><p>${esc(c.p)}</p></article>`).join('')}</div>
<h3 class="em-sub-h">${esc(s.actsH)}</h3><div class="em-chips2">${s.acts.map((a) => `<span>${esc(a)}</span>`).join('')}</div><p class="em-note-s">${esc(s.actsNote)}</p>`);
    case 'gallery':
      return wrap(`<div class="em-gal"><div class="em-gal-nav"><button type="button" data-gal="prev" aria-label="${esc(page.ui.scrollL)}">‹</button><button type="button" data-gal="next" aria-label="${esc(page.ui.scrollR)}">›</button></div>
<div class="em-gal-track">${s.items.map((g) => `<button type="button" class="em-shot" data-full="${g.src}" data-alt="${esc(g.alt)}"><img src="${g.src}" alt="${esc(g.alt)}" width="1000" height="563" loading="lazy"><span>${esc(g.alt)}</span></button>`).join('')}</div>
<dialog class="em-lb" aria-label="${esc(s.h)}"><figure><img alt="" src=""><figcaption><span class="cap"></span><span class="cnt"></span></figcaption></figure><button type="button" class="prev" aria-label="${esc(page.ui.prev)}">‹</button><button type="button" class="next" aria-label="${esc(page.ui.next)}">›</button><button type="button" class="close" aria-label="${esc(page.ui.close)}">✕</button></dialog></div>`);
    case 'tabs':
      return wrap(`<div data-tabs><div class="em-tablist" role="tablist" aria-label="${esc(s.h)}">${s.tabs.map((t, i) => `<button class="em-tab" role="tab" id="tab-${t.id}" aria-controls="pan-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.label)} (${t.items.length})</button>`).join('')}</div>
${s.tabs.map((t, i) => `<div class="em-panel" role="tabpanel" id="pan-${t.id}" aria-labelledby="tab-${t.id}"${i ? ' hidden' : ''}><ul class="em-items">${t.items.map(([n, d]) => `<li><b>${esc(n)}</b>${d ? `<span>${esc(d)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>`);
    case 'editions':
      return wrap(`<div class="em-eds">${s.cards.map((c) => `<article class="em-ed em-rv${c.hot ? ' hot' : ''}"><div class="em-ed-art" style="--img:${bg(c.img.src)};--pos:${c.img.pos}">${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}</div><div class="em-ed-b"><h3>${esc(c.name)}</h3><div class="price">${esc(c.price)}</div><ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div></article>`).join('')}</div>
${s.notes.map((n) => `<p class="em-note-s">${esc(n)}</p>`).join('')}<div class="em-cta"><a class="em-btn pri" href="${spec.official}" target="_blank" rel="noopener">${esc(s.cta)}</a></div>`);
    case 'videos':
      return wrap(`<div class="em-vids">${s.items.map((v) => `<div class="em-vid em-rv">${v.ext
        ? `<a class="em-play" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" style="background-image:${bg(v.thumb)}" aria-label="${esc(page.ui.watch)}: ${esc(v.t)}"></a>`
        : `<button type="button" class="em-play" data-yt="${v.id}" style="background-image:${bg(v.thumb)}" aria-label="${esc(page.ui.play)}: ${esc(v.t)}"></button>`}<div class="em-vid-b"><b>${esc(v.t)}</b><span>${esc(v.d)}</span><noscript> <a href="https://www.youtube.com/watch?v=${v.id}">YouTube</a></noscript></div></div>`).join('')}</div>`);
    case 'history':
      return wrap(`<div class="em-hist">${s.items.map((h) => `<article${h.cur ? ' class="cur"' : ''}><time>${esc(h.y)}</time><h3>${esc(h.t)}</h3><small>${esc(h.k)}</small><p>${esc(h.p)}</p></article>`).join('')}</div>`);
    case 'todo':
      return wrap(`<ul class="em-todo">${s.items.map((t) => `<li class="em-rv"><b>${esc(t.t)}</b><span>${esc(t.d)}</span></li>`).join('')}</ul>`);
    case 'faq':
      return wrap(`<div class="em-faq">${s.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`);
    case 'news': {
      const items = newsItems(spec, lang, Object.values(spec.pages).map((p) => p.path));
      const cards = items.map((n) => `<a href="${n.url}"><img src="${n.img}" alt="" width="640" height="360" loading="lazy"><div><small>${esc(n.cat)}${n.date ? ' · ' + esc(fmtDate(lang, n.date)) : ''}</small><b>${esc(n.title)}</b></div></a>`).join('');
      return wrap(`<div class="em-news" data-news data-lang="${lang}" data-match="${esc(spec.newsMatch)}" data-more="${esc(s.more)}" data-exclude="${Object.values(spec.pages).map((p) => p.path).join(',')}">${cards}</div>`);
    }
    case 'banner':
      return `<section class="em-banner" aria-label="${esc(s.h.replace(/<[^>]+>/g, ''))}" style="--img:${bg(s.img.src)};--pos:${s.img.pos || 'center'}"><div class="em-banner-in em-rv"><h2>${s.h}</h2>${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.btn ? `<a class="em-btn pri" href="${s.btn[1]}">${esc(s.btn[0])}</a>` : ''}${s.credit ? `<small>${esc(s.credit)}</small>` : ''}</div></section>`;
    case 'cta':
      return `<div class="em-wrap"><div class="em-band em-rv"><div><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p></div><a class="em-btn pri" href="${s.btn[1]}">${esc(s.btn[0])}</a></div></div>`;
    case 'sources':
      return `<div class="em-wrap"><div class="em-sources"><strong>${esc(s.h)}</strong><br>${esc(s.p)}<br>${s.links.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(l)}</a>`).join(' · ')}</div></div>`;
    default:
      throw new Error('Loại khối chưa hỗ trợ: ' + s.type);
  }
}

function renderPage(spec, lang) {
  const page = spec.pages[lang], other = spec.pages[lang === 'vi' ? 'en' : 'vi'];
  const C = chrome(lang);
  const url = ORIGIN + page.path;
  const viUrl = ORIGIN + spec.pages.vi.path, enUrl = ORIGIN + spec.pages.en.path;
  // đánh số chương cho các khối có nav
  let n = 0;
  const sections = page.sections.map((s) => ({ ...s, num: s.nav ? String(++n).padStart(2, '0') : '' }));
  const chips = sections.filter((s) => s.nav);
  const H = page.hero, clock = H.clock;
  const t = spec.theme;

  const hero = `<section class="em-hero" id="top"><div class="em-hero-bg" style="--hero:${bg(H.bg)};--hero-pos:${H.bgPos}${H.bgMobile ? `;--hero-m:${bg(H.bgMobile.src)};--hero-m-pos:${H.bgMobile.pos}` : ''}" role="img" aria-label="${esc(H.title.replace(/<[^>]+>/g, ''))}"></div><div class="em-wrap em-hero-in">
<div><span class="em-kicker">${esc(H.kicker)}</span><span class="em-live"><i></i>${esc(H.live)}</span>
<h1 class="em-title${H.hideTitle ? ' em-sr' : ''}">${H.title}</h1><div class="em-hchips">${H.chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div><p class="em-sub">${esc(H.sub)}</p>
<div class="em-cta">${H.ctas.map(([l, h, pri]) => `<a class="em-btn${pri ? ' pri' : ''}" href="${h}">${esc(l)}</a>`).join('')}</div>
<div class="em-by">${esc(page.ui.by)} · ${esc(page.ui.updated)} ${esc(page.ui.date)}</div></div>
<aside class="em-clock" data-countdown data-t-vn="${spec.countdown.vn}" data-t-us="${spec.countdown.us}"><h2>${esc(clock.h)}</h2>
<div class="em-count" role="timer" aria-label="${esc(clock.h)}">${['d', 'h', 'm', 's'].map((u) => `<div class="em-tile"><b data-u="${u}">--</b><span>${esc(clock.units[u])}</span></div>`).join('')}</div>
<div class="em-launched">${esc(clock.launched)}</div>
<p class="em-note">${esc(clock.note)}</p><div class="em-seg" role="group" aria-label="${esc(clock.note)}"><button type="button" data-mode="vn" aria-pressed="true">${esc(clock.vn)}</button><button type="button" data-mode="us" aria-pressed="false">${esc(clock.us)}</button></div></aside>
</div><a class="em-scroll" href="#${chips[0].id}" aria-label="${esc(page.ui.scroll)}"></a></section>`;
  const ticks = page.ticker.map((x) => `<span>${esc(x)}</span>`).join('');
  const ticker = `<div class="em-ticker" aria-hidden="true"><div class="em-track">${ticks}${ticks}</div></div>`;
  const chapters = `<nav class="em-chapters" aria-label="${esc(H.kicker)}"><div class="em-chapters-in">${chips.map((s) => `<a class="em-chip" href="#${s.id}">${esc(s.nav)}</a>`).join('')}</div><div class="em-progress"></div></nav>`;

  const faq = sections.find((s) => s.type === 'faq');
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#page', url, name: page.meta.title, description: page.meta.description, inLanguage: page.htmlLang, dateModified: spec.updated,
        isPartOf: { '@type': 'WebSite', name: 'OtaHub', url: ORIGIN }, primaryImageOfPage: page.meta.ogImage, author: { '@type': 'Organization', name: 'OtaHub', url: ORIGIN } },
      ...(spec.about ? [{ ...spec.about, '@id': url + '#about' }] : []),
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'vi' ? 'Trang chủ' : 'Home', item: ORIGIN + page.home },
        { '@type': 'ListItem', position: 2, name: page.crumb.name, item: ORIGIN + page.crumb.url },
        { '@type': 'ListItem', position: 3, name: page.jsonName, item: url }] },
      ...(faq ? [{ '@type': 'FAQPage', mainEntity: faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : [])
    ]
  };

  return `<!DOCTYPE html>
<html lang="${page.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.meta.title)}</title>
<link rel="alternate" hreflang="vi" href="${viUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${viUrl}">
<link rel="canonical" href="${url}">
<meta name="description" content="${esc(page.meta.description)}">
<meta name="keywords" content="${esc(page.meta.keywords)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="author" content="OtaHub">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="${lang === 'vi' ? 'vi_VN' : 'en_US'}">
<meta property="og:title" content="${esc(page.meta.title)} · OtaHub">
<meta property="og:description" content="${esc(page.meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${page.meta.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.meta.title)} · OtaHub">
<meta name="twitter:description" content="${esc(page.meta.description)}">
<meta name="twitter:image" content="${page.meta.ogImage}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${C.fonts}
${C.ga}
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
${C.css}
<link rel="stylesheet" href="/assets/emag.css?v=${VER.css}">
<style>:root{--em-a1:${t.a1};--em-a2:${t.a2};--em-a3:${t.a3};--em-a4:${t.a4}}</style>
</head>
<body>
${C.body}
<main class="em">
${hero}
${ticker}
${chapters}
${sections.map((s) => renderSection(s, { page, lang, spec })).join('\n')}
</main>
${C.tail}
<script defer src="/assets/search.js"></script>
<script defer src="/assets/emag.js?v=${VER.js}"></script>
</body>
</html>
`;
}

// ---------- đăng ký sitemap + search.js ----------
function register(spec) {
  let sm = read('sitemap.xml'), changed = false;
  for (const p of Object.values(spec.pages)) {
    const loc = ORIGIN + p.path;
    if (!sm.includes(`<loc>${loc}</loc>`)) { sm = sm.replace('</urlset>', `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${spec.updated}</lastmod>\n  </url>\n</urlset>`); changed = true; }
  }
  if (changed) fs.writeFileSync(rel('sitemap.xml'), sm);
  let js = read('assets/search.js');
  const entries = ['en', 'vi'].map((l) => spec.pages[l]).filter((p) => !js.includes(`"url": "${p.path}"`)).map((p) => `  {
    "title": ${JSON.stringify(p.meta.title)},
    "url": "${p.path}",
    "cat": "${spec.searchCat || 'Gaming'}",
    "date": "${spec.updated}",
    "excerpt": ${JSON.stringify(p.meta.description)},
    "img": ${JSON.stringify(spec.searchImg)},
    "tags": []
  },`);
  if (entries.length) { js = js.replace('window.IDX = [\n', 'window.IDX = [\n' + entries.join('\n') + '\n'); fs.writeFileSync(rel('assets/search.js'), js); }
  return changed || entries.length > 0;
}

// ---------- chạy ----------
const specFiles = fs.readdirSync(rel('src/emag/')).filter((f) => f.endsWith('.mjs'));
let failed = false;
for (const f of specFiles) {
  const spec = (await import(new URL('src/emag/' + f, root).href)).default;
  if (ONLY.length && !ONLY.includes(spec.slug)) continue;
  const errors = validate(spec, { exists, read });
  if (errors.length) {
    failed = true;
    console.error(`✗ ${spec.slug}: ${errors.length} lỗi trong spec`);
    errors.forEach((e) => console.error('  - ' + e));
    continue;
  }
  console.log(`✓ ${spec.slug}: spec hợp lệ`);
  for (const lang of ['vi', 'en']) {
    const file = spec.pages[lang].file, html = renderPage(spec, lang);
    const cur = exists(file) ? read(file) : '';
    // phần menu do sync-site-chrome quản lý (nút nổi bật, mục đang xem): so sánh sau khi bỏ khối menu
    const strip = (s) => s.replace(/<ul class="nav-links">[\s\S]*?<\/ul>/, '').replace(/<style data-hot-m>[\s\S]*?<\/style><a [^>]*class="nav-hot-m"[\s\S]*?<\/a>/, '').replace(/<nav class="mobile-nav"[\s\S]*?<\/nav>/, '');
    if (strip(cur) === strip(html)) { console.log(`  ${file}: đã khớp`); continue; }
    if (CHECK) { failed = true; console.log(`  ${file}: LỆCH so với spec (chạy npm run emag)`); continue; }
    fs.writeFileSync(rel(file), html);
    console.log(`  ${file}: đã ghi (${(html.length / 1024).toFixed(0)} KB)`);
  }
  if (!CHECK) console.log(register(spec) ? '  đã đăng ký sitemap / search.js' : '  sitemap / search.js đã có');
}
if (failed) process.exit(1);
