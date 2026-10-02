// Nội dung trang "Đếm ngược GTA 6" (VI + EN). Chỉ chứa dữ kiện đã được Rockstar xác nhận hoặc thấy trực tiếp trong video chính thức;
// phần suy đoán luôn ghi rõ. Sinh trang: node scripts/build-gta6-hub.mjs  (cập nhật UPDATED khi sửa nội dung).
export const UPDATED = '2026-10-02';
export const OFFICIAL = 'https://www.rockstargames.com/VI';
const YT = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const vi = {
  lang: 'vi', htmlLang: 'vi', path: '/dem-nguoc-gta-6', altPath: '/en/gta-6-countdown', home: '/',
  ui: { skip: 'Tới nội dung', updated: 'Cập nhật', by: 'OtaHub nghiên cứu, tổng hợp', crumbHome: 'Trang chủ', crumbSec: 'Gaming', secUrl: '/gaming',
    readMore: 'Đọc bài', official: 'Trang chính thức của Rockstar' },
  meta: {
    title: 'Đếm ngược GTA 6: mọi điều cần biết trước 19/11',
    description: 'OtaHub nghiên cứu, tổng hợp GTA 6: đồng hồ đếm ngược, ngày ra mắt, giá, bản đồ Leonida, nhân vật, gameplay, xe và vũ khí đã lộ diện.',
    ogImage: 'https://otahub.asia/assets/img/gta6-official-art.jpg',
    keywords: 'GTA 6, GTA VI, đếm ngược GTA 6, ngày ra mắt GTA 6, giá GTA 6, bản đồ Leonida, Vice City, Jason Lucia, Rockstar Games'
  },
  hero: {
    kicker: 'Đếm ngược GTA 6',
    title: 'GTA <em>VI</em>',
    sub: 'Grand Theft Auto VI ra mắt ngày 19/11/2026 trên PS5 và Xbox Series X|S. OtaHub nghiên cứu, tổng hợp mọi điều Rockstar đã xác nhận: cốt truyện, bản đồ Leonida, gameplay, giá và các phiên bản.',
    units: { d: 'Ngày', h: 'Giờ', m: 'Phút', s: 'Giây' },
    note: 'Rockstar chưa công bố giờ mở bán chính thức. Chọn giả định:',
    optVN: '00:00 giờ Việt Nam', optUS: '00:00 giờ miền Đông Mỹ',
    launched: 'GTA VI đã ra mắt. Chúc bạn chơi vui!',
    cta1: ['Xem Extended Look', '#video'], cta2: ['Thông tin nhanh', '#nhanh']
  },
  chips: [['tong-quan', 'Tổng quan'], ['nhanh', 'Thông tin nhanh'], ['moc', 'Mốc thời gian'], ['nhan-vat', 'Cốt truyện & nhân vật'], ['ban-do', 'Bản đồ Leonida'],
    ['gameplay', 'Gameplay'], ['kho', 'Xe & vũ khí'], ['phien-ban', 'Phiên bản & giá'], ['video', 'Video'], ['lich-su', 'Lịch sử GTA'], ['cho', 'Còn chờ xác nhận'], ['faq', 'Hỏi đáp'], ['tin', 'Tin OtaHub']],
  intro: {
    eyebrow: 'Tổng quan', h: 'Vì sao GTA 6 là sự kiện lớn nhất của làng game năm nay?',
    p: [
      'Grand Theft Auto VI là tựa game thế giới mở của Rockstar Games, đưa người chơi trở lại Vice City trong bang hư cấu Leonida, vùng đất lấy cảm hứng từ Florida. Đây là phần chính đầu tiên của series kể từ GTA V (2013), tức hơn 13 năm chờ đợi.',
      'Sau hai lần dời lịch, game chốt ngày 19/11/2026 trên PS5 và Xbox Series X|S. Đoạn Extended Look dài khoảng 26 phút ngày 27/8/2026, quay hoàn toàn từ bản chơi trên PS5, là lần đầu Rockstar cho thấy gameplay thật thay vì chỉ trailer điện ảnh.',
      'Trang này gom những gì Rockstar đã xác nhận hoặc thấy trực tiếp trong video chính thức, đánh dấu rõ phần nào còn là suy đoán, và sẽ được cập nhật khi có thông tin mới.'
    ],
    img: '/assets/img/gta6-official-art.jpg', alt: 'Artwork chính thức của Grand Theft Auto VI với Jason, Lucia và các nhân vật phụ', cap: 'Ảnh: Rockstar Games.', iw: 1200, ih: 630
  },
  facts: {
    eyebrow: 'Thông tin nhanh', h: 'GTA 6 trong một màn hình',
    items: [
      ['Ngày ra mắt', '19/11/2026', 'Rockstar chưa công bố giờ mở bán.'],
      ['Nền tảng', 'PS5 · Xbox Series X|S', 'Không có PS4 và Xbox One. Trang chính thức ghi game chơi tốt nhất trên PS5.'],
      ['PC', 'Chưa công bố', 'Chưa có bản PC hay lịch cụ thể. Các GTA trước lên PC sau console từ 7 đến 19 tháng.'],
      ['Phát triển / phát hành', 'Rockstar Games / Take-Two', 'Hãng game mẹ là Take-Two Interactive.'],
      ['Giá', '79,99 / 99,99 USD', 'Bản Standard và Ultimate. Mở đặt trước từ 25/6/2026.'],
      ['Hiệu năng', '30 FPS', 'Trên cả hai console khi ra mắt, theo xác nhận hồi tháng 8/2026.'],
      ['Kiểu chơi', 'Một người, thế giới mở', 'Hai nhân vật chính Jason và Lucia. Chế độ online của GTA 6 chưa được công bố.'],
      ['Phân loại', 'ESRB: Mature', 'Bạo lực mạnh, ngôn ngữ thô tục, nội dung tình dục, ma túy và rượu bia.']
    ]
  },
  timeline: {
    eyebrow: 'Mốc thời gian', h: 'Từ lời xác nhận năm 2022 đến ngày ra mắt',
    lead: 'Hành trình dài của GTA 6, gồm cả hai lần dời lịch và những đợt rò rỉ.',
    items: [
      ['2/2022', 'Rockstar xác nhận đang phát triển', 'Trong bản cập nhật cộng đồng GTA V và GTA Online, hãng cho biết phần mới đang được phát triển tích cực.', 'done'],
      ['18/9/2022', 'Vụ rò rỉ lớn', 'Hàng chục video và ảnh từ bản dựng sớm lan truyền. Rockstar xác nhận bị xâm nhập mạng và bị lấy dữ liệu phát triển.', 'done'],
      ['12/2023', 'Trailer 1', 'Trailer đầu tiên bị lộ trước giờ nên Rockstar đăng sớm lên kênh chính thức, giới thiệu Lucia, Jason và Vice City trở lại.', 'done'],
      ['5/2024', 'Take-Two nêu cửa sổ mùa thu 2025', 'Báo cáo tài chính của Take-Two lần đầu nói rõ game dự kiến ra mắt vào mùa thu 2025.', 'done'],
      ['6/5/2025', 'Trailer 2', 'Mở rộng bức tranh về Leonida và mối quan hệ của hai nhân vật chính. Video đạt khoảng 475 triệu lượt xem trong 24 giờ trên các nền tảng.', 'done'],
      ['5/2025', 'Hoãn lần 1', 'Lịch ra mắt dời từ mùa thu 2025 sang 26/5/2026.', 'done'],
      ['11/2025', 'Hoãn lần 2, chốt 19/11/2026', 'Rockstar xin lỗi vì kéo dài thời gian chờ và cho biết cần thêm vài tháng để hoàn thiện game.', 'done'],
      ['25/6/2026', 'Mở đặt trước', 'Công bố giá 79,99 và 99,99 USD, gói Vintage Vice City Pack và bản hộp chỉ chứa mã tải. Take-Two gọi doanh số đặt trước là chưa từng có.', 'done'],
      ['27/8/2026', 'Extended Look', 'Video khoảng 26 phút công chiếu độc quyền trên Netflix rồi lên YouTube cùng ngày, quay hoàn toàn từ gameplay và cảnh cắt trên PS5.', 'done'],
      ['9/2026', 'Album nhạc và bộ sưu tập giới hạn', 'Rockstar công bố album chính thức 34 bài hát (phát hành 19/11) và bộ The Goodtime State – Vice City Collection giá 399,99 USD.', 'done'],
      ['12/11/2026', 'Bản hộp và tải trước', 'Bản hộp (chỉ có mã tải) có mặt, người đặt trước bản số có thể tải trước để chơi ngay khi game mở.', 'todo'],
      ['19/11/2026', 'Ngày ra mắt', 'Grand Theft Auto VI chính thức lên PS5 và Xbox Series X|S.', 'next']
    ]
  },
  story: {
    eyebrow: 'Cốt truyện & nhân vật', h: 'Jason, Lucia và những người xung quanh họ',
    lead: 'Rockstar mô tả hai nhân vật chính là những người luôn biết ván bài đã bị xếp sẵn chống lại mình. Khi một phi vụ dễ ăn đổ vỡ, họ rơi vào một âm mưu tội phạm trải khắp Leonida.',
    quote: 'the darkest side of the sunniest place in America', quoteBy: 'Mô tả chính thức của Rockstar Games',
    leads: [
      { role: 'Nhân vật chính', name: 'Jason Duval', p: ['Lớn lên giữa những kẻ lừa đảo. Theo hồ sơ nhân vật, anh từng đi lính rồi sa vào chạy ma túy cho các băng nhóm ở Leonida Keys.', 'Trong Extended Look, Jason nghiêng về súng đạn và các pha tẩu thoát, nhưng chưa rõ đây là đặc trưng cố định hay chỉ là cách chia vai của đoạn demo.'], tags: ['Quá khứ quân ngũ', 'Leonida Keys', 'Súng ống'] },
      { role: 'Nhân vật chính · nữ chính không tùy chọn đầu tiên của series', name: 'Lucia Caminos', p: ['Lớn lên ở Liberty City, mơ về cuộc sống tốt đẹp ở Leonida và vừa ra tù khi câu chuyện bắt đầu. Lucia coi Jason là lối thoát.', 'Cô vừa cầm lái trong các cuộc rượt đuổi vừa xử lý cận chiến: có cảnh tập tạ rồi đấm trực diện, có cảnh dùng giày cao gót trong một thao tác QTE.'], tags: ['Liberty City', 'Cận chiến', 'Lái xe'] }
    ],
    relation: 'Mối quan hệ của cặp đôi lấy cảm hứng từ Bonnie và Clyde. Người chơi có thể đi cùng hoặc tách ra làm việc riêng, đổi nhân vật gần như tức thì và nhân vật còn lại do AI điều khiển.',
    castH: 'Các nhân vật đã được giới thiệu',
    cast: [
      ['Cal Hampton', 'Bạn của Jason, sống khép kín và có thói quen nghe lén liên lạc của lực lượng tuần duyên.'],
      ['Boobie Ike', 'Huyền thoại của Vice City với đế chế gồm câu lạc bộ thoát y, bất động sản và phòng thu âm.'],
      ['Dre\'Quan Priest', 'Nghệ sĩ mới ký hợp đồng với Real Dimez, có liên hệ với câu lạc bộ của Boobie.'],
      ['Bae-Luxe và Roxy', 'Bộ đôi Real Dimez, bạn từ thời trung học, nổi tiếng trên mạng xã hội và có nhạc rap, ký với hãng Only Raw Records.'],
      ['Raul Bautista', 'Tay cướp ngân hàng lão luyện, duyên dáng và đang tìm người mới.'],
      ['Brian Heder', 'Người đàn ông lớn tuổi từng chạy ma túy trong thời hoàng kim buôn lậu ở Keys.']
    ],
    castNote: 'Rockstar chưa công bố dàn lồng tiếng chính thức. Diễn viên Stephen Root xác nhận có vai trong game, nhiều người đoán là Brian Heder nhưng vai cụ thể chưa được xác nhận.'
  },
  map: {
    eyebrow: 'Bản đồ Leonida', h: 'Sáu khu vực đã lộ diện',
    lead: 'Rockstar đã công bố tên sáu khu vực của Leonida cùng loạt ảnh chụp. Chưa có bản đồ đầy đủ chính thức, nên mọi bản vẽ lại của cộng đồng đều chỉ là suy đoán.',
    regions: [
      ['vice-city', 'Vice City', 'Gợi nhớ Miami', 'Trung tâm đô thị của Leonida: bãi biển, khu nghỉ dưỡng, phố đêm và ánh neon. Đây là lần đầu thành phố xuất hiện ở thời hiện đại, sau GTA Vice City (2002) đặt ở năm 1986. Trailer đã cho thấy các địa danh quen thuộc như Starfish Island.', '#ff4fa3'],
      ['leonida-keys', 'Leonida Keys', 'Gợi nhớ Florida Keys', 'Quần đảo du lịch với bãi biển, bến thuyền và các hoạt động nước. Đây cũng là nơi Jason từng chạy hàng cho các băng nhóm.', '#2de2e6'],
      ['grassrivers', 'Grassrivers', 'Gợi nhớ Everglades', 'Vùng đầm lầy ngập nước với cá sấu và cảnh lướt thuyền fanboat, xuất hiện trong Extended Look.', '#34d399'],
      ['port-gellhorn', 'Port Gellhorn', 'Thị trấn cảng', 'Khu cảng công nghiệp với nhiều nhà nghỉ rẻ tiền và câu lạc bộ thoát y.', '#ff9a3c'],
      ['ambrosia', 'Ambrosia', 'Nông thôn và công nghiệp', 'Vùng quê và khu công nghiệp, nơi hoạt động của một băng biker được giới thiệu trong trailer.', '#8b5cf6'],
      ['mount-kalaga', 'Mount Kalaga National Park', 'Vườn quốc gia', 'Khu hoang dã nhiều cây xanh ở phía bắc, đối lập với sự nhộn nhịp của Vice City.', '#a3e635']
    ],
    note: 'Quy mô: GamesRadar+ ước tính bản đồ lớn gấp khoảng ba lần Red Dead Redemption 2. Đây không phải số liệu chính thức từ Rockstar.'
  },
  gameplay: {
    eyebrow: 'Gameplay', h: 'Những thay đổi lớn nhất thấy trong Extended Look',
    lead: 'Extended Look là lần đầu Rockstar cho xem gameplay thật. Dưới đây là các thay đổi nổi bật, tổng hợp từ video và những phỏng vấn chính thức.',
    items: [
      ['Hai nhân vật, một cặp bài trùng', 'Jason và Lucia luôn yểm trợ nhau. Người chơi đổi nhân vật tức thì, nhân vật còn lại do AI điều khiển. Có nhiệm vụ Lucia lái xe còn Jason bắn qua cửa kính, có cảnh hai người chia tầng: Jason bắn từ trên, Lucia vật lộn tay không ở dưới.'],
      ['Hệ thống truy nã sáu sao được làm lại', 'Cảnh sát nhận dạng khuôn mặt, quần áo và chiếc xe của bạn. Muốn cắt đuôi phải đổi phương tiện và lẩn tránh thật sự, thang truy nã chuyển từ trắng sang đỏ khi bị phát hiện. Mọi tội ác còn tích lũy thành hồ sơ phạm tội của hai nhân vật, nhưng cách vận hành chi tiết vẫn được giữ kín.'],
      ['Cơ thể và thói quen ảnh hưởng ngoại hình', 'Theo phỏng vấn của Rockstar với Dazed, việc ăn uống, tập luyện và ngủ nghỉ sẽ thay đổi vóc dáng nhân vật. Trong video, trạng thái cặp đôi còn hiện bằng biểu tượng cảm xúc, ví dụ lúc hai người cãi nhau.'],
      ['Hoạt ảnh phục vụ lối chơi', 'Túi hàng là vật thể thật trong thế giới. Lucia có thể bắn shotgun một tay khi đang ôm nhiều túi, hay giấu khẩu súng sau lưng để bước vào cửa hàng mà không gây chú ý trước khi cướp.'],
      ['Trộm xe có chiều sâu hơn', 'Xe có nhiều lớp an ninh. Jason có thể mở khóa bằng slim jim hoặc đập kính, và với xe khó hơn cần công cụ phù hợp. Có cả rủi ro và phần thưởng cho từng lựa chọn.'],
      ['Rượt đuổi nhanh và nguy hiểm hơn', 'Camera sát xe, đường phố hẹp hơn và cảm giác tốc độ rõ rệt. Người chơi có thể bắn từ trong xe, nhắm vào trực thăng hay lốp xe cảnh sát. Ngoài ra là các hoạt động đua xe và thuyền lướt qua đầm lầy.'],
      ['Bắn súng và cận chiến mới', 'Có núp bắn và chế độ focus làm chậm thời gian, đánh dấu vùng yếu của đối thủ: vàng cho vị trí không gây chết người, đỏ cho đầu và ngực. Lucia còn dùng nắm đấm và các thao tác QTE trong giao tranh.'],
      ['Thế giới phản ứng với bạn', 'Rockstar cho biết NPC phản ứng và ghi nhớ hành động của người chơi. Khi cướp cửa hàng, người dân có thể tự chống trả. Theo phỏng vấn Game Informer (9/2026), thời tiết có nhiều trạng thái, từ bão đến cầu vồng. GamesRadar+ đếm được 17 hoạt động khác nhau trong riêng đoạn Extended Look.']
    ],
    actsH: 'Hoạt động phụ đã được xác nhận',
    acts: ['Bóng rổ', 'Lặn biển', 'Chèo kayak', 'Lướt jet ski', 'Thuyền fanboat qua đầm lầy', 'Đua xe đường phố', 'Đua địa hình', 'Nhảy dù và base jump', 'Tập gym', 'Đấu vật', 'Bi-a', 'Golf mini', 'Tham quan sở thú', 'Câu lạc bộ đêm'],
    actsNote: 'Danh sách tổng hợp từ Extended Look và phỏng vấn Game Informer tháng 9/2026.'
  },
  arsenal: {
    eyebrow: 'Xe & vũ khí', h: 'Những gì đã lộ diện trong trailer',
    lead: 'Tên xe và vũ khí dưới đây do giới biên tập nhận diện từ trailer, Extended Look và thông báo bản Ultimate. Tên chính thức có thể thay đổi khi game ra mắt.',
    tabs: [
      { id: 'xe', label: 'Xe & phương tiện', items: [
        ['Ubermacht Sentinel Classic', 'Xe cabrio xuất hiện nhiều lần trong Extended Look'], ['Declasse Tulip', 'Xe cơ bắp cổ điển'], ['Declasse Vamos', ''], ['Benefactor Schafter', 'Xe sedan trong cảnh rượt đuổi'],
        ['Bravado Buffalo (xe cảnh sát)', 'Xe của Vice Beach Police'], ['Brute Stockade', 'Xe bọc thép của Gruppe Sechs'], ['Declasse Burrito', 'Xe van'], ['Enus Jubilee', 'SUV sang trọng trong đoàn hộ tống VIP'],
        ['Tow Truck', 'Xe cứu hộ'], ['Mobility Scooter', 'Xe điện cho người đi lại khó khăn']] },
      { id: 'sung', label: 'Vũ khí', items: [
        ['Duke 556', 'Súng trường'], ['Duke Arms Company carbine', 'Súng trường'], ['Duke Arms Company special ops carbine', 'Súng trường'], ['Duke Arms Company assault sniper rifle', 'Súng bắn tỉa'],
        ['Moreland 850', 'Shotgun'], ['Pump Action Shotgun', 'Shotgun'], ['Double-barreled Shotgun', 'Shotgun hai nòng'], ['Capo', 'Súng ngắn'], ['Girardi ES9', 'Súng ngắn'],
        ['Klose K17', 'Súng ngắn'], ['Mustang .357', 'Súng ngắn'], ['Hawk & Little Morgan', 'Súng lục ổ xoay'], ['Grenade Launcher', 'Vũ khí nặng'], ['Molotov', 'Chất nổ'],
        ['Baseball Bat', 'Cận chiến'], ['Hammer', 'Cận chiến'], ['Minigolf Club', 'Cận chiến'], ['Pool Cue', 'Cận chiến'], ['Switchblade Knife', 'Cận chiến']] },
      { id: 'ult', label: 'Ultimate & đặt trước', items: [
        ['\'95 Grotti Cheetah', 'Ultimate · xe thể thao thập niên 90'], ['Vapid Ganado', 'Ultimate · xe bán tải của Jason, bản độ cổ điển'], ['Dinka Enduro', 'Ultimate · mô tô sơn rằn ri quân đội'],
        ['Crest Kayak', 'Ultimate · thuyền kayak'], ['Shitzu Squalo', 'Ultimate · xuồng máy'], ['Hawk & Little Morgan (cặp)', 'Ultimate · khắc tên J. Duval và L. Caminos'],
        ['Girardi ES9 và Klose K17 cá nhân hóa', 'Ultimate · súng riêng của Jason và Lucia'], ['Rideout Customs', 'Ultimate · tiệm độ xe, một trong hai tiệm dành riêng cho bản Ultimate'],
        ['\'55 Vapid Stanier hai tông màu', 'Vintage Vice City Pack · quà đặt trước'], ['Shore Court Garage', 'Vintage Vice City Pack · nhà xe ở Ocean Beach']] }
    ]
  },
  editions: {
    eyebrow: 'Phiên bản & giá', h: 'Chọn bản nào?',
    lead: 'Giá dưới đây tính bằng USD theo công bố của Rockstar. Giá tại Việt Nam và các khu vực khác phụ thuộc cửa hàng của từng nền tảng.',
    cards: [
      { name: 'Standard', price: '79,99 USD', badge: '', items: ['Game đầy đủ trên PS5 hoặc Xbox Series X|S', 'Vintage Vice City Pack khi đặt trước: xe \'55 Vapid Stanier hai tông màu, Shore Court Garage ở Ocean Beach, trang phục hoài cổ và một mẫu hoa văn vũ khí', 'Có thể nâng cấp lên Ultimate sau'] },
      { name: 'Ultimate', price: '99,99 USD', badge: 'Được chọn nhiều', hot: true, items: ['Tất cả nội dung của bản Standard', 'Bộ sưu tập xe, trang phục và vũ khí cá nhân hóa gắn với câu chuyện của Jason và Lucia', 'Hai tiệm độ xe chỉ mở cho bản Ultimate', 'Vintage Vice City Pack khi đặt trước'] },
      { name: 'The Goodtime State – Vice City Collection', price: '399,99 USD', badge: 'Giới hạn', items: ['Bộ sưu tập vật phẩm lấy cảm hứng từ chương trình truyền hình Macca the Gator', 'Gồm tượng Macca the Gator 6 inch, kính Oakley Frogskin GTA 6, mũ snapback và nhiều phụ kiện', 'Bán số lượng có hạn trên website của Rockstar'] }
    ],
    notes: [
      'Bản hộp chỉ chứa mã tải, không có đĩa. Bản số đặt trước có thể tải trước từ 12/11/2026.',
      'Take-Two gọi doanh số đặt trước là chưa từng có. Ước tính của Sensor Tower cho rằng khoảng 89% người đặt trước chọn Ultimate; đây không phải số liệu chính thức.'
    ],
    cta: 'Xem trang chính thức của Rockstar'
  },
  videos: {
    eyebrow: 'Video', h: 'Xem lại các đoạn giới thiệu chính thức',
    lead: 'Video chỉ tải từ YouTube khi bạn bấm phát, nên trang vẫn nhẹ. Extended Look bị YouTube giới hạn độ tuổi nên sẽ mở ở tab mới.',
    items: [
      ['tJbzMqJGH4k', 'Grand Theft Auto VI: An Extended Look', 'Khoảng 26 phút gameplay và cảnh cắt quay hoàn toàn trên PS5, công chiếu ngày 27/8/2026.', true],
      ['VQRLujxTm3c', 'Grand Theft Auto VI Trailer 2', 'Ra mắt ngày 6/5/2025, giới thiệu Leonida và mối quan hệ của Jason và Lucia.'],
      ['QdBZY2fkU-0', 'Grand Theft Auto VI Trailer 1', 'Trailer đầu tiên, đăng sớm vào tháng 12/2023 sau khi bị rò rỉ.']
    ].map(([id, t, d, ext]) => ({ id, t, d, ext: !!ext, thumb: YT(id) })),
    play: 'Phát video', watch: 'Xem trên YouTube'
  },
  history: {
    eyebrow: 'Lịch sử GTA', h: 'Gần 30 năm của series',
    lead: 'Từ góc nhìn trên cao năm 1997 đến Vice City hiện đại, các cột mốc giúp hiểu vì sao GTA 6 được mong chờ đến vậy.',
    items: [
      ['1997', 'Grand Theft Auto', 'Góc nhìn từ trên xuống', 'Do DMA Design phát triển. Mở ra công thức tự do phạm tội, bị truy nã và thoát thân.'],
      ['1999', 'Grand Theft Auto 2', 'Thành phố tương lai gần', 'Các băng đảng với hệ thống uy tín, trong một bối cảnh gần với tương lai.'],
      ['2001', 'Grand Theft Auto III', 'Bước sang 3D', 'Liberty City thế giới mở 3D, thay đổi cách cả ngành làm game hành động.'],
      ['2002', 'Grand Theft Auto: Vice City', 'Miami năm 1986', 'Bối cảnh thập niên 80 đậm chất neon, với Tommy Vercetti. Chính thành phố mà GTA 6 quay lại.'],
      ['2004', 'Grand Theft Auto: San Andreas', 'Ba thành phố năm 1992', 'Quy mô lớn hơn nhiều, thêm yếu tố nhập vai như ăn uống và tập luyện ảnh hưởng vóc dáng.'],
      ['2008', 'Grand Theft Auto IV', 'Liberty City thực tế hơn', 'Niko Bellic và tông truyện nghiêm túc, thế giới đặc kín hơn.'],
      ['2013', 'Grand Theft Auto V', 'Los Santos và GTA Online', 'Ba nhân vật chính đổi qua lại, kèm GTA Online. Take-Two cho biết game đã bán hơn 200 triệu bản.'],
      ['2026', 'Grand Theft Auto VI', 'Vice City và Leonida', 'Hai nhân vật chính, bản đồ lớn nhất series. Ra mắt 19/11/2026.', 'vi']
    ]
  },
  pending: {
    eyebrow: 'Còn chờ xác nhận', h: 'Những câu hỏi Rockstar chưa trả lời',
    lead: 'Trong vài tuần cuối trước ngày ra mắt, đây là các điểm OtaHub sẽ theo dõi và cập nhật vào trang này.',
    items: [
      ['Giờ mở bán chính xác', 'Mở đồng loạt trên toàn cầu hay lần lượt theo múi giờ. Đồng hồ đếm ngược ở đầu trang đang dùng hai giả định.'],
      ['Chế độ online', 'Chưa rõ GTA 6 có chế độ nhiều người chơi khi ra mắt hay không.'],
      ['Bản PC', 'Chưa có thông báo. Lịch sử của series cho thấy PC thường đến sau console hơn một năm.'],
      ['Ngôn ngữ và giá khu vực', 'Rockstar chưa công bố đầy đủ ngôn ngữ hỗ trợ và giá tại từng thị trường, trong đó có Việt Nam.'],
      ['Dung lượng tải trước', 'Chưa có con số chính thức cho gói tải trước 12/11.']
    ]
  },
  faq: {
    eyebrow: 'Hỏi đáp', h: 'Câu hỏi thường gặp về GTA 6',
    items: [
      ['GTA 6 ra mắt khi nào?', 'GTA 6 ra mắt ngày 19/11/2026 trên PS5 và Xbox Series X|S. Bản số đặt trước có thể tải trước từ 12/11/2026. Rockstar chưa công bố giờ mở bán, nên đồng hồ đếm ngược trên trang này dùng giả định 00:00 ngày 19/11.'],
      ['GTA 6 có bản PC không?', 'Rockstar chưa công bố bản PC. Các game trước của hãng lên PC sau console khá lâu: GTA IV khoảng 7 tháng, Red Dead Redemption 2 khoảng 13 tháng và GTA V khoảng 19 tháng.'],
      ['GTA 6 có trên PS4 và Xbox One không?', 'Không. Game chỉ dành cho PS5 và Xbox Series X|S.'],
      ['GTA 6 giá bao nhiêu?', 'Bản Standard giá 79,99 USD và bản Ultimate giá 99,99 USD. Bộ sưu tập The Goodtime State – Vice City Collection giá 399,99 USD, bán riêng với số lượng giới hạn.'],
      ['Bản hộp của GTA 6 có đĩa không?', 'Không. Bản hộp chỉ chứa mã tải trong hộp, không có đĩa.'],
      ['Chơi được mấy nhân vật?', 'Hai nhân vật chính là Jason Duval và Lucia Caminos. Người chơi đổi qua lại bất cứ lúc nào, nhân vật còn lại do AI điều khiển. Lucia là nữ chính không tùy chọn đầu tiên của series.'],
      ['Bản đồ GTA 6 lớn cỡ nào?', 'Rockstar chưa công bố diện tích. Đã biết sáu khu vực của bang Leonida, và GamesRadar+ ước tính bản đồ lớn gấp khoảng ba lần Red Dead Redemption 2.'],
      ['GTA 6 chạy bao nhiêu khung hình?', 'Game chạy 30 FPS trên cả hai console khi ra mắt.'],
      ['GTA 6 có chế độ online không?', 'Rockstar chưa công bố chế độ online của GTA 6.'],
      ['GTA 6 có tiếng Việt không?', 'Rockstar chưa công bố danh sách ngôn ngữ đầy đủ. OtaHub sẽ cập nhật ngay khi có xác nhận.']
    ]
  },
  news: { eyebrow: 'Tin OtaHub', h: 'Tổng hợp tin GTA 6 trên OtaHub', lead: 'Mọi bài về GTA 6 OtaHub đã đăng, mới nhất trước. Danh sách tự cập nhật khi có bài mới.', more: 'Xem thêm', date: 'vi-VN' },
  sources: {
    h: 'Nguồn tham khảo',
    p: 'OtaHub nghiên cứu, tổng hợp từ trang chính thức của Rockstar Games, thông cáo của Take-Two Interactive, Variety, Netflix Tudum, GamesRadar+, Game Informer, Dazed và các nguồn quốc tế khác. Thông tin có thể thay đổi trước ngày ra mắt; mục nào là suy đoán đều được ghi rõ. Hình ảnh thuộc bản quyền Rockstar Games, được dùng với mục đích thông tin. OtaHub không liên kết với Rockstar Games hay Take-Two.',
    links: [['Rockstar Games · GTA VI', 'https://www.rockstargames.com/VI']]
  },
  jsonName: 'Đếm ngược GTA 6'
};

export const en = {
  lang: 'en', htmlLang: 'en', path: '/en/gta-6-countdown', altPath: '/dem-nguoc-gta-6', home: '/en/',
  ui: { skip: 'Skip to content', updated: 'Updated', by: 'Researched & compiled by OtaHub', crumbHome: 'Home', crumbSec: 'Gaming', secUrl: '/en/gaming',
    readMore: 'Read', official: 'Rockstar official page' },
  meta: {
    title: 'GTA 6 Countdown: Everything to Know Before Nov 19',
    description: 'OtaHub researched and compiled GTA 6: live countdown, release date, price, Leonida map, characters, gameplay, cars and weapons revealed so far.',
    ogImage: 'https://otahub.asia/assets/img/gta6-official-art.jpg',
    keywords: 'GTA 6, GTA VI, GTA 6 countdown, GTA 6 release date, GTA 6 price, Leonida map, Vice City, Jason Lucia, Rockstar Games'
  },
  hero: {
    kicker: 'GTA 6 Countdown',
    title: 'GTA <em>VI</em>',
    sub: 'Grand Theft Auto VI launches on November 19, 2026 for PS5 and Xbox Series X|S. OtaHub researched and compiled everything Rockstar has confirmed: story, the Leonida map, gameplay, price and editions.',
    units: { d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' },
    note: 'Rockstar has not announced an official launch time. Pick an assumption:',
    optVN: '00:00 Vietnam time', optUS: '00:00 US Eastern',
    launched: 'GTA VI is out. Enjoy the ride!',
    cta1: ['Watch the Extended Look', '#video'], cta2: ['Quick facts', '#nhanh']
  },
  chips: [['tong-quan', 'Overview'], ['nhanh', 'Quick facts'], ['moc', 'Timeline'], ['nhan-vat', 'Story & characters'], ['ban-do', 'Leonida map'],
    ['gameplay', 'Gameplay'], ['kho', 'Cars & weapons'], ['phien-ban', 'Editions & price'], ['video', 'Videos'], ['lich-su', 'GTA history'], ['cho', 'Still unconfirmed'], ['faq', 'FAQ'], ['tin', 'OtaHub coverage']],
  intro: {
    eyebrow: 'Overview', h: 'Why is GTA 6 the biggest event in gaming this year?',
    p: [
      'Grand Theft Auto VI is Rockstar Games\' open-world crime game, taking players back to Vice City in the fictional state of Leonida, a region inspired by Florida. It is the first mainline entry since GTA V (2013), a wait of more than 13 years.',
      'After two delays, the game is set for November 19, 2026 on PS5 and Xbox Series X|S. The roughly 26-minute Extended Look on August 27, 2026, captured entirely on PS5, was Rockstar\'s first look at real gameplay rather than cinematic trailers alone.',
      'This page collects what Rockstar has confirmed or shown directly in official video, marks clearly what is still speculation, and will be updated as new information arrives.'
    ],
    img: '/assets/img/gta6-official-art.jpg', alt: 'Official Grand Theft Auto VI artwork featuring Jason, Lucia and supporting characters', cap: 'Image: Rockstar Games.', iw: 1200, ih: 630
  },
  facts: {
    eyebrow: 'Quick facts', h: 'GTA 6 on one screen',
    items: [
      ['Release date', 'Nov 19, 2026', 'Rockstar has not announced the launch time.'],
      ['Platforms', 'PS5 · Xbox Series X|S', 'No PS4 or Xbox One. The official page says the game plays best on PS5.'],
      ['PC', 'Not announced', 'No PC version or date yet. Earlier GTA games reached PC 7 to 19 months after consoles.'],
      ['Developer / publisher', 'Rockstar Games / Take-Two', 'The parent company is Take-Two Interactive.'],
      ['Price', '$79.99 / $99.99', 'Standard and Ultimate editions. Pre-orders opened June 25, 2026.'],
      ['Performance', '30 FPS', 'On both consoles at launch, confirmed in August 2026.'],
      ['Play style', 'Single-player, open world', 'Two protagonists, Jason and Lucia. A GTA 6 online mode has not been announced.'],
      ['Rating', 'ESRB: Mature', 'Intense violence, strong language, sexual content, drugs and alcohol.']
    ]
  },
  timeline: {
    eyebrow: 'Timeline', h: 'From the 2022 confirmation to launch day',
    lead: 'GTA 6\'s long road, including two delays and several leaks.',
    items: [
      ['Feb 2022', 'Rockstar confirms development', 'In a GTA V and GTA Online community update, the studio said the next game was in active development.', 'done'],
      ['Sep 18, 2022', 'The big leak', 'Dozens of videos and screenshots from an early build spread online. Rockstar confirmed a network intrusion and the theft of development data.', 'done'],
      ['Dec 2023', 'Trailer 1', 'The first trailer leaked early, so Rockstar posted it on its official channel ahead of schedule, introducing Lucia, Jason and a returning Vice City.', 'done'],
      ['May 2024', 'Take-Two names a fall 2025 window', 'Take-Two\'s financial report first said the game was expected in fall 2025.', 'done'],
      ['May 6, 2025', 'Trailer 2', 'Expanded on Leonida and the relationship between the two leads. The video drew roughly 475 million views in 24 hours across platforms.', 'done'],
      ['May 2025', 'First delay', 'The release moved from fall 2025 to May 26, 2026.', 'done'],
      ['Nov 2025', 'Second delay, set for Nov 19, 2026', 'Rockstar apologized for the longer wait and said it needed a few more months to finish the game.', 'done'],
      ['Jun 25, 2026', 'Pre-orders open', 'Prices of $79.99 and $99.99 were announced along with the Vintage Vice City Pack and a physical box that holds only a download code. Take-Two called pre-order sales unprecedented.', 'done'],
      ['Aug 27, 2026', 'Extended Look', 'A roughly 26-minute video premiered exclusively on Netflix and reached YouTube the same day, captured entirely from gameplay and cutscenes on PS5.', 'done'],
      ['Sep 2026', 'Soundtrack album and limited collection', 'Rockstar announced a 34-track official album (out November 19) and The Goodtime State – Vice City Collection at $399.99.', 'done'],
      ['Nov 12, 2026', 'Physical copies and pre-load', 'Boxed copies (download code only) arrive, and digital pre-orders can pre-load to play the moment the game opens.', 'todo'],
      ['Nov 19, 2026', 'Launch day', 'Grand Theft Auto VI arrives on PS5 and Xbox Series X|S.', 'next']
    ]
  },
  story: {
    eyebrow: 'Story & characters', h: 'Jason, Lucia and the people around them',
    lead: 'Rockstar describes the leads as people who have always known the deck is stacked against them. When an easy score goes wrong, they are pulled into a criminal conspiracy stretching across Leonida.',
    quote: 'the darkest side of the sunniest place in America', quoteBy: 'Official description, Rockstar Games',
    leads: [
      { role: 'Protagonist', name: 'Jason Duval', p: ['He grew up around grifters. According to his character profile, he served in the military and then ran drugs for gangs in the Leonida Keys.', 'In the Extended Look Jason leans toward guns and getaways, though it is unclear whether that is a fixed trait or just how the demo split the roles.'], tags: ['Military past', 'Leonida Keys', 'Gunplay'] },
      { role: 'Protagonist · the series\' first non-optional female lead', name: 'Lucia Caminos', p: ['She grew up in Liberty City, dreams of the good life in Leonida and is fresh out of prison when the story starts. Lucia sees Jason as her way out.', 'She drives in chases and handles close combat: one clip has her lifting weights and then brawling, another uses a high heel in a quick-time event.'], tags: ['Liberty City', 'Melee', 'Driving'] }
    ],
    relation: 'The duo is inspired by Bonnie and Clyde. Players can stay together or split up, switch characters almost instantly, and the other character is controlled by AI.',
    castH: 'Characters introduced so far',
    cast: [
      ['Cal Hampton', 'Jason\'s friend, a homebody with a habit of listening in on Coast Guard comms.'],
      ['Boobie Ike', 'A Vice City legend whose empire spans a strip club, real estate and a recording studio.'],
      ['Dre\'Quan Priest', 'An up-and-coming artist signed to Real Dimez, tied to Boobie\'s club.'],
      ['Bae-Luxe and Roxy', 'The duo Real Dimez, friends since high school, known for social media and rap, signed to Only Raw Records.'],
      ['Raul Bautista', 'A charming, experienced bank robber looking for new talent.'],
      ['Brian Heder', 'An older man with a history of drug running from the golden age of smuggling in the Keys.']
    ],
    castNote: 'Rockstar has not announced an official voice cast. Actor Stephen Root confirmed he has a role in the game and many guess it is Brian Heder, but the specific part is not confirmed.'
  },
  map: {
    eyebrow: 'Leonida map', h: 'Six regions revealed',
    lead: 'Rockstar has named six regions of Leonida and released a set of screenshots. There is no official full map yet, so every community redraw is speculation.',
    regions: [
      ['vice-city', 'Vice City', 'Echoes of Miami', 'Leonida\'s urban heart: beaches, resorts, nightlife and neon. This is the city\'s first appearance in the modern day, after GTA Vice City (2002) set in 1986. Trailers have shown familiar spots such as Starfish Island.', '#ff4fa3'],
      ['leonida-keys', 'Leonida Keys', 'Echoes of the Florida Keys', 'A tourist archipelago of beaches, marinas and water activities. It is also where Jason once ran cargo for gangs.', '#2de2e6'],
      ['grassrivers', 'Grassrivers', 'Echoes of the Everglades', 'Flooded swampland with alligators and fanboat rides, seen in the Extended Look.', '#34d399'],
      ['port-gellhorn', 'Port Gellhorn', 'Port town', 'An industrial harbor area packed with cheap motels and strip clubs.', '#ff9a3c'],
      ['ambrosia', 'Ambrosia', 'Rural and industrial', 'Countryside and industrial land, home to a biker gang introduced in the trailers.', '#8b5cf6'],
      ['mount-kalaga', 'Mount Kalaga National Park', 'National park', 'A wilderness full of greenery in the north, a contrast to the bustle of Vice City.', '#a3e635']
    ],
    note: 'Scale: GamesRadar+ estimates the map at about three times the size of Red Dead Redemption 2. That is not an official figure from Rockstar.'
  },
  gameplay: {
    eyebrow: 'Gameplay', h: 'The biggest changes seen in the Extended Look',
    lead: 'The Extended Look was Rockstar\'s first real gameplay showing. These are the standout changes, compiled from the video and official interviews.',
    items: [
      ['Two leads, one partnership', 'Jason and Lucia cover each other constantly. Players switch characters instantly while AI runs the other. In one mission Lucia drives while Jason shoots out the window; in another they split a building, Jason firing from above while Lucia brawls bare-handed below.'],
      ['A rebuilt six-star wanted system', 'Police identify your face, clothes and car. To lose them you need to swap vehicles and truly evade, and the wanted meter turns from white to red once you are spotted. Crimes also build a criminal profile for each character, though how it works is still under wraps.'],
      ['Body and habits change appearance', 'According to Rockstar\'s interview with Dazed, eating, exercise and sleep will change a character\'s physique. In the video, the couple\'s mood even shows up as emoji, for example during an argument.'],
      ['Animations that serve gameplay', 'Loot bags are physical objects in the world. Lucia can fire a shotgun one-handed while carrying several bags, or hide a pistol behind her back to walk into a store without alarming anyone before robbing it.'],
      ['Deeper car theft', 'Cars have layers of security. Jason can slim-jim a lock or smash the window, and harder cars need the right tools. Each choice carries its own risk and reward.'],
      ['Faster, more dangerous chases', 'A tight camera, narrower streets and a real sense of speed. Players can shoot from inside the car, targeting helicopters or police tires. Elsewhere there are racing activities and boats gliding through swamps.'],
      ['New shooting and melee', 'Cover shooting plus a slow-motion focus mode that marks weak points: yellow for non-lethal spots, red for head and chest. Lucia also fights with fists and quick-time events.'],
      ['A world that reacts to you', 'Rockstar says NPCs react to and remember your actions. Civilians may fight back during store robberies. In its September 2026 Game Informer interview, Rockstar describes weather states ranging from hurricanes to rainbows. GamesRadar+ counted 17 different activities in the Extended Look alone.']
    ],
    actsH: 'Confirmed side activities',
    acts: ['Basketball', 'Scuba diving', 'Kayaking', 'Jet skiing', 'Fanboat rides through the swamp', 'Street racing', 'Off-road racing', 'Skydiving and base jumping', 'Gym workouts', 'Wrestling', 'Pool', 'Mini-golf', 'Zoo visits', 'Nightclubs'],
    actsNote: 'Compiled from the Extended Look and the September 2026 Game Informer interview.'
  },
  arsenal: {
    eyebrow: 'Cars & weapons', h: 'What has surfaced in the trailers',
    lead: 'Vehicle and weapon names below were identified by editors from trailers, the Extended Look and the Ultimate Edition announcement. Final names may change at launch.',
    tabs: [
      { id: 'xe', label: 'Cars & vehicles', items: [
        ['Ubermacht Sentinel Classic', 'Convertible seen repeatedly in the Extended Look'], ['Declasse Tulip', 'Classic muscle car'], ['Declasse Vamos', ''], ['Benefactor Schafter', 'Sedan in a chase scene'],
        ['Bravado Buffalo (police)', 'Vice Beach Police cruiser'], ['Brute Stockade', 'Gruppe Sechs armored truck'], ['Declasse Burrito', 'Van'], ['Enus Jubilee', 'Luxury SUV in a VIP convoy'],
        ['Tow Truck', 'Recovery truck'], ['Mobility Scooter', 'Electric scooter']] },
      { id: 'sung', label: 'Weapons', items: [
        ['Duke 556', 'Assault rifle'], ['Duke Arms Company carbine', 'Assault rifle'], ['Duke Arms Company special ops carbine', 'Assault rifle'], ['Duke Arms Company assault sniper rifle', 'Sniper rifle'],
        ['Moreland 850', 'Shotgun'], ['Pump Action Shotgun', 'Shotgun'], ['Double-barreled Shotgun', 'Shotgun'], ['Capo', 'Pistol'], ['Girardi ES9', 'Pistol'],
        ['Klose K17', 'Pistol'], ['Mustang .357', 'Pistol'], ['Hawk & Little Morgan', 'Revolver'], ['Grenade Launcher', 'Heavy weapon'], ['Molotov', 'Explosive'],
        ['Baseball Bat', 'Melee'], ['Hammer', 'Melee'], ['Minigolf Club', 'Melee'], ['Pool Cue', 'Melee'], ['Switchblade Knife', 'Melee']] },
      { id: 'ult', label: 'Ultimate & pre-order', items: [
        ['\'95 Grotti Cheetah', 'Ultimate · 1990s sports car'], ['Vapid Ganado', 'Ultimate · Jason\'s pickup with a retro build'], ['Dinka Enduro', 'Ultimate · motorcycle in army fatigue livery'],
        ['Crest Kayak', 'Ultimate · kayak'], ['Shitzu Squalo', 'Ultimate · motorboat'], ['Hawk & Little Morgan (pair)', 'Ultimate · engraved J. Duval and L. Caminos'],
        ['Personalized Girardi ES9 and Klose K17', 'Ultimate · Jason\'s and Lucia\'s own pistols'], ['Rideout Customs', 'Ultimate · custom shop, one of two shops exclusive to Ultimate'],
        ['\'55 Vapid Stanier two-tone', 'Vintage Vice City Pack · pre-order bonus'], ['Shore Court Garage', 'Vintage Vice City Pack · garage on Ocean Beach']] }
    ]
  },
  editions: {
    eyebrow: 'Editions & price', h: 'Which edition to pick?',
    lead: 'Prices below are in USD as announced by Rockstar. Prices in Vietnam and other regions depend on each platform\'s store.',
    cards: [
      { name: 'Standard', price: '$79.99', badge: '', items: ['The full game on PS5 or Xbox Series X|S', 'Vintage Vice City Pack with pre-order: a two-tone \'55 Vapid Stanier, Shore Court Garage on Ocean Beach, throwback outfits and a weapon pattern', 'Upgrade to Ultimate later'] },
      { name: 'Ultimate', price: '$99.99', badge: 'Most picked', hot: true, items: ['Everything in Standard', 'A collection of vehicles, apparel and personalized weapons tied to Jason and Lucia\'s story', 'Two vehicle customization shops exclusive to Ultimate', 'Vintage Vice City Pack with pre-order'] },
      { name: 'The Goodtime State – Vice City Collection', price: '$399.99', badge: 'Limited', items: ['Collectibles inspired by the in-world TV show Macca the Gator', 'Includes a 6-inch Macca the Gator figure, GTA 6 Oakley Frogskin sunglasses, a snapback hat and more', 'Sold in limited quantities on Rockstar\'s website'] }
    ],
    notes: [
      'The physical edition is a box with a download code only, no disc. Digital pre-orders can pre-load from November 12, 2026.',
      'Take-Two called pre-order sales unprecedented. A Sensor Tower estimate says roughly 89% of pre-orders chose Ultimate; that is not an official figure.'
    ],
    cta: 'Open Rockstar\'s official page'
  },
  videos: {
    eyebrow: 'Videos', h: 'Rewatch the official reveals',
    lead: 'Videos only load from YouTube when you press play, so the page stays light. The Extended Look is age-restricted on YouTube, so it opens in a new tab.',
    items: [
      ['tJbzMqJGH4k', 'Grand Theft Auto VI: An Extended Look', 'About 26 minutes of gameplay and cutscenes captured entirely on PS5, premiered August 27, 2026.', true],
      ['VQRLujxTm3c', 'Grand Theft Auto VI Trailer 2', 'Released May 6, 2025, introducing Leonida and the bond between Jason and Lucia.'],
      ['QdBZY2fkU-0', 'Grand Theft Auto VI Trailer 1', 'The first trailer, posted early in December 2023 after it leaked.']
    ].map(([id, t, d, ext]) => ({ id, t, d, ext: !!ext, thumb: YT(id) })),
    play: 'Play video', watch: 'Watch on YouTube'
  },
  history: {
    eyebrow: 'GTA history', h: 'Nearly 30 years of the series',
    lead: 'From the top-down view of 1997 to a modern Vice City, these milestones explain why GTA 6 is so anticipated.',
    items: [
      ['1997', 'Grand Theft Auto', 'Top-down view', 'Built by DMA Design. It set the formula of free-roaming crime, wanted levels and escapes.'],
      ['1999', 'Grand Theft Auto 2', 'Near-future city', 'Rival gangs with a respect system in a setting close to the future.'],
      ['2001', 'Grand Theft Auto III', 'The leap to 3D', 'A 3D open-world Liberty City that changed how the industry made action games.'],
      ['2002', 'Grand Theft Auto: Vice City', 'Miami in 1986', 'A neon-soaked 1980s setting starring Tommy Vercetti. The very city GTA 6 returns to.'],
      ['2004', 'Grand Theft Auto: San Andreas', 'Three cities in 1992', 'A far larger scale, adding RPG touches such as eating and working out affecting physique.'],
      ['2008', 'Grand Theft Auto IV', 'A grittier Liberty City', 'Niko Bellic and a serious tone, in a denser world.'],
      ['2013', 'Grand Theft Auto V', 'Los Santos and GTA Online', 'Three leads you swap between, plus GTA Online. Take-Two says it has sold more than 200 million copies.'],
      ['2026', 'Grand Theft Auto VI', 'Vice City and Leonida', 'Two leads and the series\' largest map. Launches November 19, 2026.', 'vi']
    ]
  },
  pending: {
    eyebrow: 'Still unconfirmed', h: 'Questions Rockstar has not answered',
    lead: 'In the final weeks before launch, these are the points OtaHub is tracking and will add to this page.',
    items: [
      ['Exact launch time', 'Whether the game unlocks worldwide at once or time zone by time zone. The countdown at the top uses two assumptions.'],
      ['Online mode', 'It is unclear whether GTA 6 has a multiplayer mode at launch.'],
      ['PC version', 'Nothing announced. The series\' history suggests PC arrives more than a year after consoles.'],
      ['Languages and regional pricing', 'Rockstar has not published the full language list or prices for each market, including Vietnam.'],
      ['Pre-load size', 'No official figure for the November 12 pre-load package yet.']
    ]
  },
  faq: {
    eyebrow: 'FAQ', h: 'GTA 6 frequently asked questions',
    items: [
      ['When does GTA 6 release?', 'GTA 6 launches on November 19, 2026 on PS5 and Xbox Series X|S. Digital pre-orders can pre-load from November 12, 2026. Rockstar has not announced the launch time, so the countdown on this page assumes 00:00 on November 19.'],
      ['Is GTA 6 coming to PC?', 'Rockstar has not announced a PC version. Its earlier games reached PC well after consoles: GTA IV in about 7 months, Red Dead Redemption 2 in about 13 and GTA V in about 19.'],
      ['Is GTA 6 on PS4 and Xbox One?', 'No. The game is only for PS5 and Xbox Series X|S.'],
      ['How much does GTA 6 cost?', 'The Standard Edition is $79.99 and the Ultimate Edition is $99.99. The Goodtime State – Vice City Collection costs $399.99 and is sold separately in limited quantities.'],
      ['Does the physical edition include a disc?', 'No. The physical edition is a box with a download code inside and no disc.'],
      ['How many characters can I play?', 'Two protagonists, Jason Duval and Lucia Caminos. You can switch at any time while AI runs the other. Lucia is the series\' first non-optional female lead.'],
      ['How big is the GTA 6 map?', 'Rockstar has not announced the size. Six regions of Leonida are known, and GamesRadar+ estimates the map at about three times the size of Red Dead Redemption 2.'],
      ['What frame rate does GTA 6 run at?', 'The game runs at 30 FPS on both consoles at launch.'],
      ['Does GTA 6 have an online mode?', 'Rockstar has not announced an online mode for GTA 6.'],
      ['Does GTA 6 support Vietnamese?', 'Rockstar has not published the full language list. OtaHub will update this as soon as it is confirmed.']
    ]
  },
  news: { eyebrow: 'OtaHub coverage', h: 'All GTA 6 news on OtaHub', lead: 'Every GTA 6 article OtaHub has published, newest first. The list updates itself as new articles arrive.', more: 'Show more', date: 'en-US' },
  sources: {
    h: 'Sources',
    p: 'Researched and compiled by OtaHub from Rockstar Games\' official page, Take-Two Interactive announcements, Variety, Netflix Tudum, GamesRadar+, Game Informer, Dazed and other international outlets. Details may change before launch, and anything speculative is labeled. Images belong to Rockstar Games and are used for informational purposes. OtaHub is not affiliated with Rockstar Games or Take-Two.',
    links: [['Rockstar Games · GTA VI', 'https://www.rockstargames.com/VI']]
  },
  jsonName: 'GTA 6 Countdown'
};
