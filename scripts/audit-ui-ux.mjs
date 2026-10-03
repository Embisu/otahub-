import fs from 'fs';
import path from 'path';

const hubPages = [
  'index.html', 'choi-gi.html', 'gaming.html', 'anime.html', 'manga.html', 
  'reviews.html', 'rankings.html', 'chuyen-sau.html', 'news.html', 'about.html',
  'game-detail.html', 'anime-detail.html', 'manga-detail.html',
  'en/index.html', 'en/gaming.html', 'en/anime.html', 'en/manga.html',
  'en/reviews.html', 'en/rankings.html', 'en/in-depth.html', 'en/news.html', 'en/about.html'
];

console.log('=== AUDITING CORE HUB PAGES ===');
for (const p of hubPages) {
  if (!fs.existsSync(p)) {
    console.log('MISSING:', p);
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');

  // Check open/close div balance
  const openDivs = (content.match(/<div(\s|>)/gi) || []).length;
  const closeDivs = (content.match(/<\/div>/gi) || []).length;
  const divDiff = openDivs - closeDivs;

  // Check section tags
  const openSecs = (content.match(/<section(\s|>)/gi) || []).length;
  const closeSecs = (content.match(/<\/section>/gi) || []).length;

  // Check aside tags
  const openAsides = (content.match(/<aside(\s|>)/gi) || []).length;
  const closeAsides = (content.match(/<\/aside>/gi) || []).length;

  // Check main/nav/footer
  const hasNav = content.includes('class="nav"') || content.includes('<nav');
  const hasMobileNav = content.includes('mobileNav') || content.includes('mobile-nav');
  const hasFooter = content.includes('class="ft"') || content.includes('<footer');
  const hasSearchModal = content.includes('searchModal');

  // Check viewport meta
  const hasViewport = content.includes('name="viewport"');

  // Check for common layout issues:
  // 1. Grid structure: check if latest-wrap or similar sidebars are trapped
  let issues = [];
  if (divDiff !== 0) issues.push(`div mismatch (${divDiff})`);
  if (openSecs !== closeSecs) issues.push(`section mismatch (${openSecs - closeSecs})`);
  if (openAsides !== closeAsides) issues.push(`aside mismatch (${openAsides - closeAsides})`);
  if (!hasNav) issues.push('missing nav');
  if (!hasMobileNav) issues.push('missing mobile-nav');
  if (!hasFooter) issues.push('missing footer');
  if (!hasViewport) issues.push('missing viewport meta');

  console.log(
    p.padEnd(24),
    `Divs: ${openDivs}/${closeDivs}`,
    `Asides: ${openAsides}/${closeAsides}`,
    `Nav: ${hasNav ? 'OK' : 'NO'}`,
    `MobNav: ${hasMobileNav ? 'OK' : 'NO'}`,
    `Footer: ${hasFooter ? 'OK' : 'NO'}`,
    issues.length > 0 ? `ISSUES: [${issues.join(', ')}]` : 'OK'
  );
}
