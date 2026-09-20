/**
 * OtaHub - Engagement API (Reactions & Comments)
 * Backed by Cloudflare KV (env.ADMIN_KV)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const VALID_EMOJIS = ['like', 'love', 'wow'];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function sanitizeText(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

export async function handleEngagementApi(request, env, url) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!env.ADMIN_KV) {
    return jsonResponse({ ok: false, error: 'kv_not_bound' });
  }

  const slug = (url.searchParams.get('slug') || '').trim() || 'home';
  const kvKey = `engage:${slug}`;

  // ── GET: Return reactions and comments ──
  if (request.method === 'GET') {
    try {
      const stored = await env.ADMIN_KV.get(kvKey, { type: 'json' });
      const data = stored || {
        reactions: { like: 0, love: 0, wow: 0 },
        comments: [],
      };
      return jsonResponse({
        ok: true,
        reactions: data.reactions || { like: 0, love: 0, wow: 0 },
        comments: Array.isArray(data.comments) ? data.comments : [],
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  // ── POST: Add reaction or comment ──
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const targetSlug = (body.slug || slug || 'home').trim();
      const targetKey = `engage:${targetSlug}`;

      const stored = (await env.ADMIN_KV.get(targetKey, { type: 'json' })) || {
        reactions: { like: 0, love: 0, wow: 0 },
        comments: [],
      };

      if (!stored.reactions) stored.reactions = { like: 0, love: 0, wow: 0 };
      if (!Array.isArray(stored.comments)) stored.comments = [];

      if (body.type === 'react') {
        const emoji = body.emoji;
        if (VALID_EMOJIS.includes(emoji)) {
          stored.reactions[emoji] = (Number(stored.reactions[emoji]) || 0) + 1;
          await env.ADMIN_KV.put(targetKey, JSON.stringify(stored));
        }
        return jsonResponse({ ok: true, reactions: stored.reactions });
      }

      if (body.type === 'comment') {
        // Honeypot spam check
        if (body.hp) {
          return jsonResponse({ ok: true, comments: stored.comments });
        }

        const name = sanitizeText(body.name || '', 40) || 'Độc giả ẩn danh';
        const text = sanitizeText(body.text || '', 500);

        if (!text) {
          return jsonResponse({ ok: false, error: 'missing_comment_text' }, 400);
        }

        const newComment = {
          name,
          text,
          ts: Date.now(),
        };

        stored.comments.push(newComment);
        if (stored.comments.length > 100) {
          stored.comments = stored.comments.slice(-100);
        }

        await env.ADMIN_KV.put(targetKey, JSON.stringify(stored));
        return jsonResponse({ ok: true, comments: stored.comments });
      }

      return jsonResponse({ ok: false, error: 'invalid_engagement_type' }, 400);
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405);
}
