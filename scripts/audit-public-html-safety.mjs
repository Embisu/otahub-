import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleFiles = [];

for (const dir of ['', 'en']) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) continue;
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'admin.html') {
      articleFiles.push(path.join(fullDir, entry.name));
    }
  }
}

const forbidden = [
  /id=["']wp-img-floating-toolbar["']/i,
  /id=["']body-textarea["']/i,
  /id=["']rank-math-metabox["']/i,
  /id=["']body-(?:live|code|blocks)-wrap["']/i,
  /\bdata-ohfield\s*=/i,
  /\bcontenteditable\s*=\s*["']true["']/i
];

const problems = [];
for (const file of articleFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replaceAll('\\', '/');
  if (forbidden.some(pattern => pattern.test(html))) {
    problems.push(`${rel}: chứa dấu hiệu giao diện quản trị`);
  }

  const match = html.match(/<article\b[^>]*class=["'][^"']*art-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
  if (!match) continue;
  const body = match[1];
  const openDiv = (body.match(/<div(?:\s|>)/gi) || []).length;
  const closeDiv = (body.match(/<\/div\s*>/gi) || []).length;
  if (openDiv > closeDiv) {
    problems.push(`${rel}: thiếu ${openDiv - closeDiv} thẻ </div> trong thân bài`);
  }
}

if (problems.length) {
  console.error('❌ Kiểm tra an toàn HTML thất bại:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`✅ HTML safety: ${articleFiles.length} file không chứa mã quản trị hoặc <div> chưa đóng.`);
