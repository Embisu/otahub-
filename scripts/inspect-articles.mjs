import fs from 'node:fs';

const EXCLUDED = new Set([
  'admin.html', 'news-pipeline.html', 'index.html', 'anime.html', 'gaming.html',
  'manga.html', 'news.html', 'rankings.html', 'reviews.html', 'sap-ra-mat.html',
  'about.html', 'tag.html', 'privacy.html', 'terms.html', 'contact.html',
  '404.html', 'anime-detail.html', 'article.html', 'bai-viet.html',
  'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html',
  'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html',
  'recommend.html', 'in-depth.html'
]);

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !EXCLUDED.has(f));

const articles = files.map((f, i) => {
  const c = fs.readFileSync(f, 'utf8');
  const tMatch = c.match(/<title>([^<]*)<\/title>/i);
  const t = tMatch ? tMatch[1].replace(/\s*[·•|-]\s*OtaHub.*$/i, '').trim() : f;
  const dMatch = c.match(/article:published_time["']\s+content=["']([^"']*)["']/i);
  const d = dMatch ? dMatch[1] : '';
  const bodyMatch = c.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : '';
  const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(/\s+/).length : 0;
  const h2Count = (bodyHtml.match(/<h2\b[^>]*>/gi) || []).length;
  const pCount = (bodyHtml.match(/<p\b[^>]*>/gi) || []).length;
  const imgCount = (bodyHtml.match(/<img\b[^>]*>/gi) || []).length;
  return { f, words, t, d, h2Count, pCount, imgCount, text };
});

articles.sort((a,b) => a.words - b.words);

console.log(`TOTAL ARTICLES SCANNED: ${articles.length}`);
console.log(`\n=== 30 BÀI NGẮN NHẤT (< 200 từ) ===`);
articles.slice(0, 30).forEach((a, i) => {
  console.log(`${i+1}. [${a.words} từ, ${a.h2Count} H2, ${a.pCount} P, ${a.imgCount} img] ${a.f}`);
  console.log(`   Tiêu đề: ${a.t}`);
});

console.log(`\n=== PHÂN BỐ ĐỘ DÀI ===`);
console.log(`< 200 từ: ${articles.filter(a => a.words < 200).length} bài`);
console.log(`200 - 350 từ: ${articles.filter(a => a.words >= 200 && a.words < 350).length} bài`);
console.log(`350 - 600 từ: ${articles.filter(a => a.words >= 350 && a.words < 600).length} bài`);
console.log(`600 - 1000 từ: ${articles.filter(a => a.words >= 600 && a.words < 1000).length} bài`);
console.log(`> 1000 từ: ${articles.filter(a => a.words >= 1000).length} bài`);
