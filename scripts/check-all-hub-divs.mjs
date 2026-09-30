import fs from 'fs';

const hubPages = [
  'index.html', 'choi-gi.html', 'gaming.html', 'anime.html', 'manga.html', 
  'reviews.html', 'rankings.html', 'chuyen-sau.html', 'news.html', 'about.html',
  'game-detail.html', 'anime-detail.html', 'manga-detail.html',
  'en/index.html', 'en/gaming.html', 'en/anime.html', 'en/manga.html',
  'en/reviews.html', 'en/rankings.html', 'en/in-depth.html', 'en/news.html', 'en/about.html'
];

for (const filePath of hubPages) {
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const regex = /<\/?div(\s[^>]*)?>/gi;
  const stack = [];
  let extraClosing = 0;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const isClosing = match[0].startsWith('</');
    const lineNum = html.substring(0, match.index).split('\n').length;
    if (!isClosing) {
      stack.push({ line: lineNum, tag: match[0] });
    } else {
      if (stack.length === 0) {
        extraClosing++;
      } else {
        stack.pop();
      }
    }
  }

  if (stack.length > 0 || extraClosing > 0) {
    console.log(`[${filePath}] MISMATCH: unclosed=${stack.length}, extraClosing=${extraClosing}`);
    stack.forEach(s => console.log(`   Unclosed at line ${s.line}: ${s.tag.substring(0, 60)}`));
  } else {
    console.log(`[${filePath}] OK`);
  }
}
