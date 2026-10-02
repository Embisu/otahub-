import fs from 'fs';

const enFiles = fs.readdirSync('en').filter(f => f.endsWith('.html'));
fs.writeFileSync('assets/en-manifest.json', JSON.stringify(enFiles, null, 2));
console.log(`Generated assets/en-manifest.json with ${enFiles.length} files.`);

// Cặp bài VI -> EN lấy từ thẻ hreflang="en" của bài tiếng Việt. Bản EN thường có slug
// tiếng Anh riêng, nên không thể ghép theo tên file (admin dùng file này để biết bài
// nào đã có bản tiếng Anh). Chỉ ghi cặp khi file EN thật sự tồn tại.
const enSet = new Set(enFiles);
const pairs = {};
for (const file of fs.readdirSync('.').filter(f => f.endsWith('.html')).sort()) {
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<link[^>]+hreflang="en"[^>]+href="https:\/\/otahub\.asia\/en\/([^"?#]+?)(?:\.html)?"/i);
  if (!m) continue;
  const enFile = m[1].replace(/\/+$/, '') + '.html';
  if (enSet.has(enFile)) pairs[file] = 'en/' + enFile;
}
fs.writeFileSync('assets/en-pairs.json', JSON.stringify(pairs, null, 2));
console.log(`Generated assets/en-pairs.json with ${Object.keys(pairs).length} VI -> EN pairs.`);
