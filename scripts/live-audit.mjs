import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/otahub\.asia\/[^<]*)<\/loc>/g)].map((m) => m[1]);

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try { results[index] = await worker(items[index]); }
      catch (error) { results[index] = { url: items[index], error: error.message }; }
    }
  }));
  return results;
}
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[m[1].toLowerCase()] = m[3];
  return out;
}

const pageResults = await pool(urls, 12, async (url) => {
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'OtaHub-QA/1.0' } });
  const html = await response.text();
  const canonical = attrs(html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || '').href || '';
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]).src).filter((src) => src && !src.includes('${'));
  return { url, status: response.status, finalUrl: response.url, type: response.headers.get('content-type') || '', canonical, images };
});

const assetUrls = [...new Set(pageResults.flatMap((page) => page.images || []).map((src) => {
  try { return new URL(src, 'https://otahub.asia').href; } catch { return ''; }
}).filter((url) => url.startsWith('https://otahub.asia/')))];
const assetResults = await pool(assetUrls, 16, async (url) => {
  const response = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'OtaHub-QA/1.0' } });
  return { url, status: response.status, type: response.headers.get('content-type') || '' };
});

const issues = [];
for (const page of pageResults) {
  if (page.error) issues.push({ type: 'page-fetch', url: page.url, detail: page.error });
  else {
    if (page.status !== 200) issues.push({ type: 'page-status', url: page.url, detail: page.status });
    if (!page.type.includes('text/html')) issues.push({ type: 'page-content-type', url: page.url, detail: page.type });
    if (page.finalUrl !== page.url && page.finalUrl !== `${page.url}/`) issues.push({ type: 'unexpected-page-redirect', url: page.url, detail: page.finalUrl });
    if (page.canonical && page.canonical !== page.url) issues.push({ type: 'canonical-mismatch', url: page.url, detail: page.canonical });
  }
}
for (const asset of assetResults) {
  if (asset.error) issues.push({ type: 'asset-fetch', url: asset.url, detail: asset.error });
  else {
    if (asset.status !== 200) issues.push({ type: 'asset-status', url: asset.url, detail: asset.status });
    if (!asset.type.startsWith('image/')) issues.push({ type: 'asset-content-type', url: asset.url, detail: asset.type });
  }
}
const byType = Object.fromEntries([...new Set(issues.map((issue) => issue.type))].sort().map((type) => [type, issues.filter((issue) => issue.type === type).length]));
console.log(JSON.stringify({ pages: urls.length, assets: assetUrls.length, issueCount: issues.length, byType, issues }, null, 2));
