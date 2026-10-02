/* Bộ lọc menu con trang chuyên mục (Gaming / Anime / Manga, VI + EN).
   Thanh lọc và thẻ bài do scripts/sync-hub-articles.mjs dựng: mỗi bài có data-type (mục con, đúng 1)
   và data-facet (nền tảng / xuất xứ). Lọc = mục con VÀ nhóm phụ; bài "multi" (đa nền tảng) khớp cả PC lẫn Mobile.
   Trạng thái nằm trên URL (?muc=...&nhom=...) để chia sẻ đúng tab. */
(function () {
  var bar = document.querySelector('.filter-bar[data-hub]');
  if (!bar) return;
  var prefix = bar.getAttribute('data-prefix');
  var heroFn = window['update' + prefix.charAt(0).toUpperCase() + prefix.slice(1) + 'Hero'];
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ac[data-type]'));
  var params = new URLSearchParams(location.search);
  var state = { type: params.get('muc') || 'all', facet: params.get('nhom') || 'all' };
  var list = cards.length ? cards[0].parentNode : null;
  var empty = document.createElement('p');
  empty.className = 'hub-empty';
  empty.textContent = /^\/en\//.test(location.pathname) ? 'No articles match this filter yet.' : 'Chưa có bài nào khớp bộ lọc này.';

  function facetOk(card) {
    var f = card.getAttribute('data-facet');
    return state.facet === 'all' || f === state.facet || (f === 'multi' && (state.facet === 'pc' || state.facet === 'mobile'));
  }
  function apply(fromClick) {
    if (!bar.querySelector('[data-type="' + state.type + '"]')) state.type = 'all';
    if (!bar.querySelector('[data-facet="' + state.facet + '"]')) state.facet = 'all';
    var shown = 0;
    cards.forEach(function (c) {
      var ok = (state.type === 'all' || c.getAttribute('data-type') === state.type) && facetOk(c);
      c.classList.toggle('cat-hidden', !ok);
      if (ok) shown++;
    });
    bar.querySelectorAll('[data-type]').forEach(function (b) { var on = b.getAttribute('data-type') === state.type; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    bar.querySelectorAll('[data-facet]').forEach(function (b) { var on = b.getAttribute('data-facet') === state.facet; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    if (list) { if (!shown) list.appendChild(empty); else if (empty.parentNode) empty.parentNode.removeChild(empty); }
    if (typeof heroFn === 'function' && (fromClick || state.type !== 'all')) heroFn(state.type);
    if (fromClick) {
      var u = new URL(location.href);
      if (state.type === 'all') u.searchParams.delete('muc'); else u.searchParams.set('muc', state.type);
      if (state.facet === 'all') u.searchParams.delete('nhom'); else u.searchParams.set('nhom', state.facet);
      history.replaceState(null, '', u);
    }
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-type],[data-facet]');
    if (!b || b.tagName === 'A') return;
    if (b.hasAttribute('data-type')) state.type = b.getAttribute('data-type');
    else state.facet = b.getAttribute('data-facet');
    apply(true);
  });
  apply(false);
})();
