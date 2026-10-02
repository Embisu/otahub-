// Đồng bộ thanh menu + footer trên MỌI trang (VI / EN), kể cả mẫu bài trong admin.html và templates/partials.
//
// Chỉ thay phần dùng chung, giữ nguyên khung <nav> riêng từng trang (logo, nút tìm kiếm, ☰):
//   - <ul class="nav-links">: đúng 8 mục chuẩn, giữ mục đang "active" của trang
//   - nút Đăng ký (a.cta), menu trượt <div class="mobile-nav">
//   - toàn bộ <footer>: một mẫu chuẩn (CSS chung ở assets/mobile-fix.css, khối "Footer chuẩn")
//
// Chạy:  node scripts/sync-site-chrome.mjs           (ghi)
//        node scripts/sync-site-chrome.mjs --check   (chỉ báo trang lệch, thoát mã 1 nếu có)
import fs from 'node:fs';
import path from 'node:path';

const CHECK = process.argv.includes('--check');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const rel = (f) => path.join(root, f);

const NAV = {
  vi: [['/choi-gi', 'Chơi Gì?'], ['/gaming', 'Gaming'], ['/anime', 'Anime'], ['/manga', 'Manga'], ['/lich-phat-song', 'Lịch phát sóng'],
    ['/reviews', 'Đánh giá'], ['/rankings', 'Xếp hạng'], ['/chuyen-sau', 'Chuyên sâu']],
  en: [['/en/choi-gi', 'What to Play'], ['/en/gaming', 'Gaming'], ['/en/anime', 'Anime'], ['/en/manga', 'Manga'], ['/en/lich-phat-song', 'Schedule'],
    ['/en/reviews', 'Reviews'], ['/en/rankings', 'Rankings'], ['/en/in-depth', 'In-Depth']]
};
const CTA = { vi: ['/#newsletter', 'Đăng ký'], en: ['/en/#newsletter', 'Subscribe'] };
const LOGO = (home, lazy) => `<a href="${home}" class="logo" style="display:inline-flex"><img src="/assets/img/brand/otahub-icon.png" alt="" width="34" height="34" style="width:34px;height:34px;flex-shrink:0;display:inline-block"${lazy ? ' loading="lazy"' : ''}><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a>`;
const FOOTER = {
  vi: { home: '/', desc: 'Tin tức, đánh giá và lịch phát sóng game, anime, manga cho cộng đồng Việt Nam và châu Á.', copy: '© 2026 OtaHub.asia · Tin tức game, anime &amp; manga',
    cols: [['Chuyên mục', [['/news', 'Tin mới'], ['/gaming', 'Gaming'], ['/anime', 'Anime'], ['/manga', 'Manga'], ['/lich-phat-song', 'Lịch phát sóng'], ['/choi-gi', 'Chơi Gì?']]],
      ['Đánh giá', [['/reviews', 'Bài đánh giá'], ['/rankings', 'Bảng xếp hạng'], ['/chuyen-sau', 'Chuyên sâu'], ['/tieu-chuan-danh-gia', 'Tiêu chuẩn đánh giá']]],
      ['Về OtaHub', [['/about', 'Giới thiệu'], ['/about#team', 'Đội ngũ'], ['/lien-he', 'Liên hệ'], ['/chinh-sach-bao-mat', 'Chính sách bảo mật'], ['/#newsletter', 'Bản tin'], ['/feed.xml', 'RSS Feed']]]] },
  en: { home: '/en/', desc: 'News, reviews and broadcast schedules for games, anime and manga, from Vietnam and across Asia.', copy: '© 2026 OtaHub.asia · Gaming, anime &amp; manga news',
    cols: [['Sections', [['/en/news', 'Latest news'], ['/en/gaming', 'Gaming'], ['/en/anime', 'Anime'], ['/en/manga', 'Manga'], ['/en/lich-phat-song', 'Schedule'], ['/en/choi-gi', 'What to Play']]],
      ['Reviews', [['/en/reviews', 'All reviews'], ['/en/rankings', 'Rankings'], ['/en/in-depth', 'In-Depth']]],
      ['About OtaHub', [['/en/about', 'About us'], ['/en/about#team', 'Team'], ['/en/contact', 'Contact'], ['/en/privacy', 'Privacy policy'], ['/en/#newsletter', 'Newsletter'], ['/feed.xml', 'RSS Feed']]]] }
};

const footerHtml = (lang) => {
  const F = FOOTER[lang];
  const cols = F.cols.map(([h, links]) => `<div><div class="ft-h">${h}</div><ul class="ft-links">${links.map(([u, t]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div>`).join('');
  return `<footer><div class="ft-in"><div>${LOGO(F.home, true)}<p class="ft-desc">${F.desc}</p></div>${cols}</div><div class="ft-bot"><span class="ft-copy">${F.copy}</span></div></footer>`;
};
const norm = (u) => (u || '').replace(/^\.\//, '/').replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';

// Thẻ cân bằng: trả về vị trí kết thúc của phần tử mở tại `start`
function closeOf(html, start, tag) {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === '/' ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  return -1;
}
function replaceElement(html, openRe, tag, build) {
  let out = '', from = 0, m;
  const re = new RegExp(openRe.source, 'g');
  while ((m = re.exec(html))) {
    const end = closeOf(html, m.index, tag);
    if (end < 0) break;
    out += html.slice(from, m.index) + build(html.slice(m.index, end));
    from = re.lastIndex = end;
  }
  return out + html.slice(from);
}
const activeOf = (block, lang) => {
  const m = block.match(/<a\b[^>]*href="([^"]*)"[^>]*class="[^"]*\bactive\b[^"]*"|<a\b[^>]*class="[^"]*\bactive\b[^"]*"[^>]*href="([^"]*)"/);
  const href = m && norm(m[1] || m[2]);
  return href && NAV[lang].some(([u]) => norm(u) === href) ? href : null;
};
const langOfBlock = (block, fallback) => (/href="\/en[\/"#]/.test(block) ? 'en' : /href="\/(?!en[\/"#])/.test(block) ? 'vi' : fallback);

function syncHtml(html, pageLang) {
  // menu ngang
  html = replaceElement(html, /<ul class="nav-links"[^>]*>/, 'ul', (block) => {
    const lang = langOfBlock(block, pageLang);
    const act = activeOf(block, lang);
    return `<ul class="nav-links">${NAV[lang].map(([u, t]) => `<li><a href="${u}"${norm(u) === act ? ' class="active"' : ''}>${t}</a></li>`).join('')}</ul>`;
  });
  // logo trên menu -> trang chủ đúng ngôn ngữ (trang 404 giữ đường dẫn tương đối riêng)
  html = replaceElement(html, /<nav class="nav"[^>]*>/, 'nav', (block) => {
    const lang = langOfBlock(block, pageLang);
    return block.replace(/<a\b[^>]*\bclass="logo"[^>]*>/, (tag) => tag.replace(/href="(?!\.\/)[^"]*"/, `href="${FOOTER[lang].home}"`));
  });
  // menu trượt (trang hub)
  html = replaceElement(html, /<div class="mobile-nav"[^>]*>/, 'div', (block) => {
    const open = block.match(/^<div[^>]*>/)[0];
    const lang = langOfBlock(block, pageLang);
    const act = activeOf(block, lang);
    return `${open}\n  ${NAV[lang].map(([u, t]) => `<a href="${u}"${norm(u) === act ? ' class="active"' : ''}>${t}</a>`).join('')}\n</div>`;
  });
  // nút Đăng ký
  html = html.replace(/<a\b([^>]*)\bclass="cta"([^>]*)>[^<]*<\/a>/g, (a, pre, post) => {
    if (!/newsletter/.test(a)) return a; // vd. trang 404: nút "Về trang chủ"
    const lang = /href="\/en/.test(a) ? 'en' : pageLang;
    const attrs = (pre + post).replace(/\s*href="[^"]*"/, '').trim();
    return `<a href="${CTA[lang][0]}" class="cta"${attrs ? ' ' + attrs : ''}>${CTA[lang][1]}</a>`;
  });
  // footer
  html = replaceElement(html, /<footer\b[^>]*>/, 'footer', (block) => footerHtml(langOfBlock(block.replace(/href="\/feed\.xml"/g, ''), pageLang)));
  return html;
}

function walk(dir) {
  return fs.readdirSync(rel(dir), { withFileTypes: true }).flatMap((d) => {
    const p = dir ? `${dir}/${d.name}` : d.name;
    if (d.isDirectory()) return ['en', 'author', 'en/author'].includes(p) ? walk(p) : [];
    return p.endsWith('.html') ? [p] : [];
  });
}
const SKIP = new Set(['news-pipeline.html', 'sponsorship-soo.html']);
const files = [...walk(''), ...['article-nav.html', 'article-nav.en.html', 'article-footer.html', 'article-footer.en.html', 'hub-nav.html', 'hub-footer.html', 'hub-footer.en.html']
  .map((f) => 'templates/partials/' + f).filter((f) => fs.existsSync(rel(f)))].filter((f) => !SKIP.has(f));

let changed = 0;
for (const f of files) {
  const lang = /^en\/|\.en\.html$/.test(f) ? 'en' : 'vi';
  const before = fs.readFileSync(rel(f), 'utf8');
  const after = syncHtml(before, lang);
  if (after === before) continue;
  changed++;
  if (CHECK) console.log('lệch:', f);
  else fs.writeFileSync(rel(f), after, 'utf8');
}
console.log(`${CHECK ? 'Cần đồng bộ' : 'Đã đồng bộ menu/footer'}: ${changed}/${files.length} trang`);
if (CHECK && changed) process.exitCode = 1;
