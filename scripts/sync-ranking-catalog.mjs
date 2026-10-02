import fs from 'node:fs';
import vm from 'node:vm';

const rankingFile = new URL('../rankings.html', import.meta.url);
const catalogFile = new URL('../assets/catalog.json', import.meta.url);
const rankingHtml = fs.readFileSync(rankingFile, 'utf8');
const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
const match = rankingHtml.match(/const CATS\s*=\s*(\{[\s\S]*?\n\})\s*;/);
if (!match) throw new Error('Không tìm thấy CATS trong rankings.html');
const scope = {};
vm.runInNewContext(`data=${match[1]}`, scope);

const facts = {
  'Split Fiction': ['game','Hazelight Studios / Electronic Arts','PC / PlayStation 5 / Xbox Series X|S','06/03/2025','Co-op Adventure','Hai nhà văn Mio và Zoe bị mắc kẹt trong những thế giới do chính ý tưởng của họ tạo ra và phải phối hợp để thoát khỏi cỗ máy đánh cắp sáng tạo.','Writers Mio and Zoe are trapped inside worlds built from their own ideas and must cooperate to escape a machine designed to steal creative work.','Trọng tâm của trò chơi là co-op hai người, liên tục thay đổi cơ chế giữa khoa học viễn tưởng và kỳ ảo.','The game is built around two-player co-op and continually shifts mechanics between science fiction and fantasy.','EA Split Fiction','https://www.ea.com/games/split-fiction/split-fiction'],
  'Death Stranding 2: On the Beach': ['game','Kojima Productions / Sony Interactive Entertainment','PlayStation 5','26/06/2025','Action Adventure','Sam Porter Bridges tiếp tục hành trình kết nối các cộng đồng trong một thế giới hậu tận thế, lần này mở rộng ra ngoài nước Mỹ cùng Drawbridge.','Sam Porter Bridges continues connecting communities in a post-apocalyptic world, expanding beyond America with Drawbridge.','Điểm nhận diện vẫn là vận chuyển, quản lý địa hình và kết nối bất đồng bộ, kết hợp chiến đấu và phương tiện đa dạng hơn.','Its identity remains traversal, terrain management and asynchronous connection, now paired with broader combat and vehicle options.','PlayStation Death Stranding 2','https://www.playstation.com/games/death-stranding-2-on-the-beach/'],
  'Kingdom Come: Deliverance II': ['game','Warhorse Studios / Deep Silver','PC / PlayStation 5 / Xbox Series X|S','04/02/2025','Historical Action RPG','Henry tiếp tục câu chuyện tại Bohemia thế kỷ 15, bị cuốn vào xung đột chính trị và chiến tranh sau biến cố của phần đầu.','Henry continues his story in 15th-century Bohemia, drawn into political conflict and war after the events of the first game.','Trò chơi theo đuổi nhập vai lịch sử, chiến đấu có quán tính, lựa chọn hội thoại và hệ quả từ hành động của người chơi.','The game emphasizes historical role-playing, weighty combat, dialogue choices and consequences for player actions.','Kingdom Come Deliverance II official','https://www.kingdomcomerpg.com/'],
  'Ghost of Yōtei': ['game','Sucker Punch Productions / Sony Interactive Entertainment','PlayStation 5','02/10/2025','Action Adventure','Atsu săn lùng nhóm Yōtei Six tại miền bắc Nhật Bản năm 1603, hơn ba thế kỷ sau câu chuyện của Ghost of Tsushima.','Atsu hunts the Yōtei Six in northern Japan in 1603, more than three centuries after Ghost of Tsushima.','Phiêu lưu thế giới mở kết hợp kiếm thuật, ám sát và khám phá vùng Ezo với một nhân vật chính hoàn toàn mới.','The open-world adventure combines sword combat, stealth and exploration across Ezo with an entirely new protagonist.','PlayStation Ghost of Yotei','https://www.playstation.com/games/ghost-of-yotei/'],
  'Metal Gear Solid Δ: Snake Eater': ['game','Konami','PC / PlayStation 5 / Xbox Series X|S','28/08/2025','Stealth Action','Bản làm lại kể lại nhiệm vụ Virtuous Mission và Operation Snake Eater của Naked Snake trong bối cảnh Chiến tranh Lạnh.','The remake retells Naked Snake’s Virtuous Mission and Operation Snake Eater during the Cold War.','Thiết kế giữ cốt truyện và cấu trúc sinh tồn của bản gốc, đồng thời nâng cấp hình ảnh, điều khiển và âm thanh.','It preserves the original survival story and structure while modernizing visuals, controls and audio.','Konami Metal Gear Solid Delta','https://www.konami.com/mg/mgs3r/'],
  'Mafia: The Old Country': ['game','Hangar 13 / 2K','PC / PlayStation 5 / Xbox Series X|S','08/08/2025','Narrative Action Adventure','Câu chuyện theo chân Enzo Favara trong thế giới tội phạm Sicily đầu thế kỷ 20, trước thời đại của gia đình Mafia tại Mỹ.','The story follows Enzo Favara through early-20th-century Sicily’s criminal underworld, before the American Mafia era.','Tác phẩm tập trung vào trải nghiệm tuyến tính, điện ảnh, đấu súng và những xung đột về lòng trung thành.','It focuses on a linear cinematic experience, gunplay and conflicts shaped by loyalty.','Mafia The Old Country official','https://mafia.2k.com/the-old-country/'],
  'Warhammer 40,000: Space Marine 2': ['game','Saber Interactive / Focus Entertainment','PC / PlayStation 5 / Xbox Series X|S','09/09/2024','Third-person Action','Titus trở lại hàng ngũ Ultramarines để đối đầu đàn Tyranid và những mối đe dọa của Chaos trong thiên niên kỷ 41.','Titus returns to the Ultramarines to confront Tyranid swarms and the forces of Chaos in the 41st millennium.','Chiến dịch, Operations co-op và PvP đều dựa trên cảm giác áp đảo đám đông cùng hệ thống cận chiến phản đòn.','Campaign, co-op Operations and PvP all build on large-scale swarms and a parry-focused melee system.','Space Marine 2 official','https://www.focus-entmt.com/en/games/warhammer-40000-space-marine-2'],
  "Girls' Frontline 2: Exilium": ['game','MICA Team / Sunborn','PC / iOS / Android','03/12/2024','Tactical RPG','Chỉ huy dẫn dắt các T-Doll trong một nhiệm vụ mới sau khi Griffin tan rã, khám phá những âm mưu tại thế giới hậu khủng hoảng.','The Commander leads T-Dolls on a new mission after Griffin’s dissolution, uncovering conspiracies across a post-crisis world.','Chiến đấu theo lượt trên lưới nhấn mạnh vật cản, vị trí và phối hợp kỹ năng giữa các nhân vật.','Grid-based turn combat emphasizes cover, positioning and coordinated character skills.','Girls Frontline 2 official','https://gf2.haoplay.com/'],
  'Kaiju No.8 THE GAME': ['game','Akatsuki Games','PC / iOS / Android','31/08/2025','Turn-based RPG','Game chuyển thể thế giới Kaiju No. 8 thành những nhiệm vụ chiến đấu theo lượt với Kafka Hibino và lực lượng phòng vệ.','The game adapts Kaiju No. 8 into turn-based missions starring Kafka Hibino and the Defense Force.','Đội hình, kỹ năng và khai thác điểm yếu kaiju là trọng tâm, bên cạnh các cảnh chiến đấu 3D quy mô lớn.','Team building, skills and exploiting kaiju weaknesses drive the combat alongside large-scale 3D sequences.','Kaiju No 8 The Game official','https://kj8-thegame.com/'],
  'Blue Protocol: Star Resonance': ['game','Bokura / A Plus Japan','PC / iOS / Android','2025','Anime MMORPG','Người chơi khám phá Regnas trong một MMORPG phong cách anime, phát triển nhân vật và tham gia hoạt động tổ đội thời gian thực.','Players explore Regnas in an anime-styled MMORPG, developing characters and joining real-time group activities.','Hệ thống lớp nhân vật, dungeon và hoạt động thế giới mở hướng đến trải nghiệm cộng đồng đa nền tảng.','Classes, dungeons and open-world activities are designed around a cross-platform social experience.','Blue Protocol Star Resonance official','https://www.playbpsr.com/'],
  'Chainsaw Man: Reze Arc': ['anime','MAPPA','Cinema','19/09/2025','Action / Dark Fantasy','Denji gặp Reze, một cô gái bí ẩn khiến cuộc sống của cậu bước vào mối quan hệ vừa lãng mạn vừa nguy hiểm.','Denji meets Reze, a mysterious girl who draws him into a relationship that is both romantic and dangerous.','Phim điện ảnh nối tiếp anime truyền hình, chuyển thể Bomb Girl Arc với hành động bạo liệt và bi kịch cá nhân.','The theatrical sequel adapts the Bomb Girl Arc with violent action and intimate tragedy.','Chainsaw Man Reze Arc official','https://chainsawman.dog/movie_reze/'],
  'Attack on Titan: Final Season': ['anime','MAPPA','TV / Streaming','2020–2023','Dark Fantasy / Drama','Phần cuối mở rộng cuộc chiến từ đảo Paradis sang Marley và đặt Eren, Mikasa, Armin trước hệ quả của lịch sử thù hận.','The final season expands the conflict from Paradis to Marley and forces Eren, Mikasa and Armin to face the consequences of inherited hatred.','Tác phẩm chuyển trọng tâm từ sinh tồn sang chiến tranh, chính trị và câu hỏi về tự do, trách nhiệm.','The story shifts from survival toward war, politics and questions of freedom and responsibility.','Attack on Titan official','https://shingeki.tv/final/'],
  'Jujutsu Kaisen (Anime)': ['anime','MAPPA','TV / Streaming','2020–','Action / Supernatural','Yuji Itadori bước vào thế giới chú thuật sau khi nuốt ngón tay của Ryomen Sukuna và gia nhập trường Chú thuật Tokyo.','Yuji Itadori enters the world of jujutsu after consuming one of Ryomen Sukuna’s fingers and joining Tokyo Jujutsu High.','Anime nổi bật ở biên đạo chiến đấu, hệ thống chú lực và cách các lựa chọn đạo đức đẩy nhân vật vào tổn thất.','The anime stands out for fight choreography, its cursed-energy system and moral choices that carry lasting losses.','Jujutsu Kaisen anime official','https://jujutsukaisen.jp/'],
  'Dandadan Season 2': ['anime','Science SARU','TV / Streaming','03/07/2025','Action / Supernatural Comedy','Momo và Okarun tiếp tục đối mặt yêu quái, người ngoài hành tinh và những bí ẩn gắn với Jiji cùng Ngôi nhà bị nguyền.','Momo and Okarun continue facing spirits, aliens and mysteries tied to Jiji and the Cursed House.','Phần hai giữ nhịp nhanh, hài lãng mạn và hoạt họa giàu biến hóa trong các trận chiến siêu nhiên.','Season two retains the rapid pacing, romantic comedy and highly elastic animation of its supernatural battles.','Dandadan anime official','https://anime-dandadan.com/'],
  'Oshi no Ko': ['anime','Doga Kobo','TV / Streaming','2023–','Drama / Entertainment Industry','Aqua và Ruby bước vào ngành giải trí để theo đuổi những mục tiêu khác nhau sau bi kịch liên quan đến thần tượng Ai Hoshino.','Aqua and Ruby enter the entertainment industry for different reasons after the tragedy surrounding idol Ai Hoshino.','Bộ phim kết hợp bí ẩn, tâm lý và góc nhìn về sản xuất truyền hình, thần tượng, diễn xuất cùng áp lực công chúng.','The series blends mystery and psychology with a look at television, idols, acting and public pressure.','Oshi no Ko anime official','https://ichigoproduction.com/'],
  'Chainsaw Man (Anime)': ['anime','MAPPA','TV / Streaming','2022–','Action / Dark Fantasy','Denji hợp nhất với quỷ cưa Pochita và trở thành Chainsaw Man, làm việc cho lực lượng săn quỷ của chính phủ.','Denji merges with the chainsaw devil Pochita and becomes Chainsaw Man, working for the government’s devil hunters.','Chuyển thể nhấn mạnh điện ảnh, nhịp dựng có chủ ý và sự tương phản giữa bạo lực siêu nhiên với ước mơ đời thường.','The adaptation favors cinematic framing and deliberate pacing, contrasting supernatural violence with ordinary desires.','Chainsaw Man anime official','https://chainsawman.dog/tvseries/'],
  'Vinland Saga': ['manga','Makoto Yukimura / Kodansha','Manga','2005–','Historical Drama','Thorfinn lớn lên giữa chiến tranh và ám ảnh báo thù, rồi phải tìm lại ý nghĩa của tự do và một vùng đất không có nô lệ hay chiến tranh.','Thorfinn grows up amid war and revenge, then must rediscover freedom and seek a land without slavery or conflict.','Manga chuyển từ sử thi Viking sang suy tưởng về bạo lực, trách nhiệm và lao động xây dựng một cuộc đời mới.','The manga evolves from a Viking epic into a meditation on violence, responsibility and the labor of building a new life.','Kodansha Vinland Saga','https://kodansha.us/series/vinland-saga/'],
  'Chainsaw Man (Manga)': ['manga','Tatsuki Fujimoto / Shueisha','Manga','2018–','Action / Dark Fantasy','Denji, một thiếu niên mắc nợ, hợp nhất với Pochita để sống lại với sức mạnh Chainsaw Man và bị cuốn vào tổ chức săn quỷ.','Debt-ridden teenager Denji merges with Pochita and returns as Chainsaw Man, becoming entangled with a government devil-hunting organization.','Nhịp kể khó đoán, bố cục điện ảnh và những mối quan hệ méo mó khiến bộ truyện vượt khỏi khuôn mẫu hành động thông thường.','Unpredictable pacing, cinematic panels and distorted relationships push the manga beyond conventional action formulas.','VIZ Chainsaw Man','https://www.viz.com/chainsaw-man'],
  'Dandadan': ['manga','Yukinobu Tatsu / Shueisha','Manga','2021–','Action / Supernatural Comedy','Momo tin vào ma nhưng không tin người ngoài hành tinh, còn Okarun thì ngược lại; thử thách của họ mở ra chuỗi biến cố siêu nhiên.','Momo believes in ghosts but not aliens, while Okarun believes the opposite; their challenge unleashes a chain of supernatural events.','Bộ truyện kết hợp hành động, hài, kinh dị và lãng mạn với nét vẽ giàu tốc độ nhưng vẫn rõ không gian.','The manga combines action, comedy, horror and romance with fast yet spatially clear artwork.','VIZ Dandadan','https://www.viz.com/dandadan'],
  'Kaiju No.8': ['manga','Naoya Matsumoto / Shueisha','Manga','2020–','Action / Science Fantasy','Kafka Hibino bất ngờ biến thành kaiju nhưng vẫn theo đuổi ước mơ gia nhập lực lượng phòng vệ cùng người bạn thời thơ ấu.','Kafka Hibino unexpectedly becomes a kaiju while still pursuing his dream of joining the Defense Force beside his childhood friend.','Tiền đề người trưởng thành làm lại cuộc đời tạo bản sắc cho câu chuyện, bên cạnh chiến đấu tổ đội và hệ thống vũ khí chống kaiju.','Its adult second-chance premise distinguishes the story alongside squad combat and anti-kaiju weapon systems.','VIZ Kaiju No. 8','https://www.viz.com/kaiju-no-8'],
  'Kagurabachi': ['manga','Takeru Hokazono / Shueisha','Manga','2023–','Action / Dark Fantasy','Chihiro Rokuhira săn lùng những thanh kiếm phép bị đánh cắp và những kẻ đã sát hại cha mình, một thợ rèn huyền thoại.','Chihiro Rokuhira hunts the stolen enchanted blades and the people who murdered his father, a legendary swordsmith.','Bộ truyện xây dựng hành động bằng silhouette mạnh, ma thuật kiếm dễ nhận diện và nhịp trả đũa được kiểm soát.','The manga builds action through strong silhouettes, readable blade sorcery and tightly controlled revenge pacing.','VIZ Kagurabachi','https://www.viz.com/kagurabachi'],
  'One Piece: Egghead Arc': ['manga','Eiichiro Oda / Shueisha','Manga','2022–2024','Adventure / Science Fantasy','Băng Mũ Rơm đến đảo tương lai Egghead, gặp tiến sĩ Vegapunk và bị kéo vào cuộc đối đầu trực tiếp với Chính phủ Thế giới.','The Straw Hats reach the future island Egghead, meet Dr. Vegapunk and are pulled into direct conflict with the World Government.','Arc truyện kết hợp công nghệ, lịch sử thế giới và nhiều tuyến sự kiện toàn cầu, đẩy Final Saga tiến nhanh hơn.','The arc combines technology, world history and global storylines, accelerating the Final Saga.','VIZ One Piece','https://www.viz.com/one-piece'],
  'Black Clover': ['manga','Yūki Tabata / Shueisha','Manga','2015–','Fantasy / Action','Asta sinh ra không có ma lực trong một thế giới tôn sùng phép thuật nhưng quyết tâm trở thành Ma pháp Đế.','Asta is born without magic in a world that prizes it, yet remains determined to become the Wizard King.','Tình đồng đội Black Bulls, hệ thống ma pháp và những trận chiến phối hợp là nền tảng sức hút lâu dài của bộ truyện.','The Black Bulls’ team chemistry, the magic system and cooperative battles form the series’ lasting appeal.','VIZ Black Clover','https://www.viz.com/black-clover']
};

const ranked = [];
for (const [category, group] of Object.entries(scope.data)) {
  for (const item of [...(group.top || []), ...(group.rest || [])]) ranked.push({ ...item, category });
}

const aliases = {
  'Ghost of Yōtei': 'Ghost of Yōtei: Complete Edition',
  'Chainsaw Man: Reze Arc': 'Chainsaw Man: Reze Arc',
  'Jujutsu Kaisen': 'Jujutsu Kaisen (Anime)',
  'Chainsaw Man': 'Chainsaw Man (Anime)'
};

for (const item of ranked) {
  // Cùng tên ở 2 bảng (vd. Chainsaw Man anime 9.0 và manga 9.4): ưu tiên hồ sơ có hậu tố theo loại
  const typed = item.category === 'manga' ? `${item.title} (Manga)` : item.category === 'anime' ? `${item.title} (Anime)` : null;
  const key = (typed && catalog[typed]) ? typed : (aliases[item.title] || item.title);
  const fact = facts[key] || facts[item.title];
  if (catalog[key]) {
    catalog[key].score = item.score;
    if (!catalog[key].img && item.img) catalog[key].img = item.img;
    continue;
  }
  if (!fact) continue;
  const [type, studio, platforms, release, genre, premiseVi, premiseEn, focusVi, focusEn, sourceName, sourceUrl] = fact;
  const score = item.score;
  catalog[key] = {
    type, img: item.img, score, genre, studio, platforms, release,
    status: type === 'manga' ? 'Đang phát hành / theo ấn bản' : 'Đã phát hành',
    statusEn: type === 'manga' ? 'Ongoing / edition dependent' : 'Released',
    generated: false,
    hook: premiseVi, hookEn: premiseEn,
    story: [
      premiseVi,
      focusVi,
      `Điểm ${score}/10 trên OtaHub là đánh giá biên tập tổng hợp. Người đọc nên xem đây là chỉ dẫn tham khảo và đối chiếu bài review liên quan để hiểu rõ tiêu chí chấm điểm.`
    ],
    storyEn: [
      premiseEn,
      focusEn,
      `OtaHub's ${score}/10 is an editorial aggregate. Treat it as guidance and consult the linked coverage for the reasoning behind the score.`
    ],
    sources: [{ name: sourceName, url: sourceUrl }]
  };
}

const englishOverrides = {
  'Ghost of Yōtei: Complete Edition': {
    hookEn: 'A standalone revenge journey set in Ezo in 1603, following Atsu as she hunts the Yōtei Six.',
    storyEn: [
      'Ghost of Yōtei takes place more than three centuries after Ghost of Tsushima and tells a standalone story. Atsu returns to Ezo to hunt the six people responsible for her family tragedy.',
      'The open-world design emphasizes choosing targets, exploring the wilderness around Mount Yōtei and using several weapon types instead of following one fixed route.',
      'Erika Ishii plays Atsu. Sucker Punch Productions developed the game and Sony Interactive Entertainment published it for PlayStation 5.',
      'Complete Edition is OtaHub’s ranking label for the full-content package. This profile uses official Ghost of Yōtei information and will be updated if Sony announces a separate SKU.',
      'The 9.3 score is OtaHub’s editorial rating; consult the linked review for the detailed criteria.'
    ]
  },
  'Big Walk': {
    hookEn: 'House House’s co-op adventure puts communication and finding a way forward together at the center of the experience.',
    storyEn: [
      'Big Walk is a multiplayer co-op game from House House, the team behind Untitled Goose Game. Players meet on a large island and must cooperate to find their way.',
      'The game prioritizes natural communication, observation and spontaneous player interactions over a dense mission structure.',
      'House House is developing the game and Panic is publishing it for PC. Because it has not launched widely, the ranking reflects an editorial assessment of available previews rather than a final review.',
      'This profile will be updated when detailed system requirements, voice credits and a final release date are announced.'
    ]
  },
  'Suikoden STAR LEAP': {
    hookEn: 'A new RPG in the Suikoden universe built around the 108 Stars of Destiny and an uprising east of the Scarlet Moon Empire.',
    storyEn: [
      'Suikoden STAR LEAP is a new chapter in the Suikoden universe with a new cast and a story beginning in a village east of the Scarlet Moon Empire.',
      'Players build a base, gather Stars of Destiny and take part in turn-based battles that connect character collection with community building.',
      'Konami Digital Entertainment is developing and publishing the game for mobile devices and PC. Release timing should be checked by region.',
      'The 8.8 score reflects OtaHub’s ranking at the time of update and is not a substitute for a review of the final release.'
    ]
  },
  'Honor of Kings Global': {
    hookEn: 'A mobile 5v5 MOBA with a large hero roster, fast matches and a global competitive ecosystem.',
    storyEn: [
      'Honor of Kings Global brings TiMi Studio Group’s three-lane 5v5 MOBA structure to international markets with jungle objectives and clearly defined team roles.',
      'Every hero has a distinct kit and position. Long-term depth comes from coordination, map control and adapting to balance updates.',
      'TiMi Studio Group develops the game and Level Infinite handles international publishing. The global version launched for iOS and Android on June 20, 2024.',
      'As a live-service title, hero balance, events and device requirements can change between versions. The 8.7 score is OtaHub’s editorial rating.'
    ]
  }
};
for (const [key, value] of Object.entries(englishOverrides)) {
  if (catalog[key]) Object.assign(catalog[key], value);
}
if (catalog.Berserk?.sources?.[0]) {
  catalog.Berserk.sources[0].url = 'https://younganimal.com/series/f68f676b354d4';
}

fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log(`Đã đồng bộ ${ranked.length} mục ranking; catalog hiện có ${Object.keys(catalog).length} hồ sơ.`);
