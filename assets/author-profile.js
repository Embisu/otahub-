(function(){
  var select=document.getElementById('author-filter');
  if(select){
    var cards=[].slice.call(document.querySelectorAll('.author-card'));
    var empty=document.getElementById('author-empty');
    select.addEventListener('change',function(){
      var value=select.value,shown=0;
      cards.forEach(function(card){
        var visible=!value||card.getAttribute('data-cat')===value;
        card.hidden=!visible;
        if(visible)shown++;
      });
      if(empty)empty.hidden=shown>0;
    });
  }

  // Tự động đồng bộ thông tin hồ sơ tác giả (avatar, bio, role, name) từ API
  var slug=location.pathname.split('/').filter(Boolean).pop()||'';
  if(slug){
    fetch('/api/author/'+encodeURIComponent(slug))
      .then(function(r){return r.ok?r.json():null;})
      .then(function(p){
        if(!p)return;
        if(p.name){
          var nameEl=document.querySelector('.profile-copy h1, #author-name');
          if(nameEl)nameEl.textContent=p.name;
        }
        if(p.role){
          var roleEl=document.querySelector('.profile-copy .eyebrow, #author-role');
          if(roleEl)roleEl.textContent=p.role;
        }
        if(p.bio){
          var bioEl=document.querySelector('.profile-copy > p, #author-bio');
          if(bioEl)bioEl.textContent=p.bio;
        }
        if(p.avatar){
          var avEl=document.querySelector('.profile-hero .avatar, #author-avatar');
          if(avEl){
            avEl.innerHTML='<img src="'+p.avatar+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
          }
        }
      }).catch(function(){});
  }
})();

