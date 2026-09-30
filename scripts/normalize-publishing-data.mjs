import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = [
  ...fs.readdirSync(root).filter((name) => name.endsWith('.html')),
  ...fs.readdirSync(path.join(root, 'en')).filter((name) => name.endsWith('.html')).map((name) => `en/${name}`),
];

const truncate = (value, max = 160) => {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  const cut = slice.lastIndexOf(' ');
  return slice.slice(0, cut > max - 24 ? cut : max - 1).trimEnd() + '…';
};

for (const rel of htmlFiles) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Username là khóa tài khoản; tên xuất bản phải là tên hiển thị của tác giả.
  html = html
    .replace(/(<meta\s+name=["']author["']\s+content=["'])anhthu(["'])/gi, '$1Anh Thu$2')
    .replace(/(<meta\s+property=["']article:author["']\s+content=["'])anhthu(["'])/gi, '$1Anh Thu$2')
    .replace(/("name"\s*:\s*")anhthu("\s*,?)/gi, '$1Anh Thu$2')
    .replace(/(<span class=["']am-badge["']>)anhthu(<\/span>)/gi, '$1Anh Thu$2')
    .replace(/(<span class=["']ac-author["']>)anhthu(<\/span>)/gi, '$1Anh Thu$2')
    .replace(/(<div class=["']wc-m["']>)anhthu(\s*·)/gi, '$1Anh Thu$2');

  // Anna là một tác giả riêng; giữ đúng tên và liên kết hồ sơ ổn định.
  if (rel === 'facing-the-rain-game-rpg-indie-cot-truyen-sau-lang-mien-phi-.html') {
    html = html
      .replaceAll('content="OtaHub Editorial"', 'content="Anna"')
      .replace(/"@type"\s*:\s*"Organization",\s*\n\s*"name"\s*:\s*"OtaHub Editorial"/, '"@type": "Person",\n    "name": "Anna"')
      .replace('href="/author/otahub"><span class="am-badge">OtaHub Editorial</span>', 'href="/author/anna"><span class="am-badge">Anna</span>')
      .replaceAll('https://otahub.asia/bai-viet-moi-munhpmke', 'https://otahub.asia/facing-the-rain-game-rpg-indie-cot-truyen-sau-lang-mien-phi-');
  }

  // Giữ description trong ngưỡng hiển thị tìm kiếm, đồng bộ OG và Twitter.
  const desc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)?.[1];
  if (desc && desc.length > 160) {
    const short = truncate(desc);
    html = html
      .replace(/(<meta\s+name=["']description["']\s+content=["'])[^"']*(["'])/i, `$1${short}$2`)
      .replace(/(<meta\s+property=["']og:description["']\s+content=["'])[^"']*(["'])/i, `$1${short}$2`)
      .replace(/(<meta\s+name=["']twitter:description["']\s+content=["'])[^"']*(["'])/i, `$1${short}$2`);
  }

  if (html !== before) fs.writeFileSync(file, html);
}

// Bài được đổi slug sau khi soạn phải dùng URL xuất bản ở mọi tín hiệu canonical.
const witcher = path.join(root, '7-game-the-witcher-dang-choi-trong-nam-2026.html');
let witcherHtml = fs.readFileSync(witcher, 'utf8');
witcherHtml = witcherHtml.replaceAll(
  'https://otahub.asia/bai-viet-moi-munqgb9s',
  'https://otahub.asia/7-game-the-witcher-dang-choi-trong-nam-2026',
);
fs.writeFileSync(witcher, witcherHtml);

// Tin ticker chỉ được trỏ tới bài thực sự tồn tại; bỏ tin chưa có trang chi tiết.
const indexPath = path.join(root, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml
  .replace(/<span class="tick-item">🔥 <strong>ANIME:<\/strong> <a href="\/anime"[^>]*>Dragon Ball Super: Beerus Lên Sóng Ngày 11\/10 Trên Fuji TV<\/a><\/span>/, '<span class="tick-item">🔥 <strong>ANIME:</strong> <a href="/dragon-ball-super-beerus-dragon-ball-super-tro-lai-voi-phien" style="color:inherit;text-decoration:none">Dragon Ball Super: Beerus Lên Sóng Ngày 11/10 Trên Fuji TV</a></span>')
  .replace(/<span class="tick-item">🔴 <strong>BREAKING · ANIME:<\/strong> <a href="\/anime"[^>]*>JoJo Steel Ball Run Stage 2–3 Lên Sóng Ngày 25\/9<\/a><\/span>/, '<span class="tick-item">🔴 <strong>BREAKING · ANIME:</strong> <a href="/jojo-steel-ball-run-stage-2-3-len-song-25-9" style="color:inherit;text-decoration:none">JoJo Steel Ball Run Stage 2–3 Lên Sóng Ngày 25/9</a></span>')
  .replace(/^\s*<span class="tick-item">[^\n]*(?:Youjo Senki II|Fire Emblem: Fortune&apos;s Weave|Cyberpunk: Edgerunners 2|Control Resonant|Grand Blue Dreaming)[^\n]*<\/span>\s*$/gm, '');

const counts = { Gaming: 0, Anime: 0, Manga: 0, Reviews: 0 };
for (const rel of htmlFiles.filter((file) => !file.startsWith('en/'))) {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  if (!/<meta\s+property=["']og:type["']\s+content=["']article["']/i.test(html)) continue;
  const section = html.match(/<meta\s+property=["']article:section["']\s+content=["']([^"']+)/i)?.[1] || '';
  const title = html.match(/<title>([^<]+)/i)?.[1] || '';
  if (/review|đánh giá/i.test(section + ' ' + title)) counts.Reviews++;
  if (/anime/i.test(section)) counts.Anime++;
  else if (/manga|manhwa/i.test(section)) counts.Manga++;
  else counts.Gaming++;
}
for (const [name, count] of Object.entries(counts)) {
  const className = name === 'Reviews' ? 'review' : name.toLowerCase();
  const re = new RegExp(`(<a href="/${name.toLowerCase()}" class="cat-b cb-${className}"[\\s\\S]*?<div class="cat-ct">)[^<]+(</div>)`, 'i');
  indexHtml = indexHtml.replace(re, `$1${count} bài viết$2`);
}
fs.writeFileSync(indexPath, indexHtml);

console.log(JSON.stringify({ normalizedFiles: htmlFiles.length, categoryCounts: counts }, null, 2));
