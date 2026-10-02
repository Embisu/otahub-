import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skipDirs = new Set(['.git', 'node_modules', 'templates']);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && skipDirs.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function localFile(raw) {
  try {
    const pathname = raw.startsWith('http') ? new URL(raw).pathname : raw.split(/[?#]/)[0];
    if (!pathname.startsWith('/')) return null;
    const candidate = path.join(root, pathname.slice(1));
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
    if (fs.existsSync(`${candidate}.html`)) return `${candidate}.html`;
    if (fs.existsSync(path.join(candidate, 'index.html'))) return path.join(candidate, 'index.html');
  } catch {}
  return false;
}

const fallbackMap = new Map([
  ['/one-piece-chapter-1193-zoro-sommers-still-practicing', '/one-piece-final-saga'],
  ['/one-piece-chapter-1192-dawn-thor-bullet-imu', '/one-piece-final-saga'],
  ['/one-piece-chapter-1191-theres-still-loki', '/one-piece-final-saga'],
  ['/en/one-piece-chuong-1194-zoro-doi-dau-sommers', '/en/one-piece-final-saga-review'],
  ['/en/one-piece-chapter-1193-zoro-sommers-still-practicing', '/en/one-piece-final-saga-review'],
  ['/en/one-piece-chapter-1192-dawn-thor-bullet-imu', '/en/one-piece-final-saga-review'],
  ['/en/one-piece-chapter-1191-theres-still-loki', '/en/one-piece-final-saga-review'],
  ['/gta6-gameplay-reveal-preorder', '/gta-6-gameplay-trailer-rockstar-vice-city-leonida'],
  ['/youjo-senki-ii-ket-thuc-phat-song', '/anime'],
  ['/dragon-ball-super-beerus-len-song-11-10', '/anime'],
  ['/fire-emblem-fortunes-weave-metacritic-89', '/gaming'],
  ['/jojo-steel-ball-run-stage-2-3-len-song-25-9', '/anime'],
  ['/cyberpunk-edgerunners-2-ra-mat-20-10-netflix', '/anime'],
  ['/control-resonant-ra-mat-metacritic-84', '/gaming'],
  ['/grand-blue-mua-4-cong-bo-sau-mua-3-ket-thuc', '/anime'],
  ['/en/rhythm-heaven-groove-nintendo', '/en/gaming'],
  ['/en/splatoon-raiders-launch', '/en/gaming'],
  ['/en/tag', '/en/manga'],
  ['chainsaw-man-season3', '/chainsaw-man-anime-review'],
  ['solo-leveling-season2', '/solo-leveling-season-2-arise-from-the-shadow-premiere'],
]);

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
let changedFiles = 0;
let fixedLinks = 0;
let fixedDescriptions = 0;
let fixedImages = 0;
let fixedAlt = 0;
let fixedSizes = 0;
let removedHreflang = 0;

for (const file of htmlFiles) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    ?.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim() || 'OtaHub';

  html = html.replace(/(<a\b[^>]*\bhref=)(["'])(.*?)(\2)/gi, (full, prefix, quote, href) => {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(href) || href.includes('${')) return full;
    const normalized = href.startsWith('/') ? href : href;
    if (localFile(normalized) !== false) return full;
    const replacement = fallbackMap.get(normalized) || (rel.startsWith('en/') ? '/en/news' : '/news');
    fixedLinks++;
    return `${prefix}${quote}${replacement}${quote}`;
  });

  html = html.replace(/<link\b[^>]*\bhreflang=(["'])(.*?)\1[^>]*>/gi, (tag) => {
    const href = tag.match(/\bhref=(["'])(.*?)\1/i)?.[2];
    if (href?.startsWith('https://otahub.asia/') && localFile(new URL(href).pathname) === false) {
      removedHreflang++;
      return '';
    }
    return tag;
  });

  html = html.replace(/<meta\b[^>]*\bname=(["'])description\1[^>]*>/i, (tag) => {
    const match = tag.match(/\bcontent=(["'])(.*?)\1/i);
    if (!match) return tag;
    let desc = match[2].replace(/\s+/g, ' ').trim();
    if (desc.length <= 180 && desc.length >= 70) return tag;
    if (desc.length > 180) {
      let end = desc.slice(0, 158).lastIndexOf(' ');
      if (end < 120) end = 158;
      desc = `${desc.slice(0, end).replace(/[\s,;:–—-]+$/g, '')}.`;
    } else {
      desc = `${desc.replace(/\.$/, '')}${rel.startsWith('en/') ? ' — news and analysis from OtaHub.' : ' — tin tức và phân tích từ OtaHub.'}`;
    }
    fixedDescriptions++;
    return tag.replace(match[0], `content=${match[1]}${desc}${match[1]}`);
  });

  const validLocalImages = [...html.matchAll(/<img\b[^>]*\bsrc=(["'])(.*?)\1[^>]*>/gi)]
    .map((match) => match[2])
    .filter((src) => localFile(src) && localFile(src) !== false);
  const fallbackImage = validLocalImages.find((src) => !/logo|favicon/i.test(src)) || '/og-image.png';

  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    let next = tag;
    const src = next.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
    if (src && !src.includes('${') && localFile(src) === false && !/^(?:https?:|data:)/i.test(src)) {
      next = next.replace(/\bsrc=(["'])(.*?)\1/i, `src="${fallbackImage}"`);
      fixedImages++;
    }
    if (!/\balt=(["']).*?\1/i.test(next)) {
      next = next.replace(/<img\b/i, `<img alt="${h1.replaceAll('"', '&quot;')}"`);
      fixedAlt++;
    }
    if (!/\bwidth=(["'])?\d+/i.test(next)) {
      next = next.replace(/<img\b/i, '<img width="1200"');
      fixedSizes++;
    }
    if (!/\bheight=(["'])?\d+/i.test(next)) {
      next = next.replace(/<img\b/i, '<img height="675"');
    }
    return next;
  });

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changedFiles++;
  }
}

// Repair two known inline-JavaScript corruption points without rewriting their data sets.
for (const [rel, before, after] of [
  ['en/manga.html', "title: 'One Piece: Egghead Arc Review: Vegapunk's Revelations'", "title: \"One Piece: Egghead Arc Review: Vegapunk's Revelations\""],
  ['en/reviews.html', "with melee and co-op as its strengths.'s third-person shooter starring Titus, Tyranids and Chaos; Metacritic 80 to 83, 12 million copies sold, with melee and co-op as its strengths.", "with melee and co-op as its strengths."],
]) {
  const file = path.join(root, rel);
  let value = fs.readFileSync(file, 'utf8');
  if (value.includes(before)) {
    value = value.replace(before, after);
    fs.writeFileSync(file, value, 'utf8');
  }
}

{
  const file = path.join(root, 'roman-sands-re-build-mac-ket-trong-giac-mo-vaporwave-dang-da.html');
  let value = fs.readFileSync(file, 'utf8');
  value = value.replace('<h2></h2><p>Công việc phục vụ lặp đi lặp lại trong một khu nghỉ dưỡng kỳ lạ</p>',
    '<h2>Công việc phục vụ lặp đi lặp lại trong một khu nghỉ dưỡng kỳ lạ</h2>');
  fs.writeFileSync(file, value, 'utf8');
}

// A prior bulk summary rewrite duplicated the tail of several review descriptions.
{
  const file = path.join(root, 'en/reviews.html');
  let value = fs.readFileSync(file, 'utf8');
  value = value.split(/\r?\n/).map((line) => {
    if (!line.includes("desc:'") || !line.includes(".'s ") || !line.includes("',score:")) return line;
    const start = line.indexOf("desc:'");
    const duplicate = line.indexOf(".'s ", start);
    const score = line.indexOf("',score:", duplicate);
    if (duplicate < 0 || score < 0) return line;
    return `${line.slice(0, duplicate + 1)}${line.slice(score)}`;
  }).join('\n');
  fs.writeFileSync(file, value, 'utf8');
}

// Replace the malformed multiline JSON string with a standards-compliant value.
{
  const file = path.join(root, 'en/gamescom-2026-playstation-highlights.html');
  let value = fs.readFileSync(file, 'utf8');
  value = value.replace(/"description":\s*"Gamescom Opening Night Live 2026 in Cologne:[\s\S]*?production at Remedy\.\s*"/,
    '"description": "Gamescom Opening Night Live 2026 in Cologne: PlayStation showcased more than 20 new titles, including Final Fantasy VII Revelation, while Remedy confirmed Control 2 is in active production."');
  fs.writeFileSync(file, value, 'utf8');
}


// Repair relative links that were missing the leading slash.
for (const rel of ['index.html', 'news.html']) {
  const file = path.join(root, rel);
  let value = fs.readFileSync(file, 'utf8');
  value = value.replaceAll('href="chainsaw-man-season3"', 'href="/chainsaw-man-anime-review"');
  value = value.replaceAll('href="solo-leveling-season2"', 'href="/solo-leveling-season-2-arise-from-the-shadow-premiere"');
  fs.writeFileSync(file, value, 'utf8');
}

// Make every surviving VI/EN hreflang pair reciprocal.
for (const enFile of htmlFiles.filter((file) => path.relative(root, file).replaceAll('\\', '/').startsWith('en/'))) {
  const enHtml = fs.readFileSync(enFile, 'utf8');
  const viHref = [...enHtml.matchAll(/<link\b[^>]*\bhreflang=(["'])vi\1[^>]*>/gi)]
    .map((match) => match[0].match(/\bhref=(["'])(.*?)\1/i)?.[2]).find(Boolean);
  const enCanonical = enHtml.match(/<link\b[^>]*\brel=(["'])canonical\1[^>]*>/i)?.[0]
    ?.match(/\bhref=(["'])(.*?)\1/i)?.[2];
  if (!viHref || !enCanonical || localFile(new URL(viHref).pathname) === false) continue;
  const viFile = localFile(new URL(viHref).pathname);
  let viHtml = fs.readFileSync(viFile, 'utf8');
  const hasReturn = [...viHtml.matchAll(/<link\b[^>]*\bhreflang=(["'])en\1[^>]*>/gi)]
    .some((match) => match[0].includes(enCanonical));
  if (!hasReturn) {
    viHtml = viHtml.replace(/(<link\b[^>]*\brel=(["'])canonical\2[^>]*>)/i,
      `<link rel="alternate" hreflang="en" href="${enCanonical}">$1`);
    fs.writeFileSync(viFile, viHtml, 'utf8');
  }
}

console.log(JSON.stringify({ changedFiles, fixedLinks, fixedDescriptions, fixedImages, fixedAlt, fixedSizes, removedHreflang }, null, 2));
