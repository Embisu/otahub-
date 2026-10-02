// Giữ bảng xếp hạng ở trang chủ (VI + EN) khớp với /rankings và catalog.
//
// Nguồn dữ liệu: const CATS trong rankings.html / en/rankings.html.
//   1. Sửa điểm hoặc thứ tự trong CATS.
//   2. npm run rankings:sync   (đẩy điểm sang assets/catalog.json)
//   3. npm run rankings:home   (script này)
//
// Script này:
//   - dựng lại 2 thẻ PC / Mobile ở trang chủ từ top 5 của CATS;
//   - ghi điểm catalog vào các mục manga/manhwa/manhua có link -detail, rồi sắp lại cột theo điểm;
//   - cập nhật nhãn ngày, JSON-LD ItemList và bản <noscript> trong trang rankings.
import fs from 'node:fs';
import vm from 'node:vm';

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
    ...group.top.map((t) => ({ title: t.title, url: t.url, img: t.img, score: t.score, sub: t.studio, tag: t.tag })),
    ...group.rest.map((r) => ({ title: r.title, url: r.url, img: r.img, score: r.score, sub: `${r.studio} · ${r.sub}`, pills: r.pills }))
  ];
  return all.map((x, i) => ({ ...x, i })).sort((a, b) => parseFloat(b.score) - parseFloat(a.score) || a.i - b.i);
}

function cardItem(item, idx, prefix, type) {
  const color = SCORE_COLORS[idx];
  const pills = [];
  if (item.tag) pills.push(`<span class="rk-tag-pill" style="border-color:${item.tag.c};color:${item.tag.t}">${esc(item.tag.l)}</span>`);
  for (const p of item.pills || []) pills.push(`<span class="rk-tag-pill" style="border-color:${p.c};color:${p.t}">${esc(p.l)}</span>`);
  const tags = pills.length ? `<div class="rk-tags">${pills.join('')}</div>` : '';
  // link thẳng tới bài review (nguồn của điểm); dữ liệu cũ không có url thì về trang hồ sơ
  const href = item.url || `${prefix}/${type}-detail?t=${encodeURIComponent(item.title)}`;
  const top = idx < 3 ? ` top${idx + 1}` : '';
  const width = `${Math.round(parseFloat(item.score) * 10)}%`;
  return `<a class="rk-item${top}" href="${href}"><div class="rk-num">${pad(idx + 1)}</div><div class="rk-thumb"><img src="${item.img}" alt="${esc(item.title)}" loading="lazy" width="76" height="76"></div><div class="rk-info"><div class="rk-name">${esc(item.title)}</div><div class="rk-sub">${esc(item.sub)}</div>${tags}</div><div class="rk-score-col"><div class="rk-score" style="color:${color}">${item.score}</div><div class="rk-bar-wrap"><div class="rk-bar" data-w="${width}" style="background:${color}"></div></div></div></a>`;
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

function mangaEntry(body) {
  const title = (body.match(/class="mi-title">([^<]*)</) || [])[1];
  const key = MANGA_ENTRY[title];
  const entry = key && catalog[key];
  return entry && entry.type === 'manga' && !isNaN(parseFloat(entry.score)) ? { key, entry } : null;
}

function syncMangaColumns(html, prefix) {
  const itemRe = /<a class="manga-item[^"]*" href="([^"]+)">([\s\S]*?)<\/a>/g;
  let from = 0;
  for (;;) {
    const colAt = html.indexOf('<div class="manga-col">', from);
    if (colAt < 0) break;
    const colEnd = matchingClose(html, colAt);
    const col = html.slice(colAt, colEnd);
    const found = [...col.matchAll(itemRe)];
    if (found.length) {
      const items = found.map((m, i) => {
        const hit = mangaEntry(m[2]);
        const href = hit ? `${prefix}/manga-detail?t=${encodeURIComponent(hit.key)}` : m[1];
        const score = hit ? hit.entry.score : m[2].match(/class="mi-score"[^>]*>([\d.]+)</)[1];
        return { href, body: m[2], score, i };
      }).sort((a, b) => parseFloat(b.score) - parseFloat(a.score) || a.i - b.i);
      const built = items.map((it, idx) => {
        const body = it.body
          .replace(/<div class="mi-num">\d+<\/div>/, `<div class="mi-num">${pad(idx + 1)}</div>`)
          .replace(/(class="mi-score" style="color:)[^"]*(">)[\d.]+(<)/, `$1${SCORE_COLORS[idx]}$2${it.score}$3`);
        return `<a class="manga-item${idx < 3 ? ` top${idx + 1}` : ''}" href="${it.href}">${body}</a>`;
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

function syncBadges(html, lang) {
  return html.replace(/(<span class="rk-badge[^"]*"[^>]*>)(?:Tuần \d+|Week \d+|Cập nhật [^<]*|Updated [^<]*)(<\/span>)/g, `$1${LABEL[lang].badge}$2`);
}

function syncHome(file, rankingsFile, prefix, lang) {
  const cats = loadCats(rankingsFile);
  let html = read(file);
  html = syncRankCards(html, cats, prefix);
  html = syncMangaColumns(html, prefix);
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

// Kiểm tra: điểm trong CATS phải khớp catalog.
for (const file of ['rankings.html', 'en/rankings.html']) {
  const aliases = { 'Jujutsu Kaisen': 'Jujutsu Kaisen (Anime)', 'Chainsaw Man': 'Chainsaw Man (Anime)' };
  for (const [cat, group] of Object.entries(loadCats(file))) {
    for (const it of [...group.top, ...group.rest]) {
      const key = cat === 'anime' ? aliases[it.title] || it.title : it.title;
      const entry = catalog[key];
      if (!entry) console.warn(`  ! ${file}: "${it.title}" chưa có trong catalog`);
      else if (String(entry.score) !== String(it.score)) console.warn(`  ! ${file}: "${it.title}" ${it.score} ≠ catalog ${entry.score}; chạy npm run rankings:sync`);
    }
  }
}

syncHome('index.html', 'rankings.html', '', 'vi');
syncHome('en/index.html', 'en/rankings.html', '/en', 'en');
syncRankingsPage('rankings.html', '', 'vi');
syncRankingsPage('en/rankings.html', '/en', 'en');
