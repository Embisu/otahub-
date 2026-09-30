import fs from 'fs';
const html = fs.readFileSync('admin.html', 'utf8');
const idx = html.indexOf('function hotGridEditor(');
console.log('Line of hotGridEditor:', html.slice(0, idx).split('\n').length);
console.log('Snippet:\n', html.slice(idx - 100, idx + 300));
