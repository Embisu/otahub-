/* Phân loại bài cho trang chuyên mục Gaming / Anime / Manga — DÙNG CHUNG cho trang admin (trình duyệt)
   và scripts/sync-hub-articles.mjs (Node).
   Mỗi bài có đúng 1 chuyên mục (hub), 1 mục con (type) và (Gaming/Manga) 1 nhóm phụ (facet), lưu trong bài:
     <meta name="otahub:hub" content="game|anime|manga">
     <meta name="otahub:type" content="...">
     <meta name="otahub:facet" content="...">
   suggest() chỉ là GỢI Ý cho bài chưa có meta; biên tập viên chọn lại trong admin nếu cần. */
(function (root) {
  var R = function (s) { return new RegExp(s, 'i'); };
  // Thứ tự xét: Đánh giá -> Góc nhìn (dấu hiệu mạnh) -> Top List -> luật trước (pre) -> Tin tức ưu tiên (news)
  //             -> luật chuyên mục (rules) -> Góc nhìn (dấu hiệu yếu) -> Tin tức
  var REVIEW = R('\\breview\\b|đánh giá(?! cao)|chấm điểm');
  var FEATURE_STRONG = R('vì sao|tại sao|\\bwhy\\b|bài học|\\blessons\\b|phân tích|analysis|explained|giải thích|so sánh|\\bcompared?\\b');
  var TOPLIST = R('^(top ?\\d+|\\d+ (game|anime|manga|manhwa|bộ|tựa|phim|titles|series|games))|\\btop \\d+|\\bbest \\d+|đáng (chơi|xem|đọc)|nên (chơi|xem|đọc)|worth (playing|watching|reading)|có (anime|game|manga) nào|cao nhất|hay nhất|highest[- ]rated|best[- ]rated|quảng bá \\d+|promoted \\d+');
  var FEATURE_WEAK = R('góc nhìn|nhìn lại|đằng sau|behind the|ý nghĩa|khi .+ trở thành|when .+ becomes|liệu .+ có|dấu ấn|điều gì|what .+ (planning|preparing)|bí mật thế giới|giấc mơ|\\bdream\\b');

  var T = {
    game: {
      vi: 'Gaming', en: 'Gaming',
      types: [['tin-tuc', 'Tin tức', 'News'], ['ra-mat', 'Ra mắt & Trailer', 'Releases & Trailers'], ['danh-gia', 'Đánh giá', 'Reviews'],
        ['huong-dan', 'Hướng dẫn', 'Guides'], ['esports', 'Esports', 'Esports'], ['goc-nhin', 'Góc nhìn', 'Features'], ['top-list', 'Top List', 'Top Lists']],
      facetLabel: ['Nền tảng', 'Platform'],
      facets: [['pc', 'PC / Console', 'PC / Console'], ['mobile', 'Mobile', 'Mobile'], ['multi', 'Đa nền tảng', 'Cross-platform']],
      pre: [
        ['esports', R('esports|e-sports|giải đấu|tournament|championship|champions\\b|\\bvct\\b|\\blck\\b|\\bmsi\\b|\\bworlds\\b|asian games|pubg asia|\\bmpl\\b|\\bevo\\b|world tour|án cấm|cấm vĩnh viễn|tuyển thủ|chiêu mộ|chieu mo|đội tuyển|roster|\\bbanned\\b|himass|recruit')],
        ['huong-dan', R('hướng dẫn|\\bguide\\b|tier ?list|build (nhân vật|đồ|meta)|\\bbuilds\\b|cách chơi|mẹo|\\btips\\b|walkthrough|reroll|tân thủ|beginner|đội hình meta|meta team|best team|meta 20\\d\\d|đi rừng')]
      ],
      news: R('cập nhật|\\bupdate\\b|bản \\d+\\.\\d|version \\d|\\b\\d\\.\\d\\b|\\bpatch\\b|tăng giá|price (hike|increase)|thông số|\\bspecs?\\b|doanh số|lượt tải|downloads|\\bdừng\\b|hủy|cancel|mùa mới|season pass|\\bdlc\\b|crossover|sự kiện|\\bevent\\b|game pass|ps plus|playstation plus|title update|tarnished pack'),
      rules: [
        ['ra-mat', R('trailer|teaser|công bố|announce|reveal|hé lộ|lộ diện|ra mắt|launch|ấn định|phát hành|release|state of play|showcase|direct\\b|gamescom|tokyo game show|\\btgs\\b|đặt trước|pre-?order|pre-?install|\\bdemo\\b|\\bbeta\\b|trì hoãn|delay|rò rỉ|leak|gold\\b|chơi thử|playtest|mở bán|on sale|lên switch|đổ bộ|cập bến|game mới|new game|extended look|gameplay')]
      ]
    },
    anime: {
      vi: 'Anime', en: 'Anime',
      types: [['tin-tuc', 'Tin tức', 'News'], ['lich-chieu', 'Lịch chiếu & Công bố', 'Schedule & Announcements'], ['phim-rap', 'Phim chiếu rạp', 'Films'],
        ['danh-gia', 'Đánh giá', 'Reviews'], ['goc-nhin', 'Góc nhìn', 'Features'], ['top-list', 'Top List', 'Top Lists']],
      facetLabel: null, facets: [],
      pre: [],
      news: R('kỷ niệm|anniversary|giải thưởng|\\bawards?\\b|triển lãm|exhibition|thú nhận|tạm ngừng|tạm ngưng|hiatus|phát lại|rerun|sự kiện|\\bfes\\b|festival'),
      rules: [
        ['phim-rap', R('\\bmovie\\b|the movie|phim điện ảnh|điện ảnh|chiếu rạp|rạp|box office|doanh thu|phòng vé|\\bfilm\\b|theatrical|cinema')],
        ['lich-chieu', R('lên sóng|phát sóng|premiere|lịch chiếu|ấn định|ra mắt|\\bmùa \\d|season \\d|\\bcour\\b|tập cuối|công bố|announce|chuyển thể|adaptation|teaser|trailer|visual|\\bpv\\b|\\bairs?\\b|air date|\\bs\\d\\b|trở lại|returns|confirm|xác nhận|sản xuất|in production|20(26|27)|tháng \\d+|opening|ending|\\bop\\b|\\bed\\b')]
      ]
    },
    manga: {
      vi: 'Manga', en: 'Manga',
      types: [['tin-tuc', 'Tin tức', 'News'], ['chuong-moi', 'Chương mới & Spoiler', 'Chapters & Spoilers'], ['chuyen-the', 'Chuyển thể', 'Adaptations'],
        ['danh-gia', 'Đánh giá', 'Reviews'], ['goc-nhin', 'Góc nhìn', 'Features'], ['top-list', 'Top List', 'Top Lists']],
      facetLabel: ['Xuất xứ', 'Origin'],
      facets: [['manga', 'Manga (Nhật)', 'Manga (Japan)'], ['manhwa', 'Manhwa (Hàn)', 'Manhwa (Korea)'], ['manhua', 'Manhua (Trung)', 'Manhua (China)']],
      pre: [
        ['chuong-moi', R('chương \\d|chapter \\d|spoiler|chương mới|\\braw\\b|chương cuối|final chapter|storyboard|lộ thêm sức mạnh|reveals more')]
      ],
      news: R('bản quyền|licens|anime nyc|anime expo|\\bsdcc\\b|eisner|hall of fame|simulcast|đọc miễn phí|read free|crunchyroll manga'),
      rules: [
        ['chuyen-the', R('\\banime\\b|live-action|người đóng|chuyển thể|adaptation|phim\\b|\\bfilm\\b|\\bmovie\\b|tv anime')]
      ]
    }
  };
  var PLATFORM = {
    mobile: R('mobile|android|\\bios\\b|gacha|genshin|honkai|star rail|wuthering|zenless|honor of kings|pubg mobile|free fire|liên quân|mobile legends|arknights|blue archive|nikke|solo leveling:? arise|girls.? frontline|aniimo|uma ?musume|fate/grand|pok[eé]mon go|wild rift|kaiju no\\.? ?8 the game|golden spirit|suikoden star leap|blue protocol|tower of fantasy|neverness|ananta|duet night|azur lane|epic seven|reverse: ?1999|limbus|delta force|dynamite blue'),
    pc: R('\\bpc\\b|steam|ps5|ps4|playstation|xbox|switch|nintendo|console|game pass|epic games|unreal|remaster|remake|elden|monster hunter|metal gear|silent hill|gears of war|wolverine|witcher|cyberpunk|death stranding|ghost of|split fiction|hollow knight|black myth|kingdom come|space marine|mafia|resident evil|final fantasy|persona|zelda|mario|tekken|street fighter|marvel|stellar blade|gta|halo|diablo|minecraft|crimson desert|sparking zero|star wars|call of duty|\\bcod\\b|battlefield|assassin|valorant|delta force'),
    notGame: R('lego|thẻ pok[eé]mon|pok[eé]mon card|games expo|hamlet')
  };
  var ORIGIN = {
    manhua: R('manhua|donghua|battle through|martial peak|swallowed star|wu shen|urban immortal|soul land|tales of demons'),
    manhwa: R('manhwa|webtoon|solo leveling|beginning after the end|tbate|omniscient|tower of god|naver|kakao|tapas|second life ranker|god of blackfield|lookism|eleceed|nano machine|return of the mount hua')
  };

  function suggest(hub, text, opts) {
    var H = T[hub]; if (!H) return null;
    var t = String(text || '');
    var first = function (rules) { var h = rules.filter(function (r) { return r[1].test(t); })[0]; return h && h[0]; };
    var type = (opts && opts.isReview) || REVIEW.test(t) ? 'danh-gia'
      : FEATURE_STRONG.test(t) ? 'goc-nhin'
      : TOPLIST.test(t) ? 'top-list'
      : first(H.pre) || (H.news.test(t) ? 'tin-tuc' : null) || first(H.rules) || (FEATURE_WEAK.test(t) ? 'goc-nhin' : 'tin-tuc');
    var facet = '';
    if (hub === 'game') {
      var m = PLATFORM.mobile.test(t), p = PLATFORM.pc.test(t);
      facet = m && p ? 'multi' : m ? 'mobile' : p ? 'pc' : (PLATFORM.notGame.test(t) ? '' : 'pc');
    } else if (hub === 'manga') {
      facet = ORIGIN.manhua.test(t) ? 'manhua' : ORIGIN.manhwa.test(t) ? 'manhwa' : 'manga';
    }
    return { type: type, facet: facet };
  }
  function label(hub, kind, key, lang) {
    var H = T[hub]; if (!H) return key;
    var list = kind === 'facet' ? H.facets : H.types;
    var row = list.filter(function (r) { return r[0] === key; })[0];
    return row ? row[lang === 'en' ? 2 : 1] : key;
  }
  var api = { hubs: T, suggest: suggest, label: label };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OT_TAXONOMY = api;
})(typeof window !== 'undefined' ? window : globalThis);
