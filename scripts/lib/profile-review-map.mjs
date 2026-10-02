// Hồ sơ (assets/catalog.json) <-> bài review chấm điểm cho hồ sơ đó (id trong const REVIEWS
// của reviews.html). Nguồn duy nhất, dùng chung cho:
//   - sync-profile-scores.mjs: điểm + link bài review hiện trên trang hồ sơ;
//   - build-rankings.mjs / sync-home-rankings.mjs: mỗi tựa trên bảng xếp hạng mở đúng hồ sơ của nó
//     (tên hiển thị trên bảng xếp hạng như "Dandadan mùa 2" không trùng tên hồ sơ, nên ghép qua id review).
// Thêm hồ sơ mới cho một tựa đã có review: thêm 1 dòng ở đây rồi chạy npm run scores.
export const PROFILE_REVIEW = {
  'Elden Ring: Shadow of the Erdtree': 'ersote', 'Monster Hunter Wilds': 'mhw', 'Wuthering Waves': 'wuwa',
  'Genshin Impact': 'gs70sn', 'Honkai: Star Rail': 'hsr', 'Black Myth: Wukong': 'bmwk',
  'Ghost of Yōtei: Complete Edition': 'goy', 'Suikoden STAR LEAP': 'sksl', 'Split Fiction': 'spf',
  'Death Stranding 2: On the Beach': 'ds2', 'Kingdom Come: Deliverance II': 'kcd2',
  'Metal Gear Solid Δ: Snake Eater': 'mgsdelta', 'Mafia: The Old Country': 'mafiaoc',
  'Warhammer 40,000: Space Marine 2': 'sm2cr', "Girls' Frontline 2: Exilium": 'gfl2',
  'Kaiju No.8 THE GAME': 'kj8game', 'Blue Protocol: Star Resonance': 'bp',
  'Spy x Family': 'sxfanime', 'Demon Slayer: Infinity Castle': 'dsic', 'Chainsaw Man: Reze Arc': 'csmreze',
  'Attack on Titan: Final Season': 'aotfs', 'Jujutsu Kaisen (Anime)': 'jjkanime', 'Dandadan Season 2': 'ddd2',
  'Oshi no Ko': 'onkanime', 'Chainsaw Man (Anime)': 'csmanime',
  'One Piece': 'opfs', 'One Piece: Egghead Arc': 'opeg', 'Chainsaw Man': 'csmmanga2', 'Chainsaw Man (Manga)': 'csmmanga2',
  'Jujutsu Kaisen': 'jjkfinal', 'Vinland Saga': 'vlsaga', 'Dandadan': 'ddmg', 'Kaiju No.8': 'kj8m',
  'Kagurabachi': 'kgb', 'Black Clover': 'bcfv',
  'Dragon Ball DAIMA': 'dbdaima', 'Battle Through the Heavens': 'btthreview', 'Solo Leveling: Ragnarok': 'slragreview'
};

// id review -> khóa hồ sơ. Nhiều hồ sơ cùng một bài review (vd "Chainsaw Man" và "Chainsaw Man (Manga)"):
// lấy tên ngắn nhất. Chỉ trả hồ sơ cùng loại (game/anime/manga) với mục cần ghép.
export function profileKeyForReview(catalog, reviewId, type) {
  let best = null;
  for (const [key, id] of Object.entries(PROFILE_REVIEW)) {
    if (id !== reviewId || !catalog[key] || (type && catalog[key].type !== type)) continue;
    if (!best || key.length < best.length) best = key;
  }
  return best;
}
