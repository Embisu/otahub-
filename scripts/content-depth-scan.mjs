import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.argv[2] || '.';
const SYSTEM_EXACT = new Set([
  'index.html', 'gaming.html', 'anime.html', 'manga.html', 'news.html',
  'reviews.html', 'choi-gi.html', 'recommend.html', 'lich-phat-song.html',
  'sap-ra-mat.html', 'rankings.html', 'chuyen-sau.html', 'in-depth.html',
  'about.html', 'lien-he.html', 'chinh-sach-bao-mat.html', 'admin.html',
  '404.html', 'anime-detail.html', 'article.html', 'bai-viet.html',
  'game-detail.html', 'huong-dan.html', 'manga-detail.html', 'tag.html',
  'author.html', 'dieu-khoan-su-dung.html', 'top-list.html', 'tieu-chuan-danh-gia.html',
]);

function listHtmlFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .filter((f) => !SYSTEM_EXACT.has(f))
    .filter((f) => statSync(join(dir, f)).isFile());
}

function stripTags(html) {
  return html
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function analyze(file) {
  const html = readFileSync(file, 'utf8');
  const bodyMatch = html.match(/<article class="art-body">([\s\S]*?)<\/article>/);
  if (!bodyMatch) return null;
  const inner = bodyMatch[1];
  const text = stripTags(inner);
  const words = text.length ? text.split(' ').filter(Boolean).length : 0;
  const h2Count = (inner.match(/<h2[ >]/g) || []).length;
  const pCount = (inner.match(/<p[ >]/g) || []).length;
  const liCount = (inner.match(/<li[ >]/g) || []).length;
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/\s*·\s*OtaHub\s*$/, '') : file;
  return { file, title, words, h2Count, pCount, liCount };
}

const files = listHtmlFiles(ROOT);
const results = [];
for (const f of files) {
  const r = analyze(join(ROOT, f));
  if (r) results.push(r);
}
results.sort((a, b) => a.words - b.words);

console.log(`Total articles scanned: ${results.length}`);
console.log('');
for (const r of results) {
  console.log(`${r.words}\t${r.h2Count}h2\t${r.pCount}p\t${r.liCount}li\t${r.file}\t${r.title}`);
}
