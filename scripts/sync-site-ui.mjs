import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skip = new Set(['.git', 'node_modules']);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
}

walk(root);

const brokenEnFiles = new Set([
  'about.html', 'anime.html', 'article.html', 'bai-viet.html', 'choi-gi.html',
  'gaming.html', 'lien-he.html', 'manga.html', 'recommend.html',
  'xbox-showcase-2026.html',
]);

const counters = {
  changedFiles: 0,
  choiGi: 0,
  copyright: 0,
  backgrounds: 0,
  desktopDeepLinks: 0,
  mobileDeepLinks: 0,
  brokenEnControls: 0,
};

function countedReplace(source, pattern, replacement, key) {
  return source.replace(pattern, (...args) => {
    counters[key] += 1;
    return typeof replacement === 'function' ? replacement(...args) : replacement;
  });
}

function addDeepLinkToNav(block, isEnglish) {
  if (!/href=["'][^"']*rankings/i.test(block)) return block;
  if (/href=["'][^"']*(?:chuyen-sau|in-depth)/i.test(block)) return block;

  const href = isEnglish ? '/en/in-depth' : '/chuyen-sau';
  const label = isEnglish ? 'In-depth' : 'Chuyên sâu';

  const listItem = /(<li\b[^>]*>\s*<a\b[^>]*href=["'][^"']*rankings[^"']*["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
  if (listItem.test(block)) {
    counters.desktopDeepLinks += 1;
    return block.replace(listItem, `$1<li><a href="${href}">${label}</a></li>`);
  }

  const plainAnchor = /(<a\b[^>]*href=["'][^"']*rankings[^"']*["'][^>]*>[\s\S]*?<\/a>)/i;
  if (plainAnchor.test(block)) {
    counters.mobileDeepLinks += 1;
    return block.replace(plainAnchor, `$1<a href="${href}">${label}</a>`);
  }

  return block;
}

for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const original = fs.readFileSync(file, 'utf8');
  let html = original;

  html = countedReplace(html, /Choi Gi\?/g, 'Chơi Gì?', 'choiGi');
  html = countedReplace(html, /©\s*2024/g, '© 2026', 'copyright');
  html = countedReplace(html, /&copy;\s*2024/gi, '&copy; 2026', 'copyright');
  html = countedReplace(
    html,
    /--bg\s*:\s*#(?:080313|090316|0b0220|0b0318|0e0e12|0f0524|100422)\b/gi,
    '--bg:#0b0418',
    'backgrounds',
  );

  const isEnglish = relative.startsWith('en/') || /<html\b[^>]*lang=["']en/i.test(html);
  html = html.replace(/<nav\b[\s\S]*?<\/nav>/gi, (nav) => addDeepLinkToNav(nav, isEnglish));
  html = html.replace(
    /<div\b[^>]*class=["'][^"']*mobile-nav[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
    (mobileNav) => addDeepLinkToNav(mobileNav, isEnglish),
  );

  if (brokenEnFiles.has(relative)) {
    if (relative === 'recommend.html') {
      html = countedReplace(
        html,
        /\s*<div class="lang">[\s\S]*?<button\b[^>]*id="ben"[^>]*>\s*EN\s*<\/button>\s*<\/div>/i,
        '',
        'brokenEnControls',
      );
    } else {
      html = countedReplace(
        html,
        /\s*<button\b[^>]*id="ben"[^>]*>\s*EN\s*<\/button>\s*<\/div>/i,
        '',
        'brokenEnControls',
      );
    }
  }

  if (relative === 'xbox-showcase-2026.html' && !/<button class="nsearch"/i.test(html)) {
    html = html.replace(
      /(<div class="nav-r">)/i,
      `$1\n<button class="nsearch" aria-label="Tìm kiếm" onclick="openSearch()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button>`,
    );
  }

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    counters.changedFiles += 1;
  }
}

console.log(JSON.stringify({ htmlFiles: files.length, ...counters }, null, 2));
