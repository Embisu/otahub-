# OtaHub full-site audit — 2026-09-28

Phạm vi: website công khai `https://otahub.asia/`, trang quản trị `https://otahub.asia/admin`, 476 URL trong sitemap, 502 tệp HTML, 443 bài viết (221 VI, 222 EN), 26.542 liên kết, 3.489 ảnh và 932 khối schema.

## Tổng quan

- 476/476 URL trong sitemap trả HTTP 200 và đúng kiểu `text/html`.
- Trang chủ và trang quản trị không ghi nhận lỗi/warning trong console tại thời điểm kiểm tra.
- Kiểm tra phân quyền quản trị và cú pháp JavaScript đều đạt; bản dựng Cloudflare Worker dry-run thành công.
- API quản trị từ chối đúng (HTTP 401) khi gọi không có phiên đăng nhập.
- Audit tĩnh phát hiện 215 vấn đề. Phần lớn là meta description dài, nhưng có một số lỗi chức năng/SEO cần ưu tiên cao hơn.

## P0 — cần xử lý ngay

1. Có 45 liên kết nội bộ trỏ tới trang không tồn tại trong mã nguồn. Một số liên kết này đang hiển thị trực tiếp trên trang chủ/chuyên mục, gồm các URL như:
   - `/youjo-senki-ii-ket-thuc-phat-song`
   - `/dragon-ball-super-beerus-len-song-11-10`
   - `/fire-emblem-fortunes-weave-metacritic-89`
   - `/jojo-steel-ball-run-stage-2-3-len-song-25-9`
   - `/cyberpunk-edgerunners-2-ra-mat-20-10-netflix`
   - `/control-resonant-ra-mat-metacritic-84`
   - `/grand-blue-mua-4-cong-bo-sau-mua-3-ket-thuc`
   - `chainsaw-man-season3`, `solo-leveling-season2`
   - nhiều liên kết One Piece chương 1191–1193 và một số URL tiếng Anh tương ứng.
2. Có 4 ảnh nội dung tham chiếu tới tệp không tồn tại:
   - `/assets/img/pool-hok-1.jpg`
   - `/assets/img/pool-sololeveling-1.jpg`
   - `/assets/img/pool-vct-1.jpg`
   - `/assets/img/pool-vct-2.jpg`
3. Có 1 khối JSON-LD sai cú pháp trong `en/gamescom-2026-playstation-highlights.html`.
4. Có 1 lỗi cú pháp JavaScript nội tuyến trong `en/reviews.html` (`Unexpected identifier 's'`).

## P1 — ảnh hưởng SEO, truy cập và độ tin cậy

1. Hreflang không đồng bộ:
   - 17 hreflang trỏ tới bản dịch không tồn tại.
   - 11 cặp VI/EN thiếu liên kết hreflang đối ứng.
2. Có 113 meta description dài hơn 180 ký tự và 1 description ngắn hơn 70 ký tự. Google có thể cắt hoặc tự viết lại snippet.
3. Có 14 ảnh thiếu `alt`, chủ yếu ở các bài mới ngày 24–28/09.
4. Có 8 ảnh thiếu `width`/`height`, dễ gây layout shift.
5. `roman-sands-re-build-mac-ket-trong-giac-mo-vaporwave-dang-da.html` có heading rỗng.
6. 214/443 bài dưới 350 từ:
   - 78 bài dưới 200 từ.
   - 136 bài từ 200–349 từ.
   - Trong nhóm có vấn đề: 90 bài VI và 125 bài EN; bản tiếng Anh mỏng hơn rõ rệt, có bài chỉ 64–129 từ.

## P1 — vấn đề riêng của trang quản trị

1. Dashboard tuyên bố “Rank Math SEO: tối ưu 100% tất cả 214 bài viết”, nhưng cột điểm SEO của toàn bộ danh sách hiện là `--`, và thanh trên cùng cũng hiển thị `--/100`. Đây là số liệu gây hiểu nhầm hoặc tính năng chưa thực sự nối dữ liệu.
2. Admin chỉ thống kê 214 bài (213 xuất bản, 1 nháp), trong khi audit nội dung thấy 443 bài và sitemap có 476 URL. Nếu admin cố ý chỉ quản lý bản VI thì cần ghi rõ; nếu không, các bài EN đang nằm ngoài luồng quản trị.
3. Danh sách render toàn bộ 214 bài trên một trang, không có phân trang thực. Cây giao diện rất lớn, có thể chậm trên máy yếu và gây khó sử dụng với trình đọc màn hình.
4. Trang chủ công khai vẫn hiển thị bài “Cộng đồng game thủ Việt Nam quay lưng với PUBG”, trong khi admin đánh dấu bài này là bản nháp. Cần kiểm tra lại logic xuất bản hoặc việc file cũ vẫn còn được deploy.

## P2 — UX và nhất quán nội dung

1. Hero trang chủ đang gắn metadata `MANGA · SHONEN JUMP` cho bài “Khi GTA trở thành sân khấu cho Shakespeare…”, trong khi bài thuộc Gaming trong admin.
2. Trang chủ có rất nhiều liên kết lặp trong ticker/trending, làm DOM lớn và tăng nhiễu cho trình đọc màn hình.
3. Số lượng bài ở khối “Khám phá chủ đề” (1.247 Gaming, 863 Anime, 542 Manga, 318 Reviews) không khớp với 214 bài quản trị/443 bài thực tế; có vẻ là số tĩnh.
4. CSP có `'unsafe-inline'` và `'unsafe-eval'`. Các header HSTS, X-Frame-Options, nosniff, Referrer-Policy và Permissions-Policy đã có, nhưng CSP hiện vẫn giảm khả năng chống XSS.
5. `/admin` trả HTML với cache HIT của Cloudflare. Dữ liệu riêng nằm sau API có xác thực, nhưng nên đặt `Cache-Control: no-store` cho giao diện/admin API để giảm rủi ro cache nhầm trong tương lai.

## Những phần đã đạt

- Không phát hiện URL sitemap chết hoặc sai content type.
- Không phát hiện ảnh hỏng tại runtime trên trang chủ đang mở.
- Trang chủ có đúng 1 H1, `lang="vi"`, không có ID trùng.
- Không phát hiện nội dung bị cụt, placeholder, hoặc mẫu thông tin hư cấu đã biết trong bộ kiểm tra hiện tại.
- Kiểm tra quyền admin, author, contributor và chữ ký file ảnh đều đạt.
- Worker build/dry-run thành công; JavaScript chính của admin hợp lệ.

## Thứ tự khắc phục đề xuất

1. Sửa/xóa 45 liên kết hỏng và 4 ảnh thiếu; loại bài nháp khỏi trang công khai.
2. Sửa JSON-LD và lỗi JavaScript của trang Reviews tiếng Anh.
3. Đồng bộ hreflang và quyết định rõ admin có quản lý EN hay không.
4. Nối dữ liệu SEO thật hoặc bỏ các tuyên bố “100%”; thêm phân trang danh sách bài.
5. Bổ sung alt/kích thước ảnh, rút gọn meta description.
6. Nâng chất lượng các bài dưới 200 từ, ưu tiên 15 bài EN ngắn nhất.
7. Siết CSP và cache policy cho `/admin`.

## Giới hạn kiểm tra

Audit đã bao phủ toàn bộ cấu trúc, URL, liên kết, ảnh, schema, metadata, mã chạy và luồng quản trị đọc-only. Việc xác minh từng tuyên bố biên tập trong 443 bài với nguồn báo chí gốc là một hạng mục fact-check riêng; kết quả “không phát hiện hallucination” ở đây chỉ dựa trên các mẫu sai lệch đã biết trong bộ kiểm tra của dự án.
