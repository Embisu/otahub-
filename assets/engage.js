/* OtaHub — reaction + bình luận, lưu qua Cloudflare KV (functions/api/engagement.js) */
(function(){
var row=document.querySelector('.share-row');
if(!row)return;
var slug=(location.pathname.replace(/^\//,'')||'index.html').split('?')[0];
var EMOJI={like:'👍',love:'❤️',wow:'😮'};

var wrap=document.createElement('div');
wrap.className='engage-block';
wrap.innerHTML=
'<div class="react-bar">'+
  Object.keys(EMOJI).map(function(k){return '<button type="button" class="react-btn" data-e="'+k+'"><span class="react-emo">'+EMOJI[k]+'</span><span class="react-n" data-n="'+k+'">0</span></button>';}).join('')+
'</div>'+
'<div class="comment-block">'+
  '<div class="comment-title">Bình luận (<span class="c-count">0</span>)</div>'+
  '<div class="comment-status"></div>'+
  '<form class="comment-form">'+
    '<input type="text" name="hp" class="hp-field" tabindex="-1" autocomplete="off"/>'+
    '<input type="text" class="c-name" placeholder="Tên của bạn (không bắt buộc)" maxlength="40"/>'+
    '<textarea class="c-text" placeholder="Viết bình luận về bài này..." maxlength="500" required></textarea>'+
    '<button type="submit" class="c-submit">Gửi bình luận</button>'+
  '</form>'+
  '<div class="comment-list"></div>'+
'</div>';
row.insertAdjacentElement('afterend', wrap);

var statusEl=wrap.querySelector('.comment-status');
var listEl=wrap.querySelector('.comment-list');
var countEl=wrap.querySelector('.c-count');
var form=wrap.querySelector('.comment-form');

function fmtTs(ts){
  try{return new Date(ts).toLocaleDateString('vi-VN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
  catch(e){return '';}
}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}

function renderComments(list){
  countEl.textContent=list.length;
  if(!list.length){listEl.innerHTML='<div class="c-empty">Chưa có bình luận nào — hãy là người đầu tiên!</div>';return;}
  listEl.innerHTML=list.slice().reverse().map(function(c){
    return '<div class="c-item"><div class="c-item-head"><span class="c-item-name">'+esc(c.name)+'</span><span class="c-item-time">'+fmtTs(c.ts)+'</span></div><div class="c-item-text">'+esc(c.text)+'</div></div>';
  }).join('');
}

function renderReactions(counts){
  Object.keys(counts).forEach(function(k){
    var el=wrap.querySelector('.react-n[data-n="'+k+'"]');
    if(el)el.textContent=counts[k];
  });
}

fetch('/api/engagement?slug='+encodeURIComponent(slug))
  .then(function(r){return r.json();})
  .then(function(d){
    if(!d.ok){
      if(d.error==='kv_not_bound'){
        statusEl.textContent='Bình luận đang được thiết lập, quay lại sau nhé.';
        form.style.display='none';
      }
      return;
    }
    renderReactions(d.reactions||{like:0,love:0,wow:0});
    renderComments(d.comments||[]);
  })
  .catch(function(){statusEl.textContent='Không tải được bình luận — thử tải lại trang.';});

wrap.querySelectorAll('.react-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var e=btn.getAttribute('data-e');
    var doneKey='otahub_react_'+slug+'_'+e;
    if(localStorage.getItem(doneKey)){return;}
    btn.disabled=true;
    fetch('/api/engagement',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:slug,type:'react',emoji:e})})
      .then(function(r){return r.json();})
      .then(function(d){
        if(d.ok){renderReactions(d.reactions);localStorage.setItem(doneKey,'1');btn.classList.add('reacted');}
        btn.disabled=false;
      })
      .catch(function(){btn.disabled=false;});
  });
});

form.addEventListener('submit', function(e){
  e.preventDefault();
  var name=form.querySelector('.c-name').value;
  var text=form.querySelector('.c-text').value.trim();
  var hp=form.querySelector('.hp-field').value;
  if(!text)return;
  var submitBtn=form.querySelector('.c-submit');
  submitBtn.disabled=true;submitBtn.textContent='Đang gửi…';
  fetch('/api/engagement',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:slug,type:'comment',name:name,text:text,hp:hp})})
    .then(function(r){return r.json();})
    .then(function(d){
      submitBtn.disabled=false;submitBtn.textContent='Gửi bình luận';
      if(d.ok&&d.comments){
        renderComments(d.comments);
        form.querySelector('.c-text').value='';
      }else if(!d.ok){
        statusEl.textContent='Gửi bình luận thất bại, thử lại sau.';
      }
    })
    .catch(function(){submitBtn.disabled=false;submitBtn.textContent='Gửi bình luận';statusEl.textContent='Gửi bình luận thất bại, thử lại sau.';});
});

var css='.engage-block{margin-top:8px;padding-top:8px}'+
'.react-bar{display:flex;gap:10px;padding:20px 0;border-top:1px solid var(--border,rgba(255,255,255,.07))}'+
'.react-btn{display:flex;align-items:center;gap:8px;padding:8px 16px;border:1px solid var(--border,rgba(255,255,255,.07));background:none;color:var(--dim,#cfc9e8);cursor:pointer;font-size:13px;min-height:40px;transition:all .2s}'+
'.react-btn:hover{border-color:rgba(0,229,255,.35);color:#00e5ff}'+
'.react-btn.reacted{border-color:#00e5ff;color:#00e5ff;background:rgba(0,229,255,.06)}'+
'.react-btn:disabled{opacity:.6;cursor:default}'+
'.react-emo{font-size:15px}'+
'.comment-block{padding:24px 0;border-top:1px solid var(--border,rgba(255,255,255,.07))}'+
'.comment-title{font-family:var(--fd),sans-serif;font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin-bottom:16px}'+
'.comment-status{font-size:12px;color:var(--muted,#8888aa);margin-bottom:10px}'+
'.comment-form{display:flex;flex-direction:column;gap:10px;margin-bottom:24px}'+
'.hp-field{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}'+
'.c-name,.c-text{background:rgba(255,255,255,.04);border:1px solid var(--border,rgba(255,255,255,.1));color:#f0eeff;font-family:inherit;font-size:13px;padding:10px 12px}'+
'.c-text{min-height:80px;resize:vertical}'+
'.c-name:focus,.c-text:focus{outline:none;border-color:rgba(0,229,255,.4)}'+
'.c-submit{align-self:flex-start;background:#00e5ff;color:#0b0220;border:none;font-family:var(--fd),sans-serif;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:10px 22px;cursor:pointer;min-height:40px}'+
'.c-submit:disabled{opacity:.6;cursor:default}'+
'.comment-list{display:flex;flex-direction:column;gap:14px}'+
'.c-empty{font-size:13px;color:var(--muted,#8888aa)}'+
'.c-item{padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)}'+
'.c-item-head{display:flex;justify-content:space-between;gap:10px;margin-bottom:6px;flex-wrap:wrap}'+
'.c-item-name{font-size:12px;font-weight:600;color:#00e5ff}'+
'.c-item-time{font-size:11px;color:var(--muted,#8888aa)}'+
'.c-item-text{font-size:13px;color:var(--dim,#cfc9e8);line-height:1.6;white-space:pre-wrap}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
