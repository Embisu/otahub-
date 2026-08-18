import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=fs.readFileSync(path.join(root,'scripts/publish-30-news.mjs'),'utf8');
const stories=[...source.matchAll(/^\s*\['([^']+)','([^']+)','([^']+)','([^']+)'/gm)].map(m=>({slug:m[1],vi:m[2],en:m[3],category:m[4]}));
const stop=new Set(['the','and','for','with','from','season','anime','new','mua','phat','hanh','cong','bo','chinh','thuc','duoc','tren','nam']);
const clean=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const tokens=s=>clean(s).split(/\s+/).filter(x=>x.length>2&&!stop.has(x));
const decode=s=>s.replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&#39;',"'");
const trusted=['nintendo.com','playstation.com','xbox.com','crunchyroll.com','konosuba.com','bleach-anime.com','dora-movie.com','marvel.com','halo.xbox.com','lego.com','yenpress.com','viz.com','bandainamcoent.com'];

const psSlugs=new Set(['silent-hill-townfall-gameplay','ball-x-pit-naturalist-update','playstation-plus-august-2026','flamecraft-ps5-demo','marvel-tokon-phoenix-cyclops-dlc','marvel-wolverine-story-trailer','halo-campaign-evolved-modernizes','dragon-ball-sparking-zero-neo-dlc','lous-lagoon-ps5-august-27','order-of-the-sinking-star-ps5']);
const ninSlugs=new Set(['splatoon-raiders-launch','lego-donkey-kong-arcade','rhythm-heaven-groove-nintendo','oblivion-remastered-switch-2']);
function sourceDomain(story){
  if(story.category==='Anime'||story.category==='Manga')return 'crunchyroll.com';
  if(psSlugs.has(story.slug))return 'blog.playstation.com';
  if(ninSlugs.has(story.slug))return 'nintendo.com';
  if(story.slug==='xbox-game-pass-july-wave-2')return 'xbox.com';
  return '';
}
async function sourcePages(story){
  const domain=sourceDomain(story);
  if(domain==='crunchyroll.com'){
    const hubs=['https://www.crunchyroll.com/news/latest','https://www.crunchyroll.com/news/announcements'];
    const links=[];
    for(const hub of hubs){const html=await fetch(hub,{headers:{'user-agent':'Mozilla/5.0'}}).then(r=>r.text());for(const m of html.matchAll(/href=["']([^"']+)["']/g)){try{const u=new URL(decode(m[1]),hub).href;if(u.includes('crunchyroll.com/')&&/\/2026\//.test(u))links.push(u)}catch{}}}
    const wanted=tokens(story.en);return [...new Set(links)].sort((a,b)=>wanted.filter(t=>clean(b).includes(t)).length-wanted.filter(t=>clean(a).includes(t)).length).filter(u=>wanted.filter(t=>clean(u).includes(t)).length>=Math.min(2,wanted.length));
  }
  if(domain==='blog.playstation.com'){
    const html=await fetch('https://blog.playstation.com/?s='+encodeURIComponent(story.en),{headers:{'user-agent':'Mozilla/5.0'}}).then(r=>r.text());
    return [...html.matchAll(/href=["'](https:\/\/blog\.playstation\.com\/2026\/[^"']+)/g)].map(m=>decode(m[1])).filter((x,i,a)=>a.indexOf(x)===i);
  }
  const query=`site:${domain} "${story.en.replace(/\b(reveals|releases|announces|confirms|details|comes|launches|adds|shares|includes|outlines).*$/i,'').trim()}"`;
  const url='https://www.bing.com/search?q='+encodeURIComponent(query);
  const html=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}}).then(r=>r.text());
  const direct=[...html.matchAll(/<a[^>]+href="(https?:\/\/[^"#]+)"/g)].map(m=>decode(m[1])).filter(x=>x.includes(domain)&&!x.includes('bing.com'));
  const tracked=[...html.matchAll(/href="https:\/\/www\.bing\.com\/ck\/a[^"?]*\?[^" ]*?[&;]u=a1([^&";]+)/g)].map(m=>{try{return Buffer.from(m[1],'base64url').toString()}catch{return ''}}).filter(x=>x.includes(domain));
  return [...direct,...tracked].filter((x,i,a)=>a.indexOf(x)===i);
}

function score(item,title){
  const hay=clean((item.purl||'')+' '+(item.murl||''));
  let n=tokens(title).reduce((a,t)=>a+(hay.includes(t)?3:0),0);
  if(trusted.some(d=>hay.includes(d)))n+=8;
  if(/logo|icon|avatar|sprite/.test(hay))n-=8;
  if(/\.jpg|\.jpeg|\.png|\.webp/.test(item.murl||''))n+=2;
  return n;
}
async function imageCandidates(story){
  const core=story.en.replace(/\b(reveals|releases|announces|confirms|details|comes|launches|adds|shares|includes|outlines|is|are).*$/i,'').trim();
  const html=await fetch('https://www.bing.com/images/search?q='+encodeURIComponent(core+' key visual key art'),{headers:{'user-agent':'Mozilla/5.0'}}).then(r=>r.text());
  const found=[];for(const m of html.matchAll(/m=\"(\{&quot;.*?\})\"/g)){try{const j=JSON.parse(decode(m[1]));if(j.murl)found.push(j)}catch{}}
  const need=tokens(core);return found.sort((a,b)=>score(b,core)-score(a,core)).filter(x=>need.filter(t=>clean((x.purl||'')+' '+(x.murl||'')).includes(t)).length>=Math.min(2,need.length));
}

async function download(story){
  if(story.slug==='playstation-plus-august-2026')return [story.slug,'jpg'];
  const pages=await sourcePages(story);
  for(const page of pages.slice(0,8)){
    try{
      const html=await fetch(page,{headers:{'user-agent':'Mozilla/5.0'},redirect:'follow'}).then(r=>r.text());
      const match=html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)||html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/i);
      if(!match)continue;
      const image=decode(match[1]);
      const r=await fetch(image,{headers:{'user-agent':'Mozilla/5.0','referer':page},redirect:'follow'});
      if(!r.ok)continue;
      const type=(r.headers.get('content-type')||'').toLowerCase();
      const ext=type.includes('png')?'png':type.includes('webp')?'webp':type.includes('jpeg')||type.includes('jpg')?'jpg':'';
      if(!ext)continue;
      const buf=Buffer.from(await r.arrayBuffer());
      if(buf.length<25000||buf.length>8_000_000)continue;
      fs.writeFileSync(path.join(root,'assets/img',`news-${story.slug}.${ext}`),buf);
      console.log(`${story.slug}\t${ext}\t${buf.length}\t${page}`);
      return [story.slug,ext];
    }catch{}
  }
  const images=[]; // Do not trust generic image-search results; they often mismatch niche titles.
  for(const item of images.slice(0,12)){
    try{
      const r=await fetch(item.murl,{headers:{'user-agent':'Mozilla/5.0','referer':item.purl||'https://www.bing.com/'},redirect:'follow'});if(!r.ok)continue;
      const type=(r.headers.get('content-type')||'').toLowerCase();const ext=type.includes('png')?'png':type.includes('webp')?'webp':type.includes('jpeg')||type.includes('jpg')?'jpg':'';if(!ext)continue;
      const buf=Buffer.from(await r.arrayBuffer());if(buf.length<25000||buf.length>8_000_000)continue;
      fs.writeFileSync(path.join(root,'assets/img',`news-${story.slug}.${ext}`),buf);console.log(`${story.slug}\t${ext}\t${buf.length}\t${item.purl||item.murl}`);return [story.slug,ext];
    }catch{}
  }
  try{
    const q=story.en.replace(/\b(reveals|releases|announces|confirms|details|comes|launches|adds|shares|includes|outlines).*$/i,'').trim()+' official trailer';
    const html=await fetch('https://www.youtube.com/results?search_query='+encodeURIComponent(q),{headers:{'user-agent':'Mozilla/5.0'}}).then(r=>r.text());
    const ids=[...html.matchAll(/"videoId":"([\w-]{11})"/g)].map(m=>m[1]).filter((x,i,a)=>a.indexOf(x)===i);
    for(const id of ids.slice(0,5)){
      for(const quality of ['maxresdefault','hqdefault']){
        const u=`https://i.ytimg.com/vi/${id}/${quality}.jpg`;const r=await fetch(u);if(!r.ok)continue;const buf=Buffer.from(await r.arrayBuffer());if(buf.length<25000)continue;
        fs.writeFileSync(path.join(root,'assets/img',`news-${story.slug}.jpg`),buf);console.log(`${story.slug}\tjpg\t${buf.length}\thttps://www.youtube.com/watch?v=${id}`);return [story.slug,'jpg'];
      }
    }
  }catch{}
  throw new Error('No suitable image: '+story.slug);
}

const map={};
for(const story of stories){
  const [slug,ext]=await download(story);map[slug]=ext;
  await new Promise(r=>setTimeout(r,180));
}
fs.writeFileSync(path.join(root,'assets/news-image-map.json'),JSON.stringify(map,null,2)+'\n');
console.log(`Saved ${Object.keys(map).length} mapped images.`);
