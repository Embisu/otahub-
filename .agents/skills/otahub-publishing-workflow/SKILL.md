---
name: otahub-publishing-workflow
description: Complete standardized publishing runbook for OtaHub: article creation, cascading latest news, updating sitemaps/feeds, IndexNow pinging, and zero-defect site audits.
---

# ?? OtaHub Publishing Workflow Skill

## M?c dích
Hu?ng d?n các agent và biên t?p viên th?c hi?n dúng quy trình 6 bu?c xu?t b?n bài vi?t trên OtaHub mà không làm l?ch template, không làm h?ng sitemap, và d?m b?o 0 l?i k? thu?t.

---

## 1. Quy Trình V?n Hành 6 Bu?c

1. **Chu?n b? d? li?u**:
   - Tiêu d? SEO (60–80 ký t?), Mô t? (120–160 ký t?).
   - ?nh cover 16:9 luu trong `assets/img/`.
   - N?i dung t?i thi?u 600–900+ ch?, có `<h2>`, `<h3>`, `.highlight-box`, `.info-table`.
   - G?n 3–5 th? tag tr? v? `/tag?q=...`.

2. **T?o trang bài vi?t**:
   - T?o qua Admin Panel (`/admin`) ho?c clone t? Template chu?n.

3. **Ð?ng b? Hubs & Sitemap**:
   ```bash
   node scripts/sync-all-indexes-and-hubs.mjs
   node scripts/sync-all-pages-to-sitemap.mjs
   ```

4. **Ki?m tra K? thu?t B?t bu?c (0 L?i)**:
   ```bash
   node scripts/verify-admin-syntax.mjs
   node scripts/site-audit.mjs
   ```

5. **G?i tín hi?u IndexNow**:
   ```bash
   node scripts/ping-indexnow.mjs
   ```

6. **Báo cáo danh sách file cho ngu?i ph? trách review & commit**.
