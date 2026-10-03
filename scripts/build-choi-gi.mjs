import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { verifiedReviews, articleFile } from './lib/review-scores.mjs';
import { profilePaths, aliasPaths, localize, profileSeries, slugify } from './lib/profile-paths.mjs';

const root = path.resolve(import.meta.dirname, '..');

// ═════════════════════════════════════════════════════════════════════
// 1. DỮ LIỆU: 48 TỰA TUYỂN CHỌN (VI & EN). Trường score bên dưới KHÔNG được dùng,
//    điểm lấy từ bài review (xem REVIEW_OF ở mục 2).
// ═════════════════════════════════════════════════════════════════════

const VI_ITEMS = [
  // ── 16 GAMES ───────────────────────────────────────────────────────
  {
    id: 'elden-ring',
    type: 'game',
    name: 'Elden Ring: Shadow of the Erdtree',
    creator: 'FromSoftware · 2024',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Action RPG · Soulslike',
    moods: ['action', 'story', 'challenge', 'explore', 'coop'],
    time: '25 - 50h (riêng DLC)',
    score: 9.8,
    img: '/assets/img/a7f47ed998-header.jpg',
    why: 'Thế giới Lands Between và Realm of Shadow đẹp đến nghẹt thở. Từng phế tích, từng con boss đều mang lại cảm giác thỏa mãn tột độ khi chinh phục.',
    link: '/elden-ring-shadow-of-the-erdtree-review',
    color: ['#1a0c08', '#3d1a00']
  },
  {
    id: 'wuwa',
    type: 'game',
    name: 'Wuthering Waves',
    creator: 'Kuro Games · 2024',
    format: 'PC / Mobile / PS5',
    subType: 'mobile',
    genre: 'Action RPG · Open World',
    moods: ['action', 'explore', 'story', 'quick'],
    time: 'Chơi lâu dài (Live-service)',
    score: 9.5,
    img: '/assets/img/c53329917b-wuthering-waves-hero.jpg',
    why: 'Hệ thống chiến đấu parkour, né đòn và parry mượt nhất thị trường game gacha. Khám phá thế giới hậu tận thế với đồ họa Unreal Engine sắc sảo.',
    link: '/wuthering-waves-review',
    color: ['#050810', '#0a1228']
  },
  {
    id: 'hades2',
    type: 'game',
    name: 'Hades II',
    creator: 'Supergiant Games · 2025',
    format: 'PC / Switch',
    subType: 'pc',
    genre: 'Roguelite · Action',
    moods: ['quick', 'action', 'story', 'challenge'],
    time: '20 - 60h',
    score: 9.4,
    img: '/assets/img/uploads/hades-2-melinoe-key-art.webp',
    why: 'Melinoë bước vào trận chiến ma thuật với thần thời gian Chronos. Mỗi run 20-30 phút đều mới mẻ với thoại lồng tiếng đỉnh cao và nhạc nền rực lửa.',
    link: '/hades-2-khong-phai-lua-chon-kinh-doanh-an-toan-cua-supergian',
    color: ['#1a0508', '#3d0010']
  },
  {
    id: 'mhwilds',
    type: 'game',
    name: 'Monster Hunter Wilds',
    creator: 'Capcom · 2025',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Hunting Action · Co-op',
    moods: ['action', 'coop', 'challenge', 'explore'],
    time: '80 - 300h',
    score: 9.4,
    img: '/assets/img/587e72813c-header.jpg',
    why: 'Săn quái vật cùng 3 người bạn trên lưng thú cưỡi Seikret. Hệ thống thời tiết động khắc nghiệt và đàn quái khổng lồ nâng tầm thể loại săn bắn.',
    link: '/monster-hunter-wilds-review',
    color: ['#0a0e05', '#1a280a']
  },
  {
    id: 'genshin',
    type: 'game',
    name: 'Genshin Impact: Natlan',
    creator: 'HoYoverse · 2024',
    format: 'Mobile / PC / Console',
    subType: 'mobile',
    genre: 'Open World RPG',
    moods: ['relax', 'explore', 'story', 'quick'],
    time: 'Chơi lâu dài',
    score: 9.1,
    img: '/assets/img/real-genshin-natlan.jpg',
    why: 'Vùng đất lửa Natlan với cơ chế hóa thân Saurian lướt dung nham và leo vách đá cực chill. Rất thích hợp làm 30-45 phút nhiệm vụ thư giãn mỗi tối.',
    link: '/genshin-natlan-review',
    color: ['#050a0a', '#0a1a14']
  },
  {
    id: 'stellar-blade',
    type: 'game',
    name: 'Stellar Blade',
    creator: 'Shift Up · 2024',
    format: 'Console / PC',
    subType: 'console',
    genre: 'Action Adventure',
    moods: ['action', 'challenge', 'explore'],
    time: '25 - 40h',
    score: 9.2,
    img: '/assets/img/ec5a6e3960-maxresdefault.jpg',
    why: 'Hành động tốc độ cao đậm chất hack-and-slash với âm nhạc ma mị và tạo hình nhân vật Eve ấn tượng. Combat đòi hỏi canh nhịp phản xạ chuẩn xác.',
    link: '/stellar-blade-2',
    color: ['#080a18', '#141838']
  },
  {
    id: 'kcd2',
    type: 'game',
    name: 'Kingdom Come: Deliverance II',
    creator: 'Warhorse Studios · 2025',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Medieval RPG',
    moods: ['story', 'explore', 'challenge'],
    time: '70 - 120h',
    score: 9.3,
    img: '/assets/img/50c4f9b171-library_hero.jpg',
    why: 'Henry xứ Skalitz trở lại Bohemia năm 1403 trong một thế giới Trung Cổ mô phỏng chân thực đến từng chi tiết. Cốt truyện dài hơi, nhiều lựa chọn và trận công thành Suchdol hoành tráng.',
    link: '/kingdom-come-deliverance-2',
    color: ['#140d05', '#2a1a08']
  },
  {
    id: 'witcher3',
    type: 'game',
    name: 'The Witcher 3: Wild Hunt',
    creator: 'CD PROJEKT RED · 2015',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Open World RPG',
    moods: ['story', 'explore', 'relax', 'action'],
    time: '80 - 150h',
    score: 9.8,
    img: '/assets/img/uploads/yboyto0l-images-17.jpg',
    why: 'Tượng đài nhập vai phương Tây với cốt truyện xuất sắc đến từng nhiệm vụ phụ. Bản Remastered miễn phí ra ngày 29/9/2026, chơi được cả trên Switch 2.',
    link: '/the-witcher-3-remastered-review-nang-cap-hinh-anh-nhung-chua',
    color: ['#0a0814', '#18122c']
  },
  {
    id: 'cyberpunk',
    type: 'game',
    name: 'Cyberpunk 2077: Phantom Liberty',
    creator: 'CD PROJEKT RED · 2023',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Sci-Fi Action RPG',
    moods: ['story', 'action', 'explore', 'challenge'],
    time: '40 - 100h',
    score: 9.4,
    img: '/assets/img/recommend-cyberpunk.jpg',
    why: 'Thành phố tương lai Night City rực sáng ánh đèn neon. Cốt truyện gián điệp nghẹt thở cùng Idris Elba và hệ thống chiến đấu nâng cấp hoàn hảo.',
    link: null,
    color: ['#0f0515', '#280a35']
  },
  {
    id: 'bmw',
    type: 'game',
    name: 'Black Myth: Wukong',
    creator: 'Game Science · 2024',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Action RPG · Mythology',
    moods: ['action', 'challenge', 'story'],
    time: '35 - 55h',
    score: 9.3,
    img: '/assets/img/7403bc0e49-header.jpg',
    why: 'Hóa thân thành Thiên Mệnh Nhân tái hiện hành trình Tây Du Ký. Đồ họa Unreal Engine 5 đỉnh cao và dàn boss biến hóa khôn lường.',
    link: '/black-myth-wukong-review',
    color: ['#140803', '#2a1205']
  },
  {
    id: 'hsr',
    type: 'game',
    name: 'Honkai: Star Rail',
    creator: 'HoYoverse · 2023',
    format: 'Mobile / PC / Console',
    subType: 'mobile',
    genre: 'Space Fantasy RPG',
    moods: ['story', 'relax', 'quick'],
    time: 'Chơi lâu dài',
    score: 9.3,
    img: '/assets/img/681306c50c-143582l.jpg',
    why: 'Chuyến tàu Ngân Hà khai phá các vì sao với cốt truyện đậm tính điện ảnh. Lối đánh theo lượt chiến thuật tinh tế, dễ tiếp cận trên mọi thiết bị.',
    link: '/honkai-star-rail-review',
    color: ['#080414', '#150a2e']
  },
  {
    id: 'stardew',
    type: 'game',
    name: 'Stardew Valley',
    creator: 'ConcernedApe · 2016',
    format: 'PC / Mobile / Console',
    subType: 'pc',
    genre: 'Farming Sim · Co-op',
    moods: ['relax', 'quick', 'coop'],
    time: '40 - 200h',
    score: 9.5,
    img: '/assets/img/recommend-stardew.jpg',
    why: 'Liều thuốc chữa lành tâm hồn hoàn hảo. Trồng trọt, câu cá, kết bạn trong làng và xây dựng trang trại trong mơ một mình hoặc cùng bạn bè.',
    link: null,
    color: ['#0a1a06', '#1a3d0a']
  },
  {
    id: 'split-fiction',
    type: 'game',
    name: 'Split Fiction',
    creator: 'Hazelight Studios · 2025',
    format: 'PC / Console',
    subType: 'console',
    genre: 'Co-op Adventure',
    moods: ['coop', 'story', 'quick', 'action'],
    time: '14 - 16h',
    score: 9.6,
    img: '/assets/img/4c8ef98e63-split-fiction-review-hero.jpg',
    why: 'Mio và Zoe kẹt giữa hai thế giới khoa học viễn tưởng và giả tưởng. Mỗi màn một cơ chế mới, chơi co-op 2 người, bạn bè chơi miễn phí nhờ Friend’s Pass.',
    link: null,
    color: ['#050f0a', '#0a1e14']
  },
  {
    id: 'hollow-knight',
    type: 'game',
    name: 'Hollow Knight',
    creator: 'Team Cherry · 2017',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Metroidvania · Action',
    moods: ['challenge', 'explore', 'story'],
    time: '30 - 60h',
    score: 9.6,
    img: '/assets/img/recommend-hollow.jpg',
    why: 'Vương quốc côn trùng Hallownest bí ẩn dưới lòng đất. Nhạc nền u buồn da diết, cơ chế né đòn chuẩn xác và những trận chiến boss đầy thử thách.',
    link: null,
    color: ['#050a12', '#0a1728']
  },
  {
    id: 'celeste',
    type: 'game',
    name: 'Celeste',
    creator: 'Maddy Makes Games · 2018',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Platformer · Indie Masterpiece',
    moods: ['challenge', 'quick', 'story'],
    time: '10 - 20h',
    score: 9.4,
    img: '/assets/img/recommend-celeste.jpg',
    why: 'Hành trình vượt qua ngọn núi hiểm trở và đối mặt với nỗi sợ bản thân của cô gái Madeline. Thiết kế màn chơi xuất sắc tới từng pixel.',
    link: null,
    color: ['#0a0815', '#1a1030']
  },
  {
    id: 'disco-elysium',
    type: 'game',
    name: 'Disco Elysium: The Final Cut',
    creator: 'ZA/UM · 2021',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Narrative RPG · Detective',
    moods: ['story', 'relax', 'challenge'],
    time: '30 - 50h',
    score: 9.7,
    img: '/assets/img/recommend-disco.jpg',
    why: 'Đỉnh cao của nghệ thuật biên kịch trong thế giới game. Điều tra vụ án mạng kỳ lạ trong thành phố Revachol bằng tư duy, tâm lý và những ngã rẽ đạo đức.',
    link: null,
    color: ['#100805', '#241208']
  },

  // ── 16 ANIME ───────────────────────────────────────────────────────
  {
    id: 'frieren',
    type: 'anime',
    name: 'Pháp Sư Tiễn Táng Frieren (Mùa 1 & 2)',
    creator: 'Madhouse',
    format: 'TV Series (2 mùa)',
    subType: 'series',
    genre: 'Fantasy · Slice of Life',
    moods: ['relax', 'story', 'explore'],
    time: '38 tập (28 + 10)',
    score: 9.9,
    img: '/assets/img/news-frieren-season-2-official-visual.jpg',
    why: 'Kiệt tác fantasy sâu lắng nhất thập kỷ. Chuyến phiêu lưu của nàng pháp sư elf sau khi đánh bại Ma Vương, thấu hiểu ý nghĩa của thời gian và tình người.',
    link: '/frieren-mua-2-phat-song-thang-1-2026',
    color: ['#06141c', '#0f2c3a']
  },
  {
    id: 'demon-slayer-infinity-castle',
    type: 'anime',
    name: 'Thanh Gươm Diệt Quỷ: Vô Hạn Thành (Trilogy 1)',
    creator: 'Ufotable',
    format: 'Phim chiếu rạp (155 phút)',
    subType: 'movie',
    genre: 'Dark Fantasy · Action Hype',
    moods: ['action', 'quick', 'challenge', 'coop'],
    time: '2 giờ 35 phút',
    score: 9.8,
    img: '/assets/img/e497ae1e1b-demon-slayer-cover.jpg',
    why: 'Ufotable kết hợp 2D và CG cho những trận chiến đẹp nhất từ trước tới nay. Tanjiro và các Trụ Cột bị Muzan kéo vào Vô Hạn Thành, mở màn trận quyết chiến cuối cùng.',
    link: '/demon-slayer-infinity-castle-review',
    color: ['#1a060d', '#3d0c1c']
  },
  {
    id: 'jjk-culling-game',
    type: 'anime',
    name: 'Chú Thuật Hồi Chiến: Culling Game (Mùa 3)',
    creator: 'MAPPA',
    format: 'TV Series (Mùa 3)',
    subType: 'series',
    genre: 'Shonen · Supernatural Action',
    moods: ['action', 'challenge', 'story', 'coop'],
    time: '12 tập (1–3/2026)',
    score: 9.6,
    img: '/assets/img/news-jujutsu-kaisen-season-3-culling-game.jpg',
    why: 'Kenjaku khởi động Tử Diệt Hồi Du, trò chơi sinh tử ép các chú thuật sư khắp Nhật Bản chiến đấu. Yuji và Megumi lao vào cuộc chơi với những đối thủ và thuật thức mới đầy bất ngờ.',
    link: '/jujutsu-kaisen-culling-game-part-2-sukuna-teaser',
    color: ['#080414', '#150a2e']
  },
  {
    id: 'chainsaw-man-reze',
    type: 'anime',
    name: 'Thợ Săn Quỷ Chainsaw Man: Reze Arc (Movie)',
    creator: 'MAPPA',
    format: 'Phim chiếu rạp (100 phút)',
    subType: 'movie',
    genre: 'Action · Romance Dark',
    moods: ['action', 'story', 'quick'],
    time: '1 giờ 40 phút',
    score: 9.5,
    img: '/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg',
    why: 'Một trong những arc được yêu thích nhất của Tatsuki Fujimoto. Mối tình bộc phát lãng mạn nhưng đẫm máu giữa Denji và cô gái mang trái tim bom Reze.',
    link: '/chainsaw-man-reze-arc-review',
    color: ['#140804', '#2d140a']
  },
  {
    id: 'dandadan-s2',
    type: 'anime',
    name: 'Dandadan Mùa 2',
    creator: 'Science SARU',
    format: 'TV Series (12 tập)',
    subType: 'series',
    genre: 'Supernatural · Action Comedy',
    moods: ['action', 'coop', 'relax', 'quick'],
    time: '12 tập (~5 giờ)',
    score: 9.4,
    img: '/assets/img/news-dandadan-season-2-evil-eye.jpg',
    why: 'Sự kết hợp điên rồ giữa người ngoài hành tinh, ma quỷ dân gian và chuyện tình gà bông tuổi học trò. Tiết tấu dồn dập khiến bạn cười sặc sụa.',
    link: '/dandadan-mua-2-cursed-house-evil-eye',
    color: ['#140212', '#2d0829']
  },
  {
    id: 'jojo-sbr',
    type: 'anime',
    name: "Steel Ball Run: Cuộc Phiêu Lưu Kì Lạ Của JoJo",
    creator: 'David Production',
    format: 'TV Series (Netflix)',
    subType: 'series',
    genre: 'Adventure · Action Strategy',
    moods: ['action', 'story', 'explore', 'challenge'],
    time: '1st Stage + 11 tập (2026)',
    score: 9.7,
    img: '/assets/img/real-jojo-sbr-stage2.jpg',
    why: 'Phần truyện được cộng đồng đánh giá xuất sắc nhất trong vũ trụ JoJo. Cuộc đua ngựa nghìn dặm xuyên nước Mỹ đầy bí ẩn và mưu lược nghẹt thở.',
    link: '/jojo-steel-ball-run-stage-2-3-len-song-25-9',
    color: ['#120e03', '#2a2007']
  },
  {
    id: 'aoashi-s2',
    type: 'anime',
    name: 'Aoashi Mùa 2',
    creator: 'TMS Entertainment',
    format: 'TV Series (từ 4/10/2026)',
    subType: 'series',
    genre: 'Sports · Drama',
    moods: ['challenge', 'story', 'quick', 'coop'],
    time: '24 tập',
    score: 9.3,
    img: '/assets/img/poster-real-aoashi-s2.jpg',
    why: 'Anime bóng đá chân thực và thông minh nhất hiện nay. Không chiêu trò siêu nhiên, chỉ có chiến thuật đỉnh cao và hành trình vượt lên nghịch cảnh.',
    link: '/aoashi-mua-2-doi-studio-len-song-4-10',
    color: ['#021008', '#072414']
  },
  {
    id: 'vinland-saga',
    type: 'manga',
    name: 'Vinland Saga',
    creator: 'Makoto Yukimura',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Historical · Seinen',
    moods: ['story', 'challenge', 'explore'],
    time: '14 tập (đã hoàn thành)',
    score: 9.7,
    img: '/assets/img/7807ea1948-vinland-saga-manga-hero.jpg',
    why: 'Hành trình 20 năm của Thorfinn từ cậu bé Viking nung nấu báo thù đến người đàn ông đi tìm vùng đất không chiến tranh. Một trong những manga vĩ đại nhất.',
    link: '/vinland-saga-manga-review',
    color: ['#100a06', '#22150c']
  },
  {
    id: 'spy-family',
    type: 'anime',
    name: 'Gia Đình Điệp Viên',
    creator: 'WIT Studio · CloverWorks',
    format: 'TV Series (3 mùa)',
    subType: 'series',
    genre: 'Comedy · Action · Slice of Life',
    moods: ['relax', 'quick', 'coop', 'story'],
    time: '3 mùa (2022–2025)',
    score: 9.2,
    img: '/assets/img/real-spy-family-banner.jpg',
    why: 'Gia đình Forger gồm điệp viên Loid, sát thủ Yor và cô bé đọc suy nghĩ Anya. Những tình huống dở khóc dở cười cực kỳ ấm áp và giải tỏa căng thẳng.',
    link: '/spy-x-family-anime-review',
    color: ['#061214', '#0d282a']
  },
  {
    id: 'aot',
    type: 'anime',
    name: 'Đại Chiến Titan: The Final Season',
    creator: 'MAPPA',
    format: 'TV Series · Mùa cuối',
    subType: 'series',
    genre: 'Dark Fantasy · Action Epic',
    moods: ['story', 'challenge', 'action', 'explore'],
    time: '28 tập + 2 phần đặc biệt',
    score: 9.9,
    img: '/assets/img/48ca2f8976-attack-on-titan-final-season-hero.jpg',
    why: 'Cuộc Địa Minh (Rumbling) quét qua thế giới và hồi kết bi tráng của Eren Yeager. Tượng đài anime kinh điển không thể bỏ qua.',
    link: '/attack-on-titan-wit-teaser',
    color: ['#120804', '#2a140a']
  },
  {
    id: 'rezero',
    type: 'anime',
    name: 'Re:Zero Mùa 4',
    creator: 'White Fox',
    format: 'TV Series',
    subType: 'series',
    genre: 'Isekai · Psychological Dark',
    moods: ['story', 'challenge', 'quick'],
    time: '19 tập (4–9/2026)',
    score: 9.4,
    img: '/assets/img/087af8ed98-rezero-s4-hero.jpg',
    why: 'Khả năng Trở Về Từ Cõi Chết của Subaru đối mặt với những âm mưu tăm tối của các Đại Tội Giám Mục. Kịch tính tới nghẹt thở từng phút giây.',
    link: '/rezero-mua-4-tap-cuoi-keo-dai-45-phut-30-9',
    color: ['#0a0515', '#1a0d30']
  },
  {
    id: 'bleach-tybw',
    type: 'anime',
    name: 'Bleach: Huyết Chiến Ngàn Năm',
    creator: 'Studio Pierrot',
    format: 'TV Series (đã hoàn thành)',
    subType: 'series',
    genre: 'Action · Supernatural Shonen',
    moods: ['action', 'challenge', 'coop'],
    time: '4 phần · 50 tập (2022–2026)',
    score: 9.5,
    img: '/assets/img/bleach-tybw-poster.jpg',
    why: 'Chất lượng hoạt họa chiếu rạp được đầu tư vào từng khung hình TV series. Ichigo và các Đội trưởng Hộ Đình 13 quyết chiến Đế chế Quincy.',
    link: '/bleach-tybw-the-calamity-25-7-2026',
    color: ['#100204', '#260608']
  },
  {
    id: 'laputa',
    type: 'anime',
    name: 'Laputa: Lâu Đài Trên Không',
    creator: 'Studio Ghibli · Hayao Miyazaki',
    format: 'Movie Chiếu Rạp (124 phút)',
    subType: 'movie',
    genre: 'Adventure · Classic Ghibli',
    moods: ['explore', 'relax', 'story', 'quick'],
    time: '2h 04m',
    score: 9.6,
    img: '/assets/img/uploads/eofdaug8-maxresdefault-1.jpg',
    why: 'Kiệt tác hoạt hình vẽ tay kinh điển của đạo diễn huyền thoại Hayao Miyazaki. Hành trình tìm kiếm lâu đài bay Laputa hòa quyện âm nhạc tuyệt mỹ của Joe Hisaishi.',
    link: '/laputa-lau-dai-tren-khong-tro-lai-rap-viet-2026',
    color: ['#041018', '#0a2436']
  },
  {
    id: 'haikyuu-movie',
    type: 'anime',
    name: 'Haikyu!!: Trận Chiến Bãi Phế Liệu',
    creator: 'Production I.G',
    format: 'Movie Chiếu Rạp (85 phút)',
    subType: 'movie',
    genre: 'Sports · Action Hype',
    moods: ['coop', 'quick', 'challenge'],
    time: '1h 25m',
    score: 9.5,
    img: '/assets/img/1aa6c988b4-haikyuu-cover.jpg',
    why: 'Trận đại chiến định mệnh giữa Karasuno và Nekoma. Góc nhìn thứ nhất mô phỏng đường bóng chuyền nghẹt thở, nhiệt huyết bùng cháy trong từng pha đập bóng.',
    link: '/haikyu-movie2-little-giant-teaser',
    color: ['#120802', '#2a1405']
  },
  {
    id: 'blue-lock-s2',
    type: 'anime',
    name: 'Blue Lock Mùa 2: U-20 Arc',
    creator: 'Eight Bit',
    format: 'TV Series',
    subType: 'series',
    genre: 'Sports · Action Survival',
    moods: ['challenge', 'action', 'coop'],
    time: '14 tập',
    score: 9.2,
    img: '/assets/img/blue-lock-banner.jpg',
    why: 'Dự án ngục tối bóng đá khắc nghiệt nhất. Các tiền đạo thiên tài cạnh tranh sinh tử để giành vé đối đầu đội tuyển U-20 Quốc gia Nhật Bản.',
    link: null,
    color: ['#030a18', '#081636']
  },
  {
    id: 'oshi-no-ko',
    type: 'anime',
    name: 'Đứa Con Của Thần Tượng',
    creator: 'Doga Kobo',
    format: 'TV Series (3 mùa)',
    subType: 'series',
    genre: 'Drama · Idol · Mystery',
    moods: ['story', 'quick', 'relax'],
    time: '3 mùa · 35 tập',
    score: 9.3,
    img: '/assets/img/9506aefbae-oshi-no-ko-hero.jpg',
    why: 'Góc khuất ngành giải trí Nhật Bản qua câu chuyện báo thù của Aqua và giấc mơ idol của Ruby. Mở đầu chấn động, càng xem càng cuốn.',
    link: '/kaiju-no-8-manga-review',
    color: ['#02140c', '#062d1a']
  },

  // ── 16 MANGA & MANHWA ──────────────────────────────────────────────
  {
    id: 'solo-leveling-ragnarok',
    type: 'manga',
    name: 'Solo Leveling: Ragnarok',
    creator: 'REDICE Studio · Daul',
    format: 'Manhwa Hàn Quốc (Webtoon)',
    subType: 'manhwa',
    genre: 'Action · Hunter Fantasy',
    moods: ['action', 'challenge', 'quick', 'explore'],
    time: 'Đọc cuộn (Webtoon)',
    score: 9.5,
    img: '/assets/img/news-solo-leveling-ragnarok-manhwa.jpg',
    why: 'Hậu truyện chính thức xoay quanh con trai của Sung Jin-woo: Sung Su-ho kế thừa huyết mạch Hoàng Đế Bóng Tối. Nét vẽ full-color siêu mãn nhãn.',
    link: '/solo-leveling-ragnarok-manhwa-review',
    color: ['#040a14', '#0a172e']
  },
  {
    id: 'one-piece-final',
    type: 'manga',
    name: 'One Piece: Elbaf & Final Saga',
    creator: 'Eiichiro Oda · Shonen Jump',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Adventure · Shonen',
    moods: ['explore', 'story', 'action', 'coop'],
    time: '1194 chương (đang ra)',
    score: 9.9,
    img: '/assets/img/pool-one-piece-2.jpg',
    why: 'Thời khắc lịch sử của vương quốc người khổng lồ Elbaf và những bí mật lớn nhất về Thế Kỷ Trống được Oda hé lộ sau gần 30 năm đồng hành cùng băng Mũ Rơm.',
    link: '/one-piece-final-saga-review',
    color: ['#120803', '#2a1207']
  },
  {
    id: 'kagurabachi',
    type: 'manga',
    name: 'Kagurabachi',
    creator: 'Takeru Hokazono · Shonen Jump',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Dark Action · Katana Sorcery',
    moods: ['action', 'quick', 'challenge'],
    time: '130+ chương · 12 tập',
    score: 9.4,
    img: '/assets/img/1acdb70bf9-kagurabachi-review-hero.jpg',
    why: 'Hiện tượng manga ăn khách nhất thế hệ mới của tạp chí Shonen Jump. Góc quay điện ảnh đột phá và những trận đấu kiếm yêu đao ma thuật cực kỳ đã mắt.',
    link: '/kagurabachi-review',
    color: ['#100204', '#260408']
  },
  {
    id: 'berserk',
    type: 'manga',
    name: 'Berserk',
    creator: 'Kentaro Miura · Studio Gaga',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Dark Fantasy · Seinen',
    moods: ['story', 'challenge', 'action'],
    time: '384+ chương (Studio Gaga)',
    score: 9.9,
    img: '/assets/img/7b5a968234-maxresdefault.jpg',
    why: 'Bức tường thành của Dark Fantasy thế giới. Kiếm sĩ Đen Guts đối đầu số phận nghiệt ngã với từng nét vẽ chi tiết như tranh khắc gỗ thời Phục hưng.',
    link: '/berserk-arc-cuoi',
    color: ['#120303', '#280606']
  },
  {
    id: 'boruto-tbv',
    type: 'manga',
    name: 'Boruto: Two Blue Vortex',
    creator: 'Masashi Kishimoto · Mikio Ikemoto',
    format: 'Manga Hàng Tháng',
    subType: 'manga',
    genre: 'Ninja · Action Sci-Fi',
    moods: ['action', 'story', 'challenge'],
    time: '37 chương (ra hàng tháng)',
    score: 9.1,
    img: '/assets/img/boruto-naruto-next-generations-banner.jpg',
    why: 'Giai đoạn timeskip đảo ngược tình thế chấn động: Boruto bị cả làng săn đuổi trong khi sức mạnh Thần Thụ trỗi dậy đe dọa toàn bộ ngũ đại cường quốc.',
    link: '/sarada-mangekyo-sharingan-suc-manh-ho-den-ohirume',
    color: ['#040a12', '#0a1728']
  },
  {
    id: 'black-clover',
    type: 'manga',
    name: 'Thế Giới Phép Thuật: Hồi Kết',
    creator: 'Yūki Tabata',
    format: 'Manga Hoàn Thành',
    subType: 'manga',
    genre: 'Magic · Action Shonen',
    moods: ['action', 'coop', 'quick', 'challenge'],
    time: 'Đã hoàn thành (392 chương)',
    score: 9.2,
    img: '/assets/img/75f4272c97-black-clover-final-volume-hero.jpg',
    why: 'Cậu bé không phép thuật Asta vung thanh cự kiếm phản ma pháp cùng biệt đội Hắc Bộc Ngưu bảo vệ Vương quốc Clover. Hype tột độ từ đầu đến cuối.',
    link: '/black-clover-final-volume-review',
    color: ['#080410', '#130a24']
  },
  {
    id: 'blue-lock',
    type: 'manga',
    name: 'Blue Lock',
    creator: 'Muneyuki Kaneshiro · Yusuke Nomura',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Sports · Battle Royale',
    moods: ['action', 'coop', 'challenge', 'quick'],
    time: '360+ chương (đang ra)',
    score: 9.4,
    img: '/assets/img/b9352651c2-bluelock.jpg',
    why: 'Manga thể thao kịch tính như phim hành động sinh tử. Triết lý tôi luyện cái tôi vị kỷ để tạo ra tiền đạo số 1 thế giới khiến người đọc không thể dừng lại.',
    link: null,
    color: ['#020a18', '#081736']
  },
  {
    id: 'haikyu',
    type: 'manga',
    name: 'Haikyu!!',
    creator: 'Haruichi Furudate',
    format: 'Manga Hoàn Thành (402 chap)',
    subType: 'manga',
    genre: 'Sports · Teamwork & Passion',
    moods: ['coop', 'story', 'quick', 'relax'],
    time: '402 Chapter',
    score: 9.8,
    img: '/assets/img/pool-haikyu-2.jpg',
    why: 'Bài ca bất hủ về tinh thần đồng đội và đam mê tuổi trẻ. Chú quạ nhỏ Hinata Shoyo tung cánh trên sân bóng chuyền thắp sáng mọi trái tim độc giả.',
    link: '/haikyu-movie2-little-giant-teaser',
    color: ['#120802', '#2a1405']
  },
  {
    id: 'kaiju-no-8',
    type: 'manga',
    name: 'Quái Vật Số 8',
    creator: 'Naoya Matsumoto · Shonen Jump+',
    format: 'Manga Hoàn Thành',
    subType: 'manga',
    genre: 'Action Sci-Fi · Monster',
    moods: ['action', 'coop', 'quick', 'challenge'],
    time: 'Đã hoàn thành (16 tập)',
    score: 9.3,
    img: '/assets/img/1cd80a8a56-kaiju-no8-cover.jpg',
    why: 'Lực lượng Phòng vệ Nhật Bản đối đầu thảm họa quái vật khổng lồ. Tình đồng đội sát cánh kề vai và những pha đấm vỡ nát Kaiju tràn ngập năng lượng.',
    link: '/kaiju-no-8-manga-review',
    color: ['#02140c', '#062d1a']
  },
  {
    id: 'chainsaw-man-p2',
    type: 'manga',
    name: 'Thợ Săn Quỷ Chainsaw Man: Phần 2 (Học Viện)',
    creator: 'Tatsuki Fujimoto',
    format: 'Manga Hoàn Thành',
    subType: 'manga',
    genre: 'Dark Comedy · Action',
    moods: ['action', 'story', 'quick', 'challenge'],
    time: 'Đã hoàn thành (24 tập)',
    score: 9.5,
    img: '/assets/img/pool-chainsaw-man-manga-2.jpg',
    why: 'Tatsuki Fujimoto tiếp tục phá vỡ mọi quy chuẩn shonen. Cuộc đụng độ giữa Denji, Quỷ Chiến Tranh Asa Mitaka và Quỷ Tử Thần với nhịp độ nghẹt thở.',
    link: '/chainsaw-man-manga-part2-review',
    color: ['#140803', '#2d1408']
  },
  {
    id: 'jujutsu-kaisen-manga',
    type: 'manga',
    name: 'Chú Thuật Hồi Chiến: Đại Chiến Shinjuku',
    creator: 'Gege Akutami',
    format: 'Manga Hoàn Thành (271 chap)',
    subType: 'manga',
    genre: 'Supernatural Action · Sorcery',
    moods: ['action', 'challenge', 'story', 'coop'],
    time: '271 chương (30 tập)',
    score: 9.6,
    img: '/assets/img/pool-jujutsu-kaisen-manga-2.jpg',
    why: 'Trận tử chiến lịch sử giữa Chú thuật sư hiện đại và Vua nguyền hồn Ryomen Sukuna. Mọi thuật thức, bành trướng lãnh địa được phô diễn đến cực hạn.',
    link: '/jujutsu-kaisen-chapter-271-final-climax-epilogue',
    color: ['#080414', '#150a2e']
  },
  {
    id: 'hunter-x-hunter',
    type: 'manga',
    name: 'Hunter x Hunter: Lục Địa Tối',
    creator: 'Yoshihiro Togashi',
    format: 'Manga Shonen Jump',
    subType: 'manga',
    genre: 'Psychological Adventure',
    moods: ['story', 'explore', 'challenge'],
    time: '420 chương (đang tạm nghỉ)',
    score: 9.8,
    img: '/assets/img/photo-hunter-x-hunter-chapter-419-tro-lai.jpg',
    why: 'Bộ não thiên tài của Togashi biến cuộc chiến tranh ngai vàng trên tàu cá voi Đen thành bàn cờ trí tuệ phức tạp, tinh vi và lôi cuốn bậc nhất thế giới.',
    link: '/hunter-x-hunter-chapter-419-tro-lai',
    color: ['#080e04', '#142008']
  },
  {
    id: 'detective-conan',
    type: 'manga',
    name: 'Thám Tử Lừng Danh Conan',
    creator: 'Gosho Aoyama',
    format: 'Manga Trinh Thám',
    subType: 'manga',
    genre: 'Mystery · Detective',
    moods: ['story', 'quick', 'relax', 'coop'],
    time: '1160+ chương (đang ra)',
    score: 9.3,
    img: '/assets/img/news-detective-conan-final-chapter.jpg',
    why: 'Tượng đài trinh thám gắn liền với tuổi thơ nhiều thế hệ. Cuộc đấu trí giữa Conan và Tổ Chức Áo Đen bước vào những tiết lộ then chốt mang tính lịch sử.',
    link: '/detective-conan-final-chapter',
    color: ['#040a18', '#0a1632']
  },
  {
    id: 'hanako-kun',
    type: 'manga',
    name: 'Địa Phủ Hanako-kun',
    creator: 'AidaIro',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Supernatural · Mystery',
    moods: ['relax', 'story', 'quick'],
    time: '130+ chương (đang ra)',
    score: 9.2,
    img: '/assets/img/news-hanako-kun-manga-resumes.jpg',
    why: 'Nét vẽ hoa mỹ độc nhất vô nhị pha trộn thần thoại đô thị học đường Nhật Bản. Chuyện tình ngọt ngào nhưng ẩn chứa những bí mật u tối và cảm động.',
    link: '/hanako-kun-manga-resumes',
    color: ['#12040e', '#280a20']
  },
  {
    id: 'tbate',
    type: 'manga',
    name: 'The Beginning After The End',
    creator: 'TurtleMe · Fuyuki23',
    format: 'Manhwa Webtoon',
    subType: 'manhwa',
    genre: 'Isekai · Magic Progression',
    moods: ['action', 'story', 'explore', 'challenge'],
    time: '250+ chương (Webtoon)',
    score: 9.4,
    img: '/assets/img/3eb1c4a80b-the-beginning-after-the-end.jpg',
    why: 'Vua Grey chuyển sinh thành Arthur Leywin trong lục địa ma pháp Dicathen. Xây dựng thế giới công phu, hệ thống phép thuật chặt chẽ và chiến trường bi tráng.',
    link: '/the-beginning-after-the-end-anime-review',
    color: ['#040c14', '#0a1a2a']
  },
  {
    id: 'dandadan-manga',
    type: 'manga',
    name: 'Dandadan',
    creator: 'Yukinobu Tatsu',
    format: 'Manga Nhật Bản',
    subType: 'manga',
    genre: 'Action · Comedy · Supernatural',
    moods: ['action', 'quick', 'relax'],
    time: '25+ tập (đang ra)',
    score: 9.4,
    img: '/assets/img/2c0d7f7a34-dandadan-manga-hero.jpg',
    why: 'Momo tin ma, Okarun tin người ngoài hành tinh, và cả hai đều đúng. Pha trộn hài, kinh dị, hành động và lãng mạn với nét vẽ bùng nổ.',
    link: '/dandadan-manga-review',
    color: ['#040c14', '#0a1a2a']
  },
  {
    id: 'overgeared',
    type: 'manga',
    name: 'Thợ Rèn Huyền Thoại (Overgeared)',
    creator: 'Park Saenal · Team Argo',
    format: 'Manhwa Hàn Quốc (Webtoon)',
    subType: 'manhwa',
    genre: 'VRMMO · Action Comedy',
    moods: ['action', 'explore', 'quick', 'coop'],
    time: '300+ chương (Webtoon)',
    score: 9.3,
    img: '/assets/img/overgeared-cover.jpg',
    why: 'Từ một gã nợ nần lông bông hóa thân thành Hậu duệ của Pagma trong thế giới game thực tế ảo Satisfy. Chế tạo trang bị thần cấp và quật ngã mọi bảng xếp hạng.',
    link: '/overgeared-anime-len-song-som-tren-prime-video-27-9',
    color: ['#100a04', '#26180a']
  },
  // ── BỔ SUNG: các tựa đã có bài review trên OtaHub ──────────────────
  {
    id: 'ghost-of-yotei',
    type: 'game',
    name: 'Ghost of Yōtei',
    creator: 'Sucker Punch · 2025',
    format: 'PS5',
    subType: 'console',
    genre: 'Open World · Samurai Action',
    moods: ['action', 'explore', 'story', 'challenge'],
    time: '30 - 50h',
    score: 9.3,
    img: '/assets/img/3c84e61b4e-ghost-of-yotei-review-hero.jpg',
    why: 'Atsu lần theo dấu Lục Yêu Quái trên vùng đất Ezo năm 1603. Thế giới mở đẹp như tranh thủy mặc, kiếm thuật đa vũ khí sâu hơn hẳn Ghost of Tsushima.',
    link: '/ghost-of-yotei-review',
    color: ['#0a0f14', '#1a2a30']
  },
  {
    id: 'death-stranding-2',
    type: 'game',
    name: 'Death Stranding 2: On the Beach',
    creator: 'Kojima Productions · 2025',
    format: 'PS5',
    subType: 'console',
    genre: 'Action Adventure · Open World',
    moods: ['story', 'explore', 'relax'],
    time: '40 - 60h',
    score: 9.5,
    img: '/assets/img/9c68ea445d-death-stranding-2-on-the-beach-review-hero.jpg',
    why: 'Sam Porter Bridges nối lại mạng chiral xuyên Mexico và Úc. Hành trình giao hàng độc nhất vô nhị, cốt truyện điên rồ kiểu Kojima và nhạc nền xuất sắc.',
    link: '/death-stranding-2-review',
    color: ['#0b0f12', '#1b2630']
  },
  {
    id: 'mgs-delta',
    type: 'game',
    name: 'Metal Gear Solid Δ: Snake Eater',
    creator: 'Konami · 2025',
    format: 'PC / PS5 / Xbox',
    subType: 'console',
    genre: 'Stealth Action',
    moods: ['story', 'action', 'challenge'],
    time: '15 - 25h',
    score: 8.8,
    img: '/assets/img/ce3825d43e-mgs-delta-snake-eater-review-hero.jpg',
    why: 'Bản làm lại trung thành của Snake Eater trên Unreal Engine 5: giữ nguyên cốt truyện Chiến tranh Lạnh và lối chơi ẩn nấp, sinh tồn trong rừng rậm kinh điển.',
    link: '/metal-gear-solid-delta-review',
    color: ['#0a1208', '#1a2c14']
  },
  {
    id: 'suikoden-star-leap',
    type: 'game',
    name: 'Suikoden STAR LEAP',
    creator: 'Konami · 2025',
    format: 'Mobile',
    subType: 'mobile',
    genre: 'JRPG · Gacha',
    moods: ['story', 'relax', 'quick'],
    time: 'Chơi lâu dài (Live-service)',
    score: 8.8,
    img: '/assets/img/3a6da459ec-suikoden-star-leap-hero.jpg',
    why: 'Suikoden trở lại trên di động với 108 Sao Định Mệnh, chiến đấu theo lượt đội hình 6 người và tinh thần xây dựng căn cứ quen thuộc của dòng game.',
    link: '/suikoden-star-leap-review',
    color: ['#0c0a16', '#1e1a3a']
  },
  {
    id: 'mafia-old-country',
    type: 'game',
    name: 'Mafia: The Old Country',
    creator: 'Hangar 13 · 2025',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Action Adventure · Mafia',
    moods: ['story', 'action'],
    time: '12 - 20h',
    score: 8.3,
    img: '/assets/img/pool-mafia-1.jpg',
    why: 'Sicily đầu thế kỷ 20: Enzo Favara từ mỏ lưu huỳnh bước vào gia tộc Torrisi. Cốt truyện tuyến tính gọn gàng, đậm chất phim mafia cổ điển.',
    link: '/mafia-old-country-review',
    color: ['#140c06', '#2c1a0c']
  },
  {
    id: 'space-marine-2',
    type: 'game',
    name: 'Space Marine 2',
    creator: 'Saber Interactive · 2024',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Third-person Shooter · Co-op',
    moods: ['action', 'coop', 'quick'],
    time: '10 - 15h chiến dịch + Operations',
    score: 8.0,
    img: '/assets/img/space-marine-2-chaos-rising-review-hero.jpg',
    why: 'Titus chém hàng trăm Tyranid trong từng trận; bản mở rộng Chaos Rising thêm chiến dịch co-op 3 người đối đầu thế lực Chaos.',
    link: '/space-marine-2-chaos-rising-review',
    color: ['#120808', '#2a1010']
  },
  {
    id: 'gfl2',
    type: 'game',
    name: "Girls' Frontline 2: Exilium",
    creator: 'MICA Team · 2024',
    format: 'Mobile / PC',
    subType: 'mobile',
    genre: 'Tactical RPG · Gacha',
    moods: ['story', 'challenge', 'quick'],
    time: 'Chơi lâu dài (Live-service)',
    score: 8.5,
    img: '/assets/img/f661df27f7-gfl2-exilium-hero.jpg',
    why: 'Chiến thuật theo lượt kiểu XCOM với địa hình, che chắn và đội hình T-Doll; cốt truyện hậu tận thế nối tiếp phần một.',
    link: '/girls-frontline-2-exilium-danh-gia-chuyen-sau',
    color: ['#08100f', '#102420']
  },
  {
    id: 'kaiju-no-8-game',
    type: 'game',
    name: 'Kaiju No. 8 THE GAME',
    creator: 'Akatsuki Games · 2025',
    format: 'Mobile / PC',
    subType: 'mobile',
    genre: 'Action RPG · Gacha',
    moods: ['action', 'quick', 'coop'],
    time: 'Chơi lâu dài (Live-service)',
    score: 8.5,
    img: '/assets/img/pool-kaiju-game-1.jpg',
    why: 'Hóa thân Kafka và Lực lượng Phòng vệ diệt kaiju với chiến đấu thời gian thực đúng nhịp anime. Hợp fan đã xem anime muốn kéo dài cảm hứng.',
    link: '/kaiju-no-8-the-game-review',
    color: ['#0a0c14', '#141c30']
  },
  {
    id: 'blue-protocol',
    type: 'game',
    name: 'Blue Protocol: Star Resonance',
    creator: 'Bokura · 2025',
    format: 'PC / Mobile',
    subType: 'mobile',
    genre: 'MMORPG · Anime',
    moods: ['coop', 'explore', 'relax'],
    time: 'Chơi lâu dài (Live-service)',
    score: 7.0,
    img: '/assets/img/3578d308d7-library_hero.jpg',
    why: 'MMORPG phong cách anime với thế giới Regnas rực rỡ, đánh boss cùng bạn bè. Điểm trừ là cày cuốc nặng và gacha, hợp người thích chơi nhóm hơn solo.',
    link: '/blue-protocol-review',
    color: ['#06101a', '#0c2238']
  },
  {
    id: 'dragon-ball-daima',
    type: 'anime',
    name: 'Bảy Viên Ngọc Rồng DAIMA',
    creator: 'Toei Animation · 2024',
    format: 'TV Series (20 tập)',
    subType: 'series',
    genre: 'Shonen · Adventure',
    moods: ['relax', 'action', 'quick'],
    time: '20 tập (~7 giờ)',
    score: 8.2,
    img: '/assets/img/1f0540d7a3-maxresdefault.jpg',
    why: 'Goku và đồng đội bị biến thành trẻ con, phiêu lưu xuống Thế giới Quỷ. Tác phẩm cuối cùng Akira Toriyama trực tiếp tham gia: vui tươi, hoài niệm và dễ xem.',
    link: '/bay-vien-ngoc-rong-daima',
    color: ['#14100a', '#30240c']
  },
  {
    id: 'battle-through-the-heavens',
    type: 'anime',
    name: 'Đấu Phá Thương Khung',
    creator: 'Motion Magic · 2018 - nay',
    format: 'Donghua (dài tập)',
    subType: 'series',
    genre: 'Huyền huyễn · Tu tiên',
    moods: ['action', 'story', 'challenge'],
    time: 'Dài tập (đang phát hành)',
    score: 7.8,
    img: '/assets/img/uploads/battle-through-the-heavens-donghua.jpg',
    why: 'Tiêu Viêm từ thiên tài sa sút vươn lên Đấu Đế. Donghua 3D hoành tráng, đánh nhau mãn nhãn, dành cho người mê truyện tu tiên.',
    link: '/dau-pha-thuong-khung-review',
    color: ['#140a06', '#2e180a']
  },
  {
    id: 'tbate-anime',
    type: 'anime',
    name: 'The Beginning After The End (anime)',
    creator: 'Studio A-CAT · 2025',
    format: 'TV Series (24 tập)',
    subType: 'series',
    genre: 'Isekai · Fantasy',
    moods: ['story', 'action', 'explore'],
    time: '24 tập (~9 giờ)',
    score: 7.5,
    img: '/assets/img/real-tbate-anime-banner.jpg',
    why: 'Chuyển thể anime của manhwa đình đám về vua Grey tái sinh thành Arthur Leywin. Cốt truyện và nhân vật vẫn cuốn dù hoạt họa chưa xứng tầm nguyên tác.',
    link: '/the-beginning-after-the-end-anime-review',
    color: ['#040c14', '#0a1a2a']
  }
];

const EN_ITEMS = [
  // ── 16 GAMES ───────────────────────────────────────────────────────
  {
    id: 'elden-ring',
    type: 'game',
    name: 'Elden Ring: Shadow of the Erdtree',
    creator: 'FromSoftware · 2024',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Action RPG · Soulslike',
    moods: ['action', 'story', 'challenge', 'explore', 'coop'],
    time: '25 - 50h (DLC only)',
    score: 9.8,
    img: '/assets/img/a7f47ed998-header.jpg',
    why: 'Breathtaking Lands Between and Realm of Shadow. Every landmark, ruin, and brutal boss fight delivers unmatched triumph and satisfaction.',
    link: '/en/elden-ring-shadow-of-the-erdtree-review',
    color: ['#1a0c08', '#3d1a00']
  },
  {
    id: 'wuwa',
    type: 'game',
    name: 'Wuthering Waves',
    creator: 'Kuro Games · 2024',
    format: 'PC / Mobile / PS5',
    subType: 'mobile',
    genre: 'Action RPG · Open World',
    moods: ['action', 'explore', 'story', 'quick'],
    time: 'Live Service',
    score: 9.5,
    img: '/assets/img/c53329917b-wuthering-waves-hero.jpg',
    why: 'The slickest parkour, dodging, and parrying combat in the gacha genre. Explore a stylish post-apocalyptic world rendered in Unreal Engine.',
    link: '/en/wuthering-waves-review',
    color: ['#050810', '#0a1228']
  },
  {
    id: 'hades2',
    type: 'game',
    name: 'Hades II',
    creator: 'Supergiant Games · 2025',
    format: 'PC / Switch',
    subType: 'pc',
    genre: 'Roguelite · Action',
    moods: ['quick', 'action', 'story', 'challenge'],
    time: '20 - 60h',
    score: 9.4,
    img: '/assets/img/uploads/hades-2-melinoe-key-art.webp',
    why: 'Melinoë marches against Chronos, the Titan of Time. Every 25-minute run brings god-tier voice acting, fresh boons, and exhilarating boss duels.',
    link: null,
    color: ['#1a0508', '#3d0010']
  },
  {
    id: 'mhwilds',
    type: 'game',
    name: 'Monster Hunter Wilds',
    creator: 'Capcom · 2025',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Hunting Action · Co-op',
    moods: ['action', 'coop', 'challenge', 'explore'],
    time: '80 - 300h',
    score: 9.4,
    img: '/assets/img/587e72813c-header.jpg',
    why: 'Hunt massive apex monsters with 3 companions atop the agile Seikret mount. Dynamic weather systems make the living wilderness truly formidable.',
    link: '/en/monster-hunter-wilds-review',
    color: ['#0a0e05', '#1a280a']
  },
  {
    id: 'genshin',
    type: 'game',
    name: 'Genshin Impact: Natlan',
    creator: 'HoYoverse · 2024',
    format: 'Mobile / PC / Console',
    subType: 'mobile',
    genre: 'Open World RPG',
    moods: ['relax', 'explore', 'story', 'quick'],
    time: 'Live Service',
    score: 9.1,
    img: '/assets/img/real-genshin-natlan.jpg',
    why: 'The nation of Pyro, Natlan, introduces exhilarating Saurian transformations for surfing lava and scaling cliffs. Perfect 30-minute daily decompression.',
    link: '/en/genshin-natlan-review',
    color: ['#050a0a', '#0a1a14']
  },
  {
    id: 'stellar-blade',
    type: 'game',
    name: 'Stellar Blade',
    creator: 'Shift Up · 2024',
    format: 'Console / PC',
    subType: 'console',
    genre: 'Action Adventure',
    moods: ['action', 'challenge', 'explore'],
    time: '25 - 40h',
    score: 9.2,
    img: '/assets/img/ec5a6e3960-maxresdefault.jpg',
    why: 'High-octane hack-and-slash combat paired with a haunting synth-heavy soundtrack. Parry timing and precision dodges make every encounter punchy.',
    link: '/en/stellar-blade-2',
    color: ['#080a18', '#141838']
  },
  {
    id: 'kcd2',
    type: 'game',
    name: 'Kingdom Come: Deliverance II',
    creator: 'Warhorse Studios · 2025',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Medieval RPG',
    moods: ['story', 'explore', 'challenge'],
    time: '70 - 120h',
    score: 9.3,
    img: '/assets/img/50c4f9b171-library_hero.jpg',
    why: 'Henry of Skalitz returns to 1403 Bohemia in a meticulously authentic medieval world. A long, choice-driven story that builds to the epic siege of Suchdol.',
    link: null,
    color: ['#140d05', '#2a1a08']
  },
  {
    id: 'witcher3',
    type: 'game',
    name: 'The Witcher 3: Wild Hunt',
    creator: 'CD PROJEKT RED · 2015',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Open World RPG',
    moods: ['story', 'explore', 'relax', 'action'],
    time: '80 - 150h',
    score: 9.8,
    img: '/assets/img/uploads/yboyto0l-images-17.jpg',
    why: 'The gold standard of Western narrative RPGs, great down to every side quest. The free Remastered upgrade launched September 29, 2026, including on Switch 2.',
    link: '/en/the-witcher-3-remastered-review-visual-upgrades-that-dont',
    color: ['#0a0814', '#18122c']
  },
  {
    id: 'cyberpunk',
    type: 'game',
    name: 'Cyberpunk 2077: Phantom Liberty',
    creator: 'CD PROJEKT RED · 2023',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Sci-Fi Action RPG',
    moods: ['story', 'action', 'explore', 'challenge'],
    time: '40 - 100h',
    score: 9.4,
    img: '/assets/img/recommend-cyberpunk.jpg',
    why: 'Night City pulses with neon glory. A high-stakes espionage thriller starring Idris Elba alongside completely overhauled cyberware combat.',
    link: null,
    color: ['#0f0515', '#280a35']
  },
  {
    id: 'bmw',
    type: 'game',
    name: 'Black Myth: Wukong',
    creator: 'Game Science · 2024',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Action RPG · Mythology',
    moods: ['action', 'challenge', 'story'],
    time: '35 - 55h',
    score: 9.3,
    img: '/assets/img/7403bc0e49-header.jpg',
    why: 'Journey to the West reimagined as a soul-stirring action RPG. Master staff transformations and conquer legendary mythical bosses in Unreal Engine 5.',
    link: '/en/black-myth-wukong-review',
    color: ['#140803', '#2a1205']
  },
  {
    id: 'hsr',
    type: 'game',
    name: 'Honkai: Star Rail',
    creator: 'HoYoverse · 2023',
    format: 'Mobile / PC / Console',
    subType: 'mobile',
    genre: 'Space Fantasy RPG',
    moods: ['story', 'relax', 'quick'],
    time: 'Live Service',
    score: 9.3,
    img: '/assets/img/681306c50c-143582l.jpg',
    why: 'Board the Astral Express across uncharted galactic realms. Tactical turn-based combat wrapped in high-budget cinematic narrative arcs.',
    link: '/en/honkai-star-rail-review',
    color: ['#080414', '#150a2e']
  },
  {
    id: 'stardew',
    type: 'game',
    name: 'Stardew Valley',
    creator: 'ConcernedApe · 2016',
    format: 'PC / Mobile / Console',
    subType: 'pc',
    genre: 'Farming Sim · Co-op',
    moods: ['relax', 'quick', 'coop'],
    time: '40 - 200h',
    score: 9.5,
    img: '/assets/img/recommend-stardew.jpg',
    why: 'The ultimate wholesome decompression remedy. Tend crops, raise livestock, mine gemstones, and build your idyllic homestead solo or with friends.',
    link: null,
    color: ['#0a1a06', '#1a3d0a']
  },
  {
    id: 'split-fiction',
    type: 'game',
    name: 'Split Fiction',
    creator: 'Hazelight Studios · 2025',
    format: 'PC / Console',
    subType: 'console',
    genre: 'Co-op Adventure',
    moods: ['coop', 'story', 'quick', 'action'],
    time: '14 - 16h',
    score: 9.6,
    img: '/assets/img/4c8ef98e63-split-fiction-review-hero.jpg',
    why: 'Mio and Zoe are trapped between sci-fi and fantasy worlds. Every stage brings a new mechanic, built for two players, and a friend can join free with Friend’s Pass.',
    link: null,
    color: ['#050f0a', '#0a1e14']
  },
  {
    id: 'hollow-knight',
    type: 'game',
    name: 'Hollow Knight',
    creator: 'Team Cherry · 2017',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Metroidvania · Action',
    moods: ['challenge', 'explore', 'story'],
    time: '30 - 60h',
    score: 9.6,
    img: '/assets/img/recommend-hollow.jpg',
    why: 'Descend into the haunting ruined insect kingdom of Hallownest. Sublime atmospheric score, tight responsive nail combat, and secrets around every bend.',
    link: null,
    color: ['#050a12', '#0a1728']
  },
  {
    id: 'celeste',
    type: 'game',
    name: 'Celeste',
    creator: 'Maddy Makes Games · 2018',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Platformer · Indie Masterpiece',
    moods: ['challenge', 'quick', 'story'],
    time: '10 - 20h',
    score: 9.4,
    img: '/assets/img/recommend-celeste.jpg',
    why: 'Climb the perilous heights of Mount Celeste while confronting inner anxiety. Pixel-perfect jump controls and an uplifting, emotional indie narrative.',
    link: null,
    color: ['#0a0815', '#1a1030']
  },
  {
    id: 'disco-elysium',
    type: 'game',
    name: 'Disco Elysium: The Final Cut',
    creator: 'ZA/UM · 2021',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Narrative RPG · Detective',
    moods: ['story', 'relax', 'challenge'],
    time: '30 - 50h',
    score: 9.7,
    img: '/assets/img/recommend-disco.jpg',
    why: 'A landmark triumph of literary writing in interactive media. Solve a grim murder in Revachol solely through intellect, dialogue choices, and fractured psychology.',
    link: null,
    color: ['#100805', '#241208']
  },

  // ── 16 ANIME ───────────────────────────────────────────────────────
  {
    id: 'frieren',
    type: 'anime',
    name: "Frieren: Beyond Journey's End (S1 & S2)",
    creator: 'Madhouse',
    format: 'TV Series (2 seasons)',
    subType: 'series',
    genre: 'Fantasy · Slice of Life',
    moods: ['relax', 'story', 'explore'],
    time: '38 episodes (28 + 10)',
    score: 9.9,
    img: '/assets/img/news-frieren-season-2-official-visual.jpg',
    why: 'The most profound fantasy anime masterpiece of our generation. An elf mage reflects on mortality and human bonds after defeating the Demon King.',
    link: '/en/frieren-season-2-aired-january-2026',
    color: ['#06141c', '#0f2c3a']
  },
  {
    id: 'demon-slayer-infinity-castle',
    type: 'anime',
    name: 'Demon Slayer: Infinity Castle (Movie 1)',
    creator: 'Ufotable',
    format: 'Theatrical Movie (155 min)',
    subType: 'movie',
    genre: 'Dark Fantasy · Action Hype',
    moods: ['action', 'quick', 'challenge', 'coop'],
    time: '2h 35m',
    score: 9.8,
    img: '/assets/img/e497ae1e1b-demon-slayer-cover.jpg',
    why: 'Ufotable blends 2D and CG into its most spectacular fights yet. Tanjiro and the Hashira are pulled into Muzan’s Infinity Castle as the final battle begins.',
    link: '/en/demon-slayer-infinity-castle-review',
    color: ['#1a060d', '#3d0c1c']
  },
  {
    id: 'jjk-culling-game',
    type: 'anime',
    name: 'Jujutsu Kaisen: Culling Game (Season 3)',
    creator: 'MAPPA',
    format: 'TV Series (Season 3)',
    subType: 'series',
    genre: 'Shonen · Supernatural Action',
    moods: ['action', 'challenge', 'story', 'coop'],
    time: '12 episodes (Jan–Mar 2026)',
    score: 9.6,
    img: '/assets/img/news-jujutsu-kaisen-season-3-culling-game.jpg',
    why: 'Kenjaku launches the Culling Game, a deadly contest forcing sorcerers across Japan to fight. Yuji and Megumi dive in against new rivals and wildly inventive techniques.',
    link: '/en/jujutsu-kaisen-culling-game-part-2-sukuna-teaser-juju-fes-2026',
    color: ['#080414', '#150a2e']
  },
  {
    id: 'chainsaw-man-reze',
    type: 'anime',
    name: 'Chainsaw Man: Reze Arc (Movie)',
    creator: 'MAPPA',
    format: 'Theatrical Movie (100 min)',
    subType: 'movie',
    genre: 'Action · Dark Romance',
    moods: ['action', 'story', 'quick'],
    time: '1h 40m',
    score: 9.5,
    img: '/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg',
    why: 'Tatsuki Fujimoto’s most beloved romantic yet explosive arc. Denji falls for the enigmatic Reze before gunfire, fireworks, and bomb explosions erupt.',
    link: '/en/chainsaw-man-reze-arc-review',
    color: ['#140804', '#2d140a']
  },
  {
    id: 'dandadan-s2',
    type: 'anime',
    name: 'Dandadan Season 2',
    creator: 'Science SARU',
    format: 'TV Series (12 Episodes)',
    subType: 'series',
    genre: 'Supernatural · Action Comedy',
    moods: ['action', 'coop', 'relax', 'quick'],
    time: '12 Episodes (~5 hours)',
    score: 9.4,
    img: '/assets/img/news-dandadan-season-2-evil-eye.jpg',
    why: 'An electrifying collision of cryptids, folklore ghosts, and high-speed teenage romance. Science SARU’s kinetic direction never slows down.',
    link: '/en/dandadan-season-2-review',
    color: ['#140212', '#2d0829']
  },
  {
    id: 'jojo-sbr',
    type: 'anime',
    name: "JoJo's Bizarre Adventure: Steel Ball Run",
    creator: 'David Production',
    format: 'TV Series (Netflix)',
    subType: 'series',
    genre: 'Adventure · Action Strategy',
    moods: ['action', 'story', 'explore', 'challenge'],
    time: '1st Stage + 11 episodes (2026)',
    score: 9.7,
    img: '/assets/img/real-jojo-sbr-stage2.jpg',
    why: 'Universally hailed as the pinnacle of Hirohiko Araki’s creative vision. A grueling transcontinental horseback race fueled by mind-bending Stands.',
    link: '/en/jojo-steel-ball-run-stages-2-3-premiere-september-25',
    color: ['#120e03', '#2a2007']
  },
  {
    id: 'aoashi-s2',
    type: 'anime',
    name: 'Aoashi Season 2',
    creator: 'TMS Entertainment',
    format: 'TV Series (from Oct 4, 2026)',
    subType: 'series',
    genre: 'Sports · Drama',
    moods: ['challenge', 'story', 'quick', 'coop'],
    time: '24 Episodes',
    score: 9.3,
    img: '/assets/img/poster-real-aoashi-s2.jpg',
    why: 'The smartest and most tactical football anime of the decade. No supernatural superpowers—just real spatial awareness, vision, and grit.',
    link: '/en/aoashi-season-2-new-studio-premieres-october-4',
    color: ['#021008', '#072414']
  },
  {
    id: 'vinland-saga',
    type: 'manga',
    name: 'Vinland Saga',
    creator: 'Makoto Yukimura',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Historical · Seinen',
    moods: ['story', 'challenge', 'explore'],
    time: '14 volumes (completed)',
    score: 9.7,
    img: '/assets/img/7807ea1948-vinland-saga-manga-hero.jpg',
    why: 'Thorfinn’s 20-year journey from a Viking boy consumed by revenge to a man searching for a land without war. One of the greatest manga ever made.',
    link: '/en/vinland-saga-manga-review',
    color: ['#100a06', '#22150c']
  },
  {
    id: 'spy-family',
    type: 'anime',
    name: 'Spy x Family',
    creator: 'WIT Studio · CloverWorks',
    format: 'TV Series (3 seasons)',
    subType: 'series',
    genre: 'Comedy · Action · Wholesome',
    moods: ['relax', 'quick', 'coop', 'story'],
    time: '3 seasons (2022–2025)',
    score: 9.2,
    img: '/assets/img/real-spy-family-banner.jpg',
    why: 'Agent Twilight constructs a fake family with telepath Anya and deadly assassin Yor. A charming blend of Cold War espionage and heartwarming domestic comedy.',
    link: null,
    color: ['#061214', '#0d282a']
  },
  {
    id: 'aot',
    type: 'anime',
    name: 'Attack on Titan: The Final Season',
    creator: 'MAPPA',
    format: 'TV Series · Final Season',
    subType: 'series',
    genre: 'Dark Fantasy · Action Epic',
    moods: ['story', 'challenge', 'action', 'explore'],
    time: '28 episodes + 2 specials',
    score: 9.9,
    img: '/assets/img/48ca2f8976-attack-on-titan-final-season-hero.jpg',
    why: 'The catastrophic Rumbling shakes civilization to its foundations. An earth-shattering conclusion to one of the most celebrated anime sagas in history.',
    link: '/en/attack-on-titan-wit-teaser',
    color: ['#120804', '#2a140a']
  },
  {
    id: 'rezero',
    type: 'anime',
    name: 'Re:Zero Season 4',
    creator: 'White Fox',
    format: 'TV Series',
    subType: 'series',
    genre: 'Isekai · Psychological Dark',
    moods: ['story', 'challenge', 'quick'],
    time: '19 episodes (Apr–Sep 2026)',
    score: 9.4,
    img: '/assets/img/087af8ed98-rezero-s4-hero.jpg',
    why: 'Subaru’s Return by Death ability faces brutal psychological traps laid by the Sin Archbishops. Unflinching tension and heartbreaking character growth.',
    link: null,
    color: ['#0a0515', '#1a0d30']
  },
  {
    id: 'bleach-tybw',
    type: 'anime',
    name: 'Bleach: Thousand-Year Blood War',
    creator: 'Studio Pierrot',
    format: 'TV Series (completed)',
    subType: 'series',
    genre: 'Action · Supernatural Shonen',
    moods: ['action', 'challenge', 'coop'],
    time: '4 parts · 50 episodes (2022–2026)',
    score: 9.5,
    img: '/assets/img/bleach-tybw-poster.jpg',
    why: 'Pierrot delivers feature-film visual production in every frame. Ichigo and the Thirteen Court Guard Squads clash in an all-out war with the Quincy empire.',
    link: '/en/bleach-tybw-the-calamity-premieres-july-25-2026',
    color: ['#100204', '#260608']
  },
  {
    id: 'laputa',
    type: 'anime',
    name: 'Castle in the Sky (Laputa)',
    creator: 'Studio Ghibli · Hayao Miyazaki',
    format: 'Theatrical Film (124 min)',
    subType: 'movie',
    genre: 'Adventure · Classic Ghibli',
    moods: ['explore', 'relax', 'story', 'quick'],
    time: '2h 04m',
    score: 9.6,
    img: '/assets/img/uploads/eofdaug8-maxresdefault-1.jpg',
    why: 'Hayao Miyazaki’s timeless hand-drawn steampunk masterwork. The search for the legendary floating castle Laputa accompanied by Joe Hisaishi’s iconic score.',
    link: null,
    color: ['#041018', '#0a2436']
  },
  {
    id: 'haikyuu-movie',
    type: 'anime',
    name: 'Haikyu!!: The Dumpster Battle',
    creator: 'Production I.G',
    format: 'Theatrical Movie (85 min)',
    subType: 'movie',
    genre: 'Sports · Action Hype',
    moods: ['coop', 'quick', 'challenge'],
    time: '1h 25m',
    score: 9.5,
    img: '/assets/img/1aa6c988b4-haikyuu-cover.jpg',
    why: 'The long-awaited showdown between Karasuno and Nekoma. First-person point-of-view animations capture the adrenaline rush of every intense volleyball rally.',
    link: null,
    color: ['#120802', '#2a1405']
  },
  {
    id: 'blue-lock-s2',
    type: 'anime',
    name: 'Blue Lock Season 2: U-20 Arc',
    creator: 'Eight Bit',
    format: 'TV Series',
    subType: 'series',
    genre: 'Sports · Action Survival',
    moods: ['challenge', 'action', 'coop'],
    time: '14 Episodes',
    score: 9.2,
    img: '/assets/img/blue-lock-banner.jpg',
    why: 'The fiercest football prison project culminates in a high-stakes match against the Japan U-20 squad. Ego, instinct, and hyper-kinetic goalstriking.',
    link: null,
    color: ['#030a18', '#081636']
  },
  {
    id: 'oshi-no-ko',
    type: 'anime',
    name: 'Oshi no Ko',
    creator: 'Doga Kobo',
    format: 'TV Series (3 seasons)',
    subType: 'series',
    genre: 'Drama · Idol · Mystery',
    moods: ['story', 'quick', 'relax'],
    time: '3 seasons · 35 episodes',
    score: 9.3,
    img: '/assets/img/9506aefbae-oshi-no-ko-hero.jpg',
    why: 'The dark side of Japan’s entertainment industry, told through Aqua’s revenge and Ruby’s idol dream. A shocking opener that keeps pulling you in.',
    link: null,
    color: ['#02140c', '#062d1a']
  },

  // ── 16 MANGA & MANHWA ──────────────────────────────────────────────
  {
    id: 'solo-leveling-ragnarok',
    type: 'manga',
    name: 'Solo Leveling: Ragnarok',
    creator: 'REDICE Studio · Daul',
    format: 'Korean Manhwa (Webtoon)',
    subType: 'manhwa',
    genre: 'Action · Hunter Fantasy',
    moods: ['action', 'challenge', 'quick', 'explore'],
    time: 'Vertical Scroll',
    score: 9.5,
    img: '/assets/img/news-solo-leveling-ragnarok-manhwa.jpg',
    why: 'The official continuation following Sung Su-ho, son of the Shadow Monarch. Top-tier full-color digital artwork and relentless level-up hype.',
    link: '/en/solo-leveling-ragnarok-manhwa-review',
    color: ['#040a14', '#0a172e']
  },
  {
    id: 'one-piece-final',
    type: 'manga',
    name: 'One Piece: Elbaf & Final Saga',
    creator: 'Eiichiro Oda · Shonen Jump',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Adventure · Shonen',
    moods: ['explore', 'story', 'action', 'coop'],
    time: '1194 chapters (ongoing)',
    score: 9.9,
    img: '/assets/img/pool-one-piece-2.jpg',
    why: 'The legendary kingdom of giants Elbaf finally takes center stage as Oda unpacks nearly 30 years of deep lore regarding the Void Century and Joy Boy.',
    link: '/en/one-piece-final-saga-review',
    color: ['#120803', '#2a1207']
  },
  {
    id: 'kagurabachi',
    type: 'manga',
    name: 'Kagurabachi',
    creator: 'Takeru Hokazono · Shonen Jump',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Dark Action · Katana Sorcery',
    moods: ['action', 'quick', 'challenge'],
    time: '130+ chapters · 12 volumes',
    score: 9.4,
    img: '/assets/img/1acdb70bf9-kagurabachi-review-hero.jpg',
    why: 'The undisputed breakout manga hit of the new Shonen Jump era. Cinematic panel flow, stylish swordplay, and deep emotional stakes.',
    link: '/en/kagurabachi-review',
    color: ['#100204', '#260408']
  },
  {
    id: 'berserk',
    type: 'manga',
    name: 'Berserk',
    creator: 'Kentaro Miura · Studio Gaga',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Dark Fantasy · Seinen',
    moods: ['story', 'challenge', 'action'],
    time: '384+ chapters (Studio Gaga)',
    score: 9.9,
    img: '/assets/img/7b5a968234-maxresdefault.jpg',
    why: 'The monumental dark fantasy benchmark. The Black Swordsman Guts wages war against cruel destiny with Renaissance-tier pen-and-ink detail.',
    link: '/en/berserk-arc-cuoi',
    color: ['#120303', '#280606']
  },
  {
    id: 'boruto-tbv',
    type: 'manga',
    name: 'Boruto: Two Blue Vortex',
    creator: 'Masashi Kishimoto · Mikio Ikemoto',
    format: 'Monthly Manga',
    subType: 'manga',
    genre: 'Ninja · Action Sci-Fi',
    moods: ['action', 'story', 'challenge'],
    time: '37 chapters (monthly)',
    score: 9.1,
    img: '/assets/img/boruto-naruto-next-generations-banner.jpg',
    why: 'A high-stakes post-timeskip world order where Boruto is exiled as an international rogue while sentient Divine Trees threaten civilization.',
    link: null,
    color: ['#040a12', '#0a1728']
  },
  {
    id: 'black-clover',
    type: 'manga',
    name: 'Black Clover: Final Arc',
    creator: 'Yūki Tabata',
    format: 'Completed Manga',
    subType: 'manga',
    genre: 'Magic · Action Shonen',
    moods: ['action', 'coop', 'quick', 'challenge'],
    time: 'Completed (392 chapters)',
    score: 9.2,
    img: '/assets/img/75f4272c97-black-clover-final-volume-hero.jpg',
    why: 'The magicless boy Asta swings his immense anti-magic greatsword into the climactic war alongside the Black Bulls. Non-stop shonen hype.',
    link: '/en/black-clover-final-volume-review',
    color: ['#080410', '#130a24']
  },
  {
    id: 'blue-lock',
    type: 'manga',
    name: 'Blue Lock',
    creator: 'Muneyuki Kaneshiro · Yusuke Nomura',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Sports · Battle Royale',
    moods: ['action', 'coop', 'challenge', 'quick'],
    time: '360+ chapters (ongoing)',
    score: 9.4,
    img: '/assets/img/b9352651c2-bluelock.jpg',
    why: 'A psychological soccer battle royale where strikers must awaken their unbridled ego to dominate on the world stage. Wildly addictive pacing.',
    link: null,
    color: ['#020a18', '#081736']
  },
  {
    id: 'haikyu',
    type: 'manga',
    name: 'Haikyu!!',
    creator: 'Haruichi Furudate',
    format: 'Completed Manga (402 ch)',
    subType: 'manga',
    genre: 'Sports · Teamwork & Passion',
    moods: ['coop', 'story', 'quick', 'relax'],
    time: '402 Chapters',
    score: 9.8,
    img: '/assets/img/pool-haikyu-2.jpg',
    why: 'The timeless hymn of athletic dedication and brotherhood. Hinata Shoyo takes flight at Karasuno High, delivering goosebumps across 400 chapters.',
    link: null,
    color: ['#120802', '#2a1405']
  },
  {
    id: 'kaiju-no-8',
    type: 'manga',
    name: 'Kaiju No. 8',
    creator: 'Naoya Matsumoto · Shonen Jump+',
    format: 'Completed Manga',
    subType: 'manga',
    genre: 'Action Sci-Fi · Monster',
    moods: ['action', 'coop', 'quick', 'challenge'],
    time: 'Completed (16 volumes)',
    score: 9.3,
    img: '/assets/img/1cd80a8a56-kaiju-no8-cover.jpg',
    why: 'The Defense Force mobilizes against apocalyptic monstrosities. High-tech powered suits, hearty comedic camaraderie, and brutal kaiju takedowns.',
    link: null,
    color: ['#02140c', '#062d1a']
  },
  {
    id: 'chainsaw-man-p2',
    type: 'manga',
    name: 'Chainsaw Man: Part 2 (Academy)',
    creator: 'Tatsuki Fujimoto',
    format: 'Completed Manga',
    subType: 'manga',
    genre: 'Dark Comedy · Action',
    moods: ['action', 'story', 'quick', 'challenge'],
    time: 'Completed (24 volumes)',
    score: 9.5,
    img: '/assets/img/pool-chainsaw-man-manga-2.jpg',
    why: 'Tatsuki Fujimoto redefines shonen conventions with Asa Mitaka, Denji, and the War Devil. Unpredictable narrative twists and dark cinematic humor.',
    link: '/en/chainsaw-man-manga-part2-review',
    color: ['#140803', '#2d1408']
  },
  {
    id: 'jujutsu-kaisen-manga',
    type: 'manga',
    name: 'Jujutsu Kaisen: Shinjuku Showdown',
    creator: 'Gege Akutami',
    format: 'Completed Manga (271 ch)',
    subType: 'manga',
    genre: 'Supernatural Action · Sorcery',
    moods: ['action', 'challenge', 'story', 'coop'],
    time: '271 chapters (30 volumes)',
    score: 9.6,
    img: '/assets/img/pool-jujutsu-kaisen-manga-2.jpg',
    why: 'The climactic battle against Ryomen Sukuna where every sorcerer throws their life and Domain Expansion on the line in modern Tokyo.',
    link: '/en/jujutsu-kaisen-chapter-271-final-climax-epilogue',
    color: ['#080414', '#150a2e']
  },
  {
    id: 'hunter-x-hunter',
    type: 'manga',
    name: 'Hunter x Hunter: Dark Continent',
    creator: 'Yoshihiro Togashi',
    format: 'Manga Shonen Jump',
    subType: 'manga',
    genre: 'Psychological Adventure',
    moods: ['story', 'explore', 'challenge'],
    time: '420 chapters (on hiatus)',
    score: 9.8,
    img: '/assets/img/photo-hunter-x-hunter-chapter-419-tro-lai.jpg',
    why: 'Togashi transforms the Black Whale voyage into a labyrinthine war of succession. Mind games, political factions, and Nen abilities at their absolute peak.',
    link: null,
    color: ['#080e04', '#142008']
  },
  {
    id: 'detective-conan',
    type: 'manga',
    name: 'Detective Conan',
    creator: 'Gosho Aoyama',
    format: 'Manga Shonen Sunday',
    subType: 'manga',
    genre: 'Mystery · Detective',
    moods: ['story', 'quick', 'relax', 'coop'],
    time: '1160+ chapters (ongoing)',
    score: 9.3,
    img: '/assets/img/news-detective-conan-final-chapter.jpg',
    why: 'The beloved cornerstone of Japanese murder mysteries. Conan’s long-standing intellectual battle with the Black Organization reaches key disclosures.',
    link: null,
    color: ['#040a18', '#0a1632']
  },
  {
    id: 'hanako-kun',
    type: 'manga',
    name: 'Toilet-bound Hanako-kun',
    creator: 'AidaIro',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Supernatural · Mystery',
    moods: ['relax', 'story', 'quick'],
    time: '130+ chapters (ongoing)',
    score: 9.2,
    img: '/assets/img/news-hanako-kun-manga-resumes.jpg',
    why: 'Exquisite signature fairytale illustration style blending Kamome Academy urban legends with bittersweet supernatural romance and touching character lore.',
    link: null,
    color: ['#12040e', '#280a20']
  },
  {
    id: 'tbate',
    type: 'manga',
    name: 'The Beginning After The End',
    creator: 'TurtleMe · Fuyuki23',
    format: 'Manhwa Webtoon',
    subType: 'manhwa',
    genre: 'Isekai · Magic Progression',
    moods: ['action', 'story', 'explore', 'challenge'],
    time: '250+ chapters (webtoon)',
    score: 9.4,
    img: '/assets/img/3eb1c4a80b-the-beginning-after-the-end.jpg',
    why: 'King Grey reincarnates as Arthur Leywin into the magical continent of Dicathen. Rigorous elemental magic mechanics and epic wartime battles.',
    link: null,
    color: ['#040c14', '#0a1a2a']
  },
  {
    id: 'dandadan-manga',
    type: 'manga',
    name: 'Dandadan',
    creator: 'Yukinobu Tatsu',
    format: 'Japanese Manga',
    subType: 'manga',
    genre: 'Action · Comedy · Supernatural',
    moods: ['action', 'quick', 'relax'],
    time: '25+ volumes (ongoing)',
    score: 9.4,
    img: '/assets/img/2c0d7f7a34-dandadan-manga-hero.jpg',
    why: 'Momo believes in ghosts, Okarun believes in aliens, and both are right. Comedy, horror, action and romance with explosive artwork.',
    link: null,
    color: ['#040c14', '#0a1a2a']
  },
  {
    id: 'overgeared',
    type: 'manga',
    name: 'Overgeared',
    creator: 'Park Saenal · Team Argo',
    format: 'Korean Manhwa (Webtoon)',
    subType: 'manhwa',
    genre: 'VRMMO · Action Comedy',
    moods: ['action', 'explore', 'quick', 'coop'],
    time: '300+ chapters (webtoon)',
    score: 9.3,
    img: '/assets/img/overgeared-cover.jpg',
    why: 'From deep debt into Pagma’s Successor in the VRMMO world of Satisfy. Forging god-tier equipment, founding kingdoms, and shattering raid records.',
    link: null,
    color: ['#100a04', '#26180a']
  },
  // ── ADDED: titles with an OtaHub review ───────────────────────────
  {
    id: 'ghost-of-yotei',
    type: 'game',
    name: 'Ghost of Yōtei',
    creator: 'Sucker Punch · 2025',
    format: 'PS5',
    subType: 'console',
    genre: 'Open World · Samurai Action',
    moods: ['action', 'explore', 'story', 'challenge'],
    time: '30 - 50h',
    score: 9.3,
    img: '/assets/img/3c84e61b4e-ghost-of-yotei-review-hero.jpg',
    why: 'Atsu hunts the Yōtei Six across Ezo in 1603. An open world painted like ink-wash art, with a deeper multi-weapon swordplay system than Ghost of Tsushima.',
    link: '/en/ghost-of-yotei-review',
    color: ['#0a0f14', '#1a2a30']
  },
  {
    id: 'death-stranding-2',
    type: 'game',
    name: 'Death Stranding 2: On the Beach',
    creator: 'Kojima Productions · 2025',
    format: 'PS5',
    subType: 'console',
    genre: 'Action Adventure · Open World',
    moods: ['story', 'explore', 'relax'],
    time: '40 - 60h',
    score: 9.5,
    img: '/assets/img/9c68ea445d-death-stranding-2-on-the-beach-review-hero.jpg',
    why: 'Sam Porter Bridges reconnects the chiral network across Mexico and Australia. A one-of-a-kind delivery journey, a wild Kojima story and a superb soundtrack.',
    link: '/en/death-stranding-2-review',
    color: ['#0b0f12', '#1b2630']
  },
  {
    id: 'mgs-delta',
    type: 'game',
    name: 'Metal Gear Solid Δ: Snake Eater',
    creator: 'Konami · 2025',
    format: 'PC / PS5 / Xbox',
    subType: 'console',
    genre: 'Stealth Action',
    moods: ['story', 'action', 'challenge'],
    time: '15 - 25h',
    score: 8.8,
    img: '/assets/img/ce3825d43e-mgs-delta-snake-eater-review-hero.jpg',
    why: 'A faithful Unreal Engine 5 remake of Snake Eater: the Cold War story and the classic jungle stealth and survival gameplay, untouched.',
    link: '/en/metal-gear-solid-delta-review',
    color: ['#0a1208', '#1a2c14']
  },
  {
    id: 'suikoden-star-leap',
    type: 'game',
    name: 'Suikoden STAR LEAP',
    creator: 'Konami · 2025',
    format: 'Mobile',
    subType: 'mobile',
    genre: 'JRPG · Gacha',
    moods: ['story', 'relax', 'quick'],
    time: 'Ongoing (live service)',
    score: 8.8,
    img: '/assets/img/3a6da459ec-suikoden-star-leap-hero.jpg',
    why: 'Suikoden returns on mobile with the 108 Stars of Destiny, six-member turn-based parties and the series\' beloved base-building spirit.',
    link: '/en/suikoden-star-leap-review',
    color: ['#0c0a16', '#1e1a3a']
  },
  {
    id: 'mafia-old-country',
    type: 'game',
    name: 'Mafia: The Old Country',
    creator: 'Hangar 13 · 2025',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Action Adventure · Mafia',
    moods: ['story', 'action'],
    time: '12 - 20h',
    score: 8.3,
    img: '/assets/img/pool-mafia-1.jpg',
    why: 'Early 1900s Sicily: Enzo Favara climbs from the sulphur mines into the Torrisi family. A tight linear story with classic mob-movie flavour.',
    link: '/en/mafia-old-country-review',
    color: ['#140c06', '#2c1a0c']
  },
  {
    id: 'space-marine-2',
    type: 'game',
    name: 'Space Marine 2',
    creator: 'Saber Interactive · 2024',
    format: 'PC / Console',
    subType: 'pc',
    genre: 'Third-person Shooter · Co-op',
    moods: ['action', 'coop', 'quick'],
    time: '10 - 15h campaign + Operations',
    score: 8.0,
    img: '/assets/img/space-marine-2-chaos-rising-review-hero.jpg',
    why: 'Titus carves through hundreds of Tyranids in every fight; the Chaos Rising expansion adds a three-player co-op campaign against the forces of Chaos.',
    link: '/en/space-marine-2-chaos-rising-review',
    color: ['#120808', '#2a1010']
  },
  {
    id: 'gfl2',
    type: 'game',
    name: "Girls' Frontline 2: Exilium",
    creator: 'MICA Team · 2024',
    format: 'Mobile / PC',
    subType: 'mobile',
    genre: 'Tactical RPG · Gacha',
    moods: ['story', 'challenge', 'quick'],
    time: 'Ongoing (live service)',
    score: 8.5,
    img: '/assets/img/f661df27f7-gfl2-exilium-hero.jpg',
    why: 'XCOM-style turn-based tactics with terrain, cover and T-Doll squads; a post-apocalyptic story that continues from the first game.',
    link: '/en/girls-frontline-2-exilium-in-depth-review',
    color: ['#08100f', '#102420']
  },
  {
    id: 'kaiju-no-8-game',
    type: 'game',
    name: 'Kaiju No. 8 THE GAME',
    creator: 'Akatsuki Games · 2025',
    format: 'Mobile / PC',
    subType: 'mobile',
    genre: 'Action RPG · Gacha',
    moods: ['action', 'quick', 'coop'],
    time: 'Ongoing (live service)',
    score: 8.5,
    img: '/assets/img/pool-kaiju-game-1.jpg',
    why: 'Play as Kafka and the Defense Force in real-time kaiju fights that match the anime\'s pace. Best for fans who want more after the show.',
    link: '/en/kaiju-no-8-the-game-review',
    color: ['#0a0c14', '#141c30']
  },
  {
    id: 'blue-protocol',
    type: 'game',
    name: 'Blue Protocol: Star Resonance',
    creator: 'Bokura · 2025',
    format: 'PC / Mobile',
    subType: 'mobile',
    genre: 'MMORPG · Anime',
    moods: ['coop', 'explore', 'relax'],
    time: 'Ongoing (live service)',
    score: 7.0,
    img: '/assets/img/3578d308d7-library_hero.jpg',
    why: 'An anime-styled MMORPG with the vivid world of Regnas and boss fights with friends. Heavy grind and gacha hold it back; better in a group than solo.',
    link: '/en/blue-protocol-review',
    color: ['#06101a', '#0c2238']
  },
  {
    id: 'dragon-ball-daima',
    type: 'anime',
    name: 'Dragon Ball DAIMA',
    creator: 'Toei Animation · 2024',
    format: 'TV Series (20 episodes)',
    subType: 'series',
    genre: 'Shonen · Adventure',
    moods: ['relax', 'action', 'quick'],
    time: '20 episodes (~7 hours)',
    score: 8.2,
    img: '/assets/img/1f0540d7a3-maxresdefault.jpg',
    why: 'Goku and friends are turned into kids and journey into the Demon Realm. The last work Akira Toriyama was directly involved in: cheerful, nostalgic and easy to watch.',
    link: '/en/dragon-ball-daima',
    color: ['#14100a', '#30240c']
  },
  {
    id: 'battle-through-the-heavens',
    type: 'anime',
    name: 'Battle Through the Heavens',
    creator: 'Motion Magic · 2018 - present',
    format: 'Donghua (long-running)',
    subType: 'series',
    genre: 'Xianxia · Cultivation',
    moods: ['action', 'story', 'challenge'],
    time: 'Long-running (ongoing)',
    score: 7.8,
    img: '/assets/img/uploads/battle-through-the-heavens-donghua.jpg',
    why: 'Xiao Yan rises from fallen prodigy to Dou Emperor. Grand 3D donghua with spectacular fights, made for cultivation-novel fans.',
    link: '/en/battle-through-the-heavens-review',
    color: ['#140a06', '#2e180a']
  },
  {
    id: 'tbate-anime',
    type: 'anime',
    name: 'The Beginning After The End (anime)',
    creator: 'Studio A-CAT · 2025',
    format: 'TV Series (24 episodes)',
    subType: 'series',
    genre: 'Isekai · Fantasy',
    moods: ['story', 'action', 'explore'],
    time: '24 episodes (~9 hours)',
    score: 7.5,
    img: '/assets/img/real-tbate-anime-banner.jpg',
    why: 'The anime adaptation of the hit manhwa about King Grey reborn as Arthur Leywin. The story and cast still grip even though the animation falls short of the source.',
    link: '/en/the-beginning-after-the-end-anime-review',
    color: ['#040c14', '#0a1a2a']
  }
];

// ═════════════════════════════════════════════════════════════════════
// 2. ĐIỂM & LINK: CHỈ LẤY TỪ BÀI REVIEW OTAHUB
// ═════════════════════════════════════════════════════════════════════
// Tựa nào có bài review thật (đã kiểm chứng ở reviews.html + en/reviews.html) thì gắn id review ở đây:
// điểm, link VI và link EN đều lấy từ bài review đó. Tựa không có trong bảng này hiển thị "Biên tập chọn",
// không có điểm. KHÔNG tự ghi điểm vào VI_ITEMS / EN_ITEMS (trường score ở trên bị bỏ qua).
const REVIEW_OF = {
  'elden-ring': 'ersote', wuwa: 'wuwa', mhwilds: 'mhw', genshin: 'gsnat', kcd2: 'kcd2', bmw: 'bmwk', hsr: 'hsr', 'split-fiction': 'spf',
  'demon-slayer-infinity-castle': 'dsic', 'jjk-culling-game': 'jjkanime', 'chainsaw-man-reze': 'csmreze', 'dandadan-s2': 'ddd2',
  'spy-family': 'sxfanime', aot: 'aotfs', 'oshi-no-ko': 'onkanime',
  'vinland-saga': 'vlsaga', 'solo-leveling-ragnarok': 'slragreview', 'one-piece-final': 'opfs', kagurabachi: 'kgb', 'black-clover': 'bcfv',
  'kaiju-no-8': 'kj8m', 'chainsaw-man-p2': 'csmmanga2', 'jujutsu-kaisen-manga': 'jjkfinal', 'dandadan-manga': 'ddmg',
  'ghost-of-yotei': 'goy', 'death-stranding-2': 'ds2', 'mgs-delta': 'mgsdelta', 'suikoden-star-leap': 'sksl', 'mafia-old-country': 'mafiaoc',
  'space-marine-2': 'sm2cr', gfl2: 'gfl2', 'kaiju-no-8-game': 'kj8game', 'blue-protocol': 'bp',
  'dragon-ball-daima': 'dbdaima', 'battle-through-the-heavens': 'btthreview', 'tbate-anime': 'tbatereview'
};

const exists = (u) => fs.existsSync(path.join(root, u.replace(/^\//, '')));
const pageFile = (u) => (u ? articleFile(u) : null);
// Bản EN của bài VI (theo hreflang trong bài VI)
function enOf(viLink) {
  const f = pageFile(viLink);
  if (!f) return null;
  const m = fs.readFileSync(path.join(root, f), 'utf8').match(/<link rel="alternate" hreflang="en" href="https:\/\/otahub\.asia(\/en\/[^"]+)"/);
  return m && pageFile(m[1]) ? m[1] : null;
}
const THUMB_RE = /^\/assets\/img\/(?!_[ts]\/|brand\/)[^?#]+\.(jpe?g|png|webp|jfif)$/i;
// Ảnh thu nhỏ do scripts/build-thumbs.py tạo (_t rộng 640, _s rộng 240); chưa có thì dùng ảnh gốc
const thumb = (u, kind) => {
  if (!THUMB_RE.test(u || '')) return u;
  const t = `/assets/img/${kind}/${u.slice(12)}.webp`;
  return exists(t) ? t : u;
};

const REVIEWS = verifiedReviews();
// Hồ sơ tác phẩm /type/slug (scripts/build-profiles.mjs), tra theo tên VI rồi tên EN của tựa
const PROFILE_PATHS = (() => { const p = profilePaths(JSON.parse(fs.readFileSync(path.join(root, 'assets/catalog.json'), 'utf8'))); return { ...p, ...aliasPaths(p) }; })();
const warnings = [];
const VI_BY_ID = new Map(VI_ITEMS.map((x) => [x.id, x]));
// Tên VI đã Việt hóa -> tên VI cũ (khớp alias trong assets/detail.v2.js) để giữ link hồ sơ
const VI_NAME_ALIAS = {
  "Pháp Sư Tiễn Táng Frieren (Mùa 1 & 2)": "Frieren: Pháp Sư Tiễn Táng (Mùa 1 & 2)",
  "Thanh Gươm Diệt Quỷ: Vô Hạn Thành (Trilogy 1)": "Kimetsu no Yaiba: Vô Hạn Thành (Trilogy 1)",
  "Chú Thuật Hồi Chiến: Culling Game (Mùa 3)": "Jujutsu Kaisen: Culling Game (Mùa 3)",
  "Thợ Săn Quỷ Chainsaw Man: Reze Arc (Movie)": "Chainsaw Man: Reze Arc (Movie)",
  "Steel Ball Run: Cuộc Phiêu Lưu Kì Lạ Của JoJo": "JoJo's Bizarre Adventure: Steel Ball Run",
  "Gia Đình Điệp Viên": "Spy x Family",
  "Đại Chiến Titan: The Final Season": "Attack on Titan: The Final Season",
  "Đứa Con Của Thần Tượng": "Oshi no Ko",
  "Thế Giới Phép Thuật: Hồi Kết": "Black Clover: Hồi Kết",
  "Quái Vật Số 8": "Kaiju No. 8",
  "Thợ Săn Quỷ Chainsaw Man: Phần 2 (Học Viện)": "Chainsaw Man: Phần 2 (Học Viện)",
  "Chú Thuật Hồi Chiến: Đại Chiến Shinjuku": "Jujutsu Kaisen: Đại Chiến Shinjuku",
  "Thợ Rèn Huyền Thoại (Overgeared)": "Overgeared: Thợ Rèn Huyền Thoại"
};

// Tựa bổ sung từ kho hồ sơ tác phẩm (assets/catalog.json + series.json): mọi hồ sơ có ảnh và câu giới thiệu VI/EN,
// chưa nằm trong danh sách tuyển chọn ở trên. Điểm chỉ lấy khi hồ sơ trỏ tới bài review đã xác thực.
const CATALOG = JSON.parse(fs.readFileSync(path.join(root, 'assets/catalog.json'), 'utf8'));
const SERIES = profileSeries(CATALOG);
const REVIEW_BY_URL = new Map([...REVIEWS.values()].map((r) => [r.url, r]));
const MOOD_RULES = [
  [/action|hành động|fight|shooter|soulslike|hack|battle|mecha|martial/i, 'action'],
  [/comedy|slice of life|romance|healing|iyashikei|cozy|farming|life sim|music|idol|family|food/i, 'relax'],
  [/drama|mystery|thriller|psychological|narrative|visual novel|crime|historical|sci-fi|supernatural/i, 'story'],
  [/adventure|fantasy|open world|isekai|exploration|rpg|sandbox/i, 'explore'],
  [/co-op|coop|multiplayer|party|mmo|sports|team/i, 'coop'],
  [/horror|soulslike|roguelike|roguelite|survival|strategy|tactic|hunting|puzzle/i, 'challenge'],
  [/movie|film|phim|short|oneshot/i, 'quick']
];
const TYPE_ORDER = { game: 0, anime: 1, manga: 2 };
function catalogExtras(lang, usedProfiles, usedNames) {
  const en = lang === 'en';
  const out = [];
  for (const sr of SERIES) sr.editions.forEach((e, i) => {
    const c = CATALOG[e.key];
    if (!c || !c.img || !c.hook || !c.hookEn) return;
    const prof = localize('/ho-so/' + sr.slug + (i ? '#' + e.tab : ''), en);
    if (usedProfiles.has(prof)) return;
    const generic = !e.label || /^(Manga|Anime|Game)$/i.test(e.label);
    const name = en ? (generic ? sr.nameEn : `${sr.nameEn}: ${e.labelEn}`) : (generic ? sr.name : `${sr.name}: ${e.label}`);
    if (usedNames.has(name.toLowerCase()) || usedNames.has(e.key.toLowerCase())) return;
    const genre = String(c.genre || '').replace(/\s*\/\s*/g, ' · ');
    const plat = String(c.platforms || '');
    const hay = `${genre} ${e.label} ${e.labelEn} ${e.key}`;
    const subType = c.type === 'game' ? (/ios|android|mobile/i.test(plat) ? 'mobile' : /\bpc\b/i.test(plat) ? 'pc' : 'console')
      : c.type === 'anime' ? (/movie|film|phim/i.test(hay) ? 'movie' : 'series')
      : (/manhwa|webtoon|korea|naver|kakao|hàn/i.test(hay + ' ' + (c.studio || '')) ? 'manhwa' : 'manga');
    let moods = [...new Set(MOOD_RULES.filter(([re]) => re.test(hay)).map(([, m]) => m))];
    if (!moods.length) moods = ['story'];
    const format = c.type === 'game'
      ? (plat.replace(/PlayStation (\d)/g, 'PS$1').replace(/Xbox Series X\|S|Xbox Series|Xbox One/g, 'Xbox').replace(/Nintendo Switch 2/g, 'Switch 2').replace(/Nintendo Switch/g, 'Switch').replace(/iOS \/ Android/g, 'Mobile').split(' / ').filter((x, k, a) => a.indexOf(x) === k).join(' / ') || (en ? 'Multi-platform' : 'Nhiều nền tảng'))
      : c.type === 'anime' ? (subType === 'movie' ? (en ? 'Movie' : 'Phim điện ảnh') : (en ? 'TV Series' : 'Phim bộ'))
      : (subType === 'manhwa' ? 'Manhwa' : 'Manga');
    const status = (en ? (c.statusEn || c.status) : c.status) || '';
    const year = (String(c.release || c.startDate || '').match(/(\d{4})/) || [])[1];
    const live = /gacha|mmo|live|online/i.test(hay);
    const time = c.type === 'game'
      ? ([year ? (en ? `Released ${year}` : `Phát hành ${year}`) : null, live ? 'Live-service' : null].filter(Boolean).join(' · ') || status || (en ? 'See profile' : 'Xem hồ sơ'))
      : (status || (en ? 'See profile' : 'Xem hồ sơ'));
    let r = c.scoreSource === 'review' && c.review ? REVIEW_BY_URL.get(c.review) : null;
    if (r && r.type !== c.type) r = null;
    let link = r ? (en ? r.enUrl : r.url) : ((en ? c.reviewEn : c.review) || null);
    if (link && !pageFile(link)) link = null;
    out.push({ id: 'cat-' + slugify(e.key), type: c.type, name, creator: [c.studio, year].filter(Boolean).join(' · '), format, subType, genre, moods, time,
      score: r ? r.score : null, img: c.img, why: en ? c.hookEn : c.hook, link, reviewed: !!r, profile: prof, extra: true });
  });
  return out.sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
}

function prepare(items, lang) {
  return items.map((it) => {
    const rid = REVIEW_OF[it.id];
    const r = rid ? REVIEWS.get(rid) : null;
    if (rid && !r) warnings.push(`${it.id}: review "${rid}" không còn hợp lệ, bỏ điểm`);
    if (r && r.type !== it.type) warnings.push(`${it.id}: review "${rid}" là ${r.type}, tựa là ${it.type}`);
    let link = r ? (lang === 'en' ? r.enUrl : r.url) : it.link;
    if (!r && lang === 'en' && !(link && link.startsWith('/en/'))) link = enOf(VI_BY_ID.get(it.id)?.link);
    if (link && !pageFile(link)) link = null;
    const prof = PROFILE_PATHS[`${it.type}|${VI_BY_ID.get(it.id)?.name}`] || PROFILE_PATHS[`${it.type}|${VI_NAME_ALIAS[VI_BY_ID.get(it.id)?.name]}`] || PROFILE_PATHS[`${it.type}|${it.name}`];
    return { ...it, score: r ? r.score : null, link: link || null, reviewed: !!r, profile: prof ? localize(prof, lang === 'en') : null };
  });
}

// Top 5 mỗi mục: cùng dữ liệu với trang Xếp hạng (scripts/build-rankings.mjs ghi const CATS)
function rankingsTop(lang) {
  const html = fs.readFileSync(path.join(root, lang === 'en' ? 'en/rankings.html' : 'rankings.html'), 'utf8');
  const m = html.match(/const CATS\s*=\s*(\{[\s\S]*?\n\})\s*;/);
  if (!m) throw new Error('Không đọc được const CATS trong trang Xếp hạng');
  const scope = {};
  vm.runInNewContext('c=' + m[1], scope);
  const out = {};
  for (const k of ['game', 'anime', 'manga']) {
    out[k] = [...scope.c[k].top, ...scope.c[k].rest].slice(0, 5)
      .map((x) => ({ title: x.title, url: x.url, img: x.img, studio: x.studio, genre: x.genre || x.sub || '', score: x.score }));
  }
  return out;
}

// ═════════════════════════════════════════════════════════════════════
// 3. GIAO DIỆN
// ═════════════════════════════════════════════════════════════════════
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsStr = (s) => "'" + String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/<\//g, '<\\/') + "'";

const TXT = {
  vi: {
    title: 'Gợi ý chơi gì, xem gì, đọc gì hôm nay · OtaHub',
    ogTitle: 'Chơi Gì · Xem Gì · Đọc Gì? | Gợi Ý Game, Anime & Manga Hôm Nay · OtaHub',
    desc: 'Không biết hôm nay chơi game gì, xem anime gì hay đọc manga nào? Chọn tâm trạng, OtaHub gợi ý ngay một tựa đáng thử kèm bài review và điểm số thật.',
    keywords: 'chơi game gì, xem anime gì, đọc manga gì, gợi ý game, gợi ý anime hôm nay, manhwa hay, top game 2026, otahub choi gi',
    locale: 'vi_VN', home: 'Trang chủ', crumb: 'Chơi gì?',
    h1: 'Hôm nay <em>chơi gì, xem gì, đọc gì?</em>',
    lead: 'Chọn thứ bạn muốn và tâm trạng lúc này. OtaHub gợi ý ngay một tựa đáng thử, kèm bài viết để bạn đọc trước khi bắt đầu.',
    want: 'Bạn muốn gì?', format: 'Định dạng', mood: 'Tâm trạng lúc này',
    panelT: 'Hôm nay chơi gì?', panelP: 'Chọn loại và tâm trạng rồi bấm nút. OtaHub rút ngẫu nhiên một tựa từ danh sách biên tập tuyển chọn, kèm điểm review thật.', stepRoll: 'Nhận gợi ý', resultH: 'Kết quả',
    types: { all: ['✨', 'Gì cũng được'], game: ['🎮', 'Chơi game'], anime: ['🎬', 'Xem anime'], manga: ['📖', 'Đọc truyện'] },
    subs: { game: { all: 'Mọi nền tảng', pc: 'PC', console: 'Console', mobile: 'Mobile' }, anime: { all: 'Tất cả', series: 'Phim bộ', movie: 'Phim điện ảnh' }, manga: { all: 'Tất cả', manga: 'Manga Nhật', manhwa: 'Manhwa Hàn' } },
    moods: { all: ['✨', 'Bất kỳ'], relax: ['☕', 'Thư giãn'], action: ['⚔️', 'Hành động'], story: ['🧠', 'Cốt truyện'], coop: ['👥', 'Cùng bạn bè'], quick: ['⚡', 'Nhanh gọn'], explore: ['🗺️', 'Thế giới mở'], challenge: ['💀', 'Thử thách'] },
    more: 'Xem thêm {n} tựa ↓', roll: 'Gợi ý cho tôi', rollAgain: 'Gợi ý khác', count: (n) => `<b>${n}</b> tựa phù hợp`, seeAll: 'Xem danh sách',
    today: 'Gợi ý hôm nay', forYou: 'Gợi ý cho bạn', chosen: 'Bạn đang xem',
    typeName: { game: 'Game', anime: 'Anime', manga: 'Manga', manhwa: 'Manhwa' },
    scoreDt: 'Điểm review OtaHub', noScoreDt: 'Điểm OtaHub', noScore: 'Chưa có review', timeDt: 'Thời lượng',
    readReview: 'Đọc review', readArticle: 'Đọc bài viết', noArticle: 'Chưa có bài viết riêng', profile: 'Hồ sơ', profileBtn: 'Hồ sơ tác phẩm',
    share: 'Chia sẻ gợi ý này', copied: 'Đã sao chép link gợi ý', recent: 'Vừa gợi ý',
    pick: 'Biên tập chọn', quick: 'Xem nhanh',
    allH: 'Tất cả gợi ý', allP: 'Danh sách thay đổi theo lựa chọn ở trên. Bấm vào một tựa để xem nhanh.',
    empty: 'Chưa có tựa nào khớp cả định dạng lẫn tâm trạng này.', clearMood: 'Bỏ chọn tâm trạng',
    topH: 'Điểm cao nhất trên OtaHub',
    topP: 'Top 5 mỗi mục theo điểm bài review, cùng nguồn với <a href="/rankings">Bảng xếp hạng</a>.',
    topCols: { game: '🎮 Game', anime: '🎬 Anime', manga: '📖 Manga' }, topMore: 'Xem top 10', rankings: '/rankings',
    faqH: 'Câu hỏi thường gặp',
    faq: [
      ['OtaHub gợi ý tựa game, anime, manga như thế nào?', 'Bạn chọn loại (game, anime hay truyện), định dạng và tâm trạng. OtaHub lọc trong danh sách tựa do ban biên tập tuyển chọn rồi gợi ý ngẫu nhiên, không lặp lại cho tới khi bạn đã xem hết các tựa phù hợp.'],
      ['Điểm số trên trang này lấy từ đâu?', 'Điểm là điểm của bài review OtaHub về chính tựa đó, chấm theo Tiêu chuẩn đánh giá công khai của OtaHub. Tựa chưa có bài review được ghi "Biên tập chọn" và không gắn điểm.'],
      ['Manga và Manhwa khác nhau như thế nào?', 'Manga là truyện tranh Nhật Bản, thường in đen trắng và đọc từ phải sang trái. Manhwa là truyện tranh Hàn Quốc, phần lớn là webtoon màu đọc cuộn dọc, rất hợp với điện thoại.'],
      ['Tôi có cần tài khoản để dùng tính năng gợi ý không?', 'Không. Bộ lọc, nút gợi ý và các bài review trên OtaHub đều miễn phí và không cần đăng nhập.']
    ],
    search: 'Tìm kiếm game, anime, manga...', searchHint: 'Nhấn ESC để đóng', searchLabel: 'Tìm kiếm',
    appName: 'Cỗ máy gợi ý giải trí OtaHub', listName: 'Gợi ý game, anime, manga có review trên OtaHub'
  },
  en: {
    title: 'What to Play, Watch & Read? · OtaHub Entertainment Picker',
    ogTitle: 'What to Play, Watch & Read? · OtaHub Entertainment Picker',
    desc: "Can't decide what game to play, anime to watch or manga to read today? Pick a mood and OtaHub suggests a title worth your time, with a review and a real score.",
    keywords: 'what to play, what to watch, what to read, game recommendations, anime suggestions, manga picks, otahub',
    locale: 'en_US', home: 'Home', crumb: 'What to Play',
    h1: 'What should I <em>play, watch or read today?</em>',
    lead: "Pick what you're after and how you feel right now. OtaHub suggests a title worth your time, with an article to read before you start.",
    want: 'What do you want?', format: 'Format', mood: 'Your mood right now',
    panelT: 'What should I play today?', panelP: 'Pick a type and a mood, then hit the button. OtaHub draws one title at random from our editor-curated list, with its real review score.', stepRoll: 'Get a pick', resultH: 'Your pick',
    types: { all: ['✨', 'Anything'], game: ['🎮', 'Play a game'], anime: ['🎬', 'Watch anime'], manga: ['📖', 'Read manga'] },
    subs: { game: { all: 'All platforms', pc: 'PC', console: 'Console', mobile: 'Mobile' }, anime: { all: 'All', series: 'TV series', movie: 'Movies' }, manga: { all: 'All', manga: 'Manga', manhwa: 'Manhwa' } },
    moods: { all: ['✨', 'Any mood'], relax: ['☕', 'Chill'], action: ['⚔️', 'Action'], story: ['🧠', 'Story-rich'], coop: ['👥', 'With friends'], quick: ['⚡', 'Quick fun'], explore: ['🗺️', 'Open world'], challenge: ['💀', 'Challenge'] },
    more: 'Show {n} more ↓', roll: 'Suggest something', rollAgain: 'Another pick', count: (n) => `<b>${n}</b> matching titles`, seeAll: 'See the list',
    today: "Today's pick", forYou: 'Picked for you', chosen: "You're viewing",
    typeName: { game: 'Game', anime: 'Anime', manga: 'Manga', manhwa: 'Manhwa' },
    scoreDt: 'OtaHub review score', noScoreDt: 'OtaHub score', noScore: 'Not reviewed yet', timeDt: 'Length',
    readReview: 'Read the review', readArticle: 'Read the article', noArticle: 'No dedicated article yet', profile: 'Profile', profileBtn: 'Title profile',
    share: 'Share this pick', copied: 'Link copied', recent: 'Recent picks',
    pick: "Editor's pick", quick: 'Quick look',
    allH: 'All picks', allP: 'The list follows your choices above. Tap a title for a quick look.',
    empty: 'No title matches both this format and this mood yet.', clearMood: 'Clear mood',
    topH: 'Highest rated on OtaHub',
    topP: 'Top 5 in each section by review score, from the same data as our <a href="/en/rankings">Rankings</a>.',
    topCols: { game: '🎮 Games', anime: '🎬 Anime', manga: '📖 Manga' }, topMore: 'See the top 10', rankings: '/en/rankings',
    faqH: 'Frequently asked questions',
    faq: [
      ['How does OtaHub pick a game, anime or manga for me?', 'Choose what you want (a game, anime or manga), a format and a mood. OtaHub filters our editor-curated list and picks at random, without repeats until you have seen every matching title.'],
      ['Where do the scores on this page come from?', "Each score is the score from OtaHub's own review of that title, under our published review standards. Titles we have not reviewed yet are marked \"Editor's pick\" and show no score."],
      ['What is the difference between manga and manhwa?', 'Manga are Japanese comics, usually black and white and read right to left. Manhwa are Korean comics, mostly full-colour webtoons read by scrolling down, which suits phones well.'],
      ['Do I need an account to use the picker?', 'No. The filters, the pick button and every OtaHub review are free, with no sign-up.']
    ],
    search: 'Search games, anime, manga...', searchHint: 'Press ESC to close', searchLabel: 'Search',
    appName: 'OtaHub Entertainment Picker', listName: 'Games, anime and manga reviewed on OtaHub'
  }
};

const ACC = { game: 'var(--cyan)', anime: 'var(--sakura)', manga: 'var(--lav)' };
const typeKey = (it) => (it.type === 'manga' && it.subType === 'manhwa' ? 'manhwa' : it.type);

// Giữ nguyên menu / menu trượt / footer đang có trên trang (scripts/sync-site-chrome.mjs quản lý các khối này)
function keepBlock(old, re, fallback) {
  const m = old && old.match(re);
  return m ? m[0] : fallback;
}

function buildHtml(lang, old) {
  const isEn = lang === 'en';
  const t = TXT[lang];
  const curated = prepare(isEn ? EN_ITEMS : VI_ITEMS, lang);
  const items = [...curated, ...catalogExtras(lang, new Set(curated.map((x) => x.profile).filter(Boolean)), new Set(curated.map((x) => x.name.toLowerCase())))];
  const top = rankingsTop(lang);
  const prefix = isEn ? '/en' : '';
  const canonical = `https://otahub.asia${prefix}/choi-gi`;
  const first = items.find((x) => x.reviewed) || items[0];

  const NAV_FALLBACK = `<nav class="nav"><div class="nav-in"><a href="${prefix}/" class="logo"><img src="/assets/img/brand/otahub-icon.png" alt="" width="34" height="34"><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><ul class="nav-links"></ul><button class="ham" id="hamBtn" aria-label="Menu" onclick="toggleMobileNav()"><span></span><span></span><span></span></button><div class="nav-r"><button class="nsearch" aria-label="${t.searchLabel}" onclick="openSearch()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><a href="${prefix}/#newsletter" class="cta" id="cta-sub">${isEn ? 'Subscribe' : 'Đăng ký'}</a></div></div></nav>`;
  // Giữ luôn dải nổi bật trên điện thoại (nav-hot-m) nếu sync-site-chrome.mjs đã chèn ngay sau menu
  const nav = keepBlock(old, /<nav class="nav">[\s\S]*?<\/nav>(?:<style data-hot-m>[\s\S]*?<\/style><a [^>]*class="nav-hot-m"[\s\S]*?<\/a>)?/, NAV_FALLBACK);
  const mobileNav = keepBlock(old, /<div class="mobile-nav" id="mobileNav">[\s\S]*?\n<\/div>/, '<div class="mobile-nav" id="mobileNav">\n</div>');
  const footer = keepBlock(old, /<footer>[\s\S]*?<\/footer>/, '<footer></footer>');

  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.appName, applicationCategory: 'EntertainmentApplication', operatingSystem: 'Any', url: canonical, description: t.desc, inLanguage: lang, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: `https://otahub.asia${prefix}/` },
      { '@type': 'ListItem', position: 2, name: t.crumb, item: canonical }] },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: t.listName, itemListElement: items.filter((x) => x.reviewed).map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: 'https://otahub.asia' + x.link })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  ];

  const segBtn = (k) => `<button type="button" class="seg-btn${k === 'all' ? ' on' : ''}" data-type="${k}" aria-pressed="${k === 'all'}"><span class="seg-ic" aria-hidden="true">${t.types[k][0]}</span><span class="seg-tx">${t.types[k][1]}</span></button>`;
  const moodBtn = (k) => `<button type="button" class="chip${k === 'all' ? ' on' : ''}" data-mood="${k}" aria-pressed="${k === 'all'}"><span aria-hidden="true">${t.moods[k][0]}</span>${t.moods[k][1]}</button>`;

  const scoreBadge = (it) => (it.score !== null ? `<span class="c-score" title="${esc(t.scoreDt)}">${it.score.toFixed(1)}</span>` : `<span class="c-pick">${t.pick}</span>`);
  const card = (it) => `<article class="card" data-id="${it.id}" data-type="${it.type}" data-sub="${it.subType}" data-moods="${it.moods.join(' ')}" style="--acc:${ACC[it.type]}">
        <div class="c-media"><img src="${thumb(it.img, '_t')}" alt="" loading="lazy" decoding="async" width="320" height="200"><span class="c-type">${t.typeName[typeKey(it)]}</span>${scoreBadge(it)}</div>
        <div class="c-body">
          <h3 class="c-title"><button type="button" class="c-open" data-open="${it.id}">${esc(it.name)}</button></h3>
          <p class="c-meta">${esc(it.genre)}${it.profile ? ` · <a class="c-link c-prof" href="${it.profile}">${t.profile}</a>` : ''}</p>
          <p class="c-foot"><span>${esc(it.format)}</span>${it.link ? `<a class="c-link" href="${it.link}">${it.reviewed ? t.readReview : t.readArticle} →</a>` : `<span class="c-link c-link-soft">${t.quick}</span>`}</p>
        </div>
      </article>`;

  const topCol = (k) => `<div class="top-col" data-col="${k}" style="--acc:${ACC[k]}">
        <h3 class="top-h">${t.topCols[k]}</h3>
        <ol class="top-list">${top[k].map((x, i) => `
          <li><a href="${x.url}"><span class="tl-n">${i + 1}</span><img src="${thumb(x.img, '_s')}" alt="" loading="lazy" decoding="async" width="52" height="52"><span class="tl-t"><b>${esc(x.title)}</b><small>${esc([x.studio, x.genre].filter(Boolean).join(' · '))}</small></span><span class="tl-s">${esc(x.score)}</span></a></li>`).join('')}
        </ol>
        <a class="top-more" href="${t.rankings}">${t.topMore} →</a>
      </div>`;

  // Dữ liệu cho script (img:'..' để build-thumbs.py tạo sẵn ảnh _t/_s)
  const data = items.map((it) => `{id:${jsStr(it.id)},type:${jsStr(it.type)},sub:${jsStr(it.subType)},name:${jsStr(it.name)},creator:${jsStr(it.creator)},format:${jsStr(it.format)},genre:${jsStr(it.genre)},moods:[${it.moods.map(jsStr).join(',')}],time:${jsStr(it.time)},score:${it.score === null ? 'null' : it.score.toFixed(1)},img:${jsStr(it.img)},t:${jsStr(thumb(it.img, '_t'))},s:${jsStr(thumb(it.img, '_s'))},why:${jsStr(it.why)},link:${it.link ? jsStr(it.link) : 'null'},pf:${it.profile ? jsStr(it.profile) : 'null'},rv:${it.reviewed ? 1 : 0}${it.extra ? ',x:1' : ''}}`).join(',\n      ');
  const I18N = {
    today: t.today, forYou: t.forYou, chosen: t.chosen, typeName: t.typeName, scoreDt: t.scoreDt, noScoreDt: t.noScoreDt, noScore: t.noScore,
    readReview: t.readReview, readArticle: t.readArticle, noArticle: t.noArticle, profileBtn: t.profileBtn, copied: t.copied, more: t.more, subs: t.subs, moods: t.moods, count: t.count(0),
    pick: t.pick, quick: t.quick, profile: t.profile
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(t.title)}</title>
  <meta name="description" content="${esc(t.desc)}">
  <meta name="keywords" content="${esc(t.keywords)}">
  <meta name="author" content="OtaHub">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="vi" href="https://otahub.asia/choi-gi">
  <link rel="alternate" hreflang="en" href="https://otahub.asia/en/choi-gi">
  <link rel="alternate" hreflang="x-default" href="https://otahub.asia/choi-gi">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(t.ogTitle)}">
  <meta property="og:description" content="${esc(t.desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://otahub.asia/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="OtaHub">
  <meta property="og:locale" content="${t.locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(t.ogTitle)}">
  <meta name="twitter:description" content="${esc(t.desc)}">
  <meta name="twitter:image" content="https://otahub.asia/og-image.png">
  <meta name="twitter:site" content="@OtaHubAsia">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <meta name="theme-color" content="#080318">
${schema.map((s) => `  <script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
  <script>/* GA tải sau khi trang hiển thị (không tranh băng thông/CPU với nội dung) */(function(){var d=0;function l(){if(d)return;d=1;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-12852ZFD0K';document.head.appendChild(s);}['pointerdown','keydown','scroll','touchstart'].forEach(function(e){addEventListener(e,l,{once:true,passive:true});});function idle(){(window.requestIdleCallback||function(f){setTimeout(f,1500)})(l,{timeout:3000});}if(document.readyState==='complete')idle();else addEventListener('load',idle);})();</script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-12852ZFD0K');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"></noscript>
  <link rel="stylesheet" href="/assets/clamp.v2.css?v=${SCRIPT_V(old, 'clamp.v2.css', '20260926')}">
  <link rel="stylesheet" href="/assets/mobile-fix.css?v=${MOBILE_FIX_V(old)}">
  <style>
    :root {
      --bg: #070314; --panel: rgba(20, 10, 48, .72); --panel2: rgba(255, 255, 255, .035);
      --line: rgba(255, 255, 255, .1); --line2: rgba(255, 255, 255, .2);
      --cyan: #00f2ff; --sakura: #ff2177; --lav: #a78bfa; --amber: #fbbf24; --violet: #7c3aed;
      --white: #fff; --text: #f1f5f9; --text-sub: #cbd5e1; --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, .07); --bcyan: rgba(0, 242, 255, .18); --muted: rgba(240, 238, 255, .35); --border-cyan: rgba(0, 242, 255, .3); --cyan-glow: rgba(0, 242, 255, .35);
      --fd: 'Plus Jakarta Sans', 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --fb: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --ease: cubic-bezier(.16, 1, .3, 1); --r: 18px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    html, body { overflow-x: hidden; width: 100%; }
    body { background: var(--bg); color: var(--text); font-family: var(--fb); font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased;
      background-image: radial-gradient(ellipse 90% 420px at 50% 0, rgba(124, 58, 237, .26), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 30%, rgba(255, 33, 119, .07), transparent 60%), radial-gradient(ellipse 60% 40% at 0 60%, rgba(0, 242, 255, .06), transparent 60%); }
    button { font: inherit; color: inherit; }
    a { color: inherit; }
    :focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }

    /* Menu / footer / tìm kiếm: CSS đồng bộ với các trang hub (gaming.html); nội dung khối do sync-site-chrome.mjs quản lý */
    @font-face{font-family:'BHN Fonarto Regular';src:url('/assets/fonts/BHNFonartoRegular-latin.woff2') format('woff2'),url('/assets/fonts/BHNFonartoRegular.otf') format('opentype');font-weight:400;font-style:normal;font-display:swap}
    .nav{position:sticky;top:0;z-index:300;height:60px;background:rgba(11,4,24,.92);border-bottom:1px solid var(--bcyan);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;align-items:center}
    .nav-in{max-width:1440px;margin:0 auto;padding:0 24px;width:100%;display:flex;align-items:center;gap:0}
    .logo{display:flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0;margin-right:32px}
    .logo svg{width:30px;height:30px;animation:lp 3s ease-in-out infinite}
    @keyframes lp{0%,100%{filter:drop-shadow(0 0 4px var(--cyan)) drop-shadow(0 0 12px rgba(0,242,255,.5))}50%{filter:drop-shadow(0 0 8px var(--cyan)) drop-shadow(0 0 24px rgba(0,242,255,.9))}}
    .logo-t{font-family:'BHN Fonarto Regular',var(--fd);font-weight:400;font-size:30px;letter-spacing:-.01em;line-height:1;position:relative;top:0.14em}
    .logo-ota{color:var(--sakura)}
    .logo-hub{color:var(--cyan)}
    .nav-links{display:flex;align-items:center;list-style:none;gap:0;flex:1}
    .nav-links a{color:var(--muted);text-decoration:none;font-size:12px;font-weight:400;letter-spacing:.07em;text-transform:uppercase;padding:0 13px;height:60px;display:flex;align-items:center;position:relative;transition:color .2s}
    .nav-links a::after{content:'';position:absolute;bottom:0;left:13px;right:13px;height:2px;background:var(--cyan);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
    .nav-links a:hover,.nav-links a.active{color:var(--white)}
    .nav-links a:hover::after,.nav-links a.active::after{transform:scaleX(1)}
    .nav-r{display:flex;align-items:center;gap:8px;margin-left:auto}
    .lang{display:flex;align-items:center;border:1px solid var(--border);overflow:hidden}
    .nsearch{background:none;border:1px solid var(--border);color:var(--muted);width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s,color .2s}
    .nsearch:hover{border-color:var(--cyan);color:var(--cyan)}
    .cta{background:var(--cyan);color:var(--bg);font-family:var(--fd);font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;padding:8px 20px;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);transition:background .18s;text-decoration:none;display:inline-block;white-space:nowrap}
    .cta:hover{background:#33eeff}
    .cta:active{transform:translateY(1px) scale(.98)}
    footer{position:relative;z-index:1;border-top:1px solid var(--border);background:rgba(6,2,14,.98)}
    .ft-in{max-width:1440px;margin:0 auto;padding:40px 24px 24px;display:grid;grid-template-columns:190px 1fr 1fr 1fr;gap:40px}
    .ft-logo-wrap{display:flex;align-items:center;gap:9px;margin-bottom:12px;text-decoration:none}
    .ft-desc{font-size:12px;color:rgba(240,238,255,.28);line-height:1.7;max-width:170px}
    .ft-h{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;font-weight:500}
    .ft-links{display:flex;flex-direction:column;gap:8px;list-style:none}
    .ft-links a{font-size:13px;color:rgba(240,238,255,.42);text-decoration:none;transition:color .2s}
    .ft-links a:hover{color:var(--cyan)}
    .ft-bot{max-width:1440px;margin:0 auto;padding:14px 24px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
    .ft-copy{font-size:11px;color:rgba(240,238,255,.2);letter-spacing:.04em}
    .ft-soc{display:flex;gap:6px}
    @media(max-width:1100px){.ft-in{grid-template-columns:1fr 1fr}}
    @media(max-width:768px){.nav-links{display:none} .wrap,.nav-in,.ft-in,.ft-bot{padding-left:16px;padding-right:16px} .ft-in{grid-template-columns:1fr;gap:24px} .ft-bot{flex-direction:column}}
    .ham{min-width:44px;min-height:44px;display:none;background:none;border:none;cursor:pointer;padding:8px;flex-direction:column;gap:5px;align-items:center;justify-content:center}
    @media(max-width:768px){.ham{display:flex}}
    .ft-desc{color: #cbd5e1 !important;}
    .ft-links a{color: #cbd5e1 !important; transition: color .2s;}
    .ft-links a:hover{color: #00f2ff !important;}
    .search-overlay{position:fixed;inset:0;z-index:500;background:rgba(11,2,32,.96);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;opacity:0;pointer-events:none;transition:opacity .25s}
    .search-overlay.open{opacity:1;pointer-events:all}
    .search-box{width:min(640px,90vw);position:relative}
    .search-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(0,242,255,.2);outline:none;color:#f0eeff;font-family:var(--fb);font-size:20px;padding:18px 56px 18px 20px;transition:border-color .2s,box-shadow .2s}
    .search-input:focus{border-color:rgba(0,242,255,.6);box-shadow:0 0 0 3px rgba(0,242,255,.1)}
    .search-input::placeholder{color:rgba(240,238,255,.25)}
    .search-close{position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(240,238,255,.5);font-size:20px;cursor:pointer;transition:color .2s;padding:4px}
    .search-close:hover{color:#00f2ff}
    .search-hint{font-size:12px;color:rgba(240,238,255,.35);letter-spacing:.07em}
    .search-tags{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
    .ham{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:5px;align-items:center;justify-content:center}
    .ham span{display:block;width:22px;height:2px;background:rgba(240,238,255,.45);border-radius:2px;transition:all .3s}
    .ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg);background:#00f2ff}
    .ham.open span:nth-child(2){opacity:0;transform:scaleX(0)}
    .ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:#00f2ff}
    .mobile-nav{display:none;position:fixed;inset:0;top:62px;z-index:290;background:rgba(11,2,32,.97);backdrop-filter:blur(24px);padding:28px 24px;flex-direction:column;gap:0;transform:translateY(-8px);opacity:0;transition:transform .3s,opacity .3s;pointer-events:none}
    .mobile-nav.open{transform:translateY(0);opacity:1;pointer-events:all}
    .mobile-nav a{display:block;color:rgba(240,238,255,.62);text-decoration:none;font-family:var(--fd);font-size:22px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08);transition:color .2s,padding-left .2s}
    .mobile-nav a:hover{color:#00f2ff;padding-left:8px}
    @media(max-width:768px){.ham{display:flex} .mobile-nav{display:flex}}
    @media(min-width:1101px){.nav-hot-m{display:none!important}}
    footer { margin-top: 72px; }

    /* ── Trang Chơi gì ── */
    .cg { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 24px; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

    /* Bộ lọc */
    .machine { margin-top: 24px; display: grid; grid-template-columns: 400px minmax(0, 1fr); gap: 20px; align-items: stretch; min-width: 0; }
    .machine-out { min-width: 0; display: flex; flex-direction: column; }
    .finder { --facc: var(--amber); min-width: 0; display: flex; flex-direction: column; background: var(--panel); border: 1px solid var(--line); border-radius: 22px; padding: 20px 20px 22px; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 24px 60px rgba(0, 0, 0, .35); }
    .f-head { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
    .f-title { font-family: var(--fd); font-weight: 800; font-size: 21px; letter-spacing: -.015em; color: #fff; line-height: 1.2; }
    .f-sub { margin-top: 6px; font-size: 13.5px; line-height: 1.55; color: var(--text-muted); }
    .f-row + .f-row { margin-top: 16px; }
    .f-row[hidden] { display: none; }
    .f-label { display: flex; align-items: center; gap: 9px; font-family: var(--fd); font-size: 11.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-sub); margin-bottom: 9px; }
    .f-step { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: 0; color: #0b0418; background: var(--facc); transition: background .2s; }
    .f-step-sub { background: rgba(255, 255, 255, .14); color: #fff; }
    .seg { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; padding: 6px; border-radius: 16px; background: rgba(0, 0, 0, .3); border: 1px solid var(--line); }
    .seg-btn { display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 9px 11px; border-radius: 11px; border: 1px solid transparent; background: transparent; cursor: pointer; font-family: var(--fd); font-weight: 700; font-size: 14px; color: var(--text-sub); text-align: left; transition: border-color .2s, background .2s, color .2s, transform .15s, box-shadow .2s; }
    .seg-tx { flex: 1; min-width: 0; }
    .seg-btn:hover { background: rgba(255, 255, 255, .05); color: #fff; }
    .seg-btn:active { transform: scale(.98); }
    .seg-ic { font-size: 18px; line-height: 1; }
    .seg-n { font-size: 11.5px; font-weight: 700; color: var(--text-muted); background: rgba(255, 255, 255, .07); border-radius: 999px; padding: 2px 8px; min-width: 26px; text-align: center; }
    .seg-btn.on { color: #fff; border-color: color-mix(in srgb, var(--acc, var(--amber)) 60%, transparent); background: color-mix(in srgb, var(--acc, var(--amber)) 16%, rgba(255, 255, 255, .03)); box-shadow: 0 8px 20px -10px color-mix(in srgb, var(--acc, var(--amber)) 80%, transparent); }
    .seg-btn.on .seg-n { color: #0b0418; background: var(--acc, var(--amber)); }
    .seg-btn[data-type="game"] { --acc: var(--cyan); } .seg-btn[data-type="anime"] { --acc: var(--sakura); } .seg-btn[data-type="manga"] { --acc: var(--lav); }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--panel2); color: var(--text-sub); font-size: 13px; font-weight: 600; cursor: pointer; transition: border-color .2s, background .2s, color .2s; white-space: nowrap; }
    .chip:hover { border-color: var(--line2); color: #fff; }
    .chip.on { border-color: var(--facc); color: #fff; background: color-mix(in srgb, var(--facc) 14%, transparent); box-shadow: inset 0 0 0 1px var(--facc); }
    .chip:disabled { opacity: .38; cursor: not-allowed; }
    .f-foot { margin-top: auto; padding-top: 18px; }
    .roll { display: flex; width: 100%; align-items: center; justify-content: center; gap: 10px; padding: 15px 30px; border: none; border-radius: 999px; cursor: pointer; font-family: var(--fd); font-weight: 800; font-size: 16.5px; color: #fff; background: linear-gradient(120deg, #7c3aed, #c026d3 55%, var(--sakura)); box-shadow: 0 10px 30px rgba(192, 38, 211, .35); transition: transform .15s, box-shadow .2s, filter .2s; }
    .roll:hover { filter: brightness(1.08); box-shadow: 0 14px 38px rgba(192, 38, 211, .45); }
    .roll:active { transform: scale(.97); }
    .roll:disabled { opacity: .5; cursor: not-allowed; }
    .dice { display: inline-block; font-size: 20px; }
    .rolling .dice { animation: spin .55s var(--ease); }
    @keyframes spin { to { transform: rotate(360deg) scale(1.1); } }
    .f-count { color: var(--text-muted); font-size: 13.5px; text-align: center; margin-top: 10px; }
    .f-count b { color: #fff; font-family: var(--fd); }
    .f-count a { color: var(--cyan); text-decoration: none; margin-left: 6px; }
    .f-count a:hover { text-decoration: underline; }

    /* Thẻ gợi ý */
    .pick { flex: 1; display: grid; grid-template-columns: minmax(0, 42%) 1fr; border-radius: 22px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--acc) 32%, var(--line)); background: linear-gradient(160deg, rgba(30, 16, 70, .85), rgba(14, 7, 34, .92)); box-shadow: 0 24px 60px rgba(0, 0, 0, .4), 0 0 60px -20px color-mix(in srgb, var(--acc) 35%, transparent); scroll-margin-top: 76px; transition: opacity .25s, transform .25s, border-color .3s, box-shadow .3s; }
    .pick.is-rolling { opacity: .35; transform: scale(.992); }
    .pick-media { position: relative; min-height: 400px; overflow: hidden; background: #0b0418; isolation: isolate; }
    .pick-bg { position: absolute; inset: -30px; width: calc(100% + 60px); height: calc(100% + 60px); object-fit: cover; filter: blur(28px) brightness(.42) saturate(1.4); }
    .pick-media::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgba(7, 3, 20, .55) 100%); }
    .pick-img { position: absolute; inset: 24px; width: calc(100% - 48px); height: calc(100% - 48px); object-fit: contain; filter: drop-shadow(0 22px 40px rgba(0, 0, 0, .65)); z-index: 1; }
    .pick-media::after { content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(90deg, transparent 78%, rgba(14, 7, 34, .55)); }
    /* Ảnh ngang: ảnh nằm trên (khung 21:9 chỉ xén nhẹ mép), nội dung bên dưới */
    .pick.is-wide { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }
    .pick.is-wide .pick-media { min-height: 0; aspect-ratio: 21 / 9; }
    .pick.is-wide .pick-img { inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; filter: none; }
    .pick.is-wide .pick-bg { display: none; }
    .pick.is-wide .pick-media::before { background: linear-gradient(to top, rgba(14, 7, 34, .7), transparent 45%); z-index: 1; }
    .pick.is-wide .pick-media::after { background: none; }
    .pick.is-wide .pick-body { padding: 20px 28px 26px; justify-content: flex-start; }
    .pick.is-wide .pick-title { font-size: clamp(24px, 2.4vw, 30px); }
    .pick.is-wide .pick-facts { grid-template-columns: repeat(2, minmax(0, 220px)); }
    .pick.is-wide .pick-actions { margin-top: auto; padding-top: 20px; }
    .pick-media-link { position: absolute; inset: 0; z-index: 2; }
    .pick-media-link[hidden] { display: none; }
    .pick-img { transition: transform .45s var(--ease); }
    .pick-media:has(.pick-media-link:hover) .pick-img { transform: scale(1.03); }
    .pick-title-link { color: inherit; text-decoration: none; transition: color .2s; }
    .pick-title-link[href]:hover { color: var(--acc); }
    .pick-type { position: absolute; z-index: 2; left: 16px; top: 16px; font-family: var(--fd); font-size: 11.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #0b0418; background: var(--acc); padding: 5px 11px; border-radius: 8px; }
    .pick-body { position: relative; padding: 26px 28px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
    .pick-body::before { content: ''; position: absolute; right: -80px; top: -80px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--acc) 22%, transparent), transparent 70%); pointer-events: none; }
    .pick-body > * { position: relative; }
    .pick-top { display: flex; align-items: center; gap: 8px; }
    .pick-ic { font-size: 16px; line-height: 1; }
    .pick-eyebrow { font-family: var(--fd); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--acc); }
    .pick-title { font-family: var(--fd); font-weight: 800; font-size: clamp(24px, 2.6vw, 34px); line-height: 1.18; letter-spacing: -.015em; color: #fff; margin-top: 8px; }
    .pick-meta { color: var(--text-muted); font-size: 14px; margin-top: 6px; }
    .pick-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
    .pick-tags span { font-size: 12px; font-weight: 600; color: var(--text-sub); border: 1px solid var(--line); border-radius: 8px; padding: 3px 9px; }
    .pick-why { margin-top: 16px; color: #e2e8f0; font-size: 15.5px; line-height: 1.7; }
    .pick-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
    .fact { border: 1px solid var(--line); background: var(--panel2); border-radius: 14px; padding: 10px 14px; min-width: 0; }
    .fact dt { font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); font-weight: 600; line-height: 1.35; }
    .fact dd { font-family: var(--fd); font-weight: 800; font-size: 16.5px; color: #fff; margin-top: 3px; line-height: 1.3; }
    .fact-score dd { color: var(--amber); font-size: 24px; line-height: 1.2; }
    .fact-score dd small { font-size: 13px; color: var(--text-muted); font-weight: 600; }
    .fact-score.is-none dd { color: var(--text-sub); font-size: 15px; font-weight: 700; padding-top: 5px; }
    .pick-moods { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
    .pick-moods span { font-size: 12.5px; color: var(--text-sub); background: rgba(255, 255, 255, .05); border-radius: 999px; padding: 3px 10px; }
    .pick-actions { display: flex; gap: 10px; margin-top: 22px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; padding: 0 20px; border-radius: 12px; font-family: var(--fd); font-weight: 700; font-size: 14.5px; text-decoration: none; cursor: pointer; transition: filter .2s, border-color .2s, background .2s; }
    .btn-main { background: var(--acc); color: #0b0418; border: none; }
    .btn-main:hover { filter: brightness(1.1); }
    .btn-main[hidden] { display: none; }
    .btn-ghost { border: 1px solid var(--line2); background: transparent; color: #fff; }
    .btn-ghost:hover { border-color: var(--acc); background: rgba(255, 255, 255, .04); }
    .btn-icon { width: 46px; padding: 0; border: 1px solid var(--line2); background: transparent; color: var(--text-sub); }
    .btn-icon:hover { color: #fff; border-color: var(--acc); }
    .no-article { align-self: center; color: var(--text-muted); font-size: 13.5px; }
    .no-article[hidden], .pick-actions .btn[hidden] { display: none; }
    .c-prof { font-weight: 600; }
    .recent { display: flex; align-items: center; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
    .recent[hidden] { display: none; }
    .recent-l { font-size: 12.5px; color: var(--text-muted); font-weight: 600; }
    .recent-list { display: flex; gap: 8px; flex-wrap: wrap; }
    .recent-list button { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 999px; border: 1px solid var(--line); background: var(--panel2); cursor: pointer; font-size: 12.5px; color: var(--text-sub); max-width: 220px; }
    .recent-list button:hover { border-color: var(--line2); color: #fff; }
    .recent-list img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .recent-list span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Khối chung */
    .sec { margin-top: 64px; scroll-margin-top: 76px; }
    .sec-head { display: flex; align-items: end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    .sec-head h2 { font-family: var(--fd); font-weight: 800; font-size: clamp(22px, 2.4vw, 28px); letter-spacing: -.015em; color: #fff; }
    .sec-head h2 .n { font-size: .6em; color: var(--text-muted); font-weight: 700; margin-left: 6px; }
    .sec-head p { color: var(--text-muted); font-size: 14px; max-width: 560px; }
    .sec-head p a { color: var(--cyan); text-decoration: none; } .sec-head p a:hover { text-decoration: underline; }

    /* Lưới tất cả gợi ý */
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
    .card { position: relative; display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); background: rgba(22, 11, 54, .6); transition: transform .2s var(--ease), border-color .2s, box-shadow .2s; }
    .card:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--acc) 55%, transparent); box-shadow: 0 14px 32px rgba(0, 0, 0, .35); }
    .card.is-current { border-color: var(--acc); box-shadow: 0 0 0 1px var(--acc), 0 14px 32px rgba(0, 0, 0, .35); }
    .card[hidden] { display: none; }
    .c-media { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #0b0418; }
    .c-media img { width: 100%; height: 100%; object-fit: cover; object-position: center 35%; transition: transform .4s var(--ease); }
    .c-media::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(7, 3, 20, .78), rgba(7, 3, 20, 0) 55%); }
    .card:hover .c-media img { transform: scale(1.04); }
    .c-type { position: absolute; z-index: 1; left: 10px; top: 10px; display: inline-flex; align-items: center; gap: 6px; font-family: var(--fd); font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--acc); background: rgba(7, 3, 20, .72); border: 1px solid color-mix(in srgb, var(--acc) 35%, transparent); padding: 4px 9px 4px 8px; border-radius: 999px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .c-type::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--acc); box-shadow: 0 0 8px var(--acc); }
    .c-score, .c-pick { position: absolute; z-index: 1; right: 10px; bottom: 10px; font-family: var(--fd); font-weight: 800; border-radius: 8px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .c-score { display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; color: var(--amber); background: rgba(7, 3, 20, .82); padding: 3px 9px; border: 1px solid rgba(251, 191, 36, .4); }
    .c-score::before { content: '★'; font-size: 11px; }
    .c-pick { font-size: 10.5px; letter-spacing: .04em; color: #e9d5ff; background: rgba(7, 3, 20, .8); padding: 4px 9px; border: 1px solid rgba(167, 139, 250, .4); }
    .c-body { padding: 13px 14px 14px; display: flex; flex-direction: column; flex: 1; }
    .c-title { font-family: var(--fd); font-weight: 700; font-size: 15.5px; line-height: 1.3; }
    .c-open { all: unset; cursor: pointer; color: #fff; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .c-open::after { content: ''; position: absolute; inset: 0; z-index: 1; }
    .c-open:focus-visible { outline: none; }
    .card:has(.c-open:focus-visible) { outline: 2px solid var(--cyan); outline-offset: 2px; }
    .c-meta { color: var(--text-muted); font-size: 12.5px; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .c-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; padding-top: 10px; font-size: 12px; color: var(--text-muted); }
    .c-foot > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .c-link { position: relative; z-index: 2; color: var(--acc); text-decoration: none; font-weight: 700; white-space: nowrap; }
    .c-link:hover { text-decoration: underline; }
    .c-link-soft { position: static; color: var(--text-muted); font-weight: 600; transition: color .2s; }
    .card:hover .c-link-soft { color: var(--acc); }
    .more-wrap { text-align: center; margin-top: 22px; }
    .more-wrap[hidden] { display: none; }
    .empty { text-align: center; padding: 36px 20px; border: 1px dashed var(--line2); border-radius: 16px; color: var(--text-sub); }
    .empty[hidden] { display: none; }
    .empty button { margin-top: 12px; }

    /* Top theo điểm review */
    .top-tabs { display: none; gap: 8px; margin-bottom: 12px; }
    .top-tab { flex: 1; min-height: 44px; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel2); font-family: var(--fd); font-weight: 700; font-size: 14px; color: var(--text-sub); cursor: pointer; transition: border-color .2s, background .2s, color .2s; }
    .top-tab.on { color: #fff; border-color: var(--acc); background: color-mix(in srgb, var(--acc) 14%, transparent); box-shadow: inset 0 0 0 1px var(--acc); }
    .top-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .top-col { border: 1px solid var(--line); background: rgba(22, 11, 54, .55); border-radius: 18px; padding: 16px 16px 12px; display: flex; flex-direction: column; }
    .top-h { font-family: var(--fd); font-size: 15px; font-weight: 800; color: var(--acc); letter-spacing: .02em; padding: 0 4px 10px; border-bottom: 1px solid var(--line); }
    .top-list { list-style: none; }
    .top-list a { display: grid; grid-template-columns: 22px 52px minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 10px 4px; text-decoration: none; border-bottom: 1px solid rgba(255, 255, 255, .05); border-radius: 10px; transition: background .2s; }
    .top-list li:last-child a { border-bottom: none; }
    .top-list a:hover { background: rgba(255, 255, 255, .04); }
    .tl-n { font-family: var(--fd); font-weight: 800; font-size: 16px; color: var(--text-muted); text-align: center; }
    .top-list li:first-child .tl-n { color: var(--amber); }
    .top-list img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; background: #0b0418; }
    .tl-t { min-width: 0; }
    .tl-t b { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-family: var(--fd); font-size: 14px; color: #fff; line-height: 1.3; overflow: hidden; }
    .tl-t small { display: block; font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
    .tl-s { font-family: var(--fd); font-weight: 800; font-size: 16px; color: var(--amber); }
    .top-more { margin-top: auto; padding: 10px 4px 2px; font-size: 13px; font-weight: 700; color: var(--acc); text-decoration: none; }
    .top-more:hover { text-decoration: underline; }

    /* FAQ */
    .faq { max-width: 860px; }
    .faq details { border: 1px solid var(--line); background: rgba(22, 11, 54, .5); border-radius: 14px; margin-bottom: 10px; transition: border-color .2s; }
    .faq details[open] { border-color: var(--border-cyan); }
    .faq summary { cursor: pointer; list-style: none; padding: 16px 48px 16px 18px; font-family: var(--fd); font-weight: 700; font-size: 15px; color: #fff; position: relative; }
    .faq summary::-webkit-details-marker { display: none; }
    .faq summary::after { content: '+'; position: absolute; right: 18px; top: 50%; transform: translateY(-50%); font-size: 20px; color: var(--cyan); transition: transform .2s; }
    .faq details[open] summary::after { transform: translateY(-50%) rotate(45deg); }
    .faq details p { padding: 0 18px 16px; color: var(--text-sub); font-size: 14.5px; line-height: 1.7; }

    .toast { position: fixed; left: 50%; bottom: 24px; transform: translate(-50%, 20px); opacity: 0; pointer-events: none; z-index: 400; background: rgba(20, 10, 48, .96); border: 1px solid var(--border-cyan); color: #fff; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 999px; transition: opacity .25s, transform .25s; }
    .toast.show { opacity: 1; transform: translate(-50%, 0); }

    @media (max-width: 1100px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 1024px) {
      .top-tabs { display: flex; }
      .top-cols { grid-template-columns: 1fr; }
      .top-col { padding-bottom: 8px; }
      .top-cols.tabbed .top-col:not(.on) { display: none; }
      .top-cols.tabbed .top-h { display: none; }
      .top-cols.tabbed .top-col { padding-top: 6px; }
    }
    @media (max-width: 1024px) {
      .machine { grid-template-columns: 360px minmax(0, 1fr); gap: 16px; }
      .pick { grid-template-columns: 1fr; }
      .pick-media { min-height: 0; aspect-ratio: 16 / 10; }
      .pick-img { inset: 16px; width: calc(100% - 32px); height: calc(100% - 32px); }
      .pick-media::after { background: linear-gradient(to top, rgba(16, 8, 40, .9), transparent 32%); }
      .pick-body { padding: 22px 22px 24px; }
    }
    @media (max-width: 900px) {
      .machine { grid-template-columns: minmax(0, 1fr); gap: 18px; }
      .f-foot { margin-top: 18px; padding-top: 0; }
      .seg { grid-template-columns: repeat(4, 1fr); }
      .seg-btn { justify-content: center; }
      .seg-tx { flex: 0 1 auto; }
      .pick { grid-template-columns: minmax(0, 40%) 1fr; }
      .pick-media { min-height: 320px; aspect-ratio: auto; }
      .pick-img { inset: 20px; width: calc(100% - 40px); height: calc(100% - 40px); }
      .pick-media::after { background: linear-gradient(90deg, transparent 78%, rgba(14, 7, 34, .55)); }
    }
    @media (max-width: 640px) {
      .pick { grid-template-columns: 1fr; }
      .pick-media { min-height: 0; aspect-ratio: 4 / 3; }
      .pick.is-wide .pick-media { aspect-ratio: 16 / 9; }
      .pick-img { inset: 16px; width: calc(100% - 32px); height: calc(100% - 32px); }
      .pick-media::after { background: linear-gradient(to top, rgba(16, 8, 40, .9), transparent 32%); }
      .pick-body { padding: 20px 18px 22px; }
      .pick-title { margin-top: 6px; }
    }
    @media (max-width: 768px) {
      .cg { padding: 0 16px; }
      .machine { margin-top: 16px; }
      .finder { padding: 16px; border-radius: 18px; }
      .f-head { margin-bottom: 14px; padding-bottom: 12px; }
      .f-title { font-size: 19px; }
      .f-sub { font-size: 13px; }
      .f-row + .f-row { margin-top: 14px; }
      .f-label { font-size: 10.5px; margin-bottom: 8px; }
      .seg { grid-template-columns: repeat(2, 1fr); }
      .seg-btn { justify-content: flex-start; }
      .seg-tx { flex: 1; }
      .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -16px; padding: 0 16px 2px; scroll-padding: 0 16px; }
      .chips::-webkit-scrollbar { display: none; }
      .chips { -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent); mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent); }
      .f-foot { margin-top: 16px; }
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      .sec { margin-top: 48px; }
      footer { margin-top: 56px; }
    }
    @media (max-width: 480px) {
      .cta#cta-sub { padding: 6px 12px; font-size: 11px; }
      .seg { padding: 5px; gap: 5px; }
      .seg-btn { min-height: 44px; padding: 9px 8px; font-size: 13.5px; gap: 7px; }
      .seg-n { display: none; }
      .pick-facts { grid-template-columns: 1fr 1fr; gap: 8px; }
      .fact { padding: 9px 11px; display: flex; flex-direction: column-reverse; justify-content: flex-end; }
      .fact dt { margin-top: 3px; }
      .fact dd { font-size: 15px; margin-top: 0; }
      .fact-score dd { font-size: 22px; }
      .pick-actions .btn-main { flex: 1 1 100%; }
      .pick-actions .btn-ghost { flex: 1; }
      .c-body { padding: 10px 11px 12px; }
      .c-title { font-size: 14px; }
      .c-meta { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
      .c-foot > span:first-child { display: none; }
      .c-type { font-size: 10px; padding: 3px 8px 3px 7px; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } html { scroll-behavior: auto; } }
  </style>
</head>

<body>
  <div class="search-overlay" id="searchOverlay">
    <div class="search-box">
      <input class="search-input" id="searchInput" type="text" placeholder="${t.search}">
      <button class="search-close" onclick="closeSearch()" aria-label="${isEn ? 'Close' : 'Đóng'}">✕</button>
    </div>
    <div class="search-hint">${t.searchHint}</div>
  </div>

  ${nav}

  ${mobileNav}

  <main class="cg">
    <h1 class="sr-only">${t.h1.replace(/<\/?em>/g, '')}</h1>

    <div class="machine">
    <section class="finder" id="finder" aria-label="${esc(t.panelT)}">
      <div class="f-head">
        <h2 class="f-title">${t.panelT}</h2>
        <p class="f-sub">${t.panelP}</p>
      </div>
      <div class="f-row">
        <div class="f-label"><span class="f-step">1</span>${t.want}</div>
        <div class="seg" id="typeSeg">${['all', 'game', 'anime', 'manga'].map(segBtn).join('')}</div>
      </div>
      <div class="f-row" id="subRow" hidden>
        <div class="f-label"><span class="f-step f-step-sub" aria-hidden="true">+</span>${t.format}</div>
        <div class="chips" id="subChips"></div>
      </div>
      <div class="f-row">
        <div class="f-label"><span class="f-step">2</span>${t.mood}</div>
        <div class="chips" id="moodChips">${Object.keys(t.moods).map(moodBtn).join('')}</div>
      </div>
      <div class="f-row f-foot">
        <div class="f-label"><span class="f-step">3</span>${t.stepRoll}</div>
        <button type="button" class="roll" id="rollBtn"><span class="dice" aria-hidden="true">🎲</span><span>${t.roll}</span></button>
        <p class="f-count"><span id="fCount">${t.count(items.length)}</span><a href="#all">${t.seeAll} ↓</a></p>
      </div>
    </section>

    <div class="machine-out">
    <article class="pick" id="pick" aria-live="polite" style="--acc:${ACC[first.type]}">
      <div class="pick-media">
        <img class="pick-bg" id="pickBg" src="${thumb(first.img, '_t')}" alt="" aria-hidden="true" width="320" height="200">
        <img class="pick-img" id="pickImg" src="${thumb(first.img, '_t')}" alt="${esc(first.name)}" width="640" height="400" fetchpriority="high">
        <a class="pick-media-link" id="pickMediaLink" href="${first.link || first.profile || '#'}" aria-label="${esc(first.name)}"${first.link || first.profile ? '' : ' hidden'}></a>
        <span class="pick-type" id="pickType">${t.typeName[typeKey(first)]}</span>
      </div>
      <div class="pick-body">
        <div class="pick-top"><span class="pick-ic" aria-hidden="true">🎲</span><span class="pick-eyebrow" id="pickLabel">${t.today}</span></div>
        <h2 class="pick-title"><a class="pick-title-link" id="pickTitle"${first.link || first.profile ? ` href="${first.link || first.profile}"` : ''}>${esc(first.name)}</a></h2>
        <p class="pick-meta" id="pickMeta">${esc(first.creator)}</p>
        <div class="pick-tags" id="pickTags"><span>${esc(first.format)}</span><span>${esc(first.genre)}</span></div>
        <p class="pick-why" id="pickWhy">${esc(first.why)}</p>
        <dl class="pick-facts">
          <div class="fact fact-score${first.score === null ? ' is-none' : ''}" id="pickScoreBox"><dt id="pickScoreDt">${first.score === null ? t.noScoreDt : t.scoreDt}</dt><dd id="pickScore">${first.score === null ? t.noScore : `${first.score.toFixed(1)}<small>/10</small>`}</dd></div>
          <div class="fact"><dt>${t.timeDt}</dt><dd id="pickTime">${esc(first.time)}</dd></div>
        </dl>
        <div class="pick-moods" id="pickMoods">${first.moods.map((m) => `<span>${t.moods[m][0]} ${t.moods[m][1]}</span>`).join('')}</div>
        <div class="pick-actions">
          <a class="btn btn-main" id="pickLink" href="${first.link || '#'}"${first.link ? '' : ' hidden'}>${first.reviewed ? t.readReview : t.readArticle} →</a>
          <span class="no-article" id="noArticle"${first.link ? ' hidden' : ''}>${t.noArticle}</span>
          <a class="btn btn-ghost" id="pickProfile" href="${first.profile || '#'}"${first.profile ? '' : ' hidden'}>${t.profileBtn}</a>
          <button type="button" class="btn btn-ghost" id="againBtn">🎲 ${t.rollAgain}</button>
          <button type="button" class="btn btn-icon" id="shareBtn" aria-label="${t.share}" title="${t.share}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"></path></svg></button>
        </div>
      </div>
    </article>
    <div class="recent" id="recent" hidden><span class="recent-l">${t.recent}:</span><div class="recent-list" id="recentList"></div></div>
    </div>
    </div>

    <section class="sec" id="all" aria-labelledby="allH">
      <div class="sec-head"><h2 id="allH">${t.allH} <span class="n" id="allCount">${items.length}</span></h2><p>${t.allP}</p></div>
      <div class="grid" id="grid">
      ${items.filter((x) => !x.extra).map(card).join('\n      ')}
      </div>
      <div class="more-wrap" id="moreWrap"><button type="button" class="btn btn-ghost" id="moreBtn" style="--acc:var(--cyan)"></button></div>
      <div class="empty" id="empty" hidden><p>${t.empty}</p><button type="button" class="btn btn-ghost" id="clearMood" style="--acc:var(--cyan)">${t.clearMood}</button></div>
    </section>

    <section class="sec" aria-labelledby="topH">
      <div class="sec-head"><h2 id="topH">${t.topH}</h2><p>${t.topP}</p></div>
      <div class="top-tabs" id="topTabs" role="tablist" aria-label="${esc(t.topH)}">${['game', 'anime', 'manga'].map((k) => `<button type="button" role="tab" class="top-tab${k === 'game' ? ' on' : ''}" data-tab="${k}" aria-selected="${k === 'game'}" style="--acc:${ACC[k]}">${t.topCols[k]}</button>`).join('')}</div>
      <div class="top-cols" id="topCols">
      ${['game', 'anime', 'manga'].map(topCol).join('\n      ')}
      </div>
    </section>

    <section class="sec faq" aria-labelledby="faqH">
      <div class="sec-head"><h2 id="faqH">${t.faqH}</h2></div>
      ${t.faq.map(([q, a], i) => `<details${i ? '' : ' open'}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n      ')}
    </section>
  </main>

  <div class="toast" id="toast" role="status"></div>

  ${footer}

  <script>
    const ITEMS = [
      ${data}
    ];
    const L = ${JSON.stringify(I18N)};
    const ACC = { game: 'var(--cyan)', anime: 'var(--sakura)', manga: 'var(--lav)' };
    const byId = Object.fromEntries(ITEMS.map((x) => [x.id, x]));
    const state = { type: 'all', sub: 'all', mood: 'all', cur: null, limit: 12 };
    const PAGE = 12;
    const decks = {};
    const recent = [];
    const $ = (id) => document.getElementById(id);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const typeKey = (it) => (it.type === 'manga' && it.sub === 'manhwa' ? 'manhwa' : it.type);
    const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    const matches = (it, s = state) => (s.type === 'all' || it.type === s.type) && (s.sub === 'all' || it.sub === s.sub) && (s.mood === 'all' || it.moods.includes(s.mood));
    const pool = () => ITEMS.filter((it) => matches(it));
    function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    // Bộ bài theo bộ lọc: không lặp lại cho tới khi đã gợi ý hết các tựa phù hợp
    function nextItem() {
      const key = state.type + '|' + state.sub + '|' + state.mood;
      const ids = pool().map((x) => x.id);
      if (!ids.length) return null;
      let deck = (decks[key] || []).filter((id) => ids.includes(id));
      if (!deck.length) {
        deck = shuffle(ids.slice());
        if (state.cur && deck.length > 1 && deck[deck.length - 1] === state.cur.id) deck.unshift(deck.pop());
      }
      const id = deck.pop();
      decks[key] = deck;
      return byId[id];
    }

    // Ảnh ngang: phủ kín cột; ảnh dọc: poster nổi trên nền mờ
    const pickImg = $('pickImg');
    const fitPick = () => { if (pickImg.naturalWidth) $('pick').classList.toggle('is-wide', pickImg.naturalWidth > pickImg.naturalHeight * 1.15); };
    pickImg.addEventListener('load', fitPick);
    if (pickImg.complete) fitPick();

    function render(it, label) {
      state.cur = it; state.daily = label === L.today;
      const pick = $('pick');
      pick.style.setProperty('--acc', ACC[it.type]);
      $('pickImg').src = it.t; $('pickImg').alt = it.name; $('pickBg').src = it.t;
      $('pickType').textContent = L.typeName[typeKey(it)];
      $('pickLabel').textContent = label;
      $('pickTitle').textContent = it.name;
      const go = it.link || it.pf;
      if (go) $('pickTitle').href = go; else $('pickTitle').removeAttribute('href');
      $('pickMediaLink').hidden = !go; if (go) $('pickMediaLink').href = go;
      $('pickMeta').textContent = it.creator;
      $('pickTags').innerHTML = '<span>' + escH(it.format) + '</span><span>' + escH(it.genre) + '</span>';
      $('pickWhy').textContent = it.why;
      const box = $('pickScoreBox');
      box.classList.toggle('is-none', it.score === null);
      $('pickScoreDt').textContent = it.score === null ? L.noScoreDt : L.scoreDt;
      $('pickScore').innerHTML = it.score === null ? escH(L.noScore) : it.score.toFixed(1) + '<small>/10</small>';
      $('pickTime').textContent = it.time;
      $('pickMoods').innerHTML = it.moods.map((m) => '<span>' + L.moods[m][0] + ' ' + escH(L.moods[m][1]) + '</span>').join('');
      const a = $('pickLink');
      a.hidden = !it.link; $('noArticle').hidden = !!it.link;
      if (it.link) { a.href = it.link; a.textContent = (it.rv ? L.readReview : L.readArticle) + ' →'; }
      const pf = $('pickProfile');
      pf.hidden = !it.pf; if (it.pf) pf.href = it.pf;
      document.querySelectorAll('.card.is-current').forEach((c) => c.classList.remove('is-current'));
      const card = document.querySelector('.card[data-id="' + it.id + '"]');
      if (card) card.classList.add('is-current');
      const i = recent.indexOf(it.id);
      if (i >= 0) recent.splice(i, 1);
      recent.unshift(it.id);
      recent.length = Math.min(recent.length, 7);
      renderRecent();
    }

    function renderRecent() {
      const list = recent.slice(1);
      $('recent').hidden = !list.length;
      $('recentList').innerHTML = list.map((id) => { const it = byId[id]; return '<button type="button" data-open="' + id + '"><img src="' + it.s + '" alt="" width="26" height="26"><span>' + escH(it.name) + '</span></button>'; }).join('');
    }

    function inView(el) { const r = el.getBoundingClientRect(); return r.top >= 56 && r.top < window.innerHeight * 0.5; }
    function showPick(it, label, scroll) {
      const pick = $('pick');
      const go = () => {
        render(it, label);
        pick.classList.remove('is-rolling');
        if (scroll && !inView(pick)) pick.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        syncUrl();
      };
      if (reduce) return go();
      pick.classList.add('is-rolling');
      setTimeout(go, 220);
    }

    function roll(btn) {
      const it = nextItem();
      if (!it) return;
      if (btn) { btn.classList.remove('rolling'); void btn.offsetWidth; btn.classList.add('rolling'); }
      showPick(it, L.forYou, true);
    }

    function renderSubs() {
      const row = $('subRow');
      if (state.type === 'all') { row.hidden = true; return; }
      row.hidden = false;
      const opts = L.subs[state.type];
      $('subChips').innerHTML = Object.keys(opts).map((k) => '<button type="button" class="chip' + (k === state.sub ? ' on' : '') + '" data-sub="' + k + '" aria-pressed="' + (k === state.sub) + '">' + escH(opts[k]) + '</button>').join('');
    }

    function applyFilters() {
      $('finder').style.setProperty('--facc', state.type === 'all' ? 'var(--amber)' : ACC[state.type]);
      document.querySelectorAll('.seg-btn').forEach((b) => { const on = b.dataset.type === state.type; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      document.querySelectorAll('#moodChips .chip').forEach((b) => {
        const on = b.dataset.mood === state.mood;
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.disabled = !on && !ITEMS.some((it) => matches(it, { type: state.type, sub: state.sub, mood: b.dataset.mood }));
      });
      let n = 0;
      document.querySelectorAll('#grid .card').forEach((c) => { const ok = matches(byId[c.dataset.id]); if (ok) n++; c.hidden = !ok || n > state.limit; });
      $('moreWrap').hidden = n <= state.limit;
      $('moreBtn').textContent = L.more.replace('{n}', n - state.limit);
      $('allCount').textContent = n;
      $('fCount').innerHTML = L.count.replace('0', n);
      $('empty').hidden = n > 0;
      $('rollBtn').disabled = n === 0; $('againBtn').disabled = n === 0;
      syncUrl();
    }

    function setFilter(part, value) {
      state[part] = value;
      state.limit = PAGE;
      if (part === 'type') { state.sub = 'all'; renderSubs(); if (value !== 'all') setTopTab(value); }
      applyFilters();
      // gợi ý đang hiện không còn hợp bộ lọc -> đổi ngay sang một tựa phù hợp
      if (state.cur && !matches(state.cur)) { const it = nextItem(); if (it) showPick(it, L.forYou, false); }
    }

    function syncUrl() {
      const p = new URLSearchParams();
      if (state.type !== 'all') p.set('type', state.type);
      if (state.sub !== 'all') p.set('sub', state.sub);
      if (state.mood !== 'all') p.set('mood', state.mood);
      if (state.cur && !state.daily) p.set('pick', state.cur.id);
      const q = p.toString();
      history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    }

    function setTopTab(k) {
      document.querySelectorAll('.top-tab').forEach((b) => { const on = b.dataset.tab === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      document.querySelectorAll('.top-col').forEach((c) => c.classList.toggle('on', c.dataset.col === k));
    }
    $('topCols').classList.add('tabbed');
    setTopTab('game');
    $('topTabs').addEventListener('click', (e) => { const b = e.target.closest('.top-tab'); if (b) setTopTab(b.dataset.tab); });

    let toastT;
    function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200); }
    async function share() {
      const it = state.cur;
      const url = location.origin + location.pathname + '?pick=' + encodeURIComponent(it.id);
      if (navigator.share) { try { await navigator.share({ title: it.name, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      try { await navigator.clipboard.writeText(url); toast(L.copied); } catch (e) { prompt('', url); }
    }

    $('typeSeg').addEventListener('click', (e) => { const b = e.target.closest('.seg-btn'); if (b) setFilter('type', b.dataset.type); });
    $('subChips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) { setFilter('sub', b.dataset.sub); renderSubs(); } });
    $('moodChips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b && !b.disabled) setFilter('mood', b.dataset.mood); });
    $('rollBtn').addEventListener('click', (e) => roll(e.currentTarget));
    $('againBtn').addEventListener('click', () => roll($('rollBtn')));
    $('shareBtn').addEventListener('click', share);
    $('clearMood').addEventListener('click', () => setFilter('mood', 'all'));
    $('moreBtn').addEventListener('click', () => { state.limit = Infinity; applyFilters(); });
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) showPick(byId[b.dataset.open], L.chosen, true); });

    // Trạng thái ban đầu: theo link (?type=&sub=&mood=&pick=) hoặc gợi ý hôm nay (đổi mỗi ngày, ưu tiên tựa có review)
    // Thẻ cho tựa bổ sung từ kho hồ sơ (x:1) dựng khi tải trang để HTML tĩnh gọn
    (function buildExtraCards() {
      const html = ITEMS.filter((it) => it.x).map((it) => '<article class="card" data-id="' + it.id + '" data-type="' + it.type + '" data-sub="' + it.sub + '" data-moods="' + it.moods.join(' ') + '" style="--acc:' + ACC[it.type] + '">'
        + '<div class="c-media"><img src="' + it.t + '" alt="" loading="lazy" decoding="async" width="320" height="200"><span class="c-type">' + escH(L.typeName[typeKey(it)]) + '</span>'
        + (it.score !== null ? '<span class="c-score" title="' + escH(L.scoreDt) + '">' + it.score.toFixed(1) + '</span>' : '<span class="c-pick">' + escH(L.pick) + '</span>') + '</div>'
        + '<div class="c-body"><h3 class="c-title"><button type="button" class="c-open" data-open="' + it.id + '">' + escH(it.name) + '</button></h3>'
        + '<p class="c-meta">' + escH(it.genre) + (it.pf ? ' · <a class="c-link c-prof" href="' + it.pf + '">' + escH(L.profile) + '</a>' : '') + '</p>'
        + '<p class="c-foot"><span>' + escH(it.format) + '</span>' + (it.link ? '<a class="c-link" href="' + it.link + '">' + escH(it.rv ? L.readReview : L.readArticle) + ' →</a>' : '<span class="c-link c-link-soft">' + escH(L.quick) + '</span>') + '</p></div></article>').join('');
      $('grid').insertAdjacentHTML('beforeend', html);
    })();

    (function init() {
      const p = new URLSearchParams(location.search);
      if (['game', 'anime', 'manga'].includes(p.get('type'))) state.type = p.get('type');
      if (state.type !== 'all' && L.subs[state.type][p.get('sub')]) state.sub = p.get('sub');
      if (L.moods[p.get('mood')]) state.mood = p.get('mood');
      renderSubs();
      applyFilters();
      if (state.type !== 'all') setTopTab(state.type);
      const shared = byId[p.get('pick')];
      if (shared) { render(shared, L.forYou); syncUrl(); return; }
      const list = pool().filter((x) => x.rv);
      const from = list.length ? list : pool();
      if (!from.length) return;
      const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
      render(from[day % from.length], L.today);
    })();

    // Tìm kiếm + menu trượt
    function openSearch() { const el = $('searchOverlay'); el.classList.add('open'); setTimeout(() => $('searchInput').focus(), 50); document.body.style.overflow = 'hidden'; }
    function closeSearch() { $('searchOverlay').classList.remove('open'); document.body.style.overflow = ''; }
    function toggleMobileNav() {
      const nav = $('mobileNav'), ham = $('hamBtn');
      if (!nav || !ham) return;
      const open = nav.classList.toggle('open');
      ham.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    document.querySelectorAll('.mobile-nav a').forEach((a) => a.addEventListener('click', () => { if ($('mobileNav').classList.contains('open')) toggleMobileNav(); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
  </script>
  <script defer src="/assets/search-redirect.js?v=${SCRIPT_V(old, 'search-redirect.js', '20261002a')}"></script>
  <script defer src="/assets/enhance.js?v=${SCRIPT_V(old, 'enhance.js', '20261003a')}"></script>
  <script src="/assets/lang-switch.js" defer></script>
</body>
</html>
`;
}

// Giữ phiên bản ?v= hiện có trên trang (các script đổi phiên bản hàng loạt sẽ cập nhật tiếp)
function SCRIPT_V(old, name, fallback) {
  const m = old && old.match(new RegExp('/assets/' + name.replace('.', '\\.') + '\\?v=([\\w.-]+)'));
  return m ? m[1] : fallback;
}
function MOBILE_FIX_V(old) { return SCRIPT_V(old, 'mobile-fix.css', '20261003a'); }

// ═════════════════════════════════════════════════════════════════════
// 4. GHI FILE
// ═════════════════════════════════════════════════════════════════════
const CHECK = process.argv.includes('--check');
let stale = 0;
for (const [lang, file] of [['vi', 'choi-gi.html'], ['en', 'en/choi-gi.html']]) {
  const p = path.join(root, file);
  const old = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const html = buildHtml(lang, old);
  if (html === old) continue;
  stale++;
  if (CHECK) console.log('cần tạo lại:', file);
  else { fs.writeFileSync(p, html, 'utf8'); console.log(`✅ ${file} (${html.length} bytes)`); }
}
for (const w of [...new Set(warnings)]) console.warn('⚠️ ', w);
if (!stale) console.log('choi-gi: đã khớp dữ liệu review + xếp hạng');
if (CHECK && stale) process.exitCode = 1;
