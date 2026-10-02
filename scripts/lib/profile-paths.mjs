// Đường dẫn trang hồ sơ tĩnh của từng tác phẩm trong assets/catalog.json: /game|anime|manga/<slug>.
// Tính tất định từ catalog nên mọi script (build-profiles, build-rankings, sync-home-rankings,
// sync-profile-scores) cho ra cùng một URL mà không phụ thuộc thứ tự chạy.
import fs from 'node:fs';

const root = new URL('../../', import.meta.url);
export const PROFILE_TYPES = ['game', 'anime', 'manga'];

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/δ/g, 'delta').replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
// "Jujutsu Kaisen (Anime)" -> "Jujutsu Kaisen": loại đã có trong đường dẫn
export const displayName = (key) => key.replace(/\s*\((?:Anime|Manga)\)$/, '');

// { "type|Khóa catalog": "/type/slug" } cho mọi hồ sơ trong catalog
export function profilePaths(catalog) {
  const paths = {};
  const used = new Set();
  for (const key of Object.keys(catalog).sort()) {
    const e = catalog[key];
    if (!PROFILE_TYPES.includes(e.type)) continue;
    let slug = slugify(displayName(key)) || 'ho-so';
    // "Chainsaw Man" và "Chainsaw Man (Manga)" cùng loại: giữ phân biệt
    if (used.has(`${e.type}/${slug}`)) slug = slugify(key);
    let n = 2; const base = slug;
    while (used.has(`${e.type}/${slug}`)) slug = `${base}-${n++}`;
    used.add(`${e.type}/${slug}`);
    paths[`${e.type}|${key}`] = `/${e.type}/${slug}`;
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

// Link hồ sơ cho một khóa catalog (prefix '' hoặc '/en'); không có hồ sơ -> null
export function profileUrl(catalog, type, key, prefix = '') {
  const p = profilePaths(catalog)[`${type}|${key}`];
  return p ? prefix + p : null;
}

// Đổi link trang hồ sơ động href="/game-detail?t=..." trong HTML sang URL tĩnh (nếu tựa đã có hồ sơ)
export function rewriteProfileLinks(html, allPaths) {
  return html.replace(/href="\/(en\/)?(game|anime|manga)-detail\?t=([^"&#]+)"/g, (m, en, type, enc) => {
    let title;
    try { title = decodeURIComponent(enc.replace(/\+/g, ' ')); } catch { return m; }
    const p = allPaths[`${type}|${title}`];
    return p ? `href="${en ? '/en' : ''}${p}"` : m;
  });
}
