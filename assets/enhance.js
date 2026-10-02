/* OtaHub UI polish, ngày kiểu Việt, mục lục bài viết, nút copy link */
/* Chữ do script này chèn vào phải theo ngôn ngữ trang: trang /en/ hiện tiếng Anh. */
var OT_EN=/^\/en(\/|$)/.test(location.pathname);
function OT_T(vi,en){return OT_EN?en:vi;}
(function(){
var MONTHS=OT_EN?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']:['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
function fmtDate(iso){
  var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if(!m)return iso;
  var y=m[1],mo=parseInt(m[2],10),d=parseInt(m[3],10);
  // Tiếng Việt: dd/mm/yyyy như trang chủ ("1 Th10, 2026" khó đọc); tiếng Anh: "Oct 1, 2026"
  if(!OT_EN)return (d<10?'0':'')+d+'/'+m[2]+'/'+y;
  return MONTHS[mo-1]+' '+d+', '+y;
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
  link.href=(location.pathname.indexOf('/en/')===0?'/en/author/':'/author/')+slug;
  link.className='author-profile-link';
  link.setAttribute('aria-label',OT_T('Xem hồ sơ và các bài của ','View profile and articles by ')+el.textContent.trim());
  el.parentNode.insertBefore(link,el);
  link.appendChild(el);
});

// "Bài viết liên quan" không được trỏ về chính bài đang đọc
var herePath=location.pathname.replace(/\.html$/,'').replace(/\/$/,'');
document.querySelectorAll('.art-sidebar a.sb-art').forEach(function(a){
  if(a.getAttribute('href').replace(/\.html$/,'').replace(/\/$/,'')===herePath)a.remove();
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
    toc.className=window.innerWidth<900?'toc-block':'toc-block open';
    toc.innerHTML='<button type="button" class="toc-toggle">'+OT_T('Mục lục bài viết','Contents')+' <span class="toc-arrow">▾</span></button><nav class="toc-list">'+items.join('')+'</nav>';
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
  if(row.querySelector('.copy-link-btn,[onclick*="copyArticleLink"]'))return;
  var btn=document.createElement('button');
  btn.type='button';btn.className='share-btn copy-link-btn';
  btn.textContent=OT_T('Sao chép link','Copy link');
  btn.addEventListener('click',function(){
    navigator.clipboard.writeText(location.href).then(function(){
      var t=btn.textContent;btn.textContent=OT_T('Đã copy!','Copied!');
      setTimeout(function(){btn.textContent=t;},1800);
    });
  });
  row.appendChild(btn);
});

var css='.toc-block{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);margin:0 0 28px}'+
'.toc-toggle{width:100%;text-align:left;background:none;border:none;color:#f0eeff;font-family:var(--fd),sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:14px 18px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;min-height:44px}'+
'.toc-arrow{transition:transform .2s;color:#00f2ff;flex-shrink:0}'+
'.toc-block.open .toc-arrow{transform:rotate(180deg)}'+
'.toc-list{display:none;flex-direction:column;padding:0 18px 16px}'+
'.toc-block.open .toc-list{display:flex}'+
'.toc-list a{color:#9a94b8;text-decoration:none;font-size:13px;padding:9px 0;border-top:1px solid rgba(255,255,255,.06)}'+
'.toc-list a:first-child{border-top:none}'+
'.toc-list a:hover{color:#00f2ff}'+
'.author-profile-link{color:inherit;text-decoration:none;border-radius:999px}.author-profile-link:hover .am-badge,.author-profile-link:hover .am-name{color:#00f2ff;text-decoration:underline;text-underline-offset:3px}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();

/* Reading progress bar, art/review pages only */
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
// lần tính đầu sau khi tải xong: tránh ép layout trước lần vẽ đầu
if(document.readyState==='complete')update();else window.addEventListener('load',update);
var css='.ot-progress{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:10000;pointer-events:none}'+
'.ot-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#ff2177,#00f2ff);transition:width .12s linear}';
var st2=document.createElement('style');st2.textContent=css;document.head.appendChild(st2);
})();

/* Back-to-top button, site-wide */
(function(){
var btt=document.createElement('button');
btt.type='button';
btt.className='ot-btt';
btt.setAttribute('aria-label',OT_T('Lên đầu trang','Back to top'));
btt.innerHTML='↑';
document.body.appendChild(btt);
btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
function toggle(){
  if(window.scrollY>500)btt.classList.add('show');
  else btt.classList.remove('show');
}
window.addEventListener('scroll',toggle,{passive:true});
if(document.readyState==='complete')toggle();else window.addEventListener('load',toggle);
var css='.ot-btt{position:fixed;right:18px;bottom:22px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,242,255,.35);background:rgba(8,4,24,.92);color:#00f2ff;font-size:18px;line-height:1;cursor:pointer;z-index:9998;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .25s,transform .25s,border-color .2s,box-shadow .2s;backdrop-filter:blur(8px)}'+
'.ot-btt.show{opacity:1;transform:translateY(0);pointer-events:auto}'+
'.ot-btt:hover{border-color:#00f2ff;box-shadow:0 0 18px rgba(0,242,255,.35)}'+
'@media(max-width:720px){.ot-btt{right:14px;bottom:18px;width:40px;height:40px;font-size:16px}}';
var st3=document.createElement('style');st3.textContent=css;document.head.appendChild(st3);
})();

/* Card hover glow, site-wide, pure CSS */
(function(){
var css='.ac,.fc,.w-card,.anime-card,.rk-card{transition:box-shadow .25s ease,border-color .25s ease}'+
'.ac:hover,.fc:hover,.w-card:hover,.anime-card:hover,.rk-card:hover{box-shadow:0 0 0 1px rgba(0,242,255,.25),0 10px 30px rgba(0,242,255,.13)}';
var st4=document.createElement('style');st4.textContent=css;document.head.appendChild(st4);
})();

/* Save/bookmark article, localStorage, no backend */
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
  var SAVE_ON=OT_T('Đã lưu ✓','Saved ✓'),SAVE_OFF=OT_T('🔖 Lưu bài','🔖 Save');
  btn.textContent=already?SAVE_ON:SAVE_OFF;
  btn.addEventListener('click',function(){
    var list=getSaved();
    var idx=list.findIndex(function(s){return s.url===url;});
    if(idx>-1){
      list.splice(idx,1);
      btn.textContent=SAVE_OFF;
      btn.classList.remove('saved');
    }else{
      var titleEl=document.querySelector('h1');
      var imgEl=document.querySelector('.hero img,.art-body img,article.article img,header img');
      list.push({url:url,title:titleEl?titleEl.textContent.trim():document.title,img:imgEl?imgEl.getAttribute('src'):'',ts:Date.now()});
      btn.textContent=SAVE_ON;
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
launcher.setAttribute('aria-label',OT_T('Bài đã lưu','Saved articles'));
launcher.innerHTML='🔖<span class="ot-saved-badge">0</span>';
document.body.appendChild(launcher);

var panel=document.createElement('div');
panel.className='ot-saved-panel';
panel.innerHTML='<div class="ot-saved-head">'+OT_T('Bài đã lưu','Saved articles')+'<button type="button" class="ot-saved-close" aria-label="'+OT_T('Đóng','Close')+'">✕</button></div><div class="ot-saved-list"></div>';
document.body.appendChild(panel);

function renderPanel(list){
  var box=panel.querySelector('.ot-saved-list');
  if(!list.length){box.innerHTML='<div class="ot-saved-empty">'+OT_T('Chưa có bài viết nào được lưu.','No saved articles yet.')+'</div>';return;}
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

var css2='.ot-saved-fab{position:fixed;left:18px;bottom:22px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,33,119,.35);background:rgba(8,4,24,.92);color:#ff2177;font-size:17px;cursor:pointer;z-index:9998;backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}'+
'.ot-saved-fab:hover{border-color:#ff2177;box-shadow:0 0 18px rgba(255,33,119,.35)}'+
'.ot-saved-badge{position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:#ff2177;color:#fff;font-size:10px;line-height:16px;text-align:center;display:none}'+
'.ot-saved-panel{position:fixed;left:18px;bottom:78px;width:290px;max-height:60vh;overflow:auto;background:rgba(8,4,24,.98);border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 40px rgba(0,0,0,.5);z-index:9998;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}'+
'.ot-saved-panel.open{opacity:1;transform:translateY(0);pointer-events:auto}'+
'.ot-saved-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.1);font-weight:700;font-size:13px;color:#f0eeff;letter-spacing:.05em;text-transform:uppercase}'+
'.ot-saved-close{background:none;border:none;color:#aaa1ba;cursor:pointer;font-size:14px}'+
'.ot-saved-list{padding:8px}'+
'.ot-saved-empty{padding:16px;font-size:12px;color:#8888aa}'+
'.ot-saved-item{display:flex;align-items:center;gap:10px;padding:8px;color:#cfc9e8;text-decoration:none;font-size:12.5px;line-height:1.4;border-bottom:1px solid rgba(255,255,255,.05)}'+
'.ot-saved-item:last-child{border-bottom:none}'+
'.ot-saved-item:hover{color:#00f2ff}'+
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
    url = String(url).trim();
    var iframeSrc = url.match(/src=["']([^"']+)["']/i);
    if (iframeSrc) url = iframeSrc[1];
    var ym = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?(?:.*&)?v=))([A-Za-z0-9_-]{11})/i)
          || url.match(/youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})/i);
    if (ym) return { provider: 'youtube', id: ym[1], embedUrl: 'https://www.youtube.com/embed/' + ym[1] };
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vm) return { provider: 'vimeo', id: vm[1], embedUrl: 'https://player.vimeo.com/video/' + vm[1] };
    return null;
  }

  function autoEmbedVideos() {
    var body = document.querySelector('.art-body, article.article');
    if (!body) return;

    // Self-healing: sửa các khối video embed cũ hoặc bị lỗi bọc <p>
    var existingFigures = body.querySelectorAll('figure.art-video-embed, .art-video-embed');
    existingFigures.forEach(function(fig) {
      var ifr = fig.querySelector('iframe');
      if (ifr) {
        var existingInner = fig.querySelector('.art-video-inner');
        if (!existingInner) {
          var wrap = document.createElement('div');
          wrap.className = 'art-video-inner';
          wrap.style.cssText = 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;background:#000;';
          ifr.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
          var parentP = ifr.closest('p');
          if (parentP && parentP.parentNode === fig) {
            fig.replaceChild(wrap, parentP);
          } else if (ifr.parentNode !== wrap) {
            ifr.parentNode.insertBefore(wrap, ifr);
          }
          wrap.appendChild(ifr);
        }
      }
    });

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
        if (/^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?|shorts\/|live\/|embed\/)|youtu\.be\/|vimeo\.com\/)[A-Za-z0-9_\-\/?=&;%]+$/i.test(raw)) {
          targetUrl = raw;
        }
      }

      if (targetUrl) {
        var v = parseVideo(targetUrl);
        if (v) {
          var figure = document.createElement('figure');
          figure.className = 'art-video-embed';
          figure.innerHTML = '<div class="art-video-inner" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;"><iframe src="' + v.embedUrl + '" title="Video player" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe></div>';
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

  function initFranchiseLinking() {
    var shareRow = document.querySelector('.share-row');
    var body = document.querySelector('.art-body, article.article');
    if (!shareRow || !body) return;
    // FRANCHISE_MAP chỉ chứa bài tiếng Việt: không chèn link VI vào trang tiếng Anh.
    if (OT_EN) return;
    if (document.querySelector('.art-franchise-box')) return;

    var currentPath = window.location.pathname.replace(/\/$/, '');
    var pageText = (document.title + ' ' + (document.querySelector('h1') ? document.querySelector('h1').textContent : '')).toLowerCase();

    // Franchise Cross-linking box
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
  }

  var fCss = 
    '.art-franchise-box{margin:28px 0 22px;padding:16px 20px;background:rgba(0,242,255,.04);border:1px dashed rgba(0,242,255,.3);border-radius:10px}'+
    '.afb-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#00f2ff;margin:0 0 10px;display:flex;align-items:center;gap:6px}'+
    '.afb-links{display:flex;flex-direction:column;gap:6px}'+
    '.afb-link{display:flex;align-items:center;gap:8px;color:#e4e0fa;text-decoration:none;font-size:13.5px;line-height:1.4;padding:7px 10px;border-radius:6px;transition:background .15s,color .15s}'+
    '.afb-link:hover{background:rgba(255,255,255,.08);color:#00f2ff}'+
    '.afb-link svg{flex-shrink:0;color:#ff2177}';

  var stC = document.createElement('style');
  stC.textContent = fCss;
  document.head.appendChild(stC);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFranchiseLinking);
  } else {
    initFranchiseLinking();
  }
})();

/* ── 📱 OtaHub Mobile Navigation & Ergonomics (Pills Bar, Bottom Bar, Smart TOC) ── */
(function(){
  function initMobileBars() {
    var mobileViewport = window.matchMedia('(max-width: 768px)');

    // Không tạo điều hướng mobile trên desktop. Trước đây các phần tử này luôn
    // được chèn rồi mới trông chờ CSS ẩn đi, nên chúng có thể lóe thành link thô
    // khi stylesheet tải chậm, bị cache sai hoặc tạm thời không tải được.
    if (!mobileViewport.matches) {
      var mountedBars = document.querySelectorAll('.mob-cat-bar, .mob-bottom-bar');
      for (var mountedIndex = 0; mountedIndex < mountedBars.length; mountedIndex++) {
        mountedBars[mountedIndex].remove();
      }
      return;
    }

    var path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    var isEn = path.indexOf('/en') === 0;

    // 1. Mount Thanh chuyên mục vuốt ngang (Horizontal Category Pills)
    var nav = document.querySelector('nav.nav');
    if (nav && !document.querySelector('.mob-cat-bar')) {
      var catBar = document.createElement('nav');
      catBar.className = 'mob-cat-bar';
      catBar.setAttribute('aria-label', isEn ? 'Categories' : 'Chuyên mục nhanh');

      var categories = isEn ? [
        { name: '🔥 Latest', url: '/en/news', match: ['/en/news', '/en'] },
        { name: '🎮 Gaming', url: '/en/gaming', match: ['/en/gaming'] },
        { name: '🎬 Anime', url: '/en/anime', match: ['/en/anime'] },
        { name: '📖 Manga', url: '/en/manga', match: ['/en/manga'] },
        { name: '📅 Schedule', url: '/en/lich-phat-song', match: ['/en/lich-phat-song'] },
        { name: '⭐ Reviews', url: '/en/reviews', match: ['/en/reviews'] },
        { name: '🏆 Rankings', url: '/en/rankings', match: ['/en/rankings'] },
        { name: '💡 Deep Dives', url: '/en/in-depth', match: ['/en/in-depth'] }
      ] : [
        { name: '🔥 Tin mới', url: '/news', match: ['/news', '/'] },
        { name: '🎮 Gaming', url: '/gaming', match: ['/gaming'] },
        { name: '🎬 Anime', url: '/anime', match: ['/anime'] },
        { name: '📖 Manga', url: '/manga', match: ['/manga'] },
        { name: '📅 Lịch phát sóng', url: '/lich-phat-song', match: ['/lich-phat-song'] },
        { name: '⭐ Đánh giá', url: '/reviews', match: ['/reviews'] },
        { name: '🏆 Xếp hạng', url: '/rankings', match: ['/rankings'] },
        { name: '🎲 Chơi Gì?', url: '/choi-gi', match: ['/choi-gi'] },
        { name: '💡 Chuyên sâu', url: '/chuyen-sau', match: ['/chuyen-sau'] }
      ];

      var itemsHtml = categories.map(function(c) {
        var isActive = false;
        if (c.url === '/' || c.url === '/en') {
          isActive = (path === '' || path === '/' || path === '/en');
        } else {
          isActive = c.match.some(function(m) { return path === m || path.indexOf(m + '/') === 0; });
        }
        return '<a href="' + c.url + '" class="mob-cat-item' + (isActive ? ' active' : '') + '">' + c.name + '</a>';
      }).join('');

      catBar.innerHTML = '<div class="mob-cat-scroll">' + itemsHtml + '</div>';
      nav.parentNode.insertBefore(catBar, nav.nextSibling);

      // Cuộn mục active vào giữa màn hình
      var activeItem = catBar.querySelector('.mob-cat-item.active');
      if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        setTimeout(function() {
          activeItem.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }, 120);
      }
    }

    // 2. Mount Thanh điều hướng cố định dưới đáy màn hình (Sticky Bottom Nav)
    if (!document.querySelector('.mob-bottom-bar')) {
      var botBar = document.createElement('nav');
      botBar.className = 'mob-bottom-bar';
      botBar.setAttribute('aria-label', isEn ? 'Bottom Navigation' : 'Thanh điều hướng dưới');

      var isHome = path === '/' || path === '/en' || path === '';
      var isNews = path === '/news' || path === '/en/news';

      botBar.innerHTML = 
        '<a href="' + (isEn ? '/en' : '/') + '" class="mob-bar-btn' + (isHome ? ' active' : '') + '" aria-label="' + (isEn ? 'Home' : 'Trang chủ') + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>' +
          '<span>' + (isEn ? 'Home' : 'Trang chủ') + '</span>' +
        '</a>' +
        '<a href="' + (isEn ? '/en/news' : '/news') + '" class="mob-bar-btn' + (isNews ? ' active' : '') + '" aria-label="' + (isEn ? 'News' : 'Tin mới') + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' +
          '<span>' + (isEn ? 'News' : 'Tin mới') + '</span>' +
        '</a>' +
        '<button type="button" class="mob-bar-btn" id="mob-search-btn" aria-label="' + (isEn ? 'Search' : 'Tìm kiếm') + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
          '<span>' + (isEn ? 'Search' : 'Tìm kiếm') + '</span>' +
        '</button>' +
        '<button type="button" class="mob-bar-btn" id="mob-saved-btn" aria-label="' + (isEn ? 'Saved' : 'Đã lưu') + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>' +
          '<span>' + (isEn ? 'Saved' : 'Đã lưu') + '</span>' +
        '</button>' +
        '<button type="button" class="mob-bar-btn" id="mob-menu-btn" aria-label="Menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>' +
          '<span>Menu</span>' +
        '</button>';

      document.body.appendChild(botBar);

      // Event Listeners cho các nút action
      var sBtn = botBar.querySelector('#mob-search-btn');
      if (sBtn) sBtn.addEventListener('click', function(){ if (typeof openSearch === 'function') openSearch(); });

      var mBtn = botBar.querySelector('#mob-menu-btn');
      if (mBtn) mBtn.addEventListener('click', function(){ if (typeof toggleMob === 'function') toggleMob(); });

      var saveBtn = botBar.querySelector('#mob-saved-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', function(){
          var p = document.querySelector('.ot-saved-panel');
          if (p) p.classList.toggle('open');
        });
      }
    }

    // 3. Tự động thu gọn Mục Lục (TOC) trên màn hình điện thoại
    if (window.matchMedia('(max-width: 768px)').matches) {
      var toc = document.querySelector('.art-toc');
      if (toc && !toc.classList.contains('collapsed')) {
        toc.classList.add('collapsed');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileBars);
  } else {
    initMobileBars();
  }

  var mobileQuery = window.matchMedia('(max-width: 768px)');
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', initMobileBars);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(initMobileBars);
  }
})();

/* ── 🎨 Màu theo chuyên mục: Gaming cyan · Anime hồng · Manga tím · Esports vàng · Review xanh lá ──
   Nhãn chuyên mục do nhiều nơi sinh ra (admin, hub, trang chủ) và trước đây cùng một màu. Đọc chữ
   trong nhãn, gắn data-cat rồi tô màu bằng CSS, để cả bài đăng sau này cũng tự có màu đúng. */
(function(){
  var SEL = '.wc-c,.sa-c,.h-meta-cat,.fc-meta>span:first-child,.sc-body .tag,.fc-body .tag,.ac-top .tag,.ac-thumb .tag,.sb-cat';
  var RULES = [
    [/^(esports?|thể thao điện tử)/, 'esports'],
    [/^(anime|phim)/, 'anime'],
    [/^(manga|manhwa|manhua|truyện)/, 'manga'],
    [/^(review|đánh giá|preview)/, 'review'],
    [/^(gaming|game|pc|mobile|gacha|console|xbox|playstation|nintendo|steam)/, 'gaming']
  ];
  function catOf(text){
    var t = (text || '').replace(/[🔴🔥:]/g, '').trim().toLocaleLowerCase('vi');
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return RULES[i][1];
    return '';
  }
  // Trang tiếng Việt: chuyên mục nội bộ (Reviews, Rankings...) hiển thị bằng tiếng Việt,
  // kể cả khi admin ghi lại nhãn gốc lúc lưu bài.
  var IS_VI = /^vi/i.test(document.documentElement.lang || '');
  var VI_LABEL = { 'Reviews': 'Đánh giá', 'Review': 'Đánh giá', 'Rankings': 'Xếp hạng', 'Guides': 'Hướng dẫn', 'Guide': 'Hướng dẫn',
    'News': 'Tin tức', 'Tags': 'Chủ đề', 'In-Depth': 'Chuyên sâu' };
  var LABEL_SEL = SEL + ',.art-hero-cat,.am-tag,.sb-tag,.sb-title,.cat-name,.rg-cat,.qcard-t';
  function paint(root){
    if (IS_VI) (root || document).querySelectorAll(LABEL_SEL).forEach(function(el){
      if (el.children.length) return;
      var t = el.textContent.trim();
      if (VI_LABEL[t]) el.textContent = VI_LABEL[t];
    });
    (root || document).querySelectorAll(SEL).forEach(function(el){
      if (el.hasAttribute('data-cat')) return;
      var c = catOf(el.textContent);
      if (c) el.setAttribute('data-cat', c);
    });
  }
  var css = ':root{--cat-gaming:#00f2ff;--cat-anime:#ff4f9a;--cat-manga:#a78bfa;--cat-esports:#fbbf24;--cat-review:#34d399}' +
    '[data-cat=gaming]{--cc:var(--cat-gaming)}[data-cat=anime]{--cc:var(--cat-anime)}[data-cat=manga]{--cc:var(--cat-manga)}' +
    '[data-cat=esports]{--cc:var(--cat-esports)}[data-cat=review]{--cc:var(--cat-review)}' +
    '.wc-c[data-cat],.sa-c[data-cat],.h-meta-cat[data-cat],.fc-meta>span[data-cat],.sb-cat[data-cat]{color:var(--cc)!important}' +
    '.tag[data-cat]{color:var(--cc)!important;border-color:color-mix(in srgb,var(--cc) 45%,transparent)!important;background:color-mix(in srgb,var(--cc) 14%,rgba(11,4,24,.72))!important}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ paint(); });
  else paint();
  // Thẻ bài do script khác chèn sau khi trang tải (lịch anime, danh sách động...)
  if (window.MutationObserver) {
    var pending = false;
    new MutationObserver(function(){
      if (pending) return; pending = true;
      setTimeout(function(){ pending = false; paint(); }, 120);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();

/* ── 📱 Chữ tối thiểu 10px trên điện thoại ──
   Nhiều nhãn/huy hiệu (chuyên mục, thể loại, nền tảng...) đặt 8–9px ở từng trang với tên class khác
   nhau; dưới 10px gần như không đọc được trên màn hình điện thoại. Chỉ nâng phần chữ quá nhỏ. */
(function(){
  if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
  function bump(){
    var els = document.body ? document.body.getElementsByTagName('*') : [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i], hasText = false;
      for (var c = el.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3 && c.nodeValue.trim().length > 1) { hasText = true; break; }
      }
      if (!hasText) continue;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 10) el.style.fontSize = '10px';
    }
  }
  // Chạy 1 lần lúc trình duyệt rảnh sau khi tải, không chặn lần vẽ đầu
  function later(){ (window.requestIdleCallback || function(f){ setTimeout(f, 300); })(bump, { timeout: 2000 }); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
})();

/* ── 🖼️ Ảnh hero độ phân giải thấp ──
   Nhiều ảnh hero là banner nhỏ/dẹt (vd. 1150×400, 1600×337) bị background-size:cover kéo phủ khung
   ~1280×610 → phóng to ~1,8 lần, vỡ hạt. Khi cần phóng quá 1,35 lần: hiện ảnh NÉT ở kích thước không
   phóng to (vừa khung), nền phía sau là chính ảnh đó làm mờ. Ảnh đủ lớn giữ nguyên kiểu cover. */
(function(){
  var SEL = '.art-hero-img,.h-img';
  var css = '.ot-lowres{background-image:none!important;overflow:hidden}' +
    '.ot-lowres::before,.ot-lowres::after{content:"";position:absolute;inset:0;background-image:var(--ot-bg);background-repeat:no-repeat;background-position:center;pointer-events:none}' +
    '.ot-lowres::before{inset:-48px;background-size:cover;filter:blur(30px) saturate(1.15) brightness(.55)}' +
    '.ot-lowres::after{background-size:var(--ot-w) var(--ot-h)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var items = [];
  function apply(it){
    var el = it.el, img = it.img, r = el.getBoundingClientRect();
    if (!r.width || !r.height || !img.naturalWidth) return;
    var cover = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    if (cover > 1.35) {
      var s = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight, 1);
      el.style.setProperty('--ot-bg', 'url("' + img.src + '")');
      el.style.setProperty('--ot-w', Math.round(img.naturalWidth * s) + 'px');
      el.style.setProperty('--ot-h', Math.round(img.naturalHeight * s) + 'px');
      el.classList.add('ot-lowres');
    } else {
      el.classList.remove('ot-lowres');
    }
  }
  function init(){
    document.querySelectorAll(SEL).forEach(function(el){
      var m = (el.style.backgroundImage || getComputedStyle(el).backgroundImage || '').match(/url\(["']?([^"')]+)["']?\)/);
      if (!m) return;
      var img = new Image(), it = { el: el, img: img };
      img.onload = function(){ items.push(it); apply(it); };
      img.src = m[1];
    });
  }
  var t;
  window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(function(){ items.forEach(apply); }, 150); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ── ☰ Menu trượt: hàm dự phòng ──
   Một số trang hub (Gaming, Anime, Manga) gọi toggleMobileNav() nhưng không khai báo hàm này, nên nút ☰
   và nút "Menu" ở thanh dưới không mở được menu. Chỉ dùng khi trang không tự định nghĩa. */
(function(){
  function toggle(){
    var n = document.getElementById('mobileNav') || document.getElementById('mobnav') || document.querySelector('.mobile-nav');
    if (!n) return;
    var o = n.classList.toggle('open');
    var h = document.getElementById('hamBtn') || document.getElementById('ham') || document.querySelector('.ham');
    if (h) h.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  }
  if (typeof window.toggleMobileNav !== 'function') window.toggleMobileNav = toggle;
  if (typeof window.toggleMob !== 'function') window.toggleMob = toggle;
})();

/* ── 🔍 Tìm kiếm: hàm dự phòng ──
   27 trang (Anime, trang tác giả, trang chi tiết...) có nút tìm kiếm nhưng không khai báo openSearch(),
   nên nút ở đầu trang và ở thanh dưới không làm gì. Có lớp phủ tìm kiếm thì mở, không thì sang /tag. */
(function(){
  if (typeof window.openSearch === 'function') return;
  window.openSearch = function(){
    var ov = document.getElementById('searchOverlay') || document.querySelector('.search-overlay');
    if (ov) {
      ov.classList.add('open');
      var inp = ov.querySelector('input');
      if (inp) setTimeout(function(){ inp.focus(); }, 50);
      return;
    }
    location.href = '/tag';
  };
})();
