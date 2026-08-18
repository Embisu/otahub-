# Hướng Dẫn Thêm Bài Viết Mới — OtaHub (đọc trước khi thêm bất kỳ bài nào)

> Tài liệu này dành cho **bất kỳ ai/AI nào** (ChatGPT, Claude, hoặc người thật) thêm bài viết mới vào otahub-source. Làm đúng theo đây sẽ **không thể** gây ra lỗi lệch giao diện (nav thiếu link, màu nền lệch, mất dấu tiếng Việt, nút bấm không đồng bộ...) — những lỗi đã từng xảy ra khi bài viết được tạo bằng cách copy tay HTML.

## Vì sao lại có quy trình này

Trước đây, mỗi bài viết là 1 file HTML độc lập, ai thêm bài cũng phải copy tay toàn bộ nav/header/footer từ 1 bài cũ. Chỉ cần copy thiếu hoặc từ bản cũ hơn là bài mới bị lệch chuẩn ngay — và đã xảy ra nhiều lần (nút EN thừa, thiếu link Chuyên sâu, 23 bài mất dấu tiếng Việt...).

Từ giờ: nav, footer, CSS, script đã được tách ra `templates/partials/` — **KHÔNG ai đụng tay vào những file đó khi thêm bài**. Bạn chỉ viết nội dung bài, còn khung giao diện do `scripts/build.js` tự lắp ráp. Vì vậy không có gì để copy sai nữa.

## Quy tắc bắt buộc

1. **KHÔNG** tạo file `.html` bằng tay cho bài viết mới.
2. **KHÔNG** sửa trực tiếp các file trong `templates/partials/` trừ khi cố ý muốn đổi giao diện cho *toàn bộ* site (nav, footer...).
3. Bài viết mới = 1 file JSON trong `src/pages/`, đặt tên đúng theo slug URL, ví dụ bài ở `/mortal-shell-2-release` → file `src/pages/mortal-shell-2-release.json`.
4. Sau khi tạo/sửa file JSON, **phải chạy `node scripts/build.js --write`** để sinh ra file `.html` — không tự viết HTML.
5. Sau khi build, chạy `git diff` để soát lại trước khi commit.

## Các bước thêm 1 bài viết mới

1. Chọn slug (phần URL không dấu `/`), ví dụ: `elden-ring-dlc3-teaser`.
2. Tạo file `src/pages/elden-ring-dlc3-teaser.json` theo đúng schema bên dưới — **có dấu tiếng Việt đầy đủ trong toàn bộ nội dung**, không viết thiếu dấu.
3. Chạy:
   ```
   node scripts/build.js --only=elden-ring-dlc3-teaser
   ```
   (dry-run — chỉ xem trước, chưa ghi file gì cả)
4. Nếu ổn, chạy:
   ```
   node scripts/build.js --write --only=elden-ring-dlc3-teaser
   ```
   → sinh ra `elden-ring-dlc3-teaser.html` ở thư mục gốc.
5. Chạy `git diff elden-ring-dlc3-teaser.html` để xem lại toàn bộ.
6. Mở file `.html` vừa sinh ra bằng trình duyệt (hoặc deploy lên nhánh test) để kiểm tra hiển thị đúng trước khi commit.
7. Sau khi ổn: cập nhật thêm các nơi liên kết đến bài mới (nếu cần) — `index.html`/`news.html` (thẻ w-card), `feed.xml`, `sitemap.xml`, `assets/search.js` (mảng `IDX`) — các file này **chưa** nằm trong hệ thống build, vẫn sửa tay như trước.

## Schema đầy đủ (`src/pages/<slug>.json`)

Xem file mẫu đầy đủ, đã build thử và kiểm chứng đúng: **`src/pages/mortal-shell-2-release.json`**.

```jsonc
{
  "title": "Tiêu đề bài viết (có dấu đầy đủ)",
  "description": "Mô tả 140-160 ký tự cho SEO (có dấu đầy đủ)",
  "twitterDescription": "Mô tả riêng cho Twitter, có thể bỏ qua nếu giống description",
  "canonical": "/slug-cua-bai",
  "ogImage": "https://otahub.asia/assets/img/xxxxx-ten-anh.jpg",
  "publishedTime": "2026-08-18T22:00:00+07:00",
  "modifiedTime": "2026-08-18T22:00:00+07:00",
  "section": "Gaming",              // Gaming | Anime | Manga | Reviews
  "activeSection": "gaming",         // choi-gi | gaming | anime | manga | reviews | rankings | chuyen-sau — PHẢI khớp đúng chuyên mục thật của bài
  "breadcrumbSection": "Gaming",
  "breadcrumbSectionUrl": "/gaming",
  "heroImage": "/assets/img/xxxxx-ten-anh.jpg",
  "heroTitle": "Tiêu đề hiển thị trong hero (thường giống title)",
  "heroExcerpt": "Câu mô tả ngắn dưới tiêu đề hero",
  "metaDate": "2026-08-18",
  "metaReadTime": "5 phút đọc",
  "summaryLabel": "Tóm Tắt",
  "summaryText": "Đoạn tóm tắt, được phép chứa thẻ <strong> để in đậm",
  "keywords": "từ khóa 1, từ khóa 2, từ khóa 3",
  "bodyHtml": "Toàn bộ nội dung bài, viết bằng HTML: <p>...</p><h2>...</h2><figure><img ...><figcaption>...</figcaption></figure>...",
  "relatedArticles": [
    { "url": "/bai-lien-quan-1", "img": "/assets/img/....jpg", "alt": "Mô tả ảnh", "width": 1920, "height": 850, "cat": "Gaming", "title": "Tiêu đề bài liên quan" }
  ],
  "tags": [
    { "url": "/reviews", "label": "Tên tag" }
  ]
}
```

### Lưu ý khi viết `bodyHtml`

- Đây là HTML thật (không phải Markdown), viết y như các bài hiện có: `<p>`, `<h2>`, `<h3>`, `<strong>`, `<ul><li>`, `<figure><img><figcaption>`, `<blockquote>`.
- Ảnh trong bài: dùng đường dẫn `/assets/img/...` đã tải về local, KHÔNG link ảnh ngoài (theo đúng chuẩn OtaHub đã áp dụng từ trước).
- **Bắt buộc có dấu tiếng Việt đầy đủ** trong mọi đoạn văn, tiêu đề — đây chính là lỗi đã xảy ra ở 23 bài cũ, không lặp lại.

## Điều KHÔNG được làm

- Không viết file `.html` tay cho bài viết mới.
- Không copy nav/footer từ bài khác dán vào đâu đó — hệ thống partial đã lo việc này.
- Không đổi `templates/partials/*` để "tiện" cho riêng 1 bài — partial là dùng chung cho toàn site, đổi ở đó ảnh hưởng mọi bài viết.
- Không bỏ qua bước `git diff` trước khi commit.

## Với trang KHÔNG phải bài viết (hub, detail...)

Hệ thống build hiện tại (Giai đoạn 2-3) mới áp dụng cho **trang bài viết** (article template). Trang hub (`gaming.html`, `anime.html`...) và trang detail (`game-detail.html`...) vẫn sửa tay như cũ cho tới khi được tách partial riêng ở đợt sau (xem `KE-HOACH-TEMPLATE-HOA.md`, Giai đoạn 5).
