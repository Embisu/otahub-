import pg from 'pg';
const { Client } = pg;

const password = 'Tgnaboas210618';
const projectRef = 'xmrctipywjevrknxzjau';

const configs = [
  // Session pooler
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432, user: `postgres.${projectRef}` },
  // Transaction pooler
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543, user: `postgres.${projectRef}` },
  // Direct postgres user on pooler
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543, user: 'postgres' },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432, user: 'postgres' },
];

async function test() {
  for (const c of configs) {
    console.log(`Testing ${c.host}:${c.port} with user ${c.user}...`);
    const client = new Client({
      host: c.host,
      port: c.port,
      user: c.user,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000
    });
    try {
      await client.connect();
      console.log(`✅ SUCCESS on ${c.host}:${c.port} (${c.user})!`);
      const res = await client.query('SELECT 1 as connected');
      console.log('Query result:', res.rows);
      await client.end();
      return;
    } catch (e) {
      console.log(`Failed:`, e.message);
      try { await client.end(); } catch (_) {}
    }
  }
}

test();
