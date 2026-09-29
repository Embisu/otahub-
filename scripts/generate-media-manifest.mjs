import fs from 'fs';
import path from 'path';

console.log('Generating assets/img-manifest.json...');

const imgDir = 'assets/img';
const files = fs.readdirSync(imgDir);

const manifest = [];
// Add uploads folder as a directory entry
manifest.push({
  name: 'uploads',
  path: 'assets/img/uploads',
  sha: 'dir-uploads',
  size: 0,
  type: 'dir'
});

const IMG_RE = /\.(jpe?g|png|webp|gif|svg)$/i;

for (const f of files) {
  if (f === 'uploads') continue;
  const fullPath = path.join(imgDir, f);
  const stat = fs.statSync(fullPath);
  if (stat.isFile() && IMG_RE.test(f)) {
    manifest.push({
      name: f,
      path: `assets/img/${f}`,
      sha: `static-${stat.size}-${Math.floor(stat.mtimeMs)}`,
      size: stat.size,
      type: 'file',
      download_url: `/assets/img/${f}`
    });
  }
}

fs.writeFileSync('assets/img-manifest.json', JSON.stringify(manifest), 'utf8');
console.log(`Generated assets/img-manifest.json with ${manifest.length} entries (${(fs.statSync('assets/img-manifest.json').size / 1024).toFixed(1)} KB).`);
