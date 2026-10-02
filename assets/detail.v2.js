/* OtaHub, trang chi tiết dùng chung cho game/anime/manga, đọc dữ liệu từ /assets/catalog.json */
(function(){
var root=document.getElementById('detailRoot');
if(!root)return;
var detailStyle=document.createElement('style');
detailStyle.textContent=`
.ah-bg{filter:blur(22px) saturate(1.15) brightness(.55);transform:scale(1.12)}
.ah-poster{border-radius:6px;background:var(--surf)}
.anime-hero.is-wide .ah-poster{width:320px;height:180px}
.ah-badge.type{border-color:color-mix(in srgb,var(--acc) 40%,transparent);background:color-mix(in srgb,var(--acc) 8%,transparent)}
.ah-scores{align-items:center;gap:14px 18px}
.ah-score{display:flex;align-items:center;gap:14px;padding:10px 16px 10px 12px;border:1px solid rgba(255,255,255,.12);background:rgba(11,4,24,.55);border-radius:8px}
.ah-score-num{font-family:var(--fd);font-weight:800;font-size:38px;line-height:1;color:var(--amber);text-shadow:0 0 22px rgba(251,191,36,.25)}
.ah-score-num small{font-size:14px;color:var(--muted);font-weight:600;margin-left:2px}
.ah-score-meta{display:flex;flex-direction:column;gap:3px}
.ah-score-verdict{font-family:var(--fd);font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--white)}
.ah-score-src{font-size:12px;color:var(--muted)}
.ah-unscored{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border:1px dashed rgba(255,255,255,.2);border-radius:8px;font-size:13px;color:var(--dim)}
.ah-cta{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 20px;border-radius:8px;background:var(--acc);color:#0b0220;font-family:var(--fd);font-weight:700;font-size:13px;letter-spacing:.04em;text-decoration:none;transition:transform .2s,box-shadow .2s}
.ah-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px color-mix(in srgb,var(--acc) 35%,transparent)}
.review-heading{font-family:var(--fd);font-size:23px;line-height:1.25;color:var(--white);margin:34px 0 12px;padding-left:12px;border-left:3px solid var(--acc)}
.verdict-card{display:grid;grid-template-columns:150px 1fr;gap:26px;align-items:center;margin:8px 0 30px;padding:24px 26px;border:1px solid color-mix(in srgb,var(--acc) 30%,transparent);background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 7%,transparent),rgba(124,58,237,.06));border-radius:10px}
.vc-score{text-align:center;padding-right:24px;border-right:1px solid var(--border)}
.vc-num{font-family:var(--fd);font-size:58px;font-weight:800;line-height:1;color:var(--amber)}
.vc-lbl{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-top:6px}
.vc-verdict{font-family:var(--fd);font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--acc);margin-bottom:8px}
.vc-quote{font-size:16px;line-height:1.7;color:var(--dim);margin:0}
.vc-note{font-size:13px;color:var(--muted);margin-top:8px}
.vc-btn{display:inline-flex;align-items:center;gap:6px;margin-top:14px;min-height:44px;padding:0 18px;border:1px solid color-mix(in srgb,var(--acc) 55%,transparent);border-radius:8px;color:var(--acc);font-family:var(--fd);font-weight:700;font-size:13px;text-decoration:none;transition:background .2s}
.vc-btn:hover{background:color-mix(in srgb,var(--acc) 10%,transparent)}
.unscored-card{margin:8px 0 30px;padding:16px 20px;border:1px dashed rgba(255,255,255,.16);border-radius:10px;font-size:14px;line-height:1.7;color:var(--muted)}
.unscored-card strong{color:var(--dim)}
.credit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;margin:0 0 8px}
.credit-item{padding:14px 18px;background:var(--surf)}
.credit-label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#888896;margin-bottom:4px}.credit-value{font-size:15px;color:var(--white);font-weight:600}
.review-sources ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px}
.review-sources a{color:var(--acc);text-decoration:none;font-size:15px;border-bottom:1px solid color-mix(in srgb,var(--acc) 30%,transparent)}
.article-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:18px 0 34px}
.article-card{display:grid;grid-template-columns:112px 1fr;min-height:100px;text-decoration:none;background:var(--surf);border:1px solid var(--border);border-radius:8px;transition:transform .2s,border-color .2s;overflow:hidden}.article-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--acc) 45%,transparent)}
.article-card img{width:112px;height:100%;object-fit:cover}.article-copy{padding:13px}.article-type{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);font-weight:700}.article-title{font-family:var(--fd);font-size:15px;line-height:1.3;color:var(--white);font-weight:700;margin-top:5px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.review-note{font-size:14px;color:var(--muted);margin-top:6px}
.sim-item{border-radius:6px}.si-thumb{border-radius:4px}
.si-score{color:var(--amber);font-weight:700}
@media(max-width:960px){
  .anime-sidebar{display:block;padding:0 0 calc(80px + env(safe-area-inset-bottom))}
}
@media(max-width:768px){
  .ah-content{padding:24px 16px 28px}
  .ah-poster{width:120px;height:170px}
  .anime-hero.is-wide .ah-poster{width:100%;height:auto;aspect-ratio:16/9}
  .ah-synopsis{font-size:15.5px;line-height:1.7}
  .ah-score-num{font-size:32px}
  .ah-cta{flex:1 1 100%;justify-content:center}
  .verdict-card{grid-template-columns:1fr;gap:16px;padding:20px}
  .vc-score{display:flex;align-items:baseline;gap:12px;text-align:left;padding:0 0 14px;border-right:0;border-bottom:1px solid var(--border)}
  .vc-num{font-size:44px}.vc-lbl{margin-top:0}
  .vc-btn{width:100%;justify-content:center}
  .credit-grid,.article-grid{grid-template-columns:1fr}
  .article-card{grid-template-columns:96px 1fr}.article-card img{width:96px}
  .review-heading{font-size:20px;margin-top:28px}
  .review-body{font-size:16.5px;line-height:1.8}
}
`;
document.head.appendChild(detailStyle);
var TYPE=document.body.getAttribute('data-detail-type')||'anime';
var EN=/^\/en(?:\/|$)/.test(location.pathname);
var LABEL={anime:'Anime',game:'Game',manga:'Manga'};
var CATPAGE=EN?{anime:'/en/anime',game:'/en/gaming',manga:'/en/manga'}:{anime:'/anime',game:'/gaming',manga:'/manga'};
var META_LABEL=EN?{anime:'Studio',game:'Developer',manga:'Author / Publisher'}:{anime:'Studio',game:'Nhà phát triển',manga:'Tác giả / NXB'};
var CREDIT_LABEL_EN={
  'Nhà phát triển':'Developer','Nhà phát hành':'Publisher','Nhà phát triển & phát hành':'Developer & publisher',
  'Phát hành toàn cầu':'Global publisher','Đạo diễn':'Director','Đồng giám đốc sáng tạo':'Co-creative directors',
  'Nhà sản xuất':'Producer','Xây dựng thế giới gốc':'Original worldbuilding','Dòng game':'Series',
  'Nguồn cảm hứng':'Source material','Công nghệ':'Technology','Tên thế giới':'World',
  'Nhân vật người chơi':'Player character','Mô hình':'Business model','Vũ trụ':'Universe',
  'Hệ thống nhân vật':'Character system','Thể thức':'Format','Hình thức chơi':'Play mode',
  'Tình trạng':'Status','Diễn viên vai Atsu':'Atsu voice actor'
};
var TXT=EN?{
  score:'OtaHub score',genre:'Genre',platform:'Platforms',release:'Release',status:'Status',
  related:'You may also like',discover:'Discover more',viewAll:'View all ',share:'Share',
  readReview:'Read the review',fromReview:'From the OtaHub review',fromHub:'From the OtaHub reviews page',
  unscored:'Not scored yet',unscoredNote:'OtaHub only shows a score once a full review of this title has been published. This profile covers the facts and our coverage so far.',
  overview:'Overview',take:"OtaHub's take",verdict:'Verdict',credits:'Credits',sources:'Sources',articles:'Articles about this title',
  noArticles:'No separate article has been published yet. This profile will be updated when coverage is available.'
}:{
  score:'Điểm OtaHub',genre:'Thể loại',platform:'Nền tảng',release:'Phát hành',status:'Trạng thái',
  related:'Có thể bạn quan tâm',discover:'Khám phá thêm',viewAll:'Xem tất cả ',share:'Chia sẻ',
  readReview:'Đọc bài review',fromReview:'Theo bài review OtaHub',fromHub:'Theo trang Đánh giá OtaHub',
  unscored:'Chưa chấm điểm',unscoredNote:'OtaHub chỉ hiển thị điểm khi đã đăng bài review đầy đủ cho tác phẩm này. Hồ sơ hiện tổng hợp thông tin chính thức và các bài viết liên quan.',
  overview:'Giới thiệu',take:'Nhận định của OtaHub',verdict:'Kết luận',credits:'Đội ngũ & thông tin sản xuất',sources:'Nguồn thông tin chính thức',articles:'Bài viết về tác phẩm',
  noArticles:'Chưa có bài viết riêng. Hồ sơ sẽ tự cập nhật khi OtaHub xuất bản nội dung liên quan.'
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
  'Genshin Impact':'/assets/img/news-genshin-impact-70-abyss-teams.jpg','Honkai: Star Rail':'/assets/img/news-honkai-star-rail-30-amphoreus.jpg',
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
  'Kaiju No 8':'Kaiju No.8',
  'Ghost of Yōtei':'Ghost of Yōtei: Complete Edition',
  'Bleach: TYBW Part 5':'Bleach: TYBW Final Part'
};
var TYPE_ENTRY_ALIAS={
  'anime|Chainsaw Man':'Chainsaw Man (Anime)',
  'anime|Jujutsu Kaisen':'Jujutsu Kaisen (Anime)'
};
qTitle=TITLE_ALIAS[qTitle]||qTitle;

// Ảnh thu nhỏ 240px (scripts/build-thumbs.py); thiếu thì worker trả ảnh gốc
function otThumbImg(u){return /^\/assets\/img\/(?!_[ts]\/|brand\/)[^?#]+\.(jpe?g|png|webp|jfif)$/i.test(u||'')?'/assets/img/_s/'+u.slice(12)+'.webp':u;}
// Nhãn chuyên mục của bài (search.js ghi bằng tiếng Anh)
function catLabel(c){return (!EN&&{Reviews:'Đánh giá',Review:'Đánh giá',News:'Tin tức'}[c])||c||'OtaHub';}
function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML;}

function findEntry(catalog, title){
  var typedKey=TYPE_ENTRY_ALIAS[TYPE+'|'+title];
  if(typedKey&&catalog[typedKey])return [title, catalog[typedKey]];
  if(catalog[title]&&(!catalog[title].type||catalog[title].type===TYPE))return [title, catalog[title]];
  var low=title.toLowerCase();
  var key=Object.keys(catalog).find(function(k){return k.toLowerCase()===low&&(!catalog[k].type||catalog[k].type===TYPE);});
  return key?[title, catalog[key]]:null;
}

function generatedEntry(title){
  var kind=LABEL[TYPE];
  var viStory=[title+' đã có hồ sơ riêng để tập hợp các bài viết và review trên OtaHub.', 'Thông tin cốt truyện, đội ngũ sản xuất, tác giả hoặc dàn diễn viên đang được ban biên tập đối chiếu từ nguồn chính thức.', 'Trong lúc hồ sơ được hoàn thiện, bạn có thể xem các bài liên quan bên dưới. OtaHub không tự điền dữ kiện hoặc điểm số khi chưa kiểm chứng.'];
  var enStory=[title+' now has a dedicated hub for OtaHub coverage and reviews.', 'Story, production credits, creator and cast information are being checked against official sources.', 'While the profile is being completed, browse the related coverage below. OtaHub does not auto-fill unverified facts or scores.'];
  var story=EN?enStory:viStory;
  return {type:TYPE,img:pickImg(title),score:null,genre:kind,status:EN?'Being verified':'Đang kiểm chứng',desc:story[0],hook:story[0],story:story,generated:true};
}

function hrefFor(title, entry){
  var t=entry.type||TYPE;
  return (EN?'/en/':'/')+t+'-detail?t='+encodeURIComponent(title);
}

function detailArticles(title, entry){
  var normalized=(title||'').toLowerCase().replace(/[^a-z0-9à-ỹ]+/g,' ').trim();
  var tokens=normalized.split(/\s+/).filter(function(x){return x.length>2&&!/^(the|and|season|part|final|arc|game|manga|anime)$/.test(x);});
  var all=(window.IDX||[]).filter(function(a){
    var u=a.url||a.href||'';
    return EN?/^\/en\//.test(u):!/^\/en\//.test(u);
  });
  var matches=all.map(function(a){
    var hay=((a.title||'')+' '+(a.desc||'')+' '+((a.tags||[]).join(' '))).toLowerCase();
    var score=tokens.reduce(function(n,t){return n+(hay.indexOf(t)>-1?1:0);},0);
    return {a:a,score:score};
  }).filter(function(x){return x.score>=Math.max(1,Math.min(2,tokens.length));}).sort(function(a,b){return b.score-a.score;}).slice(0,6).map(function(x){return x.a;});
  var review=(EN?entry.reviewEn:entry.review)||entry.article;
  if(review&&!matches.some(function(a){return a.url===review||a.href===review;})){
    matches.unshift({url:review,title:(EN?'In-depth review: ':'Đánh giá chuyên sâu: ')+title,img:entry.img,cat:'Review'});
  }
  return matches.slice(0,6);
}

function renderEmpty(){
  root.innerHTML='<div class="dt-empty"><p>'+(EN?'No information was found for this title.':'Không tìm thấy thông tin cho mục này.')+'</p><a href="'+CATPAGE[TYPE]+'" class="ww-btn" style="display:inline-flex;margin-top:14px">'+(EN?'Back to ':'Quay lại ')+LABEL[TYPE]+' →</a></div>';
  document.title=(EN?'Not found':'Không tìm thấy')+' · OtaHub';
}

function renderEntry(title, entry, catalog){
  if(EN&&entry.storyEn){entry=Object.assign({},entry,{story:entry.storyEn,desc:entry.descEn||entry.storyEn[0],hook:entry.hookEn||entry.storyEn[0],status:entry.statusEn||entry.status});}
  entry.desc=entry.desc||entry.hook||(entry.story&&entry.story[0])||title;
  // "Jujutsu Kaisen (Anime)" -> "Jujutsu Kaisen": loại đã có ở nhãn
  var name=title.replace(/\s*\((?:Anime|Manga)\)$/,'');
  var scoreNum=parseFloat(entry.score), hasScore=!isNaN(scoreNum);
  var review=EN?entry.reviewEn:entry.review;
  var verdict=EN?entry.verdictEn:entry.verdict;
  var summary=EN?entry.reviewSummaryEn:entry.reviewSummary;
  var note=EN?entry.reviewNoteEn:entry.reviewNote;

  document.title=name+(hasScore?(EN?' · Review '+entry.score+'/10':' · Đánh giá '+entry.score+'/10'):'')+(EN?' · Profile · OtaHub':' · Hồ sơ · OtaHub');
  var descEl=document.querySelector('meta[name="description"]');
  if(descEl)descEl.setAttribute('content', entry.desc.slice(0,155));
  var pageUrl='https://otahub.asia/'+(EN?'en/':'')+TYPE+'-detail?t='+encodeURIComponent(title);
  var canon=document.querySelector('link[rel="canonical"]');
  if(canon)canon.setAttribute('href', pageUrl);
  var viUrl='https://otahub.asia/'+TYPE+'-detail?t='+encodeURIComponent(title);
  var enUrl='https://otahub.asia/en/'+TYPE+'-detail?t='+encodeURIComponent(title);
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function(link){
    link.setAttribute('href',link.getAttribute('hreflang')==='en'?enUrl:viUrl);
  });
  var robots=document.querySelector('meta[name="robots"]');
  var isComplete=Array.isArray(entry.story)&&entry.story.length>=2&&Array.isArray(entry.sources)&&entry.sources.length>0;
  if(robots)robots.setAttribute('content',isComplete?'index, follow, max-image-preview:large':'noindex, follow');
  var ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle)ogTitle.setAttribute('content', name+(EN?' · Profile · OtaHub':' · Hồ sơ · OtaHub'));
  var ogImg=document.querySelector('meta[property="og:image"]');
  if(ogImg && entry.img && entry.img.indexOf('placeholder')<0)ogImg.setAttribute('content','https://otahub.asia'+entry.img);
  var ogUrl=document.querySelector('meta[property="og:url"]');if(ogUrl)ogUrl.setAttribute('content',pageUrl);
  var schema=document.createElement('script');schema.type='application/ld+json';
  var schemaData={'@context':'https://schema.org','@type':entry.type==='game'?'VideoGame':entry.type==='anime'?'TVSeries':'Book','name':name,'description':entry.desc,'url':pageUrl,'image':entry.img?'https://otahub.asia'+entry.img:undefined,'genre':entry.genre};
  if(entry.platforms)schemaData.gamePlatform=entry.platforms;
  // Chỉ khai báo Review khi điểm đến từ bài review đã đăng
  if(hasScore)schemaData.review={'@type':'Review','author':{'@type':'Organization','name':'OtaHub'},'url':review?'https://otahub.asia'+review:pageUrl,'reviewRating':{'@type':'Rating','ratingValue':entry.score,'bestRating':'10','worstRating':'0'}};
  schema.textContent=JSON.stringify(schemaData);document.head.appendChild(schema);

  var img=entry.img||pickImg(title);
  var storyParas=entry.story&&entry.story.length?entry.story:[entry.desc];

  var heroScore=hasScore
    ?'<div class="ah-score"><div class="ah-score-num">'+esc(entry.score)+'<small>/10</small></div><div class="ah-score-meta">'+(verdict?'<div class="ah-score-verdict">'+esc(verdict)+'</div>':'')+'<div class="ah-score-src">'+(review?TXT.fromReview:TXT.fromHub)+'</div></div></div>'
    :'<div class="ah-unscored">'+TXT.unscored+'</div>';
  var heroCta=review?'<a class="ah-cta" href="'+esc(review)+'">'+TXT.readReview+' →</a>':'';

  var verdictHtml=hasScore
    ?'<section class="verdict-card"><div class="vc-score"><div class="vc-num">'+esc(entry.score)+'</div><div class="vc-lbl">'+TXT.score+'</div></div><div>'+
      (verdict?'<div class="vc-verdict">'+esc(verdict)+'</div>':'')+
      (summary?'<p class="vc-quote">'+esc(summary)+'</p>':'')+
      (note?'<div class="vc-note">'+esc(note)+'</div>':'')+
      (review?'<a class="vc-btn" href="'+esc(review)+'">'+TXT.readReview+' →</a>':'')+
    '</div></section>'
    :'<div class="unscored-card"><strong>'+TXT.unscored+'.</strong> '+TXT.unscoredNote+'</div>';

  var credits=entry.credits||((TITLE_CREDITS[title]||[]).map(function(c){return {label:c[0],value:c[1]};}));
  credits=credits.filter(function(c){return c.value&&c.value!==entry.studio;});
  var creditsHtml=credits.length?'<h2 class="review-heading">'+TXT.credits+'</h2><div class="credit-grid">'+credits.map(function(c){var label=EN?(c.labelEn||CREDIT_LABEL_EN[c.label]||c.label):c.label;return '<div class="credit-item"><div class="credit-label">'+esc(label)+'</div><div class="credit-value">'+esc(c.value)+'</div></div>';}).join('')+'</div>':'';

  // Tiêu đề mục theo đúng vai trò đoạn văn: giới thiệu, nhận định, kết luận
  var VERDICT_RE=/^(?:Kết luận|Verdict):\s*/;
  var storyHtml='', tookHead=false;
  storyParas.forEach(function(p,i){
    if(i===0){storyHtml+='<h2 class="review-heading">'+TXT.overview+'</h2>';}
    else if(VERDICT_RE.test(p)){storyHtml+='<h2 class="review-heading">'+TXT.verdict+'</h2>';p=p.replace(VERDICT_RE,'');}
    else if(!tookHead){storyHtml+='<h2 class="review-heading">'+TXT.take+'</h2>';tookHead=true;}
    storyHtml+='<p>'+esc(p)+'</p>';
  });
  var sourcesHtml=entry.sources&&entry.sources.length?'<section class="review-sources"><h2 class="review-heading">'+TXT.sources+'</h2><ul>'+entry.sources.map(function(s){return '<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.name)+'</a></li>';}).join('')+'</ul></section>':'';

  var articles=detailArticles(title,entry);
  var articlesHtml='<h2 class="review-heading">'+TXT.articles+'</h2>'+(articles.length?'<div class="article-grid">'+articles.map(function(a){var u=a.url||a.href||'#';if(EN&&u.charAt(0)==='/'&&u.indexOf('/en/')!==0)u='/en'+u;return '<a class="article-card" href="'+esc(u)+'"><img src="'+esc(otThumbImg(a.img||entry.img||'/assets/img/placeholder.svg'))+'" alt="" loading="lazy" width="112" height="100"><div class="article-copy"><div class="article-type">'+esc(catLabel(a.cat||a.category))+'</div><div class="article-title">'+esc(a.title||name)+'</div></div></a>';}).join('')+'</div>':'<p class="review-note">'+TXT.noArticles+'</p>');

  // Gợi ý: cùng loại, ưu tiên cùng thể loại rồi điểm cao; không gợi ý chính nó / bản trùng tên
  var genreWords=(entry.genre||'').toLowerCase().split(/[\/,·]+/).map(function(s){return s.trim();}).filter(Boolean);
  var related=Object.keys(catalog).filter(function(k){
    return k!==title&&catalog[k].type===entry.type&&k.replace(/\s*\((?:Anime|Manga)\)$/,'')!==name;
  }).map(function(k){
    var e=catalog[k], g=(e.genre||'').toLowerCase();
    var overlap=genreWords.reduce(function(n,w){return n+(g.indexOf(w)>-1?1:0);},0);
    return {k:k,e:e,rank:overlap*10+(parseFloat(e.score)||0)};
  }).sort(function(a,b){return b.rank-a.rank;}).slice(0,5);

  root.innerHTML=
  '<section class="anime-hero">'+
    '<div class="ah-bg" style="background-image:url(\''+img+'\')"></div>'+
    '<div class="ah-grad"></div>'+
    '<div class="ah-content">'+
      (img?'<img class="ah-poster" src="'+img+'" alt="'+esc(name)+'" fetchpriority="high"/>':'')+
      '<div class="ah-info">'+
        '<div class="ah-badges"><span class="ah-badge type">'+LABEL[entry.type]+'</span>'+(entry.genre?'<span class="ah-badge">'+esc(entry.genre)+'</span>':'')+(entry.status?'<span class="ah-badge">'+esc(entry.status)+'</span>':'')+'</div>'+
        '<h1 class="ah-title">'+esc(name)+'</h1>'+
        (entry.studio?'<div class="ah-title-jp">'+esc(entry.studio)+'</div>':'')+
        '<p class="ah-synopsis">'+esc(entry.hook||storyParas[0])+'</p>'+
        '<div class="ah-scores">'+heroScore+heroCta+'</div>'+
      '</div>'+
    '</div>'+
  '</section>'+
  '<div class="anime-layout">'+
    '<main class="anime-main">'+
      '<nav class="breadcrumb" aria-label="breadcrumb"><a href="'+(EN?'/en':'/')+'">OtaHub</a><span class="breadcrumb-sep">›</span><a href="'+CATPAGE[entry.type]+'">'+LABEL[entry.type]+'</a><span class="breadcrumb-sep">›</span><span>'+esc(name)+'</span></nav>'+
      '<div class="info-table">'+
        (entry.studio?'<div class="info-row"><span class="ir-label">'+META_LABEL[entry.type]+'</span><span class="ir-val">'+esc(entry.studio)+'</span></div>':'')+
        (entry.genre?'<div class="info-row"><span class="ir-label">'+TXT.genre+'</span><span class="ir-val">'+esc(entry.genre)+'</span></div>':'')+
        (entry.platforms?'<div class="info-row"><span class="ir-label">'+TXT.platform+'</span><span class="ir-val">'+esc(entry.platforms)+'</span></div>':'')+
        (entry.release&&entry.release!==entry.status?'<div class="info-row"><span class="ir-label">'+TXT.release+'</span><span class="ir-val">'+esc(entry.release)+'</span></div>':'')+
        (entry.status?'<div class="info-row"><span class="ir-label">'+TXT.status+'</span><span class="ir-val">'+esc(entry.status)+'</span></div>':'')+
      '</div>'+
      verdictHtml+
      '<div class="review-body">'+storyHtml+'</div>'+
      creditsHtml+
      '<div class="review-body">'+sourcesHtml+'</div>'+
      articlesHtml+
      '<div class="share-bar"><span class="share-label">'+TXT.share+'</span>'+
        '<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl)+'" target="_blank" rel="noopener">Facebook</a>'+
        '<a class="share-btn" href="https://twitter.com/intent/tweet?url='+encodeURIComponent(pageUrl)+'&text='+encodeURIComponent(name)+'" target="_blank" rel="noopener">X / Twitter</a>'+
      '</div>'+
    '</main>'+
    '<aside class="anime-sidebar">'+
      (related.length?'<div class="gs-block"><div class="gs-title">'+TXT.related+'</div><div class="sim-list">'+
        related.map(function(r){
          var e=r.e, sc=parseFloat(e.score);
          return '<a href="'+hrefFor(r.k,e)+'" class="sim-item"><img class="si-thumb" src="'+esc(otThumbImg(e.img||pickImg(r.k)||'/assets/img/placeholder.svg'))+'" alt="" loading="lazy" width="56" height="76"/><div><div class="si-name">'+esc(r.k.replace(/\s*\((?:Anime|Manga)\)$/,''))+'</div><div class="si-genre">'+esc(e.genre||LABEL[e.type])+(isNaN(sc)?'':' · <span class="si-score">'+sc.toFixed(1)+'</span>')+'</div></div></a>';
        }).join('')+
      '</div></div>':'')+
      '<div class="gs-block"><div class="gs-title">'+TXT.discover+'</div><a href="'+CATPAGE[entry.type]+'" class="ww-btn"><span class="ww-icon">→</span><span>'+TXT.viewAll+LABEL[entry.type]+'</span></a></div>'+
    '</aside>'+
  '</div>';

  // Ảnh ngang (banner Steam...) không cắt vào khung dọc
  var poster=root.querySelector('.ah-poster');
  if(poster){
    var markWide=function(){if(poster.naturalWidth>poster.naturalHeight*1.15)root.querySelector('.anime-hero').classList.add('is-wide');};
    if(poster.complete)markWide();else poster.addEventListener('load',markWide);
  }
}

if(!qTitle){
  renderEmpty();
}else{
  fetch('/assets/catalog.json?v=20261002p').then(function(r){return r.json();}).then(function(catalog){
    var found=findEntry(catalog, qTitle);
    if(!found){renderEntry(qTitle, generatedEntry(qTitle), catalog);return;}
    renderEntry(found[0], found[1], catalog);
  }).catch(function(){
    renderEntry(qTitle, generatedEntry(qTitle), {});
  });
}
})();
