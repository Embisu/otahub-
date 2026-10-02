/* Trang Chủ đề & Tag (/tag, /en/tag): lọc bài theo từ khóa trên chỉ mục window.IDX (assets/search.js).
   - Tìm không dấu, nhiều từ = phải khớp đủ các từ (khớp tiêu đề được xếp trước).
   - Hiểu tên gọi khác của cùng một tác phẩm (Jujutsu Kaisen = Chú Thuật Hồi Chiến...) nhờ assets/profile-names.json.
   - Phân trang "Xem thêm", ảnh thẻ dùng bản thu nhỏ, trạng thái nằm trên URL (?q=). */
(function () {
  var EN = /^\/en(\/|$)/.test(location.pathname);
  var L = EN ? {
    all: 'All Articles', allDesc: 'Explore every article, top story and deep dive tagged by topic on OtaHub.',
    desc: function (q) { return 'Every article, news story and update about "' + q + '".'; },
    title: function (q) { return 'Topic: #' + q + ' · OtaHub'; }, titleAll: 'Topics & Tags · OtaHub',
    found: function (n) { return n + ' article' + (n === 1 ? '' : 's') + ' found'; },
    noIdx: 'Could not load the article index. Please reload the page.',
    emptyT: 'No matching articles', emptyD: function (q) { return 'Nothing matches "' + q + '". Try one of these instead:'; },
    more: function (n) { return 'Show more (' + n + ' left)'; }, cat: 'News', art: 'Article', ex: 'Read the full article on OtaHub...', read: 'Read more →',
    also: function (a) { return 'Also showing results for: ' + a; }
  } : {
    all: 'Tất Cả Bài Viết', allDesc: 'Khám phá toàn bộ bài viết, tin tức nổi bật và phân tích chuyên sâu được gắn thẻ chủ đề trên OtaHub Asia.',
    desc: function (q) { return 'Danh sách toàn bộ các bài viết, tin tức và cập nhật liên quan tới chủ đề "' + q + '".'; },
    title: function (q) { return 'Chủ đề: #' + q + ' · OtaHub'; }, titleAll: 'Chủ Đề & Thẻ Bài Viết · OtaHub',
    found: function (n) { return 'Tìm thấy ' + n + ' bài viết'; },
    noIdx: 'Chưa tải được chỉ mục bài viết. Vui lòng tải lại trang.',
    emptyT: 'Không tìm thấy bài viết nào phù hợp', emptyD: function (q) { return 'Không có bài viết nào khớp với "' + q + '". Thử một trong các chủ đề này:'; },
    more: function (n) { return 'Xem thêm (còn ' + n + ' bài)'; }, cat: 'Tin tức', art: 'Bài viết', ex: 'Xem chi tiết bài viết tại OtaHub...', read: 'Xem chi tiết →',
    also: function (a) { return 'Cũng hiển thị kết quả cho: ' + a; }
  };
  var PAGE = 24;
  var tagLabel = document.getElementById('current-tag-label');
  var tagDesc = document.getElementById('current-tag-desc');
  var searchInput = document.getElementById('tag-search-input');
  var grid = document.getElementById('tag-articles-grid');
  var countBadge = document.getElementById('tag-count-badge');
  var chips = document.querySelectorAll('.tag-chip');
  if (!grid || !searchInput) return;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
      .replace(/['"’“”]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function qParam() { var p = new URLSearchParams(location.search); return (p.get('q') || p.get('tag') || p.get('t') || '').trim(); }
  function thumb(u) {
    var m = /^\/assets\/img\/(?!_[ts]\/)(.+\.(?:jpe?g|png|webp))$/i.exec(u || '');
    return m ? '/assets/img/_t/' + m[1] + '.webp' : u;
  }
  function fmtDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(iso || '')) return '';
    var p = iso.slice(0, 10).split('-');
    return EN ? new Date(iso.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : p[2] + '/' + p[1] + '/' + p[0];
  }

  // tên gọi khác của tác phẩm (VI <-> EN <-> tên cũ), nạp nền
  var GROUPS = null;
  fetch('/assets/profile-names.json').then(function (r) { return r.json(); }).then(function (rows) {
    GROUPS = rows.map(function (r) { return { alias: r[0] || [], names: [norm(r[3]), norm(r[4])].filter(Boolean) }; });
    if (current !== null) render(current, true);
  }).catch(function () {});
  function altNames(q) {
    var out = [];
    if (!GROUPS || q.length < 3) return out;
    GROUPS.forEach(function (g) {
      var hit = g.alias.indexOf(q) > -1 || g.names.indexOf(q) > -1;
      if (!hit) return;
      g.names.concat(g.alias.filter(function (a) { return a.length > 5 && a.split(' ').length > 1; }).slice(0, 2)).forEach(function (n) {
        if (n && n !== q && out.indexOf(n) < 0 && q.indexOf(n) < 0) out.push(n);
      });
    });
    return out.slice(0, 4);
  }

  var current = null, shown = PAGE, results = [];
  function score(item, terms, alts) {
    var t = norm(item.title || item.t), s = norm(item.excerpt || item.s), c = norm(item.cat || item.c), u = norm(item.url || item.u);
    var tg = norm(Array.isArray(item.tags) ? item.tags.join(' ') : item.tags);
    var hay = t + ' ' + tg + ' ' + s + ' ' + c + ' ' + u;
    function test(ts) {
      var sc = 0;
      for (var i = 0; i < ts.length; i++) {
        var w = ts[i];
        if (hay.indexOf(w) < 0) return -1;
        sc += (t.indexOf(w) > -1 ? 6 : 0) + (tg.indexOf(w) > -1 ? 4 : 0) + (u.indexOf(w) > -1 ? 2 : 0) + (s.indexOf(w) > -1 ? 1 : 0) + (c.indexOf(w) > -1 ? 1 : 0);
      }
      return sc;
    }
    var best = test(terms);
    for (var k = 0; k < alts.length; k++) best = Math.max(best, test(alts[k].split(' ')) - 1);
    return best;
  }
  function find(q) {
    var SKIP = { 'Chuyên mục': 1, 'Trang': 1 };
    var pool = window.IDX.filter(function (it) {
      var url = it.url || it.u || '', cat = it.cat || it.c || '';
      return url && (EN ? url.indexOf('/en/') === 0 : url.indexOf('/en/') !== 0) && !SKIP[cat];
    });
    var qn = norm(q);
    if (!qn) return { list: pool.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); }), alts: [] };
    var terms = qn.split(' '), alts = altNames(qn);
    var scored = [];
    pool.forEach(function (it) { var s = score(it, terms, alts); if (s >= 0) scored.push([s, it]); });
    scored.sort(function (a, b) { return b[0] - a[0] || String(b[1].date || '').localeCompare(String(a[1].date || '')); });
    return { list: scored.map(function (x) { return x[1]; }), alts: alts };
  }
  function cardHtml(it, i) {
    var hero = it.img || it.hero || '/assets/img/placeholder.svg';
    var url = it.url || it.u || '#'; if (url.charAt(0) !== '/') url = '/' + url;
    var d = fmtDate(it.date);
    return '<a href="' + esc(url) + '" class="tag-card"><div class="tag-card-thumb-wrap"><img height="360" width="640" src="' + esc(thumb(hero)) + '" alt="' + esc(it.title || it.t) + '" class="tag-card-thumb" ' + (i < 6 ? '' : 'loading="lazy" ') + 'decoding="async" onerror="this.onerror=null;this.src=\'' + esc(hero) + '\'"><span class="tag-card-cat">' + esc(it.cat || it.c || L.cat) + '</span></div>' +
      '<div class="tag-card-body"><h2 class="tag-card-title">' + esc(it.title || it.t || L.art) + '</h2><p class="tag-card-excerpt">' + esc(it.excerpt || it.s || L.ex) + '</p>' +
      '<div class="tag-card-meta"><span>' + (d ? '🗓 ' + d : '⚡ OtaHub Editorial') + '</span><span>' + L.read + '</span></div></div></a>';
  }
  function draw() {
    var html = results.slice(0, shown).map(cardHtml).join('');
    if (results.length > shown) html += '<div class="tag-more-wrap"><button type="button" class="tag-more" id="tag-more">' + esc(L.more(results.length - shown)) + '</button></div>';
    grid.innerHTML = html;
  }
  function render(query, keepShown) {
    current = query;
    if (!keepShown) shown = PAGE;
    searchInput.value = query;
    chips.forEach(function (c) { var v = c.getAttribute('data-tag'); c.classList.toggle('active', (!v && !query) || (v && norm(v) === norm(query))); });
    if (query) { tagLabel.textContent = '#' + query; tagDesc.textContent = L.desc(query); document.title = L.title(query); }
    else { tagLabel.textContent = L.all; tagDesc.textContent = L.allDesc; document.title = L.titleAll; }
    if (!window.IDX || !Array.isArray(window.IDX)) { grid.innerHTML = '<div class="tag-empty"><div class="tag-empty-icon">⚠️</div><div>' + L.noIdx + '</div></div>'; return; }
    var r = find(query); results = r.list;
    countBadge.textContent = L.found(results.length) + (r.alts.length ? '' : '');
    if (!results.length) {
      var sug = Array.prototype.slice.call(chips).filter(function (c) { return c.getAttribute('data-tag'); }).slice(0, 8).map(function (c) {
        return '<button type="button" class="tag-chip" data-tag="' + esc(c.getAttribute('data-tag')) + '">' + esc(c.textContent) + '</button>';
      }).join('');
      grid.innerHTML = '<div class="tag-empty"><div class="tag-empty-icon">🔍</div><div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">' + L.emptyT + '</div><div>' + esc(L.emptyD(query)) + '</div><div class="tag-chips" style="justify-content:center;margin-top:14px">' + sug + '</div></div>';
      return;
    }
    draw();
    if (r.alts.length) countBadge.title = L.also(r.alts.join(', '));
  }
  function go(q, replace) {
    var u = q ? (EN ? '/en/tag?q=' : '/tag?q=') + encodeURIComponent(q) : (EN ? '/en/tag' : '/tag');
    history[replace ? 'replaceState' : 'pushState']({}, '', u);
    render(q);
  }
  document.addEventListener('click', function (e) {
    var chip = e.target.closest && e.target.closest('.tag-chip');
    if (chip) { go(chip.getAttribute('data-tag') || '', false); return; }
    var more = e.target.closest && e.target.closest('#tag-more');
    if (more) { shown += PAGE; draw(); }
  });
  var timer;
  searchInput.addEventListener('input', function () { clearTimeout(timer); var v = this.value.trim(); timer = setTimeout(function () { go(v, true); }, 160); });
  searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { clearTimeout(timer); go(this.value.trim(), false); } });
  window.addEventListener('popstate', function () { render(qParam()); });
  (function wait() { if (window.IDX && Array.isArray(window.IDX)) render(qParam()); else setTimeout(wait, 40); })();
})();
