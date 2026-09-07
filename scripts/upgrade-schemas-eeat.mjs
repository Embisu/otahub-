import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory() && (e.name === '.git' || e.name === 'node_modules' || e.name === 'templates')) return [];
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const skipFiles = new Set([
  'admin.html',
  'index.html',
  'about.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'tag.html',
  '404.html',
  'article.html',
  'bai-viet.html',
  'choi-gi.html',
  'chuyen-sau.html',
  'anime.html',
  'gaming.html',
  'manga.html',
  'reviews.html',
  'rankings.html',
  'en/index.html',
  'en/about.html',
  'en/contact.html',
  'en/privacy.html',
  'en/terms.html',
  'en/tag.html',
  'en/404.html',
  'en/anime.html',
  'en/gaming.html',
  'en/manga.html',
  'en/reviews.html',
  'en/rankings.html'
]);

const files = walk('.').filter((f) => f.endsWith('.html'));
let upgradedCount = 0;

for (const file of files) {
  const normPath = file.replaceAll('\\', '/').replace(/^\.\//, '');
  if (skipFiles.has(normPath)) continue;

  const content = fs.readFileSync(file, 'utf8');
  const isEn = normPath.startsWith('en/');
  
  // Find all JSON-LD script blocks
  const scriptRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let hasArticleSchema = false;
  let newContent = content;

  const matches = [...content.matchAll(scriptRegex)];
  for (const m of matches) {
    const rawJson = m[1].trim();
    if (!rawJson || rawJson.includes('${')) continue;

    try {
      const data = JSON.parse(rawJson);
      if (data['@type'] === 'NewsArticle' || data['@type'] === 'Article') {
        hasArticleSchema = true;

        // Determine author name
        let authorName = 'OtaHub Editorial';
        if (data.author) {
          if (typeof data.author === 'string' && data.author.trim() && data.author !== 'OtaHub') {
            authorName = data.author.trim();
          } else if (typeof data.author === 'object' && data.author.name && data.author.name.trim() && data.author.name !== 'OtaHub') {
            authorName = data.author.name.trim();
          }
        }

        // Determine canonical / page URL
        let pageUrl = `https://otahub.asia/${normPath.replace(/\.html$/, '')}`;
        if (data.mainEntityOfPage) {
          if (typeof data.mainEntityOfPage === 'string') pageUrl = data.mainEntityOfPage;
          else if (data.mainEntityOfPage['@id']) pageUrl = data.mainEntityOfPage['@id'];
        }

        // Build enhanced schema object
        const enhancedSchema = {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: data.headline || '',
          description: data.description || '',
          image: data.image || 'https://otahub.asia/og-image.png',
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || data.datePublished || new Date().toISOString(),
          inLanguage: isEn ? 'en' : 'vi',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl
          },
          author: {
            '@type': 'Person',
            name: authorName,
            url: isEn ? 'https://otahub.asia/en/about' : 'https://otahub.asia/about',
            jobTitle: isEn ? 'Editorial Board' : 'Ban Biên T?p',
            worksFor: {
              '@type': 'Organization',
              '@id': 'https://otahub.asia/#organization',
              name: 'OtaHub',
              url: 'https://otahub.asia'
            }
          },
          publisher: {
            '@type': 'Organization',
            '@id': 'https://otahub.asia/#organization',
            name: 'OtaHub',
            url: 'https://otahub.asia',
            logo: {
              '@type': 'ImageObject',
              url: 'https://otahub.asia/favicon-192.png'
            }
          }
        };

        if (data.keywords) {
          enhancedSchema.keywords = data.keywords;
        }

        const formattedJson = JSON.stringify(enhancedSchema, null, 2);
        const replacementBlock = `<script type="application/ld+json">\n${formattedJson}\n</script>`;
        newContent = newContent.replace(m[0], replacementBlock);
      }
    } catch (e) {
      // Ignore JSON parse errors on non-article blocks
    }
  }

  if (hasArticleSchema && newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    upgradedCount++;
  }
}

console.log(`Successfully upgraded schemas in ${upgradedCount} articles.`);
