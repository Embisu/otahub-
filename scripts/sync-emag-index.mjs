// Trang tổng hợp E-Magazine (VI /e-magazine, EN /en/e-magazine): danh sách mọi số E-Magazine lấy từ src/emag/*.mjs.
// Lần đầu (chưa có file) dựng khung từ trang Top List cho khớp menu, footer, CSS; các lần sau chỉ cập nhật mảng EMAGS
// và đăng ký sitemap. Chạy cùng `npm run emag`.
//
// Chạy:  node scripts/sync-emag-index.mjs           (tạo/cập nhật)
//        node scripts/sync-emag-index.mjs --check   (chỉ báo, thoát mã 1 nếu lệch)
import fs from 'node:fs';

const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const rel = (f) => new URL(f, root);
const read = (f) => fs.readFileSync(rel(f), 'utf8');
const exists = (f) => fs.existsSync(rel(f));
const NL = String.fromCharCode(10);
const ORIGIN = 'https://otahub.asia';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TEXT = {
  vi: { file: 'e-magazine.html', path: '/e-magazine', tpl: 'top-list.html',
    title: 'E-Magazine · OtaHub | Chuyên đề game tương tác', name: 'E-Magazine OtaHub',
    desc: 'E-Magazine OtaHub: các chuyên đề game dựng như một tạp chí tương tác, có số liệu, dòng thời gian, hình ảnh chính thức và tin liên quan, cập nhật liên tục.',
    kw: 'e-magazine, chuyên đề game, otahub, gta 6',
    eye: 'OtaHub · E-Magazine', h1: 'E-<em>Magazine</em>',
    sub: 'Chuyên đề game dựng như một tạp chí tương tác: dữ kiện đã xác nhận, dòng thời gian, hình ảnh chính thức và toàn bộ tin liên quan, gom về một trang và cập nhật liên tục.',
    empty: 'Chưa có số E-Magazine nào.', score: 'E-MAG', verdict: 'Số đặc biệt', cat: 'Gaming', date: (d) => d.split('-').reverse().join('/') },
  en: { file: 'en/e-magazine.html', path: '/en/e-magazine', tpl: 'en/top-list.html',
    title: 'E-Magazine · OtaHub | Interactive Gaming Specials', name: 'OtaHub E-Magazine',
    desc: 'OtaHub E-Magazine: gaming specials built like an interactive magazine, with confirmed facts, timelines, official images and related news, updated continuously.',
    kw: 'e-magazine, gaming special, otahub, gta 6',
    eye: 'OtaHub · E-Magazine', h1: 'E-<em>Magazine</em>',
    sub: 'Gaming specials built like an interactive magazine: confirmed facts, timelines, official images and every related story, collected on one page and updated continuously.',
    empty: 'No E-Magazine issues yet.', score: 'E-MAG', verdict: 'Special', cat: 'Gaming',
    date: (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }
};

// ---------- dữ liệu: mỗi spec = một số, mới cập nhật nhất lên đầu ----------
const specs = [];
for (const f of fs.readdirSync(rel('src/emag/')).filter((x) => x.endsWith('.mjs'))) specs.push((await import(new URL('src/emag/' + f, root).href)).default);
specs.sort((a, b) => (a.updated < b.updated ? 1 : -1));
const thumb = (u) => {
  const t = '/assets/img/_t/' + String(u).replace(/^\/assets\/img\//, '') + '.webp';
  return /^\/assets\/img\/(?!_[ts]\/)/.test(u) && exists(t.slice(1)) ? t : u;
};
const items = (lang) => specs.map((s) => {
  const p = s.pages[lang];
  return { id: s.slug, url: p.path, img: thumb(s.searchImg), cat: TEXT[lang].cat, catC: 'var(--cyan)', title: p.meta.title, desc: p.meta.description,
    author: 'OtaHub', date: TEXT[lang].date(s.updated), iso: s.updated };
});
const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const dataBlock = (lang) => `var EMAGS = [${NL}${items(lang).map((x) => '  ' + js(x)).join(',' + NL)}${NL}];`;

// ---------- khung trang (chỉ dựng khi chưa có) ----------
function skeleton(lang) {
  const T = TEXT[lang], other = lang === 'vi' ? TEXT.en : TEXT.vi;
  let h = read(T.tpl);
  const swap = (re, to) => { if (!re.test(h)) throw new Error(`Khung ${T.tpl} thiếu mẫu ${re}`); h = h.replace(re, () => to); };
  swap(/<title>[^<]*<\/title>/, `<title>${esc(T.title)}</title>`);
  swap(/<link rel="alternate" hreflang="vi" href="[^"]*">/, `<link rel="alternate" hreflang="vi" href="${ORIGIN}${TEXT.vi.path}">`);
  swap(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${ORIGIN}${TEXT.en.path}">`);
  swap(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${TEXT.vi.path}">`);
  swap(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${ORIGIN}${T.path}">`);
  swap(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(T.desc)}">`);
  swap(/<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${esc(T.kw)}">`);
  swap(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(T.title)}">`);
  swap(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(T.desc)}">`);
  swap(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${ORIGIN}${T.path}">`);
  swap(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(T.title.split(' | ')[0])}">`);
  swap(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(T.desc)}">`);
  h = h.replace(/"@id": "[^"]*top-list#webpage"/, `"@id": "${ORIGIN}${T.path}#webpage"`)
    .replace(/"url": "https:\/\/otahub\.asia(\/en)?\/top-list"/, `"url": "${ORIGIN}${T.path}"`)
    .replace(/"name": "[^"]*Top List[^"]*"/, `"name": "${esc(T.name)}"`)
    .replace(/("description": ")[^"]*(")/, `$1${esc(T.desc)}$2`);
  swap(/<div class="tl-eye">[^<]*<\/div>/, `<div class="tl-eye">${T.eye}</div>`);
  swap(/<h1 class="tl-title">[\s\S]*?<\/h1>/, `<h1 class="tl-title">${T.h1}</h1>`);
  swap(/<p class="tl-sub">[\s\S]*?<\/p>/, `<p class="tl-sub">${esc(T.sub)}</p>`);
  swap(/<div class="filter-bar">[\s\S]*?<\/div>\s*<\/div>\s*/, '');
  swap(/(<div class="tl-empty"[^>]*>)[^<]*(<\/div>)/, `$1${esc(T.empty)}$2`);
  h = h.replace(/\/\* ── ADMIN:TOPLIST_START ──[^*]*\*\/[\s\S]*?\/\* ── ADMIN:TOPLIST_END ── \*\//,
    () => `/* ── EMAG_INDEX_START ── mảng do scripts/sync-emag-index.mjs ghi từ src/emag/*.mjs, không sửa tay ── */${NL}${dataBlock(lang)}${NL}/* ── EMAG_INDEX_END ── */`);
  // rút gọn script: không còn bộ lọc loại, chỉ vẽ lưới
  const a = h.indexOf('// ?loai=game'), b = h.indexOf('function toggleMob');
  if (a < 0 || b < 0) throw new Error('Khung thiếu khối script lọc');
  const grid = h.slice(a, b).match(/grid\.innerHTML = data\.map[\s\S]*?\.join\(''\);/)[0]
    .replace(/<div class="rvc-score">[^<]*<\/div>/, '<div class="rvc-score">' + T.score + '</div>')
    .replace(/<div class="rvc-verdict">[^<]*<\/div>/, '<div class="rvc-verdict">' + T.verdict + '</div>')
    .replace(/\$\{r\.itemCount \? 'TOP ' \+ r\.itemCount : '[^']*'\}/, T.score);
  const render = ['function renderGrid(){', '  var data = [...EMAGS];', '  data.sort((a,b)=>a.iso < b.iso ? 1 : -1);',
    "  var grid = document.getElementById('tlGrid');", "  var empty = document.getElementById('tlEmpty');",
    "  if(!data.length){ grid.innerHTML=''; empty.style.display='block'; return; }", "  empty.style.display='none';", '  ' + grid, '}', 'renderGrid();', '', ''].join(NL);
  h = h.slice(0, a) + render + h.slice(b);
  return h;
}

let dirty = false;
for (const lang of ['vi', 'en']) {
  const T = TEXT[lang];
  const had = exists(T.file);
  let h = had ? read(T.file) : skeleton(lang);
  const next = h.replace(/var EMAGS = \[[\s\S]*?\n\];/, () => dataBlock(lang));
  if (!had || next !== h) {
    dirty = true;
    if (!CHECK) fs.writeFileSync(rel(T.file), next);
    console.log(`${T.file}: ${items(lang).length} số E-Magazine${had ? ' (cập nhật)' : ' (tạo mới)'}${CHECK ? ' — cần cập nhật' : ''}`);
  } else console.log(`${T.file}: ${items(lang).length} số E-Magazine (đã khớp)`);
}

// sitemap
let sm = read('sitemap.xml');
const date = specs[0] ? specs[0].updated : new Date().toISOString().slice(0, 10);
for (const lang of ['vi', 'en']) {
  const loc = `${ORIGIN}${TEXT[lang].path}`;
  if (sm.includes(`<loc>${loc}</loc>`)) continue;
  dirty = true;
  sm = sm.replace('</urlset>', `  <url>${NL}    <loc>${loc}</loc>${NL}    <lastmod>${date}</lastmod>${NL}  </url>${NL}</urlset>`);
  console.log(`sitemap.xml: thêm ${loc}${CHECK ? ' — cần cập nhật' : ''}`);
}
if (dirty && !CHECK) fs.writeFileSync(rel('sitemap.xml'), sm);
if (CHECK && dirty) process.exitCode = 1;
