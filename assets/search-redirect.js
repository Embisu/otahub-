/* OtaHub, nut/overlay tim kiem tren header chi la khung nhap, khong tu loc
   ket qua. Enter se dua nguoi dung sang /tag?q=... , trang duy nhat thuc su
   co logic loc bai viet (dung window.IDX tu assets/search.js). */
(function () {
  var el = document.getElementById('searchInput');
  if (!el) return;
  el.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    var q = this.value.trim();
    var base = location.pathname.indexOf('/en/') === 0 || location.pathname === '/en' ? '/en/tag' : '/tag'; // trang tag đúng ngôn ngữ
    window.location.href = q ? base + '?q=' + encodeURIComponent(q) : base;
  });
})();
