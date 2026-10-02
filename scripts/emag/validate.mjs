// Bộ quy tắc CỨNG của form E-Magazine OtaHub. Spec vi phạm bất kỳ điều nào thì bộ dựng dừng, không ghi trang.
// Sửa quy tắc ở đây nghĩa là đổi chuẩn cho mọi e-magazine sau này, hãy cân nhắc kỹ.
import { ICONS } from './parts.mjs';

// Các loại khối được phép, theo thứ tự gợi ý. Mỗi khối có danh sách trường bắt buộc.
export const SECTION_TYPES = {
  intro: ['id', 'nav', 'eyebrow', 'h', 'p', 'img'],
  guides: ['id', 'nav', 'eyebrow', 'h', 'items'],
  facts: ['id', 'nav', 'eyebrow', 'h', 'items'],
  timeline: ['id', 'nav', 'eyebrow', 'h', 'items'],
  people: ['id', 'nav', 'eyebrow', 'h', 'lead', 'quote', 'leads', 'cast'],
  regions: ['id', 'nav', 'eyebrow', 'h', 'items'],
  features: ['id', 'nav', 'eyebrow', 'h', 'rows', 'cards'],
  gallery: ['id', 'nav', 'eyebrow', 'h', 'items'],
  tabs: ['id', 'nav', 'eyebrow', 'h', 'tabs'],
  editions: ['id', 'nav', 'eyebrow', 'h', 'cards', 'cta'],
  videos: ['id', 'nav', 'eyebrow', 'h', 'items'],
  history: ['id', 'nav', 'eyebrow', 'h', 'items'],
  todo: ['id', 'nav', 'eyebrow', 'h', 'items'],
  faq: ['id', 'nav', 'eyebrow', 'h', 'items'],
  news: ['id', 'nav', 'eyebrow', 'h', 'more'],
  banner: ['img', 'h'],
  cta: ['h', 'p', 'btn'],
  sources: ['h', 'p', 'links']
};

const walk = (v, fn, key = '') => {
  if (typeof v === 'string') fn(v, key);
  else if (Array.isArray(v)) v.forEach((x) => walk(x, fn, key));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, fn, k));
};

export function validate(spec, { exists }) {
  const err = [];
  const e = (m) => err.push(m);
  if (!/^[a-z0-9-]+$/.test(spec.slug || '')) e('slug phải là chữ thường, số, gạch ngang');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(spec.updated || '')) e('updated phải dạng YYYY-MM-DD');
  for (const k of ['a1', 'a2', 'a3', 'a4']) if (!/^#[0-9a-f]{6}$/i.test(spec.theme?.[k] || '')) e(`theme.${k} phải là màu #rrggbb`);
  if (!spec.countdown?.vn || !spec.countdown?.us || isNaN(Date.parse(spec.countdown.vn)) || isNaN(Date.parse(spec.countdown.us))) e('countdown.vn và countdown.us phải là thời điểm ISO hợp lệ');
  if (!spec.newsMatch) e('thiếu newsMatch (regex lọc tin tổng hợp)');
  else { try { new RegExp(spec.newsMatch, 'i'); } catch (x) { e('newsMatch không phải regex hợp lệ'); } }
  if (!/^https:\/\//.test(spec.official || '')) e('thiếu official (link trang chính thức)');
  if (!spec.searchImg || !exists(spec.searchImg.slice(1))) e('searchImg phải là ảnh cục bộ có thật (dùng cho chỉ mục tìm kiếm)');

  const langs = ['vi', 'en'];
  for (const l of langs) if (!spec.pages?.[l]) e(`thiếu pages.${l} (bắt buộc đủ VI và EN)`);
  if (err.length) return err;

  const ids = {};
  for (const l of langs) {
    const p = spec.pages[l];
    const at = `[${l}] `;
    if (!/^\/(en\/)?[a-z0-9-]+$/.test(p.path)) e(at + 'path sai dạng');
    if ((l === 'en') !== p.path.startsWith('/en/')) e(at + 'path EN phải nằm dưới /en/');
    if (!p.file || p.file !== p.path.slice(1) + '.html') e(at + 'file phải khớp path (path bỏ dấu / đầu + .html)');
    // tiêu đề, mô tả
    const tl = [...p.meta.title].length, dl = [...p.meta.description].length;
    if (tl < 40 || tl > 56) e(at + `meta.title ${tl} ký tự, phải 40-56`);
    if (dl < 110 || dl > 165) e(at + `meta.description ${dl} ký tự, phải 110-165`);
    if (!/OtaHub/.test(p.meta.description)) e(at + 'meta.description phải nêu OtaHub là bên nghiên cứu, tổng hợp');
    if (!p.ui?.by || !/OtaHub/.test(p.ui.by)) e(at + 'ui.by phải ghi "OtaHub nghiên cứu, tổng hợp" (EN: Researched & compiled by OtaHub)');
    if (!p.meta.ogImage?.startsWith('https://otahub.asia/assets/img/') || !exists(p.meta.ogImage.replace('https://otahub.asia/', ''))) e(at + 'meta.ogImage phải là ảnh cục bộ có thật (URL đầy đủ otahub.asia)');
    // hero
    const H = p.hero;
    for (const k of ['kicker', 'live', 'title', 'bg', 'bgPos', 'sub', 'ctas', 'clock', 'chips']) if (H?.[k] == null) e(at + `hero.${k} thiếu`);
    if (Array.isArray(H?.chips) && (H.chips.length < 2 || H.chips.length > 5)) e(at + 'hero.chips cần 2-5 nhãn (nhãn đầu là ngày ra mắt, được tô nổi bật)');
    if (H?.bgMobile && (!H.bgMobile.src || !H.bgMobile.pos)) e(at + 'hero.bgMobile cần src và pos');
    if (!p.ui?.scroll) e(at + 'ui.scroll (nhãn nút cuộn xuống) thiếu');
    for (const k of ['today', 'soon', 'daysLeft']) if (!p.ui?.[k]) e(at + `ui.${k} thiếu`);
    if (p.ui?.daysLeft && !p.ui.daysLeft.includes('{n}')) e(at + 'ui.daysLeft phải chứa {n}');
    if (H?.sub && !/OtaHub/.test(H.sub)) e(at + 'hero.sub phải nêu OtaHub nghiên cứu, tổng hợp');
    if (!Array.isArray(p.ticker) || p.ticker.length < 5) e(at + 'ticker cần tối thiểu 5 ý');
    // khối
    const secs = p.sections || [];
    if (!secs.length) e(at + 'không có khối nào');
    const seen = new Set();
    secs.forEach((s, i) => {
      const w = at + `khối #${i + 1} (${s.type}${s.id ? ' ' + s.id : ''}): `;
      if (!SECTION_TYPES[s.type]) return e(w + 'loại khối không được phép');
      for (const k of SECTION_TYPES[s.type]) if (s[k] == null || s[k] === '' || (Array.isArray(s[k]) && !s[k].length)) e(w + `thiếu trường "${k}"`);
      if (s.id) {
        if (!/^[a-z0-9-]+$/.test(s.id)) e(w + 'id sai dạng');
        if (seen.has(s.id)) e(w + 'id trùng');
        seen.add(s.id);
      }
      if (s.type === 'timeline') {
        const next = s.items.filter((x) => x.state === 'next').length;
        if (next !== 1) e(w + `phải có đúng 1 mốc state "next" (đang có ${next})`);
        s.items.forEach((x) => { if (!['done', 'todo', 'next'].includes(x.state)) e(w + `state "${x.state}" không hợp lệ`); });
      }
      if (s.type === 'facts') {
        s.items.forEach((x) => { if (!ICONS[x.icon]) e(w + `icon "${x.icon}" không có trong parts.mjs`); });
        // lưới 4 cột: các hàng phải đầy, không để ô trống
        let used = 0, row = 1;
        s.items.forEach((x) => { const sp = x.wide ? 2 : 1; if (used + sp > 4) { if (used !== 4) e(w + `hàng ${row} bị hụt ô (đang ${used}/4), chỉnh "wide"`); used = 0; row++; } used += sp; });
        if (used !== 4) e(w + `hàng cuối bị hụt ô (đang ${used}/4), chỉnh "wide"`);
      }
      if (s.type === 'timeline') s.items.forEach((x) => { if (x.kind && !['media', 'delay', 'leak', 'sale', 'news', 'launch'].includes(x.kind)) e(w + `kind "${x.kind}" không hợp lệ`); });
      if (s.type === 'editions' && s.cards.filter((c) => c.hot).length > 1) e(w + 'chỉ một phiên bản được "hot"');
      if (s.type === 'videos') s.items.forEach((v) => { if (!/^[\w-]{11}$/.test(v.id)) e(w + `id video "${v.id}" phải 11 ký tự`); });
      if (s.type === 'faq' && s.items.length < 5) e(w + 'FAQ cần tối thiểu 5 câu');
      if (s.type === 'gallery' && s.items.length < 6) e(w + 'thư viện ảnh cần tối thiểu 6 ảnh');
      if (s.type === 'people' && s.leads.length !== 2) e(w + 'people cần đúng 2 thẻ nhân vật chính');
    });
    ids[l] = secs.map((s) => `${s.type}:${s.id || ''}`);
    const idSet = new Set(secs.map((s) => s.id).filter(Boolean));
    secs.filter((s) => s.type === 'guides').forEach((s) => s.items.forEach((g) => { if (!idSet.has(g.href.replace(/^#/, ''))) e(at + `guides trỏ tới #${g.href.replace(/^#/, '')} không tồn tại`); }));
    H?.ctas?.forEach(([, href]) => { if (href.startsWith('#') && !idSet.has(href.slice(1))) e(at + `hero.cta trỏ tới ${href} không tồn tại`); });
    // thứ tự chuẩn
    if (secs[secs.length - 1]?.type !== 'sources') e(at + 'khối cuối cùng phải là sources');
    if (!secs.some((s) => s.type === 'news')) e(at + 'bắt buộc có khối news (tổng hợp tin)');
    if (!secs.some((s) => s.type === 'faq')) e(at + 'bắt buộc có khối faq');
    if (secs[0]?.type !== 'intro') e(at + 'khối đầu tiên phải là intro');
    // ảnh cục bộ, link nội bộ, dấu gạch dài
    walk(p, (v, key) => {
      if (/^(src|bg|thumb|img)$/.test(key) && v.startsWith('/')) { if (!v.startsWith('/assets/img/') || !exists(v.slice(1))) e(at + `ảnh không tồn tại hoặc sai thư mục: ${v}`); }
      if (/^(src|bg|thumb)$/.test(key) && /^https?:/.test(v)) e(at + `cấm ảnh ngoài site: ${v}`);
      if (v.includes('—')) e(at + `cấm dấu gạch dài "—" (site đã bỏ toàn bộ): "${v.slice(0, 40)}"`);
      if (/^\/[a-z0-9-]/.test(v) && /^(href|url)$/.test(key) && !v.includes('#') && !exists(v.slice(1) + '.html') && !exists(v.slice(1))) e(at + `link nội bộ không tồn tại: ${v}`);
    });
    walk(p.sections.filter((s) => s.type === 'cta' || s.type === 'sources'), (v) => { if (/^\/[a-z0-9-]/.test(v) && !v.includes('#') && !v.includes(' ') && v.length < 80 && !exists(v.slice(1) + '.html') && !exists(v.slice(1))) e(at + `link nội bộ không tồn tại: ${v}`); });
  }
  if (JSON.stringify(ids.vi) !== JSON.stringify(ids.en)) e('VI và EN phải có cùng danh sách khối (loại + id + thứ tự)');
  return err;
}
