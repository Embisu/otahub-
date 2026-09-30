import fs from 'fs';

const html = fs.readFileSync('admin.html', 'utf8');

console.log('=== ADMIN.HTML COMPREHENSIVE ARCHITECTURE SCAN ===\n');

// 1. Sidebar Nav Items & Views
const navRegex = /id="nav-([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let m;
console.log('--- Sidebar Views ---');
while ((m = navRegex.exec(html)) !== null) {
  const text = m[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  console.log(`- ${m[1]}: "${text}"`);
}

// 2. Special Pages & editors
console.log('\n--- Special Page Editors ---');
const specialRegex = /loadSpecialPage\('([^']+)'\)/g;
const specialPages = new Set();
while ((m = specialRegex.exec(html)) !== null) {
  specialPages.add(m[1]);
}
console.log([...specialPages]);

// 3. API endpoints used by admin
console.log('\n--- API Endpoints ---');
const apiRegex = /['"`](\/api\/[^'"`]+)['"`]/g;
const apis = new Set();
while ((m = apiRegex.exec(html)) !== null) {
  apis.add(m[1].split('?')[0]);
}
console.log([...apis]);

// 4. Check what Hub/Special pages exist in the filesystem vs what admin can edit
console.log('\n--- Site Pages vs Admin Capabilities ---');
const allHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('admin'));
const hubOrSpecial = allHtmlFiles.filter(f => {
  // Articles usually have slugs with multiple hyphens or specific patterns, let's list main hub pages
  return ['index.html', 'about.html', 'choi-gi.html', 'rankings.html', 'hot.html', 'releases.html', 'tin-tuc.html', 'gaming.html', 'anime.html', 'manga.html', 'reviews.html', 'chuyen-sau.html', 'esports.html', 'top-list.html', 'guide.html', 'search.html', 'tag.html', 'chinh-sach-bao-mat.html', 'dieu-khoan-su-dung.html', 'tieu-chuan-danh-gia.html'].includes(f);
});
console.log('Main Hub & Policy pages found on disk:', hubOrSpecial);

// Check if English mirror pages exist
const enHtmlFiles = fs.existsSync('en') ? fs.readdirSync('en').filter(f => f.endsWith('.html')) : [];
console.log('English Hub & Policy pages found in /en/:', enHtmlFiles);

// 5. Look for TODOs or incomplete markers in admin.html
console.log('\n--- TODOs or Fixmes in admin.html ---');
const todoRegex = /\/\/\s*(TODO|FIXME|NOTE|CHƯA|CẦN)[\s\S]*?$/gm;
let todoCount = 0;
while ((m = todoRegex.exec(html)) !== null) {
  if (todoCount < 10) console.log(m[0].trim());
  todoCount++;
}
console.log(`Total TODO/FIXME/NOTE comments: ${todoCount}`);
