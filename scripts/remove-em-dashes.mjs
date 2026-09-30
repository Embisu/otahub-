import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', '.wrangler', 'node_modules']);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skipDirs.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function cleanText(text) {
  // Titles and social metadata read most naturally with a colon.
  text = text.replace(/(<title>[^<]*?)\s*—\s*/g, '$1: ');
  text = text.replace(/((?:property|name)="(?:og:title|twitter:title)"\s+content="[^"]*?)\s*—\s*/g, '$1: ');
  text = text.replace(/((?:aria-label|title)="[^"]*?)\s*—\s*/g, '$1: ');

  // Label/value constructions in article lists should use a colon.
  text = text.replace(/<\/strong>\s*—\s*/g, '</strong>: ');

  // In prose, a comma is less mechanical and preserves the sentence rhythm.
  text = text.replace(/\s+—\s+/g, ', ');
  text = text.replace(/\s*—\s*/g, ' - ');
  return text;
}

let changed = 0;
let removed = 0;
for (const file of walk(root)) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const publicHtml = file.endsWith('.html') && path.basename(file) !== 'admin.html';
  const publicIndex = relative.startsWith('assets/') && /\.(?:json|js)$/.test(file);
  const publicFeed = /(?:feed|sitemap).*\.xml$/.test(path.basename(file));
  const sourceArticle = relative.startsWith('src/pages/') && file.endsWith('.json');
  const publicJson = relative === 'feed.json' || relative === 'manifest.json';
  const publishingRuntime = relative.startsWith('worker/') && file.endsWith('.js');
  if (!publicHtml && !publicIndex && !publicFeed && !sourceArticle && !publicJson && !publishingRuntime) continue;
  const source = fs.readFileSync(file, 'utf8');
  const count = (source.match(/—/g) || []).length;
  if (!count) continue;
  const output = cleanText(source);
  if (output !== source) {
    fs.writeFileSync(file, output, 'utf8');
    changed += 1;
    removed += count;
  }
}

console.log(`Đã làm sạch ${removed} dấu gạch dài trong ${changed} trang công khai.`);
