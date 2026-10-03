// Hồ sơ studio (anime, nhà phát triển game) và nhà phát hành (game, manga), tạo tự động từ trường `studio` của catalog.
//   studio     -> /studio/<slug>          (EN /en/studio/<slug>)
//   publisher  -> /nha-phat-hanh/<slug>   (EN /en/publisher/<slug>)
// Chỉ lập trang cho tên có từ MIN_WORKS thương hiệu (hồ sơ tác phẩm) trở lên; tên ít hơn thì không có trang (tránh trang mỏng).
// Quy tắc đọc trường `studio` (xem assets/entities.json cho gộp tên / loại trừ / mô tả):
//   anime : mọi tên trong trường là studio hoạt hình
//   game  : "Nhà phát triển[, ...] / Nhà phát hành[, ...]" ; một tên đứng một mình vừa là studio vừa là nhà phát hành
//   manga : "Tác giả / Nhà phát hành" ; chỉ lấy phần sau dấu "/" làm nhà phát hành
import fs from 'node:fs';
import { slugify } from './profile-paths.mjs';

const root = new URL('../../', import.meta.url);
// Ngưỡng tối thiểu (số thương hiệu có hồ sơ). Tác giả: 2, vì mỗi tác giả thường chỉ có vài tác phẩm trong catalog
export const MIN_WORKS = 3;
export const MIN_BY_TYPE = { studio: 3, publisher: 3, creator: 2 };
export const ENTITY_TYPES = ['studio', 'publisher', 'creator'];
const DIR = { studio: { vi: 'studio', en: 'studio' }, publisher: { vi: 'nha-phat-hanh', en: 'publisher' }, creator: { vi: 'tac-gia-goc', en: 'creator' } };
export const entityPath = (type, slug, en) => (en ? '/en/' + DIR[type].en + '/' : '/' + DIR[type].vi + '/') + slug;
export const entityIndexPath = (type, en) => (en ? '/en/' + DIR[type].en + '/' : '/' + DIR[type].vi + '/');
export const ENTITY_DIRS = ENTITY_TYPES.flatMap((t) => [DIR[t].vi, 'en/' + DIR[t].en]);

const clean = (s) => s.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
const splitNames = (s) => s.split(/\s*(?:,|&| x )\s*/).map(clean).filter((x) => x && !/^(chưa công bố|tba|không rõ)$/i.test(x));
export const nameKey = (n) => n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '');

function readConfig() {
  try { return JSON.parse(fs.readFileSync(new URL('assets/entities.json', root), 'utf8')); } catch { return {}; }
}

// Tên giống công ty / nhóm (không phải người): không lập trang tác giả
const COMPANY_LIKE = /shueisha|kodansha|bushiroad|china literature|tencent|kadokawa|shogakukan|square enix|webtoon|tapas|studio|\bgames?\b|entertainment|production|pictures|animation|\bfilms?\b|\binc\.?$|\bcorp|\bco\.|\bltd|toei|sunrise|bandai|konami|capcom|sony|netflix|hakusensha|ichijinsha|yen press|comics|\bteam\b|\bworks\b|type-moon|dreamtoon|kakaopage|enterbrain/i;
const CREATOR_LABELS = /^(Original creators?|Original story|Original author|Author|Creator|Creator \/ publisher|Story|Art)$/i;
// Tác giả: phần đầu của trường `studio` ở manga + các dòng credits nguyên tác
function creatorsOf(entry) {
  const names = [];
  if (entry.type === 'manga' && entry.studio) names.push(...entry.studio.split(/\s+\/\s+/)[0].split(/\s*(?:,|&)\s*/));
  for (const c of entry.credits || []) if (CREATOR_LABELS.test(c.labelEn || '')) names.push(...String(c.value).split(/\s*(?:,|\/|&)\s*/));
  return [...new Set(names.map(clean).filter((n) => n.length >= 3 && !COMPANY_LIKE.test(n)))].map((name) => ({ type: 'creator', name }));
}

// Gốc thương hiệu: bỏ hậu tố mùa / phần / arc để "Ace of Diamond act II" và "... (Part 2)" chỉ tính một tác phẩm khi xét ngưỡng
export const franchiseBase = (n) => n.toLowerCase().replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\b(\d+(st|nd|rd|th)|second|third|final|new)\s+season\b.*$/, '').replace(/\bseason\s*\d+.*$/, '').replace(/\bpart\s*\d+.*$/, '').replace(/\bact\s+[ivx]+\b.*$/, '').replace(/\s+(ii|iii|iv|2|3)\s*$/, '').replace(/[:!?.]/g, ' ').replace(/\s+/g, ' ').trim();

// Tên -> danh sách (type) theo quy tắc trên, cho một mục catalog
export function partsOf(entry) {
  const out = creatorsOf(entry);   // { type, name }
  if (!entry.studio) return out;
  const parts = entry.studio.split(/\s+\/\s+/).map((p) => p.trim());
  if (entry.type === 'anime') parts.forEach((p) => splitNames(p).forEach((n) => out.push({ type: 'studio', name: n })));
  else if (entry.type === 'game') {
    if (parts.length === 1) splitNames(parts[0]).forEach((n) => { out.push({ type: 'studio', name: n }); out.push({ type: 'publisher', name: n }); });
    else { splitNames(parts[0]).forEach((n) => out.push({ type: 'studio', name: n })); parts.slice(1).flatMap(splitNames).forEach((n) => out.push({ type: 'publisher', name: n })); }
  } else if (entry.type === 'manga') parts.slice(1).flatMap(splitNames).forEach((n) => out.push({ type: 'publisher', name: n }));
  return out;
}

// series: kết quả profileSeries(catalog). Trả về { list: [entity], byKey: Map(khóa catalog -> [{type, slug, variant}]) }
//   entity = { type, slug, name, nameEn, variants[], works: [{ series, keys[] }], desc, descEn }
export function buildEntities(catalog, series) {
  const cfg = readConfig();
  const merge = cfg.merge || {}, exclude = cfg.exclude || {}, names = cfg.names || {};
  const seriesOf = new Map();
  series.forEach((s) => s.editions.forEach((e) => { seriesOf.set(e.key, s); (e.also || []).forEach((k) => seriesOf.set(k, s)); }));
  // gộp tên: nhóm đầu tiên là tên chuẩn
  const canon = { studio: new Map(), publisher: new Map(), creator: new Map() };
  for (const t of ENTITY_TYPES) for (const group of merge[t] || []) for (const n of group) canon[t].set(nameKey(n), group[0]);
  const groups = { studio: new Map(), publisher: new Map(), creator: new Map() };
  for (const [key, entry] of Object.entries(catalog)) {
    const s = seriesOf.get(key); if (!s) continue;
    for (const { type, name } of partsOf(entry)) {
      if ((exclude[type] || []).some((x) => nameKey(x) === nameKey(name))) continue;
      const display = canon[type].get(nameKey(name)) || name;
      const k = nameKey(display);
      if (!groups[type].has(k)) groups[type].set(k, { display, variants: new Map(), series: new Map() });
      const g = groups[type].get(k);
      g.variants.set(name, (g.variants.get(name) || 0) + 1);
      if (!g.series.has(s.slug)) g.series.set(s.slug, { series: s, keys: [] });
      g.series.get(s.slug).keys.push({ key, variant: name });
    }
  }
  const list = [], byKey = new Map(), used = { studio: new Set(), publisher: new Set(), creator: new Set() };
  for (const type of ENTITY_TYPES) {
    const sorted = [...groups[type].values()].filter((g) => new Set([...g.series.values()].map((w) => franchiseBase(w.series.nameEn))).size >= MIN_BY_TYPE[type]).sort((a, b) => b.series.size - a.series.size || a.display.localeCompare(b.display));
    for (const g of sorted) {
      let slug = slugify(g.display) || type; let n = 2; const base = slug;
      while (used[type].has(slug)) slug = base + '-' + n++;
      used[type].add(slug);
      const over = names[type + ':' + g.display] || {};
      const ent = { type, slug, name: over.name || g.display, nameEn: over.nameEn || over.name || g.display, variants: [...g.variants.keys()],
        works: [...g.series.values()].map((w) => ({ series: w.series, keys: w.keys.map((x) => x.key) })),
        desc: (cfg.desc || {})[type + ':' + g.display] || '', descEn: (cfg.descEn || {})[type + ':' + g.display] || '', sources: (cfg.sources || {})[type + ':' + g.display] || [] };
      list.push(ent);
      for (const w of g.series.values()) for (const { key, variant } of w.keys) (byKey.get(key) || byKey.set(key, []).get(key)).push({ type, slug, variant });
    }
  }
  return { list, byKey };
}
