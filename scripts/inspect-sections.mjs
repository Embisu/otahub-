import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== SECTIONS IN index.html ===');
// 1. Hero
const hero = html.match(/id="h-title">([^<]+)</);
console.log('Hero:', hero ? hero[1] : 'none');

// 2. Hot this week
const hotMatch = html.match(/class="s-art"[\s\S]*?class="sa-t">([^<]+)<\/div>/g);
console.log('Side Arts (Hot this week):', (hotMatch || []).length);
(hotMatch || []).forEach(m => {
  const t = m.match(/class="sa-t">([^<]+)<\/div>/);
  console.log('  -', t ? t[1] : '');
});

// 3. Featured grid (Tin nổi bật)
const fcMatch = html.match(/class="fc-body"[\s\S]*?<h2[^>]*>([^<]+)<\/h2>/g);
console.log('Featured Grid:', (fcMatch || []).length);
(fcMatch || []).forEach(m => {
  const t = m.match(/<h2[^>]*>([^<]+)<\/h2>/);
  console.log('  -', t ? t[1] : '');
});

// 4. Latest wrap (Bài mới nhất)
const wMatch = html.match(/class="wc-t">([^<]+)<\/div>/g);
console.log('Latest wrap (w-card):', (wMatch || []).length);
(wMatch || []).forEach(m => {
  const t = m.match(/class="wc-t">([^<]+)<\/div>/);
  console.log('  -', t ? t[1] : '');
});
