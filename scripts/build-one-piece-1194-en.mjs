import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const templatePath = path.join(root, 'en', 'one-piece-chapter-1194-hiatus-returns-october-11.html');
const outputPath = path.join(root, 'en', 'one-piece-1194-zoro-vs-sommers-explained.html');
let html = fs.readFileSync(templatePath, 'utf8');

const oldTitle = 'One Piece Goes On Hiatus After Chapter 1194, Returns October 11';
const title = 'One Piece Chapter 1194: Zoro vs. Sommers Explained';
const oldSlug = 'one-piece-chapter-1194-hiatus-returns-october-11';
const slug = 'one-piece-1194-zoro-vs-sommers-explained';
const description = 'One Piece chapter 1194 recap: Zoro vs. Saint Sommers, Mihawk’s lesson, and what the chapter confirms about Zoro’s Conqueror’s Haki.';
const excerpt = 'Chapter 1194 focuses on Zoro’s fight with Saint Sommers and connects the Straw Hat swordsman’s latest breakthrough to a lesson from Dracule Mihawk.';

const body = `<p class="art-lead"><strong>One Piece chapter 1194</strong> officially released on <strong>September 27, 2026</strong>. Eiichiro Oda narrows the action at Elbaf to the fight between <strong>Roronoa Zoro and Saint Sommers</strong>, using the battle to explore the difference between possessing Conqueror’s Haki and controlling it deliberately.</p>
<p><strong>Spoiler warning:</strong> The following recap discusses major events from chapter 1194.</p>
<h2>One Piece chapter 1194 at a glance</h2>
<ul><li><strong>Official release:</strong> September 27, 2026 on VIZ; availability and local dates vary by region.</li><li><strong>Main fight:</strong> Zoro vs. Saint Sommers at Elbaf.</li><li><strong>Key characters:</strong> Zoro, Sommers, Dracule Mihawk and Perona in a flashback.</li><li><strong>Official reading:</strong> VIZ Shonen Jump and MANGA Plus where supported.</li></ul>
<figure><img src="/assets/img/real-op1194-dexerto.jpg" alt="Zoro in One Piece chapter 1194 at Elbaf" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Chapter 1194 turns Zoro’s battle with Saint Sommers into a test of control rather than raw power.</figcaption></figure>
<h2>Zoro turns a deadly fight into training</h2>
<p>Sommers can regenerate after being cut, so ordinary sword attacks do not create a lasting advantage. Zoro repeatedly closes in on vital areas without immediately finishing the fight. Sommers reads that hesitation as weakness, but Zoro is testing how to apply the right kind of Haki against an opponent whose body can recover.</p>
<p>This gives the chapter an unusual rhythm. Sommers grows increasingly frustrated as he realizes he is being used as a live training target, while Zoro remains focused on solving the problem in front of him. The challenge is no longer simply landing a stronger slash. Zoro needs to infuse his attack with enough intent and control to overcome a Holy Knight’s regeneration.</p>
<h2>Mihawk’s lesson is the heart of chapter 1194</h2>
<p>The chapter’s most valuable material comes from a flashback to Zoro’s training under <strong>Dracule Mihawk</strong>. The memory is not included only for nostalgia. It explains why Zoro can possess enormous power and still struggle to reproduce it consistently.</p>
<p>Mihawk’s lesson brings Zoro back to self-knowledge and conviction. In this framing, Conqueror’s Haki is not a meter that becomes useful simply by adding more energy. It reflects how firmly the user understands and asserts their own will.</p>
<p>That distinction fits Zoro’s development. He has already displayed Conqueror’s Haki and coated his swords with it, but chapter 1194 emphasizes the gap between releasing power under pressure and directing it on purpose. When Zoro ties on his bandana and prepares for the decisive exchange, the moment signals a clearer answer to the problem rather than a generic power boost.</p>
<h2>Has Zoro fully mastered Conqueror’s Haki?</h2>
<p><strong>The chapter does not confirm complete mastery.</strong> It shows meaningful progress in Zoro’s understanding and application, but readers should separate what appears on the page from broader fan conclusions.</p>
<p>The black lightning, Sommers’ reaction and Zoro’s change in approach all indicate that his attack has evolved. Whether he can repeat that control consistently, and whether the damage permanently bypasses Sommers’ regeneration, remain questions for later chapters.</p>
<p>Likewise, Mihawk’s knowledge of Conqueror’s Haki does <strong>not automatically confirm</strong> that he possesses it. Chapter 1194 adds material to the debate without providing a direct statement from Oda.</p>
<h2>Why Zoro vs. Sommers matters to the Elbaf arc</h2>
<p>The fight advances Elbaf on two levels. In the immediate conflict, the Straw Hats need a reliable method to counter the Holy Knights’ recovery. For Zoro personally, the battle asks him to turn a power previously associated with extreme moments into a tool he can call on intentionally.</p>
<p>If controlled Haki is the key to lasting damage, Zoro’s discovery could affect the other battles at Elbaf. It also moves him closer to his ultimate goal of surpassing Mihawk, because becoming the world’s greatest swordsman requires more than Three-Sword Style technique. It requires complete command of the will behind every strike.</p>
<h2>What chapter 1194 confirms and leaves open</h2>
<ul><li><strong>Confirmed:</strong> the chapter centers on Zoro and Sommers; Mihawk appears in a flashback; Zoro changes how he approaches Conqueror’s Haki.</li><li><strong>Not confirmed:</strong> Mihawk has Conqueror’s Haki; Sommers is permanently defeated; Zoro has achieved total mastery.</li><li><strong>Still developing:</strong> the limits of Holy Knight regeneration and whether Zoro’s new control can be repeated.</li></ul>
<h2>Where to read One Piece chapter 1194</h2>
<p>Readers can find the official chapter on <a href="https://www.viz.com/shonenjump/one-piece-chapter-1194/chapter/51430" target="_blank" rel="noopener noreferrer">VIZ Shonen Jump</a> or through the <a href="https://mangaplus.shueisha.co.jp/titles/100020" target="_blank" rel="noopener noreferrer">One Piece page on MANGA Plus</a>. Free chapter access and availability can vary by country.</p>
<p><em>Updated October 1, 2026. Primary source: VIZ Shonen Jump, cross-checked against the official One Piece listing on MANGA Plus. Interpretive passages are identified as OtaHub analysis.</em></p>`;

html = html
  .replaceAll(oldTitle, title)
  .replaceAll(oldSlug, slug)
  .replaceAll('Lin (Khanh Linh)', 'OtaHub Editorial')
  .replaceAll('/one-piece-chapter-1194-tam-ngung-tro-lai-11-10', '/one-piece-chapter-1194-spoilers-loki-uranus-elbaf')
  .replaceAll('https://otahub.asia/assets/img/real-op-chapter1194-hiatus-banner.jpg', 'https://otahub.asia/assets/img/real-op1194-dexerto.jpg')
  .replaceAll('/assets/img/real-op-chapter1194-hiatus-banner.jpg', '/assets/img/real-op1194-dexerto.jpg')
  .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${description}$2`)
  .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${description}$2`)
  .replace(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${description}$2`)
  .replace(/(<meta property="article:modified_time" content=")[^"]*(">)/, '$12026-10-01T12:00:00+07:00$2')
  .replace(/("description": ")[^"]*(")/, `$1${description}$2`)
  .replace(/("dateModified": ")[^"]*(")/, '$12026-10-01T12:00:00+07:00$2')
  .replace(/<p class="art-hero-excerpt">[\s\S]*?<\/p>/, `<p class="art-hero-excerpt">${excerpt}</p>`)
  .replace(/<span class="am-date">[^<]*<\/span>/, '<span class="am-date">2026-10-01</span>')
  .replace(/<span class="am-read">[^<]*<\/span>/, '<span class="am-read">7 min read</span>')
  .replace('<span class="am-badge">OtaHub Editorial</span>', '<a class="author-profile-link" href="/en/author/otahub"><span class="am-badge">OtaHub Editorial</span></a>')
  .replaceAll('<a href="/en/gaming" class="active">Gaming</a>', '<a href="/en/gaming">Gaming</a>')
  .replaceAll('<a href="/en/manga">Manga</a>', '<a href="/en/manga" class="active">Manga</a>')
  .replace(/<div class="hb-text">[\s\S]*?<\/div>/, '<div class="hb-text">Chapter 1194 focuses on Zoro vs. Saint Sommers and uses Mihawk’s lesson to explain the difference between possessing Conqueror’s Haki and controlling it deliberately.</div>')
  .replace(/<article class="art-body">[\s\S]*?<\/article>/, `<article class="art-body">\n${body}\n</article>`)
  .replace(/<div class="sidebar-block">\s*<div class="sb-title">Related Articles<\/div>[\s\S]*?<\/div>\s*<div class="sidebar-block">\s*<div class="sb-title">Topics<\/div>/, '<div class="sidebar-block"><div class="sb-title">Related Articles</div><a class="sb-art" href="/en/one-piece-final-saga"><img class="sb-thumb" src="/assets/img/d653b4c00a-one-piece-hero.jpg" alt="One Piece Final Saga at Elbaf" loading="lazy" width="1920" height="404"><div><div class="sb-cat">Manga</div><div class="sb-t">One Piece Final Saga: Elbaf Through Chapter 1194</div></div></a><a class="sb-art" href="/en/one-piece-chapter-1194-hiatus-returns-october-11"><img class="sb-thumb" src="/assets/img/real-op-chapter1194-hiatus-banner.jpg" alt="One Piece schedule after chapter 1194" loading="lazy" width="1200" height="675"><div><div class="sb-cat">Manga</div><div class="sb-t">One Piece Goes on Hiatus After Chapter 1194</div></div></a><a class="sb-art" href="/en/one-piece-god-valley-baad-films-announced"><img class="sb-thumb" src="/assets/img/news-one-piece-god-valley-baad-films-announced.png" alt="One Piece God Valley film" loading="lazy" width="1200" height="675"><div><div class="sb-cat">Anime</div><div class="sb-t">One Piece Announces God Valley and BAAD Films</div></div></a></div><div class="sidebar-block"><div class="sb-title">Topics</div>')
  .replace(/<div class="sb-tags">[\s\S]*?<\/div>/, '<div class="sb-tags"><a class="sb-tag" href="/tag?q=One%20Piece">One Piece</a><a class="sb-tag" href="/tag?q=Chapter%201194">Chapter 1194</a><a class="sb-tag" href="/tag?q=Roronoa%20Zoro">Roronoa Zoro</a><a class="sb-tag" href="/tag?q=Saint%20Sommers">Saint Sommers</a><a class="sb-tag" href="/tag?q=Dracule%20Mihawk">Dracule Mihawk</a><a class="sb-tag" href="/tag?q=Conquerors%20Haki">Conqueror’s Haki</a><a class="sb-tag" href="/tag?q=Elbaf">Elbaf</a></div>');

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Built ${path.relative(root, outputPath)}`);
