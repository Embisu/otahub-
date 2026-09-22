/* OtaHub — nut/overlay tim kiem tren header chi la khung nhap, khong tu loc
   ket qua. Enter se dua nguoi dung sang /tag?q=... , trang duy nhat thuc su
   co logic loc bai viet (dung window.IDX tu assets/search.js). */
(function () {
  var el = document.getElementById('searchInput');
  if (!el) return;
  el.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    var q = this.value.trim();
    window.location.href = q ? '/tag?q=' + encodeURIComponent(q) : '/tag';
  });
})();
