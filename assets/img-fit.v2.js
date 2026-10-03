/* OtaHub: ảnh trong khung luôn phủ kín (object-fit:cover), không co lại kèm viền đen, để các thẻ đồng bộ.
   Ảnh lệch tỉ lệ nhiều so với khung chỉ được dời tiêu điểm: poster dọc lấy phần trên (thường là mặt nhân vật). */
(function(){
var SKIP='.art-hero-img,.art-hero-bg,.anime-card .an-poster,.sch-card';
function fit(img){
  if(!img.naturalWidth||img.dataset.fitDone==='1')return;
  if(img.closest&&img.closest(SKIP))return;
  var cs=getComputedStyle(img);
  if(cs.objectFit!=='cover')return;
  var b=img.getBoundingClientRect();
  if(b.width<30||b.height<30)return;
  var r=(img.naturalWidth/img.naturalHeight)/(b.width/b.height);
  if(r<0.7&&!img.style.objectPosition)img.style.objectPosition='center 22%';
  img.dataset.fitDone='1';
}
function scan(){document.querySelectorAll('img').forEach(fit);}
document.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IMG')fit(e.target);},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
window.addEventListener('load',function(){scan();setTimeout(scan,1200);});
window.addEventListener('resize',function(){document.querySelectorAll('img[data-fit-done]').forEach(function(i){delete i.dataset.fitDone;i.style.objectPosition='';});scan();});
})();
