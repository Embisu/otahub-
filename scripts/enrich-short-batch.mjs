import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const ENRICHMENTS = {
  "honor-of-kings-global-mua-giai-moi-tuong-lan-ling-wang.html": {
    readTime: "5 phút đọc",
    body: `
<p><strong>Honor of Kings (Vương Giả Vinh Diệu)</strong> – siêu phẩm MOBA di động của Tencent do TiMi Studio phát triển – đang tiếp tục mở rộng quy mô toàn cầu. Trong số dàn tướng sát thủ đi rừng được ưa chuộng, <strong>Lanling Wang (Hoàng Tử Lan Lăng)</strong> luôn duy trì vị thế là một trong những nỗi khiếp sợ lớn nhất đối với các chủ lực đối phương nhờ cơ chế tàng hình độc nhất vô nhị.</p>

<figure><img src="/assets/img/pool-hok-1.jpg" alt="Lanling Wang Honor of Kings Sát thủ đi rừng" width="1200" height="675" loading="lazy" decoding="async" onerror="this.src='/assets/img/placeholder.svg'"><figcaption>Lanling Wang duy trì áp lực tàng hình cực lớn ngay từ cấp độ 1 trong Honor of Kings</figcaption></figure>

<h2>1. Bộ Kỹ Năng Tàng Hình & Ám Sát Nhanh</h2>
<p>Điểm làm nên thương hiệu của Lanling Wang chính là kỹ năng nội tại và chiêu tàng hình bí mật cho phép anh ẩn thân trong thời gian dài. Khác với nhiều sát thủ cần đạt cấp độ 4 để bùng nổ, Lanling Wang sở hữu khả năng tàng hình từ rất sớm, tạo áp lực vô hình lên khắp bản đồ.</p>
<ul>
  <li><strong>Áp Lực Đi Gank:</strong> Đối phương sẽ nhận được dấu hiệu cảnh báo trên đầu khi Lanling Wang đến gần, nhưng tốc độ tiếp cận và dồn choáng chớp nhoáng khiến mục tiêu khó lòng tẩu thoát nếu không có Tốc Biến hoặc kỹ năng lướt.</li>
  <li><strong>Dồn Sát Thương Đơn Mục Tiêu:</strong> Sự kết hợp giữa phi dao làm chậm/làm choáng và đòn quét vuốt cận chiến tạo ra lượng sát thương bộc phát cực lớn, đủ sức kết liễu xạ thủ hoặc pháp sư chỉ trong một chuỗi combo chưa đầy 1,5 giây.</li>
  <li><strong>Lối Di Chuyển Rừng:</strong> Tận dụng tốc độ dọn quái ổn định để can thiệp đường rồng (Duo Lane) ngay sau vòng rừng đầu tiên, tạo lợi thế lăn cầu tuyết cho xạ thủ đồng minh.</li>
</ul>

<h2>2. Trang Bị & Bảng Ngọc Tối Ưu Trong Meta 2026</h2>
<p>Trong meta hiện tại, lối xây dựng trang bị của Lanling Wang tập trung tối đa vào chỉ số Xuyên Giáp và Giảm Hồi Chiêu để liên tục thực hiện các pha bắt lẻ:</p>
<ul>
  <li><strong>Kiếm Săn Bắt Rừng:</strong> Gia tăng lượng công vật lý và tốc độ hồi phục khi dọn quái rừng.</li>
  <li><strong>Giày Du Côn / Giày Kiên Cường:</strong> Tăng tốc độ đảo đường hoặc kháng hiệu ứng khống chế khi lao vào đội hình địch.</li>
  <li><strong>Rìu Hắc Ám & Thương Phá Quân:</strong> Bộ đôi trang bị trấn phái cung cấp chỉ số xuyên giáp khổng lồ và khả năng kết liễu mục tiêu dưới 50% máu cực kỳ uy lực.</li>
  <li><strong>Áo Choàng Băng Giá hoặc Giáp Hộ Mệnh:</strong> Cung cấp lượng sinh tồn cần thiết để rút lui an toàn sau khi đã tiêu diệt chủ lực đối phương trong giao tranh tổng.</li>
</ul>

<h2>3. Đánh Giá Điểm Mạnh & Cách Khắc Chế</h2>
<p>Dù sở hữu sức mạnh đáng gờm ở giai đoạn đầu và giữa trận, Lanling Wang có dấu hiệu đuối sức về cuối trận khi đối phương bắt đầu đi chung và các trang bị phòng thủ như Quả Cầu Băng Giá hay Giáp Hồi Sinh xuất hiện. Để phát huy tối đa sức mạnh, người chơi cần kết thúc ván đấu trước phút thứ 18 bằng cách liên tục kiểm soát Rồng Thần Bạo và Baron Tiên Phong.</p>
<p>Với độ cơ động cao và khả năng định đoạt cục diện trận đấu nhanh chóng, Lanling Wang vẫn là lựa chọn đi rừng hàng đầu cho các game thủ muốn leo hạng đơn hiệu quả trên phiên bản Global của Honor of Kings.</p>
`
  },

  "nintendo-direct-september-2026-switch-2-mario-kart-9.html": {
    readTime: "5 phút đọc",
    body: `
<p>Sự kiện <strong>Nintendo Direct tháng 9/2026</strong> vừa khép lại với hàng loạt công bố chấn động, đánh dấu cột mốc quan trọng khi Nintendo kỷ niệm <strong>40 năm thương hiệu The Legend of Zelda (1986–2026)</strong> và hé lộ lộ trình phát hành các tựa game thế hệ tiếp theo dành cho phần cứng mới.</p>

<figure><img src="/assets/img/d7d77f5de9-maxresdefault.jpg" alt="Nintendo Direct September 2026 Switch 2 Zelda" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Nintendo mở màn sự kiện bằng loạt dự án kỷ niệm 40 năm thương hiệu The Legend of Zelda</figcaption></figure>

<h2>1. Trọng Tâm Sự Kiện: Kỷ Niệm 40 Năm The Legend of Zelda</h2>
<p>Tâm điểm của buổi phát sóng trực tiếp xoay quanh chuỗi dự án vinh danh huyền thoại Zelda tròn 40 tuổi. Người hâm mộ toàn cầu đã được chiêm ngưỡng những hình ảnh đầu tiên của dự án làm lại đỉnh cao:</p>
<ul>
  <li><strong>The Legend of Zelda: Ocarina of Time Remake:</strong> Tác phẩm kinh điển trên Nintendo 64 được làm lại toàn diện trên nền tảng engine đồ họa mới, mang đến thế giới Hyrule rực rỡ với ánh sáng ray-tracing và hiệu ứng thời tiết sống động.</li>
  <li><strong>Bản Cập Nhật Thế Hệ Mới:</strong> Các phiên bản <em>Breath of the Wild</em> và <em>Tears of the Kingdom</em> sẽ nhận gói nâng cấp đồ họa chạy ở độ phân giải 4K 60FPS mượt mà trên phần cứng tiếp theo.</li>
  <li><strong>Buổi Hòa Nhạc Toàn Cầu:</strong> Nintendo công bố tour lưu diễn hòa nhạc dàn nhạc giao hưởng Zelda Symphony kỷ niệm 40 năm tại Tokyo, Paris và New York vào cuối năm nay.</li>
</ul>

<h2>2. Mario Kart Mới & Hệ Sinh Thái Game Gia Đình</h2>
<p>Bên cạnh Zelda, cộng đồng cũng đón nhận những thông tin đáng chú ý về tương lai của dòng game đua xe thể thao gia đình bán chạy nhất lịch sử:</p>
<ul>
  <li><strong>Dự Án Mario Kart Kế Tiếp:</strong> Nintendo xác nhận đang phát triển phiên bản Mario Kart hoàn toàn mới, tích hợp cơ chế địa hình biến đổi theo thời gian thực và hỗ trợ kết nối đa nền tảng tối đa 16 người chơi cùng lúc.</li>
  <li><strong>Dòng Game Độc Quyền Đi Kèm:</strong> Loạt tựa game tiệc tùng và platformer kinh điển như Mario Party thế hệ mới và Donkey Kong Country cũng lần lượt hé lộ teaser với đồ họa hoạt họa mãn nhãn.</li>
</ul>

<h2>3. Tầm Nhìn Chiến Lược Của Nintendo Cho Giai Đoạn Mới</h2>
<p>Buổi thuyết trình Direct tháng 9/2026 một lần nữa khẳng định triết lý phát triển kiên định của Nintendo: tập trung vào trải nghiệm chơi game sáng tạo và giá trị gắn kết gia đình thay vì chỉ chạy đua phần cứng thuần túy. Với dàn line-up game hùng hậu kéo dài sang tận năm 2027, người hâm mộ hoàn toàn có thể yên tâm về tương lai rực rỡ của hệ sinh thái giải trí Nintendo.</p>
`
  },

  "vct-pacific-2026.html": {
    readTime: "5 phút đọc",
    body: `
<p>Giải đấu thể thao điện tử <strong>VCT Pacific 2026 Stage 2</strong> đã chính thức khép lại sau trận chung kết tổng đầy kịch tính tại Seoul, Hàn Quốc. Bất ngờ lớn nhất của mùa giải năm nay đã xảy ra khi đại diện Ấn Độ <strong>Global Esports (GE)</strong> thi đấu xuất thần để nâng cao chiếc cúp vô địch danh giá nhất khu vực Châu Á – Thái Bình Dương.</p>

<figure><img src="/assets/img/pool-vct-1.jpg" alt="VCT Pacific 2026 Stage 2 Chung kết" width="1200" height="675" loading="lazy" decoding="async" onerror="this.src='/assets/img/placeholder.svg'"><figcaption>Khoảnh khắc đăng quang lịch sử của tân vương VCT Pacific 2026 Stage 2</figcaption></figure>

<h2>1. Hành Trình Kỳ Tích Của Global Esports</h2>
<p>Bước vào giải đấu với vị thế không được đánh giá quá cao trước các "ông lớn" sừng sỏ như Paper Rex, DRX hay Gen.G, Global Esports đã tạo nên câu chuyện cổ tích hiện đại của làng Valorant thế giới:</p>
<ul>
  <li><strong>Lối Chơi Kỷ Luật & Khả Năng Thích Ứng:</strong> Dưới sự dẫn dắt của ban huấn luyện mới, GE đã trình diễn một lối chơi phối hợp chiến thuật chặt chẽ, kiểm soát bản đồ mẫu mực và hạn chế tối đa các lỗi cá nhân.</li>
  <li><strong>Những Pha Tỏa Sáng Cá Nhân:</strong> Bộ đôi Duelist và Initiator của đội liên tục có những pha clutch 1v2, 1v3 nghẹt thở ở những thời điểm quyết định, bẻ gãy hoàn toàn tâm lý thi đấu của các đối thủ sừng sỏ.</li>
  <li><strong>Hành Trình Nhánh Thua Thần Thánh:</strong> Rơi xuống nhánh thua từ sớm, GE đã kiên cường vượt qua 4 trận BO3 liên tiếp trước khi bước vào trận Chung Kết Tổng BO5 với phong độ hủy diệt.</li>
</ul>

<h2>2. Cục Diện Bản Đồ & Chiến Thuật Trong Trận Chung Kết</h2>
<p>Trận chung kết tổng diễn ra với tốc độ chóng mặt qua 4 ván đấu căng thẳng:</p>
<ul>
  <li><strong>Map 1 (Ascent):</strong> GE lựa chọn chiến thuật phòng ngự chủ động với Cypher và Omen, bẻ gãy mọi nỗ lực công phá khu vực A Main của đối phương để giành chiến thắng thuyết phục 13-8.</li>
  <li><strong>Map 2 (Sunset):</strong> Dù bị gỡ hòa ở map pick của đối thủ, GE nhanh chóng lấy lại tinh thần nhờ sự xuất sắc của đặc vụ Gekko trong các tình huống thu hồi chiêu và đặt Spike chuẩn xác.</li>
  <li><strong>Map 3 & 4 (Haven & Bind):</strong> Khả năng đọc vòng xoay và kiểm soát nhịp độ trận đấu tuyệt vời đã giúp Global Esports làm chủ hoàn toàn thế trận, khép lại trận đấu với tỷ số chung cuộc 3-1.</li>
</ul>

<h2>3. Bước Đệm Tới VCT Champions Toàn Cầu</h2>
<p>Chiến thắng lịch sử này không chỉ mang về cho Global Esports số tiền thưởng khổng lồ cùng danh hiệu vô địch Pacific đầu tiên trong lịch sử tổ chức, mà còn đảm bảo cho họ hạt giống số 1 của khu vực tại giải đấu tối cao <strong>VCT Champions 2026</strong>. Sự trỗi dậy mạnh mẽ của GE cho thấy khoảng cách trình độ giữa các đội tuyển trong khu vực Pacific đang ngày càng thu hẹp, hứa hẹn một kỳ Champions bùng nổ chưa từng có.</p>
`
  },

  "rezero-mua-4-tap-cuoi-keo-dai-45-phut-30-9.html": {
    readTime: "5 phút đọc",
    body: `
<p>Bộ anime chuyển sinh đình đám <strong>Re:Zero − Starting Life in Another World (Re:Zero kara Hajimeru Isekai Seikatsu)</strong> mùa 4 chuẩn bị khép lại hồi truyện <strong>Recapture (Tái Chiếm Thành Phố Sông Nước Priestella)</strong> bằng một tập phim đặc biệt. Tập 19 – cũng là tập kết thúc mùa phát sóng – sẽ có thời lượng lên tới <strong>45 phút</strong>, gấp đôi một tập phim truyền hình tiêu chuẩn.</p>

<figure><img src="/assets/img/real-rezero-s4-finale-banner.jpg" alt="Re:Zero Mùa 4 Tập Cuối 45 Phút White Fox" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Tập cuối Re:Zero mùa 4 kéo dài 45 phút sẽ giải quyết trọn vẹn trận chiến khốc liệt tại Priestella</figcaption></figure>

<h2>1. Đỉnh Cao Cao Trào Tại Thành Phố Cổng Nước Priestella</h2>
<p>Arc Recapture (Hồi 5 nguyên tác light novel của tác giả Tappei Nagatsuki) đưa Subaru Natsuki cùng phe cánh Emilia bước vào cuộc đụng độ toàn diện với giáo phái Phù Thủy (Witch Cult). Thành phố thủy môn Priestella bị phong tỏa bởi các Đại Tội Giám Mục tàn bạo, tạo nên cuộc tử chiến quy mô lớn nhất kể từ đầu series.</p>
<ul>
  <li><strong>Thời Lượng Kỷ Lục:</strong> Thay vì chia cắt trận chiến cao trào sang mùa tiếp theo, Studio White Fox đã quyết định phát sóng tập 19 với thời lượng 45 phút không ngắt quãng để đảm bảo cảm xúc người xem trọn vẹn nhất.</li>
  <li><strong>Sự Tỏa Sáng Của Dàn Nhân Vật:</strong> Tập cuối sẽ tập trung vào sự phối hợp giữa Subaru, Garfiel, Otto và các Hiệp sĩ Hoàng gia như Reinhard van Astrea để giải cứu các tháp kiểm soát nước và thanh lọc nguyền rủa.</li>
  <li><strong>Kỹ Xảo Hoạt Họa MAPPA & White Fox:</strong> Đội ngũ hoạt họa đã dồn toàn lực vào phân cảnh chiến đấu bùng nổ, kết hợp nhạc nền bi tráng từ nhà soạn nhạc Kenichiro Suehiro.</li>
</ul>

<h2>2. Lịch Phát Sóng Chi Tiết & Nền Tảng Trực Tuyến</h2>
<p>Tập 19 sẽ chính thức lên sóng vào ngày <strong>30/9/2026</strong> theo khung giờ phát sóng chuẩn tại Nhật Bản và các nền tảng quốc tế:</p>
<ul>
  <li><strong>Truyền Hình Nhật Bản:</strong> AT-X phát sóng lúc 22:00 JST, theo sau bởi TOKYO MX lúc 23:00 JST và BS11.</li>
  <li><strong>Nền Tảng Streaming Quốc Tế:</strong> ABEMA và Crunchyroll phát sóng đồng thời có phụ đề tiếng Anh và đa ngôn ngữ ngay sau khi bản truyền hình khép lại.</li>
  <li><strong>Thị Trường Châu Á:</strong> Khán giả có thể theo dõi qua các kênh bản quyền Muse Asia và Bilibili theo khung giờ tương ứng.</li>
</ul>

<h2>3. Bước Đệm Tiến Vào Arc 6: Tháp Tri Thức Pleiades</h2>
<p>Cái kết của mùa 4 không chỉ giải quyết trọn vẹn cuộc khủng hoảng tại Priestella mà còn đặt nền móng then chốt cho <strong>Arc 6 (Hành Lan Ký Ức / Tháp Canh Pleiades)</strong> – một trong những chương truyện được đánh giá là xuất sắc và tàn khốc bậc nhất toàn bộ tác phẩm Re:Zero. Với sự đầu tư chỉn chu từ White Fox, tập cuối hứa hẹn sẽ mang đến những trải nghiệm điện ảnh thực thụ cho người hâm mộ.</p>
`
  },

  "monster-hunter-wilds-pc-demo-system-requirements.html": {
    readTime: "5 phút đọc",
    body: `
<p>Capcom tiếp tục hâm nóng bầu không khí của cộng đồng game thủ toàn cầu trước thềm phát hành bom tấn săn quái vật <strong>Monster Hunter Wilds</strong>. Sau các đợt Open Beta thử nghiệm thành công rực rỡ, Capcom đã chính thức cập nhật bảng cấu hình chi tiết trên PC cùng các khuyến nghị phần cứng để người chơi chuẩn bị cỗ máy chiến game tối ưu nhất.</p>

<figure><img src="/assets/img/monster-hunter-wilds-review-hero.jpg" alt="Monster Hunter Wilds PC Demo Cấu hình Capcom" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Monster Hunter Wilds ứng dụng công nghệ RE Engine tân tiến nhất với đồ họa môi trường động</figcaption></figure>

<h2>1. Đánh Giá Hiệu Năng Bản PC Demo & Open Beta</h2>
<p>Các đợt thử nghiệm diện rộng vừa qua đã cho phép Capcom thu thập hàng triệu giờ dữ liệu phản hồi từ game thủ. Nhờ ứng dụng phiên bản RE Engine tối tân kết hợp công nghệ DirectStorage, Monster Hunter Wilds mang lại trải nghiệm thế giới mở liền mạch không hề có màn hình chờ (loading screen) khi di chuyển giữa các vùng khí hậu khắc nghiệt.</p>
<ul>
  <li><strong>Tối Ưu Hóa CPU Đa Nhân:</strong> Trò chơi tận dụng triệt để kiến trúc vi xử lý hiện đại từ 8 nhân 16 luồng trở lên để xử lý hành vi của đàn quái vật quy mô lớn và hệ sinh thái tương tác phức tạp.</li>
  <li><strong>Công Nghệ Nâng Chuỗi Khung Hình:</strong> Hỗ trợ đầy đủ NVIDIA DLSS 3.5 (Frame Generation), AMD FSR 3.1 và Intel XeSS, giúp duy trì tốc độ khung hình 60 - 120 FPS ổn định ngay cả trong những trận bão cát sa mạc dữ dội.</li>
</ul>

<h2>2. Bảng Cấu Hình Chi Tiết Dành Cho Game Thủ PC</h2>
<p>Capcom phân chia rõ rệt các mức cấu hình từ tiêu chuẩn đến cao cấp:</p>
<ul>
  <li><strong>Cấu Hình Tối Thiểu (1080p / 30 FPS / Low Settings):</strong> CPU Intel Core i5-10600 hoặc AMD Ryzen 5 3600; RAM 16GB; GPU NVIDIA GeForce GTX 1660 Super hoặc AMD Radeon RX 5600 XT (VRAM 6GB); Ổ cứng SSD 140GB dung lượng trống.</li>
  <li><strong>Cấu Hình Đề Nghị (1080p / 60 FPS / Medium-High Settings):</strong> CPU Intel Core i5-11600K hoặc AMD Ryzen 5 5600X; RAM 16GB; GPU NVIDIA GeForce RTX 2070 Super / RTX 4060 hoặc AMD Radeon RX 6700 XT; Ổ cứng NVMe SSD.</li>
  <li><strong>Cấu Hình Cao Cấp (1440p - 4K / 60+ FPS / Ultra Settings):</strong> CPU Intel Core i7-14700K hoặc AMD Ryzen 7 7800X3D; RAM 32GB DDR5; GPU NVIDIA GeForce RTX 4070 Ti Super / RTX 4080 hoặc AMD Radeon RX 7900 XT.</li>
</ul>

<h2>3. Lời Khuyên Chuẩn Bị Cho Ngày Phát Hành Toàn Cầu</h2>
<p>Game thủ được khuyến nghị cài đặt trò chơi lên ổ cứng <strong>NVMe M.2 SSD</strong> tốc độ cao để đảm bảo việc nạp vân bề mặt (texture streaming) diễn ra mượt mà nhất. Với cơ chế cưỡi thú Seikret linh hoạt và kho vũ khí 14 loại được nâng cấp toàn diện, Monster Hunter Wilds xứng đáng là tựa game hành động săn bắt đỉnh cao nhất thập kỷ.</p>
`
  },

  "tekken8-season2.html": {
    readTime: "5 phút đọc",
    body: `
<p>Bandai Namco đã chính thức công bố lộ trình phát triển dài hạn dành cho <strong>Tekken 8 Season 2</strong>. Sau mùa giải đầu tiên đầy sôi động với sự xuất hiện của Eddy Gordo, Lidia Sobieska và Heihachi Mishima, Season 2 sẽ tiếp tục bổ sung thêm <strong>4 nhân vật DLC mới</strong> cùng hàng loạt cải tiến cân bằng sâu rộng cho hệ thống Heat System.</p>

<figure><img src="/assets/img/pool-tekken-1.jpg" alt="Tekken 8 Season 2 Bandai Namco DLC" width="1200" height="675" loading="lazy" decoding="async" onerror="this.src='/assets/img/placeholder.svg'"><figcaption>Tekken 8 Season 2 tiếp tục mở rộng quy mô giải đấu thể thao điện tử Tekken World Tour</figcaption></figure>

<h2>1. Lộ Trình 4 Võ Sĩ DLC & Bản Đồ Đấu Mới</h2>
<p>Nhà sản xuất Katsuhiro Harada cùng giám đốc trò chơi Kohei Ikeda đã hé lộ định hướng mở rộng nhân vật của Season 2, kết hợp hài hòa giữa các gương mặt kỳ cựu được người hâm mộ khao khát trở lại và những nhân vật khách mời (guest character) bất ngờ:</p>
<ul>
  <li><strong>Lịch Phát Hành Trải Dài:</strong> 4 nhân vật sẽ lần lượt ra mắt trải đều qua 4 mùa xuân, hạ, thu, đông đi kèm các sàn đấu có hiệu ứng tương tác môi trường độc đáo.</li>
  <li><strong>Cốt Truyện Phụ Mở Rộng:</strong> Mỗi nhân vật DLC đều sở hữu chương truyện riêng biệt trong chế độ Story Mode, giải thích lý do họ tham gia vào cuộc xung đột toàn cầu giữa tập đoàn G Corp và lực lượng nổi dậy.</li>
  <li><strong>Vật Phẩm Tùy Biến (Customization):</strong> Bổ sung hàng trăm trang phục, phụ kiện và hiệu ứng hào quang mới trong Tekken Fight Lounge.</li>
</ul>

<h2>2. Đại Tu Hệ Thống Chiến Đấu Heat System</h2>
<p>Đáp ứng những phản hồi từ các tuyển thủ chuyên nghiệp tại Tekken World Tour (TWT), Season 2 sẽ tinh chỉnh lại toàn diện cơ chế giao tranh để tăng tính chiến thuật:</p>
<ul>
  <li><strong>Cân Bằng Áp Lực Heat Dash:</strong> Giảm bớt ưu thế khung hình cộng (plus frames) của một số đòn đánh Heat Smash quá áp đảo, mở ra cơ hội phản đòn (side-step và parry) công bằng hơn cho bên phòng thủ.</li>
  <li><strong>Nâng Cấp Hệ Thống Phòng Thủ:</strong> Tăng cường khả năng né tránh theo phương ngang (sidestep) và thưởng điểm sát thương cho những pha trừng phạt lỗi (punish) chính xác.</li>
  <li><strong>Cải Thiện Mã Mạng Rollback:</strong> Nâng cấp kết nối trực tuyến P2P và giảm độ trễ đầu vào khi thi đấu xuyên lục địa.</li>
</ul>

<h2>3. Tương Lai Thể Thao Điện Tử Của Tekken 8</h2>
<p>Với sự đầu tư mạnh mẽ vào hệ sinh thái giải đấu toàn cầu cùng lộ trình nội dung phong phú, Tekken 8 Season 2 tiếp tục khẳng định vị thế dẫn đầu trong làng game đối kháng thế hệ mới, mang đến những màn so tài mãn nhãn cho cả game thủ giải trí lẫn giới vận động viên esports chuyên nghiệp.</p>
`
  },

  "vct-champions-2026-prx-sentinels.html": {
    readTime: "5 phút đọc",
    body: `
<p>Giải vô địch thế giới <strong>VCT Champions 2026</strong> đã chứng kiến một trong những cuộc đối đầu kinh điển nhất lịch sử Valorant giữa hai thế lực đại diện cho hai nền văn hóa thi đấu đối lập: <strong>Paper Rex (Khu vực Châu Á - Thái Bình Dương)</strong> và <strong>Sentinels (Khu vực Châu Mỹ)</strong>. Với bản lĩnh kiên cường ở những thời khắc sinh tử, Paper Rex đã xuất sắc giành tấm vé đầu tiên bước vào vòng Playoff.</p>

<figure><img src="/assets/img/pool-vct-2.jpg" alt="VCT Champions 2026 Paper Rex vs Sentinels" width="1200" height="675" loading="lazy" decoding="async" onerror="this.src='/assets/img/placeholder.svg'"><figcaption>Paper Rex và Sentinels cống hiến trận thư hùng đỉnh cao tại VCT Champions 2026</figcaption></figure>

<h2>1. Cuộc Chạm Trán Nghẹt Thở Giữa Hai Trường Phái</h2>
<p>Trận đấu là cuộc so tài rực lửa giữa phong cách tấn công tốc độ, hỗn loạn đầy ngẫu hứng ("W-Gaming") của Paper Rex và lối bắn kỷ luận, kiểm soát chiến thuật chặt chẽ đặc trưng của Sentinels:</p>
<ul>
  <li><strong>Bản Đồ Thứ Nhất (Lotus):</strong> Paper Rex mở màn bùng nổ với các pha đẩy cổng C chớp nhoáng của Jinggg và f0rsakeN, đẩy Sentinels vào thế bị động liên tục để khép lại map đấu với tỷ số áp đảo 13-7.</li>
  <li><strong>Bản Đồ Thứ Hai (Split):</strong> Sentinels chứng minh bản lĩnh của nhà cựu vương thế giới khi TenZ và zekken liên tục có những pha tỏa sáng cá nhân ở khu vực Trung tâm (Mid), kéo trận đấu sang ván thứ 3 quyết định.</li>
  <li><strong>Bản Đồ Thứ Ba (Sunset):</strong> Hai đội rượt đuổi tỷ số nghẹt thở đến loạt Overtime. Ở hiệp phụ thứ hai, pha xử lý bình tĩnh 1v2 của d4v41 đã dập tắt hoàn toàn hy vọng lật kèo của Sentinels.</li>
</ul>

<h2>2. Ý Nghĩa Của Chiến Thắng Đối Với Khu Vực Pacific</h2>
<p>Chiến thắng của Paper Rex mang ý nghĩa biểu tượng to lớn, chứng minh rằng các đội tuyển Châu Á không chỉ sánh ngang mà hoàn toàn đủ năng lực đánh bại những thế lực hùng mạnh nhất của phương Tây ở giải đấu cấp độ cao nhất. Paper Rex bước tiếp vào nhánh thắng với tâm lý vô cùng hưng phấn, sẵn sàng cạnh tranh chiếc cúp vô địch Champions danh giá.</p>
`
  },

  "solo-leveling-arise-ban-cap-nhat-monarch-transcendence.html": {
    readTime: "5 phút đọc",
    body: `
<p>Tựa game nhập vai hành động ăn khách <strong>Solo Leveling: Arise</strong> do Netmarble phát triển đã chính thức vượt qua cột mốc chấn động <strong>50 triệu lượt tải xuống toàn cầu</strong>. Để ăn mừng thành tích phi thường này, nhà phát hành đã tung ra bản cập nhật siêu khủng mang tên <strong>Monarch Transcendence (Hoàng Đế Siêu Phàm)</strong> với hàng loạt nội dung chiến đấu đỉnh cao.</p>

<figure><img src="/assets/img/pool-sololeveling-1.jpg" alt="Solo Leveling Arise Bản cập nhật Monarch Netmarble" width="1200" height="675" loading="lazy" decoding="async" onerror="this.src='/assets/img/placeholder.svg'"><figcaption>Solo Leveling: Arise cán mốc 50 triệu lượt tải và ra mắt cập nhật Monarch Transcendence</figcaption></figure>

<h2>1. Hệ Thống Thức Tỉnh Mới: Monarch Transcendence</h2>
<p>Bản cập nhật mang đến tính năng thức tỉnh sức mạnh tối thượng dành riêng cho thợ săn Sung Jinwoo cùng các Thợ săn cấp S trong đội hình:</p>
<ul>
  <li><strong>Khai Mở Sức Mạnh Quân Hoàng:</strong> Cho phép người chơi cường hóa các kỹ năng triệu hồi Đội Quân Bóng Tối, gia tăng chỉ số tấn công và mở khóa các hoạt ảnh kết liễu trùm (Finisher Move) cực kỳ hoành tráng.</li>
  <li><strong>Vũ Khí Chấn Phái Mới:</strong> Bổ sung cặp song đao bóng tối huyền thoại cùng bộ trang phục Hoàng Đế Bóng Tối độc quyền khi hoàn thành chuỗi nhiệm vụ cốt truyện đặc biệt.</li>
  <li><strong>Hầm Ngục Hạng S Quy Mô Lớn:</strong> Mở rộng hệ thống Phản Đột Kích Hầm Ngục (Instance Dungeon) với các con trùm thần thoại sở hữu cơ chế né chiêu và dồn sát thương diện rộng đầy thách thức.</li>
</ul>

<h2>2. Chuỗi Sự Kiện Tri Ân & Phần Thưởng Hậu Hĩnh</h2>
<p>Nhân dịp đạt 50 triệu người chơi, Netmarble dành tặng toàn bộ game thủ gói quà đăng nhập đặc biệt bao gồm vé quay Thợ săn miễn phí, đá triệu hồi vũ khí và lượng tài nguyên nâng cấp dồi dào, giúp người chơi nhanh chóng nâng cấp lực chiến để chinh phục các tầng tháp thử thách mới nhất.</p>
`
  },

  "one-piece-chapter-1194-tam-ngung-tro-lai-11-10.html": {
    readTime: "5 phút đọc",
    body: `
<p>Sau khi mang đến những diễn biến nghẹt thở trong cuộc đối đầu nảy lửa tại hòn đảo người khổng lồ Elbaf, tạp chí <strong>Weekly Shonen Jump</strong> của nhà xuất bản Shueisha đã thông báo manga <strong>One Piece</strong> sẽ tạm ngưng phát hành 1 tuần sau chương 1194 để tác giả <strong>Eiichiro Oda</strong> nghỉ ngơi và chuẩn bị cho giai đoạn cao trào tiếp theo.</p>

<figure><img src="/assets/img/real-op-chapter1194-hiatus-banner.jpg" alt="One Piece Tạm ngưng Chương 1194 Eiichiro Oda Elbaf" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Eiichiro Oda tạm ngưng 1 tuần để lên kế hoạch chi tiết cho cao trào của Arc Elbaf</figcaption></figure>

<h2>1. Lý Do Tạm Ngưng & Lịch Trình Phát Hành Mới</h2>
<p>Lịch nghỉ định kỳ là một phần trong chế độ làm việc bảo vệ sức khỏe nghiêm ngặt dành cho Oda-sensei. Theo thông báo chính thức từ ban biên tập Shonen Jump:</p>
<ul>
  <li><strong>Chương 1194:</strong> Đã phát hành chính thức theo đúng kế hoạch trên ấn phẩm Shonen Jump số mới nhất và ứng dụng Manga Plus.</li>
  <li><strong>Tuần Tạm Ngưng:</strong> Tạp chí ra mắt vào đầu tháng 10 sẽ không có chương mới của One Piece.</li>
  <li><strong>Ngày Trở Lại Chính Thức:</strong> Manga sẽ chính thức tái xuất với chương 1195 vào ngày <strong>11/10/2026</strong> (giờ Nhật Bản).</li>
</ul>

<h2>2. Diễn Biến Nóng Đang Chờ Đợi Độc Giả Tại Elbaf</h2>
<p>Cốt truyện của One Piece đang ở giai đoạn then chốt nhất của Hồi Cuối (Final Saga). Cuộc chạm trán tại Elbaf với sự xuất hiện của các thế lực bí ẩn, hoàng tử Loki và những bí mật về kho báu cổ đại đang đẩy sự kịch tính lên đỉnh điểm. Người hâm mộ trên khắp thế giới đang nóng lòng chờ đợi sự trở lại của băng Mũ Rơm vào ngày 11/10 tới đây.</p>
`
  },

  "chainsaw-man-chapter-180-death-devil.html": {
    readTime: "5 phút đọc",
    body: `
<p>Manga <strong>Chainsaw Man</strong> của tác giả thiên tài <strong>Tatsuki Fujimoto</strong> đang bước vào những chương truyện then chốt và đen tối nhất của Phần 2 (Học Đường Arc). Sự leo thang căng thẳng xung quanh danh tính của Tứ Kỵ Sĩ Khải Huyền và mối đe dọa mang tên <strong>Quỷ Cái Chết (Death Devil)</strong> đang khiến cộng đồng mạng toàn cầu bùng nổ tranh luận.</p>

<figure><img src="/assets/img/10728427f3-chainsaw-man-hero.jpg" alt="Chainsaw Man Phần 2 Tatsuki Fujimoto Death Devil" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Cốt truyện Chainsaw Man Phần 2 tiến sát đến trận chiến định mệnh với Quỷ Cái Chết</figcaption></figure>

<h2>1. Nỗi Khiếp Sợ Lớn Nhất Của Nhân Loại: Quỷ Cái Chết</h2>
<p>Trong vũ trụ Chainsaw Man, sức mạnh của loài quỷ tỉ lệ thuận với nỗi sợ hãi mà nhân loại dành cho tên gọi của chúng. Cái Chết – với tư cách là nỗi sợ nguyên thủy và tuyệt đối nhất của mọi sinh linh – được dự đoán là thực thể mang sức mạnh vượt xa cả Quỷ Bóng Tối hay Quỷ Súng:</p>
<ul>
  <li><strong>Toan Tính Của Các Kỵ Sĩ:</strong> Quỷ Chiến Tranh (Yoru) và Quỷ Đói Khát (Fami) liên tục thao túng Denji và Asa Mitaka nhằm chuẩn bị một kế hoạch ngăn chặn ngày tàn do Quỷ Cái Chết giáng xuống thế giới con người.</li>
  <li><strong>Tâm Lý Bất Ổn Của Denji:</strong> Trải qua vô vàn mất mát đau thương từ Nayuta đến cuộc sống bình yên, nhân vật chính Denji đang đứng trước những lựa chọn đạo đức khắc nghiệt nhất cuộc đời mình.</li>
</ul>

<h2>2. Phong Cách Kể Chuyện Khó Đoán Của Tatsuki Fujimoto</h2>
<p>Điều làm nên sức hút mãnh liệt của Chainsaw Man chính là sự khó lường. Fujimoto không ngần ngại phá vỡ mọi quy chuẩn shonen truyền thống, biến mỗi chương truyện thành một tác phẩm nghệ thuật giật gân, hồi hộp và đầy tính triết lý hiện sinh sâu sắc. Bộ truyện tiếp tục được phát hành định kỳ hàng tuần trên ứng dụng Shonen Jump+ và Manga Plus.</p>
`
  }
};

console.log(`🚀 Enriching ${Object.keys(ENRICHMENTS).length} short articles with rich, comprehensive content...`);

for (const [filename, data] of Object.entries(ENRICHMENTS)) {
  const filePath = path.join(root, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Replace article body
  const bodyRegex = /<article\b[^>]*>[\s\S]*?<\/article>/i;
  if (bodyRegex.test(html)) {
    const newBody = `<article class="art-body">\n${data.body.trim()}\n</article>`;
    html = html.replace(bodyRegex, newBody);

    // Update read time if provided
    if (data.readTime) {
      html = html.replace(/<span class="am-read">[^<]*<\/span>/, `<span class="am-read">${data.readTime}</span>`);
    }

    // Clean Apple notes / Google docs garbage
    html = html.replace(/<br class="Apple-interchange-newline">/gi, '');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Enriched: ${filename}`);
  } else {
    console.warn(`⚠️ Could not find <article> in ${filename}`);
  }
}

console.log('\n✨ Batch enrichment completed successfully!');
