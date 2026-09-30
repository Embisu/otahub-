import fs from 'fs';

const pages = ['index.html', 'gaming.html', 'anime.html', 'manga.html', 'news.html', 'en/index.html'];

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const links = [...content.matchAll(/href="\/([a-zA-Z0-9_-]+)"/g)].map(m => m[1]);
  const dead = [];
  const counts = {};
  for (const slug of links) {
    if (['gaming', 'anime', 'manga', 'news', 'reviews', 'rankings', 'choi-gi', 'sap-ra-mat', 'about', 'lien-he', 'chinh-sach-bao-mat', 'dieu-khoan-su-dung', 'tieu-chuan-danh-gia', 'chuyen-sau', 'tim-kiem', 'en', 'feed.xml'].includes(slug)) continue;
    counts[slug] = (counts[slug] || 0) + 1;
    const file = slug + '.html';
    if (!fs.existsSync(file)) {
      dead.push(slug);
    }
  }
  console.log(`\n=== ${p} ===`);
  const duplicates = Object.entries(counts).filter(([slug, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log('Duplicates in page:');
    for (const [slug, count] of duplicates) {
      console.log(`  /${slug} (${count} times)`);
    }
  }
  if (dead.length > 0) {
    console.log('Dead links (file does not exist on disk):', Array.from(new Set(dead)));
  } else {
    console.log('No dead links found on disk.');
  }
}
