import fs from 'fs';

const index = fs.readFileSync('index.html', 'utf8');

// Check hero
console.log('=== HERO MAIN ===');
const heroM = index.match(/<div class="hero-main"[\s\S]*?<\/div>\s*<\/div>/);
if (heroM) {
  const hTitle = (heroM[0].match(/id="h-title">([^<]+)</) || [])[1];
  const hHref = (heroM[0].match(/location\.href='([^']+)'/) || [])[1];
  console.log('Hero:', hHref, '->', hTitle);
}

// Check latest-wrap
console.log('\n=== LATEST WRAP (Bài mới nhất) ===');
const p = index.indexOf('latest-wrap');
const latestBlock = index.slice(p, p + 5000);
const cards = latestBlock.match(/<article class="w-card">[\s\S]*?<\/article>/g) || [];
console.log('Total cards in latest-wrap:', cards.length);
cards.slice(0, 10).forEach((c, i) => {
  const title = (c.match(/<div class="wc-t">([^<]+)<\/div>/) || [])[1];
  const href = (c.match(/href="([^"]+)"/) || [])[1];
  console.log(`${i + 1}. ${href} -> ${title}`);
});

// Check ticker
console.log('\n=== TICKER TRACK ===');
const tickM = index.match(/<div class="tick-track">([\s\S]*?)<\/div>/);
if (tickM) {
  const ticks = tickM[1].match(/<span class="tick-item">[\s\S]*?<\/span>/g) || [];
  console.log('Total ticks:', ticks.length);
  ticks.slice(0, 8).forEach((t, i) => {
    const text = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`${i + 1}. ${text}`);
  });
}
