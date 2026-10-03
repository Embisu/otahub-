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
import { fileURLToPath } from 'node:url';

const CHECK = process.argv.includes('--check');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (f) => path.join(root, f);

const NAV = {
  vi: [['/choi-gi', 'Chơi Gì?'], ['/gaming', 'Gaming'], ['/anime', 'Anime'], ['/manga', 'Manga'], ['/lich-phat-song', 'Lịch phát sóng'],
    ['/reviews', 'Đánh giá'], ['/rankings', 'Xếp hạng'], ['/chuyen-sau', 'Chuyên sâu']],
  en: [['/en/choi-gi', 'What to Play'], ['/en/gaming', 'Gaming'], ['/en/anime', 'Anime'], ['/en/manga', 'Manga'], ['/en/lich-phat-song', 'Schedule'],
    ['/en/reviews', 'Reviews'], ['/en/rankings', 'Rankings'], ['/en/in-depth', 'In-Depth']]
};
// ===== MỤC NỔI BẬT TẠM THỜI (chiến dịch) =====
// Thêm một nút nổi bật cuối menu ngang (và đầu menu trượt trên điện thoại) ở mọi trang VI / EN.
// Toàn bộ kiểu dáng viết thẳng trong thẻ nên không phụ thuộc file CSS nào.
// GỠ XUỐNG: đổi `FEATURED` thành `null`, chạy `npm run chrome`, rồi commit. Menu về lại đúng 8 mục chuẩn.
const FEATURED = {
  vi: { href: '/dem-nguoc-gta-6', label: 'Đếm ngược GTA VI', short: 'GTA VI', sub: '19/11/2026' },
  en: { href: '/en/gta-6-countdown', label: 'Countdown to GTA VI', short: 'GTA VI', sub: 'Nov 19, 2026' }
};
// `short`: nhãn ngắn thay cho `label` khi màn hình 1101–1359px không đủ chỗ (CSS ở assets/mobile-fix.css, khối "Menu ngang vừa khung")
// Đồng hồ nhỏ có kim quay + vệt sáng quét qua nút (SVG SMIL, không cần CSS hay JS)
const HOT_CLOCK = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="flex:none;position:relative"><circle cx="12" cy="12" r="9" fill="none" stroke="#1a0a24" stroke-width="2.4"/><path d="M12 6.5V12" stroke="#1a0a24" stroke-width="2.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="6s" repeatCount="indefinite"/></path><circle cx="12" cy="12" r="1.8" fill="#1a0a24"/></svg>';
const HOT_SHINE = '<span aria-hidden="true" style="position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none"><svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none"><rect y="-4" width="9" height="48" fill="rgba(255,255,255,.4)" transform="skewX(-22)"><animate attributeName="x" from="-30" to="130" dur="3.2s" repeatCount="indefinite"/></rect></svg></span>';
const HOT_BASE = 'position:relative;background:linear-gradient(135deg,#ff4fa3,#ff9a3c);color:#1a0a24;font-weight:800;text-transform:uppercase;white-space:nowrap;box-shadow:0 0 0 1px rgba(255,255,255,.4) inset,0 0 22px rgba(255,79,163,.7),0 4px 14px rgba(0,0,0,.35);';
const hotDesktop = (lang, act) => FEATURED ? `<li class="nav-hot-li" style="display:flex;align-items:center"><a href="${FEATURED[lang].href}" class="nav-hot${act ? ' active' : ''}" style="${HOT_BASE}display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:0 15px 0 12px;height:34px;margin-left:8px;font-size:11.5px;letter-spacing:.07em">${HOT_SHINE}${HOT_CLOCK}<span class="nav-hot-t" style="position:relative">${FEATURED[lang].label}</span><span class="nav-hot-s" style="position:relative;display:none">${FEATURED[lang].short}</span></a></li>` : '';
const hotMobile = (lang, act) => FEATURED ? `<a href="${FEATURED[lang].href}" class="nav-hot${act ? ' active' : ''}" style="${HOT_BASE}border-radius:14px;padding:14px 18px;margin-bottom:12px;border-bottom:0;display:flex;align-items:center;justify-content:center;gap:10px;font-size:17px;letter-spacing:.06em">${HOT_SHINE}${HOT_CLOCK}<span style="position:relative">${FEATURED[lang].label}<small style="display:block;font-size:11px;letter-spacing:.14em;opacity:.78;margin-top:2px;text-align:center">${FEATURED[lang].sub}</small></span></a>` : '';
// Dải nổi bật chỉ hiện trên điện thoại (≤1100px, lúc menu ngang bị ẩn), nằm ngay dưới thanh menu.
// Không hiện trên chính trang đích của chiến dịch.
const hotStrip = (lang) => FEATURED ? `<style data-hot-m>@media(min-width:1101px){.nav-hot-m{display:none!important}}</style><a href="${FEATURED[lang].href}" class="nav-hot-m" style="position:relative;overflow:hidden;z-index:2;display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 16px;background:linear-gradient(135deg,#ff4fa3,#ff9a3c);color:#1a0a24;font-weight:800;font-size:12.5px;letter-spacing:.09em;text-transform:uppercase;text-decoration:none;white-space:nowrap;box-shadow:0 8px 26px rgba(255,79,163,.4)">${HOT_SHINE}${HOT_CLOCK}<span style="position:relative">${FEATURED[lang].label} · ${FEATURED[lang].sub}</span><span aria-hidden="true" style="position:relative;font-size:18px;line-height:1">›</span></a>` : '';
// Mục thêm chỉ ở menu trượt (điện thoại/máy tính bảng): menu ngang đã chật (8 mục + nút nổi bật) nên không thêm vào đó
const MOBILE_EXTRA = { vi: [['/ho-so/', 'Hồ sơ tác phẩm']], en: [['/en/profile/', 'Title profiles']] };
// Menu ngang: mục "Hồ sơ" chỉ hiện từ 1600px trở lên (.nav-pf trong assets/mobile-fix.css); dưới đó menu đã kín chỗ
const PF_SHORT = { vi: 'Hồ sơ', en: 'Profiles' };
const CTA = { vi: ['/#newsletter', 'Đăng ký'], en: ['/en/#newsletter', 'Subscribe'] };
const SUB = { vi: [['/about', 'Giới thiệu'], ['/#newsletter', 'Bản tin'], ['/lien-he', 'Liên hệ']], en: [['/en/about', 'About'], ['/en/#newsletter', 'Newsletter'], ['/en/contact', 'Contact']] };
const LOGO = (home, lazy) => `<a href="${home}" class="logo" style="display:inline-flex"><img src="/assets/img/brand/otahub-icon.png" alt="" width="34" height="34" style="width:34px;height:34px;flex-shrink:0;display:inline-block"${lazy ? ' loading="lazy"' : ''}><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a>`;
const FOOTER = {
  vi: { home: '/', desc: 'Tin tức, đánh giá và lịch phát sóng game, anime, manga cho cộng đồng Việt Nam và châu Á.', copy: '© 2026 OtaHub.asia · Tin tức game, anime &amp; manga',
    cols: [['Chuyên mục', [['/news', 'Tin mới'], ['/gaming', 'Gaming'], ['/anime', 'Anime'], ['/manga', 'Manga'], ['/lich-phat-song', 'Lịch phát sóng'], ['/choi-gi', 'Chơi Gì?'], ['/ho-so/', 'Hồ sơ tác phẩm']]],
      ['Đánh giá', [['/reviews', 'Bài đánh giá'], ['/rankings', 'Bảng xếp hạng'], ['/chuyen-sau', 'Chuyên sâu'], ['/tieu-chuan-danh-gia', 'Tiêu chuẩn đánh giá']]],
      ['Về OtaHub', [['/about', 'Giới thiệu'], ['/about#team', 'Đội ngũ'], ['/lien-he', 'Liên hệ'], ['/chinh-sach-bao-mat', 'Chính sách bảo mật'], ['/#newsletter', 'Bản tin'], ['/feed.xml', 'RSS Feed']]]] },
  en: { home: '/en/', desc: 'News, reviews and broadcast schedules for games, anime and manga, from Vietnam and across Asia.', copy: '© 2026 OtaHub.asia · Gaming, anime &amp; manga news',
    cols: [['Sections', [['/en/news', 'Latest news'], ['/en/gaming', 'Gaming'], ['/en/anime', 'Anime'], ['/en/manga', 'Manga'], ['/en/lich-phat-song', 'Schedule'], ['/en/choi-gi', 'What to Play'], ['/en/profile/', 'Title profiles']]],
      ['Reviews', [['/en/reviews', 'All reviews'], ['/en/rankings', 'Rankings'], ['/en/in-depth', 'In-Depth'], ['/en/review-standards', 'Review standards']]],
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
  return href && (NAV[lang].some(([u]) => norm(u) === href) || (FEATURED && norm(FEATURED[lang].href) === href)) ? href : null;
};
// Ngôn ngữ theo đường dẫn trang; riêng admin.html ("mixed") chứa mẫu cả VI lẫn EN nên đoán theo link trong từng khối
const langOfBlock = (block, pageLang) => (pageLang !== 'mixed' ? pageLang : /href="\/en[\/"#]/.test(block) ? 'en' : 'vi');

function syncHtml(html, pageLang, pagePath) {
  // trang đích của mục nổi bật luôn được đánh dấu là trang đang xem
  const actOf = (block, lang) => (FEATURED && pagePath && norm(FEATURED[lang].href) === pagePath ? norm(FEATURED[lang].href) : activeOf(block, lang));
  // menu ngang
  html = replaceElement(html, /<ul class="nav-links"[^>]*>/, 'ul', (block) => {
    const lang = langOfBlock(block, pageLang);
    const act = actOf(block, lang);
    return `<ul class="nav-links">${NAV[lang].map(([u, t]) => `<li><a href="${u}"${norm(u) === act ? ' class="active"' : ''}>${t}</a></li>`).join('')}${MOBILE_EXTRA[lang].map(([u, t]) => `<li class="nav-pf"><a href="${u}">${PF_SHORT[lang]}</a></li>`).join('')}${hotDesktop(lang, FEATURED && norm(FEATURED[lang].href) === act)}</ul>`;
  });
  // logo trên menu -> trang chủ đúng ngôn ngữ (trang 404 giữ đường dẫn tương đối riêng)
  html = html.replace(/<style data-hot-m>[\s\S]*?<\/style><a [^>]*class="nav-hot-m"[\s\S]*?<\/a>/g, '');
  html = replaceElement(html, /<nav class="nav"[^>]*>/, 'nav', (block) => {
    const lang = langOfBlock(block, pageLang);
    const strip = FEATURED && norm(FEATURED[lang].href) !== pagePath ? hotStrip(lang) : '';
    return block.replace(/<a\b[^>]*\bclass="logo"[^>]*>/, (tag) => tag.replace(/href="(?!\.\/)[^"]*"/, `href="${FOOTER[lang].home}"`)) + strip;
  });
  // menu trượt (trang hub dùng <div>, vài trang như Top List dùng <nav>)
  for (const tag of ['div', 'nav']) {
    html = replaceElement(html, new RegExp(`<${tag} class="mobile-nav"[^>]*>`), tag, (block) => {
      const open = block.match(new RegExp(`^<${tag}[^>]*>`))[0];
      const lang = langOfBlock(block, pageLang);
      const act = actOf(block, lang);
      // trang bài viết có thêm dòng phụ (Giới thiệu · Bản tin · Liên hệ) ở cuối menu trượt
      const sub = /class="m-sub"/.test(block) ? `<div class="m-sub">${SUB[lang].map(([u, t]) => `<a href="${u}">${t}</a>`).join('')}</div>` : '';
      return `${open}\n  ${hotMobile(lang, FEATURED && norm(FEATURED[lang].href) === act)}${[...NAV[lang], ...MOBILE_EXTRA[lang]].map(([u, t]) => `<a href="${u}"${norm(u) === act ? ' class="active"' : ''}>${t}</a>`).join('')}${sub}\n</${tag}>`;
    });
  }
  // nút Đăng ký
  html = html.replace(/<a\b([^>]*)\bclass="cta"([^>]*)>[^<]*<\/a>/g, (a, pre, post) => {
    if (!/newsletter/.test(a)) return a; // vd. trang 404: nút "Về trang chủ"
    const lang = pageLang === 'mixed' ? (/href="\/en/.test(a) ? 'en' : 'vi') : pageLang;
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
  const lang = f === 'admin.html' ? 'mixed' : /^en\/|\.en\.html$/.test(f) ? 'en' : 'vi';
  const before = fs.readFileSync(rel(f), 'utf8');
  const after = syncHtml(before, lang, '/' + f.replace(/\.html$/, ''));
  if (after === before) continue;
  changed++;
  if (CHECK) console.log('lệch:', f);
  else fs.writeFileSync(rel(f), after, 'utf8');
}
console.log(`${CHECK ? 'Cần đồng bộ' : 'Đã đồng bộ menu/footer'}: ${changed}/${files.length} trang`);
if (CHECK && changed) process.exitCode = 1;
