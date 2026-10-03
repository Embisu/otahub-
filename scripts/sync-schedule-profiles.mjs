// Gắn hồ sơ (trang /ho-so/<slug>, EN: /en/profile/<slug>) và ảnh còn thiếu cho từng tựa trong lịch phát sóng anime
// (assets/schedule-data.js) và lịch phát hành game (assets/game-schedule-data.js). Hồ sơ lấy từ assets/profile-paths.json,
// ảnh thiếu lấy từ ảnh hồ sơ trong assets/catalog.json (chỉ dùng ảnh đã có sẵn trong repo, không tải từ ngoài).
// Trường thêm vào mỗi tựa: hs = đường dẫn hồ sơ VI, hse = đường dẫn hồ sơ EN.
//
// Chạy:  node scripts/sync-schedule-profiles.mjs           (ghi vào các file dữ liệu)
//        node scripts/sync-schedule-profiles.mjs --check   (chỉ báo, thoát mã 1 nếu lệch)
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { localize } from './lib/profile-paths.mjs';

const CHECK = process.argv.includes('--check');
const root = fileURLToPath(new URL('../', import.meta.url));
const paths = JSON.parse(fs.readFileSync(root + 'assets/profile-paths.json', 'utf8'));
const catalog = JSON.parse(fs.readFileSync(root + 'assets/catalog.json', 'utf8'));
const byType = { anime: new Map(), game: new Map() };
for (const [k, v] of Object.entries(paths)) { const [type, ...r] = k.split('|'); if (byType[type]) byType[type].set(r.join('|'), v); }
// Tên trong lịch khác khóa catalog
const ALIAS = { 'GTA 6': 'Grand Theft Auto VI', 'VAMPIR (bản toàn cầu)': 'VAMPIR', 'Norse Saga: Cửu Giới Thức Tỉnh': 'Norse Saga', 'Make Drama: MAD (bản toàn cầu)': 'Make Drama: MAD' };
const localImg = (u) => u && fs.existsSync(root + u.slice(1).split('?')[0]);
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

function run(rel, type) {
  const file = root + rel;
  const src = fs.readFileSync(file, 'utf8');
  const NL = src.includes('\r\n') ? '\r\n' : '\n';
  const byTitle = byType[type];
  let withProfile = 0, filledImg = 0, total = 0;
  const noProfile = [], noImg = [];
  const out = src.split(NL).map((line) => {
    const m = line.match(/^(\s*)(\{t:.*\})(,?)\s*$/);
    if (!m) return line;
    total++;
    const a = new Function('return ' + m[2])();
    const names = [a.t, a.tv, a.r, ALIAS[a.t]].filter(Boolean);
    const key = names.find((n) => byTitle.has(n));
    let body = m[2].replace(/,\s*hse?:'(?:[^'\\]|\\.)*'/g, '');
    if (key) {
      const hs = byTitle.get(key);
      body = body.replace(/\}$/, `, hs:${q(hs)}, hse:${q(localize(hs, true))}}`);
      withProfile++;
    } else noProfile.push(a.t);
    if (!localImg(a.i)) {
      const c = names.map((n) => catalog[n]).find((x) => x && localImg(x.img) && !/placeholder/.test(x.img));
      if (c) {
        body = /\bi:'[^']*'/.test(body) ? body.replace(/\bi:'[^']*'/, `i:${q(c.img)}`) : body.replace(/\}$/, `, i:${q(c.img)}}`);
        filledImg++;
      } else noImg.push(a.t);
    }
    return m[1] + body + m[3];
  });
  const next = out.join(NL);
  console.log(`${rel}: ${total} tựa · hồ sơ ${withProfile} · bổ sung ảnh ${filledImg}${noProfile.length ? ` · thiếu hồ sơ: ${noProfile.join('; ')}` : ''}${noImg.length ? ` · vẫn thiếu ảnh: ${noImg.join('; ')}` : ''}`);
  if (next !== src) {
    console.log(CHECK ? `${rel} cần cập nhật` : `đã ghi ${rel}`);
    if (!CHECK) fs.writeFileSync(file, next);
    else process.exitCode = 1;
  }
}
run('assets/schedule-data.js', 'anime');
run('assets/game-schedule-data.js', 'game');
