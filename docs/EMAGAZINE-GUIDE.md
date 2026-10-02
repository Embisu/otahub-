# Form E-Magazine OtaHub (KHÓA CỨNG)

E-Magazine là trang chuyên đề dài, nhiều hình, dùng cho các sự kiện lớn: đếm ngược ngày ra mắt, tổng hợp một tựa game, mùa anime, giải đấu... Mẫu đầu tiên: **Đếm ngược GTA 6** (`src/emag/gta6.mjs`, trang `/dem-nguoc-gta-6` và `/en/gta-6-countdown`).

> **Quy tắc số 1: không viết HTML tay cho e-magazine.** Chỉ viết spec trong `src/emag/<slug>.mjs`, rồi chạy `npm run emag`. Bố cục, màu, hiệu ứng, SEO, mục lục, tin tổng hợp đều do bộ dựng sinh ra, nên mọi e-magazine luôn đồng nhất.

## Các file thuộc form (đừng sửa nếu chỉ làm nội dung)

| File | Vai trò |
|---|---|
| `src/emag/<slug>.mjs` | **Spec nội dung** (VI + EN). Việc duy nhất bạn cần sửa. |
| `assets/emag.css`, `assets/emag.js` | Giao diện và hành vi dùng chung. Sửa = đổi chuẩn cho mọi e-magazine. |
| `scripts/emag/build.mjs` | Bộ dựng: kiểm tra spec, sinh 2 trang, đăng ký sitemap + `assets/search.js`. |
| `scripts/emag/validate.mjs` | **Bộ quy tắc cứng.** Spec vi phạm thì không sinh trang. |
| `scripts/emag/parts.mjs` | Hàm thoát HTML, bộ biểu tượng cho khối `facts`. |

Menu, footer, GA, font lấy trực tiếp từ bài mẫu (`scripts/emag/build.mjs`, hằng `TEMPLATE`) rồi `scripts/sync-site-chrome.mjs` đồng bộ lại, nên luôn khớp phần còn lại của site.

## Tạo e-magazine mới (5 bước)

1. Sao chép `src/emag/gta6.mjs` thành `src/emag/<slug-moi>.mjs`, đổi `slug`, `theme`, `countdown`, `newsMatch`, `official`, `searchImg`.
2. Viết nội dung **cả hai ngôn ngữ** (`pages.vi` và `pages.en`) với cùng danh sách khối (cùng loại, cùng `id`, cùng thứ tự). Có thể bỏ khối không cần, trừ các khối bắt buộc bên dưới.
3. Ảnh: chỉ dùng ảnh **đã có trong `assets/img/`** (không link ảnh ngoài, không tự tải ảnh nếu chưa được phép). Ảnh mới thêm vào `assets/img/<slug>/`.
4. Chạy `npm run emag:check` cho tới khi hết lỗi, rồi `npm run emag` để sinh trang.
5. Soát trên trình duyệt (desktop + điện thoại), chạy `node scripts/audit-public-html-safety.mjs`, commit và push.

Cập nhật về sau: sửa spec (nhớ đổi `updated` và `ui.date`), chạy lại `npm run emag`.

## Khối được phép (thứ tự chuẩn)

`intro` (bắt buộc đầu tiên) → `guides` → `facts` → `banner` → `timeline` → `people` → `regions` → `features` → `gallery` → `tabs` → `banner` → `editions` → `videos` → `history` → `todo` → `faq` (bắt buộc) → `news` (bắt buộc) → `cta` → `sources` (bắt buộc cuối cùng).

- `banner`: dải ảnh toàn chiều ngang xen giữa các chương để tạo nhịp (`img`, `h` có thể chứa `<em>`, tùy chọn `p`, `btn`, `credit`). Không có `id`/`nav`, không đánh số chương. Ảnh 2400 × 800 px là đẹp nhất.
- `facts`: lưới 4 cột, mỗi ô chiếm 1 cột hoặc 2 cột nếu `wide: true`; các hàng phải đầy (bộ kiểm tra sẽ báo hàng bị hụt). `hl: true` tô nổi ô đầu, `days: true` thêm nhãn "Còn N ngày" tự cập nhật.
- `timeline`: mỗi mốc có `kind` (`media`, `delay`, `leak`, `sale`, `news`, `launch`) và `tag` (nhãn chữ), có thể thêm `img` + `imgAlt`. Bộ dựng tự chèn mốc "Hôm nay" (lấy từ `ui.date`) trước mốc đầu tiên chưa diễn ra; mốc `next` hiển thị lớn ở cuối.
- `regions`: khu vực chưa có `img` sẽ hiện nền đường đồng mức sinh tự động kèm nhãn `ui.soon`; có ảnh thì dùng ảnh.

Trường bắt buộc của từng khối nằm ở `SECTION_TYPES` trong `scripts/emag/validate.mjs`. Mỗi khối (trừ `banner`, `cta`, `sources`) có `id` (kebab-case, duy nhất) và `nav` (nhãn trên thanh mục lục). Chương được đánh số tự động 01, 02...

## Quy tắc cứng (bộ dựng sẽ chặn nếu vi phạm)

- **Ghi rõ nguồn gốc:** `ui.by` phải nêu OtaHub ("OtaHub nghiên cứu, tổng hợp" / "Researched & compiled by OtaHub"); `hero.sub`, `meta.description` và đoạn nguồn đều nêu OtaHub.
- **Tiêu đề** `meta.title`: 40 đến 56 ký tự. **Mô tả** `meta.description`: 110 đến 165 ký tự.
- **VI và EN song song:** cùng loại khối, cùng `id`, cùng thứ tự.
- **Ảnh cục bộ:** mọi `src`, `bg`, `thumb`, `img` phải nằm trong `/assets/img/` và tồn tại; cấm ảnh ngoài site.
- **Không dùng dấu gạch dài "—"** (site đã bỏ toàn bộ).
- **Link nội bộ** (`href`, `url`) phải trỏ tới trang có thật; `guides` và nút hero phải trỏ tới `#id` có thật.
- `timeline` có **đúng 1** mốc `state: "next"`; `people` có đúng 2 thẻ nhân vật chính; `gallery` tối thiểu 6 ảnh; `faq` tối thiểu 5 câu; `editions` tối đa 1 bản `hot`.
- `facts` chỉ dùng biểu tượng có trong `parts.mjs` (`ICONS`).
- Video: `id` YouTube 11 ký tự. Video bị giới hạn độ tuổi (không nhúng được) đặt `ext: true` để mở sang YouTube.

## Quy tắc nội dung (không máy nào kiểm được, người soạn phải tuân thủ)

- **Mọi dữ kiện phải có nguồn kiểm chứng** (trang chính thức, thông cáo, báo uy tín). Suy đoán phải ghi rõ ("chưa chính thức", "theo ước tính của..."). Không bịa số liệu.
- Giọng văn tự nhiên như ban biên tập giải trí; không kể chuyện "đã trải nghiệm" nếu chưa chơi.
- Ngày trong văn bản dạng `d/m/yyyy`; tên riêng giữ nguyên chính tả gốc.
- Ảnh phải có `alt` mô tả thật và chú thích nguồn (`Ảnh: ...`). Hạn chế lặp lại một ảnh; chỉ chấp nhận khi mỗi lần là một khung cắt khác nhau, phục vụ mục đích khác nhau.
- Khối `todo` ("Còn chờ xác nhận") liệt kê rõ những gì hãng chưa công bố, để người đọc biết đâu là chắc chắn.
- Khối `news` tự gom bài từ `assets/search.js` theo `newsMatch` (khớp tiêu đề hoặc thẻ), bài mới tự xuất hiện; đặt `newsMatch` đủ chặt để không lẫn bài khác.

## Kích thước ảnh (để designer làm sẵn cho từng ngôn ngữ)

Mỗi ngôn ngữ có ảnh riêng: đổi `hero.bg`, `hero.bgMobile`, `meta.ogImage` ở `pages.vi` và `pages.en` trong spec. Đặt file vào `assets/img/<slug>/`, định dạng JPG hoặc WebP (≤ 350 KB cho ảnh hero, ≤ 200 KB cho ảnh còn lại).

| Ảnh | Kích thước gốc | Ghi chú vùng an toàn |
|---|---|---|
| **Ảnh bìa desktop** (`hero.bg`) | **2560 × 1440 px (16:9)** | Khung hiển thị: màn 1920×1080 cho vùng 1905×840 (cắt trên dưới, còn ~78% chiều cao); màn 1440×900 cho 1425×792. Nhân vật/tiêu đề chính đặt ở **giữa-phải, từ 8% đến 75% chiều cao**. Nửa trái và 35% dưới cùng được phủ gradient tối để đặt chữ, đồng hồ nằm góc phải-dưới, nên tránh chi tiết quan trọng ở đó. |
| **Ảnh bìa điện thoại** (`hero.bgMobile`, tùy chọn) | **1080 × 1920 px (9:16)** | Trên điện thoại vùng hero cao ~936 px với màn 375 px (tỉ lệ ~0,4). Nếu không có ảnh riêng, ảnh desktop bị cắt chỉ còn dải giữa. Đặt chủ thể ở **45% phía trên**, phần dưới dành cho chữ. |
| **Ảnh chia sẻ** (`meta.ogImage`) | **1200 × 630 px** | Hiện trên Facebook/X/Zalo. Chừa lề 60 px, chữ trong ảnh phải đọc được ở kích thước nhỏ. |
| Ảnh intro (`intro.img`) | 1200 × 630 px | Hiển thị trong khung có viền màu. |
| Thư viện ảnh, hàng tính năng, video | **1600 × 900 px (16:9)** | Thẻ 16:9, ảnh cắt vừa khung (cover). Ảnh video: 1280 × 720. |
| Ảnh nhân vật (`people`) | 1400 × 1240 px (~1,13:1) | Thẻ gần vuông, chữ nằm đè nửa dưới nên đặt khuôn mặt ở nửa trên. |
| Ảnh khu vực (`regions`) | 1400 × 700 px (2:1) | |
| Thẻ phiên bản (`editions`) | 1200 × 460 px | Chỉ hiện dải cao 150 px, chủ thể ở giữa. |
| Ô "Đi nhanh" (`guides`) | 800 × 600 px | Chữ đè phần dưới. |

Nếu ảnh bìa đã có sẵn chữ/logo tiêu đề thì đặt `hero.hideTitle: true` để ẩn tiêu đề chữ khổng lồ (h1 vẫn còn cho SEO và trình đọc màn hình).

## Hành vi kỹ thuật cần nhớ

- Đồng hồ đếm ngược dùng `countdown.vn` và `countdown.us` (ISO UTC). Khi hãng chưa công bố giờ mở bán, giữ hai giả định như bản GTA 6.
- `scripts/build-thumbs.py` bỏ qua `<main class="em">` nên ảnh e-magazine luôn nét; đừng đổi tên lớp này.
- Mã phiên bản `?v=` của `emag.css` và `emag.js` tự sinh theo nội dung file, không cần bump tay.
- Nút menu nổi bật tạm thời (ví dụ "GTA VI") đặt ở `FEATURED` trong `scripts/sync-site-chrome.mjs`; gỡ bằng `FEATURED = null` rồi `npm run chrome`.
- `npm run emag` = dựng trang + đồng bộ menu. `npm run emag:check` chỉ kiểm tra (spec hợp lệ và trang khớp spec).
- Chỉ sửa `assets/emag.css` / `assets/emag.js` khi muốn đổi giao diện cho TẤT CẢ e-magazine, và phải kiểm tra lại mọi trang đã có.
