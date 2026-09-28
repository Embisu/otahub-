import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const excluded = new Set(['/admin', '/cong-dong-game-thu-viet-nam-quay-lung-voi-pubg']);
const response = await fetch('https://otahub.asia/sitemap.xml', {
  headers: { 'user-agent': 'OtaHub-Sitemap-Repair/1.0' },
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) throw new Error(`Cannot retrieve live sitemap: HTTP ${response.status}`);
const live = await response.text();
const blocks = [...live.matchAll(/<url>[\s\S]*?<\/url>/g)].map((match) => match[0]);
const kept = [];
for (const block of blocks) {
  const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  if (!loc) continue;
  const pathname = new URL(loc).pathname.replace(/\/$/, '') || '/';
  if (excluded.has(pathname)) continue;
  if (pathname !== '/') {
    const local = path.join(root, `${pathname.slice(1)}.html`);
    const index = path.join(root, pathname.slice(1), 'index.html');
    if (!fs.existsSync(local) && !fs.existsSync(index)) continue;
  }
  kept.push(block);
}
const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${kept.map((block) => `  ${block.replaceAll('\n', '\n  ')}`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), output, 'utf8');
console.log(`Rebuilt sitemap.xml with ${kept.length} verified URLs.`);
