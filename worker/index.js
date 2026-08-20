import { handleAdminApi } from './admin-api.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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
