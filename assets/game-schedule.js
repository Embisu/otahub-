/* Tab "Lịch game" ở /lich-phat-song (VI + EN): vẽ lịch ra mắt game từ assets/game-schedule-data.js.
   Bộ lọc theo nhóm giống bảng Xếp hạng game: PC/Console Offline | PC/Console Online | Mobile Online | Mobile Offline | Game Việt.
   Trạng thái nằm trên URL: #game (tab) và ?nhom=<nhóm>. */
(function(){
var D = window.OT_GAME_SCHEDULE, sec = document.getElementById('gameSection'), list = document.getElementById('gameList');
if (!D || !sec || !list) return;
var EN = /^\/en(\/|$)/.test(location.pathname);
var T = EN ? {
  title:'Game <em>release</em> schedule', sum:'Upcoming game launches and major updates, grouped like the OtaHub rankings',
  all:'All', empty:'No upcoming games in this group yet.',
  soon:function(n){ return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days'; }, out:'Released', upd:'Update', count:function(n){ return n + ' titles'; },
  updated:'Updated', note:'Only games that have not launched yet are listed. A date appears only when the publisher has announced it; hot titles with pre-registration open but no date are grouped at the end. Dates are in Vietnam time (UTC+7).',
  pre:'Pre-registration', tba:'Date TBA', undated:'Coming soon · no date yet', month:'Expected',
  months:['January','February','March','April','May','June','July','August','September','October','November','December']
} : {
  title:'Lịch phát hành <em>game</em>', sum:'Game sắp ra mắt và bản cập nhật lớn, chia nhóm giống bảng xếp hạng OtaHub',
  all:'Tất cả', empty:'Chưa có game sắp ra mắt trong nhóm này.',
  soon:function(n){ return n === 0 ? 'Hôm nay' : n === 1 ? 'Ngày mai' : 'Còn ' + n + ' ngày'; }, out:'Đã ra mắt', upd:'Cập nhật', count:function(n){ return n + ' tựa'; },
  updated:'Cập nhật', note:'Chỉ ghi game chưa ra mắt. Ngày chỉ hiện khi nhà phát hành đã công bố; game hot đang mở đăng ký trước nhưng chưa có ngày được xếp ở cuối. Ngày theo giờ Việt Nam (UTC+7).',
  pre:'Đăng ký trước', tba:'Chưa có ngày', undated:'Sắp ra mắt · chưa có ngày', month:'Dự kiến',
  months:['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']
};
var SEG = [
  ['all', T.all, function(){ return true; }],
  ['pc-offline', 'PC/Console · Offline', function(a){ return a.p === 'pc' && a.m === 'offline'; }],
  ['pc-online', 'PC/Console · Online', function(a){ return a.p === 'pc' && a.m === 'online'; }],
  ['mobile-online', 'Mobile · Online', function(a){ return a.p === 'mobile' && a.m === 'online'; }],
  ['mobile-offline', 'Mobile · Offline', function(a){ return a.p === 'mobile' && a.m === 'offline'; }],
  ['vn', EN ? 'Vietnamese games' : 'Game Việt', function(a){ return a.vn === true; }]
];
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
var dayNum = function(iso){ return Math.round(Date.parse(iso + 'T00:00:00Z') / 864e5); };
var todayKey = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
// Chỉ tựa CHƯA ra mắt: có ngày thì còn từ hôm nay trở đi; chưa có ngày (d rỗng) thì xếp cuối theo thứ tự trong file dữ liệu (hot trước)
var dated = D.items.filter(function(a){ return a.d && dayNum(a.d) >= dayNum(todayKey); }).sort(function(a, b){ return a.d < b.d ? -1 : a.d > b.d ? 1 : 0; });
var undated = D.items.filter(function(a){ return !a.d; });
var items = dated.concat(undated);
var wOf = function(a){ return (EN ? a.we : a.w) || a.w || ''; };
var thumb = function(u){ return /^\/assets\/img\/(?!_[ts]\/)[^?#]+\.(jpe?g|png|webp)$/i.test(u || '') ? '/assets/img/_t/' + u.slice(12) + '.webp' : u; };
var params = new URLSearchParams(location.search);
var state = {seg: SEG.some(function(s){ return s[0] === params.get('nhom'); }) ? params.get('nhom') : 'all'};
var segOf = function(a){ return (a.p === 'pc' ? 'PC/Console' : 'Mobile') + ' · ' + (a.m === 'online' ? 'Online' : 'Offline'); };
var fmt = function(iso){ if (!iso) return ''; var p = iso.split('-'); return EN ? T.months[+p[1] - 1].slice(0, 3) + ' ' + (+p[2]) : (+p[2]) + '/' + (+p[1]); };

function row(a){
  var diff = a.d ? dayNum(a.d) - dayNum(todayKey) : null, href = (EN ? a.le : a.l) || '';
  var name = (!EN && a.tv) || a.t;
  var title = href ? '<a href="' + esc(href) + '">' + esc(name) + '</a>' : esc(name);
  var img = a.i ? '<img class="sch-thumb gs-thumb" src="' + esc(thumb(a.i)) + '" alt="" loading="lazy" decoding="async" width="96" height="60" onerror="this.onerror=null;this.src=\'' + esc(a.i) + '\'">'
    : '<span class="sch-thumb gs-thumb gs-tile" aria-hidden="true">' + esc(a.t.charAt(0)) + '</span>';
  var st = diff === null ? '<span class="sch-st upcoming">' + esc(a.pre ? T.pre : T.tba) + '</span>' : '<span class="sch-st upcoming">' + esc(T.soon(diff)) + '</span>';
  var meta = [a.s, a.pf, a.k === 'update' ? T.upd : ''].filter(Boolean).map(esc).join(' · ');
  return '<li class="sch-row gs-row' + (href ? ' has-link' : '') + '"><span class="sch-time' + (a.d ? '' : ' tba') + '">' + esc(a.d ? fmt(a.d) : wOf(a)) + '</span>' + img +
    '<div class="sch-info"><div class="sch-title">' + title + '</div><div class="sch-meta" data-time="' + esc(a.d ? fmt(a.d) : wOf(a)) + '">' + meta + '</div></div>' +
    '<div class="sch-tags">' + st + '<span class="gs-seg">' + esc(segOf(a)) + (a.vn ? ' · ' + (EN ? 'Vietnamese' : 'Game Việt') : '') + '</span></div></li>';
}
function render(){
  var seg = SEG.filter(function(s){ return s[0] === state.seg; })[0];
  document.getElementById('gameChips').innerHTML = SEG.map(function(s){
    var n = items.filter(s[2]).length;
    return '<button type="button" class="seg-tab' + (s[0] === state.seg ? ' on' : '') + (n || s[0] === 'all' ? '' : ' seg-empty') + '" data-seg="' + s[0] + '">' + esc(s[1]) + ' <span class="seg-n">' + n + '</span></button>';
  }).join('');
  var shown = items.filter(seg[2]);
  document.getElementById('gameCount').textContent = T.count(shown.length);
  if (!shown.length){ list.innerHTML = '<li class="gs-none">' + esc(T.empty) + '</li>'; return; }
  var out = '', month = '';
  shown.forEach(function(a){
    var m = a.d ? a.d.slice(0, 7) : 'none';
    if (m !== month){ month = m; out += '<li class="gs-month">' + esc(m === 'none' ? T.undated : T.months[+m.slice(5) - 1] + (EN ? ' ' : '/') + m.slice(0, 4)) + '</li>'; }
    out += row(a);
  });
  list.innerHTML = out;
}
document.getElementById('gameChips').addEventListener('click', function(e){
  var b = e.target.closest('[data-seg]'); if (!b) return;
  state.seg = b.dataset.seg; render();
  var u = new URL(location.href);
  if (state.seg === 'all') u.searchParams.delete('nhom'); else u.searchParams.set('nhom', state.seg);
  history.replaceState(null, '', u);
});
document.getElementById('gameNote').textContent = T.note + ' ' + T.updated + ': ' + D.updated.split('-').reverse().join('/') + '.';

var title = document.getElementById('schTitle'), sum = document.getElementById('schSummary');
function setGame(on){
  sec.hidden = !on;
  if (!on) return;
  document.getElementById('schRoot').hidden = true;
  document.getElementById('mangaSection').hidden = true;
  title.innerHTML = T.title; sum.textContent = T.sum;
  history.replaceState(null, '', location.pathname + location.search + '#game');
}
document.querySelectorAll('.sch-mode').forEach(function(b){
  b.addEventListener('click', function(){ setGame(b.dataset.mode === 'game'); });   // chạy sau handler có sẵn của trang
});
render();
if (location.hash === '#game'){
  var go = function(){ var b = document.querySelector('.sch-mode[data-mode="game"]'); if (b) b.click(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
}
})();
