import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Danh sách các bài mới nhất của ngày hôm nay (29/09/2026)
const todayArticles = [
  {
    slug: 'star-wars-zero-company-biet-doi-di-biet-tao-nen-nhung-tran-c',
    title: 'Star Wars: Zero Company: Biệt đội dị biệt tạo nên những trận chiến đầy bất ngờ',
    cat: 'Gaming',
    hero: '/assets/img/uploads/22ksi3pb-photo-2026-09-29-15-25-58.jpg',
    date: '29/09/2026',
    time: '4 min'
  },
  {
    slug: 'uk-games-expo-cam-noi-dung-ai-chi-chua-mot-so-truong-hop-ngo',
    title: 'UK Games Expo cấm nội dung AI, chỉ chừa một số trường hợp ngoại lệ',
    cat: 'Gaming',
    hero: '/assets/img/uploads/vz6citou-photo-2026-09-29-14-59-50.jpg',
    date: '29/09/2026',
    time: '4 min'
  },
  {
    slug: 'nintendo-gamecube-chiec-may-mau-tim-nho-be-nhung-de-lai-dau-',
    title: 'Nintendo GameCube: Chiếc máy màu tím nhỏ bé nhưng để lại dấu ấn lớn',
    cat: 'Gaming',
    hero: '/assets/img/uploads/xadyqbp9-new.avif',
    date: '29/09/2026',
    time: '5 min'
  },
  {
    slug: 'duoc-su-tu-su-mua-3-maomao-buoc-vao-hanh-trinh-pha-an-moi-na',
    title: 'Dược Sư Tự Sự mùa 3: Maomao bước vào hành trình phá án mới năm 2027',
    cat: 'Anime',
    hero: '/assets/img/uploads/ikwqphfh-maomao-and-jinshi-in-the-apothecary-diaries-season-2-with-a-.webp',
    date: '29/09/2026',
    time: '3 min'
  },
  {
    slug: 'vi-sao-nen-xem-laputa-lau-dai-tren-khong-tren-man-anh-lon',
    title: 'Vì sao nên xem Laputa: Lâu đài trên không trên màn ảnh lớn?',
    cat: 'Anime',
    hero: '/assets/img/uploads/bmnjzftx-1788505364131-c2-1788504847736952838044-0-0-1005-1920-crop-1.webp',
    date: '29/09/2026',
    time: '4 min'
  },
  {
    slug: 'we-are-aliens-phim-hoat-hinh-phap-nhat-ra-rap-ngay-25-9',
    title: 'We Are Aliens: Phim hoạt hình Pháp – Nhật ra rạp ngày 25/9',
    cat: 'Anime',
    hero: '/assets/img/uploads/7vs6cl91-we-are-aliens-main-trailer.jpg',
    date: '29/09/2026',
    time: '3 min'
  }
];

console.log('1. Updating hero-side (Hot This Week)...');
const heroSideArticlesHtml = `
    <div class="side-head" id="side-head">🔥 HOT THIS WEEK · TIÊU ĐIỂM NÓNG</div>
    <article class="s-art" onclick="location.href='/star-wars-zero-company-biet-doi-di-biet-tao-nen-nhung-tran-c'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/uploads/22ksi3pb-photo-2026-09-29-15-25-58.jpg" alt="Star Wars: Zero Company: Biệt đội dị biệt tạo nên những trận chiến đầy bất ngờ" width="1200" height="675" loading="lazy" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--pink);font-weight:700">🔴 Breaking · Gaming</div><div class="sa-t">Star Wars: Zero Company: Biệt đội dị biệt tạo nên những trận chiến đầy bất ngờ</div><div class="sa-m">29/09/2026 · OtaHub Editorial</div></div>
    </article>
    <article class="s-art" onclick="location.href='/nintendo-gamecube-chiec-may-mau-tim-nho-be-nhung-de-lai-dau-'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/uploads/xadyqbp9-new.avif" alt="Nintendo GameCube: Chiếc máy màu tím nhỏ bé nhưng để lại dấu ấn lớn" width="1200" height="675" loading="lazy" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--pink);font-weight:700">🔴 Breaking · Gaming</div><div class="sa-t">Nintendo GameCube: Chiếc máy màu tím nhỏ bé nhưng để lại dấu ấn lớn</div><div class="sa-m">29/09/2026 · OtaHub Editorial</div></div>
    </article>
    <article class="s-art" onclick="location.href='/duoc-su-tu-su-mua-3-maomao-buoc-vao-hanh-trinh-pha-an-moi-na'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/uploads/ikwqphfh-maomao-and-jinshi-in-the-apothecary-diaries-season-2-with-a-.webp" alt="Dược Sư Tự Sự mùa 3: Maomao bước vào hành trình phá án mới năm 2027" width="1200" height="675" loading="lazy" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--pink);font-weight:700">🔴 Breaking · Anime</div><div class="sa-t">Dược Sư Tự Sự mùa 3: Maomao bước vào hành trình phá án mới năm 2027</div><div class="sa-m">29/09/2026 · OtaHub Editorial</div></div>
    </article>
    <article class="s-art" onclick="location.href='/uk-games-expo-cam-noi-dung-ai-chi-chua-mot-so-truong-hop-ngo'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/uploads/vz6citou-photo-2026-09-29-14-59-50.jpg" alt="UK Games Expo cấm nội dung AI, chỉ chừa một số trường hợp ngoại lệ" width="1200" height="675" loading="lazy" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--pink);font-weight:700">🔴 Breaking · Gaming</div><div class="sa-t">UK Games Expo cấm nội dung AI, chỉ chừa một số trường hợp ngoại lệ</div><div class="sa-m">29/09/2026 · OtaHub Editorial</div></div>
    </article>
    <article class="s-art" onclick="location.href='/vi-sao-nen-xem-laputa-lau-dai-tren-khong-tren-man-anh-lon'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/uploads/bmnjzftx-1788505364131-c2-1788504847736952838044-0-0-1005-1920-crop-1.webp" alt="Vì sao nên xem Laputa: Lâu đài trên không trên màn ảnh lớn?" width="1200" height="675" loading="lazy" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--pink);font-weight:700">🔴 Breaking · Anime</div><div class="sa-t">Vì sao nên xem Laputa: Lâu đài trên không trên màn ảnh lớn?</div><div class="sa-m">29/09/2026 · OtaHub Editorial</div></div>
    </article>
    <article class="s-art" onclick="location.href='/we-are-aliens-phim-hoat-hinh-phap-nhat-ra-rap-ngay-25-9'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/uploads/7vs6cl91-we-are-aliens-main-trailer.jpg" alt="We Are Aliens: Phim hoạt hình Pháp – Nhật ra rạp ngày 25/9" width="1200" height="675" loading="lazy" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--pink);font-weight:700">🔴 Breaking · Anime</div><div class="sa-t">We Are Aliens: Phim hoạt hình Pháp – Nhật ra rạp ngày 25/9</div><div class="sa-m">29/09/2026 · OtaHub Editorial</div></div>
    </article>`;

html = html.replace(/(<aside class="hero-side">)[\s\S]*?(<\/aside>)/, `$1${heroSideArticlesHtml}\n  $2`);

console.log('2. Updating latest-wrap (Tin mới nhất)...');
// Clean up any existing duplicate cards in latest-wrap first
const latestAnchor = '<div class="latest-wrap">\n<div>\n';
const pos = html.lastIndexOf(latestAnchor);
if (pos !== -1) {
  const insertPos = pos + latestAnchor.length;
  // Build new cards for todayArticles
  let newCardsHtml = '';
  for (const a of todayArticles) {
    newCardsHtml += `<article class="w-card"><a href="/${a.slug}" style="text-decoration:none;display:contents"><div class="wc-info"><div class="wc-c" style="color:var(--cyan)">${a.cat}</div><div class="wc-t">${a.title}</div><div class="wc-m">OtaHub Editorial · ${a.date} · ${a.time}</div></div><div class="wc-thumb"><img src="${a.hero}" alt="${a.title}" loading="lazy" width="1200" height="675"></div></a></article>\n      `;
  }
  
  // Strip out old copies of these 6 articles from the rest of latest-wrap
  const asidePos = html.indexOf('<aside class="latest-side">', insertPos);
  let listBlock = html.slice(insertPos, asidePos);
  for (const a of todayArticles) {
    const cardRe = new RegExp(`<article class="w-card"><a href="/${a.slug}"[\\s\\S]*?<\\/article>\\s*`, 'g');
    listBlock = listBlock.replace(cardRe, '');
  }

  html = html.slice(0, insertPos) + newCardsHtml + listBlock + html.slice(asidePos);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html updated successfully with all 6 today articles in Hero Side AND Latest Wrap!');
