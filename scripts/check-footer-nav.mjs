import fs from 'fs';

const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const enPages = fs.existsSync('en') ? fs.readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f) : [];
const allPages = [...pages, ...enPages];

console.log('Checking footers in', allPages.length, 'HTML files...');

const missingFooter = [];
const missingNav = [];

for (const p of allPages) {
  const content = fs.readFileSync(p, 'utf8');
  if (!content.includes('<footer') && !content.includes('class="ft-')) {
    missingFooter.push(p);
  }
  if (!content.includes('<nav') && !content.includes('class="nav"')) {
    missingNav.push(p);
  }
}

console.log('Pages missing footer (' + missingFooter.length + '):', missingFooter);
console.log('Pages missing nav (' + missingNav.length + '):', missingNav);
