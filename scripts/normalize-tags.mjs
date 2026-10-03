// Chuẩn hóa thẻ chủ đề (sb-tags) cuối mỗi bài, VI + EN:
//   1. Bỏ thẻ quá chung (chuyên mục, năm, nền tảng họ máy, thể loại...) và link chuyên mục trong khối thẻ.
//      Nền tảng / nhà phát hành / nguồn tin (Steam, Crunchyroll, Netflix, Shueisha, Metacritic...) chỉ giữ khi tên nằm trong
//      tiêu đề bài (bài nói về nó); luôn chừa lại tối thiểu 2 thẻ.
//   2. Gộp các cách viết khác nhau của cùng một thẻ về MỘT tên chuẩn
//      ("Anime Mùa Thu" / "Anime Mùa Thu 2026" / "Anime mùa thu 2026", "VIZ Media" / "Viz Media",
//       "Honkai Star Rail" / "Honkai: Star Rail", "Chainsaw Man" / "Thợ Săn Quỷ Chainsaw Man"...).
//   3. Tên tác phẩm dùng tên hồ sơ theo ngôn ngữ trang (VI: tên Việt hóa trong assets/series.json, EN: tên gốc).
// Danh sách và bảng quy đổi nằm ở scripts/data/tag-canon.json. Chạy:
//   node scripts/normalize-tags.mjs            (ghi)
//   node scripts/normalize-tags.mjs --check    (chỉ kiểm tra)
//   node scripts/normalize-tags.mjs --report   (xem thay đổi, không ghi)
// Đã nối vào `npm run hubs` (chạy trước khi đồng bộ chỉ mục tìm kiếm) để bài mới cũng được chuẩn hóa.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const CHECK = process.argv.includes('--check');
const REPORT = process.argv.includes('--report');
const read = (f) => fs.readFileSync(root + f, 'utf8');
const cfg = JSON.parse(read('scripts/data/tag-canon.json'));
const { profileSeries } = await import(new URL('./lib/profile-paths.mjs', import.meta.url));

// khóa so khớp: không dấu, không hoa thường, bỏ dấu nháy; giữ "+" (Shonen Jump+ khác Shonen Jump)
const nk = (t) => {
  const plus = /\+\s*$/.test(t) ? '+' : '';
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/δ/g, 'delta')
    .replace(/['’`]s\b/g, '').replace(/['’"“”]/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + plus;
};
const decode = (t) => t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const GENERIC = new Set(cfg.generic.map(nk));
const TITLE_ONLY = new Set((cfg.titleOnly || []).map(nk));
const CANON = {}; for (const [k, v] of Object.entries(cfg.canon)) CANON[nk(k)] = v;
const strip = (x) => String(x || '').replace(/\s*\([^)]*\)/g, '').trim();

// tên tác phẩm: mọi cách gọi (bảng profile-links) -> tên hồ sơ theo ngôn ngữ
const catalog = JSON.parse(read('assets/catalog.json'));
const series = profileSeries(catalog);
const brand = { vi: new Map(), en: new Map() };
// Chỉ gộp theo thương hiệu đã khai báo trong series.json (tên Việt hóa <-> tên gốc). Bản phụ (mùa, game chuyển thể,
// phần ngoại truyện...) giữ tên riêng, không bị nuốt vào thương hiệu.
const declared = new Set(Object.keys(JSON.parse(read('assets/series.json'))));
for (const s of series) {
  if (!declared.has(s.slug)) continue;
  const vi = cfg.brandName[s.slug] || strip(s.name), en = cfg.brandName[s.slug] || strip(s.nameEn);
  for (const n of [s.name, strip(s.name), s.nameEn, strip(s.nameEn)]) {
    const k = nk(n); if (k.length < 3 || GENERIC.has(k)) continue;
    brand.vi.set(k, vi); brand.en.set(k, en);
  }
}

// 1) đọc mọi bài có khối thẻ
const files = [];
for (const dir of ['', 'en/']) for (const f of fs.readdirSync(root + dir)) if (f.endsWith('.html') && fs.statSync(root + dir + f).isFile()) files.push(dir + f);
const pages = [];
for (const f of files) {
  if (/^(en\/)?(admin|article|bai-viet|game-detail|anime-detail|manga-detail)\.html$/.test(f)) continue;
  const html = read(f);
  const m = html.match(/<div class="sb-tags">([\s\S]*?)<\/div>/);
  if (!m || !html.includes('art-sidebar')) continue;
  const tags = [...m[1].matchAll(/<a[^>]*class="sb-tag"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => decode(x[1])).filter(Boolean);
  // link hiện có: thẻ bài cũ đôi khi trỏ về trang chuyên mục (href="/anime") thay vì trang thẻ -> cũng phải sửa
  const links = [...m[1].matchAll(/<a([^>]*)class="sb-tag"([^>]*)>([\s\S]*?)<\/a>/g)].map((x) => ({ t: decode(x[3]), href: ((x[1] + x[2]).match(/href="([^"]*)"/) || [, ''])[1], pf: /data-pf/.test(x[1] + x[2]) }));
  const title = nk(decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1]));
  pages.push({ f, en: f.startsWith('en/'), html, box: m[0], tags, links, title });
}
// 2) tên chuẩn cho các cách viết còn lại: cách viết dùng nhiều nhất, ưu tiên dạng có dấu ":" / không viết hoa toàn bộ
const spell = { vi: new Map(), en: new Map() };
for (const p of pages) for (const t of p.tags) { const k = nk(t); const m = spell[p.en ? 'en' : 'vi']; const e = m.get(k) || {}; e[t] = (e[t] || 0) + 1; m.set(k, e); }
// các khóa chỉ khác nhau ở dấu ":" ('honkai star rail' đã trùng sau nk), nên một khóa có thể có nhiều cách viết
const pickSpelling = (e) => Object.keys(e).sort((a, b) => {
  const score = (x) => (e[x] * 10) + (/[a-z]/.test(x) ? 3 : 0) + (x.includes(':') ? 2 : 0) + (x !== x.toUpperCase() || x.length <= 5 ? 1 : 0);
  return score(b) - score(a);
})[0];
function canonical(t, lang) {
  const k = nk(t);
  if (!k || GENERIC.has(k) || k.length < 2) return null;
  if (CANON[k]) return CANON[k] === '-' ? null : CANON[k];
  const b = brand[lang].get(k);
  if (b) return b;
  return pickSpelling(spell[lang].get(k) || { [t]: 1 });
}
let changed = 0, removedGeneric = 0, merged = 0, empty = [];
const before = { vi: new Set(), en: new Set() }, after = { vi: new Set(), en: new Set() };
for (const p of pages) {
  const lang = p.en ? 'en' : 'vi';
  const out = [], seen = new Set();
  for (const t of p.tags) {
    before[lang].add(t);
    const c = canonical(t, lang);
    if (c === null) { removedGeneric++; continue; }
    if (c !== t) merged++;
    const k = nk(c); if (seen.has(k)) continue; seen.add(k); out.push(c); after[lang].add(c);
  }
  // thẻ nền tảng/nguồn tin: bỏ nếu bài không nhắc tên trong tiêu đề, nhưng luôn còn >= 2 thẻ
  const aboutIt = (t) => (' ' + p.title + ' ').includes(' ' + nk(t) + ' ');
  const kept = out.filter((t) => !TITLE_ONLY.has(nk(t)) || aboutIt(t));
  for (const t of out) { if (kept.length >= 2) break; if (!kept.includes(t)) kept.push(t); }
  const orderIdx = (t) => out.indexOf(t); kept.sort((a, b) => orderIdx(a) - orderIdx(b));
  for (const t of out) if (!kept.includes(t)) { removedGeneric++; after[lang].delete(t); }
  p.next = kept;
  if (!kept.length) empty.push(p.f);
}
if (REPORT) {
  console.log('thẻ riêng biệt trước/sau (VI):', before.vi.size, '->', after.vi.size, '| (EN):', before.en.size, '->', after.en.size);
  console.log('lượt gỡ thẻ chung:', removedGeneric, '| lượt đổi tên/gộp:', merged, '| bài hết thẻ sau khi gỡ:', empty.length);
  const ex = []; for (const p of pages) for (const t of p.tags) { const c = canonical(t, p.en ? 'en' : 'vi'); if (c && c !== t) ex.push(t + ' -> ' + c); }
  console.log([...new Set(ex)].slice(0, 120).join('\n'));
  console.log('bài hết thẻ:', empty.slice(0, 30).join(', '));
  process.exit(0);
}
for (const p of pages) {
  const base = p.en ? '/en/tag?q=' : '/tag?q=';
  const same = JSON.stringify(p.tags) === JSON.stringify(p.next) && p.links.every((l) => l.pf || l.href.replace(/&#39;/g, "'") === base + encodeURIComponent(l.t));
  if (same) continue;
  changed++;
  if (CHECK) continue;
  let html = p.html;
  if (!p.next.length) {
    // không còn thẻ riêng: bỏ cả khối "Chủ đề" thay vì để trống
    const block = html.match(/<div class="sidebar-block">\s*<div class="sb-title">[^<]*<\/div>\s*<div class="sb-tags">[\s\S]*?<\/div>\s*<\/div>/);
    html = block ? html.replace(block[0], () => '') : html.replace(p.box, () => '<div class="sb-tags"></div>');
  } else {
    const links = p.next.map((t) => `<a class="sb-tag" href="${base}${encodeURIComponent(t)}">${esc(t)}</a>`).join('');
    html = html.replace(p.box, () => `<div class="sb-tags">${links}</div>`);
  }
  fs.writeFileSync(root + p.f, html, 'utf8');
}
console.log(`Thẻ chủ đề: ${pages.length} bài, ${changed} bài ${CHECK ? 'cần chuẩn hóa' : 'đã chuẩn hóa'}`);
if (CHECK) process.exit(changed ? 1 : 0);
