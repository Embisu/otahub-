/* Keep homepage ranking cards aligned with the canonical title catalog. */
(function(){
  var aliases={
    'Ghost of Yōtei':'Ghost of Yōtei: Complete Edition',
    'Jujutsu Kaisen':'Jujutsu Kaisen (Anime)',
    'Chainsaw Man':'Chainsaw Man (Anime)'
  };
  fetch('/assets/catalog.json?v=20261001d').then(function(r){return r.json();}).then(function(catalog){
    document.querySelectorAll('a[href*="-detail?t="]').forEach(function(link){
      var url;
      try{url=new URL(link.href,location.origin);}catch(e){return;}
      var title=url.searchParams.get('t');
      var kind=(url.pathname.match(/(game|anime|manga)-detail/)||[])[1];
      var entry=catalog[(kind==='anime'&&aliases[title])||title];
      if(entry&&entry.type&&entry.type!==kind)return;
      if(!entry||isNaN(parseFloat(entry.score)))return;
      var score=link.querySelector('.rk-score,.mi-score');
      if(score)score.textContent=entry.score;
      var bar=link.querySelector('.rk-bar');
      if(bar){var width=Math.max(0,Math.min(100,parseFloat(entry.score)*10))+'%';bar.dataset.w=width;bar.style.width=width;}
    });
  }).catch(function(){});
})();
