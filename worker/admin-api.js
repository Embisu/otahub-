import {
  hashPassword, verifyPassword, parseCookies, sessionCookie, clearSessionCookie,
  getSessionUser, createSession, deleteSession, json,
  normalizeRole, canManageUsers, canWritePath, canDraftPath, canUploadImage,
  checkLoginLock, recordLoginFailure, clearLoginFailures,
  logAudit, getAuditLog,
  putDraft, getDraftRaw, deleteDraft, listDrafts, canViewDraft,
} from './lib.js';

// Lay IP that cua nguoi goi tu header Cloudflare gan (CF-Connecting-IP luon
// dang tin cay hon X-Forwarded-For vi Cloudflare tu dat, khong the gia mao
// tu phia client).
function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
}

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
  const uname = username.toLowerCase();
  const ip = clientIp(request);

  const lock = await checkLoginLock(env, ip, uname);
  if (lock.locked) {
    return json({ error: 'Tai khoan tam bi khoa do dang nhap sai qua nhieu lan. Vui long thu lai sau 10 phut.' }, 429);
  }

  const raw = await env.ADMIN_KV.get(`user:${uname}`);
  if (!raw) { await recordLoginFailure(env, ip, uname); return json({ error: 'Sai ten dang nhap hoac mat khau.' }, 401); }
  const user = JSON.parse(raw);
  const ok = await verifyPassword(password, user.salt, user.hash);
  if (!ok) {
    await recordLoginFailure(env, ip, uname);
    await logAudit(env, { action: 'login_failed', username: user.username });
    return json({ error: 'Sai ten dang nhap hoac mat khau.' }, 401);
  }

  await clearLoginFailures(env, ip, uname);
  const sid = await createSession(env, user.username);
  await logAudit(env, { action: 'login', username: user.username });
  return json({ ok: true, user: { username: user.username, role: normalizeRole(user.role) } }, 200, { 'Set-Cookie': sessionCookie(sid) });
}

async function handleLogout(request, env) {
  const cookies = parseCookies(request);
  await deleteSession(env, cookies['ota_admin_session']);
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}

async function handleMe(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  return json({ user });
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
  // Tai khoan dau tien luon la admin — nguoi tao he thong.
  await env.ADMIN_KV.put(`user:${username.toLowerCase()}`, JSON.stringify({ username, salt, hash, role: 'admin', createdAt: Date.now() }));
  await logAudit(env, { action: 'setup', username });
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
    users.push({ username: u.username, role: normalizeRole(u.role), createdAt: u.createdAt });
  }
  users.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return json({ users, canManageUsers: canManageUsers(me) });
}

async function handleUsersPost(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chi quan tri vien (admin) moi duoc quan ly tai khoan.' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { username, password, role } = body || {};
  if (!username || !password || password.length < 8) return json({ error: 'Can ten dang nhap va mat khau toi thieu 8 ky tu.' }, 400);
  const key = `user:${username.toLowerCase()}`;
  if (await env.ADMIN_KV.get(key)) return json({ error: 'Ten dang nhap da ton tai.' }, 409);
  const { salt, hash } = await hashPassword(password);
  const finalRole = normalizeRole(role);
  await env.ADMIN_KV.put(key, JSON.stringify({ username, salt, hash, role: finalRole, createdAt: Date.now() }));
  await logAudit(env, { action: 'user_created', username: me.username, target: username, role: finalRole });
  return json({ ok: true });
}

async function handleUsersDelete(request, env, url) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chi quan tri vien (admin) moi duoc quan ly tai khoan.' }, 403);
  const username = (url.searchParams.get('username') || '').toLowerCase();
  if (!username) return json({ error: 'Thieu ten dang nhap.' }, 400);
  if (username === me.username.toLowerCase()) return json({ error: 'Khong the tu xoa tai khoan dang dang nhap.' }, 400);
  const list = await env.ADMIN_KV.list({ prefix: 'user:' });
  if (list.keys.length <= 1) return json({ error: 'Phai con it nhat 1 tai khoan.' }, 400);
  await env.ADMIN_KV.delete(`user:${username}`);
  await logAudit(env, { action: 'user_deleted', username: me.username, target: username });
  return json({ ok: true });
}

// Doi vai tro cua 1 nguoi dung — chi admin duoc goi, va khong duoc tu ha quyen
// cua chinh minh xuong khi minh la admin duy nhat (tranh khoa het he thong).
async function handleUsersRole(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chi quan tri vien (admin) moi duoc doi vai tro.' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { username, role } = body || {};
  if (!username) return json({ error: 'Thieu ten dang nhap.' }, 400);
  const key = `user:${username.toLowerCase()}`;
  const raw = await env.ADMIN_KV.get(key);
  if (!raw) return json({ error: 'Khong tim thay tai khoan.' }, 404);
  const u = JSON.parse(raw);
  const finalRole = normalizeRole(role);
  if (username.toLowerCase() === me.username.toLowerCase() && finalRole !== 'admin') {
    const list = await env.ADMIN_KV.list({ prefix: 'user:' });
    let adminCount = 0;
    for (const k of list.keys) {
      const r2 = await env.ADMIN_KV.get(k.name);
      if (r2 && normalizeRole(JSON.parse(r2).role) === 'admin') adminCount++;
    }
    if (adminCount <= 1) return json({ error: 'Khong the tu ha quyen khi ban la admin duy nhat.' }, 400);
  }
  u.role = finalRole;
  await env.ADMIN_KV.put(key, JSON.stringify(u));
  await logAudit(env, { action: 'user_role_changed', username: me.username, target: username, role: finalRole });
  return json({ ok: true });
}

async function handleGhGet(request, env, ghPath, url) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  const ref = url.searchParams.get('ref') || GH_BRANCH;
  const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${ref}`, { headers: ghHeaders(env) });
  if (!r.ok) return json({ error: 'GitHub API error: ' + r.status }, r.status);
  return json(await r.json());
}

async function handleGhPut(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  const isImageUpload = canUploadImage(user, ghPath);
  if (!canWritePath(user, ghPath) && !isImageUpload) {
    return json({
      error: user.role === 'contributor'
        ? 'Tai khoan Contributor khong duoc xuat ban truc tiep — lien he editor/admin.'
        : `Vai tro "${user.role}" khong duoc ghi vao file he thong (${ghPath}). Chi admin/editor moi duoc sua trang chu, trang chuyen muc, hoac file cau hinh.`,
    }, 403);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { content, sha, message } = body || {};
  if (typeof content !== 'string') return json({ error: 'Thieu noi dung file.' }, 400);
  // Khong tin kiem tra kich thuoc/dinh dang phia client — kiem tra lai server-side
  // cho duong dan anh (client da gioi han 8MB nhung co the bi bypass).
  if (isImageUpload) {
    const approxBytes = Math.floor((content.length * 3) / 4);
    if (approxBytes > 8 * 1024 * 1024) return json({ error: 'Anh vuot qua 8MB.' }, 413);
  }
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
    await logAudit(env, { action: 'write_failed', username: user.username, file: ghPath, error: e.message || r.status });
    return json({ error: e.message || ('GitHub API error: ' + r.status) }, r.status);
  }
  await logAudit(env, { action: 'write', username: user.username, file: ghPath, message: message || '' });
  return json(await r.json());
}

// Lich su commit cua 1 file cu the — dung GitHub Commits API co san, khong can
// tu xay kho luu phien ban rieng. Toi da 30 commit gan nhat cho gon.
async function handleGhHistory(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  const r = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/commits?path=${encodeURIComponent(ghPath)}&sha=${GH_BRANCH}&per_page=30`,
    { headers: ghHeaders(env) }
  );
  if (!r.ok) return json({ error: 'GitHub API error: ' + r.status }, r.status);
  const commits = await r.json();
  return json({
    commits: commits.map((c) => ({
      sha: c.sha,
      message: c.commit?.message || '',
      author: c.commit?.author?.name || '',
      date: c.commit?.author?.date || '',
    })),
  });
}

// Nhat ky hoat dong lo thong tin ai-sua-gi-luc-nao trong toan he thong — chi
// admin/editor moi can (va nen) thay duoc, author/contributor khong can biet
// nguoi khac dang lam gi.
async function handleAuditLog(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  if (me.role !== 'admin' && me.role !== 'editor') {
    return json({ error: 'Chi admin/editor moi duoc xem nhat ky hoat dong.' }, 403);
  }
  const log = await getAuditLog(env, 150);
  return json({ log });
}

// ── Ban nhap (draft) ─────────────────────────────────────────────────────
// KHONG dung GitHub — luu tam trong KV de autosave lien tuc ma khong tao
// hang loat commit "rac". Chi "Luu & Deploy" (handleGhPut) moi la xuat ban
// that; sau khi xuat ban thanh cong, draft tuong ung se bi xoa (frontend goi
// DELETE rieng ngay sau khi ghPut thanh cong).
// Quyen so huu: chi chinh chu (updatedBy) hoac admin/editor moi duoc doc/ghi
// de/xoa 1 draft cu the — tranh 1 tai khoan bat ky doc/ghi de/xoa duoc draft
// cua nguoi khac chi vi da dang nhap.
async function handleDraftGet(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  const draft = await getDraftRaw(env, ghPath);
  // Tra ve 404 giong het truong hop "khong co draft" cho ca truong hop "co
  // draft nhung khong phai cua minh" — tranh lo thong tin la file nay dang
  // duoc ai do khac soan.
  if (!draft || !canViewDraft(user, draft)) return json({ error: 'Khong co ban nhap.' }, 404);
  return json(draft);
}
async function handleDraftPut(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  if (!canDraftPath(user, ghPath)) {
    return json({ error: `Vai tro "${user.role}" khong duoc nhap ban nhap cho file he thong (${ghPath}).` }, 403);
  }
  const existing = await getDraftRaw(env, ghPath);
  if (existing && !canViewDraft(user, existing)) {
    return json({ error: `Ban nhap nay dang duoc "${existing.updatedBy}" soan — khong the ghi de.` }, 409);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  if (typeof body?.html !== 'string') return json({ error: 'Thieu noi dung.' }, 400);
  await putDraft(env, ghPath, body.html, user.username);
  return json({ ok: true });
}
async function handleDraftDelete(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  const existing = await getDraftRaw(env, ghPath);
  if (existing && !canViewDraft(user, existing)) {
    return json({ error: `Ban nhap nay dang duoc "${existing.updatedBy}" soan — khong the xoa.` }, 403);
  }
  await deleteDraft(env, ghPath);
  return json({ ok: true });
}
async function handleDraftsList(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  const drafts = await listDrafts(env, user);
  return json({ drafts });
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
  if (path === '/api/admin/users/role' && method === 'POST') return handleUsersRole(request, env);
  if (path === '/api/admin/auditlog' && method === 'GET') return handleAuditLog(request, env);
  if (path === '/api/admin/drafts' && method === 'GET') return handleDraftsList(request, env);

  if (path.startsWith('/api/admin/draft/')) {
    const ghPath = path.slice('/api/admin/draft/'.length);
    if (method === 'GET') return handleDraftGet(request, env, ghPath);
    if (method === 'PUT') return handleDraftPut(request, env, ghPath);
    if (method === 'DELETE') return handleDraftDelete(request, env, ghPath);
  }

  if (path.startsWith('/api/admin/history/')) {
    const ghPath = path.slice('/api/admin/history/'.length);
    if (method === 'GET') return handleGhHistory(request, env, ghPath);
  }

  if (path.startsWith('/api/admin/gh/')) {
    const ghPath = path.slice('/api/admin/gh/'.length);
    if (method === 'GET') return handleGhGet(request, env, ghPath, url);
    if (method === 'PUT') return handleGhPut(request, env, ghPath);
  }

  return json({ error: 'Not found' }, 404);
}
