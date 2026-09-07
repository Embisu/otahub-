# ?? OtaHub Design System & Article Template Guide

*Phiên b?n: 2.0 (Tháng 9/2026)*  
*Chu?n giao di?n: Cyberpunk Dark Neon / Glassmorphism*

---

## 1. H? Th?ng Màu S?c & Typography

### B?ng Màu Chính (CSS Variables)
T?t c? các bài vi?t d?u n?p file stylesheet chung [`/assets/article-style.css`](file:///d:/ANBU%202/WEBSITE/otahub-source/assets/article-style.css):

```css
:root {
  --bg: #0b0418;          /* Màu n?n t?i sâu */
  --surf: #150a2c;        /* Màu n?n card c?p 1 */
  --surf2: #1d1040;       /* Màu n?n card c?p 2 / Hover */
  --card: #190c36;        /* Màu n?n khung n?i dung */
  --cyan: #00e5ff;        /* Màu nh?n Neon Cyan (Tech/Action) */
  --sakura: #ff3080;      /* Màu nh?n Neon Pink Sakura (Anime/Hot) */
  --violet: #7c3aed;      /* Màu tím thuong hi?u */
  --lav: #a78bfa;         /* Màu tím nh?t Lavender */
  --amber: #fbbf24;       /* Màu vàng c?nh báo / Ðánh giá sao */
  --green: #34d399;       /* Màu xanh lá thành công / Online */
  --white: #f0eeff;       /* Màu ch? chính */
  --dim: rgba(240,238,255,.72);  /* Màu ch? ph? / Ðo?n van */
  --muted: rgba(240,238,255,.38);/* Màu ch? m? / Metadata */
  --border: rgba(255,255,255,.07);/* Ðu?ng vi?n m? */
  --bcyan: rgba(0,229,255,.18);  /* Ðu?ng vi?n Neon Cyan */
}
```

### Font Ch?
- **Tiêu d? & Thuong hi?u**: `Rajdhani`, sans-serif (Tr?ng s? 500, 600, 700).
- **Thân bài & Ðo?n van**: `Space Grotesk`, sans-serif (Tr?ng s? 300, 400, 500, 600).

---

## 2. C?u Trúc Khung Bài Vi?t Chu?n (Standard Layout)

M?i trang bài vi?t trên OtaHub d?u tuân theo mô hình **Hero Full-Bleed + 2 C?t (N?i dung chính + Sidebar c? d?nh)**:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <!-- 1. Metadata SEO & Hreflang & Canonical -->
  <title>Tiêu Ð? Bài Vi?t · OtaHub</title>
  <link rel="canonical" href="https://otahub.asia/[slug]">
  <link rel="alternate" hreflang="vi" href="https://otahub.asia/[slug]">
  <link rel="alternate" hreflang="en" href="https://otahub.asia/en/[slug]">
  <link rel="alternate" hreflang="x-default" href="https://otahub.asia/[slug]">
  
  <!-- 2. Schema JSON-LD E-E-A-T (NewsArticle) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Tiêu Ð? Bài Vi?t",
    "description": "Mô t? ng?n chu?n SEO 120-160 ký t?",
    "image": "https://otahub.asia/assets/img/[ten-anh].jpg",
    "datePublished": "2026-09-06T08:30:00+07:00",
    "dateModified": "2026-09-06T08:30:00+07:00",
    "inLanguage": "vi",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://otahub.asia/[slug]" },
    "author": {
      "@type": "Person",
      "name": "OtaHub Editorial",
      "url": "https://otahub.asia/about",
      "jobTitle": "Ban Biên T?p",
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
  
  <!-- 3. Stylesheet dùng chung -->
  <link rel="stylesheet" href="/assets/article-style.css">
  
  <!-- 4. Breadcrumb Schema -->
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Trang ch?","item":"https://otahub.asia/"},{"@type":"ListItem","position":2,"name":"Anime","item":"https://otahub.asia/anime"},{"@type":"ListItem","position":3,"name":"Tiêu Ð?","item":"https://otahub.asia/[slug]"}]}</script>
</head>
<body>
  <!-- Header / Nav -->
  <!-- Ambient Lighting & Hero Section -->
  <header class="art-hero">
    <div class="art-hero-bg" style="background-image: url('assets/img/[ten-anh].jpg');"></div>
    <div class="art-hero-in">
      <div class="art-hero-tags">
        <a class="am-tag" href="/anime">Anime</a>
        <a class="am-tag" href="/tag?q=MAPPA">MAPPA</a>
      </div>
      <h1 class="art-hero-title">Tiêu Ð? Bài Vi?t</h1>
      <p class="art-hero-excerpt">Ðo?n tóm lu?c m? d?u n?i b?t.</p>
      <div class="art-hero-meta">
        <span>?? 06/09/2026</span>
        <span>?? Ban Biên T?p OtaHub</span>
        <span>?? 4 phút d?c</span>
      </div>
    </div>
  </header>

  <!-- Khung 2 c?t -->
  <div class="art-layout">
    <main class="art-main">
      <!-- Kh?i Tóm t?t di?m nh?n -->
      <div class="highlight-box">
        <div class="hb-label">? Tóm T?t Ði?m Nh?n</div>
        <div class="hb-text">
          <ul>
            <li>Ý chính th? nh?t...</li>
            <li>Ý chính th? hai...</li>
            <li>Ý chính th? ba...</li>
          </ul>
        </div>
      </div>

      <!-- Thân bài vi?t -->
      <article class="art-body">
        <h2>1. Tiêu Ð? Phân Ðo?n 1</h2>
        <p>N?i dung phân tích chi ti?t...</p>
        
        <!-- ?nh có chú thích -->
        <figure class="art-fig">
          <img src="assets/img/[ten-anh].jpg" alt="Mô t? ?nh chi ti?t chu?n SEO" width="1200" height="675" loading="lazy">
          <figcaption>Chú thích ?nh minh h?a b?n quy?n.</figcaption>
        </figure>

        <!-- B?ng thông tin (n?u có) -->
        <table class="info-table">
          <tr><th>Thông S?</th><th>Chi Ti?t</th></tr>
          <tr><td>Studio S?n Xu?t</td><td>MAPPA / Wit Studio</td></tr>
          <tr><td>Ngày Phát Sóng</td><td>Tháng 10/2026</td></tr>
        </table>
      </article>

      <!-- H? th?ng Tag cu?i bài -->
      <div class="art-tags-row">
        <span class="atr-label">Ch? d?:</span>
        <a class="tag" href="/tag?q=Solo+Leveling">Solo Leveling</a>
        <a class="tag" href="/tag?q=Aniplex">Aniplex</a>
      </div>
    </main>

    <!-- Sidebar c? d?nh -->
    <aside class="art-sidebar">
      <div class="sidebar-block">
        <div class="sb-title">?? Tin M?i Ðáng Chú Ý</div>
        <div class="sb-list">
          <!-- Danh sách bài liên quan -->
        </div>
      </div>
      <div class="sidebar-block">
        <div class="sb-title">??? Tag N?i B?t</div>
        <div class="sb-tags">
          <a class="sb-tag" href="/tag?q=Anime+2026">Anime 2026</a>
          <a class="sb-tag" href="/tag?q=Souls-like">Souls-like</a>
          <a class="sb-tag" href="/tag?q=Shonen+Jump">Shonen Jump</a>
        </div>
      </div>
    </aside>
  </div>
</body>
</html>
```

---

## 3. Quy T?c Dynamic Tag Routing (`/tag?q=...`)
- Toàn b? các class th? tag (`.tag`, `.sb-tag`, `.am-tag`, `.art-tag`) d?u t? d?ng kích ho?t JavaScript routing thông qua [`/assets/enhance.js`](file:///d:/ANBU%202/WEBSITE/otahub-source/assets/enhance.js).
- B?m vào b?t k? th? tag nào s? d?n th?ng t?i trang khám phá [`/tag?q=[t?_khóa]`](file:///d:/ANBU%202/WEBSITE/otahub-source/tag.html) v?i b? l?c th?i gian th?c.
