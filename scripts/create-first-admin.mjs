// Tao tai khoan admin dau tien qua /api/admin/setup (giao dien admin khong co form nay).
// Chay trong terminal cua ban: node scripts/create-first-admin.mjs
import readline from 'node:readline';

const BASE = process.env.OTAHUB_URL || 'https://otahub.asia';

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); else rl.output.write('*'); };
    }
    rl.question(question, (answer) => { rl.close(); if (hidden) console.log(''); resolve(answer); });
  });
}

const username = (await ask('Ten dang nhap admin: ')).trim();
const password = await ask('Mat khau moi (>= 8 ky tu): ', true);
const confirm = await ask('Nhap lai mat khau: ', true);
const secret = await ask('Ma thiet lap (ADMIN_SETUP_SECRET): ', true);

if (!username || password.length < 8) { console.error('Can ten dang nhap va mat khau >= 8 ky tu.'); process.exit(1); }
if (password !== confirm) { console.error('Hai lan nhap mat khau khong khop.'); process.exit(1); }

const res = await fetch(`${BASE}/api/admin/setup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password, secret }),
});
const data = await res.json().catch(() => ({}));
if (res.ok) console.log(`Da tao admin "${username}". Dang nhap tai ${BASE}/admin`);
else console.error(`That bai (${res.status}): ${data.error || 'khong ro loi'}`);
