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
  var chipBox = document.getElementById('popular-tags-container');
  var allChips = function () { return document.querySelectorAll('.tag-chip'); };
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
    // bảng tên dùng cách chuẩn hóa riêng (giữ dấu : '), nên chuẩn hóa lại cùng kiểu với ô tìm kiếm
    GROUPS = rows.map(function (r) { return { alias: (r[0] || []).map(norm), names: [norm(r[3]), norm(r[4])].filter(Boolean) }; });
    if (current !== null) render(current, true);
  }).catch(function () {});
  // bỏ "season 2", "part 2", "mùa 4", "2nd season", "the " đầu câu: bài thường chỉ ghi tên gốc không kèm mùa
  function relax(q) {
    return q.replace(/\b(\d+(st|nd|rd|th) )?(season|part|mua|phan|cour)( \d+)?\b/g, ' ').replace(/^the /, '').replace(/\s+/g, ' ').trim();
  }
  // cách gọi khác của cùng tác phẩm: tên Việt hóa, tên gốc và các tên rút gọn (GTA 6, PUBG, Witcher 3...)
  function altNames(q) {
    var out = [];
    var rl = relax(q);
    if (rl && rl !== q && rl.length >= 3) out.push(rl);
    if (!GROUPS || q.length < 3) return out;
    var prefixHits = 0;
    GROUPS.forEach(function (g) {
      var hit = g.alias.indexOf(q) > -1 || g.names.indexOf(q) > -1 || (rl && (g.alias.indexOf(rl) > -1 || g.names.indexOf(rl) > -1));
      // gõ dở tên gọi khác (vd. "Kimetsu" -> Kimetsu no Yaiba = Thanh Gươm Diệt Quỷ): khớp đầu tên, tối đa 3 tác phẩm
      if (!hit && q.length >= 6 && prefixHits < 3 && g.alias.concat(g.names).some(function (a) { return a.indexOf(q + ' ') === 0; })) { hit = true; prefixHits++; }
      if (!hit) return;
      g.names.concat(g.alias).forEach(function (n) {
        n = relax(n);
        if (n && n !== q && n.length >= 4 && out.indexOf(n) < 0) out.push(n);
      });
    });
    return out.slice(0, 10);
  }
  // từ khóa khớp theo đầu từ (gõ dở vẫn ra), riêng số và từ ≤2 ký tự phải khớp nguyên từ: "oshi" không dính "Koshien", "2" không dính "2026"
  function has(hay, w) {
    var h = ' ' + hay + ' ';
    return (w.length <= 2 || /^\d+$/.test(w)) ? h.indexOf(' ' + w + ' ') > -1 : h.indexOf(' ' + w) > -1;
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
        if (!has(hay, w)) return -1;
        sc += (has(t, w) ? 6 : 0) + (has(tg, w) ? 4 : 0) + (has(u, w) ? 2 : 0) + (has(s, w) ? 1 : 0) + (has(c, w) ? 1 : 0);
      }
      return sc;
    }
    var best = test(terms), ph = false;
    var phrase = ' ' + terms.join(' ');
    [t, tg, s, u].forEach(function (f) { if ((' ' + f + ' ').indexOf(phrase) > -1 && (' ' + f + ' ').indexOf(phrase + ' ') > -1) ph = true; });
    for (var k = 0; k < alts.length; k++) { var a = test(alts[k].split(' ')) - 1; if (a >= 0 && test(alts[k].split(' ')) >= 0) ph = true; best = Math.max(best, a); }
    return { sc: best, ph: ph };
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
    pool.forEach(function (it) { var r = score(it, terms, alts); if (r.sc >= 0) scored.push([r.sc, it, r.ph]); });
    // nhiều từ: ưu tiên bài chứa đúng cụm từ (hoặc tên gọi khác); chỉ khi không có bài nào mới nới sang khớp rời từng từ
    // (nhấn thẻ "Anime 2026" ra bài gắn thẻ đó, không ra mọi bài có chữ "anime" và "2026" ở đâu đó)
    if (terms.length > 1 && scored.some(function (x) { return x[2]; })) scored = scored.filter(function (x) { return x[2]; });
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
    injectPf();
  }
  /* Hồ sơ tác phẩm khớp từ khóa (assets/profile-names.json): hiện thành dải thẻ phía trên danh sách bài viết */
  var pfRows = null;
  function loose(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function pfMatch(q, limit) {
    var best = {};
    pfRows.forEach(function (o) {
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
  function injectPf() {
    var old = grid.querySelector('.tag-pf'); if (old) old.parentNode.removeChild(old);
    var q = loose(current);
    if (!pfRows || q.length < 2) return;
    var list = pfMatch(q, 8);
    if (!list.length) return;
    var base = EN ? '/en/profile/' : '/ho-so/';
    var html = '<div class="tag-pf"><div class="tag-pf-h"><span>' + (EN ? 'Title profiles' : 'Hồ sơ tác phẩm') + '</span><a href="' + base + '?q=' + encodeURIComponent(current) + '">' + (EN ? 'See all' : 'Xem tất cả') + ' →</a></div><div class="tag-pf-row">' +
      list.map(function (r) {
        var p = EN ? r[1].replace(/^\/ho-so\//, '/en/profile/') : r[1];
        return '<a class="tag-pf-it" href="' + esc(p) + '"><img src="' + esc(r[7]) + '" alt="" width="48" height="64" loading="lazy"><span><b>' + esc(EN ? r[4] : r[3]) + '</b><small>' + esc(EN ? r[6] : r[5]) + '</small></span></a>';
      }).join('') + '</div></div>';
    grid.insertAdjacentHTML('afterbegin', html);
  }
  (function () {
    var st = document.createElement('style');
    st.textContent = '.tag-pf{grid-column:1/-1;margin-bottom:18px;padding:16px 18px;border:1px solid rgba(0,242,255,.18);background:rgba(255,255,255,.03);border-radius:10px}.tag-pf-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:#00f2ff}.tag-pf-h a{color:rgba(240,238,255,.7);text-decoration:none;letter-spacing:.04em;text-transform:none;font-size:13px;font-weight:600}.tag-pf-row{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}.tag-pf-it{display:flex;align-items:center;gap:10px;flex:none;width:230px;padding:8px 10px;border:1px solid rgba(255,255,255,.08);border-radius:8px;text-decoration:none;color:#f0eeff}.tag-pf-it:hover{border-color:rgba(0,242,255,.4);background:rgba(0,242,255,.06)}.tag-pf-it img{width:48px;height:64px;object-fit:cover;border-radius:4px;background:#1d1240;flex:none}.tag-pf-it b{display:block;font-size:14px;line-height:1.3;font-weight:700}.tag-pf-it small{display:block;margin-top:3px;font-size:11px;color:rgba(240,238,255,.5)}';
    document.head.appendChild(st);
    fetch('/assets/profile-names.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (j) {
      pfRows = j.map(function (r) { return { r: r, names: r[0].map(loose).filter(function (n) { return n.length > 1; }) }; });
      injectPf();
    }).catch(function () {});
  })();
  function render(query, keepShown) {
    renderBase(query, keepShown);
    injectPf();
  }
  function renderBase(query, keepShown) {
    addAutoChips();
    current = query;
    if (!keepShown) shown = PAGE;
    searchInput.value = query;
    Array.prototype.forEach.call(allChips(), function (c) { var v = c.getAttribute('data-tag'); c.classList.toggle('active', (!v && !query) || (v && norm(v) === norm(query))); });
    if (query) { tagLabel.textContent = '#' + query; tagDesc.textContent = L.desc(query); document.title = L.title(query); }
    else { tagLabel.textContent = L.all; tagDesc.textContent = L.allDesc; document.title = L.titleAll; }
    if (!window.IDX || !Array.isArray(window.IDX)) { grid.innerHTML = '<div class="tag-empty"><div class="tag-empty-icon">⚠️</div><div>' + L.noIdx + '</div></div>'; return; }
    var r = find(query); results = r.list;
    countBadge.textContent = L.found(results.length) + (r.alts.length ? '' : '');
    if (!results.length) {
      var sug = Array.prototype.slice.call(allChips()).filter(function (c) { return c.getAttribute('data-tag'); }).slice(0, 8).map(function (c) {
        return '<button type="button" class="tag-chip" data-tag="' + esc(c.getAttribute('data-tag')) + '">' + esc(c.textContent) + '</button>';
      }).join('');
      grid.innerHTML = '<div class="tag-empty"><div class="tag-empty-icon">🔍</div><div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">' + L.emptyT + '</div><div>' + esc(L.emptyD(query)) + '</div><div class="tag-chips" style="justify-content:center;margin-top:14px">' + sug + '</div></div>';
      return;
    }
    draw();
    if (r.alts.length) countBadge.title = L.also(r.alts.join(', '));
  }
  // Thêm các thẻ phổ biến nhất trong chỉ mục (ngoài các chip dựng sẵn) để bấm là ra bài, không phải tự gõ
  var GENERIC = { anime: 1, manga: 1, gaming: 1, 'danh gia': 1, reviews: 1, review: 1, '2026': 1, '2027': 1, pc: 1, ps5: 1, xbox: 1, 'tin tuc': 1, 'tin moi': 1, news: 1, otahub: 1, 'xep hang': 1, rankings: 1, trailer: 1, '2025': 1, game: 1, games: 1 };
  var autoDone = false;
  function addAutoChips() {
    if (autoDone || !chipBox || !window.IDX) return;
    autoDone = true;
    var have = {};
    Array.prototype.forEach.call(allChips(), function (c) { have[norm(c.getAttribute('data-tag'))] = 1; });
    var cnt = {}, label = {};
    window.IDX.forEach(function (it) {
      var url = it.url || it.u || '';
      if ((EN ? url.indexOf('/en/') !== 0 : url.indexOf('/en/') === 0) || !Array.isArray(it.tags)) return;
      it.tags.forEach(function (t) { var k = norm(t); if (!k || GENERIC[k] || have[k] || k.length < 3) return; cnt[k] = (cnt[k] || 0) + 1; label[k] = label[k] || {}; label[k][t] = (label[k][t] || 0) + 1; });
    });
    Object.keys(cnt).filter(function (k) { return cnt[k] >= 3; }).sort(function (a, b) { return cnt[b] - cnt[a]; }).slice(0, 24).forEach(function (k) {
      var best = Object.keys(label[k]).sort(function (a, b) { return label[k][b] - label[k][a]; })[0];
      chipBox.insertAdjacentHTML('beforeend', '<button class="tag-chip" data-tag="' + esc(best) + '">' + esc(best) + ' <span style="opacity:.55">' + cnt[k] + '</span></button>');
    });
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
