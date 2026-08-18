# Quy Tắc Bắt Buộc Khi Sửa OtaHub — đọc trước KHI làm bất kỳ thay đổi nào

> Dành cho ChatGPT (hoặc AI/người khác) khi được giao sửa bất kỳ trang nào trên otahub-source. Đây là "khung cứng" — nếu thay đổi bạn định làm vi phạm bất kỳ mục nào bên dưới, DỪNG LẠI và hỏi lại người giao việc trước khi làm, đừng tự quyết.

Bối cảnh: site này đã bị lệch giao diện nhiều lần trong quá khứ vì sửa tay không theo chuẩn (nút thiếu, màu sai, kích thước khác nhau giữa các trang, tính năng nhìn như có nhưng không chạy). Tài liệu này tồn tại để việc đó không lặp lại.

## 1. Trước khi sửa bất kỳ file `.html` nào

- [ ] Đọc `HUONG-DAN-THEM-BAI.md` nếu việc liên quan đến **trang bài viết** (thêm bài mới, sửa nội dung bài).
- [ ] Đọc `HUONG-DAN-TRANG-HUB.md` nếu việc liên quan đến **8 trang hub** (index, gaming, anime, manga, reviews, rankings, choi-gi, chuyen-sau).
- [ ] Xác định rõ: việc này có bắt buộc phải sửa `<nav>`, `<div class="mobile-nav">`, hoặc `<footer>` không? Nếu KHÔNG cần, thì TUYỆT ĐỐI không đụng vào 3 khối này — chúng đã được đồng bộ khớp nhau ở cả 8 trang hub (18/8/2026), sửa tay dù chỉ 1 ký tự cũng làm lệch lại.

## 2. Nếu bắt buộc phải sửa CSS ảnh hưởng nav/logo/nút bấm

Các giá trị sau đây đã được đồng bộ Y HỆT trên cả 8 trang hub — bất kỳ giá trị nào khác các con số dưới đây trên bất kỳ trang nào là LỖI, không phải biến thể hợp lệ:

| Thành phần | Giá trị chuẩn |
|---|---|
| Chiều cao thanh nav (`.nav`) | `height:60px` |
| Logo trong nav (`.logo svg`) | `width:30px;height:30px` |
| Khoảng cách logo (`.logo`) | `gap:9px;margin-right:32px` |
| Cỡ chữ tên site (`.logo-t`) | `font-size:20px` |
| Nút hamburger (`.ham`) | `min-width:44px;min-height:44px;padding:8px` |
| Link nav (`.nav-links a`) | `padding:0 13px;height:60px;display:flex;align-items:center` |
| Nút tìm kiếm | class phải là `nsearch` (không phải `nav-search`), luôn có `onclick="openSearch()"` |

Màu sắc/theme (`--cyan` cho gaming, `--sakura` cho anime, `--lav` cho manga...) là CHỦ Ý, được PHÉP khác nhau giữa các trang — không phải lỗi, đừng "sửa" cho giống nhau.

## 3. Nếu thêm 1 nút/tab lọc (filter tab) bất kỳ

Lỗi đã xảy ra: nút lọc (`.ftab`, `.sf-btn`) trên gaming/anime/manga.html trước đây chỉ đổi màu nút đang chọn (`classList.add('on')`) mà KHÔNG hề ẩn/hiện nội dung — trông như có tính năng nhưng bấm vào chẳng có gì thay đổi. Đây là kiểu lỗi "giả tính năng" tuyệt đối không được lặp lại.

**Quy tắc:** bất kỳ nút nào có vẻ như dùng để lọc/sắp xếp nội dung, khi code xong PHẢI tự tay bấm thử (hoặc mô tả rõ trong báo cáo) để xác nhận nội dung trang THỰC SỰ thay đổi theo, không chỉ đổi màu nút. Nếu không chắc cách kiểm tra, thêm `console.log` tạm để soát rồi xoá đi trước khi nộp.

## 4. Không được để bài viết trùng lặp trong cùng 1 trang

Lỗi đã xảy ra: cùng 1 bài viết (cùng URL) xuất hiện cả ở khối "nổi bật" lẫn khối "mới nhất" trên cùng trang. Trước khi thêm/sửa bất kỳ khối danh sách bài viết nào, liệt kê hết `href` đang có trên trang (trừ sidebar bảng xếp hạng — sidebar được phép lặp vì đó là nội dung khác) và xác nhận không trùng với khối khác.

Nếu cần bài thay thế, LUÔN lấy từ mảng `IDX` trong `assets/search.js` (danh sách bài thật đã tồn tại) — không tự bịa bài mới, không tự bịa đường dẫn ảnh (`assets/img/...`) không tồn tại, luôn kiểm tra bằng `ls assets/img/` trước khi dùng.

## 5. Khối nội dung chèn bằng JavaScript (kiểu category-latest.js)

Nếu cần thêm 1 khối nội dung mới bằng JS (không phải HTML tĩnh), khối đó PHẢI dùng lại các class layout đã có sẵn trên trang (`.wrap`, `.sec-h`, `.sec-t`, `.sec-l`, `.sec-more`) cho phần tiêu đề/khung ngoài, thay vì tự đặt ra bộ class/CSS riêng. Lý do: tự đặt CSS riêng dễ khiến khối đó "nhìn tách biệt" khỏi phần còn lại của trang — đúng lỗi đã xảy ra và vừa được sửa ở `category-latest.js`.

## 6. Line ending — LF, không phải CRLF

Toàn bộ file `.html`/`.js` trong repo dùng line ending LF (Unix). Nếu công cụ bạn dùng để sửa file (đặc biệt trên Windows) vô tình chuyển sang CRLF, `git diff` sẽ hiện HÀNG NGHÌN dòng thay đổi giả dù nội dung thực tế chỉ đổi vài dòng — rất khó soát và dễ commit nhầm. Trước khi coi là xong việc, kiểm tra:
```
file ten-file.html
```
Nếu thấy chữ "CRLF" trong kết quả, chạy:
```
sed -i 's/\r$//' ten-file.html
```
rồi kiểm tra lại `git diff` để chắc chắn chỉ còn đúng phần bạn thực sự sửa.

## 7. Checklist bắt buộc trước khi báo "xong" bất kỳ việc gì

1. Kiểm tra cấu trúc HTML hợp lệ — dùng Python `html.parser.HTMLParser` (không dùng regex đếm thẻ, sẽ báo sai). Script mẫu có trong `HUONG-DAN-TRANG-HUB.md`.
2. Nếu có sửa `<script>`, trích riêng nội dung script và chạy `node --check` để chắc không lỗi cú pháp.
3. Chạy `file ten-file.html` xác nhận không lẫn CRLF (mục 6).
4. Chạy `git diff ten-file.html`, đọc lại TOÀN BỘ diff — xác nhận chỉ có đúng phần bạn định sửa, không có gì thay đổi ngoài ý muốn ở `<nav>`/`<footer>`/`<head>`/phần nội dung khác.
5. KHÔNG tự ý `git add`/`git commit`/`git push` trừ khi được yêu cầu rõ ràng — mặc định chỉ sửa file, để người giao việc xem lại rồi tự quyết định commit.
6. Báo cáo lại NGẮN GỌN: đã đổi gì, đã kiểm tra gì, có điểm nào không chắc chắn thì nói rõ thay vì tự đoán liều.

## 8. Khi không chắc chắn

Nếu gặp tình huống không có trong tài liệu này (ví dụ cấu trúc trang khác hẳn dự kiến, không tìm thấy pattern để theo, hoặc việc được giao mơ hồ) — DỪNG LẠI, mô tả rõ vấn đề, và hỏi lại thay vì tự suy đoán rồi làm liều. Một lỗi "nhìn có vẻ ổn nhưng thực ra sai" (như các nút filter giả) khó phát hiện hơn nhiều so với việc hỏi lại 1 câu trước khi làm.
