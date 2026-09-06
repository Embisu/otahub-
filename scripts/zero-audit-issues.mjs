import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// 1. Copy wukong image
const srcImg = path.join(ROOT, 'assets', 'img', 'news-black-myth-wukong-dlc-rebirth.jpg');
const destImg = path.join(ROOT, 'assets', 'img', 'news-black-myth-wukong-dlc.jpg');
if (fs.existsSync(srcImg)) {
  fs.copyFileSync(srcImg, destImg);
  console.log('✅ Created news-black-myth-wukong-dlc.jpg');
}

// 2. Fix reciprocal hreflang across all VI and EN files
function getAllHtmlFiles(dir) {
  let res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || ['node_modules', 'templates', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      res = res.concat(getAllHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      res.push(full);
    }
  }
  return res;
}

const allFiles = getAllHtmlFiles(ROOT);

// Map base filenames
const viFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const enFiles = fs.existsSync('en') ? fs.readdirSync(path.join(ROOT, 'en')).filter(f => f.endsWith('.html')) : [];

const viSlugs = new Set(viFiles.map(f => f.replace(/\.html$/, '')));
const enSlugs = new Set(enFiles.map(f => f.replace(/\.html$/, '')));

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  if (rel.startsWith('templates/')) continue;

  let isEn = rel.startsWith('en/');
  let slug = path.basename(file, '.html');
  let modified = false;

  // Determine if paired file exists
  let pairedSlug = slug;
  if (slug === 'in-depth' && isEn) pairedSlug = 'chuyen-sau';
  if (slug === 'chuyen-sau' && !isEn) pairedSlug = 'in-depth';
  if (slug === 'contact' && isEn) pairedSlug = 'about';
  if (slug === 'privacy' && isEn) pairedSlug = 'chinh-sach-bao-mat';
  if (slug === 'terms' && isEn) pairedSlug = 'chinh-sach-bao-mat';

  const hasVi = isEn ? viSlugs.has(pairedSlug) : true;
  const hasEn = isEn ? true : enSlugs.has(pairedSlug);

  const viUrl = `https://otahub.asia/${isEn ? pairedSlug : slug}`;
  const enUrl = `https://otahub.asia/en/${isEn ? slug : pairedSlug}`;
  const selfCanonical = isEn ? `https://otahub.asia/en/${slug}` : `https://otahub.asia/${slug}`;

  // Clear all old hreflangs and canonical
  content = content.replace(/<link[^>]*hreflang=["'][^"']*["'][^>]*>\s*/gi, '');
  content = content.replace(/<link[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');

  let newHeadLinks = '';
  if (hasVi && hasEn) {
    newHeadLinks += `<link rel="alternate" hreflang="vi" href="${viUrl}">\n<link rel="alternate" hreflang="en" href="${enUrl}">\n<link rel="alternate" hreflang="x-default" href="${viUrl}">\n`;
  } else if (isEn) {
    newHeadLinks += `<link rel="alternate" hreflang="en" href="${selfCanonical}">\n`;
  } else {
    newHeadLinks += `<link rel="alternate" hreflang="vi" href="${selfCanonical}">\n<link rel="alternate" hreflang="x-default" href="${selfCanonical}">\n`;
  }
  newHeadLinks += `<link rel="canonical" href="${selfCanonical}">`;

  // Insert head links right after title/description
  if (content.includes('</title>')) {
    content = content.replace(/<\/title>\s*/i, `</title>\n${newHeadLinks}\n`);
    modified = true;
  }

  // 3. Normalize description length between 90 and 160 chars
  const descMatch = content.match(/<meta\b[^>]*\bname=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (descMatch && rel !== 'admin.html') {
    let desc = descMatch[1].trim();
    if (desc.length > 165) {
      let trimmed = desc.slice(0, 150);
      const lastSpace = trimmed.lastIndexOf(' ');
      if (lastSpace > 100) trimmed = trimmed.slice(0, lastSpace);
      desc = trimmed.replace(/[,;:\-\s]+$/, '') + '.';
      content = content.replace(descMatch[0], `<meta name="description" content="${desc}">`);
      modified = true;
    } else if (desc.length < 80) {
      desc = desc.replace(/\.$/, '') + (isEn ? ' with complete news coverage and insights on OtaHub.' : ' cùng thông tin chi tiết và cẩm nang độc quyền tại OtaHub.');
      content = content.replace(descMatch[0], `<meta name="description" content="${desc}">`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
  }
}

console.log('✅ Successfully harmonized all reciprocal hreflangs and meta descriptions!');
