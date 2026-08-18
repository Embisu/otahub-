#!/usr/bin/env node
/**
 * OtaHub — build-hub-chrome.js (Giai đoạn 5, phạm vi thu hẹp)
 * ---------------------------------------------------------------
 * KHÔNG giống build.js (không sinh lại toàn bộ trang từ JSON).
 * Trang hub (index/gaming/anime/manga/reviews/rankings/choi-gi/chuyen-sau)
 * mỗi trang có theme màu + CSS + nội dung riêng (cố ý, không phải lỗi) nên
 * không thể gộp thành 1 template dùng chung như trang bài viết.
 *
 * Script này chỉ đồng bộ 2 phần THẬT SỰ bị lệch giữa các trang hub:
 *   1. <nav> + mobile nav  → thay bằng templates/partials/hub-nav.html
 *   2. <footer>            → thay bằng templates/partials/hub-footer.html
 * Và chèn CSS còn thiếu (templates/partials/hub-chrome-inject.css) để 2 phần
 * trên hiển thị đúng trên các trang vốn chưa có sẵn class tương ứng.
 * Toàn bộ CSS theme riêng, nội dung card/grid của từng trang GIỮ NGUYÊN.
 *
 * Cách chạy:
 *   node scripts/build-hub-chrome.js            → dry-run, chỉ báo sẽ đổi gì
 *   node scripts/build-hub-chrome.js --write     → ghi đè trực tiếp vào 8 file gốc
 *
 * Luôn chạy `git diff <file>` sau khi --write để soát lại trước khi commit.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PARTIALS_DIR = path.join(ROOT, 'templates', 'partials');

const NAV_SECTIONS = ['choi-gi', 'gaming', 'anime', 'manga', 'reviews', 'rankings', 'chuyen-sau'];

const PAGES = [
  { file: 'index.html', activeSection: null },
  { file: 'gaming.html', activeSection: 'gaming' },
  { file: 'anime.html', activeSection: 'anime' },
  { file: 'manga.html', activeSection: 'manga' },
  { file: 'reviews.html', activeSection: 'reviews' },
  { file: 'rankings.html', activeSection: 'rankings' },
  { file: 'choi-gi.html', activeSection: 'choi-gi' },
  { file: 'chuyen-sau.html', activeSection: 'chuyen-sau' },
];

function stripComment(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '').trim();
}

function renderNavAndMobile(activeSection) {
  const raw = stripComment(fs.readFileSync(path.join(PARTIALS_DIR, 'hub-nav.html'), 'utf8'));
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  let nav = lines[0];
  let mobileNav = lines[1];
  for (const section of NAV_SECTIONS) {
    const token = `{{ACTIVE_${section.toUpperCase().replace('-', '_')}}}`;
    const value = section === activeSection ? ' class="active"' : '';
    nav = nav.split(token).join(value);
    mobileNav = mobileNav.split(token).join(value);
  }
  return { nav, mobileNav };
}

function renderFooter() {
  return stripComment(fs.readFileSync(path.join(PARTIALS_DIR, 'hub-footer.html'), 'utf8'));
}

const INJECT_CSS_RAW = fs.readFileSync(path.join(PARTIALS_DIR, 'hub-chrome-inject.css'), 'utf8');
// Tách 2 khối: phần footer (mọi thứ trước dòng .nsearch{) và phần search (từ .nsearch{ trở đi)
const searchCssStart = INJECT_CSS_RAW.indexOf('.nsearch{');
const FOOTER_CSS = INJECT_CSS_RAW.slice(0, searchCssStart).replace(/^\/\*[\s\S]*?\*\/\n/, '').trim();
const SEARCH_CSS = INJECT_CSS_RAW.slice(searchCssStart).trim();

// Tìm vị trí đóng của thẻ <div ...> mở tại openIdx, có tính lồng nhau (chỉ đếm div)
function findMatchingDivClose(content, openTagStartIdx) {
  const tagRe = /<div\b[^>]*>|<\/div>/g;
  tagRe.lastIndex = openTagStartIdx;
  const openTagEnd = content.indexOf('>', openTagStartIdx) + 1;
  let depth = 1;
  tagRe.lastIndex = openTagEnd;
  let m;
  while ((m = tagRe.exec(content))) {
    if (m[0] === '</div>') {
      depth--;
      if (depth === 0) return m.index + m[0].length;
    } else {
      depth++;
    }
  }
  throw new Error('Không tìm thấy </div> khớp cho mobile-nav — kiểm tra lại cấu trúc HTML.');
}

function processFile(file, activeSection, write) {
  const filePath = path.join(ROOT, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1) NAV
  const navStart = content.indexOf('<nav class="nav">');
  if (navStart === -1) throw new Error(`${file}: không tìm thấy <nav class="nav">`);
  const navCloseTag = '</nav>';
  const navEnd = content.indexOf(navCloseTag, navStart) + navCloseTag.length;
  const { nav, mobileNav } = renderNavAndMobile(activeSection);
  content = content.slice(0, navStart) + nav + content.slice(navEnd);

  // 2) MOBILE NAV (tìm lại vị trí sau khi đã thay nav ở trên)
  const mnavStart = content.indexOf('<div class="mobile-nav" id="mobileNav">');
  if (mnavStart === -1) throw new Error(`${file}: không tìm thấy mobile-nav`);
  const mnavEnd = findMatchingDivClose(content, mnavStart);
  content = content.slice(0, mnavStart) + mobileNav + content.slice(mnavEnd);

  // 3) FOOTER
  const footerStart = content.indexOf('<footer');
  if (footerStart === -1) throw new Error(`${file}: không tìm thấy <footer`);
  const footerCloseTag = '</footer>';
  const footerEnd = content.indexOf(footerCloseTag, footerStart) + footerCloseTag.length;
  content = content.slice(0, footerStart) + renderFooter() + content.slice(footerEnd);

  // 4) CSS còn thiếu — chèn trước </style> ĐẦU TIÊN
  const hasFooterCss = /\.ft-in\{/.test(content);
  const hasSearchCss = /\.nsearch\{/.test(content);
  let cssToInject = '';
  if (!hasFooterCss) cssToInject += '\n' + FOOTER_CSS + '\n';
  if (!hasSearchCss) cssToInject += '\n' + SEARCH_CSS + '\n';
  if (cssToInject) {
    const firstStyleClose = content.indexOf('</style>');
    if (firstStyleClose === -1) throw new Error(`${file}: không tìm thấy </style>`);
    content = content.slice(0, firstStyleClose) + cssToInject + content.slice(firstStyleClose);
  }

  const changed = content !== original;
  if (write && changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return { file, changed, injectedFooterCss: !hasFooterCss, injectedSearchCss: !hasSearchCss, bytesBefore: original.length, bytesAfter: content.length };
}

function main() {
  const write = process.argv.includes('--write');
  console.log(write ? 'Chế độ: GHI FILE\n' : 'Chế độ: DRY-RUN (không ghi gì, thêm --write để ghi)\n');
  for (const { file, activeSection } of PAGES) {
    try {
      const r = processFile(file, activeSection, write);
      console.log(`${r.changed ? '[ĐỔI]' : '[GIỮ NGUYÊN]'} ${r.file} (${r.bytesBefore} → ${r.bytesAfter} ký tự)` +
        (r.injectedFooterCss ? ' +footer-css' : '') + (r.injectedSearchCss ? ' +search-css' : ''));
    } catch (e) {
      console.error(`[LỖI] ${file}: ${e.message}`);
      process.exitCode = 1;
    }
  }
  if (write) console.log('\nĐã ghi xong. Chạy "git diff <file>" để soát từng trang trước khi commit.');
}

main();
