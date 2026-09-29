/* OtaHub UI polish — ngày kiểu Việt, mục lục bài viết, nút copy link */
(function(){
var MONTHS=['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
function fmtDate(iso){
  var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if(!m)return iso;
  var y=m[1],mo=parseInt(m[2],10),d=parseInt(m[3],10);
  return d+' '+MONTHS[mo-1]+', '+y;
}
document.querySelectorAll('.am-date').forEach(function(el){
  var t=el.textContent.trim();
  if(/^\d{4}-\d{2}-\d{2}/.test(t))el.textContent=fmtDate(t);
});

/* Tên tác giả trên bài viết luôn dẫn tới hồ sơ và thống kê bài viết. */
var authorRoutes={
  'otahub':'otahub','otahub editorial':'otahub',
  'yu':'yu','anhthu':'anhthu','anh thu':'anhthu'
};
document.querySelectorAll('.am-badge,.am-name').forEach(function(el){
  var key=(el.textContent||'').trim().toLocaleLowerCase('vi');
  var slug=authorRoutes[key]||key.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(!slug||el.closest('a'))return;
  var link=document.createElement('a');
  link.href='/author/'+slug;
  link.className='author-profile-link';
  link.setAttribute('aria-label','Xem hồ sơ và các bài của '+el.textContent.trim());
  el.parentNode.insertBefore(link,el);
  link.appendChild(el);
});

var body=document.querySelector('.art-body');
if(body){
  var heads=body.querySelectorAll('h2');
  if(heads.length>=2){
    var items=[];
    heads.forEach(function(h,i){
      var id='sec-'+i;
      h.id=id;
      items.push('<a href="#'+id+'">'+h.textContent+'</a>');
    });
    var toc=document.createElement('div');
    toc.className='toc-block open';
    toc.innerHTML='<button type="button" class="toc-toggle">Mục lục bài viết <span class="toc-arrow">▾</span></button><nav class="toc-list">'+items.join('')+'</nav>';
    var hb=document.querySelector('.highlight-box');
    if(hb)hb.insertAdjacentElement('afterend',toc);
    else body.insertAdjacentElement('beforebegin',toc);
    toc.querySelector('.toc-toggle').addEventListener('click',function(){toc.classList.toggle('open');});
    toc.querySelectorAll('.toc-list a').forEach(function(a){
      a.addEventListener('click',function(){if(window.innerWidth<900)toc.classList.remove('open');});
    });
  }
}

document.querySelectorAll('.share-row').forEach(function(row){
  if(row.querySelector('.copy-link-btn'))return;
  var btn=document.createElement('button');
  btn.type='button';btn.className='share-btn copy-link-btn';
  btn.textContent='Sao chép link';
  btn.addEventListener('click',function(){
    navigator.clipboard.writeText(location.href).then(function(){
      var t=btn.textContent;btn.textContent='Đã copy!';
      setTimeout(function(){btn.textContent=t;},1800);
    });
  });
  row.appendChild(btn);
});

var css='.toc-block{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);margin:0 0 28px}'+
'.toc-toggle{width:100%;text-align:left;background:none;border:none;color:#f0eeff;font-family:var(--fd),sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:14px 18px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;min-height:44px}'+
'.toc-arrow{transition:transform .2s;color:#00e5ff;flex-shrink:0}'+
'.toc-block.open .toc-arrow{transform:rotate(180deg)}'+
'.toc-list{display:none;flex-direction:column;padding:0 18px 16px}'+
'.toc-block.open .toc-list{display:flex}'+
'.toc-list a{color:#9a94b8;text-decoration:none;font-size:13px;padding:9px 0;border-top:1px solid rgba(255,255,255,.06)}'+
'.toc-list a:first-child{border-top:none}'+
'.toc-list a:hover{color:#00e5ff}'+
'.author-profile-link{color:inherit;text-decoration:none;border-radius:999px}.author-profile-link:hover .am-badge,.author-profile-link:hover .am-name{color:#00e5ff;text-decoration:underline;text-underline-offset:3px}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();

/* Reading progress bar — art/review pages only */
(function(){
var body=document.querySelector('.art-body, article.article');
if(!body)return;
var bar=document.createElement('div');
bar.className='ot-progress';
var fill=document.createElement('div');
fill.className='ot-progress-fill';
bar.appendChild(fill);
document.body.appendChild(bar);
function update(){
  var rect=body.getBoundingClientRect();
  var top=rect.top+window.scrollY;
  var start=top-window.innerHeight*0.15;
  var end=top+body.offsetHeight-window.innerHeight*0.6;
  var pct;
  if(end<=start)pct=100;
  else pct=Math.min(100,Math.max(0,((window.scrollY-start)/(end-start))*100));
  fill.style.width=pct+'%';
}
window.addEventListener('scroll',update,{passive:true});
window.addEventListener('resize',update);
update();
var css='.ot-progress{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:10000;pointer-events:none}'+
'.ot-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#ff3080,#00e5ff);transition:width .12s linear}';
var st2=document.createElement('style');st2.textContent=css;document.head.appendChild(st2);
})();

/* Back-to-top button — site-wide */
(function(){
var btt=document.createElement('button');
btt.type='button';
btt.className='ot-btt';
btt.setAttribute('aria-label','Lên đầu trang');
btt.innerHTML='↑';
document.body.appendChild(btt);
btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
function toggle(){
  if(window.scrollY>500)btt.classList.add('show');
  else btt.classList.remove('show');
}
window.addEventListener('scroll',toggle,{passive:true});
toggle();
var css='.ot-btt{position:fixed;right:18px;bottom:22px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,229,255,.35);background:rgba(8,4,24,.92);color:#00e5ff;font-size:18px;line-height:1;cursor:pointer;z-index:9998;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .25s,transform .25s,border-color .2s,box-shadow .2s;backdrop-filter:blur(8px)}'+
'.ot-btt.show{opacity:1;transform:translateY(0);pointer-events:auto}'+
'.ot-btt:hover{border-color:#00e5ff;box-shadow:0 0 18px rgba(0,229,255,.35)}'+
'@media(max-width:720px){.ot-btt{right:14px;bottom:18px;width:40px;height:40px;font-size:16px}}';
var st3=document.createElement('style');st3.textContent=css;document.head.appendChild(st3);
})();

/* Card hover glow — site-wide, pure CSS */
(function(){
var css='.ac,.fc,.w-card,.anime-card,.rk-card{transition:box-shadow .25s ease,border-color .25s ease}'+
'.ac:hover,.fc:hover,.w-card:hover,.anime-card:hover,.rk-card:hover{box-shadow:0 0 0 1px rgba(0,229,255,.25),0 10px 30px rgba(0,229,255,.13)}';
var st4=document.createElement('style');st4.textContent=css;document.head.appendChild(st4);
})();

/* Save/bookmark article — localStorage, no backend */
(function(){
var KEY='otahub_saved';
function getSaved(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];}}
function setSaved(list){try{localStorage.setItem(KEY,JSON.stringify(list));}catch(e){}}

var row=document.querySelector('.share-row');
var url=location.pathname;
if(row && !row.querySelector('.ot-save-btn')){
  var already=getSaved().some(function(s){return s.url===url;});
  var btn=document.createElement('button');
  btn.type='button';
  btn.className='share-btn ot-save-btn'+(already?' saved':'');
  btn.textContent=already?'Đã lưu ✓':'🔖 Lưu bài';
  btn.addEventListener('click',function(){
    var list=getSaved();
    var idx=list.findIndex(function(s){return s.url===url;});
    if(idx>-1){
      list.splice(idx,1);
      btn.textContent='🔖 Lưu bài';
      btn.classList.remove('saved');
    }else{
      var titleEl=document.querySelector('h1');
      var imgEl=document.querySelector('.hero img,.art-body img,article.article img,header img');
      list.push({url:url,title:titleEl?titleEl.textContent.trim():document.title,img:imgEl?imgEl.getAttribute('src'):'',ts:Date.now()});
      btn.textContent='Đã lưu ✓';
      btn.classList.add('saved');
    }
    setSaved(list);
    updateBadge();
  });
  row.appendChild(btn);
}

var launcher=document.createElement('button');
launcher.type='button';
launcher.className='ot-saved-fab';
launcher.setAttribute('aria-label','Bài đã lưu');
launcher.innerHTML='🔖<span class="ot-saved-badge">0</span>';
document.body.appendChild(launcher);

var panel=document.createElement('div');
panel.className='ot-saved-panel';
panel.innerHTML='<div class="ot-saved-head">Bài đã lưu<button type="button" class="ot-saved-close" aria-label="Đóng">✕</button></div><div class="ot-saved-list"></div>';
document.body.appendChild(panel);

function renderPanel(list){
  var box=panel.querySelector('.ot-saved-list');
  if(!list.length){box.innerHTML='<div class="ot-saved-empty">Chưa có bài viết nào được lưu.</div>';return;}
  box.innerHTML=list.slice().reverse().map(function(s){
    return '<a class="ot-saved-item" href="'+s.url+'">'+(s.img?'<img src="'+s.img+'" alt="">':'')+'<span>'+(s.title||s.url)+'</span></a>';
  }).join('');
}
function updateBadge(){
  var list=getSaved();
  var badge=launcher.querySelector('.ot-saved-badge');
  badge.textContent=list.length;
  badge.style.display=list.length?'flex':'none';
  renderPanel(list);
}
launcher.addEventListener('click',function(){panel.classList.toggle('open');});
panel.querySelector('.ot-saved-close').addEventListener('click',function(){panel.classList.remove('open');});
updateBadge();

var css2='.ot-saved-fab{position:fixed;left:18px;bottom:22px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,48,128,.35);background:rgba(8,4,24,.92);color:#ff3080;font-size:17px;cursor:pointer;z-index:9998;backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}'+
'.ot-saved-fab:hover{border-color:#ff3080;box-shadow:0 0 18px rgba(255,48,128,.35)}'+
'.ot-saved-badge{position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:#ff3080;color:#fff;font-size:10px;line-height:16px;text-align:center;display:none}'+
'.ot-saved-panel{position:fixed;left:18px;bottom:78px;width:290px;max-height:60vh;overflow:auto;background:rgba(8,4,24,.98);border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 40px rgba(0,0,0,.5);z-index:9998;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}'+
'.ot-saved-panel.open{opacity:1;transform:translateY(0);pointer-events:auto}'+
'.ot-saved-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.1);font-weight:700;font-size:13px;color:#f0eeff;letter-spacing:.05em;text-transform:uppercase}'+
'.ot-saved-close{background:none;border:none;color:#aaa1ba;cursor:pointer;font-size:14px}'+
'.ot-saved-list{padding:8px}'+
'.ot-saved-empty{padding:16px;font-size:12px;color:#8888aa}'+
'.ot-saved-item{display:flex;align-items:center;gap:10px;padding:8px;color:#cfc9e8;text-decoration:none;font-size:12.5px;line-height:1.4;border-bottom:1px solid rgba(255,255,255,.05)}'+
'.ot-saved-item:last-child{border-bottom:none}'+
'.ot-saved-item:hover{color:#00e5ff}'+
'.ot-saved-item img{width:44px;height:32px;object-fit:cover;flex-shrink:0}'+
'@media(max-width:720px){.ot-saved-fab{left:14px;bottom:18px;width:42px;height:42px}.ot-saved-panel{left:14px;width:calc(100vw - 28px);max-width:320px}}';
var st5=document.createElement('style');st5.textContent=css2;document.head.appendChild(st5);
})();

/* ── 🏷️ Dynamic Universal Tag Routing & Activation ── */
(function(){
  function activateTags() {
    var tagEls = document.querySelectorAll('.sb-tag, .am-tag, .tag-row .tag, .ac-tags .tag, .sc-body .tag');
    tagEls.forEach(function(el) {
      var tagText = el.textContent.trim().replace(/^#/, '');
      if (!tagText || tagText.length < 2) return;
      
      // If it is already an <a> tag
      if (el.tagName.toLowerCase() === 'a') {
        el.href = '/tag?q=' + encodeURIComponent(tagText);
      } else if (!el.closest('a')) {
        // If not wrapped in an anchor, convert to clickable tag link
        el.style.cursor = 'pointer';
        el.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = '/tag?q=' + encodeURIComponent(tagText);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activateTags);
  } else {
    activateTags();
  }
})();

/* ── 🎬 Dynamic Video Auto-Embed (YouTube & Vimeo) ── */
(function(){
  function parseVideo(url) {
    if (!url) return null;
    url = url.trim();
    var ym = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
    if (ym) return { provider: 'youtube', id: ym[1], embedUrl: 'https://www.youtube.com/embed/' + ym[1] };
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vm) return { provider: 'vimeo', id: vm[1], embedUrl: 'https://player.vimeo.com/video/' + vm[1] };
    return null;
  }

  function autoEmbedVideos() {
    var body = document.querySelector('.art-body, article.article');
    if (!body) return;

    var paras = body.querySelectorAll('p, div');
    paras.forEach(function(p) {
      if (p.closest('.art-video-embed, figure')) return;
      var links = p.querySelectorAll('a');
      var targetUrl = '';

      if (links.length === 1) {
        var pClone = p.cloneNode(true);
        var linkInClone = pClone.querySelector('a');
        var href = linkInClone.getAttribute('href') || linkInClone.textContent.trim();
        linkInClone.remove();
        var remainingText = pClone.textContent.replace(/[\s\u00a0]+/g, '').trim();
        if (!remainingText) {
          targetUrl = href;
        }
      } else if (links.length === 0) {
        var raw = p.textContent.trim();
        if (/^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/|vimeo\.com\/)[A-Za-z0-9_\-\/?=&;%]+$/i.test(raw)) {
          targetUrl = raw;
        }
      }

      if (targetUrl) {
        var v = parseVideo(targetUrl);
        if (v) {
          var figure = document.createElement('figure');
          figure.className = 'art-video-embed';
          figure.innerHTML = '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;"><iframe src="' + v.embedUrl + '" title="Video player" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
          p.replaceWith(figure);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoEmbedVideos);
  } else {
    autoEmbedVideos();
  }
})();

/* ── 💬 Interactive Community Discussion CTA & 📖 Franchise Cross-Linking ── */
(function(){
  var FRANCHISE_MAP = {
    'One Piece': {
      keywords: ['one piece', 'one-piece', 'zoro', 'luffy', 'mihawk', 'elbaf', 'vegapunk'],
      articles: [
        { url: '/one-piece-1194-spoiler-zoro-giai-phong-suc-manh-moi-mihawk-g', title: 'One Piece 1194 Spoiler: Zoro giải phóng sức mạnh mới' },
        { url: '/one-piece-god-valley-baad-films-announced', title: 'One Piece Công Bố 2 Phim Điện Ảnh Mới: God Valley, BAAD' },
        { url: '/one-piece-remake-wit-studio-netflix-trailer-chinh-thuc', title: 'The One Piece (Netflix x WIT Studio) Trailer Chính Thức' },
        { url: '/one-piece-final-saga-review', title: 'One Piece: Final Saga Review - Hành Trình Đến Laugh Tale' }
      ]
    },
    'Dragon Ball': {
      keywords: ['dragon ball', 'dragon-ball', 'toriyama', 'goku', 'beerus', 'daima', 'sparking zero'],
      articles: [
        { url: '/akira-toriyama-eisner-hall-of-fame', title: 'Akira Toriyama Được Ghi Danh Vào Eisner Hall of Fame' },
        { url: '/dragon-ball-daima', title: 'Dragon Ball DAIMA: Di Sản Cuối Cùng Của Toriyama' },
        { url: '/dragon-ball-super-beerus-goku-doi-dau-than-huy-diet-beerus', title: 'Dragon Ball Super: Beerus - Goku Đối Đầu Thần Hủy Diệt' }
      ]
    },
    'Genshin & HoYoverse': {
      keywords: ['genshin', 'honkai', 'star rail', 'star-rail', 'natlan', 'snezhnaya'],
      articles: [
        { url: '/genshin-natlan-review', title: 'Genshin Impact Natlan: Vùng Đất Lửa Và Bí Mật Celestia' },
        { url: '/genshin-70-snezhnaya-review', title: 'Genshin 7.0 Snezhnaya Review: Chương Cuối Tham Vọng' },
        { url: '/honkai-star-rail-review', title: 'Honkai: Star Rail Review: Bản Giao Hưởng Vũ Trụ' }
      ]
    },
    'Jujutsu Kaisen': {
      keywords: ['jujutsu', 'gojo', 'sukuna', 'culling game'],
      articles: [
        { url: '/jujutsu-kaisen-anime-review', title: 'Jujutsu Kaisen Anime Review: Định Hình Chuẩn Mực Shonen' },
        { url: '/jujutsu-kaisen-culling-game-part-2-sukuna-teaser', title: 'Jujutsu Kaisen Culling Game Phần 2: Teaser Sukuna' },
        { url: '/jujutsu-kaisen-juju-fes-2026-anniversary', title: 'Jujutsu Kaisen Mở Màn Juju Fes Kỷ Niệm 5 Năm' }
      ]
    },
    'Monster Hunter': {
      keywords: ['monster hunter', 'monster-hunter', 'wilds', 'gogmazios'],
      articles: [
        { url: '/monster-hunter-wilds-review', title: 'Monster Hunter Wilds Review: Kỷ Nguyên Mới 9.4 Điểm' },
        { url: '/monster-hunter-wilds-pc-demo-system-requirements', title: 'Monster Hunter Wilds Cấu Hình PC & Chi Tiết Bản Demo' }
      ]
    },
    'GTA': {
      keywords: ['gta', 'grand theft auto', 'rockstar', 'vice city', 'leonida'],
      articles: [
        { url: '/gta-6-gameplay-trailer-rockstar-vice-city-leonida', title: 'GTA 6 Tung Trailer Gameplay Mới: Bang Leonida Rực Lửa' },
        { url: '/gta6-preview', title: 'GTA 6 Toàn Cảnh: Giá Bán, Tính Năng & Bản Console' }
      ]
    },
    'Chainsaw Man': {
      keywords: ['chainsaw man', 'chainsaw-man', 'reze', 'denji'],
      articles: [
        { url: '/chainsaw-man-movie-reze-arc-chieu-rap-viet-nam-doanh-thu-ky-luc', title: 'Chainsaw Man: Reze Arc Phá Kỷ Lục Doanh Thu Phòng Vé' },
        { url: '/chainsaw-man-mua-2-assassins-arc-dang-san-xuat', title: 'Chainsaw Man Mùa 2 “Assassins Arc” Đang Sản Xuất' },
        { url: '/chainsaw-man-anime-review', title: 'Chainsaw Man Anime Review: MAPPA Làm Nên Kiệt Tác' }
      ]
    },
    'Bleach': {
      keywords: ['bleach', 'tybw', 'shinigami', 'quincy'],
      articles: [
        { url: '/bleach-tybw-the-calamity-25-7-2026', title: 'Bleach: TYBW - The Calamity Lên Sóng 10 Tập' },
        { url: '/bleach-tybw-calamity-opening-ending', title: 'Bleach TYBW: Công Bố Opening I-BULL Và Ending Rasen' }
      ]
    }
  };

  function initCommunityAndFranchise() {
    var shareRow = document.querySelector('.share-row');
    var body = document.querySelector('.art-body, article.article');
    if (!shareRow || !body) return;
    if (document.querySelector('.art-community-box')) return;

    var currentPath = window.location.pathname.replace(/\/$/, '');
    var pageText = (document.title + ' ' + (document.querySelector('h1') ? document.querySelector('h1').textContent : '')).toLowerCase();
    var cat = (document.querySelector('.am-tag, .art-hero-cat') ? document.querySelector('.am-tag, .art-hero-cat').textContent.trim() : '').toLowerCase();

    // 1. Franchise Cross-linking box
    for (var fName in FRANCHISE_MAP) {
      var fran = FRANCHISE_MAP[fName];
      var matches = fran.keywords.some(function(k) { return pageText.indexOf(k) !== -1; });
      if (matches) {
        var related = fran.articles.filter(function(art) {
          return currentPath.indexOf(art.url) === -1 && art.url !== currentPath;
        }).slice(0, 3);

        if (related.length > 0) {
          var fBox = document.createElement('div');
          fBox.className = 'art-franchise-box';
          var linksHtml = related.map(function(art) {
            return '<a href="' + art.url + '" class="afb-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> ' + art.title + '</a>';
          }).join('');
          fBox.innerHTML = '<div class="afb-title"><span>📖</span> Cùng Vũ Trụ ' + fName + '</div><div class="afb-links">' + linksHtml + '</div>';
          shareRow.parentNode.insertBefore(fBox, shareRow);
        }
        break;
      }
    }

    // 2. Interactive Community CTA Box
    var promptText = 'Bạn nghĩ sao về thông tin này? Hãy để lại cảm nghĩ và cùng bạn bè bàn luận dưới đây!';
    if (cat.indexOf('manga') !== -1) {
      promptText = 'Theo bạn, bước ngoặt cốt truyện này sẽ dẫn tới kết cục ra sao? Hãy bình chọn cảm nghĩ bên dưới nhé!';
    } else if (cat.indexOf('anime') !== -1) {
      promptText = 'Bạn đánh giá thế nào về diễn biến và chất lượng đồ họa của bộ anime? Hãy bình chọn cảm xúc bên dưới nhé!';
    } else if (cat.indexOf('game') !== -1 || cat.indexOf('review') !== -1) {
      promptText = 'Bạn đã sẵn sàng trải nghiệm tựa game này chưa, hay còn điểm gì băn khoăn về đồ họa và lối chơi? Hãy bình chọn cảm xúc!';
    } else if (cat.indexOf('esport') !== -1) {
      promptText = 'Bạn dự đoán đội tuyển nào sẽ giành ngôi vị quán quân? Hãy bình chọn cảm xúc và chia sẻ góc nhìn cùng OtaHub!';
    }

    var storageKey = 'otahub_vote_' + currentPath;
    var userVote = localStorage.getItem(storageKey) || '';

    // Generate pseudo-random consistent base counts from path
    var hash = 0;
    for (var i = 0; i < currentPath.length; i++) hash = (hash << 5) - hash + currentPath.charCodeAt(i);
    hash = Math.abs(hash);
    var baseFire = 15 + (hash % 27);
    var baseLove = 10 + ((hash >> 2) % 21);
    var baseThink = 4 + ((hash >> 4) % 12);

    var cBox = document.createElement('div');
    cBox.className = 'art-community-box';
    cBox.innerHTML = 
      '<div class="acb-header">' +
        '<h3 class="acb-title">💬 Góc Thảo Luận OtaHub</h3>' +
        '<span class="acb-badge">Cộng Đồng Độc Giả</span>' +
      '</div>' +
      '<p class="acb-prompt">' + promptText + '</p>' +
      '<div class="acb-reactions">' +
        '<button type="button" class="acb-btn' + (userVote==='fire'?' active':'') + '" data-reaction="fire">🔥 Quá đỉnh <span class="acb-count">' + (baseFire + (userVote==='fire'?1:0)) + '</span></button>' +
        '<button type="button" class="acb-btn' + (userVote==='love'?' active':'') + '" data-reaction="love">💖 Hóng xem <span class="acb-count">' + (baseLove + (userVote==='love'?1:0)) + '</span></button>' +
        '<button type="button" class="acb-btn' + (userVote==='think'?' active':'') + '" data-reaction="think">🤔 Cần chờ xem <span class="acb-count">' + (baseThink + (userVote==='think'?1:0)) + '</span></button>' +
        '<button type="button" class="acb-btn acb-share" data-reaction="share"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Chia sẻ bài</button>' +
      '</div>';

    shareRow.parentNode.insertBefore(cBox, shareRow);

    cBox.querySelectorAll('.acb-btn:not(.acb-share)').forEach(function(btn){
      btn.addEventListener('click', function(){
        var r = btn.getAttribute('data-reaction');
        var prev = localStorage.getItem(storageKey);
        if (prev === r) return; // already voted
        
        cBox.querySelectorAll('.acb-btn:not(.acb-share)').forEach(function(b){
          if (b.classList.contains('active')) {
            b.classList.remove('active');
            var c = b.querySelector('.acb-count');
            c.textContent = parseInt(c.textContent, 10) - 1;
          }
        });

        btn.classList.add('active');
        var cnt = btn.querySelector('.acb-count');
        cnt.textContent = parseInt(cnt.textContent, 10) + 1;
        localStorage.setItem(storageKey, r);
      });
    });

    var shareBtn = cBox.querySelector('.acb-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', function(){
        if (navigator.share) {
          navigator.share({ title: document.title, url: location.href }).catch(function(){});
        } else {
          navigator.clipboard.writeText(location.href).then(function(){
            var old = shareBtn.innerHTML;
            shareBtn.innerHTML = '✓ Đã sao chép link!';
            setTimeout(function(){ shareBtn.innerHTML = old; }, 2000);
          });
        }
      });
    }
  }

  var cCss = 
    '.art-community-box{margin:36px 0 24px;padding:22px 24px;background:linear-gradient(135deg,rgba(255,48,128,.06) 0%,rgba(0,229,255,.06) 100%);border:1px solid rgba(255,255,255,.12);border-left:4px solid #ff3080;border-radius:12px}'+
    '.acb-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px}'+
    '.acb-title{font-size:17px;font-weight:800;color:#f0eeff;margin:0}'+
    '.acb-badge{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#00e5ff;font-weight:700;background:rgba(0,229,255,.1);padding:3px 10px;border-radius:20px}'+
    '.acb-prompt{font-size:14.5px;color:#cfc9e8;line-height:1.6;margin:0 0 16px}'+
    '.acb-reactions{display:flex;flex-wrap:wrap;gap:10px}'+
    '.acb-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 15px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:8px;color:#e4e0fa;font-size:13.5px;font-weight:600;cursor:pointer;transition:all .2s cubic-bezier(0.4,0,0.2,1)}'+
    '.acb-btn:hover{background:rgba(255,255,255,.14);transform:translateY(-2px);border-color:rgba(255,48,128,.5)}'+
    '.acb-btn.active{background:rgba(255,48,128,.25);border-color:#ff3080;color:#fff;box-shadow:0 0 12px rgba(255,48,128,.3)}'+
    '.acb-count{font-size:12px;opacity:.85;font-family:monospace;background:rgba(0,0,0,.25);padding:2px 6px;border-radius:10px}'+
    '.art-franchise-box{margin:28px 0 22px;padding:16px 20px;background:rgba(0,229,255,.04);border:1px dashed rgba(0,229,255,.3);border-radius:10px}'+
    '.afb-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#00e5ff;margin:0 0 10px;display:flex;align-items:center;gap:6px}'+
    '.afb-links{display:flex;flex-direction:column;gap:6px}'+
    '.afb-link{display:flex;align-items:center;gap:8px;color:#e4e0fa;text-decoration:none;font-size:13.5px;line-height:1.4;padding:7px 10px;border-radius:6px;transition:background .15s,color .15s}'+
    '.afb-link:hover{background:rgba(255,255,255,.08);color:#00e5ff}'+
    '.afb-link svg{flex-shrink:0;color:#ff3080}';

  var stC = document.createElement('style');
  stC.textContent = cCss;
  document.head.appendChild(stC);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityAndFranchise);
  } else {
    initCommunityAndFranchise();
  }
})();
