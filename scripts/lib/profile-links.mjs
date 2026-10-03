// Liên kết nội bộ bài viết <-> hồ sơ tác phẩm.
// Một bài "nói về" tác phẩm khi tên tác phẩm (hoặc tên gọi khác) có trong tiêu đề H1 hoặc thẻ chủ đề
// (sb-tags) của bài. Kết quả dùng cho:
//   - khối "Hồ sơ tác phẩm" trong sidebar mỗi bài (build-profiles.mjs chèn, chạy lại an toàn),
//   - danh sách "Bài viết" trên trang hồ sơ (window.OT_PROFILE_ARTICLES khi dựng trang tĩnh).
import fs from 'node:fs';
import { displayName, localize } from './profile-paths.mjs';

const root = new URL('../../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');

// Tên gọi phổ biến không có trong bảng alias của detail.v2.js (chỉ dùng để nhận diện bài viết)
const MATCH_EXTRA = {
  'Grand Theft Auto VI': ['GTA 6', 'GTA VI'],
  'Hades II': ['Hades 2'],
  'Hollow Knight: Silksong': ['Silksong'],
  'Frieren Season 2': ['Frieren', 'Sousou no Frieren'],
  'Demon Slayer: Infinity Castle': ['Demon Slayer', 'Kimetsu no Yaiba', 'Thanh Gươm Diệt Quỷ'],
  'Bleach: TYBW Final Part': ['Bleach', 'Thousand-Year Blood War'],
  'Genshin Impact': ['Genshin'],
  'Honkai: Star Rail': ['Honkai Star Rail'],
  'Ghost of Yōtei: Complete Edition': ['Ghost of Yōtei', 'Ghost of Yotei'],
  'Kingdom Come: Deliverance II': ['Kingdom Come Deliverance 2', 'Kingdom Come: Deliverance 2', 'KCD2'],
  'Metal Gear Solid Δ: Snake Eater': ['Metal Gear Solid Delta'],
  'Warhammer 40,000: Space Marine 2': ['Space Marine 2'],
  "Girls' Frontline 2: Exilium": ["Girls' Frontline 2", 'Girls Frontline 2', 'GFL2'],
  'Final Fantasy VII Rebirth': ['FF7 Rebirth'],
  'The Apothecary Diaries': ['Dược Sư Tự Sự'],
  'Castle in the Sky': ['Laputa'],
  'Detective Conan': ['Thám Tử Lừng Danh Conan'],
  'Detective Conan (Anime)': ['Thám Tử Lừng Danh Conan'],
  'Toilet-bound Hanako-kun': ['Hanako-kun'],
  'Re:Zero Season 4': ['Re:Zero'],
  'Oshi no Ko': ['[Oshi no Ko]'],
  "JoJo's Bizarre Adventure: Steel Ball Run": ['Steel Ball Run'],
  'Dandadan Season 2': ['Dan Da Dan'],
  'Dandadan': ['Dan Da Dan'],
  'Kaiju No.8': ['Kaiju No. 8'],
  'Kaiju No.8 THE GAME': ['Kaiju No. 8 The Game'],
  'Draw This, Then Die!': ['Kore Kaite Shine'],
  'Cyberpunk 2077': ['Phantom Liberty'],
  'Call of Duty: Modern Warfare 4': ['Modern Warfare 4'],
  'The Elder Scrolls IV: Oblivion Remastered': ['Oblivion Remastered'],
  'PUBG: Battlegrounds': ['PUBG'],
  'Dragon Ball: Sparking! Zero': ['Sparking! Zero', 'Sparking Zero'],
  'Solo Leveling Season 2': ['Solo Leveling'],
  'Chainsaw Man: Reze Arc': ['Reze Arc'],
  'One Piece: Egghead Arc': ['Egghead'],
  'Honor of Kings Global': ['Honor of Kings'],
  'Death Stranding 2: On the Beach': ['Death Stranding 2'],
  'The Witcher 3: Wild Hunt': ['The Witcher 3', 'The Witcher'],
  'Reincarnated as a Sword II': ['Reincarnated as a Sword', 'Chuyển Sinh Thành Kiếm'],
  'Magic Knight Rayearth (2026)': ['Magic Knight Rayearth', 'Hiệp Sĩ Phép Màu'],
  'Tougen Anki: Nikko Kegon Falls Arc': ['Tougen Anki'],
  'Ace of Diamond act II Second Season': ['Diamond no Ace', 'Ace of Diamond'],
  'Ace of Diamond act II Second Season (Part 2)': ['Diamond no Ace', 'Ace of Diamond'],
  'Skip and Loafer': ['Nhịp Bước Tuổi Xanh'],
  'Diablo IV': ['Diablo 4'],
  'Food Wars!': ['Food Wars', 'Shokugeki no Soma'],
  'Kuri-hime: Ayakashi Yobanashi': ['Kuri Hime Ayakashi Yobanashi', 'Kurimiko'],
  'Galaxy Express 999': ['Chuyến Tàu Ngân Hà 999'],
  'Record of Ragnarok': ['Đại Chiến Nhân Thần', 'Shuumatsu no Valkyrie'],
  'Romelia War Chronicle': ['Romelia'],
  'CONTROL Resonant': ['Control Resonant'],
};
// Tên quá chung chung, dễ khớp nhầm, không dùng để nhận diện
// "cyberpunk" là tên thể loại (vd bài Dynamite Blue "RPG chiến thuật cyberpunk"); bài Cyberpunk 2077/Edgerunners vẫn khớp qua tên đầy đủ
const NO_MATCH = new Set(['big walk', 'cyberpunk']);

export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[’‘`]/g, "'").replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();

function aliasTable() {
  const src = read('assets/detail.v2.js');
  const literal = (name) => new Function('return ' + src.match(new RegExp('var ' + name + '=(\\{[\\s\\S]*?\\});'))[1])();
  return { title: literal('TITLE_ALIAS'), typed: literal('TYPE_ENTRY_ALIAS') };
}

// [{ key, type, names: [tên đã chuẩn hoá] }]
export function profileMatchers(catalog, series = []) {
  const { title, typed } = aliasTable();
  const out = [];
  // Tên thương hiệu (series.json: name = tên Việt hóa, nameEn = tên gốc) cũng nhận diện được bài viết
  const seriesNames = new Map();
  // Tên Việt hóa có ngoặc "Thế Giới Phép Thuật (Black Clover)": bài viết thường chỉ gọi phần trước ngoặc
  const bare = (n) => { const b = String(n || '').replace(/\s*\([^)]*\)\s*$/, '').trim(); return b && b !== n ? [b] : []; };
  for (const s of series) for (const e of s.editions) for (const k of [e.key, ...e.also]) seriesNames.set(k, [s.name, s.nameEn, ...bare(s.name)]);
  for (const [key, e] of Object.entries(catalog)) {
    const names = new Set([displayName(key), ...(MATCH_EXTRA[key] || []), ...(seriesNames.get(key) || [])]);
    const base = displayName(key).replace(/\s+(?:Season \d+|Final Season|Final Part)$/i, '');
    if (base !== displayName(key) && !catalog[base]) names.add(base);
    for (const [a, t] of Object.entries(title)) if (t === key && !/,|review|đánh giá/i.test(a)) names.add(a);
    for (const [k, t] of Object.entries(typed)) if (t === key && k.startsWith(e.type + '|')) names.add(k.slice(e.type.length + 1));
    out.push({ key, type: e.type, names: [...names].map(norm).filter((n) => n.length >= 4 && !NO_MATCH.has(n)) });
  }
  return out;
}

// Vị trí khớp nguyên cụm (không dính chữ/số hai bên)
function findAll(hay, needle) {
  const hits = [];
  let i = hay.indexOf(needle);
  while (i > -1) {
    const before = hay[i - 1], after = hay[i + needle.length];
    if (!(before && /[a-z0-9]/.test(before)) && !(after && /[a-z0-9]/.test(after))) hits.push([i, i + needle.length]);
    i = hay.indexOf(needle, i + 1);
  }
  return hits;
}

const CAT_TYPE = { Gaming: 'game', Anime: 'anime', Manga: 'manga' };

// Các hồ sơ một bài nói tới, theo thứ tự: khớp tiêu đề trước, rồi thẻ chủ đề. Tối đa `limit`.
export function profilesForArticle(matchers, { title, tags = [], cat }, limit = 4) {
  const prefer = CAT_TYPE[cat];
  const fields = [norm(title), ...tags.map(norm)];
  const picked = [];
  const seen = new Set();
  fields.forEach((hay, fi) => {
    // Mọi lần khớp trong trường này; lần khớp nằm trọn trong lần khớp dài hơn bị bỏ
    let hits = [];
    for (const m of matchers) for (const n of m.names) for (const [s, e] of findAll(hay, n)) hits.push({ m, s, e });
    hits = hits.filter((h) => !hits.some((o) => o !== h && o.s <= h.s && o.e >= h.e && o.e - o.s > h.e - h.s));
    // Cùng một đoạn khớp nhiều hồ sơ (vd "Chainsaw Man" manga/anime): ưu tiên đúng loại bài, rồi khóa ngắn nhất
    const bySpan = new Map();
    for (const h of hits) { const k = h.s + ':' + h.e; (bySpan.get(k) || bySpan.set(k, []).get(k)).push(h); }
    const chosen = [...bySpan.values()].map((group) => group.sort((a, b) =>
      ((b.m.type === prefer) - (a.m.type === prefer)) || (a.m.key.length - b.m.key.length))[0]).sort((a, b) => a.s - b.s);
    for (const h of chosen) {
      if (seen.has(h.m.key)) continue;
      // Thẻ chủ đề chỉ là tên chung (vd thẻ "Anime") thì bỏ qua; tiêu đề luôn được tính
      if (fi > 0 && h.e - h.s < hay.length * 0.5) continue;
      seen.add(h.m.key);
      picked.push({ key: h.m.key, type: h.m.type, inTitle: fi === 0 });
    }
  });
  return picked.slice(0, limit);
}

// Đọc tiêu đề + thẻ chủ đề từ HTML bài viết
export function articleInfo(html) {
  const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const tagBox = html.match(/<div class="sb-tags">([\s\S]*?)<\/div>/);
  const tags = tagBox ? [...tagBox[1].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/g)].map((m) => strip(m[1])) : [];
  return { title: h1 ? strip(h1[1]) : '', tags };
}

// Bảng tên cho trình duyệt (assets/profile-names.json): bài mới đăng qua admin chưa có khối hồ sơ dựng sẵn,
// assets/enhance.js dùng bảng này để gắn khối "Hồ sơ tác phẩm" và link các thẻ chủ đề (sb-tag).
// Mỗi dòng một phiên bản: [tên đã chuẩn hóa[], đường dẫn VI (kèm #tab), slug thương hiệu, tên VI, tên EN, nhãn VI, nhãn EN, ảnh, đường dẫn EN, cờ]
// phần tử cuối (chỉ dòng tác phẩm) = loại: game | anime | manga, để gom khối "Game/Anime/Manga liên quan"
// cờ 0 = hồ sơ tác phẩm, 1 = studio / nhà phát hành (dùng cho tìm kiếm + link thẻ chủ đề, không vào khối hồ sơ của bài)
export function nameTable(series, matchers, paths, labelOf, thumbOf) {
  const byKey = new Map(matchers.map((m) => [m.key, m]));
  const rows = [];
  for (const s of series) {
    const multi = s.editions.length > 1;
    for (const e of s.editions) {
      const m = byKey.get(e.key);
      rows.push([m ? m.names : [], paths[`${e.type}|${e.key}`], s.slug, s.name, s.nameEn, labelOf(s, e, false, multi), labelOf(s, e, true, multi), thumbOf(e.key), localize(paths[`${e.type}|${e.key}`], true), 0, e.type]);
    }
  }
  return rows;
}

// Tên (chuẩn hóa) -> dòng bảng, chỉ giữ tên thuộc đúng một thương hiệu; dùng để link thẻ chủ đề trùng tên tác phẩm
export function tagTable(rows) {
  const owner = new Map();
  for (const r of rows) for (const n of r[0]) { const o = owner.get(n); if (o === undefined) owner.set(n, r); else if (o && o[2] !== r[2]) owner.set(n, null); }
  return owner;
}
