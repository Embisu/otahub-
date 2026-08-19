(function(){
  var match=location.pathname.match(/\/(?:en\/)?(gaming|anime|manga)(?:\.html)?\/?$/);
  if(!match)return;
  var category=match[1], english=/^\/en\//.test(location.pathname);
  var stories={
    gaming:[
      ['sinking-city-2-launch','The Sinking City 2 Ra Mắt 18/8: Frogwares Chuyển Hẳn Sang Kinh Dị Sinh Tồn','The Sinking City 2 Launches August 18: Frogwares Goes All-In On Survival Horror'],
      ['playstation-plus-august-2026','PlayStation Plus Tháng 8/2026 Chốt Danh Sách: Dying Light 2 Reloaded, Big Walk Và Signalis','PlayStation Plus August 2026 Lineup: Dying Light 2 Reloaded, Big Walk And Signalis'],
      ['silent-hill-townfall-gameplay','Silent Hill: Townfall Hé Lộ Bối Cảnh Scotland 1996 Và Thiết Bị CRTV','Silent Hill: Townfall Details Scotland Setting And CRTV Retro Tech'],
      ['ball-x-pit-naturalist-update','Ball x Pit Ra Mắt Bản Cập Nhật Miễn Phí Cuối The Naturalist, Thêm 2 Nhân Vật Mới','Ball x Pit Launches Final Free Update The Naturalist With Two New Characters'],
      ['flamecraft-ps5-demo','Flamecraft Xác Nhận Ra Mắt PS5, Xbox Series Và Switch, Demo Có Từ 28/7','Flamecraft Confirms PS5, Xbox Series, And Switch Versions, Demo Live Since July 28'],
      ['marvel-tokon-phoenix-cyclops-dlc','MARVEL Tōkon: Fighting Souls Công Bố Phoenix Cyclops Là DLC Year 1 Đầu Tiên','MARVEL Tōkon: Fighting Souls Reveals Phoenix Cyclops As First Year 1 DLC Fighter'],
      ['marvel-wolverine-story-trailer','Marvel\'s Wolverine Tung Trailer Cốt Truyện Tại Comic-Con, Xác Nhận Ra Mắt 15/9','Marvel\'s Wolverine Releases Story Trailer At Comic-Con, Confirms September 15 Launch'],
      ['halo-campaign-evolved-modernizes','Halo: Campaign Evolved Ra Mắt 28/7, Nêu 13 Thay Đổi Hiện Đại Hóa Chiến Dịch','Halo: Campaign Evolved Launches July 28, Outlines 13 Changes Modernizing The Campaign'],
      ['dragon-ball-sparking-zero-neo-dlc','Dragon Ball: Sparking Zero Tung DLC Super Limit-Breaking Neo Với 33 Nhân Vật Mới','Dragon Ball: Sparking Zero Launches Super Limit-Breaking Neo DLC With 33 New Characters'],
      ['lous-lagoon-ps5-august-27','Lou\'s Lagoon Ấn Định Ra Mắt PS5 Ngày 27/8, Công Bố Deluxe Edition','Lou\'s Lagoon Confirms PS5 Launch On August 27, Reveals Deluxe Edition'],
      ['order-of-the-sinking-star-ps5','Order Of The Sinking Star Xác Nhận Bản PS5, Ra Mắt Ngày 8/10','Order Of The Sinking Star Confirms PS5 Version, Launches October 8'],
      ['xbox-game-pass-july-wave-2','Xbox Game Pass Wave 2 Tháng 7: Halo Campaign Evolved Dẫn Đầu Cùng Beast Of Reincarnation','Xbox Game Pass July Wave 2: Halo Campaign Evolved Leads Beast Of Reincarnation Lineup'],
      ['splatoon-raiders-launch','Splatoon Raiders Chính Thức Ra Mắt Trên Nintendo Switch 2 Ngày 23/7','Splatoon Raiders Launches On Nintendo Switch 2'],
      ['lego-donkey-kong-arcade','LEGO Donkey Kong Arcade (Bộ 72051) Mở Bán 1/8, Giá 199,99 USD, 1.367 Mảnh Ghép','LEGO Donkey Kong Arcade (Set 72051) Launches August 1 At $199.99, 1,367 Pieces'],
      ['rhythm-heaven-groove-nintendo','Rhythm Heaven Groove Chính Thức Ra Mắt Sau 11 Năm, Demo Miễn Phí Vẫn Đang Mở','Rhythm Heaven Groove Is Out Now After 11 Years, Free Demo Still Live'],
      ['oblivion-remastered-switch-2','Oblivion Remastered Chính Thức Lên Nintendo Switch 2, Chạy 1080p Docked/900p Handheld','Oblivion Remastered Launches On Nintendo Switch 2 With DLSS Upscaling']
    ],
    anime:[
      ['detective-conan-final-chapter','Gosho Aoyama Xác Nhận Đã Phác Thảo Storyboard Chương Cuối Thám Tử Lừng Danh Conan','Gosho Aoyama Confirms He Has Already Drafted Detective Conan\'s Final Chapter Storyboard'],
      ['senren-banka-anime-2027','Senren＊Banka Được Chuyển Thể Anime, Dàn Cast Gốc Trở Lại, Ra Mắt 2027','Senren＊Banka Gets Anime Adaptation, Original Cast Returns, 2027 Premiere'],
      ['konosuba-season-4-2027','KONOSUBA Mùa 4 Ấn Định Ra Mắt 2027, Đổi Sang Studio ENGI','KONOSUBA Season 4 Confirmed For 2027, Moves To Studio ENGI'],
      ['free-fire-daybreak-anime-2027','Free Fire Daybreak Tung Key Visual Đầu Tiên, Ấn Định Mùa Xuân 2027','Free Fire Daybreak Reveals Key Visual, Sets Spring 2027 Debut'],
      ['ranma-half-season-3-visual','Ranma 1/2 Mùa 3 Công Bố Key Visual, 5 Diễn Viên Mới Và Ngày Lên Sóng 3/10','Ranma 1/2 Season 3 Reveals Key Visual, Five New Cast Members, October 3 Premiere'],
      ['bleach-tybw-calamity-opening-ending','Bleach TYBW: The Calamity Công Bố OP \'I-BULL\' Và ED \'Rasen\'','Bleach TYBW: The Calamity Reveals OP "I-BULL" and ED "Rasen"'],
      ['galaxy-express-999-new-film','Toei Animation Xác Nhận Phim Galaxy Express 999 Mới, Rintaro Viết Cốt Truyện','Toei Confirms New Galaxy Express 999 Film With Rintaro'],
      ['doraemon-steam-time-machine-film','Doraemon Công Bố Phim Thứ 46: Nobita Đến London Bằng Tàu Thời Gian Hơi Nước','Doraemon Announces 46th Film: Steam-Powered Time Machine'],
      ['rezero-10th-anniversary-visual','Re:ZERO Tung Visual Kỷ Niệm 10 Năm, Hé Lộ Triển Lãm Tại Tokyo Tháng 9','Re:ZERO Reveals 10th Anniversary Visual, Announces Tokyo Exhibition'],
      ['the-bugle-call-anime-2027','The Bugle Call: Song of War Công Bố TV Anime Tại Studio CA Soa, Ra Mắt 2027','The Bugle Call: Song of War Gets TV Anime at CA Soa, Set For 2027'],
      ['magical-buffs-fate-rewinder-crunchyroll','Crunchyroll Xác Nhận Magical Buffs Và Fate Rewinder Sau Showcase Anime Expo 2026','Crunchyroll Confirms Magical Buffs, Fate Rewinder After AX 2026'],
      ['mii-chan-miss-yamada-anime','Mii-chan and Miss Yamada Được Chuyển Thể Anime, Ra Mắt Năm 2027','Mii-chan and Miss Yamada Manga Gets Anime Adaptation in 2027'],
      ['studio-cabana-anime-2027','Manga Studio Cabana Được Chuyển Thể Anime Tại JUVENAGE, Ra Mắt 2027','Studio Cabana Manga Gets TV Anime at JUVENAGE, Set For 2027']
    ],
    manga:[
      ['hanako-kun-manga-resumes','Toilet-Bound Hanako-kun Trở Lại Sau 10 Tháng Gián Đoạn Vì Sức Khỏe Tác Giả','Toilet-Bound Hanako-kun Manga Returns After 10-Month Health Hiatus'],
      ['yen-press-champignon-witch-licenses','Yen Press Cấp Phép Champignon Witch Cùng 9 Manga, Light Novel Mới Tại SDCC 2026','Yen Press Licenses Champignon Witch And 9 More Manga, Light Novels at SDCC 2026'],
      ['akira-toriyama-eisner-hall-of-fame','Akira Toriyama Chính Thức Được Ghi Danh Vào Eisner Hall of Fame','Akira Toriyama Inducted Into the Eisner Hall of Fame'],
      ['crunchyroll-manga-black-torch-hana-kimi','Crunchyroll Manga Bổ Sung Black Torch, Hana-Kimi Trong Đợt Cập Nhật Tháng 7','Crunchyroll Manga Adds Black Torch, Hana-Kimi in July Update']
    ]
  };
  // Dùng lại đúng class .wrap/.sec-h/.sec-t/.sec-l/.sec-more đã có sẵn trên trang
  // (giống hệt khối "Nổi bật tuần này") để khối này hòa vào bố cục chung thay vì
  // trông như 1 mảnh rời được dán thêm vào cuối trang. Chỉ .cln-grid/.cln-card là
  // CSS riêng cho lưới card — dùng var(--cyan) thống nhất, không hardcode màu khác trang.
  var style=document.createElement('style');
  style.textContent='.cln-grid-wrap{padding-bottom:56px}.cln-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:3px}.cln-card{background:var(--surf,#150a2c);color:var(--white,#f3efff);text-decoration:none;border:1px solid rgba(255,255,255,.08);min-width:0;overflow:hidden}.cln-card img{width:100%!important;height:auto!important;aspect-ratio:16/9!important;object-fit:cover!important;object-position:center!important;display:block!important}.cln-copy{padding:14px}.cln-cat{color:var(--cyan,#00e5ff);font-size:10px;letter-spacing:.16em;text-transform:uppercase}.cln-title{font:700 17px/1.35 var(--fd,Arial);margin-top:7px}.cln-card:hover .cln-title{color:var(--cyan,#00e5ff)}@media(max-width:900px){.cln-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.cln-grid-wrap{padding-bottom:42px}.cln-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}.cln-card{min-width:82%;scroll-snap-align:start}}';
  document.head.appendChild(style);
  var section=document.createElement('section');section.className='wrap cln-grid-wrap cln-'+category;
  section.innerHTML='<div class="sec-h"><span class="sec-t">'+(english?'Latest updates':'Tin mới cập nhật')+'</span><div class="sec-l"></div><a class="sec-more" href="'+(english?'/en/news':'/news')+'">'+(english?'View all':'Xem tất cả')+'</a></div><div class="cln-grid">'+stories[category].map(function(s){return '<a class="cln-card" href="'+(english?'/en/':'/')+s[0]+'"><img src="/assets/img/news-'+s[0]+'.jpg" alt="'+(english?s[2]:s[1]).replace(/"/g,'&quot;')+'" loading="lazy" width="1200" height="675"><div class="cln-copy"><div class="cln-cat">'+category+'</div><div class="cln-title">'+(english?s[2]:s[1])+'</div></div></a>'}).join('')+'</div>';
  var footer=document.querySelector('footer');
  if(footer)footer.insertAdjacentElement('beforebegin',section);
  else document.body.appendChild(section);
})();
