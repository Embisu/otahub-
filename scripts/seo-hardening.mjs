import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://otahub.asia';
const today = new Date('2026-08-24T12:00:00+07:00');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.name === '.git' || e.name === 'node_modules' || e.name === 'brain' || e.name === 'templates'
      ? []
      : e.isDirectory()
      ? walk(path.join(dir, e.name))
      : [path.join(dir, e.name)]
  );
}

function escXml(s = '') {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function clean(s = '') {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1] || '';
}

function imageSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (file.toLowerCase().endsWith('.svg')) {
      const s = b.toString('utf8');
      const wh = s.match(/<svg[^>]*\bwidth=["']([\d.]+)["'][^>]*\bheight=["']([\d.]+)["']/i);
      if (wh) return [Math.round(+wh[1]), Math.round(+wh[2])];
      const vb = s.match(/\bviewBox=["'][^"']*?([\d.]+)\s+([\d.]+)["']/i);
      if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])];
    }
    if (b.length > 24 && b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = b[i + 1];
        const len = b.readUInt16BE(i + 2);
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
          return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
        }
        i += 2 + len;
      }
    }
  } catch {}
  return null;
}

function categoryFor(rel, html) {
  const text = (rel + ' ' + (html.match(/<meta[^>]+(?:article:section|name=["']category["'])[^>]+content=["']([^"']+)/i)?.[1] || '')).toLowerCase();
  if (text.includes('anime')) return ['Anime', rel.startsWith('en/') ? '/en/anime' : '/anime'];
  if (text.includes('manga') || text.includes('manhwa')) return ['Manga', rel.startsWith('en/') ? '/en/manga' : '/manga'];
  if (text.includes('review')) return ['Reviews', rel.startsWith('en/') ? '/en/reviews' : '/reviews'];
  return [rel.startsWith('en/') ? 'Gaming' : 'Gaming', rel.startsWith('en/') ? '/en/gaming' : '/gaming'];
}

function addBreadcrumb(html, rel) {
  if (!/property=["']og:type["'][^>]+content=["']article["']/i.test(html) || html.includes('"BreadcrumbList"')) return html;
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1];
  const title = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  if (!canonical || !title) return html;
  const en = rel.startsWith('en/');
  const [cat, catPath] = categoryFor(rel, html);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: en ? 'Home' : 'Trang chủ', item: site + (en ? '/en' : '/') },
      { '@type': 'ListItem', position: 2, name: cat, item: site + catPath },
      { '@type': 'ListItem', position: 3, name: title, item: canonical }
    ]
  };
  return html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>\n</head>`);
}

const htmlFiles = walk(root).filter(f => f.endsWith('.html'));
let sized = 0, priority = 0, breadcrumbs = 0;

for (const file of htmlFiles) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  if (['admin.html', 'article.html', 'en/article.html'].includes(rel)) continue;

  html = html.replace(/\/\s+fetchpriority=/gi, ' fetchpriority=');
  html = html.replace(/<img\b[^>]*>/gi, tag => {
    const src = attr(tag, 'src').split('?')[0];
    let out = tag;
    if (src.startsWith('/assets/') && !/\bwidth=/i.test(tag) && !/\bheight=/i.test(tag)) {
      const size = imageSize(path.join(root, src.slice(1)));
      if (size) {
        out = out.replace(/\s*\/?>(?=$)/, ` width="${size[0]}" height="${size[1]}">`);
        sized++;
      }
    }
    return out;
  });

  const h1End = html.search(/<\/h1>/i);
  if (h1End >= 0) {
    const tail = html.slice(h1End);
    const m = tail.match(/<img\b[^>]*>/i);
    if (m && !m[0].includes('${')) {
      let tag = m[0];
      if (!/fetchpriority=/i.test(tag)) {
        tag = tag.replace(/\sloading=["']lazy["']/i, '').replace(/\/?\s*>$/, ' fetchpriority="high" decoding="async">');
        html = html.slice(0, h1End) + tail.replace(m[0], tag);
        priority++;
      }
    }
  }

  const withCrumbs = addBreadcrumb(html, rel);
  if (withCrumbs !== html) breadcrumbs++;
  html = withCrumbs;

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
}

// Extract article and page data
const allPages = [];
const articles = [];

for (const file of htmlFiles) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  if (['admin.html', 'article.html', 'en/article.html', '404.html', 'en/404.html'].includes(rel)) continue;

  const h = fs.readFileSync(file, 'utf8');
  const canonical = h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1];
  const url = canonical || (site + '/' + rel.replace('.html', '').replace('index', ''));
  const title = clean(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || h.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const desc = attr(h.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] || '', 'content');
  const dateStr = h.match(/(?:datePublished|article:published_time)["']?\s*(?::|content=)["']([^"']+)/i)?.[1];
  const date = dateStr ? new Date(dateStr) : today;
  const image = h.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1];
  const isArticle = /property=["']og:type["'][^>]+content=["']article["']/i.test(h);

  const pageObj = {
    rel,
    url: url.startsWith('http') ? url : site + (url.startsWith('/') ? '' : '/') + url,
    title,
    desc,
    date,
    image,
    isArticle,
    lang: rel.startsWith('en/') ? 'en' : 'vi'
  };

  allPages.push(pageObj);
  if (isArticle && dateStr) {
    articles.push(pageObj);
  }
}

articles.sort((a, b) => b.date - a.date);

// 1. FULL SITEMAP.XML (All published pages & articles)
const sitemapUrls = allPages.map(p => {
  const prio = p.rel === 'index.html' || p.rel === 'en/index.html' ? '1.0' : p.isArticle ? '0.8' : '0.9';
  const changeFreq = p.isArticle ? 'monthly' : 'daily';
  const lastmod = p.date.toISOString().split('T')[0];
  return `  <url>\n    <loc>${escXml(p.url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changeFreq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
}).join('\n');

fs.writeFileSync(
  path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);

// 2. RSS FEED.XML (50 most recent articles)
const rssItems = articles.slice(0, 50).map(a =>
  `  <item><title>${escXml(a.title)}</title><link>${escXml(a.url)}</link><guid isPermaLink="true">${escXml(a.url)}</guid><pubDate>${a.date.toUTCString()}</pubDate><description>${escXml(a.desc)}</description>${a.image ? `<media:content url="${escXml(a.image)}" medium="image"/>` : ''}</item>`
).join('\n');

fs.writeFileSync(
  path.join(root, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>OtaHub · Gaming, Anime &amp; Manga</title><link>${site}/</link><description>Tin mới và bài phân tích từ OtaHub</description><language>vi</language><lastBuildDate>${today.toUTCString()}</lastBuildDate>\n${rssItems}\n</channel></rss>\n`
);

// 3. GOOGLE NEWS SITEMAP (sitemap-news.xml)
const news = articles.filter(a => (today - a.date) / 86400000 <= 3 && (today - a.date) / 86400000 >= -1).slice(0, 1000);
const newsUrls = news.map(a =>
  `  <url><loc>${escXml(a.url)}</loc><news:news><news:publication><news:name>OtaHub</news:name><news:language>${a.lang}</news:language></news:publication><news:publication_date>${a.date.toISOString()}</news:publication_date><news:title>${escXml(a.title)}</news:title></news:news></url>`
).join('\n');

fs.writeFileSync(
  path.join(root, 'sitemap-news.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${newsUrls}\n</urlset>\n`
);

// 4. Validate JSON-LD across all pages
const invalidJsonLd = [];
for (const file of htmlFiles) {
  if (path.basename(file) === 'admin.html') continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    if (m[1].includes('${')) continue;
    try {
      JSON.parse(m[1]);
    } catch (e) {
      invalidJsonLd.push(path.relative(root, file) + ': ' + e.message);
    }
  }
}

if (invalidJsonLd.length) throw new Error('Invalid JSON-LD\n' + invalidJsonLd.join('\n'));

console.log(JSON.stringify({
  htmlFiles: htmlFiles.length,
  totalSitemapPages: allPages.length,
  sized,
  priority,
  breadcrumbs,
  rssItems: Math.min(50, articles.length),
  newsItems: news.length,
  invalidJsonLd: 0
}));
