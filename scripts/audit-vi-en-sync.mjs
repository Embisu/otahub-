import fs from 'fs';
import path from 'path';

const viFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('.'));
const enFiles = fs.readdirSync('en').filter(f => f.endsWith('.html') && !f.startsWith('.'));

console.log(`VI HTML files: ${viFiles.length}`);
console.log(`EN HTML files: ${enFiles.length}`);

// Check hreflang parity
const viMissingEn = [];
const viBrokenEn = [];
const enMissingVi = [];
const enBrokenVi = [];
const mismatched = [];

for (const f of viFiles) {
  if (['admin.html', 'news-pipeline.html', 'tag.html'].includes(f)) continue; // skip utility templates
  const content = fs.readFileSync(f, 'utf8');
  const enMatch = content.match(/<link\s+rel="alternate"\s+hreflang="en"\s+href="https:\/\/otahub\.asia\/en\/([^"]*)"/i) ||
                  content.match(/<link\s+rel="alternate"\s+href="https:\/\/otahub\.asia\/en\/([^"]*)"\s+hreflang="en"/i);
  
  if (!enMatch) {
    viMissingEn.push(f);
  } else {
    let enTarget = enMatch[1].replace(/\/$/, '');
    if (!enTarget) enTarget = 'index';
    if (!enTarget.endsWith('.html')) enTarget += '.html';
    const enPath = path.join('en', enTarget);
    if (!fs.existsSync(enPath)) {
      viBrokenEn.push(`${f} -> ${enMatch[1]} (not found: ${enPath})`);
    } else {
      // Check if EN backlinks to VI
      const enContent = fs.readFileSync(enPath, 'utf8');
      const viSlug = f.replace('.html', '');
      const hasBacklink = enContent.includes(`href="https://otahub.asia/${viSlug}"`) ||
                          enContent.includes(`href="https://otahub.asia/${f}"`) ||
                          (viSlug === 'index' && (enContent.includes('href="https://otahub.asia/"') || enContent.includes('href="https://otahub.asia"')));
      if (!hasBacklink) {
        mismatched.push(`${f} links to ${enPath}, but ${enPath} does not link back to ${viSlug}`);
      }
    }
  }
}

for (const f of enFiles) {
  const filePath = path.join('en', f);
  const content = fs.readFileSync(filePath, 'utf8');
  const viMatch = content.match(/<link\s+rel="alternate"\s+hreflang="vi"\s+href="https:\/\/otahub\.asia\/([^"]*)"/i) ||
                  content.match(/<link\s+rel="alternate"\s+href="https:\/\/otahub\.asia\/([^"]*)"\s+hreflang="vi"/i);
  
  if (!viMatch) {
    enMissingVi.push(filePath);
  } else {
    let viTarget = viMatch[1].replace(/\/$/, '');
    if (!viTarget) viTarget = 'index';
    if (!viTarget.endsWith('.html')) viTarget += '.html';
    if (!fs.existsSync(viTarget)) {
      enBrokenVi.push(`${filePath} -> ${viMatch[1]} (not found: ${viTarget})`);
    }
  }
}

console.log('\n--- KẾT QUẢ KIỂM TRA HREFLANG ---');
console.log(`VI files missing hreflang="en": ${viMissingEn.length}`);
viMissingEn.forEach(x => console.log('  -', x));
console.log(`VI files with BROKEN hreflang="en" (target file doesn't exist): ${viBrokenEn.length}`);
viBrokenEn.forEach(x => console.log('  -', x));
console.log(`VI <-> EN Mismatched backlinks: ${mismatched.length}`);
mismatched.forEach(x => console.log('  -', x));

console.log(`EN files missing hreflang="vi": ${enMissingVi.length}`);
enMissingVi.forEach(x => console.log('  -', x));
console.log(`EN files with BROKEN hreflang="vi" (target file doesn't exist): ${enBrokenVi.length}`);
enBrokenVi.forEach(x => console.log('  -', x));

console.log('\n--- SO SÁNH TRANG HUB CHỦ ---');
const hubPairs = [
  ['index.html', 'en/index.html'],
  ['anime.html', 'en/anime.html'],
  ['gaming.html', 'en/gaming.html'],
  ['manga.html', 'en/manga.html'],
  ['news.html', 'en/news.html'],
  ['reviews.html', 'en/reviews.html'],
  ['rankings.html', 'en/rankings.html'],
  ['choi-gi.html', 'en/choi-gi.html'],
  ['chuyen-sau.html', 'en/in-depth.html'],
  ['about.html', 'en/about.html'],
  ['lien-he.html', 'en/contact.html'],
  ['chinh-sach-bao-mat.html', 'en/privacy.html'],
  ['dieu-khoan-su-dung.html', 'en/terms.html']
];

for (const [vi, en] of hubPairs) {
  const viOk = fs.existsSync(vi) ? 'OK' : 'MISSING';
  const enOk = fs.existsSync(en) ? 'OK' : 'MISSING';
  console.log(`Hub: ${(vi + ' <-> ' + en).padEnd(40)} | VI: ${viOk} | EN: ${enOk}`);
}
