# Quy tắc thẻ (tag) cuối bài

Thẻ nằm trong `<div class="sb-tags">` ở sidebar, mỗi thẻ là `<a class="sb-tag" href="/tag?q=...">` (EN: `/en/tag?q=...`). Thẻ cũng được đưa vào `assets/search.js` để trang `/tag` tìm ra bài.

## Chọn thẻ: phải RIÊNG

Mỗi bài 3–6 thẻ, mỗi thẻ là một thực thể cụ thể có trong bài:

- Tác phẩm / game / franchise: `Chainsaw Man`, `Elden Ring Nightreign`, `GTA 6`
- Nhân vật: `Roronoa Zoro`, `Maomao`, `Sung Jin-woo`
- Tác giả / đạo diễn / seiyuu: `Eiichiro Oda`, `Tatsuki Fujimoto`
- Studio / hãng phát triển: `MAPPA`, `FromSoftware`, `Supergiant Games`
- Sự kiện, arc, bản cập nhật cụ thể: `Elbaf`, `Gamescom`, `Genshin Impact 7.0`

**Không dùng** thẻ chung: Anime, Manga, Gaming, Đánh giá, Xếp hạng, Tin tức, OtaHub, Trailer, Gameplay, Demo, Remake, năm (2026), họ máy (PC/PS5/Xbox), thể loại (RPG, Isekai, Shonen, Gacha, Romance, Kinh dị...), "Anime bóng đá", "Top 10 Anime", tiêu đề bài viết biến thành thẻ.

**Nền tảng / nhà phát hành / nguồn tin** (Steam, Netflix, Crunchyroll, Disney+, Sony, Nintendo, Switch 2, Xbox Game Pass, Weekly Shonen Jump, Shueisha, Kodansha, Metacritic, Anime News Network...) chỉ gắn khi bài nói về chính nó (tên nằm trong tiêu đề). Bài chỉ "chiếu trên Netflix" thì không gắn Netflix.

Không tạo hai thẻ cùng nghĩa (`Anime Mùa Thu` / `Anime mùa thu 2026`, `Oda` / `Eiichiro Oda`). Tên tác phẩm theo hồ sơ: bài VI dùng tên Việt hóa, bài EN dùng tên gốc.

## Máy làm giúp

`scripts/normalize-tags.mjs` (đã nối vào `npm run hubs`) tự gỡ thẻ chung, gộp tên, đổi tên tác phẩm theo hồ sơ, gỡ thẻ nền tảng nếu tiêu đề không nhắc, và sửa href về `/tag?q=`. Bảng quy tắc ở `scripts/data/tag-canon.json`:

- `generic`: gỡ ở mọi bài
- `titleOnly`: chỉ giữ khi tên có trong tiêu đề
- `canon`: tên khác nhau → một tên chuẩn (`"-"` = gỡ)
- `brandName`: ghi đè tên chuẩn của tác phẩm theo slug hồ sơ

Gặp thẻ chung/trùng mới thì thêm vào file đó rồi chạy `node scripts/normalize-tags.mjs && node scripts/sync-search-tags.mjs`. Kiểm tra không ghi: thêm `--check`.
