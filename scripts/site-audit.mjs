import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skipDirs = new Set(['.git', 'node_modules', 'OTAHUB', 'OTAHUB 2', 'OTAHUB png']);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && skipDirs.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function cleanText(value = '') { return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[m[1].toLowerCase()] = m[3];
  return out;
}
function localTarget(fromFile, raw) {
  const value = raw.split('#')[0].split('?')[0];
  if (!value || /^(?:https?:)?\/\//i.test(value) || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) return null;
  let target = value.startsWith('/') ? path.join(root, value.slice(1)) : path.resolve(path.dirname(fromFile), value);
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  if (fs.existsSync(target + '.html')) return target + '.html';
  if (fs.existsSync(path.join(target, 'index.html'))) return path.join(target, 'index.html');
  return false;
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.toLowerCase().endsWith('.html'));
const issues = [];
const counts = { htmlFiles: htmlFiles.length, links: 0, images: 0, schemas: 0 };
const canonicalOwners = new Map();
const pageRecords = [];

for (const file of htmlFiles) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const html = fs.readFileSync(file, 'utf8');
  const title = cleanText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const desc = attrs(html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0] || '').content || '';
  const canonical = attrs(html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0] || '').href || '';
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => cleanText(m[1])).filter(Boolean);
  const templatePage = rel === 'admin.html' || /(?:^|\/)(?:article|(?:anime|game|manga)-detail)\.html$/.test(rel);

  if (!title && !templatePage) issues.push({ type: 'missing-title', file: rel });
  if (!desc && !templatePage) issues.push({ type: 'missing-description', file: rel });
  if (!templatePage && desc && desc.length < 70) issues.push({ type: 'short-description', file: rel, detail: desc.length });
  if (!templatePage && desc.length > 180) issues.push({ type: 'long-description', file: rel, detail: desc.length });
  if (!canonical && !templatePage) issues.push({ type: 'missing-canonical', file: rel });
  if (canonical) {
    if (canonicalOwners.has(canonical)) issues.push({ type: 'duplicate-canonical', file: rel, detail: canonicalOwners.get(canonical) });
    else canonicalOwners.set(canonical, rel);
  }
  if (h1s.length === 0 && !templatePage) issues.push({ type: 'missing-h1', file: rel });
  if (h1s.length > 1 && !templatePage) issues.push({ type: 'multiple-h1', file: rel, detail: h1s.length });

  const ids = [...html.matchAll(/\bid=(["'])(.*?)\1/gi)].map((m) => m[2]);
  for (const id of new Set(ids)) if (ids.filter((value) => value === id).length > 1) issues.push({ type: 'duplicate-id', file: rel, detail: id });

  for (const m of html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>/gi)) {
    counts.links++;
    if (m[2].includes('${')) continue;
    const target = localTarget(file, m[2]);
    if (target === false) issues.push({ type: 'broken-local-link', file: rel, detail: m[2] });
    if (/\.html(?:[?#]|$)/i.test(m[2]) && !/^(?:https?:)?\/\//i.test(m[2])) issues.push({ type: 'html-internal-link', file: rel, detail: m[2] });
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    counts.images++;
    const a = attrs(m[0]);
    if ((a.src || '').includes('${') || templatePage) continue;
    const target = localTarget(file, a.src || '');
    if (target === false) issues.push({ type: 'missing-image', file: rel, detail: a.src || '(empty)' });
    if (!('alt' in a)) issues.push({ type: 'missing-alt', file: rel, detail: a.src || '(empty)' });
    if (!a.width || !a.height) issues.push({ type: 'missing-image-size', file: rel, detail: a.src || '(empty)' });
  }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    if (!/^(?:shortcut )?icon$/i.test(a.rel || '') || !a.href || a.href.includes('${')) continue;
    const target = localTarget(file, a.href);
    if (target === false) issues.push({ type: 'missing-icon', file: rel, detail: a.href });
  }
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    counts.schemas++;
    if (m[1].includes('${')) continue;
    try { JSON.parse(m[1]); } catch (error) { issues.push({ type: 'invalid-jsonld', file: rel, detail: error.message }); }
  }
  for (const m of html.matchAll(/<link\b[^>]*\bhreflang=(["'])(.*?)\1[^>]*>/gi)) {
    const a = attrs(m[0]);
    if (!a.href?.startsWith('https://otahub.asia/')) continue;
    const localPath = new URL(a.href).pathname;
    const target = localTarget(file, localPath);
    if (target === false) issues.push({ type: 'broken-hreflang', file: rel, detail: `${a.hreflang}: ${a.href}` });
  }
  for (const m of html.matchAll(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (!m[1].trim() || /\btype=["']module["']/.test(m[0])) continue;
    try { new Function(m[1]); } catch (error) { issues.push({ type: 'javascript-syntax', file: rel, detail: error.message }); }
  }
  pageRecords.push({ file, rel, html, canonical, templatePage });
}

for (const page of pageRecords) {
  if (!page.canonical || page.templatePage) continue;
  for (const m of page.html.matchAll(/<link\b[^>]*\bhreflang=(["'])(.*?)\1[^>]*>/gi)) {
    const a = attrs(m[0]);
    if (!a.href?.startsWith('https://otahub.asia/') || a.hreflang === 'x-default') continue;
    const targetPath = localTarget(page.file, new URL(a.href).pathname);
    if (!targetPath || targetPath === false) continue;
    const targetHtml = fs.readFileSync(targetPath, 'utf8');
    const reciprocal = [...targetHtml.matchAll(/<link\b[^>]*\bhreflang=(["'])(.*?)\1[^>]*>/gi)]
      .map((item) => attrs(item[0]).href)
      .includes(page.canonical);
    if (!reciprocal) issues.push({ type: 'missing-reciprocal-hreflang', file: page.rel, detail: a.href });
  }
}

const byType = Object.fromEntries([...new Set(issues.map((issue) => issue.type))].sort().map((type) => [type, issues.filter((issue) => issue.type === type).length]));
console.log(JSON.stringify({ counts, issueCount: issues.length, byType, issues }, null, 2));
