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
export function normalizeRole(role) {
  return ROLES.includes(role) ? role : 'author';
}
export function canManageUsers(user) {
  return !!user && user.role === 'admin';
}
// Cac duong dan duoc xem la "trang he thong" — chi admin/editor duoc ghi.
// Moi duong dan khac (bai viet .html o thu muc goc + en/) duoc xem la "bai viet",
// author cung ghi duoc.
const SYSTEM_FILE_EXACT = new Set([
  'index.html', 'gaming.html', 'anime.html', 'manga.html', 'news.html',
  'reviews.html', 'choi-gi.html', 'recommend.html', 'lich-phat-song.html',
  'sap-ra-mat.html', 'rankings.html', 'chuyen-sau.html', 'in-depth.html',
  'about.html', 'lien-he.html', 'chinh-sach-bao-mat.html', 'admin.html',
  'anime-detail.html', '404.html', 'sitemap.xml', 'feed.xml',
  'en/index.html', 'en/gaming.html', 'en/anime.html', 'en/manga.html', 'en/news.html',
  'en/reviews.html', 'en/choi-gi.html', 'en/recommend.html', 'en/lich-phat-song.html',
  'en/sap-ra-mat.html', 'en/rankings.html', 'en/chuyen-sau.html', 'en/in-depth.html',
  'en/about.html', 'en/lien-he.html', 'en/chinh-sach-bao-mat.html',
]);
const SYSTEM_FILE_PREFIX = ['assets/', 'worker/', 'templates/', 'scripts/', '.github/'];
export function isSystemFile(ghPath) {
  if (SYSTEM_FILE_EXACT.has(ghPath)) return true;
  return SYSTEM_FILE_PREFIX.some((p) => ghPath.startsWith(p));
}
export function canWritePath(user, ghPath) {
  if (!user) return false;
  if (user.role === 'contributor') return false;
  if (user.role === 'admin' || user.role === 'editor') return true;
  // author: duoc ghi moi thu TRU cac file he thong
  return !isSystemFile(ghPath);
}
// Luu ban nhap (KHONG dong nghia voi xuat ban that len GitHub) — contributor
// duoc phep luu nhap de nguoi khac review, day chinh la ly do vai tro nay
// ton tai. Van gioi han theo pham vi file giong author (khong nhap duoc trang
// he thong) de tranh hieu lam nham hoac lam roi cau truc site.
export function canDraftPath(user, ghPath) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'editor') return true;
  return !isSystemFile(ghPath);
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
export async function listDrafts(env) {
  const list = await env.ADMIN_KV.list({ prefix: 'draft:' });
  const out = [];
  for (const k of list.keys) {
    const raw = await env.ADMIN_KV.get(k.name);
    if (!raw) continue;
    const d = JSON.parse(raw);
    out.push({ file: d.file, updatedAt: d.updatedAt, updatedBy: d.updatedBy });
  }
  out.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return out;
}

// ── Rate limit dang nhap ─────────────────────────────────────────────────
const LOGIN_MAX_ATTEMPTS = 6;
const LOGIN_LOCK_SECONDS = 10 * 60; // khoa 10 phut sau khi vuot qua so lan sai

export async function checkLoginLock(env, username) {
  const raw = await env.ADMIN_KV.get(`loginfail:${username}`);
  if (!raw) return { locked: false, attempts: 0 };
  const data = JSON.parse(raw);
  return { locked: (data.count || 0) >= LOGIN_MAX_ATTEMPTS, attempts: data.count || 0 };
}
export async function recordLoginFailure(env, username) {
  const key = `loginfail:${username}`;
  const raw = await env.ADMIN_KV.get(key);
  const count = raw ? (JSON.parse(raw).count || 0) + 1 : 1;
  await env.ADMIN_KV.put(key, JSON.stringify({ count }), { expirationTtl: LOGIN_LOCK_SECONDS });
}
export async function clearLoginFailures(env, username) {
  await env.ADMIN_KV.delete(`loginfail:${username}`);
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
    return { username: u.username, role: normalizeRole(u.role) };
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
