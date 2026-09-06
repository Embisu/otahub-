import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html', 'anime.html', 'manga.html', 'gaming.html', 'news.html', 'reviews.html', 'community.html', 'tag.html', '404.html', 'about.html', 'anime-detail.html', 'article.html', 'bai-viet.html', 'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html', 'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html', 'rankings.html', 'recommend.html', 'sap-ra-mat.html'].includes(f));

console.log(`Total articles to audit: ${files.length}`);

const allSlugs = new Set(files.map(f => '/' + f.replace(/\.html$/, '')));
['/', '/anime', '/gaming', '/manga', '/news', '/reviews', '/rankings', '/chuyen-sau', '/choi-gi', '/tag', '/about', '/lien-he', '/chinh-sach-bao-mat', '/feed.xml'].forEach(s => allSlugs.add(s));

const issues = {
  noJsonLd: [],
  noBreadcrumbLd: [],
  noRelatedArticles: [],
  lowInternalLinks: [],
  noH2: [],
  brokenLinks: [],
  shortArticles: []
};

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');

  // 1. JSON-LD
  const hasNewsLd = content.includes('"@type": "NewsArticle"') || content.includes('"@type":"NewsArticle"') || content.includes('"@type": "Article"') || content.includes('"@type":"Article"');
  if (!hasNewsLd) {
    issues.noJsonLd.push(f);
  }
  if (!content.includes('BreadcrumbList')) {
    issues.noBreadcrumbLd.push(f);
  }

  // 2. Related Articles
  const sbArts = content.match(/class=["']sb-art["']/g) || [];
  const relCards = content.match(/class=["']related-card["']/g) || [];
  const totalRel = sbArts.length + relCards.length;
  if (totalRel < 2) {
    issues.noRelatedArticles.push({ file: f, count: totalRel });
  }

  // 3. In-body Internal links
  const bodyMatch = content.match(/<article[^>]*class=["'][^"']*art-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
  if (bodyMatch) {
    const bodyText = bodyMatch[1];
    const inLinks = (bodyText.match(/href=["'][^"']+["']/g) || []).filter(l => !l.includes('http') || l.includes('otahub.asia'));
    if (inLinks.length < 2) {
      issues.lowInternalLinks.push({ file: f, count: inLinks.length });
    }

    // Check broken internal link targets
    const linkMatches = bodyText.matchAll(/href=["'](\/[a-zA-Z0-9\-_]+)(?:[#?][^"']*)?["']/g);
    for (const lm of linkMatches) {
      const target = lm[1];
      if (!allSlugs.has(target) && !target.startsWith('/tag')) {
        issues.brokenLinks.push({ file: f, target });
      }
    }
  } else {
    issues.lowInternalLinks.push({ file: f, count: 0 });
  }

  // 4. H2 headings
  const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
  if (h2Count < 2) {
    issues.noH2.push({ file: f, count: h2Count });
  }
}

console.log('\n--- 📊 COMPREHENSIVE SEO & LINKING AUDIT RESULTS ---');
console.log(`✅ Total Articles Audited: ${files.length}`);
console.log(`- Missing NewsArticle Schema JSON-LD: ${issues.noJsonLd.length}`);
console.log(`- Missing BreadcrumbList Schema JSON-LD: ${issues.noBreadcrumbLd.length}`);
console.log(`- Missing/Low Related Articles in sidebar (<2): ${issues.noRelatedArticles.length}`);
console.log(`- Low In-body Internal Links (<2): ${issues.lowInternalLinks.length}`);
console.log(`- Low H2 Headings (<2): ${issues.noH2.length}`);
console.log(`- Broken Internal Links detected: ${issues.brokenLinks.length}`);

if (issues.noRelatedArticles.length > 0) {
  console.log('\n⚠️ Articles with low related news:');
  issues.noRelatedArticles.forEach(i => console.log(`  - ${i.file} (${i.count} related)`));
}

if (issues.lowInternalLinks.length > 0) {
  console.log('\n⚠️ Articles with low in-body internal links:');
  issues.lowInternalLinks.forEach(i => console.log(`  - ${i.file} (${i.count} links)`));
}

if (issues.brokenLinks.length > 0) {
  console.log('\n⚠️ Broken links:');
  issues.brokenLinks.forEach(i => console.log(`  - in ${i.file} -> target: ${i.target}`));
}
