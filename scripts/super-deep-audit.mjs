import fs from 'fs';
import path from 'path';

console.log('=== RUNNING ULTRA-DEEP WEBSITE AUDIT ===\n');

// 1. Collect all HTML files
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
console.log(`Auditing ${allHtml.length} production HTML files...`);

const report = {
  mojibakeEncodingErrors: [],
  doubleEscapedEntities: [],
  missingViewportMeta: [],
  canonicalMismatches: [],
  missingOgImageOrTags: [],
  brokenAnchorFragments: [],
  unclosedMajorHtmlTags: [],
  feedErrors: [],
  jsSyntaxErrors: [],
  sitemapNewsErrors: []
};

// 2. Check JavaScript files in assets/
console.log('Checking JavaScript files for syntax errors...');
const jsFiles = fs.readdirSync('assets').filter(f => f.endsWith('.js'));
for (const jsFile of jsFiles) {
  const jsPath = path.join('assets', jsFile);
  const code = fs.readFileSync(jsPath, 'utf8');
  try {
    // Quick syntax test with new Function
    new Function(code);
  } catch (e) {
    report.jsSyntaxErrors.push({ file: jsPath, error: e.message });
  }
}

// 3. Check Feeds
console.log('Validating feed.xml and feed.json...');
if (fs.existsSync('feed.xml')) {
  const feedXml = fs.readFileSync('feed.xml', 'utf8');
  const links = [...feedXml.matchAll(/<link>(https:\/\/otahub\.asia\/[^<]+)<\/link>/g)].map(m => m[1]);
  for (const link of links) {
    let slug = link.replace('https://otahub.asia/', '').replace(/\/$/, '');
    if (!slug.endsWith('.html')) slug += '.html';
    if (!fs.existsSync(slug)) {
      report.feedErrors.push({ feed: 'feed.xml', link, slug, issue: 'Points to non-existent file' });
    }
  }
}

if (fs.existsSync('feed.json')) {
  try {
    const feedJson = JSON.parse(fs.readFileSync('feed.json', 'utf8'));
    if (feedJson.items && Array.isArray(feedJson.items)) {
      for (const item of feedJson.items) {
        if (item.url && item.url.startsWith('https://otahub.asia/')) {
          let slug = item.url.replace('https://otahub.asia/', '').replace(/\/$/, '');
          if (!slug.endsWith('.html')) slug += '.html';
          if (!fs.existsSync(slug)) {
            report.feedErrors.push({ feed: 'feed.json', url: item.url, slug, issue: 'Points to non-existent file' });
          }
        }
      }
    }
  } catch (e) {
    report.feedErrors.push({ feed: 'feed.json', issue: 'Invalid JSON syntax: ' + e.message });
  }
}

// 4. Check sitemap-news.xml
console.log('Validating sitemap-news.xml...');
if (fs.existsSync('sitemap-news.xml')) {
  const smNews = fs.readFileSync('sitemap-news.xml', 'utf8');
  const locs = [...smNews.matchAll(/<loc>https:\/\/otahub\.asia\/([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const loc of locs) {
    let slug = loc.replace(/\/$/, '');
    if (!slug.endsWith('.html')) slug += '.html';
    if (!fs.existsSync(slug)) {
      report.sitemapNewsErrors.push({ loc, slug, issue: 'Target article does not exist' });
    }
  }
}

// 5. Per-HTML file audits
console.log('Performing deep per-file analysis...');

for (const { fullPath, relPath } of allHtml) {
  const rawContent = fs.readFileSync(fullPath, 'utf8');
  const isUtility = ['admin.html', 'news-pipeline.html', 'tag.html', 'article.html', 'en/article.html'].includes(relPath);

  // A. Mojibake & Encoding issues
  // Check for Unicode replacement char \uFFFD, or common UTF-8 double-decoding artifact strings
  if (rawContent.includes('\uFFFD') || /Ã[¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(rawContent)) {
    // Only flag if in visible text (not in binary/asset hashes)
    const visible = rawContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    if (visible.includes('\uFFFD') || /Ã[¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(visible)) {
      report.mojibakeEncodingErrors.push({ file: relPath, issue: 'Detected Mojibake or UTF-8 replacement character' });
    }
  }

  // B. Double escaped HTML entities like &amp;amp;, &amp;quot;, &amp;nbsp;
  const doubleEntity = rawContent.match(/&amp;(?:amp|quot|lt|gt|nbsp|#39);/i);
  if (doubleEntity) {
    report.doubleEscapedEntities.push({ file: relPath, entity: doubleEntity[0] });
  }

  // C. Viewport meta
  if (!isUtility && !rawContent.includes('name="viewport"')) {
    report.missingViewportMeta.push(relPath);
  }

  // D. Canonical URL match
  if (!isUtility) {
    const canonicalMatch = rawContent.match(/<link\s+rel="canonical"\s+href="https:\/\/otahub\.asia\/([^"]*)"/i) ||
                           rawContent.match(/<link\s+href="https:\/\/otahub\.asia\/([^"]*)"\s+rel="canonical"/i);
    if (!canonicalMatch) {
      report.canonicalMismatches.push({ file: relPath, issue: 'Missing canonical tag' });
    } else {
      let expectedSlug = relPath.replace(/\.html$/, '');
      if (expectedSlug === 'index') expectedSlug = '';
      if (expectedSlug === 'en/index') expectedSlug = 'en/';
      
      let actual = canonicalMatch[1].replace(/\/$/, '');
      let expected = expectedSlug.replace(/\/$/, '');

      // Special mappings (e.g. chuyen-sau <-> in-depth, etc)
      if (actual !== expected) {
        report.canonicalMismatches.push({ file: relPath, actual, expected });
      }
    }
  }

  // E. OpenGraph tags
  if (!isUtility && !relPath.startsWith('404')) {
    const ogImg = rawContent.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                  rawContent.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    if (!ogImg) {
      report.missingOgImageOrTags.push({ file: relPath, issue: 'Missing og:image' });
    } else {
      const imgSrc = ogImg[1];
      if (imgSrc.startsWith('/assets/') || imgSrc.startsWith('assets/')) {
        const localImg = imgSrc.startsWith('/') ? imgSrc.slice(1) : imgSrc;
        if (!fs.existsSync(localImg)) {
          report.missingOgImageOrTags.push({ file: relPath, issue: 'og:image file missing on disk: ' + imgSrc });
        }
      }
    }
  }

  // F. Major HTML Tag balancing check
  const tagsToCheck = ['main', 'article'];
  for (const tag of tagsToCheck) {
    const opens = (rawContent.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const closes = (rawContent.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (opens !== closes && !isUtility) {
      report.unclosedMajorHtmlTags.push({ file: relPath, tag, opens, closes });
    }
  }

  // G. Check anchor fragment destinations on the same page
  if (!isUtility) {
    const localHashLinks = [...rawContent.matchAll(/<a\s+[^>]*href="#([a-zA-Z0-9_-]+)"/gi)].map(m => m[1]);
    for (const hash of localHashLinks) {
      if (hash === 'top' || hash === '') continue;
      const hasId = new RegExp(`id=["']${hash}["']`, 'i').test(rawContent);
      const hasName = new RegExp(`name=["']${hash}["']`, 'i').test(rawContent);
      if (!hasId && !hasName) {
        report.brokenAnchorFragments.push({ file: relPath, anchor: '#' + hash });
      }
    }
  }
}

// Summary
console.log('\n=== ULTRA-DEEP AUDIT RESULTS SUMMARY ===');
console.log(`1. JavaScript Syntax Errors in assets/: ${report.jsSyntaxErrors.length}`);
if (report.jsSyntaxErrors.length) console.log(report.jsSyntaxErrors);

console.log(`2. Feed Errors (feed.xml & feed.json): ${report.feedErrors.length}`);
if (report.feedErrors.length) console.log(report.feedErrors);

console.log(`3. Sitemap-news.xml Errors: ${report.sitemapNewsErrors.length}`);
if (report.sitemapNewsErrors.length) console.log(report.sitemapNewsErrors);

console.log(`4. Mojibake / Character Encoding Errors: ${report.mojibakeEncodingErrors.length}`);
if (report.mojibakeEncodingErrors.length) console.log(report.mojibakeEncodingErrors);

console.log(`5. Double Escaped HTML Entities (&amp;amp; etc.): ${report.doubleEscapedEntities.length}`);
if (report.doubleEscapedEntities.length) console.log(report.doubleEscapedEntities);

console.log(`6. Missing Viewport Meta Tags: ${report.missingViewportMeta.length}`);
if (report.missingViewportMeta.length) console.log(report.missingViewportMeta);

console.log(`7. Canonical URL Mismatches: ${report.canonicalMismatches.length}`);
if (report.canonicalMismatches.length) console.log(report.canonicalMismatches);

console.log(`8. Missing or Broken og:image Tags: ${report.missingOgImageOrTags.length}`);
if (report.missingOgImageOrTags.length) console.log(report.missingOgImageOrTags);

console.log(`9. Unclosed Major HTML Tags (<main>, <article>): ${report.unclosedMajorHtmlTags.length}`);
if (report.unclosedMajorHtmlTags.length) console.log(report.unclosedMajorHtmlTags);

console.log(`10. Broken Local In-Page Anchor Links (#fragment): ${report.brokenAnchorFragments.length}`);
if (report.brokenAnchorFragments.length) console.log(report.brokenAnchorFragments.slice(0, 20));

fs.writeFileSync('scripts/super-audit-report.json', JSON.stringify(report, null, 2), 'utf8');
console.log('\nFull report saved to scripts/super-audit-report.json');
