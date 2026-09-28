import fs from 'fs';
import path from 'path';

console.log('=== STARTING REFINED DEEP AUDIT FOR PRODUCTION WEBSITE ===\n');

function getHtmlFiles(dir, prefix = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.wrangler', '.git', '.agents', 'templates', 'src'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath, path.join(prefix, file)));
    } else if (file.endsWith('.html')) {
      results.push({ fullPath, relPath: path.join(prefix, file).replace(/\\/g, '/') });
    }
  }
  return results;
}

const allHtml = getHtmlFiles('.');
console.log(`Found ${allHtml.length} production HTML files across website.`);

const issues = {
  brokenInternalLinks: [],
  brokenImages: [],
  brokenScriptsOrStyles: [],
  missingMetaTitleOrDesc: [],
  invalidJsonLd: [],
  suspiciousText: [],
  truncatedOrShortContent: [],
  searchIndexGaps: [],
  sitemapGaps: [],
};

function localFileExists(cleanPath) {
  const p = cleanPath.split('?')[0].split('#')[0];
  if (!p || p === '/') return fs.existsSync('index.html');
  const rel = p.startsWith('/') ? p.slice(1) : p;
  if (fs.existsSync(rel)) return true;
  if (fs.existsSync(rel + '.html')) return true;
  if (fs.existsSync(path.join(rel, 'index.html'))) return true;
  return false;
}

function resolveLinkTarget(href, currentFileRelPath) {
  if (!href) return null;
  href = href.trim();
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
  
  if (href.startsWith('http://') || href.startsWith('https://')) {
    if (!href.startsWith('https://otahub.asia') && !href.startsWith('http://otahub.asia')) {
      return null;
    }
    href = href.replace(/^https?:\/\/otahub\.asia/, '');
    if (!href) href = '/';
  }

  let clean = href.split('?')[0].split('#')[0];
  if (clean === '' || clean === '/') return 'index.html';

  if (clean.startsWith('/')) {
    let target = clean.slice(1);
    if (!target.endsWith('.html') && !target.includes('.')) target += '.html';
    return target;
  } else {
    const currentDir = path.dirname(currentFileRelPath);
    let target = path.join(currentDir, clean).replace(/\\/g, '/');
    if (!target.endsWith('.html') && !target.includes('.')) target += '.html';
    return target;
  }
}

for (const { fullPath, relPath } of allHtml) {
  const rawContent = fs.readFileSync(fullPath, 'utf8');

  // Strip script and style tags to examine actual HTML DOM only
  const domContent = rawContent
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  const isUtility = ['admin.html', 'news-pipeline.html', 'tag.html', 'article.html', 'en/article.html'].includes(relPath);

  // a) Meta Title & Description
  const titleMatch = rawContent.match(/<title>([\s\S]*?)<\/title>/i);
  if (!isUtility && (!titleMatch || !titleMatch[1].trim())) {
    issues.missingMetaTitleOrDesc.push({ file: relPath, issue: 'Missing or empty <title>' });
  }

  const descMatch = rawContent.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                    rawContent.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
  if (!isUtility && (!descMatch || !descMatch[1].trim())) {
    issues.missingMetaTitleOrDesc.push({ file: relPath, issue: 'Missing or empty meta description' });
  }

  // b) CSS and JS references (from rawContent)
  const linkStyles = [...rawContent.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi)];
  for (const [tag] of linkStyles) {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (hrefMatch && !hrefMatch[1].startsWith('http')) {
      const target = hrefMatch[1];
      if (!localFileExists(target)) {
        issues.brokenScriptsOrStyles.push({ file: relPath, tag, target });
      }
    }
  }

  const scriptTags = [...rawContent.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)];
  for (const [tag, src] of scriptTags) {
    if (!src.startsWith('http')) {
      if (!localFileExists(src)) {
        issues.brokenScriptsOrStyles.push({ file: relPath, tag, target: src });
      }
    }
  }

  // c) Images (from domContent only)
  const imgTags = [...domContent.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)];
  for (const [tag, src] of imgTags) {
    if (src.startsWith('data:')) continue;
    if (src.startsWith('http://') || src.startsWith('https://')) {
      if (src.startsWith('https://otahub.asia') || src.startsWith('http://otahub.asia')) {
        const local = src.replace(/^https?:\/\/otahub\.asia/, '');
        if (!localFileExists(local)) {
          issues.brokenImages.push({ file: relPath, target: src });
        }
      }
    } else {
      if (!localFileExists(src)) {
        issues.brokenImages.push({ file: relPath, target: src });
      }
    }
  }

  // d) Links (<a href="...">) (from domContent only)
  if (!isUtility) {
    const aTags = [...domContent.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi)];
    for (const [tag, href] of aTags) {
      const target = resolveLinkTarget(href, relPath);
      if (target) {
        if (!fs.existsSync(target) && !fs.existsSync(target.replace(/\.html$/, '')) && !fs.existsSync(target + '/index.html')) {
          issues.brokenInternalLinks.push({ file: relPath, href, resolved: target });
        }
      }
    }
  }

  // e) JSON-LD (from rawContent)
  if (!isUtility) {
    const jsonLdScripts = [...rawContent.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
    for (const [tag, jsonText] of jsonLdScripts) {
      try {
        JSON.parse(jsonText);
      } catch (e) {
        issues.invalidJsonLd.push({ file: relPath, error: e.message, snippet: jsonText.slice(0, 80) });
      }
    }
  }

  // f) Suspicious Text / Placeholder
  if (!isUtility) {
    const suspiciousPatterns = [
      /\bundefined\b(?!\.(js|css|webp|png|jpg))/i,
      /\bnull\b(?!\.(js|css|webp|png|jpg))/i,
      /\bNaN\b/i,
      /\[object Object\]/i,
      /lorem ipsum/i,
      /\${[a-zA-Z0-9_]+}/
    ];
    for (const pat of suspiciousPatterns) {
      const match = domContent.match(pat);
      if (match) {
        issues.suspiciousText.push({ file: relPath, pattern: pat.toString(), match: match[0] });
      }
    }
  }

  // g) Short content in articles
  const hubNames = [
    'index.html', 'about.html', 'rankings.html', 'choi-gi.html', 'reviews.html', 
    'news.html', 'gaming.html', 'anime.html', 'manga.html', 'chuyen-sau.html', 
    'lien-he.html', 'chinh-sach-bao-mat.html', 'dieu-khoan-su-dung.html', 
    'lich-phat-song.html', 'sap-ra-mat.html'
  ];
  const isHub = hubNames.includes(relPath) || hubNames.map(h => 'en/' + h).includes(relPath) || relPath === 'en/in-depth.html' || relPath === 'en/contact.html' || relPath === 'en/privacy.html' || relPath === 'en/terms.html';

  if (!isUtility && !isHub) {
    const textOnly = domContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textOnly.split(/\s+/).length;
    if (words < 180) {
      issues.truncatedOrShortContent.push({ file: relPath, words });
    }
  }
}

// 2. Search Index Consistency
if (fs.existsSync('assets/search.js')) {
  const searchContent = fs.readFileSync('assets/search.js', 'utf8');
  const searchUrls = [...searchContent.matchAll(/url:\s*["']([^"']+)["']/g)].map(m => m[1]);
  for (const url of searchUrls) {
    let clean = url.replace(/^\//, '');
    if (!clean.endsWith('.html')) clean += '.html';
    if (!fs.existsSync(clean)) {
      issues.searchIndexGaps.push({ type: 'search_points_to_nonexistent', url, localPath: clean });
    }
  }
}

// 3. Sitemap Consistency
if (fs.existsSync('sitemap.xml')) {
  const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
  const sitemapUrls = [...sitemapContent.matchAll(/<loc>https:\/\/otahub\.asia\/([^<]*)<\/loc>/g)].map(m => m[1]);
  for (const raw of sitemapUrls) {
    let clean = raw.replace(/\/$/, '');
    if (!clean) clean = 'index.html';
    else if (clean === 'en') clean = 'en/index.html';
    else if (!clean.endsWith('.html')) clean += '.html';
    if (!fs.existsSync(clean)) {
      issues.sitemapGaps.push({ type: 'sitemap_points_to_nonexistent', raw, localPath: clean });
    }
  }
}

console.log('=== REFINED AUDIT RESULTS SUMMARY ===');
console.log(`1. Broken Internal Links: ${issues.brokenInternalLinks.length}`);
if (issues.brokenInternalLinks.length > 0) console.log(issues.brokenInternalLinks);

console.log(`2. Broken Images: ${issues.brokenImages.length}`);
if (issues.brokenImages.length > 0) console.log(issues.brokenImages);

console.log(`3. Broken Scripts/Stylesheets: ${issues.brokenScriptsOrStyles.length}`);
if (issues.brokenScriptsOrStyles.length > 0) console.log(issues.brokenScriptsOrStyles);

console.log(`4. Missing Meta Title or Description: ${issues.missingMetaTitleOrDesc.length}`);
if (issues.missingMetaTitleOrDesc.length > 0) console.log(issues.missingMetaTitleOrDesc);

console.log(`5. Invalid JSON-LD Schemas: ${issues.invalidJsonLd.length}`);
if (issues.invalidJsonLd.length > 0) console.log(issues.invalidJsonLd);

console.log(`6. Suspicious Text / Placeholders: ${issues.suspiciousText.length}`);
if (issues.suspiciousText.length > 0) console.log(issues.suspiciousText);

console.log(`7. Truncated or Extremely Short Articles (<180 words): ${issues.truncatedOrShortContent.length}`);
if (issues.truncatedOrShortContent.length > 0) console.log(issues.truncatedOrShortContent);

console.log(`8. Search Index Gaps: ${issues.searchIndexGaps.length}`);
if (issues.searchIndexGaps.length > 0) console.log(issues.searchIndexGaps);

console.log(`9. Sitemap Gaps: ${issues.sitemapGaps.length}`);
if (issues.sitemapGaps.length > 0) console.log(issues.sitemapGaps);

fs.writeFileSync('scripts/audit-refined-report.json', JSON.stringify(issues, null, 2), 'utf8');
