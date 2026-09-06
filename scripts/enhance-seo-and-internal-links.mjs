import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html', 'anime.html', 'manga.html', 'gaming.html', 'news.html', 'reviews.html', 'community.html', 'tag.html', '404.html', 'about.html', 'anime-detail.html', 'article.html', 'bai-viet.html', 'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html', 'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html', 'rankings.html', 'recommend.html', 'sap-ra-mat.html'].includes(f));

console.log(`Analyzing and enhancing ${files.length} articles for SEO & internal linking...`);

// Mapping of popular topics to related article URLs & tags
const topicLinks = [
  { keyword: 'Frieren', url: '/tag?q=Frieren', label: 'Frieren: Beyond Journey\'s End' },
  { keyword: 'Madhouse', url: '/tag?q=Madhouse', label: 'Studio Madhouse' },
  { keyword: 'MAPPA', url: '/tag?q=MAPPA', label: 'Studio MAPPA' },
  { keyword: 'Ufotable', url: '/tag?q=Ufotable', label: 'Ufotable' },
  { keyword: 'WIT Studio', url: '/tag?q=WIT%20Studio', label: 'WIT Studio' },
  { keyword: 'Studio Pierrot', url: '/tag?q=Studio%20Pierrot', label: 'Studio Pierrot' },
  { keyword: 'HoYoverse', url: '/tag?q=HoYoverse', label: 'HoYoverse' },
  { keyword: 'Genshin Impact', url: '/tag?q=Genshin%20Impact', label: 'Genshin Impact' },
  { keyword: 'Honkai: Star Rail', url: '/tag?q=Honkai%20Star%20Rail', label: 'Honkai: Star Rail' },
  { keyword: 'Wuthering Waves', url: '/tag?q=Wuthering%20Waves', label: 'Wuthering Waves' },
  { keyword: 'FromSoftware', url: '/tag?q=FromSoftware', label: 'FromSoftware' },
  { keyword: 'Elden Ring', url: '/tag?q=Elden%20Ring', label: 'Elden Ring' },
  { keyword: 'Sekiro', url: '/tag?q=Sekiro', label: 'Sekiro: Shadows Die Twice' },
  { keyword: 'Black Myth: Wukong', url: '/tag?q=Black%20Myth%20Wukong', label: 'Black Myth: Wukong' },
  { keyword: 'Nintendo Switch 2', url: '/tag?q=Nintendo%20Switch%202', label: 'Nintendo Switch 2' },
  { keyword: 'PlayStation 5', url: '/tag?q=PlayStation%205', label: 'PlayStation 5' },
  { keyword: 'PS5 Pro', url: '/tag?q=PS5%20Pro', label: 'PS5 Pro' },
  { keyword: 'GTA 6', url: '/tag?q=GTA%206', label: 'Grand Theft Auto VI (GTA 6)' },
  { keyword: 'Monster Hunter Wilds', url: '/tag?q=Monster%20Hunter%20Wilds', label: 'Monster Hunter Wilds' },
  { keyword: 'One Piece', url: '/tag?q=One%20Piece', label: 'One Piece' },
  { keyword: 'Jujutsu Kaisen', url: '/tag?q=Jujutsu%20Kaisen', label: 'Jujutsu Kaisen' },
  { keyword: 'Chainsaw Man', url: '/tag?q=Chainsaw%20Man', label: 'Chainsaw Man' },
  { keyword: 'Solo Leveling', url: '/tag?q=Solo%20Leveling', label: 'Solo Leveling' },
  { keyword: 'Bleach', url: '/tag?q=Bleach', label: 'Bleach: Huyết Chiến Ngàn Năm' },
  { keyword: 'Kimetsu no Yaiba', url: '/tag?q=Kimetsu%20no%20Yaiba', label: 'Kimetsu no Yaiba' },
  { keyword: 'Demon Slayer', url: '/tag?q=Demon%20Slayer', label: 'Demon Slayer' }
];

let enhancedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // 1. Fix broken /game-detail link if present
  if (content.includes('href="/game-detail"')) {
    content = content.replace(/href="\/game-detail"/g, 'href="/gaming"');
    modified = true;
  }

  // 2. Ensure BreadcrumbList JSON-LD exists
  if (!content.includes('BreadcrumbList')) {
    const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/ · OtaHub.*$/i, '').trim() : 'Bài viết';
    const catMatch = content.match(/<span class="am-tag">([^<]*)<\/span>/i) || content.match(/<span class="art-hero-cat">([^<]*)<\/span>/i);
    const cat = catMatch ? catMatch[1].trim() : 'Anime';
    const catSlug = cat.toLowerCase() === 'gaming' ? 'gaming' : (cat.toLowerCase() === 'manga' ? 'manga' : (cat.toLowerCase() === 'reviews' ? 'reviews' : 'anime'));
    const slug = file.replace(/\.html$/, '');

    const bcJson = `{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Trang chủ","item":"https://otahub.asia/"},{"@type":"ListItem","position":2,"name":"${cat}","item":"https://otahub.asia/${catSlug}"},{"@type":"ListItem","position":3,"name":${JSON.stringify(title)},"item":"https://otahub.asia/${slug}"}]}`;
    const bcScript = `<script type="application/ld+json">${bcJson}</script>`;

    content = content.replace('</head>', `${bcScript}\n</head>`);
    modified = true;
  }

  // 3. Enrich in-body contextual internal links
  const bodyRegex = /(<article[^>]*class=["'][^"']*art-body[^"']*["'][^>]*>)([\s\S]*?)(<\/article>)/i;
  const match = content.match(bodyRegex);

  if (match) {
    let [fullMatch, startTag, bodyContent, endTag] = match;

    // Check existing link count inside body
    const existingLinks = (bodyContent.match(/href=/g) || []).length;

    if (existingLinks < 3) {
      // Intelligently find first mention of keywords and wrap in internal links
      for (const item of topicLinks) {
        // Only replace if keyword exists and not already inside an <a> tag
        const kwRegex = new RegExp(`(?<!<[^>]*)\\b(${item.keyword})\\b(?![^<]*<\\/a>)`, 'i');
        if (kwRegex.test(bodyContent)) {
          bodyContent = bodyContent.replace(kwRegex, `<a href="${item.url}"><strong>$1</strong></a>`);
          break; // Don't over-link, replace top relevant match
        }
      }

      // Add a footer recommendation block if not already present
      if (!bodyContent.includes('related-box') && !bodyContent.includes('Đọc thêm:')) {
        const catMatch = content.match(/<span class="am-tag">([^<]*)<\/span>/i) || content.match(/<span class="art-hero-cat">([^<]*)<\/span>/i);
        const cat = catMatch ? catMatch[1].trim() : 'Anime';
        const catSlug = cat.toLowerCase() === 'gaming' ? 'gaming' : (cat.toLowerCase() === 'manga' ? 'manga' : (cat.toLowerCase() === 'reviews' ? 'reviews' : 'anime'));

        const readAlso = `\n<div class="read-more-box" style="margin:28px 0;padding:16px 20px;background:rgba(0,229,255,.04);border-left:3px solid var(--cyan);border-radius:0 4px 4px 0">
  <strong style="color:var(--white);font-size:14px;letter-spacing:.05em;text-transform:uppercase">Khám phá thêm trên OtaHub:</strong>
  <ul style="margin:8px 0 0 0;padding-left:18px;list-style:disc">
    <li>Theo dõi toàn bộ tin tức nóng tại <a href="/${catSlug}">chuyên mục ${cat}</a> và <a href="/news">Bản tin mới nhất</a>.</li>
    <li>Khám phá các đánh giá chuyên sâu tại <a href="/reviews">OtaHub Reviews</a> hoặc xem <a href="/rankings">Bảng xếp hạng</a>.</li>
    <li>Tra cứu bài viết theo chủ đề yêu thích tại trang <a href="/tag">Khám Phá Thẻ &amp; Chủ Đề</a>.</li>
  </ul>
</div>`;
        bodyContent = bodyContent + readAlso;
      }

      content = content.replace(bodyRegex, `${startTag}${bodyContent}${endTag}`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    enhancedCount++;
  }
}

console.log(`\n✅ Successfully enhanced SEO & internal linking across ${enhancedCount} articles!`);
