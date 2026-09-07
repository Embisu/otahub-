# ?? OtaHub Editorial & Publishing Runbook (Quy Trình Xu?t B?n Chu?n)

*Phiên b?n: 2.0 (Tháng 9/2026)*  
*Áp d?ng cho: Biên t?p viên, Nhà phát tri?n và H? th?ng AI/Automation.*

---

## 1. T?ng Quan Quy Trình

Khi xu?t b?n m?t bài vi?t m?i ho?c c?p nh?t hàng lo?t trang trên OtaHub, quy trình ph?i tuân th? nghiêm ng?t theo các bu?c du?i dây d? d?m b?o tính toàn v?n c?a mã ngu?n, tính chu?n xác v? SEO/GEO và d?ng b? d? li?u.

```mermaid
flowchart TD
    A[1. So?n th?o & Chu?n b?] --> B[2. Xu?t b?n qua Admin Panel ho?c Script]
    B --> C[3. Ð?ng b? Sitemap & Hubs]
    C --> D[4. Ki?m d?nh K? thu?t (Site Audit)]
    D --> E{0 L?i K? thu?t?}
    E -- Có l?i --> F[Kh?c ph?c l?i] --> D
    E -- 0 L?i --> G[5. Ping IndexNow & LLM Ingestion]
    G --> H[6. Review Diff & Commit]
```

---

## 2. Các Bu?c Th?c Hi?n

### Bu?c 1: So?n Th?o & Chu?n B? Bài Vi?t
- **Tiêu d? (Title)**: 60–80 ký t?, ch?a t? khóa chính, không gi?t tít sai s? th?t.
- **Mô t? (Description)**: 120–160 ký t?, súc tích, tóm lu?c di?m nh?n quan tr?ng.
- **?nh d?i di?n (Hero Image)**:
  - T? l? chu?n: `16:9` (khuy?n ngh? 1200x675 ho?c 1920x1080).
  - Ð?nh d?ng: `.webp`, `.png`, ho?c `.jpg`.
  - Luu tr? t?i: `assets/img/` ho?c upload qua Supabase CDN/GitHub uploads.
- **N?i dung bài vi?t**:
  - T?i thi?u 600–900+ ch? d?i v?i tin t?c phân tích / dánh giá.
  - Ph?i có các th? tiêu d? `<h2>`, `<h3>` phân do?n m?ch l?c.
  - S? d?ng kh?i `.highlight-box` (Tóm t?t di?m nh?n) ? d?u bài.
  - T?i thi?u 3–5 th? tag phân lo?i (`.sb-tag` ho?c `.am-tag`) tr? v? `/tag?q=...`.

### Bu?c 2: Xu?t B?n (Qua Admin Panel ho?c Script)
- **Cách 1: Qua Admin Panel ([`admin.html`](file:///d:/ANBU%202/WEBSITE/otahub-source/admin.html))**:
  - Ðang nh?p vào `/admin`.
  - Ch?n danh m?c (`Gaming`, `Anime`, `Manga`, `Reviews`, `Rankings`, `Guides`).
  - Nh?p tiêu d?, URL slug t? d?ng, ?nh cover, tóm t?t và n?i dung kh?i.
  - B?m **"Xu?t b?n bài vi?t"** (H? th?ng t? d?ng sinh JSON-LD E-E-A-T chu?n).
- **Cách 2: T?o th? công qua Node.js Script**:
  - Dùng template chu?n tham chi?u t?i `templates/partials/`.

### Bu?c 3: Ð?ng B? Hubs & Sitemap
Sau khi t?o file HTML bài vi?t m?i, ch?y các script sau theo th? t?:

```bash
# 1. Ð?ng b? bài m?i lên các trang Hub danh m?c (anime.html, gaming.html, index.html...)
node scripts/sync-all-indexes-and-hubs.mjs

# 2. C?p nh?t sitemap.xml và feed.xml
node scripts/sync-all-pages-to-sitemap.mjs
```

### Bu?c 4: Ki?m Ð?nh K? Thu?t (Site Audit)
**B?t bu?c ch?y tru?c khi commit b?t k? thay d?i nào:**

```bash
# Ki?m tra cú pháp admin panel
node scripts/verify-admin-syntax.mjs

# Ki?m tra toàn b? 420+ trang (Link v?, ?nh thi?u, duplicate ID, hreflang, schema)
node scripts/site-audit.mjs
```
> [!IMPORTANT]
> L?nh `site-audit.mjs` **b?t bu?c ph?i tr? v? `issueCount: 0`**. N?u có b?t k? issue nào, ph?i x? lý d?t di?m tru?c khi chuy?n sang bu?c k? ti?p.

### Bu?c 5: Kích Ho?t IndexNow (Google / Bing / Yandex)
Thông báo cho các công c? tìm ki?m v? URL m?i:

```bash
node scripts/ping-indexnow.mjs
```

### Bu?c 6: Review Diff & Commit
- Ch?y `git diff` ho?c `git status` d? ki?m tra chính xác danh sách file thay d?i.
- **TUY?T Ð?I KHÔNG** ch?y các script regex find-and-replace hàng lo?t trên file `admin.html` d? tránh làm h?ng mã ngu?n JavaScript.
- Ngu?i ph? trách review l?i diff và th?c hi?n `git commit` v?i thông di?p rõ ràng theo chu?n Conventional Commits (ví d?: `feat(news): publish solo leveling ragnarok anime update`).

---

## 3. Danh M?c Các Script V?n Hành Chính

| Script | M?c Ðích | Khi Nào S? D?ng |
| :--- | :--- | :--- |
| [`scripts/site-audit.mjs`](file:///d:/ANBU%202/WEBSITE/otahub-source/scripts/site-audit.mjs) | Quét toàn di?n 420+ trang HTML v? link, ?nh, SEO, hreflang, schema | M?i l?n tru?c khi commit |
| [`scripts/verify-admin-syntax.mjs`](file:///d:/ANBU%202/WEBSITE/otahub-source/scripts/verify-admin-syntax.mjs) | Ki?m tra tính h?p l? c?a JS trong admin.html | Sau khi s?a admin panel |
| [`scripts/sync-all-pages-to-sitemap.mjs`](file:///d:/ANBU%202/WEBSITE/otahub-source/scripts/sync-all-pages-to-sitemap.mjs) | C?p nh?t `sitemap.xml` và `feed.xml` | Sau khi t?o bài vi?t m?i |
| [`scripts/ping-indexnow.mjs`](file:///d:/ANBU%202/WEBSITE/otahub-source/scripts/ping-indexnow.mjs) | G?i tín hi?u IndexNow t?i công c? tìm ki?m | Sau khi deploy bài m?i |
| [`scripts/upgrade-schemas-eeat.mjs`](file:///d:/ANBU%202/WEBSITE/otahub-source/scripts/upgrade-schemas-eeat.mjs) | Nâng c?p JSON-LD Organization & Person cho bài vi?t | Khi c?p nh?t chu?n SEO |
