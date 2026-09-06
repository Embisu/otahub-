import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html','admin.html','gaming.html','anime.html','manga.html','news.html','reviews.html','rankings.html','choi-gi.html','about.html','lien-he.html','chinh-sach-bao-mat.html','lich-phat-song.html','sap-ra-mat.html','chuyen-sau.html','404.html','article.html','anime-detail.html','bai-viet.html'].includes(f));

console.log('Total article files to inspect:', files.length);

const shortArticles = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const bodyMatch = content.match(/<article class="art-body[^"]*">([\s\S]*?)<\/article>/);
  if (!bodyMatch) continue;
  const rawText = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  // check if text ends abruptly
  const isTruncated = /[\,\:\–\-\(]\s*$/.test(rawText) || rawText.endsWith('đá') || rawText.endsWith('cùng');
  
  if (wordCount < 400 || isTruncated) {
    shortArticles.push({ file, wordCount, isTruncated, preview: rawText.slice(0, 120) + '...' });
  }
}

shortArticles.sort((a,b) => a.wordCount - b.wordCount);
console.log('Found short or potentially truncated articles:', shortArticles.length);
console.log(JSON.stringify(shortArticles.slice(0, 30), null, 2));
