import fs from 'fs';
import path from 'path';

const finalUpdates = {
  'chainsaw-man-chapter-180-death-devil.html': {
    summary: 'Phần 2 (Academy Saga) của siêu phẩm manga <strong>Chainsaw Man</strong> do Tatsuki Fujimoto sáng tác đã chính thức khép lại, tổng kết chặng đường 135 chương truyện đầy thăng trầm của Asa Mitaka và Quỷ Chiến Tranh Yoru cùng thông tin phát hành tập truyện cuối.',
    excerpt: 'Chainsaw Man Part 2 khép lại hành trình Academy Saga đầy ấn tượng: Tổng kết 135 chương truyện của Tatsuki Fujimoto và kế hoạch phát hành tập cuối.'
  },
  'en/chainsaw-man-chapter-180-death-devil.html': {
    summary: 'The Academy Saga of Tatsuki Fujimoto\'s hit manga <strong>Chainsaw Man Part 2</strong> has reached its official conclusion, wrapping up an intense 135-chapter journey centered around Asa Mitaka, the War Devil Yoru, and the final volume release schedule.',
    excerpt: 'Chainsaw Man Part 2 concludes its thrilling Academy Saga: Celebrating 135 chapters of Tatsuki Fujimoto\'s dark fantasy and final volume release details.'
  },
  'en/attack-on-titan-wit-teaser.html': {
    summary: 'WIT Studio and Aniplex surprised fans with an enigmatic teaser image featuring six key <strong>Attack on Titan</strong> characters for the franchise\'s anniversary, sparking intense community speculation about potential new spin-offs or prequel animation projects.',
    excerpt: 'WIT Studio drops an intriguing Attack on Titan teaser featuring key characters, fueling rumors of a new anime project for the franchise.'
  },
  'en/big-walk-house-house.html': {
    summary: 'House House, the acclaimed indie studio behind <em>Untitled Goose Game</em>, has revealed their next multiplayer co-op adventure <strong>Big Walk</strong>, inviting groups of players to explore a vibrant open world filled with communication-driven puzzles.',
    excerpt: 'Untitled Goose Game creators House House reveal Big Walk, an innovative cooperative open-world puzzle adventure built around team communication.'
  },
  'en/bleach-tybw-calamity-opening-ending.html': {
    summary: 'The final cour of <strong>Bleach: Thousand-Year Blood War - The Calamity</strong> has unveiled its official theme songs, featuring opening track "I-BULL" by jo0ji and ending theme "Rasen" performed by 9Lana, setting the stage for the climactic battle against Yhwach.',
    excerpt: 'Bleach: Thousand-Year Blood War - The Calamity reveals its dynamic theme songs: OP "I-BULL" by jo0ji and ED "Rasen" by 9Lana for the anime finale.'
  },
  'en/galaxy-express-999-new-film.html': {
    summary: 'Toei Animation has officially confirmed the development of a brand-new theatrical anime feature based on Leiji Matsumoto\'s timeless sci-fi classic <strong>Galaxy Express 999</strong>, helmed by legendary anime director Rintaro.',
    excerpt: 'Toei Animation revives classic sci-fi masterpiece Galaxy Express 999 with an all-new theatrical film directed by veteran filmmaker Rintaro.'
  },
  'en/genshin-impact-70-snezhnaya.html': {
    summary: 'HoYoverse has launched <strong>Genshin Impact 7.0: Everwinter Without Mercy</strong>, welcoming Travelers into Snezhnaya—the snowy seventh nation of Teyvat—alongside new playable Cryo character Odette and an experimental third-person combat gameplay mode.',
    excerpt: 'Genshin Impact 7.0 opens the gates to Snezhnaya: Explore the Cryo nation, meet new character Odette, and experience innovative combat mechanics.'
  },
  'en/gta-6-26-minute-extended-look-netflix.html': {
    summary: 'In response to recent gameplay leaks, Rockstar Games dropped an unprecedented 26-minute Extended Look at <strong>Grand Theft Auto VI</strong>, premiering exclusively on Netflix before rolling out globally to showcase the stunning next-gen visual fidelity of Vice City.',
    excerpt: 'Rockstar Games surprises players with a 26-minute GTA 6 Extended Look on Netflix, showcasing stunning Vice City gameplay and next-gen visuals.'
  },
  'en/gta6-preview.html': {
    summary: 'Rockstar Games has scheduled the worldwide release of <strong>Grand Theft Auto VI</strong> for November 19, 2026 across PlayStation 5, PS5 Pro, and Xbox Series X|S, detailing launch editions, pricing tiers, and the next-generation evolution of Vice City.',
    excerpt: 'Grand Theft Auto VI launch preview: Release date, preorder editions, next-generation Vice City details, and Rockstar\'s platform strategy.'
  },
  'en/jujutsu-kaisen-chapter-271-final-climax-epilogue.html': {
    summary: 'Gege Akutami\'s blockbuster manga <strong>Jujutsu Kaisen</strong> has concluded its serialized run at Chapter 271, closing six years of supernatural battles for Yuji Itadori and setting the stage for the simultaneous release of final volumes 29 and 30.',
    excerpt: 'Jujutsu Kaisen concludes with Chapter 271: Reflecting on six years of Gege Akutami\'s dark fantasy phenomenon and the final volume releases.'
  },
  'en/made-in-abyss-awakening-mystery.html': {
    summary: 'The upcoming theatrical anime movie <strong>Made in Abyss: Awakening Mystery</strong> has debuted its official trailer, introducing new characters Tepasté and Cravali alongside the evocative main theme "Chain of the Abyss" composed by Kevin Penkin and Mori Calliope.',
    excerpt: 'Made in Abyss: Awakening Mystery debuts its official trailer, revealing new adventurers and Kevin Penkin\'s haunting soundtrack ahead of theatrical release.'
  },
  'en/mortal-shell-2-release.html': {
    summary: 'Developer Cold Symmetry and publisher Playstack have locked in the worldwide launch of dark soulslike action RPG <strong>Mortal Shell II</strong> across PC, PS5, and Xbox Series X|S, introducing a modernized posture combat system and eight transformative Shells.',
    excerpt: 'Mortal Shell II sets its global release date: A visceral soulslike sequel featuring revamped posture-based combat and eight transformable Shells.'
  },
  'en/quit-laughing-shijima-horikoshi.html': {
    summary: '<em>My Hero Academia</em> creator Kohei Horikoshi makes an electrifying return to Weekly Shonen Jump with <strong>Quit Laughing, Shijima</strong>, a gripping 61-page psychological horror one-shot following an ominous small town harboring chilling secrets.',
    excerpt: 'My Hero Academia creator Kohei Horikoshi returns to Weekly Shonen Jump with a chilling 61-page psychological horror one-shot, Quit Laughing, Shijima.'
  },
  'en/slime-season-4-cour-3-july-2027-claymans-revenge.html': {
    summary: 'Rimuru Tempest\'s adventures in <strong>That Time I Got Reincarnated as a Slime Season 4</strong> will continue with Cour 3 in July 2027, while studio 8-Bit also confirmed a full television anime adaptation for the spinoff manga <em>Clayman\'s Revenge</em>.',
    excerpt: 'Slime Season 4 announces Cour 3 for July 2027 alongside a new TV anime adaptation of the spinoff manga Clayman\'s Revenge by 8-Bit.'
  }
};

let count = 0;
for (const [fileRel, data] of Object.entries(finalUpdates)) {
  const filePath = path.resolve(fileRel);
  if (!fs.existsSync(filePath)) {
    console.log(`Not found: ${fileRel}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <div class="hb-text">...</div>
  content = content.replace(/<div class="hb-text">[\s\S]*?<\/div>/, `<div class="hb-text">${data.summary}</div>`);

  // Replace <p class="art-hero-excerpt">...
  content = content.replace(/<p class="art-hero-excerpt">[\s\S]*?<\/p>/, `<p class="art-hero-excerpt">${data.excerpt}</p>`);

  // Replace meta descriptions
  content = content.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${data.excerpt.replace(/"/g, '&quot;')}">`);
  content = content.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${data.excerpt.replace(/"/g, '&quot;')}">`);
  content = content.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${data.excerpt.replace(/"/g, '&quot;')}">`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${fileRel}`);
  count++;

  // Update in search.js if exists
  if (fs.existsSync('assets/search.js')) {
    const slug = '/' + fileRel.replace(/\.html$/, '');
    let searchContent = fs.readFileSync('assets/search.js', 'utf8');
    const slugIdx = searchContent.indexOf(`"url": "${slug}"`);
    if (slugIdx !== -1) {
      const startObj = searchContent.lastIndexOf('{', slugIdx);
      const endObj = searchContent.indexOf('}', slugIdx);
      if (startObj !== -1 && endObj !== -1) {
        let objStr = searchContent.slice(startObj, endObj + 1);
        objStr = objStr.replace(/"excerpt":\s*"[^"]*"/, `"excerpt": "${data.excerpt.replace(/"/g, '\\"')}"`);
        searchContent = searchContent.slice(0, startObj) + objStr + searchContent.slice(endObj + 1);
        fs.writeFileSync('assets/search.js', searchContent, 'utf8');
      }
    }
  }
}

console.log(`Updated all ${count} final files!`);
