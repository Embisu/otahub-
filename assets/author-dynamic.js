(async function(){
  var slug=location.pathname.split('/').filter(Boolean).pop()||'';
  var isEn=location.pathname.indexOf('/en/')===0;
  var esc=function(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')};
  try{
    var responses=await Promise.all([fetch('/api/author/'+encodeURIComponent(slug)),fetch('/assets/author-articles.json?v=20260929')]);
    if(!responses[0].ok)throw new Error('not-found');
    var profile=await responses[0].json(),all=responses[1].ok?await responses[1].json():[];
    var list=all.filter(function(a){return a.key===slug&&a.lang===(isEn?'EN':'VI')});
    var counts={};list.forEach(function(a){counts[a.cat]=(counts[a.cat]||0)+1});
    var initials=profile.name==='OtaHub Editorial'?'OH':profile.name.split(/\s+/).slice(0,2).map(function(x){return x[0]}).join('').toUpperCase();
    document.title=profile.name+(isEn?' — Author Profile · OtaHub':' — Hồ sơ tác giả · OtaHub');
    document.getElementById('author-robots').content='index,follow';
    document.getElementById('crumb-name').textContent=profile.name;
    document.getElementById('author-name').textContent=profile.name;
    document.getElementById('author-role').textContent=profile.role;
    if(profile.avatar){
      document.getElementById('author-avatar').innerHTML='<img src="'+esc(profile.avatar)+'" alt="'+esc(profile.name)+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
    }else{
      document.getElementById('author-avatar').textContent=initials;
    }
    document.getElementById('author-total').textContent=list.length;
    document.getElementById('articles-title').textContent=(isEn?'Articles by ':'Bài của ')+profile.name;
    if(profile.bio){
      document.getElementById('author-bio').textContent=profile.bio;
    }else{
      document.getElementById('author-bio').textContent=isEn?profile.name+' contributes reporting and editorial coverage across gaming, anime and manga on OtaHub.':profile.name+' là '+profile.role.toLowerCase()+' của OtaHub. Trang này tổng hợp các bài viết đã xuất bản của tác giả.';
    }
    var stats=Object.entries(counts).sort(function(a,b){return b[1]-a[1]});
    document.getElementById('author-stats').innerHTML='<div><strong>'+list.length+'</strong><span>Tổng bài</span></div>'+stats.slice(0,4).map(function(x){return '<div><strong>'+x[1]+'</strong><span>'+esc(x[0])+'</span></div>'}).join('');
    var select=document.getElementById('author-filter');
    select.innerHTML='<option value="">Tất cả ('+list.length+')</option>'+stats.map(function(x){return '<option value="'+esc(x[0])+'">'+esc(x[0])+' ('+x[1]+')</option>'}).join('');
    var box=document.getElementById('author-articles'),empty=document.getElementById('author-empty');
    function render(){var selected=select.value,shown=list.filter(function(a){return !selected||a.cat===selected});box.innerHTML=shown.map(function(a){return '<article class="author-card"><a class="card-image" href="'+esc(a.url)+'"><img src="'+esc(a.image)+'" alt="'+esc(a.title)+'" loading="lazy" width="320" height="180"></a><div class="card-body"><div class="card-meta"><span>'+esc(a.cat)+'</span><span>'+esc(a.lang)+'</span><time>'+esc(a.date.split('-').reverse().join('/'))+'</time></div><h2><a href="'+esc(a.url)+'">'+esc(a.title)+'</a></h2><p>'+esc(a.excerpt)+'</p></div></article>'}).join('');empty.hidden=shown.length>0;}
    select.addEventListener('change',render);render();
  }catch(e){document.getElementById('author-name').textContent='Không tìm thấy tác giả';document.getElementById('author-bio').textContent='Hồ sơ này không thuộc tài khoản tác giả đang hoạt động trên OtaHub.';document.getElementById('author-filter').hidden=true;document.getElementById('articles-title').textContent='Chưa có hồ sơ';}
})();
