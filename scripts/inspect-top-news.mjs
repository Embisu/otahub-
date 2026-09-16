import fs from 'fs';

const content = fs.readFileSync('news.html', 'utf8');
const regex = /<a href="([^"]+)"[^>]*>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/g;
const matches = [];
let match;
while ((match = regex.exec(content)) !== null) {
  matches.push({ href: match[1], title: match[2].trim() });
}

console.log('Total matches in news.html:', matches.length);
matches.slice(0, 10).forEach((m, i) => console.log(`${i + 1}. ${m.href} -> ${m.title}`));
