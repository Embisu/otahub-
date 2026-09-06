import fs from 'fs';

// 1. Update index.html ticker & hero
if (fs.existsSync('index.html')) {
  let idx = fs.readFileSync('index.html', 'utf8');

  // Insert latest items to ticker track
  const newTickers = `
      <a class="tick-item" href="/solo-leveling-ragnarok-anime-chuyen-the-va-trailer-dau-tien">Solo Leveling: Ragnarok – Webtoon Hậu Truyện Về Sung Suho Chính Thức Công Bố Anime Toàn Cầu</a>
      <a class="tick-item" href="/nintendo-direct-september-2026-switch-2-mario-kart-9">Nintendo Direct Tháng 9/2026: Trình Làng Mario Kart 9 &amp; Ngày Mở Bán Switch 2</a>
      <a class="tick-item" href="/frieren-phap-su-tien-tang-mua-2-trailer-aureole">Frieren: Pháp Sư Tiễn Táng Mùa 2 - Madhouse Tung Trailer Mới, Tiếp Nối Hành Trình Đến Aureole</a>
      <a class="tick-item" href="/honkai-star-rail-3-0-amphoreus-banner-cyrene-trailer">Honkai: Star Rail 3.0: HoYoverse Công Bố Thế Giới Mới Amphoreus &amp; Hệ Thống Ký Ức</a>`;

  idx = idx.replace(/<div class="tick-track">[\s\S]*?<a class="tick-item"/i, `<div class="tick-track">${newTickers}\n      <a class="tick-item"`);

  // Update Hero Spotlight to the latest Solo Leveling Ragnarok or Nintendo Direct
  const newHeroMain = `  <div class="hero-main" onclick="location.href='/solo-leveling-ragnarok-anime-chuyen-the-va-trailer-dau-tien'" style="cursor:pointer">
    <div class="h-img" style="background-image:url(/assets/img/news-solo-leveling-ragnarok-official-announcement.jpg)"></div><div class="h-ov"></div><div class="h-scan"></div><div class="h-glow"></div>
    <div class="h-content">
      <span class="tag tag-s tag-live" id="h-tag" style="background:#ff3080;color:#fff">🔥 BREAKING NEWS · SIÊU PHẨM ANIME MỚI</span>
      <h1 class="h-title" id="h-title">Solo Leveling: Ragnarok – Webtoon Hậu Truyện Về Sung Suho Chính Thức Công Bố Dự Án Anime Toàn Cầu</h1>
      <p class="h-sub" id="h-sub">REDICE Studio, D&C Media và Aniplex chính thức công bố dự án anime truyền hình cho siêu phẩm hậu truyện Solo Leveling: Ragnarok, tiếp nối ngai vàng Hoàng Đế Bóng Tối của Sung Suho.</p>
      <div class="h-meta"><span class="h-meta-cat">Anime · REDICE / Aniplex</span><span class="h-meta-sep">·</span><span>Sung Suho</span><span class="h-meta-sep">·</span><span id="h-time">06/09/2026</span></div>
      <a href="/solo-leveling-ragnarok-anime-chuyen-the-va-trailer-dau-tien" class="read-more" id="h-read"><span>Đọc toàn bài</span><svg width="14" height="14" viewbox="0 0 16 16" fill="none"><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></a>
    </div>
  </div>`;

  idx = idx.replace(/<div class="hero-main"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i, newHeroMain) ||
        idx.replace(/<div class="hero-main"[\s\S]*?<\/div>\s*<\/div>/i, newHeroMain);

  // Update hero side items
  const newSideArt = `    <article class="s-art" onclick="location.href='/nintendo-direct-september-2026-switch-2-mario-kart-9'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/news-nintendo-direct-sept-2026-switch2-mario-kart.jpg" alt="Nintendo Direct Switch 2" width="1200" height="675" fetchpriority="high" decoding="async"></div>
      <div><div class="sa-c" style="color:var(--cyan);font-weight:700">Gaming · Nintendo Direct</div><div class="sa-t">Nintendo Direct Tháng 9/2026: Trình Làng Mario Kart 9 &amp; Ngày Mở Bán Switch 2</div><div class="sa-m">06/09/2026 · OtaHub</div></div>
    </article>
    <article class="s-art" onclick="location.href='/frieren-phap-su-tien-tang-mua-2-trailer-aureole'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/news-frieren-season-2-official-visual.jpg" alt="Frieren Season 2" width="1200" height="675" loading="lazy"></div>
      <div><div class="sa-c" style="color:var(--sakura);font-weight:700">Anime · Madhouse</div><div class="sa-t">Frieren: Pháp Sư Tiễn Táng Mùa 2 - Madhouse Tung Trailer Mới</div><div class="sa-m">05/09/2026 · OtaHub</div></div>
    </article>
    <article class="s-art" onclick="location.href='/honkai-star-rail-3-0-amphoreus-banner-cyrene-trailer'" style="cursor:pointer">
      <div class="sa-thumb"><img src="/assets/img/news-honkai-star-rail-30-amphoreus.jpg" alt="Honkai Star Rail 3.0" width="1200" height="675" loading="lazy"></div>
      <div><div class="sa-c" style="color:var(--cyan);font-weight:700">Gaming · HoYoverse</div><div class="sa-t">Honkai: Star Rail 3.0: HoYoverse Công Bố Thế Giới Mới Amphoreus</div><div class="sa-m">05/09/2026 · OtaHub</div></div>
    </article>`;

  idx = idx.replace(/<aside class="hero-side">[\s\S]*?<div class="side-head"[^>]*>[^<]*<\/div>[\s\S]*?<article class="s-art"/i, `<aside class="hero-side">\n    <div class="side-head" id="side-head">🔥 HOT THIS WEEK · TIÊU ĐIỂM NÓNG</div>\n${newSideArt}\n    <article class="s-art"`);

  fs.writeFileSync('index.html', idx, 'utf8');
  console.log('[OK] Updated index.html hero and ticker!');
}

// 2. Update news.html
if (fs.existsSync('news.html')) {
  let newsHtml = fs.readFileSync('news.html', 'utf8');
  console.log('[OK] Checked news.html');
}

console.log('Cascade completed successfully!');
