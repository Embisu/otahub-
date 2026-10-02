// Điểm trên trang hồ sơ (anime/manga/game-detail) = điểm review OtaHub đã đăng. Không có điểm nhập tay.
//
// Thứ tự nguồn điểm cho mỗi hồ sơ trong assets/catalog.json:
//   1. 'review': bài review thật (PROFILE_REVIEW) có ô điểm khớp trang Đánh giá -> điểm + link bài.
//   2. 'hub'   : trang Đánh giá có mục trỏ thẳng tới hồ sơ này (bài review nằm ngay trong hồ sơ).
//   3. không có -> score: null, trang hồ sơ hiện "Chưa chấm điểm".
// Phần chữ của hồ sơ không được chứa điểm số (tránh lệch với điểm thật): script bỏ "Kết luận: 9,6/10."
// thành "Kết luận: ...", và gỡ các đoạn văn mẫu lặp lại giữa các hồ sơ.
//
// Chạy:  node scripts/sync-profile-scores.mjs          (kiểm tra + ghi catalog.json)
//        node scripts/sync-profile-scores.mjs --check  (chỉ kiểm tra)
import { read, write, loadReviews, verifiedReviews, articleSummary } from './lib/review-scores.mjs';
import { PROFILE_REVIEW } from './lib/profile-review-map.mjs';

const CHECK = process.argv.includes('--check');

// Hồ sơ -> id bài review (reviews.html). Cùng loại (game/anime/manga) mới được ghép.

// Đoạn văn mẫu (không mang thông tin riêng của tác phẩm) -> gỡ khỏi hồ sơ
const BOILERPLATE = [
  /^OtaHub evaluates this title through its premise/,
  /^Khi đánh giá hồ sơ này, OtaHub ưu tiên/,
  /^Điểm \d+[.,]\d\/10 (?:trên OtaHub )?là đánh giá biên tập/,
  /^OtaHub's \d+[.,]\d\/10 is an editorial/,
  /^The \d+[.,]\d\/10 rating is OtaHub/,
  /^This profile separates confirmed facts/,
  /^Hồ sơ tách biệt dữ kiện đã xác nhận/,
  /là đơn vị sáng tạo hoặc phát hành chính được ghi nhận\. Mốc phát hành hiện tại/,
  /is the principal credited creator or publishing partner\. The current release marker/,
  /^Hồ sơ phù hợp để đọc trước khi bắt đầu tác phẩm/,
  /^This profile is designed as a spoiler-light starting point/,
  /^Vì trò chơi chưa phát hành rộng rãi, điểm trên bảng xếp hạng/,
  /^Because it has not launched widely, the ranking reflects/
];
const VERDICT = /^(Kết luận|Verdict):\s*\d+[.,]\d\s*\/\s*10\.?\s*/;

// Kết luận/dữ kiện cũ mâu thuẫn với bài review đã đăng -> viết lại theo bài review
const OVERRIDE = {
  'Tekken 8: Season 2': {
    story: { 1: 'Heat System tiếp tục được tinh chỉnh, và chính các thay đổi cân bằng của Season 2 là tâm điểm tranh cãi trong cộng đồng.',
      4: 'Kết luận: Phần lõi đối kháng 3D của Tekken 8 vẫn sâu và đẹp mắt, nhưng bản cập nhật Season 2 gây phản ứng mạnh: game bị review-bomb và lượng người chơi trong 24 giờ có lúc rơi xuống dưới 6.000, mức thấp nhất kể từ khi ra mắt. Điểm số chấm cho bản cập nhật này, không phải cho toàn bộ Tekken 8.' },
    storyEn: { 1: 'The Heat System keeps being tuned, and Season 2’s balance changes became the main point of contention in the community.',
      4: 'Verdict: Tekken 8’s 3D fighting core is still deep and spectacular, but the Season 2 update triggered a strong backlash: the game was review-bombed and its 24-hour player count dipped below 6,000, a record low since launch. The score covers this update, not Tekken 8 as a whole.' }
  },
  Berserk: {
    story: { 4: 'Kết luận: Berserk vẫn là một trong những tác phẩm dark fantasy quan trọng nhất của manga. Điểm số chấm cho giai đoạn hiện tại: Studio Gaga tiếp tục arc Fantasia theo định hướng Kentaro Miura để lại một cách tôn trọng, nhưng các quãng nghỉ dài (chương 384 trở lại sau 9 tháng) khiến mạch đọc bị đứt quãng.' },
    storyEn: { 4: 'Verdict: Berserk remains one of the most important dark fantasy works in manga. The score covers its current phase: Studio Gaga respectfully continues the Fantasia arc along the direction Kentaro Miura left behind, but long breaks (chapter 384 returned after nine months) make the reading rhythm uneven.' }
  },
  'Hollow Knight: Silksong': {
    status: 'Đã phát hành', statusEn: 'Released', release: '04/09/2025',
    story: { 1: 'Lối chơi của Hornet cơ động hơn hẳn The Knight ở phần 1: di chuyển nhanh, bám tường, nhào lộn trên không và dùng tơ để hồi máu ngay trong lúc di chuyển.',
      4: 'Kết luận: Sau nhiều năm chờ đợi, Silksong đáp ứng kỳ vọng với lối chơi cơ động hơn hẳn phần đầu và vương quốc Pharloom giàu chi tiết; độ khó cao là rào cản đáng cân nhắc với người mới.' },
    storyEn: { 4: 'Verdict: After years of waiting, Silksong lives up to expectations with far more agile movement than the original and a richly detailed Pharloom; its steep difficulty is the main caveat for newcomers.' }
  }
};

const errors = [];
const fail = (m) => errors.push(m);
const catalog = JSON.parse(read('assets/catalog.json'));
const verified = verifiedReviews();
const norm = (u) => decodeURIComponent(String(u || '')).replace(/^\/en\//, '/');
const hubProfile = new Map();
for (const r of loadReviews('reviews.html')) {
  const m = norm(r.url).match(/^\/(game|anime|manga)-detail\?t=(.+)$/);
  if (m) hubProfile.set(m[1] + '|' + m[2], r);
}
const hubEn = new Map(loadReviews('en/reviews.html').map((r) => [r.id, r]));

for (const [key, id] of Object.entries(PROFILE_REVIEW)) {
  if (!catalog[key]) fail(`PROFILE_REVIEW: không có hồ sơ "${key}" trong catalog.json`);
  else if (!verified.has(id)) fail(`PROFILE_REVIEW["${key}"]: "${id}" không phải bài review hợp lệ (thiếu bài, thiếu ô điểm hoặc lệch điểm)`);
  else if (verified.get(id).type !== catalog[key].type) fail(`PROFILE_REVIEW["${key}"]: hồ sơ ${catalog[key].type} nhưng bài review là ${verified.get(id).type}`);
}
for (const [k, r] of hubProfile) {
  const [type, title] = k.split('|');
  if (!catalog[title] || catalog[title].type !== type) fail(`reviews.html "${r.id}" trỏ tới hồ sơ không tồn tại: ${type} "${title}"`);
}

const stats = { review: 0, hub: 0, none: 0, removed: 0 };
for (const [key, e] of Object.entries(catalog)) {
  const o = OVERRIDE[key] || {};
  for (const f of ['status', 'statusEn', 'release']) if (o[f]) e[f] = o[f];
  for (const f of ['story', 'storyEn']) {
    if (!Array.isArray(e[f])) continue;
    if (o[f]) for (const [i, txt] of Object.entries(o[f])) e[f][i] = txt;
    const before = e[f].length;
    e[f] = e[f].filter((p) => !BOILERPLATE.some((re) => re.test(p)))
      .map((p) => p.replace(VERDICT, (m, w) => `${w}: `))
      .filter((p, i, a) => a.indexOf(p) === i);
    stats.removed += before - e[f].length;
  }
  for (const f of ['story', 'storyEn', 'hook', 'hookEn']) {
    const txt = [].concat(e[f] || []).join(' ');
    if (/\d+[.,]\d\s*\/\s*10/.test(txt)) fail(`"${key}".${f} vẫn còn điểm số trong phần chữ`);
  }
  const id = PROFILE_REVIEW[key];
  const hub = hubProfile.get(e.type + '|' + key);
  for (const f of ['review', 'reviewEn', 'verdict', 'verdictEn', 'reviewSummary', 'reviewSummaryEn', 'reviewNote', 'reviewNoteEn']) delete e[f];
  if (id) {
    const r = verified.get(id);
    if (!r) continue;
    if (hub && Math.abs(parseFloat(hub.score) - r.score) > 0.001) fail(`"${key}": mục hồ sơ trên trang Đánh giá (${hub.score}) lệch bài review (${r.score})`);
    const v = articleSummary(r.file), ve = articleSummary(r.enFile);
    if (!v.summary || !ve.summary) fail(`"${key}": bài review ${!v.summary ? r.file : r.enFile} thiếu phần tóm tắt`);
    Object.assign(e, { score: r.score.toFixed(1), scoreSource: 'review', review: r.url, reviewEn: r.enUrl,
      verdict: v.verdict, verdictEn: ve.verdict, reviewSummary: v.summary, reviewSummaryEn: ve.summary, reviewNote: v.sub, reviewNoteEn: ve.sub });
    stats.review++;
  } else if (hub) {
    const he = hubEn.get(hub.id) || {};
    Object.assign(e, { score: parseFloat(hub.score).toFixed(1), scoreSource: 'hub',
      verdict: hub.verdict || '', verdictEn: he.verdict || '', reviewSummary: hub.desc || '', reviewSummaryEn: he.desc || '' });
    stats.hub++;
  } else {
    Object.assign(e, { score: null, scoreSource: null });
    stats.none++;
  }
}

if (errors.length) {
  console.error('KHÔNG cập nhật catalog.json, cần sửa:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
console.log(`Hồ sơ: ${stats.review} điểm từ bài review, ${stats.hub} điểm từ trang Đánh giá, ${stats.none} chưa chấm điểm; gỡ ${stats.removed} đoạn văn mẫu/trùng`);
if (!CHECK) write('assets/catalog.json', JSON.stringify(catalog, null, 2) + '\n');

// ---- Điểm in sẵn trên các trang khác (thẻ bài, khung bên) phải khớp điểm thật ----
// Thẻ trỏ tới bài review hoặc hồ sơ: số điểm = điểm thật; chưa chấm điểm -> bỏ số.
const scoreByUrl = new Map();
for (const r of verified.values()) { scoreByUrl.set(r.url, r.score.toFixed(1)); scoreByUrl.set(r.enUrl, r.score.toFixed(1)); }
const PROFILE_ALIAS = { 'Kaiju No 8': 'Kaiju No.8', 'Ghost of Yōtei': 'Ghost of Yōtei: Complete Edition', 'Solo Leveling': 'Solo Leveling Season 2', TBATE: 'The Beginning After The End', 'Sousou no Frieren': 'Frieren Season 2', 'Bleach: TYBW Part 5': 'Bleach: TYBW Final Part' };
function canonFor(url) {
  const m = url.match(/^(?:\/en)?\/(game|anime|manga)-detail\?t=([^"'&#]+)/);
  if (m) {
    const t = decodeURIComponent(m[2]);
    const key = m[1] === 'anime' && catalog[t + ' (Anime)'] ? t + ' (Anime)' : PROFILE_ALIAS[t] || t;
    return catalog[key] ? catalog[key].score : undefined;
  }
  return scoreByUrl.has(url) ? scoreByUrl.get(url) : undefined;
}
const PAGES = ['index', 'news', 'gaming', 'anime', 'manga'].flatMap((p) => [p + '.html', 'en/' + p + '.html']);
let fixed = 0;
for (const file of PAGES) {
  const en = file.startsWith('en/');
  let html = read(file);
  const before = html;
  // Trang EN trỏ nhầm sang hồ sơ bản VI
  if (en) html = html.replace(/(['"])\/(game|anime|manga)-detail\?t=/g, '$1/en/$2-detail?t=');
  // a) <a href="..."> ... <div class="...score...">9.6</div> ... </a>
  html = html.replace(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g, (a, url) => {
    const canon = canonFor(url);
    if (canon === undefined) return a;
    return a.replace(/(<(div|span)\b[^>]*class="[^"]*\b(?:rk-score|mi-score|ac-score|score)\b[^"]*"[^>]*>)\s*\d{1,2}\.\d\s*(<\/\2>)/g,
      (m, open, tag, close) => (canon ? open + canon + close : ''));
  });
  // b) dữ liệu thẻ trong JS: { url: '...', tag: 'Review · 9.8', meta: 'Studio · 9.8 Score' }
  html = html.replace(/\{[^{}]*?\burl:\s*(['"])([^'"]+)\1[^{}]*\}/g, (obj, q, url) => {
    const canon = canonFor(url);
    if (canon === undefined) return obj;
    return obj.replace(/\b(tag|meta):\s*(['"])([^'"]*)\2/g, (m, field, qq, val) => {
      const v = val.replace(/(\s*·\s*)?\b\d{1,2}\.\d(\s*Score)?(?=\s*(?:·|$))/g, (n, sep, sc) => (canon ? (sep || '') + canon + (sc || '') : ''));
      return `${field}: ${qq}${v}${qq}`;
    });
  });
  if (html !== before) {
    fixed++;
    if (!CHECK) write(file, html);
    console.log(`${file}: ${CHECK ? 'cần đồng bộ điểm' : 'đã đồng bộ điểm'}`);
  }
}
if (CHECK && fixed) process.exitCode = 1;
