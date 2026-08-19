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
'.toc-list a:hover{color:#00e5ff}';
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
