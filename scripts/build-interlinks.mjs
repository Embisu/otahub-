// Liên kết nội bộ trong thân bài viết (VI + EN), chạy lại được (idempotent):
//  1. Link ngữ cảnh: lần nhắc đầu tiên tên tác phẩm trong một đoạn <p> -> trang hồ sơ của tác phẩm (tối đa 3 hồ sơ/bài),
//     đánh dấu data-il="p" để lần chạy sau gỡ ra dựng lại.
//  2. Khối "Đọc thêm": 4 bài liên quan thật (cùng tác phẩm trước, rồi bài mới cùng chuyên mục), thay khối
//     "Khám phá thêm trên OtaHub" chung chung (chỉ trỏ /reviews, /news, /tag). Nằm giữa <!-- IL:START --> và <!-- IL:END -->.
// Chạy: node scripts/build-interlinks.mjs   (--check: chỉ báo số trang cần cập nhật)
import fs from 'node:fs';
import vm from 'node:vm';
import { profileSeries, profilePaths, localize, displayName } from './lib/profile-paths.mjs';
import { profileMatchers, profilesForArticle, articleInfo } from './lib/profile-links.mjs';

const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const write = (f, s) => fs.writeFileSync(new URL(f, root), s, 'utf8');

const catalog = JSON.parse(read('assets/catalog.json'));
const series = profileSeries(catalog);
const paths = profilePaths(catalog);
const editionOf = new Map();
for (const s of series) for (const e of s.editions) { editionOf.set(e.key, { s, e }); for (const k of e.also) editionOf.set(k, { s, e }); }
const IDX = (() => { const w = {}; vm.runInNewContext(read('assets/search.js'), { window: w }); return w.IDX || []; })();
const idxByUrl = new Map(IDX.map((a) => [a.url || a.href, a]));
const matchers = profileMatchers(catalog, series);

const SKIP = /^(?:en\/)?(?:admin|game-detail|anime-detail|manga-detail|article|bai-viet|404)\.html$/;
const files = [...fs.readdirSync(root).filter((f) => f.endsWith('.html')), ...fs.readdirSync(new URL('en/', root)).filter((f) => f.endsWith('.html')).map((f) => 'en/' + f)]
  .filter((f) => !SKIP.test(f));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- thu thập bài + hồ sơ liên quan ----
const arts = [];
for (const file of files) {
  const html = read(file);
  if (!html.includes('<article class="art-body">') || !html.includes('<aside class="art-sidebar">')) continue;
  const url = '/' + file.replace(/\.html$/, '');
  const meta = idxByUrl.get(url) || {};
  const seen = new Set();
  const picks = profilesForArticle(matchers, { ...articleInfo(html), cat: meta.cat }, 8)
    .map((p) => ({ ...p, key: editionOf.get(p.key)?.e.key || p.key }))
    .filter((p) => { const s = editionOf.get(p.key)?.s.slug || p.key; if (seen.has(s)) return false; seen.add(s); return true; })
    .slice(0, 3);
  const title = meta.title || ((html.match(/<title>([^<]*)/) || [])[1] || '').replace(/\s*·\s*OtaHub\s*$/, '');
  arts.push({ file, url, en: file.startsWith('en/'), html, picks, cat: meta.cat || '', date: meta.date || '', title, series: picks.map((p) => editionOf.get(p.key)?.s.slug || p.key) });
}

// ---- 1. link ngữ cảnh tới hồ sơ ----
function linkEntities(body, a) {
  let out = body, added = 0;
  for (const p of a.picks) {
    const ed = editionOf.get(p.key);
    let path = paths[`${p.type}|${p.key}`];
    if (!path) continue;
    path = localize(path, a.en);
    const base = path.replace(/#.*/, '');
    if (out.includes(`href="${base}"`) || out.includes(`href="${base}#`)) continue;  // đã có link tới hồ sơ này
    const names = [...new Set([...(a.en ? [ed?.s.nameEn] : [ed?.s.name]), displayName(p.key), ed?.s.nameEn, ed?.s.name]
      .filter(Boolean).map((n) => n.replace(/\s*\([^)]*\)\s*$/, '').trim()).filter((n) => n.length >= 4))]
      .sort((x, y) => y.length - x.length);
    let done = false;
    out = out.replace(/<p(?: [^>]*)?>[\s\S]*?<\/p>/g, (para) => {
      if (done || /class="(?:source-note|art-cta)"/.test(para)) return para;
      // chỉ sửa đoạn chữ nằm ngoài thẻ <a>...</a>
      const parts = para.split(/(<a\b[\s\S]*?<\/a>|<[^>]+>)/);
      for (let i = 0; i < parts.length && !done; i++) {
        const t = parts[i];
        if (!t || t.startsWith('<')) continue;
        for (const n of names) {
          // phân biệt hoa/thường: tên riêng viết hoa, tránh khớp cụm thường ("look back", "hell mode")
          const m = new RegExp('(?<![\\p{L}\\p{N}])' + reEsc(n) + '(?![\\p{L}\\p{N}])', 'u').exec(t);
          if (!m) continue;
          parts[i] = t.slice(0, m.index) + `<a href="${esc(path)}" data-il="p">${m[0]}</a>` + t.slice(m.index + m[0].length);
          done = true; break;
        }
      }
      return parts.join('');
    });
    if (done) added++;
  }
  return { body: out, added };
}

// ---- 2. khối Đọc thêm ----
const byLang = { vi: arts.filter((a) => !a.en), en: arts.filter((a) => a.en) };
for (const l of Object.values(byLang)) l.sort((x, y) => (y.date || '').localeCompare(x.date || ''));
function related(a) {
  const pool = byLang[a.en ? 'en' : 'vi'].filter((b) => b.url !== a.url && b.title);
  const out = [];
  const add = (b) => { if (out.length < 4 && !out.includes(b)) out.push(b); };
  for (const b of pool) if (b.series.some((s) => a.series.includes(s))) add(b);
  for (const b of pool) if (a.cat && b.cat === a.cat) add(b);
  for (const b of pool) add(b);
  return out;
}
const BOX_STYLE = 'margin:28px 0;padding:16px 20px;background:rgba(0,242,255,.04);border-left:3px solid var(--cyan);border-radius:0 4px 4px 0';
function relatedBlock(a) {
  const items = related(a).map((b) => `<li><a href="${esc(b.url)}" data-il="r">${esc(b.title)}</a></li>`).join('\n    ');
  const head = a.en ? 'Read more on OtaHub' : 'Đọc thêm trên OtaHub';
  return `<!-- IL:START --><div class="read-more-box il-related" style="${BOX_STYLE}">\n  <strong style="color:var(--white);font-size:14px;letter-spacing:.05em;text-transform:uppercase">${head}</strong>\n  <ul style="margin:8px 0 0 0;padding-left:18px;list-style:disc">\n    ${items}\n  </ul>\n</div><!-- IL:END -->`;
}

let changed = 0, linksAdded = 0;
for (const a of arts) {
  const s = a.html;
  const i = s.indexOf('<article class="art-body">') + '<article class="art-body">'.length;
  const j = s.indexOf('</article>', i);
  let body = s.slice(i, j);
  // gỡ kết quả lần chạy trước
  body = body.replace(/<a href="[^"]*" data-il="p">([\s\S]*?)<\/a>/g, '$1').replace(/\s*<!-- IL:START -->[\s\S]*?<!-- IL:END -->/g, '');
  // gỡ khối "Khám phá thêm" chung chung (chỉ link trang tổng)
  body = body.replace(/\s*<div class="read-more-box"[^>]*>\s*<strong[^>]*>(?:Khám phá thêm trên OtaHub|Explore more on OtaHub|Discover more on OtaHub)[\s\S]*?<\/ul>\s*<\/div>/gi, '');
  const r = linkEntities(body, a);
  body = r.body.replace(/\s+$/, '') + '\n' + relatedBlock(a) + '\n';
  const out = s.slice(0, i) + body + s.slice(j);
  linksAdded += r.added;
  if (out !== s) { changed++; if (!CHECK) write(a.file, out); }
}
console.log(`Liên kết nội bộ: ${arts.length} bài, ${linksAdded} link ngữ cảnh tới hồ sơ, ${CHECK ? 'cần cập nhật' : 'đã cập nhật'} ${changed} trang`);
if (CHECK && changed) process.exitCode = 1;
