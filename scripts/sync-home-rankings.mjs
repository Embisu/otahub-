// Giữ bảng xếp hạng ở trang chủ (VI + EN) khớp với /rankings và catalog.
//
// Nguồn dữ liệu: const CATS trong rankings.html / en/rankings.html.
//   1. Sửa điểm hoặc thứ tự trong CATS.
//   2. npm run rankings:sync   (đẩy điểm sang assets/catalog.json)
//   3. npm run rankings:home   (script này)
//
// Script này:
//   - dựng lại 2 thẻ PC / Mobile ở trang chủ từ top 5 của CATS;
//   - cột manga/manhwa/manhua: chỉ hiện điểm có nguồn review (catalog / bài review), tựa có điểm xếp trước;
//   - cập nhật nhãn ngày, JSON-LD ItemList và bản <noscript> trong trang rankings.
import fs from 'node:fs';
import vm from 'node:vm';
import { verifiedReviews } from './lib/review-scores.mjs';
import { profilePaths } from './lib/profile-paths.mjs';
import { profileKeyForReview } from './lib/profile-review-map.mjs';

const UPDATED = { y: 2026, m: 10, d: 1 };
const pad = (n) => String(n).padStart(2, '0');
const LABEL = {
  vi: { badge: `Cập nhật ${pad(UPDATED.m)}/${UPDATED.y}` },
  en: { badge: `Updated ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][UPDATED.m - 1]} ${UPDATED.y}` }
};
const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const write = (f, s) => fs.writeFileSync(new URL(f, root), s, 'utf8');
const catalog = JSON.parse(read('assets/catalog.json'));
const PROFILE_PATHS = profilePaths(catalog); // "type|Khóa" -> /type/slug (trang hồ sơ tĩnh)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SCORE_COLORS = ['var(--amber)', 'var(--cyan)', 'var(--green)', 'var(--lavender)', 'var(--sakura)'];
const TYPE = { game: 'game', pc: 'game', mobile: 'game', anime: 'anime', manga: 'manga' };

function loadCats(file) {
  const m = read(file).match(/const CATS\s*=\s*(\{[\s\S]*?\n\})\s*;/);
  if (!m) throw new Error('Không tìm thấy CATS trong ' + file);
  const scope = {};
  vm.runInNewContext(`data=${m[1]}`, scope);
  return scope.data;
}

// Tìm cặp </div> đóng của thẻ <div> mở tại vị trí `start`.
function matchingClose(html, start) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  throw new Error('Không đóng được thẻ div');
}

function rankedItems(group) {
  const all = [
    ...group.top.map((t) => ({ title: t.title, url: t.url, profile: t.profile, img: t.img, score: t.score, studio: t.studio, sub: t.studio, tag: t.tag })),
    ...group.rest.map((r) => ({ title: r.title, url: r.url, profile: r.profile, img: r.img, score: r.score, studio: r.studio, subOnly: r.sub, sub: `${r.studio} · ${r.sub}`, pills: r.pills }))
  ];
  return all.map((x, i) => ({ ...x, i })).sort((a, b) => parseFloat(b.score) - parseFloat(a.score) || a.i - b.i);
}

// Link hồ sơ của một tựa trên bảng xếp hạng (khóa hồ sơ do build-rankings.mjs ghi vào CATS).
function profileHref(item, prefix, type) {
  if (item.profile) return (PROFILE_PATHS[`${type}|${item.profile}`] && prefix + PROFILE_PATHS[`${type}|${item.profile}`]) || `${prefix}/${type}-detail?t=${encodeURIComponent(item.profile)}`;
  return item.url || `${prefix}/${type}-detail?t=${encodeURIComponent(item.title)}`;
}

function cardItem(item, idx, prefix, type) {
  const color = SCORE_COLORS[idx];
  const pills = [];
  if (item.tag) pills.push(`<span class="rk-tag-pill" style="border-color:${item.tag.c};color:${item.tag.t}">${esc(item.tag.l)}</span>`);
  for (const p of item.pills || []) pills.push(`<span class="rk-tag-pill" style="border-color:${p.c};color:${p.t}">${esc(p.l)}</span>`);
  const tags = pills.length ? `<div class="rk-tags">${pills.join('')}</div>` : '';
  // Bấm vào tựa mở trang hồ sơ (có điểm + link bài review); tựa chưa có hồ sơ thì về thẳng bài review.
  const href = profileHref(item, prefix, type);
  const top = idx < 3 ? ` top${idx + 1}` : '';
  const width = `${Math.round(parseFloat(item.score) * 10)}%`;
  return `<a class="rk-item${top}" href="${href}"><div class="rk-num">${pad(idx + 1)}</div><div class="rk-thumb"><img src="${thumbS(item.img)}" alt="${esc(item.title)}" loading="lazy" width="76" height="76"></div><div class="rk-info"><div class="rk-name">${esc(item.title)}</div><div class="rk-sub">${esc(item.sub)}</div>${tags}</div><div class="rk-score-col"><div class="rk-score" style="color:${color}">${item.score}</div><div class="rk-bar-wrap"><div class="rk-bar" data-w="${width}" style="background:${color}"></div></div></div></a>`;
}

function syncRankCards(html, cats, prefix) {
  const keys = cats.game ? ['game', 'anime'] : ['pc', 'mobile'];
  let from = 0;
  for (const key of keys) {
    const cardAt = html.indexOf('<div class="rk-card">', from);
    if (cardAt < 0) throw new Error('Thiếu rk-card cho ' + key);
    const listAt = html.indexOf('<div class="rk-list">', cardAt);
    const listEnd = matchingClose(html, listAt);
    const items = rankedItems(cats[key]).slice(0, 5).map((it, i) => cardItem(it, i, prefix, TYPE[key])).join('\n\n\n        ');
    html = `${html.slice(0, listAt)}<div class="rk-list">\n\n\n        ${items}\n\n\n      </div>${html.slice(listEnd)}`;
    from = listAt + 20;
  }
  return html;
}

// Tên hiển thị ở trang chủ -> khóa hồ sơ manga trong catalog.
// Mục có hồ sơ thì link vào trang detail và lấy điểm catalog; mục chưa có hồ sơ giữ link bài review và điểm cũ.
const MANGA_ENTRY = {
  'Jujutsu Kaisen': 'Jujutsu Kaisen',
  'One Piece': 'One Piece',
  'Chainsaw Man': 'Chainsaw Man (Manga)',
  'Berserk': 'Berserk',
  'The Beginning After The End': 'The Beginning After The End',
  'Omniscient Reader': 'Omniscient Reader',
  'God of Blackfield': 'God of Blackfield',
  'Second Life Ranker': 'Second Life Ranker',
  'Swallowed Star': 'Swallowed Star',
  'Martial Peak': 'Martial Peak',
  'Rebirth of the Urban Immortal': 'Rebirth of the Urban Immortal',
  'Wu Shen Zhu Zai': 'Wu Shen Zhu Zai'
};

// Ghép theo tên hiển thị (MANGA_ENTRY); không có thì ghép qua bài review mà thẻ đang trỏ tới
const REVIEW_ID_BY_URL = new Map([...verifiedReviews().values()].flatMap((r) => [[r.url, r.id], [r.enUrl, r.id]]));
function mangaEntry(body, url) {
  const title = (body.match(/class="mi-title">([^<]*)</) || [])[1];
  const key = MANGA_ENTRY[title] || (REVIEW_ID_BY_URL.has(url) ? profileKeyForReview(catalog, REVIEW_ID_BY_URL.get(url), 'manga') : null);
  const entry = key && catalog[key];
  return entry && entry.type === 'manga' ? { key, entry } : null;
}

// Điểm chỉ hiện khi có nguồn review: hồ sơ (catalog, do sync-profile-scores.mjs ghi) hoặc bài review hợp lệ.
const reviewScoreByUrl = new Map([...verifiedReviews().values()].flatMap((r) => [[r.url, r.score.toFixed(1)], [r.enUrl, r.score.toFixed(1)]]));

// Cột "Manga" = top 5 của bảng xếp hạng manga (/rankings), bấm vào mở hồ sơ (chưa có hồ sơ thì về bài review).
function mangaItemHtml(it, idx, prefix) {
  const meta = it.studio || '';
  return `<a class="manga-item${idx < 3 ? ` top${idx + 1}` : ''}" href="${profileHref(it, prefix, 'manga')}"><div class="mi-num">${pad(idx + 1)}</div><div class="mi-thumb"><img src="${thumbS(it.img)}" alt="${esc(it.title)}" loading="lazy" width="46" height="62"></div><div><div class="mi-title">${esc(it.title)}</div><div class="mi-meta">${esc(meta)}</div></div><div class="mi-score" style="color:${SCORE_COLORS[idx]}">${it.score}</div></a>`;
}

function syncMangaColumns(html, prefix, mangaTop) {
  const itemRe = /<a class="manga-item[^"]*" href="([^"]+)">([\s\S]*?)<\/a>/g;
  let from = 0;
  for (;;) {
    const colAt = html.indexOf('<div class="manga-col">', from);
    if (colAt < 0) break;
    const colEnd = matchingClose(html, colAt);
    const col = html.slice(colAt, colEnd);
    const found = [...col.matchAll(itemRe)];
    const colTitle = ((col.match(/class="manga-col-title"[^>]*>([^<]*)</) || [])[1] || '').trim();
    if (found.length && colTitle === 'Manga') {
      const built = mangaTop.map((it, i) => mangaItemHtml(it, i, prefix)).join('\n\n\n      ');
      const start = col.indexOf(found[0][0]);
      const end = col.lastIndexOf(found[found.length - 1][0]) + found[found.length - 1][0].length;
      const newCol = col.slice(0, start) + built + col.slice(end);
      html = html.slice(0, colAt) + newCol + html.slice(colEnd);
      from = colAt + newCol.length;
    } else if (found.length) {
      const items = found.map((m, i) => {
        const hit = mangaEntry(m[2], m[1]);
        const href = hit ? (PROFILE_PATHS[`manga|${hit.key}`] ? prefix + PROFILE_PATHS[`manga|${hit.key}`] : `${prefix}/manga-detail?t=${encodeURIComponent(hit.key)}`) : m[1];
        const score = hit ? hit.entry.score : reviewScoreByUrl.get(m[1]) || null;
        return { href, body: m[2].replace(/<div class="mi-score"[^>]*>[^<]*<\/div>/, ''), score, i };
      }).sort((a, b) => (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0) || a.i - b.i);
      // Chỉ tựa có điểm review mới có số thứ hạng; tựa chưa chấm điểm hiện "–" và xếp sau.
      let rank = 0;
      const built = items.map((it) => {
        const scored = !!it.score;
        const idx = scored ? rank++ : -1;
        const scoreHtml = scored ? `<div class="mi-score" style="color:${SCORE_COLORS[idx] || 'var(--muted)'}">${it.score}</div>` : '';
        const body = it.body.replace(/<div class="mi-num">[^<]*<\/div>/, `<div class="mi-num">${scored ? pad(idx + 1) : '–'}</div>`).replace(/<\/div>\s*$/, `</div>${scoreHtml}`);
        return `<a class="manga-item${scored && idx < 3 ? ` top${idx + 1}` : ''}" href="${it.href}">${body}</a>`;
      }).join('\n\n\n      ');
      const start = col.indexOf(found[0][0]);
      const end = col.lastIndexOf(found[found.length - 1][0]) + found[found.length - 1][0].length;
      const newCol = col.slice(0, start) + built + col.slice(end);
      html = html.slice(0, colAt) + newCol + html.slice(colEnd);
      from = colAt + newCol.length;
    } else {
      from = colEnd;
    }
  }
  return html;
}

// Khung bên của trang chuyên mục (gaming/anime/manga): top 5 của đúng bảng xếp hạng chuyên mục đó
const SIDE_HEAD = {
  vi: { game: '🏆 Top 5 Game · OtaHub', anime: '🏆 Top 5 Anime · OtaHub', manga: '🏆 Top 5 Manga · OtaHub' },
  en: { game: '🏆 Top 5 Games · OtaHub', anime: '🏆 Top 5 Anime · OtaHub', manga: '🏆 Top 5 Manga · OtaHub' }
};
const thumbS = (u) => (/^\/assets\/img\/(?!_[ts]\/|brand\/)[^?#]+\.(jpe?g|png|webp|jfif)$/i.test(u || '') ? '/assets/img/_s/' + u.slice(12) + '.webp' : u);
function syncSideTop(file, rankingsFile, cat, lang) {
  const group = loadCats(rankingsFile)[cat];
  const items = [
    ...group.top.map((t) => ({ title: t.title, url: t.url, profile: t.profile, img: t.img, score: t.score, sub: [t.studio, t.genre].filter(Boolean).join(' · ') })),
    ...group.rest.map((r) => ({ title: r.title, url: r.url, profile: r.profile, img: r.img, score: r.score, sub: [r.studio, r.sub].filter(Boolean).join(' · ') }))
  ].slice(0, 5);
  let html = read(file);
  const headRe = /<div class="side-head" id="side-head">[^<]*<\/div>/;
  const at = html.search(headRe);
  if (at < 0) throw new Error('Thiếu side-head trong ' + file);
  const boxStart = html.lastIndexOf('<div class="side-box">', at);
  const boxEnd = matchingClose(html, boxStart);
  const rows = items.map((it, i) => `<a class="rk t${i + 1}" href="${profileHref(it, lang === 'en' ? '/en' : '', cat)}">
          <div class="rk-num">${i + 1}</div>
          <div class="rk-poster"><img src="${thumbS(it.img)}" alt="${esc(it.title)}" loading="lazy" width="46" height="62"></div>
          <div class="rk-info"><div class="rk-title">${esc(it.title)}</div><div class="rk-sub">${esc(it.sub)}</div></div>
          <div class="rk-score">${it.score}</div>
        </a>`).join('\n        ');
  const box = `<div class="side-box">
        <div class="side-head" id="side-head">${SIDE_HEAD[lang][cat]}</div>
        ${rows}
      </div>`;
  write(file, html.slice(0, boxStart) + box + html.slice(boxEnd));
  console.log(`${file}: khung top 5 ${cat}`);
}

function syncBadges(html, lang) {
  return html.replace(/(<span class="rk-badge[^"]*"[^>]*>)(?:Tuần \d+|Week \d+|Cập nhật [^<]*|Updated [^<]*)(<\/span>)/g, `$1${LABEL[lang].badge}$2`);
}

function syncHome(file, rankingsFile, prefix, lang) {
  const cats = loadCats(rankingsFile);
  let html = read(file);
  html = syncRankCards(html, cats, prefix);
  html = syncMangaColumns(html, prefix, rankedItems(cats.manga).slice(0, 5));
  html = syncBadges(html, lang);
  write(file, html);
  console.log(`${file}: đã đồng bộ`);
}

function syncRankingsPage(file, prefix, lang) {
  const cats = loadCats(file);
  const origin = 'https://otahub.asia';
  const order = Object.keys(cats);
  const lists = order.map((key) => {
    const items = rankedItems(cats[key]);
    return { key, label: cats[key].label, items, url: (t) => { const it = items.find((x) => x.title === t); return it && it.url ? origin + it.url : `${origin}${prefix}/${TYPE[key]}-detail?t=${encodeURIComponent(t)}`; } };
  });
  const ld = {
    '@context': 'https://schema.org',
    '@graph': lists.map((l) => ({
      '@type': 'ItemList',
      name: `${l.label} ${lang === 'vi' ? 'xếp hạng OtaHub' : 'OtaHub ranking'}`,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: l.items.length,
      itemListElement: l.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.title, url: l.url(it.title) }))
    }))
  };
  const ldTag = `<script type="application/ld+json" id="rankings-itemlist">${JSON.stringify(ld)}</script>`;
  const noscript = '<noscript>' + lists.map((l) =>
    `<h2>${esc(l.label)}</h2><ol>${l.items.map((it) => `<li><a href="${l.url(it.title).replace(origin, '')}">${esc(it.title)}</a> · ${it.score}/10</li>`).join('')}</ol>`
  ).join('') + '</noscript>';

  let html = read(file);
  html = /<script type="application\/ld\+json" id="rankings-itemlist">[\s\S]*?<\/script>/.test(html)
    ? html.replace(/<script type="application\/ld\+json" id="rankings-itemlist">[\s\S]*?<\/script>/, () => ldTag)
    : html.replace('</head>', () => `${ldTag}\n</head>`);
  html = html.replace(/<div id="rk-content">[\s\S]*?<\/div>/, () => `<div id="rk-content">${noscript}</div>`);
  write(file, html);
  console.log(`${file}: ItemList + noscript (${lists.reduce((n, l) => n + l.items.length, 0)} mục)`);
}

syncHome('index.html', 'rankings.html', '', 'vi');
syncHome('en/index.html', 'en/rankings.html', '/en', 'en');
// Trang Tin mới dùng cùng khối bảng xếp hạng / truyện tranh với trang chủ
syncHome('news.html', 'rankings.html', '', 'vi');
syncHome('en/news.html', 'en/rankings.html', '/en', 'en');
for (const [cat, page] of [['game', 'gaming'], ['anime', 'anime'], ['manga', 'manga']]) {
  syncSideTop(`${page}.html`, 'rankings.html', cat, 'vi');
  syncSideTop(`en/${page}.html`, 'en/rankings.html', cat, 'en');
}
syncRankingsPage('rankings.html', '', 'vi');
syncRankingsPage('en/rankings.html', '/en', 'en');
// Trang Chơi gì (VI + EN): khối "Điểm cao nhất" lấy top 5 từ CATS, điểm từng tựa lấy từ bài review
await import('./build-choi-gi.mjs');
