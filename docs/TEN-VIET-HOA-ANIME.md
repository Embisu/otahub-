# Tên Việt hóa anime / manga dùng trên OtaHub (bản VI)

Quy ước (áp dụng từ 2/10/2026 cho toàn bộ bản VI: bài hub Anime và Manga, hub, bảng xếp hạng, hồ sơ tác phẩm, lịch phát sóng, trang Đánh giá):

- **Tiêu đề (H1, og:title, breadcrumb, JSON-LD)**: dùng tên Việt hóa. Tên ít phổ biến thì kèm tên gốc trong ngoặc, ví dụ `Thợ Rèn Huyền Thoại (Overgeared)`.
- **Thẻ `<title>` / seo-title**: tên Việt hóa + tên gốc trong ngoặc (giữ từ khóa gốc cho SEO).
- **Lần nhắc đầu tiên trong thân bài**: `Tên Việt (tên gốc)`, ví dụ `Pháp Sư Tiễn Táng Frieren (Frieren: Beyond Journey’s End)`; mọi lần nhắc sau tới *tác phẩm* đều dùng tên Việt (kể cả "Pháp Sư Tiễn Táng Frieren mùa 3", "Thợ Săn Quỷ Chainsaw Man – Reze Arc").
- Tên nhân vật trùng tên tác phẩm (Frieren, Conan, Naruto...) giữ nguyên khi chỉ nhân vật ("Frieren và Fern"); khi chỉ series ("Frieren mùa 3", "anime Frieren", "phim Conan") thì dùng tên Việt.
- **Slug URL**: đoạn tên trong slug cũng Việt hóa (`phap-su-tien-tang-frieren-...`, `chu-thuat-hoi-chien-...`); đổi slug bài cũ thì thêm dòng 301 vào `_redirects` và thay link toàn site (index, news, hub, feed, search.js, author, ho-so, trang EN, en-pairs.json).
- **Tag "Chủ đề"** trong sidebar: tên tác phẩm trong tag cũng là tên Việt; không để bộ tag mặc định (Gaming/Anime/Manga/Đánh giá/Xếp hạng).
- **Ảnh trong bài**: luôn dùng `<figure><img alt="..."><figcaption>...</figcaption></figure>`; alt và caption dùng tên Việt.
- **Hồ sơ tác phẩm** (`/ho-so/<slug>`): tên hiển thị VI khai báo trong `assets/series.json` (`name` = tên Việt, `nameEn` = tên gốc cho trang EN); chạy `node scripts/build-profiles.mjs` sau khi sửa.
- **Lịch phát sóng** (`assets/schedule-data.js`): thêm trường `tv` = tên Việt cho tựa có tên Việt; `schedule.js` dùng `tv` ở bản VI, `t` ở bản EN.
- **Xếp hạng / Đánh giá**: tên trong mảng `REVIEWS` của `reviews.html` (VI) và bảng `DISPLAY` trong `scripts/build-rankings.mjs` dùng tên Việt; chạy `npm run scores` sau khi sửa.
- **Catalog** (`assets/catalog.json`): khóa giữ tên gốc (đường dẫn hồ sơ phụ thuộc khóa); chỉ các trường văn bản VI (hook, story, verdict, reviewSummary...) dùng tên Việt.
- Bài hub Gaming nói về game chuyển thể (Dragon Ball Sparking! Zero, Kaiju No.8 THE GAME, Solo Leveling: Arise, JoJo Golden Spirit...) giữ tên game gốc.
- Bản EN (`/en/...`) giữ tên tiếng Anh và slug tiếng Anh, không đổi.

## Bảng tên (nguồn: NXB Kim Đồng / IPM, Netflix VN, rạp Việt)

| Tên gốc | Tên Việt hóa dùng trên site |
|---|---|
| Frieren: Beyond Journey’s End / Sousou no Frieren | Pháp Sư Tiễn Táng Frieren |
| Jujutsu Kaisen | Chú Thuật Hồi Chiến |
| Chainsaw Man | Thợ Săn Quỷ Chainsaw Man |
| Demon Slayer / Kimetsu no Yaiba | Thanh Gươm Diệt Quỷ (Infinity Castle → Vô Hạn Thành) |
| Attack on Titan | Đại Chiến Titan |
| Spy x Family | Gia Đình Điệp Viên |
| Oshi no Ko | Đứa Con Của Thần Tượng |
| Solo Leveling | Tôi Thăng Cấp Một Mình |
| Kaiju No. 8 | Quái Vật Số 8 |
| Dragon Ball (Super / DAIMA / Z) | Bảy Viên Ngọc Rồng (Super / DAIMA / Z) |
| Bleach: Thousand-Year Blood War | Bleach: Huyết Chiến Ngàn Năm |
| Re:Zero | Re:Zero − Bắt Đầu Lại Ở Thế Giới Khác (chỉ lần nhắc đầu) |
| KonoSuba | Chúc Phúc Cho Thế Giới Tuyệt Vời Này! (KonoSuba) |
| Mushoku Tensei | Thất Nghiệp Chuyển Sinh |
| Tensei Shitara Slime Datta Ken | Chuyển Sinh Thành Slime |
| The Apothecary Diaries / Kusuriya no Hitorigoto | Dược Sư Tự Sự |
| Detective Conan | Thám Tử Lừng Danh Conan |
| The Phantom of Baker Street | Bóng Ma Phố Baker |
| Gintama | Linh Hồn Bạc (Gintama), sau đó Linh Hồn Bạc |
| JoJo’s Bizarre Adventure: Steel Ball Run | Steel Ball Run: Cuộc Phiêu Lưu Kì Lạ Của JoJo |
| Overgeared | Thợ Rèn Huyền Thoại |
| Magic Knight Rayearth | Hiệp Sĩ Phép Màu |
| Skip and Loafer | Nhịp Bước Tuổi Xanh |
| Reincarnated as a Sword | Chuyển Sinh Thành Kiếm |
| Chained Soldier / Mato Seihei no Slave | Nô Lệ Của Ma Đô Tinh Binh |
| Battle Through the Heavens | Đấu Phá Thương Khung |
| KPop Demon Hunters | Thợ Săn Quỷ K-Pop |
| Witch Hat Atelier | Xưởng Phép Thuật |
| Galaxy Express 999 | Chuyến Tàu Ngân Hà 999 |
| Record of Ragnarok | Đại Chiến Nhân Thần (Record of Ragnarok) |
| Hell’s Paradise: Jigokuraku | Địa Ngục Cực Lạc |
| Mashle: Magic and Muscles | Mashle: Ma Thuật Và Cơ Bắp |
| Liar Game | Trò Chơi Dối Trá (Liar Game) |
| Lycoris Recoil | Lycoris Recoil: Quán Cà Phê Bất Ổn |
| Bungo Stray Dogs | Văn Hào Lưu Lạc |
| Delicious in Dungeon | Mỹ Vị Hầm Ngục |
| Fullmetal Alchemist | Giả Kim Thuật Sư |
| Kaguya-sama: Love Is War | Kaguya-sama: Cuộc Chiến Tỏ Tình |
| Black Clover | Thế Giới Phép Thuật (Black Clover) |
| Sailor Moon | Thủy Thủ Mặt Trăng |
| Your Name. | Tên Cậu Là Gì? |
| Suzume | Khóa Chặt Cửa Nào Suzume |
| Weathering With You | Đứa Con Của Thời Tiết |
| Laputa | Laputa: Lâu Đài Trên Không |
| Swallowed Star | Thôn Phệ Tinh Không |
| Martial Peak | Võ Luyện Đỉnh Phong |
| Wu Shen Zhu Zai | Võ Thần Chúa Tể |
| Rebirth of the Urban Immortal | Trọng Sinh Đô Thị Tu Tiên |
| Omniscient Reader | Toàn Trí Độc Giả |

## Giữ nguyên tên gốc (chưa có tên Việt chính thức/phổ biến)

One Piece, Naruto, Dandadan, Sakamoto Days, Tokyo Revengers, Kagurabachi, Haikyu!!, Doraemon, Chiikawa, Ranma 1/2, Aoashi, Blue Box (Ao no Hako), Tougen Anki, Link Click, Code Geass, Made in Abyss, Hunter x Hunter, Berserk, Gachiakuta, Hell Mode, Diamond no Ace, Ghost in the Shell, Bride of the Barrier Master, The Beginning After the End, Mii-chan and Miss Yamada, Senren Banka, Studio Cabana, Phantom Busters, The Bugle Call, The Ribbon Hero, We Are Aliens, Forgotten Island, Free Fire Daybreak, Hololive, Lookism và các aeni Hàn Quốc.
