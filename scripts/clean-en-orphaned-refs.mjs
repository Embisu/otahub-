import fs from 'fs';

const badSlugs = [
  'control-resonant-launches-metacritic-84',
  'cyberpunk-edgerunners-2-netflix-october-20',
  'fire-emblem-fortunes-weave-metacritic-89',
  'grand-blue-season-4-announced',
  'jojo-steel-ball-run-stages-2-3-premiere-september-25',
  'youjo-senki-ii-season-wrap-up'
];

const targetFiles = [
  'en/index.html',
  'en/anime.html',
  'en/gaming.html',
  'en/news.html',
  'en/lich-phat-song.html',
  'en/sap-ra-mat.html',
  'sitemap.xml',
  'feed.json',
  'assets/search.js'
];

for (const tf of targetFiles) {
  if (!fs.existsSync(tf)) continue;
  let content = fs.readFileSync(tf, 'utf8');
  let modified = false;

  for (const slug of badSlugs) {
    if (content.includes(slug)) {
      console.log(`Found ${slug} in ${tf}`);
      modified = true;
      if (tf.endsWith('.xml')) {
        content = content.replace(new RegExp(`<url>\\s*<loc>[^<]*${slug}[^<]*<\\/loc>[\\s\\S]*?<\\/url>\\s*`, 'g'), '');
      } else if (tf.endsWith('.json')) {
        content = content.replace(new RegExp(`\\{[^{}]*${slug}[^{}]*\\},?\\n?`, 'g'), '');
      } else if (tf.endsWith('.js')) {
        content = content.replace(new RegExp(`\\{[^{}]*${slug}[^{}]*\\},?\\n?`, 'g'), '');
      } else {
        // HTML files: remove ticker items, cards, schedule entries, and direct links
        content = content.replace(new RegExp(`<span class="tick-item">[^<]*<a href="[^"]*${slug}[^"]*"[\\s\\S]*?<\\/span>`, 'g'), '');
        content = content.replace(new RegExp(`<article class="w-card"><a href="[^"]*${slug}[^"]*"[\\s\\S]*?<\\/article>`, 'g'), '');
        content = content.replace(new RegExp(`<a class="sc"[^>]*href="[^"]*${slug}[^"]*"[\\s\\S]*?<\\/a>`, 'g'), '');
        content = content.replace(new RegExp(`<a href="[^"]*${slug}[^"]*" class="ac"[\\s\\S]*?<\\/a>`, 'g'), '');
        content = content.replace(new RegExp(`<a href="[^"]*${slug}[^"]*" style="display:block[\\s\\S]*?<\\/a>`, 'g'), '');
        content = content.replace(new RegExp(`\\{[^}]*${slug}[^}]*\\},?`, 'g'), '');
        content = content.replace(new RegExp(`'[^']*':\\s*'[^']*${slug}[^']*',?`, 'g'), '');
      }
    }
  }

  if (modified) {
    fs.writeFileSync(tf, content, 'utf8');
    console.log(`Cleaned bad slugs from ${tf}`);
  }
}
