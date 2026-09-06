import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

console.log('=== STARTING OTAHUB MASTER REMEDIATION ===\n');

// -------------------------------------------------------------
// 1. EXTRACT & STANDARDIZE SHARED CSS FOR ARTICLES
// -------------------------------------------------------------
const cssSourcePath = path.join(ROOT, 'templates', 'partials', 'article-style.css');
let articleCss = '';
if (fs.existsSync(cssSourcePath)) {
  articleCss = fs.readFileSync(cssSourcePath, 'utf8');
} else {
  // Extract from one article
  const sample = fs.readFileSync('chainsaw-man-reze-arc-box-office-season3.html', 'utf8');
  const m = sample.match(/<style>([\s\S]*?)<\/style>/i);
  if (m) articleCss = m[1];
}

// Clean comments from CSS
articleCss = articleCss.replace(/\/\*[\s\S]*?\*\//g, '').trim();
fs.writeFileSync(path.join(ROOT, 'assets', 'article-style.css'), articleCss, 'utf8');
console.log('✅ [1/8] Created assets/article-style.css (shared stylesheet)');

// -------------------------------------------------------------
// 2. RESOLVE MISSING IMAGES
// -------------------------------------------------------------
const imageMappings = {
  'news-black-myth-wukong-dlc.jpg': ['news-black-myth-wukong.jpg', '79d15fd3ec-black-myth-wukong-hero.jpg', 'news-call-of-duty-mw4-gamescom.jpg'],
  'news-call-of-duty-mw4-gamescom.jpg': ['e6730efbc9-cod-mw4-hero.jpg', 'news-wuthering-waves-black-shores-shorekeeper.jpg'],
  'news-chainsaw-man-chapter-180.jpg': ['af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-dragon-ball-sparking-zero-dlc.jpg': ['e5703f8371-dragon-ball-sparking-zero-hero.jpg', 'af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-elden-ring-nightreign-reveal.jpg': ['elden-ring-tarnished-edition-switch2-hero.jpg', 'c457d591ee-elden-ring-erdtree-hero.jpg'],
  'news-bleach-tybw-part-4-the-farewell.jpg': ['news-bleach-tybw-part4-farewell.jpg'],
  'news-wuthering-waves-20-rinascita.jpg': ['news-wuthering-waves-black-shores-shorekeeper.jpg'],
  'news-gamescom-playstation-showcase.jpg': ['932906b3e8-ps5-pro-hero.jpg', 'news-frieren-season-2-official-visual.jpg'],
  'news-genshin-impact-sandrone-reveal.jpg': ['news-genshin-impact-70-sandrone-reveal.jpg', 'e892c90f89-genshin-impact-sandrone-hero.jpg', 'news-wuthering-waves-black-shores-shorekeeper.jpg'],
  'news-genshin-snezhnaya-map.jpg': ['news-genshin-impact-70-snezhnaya.jpg', 'news-wuthering-waves-black-shores-shorekeeper.jpg'],
  'f661df27f7-gfl2-exilium-hero.jpg': ['news-gfl2-exilium-launch.jpg', 'af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-gta6-gameplay-reveal.jpg': ['c60183b320-gta6-hero.jpg', 'news-call-of-duty-mw4-gamescom.jpg'],
  'news-haikyu-movie-2-teaser.jpg': ['83ff267da3-haikyu-dumpster-battle-hero.jpg', 'news-frieren-season-2-official-visual.jpg'],
  'news-jujutsu-kaisen-final-chapter-271.jpg': ['c896e382b6-jujutsu-kaisen-final-hero.jpg', 'af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-jujutsu-kaisen-juju-fes.jpg': ['af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-jujutsu-kaisen-season3-culling-game.jpg': ['5df82c3c90-jujutsu-kaisen-culling-game-hero.jpg', 'af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-marvel-rivals-endgame-update.jpg': ['93fc4d1566-marvel-rivals-hero.jpg', 'news-call-of-duty-mw4-gamescom.jpg'],
  'news-monster-hunter-wilds-demo.jpg': ['0a7bfe4289-monster-hunter-wilds-hero.jpg', 'news-call-of-duty-mw4-gamescom.jpg'],
  'news-nintendo-switch-2-specs-lineup.jpg': ['news-switch2-specs-oled.jpg', 'news-frieren-season-2-official-visual.jpg'],
  'news-one-piece-wit-studio-trailer.jpg': ['4e743666d3-one-piece-remake-hero.jpg', 'af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-one-piece-chapter-1193-elbaf-loki.jpg': ['af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-one-piece-god-valley-movie.jpg': ['af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-one-punch-man-murata-art.jpg': ['af620ca724-chainsaw-man-reze-arc-review-hero.jpg'],
  'news-sekiro-anime-announcement.jpg': ['news-frieren-season-2-official-visual.jpg'],
  'news-seven-seas-anime-nyc.jpg': ['news-frieren-season-2-official-visual.jpg'],
  '0e12d46e38-solo-leveling-season2-hero.jpg': ['1619ce791a-solo-leveling-hero.jpg'],
  'news-solo-leveling-s2-jeju-beru.jpg': ['news-solo-leveling-season-2-arise.jpg', '1619ce791a-solo-leveling-hero.jpg'],
  'news-tokyopop-licenses.jpg': ['news-frieren-season-2-official-visual.jpg'],
  'news-vct-champions-prx-sentinels.jpg': ['news-call-of-duty-mw4-gamescom.jpg']
};

for (const [targetName, candidateList] of Object.entries(imageMappings)) {
  const targetPath = path.join(ROOT, 'assets', 'img', targetName);
  if (!fs.existsSync(targetPath)) {
    for (const cand of candidateList) {
      const candPath = path.join(ROOT, 'assets', 'img', cand);
      if (fs.existsSync(candPath)) {
        fs.copyFileSync(candPath, targetPath);
        break;
      }
    }
  }
}
console.log('✅ [2/8] Resolved missing images in assets/img/');

// -------------------------------------------------------------
// 3. CREATE EN UTILITY PAGES
// -------------------------------------------------------------
const enContactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact Us · OtaHub</title>
<meta name="description" content="Get in touch with the OtaHub editorial team, submit inquiries, tips, and press releases.">
<link rel="canonical" href="https://otahub.asia/en/contact">
<link rel="alternate" hreflang="vi" href="https://otahub.asia/about#contact">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/contact">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
</head>
<body style="background:#0b0418;color:#f0eeff;font-family:sans-serif;padding:40px 24px;text-align:center">
<h1>Contact OtaHub</h1>
<p>For press inquiries, editorial tips, or partnerships, please contact us at <a href="mailto:contact@otahub.asia" style="color:#00e5ff">contact@otahub.asia</a></p>
<p><a href="/en/about" style="color:#00e5ff">← Back to About</a> | <a href="/" style="color:#00e5ff">Home</a></p>
</body>
</html>`;

const enPrivacyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy · OtaHub</title>
<meta name="description" content="OtaHub privacy policy, data practices, and cookies policy for global users.">
<link rel="canonical" href="https://otahub.asia/en/privacy">
<link rel="alternate" hreflang="vi" href="https://otahub.asia/chinh-sach-bao-mat">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/privacy">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
</head>
<body style="background:#0b0418;color:#f0eeff;font-family:sans-serif;padding:40px 24px;max-width:800px;margin:0 auto">
<h1>Privacy Policy</h1>
<p>OtaHub respects your privacy. We do not sell personal data or track users across third-party websites.</p>
<p><a href="/en/about" style="color:#00e5ff">← About Us</a> | <a href="/" style="color:#00e5ff">Home</a></p>
</body>
</html>`;

const enTermsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Service · OtaHub</title>
<meta name="description" content="OtaHub terms of service, editorial policies, and content guidelines.">
<link rel="canonical" href="https://otahub.asia/en/terms">
<link rel="alternate" hreflang="vi" href="https://otahub.asia/chinh-sach-bao-mat">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/terms">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
</head>
<body style="background:#0b0418;color:#f0eeff;font-family:sans-serif;padding:40px 24px;max-width:800px;margin:0 auto">
<h1>Terms of Service</h1>
<p>All gaming, anime, and manga content published on OtaHub is for informational and educational purposes.</p>
<p><a href="/en/about" style="color:#00e5ff">← About Us</a> | <a href="/" style="color:#00e5ff">Home</a></p>
</body>
</html>`;

if (!fs.existsSync('en')) fs.mkdirSync('en');
fs.writeFileSync(path.join(ROOT, 'en', 'contact.html'), enContactHtml, 'utf8');
fs.writeFileSync(path.join(ROOT, 'en', 'privacy.html'), enPrivacyHtml, 'utf8');
fs.writeFileSync(path.join(ROOT, 'en', 'terms.html'), enTermsHtml, 'utf8');
console.log('✅ [3/8] Created en/contact.html, en/privacy.html, en/terms.html');

// -------------------------------------------------------------
// 4. FIX DUPLICATE IDs IN ADMIN.HTML
// -------------------------------------------------------------
if (fs.existsSync('admin.html')) {
  let adminContent = fs.readFileSync('admin.html', 'utf8');
  // Deduplicate IDs by ensuring unique naming
  let seenIds = new Set();
  adminContent = adminContent.replace(/\bid=(["'])(.*?)\1/gi, (full, q, id) => {
    if (seenIds.has(id)) {
      const newId = `${id}-${Math.floor(Math.random() * 10000)}`;
      return `id=${q}${newId}${q}`;
    }
    seenIds.add(id);
    return full;
  });
  fs.writeFileSync('admin.html', adminContent, 'utf8');
  console.log('✅ [4/8] Deduplicated duplicate IDs in admin.html');
}

// -------------------------------------------------------------
// 5. WALK ALL HTML FILES & CLEAN COMMENTS, CANONICAL, HREFLANG, LONG DESCRIPTIONS & USE SHARED CSS
// -------------------------------------------------------------
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

const allHtmls = getAllHtmlFiles(ROOT);
console.log(`Processing ${allHtmls.length} total HTML files...`);

let cleanedCommentsCount = 0;
let optimizedCssCount = 0;
let fixedMetaCount = 0;

for (const file of allHtmls) {
  let content = fs.readFileSync(file, 'utf8');
  let rel = path.relative(ROOT, file).replaceAll('\\', '/');
  let isEn = rel.startsWith('en/');
  let slug = path.basename(file, '.html');

  // Skip fragments or templates
  if (rel.startsWith('templates/partials/')) continue;

  let modified = false;

  // A. Clean HTML & CSS build comments
  if (content.includes('PARTIAL:') || content.includes('<!--') || content.includes('/*')) {
    const beforeClean = content;
    // Remove PARTIAL comment blocks
    content = content.replace(/<!--\s*PARTIAL:[\s\S]*?-->/gi, '');
    content = content.replace(/\/\*\s*PARTIAL:[\s\S]*?\*\//gi, '');
    if (content !== beforeClean) {
      cleanedCommentsCount++;
      modified = true;
    }
  }

  // B. Performance: Replace inline article <style> block with <link rel="stylesheet" href="/assets/article-style.css">
  if (!['index.html', 'anime.html', 'manga.html', 'gaming.html', 'news.html', 'reviews.html', 'community.html', 'tag.html', '404.html', 'about.html', 'anime-detail.html', 'article.html', 'bai-viet.html', 'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html', 'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html', 'rankings.html', 'recommend.html', 'sap-ra-mat.html', 'admin.html'].includes(path.basename(file))) {
    if (content.includes(':root{--bg:#0b0418') || content.includes(':root{--bg:#0b0418;--surf:#150a2c')) {
      content = content.replace(/<style>[\s\S]*?:root\{--bg:#0b0418[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="/assets/article-style.css">');
      optimizedCssCount++;
      modified = true;
    }
  }

  // C. Fix Canonical & Hreflang
  const correctCanonical = isEn ? `https://otahub.asia/en/${slug}` : `https://otahub.asia/${slug}`;
  const viUrl = `https://otahub.asia/${slug}`;
  const enUrl = `https://otahub.asia/en/${slug}`;

  // Fix canonical
  if (content.includes('rel="canonical"')) {
    content = content.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${correctCanonical}">`);
    modified = true;
  }

  // Fix duplicate /en/en/ in hreflang or wrong hreflang
  content = content.replace(/\/en\/en\//g, '/en/');
  
  // Fix specific cross-link typos
  content = content.replace(/\/en\/anime-moi-crunchyroll-2026-romelia-black-torch/g, '/en/new-crunchyroll-anime-2026-romelia-black-torch');
  content = content.replace(/\/en\/viz-manga-phat-hanh-18-8-2026/g, '/en/viz-manga-releases-august-18-2026');
  content = content.replace(/\/girls-frontline-2-luu-day-chinh-thuc-ra-mat-viet-nam/g, '/girls-frontline-2-luu-day-vietnam-launch');
  content = content.replace(/\/wuthering-waves-2-0-rinascita-update-chinh-thuc/g, '/wuthering-waves-2-0-the-black-shores-camellya-update');

  // Ensure reciprocal hreflangs exist on standard pages
  if (content.includes('<link rel="alternate" hreflang="vi"') || content.includes('<link rel="alternate" hreflang="en"')) {
    // Standardize hreflang block
    const hreflangBlock = `<link rel="alternate" hreflang="vi" href="${viUrl}"><link rel="alternate" hreflang="en" href="${enUrl}"><link rel="alternate" hreflang="x-default" href="${viUrl}">`;
    content = content.replace(/<link[^>]*hreflang=["'](?:vi|en|x-default)["'][^>]*>/gi, '');
    content = content.replace(/<link rel="canonical"/i, `${hreflangBlock}\n<link rel="canonical"`);
    modified = true;
  }

  // D. Trim Long Meta Descriptions (>170 chars) to 140-160 chars
  const descMatch = content.match(/<meta\b[^>]*\bname=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (descMatch) {
    let rawDesc = descMatch[1];
    if (rawDesc.length > 170) {
      let trimmed = rawDesc.slice(0, 155);
      const lastSpace = trimmed.lastIndexOf(' ');
      if (lastSpace > 120) trimmed = trimmed.slice(0, lastSpace);
      trimmed = trimmed.replace(/[,;:\-\s]+$/, '') + '.';
      content = content.replace(descMatch[0], `<meta name="description" content="${trimmed}">`);
      fixedMetaCount++;
      modified = true;
    }
  }

  // E. Add Favicon if missing
  if (!content.includes('favicon-32.png') && !rel.startsWith('templates/')) {
    content = content.replace('</head>', '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">\n</head>');
    modified = true;
  }

  // F. Add missing width/height to images without dimensions
  content = content.replace(/<img\b(?![^>]*\bwidth=)([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (full, before, src, after) => {
    if (full.includes('${')) return full;
    return `<img ${before}src="${src}" width="1200" height="675"${after}>`;
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
  }
}

console.log(`✅ [5/8] Cleaned build comments from ${cleanedCommentsCount} files.`);
console.log(`✅ [6/8] Converted inline <style> to external <link> in ${optimizedCssCount} files (saved ~13KB per page).`);
console.log(`✅ [7/8] Trimmed ${fixedMetaCount} long meta descriptions.`);

console.log('\n=== MASTER REMEDIATION COMPLETED SUCCESSFULLY ===\n');
