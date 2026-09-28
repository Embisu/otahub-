import fs from 'fs';

const viIndex = fs.readFileSync('index.html', 'utf8');
const enIndex = fs.readFileSync('en/index.html', 'utf8');

function extractHrefs(html) {
  const matches = [...html.matchAll(/href="(\/[^"]+)"/g)].map(m => m[1]);
  // filter article slugs
  return [...new Set(matches.filter(h => 
    !h.startsWith('/assets') && 
    !['/', '/en/', '/gaming', '/anime', '/manga', '/reviews', '/rankings', '/choi-gi', '/chuyen-sau', '/about', '/#newsletter', '/feed.xml', '/privacy', '/terms'].includes(h) &&
    !h.startsWith('/en/gaming') && !h.startsWith('/en/anime') && !h.startsWith('/en/manga') && !h.startsWith('/en/reviews') && !h.startsWith('/en/rankings') && !h.startsWith('/en/choi-gi') && !h.startsWith('/en/in-depth') && !h.startsWith('/en/about')
  ))];
}

const viArticlesOnHome = extractHrefs(viIndex);
const enArticlesOnHome = extractHrefs(enIndex);

console.log('--- VI HOMEPAGE ARTICLES ---', viArticlesOnHome.length);
viArticlesOnHome.forEach(a => console.log('  VI:', a));

console.log('\n--- EN HOMEPAGE ARTICLES ---', enArticlesOnHome.length);
enArticlesOnHome.forEach(a => console.log('  EN:', a));
