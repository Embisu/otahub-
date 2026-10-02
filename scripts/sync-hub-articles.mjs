// Trang chuyên mục Gaming / Anime / Manga (VI + EN): danh sách bài, nhãn lọc menu con và khối "Tiêu điểm"
// được dựng lại từ chính các bài viết, không sửa tay.
//
//   - Bài thuộc chuyên mục nào: theo <meta property="article:section"> của bài; bài "Reviews" theo loại ở trang
//     Đánh giá (game/anime/manga); vài bài ghi sai chuyên mục sửa ở HUB_OVERRIDE.
//   - Nhãn lọc (data-cat) cho từng tab menu con: phân loại theo tiêu đề + tag + slug (RULES). Tab không có bài bị ẩn.
//   - Khối Tiêu điểm của từng tab: bài mới nhất có ảnh làm bài lớn + 4 bài kế tiếp.
//
// Chạy:  node scripts/sync-hub-articles.mjs           (ghi)
//        node scripts/sync-hub-articles.mjs --check   (báo trang cần cập nhật, thoát mã 1)
import fs from 'node:fs';
import vm from 'node:vm';
import { read, write, loadReviews } from './lib/review-scores.mjs';

const CHECK = process.argv.includes('--check');
const exists = (p) => fs.existsSync(new URL('../' + p, import.meta.url));

// Bài ghi sai chuyên mục trong meta (null = không thuộc trang chuyên mục nào, vd. phim người đóng)
const HUB_OVERRIDE = {
  'jujutsu-kaisen-juju-fes-2026-anniversary': 'anime',
  'avengers-doomsday-homework-watchlist': null,
  'huong-dan': 'game'
};

// Luật phân loại tab menu con (khớp tiêu đề + tag + slug, không phân biệt hoa thường)
const R = (s) => new RegExp(s, 'i');
const RULES = {
  game: {
    review: R('review|đánh giá|metacritic \\d|chấm điểm'),
    mobile: R('mobile|android|\\bios\\b|gacha|genshin|honkai|star rail|wuthering|zenless|honor of kings|pubg mobile|free fire|liên quân|mobile legends|arknights|blue archive|nikke|solo leveling:? arise|girls.? frontline|aniimo|uma ?musume|fate/grand|pok[eé]mon go|wild rift|kaiju no\\.? ?8 the game|golden spirit|suikoden star leap|blue protocol|tower of fantasy|neverness|ananta|duet night|azur lane|epic seven|reverse: ?1999|limbus|delta force|sword of justice|where winds meet|ark nights'),
    pc: R('\\bpc\\b|stellar blade|steam|ps5|ps4|playstation|xbox|switch|nintendo|console|game pass|epic games|unreal|remaster|remake|elden|monster hunter|metal gear|silent hill|gears of war|wolverine|witcher|cyberpunk|death stranding|ghost of|split fiction|hollow knight|black myth|kingdom come|space marine|mafia|resident evil|final fantasy|persona|zelda|mario|tekken|street fighter|marvel'),
    preview: R('trailer|teaser|công bố|announce|reveal|hé lộ|lộ diện|ra mắt|sắp|preview|showcase|direct|gameplay|phát hành|release|launch|beta|demo|rò rỉ|leak|ấn định'),
    guide: R('hướng dẫn|guide|build (?:nhân vật|đồ|meta)|builds\\b|cách chơi|mẹo|tips|walkthrough|đội hình|team comp|tier ?list|nên chơi|đáng chơi|gợi ý|top \\d|best '),
    esports: R('esports|e-sports|giải đấu|tournament|championship|champions|\\bvct\\b|\\blck\\b|\\bmsi\\b|worlds|asian games|pubg asia|\\bmpl\\b|\\baic\\b|\\bevo\\b|world tour|cấm thi đấu|án cấm|tuyển thủ|chiêu mộ|đội tuyển|roster'),
    tierlist: R('tier ?list|xếp hạng nhân vật|bảng xếp hạng nhân vật')
  },
  anime: {
    'lich-chieu': R('lên sóng|phát sóng|premiere|lịch chiếu|ấn định|ngày ra mắt|ra mắt|\\bmùa \\d|season \\d|airs?\\b|air date|cour|tập cuối|công bố|chuyển thể|adaptation|announce|teaser|trailer|visual|20(26|27)'),
    review: R('review|đánh giá'),
    action: R('hành động|action|shonen|shōnen|jujutsu|one piece|naruto|boruto|bleach|demon slayer|kimetsu|chainsaw|my hero|black clover|solo leveling|kaiju|dandadan|sakamoto|hunter x hunter|tokyo revengers|attack on titan|haikyu|blue lock|dragon ball|tougen anki|fire force|hell.?s paradise|jigokuraku|gachiakuta|kagurabachi|undead unluck|psyren|mob psycho|one punch|fist of the north|chained soldier|black torch|wind breaker|mashle|blue exorcist'),
    isekai: R('isekai|fantasy|giả tưởng|re:? ?zero|mushoku|konosuba|slime|frieren|overlord|reincarnat|tensei|chuyển sinh|dị giới|\\bsword|witch|phù thủy|magic|ma thuật|apothecary|dược sư|dungeon|hầm ngục|wistoria|danmachi|shield hero|skeleton knight|rayearth|hell mode|black clover'),
    news: R('movie|the movie|phim điện ảnh|điện ảnh|chiếu rạp|ra rạp|box office|doanh thu|\\bfilm\\b|theatrical|cinema')
  },
  manga: {
    shonen: R('jump|shonen|shōnen|one piece|jujutsu|chainsaw|kagurabachi|sakamoto|dandadan|undead unluck|black clover|my hero|horikoshi|boruto|kaiju|blue box|witch watch|shueisha|hunter x hunter|ichigoki|nue|akane|ao no hako|gachiakuta|me & roboco|elusive samurai|nige jouzu'),
    manhwa: R('manhwa|webtoon|manhua|solo leveling|beginning after the end|tbate|omniscient|tower of god|naver|kakao|tapas|battle through|martial peak|swallowed star|second life ranker|god of blackfield|wu shen|urban immortal'),
    reviews: R('review|đánh giá'),
    seinen: R('seinen|berserk|vagabond|vinland|monster|kingdom|golden kamuy|dungeon meshi|blame|gantz|tokyo ghoul|20th century|look back|goodnight punpun|oishinbo|blue period'),
    spoilers: R('spoiler|chương \\d|chapter \\d|chương cuối|phát hành|release|tập \\d|volume|vol\\.|viz|manga plus|kết thúc|hoàn kết|tạm ngưng|hiatus|oneshot|one-shot|trở lại|lịch ra')
  }
};
// Nhãn hiển thị trên thẻ: tab ưu tiên đầu tiên khớp
const TAG = {
  vi: { game: [['review', 'Đánh giá', 'ta'], ['esports', 'Esports', 'tv'], ['tierlist', 'Tier list', 'ta'], ['guide', 'Hướng dẫn', 'tg'], ['mobile', 'Mobile', 'tg'], ['preview', 'Sắp ra mắt', 'tc'], ['pc', 'PC / Console', 'tc']],
        anime: [['review', 'Đánh giá', 'ta'], ['news', 'Chiếu rạp', 'tc'], ['lich-chieu', 'Lịch chiếu', 'ts'], ['action', 'Shonen', 'tv'], ['isekai', 'Fantasy', 'tg']],
        manga: [['reviews', 'Đánh giá', 'ta'], ['manhwa', 'Manhwa', 'tg'], ['spoilers', 'Chương mới', 'ts'], ['shonen', 'Shonen Jump', 'tc'], ['seinen', 'Seinen', 'tv']] },
  en: { game: [['review', 'Review', 'ta'], ['esports', 'Esports', 'tv'], ['tierlist', 'Tier list', 'ta'], ['guide', 'Guide', 'tg'], ['mobile', 'Mobile', 'tg'], ['preview', 'Upcoming', 'tc'], ['pc', 'PC / Console', 'tc']],
        anime: [['review', 'Review', 'ta'], ['news', 'Film', 'tc'], ['lich-chieu', 'Schedule', 'ts'], ['action', 'Shonen', 'tv'], ['isekai', 'Fantasy', 'tg']],
        manga: [['reviews', 'Review', 'ta'], ['manhwa', 'Manhwa', 'tg'], ['spoilers', 'New chapter', 'ts'], ['shonen', 'Shonen Jump', 'tc'], ['seinen', 'Seinen', 'tv']] }
};
const HUB_LABEL = { vi: { game: 'Gaming', anime: 'Anime', manga: 'Manga' }, en: { game: 'Gaming', anime: 'Anime', manga: 'Manga' } };
const PAGES = [
  { file: 'gaming.html', hub: 'game', lang: 'vi', p: 'gaming', fn: 'setGamingFilter', data: 'GAMING_FEATURED_DATA' },
  { file: 'anime.html', hub: 'anime', lang: 'vi', p: 'anime', fn: 'setAnimeFilter', data: 'ANIME_FEATURED_DATA' },
  { file: 'manga.html', hub: 'manga', lang: 'vi', p: 'manga', fn: 'setMangaFilter', data: 'MANGA_FEATURED_DATA' },
  { file: 'en/gaming.html', hub: 'game', lang: 'en', p: 'gaming', fn: 'setGamingFilter', data: 'GAMING_FEATURED_DATA' },
  { file: 'en/anime.html', hub: 'anime', lang: 'en', p: 'anime', fn: 'setAnimeFilter', data: 'ANIME_FEATURED_DATA' },
  { file: 'en/manga.html', hub: 'manga', lang: 'en', p: 'manga', fn: 'setMangaFilter', data: 'MANGA_FEATURED_DATA' }
];
// Tab "Mùa Hè 2026" đã hết mùa -> tab bền vững "Lịch chiếu & Công bố"
const RENAME_TAB = { 'mua-he-2026': ['lich-chieu', { vi: 'Lịch chiếu & Công bố', en: 'Schedule & Announcements' }] };
const NEW_SECTITLE = { 'lich-chieu': { vi: 'Lịch chiếu <em>&amp; Công bố</em>', en: 'Schedule <em>&amp; Announcements</em>' } };

// ---------- đọc bài ----------
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const reviewType = new Map();
for (const f of ['reviews.html', 'en/reviews.html']) for (const r of loadReviews(f)) reviewType.set(String(r.url).split('?')[0], r.type);

function loadArticles() {
  const files = [...fs.readdirSync(new URL('../', import.meta.url)).filter((f) => f.endsWith('.html')),
    ...fs.readdirSync(new URL('../en/', import.meta.url)).filter((f) => f.endsWith('.html')).map((f) => 'en/' + f)];
  const out = [];
  for (const f of files) {
    if (/^(en\/)?(admin|article|bai-viet)\.html$/.test(f)) continue;
    const s = read(f);
    const pt = s.match(/<meta property="article:published_time" content="([^"]+)"/);
    if (!pt) continue;
    if (/<meta name="robots" content="[^"]*noindex/.test(s)) continue;
    const g = (re) => unesc((s.match(re) || [])[1] || '');
    const slug = f.replace(/^en\//, '').replace(/\.html$/, '');
    const url = '/' + f.replace(/\.html$/, '');
    const sec = g(/<meta property="article:section" content="([^"]*)"/);
    let hub = { Gaming: 'game', Anime: 'anime', Manga: 'manga' }[sec];
    if (sec === 'Reviews') hub = reviewType.get(url) || null;
    if (slug in HUB_OVERRIDE) hub = HUB_OVERRIDE[slug];
    if (!hub) continue;
    const title = g(/<meta property="og:title" content="([^"]*)"/).replace(/\s*·\s*OtaHub.*$/, '') || g(/<h1[^>]*>([^<]*)/);
    const ogImg = g(/<meta property="og:image" content="([^"]*)"/).replace(/^https:\/\/otahub\.asia/, '');
    const mins = (s.match(/(\d+)\s*(?:phút đọc|min read|phút)/) || [])[1];
    out.push({ f, url, slug, en: f.startsWith('en/'), hub, sec, date: pt[1], title,
      desc: g(/<meta name="description" content="([^"]*)"/), img: ogImg && exists(ogImg.slice(1).split('?')[0]) ? ogImg : '',
      author: g(/<meta name="author" content="([^"]*)"/) || 'OtaHub Editorial', mins: mins ? +mins : null, hay: [title, slug.replace(/-/g, ' ')].join(' ') });
  }
  return out;
}
const thumb = (u) => {
  const p = (u || '').split('?')[0];
  if (!/^\/assets\/img\/(?!_[ts]\/)[^?#]+\.(jpe?g|png|webp|jfif)$/i.test(p)) return u;
  const t = '/assets/img/_t/' + p.slice(12) + '.webp';
  return exists(t.slice(1)) ? t : u;
};
const fmtDate = (iso, lang, short) => {
  const d = new Date(iso);
  if (lang === 'en') return d.toLocaleDateString('en-US', short ? { month: 'short', day: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' } : { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
  const v = new Date(d.getTime() + 7 * 3600e3);
  const dd = String(v.getUTCDate()).padStart(2, '0'), mm = String(v.getUTCMonth() + 1).padStart(2, '0');
  return short ? `${dd}/${mm}` : `${dd}/${mm}/${v.getUTCFullYear()}`;
};

// ---------- dựng trang ----------
function tabsOf(html, fn) {
  return [...html.matchAll(new RegExp(`<button class="ftab[^"]*"[^>]*onclick="${fn}\\(this,'([^']+)'\\)"[^>]*>`, 'g'))].map((m) => m[1]);
}
function cats(a, hub, tabs) {
  const c = tabs.filter((t) => t !== 'all' && t !== 'pc' && RULES[hub][t] && RULES[hub][t].test(a.hay));
  // PC / Console: game PC/console rõ ràng, hoặc bài game không phải mobile / esports / đồ chơi, thẻ bài, hội chợ
  const notGame = /lego|thẻ pok[eé]mon|pok[eé]mon card|games expo|hamlet/i.test(a.hay);
  if (hub === 'game' && tabs.includes('pc') && (RULES.game.pc.test(a.hay) || !(RULES.game.mobile.test(a.hay) || RULES.game.esports.test(a.hay) || notGame))) c.push('pc');
  return c;
}
function tagOf(a, hub, lang, c) {
  const hit = TAG[lang][hub].find(([k]) => c.includes(k));
  return hit ? { label: hit[1], cls: hit[2] } : { label: HUB_LABEL[lang][hub], cls: 'tc' };
}
function card(a, hub, lang, c, style) {
  const t = tagOf(a, hub, lang, c);
  const img = thumb(a.img) || '/assets/img/placeholder.svg';
  const minsTxt = a.mins ? (lang === 'en' ? `${a.mins} min` : `${a.mins} phút`) : '';
  if (style === 'manga') {
    return `<a href="${a.url}" class="ac" data-cat="${c.join(' ')}">
          <div class="ac-thumb"><img src="${esc(img)}" alt="${esc(a.title)}" loading="lazy" width="640" height="360"></div>
          <div class="ac-info"><div><div class="ac-tags"><span class="tag ${t.cls}">${esc(t.label)}</span></div><div class="ac-title">${esc(a.title)}</div></div><div class="ac-meta"><span>${esc(a.author)} · ${fmtDate(a.date, lang)}</span></div></div>
        </a>`;
  }
  return `<a href="${a.url}" class="ac" data-cat="${c.join(' ')}">
          <div class="ac-thumb"><img src="${esc(img)}" alt="${esc(a.title)}" loading="lazy" width="640" height="360"><span class="tag">${esc(t.label)}</span></div>
          <div class="ac-info"><div><div class="ac-top"><span class="tag ${t.cls}">${esc(t.label)}</span></div><div class="ac-title">${esc(a.title)}</div></div><div class="ac-meta"><span>${esc(a.author)}</span><span class="ac-meta-sep">·</span><span>${fmtDate(a.date, lang)}</span>${minsTxt ? `<span class="ac-meta-sep">·</span><span>${minsTxt}</span>` : ''}</div></div>
        </a>`;
}
const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

function syncPage(P, articles) {
  let html = read(P.file);
  const before = html;
  // tab menu con: đổi tab hết mùa
  for (const [oldKey, [newKey, label]] of Object.entries(RENAME_TAB)) {
    html = html.replace(new RegExp(`(<button class="ftab[^"]*"[^>]*onclick="${P.fn}\\(this,')${oldKey}('\\)"[^>]*>)[^<]*(</button>)`), `$1${newKey}$2${label[P.lang]}$3`);
  }
  const tabs = tabsOf(html, P.fn);
  const list = articles.filter((a) => a.hub === P.hub && a.en === (P.lang === 'en')).sort((a, b) => (a.date < b.date ? 1 : -1));
  const style = /<!-- ADMIN:ARTICLES_START -->[\s\S]*?class="ac-tags"/.test(html) ? 'manga' : 'default';
  const withCats = list.map((a) => ({ a, c: cats(a, P.hub, tabs) }));
  // 1) danh sách bài
  html = html.replace(/(<!-- ADMIN:ARTICLES_START -->)[\s\S]*?(<!-- ADMIN:ARTICLES_END -->)/,
    (m, s1, s2) => `${s1}\n        ${withCats.map(({ a, c }) => card(a, P.hub, P.lang, c, style)).join('\n        ')}\n      ${s2}`);
  // 2) ẩn tab không có bài
  const count = Object.fromEntries(tabs.map((t) => [t, t === 'all' ? list.length : withCats.filter((x) => x.c.includes(t)).length]));
  html = html.replace(new RegExp(`<button class="ftab([^"]*)"([^>]*)onclick="${P.fn}\\(this,'([^']+)'\\)"([^>]*)>`, 'g'), (m, cls, pre, key, post) => {
    const attrs = (pre + post).replace(/\s*hidden(="[^"]*")?/g, '');
    return `<button class="ftab${cls}"${attrs.trimEnd() ? ' ' + attrs.trim() : ''} onclick="${P.fn}(this,'${key}')"${count[key] ? '' : ' hidden'}>`;
  });
  // 3) khối Tiêu điểm theo từng tab
  const dm = html.match(new RegExp(`var ${P.data} = (\\{[\\s\\S]*?\\n\\});`));
  if (!dm) throw new Error(`${P.file}: thiếu ${P.data}`);
  const scope = {}; vm.runInNewContext('d=' + dm[1], scope);
  const old = scope.d;
  const tagLine = (a, c) => tagOf(a, P.hub, P.lang, c);
  const feat = {};
  for (const key of tabs) {
    const pool = withCats.filter((x) => x.a.img && (key === 'all' || x.c.includes(key)));
    if (!pool.length) continue;
    const [h, ...rest] = pool.slice(0, 5);
    const ht = tagLine(h.a, h.c);
    feat[key] = {
      secTitle: (NEW_SECTITLE[key] || {})[P.lang] || (old[key] && old[key].secTitle) || old.all.secTitle,
      hero: { url: h.a.url, img: h.a.img, tag: ht.label, tagClass: ht.cls, title: h.a.title, sub: h.a.desc, meta: `${h.a.author} · ${fmtDate(h.a.date, P.lang)}` },
      sides: rest.map(({ a, c }) => { const t = tagLine(a, c); return { url: a.url, img: thumb(a.img), tag: t.label, tagClass: t.cls, title: a.title, meta: `${a.author} · ${fmtDate(a.date, P.lang, true)}` }; })
    };
  }
  const body = Object.entries(feat).map(([k, v]) => `  ${JSON.stringify(k)}: ${js(v)}`).join(',\n');
  html = html.replace(dm[0], () => `var ${P.data} = {\n${body}\n};`);
  // 4) khối Tiêu điểm tĩnh (lần tải đầu / máy tìm kiếm) = tab "Tất cả"
  const A = feat.all, p = P.p;
  if (A) {
    const setAttr = (id, attr, val) => { html = html.replace(new RegExp(`(<[^>]*\\bid="${id}"[^>]*?\\b${attr}=")[^"]*(")`), `$1${val}$2`).replace(new RegExp(`(<[^>]*\\b${attr}=")[^"]*("[^>]*\\bid="${id}")`), `$1${val}$2`); };
    const setText = (id, val) => { html = html.replace(new RegExp(`(<([a-z0-9]+)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`), (m, open, tag, close) => open + val + close); };
    setAttr(`${p}HeroCard`, 'href', A.hero.url);
    html = html.replace(new RegExp(`(id="${p}HeroImg" style="background-image:url\\()[^)]*(\\))`), `$1${A.hero.img}$2`);
    setText(`${p}HeroTag`, esc(A.hero.tag)); setAttr(`${p}HeroTag`, 'class', 'tag ' + A.hero.tagClass);
    setText(`${p}HeroTitle`, esc(A.hero.title)); setText(`${p}HeroSub`, esc(A.hero.sub)); setText(`${p}HeroMeta`, esc(A.hero.meta));
    A.sides.forEach((s, i) => {
      setAttr(`${p}SideCard${i}`, 'href', s.url); setAttr(`${p}SideImg${i}`, 'src', s.img); setAttr(`${p}SideImg${i}`, 'alt', esc(s.title));
      setText(`${p}SideTag${i}`, esc(s.tag)); setAttr(`${p}SideTag${i}`, 'class', 'tag ' + s.tagClass);
      setText(`${p}SideTitle${i}`, esc(s.title)); setText(`${p}SideMeta${i}`, esc(s.meta));
    });
  }
  const summary = tabs.map((t) => `${t}:${count[t]}`).join(' ');
  if (html !== before) { if (!CHECK) write(P.file, html); }
  console.log(`${P.file}: ${list.length} bài · ${summary}${html !== before ? (CHECK ? ' (cần cập nhật)' : ' (đã ghi)') : ''}`);
  return html !== before;
}

const articles = loadArticles();
let changed = 0;
for (const P of PAGES) if (syncPage(P, articles)) changed++;
if (CHECK && changed) process.exitCode = 1;
