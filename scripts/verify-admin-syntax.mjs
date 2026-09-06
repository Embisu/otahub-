import fs from 'fs';
import vm from 'vm';

const html = fs.readFileSync('admin.html', 'utf8');

// Find script tags carefully
let start = 0;
let scriptIndex = 0;
let errors = 0;

while (true) {
  const scriptStart = html.indexOf('<script', start);
  if (scriptStart === -1) break;
  const tagEnd = html.indexOf('>', scriptStart);
  if (tagEnd === -1) break;
  const tagOpen = html.slice(scriptStart, tagEnd + 1);

  if (tagOpen.includes('application/ld+json')) {
    start = tagEnd + 1;
    continue;
  }

  // Find closing </script> that is not escaped
  const scriptEnd = html.indexOf('</' + 'script>', tagEnd);
  if (scriptEnd === -1) break;

  const code = html.slice(tagEnd + 1, scriptEnd).trim();
  start = scriptEnd + 9;

  if (!code) continue;
  scriptIndex++;

  try {
    new vm.Script(code);
    console.log(`[PASS] Script block #${scriptIndex}: Valid JS syntax (${code.length} characters)`);
  } catch (err) {
    errors++;
    console.error(`[FAIL] Script block #${scriptIndex}: Syntax error at line ${err.stack.split('\n')[0]}: ${err.message}`);
  }
}

console.log(`\nVerified ${scriptIndex} script block(s). Errors: ${errors}`);
