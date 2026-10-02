/* Trang Lịch phát sóng (/lich-phat-song, /en/lich-phat-song): vẽ lịch theo ngày trong tuần từ assets/schedule-data.js. */
(function(){
var D = window.OT_SCHEDULE;
var root = document.getElementById('schRoot');
if (!D || !root) return;
var EN = /^\/en(\/|$)/.test(location.pathname);

var T = EN ? {
  seasons: {winter:'Winter', spring:'Spring', summer:'Summer', fall:'Fall'},
  months: {winter:'Jan–Mar', spring:'Apr–Jun', summer:'Jul–Sep', fall:'Oct–Dec'},
  title: function(s, y){ return 'Anime <em>' + s + ' ' + y + '</em> schedule'; },
  days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  dshort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  types: {all:'All', tv:'TV', short:'Shorts', ona:'Streaming (ONA)', movie:'Films', special:'Specials', ova:'OVA'},
  today:'Today', upcoming:'Upcoming', airing:'Airing', aired:'Aired', inDays:function(n){ return n === 1 ? 'tomorrow' : 'in ' + n + ' days'; },
  premiere:'Premieres', premiered:'Premiered', release:'Japan release', noTime:'TBA',
  featured:'Featured this season', films:'Films, specials & OVAs', search:'Search anime or studio…',
  none:'No titles match your filters.', count:function(n){ return n + ' titles'; },
  summary:function(c){ return [c.tv && c.tv + ' TV series', c.ona && c.ona + ' streaming', c.film && c.film + ' films & specials'].filter(Boolean).join(' · '); },
  tz:'Times in Vietnam time (UTC+7)', updated:'Updated', source:'Sources', note:'Times can shift by broadcaster or streaming platform.',
  read:'Read on OtaHub', allWeek:'Show the whole week', oneDay:'Show one day only',
  nextUp:'Premiering soon', nextIn:'Next premiere in', premToday:'Premieres today', premNow:'On air now', dUnit:'d', released:'Japan release'
} : {
  seasons: {winter:'Mùa Đông', spring:'Mùa Xuân', summer:'Mùa Hè', fall:'Mùa Thu'},
  months: {winter:'T1–T3', spring:'T4–T6', summer:'T7–T9', fall:'T10–T12'},
  title: function(s, y){ return 'Lịch chiếu anime <em>' + s + ' ' + y + '</em>'; },
  days: ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],
  dshort: ['CN','T2','T3','T4','T5','T6','T7'],
  types: {all:'Tất cả', tv:'TV', short:'Phim ngắn', ona:'Trực tuyến (ONA)', movie:'Phim chiếu rạp', special:'Đặc biệt', ova:'OVA'},
  today:'Hôm nay', upcoming:'Sắp chiếu', airing:'Đang chiếu', aired:'Đã chiếu', inDays:function(n){ return n === 1 ? 'ngày mai' : 'còn ' + n + ' ngày'; },
  premiere:'Ra mắt', premiered:'Ra mắt', release:'Khởi chiếu tại Nhật', noTime:'Chưa rõ giờ',
  featured:'Nổi bật mùa này', films:'Phim chiếu rạp, tập đặc biệt & OVA', search:'Tìm anime hoặc studio…',
  none:'Không có tựa nào khớp bộ lọc.', count:function(n){ return n + ' tựa'; },
  summary:function(c){ return [c.tv && c.tv + ' phim TV', c.ona && c.ona + ' phim trực tuyến', c.film && c.film + ' phim rạp & đặc biệt'].filter(Boolean).join(' · '); },
  tz:'Giờ Việt Nam (UTC+7)', updated:'Cập nhật', source:'Nguồn', note:'Giờ chiếu có thể thay đổi theo đài hoặc nền tảng phát hành.',
  read:'Đọc trên OtaHub', allWeek:'Xem cả tuần', oneDay:'Chỉ xem một ngày',
  nextUp:'Sắp lên sóng', nextIn:'Tập đầu lên sóng sau', premToday:'Ra mắt hôm nay', premNow:'Đang lên sóng', dUnit:' ngày', released:'Khởi chiếu tại Nhật'
};
var ORDER = ['winter','spring','summer','fall'];
var WEEK = [1,2,3,4,5,6,0];                 // Thứ Hai -> Chủ Nhật
var FILM = {movie:1, special:1, ova:1};

// "Hôm nay" theo giờ Việt Nam, không phụ thuộc múi giờ máy
var nowVN = new Date(Date.now() + 7 * 3600e3);
var todayKey = nowVN.toISOString().slice(0, 10);
var todayDow = nowVN.getUTCDay();
var dayNum = function(iso){ return Math.round(Date.parse(iso + 'T00:00:00Z') / 864e5); };
var dowOf = function(iso){ return new Date(iso + 'T00:00:00Z').getUTCDay(); };
var fmtDate = function(iso){ var p = iso.split('-'); return EN ? new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {month:'short', day:'numeric', timeZone:'UTC'}) : (+p[2]) + '/' + (+p[1]); };
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
var thumb = function(u, k){ return /^\/assets\/img\/(?!_[ts]\/)[^?#]+\.(jpe?g|png|webp)$/i.test(u || '') ? '/assets/img/' + (k || '_s') + '/' + u.slice(12) + '.webp' : u; };
var tsOf = function(a){ return Date.parse(a.d + 'T' + (a.h || '00:00') + ':00+07:00'); };
var pad2 = function(n){ return n < 10 ? '0' + n : '' + n; };
var fmtCd = function(ms){
  var s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
  return (d ? d + T.dUnit + ' ' : '') + pad2(h) + ':' + pad2(m) + ':' + pad2(s % 60);
};
var linkOf = function(a){ return EN ? (a.le || '') : (a.l || ''); };

var MQ = window.matchMedia('(max-width:768px)');
var params = new URLSearchParams(location.search);
var state = {
  season: ORDER.indexOf(params.get('mua') || params.get('season')) > -1 ? (params.get('mua') || params.get('season')) : D.current,
  type: 'all', q: '', day: null
};
function pickDay(byDay, isCur, films){
  if (!MQ.matches || state.day === 'all') return 'all';
  if (state.day === 'films' && films.length) return 'films';
  if (state.day !== null && state.day !== 'films' && byDay[state.day] && byDay[state.day].length) return state.day;
  if (isCur && byDay[todayDow].length) return todayDow;
  for (var i = 0; i < WEEK.length; i++) if (byDay[WEEK[i]].length) return WEEK[i];
  return films.length ? 'films' : 'all';
}

function status(a){
  var diff = dayNum(a.d) - dayNum(todayKey);
  if (diff > 0) return {k:'upcoming', label: T.upcoming + ' · ' + T.inDays(diff)};
  if (state.season !== D.current) return {k:'aired', label: T.aired};
  return {k:'airing', label: FILM[a.y] ? T.aired : T.airing};
}
function matches(a){
  if (state.type !== 'all' && a.y !== state.type) return false;
  if (!state.q) return true;
  var hay = (a.t + ' ' + (a.r || '') + ' ' + (a.s || '')).toLowerCase();
  return hay.indexOf(state.q) > -1;
}
function tile(a){
  if (a.i) return '<img class="sch-thumb" src="' + esc(thumb(a.i)) + '" alt="" loading="lazy" decoding="async" width="56" height="76" onerror="this.onerror=null;this.src=\'' + esc(a.i) + '\'">';
  var w = a.t.replace(/[^A-Za-z0-9 ]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  var ini = ((w[0] || '?').charAt(0) + (w.length > 1 ? w[1].charAt(0) : (w[0] || '').charAt(1))).toUpperCase();
  return '<span class="sch-thumb sch-tile t-' + a.y + '" aria-hidden="true">' + esc(ini) + '</span>';
}
function card(a){
  var st = status(a), href = linkOf(a), tag = href ? 'a' : 'div';
  return '<' + tag + (href ? ' href="' + esc(href) + '"' : '') + ' class="sch-card"><img src="' + esc(thumb(a.i, '_t')) + '" alt="' + esc(a.t) + '" loading="lazy" decoding="async" width="300" height="400" onerror="this.onerror=null;this.src=\'' + esc(a.i) + '\'"><div class="sch-card-body"><span class="sch-st ' + st.k + '">' + esc(st.label) + '</span><div class="sch-card-t">' + esc(a.t) + '</div><div class="sch-card-m">' + esc(T.days[dowOf(a.d)]) + (a.h ? ' · ' + a.h : '') + ' · ' + esc(a.s) + '</div></div></' + tag + '>';
}
// khối "Sắp lên sóng": tựa kế tiếp có đếm ngược trực tiếp + hàng thẻ các tựa sau đó
function nextUp(all){
  var now = Date.now();
  var up = all.filter(function(a){ return a.i && tsOf(a) > now; }).sort(function(a, b){ return tsOf(a) - tsOf(b) || a.t.localeCompare(b.t); }).slice(0, 10);
  if (!up.length) return '';
  var a = up[0], href = linkOf(a);
  var title = href ? '<a href="' + esc(href) + '">' + esc(a.t) + '</a>' : esc(a.t);
  var meta = [T.days[dowOf(a.d)] + ' ' + fmtDate(a.d) + (a.h ? ' · ' + a.h : ''), a.s].filter(Boolean).map(esc).join(' · ');
  var hero = '<div class="sch-next-hero"><img src="' + esc(thumb(a.i, '_t')) + '" alt="" width="300" height="420" decoding="async" onerror="this.onerror=null;this.src=\'' + esc(a.i) + '\'">' +
    '<div class="sch-next-info"><span class="sch-type t-' + a.y + '">' + esc(T.types[a.y]) + '</span><div class="sch-next-t">' + title + '</div><div class="sch-next-m">' + meta + '</div>' +
    '<div class="sch-cd-l">' + T.nextIn + '</div><div class="sch-cd" data-ts="' + tsOf(a) + '" role="timer" aria-live="off">' + fmtCd(tsOf(a) - now) + '</div></div></div>';
  var rest = up.slice(1);
  return '<section class="sch-next"><h2 class="sch-h">' + T.nextUp + '</h2>' + hero +
    (rest.length ? '<div class="sch-feat-row sch-next-row">' + rest.map(card).join('') + '</div>' : '') + '</section>';
}
function tick(){
  var els = document.querySelectorAll('.sch-cd[data-ts]');
  for (var i = 0; i < els.length; i++){
    var left = +els[i].dataset.ts - Date.now();
    if (left <= 0){ render(); return; }
    var t = fmtCd(left); if (els[i].textContent !== t) els[i].textContent = t;
  }
}
function row(a){
  var st = status(a), href = linkOf(a);
  var title = href ? '<a href="' + esc(href) + '">' + esc(a.t) + '</a>' : esc(a.t);
  var meta = [a.s, (FILM[a.y] ? T.release : (st.k === 'upcoming' ? T.premiere : T.premiered)) + ' ' + fmtDate(a.d), a.p].filter(Boolean).map(esc).join(' · ');
  return '<li class="sch-row' + (href ? ' has-link' : '') + '">' +
    '<span class="sch-time' + (a.h ? '' : ' tba') + '">' + (a.h || T.noTime) + '</span>' + tile(a) +
    '<div class="sch-info"><div class="sch-title">' + title + '</div>' + (a.r && a.r !== a.t ? '<div class="sch-romaji">' + esc(a.r) + '</div>' : '') +
    '<div class="sch-meta" data-time="' + (a.h || T.noTime) + '">' + meta + '</div></div>' +
    '<div class="sch-tags"><span class="sch-type t-' + a.y + '">' + esc(T.types[a.y]) + '</span><span class="sch-st ' + st.k + '">' + esc(st.label) + '</span></div></li>';
}

function render(){
  var all = D.seasons[state.season] || [];
  var list = all.filter(matches);
  var weekly = list.filter(function(a){ return !FILM[a.y]; });
  var films = list.filter(function(a){ return FILM[a.y]; }).sort(function(a, b){ return a.d < b.d ? -1 : 1; });
  var c = {tv:0, ona:0, film:0};
  all.forEach(function(a){ if (FILM[a.y]) c.film++; else if (a.y === 'ona') c.ona++; else c.tv++; });
  var year = D.year;

  document.getElementById('schTitle').innerHTML = T.title(T.seasons[state.season], year);
  document.getElementById('schSummary').textContent = T.summary(c) + ' · ' + T.tz;
  document.querySelectorAll('.sch-season').forEach(function(b){
    var on = b.dataset.s === state.season; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
  // bộ lọc loại: chỉ hiện loại có trong mùa
  var types = ['all'].concat(['tv','short','ona','movie','special','ova'].filter(function(t){ return all.some(function(a){ return a.y === t; }); }));
  if (types.indexOf(state.type) < 0) state.type = 'all';
  document.getElementById('schTypes').innerHTML = types.map(function(t){
    var n = t === 'all' ? all.length : all.filter(function(a){ return a.y === t; }).length;
    return '<button type="button" class="sch-chip' + (t === state.type ? ' on' : '') + '" data-t="' + t + '">' + esc(T.types[t]) + ' <span>' + n + '</span></button>';
  }).join('');

  // nổi bật: tựa có ảnh, chỉ khi không lọc
  var isCurSeason = state.season === D.current;
  var feat = (!state.q && state.type === 'all') ? all.filter(function(a){ return a.i; }) : [];
  var nx = document.getElementById('schNext');
  if (nx) nx.innerHTML = isCurSeason ? nextUp(all) : '';
  var html = feat.length ? '<section class="sch-feat"><h2 class="sch-h">' + T.featured + '</h2><div class="sch-feat-row">' + feat.map(function(a){
    return card(a);
  }).join('') + '</div></section>' : '';

  // dải ngày trong tuần + từng ngày
  var byDay = {}; WEEK.forEach(function(d){ byDay[d] = []; });
  weekly.forEach(function(a){ byDay[dowOf(a.d)].push(a); });
  WEEK.forEach(function(d){ byDay[d].sort(function(a, b){ return (a.h || '99') < (b.h || '99') ? -1 : (a.h || '99') > (b.h || '99') ? 1 : a.t.localeCompare(b.t); }); });
  var isCur = state.season === D.current;
  var day = pickDay(byDay, isCur, films);
  document.getElementById('schWeek').innerHTML = WEEK.map(function(d){
    return '<a class="sch-day' + (isCur && d === todayDow ? ' today' : '') + (MQ.matches && day === d ? ' on' : '') + (byDay[d].length ? '' : ' empty') + '" data-d="' + d + '" href="#sch-d' + d + '"><b>' + T.dshort[d] + '</b><span>' + byDay[d].length + '</span></a>';
  }).join('') + (films.length ? '<a class="sch-day films' + (MQ.matches && day === 'films' ? ' on' : '') + '" data-d="films" href="#sch-films"><b>🎬</b><span>' + films.length + '</span></a>' : '');
  html += WEEK.filter(function(d){ return byDay[d].length && (day === 'all' || day === d); }).map(function(d){
    var today = isCur && d === todayDow;
    return '<section class="sch-dayblock' + (today ? ' today' : '') + '" id="sch-d' + d + '"><h2 class="sch-h">' + T.days[d] + (today ? ' <span class="sch-today">' + T.today + '</span>' : '') + ' <small>' + T.count(byDay[d].length) + '</small></h2><ul class="sch-list">' + byDay[d].map(row).join('') + '</ul></section>';
  }).join('');
  if (films.length && (day === 'all' || day === 'films')) html += '<section class="sch-dayblock" id="sch-films"><h2 class="sch-h">' + T.films + ' <small>' + T.count(films.length) + '</small></h2><ul class="sch-list">' + films.map(row).join('') + '</ul></section>';
  if (!weekly.length && !films.length) html = '<p class="sch-empty">' + T.none + '</p>';
  document.getElementById('schBody').innerHTML = html;
  var ab = document.getElementById('schAll');
  if (ab){ ab.hidden = !MQ.matches; ab.textContent = day === 'all' ? T.oneDay : T.allWeek; }
}

// khung tĩnh
root.innerHTML =
  '<div class="sch-wrap sch-nextwrap" id="schNext"></div>' +
  '<div class="sch-bar"><div class="sch-bar-in">' +
    '<div class="sch-seasons" role="group">' + ORDER.map(function(s){
      return '<button type="button" class="sch-season" data-s="' + s + '"><b>' + T.seasons[s] + '</b><span>' + T.months[s] + ' · ' + (D.seasons[s] || []).length + '</span></button>';
    }).join('') + '</div>' +
    '<label class="sch-search"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.6"/><path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.6"/></svg><input id="schQ" type="search" placeholder="' + esc(T.search) + '" autocomplete="off"></label>' +
  '</div><div class="sch-bar-in sch-bar-2"><div class="sch-types" id="schTypes"></div></div></div>' +
  '<div class="sch-weekbar"><div class="sch-bar-in"><nav class="sch-week" id="schWeek" aria-label="' + esc(EN ? 'Days of the week' : 'Các ngày trong tuần') + '"></nav><button type="button" class="sch-allbtn" id="schAll" hidden></button></div></div>' +
  '<div class="sch-wrap"><div id="schBody"></div>' +
  '<p class="sch-src">' + T.updated + ' ' + fmtDate(D.updated) + '/' + D.updated.slice(0, 4) + ' · ' + T.source + ': ' + D.sources.map(function(s){ return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>'; }).join(', ') + '. ' + T.note + '</p></div>';

root.addEventListener('click', function(e){
  var s = e.target.closest('.sch-season');
  if (s){ state.season = s.dataset.s; state.type = 'all'; state.day = null; render(); var u = new URL(location.href); if (state.season === D.current) u.searchParams.delete('mua'); else u.searchParams.set('mua', state.season); history.replaceState(null, '', u); return; }
  var dd = e.target.closest('.sch-day');
  if (dd && MQ.matches){ e.preventDefault(); state.day = dd.dataset.d === 'films' ? 'films' : +dd.dataset.d; render(); var b = document.getElementById('schBody'); if (b && b.getBoundingClientRect().top < 0) b.scrollIntoView(); return; }
  if (e.target.closest('#schAll')){ state.day = document.getElementById('schAll').textContent === T.allWeek ? 'all' : null; render(); return; }
  var t = e.target.closest('.sch-chip');
  if (t){ state.type = t.dataset.t; render(); }
});
var qt;
document.getElementById('schQ').addEventListener('input', function(e){ clearTimeout(qt); qt = setTimeout(function(){ state.q = e.target.value.trim().toLowerCase(); render(); }, 120); });
if (MQ.addEventListener) MQ.addEventListener('change', render);
setInterval(function(){ if (!document.hidden) tick(); }, 1000);
document.addEventListener('visibilitychange', function(){ if (!document.hidden) tick(); });
window.otScheduleRender = render;
render();
})();
