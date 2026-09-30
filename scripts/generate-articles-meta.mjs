import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['admin.html','404.html','index.html','about.html'].includes(f));
const metaMap = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<meta\s+name="author"\s+content="([^"]*)"/i);
  const author = m && m[1] ? m[1].replace(' · OtaHub', '').trim() : 'OtaHub Editorial';
  metaMap[f] = { author };
});

fs.writeFileSync('assets/articles-meta.json', JSON.stringify(metaMap, null, 2));
console.log(`Generated assets/articles-meta.json for ${Object.keys(metaMap).length} files.`);
