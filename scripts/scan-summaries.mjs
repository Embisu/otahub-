import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file === 'en') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      const base = path.basename(file);
      if (!['index.html', 'anime.html', 'gaming.html', 'manga.html', 'news.html', 'reviews.html', 'rankings.html', 'choi-gi.html', 'chuyen-sau.html', 'about.html', 'tag.html', 'privacy.html', 'terms.html', '404.html'].includes(base)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const files = getHtmlFiles('.');
console.log('Total articles scanned:', files.length);

const issues = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const hbMatch = content.match(/<div class="hb-text">([\s\S]*?)<\/div>/i);
  const excerptMatch = content.match(/<p class="art-hero-excerpt">([\s\S]*?)<\/p>/i);
  const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  const hbText = hbMatch ? hbMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const excerptText = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  const testTexts = [hbText, excerptText].filter(Boolean);
  
  for (const text of testTexts) {
    const hasSemicolonChain = text.includes(';') && (text.includes('chương') || text.includes('tập') || text.includes('chapter') || text.includes('season') || text.includes('volume') || text.includes('Toei') || text.includes('mùa'));
    const hasRoboticPrefix = /^Review\s+[^:]{2,40}:\s*(chương|chapter|tập|season|volume|\d+|tập\s+\d+)/i.test(text);
    const hasMultipleSemicolons = (text.match(/;/g) || []).length >= 2;
    const hasTemplateArtifacts = text.includes('chương 1') && text.includes('tập 1') && text.includes(';');

    if (hasSemicolonChain || hasRoboticPrefix || hasMultipleSemicolons || hasTemplateArtifacts) {
      issues.push({ file, title, text, type: hasRoboticPrefix ? 'ROBOTIC_PREFIX' : (hasMultipleSemicolons ? 'SEMICOLONS' : 'TEMPLATE') });
      break;
    }
  }
}

console.log('Found', issues.length, 'articles with clunky / robotic summary pattern:\n');
issues.forEach((item, idx) => {
  console.log(`[${idx + 1}] ${item.file} (${item.type})`);
  console.log(`    Title: ${item.title}`);
  console.log(`    Summary: ${item.text}\n`);
});

fs.writeFileSync('scripts/summary-issues.json', JSON.stringify(issues, null, 2));
