import fs from 'fs';
import vm from 'vm';

console.log('--- Testing New Admin Features ---');

const html = fs.readFileSync('admin.html', 'utf8');

// Find the main JS script block
let mainScript = '';
let start = 0;
while (true) {
  const scriptStart = html.indexOf('<script', start);
  if (scriptStart === -1) break;
  const tagEnd = html.indexOf('>', scriptStart);
  if (tagEnd === -1) break;
  const tagOpen = html.slice(scriptStart, tagEnd + 1);

  if (tagOpen.includes('application/ld+json') || tagOpen.includes('src=')) {
    start = tagEnd + 1;
    continue;
  }

  const scriptEnd = html.indexOf('</' + 'script>', tagEnd);
  if (scriptEnd === -1) break;

  const code = html.slice(tagEnd + 1, scriptEnd).trim();
  if (code.length > 1000) {
    mainScript = code;
    break;
  }
  start = scriptEnd + 9;
}

if (!mainScript) {
  console.error('FAIL: Could not locate main script block');
  process.exit(1);
}

// 1. Verify syntax in isolated vm
console.log('1. Validating VM Script syntax...');
new vm.Script(mainScript);
console.log(`PASS: Valid JS syntax (${mainScript.length} characters)`);

// 2. Test new functions exist
console.log('2. Verifying new function definitions...');
const newFunctions = [
  'generateAndInsertToc',
  'formatVietnamIso',
  'formatPublishDateDisplay',
  'toDatetimeLocalValue',
  'updatePublishDateDisplay',
  'togglePublishDatePicker',
  'applyCustomPublishDate',
  'resetPublishDateToNow',
  'openFullArticlePreview'
];
for (const fn of newFunctions) {
  const re = new RegExp(`(?:function\\s+${fn}\\b|window\\.${fn}\\s*=)`);
  if (!re.test(mainScript)) {
    console.error(`FAIL: Function ${fn} not defined in script`);
    process.exit(1);
  }
}
console.log(`PASS: All ${newFunctions.length} new functions are defined!`);

// 3. Test TOC and Date utilities in sandbox
console.log('3. Testing TOC and Date utilities in sandbox...');
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  document: {
    getElementById: () => null,
    querySelectorAll: () => []
  },
  window: {}
};
vm.createContext(sandbox);

vm.runInContext(`
${mainScript.match(/function slugify[\s\S]*?^}/m)?.[0] || 'function slugify(t){ return (t||"").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); }'}
${mainScript.match(/function cleanPlainText[\s\S]*?^}/m)?.[0] || 'function cleanPlainText(s){ return String(s||"").replace(/<[^>]*>/g,"").trim(); }'}
${mainScript.match(/function esc[\s\S]*?^}/m)?.[0] || 'function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }'}
${mainScript.match(/function formatVietnamIso[\s\S]*?^}/m)?.[0]}
${mainScript.match(/function formatPublishDateDisplay[\s\S]*?^}/m)?.[0]}
${mainScript.match(/function toDatetimeLocalValue[\s\S]*?^}/m)?.[0]}
`, sandbox);

const testDate = new Date('2026-09-30T10:30:00Z');
const isoVietnam = sandbox.formatVietnamIso(testDate);
console.log('Vietnam ISO format test:', isoVietnam);
if (!isoVietnam.includes('+07:00')) {
  console.error('FAIL: formatVietnamIso did not output +07:00 timezone!');
  process.exit(1);
}

const displayDate = sandbox.formatPublishDateDisplay(isoVietnam);
console.log('Publish date display test:', displayDate);
if (!displayDate.includes('/')) {
  console.error('FAIL: formatPublishDateDisplay did not output friendly date format!');
  process.exit(1);
}

const dtLocal = sandbox.toDatetimeLocalValue(isoVietnam);
console.log('Datetime-local input value test:', dtLocal);
if (!dtLocal.includes('T')) {
  console.error('FAIL: toDatetimeLocalValue did not output valid datetime-local string!');
  process.exit(1);
}

// 4. Verify CSS classes exist
console.log('4. Verifying .art-toc CSS classes...');
const cssMatches = [
  '.art-toc',
  '.art-toc-head',
  '.art-toc-title',
  '.art-toc-toggle',
  '.art-toc-list',
  '.art-toc-link'
];
for (const cls of cssMatches) {
  if (!html.includes(cls)) {
    console.error(`FAIL: CSS class ${cls} not found in admin.html`);
    process.exit(1);
  }
}
console.log('PASS: All .art-toc CSS classes exist in admin.html!');

// 5. Verify UI elements exist
console.log('5. Verifying UI element IDs...');
const expectedElements = [
  'publish-datepicker-box',
  'ed-publish-date',
  'curtime-display',
  'misc-pub-curtime-section'
];
for (const id of expectedElements) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: Element id="${id}" not found in admin.html`);
    process.exit(1);
  }
}
console.log('PASS: All expected UI elements exist in admin.html!');

// 6. Verify English preview and TOC buttons exist
console.log('6. Verifying preview and TOC buttons in admin UI...');
if (!html.includes("openFullArticlePreview('en')")) {
  console.error("FAIL: openFullArticlePreview('en') button not found in admin.html");
  process.exit(1);
}
if (!html.includes("openFullArticlePreview('vi')")) {
  console.error("FAIL: openFullArticlePreview('vi') button not found in admin.html");
  process.exit(1);
}
if (!html.includes('generateAndInsertToc()')) {
  console.error('FAIL: generateAndInsertToc() call not found in admin.html UI');
  process.exit(1);
}
console.log('PASS: All preview buttons and TOC buttons exist in admin.html UI!');

// 7. Test applyArticleEditsToHtml with custom publish date
console.log('7. Testing applyArticleEditsToHtml publish date persistence...');
vm.runInContext(`
let ART_TITLE = 'Sample';
let ART_EXCERPT = 'Sample';
let ART_HAS_HB = false;
let ART_HB_LABEL = '';
let ART_HB_TEXT = '';
let BODY_BLOCKS = null;
let currentFile = 'sample-article.html';
function repairArticleBodyHtml(h){ return h; }
function validateArticleBodyHtml(h){ return []; }
${mainScript.match(/function applyArticleEditsToHtml[\s\S]*?^}/m)?.[0]}
`, sandbox);

const sampleHtml = `<!DOCTYPE html><html><head><meta property="article:published_time" content="2026-01-01T00:00:00+07:00"><script type="application/ld+json">{"datePublished":"2026-01-01T00:00:00+07:00"}</script></head><body><span class="am-date">2026-01-01</span><article class="art-body"><p>Test</p></article></body></html>`;
const targetDate = '2026-09-30T10:15:00+07:00';
const updatedHtml = sandbox.applyArticleEditsToHtml(sampleHtml, { pubDate: targetDate });

if (!updatedHtml.includes(targetDate)) {
  console.error('FAIL: applyArticleEditsToHtml did not persist pubDate into meta/schema');
  process.exit(1);
}
if (!updatedHtml.includes('2026-09-30')) {
  console.error('FAIL: applyArticleEditsToHtml did not persist date into am-date');
  process.exit(1);
}
console.log('PASS: applyArticleEditsToHtml persists custom publish date correctly!');

// 8. Verify new Editors and Bilingual / IndexNow features
console.log('8. Verifying new Editors, Bilingual & IndexNow functions...');
const extendedFunctions = [
  'reviewsEditor',
  'renderReviewsEditor',
  'saveReviews',
  'reviewsAddNew',
  'chuyenSauEditor',
  'renderChuyenSauEditor',
  'saveChuyenSau',
  'chuyenSauAddCard',
  'policyPagesModal',
  'pingIndexNowNow',
  'triggerManualIndexNowPing',
  'handleMediaPageDrop',
  'handleEditorImageFilesDrop',
  'createEnglishDraftForArticle',
  'renderAuthorSelectOptions'
];
for (const fn of extendedFunctions) {
  const re = new RegExp(`(?:async\\s+function\\s+${fn}\\b|function\\s+${fn}\\b|window\\.${fn}\\s*=)`);
  if (!re.test(mainScript)) {
    console.error(`FAIL: Function ${fn} not defined in script`);
    process.exit(1);
  }
}
console.log(`PASS: All ${extendedFunctions.length} new editors and utility functions are defined!`);

// 9. Verify Media dropzone & Author select in UI
console.log('9. Verifying Media dropzone & Author select in UI...');
const newUiElements = [
  'media-page-dropzone',
  'post-author-select'
];
for (const id of newUiElements) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: Element id="${id}" not found in admin.html`);
    process.exit(1);
  }
}
console.log('PASS: All new UI elements exist in admin.html!');

// 10. Verify worker IndexNow endpoint
console.log('10. Verifying Cloudflare Worker IndexNow implementation...');
const workerCode = fs.readFileSync('worker/admin-api.js', 'utf8');
if (!workerCode.includes('handlePingIndexNow') || !workerCode.includes('/api/admin/ping-indexnow')) {
  console.error('FAIL: IndexNow endpoint missing from worker/admin-api.js');
  process.exit(1);
}
console.log('PASS: Worker IndexNow endpoint properly implemented and registered!');

console.log('\n--- ALL ADMIN FEATURE TESTS PASSED 100%! ---');
