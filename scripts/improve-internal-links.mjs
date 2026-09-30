import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const report = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'indexing-audit-report.json'), 'utf8'));
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s = '') => String(s).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(root, rel), html); }
function attr(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return plain(html.match(new RegExp(`<meta[^>]+(?:name|property)="${escaped}"[^>]+content="([^"]*)"`, 'i'))?.[1] || '');
}
function articleData(rel) {
  const html = read(rel);
  return {
    rel,
    title: attr(html, 'og:title').replace(/\s*·\s*OtaHub.*$/i, '') || plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || rel),
    category: attr(html, 'article:section').toLowerCase(),
  };
}
function hubFor(item, article) {
  const isEn = article.rel.startsWith('en/');
  const prefix = isEn ? 'en/' : '';
  const newsHub = `${prefix}news.html`;
  if ((item.from || []).includes(newsHub)) {
    if (/anime/.test(article.category)) return `${prefix}anime.html`;
    if (/manga|manhwa/.test(article.category)) return `${prefix}manga.html`;
    if (/review/.test(article.category)) return `${prefix}reviews.html`;
    return `${prefix}gaming.html`;
  }
  return newsHub;
}

// Gỡ bản thử nghiệm cũ nếu script đã từng chạy, để không giữ liên kết gợi ý
// chỉ dựa trên độ giống từ khóa.
for (const rel of [...fs.readdirSync(root).filter((f) => f.endsWith('.html')), ...fs.readdirSync(path.join(root, 'en')).filter((f) => f.endsWith('.html')).map((f) => `en/${f}`)]) {
  const html = read(rel);
  const next = html
    .replace(/\s*<aside class="art-related-links"[\s\S]*?<\/aside>\s*/gi, '\n')
    .replace(/\s*<!-- AUTO_DISCOVERY_START -->[\s\S]*?<!-- AUTO_DISCOVERY_END -->\s*/gi, '\n');
  if (next !== html) write(rel, next);
}

const grouped = new Map();
for (const item of report.lowInboundArticles || []) {
  const article = articleData(item.article);
  const hub = hubFor(item, article);
  if (!grouped.has(hub)) grouped.set(hub, []);
  grouped.get(hub).push(article);
}

let linksAdded = 0;
for (const [hub, articles] of grouped) {
  let html = read(hub).replace(/\s*<!-- AUTO_DISCOVERY_START -->[\s\S]*?<!-- AUTO_DISCOVERY_END -->\s*/i, '\n');
  const links = articles.sort((a, b) => a.title.localeCompare(b.title, 'vi')).map((article) => {
    linksAdded++;
    return `<li><a href="/${article.rel.replace(/\.html$/, '')}">${esc(article.title)}</a></li>`;
  }).join('\n');
  const isEn = hub.startsWith('en/');
  const label = isEn ? 'DISCOVER MORE ARTICLES' : 'KHÁM PHÁ THÊM BÀI VIẾT';
  const block = `\n<!-- AUTO_DISCOVERY_START -->\n<section class="discovery-archive" aria-labelledby="discovery-title" style="max-width:1320px;margin:32px auto;padding:0 22px">\n<details style="border:1px solid rgba(0,229,255,.18);background:rgba(12,5,31,.72);padding:18px 20px">\n<summary id="discovery-title" style="cursor:pointer;color:#00e5ff;font-weight:700;letter-spacing:.06em">${label}</summary>\n<ul style="columns:3;column-gap:32px;margin:18px 0 0;padding-left:20px">\n${links}\n</ul>\n</details>\n</section>\n<!-- AUTO_DISCOVERY_END -->\n`;
  if (/<footer\b/i.test(html)) html = html.replace(/<footer\b/i, `${block}<footer`);
  else if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${block}</body>`);
  else throw new Error(`Không tìm thấy điểm chèn cuối trang trong ${hub}`);
  write(hub, html);
}

const map = [...grouped].flatMap(([hub, articles]) => articles.map((article) => ({ hub, target: article.rel, title: article.title })));
fs.writeFileSync(path.join(root, 'scripts', 'internal-link-map.json'), JSON.stringify(map, null, 2));
console.log(JSON.stringify({ hubsUpdated: grouped.size, linksAdded, map: 'scripts/internal-link-map.json' }, null, 2));
