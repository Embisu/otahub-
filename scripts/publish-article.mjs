import fs from 'fs';
import path from 'path';
import { pingIndexNow } from './ping-indexnow.mjs';

const ROOT = process.cwd();

export function formatDateVN(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatDateISO(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 1. Cascade Search Index (assets/search.js)
 */
export function cascadeSearchIndex({ slug, title, desc, cat, hero }) {
  const searchPath = path.join(ROOT, 'assets', 'search.js');
  if (!fs.existsSync(searchPath)) return false;
  let content = fs.readFileSync(searchPath, 'utf8');

  const match = content.match(/(?:window\.|var\s*)IDX\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return false;

  let idxList;
  try {
    idxList = JSON.parse(match[1]);
  } catch (e) {
    idxList = new Function('return ' + match[1])();
  }

  // Remove existing entry for this slug if any
  idxList = idxList.filter(item => (item.url || item.u) !== `/${slug}` && (item.url || item.u) !== `/${slug}.html`);
  const newItem = {
    title: title,
    url: `/${slug}`,
    cat: cat || 'Gaming',
    date: formatDateISO(),
    excerpt: desc || '',
    img: hero || '',
    tags: []
  };
  idxList.unshift(newItem);

  const updatedJs = content.replace(/(?:window\.|var\s*)IDX\s*=\s*\[[\s\S]*?\];/, () => `window.IDX = ${JSON.stringify(idxList, null, 2)};`);
  fs.writeFileSync(searchPath, updatedJs, 'utf8');
  console.log(`✅ [Search Index] Updated assets/search.js (Total items: ${idxList.length})`);
  return true;
}

/**
 * 2. Cascade Sitemap (sitemap.xml)
 */
export function cascadeSitemap({ slug, isEn = false }) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return false;
  let xml = fs.readFileSync(sitemapPath, 'utf8');

  const today = formatDateISO();
  const urlVI = `https://otahub.asia/${slug}`;
  const urlEN = `https://otahub.asia/en/${slug}`;

  if (!xml.includes(`<loc>${urlVI}</loc>`)) {
    const entryVI = `  <url>\n    <loc>${urlVI}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    xml = xml.replace('</urlset>', `${entryVI}</urlset>`);
  }

  if (isEn && !xml.includes(`<loc>${urlEN}</loc>`)) {
    const entryEN = `  <url>\n    <loc>${urlEN}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    xml = xml.replace('</urlset>', `${entryEN}</urlset>`);
  }

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`✅ [Sitemap] Synchronized URL(s) to sitemap.xml`);
  return true;
}

/**
 * 2b. Cascade Feeds (feed.xml & feed.json)
 */
export function cascadeFeeds({ slug, title, desc, hero }) {
  const urlAbs = `https://otahub.asia/${slug}`;
  const imgAbs = hero ? (hero.startsWith('http') ? hero : `https://otahub.asia${hero.startsWith('/') ? '' : '/'}${hero}`) : '';
  const nowIso = new Date().toISOString();

  // feed.json
  const jsonPath = path.join(ROOT, 'feed.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const fj = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (Array.isArray(fj.items) && !fj.items.some(i => i.url === urlAbs)) {
        fj.items.unshift({
          id: urlAbs,
          url: urlAbs,
          title,
          content_text: desc || title,
          image: imgAbs,
          date_published: nowIso
        });
        fs.writeFileSync(jsonPath, JSON.stringify(fj, null, 2), 'utf8');
        console.log(`✅ [Feeds] Updated feed.json`);
      }
    } catch (e) {
      console.warn('feed.json sync error:', e);
    }
  }

  // feed.xml
  const xmlPath = path.join(ROOT, 'feed.xml');
  if (fs.existsSync(xmlPath)) {
    try {
      let fx = fs.readFileSync(xmlPath, 'utf8');
      if (!fx.includes(`<link>${urlAbs}</link>`) && fx.includes('<item>')) {
        const item = `  <item>\n    <title>${escapeHtml(title)}</title>\n    <link>${urlAbs}</link>\n    <guid isPermaLink="true">${urlAbs}</guid>\n    <pubDate>${new Date().toUTCString()}</pubDate>\n    <description>${escapeHtml(desc || title)}</description>\n` + (imgAbs ? `    <media:content url="${escapeHtml(imgAbs)}" medium="image"/>\n` : '') + `  </item>\n`;
        const p = fx.indexOf('  <item>');
        fx = fx.slice(0, p) + item + fx.slice(p);
        fs.writeFileSync(xmlPath, fx, 'utf8');
        console.log(`✅ [Feeds] Updated feed.xml`);
      }
    } catch (e) {
      console.warn('feed.xml sync error:', e);
    }
  }
}

/**
 * 3. Cascade Category Hub (anime.html / gaming.html / manga.html)
 */
export function cascadeCategoryHub({ slug, title, cat, hero, desc }) {
  let targetHub = 'gaming.html';
  const c = (cat || '').toLowerCase();
  if (c.includes('anime')) targetHub = 'anime.html';
  else if (c.includes('manga') || c.includes('manhwa')) targetHub = 'manga.html';

  const hubPath = path.join(ROOT, targetHub);
  if (!fs.existsSync(hubPath)) return false;
  let html = fs.readFileSync(hubPath, 'utf8');

  const markerMatch = html.match(/(<!-- ADMIN:ARTICLES_START -->)([\s\S]*?)(<!-- ADMIN:ARTICLES_END -->)/);
  if (!markerMatch) return false;

  const cardHtml = `
      <a href="/${slug}" class="ac">
        <div class="ac-thumb"><img src="${hero}" alt="${escapeHtml(title)}" loading="lazy"><span class="tag">${escapeHtml(cat || 'TIN MỚI')}</span></div>
        <div class="ac-body">
          <h3 class="ac-title">${escapeHtml(title)}</h3>
          <div class="ac-meta"><span class="ac-author">OtaHub Editorial</span> · <span class="ac-date">Vừa xong</span></div>
        </div>
      </a>\n`;

  // Avoid duplicate card for same slug
  if (!markerMatch[2].includes(`href="/${slug}"`)) {
    const newSection = markerMatch[1] + cardHtml + markerMatch[2] + markerMatch[3];
    html = html.replace(/(<!-- ADMIN:ARTICLES_START -->)[\s\S]*?(<!-- ADMIN:ARTICLES_END -->)/, newSection);
    fs.writeFileSync(hubPath, html, 'utf8');
    console.log(`✅ [Category Hub] Cascaded new card to ${targetHub}`);
  }
  return true;
}

/**
 * 3b. Cascade Top List hub (top-list.html) — only for listicle-style "Top N" articles.
 * Pass itemCount to mark an article as a Top List entry; omit it (or leave 0) for
 * ordinary news/review articles and this step is skipped entirely.
 */
export function cascadeTopList({ slug, title, cat, hero, desc, itemCount }) {
  if (!itemCount || itemCount <= 0) return false;

  const hubPath = path.join(ROOT, 'top-list.html');
  if (!fs.existsSync(hubPath)) return false;
  let html = fs.readFileSync(hubPath, 'utf8');

  const match = html.match(/var\s+TOPLIST\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return false;

  let list;
  try { list = new Function('return ' + match[1])(); } catch (e) { return false; }

  const url = `/${slug}`;
  list = list.filter(item => item.url !== url);

  const type = (cat || '').toLowerCase().includes('manga') ? 'manga'
    : (cat || '').toLowerCase().includes('game') ? 'game' : 'anime';
  const catC = type === 'manga' ? 'var(--lavender)' : type === 'game' ? 'var(--cyan)' : 'var(--sakura)';

  list.unshift({
    id: slug.slice(0, 12),
    type,
    url,
    img: hero || '/assets/img/placeholder.svg',
    cat: cat || 'Anime',
    catC,
    title,
    sub: `Top ${itemCount}`,
    desc: desc || title,
    itemCount,
    author: 'OtaHub Editorial',
    date: formatDateVN(),
    date_ts: 0,
  });

  html = html.replace(/var\s+TOPLIST\s*=\s*\[[\s\S]*?\];/, () => `var TOPLIST = ${JSON.stringify(list, null, 2)};`);
  fs.writeFileSync(hubPath, html, 'utf8');
  console.log(`✅ [Top List] Cascaded new entry to top-list.html (Total: ${list.length})`);
  return true;
}

/**
 * 4. Cascade News Stream (news.html)
 */
export function cascadeNewsStream({ slug, title, cat, hero, desc }) {
  const newsPath = path.join(ROOT, 'news.html');
  if (!fs.existsSync(newsPath)) return false;
  let html = fs.readFileSync(newsPath, 'utf8');

  const markerMatch = html.match(/(<!-- OTAHUB_NEW30_START -->[\s\S]*?<h2[^>]*>)(\d+)( tin mới đã kiểm chứng<\/h2><div[^>]*>)([\s\S]*?)(<\/div><\/section><!-- OTAHUB_NEW30_END -->)/);
  if (!markerMatch) return false;

  const currentCount = parseInt(markerMatch[2], 10) || 30;
  const existingArticles = markerMatch[4];

  if (!existingArticles.includes(`href="/${slug}"`)) {
    const newCard = `
    <a href="/${slug}" style="display:block;background:#150a2c;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;" onmouseover="this.style.borderColor='rgba(0,229,255,0.4)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,229,255,0.12)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='none';this.style.boxShadow='none'">
      <div style="position:relative;width:100%;height:180px;background:#0d051e;overflow:hidden;">
        <img src="${hero}" alt="${escapeHtml(title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">
        <span style="position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#ff3080,#7c3aed);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:.15em;text-transform:uppercase;">${escapeHtml(cat || 'HOT')}</span>
      </div>
      <div style="padding:16px;">
        <h3 style="color:#ffffff;font-size:15px;font-weight:700;line-height:1.4;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(title)}</h3>
        <p style="color:rgba(240,238,255,0.65);font-size:12.5px;line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(desc || '')}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;color:rgba(240,238,255,0.4);font-size:11px;">
          <span>⚡ OtaHub News</span>
          <span>Vừa xong</span>
        </div>
      </div>
    </a>\n`;

    const updatedNewsSection = `${markerMatch[1]}${currentCount + 1}${markerMatch[3]}${newCard}${existingArticles}${markerMatch[5]}`;
    html = html.replace(/(<!-- OTAHUB_NEW30_START -->[\s\S]*?<!-- OTAHUB_NEW30_END -->)/, updatedNewsSection);
    fs.writeFileSync(newsPath, html, 'utf8');
    console.log(`✅ [News Stream] Cascaded new item to news.html (Total: ${currentCount + 1})`);
  }
  return true;
}

/**
 * 5. Cascade Homepage (index.html)
 */
export function cascadeHomepage({ slug, title, cat, hero, desc }) {
  const homePath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(homePath)) return false;
  let html = fs.readFileSync(homePath, 'utf8');

  // 5.1 Ticker Update
  if (html.includes('<div class="tick-track">') && !html.includes(`href="/${slug}"`)) {
    const tickerItem = `<span class="tick-item">🔥 <strong>${escapeHtml(cat || 'TIN MỚI')}:</strong> <a href="/${slug}" style="color:inherit;text-decoration:none">${escapeHtml(title)}</a></span>`;
    html = html.replace('<div class="tick-track">', () => `<div class="tick-track">\n      ${tickerItem}`);
  }

  // 5.2 Latest wrap update (w-card)
  const latestMatch = html.match(/(<div class="latest-wrap">\s*<div>\s*)/);
  if (latestMatch && !html.includes(`<article class="w-card"><a href="/${slug}"`)) {
    const dd = formatDateVN();
    const wCard = `<article class="w-card"><a href="/${slug}" style="text-decoration:none;display:contents"><div class="wc-info"><div class="wc-c" style="color:var(--cyan)">${escapeHtml(cat || 'Gaming')}</div><div class="wc-t">${escapeHtml(title)}</div><div class="wc-m">OtaHub Editorial · ${dd} · 3 min</div></div><div class="wc-thumb"><img src="${hero || '/assets/img/placeholder.svg'}" alt="${escapeHtml(title)}" loading="lazy" width="1200" height="675"></div></a></article>\n      `;
    html = html.replace(latestMatch[0], () => latestMatch[1] + wCard);
  }

  fs.writeFileSync(homePath, html, 'utf8');
  console.log(`✅ [Homepage] Updated index.html ticker and latest stream`);
  return true;
}

/**
 * Full Cascade Suite
 */
export async function cascadeAll({ slug, title, desc, cat, hero, isEn = false, itemCount = 0 }) {
  console.log(`\n🚀 [Cascade Engine] Cascading article "${title}" (/ ${slug})...`);

  cascadeSearchIndex({ slug, title, desc, cat, hero });
  cascadeSitemap({ slug, isEn });
  cascadeFeeds({ slug, title, desc, hero });
  cascadeCategoryHub({ slug, title, cat, hero, desc });
  cascadeTopList({ slug, title, cat, hero, desc, itemCount });
  cascadeNewsStream({ slug, title, cat, hero, desc });
  cascadeHomepage({ slug, title, cat, hero, desc });

  // Instant IndexNow notification
  const urlsToPing = [`https://otahub.asia/${slug}`];
  if (isEn) urlsToPing.push(`https://otahub.asia/en/${slug}`);
  await pingIndexNow(urlsToPing);

  console.log(`✨ [Cascade Engine] Successfully cascaded and broadcasted article to all channels!\n`);
}

// CLI test / runner
if (process.argv[1]?.endsWith('publish-article.mjs')) {
  const args = process.argv.slice(2);
  if (args.length >= 4) {
    const [slug, title, cat, hero, desc, itemCount] = args;
    cascadeAll({ slug, title, cat, hero, desc: desc || title, itemCount: parseInt(itemCount, 10) || 0 });
  } else {
    console.log('Usage: node scripts/publish-article.mjs <slug> <title> <category> <heroImg> [description] [itemCount]');
    console.log('  itemCount: pass the list size (e.g. 8) to also cascade into top-list.html; omit for ordinary articles.');
  }
}
