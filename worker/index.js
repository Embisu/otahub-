import { handleAdminApi } from './admin-api.js';
import { handleEngagementApi } from './engagement.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Keep a single, indexable origin. Cloudflare can otherwise serve the same
    // page over both HTTP and HTTPS, which splits crawl and canonical signals.
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/engagement' || url.pathname.startsWith('/api/engagement/')) {
      try {
        return await handleEngagementApi(request, env, url);
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: 'Loi engagement server: ' + err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
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

    // Phục vụ ảnh tải lên từ KV Storage (nhanh, tức thì, 100% tin cậy, không phụ thuộc chu kỳ deploy của repo)
    if (url.pathname.startsWith('/assets/img/uploads/')) {
      const fileName = decodeURIComponent(url.pathname.slice('/assets/img/uploads/'.length));
      if (fileName && env.ADMIN_KV) {
        try {
          const raw = await env.ADMIN_KV.get(`upload_img:${fileName}`, { type: 'arrayBuffer' });
          if (raw) {
            const ext = fileName.split('.').pop().toLowerCase();
            const mime = ext === 'webp' ? 'image/webp' :
                         ext === 'png' ? 'image/png' :
                         ext === 'gif' ? 'image/gif' :
                         ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
            return new Response(raw, {
              status: 200,
              headers: {
                'Content-Type': mime,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
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
};
