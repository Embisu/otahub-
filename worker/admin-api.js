import {
  hashPassword, verifyPassword, parseCookies, sessionCookie, clearSessionCookie,
  getSessionUser, createSession, deleteSession, json,
} from './lib.js';

// Repo GitHub co dinh cho site nay (khong doi, khong can nguoi dung nhap lai).
const GH_OWNER = 'Embisu';
const GH_REPO = 'otahub-';
const GH_BRANCH = 'main';

function ghHeaders(env) {
  return {
    'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'otahub-admin',
  };
}

async function handleLogin(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { username, password } = body || {};
  if (!username || !password) return json({ error: 'Vui long nhap ten dang nhap va mat khau.' }, 400);

  const raw = await env.ADMIN_KV.get(`user:${username.toLowerCase()}`);
  if (!raw) return json({ error: 'Sai ten dang nhap hoac mat khau.' }, 401);
  const user = JSON.parse(raw);
  const ok = await verifyPassword(password, user.salt, user.hash);
  if (!ok) return json({ error: 'Sai ten dang nhap hoac mat khau.' }, 401);

  const sid = await createSession(env, user.username);
  return json({ ok: true, user: { username: user.username } }, 200, { 'Set-Cookie': sessionCookie(sid) });
}

async function handleLogout(request, env) {
  const cookies = parseCookies(request);
  await deleteSession(env, cookies['ota_admin_session']);
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}

async function handleMe(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  return json({ user: { username: user.username } });
}

// Dung 1 lan duy nhat de tao tai khoan quan tri dau tien. Chi hoat dong khi
// chua co tai khoan nao trong he thong VA nguoi goi biet dung ADMIN_SETUP_SECRET
// (bien moi truong bi mat, tu dat trong Cloudflare dashboard).
async function handleSetup(request, env) {
  if (!env.ADMIN_SETUP_SECRET) return json({ error: 'Chua cau hinh ADMIN_SETUP_SECRET tren server.' }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { username, password, secret } = body || {};
  if (secret !== env.ADMIN_SETUP_SECRET) return json({ error: 'Sai ma thiet lap.' }, 403);
  if (!username || !password || password.length < 8) return json({ error: 'Can ten dang nhap va mat khau toi thieu 8 ky tu.' }, 400);

  const existing = await env.ADMIN_KV.list({ prefix: 'user:' });
  if (existing.keys.length > 0) return json({ error: 'Da co tai khoan trong he thong — dung muc Nguoi dung trong admin de them nguoi moi.' }, 409);

  const { salt, hash } = await hashPassword(password);
  await env.ADMIN_KV.put(`user:${username.toLowerCase()}`, JSON.stringify({ username, salt, hash, createdAt: Date.now() }));
  return json({ ok: true });
}

async function handleUsersGet(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  const list = await env.ADMIN_KV.list({ prefix: 'user:' });
  const users = [];
  for (const k of list.keys) {
    const raw = await env.ADMIN_KV.get(k.name);
    if (!raw) continue;
    const u = JSON.parse(raw);
    users.push({ username: u.username, createdAt: u.createdAt });
  }
  users.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return json({ users });
}

async function handleUsersPost(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { username, password } = body || {};
  if (!username || !password || password.length < 8) return json({ error: 'Can ten dang nhap va mat khau toi thieu 8 ky tu.' }, 400);
  const key = `user:${username.toLowerCase()}`;
  if (await env.ADMIN_KV.get(key)) return json({ error: 'Ten dang nhap da ton tai.' }, 409);
  const { salt, hash } = await hashPassword(password);
  await env.ADMIN_KV.put(key, JSON.stringify({ username, salt, hash, createdAt: Date.now() }));
  return json({ ok: true });
}

async function handleUsersDelete(request, env, url) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  const username = (url.searchParams.get('username') || '').toLowerCase();
  if (!username) return json({ error: 'Thieu ten dang nhap.' }, 400);
  if (username === me.username.toLowerCase()) return json({ error: 'Khong the tu xoa tai khoan dang dang nhap.' }, 400);
  const list = await env.ADMIN_KV.list({ prefix: 'user:' });
  if (list.keys.length <= 1) return json({ error: 'Phai con it nhat 1 tai khoan.' }, 400);
  await env.ADMIN_KV.delete(`user:${username}`);
  return json({ ok: true });
}

async function handleGhGet(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${GH_BRANCH}`, { headers: ghHeaders(env) });
  if (!r.ok) return json({ error: 'GitHub API error: ' + r.status }, r.status);
  return json(await r.json());
}

async function handleGhPut(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { content, sha, message } = body || {};
  if (typeof content !== 'string') return json({ error: 'Thieu noi dung file.' }, 400);
  const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
    method: 'PUT',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `[${user.username}] ${message || 'cap nhat qua admin'}`,
      content,
      sha,
      branch: GH_BRANCH,
    }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    return json({ error: e.message || ('GitHub API error: ' + r.status) }, r.status);
  }
  return json(await r.json());
}

export async function handleAdminApi(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/admin/login' && method === 'POST') return handleLogin(request, env);
  if (path === '/api/admin/logout' && method === 'POST') return handleLogout(request, env);
  if (path === '/api/admin/me' && method === 'GET') return handleMe(request, env);
  if (path === '/api/admin/setup' && method === 'POST') return handleSetup(request, env);
  if (path === '/api/admin/users' && method === 'GET') return handleUsersGet(request, env);
  if (path === '/api/admin/users' && method === 'POST') return handleUsersPost(request, env);
  if (path === '/api/admin/users' && method === 'DELETE') return handleUsersDelete(request, env, url);

  if (path.startsWith('/api/admin/gh/')) {
    const ghPath = path.slice('/api/admin/gh/'.length);
    if (method === 'GET') return handleGhGet(request, env, ghPath);
    if (method === 'PUT') return handleGhPut(request, env, ghPath);
  }

  return json({ error: 'Not found' }, 404);
}
