import { Buffer } from 'node:buffer';
import {
  hashPassword, verifyPassword, parseCookies, sessionCookie, clearSessionCookie,
  getSessionUser, createSession, deleteSession, json,
  normalizeRole, canManageUsers, canWritePath, canDraftPath, canUploadImage, canDeleteImage, canDeletePath, hasValidImageSignature,
  checkLoginLock, recordLoginFailure, clearLoginFailures,
  logAudit, getAuditLog,
  putDraft, getDraftRaw, deleteDraft, listDrafts, canViewDraft,
} from './lib.js';
import { handleNewsApi } from './news-pipeline.js';

// Lay IP that cua nguoi goi tu header Cloudflare gan (CF-Connecting-IP luon
// dang tin cay hon X-Forwarded-For vi Cloudflare tu dat, khong the gia mao
// tu phia client).
function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
}

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/i;

// Xoa cache Cloudflare cua ho so tac gia cong khai (worker/index.js cache 5 phut,
// cung dinh dang khoa) de sua ho so/doi vai tro hien ngay. Admin hien la "otahub".
async function purgeAuthorCache(request, username) {
  const origin = new URL(request.url).origin;
  const slug = String(username || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  try {
    await Promise.all(['otahub', slug].filter(Boolean).map((s) =>
      caches.default.delete(new Request(`${origin}/__edge-cache/author/${encodeURIComponent(s)}`))));
  } catch (e) {}
}
// Xoa cache Cloudflare cua 1 anh upload (ke ca dau "khong ton tai" 5 phut).
async function purgeUploadCache(request, fileName) {
  try { await caches.default.delete(new Request(`${new URL(request.url).origin}/assets/img/uploads/${fileName}`)); } catch (e) {}
}

// Repo GitHub co dinh cho site nay (khong doi, khong can nguoi dung nhap lai).
const GH_OWNER = 'Embisu';
const GH_REPO = 'otahub-';
const GH_BRANCH = 'main';

// GitHub tra 401 khi GITHUB_TOKEN tren server sai/het han. Khong duoc chuyen
// nguyen 401 ve trinh duyet: admin.html hieu 401 la "phien dang nhap het han"
// va bao nguoi dung dang nhap lai, trong khi loi that nam o cau hinh server.
function ghClientStatus(status) {
  return status === 401 ? 502 : status;
}
function ghErrorMessage(status, message) {
  if (status === 401) return 'GitHub từ chối token của server (GITHUB_TOKEN sai hoặc hết hạn). Liên hệ quản trị viên để cấp lại token.';
  return message || ('GitHub API error: ' + status);
}

// ── Doc file KHONG ton han muc REST API ──────────────────────────────────
// Han muc GitHub REST la 5.000 luot/gio cho CA tai khoan (dung chung moi
// token/cong cu cua tai khoan do). Moi lan luu bai admin doc/ghi ~10 file, nen
// voi nhieu bien tap vien, han muc het rat nhanh va moi lan doc deu bi 403 ->
// khong lay duoc SHA -> GitHub tu choi ghi ("sha wasn't supplied").
// Vi vay doc noi dung qua raw.githubusercontent.com (khong tinh vao han muc
// REST) va tu tinh SHA theo dung cong thuc cua Git: sha1("blob <len>\0" + bytes).
// Neu ban raw bi cham vai giay sau 1 commit, SHA se lech -> GitHub tra 409 va
// handleGhPut tu tra lai SHA qua API roi ghi lai.
async function gitBlobSha(bytes) {
  const header = new TextEncoder().encode(`blob ${bytes.byteLength}\0`);
  const buf = new Uint8Array(header.byteLength + bytes.byteLength);
  buf.set(header, 0);
  buf.set(bytes, header.byteLength);
  const digest = await crypto.subtle.digest('SHA-1', buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
// Chi ap dung cho file (co phan mo rong), thu muc van phai di qua API contents.
const RAW_READABLE_RE = /\.[a-z0-9]{1,8}$/i;
async function ghRawFile(env, path) {
  if (!RAW_READABLE_RE.test(path)) return null;
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${path}?t=${Date.now()}`, {
      headers: env.GITHUB_TOKEN ? { 'Authorization': 'Bearer ' + env.GITHUB_TOKEN, 'User-Agent': 'otahub-admin' } : { 'User-Agent': 'otahub-admin' },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const bytes = new Uint8Array(await r.arrayBuffer());
    return { bytes, sha: await gitBlobSha(bytes) };
  } catch (e) {
    return null;
  }
}

// Thong bao khi GitHub chan vi vuot han muc: noi ro khi nao dung lai duoc.
function ghRateLimitMessage(res) {
  const reset = Number(res?.headers?.get('x-ratelimit-reset') || 0);
  const when = reset
    ? new Date(reset * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
    : '';
  return `GitHub đang tạm giới hạn số lượt truy cập của tài khoản (vượt 5.000 lượt/giờ)${when ? `, sẽ mở lại lúc ${when}` : ''}. Bài chưa bị mất — vui lòng lưu lại sau thời điểm đó.`;
}
function isRateLimited(res, message = '') {
  return (res?.status === 403 || res?.status === 429) && (/rate limit/i.test(message) || res?.headers?.get('x-ratelimit-remaining') === '0');
}

// SHA hien tai cua 1 file tren nhanh chinh, dung khi ghi de. Uu tien cach
// khong ton han muc (raw + tu tinh SHA); `fresh` = bo qua raw, hoi thang API
// (dung khi SHA tu raw vua bi GitHub bao lech). Tra { sha: null } khi file
// chua ton tai hoac khong tra duoc.
async function ghLatestSha(env, path, { fresh = false } = {}) {
  const base = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`;
  if (!fresh) {
    const raw = await ghRawFile(env, path);
    if (raw) return { sha: raw.sha };
  }
  try {
    const r = await fetch(`${base}/contents/${path}?ref=${GH_BRANCH}`, { headers: ghHeaders(env), cache: 'no-store' });
    if (r.ok) {
      const data = await r.json();
      if (data && !Array.isArray(data) && data.sha) return { sha: data.sha };
    }
  } catch (e) {}
  try {
    const slash = path.lastIndexOf('/');
    const dir = slash === -1 ? '' : path.slice(0, slash);
    const name = decodeURIComponent(path.slice(slash + 1));
    const r = await fetch(`${base}/git/trees/${GH_BRANCH}${dir ? ':' + dir : ''}`, { headers: ghHeaders(env), cache: 'no-store' });
    if (r.ok) {
      const data = await r.json();
      const hit = (data.tree || []).find((t) => t.path === name && t.type === 'blob');
      if (hit && hit.sha) return { sha: hit.sha };
    }
  } catch (e) {}
  return { sha: null };
}

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
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { username, password } = body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) return json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' }, 400);
  const uname = username.trim().toLowerCase();
  const ip = clientIp(request);

  const lock = await checkLoginLock(env, ip, uname);
  if (lock.locked) {
    return json({ error: 'Tài khoản tạm bị khoá do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 10 phút.' }, 429);
  }

  const raw = await env.ADMIN_KV.get(`user:${uname}`);
  if (!raw) { await recordLoginFailure(env, ip, uname); return json({ error: 'Sai tên đăng nhập hoặc mật khẩu.' }, 401); }
  const user = JSON.parse(raw);
  const ok = await verifyPassword(password, user.salt, user.hash);
  if (!ok) {
    await recordLoginFailure(env, ip, uname);
    await logAudit(env, { action: 'login_failed', username: user.username });
    return json({ error: 'Sai tên đăng nhập hoặc mật khẩu.' }, 401);
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
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  return json({
    user: {
      username: user.username,
      role: normalizeRole(user.role),
      displayName: user.displayName || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      jobTitle: user.jobTitle || ''
    }
  });
}

// Lay thong tin ho so tac gia (profile)
async function handleProfileGet(request, env, url) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  const targetUser = url ? (url.searchParams.get('username') || '').toLowerCase() : '';
  const username = (me.role === 'admin' && targetUser) ? targetUser : me.username.toLowerCase();
  const raw = await env.ADMIN_KV.get(`user:${username}`);
  if (!raw) return json({ error: 'Không tìm thấy tài khoản.' }, 404);
  const u = JSON.parse(raw);
  return json({
    username: u.username,
    role: normalizeRole(u.role),
    displayName: u.displayName || '',
    bio: u.bio || '',
    avatar: u.avatar || '',
    jobTitle: u.jobTitle || ''
  });
}

// Cap nhat thong tin ho so tac gia (displayName, bio, avatar, jobTitle)
async function handleProfilePost(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { targetUsername, displayName, bio, avatar, jobTitle } = body || {};
  const target = (me.role === 'admin' && targetUsername) ? String(targetUsername).toLowerCase() : me.username.toLowerCase();
  const key = `user:${target}`;
  const raw = await env.ADMIN_KV.get(key);
  if (!raw) return json({ error: 'Không tìm thấy tài khoản.' }, 404);
  const u = JSON.parse(raw);
  if (typeof displayName === 'string') u.displayName = displayName.trim().slice(0, 100);
  if (typeof bio === 'string') u.bio = bio.trim().slice(0, 1000);
  if (typeof avatar === 'string') u.avatar = avatar.trim().slice(0, 500);
  if (typeof jobTitle === 'string') u.jobTitle = jobTitle.trim().slice(0, 100);
  await env.ADMIN_KV.put(key, JSON.stringify(u));
  await purgeAuthorCache(request, u.username);
  await logAudit(env, { action: 'profile_updated', username: me.username, target });
  return json({
    ok: true,
    user: {
      username: u.username,
      role: normalizeRole(u.role),
      displayName: u.displayName || '',
      bio: u.bio || '',
      avatar: u.avatar || '',
      jobTitle: u.jobTitle || ''
    }
  });
}

// Dung 1 lan duy nhat de tao tai khoan quan tri dau tien. Chi hoat dong khi
// chua co tai khoan nao trong he thong VA nguoi goi biet dung ADMIN_SETUP_SECRET
// (bien moi truong bi mat, tu dat trong Cloudflare dashboard).
async function handleSetup(request, env) {
  if (!env.ADMIN_SETUP_SECRET) return json({ error: 'Chưa cấu hình ADMIN_SETUP_SECRET trên server.' }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { username, password, secret } = body || {};
  if (secret !== env.ADMIN_SETUP_SECRET) return json({ error: 'Sai mã thiết lập.' }, 403);
  if (!username || !password || password.length < 8) return json({ error: 'Cần tên đăng nhập và mật khẩu tối thiểu 8 ký tự.' }, 400);

  const existing = await env.ADMIN_KV.list({ prefix: 'user:' });
  if (existing.keys.length > 0) return json({ error: 'Hệ thống đã có tài khoản, hãy dùng mục Thành viên trong admin để thêm người mới.' }, 409);

  const { salt, hash } = await hashPassword(password);
  // Tai khoan dau tien luon la admin, nguoi tao he thong.
  await env.ADMIN_KV.put(`user:${username.toLowerCase()}`, JSON.stringify({ username, salt, hash, role: 'admin', createdAt: Date.now() }));
  await logAudit(env, { action: 'setup', username });
  return json({ ok: true });
}

async function handleUsersGet(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chỉ quản trị viên (admin) mới được xem danh sách tài khoản.' }, 403);
  const list = await env.ADMIN_KV.list({ prefix: 'user:' });
  const users = [];
  for (const k of list.keys) {
    const raw = await env.ADMIN_KV.get(k.name);
    if (!raw) continue;
    const u = JSON.parse(raw);
    users.push({
      username: u.username,
      role: normalizeRole(u.role),
      displayName: u.displayName || '',
      bio: u.bio || '',
      avatar: u.avatar || '',
      jobTitle: u.jobTitle || '',
      createdAt: u.createdAt
    });
  }
  users.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return json({ users, canManageUsers: canManageUsers(me) });
}

async function handleUsersPost(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chỉ quản trị viên (admin) mới được quản lý tài khoản.' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { username, password, role } = body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || password.length < 8) return json({ error: 'Cần tên đăng nhập và mật khẩu tối thiểu 8 ký tự.' }, 400);
  // Ten dang nhap duoc dung lam khoa KV, slug trang tac gia va tham so trong
  // giao dien admin, nen chi cho phep ky tu an toan.
  if (!USERNAME_RE.test(username)) return json({ error: 'Tên đăng nhập chỉ gồm chữ không dấu, số, dấu chấm, gạch dưới, gạch ngang (3–32 ký tự).' }, 400);
  const key = `user:${username.toLowerCase()}`;
  if (await env.ADMIN_KV.get(key)) return json({ error: 'Tên đăng nhập đã tồn tại.' }, 409);
  const { salt, hash } = await hashPassword(password);
  const finalRole = normalizeRole(role);
  await env.ADMIN_KV.put(key, JSON.stringify({ username, salt, hash, role: finalRole, createdAt: Date.now() }));
  await logAudit(env, { action: 'user_created', username: me.username, target: username, role: finalRole });
  return json({ ok: true });
}

async function handleUsersDelete(request, env, url) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chỉ quản trị viên (admin) mới được quản lý tài khoản.' }, 403);
  const username = (url.searchParams.get('username') || '').toLowerCase();
  if (!username) return json({ error: 'Thiếu tên đăng nhập.' }, 400);
  if (username === me.username.toLowerCase()) return json({ error: 'Không thể tự xoá tài khoản đang đăng nhập.' }, 400);
  const list = await env.ADMIN_KV.list({ prefix: 'user:' });
  if (list.keys.length <= 1) return json({ error: 'Hệ thống phải còn ít nhất 1 tài khoản.' }, 400);
  await env.ADMIN_KV.delete(`user:${username}`);
  await purgeAuthorCache(request, username);
  await logAudit(env, { action: 'user_deleted', username: me.username, target: username });
  return json({ ok: true });
}

// Doi vai tro cua 1 nguoi dung, chi admin duoc goi, va khong duoc tu ha quyen
// cua chinh minh xuong khi minh la admin duy nhat (tranh khoa het he thong).
async function handleUsersRole(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!canManageUsers(me)) return json({ error: 'Chỉ quản trị viên (admin) mới được đổi vai trò.' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { username, role } = body || {};
  if (!username) return json({ error: 'Thiếu tên đăng nhập.' }, 400);
  const key = `user:${username.toLowerCase()}`;
  const raw = await env.ADMIN_KV.get(key);
  if (!raw) return json({ error: 'Không tìm thấy tài khoản.' }, 404);
  const u = JSON.parse(raw);
  const finalRole = normalizeRole(role);
  if (username.toLowerCase() === me.username.toLowerCase() && finalRole !== 'admin') {
    const list = await env.ADMIN_KV.list({ prefix: 'user:' });
    let adminCount = 0;
    for (const k of list.keys) {
      const r2 = await env.ADMIN_KV.get(k.name);
      if (r2 && normalizeRole(JSON.parse(r2).role) === 'admin') adminCount++;
    }
    if (adminCount <= 1) return json({ error: 'Không thể tự hạ quyền khi bạn là admin duy nhất.' }, 400);
  }
  u.role = finalRole;
  await env.ADMIN_KV.put(key, JSON.stringify(u));
  await purgeAuthorCache(request, u.username);
  await logAudit(env, { action: 'user_role_changed', username: me.username, target: username, role: finalRole });
  return json({ ok: true });
}

async function handleGhGet(request, env, ghPath, url) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);

  // Nếu là liệt kê thư mục gốc assets/img: kết hợp GitHub, static manifest và KV
  if (ghPath === 'assets/img') {
    let list = [];
    const ref = url.searchParams.get('ref') || GH_BRANCH;
    if (env.GITHUB_TOKEN) {
      try {
        const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${ref}`, { headers: ghHeaders(env) });
        if (r.ok) {
          const ghData = await r.json();
          if (Array.isArray(ghData)) list = ghData;
        }
      } catch(e) {}
    }

    // Nếu GitHub API không trả về dữ liệu (403, rate limit, thiếu token...), đọc từ static manifest
    if (list.length === 0 && env.ASSETS) {
      try {
        const manifestRes = await env.ASSETS.fetch(new Request(new URL('/assets/img-manifest.json', request.url)));
        if (manifestRes.ok) {
          const mData = await manifestRes.json();
          if (Array.isArray(mData)) list = mData;
        }
      } catch(e) {}
    }

    return json(list);
  }

  // Nếu là liệt kê thư mục uploads, kết hợp cả ảnh từ GitHub và KV Storage
  if (ghPath === 'assets/img/uploads') {
    let list = [];
    const ref = url.searchParams.get('ref') || GH_BRANCH;
    if (env.GITHUB_TOKEN) {
      try {
        const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${ref}`, { headers: ghHeaders(env) });
        if (r.ok) {
          const ghData = await r.json();
          if (Array.isArray(ghData)) list = ghData;
        }
      } catch(e) {}
    }

    // Bổ sung các ảnh đã lưu trong KV (tải song song tất cả các key với Promise.all, tốc độ cực nhanh)
    if (env.ADMIN_KV) {
      try {
        const kvList = await env.ADMIN_KV.list({ prefix: 'upload_meta:' });
        const existingNames = new Set(list.map(f => f.name));
        const metaEntries = await Promise.all(
          kvList.keys.map(async k => {
            const raw = await env.ADMIN_KV.get(k.name);
            return raw ? JSON.parse(raw) : null;
          })
        );
        for (const meta of metaEntries) {
          if (!meta) continue;
          if (!existingNames.has(meta.name)) {
            list.push({
              name: meta.name,
              path: meta.path,
              sha: 'kv-' + meta.name,
              size: meta.size || 0,
              type: 'file',
              download_url: '/' + meta.path,
              uploadedAt: meta.uploadedAt || 0,
              isUpload: true,
            });
            existingNames.add(meta.name);
          } else {
            const found = list.find(f => f.name === meta.name);
            if (found) {
              found.uploadedAt = meta.uploadedAt || 0;
              found.isUpload = true;
            }
          }
        }
      } catch(e) {}
    }
    // Sắp xếp ảnh tải lên: mới nhất xuất hiện trên cùng
    list.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
    return json(list);
  }

  const ref = url.searchParams.get('ref') || GH_BRANCH;
  // File thường trên nhánh chính: đọc qua raw (không tốn hạn mức REST API).
  if (ref === GH_BRANCH && request.method === 'GET') {
    const raw = await ghRawFile(env, ghPath);
    if (raw) {
      return json({
        name: decodeURIComponent(ghPath.split('/').pop()),
        path: ghPath,
        sha: raw.sha,
        size: raw.bytes.byteLength,
        type: 'file',
        content: Buffer.from(raw.bytes).toString('base64'),
        encoding: 'base64',
      });
    }
  }

  const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${ref}`, { headers: ghHeaders(env) });
  if (!r.ok) {
    const errBody = await r.json().catch(() => ({}));
    // 404 là bình thường (bài mới chưa có trên GitHub), không ghi nhật ký để
    // nhật ký không bị lấp bởi các dòng vô nghĩa.
    if (r.status !== 404) {
      await logAudit(env, {
        action: 'gh_get_failed',
        username: user.username,
        file: ghPath,
        status: r.status,
        error: errBody.message || ('status ' + r.status)
      });
    }
    // Nếu đọc file thất bại qua GitHub, thử đọc file tĩnh qua env.ASSETS (fallback an toàn cho editor)
    if (env.ASSETS && request.method === 'GET') {
      try {
        const assetRes = await env.ASSETS.fetch(new Request(new URL('/' + ghPath, request.url)));
        if (assetRes.ok) {
          const text = await assetRes.text();
          return json({
            name: ghPath.split('/').pop(),
            path: ghPath,
            sha: 'local-asset',
            size: text.length,
            content: btoa(unescape(encodeURIComponent(text))),
            encoding: 'base64'
          });
        }
      } catch(e) {}
    }
    const detail = errBody.message ? ` (${errBody.message})` : '';
    return json({ error: ghErrorMessage(r.status, 'GitHub API error: ' + r.status + detail) }, ghClientStatus(r.status));
  }
  return json(await r.json());
}

async function handleGhPut(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);
  const isImageUpload = canUploadImage(user, ghPath);
  if (!canWritePath(user, ghPath) && !isImageUpload) {
    return json({
      error: user.role === 'contributor'
        ? 'Tài khoản Contributor không được xuất bản trực tiếp, hãy liên hệ editor/admin.'
        : `Vai trò "${user.role}" không được ghi vào file hệ thống (${ghPath}). Chỉ admin/editor mới được sửa trang chủ, trang chuyên mục hoặc file cấu hình.`,
    }, 403);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  let { content } = body || {};
  const { sha, message } = body || {};
  if (typeof content !== 'string') return json({ error: 'Thiếu nội dung file.' }, 400);
  if (/\.html$/i.test(ghPath) && !isImageUpload && content.length < 400) return json({ error: 'Nội dung HTML trống hoặc quá ngắn — đã từ chối ghi đè để tránh mất bài.' }, 400);

  // Chuẩn hóa tài nguyên dùng chung ngay tại API xuất bản. Lớp bảo vệ này
  // không phụ thuộc phiên bản admin.html mà trình duyệt đang cache, nhờ đó bài
  // mới không thể gọi enhance.js cũ hoặc thiếu CSS điều hướng mobile.
  if (/\.html$/i.test(ghPath) && !isImageUpload) {
    content = content.replace(
      /\/assets\/enhance\.js(?:\?v=[^"']*)?/gi,
      '/assets/enhance.js?v=20261002i'
    );
    // article-style.css chứa định dạng đoạn ghi nguồn (.art-source): luôn dùng bản mới nhất.
    content = content.replace(
      /\/assets\/article-style\.css(?:\?v=[^"']*)?/gi,
      '/assets/article-style.css?v=20261002src'
    );
    if (!/\/assets\/mobile-fix\.css(?:\?v=[^"']*)?/i.test(content) && /<\/head>/i.test(content)) {
      content = content.replace(
        /<\/head>/i,
        '<link rel="stylesheet" href="/assets/mobile-fix.css?v=20261002l">\n</head>'
      );
    }
  }

  // Xử lý tải ảnh lên: Ưu tiên lưu ngay vào KV Storage (nhanh, tức thì, 100% không phụ thuộc token GitHub)
  if (isImageUpload) {
    const approxBytes = Math.floor((content.length * 3) / 4);
    if (approxBytes > 8 * 1024 * 1024) return json({ error: 'Ảnh vượt quá 8MB.' }, 413);
    if (!hasValidImageSignature(ghPath, content)) return json({ error: 'Nội dung file không khớp định dạng ảnh.' }, 415);

    const fileName = ghPath.replace(/^assets\/img\/uploads\//, '');
    let kvSaved = false;

    const now = Date.now();
    // 1. Lưu nhị phân trực tiếp vào ADMIN_KV (tốc độ cao, an toàn tuyệt đối)
    if (env.ADMIN_KV) {
      try {
        const cleanContent = content.replace(/\s+/g, '');
        const rawBytes = Buffer.from(cleanContent, 'base64');

        // Băm SHA-256 nội dung nhị phân để chống lưu ảnh trùng lặp tuyệt đối
        const hashBuffer = await crypto.subtle.digest('SHA-256', rawBytes);
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        let existingFileName = await env.ADMIN_KV.get(`upload_hash:${hashHex}`);
        // Chỉ mục có thể còn sót từ ảnh đã bị xóa trước đây: chỉ tái sử dụng khi
        // file đích còn tồn tại thật, nếu không thì lưu như ảnh mới.
        if (existingFileName && !(await env.ADMIN_KV.get(`upload_meta:${existingFileName}`))) {
          existingFileName = null;
        }
        // Dự phòng khi chỉ mục KV không có (KV từng hết lượt ghi, hoặc chưa kịp đồng bộ giữa
        // các khu vực): so SHA kiểu Git của ảnh với các file đã có trong thư mục uploads trên
        // GitHub (1 lượt gọi API). Trước đây thiếu bước này nên cùng 1 ảnh bị lưu tới 16 bản.
        if (!existingFileName && env.GITHUB_TOKEN) {
          try {
            const blobSha = await gitBlobSha(new Uint8Array(rawBytes));
            const tr = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/trees/${GH_BRANCH}:assets/img/uploads`, { headers: ghHeaders(env), cache: 'no-store' });
            if (tr.ok) {
              const hit = ((await tr.json()).tree || []).find((t) => t.type === 'blob' && t.sha === blobSha);
              if (hit) {
                existingFileName = hit.path;
                try { await env.ADMIN_KV.put(`upload_hash:${hashHex}`, existingFileName); } catch {}
              }
            }
          } catch {}
        }
        if (existingFileName) {
          // Ảnh này đã có sẵn trên hệ thống, tái sử dụng file cũ ngay lập tức
          return json({
            ok: true,
            url: `/assets/img/uploads/${existingFileName}`,
            path: `assets/img/uploads/${existingFileName}`,
            name: existingFileName,
            size: approxBytes,
            uploadedAt: now,
            sha: 'kv-' + existingFileName,
            isDuplicate: true,
            content: { download_url: `/assets/img/uploads/${existingFileName}` }
          }, 200);
        }

        await env.ADMIN_KV.put(`upload_img:${fileName}`, rawBytes);
        await env.ADMIN_KV.put(`upload_meta:${fileName}`, JSON.stringify({
          name: fileName,
          path: ghPath,
          size: approxBytes,
          hash: hashHex,
          uploadedAt: now,
          uploadedBy: user.username,
        }));
        await env.ADMIN_KV.put(`upload_hash:${hashHex}`, fileName);
        await purgeUploadCache(request, fileName);
        kvSaved = true;
      } catch (kvErr) {
        console.error('Loi luu anh vao KV:', kvErr);
      }
    }

    // 2. Thử đồng bộ lên GitHub (best-effort)
    const putPayload = {
      message: `[${user.username}] ${message || 'tai anh len qua admin'}`,
      content,
      branch: GH_BRANCH,
    };
    const isImgSha = typeof sha === 'string' && /^[0-9a-f]{40}$/i.test(sha.trim());
    if (isImgSha) putPayload.sha = sha.trim();

    let ghSuccess = false;
    try {
      let r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
        method: 'PUT',
        headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
        body: JSON.stringify(putPayload),
      });
      if ((r.status === 409 || r.status === 422) && env.GITHUB_TOKEN) {
        try {
          const getLatest = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${GH_BRANCH}`, {
            headers: ghHeaders(env),
          });
          if (getLatest.ok) {
            const lData = await getLatest.json();
            if (lData?.sha) {
              putPayload.sha = lData.sha;
              r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
                method: 'PUT',
                headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
                body: JSON.stringify(putPayload),
              });
            }
          }
        } catch(e) {}
      }
      if (r.ok) {
        ghSuccess = true;
        await logAudit(env, { action: 'write', username: user.username, file: ghPath, message: message || '' });
      } else {
        const e = await r.json().catch(() => ({}));
        console.warn('GitHub API upload warning (da luu an toan trong KV):', e.message || r.status);
      }
    } catch (netErr) {
      console.warn('GitHub network error (da luu an toan trong KV):', netErr);
    }

    if (kvSaved || ghSuccess) {
      return json({
        ok: true,
        url: '/' + ghPath,
        path: ghPath,
        name: fileName,
        size: approxBytes,
        uploadedAt: now,
        sha: 'kv-' + fileName,
        content: { download_url: '/' + ghPath }
      }, 200);
    }

    return json({ error: 'Không thể lưu ảnh lên máy chủ.' }, 500);
  }

  const cleanGhPath = (ghPath || '').replace(/^\/+/, '');

  // Cho các file nội dung (.html, .json, ...)
  const putPayload = {
    message: `[${user.username}] ${message || 'cap nhat qua admin'}`,
    content,
    branch: GH_BRANCH,
  };
  const is40HexSha = typeof sha === 'string' && /^[0-9a-f]{40}$/i.test(sha.trim());
  if (is40HexSha) {
    putPayload.sha = sha.trim();
  } else {
    // Client không gửi SHA hợp lệ (vd 'local-asset' khi đọc file từ bản deploy): tự lấy SHA mới nhất.
    const latest = await ghLatestSha(env, cleanGhPath);
    if (latest.sha) putPayload.sha = latest.sha;
  }

  const putOnce = () => fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${cleanGhPath}`, {
    method: 'PUT',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(putPayload),
  });
  let r = await putOnce();

  // 409 (SHA cũ) hoặc 422 (thiếu SHA dù file đã tồn tại): lấy lại SHA mới nhất rồi thử lại.
  // Ngay sau một commit, API contents của GitHub có thể vài giây chưa thấy bản mới
  // (trả 404 / SHA cũ) nên thử lại có giãn cách và tra thêm qua Git Trees.
  // Lần đầu thử lại: SHA tính từ raw có thể chậm vài giây so với commit vừa xong,
  // nên hỏi thẳng API (fresh); các lần sau xen kẽ raw/API để đỡ tốn hạn mức.
  for (let attempt = 1; attempt <= 3 && (r.status === 409 || r.status === 422); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
    const latest = await ghLatestSha(env, cleanGhPath, { fresh: attempt !== 2 });
    if (!latest.sha || latest.sha === putPayload.sha) continue;
    putPayload.sha = latest.sha;
    r = await putOnce();
  }

  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    await logAudit(env, { action: 'write_failed', username: user.username, file: cleanGhPath, status: r.status, error: e.message || r.status });
    let msg;
    if (isRateLimited(r, e.message)) msg = ghRateLimitMessage(r);
    else if (/sha/i.test(e.message || '') && (r.status === 409 || r.status === 422)) {
      msg = `Không xác định được phiên bản hiện tại của ${cleanGhPath} trên GitHub (GitHub có thể đang giới hạn lượt truy cập). Bài chưa bị mất — thử lưu lại sau ít phút.`;
    } else msg = ghErrorMessage(r.status, e.message);
    return json({ error: msg }, ghClientStatus(r.status));
  }
  await logAudit(env, { action: 'write', username: user.username, file: ghPath, message: message || '' });
  return json(await r.json());
}

// Xoa 1 file (anh trong Media Library hoac bai viet .html)
async function handleGhDelete(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);
  if (!canDeletePath(user, ghPath)) {
    return json({ error: `Vai trò "${user.role}" không được xoá file này.` }, 403);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { sha, message } = body || {};

  // Xóa khỏi KV nếu là ảnh upload. Phải gỡ cả chỉ mục chống trùng
  // (upload_hash) đang trỏ vào file này, nếu không lần tải lại đúng ảnh đó sẽ
  // được "tái sử dụng" về một URL đã bị xóa (ảnh vỡ trong bài viết).
  if (ghPath.startsWith('assets/img/uploads/') && env.ADMIN_KV) {
    const fileName = ghPath.replace(/^assets\/img\/uploads\//, '');
    const metaRaw = await env.ADMIN_KV.get(`upload_meta:${fileName}`);
    let hash = null;
    try { hash = metaRaw ? JSON.parse(metaRaw).hash : null; } catch {}
    if (hash && (await env.ADMIN_KV.get(`upload_hash:${hash}`)) === fileName) {
      await env.ADMIN_KV.delete(`upload_hash:${hash}`);
    }
    await env.ADMIN_KV.delete(`upload_img:${fileName}`);
    await env.ADMIN_KV.delete(`upload_meta:${fileName}`);
    await env.ADMIN_KV.delete(`upload_alias:${fileName}`);
    await purgeUploadCache(request, fileName);
  }

  if (sha && String(sha).startsWith('kv-')) {
    await logAudit(env, { action: 'delete_kv', username: user.username, file: ghPath });
    return json({ ok: true });
  }

  if (!sha) return json({ error: 'Thiếu mã SHA của file cần xoá.' }, 400);
  const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
    method: 'DELETE',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `[${user.username}] ${message || 'xoa file qua admin'}`,
      sha,
      branch: GH_BRANCH,
    }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    await logAudit(env, { action: 'delete_failed', username: user.username, file: ghPath, error: e.message || r.status });
    if (ghPath.startsWith('assets/img/uploads/')) {
      return json({ ok: true });
    }
    return json({ error: ghErrorMessage(r.status, e.message) }, ghClientStatus(r.status));
  }
  await logAudit(env, { action: 'delete', username: user.username, file: ghPath });
  return json({ ok: true });
}

// Lich su commit cua 1 file cu the, dung GitHub Commits API co san, khong can
// tu xay kho luu phien ban rieng. Toi da 30 commit gan nhat cho gon.
async function handleGhHistory(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);
  const r = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/commits?path=${encodeURIComponent(ghPath)}&sha=${GH_BRANCH}&per_page=30`,
    { headers: ghHeaders(env) }
  );
  if (!r.ok) return json({ error: ghErrorMessage(r.status) }, ghClientStatus(r.status));
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

// Nhat ky hoat dong lo thong tin ai-sua-gi-luc-nao trong toan he thong, chi
// admin/editor moi can (va nen) thay duoc, author/contributor khong can biet
// nguoi khac dang lam gi.
async function handleAuditLog(request, env) {
  const me = await getSessionUser(request, env);
  if (!me) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (me.role !== 'admin' && me.role !== 'editor') {
    return json({ error: 'Chỉ admin/editor mới được xem nhật ký hoạt động.' }, 403);
  }
  const log = await getAuditLog(env, 150);
  return json({ log });
}

// ── Ban nhap (draft) ─────────────────────────────────────────────────────
// KHONG dung GitHub, luu tam trong KV de autosave lien tuc ma khong tao
// hang loat commit "rac". Chi "Luu & Deploy" (handleGhPut) moi la xuat ban
// that; sau khi xuat ban thanh cong, draft tuong ung se bi xoa (frontend goi
// DELETE rieng ngay sau khi ghPut thanh cong).
// Quyen so huu: chi chinh chu (updatedBy) hoac admin/editor moi duoc doc/ghi
// de/xoa 1 draft cu the, tranh 1 tai khoan bat ky doc/ghi de/xoa duoc draft
// cua nguoi khac chi vi da dang nhap.
async function handleDraftGet(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);
  const draft = await getDraftRaw(env, ghPath);
  // Tra ve 404 giong het truong hop "khong co draft" cho ca truong hop "co
  // draft nhung khong phai cua minh", tranh lo thong tin la file nay dang
  // duoc ai do khac soan.
  if (!draft || !canViewDraft(user, draft)) return json({ error: 'Không có bản nháp.' }, 404);
  return json(draft);
}
async function handleDraftPut(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);
  if (!canDraftPath(user, ghPath)) {
    return json({ error: `Vai trò "${user.role}" không được lưu nháp cho file hệ thống (${ghPath}).` }, 403);
  }
  const existing = await getDraftRaw(env, ghPath);
  if (existing && !canViewDraft(user, existing)) {
    return json({ error: `Bản nháp này đang được "${existing.updatedBy}" soạn, không thể ghi đè.` }, 409);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  if (typeof body?.html !== 'string') return json({ error: 'Thiếu nội dung.' }, 400);
  const written = await putDraft(env, ghPath, body.html, user.username, existing);
  return json({ ok: true, unchanged: !written });
}
async function handleDraftDelete(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (!ghPath) return json({ error: 'Thiếu đường dẫn file.' }, 400);
  const existing = await getDraftRaw(env, ghPath);
  // Mỗi lần xuất bản, admin gọi xoá nháp cho cả bản VI và EN dù thường không có
  // nháp nào: chỉ xoá khi thật sự có, vì lệnh xoá KV cũng tốn 1 lượt ghi.
  if (!existing) return json({ ok: true });
  if (!canViewDraft(user, existing)) {
    return json({ error: `Bản nháp này đang được "${existing.updatedBy}" soạn, không thể xoá.` }, 403);
  }
  await deleteDraft(env, ghPath);
  return json({ ok: true });
}
async function handleDraftsList(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  const drafts = await listDrafts(env, user);
  return json({ drafts });
}

async function handleCleanDuplicateUploads(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (user.role !== 'admin' && user.role !== 'editor') return json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, 403);
  if (!env.ADMIN_KV) return json({ error: 'Chưa cấu hình KV trên server.' }, 500);

  const kvList = await env.ADMIN_KV.list({ prefix: 'upload_meta:' });
  const metaEntries = await Promise.all(
    kvList.keys.map(async k => {
      const raw = await env.ADMIN_KV.get(k.name);
      return raw ? { key: k.name, data: JSON.parse(raw) } : null;
    })
  );

  const groups = new Map();
  for (const entry of metaEntries) {
    if (!entry) continue;
    const meta = entry.data;
    let hash = meta.hash;
    if (!hash) {
      const rawImg = await env.ADMIN_KV.get(`upload_img:${meta.name}`, { type: 'arrayBuffer' });
      if (rawImg) {
        const hashBuf = await crypto.subtle.digest('SHA-256', rawImg);
        hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
        meta.hash = hash;
        await env.ADMIN_KV.put(entry.key, JSON.stringify(meta));
        await env.ADMIN_KV.put(`upload_hash:${hash}`, meta.name);
      }
    }
    if (!hash) continue;
    if (!groups.has(hash)) groups.set(hash, []);
    groups.get(hash).push(meta);
  }

  let removedCount = 0;
  for (const [hash, items] of groups.entries()) {
    if (items.length > 1) {
      // Giữ lại 1 bản (bản có thời gian tạo cũ nhất), xoá dữ liệu các bản thừa.
      // Bài viết có thể đang trỏ tới bản thừa, nên để lại alias: URL cũ vẫn
      // phục vụ ảnh của bản được giữ (xem worker/index.js), không bị vỡ ảnh.
      items.sort((a, b) => (a.uploadedAt || 0) - (b.uploadedAt || 0));
      const keep = items[0];
      await env.ADMIN_KV.put(`upload_hash:${hash}`, keep.name);
      for (let i = 1; i < items.length; i++) {
        const dup = items[i];
        await env.ADMIN_KV.put(`upload_alias:${dup.name}`, keep.name);
        await env.ADMIN_KV.delete(`upload_img:${dup.name}`);
        await env.ADMIN_KV.delete(`upload_meta:${dup.name}`);
        removedCount++;
      }
    }
  }

  await logAudit(env, { action: 'clean_duplicates', username: user.username, count: removedCount });
  return json({ ok: true, removedCount });
}

async function handlePingIndexNow(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);
  if (user.role === 'contributor') return json({ error: 'Chỉ admin/editor mới được ping IndexNow.' }, 403);

  let body = {};
  try { body = await request.json(); } catch(e) {}
  let urls = Array.isArray(body.urls) && body.urls.length ? body.urls : [
    'https://otahub.asia/',
    'https://otahub.asia/gaming',
    'https://otahub.asia/anime',
    'https://otahub.asia/manga',
    'https://otahub.asia/news',
    'https://otahub.asia/reviews',
    'https://otahub.asia/chuyen-sau'
  ];

  urls = urls.map(u => u.startsWith('http') ? u : ('https://otahub.asia' + (u.startsWith('/') ? u : '/' + u)));

  const payload = {
    host: 'otahub.asia',
    key: '4c7a6e12e34149e69123b392b5d44849',
    keyLocation: 'https://otahub.asia/4c7a6e12e34149e69123b392b5d44849.txt',
    urlList: urls
  };

  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });
    await logAudit(env, { action: 'ping_indexnow', username: user.username, count: urls.length, status: r.status });
    return json({ ok: r.status === 200 || r.status === 202, status: r.status, count: urls.length });
  } catch(err) {
    return json({ ok: false, error: err.message }, 500);
  }
}

async function handleAiTranslate(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chưa đăng nhập.' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Dữ liệu không hợp lệ.' }, 400); }
  const { title = '', desc = '', bodyHtml = '', targetLang = 'en' } = body || {};

  if (!title && !bodyHtml) {
    return json({ error: 'Vui lòng cung cấp tiêu đề hoặc nội dung cần dịch.' }, 400);
  }

  if (!env.AI) {
    return json({ error: 'Cloudflare AI chưa được cấu hình trên hệ thống.' }, 503);
  }

  const prompt = `You are a professional video games and anime/manga journalist translating content for OtaHub (otahub.asia).
Translate the following Vietnamese article into natural, engaging, professional English.

CRITICAL RULES:
1. Translate "title" into a compelling English headline.
2. Translate "desc" into an engaging meta description (120-160 characters).
3. Translate "bodyHtml" into English while keeping ALL HTML formatting, structure, tags (<h2>, <h3>, <p>, <strong>, <em>, <img>, <a>, <blockquote>, <ul>, <li>, etc.) intact.
4. Keep game titles, anime names, studio names, character names accurate.
5. Return ONLY a single valid JSON object with keys "title", "desc", "bodyHtml". Do NOT wrap in markdown code blocks.

INPUT:
${JSON.stringify({ title, desc, bodyHtml })}

OUTPUT (valid JSON only):`;

  try {
    const aiRes = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: 'You are a gaming and anime localization expert. You output only raw valid JSON without markdown formatting.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3500,
      temperature: 0.25
    });

    const raw = aiRes.response || aiRes.result || aiRes;
    let text = typeof raw === 'string' ? raw.trim() : JSON.stringify(raw);
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error('AI không trả về JSON hợp lệ.');
    }

    await logAudit(env, { action: 'ai_translate', username: user.username, titleLength: title.length });
    return json({
      ok: true,
      title: parsed.title || title,
      desc: parsed.desc || desc,
      bodyHtml: parsed.bodyHtml || bodyHtml
    });
  } catch (err) {
    console.error('AI translate error:', err);
    return json({ error: 'Lỗi dịch AI: ' + err.message }, 500);
  }
}

export async function handleAdminApi(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path.startsWith('/api/admin/news/')) return handleNewsApi(request, env, url);

  if (path === '/api/admin/login' && method === 'POST') return handleLogin(request, env);
  if (path === '/api/admin/logout' && method === 'POST') return handleLogout(request, env);
  if (path === '/api/admin/me' && method === 'GET') return handleMe(request, env);
  if (path === '/api/admin/setup' && method === 'POST') return handleSetup(request, env);
  if (path === '/api/admin/users' && method === 'GET') return handleUsersGet(request, env);
  if (path === '/api/admin/users' && method === 'POST') return handleUsersPost(request, env);
  if (path === '/api/admin/users' && method === 'DELETE') return handleUsersDelete(request, env, url);
  if (path === '/api/admin/users/role' && method === 'POST') return handleUsersRole(request, env);
  if (path === '/api/admin/profile' && method === 'GET') return handleProfileGet(request, env, url);
  if (path === '/api/admin/profile' && method === 'POST') return handleProfilePost(request, env);
  if (path === '/api/admin/auditlog' && method === 'GET') return handleAuditLog(request, env);
  if (path === '/api/admin/drafts' && method === 'GET') return handleDraftsList(request, env);
  if (path === '/api/admin/clean-duplicate-uploads' && method === 'POST') return handleCleanDuplicateUploads(request, env);
  if (path === '/api/admin/ping-indexnow' && method === 'POST') return handlePingIndexNow(request, env);
  if (path === '/api/admin/ai/translate' && method === 'POST') return handleAiTranslate(request, env);

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
    if (method === 'DELETE') return handleGhDelete(request, env, ghPath);
  }

  return json({ error: 'Không tìm thấy API.' }, 404);
}
