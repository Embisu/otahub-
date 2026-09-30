/* OtaHub, trang chi tiết dùng chung cho game/anime/manga, đọc dữ liệu từ /assets/catalog.json */
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
.profile-kicker{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);font-weight:700;margin-bottom:10px}
.credit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1px solid var(--border);margin:28px 0}
.credit-item{padding:18px 20px;border-right:1px solid var(--border);border-bottom:1px solid var(--border)}
.credit-item:nth-child(2n){border-right:0}.credit-label{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:5px}.credit-value{font-size:15px;color:var(--white);font-weight:600}
.article-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:18px 0 34px}
.article-card{display:grid;grid-template-columns:112px 1fr;min-height:100px;text-decoration:none;background:var(--surf);border:1px solid var(--border);transition:transform .2s,border-color .2s;overflow:hidden}.article-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--acc) 45%,transparent)}
.article-card img{width:112px;height:100%;object-fit:cover}.article-copy{padding:13px}.article-type{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);font-weight:700}.article-title{font-family:var(--fd);font-size:16px;line-height:1.25;color:var(--white);font-weight:700;margin-top:5px}
.review-note{font-size:12px;color:var(--muted);margin-top:6px}
@media(max-width:768px){
  .score-breakdown-card{grid-template-columns:1fr;gap:20px}
  .sbc-left{border-right:none;border-bottom:1px solid var(--border);padding-right:0;padding-bottom:18px}
  .pros-cons-box{grid-template-columns:1fr}
  .credit-grid,.article-grid{grid-template-columns:1fr}.credit-item,.credit-item:nth-child(2n){border-right:0}.article-card{grid-template-columns:96px 1fr}.article-card img{width:96px}
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
var RECO={'hades':'recommend-hades.jpg','stardew valley':'recommend-stardew.jpg','cyberpunk 2077':'recommend-cyberpunk.jpg','disco elysium':'recommend-disco.jpg','hollow knight':'recommend-hollow.jpg','celeste':'recommend-celeste.jpg','limbus company':'recommend-limbus.jpg','journey':'recommend-journey.jpg','abzû':'recommend-abzu.jpg','spiritfarer':'recommend-spiritfarer.jpg','overcooked! 2':'recommend-overcooked2.jpg','among us':'recommend-amongus.jpg','it takes two':'recommend-ittakestwo.jpg'};
function pickImg(title){
  if(TITLE_IMAGE[title])return TITLE_IMAGE[title];
  var k=(title||'').toLowerCase();
  if(RECO[k])return '/assets/img/'+RECO[k];
  try{var L=window.IDX||[];var t=k.replace(/[^a-z0-9 ]/g,'');
    for(var i=0;i<L.length;i++){var lt=(L[i].title||'').toLowerCase().replace(/[^a-z0-9 ]/g,'');if(t.length>5&&lt.indexOf(t)===0&&L[i].img)return L[i].img;}
    for(var j=0;j<L.length;j++){var l2=(L[j].title||'').toLowerCase().replace(/[^a-z0-9 ]/g,'');if(t.length>5&&l2.indexOf(t)>-1&&L[j].img)return L[j].img;}
  }catch(e){}
  return '';
}


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

var TITLE_CREDITS={
  'Elden Ring: Shadow of the Erdtree':[['Nhà phát triển','FromSoftware'],['Nhà phát hành','Bandai Namco Entertainment'],['Đạo diễn','Hidetaka Miyazaki'],['Xây dựng thế giới gốc','Hidetaka Miyazaki, George R. R. Martin']],
  'Monster Hunter Wilds':[['Nhà phát triển & phát hành','Capcom'],['Đạo diễn','Yuya Tokuda'],['Nhà sản xuất','Ryozo Tsujimoto'],['Dòng game','Monster Hunter']],
  'Ghost of Yōtei: Complete Edition':[['Nhà phát triển','Sucker Punch Productions'],['Nhà phát hành','Sony Interactive Entertainment'],['Đồng giám đốc sáng tạo','Nate Fox, Jason Connell'],['Diễn viên vai Atsu','Erika Ishii']],
  'Big Walk':[['Nhà phát triển','House House'],['Nhà phát hành','Panic'],['Hình thức chơi','Co-op trực tuyến'],['Tình trạng','Dự kiến phát hành năm 2026']],
  'Black Myth: Wukong':[['Nhà phát triển & phát hành','Game Science'],['Đạo diễn','Feng Ji'],['Nguồn cảm hứng','Tây Du Ký của Ngô Thừa Ân'],['Công nghệ','Unreal Engine 5']],
  'Wuthering Waves':[['Nhà phát triển & phát hành','Kuro Games'],['Tên thế giới','Solaris-3'],['Nhân vật người chơi','Rover'],['Mô hình','Free-to-play']],
  'Honkai: Star Rail':[['Nhà phát triển','miHoYo'],['Phát hành toàn cầu','HoYoverse'],['Nhân vật người chơi','Trailblazer'],['Mô hình','Free-to-play']],
  'Genshin Impact':[['Nhà phát triển','miHoYo'],['Phát hành toàn cầu','HoYoverse'],['Nhân vật người chơi','Traveler'],['Mô hình','Free-to-play']],
  'Suikoden STAR LEAP':[['Nhà phát triển & phát hành','Konami Digital Entertainment'],['Vũ trụ','Suikoden'],['Hệ thống nhân vật','108 Stars of Destiny'],['Mô hình','Free-to-play']],
  'Honor of Kings Global':[['Nhà phát triển','TiMi Studio Group'],['Phát hành quốc tế','Level Infinite'],['Thể thức','MOBA 5v5'],['Mô hình','Free-to-play']]
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
  var viStory=[title+' đã có hồ sơ riêng để tập hợp các bài viết và review trên OtaHub.', 'Thông tin cốt truyện, đội ngũ sản xuất, tác giả hoặc dàn diễn viên đang được ban biên tập đối chiếu từ nguồn chính thức.', 'Trong lúc hồ sơ được hoàn thiện, bạn có thể xem các bài liên quan bên dưới. OtaHub không tự điền dữ kiện hoặc điểm số khi chưa kiểm chứng.'];
  var enStory=[title+' now has a dedicated hub for OtaHub coverage and reviews.', 'Story, production credits, creator and cast information are being checked against official sources.', 'While the profile is being completed, browse the related coverage below. OtaHub does not auto-fill unverified facts or scores.'];
  var story=EN?enStory:viStory;
  return {type:TYPE,img:pickImg(title),score:' - ',genre:kind,status:EN?'Being verified':'Đang kiểm chứng',desc:story[0],hook:story[0],story:story,generated:true};
}

function hrefFor(title, entry){
  var t=entry.type||TYPE;
  return (EN?'/en/':'/')+t+'-detail?t='+encodeURIComponent(title);
}

function detailArticles(title, entry){
  var normalized=(title||'').toLowerCase().replace(/[^a-z0-9à-ỹ]+/g,' ').trim();
  var tokens=normalized.split(/\s+/).filter(function(x){return x.length>2&&!/^(the|and|season|part|final|arc|game|manga|anime)$/.test(x);});
  var all=window.IDX||[];
  var matches=all.map(function(a){
    var hay=((a.title||'')+' '+(a.desc||'')+' '+((a.tags||[]).join(' '))).toLowerCase();
    var score=tokens.reduce(function(n,t){return n+(hay.indexOf(t)>-1?1:0);},0);
    return {a:a,score:score};
  }).filter(function(x){return x.score>=Math.max(1,Math.min(2,tokens.length));}).sort(function(a,b){return b.score-a.score;}).slice(0,6).map(function(x){return x.a;});
  var review=ARTICLE_LINKS[title]||entry.article;
  if(review&&!matches.some(function(a){return a.url===review||a.href===review;})){
    matches.unshift({url:review,title:(EN?'In-depth review: ':'Đánh giá chuyên sâu: ')+title,img:entry.img,cat:'Review'});
  }
  return matches.slice(0,6);
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
  var robots=document.querySelector('meta[name="robots"]');
  if(robots)robots.setAttribute('content',entry.generated?'noindex, follow':'index, follow, max-image-preview:large');
  var ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle)ogTitle.setAttribute('content', title+' · Đánh Giá & Thông Tin · OtaHub');
  var ogImg=document.querySelector('meta[property="og:image"]');
  if(ogImg && entry.img && entry.img.indexOf('placeholder')<0)ogImg.setAttribute('content','https://otahub.asia'+entry.img);
  var ogUrl=document.querySelector('meta[property="og:url"]');if(ogUrl)ogUrl.setAttribute('content',pageUrl);
  var schema=document.createElement('script');schema.type='application/ld+json';
  var schemaData={'@context':'https://schema.org','@type':entry.type==='game'?'VideoGame':entry.type==='anime'?'TVSeries':'Book','name':title,'description':entry.desc,'url':pageUrl,'image':entry.img?'https://otahub.asia'+entry.img:undefined,'genre':entry.genre};
  if(entry.release)schemaData.datePublished=entry.release;if(entry.platforms)schemaData.gamePlatform=entry.platforms;
  if(!isNaN(parseFloat(entry.score)))schemaData.review={'@type':'Review','author':{'@type':'Organization','name':'OtaHub Editorial'},'reviewRating':{'@type':'Rating','ratingValue':entry.score,'bestRating':'10','worstRating':'0'}};
  schema.textContent=JSON.stringify(schemaData);document.head.appendChild(schema);

  var img=entry.img||pickImg(title);
  var scoreNum=parseFloat(entry.score);
  var scoreHtml=(!isNaN(scoreNum))?entry.score:' - ';
  var numVal=parseFloat(scoreHtml)||0;

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

  var scoreCardHtml = '<div class="score-breakdown-card"><div class="sbc-left"><div class="sbc-num">'+scoreHtml+'</div><div class="sbc-lbl">'+TXT.score+'</div></div><div><div class="profile-kicker">'+(EN?'Editorial score':'Điểm biên tập')+'</div><p style="color:var(--dim);line-height:1.75">'+(EN?'The score belongs to OtaHub’s editorial ranking. Component scores are shown only when a published review provides an explicit rubric.':'Đây là điểm xếp hạng do ban biên tập OtaHub công bố. Điểm thành phần chỉ xuất hiện khi bài review có thang chấm cụ thể; hệ thống không tự suy diễn từ điểm tổng.')+'</p></div></div>';

  var credits=entry.credits||((TITLE_CREDITS[title]||[]).map(function(c){return {label:c[0],value:c[1]};}));
  var creditsHtml=credits.length?'<h2 class="review-heading">'+(EN?'Cast & credits':'Đội ngũ & thông tin sản xuất')+'</h2><div class="credit-grid">'+credits.map(function(c){return '<div class="credit-item"><div class="credit-label">'+esc(EN&&c.labelEn?c.labelEn:c.label)+'</div><div class="credit-value">'+esc(c.value)+'</div></div>';}).join('')+'</div>':'';
  var articles=detailArticles(title,entry);
  var articlesHtml='<h2 class="review-heading">'+(EN?'Articles about this title':'Bài viết về tác phẩm')+'</h2>'+(articles.length?'<div class="article-grid">'+articles.map(function(a){var u=a.url||a.href||'#';if(EN&&u.charAt(0)==='/'&&u.indexOf('/en/')!==0)u='/en'+u;return '<a class="article-card" href="'+esc(u)+'"><img src="'+esc(a.img||entry.img||'/assets/img/placeholder.svg')+'" alt="" loading="lazy"><div class="article-copy"><div class="article-type">'+esc(a.cat||a.category||'OtaHub')+'</div><div class="article-title">'+esc(a.title||title)+'</div></div></a>';}).join('')+'</div>':'<p class="review-note">'+(EN?'No separate article has been published yet. This profile will be updated when coverage is available.':'Chưa có bài viết riêng. Hồ sơ sẽ tự cập nhật khi OtaHub xuất bản nội dung liên quan.')+'</p>');

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
      (img?'<img class="ah-poster" src="'+img+'" alt="'+esc(title)+'" loading="lazy"/>':'')+
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
      creditsHtml+
      highlightBoxHtml+
      '<div class="review-body">'+storyHtml+sourcesHtml+'</div>'+
      articlesHtml+
      '<div class="share-bar"><span class="share-label">'+TXT.share+'</span>'+
        '<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl)+'" target="_blank" rel="noopener">Facebook</a>'+
        '<a class="share-btn" href="https://twitter.com/intent/tweet?url='+encodeURIComponent(pageUrl)+'&text='+encodeURIComponent(title)+'" target="_blank" rel="noopener">X / Twitter</a>'+
      '</div>'+
    '</main>'+
    '<aside class="anime-sidebar">'+
      '<div class="gs-block"><div class="gs-title">'+TXT.related+'</div><div class="sim-list">'+
        related.map(function(k){
          var e=catalog[k];
          return '<a href="'+hrefFor(k,e)+'" class="sim-item"><img class="si-thumb" src="'+(e.img||pickImg(k)||'/assets/img/placeholder.svg')+'" alt="" loading="lazy"/><div><div class="si-name">'+esc(k)+'</div><div class="si-genre">'+esc(e.genre||LABEL[e.type])+(e.score&&e.score!==' - '?' · '+e.score:'')+'</div></div></a>';
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
