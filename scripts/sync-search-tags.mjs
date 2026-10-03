// Đưa thẻ chủ đề (sb-tags cuối mỗi bài) vào chỉ mục tìm kiếm assets/search.js (trường "tags").
// Trang /tag và /en/tag, ô tìm kiếm và danh sách bài trên trang hồ sơ dùng trường này để tìm bài theo thẻ,
// không chỉ theo chữ có trong tiêu đề / mô tả (vd. bài có thẻ "Girls' Frontline 2" nhưng tiêu đề chỉ ghi "Girls' Frontline").
//
// Chạy:  node scripts/sync-search-tags.mjs          (ghi)
//        node scripts/sync-search-tags.mjs --check  (chỉ kiểm tra)
// Đã nối vào `npm run hubs` và `npm run indexes:build`: chạy sau mỗi bài mới.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const CHECK = process.argv.includes('--check');
const searchPath = root + 'assets/search.js';
const src = fs.readFileSync(searchPath, 'utf8');
const m = src.match(/(?:var\s+|window\.)?IDX\s*=\s*(\[[\s\S]*?\]);/);
if (!m) { console.error('Không đọc được IDX trong assets/search.js'); process.exit(1); }
const idx = JSON.parse(m[1]);

const decode = (t) => t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
function tagsOf(url) {
  const file = root + url.replace(/^\//, '') + '.html';
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, 'utf8');
  const box = html.match(/<div class="sb-tags">([\s\S]*?)<\/div>/);
  if (!box) {
    // trang không có khối thẻ (vd. E-Magazine): lấy từ meta keywords
    const kw = (html.match(/<meta name="keywords" content="([^"]*)"/) || [])[1];
    return kw ? [...new Set(kw.split(/\s*,\s*/).map(decode).filter(Boolean))] : null;
  }
  const out = [];
  for (const a of box[1].matchAll(/<a[^>]*class="sb-tag"[^>]*>([\s\S]*?)<\/a>/g)) {
    const t = decode(a[1]);
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

let changed = 0, withTags = 0;
for (const item of idx) {
  const url = item.url || item.href;
  if (!url) continue;
  const tags = tagsOf(url);
  if (tags === null) continue;
  if (tags.length) withTags++;
  if (JSON.stringify(item.tags || []) !== JSON.stringify(tags)) { item.tags = tags; changed++; }
}
console.log(`Chỉ mục tìm kiếm: ${idx.length} bài, ${withTags} bài có thẻ, ${changed} bài ${CHECK ? 'cần cập nhật' : 'đã cập nhật'}`);
if (CHECK) process.exit(changed ? 1 : 0);
if (changed) {
  // mỗi mảng tags nằm trên một dòng để file không phình ra
  const real = idx.map((it) => it.tags);
  idx.forEach((it, i) => { it.tags = '__TAGS_' + i + '__'; });
  let text = JSON.stringify(idx, null, 2);
  idx.forEach((it, i) => { text = text.split('"__TAGS_' + i + '__"').join(JSON.stringify(real[i] || [])); it.tags = real[i]; });
  const out = src.replace(m[0], () => `window.IDX = ${text};`);
  fs.writeFileSync(searchPath, out, 'utf8');
}
