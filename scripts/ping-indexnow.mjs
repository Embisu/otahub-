import https from 'https';

const HOST = 'otahub.asia';
const KEY = '4c7a6e12e34149e69123b392b5d44849';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

export async function pingIndexNow(urls = []) {
  if (!urls.length) {
    urls = [`https://${HOST}/`];
  }

  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  });

  console.log(`📡 [IndexNow] Pinging ${urls.length} URLs to IndexNow API...`);

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ [IndexNow] Response status: ${res.statusCode} (${res.statusCode === 200 || res.statusCode === 202 ? 'Success/Accepted' : 'Notice'})`);
        resolve({ success: res.statusCode === 200 || res.statusCode === 202, status: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      console.warn(`⚠️ [IndexNow] Request error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

export async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`https://${HOST}/sitemap.xml`);
  const endpoints = [
    { name: 'Google', url: `https://www.google.com/ping?sitemap=${sitemapUrl}` },
    { name: 'Bing', url: `https://www.bing.com/ping?sitemap=${sitemapUrl}` }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      console.log(`📡 [Sitemap Ping] ${ep.name}: Status ${res.status}`);
    } catch (e) {
      console.log(`⚠️ [Sitemap Ping] ${ep.name} unreachable: ${e.message}`);
    }
  }
}

// If run directly via CLI
if (process.argv[1]?.endsWith('ping-indexnow.mjs')) {
  const args = process.argv.slice(2);
  const inputUrls = args.length > 0 ? args : [
    `https://${HOST}/`,
    `https://${HOST}/anime`,
    `https://${HOST}/gaming`,
    `https://${HOST}/news`
  ];

  (async () => {
    await pingIndexNow(inputUrls);
    await pingSitemaps();
  })();
}
