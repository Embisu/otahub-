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
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  const targetUser = url ? (url.searchParams.get('username') || '').toLowerCase() : '';
  const username = (me.role === 'admin' && targetUser) ? targetUser : me.username.toLowerCase();
  const raw = await env.ADMIN_KV.get(`user:${username}`);
  if (!raw) return json({ error: 'Khong tim thay tai khoan.' }, 404);
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
  if (!me) return json({ error: 'Chua dang nhap.' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { targetUsername, displayName, bio, avatar, jobTitle } = body || {};
  const target = (me.role === 'admin' && targetUsername) ? String(targetUsername).toLowerCase() : me.username.toLowerCase();
  const key = `user:${target}`;
  const raw = await env.ADMIN_KV.get(key);
  if (!raw) return json({ error: 'Khong tim thay tai khoan.' }, 404);
  const u = JSON.parse(raw);
  if (typeof displayName === 'string') u.displayName = displayName.trim().slice(0, 100);
  if (typeof bio === 'string') u.bio = bio.trim().slice(0, 1000);
  if (typeof avatar === 'string') u.avatar = avatar.trim().slice(0, 500);
  if (typeof jobTitle === 'string') u.jobTitle = jobTitle.trim().slice(0, 100);
  await env.ADMIN_KV.put(key, JSON.stringify(u));
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
  if (!canManageUsers(me)) return json({ error: 'Chi admin moi duoc xem danh sach tai khoan.' }, 403);
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
  const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${ref}`, { headers: ghHeaders(env) });
  if (!r.ok) {
    const errBody = await r.json().catch(() => ({}));
    await logAudit(env, {
      action: 'gh_get_failed',
      username: user.username,
      file: ghPath,
      status: r.status,
      error: errBody.message || ('status ' + r.status)
    });
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
    return json({ error: 'GitHub API error: ' + r.status + detail }, r.status);
  }
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
  if (/\.html$/i.test(ghPath) && !isImageUpload && content.length < 400) return json({ error: 'Noi dung file HTML rong hoac qua ngan — tu choi ghi de de tranh mat bai.' }, 400);

  // Xử lý tải ảnh lên: Ưu tiên lưu ngay vào KV Storage (nhanh, tức thì, 100% không phụ thuộc token GitHub)
  if (isImageUpload) {
    const approxBytes = Math.floor((content.length * 3) / 4);
    if (approxBytes > 8 * 1024 * 1024) return json({ error: 'Anh vuot qua 8MB.' }, 413);
    if (!hasValidImageSignature(ghPath, content)) return json({ error: 'Noi dung file khong khop dinh dang anh.' }, 415);

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

        const existingFileName = await env.ADMIN_KV.get(`upload_hash:${hashHex}`);
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
    if (sha) putPayload.sha = sha;

    let ghSuccess = false;
    try {
      const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
        method: 'PUT',
        headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
        body: JSON.stringify(putPayload),
      });
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

    return json({ error: 'Khong the luu file anh len may chu.' }, 500);
  }

  // Cho các file nội dung (.html, .json, ...)
  const putPayload = {
    message: `[${user.username}] ${message || 'cap nhat qua admin'}`,
    content,
    branch: GH_BRANCH,
  };
  const is40HexSha = typeof sha === 'string' && /^[0-9a-f]{40}$/i.test(sha.trim());
  if (is40HexSha) putPayload.sha = sha.trim();

  let r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
    method: 'PUT',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(putPayload),
  });

  // Nếu gặp lỗi 409 Conflict (SHA không khớp, SHA stale hoặc file đã tồn tại trên GitHub):
  // Tự động truy vấn SHA mới nhất từ GitHub và thử commit lại ngay lập tức
  if (r.status === 409) {
    try {
      const getLatest = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}?ref=${GH_BRANCH}`, {
        headers: ghHeaders(env),
      });
      if (getLatest.ok) {
        const latestData = await getLatest.json();
        if (latestData.sha && latestData.sha !== putPayload.sha) {
          putPayload.sha = latestData.sha;
          r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${ghPath}`, {
            method: 'PUT',
            headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
            body: JSON.stringify(putPayload),
          });
        }
      }
    } catch(e) {}
  }

  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    await logAudit(env, { action: 'write_failed', username: user.username, file: ghPath, error: e.message || r.status });
    return json({ error: e.message || ('GitHub API error: ' + r.status) }, r.status);
  }
  await logAudit(env, { action: 'write', username: user.username, file: ghPath, message: message || '' });
  return json(await r.json());
}

// Xoa 1 file (anh trong Media Library hoac bai viet .html)
async function handleGhDelete(request, env, ghPath) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (!ghPath) return json({ error: 'Thieu duong dan file.' }, 400);
  if (!canDeletePath(user, ghPath)) {
    return json({ error: `Vai tro "${user.role}" khong duoc xoa file nay.` }, 403);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
  const { sha, message } = body || {};

  // Xóa khỏi KV nếu là ảnh upload
  if (ghPath.startsWith('assets/img/uploads/') && env.ADMIN_KV) {
    const fileName = ghPath.replace(/^assets\/img\/uploads\//, '');
    await env.ADMIN_KV.delete(`upload_img:${fileName}`);
    await env.ADMIN_KV.delete(`upload_meta:${fileName}`);
  }

  if (sha && String(sha).startsWith('kv-')) {
    await logAudit(env, { action: 'delete_kv', username: user.username, file: ghPath });
    return json({ ok: true });
  }

  if (!sha) return json({ error: 'Thieu sha cua file can xoa.' }, 400);
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
    return json({ error: e.message || ('GitHub API error: ' + r.status) }, r.status);
  }
  await logAudit(env, { action: 'delete', username: user.username, file: ghPath });
  return json({ ok: true });
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

async function handleCleanDuplicateUploads(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (user.role !== 'admin' && user.role !== 'editor') return json({ error: 'Khong co quyen.' }, 403);
  if (!env.ADMIN_KV) return json({ error: 'KV khong ton tai.' }, 500);

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
      // Giữ lại 1 bản (bản có thời gian tạo cũ nhất), xoá các bản thừa
      items.sort((a, b) => (a.uploadedAt || 0) - (a.uploadedAt || 0));
      const keep = items[0];
      await env.ADMIN_KV.put(`upload_hash:${hash}`, keep.name);
      for (let i = 1; i < items.length; i++) {
        const dup = items[i];
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
  if (!user) return json({ error: 'Chua dang nhap.' }, 401);
  if (user.role === 'contributor') return json({ error: 'Chi editor/admin moi duoc ping IndexNow.' }, 403);

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

  return json({ error: 'Not found' }, 404);
}
