import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory() && (e.name === '.git' || e.name === 'node_modules')) return [];
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk('.').filter((f) => f.endsWith('.html') && !f.includes('templates') && !f.includes('admin.html'));
let articleSchemaCount = 0;
const authorTypes = {};
const publisherTypes = {};

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of matches) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] === 'NewsArticle' || data['@type'] === 'Article') {
        articleSchemaCount++;
        const aType = typeof data.author === 'object' ? `${data.author['@type']}:${data.author.name || ''}` : typeof data.author;
        authorTypes[aType] = (authorTypes[aType] || 0) + 1;
        const pType = typeof data.publisher === 'object' ? `${data.publisher['@type']}:${data.publisher.name || ''}` : typeof data.publisher;
        publisherTypes[pType] = (publisherTypes[pType] || 0) + 1;
      }
    } catch (e) {}
  }
}

console.log('Total articles with Article/NewsArticle schema:', articleSchemaCount);
console.log('Author types distribution:', JSON.stringify(authorTypes, null, 2));
console.log('Publisher types distribution:', JSON.stringify(publisherTypes, null, 2));
