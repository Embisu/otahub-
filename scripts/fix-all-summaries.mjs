import fs from 'fs';
import path from 'path';

// Clean 1195 references first
console.log('Cleaning fake 1195 references...');

function replaceInFile(filePath, searchVal, replaceVal) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchVal)) {
      content = content.replaceAll(searchVal, replaceVal);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated references in ${filePath}`);
    }
  }
}

// Remove 1195 from index, manga, news, feeds
replaceInFile('index.html', '/one-piece-chapter-1195-ngay-ra-mat-du-doan', '/one-piece-egghead-arc-review');
replaceInFile('index.html', 'One Piece Chapter 1195: Ngày Ra Mắt Và Dự Đoán', 'One Piece: Egghead Arc Review: Vegapunk Kể Lịch Sử');
replaceInFile('en/index.html', '/en/one-piece-chapter-1195-release-date-predictions', '/en/one-piece-egghead-arc-review');
replaceInFile('en/index.html', 'One Piece Chapter 1195 Release Date And Predictions', "One Piece: Egghead Arc Review: Vegapunk's Revelations");

replaceInFile('manga.html', '/one-piece-chapter-1195-ngay-ra-mat-du-doan', '/one-piece-egghead-arc-review');
replaceInFile('manga.html', 'One Piece Chapter 1195: Ngày Ra Mắt Và Dự Đoán', 'One Piece: Egghead Arc Review: Vegapunk Kể Lịch Sử');
replaceInFile('en/manga.html', '/en/one-piece-chapter-1195-release-date-predictions', '/en/one-piece-egghead-arc-review');
replaceInFile('en/manga.html', 'One Piece Chapter 1195 Release Date And Predictions', "One Piece: Egghead Arc Review: Vegapunk's Revelations");

replaceInFile('news.html', '/one-piece-chapter-1195-ngay-ra-mat-du-doan', '/one-piece-egghead-arc-review');
replaceInFile('en/news.html', '/en/one-piece-chapter-1195-release-date-predictions', '/en/one-piece-egghead-arc-review');

// Clean search.js
if (fs.existsSync('assets/search.js')) {
  let searchContent = fs.readFileSync('assets/search.js', 'utf8');
  // Remove 1195 object
  searchContent = searchContent.replace(/\{\s*"title":\s*"One Piece Chapter 1195[^}]+\},?\n?/g, '');
  fs.writeFileSync('assets/search.js', searchContent, 'utf8');
  console.log('Cleaned 1195 from search.js');
}

// Clean sitemaps & feeds
if (fs.existsSync('feed.json')) {
  let feedJson = fs.readFileSync('feed.json', 'utf8');
  feedJson = feedJson.replace(/\{\s*"id":\s*"https:\/\/otahub\.asia\/one-piece-chapter-1195[^}]+},?\n?/g, '');
  fs.writeFileSync('feed.json', feedJson, 'utf8');
}
if (fs.existsSync('sitemap.xml')) {
  let sm = fs.readFileSync('sitemap.xml', 'utf8');
  sm = sm.replace(/<url>\s*<loc>https:\/\/otahub\.asia\/(en\/)?one-piece-chapter-1195[^<]+<\/loc>[^<]*<\/url>\s*/g, '');
  fs.writeFileSync('sitemap.xml', sm, 'utf8');
}
if (fs.existsSync('sitemap-news.xml')) {
  let smn = fs.readFileSync('sitemap-news.xml', 'utf8');
  smn = smn.replace(/<url>\s*<loc>https:\/\/otahub\.asia\/one-piece-chapter-1195[^<]+<\/loc>[\s\S]*?<\/url>\s*/g, '');
  fs.writeFileSync('sitemap-news.xml', smn, 'utf8');
}
if (fs.existsSync('src/pages/one-piece-chapter-1195-ngay-ra-mat-du-doan.json')) {
  fs.unlinkSync('src/pages/one-piece-chapter-1195-ngay-ra-mat-du-doan.json');
}

console.log('Finished 1195 cleaning. Now updating robotic and clunky summaries...');

// Dictionary of polished, natural, crystal-clear summaries for all identified articles
const summaryUpdates = {
  // VI REVIEWS
  'black-clover-final-volume-review.html': {
    summary: '<strong>Black Clover</strong> của tác giả Yuki Tabata đã chính thức khép lại hành trình 11 năm đầy thăng trầm trên Jump GIGA. Bài đánh giá chuyên sâu về tập 37 và đại kết cục: cách Asta và Yuno hiện thực hóa ước mơ trở thành Ma Pháp Vương, cuộc đại chiến định đoạt số phận Ma Pháp Giới, cùng những điểm sáng và tiếc nuối lớn nhất trong cái kết của series.',
    excerpt: 'Đánh giá chi tiết tập cuối Black Clover: Hồi kết trọn vẹn sau 11 năm đồng hành cùng Asta và Yuno, những điểm sáng rực rỡ và tiếc nuối lớn nhất trong đại kết cục.'
  },
  'chainsaw-man-anime-review.html': {
    summary: '<strong>Chainsaw Man Anime</strong> do studio MAPPA chuyển thể là một trong những dự án hoạt hình tham vọng bậc nhất với cách tiếp cận điện ảnh hóa hoàn toàn khác biệt. Đánh giá chi tiết về phong cách hình ảnh chân thực, 12 ca khúc ending độc bản cho từng tập phim, cùng màn trình diễn xuất sắc của Denji, Makima và Power.',
    excerpt: 'Đánh giá anime Chainsaw Man của MAPPA: Bước đột phá mang đậm ngôn ngữ điện ảnh, bạo lực nghệ thuật và âm nhạc đỉnh cao gây sốt toàn cầu.'
  },
  'chainsaw-man-manga-part2-review.html': {
    summary: '<strong>Chainsaw Man Part 2 (Academy Saga)</strong> đánh dấu bước chuyển mình bất ngờ của Tatsuki Fujimoto khi chuyển trọng tâm từ Denji sang nữ sinh lập dị Asa Mitaka và Quỷ Chiến Tranh Yoru. Đánh giá chi tiết về chiều sâu tâm lý học đường, nhịp độ kỳ dị đặc trưng và cách bộ truyện tái định nghĩa thể loại shonen đen tối.',
    excerpt: 'Đánh giá chuyên sâu Chainsaw Man Part 2: Cuộc phiêu lưu tâm lý độc dị của Asa Mitaka và Quỷ Chiến Tranh Yoru trong kỷ nguyên mới của Tatsuki Fujimoto.'
  },
  'dandadan-manga-review.html': {
    summary: '<strong>Dandadan</strong> của Yukinobu Tatsu là một hiện tượng bùng nổ trên Shonen Jump+ nhờ sự kết hợp tài tình giữa yếu tố ma quỷ tâm linh, người ngoài hành tinh khoa học viễn tưởng và chuyện tình tuổi mới lớn dở khóc dở cười giữa Momo và Okarun. Đánh giá nét vẽ siêu chi tiết và nhịp độ hành động cuốn hút của manga.',
    excerpt: 'Đánh giá manga Dandadan: Tuyệt phẩm hành động kỳ ảo hòa quyện giữa ma cà rồng, người ngoài hành tinh và chuyện tình gà bông tuổi teen cực kỳ lôi cuốn.'
  },
  'dandadan-season-2-review.html': {
    summary: '<strong>Dan Da Dan Season 2</strong> tiếp tục chứng minh tài năng bậc thầy của Science SARU và đạo diễn Fuga Yamashiro trong việc biến từng khung tranh siêu thực thành bữa tiệc thị giác bùng nổ. Đánh giá chi tiết về phong cách đồ họa psychedelic đầy mê hoặc, nhịp phim mãn nhãn và sự phát triển tình cảm của cặp đôi chính.',
    excerpt: 'Đánh giá anime Dan Da Dan Season 2: Bữa tiệc thị giác psychedelic bùng nổ từ Science SARU, tiếp nối thành công rực rỡ của hiện tượng anime thế hệ mới.'
  },
  'jujutsu-kaisen-anime-review.html': {
    summary: '<strong>Jujutsu Kaisen Anime</strong> dưới bàn tay phù phép của studio MAPPA đã đưa câu chuyện chú thuật sư của Gege Akutami trở thành thương hiệu văn hóa đại chúng toàn cầu. Đánh giá toàn diện từ Mùa 1, Movie 0 đến thảm họa Biến cố Shibuya và Culling Game: chất lượng hoạt họa sakuga đỉnh cao và chiều sâu triết lý thiện - ác.',
    excerpt: 'Đánh giá toàn diện anime Jujutsu Kaisen của MAPPA: Từ khởi đầu ấn tượng đến đỉnh cao Biến cố Shibuya và bước ngoặt Culling Game làm rung chuyển toàn cầu.'
  },
  'kaiju-no-8-manga-review.html': {
    summary: '<strong>Kaiju No. 8</strong> của Naoya Matsumoto từng tạo nên cơn sốt kỷ lục trên Shonen Jump+ khi khai thác góc nhìn của Kafka Hibino — một người đàn ông trung niên dọn dẹp xác quái vật khao khát thực hiện ước mơ thuở nhỏ. Đánh giá chuyên sâu về ý tưởng đột phá, nhịp truyện mở màn xuất sắc và những thách thức về nhịp độ ở giai đoạn sau.',
    excerpt: 'Đánh giá manga Kaiju No. 8: Cơn sốt quái vật khổng lồ của Shonen Jump+, hành trình vượt lên nghịch cảnh của Kafka Hibino và bài toán duy trì sức hút.'
  },
  'one-piece-final-saga-review.html': {
    summary: '<strong>One Piece Final Saga</strong> chính thức bước vào chặng đua sinh tử cuối cùng kể từ chương 1054, đưa người đọc qua những biến động lịch sử tại Egghead, bí mật sự kiện God Valley và thánh địa các chiến binh Elbaf. Đánh giá chi tiết cách Eiichiro Oda làm chủ bức tranh địa chính trị thế giới và quy mô vĩ đại của hồi kết.',
    excerpt: 'Đánh giá One Piece Final Saga: Chặng đua cuối vĩ đại của Eiichiro Oda khi các bí mật God Valley, Thế Kỷ Trống và vương quốc Elbaf đồng loạt phát nổ.'
  },
  'oshi-no-ko-anime-review.html': {
    summary: '<strong>Oshi no Ko Anime</strong> do Doga Kobo thực hiện đã bóc trần những góc khuất tăm tối, áp lực tàn khốc và sự giả dối đằng sau ánh đèn sân khấu của ngành công nghiệp thần tượng Nhật Bản. Đánh giá tập mở màn 90 phút chấn động, siêu hit "Idol" của YOASOBI và hành trình báo thù ly kỳ của Aqua Hoshino.',
    excerpt: 'Đánh giá anime Oshi no Ko: Bản cáo trạng sắc sảo và đầy ám ảnh về mặt tối giới showbiz, ánh hào quang thần tượng và bi kịch gia đình Hoshino.'
  },
  'solo-leveling-ragnarok-manhwa-review.html': {
    summary: '<strong>Solo Leveling: Ragnarok</strong> là hậu truyện chính thức của tượng đài Solo Leveling, dõi theo bước chân của Sung Suho — con trai Thợ Săn Sung Jin-woo — trong hành trình kế thừa và khai phá sức mạnh bóng tối trước những mối hiểm họa vũ trụ mới. Đánh giá chất lượng hình ảnh của REDICE Studio và tiềm năng mở rộng vũ trụ thợ săn.',
    excerpt: 'Đánh giá manhwa Solo Leveling: Ragnarok: Cuộc phiêu lưu kế thừa ngai vàng bóng tối của Sung Suho và hành trình bảo vệ Trái Đất trước các thế lực vũ trụ.'
  },
  'spy-x-family-anime-review.html': {
    summary: '<strong>Spy x Family</strong> là sự kết hợp hoàn hảo giữa những pha hành động điệp viên căng thẳng và những khoảnh khắc gia đình ấm áp, hài hước giữa ba con người xa lạ: điệp viên Twilight, sát thủ Yor và cô bé có khả năng đọc suy nghĩ Anya. Đánh giá sự phối hợp sản xuất giữa Wit Studio và CloverWorks mang lại tác phẩm chữa lành quốc dân.',
    excerpt: 'Đánh giá anime Spy x Family: Tuyệt tác hoạt hình gia đình chữa lành và hài hước, sự kết hợp duyên dáng giữa thế giới điệp viên và tình cảm gia đình giả tưởng.'
  },
  'vinland-saga-manga-review.html': {
    summary: '<strong>Vinland Saga</strong> của Makoto Yukimura là thiên anh hùng ca lịch sử vĩ đại kéo dài tròn hai thập kỷ (2005–2025), khắc họa sự chuyển hóa phi thường của Thorfinn từ một sát thủ báo thù đẫm máu thành một người đàn ông đi tìm miền đất hòa bình không có chiến tranh và nô lệ. Đánh giá đại kết cục 29 tập truyện xứng đáng được tôn vinh là kiệt tác.',
    excerpt: 'Đánh giá toàn diện manga Vinland Saga: Hành trình chuộc tội 20 năm của Thorfinn Karlsefni và đại kết cục vĩ đại về ước vọng hòa bình trong thời đại bạo lực.'
  },

  // EN REVIEWS
  'en/black-clover-final-volume-review.html': {
    summary: '<strong>Black Clover</strong> by Yuki Tabata reaches its emotional conclusion after an 11-year run on Jump GIGA. An in-depth review of Volume 37 and the grand finale: Asta and Yuno fulfilling their shared dream to become the Wizard King, the final war against Lucius Zogratis, and the series\' enduring strengths and missed opportunities.',
    excerpt: 'In-depth review of Black Clover\'s final volume: An emotional conclusion to Asta and Yuno\'s 11-year journey, celebrating its biggest triumphs and farewell moments.'
  },
  'en/chainsaw-man-manga-part2-review.html': {
    summary: '<strong>Chainsaw Man Part 2 (Academy Saga)</strong> marks Tatsuki Fujimoto\'s bold shift in narrative focus from Denji to socially awkward high schooler Asa Mitaka and the War Devil Yoru. An in-depth review of its psychological adolescent themes, surrealist pacing, and how it continues to reinvent dark modern shonen.',
    excerpt: 'In-depth review of Chainsaw Man Part 2: Tatsuki Fujimoto\'s psychological, surrealist evolution through the eyes of Asa Mitaka and the War Devil Yoru.'
  },
  'en/dandadan-manga-review.html': {
    summary: '<strong>Dandadan</strong> by Yukinobu Tatsu has become a global smash hit on Shonen Jump+, seamlessly blending supernatural spirits, extraterrestrial sci-fi, slapstick humor, and sweet teenage romance between Momo and Okarun. An in-depth review of its jaw-dropping hyper-detailed art and exhilarating comedic pacing.',
    excerpt: 'In-depth review of the Dandadan manga: A breathtaking blend of alien sci-fi, ghost lore, and heartfelt adolescent romance powered by extraordinary artwork.'
  },
  'en/dandadan-season-2-review.html': {
    summary: '<strong>Dan Da Dan Season 2</strong> cements Science SARU and director Fuga Yamashiro as animation visionaries, transforming surrealist manga panels into a breathtaking kinetic visual spectacle. An in-depth review of its psychedelic art direction, fluid action sequences, and the burgeoning emotional bonds of its cast.',
    excerpt: 'Dan Da Dan Season 2 review: A stunning, psychedelic visual showcase by Science SARU that elevates the hit anime franchise to new technical heights.'
  },
  'en/jujutsu-kaisen-anime-review.html': {
    summary: '<strong>Jujutsu Kaisen Anime</strong> by studio MAPPA has propelled Gege Akutami\'s dark fantasy epic into a worldwide pop-culture phenomenon. A comprehensive review tracing its evolution from Season 1 and Movie 0 to the devastating Shibuya Incident and the high-stakes Culling Game arc.',
    excerpt: 'Comprehensive review of MAPPA\'s Jujutsu Kaisen anime: From explosive early beginnings to the harrowing Shibuya Incident and world-shattering Culling Game.'
  },
  'en/kaiju-no-8-manga-review.html': {
    summary: '<strong>Kaiju No. 8</strong> by Naoya Matsumoto broke Shonen Jump+ records by spotlighting Kafka Hibino—a 32-year-old monster disposal worker pursuing his abandoned childhood dream. An in-depth review examining its refreshing adult perspective, explosive monster fights, and pacing dynamics.',
    excerpt: 'In-depth review of the Kaiju No. 8 manga: Naoya Matsumoto\'s monster-hunting blockbuster, Kafka\'s endearing grit, and its shonen impact.'
  },
  'en/one-piece-final-saga-review.html': {
    summary: '<strong>One Piece Final Saga</strong> has entered its decisive endgame, catapulting readers from Egghead Island into the God Valley revelations and the long-anticipated giants\' kingdom of Elbaf. An in-depth review of Eiichiro Oda\'s sweeping geopolitical mastery and the monumental momentum toward the series finale.',
    excerpt: 'In-depth review of One Piece Final Saga: Eiichiro Oda\'s grand endgame unravelling decades of secrets as the Straw Hats arrive at the shores of Elbaf.'
  },
  'en/oshi-no-ko-anime-review.html': {
    summary: '<strong>Oshi no Ko Anime</strong> by Doga Kobo fearlessly exposes the ruthless pressures, emotional exploitation, and dark secrets of the Japanese entertainment industry. An in-depth review of its cinematic 90-minute premiere, YOASOBI\'s smash hit "Idol," and Aqua Hoshino\'s gripping revenge thriller.',
    excerpt: 'Oshi no Ko anime review: A hauntingly sharp critique of the idol industry wrapped in a compelling revenge thriller and stellar production.'
  },
  'en/solo-leveling-ragnarok-manhwa-review.html': {
    summary: '<strong>Solo Leveling: Ragnarok</strong> serves as the official continuation of the legendary manhwa series, following Sung Suho—son of Shadow Monarch Sung Jin-woo—as he awakens his dormant heritage against cosmic invaders. An in-depth review of REDICE Studio\'s dynamic artwork and its universe expansion.',
    excerpt: 'In-depth review of Solo Leveling: Ragnarok: Sung Suho rises to inherit his father\'s shadow mantle and protect humanity against galactic threats.'
  },
  'en/spy-x-family-anime-review.html': {
    summary: '<strong>Spy x Family</strong> delivers an exquisite balance between cold-war espionage action and heartwarming domestic comedy among three undercover strangers: master spy Twilight, lethal assassin Yor, and telepathic toddler Anya. An in-depth review of Wit Studio and CloverWorks\' hit anime adaptation.',
    excerpt: 'Spy x Family anime review: A heartwarming, hilarious espionage masterpiece powered by the endearing dynamics of the counterfeit Forger family.'
  },
  'en/vinland-saga-manga-review.html': {
    summary: '<strong>Vinland Saga</strong> by Makoto Yukimura stands as a generational historical epic spanning two decades (2005–2025), chronicling Thorfinn Karlsefni\'s profound transformation from a vengeance-obsessed teenage warrior into an apostle of peace. An in-depth review of the 29-volume masterpiece.',
    excerpt: 'Comprehensive review of the Vinland Saga manga: Makoto Yukimura\'s 20-year magnum opus celebrating Thorfinn\'s hard-fought journey toward true peace.'
  },

  // VI NEWS ARTICLES WITH CLUNKY SEMICOLONS
  'attack-on-titan-wit-teaser.html': {
    summary: 'WIT Studio và Aniplex bất ngờ công bố đoạn teaser bí ẩn liên quan đến <strong>Attack on Titan</strong> nhân dịp kỷ niệm thương hiệu, khơi dậy làn sóng đồn đoán mạnh mẽ trong cộng đồng fan về khả năng ra mắt một dự án hoạt hình hoàn toàn mới hoặc movie tiền truyện.',
    excerpt: 'WIT Studio tung teaser bí ẩn về Attack on Titan, mở ra nhiều dự đoán về dự án anime mới nhân dịp kỷ niệm thương hiệu.'
  },
  'big-walk-house-house.html': {
    summary: 'Nhà phát triển House House — cha đẻ của hiện tượng <em>Untitled Goose Game</em> — chính thức hé lộ tựa game co-op nhiều người chơi mới mang tên <strong>Big Walk</strong>, đưa game thủ cùng bạn bè khám phá thế giới mở kỳ thú với hệ thống giải đố dựa trên giao tiếp độc đáo.',
    excerpt: 'House House công bố Big Walk: Tựa game phiêu lưu co-op thế giới mở đầy màu sắc từ đội ngũ phát triển Untitled Goose Game.'
  },
  'chained-soldier-season-3.html': {
    summary: 'Sau thành công vang dội của các phần trước, anime <strong>Chained Soldier (Mato Seihei no Slave)</strong> xác nhận sẽ tiếp tục sản xuất Mùa 3, mang đến những trận chiến khốc liệt chống lại Dị Nữ Thần và mở rộng liên minh các Đội Phòng Vệ Ma Đô.',
    excerpt: 'Chained Soldier xác nhận sản xuất Mùa 3: Cuộc chiến Ma Đô tiếp diễn với những thử thách mới và quy mô mở rộng.'
  },
  'chiikawa-anime-tam-ngung-tap-moi-phat-lai-25-tap.html': {
    summary: 'Nhà sản xuất anime <strong>Chiikawa</strong> thông báo tạm ngừng phát sóng các tập mới để hoàn thiện khâu sản xuất, đồng thời lên lịch phát lại 25 tập phim được khán giả yêu thích nhất trên sóng truyền hình trong thời gian chờ đợi.',
    excerpt: 'Anime Chiikawa tạm dừng tập mới để nâng cao chất lượng sản xuất, phát lại 25 tập tuyển chọn phục vụ người hâm mộ.'
  },
  'genshin-impact-70-snezhnaya.html': {
    summary: 'HoYoverse chính thức ra mắt <strong>Genshin Impact 7.0: Everwinter Without Mercy</strong>, mở cánh cổng bước vào Snezhnaya — quốc gia Băng giá thứ 7 của Teyvat — cùng nhân vật mới Odette và bước thử nghiệm chế độ chiến đấu góc nhìn thứ ba đầy mới lạ.',
    excerpt: 'Genshin Impact 7.0 đưa Nhà Lữ Hành đến Snezhnaya: Khám phá vương quốc Băng giá, nhân vật Odette và chế độ chiến đấu mới.'
  },
  'gta6-preview.html': {
    summary: 'Rockstar Games ấn định ngày phát hành toàn cầu của siêu phẩm <strong>Grand Theft Auto VI</strong> vào ngày 19/11/2026 trên các hệ máy PS5, PS5 Pro và Xbox Series X|S, với thế giới mở Vice City sống động vượt bậc cùng mức giá niêm yết chính thức.',
    excerpt: 'Tổng hợp chi tiết GTA 6: Ngày phát hành 19/11/2026, các phiên bản mở bán và thế giới Vice City thế hệ mới từ Rockstar Games.'
  },
  'honkai-star-rail-4-6-pearl-zzz-crossover.html': {
    summary: 'Phiên bản <strong>Honkai: Star Rail 4.6</strong> chính thức ra mắt với nhân vật 5 sao hệ Băng Pearl, đồng thời HoYoverse cũng hé lộ sự kiện crossover lịch sử giữa Honkai: Star Rail và Zenless Zone Zero dự kiến cập bến trong bản 4.8.',
    excerpt: 'Honkai: Star Rail 4.6 chào đón nhân vật 5 sao Pearl và xác nhận sự kiện crossover bùng nổ cùng Zenless Zone Zero.'
  },
  'jujutsu-kaisen-chapter-271-final-climax-epilogue.html': {
    summary: 'Manga <strong>Jujutsu Kaisen</strong> của Gege Akutami chính thức hạ màn ở chương 271 sau 6 năm đăng tải bền bỉ trên Weekly Shonen Jump, khép lại hành trình diệt trừ nguyền hồn của Yuji Itadori cùng thông tin phát hành hai tập đơn cuối 29 và 30.',
    excerpt: 'Jujutsu Kaisen kết thúc ở chương 271: Nhìn lại hồi kết sau 6 năm của hiện tượng manga chú thuật và thông tin phát hành tập cuối.'
  },
  'jujutsu-kaisen-season-3-culling-game-release.html': {
    summary: '<strong>Jujutsu Kaisen Mùa 3 (Culling Game)</strong> do studio MAPPA thực hiện đã phát sóng trọn vẹn Phần 1 với 12 tập phim nghẹt thở, đồng thời dự án Phần 2 đang được khẩn trương sản xuất để nối tiếp cuộc thanh trừng chú thuật tàn khốc.',
    excerpt: 'Jujutsu Kaisen Mùa 3 Culling Game Phần 1 khép lại với 12 tập phim kịch tính, mở đường cho Phần 2 đang được MAPPA thực hiện.'
  },
  'kagurabachi-4-trieu-ban-anime-cypic-thang-4-2027.html': {
    summary: 'Manga ăn khách <strong>Kagurabachi</strong> của tác giả Takeru Hokazono chính thức cán mốc 4 triệu bản in toàn cầu, đồng thời dự án chuyển thể anime truyền hình do studio Cypic sản xuất được ấn định lên sóng vào tháng 4/2027.',
    excerpt: 'Kagurabachi vượt mốc 4 triệu bản in lưu hành và chính thức xác nhận anime truyền hình khởi chiếu vào tháng 4/2027.'
  },
  'made-in-abyss-awakening-mystery.html': {
    summary: 'Phim điện ảnh <strong>Made in Abyss: Awakening Mystery</strong> tung trailer chính thức, giới thiệu hai nhân vật mới Tepasté và Cravali cùng ca khúc chủ đề "Chain of the Abyss" do nhà soạn nhạc Kevin Penkin và Mori Calliope phối hợp thể hiện.',
    excerpt: 'Made in Abyss: Awakening Mystery ra mắt trailer chính thức, hé lộ dàn nhân vật mới và ca khúc chủ đề đầy ấn tượng.'
  },
  'mortal-shell-2-release.html': {
    summary: 'Cold Symmetry và Playstack chính thức công bố ngày ra mắt của tựa game hành động Soulslike <strong>Mortal Shell II</strong> trên PC, PS5 và Xbox Series X|S, nâng cấp toàn diện cơ chế đỡ đòn Posture và 8 dạng thể xác Shell độc đáo.',
    excerpt: 'Mortal Shell II ấn định ngày phát hành toàn cầu: Trải nghiệm Soulslike tăm tối với hệ thống chiến đấu và Shell hoàn toàn mới.'
  },
  'quit-laughing-shijima-horikoshi.html': {
    summary: 'Tác giả Kohei Horikoshi — cha đẻ của <em>My Hero Academia</em> — bất ngờ tái xuất trên Weekly Shonen Jump với one-shot kinh dị dài 61 trang mang tên <strong>Quit Laughing, Shijima</strong>, đem đến một câu chuyện rùng rợn và u ám đầy mới lạ.',
    excerpt: 'Cha đẻ My Hero Academia ra mắt one-shot kinh dị 61 trang Quit Laughing, Shijima đánh dấu sự trở lại ngoạn mục trên Weekly Shonen Jump.'
  },
  're-zero-season4-recapture-arc.html': {
    summary: 'Anime <strong>Re:Zero Season 4</strong> do studio White Fox sản xuất bước vào cao trào của Recapture Arc, kéo dài 19 tập với những màn giải cứu nghẹt thở của Natsuki Subaru và Emilia trước các Đại Tội Giám Mục.',
    excerpt: 'Re:Zero Season 4 bước vào hồi kết nghẹt thở của Recapture Arc: Lịch phát sóng các tập cuối trên nền tảng Crunchyroll.'
  },
  'slime-mua-4-tap-3-thang-7-2027-clayman-revenge.html': {
    summary: 'Hành trình của Rimuru Tempest trong <strong>Slime Mùa 4</strong> sẽ trở lại với cour 3 vào tháng 7/2027, trong khi spinoff <em>Clayman\'s Revenge</em> cũng được xác nhận sẽ chuyển thể thành anime truyền hình do studio 8-Bit thực hiện.',
    excerpt: 'Slime Mùa 4 ấn định lịch trở lại cour 3 vào tháng 7/2027 cùng dự án anime spinoff Clayman\'s Revenge từ studio 8-Bit.'
  },
  'solo-leveling-ragnarok-anime-chuyen-the-va-trailer-dau-tien.html': {
    summary: 'Webtoon ăn khách <strong>Solo Leveling: Ragnarok</strong> chính thức phát hành bản tiếng Anh tập 1 thông qua Yen Press, đồng thời nhà sản xuất cũng hé lộ những kế hoạch đầu tiên cho dự án chuyển thể hoạt hình trong tương lai.',
    excerpt: 'Solo Leveling: Ragnarok ra mắt bản tiếng Anh tập 1 và mở ra triển vọng chuyển thể anime sau thành công vang dội của nguyên tác.'
  },
  'galaxy-express-999-new-film.html': {
    summary: 'Toei Animation xác nhận đang phát triển một dự án phim điện ảnh anime chiếu rạp hoàn toàn mới dựa trên kiệt tác kinh điển <strong>Galaxy Express 999</strong> của huyền thoại Leiji Matsumoto, dưới sự chỉ đạo cốt truyện của đạo diễn gạo cội Rintaro.',
    excerpt: 'Toei Animation hồi sinh huyền thoại Galaxy Express 999 với phim điện ảnh mới do đạo diễn kỳ cựu Rintaro viết cốt truyện.'
  }
};

let updatedCount = 0;

for (const [fileRel, data] of Object.entries(summaryUpdates)) {
  const filePath = path.resolve(fileRel);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileRel}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <div class="hb-text">...</div>
  content = content.replace(/<div class="hb-text">[\s\S]*?<\/div>/, `<div class="hb-text">${data.summary}</div>`);

  // Replace <p class="art-hero-excerpt">...
  content = content.replace(/<p class="art-hero-excerpt">[\s\S]*?<\/p>/, `<p class="art-hero-excerpt">${data.excerpt}</p>`);

  // Replace meta descriptions
  content = content.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${data.excerpt.replace(/"/g, '&quot;')}">`);
  content = content.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${data.excerpt.replace(/"/g, '&quot;')}">`);
  content = content.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${data.excerpt.replace(/"/g, '&quot;')}">`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated summary in: ${fileRel}`);
  updatedCount++;

  // Update in search.js if exists
  if (fs.existsSync('assets/search.js')) {
    const slug = '/' + fileRel.replace(/\.html$/, '');
    let searchContent = fs.readFileSync('assets/search.js', 'utf8');
    const slugIdx = searchContent.indexOf(`"url": "${slug}"`);
    if (slugIdx !== -1) {
      // Find the excerpt property in this object
      const startObj = searchContent.lastIndexOf('{', slugIdx);
      const endObj = searchContent.indexOf('}', slugIdx);
      if (startObj !== -1 && endObj !== -1) {
        let objStr = searchContent.slice(startObj, endObj + 1);
        objStr = objStr.replace(/"excerpt":\s*"[^"]*"/, `"excerpt": "${data.excerpt.replace(/"/g, '\\"')}"`);
        searchContent = searchContent.slice(0, startObj) + objStr + searchContent.slice(endObj + 1);
        fs.writeFileSync('assets/search.js', searchContent, 'utf8');
      }
    }
  }
}

console.log(`Successfully updated ${updatedCount} articles!`);
