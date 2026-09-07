---
name: engineering-code-review
description: Structured code review, diff inspection, admin.html script safety enforcement, and tech-debt management for multi-agent OtaHub development.
---

# ??? Engineering Code Review & Safety Skill

## M?c dích
B?o v? mã ngu?n OtaHub kh?i các l?i do script t? d?ng ho?c nhi?u agent cùng can thi?p, d?c bi?t là b?o v? toàn v?n logic JavaScript ph?c t?p trong `admin.html`.

---

## 1. Quy T?c Vàng Khi S?a Mã Ngu?n

### A. Tuy?t Ð?i Không Ch?y Script Regex Thay Th? Hàng Lo?t Trên `admin.html`
- `admin.html` ch?a hon 6.800 dòng code g?m regexes, template strings, iframe bridge scripts và Supabase handlers.
- Các script t? d?ng s?a HTML (nhu s?a class, thêm thu?c tính img, deduplicate id) **B?T BU?C** ph?i lo?i tr? `admin.html`.

### B. Ki?m Tra Cú Pháp JS B?ng Node Sandbox Tru?c Khi Hoàn T?t
- B?t k? thay d?i nào trong `admin.html` ph?i du?c ki?m tra b?ng:
  ```bash
  node scripts/verify-admin-syntax.mjs
  ```

### C. Quy T?c Không T? Ý Commit / Push
- Ch? commit và push khi có yêu c?u rõ ràng t? ngu?i dùng.
- Sau khi ch?nh s?a, li?t kê danh sách file c? th? d? ngu?i ph? trách ki?m tra tru?c.
