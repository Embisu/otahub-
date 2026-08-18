#!/usr/bin/env node
/**
 * OtaHub — build.js (Giai đoạn 3)
 * ---------------------------------------------------------------
 * Lắp ráp trang bài viết từ:
 *   - src/pages/*.json          (nội dung + biến riêng từng bài)
 *   - templates/partials/*.html + article-style.css  (khung dùng chung)
 * Xuất ra HTML tĩnh hoàn chỉnh, byte-tương-thích với cấu trúc hiện có
 * của site (đối chiếu mortal-shell-2-release.html khi viết script này).
 *
 * KHÔNG cần npm install — chỉ dùng module có sẵn của Node.js (fs, path).
 *
 * Cách chạy:
 *   node scripts/build.js                → dry-run, liệt kê sẽ build gì, KHÔNG ghi file
 *   node scripts/build.js --write         → build + ghi đè vào thư mục gốc repo
 *   node scripts/build.js --write --only=mortal-shell-2-release,gta6-trailer3-netflix-premiere
 *                                          → chỉ build vài trang chỉ định (dùng khi pilot)
 *
 * An toàn: LUÔN chạy trên nhánh git riêng (vd. refactor/shared-template).
 * Sau khi --write, dùng `git diff` để soát từng dòng thay đổi trước khi commit —
 * đây là bước "diff" thật sự của quy trình, không cần build.js tự làm diff.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const PARTIALS_DIR = path.join(ROOT, 'templates', 'partials');

// ---------- Đọc partial dùng chung (đọc 1 lần, dùng lại cho mọi trang) ----------
function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS_DIR, name), 'utf8');
}

const PARTIAL_NAV = readPartial('article-nav.html');
const PARTIAL_FOOTER = readPartial('article-footer.html');
const PARTIAL_SCRIPTS = readPartial('article-scripts.html');
const PARTIAL_HEAD_BOILERPLATE = readPartial('article-head-boilerplate.html');
const PARTIAL_STYLE = readPartial('article-style.css');

const NAV_SECTIONS = ['choi-gi', 'gaming', 'anime', 'manga', 'reviews', 'rankings', 'chuyen-sau'];

// ---------- Helpers ----------
function esc(str) {
  // escape cho thuộc tính HTML (title, alt, meta content...)
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNav(activeSection) {
  let nav = PARTIAL_NAV;
  for (const section of NAV_SECTIONS) {
    const token = `{{ACTIVE_${section.toUpperCase().replace('-', '_')}}}`;
    nav = nav.split(token).join(section === activeSection ? ' class="active"' : '');
  }
  return nav;
}

function renderRelatedArticles(items = []) {
  return items.map(it => (
    `<a class="sb-art" href="${it.url}">` +
    `<img class="sb-thumb" src="${it.img}" alt="${esc(it.alt)}" loading="lazy" width="${it.width || 1920}" height="${it.height || 720}">` +
    `<div><div class="sb-cat">${esc(it.cat)}</div><div class="sb-t">${esc(it.title)}</div></div></a>`
  )).join('');
}

function renderTags(tags = []) {
  return tags.map(t => `<a class="sb-tag" href="${t.url}">${esc(t.label)}</a>`).join('');
}

function renderShareRow(page) {
  const url = `https://otahub.asia${page.canonical}`;
  const twitterText = encodeURIComponent(`${page.title}`);
  return `<div class="share-row"><span class="share-lbl">Chia sẻ:</span>` +
    `<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener">Facebook</a>` +
    `<a class="share-btn" href="https://twitter.com/intent/tweet?url=${url}&amp;text=${twitterText}" target="_blank" rel="noopener">Twitter / X</a>` +
    `<a class="share-btn" href="https://www.reddit.com/submit?url=${url}" target="_blank" rel="noopener">Reddit</a>` +
    `<button class="share-btn" type="button" onclick="copyArticleLink(this)">Sao chép link</button></div>`;
}

function jsonLdArticle(page) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: page.title,
    description: page.description,
    image: page.ogImage,
    datePublished: page.publishedTime,
    dateModified: page.modifiedTime,
    author: { '@type': 'Organization', name: 'OtaHub Editorial', url: 'https://otahub.asia' },
    publisher: {
      '@type': 'Organization',
      name: 'OtaHub',
      url: 'https://otahub.asia',
      logo: { '@type': 'ImageObject', url: 'https://otahub.asia/favicon-192.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://otahub.asia${page.canonical}` },
    keywords: page.keywords || '',
    inLanguage: 'vi',
  }, null, 2);
}

function jsonLdBreadcrumb(page) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://otahub.asia/' },
      { '@type': 'ListItem', position: 2, name: page.breadcrumbSection, item: `https://otahub.asia${page.breadcrumbSectionUrl}` },
      { '@type': 'ListItem', position: 3, name: page.title, item: `https://otahub.asia${page.canonical}` },
    ],
  });
}

// ---------- Render 1 trang ----------
function renderArticlePage(page) {
  const titleFull = `${page.title} · OtaHub`;
  const fullUrl = `https://otahub.asia${page.canonical}`;

  const head = `<title>${esc(titleFull)}</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${esc(page.description)}">
<meta name="author" content="OtaHub Editorial">
<link rel="alternate" hreflang="vi" href="${fullUrl}"><link rel="alternate" hreflang="en" href="https://otahub.asia/en${page.canonical}"><link rel="alternate" hreflang="x-default" href="${fullUrl}"><link rel="canonical" href="${fullUrl}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(titleFull)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${fullUrl}">
<meta property="og:image" content="${page.ogImage}">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="vi_VN">
<meta property="article:author" content="OtaHub Editorial">
<meta property="article:published_time" content="${page.publishedTime}">
<meta property="article:modified_time" content="${page.modifiedTime}">
<meta property="article:section" content="${esc(page.section)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titleFull)}">
<meta name="twitter:description" content="${esc(page.twitterDescription || page.description)}">
<meta name="twitter:image" content="${page.ogImage}">
<script type="application/ld+json">
${jsonLdArticle(page)}
</script>
${PARTIAL_HEAD_BOILERPLATE}
<style>
${PARTIAL_STYLE}
</style>
<script type="application/ld+json">${jsonLdBreadcrumb(page)}</script>`;

  const body = `${renderNav(page.activeSection)}
<section class="art-hero">
<div class="art-hero-img" style="background-image:url(${page.heroImage});background-color:#0b0418;"></div>
<div class="art-hero-grad"></div>
<div class="art-hero-content">
<span class="art-hero-cat">${esc(page.section)}</span>
<h1 class="art-hero-title">${esc(page.heroTitle || page.title)}</h1>
<p class="art-hero-excerpt">${esc(page.heroExcerpt)}</p>
</div>
</section>
<div class="art-layout">
<main class="art-main">
<nav class="breadcrumb" aria-label="breadcrumb">
<a href="/">OtaHub</a>
<span class="breadcrumb-sep">›</span>
<a href="${page.breadcrumbSectionUrl}">${esc(page.breadcrumbSection)}</a>
<span class="breadcrumb-sep">›</span>
<span>${esc(page.title)}</span>
</nav>
<div class="art-meta">
<span class="am-tag">${esc(page.section)}</span>
<span class="am-sep"></span>
<span class="am-date">${page.metaDate}</span>
<span class="am-sep"></span>
<span class="am-read">${esc(page.metaReadTime)}</span>
<span class="am-sep"></span>
<span class="am-badge">OtaHub Editorial</span>
</div>
<div class="highlight-box">
<div class="hb-label">${esc(page.summaryLabel || 'Tóm Tắt')}</div>
<div class="hb-text">${page.summaryText}</div>
</div>
<article class="art-body">
${page.bodyHtml}
</article>
${renderShareRow(page)}
</main>
<aside class="art-sidebar"><div class="sidebar-block"><div class="sb-title">Bài liên quan</div>${renderRelatedArticles(page.relatedArticles)}</div><div class="sidebar-block"><div class="sb-title">Tags</div><div class="sb-tags">${renderTags(page.tags)}</div></div></aside>
</div>
${PARTIAL_FOOTER}
${PARTIAL_SCRIPTS}`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

// ---------- Main ----------
function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const onlyArg = args.find(a => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.replace('--only=', '').split(',') : null;

  if (!fs.existsSync(PAGES_DIR)) {
    console.log(`Chưa có trang nào trong ${path.relative(ROOT, PAGES_DIR)}/ — tạo file .json ở đó theo mẫu trong templates/README.md trước.`);
    return;
  }

  const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log(`${path.relative(ROOT, PAGES_DIR)}/ đang trống — chưa có trang nào để build.`);
    return;
  }

  let built = 0;
  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    if (only && !only.includes(slug)) continue;

    const page = JSON.parse(fs.readFileSync(path.join(PAGES_DIR, file), 'utf8'));
    const html = renderArticlePage(page);
    const outPath = path.join(ROOT, `${slug}.html`);
    const exists = fs.existsSync(outPath);

    if (write) {
      fs.writeFileSync(outPath, html, 'utf8');
      console.log(`${exists ? '[GHI ĐÈ]' : '[MỚI]   '} ${slug}.html (${html.length.toLocaleString()} ký tự)`);
    } else {
      console.log(`${exists ? '[sẽ ghi đè]' : '[sẽ tạo mới]'} ${slug}.html (${html.length.toLocaleString()} ký tự) — chạy lại với --write để ghi file`);
    }
    built++;
  }

  if (built === 0) {
    console.log('Không có trang nào khớp --only, kiểm tra lại tên slug.');
  } else if (write) {
    console.log(`\nĐã ghi ${built} file. Chạy "git diff" ngay bây giờ để soát từng dòng thay đổi trước khi commit.`);
  } else {
    console.log(`\nDry-run xong (${built} trang). Không có gì được ghi. Thêm --write khi đã sẵn sàng.`);
  }
}

main();
