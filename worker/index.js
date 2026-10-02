import { handleAdminApi } from './admin-api.js';
import { collectDueSources } from './news-pipeline.js';

function authorSlug(value = '') {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function publicAuthor(request, env, url) {
  const slug = decodeURIComponent(url.pathname.slice('/api/author/'.length)).replace(/\/+$/, '');
  if (!slug || !env.ADMIN_KV) return new Response(JSON.stringify({ error: 'Không tìm thấy tác giả.' }), { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  const list = await env.ADMIN_KV.list({ prefix: 'user:' });
  for (const key of list.keys) {
    const raw = await env.ADMIN_KV.get(key.name);
    if (!raw) continue;
    const user = JSON.parse(raw);
    const role = String(user.role || 'author').toLowerCase();
    const isAdmin = role === 'admin';
    if (!isAdmin && role !== 'author') continue;
    const candidate = isAdmin ? 'otahub' : authorSlug(user.username);
    if (candidate !== slug) continue;
    const name = user.displayName || (isAdmin ? 'OtaHub Editorial' : (String(user.username).toLowerCase() === 'anhthu' ? 'Anh Thu' : user.username));
    const authorRole = user.jobTitle || (isAdmin ? 'Quản trị viên · Ban biên tập' : 'Tác giả');
    const bio = user.bio || (isAdmin
      ? 'Ban biên tập OtaHub phụ trách tin tức, bài tổng hợp và nội dung chuyên sâu về game, anime và manga.'
      : `${name} đóng góp các bài viết về anime, manga và những chủ đề đang được cộng đồng OtaHub quan tâm.`);
    const avatar = user.avatar || '';
    return new Response(JSON.stringify({ slug: candidate, username: user.username, name, role: authorRole, bio, avatar }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
  }
  // Anna là hồ sơ tác giả đã được chủ website xác nhận. Giữ fallback này để
  // trang tĩnh vẫn hoạt động trong lúc tài khoản KV chưa đồng bộ giữa môi trường.
  if (slug === 'anna') {
    return new Response(JSON.stringify({
      slug: 'anna', username: 'anna', name: 'Anna', role: 'Tác giả',
      bio: 'Anna viết về game indie, trải nghiệm giàu cốt truyện và những tác phẩm đáng chú ý dành cho cộng đồng OtaHub.',
      avatar: '',
    }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
  }
  return new Response(JSON.stringify({ error: 'Không tìm thấy tác giả.' }), { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

// Hồ sơ tác giả công khai: mỗi lần tính phải liệt kê + đọc toàn bộ tài khoản
// trong KV (gói miễn phí chỉ 1.000 lượt liệt kê/ngày), nên lưu kết quả vào cache
// của Cloudflare 5 phút. Sửa hồ sơ trong admin sẽ xoá cache này (admin-api.js).
const AUTHOR_CACHE_SECONDS = 300;
export function authorCacheKey(origin, slug) {
  return new Request(`${origin}/__edge-cache/author/${encodeURIComponent(slug)}`);
}
async function cachedPublicAuthor(env, url, ctx) {
  const slug = decodeURIComponent(url.pathname.slice('/api/author/'.length)).replace(/\/+$/, '');
  const key = authorCacheKey(url.origin, slug);
  const hit = await caches.default.match(key);
  if (hit) return hit;
  const res = await publicAuthor(null, env, url);
  const copy = new Response(res.clone().body, res);
  copy.headers.set('Cache-Control', `public, max-age=${AUTHOR_CACHE_SECONDS}`);
  ctx.waitUntil(caches.default.put(key, copy));
  return res;
}

// Hồ sơ tác phẩm đã có trang tĩnh /game|anime|manga/<slug> (scripts/build-profiles.mjs):
// link cũ /game-detail?t=Tên chuyển hướng 301 sang URL mới. Tựa chưa có hồ sơ vẫn dùng trang động.
let profilePathsCache = null;
async function profileRedirect(env, url) {
  const m = url.pathname.match(/^\/(en\/)?(game|anime|manga)-detail\/?$/);
  const title = url.searchParams.get('t');
  if (!m || !title) return null;
  if (!profilePathsCache) {
    try {
      const res = await env.ASSETS.fetch(new Request(new URL('/assets/profile-paths.json', url)));
      profilePathsCache = res.ok ? await res.json() : {};
    } catch (e) { profilePathsCache = {}; }
  }
  const path = profilePathsCache[`${m[2]}|${title}`];
  return path ? Response.redirect(`${url.origin}${m[1] ? '/en' : ''}${path}`, 301) : null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Keep a single, indexable origin. Cloudflare can otherwise serve the same
    // page over both HTTP and HTTPS, which splits crawl and canonical signals.
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const profileMove = await profileRedirect(env, url);
    if (profileMove) return profileMove;

    if (url.pathname === '/admin' || url.pathname === '/admin.html') {
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
    }

    if (url.pathname.startsWith('/api/admin/')) {
      try {
        return await handleAdminApi(request, env, url);
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Lỗi máy chủ: ' + err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname.startsWith('/api/author/')) {
      return cachedPublicAuthor(env, url, ctx);
    }

    // Hồ sơ tác giả mới dùng cùng một giao diện; dữ liệu tài khoản được xác
    // nhận từ KV nên tên tác giả cũ trong bài không tự tạo thành hồ sơ giả.
    if (/^\/(?:en\/)?author\/[^/]+\/?$/.test(url.pathname)) {
      const profileCheck = await cachedPublicAuthor(env, new URL('/api/author/' + url.pathname.split('/').filter(Boolean).pop(), url), ctx);
      if (profileCheck.status === 404) {
        const notFound = await env.ASSETS.fetch(new Request(new URL('/404.html', url), request));
        return new Response(notFound.body, { status: 404, headers: notFound.headers });
      }
      const exact = await env.ASSETS.fetch(request);
      // Chỉ dùng kết quả này khi ASSETS thực sự khớp file tĩnh (2xx). Với các
      // slug chưa có trang tĩnh riêng (vd tác giả mới đăng ký), ASSETS trả về
      // 404 ở đây, nên rơi xuống fallback bên dưới.
      if (exact.ok) return exact;
      // Gọi thẳng URL sạch "/author" (không có .html), html_handling:
      // auto-trailing-slash khiến ASSETS tự redirect .html sang URL sạch, và
      // nếu request "/author.html" ở đây, ta sẽ nhận về chính cái redirect đó
      // thay vì nội dung trang, khiến slug bị mất khỏi URL người dùng thấy.
      const fallback = new URL('/author', url);
      return env.ASSETS.fetch(new Request(fallback, request));
    }

    // Ảnh thu nhỏ cho thẻ bài (/assets/img/_t|_s/<gốc>.webp, tạo bởi scripts/build-thumbs.py) có sẵn
    // thì được phục vụ thẳng như file tĩnh. Chỉ khi chưa tạo (ảnh mới sau lần chạy script) mới tới đây:
    // chuyển về ảnh gốc để thẻ không bao giờ bị vỡ ảnh.
    if (/^\/assets\/img\/_[ts]\//.test(url.pathname)) {
      const orig = url.pathname.replace(/^\/assets\/img\/_[ts]\/(.+)\.webp$/, '/assets/img/$1');
      if (orig !== url.pathname) {
        return new Response(null, { status: 302, headers: { Location: orig, 'Cache-Control': 'public, max-age=3600' } });
      }
    }

    // Ảnh tải lên đã có trên GitHub được Cloudflare phục vụ thẳng như file tĩnh
    // (không chạy tới đây). Worker chỉ chạy cho ảnh CHƯA deploy / chỉ nằm trong KV:
    // đọc KV rồi giữ trong cache Cloudflare 1 ngày, nên mỗi ảnh chỉ tốn ~1 lượt
    // đọc KV/ngày/khu vực thay vì 1 lượt cho mỗi người xem. Ảnh không tồn tại
    // cũng được nhớ 5 phút để link hỏng/bot dò không đốt lượt đọc KV.
    if (url.pathname.startsWith('/assets/img/uploads/')) {
      const fileName = decodeURIComponent(url.pathname.slice('/assets/img/uploads/'.length));
      const cacheKey = new Request(url.origin + url.pathname);
      const cached = await caches.default.match(cacheKey);
      if (cached) {
        if (!cached.headers.get('X-Upload-Miss')) return cached;
        return env.ASSETS.fetch(request);
      }
      // Không phục vụ SVG từ vùng upload: SVG là tài liệu chủ động và có thể
      // mang script/event handler nếu bị mở trực tiếp cùng origin.
      if (fileName && /\.(?:jpe?g|jfif|png|webp|gif|avif)$/i.test(fileName) && env.ADMIN_KV) {
        try {
          let raw = await env.ADMIN_KV.get(`upload_img:${fileName}`, { type: 'arrayBuffer' });
          if (!raw) {
            // Bản trùng đã được gộp bởi "Dọn ảnh trùng lặp": phục vụ ảnh gốc.
            const alias = await env.ADMIN_KV.get(`upload_alias:${fileName}`);
            if (alias) raw = await env.ADMIN_KV.get(`upload_img:${alias}`, { type: 'arrayBuffer' });
          }
          if (raw) {
            const ext = fileName.split('.').pop().toLowerCase();
            const mime = ext === 'webp' ? 'image/webp' :
                         ext === 'png' ? 'image/png' :
                         ext === 'gif' ? 'image/gif' :
                         ext === 'avif' ? 'image/avif' : 'image/jpeg';
            const res = new Response(raw, {
              status: 200,
              headers: {
                'Content-Type': mime,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff',
              },
            });
            // Trình duyệt giữ 1 năm; cache Cloudflare chỉ 1 ngày để ảnh đã xoá
            // không bị phục vụ mãi ở các khu vực khác.
            const edgeCopy = new Response(res.clone().body, res);
            edgeCopy.headers.set('Cache-Control', 'public, max-age=86400');
            ctx.waitUntil(caches.default.put(cacheKey, edgeCopy));
            return res;
          }
          ctx.waitUntil(caches.default.put(cacheKey, new Response(null, {
            status: 200,
            headers: { 'X-Upload-Miss': '1', 'Cache-Control': 'public, max-age=300' },
          })));
        } catch (e) {
          console.warn('Lỗi đọc upload_img từ KV:', e);
        }
      }
    }

    // Moi request khac: phuc vu file tinh nhu binh thuong.
    return env.ASSETS.fetch(request);
  },
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(collectDueSources(env));
  },
};
