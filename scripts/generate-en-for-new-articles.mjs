import fs from 'fs';
import path from 'path';

console.log('Generating English versions for 4 recent articles...');

// 1. Article 1: Shakespeare GTA
const gtaEnSlug = 'when-gta-becomes-a-stage-for-shakespeare-in-grand-theft-hamlet';
const gtaViSlug = 'khi-gta-tro-thanh-san-khau-cho-shakespeare-trong-grand-theft';

const gtaEnHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<title>When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet · OtaHub</title>
<link rel="alternate" hreflang="vi" href="https://otahub.asia/${gtaViSlug}">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${gtaEnSlug}">
<link rel="alternate" hreflang="x-default" href="https://otahub.asia/${gtaViSlug}">
<link rel="canonical" href="https://otahub.asia/en/${gtaEnSlug}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="An unprecedented documentary turns the chaotic world of Grand Theft Auto Online into an open stage for William Shakespeare's Hamlet, exploring how virtual spaces become cinematic art.">
<meta name="focus-keyword" content="gta online">
<meta name="author" content="OtaHub Editorial">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet · OtaHub">
<meta property="og:description" content="An unprecedented documentary turns the chaotic world of Grand Theft Auto Online into an open stage for William Shakespeare's Hamlet, exploring how virtual spaces become cinematic art.">
<meta property="og:url" content="https://otahub.asia/en/${gtaEnSlug}">
<meta property="og:image" content="https://otahub.asia/assets/img/uploads/l17gb64r-gta.webp">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="OtaHub Editorial">
<meta property="article:published_time" content="2026-09-28T06:48:49.126Z">
<meta property="article:modified_time" content="2026-09-28T06:48:49.126Z">
<meta property="article:section" content="Gaming">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet · OtaHub">
<meta name="twitter:description" content="An unprecedented documentary turns the chaotic world of Grand Theft Auto Online into an open stage for William Shakespeare's Hamlet, exploring how virtual spaces become cinematic art.">
<meta name="twitter:image" content="https://otahub.asia/assets/img/uploads/l17gb64r-gta.webp">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet",
  "description": "An unprecedented documentary turns the chaotic world of Grand Theft Auto Online into an open stage for William Shakespeare's Hamlet, exploring how virtual spaces become cinematic art.",
  "image": "https://otahub.asia/assets/img/uploads/l17gb64r-gta.webp",
  "datePublished": "2026-09-28T06:48:49.126Z",
  "dateModified": "2026-09-28T06:48:49.126Z",
  "inLanguage": "en",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://otahub.asia/en/${gtaEnSlug}" },
  "author": {
    "@type": "Person",
    "name": "OtaHub Editorial",
    "url": "https://otahub.asia/en/about",
    "jobTitle": "Editorial Board",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://otahub.asia/#organization",
      "name": "OtaHub",
      "url": "https://otahub.asia"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://otahub.asia/#organization",
    "name": "OtaHub",
    "url": "https://otahub.asia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://otahub.asia/favicon-192.png"
    }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://otahub.asia/en/" },
    { "@type": "ListItem", "position": 2, "name": "Gaming", "item": "https://otahub.asia/en/gaming" },
    { "@type": "ListItem", "position": 3, "name": "When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet", "item": "https://otahub.asia/en/${gtaEnSlug}" }
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="manifest" href="/manifest.json">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-12852ZFD0K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-12852ZFD0K');
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
<link rel="stylesheet" href="/assets/article-style.css?v=20261002c">
</head>
<body>

<div class="search-overlay" id="searchOverlay">
  <div class="search-box">
    <input class="search-input" id="searchInput" type="text" placeholder="Search gaming, anime, manga...">
    <button class="search-close" onclick="closeSearch()">✕</button>
  </div>
  <div class="search-hint">Press ESC to close · Ctrl+K to search</div>
  <div class="search-tags">
    <a href="/en/gaming" class="stag">Gaming</a>
    <a href="/en/anime" class="stag">Anime</a>
    <a href="/en/manga" class="stag">Manga</a>
    <a href="/en/reviews" class="stag">Reviews</a>
    <a href="/en/rankings" class="stag">Rankings</a>
  </div>
</div>
<div id="amb"><div class="orb o1"></div><div class="orb o2"></div></div>
<div id="gtex"></div>
<nav class="nav"><div class="nav-in"><a class="logo" href="/en/"><span><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.05)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="5" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="5" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect></svg></span><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><ul class="nav-links"><li><a href="/en/choi-gi">Play What?</a></li><li><a href="/en/gaming" class="active">Gaming</a></li><li><a href="/en/anime">Anime</a></li><li><a href="/en/manga">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li><li><a href="/en/in-depth">Deep Dive</a></li></ul><button class="ham" id="ham" aria-label="Menu" onclick="toggleMob()"><span></span><span></span><span></span></button><div class="nav-r"><button class="nsearch" aria-label="Search" onclick="openSearch()"><svg width="14" height="14" viewbox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><a href="/en/#newsletter" class="cta" id="cta-sub">Subscribe</a></div></div></nav>
<nav class="mobile-nav" id="mobnav"><a href="/en/choi-gi">Play What?</a><a href="/en/gaming" class="active">Gaming</a><a href="/en/anime">Anime</a><a href="/en/manga">Manga</a><a href="/en/reviews">Reviews</a><a href="/en/rankings">Rankings</a><a href="/en/in-depth">Deep Dive</a><div class="m-sub"><a href="/en/about">About</a><a href="/en/#newsletter">Newsletter</a><a href="/en/about#contact">Contact</a></div></nav>

<section class="art-hero">
<div class="art-hero-img" style="background-image:url('/assets/img/uploads/l17gb64r-gta.webp');background-position:center 50%;background-color:#0b0418;"></div>
<div class="art-hero-grad"></div>
<div class="art-hero-content">
<span class="art-hero-cat">Gaming</span>
<h1 class="art-hero-title">When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet</h1>
<p class="art-hero-excerpt">A groundbreaking documentary turns the gunfire, crime, and chaotic open world of Grand Theft Auto Online into an authentic stage for William Shakespeare's Hamlet, proving video games can transcend entertainment into powerful cinematic mediums.</p>
</div>
</section>

<div class="art-layout">
<main class="art-main">
<nav class="breadcrumb" aria-label="breadcrumb">
<a href="/en/">Home</a>
<span class="breadcrumb-sep">›</span>
<a href="/en/gaming" class="active">Gaming</a>
<span class="breadcrumb-sep">›</span>
<span>When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet</span>
</nav>

<div class="art-meta">
<span class="am-tag">Gaming</span>
<span class="am-sep"></span>
<span class="am-date">2026-09-28</span>
<span class="am-sep"></span>
<span class="am-read">5 min read</span>
<span class="am-sep"></span>
<span class="am-badge">OtaHub Editorial</span>
</div>

<div class="highlight-box">
<div class="hb-label">SUMMARY</div>
<div class="hb-text"><em>Grand Theft Hamlet</em> transforms the chaotic, bullet-riddled streets of Los Santos into a live Shakespearean playhouse. Directed by Pinny Grylls alongside actors Sam Crane and Mark Oosterveen, the SXSW-winning film explores how lockdown isolation catalyzed an inspiring experiment in virtual theatrical storytelling.</div>
</div>

<article class="art-body">
<h2>From Lockdown Solitude to an In-Game Stage</h2>
<figure><img alt="When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet" src="/assets/img/uploads/inline-mukw9trp-1.jpg" width="554" height="554"></figure>
<p>The story began in early 2021, when the United Kingdom entered severe pandemic lockdowns. With physical theaters shuttered and performers left unemployed, British stage actors Sam Crane and Mark Oosterveen sought escape in <em>Grand Theft Auto Online</em>. Rather than merely engaging in standard heists, the pair realized that the sprawling world of Los Santos offered fertile ground for roleplaying and theatrical improvisation.</p>
<p>The vision took shape when they discovered an outdoor amphitheater inside the game. What began as a playful reading evolved into an ambitious undertaking: holding in-game auditions, rehearsing lines with strangers, and staging a full-length production of <em>Hamlet</em> within a notoriously volatile online multiplayer landscape.</p>
<p>Los Santos, famous for drive-bys, helicopter chases, and rampant destruction, proved an unexpectedly fitting backdrop for Hamlet—a tragedy steeped in betrayal, political corruption, and violent death.</p>

<h2>Staging Shakespeare Amidst Digital Mayhem</h2>
<p>The greatest hurdle was the inherent unpredictability of the shared online environment. In GTA Online, no server guarantees that other players will pause their firefights to watch a monologue.</p>
<p>Throughout rehearsals, cast members were routinely sniped, run over by supercars, or attacked by roving griefers mid-soliloquy. Rather than ruining the project, this organic chaos became integral to the film's charm and authenticity.</p>
<p>To assemble their troupe, Crane and Oosterveen hosted open auditions inside virtual parking lots and safehouses, recruiting fellow isolated gamers from across the globe. Costuming was solved through GTA's character customization suite, pairing classic tragic lines with modern streetwear and aviator sunglasses.</p>

<h2>Shot Entirely Inside GTA Online</h2>
<p>What elevates <em>Grand Theft Hamlet</em> beyond a novelty stream is its cinematic execution. Rather than capturing raw gameplay UI, co-director and documentary filmmaker Pinny Grylls used GTA's in-game smartphone camera to achieve close-ups, dynamic pan shots, and authentic depth of field.</p>
<p>Crucially, the production avoided private modded servers, deliberately embracing the hazards and serendipity of public GTA sessions. The resulting 91-minute feature blurs the boundaries between documentary, machinima, and theatrical drama.</p>

<h2>When Gameplay Becomes a Canvas for Art</h2>
<figure><img alt="When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet" src="/assets/img/uploads/inline-mukw9wam-2.jpg" width="576" height="324"></figure>
<p>Beyond its comedic triumphs, <em>Grand Theft Hamlet</em> reflects the human drive to connect and create during periods of forced isolation. Winning the prestigious Best Documentary Feature award at SXSW 2024, the film offers compelling evidence that virtual worlds are no longer just games—they are dynamic public squares and legitimate storytelling canvases.</p>
<p>In this singular experiment, Los Santos was granted an unexpected new legacy: serving as the stage for Denmark's tragic prince.</p>
<p><b>Source: Curated Editorial</b></p>
</article>

<div class="share-row">
<span class="share-lbl">Share:</span>
<button class="share-btn" type="button" onclick="copyArticleLink(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>Copy link</button>
<a class="share-btn" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fotahub.asia%2Fen%2F${gtaEnSlug}&amp;text=When%20GTA%20Becomes%20a%20Stage%20for%20Shakespeare%20in%20Grand%20Theft%20Hamlet" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>X (Twitter)</a>
<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fotahub.asia%2Fen%2F${gtaEnSlug}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>Facebook</a>
</div>
</main>

<aside class="art-sidebar">
<div class="sidebar-block">
<div class="sb-title">Related Articles</div>
<a class="sb-art" href="/en/monster-hunter-wilds-review"><img class="sb-thumb" src="/assets/img/monster-hunter-wilds-review-hero.jpg" alt="Monster Hunter Wilds" loading="lazy" width="76" height="60"><div><div class="sb-cat">Reviews</div><div class="sb-t">Monster Hunter Wilds Review: Next-Gen Hunting Peak 9.4 Score</div></div></a>
<a class="sb-art" href="/en/demon-slayer-infinity-castle-793-million-box-office"><img class="sb-thumb" src="/assets/img/5418135572-demon-slayer-infinity-castle-review-hero.jpg" alt="Demon Slayer" loading="lazy" width="76" height="60"><div><div class="sb-cat">Anime</div><div class="sb-t">Demon Slayer: Infinity Castle Hits Historic $793M Worldwide</div></div></a>
<a class="sb-art" href="/en/gta6-preview"><img class="sb-thumb" src="/assets/img/news-gta6-gameplay-trailer-leonida.jpg" alt="GTA 6" loading="lazy" width="76" height="60"><div><div class="sb-cat">Gaming</div><div class="sb-t">GTA 6: Next-Gen Vice City Open World &amp; Launch Details</div></div></a>
</div>
<div class="sidebar-block">
<div class="sb-title">Topics</div>
<div class="sb-tags"><a class="sb-tag" href="/en/gaming">Gaming</a><a class="sb-tag" href="/en/gaming">GTA Online</a><a class="sb-tag" href="/en/gaming">Rockstar Games</a><a class="sb-tag" href="/en/gaming">Cinema</a><a class="sb-tag" href="/en/gaming">PC</a><a class="sb-tag" href="/en/gaming">Steam</a></div>
</div>
</aside>
</div>

<footer><div class="ft-in"><div><a href="/en/" class="logo" style="display:inline-flex"><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.04)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect></svg><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><p class="ft-desc">Asia's Premier Gaming, Anime &amp; Pop-Culture Hub. Fast, in-depth, unbiased.</p></div><div><div class="ft-h">Sections</div><ul class="ft-links"><li><a href="/en/gaming" class="active">Gaming</a></li><li><a href="/en/anime">Anime</a></li><li><a href="/en/manga">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li></ul></div><div><div class="ft-h">About OtaHub</div><ul class="ft-links"><li><a href="/en/about">About Us</a></li><li><a href="/en/about#team">Editorial Team</a></li><li><a href="/en/about#contact">Contact</a></li><li><a href="/en/#newsletter">Newsletter</a></li></ul></div><div><div class="ft-h">Follow</div><ul class="ft-links"><li><a href="/feed.xml">RSS Feed</a></li></ul></div></div><div class="ft-bot"><span class="ft-copy">© 2026 OtaHub.asia · Asia's Gaming &amp; Anime Hub<br><span style="opacity:.75;font-size:12px">Operated by ANBU Media &amp; Marketing LLC · Tax ID 3301761892 · <a href="mailto:dat.phan@anbu.asia" style="color:inherit">dat.phan@anbu.asia</a></span></span></div></footer>

<script>
function toggleMob(){
  var h=document.getElementById('ham');
  var m=document.getElementById('mobnav');
  if(!m)return;
  var open=m.classList.toggle('open');
  if(h)h.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function openSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.add('open');setTimeout(function(){var i=document.getElementById('searchInput');if(i)i.focus();},50);document.body.style.overflow='hidden';}}
function closeSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.remove('open');var i=document.getElementById('searchInput');if(i)i.value='';document.body.style.overflow='';}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}});
var _sO=document.getElementById('searchOverlay');if(_sO){_sO.addEventListener('click',function(e){if(e.target===this)closeSearch();});}
function copyArticleLink(button){
  navigator.clipboard.writeText(location.href).then(function(){
    var original = button.textContent;
    button.textContent = "Copied link";
    setTimeout(function(){ button.textContent = original; }, 1800);
  });
}
</script>
<script defer src="/assets/search-redirect.js"></script>
<script defer src="/assets/enhance.js?v=20261002d"></script>
<script defer src="/assets/lang-switch.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join('en', `${gtaEnSlug}.html`), gtaEnHtml, 'utf8');
console.log(`Created en/${gtaEnSlug}.html`);

// Update VI file to link to EN
let gtaViContent = fs.readFileSync(`${gtaViSlug}.html`, 'utf8');
if (!gtaViContent.includes(`hreflang="en"`)) {
  gtaViContent = gtaViContent.replace(
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${gtaViSlug}">`,
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${gtaViSlug}">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${gtaEnSlug}">`
  );
  if (!gtaViContent.includes('/assets/lang-switch.js')) {
    gtaViContent = gtaViContent.replace('</body>', '<script defer src="/assets/lang-switch.js"></script>\n</body>');
  }
  fs.writeFileSync(`${gtaViSlug}.html`, gtaViContent, 'utf8');
  console.log(`Updated hreflang in ${gtaViSlug}.html`);
}

// 2. Article 2: Roman Sands
const romanEnSlug = 'roman-sands-re-build-trapped-in-a-collapsing-vaporwave-nightmare';
const romanViSlug = 'roman-sands-re-build-mac-ket-trong-giac-mo-vaporwave-dang-da';

const romanEnHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<title>Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare · OtaHub</title>
<link rel="alternate" hreflang="vi" href="https://otahub.asia/${romanViSlug}">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${romanEnSlug}">
<link rel="alternate" hreflang="x-default" href="https://otahub.asia/${romanViSlug}">
<link rel="canonical" href="https://otahub.asia/en/${romanEnSlug}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Roman Sands RE:Build combines time loops, service labor satire, vaporwave nostalgia, and psychological horror into one of the year's most bizarre indie experiences.">
<meta name="focus-keyword" content="roman sands re:build">
<meta name="author" content="OtaHub Editorial">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare · OtaHub">
<meta property="og:description" content="Roman Sands RE:Build combines time loops, service labor satire, vaporwave nostalgia, and psychological horror into one of the year's most bizarre indie experiences.">
<meta property="og:url" content="https://otahub.asia/en/${romanEnSlug}">
<meta property="og:image" content="https://otahub.asia/assets/img/uploads/m4495rif-capsule-616x353.jpg">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="OtaHub Editorial">
<meta property="article:published_time" content="2026-09-28T07:06:14.992Z">
<meta property="article:modified_time" content="2026-09-28T07:06:14.992Z">
<meta property="article:section" content="Gaming">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare · OtaHub">
<meta name="twitter:description" content="Roman Sands RE:Build combines time loops, service labor satire, vaporwave nostalgia, and psychological horror into one of the year's most bizarre indie experiences.">
<meta name="twitter:image" content="https://otahub.asia/assets/img/uploads/m4495rif-capsule-616x353.jpg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare",
  "description": "Roman Sands RE:Build combines time loops, service labor satire, vaporwave nostalgia, and psychological horror into one of the year's most bizarre indie experiences.",
  "image": "https://otahub.asia/assets/img/uploads/m4495rif-capsule-616x353.jpg",
  "datePublished": "2026-09-28T07:06:14.992Z",
  "dateModified": "2026-09-28T07:06:14.992Z",
  "inLanguage": "en",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://otahub.asia/en/${romanEnSlug}" },
  "author": {
    "@type": "Person",
    "name": "OtaHub Editorial",
    "url": "https://otahub.asia/en/about",
    "jobTitle": "Editorial Board",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://otahub.asia/#organization",
      "name": "OtaHub",
      "url": "https://otahub.asia"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://otahub.asia/#organization",
    "name": "OtaHub",
    "url": "https://otahub.asia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://otahub.asia/favicon-192.png"
    }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://otahub.asia/en/" },
    { "@type": "ListItem", "position": 2, "name": "Gaming", "item": "https://otahub.asia/en/gaming" },
    { "@type": "ListItem", "position": 3, "name": "Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare", "item": "https://otahub.asia/en/${romanEnSlug}" }
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="manifest" href="/manifest.json">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-12852ZFD0K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-12852ZFD0K');
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
<link rel="stylesheet" href="/assets/article-style.css?v=20261002c">
</head>
<body>

<div class="search-overlay" id="searchOverlay">
  <div class="search-box">
    <input class="search-input" id="searchInput" type="text" placeholder="Search gaming, anime, manga...">
    <button class="search-close" onclick="closeSearch()">✕</button>
  </div>
  <div class="search-hint">Press ESC to close · Ctrl+K to search</div>
  <div class="search-tags">
    <a href="/en/gaming" class="stag">Gaming</a>
    <a href="/en/anime" class="stag">Anime</a>
    <a href="/en/manga" class="stag">Manga</a>
    <a href="/en/reviews" class="stag">Reviews</a>
    <a href="/en/rankings" class="stag">Rankings</a>
  </div>
</div>
<div id="amb"><div class="orb o1"></div><div class="orb o2"></div></div>
<div id="gtex"></div>
<nav class="nav"><div class="nav-in"><a class="logo" href="/en/"><span><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.05)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="5" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="5" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect></svg></span><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><ul class="nav-links"><li><a href="/en/choi-gi">Play What?</a></li><li><a href="/en/gaming" class="active">Gaming</a></li><li><a href="/en/anime">Anime</a></li><li><a href="/en/manga">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li><li><a href="/en/in-depth">Deep Dive</a></li></ul><button class="ham" id="ham" aria-label="Menu" onclick="toggleMob()"><span></span><span></span><span></span></button><div class="nav-r"><button class="nsearch" aria-label="Search" onclick="openSearch()"><svg width="14" height="14" viewbox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><a href="/en/#newsletter" class="cta" id="cta-sub">Subscribe</a></div></div></nav>
<nav class="mobile-nav" id="mobnav"><a href="/en/choi-gi">Play What?</a><a href="/en/gaming" class="active">Gaming</a><a href="/en/anime">Anime</a><a href="/en/manga">Manga</a><a href="/en/reviews">Reviews</a><a href="/en/rankings">Rankings</a><a href="/en/in-depth">Deep Dive</a><div class="m-sub"><a href="/en/about">About</a><a href="/en/#newsletter">Newsletter</a><a href="/en/about#contact">Contact</a></div></nav>

<section class="art-hero">
<div class="art-hero-img" style="background-image:url('/assets/img/uploads/m4495rif-capsule-616x353.jpg');background-position:center 50%;background-color:#0b0418;"></div>
<div class="art-hero-grad"></div>
<div class="art-hero-content">
<span class="art-hero-cat">Gaming</span>
<h1 class="art-hero-title">Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare</h1>
<p class="art-hero-excerpt">Roman Sands RE:Build plunges players into a bizarre seaside luxury resort trapped inside an endless time loop. Beneath its dazzling vaporwave aesthetic lies an existential critique of modern labor and survival.</p>
</div>
</section>

<div class="art-layout">
<main class="art-main">
<nav class="breadcrumb" aria-label="breadcrumb">
<a href="/en/">Home</a>
<span class="breadcrumb-sep">›</span>
<a href="/en/gaming" class="active">Gaming</a>
<span class="breadcrumb-sep">›</span>
<span>Roman Sands RE:Build</span>
</nav>

<div class="art-meta">
<span class="am-tag">Gaming</span>
<span class="am-sep"></span>
<span class="am-date">2026-09-28</span>
<span class="am-sep"></span>
<span class="am-read">6 min read</span>
<span class="am-sep"></span>
<span class="am-badge">OtaHub Editorial</span>
</div>

<div class="highlight-box">
<div class="hb-label">SUMMARY</div>
<div class="hb-text"><em>Roman Sands RE:Build</em> combines hotel job simulation, psychological dread, time loops, and retro vaporwave visuals. Created by Arbitrary Metric (the studio behind <em>Paratopic</em>), the game morphs halfway from a sun-drenched resort satire into a claustrophobic underground survival thriller.</div>
</div>

<article class="art-body">
<h2>Endless Service Labor in a Surreal Seaside Resort</h2>
<figure><img alt="Roman Sands RE:Build" src="/assets/img/uploads/inline-mukwnu0l-1.jpg" width="600" height="338"></figure>
<p>At the outset of <em>Roman Sands RE:Build</em>, players awaken stranded on a strange, sun-baked luxury beach retreat, tasked with catering to four eccentric, immensely demanding wealthy guests. You deliver cocktails, clean messes, fulfill bizarre requests, and slowly unlock new tools—until the sun sets and the day resets completely back to zero.</p>
<p>This loop serves as the satirical foundation of the opening act. By turning menial service tasks into gamified feedback loops with dopamine rewards, developer Arbitrary Metric directly lampoons gig economy dynamics and mobile game Skinner boxes.</p>

<h2>Vaporwave, Y2K Aesthetics, and Looming Dread</h2>
<p>The visual direction is striking: hyper-saturated neon pastel palettes, Y2K operating system interfaces, and dizzying vaporwave designs create an atmosphere that feels simultaneously nostalgic and deeply alienating. The soundtrack alternates between blissed-out lo-fi beats and abrasive hyperpop, heightening the player's disorientation.</p>
<figure><img alt="Roman Sands RE:Build" src="/assets/img/uploads/inline-mukwnwpz-2.jpg" width="602" height="339"></figure>
<p>Yet as you decipher the daily routines of the resort's guests and solve increasingly abstract environmental puzzles, reality begins to fray, revealing that this tropical paradise is crumbling from within.</p>

<h2>The Second Half: Underground Sci-Fi Horror</h2>
<p>Without warning, <em>Roman Sands RE:Build</em> executes a jaw-dropping tonal pivot. The player is thrust into a dimly lit, failing subterranean research facility menaced by a parasitic bio-entity. Saturated beach colors give way to oppressive shadows, scarce oxygen reserves, and gritty puzzle-solving guided only by a mysterious voice on a two-way radio.</p>
<p>Despite their radical visual contrast, both halves explore the same existential dread: being trapped in coercive systems where endless labor is the only currency for survival.</p>

<h2>Verdict: A Singular Indie Odyssey</h2>
<figure><img alt="Roman Sands RE:Build" src="/assets/img/uploads/inline-mukwo0lf-3.jpg" width="602" height="339"></figure>
<p>Drawing overt inspirations from <em>Danganronpa</em>, <em>Neon Genesis Evangelion</em>, and classic point-and-click adventure games, <em>Roman Sands RE:Build</em> is an uncompromising, eccentric work of interactive art. While deliberate repetition and occasional technical bugs may deter casual audiences, adventurous indie fans will find one of 2026's most memorable, thought-provoking narrative puzzles.</p>
<p><em>Roman Sands RE:Build</em> is available now across PC and consoles at £14.99 / $19.99.</p>
<p><b>Source: Curated Editorial</b></p>
</article>

<div class="share-row">
<span class="share-lbl">Share:</span>
<button class="share-btn" type="button" onclick="copyArticleLink(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>Copy link</button>
<a class="share-btn" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fotahub.asia%2Fen%2F${romanEnSlug}&amp;text=Roman%20Sands%20RE%3ABuild%20Review" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>X (Twitter)</a>
<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fotahub.asia%2Fen%2F${romanEnSlug}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>Facebook</a>
</div>
</main>

<aside class="art-sidebar">
<div class="sidebar-block">
<div class="sb-title">Related Articles</div>
<a class="sb-art" href="/en/mortal-shell-2-release"><img class="sb-thumb" src="/assets/img/monster-hunter-wilds-review-hero.jpg" alt="Mortal Shell II" loading="lazy" width="76" height="60"><div><div class="sb-cat">Gaming</div><div class="sb-t">Mortal Shell II Sets Worldwide Release Date</div></div></a>
<a class="sb-art" href="/en/genshin-impact-70-snezhnaya"><img class="sb-thumb" src="/assets/img/5418135572-demon-slayer-infinity-castle-review-hero.jpg" alt="Genshin Impact" loading="lazy" width="76" height="60"><div><div class="sb-cat">Gaming</div><div class="sb-t">Genshin Impact 7.0 Snezhnaya Unveils Odette</div></div></a>
<a class="sb-art" href="/en/big-walk-house-house"><img class="sb-thumb" src="/assets/img/news-gta6-gameplay-trailer-leonida.jpg" alt="Big Walk" loading="lazy" width="76" height="60"><div><div class="sb-cat">Gaming</div><div class="sb-t">Big Walk: Untitled Goose Game Devs Reveal Co-op Title</div></div></a>
</div>
<div class="sidebar-block">
<div class="sb-title">Topics</div>
<div class="sb-tags"><a class="sb-tag" href="/en/gaming">Gaming</a><a class="sb-tag" href="/en/gaming">Indie Games</a><a class="sb-tag" href="/en/gaming">Psychological Horror</a><a class="sb-tag" href="/en/gaming">PC</a><a class="sb-tag" href="/en/gaming">Steam</a></div>
</div>
</aside>
</div>

<footer><div class="ft-in"><div><a href="/en/" class="logo" style="display:inline-flex"><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.04)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect></svg><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><p class="ft-desc">Asia's Premier Gaming, Anime &amp; Pop-Culture Hub. Fast, in-depth, unbiased.</p></div><div><div class="ft-h">Sections</div><ul class="ft-links"><li><a href="/en/gaming" class="active">Gaming</a></li><li><a href="/en/anime">Anime</a></li><li><a href="/en/manga">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li></ul></div><div><div class="ft-h">About OtaHub</div><ul class="ft-links"><li><a href="/en/about">About Us</a></li><li><a href="/en/about#team">Editorial Team</a></li><li><a href="/en/about#contact">Contact</a></li><li><a href="/en/#newsletter">Newsletter</a></li></ul></div><div><div class="ft-h">Follow</div><ul class="ft-links"><li><a href="/feed.xml">RSS Feed</a></li></ul></div></div><div class="ft-bot"><span class="ft-copy">© 2026 OtaHub.asia · Asia's Gaming &amp; Anime Hub<br><span style="opacity:.75;font-size:12px">Operated by ANBU Media &amp; Marketing LLC · Tax ID 3301761892 · <a href="mailto:dat.phan@anbu.asia" style="color:inherit">dat.phan@anbu.asia</a></span></span></div></footer>

<script>
function toggleMob(){
  var h=document.getElementById('ham');
  var m=document.getElementById('mobnav');
  if(!m)return;
  var open=m.classList.toggle('open');
  if(h)h.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function openSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.add('open');setTimeout(function(){var i=document.getElementById('searchInput');if(i)i.focus();},50);document.body.style.overflow='hidden';}}
function closeSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.remove('open');var i=document.getElementById('searchInput');if(i)i.value='';document.body.style.overflow='';}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}});
var _sO=document.getElementById('searchOverlay');if(_sO){_sO.addEventListener('click',function(e){if(e.target===this)closeSearch();});}
function copyArticleLink(button){
  navigator.clipboard.writeText(location.href).then(function(){
    var original = button.textContent;
    button.textContent = "Copied link";
    setTimeout(function(){ button.textContent = original; }, 1800);
  });
}
</script>
<script defer src="/assets/search-redirect.js"></script>
<script defer src="/assets/enhance.js?v=20261002d"></script>
<script defer src="/assets/lang-switch.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join('en', `${romanEnSlug}.html`), romanEnHtml, 'utf8');
console.log(`Created en/${romanEnSlug}.html`);

// Update VI file to link to EN
let romanViContent = fs.readFileSync(`${romanViSlug}.html`, 'utf8');
if (!romanViContent.includes(`hreflang="en"`)) {
  romanViContent = romanViContent.replace(
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${romanViSlug}">`,
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${romanViSlug}">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${romanEnSlug}">`
  );
  if (!romanViContent.includes('/assets/lang-switch.js')) {
    romanViContent = romanViContent.replace('</body>', '<script defer src="/assets/lang-switch.js"></script>\n</body>');
  }
  fs.writeFileSync(`${romanViSlug}.html`, romanViContent, 'utf8');
  console.log(`Updated hreflang in ${romanViSlug}.html`);
}

// 3. Article 3: Conan 30th Anniversary Special
const conanEnSlug = 'detective-conan-case-30-murder-30th-anniversary-special';
const conanViSlug = 'detective-conan-30-vu-an-dac-biet-ky-niem-30-nam-len-song';

const conanEnHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<title>Detective Conan Case 30 Murder: 30th Anniversary 2-Hour TV Special · OtaHub</title>
<link rel="alternate" hreflang="vi" href="https://otahub.asia/${conanViSlug}">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${conanEnSlug}">
<link rel="alternate" hreflang="x-default" href="https://otahub.asia/${conanViSlug}">
<link rel="canonical" href="https://otahub.asia/en/${conanEnSlug}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Detective Conan celebrates its 30th anime anniversary with 'Case 30 Murder' (30号殺人事件), an action-packed 2-hour television special mobilizing police forces across Japan.">
<meta name="focus-keyword" content="conan">
<meta name="author" content="OtaHub Editorial">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="Detective Conan Case 30 Murder: 30th Anniversary 2-Hour TV Special · OtaHub">
<meta property="og:description" content="Detective Conan celebrates its 30th anime anniversary with 'Case 30 Murder' (30号殺人事件), an action-packed 2-hour television special mobilizing police forces across Japan.">
<meta property="og:url" content="https://otahub.asia/en/${conanEnSlug}">
<meta property="og:image" content="https://otahub.asia/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="OtaHub Editorial">
<meta property="article:published_time" content="2026-09-28T03:00:35.433Z">
<meta property="article:modified_time" content="2026-09-28T03:00:35.433Z">
<meta property="article:section" content="Anime">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Detective Conan Case 30 Murder: 30th Anniversary 2-Hour TV Special · OtaHub">
<meta name="twitter:description" content="Detective Conan celebrates its 30th anime anniversary with 'Case 30 Murder' (30号殺人事件), an action-packed 2-hour television special mobilizing police forces across Japan.">
<meta name="twitter:image" content="https://otahub.asia/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Detective Conan Case 30 Murder: 30th Anniversary 2-Hour TV Special",
  "description": "Detective Conan celebrates its 30th anime anniversary with 'Case 30 Murder' (30号殺人事件), an action-packed 2-hour television special mobilizing police forces across Japan.",
  "image": "https://otahub.asia/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg",
  "datePublished": "2026-09-28T03:00:35.433Z",
  "dateModified": "2026-09-28T03:00:35.433Z",
  "inLanguage": "en",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://otahub.asia/en/${conanEnSlug}" },
  "author": {
    "@type": "Person",
    "name": "OtaHub Editorial",
    "url": "https://otahub.asia/en/about",
    "jobTitle": "Editorial Board",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://otahub.asia/#organization",
      "name": "OtaHub",
      "url": "https://otahub.asia"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://otahub.asia/#organization",
    "name": "OtaHub",
    "url": "https://otahub.asia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://otahub.asia/favicon-192.png"
    }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://otahub.asia/en/" },
    { "@type": "ListItem", "position": 2, "name": "Anime", "item": "https://otahub.asia/en/anime" },
    { "@type": "ListItem", "position": 3, "name": "Detective Conan Case 30 Murder: 30th Anniversary Special", "item": "https://otahub.asia/en/${conanEnSlug}" }
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="manifest" href="/manifest.json">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-12852ZFD0K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-12852ZFD0K');
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
<link rel="stylesheet" href="/assets/article-style.css?v=20261002c">
</head>
<body>

<div class="search-overlay" id="searchOverlay">
  <div class="search-box">
    <input class="search-input" id="searchInput" type="text" placeholder="Search gaming, anime, manga...">
    <button class="search-close" onclick="closeSearch()">✕</button>
  </div>
  <div class="search-hint">Press ESC to close · Ctrl+K to search</div>
  <div class="search-tags">
    <a href="/en/gaming" class="stag">Gaming</a>
    <a href="/en/anime" class="stag">Anime</a>
    <a href="/en/manga" class="stag">Manga</a>
    <a href="/en/reviews" class="stag">Reviews</a>
    <a href="/en/rankings" class="stag">Rankings</a>
  </div>
</div>
<div id="amb"><div class="orb o1"></div><div class="orb o2"></div></div>
<div id="gtex"></div>
<nav class="nav"><div class="nav-in"><a class="logo" href="/en/"><span><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.05)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="5" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="5" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect></svg></span><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><ul class="nav-links"><li><a href="/en/choi-gi">Play What?</a></li><li><a href="/en/gaming">Gaming</a></li><li><a href="/en/anime" class="active">Anime</a></li><li><a href="/en/manga">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li><li><a href="/en/in-depth">Deep Dive</a></li></ul><button class="ham" id="ham" aria-label="Menu" onclick="toggleMob()"><span></span><span></span><span></span></button><div class="nav-r"><button class="nsearch" aria-label="Search" onclick="openSearch()"><svg width="14" height="14" viewbox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><a href="/en/#newsletter" class="cta" id="cta-sub">Subscribe</a></div></div></nav>
<nav class="mobile-nav" id="mobnav"><a href="/en/choi-gi">Play What?</a><a href="/en/gaming">Gaming</a><a href="/en/anime" class="active">Anime</a><a href="/en/manga">Manga</a><a href="/en/reviews">Reviews</a><a href="/en/rankings">Rankings</a><a href="/en/in-depth">Deep Dive</a><div class="m-sub"><a href="/en/about">About</a><a href="/en/#newsletter">Newsletter</a><a href="/en/about#contact">Contact</a></div></nav>

<section class="art-hero">
<div class="art-hero-img" style="background-image:url('/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg');background-position:center 50%;background-color:#0b0418;"></div>
<div class="art-hero-grad"></div>
<div class="art-hero-content">
<span class="art-hero-cat">Anime</span>
<h1 class="art-hero-title">Detective Conan Case 30 Murder: 30th Anniversary 2-Hour TV Special</h1>
<p class="art-hero-excerpt">Marking 30 glorious years of the Detective Conan television anime, TMS Entertainment returns to the 2-hour special format with 'Case 30 Murder', an all-star cross-prefecture counterfeiting conspiracy.</p>
</div>
</section>

<div class="art-layout">
<main class="art-main">
<nav class="breadcrumb" aria-label="breadcrumb">
<a href="/en/">Home</a>
<span class="breadcrumb-sep">›</span>
<a href="/en/anime" class="active">Anime</a>
<span class="breadcrumb-sep">›</span>
<span>Detective Conan 30th Special</span>
</nav>

<div class="art-meta">
<span class="am-tag">Anime</span>
<span class="am-sep"></span>
<span class="am-date">2026-09-28</span>
<span class="am-sep"></span>
<span class="am-read">5 min read</span>
<span class="am-sep"></span>
<span class="am-badge">OtaHub Editorial</span>
</div>

<div class="highlight-box">
<div class="hb-label">SUMMARY</div>
<div class="hb-text">After a decade-long hiatus from 2-hour television specials, <em>Detective Conan</em> celebrates its 30th anniversary with "Case 30 Murder" (30号殺人事件). The special unites Conan Edogawa, Heiji Hattori, Kogoro Mouri, and prefectural police detectives across Nagano, Gunma, Shizuoka, and Kanagawa to bust an elusive national counterfeit ring.</div>
</div>

<article class="art-body">
<h2>The 30th Anniversary Milestone and the Return of the 2-Hour Format</h2>
<p>2026 marks exactly thirty years since Gosho Aoyama's detective masterpiece first premiered on Japanese television. To celebrate this historic milestone, the production team at TMS Entertainment delivered a special 2-hour event: "Case 30 Murder" (30号殺人事件), broadcast nationally on Nippon TV's prestigious Friday Road Show slot.</p>
<figure><img alt="Detective Conan Case 30 Murder" src="/assets/img/uploads/inline-muknxh8g-1.jpg" width="602" height="335"></figure>
<p>The case kicks off when a homicide victim is discovered clutching a pristine counterfeit of Japan's newly redesigned 10,000-yen banknote. Dubbed "Ultra 30" because it represents the 30th counterfeiting syndicate in national forensic records, the discovery threatens consumer trust across the entire economy, prompting a multi-agency manhunt.</p>

<h2>An All-Star Prefectural Police Assembly</h2>
<figure><img alt="Detective Conan Case 30 Murder" src="/assets/img/uploads/inline-muknxjro-2.jpg" width="602" height="335"></figure>
<p>What distinguishes "Case 30 Murder" from standard TV episodes is its grand investigative scope. Following leads from a minting plant in Nagano to printing operations in Osaka, Conan and Kansai detective Heiji Hattori collaborate with beloved regional police officers across Japan:</p>
<ul>
  <li><strong>Shizuoka &amp; Kanagawa:</strong> Brothers Jugo Yokomizo and Sango Yokomizo join forces along coastal borders.</li>
  <li><strong>Nagano &amp; Gunma:</strong> The beloved Nagano trio—Kansuke Yamato, Takaaki Morofushi (Komei), and Yui Uehara—collaborate with the comical Misao Yamamura.</li>
  <li><strong>Tokyo HQ:</strong> Inspector Megure, Detective Shiratori, Toru Amuro, and forensic specialists coordinate the metropolitan dragnet.</li>
</ul>

<h2>Staff &amp; Exclusive Audio Commentary</h2>
<figure><img alt="Detective Conan Case 30 Murder" src="/assets/img/uploads/inline-muknxly5-3.jpg" width="602" height="335"></figure>
<p>Directed by Shinya Kamanaka with a screenplay by veteran mystery writer Takeyoshi Sakurai and music by Katsuo Ohno, the special features stellar animation and a memorable audio commentary with cast legends Minami Takayama (Conan), Rikiya Koyama (Kogoro), Ryo Horikawa (Heiji), and Yuko Miyamura (Kazuha).</p>
<p>By opting for a gripping, brand-new 2-hour procedural instead of a simple retrospective clip-show, the <em>Detective Conan</em> franchise honors its 30-year legacy with the timeless mystery craftsmanship that fans love.</p>
<p><b>Source: Curated Editorial</b></p>
</article>

<div class="share-row">
<span class="share-lbl">Share:</span>
<button class="share-btn" type="button" onclick="copyArticleLink(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>Copy link</button>
<a class="share-btn" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fotahub.asia%2Fen%2F${conanEnSlug}&amp;text=Detective%20Conan%2030th%20Anniversary%20Special" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>X (Twitter)</a>
<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fotahub.asia%2Fen%2F${conanEnSlug}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>Facebook</a>
</div>
</main>

<aside class="art-sidebar">
<div class="sidebar-block">
<div class="sb-title">Related Articles</div>
<a class="sb-art" href="/en/why-phantom-of-baker-street-is-one-of-the-best-conan-films"><img class="sb-thumb" src="/assets/img/5418135572-demon-slayer-infinity-castle-review-hero.jpg" alt="Phantom of Baker Street" loading="lazy" width="76" height="60"><div><div class="sb-cat">Anime</div><div class="sb-t">Why Phantom of Baker Street Remains Conan's Masterpiece</div></div></a>
<a class="sb-art" href="/en/frieren-season-2-aired-january-2026"><img class="sb-thumb" src="/assets/img/monster-hunter-wilds-review-hero.jpg" alt="Frieren" loading="lazy" width="76" height="60"><div><div class="sb-cat">Anime</div><div class="sb-t">Frieren Season 2 Airs to Worldwide Acclaim</div></div></a>
<a class="sb-art" href="/en/jujutsu-kaisen-anime-review"><img class="sb-thumb" src="/assets/img/news-gta6-gameplay-trailer-leonida.jpg" alt="Jujutsu Kaisen" loading="lazy" width="76" height="60"><div><div class="sb-cat">Reviews</div><div class="sb-t">Jujutsu Kaisen Anime Review: The Global Shonen Peak</div></div></a>
</div>
<div class="sidebar-block">
<div class="sb-title">Topics</div>
<div class="sb-tags"><a class="sb-tag" href="/en/anime">Detective Conan</a><a class="sb-tag" href="/en/anime">TMS Entertainment</a><a class="sb-tag" href="/en/anime">Mystery</a><a class="sb-tag" href="/en/anime">Anime Special</a><a class="sb-tag" href="/en/anime">Shonen</a></div>
</div>
</aside>
</div>

<footer><div class="ft-in"><div><a href="/en/" class="logo" style="display:inline-flex"><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.04)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect></svg><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><p class="ft-desc">Asia's Premier Gaming, Anime &amp; Pop-Culture Hub. Fast, in-depth, unbiased.</p></div><div><div class="ft-h">Sections</div><ul class="ft-links"><li><a href="/en/gaming">Gaming</a></li><li><a href="/en/anime" class="active">Anime</a></li><li><a href="/en/manga">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li></ul></div><div><div class="ft-h">About OtaHub</div><ul class="ft-links"><li><a href="/en/about">About Us</a></li><li><a href="/en/about#team">Editorial Team</a></li><li><a href="/en/about#contact">Contact</a></li><li><a href="/en/#newsletter">Newsletter</a></li></ul></div><div><div class="ft-h">Follow</div><ul class="ft-links"><li><a href="/feed.xml">RSS Feed</a></li></ul></div></div><div class="ft-bot"><span class="ft-copy">© 2026 OtaHub.asia · Asia's Gaming &amp; Anime Hub<br><span style="opacity:.75;font-size:12px">Operated by ANBU Media &amp; Marketing LLC · Tax ID 3301761892 · <a href="mailto:dat.phan@anbu.asia" style="color:inherit">dat.phan@anbu.asia</a></span></span></div></footer>

<script>
function toggleMob(){
  var h=document.getElementById('ham');
  var m=document.getElementById('mobnav');
  if(!m)return;
  var open=m.classList.toggle('open');
  if(h)h.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function openSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.add('open');setTimeout(function(){var i=document.getElementById('searchInput');if(i)i.focus();},50);document.body.style.overflow='hidden';}}
function closeSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.remove('open');var i=document.getElementById('searchInput');if(i)i.value='';document.body.style.overflow='';}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}});
var _sO=document.getElementById('searchOverlay');if(_sO){_sO.addEventListener('click',function(e){if(e.target===this)closeSearch();});}
function copyArticleLink(button){
  navigator.clipboard.writeText(location.href).then(function(){
    var original = button.textContent;
    button.textContent = "Copied link";
    setTimeout(function(){ button.textContent = original; }, 1800);
  });
}
</script>
<script defer src="/assets/search-redirect.js"></script>
<script defer src="/assets/enhance.js?v=20261002d"></script>
<script defer src="/assets/lang-switch.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join('en', `${conanEnSlug}.html`), conanEnHtml, 'utf8');
console.log(`Created en/${conanEnSlug}.html`);

// Update VI file to link to EN
let conanViContent = fs.readFileSync(`${conanViSlug}.html`, 'utf8');
if (!conanViContent.includes(`hreflang="en"`)) {
  conanViContent = conanViContent.replace(
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${conanViSlug}">`,
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${conanViSlug}">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${conanEnSlug}">`
  );
  if (!conanViContent.includes('/assets/lang-switch.js')) {
    conanViContent = conanViContent.replace('</body>', '<script defer src="/assets/lang-switch.js"></script>\n</body>');
  }
  fs.writeFileSync(`${conanViSlug}.html`, conanViContent, 'utf8');
  console.log(`Updated hreflang in ${conanViSlug}.html`);
}

// 4. Article 4: One Piece 1194 Zoro Spoiler
const opEnSlug = 'one-piece-1194-spoiler-zoro-unleashes-new-power-mihawk-flashback';
const opViSlug = 'one-piece-1194-spoiler-zoro-giai-phong-suc-manh-moi-mihawk-g';

const opEnHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<title>One Piece 1194 Spoilers: Zoro Unleashes New Power, Mihawk Flashback · OtaHub</title>
<link rel="alternate" hreflang="vi" href="https://otahub.asia/${opViSlug}">
<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${opEnSlug}">
<link rel="alternate" hreflang="x-default" href="https://otahub.asia/${opViSlug}">
<link rel="canonical" href="https://otahub.asia/en/${opEnSlug}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="One Piece 1194 spoilers: Zoro pushes the limits of Conqueror's Haki against Saint Sommers, recalling pivotal swordsmanship lessons from Dracule Mihawk.">
<meta name="focus-keyword" content="one piece 1194">
<meta name="author" content="OtaHub Editorial">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="One Piece 1194 Spoilers: Zoro Unleashes New Power, Mihawk Flashback · OtaHub">
<meta property="og:description" content="One Piece 1194 spoilers: Zoro pushes the limits of Conqueror's Haki against Saint Sommers, recalling pivotal swordsmanship lessons from Dracule Mihawk.">
<meta property="og:url" content="https://otahub.asia/en/${opEnSlug}">
<meta property="og:image" content="https://otahub.asia/assets/img/real-op1194-dexerto.jpg">
<meta property="og:site_name" content="OtaHub">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="OtaHub Editorial">
<meta property="article:published_time" content="2026-09-28T03:08:54.269Z">
<meta property="article:modified_time" content="2026-09-28T03:08:54.269Z">
<meta property="article:section" content="Manga">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="One Piece 1194 Spoilers: Zoro Unleashes New Power, Mihawk Flashback · OtaHub">
<meta name="twitter:description" content="One Piece 1194 spoilers: Zoro pushes the limits of Conqueror's Haki against Saint Sommers, recalling pivotal swordsmanship lessons from Dracule Mihawk.">
<meta name="twitter:image" content="https://otahub.asia/assets/img/real-op1194-dexerto.jpg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "One Piece 1194 Spoilers: Zoro Unleashes New Power, Mihawk Flashback",
  "description": "One Piece 1194 spoilers: Zoro pushes the limits of Conqueror's Haki against Saint Sommers, recalling pivotal swordsmanship lessons from Dracule Mihawk.",
  "image": "https://otahub.asia/assets/img/real-op1194-dexerto.jpg",
  "datePublished": "2026-09-28T03:08:54.269Z",
  "dateModified": "2026-09-28T03:08:54.269Z",
  "inLanguage": "en",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://otahub.asia/en/${opEnSlug}" },
  "author": {
    "@type": "Person",
    "name": "OtaHub Editorial",
    "url": "https://otahub.asia/en/about",
    "jobTitle": "Editorial Board",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://otahub.asia/#organization",
      "name": "OtaHub",
      "url": "https://otahub.asia"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://otahub.asia/#organization",
    "name": "OtaHub",
    "url": "https://otahub.asia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://otahub.asia/favicon-192.png"
    }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://otahub.asia/en/" },
    { "@type": "ListItem", "position": 2, "name": "Manga", "item": "https://otahub.asia/en/manga" },
    { "@type": "ListItem", "position": 3, "name": "One Piece 1194 Spoilers", "item": "https://otahub.asia/en/${opEnSlug}" }
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="manifest" href="/manifest.json">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-12852ZFD0K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-12852ZFD0K');
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta name="theme-color" content="#0b0418">
<link rel="alternate" type="application/rss+xml" title="OtaHub RSS" href="/feed.xml">
<link rel="stylesheet" href="/assets/article-style.css?v=20261002c">
</head>
<body>

<div class="search-overlay" id="searchOverlay">
  <div class="search-box">
    <input class="search-input" id="searchInput" type="text" placeholder="Search gaming, anime, manga...">
    <button class="search-close" onclick="closeSearch()">✕</button>
  </div>
  <div class="search-hint">Press ESC to close · Ctrl+K to search</div>
  <div class="search-tags">
    <a href="/en/gaming" class="stag">Gaming</a>
    <a href="/en/anime" class="stag">Anime</a>
    <a href="/en/manga" class="stag">Manga</a>
    <a href="/en/reviews" class="stag">Reviews</a>
    <a href="/en/rankings" class="stag">Rankings</a>
  </div>
</div>
<div id="amb"><div class="orb o1"></div><div class="orb o2"></div></div>
<div id="gtex"></div>
<nav class="nav"><div class="nav-in"><a class="logo" href="/en/"><span><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.05)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="5" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="5" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="5" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect><rect x="27" y="27" width="2" height="2" fill="#00e5ff" opacity=".6"></rect></svg></span><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><ul class="nav-links"><li><a href="/en/choi-gi">Play What?</a></li><li><a href="/en/gaming">Gaming</a></li><li><a href="/en/anime">Anime</a></li><li><a href="/en/manga" class="active">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li><li><a href="/en/in-depth">Deep Dive</a></li></ul><button class="ham" id="ham" aria-label="Menu" onclick="toggleMob()"><span></span><span></span><span></span></button><div class="nav-r"><button class="nsearch" aria-label="Search" onclick="openSearch()"><svg width="14" height="14" viewbox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle><path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path></svg></button><a href="/en/#newsletter" class="cta" id="cta-sub">Subscribe</a></div></div></nav>
<nav class="mobile-nav" id="mobnav"><a href="/en/choi-gi">Play What?</a><a href="/en/gaming">Gaming</a><a href="/en/anime">Anime</a><a href="/en/manga" class="active">Manga</a><a href="/en/reviews">Reviews</a><a href="/en/rankings">Rankings</a><a href="/en/in-depth">Deep Dive</a><div class="m-sub"><a href="/en/about">About</a><a href="/en/#newsletter">Newsletter</a><a href="/en/about#contact">Contact</a></div></nav>

<section class="art-hero">
<div class="art-hero-img" style="background-image:url('/assets/img/real-op1194-dexerto.jpg');background-position:center 50%;background-color:#0b0418;"></div>
<div class="art-hero-grad"></div>
<div class="art-hero-content">
<span class="art-hero-cat">Manga</span>
<h1 class="art-hero-title">One Piece 1194 Spoilers: Zoro Unleashes New Power, Mihawk Flashback</h1>
<p class="art-hero-excerpt">Chapter 1194 escalates the Elbaf conflict as Roronoa Zoro refines his mastery over Advanced Conqueror's Haki against Saint Sommers, sparked by memories of Mihawk's harsh swordsmanship training.</p>
</div>
</section>

<div class="art-layout">
<main class="art-main">
<nav class="breadcrumb" aria-label="breadcrumb">
<a href="/en/">Home</a>
<span class="breadcrumb-sep">›</span>
<a href="/en/manga" class="active">Manga</a>
<span class="breadcrumb-sep">›</span>
<span>One Piece 1194 Spoilers</span>
</nav>

<div class="art-meta">
<span class="am-tag">Manga</span>
<span class="am-sep"></span>
<span class="am-date">2026-09-28</span>
<span class="am-sep"></span>
<span class="am-read">5 min read</span>
<span class="am-sep"></span>
<span class="am-badge">OtaHub Editorial</span>
</div>

<div class="highlight-box">
<div class="hb-label">SUMMARY</div>
<div class="hb-text">In Chapter 1194, Zoro battles Saint Sommers, whose abnormal regenerative capabilities negate conventional slicing attacks. Recalling Dracule Mihawk's teachings on imbuing sheer supreme willpower into blades, Zoro dawns his bandana and channels Conqueror's Haki across all three swords, unleashing black lightning and flames that permanently stall Sommers' regeneration.</div>
</div>

<article class="art-body">
<h2>Zoro vs. Saint Sommers Escalates</h2>
<p><em>⚠️ Spoiler Warning: The following article contains verified spoilers for One Piece Chapter 1194.</em></p>
<figure><img alt="One Piece 1194 Spoilers" src="/assets/img/uploads/inline-mukoc47a-1.jpg" width="602" height="337"></figure>
<p>Chapter 1194 plunges straight back into the Elbaf battlefield, focusing on Roronoa Zoro's grueling confrontation with Saint Sommers. Sommers' relentless regeneration presents an immense obstacle—even when sliced clean through, his flesh stitches back effortlessly, mocking Zoro's standard offensive arsenal.</p>
<p>Recognizing the faint aura of Conqueror's Haki leaking from the Straw Hat swordsman, Sommers taunts Zoro for possessing monstrous dormant power without the precision to wield it effectively.</p>

<h2>Mihawk's Wisdom Resurfaces</h2>
<p>The turning point arrives via a pivotal flashback to Zoro's two-year training under Dracule Mihawk on Kuraigana Island. The world's greatest swordsman previously explained the concept of infusing Supreme King Haki into steel, declaring that true masters do not merely project aura—they bind it intimately to their cutting edge.</p>
<p>This memory confirms that Zoro's understanding of Conqueror's Haki is reaching its final, deliberate phase of maturation, while simultaneously fueling community debates over whether Mihawk himself wields the supreme color.</p>

<h2>The Evolution of King of Hell</h2>
<figure><img alt="One Piece 1194 Spoilers" src="/assets/img/uploads/inline-mukoc6x2-2.jpg" width="602" height="337"></figure>
<p>Stepping back into high gear, Zoro ties his signature bandana around his forehead. Channeling his willpower steadily, dense black lightning and ethereal flames wreath all three blades simultaneously.</p>
<p>Unlike the unstable bursts seen against King during the Raid on Onigashima, Zoro's new strike strikes Sommers with surgical containment. Crucially, the resulting wound sizzles with Conqueror's residue, preventing Sommers' cellular regeneration from instantly sealing the cut.</p>
<p>While the chapter leaves Luffy and Loki's storyline on pause, Zoro's breakthrough marks a decisive leap toward claiming the mantle of the World's Strongest Swordsman.</p>
<p><b>Source: Curated Editorial</b></p>
</article>

<div class="share-row">
<span class="share-lbl">Share:</span>
<button class="share-btn" type="button" onclick="copyArticleLink(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>Copy link</button>
<a class="share-btn" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fotahub.asia%2Fen%2F${opEnSlug}&amp;text=One%20Piece%201194%20Spoilers" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>X (Twitter)</a>
<a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fotahub.asia%2Fen%2F${opEnSlug}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>Facebook</a>
</div>
</main>

<aside class="art-sidebar">
<div class="sidebar-block">
<div class="sb-title">Related Articles</div>
<a class="sb-art" href="/en/one-piece-egghead-arc-review"><img class="sb-thumb" src="/assets/img/monster-hunter-wilds-review-hero.jpg" alt="One Piece Egghead Review" loading="lazy" width="76" height="60"><div><div class="sb-cat">Reviews</div><div class="sb-t">One Piece Egghead Arc Review: Vegapunk's Revelations</div></div></a>
<a class="sb-art" href="/en/one-piece-final-saga-review"><img class="sb-thumb" src="/assets/img/5418135572-demon-slayer-infinity-castle-review-hero.jpg" alt="Final Saga Review" loading="lazy" width="76" height="60"><div><div class="sb-cat">Reviews</div><div class="sb-t">One Piece Final Saga Review: Elbaph and Beyond</div></div></a>
<a class="sb-art" href="/en/hunter-x-hunter-chapter-419-returns-hiatus-after-420"><img class="sb-thumb" src="/assets/img/news-gta6-gameplay-trailer-leonida.jpg" alt="Hunter x Hunter" loading="lazy" width="76" height="60"><div><div class="sb-cat">Manga</div><div class="sb-t">Hunter x Hunter Chapter 419 Returns</div></div></a>
</div>
<div class="sidebar-block">
<div class="sb-title">Topics</div>
<div class="sb-tags"><a class="sb-tag" href="/en/manga">One Piece</a><a class="sb-tag" href="/en/manga">Zoro</a><a class="sb-tag" href="/en/manga">Mihawk</a><a class="sb-tag" href="/en/manga">Shonen Jump</a><a class="sb-tag" href="/en/manga">Elbaf</a></div>
</div>
</aside>
</div>

<footer><div class="ft-in"><div><a href="/en/" class="logo" style="display:inline-flex"><svg width="34" height="34" viewBox="0 0 34 34" fill="none" style="width:34px;height:34px;flex-shrink:0"><polygon points="11,2 23,2 32,11 32,23 23,32 11,32 2,23 2,11" stroke="#00e5ff" stroke-width="1.5" fill="rgba(0,229,255,.04)"></polygon><rect x="8" y="14" width="18" height="2" fill="#ff3080"></rect><rect x="9" y="12" width="16" height="1.5" fill="#ff3080"></rect><rect x="13" y="16" width="2" height="9" fill="#ff3080"></rect><rect x="19" y="16" width="2" height="9" fill="#ff3080"></rect></svg><span class="logo-t"><span class="logo-ota">Ota</span><span class="logo-hub">Hub</span></span></a><p class="ft-desc">Asia's Premier Gaming, Anime &amp; Pop-Culture Hub. Fast, in-depth, unbiased.</p></div><div><div class="ft-h">Sections</div><ul class="ft-links"><li><a href="/en/gaming">Gaming</a></li><li><a href="/en/anime">Anime</a></li><li><a href="/en/manga" class="active">Manga</a></li><li><a href="/en/reviews">Reviews</a></li><li><a href="/en/rankings">Rankings</a></li></ul></div><div><div class="ft-h">About OtaHub</div><ul class="ft-links"><li><a href="/en/about">About Us</a></li><li><a href="/en/about#team">Editorial Team</a></li><li><a href="/en/about#contact">Contact</a></li><li><a href="/en/#newsletter">Newsletter</a></li></ul></div><div><div class="ft-h">Follow</div><ul class="ft-links"><li><a href="/feed.xml">RSS Feed</a></li></ul></div></div><div class="ft-bot"><span class="ft-copy">© 2026 OtaHub.asia · Asia's Gaming &amp; Anime Hub<br><span style="opacity:.75;font-size:12px">Operated by ANBU Media &amp; Marketing LLC · Tax ID 3301761892 · <a href="mailto:dat.phan@anbu.asia" style="color:inherit">dat.phan@anbu.asia</a></span></span></div></footer>

<script>
function toggleMob(){
  var h=document.getElementById('ham');
  var m=document.getElementById('mobnav');
  if(!m)return;
  var open=m.classList.toggle('open');
  if(h)h.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function openSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.add('open');setTimeout(function(){var i=document.getElementById('searchInput');if(i)i.focus();},50);document.body.style.overflow='hidden';}}
function closeSearch(){var o=document.getElementById('searchOverlay');if(o){o.classList.remove('open');var i=document.getElementById('searchInput');if(i)i.value='';document.body.style.overflow='';}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}});
var _sO=document.getElementById('searchOverlay');if(_sO){_sO.addEventListener('click',function(e){if(e.target===this)closeSearch();});}
function copyArticleLink(button){
  navigator.clipboard.writeText(location.href).then(function(){
    var original = button.textContent;
    button.textContent = "Copied link";
    setTimeout(function(){ button.textContent = original; }, 1800);
  });
}
</script>
<script defer src="/assets/search-redirect.js"></script>
<script defer src="/assets/enhance.js?v=20261002d"></script>
<script defer src="/assets/lang-switch.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join('en', `${opEnSlug}.html`), opEnHtml, 'utf8');
console.log(`Created en/${opEnSlug}.html`);

// Update VI file to link to EN
let opViContent = fs.readFileSync(`${opViSlug}.html`, 'utf8');
if (!opViContent.includes(`hreflang="en"`)) {
  opViContent = opViContent.replace(
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${opViSlug}">`,
    `<link rel="alternate" hreflang="vi" href="https://otahub.asia/${opViSlug}">\n<link rel="alternate" hreflang="en" href="https://otahub.asia/en/${opEnSlug}">`
  );
  if (!opViContent.includes('/assets/lang-switch.js')) {
    opViContent = opViContent.replace('</body>', '<script defer src="/assets/lang-switch.js"></script>\n</body>');
  }
  fs.writeFileSync(`${opViSlug}.html`, opViContent, 'utf8');
  console.log(`Updated hreflang in ${opViSlug}.html`);
}

// 5. Update assets/search.js with the 4 new English articles
const searchItems = [
  {
    title: "When GTA Becomes a Stage for Shakespeare in Grand Theft Hamlet",
    url: `/en/${gtaEnSlug}`,
    cat: "Gaming",
    date: "2026-09-28",
    excerpt: "Grand Theft Hamlet turns GTA Online into an open stage for Shakespeare, proving games can transcend entertainment into cinematic art.",
    img: "/assets/img/uploads/l17gb64r-gta.webp",
    tags: ["GTA Online", "Rockstar Games", "Gaming", "SXSW"]
  },
  {
    title: "Roman Sands RE:Build: Trapped in a Collapsing Vaporwave Nightmare",
    url: `/en/${romanEnSlug}`,
    cat: "Gaming",
    date: "2026-09-28",
    excerpt: "Roman Sands RE:Build plunges players into a bizarre seaside luxury resort trapped inside an endless time loop with vaporwave dread.",
    img: "/assets/img/uploads/m4495rif-capsule-616x353.jpg",
    tags: ["Indie Games", "Psychological Horror", "Gaming", "Vaporwave"]
  },
  {
    title: "Detective Conan Case 30 Murder: 30th Anniversary 2-Hour TV Special",
    url: `/en/${conanEnSlug}`,
    cat: "Anime",
    date: "2026-09-28",
    excerpt: "Detective Conan celebrates its 30th anime anniversary with 'Case 30 Murder', an action-packed 2-hour television special across Japan.",
    img: "/assets/img/uploads/dvt9allq-conan-30go-eyecatch.jpg",
    tags: ["Detective Conan", "Anime", "TMS Entertainment", "Mystery"]
  },
  {
    title: "One Piece 1194 Spoilers: Zoro Unleashes New Power, Mihawk Flashback",
    url: `/en/${opEnSlug}`,
    cat: "Manga",
    date: "2026-09-28",
    excerpt: "One Piece 1194 spoilers: Zoro pushes the limits of Conqueror's Haki against Saint Sommers, recalling pivotal lessons from Dracule Mihawk.",
    img: "/assets/img/real-op1194-dexerto.jpg",
    tags: ["One Piece", "Manga", "Zoro", "Shonen Jump"]
  }
];

if (fs.existsSync('assets/search.js')) {
  let searchStr = fs.readFileSync('assets/search.js', 'utf8');
  let added = 0;
  for (const item of searchItems) {
    if (!searchStr.includes(item.url)) {
      const jsonStr = JSON.stringify(item, null, 2);
      searchStr = searchStr.replace(/window\.SITE_SEARCH\s*=\s*\[/, `window.SITE_SEARCH = [\n  ${jsonStr},`);
      added++;
    }
  }
  fs.writeFileSync('assets/search.js', searchStr, 'utf8');
  console.log(`Added ${added} items to assets/search.js`);
}

// 6. Update sitemap.xml with the 4 new English URLs
if (fs.existsSync('sitemap.xml')) {
  let sitemapStr = fs.readFileSync('sitemap.xml', 'utf8');
  let sitemapAdded = 0;
  for (const item of searchItems) {
    const loc = `https://otahub.asia${item.url}`;
    if (!sitemapStr.includes(loc)) {
      const entry = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${item.date}T00:00:00.000Z</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      sitemapStr = sitemapStr.replace('</urlset>', `${entry}</urlset>`);
      sitemapAdded++;
    }
  }
  fs.writeFileSync('sitemap.xml', sitemapStr, 'utf8');
  console.log(`Added ${sitemapAdded} URLs to sitemap.xml`);
}

console.log('All 4 English translations generated and synced successfully!');
