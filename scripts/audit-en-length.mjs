import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('en').filter(f => f.endsWith('.html') && !['index.html','404.html','gaming.html','anime.html','manga.html','reviews.html','rankings.html'].includes(f));

console.log('Total EN article files to inspect:', files.length);

const shortEn = [];
for (const file of files) {
  const content = fs.readFileSync(path.join('en', file), 'utf8');
  const bodyMatch = content.match(/<article class="art-body[^"]*">([\s\S]*?)<\/article>/);
  if (!bodyMatch) continue;
  const rawText = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = rawText.split(/\s+/).filter(Boolean);
  if (words.length < 300) {
    shortEn.push({ file, wordCount: words.length });
  }
}
console.log('Found short EN articles:', shortEn.length);
console.log(JSON.stringify(shortEn.slice(0, 20), null, 2));
