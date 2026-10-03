# Giọng văn OtaHub: quy chuẩn viết bài

Áp dụng cho mọi bài mới và bài viết lại (VI + EN) từ 2/10/2026. File này nói về **giọng văn và chất lượng**; khung mục cho từng dạng bài (tin, danh sách, review) nằm ở `docs/content-forms.md`, quy tắc tên Việt hóa ở `docs/TEN-VIET-HOA-ANIME.md`.

## 1. OtaHub là ai khi cầm bút

**Một người bạn mê anime và game, đọc kỹ nguồn gốc rồi kể lại cho bạn nghe.**

- **Am hiểu:** biết bối cảnh, nhớ chi tiết, nối được tin hôm nay với chuyện cũ. Ví dụ: “bộ này của tác giả Gantz”, “tháng 9 năm nào Genshin cũng mạnh”.
- **Thẳng:** nói rõ cái gì đã công bố, cái gì chưa. Không thổi phồng, không giật tít.
- **Có chính kiến:** mỗi bài có ít nhất một nhận định riêng mà nguồn gốc không nói.
- **Gần gũi, hơi hóm:** viết như nói chuyện, đùa nhẹ được, nhưng không la hét.

Xưng hô: gọi người đọc là **“bạn”**, tòa soạn tự gọi là **“OtaHub”**. Không dùng “chúng tôi”, “quý độc giả”, “các bạn thân mến”.

## 2. Bộ khung nhận diện (bài tin tức và góc nhìn)

| Khối | Bắt buộc | Viết thế nào |
|---|---|---|
| Sapo (`art-lead`) | Có | 2–3 câu. Câu 1 là tin chính đầy đủ: cái gì, của ai, khi nào, ở đâu. Câu 2–3 trả lời “vì sao bạn nên quan tâm”. |
| **Nắm nhanh** | Có | Bảng 4–7 dòng để tra cứu: tên, ngày, nền tảng, studio/hãng, tình trạng. |
| Thân bài | Có | Theo Form A/B/C trong `content-forms.md`. H2 là câu hoặc cụm từ mô tả, ưu tiên câu người đọc thật sự hỏi. |
| **Xem ở đâu / Chơi ở đâu** | Khi có | Link chính thức (Netflix, Crunchyroll, Steam, trang game…) mở tab mới. Không dẫn link lậu. |
| **Góc OtaHub** | Có | 1–2 đoạn nhận định riêng: bối cảnh, so sánh, điều nên chờ, điều đáng lo. Phải có ý, không tóm tắt lại bài. |
| Câu hỏi thường gặp | Có | 3–5 câu đúng kiểu người ta gõ Google. Trả lời 1–3 câu, có số liệu/ngày. Luôn dùng khối bấm +/− `<div class="review-faq"><details><summary>Câu hỏi</summary><p>Trả lời</p></details>…</div>` (giống mọi bài review), không viết tay bằng H3 + đoạn văn. |
| Dòng nguồn | Có | `Nguồn: Anime News Network, X chính thức của …`: ghi tên nguồn cụ thể. Không ghi “Tổng hợp”. |

Bản EN dùng cùng khung: *Quick facts*, *Where to watch / Where to play*, *OtaHub’s take*, *FAQ*, *Sources*.

## 3. Câu chữ

- Câu ngắn (khoảng 15–25 chữ), đoạn 2–4 câu. Mỗi đoạn một ý.
- Dùng chi tiết cụ thể thay tính từ. Viết “12 tập, chiếu từ 8/7 đến 30/9” thay vì “mùa đầu thành công rực rỡ”.
- Dùng động từ thường, không dùng kiểu khẩu hiệu. Không nhồi dấu chấm than; cả bài tối đa một dấu.
- Không dùng gạch ngang dài (—) để nối ý. Tách thành câu mới hoặc dùng dấu phẩy, dấu hai chấm.
- Ngoặc kép “ ”. Số: `1.000`, `50,2 triệu USD`. Ngày: `d/m/yyyy`. Giờ Nhật ghi rõ “giờ Nhật” và quy đổi khi cần.
- Bài viết lại từ báo khác: **không dịch câu theo câu**. Đọc xong, gấp nguồn lại, viết theo trình tự của OtaHub và thêm ít nhất 2 dữ kiện hoặc góc nhìn mà nguồn không có.

### Từ cấm (sáo rỗng, giật tít)

siêu phẩm, cực phẩm, bom tấn (trừ khi nói về doanh thu thật), bùng nổ, đánh úp, gây bão, dậy sóng, khiến fan phát cuồng, vô tiền khoáng hậu, không thể bỏ lỡ, “hãy cùng tìm hiểu”, “có thể nói”, “không ít người”, “nhìn chung”, “tóm lại”, “Theo dõi OtaHub để cập nhật…”, “Nguồn: Tổng hợp”.

Hạn chế dùng: “hứa hẹn” (tối đa 1 lần/bài), “chính thức” (chỉ dùng khi cần phân biệt với tin đồn), “cộng đồng mạng”.

## 4. Chính xác là trên hết

- **Không bịa.** Nguồn không nói có trailer thì không viết “trailer hé lộ cảnh chiến đấu”. Nguồn chỉ có tranh minh họa thì viết đúng là tranh minh họa.
- Mỗi con số đều có nguồn. Số ước tính (doanh thu, lượt bán) phải ghi “khoảng / ước tính” kèm tên đơn vị đo.
- Tách bạch **đã công bố** và **chưa công bố**. Cuối phần tin luôn có câu nói rõ cái gì còn chưa có (ngày chiếu cụ thể, dàn cast mới…).
- Khi các nguồn vênh nhau (ngày, tên, số liệu), dùng nguồn chính thức. Nếu không có nguồn chính thức, ghi khoảng giá trị hoặc nói rõ.
- Đối chiếu ít nhất 2 nguồn cho dữ kiện chính: ANN, trang/tài khoản chính thức, Wikipedia (kiểm tra lại chú thích), Sensor Tower…
- Spoiler: thông tin phát hành thì không spoil. Nếu bài buộc phải nói cái kết, đặt cảnh báo spoiler ngay trước đoạn đó.

## 5. SEO (phục vụ người đọc trước)

- **Tiêu đề:** 40–55 ký tự, tên tác phẩm đứng đầu, có một dữ kiện (ngày, nền tảng, con số) hoặc một “móc” thật (“của tác giả Gantz”).
- **Mô tả:** 130–160 ký tự, đủ cái gì / khi nào / ở đâu, không lặp nguyên tiêu đề.
- **Từ khóa chính** (`KEYWORD`) có mặt trong sapo, ít nhất một H2 và alt của một ảnh. Không nhồi.
- 2–3 link nội bộ tới bài liên quan thật sự (cùng tác phẩm, tác giả, hãng). Sidebar “Bài viết liên quan” phải cùng chủ đề.
- Thẻ (tag): 5–8 thẻ RIÊNG có trong bài: tên tác phẩm (anime/manga/game/phim), studio/hãng/nhà xuất bản, nhân vật có tên, tác giả/đạo diễn/seiyuu, sự kiện/arc cụ thể. Không dùng thẻ chung (Anime, Manga, Gaming, Đánh giá, năm, PC/PS5, thể loại RPG/Isekai, "Trailer"). Nền tảng phát sóng/nguồn tin (Steam, Netflix, Crunchyroll, Metacritic...) chỉ khi bài nói về chính nó. Chi tiết: docs/QUY-TAC-THE.md.
- JSON-LD: `description` không được trống; có FAQPage khi bài có mục Câu hỏi thường gặp.

## 6. Ảnh

- Ảnh bìa 16:9, ít nhất 1200 px. Không dùng ảnh có chữ to đè lên vùng tiêu đề. Ảnh ghép thì dùng `scripts/build-collage.py`, đường chia nằm đúng khe giữa các khung.
- Ảnh trong bài có `figure` + `figcaption`, ghi nguồn (“Ảnh: Netflix”, “Ảnh: HoYoverse”). Alt mô tả đúng nội dung ảnh.
- Ảnh đã đăng thì không sửa đè: đặt tên file mới (`-v2`) rồi đổi đường dẫn.

## 7. Ví dụ trước / sau

> **Trước:** “Ngay sau khi tập cuối khép lại, siêu phẩm viễn tưởng Thunder 3 đã khiến cộng đồng Otaku bùng nổ khi đánh úp thông tin gia hạn chớp nhoáng.”
>
> **Sau:** “Thunder 3 sẽ có mùa 2 vào năm 2027. Ê-kíp công bố tin này ngày 1/10, chỉ vài giờ sau khi tập 12 khép lại mùa đầu trên Fuji TV và Netflix.”

Câu sau ngắn hơn, có ngày, có nền tảng, và không cần tính từ nào.

## 8. Checklist trước khi đăng

1. Sapo trả lời được “cái gì, khi nào, ở đâu, vì sao quan tâm”.
2. Có Nắm nhanh, Góc OtaHub, FAQ, dòng Nguồn (và Xem/Chơi ở đâu nếu có).
3. Rà lại danh sách từ cấm (Ctrl+F).
4. Mỗi con số và ngày đã đối chiếu với nguồn; ghi rõ những gì chưa công bố.
5. Tên tác phẩm đúng `TEN-VIET-HOA-ANIME.md`; bản EN giữ tên tiếng Anh.
6. Tiêu đề 40–55 ký tự, mô tả 130–160 ký tự, JSON-LD đủ trường.
7. Ảnh bìa không bị cắt mất chủ thể ở ô Hero trang chủ; ảnh trong bài có chú thích nguồn.
8. Chạy quy trình đăng bài trong `docs/PUBLISHING_RUNBOOK.md` (hubs, chrome, authors, thumbs, IndexNow).
9. Đưa bài lên Hero trang chủ bằng `python scripts/home-order.py --hero /slug-vi /en/slug-en` (Git Bash: thêm `MSYS_NO_PATHCONV=1`), không sửa tay khối Hero. Hero cũ luôn xuống đầu “Tiêu điểm tuần”, mọi danh sách xếp theo giờ đăng. Kiểm tra bằng `npm run home:check`.
