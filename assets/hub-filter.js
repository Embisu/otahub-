/* Bộ lọc menu con trang chuyên mục (Gaming / Anime / Manga, VI + EN).
   Thanh lọc và thẻ bài do scripts/sync-hub-articles.mjs dựng: mỗi bài có data-type (mục con, đúng 1)
   và data-facet (danh sách từ khóa nhóm phụ, ví dụ "pc online vn" hoặc "manhwa").
   Hàng 1 = mục con (tab). Hàng 2 = chip nhóm phụ, mỗi chip thuộc một nhóm (data-group):
   trong cùng nhóm chọn nhiều chip = HOẶC, giữa các nhóm = VÀ (Mobile + Online = bài mobile VÀ online).
   Chip có data-single (Manga: xuất xứ) chỉ chọn một; nút data-facet="all" bỏ chọn tất cả.
   Trạng thái nằm trên URL (?muc=...&nhom=pc,online) để chia sẻ đúng tab.
   Số đếm trên từng tab/chip luôn tính theo bộ lọc còn lại; mục không có bài bị làm mờ và không bấm được,
   nên không thể rơi vào ngõ cụt "Chưa có bài nào". Khi lọc theo nhóm phụ, khối Tiêu điểm (chỉ biết mục con) được ẩn. */
(function () {
  var bar = document.querySelector('.filter-bar[data-hub]');
  if (!bar) return;
  var prefix = bar.getAttribute('data-prefix');
  var heroFn = window['update' + prefix.charAt(0).toUpperCase() + prefix.slice(1) + 'Hero'];
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ac[data-type]'));
  var chips = Array.prototype.slice.call(bar.querySelectorAll('.ffacet[data-group]'));
  var params = new URLSearchParams(location.search);
  var known = chips.map(function (c) { return c.getAttribute('data-facet'); });
  var state = {
    type: params.get('muc') || 'all',
    facets: (params.get('nhom') || '').split(',').filter(function (k) { return known.indexOf(k) > -1; })
  };
  var list = cards.length ? cards[0].parentNode : null;
  var empty = document.createElement('p');
  empty.className = 'hub-empty';
  empty.textContent = /^\/en\//.test(location.pathname) ? 'No articles match this filter yet.' : 'Chưa có bài nào khớp bộ lọc này.';
  var feat = document.querySelector('.f-grid');
  var featHead = feat && feat.previousElementSibling && feat.previousElementSibling.classList.contains('sec-h') ? feat.previousElementSibling : null;
  var content = document.querySelector('.content-layout') || list;

  var st = document.createElement('style');
  st.textContent = '.filter-bar[data-hub] .is-empty{opacity:.35;cursor:not-allowed;pointer-events:none}' +
    '.filter-bar[data-hub] .ffacet .ftab-n{display:inline-block;min-width:18px;margin-left:6px;padding:1px 6px;border-radius:999px;background:rgba(255,255,255,.07);color:var(--muted,#8b8aa3);font-size:10px;line-height:1.5;text-align:center}' +
    '.filter-bar[data-hub] .ffacet.on .ftab-n{background:rgba(0,242,255,.14);color:var(--cyan,#00f2ff)}' +
    '.hub-scroll{scroll-margin-top:216px}';
  document.head.appendChild(st);
  bar.querySelectorAll('.ffacet').forEach(function (b) {
    if (!b.querySelector('.ftab-n')) b.insertAdjacentHTML('beforeend', ' <span class="ftab-n"></span>');
  });

  function groupOf(key) {
    var c = chips.filter(function (x) { return x.getAttribute('data-facet') === key; })[0];
    return c && c.getAttribute('data-group');
  }
  // facets: danh sách chip đang chọn. Trong cùng nhóm = HOẶC, khác nhóm = VÀ.
  function facetOk(card, facets) {
    if (!facets.length) return true;
    var have = (card.getAttribute('data-facet') || '').split(' ');
    var byGroup = {};
    facets.forEach(function (k) { (byGroup[groupOf(k)] = byGroup[groupOf(k)] || []).push(k); });
    return Object.keys(byGroup).every(function (g) {
      return byGroup[g].some(function (k) { return have.indexOf(k) > -1; });
    });
  }
  function typeOk(card, type) { return type === 'all' || card.getAttribute('data-type') === type; }
  function count(type, facets) {
    var n = 0;
    cards.forEach(function (c) { if (typeOk(c, type) && facetOk(c, facets)) n++; });
    return n;
  }
  // số bài khi bấm chip này: giữ nguyên các nhóm khác, nhóm của chip chỉ còn chip đó
  function chipCount(key) {
    var g = groupOf(key);
    var others = state.facets.filter(function (k) { return groupOf(k) !== g; });
    return count(state.type, others.concat(key));
  }
  function setN(btn, n, keepOn) {
    var el = btn.querySelector('.ftab-n');
    if (el) el.textContent = n;
    var off = n === 0 && !btn.classList.contains('on') && !keepOn;
    btn.classList.toggle('is-empty', off);
    if (off) btn.setAttribute('aria-disabled', 'true'); else btn.removeAttribute('aria-disabled');
  }
  function scrollToContent() {
    var t = feat && !feat.classList.contains('cat-hidden') ? (featHead || feat) : content;
    if (!t) return;
    t.classList.add('hub-scroll');
    setTimeout(function () { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
  }
  // thanh lọc cuộn ngang trên điện thoại: đưa mục đang chọn vào giữa để luôn thấy mình đang ở đâu
  function revealActive() {
    bar.querySelectorAll('.filter-in').forEach(function (row) {
      if (row.scrollWidth <= row.clientWidth) return;
      var pick = row.querySelector('.ftab.on[data-type], .ffacet.on');
      if (!pick) return;
      row.scrollTo({ left: pick.offsetLeft - (row.clientWidth - pick.offsetWidth) / 2, behavior: 'auto' });
    });
  }
  function apply(fromClick) {
    if (!bar.querySelector('[data-type="' + state.type + '"]')) state.type = 'all';
    var shown = 0;
    cards.forEach(function (c) {
      var ok = typeOk(c, state.type) && facetOk(c, state.facets);
      c.classList.toggle('cat-hidden', !ok);
      if (ok) shown++;
    });
    bar.querySelectorAll('[data-type]').forEach(function (b) {
      var t = b.getAttribute('data-type'), on = t === state.type;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      setN(b, count(t, state.facets));
    });
    var none = !state.facets.length;
    bar.querySelectorAll('.ffacet').forEach(function (b) {
      var f = b.getAttribute('data-facet');
      var on = f === 'all' ? none : state.facets.indexOf(f) > -1;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      if (f !== 'all') setN(b, chipCount(f));
    });
    // khối Tiêu điểm chỉ theo mục con, nên ẩn khi đang lọc theo nhóm phụ để không lệch với danh sách bên dưới
    var hideFeat = !none;
    if (feat) feat.classList.toggle('cat-hidden', hideFeat);
    if (featHead) featHead.classList.toggle('cat-hidden', hideFeat);
    if (list) { if (!shown) list.appendChild(empty); else if (empty.parentNode) empty.parentNode.removeChild(empty); }
    if (typeof heroFn === 'function' && !hideFeat && (fromClick || state.type !== 'all')) heroFn(state.type);
    if (fromClick) {
      var u = new URL(location.href);
      if (state.type === 'all') u.searchParams.delete('muc'); else u.searchParams.set('muc', state.type);
      if (!state.facets.length) u.searchParams.delete('nhom'); else u.searchParams.set('nhom', state.facets.join(','));
      history.replaceState(null, '', u);
      scrollToContent();
    }
    revealActive();
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-type],[data-facet]');
    if (!b || b.tagName === 'A' || b.getAttribute('aria-disabled') === 'true') return;
    if (b.hasAttribute('data-type')) state.type = b.getAttribute('data-type');
    else {
      var f = b.getAttribute('data-facet'), i = state.facets.indexOf(f);
      if (f === 'all') state.facets = [];
      else if (i > -1) state.facets.splice(i, 1);
      else if (b.hasAttribute('data-single')) state.facets = [f];
      else state.facets.push(f);
    }
    apply(true);
  });
  apply(false);
})();
