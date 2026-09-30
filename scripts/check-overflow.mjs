import fs from 'fs';

const hubPages = [
  'index.html', 'choi-gi.html', 'gaming.html', 'anime.html', 'manga.html', 
  'reviews.html', 'rankings.html', 'chuyen-sau.html', 'news.html', 'about.html',
  'en/index.html', 'en/gaming.html', 'en/anime.html', 'en/manga.html',
  'en/reviews.html', 'en/rankings.html', 'en/in-depth.html', 'en/news.html', 'en/about.html'
];

console.log('=== CHECKING POTENTIAL HORIZONTAL OVERFLOW / LAYOUT BUGS ===');

for (const p of hubPages) {
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');

  const warnings = [];

  // Check if html/body has overflow-x: hidden
  const hasOverflowHidden = content.includes('overflow-x:hidden') || content.includes('overflow-x: hidden');
  if (!hasOverflowHidden) {
    warnings.push('missing body/html overflow-x:hidden');
  }

  // Check for inline fixed widths > 500px without max-width
  const inlineWidthMatches = [...content.matchAll(/style="[^"]*(?<![a-z-])width:\s*([5-9]\d{2,}|[1-9]\d{3,})px[^"]*"/gi)];
  if (inlineWidthMatches.length > 0) {
    warnings.push(`${inlineWidthMatches.length} inline fixed width >= 500px: ${inlineWidthMatches.map(m => m[0]).join(', ')}`);
  }

  // Check if images lack max-width: 100% or similar
  const hasImgFit = content.includes('img-fit') || content.includes('max-width:100%') || content.includes('max-width: 100%');
  if (!hasImgFit) {
    warnings.push('lacks img-fit script or responsive img css');
  }

  // Check mobile media queries
  const hasMobileMQ = content.includes('max-width: 768px') || content.includes('max-width:768px') || content.includes('max-width: 600px') || content.includes('max-width:600px');
  if (!hasMobileMQ) {
    warnings.push('missing mobile media query');
  }

  console.log(`[${p}] ${warnings.length > 0 ? 'WARNINGS: ' + warnings.join('; ') : 'ALL OK'}`);
}
