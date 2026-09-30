import fs from 'fs';

const enHubPages = [
  'en/index.html', 'en/gaming.html', 'en/anime.html', 'en/manga.html', 
  'en/reviews.html', 'en/rankings.html', 'en/in-depth.html', 'en/news.html', 'en/about.html'
];

for (const p of enHubPages) {
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const navLinksMatch = content.match(/<ul class="nav-links">([\s\S]*?)<\/ul>/);
  const mobLinksMatch = content.match(/<div class="mobile-nav"[^>]*>([\s\S]*?)<\/div>/);
  
  const navHrefs = navLinksMatch ? (navLinksMatch[1].match(/href="([^"]+)"/g) || []).map(h => h.replace(/href="|"$/g, '')) : [];
  const mobHrefs = mobLinksMatch ? (mobLinksMatch[1].match(/href="([^"]+)"/g) || []).map(h => h.replace(/href="|"$/g, '')) : [];

  console.log(`[${p}]`);
  console.log(`  Nav links (${navHrefs.length}):`, navHrefs.join(', '));
  console.log(`  Mob links (${mobHrefs.length}):`, mobHrefs.join(', '));
}
