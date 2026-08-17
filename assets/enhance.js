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
