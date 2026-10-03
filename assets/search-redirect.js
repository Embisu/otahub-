/* OtaHub, nut/overlay tim kiem tren header: Enter dua sang /tag?q=... (trang loc bai viet dung window.IDX
   tu assets/search.js). Khi go, goi y nhanh cac ho so tac pham (assets/profile-names.json, do scripts/build-profiles.mjs
   tao): ten khop thi hien duoi o tim kiem, mui ten len/xuong + Enter di thang vao ho so. */
(function () {
  var el = document.getElementById('searchInput');
  if (!el) return;
  var EN = /^\/en(\/|$)/.test(location.pathname);
  var rows = null, loading = false, box = null, items = [], sel = -1;

  function loose(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function path(r) { return EN ? (r[8] || r[1]) : r[1]; }
  function load(cb) {
    if (rows) return cb();
    if (loading) return;
    loading = true;
    fetch('/assets/profile-names.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (j) {
      rows = j.map(function (r) { return { r: r, names: r[0].map(loose).filter(function (n) { return n.length > 1; }) }; });
      cb();
    }).catch(function () { rows = []; });
  }
  // Tên chứa cụm gõ (>= 2 ký tự) hoặc cụm gõ chứa nguyên tên (>= 5 ký tự); mỗi thương hiệu một dòng
  function match(q, limit) {
    var best = {};
    rows.forEach(function (o) {
      o.names.forEach(function (n) {
        var rank = -1;
        if (n === q) rank = 0; else if (n.indexOf(q) === 0) rank = 1; else if (q.length >= 3 && (' ' + n).indexOf(' ' + q) > -1) rank = 2;
        else if (q.length >= 3 && n.indexOf(q) > -1) rank = 3; else if (n.length >= 5 && (' ' + q + ' ').indexOf(' ' + n + ' ') > -1) rank = 4;
        if (rank < 0) return;
        var key = o.r[2], cur = best[key];
        if (!cur || rank < cur.rank || (rank === cur.rank && n.length < cur.len)) best[key] = { r: o.r, rank: rank, len: n.length };
      });
    });
    return Object.keys(best).map(function (k) { return best[k]; }).sort(function (a, b) { return a.rank - b.rank || a.len - b.len; }).slice(0, limit).map(function (x) { return x.r; });
  }

  var st = document.createElement('style');
  st.textContent = '.sr-sug{position:absolute;left:0;right:0;top:100%;margin-top:6px;z-index:5;max-height:min(60vh,420px);overflow:auto;background:#140b2e;border:1px solid rgba(0,242,255,.25);box-shadow:0 18px 40px rgba(0,0,0,.45)}.sr-sug[hidden]{display:none}.sr-h{padding:9px 16px 6px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#00f2ff;font-weight:700}.sr-it{display:flex;align-items:center;gap:12px;padding:8px 16px;text-decoration:none;color:#f0eeff;border-top:1px solid rgba(255,255,255,.05)}.sr-it img{width:36px;height:48px;object-fit:cover;border-radius:3px;background:#1d1240;flex:none}.sr-it b{display:block;font-size:15px;font-weight:600;line-height:1.3}.sr-it small{display:block;font-size:11px;color:rgba(240,238,255,.5);margin-top:2px}.sr-it:hover,.sr-it.on{background:rgba(0,242,255,.1)}';
  document.head.appendChild(st);

  function hide() { if (box) box.hidden = true; items = []; sel = -1; }
  function show(list) {
    if (!box) { box = document.createElement('div'); box.className = 'sr-sug'; el.parentNode.appendChild(box); }
    items = list; sel = -1;
    if (!list.length) { box.hidden = true; return; }
    box.innerHTML = '<div class="sr-h">' + (EN ? 'Profiles' : 'Hồ sơ') + '</div>' + list.map(function (r) {
      return '<a class="sr-it" href="' + esc(path(r)) + '"><img src="' + esc(r[7]) + '" alt="" width="36" height="48" loading="lazy"><span><b>' + esc(EN ? r[4] : r[3]) + '</b><small>' + esc(EN ? r[6] : r[5]) + '</small></span></a>';
    }).join('');
    box.hidden = false;
  }
  function refresh() {
    var q = loose(el.value);
    if (q.length < 2) return hide();
    load(function () { if (loose(el.value) === q) show(match(q, 5)); });
  }
  function mark() {
    if (!box) return;
    [].slice.call(box.querySelectorAll('.sr-it')).forEach(function (a, i) { a.classList.toggle('on', i === sel); });
  }
  el.addEventListener('input', refresh);
  el.addEventListener('focus', refresh);
  el.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!items.length) return;
      e.preventDefault();
      sel = e.key === 'ArrowDown' ? Math.min(items.length - 1, sel + 1) : Math.max(-1, sel - 1);
      mark();
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (sel > -1 && items[sel]) { window.location.href = path(items[sel]); return; }
    var q = this.value.trim();
    var base = location.pathname.indexOf('/en/') === 0 || location.pathname === '/en' ? '/en/tag' : '/tag'; // trang tag đúng ngôn ngữ
    window.location.href = q ? base + '?q=' + encodeURIComponent(q) : base;
  });
})();
