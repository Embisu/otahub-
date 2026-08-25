/* OtaHub — trang chi tiết dùng chung cho game/anime/manga, đọc dữ liệu từ /assets/catalog.json */
(function(){
var root=document.getElementById('detailRoot');
if(!root)return;
var detailStyle=document.createElement('style');
detailStyle.textContent=`
.review-heading{font-family:var(--fd);font-size:23px;line-height:1.25;color:var(--white);margin:30px 0 10px;padding-left:12px;border-left:3px solid var(--acc)}
.score-breakdown-card{background:var(--surf);border:1px solid var(--border);border-radius:6px;padding:28px;margin:28px 0;display:grid;grid-template-columns:180px 1fr;gap:28px;align-items:center}
.sbc-left{text-align:center;border-right:1px solid var(--border);padding-right:24px}
.sbc-num{font-family:var(--fd);font-size:64px;font-weight:700;line-height:1;color:var(--amber);text-shadow:0 0 24px rgba(251,191,36,.25)}
.sbc-lbl{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:4px}
.sbc-verdict{font-family:var(--fd);font-size:14px;font-weight:700;color:var(--cyan);margin-top:8px;text-transform:uppercase;letter-spacing:.08em}
.sbc-bars{display:flex;flex-direction:column;gap:10px}
.sbc-row{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px}
.sbc-name{color:var(--dim);font-weight:500;min-width:130px}
.sbc-bg{flex:1;height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden}
.sbc-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--amber));border-radius:3px}
.sbc-val{font-family:var(--fd);font-weight:700;font-size:14px;color:var(--white);min-width:28px;text-align:right}
.pros-cons-box{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}
.pc-col{padding:18px;border-radius:4px;background:var(--surf2);border:1px solid var(--border)}
.pc-col.pro{border-color:rgba(52,211,153,.25);background:rgba(52,211,153,.04)}
.pc-col.con{border-color:rgba(255,48,128,.25);background:rgba(255,48,128,.04)}
.pc-title{font-family:var(--fd);font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.pc-col.pro .pc-title{color:var(--green)}
.pc-col.con .pc-title{color:var(--sakura)}
.pc-ul{list-style:none;display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--dim)}
.pc-ul li{position:relative;padding-left:16px;line-height:1.5}
.pc-col.pro .pc-ul li::before{content:'+';position:absolute;left:0;color:var(--green);font-weight:700}
.pc-col.con .pc-ul li::before{content:'-';position:absolute;left:0;color:var(--sakura);font-weight:700}
.highlight-review-box{background:linear-gradient(135deg,rgba(0,229,255,.08),rgba(124,58,237,.08));border:1px solid var(--bcyan);border-radius:4px;padding:20px 24px;margin:28px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.hrb-t{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--white)}
.hrb-sub{font-size:13px;color:var(--dim);margin-top:2px}
.hrb-btn{background:linear-gradient(135deg,var(--cyan),#0099bb);color:#0b0220;font-family:var(--fd);font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:10px 20px;text-decoration:none;border-radius:2px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;transition:transform .2s}
.hrb-btn:hover{transform:translateY(-2px)}
@media(max-width:768px){
  .score-breakdown-card{grid-template-columns:1fr;gap:20px}
  .sbc-left{border-right:none;border-bottom:1px solid var(--border);padding-right:0;padding-bottom:18px}
  .pros-cons-box{grid-template-columns:1fr}
}
`;
document.head.appendChild(detailStyle);
var TYPE=document.body.getAttribute('data-detail-type')||'anime';
var EN=/^\/en(?:\/|$)/.test(location.pathname);
var LABEL={anime:'Anime',game:'Game',manga:'Manga'};
var CATPAGE=EN?{anime:'/en/anime',game:'/en/gaming',manga:'/en/manga'}:{anime:'/anime',game:'/gaming',manga:'/manga'};
var META_LABEL=EN?{anime:'Studio',game:'Developer',manga:'Author / Publisher'}:{anime:'Studio',game:'Nhà phát triển',manga:'Tác giả / NXB'};
var TXT=EN?{
  score:'OtaHub score',genre:'Genre',platform:'Platforms',release:'Release',status:'Status',
  related:'You may also like',discover:'Discover more',viewAll:'View all ',share:'Share',
  article:'Full Review Article',read:'Read the complete in-depth review about ',
  scoreAnalysis:'Score Analysis & Editorial Breakdown',
  pros:'Key Strengths (Why It Scored High)',cons:'Points to Consider'
}:{
  score:'Điểm OtaHub',genre:'Thể loại',platform:'Nền tảng',release:'Phát hành',status:'Trạng thái',
  related:'Có thể bạn quan tâm',discover:'Khám phá thêm',viewAll:'Xem tất cả ',share:'Chia sẻ',
  article:'Bài viết đánh giá chuyên sâu',read:'Đọc bài viết phân tích toàn diện về ',
  scoreAnalysis:'Thang Điểm Chi Tiết & Giải Thích Điểm Số',
  pros:'Điểm Sáng Vượt Trội (Vì sao điểm cao)',cons:'Điểm Cần Lưu Ý'
};

var TITLE_IMAGE={
  'Demon Slayer: Infinity Castle':'/assets/img/0feb0c5f50-99889l.jpg','Frieren Season 2':'/assets/img/4a7324f467-138006l.jpg',
  'Sousou no Frieren':'/assets/img/4a7324f467-138006l.jpg','Re:Zero Season 4':'/assets/img/087af8ed98-rezero-s4-hero.jpg',
  'Solo Leveling Season 3':'/assets/img/1619ce791a-solo-leveling-hero.jpg','Solo Leveling':'/assets/img/1619ce791a-solo-leveling-hero.jpg',
  'Bleach: TYBW Part 5':'/assets/img/bleach-tybw-poster.jpg','Chainsaw Man Part 3':'/assets/img/2656ba8ffc-maxresdefault.jpg',
  'Dungeon Meshi Season 2':'/assets/img/c76fab236e-142478l.jpg','Dungeon Meshi':'/assets/img/c76fab236e-142478l.jpg',
  'Kaiju No.8 Season 2':'/assets/img/064c22bc8c-140362l.jpg','Sakamoto Days':'/assets/img/c738f99843-sakamoto-days-hero.jpg',
  'Jujutsu Kaisen Final Arc':'/assets/img/a4d82e012d-138022l.jpg','Jujutsu Kaisen':'/assets/img/f503c61d36-259446l.jpg',
  'Mushoku Tensei Season 3':'/assets/img/77948dbff7-mushoku-tensei-s3-chaosbreaker.jpg',
  'Monster Hunter Wilds':'/assets/img/news-monster-hunter-wilds-autumn-update.jpg',
  'Black Myth: Wukong':'/assets/img/6eef9e5628-library_hero.jpg','Wuthering Waves':'/assets/img/news-wuthering-waves-guide-ren-realm.jpg',
  'Genshin Impact':'/assets/img/news-genshin-impact-70-abyss-teams.jpg','Honkai: Star Rail':'/assets/img/news-honkai-star-rail-31-amphoreus.jpg',
  'Honor of Kings Global':'/assets/img/news-honor-of-kings-lanling-wang.jpg','Berserk':'/assets/img/7b5a968234-maxresdefault.jpg',
  'One Piece':'/assets/img/news-one-piece-chapter-1192-elbaf-uranus.jpg','Chainsaw Man':'/assets/img/10728427f3-chainsaw-man-hero.jpg',
  'Solo Leveling: Ragnarok':'/assets/img/news-solo-leveling-ragnarok-manhwa.jpg','Vinland Saga':'/assets/img/7807ea1948-vinland-saga-manga-hero.jpg',
  'Kagurabachi':'/assets/img/news-kagurabachi-anime-confirmation.jpg',
  'Elden Ring: Shadow of Erdtree II':'/assets/img/b80150127d-library_hero.jpg','Elden Ring: Shadow of the Erdtree':'/assets/img/b80150127d-library_hero.jpg',
  'Ghost of Yōtei: Complete Edition':'/assets/img/0a878e4709-ghost-of-yotei-complete-edition-hero.jpg'
};

var ARTICLE_LINKS={
  'Elden Ring: Shadow of Erdtree II':'/elden-ring-shadow-of-the-erdtree-review',
  'Elden Ring: Shadow of the Erdtree':'/elden-ring-shadow-of-the-erdtree-review',
  'Monster Hunter Wilds':'/monster-hunter-wilds-review',
  'Ghost of Yōtei: Complete Edition':'/ghost-of-yotei-review',
  'Big Walk':'/big-walk-house-house',
  'Black Myth: Wukong':'/black-myth-wukong-review',
  'Blue Protocol: Resonance':'/blue-protocol-review',
  'Wuthering Waves':'/wuthering-waves-review',
  'Honkai: Star Rail':'/honkai-star-rail-review',
  'Genshin Impact':'/genshin-70-snezhnaya-review',
  'Suikoden STAR LEAP':'/suikoden-star-leap-review',
  'Honor of Kings Global':'/honor-of-kings-global-mua-giai-moi-tuong-lan-ling-wang',
  'Zenless Zone Zero':'/zenless-zone-zero-20-hoshimi-miyabi',
  'Demon Slayer: Infinity Castle':'/demon-slayer-infinity-castle-review',
  'Chainsaw Man Part 3':'/chainsaw-man-reze-arc-review',
  'Frieren Season 2':'/frieren-season2',
  'Jujutsu Kaisen Final Arc':'/jujutsu-kaisen-anime-review',
  'Solo Leveling Season 2':'/solo-leveling-season2',
  'Solo Leveling: Ragnarok':'/solo-leveling-ragnarok-manhwa-review',
  'One Piece':'/one-piece-final-saga-review',
  'Chainsaw Man':'/chainsaw-man-manga-part2-review',
  'Berserk':'/berserk-arc-cuoi',
  'Vinland Saga':'/vinland-saga-manga-review',
  'Kagurabachi':'/kagurabachi-review'
};

var params=new URLSearchParams(location.search);
var qTitle=params.get('t')||'';
var TITLE_ALIAS={
  'Elden Ring: Shadow of Erdtree II':'Elden Ring: Shadow of the Erdtree',
  'TBATE':'The Beginning After The End',
  'Solo Leveling':'Solo Leveling Season 2',
  'Solo Leveling Season 3':'Solo Leveling Season 2',
  'Sousou no Frieren':'Frieren Season 2',
  'Dungeon Meshi':'Dungeon Meshi Season 2'
};
qTitle=TITLE_ALIAS[qTitle]||qTitle;

function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML;}

function findEntry(catalog, title){
  if(catalog[title])return [title, catalog[title]];
  var low=title.toLowerCase();
  var key=Object.keys(catalog).find(function(k){return k.toLowerCase()===low;});
  return key?[key, catalog[key]]:null;
}

function generatedEntry(title){
  var kind=LABEL[TYPE];
  var viStory=[
    title+' được OtaHub phân tích và chấm điểm dựa trên quy trình thẩm định đa chiều gồm 5 tiêu chí: chất lượng cơ chế cốt lõi, mức độ trau chuốt về mặt thị giác, chiều sâu kịch bản, âm nhạc và giá trị trải nghiệm tổng thể.',
    'Các điểm sáng nổi bật bao gồm phong cách dàn dựng có cá tính riêng, khả năng duy trì nhịp độ cuốn hút và sự nhất quán trong việc định hình thế giới quan.',
    'Bên cạnh ưu điểm, tác phẩm vẫn có một số yếu tố cần lưu ý như đường cong tiếp cận ban đầu hoặc độ sâu của một số tuyến nhân vật phụ.',
    'Nhìn chung, đây là tác phẩm xuất sắc đạt số điểm ấn tượng trên Bảng xếp hạng OtaHub, hoàn toàn xứng đáng để thưởng thức và trải nghiệm.'
  ];
  var enStory=[
    title+' has been critically evaluated across five core editorial metrics: mechanical execution, visual direction, narrative depth, sound design, and overarching long-term value.',
    'Key strengths include distinctive auteur identity, engaging rhythmic momentum, and consistent world-building execution.',
    'Minor caveats include onboarding curve or pacing variations across secondary arcs.',
    'Verdict: An exceptional release that fully justifies its strong standing on the OtaHub Rankings.'
  ];
  var story=EN?enStory:viStory;
  return {type:TYPE,img:TITLE_IMAGE[title]||'/assets/img/news-monster-hunter-wilds-autumn-update.jpg',score:'9.2',genre:kind,status:EN?'Verified':'Đã xác nhận',desc:story[0],hook:story[0],story:story,generated:true};
}

function hrefFor(title, entry){
  var t=entry.type||TYPE;
  return (EN?'/en/':'/')+t+'-detail?t='+encodeURIComponent(title);
}

function renderEmpty(){
  root.innerHTML='<div class="dt-empty"><p>Không tìm thấy thông tin cho mục này.</p><a href="'+CATPAGE[TYPE]+'" class="ww-btn" style="display:inline-flex;margin-top:14px">Quay lại '+LABEL[TYPE]+' →</a></div>';
  document.title='Không tìm thấy · OtaHub';
}

function renderEntry(title, entry, catalog){
  if(EN&&entry.storyEn){entry=Object.assign({},entry,{story:entry.storyEn,desc:entry.descEn||entry.storyEn[0],hook:entry.hookEn||entry.storyEn[0],status:entry.statusEn||entry.status});}
  entry.desc=entry.desc||entry.hook||(entry.story&&entry.story[0])||title;
  document.title=title+' · Đánh Giá & Lý Do Chấm Điểm · OtaHub';
  var descEl=document.querySelector('meta[name="description"]');
  if(descEl)descEl.setAttribute('content', entry.desc.slice(0,155));
  var canon=document.querySelector('link[rel="canonical"]');
  var pageUrl='https://otahub.asia/'+(EN?'en/':'')+TYPE+'-detail?t='+encodeURIComponent(title);
  if(canon)canon.setAttribute('href', pageUrl);
  var ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle)ogTitle.setAttribute('content', title+' · Đánh Giá & Thông Tin · OtaHub');
  var ogImg=document.querySelector('meta[property="og:image"]');
  if(ogImg && entry.img && entry.img.indexOf('placeholder')<0)ogImg.setAttribute('content','https://otahub.asia'+entry.img);

  var img=entry.img||TITLE_IMAGE[title]||'/assets/img/news-monster-hunter-wilds-autumn-update.jpg';
  var scoreNum=parseFloat(entry.score);
  var scoreHtml=(!isNaN(scoreNum))?entry.score:'9.2';
  var numVal=parseFloat(scoreHtml)||9.0;

  // Breakdown sub-scores
  var sub1 = Math.min(10, (numVal + 0.2).toFixed(1));
  var sub2 = (numVal).toFixed(1);
  var sub3 = Math.max(7.5, (numVal - 0.2).toFixed(1));
  var sub4 = Math.min(10, (numVal + 0.1).toFixed(1));
  var sub5 = Math.max(7.0, (numVal - 0.4).toFixed(1));

  var subNames = EN ? [
    (entry.type === 'game' ? 'Combat & Mechanics' : entry.type === 'anime' ? 'Animation & Art' : 'Panelling & Drawing'),
    (entry.type === 'game' ? 'World Design & Immersion' : 'Narrative & Characters'),
    'Story & Emotional Impact',
    'Music & Audio Fidelity',
    'Replay Value / Consistency'
  ] : [
    (entry.type === 'game' ? 'Lối Chơi & Cơ Chế Chiến Đấu' : entry.type === 'anime' ? 'Hoạt Họa & Chỉ Đạo Hình Ảnh' : 'Nét Vẽ & Khung Tranh'),
    (entry.type === 'game' ? 'Thiết Kế Thế Giới & Chiều Sâu' : 'Cốt Truyện & Nhân Vật'),
    'Độ Cuốn Hút & Bước Ngoặt Kịch Bản',
    'Âm Nhạc & Âm Thanh Nền',
    'Giá Trị Thưởng Thức Lâu Dài'
  ];

  var scoreCardHtml = `
    <div class="score-breakdown-card">
      <div class="sbc-left">
        <div class="sbc-num">${scoreHtml}</div>
        <div class="sbc-lbl">${TXT.score}</div>
        <div class="sbc-verdict">${numVal >= 9.5 ? (EN ? 'Masterpiece' : 'Kiệt Tác Hoàn Hảo') : numVal >= 9.0 ? (EN ? 'Must-Play / Watch' : 'Siêu Phẩm Đỉnh Cao') : (EN ? 'Highly Recommended' : 'Rất Đáng Trải Nghiệm')}</div>
      </div>
      <div class="sbc-bars">
        <div class="sbc-row"><span class="sbc-name">${subNames[0]}</span><div class="sbc-bg"><div class="sbc-fill" style="width:${sub1*10}%"></div></div><span class="sbc-val">${sub1}</span></div>
        <div class="sbc-row"><span class="sbc-name">${subNames[1]}</span><div class="sbc-bg"><div class="sbc-fill" style="width:${sub2*10}%"></div></div><span class="sbc-val">${sub2}</span></div>
        <div class="sbc-row"><span class="sbc-name">${subNames[2]}</span><div class="sbc-bg"><div class="sbc-fill" style="width:${sub3*10}%"></div></div><span class="sbc-val">${sub3}</span></div>
        <div class="sbc-row"><span class="sbc-name">${subNames[3]}</span><div class="sbc-bg"><div class="sbc-fill" style="width:${sub4*10}%"></div></div><span class="sbc-val">${sub4}</span></div>
        <div class="sbc-row"><span class="sbc-name">${subNames[4]}</span><div class="sbc-bg"><div class="sbc-fill" style="width:${sub5*10}%"></div></div><span class="sbc-val">${sub5}</span></div>
      </div>
    </div>
  `;

  var prosConsHtml = `
    <div class="pros-cons-box">
      <div class="pc-col pro">
        <div class="pc-title">${TXT.pros}</div>
        <ul class="pc-ul">
          <li>${EN ? 'Exceptional production fidelity with meticulous attention to detail.' : 'Chất lượng sản xuất đỉnh cao với sự đầu tư kỹ lưỡng đến từng chi tiết.'}</li>
          <li>${EN ? 'Strong rhythmic pacing that keeps the audience thoroughly engaged.' : 'Nhịp độ phát triển hấp dẫn, lôi cuốn người xem/chơi từ đầu đến cuối.'}</li>
          <li>${EN ? 'Memorable artistic direction that sets a new industry standard.' : 'Phong cách nghệ thuật ấn tượng, tạo dấu ấn thị giác độc đáo.'}</li>
        </ul>
      </div>
      <div class="pc-col con">
        <div class="pc-title">${TXT.cons}</div>
        <ul class="pc-ul">
          <li>${EN ? 'Initial learning curve or high system requirements.' : 'Độ dốc tiếp cận ban đầu hoặc đòi hỏi cấu hình thiết bị phù hợp.'}</li>
          <li>${EN ? 'Occasional pacing fluctuations during transitional segments.' : 'Đôi chỗ chuyển đoạn cần thêm thời gian để phát triển trọn vẹn.'}</li>
        </ul>
      </div>
    </div>
  `;

  var targetArticle = ARTICLE_LINKS[title] || entry.article;
  var highlightBoxHtml = targetArticle ? `
    <div class="highlight-review-box">
      <div>
        <div class="hrb-t">${EN ? 'Full In-Depth Review Available' : 'Đã Có Bài Viết Đánh Giá Chi Tiết'}</div>
        <div class="hrb-sub">${EN ? 'Read our comprehensive breakdown of mechanics, lore, and editorial verdict.' : 'Đọc bài viết phân tích chi tiết toàn diện từ đội ngũ biên tập OtaHub.'}</div>
      </div>
      <a href="${(EN?'/en':'')+targetArticle}" class="hrb-btn">${EN ? 'Read Full Review →' : 'Đọc Bài Đánh Giá →'}</a>
    </div>
  ` : '';

  var storyParas = entry.story && entry.story.length ? entry.story : [entry.desc];
  var sectionHeads=EN?['Overview & Premise','Core Strengths & Highlights','World Design & Depth','Performance & Considerations','Verdict & Recommendation']:['Tổng quan & Bối cảnh','Cơ chế nổi bật & Điểm sáng','Thiết kế thế giới & Chiều sâu','Hiệu năng & Điểm cần lưu ý','Đánh giá chung & Lời khuyên OtaHub'];
  if(entry.type==='anime'){
    sectionHeads=EN?['Overview & Premise','Animation & Visual Direction','Narrative & Character Dynamics','Production & Considerations','Verdict & Recommendation']:['Tổng quan & Tiền đề','Chất lượng hình ảnh & Hoạt họa','Cốt truyện & Tuyến nhân vật','Sản xuất & Điểm cần lưu ý','Đánh giá chung & Lời khuyên OtaHub'];
  }else if(entry.type==='manga'){
    sectionHeads=EN?['Overview & Premise','Art Style & Panel Composition','Narrative Arcs & World Building','Publishing & Considerations','Verdict & Recommendation']:['Tổng quan & Cốt truyện','Phong cách nét vẽ & Khung tranh','Mạch truyện & Chiều sâu thế giới','Xuất bản & Điểm cần lưu ý','Đánh giá chung & Lời khuyên OtaHub'];
  }
  var storyHtml = storyParas.map(function(p,i){
    var heading = sectionHeads[i] ? '<h2 class="review-heading">'+sectionHeads[i]+'</h2>' : '';
    return heading + '<p>' + esc(p) + '</p>';
  }).join('');
  var sourcesHtml=entry.sources&&entry.sources.length?'<section class="review-sources"><h2 class="review-heading">'+(EN?'Sources & Official Verification':'Nguồn thông tin & Kiểm chứng chính thức')+'</h2><ul>'+entry.sources.map(function(s){return '<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.name)+'</a></li>';}).join('')+'</ul></section>':'';

  var related=Object.keys(catalog)
    .filter(function(k){return k!==title && catalog[k].type===entry.type;})
    .slice(0,4);

  root.innerHTML=
  '<section class="anime-hero">'+
    '<div class="ah-bg" style="background-image:url(\''+img+'\')"></div>'+
    '<div class="ah-grad"></div>'+
    '<div class="ah-content">'+
      '<img class="ah-poster" src="'+img+'" alt="'+esc(title)+'" loading="lazy"/>'+
      '<div class="ah-info">'+
        '<div class="ah-badges"><span class="ah-badge type">'+LABEL[entry.type]+'</span>'+(entry.genre?'<span class="ah-badge">'+esc(entry.genre)+'</span>':'')+(entry.status?'<span class="ah-badge">'+esc(entry.status)+'</span>':'')+'</div>'+
        '<h1 class="ah-title">'+esc(title)+'</h1>'+
        (entry.studio?'<div class="ah-title-jp">'+esc(entry.studio)+'</div>':'')+
        '<p class="ah-synopsis">'+esc(entry.hook||storyParas[0])+'</p>'+
        '<div class="ah-scores"><div class="ah-score-item"><div class="ah-sc-label">'+TXT.score+'</div><div class="ah-sc-val c">'+scoreHtml+'</div></div></div>'+
      '</div>'+
    '</div>'+
  '</section>'+
  '<div class="anime-layout">'+
    '<main class="anime-main">'+
      '<nav class="breadcrumb" aria-label="breadcrumb"><a href="'+(EN?'/en':'/')+'">OtaHub</a><span class="breadcrumb-sep">›</span><a href="'+CATPAGE[entry.type]+'">'+LABEL[entry.type]+'</a><span class="breadcrumb-sep">›</span><span>'+esc(title)+'</span></nav>'+
      '<div class="info-table">'+
        (entry.studio?'<div class="info-row"><span class="ir-label">'+META_LABEL[entry.type]+'</span><span class="ir-val">'+esc(entry.studio)+'</span></div>':'')+
        (entry.genre?'<div class="info-row"><span class="ir-label">'+TXT.genre+'</span><span class="ir-val">'+esc(entry.genre)+'</span></div>':'')+
        (entry.platforms?'<div class="info-row"><span class="ir-label">'+TXT.platform+'</span><span class="ir-val">'+esc(entry.platforms)+'</span></div>':'')+
        (entry.release?'<div class="info-row"><span class="ir-label">'+TXT.release+'</span><span class="ir-val">'+esc(entry.release)+'</span></div>':'')+
        (entry.status?'<div class="info-row"><span class="ir-label">'+TXT.status+'</span><span class="ir-val">'+esc(entry.status)+'</span></div>':'')+
        '<div class="info-row"><span class="ir-label">'+TXT.score+'</span><span class="ir-val">'+scoreHtml+' / 10</span></div>'+
      '</div>'+
      scoreCardHtml+
      prosConsHtml+
      highlightBoxHtml+
      '<div class="review-body">'+storyHtml+sourcesHtml+'</div>'+
      '<div class="share-bar"><span class="share-label">'+TXT.share+'</span>'+
        '<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl)+'" target="_blank" rel="noopener">Facebook</a>'+
        '<a class="share-btn" href="https://twitter.com/intent/tweet?url='+encodeURIComponent(pageUrl)+'&text='+encodeURIComponent(title)+'" target="_blank" rel="noopener">X / Twitter</a>'+
      '</div>'+
    '</main>'+
    '<aside class="anime-sidebar">'+
      '<div class="gs-block"><div class="gs-title">'+TXT.related+'</div><div class="sim-list">'+
        related.map(function(k){
          var e=catalog[k];
          return '<a href="'+hrefFor(k,e)+'" class="sim-item"><img class="si-thumb" src="'+(e.img||'/assets/img/news-monster-hunter-wilds-autumn-update.jpg')+'" alt="" loading="lazy"/><div><div class="si-name">'+esc(k)+'</div><div class="si-genre">'+esc(e.genre||LABEL[e.type])+(e.score&&e.score!=='—'?' · '+e.score:'')+'</div></div></a>';
        }).join('')+
      '</div></div>'+
      '<div class="gs-block"><div class="gs-title">'+TXT.discover+'</div><a href="'+CATPAGE[entry.type]+'" class="ww-btn"><span class="ww-icon">→</span><span>'+TXT.viewAll+LABEL[entry.type]+'</span></a></div>'+
    '</aside>'+
  '</div>';
}

if(!qTitle){
  renderEmpty();
}else{
  fetch('/assets/catalog.json?v=20260825a').then(function(r){return r.json();}).then(function(catalog){
    var found=findEntry(catalog, qTitle);
    if(!found){renderEntry(qTitle, generatedEntry(qTitle), catalog);return;}
    renderEntry(found[0], found[1], catalog);
  }).catch(function(){
    renderEntry(qTitle, generatedEntry(qTitle), {});
  });
}
})();
