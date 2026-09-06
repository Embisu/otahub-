import fs from 'fs';

// Fix 5 long descriptions
const longFiles = [
  { file: 'en/resident-evil-9-announcement.html', desc: 'Capcom officially unveils Resident Evil 9 with state-of-the-art RE Engine visuals, setting a new horror milestone on PC and PS5.' },
  { file: 'en/rezero-10th-anniversary-visual.html', desc: 'Re:ZERO celebrates its 10th anniversary with exclusive new key visuals and a Tokyo special art exhibition announcement.' },
  { file: 'en/yen-press-champignon-witch-licenses.html', desc: 'Yen Press announces licensing of The Champignon Witch alongside exciting new fantasy manga and light novel acquisitions.' },
  { file: 'frieren-phap-su-tien-tang-mua-2-trailer-aureole.html', desc: 'Madhouse và TOHO tung trailer Frieren Mùa 2, mở màn hành trình vượt Cao Nguyên Phía Bắc tiến vào vùng đất linh hồn Aureole.' },
  { file: 'studio-cabana-anime-2027.html', desc: 'Bộ manga lãng mạn âm nhạc Studio Cabana chính thức công bố dự án chuyển thể anime truyền hình, dự kiến lên sóng năm 2027.' }
];

for (const item of longFiles) {
  if (fs.existsSync(item.file)) {
    let content = fs.readFileSync(item.file, 'utf8');
    content = content.replace(/<meta\b[^>]*\bname=["']description["'][^>]*>/i, `<meta name="description" content="${item.desc}">`);
    fs.writeFileSync(item.file, content, 'utf8');
    console.log(`Fixed description in ${item.file}`);
  }
}

// Fix 3 EN utility pages hreflang
const utilEn = ['en/contact.html', 'en/privacy.html', 'en/terms.html'];
for (const u of utilEn) {
  if (fs.existsSync(u)) {
    let content = fs.readFileSync(u, 'utf8');
    const slug = u.replace('en/', '').replace('.html', '');
    content = content.replace(/<link[^>]*hreflang=[^>]*>\s*/gi, '');
    content = content.replace(/<link[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
    const links = `<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${slug}">\n<link rel="canonical" href="https://otahub.asia/en/${slug}">`;
    content = content.replace('</head>', `${links}\n</head>`);
    fs.writeFileSync(u, content, 'utf8');
    console.log(`Fixed hreflang in ${u}`);
  }
}
