import fs from 'fs';

function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !['index.html', 'anime.html', 'manga.html', 'gaming.html', 'news.html', 'reviews.html', 'community.html', 'tag.html', '404.html'].includes(f));
  let count = 0;
  const list = [];
  for (const f of files) {
    const full = dir + '/' + f;
    const content = fs.readFileSync(full, 'utf8');
    const m = content.match(/<article[^>]*class=["'][^"']*art-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
    const text = m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 180) {
      count++;
      list.push({ file: full, words });
    }
  }
  console.log(`Total in ${dir}: ${files.length} articles, Short (<180 words): ${count}`);
  list.sort((a,b) => a.words - b.words).forEach(item => {
    console.log(`  ${item.words} words -> ${item.file}`);
  });
}

checkDir('.');
checkDir('en');
