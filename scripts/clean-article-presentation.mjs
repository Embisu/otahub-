import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = fs.readdirSync(root).filter((name) => name.endsWith('.html') && name !== 'admin.html');
const starterText = /Nội dung mở đầu bài viết|Nội dung chi tiết phần 1/i;
const docsPollution = /docs-internal-guid|font-family:\s*Arial|class="Mso/i;
let changed = 0;
let cleanedDocs = 0;

function plain(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBody(body, title) {
  let out = body;
  out = out.replace(/<!--[\s\S]*?-->/g, '');
  out = out.replace(/<style\b[\s\S]*?<\/style>/gi, '');
  out = out.replace(/<meta\b[^>]*>|<link\b[^>]*>/gi, '');
  out = out.replace(/<span\b[^>]*style="[^"]*font-weight:\s*(?:700|bold)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '<strong>$1</strong>');
  out = out.replace(/<span\b[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '<em>$1</em>');
  out = out.replace(/<\/?(?:span|font|o:p)\b[^>]*>/gi, '');
  out = out.replace(/\s+(?:style|dir|role|aria-level|color|face|size|id)="[^"]*"/gi, '');
  out = out.replace(/\s+class="Mso[^"]*"/gi, '');
  out = out.replace(/<h1\b[^>]*>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>');
  out = out.replace(/<img\b([^>]*?)>/gi, (tag, attrs) => {
    if (/\balt\s*=\s*["'][^"']+["']/i.test(tag)) return tag;
    if (/\balt\s*=\s*["']["']/i.test(tag)) return tag.replace(/\balt\s*=\s*["']["']/i, `alt="${title}"`);
    return `<img${attrs} alt="${title}">`;
  });
  out = out.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

for (const rel of files) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const title = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || rel).replace(/\s*·\s*OtaHub$/i, '');

  if (docsPollution.test(html)) html = html.replace(/<article class="art-body">([\s\S]*?)<\/article>/i, (all, body) => {
    const next = cleanBody(body, title);
    if (next !== body.trim()) cleanedDocs++;
    return `<article class="art-body">\n${next}\n</article>`;
  });

  html = html.replace(/<script type="application\/json" id="admin-block-data">([\s\S]*?)<\/script>\s*/gi, (all, json) => {
    return starterText.test(json) ? '' : all;
  });
  html = html.replaceAll('/author/otahub-editorial', '/author/otahub');

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed++;
  }
}

console.log(JSON.stringify({ scanned: files.length, changed, cleanedDocs }, null, 2));
