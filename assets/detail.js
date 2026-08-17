/* OtaHub — trang chi tiết dùng chung cho game/anime/manga, đọc dữ liệu từ /assets/catalog.json */
(function(){
var root=document.getElementById('detailRoot');
if(!root)return;
var detailStyle=document.createElement('style');
detailStyle.textContent='.review-heading{font-family:var(--fd);font-size:23px;line-height:1.25;color:var(--white);margin:30px 0 10px;padding-left:12px;border-left:3px solid var(--acc)}';
document.head.appendChild(detailStyle);
var TYPE=document.body.getAttribute('data-detail-type')||'anime';
var EN=/^\/en(?:\/|$)/.test(location.pathname);
var LABEL={anime:'Anime',game:'Game',manga:'Manga'};
var CATPAGE=EN?{anime:'/en/anime',game:'/en/gaming',manga:'/en/manga'}:{anime:'/anime.html',game:'/gaming.html',manga:'/manga.html'};
var META_LABEL=EN?{anime:'Studio',game:'Developer',manga:'Author / Publisher'}:{anime:'Studio',game:'Nhà phát triển',manga:'Tác giả / NXB'};
var TXT=EN?{score:'OtaHub score',genre:'Genre',platform:'Platforms',release:'Release',status:'Status',related:'You may also like',discover:'Discover more',viewAll:'View all ',share:'Share',article:'Related article',read:'Read the full article about '}:{score:'Điểm OtaHub',genre:'Thể loại',platform:'Nền tảng',release:'Phát hành',status:'Trạng thái',related:'Có thể bạn quan tâm',discover:'Khám phá thêm',viewAll:'Xem tất cả ',share:'Chia sẻ',article:'Bài viết liên quan',read:'Đọc bài viết đầy đủ về '};

var TITLE_IMAGE={
  'Demon Slayer: Infinity Castle':'/assets/img/0feb0c5f50-99889l.jpg','Frieren Season 2':'/assets/img/4a7324f467-138006l.jpg',
  'Sousou no Frieren':'/assets/img/4a7324f467-138006l.jpg','Re:Zero Season 4':'/assets/img/087af8ed98-rezero-s4-hero.jpg',
  'Solo Leveling Season 3':'/assets/img/1619ce791a-solo-leveling-hero.jpg','Ore dake Level Up na Ken':'/assets/img/1619ce791a-solo-leveling-hero.jpg',
  'Bleach: TYBW Part 5':'/assets/img/bleach-tybw-poster.jpg','Chainsaw Man Part 3':'/assets/img/2656ba8ffc-maxresdefault.jpg',
  'Dungeon Meshi S2':'/assets/img/c76fab236e-142478l.jpg','Dungeon Meshi':'/assets/img/c76fab236e-142478l.jpg',
  'Kaiju No.8 Season 2':'/assets/img/064c22bc8c-140362l.jpg','Sakamoto Days':'/assets/img/53434489e9-146459l.jpg',
  'Jujutsu Kaisen Final Arc':'/assets/img/a4d82e012d-138022l.jpg','Wind Breaker':'/assets/img/7fe07557d5-141816l.jpg',
  'Mushoku Tensei Season 3':'/assets/img/93dc86c38d-117776l.jpg','Metallic Rouge':'/assets/img/1398450367-140210l.jpg',
  'Shangri-La Frontier S2':'/assets/img/6247a8245a-139931l.jpg','Mashle S2':'/assets/img/f2c03777f8-140804l.jpg',
  'Oshi no Ko Season 2':'/assets/img/d137b0931c-134736l.jpg','Blue Lock Season 2 Part 2':'/assets/img/a5b2a5cd39-126929l.jpg',
  'Spy x Family Season 3':'/assets/img/a7f0eee58e-122795l.jpg','Dr. Stone Season 4':'/assets/img/ea478ecebf-102576l.jpg',
  'Assassination Classroom S3':'/assets/img/b7622e1073-75639l.jpg','Monster Hunter Wilds':'/assets/img/587e72813c-header.jpg',
  'Black Myth: Wukong':'/assets/img/7403bc0e49-header.jpg','Wuthering Waves':'/assets/img/c53329917b-wuthering-waves-hero.jpg',
  'Genshin Impact':'/assets/img/f89df6064f-142648l.jpg','Honkai: Star Rail':'/assets/img/681306c50c-143582l.jpg',
  'Honor of Kings Global':'/assets/img/6323076b06-158003l.jpg','Berserk':'/assets/img/641c702735-157897l.jpg',
  'One Piece':'/assets/img/add1e919a8-266234l.jpg','Chainsaw Man':'/assets/img/fced43ae52-216464l.jpg',
  'Jujutsu Kaisen':'/assets/img/f503c61d36-259446l.jpg','Solo Leveling: Ragnarok':'/assets/img/dfc2a226b6-339933l.jpg',
  'The Beginning After The End':'/assets/img/9e28941194-222295l.jpg','Omniscient Reader':'/assets/img/24741c60cd-238873l.jpg'
};

var params=new URLSearchParams(location.search);
var qTitle=params.get('t')||'';

function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML;}

function findEntry(catalog, title){
  if(catalog[title])return [title, catalog[title]];
  var low=title.toLowerCase();
  var key=Object.keys(catalog).find(function(k){return k.toLowerCase()===low;});
  return key?[key, catalog[key]]:null;
}

function generatedEntry(title){
  var kind=LABEL[TYPE];
  var viStory={
    anime:[
      title+' được OtaHub đưa vào trang thông tin để người đọc có thể kiểm tra nhanh bối cảnh, thể loại và mức độ phù hợp trước khi xem.',
      'Phần đánh giá tập trung vào nhịp kể chuyện, cách xây dựng nhân vật, chất lượng hình ảnh và âm thanh. Đây là những yếu tố ảnh hưởng trực tiếp đến trải nghiệm của một series anime, đặc biệt khi nội dung được phát hành theo mùa.',
      'Điểm đáng quan tâm là cách tác phẩm cân bằng giữa diễn biến chính và thời lượng dành cho nhân vật. Người xem nên cân nhắc gu thể loại, tốc độ kể chuyện và mức độ cần biết nội dung các phần trước.',
      'OtaHub sẽ tiếp tục cập nhật studio, lịch phát hành, số tập và điểm số khi có dữ liệu được xác nhận. Nội dung chưa xác nhận sẽ không được trình bày như thông tin chính thức.',
      'Kết luận: '+title+' phù hợp để đưa vào danh sách theo dõi nếu bạn quan tâm đến dòng nội dung này. Hãy xem phần thông tin phát hành mới nhất trước khi bắt đầu.'
    ],
    game:[
      title+' được tổng hợp trong danh mục game của OtaHub nhằm giúp người chơi đánh giá nhanh trước khi tải hoặc mua.',
      'Bài đánh giá xem xét vòng lặp gameplay, độ phản hồi của điều khiển, thiết kế nhiệm vụ, tiến trình nhân vật và mức độ lặp lại sau nhiều giờ chơi.',
      'Hiệu năng, nền tảng hỗ trợ, mô hình cập nhật và chi phí phát sinh cũng là những yếu tố cần kiểm tra. Trải nghiệm thực tế có thể khác nhau theo cấu hình máy và phiên bản trò chơi.',
      'OtaHub ưu tiên tách biệt thông tin đã xác nhận với nhận định biên tập. Các thông số kỹ thuật và lịch phát hành sẽ được cập nhật khi nhà phát hành công bố.',
      'Kết luận: hãy đối chiếu thể loại, nền tảng và phong cách gameplay của '+title+' với nhu cầu cá nhân trước khi quyết định.'
    ],
    manga:[
      title+' được đưa vào thư viện manga và truyện tranh của OtaHub để người đọc có một điểm bắt đầu rõ ràng trước khi theo dõi.',
      'Phần đánh giá chú ý đến cấu trúc cốt truyện, nét vẽ, bố cục khung tranh, cách phát triển nhân vật và khả năng duy trì chất lượng qua từng chương.',
      'Nhịp xuất bản, tình trạng bản quyền và chất lượng bản dịch có thể ảnh hưởng đáng kể đến trải nghiệm đọc. Người đọc nên ưu tiên các kênh phát hành hợp pháp tại khu vực của mình.',
      'Thông tin tác giả, nhà xuất bản, số tập và trạng thái phát hành sẽ được cập nhật khi có nguồn xác nhận đáng tin cậy.',
      'Kết luận: '+title+' đáng cân nhắc nếu chủ đề và phong cách hình ảnh phù hợp với sở thích của bạn.'
    ]
  };
  var enStory={
    anime:[title+' is included in the OtaHub database to provide a clear starting point before watching.','This overview considers pacing, character development, visual direction, animation consistency, and sound design.','Viewers should also consider genre preference, storytelling speed, and whether earlier seasons are required.','Studio, schedule, episode count, and verified ratings will be updated as reliable information becomes available.','Verdict: '+title+' is worth tracking if its genre and premise match your interests.'],
    game:[title+' is included in the OtaHub game database to help players evaluate it before downloading or purchasing.','The review framework covers the core gameplay loop, controls, mission design, progression, and long-term repetition.','Performance, supported platforms, update policy, and additional costs should also be checked before making a decision.','OtaHub separates verified release information from editorial assessment and updates specifications when publishers confirm them.','Verdict: compare the genre, platform, and gameplay style of '+title+' with your own priorities.'],
    manga:[title+' is included in the OtaHub manga library to give readers a useful starting point.','The review framework considers story structure, artwork, panel composition, character development, and consistency between chapters.','Release cadence, licensing, and translation quality can materially affect the reading experience.','Author, publisher, volume count, and publication status will be updated when reliable information is available.','Verdict: '+title+' is worth considering when its themes and visual style match your preferences.']
  };
  var story=(EN?enStory:viStory)[TYPE];
  return {type:TYPE,img:TITLE_IMAGE[title]||'/assets/img/placeholder.svg',score:'N/A',genre:kind,status:EN?'Information updating':'Đang cập nhật',desc:story[0],hook:story[0],story:story,generated:true};
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
  document.title=title+' · Thông tin & Điểm số · OtaHub';
  var descEl=document.querySelector('meta[name="description"]');
  if(descEl)descEl.setAttribute('content', entry.desc.slice(0,155));
  var canon=document.querySelector('link[rel="canonical"]');
  var pageUrl='https://otahub.asia/'+(EN?'en/':'')+TYPE+'-detail?t='+encodeURIComponent(title);
  if(canon)canon.setAttribute('href', pageUrl);
  var ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle)ogTitle.setAttribute('content', title+' · OtaHub');
  var ogImg=document.querySelector('meta[property="og:image"]');
  if(ogImg && entry.img && entry.img.indexOf('placeholder')<0)ogImg.setAttribute('content','https://otahub.asia'+entry.img);

  var img=entry.img||'/assets/img/placeholder.svg';
  var scoreNum=parseFloat(entry.score);
  var scoreHtml=(!isNaN(scoreNum))?entry.score:'N/A';

  var related=Object.keys(catalog)
    .filter(function(k){return k!==title && catalog[k].type===entry.type;})
    .slice(0,4);

  // story: mảng đoạn văn nếu có, fallback về desc đơn
  var storyParas = entry.story && entry.story.length ? entry.story : [entry.desc];
  var sectionHeads=EN?['Overview','Core experience','Points to consider','Verified information','Verdict']:['Tổng quan','Trải nghiệm cốt lõi','Điểm cần cân nhắc','Thông tin đã xác nhận','Kết luận'];
  var storyHtml = storyParas.map(function(p,i){return (entry.generated&&sectionHeads[i]?'<h2 class="review-heading">'+sectionHeads[i]+'</h2>':'')+'<p>'+esc(p)+'</p>';}).join('');
  var sourcesHtml=entry.sources&&entry.sources.length?'<section class="review-sources"><h2 class="review-heading">'+(EN?'Sources and verification':'Nguồn và kiểm chứng')+'</h2><ul>'+entry.sources.map(function(s){return '<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.name)+'</a></li>';}).join('')+'</ul></section>':'';

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
      '<nav class="breadcrumb" aria-label="breadcrumb"><a href="/">OtaHub</a><span class="breadcrumb-sep">›</span><a href="'+CATPAGE[entry.type]+'">'+LABEL[entry.type]+'</a><span class="breadcrumb-sep">›</span><span>'+esc(title)+'</span></nav>'+
      '<div class="info-table">'+
        (entry.studio?'<div class="info-row"><span class="ir-label">'+META_LABEL[entry.type]+'</span><span class="ir-val">'+esc(entry.studio)+'</span></div>':'')+
        (entry.genre?'<div class="info-row"><span class="ir-label">'+TXT.genre+'</span><span class="ir-val">'+esc(entry.genre)+'</span></div>':'')+
        (entry.platforms?'<div class="info-row"><span class="ir-label">'+TXT.platform+'</span><span class="ir-val">'+esc(entry.platforms)+'</span></div>':'')+
        (entry.release?'<div class="info-row"><span class="ir-label">'+TXT.release+'</span><span class="ir-val">'+esc(entry.release)+'</span></div>':'')+
        (entry.status?'<div class="info-row"><span class="ir-label">'+TXT.status+'</span><span class="ir-val">'+esc(entry.status)+'</span></div>':'')+
        '<div class="info-row"><span class="ir-label">'+TXT.score+'</span><span class="ir-val">'+scoreHtml+' / 10</span></div>'+
      '</div>'+
      '<div class="review-body">'+storyHtml+sourcesHtml+'</div>'+
      (entry.article?'<div class="highlight-box" style="margin:8px 0 28px"><div class="hb-label">'+TXT.article+'</div><div class="hb-text"><a href="'+entry.article+'" style="color:var(--acc)">'+TXT.read+esc(title)+' →</a></div></div>':'')+
      '<div class="share-bar"><span class="share-label">'+TXT.share+'</span>'+
        '<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl)+'" target="_blank" rel="noopener">Facebook</a>'+
        '<a class="share-btn" href="https://twitter.com/intent/tweet?url='+encodeURIComponent(pageUrl)+'&text='+encodeURIComponent(title)+'" target="_blank" rel="noopener">X / Twitter</a>'+
      '</div>'+
    '</main>'+
    '<aside class="anime-sidebar">'+
      '<div class="gs-block"><div class="gs-title">'+TXT.related+'</div><div class="sim-list">'+
        related.map(function(k){
          var e=catalog[k];
          return '<a href="'+hrefFor(k,e)+'" class="sim-item"><img class="si-thumb" src="'+(e.img||'/assets/img/placeholder.svg')+'" alt="" loading="lazy"/><div><div class="si-name">'+esc(k)+'</div><div class="si-genre">'+esc(e.genre||LABEL[e.type])+(e.score&&e.score!=='—'?' · '+e.score:'')+'</div></div></a>';
        }).join('')+
      '</div></div>'+
      '<div class="gs-block"><div class="gs-title">'+TXT.discover+'</div><a href="'+CATPAGE[entry.type]+'" class="ww-btn"><span class="ww-icon">→</span><span>'+TXT.viewAll+LABEL[entry.type]+'</span></a></div>'+
    '</aside>'+
  '</div>';
}

if(!qTitle){
  renderEmpty();
}else{
  fetch('/assets/catalog.json?v=20260817d').then(function(r){return r.json();}).then(function(catalog){
    var found=findEntry(catalog, qTitle);
    if(!found){renderEntry(qTitle, generatedEntry(qTitle), catalog);return;}
    renderEntry(found[0], found[1], catalog);
  }).catch(function(){
    renderEntry(qTitle, generatedEntry(qTitle), {});
  });
}
})();
