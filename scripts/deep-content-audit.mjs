import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const EXCLUDED_FILES = new Set([
  'admin.html', 'news-pipeline.html', 'index.html', 'anime.html', 'gaming.html',
  'manga.html', 'news.html', 'rankings.html', 'reviews.html', 'sap-ra-mat.html',
  'about.html', 'tag.html', 'privacy.html', 'terms.html', 'contact.html',
  '404.html', 'anime-detail.html', 'article.html', 'bai-viet.html',
  'chinh-sach-bao-mat.html', 'choi-gi.html', 'chuyen-sau.html', 'game-detail.html',
  'huong-dan.html', 'lich-phat-song.html', 'lien-he.html', 'manga-detail.html',
  'recommend.html', 'in-depth.html'
]);

function getArticles(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const articles = [];
  for (const ent of entries) {
    if (ent.isFile() && ent.name.endsWith('.html')) {
      if (!EXCLUDED_FILES.has(ent.name) && !ent.name.startsWith('templates/')) {
        articles.push({
          relPath: prefix ? `${prefix}/${ent.name}` : ent.name,
          fullPath: path.join(dir, ent.name),
          isEn: prefix === 'en'
        });
      }
    }
  }
  return articles;
}

const viArticles = getArticles(root);
const enDir = path.join(root, 'en');
const enArticles = fs.existsSync(enDir) ? getArticles(enDir, 'en') : [];
const allArticles = [...viArticles, ...enArticles];

console.log(`🔍 Scanning ${allArticles.length} articles (${viArticles.length} VI, ${enArticles.length} EN)...`);

// Known Hallucination patterns
const HALLUCINATION_PATTERNS = [
  { id: 'one-piece-fake-chapters', re: /chapter\s+119[1-3]\b/i, desc: 'Chapter One Piece bịa đặt (1191-1193)' },
  { id: 'grand-blue-fake-s3-s4', re: /grand\s+blue[\s\S]{0,40}(?:mùa\s+[34]|season\s+[34])/i, desc: 'Grand Blue Mùa 3/4 bịa đặt (hiện mới công bố S2)' },
  { id: 'control-resonant', re: /control\s+resonant/i, desc: 'Game bịa đặt "Control Resonant"' },
  { id: 'splatoon-raiders', re: /splatoon\s+raiders/i, desc: 'Game bịa đặt "Splatoon Raiders"' },
  { id: 'fortunes-weave', re: /fortune'?s\s+weave/i, desc: 'Game bịa đặt "Fire Emblem Fortune\'s Weave"' },
  { id: 'rhythm-heaven-groove', re: /rhythm\s+heaven\s+groove/i, desc: 'Game bịa đặt "Rhythm Heaven Groove"' },
  { id: 'silent-hill-screen-burn', re: /(?:screen\s+burn\s+interactive|simon\s+ordell)/i, desc: 'Silent Hill Townfall bịa đặt studio & nhân vật' },
  { id: 'doraemon-steam-london', re: /(?:nobita'?s\s+steam-powered|steam-powered\s+time\s+machine)/i, desc: 'Doraemon Movie 46 bịa đặt bối cảnh London' },
  { id: 'cyberpunk-edgerunners-2', re: /cyberpunk:?\s+edgerunners\s+2/i, desc: 'Bịa tên "Edgerunners 2" và ngày chiếu 20/10/2026' },
  { id: 'dragon-ball-super-beerus-tv', re: /dragon\s+ball\s+super:?\s+beerus/i, desc: 'Dragon Ball Super: Beerus chiếu TV 11/10 (chưa có anime này)' },
  { id: 'jojo-sbr-anime-2026', re: /jojo[\s\S]{0,30}steel\s+ball\s+run[\s\S]{0,30}(?:lên\s+sóng|25\/9)/i, desc: 'JoJo Steel Ball Run anime 25/9 (chưa từng công bố anime SBR)' },
  { id: 'youjo-senki-s2-broadcast-ended', re: /youjo\s+senki\s+(?:ii|2)[\s\S]{0,40}đã\s+kết\s+thúc\s+phát\s+sóng/i, desc: 'Youjo Senki II phát sóng xong (thực tế S2 chưa chiếu)' },
];

// Placeholder patterns
const PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /\bđang\s+cập\s+nhật\b/i,
  /\bnội\s+dung\s+đang\s+được\s+(?:viết|cập\s+nhật)\b/i,
  /\bTODO\b/,
  /\bundefined\b/,
  /\bNaN\b/,
  /\[object Object\]/
];

// Truncated ending patterns (last sentence of body ending in conjunction or dangling punctuation)
const DANGLING_END_WORDS = [
  'và', 'nhưng', 'khi', 'hoặc', 'nếu', 'đang', 'với', 'trong', 'rằng', 'là', 'để', 'vì', 'do',
  'and', 'but', 'when', 'or', 'if', 'with', 'that', 'because', 'as', 'to'
];

const results = [];

for (const art of allArticles) {
  const content = fs.readFileSync(art.fullPath, 'utf8');
  
  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s*[·•|-]\s*OtaHub.*$/i, '').trim() : art.relPath;

  // Body extraction
  const bodyMatch = content.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : '';
  const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(/\s+/).length : 0;

  // Headings in body
  const h2Count = (bodyHtml.match(/<h2\b[^>]*>/gi) || []).length;
  const pCount = (bodyHtml.match(/<p\b[^>]*>/gi) || []).length;

  const issues = [];
  const flags = {
    isTruncated: false,
    isHallucinated: false,
    isShort: false,
    hasBrokenImages: false,
    hasPlaceholders: false,
    hasHtmlErrors: false
  };

  // 1. Check length
  if (words < 200) {
    flags.isShort = true;
    issues.push({ type: 'SHORT_CONTENT', detail: `Nội dung quá ngắn (${words} từ, < 200 từ)` });
  } else if (words < 350) {
    flags.isShort = true;
    issues.push({ type: 'THIN_CONTENT', detail: `Nội dung tương đối ngắn (${words} từ)` });
  }

  // 2. Check Truncated / Cut-off ending
  if (text.length > 0) {
    const trimmedText = text.trim();
    const lastChar = trimmedText.slice(-1);
    const lastWords = trimmedText.split(/\s+/).slice(-5);
    const lastWord = lastWords[lastWords.length - 1].toLowerCase().replace(/[^a-zà-ỹ]/gi, '');

    if (DANGLING_END_WORDS.includes(lastWord)) {
      flags.isTruncated = true;
      issues.push({ type: 'DANGLING_END_WORD', detail: `Câu kết bị cụt, dừng ở từ lấp lửng: "...${lastWords.join(' ')}"` });
    }

    if ([',', ':', ';', '-', '–', '—', '(', '/', '\\'].includes(lastChar)) {
      flags.isTruncated = true;
      issues.push({ type: 'DANGLING_PUNCTUATION', detail: `Dừng ở dấu câu dở dang: "${lastChar}" (cuối bài: "...${lastWords.join(' ')}")` });
    }

    if (trimmedText.endsWith('...')) {
      flags.isTruncated = true;
      issues.push({ type: 'ELLIPSIS_END', detail: `Kết thúc bài viết bằng dấu 3 chấm dở dang: "...${lastWords.join(' ')}"` });
    }
  }

  // 3. Check for HTML unclosed / broken tags in body
  if (bodyHtml) {
    const openP = (bodyHtml.match(/<p\b/gi) || []).length;
    const closeP = (bodyHtml.match(/<\/p>/gi) || []).length;
    if (Math.abs(openP - closeP) > 3) {
      flags.hasHtmlErrors = true;
      issues.push({ type: 'MISMATCHED_P_TAGS', detail: `Lệch thẻ <p>: mở ${openP}, đóng ${closeP}` });
    }

    // Check empty headings
    if (/<h[2-4][^>]*>\s*<\/h[2-4]>/i.test(bodyHtml)) {
      flags.hasHtmlErrors = true;
      issues.push({ type: 'EMPTY_HEADING', detail: 'Có thẻ tiêu đề rỗng (empty heading)' });
    }
  } else {
    flags.hasHtmlErrors = true;
    issues.push({ type: 'MISSING_BODY', detail: 'Không tìm thấy thẻ <article class="art-body">' });
  }

  // 4. Check placeholders
  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(content)) {
      flags.hasPlaceholders = true;
      issues.push({ type: 'PLACEHOLDER_FOUND', detail: `Chứa từ khóa placeholder: ${pat.toString()}` });
    }
  }

  // 5. Check Hallucinations
  const fullArticleText = (title + ' ' + text).toLowerCase();
  for (const h of HALLUCINATION_PATTERNS) {
    if (h.re.test(fullArticleText)) {
      flags.isHallucinated = true;
      issues.push({ type: 'HALLUCINATION', detail: h.desc });
    }
  }

  // 6. Check Images
  const imgMatches = [...content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
  for (const im of imgMatches) {
    const src = im[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    const cleanSrc = src.split('?')[0].split('#')[0];
    const isKv = cleanSrc.startsWith('/assets/img/uploads/') || cleanSrc.startsWith('assets/img/uploads/');
    if (isKv) continue; // KV images are served from KV storage

    const localPath = cleanSrc.startsWith('/') ? path.join(root, cleanSrc.slice(1)) : path.resolve(path.dirname(art.fullPath), cleanSrc);
    if (!fs.existsSync(localPath)) {
      flags.hasBrokenImages = true;
      issues.push({ type: 'BROKEN_IMAGE', detail: `Ảnh không tồn tại: ${src}` });
    }
  }

  if (issues.length > 0) {
    results.push({
      relPath: art.relPath,
      title,
      words,
      isEn: art.isEn,
      flags,
      issues
    });
  }
}

// Write full report JSON
fs.writeFileSync('scripts/audit-report-deep.json', JSON.stringify(results, null, 2), 'utf8');

console.log(`\n================ KẾT QUẢ DÒ QUÉT ================`);
console.log(`Tổng số bài được quét: ${allArticles.length}`);
console.log(`Số bài phát hiện vấn đề: ${results.length}`);

const truncatedList = results.filter(r => r.flags.isTruncated);
const hallucinatedList = results.filter(r => r.flags.isHallucinated);
const shortList = results.filter(r => r.flags.isShort);
const brokenImgList = results.filter(r => r.flags.hasBrokenImages);
const placeholderList = results.filter(r => r.flags.hasPlaceholders);

console.log(`- 🔴 Bài bị cụt nội dung (dangling end/ellipsis): ${truncatedList.length}`);
console.log(`- ⚠️ Bài có thông tin Hallucination / Hư cấu: ${hallucinatedList.length}`);
console.log(`- 📉 Bài quá ngắn (< 350 từ): ${shortList.length}`);
console.log(`- 🖼️ Bài có ảnh hỏng (404 image): ${brokenImgList.length}`);
console.log(`- 🏷️ Bài có placeholder (lorem ipsum, undefined...): ${placeholderList.length}`);
