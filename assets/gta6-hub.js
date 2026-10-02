/* Trang "Đếm ngược GTA 6": đồng hồ đếm ngược, mục lục dính, tab, video bấm mới tải. */
(function () {
  'use strict';
  // Rockstar chưa công bố giờ mở bán. Hai giả định: 00:00 ngày 19/11/2026 theo giờ Việt Nam (UTC+7) hoặc theo giờ miền Đông Mỹ (UTC-5).
  var TARGETS = { vn: Date.UTC(2026, 10, 18, 17, 0, 0), us: Date.UTC(2026, 10, 19, 5, 0, 0) };
  var mode = 'vn';
  try { var saved = localStorage.getItem('g6-count-mode'); if (saved === 'vn' || saved === 'us') mode = saved; } catch (e) {}

  var root = document.querySelector('[data-countdown]');
  if (root) {
    var cells = {
      d: root.querySelector('[data-u="d"]'), h: root.querySelector('[data-u="h"]'),
      m: root.querySelector('[data-u="m"]'), s: root.querySelector('[data-u="s"]')
    };
    var grid = root.querySelector('.g6-count');
    var done = root.querySelector('.g6-launched');
    var buttons = root.querySelectorAll('[data-mode]');
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var tick = function () {
      var left = Math.floor((TARGETS[mode] - Date.now()) / 1000);
      if (left <= 0) {
        if (grid) grid.style.display = 'none';
        if (done) done.style.display = 'block';
        return false;
      }
      cells.d.textContent = Math.floor(left / 86400);
      cells.h.textContent = pad(Math.floor(left % 86400 / 3600));
      cells.m.textContent = pad(Math.floor(left % 3600 / 60));
      cells.s.textContent = pad(left % 60);
      return true;
    };
    var paint = function () {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false'); });
      tick();
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-mode');
        try { localStorage.setItem('g6-count-mode', mode); } catch (e) {}
        paint();
      });
    });
    paint();
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  // Tab (bản đồ, xe & vũ khí): mỗi nhóm [data-tabs] chứa nút [role=tab] và vùng [role=tabpanel]
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = [].slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = [].slice.call(group.querySelectorAll('[role="tabpanel"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') n = 0;
        else if (k === 'End') n = tabs.length - 1;
        if (n > -1) { e.preventDefault(); select(tabs[n], true); }
      });
    });
  });

  // Video: chỉ nạp iframe khi người xem bấm
  document.querySelectorAll('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'GTA VI';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.loading = 'lazy';
      btn.parentNode.replaceChild(f, btn);
    });
  });

  // Mục lục dính: đánh dấu mục đang xem
  var chips = [].slice.call(document.querySelectorAll('.g6-chip'));
  if (chips.length && 'IntersectionObserver' in window) {
    var byId = {};
    chips.forEach(function (c) { byId[c.getAttribute('href').slice(1)] = c; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        chips.forEach(function (c) { c.classList.remove('on'); c.removeAttribute('aria-current'); });
        var c = byId[en.target.id];
        if (c) {
          c.classList.add('on'); c.setAttribute('aria-current', 'true');
          var bar = c.parentNode;
          bar.scrollLeft = Math.max(0, c.offsetLeft - bar.clientWidth / 2 + c.offsetWidth / 2);
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
})();

/* Tổng hợp tin GTA 6: đọc window.IDX (assets/search.js) để bài mới đăng tự xuất hiện, không cần build lại trang. */
(function () {
  'use strict';
  var box = document.getElementById('g6-news');
  if (!box || !window.IDX || !window.IDX.length) return;
  var lang = box.getAttribute('data-lang') || 'vi';
  var skip = (box.getAttribute('data-exclude') || '').split(',');
  var RE = /\bGTA\s*(?:6|VI)\b|Grand Theft Auto\s*(?:6|VI)\b/i;
  var PAGE = 9;
  var items = window.IDX.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) {
    var x = o.x;
    return (lang === 'en') === /^\/en\//.test(x.url) && skip.indexOf(x.url) < 0 && RE.test((x.title || '') + ' ' + (x.tags || []).join(' '));
  }).sort(function (a, b) { return (b.x.date || '').localeCompare(a.x.date || '') || a.i - b.i; });
  if (!items.length) return;

  var fmt = function (d) {
    if (!d) return '';
    if (lang === 'vi') return d.split('-').reverse().join('/');
    var t = new Date(d + 'T00:00:00Z');
    return isNaN(t) ? d : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };
  box.textContent = '';
  items.forEach(function (o, n) {
    var x = o.x, a = document.createElement('a');
    a.href = x.url;
    if (n >= PAGE) a.hidden = true;
    var img = document.createElement('img');
    img.alt = ''; img.width = 640; img.height = 360; img.loading = 'lazy';
    var src = x.img || '';
    if (src.indexOf('/assets/img/') === 0) {
      img.src = '/assets/img/_t/' + src.slice(12) + '.webp';
      img.onerror = function () { img.onerror = null; img.src = src; };
    } else if (src) { img.src = src; }
    var d = document.createElement('div'), s = document.createElement('small'), b = document.createElement('b');
    s.textContent = (x.cat || 'Gaming') + (x.date ? ' · ' + fmt(x.date) : '');
    b.textContent = x.title;
    d.appendChild(s); d.appendChild(b);
    a.appendChild(img); a.appendChild(d);
    box.appendChild(a);
  });
  if (items.length > PAGE) {
    var wrap = document.createElement('div');
    wrap.className = 'g6-cta'; wrap.style.marginTop = '16px';
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'g6-btn';
    btn.textContent = (box.getAttribute('data-more') || 'More') + ' (' + (items.length - PAGE) + ')';
    btn.addEventListener('click', function () {
      [].forEach.call(box.querySelectorAll('a[hidden]'), function (a) { a.hidden = false; });
      wrap.remove();
    });
    wrap.appendChild(btn);
    box.parentNode.appendChild(wrap);
  }
})();
