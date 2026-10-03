# Quy tắc thẻ (tag) cuối bài

Thẻ nằm trong `<div class="sb-tags">` ở sidebar, mỗi thẻ là `<a class="sb-tag" href="/tag?q=...">` (EN: `/en/tag?q=...`). Thẻ cũng được đưa vào `assets/search.js` để trang `/tag` tìm ra bài.

## Chọn thẻ: tên riêng, càng cụ thể càng tốt

Mỗi bài thường 5–8 thẻ, mỗi thẻ là một thực thể có tên và ĐƯỢC NHẮC trong bài (đọc bài rồi mới chọn, không đoán):

- Tác phẩm: anime, manga, game, phim, light novel, franchise (kể cả tác phẩm phụ bài có bàn tới)
- Studio / hãng phát triển / nhà phát hành / nhà xuất bản / tạp chí: `MAPPA`, `FromSoftware`, `Shueisha`, `Nintendo`, `Weekly Shonen Jump`
- Nhân vật có tên, cả trong game, anime, phim: `Roronoa Zoro`, `Maomao`, `Denji`, `Geralt`
- Tác giả, đạo diễn, seiyuu, nhà soạn nhạc: `Eiichiro Oda`, `Tatsuki Fujimoto`
- Sự kiện, arc, bản cập nhật, giải đấu cụ thể: `Elbaf`, `Gamescom`, `Genshin Impact 7.0`, `LCK`

**Không dùng** thẻ chung: Anime, Manga, Gaming, Đánh giá, Xếp hạng, Tin tức, OtaHub, Trailer, Gameplay, Demo, Remake, năm (2026), họ máy (PC/PS5/Xbox), thể loại (RPG, Isekai, Shonen, Gacha, Romance, Kinh dị...), "Top 10 Anime", thuật ngữ chung (T-Doll, Teyvat), và không biến tiêu đề/câu dài thành thẻ.

**Nền tảng phát sóng / cửa hàng / nguồn tin** (Steam, Netflix, Crunchyroll, Disney+, Prime Video, Switch 2, Xbox Game Pass, Metacritic, Anime News Network...) chỉ gắn khi bài nói về chính nó (tên nằm trong tiêu đề). Bài chỉ "chiếu trên Netflix" thì không gắn Netflix. Nhà sản xuất/nhà xuất bản (Nintendo, Sony, Shueisha, Kodansha, Kadokawa...) thì gắn bình thường khi bài nhắc tới.

Không tạo hai thẻ cùng nghĩa (`Anime Mùa Thu` / `Anime mùa thu 2026`, `Oda` / `Eiichiro Oda`). Tên tác phẩm theo hồ sơ: bài VI dùng tên Việt hóa, bài EN dùng tên gốc. Thẻ ngắn dễ trùng chữ (`ONE`, `EVE`) ghi kèm tác phẩm: `ONE (One Punch Man)`.

## Máy làm giúp

`scripts/normalize-tags.mjs` (đã nối vào `npm run hubs`) tự gỡ thẻ chung, gộp tên, đổi tên tác phẩm theo hồ sơ, gỡ thẻ nền tảng nếu tiêu đề không nhắc, và sửa href về `/tag?q=`. Bảng quy tắc ở `scripts/data/tag-canon.json`:

- `generic`: gỡ ở mọi bài
- `titleOnly`: nền tảng/nguồn tin, chỉ giữ khi tên có trong tiêu đề
- `canon`: tên khác nhau → một tên chuẩn (`"-"` = gỡ)
- `brandName`: ghi đè tên chuẩn của tác phẩm theo slug hồ sơ

Gặp thẻ chung/trùng mới thì thêm vào file đó rồi chạy `node scripts/normalize-tags.mjs && node scripts/sync-search-tags.mjs`. Kiểm tra không ghi: thêm `--check`.
