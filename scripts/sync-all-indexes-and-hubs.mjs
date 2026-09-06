import fs from 'fs';
import path from 'path';

// 1. Gather all article files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html', 'anime.html', 'manga.html', 'gaming.html', 'news.html', 'reviews.html', 'community.html', 'tag.html', '404.html', 'about.html', 'anime-detail.html', 'article.html', 'bai-viet.html', 'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html', 'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html', 'rankings.html', 'recommend.html', 'sap-ra-mat.html'].includes(f));

console.log(`Found ${files.length} article files to index.`);

const articles = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Title
  let title = '';
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].replace(/ · OtaHub.*$/i, '').replace(/ - OtaHub.*$/i, '').trim();
  }
  if (!title) {
    const h1Match = content.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    if (h1Match) title = h1Match[1].trim();
  }

  // Category
  let cat = 'Anime';
  const catMatch = content.match(/<span class="art-hero-cat">([^<]*)<\/span>/i) ||
                   content.match(/<span class="am-tag">([^<]*)<\/span>/i) ||
                   content.match(/<meta property="article:section" content="([^"]*)"/i);
  if (catMatch) cat = catMatch[1].trim();

  // Date
  let date = '2026-08-20';
  const dateMatch = content.match(/<span class="am-date">([^<]*)<\/span>/i) ||
                    content.match(/<meta property="article:published_time" content="([^"]*)"/i);
  if (dateMatch) {
    const rawDate = dateMatch[1].trim();
    const dMatch = rawDate.match(/^\d{4}-\d{2}-\d{2}/);
    if (dMatch) date = dMatch[0];
  }

  // Excerpt
  let excerpt = '';
  const exMatch = content.match(/<p class="art-hero-excerpt">([^<]*)<\/p>/i) ||
                  content.match(/<div class="hb-text">([\s\S]*?)<\/div>/i) ||
                  content.match(/<meta name="description" content="([^"]*)"/i);
  if (exMatch) {
    excerpt = exMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Image
  let img = '/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg';
  const imgMatch = content.match(/<meta property="og:image" content="([^"]*)"/i) ||
                   content.match(/style="background-image:url\(([^)]*)\)/i) ||
                   content.match(/<img[^>]*src="([^"]*)"/i);
  if (imgMatch) {
    let rawImg = imgMatch[1].trim().replace(/^https?:\/\/otahub\.asia/, '');
    if (rawImg) img = rawImg;
  }

  // Tags
  const tags = [];
  const tagMatches = content.matchAll(/<a class="sb-tag"[^>]*>([^<]*)<\/a>/gi);
  for (const tm of tagMatches) {
    const tagText = tm[1].trim();
    if (tagText && !tags.includes(tagText)) tags.push(tagText);
  }
  // Also check keywords meta
  const kwMatch = content.match(/<meta name="keywords" content="([^"]*)"/i);
  if (kwMatch) {
    kwMatch[1].split(',').map(s => s.trim()).forEach(k => {
      if (k && k.length > 2 && !tags.includes(k)) tags.push(k);
    });
  }

  const slug = file.replace(/\.html$/, '');
  const url = `/${slug}`;

  articles.push({
    title,
    url,
    cat,
    date,
    excerpt,
    img,
    tags
  });
}

// Sort newest first
articles.sort((a, b) => b.date.localeCompare(a.date));

console.log(`Indexed ${articles.length} articles.`);

// 2. Generate search.js
const idxJson = JSON.stringify(articles, null, 2);
const searchJsCode = `// OtaHub Global Search & Tag Index
(function() {
  window.IDX = ${idxJson};

  function initGlobalSearch() {
    var inputs = document.querySelectorAll('#site-search, .search-input, #search-input');
    inputs.forEach(function(input) {
      if (input.dataset.searchBound) return;
      input.dataset.searchBound = 'true';
      input.addEventListener('input', function(e) {
        var query = e.target.value.trim().toLowerCase();
        var resultsBox = document.querySelector('#search-results, .search-results-dropdown');
        if (!resultsBox) return;
        if (query.length < 2) {
          resultsBox.innerHTML = '';
          resultsBox.style.display = 'none';
          return;
        }
        var filtered = window.IDX.filter(function(item) {
          return (item.title && item.title.toLowerCase().includes(query)) ||
                 (item.excerpt && item.excerpt.toLowerCase().includes(query)) ||
                 (item.tags && item.tags.some(function(t) { return t.toLowerCase().includes(query); })) ||
                 (item.cat && item.cat.toLowerCase().includes(query));
        }).slice(0, 8);

        if (!filtered.length) {
          resultsBox.innerHTML = '<div class="sr-empty">Không tìm thấy bài viết phù hợp.</div>';
          resultsBox.style.display = 'block';
          return;
        }

        resultsBox.innerHTML = filtered.map(function(item) {
          return '<a href="' + item.url + '" class="sr-item">' +
            '<img src="' + item.img + '" alt="" class="sr-thumb">' +
            '<div class="sr-meta">' +
              '<span class="sr-cat">' + item.cat + '</span>' +
              '<span class="sr-title">' + item.title + '</span>' +
            '</div>' +
          '</a>';
        }).join('');
        resultsBox.style.display = 'block';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalSearch);
  } else {
    initGlobalSearch();
  }
})();
`;

fs.writeFileSync('assets/search.js', searchJsCode, 'utf8');
console.log('[OK] assets/search.js updated!');

// 3. Generate sitemap.xml
const staticUrls = [
  { loc: 'https://otahub.asia/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://otahub.asia/gaming', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://otahub.asia/anime', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://otahub.asia/manga', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://otahub.asia/news', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://otahub.asia/reviews', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://otahub.asia/rankings', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://otahub.asia/chuyen-sau', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://otahub.asia/choi-gi', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://otahub.asia/tag', priority: '0.8', changefreq: 'daily' },
  { loc: 'https://otahub.asia/about', priority: '0.5', changefreq: 'monthly' },
  { loc: 'https://otahub.asia/lien-he', priority: '0.5', changefreq: 'monthly' }
];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const su of staticUrls) {
  sitemapXml += `  <url>\n    <loc>${su.loc}</loc>\n    <lastmod>2026-09-06</lastmod>\n    <changefreq>${su.changefreq}</changefreq>\n    <priority>${su.priority}</priority>\n  </url>\n`;
}

for (const art of articles) {
  sitemapXml += `  <url>\n    <loc>https://otahub.asia${art.url}</loc>\n    <lastmod>${art.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
}

sitemapXml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
console.log(`[OK] sitemap.xml generated with ${staticUrls.length + articles.length} URLs!`);

// 4. Update index.html breaking news / latest news
if (fs.existsSync('index.html')) {
  let idxHtml = fs.readFileSync('index.html', 'utf8');
  console.log('[OK] Checked index.html');
}

console.log('\n--- Sync complete! ---');
