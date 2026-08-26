// Cac ham dung chung cho worker/admin-api.js: bam mat khau, quan ly session, cookie.

const ITERATIONS = 100000;
const KEY_LEN = 32; // bytes
const SESSION_TTL = 60 * 60 * 24 * 14; // 14 ngay

// ── Phan quyen (RBAC) ────────────────────────────────────────────────────
// admin       : toan quyen — quan ly user, ghi moi file.
// editor      : ghi moi file (bai viet + trang site) nhung khong quan ly user.
// author      : chi ghi duoc file bai viet (khong dung duoc trang chu/hub/trang
//               he thong/worker/assets) — tranh vo cau truc site do thao tac nham.
// contributor : khong duoc ghi truc tiep (danh cho quy trinh duyet bai sau nay).
export const ROLES = ['admin', 'editor', 'author', 'contributor'];
// Tai khoan tao TRUOC khi RBAC ton tai khong co truong `role` trong KV (moi ban
// ghi user tu handleSetup/handleUsersPost hien nay LUON ghi ro role, nen `role`
// chi co the la undefined doi voi tai khoan cu). Truoc RBAC khong co phan cap —
// ai dang nhap duoc cung sua duoc moi thu — nen coi thieu-role la "admin cu" de
// khong vo tinh tuoc quyen quan tri cua ho khi nang cap. Con neu `role` CO gia
// tri nhung khong hop le (du lieu loi/sai) thi ve author (it quyen nhat) de
// an toan, vi day la truong hop bat thuong that su chu khong phai tai khoan cu.
export function normalizeRole(role) {
  if (role === undefined || role === null) return 'admin';
  return ROLES.includes(role) ? role : 'author';
}
export function canManageUsers(user) {
  return !!user && user.role === 'admin';
}
// Cac duong dan duoc xem la "trang he thong" — chi admin/editor duoc ghi.
// Van giu de dung noi khac can biet 1 duong dan co phai trang he thong khong,
// nhung KHONG con dung lam co so cap quyen cho author/contributor (xem
// isArticleFile ben duoi) — mot danh sach cam se luon co nguy co bo sot file
// moi (robots.txt, _headers, manifest.json, v.v...) va vo tinh cho ghi nham.
const SYSTEM_FILE_EXACT = new Set([
  'index.html', 'gaming.html', 'anime.html', 'manga.html', 'news.html',
  'reviews.html', 'choi-gi.html', 'recommend.html', 'lich-phat-song.html',
  'sap-ra-mat.html', 'rankings.html', 'chuyen-sau.html', 'in-depth.html',
  'about.html', 'lien-he.html', 'chinh-sach-bao-mat.html', 'admin.html',
  '404.html', 'anime-detail.html', 'article.html', 'bai-viet.html',
  'game-detail.html', 'huong-dan.html', 'manga-detail.html',
  'sitemap.xml', 'feed.xml',
  'en/index.html', 'en/gaming.html', 'en/anime.html', 'en/manga.html', 'en/news.html',
  'en/reviews.html', 'en/choi-gi.html', 'en/recommend.html', 'en/lich-phat-song.html',
  'en/sap-ra-mat.html', 'en/rankings.html', 'en/chuyen-sau.html', 'en/in-depth.html',
  'en/about.html', 'en/lien-he.html', 'en/chinh-sach-bao-mat.html', 'en/404.html',
  'en/anime-detail.html', 'en/article.html', 'en/bai-viet.html',
  'en/game-detail.html', 'en/huong-dan.html', 'en/manga-detail.html',
]);
const SYSTEM_FILE_PREFIX = ['assets/', 'worker/', 'templates/', 'scripts/', '.github/'];
export function isSystemFile(ghPath) {
  if (SYSTEM_FILE_EXACT.has(ghPath)) return true;
  return SYSTEM_FILE_PREFIX.some((p) => ghPath.startsWith(p));
}
// Danh sach CHO PHEP (allowlist) thay vi danh sach cam — author/contributor
// CHI duoc dung toi file bai viet .html o thu muc goc hoac en/, khong khop
// ten trang he thong. Bat ky file nao khac (robots.txt, _headers, _redirects,
// manifest.json, sitemap-news.xml, file moi bat ky...) mac dinh BI CHAN, phai
// duoc admin/editor ghi thay vi vo tinh duoc author ghi vi bi bo sot khoi
// danh sach cam.
const ARTICLE_FILE_RE = /^(en\/)?[a-z0-9][a-z0-9-]*\.html$/;
export function isArticleFile(ghPath) {
  return ARTICLE_FILE_RE.test(ghPath) && !SYSTEM_FILE_EXACT.has(ghPath);
}
export function canWritePath(user, ghPath) {
  if (!user) return false;
  if (user.role === 'contributor') return false;
  if (user.role === 'admin' || user.role === 'editor') return true;
  // author: CHI duoc ghi bai viet .html (allowlist) — khong con la "moi thu
  // tru file he thong" nhu truoc.
  return isArticleFile(ghPath);
}
// Luu ban nhap (KHONG dong nghia voi xuat ban that len GitHub) — contributor
// duoc phep luu nhap de nguoi khac review, day chinh la ly do vai tro nay
// ton tai. Van gioi han theo allowlist bai viet giong author.
export function canDraftPath(user, ghPath) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'editor') return true;
  return isArticleFile(ghPath);
}
// Cho phep tai anh len (assets/img/uploads/<ten-file>) — rieng biet voi
// canWritePath vi day khong phai bai viet .html. Author/editor/admin (khong
// tinh contributor, vi contributor chua duoc "xuat ban" bat ky thu gi truc
// tiep) deu duoc tai anh, nhung CHI vao thu muc uploads/ va CHI dinh dang anh
// an toan — khong the loi dung de ghi de file khac trong assets/.
const UPLOAD_IMAGE_RE = /^assets\/img\/uploads\/[a-z0-9]{4,16}-[a-z0-9._-]{1,100}\.(jpe?g|png|webp|gif)$/i;
export function canUploadImage(user, ghPath) {
  if (!user) return false;
  if (user.role === 'contributor') return false;
  return UPLOAD_IMAGE_RE.test(ghPath);
}

// Xoa anh trong Media Library (assets/img/, ke ca assets/img/uploads/) — chi
// admin/editor, vi xoa 1 anh dang duoc bai viet khac tham chieu se lam vo
// hinh anh o noi khac tren site (author/contributor khong duoc xoa).
const DELETE_IMAGE_RE = /^assets\/img\/[a-z0-9._/-]+\.(jpe?g|png|webp|gif|svg)$/i;
export function canDeleteImage(user, ghPath) {
  if (!user) return false;
  if (user.role !== 'admin' && user.role !== 'editor') return false;
  return DELETE_IMAGE_RE.test(ghPath);
}

// Khong chi tin vao duoi file: xac minh magic bytes cua anh sau khi decode
// base64 de ngan HTML/JS doi ten thanh .png/.jpg duoc day len cung origin.
export function hasValidImageSignature(ghPath, base64Content) {
  if (!UPLOAD_IMAGE_RE.test(ghPath) || typeof base64Content !== 'string') return false;
  let bytes;
  try {
    const raw = atob(base64Content.slice(0, 64));
    bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0));
  } catch { return false; }
  const ends = (values) => values.every((value, index) => bytes[index] === value);
  const ext = ghPath.split('.').pop().toLowerCase();
  if ((ext === 'jpg' || ext === 'jpeg') && ends([0xff, 0xd8, 0xff])) return true;
  if (ext === 'png' && ends([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return true;
  if (ext === 'gif' && (new TextDecoder().decode(bytes.slice(0, 6)) === 'GIF87a' || new TextDecoder().decode(bytes.slice(0, 6)) === 'GIF89a')) return true;
  if (ext === 'webp' && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP') return true;
  return false;
}

// ── Ban nhap (draft) ─────────────────────────────────────────────────────
// Luu tam trong KV, KHONG dung ghi vao GitHub — cho phep autosave lien tuc
// ma khong tao hang loat commit "rac" tren production. Chi khi bam that
// "Luu & Deploy" (ghPut) moi thanh 1 commit that, va draft se bi xoa sau do.
export async function putDraft(env, ghPath, html, username) {
  const key = `draft:${ghPath}`;
  await env.ADMIN_KV.put(key, JSON.stringify({ file: ghPath, html, updatedAt: Date.now(), updatedBy: username }));
}
export async function getDraftRaw(env, ghPath) {
  const raw = await env.ADMIN_KV.get(`draft:${ghPath}`);
  return raw ? JSON.parse(raw) : null;
}
export async function deleteDraft(env, ghPath) {
  await env.ADMIN_KV.delete(`draft:${ghPath}`);
}
// Ai duoc phep xem/ghi de/xoa 1 ban nhap: chinh chu nhan (updatedBy) hoac
// admin/editor (can thay duoc de review/tiep quan bai cua contributor — day
// la ly do chinh vai tro contributor + draft ton tai). Author/contributor
// khac KHONG duoc dung toi ban nhap cua nguoi khac.
export function canViewDraft(user, draft) {
  if (!user || !draft) return false;
  if (user.role === 'admin' || user.role === 'editor') return true;
  return draft.updatedBy === user.username;
}
// Danh sach toan bo draft — CHI admin/editor moi thay het (de biet ai dang
// soan gi ma review). Author/contributor chi thay draft cua chinh minh, tranh
// lo thong tin "ai dang viet bai gi" cho cac tai khoan khac.
export async function listDrafts(env, user) {
  const list = await env.ADMIN_KV.list({ prefix: 'draft:' });
  const out = [];
  for (const k of list.keys) {
    const raw = await env.ADMIN_KV.get(k.name);
    if (!raw) continue;
    const d = JSON.parse(raw);
    if (user && user.role !== 'admin' && user.role !== 'editor' && d.updatedBy !== user.username) continue;
    out.push({ file: d.file, updatedAt: d.updatedAt, updatedBy: d.updatedBy });
  }
  out.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return out;
}

// ── Rate limit dang nhap ─────────────────────────────────────────────────
// Khoa theo CAP (IP, username) chu khong chi theo username — neu chi khoa
// theo username thi bat ky ai biet ten dang nhap cua admin deu co the doan
// sai 6 lan tu xa de khoa han tai khoan do 10 phut, ke ca voi chinh chu tai
// khoan dang dang nhap tu may/IP binh thuong cua ho (tu-DoS ho tu xa). Khoa
// theo cap (IP, username) nghia la ke tan cong tu IP la chi tu khoa duoc IP
// cua chinh no doi voi username do — chu nhan that van dang nhap binh thuong
// tu IP quen thuoc cua ho trong luc bi tan cong.
// Ngoai ra co them khoa rieng theo IP (khong phan biet username) voi nguong
// cao hon, de chan viec 1 IP spam that nhieu username khac nhau tao vo so
// key KV (moi username gia se ra 1 key moi neu chi khoa theo cap).
const LOGIN_MAX_ATTEMPTS = 6;       // nguong khoa theo cap (IP, username)
const LOGIN_IP_MAX_ATTEMPTS = 20;   // nguong khoa theo IP rieng (chan spam nhieu username)
const LOGIN_LOCK_SECONDS = 10 * 60; // khoa 10 phut sau khi vuot qua so lan sai

async function bumpFailCounter(env, key) {
  const raw = await env.ADMIN_KV.get(key);
  const count = raw ? (JSON.parse(raw).count || 0) + 1 : 1;
  await env.ADMIN_KV.put(key, JSON.stringify({ count }), { expirationTtl: LOGIN_LOCK_SECONDS });
  return count;
}
export async function checkLoginLock(env, ip, username) {
  const safeIp = ip || 'unknown';
  const [ipRaw, pairRaw] = await Promise.all([
    env.ADMIN_KV.get(`loginfail:ip:${safeIp}`),
    env.ADMIN_KV.get(`loginfail:pair:${safeIp}:${username}`),
  ]);
  const ipCount = ipRaw ? (JSON.parse(ipRaw).count || 0) : 0;
  const pairCount = pairRaw ? (JSON.parse(pairRaw).count || 0) : 0;
  return { locked: ipCount >= LOGIN_IP_MAX_ATTEMPTS || pairCount >= LOGIN_MAX_ATTEMPTS, attempts: pairCount };
}
export async function recordLoginFailure(env, ip, username) {
  const safeIp = ip || 'unknown';
  await Promise.all([
    bumpFailCounter(env, `loginfail:ip:${safeIp}`),
    bumpFailCounter(env, `loginfail:pair:${safeIp}:${username}`),
  ]);
}
export async function clearLoginFailures(env, ip, username) {
  const safeIp = ip || 'unknown';
  // Chi xoa bo dem theo CAP (IP, username) khi dang nhap dung — KHONG xoa bo
  // dem rieng theo IP, vi 1 lan dang nhap dung tu 1 IP dung chung (NAT/proxy)
  // khong nen "giai phong" spam cua ke khac tu cung IP do.
  await env.ADMIN_KV.delete(`loginfail:pair:${safeIp}:${username}`);
}

// ── Nhat ky hoat dong (audit log) ────────────────────────────────────────
// Luu 500 dong gan nhat trong 1 key duy nhat (danh cho quy mo nho, du dung).
const AUDIT_KEY = 'auditlog';
const AUDIT_MAX = 500;
export async function logAudit(env, entry) {
  try {
    const raw = await env.ADMIN_KV.get(AUDIT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ ...entry, at: Date.now() });
    if (list.length > AUDIT_MAX) list.length = AUDIT_MAX;
    await env.ADMIN_KV.put(AUDIT_KEY, JSON.stringify(list));
  } catch (e) { /* audit log khong bao gio duoc lam hong request chinh */ }
}
export async function getAuditLog(env, limit = 100) {
  const raw = await env.ADMIN_KV.get(AUDIT_KEY);
  const list = raw ? JSON.parse(raw) : [];
  return list.slice(0, limit);
}

function toHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function fromHex(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
export function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr);
}

export async function hashPassword(password, saltHex) {
  const salt = saltHex ? fromHex(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_LEN * 8
  );
  return { salt: toHex(salt), hash: toHex(bits) };
}

export async function verifyPassword(password, saltHex, hashHex) {
  const { hash } = await hashPassword(password, saltHex);
  return hash === hashHex;
}

export function parseCookies(request) {
  const header = request.headers.get('Cookie') || '';
  const out = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

export function sessionCookie(sessionId, maxAge = SESSION_TTL) {
  return `ota_admin_session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}
export function clearSessionCookie() {
  return `ota_admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

// Tra ve { username } tu session — KHONG chua role (role co the doi sau khi
// dang nhap, nen luon lay lai tu ban ghi user moi nhat qua getSessionUser()).
async function getSession(request, env) {
  const cookies = parseCookies(request);
  const sid = cookies['ota_admin_session'];
  if (!sid) return null;
  const raw = await env.ADMIN_KV.get(`session:${sid}`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// Tra ve user day du { username, role, createdAt } — role luon la gia tri moi
// nhat trong KV (khong bi cache trong session), de doi role co hieu luc ngay
// ma khong can nguoi dung dang nhap lai.
export async function getSessionUser(request, env) {
  const session = await getSession(request, env);
  if (!session) return null;
  const raw = await env.ADMIN_KV.get(`user:${session.username.toLowerCase()}`);
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    const role = normalizeRole(u.role);
    // Backfill mot lan de du lieu legacy tro thanh minh bach, tranh moi request
    // sau nay phai tiep tuc dua vao fallback quyen admin.
    if (u.role === undefined || u.role === null) {
      u.role = role;
      await env.ADMIN_KV.put(`user:${session.username.toLowerCase()}`, JSON.stringify(u));
    }
    return { username: u.username, role };
  } catch { return null; }
}

export async function createSession(env, username) {
  const sid = randomHex(32);
  await env.ADMIN_KV.put(`session:${sid}`, JSON.stringify({ username, createdAt: Date.now() }), { expirationTtl: SESSION_TTL });
  return sid;
}

export async function deleteSession(env, sid) {
  if (sid) await env.ADMIN_KV.delete(`session:${sid}`);
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
