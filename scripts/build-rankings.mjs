// Bảng xếp hạng OtaHub = điểm từ BÀI REVIEW đã đăng. Không có điểm nhập tay.
//
// Quy tắc (chặt, script dừng nếu vi phạm — không ghi gì):
//   1. Nguồn: danh sách review ở reviews.html (VI) / en/reviews.html (EN), mảng const REVIEWS.
//      Chỉ tính mục có bài review thật (url trỏ tới file bài, không phải trang -detail?t=).
//   2. Bài đó phải có ô điểm chuẩn <div class="score-num">X</div>; điểm ô = điểm trong REVIEWS.
//      Bài review có ô điểm nhưng chưa có trong REVIEWS -> lỗi (phải thêm vào trang Đánh giá).
//   3. Mỗi tác phẩm 1 mục: các bài của cùng một game live-service (SAME_WORK) chỉ lấy bài mới nhất.
//      Phần cứng/không phải tác phẩm (NOT_RANKED) không xếp hạng.
//   4. Thứ tự: điểm giảm dần -> bằng điểm thì bài mới hơn trước -> tên A-Z.
//   5. Mỗi bảng (Game, Anime, Manga) ĐÚNG 10 mục; bảng nào chưa đủ 10 -> lỗi.
//   6. Bản EN dùng cùng thứ hạng với bản VI (cùng id), lấy tên/link/ảnh từ en/reviews.html.
//
// Chạy:  node scripts/build-rankings.mjs          (kiểm tra + ghi rankings.html, en/rankings.html)
//        node scripts/build-rankings.mjs --check  (chỉ kiểm tra)
// Cả chuỗi (xếp hạng -> hồ sơ -> trang chủ/chuyên mục -> ảnh thu nhỏ): npm run scores
import fs from 'node:fs';
import vm from 'node:vm';

const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const write = (f, s) => fs.writeFileSync(new URL(f, root), s, 'utf8');
const exists = (f) => fs.existsSync(new URL(f, root));

const CATS_ORDER = ['game', 'anime', 'manga'];
const TOP_N = 10;
// Không phải tác phẩm để xếp hạng
const NOT_RANKED = { ns2: 'phần cứng (máy Nintendo Switch 2)', wuwa24: 'bài phân tích bản cập nhật 3.6, không chấm điểm trong bài' };
// Cùng một tác phẩm (game cập nhật liên tục): chỉ lấy bài mới nhất
const SAME_WORK = { gs70sn: 'genshin', gsnat: 'genshin', wuwa: 'wuthering-waves', wuwa24: 'wuthering-waves' };
const TEMPLATES = new Set(['article.html', 'bai-viet.html']);

const errors = [];
const fail = (m) => errors.push(m);

function loadReviews(file) {
  const html = read(file);
  const m = html.match(/const REVIEWS\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!m) throw new Error('Không tìm thấy const REVIEWS trong ' + file);
  const scope = { Date };
  vm.runInNewContext('data=' + m[1], scope);
  return scope.data;
}
const articleFile = (url) => {
  const p = url.split('?')[0].split('#')[0].replace(/^\//, '');
  if (!p || /-detail$/.test(p)) return null;
  return exists(p + '.html') ? p + '.html' : null;
};
function articleInfo(file) {
  const s = read(file);
  const sc = s.match(/class="(?:score-num|vb-score)"[^>]*>\s*([0-9]+(?:[.,][0-9])?)/);
  const date = (s.match(/article:published_time" content="(\d{4}-\d{2}-\d{2})/) || [])[1] || '';
  const og = (s.match(/<meta property="og:image" content="https:\/\/otahub\.asia([^"]+)"/) || [])[1] || '';
  return { score: sc ? parseFloat(sc[1].replace(',', '.')) : null, date, og };
}
const cleanTitle = (t) => t.replace(/\\'/g, "'")
  .replace(/\s*[,:–-]?\s*(?:Review|review)\s*$/, '')
  .replace(/\s*Review:.*$/, '').trim();
// Tên tác phẩm hiển thị trong bảng (tiêu đề bài review thường kèm "Review", "Anime", phiên bản...)
const DISPLAY = {
  gs70sn: ['Genshin Impact', 'Genshin Impact'], gsnat: ['Genshin Impact', 'Genshin Impact'],
  wuwa: ['Wuthering Waves', 'Wuthering Waves'], kcd2: ['Kingdom Come: Deliverance II', 'Kingdom Come: Deliverance II'],
  jjkanime: ['Jujutsu Kaisen', 'Jujutsu Kaisen'], onkanime: ['Oshi no Ko', 'Oshi no Ko'], csmanime: ['Chainsaw Man', 'Chainsaw Man'],
  csmreze: ['Chainsaw Man – Reze Arc (phim)', 'Chainsaw Man – Reze Arc (film)'], dsic: ['Demon Slayer: Infinity Castle (phim)', 'Demon Slayer: Infinity Castle (film)'],
  csmmanga2: ['Chainsaw Man', 'Chainsaw Man'], vlsaga: ['Vinland Saga', 'Vinland Saga'], bcfv: ['Black Clover', 'Black Clover'],
  jjkfinal: ['Jujutsu Kaisen (arc cuối)', 'Jujutsu Kaisen (final arc)'], sm2cr: ['Warhammer 40,000: Space Marine 2', 'Warhammer 40,000: Space Marine 2'],
  kj8m: ['Kaiju No.8', 'Kaiju No.8'], kj8game: ['Kaiju No.8 THE GAME', 'Kaiju No.8 THE GAME'], ddd2: ['Dandadan mùa 2', 'Dandadan Season 2']
};
const workTitle = (r, lang) => (DISPLAY[r.id] ? DISPLAY[r.id][lang === 'en' ? 1 : 0] : cleanTitle(r.title));

// Thể loại tiếng Việt cho bản VI
const SEG_VI = { 'Action RPG': 'Nhập vai hành động', 'Co-op Adventure': 'Phiêu lưu co-op', 'Action': 'Hành động', 'Turn-based RPG': 'Nhập vai theo lượt',
  'Tactical RPG': 'Nhập vai chiến thuật', 'Turn-Based Tactical': 'Chiến thuật theo lượt', 'Action-Adventure': 'Hành động phiêu lưu', 'Drama': 'Chính kịch',
  'Co-op Puzzle': 'Giải đố co-op', 'Dark Fantasy': 'Kỳ ảo đen tối', 'Comedy': 'Hài', 'Historical': 'Lịch sử', 'Adventure': 'Phiêu lưu',
  'Anime Film': 'Phim anime', 'Action-Horror': 'Hành động kinh dị', 'Souls-like Action RPG': 'Souls-like', 'Action Stealth Remake': 'Hành động lén lút (làm lại)',
  'Gacha RPG': 'Nhập vai gacha', 'Mobile RPG': 'Nhập vai di động', 'Co-op Action': 'Hành động co-op', 'Third-person Action': 'Hành động góc nhìn thứ ba' };
const splitSub = (sub, vi) => {
  const parts = String(sub || '').split(' · ').map((x) => x.trim()).filter(Boolean);
  const studio = parts[0] || '';
  let genre = parts[1] || '';
  if (vi) genre = SEG_VI[genre] || genre;
  return { studio, genre };
};

const vi = loadReviews('reviews.html');
const en = loadReviews('en/reviews.html');
const enById = new Map(en.map((r) => [r.id, r]));

// Bài có ô điểm phải nằm trong danh sách review
const hubFiles = new Set(vi.map((r) => articleFile(r.url)).filter(Boolean));
for (const f of fs.readdirSync(new URL('.', root))) {
  if (!f.endsWith('.html') || TEMPLATES.has(f) || hubFiles.has(f)) continue;
  const s = read(f);
  if (/class="(?:score-num|vb-score)"/.test(s)) fail(`Bài "${f}" có ô điểm nhưng chưa có trong danh sách reviews.html`);
}

const candidates = { game: [], anime: [], manga: [] };
for (const r of vi) {
  if (!candidates[r.type]) continue;
  if (NOT_RANKED[r.id]) continue;
  const f = articleFile(r.url);
  if (!f) continue; // không có bài review thật (vd. trang -detail) -> không tính
  const a = articleInfo(f);
  if (a.score === null) { fail(`${f}: thiếu ô điểm (.score-num) — không thể xếp hạng "${r.title}"`); continue; }
  if (Math.abs(a.score - parseFloat(r.score)) > 0.001) { fail(`${f}: ô điểm ${a.score} ≠ reviews.html ${r.score} (${r.id})`); continue; }
  const e = enById.get(r.id);
  if (!e) { fail(`en/reviews.html thiếu mục id "${r.id}" (${r.title})`); continue; }
  const ef = articleFile(e.url);
  if (!ef) { fail(`en/reviews.html "${r.id}": link không trỏ tới bài EN (${e.url})`); continue; }
  const ea = articleInfo(ef);
  if (ea.score === null || Math.abs(ea.score - a.score) > 0.001) { fail(`${ef}: ô điểm EN ${ea.score} ≠ VI ${a.score} (${r.id})`); continue; }
  candidates[r.type].push({ id: r.id, work: SAME_WORK[r.id] || r.id, score: a.score, date: a.date, vi: r, en: e, img: r.img || a.og, enImg: e.img || ea.og });
}

const cmp = (a, b) => b.score - a.score || (b.date || '').localeCompare(a.date || '') || workTitle(a.vi,'vi').localeCompare(workTitle(b.vi,'vi'));
const result = {};
for (const cat of CATS_ORDER) {
  const latest = new Map();
  for (const c of candidates[cat]) {
    const prev = latest.get(c.work);
    if (!prev || (c.date || '') > (prev.date || '')) latest.set(c.work, c);
  }
  const list = [...latest.values()].sort(cmp);
  if (list.length < TOP_N) fail(`Bảng ${cat}: chỉ có ${list.length} tác phẩm có bài review hợp lệ (cần ${TOP_N})`);
  result[cat] = list.slice(0, TOP_N);
}

if (errors.length) {
  console.error('KHÔNG cập nhật bảng xếp hạng, cần sửa:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
for (const cat of CATS_ORDER) console.log(`${cat}: ` + result[cat].map((c, i) => `${i + 1}. ${workTitle(c.vi,'vi')} ${c.score.toFixed(1)}`).join(' | '));
if (CHECK) process.exit(0);

// ---- Ghi CATS + tab + noscript/ItemList vào trang Xếp hạng ----
const LABEL = { vi: { game: 'Game', anime: 'Anime', manga: 'Manga' }, en: { game: 'Games', anime: 'Anime', manga: 'Manga' } };
const ACCENT = { game: 'var(--cyan)', anime: 'var(--sakura)', manga: 'var(--lavender)' };
const q = (s) => JSON.stringify(String(s));
function catsLiteral(lang) {
  const isVi = lang === 'vi';
  const out = [];
  for (const cat of CATS_ORDER) {
    const items = result[cat].map((c) => {
      const r = isVi ? c.vi : c.en;
      const { studio, genre } = splitSub(r.sub, isVi);
      return { title: workTitle(r, lang), url: r.url, img: isVi ? c.img : c.enImg, studio, genre, score: c.score.toFixed(1), date: c.date };
    });
    const top = items.slice(0, 3).map((t) => `      {img:${q(t.img)},title:${q(t.title)},url:${q(t.url)},studio:${q(t.studio)},genre:${q(t.genre)},score:${q(t.score)},date:${q(t.date)},trend:'=',trendDir:'eq',tag:null,tagAcc:'rgba(251,191,36,.3)'}`);
    const rest = items.slice(3).map((t) => `      {img:${q(t.img)},title:${q(t.title)},url:${q(t.url)},studio:${q(t.studio)},sub:${q(t.genre)},score:${q(t.score)},date:${q(t.date)},sc:'var(--cyan)',w:${q(Math.round(parseFloat(t.score) * 10) + '%')},trend:'=',dir:'eq',pills:[]}`);
    out.push(`  ${cat}:{\n    label:${q(LABEL[lang][cat])},accent:${q(ACCENT[cat])},\n    top:[\n${top.join(',\n')}\n    ],\n    rest:[\n${rest.join(',\n')}\n    ]\n  }`);
  }
  return '{\n' + out.join(',\n') + '\n}';
}
const TAB_ICON = {
  game: '<svg class="tab-icon" width="16" height="16" viewbox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" stroke-width="1.5"></rect><path d="M7 12h4M9 10v4" stroke="currentColor" stroke-width="1.5"></path><circle cx="16" cy="11" r="1" fill="currentColor"></circle><circle cx="18" cy="13" r="1" fill="currentColor"></circle></svg>',
  anime: '<svg class="tab-icon" width="16" height="16" viewbox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"></circle><ellipse cx="9" cy="11" rx="1.5" ry="2" fill="currentColor"></ellipse><ellipse cx="15" cy="11" rx="1.5" ry="2" fill="currentColor"></ellipse></svg>',
  manga: '<svg class="tab-icon" width="14" height="16" viewbox="0 0 14 18" fill="none"><rect x="1" y="1" width="12" height="16" stroke="currentColor" stroke-width="1.5"></rect><path d="M4 6h6M4 10h6M4 14h4" stroke="currentColor" stroke-width="1.5"></path></svg>'
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function writePage(file, lang) {
  const isVi = lang === 'vi';
  let html = read(file);
  html = html.replace(/const CATS\s*=\s*\{[\s\S]*?\n\}\s*;/, () => `const CATS = ${catsLiteral(lang)};`);
  const tabs = CATS_ORDER.map((cat, i) => `    <button class="cat-tab${i ? '' : ' on'}" onclick="showCat(this,'${cat}')" data-cat="${cat}">\n      ${TAB_ICON[cat]}\n      ${LABEL[lang][cat]} <span class="tab-count">TOP ${TOP_N}</span>\n    </button>`).join('\n');
  // các nút tab không chứa <div>, nên </div> đầu tiên sau "cat-tabs" là thẻ đóng của nó
  html = html.replace(/(<div class="cat-tabs">)[\s\S]*?(<\/div>)/, (m, a, b) => `${a}\n${tabs}\n  ${b}`);
  html = html.replace(/const CAT_TYPE = \{[^}]*\};/, "const CAT_TYPE = {game:'game', anime:'anime', manga:'manga'};");
  // Link thẳng tới bài review (nguồn của điểm)
  html = html.replace('href="${resolveHref(t.title, cat)}"', 'href="${t.url || resolveHref(t.title, cat)}"')
             .replace('href="${resolveHref(r.title, catKeyForList)}"', 'href="${r.url || resolveHref(r.title, catKeyForList)}"');
  // noscript + ItemList (máy tìm kiếm / trình duyệt tắt JS)
  const origin = 'https://otahub.asia';
  const lists = CATS_ORDER.map((cat) => ({ cat, label: LABEL[lang][cat], items: result[cat].map((c) => { const r = isVi ? c.vi : c.en; return { title: workTitle(r, lang), url: r.url, score: c.score.toFixed(1) }; }) }));
  const ld = { '@context': 'https://schema.org', '@graph': lists.map((l) => ({ '@type': 'ItemList',
    name: `${l.label} ${isVi ? '· Bảng xếp hạng OtaHub' : '· OtaHub Rankings'}`, itemListOrder: 'https://schema.org/ItemListOrderDescending', numberOfItems: l.items.length,
    itemListElement: l.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.title, url: origin + it.url })) })) };
  const ldTag = `<script type="application/ld+json" id="rankings-itemlist">${JSON.stringify(ld)}</script>`;
  html = /<script type="application\/ld\+json" id="rankings-itemlist">[\s\S]*?<\/script>/.test(html)
    ? html.replace(/<script type="application\/ld\+json" id="rankings-itemlist">[\s\S]*?<\/script>/, () => ldTag)
    : html.replace('</head>', () => `${ldTag}\n</head>`);
  const noscript = '<noscript>' + lists.map((l) => `<h2>${esc(l.label)}</h2><ol>${l.items.map((it) => `<li><a href="${it.url}">${esc(it.title)}</a> · ${it.score}/10</li>`).join('')}</ol>`).join('') + '</noscript>';
  html = html.replace(/<div id="rk-content">[\s\S]*?<\/div>/, () => `<div id="rk-content">${noscript}</div>`);
  // tab đầu tiên được vẽ khi tải trang
  html = html.replace(/showCat\(document\.querySelector\('\.cat-tab\.on'\),'[a-z]+'\);/, "showCat(document.querySelector('.cat-tab.on'),'game');");
  html = html.replace(/const accMap=\{[^}]*\};/, "const accMap={'game':'var(--cyan)','anime':'var(--sakura)','manga':'var(--lavender)'};");
  // ngày cập nhật chỉ đổi khi thứ hạng/điểm thực sự đổi
  const catsOf = (s) => (s.match(/const CATS\s*=\s*\{[\s\S]*?\n\}\s*;/) || [''])[0];
  if (catsOf(html) !== catsOf(read(file))) {
    const d = new Date();
    const stamp = isVi
      ? `Cập nhật ngày ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      : `Updated ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    html = html.replace(isVi ? /Cập nhật ngày \d{2}\/\d{2}\/\d{4}/g : /Updated [A-Z][a-z]+ \d{1,2}, \d{4}/g, stamp);
  }
  write(file, html);
  console.log(`${file}: đã ghi ${CATS_ORDER.length} bảng × ${TOP_N}`);
}
writePage('rankings.html', 'vi');
writePage('en/rankings.html', 'en');
