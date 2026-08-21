import { handleAdminApi } from './admin-api.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Keep a single, indexable origin. Cloudflare can otherwise serve the same
    // page over both HTTP and HTTPS, which splits crawl and canonical signals.
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
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

    // Moi request khac: phuc vu file tinh nhu binh thuong.
    return env.ASSETS.fetch(request);
  },
};
