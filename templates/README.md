# Templates — Giai đoạn 2

Partial đầu tiên được tách: **trang bài viết** (article template, ~90+ file loại này, cũng là nhóm lỗi nhiều nhất khi audit). Trang hub (`gaming.html`...) và trang detail (`game-detail.html`...) dùng CSS/nav-r khác, sẽ tách ở đợt sau theo đúng phương pháp này.

## Các partial đã tách (`templates/partials/`)

| File | Nội dung | Biến cần điền |
|---|---|---|
| `article-nav.html` | Nav + mobile nav | `{{ACTIVE_*}}` — đánh dấu mục đang active |
| `article-footer.html` | Footer | Không có biến, cố định 100% |
| `article-scripts.html` | Script cuối trang (toggleMob, copyArticleLink, search/enhance/engage) | Không có biến |
| `article-head-boilerplate.html` | Phần `<head>` cố định (font, manifest, GA4, favicon, RSS) | Không có biến |
| `article-style.css` | Toàn bộ CSS trang bài viết | Không có biến |

Xác nhận cách trích: so 2 file thật (`frieren-season2.html` — bài cũ, `mortal-shell-2-release.html` — bài mới) byte-by-byte, phần nav/footer/CSS giống hệt nhau → an toàn tách dùng chung.

## Biến còn lại — vẫn riêng từng trang, build.js (Giai đoạn 3) sẽ lắp ráp

```
{{TITLE}}                 — <title> + og:title + twitter:title
{{DESCRIPTION}}            — meta description + og:description
{{CANONICAL}}               — URL không domain, ví dụ /mortal-shell-2-release
{{OG_IMAGE}}                 — URL ảnh đầy đủ
{{PUBLISHED_TIME}} / {{MODIFIED_TIME}}  — ISO 8601
{{SECTION}}                   — Gaming | Anime | Manga | Reviews
{{JSONLD_ARTICLE}}             — khối NewsArticle schema
{{JSONLD_BREADCRUMB}}           — khối BreadcrumbList schema
{{ACTIVE_SECTION}}               — dùng để chọn {{ACTIVE_*}} trong article-nav.html
{{HERO_IMAGE}} / {{HERO_TITLE}} / {{HERO_EXCERPT}}
{{BREADCRUMB_SECTION}} / {{BREADCRUMB_TITLE}}
{{META_DATE}} / {{META_READ_TIME}}
{{SUMMARY_LABEL}} / {{SUMMARY_TEXT}}     — khối "Tóm Tắt"
{{BODY}}                          — toàn bộ <article class="art-body">...</article>
{{RELATED_ARTICLES}}               — 3 thẻ "Bài liên quan"
{{TAGS}}                            — danh sách tag
{{SHARE_URL}} / {{SHARE_TEXT}}
```

## Phát hiện thêm trong lúc trích xuất (ghi lại để xử lý ở Giai đoạn 3/5)

1. **`frieren-season2.html` sai category**: nav highlight "Gaming" và breadcrumb ghi "Gaming", nhưng đây là bài Anime (Frieren). Cần sửa `{{ACTIVE_SECTION}}` = anime, `{{SECTION}}` = Anime khi migrate bài này.
2. **2 cách cài "Sao chép link" khác nhau đang tồn tại song song**: bài cũ dùng hàm `copyArticleLink()` khai báo riêng ở cuối trang, bài mới viết JS trực tiếp trong `onclick`, text phản hồi cũng khác nhau ("Đã sao chép" vs "Đã copy!"). Đã chuẩn hoá về 1 phiên bản duy nhất trong `article-scripts.html`.
3. **Giai đoạn 1 (sửa dấu) mới xong một phần**: các nhãn UI nhỏ (Tóm Tắt, X phút đọc, footer nav) đã có dấu, nhưng **phần thân bài** (đoạn văn, heading H2) của các bài cũ như `frieren-season2.html` vẫn còn nguyên không dấu. Cần rà lại khi migrate nhóm bài viết ở Giai đoạn 5.
