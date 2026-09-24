/* OtaHub — nút chuyển ngôn ngữ VI ⇄ EN. Tự đọc bản dịch tương ứng từ thẻ <link rel="alternate" hreflang>. */
(function () {
  try {
    var nav = document.querySelector('.nav-r');
    if (!nav || nav.querySelector('.lang-sw')) return;
    var isEn = /^\/en(\/|$)/.test(location.pathname);
    var target = null;
    var links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    for (var i = 0; i < links.length; i++) {
      var hl = links[i].getAttribute('hreflang');
      if ((isEn && hl === 'vi') || (!isEn && hl === 'en')) {
        try { target = new URL(links[i].href).pathname; } catch (e) {}
      }
    }
    if (!target) target = isEn ? '/' : '/en/'; // chưa có bản dịch của trang này: về trang chủ ngôn ngữ kia
    var a = document.createElement('a');
    a.className = 'lang-sw';
    a.href = target;
    a.setAttribute('hreflang', isEn ? 'vi' : 'en');
    a.setAttribute('lang', isEn ? 'vi' : 'en');
    a.setAttribute('aria-label', isEn ? 'Xem bằng tiếng Việt' : 'View in English');
    a.title = isEn ? 'Tiếng Việt' : 'English';
    a.textContent = isEn ? 'VI' : 'EN';
    a.style.cssText = 'display:inline-flex;align-items:center;font-size:11px;font-weight:700;letter-spacing:.09em;color:var(--cyan,#00e5ff);border:1px solid var(--cyan,#00e5ff);padding:5px 9px;margin-right:10px;text-decoration:none;line-height:1;border-radius:2px';
    nav.insertBefore(a, nav.firstChild);
  } catch (e) {}
})();
