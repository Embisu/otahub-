import fs from 'fs';
import path from 'path';

// 1. All articles
const hubPages = new Set([
  'index.html', 'about.html', 'rankings.html', 'choi-gi.html', 'reviews.html', 
  'news.html', 'gaming.html', 'anime.html', 'manga.html', 'chuyen-sau.html', 
  'lien-he.html', 'chinh-sach-bao-mat.html', 'dieu-khoan-su-dung.html', 
  'lich-phat-song.html', 'sap-ra-mat.html', '404.html', 'admin.html', 
  'news-pipeline.html', 'tag.html', 'article.html', 'anime-detail.html',
  'game-detail.html', 'manga-detail.html', 'bai-viet.html', 'huong-dan.html', 'recommend.html'
]);

const viArticles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !hubPages.has(f));
const enArticles = fs.readdirSync('en').filter(f => f.endsWith('.html') && !hubPages.has(f) && !['in-depth.html', 'contact.html', 'privacy.html', 'terms.html'].includes(f)).map(f => 'en/' + f);

console.log(`Vietnamese articles count: ${viArticles.length}`);
console.log(`English articles count: ${enArticles.length}`);
console.log(`Total content articles: ${viArticles.length + enArticles.length}`);

// 2. Sitemap coverage
const sm = fs.readFileSync('sitemap.xml', 'utf8');
const smLocs = new Set([...sm.matchAll(/<loc>https:\/\/otahub\.asia\/([^<]*)<\/loc>/g)].map(m => {
  let s = m[1].replace(/\/$/, '');
  if (!s) s = 'index';
  if (!s.endsWith('.html')) s += '.html';
  return s;
}));

const viMissingSitemap = viArticles.filter(a => !smLocs.has(a));
const enMissingSitemap = enArticles.filter(a => !smLocs.has(a));

console.log(`\nSitemap XML Total URLs: ${smLocs.size}`);
console.log(`VI Articles missing from Sitemap: ${viMissingSitemap.length}`);
if (viMissingSitemap.length) console.log(viMissingSitemap);
console.log(`EN Articles missing from Sitemap: ${enMissingSitemap.length}`);
if (enMissingSitemap.length) console.log(enMissingSitemap);

// 3. Search Index coverage (assets/search.js)
global.window = {};
await import('../assets/search.js');
const searchSet = new Set(window.IDX.map(item => {
  let u = item.url.replace(/^\//, '');
  if (!u.endsWith('.html')) u += '.html';
  return u;
}));

const viMissingSearch = viArticles.filter(a => !searchSet.has(a));
console.log(`\nInternal Search Index Total Entries: ${window.IDX.length}`);
console.log(`VI Articles missing from Search Index: ${viMissingSearch.length}`);
if (viMissingSearch.length) console.log(viMissingSearch);

// 4. Check noindex
const noindexArticles = [];
for (const a of [...viArticles, ...enArticles]) {
  const c = fs.readFileSync(a, 'utf8');
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(c)) {
    noindexArticles.push(a);
  }
}
console.log(`\nArticles with 'noindex' (blocked from Google): ${noindexArticles.length}`);

// 5. Check Inbound Links (Internal linking & orphan pages)
const allHtml = [
  ...fs.readdirSync('.').filter(f => f.endsWith('.html')),
  ...fs.readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f)
];

const inbounds = new Map();
[...viArticles, ...enArticles].forEach(a => inbounds.set(a, 0));

for (const f of allHtml) {
  if (['admin.html', 'news-pipeline.html'].includes(f)) continue;
  const c = fs.readFileSync(f, 'utf8');
  const links = [...c.matchAll(/href=["'](?:\/en\/|\/)([^"'#?]+)["']/g)].map(m => {
    let s = m[1].replace(/\/$/, '');
    if (m[0].includes('/en/')) s = 'en/' + s;
    if (!s.endsWith('.html')) s += '.html';
    return s;
  });
  for (const t of links) {
    if (inbounds.has(t) && t !== f) {
      inbounds.set(t, inbounds.get(t) + 1);
    }
  }
}

const orphans = [];
const lowLinks = [];
for (const [art, count] of inbounds.entries()) {
  if (count === 0) orphans.push(art);
  else if (count === 1) lowLinks.push(art);
}

console.log(`\nOrphan Articles (0 inbound internal links): ${orphans.length}`);
if (orphans.length) console.log(orphans);
console.log(`Articles with only 1 inbound link: ${lowLinks.length}`);
