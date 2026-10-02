// Tác giả bài viết thống nhất ở MỌI chỗ và giữa 2 ngôn ngữ.
//
// Nguồn sự thật = dòng tác giả hiển thị trên bản VI (am-badge, admin ghi khi đăng bài).
// Script ghi cùng một tác giả vào: meta author, article:author, JSON-LD "author" (kèm link trang hồ sơ)
// và dòng tác giả hiển thị, cho cả bản VI lẫn bản EN.
//   - "OtaHub Editorial" là tác giả riêng (ban biên tập, hồ sơ /author/otahub) -> JSON-LD Organization
//   - Yu, Anh Thu, Anna -> JSON-LD Person, link hồ sơ riêng
//   - Dòng tác giả có bản dịch (OtaHub Chuyên Sâu / OtaHub Deep Dive...) giữ đúng ngôn ngữ trang, tác giả = OtaHub Editorial
//
// Chạy:  node scripts/sync-article-authors.mjs           (ghi)
//        node scripts/sync-article-authors.mjs --check   (chỉ báo, thoát mã 1 nếu lệch)
import fs from 'node:fs';
const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const write = (f, s) => fs.writeFileSync(new URL(f, root), s, 'utf8');
const exists = (f) => fs.existsSync(new URL(f, root));

const EDITORIAL = 'OtaHub Editorial';
// Cách viết chuẩn (tên đăng nhập, bản bỏ dấu...)
const CANON = { anhthu: 'Anh Thu', editor: EDITORIAL, OtaHub: EDITORIAL, 'OtaHub Editorial Team': EDITORIAL };
// Dòng tác giả có bản dịch riêng; tác giả thật là ban biên tập
const BYLINE_EN = { 'OtaHub Chuyên Sâu': 'OtaHub Deep Dive', 'OtaHub nghiên cứu tổng hợp': 'Researched & compiled by OtaHub' };
const BYLINE_VI = Object.fromEntries(Object.entries(BYLINE_EN).map(([a, b]) => [b, a]));
const PROFILE = { [EDITORIAL]: 'otahub', Yu: 'yu', 'Anh Thu': 'anhthu', Anna: 'anna' };
const canon = (n) => CANON[n] || n;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"');

const badgeOf = (s) => unesc(((s.match(/class="[^"]*am-badge[^"]*"[^>]*>([^<]*)</) || [])[1] || '').trim());
const metaOf = (s) => unesc((s.match(/<meta name="author" content="([^"]*)"/) || [])[1] || '');

// Thay đối tượng JSON-LD "author": {...} đầu tiên (đếm ngoặc để giữ JSON hợp lệ)
function replaceJsonAuthor(s, obj) {
  const m = /"author"\s*:\s*/.exec(s);
  if (!m) return s;
  let i = m.index + m[0].length;
  const open = s[i];
  if (open !== '{' && open !== '[') return s;
  const close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, j = i;
  for (; j < s.length; j++) {
    const c = s[j];
    if (inStr) { if (c === '\\') j++; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) break; }
  }
  if (s[j] !== close) return s;
  // giữ thụt lề của khối cũ
  const lineStart = s.lastIndexOf('\n', m.index) + 1;
  const indent = s.slice(lineStart, m.index).match(/^\s*/)[0];
  const json = JSON.stringify(obj, null, 2).split('\n').map((l, k) => (k ? indent + l : l)).join('\n');
  return s.slice(0, i) + json + s.slice(j + 1);
}

function apply(s, author, byline, en) {
  const slug = PROFILE[author];
  const profileUrl = slug ? `https://otahub.asia${en ? '/en' : ''}/author/${slug}` : 'https://otahub.asia' + (en ? '/en' : '') + '/about#team';
  s = s.replace(/(<meta\s+name="author"\s+content=")[^"]*(")/i, (m, a, b) => a + esc(author) + b);
  s = s.replace(/(<meta\s+property="article:author"\s+content=")[^"]*(")/i, (m, a, b) => a + esc(author) + b);
  s = replaceJsonAuthor(s, author === EDITORIAL
    ? { '@type': 'Organization', name: EDITORIAL, url: profileUrl, parentOrganization: { '@type': 'Organization', '@id': 'https://otahub.asia/#organization', name: 'OtaHub' } }
    : { '@type': 'Person', name: author, url: profileUrl, worksFor: { '@type': 'Organization', '@id': 'https://otahub.asia/#organization', name: 'OtaHub' } });
  if (byline) {
    const span = `<span class="am-badge">${esc(byline)}</span>`;
    const inner = slug ? `<a class="author-profile-link" href="${en ? '/en' : ''}/author/${slug}">${span}</a>` : span;
    s = s.replace(/(?:<a\b[^>]*class="author-profile-link"[^>]*>)?<span\b[^>]*\bclass="[^"]*am-badge[^"]*"[^>]*>[^<]*<\/span>(?:<\/a>)?/i, () => inner);
  }
  return s;
}

const files = fs.readdirSync(new URL('.', root)).filter((f) => f.endsWith('.html') && !/^(admin|article)\.html$/.test(f));
let changed = 0, pairs = 0;
const tally = {};
for (const f of files) {
  const vi = read(f);
  if (!vi.includes('article:published_time')) continue;
  const rawBadge = badgeOf(vi);
  const bylineVi = rawBadge ? (BYLINE_VI[rawBadge] || canon(rawBadge)) : '';
  const author = bylineVi ? (BYLINE_EN[bylineVi] ? EDITORIAL : bylineVi) : canon(metaOf(vi) || EDITORIAL);
  tally[author] = (tally[author] || 0) + 1;
  const vi2 = apply(vi, author, bylineVi, false);
  if (vi2 !== vi) { changed++; if (!CHECK) write(f, vi2); }
  const enUrl = (vi.match(/<link rel="alternate" hreflang="en" href="https:\/\/otahub\.asia(\/en\/[^"]+)"/) || [])[1];
  if (!enUrl || !exists(enUrl.slice(1) + '.html')) continue;
  pairs++;
  const ef = enUrl.slice(1) + '.html', en = read(ef);
  const en2 = apply(en, author, bylineVi ? (BYLINE_EN[bylineVi] || bylineVi) : '', true);
  if (en2 !== en) { changed++; if (!CHECK) write(ef, en2); }
}
console.log(`${pairs} cặp bài VI/EN · tác giả: ${Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(', ')} · ${CHECK ? 'cần đồng bộ' : 'đã đồng bộ'} ${changed} trang`);
if (CHECK && changed) process.exitCode = 1;
