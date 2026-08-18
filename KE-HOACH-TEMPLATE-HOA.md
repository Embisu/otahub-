# 🧩 Kế Hoạch Template Hóa OtaHub — Chấm Dứt Lỗi Lệch Giao Diện

> **Vấn đề gốc:** Mỗi trang HTML trong `otahub-source` tự chứa toàn bộ nav/header/footer/CSS riêng, không dùng chung 1 nguồn nào. Mỗi lần thêm bài (dù bởi tôi, ChatGPT, hay ai khác) đều phải copy tay khối này — sai một chút là lệch chuẩn, và không có gì báo lỗi. Đây là nguyên nhân của cả 2 đợt lỗi đã tìm thấy: nút EN thừa/thiếu link Chuyên sâu (đợt trước) và 23 bài mất dấu tiếng Việt (đợt vừa rồi).
>
> **Mục tiêu:** Tách nav/header/footer ra 1 nguồn duy nhất, để về sau dù ai thêm bài cũng không thể làm lệch giao diện — vì không còn gì để copy sai nữa.

---

## Hạ tầng hiện tại (đã xác nhận trong repo)

- `wrangler.jsonc`: otahub-source deploy qua **Cloudflare Pages**, kiểu **static assets thuần** (`"assets": {"directory": "."}`) — không có Functions, không có build step. Cloudflare chỉ serve nguyên trạng thư mục sau mỗi lần `git push`.
- `netlify.toml`: tồn tại nhưng không dùng tới (tàn dư cấu hình cũ, gây nhầm lẫn) → nên xoá ở Giai đoạn 0.
- Chưa có hệ thống template/build nào — 100% file HTML viết tay, độc lập.

**Hệ quả cho kế hoạch:** vì Cloudflare chỉ serve file tĩnh có sẵn, giải pháp an toàn nhất là dùng **build script chạy cục bộ, xuất ra HTML tĩnh hoàn chỉnh rồi commit thẳng** — không cần đổi bất kỳ cấu hình nào trên Cloudflare Dashboard, không cần Cloudflare Functions, rủi ro thấp nhất.

---

## Nguyên tắc khi thực hiện

1. Không đổi URL của bất kỳ trang nào — SEO/backlink hiện có không bị ảnh hưởng.
2. Làm trên nhánh git riêng, không đụng `main` cho tới khi kiểm chứng xong từng phần (Cloudflare Pages tự tạo preview URL cho nhánh mới → xem trước khi merge).
3. Luôn build ra thư mục tạm và diff với bản HTML cũ trước khi ghi đè — tuyệt đối không migrate hàng loạt mà không kiểm tra.
4. Giữ file gốc trong lịch sử git → rollback bất cứ lúc nào bằng `git revert`.

---

## Giai đoạn 0 — Dọn nền (rủi ro ~0)

- [ ] Xoá `netlify.toml` (không dùng, dễ gây nhầm lẫn về sau).
- [ ] Tạo nhánh `refactor/shared-template` — toàn bộ công việc bên dưới làm trên nhánh này.

## Giai đoạn 1 — Sửa gấp 23 bài mất dấu tiếng Việt (độc lập, làm trước)

Việc này **không phụ thuộc** vào hệ thống template mới, nên làm ngay vì là lỗi người đọc thấy trực tiếp:

- [ ] Viết lại có dấu cho phần thân bài, `<title>`, meta description/OG, footer nav của 23 bài (đợt xuất bản 10–23/6/2026).
- [ ] Đồng bộ nút "Sao chép link" (bài mới có, bài cũ thiếu) vào toàn bộ 23 bài.
- [ ] Kiểm tra lại bằng cách fetch trực tiếp từng URL sau khi deploy.

## Giai đoạn 2 — Tách 3 khối dùng chung

- [ ] Tạo `templates/partials/head.html` — khung `<head>` chung (favicon, font, GA4, các meta không đổi theo trang).
- [ ] Tạo `templates/partials/nav.html` — thanh điều hướng + mobile nav (nguồn duy nhất, sửa 1 lần là mọi trang đổi theo).
- [ ] Tạo `templates/partials/footer.html` — footer chung.
- [ ] Xác định các biến cần thay theo từng trang: `{{TITLE}}`, `{{DESCRIPTION}}`, `{{CANONICAL}}`, `{{OG_IMAGE}}`, `{{BREADCRUMB}}`, `{{ACTIVE_NAV}}`...

## Giai đoạn 3 — Viết build script

- [ ] `scripts/build.js` (Node.js thuần, không cần framework): đọc trang nguồn trong `src/pages/` (chỉ có nội dung riêng + khai báo biến ở đầu file), ghép với 3 partial, xuất HTML hoàn chỉnh vào đúng đường dẫn cũ ở thư mục gốc.
- [ ] Thêm script `npm run build` chạy 1 lệnh duy nhất cho toàn bộ site.
- [ ] Thêm bước diff tự động: so HTML mới build ra với HTML hiện có, in ra danh sách thay đổi để review trước khi ghi đè.

## Giai đoạn 4 — Pilot trên 5 trang

- [ ] Chuyển thử: `index.html` (hub), 1 bài viết mới (`mortal-shell-2-release.html`), 1 trang danh mục (`gaming.html`), 1 trang detail (`game-detail.html`), 1 trang trong `en/`.
- [ ] Diff kỹ HTML build ra vs bản gốc — đảm bảo giống hệt về nội dung, chỉ khác ở việc nguồn không còn duplicate.
- [ ] Push nhánh `refactor/shared-template` → xem qua Cloudflare Pages preview URL → xác nhận hiển thị đúng trên cả desktop/mobile trước khi đi tiếp.

## Giai đoạn 5 — Migrate toàn bộ theo từng nhóm

Làm từng nhóm, kiểm tra xong nhóm này mới sang nhóm kế:

1. [ ] Trang trung tâm: `index`, `gaming`, `anime`, `manga`, `reviews`, `rankings`, `choi-gi`, `chuyen-sau`, `news`, `about`...
2. [ ] ~100 bài viết tiếng Việt (bao gồm sửa dấu từ Giai đoạn 1 luôn trong lượt này nếu chưa làm riêng).
3. [ ] Trang chi tiết động: `game-detail`, `anime-detail`, `manga-detail`.
4. [ ] Toàn bộ thư mục `en/`.
5. [ ] `admin.html`, `recommend.html` và các trang phụ còn lại.

Mỗi nhóm xong: kiểm tra tag cân bằng, link nội bộ, ảnh, rồi mới merge vào `main`.

## Giai đoạn 6 — Khoá quy trình cho tương lai

- [ ] Viết `CONTRIBUTING.md` ngắn: "Thêm bài mới → chỉ tạo file trong `src/pages/`, không sửa tay nav/footer, luôn chạy `npm run build` trước khi commit."
- [ ] Từ thời điểm này, dù tôi, ChatGPT, hay cộng tác viên nào thêm bài, đều bắt buộc đi qua build script — nav/footer không còn tồn tại dưới dạng copy-paste tay nên **không thể lệch chuẩn được nữa về mặt kiến trúc**, không chỉ dựa vào việc "cẩn thận".

---

## Rủi ro & cách giảm thiểu

| Rủi ro | Cách xử lý |
|---|---|
| Build script lỗi, sinh HTML sai hàng loạt | Luôn build ra thư mục tạm + diff trước khi ghi đè, không bao giờ build thẳng vào repo |
| Đổi URL làm mất SEO | Build script giữ nguyên đường dẫn file, không đổi routing |
| Merge nhầm khi chưa test | Làm trên nhánh riêng, chỉ merge sau khi xem preview Cloudflare Pages |
| Muốn quay lại bản cũ | Toàn bộ lịch sử vẫn còn trong git, `git revert` bất cứ lúc nào |

## Thời gian ước tính (nếu tôi thực hiện)

- Giai đoạn 0–1: trong ngày hôm nay.
- Giai đoạn 2–4 (xây hệ thống + pilot): 1 phiên làm việc.
- Giai đoạn 5 (migrate toàn bộ ~230 file kể cả `en/`): chia vài đợt để bạn kiểm tra từng phần.
- Giai đoạn 6: khoảng 15 phút.

---

*Tài liệu này bổ sung cho `OTAHUB-ROADMAP.md` — tập trung riêng vào việc dọn nợ kỹ thuật ở tầng giao diện, không phải chiến lược nội dung/SEO/monetize.*
