import fs from 'fs';

// 1. Fix unclosed/duplicate </article> in the 4 files
const filesToFixArticle = [
  'en/girls-frontline-2-exilium-beginners-guide.html',
  'en/nintendo-direct-september-2026-switch-2-mario-kart-9.html',
  'en/solo-leveling-ragnarok-webtoon-english-volume-1.html',
  'girls-frontline-2-huong-dan-tan-thu-doi-hinh-reroll.html'
];

for (const file of filesToFixArticle) {
  let content = fs.readFileSync(file, 'utf8');
  // Replace '</article>\n\n    <div class="art-tags-row">' with '\n\n    <div class="art-tags-row">'
  const target = '</article>\n\n    <div class="art-tags-row">';
  const targetCrlf = '</article>\r\n\r\n    <div class="art-tags-row">';
  if (content.includes(target)) {
    content = content.replace(target, '\n\n    <div class="art-tags-row">');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed </article> in ${file}`);
  } else if (content.includes(targetCrlf)) {
    content = content.replace(targetCrlf, '\r\n\r\n    <div class="art-tags-row">');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed </article> CRLF in ${file}`);
  } else {
    // Regex replace </article> immediately followed by whitespace and <div class="art-tags-row">
    content = content.replace(/<\/article>\s*(<div class="art-tags-row">)/i, '$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed </article> regex in ${file}`);
  }
}

// 2. Fix missing og:image in policy/contact pages
const policyPages = [
  { file: 'dieu-khoan-su-dung.html', title: 'Điều Khoản Sử Dụng · OtaHub', desc: 'Điều khoản dịch vụ, chính sách biên tập và quy định nội dung của OtaHub — Hub tin tức Gaming, Anime và Manga châu Á.' },
  { file: 'en/contact.html', title: 'Contact Us · OtaHub', desc: 'Get in touch with the OtaHub editorial team, submit inquiries, tips, and press releases.' },
  { file: 'en/privacy.html', title: 'Privacy Policy · OtaHub', desc: 'OtaHub privacy policy and data protection practices.' },
  { file: 'en/terms.html', title: 'Terms of Service · OtaHub', desc: 'OtaHub terms of service, editorial policies and content guidelines — news and analysis from OtaHub.' }
];

for (const { file, title, desc } of policyPages) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('og:image')) {
    const ogTags = `<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://otahub.asia/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://otahub.asia/og-image.png">`;
    content = content.replace('</head>', ogTags + '\n</head>');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Added og:image & twitter meta to ${file}`);
  }
}

// 3. Clean non-existent URLs from sitemap-news.xml
if (fs.existsSync('sitemap-news.xml')) {
  let smNews = fs.readFileSync('sitemap-news.xml', 'utf8');
  // Match each <url>...</url> block
  const urlBlocks = [...smNews.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m => m[0]);
  let keptCount = 0;
  let removedCount = 0;
  
  let newSm = smNews;
  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>https:\/\/otahub\.asia\/([^<]+)<\/loc>/);
    if (locMatch) {
      let slug = locMatch[1].replace(/\/$/, '');
      if (!slug.endsWith('.html')) slug += '.html';
      if (!fs.existsSync(slug)) {
        newSm = newSm.replace(block, '');
        removedCount++;
      } else {
        keptCount++;
      }
    }
  }

  // Clean up any extra empty lines
  newSm = newSm.replace(/\n\s*\n/g, '\n');
  fs.writeFileSync('sitemap-news.xml', newSm, 'utf8');
  console.log(`sitemap-news.xml updated: kept ${keptCount}, removed ${removedCount} stale entries.`);
}
