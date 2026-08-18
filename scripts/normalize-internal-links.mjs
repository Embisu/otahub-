import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function targetFile(fromFile, rawPath) {
  const decoded = rawPath.split(/[?#]/, 1)[0];
  if (!decoded.toLowerCase().endsWith('.html')) return null;
  if (decoded.startsWith('/')) return path.join(root, decoded.slice(1));
  return path.resolve(path.dirname(fromFile), decoded);
}

function cleanUrl(raw) {
  const match = raw.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return raw;
  let pathname = match[1];
  const suffix = match[2] || '';
  if (/(?:^|\/)index\.html$/i.test(pathname)) {
    pathname = pathname.replace(/index\.html$/i, '');
    if (!pathname) pathname = './';
  }
  else pathname = pathname.replace(/\.html$/i, '');
  return pathname + suffix;
}

const allFiles = walk(root);
const htmlFiles = allFiles.filter((file) => file.toLowerCase().endsWith('.html'));
const runtimeJsFiles = allFiles.filter((file) => /[\\/]assets[\\/].+\.js$/i.test(file));
const legacyRouteMap = new Map([
  ['/beast-of-reincarnation-review.html', '/beast-of-reincarnation.html'],
  ['/berserk-fantasia-arc-review.html', '/berserk-arc-cuoi.html'],
  ['/frieren-season2-review.html', '/frieren-season2.html'],
  ['/hollow-knight-silksong-review.html', '/hollow-knight-silksong-sea-of-sorrow.html'],
  ['/jojo-golden-spirit-review.html', '/jojo-golden-spirit-launch.html'],
  ['/link-click-season3-review.html', '/link-click-season3-premiere.html'],
  ['/my-hero-academia-final-season-review.html', '/reviews.html'],
  ['/re-zero-season4-review.html', '/re-zero-season4-recapture-arc.html'],
  ['/sakamoto-days-manga-review.html', '/reviews.html'],
  ['/solo-leveling-season2-review.html', '/solo-leveling-season2.html'],
  ['/spy-x-family-review.html', '/reviews.html'],
  ['/tekken8-season2-review.html', '/tekken8-season2.html'],
  ['/the-ribbon-hero-review.html', '/the-ribbon-hero-netflix.html'],
  ['/undead-unluck-manga-review.html', '/reviews.html'],
]);
let changedFiles = 0;
let changedLinks = 0;
let missingTargets = 0;

for (const file of htmlFiles) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before.replace(/\bhref=(['"])([^'"\s>]+)\1/gi, (full, quote, href) => {
    if (/^(?:https?:)?\/\//i.test(href) || /^(?:mailto:|tel:|javascript:)/i.test(href)) return full;
    const indexMatch = href.match(/^((?:\.\.\/|\.\/|\/)*?)index([?#].*)?$/i);
    if (indexMatch) {
      const indexFile = path.resolve(path.dirname(file), `${indexMatch[1]}index.html`);
      if (fs.existsSync(indexFile)) {
        changedLinks++;
        const base = indexMatch[1].startsWith('/') ? indexMatch[1] || '/' : indexMatch[1] || './';
        return `href=${quote}${base}${indexMatch[2] || ''}${quote}`;
      }
    }
    const target = targetFile(file, href);
    if (!target) return full;
    if (!fs.existsSync(target)) {
      missingTargets++;
      return full;
    }
    const normalized = cleanUrl(href);
    if (normalized === href) return full;
    changedLinks++;
    return `href=${quote}${normalized}${quote}`;
  });
  // Navigation data and route helpers also create links at runtime. Keep admin
  // filenames untouched because those are GitHub API paths rather than URLs.
  if (path.basename(file).toLowerCase() !== 'admin.html') {
    after = after.replace(/(['"])(\/[^'"\s]+\.html(?:[?#][^'"\s]*)?)\1/gi, (full, quote, href) => {
      const target = targetFile(file, href);
      if (!target || !fs.existsSync(target)) return full;
      const normalized = cleanUrl(href);
      if (normalized === href) return full;
      changedLinks++;
      return `${quote}${normalized}${quote}`;
    });
  }
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changedFiles++;
  }
}

for (const file of runtimeJsFiles) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [oldRoute, replacement] of legacyRouteMap) {
    after = after.replaceAll(oldRoute, replacement);
  }
  after = after.replace(/(['"])(\/[^'"\s]+\.html(?:[?#][^'"\s]*)?)\1/gi, (full, quote, href) => {
    const target = targetFile(file, href);
    if (!target || !fs.existsSync(target)) return full;
    const normalized = cleanUrl(href);
    if (normalized === href) return full;
    changedLinks++;
    return `${quote}${normalized}${quote}`;
  });
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changedFiles++;
  }
}

console.log(JSON.stringify({ htmlFiles: htmlFiles.length, runtimeJsFiles: runtimeJsFiles.length, changedFiles, changedLinks, missingTargets }));
