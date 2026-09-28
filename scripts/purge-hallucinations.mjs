import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// Slugs to purge completely
const PURGE_SLUGS = [
  // Vietnamese
  'control-resonant-ra-mat-metacritic-84',
  'splatoon-raiders-launch',
  'fire-emblem-fortunes-weave-metacritic-89',
  'rhythm-heaven-groove-nintendo',
  'jojo-steel-ball-run-stage-2-3-len-song-25-9',
  'dragon-ball-super-beerus-len-song-11-10',
  'grand-blue-mua-4-cong-bo-sau-mua-3-ket-thuc',
  'cyberpunk-edgerunners-2-ra-mat-20-10-netflix',
  'youjo-senki-ii-ket-thuc-phat-song',
  'one-piece-chapter-1191-theres-still-loki',
  'one-piece-chapter-1192-dawn-thor-bullet-imu',
  'one-piece-chapter-1193-zoro-sommers-still-practicing',

  // English
  'en/dragon-ball-super-beerus-premieres-october-11',
  'en/one-piece-chapter-1191-theres-still-loki',
  'en/one-piece-chapter-1192-dawn-thor-bullet-imu',
  'en/one-piece-chapter-1193-zoro-sommers-still-practicing',
  'en/one-piece-chapter-1194-spoilers-loki-uranus-elbaf',
  'en/rhythm-heaven-groove-nintendo',
  'en/splatoon-raiders-launch'
];

console.log(`🗑️ Step 1: Deleting ${PURGE_SLUGS.length} hallucinated article files...`);
for (const slug of PURGE_SLUGS) {
  const filePath = path.join(root, `${slug}.html`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`   Deleted: ${filePath}`);
  }
}

// Step 2: Clean references in index files and hubs
console.log(`\n🧹 Step 2: Cleaning references from index.html, hubs, search.js, sitemap, feeds...`);

function cleanHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const s of PURGE_SLUGS) {
    const rawSlug = s.replace(/^en\//, '');
    
    // Ticker items
    const tickerRe = new RegExp(`<span class="tick-item">[^<]*<a href="\\/${rawSlug}"[^>]*>[\\s\\S]*?<\\/span>\\s*`, 'gi');
    if (tickerRe.test(html)) {
      html = html.replace(tickerRe, '');
      modified = true;
    }

    // Marquee items
    const mqRe = new RegExp(`<a class="mq-item" href="\\/${rawSlug}">[\\s\\S]*?<\\/a>`, 'gi');
    if (mqRe.test(html)) {
      html = html.replace(mqRe, '');
      modified = true;
    }

    // Article cards (<article class="w-card">...)
    const wCardRe = new RegExp(`<article class="w-card">\\s*<a href="\\/${rawSlug}"[\\s\\S]*?<\\/article>\\s*`, 'gi');
    if (wCardRe.test(html)) {
      html = html.replace(wCardRe, '');
      modified = true;
    }

    // Category cards (<a href="/slug" class="ac">...)
    const acRe = new RegExp(`<a href="\\/${rawSlug}" class="ac"[\\s\\S]*?<\\/a>\\s*`, 'gi');
    if (acRe.test(html)) {
      html = html.replace(acRe, '');
      modified = true;
    }

    // News section cards (<a href="/slug" style="display:block;background:#150a2c;...</a>)
    const newsCardRe = new RegExp(`<a href="\\/${rawSlug}" style="display:block;background:#150a2c;[\\s\\S]*?<\\/a>\\s*`, 'gi');
    if (newsCardRe.test(html)) {
      html = html.replace(newsCardRe, '');
      modified = true;
    }

    // Sidebar art cards (<a class="sb-art" href="/slug">...)
    const sbRe = new RegExp(`<a class="sb-art" href="\\/${rawSlug}"[\\s\\S]*?<\\/a>\\s*`, 'gi');
    if (sbRe.test(html)) {
      html = html.replace(sbRe, '');
      modified = true;
    }
  }

  // Recount news.html count if in news.html
  if (filePath.endsWith('news.html')) {
    const countMatch = html.match(/(<!-- OTAHUB_NEW30_START -->[\s\S]*?<h2[^>]*>)(\d+)( tin mới đã kiểm chứng<\/h2><div[^>]*>)([\s\S]*?)(<\/div><\/section><!-- OTAHUB_NEW30_END -->)/);
    if (countMatch) {
      const cardCount = (countMatch[4].match(/href="\//g) || []).length;
      html = html.replace(/(<!-- OTAHUB_NEW30_START -->[\s\S]*?<h2[^>]*>)\d+( tin mới đã kiểm chứng<\/h2>)/, `$1${cardCount}$2`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`   Cleaned references in: ${path.basename(filePath)}`);
  }
}

const htmlPages = [
  'index.html', 'anime.html', 'gaming.html', 'manga.html', 'news.html',
  'en/index.html', 'en/anime.html', 'en/gaming.html', 'en/manga.html', 'en/news.html'
];
htmlPages.forEach(p => cleanHtmlFile(path.join(root, p)));

// Step 3: Clean assets/search.js
const searchPath = path.join(root, 'assets', 'search.js');
if (fs.existsSync(searchPath)) {
  let searchJs = fs.readFileSync(searchPath, 'utf8');
  const match = searchJs.match(/(?:window\.|var\s*)IDX\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    try {
      let idxList = JSON.parse(match[1]);
      const initialCount = idxList.length;
      const purgeSet = new Set(PURGE_SLUGS.map(s => '/' + s.replace(/^en\//, '')));
      idxList = idxList.filter(item => !purgeSet.has(item.url || item.u));
      searchJs = searchJs.replace(/(?:window\.|var\s*)IDX\s*=\s*\[[\s\S]*?\];/, () => `window.IDX = ${JSON.stringify(idxList, null, 2)};`);
      fs.writeFileSync(searchPath, searchJs, 'utf8');
      console.log(`   Cleaned assets/search.js (Removed ${initialCount - idxList.length} items, remaining: ${idxList.length})`);
    } catch (e) {
      console.warn('Search index parse error:', e);
    }
  }
}

// Step 4: Clean sitemap.xml
const sitemapPath = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sm = fs.readFileSync(sitemapPath, 'utf8');
  for (const s of PURGE_SLUGS) {
    const url = `https://otahub.asia/${s.replace(/^en\//, '')}`;
    const urlEn = `https://otahub.asia/${s}`;
    const re = new RegExp(`\\s*<url>\\s*<loc>(?:${url}|${urlEn})<\\/loc>[\\s\\S]*?<\\/url>`, 'g');
    sm = sm.replace(re, '');
  }
  fs.writeFileSync(sitemapPath, sm, 'utf8');
  console.log(`   Cleaned sitemap.xml`);
}

// Step 5: Clean feed.json & feed.xml
const feedJsonPath = path.join(root, 'feed.json');
if (fs.existsSync(feedJsonPath)) {
  try {
    const fj = JSON.parse(fs.readFileSync(feedJsonPath, 'utf8'));
    if (Array.isArray(fj.items)) {
      const purgeUrls = new Set(PURGE_SLUGS.map(s => `https://otahub.asia/${s.replace(/^en\//, '')}`));
      fj.items = fj.items.filter(i => !purgeUrls.has(i.url) && !purgeUrls.has(i.id));
      fs.writeFileSync(feedJsonPath, JSON.stringify(fj, null, 2), 'utf8');
      console.log(`   Cleaned feed.json`);
    }
  } catch(e) {}
}

const feedXmlPath = path.join(root, 'feed.xml');
if (fs.existsSync(feedXmlPath)) {
  try {
    let fx = fs.readFileSync(feedXmlPath, 'utf8');
    for (const s of PURGE_SLUGS) {
      const url = `https://otahub.asia/${s.replace(/^en\//, '')}`;
      const re = new RegExp(`\\s*<item>\\s*<title>[\\s\\S]*?<link>${url}<\\/link>[\\s\\S]*?<\\/item>`, 'g');
      fx = fx.replace(re, '');
    }
    fs.writeFileSync(feedXmlPath, fx, 'utf8');
    console.log(`   Cleaned feed.xml`);
  } catch(e) {}
}

// Step 6: Clean articles mentioning Grand Blue S4 or Control Resonant
const articlesToScrub = [
  { file: 'anime-moi-crunchyroll-2026-romelia-black-torch.html', replaceFrom: /Grand Blue Dreaming mùa 4[^\.\n]*[\.\n]/gi, replaceTo: 'Grand Blue Dreaming mùa 2 đã được công bố chính thức.\n' },
  { file: 'en/new-crunchyroll-anime-2026-romelia-black-torch.html', replaceFrom: /Grand Blue Dreaming Season 4[^\.\n]*[\.\n]/gi, replaceTo: 'Grand Blue Dreaming Season 2 has been officially confirmed.\n' },
  { file: 'en/gamescom-2026-playstation-highlights.html', replaceFrom: /Control Resonant[^\.\n]*[\.\n]/gi, replaceTo: 'Control 2 is currently in active production at Remedy.\n' },
];

for (const sc of articlesToScrub) {
  const p = path.join(root, sc.file);
  if (fs.existsSync(p)) {
    let text = fs.readFileSync(p, 'utf8');
    text = text.replace(sc.replaceFrom, sc.replaceTo);
    fs.writeFileSync(p, text, 'utf8');
    console.log(`   Scrubbed hallucinated mention in: ${sc.file}`);
  }
}

console.log('\n✨ Purge completed successfully!');
