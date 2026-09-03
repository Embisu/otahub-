import fs from 'node:fs';
import pg from 'pg';

const { Client } = pg;

const password = 'Tgnaboas210618';
const projectRef = 'xmrctipywjevrknxzjau';

const connectionHosts = [
  `db.${projectRef}.supabase.co`,
  `aws-0-ap-southeast-1.pooler.supabase.com`,
  `aws-0-us-east-1.pooler.supabase.com`,
  `aws-0-us-west-1.pooler.supabase.com`,
  `aws-0-eu-central-1.pooler.supabase.com`,
  `aws-0-ap-northeast-1.pooler.supabase.com`
];

const sql = fs.readFileSync('d:/ANBU 2/WEBSITE/otahub-source/supabase_schema.sql', 'utf8');

async function runMigration() {
  let connected = false;

  for (const host of connectionHosts) {
    const isPooler = host.includes('pooler');
    const user = isPooler ? `postgres.${projectRef}` : 'postgres';
    const port = isPooler ? 6543 : 5432;

    console.log(`Attempting connection to ${host}:${port} as ${user}...`);

    const client = new Client({
      host,
      port,
      user,
      password,
      database: 'postgres',
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000
    });

    try {
      await client.connect();
      console.log(`✅ Connected successfully to ${host}!`);
      connected = true;

      console.log('Running schema migration...');
      await client.query(sql);
      console.log('🎉 Schema migration executed successfully!');

      // Verify tables
      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      console.log('Created tables in public schema:', res.rows.map(r => r.table_name));

      await client.end();
      break;
    } catch (err) {
      console.warn(`Connection failed for ${host}:`, err.message);
      try { await client.end(); } catch(e) {}
    }
  }

  if (!connected) {
    console.error('❌ Could not connect to any of the database hosts.');
    process.exit(1);
  }
}

runMigration();
