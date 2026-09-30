import fs from 'fs';

const hubPages = [
  'index.html', 'choi-gi.html', 'gaming.html', 'anime.html', 'manga.html', 
  'reviews.html', 'rankings.html', 'chuyen-sau.html', 'news.html', 'about.html'
];

for (const p of hubPages) {
  const content = fs.readFileSync(p, 'utf8');
  const navLinksMatch = content.match(/<ul class="nav-links">([\s\S]*?)<\/ul>/);
  const mobLinksMatch = content.match(/<div class="mobile-nav"[^>]*>([\s\S]*?)<\/div>/);
  
  const navHrefs = navLinksMatch ? (navLinksMatch[1].match(/href="([^"]+)"/g) || []).map(h => h.replace(/href="|"$/g, '')) : [];
  const mobHrefs = mobLinksMatch ? (mobLinksMatch[1].match(/href="([^"]+)"/g) || []).map(h => h.replace(/href="|"$/g, '')) : [];

  console.log(`[${p}]`);
  console.log(`  Nav links (${navHrefs.length}):`, navHrefs.join(', '));
  console.log(`  Mob links (${mobHrefs.length}):`, mobHrefs.join(', '));
}
