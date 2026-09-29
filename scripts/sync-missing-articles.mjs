import fs from 'fs';

const esc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escXml = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// Danh sách 5 bài viết theo thứ tự từ mới nhất đến cũ hơn
const articles = [
  {
    slug: 'star-wars-zero-company-biet-doi-di-biet-tao-nen-nhung-tran-c',
    file: 'star-wars-zero-company-biet-doi-di-biet-tao-nen-nhung-tran-c.html',
    title: 'Star Wars: Zero Company: Biệt đội dị biệt tạo nên những trận chiến đầy bất ngờ',
    desc: 'Star Wars: Zero Company đưa vũ trụ Star Wars đến với thể loại chiến thuật theo lượt, kết hợp hệ thống chiến đấu mang màu sắc XCOM với một nhóm nhân vật gồm những chiến binh có xuất thân và tính cách hoàn toàn khác nhau.',
    cat: 'Gaming',
    hero: '/assets/img/uploads/22ksi3pb-photo-2026-09-29-15-25-58.jpg',
    date: '2026-09-29',
    pubDate: 'Tue, 29 Sep 2026 08:19:50 GMT',
    isoDate: '2026-09-29T08:19:50.564Z'
  },
  {
    slug: 'uk-games-expo-cam-noi-dung-ai-chi-chua-mot-so-truong-hop-ngo',
    file: 'uk-games-expo-cam-noi-dung-ai-chi-chua-mot-so-truong-hop-ngo.html',
    title: 'UK Games Expo cấm nội dung AI, chỉ chừa một số trường hợp ngoại lệ',
    desc: 'UK Games Expo chính thức đưa AI vào danh sách những nội dung bị hạn chế tại khu vực dành cho các nhà phát hành và nhà bán hàng. Chính sách mới yêu cầu sản phẩm được mang đến sự kiện phải dựa trên quá trình sáng tạo của con người, nhưng vẫn cho phép sử dụng một số công cụ AI cho những tác vụ hỗ trợ nhỏ.',
    cat: 'Gaming',
    hero: '/assets/img/uploads/vz6citou-photo-2026-09-29-14-59-50.jpg',
    date: '2026-09-29',
    pubDate: 'Tue, 29 Sep 2026 07:52:10 GMT',
    isoDate: '2026-09-29T07:52:10.130Z'
  },
  {
    slug: 'duoc-su-tu-su-mua-3-maomao-buoc-vao-hanh-trinh-pha-an-moi-na',
    file: 'duoc-su-tu-su-mua-3-maomao-buoc-vao-hanh-trinh-pha-an-moi-na.html',
    title: 'Dược Sư Tự Sự mùa 3: Maomao bước vào hành trình phá án mới năm 2027',
    desc: 'Dược Sư Tự Sự mùa 3 trở lại từ 2/10/2026, đưa Maomao và Jinshi bước vào những vụ án mới bên ngoài hậu cung.',
    cat: 'Anime',
    hero: '/assets/img/uploads/ikwqphfh-maomao-and-jinshi-in-the-apothecary-diaries-season-2-with-a-.webp',
    date: '2026-09-29',
    pubDate: 'Tue, 29 Sep 2026 07:29:16 GMT',
    isoDate: '2026-09-29T07:29:16.865Z'
  },
  {
    slug: 'vi-sao-nen-xem-laputa-lau-dai-tren-khong-tren-man-anh-lon',
    file: 'vi-sao-nen-xem-laputa-lau-dai-tren-khong-tren-man-anh-lon.html',
    title: 'Vì sao nên xem Laputa: Lâu đài trên không trên màn ảnh lớn?',
    desc: 'Laputa: Lâu đài trên không trở lại rạp Việt Nam ngày 25/9/2026. Khám phá lý do nên xem lại anime kinh điển này trên màn ảnh lớn.',
    cat: 'Anime',
    hero: '/assets/img/uploads/bmnjzftx-1788505364131-c2-1788504847736952838044-0-0-1005-1920-crop-1.webp',
    date: '2026-09-29',
    pubDate: 'Tue, 29 Sep 2026 07:15:36 GMT',
    isoDate: '2026-09-29T07:15:36.140Z'
  },
  {
    slug: 'we-are-aliens-phim-hoat-hinh-phap-nhat-ra-rap-ngay-25-9',
    file: 'we-are-aliens-phim-hoat-hinh-phap-nhat-ra-rap-ngay-25-9.html',
    title: 'We Are Aliens: Phim hoạt hình Pháp – Nhật ra rạp ngày 25/9',
    desc: 'We Are Aliens là phim hoạt hình hợp tác Pháp – Nhật, kể về tình bạn, ký ức tuổi thơ và những điều khó quên, ra rạp Nhật ngày 25/9/2026.',
    cat: 'Anime',
    hero: '/assets/img/uploads/7vs6cl91-we-are-aliens-main-trailer.jpg',
    date: '2026-09-29',
    pubDate: 'Tue, 29 Sep 2026 06:49:02 GMT',
    isoDate: '2026-09-29T06:49:02.380Z'
  }
];

console.log('--- 1. Updating assets/search.js ---');
let searchJs = fs.readFileSync('assets/search.js', 'utf8');
const searchMatch = searchJs.match(/(?:var|window\.)?\s*IDX\s*=\s*(\[[\s\S]*?\]);/m);
if (searchMatch) {
  let idxList = new Function('return ' + searchMatch[1])();
  for (const art of [...articles].reverse()) {
    idxList = idxList.filter(item => (item.url || item.u) !== `/${art.slug}` && (item.url || item.u) !== `/${art.slug}.html`);
    idxList.unshift({
      title: art.title,
      url: `/${art.slug}`,
      cat: art.cat,
      date: art.date,
      excerpt: art.desc,
      img: art.hero,
      tags: []
    });
  }
  searchJs = searchJs.replace(/(?:var|window\.)?\s*IDX\s*=\s*\[[\s\S]*?\];/, () => `window.IDX = ${JSON.stringify(idxList, null, 2)};`);
  fs.writeFileSync('assets/search.js', searchJs, 'utf8');
  console.log('✅ assets/search.js updated!');
}

console.log('--- 2. Updating sitemap.xml ---');
let sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
for (const art of articles) {
  const urlVI = `https://otahub.asia/${art.slug}`;
  if (!sitemapXml.includes(`<loc>${urlVI}</loc>`)) {
    const entryVI = `  <url>\n    <loc>${urlVI}</loc>\n    <lastmod>${art.date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    sitemapXml = sitemapXml.replace('</urlset>', () => `${entryVI}</urlset>`);
  }
}
fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
console.log('✅ sitemap.xml updated!');

console.log('--- 3. Updating sitemap-news.xml ---');
let smN = fs.readFileSync('sitemap-news.xml', 'utf8');
for (const art of articles) {
  const urlAbs = `https://otahub.asia/${art.slug}`;
  if (!smN.includes(`<loc>${urlAbs}</loc>`) && smN.includes('<url>')) {
    const entry = `  <url>\n    <loc>${urlAbs}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>OtaHub</news:name>\n        <news:language>vi</news:language>\n      </news:publication>\n      <news:publication_date>${art.isoDate}</news:publication_date>\n      <news:title>${escXml(art.title)}</news:title>\n    </news:news>\n  </url>\n`;
    const p = smN.indexOf('<url>');
    smN = smN.slice(0, p) + entry + smN.slice(p);
  }
}
fs.writeFileSync('sitemap-news.xml', smN, 'utf8');
console.log('✅ sitemap-news.xml updated!');

console.log('--- 4. Updating feed.xml ---');
let fx = fs.readFileSync('feed.xml', 'utf8');
for (const art of articles) {
  const urlAbs = `https://otahub.asia/${art.slug}`;
  if (!fx.includes('<link>' + urlAbs + '</link>') && fx.includes('<item>')) {
    const item = `  <item>\n    <title>${escXml(art.title)}</title>\n    <link>${urlAbs}</link>\n    <guid isPermaLink="true">${urlAbs}</guid>\n    <pubDate>${art.pubDate}</pubDate>\n    <description>${escXml(art.desc)}</description>\n    <media:content url="https://otahub.asia${art.hero}" medium="image"/>\n  </item>\n`;
    const p = fx.indexOf('  <item>');
    fx = fx.slice(0, p) + item + fx.slice(p);
  }
}
fs.writeFileSync('feed.xml', fx, 'utf8');
console.log('✅ feed.xml updated!');

console.log('--- 5. Updating feed.json ---');
let fj = JSON.parse(fs.readFileSync('feed.json', 'utf8'));
if (Array.isArray(fj.items)) {
  for (const art of [...articles].reverse()) {
    const urlAbs = `https://otahub.asia/${art.slug}`;
    fj.items = fj.items.filter(i => i.url !== urlAbs && i.id !== urlAbs);
    fj.items.unshift({
      id: urlAbs,
      url: urlAbs,
      title: art.title,
      content_text: art.desc || art.title,
      image: `https://otahub.asia${art.hero}`,
      date_published: art.isoDate
    });
  }
  fs.writeFileSync('feed.json', JSON.stringify(fj, null, 2), 'utf8');
  console.log('✅ feed.json updated!');
}

console.log('--- 6. Updating anime.html ---');
let animeHtml = fs.readFileSync('anime.html', 'utf8');
const animeMatch = animeHtml.match(/(<!-- ADMIN:ARTICLES_START -->)([\s\S]*?)(<!-- ADMIN:ARTICLES_END -->)/);
if (animeMatch) {
  let cards = '';
  for (const art of articles.filter(a => a.cat === 'Anime')) {
    if (!animeMatch[2].includes(`href="/${art.slug}"`)) {
      cards += `\n      <a href="/${art.slug}" class="ac">\n        <div class="ac-thumb"><img height="675" width="1200" src="${art.hero}" alt="${esc(art.title)}" loading="lazy"><span class="tag">Anime</span></div>\n        <div class="ac-body">\n          <h3 class="ac-title">${esc(art.title)}</h3>\n          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">29/09/2026</span></div>\n        </div>\n      </a>`;
    }
  }
  if (cards) {
    animeHtml = animeHtml.replace(/(<!-- ADMIN:ARTICLES_START -->)([\s\S]*?)(<!-- ADMIN:ARTICLES_END -->)/, `$1${cards}\n$2$3`);
    fs.writeFileSync('anime.html', animeHtml, 'utf8');
    console.log('✅ anime.html updated with 3 anime articles!');
  }
}

console.log('--- 7. Updating gaming.html ---');
let gamingHtml = fs.readFileSync('gaming.html', 'utf8');
const gamingMatch = gamingHtml.match(/(<!-- ADMIN:ARTICLES_START -->)([\s\S]*?)(<!-- ADMIN:ARTICLES_END -->)/);
if (gamingMatch) {
  let cards = '';
  for (const art of articles.filter(a => a.cat === 'Gaming')) {
    if (!gamingMatch[2].includes(`href="/${art.slug}"`)) {
      cards += `\n      <a href="/${art.slug}" class="ac">\n        <div class="ac-thumb"><img height="675" width="1200" src="${art.hero}" alt="${esc(art.title)}" loading="lazy"><span class="tag">Gaming</span></div>\n        <div class="ac-body">\n          <h3 class="ac-title">${esc(art.title)}</h3>\n          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">29/09/2026</span></div>\n        </div>\n      </a>`;
    }
  }
  if (cards) {
    gamingHtml = gamingHtml.replace(/(<!-- ADMIN:ARTICLES_START -->)([\s\S]*?)(<!-- ADMIN:ARTICLES_END -->)/, `$1${cards}\n$2$3`);
    fs.writeFileSync('gaming.html', gamingHtml, 'utf8');
    console.log('✅ gaming.html updated with 2 gaming articles!');
  }
}

console.log('--- 8. Updating news.html ---');
let newsHtml = fs.readFileSync('news.html', 'utf8');
const newsMatch = newsHtml.match(/(<!-- OTAHUB_NEW30_START -->[\s\S]*?<h2[^>]*>)(\d+)( tin mới đã kiểm chứng<\/h2><div[^>]*>)([\s\S]*?)(<\/div><\/section><!-- OTAHUB_NEW30_END -->)/);
if (newsMatch) {
  let count = parseInt(newsMatch[2], 10) || 85;
  let newCards = '';
  for (const art of articles) {
    if (!newsMatch[4].includes(`href="/${art.slug}"`)) {
      newCards += `\n    <a href="/${art.slug}" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">\n      <div style="position:relative;width:100%;height:180px;background:#0d051e;overflow:hidden;">\n        <img height="675" width="1200" src="${art.hero}" alt="${esc(art.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">\n        <span style="position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#ff3080,#7c3aed);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:.15em;text-transform:uppercase;">${esc(art.cat)}</span>\n      </div>\n      <div style="padding:16px;">\n        <h3 style="color:#ffffff;font-size:15px;font-weight:700;line-height:1.4;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${esc(art.title)}</h3>\n        <p style="color:rgba(240,238,255,0.65);font-size:12.5px;line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${esc(art.desc)}</p>\n        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">\n          <span>⚡ OtaHub News</span>\n          <span>29/09/2026</span>\n        </div>\n      </div>\n    </a>`;
      count++;
    }
  }
  newsHtml = newsHtml.replace(/(<!-- OTAHUB_NEW30_START -->[\s\S]*?<!-- OTAHUB_NEW30_END -->)/, `${newsMatch[1]}${count}${newsMatch[3]}${newCards}${newsMatch[4]}${newsMatch[5]}`);
  fs.writeFileSync('news.html', newsHtml, 'utf8');
  console.log(`✅ news.html updated! New count: ${count}`);
}

console.log('--- 9. Updating index.html ---');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Ticker track
for (const art of articles) {
  if (indexHtml.includes('<div class="tick-track">') && !indexHtml.includes(`href="/${art.slug}"`)) {
    const tick = `\n      <span class="tick-item">🔥 <strong>${esc(art.cat)}:</strong> <a href="/${art.slug}" style="color:inherit;text-decoration:none">${esc(art.title)}</a></span>`;
    indexHtml = indexHtml.replace('<div class="tick-track">', '<div class="tick-track">' + tick);
  }
}

// Latest wrap
const latestAnchor = '<div class="latest-wrap">\n<div>\n';
const pos = indexHtml.indexOf(latestAnchor);
if (pos !== -1) {
  let cards = '';
  for (const art of articles) {
    if (!indexHtml.includes(`href="/${art.slug}"`)) {
      cards += `<article class="w-card"><a href="/${art.slug}" style="text-decoration:none;display:contents"><div class="wc-info"><div class="wc-c" style="color:var(--cyan)">${esc(art.cat)}</div><div class="wc-t">${esc(art.title)}</div><div class="wc-m">OtaHub Editorial · 29/09/2026</div></div><div class="wc-thumb"><img src="${art.hero}" alt="${esc(art.title)}" loading="lazy" width="1200" height="675"></div></a></article>\n      `;
    }
  }
  if (cards) {
    indexHtml = indexHtml.slice(0, pos + latestAnchor.length) + cards + indexHtml.slice(pos + latestAnchor.length);
  }
}

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('✅ index.html updated with 5 new articles!');
console.log('🎉 ALL 5 ARTICLES SYNCHRONIZED SUCCESSFULLY!');
