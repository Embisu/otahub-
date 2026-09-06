import fs from 'fs';
import path from 'path';

const stubEnrichments = {
  "chainsaw-man-reze-arc-box-office-season3.html": {
    category: "Anime",
    readTime: "6 phút đọc",
    summary: "Movie điện ảnh Chainsaw Man: The Movie – Reze Arc (Bộ Phim Bom Quỷ) chính thức cán mốc 191,4 triệu USD doanh thu phòng vé toàn cầu, trở thành hiện tượng phòng vé rực rỡ nhất năm 2026. Ngay sau thành tích kỷ lục này, studio MAPPA đã chính thức công bố sản xuất TV Anime Mùa 3 mang tên Sát Thủ Quốc Tế (International Assassins Arc).",
    body: `
<p>Kể từ ngày đầu tiên công chiếu tại các rạp chiếu phim Nhật Bản và thị trường quốc tế, <strong>Chainsaw Man: The Movie – Reze Arc</strong> (Bộ Phim Bom Quỷ) đã tạo nên một cơn địa chấn thực sự tại phòng vé toàn cầu. Theo báo cáo tài chính mới nhất do nhà phát hành TOHO và Sony Pictures Entertainment công bố, tổng doanh thu phòng vé của tác phẩm đã chính thức vượt qua cột mốc <strong>191,4 triệu USD</strong> (tương đương gần 29,8 tỷ Yên Nhật), đưa bộ phim lọt vào top những anime điện ảnh sinh lời cao nhất lịch sử.</p>

<figure><img src="/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg" alt="Chainsaw Man Reze Arc Movie MAPPA" width="1920" height="1080" fetchpriority="high" decoding="async"><figcaption>Chainsaw Man: The Movie – Reze Arc đạt doanh thu kỷ lục 191,4 triệu USD và nhận về cơn mưa lời khen từ giới phê bình toàn cầu</figcaption></figure>

<h2>1. Thành Công Vang Dội Của Movie Reze Arc Tại Phòng Vé Quốc Tế</h2>
<p>Sự kết hợp hoàn hảo giữa nhịp phim lãng mạn đầy bi kịch và những pha hành động cháy nổ đỉnh cao đã giúp <em>Reze Arc</em> chinh phục cả những khán giả khó tính nhất. Tại thị trường Bắc Mỹ, bộ phim đã xuất sắc giữ vị trí số 1 phòng vé trong hai tuần liên tiếp, vượt qua nhiều bom tấn Hollywood cùng thời điểm phát hành.</p>
<ul>
  <li><strong>Doanh Thu Bắc Mỹ & Châu Âu:</strong> Gặt hái hơn 68 triệu USD tại cụm rạp IMAX và 4DX, trở thành phim anime có doanh thu mở màn cao thứ hai lịch sử tại thị trường phương Tây.</li>
  <li><strong>Thị Trường Châu Á & Việt Nam:</strong> Phim liên tục cháy vé tại các cụm rạp lớn, tạo nên làn sóng thảo luận bùng nổ trên các mạng xã hội về chuyện tình cay đắng giữa Denji và nàng Quỷ Bom Reze.</li>
  <li><strong>Chất Lượng Hoạt Họa MAPPA:</strong> Đội ngũ hoạt họa do đạo diễn Tatsuya Yoshihara dẫn dắt đã đẩy kỹ xảo 2D kết hợp kỹ xảo ánh sáng và chất liệu nổ lên đẳng cấp màn ảnh rộng rạp chiếu chuẩn mực.</li>
</ul>

<h2>2. MAPPA Bật Đèn Xanh Cho Anime Mùa 3: International Assassins Arc</h2>
<p>Trước cơn sốt không hề hạ nhiệt của khán giả, tại sự kiện giao lưu đặc biệt tổ chức ở Tokyo, đại diện <strong>Studio MAPPA</strong> cùng tác giả <strong>Tatsuki Fujimoto</strong> đã chính thức xác nhận dự án <strong>Chainsaw Man Season 3 (TV Anime Mùa 3)</strong> đang trong quá trình sản xuất tích cực.</p>
<p>Mùa thứ 3 sẽ chuyển thể trực tiếp hồi truyện được đánh giá là đen tối và kịch tính bậc nhất nguyên tác manga: <strong>Arc Sát Thủ Quốc Tế (International Assassins Arc)</strong>. Khi bí mật về trái tim Chainsaw Man của Denji bị lộ ra toàn thế giới, các cường quốc gồm Liên Xô, Mỹ, Trung Quốc và Đức đã cử những sát thủ tinh nhuệ nhất tới Tokyo để truy lùng cậu.</p>

<h2>3. Dàn Sát Thủ Huyền Thoại Chuẩn Bị Đổ Bộ</h2>
<p>Khán giả sẽ được chứng kiến sự xuất hiện của những nhân vật cực kỳ được mong đợi:</p>
<ul>
  <li><strong>Quanxi:</strong> Thợ săn quỷ huyền thoại người Trung Quốc cùng dàn harem quỷ quyến rũ, sở hữu tốc độ chém kiếm siêu thanh.</li>
  <li><strong>Santa Claus:</strong> Kẻ điều khiển con rối bí ẩn đến từ Đức mang theo mưu đồ đánh đổi khủng khiếp với Quỷ Địa Ngục.</li>
  <li><strong>Anh Em Sát Thủ Mỹ:</strong> Bộ ba xạ thủ bất cần đời mang tới những tình huống dở khóc dở cười nhưng không kém phần tàn bạo.</li>
  <li><strong>Quỷ Bóng Tối (Darkness Devil):</strong> Phân cảnh giáng lâm của Quỷ Nguyên Thủy tại cõi Vực Sâu Địa Ngục – một trong những trường đoạn vĩ đại nhất của manga sẽ được tái hiện trọn vẹn trên màn ảnh nhỏ.</li>
</ul>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Chainsaw Man (Tatsuki Fujimoto)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Studio sản xuất:</strong><span>MAPPA</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Doanh thu Movie Reze:</strong><span>191,4 Triệu USD (Toàn cầu)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Dự án tiếp theo:</strong><span>TV Anime Season 3 (International Assassins Arc)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Dự kiến phát sóng:</strong><span>Nửa đầu năm 2027</span></div>
</div>

<p>Hãy cùng chờ đón những thông tin cập nhật tiếp theo về trailer và dàn diễn viên lồng tiếng của <em>Chainsaw Man Season 3</em> trên <a href="/anime">chuyên mục Anime của OtaHub</a>.</p>
`,
    tags: ["Chainsaw Man", "MAPPA", "Reze Arc", "Denji", "Tatsuki Fujimoto", "Anime Movie", "Anime 2026"]
  },

  "jujutsu-kaisen-season-3-culling-game-release.html": {
    category: "Anime",
    readTime: "7 phút đọc",
    summary: "Studio MAPPA chính thức ấn định kế hoạch phát sóng Jujutsu Kaisen Season 3: Tử Diệt Hồi Du (Culling Game Arc). Siêu phẩm shonen tiếp tục nâng tầm hoạt họa với các trận tử chiến ma thuật đẫm máu của dàn Chú thuật sư thế hệ mới.",
    body: `
<p>Sau khi khép lại mùa 2 <em>Biến Cố Shibuya</em> đầy bi tráng và nước mắt, <strong>Studio MAPPA</strong> cùng ban điều hành thương hiệu <strong>Jujutsu Kaisen (Chú Thuật Hồi Chiến)</strong> đã chính thức công bố những thông tin chi tiết đầu tiên về <strong>Mùa 3: Tử Diệt Hồi Du (Culling Game Arc)</strong>.</p>

<figure><img src="/assets/img/news-jujutsu-kaisen-season3-culling-game.jpg" alt="Jujutsu Kaisen Season 3 Culling Game MAPPA" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Teaser Visual Jujutsu Kaisen Mùa 3 hé lộ chiến trường sinh tử đẫm máu Tử Diệt Hồi Du do Kenjaku thiết lập</figcaption></figure>

<h2>1. Bối Cảnh Hỗn Loạn Sau Biến Cố Shibuya & Luật Chơi Tử Diệt Hồi Du</h2>
<p>Nước Nhật rơi vào tình trạng tê liệt hoàn toàn khi hàng triệu nguyền hồn tràn ra khắp các đô thị lớn. Tên nguyền sư cổ đại <strong>Kenjaku</strong> (trong thể xác của Suguru Geto) đã kích hoạt nghi thức <strong>Tử Diệt Hồi Du (Culling Game)</strong> — một trò chơi sinh tử quy mô toàn quốc ép buộc các Chú thuật sư hiện đại và những nguyền sư tái sinh từ quá khứ phải chém giết lẫn nhau để tích lũy điểm số.</p>
<ul>
  <li><strong>Mục Đích Của Kenjaku:</strong> Tích tụ năng lượng nguyền rủa khổng lồ từ cái chết của hàng nghìn đấu thủ nhằm ép buộc sự tiến hóa của toàn bộ nhân loại Nhật Bản với Đại nguyền hồn Tengen.</li>
  <li><strong>Thế Tiến Thoái Lưỡng Nan Của Yuji & Megumi:</strong> Bộ đôi phải dấn thân vào các kết giới đẫm máu ở Tokyo và Sendai để tìm kiếm 100 điểm, nhằm ban hành luật mới giải cứu Fushiguro Tsumiki và tìm cách giải phong ấn cho thầy Gojo Satoru từ Ngục Môn Cương.</li>
</ul>

<h2>2. Sự Xuất Hiện Của Dàn Nhân Vật Mới Đỉnh Cao</h2>
<p>Mùa 3 sẽ là sân khấu phô diễn sức mạnh của những nhân vật được bạn đọc manga vô cùng yêu thích:</p>
<ul>
  <li><strong>Hakari Kinji:</strong> Học sinh năm 3 trường Cao đẳng Chú thuật Tokyo với Bành Trướng Lãnh Địa mang phong cách Pachinko cờ bạc độc nhất vô nhị — sở hữu khả năng bất tử vô hạn trong 4 phút 11 giây khi trúng Jackpot.</li>
  <li><strong>Higuruma Hiromi:</strong> Luật sư thiên tài tự thức tỉnh thuật thức Thẩm Phán và Chiếc Búa Công Lý, tạo nên một trong những trận đấu trí và cảm xúc sâu sắc nhất với Itadori Yuji.</li>
  <li><strong>Kashimo Hajime:</strong> Thần Sấm cổ đại 400 năm trước tái sinh với khao khát duy nhất: thách thức và đánh bại Sukuna. Trận quyết đấu giữa Kashimo và Hakari được hứa hẹn sẽ là đỉnh cao diễn hoạt của MAPPA.</li>
  <li><strong>Okkotsu Yuta Trở Lại:</strong> Đặc cấp Yuta chính thức thị phạm sức mạnh áp đảo tại Sendai Colony khi một mình cân cả bốn thế lực nguyền sư sừng sỏ.</li>
</ul>

<h2>3. Cam Kết Cải Thiện Môi Trường Sản Xuất Của MAPPA</h2>
<p>Rút kinh nghiệm sâu sắc từ những áp lực tiến độ gắt gao ở Mùa 2, MAPPA khẳng định đội ngũ sản xuất Mùa 3 được phân bổ thời gian phát triển dài hơn, đảm bảo chất lượng hoạt họa đồng đều từ tập đầu tiên đến tập cuối cùng mà không làm kiệt sức các họa sĩ.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tên dự án:</strong><span>Jujutsu Kaisen Season 3 (Tử Diệt Hồi Du)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Studio thực hiện:</strong><span>MAPPA</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Đạo diễn:</strong><span>Shota Goshozono</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nội dung trọng tâm:</strong><span>Culling Game Arc (Tokyo No.1 & No.2, Sendai Colony)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Kênh phát sóng:</strong><span>MBS/TBS, Crunchyroll, Netflix</span></div>
</div>

<p>Theo dõi liên tục các tin tức nóng hổi về ngày giờ chiếu chính xác tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`,
    tags: ["Jujutsu Kaisen", "MAPPA", "Culling Game", "Itadori Yuji", "Hakari Kinji", "Gojo Satoru", "Anime 2026"]
  },

  "call-of-duty-modern-warfare-4-gamescom-playable.html": {
    category: "Gaming",
    readTime: "6 phút đọc",
    summary: "Activision và Infinity Ward mang tới Gamescom bản demo chơi thử độc quyền của Call of Duty: Modern Warfare 4, phô diễn sức mạnh đồ họa IW Engine 10.0 cùng cơ chế tác chiến co-op chiến thuật thế hệ mới.",
    body: `
<p>Tại kỳ hội chợ triển lãm game lớn nhất hành tinh <strong>Gamescom</strong>, gian hàng của Activision đã trở thành tâm điểm thu hút hàng chục nghìn lượt game thủ xếp hàng trải nghiệm khi lần đầu tiên cho phép người chơi trực tiếp cầm tay bản demo chơi thử của <strong>Call of Duty: Modern Warfare 4 (MW4)</strong>.</p>

<figure><img src="/assets/img/news-call-of-duty-mw4-gamescom.jpg" alt="Call of Duty Modern Warfare 4 Demo Gamescom" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-wuthering-waves-black-shores-shorekeeper.jpg'"><figcaption>Gian hàng trải nghiệm Call of Duty: Modern Warfare 4 tại Gamescom 2026 với đồ họa chân thực đến ngỡ ngàng</figcaption></figure>

<h2>1. Đồ Họa Đột Phá Với Bộ Công Cụ IW Engine 10.0</h2>
<p>Được xây dựng trên phiên bản nâng cấp toàn diện <strong>IW Engine 10.0</strong>, Modern Warfare 4 mang đến bước nhảy vọt chưa từng có về mặt thị giác cho dòng game bắn súng góc nhìn thứ nhất (FPS):</p>
<ul>
  <li><strong>Hệ Thống Ánh Sáng Ray Tracing Toàn Phần:</strong> Tái hiện chuẩn xác ánh sáng phản chiếu từ kính ngắm quang học, tia lửa đầu nòng súng trong đêm tối và sương mù khói đạn dày đặc.</li>
  <li><strong>Vật Lý Phá Hủy Môi Trường (Dynamic Destruction):</strong> Người chơi có thể bắn xuyên thủng các bức tường mỏng, phá hủy các chốt cửa bằng thuốc nổ C4 hoặc bắn vỡ đèn chiếu sáng để tạo bóng tối phục kích đối phương.</li>
  <li><strong>Âm Thanh Không Gian 3D (Spatial Audio 2.0):</strong> Tiếng vỏ đạn rơi leng keng trên sàn bê tông, tiếng bước chân đối thủ trên gác xép được định vị chính xác tuyệt đối theo thời gian thực.</li>
</ul>

<h2>2. Chế Độ Chiến Dịch Co-op Tác Chiến Phi Đối Xứng</h2>
<p>Bản demo tại Gamescom cho phép người chơi trải nghiệm màn chơi mang tên <em>'Operation Nightfall'</em>, nơi <strong>Captain Price</strong> và <strong>Ghost</strong> dẫn đầu lực lượng đặc nhiệm Task Force 141 đột kích vào một tổ hợp boongke ngầm quân sự ở Đông Âu.</p>
<p>Khác với các phiên bản trước vốn nặng tính tuyến tính kịch bản sắp đặt sẵn (scripted), MW4 cho phép 4 người chơi phối hợp tự do tiếp cận mục tiêu từ nhiều hướng: một nhóm đột kích bằng dù lượn từ trên cao, nhóm còn lại lặn qua đường ống thoát nước để cắt nguồn điện tổng.</p>

<h2>3. Nâng Cấp Hệ Thống Gunsmith & Tối Ưu Đa Nền Tảng</h2>
<p>Hệ thống tùy biến vũ khí <strong>Gunsmith 3.0</strong> được đại tu toàn diện, cho phép tinh chỉnh từng chi tiết từ khóa nòng, chụp bù giật cho tới loại ngòi đạn nổ chậm. Infinity Ward xác nhận game sẽ hỗ trợ đầy đủ tính năng Cross-Play và Cross-Progression mượt mà trên PC, PS5 và Xbox Series X.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Call of Duty: Modern Warfare 4</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>Infinity Ward / Raven Software</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát hành:</strong><span>Activision / Xbox Game Studios</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Engine:</strong><span>IW Engine 10.0</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Nền tảng:</strong><span>PC (Steam/Battle.net), PS5, Xbox Series X/S</span></div>
</div>

<p>Khám phá thêm các tin tức eSports và game bắn súng hấp dẫn tại <a href="/gaming">chuyên mục Gaming OtaHub</a>.</p>
`,
    tags: ["Call of Duty", "Modern Warfare 4", "Activision", "Gamescom", "FPS", "Task Force 141", "Gaming 2026"]
  },

  "gamescom-2026-playstation-highlights.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Tổng hợp toàn bộ các công bố bom tấn của Sony PlayStation tại Gamescom: Marvel's Wolverine lộ gameplay tàn khốc, Ghost of Yotei khoe đồ họa ngoạn mục và loạt tính năng nâng tầm cho cỗ máy PS5 Pro.",
    body: `
<p>Sự kiện thường niên <strong>Gamescom</strong> đã chứng kiến sự bùng nổ vượt bậc của <strong>Sony Interactive Entertainment (PlayStation)</strong> khi hãng mang tới một chuỗi công bố liên hoàn làm nức lòng hàng triệu tín đồ console trên khắp thế giới.</p>

<figure><img src="/assets/img/news-gamescom-playstation-showcase.jpg" alt="PlayStation Showcase Gamescom Highlights" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-frieren-season-2-official-visual.jpg'"><figcaption>PlayStation khuấy đảo Gamescom 2026 với hàng loạt tựa game đỉnh cao khai thác sức mạnh phần cứng mới</figcaption></figure>

<h2>1. Marvel's Wolverine: Màn Trình Diễn Gameplay Đẫm Máu Đẳng Cấp 18+</h2>
<p>Tâm điểm không thể bàn cãi của đêm hội chính là đoạn video gameplay kéo dài 8 phút của <strong>Marvel's Wolverine</strong> đến từ Insomniac Games. Khác với phong cách tươi sáng của Spider-Man, Wolverine mang màu sắc gai góc, chân thực và đậm chất bạo lực:</p>
<ul>
  <li><strong>Cơ Chế Phản Đòn & Vuốt Adamantium:</strong> Logan có thể chặt đứt các vật cản, phản đòn chớp nhoáng và thực hiện các đòn kết liễu tàn nhẫn trên địa hình rừng tuyết Canada.</li>
  <li><strong>Khả Năng Hồi Phục Vết Thương (Healing Factor):</strong> Vết đạn bắn và vết chém trên cơ thể Logan liền da trực quan ngay trong thời gian thực nhờ công nghệ đồ họa thế hệ mới.</li>
</ul>

<h2>2. Ghost of Yotei: Đồ Họa Tuyệt Mỹ Xứ Sở Phù Tang</h2>
<p>Sucker Punch Productions khiến cả khán phòng trầm trồ với những thước phim mới nhất về <strong>Ghost of Yotei</strong>. Lấy bối cảnh vùng đất hoang sơ quanh ngọn núi Yotei hùng vĩ ở Ezo (Hokkaido ngày nay), trò chơi mang lại cảm giác điện ảnh đậm phong cách Kurosawa với những cánh đồng hoa rực rỡ, bão tuyết cuồng nộ và hệ thống song kiếm điêu luyện của nữ kiếm sĩ Atsu.</p>

<h2>3. PS5 Pro & Công Nghệ Siêu Phân Giải PSSR Khẳng Định Vị Thế</h2>
<p>Sony đã dành thời lượng quan trọng để trình diễn năng lực xử lý vượt trội của <strong>PS5 Pro</strong> khi chạy các tựa game bom tấn thế giới mở. Nhờ công nghệ trí tuệ nhân tạo <strong>PSSR (PlayStation Spectral Super Resolution)</strong>, toàn bộ các tựa game được giới thiệu đều đạt chuẩn hình ảnh 4K sắc nét ở tốc độ khung hình 60 đến 120 FPS ổn định mà không bị giảm độ chi tiết.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Sự kiện:</strong><span>Gamescom PlayStation Showcase</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game tiêu điểm:</strong><span>Marvel's Wolverine, Ghost of Yotei, Death Stranding 2</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Phần cứng nổi bật:</strong><span>PlayStation 5 Pro & DualSense Edge New Colorways</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Công nghệ then chốt:</strong><span>PSSR AI Upscaling, Advanced Ray Tracing</span></div>
</div>

<p>Xem thêm các bài đánh giá console và thiết bị chơi game tại <a href="/gaming">OtaHub Gaming Hub</a>.</p>
`,
    tags: ["PlayStation", "PS5 Pro", "Gamescom", "Sony", "Marvel's Wolverine", "Ghost of Yotei", "Gaming 2026"]
  },

  "one-piece-chapter-1193-loki-elbaf.html": {
    category: "Manga",
    readTime: "6 phút đọc",
    summary: "One Piece Chapter 1193: Đại chiến tại Vương quốc Người Khổng Lồ Elbaf bùng nổ khi Hoàng tử Bị Xích Loki chính thức bộc lộ dã tâm và sức mạnh của Trái Ác Quỷ Thần Thoại cổ đại.",
    body: `
<p>Chương 1193 của siêu phẩm manga <strong>One Piece</strong> do đại tác giả <strong>Eiichiro Oda</strong> chắp bút tiếp tục đẩy nhịp độ câu chuyện tại đảo <strong>Elbaf</strong> lên đỉnh điểm cao trào, khi bức màn bí mật về Hoàng tử Nguyền Rủa <strong>Loki</strong> cùng kho báu thần thoại của xứ sở Người Khổng Lồ dần được hé lộ.</p>

<figure><img src="/assets/img/news-one-piece-chapter-1193-elbaf-loki.jpg" alt="One Piece Chapter 1193 Loki Elbaf" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Hoàng tử Loki đối mặt Luffy trong tình thế bị giam cầm dưới tầng sâu địa ngục Băng Elbaf</figcaption></figure>

<h2>1. Cuộc Đối Thoại Định Mệnh Giữa Luffy & Hoàng Tử Bị Xích Loki</h2>
<p>Sau khi tách khỏi nhóm Nami và Zoro, <strong>Luffy</strong> đã vô tình lạc xuống vùng lãnh nguyên băng giá nằm sâu dưới gốc đại thụ Thế Giới Yggdrasil. Tại đây, cậu chạm trán <strong>Loki</strong> — kẻ đang bị trói chặt bởi những sợi xích Đá Biển khổng lồ có khắc đầy cổ tự Poneglyph.</p>
<ul>
  <li><strong>Thân Thế Của Loki:</strong> Kẻ đã sát hại chính phụ vương để cướp lấy Trái Ác Quỷ Truyền Thuyết được gia tộc hoàng gia Elbaf canh giữ suốt 800 năm.</li>
  <li><strong>Thỏa Thuận Với Thần Mặt Trời:</strong> Loki nhận ra sự hiện diện của nhịp trống Nika từ tim Luffy và đưa ra lời đề nghị liên minh trao đổi: tự do của hắn để đổi lấy bí mật về địa điểm cất giữ Vũ Khí Cổ Đại Uranus.</li>
</ul>

<h2>2. Năng Lực Trái Ác Quỷ Thần Thoại Của Loki</h2>
<p>Những trang truyện hồi tưởng đã hé lộ thoáng qua sức mạnh hủy diệt của Loki khi biến hình. Không giống như người khổng lồ bình thường, Loki sở hữu khả năng thao túng thời tiết băng giá và sấm sét đen cực độ, khiến ngay cả những chiến binh dũng mãnh nhất như Dorry và Brogy cũng phải e dè.</p>

<h2>3. Nhóm Mũ Rơm & Hiểm Họa Từ Thánh Địa Mary Geoise</h2>
<p>Ở một diễn biến song song, nhóm của Robin và Chopper phát hiện thư viện cổ tại lâu đài Elbaf lưu trữ những ghi chép cổ xưa về trận đại chiến giữa Liên Minh 20 Vương Quốc và Vương Quốc Cổ Đại. Cùng lúc đó, các tàu chiến của Chính Phủ Thế Giới mang cờ hiệu của Ngũ Lão Tinh mới đã bắt đầu xuất hiện ngoài khơi biển Elbaf.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Chương truyện:</strong><span>One Piece Chapter 1193</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác giả:</strong><span>Eiichiro Oda</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tạp chí:</strong><span>Weekly Shonen Jump (Shueisha)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Arc truyện:</strong><span>Elbaf Arc (Saga Cuối Cùng)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tâm điểm:</strong><span>Hoàng tử Loki, Luffy Nika, Bí ẩn Cây Thế Giới</span></div>
</div>

<p>Đọc thêm các bài phân tích spoiler và giả thuyết One Piece mới nhất trên <a href="/manga">chuyên mục Manga OtaHub</a>.</p>
`,
    tags: ["One Piece", "Eiichiro Oda", "Elbaf Arc", "Loki", "Luffy", "Nika", "Manga 2026"]
  },

  "seven-seas-18-licenses-anime-nyc-2026.html": {
    category: "Manga",
    readTime: "5 phút đọc",
    summary: "Seven Seas Entertainment công bố 18 bản quyền manga, light novel và webcomic đình đám tại Anime NYC, mở rộng mạnh mẽ kho tàng truyện dịch chất lượng cao sang năm 2027.",
    body: `
<p>Tại sự kiện <strong>Anime NYC</strong>, nhà xuất bản Bắc Mỹ <strong>Seven Seas Entertainment</strong> đã có một buổi công bố bản quyền bùng nổ khi mang về giấy phép phát hành tiếng Anh cho <strong>18 đầu truyện mới</strong>, trải dài từ thể loại Dark Fantasy, Isekai, Khoa học viễn tưởng cho tới các tác phẩm lãng mạn đời thường.</p>

<figure><img src="/assets/img/news-seven-seas-anime-nyc.jpg" alt="Seven Seas Licenses Anime NYC" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-frieren-season-2-official-visual.jpg'"><figcaption>Seven Seas tiếp tục khẳng định vị thế nhà phát hành manga/light novel độc lập hàng đầu Bắc Mỹ</figcaption></figure>

<h2>1. Dàn Tác Phẩm Nổi Bật Được Mua Bản Quyền</h2>
<p>Trong số 18 tác phẩm vừa được công bố, có nhiều cái tên nhận được sự quan tâm khổng lồ từ cộng đồng độc giả:</p>
<ul>
  <li><strong>Những Tác Phẩm Fantasy U Tối:</strong> Dòng tiểu thuyết chuyển sinh với phong cách sinh tồn khắc nghiệt và thế giới quan phức tạp được Seven Seas đặc biệt chú trọng đầu tư dịch thuật.</li>
  <li><strong>Manga Lãng Mạn & Slice-of-Life:</strong> Các bộ truyện tranh học đường đời thường nhẹ nhàng với nét vẽ thanh thoát, giàu cảm xúc đã chiếm được cảm tình của đông đảo bạn đọc trẻ.</li>
  <li><strong>Dòng Ấn Phẩm Bìa Cứng Đặc Biệt (Hardcover Deluxe):</strong> Seven Seas xác nhận sẽ phát hành các phiên bản sách sưu tầm khổ lớn in màu toàn bộ cho một số bộ truyện ăn khách.</li>
</ul>

<h2>2. Cam Kết Chất Lượng Dịch Thuật & Bản In Chuẩn Quốc Tế</h2>
<p>Đại diện Seven Seas khẳng định toàn bộ các tác phẩm đều được đội ngũ biên dịch viên giàu kinh nghiệm chuyển ngữ sát nguyên tác tiếng Nhật, giữ nguyên các thuật ngữ văn hóa đặc trưng và được kiểm duyệt kỹ lưỡng trước khi in ấn.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà xuất bản:</strong><span>Seven Seas Entertainment</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Sự kiện:</strong><span>Anime NYC Industry Panel</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Số lượng tác phẩm:</strong><span>18 tựa Manga, Light Novel & Webcomic</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Thời gian phát hành:</strong><span>Từ Quý 1/2027</span></div>
</div>

<p>Cập nhật thêm các tin tức xuất bản truyện tranh quốc tế tại <a href="/manga">OtaHub Manga</a>.</p>
`,
    tags: ["Seven Seas", "Manga", "Light Novel", "Anime NYC", "Bản Quyền Manga", "Otaku Culture"]
  },

  "vct-champions-2026-prx-sentinels.html": {
    category: "Gaming",
    readTime: "6 phút đọc",
    summary: "Trận đại chiến kịch tính tại VCT Champions giữa Paper Rex và Sentinels: Lối chơi W-Gaming áp đảo của PRX đối đầu chiến thuật kiểm soát chuẩn mực của Sentinels trên các map Sunset và Lotus.",
    body: `
<p>Nhà thi đấu thể thao điện tử tại <strong>VCT Champions</strong> đã thực sự bùng nổ trong trận tứ kết nhánh thắng giữa hai đội tuyển sở hữu lượng người hâm mộ đông đảo nhất hành tinh: <strong>Paper Rex (PRX)</strong> đại diện cho khu vực Thái Bình Dương (APAC) và <strong>Sentinels (SEN)</strong> lá cờ đầu của Châu Mỹ (Americas).</p>

<figure><img src="/assets/img/news-vct-champions-prx-sentinels.jpg" alt="VCT Champions Paper Rex vs Sentinels" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-call-of-duty-mw4-gamescom.jpg'"><figcaption>Trận thư hùng mãn nhãn cống hiến những pha highlight kinh điển giữa PRX và Sentinels</figcaption></figure>

<h2>1. Map 1 Sunset: W-Gaming Rực Lửa Đốt Cháy Hàng Phòng Ngự</h2>
<p>Lựa chọn map Sunset của Paper Rex đã biến trận đấu thành một màn biểu diễn tốc độ. Bộ đôi song sát <strong>jinggg</strong> với Raze và <strong>something</strong> cầm Yoru liên tục thực hiện những pha entry chớp nhoáng xé toang bombsite của Sentinels. Lối đánh đẩy người không ngần ngại giao tranh trực diện giúp PRX vươn lên dẫn trước với tỷ số nghẹt thở 13-11.</p>

<h2>2. Map 2 Lotus: Đẳng Cấp Bản Lĩnh Của Sentinels</h2>
<p>Bước sang map Lotus do Sentinels lựa chọn, trận đấu đảo chiều khi đội trưởng <strong>johnqt</strong> đọc bài hoàn hảo các đợt tấn công của đối thủ. Khả năng kê tâm chính xác và những tình huống clutch 1v2 điềm tĩnh của <strong>TenZ</strong> ở vị trí Omen đã giúp đại diện Bắc Mỹ quân bình tỷ số 1-1 sau hiệp đấu phụ OT đầy căng thẳng.</p>

<h2>3. Tương Lai Nhánh Đấu Tại VCT Champions</h2>
<p>Trận đấu không chỉ đem lại bữa tiệc mãn nhãn cho người hâm mộ thể thao điện tử mà còn là minh chứng cho sự thu hẹp khoảng cách trình độ giữa các khu vực VALORANT lớn trên thế giới.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Giải đấu:</strong><span>VALORANT Champions Tour (VCT)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Cặp trận:</strong><span>Paper Rex vs Sentinels</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>VALORANT (Riot Games)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Map thi đấu:</strong><span>Sunset, Lotus, Haven</span></div>
</div>

<p>Theo dõi bảng xếp hạng và lịch thi đấu Esports mới nhất trên <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["VCT Champions", "Valorant", "Esports", "Paper Rex", "Sentinels", "Riot Games", "Gaming 2026"]
  },

  "jujutsu-kaisen-juju-fes-2026-anniversary.html": {
    category: "Anime",
    readTime: "5 phút đọc",
    summary: "Đại sự kiện Juju Fes kỷ niệm 5 năm phát sóng anime Jujutsu Kaisen tại Tokyo Dome: Dàn diễn viên lồng tiếng tri ân người hâm mộ và công bố loạt sản phẩm kỷ niệm giới hạn.",
    body: `
<p>Hơn 50.000 khán giả đã phủ kín khán đài sân vận động Tokyo Dome trong khuôn khổ đại sự kiện thường niên <strong>Juju Fes</strong>, đánh dấu cột mốc tròn 5 năm kể từ ngày tập phim đầu tiên của <strong>Jujutsu Kaisen (Chú Thuật Hồi Chiến)</strong> lên sóng truyền hình.</p>

<figure><img src="/assets/img/news-jujutsu-kaisen-juju-fes.jpg" alt="Jujutsu Kaisen Juju Fes Tokyo Dome" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Dàn seiyuu hàng đầu hội ngộ trong ngày hội tri ân khán giả Juju Fes đầy cảm xúc</figcaption></figure>

<h2>1. Khoảnh Khắc Xúc Động Của Dàn Diễn Viên Lồng Tiếng (Seiyuu)</h2>
<p>Sự kiện quy tụ đầy đủ các diễn viên lồng tiếng linh hồn của bộ phim: <strong>Junya Enoki</strong> (Itadori Yuji), <strong>Yuma Uchida</strong> (Fushiguro Megumi), <strong>Asami Seto</strong> (Kugisaki Nobara), <strong>Yuichi Nakamura</strong> (Gojo Satoru) và <strong>Kenjiro Tsuda</strong> (Nanami Kento). Dàn nghệ sĩ đã trực tiếp diễn lại những phân đoạn kịch tính nhất của mùa Biến Cố Shibuya kèm dàn nhạc giao hưởng trực tiếp.</p>

<h2>2. Công Bố Triển Lãm Nghệ Thuật & Bản Giao Hưởng Đặc Biệt</h2>
<p>Ban tổ chức thông báo chuỗi triển lãm nghệ thuật quy mô lớn với các bản phác thảo vẽ tay nguyên bản của đạo diễn và họa sĩ MAPPA sẽ được tổ chức lưu diễn qua 5 thành phố lớn tại Nhật Bản và Châu Á.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Sự kiện:</strong><span>Juju Fes 5th Anniversary Special</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Địa điểm:</strong><span>Tokyo Dome, Nhật Bản</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Khách mời:</strong><span>Junya Enoki, Yuichi Nakamura, Kenjiro Tsuda...</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tổ chức:</strong><span>TOHO Animation / Studio MAPPA</span></div>
</div>

<p>Khám phá thêm các tin tức hậu trường anime tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`,
    tags: ["Jujutsu Kaisen", "Juju Fes", "MAPPA", "Seiyuu", "Gojo Satoru", "Anime 2026"]
  },

  "marvel-rivals-endgame-encore-update.html": {
    category: "Gaming",
    readTime: "6 phút đọc",
    summary: "Marvel Rivals tung bản cập nhật Endgame Encore: Bổ sung Thanos vào nhóm Vanguard, làm lại chiêu thức của Thor và ra mắt bản đồ tàn tích Avengers Compound.",
    body: `
<p>Tựa game bắn súng anh hùng 6v6 miễn phí đang làm mưa làm gió toàn cầu <strong>Marvel Rivals</strong> do NetEase Games phát triển vừa chính thức phát hành bản cập nhật quy mô lớn mang tên <strong>Endgame Encore</strong>, mang tới hàng loạt nội dung hấp dẫn lấy cảm hứng từ vũ trụ điện ảnh Marvel.</p>

<figure><img src="/assets/img/news-marvel-rivals-endgame-update.jpg" alt="Marvel Rivals Endgame Encore Update" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-call-of-duty-mw4-gamescom.jpg'"><figcaption>Thanos và các siêu anh hùng Marvel hội ngộ trong bản cập nhật mùa mới rực lửa của Marvel Rivals</figcaption></figure>

<h2>1. Thanos Gia Nhập Nhóm Đỡ Đòn Vanguard Với Găng Tay Vô Cực</h2>
<p>Bản cập nhật đánh dấu sự ra mắt của Đại Titan <strong>Thanos</strong>. Sở hữu lượng máu dồi dào cùng khả năng kích hoạt sức mạnh của từng Viên Đá Vô Cực:</p>
<ul>
  <li><strong>Đá Sức Mạnh (Power Stone):</strong> Bắn ra chùm tia năng lượng xuyên thấu phá hủy các lá chắn phòng thủ của đối phương.</li>
  <li><strong>Đá Không Gian (Space Stone):</strong> Tạo hố đen hút đối thủ lại gần để đồng đội phối hợp dồn sát thương kết liễu.</li>
  <li><strong>Đòn Tối Thượng 'The Snap':</strong> Thanos búng tay làm suy giảm 50% chỉ số hồi máu và tốc độ di chuyển của toàn bộ đội hình đối phương trong phạm vi ảnh hưởng.</li>
</ul>

<h2>2. Bản Đồ Mới & Tinh Chỉnh Cân Bằng Meta</h2>
<p>Bản đồ mới <em>Avengers Compound Ruins</em> tái hiện khung cảnh đổ nát sau trận chiến lịch sử với nhiều địa hình cao thấp cho các tướng cơ động như Spider-Man, Iron Man và Magneto thỏa sức phô diễn kỹ năng.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Marvel Rivals</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>NetEase Games / Marvel Games</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tướng mới:</strong><span>Thanos (Vanguard Class)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Nền tảng:</strong><span>PC, PlayStation 5, Xbox Series X/S</span></div>
</div>

<p>Đọc thêm các bản tin hướng dẫn game và meta tướng tại <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["Marvel Rivals", "NetEase", "Marvel Games", "Hero Shooter", "Thanos", "Avengers", "Gaming 2026"]
  },

  "one-piece-god-valley-baad-films-announced.html": {
    category: "Anime",
    readTime: "7 phút đọc",
    summary: "Toei Animation và tác giả Eiichiro Oda công bố dự án anime điện ảnh về Biến cố đảo Thần God Valley: Cuộc đối đầu lịch sử giữa băng Rocks, Garp và Roger.",
    body: `
<p>Tại ngày hội Jump Festa đặc biệt, <strong>Toei Animation</strong> cùng tác giả <strong>Eiichiro Oda</strong> đã khiến toàn thể cộng đồng người hâm mộ <strong>One Piece</strong> bùng nổ khi chính thức công bố dự án phim hoạt hình điện ảnh chiếu rạp tái hiện lại sự kiện lịch sử 38 năm trước: <strong>Biến Cố Đảo Thần God Valley (The Battle of God Valley)</strong>.</p>

<figure><img src="/assets/img/news-one-piece-god-valley-movie.jpg" alt="One Piece God Valley Movie Announcement" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Trận chiến huyền thoại đảo God Valley sẽ chính thức bước lên màn ảnh rộng với kỹ xảo đỉnh cao</figcaption></figure>

<h2>1. Trận Thư Hùng Vĩ Đại Nhất Thời Đại Hải Tặc</h2>
<p>God Valley là nơi hội tụ của những nhân vật huyền thoại mạnh nhất trong toàn bộ lịch sử One Piece:</p>
<ul>
  <li><strong>Băng Hải Tặc Rocks:</strong> Thuyền trưởng khét tiếng <strong>Rocks D. Xebec</strong> dẫn đầu đội hình quái vật gồm Râu Trắng Edward Newgate thời trẻ, Kaido, Big Mom Charlotte Linlin và Sư Tử Vàng Shiki.</li>
  <li><strong>Liên Minh Bất Đắc Dĩ:</strong> Anh hùng Hải quân <strong>Monkey D. Garp</strong> bắt tay cùng Vua Hải Tặc tương lai <strong>Gol D. Roger</strong> để bảo vệ các nô lệ và ngăn chặn âm mưu lật đổ thế giới của Rocks.</li>
  <li><strong>Bí Mật Gia Tộc Figarland:</strong> Tiết lộ thời hoàng kim của Thánh Figarland Garling và nguồn gốc đứa trẻ sơ sinh Shanks Tóc Đỏ được Roger tìm thấy trong rương báu.</li>
</ul>

<h2>2. Oda Đích Thân Giám Sát Kịch Bản</h2>
<p>Eiichiro Oda xác nhận ông sẽ đảm nhận vai trò Tổng giám đốc sản xuất kiêm cố vấn nội dung, bổ sung những mảnh ghép lịch sử chưa từng được vẽ trong manga để đem đến một tác phẩm trọn vẹn và hoành tráng nhất.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Dự án:</strong><span>One Piece: God Valley The Movie</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Sản xuất:</strong><span>Toei Animation / Shueisha</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Giám sát kịch bản:</strong><span>Eiichiro Oda</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Dự kiến ra rạp:</strong><span>Mùa hè 2027</span></div>
</div>

<p>Theo dõi mọi tin tức mới nhất về One Piece tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`,
    tags: ["One Piece", "God Valley", "Eiichiro Oda", "Toei Animation", "Rocks D. Xebec", "Gol D. Roger", "Anime Movie"]
  },

  "one-punch-man-murata-son-bodybuilder-cover.html": {
    category: "Manga",
    readTime: "5 phút đọc",
    summary: "Họa sĩ Yusuke Murata trình làng trang bìa mới ấn tượng cho One Punch Man, đồng thời chia sẻ về những công đoạn hoàn thiện hoạt họa cho anime Mùa 3.",
    body: `
<p>Họa sĩ thiên tài <strong>Yusuke Murata</strong> lại một lần nữa khiến cộng đồng manga trầm trồ khi công bố hình ảnh trang bìa và tranh minh họa đôi cho tập truyện mới của <strong>One Punch Man</strong>, khoe trọn nét vẽ giải phẫu cơ bắp đỉnh cao và kỹ năng xử lý góc nhìn phối cảnh siêu việt.</p>

<figure><img src="/assets/img/news-one-punch-man-murata-art.jpg" alt="One Punch Man Yusuke Murata Cover Art" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Trang bìa mới của One Punch Man với nét vẽ chi tiết đến từng thớ cơ bắp của Yusuke Murata</figcaption></figure>

<h2>1. Nét Vẽ Đỉnh Cao Của Họa Sĩ Yusuke Murata</h2>
<p>Mỗi trang vẽ của Murata luôn được coi là chuẩn mực nghệ thuật trong làng manga shonen hiện đại. Trong tập mới, hình ảnh nhân vật Siêu Hợp Kim Đen Bóng (Superalloy Darkshine), Garou và Saitama được khắc họa sống động với độ chi tiết kinh ngạc.</p>

<h2>2. Tiến Độ Hoạt Họa Anime One Punch Man Mùa 3</h2>
<p>Bên cạnh công việc vẽ truyện tranh, Murata cũng chia sẻ ông đang tích cực tham gia vào ban cố vấn hoạt họa cho <strong>One Punch Man Season 3</strong> do studio <strong>J.C.Staff</strong> đảm nhiệm, cam kết các phân cảnh giao tranh ác liệt của dàn Quái Nhân Cấp Dragon sẽ được chuyển thể trung thực và mượt mà.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>One Punch Man</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Họa sĩ:</strong><span>Yusuke Murata</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác giả gốc:</strong><span>ONE</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tạp chí:</strong><span>Tonari no Young Jump (Shueisha)</span></div>
</div>

<p>Đọc thêm các bài viết chuyên sâu về manga tại <a href="/manga">OtaHub Manga</a>.</p>
`,
    tags: ["One Punch Man", "Yusuke Murata", "Saitama", "Garou", "Manga", "JC Staff"]
  },

  "sekiro-no-defeat-anime-release.html": {
    category: "Anime",
    readTime: "6 phút đọc",
    summary: "Siêu phẩm hành động Sekiro: Shadows Die Twice chính thức được chuyển thể thành Anime mang tên Sekiro: No Defeat, do Kadokawa và FromSoftware phối hợp sản xuất.",
    body: `
<p>Sau nhiều năm mong mỏi của cộng đồng game thủ, kiệt tác giành giải Game of the Year <strong>Sekiro: Shadows Die Twice</strong> của <strong>FromSoftware</strong> và giám đốc <strong>Hidetaka Miyazaki</strong> đã chính thức được chuyển thể thành series anime truyền hình với tên gọi <strong>Sekiro: No Defeat</strong>.</p>

<figure><img src="/assets/img/news-sekiro-anime-announcement.jpg" alt="Sekiro No Defeat Anime Announcement" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-frieren-season-2-official-visual.jpg'"><figcaption>Sekiro: No Defeat tái hiện hành trình kiếm khách Sengoku bi tráng và u tối dưới định dạng hoạt họa đỉnh cao</figcaption></figure>

<h2>1. Tái Hiện Kiếm Pháp Sengoku & Bi Kịch Huyết Thống Bất Tử</h2>
<p>Bộ phim xoay quanh hành trình trung thành của kiếm sĩ mang cánh tay giả <strong>Wolf (Sói Đơn Độc)</strong> trong nỗ lực giải cứu Chúa tể nhỏ tuổi Kuro khỏi bàn tay gia tộc Ashina đang suy tàn. Những màn chạm kiếm nảy lửa, kỹ năng đỡ đòn Mikiri Counter và cánh tay sắt thần kỳ sẽ được biên đạo sống động theo phong cách hoạt họa 2D truyền thống kết hợp góc quay điện ảnh.</p>

<h2>2. Sự Giám Sát Của FromSoftware & Đội Ngũ Kỳ Cựu</h2>
<p>FromSoftware xác nhận sẽ trực tiếp tham gia thẩm định tạo hình nhân vật, thế giới quan chùa Senpou u linh cũng như phần lồng tiếng của các diễn viên gốc nhằm giữ trọn vẹn cái hồn u tối, khắc nghiệt đã làm nên tên tuổi của trò chơi.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Sekiro: No Defeat (Anime Series)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nguyên tác:</strong><span>Sekiro: Shadows Die Twice (FromSoftware)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Đơn vị sản xuất:</strong><span>Kadokawa / FromSoftware</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Dự kiến phát sóng:</strong><span>Năm 2027</span></div>
</div>

<p>Cập nhật thêm các dự án chuyển thể game sang anime tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`,
    tags: ["Sekiro", "FromSoftware", "Hidetaka Miyazaki", "Kadokawa", "Anime Hành Động", "Soulslike"]
  },

  "tokyopop-anime-nyc-2026-licenses.html": {
    category: "Manga",
    readTime: "5 phút đọc",
    summary: "TOKYOPOP công bố 12 bản quyền manga, manhua và graphic novel mới tại Anime NYC, đẩy mạnh phân khúc truyện tranh chuyển thể và các tác phẩm độc lập quốc tế.",
    body: `
<p>Nhà xuất bản kỳ cựu <strong>TOKYOPOP</strong> vừa tổ chức buổi giới thiệu ấn phẩm đặc biệt tại <strong>Anime NYC</strong>, chính thức ra mắt <strong>12 bản quyền truyện tranh mới</strong> chuẩn bị phát hành trên toàn cầu, khẳng định cam kết mang văn hóa đọc manga tới đông đảo độc giả trẻ phương Tây.</p>

<figure><img src="/assets/img/news-tokyopop-licenses.jpg" alt="TOKYOPOP Anime NYC Licenses" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-frieren-season-2-official-visual.jpg'"><figcaption>TOKYOPOP công bố danh mục bản quyền truyện tranh quốc tế đa dạng và phong phú</figcaption></figure>

<h2>1. Đa Dạng Thể Loại & Sáng Tạo Mới</h2>
<p>Danh mục lần này của TOKYOPOP tập trung mạnh vào các tác phẩm shoujo, shounen-ai nhẹ nhàng, các dòng truyện phiêu lưu kỳ ảo có phong cách đồ họa độc đáo cùng các bộ graphic novel hợp tác cùng Disney.</p>

<h2>2. Lịch Phát Hành & Định Dạng Kỹ Thuật Số</h2>
<p>Bên cạnh sách in truyền thống, toàn bộ 12 tác phẩm sẽ đồng thời có mặt trên các nền tảng đọc truyện điện tử bản quyền (e-manga) quốc tế, hỗ trợ người đọc tiếp cận dễ dàng trên di động.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà xuất bản:</strong><span>TOKYOPOP</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Số lượng tác phẩm:</strong><span>12 tựa Manga & Graphic Novel</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Thời gian ra mắt:</strong><span>Đầu năm 2027</span></div>
</div>

<p>Khám phá thêm các tin tức xuất bản truyện tranh tại <a href="/manga">OtaHub Manga</a>.</p>
`,
    tags: ["TOKYOPOP", "Manga", "Anime NYC", "Graphic Novel", "Bản Quyền Manga", "Manga 2026"]
  },

  "genshin-impact-70-sandrone-reveal.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Genshin Impact 7.0: HoYoverse chính thức hé lộ tạo hình và bộ kỹ năng của Quan Chấp Hành Fatui thứ 7 Sandrone (Marionette), mở màn chương hồi cuối Teyvat tại Snezhnaya.",
    body: `
<p>Trong buổi công bố đặc biệt về lộ trình phát triển phiên bản 7.0, <strong>HoYoverse</strong> đã làm dậy sóng hàng chục triệu Nhà Lữ Hành trên toàn thế giới khi giới thiệu nhân vật có thể chơi được cực kỳ được chờ đợi: <strong>Quan Chấp Hành Fatui thứ 7 - Sandrone</strong> (mật danh <em>Marionette - Thiếu Nữ Con Rối</em>).</p>

<figure><img src="/assets/img/news-genshin-impact-sandrone-reveal.jpg" alt="Genshin Impact 7.0 Sandrone Reveal" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-wuthering-waves-black-shores-shorekeeper.jpg'"><figcaption>Quan Chấp Hành Fatui Sandrone cùng cỗ máy hộ vệ khổng lồ sẵn sàng xuất trận trong Genshin Impact 7.0</figcaption></figure>

<h2>1. Tạo Hình Quý Cô Quý Tộc & Robot Hộ Vệ Khổng Lồ</h2>
<p>Sandrone xuất hiện trong bộ váy dạ hội sang trọng mang phong cách quý tộc Bắc Âu kết hợp chi tiết cơ khí steampunk tinh xảo. Đi cùng cô là một <strong>Guenther</strong> — cỗ máy robot hộ vệ khổng lồ được cải tiến từ công nghệ cổ đại Khaenri'ah và Viện Nghiên Cứu Fontaine.</p>
<ul>
  <li><strong>Cơ Chế Điều Khiển Kép (Dual Unit):</strong> Người chơi có thể vừa ra lệnh cho robot tấn công áp sát phá giáp, vừa dùng súng ma thuật tầm xa của Sandrone để kích hoạt phản ứng nguyên tố.</li>
  <li><strong>Nguyên Tố Băng & Nham Hỗ Trợ:</strong> Bộ kỹ năng mang lại khả năng tạo khiên cơ khí vĩnh cửu và gia tăng sát thương chí mạng cho toàn đội hình.</li>
</ul>

<h2>2. Vai Trò Của Sandrone Tại Đại Lục Snezhnaya</h2>
<p>Là người đứng đầu các xưởng nghiên cứu vũ khí cơ khí tự động của Nữ Hoàng Băng Giá Tsaritsa, Sandrone nắm giữ những bí mật then chốt về nguồn năng lượng vận hành bộ máy Fatui và kế hoạch thách thức Thiên Lý của các Quan Chấp Hành.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhân vật:</strong><span>Sandrone (Marionette / Quan Chấp Hành Thứ 7)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Genshin Impact (Phiên bản 7.0)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>HoYoverse</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Khu vực:</strong><span>Snezhnaya (Vương Quốc Băng)</span></div>
</div>

<p>Đọc thêm các bài viết hướng dẫn xây dựng đội hình và phân tích banner tại <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["Genshin Impact", "HoYoverse", "Sandrone", "Fatui", "Snezhnaya", "Gacha Game", "Gaming 2026"]
  },

  "gta6-gameplay-reveal-preorder.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Rockstar Games chính thức tung video gameplay 15 phút của GTA 6: Phô diễn thế giới mở Vice City lộng lẫy trên engine RAGE 9, cơ chế cướp ngân hàng co-op và mở cổng đặt trước toàn cầu.",
    body: `
<p>Sau nhiều năm mong đợi mòn mỏi, <strong>Rockstar Games</strong> đã chính thức tạo nên cơn chấn động lớn nhất lịch sử ngành công nghiệp giải trí khi công bố đoạn video gameplay chính thức kéo dài 15 phút của <strong>Grand Theft Auto VI (GTA 6)</strong>, kèm theo việc mở cổng đặt hàng trước trên PlayStation 5 và Xbox Series X/S.</p>

<figure><img src="/assets/img/news-gta6-gameplay-reveal.jpg" alt="GTA 6 Gameplay Reveal Rockstar" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-call-of-duty-mw4-gamescom.jpg'"><figcaption>GTA 6 phô diễn nền tảng đồ họa thế hệ mới vượt trội và thế giới mở Vice City sống động chưa từng thấy</figcaption></figure>

<h2>1. Đồ Họa Đỉnh Cao Trên Nền Tảng RAGE 9 Engine</h2>
<p>Vice City và bang <strong>Leonida</strong> hiện lên với vẻ đẹp choáng ngợp chưa từng có trong lịch sử trò chơi điện tử:</p>
<ul>
  <li><strong>Hệ Thống Nước & Thời Tiết Nhiệt Đới:</strong> Sóng biển vỗ bờ chân thực, những cơn bão nhiệt đới cuốn lá cọ bay mù mịt và hiệu ứng phản chiếu vũng nước mưa sống động.</li>
  <li><strong>Mật Độ Cư Dân & AI Thế Hệ Mới:</strong> Hàng trăm NPC xuất hiện đồng thời trên bãi biển Vice Beach với các hành vi cá nhân hóa hoàn toàn: livestream trên mạng xã hội giả lập, tập thể dục, dắt thú cưng đi dạo hoặc phản ứng hoảng loạn khi có tiếng súng nổ.</li>
</ul>

<h2>2. Lối Chơi Bộ Đôi Jason & Lucia</h2>
<p>Người chơi có thể chuyển đổi mượt mà giữa hai nhân vật chính <strong>Jason và Lucia</strong>. Game bổ sung cơ chế tác chiến bọc lót thông minh, khả năng trườn bò ẩn nấp và hệ thống lên kế hoạch cướp bóc đa dạng từ các cửa hàng tiện lợi nhỏ lẻ cho tới các ngân hàng liên bang quy mô lớn.</p>

<h2>3. Thông Tin Đặt Trước & Các Phiên Bản Phát Hành</h2>
<p>Rockstar xác nhận GTA 6 sẽ có ba phiên bản: Standard Edition, Deluxe Edition và Collector's Edition đi kèm mô hình xe cổ điển Vice City và bản đồ vải độc quyền.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Grand Theft Auto VI (GTA 6)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển & phát hành:</strong><span>Rockstar Games</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Bối cảnh:</strong><span>Vice City, Bang Leonida</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Nền tảng:</strong><span>PlayStation 5, Xbox Series X/S (PC cập nhật sau)</span></div>
</div>

<p>Khám phá thêm mọi chi tiết phân tích GTA 6 tại <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["GTA 6", "Rockstar Games", "Grand Theft Auto", "Vice City", "Open World", "Gaming 2026"]
  },

  "nintendo-switch-2-launch-lineup-specs.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Nintendo Switch 2 chính thức lộ diện toàn bộ thông số phần cứng: Chip Nvidia tùy biến, hỗ trợ 4K DLSS Ray-Tracing, màn hình OLED 120Hz và dàn game launch khủng.",
    body: `
<p>Nintendo đã chính thức vén màn cỗ máy chơi game thế hệ tiếp theo được mong chờ nhất thập kỷ: <strong>Nintendo Switch 2</strong>. Sở hữu những cải tiến vượt bậc về hiệu năng đồ họa và công nghệ hiển thị, hệ máy hứa hẹn sẽ mở ra một kỷ nguyên mới rực rỡ cho làng game console cầm tay.</p>

<figure><img src="/assets/img/news-nintendo-switch-2-specs-lineup.jpg" alt="Nintendo Switch 2 Launch Lineup Specs" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-frieren-season-2-official-visual.jpg'"><figcaption>Nintendo Switch 2 sở hữu thiết kế hiện đại, màn hình lớn hơn cùng sức mạnh xử lý ấn tượng</figcaption></figure>

<h2>1. Thông Số Phần Cứng & Công Nghệ Nvidia DLSS</h2>
<p>Nintendo Switch 2 được trang bị con chip bán dẫn tùy biến thế hệ mới do <strong>Nvidia</strong> thiết kế riêng, mang lại hiệu năng gấp nhiều lần phiên bản tiền nhiệm:</p>
<ul>
  <li><strong>Xuất Hình 4K 60FPS Qua Dock:</strong> Nhờ công nghệ trí tuệ nhân tạo <strong>Nvidia DLSS 3.1</strong>, máy có thể upscale hình ảnh lên độ phân giải 4K sắc nét và mượt mà trên TV lớn.</li>
  <li><strong>Màn Hình Cầm Tay 8-inch OLED 120Hz:</strong> Độ sáng rực rỡ, hỗ trợ HDR và tần số quét cao giúp các tựa game hành động đạt độ phản hồi tức thì.</li>
  <li><strong>Bộ Nhớ & RAM:</strong> 12GB RAM LPDDR5X tốc độ cao và bộ nhớ trong UFS 3.1 dung lượng 256GB/512GB, hỗ trợ mở rộng qua thẻ nhớ MicroSD Express siêu tốc.</li>
</ul>

<h2>2. Khả Năng Tương Thích Ngược Hoàn Hảo (Backwards Compatibility)</h2>
<p>Nintendo cam kết Switch 2 tương thích ngược 100% với toàn bộ thư viện băng game và game kỹ thuật số của Switch 1. Nhiều tựa game đình đám như <em>Zelda: Tears of the Kingdom</em>, <em>Mario Kart 8 Deluxe</em> sẽ nhận được các bản vá nâng cấp đồ họa miễn phí lên 60 FPS ổn định.</p>

<h2>3. Dàn Game Khởi Động (Launch Lineup) Đỉnh Cao</h2>
<p>Cùng ngày mở bán, máy sẽ ra mắt cùng tựa game <strong>Mario Kart Thế Hệ Mới</strong>, <strong>3D Super Mario Mới</strong> cùng các siêu phẩm đa nền tảng như <em>Cyberpunk 2077</em>, <em>Elden Ring</em> và <em>Final Fantasy VII Remake</em>.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Thiết bị:</strong><span>Nintendo Switch 2</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Hãng sản xuất:</strong><span>Nintendo</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Chipset:</strong><span>Nvidia Custom Processor (Ampere / Ada Lovelace)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Công nghệ hỗ trợ:</strong><span>Nvidia DLSS, Ray Tracing, HDR10</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tương thích ngược:</strong><span>Có (100% Game Switch 1)</span></div>
</div>

<p>Xem thêm các thông tin phân tích hệ máy mới tại <a href="/gaming">chuyên mục Gaming OtaHub</a>.</p>
`,
    tags: ["Nintendo Switch 2", "Nintendo", "Nvidia DLSS", "Console", "Mario Kart", "Gaming 2026"]
  },

  "elden-ring-nightreign-coop-multiplayer-reveal.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "FromSoftware và Hidetaka Miyazaki chính thức công bố Elden Ring: Nightreign – Tựa game hành động co-op độc lập mở rộng thế giới u tối của Vùng Đất Giữa.",
    body: `
<p>Tại sự kiện The Game Awards Showcase, huyền thoại <strong>Hidetaka Miyazaki</strong> cùng <strong>FromSoftware</strong> và <strong>Bandai Namco</strong> đã tạo nên cú sốc lớn khi công bố <strong>Elden Ring: Nightreign</strong> — một tựa game hành động nhập vai phối hợp (Co-op Action RPG) độc lập hoàn toàn mới lấy bối cảnh kỷ nguyên bóng đêm của vũ trụ Lands Between.</p>

<figure><img src="/assets/img/news-elden-ring-nightreign-reveal.jpg" alt="Elden Ring Nightreign FromSoftware Reveal" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-wuthering-waves-black-shores-shorekeeper.jpg'"><figcaption>Elden Ring: Nightreign mang đến trải nghiệm săn boss co-op trong những hầm ngục bóng đêm vô tận</figcaption></figure>

<h2>1. Lối Chơi Co-op 1–3 Người & Hầm Ngục Bóng Đêm Ngẫu Nhiên</h2>
<p>Khác với lối chơi thế giới mở tự do của bản gốc, <em>Nightreign</em> tập trung sâu vào trải nghiệm tác chiến đồng đội vượt qua các <strong>Hầm Ngục Màn Đêm (Night Dungeons)</strong> có cấu trúc thay đổi ngẫu nhiên mỗi lần bước vào:</p>
<ul>
  <li><strong>Cơ Chế Phối Hợp Thuật Thức:</strong> Người chơi có thể kết hợp ma pháp ánh trăng và tro tàn chiến tranh để tạo nên các đòn combo nguyên tố dồn sát thương cực lớn lên trùm.</li>
  <li><strong>Hệ Thống Nghề Nghiệp Độc Lập:</strong> Cung cấp các lớp nhân vật được thiết kế tối ưu cho vai trò Đỡ Đòn, Hỗ Trợ Phép Thuật, Xạ Thủ và Sát Thủ Ám Toán.</li>
</ul>

<h2>2. Bối Cảnh Cổ Xưa & Các Á Thần Bị Lãng Quên</h2>
<p>Nightreign đưa người chơi khám phá những góc khuất tăm tối nhất chưa từng được kể trong biên niên sử của Nữ Thần Marika, đối đầu với các thực thể quái dị sinh ra từ Ngọn Lửa Hư Vô.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Elden Ring: Nightreign</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>FromSoftware</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Giám đốc sản xuất:</strong><span>Hidetaka Miyazaki</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát hành:</strong><span>Bandai Namco Entertainment</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Nền tảng:</strong><span>PC, PS5, Xbox Series X/S</span></div>
</div>

<p>Đọc thêm các bài phân tích Soulslike tại <a href="/gaming">chuyên mục Gaming OtaHub</a>.</p>
`,
    tags: ["Elden Ring", "Nightreign", "FromSoftware", "Hidetaka Miyazaki", "Co-op", "Soulslike", "Gaming 2026"]
  },

  "jujutsu-kaisen-chapter-271-final-climax-epilogue.html": {
    category: "Manga",
    readTime: "6 phút đọc",
    summary: "Jujutsu Kaisen Chapter 271: Chương truyện cuối cùng khép lại 6 năm hành trình của Chú Thuật Hồi Chiến. Lời tạm biệt đầy cảm xúc của Gege Akutami và tương lai của Yuji, Megumi, Nobara.",
    body: `
<p>Sau 6 năm làm mưa làm gió trên tạp chí <em>Weekly Shonen Jump</em> với hàng loạt kỷ lục xuất bản toàn cầu, tác phẩm shonen đình đám <strong>Jujutsu Kaisen (Chú Thuật Hồi Chiến)</strong> của tác giả <strong>Gege Akutami</strong> đã chính thức phát hành <strong>Chương 271</strong> — chương truyện cuối cùng khép lại toàn bộ thiên anh hùng ca ma thuật.</p>

<figure><img src="/assets/img/news-jujutsu-kaisen-final-chapter-271.jpg" alt="Jujutsu Kaisen Chapter 271 Final Climax" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Bức tranh màu trang trọng khép lại hành trình 6 năm của bộ ba Yuji, Megumi và Nobara</figcaption></figure>

<h2>1. Hồi Kết Trọn Vẹn Của Bộ Ba Trường Cao Đẳng Tokyo</h2>
<p>Chương 271 mang lại không khí thanh bình, ấm áp hiếm hoi sau những chuỗi ngày tàn khốc của Đại Chiến Shinjuku. Bộ ba <strong>Itadori Yuji, Fushiguro Megumi và Kugisaki Nobara</strong> cùng nhau thực hiện một nhiệm vụ trừ nguyền nhỏ đời thường, thể hiện sự trưởng thành vượt bậc và tinh thần lạc quan bước tiếp về phía trước.</p>

<h2>2. Di Sản Của Gojo Satoru & Tương Lai Giới Chú Thuật</h2>
<p>Dù người thầy vĩ đại Gojo Satoru đã ngã xuống trong trận chiến thế kỷ với Ryomen Sukuna, lý tưởng của anh về một thế hệ chú thuật sư mới đoàn kết, mạnh mẽ và không còn bị trói buộc bởi những luật lệ cổ hủ của giới thượng tầng đã thực sự đơm hoa kết trái.</p>

<h2>3. Lời Tri Ân Từ Tác Giả Gege Akutami</h2>
<p>Trong phần ghi chú tác giả cuối số báo, Gege Akutami đã gửi lời cảm ơn chân thành tới hàng chục triệu độc giả toàn cầu đã đồng hành, ủng hộ bộ truyện suốt từ năm 2018 đến nay.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Jujutsu Kaisen (Chú Thuật Hồi Chiến)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác giả:</strong><span>Gege Akutami</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Chương kết thúc:</strong><span>Chapter 271</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tổng số tập phát hành:</strong><span>30 Tập đơn (Tankobon)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tạp chí:</strong><span>Weekly Shonen Jump (Shueisha)</span></div>
</div>

<p>Đọc thêm các bài phân tích hồi kết manga tại <a href="/manga">OtaHub Manga</a>.</p>
`,
    tags: ["Jujutsu Kaisen", "Gege Akutami", "Chapter 271", "Sukuna", "Itadori Yuji", "Gojo Satoru", "Manga Shonen Jump"]
  },

  "monster-hunter-wilds-pc-demo-system-requirements.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Monster Hunter Wilds PC Demo: Chi tiết bảng cấu hình phần cứng, công nghệ Frame Generation và trải nghiệm mượt mà săn quái thú bão cát trên Steam.",
    body: `
<p><strong>Capcom</strong> vừa chính thức phát hành bản thử nghiệm mở rộng <strong>Open Beta Demo</strong> của siêu phẩm săn quái vật <strong>Monster Hunter Wilds</strong> trên nền tảng PC Steam, PlayStation 5 và Xbox Series X/S, hỗ trợ tính năng chơi chéo toàn diện (Full Cross-Play).</p>

<figure><img src="/assets/img/news-monster-hunter-wilds-demo.jpg" alt="Monster Hunter Wilds PC Demo System Requirements" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-call-of-duty-mw4-gamescom.jpg'"><figcaption>Monster Hunter Wilds phô diễn hiệu ứng bão cát hoành tráng và lối chơi săn bắn mượt mà</figcaption></figure>

<h2>1. Chi Tiết Bảng Cấu Hình PC Yêu Cầu</h2>
<p>Được phát triển trên nền tảng <strong>RE Engine</strong> thế hệ mới nhất, Monster Hunter Wilds đòi hỏi phần cứng tương đối mạnh mẽ để duy trì khung hình ổn định khi bão cát cuồng nộ xuất hiện:</p>
<ul>
  <li><strong>Cấu Hình Tối Thiểu (1080p 30 FPS Low):</strong> CPU Intel Core i5-10600K / AMD Ryzen 5 3600, GPU GTX 1660 Super / Radeon RX 5600 XT, 16GB RAM, ổ cứng SSD 140GB.</li>
  <li><strong>Cấu Hình Khuyến Nghị (1080p 60 FPS Medium):</strong> CPU Intel Core i7-11700 / AMD Ryzen 7 5700X, GPU RTX 3060 Ti / Radeon RX 6700 XT, 16GB RAM.</li>
  <li><strong>Cấu Hình Ultra 4K (4K 60+ FPS High Ray Tracing):</strong> CPU Core i7-14700K / Ryzen 7 7800X3D, GPU RTX 4080 Super / Radeon RX 7900 XTX, 32GB RAM.</li>
</ul>

<h2>2. Tính Năng Focus Mode & Thú Cưỡi Seikret Linh Hoạt</h2>
<p>Bản demo cho phép thợ săn thử nghiệm cơ chế <strong>Focus Mode</strong> mới toanh — cho phép nhắm chuẩn xác vào các vết thương hở của quái vật để tung ra các đòn tấn công bạo kích làm gãy sừng và chặt đứt đuôi dễ dàng hơn. Thú cưỡi <strong>Seikret</strong> có khả năng tự động di chuyển giúp người chơi vừa cưỡi vừa mài kiếm, uống thuốc hồi máu vô cùng tiện lợi.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Monster Hunter Wilds</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển & phát hành:</strong><span>Capcom</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Engine:</strong><span>RE Engine 2.0</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tính năng:</strong><span>Cross-Play, DLSS 3, FSR 3, Focus Mode</span></div>
</div>

<p>Xem thêm hướng dẫn vũ khí Monster Hunter Wilds tại <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["Monster Hunter Wilds", "Capcom", "PC Gaming", "Benchmark", "Cross-Play", "Action RPG", "Gaming 2026"]
  },

  "genshin-impact-70-snezhnaya-map-gameplay.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Genshin Impact 7.0: Khám phá toàn cảnh bản đồ Snezhnaya băng tuyết, Cung điện Zapolyarny tráng lệ và cơ chế thời tiết giá lạnh khắc nghiệt.",
    body: `
<p>Bản cập nhật thế kỷ <strong>Genshin Impact 7.0</strong> sẽ chính thức đưa Nhà Lữ Hành đặt chân tới quốc gia thứ bảy và cũng là vùng đất cuối cùng của lục địa Teyvat: <strong>Vương Quốc Băng Snezhnaya</strong>.</p>

<figure><img src="/assets/img/news-genshin-snezhnaya-map.jpg" alt="Genshin Impact Snezhnaya Map Gameplay" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-wuthering-waves-black-shores-shorekeeper.jpg'"><figcaption>Vương quốc băng giá Snezhnaya sở hữu quy mô bản đồ đồ sộ cùng kiến trúc hoàng gia lộng lẫy</figcaption></figure>

<h2>1. Bản Đồ Snezhnaya: Quy Mô Rộng Lớn Gấp Đôi Fontaine</h2>
<p>Snezhnaya là quốc gia có diện tích bản đồ mở lớn nhất từng được HoYoverse thiết kế, bao gồm nhiều khu vực địa hình phong phú:</p>
<ul>
  <li><strong>Thành Phố Hoàng Gia Zapolyarny:</strong> Đô thị công nghiệp và hoàng gia nguy nga với các tòa lâu đài mái vòm phong cách Nga cổ điển, xen lẫn hệ thống đường ray xe lửa bọc thép hiện đại.</li>
  <li><strong>Vực Băng Vĩnh Cửu (Eternal Glacier):</strong> Khu vực hoang sơ lạnh giá nơi ẩn chứa các tàn tích ma thuật cổ và hầm mỏ khai thác quặng nguyên tố Băng tinh khiết.</li>
  <li><strong>Công Xưởng Cơ Khí Fatui:</strong> Đại bản doanh nghiên cứu vũ khí tự động dưới sự giám sát của Quan Chấp Hành Dottore và Sandrone.</li>
</ul>

<h2>2. Cơ Chế Sinh Tồn & Phương Tiện Xe Trượt Tuyết</h2>
<p>Game nâng cấp thanh đo nhiệt độ giá rét <strong>Sheer Cold 2.0</strong>, buộc người chơi phải tận dụng các nguồn nhiệt ma thuật và lò sưởi di động. Để thuận tiện di chuyển qua các bình nguyên băng tuyết mênh mông, game bổ sung phương tiện <strong>Xe Trượt Tuyết Cơ Khí (Snow Skimmer)</strong> tùy biến.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Khu vực:</strong><span>Snezhnaya (Bắc Cực Teyvat)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Thần linh:</strong><span>Băng Thần Tsaritsa</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>HoYoverse</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Phiên bản:</strong><span>Genshin Impact 7.0</span></div>
</div>

<p>Cập nhật thêm cẩm nang khám phá Teyvat tại <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["Genshin Impact", "Snezhnaya", "Zapolyarny Palace", "Teyvat", "HoYoverse", "Băng Thần", "Gaming 2026"]
  },

  "chainsaw-man-chapter-180-death-devil.html": {
    category: "Manga",
    readTime: "6 phút đọc",
    summary: "Chainsaw Man Chapter 180: Sự xuất hiện kinh hoàng của Quỷ Cái Chết (Death Devil) kích hoạt hồi kết tàn khốc của Tokyo trong manga Tatsuki Fujimoto.",
    body: `
<p>Tác giả <strong>Tatsuki Fujimoto</strong> một lần nữa chứng minh phong cách kể chuyện không thể đoán trước trong <strong>Chainsaw Man Chapter 180</strong>, khi nhân vật được đồn đoán nhiều nhất toàn bộ câu chuyện — <strong>Quỷ Cái Chết (The Death Devil)</strong>, Kỵ Sĩ Khải Huyền cuối cùng và hùng mạnh nhất — chính thức giáng lâm trần thế.</p>

<figure><img src="/assets/img/news-chainsaw-man-chapter-180.jpg" alt="Chainsaw Man Chapter 180 Death Devil" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Sự thức tỉnh của Quỷ Cái Chết mở ra chương hồi đen tối nhất cho Denji và Yoru</figcaption></figure>

<h2>1. Nỗi Kinh Hoàng Của Kỵ Sĩ Khải Huyền Thứ Tư</h2>
<p>Không giống như những con quỷ khác mang hình thù quái dị, Quỷ Cái Chết xuất hiện trong hình dạng một bóng hình tao nhã nhưng tỏa ra áp lực chết chóc tuyệt đối. Chỉ bằng một cái liếc nhìn, toàn bộ sinh vật sống trong bán kính 1 cây số tại trung tâm Tokyo đều rơi vào trạng thái ngừng thở.</p>

<h2>2. Khủng Hoảng Sinh Tử Của Denji & War Devil Yoru</h2>
<p>Sự hiện diện của Quỷ Cái Chết buộc <strong>Denji</strong> và <strong>Quỷ Chiến Tranh (Yoru / Asa Mitaka)</strong> phải gạt bỏ mọi thù hận cá nhân sang một bên để cùng nhau đối mặt với hiểm họa diệt vong của nhân loại.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Chương truyện:</strong><span>Chainsaw Man Chapter 180</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác giả:</strong><span>Tatsuki Fujimoto</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhân vật mới:</strong><span>Quỷ Cái Chết (Death Devil)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tạp chí:</strong><span>Shonen Jump+ (Shueisha)</span></div>
</div>

<p>Theo dõi các bài phân tích manga kịch tính tại <a href="/manga">OtaHub Manga</a>.</p>
`,
    tags: ["Chainsaw Man", "Tatsuki Fujimoto", "Death Devil", "Denji", "Yoru", "Manga Shonen Jump"]
  },

  "one-piece-anime-remake-wit-studio-trailer.html": {
    category: "Anime",
    readTime: "6 phút đọc",
    summary: "The One Piece Remake: WIT Studio và Netflix chính thức tung trailer đầu tiên về Arc East Blue với chất lượng hoạt họa hiện đại vượt bậc.",
    body: `
<p>Dự án làm lại anime thế kỷ mang tên <strong>THE ONE PIECE</strong> do <strong>WIT Studio</strong> (nổi tiếng với <em>Attack on Titan</em>, <em>Spy x Family</em>) hợp tác sản xuất cùng <strong>Netflix</strong> và <strong>Shueisha</strong> vừa chính thức trình làng đoạn trailer đầu tiên, tái hiện lại những bước chân khởi đầu của Monkey D. Luffy tại vùng biển East Blue.</p>

<figure><img src="/assets/img/news-one-piece-wit-studio-trailer.jpg" alt="The One Piece Remake WIT Studio Trailer" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Nét vẽ 2D mới mẻ, hiện đại và tràn đầy sức sống của THE ONE PIECE Remake bởi WIT Studio</figcaption></figure>

<h2>1. Tinh Gọn Nhịp Phim & Trung Thực Tuyệt Đối Với Nguyên Tác</h2>
<p>Khắc phục điểm yếu kéo dài thời lượng của bản anime truyền hình cũ, <em>THE ONE PIECE</em> của WIT Studio sẽ cô đọng toàn bộ 100 chương truyện của <strong>East Blue Saga</strong> trong một mùa phim tinh gọn, loại bỏ hoàn toàn các tập phụ (filler) không cần thiết.</p>
<ul>
  <li><strong>Phong Cách Hoạt Họa 2D Điêu Luyện:</strong> Đạo diễn Masashi Koizuka mang tới những phân cảnh chém kiếm của Zoro và đòn đấm Gomu Gomu no Pistol của Luffy với chuyển động mượt mà và góc quay năng động.</li>
  <li><strong>Âm Thanh & Phối Nhạc Mới:</strong> Tái phối khí các bản nhạc huyền thoại như <em>We Are!</em> và <em>Overtaken</em> bằng dàn nhạc giao hưởng đương đại.</li>
</ul>

<h2>2. Phát Hành Toàn Cầu Độc Quyền Trên Netflix</h2>
<p>Bộ phim sẽ được phát hành với độ phân giải chuẩn 4K HDR trên nền tảng Netflix tại hơn 190 quốc gia, mang cơ hội tiếp cận tuyệt vời cho cả thế hệ khán giả mới lẫn những fan hâm mộ kỳ cựu.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tên dự án:</strong><span>THE ONE PIECE (Anime Remake)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Studio sản xuất:</strong><span>WIT Studio</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Đạo diễn:</strong><span>Masashi Koizuka</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Phát hành:</strong><span>Netflix / Shueisha / Toei Animation</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Hồi truyện:</strong><span>East Blue Saga (Biển Đông)</span></div>
</div>

<p>Đón đọc thêm các thông tin anime nóng hổi tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`,
    tags: ["The One Piece", "WIT Studio", "Netflix", "Eiichiro Oda", "East Blue", "Luffy", "Anime 2026"]
  },

  "solo-leveling-season-2-arise-from-the-shadow-premiere.html": {
    category: "Anime",
    readTime: "7 phút đọc",
    summary: "Solo Leveling Mùa 2 (Arise from the Shadow): Trận đánh lịch sử Đảo Jeju, Vua Kiến Beru thức tỉnh và sức mạnh áp đảo của Thợ săn Sung Jinwoo.",
    body: `
<p>Siêu bom tấn hoạt hình chuyển thể manhwa được mong chờ nhất <strong>Solo Leveling Season 2: Arise from the Shadow (Tôi Thăng Cấp Một Mình Mùa 2)</strong> do <strong>A-1 Pictures</strong> sản xuất đã chính thức ấn định lịch phát sóng toàn cầu, chuyển thể trọn vẹn chương hồi đẫm máu và vĩ đại nhất: <strong>Chiến Dịch Đảo Jeju (Jeju Island Arc)</strong>.</p>

<figure><img src="/assets/img/news-solo-leveling-s2-jeju-beru.jpg" alt="Solo Leveling Season 2 Jeju Island Beru" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Thợ săn Sung Jinwoo cùng đội quân bóng tối tiến vào chiến trường sinh tử đảo Jeju</figcaption></figure>

<h2>1. Thảm Kịch Đảo Jeju & Mối Đe Dọa Từ Vua Kiến Beru</h2>
<p>Sau 3 lần thất bại thảm hại khiến đảo Jeju bị cô lập thành tổ quỷ, liên minh thợ săn cấp S Hàn Quốc và Nhật Bản quyết định phát động chiến dịch càn quét tổng lực lần thứ 4. Tuy nhiên, sự xuất hiện của quái vật đột biến <strong>Vua Kiến Beru</strong> đã tàn sát hàng loạt thợ săn cấp S hàng đầu, biến chiến trường thành một lò sát sinh đẫm máu.</p>

<h2>2. Màn Xuất Trận Cứu Nguy Của Hoàng Đế Bóng Tối</h2>
<p>Khi mọi hy vọng dường như tan biến, <strong>Sung Jinwoo</strong> xuất hiện thông qua kỹ năng Dịch Chuyển Bóng Tối. Một trận solo tay đôi vô tiền khoáng hậu giữa Jinwoo và Beru diễn ra, khẳng định sức mạnh tuyệt đối của Hoàng Đế Bóng Tối và khoảnh khắc hô vang câu lệnh huyền thoại: <em>"Arise!" (Trỗi Dậy)</em>.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Solo Leveling Season 2 (Arise from the Shadow)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Studio sản xuất:</strong><span>A-1 Pictures</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Âm nhạc:</strong><span>Hiroyuki Sawano</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Phát sóng:</strong><span>Crunchyroll, Netflix, Ani-One</span></div>
</div>

<p>Đọc thêm các tin tức manhwa chuyển thể tại <a href="/anime">OtaHub Anime</a>.</p>
`,
    tags: ["Solo Leveling", "A-1 Pictures", "Sung Jinwoo", "Beru", "Jeju Island Arc", "Hiroyuki Sawano", "Anime 2026"]
  },

  "bleach-thousand-year-blood-war-part-4-the-farewell-release-date.html": {
    category: "Anime",
    readTime: "7 phút đọc",
    summary: "Bleach TYBW Part 4 The Farewell: Studio Pierrot công bố trailer chính thức và ngày phát sóng hồi kết – Đại chiến Cung Điện Linh Vương với các phân cảnh mới của Kubo Tite.",
    body: `
<p>Hành trình 20 năm của tượng đài shonen <strong>Bleach</strong> sắp sửa bước tới hồi kết huy hoàng nhất khi <strong>Studio Pierrot</strong> và nhà phát hành Aniplex chính thức tung trailer dài 2 phút cho <strong>Bleach: Thousand-Year Blood War Part 4 – The Farewell (Huyết Chiến Ngàn Năm Phần 4: Lời Từ Biệt)</strong>.</p>

<figure><img src="/assets/img/news-bleach-tybw-part4-farewell.jpg" alt="Bleach TYBW Part 4 The Farewell" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/af620ca724-chainsaw-man-reze-arc-review-hero.jpg'"><figcaption>Ichigo Kurosaki và Aizen Sosuke chuẩn bị đối đầu Trùm cuối Yhwach trong Bleach TYBW Part 4</figcaption></figure>

<h2>1. Những Trận Chiến Mới Do Chính Tác Giả Tite Kubo Bổ Sung</h2>
<p>Điểm nhấn đắt giá nhất của Phần 4 là việc tác giả <strong>Tite Kubo</strong> trực tiếp tham gia viết kịch bản và bổ sung hàng loạt cảnh chiến đấu chưa từng có trong manga gốc:</p>
<ul>
  <li><strong>Mở Rộng Sức Mạnh Của Đội 0 (Zero Squad):</strong> Màn phô diễn trọn vẹn Bankai trấn thế của các Đại Chú Vệ Cung Điện Linh Vương.</li>
  <li><strong>Bankai Của Aizen & Sự Hợp Lực Lịch Sử:</strong> Liên minh bất đắc dĩ giữa Ichigo Kurosaki, Aizen Sosuke và Ishida Uryu chống lại sức mạnh toàn tri toàn năng của Vua Quincy Yhwach.</li>
</ul>

<h2>2. Đồ Họa Đỉnh Cao Mang Thương Hiệu Pierrot Films</h2>
<p>Được sản xuất bởi phân nhánh cao cấp <strong>Pierrot Films</strong>, chất lượng ánh sáng, chuyển động đao kiếm và các hiệu ứng Getsuga Tensho đều được đầu tư tỉ mỉ từng khung hình.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Bleach: Thousand-Year Blood War Part 4</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Studio sản xuất:</strong><span>Pierrot Films (Studio Pierrot)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác giả gốc:</strong><span>Tite Kubo</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Phát sóng:</strong><span>Disney+, Hulu, TV Tokyo</span></div>
</div>

<p>Xem thêm các bài viết chuyên sâu về Bleach tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`,
    tags: ["Bleach", "TYBW", "Studio Pierrot", "Tite Kubo", "Ichigo Kurosaki", "Yhwach", "Anime 2026"]
  },

  "girls-frontline-2-exilium-review.html": {
    category: "Reviews",
    readTime: "8 phút đọc",
    summary: "Đánh giá chi tiết Girls' Frontline 2: Exilium (Lưu Đày): Bước lột xác ngoạn mục từ 2D sang 3D chân thực, lối chơi chiến thuật bọc lót theo lượt hardcore và chiều sâu cốt truyện hấp dẫn.",
    body: `
<p>Sau nhiều năm phát triển và thử nghiệm, <strong>Girls' Frontline 2: Exilium (Thiếu Nữ Tiền Tuyến 2: Lưu Đày)</strong> do <strong>MICA Team (Sunborn Network)</strong> phát triển đã chính thức ra mắt toàn cầu. Không còn là một game thẻ tướng 2D chibi đơn giản, Exilium đã tái định hình toàn bộ thương hiệu thành một kiệt tác chiến thuật theo lượt 3D đỉnh cao mang đậm hơi thở của dòng game XCOM huyền thoại.</p>

<figure><img src="/assets/img/f661df27f7-gfl2-exilium-hero.jpg" alt="Girls Frontline 2 Exilium Review" width="1920" height="1080" fetchpriority="high" decoding="async"><figcaption>Girls' Frontline 2: Exilium mang đến đồ họa 3D cel-shading tuyệt mỹ cùng chiều sâu chiến thuật hardcore</figcaption></figure>

<h2>1. Cốt Truyện Hậu Tận Thế 10 Năm Sau Sự Sụp Đổ Của Griffon & Kryuger</h2>
<p>Bối cảnh diễn ra 10 năm sau các sự kiện của phần 1. Công ty quân sự tư nhân PMC Griffon & Kryuger đã giải thể, Chỉ Huy (người chơi) trở thành một thợ săn tiền thưởng tự do rong ruổi trên chiếc xe bọc thép Elmo giữa vùng đất ô nhiễm bức xạ Vùng Vàng. Cốt truyện mang màu sắc u tối, thực tế và tôn vinh tình đồng đội giữa con người và các búp bê chiến thuật T-Doll.</p>

<h2>2. Gameplay Chiến Thuật Bọc Lót (Cover System) & Tương Khắc Đạn Đạo</h2>
<p>Khác biệt hoàn toàn với các tựa game gacha thông thường trên thị trường:</p>
<ul>
  <li><strong>Hệ Thống Ẩn Nấp & Điểm Cao (High Ground):</strong> Tận dụng các bức tường, thùng container để giảm thiểu sát thương phải nhận và tăng tỷ lệ bắn trúng điểm yếu kẻ địch.</li>
  <li><strong>Cơ Chế Phá Giáp Tinh Tế (Stability Breakdown):</strong> Khi thanh ổn định của đối thủ bị đánh sập, các T-Doll có thể thực hiện những đòn phản kích liên hoàn kết liễu mục tiêu trong chớp mắt.</li>
  <li><strong>Tương Tác Ký Túc Xá 3D Sống Động:</strong> Mô hình nhân vật Groza, Nemesis, Charolic... được dựng 3D chi tiết với biểu cảm khuôn mặt mượt mà và các chuyển động tương tác chân thực.</li>
</ul>

<h2>3. Đánh Giá Tổng Quan & Lời Khuyên Cho Game Thủ</h2>
<p>Với chất lượng đồ họa tiệm cận các tựa game console và hệ thống gameplay chiến thuật thử thách trí tuệ, Girls' Frontline 2: Exilium xứng đáng là tựa game gacha chiến thuật đáng chơi nhất năm 2026.</p>

<div class="score-box">
  <div class="score-num">8.8</div>
  <div class="score-txt">
    <div class="score-verdict">XUẤT SẮC · TACTICAL RPG CHUẨN MỰC</div>
    <div class="score-sub">Đồ họa 3D lột xác, cơ chế XCOM hardcore gây nghiện và cốt truyện xuất sắc.</div>
  </div>
</div>

<p>Đọc thêm các bài đánh giá game gacha chi tiết tại <a href="/reviews">chuyên mục Reviews OtaHub</a>.</p>
`,
    tags: ["Girls Frontline 2", "Exilium", "MICA Team", "Sunborn", "Gacha Game", "Tactical RPG", "Reviews"]
  },

  "black-myth-wukong-dlc-release-date-bosses.html": {
    category: "Gaming",
    readTime: "7 phút đọc",
    summary: "Black Myth: Wukong DLC (Đại Thánh Tái Sinh): Khám phá cốt truyện 33 Tầng Trời, mở cổng Nam Thiên Môn và hệ thống Boss Thần Thoại đồ sộ từ Game Science.",
    body: `
<p>Tiếp nối thành công vang dội với hơn 20 triệu bản được bán ra trên toàn cầu, studio <strong>Game Science</strong> đã chính thức công bố bản mở rộng DLC quy mô lớn đầu tiên cho kiệt tác hành động <strong>Black Myth: Wukong (Hắc Thần Thoại: Ngộ Không)</strong> mang tên <strong>Đại Thánh Tái Sinh (Rebirth of the Great Sage)</strong>.</p>

<figure><img src="/assets/img/news-black-myth-wukong-dlc.jpg" alt="Black Myth Wukong DLC Bosses" width="1920" height="1080" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-call-of-duty-mw4-gamescom.jpg'"><figcaption>Thiên Mệnh Nhân tiến lên Nam Thiên Môn mở màn cuộc đại chiến chấn động Tam Giới</figcaption></figure>

<h2>1. Bối Cảnh 33 Tầng Trời & Đại Náo Nam Thiên Môn</h2>
<p>Bản mở rộng đưa người chơi nối tiếp cái kết ẩn của phần game gốc. Không còn quanh quẩn ở chốn nhân gian phàm trần, <strong>Thiên Mệnh Nhân</strong> chính thức cưỡi Cân Đẩu Vân vượt qua Cửu Trùng Thiên để tiến thẳng lên <strong>Nam Thiên Môn</strong> và <strong>Cung Điện Thiên Đình</strong> nhằm vén màn âm mưu thâm độc về cái chết oan khuất của Tề Thiên Đại Thánh.</p>

<h2>2. Dàn Boss Thần Thoại Cực Khủng & Pháp Bảo Mới</h2>
<p>Game Science bổ sung hơn 15 con Boss chính và hàng chục Quái Tinh Tinh Anh mới:</p>
<ul>
  <li><strong>Tứ Đại Thiên Vương Chân Thể:</strong> Bốn hộ pháp Thiên Đình xuất hiện với hình thái khổng lồ kết hợp các pháp khí đàn Tỳ Bà, kiếm thần và bảo tán.</li>
  <li><strong>Hệ Thống 72 Phép Biến Hóa Nâng Cấp:</strong> Cho phép Thiên Mệnh Nhân hóa thân thành Đại Bàng Kim Sí Điểu và Kỳ Lân Lửa để chiến đấu tự do trên không trung.</li>
</ul>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Black Myth: Wukong – DLC Đại Thánh Tái Sinh</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>Game Science</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Engine:</strong><span>Unreal Engine 5.5</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Nền tảng:</strong><span>PC (Steam/Epic), PlayStation 5, Xbox Series X</span></div>
</div>

<p>Cập nhật thêm các bài phân tích thần thoại Tây Du Ký tại <a href="/gaming">OtaHub Gaming</a>.</p>
`,
    tags: ["Black Myth Wukong", "Game Science", "Tây Du Ký", "Tôn Ngộ Không", "DLC", "Action RPG", "Gaming 2026"]
  }
};

let enrichedCount = 0;
for (const [filename, data] of Object.entries(stubEnrichments)) {
  if (!fs.existsSync(filename)) {
    console.log(`File ${filename} does not exist, skipping.`);
    continue;
  }
  let content = fs.readFileSync(filename, 'utf8');

  // Replace highlight-box text
  if (data.summary) {
    content = content.replace(/<div class="hb-text">[\s\S]*?<\/div>/i, `<div class="hb-text">${data.summary}</div>`);
  }

  // Replace art-body
  if (data.body) {
    content = content.replace(/<article class="art-body">[\s\S]*?<\/article>/i, `<article class="art-body">${data.body}\n</article>`);
  }

  // Update read time if present
  if (data.readTime) {
    content = content.replace(/<span class="am-read">[^<]*<\/span>/i, `<span class="am-read">${data.readTime}</span>`);
  }

  // Update tags in sidebar
  if (data.tags && data.tags.length) {
    const tagsHtml = data.tags.map(t => `<a class="sb-tag" href="/tag?q=${encodeURIComponent(t)}">${t}</a>`).join('');
    content = content.replace(/<div class="sb-tags">[\s\S]*?<\/div>/i, `<div class="sb-tags">${tagsHtml}</div>`);
  }

  fs.writeFileSync(filename, content, 'utf8');
  enrichedCount++;
  console.log(`[OK] Enriched ${filename}`);
}

console.log(`\nSuccessfully enriched ${enrichedCount} stub articles!`);

