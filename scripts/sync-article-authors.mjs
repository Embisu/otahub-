// Tác giả bài viết đồng nhất giữa 2 ngôn ngữ: bản EN luôn mang đúng tác giả của bản VI (bản gốc).
// Đồng bộ meta author, article:author, JSON-LD author và dòng tác giả hiển thị (am-badge); chuẩn hóa cách viết tên.
//
// Chạy:  node scripts/sync-article-authors.mjs           (ghi)
//        node scripts/sync-article-authors.mjs --check   (chỉ báo, thoát mã 1 nếu lệch)
import fs from 'node:fs';
const CHECK = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const write = (f, s) => fs.writeFileSync(new URL(f, root), s, 'utf8');
const exists = (f) => fs.existsSync(new URL(f, root));

// Cách viết chuẩn của tên (bản EN từng bỏ dấu, vài bài ghi tên đăng nhập)
const CANON = {
  'Lin (Khanh Linh)': 'Lin (Khánh Linh)', 'Tik (Khanh Quynh)': 'Tik (Khánh Quỳnh)', 'Mambu (Duc Anh)': 'Mambu (Đức Anh)',
  anhthu: 'Anh Thu', editor: 'OtaHub Editorial', OtaHub: 'OtaHub Editorial'
};
// Dòng tác giả có bản dịch riêng (giữ đúng ngôn ngữ của trang)
const BYLINE_EN = { 'OtaHub Chuyên Sâu': 'OtaHub Deep Dive', 'OtaHub nghiên cứu tổng hợp': 'Researched & compiled by OtaHub' };
const BYLINE_VI = Object.fromEntries(Object.entries(BYLINE_EN).map(([a, b]) => [b, a]));
const PROFILE = { 'OtaHub Editorial': 'otahub', Yu: 'yu', 'Anh Thu': 'anhthu', Anna: 'anna' };
const canon = (n) => CANON[n] || n;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"');

function info(s) {
  return {
    meta: unesc((s.match(/<meta name="author" content="([^"]*)"/) || [])[1] || ''),
    badge: unesc(((s.match(/class="[^"]*am-badge[^"]*"[^>]*>([^<]*)</) || [])[1] || '').trim())
  };
}
function apply(s, author, badge, en) {
  const json = author.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  s = s.replace(/(<meta\s+name="author"\s+content=")[^"]*(")/i, (m, a, b) => a + esc(author) + b);
  s = s.replace(/(<meta\s+property="article:author"\s+content=")[^"]*(")/i, (m, a, b) => a + esc(author) + b);
  s = s.replace(/("author"\s*:\s*\[?\s*\{[^{}]*?"name"\s*:\s*")[^"]*(")/i, (m, a, b) => a + json + b);
  if (badge) {
    const slug = PROFILE[canon(BYLINE_VI[badge] || badge)];
    const span = `<span class="am-badge">${esc(badge)}</span>`;
    const inner = slug ? `<a class="author-profile-link" href="${en ? '/en' : ''}/author/${slug}">${span}</a>` : span;
    s = s.replace(/(?:<a\b[^>]*class="author-profile-link"[^>]*>)?<span\b[^>]*\bclass="[^"]*am-badge[^"]*"[^>]*>[^<]*<\/span>(?:<\/a>)?/i, () => inner);
  }
  return s;
}

const files = fs.readdirSync(new URL('.', root)).filter((f) => f.endsWith('.html') && !/^(admin|article)\.html$/.test(f));
let changed = 0, pairs = 0;
for (const f of files) {
  const vi = read(f);
  if (!vi.includes('article:published_time')) continue;
  const enUrl = (vi.match(/<link rel="alternate" hreflang="en" href="https:\/\/otahub\.asia(\/en\/[^"]+)"/) || [])[1];
  const I = info(vi);
  const author = canon(I.meta || 'OtaHub Editorial');
  const badgeVi = I.badge ? (BYLINE_VI[I.badge] || canon(I.badge)) : '';
  const vi2 = apply(vi, author, badgeVi, false);
  if (vi2 !== vi) { changed++; if (!CHECK) write(f, vi2); }
  if (!enUrl || !exists(enUrl.slice(1) + '.html')) continue;
  pairs++;
  const ef = enUrl.slice(1) + '.html', en = read(ef);
  const en2 = apply(en, author, badgeVi ? (BYLINE_EN[badgeVi] || badgeVi) : '', true);
  if (en2 !== en) { changed++; if (!CHECK) write(ef, en2); }
}
console.log(`${pairs} cặp bài VI/EN · ${CHECK ? 'cần đồng bộ' : 'đã đồng bộ'} tác giả ở ${changed} trang`);
if (CHECK && changed) process.exitCode = 1;
