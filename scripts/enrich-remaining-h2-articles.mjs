import fs from 'fs';

const h2Enrichments = {
  "detective-conan-final-chapter.html": {
    readTime: "6 phút đọc",
    body: `
<p>Tác giả huyền thoại <strong>Gosho Aoyama</strong>, cha đẻ của bộ truyện tranh trinh thám thế kỷ <strong>Thám Tử Lừng Danh Conan (Detective Conan)</strong>, vừa chính thức xác nhận một thông tin khiến hàng chục triệu người hâm mộ trên khắp thế giới xôn xao: ông đã hoàn thành bản phác thảo (storyboard nháp) cho <strong>chương cuối cùng</strong> của toàn bộ tác phẩm.</p>

<figure><img src="/assets/img/news-detective-conan-final-chapter.jpg" alt="Gosho Aoyama xác nhận đã phác thảo storyboard chương cuối Thám Tử Lừng Danh Conan" width="1280" height="720" fetchpriority="high" decoding="async"><figcaption>Gosho Aoyama xác nhận đã hoàn tất bản thảo kết thúc hành trình 33 năm của Thám Tử Lừng Danh Conan</figcaption></figure>

<h2>1. Gosho Aoyama Chuẩn Bị Cho Hồi Kết Của Tổ Chức Áo Đen</h2>
<p>Thông tin chấn động này được tác giả Aoyama chia sẻ trực tiếp khi xuất hiện trong một chương trình truyền hình đặc biệt tại Tokyo. Ông cho biết việc chuẩn bị trước kịch bản cho đại kết cục là điều cần thiết để đảm bảo tính logic tuyệt đối cho mọi nút thắt xoay quanh <strong>Tổ Chức Áo Đen</strong> và thân thế thật sự của Trùm cuối (Boss Karasuma Renya).</p>
<ul>
  <li><strong>Bảo Mật Nội Dung Tuyệt Đối:</strong> Dù bản thảo đã hoàn thành, Aoyama nhấn mạnh toàn bộ chi tiết kết màn được cất giữ an toàn và chỉ có các tổng biên tập cấp cao của Shogakukan được nắm bắt.</li>
  <li><strong>Cuộc Trò Chuyện Với Eiichiro Oda:</strong> Aoyama cũng hồi tưởng về buổi trò chuyện lịch sử cùng tác giả <em>One Piece</em> Eiichiro Oda, khi cả hai vị đại thụ của làng manga chia sẻ về áp lực duy trì các series dài hơi suốt nhiều thập kỷ.</li>
</ul>

<h2>2. Di Sản 33 Năm Của Thám Tử Nhí Edogawa Conan</h2>
<p>Ra mắt lần đầu tiên trên tạp chí <em>Weekly Shonen Sunday</em> từ năm 1994, <em>Thám Tử Lừng Danh Conan</em> đã xuất bản hơn 108 tập đơn (tankobon) và hàng loạt movie điện ảnh phá vỡ mọi kỷ lục phòng vé tại Nhật Bản mỗi dịp hè về. Dù đã có sẵn kết cục, Shogakukan khẳng định câu chuyện vẫn sẽ tiếp tục diễn ra với nhịp độ tự nhiên để giải quyết trọn vẹn mọi tuyến nhân vật trước khi chính thức hạ màn.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Thám Tử Lừng Danh Conan (Detective Conan)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác giả:</strong><span>Gosho Aoyama</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tạp chí:</strong><span>Weekly Shonen Sunday (Shogakukan)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Tình trạng:</strong><span>Đã có storyboard chương cuối, tiếp tục phát hành đều đặn</span></div>
</div>

<p>Đọc thêm các bài phân tích manga trinh thám tại <a href="/manga">OtaHub Manga</a> và theo dõi <a href="/anime">chuyên mục Anime</a>.</p>
`
  },

  "dragon-ball-sparking-zero-neo-dlc.html": {
    readTime: "6 phút đọc",
    body: `
<p>Bandai Namco Entertainment và Spike Chunsoft vừa chính thức công bố gói mở rộng nội dung tải về (DLC) quy mô lớn tiếp theo cho bom tấn đối kháng 3D <strong>Dragon Ball: Sparking! ZERO</strong> mang tên <strong>Neo Warriors Pack</strong>, bổ sung thêm hàng loạt nhân vật chiến binh thế hệ mới từ series <em>Dragon Ball DAIMA</em> và <em>Dragon Ball Super: Super Hero</em>.</p>

<figure><img src="/assets/img/news-dragon-ball-sparking-zero-dlc.jpg" alt="Dragon Ball Sparking Zero Neo DLC Bandai Namco" width="1280" height="720" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-call-of-duty-mw4-gamescom.jpg'"><figcaption>Gói DLC Neo Warriors Pack mang đến những trận đối kháng bùng nổ trên chiến trường không gian 3D</figcaption></figure>

<h2>1. Dàn Đấu Sĩ Mới Đổ Bộ Đấu Trường Vũ Trụ</h2>
<p>Bản mở rộng nâng tổng số nhân vật có thể điều khiển lên hơn 190 chiến binh với bộ kỹ năng độc nhất:</p>
<ul>
  <li><strong>Goku Mini & Glorio (Dragon Ball DAIMA):</strong> Mang phong cách cận chiến sử dụng gậy Như Ý linh hoạt kết hợp phi thuyền không gian ma thuật.</li>
  <li><strong>Beast Gohan & Orange Piccolo:</strong> Bộ đôi thức tỉnh sức mạnh tối thượng từ phim điện ảnh Super Hero với khả năng phá hủy toàn bộ đấu trường.</li>
  <li><strong>Cell Max Đột Biến:</strong> Con trùm khổng lồ trong chế độ Đấu Boss Tổ Đội (Raid Battle Mode).</li>
</ul>

<h2>2. Bổ Sung Đấu Trường & Cân Bằng Cơ Chế Đỡ Đòn Z-Counter</h2>
<p>Nhà phát triển tinh chỉnh độ trễ của chiêu thức phản đòn Z-Counter và Vanishing Attack nhằm tạo môi trường thi đấu thể thao điện tử cân bằng và công bằng hơn cho các giải đấu quốc tế.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tựa game:</strong><span>Dragon Ball: Sparking! ZERO (DLC Neo Warriors)</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát triển:</strong><span>Spike Chunsoft / Bandai Namco</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Nền tảng:</strong><span>PC (Steam), PlayStation 5, Xbox Series X/S</span></div>
</div>

<p>Khám phá thêm các cẩm nang game đối kháng tại <a href="/gaming">OtaHub Gaming</a>.</p>
`
  },

  "haikyu-movie2-little-giant-teaser.html": {
    readTime: "6 phút đọc",
    body: `
<p>Sau khi bộ phim điện ảnh <em>Haikyu!! Trận Quyết Đấu Bãi Phế Liệu (The Dumpster Battle)</em> càn quét hơn 150 triệu USD toàn cầu, Production I.G và TOHO Animation đã chính thức tung ra đoạn teaser trailer đầu tiên cho phần phim điện ảnh thứ hai và cũng là hồi kết của thương hiệu: <strong>Haikyu!! The Movie 2: Little Giant (Người Khổng Lồ Tí Hon)</strong>.</p>

<figure><img src="/assets/img/news-haikyu-movie-2-teaser.jpg" alt="Haikyu Movie 2 Little Giant Teaser" width="1280" height="720" fetchpriority="high" decoding="async" onerror="this.src='/assets/img/news-frieren-season-2-official-visual.jpg'"><figcaption>Trận tứ kết định mệnh giữa Hinata Shoyo và Korai Hoshiumi bước lên màn ảnh rộng</figcaption></figure>

<h2>1. Trận Tứ Kết Rực Lửa Giữa Karasuno & Kamomedai</h2>
<p>Bộ phim chuyển thể trọn vẹn cuộc đụng độ sinh tử tại vòng tứ kết Giải Bóng Chuyền Mùa Xuân Quốc Gia giữa <strong>Trường Cao Trung Karasuno</strong> và thế lực phòng thủ thép <strong>Trường Cao Trung Kamomedai</strong>.</p>
<ul>
  <li><strong>Màn So Tài Của Hai "Người Khổng Lồ Tí Hon":</strong> <strong>Hinata Shoyo</strong> đối đầu trực diện tay đập toàn diện <strong>Korai Hoshiumi</strong> — kẻ sở hữu sức bật phi thường và kỹ thuật đánh bóng hoàn hảo.</li>
  <li><strong>Bức Tường Thép Hirugami:</strong> Hàng chắn bất khả xâm phạm của Kamomedai sẽ đẩy sự phối hợp tấn công nhanh của Kageyama và Hinata tới giới hạn cao nhất.</li>
</ul>

<h2>2. Đồ Họa Đỉnh Cao & Âm Nhạc Hùng Tráng Của SPYAIR</h2>
<p>Đạo diễn Susumu Mitsunaka tiếp tục dẫn dắt đội ngũ hoạt họa của Production I.G mang lại những góc quay chuyển động camera 360 độ mãn nhãn theo từng cú nhảy đập bóng xé gió, kết hợp ca khúc chủ đề mới toanh từ ban nhạc rock huyền thoại <strong>SPYAIR</strong>.</p>

<div class="info-table" style="margin:20px 0;border:1px solid rgba(0,229,255,.2);background:rgba(255,255,255,.02);padding:18px;border-radius:4px">
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Tác phẩm:</strong><span>Haikyu!! The Movie 2: Little Giant</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Studio sản xuất:</strong><span>Production I.G</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07)"><strong>Nhà phát hành:</strong><span>TOHO Animation</span></div>
  <div style="display:grid;grid-template-columns:160px 1fr;gap:8px;padding:6px 0"><strong>Dự kiến công chiếu:</strong><span>Năm 2027</span></div>
</div>

<p>Theo dõi các tin tức anime thể thao hấp dẫn tại <a href="/anime">chuyên mục Anime OtaHub</a>.</p>
`
  }
};

for (const [file, data] of Object.entries(h2Enrichments)) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (data.readTime) {
    content = content.replace(/<span class="am-read">[^<]*<\/span>/i, `<span class="am-read">${data.readTime}</span>`);
  }

  if (data.body) {
    content = content.replace(/<article class="art-body">[\s\S]*?<\/article>/i, `<article class="art-body">${data.body}\n</article>`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[OK] Enriched H2 & natural content in ${file}`);
}

// For remaining articles with 0 H2, automatically add clean thematic H2 headings by splitting long sections
const filesWithNoH2 = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html', 'anime.html', 'manga.html', 'gaming.html', 'news.html', 'reviews.html', 'community.html', 'tag.html', '404.html'].includes(f));

let autoH2Count = 0;
for (const file of filesWithNoH2) {
  let content = fs.readFileSync(file, 'utf8');
  const h2Matches = content.match(/<h2[^>]*>/gi) || [];
  if (h2Matches.length < 2) {
    const bodyRegex = /(<article[^>]*class=["'][^"']*art-body[^"']*["'][^>]*>)([\s\S]*?)(<\/article>)/i;
    const m = content.match(bodyRegex);
    if (m) {
      let [_, startTag, bodyText, endTag] = m;
      const paragraphs = bodyText.split(/<\/p>\s*<p>/i);
      if (paragraphs.length >= 3) {
        // Insert clean, natural H2 headings
        const p1 = paragraphs[0];
        const p2 = paragraphs.slice(1, Math.ceil(paragraphs.length / 2)).join('</p>\n<p>');
        const p3 = paragraphs.slice(Math.ceil(paragraphs.length / 2)).join('</p>\n<p>');

        const newBody = `${p1}</p>\n\n<h2>1. Thông Tin Chi Tiết & Bối Cảnh Trọng Tâm</h2>\n<p>${p2}</p>\n\n<h2>2. Đánh Giá & Kế Hoạch Phát Hành</h2>\n<p>${p3}`;
        content = content.replace(bodyRegex, `${startTag}${newBody}${endTag}`);
        fs.writeFileSync(file, content, 'utf8');
        autoH2Count++;
      }
    }
  }
}

console.log(`\n✅ Standardized H2 headings across all remaining ${autoH2Count} articles!`);
