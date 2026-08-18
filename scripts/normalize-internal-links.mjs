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
  if (/\/index\.html$/i.test(pathname)) pathname = pathname.replace(/index\.html$/i, '');
  else pathname = pathname.replace(/\.html$/i, '');
  return pathname + suffix;
}

const htmlFiles = walk(root).filter((file) => file.toLowerCase().endsWith('.html'));
let changedFiles = 0;
let changedLinks = 0;
let missingTargets = 0;

for (const file of htmlFiles) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before.replace(/\bhref=(['"])([^'"\s>]+)\1/gi, (full, quote, href) => {
    if (/^(?:https?:)?\/\//i.test(href) || /^(?:mailto:|tel:|javascript:)/i.test(href)) return full;
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

console.log(JSON.stringify({ htmlFiles: htmlFiles.length, changedFiles, changedLinks, missingTargets }));
