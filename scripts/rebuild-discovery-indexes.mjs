import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://otahub.asia';
const utilityFiles = new Set([
  '404.html', 'admin.html', 'anime-detail.html', 'article.html', 'author.html',
  'bai-viet.html', 'game-detail.html', 'huong-dan.html', 'manga-detail.html',
  'news-pipeline.html', 'tag.html', 'top-list.html',
]);

const escXml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const plain = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const decode = (value = '') => String(value)
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const match = (html, regex) => decode(plain((html.match(regex) || [,''])[1] || ''));
const attr = (html, property, name) => match(html, new RegExp(`<meta[^>]+${property}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]+content=["']([^"']*)`, 'i'));
const truncate = (value, max = 160) => {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  return slice.slice(0, Math.max(slice.lastIndexOf(' '), max - 20)).trimEnd() + '…';
};

function collectHtml() {
  const rootFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html')).map((name) => name);
  const enFiles = fs.readdirSync(path.join(root, 'en')).filter((name) => name.endsWith('.html')).map((name) => `en/${name}`);
  const profiles = ['author/otahub.html', 'author/yu.html', 'author/anhthu.html', 'author/anna.html', 'en/author/otahub.html', 'en/author/yu.html', 'en/author/anhthu.html', 'en/author/anna.html'];
  return [...rootFiles, ...enFiles, ...profiles].filter((rel) => fs.existsSync(path.join(root, rel)));
}

function pageData(rel) {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
  const robots = attr(html, 'name', 'robots').toLowerCase();
  const isArticle = attr(html, 'property', 'og:type').toLowerCase() === 'article';
  const dateRaw = attr(html, 'property', 'article:published_time') || match(html, /"datePublished"\s*:\s*"([^"]+)"/i);
  const date = /^\d{4}-\d{2}-\d{2}/.test(dateRaw) ? dateRaw : '';
  return {
    rel, html, canonical, robots, isArticle, date,
    lang: rel.startsWith('en/') ? 'en' : 'vi',
    title: attr(html, 'property', 'og:title') || match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || match(html, /<title>([\s\S]*?)<\/title>/i),
    description: attr(html, 'name', 'description'),
    image: attr(html, 'property', 'og:image').replace(origin, ''),
    category: attr(html, 'property', 'article:section') || match(html, /<span class=["'](?:art-hero-cat|am-tag)["'][^>]*>([^<]+)/i) || 'Tin tức',
    author: attr(html, 'name', 'author') || 'OtaHub Editorial',
  };
}

const pages = collectHtml().map(pageData).filter((page) =>
  page.canonical.startsWith(origin) && !page.robots.includes('noindex') &&
  !utilityFiles.has(page.rel.replace(/^en\//, ''))
);

const canonicalMap = new Map();
for (const page of pages) {
  if (canonicalMap.has(page.canonical)) {
    throw new Error(`Canonical bị trùng: ${page.canonical} (${canonicalMap.get(page.canonical).rel}, ${page.rel})`);
  }
  canonicalMap.set(page.canonical, page);
}

const sitemap = [...pages]
  .sort((a, b) => a.canonical.localeCompare(b.canonical))
  .map((page) => `  <url>\n    <loc>${escXml(page.canonical)}</loc>${page.date ? `\n    <lastmod>${page.date.slice(0, 10)}</lastmod>` : ''}\n  </url>`)
  .join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);

const articles = pages.filter((page) => page.isArticle);
const searchItems = articles.map((page) => ({
  title: page.title.replace(/\s*[·|-]\s*OtaHub.*$/i, '').trim(),
  url: new URL(page.canonical).pathname.replace(/\/$/, '') || '/',
  cat: page.category,
  date: page.date.slice(0, 10),
  excerpt: page.description,
  img: page.image || '/assets/img/placeholder.svg',
  tags: [],
  lang: page.lang,
})).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, a.lang));

const searchPath = path.join(root, 'assets', 'search.js');
let searchJs = fs.readFileSync(searchPath, 'utf8');
if (!/window\.IDX\s*=\s*\[[\s\S]*?\];/.test(searchJs)) throw new Error('Không tìm thấy window.IDX trong assets/search.js');
searchJs = searchJs.replace(/window\.IDX\s*=\s*\[[\s\S]*?\];/, `window.IDX = ${JSON.stringify(searchItems, null, 2)};`);
fs.writeFileSync(searchPath, searchJs);

const now = new Date();
const minNewsDate = new Date(now.getTime() - 2 * 86400000);
const newsItems = articles.filter((page) => {
  const date = new Date(page.date);
  return Number.isFinite(date.getTime()) && date >= minNewsDate && date <= new Date(now.getTime() + 86400000);
}).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 1000);
const newsXml = newsItems.map((page) => `  <url>\n    <loc>${escXml(page.canonical)}</loc>\n    <news:news>\n      <news:publication><news:name>OtaHub</news:name><news:language>${page.lang}</news:language></news:publication>\n      <news:publication_date>${escXml(page.date)}</news:publication_date>\n      <news:title>${escXml(page.title.replace(/\s*[·|-]\s*OtaHub.*$/i, '').trim())}</news:title>\n    </news:news>\n  </url>`).join('\n');
fs.writeFileSync(path.join(root, 'sitemap-news.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${newsXml}\n</urlset>\n`);

if (pages.length < 400 || articles.length < 400) {
  throw new Error(`Chỉ mục nhỏ bất thường: ${pages.length} URL, ${articles.length} bài.`);
}
console.log(JSON.stringify({ sitemapUrls: pages.length, searchItems: searchItems.length, newsItems: newsItems.length }, null, 2));
