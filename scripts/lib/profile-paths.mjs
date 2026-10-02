// Đường dẫn trang hồ sơ tác phẩm. Mỗi thương hiệu một trang /ho-so/<slug> (EN: /en/profile/<slug>);
// các phiên bản (manga, anime từng mùa, phim, game chuyển thể...) là các tab trên cùng trang: /ho-so/<slug>#<tab>.
// Nhóm thương hiệu khai báo trong assets/series.json; khóa catalog không thuộc nhóm nào là trang một phiên bản.
// Tính tất định từ catalog + series.json nên mọi script (build-profiles, build-rankings, sync-home-rankings,
// sync-profile-scores, build-choi-gi) cho ra cùng một URL mà không phụ thuộc thứ tự chạy.
import fs from 'node:fs';

const root = new URL('../../', import.meta.url);
export const PROFILE_TYPES = ['game', 'anime', 'manga'];

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/δ/g, 'delta').replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
// Tên rất dài (romaji của light novel) cắt ở ranh giới từ để URL gọn, tối đa 60 ký tự
const shortSlug = (s) => (s.length <= 60 ? s : s.slice(0, 61).replace(/-[^-]*$/, ''));
// "Jujutsu Kaisen (Anime)" -> "Jujutsu Kaisen": loại đã có trong nhãn
export const displayName = (key) => key.replace(/\s*\((?:Anime|Manga)\)$/, '');

// Đường dẫn VI -> EN: /ho-so/x#tab -> /en/profile/x#tab
export const localize = (p, en) => (p && en ? p.replace(/^\/ho-so\//, '/en/profile/') : p);
export const pagePath = (slug, en) => (en ? '/en/profile/' : '/ho-so/') + slug;

function readSeries() {
  return JSON.parse(fs.readFileSync(new URL('assets/series.json', root), 'utf8'));
}

// [{ slug, name, nameEn, editions: [{ key, type, tab, label, labelEn, also: [] }] }] — mọi hồ sơ, gộp theo thương hiệu
// name: tên hiển thị VI (series.json cho phép tên Việt hóa, vd. "Pháp Sư Tiễn Táng Frieren"), nameEn: tên EN
export function profileSeries(catalog) {
  const declared = readSeries();
  const out = [];
  const taken = new Set();
  const usedSlugs = new Set();
  for (const [slug, s] of Object.entries(declared)) {
    const editions = s.editions.filter((e) => catalog[e.key]).map((e) => ({
      key: e.key, type: catalog[e.key].type, tab: e.tab, label: e.label, labelEn: e.labelEn || e.label,
      also: (e.also || []).filter((k) => catalog[k]),
    }));
    if (!editions.length) continue;
    editions.forEach((e) => { taken.add(e.key); e.also.forEach((k) => taken.add(k)); });
    out.push({ slug, name: s.name, nameEn: s.nameEn || s.name, editions });
    usedSlugs.add(slug);
  }
  for (const key of Object.keys(catalog).sort()) {
    const e = catalog[key];
    if (taken.has(key) || !PROFILE_TYPES.includes(e.type)) continue;
    let slug = shortSlug(slugify(displayName(key))) || 'ho-so';
    if (usedSlugs.has(slug)) slug = shortSlug(slugify(key));
    let n = 2; const base = slug;
    while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
    usedSlugs.add(slug);
    out.push({ slug, name: displayName(key), nameEn: displayName(key), editions: [{ key, type: e.type, tab: e.type, label: '', labelEn: '', also: [] }] });
  }
  return out;
}

// { "type|Khóa catalog": "/ho-so/slug" hoặc "/ho-so/slug#tab" } (đường dẫn VI; EN dùng localize)
// Phiên bản mặc định (tab đầu) không kèm #tab.
export function profilePaths(catalog) {
  const paths = {};
  for (const s of profileSeries(catalog)) {
    s.editions.forEach((e, i) => {
      const p = '/ho-so/' + s.slug + (i ? '#' + e.tab : '');
      paths[`${e.type}|${e.key}`] = p;
      for (const k of e.also) paths[`${catalog[k].type}|${k}`] = p;
    });
  }
  return paths;
}

// Tên gọi khác mà trang hồ sơ động chấp nhận (TITLE_ALIAS, TYPE_ENTRY_ALIAS trong assets/detail.v2.js)
export function aliasPaths(paths) {
  const src = fs.readFileSync(new URL('assets/detail.v2.js', root), 'utf8');
  const literal = (name) => new Function('return ' + src.match(new RegExp('var ' + name + '=(\\{[\\s\\S]*?\\});'))[1])();
  const out = {};
  for (const [alias, target] of Object.entries(literal('TITLE_ALIAS'))) {
    for (const t of PROFILE_TYPES) if (paths[`${t}|${target}`] && !paths[`${t}|${alias}`]) out[`${t}|${alias}`] = paths[`${t}|${target}`];
  }
  for (const [k, target] of Object.entries(literal('TYPE_ENTRY_ALIAS'))) {
    const t = k.split('|')[0];
    if (paths[`${t}|${target}`] && !paths[k]) out[k] = paths[`${t}|${target}`];
  }
  return out;
}

// URL hồ sơ cũ (/game|anime|manga/<slug>, dùng tới 2026-10-02) -> đường dẫn mới, để chuyển hướng 301
export function legacyMoves(paths) {
  const legacy = JSON.parse(fs.readFileSync(new URL('scripts/data/legacy-profile-paths.json', root), 'utf8'));
  const out = {};
  for (const [old, k] of Object.entries(legacy)) if (paths[k]) out[old] = paths[k];
  return out;
}

// Link hồ sơ cho một khóa catalog (prefix '' hoặc '/en'); không có hồ sơ -> null
export function profileUrl(catalog, type, key, prefix = '') {
  const p = profilePaths(catalog)[`${type}|${key}`];
  return p ? localize(p, prefix === '/en') : null;
}

// Đổi link hồ sơ trong HTML sang URL mới: trang động href="/game-detail?t=..." (nếu tựa đã có hồ sơ)
// và URL tĩnh cũ href="/anime/<slug>" (moves từ legacyMoves)
export function rewriteProfileLinks(html, allPaths, moves = {}) {
  return html.replace(/href="\/(en\/)?(game|anime|manga)-detail\?t=([^"&#]+)"/g, (m, en, type, enc) => {
    let title;
    try { title = decodeURIComponent(enc.replace(/\+/g, ' ')); } catch { return m; }
    const p = allPaths[`${type}|${title}`];
    return p ? `href="${localize(p, !!en)}"` : m;
  }).replace(/href="\/(en\/)?((?:game|anime|manga)\/[a-z0-9-]+)"/g, (m, en, old) => {
    const p = moves['/' + old];
    return p ? `href="${localize(p, !!en)}"` : m;
  });
}
