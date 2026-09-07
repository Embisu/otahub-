---
name: design-system-audit
description: Ensure article template compliance with OtaHub Design System: hero full-bleed, 2-column layout, highlight-box, info-table, and dynamic tag explorer routing.
---

# ?? Design System & Template Audit Skill

## M?c dích
Ð?m b?o t?t c? các bài vi?t m?i và bài vi?t cu trên OtaHub d?u tuân th? 100% ngôn ng? thi?t k? chung Cyberpunk Dark Neon / Glassmorphism và layout 2 c?t d?ng nh?t.

---

## 1. Checklist Ki?m Tra Giao Di?n Chu?n

- [ ] S? d?ng stylesheet dùng chung `<link rel="stylesheet" href="/assets/article-style.css">`.
- [ ] Header bài vi?t có c?u trúc `<header class="art-hero">` v?i ?nh n?n `background-image` full-bleed.
- [ ] B? c?c bài vi?t n?m trong `<div class="art-layout">` g?m `<main class="art-main">` và `<aside class="art-sidebar">`.
- [ ] Kh?i tóm t?t di?m nh?n `.highlight-box` d?t ngay tru?c thân bài.
- [ ] Hình ?nh trong thân bài du?c b?c trong `<figure class="art-fig">` có `<figcaption>` chú thích.
- [ ] Các th? tag phân lo?i (`.tag`, `.sb-tag`, `.am-tag`) tr? v? `/tag?q=...` d? kích ho?t Dynamic Tag Explorer.
