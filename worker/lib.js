// Cac ham dung chung cho worker/admin-api.js: bam mat khau, quan ly session, cookie.

const ITERATIONS = 100000;
const KEY_LEN = 32; // bytes
const SESSION_TTL = 60 * 60 * 24 * 14; // 14 ngay

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

export async function getSessionUser(request, env) {
  const cookies = parseCookies(request);
  const sid = cookies['ota_admin_session'];
  if (!sid) return null;
  const raw = await env.ADMIN_KV.get(`session:${sid}`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
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
