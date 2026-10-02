// Điểm review OtaHub đã kiểm chứng: mục trong const REVIEWS (reviews.html / en/reviews.html)
// trỏ tới bài review thật có ô điểm <div class="score-num">X</div> khớp điểm trong REVIEWS.
// Dùng chung cho build-rankings.mjs và sync-profile-scores.mjs.
import fs from 'node:fs';
import vm from 'node:vm';

export const root = new URL('../../', import.meta.url);
export const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
export const write = (f, s) => fs.writeFileSync(new URL(f, root), s, 'utf8');
const exists = (f) => fs.existsSync(new URL(f, root));

export function loadReviews(file) {
  const m = read(file).match(/const REVIEWS\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!m) throw new Error('Không tìm thấy const REVIEWS trong ' + file);
  const scope = { Date };
  vm.runInNewContext('data=' + m[1], scope);
  return scope.data;
}

// File bài review của một url ('/x' -> 'x.html'); trang hồ sơ -detail không phải bài review
export function articleFile(url) {
  const p = String(url || '').split('?')[0].split('#')[0].replace(/^\//, '');
  if (!p || /-detail$/.test(p)) return null;
  return exists(p + '.html') ? p + '.html' : null;
}

export function articleInfo(file) {
  const s = read(file);
  const sc = s.match(/class="(?:score-num|vb-score)"[^>]*>\s*([0-9]+(?:[.,][0-9])?)/);
  const date = (s.match(/article:published_time" content="(\d{4}-\d{2}-\d{2})/) || [])[1] || '';
  return { score: sc ? parseFloat(sc[1].replace(',', '.')) : null, date };
}

const text = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Tóm tắt + nhận xét ở ô điểm của bài review (để trang hồ sơ trích dẫn)
export function articleSummary(file) {
  const s = read(file);
  const pick = (re) => text((s.match(re) || [])[1]);
  return {
    summary: pick(/<div class="hb-text">([\s\S]*?)<\/div>/) || pick(/<meta name="description" content="([^"]*)"/),
    verdict: pick(/class="score-verdict">([\s\S]*?)<\/div>/),
    sub: pick(/class="score-sub">([\s\S]*?)<\/div>/)
  };
}

// Map id -> { id, type, score, date, url, enUrl } chỉ gồm review hợp lệ ở cả VI và EN
export function verifiedReviews() {
  const en = new Map(loadReviews('en/reviews.html').map((r) => [r.id, r]));
  const out = new Map();
  for (const r of loadReviews('reviews.html')) {
    const f = articleFile(r.url);
    if (!f) continue;
    const a = articleInfo(f);
    if (a.score === null || Math.abs(a.score - parseFloat(r.score)) > 0.001) continue;
    const e = en.get(r.id);
    const ef = e && articleFile(e.url);
    if (!ef) continue;
    const ea = articleInfo(ef);
    if (ea.score === null || Math.abs(ea.score - a.score) > 0.001) continue;
    out.set(r.id, { id: r.id, type: r.type, score: a.score, date: a.date, url: r.url, enUrl: e.url, title: r.title, file: f, enFile: ef });
  }
  return out;
}
