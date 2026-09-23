import { getSessionUser, json, logAudit } from './lib.js';

const MAX_FEED_BYTES = 2 * 1024 * 1024;
const DEFAULT_AI_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const ALLOWED_STATUSES = new Set(['new', 'shortlisted', 'drafted', 'ignored', 'published', 'failed']);

function stripCdata(value = '') {
  return value.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '').trim();
}

function decodeEntities(value = '') {
  return stripCdata(value)
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function textOnly(value = '') {
  return decodeEntities(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, names) {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
    if (match) return decodeEntities(match[1]).trim();
  }
  return '';
}

function attr(block, tagName, attrName) {
  const match = block.match(new RegExp(`<${tagName}\\b[^>]*\\s${attrName}=["']([^"']+)["'][^>]*>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function normalizeUrl(raw, baseUrl) {
  try {
    const url = new URL(raw, baseUrl);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$)/i.test(key)) url.searchParams.delete(key);
    }
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    return '';
  }
}

function isSafePublicFeedUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) return false;
    if (/^(0|10|127|169\.254|192\.168)\./.test(host)) return false;
    const private172 = host.match(/^172\.(\d+)\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return false;
    if (host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) return false;
    return true;
  } catch {
    return false;
  }
}

function dateOrNull(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function parseFeed(xml, feedUrl) {
  const isAtom = /<feed\b/i.test(xml);
  const blocks = xml.match(isAtom ? /<entry\b[\s\S]*?<\/entry>/gi : /<item\b[\s\S]*?<\/item>/gi) || [];
  return blocks.slice(0, 100).map((block) => {
    const rawLink = isAtom
      ? (attr(block, 'link', 'href') || tag(block, ['link']))
      : tag(block, ['link']);
    const canonicalUrl = normalizeUrl(rawLink, feedUrl);
    const rawContent = tag(block, ['content:encoded', 'content', 'description', 'summary']);
    const imageUrl = attr(block, 'media:content', 'url') || attr(block, 'media:thumbnail', 'url') || attr(block, 'enclosure', 'url');
    return {
      externalId: tag(block, ['guid', 'id']) || canonicalUrl,
      canonicalUrl,
      title: textOnly(tag(block, ['title'])),
      summary: textOnly(tag(block, ['description', 'summary'])).slice(0, 4000),
      contentText: textOnly(rawContent).slice(0, 30000),
      author: textOnly(tag(block, ['dc:creator', 'author', 'name'])).slice(0, 300),
      imageUrl: normalizeUrl(imageUrl, feedUrl) || null,
      publishedAt: dateOrNull(tag(block, ['pubDate', 'published', 'updated', 'dc:date'])),
    };
  }).filter((item) => item.canonicalUrl && item.title);
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function readTextLimited(response, maxBytes = MAX_FEED_BYTES) {
  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > maxBytes) throw new Error(`Feed vuot gioi han ${maxBytes} bytes`);
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`Feed vuot gioi han ${maxBytes} bytes`);
    }
    chunks.push(value);
  }
  const joined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(joined);
}

async function collectSource(env, source) {
  const run = await env.NEWS_DB.prepare(
    'INSERT INTO source_fetch_runs (source_id) VALUES (?) RETURNING id'
  ).bind(source.id).first();
  try {
    const response = await fetch(source.feed_url, {
      headers: { 'User-Agent': 'OtaHub-NewsBot/1.0 (+https://otahub.asia)' },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await readTextLimited(response);
    const items = parseFeed(xml, source.feed_url);
    let inserted = 0;
    for (const item of items) {
      const urlHash = await sha256(item.canonicalUrl);
      const fingerprint = await sha256(`${item.title.toLowerCase()}|${(item.contentText || item.summary).slice(0, 1000).toLowerCase()}`);
      const result = await env.NEWS_DB.prepare(`
        INSERT OR IGNORE INTO collected_articles
          (source_id, external_id, canonical_url, url_hash, title, summary, content_text, author, image_url, published_at, fingerprint, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        source.id, item.externalId, item.canonicalUrl, urlHash, item.title, item.summary,
        item.contentText, item.author, item.imageUrl, item.publishedAt, fingerprint,
        JSON.stringify({ feedUrl: source.feed_url })
      ).run();
      inserted += result.meta.changes || 0;
    }
    await env.NEWS_DB.batch([
      env.NEWS_DB.prepare(`UPDATE news_sources SET last_fetched_at = CURRENT_TIMESTAMP, last_success_at = CURRENT_TIMESTAMP, last_error = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(source.id),
      env.NEWS_DB.prepare(`UPDATE source_fetch_runs SET finished_at = CURRENT_TIMESTAMP, status = 'success', fetched_count = ?, inserted_count = ? WHERE id = ?`).bind(items.length, inserted, run.id),
    ]);
    return { sourceId: source.id, source: source.name, fetched: items.length, inserted };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await env.NEWS_DB.batch([
      env.NEWS_DB.prepare(`UPDATE news_sources SET last_fetched_at = CURRENT_TIMESTAMP, last_error = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(message.slice(0, 1000), source.id),
      env.NEWS_DB.prepare(`UPDATE source_fetch_runs SET finished_at = CURRENT_TIMESTAMP, status = 'failed', error = ? WHERE id = ?`).bind(message.slice(0, 1000), run.id),
    ]);
    return { sourceId: source.id, source: source.name, error: message };
  }
}

export async function collectDueSources(env, { force = false } = {}) {
  if (!env.NEWS_DB) throw new Error('NEWS_DB binding chua duoc cau hinh');
  const dueClause = force ? '' : `AND (last_fetched_at IS NULL OR datetime(last_fetched_at, '+' || fetch_interval_minutes || ' minutes') <= CURRENT_TIMESTAMP)`;
  const { results } = await env.NEWS_DB.prepare(`SELECT * FROM news_sources WHERE active = 1 ${dueClause} ORDER BY COALESCE(last_fetched_at, '1970-01-01') ASC LIMIT 20`).all();
  const output = [];
  for (const source of results) output.push(await collectSource(env, source));
  console.log(JSON.stringify({ event: 'news_collection_complete', sourceCount: results.length, results: output }));
  return output;
}

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

function escapeHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitizeArticleHtml(value = '') {
  const withoutDangerousBlocks = String(value)
    .replace(/<(script|style|iframe|object|embed|form|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|svg)\b[^>]*\/?\s*>/gi, '');
  return withoutDangerousBlocks.replace(/<\/?([a-z0-9]+)(?:\s[^>]*)?>/gi, (whole, name) => {
    const tagName = name.toLowerCase();
    if (!['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'br'].includes(tagName)) return '';
    return whole.startsWith('</') ? `</${tagName}>` : `<${tagName}>`;
  });
}

function normalizeAiResult(raw, article) {
  let parsed;
  try {
    const candidate = String(raw || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    parsed = JSON.parse(candidate);
  } catch {
    parsed = { title: article.title, excerpt: article.summary, body_html: `<p>${escapeHtml(String(raw || article.content_text || article.summary))}</p>` };
  }
  const title = String(parsed.title || article.title).slice(0, 180);
  const sourceLink = `<p><strong>Nguon tham khao:</strong> <a href="${escapeHtml(article.canonical_url)}" rel="nofollow noopener" target="_blank">${escapeHtml(article.title)}</a></p>`;
  return {
    title,
    slug: slugify(parsed.slug || title),
    excerpt: String(parsed.excerpt || article.summary || '').slice(0, 500),
    bodyHtml: `${sanitizeArticleHtml(parsed.body_html || '')}\n${sourceLink}`,
    sourceNotes: JSON.stringify([{ title: article.title, url: article.canonical_url }]),
  };
}

async function requireEditor(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return { response: json({ error: 'Chua dang nhap.' }, 401) };
  if (user.role !== 'admin' && user.role !== 'editor') return { response: json({ error: 'Chi admin/editor moi duoc quan ly pipeline tin.' }, 403) };
  return { user };
}

async function generateDraft(env, articleId) {
  const article = await env.NEWS_DB.prepare(`SELECT a.*, s.name AS source_name FROM collected_articles a JOIN news_sources s ON s.id = a.source_id WHERE a.id = ?`).bind(articleId).first();
  if (!article) throw new Error('Khong tim thay bai thu thap');
  const job = await env.NEWS_DB.prepare(`INSERT INTO generation_jobs (article_id, status, model, started_at) VALUES (?, 'running', ?, CURRENT_TIMESTAMP) RETURNING id`).bind(articleId, DEFAULT_AI_MODEL).first();
  try {
    const prompt = `Ban la bien tap vien OtaHub. Dua tren du lieu nguon ben duoi, viet mot ban nhap tin tuc bang tieng Viet co cau truc va trung thuc. Khong them su kien, con so hay trich dan khong co trong nguon. Khong sao chep nguyen van. Tra ve duy nhat JSON hop le gom title, slug, excerpt va body_html. body_html dung cac the p, h2, h3, ul, li; khong dung markdown.\n\nNguon: ${article.source_name}\nTieu de: ${article.title}\nURL: ${article.canonical_url}\nTom tat: ${article.summary || ''}\nNoi dung: ${(article.content_text || '').slice(0, 24000)}`;
    const response = await env.AI.run(DEFAULT_AI_MODEL, {
      messages: [
        { role: 'system', content: 'Ban chi tra ve JSON hop le, khong kem giai thich.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2600,
      temperature: 0.35,
    });
    const raw = response.response || response.result || response;
    const draft = normalizeAiResult(typeof raw === 'string' ? raw : JSON.stringify(raw), article);
    const saved = await env.NEWS_DB.prepare(`
      INSERT INTO generated_drafts (article_id, job_id, title, slug, excerpt, body_html, source_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).bind(articleId, job.id, draft.title, draft.slug, draft.excerpt, draft.bodyHtml, draft.sourceNotes).first();
    await env.NEWS_DB.batch([
      env.NEWS_DB.prepare(`UPDATE generation_jobs SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(job.id),
      env.NEWS_DB.prepare(`UPDATE collected_articles SET status = 'drafted' WHERE id = ?`).bind(articleId),
    ]);
    return { id: saved.id, ...draft };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await env.NEWS_DB.prepare(`UPDATE generation_jobs SET status = 'failed', error = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(message.slice(0, 1000), job.id).run();
    throw error;
  }
}

export async function handleNewsApi(request, env, url) {
  const auth = await requireEditor(request, env);
  if (auth.response) return auth.response;
  if (!env.NEWS_DB) return json({ error: 'NEWS_DB binding chua duoc cau hinh.' }, 503);
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/admin/news/sources' && method === 'GET') {
    const { results } = await env.NEWS_DB.prepare(`SELECT * FROM news_sources ORDER BY active DESC, name ASC`).all();
    return json({ sources: results });
  }
  if (path === '/api/admin/news/sources' && method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
    const name = String(body?.name || '').trim();
    const feedUrl = normalizeUrl(String(body?.feedUrl || ''), String(body?.feedUrl || ''));
    if (!name || !feedUrl || !isSafePublicFeedUrl(feedUrl)) return json({ error: 'Can ten va feed URL cong khai HTTP(S) hop le.' }, 400);
    try {
      const row = await env.NEWS_DB.prepare(`INSERT INTO news_sources (name, feed_url, site_url, category, language, fetch_interval_minutes) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`).bind(
        name, feedUrl, body.siteUrl ? normalizeUrl(String(body.siteUrl), feedUrl) : null,
        String(body.category || 'news').slice(0, 50), String(body.language || 'vi').slice(0, 10),
        Math.max(15, Math.min(1440, Number(body.fetchIntervalMinutes) || 120))
      ).first();
      await logAudit(env, { action: 'news_source_created', username: auth.user.username, source: name });
      return json({ source: row }, 201);
    } catch (error) {
      return json({ error: String(error).includes('UNIQUE') ? 'Feed URL da ton tai.' : 'Khong the them nguon.' }, 409);
    }
  }
  if (path === '/api/admin/news/collect' && method === 'POST') {
    const results = await collectDueSources(env, { force: true });
    await logAudit(env, { action: 'news_collect_manual', username: auth.user.username, sourceCount: results.length });
    return json({ results });
  }
  if (path === '/api/admin/news/articles' && method === 'GET') {
    const status = ALLOWED_STATUSES.has(url.searchParams.get('status')) ? url.searchParams.get('status') : 'new';
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 50));
    const { results } = await env.NEWS_DB.prepare(`SELECT a.*, s.name AS source_name, s.category AS source_category FROM collected_articles a JOIN news_sources s ON s.id = a.source_id WHERE a.status = ? ORDER BY COALESCE(a.published_at, a.collected_at) DESC LIMIT ?`).bind(status, limit).all();
    return json({ articles: results, status });
  }
  if (path === '/api/admin/news/drafts' && method === 'GET') {
    const { results } = await env.NEWS_DB.prepare(`SELECT d.*, a.canonical_url, a.image_url, s.name AS source_name, s.category AS source_category FROM generated_drafts d JOIN collected_articles a ON a.id = d.article_id JOIN news_sources s ON s.id = a.source_id ORDER BY d.created_at DESC LIMIT 100`).all();
    return json({ drafts: results });
  }

  const draftMatch = path.match(/^\/api\/admin\/news\/drafts\/(\d+)$/);
  if (draftMatch && method === 'PATCH') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
    if (!['review', 'approved', 'rejected', 'published'].includes(body?.status)) return json({ error: 'Trang thai ban nhap khong hop le.' }, 400);
    await env.NEWS_DB.prepare(`UPDATE generated_drafts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(body.status, Number(draftMatch[1])).run();
    return json({ ok: true });
  }

  const sourceMatch = path.match(/^\/api\/admin\/news\/sources\/(\d+)$/);
  if (sourceMatch && method === 'PATCH') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
    const active = body?.active === false || body?.active === 0 ? 0 : 1;
    await env.NEWS_DB.prepare(`UPDATE news_sources SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(active, Number(sourceMatch[1])).run();
    return json({ ok: true });
  }
  if (sourceMatch && method === 'DELETE') {
    await env.NEWS_DB.prepare(`DELETE FROM news_sources WHERE id = ?`).bind(Number(sourceMatch[1])).run();
    await logAudit(env, { action: 'news_source_deleted', username: auth.user.username, sourceId: Number(sourceMatch[1]) });
    return json({ ok: true });
  }

  const articleMatch = path.match(/^\/api\/admin\/news\/articles\/(\d+)$/);
  if (articleMatch && method === 'PATCH') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Du lieu khong hop le.' }, 400); }
    if (!ALLOWED_STATUSES.has(body?.status)) return json({ error: 'Trang thai khong hop le.' }, 400);
    await env.NEWS_DB.prepare(`UPDATE collected_articles SET status = ? WHERE id = ?`).bind(body.status, Number(articleMatch[1])).run();
    return json({ ok: true });
  }
  const generateMatch = path.match(/^\/api\/admin\/news\/articles\/(\d+)\/generate$/);
  if (generateMatch && method === 'POST') {
    if (!env.AI) return json({ error: 'AI binding chua duoc cau hinh.' }, 503);
    const draft = await generateDraft(env, Number(generateMatch[1]));
    await logAudit(env, { action: 'news_draft_generated', username: auth.user.username, articleId: Number(generateMatch[1]), draftId: draft.id });
    return json({ draft }, 201);
  }
  return json({ error: 'Not found' }, 404);
}
