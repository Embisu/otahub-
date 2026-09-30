import { readFileSync, writeFileSync, readdirSync } from 'fs';

const files = readdirSync('.').filter((f) => f.endsWith('.html'));
let fixed = [];
let skipped = [];

function escapeJson(str) {
  return str;
}

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (!/Câu hỏi thường gặp/.test(html)) continue;
  if (/FAQPage/.test(html)) continue;

  const faqIdx = html.indexOf('Câu hỏi thường gặp');
  const afterFaqH2 = html.indexOf('</h2>', faqIdx) + 5;
  // Find the next h2 (end of FAQ section) or end of article
  const nextH2 = html.indexOf('<h2', afterFaqH2);
  const articleEnd = html.indexOf('</article>', afterFaqH2);
  const sectionEnd = nextH2 !== -1 && nextH2 < articleEnd ? nextH2 : articleEnd;
  const section = html.slice(afterFaqH2, sectionEnd);

  const qaRe = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  const pairs = [];
  let m;
  while ((m = qaRe.exec(section))) {
    const q = m[1].replace(/<[^>]+>/g, '').trim();
    const a = m[2].replace(/<[^>]+>/g, '').trim();
    if (q && a) pairs.push({ q, a });
  }

  if (pairs.length === 0) {
    skipped.push({ f, reason: 'no qa pairs found' });
    continue;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };

  const scriptBlock = `<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>\n`;

  // Insert before the first <link rel="preconnect" ...> tag (matches existing head structure)
  const insertMarker = '<link rel="preconnect" href="https://fonts.googleapis.com">';
  const insertIdx = html.indexOf(insertMarker);
  if (insertIdx === -1) {
    skipped.push({ f, reason: 'no preconnect marker found' });
    continue;
  }

  const newHtml = html.slice(0, insertIdx) + scriptBlock + html.slice(insertIdx);
  writeFileSync(f, newHtml, 'utf8');
  fixed.push({ f, count: pairs.length });
}

console.log('Fixed:', fixed.length);
fixed.forEach((x) => console.log(' ', x.f, '(' + x.count + ' Q&A)'));
console.log('Skipped:', skipped.length);
skipped.forEach((x) => console.log(' ', x.f, '-', x.reason));
