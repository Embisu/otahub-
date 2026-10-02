import fs from 'fs';

// 1. Sync en/gaming.html
let enGaming = fs.readFileSync('en/gaming.html', 'utf8');
const enGamingCards = `<!-- ADMIN:ARTICLES_START -->
      <a href="/en/roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare" class="ac" data-cat="all">
        <div class="ac-thumb"><img height="675" width="1200" src="/assets/img/uploads/m4495rif-capsule-616x353.jpg" alt="Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare" loading="lazy"><span class="tag">Gaming</span></div>
        <div class="ac-body">
          <h3 class="ac-title">Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare</h3>
          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">Just now</span></div>
        </div>
      </a>

      <a href="/en/when-gta-becomes-a-stage-for-shakespeare-in-grand-theft-hamlet" class="ac" data-cat="all">
        <div class="ac-thumb"><img height="675" width="1200" src="/assets/img/uploads/7u1kbpqr-1790578085901-2205952226142822073-7120438264129171444-646dfc.jpg" alt="When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet" loading="lazy"><span class="tag">Gaming</span></div>
        <div class="ac-body">
          <h3 class="ac-title">When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet</h3>
          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">Just now</span></div>
        </div>
      </a>
`;

if (!enGaming.includes('/en/roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare')) {
  enGaming = enGaming.replace('<!-- ADMIN:ARTICLES_START -->', enGamingCards);
  fs.writeFileSync('en/gaming.html', enGaming, 'utf8');
  console.log('Updated en/gaming.html');
}

// 2. Sync en/anime.html
let enAnime = fs.readFileSync('en/anime.html', 'utf8');
const enAnimeCard = `<!-- ADMIN:ARTICLES_START -->
      <a href="/en/detective-conan-case-30-murder-30th-anniversary-special" class="ac" data-cat="action movie news">
        <div class="ac-thumb"><img height="675" width="1200" src="/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg" alt="Detective Conan 30: 30th Anniversary Special Airs With Gosho Aoyama's Return" loading="lazy"><span class="tag">Anime</span></div>
        <div class="ac-body">
          <h3 class="ac-title">Detective Conan 30: 30th Anniversary Special Airs With Gosho Aoyama's Return</h3>
          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">Just now</span></div>
        </div>
      </a>
`;

if (!enAnime.includes('/en/detective-conan-case-30-murder-30th-anniversary-special')) {
  enAnime = enAnime.replace('<!-- ADMIN:ARTICLES_START -->', enAnimeCard);
  fs.writeFileSync('en/anime.html', enAnime, 'utf8');
  console.log('Updated en/anime.html');
}

// 3. Sync en/manga.html
let enManga = fs.readFileSync('en/manga.html', 'utf8');
const enMangaCard = `<!-- ADMIN:ARTICLES_START -->
      <a href="/en/one-piece-1194-spoiler-zoro-unleashes-new-power-mihawk-flashback" class="ac" data-cat="all">
        <div class="ac-thumb"><img height="675" width="1200" src="/assets/img/real-op1194-dexerto.jpg" alt="One Piece 1194 Spoiler: Zoro Unleashes New Power, Mihawk Flashback Explained" loading="lazy"><span class="tag">Manga</span></div>
        <div class="ac-body">
          <h3 class="ac-title">One Piece 1194 Spoiler: Zoro Unleashes New Power, Mihawk Flashback Explained</h3>
          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">Just now</span></div>
        </div>
      </a>
`;

if (!enManga.includes('/en/one-piece-1194-spoiler-zoro-unleashes-new-power-mihawk-flashback')) {
  enManga = enManga.replace('<!-- ADMIN:ARTICLES_START -->', enMangaCard);
  fs.writeFileSync('en/manga.html', enManga, 'utf8');
  console.log('Updated en/manga.html');
}

// 4. Sync en/index.html ticker
let enIndex = fs.readFileSync('en/index.html', 'utf8');
const enIndexTicker = `<div class="tick-track">
      <span class="tick-item">🔥 <strong>Gaming:</strong> <a href="/en/roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare" style="color:inherit;text-decoration:none">Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare</a></span>
      <span class="tick-item">🔴 <strong>BREAKING · Gaming:</strong> <a href="/en/when-gta-becomes-a-stage-for-shakespeare-in-grand-theft-hamlet" style="color:inherit;text-decoration:none">When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet</a></span>
      <span class="tick-item">🔥 <strong>Anime:</strong> <a href="/en/detective-conan-case-30-murder-30th-anniversary-special" style="color:inherit;text-decoration:none">Detective Conan 30: 30th Anniversary Special Airs With Gosho Aoyama's Return</a></span>
      <span class="tick-item">🔥 <strong>Manga:</strong> <a href="/en/one-piece-1194-spoiler-zoro-unleashes-new-power-mihawk-flashback" style="color:inherit;text-decoration:none">One Piece 1194 Spoiler: Zoro Unleashes New Power, Mihawk Flashback Explained</a></span>`;

if (!enIndex.includes('/en/roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare')) {
  enIndex = enIndex.replace('<div class="tick-track">', enIndexTicker);
  fs.writeFileSync('en/index.html', enIndex, 'utf8');
  console.log('Updated en/index.html ticker');
}

// 5. Sync en/news.html
let enNews = fs.readFileSync('en/news.html', 'utf8');
const enNewsCards = `<a href="/en/roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">
      <div style="position:relative;width:100%;height:180px;background:#0d061a;overflow:hidden">
        <img src="/assets/img/uploads/m4495rif-capsule-616x353.jpg" alt="Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy">
        <span style="position:absolute;top:10px;left:10px;background:rgba(11,4,24,0.85);backdrop-filter:blur(6px);border:1px solid rgba(0,229,255,0.3);color:#00e5ff;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase">GAMING</span>
      </div>
      <div style="padding:16px;">
        <h3 style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#f0eeff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare</h3>
        <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:rgba(240,238,255,0.65);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">Arbitrary Metric brings back the apocalyptic dread of Paratopic in Roman Sands RE:Build — an uncanny psychological horror adventure in a luxury beach resort before doomsday.</p>
        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">
          <span>⚡ OtaHub News</span>
          <span>Just now</span>
        </div>
      </div>
    </a>

    <a href="/en/when-gta-becomes-a-stage-for-shakespeare-in-grand-theft-hamlet" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">
      <div style="position:relative;width:100%;height:180px;background:#0d061a;overflow:hidden">
        <img src="/assets/img/uploads/7u1kbpqr-1790578085901-2205952226142822073-7120438264129171444-646dfc.jpg" alt="When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy">
        <span style="position:absolute;top:10px;left:10px;background:rgba(11,4,24,0.85);backdrop-filter:blur(6px);border:1px solid rgba(0,229,255,0.3);color:#00e5ff;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase">GAMING</span>
      </div>
      <div style="padding:16px;">
        <h3 style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#f0eeff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet</h3>
        <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:rgba(240,238,255,0.65);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">Grand Theft Hamlet turns Los Santos into an open-world Shakespearean stage — a hilarious and poignant documentary about loneliness and artistic survival.</p>
        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">
          <span>⚡ OtaHub News</span>
          <span>Just now</span>
        </div>
      </div>
    </a>

    <a href="/en/detective-conan-case-30-murder-30th-anniversary-special" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">
      <div style="position:relative;width:100%;height:180px;background:#0d061a;overflow:hidden">
        <img src="/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg" alt="Detective Conan 30: 30th Anniversary Special Airs With Gosho Aoyama's Return" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy">
        <span style="position:absolute;top:10px;left:10px;background:rgba(11,4,24,0.85);backdrop-filter:blur(6px);border:1px solid rgba(0,229,255,0.3);color:#00e5ff;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase">ANIME</span>
      </div>
      <div style="padding:16px;">
        <h3 style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#f0eeff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">Detective Conan 30: 30th Anniversary Special Airs With Gosho Aoyama's Return</h3>
        <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:rgba(240,238,255,0.65);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">Detective Conan marks its 30th broadcast anniversary with the special episode Case 30 Murder, featuring an original plot penned by Gosho Aoyama.</p>
        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">
          <span>⚡ OtaHub News</span>
          <span>Just now</span>
        </div>
      </div>
    </a>

    <a href="/en/one-piece-1194-spoiler-zoro-unleashes-new-power-mihawk-flashback" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">
      <div style="position:relative;width:100%;height:180px;background:#0d061a;overflow:hidden">
        <img src="/assets/img/real-op1194-dexerto.jpg" alt="One Piece 1194 Spoiler: Zoro Unleashes New Power, Mihawk Flashback Explained" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy">
        <span style="position:absolute;top:10px;left:10px;background:rgba(11,4,24,0.85);backdrop-filter:blur(6px);border:1px solid rgba(0,229,255,0.3);color:#00e5ff;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase">MANGA</span>
      </div>
      <div style="padding:16px;">
        <h3 style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#f0eeff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">One Piece 1194 Spoiler: Zoro Unleashes New Power, Mihawk Flashback Explained</h3>
        <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:rgba(240,238,255,0.65);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">Comprehensive spoiler breakdown for One Piece Chapter 1194: Zoro unleashes supreme Haoshoku Haki infusion, while a pivotal flashback reveals Mihawk's past.</p>
        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">
          <span>⚡ OtaHub News</span>
          <span>Just now</span>
        </div>
      </div>
    </a>
    `;

const enGridTarget = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px">';
if (!enNews.includes('/en/roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare')) {
  enNews = enNews.replace(enGridTarget, enGridTarget + '\n    ' + enNewsCards);
  fs.writeFileSync('en/news.html', enNews, 'utf8');
  console.log('Updated en/news.html');
}

// 6. Fix lien-he.html and en/contact.html
let lienHe = fs.readFileSync('lien-he.html', 'utf8');
lienHe = lienHe.replace('https://otahub.asia/en/contact', 'https://otahub.asia/en/contact');
fs.writeFileSync('lien-he.html', lienHe, 'utf8');

let contact = fs.readFileSync('en/contact.html', 'utf8');
if (!contact.includes('hreflang="vi"')) {
  contact = contact.replace('<link rel="alternate" hreflang="en" href="https://otahub.asia/en/contact">', 
    '<link rel="alternate" hreflang="vi" href="https://otahub.asia/lien-he">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/contact">\n<link rel="alternate" hreflang="x-default" href="https://otahub.asia/lien-he">');
  fs.writeFileSync('en/contact.html', contact, 'utf8');
}
console.log('Updated lien-he.html and en/contact.html hreflang');

// 7. Fix chinh-sach-bao-mat.html and en/privacy.html
let chinhSach = fs.readFileSync('chinh-sach-bao-mat.html', 'utf8');
chinhSach = chinhSach.replace('https://otahub.asia/en/privacy', 'https://otahub.asia/en/privacy');
fs.writeFileSync('chinh-sach-bao-mat.html', chinhSach, 'utf8');

let privacy = fs.readFileSync('en/privacy.html', 'utf8');
if (!privacy.includes('hreflang="vi"')) {
  privacy = privacy.replace('<link rel="alternate" hreflang="en" href="https://otahub.asia/en/privacy">',
    '<link rel="alternate" hreflang="vi" href="https://otahub.asia/chinh-sach-bao-mat">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/privacy">\n<link rel="alternate" hreflang="x-default" href="https://otahub.asia/chinh-sach-bao-mat">');
  fs.writeFileSync('en/privacy.html', privacy, 'utf8');
}
console.log('Updated chinh-sach-bao-mat.html and en/privacy.html hreflang');

// 8. Create dieu-khoan-su-dung.html and link with en/terms.html
const dieuKhoanContent = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Điều Khoản Sử Dụng · OtaHub</title>
<meta name="description" content="Điều khoản dịch vụ, chính sách biên tập và quy định nội dung của OtaHub — Hub tin tức Gaming, Anime và Manga châu Á.">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="alternate" hreflang="vi" href="https://otahub.asia/dieu-khoan-su-dung">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/terms">
<link rel="alternate" hreflang="x-default" href="https://otahub.asia/dieu-khoan-su-dung">
<link rel="canonical" href="https://otahub.asia/dieu-khoan-su-dung">
<link rel="stylesheet" href="/assets/clamp.v2.css?v=20260926">
<link rel="stylesheet" href="/assets/mobile-fix.css?v=20261002j">
</head>
<body style="background:#0b0418;color:#f0eeff;font-family:sans-serif;padding:40px 24px;max-width:800px;margin:0 auto">
<h1>Điều Khoản Sử Dụng</h1>
<p>Mọi nội dung về Gaming, Anime và Manga xuất bản trên OtaHub đều nhằm mục đích cung cấp thông tin, phân tích và giáo dục.</p>
<p><a href="/about" style="color:#00e5ff">← Về Chúng Tôi</a> | <a href="/" style="color:#00e5ff">Trang Chủ</a></p>
<script defer src="/assets/img-fit.v2.js?v=20261002a"></script>
<script src="/assets/lang-switch.js" defer></script>
</body>
</html>`;
fs.writeFileSync('dieu-khoan-su-dung.html', dieuKhoanContent, 'utf8');

let terms = fs.readFileSync('en/terms.html', 'utf8');
if (!terms.includes('hreflang="vi"')) {
  terms = terms.replace('<link rel="alternate" hreflang="en" href="https://otahub.asia/en/terms">',
    '<link rel="alternate" hreflang="vi" href="https://otahub.asia/dieu-khoan-su-dung">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/terms">\n<link rel="alternate" hreflang="x-default" href="https://otahub.asia/dieu-khoan-su-dung">');
  fs.writeFileSync('en/terms.html', terms, 'utf8');
}
console.log('Created dieu-khoan-su-dung.html and updated en/terms.html');
