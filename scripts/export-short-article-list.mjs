import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const report = JSON.parse(fs.readFileSync(path.join(root, 'scripts/audit-report-deep.json'), 'utf8'))
  .filter((item) => item.flags?.isShort)
  .sort((a, b) => a.words - b.words || a.relPath.localeCompare(b.relPath));

const escapeCell = (value) => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const rows = report.map((item, index) =>
  `| ${index + 1} | ${item.isEn ? 'EN' : 'VI'} | ${item.words} | \`${escapeCell(item.relPath)}\` | ${escapeCell(item.title)} |`);
const markdown = `# Danh sách bài viết dưới 350 từ\n\n` +
  `Cập nhật: 28/09/2026. Tổng cộng **${report.length} bài**: ` +
  `**${report.filter((item) => !item.isEn).length} VI**, **${report.filter((item) => item.isEn).length} EN**; ` +
  `**${report.filter((item) => item.words < 200).length} bài dưới 200 từ**.\n\n` +
  `| # | Ngôn ngữ | Số từ | Tệp | Tiêu đề |\n|---:|:---:|---:|---|---|\n${rows.join('\n')}\n`;
fs.writeFileSync(path.join(root, 'docs', 'ARTICLES-UNDER-350-WORDS.md'), markdown, 'utf8');

const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = ['index,language,words,file,title', ...report.map((item, index) =>
  [index + 1, item.isEn ? 'EN' : 'VI', item.words, quote(item.relPath), quote(item.title)].join(','))].join('\n');
fs.writeFileSync(path.join(root, 'docs', 'ARTICLES-UNDER-350-WORDS.csv'), `${csv}\n`, 'utf8');

console.log(`Exported ${report.length} short articles to Markdown and CSV.`);
