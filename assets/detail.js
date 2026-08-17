/* OtaHub — trang chi tiết dùng chung cho game/anime/manga, đọc dữ liệu từ /assets/catalog.json */
(function(){
var root=document.getElementById('detailRoot');
if(!root)return;
var TYPE=document.body.getAttribute('data-detail-type')||'anime';
var LABEL={anime:'Anime',game:'Game',manga:'Manga'};
var CATPAGE={anime:'/anime.html',game:'/gaming.html',manga:'/manga.html'};
var META_LABEL={anime:'Studio',game:'Nhà phát triển',manga:'Tác giả / NXB'};

var params=new URLSearchParams(location.search);
var qTitle=params.get('t')||'';

function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML;}

function findEntry(catalog, title){
  if(catalog[title])return [title, catalog[title]];
  var low=title.toLowerCase();
  var key=Object.keys(catalog).find(function(k){return k.toLowerCase()===low;});
  return key?[key, catalog[key]]:null;
}

function hrefFor(title, entry){
  var t=entry.type||TYPE;
  return '/'+t+'-detail.html?t='+encodeURIComponent(title);
}

function renderEmpty(){
  root.innerHTML='<div class="dt-empty"><p>Không tìm thấy thông tin cho mục này.</p><a href="'+CATPAGE[TYPE]+'" class="ww-btn" style="display:inline-flex;margin-top:14px">Quay lại '+LABEL[TYPE]+' →</a></div>';
  document.title='Không tìm thấy · OtaHub';
}

function renderEntry(title, entry, catalog){
  document.title=title+' · Thông tin & Điểm số · OtaHub';
  var descEl=document.querySelector('meta[name="description"]');
  if(descEl)descEl.setAttribute('content', entry.desc.slice(0,155));
  var canon=document.querySelector('link[rel="canonical"]');
  var pageUrl='https://otahub.asia/'+TYPE+'-detail.html?t='+encodeURIComponent(title);
  if(canon)canon.setAttribute('href', pageUrl);
  var ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle)ogTitle.setAttribute('content', title+' · OtaHub');
  var ogImg=document.querySelector('meta[property="og:image"]');
  if(ogImg && entry.img && entry.img.indexOf('placeholder')<0)ogImg.setAttribute('content','https://otahub.asia'+entry.img);

  var img=entry.img||'/assets/img/placeholder.svg';
  var scoreNum=parseFloat(entry.score);
  var scoreHtml=(!isNaN(scoreNum))?entry.score:'—';

  var related=Object.keys(catalog)
    .filter(function(k){return k!==title && catalog[k].type===entry.type;})
    .slice(0,4);

  // story: mảng đoạn văn nếu có, fallback về desc đơn
  var storyParas = entry.story && entry.story.length ? entry.story : [entry.desc];
  var storyHtml = storyParas.map(function(p){return '<p>'+esc(p)+'</p>';}).join('');

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
        '<div class="ah-scores"><div class="ah-score-item"><div class="ah-sc-label">Điểm OtaHub</div><div class="ah-sc-val c">'+scoreHtml+'</div></div></div>'+
      '</div>'+
    '</div>'+
  '</section>'+
  '<div class="anime-layout">'+
    '<main class="anime-main">'+
      '<nav class="breadcrumb" aria-label="breadcrumb"><a href="/">OtaHub</a><span class="breadcrumb-sep">›</span><a href="'+CATPAGE[entry.type]+'">'+LABEL[entry.type]+'</a><span class="breadcrumb-sep">›</span><span>'+esc(title)+'</span></nav>'+
      '<div class="info-table">'+
        (entry.studio?'<div class="info-row"><span class="ir-label">'+META_LABEL[entry.type]+'</span><span class="ir-val">'+esc(entry.studio)+'</span></div>':'')+
        (entry.genre?'<div class="info-row"><span class="ir-label">Thể loại</span><span class="ir-val">'+esc(entry.genre)+'</span></div>':'')+
        (entry.platforms?'<div class="info-row"><span class="ir-label">Nền tảng</span><span class="ir-val">'+esc(entry.platforms)+'</span></div>':'')+
        (entry.release?'<div class="info-row"><span class="ir-label">Phát hành</span><span class="ir-val">'+esc(entry.release)+'</span></div>':'')+
        (entry.status?'<div class="info-row"><span class="ir-label">Trạng thái</span><span class="ir-val">'+esc(entry.status)+'</span></div>':'')+
        '<div class="info-row"><span class="ir-label">Điểm OtaHub</span><span class="ir-val">'+scoreHtml+' / 10</span></div>'+
      '</div>'+
      '<div class="review-body">'+storyHtml+'</div>'+
      (entry.article?'<div class="highlight-box" style="margin:8px 0 28px"><div class="hb-label">Bài viết liên quan</div><div class="hb-text"><a href="'+entry.article+'" style="color:var(--acc)">Đọc bài viết đầy đủ về '+esc(title)+' →</a></div></div>':'')+
      '<div class="share-bar"><span class="share-label">Chia sẻ</span>'+
        '<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl)+'" target="_blank" rel="noopener">Facebook</a>'+
        '<a class="share-btn" href="https://twitter.com/intent/tweet?url='+encodeURIComponent(pageUrl)+'&text='+encodeURIComponent(title)+'" target="_blank" rel="noopener">X / Twitter</a>'+
      '</div>'+
    '</main>'+
    '<aside class="anime-sidebar">'+
      '<div class="gs-block"><div class="gs-title">Có thể bạn quan tâm</div><div class="sim-list">'+
        related.map(function(k){
          var e=catalog[k];
          return '<a href="'+hrefFor(k,e)+'" class="sim-item"><img class="si-thumb" src="'+(e.img||'/assets/img/placeholder.svg')+'" alt="" loading="lazy"/><div><div class="si-name">'+esc(k)+'</div><div class="si-genre">'+esc(e.genre||LABEL[e.type])+(e.score&&e.score!=='—'?' · '+e.score:'')+'</div></div></a>';
        }).join('')+
      '</div></div>'+
      '<div class="gs-block"><div class="gs-title">Khám phá thêm</div><a href="'+CATPAGE[entry.type]+'" class="ww-btn"><span class="ww-icon">→</span><span>Xem tất cả '+LABEL[entry.type]+'</span></a></div>'+
    '</aside>'+
  '</div>';
}

if(!qTitle){
  renderEmpty();
}else{
  fetch('/assets/catalog.json').then(function(r){return r.json();}).then(function(catalog){
    var found=findEntry(catalog, qTitle);
    if(!found){renderEmpty();return;}
    renderEntry(found[0], found[1], catalog);
  }).catch(function(){
    root.innerHTML='<div class="dt-empty"><p>Không tải được dữ liệu.</p></div>';
  });
}
})();
