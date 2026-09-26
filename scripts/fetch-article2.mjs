async function run() {
  const res = await fetch('https://cuoi.tuoitre.vn/anime-bride-of-the-barrier-master-len-netflix-thang-1-2027-he-lo-trailer-moi-10026092511080371.htm');
  const html = await res.text();
  
  const fckM = html.match(/<div class="fck"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i) || html.match(/class="fck"[^>]*>([\s\S]*?)<\/section>/i);
  if (fckM) {
    const pList = [...fckM[0].matchAll(/<(?:p|h2|h3)[^>]*>([\s\S]*?)<\/(?:p|h2|h3)>/gi)]
      .map(m => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(t => t.length > 20);
    console.log(`Số đoạn: ${pList.length}`);
    pList.forEach((p, idx) => console.log(`\n[Đoạn ${idx+1}]: ${p}`));
  }
}
run();
