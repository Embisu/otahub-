# 🎮 OtaHub — Lộ Trình Phát Triển Dài Hạn

> **Mục tiêu:** Xây dựng OtaHub thành hub tin tức Gaming & Anime hàng đầu tiếng Việt, lên top Google, có traffic ổn định và có thể monetize.

---

## Tổng quan các giai đoạn

```
Giai đoạn 1 (Tháng 1–2)   → LAUNCH   : Domain + Deploy + Analytics
Giai đoạn 2 (Tháng 2–4)   → CONTENT  : CMS + Viết bài + SEO on-page
Giai đoạn 3 (Tháng 4–8)   → GROWTH   : Link building + Social + Automation
Giai đoạn 4 (Tháng 8–12)  → SCALE    : Monetize + Hiring + Tech upgrade
```

---

## GIAI ĐOẠN 1 — LAUNCH (Tháng 1–2)

### 1.1 Domain & Hosting

| Việc cần làm | Công cụ | Chi phí | Ưu tiên |
|---|---|---|---|
| Mua `otahub.asia` | Mắt Bão | ~350k₫/năm | 🔴 Ngay bây giờ |
| Trỏ nameserver về Cloudflare | Cloudflare (free) | 0₫ | 🔴 Ngay sau mua domain |
| Deploy HTML lên Cloudflare Pages | Cloudflare Pages (free) | 0₫ | 🔴 Sau khi có domain |
| Bật SSL/TLS (tự động) | Cloudflare | 0₫ | ✅ Tự động |
| Setup email `hi@otahub.asia` | Cloudflare Email Routing → Gmail | 0₫ | 🟡 Tuần đầu |

**Các bước cụ thể để deploy:**
```
1. Vào dash.cloudflare.com → Add site → nhập otahub.asia
2. Cloudflare cho bạn 2 nameserver (ví dụ: ns1.cloudflare.com)
3. Vào Mắt Bão → quản lý domain → đổi nameserver sang của Cloudflare
4. Chờ 24-48h để DNS lan truyền
5. Cloudflare Pages → Create project → Upload folder "WEB TIN TUC GAME"
6. Custom domain → nhập otahub.asia → Done
```

### 1.2 Analytics & Search Console

| Việc cần làm | Công cụ | Chi phí |
|---|---|---|
| Cài Google Analytics 4 | GA4 (free) | 0₫ |
| Xác minh Google Search Console | GSC (free) | 0₫ |
| Submit sitemap.xml | GSC | 0₫ |
| Cài Cloudflare Web Analytics | Cloudflare (free) | 0₫ |

**Thêm GA4 vào mỗi trang HTML:**
```html
<!-- Dán vào trước </head> trên tất cả trang -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## GIAI ĐOẠN 2 — CONTENT (Tháng 2–4)

### 2.1 Setup CMS (Sanity)

Sanity là hệ thống quản lý nội dung — cho phép viết bài không cần chỉnh code HTML.

```
Cài đặt một lần:
1. Tạo tài khoản tại sanity.io (free)
2. Tạo project "otahub"
3. Tạo schema: post (title, slug, category, thumbnail, body, author, publishedAt)
4. Viết bài trên Sanity Studio → bài tự có URL /bai-viet/[ten-bai]
5. Kết nối với Cloudflare Workers để render bài viết
```

**Schema bài viết (Sanity):**
```js
// Schema cho 1 bài tin tức
{
  name: 'post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },           // Tiêu đề SEO
    { name: 'slug', type: 'slug' },              // URL: /bai-viet/[slug]
    { name: 'category', type: 'string',          // game | anime | manga | review
      options: { list: ['game','anime','manga','review'] } },
    { name: 'thumbnail', type: 'image' },        // Ảnh đại diện (tự optimize)
    { name: 'excerpt', type: 'text' },           // Mô tả ngắn (cho SEO + card)
    { name: 'body', type: 'array',               // Nội dung bài viết
      of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'author', type: 'string' },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'seoDescription', type: 'text' },    // Meta description riêng
    { name: 'featured', type: 'boolean' }        // Ghim lên trang chủ
  ]
}
```

### 2.2 Chiến lược nội dung để lên top Google

**Nguyên tắc quan trọng nhất:** Google ưu tiên bài viết **có chiều sâu, chuyên biệt, cập nhật đều**.

#### Loại bài ưu tiên viết:

**🔥 Bài "Evergreen" (traffic mãi mãi):**
```
- "Top 10 game mobile RPG hay nhất 2025 cho Android/iOS"
- "Anime isekai hay nhất mọi thời đại — xếp hạng theo điểm MAL"
- "Manga shounen nên đọc trước khi xem anime"
- "Genshin Impact vs Wuthering Waves — so sánh chi tiết"
```

**📰 Bài "News" (traffic tức thì, cần nhanh):**
```
- "One Piece chap XXX: Luffy [spoiler nhẹ]"
- "[Tên game] ra mắt server VN — ngày giờ, cách tải"
- "Anime mùa hè 2025 — lịch phát sóng đầy đủ"
```

**📊 Bài "Data/Ranking" (backlink tự nhiên):**
```
- "Bảng xếp hạng game mobile VN tháng X/2025 — theo lượt tải"
- "Top anime được xem nhiều nhất tuần này tại VN"
```

**Lịch đăng bài gợi ý:**
```
Tháng 1-2:  2 bài/tuần (tập trung evergreen, build nền)
Tháng 3-4:  3-4 bài/tuần (thêm news + review)
Tháng 5+:   5-7 bài/tuần (daily nếu có thể)
```

### 2.3 SEO On-page cho mỗi bài viết

**Checklist trước khi đăng:**
```
□ Title có keyword chính, ≤60 ký tự
□ Meta description 140-160 ký tự, có CTA nhẹ
□ H1 = Title, H2 chia sections rõ ràng
□ Ảnh thumbnail: 1200×630px, alt text có keyword
□ URL slug ngắn: /bai-viet/genshin-impact-vs-wuthering-waves
□ Internal link: liên kết 2-3 bài liên quan trong nội dung
□ Schema NewsArticle đã có (tự động qua Cloudflare Worker)
□ Bài ≥800 từ (tốt nhất 1500-2000 từ cho evergreen)
```

---

## GIAI ĐOẠN 3 — GROWTH (Tháng 4–8)

### 3.1 Social Media

| Kênh | Mục đích | Tần suất |
|---|---|---|
| Facebook Page | Share bài viết, news nhanh | 2-3 post/ngày |
| Facebook Group | Community, tương tác, hỏi đáp | Moderate daily |
| TikTok | Clip ngắn review game/anime | 3-4 video/tuần |
| YouTube | Review dài, unboxing, gameplay | 1-2 video/tuần |
| Discord | Community VIP, thông báo sớm | Live |

**Công thức tăng trưởng nhanh nhất cho game/anime VN:**
```
Facebook Group chất lượng → dẫn về website → SEO tăng dần
TikTok/Reels viral → follower → traffic spike
Collab với streamer nhỏ → mention → backlink tự nhiên
```

### 3.2 Link Building (tăng Domain Authority)

**Cách lấy backlink miễn phí:**
```
1. Guest post trên các blog tech/anime VN khác
2. Comment chuyên sâu trên các diễn đàn (voz.vn, tinhte.vn, gamek.vn)
   → Đặt link tự nhiên, không spam
3. Tạo infographic ranking → chia sẻ free → người khác embed
4. Liên hệ fansite anime/game nhỏ để trao đổi link
5. Submit lên các trang tổng hợp tin công nghệ VN
```

### 3.3 Tự động hóa Rankings

Thay vì cập nhật HTML tay, dùng Google Sheets làm database:

```
Google Sheets → Cloudflare Worker fetch → rankings.html render tự động
```

**Bước setup:**
```
1. Tạo Google Sheet "Rankings OtaHub" với các cột:
   rank | name | score | trend | category | image_url | last_updated
   
2. Publish sheet (File → Share → Publish to web → CSV)

3. Trong rankings.html, thay data JS tĩnh bằng:
   fetch('https://docs.google.com/spreadsheets/d/[ID]/export?format=csv')
   .then(r => r.text())
   .then(csv => renderFromCSV(csv))

4. Mỗi tuần chỉ cần mở Google Sheets, sửa điểm → web tự cập nhật
```

---

## GIAI ĐOẠN 4 — SCALE (Tháng 8–12)

### 4.1 Monetize

**Giai đoạn đầu (traffic <10k/tháng):**
```
- Google AdSense (apply sau khi có 50+ bài, traffic thực)
- Affiliate: Garena top-up, Steam key, merchandise anime
- Sponsored post: liên hệ các game publisher VN nhỏ
```

**Giai đoạn giữa (traffic 10k-100k/tháng):**
```
- Direct ads với game publisher (500k-2tr₫/banner/tháng)
- Ezoic / Mediavine (RPM cao hơn AdSense 3-5x)
- Discord Premium membership (nội dung exclusive)
- Newsletter trả phí (early access review, spoiler)
```

**Giai đoạn lớn (traffic >100k/tháng):**
```
- Brand deal với publisher lớn (VNG, Garena, Nexon VN)
- Tổ chức event online (tournament, quiz, giveaway sponsored)
- Merch OtaHub (áo, sticker, poster)
```

### 4.2 Tech Upgrade khi cần

| Khi nào cần | Nâng cấp gì | Chi phí |
|---|---|---|
| >500 bài viết | Migration sang Astro SSG | 0₫ (tự làm) |
| >50k traffic/tháng | Cloudflare Pro plan | ~$20/tháng |
| Cần search nội dung | Algolia free tier | 0₫ |
| Cần comments | Disqus free / Giscus | 0₫ |
| Cần newsletter | Brevo (300 email/ngày free) | 0₫ |
| >1000 bài | Postgres thay D1 | Neon free: 0₫ |

---

## Stack tổng thể (Miễn phí hoàn toàn đến ~100k traffic/tháng)

```
Domain:     otahub.asia tại Mắt Bão           ~350k₫/năm
DNS:        Cloudflare DNS                     FREE
Hosting:    Cloudflare Pages                   FREE
CDN:        Cloudflare CDN (tự động)           FREE
SSL:        Cloudflare SSL                     FREE
CMS:        Sanity.io (free tier)              FREE
Backend:    Cloudflare Workers                 FREE (100k req/ngày)
Database:   Cloudflare D1 (SQLite)            FREE (5GB)
Storage:    Cloudflare R2                      FREE (10GB)
Email:      Cloudflare Email → Gmail           FREE
Analytics:  Google Analytics 4                 FREE
Search:     Google Search Console              FREE
──────────────────────────────────────────────────────
TỔNG CHI PHÍ NĂM ĐẦU:                        ~350.000₫
```

---

## KPI theo dõi hàng tháng

| Metric | Tháng 3 | Tháng 6 | Tháng 12 |
|---|---|---|---|
| Bài viết đã đăng | 20 | 60 | 150+ |
| Organic traffic/tháng | 500 | 3,000 | 15,000+ |
| Keywords top 10 Google | 5 | 20 | 80+ |
| Domain Authority | 5 | 12 | 20+ |
| Facebook Page likes | 500 | 2,000 | 8,000+ |
| Revenue/tháng | 0₫ | 500k₫ | 3-5tr₫ |

---

## Checklist trước khi Go-Live (Tuần này)

```
□ Mua domain otahub.asia tại matbao.net
□ Tạo tài khoản Cloudflare tại dash.cloudflare.com
□ Thêm domain vào Cloudflare → lấy nameserver
□ Cập nhật nameserver tại Mắt Bão
□ Tạo Cloudflare Pages project → upload folder
□ Setup custom domain trong Pages
□ Tạo Google Analytics 4 → thêm tracking code vào tất cả trang
□ Xác minh Google Search Console
□ Submit sitemap: https://otahub.asia/sitemap.xml
□ Test tất cả trang trên mobile
□ Test tốc độ tại pagespeed.web.dev
```

---

*Cập nhật lần cuối: tháng 6/2026 — OtaHub v1.0 pre-launch*
