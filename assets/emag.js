/* OtaHub E-Magazine: đồng hồ đếm ngược, mục lục dính + thanh tiến độ, tab, video bấm mới tải, thư viện ảnh + lightbox,
   hiệu ứng hiện dần và tổng hợp tin từ window.IDX (assets/search.js). Không phụ thuộc thư viện ngoài. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('em-js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ----- Đồng hồ đếm ngược: hai giả định giờ mở bán, nhớ lựa chọn ----- */
  var clock = $('[data-countdown]');
  if (clock) {
    var T = { vn: Date.parse(clock.getAttribute('data-t-vn')), us: Date.parse(clock.getAttribute('data-t-us')) };
    var mode = 'vn';
    try { var s = localStorage.getItem('em-count-mode'); if (s === 'vn' || s === 'us') mode = s; } catch (e) {}
    var cells = { d: $('[data-u="d"]', clock), h: $('[data-u="h"]', clock), m: $('[data-u="m"]', clock), s: $('[data-u="s"]', clock) };
    var grid = $('.em-count', clock), done = $('.em-launched', clock), btns = $$('[data-mode]', clock);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var tick = function () {
      var left = Math.floor((T[mode] - Date.now()) / 1000);
      if (left <= 0) { grid.style.display = 'none'; done.style.display = 'block'; return false; }
      grid.style.display = ''; done.style.display = '';
      cells.d.textContent = Math.floor(left / 86400);
      cells.h.textContent = pad(Math.floor(left % 86400 / 3600));
      cells.m.textContent = pad(Math.floor(left % 3600 / 60));
      cells.s.textContent = pad(left % 60);
      var st = cells.s.parentNode; st.classList.remove('tick'); void st.offsetWidth; st.classList.add('tick');
      return true;
    };
    var timer = 0;
    /* Hẹn đúng vào đầu mỗi giây thật để số giây không trôi lệch; tab ẩn thì dừng, hiện lại thì chạy tiếp */
    var loop = function () {
      clearTimeout(timer);
      var live = tick();
      if (live && !document.hidden) timer = setTimeout(loop, 1000 - Date.now() % 1000 + 20);
    };
    var paint = function () { btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false'); }); loop(); };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-mode');
        try { localStorage.setItem('em-count-mode', mode); } catch (e) {}
        paint();
      });
    });
    document.addEventListener('visibilitychange', loop);
    paint();
    /* Nút thêm vào lịch: tạo file .ics cả ngày ngay tại trình duyệt */
    var ics = $('[data-ics]', clock);
    if (ics) {
      var d0 = ics.getAttribute('data-date').replace(/-/g, ''), d1 = new Date(Date.parse(ics.getAttribute('data-date') + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10).replace(/-/g, '');
      var icsEsc = function (t) { return t.replace(/([,;\\])/g, '\\$1'); };
      ics.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//OtaHub//GTA VI//EN', 'BEGIN:VEVENT', 'UID:gta6-launch@otahub.asia', 'DTSTAMP:20261002T000000Z', 'DTSTART;VALUE=DATE:' + d0, 'DTEND;VALUE=DATE:' + d1, 'SUMMARY:' + icsEsc(ics.getAttribute('data-title')), 'URL:' + location.href.split('#')[0], 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(ics.getAttribute('data-title')), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'));
    }
  }

  /* ----- Số ngày còn lại (theo giả định giờ Việt Nam) ----- */
  if (clock) {
    var fmtDays = function () {
      var n = Math.max(0, Math.floor((T.vn - Date.now()) / 86400000));
      $$('[data-days]').forEach(function (el) { el.textContent = el.getAttribute('data-fmt').replace('{n}', n); });
    };
    fmtDays(); setInterval(fmtDays, 60000);
  }

  /* ----- Timeline: tô đường tiến độ tới mốc "Hôm nay" ----- */
  $$('[data-tl]').forEach(function (ol) {
    var mark = $('.em-tl-today', ol);
    var nx = $('li.next', ol);
    var set = function () {
      ol.style.setProperty('--prog', (mark ? mark.offsetTop + mark.offsetHeight / 2 : ol.offsetHeight) + 'px');
      /* Bản rộng: trục dừng ngay tại mốc ra mắt để không cắt ngang dòng ngày ở giữa */
      if (nx && window.matchMedia('(min-width:641px)').matches) { ol.style.setProperty('--stop', (nx.offsetTop + 11) + 'px'); ol.setAttribute('data-stop', ''); }
      else ol.removeAttribute('data-stop');
    };
    set(); addEventListener('resize', set); addEventListener('load', set);
  });

  /* ----- Tab (có điều hướng bàn phím) ----- */
  $$('[data-tabs]').forEach(function (group) {
    var tabs = $$('[role="tab"]', group), panels = $$('[role="tabpanel"]', group);
    var select = function (tab, focus) {
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
      panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
        if (n > -1) { e.preventDefault(); select(tabs[n], true); }
      });
    });
  });

  /* ----- Video: chỉ nạp iframe khi bấm ----- */
  $$('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + btn.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true; f.loading = 'lazy';
      btn.parentNode.replaceChild(f, btn);
    });
  });

  /* ----- Mục lục dính: mục đang xem + thanh tiến độ cuộn ----- */
  var chips = $$('.em-chip'), bar = $('.em-chapters');
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
          var row = c.parentNode; row.scrollLeft = Math.max(0, c.offsetLeft - row.clientWidth / 2 + c.offsetWidth / 2);
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
  if (bar) {
    var prog = $('.em-progress', bar), raf = 0;
    var upd = function () {
      raf = 0;
      var h = root.scrollHeight - innerHeight;
      if (prog && h > 0) prog.style.setProperty('--p', Math.min(100, Math.max(0, scrollY / h * 100)).toFixed(1) + '%');
    };
    addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    upd();
  }

  /* ----- Hiện dần khi cuộn tới ----- */
  var rv = $$('.em-rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .04 });
    rv.forEach(function (el) { ro.observe(el); });
    addEventListener('beforeprint', function () { rv.forEach(function (el) { el.classList.add('in'); }); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ----- Thư viện ảnh: nút cuộn + lightbox ----- */
  $$('.em-gal').forEach(function (gal) {
    var track = $('.em-gal-track', gal), shots = $$('.em-shot', gal);
    $$('[data-gal]', gal).forEach(function (b) {
      b.addEventListener('click', function () { track.scrollBy({ left: (b.getAttribute('data-gal') === 'next' ? 1 : -1) * Math.min(track.clientWidth * .8, 600), behavior: 'smooth' }); });
    });
    var dlg = $('dialog.em-lb', gal);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var img = $('img', dlg), cap = $('.cap', dlg), cnt = $('.cnt', dlg), cur = 0;
    var show = function (i) {
      cur = (i + shots.length) % shots.length;
      var s = shots[cur];
      img.src = s.getAttribute('data-full'); img.alt = s.getAttribute('data-alt') || '';
      cap.textContent = s.getAttribute('data-alt') || ''; cnt.textContent = (cur + 1) + ' / ' + shots.length;
    };
    shots.forEach(function (s, i) { s.addEventListener('click', function () { show(i); dlg.showModal(); }); });
    $('.prev', dlg).addEventListener('click', function () { show(cur - 1); });
    $('.next', dlg).addEventListener('click', function () { show(cur + 1); });
    $('.close', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1); });
  });

  /* ----- Tin tổng hợp: bài mới đăng tự xuất hiện (đọc window.IDX) ----- */
  var box = $('[data-news]');
  if (box && window.IDX && window.IDX.length) {
    var lang = box.getAttribute('data-lang') || 'vi';
    var skip = (box.getAttribute('data-exclude') || '').split(',');
    var re; try { re = new RegExp(box.getAttribute('data-match'), 'i'); } catch (e) { re = null; }
    var PAGE = 12;
    var items = re ? window.IDX.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) {
      var x = o.x;
      return (lang === 'en') === /^\/en\//.test(x.url) && skip.indexOf(x.url) < 0 && re.test((x.title || '') + ' ' + (x.tags || []).join(' '));
    }).sort(function (a, b) { return (b.x.date || '').localeCompare(a.x.date || '') || a.i - b.i; }) : [];
    if (items.length) {
      var fmt = function (d) {
        if (!d) return '';
        if (lang === 'vi') return d.split('-').reverse().join('/');
        var t = new Date(d + 'T00:00:00Z');
        return isNaN(t) ? d : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
      };
      box.textContent = '';
      items.forEach(function (o, n) {
        var x = o.x, a = document.createElement('a'); a.href = x.url; if (n >= PAGE) a.hidden = true;
        var img = document.createElement('img'); img.alt = ''; img.width = 640; img.height = 360; img.loading = 'lazy';
        var src = x.img || '';
        if (src.indexOf('/assets/img/') === 0) { img.src = '/assets/img/_t/' + src.slice(12) + '.webp'; img.onerror = function () { img.onerror = null; img.src = src; }; }
        else if (src) img.src = src;
        var d = document.createElement('div'), s = document.createElement('small'), b = document.createElement('b');
        s.textContent = (x.cat || '') + (x.date ? ' · ' + fmt(x.date) : ''); b.textContent = x.title;
        d.appendChild(s); d.appendChild(b); a.appendChild(img); a.appendChild(d); box.appendChild(a);
      });
      if (items.length > PAGE) {
        var wrap = document.createElement('div'); wrap.className = 'em-cta'; wrap.style.marginTop = '18px';
        var more = document.createElement('button'); more.type = 'button'; more.className = 'em-btn';
        more.textContent = (box.getAttribute('data-more') || 'More') + ' (' + (items.length - PAGE) + ')';
        more.addEventListener('click', function () { $$('a[hidden]', box).forEach(function (a) { a.hidden = false; }); wrap.remove(); });
        wrap.appendChild(more); box.parentNode.appendChild(wrap);
      }
    }
  }
})();
