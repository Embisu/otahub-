import fs from 'fs';

function findTagMismatches(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  // Match all div tags with line numbers
  const regex = /<\/?div(\s[^>]*)?>/gi;
  const lines = html.split('\n');
  const stack = [];

  let match;
  while ((match = regex.exec(html)) !== null) {
    const isClosing = match[0].startsWith('</');
    // Calculate line number
    const lineNum = html.substring(0, match.index).split('\n').length;
    if (!isClosing) {
      stack.push({ line: lineNum, tag: match[0] });
    } else {
      if (stack.length === 0) {
        console.log(`[${filePath}] Extra closing </div> at line ${lineNum}`);
      } else {
        stack.pop();
      }
    }
  }

  if (stack.length > 0) {
    console.log(`[${filePath}] Unclosed <div> tags remaining (${stack.length}):`);
    stack.forEach(s => console.log(`  Line ${s.line}: ${s.tag}`));
  } else {
    console.log(`[${filePath}] All <div> tags perfectly matched!`);
  }
}

findTagMismatches('index.html');
findTagMismatches('en/index.html');
