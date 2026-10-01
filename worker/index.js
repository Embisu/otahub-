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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Keep a single, indexable origin. Cloudflare can otherwise serve the same
    // page over both HTTP and HTTPS, which splits crawl and canonical signals.
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

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
        return new Response(JSON.stringify({ error: 'Loi server: ' + err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname.startsWith('/api/author/')) {
      return publicAuthor(request, env, url);
    }

    // Hồ sơ tác giả mới dùng cùng một giao diện; dữ liệu tài khoản được xác
    // nhận từ KV nên tên tác giả cũ trong bài không tự tạo thành hồ sơ giả.
    if (/^\/(?:en\/)?author\/[^/]+\/?$/.test(url.pathname)) {
      const profileCheck = await publicAuthor(request, env, new URL('/api/author/' + url.pathname.split('/').filter(Boolean).pop(), url));
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

    // Phục vụ ảnh tải lên từ KV Storage (nhanh, tức thì, 100% tin cậy, không phụ thuộc chu kỳ deploy của repo)
    if (url.pathname.startsWith('/assets/img/uploads/')) {
      const fileName = decodeURIComponent(url.pathname.slice('/assets/img/uploads/'.length));
      // Không phục vụ SVG từ vùng upload: SVG là tài liệu chủ động và có thể
      // mang script/event handler nếu bị mở trực tiếp cùng origin.
      if (fileName && /\.(?:jpe?g|jfif|png|webp|gif|avif)$/i.test(fileName) && env.ADMIN_KV) {
        try {
          const raw = await env.ADMIN_KV.get(`upload_img:${fileName}`, { type: 'arrayBuffer' });
          if (raw) {
            const ext = fileName.split('.').pop().toLowerCase();
            const mime = ext === 'webp' ? 'image/webp' :
                         ext === 'png' ? 'image/png' :
                         ext === 'gif' ? 'image/gif' :
                         ext === 'avif' ? 'image/avif' : 'image/jpeg';
            return new Response(raw, {
              status: 200,
              headers: {
                'Content-Type': mime,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff',
              },
            });
          }
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
