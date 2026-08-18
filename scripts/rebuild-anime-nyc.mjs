import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const builds = [
  {
    template: 'apothecary-diaries-season3-trailer.html',
    target: 'anime-nyc-2026-crunchyroll.html',
    title: 'Anime NYC 2026: lịch premiere và panel Crunchyroll đáng chú ý · OtaHub',
    headline: 'Anime NYC 2026: các premiere và panel đáng chú ý',
    description: 'Anime NYC 2026 diễn ra 20–23/8: lịch premiere, panel Re:ZERO, Bungo Stray Dogs, Iruma-kun và những điểm đáng chú ý từ Crunchyroll.',
    excerpt: 'Crunchyroll mang hai suất chiếu premiere tổng hợp, kỷ niệm 10 năm Re:ZERO và Bungo Stray Dogs, cùng chương trình hậu trường Welcome to Demon School! Iruma-kun đến Javits Center từ 20–23/8.',
    summary: '<strong>Anime NYC 2026</strong> diễn ra tại Javits Center từ <strong>20–23/8</strong>. Lịch chính thức của Crunchyroll gồm hai suất chiếu premiere tổng hợp, các panel kỷ niệm 10 năm của <strong>Re:ZERO</strong> và <strong>Bungo Stray Dogs</strong>, cùng chương trình hậu trường <strong>Welcome to Demon School! Iruma-kun</strong>.',
    dateTime: '2026-08-18T09:00:00+07:00',
    date: '2026-08-18',
    read: '7 phút đọc',
    slug: 'anime-nyc-2026-crunchyroll',
    templateSlug: 'apothecary-diaries-season3-trailer',
    image: '/assets/img/anime-nyc-2026-hero-v2.png',
    language: 'vi',
  },
  {
    template: 'en/apothecary-diaries-season3-trailer.html',
    target: 'en/anime-nyc-2026-crunchyroll.html',
    title: 'Anime NYC 2026: Crunchyroll premieres and panels to watch · OtaHub',
    headline: 'Anime NYC 2026: premieres and panels to watch',
    description: 'Anime NYC 2026 runs August 20–23. Here are the confirmed Crunchyroll premieres, Re:ZERO and Bungo Stray Dogs anniversary panels, and key schedule details.',
    excerpt: 'Crunchyroll brings two premiere screenings, the 10th anniversaries of Re:ZERO and Bungo Stray Dogs, and a Welcome to Demon School! Iruma-kun production panel to Javits Center on August 20–23.',
    summary: '<strong>Anime NYC 2026</strong> runs at Javits Center from <strong>August 20–23</strong>. Crunchyroll\'s official schedule includes two compilation premiere screenings, 10th-anniversary panels for <strong>Re:ZERO</strong> and <strong>Bungo Stray Dogs</strong>, and a production session for <strong>Welcome to Demon School! Iruma-kun</strong>.',
    dateTime: '2026-08-18T09:00:00+07:00',
    date: '2026-08-18',
    read: '7 min read',
    slug: 'en/anime-nyc-2026-crunchyroll',
    templateSlug: 'en/apothecary-diaries-season3-trailer',
    image: '/assets/img/anime-nyc-2026-hero-v2.png',
    language: 'en',
  },
];

function replaceMeta(html, key, value, property = false) {
  const attr = property ? 'property' : 'name';
  const pattern = new RegExp(`(<meta\\s+${attr}=["']${key}["']\\s+content=["'])[^"']*(["'])`, 'i');
  return html.replace(pattern, `$1${value}$2`);
}

for (const build of builds) {
  const existing = fs.readFileSync(path.join(root, build.target), 'utf8');
  const body = existing.match(/<article(?:\s[^>]*)?>([\s\S]*?)<\/article>/i)?.[1]?.trim();
  if (!body) throw new Error(`Could not extract article body from ${build.target}`);

  let html = fs.readFileSync(path.join(root, build.template), 'utf8');
  const oldHeroTitle = html.match(/<h1 class="art-hero-title">([\s\S]*?)<\/h1>/i)?.[1];
  const oldExcerpt = html.match(/<p class="art-hero-excerpt">([\s\S]*?)<\/p>/i)?.[1];
  const oldImage = html.match(/background-image:url\(([^)]+)\)/i)?.[1];
  if (!oldHeroTitle || !oldExcerpt || !oldImage) throw new Error(`Template markers missing in ${build.template}`);

  html = html.replaceAll(build.templateSlug, build.slug);
  html = html.replace(/<link rel="alternate" hreflang="vi"[^>]*><link rel="alternate" hreflang="en"[^>]*><link rel="alternate" hreflang="x-default"[^>]*>/i, '<link rel="alternate" hreflang="vi" href="https://otahub.asia/anime-nyc-2026-crunchyroll"><link rel="alternate" hreflang="en" href="https://otahub.asia/en/anime-nyc-2026-crunchyroll"><link rel="alternate" hreflang="x-default" href="https://otahub.asia/anime-nyc-2026-crunchyroll">');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${build.title}</title>`);
  html = replaceMeta(html, 'description', build.description);
  html = replaceMeta(html, 'og:title', build.headline, true);
  html = replaceMeta(html, 'og:description', build.description, true);
  html = replaceMeta(html, 'og:image', `https://otahub.asia${build.image}`, true);
  html = replaceMeta(html, 'twitter:title', build.headline);
  html = replaceMeta(html, 'twitter:description', build.description);
  html = replaceMeta(html, 'twitter:image', `https://otahub.asia${build.image}`);
  html = replaceMeta(html, 'article:published_time', build.dateTime, true);
  html = replaceMeta(html, 'article:modified_time', build.dateTime, true);
  html = html.replaceAll(oldHeroTitle, build.headline).replaceAll(oldExcerpt, build.excerpt).replaceAll(oldImage, build.image);
  html = html.replace(/<span class="am-date">[\s\S]*?<\/span>/i, `<span class="am-date">${build.date}</span>`);
  html = html.replace(/<span class="am-read">[\s\S]*?<\/span>/i, `<span class="am-read">${build.read}</span>`);
  html = html.replace(/<div class="hb-text">[\s\S]*?<\/div>/i, `<div class="hb-text">${build.summary}</div>`);
  html = html.replace(/<article class="art-body">[\s\S]*?<\/article>/i, `<article class="art-body">\n${body}\n</article>`);
  html = html.replace(/"headline"\s*:\s*"[^"]*"/i, `"headline": "${build.headline}"`);
  html = html.replace(/"description"\s*:\s*"[^"]*"/i, `"description": "${build.description}"`);
  html = html.replace(/"image"\s*:\s*"[^"]*"/i, `"image": "https://otahub.asia${build.image}"`);
  html = html.replace(/"datePublished"\s*:\s*"[^"]*"/i, `"datePublished": "${build.dateTime}"`);
  html = html.replace(/"dateModified"\s*:\s*"[^"]*"/i, `"dateModified": "${build.dateTime}"`);
  html = html.replace(/"keywords"\s*:\s*"[^"]*"/i, `"keywords": "Anime NYC 2026, Crunchyroll, Re:ZERO, Bungo Stray Dogs, Iruma-kun"`);
  html = html.replace(/engage\.js\?v=[^"']+/g, 'engage.js?v=20260818c');
  fs.writeFileSync(path.join(root, build.target), html, 'utf8');
}

console.log(`Rebuilt ${builds.length} Anime NYC article pages from the standard article template.`);
