(function(){
  var match=location.pathname.match(/\/(?:en\/)?(gaming|anime|manga)(?:\.html)?\/?$/);
  if(!match)return;
  var category=match[1], english=/^\/en\//.test(location.pathname);
  var stories={
    gaming:[
      ['playstation-plus-august-2026','PlayStation Plus tháng 8/2026 có Dying Light 2, Big Walk và Signalis','PlayStation Plus August 2026 includes Dying Light 2, Big Walk and Signalis'],
      ['silent-hill-townfall-gameplay','Silent Hill: Townfall hé lộ bối cảnh Scotland và gameplay','Silent Hill: Townfall details its Scotland setting and gameplay'],
      ['ball-x-pit-naturalist-update','Ball x Pit phát hành bản cập nhật cuối The Naturalist','Ball x Pit releases final update The Naturalist'],
      ['flamecraft-ps5-demo','Flamecraft xác nhận bản PS5, demo đã có thể trải nghiệm','Flamecraft confirms PS5 version, demo available now'],
      ['marvel-tokon-phoenix-cyclops-dlc','MARVEL Tōkon công bố Phoenix Cyclops là DLC đầu tiên','MARVEL Tōkon reveals Phoenix Cyclops as first DLC fighter'],
      ['marvel-wolverine-story-trailer','Marvel’s Wolverine tung trailer cốt truyện mới','Marvel’s Wolverine releases a new story trailer'],
      ['halo-campaign-evolved-modernizes','Halo: Campaign Evolved nêu 13 thay đổi mới','Halo: Campaign Evolved outlines 13 upgrades'],
      ['dragon-ball-sparking-zero-neo-dlc','Dragon Ball: Sparking Zero phát hành DLC Neo','Dragon Ball: Sparking Zero releases Neo DLC'],
      ['lous-lagoon-ps5-august-27','Lou’s Lagoon lên PS5 ngày 27/8','Lou’s Lagoon comes to PS5 August 27'],
      ['order-of-the-sinking-star-ps5','Order of the Sinking Star công bố bản PS5','Order of the Sinking Star reveals PS5 version'],
      ['xbox-game-pass-july-wave-2','Xbox Game Pass bổ sung Halo và nhiều game mới','Xbox Game Pass adds Halo and more games'],
      ['splatoon-raiders-launch','Splatoon Raiders phát hành trên Nintendo Switch 2','Splatoon Raiders launches on Nintendo Switch 2'],
      ['lego-donkey-kong-arcade','LEGO Donkey Kong Arcade mở bán ngày 1/8','LEGO Donkey Kong Arcade launches August 1'],
      ['rhythm-heaven-groove-nintendo','Rhythm Heaven Groove giới thiệu gameplay và demo','Rhythm Heaven Groove shares gameplay and demo details'],
      ['oblivion-remastered-switch-2','Oblivion Remastered lên Nintendo Switch 2','Oblivion Remastered comes to Nintendo Switch 2']
    ],
    anime:[
      ['senren-banka-anime-2027','Senren＊Banka được chuyển thể anime năm 2027','Senren＊Banka anime adaptation announced for 2027'],
      ['konosuba-season-4-2027','KONOSUBA mùa 4 xác nhận phát sóng năm 2027','KONOSUBA Season 4 confirms 2027 broadcast'],
      ['free-fire-daybreak-anime-2027','Free Fire Daybreak lên sóng mùa xuân 2027','Free Fire Daybreak premieres spring 2027'],
      ['ranma-half-season-3-visual','Ranma 1/2 mùa 3 giới thiệu visual và dàn cast mới','Ranma 1/2 Season 3 reveals visual and new cast'],
      ['bleach-tybw-calamity-opening-ending','Bleach TYBW: The Calamity phát hành opening và ending','Bleach TYBW: The Calamity releases opening and ending'],
      ['galaxy-express-999-new-film','Galaxy Express 999 công bố phim anime mới','Galaxy Express 999 announces a new anime film'],
      ['doraemon-steam-time-machine-film','Doraemon công bố phim Cỗ máy thời gian hơi nước','Doraemon announces Steam-Powered Time Machine film'],
      ['rezero-10th-anniversary-visual','Re:ZERO tung visual kỷ niệm 10 năm','Re:ZERO reveals 10th anniversary visual'],
      ['the-bugle-call-anime-2027','The Bugle Call công bố anime 2027','The Bugle Call anime announced for 2027'],
      ['magical-buffs-fate-rewinder-crunchyroll','Magical Buffs và Fate Rewinder đến Crunchyroll','Magical Buffs and Fate Rewinder come to Crunchyroll'],
      ['mii-chan-miss-yamada-anime','Mii-chan and Miss Yamada được chuyển thể anime','Mii-chan and Miss Yamada anime announced'],
      ['studio-cabana-anime-2027','Studio Cabana xác nhận anime năm 2027','Studio Cabana anime confirmed for 2027']
    ],
    manga:[
      ['yen-press-champignon-witch-licenses','Yen Press công bố Champignon Witch và manga mới','Yen Press announces Champignon Witch and new manga licenses'],
      ['akira-toriyama-eisner-hall-of-fame','Akira Toriyama được ghi danh vào Eisner Hall of Fame','Akira Toriyama inducted into the Eisner Hall of Fame'],
      ['crunchyroll-manga-black-torch-hana-kimi','Crunchyroll Manga thêm Black Torch và Hana-Kimi','Crunchyroll Manga adds Black Torch and Hana-Kimi']
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
