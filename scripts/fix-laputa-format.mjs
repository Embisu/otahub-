import fs from 'node:fs';

const file = 'laputa-lau-dai-tren-khong-tro-lai-rap-viet-2026.html';
let html = fs.readFileSync(file, 'utf8');

const article = `<article class="art-body">
<p>Sau gần 40 năm kể từ lần đầu ra mắt, <strong>Laputa: Lâu đài trên không</strong> (<em>Castle in the Sky</em>) của Hayao Miyazaki trở lại màn ảnh rộng Việt Nam từ ngày <strong>25/9/2026</strong>. Đây là phim điện ảnh đầu tiên được Studio Ghibli sản xuất sau khi hãng thành lập năm 1985.</p>

<h2>Laputa: Lâu đài trên không có gì hấp dẫn?</h2>
<p>Bộ phim theo chân <strong>Pazu và Sheeta</strong> trong hành trình tìm kiếm Laputa, lâu đài bay huyền thoại ẩn giữa bầu trời. Viên đá bí ẩn Sheeta mang theo có liên hệ với Laputa, khiến hai nhân vật bị cả quân đội lẫn một nhóm không tặc truy đuổi.</p>

<figure>
<img src="/assets/img/uploads/inline-mumcopuf-2.jpg" alt="Pazu và Sheeta trong Laputa: Lâu đài trên không của Studio Ghibli" loading="lazy" width="602" height="337">
<figcaption>Pazu và Sheeta bước vào hành trình tìm kiếm lâu đài bay Laputa.</figcaption>
</figure>

<p>Sức hút của phim không chỉ nằm ở chuyến phiêu lưu mà còn đến từ thế giới giả tưởng được vẽ tay tỉ mỉ. Những cỗ máy bay, thành phố trên không, thiên nhiên xanh thẳm và các phân cảnh hành động tạo nên phong cách steampunk đặc trưng nhưng vẫn giữ được chất thơ của Miyazaki.</p>
<p>Laputa cũng đặt con người, công nghệ và thiên nhiên trong cùng một câu chuyện. Lâu đài bay không đơn thuần là kho báu; nó trở thành cách Miyazaki đặt câu hỏi về quyền lực và trách nhiệm khi con người sở hữu một công nghệ vượt quá khả năng kiểm soát.</p>

<h2>Đội ngũ đứng sau bộ phim</h2>
<p><em>Laputa: Lâu đài trên không</em> do <strong>Hayao Miyazaki</strong> viết kịch bản và đạo diễn, <strong>Isao Takahata</strong> sản xuất, còn <strong>Joe Hisaishi</strong> phụ trách âm nhạc. Sự kết hợp này đặt nền móng cho phong cách kể chuyện, hình ảnh và âm nhạc sau này của Studio Ghibli.</p>

<div class="info-table" role="list" aria-label="Thông tin phim Laputa: Lâu đài trên không">
<div class="info-row" role="listitem"><span class="ir-label">Tên gốc</span><span class="ir-val">天空の城ラピュタ</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Tên tiếng Anh</span><span class="ir-val">Castle in the Sky</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Năm phát hành</span><span class="ir-val">1986</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Đạo diễn</span><span class="ir-val">Hayao Miyazaki</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Nhà sản xuất</span><span class="ir-val">Isao Takahata</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Âm nhạc</span><span class="ir-val">Joe Hisaishi</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Studio</span><span class="ir-val">Studio Ghibli</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Thời lượng</span><span class="ir-val">Khoảng 124 phút</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Thể loại</span><span class="ir-val">Hoạt hình, phiêu lưu, kỳ ảo</span></div>
<div class="info-row" role="listitem"><span class="ir-label">Khởi chiếu tại Việt Nam</span><span class="ir-val">25/9/2026</span></div>
</div>

<h2>Có nên xem Laputa ngoài rạp?</h2>
<p>Với phần hình ảnh vẽ tay giàu chi tiết và âm nhạc của Joe Hisaishi, <em>Laputa: Lâu đài trên không</em> là tác phẩm phù hợp để thưởng thức trên màn ảnh lớn. Đợt chiếu lại cũng là cơ hội để khán giả trẻ tiếp cận một trong những bộ phim đặt nền móng cho Studio Ghibli.</p>
</article>`;

const start = html.indexOf('<article class="art-body">');
const end = html.indexOf('</article>', start);
if (start < 0 || end < 0) throw new Error('Không tìm thấy vùng nội dung bài Laputa');
html = html.slice(0, start) + article + html.slice(end + '</article>'.length);

html = html
  .replace('<nav class="breadcrumb" aria-label="breadcrumb">\n<a href="/">Trang chủ</a>\n<span class="breadcrumb-sep">›</span>\n<a href="/gaming">Gaming</a>', '<nav class="breadcrumb" aria-label="breadcrumb">\n<a href="/">Trang chủ</a>\n<span class="breadcrumb-sep">›</span>\n<a href="/anime">Anime</a>')
  .replace('<a class="author-profile-link" href="/about">', '<a class="author-profile-link" href="/author/otahub">')
  .replace('<div class="sb-tags"><a class="sb-tag" href="/anime">Gaming</a>', '<div class="sb-tags"><a class="sb-tag" href="/gaming">Gaming</a>');

// The shared article stylesheet has table row primitives; this local block only
// defines the responsive grid used by this film fact sheet.
html = html.replace('</head>', `<style>
.art-body .info-table{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin:30px 0;background:var(--border);border:1px solid var(--border)}
.art-body .info-row{background:var(--surf);padding:15px 18px;display:flex;flex-direction:column;gap:4px}
.art-body .ir-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.art-body .ir-val{font-size:15px;color:var(--white);font-weight:600}
@media(max-width:640px){.art-body .info-table{grid-template-columns:1fr}}
</style>\n</head>`);

fs.writeFileSync(file, html, 'utf8');
console.log('Đã chuẩn hóa form bài Laputa.');
