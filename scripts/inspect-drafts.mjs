import { execSync } from 'node:child_process';

const out = execSync('npx wrangler kv key list --binding ADMIN_KV --prefix draft: --remote').toString();
const keys = JSON.parse(out);
console.log(`Checking ${keys.length} drafts in KV...\n`);

for (const k of keys) {
  try {
    const raw = execSync(`npx wrangler kv key get --binding ADMIN_KV "${k.name}" --remote`).toString();
    const d = JSON.parse(raw);
    const titleMatch = (d.html || '').match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/· OtaHub.*/, '').trim() : '(no title)';
    const at = d.updatedAt ? new Date(d.updatedAt).toLocaleString('vi-VN') : 'unknown';
    console.log(`[${k.name}]`);
    console.log(`  Title: ${title}`);
    console.log(`  Author: ${d.updatedBy} | Time: ${at} | Length: ${(d.html || '').length} chars\n`);
  } catch (e) {
    console.error(`Error reading ${k.name}:`, e.message);
  }
}
