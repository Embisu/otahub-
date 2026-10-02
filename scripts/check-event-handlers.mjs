import fs from 'fs';

const html = fs.readFileSync('admin.html', 'utf8');

const scriptIdx = html.indexOf('<script>');
const scriptEndIdx = html.lastIndexOf('</script>');
const js = html.substring(scriptIdx + 8, scriptEndIdx);

// Extract event handlers inside the JS strings as well
const eventRegex = /\s(on[a-z]+)=["'\\]+([^"'\\>]+)["'\\]+/gi;
let match;
const handlerCalls = [];

while ((match = eventRegex.exec(js)) !== null) {
  const eventName = match[1];
  const code = match[2];
  const fnMatches = code.matchAll(/([a-zA-Z0-9_$]+)\s*\(/g);
  for (const fn of fnMatches) {
    const fnName = fn[1];
    if (['if', 'for', 'while', 'switch', 'catch', 'alert', 'confirm', 'prompt', 'encodeURIComponent', 'decodeURIComponent', 'parseInt', 'parseFloat', 'setTimeout', 'clearTimeout', 'String', 'Number', 'Boolean', 'Array', 'Object', 'Math', 'JSON', 'Date', 'event', 'stopProp', 'stopPropagation', 'preventDefault', 'remove', 'toggle', 'closest', 'replace', 'stringify', 'getElementById', 'querySelector', 'querySelectorAll', 'focus', 'click', 'select', 'trim', 'toLowerCase', 'toUpperCase', 'split', 'join', 'slice', 'push'].includes(fnName)) continue;
    handlerCalls.push({ event: eventName, fn: fnName, snippet: code });
  }
}

console.log(`Found ${handlerCalls.length} dynamic event handler function calls inside JS templates.`);

// Hàm thuộc trang công khai mà admin sinh HTML hộ (vd khối "Thịnh hành" của choi-gi.html),
// không cần định nghĩa trong admin.
const PUBLIC_PAGE_FUNCTIONS = new Set(['selectItemById']);

const missingFunctions = new Set();
const checkedFunctions = new Set();

for (const { fn, snippet, event } of handlerCalls) {
  if (checkedFunctions.has(fn) || PUBLIC_PAGE_FUNCTIONS.has(fn)) continue;
  checkedFunctions.add(fn);

  const defRegex = new RegExp(`(?:function\\s+${fn}\\b|window\\.${fn}\\s*=|const\\s+${fn}\\s*=|let\\s+${fn}\\s*=|var\\s+${fn}\\s*=)`);
  if (!defRegex.test(js)) {
    missingFunctions.add({ fn, snippet, event });
  }
}

if (missingFunctions.size > 0) {
  console.log(`❌ Found ${missingFunctions.size} potentially missing functions in dynamic templates:`);
  for (const m of missingFunctions) {
    console.log(` - ${m.fn} (in ${m.event}="${m.snippet}")`);
  }
} else {
  console.log(`✅ All ${checkedFunctions.size} dynamic functions called in JS templates are DEFINED!`);
}
