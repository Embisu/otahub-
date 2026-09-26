import fs from 'fs';

const excluded = new Set([
  'admin.html', 'news-pipeline.html', 'index.html', 'anime.html', 'gaming.html',
  'manga.html', 'news.html', 'rankings.html', 'reviews.html', 'sap-ra-mat.html',
  'about.html', 'tag.html', 'privacy.html', 'terms.html', 'contact.html',
  '404.html', 'anime-detail.html', 'article.html', 'bai-viet.html',
  'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html',
  'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html', 'recommend.html'
]);

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !excluded.has(f));

const report = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/ · OtaHub.*$/i, '').trim() : f;
  const match = content.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const body = match ? match[1] : '';
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(/\s+/).length : 0;
  const catMatch = content.match(/<meta\s+property="article:section"\s+content="([^"]*)"/i);
  const cat = catMatch ? catMatch[1] : 'Unknown';

  const lower = (title + ' ' + text).toLowerCase();

  const issues = [];
  if (words < 250) {
    issues.push(`Nội dung quá ngắn (${words} từ)`);
  }

  // Known hallucinated terms
  if (lower.includes('chapter 1191') || lower.includes('chapter 1192') || lower.includes('chapter 1193')) {
    issues.push('Hallucination: Chapter One Piece bịa đặt (1191-1193)');
  }
  if (lower.includes('grand blue') && (lower.includes('mùa 4') || lower.includes('mùa 3'))) {
    issues.push('Hallucination: Grand Blue Mùa 3/4 bịa đặt');
  }
  if (lower.includes('control resonant')) {
    issues.push('Hallucination: Game bịa đặt (Control Resonant)');
  }
  if (lower.includes('splatoon raiders')) {
    issues.push('Hallucination: Game bịa đặt (Splatoon Raiders)');
  }
  if (lower.includes('fortune\'s weave')) {
    issues.push('Hallucination: Game bịa đặt (Fire Emblem Fortune\'s Weave)');
  }
  if (lower.includes('rhythm heaven groove')) {
    issues.push('Hallucination: Game bịa đặt (Rhythm Heaven Groove)');
  }
  if (lower.includes('screen burn interactive') || (lower.includes('silent hill: townfall') && lower.includes('simon ordell'))) {
    issues.push('Hallucination: Silent Hill Townfall bịa đặt studio & nhân vật');
  }
  if (lower.includes('nobita\'s steam-powered time machine')) {
    issues.push('Hallucination: Doraemon phim 46 bịa đặt (London)');
  }
  if (lower.includes('cyberpunk: edgerunners 2')) {
    issues.push('Hallucination: Đặt tên sai và bịa ngày chiếu 20/10/2026');
  }

  if (issues.length > 0) {
    report.push({ file: f, title, words, cat, issues });
  }
}

console.log(`Tổng số bài có vấn đề (ngắn hoặc hallucination): ${report.length} / ${files.length}`);
console.log('\n--- CÁC BÀI BỊ HALLUCINATION ---');
const hallus = report.filter(r => r.issues.some(i => i.startsWith('Hallucination')));
hallus.forEach((h, idx) => {
  console.log(`${idx+1}. [${h.words} từ] ${h.file}`);
  console.log(`   Tiêu đề: ${h.title}`);
  console.log(`   Vấn đề: ${h.issues.join(' | ')}\n`);
});

console.log('\n--- TOP 20 BÀI NGẮN NHẤT CẦN NÂNG CẤP CHẤT LƯỢNG ---');
const thins = report.filter(r => !r.issues.some(i => i.startsWith('Hallucination'))).sort((a,b) => a.words - b.words);
thins.slice(0, 20).forEach((t, idx) => {
  console.log(`${idx+1}. [${t.words} từ] (${t.cat}) ${t.file}`);
  console.log(`   Tiêu đề: ${t.title}`);
});
