import fs from 'fs';
import path from 'path';

console.log('=== AUDITING ARTICLE INDEXING & DISCOVERABILITY ===\n');

// 1. Collect all published article HTML files
const hubNames = [
  'index.html', 'about.html', 'rankings.html', 'choi-gi.html', 'reviews.html', 
  'news.html', 'gaming.html', 'anime.html', 'manga.html', 'chuyen-sau.html', 
  'lien-he.html', 'chinh-sach-bao-mat.html', 'dieu-khoan-su-dung.html', 
  'lich-phat-song.html', 'sap-ra-mat.html', '404.html', 'admin.html', 
  'news-pipeline.html', 'tag.html', 'article.html', 'anime-detail.html',
  'game-detail.html', 'manga-detail.html', 'author.html', 'bai-viet.html',
  'huong-dan.html', 'top-list.html', 'recommend.html', 'tieu-chuan-danh-gia.html'
];

function isHubOrUtility(relPath) {
  const norm = relPath.replace(/^en\//, '');
  if (hubNames.includes(relPath) || hubNames.includes(norm)) return true;
  if (['en/in-depth.html', 'en/contact.html', 'en/privacy.html', 'en/terms.html'].includes(relPath)) return true;
  return false;
}

const allViArticles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !isHubOrUtility(f));
const allEnArticles = fs.readdirSync('en').filter(f => f.endsWith('.html') && !isHubOrUtility('en/' + f)).map(f => 'en/' + f);

const totalArticles = [...allViArticles, ...allEnArticles];
console.log(`Total Vietnamese Articles: ${allViArticles.length}`);
console.log(`Total English Articles: ${allEnArticles.length}`);
console.log(`Total Articles to Audit: ${totalArticles.length}\n`);

// 2. Load Sitemap.xml
const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = new Set([...sitemapContent.matchAll(/<loc>https:\/\/otahub\.asia\/([^<]*)<\/loc>/g)].map(m => {
  let s = m[1].replace(/\/$/, '');
  if (!s) s = 'index';
  if (!s.endsWith('.html')) s += '.html';
  return s;
}));

// 3. Load assets/search.js
let searchUrls = new Set();
if (fs.existsSync('assets/search.js')) {
  const searchContent = fs.readFileSync('assets/search.js', 'utf8');
  const matches = [...searchContent.matchAll(/["']?url["']?\s*:\s*["']([^"']+)["']/g)].map(m => {
    let s = m[1].replace(/^\//, '');
    if (!s.endsWith('.html')) s += '.html';
    return s;
  });
  searchUrls = new Set(matches);
}

// 4. Inbound Link Matrix (Orphan Page Detection)
// Build map of inbound links for every article
const inboundLinks = new Map();
totalArticles.forEach(a => inboundLinks.set(a, []));

// Read all HTML files (hubs + articles) to count inbound links
const allHtmlFiles = [
  ...fs.readdirSync('.').filter(f => f.endsWith('.html')),
  ...fs.readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f)
];

for (const sourceFile of allHtmlFiles) {
  if (['admin.html', 'news-pipeline.html'].includes(sourceFile)) continue;
  const content = fs.readFileSync(sourceFile, 'utf8');
  
  // Find all internal links
  const links = [...content.matchAll(/href=["'](?:\/en\/|\/)([^"'#?]+)["']/g)].map(m => {
    let s = m[1].replace(/\/$/, '');
    if (m[0].includes('/en/')) s = 'en/' + s;
    if (!s.endsWith('.html')) s += '.html';
    return s;
  });

  for (const target of links) {
    if (inboundLinks.has(target) && target !== sourceFile) {
      inboundLinks.get(target).push(sourceFile);
    }
  }
}

// 5. Audit Each Article
const missingFromSitemap = [];
const missingFromSearch = [];
const blockedByNoindex = [];
const orphanArticles = []; // 0 inbound links
const lowInboundArticles = []; // < 2 inbound links

for (const article of totalArticles) {
  const content = fs.readFileSync(article, 'utf8');

  // Check Sitemap
  if (!sitemapUrls.has(article)) {
    missingFromSitemap.push(article);
  }

  // Check Search
  if (!searchUrls.has(article)) {
    missingFromSearch.push(article);
  }

  // Check Robots meta for accidental noindex
  const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  if (robotsMatch && robotsMatch[1].toLowerCase().includes('noindex')) {
    blockedByNoindex.push({ article, robots: robotsMatch[1] });
  }

  // Check Inbound Links
  const inbounds = inboundLinks.get(article) || [];
  if (inbounds.length === 0) {
    orphanArticles.push(article);
  } else if (inbounds.length < 2) {
    lowInboundArticles.push({ article, inbounds: inbounds.length, from: inbounds });
  }
}

// 6. Check robots.txt
let robotsTxtStatus = 'OK';
if (fs.existsSync('robots.txt')) {
  const robotsTxt = fs.readFileSync('robots.txt', 'utf8');
  console.log('--- robots.txt preview ---');
  console.log(robotsTxt.trim());
} else {
  robotsTxtStatus = 'MISSING robots.txt';
}

console.log('\n=== INDEXING AUDIT RESULTS ===');
console.log(`1. Articles Missing from sitemap.xml: ${missingFromSitemap.length}`);
if (missingFromSitemap.length) console.log(missingFromSitemap);

console.log(`2. Articles Missing from Search Index (assets/search.js): ${missingFromSearch.length}`);
if (missingFromSearch.length) console.log(missingFromSearch);

console.log(`3. Articles Blocked by 'noindex': ${blockedByNoindex.length}`);
if (blockedByNoindex.length) console.log(blockedByNoindex);

console.log(`4. Orphan Articles (0 inbound internal links from any page): ${orphanArticles.length}`);
if (orphanArticles.length) console.log(orphanArticles);

console.log(`5. Low Inbound Link Articles (only 1 inbound link): ${lowInboundArticles.length}`);
if (lowInboundArticles.length) console.log(lowInboundArticles.slice(0, 10));

fs.writeFileSync('scripts/indexing-audit-report.json', JSON.stringify({
  missingFromSitemap,
  missingFromSearch,
  blockedByNoindex,
  orphanArticles,
  lowInboundArticles
}, null, 2), 'utf8');
