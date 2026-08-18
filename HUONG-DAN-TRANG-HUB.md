# Hướng Dẫn Trang Hub — OtaHub (đọc trước khi sửa index/gaming/anime/manga/reviews/rankings/choi-gi/chuyen-sau)

> Dành cho ChatGPT, Claude, hoặc người thật khi cần sửa 8 trang hub. Đọc kỹ phần "Được sửa gì / Không được sửa gì" bên dưới trước khi đụng vào các trang này.

## 8 trang hub là gì

`index.html`, `gaming.html`, `anime.html`, `manga.html`, `reviews.html`, `rankings.html`, `choi-gi.html`, `chuyen-sau.html`.

Khác với **trang bài viết** (xem `HUONG-DAN-THEM-BAI.md`), 8 trang này **KHÔNG** dùng chung 1 template — mỗi trang có bảng màu riêng (gaming = cyan, anime = sakura, manga = lavender...), layout riêng, nội dung card/grid riêng. Đây là thiết kế cố ý, không phải lỗi, nên **không** gộp toàn bộ trang thành 1 hệ thống build như trang bài viết.

Chỉ có 2 phần **THẬT SỰ phải giống nhau tuyệt đối** giữa 8 trang: **nav (thanh điều hướng đầu trang)** và **footer (chân trang)**. Trước đây 2 phần này bị lệch dần qua nhiều lần sửa tay (thiếu link, sai class, nút tìm kiếm không bấm được, nút tìm kiếm bị nhân đôi...). Giai đoạn 5 (18/8/2026) đã đồng bộ lại — xem chi tiết lỗi đã sửa trong `templates/partials/hub-nav.html`.

## Được sửa gì / Không được sửa gì

**ĐƯỢC sửa trực tiếp trong từng file `.html`:**
- CSS theme riêng của trang (màu sắc, `<style>` phần lớn nội dung).
- Nội dung card/grid, hero, danh sách bài, filter, script riêng của trang.
- Bất kỳ phần nào KHÔNG nằm trong `<nav class="nav">...</nav>`, `<div class="mobile-nav" id="mobileNav">...</div>`, hoặc `<footer>...</footer>`.

**KHÔNG được sửa tay trực tiếp** (sửa xong sẽ bị ghi đè lần chạy script tiếp theo, và gây lệch lại giữa các trang):
- Bên trong `<nav class="nav">...</nav>` — sửa ở `templates/partials/hub-nav.html`.
- Bên trong `<div class="mobile-nav" id="mobileNav">...</div>` — sửa ở `templates/partials/hub-nav.html`.
- Bên trong `<footer>...</footer>` — sửa ở `templates/partials/hub-footer.html`.

## Cách sửa nav hoặc footer cho cả 8 trang

1. Sửa `templates/partials/hub-nav.html` (nav + mobile nav) hoặc `templates/partials/hub-footer.html` (footer). Cả 2 file đều là HTML thuần, có token `{{ACTIVE_CHOI_GI}}`, `{{ACTIVE_GAMING}}`, `{{ACTIVE_ANIME}}`, `{{ACTIVE_MANGA}}`, `{{ACTIVE_REVIEWS}}`, `{{ACTIVE_RANKINGS}}`, `{{ACTIVE_CHUYEN_SAU}}` — script sẽ tự thay bằng `class="active"` đúng trang.
2. Nếu cần thêm CSS mới cho phần vừa sửa (ví dụ đổi màu, thêm class mới), thêm rule vào `templates/partials/hub-chrome-inject.css`. Script chỉ tự chèn CSS này vào trang nào **CHƯA CÓ** class đó (kiểm tra qua `.ft-in{` và `.nsearch{`) — nếu đã có rồi thì giữ nguyên CSS gốc của trang, không chèn trùng.
3. Chạy dry-run trước để xem trước những gì sẽ đổi (không ghi file gì cả):
   ```
   node scripts/build-hub-chrome.js
   ```
4. Nếu ổn, ghi thật:
   ```
   node scripts/build-hub-chrome.js --write
   ```
5. **Bắt buộc** chạy `git diff <tên-file>.html` cho từng trang để soát lại — script chỉ nên đổi phần nav/mobile-nav/footer/CSS-mới-chèn, nếu thấy diff động vào chỗ khác (card, nội dung bài) thì dừng lại, đừng commit.

## Lưu ý kỹ thuật quan trọng: line ending

Repo này dùng **LF** (Unix line ending) cho toàn bộ file `.html`, khớp với những gì đã commit lên Git. Nếu bạn sửa file bằng công cụ trên Windows (Notepad, một số editor mặc định), file có thể tự chuyển sang **CRLF**, khiến `git diff` hiện ra hàng nghìn dòng thay đổi giả (dù nội dung thực tế không đổi gì mấy) — rất khó soát lại. Nếu gặp tình trạng này, chuẩn hoá lại bằng lệnh:
```
sed -i 's/\r$//' ten-file.html
```
(hoặc dùng `dos2unix ten-file.html` nếu có sẵn) trước khi `git diff`/commit.

## Nếu cần thêm 1 trang hub mới (ví dụ trang chuyên mục thứ 9)

Hệ thống hiện tại có danh sách 8 trang cố định trong `scripts/build-hub-chrome.js` (biến `PAGES`). Muốn thêm trang mới:
1. Tạo file `.html` mới, copy cấu trúc `<nav>`/`<div class="mobile-nav">`/`<footer>` giống các trang khác (hoặc để trống rồi chạy script — script sẽ báo lỗi "không tìm thấy" nếu thiếu, cứ thêm khung rỗng theo mẫu 1 trang có sẵn).
2. Thêm 1 dòng vào mảng `PAGES` trong `scripts/build-hub-chrome.js`, ví dụ:
   ```js
   { file: 'trang-moi.html', activeSection: 'trang-moi' },
   ```
3. Nếu `trang-moi` là chuyên mục mới chưa có trong nav, cần sửa thêm `templates/partials/hub-nav.html` để thêm `<li>` mới với token `{{ACTIVE_TRANG_MOI}}`, và thêm `'trang-moi'` vào mảng `NAV_SECTIONS` trong `build-hub-chrome.js` — lúc đó **tất cả 8 trang cũ cũng sẽ có thêm link mới này**, cân nhắc kỹ trước khi làm.

## Việc CHƯA làm ở giai đoạn này (không nằm trong phạm vi hub-nav/hub-footer)

- CSS theme riêng, nội dung card/grid của từng trang hub — vẫn sửa tay như trước, không có hệ thống build.
- Trang detail (`game-detail.html`, `anime-detail.html`, `manga-detail.html`) — chưa đụng tới.
- Thư mục `en/` (bản tiếng Anh) — chưa đụng tới, vẫn còn lỗi lệch giao diện tương tự đã từng thấy ở bản tiếng Việt cũ.
