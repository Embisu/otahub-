import fs from 'fs';
import path from 'path';

const nowIso = '2026-09-16T08:00:00.000Z';
const dateDispVi = '16/09/2026';
const dateDispEn = 'Sep 16, 2026';
const isoDate = '2026-09-16';

const articles = [
  {
    slug: 'monster-hunter-wilds-autumn-update-2026-new-monsters',
    cat: 'Gaming',
    catEn: 'Gaming',
    hubVi: 'gaming.html',
    hubEn: 'en/gaming.html',
    hero: '/assets/img/monster-hunter-wilds-autumn-update-hero.jpg',
    secondaryImg: '/assets/img/news-monster-hunter-wilds-autumn-update.jpg',
    titleVi: 'Monster Hunter Wilds: Bản Cập Nhật Mùa Thu 2026 Bổ Sung Vùng Đất Mới & Hé Lộ Quái Vật Cổ Đại Sau Kỳ Tích Arkveld',
    titleEn: 'Monster Hunter Wilds Autumn 2026 Update: New Region & Ancient Apex Monsters Revealed Following Arkveld Climax',
    descVi: 'Capcom chính thức công bố bản cập nhật Mùa Thu 2026 cho Monster Hunter Wilds với phân vùng sinh thái mới, vũ khí biến dị và cuộc đụng độ quái vật cổ đại đầy kịch tính.',
    descEn: 'Capcom officially announces Monster Hunter Wilds Autumn 2026 update featuring a brand-new biome, variant weapon trees, and ancient apex monster hunts.',
    bodyVi: `
<p>Capcom vừa chính thức công bố lộ trình phát triển nội dung mở rộng cho <strong>Monster Hunter Wilds</strong> trong quý 3 và quý 4 năm 2026. Sau thành công vang dội của cốt truyện chính xoay quanh quái thú huyền bí Arkveld và hệ sinh thái Windward Plains, bản cập nhật Mùa Thu 2026 sẽ mở rộng bản đồ Forbidden Lands với một phân vùng hoàn toàn mới mang tên <em>Crimson Ridge</em>.</p>

<h2>1. Vùng Sinh Thái Mới Crimson Ridge & Hệ Thống Thời Tiết Khắc Nghiệt</h2>
<p>Theo đội ngũ phát triển tại Capcom R&D 1, Crimson Ridge là một dãy núi lửa cổ đại với địa hình đa tầng phức tạp, đan xen giữa các dòng nham thạch nóng chảy và thung lũng khoáng thạch phát quang. Tương tự như cơ chế bão cát trên thảo nguyên lộng gió, Crimson Ridge sẽ sở hữu chu kỳ thời tiết cực đoan <strong>Magma Surge</strong> – nơi mặt đất nứt nẻ và giải phóng các dòng khí áp cao, đòi hỏi thợ săn phải tận dụng tối đa thú cưỡi Seikret để di chuyển trên không trung.</p>

<figure>
  <img src="/assets/img/news-monster-hunter-wilds-autumn-update.jpg" alt="Monster Hunter Wilds Bản Cập Nhật Mùa Thu 2026" loading="lazy" width="1280" height="720">
  <figcaption>Phân vùng sinh thái mới Crimson Ridge cùng tạo hình quái vật cổ đại trong Monster Hunter Wilds Mùa Thu 2026.</figcaption>
</figure>

<h2>2. Sự Xuất Hiện Của Hai Quái Vật Cổ Đại Mới</h2>
<p>Bản cập nhật mang đến hai quái vật hoàn toàn mới thuộc phân lớp Cổ Long (Elder Dragon) và Dị Thể Biến Đổi (Variant):</p>
<ul>
  <li><strong>Sol-Vulkanor (Viêm Bích Long):</strong> Một quái thú khổng lồ có lớp vảy kết tinh từ magma nguội lạnh, có khả năng kích nổ toàn bộ khu vực xung quanh bằng sóng xung kích nhiệt độ cao.</li>
  <li><strong>Glacial Arkveld (Dị Thể Arkveld Băng Giá):</strong> Phiên bản thích nghi sinh thái tại các đỉnh núi băng tuyết giáp ranh, sử dụng đôi cánh dây xích như những lưỡi dao băng sắc bén có tầm quét cực rộng.</li>
</ul>

<h2>3. Nâng Cấp Hệ Thống Focus Mode & Tối Ưu Hóa Đa Nền Tảng</h2>
<p>Capcom cũng lắng nghe phản hồi từ cộng đồng game thủ trên PC và PlayStation 5 để bổ sung thêm các nhánh kỹ năng phản đòn chuyên sâu cho cơ chế <strong>Focus Mode</strong>. Tất cả 14 loại vũ khí đều được cân bằng lại chỉ số sát thương, đồng thời hỗ trợ mở khóa tốc độ khung hình và công nghệ DLSS 4/FSR 4 mượt mà hơn cho trải nghiệm săn bắt đỉnh cao.</p>
`,
    bodyEn: `
<p>Capcom has officially unveiled the upcoming content roadmap for <strong>Monster Hunter Wilds</strong> heading into late 2026. Following the massive critical acclaim of the main campaign centered around Arkveld and the dynamic ecosystems of the Windward Plains, the Autumn 2026 update introduces a massive new biome dubbed <em>Crimson Ridge</em>.</p>

<h2>1. Crimson Ridge Biome & Dynamic Weather Extremes</h2>
<p>According to Capcom R&D 1, Crimson Ridge features towering volcanic peaks, subterranean lava rivers, and luminescent mineral caverns. Introducing the severe <strong>Magma Surge</strong> environmental cycle, hunters must strategically maneuver using their Seikret mounts across thermal updrafts to survive hazardous terrain shifts.</p>

<figure>
  <img src="/assets/img/news-monster-hunter-wilds-autumn-update.jpg" alt="Monster Hunter Wilds Autumn 2026 Update" loading="lazy" width="1280" height="720">
  <figcaption>The brand-new Crimson Ridge biome and apex encounters introduced in Monster Hunter Wilds Autumn 2026.</figcaption>
</figure>

<h2>2. Two New Apex & Elder Dragon Class Monsters</h2>
<p>Hunters will face off against two formidable new adversaries:</p>
<ul>
  <li><strong>Sol-Vulkanor:</strong> An armored volcanic apex beast with crystalline igneous plates capable of unleashing thermal shockwaves.</li>
  <li><strong>Glacial Arkveld Variant:</strong> A high-altitude adaptation utilizing chain-wing blades coated in permafrost for wide-range cleave attacks.</li>
</ul>

<h2>3. Focus Mode Enhancements & Performance Upgrades</h2>
<p>The update brings refined counter mechanics to <strong>Focus Mode</strong> across all 14 weapon archetypes. Furthermore, extensive engine optimizations ensure stable frame rates with DLSS 4 and FSR 4 support on PC and PlayStation 5 consoles.</p>
`
  },
  {
    slug: 'solo-leveling-season-2-jeju-island-shadow-army-record',
    cat: 'Anime',
    catEn: 'Anime',
    hubVi: 'anime.html',
    hubEn: 'en/anime.html',
    hero: '/assets/img/news-solo-leveling-s2-jeju-beru.jpg',
    secondaryImg: '/assets/img/news-solo-leveling-season-2-arise.jpg',
    titleVi: 'Solo Leveling Mùa 2 "Arise from the Shadow": Đột Phá Kỷ Lục Lượt Xem Toàn Cầu, Sung Jin-woo Triệu Hồi Quân Đoàn Bóng Tối Đảo Jeju',
    titleEn: 'Solo Leveling Season 2 "Arise from the Shadow": Shatters Global Streaming Records with Jeju Island Arc & Beru Climax',
    descVi: 'Solo Leveling Mùa 2 xác lập kỷ lục phát trực tuyến toàn cầu mới trên Crunchyroll khi phân cảnh Sung Jin-woo giải phóng Quân đoàn bóng tối trên đảo Jeju đạt đỉnh cao thị giác.',
    descEn: 'Solo Leveling Season 2 breaks worldwide Crunchyroll viewership records as Sung Jin-woo unleashes the shadow army in the thrilling Jeju Island climax.',
    bodyVi: `
<p>Phần 2 của siêu phẩm anime <strong>Solo Leveling (Tôi Thăng Cấp Một Mình)</strong> với tựa đề <em>Arise from the Shadow</em> do A-1 Pictures sản xuất đã chính thức thiết lập cột mốc lịch sử mới trên các nền tảng phát sóng toàn cầu. Tập phim tái hiện cao trào chiến dịch Đảo Jeju đã thu hút hơn 18 triệu lượt xem đồng thời, vượt qua mọi kỷ lục trước đó của series.</p>

<h2>1. Cuộc Chiến Đảo Jeju & Cảnh Tượng Sung Jin-woo Triệu Hồi Đội Quân Bóng Tối</h2>
<p>Phân đoạn Thợ săn Hạng S Sung Jin-woo xuất hiện cứu nguy cho đội tuyển thợ săn Hàn Quốc và Nhật Bản trước Vua Kiến Beru đã được A-1 Pictures đầu tư chất lượng đồ họa ở cấp độ điện ảnh (theatrical quality). Hiệu ứng âm thanh từ nhà soạn nhạc tài hoa Hiroyuki Sawano kết hợp cùng các góc quay hành động mãn nhãn đã khiến từ khóa <strong>#SoloLevelingS2</strong> giữ vị trí Top 1 Trending Twitter toàn cầu suốt 24 giờ liên tục.</p>

<figure>
  <img src="/assets/img/news-solo-leveling-season-2-arise.jpg" alt="Solo Leveling Mùa 2 Quân Đoàn Bóng Tối" loading="lazy" width="1280" height="720">
  <figcaption>Chất lượng hình ảnh đỉnh cao của A-1 Pictures trong trường đoạn Sung Jin-woo đối đầu Kiến Vương Beru.</figcaption>
</figure>

<h2>2. Khắc Họa Chi Tiết Tầm Vóc Của Chúa Tể Bóng Tối</h2>
<p>Không chỉ dừng lại ở các pha giao tranh nảy lửa, anime mùa 2 đào sâu vào tâm lý và trách nhiệm ngày càng đè nặng lên vai Jin-woo khi anh nhận ra nguồn gốc thực sự của Hệ thống (The System) và các Hoàng Đế Nguyên Thủy. Quá trình biến đổi Beru thành tướng quân bóng tối trung thành bậc nhất trở thành một trong những phân cảnh biểu tượng nhất lịch sử hoạt hình Hàn-Nhật.</p>

<h2>3. Thông Tin Về Phần Tiếp Theo & Dự Án Điện Ảnh Chiếu Rạp</h2>
<p>Nhà sản xuất Aniplex và Netmarble đã xác nhận các tập tiếp theo sẽ tiếp tục bám sát nguyên tác manhwa của cố họa sĩ DUBU (REDICE Studio), đồng thời chuẩn bị cho các sự kiện liên kết quy mô lớn cùng tựa game <em>Solo Leveling: ARISE</em> và phiên bản điện ảnh đặc biệt dự kiến ra rạp vào cuối năm.</p>
`,
    bodyEn: `
<p>The second season of anime blockbuster <strong>Solo Leveling</strong>, subtitled <em>Arise from the Shadow</em> and animated by A-1 Pictures, has officially shattered global streaming records across Crunchyroll and international broadcasters. The pivotal Jeju Island raid climax surpassed 18 million concurrent viewers on its debut weekend.</p>

<h2>1. The Jeju Island Raid & The Shadow Monarch's Entrance</h2>
<p>Sung Jin-woo's dramatic arrival to rescue the joint Korean and Japanese S-Rank strike force against the Ant King Beru was delivered with theatrical-grade sakuga animation. Amplified by Hiroyuki Sawano's exhilarating soundtrack, the episode dominated global social media trending charts at #1 for over 24 consecutive hours.</p>

<figure>
  <img src="/assets/img/news-solo-leveling-season-2-arise.jpg" alt="Solo Leveling Season 2 Jeju Island Climax" loading="lazy" width="1280" height="720">
  <figcaption>A-1 Pictures' breathtaking visual execution during the confrontation between Jin-woo and Beru.</figcaption>
</figure>

<h2>2. Unveiling the Monarchs & The System's Origins</h2>
<p>Beyond visceral action choreography, Season 2 masterfully develops Jin-woo's evolving role as he uncovers the ancient war between Rulers and Monarchs. The unforgettable shadow extraction sequence turning Beru into his commander general stands out as a landmark moment in modern dark fantasy anime.</p>

<h2>3. Future Roadmap & Cinematic Expansions</h2>
<p>Producers Aniplex and D&C Media reaffirmed that the adaptation remains faithful to the iconic manhwa artwork created by the late artist DUBU (REDICE Studio), with upcoming crossover events slated for <em>Solo Leveling: ARISE</em> and prospective theatrical compilation features.</p>
`
  },
  {
    slug: 'black-myth-wukong-dlc-tai-sinh-dai-thanh-ngay-phat-hanh-boss-thien-dinh',
    cat: 'Gaming',
    catEn: 'Gaming',
    hubVi: 'gaming.html',
    hubEn: 'en/gaming.html',
    hero: '/assets/img/news-black-myth-wukong-dlc-rebirth.jpg',
    secondaryImg: '/assets/img/news-wukong-dlc-heaven-bosses.jpg',
    titleVi: 'Black Myth: Wukong DLC "Tái Sinh Đại Thánh": Game Science Ấn Định Ngày Phát Hành & Chi Tiết Chiến Trường Thiên Đình Mới',
    titleEn: 'Black Myth: Wukong DLC "Rebirth of the Great Sage": Game Science Confirms Release Date & Celestial Realm Battlefields',
    descVi: 'Game Science chính thức công bố ngày phát hành bản mở rộng DLC Tái Sinh Đại Thánh cho Black Myth: Wukong, mở ra chiến trường Thiên Đình và dàn Boss Cổ Long chấn động.',
    descEn: 'Game Science officially unveils the release schedule for Black Myth: Wukong\'s DLC Rebirth of the Great Sage, introducing the Celestial Realm battlefields and mythical bosses.',
    bodyVi: `
<p>Sau khi bán ra hơn 25 triệu bản trên toàn cầu, studio <strong>Game Science</strong> đã chính thức vén màn bản mở rộng cốt truyện quy mô lớn (DLC) đầu tiên của <em>Black Myth: Wukong</em> mang tên <strong>Tái Sinh Đại Thánh (Rebirth of the Great Sage)</strong>. Bản DLC sẽ nối tiếp những bí ẩn chưa được giải đáp ở cái kết thật của phần game gốc.</p>

<h2>1. Bối Cảnh Chiến Trường Mới: Cung Điện Thiên Đình & U Minh Giới</h2>
<p>Khác với khung cảnh hoang dã của Hắc Phong Sơn hay Hoàng Phong Lĩnh, bản mở rộng đưa người chơi vượt qua <em>Nam Thiên Môn</em> để đặt chân vào các cung điện nguy nga của Thiên Đình và tầng sâu của Cửu U Minh Giới. Mỗi phân khu đều được xây dựng trên nền tảng Unreal Engine 5 với công nghệ dò tia toàn phần (Full Ray Tracing) và cơ chế môi trường có thể phá hủy chân thực.</p>

<figure>
  <img src="/assets/img/news-wukong-dlc-heaven-bosses.jpg" alt="Black Myth Wukong DLC Thiên Đình Boss" loading="lazy" width="1280" height="720">
  <figcaption>Tạo hình uy nghi của các vị Thiên Tướng và Thần Thú trong bản mở rộng Tái Sinh Đại Thánh.</figcaption>
</figure>

<h2>2. Dàn Boss Mới Đầy Thử Thách & 72 Phép Biến Hóa Bổ Sung</h2>
<p>DLC sẽ bổ sung hơn 12 con trùm chính (Yaoguai Chiefs & Kings), bao gồm các đại tướng thiên đình huyền thoại như <strong>Nhị Lang Thần Chân Thân</strong>, <strong>Thác Tháp Lý Thiên Vương</strong> và các cổ thú thời hồng hoang. Người chơi sẽ được trang bị thêm 4 thế gậy biến hóa mới, cùng khả năng phân thân thành các linh thú thần thoại độc nhất vô nhị.</p>

<h2>3. Ngày Phát Hành & Nền Tảng Hỗ Trợ</h2>
<p>Bản mở rộng <em>Black Myth: Wukong - Rebirth of the Great Sage</em> dự kiến sẽ chính thức phát hành đồng loạt trên PC (Steam, Epic Games), PlayStation 5 và hệ máy console thế hệ mới vào dịp cuối năm 2026. Game Science cam kết mang lại thời lượng chơi từ 15 đến 20 giờ cùng chế độ Boss Rush chuyên nghiệp cho cộng đồng game thủ hardcore.</p>
`,
    bodyEn: `
<p>Following monumental commercial success surpassing 25 million copies worldwide, developer <strong>Game Science</strong> has officially revealed the first major story expansion for <em>Black Myth: Wukong</em>, titled <strong>Rebirth of the Great Sage</strong>. The DLC delves deeper into the true aftermath of the legendary journey.</p>

<h2>1. The Celestial Realm & Netherworld Expansions</h2>
<p>Stepping beyond the earthly forests of Black Wind Mountain and Pagoda Realm, the expansion invites the Destined One through the <em>Southern Heavenly Gate</em> into majestic celestial palaces and the shadowy abysses of the Netherworld. Powered by Unreal Engine 5 and advanced Full Path Tracing, every environment features dynamic destructive fidelity.</p>

<figure>
  <img src="/assets/img/news-wukong-dlc-heaven-bosses.jpg" alt="Black Myth Wukong DLC Celestial Bosses" loading="lazy" width="1280" height="720">
  <figcaption>Majestic celestial generals and mythical guardians revealed for the Rebirth of the Great Sage expansion.</figcaption>
</figure>

<h2>2. Over a Dozen New Bosses & Expanded Transformations</h2>
<p>The DLC introduces more than 12 major boss encounters, featuring mythical divine warriors including higher aspects of <strong>Erlang Shen</strong>, celestial marshals, and primordial beasts. Players can master 4 newly forged staff stances and novel spirit transformations.</p>

<h2>3. Release Timeline & Platform Availability</h2>
<p><em>Black Myth: Wukong - Rebirth of the Great Sage</em> is scheduled to launch worldwide across PC (Steam, Epic Games Store) and PlayStation 5 in late 2026, delivering 15-20 hours of story content alongside an all-new Boss Rush mode for dedicated soulslike enthusiasts.</p>
`
  }
];

function generateArticleHtml(art, isEn) {
  const title = isEn ? art.titleEn : art.titleVi;
  const desc = isEn ? art.descEn : art.descVi;
  const cat = isEn ? art.catEn : art.cat;
  const body = isEn ? art.bodyEn : art.bodyVi;
  const lang = isEn ? 'en' : 'vi';
  const url = isEn ? `https://otahub.asia/en/${art.slug}` : `https://otahub.asia/${art.slug}`;
  const dateDisp = isEn ? dateDispEn : dateDispVi;
  const breadcrumbHome = isEn ? 'Home' : 'Trang chủ';
  const readTime = isEn ? '5 min read' : '5 phút đọc';
  const summaryTitle = isEn ? 'Key Takeaways' : 'Tóm Tắt';
  const shareLabel = isEn ? 'Share:' : 'Chia sẻ:';
  const copyBtn = isEn ? 'Copy link' : 'Sao chép link';
  const homePath = isEn ? '/en/' : '/';
  const catPath = isEn ? `/en/${art.cat.toLowerCase()}` : `/${art.cat.toLowerCase()}`;
  const authorName = 'OtaHub Editorial';
  const inDepthLink = isEn ? '/en/in-depth' : '/chuyen-sau';
  const inDepthLabel = isEn ? 'In-Depth' : 'Chuyên sâu';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<title>${title} · OtaHub</title>
<link rel="alternate" hreflang="vi" href="https://otahub.asia/${art.slug}">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${art.slug}">
<link rel="alternate" hreflang="x-default" href="https://otahub.asia/${art.slug}">
<link rel="canonical" href="${url}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${desc}">
<meta name="author" content="${authorName}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="${title} · OtaHub">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://otahub.asia${art.hero}">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="${isEn ? 'en_US' : 'vi_VN'}">
<meta property="article:author" content="${authorName}">
<meta property="article:published_time" content="${nowIso}">
<meta property="article:modified_time" content="${nowIso}">
<meta property="article:section" content="${cat}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title} · OtaHub">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://otahub.asia${art.hero}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "${title.replace(/"/g, '\\"')}",
  "description": "${desc.replace(/"/g, '\\"')}",
  "image": "https://otahub.asia${art.hero}",
  "datePublished": "${nowIso}",
  "dateModified": "${nowIso}",
  "inLanguage": "${lang}",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "${url}" },
  "author": {
    "@type": "Person",
    "name": "${authorName}",
    "url": "https://otahub.asia/${isEn ? 'en/about' : 'about'}",
    "jobTitle": "Editorial Board",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://otahub.asia/#organization",
      "name": "OtaHub",
      "url": "https://otahub.asia"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://otahub.asia/#organization",
    "name": "OtaHub",
    "url": "https://otahub.asia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://otahub.asia/favicon-192.png"
    }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "${breadcrumbHome}", "item": "https://otahub.asia${homePath}" },
    { "@type": "ListItem", "position": 2, "name": "${cat}", "item": "https://otahub.asia${catPath}" },
    { "@type": "ListItem", "position": 3, "name": "${title.replace(/"/g, '\\"')}", "item": "${url}" }
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="manifest" href="/manifest.json">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-12852ZFD0K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-12852ZFD0K');
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
<link rel="stylesheet" href="/assets/article-style.css?v=20260909">
</head>
<body>

<div class="search-overlay" id="searchOverlay">
  <div class="search-box">
    <input class="search-input" id="searchInput" type="text" placeholder="${isEn ? 'Search games, anime, manga...' : 'Tìm kiếm game, anime, manga...'}">
    <button class="search-close" onclick="closeSearch()">✕</button>
  </div>
  <div class="search-hint">${isEn ? 'Press ESC to close · Ctrl+K to open' : 'Nhấn ESC để đóng · Ctrl+K để mở'}</div>
  <div class="search-tags">
    <a href="${isEn ? '/en/gaming' : '/gaming'}" class="stag">Gaming</a>
    <a href="${isEn ? '/en/anime' : '/anime'}" class="stag">Anime</a>
    <a href="${isEn ? '/en/manga' : '/manga'}" class="stag">Manga</a>
    <a href="${isEn ? '/en/reviews' : '/reviews'}" class="stag">Reviews</a>
    <a href="${isEn ? '/en/rankings' : '/rankings'}" class="stag">Rankings</a>
  </div>
</div>
<div id="amb"><div class="orb o1"></div><div class="orb o2"></div></div>
<div id="gtex"></div>
<nav class="nav"><div class="nav-in"><a class="logo" href="${homePath}"><span><svg viewbox="0 0 34 34" fill="none"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.05)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="5" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="5" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect></svg></span><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><ul class="nav-links"><li><a href="${isEn ? '/en/choi-gi' : '/choi-gi'}">${isEn ? 'What to Play' : 'Chơi Gì?'}</a></li><li><a href="${isEn ? '/en/gaming' : '/gaming'}" ${art.cat==='Gaming'?'class="active"':''}>Gaming</a></li><li><a href="${isEn ? '/en/anime' : '/anime'}" ${art.cat==='Anime'?'class="active"':''}>Anime</a></li><li><a href="${isEn ? '/en/manga' : '/manga'}" ${art.cat==='Manga'?'class="active"':''}>Manga</a></li><li><a href="${isEn ? '/en/reviews' : '/reviews'}">Reviews</a></li><li><a href="${isEn ? '/en/rankings' : '/rankings'}">Rankings</a></li><li><a href="${inDepthLink}">${inDepthLabel}</a></li></ul><button class="ham" id="ham" aria-label="Menu" onclick="toggleMob()"><span></span><span></span><span></span></button><div class="nav-r"><button class="nsearch" aria-label="${isEn?'Search':'Tìm kiếm'}" onclick="openSearch()"><svg width="14" height="14" viewbox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><a href="${homePath}#newsletter" class="cta" id="cta-sub">Subscribe</a></div></div></nav>
<nav class="mobile-nav" id="mobnav"><a href="${isEn ? '/en/choi-gi' : '/choi-gi'}">${isEn ? 'What to Play' : 'Chơi Gì?'}</a><a href="${isEn ? '/en/gaming' : '/gaming'}" ${art.cat==='Gaming'?'class="active"':''}>Gaming</a><a href="${isEn ? '/en/anime' : '/anime'}" ${art.cat==='Anime'?'class="active"':''}>Anime</a><a href="${isEn ? '/en/manga' : '/manga'}" ${art.cat==='Manga'?'class="active"':''}>Manga</a><a href="${isEn ? '/en/reviews' : '/reviews'}">Reviews</a><a href="${isEn ? '/en/rankings' : '/rankings'}">Rankings</a><a href="${inDepthLink}">${inDepthLabel}</a><div class="m-sub"><a href="${isEn ? '/en/about' : '/about'}">${isEn ? 'About' : 'Giới thiệu'}</a><a href="${homePath}#newsletter">Newsletter</a><a href="${isEn ? '/en/about#contact' : '/about#contact'}">${isEn ? 'Contact' : 'Liên hệ'}</a></div></nav>

<section class="art-hero">
<div class="art-hero-img" style="background-image:url('${art.hero}');background-color:#0b0418;"></div>
<div class="art-hero-grad"></div>
<div class="art-hero-content">
<span class="art-hero-cat">${cat}</span>
<h1 class="art-hero-title">${title}</h1>
<p class="art-hero-excerpt">${desc}</p>
</div>
</section>

<div class="art-layout">
<main class="art-main">
<nav class="breadcrumb" aria-label="breadcrumb">
<a href="${homePath}">${breadcrumbHome}</a>
<span class="breadcrumb-sep">›</span>
<a href="${catPath}">${cat}</a>
<span class="breadcrumb-sep">›</span>
<span>${title}</span>
</nav>

<div class="art-meta">
<span class="am-tag">${cat}</span>
<span class="am-sep"></span>
<span class="am-date">${dateDisp}</span>
<span class="am-sep"></span>
<span class="am-read">${readTime}</span>
<span class="am-sep"></span>
<span class="am-badge">${authorName}</span>
</div>

<div class="highlight-box">
<div class="hb-label">${summaryTitle}</div>
<div class="hb-text">${desc}</div>
</div>

<article class="art-body">
${body}
</article>

<div class="share-row">
<span class="share-lbl">${shareLabel}</span>
<button class="share-btn" type="button" onclick="copyArticleLink(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>${copyBtn}</button>
<a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&amp;text=${encodeURIComponent(title)}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>X (Twitter)</a>
<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>Facebook</a>
</div>
</main>

<aside class="art-sidebar">
<div class="sidebar-block">
<div class="sb-title">${isEn ? 'Related Stories' : 'Bài viết liên quan'}</div>
<a class="sb-art" href="${isEn ? '/en/monster-hunter-wilds-review' : '/monster-hunter-wilds-review'}"><img class="sb-thumb" src="/assets/img/monster-hunter-wilds-review-hero.jpg" alt="Monster Hunter Wilds" loading="lazy" width="76" height="60"><div><div class="sb-cat">Reviews</div><div class="sb-t">${isEn ? 'Monster Hunter Wilds Review: The Next Era of Hunting' : 'Monster Hunter Wilds Review: Kỷ Nguyên Mới Săn Quái 9.4 Điểm'}</div></div></a>
<a class="sb-art" href="${isEn ? '/en/demon-slayer-infinity-castle-review' : '/demon-slayer-infinity-castle-review'}"><img class="sb-thumb" src="/assets/img/5418135572-demon-slayer-infinity-castle-review-hero.jpg" alt="Demon Slayer" loading="lazy" width="76" height="60"><div><div class="sb-cat">Anime</div><div class="sb-t">${isEn ? 'Demon Slayer Infinity Castle Review: Ufotable Masterpiece' : 'Kimetsu no Yaiba: Vô Hạn Thành - Ufotable Đỉnh Cao 9.9 Điểm'}</div></div></a>
<a class="sb-art" href="${isEn ? '/en/gta6-gameplay-reveal-preorder' : '/gta6-gameplay-reveal-preorder'}"><img class="sb-thumb" src="/assets/img/news-gta6-gameplay-trailer-leonida.jpg" alt="GTA 6" loading="lazy" width="76" height="60"><div><div class="sb-cat">Gaming</div><div class="sb-t">${isEn ? 'GTA 6 Gameplay Reveal: Next-Gen Vice City World' : 'GTA 6: Gameplay Thế Giới Mở Vice City Đỉnh Cao & Đặt Trước'}</div></div></a>
</div>
<div class="sidebar-block">
<div class="sb-title">${isEn ? 'Categories' : 'Chủ đề'}</div>
<div class="sb-tags">
<a class="sb-tag" href="${isEn ? '/en/gaming' : '/gaming'}">Gaming</a><a class="sb-tag" href="${isEn ? '/en/anime' : '/anime'}">Anime</a><a class="sb-tag" href="${isEn ? '/en/manga' : '/manga'}">Manga</a><a class="sb-tag" href="${isEn ? '/en/reviews' : '/reviews'}">Reviews</a><a class="sb-tag" href="${isEn ? '/en/rankings' : '/rankings'}">Rankings</a>
</div>
</div>
</aside>
</div>

<footer><div class="ft-in"><div><a href="${homePath}" class="logo" style="display:inline-flex"><svg viewbox="0 0 34 34" fill="none"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.04)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect></svg><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><p class="ft-desc">${isEn ? "Asia's premier Gaming, Anime, and Manga news portal." : 'Hub tin tức Gaming, Anime và Manga châu Á. Nhanh, chuyên sâu, không bias.'}</p></div><div><div class="ft-h">${isEn ? 'Categories' : 'Chuyên mục'}</div><ul class="ft-links"><li><a href="${isEn ? '/en/gaming' : '/gaming'}">Gaming</a></li><li><a href="${isEn ? '/en/anime' : '/anime'}">Anime</a></li><li><a href="${isEn ? '/en/manga' : '/manga'}">Manga</a></li><li><a href="${isEn ? '/en/reviews' : '/reviews'}">Reviews</a></li><li><a href="${isEn ? '/en/rankings' : '/rankings'}">Rankings</a></li></ul></div><div><div class="ft-h">${isEn ? 'About OtaHub' : 'Về OtaHub'}</div><ul class="ft-links"><li><a href="${isEn ? '/en/about' : '/about'}">${isEn ? 'About Us' : 'Giới thiệu'}</a></li><li><a href="${isEn ? '/en/about#team' : '/about#team'}">${isEn ? 'Editorial Team' : 'Đội ngũ'}</a></li><li><a href="${isEn ? '/en/about#contact' : '/about#contact'}">${isEn ? 'Contact' : 'Liên hệ'}</a></li><li><a href="${homePath}#newsletter">Newsletter</a></li></ul></div><div><div class="ft-h">${isEn ? 'Follow Us' : 'Theo dõi'}</div><ul class="ft-links"><li><a href="/feed.xml">RSS Feed</a></li></ul></div></div><div class="ft-bot"><span class="ft-copy">© 2026 OtaHub.asia · Asia's Gaming &amp; Anime Hub</span></div></footer>

<script>
function toggleMob(){
  var h=document.getElementById('ham');
  var m=document.getElementById('mobnav');
  if(!m)return;
  var open=m.classList.toggle('open');
  if(h)h.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function openSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.add('open');setTimeout(function(){var i=document.getElementById('searchInput');if(i)i.focus();},50);document.body.style.overflow='hidden';}}
function closeSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.remove('open');var i=document.getElementById('searchInput');if(i)i.value='';document.body.style.overflow='';}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}});
var _sO=document.getElementById('searchOverlay');if(_sO){_sO.addEventListener('click',function(e){if(e.target===this)closeSearch();});}
function copyArticleLink(button){
  navigator.clipboard.writeText(location.href).then(function(){
    var original = button.textContent;
    button.textContent = "${isEn ? 'Copied' : 'Đã sao chép'}";
    setTimeout(function(){ button.textContent = original; }, 1800);
  });
}
</script>
<script defer src="/assets/search.js"></script>
<script defer src="/assets/enhance.js"></script>
<script defer src="/assets/engage.js?v=20260818b"></script>
<script defer src="/assets/supabase-client.js"></script>
<script defer src="/assets/otahub-community.js"></script>
</body>
</html>`;
}

// 1. Create Article Files
for (const art of articles) {
  const fileVi = `${art.slug}.html`;
  const fileEn = path.join('en', `${art.slug}.html`);

  const htmlVi = generateArticleHtml(art, false);
  const htmlEn = generateArticleHtml(art, true);

  fs.writeFileSync(fileVi, htmlVi, 'utf8');
  console.log(`[CREATED] ${fileVi}`);

  fs.writeFileSync(fileEn, htmlEn, 'utf8');
  console.log(`[CREATED] ${fileEn}`);
}

// 2. Fix news.html and en/news.html
function cleanAndUpdateNewsHub(filePath, isEn) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix broken gaming href in news.html if present
  content = content.replace(/<a href="gaming" /g, '<a href="/honkai-star-rail-fate-stay-night-unlimited-blade-works-crossover" ');

  // Remove existing cards of these articles if already added
  for (const art of articles) {
    const slug = isEn ? `/en/${art.slug}` : `/${art.slug}`;
    const cardRe = new RegExp(`<a href="${slug}"[\\s\\S]*?</a>\\s*`, 'g');
    content = content.replace(cardRe, '');
  }

  let newCardsHtml = '';
  for (const art of articles) {
    const slug = isEn ? `/en/${art.slug}` : `/${art.slug}`;
    const title = isEn ? art.titleEn : art.titleVi;
    const desc = isEn ? art.descEn : art.descVi;
    const cat = isEn ? art.catEn : art.cat;
    newCardsHtml += `\n    <a href="${slug}" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">
      <div style="position:relative;width:100%;height:180px;background:#0d051e;overflow:hidden;">
        <img src="${art.hero}" alt="${title.replace(/"/g, '&quot;')}" loading="lazy" width="1280" height="720" style="width:100%;height:100%;object-fit:cover;display:block;">
        <span style="position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#ff3080,#7c3aed);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:.15em;text-transform:uppercase;">${cat.toUpperCase()}</span>
      </div>
      <div style="padding:16px;">
        <h3 style="color:#ffffff;font-size:15px;font-weight:700;line-height:1.4;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${title}</h3>
        <p style="color:rgba(240,238,255,0.65);font-size:12.5px;line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${desc}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">
          <span>⚡ OtaHub News</span>
          <span>${isEn ? 'Just now' : 'Vừa xong'}</span>
        </div>
      </div>
    </a>`;
  }

  // Insert at grid top
  const gridMarker = /<!-- OTAHUB_NEW30_START -->[\s\S]*?<div style="display:grid;grid-template-columns:repeat\(auto-fill,minmax\(280px,1fr\)\);gap:18px">/;
  if (gridMarker.test(content)) {
    content = content.replace(gridMarker, (match) => match + newCardsHtml);
  }

  // Count total cards inside grid
  const totalCards = (content.match(/<a href="\/(?:en\/)?[a-z0-9-]+"/g) || []).length;
  content = content.replace(/(\d+)(\s+(?:tin mới đã kiểm chứng|verified updates))/, `${totalCards}$2`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[UPDATED] ${filePath} (Count: ${totalCards})`);
}
cleanAndUpdateNewsHub('news.html', false);
cleanAndUpdateNewsHub('en/news.html', true);

// 3. Fix category hubs
function updateCategoryHubs(isEn) {
  for (const art of articles) {
    const hubFile = isEn ? art.hubEn : art.hubVi;
    if (!fs.existsSync(hubFile)) continue;
    let content = fs.readFileSync(hubFile, 'utf8');
    const slug = isEn ? `/en/${art.slug}` : `/${art.slug}`;
    const title = isEn ? art.titleEn : art.titleVi;
    const cat = isEn ? art.catEn : art.cat;

    // Remove if already exists
    const existingRe = new RegExp(`\\s*<a href="${slug}" class="ac"[\\s\\S]*?</a>`, 'g');
    content = content.replace(existingRe, '');

    const cardHtml = `\n      <a href="${slug}" class="ac" data-cat="pc">
        <div class="ac-thumb"><img src="${art.hero}" alt="${title.replace(/"/g, '&quot;')}" loading="lazy" width="1280" height="720"><span class="tag">${cat}</span></div>
        <div class="ac-info"><div><div class="ac-top"><span class="tag">${cat}</span></div><div class="ac-title">${title}</div></div><div class="ac-meta"><span>OtaHub Editorial</span><span class="ac-meta-sep">·</span><span>${isEn ? 'Just now' : 'Hôm nay'}</span><span class="ac-meta-sep">·</span><span>5 min</span></div></div>
      </a>`;

    if (content.includes('<!-- ADMIN:ARTICLES_START -->')) {
      content = content.replace('<!-- ADMIN:ARTICLES_START -->', `<!-- ADMIN:ARTICLES_START -->${cardHtml}`);
    }
    fs.writeFileSync(hubFile, content, 'utf8');
    console.log(`[UPDATED] ${hubFile} with ${slug}`);
  }
}
updateCategoryHubs(false);
updateCategoryHubs(true);

console.log('ALL ARTICLES CLEANED & RE-GENERATED!');
