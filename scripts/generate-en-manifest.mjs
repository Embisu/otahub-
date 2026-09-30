import fs from 'fs';

const enFiles = fs.readdirSync('en').filter(f => f.endsWith('.html'));
fs.writeFileSync('assets/en-manifest.json', JSON.stringify(enFiles, null, 2));
console.log(`Generated assets/en-manifest.json with ${enFiles.length} files.`);
