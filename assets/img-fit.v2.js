/* OtaHub: stop object-fit:cover from chopping images whose shape differs a lot from their frame (posters, wide banners) */
(function(){
var SKIP='.art-hero-img,.art-hero-bg,.anime-card .an-poster';
function fit(img){
  if(!img.naturalWidth||img.dataset.fitDone==='1')return;
  if(img.closest&&img.closest(SKIP))return;
  var cs=getComputedStyle(img);
  if(cs.objectFit!=='cover')return;
  var b=img.getBoundingClientRect();
  if(b.width<30||b.height<30)return;
  if(b.width<=170&&b.height<=170)return; /* thumbnails: keep cover so they fill the frame */
  var r=(img.naturalWidth/img.naturalHeight)/(b.width/b.height);
  if(r>1.45||r<0.7){
    img.style.objectFit='contain';
    var p=img.parentElement;
    if(p&&!p.style.background&&!p.style.backgroundColor)p.style.backgroundColor='#0b0418';
  }
  img.dataset.fitDone='1';
}
function scan(){document.querySelectorAll('img').forEach(fit);}
document.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IMG')fit(e.target);},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
window.addEventListener('load',function(){scan();setTimeout(scan,1200);});
window.addEventListener('resize',function(){document.querySelectorAll('img[data-fit-done]').forEach(function(i){delete i.dataset.fitDone;i.style.objectFit='';});scan();});
})();
