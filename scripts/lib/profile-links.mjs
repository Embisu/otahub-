// Liên kết nội bộ bài viết <-> hồ sơ tác phẩm.
// Một bài "nói về" tác phẩm khi tên tác phẩm (hoặc tên gọi khác) có trong tiêu đề H1 hoặc thẻ chủ đề
// (sb-tags) của bài. Kết quả dùng cho:
//   - khối "Hồ sơ tác phẩm" trong sidebar mỗi bài (build-profiles.mjs chèn, chạy lại an toàn),
//   - danh sách "Bài viết" trên trang hồ sơ (window.OT_PROFILE_ARTICLES khi dựng trang tĩnh).
import fs from 'node:fs';
import { displayName } from './profile-paths.mjs';

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
};
// Tên quá chung chung, dễ khớp nhầm, không dùng để nhận diện
const NO_MATCH = new Set(['big walk']);

export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[’‘`]/g, "'").replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();

function aliasTable() {
  const src = read('assets/detail.v2.js');
  const literal = (name) => new Function('return ' + src.match(new RegExp('var ' + name + '=(\\{[\\s\\S]*?\\});'))[1])();
  return { title: literal('TITLE_ALIAS'), typed: literal('TYPE_ENTRY_ALIAS') };
}

// [{ key, type, names: [tên đã chuẩn hoá] }]
export function profileMatchers(catalog) {
  const { title, typed } = aliasTable();
  const out = [];
  for (const [key, e] of Object.entries(catalog)) {
    const names = new Set([displayName(key), ...(MATCH_EXTRA[key] || [])]);
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
