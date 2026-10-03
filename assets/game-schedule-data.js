/* Lịch phát hành game OtaHub — dữ liệu dùng chung cho tab "Lịch game" ở /lich-phat-song (VI + EN)
   và khối "Lịch phát hành game" ở trang Gaming (scripts/sync-hub-articles.mjs đọc đúng file này, bỏ mục đã qua).
   Trường: t = tên, tv = tên tiếng Việt (nếu khác), d = ngày ra mắt (YYYY-MM-DD, giờ VN),
           k = game | update (bản cập nhật lớn của game đang chạy), p = pc (PC/Console) | mobile, m = offline | online,
           vn = true nếu do studio Việt làm, pf = nền tảng hiển thị, s = studio/hãng, l / le = bài OtaHub (VI / EN),
           i = ảnh, src = nguồn ngày ra mắt.
   Nhóm p x m x vn khớp bảng Xếp hạng game. Chỉ ghi tựa đã có ngày công bố chính thức; không tự suy đoán.
   Online = chơi mạng/multiplayer/live-service là cốt lõi; Offline = chơi một mình. */
window.OT_GAME_SCHEDULE = {
  updated: '2026-10-03',
  items: [
    {t:'Ghost of Yōtei Complete Edition', d:'2026-10-01', k:'game', p:'pc', m:'offline', pf:'PS5', s:'Sucker Punch', l:'/ghost-of-yotei-complete-edition', le:'/en/ghost-of-yotei-complete-edition', i:'/assets/img/yt-sLcksHR30UA.jpg', src:'OtaHub'},
    {t:'Gears of War: E-Day', d:'2026-10-06', k:'game', p:'pc', m:'offline', pf:'Windows, Xbox Series X|S', s:'The Coalition', l:'/gears-of-war-e-day-thoi-gian-phat-hanh-va-cach-choi-som', le:'/en/gears-of-war-e-day-release-time-and-how-to-play-early', i:'/assets/img/uploads/p4z3x3u9-gears-of-war-e-day-revs-up-hype-with-a-playable-demo-at-game.webp', src:'OtaHub'},
    {t:'Order of the Sinking Star', d:'2026-10-08', k:'game', p:'pc', m:'offline', pf:'PC, Switch 2, PS5', s:'Thekla', l:'/order-of-the-sinking-star-ps5', le:'/en/order-of-the-sinking-star-ps5', i:'/assets/img/news-order-of-the-sinking-star-ps5.jpg', src:'OtaHub'},
    {t:'Zenless Zone Zero 3.3', d:'2026-10-21', k:'update', p:'mobile', m:'online', pf:'Mobile, PC, PS5', s:'HoYoverse', l:'', le:'', i:'/assets/img/news-zzz-20-outer-ring.jpg', src:'Thông báo phiên bản 3.2 của HoYoverse (kết thúc 21/10/2026)'},
    {t:'Call of Duty: Modern Warfare 4', d:'2026-10-23', k:'game', p:'pc', m:'online', pf:'PC, PS5, Xbox, Switch 2', s:'Activision', l:'/call-of-duty-modern-warfare-4-gamescom-playable', le:'/en/call-of-duty-modern-warfare-4-gamescom-playable', i:'/assets/img/news-call-of-duty-modern-warfare-4-gamescom-playable.jpg', src:'OtaHub'},
    {t:'Monster Hunter Outlanders', d:'2026-10-29', k:'game', p:'mobile', m:'online', pf:'iOS, Android (toàn cầu trừ Trung Quốc)', s:'Capcom / TiMi Studio · Level Infinite, Garena (Đông Nam Á)', l:'', le:'', i:'', src:'Trang chính thức monsterhunteroutlanders.com; Gematsu 9/2026; GamelandVN 2/10/2026'},
    {t:'GTA 6', d:'2026-11-19', k:'game', p:'pc', m:'offline', pf:'PS5, Xbox Series X|S', s:'Rockstar Games', l:'/dem-nguoc-gta-6', le:'/en/gta-6-countdown', i:'/assets/img/gta6-official-art.jpg', src:'OtaHub'},
    {t:'One Piece: Grand Gourmet', d:'2026-10-23', k:'game', p:'mobile', m:'offline', pf:'iOS, Android, PC, Switch, Switch 2', s:'Bandai Namco / Kairosoft', l:'', le:'', i:'', src:'Gematsu 6/2026; thông cáo Bandai Namco (bản console ra 22/10)'},
    {t:'Saints Row: The Third Remastered', d:'2026-10-29', k:'game', p:'mobile', m:'offline', pf:'iOS, Android', s:'Feral Interactive', l:'', le:'', i:'', src:'Mobilegamer.biz 9/2026; App Store mở đặt trước'},
    {t:'Absolum', d:'2026-11-05', k:'game', p:'mobile', m:'offline', pf:'iOS, Android (bản mobile)', s:'Playdigious / Dotemu', l:'', le:'', i:'', src:'Thông báo Playdigious qua iPhoneSoft 9/2026'},
    {t:'Ananta', d:'2027-01-15', k:'game', p:'mobile', m:'online', pf:'iOS, Android, PC, PS5', s:'NetEase Games / Naked Rain', l:'', le:'', i:'', src:'RPGSite 25/8/2026; Inven Global (công bố tại Gamescom ONL)'}
  ]
};
