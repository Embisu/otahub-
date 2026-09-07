---
trigger: always_on
---

# ??? OtaHub Core Engineering & Safety Rules

1. **B?o v? `admin.html`**: Không bao gi? ch?y các script find-and-replace regex hàng lo?t lên file `admin.html`. M?i thay d?i trong file này ph?i ki?m tra b?ng `node scripts/verify-admin-syntax.mjs`.
2. **Ki?m d?nh k? thu?t b?t bu?c**: Sau m?i l?n ch?nh s?a HTML/JS/CSS, b?t bu?c ch?y `node scripts/site-audit.mjs` và d?m b?o k?t qu? là `issueCount: 0`.
3. **Quy t?c Commit**: Không t? ý th?c hi?n `git add`, `git commit`, ho?c `git push` tr? khi có yêu c?u tr?c ti?p t? ngu?i dùng. Luôn xu?t danh sách file thay d?i rõ ràng.
4. **Chu?n Template**: M?i bài vi?t ph?i n?p `/assets/article-style.css`, s? d?ng b? c?c chu?n Hero Full-Bleed + 2 C?t và schema E-E-A-T d?y d?.
