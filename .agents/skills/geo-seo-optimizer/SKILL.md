---
name: geo-seo-optimizer
description: AI Search Visibility (GEO/AEO), entity optimization, and international bilingual (VI/EN) search scoring for ChatGPT, Claude, Perplexity, and Google AI Overviews.
---

# ?? Generative Engine Optimization (GEO) & AI Search Visibility Skill

## M?c dích
K? nang này cung c?p b? quy t?c, tiêu chu?n và phuong pháp t?i uu hóa bài vi?t và c?u trúc website OtaHub d? d?t kh? nang trích d?n t?i da (AI citation visibility) trên các mô hình ngôn ng? l?n (ChatGPT Search, Perplexity AI, Claude, Google AI Overviews, Microsoft Copilot).

---

## 1. Nguyên T?c C?t Lõi C?a GEO 2026

### A. T?i Uu Hóa Th?c Th? (Entity-First Optimization)
- Xác d?nh rõ ràng các th?c th? chính trong bài vi?t:
  - **Tên tác ph?m / Game**: Ví d? `Black Myth: Wukong`, `Solo Leveling: Ragnarok`, `Elden Ring`.
  - **Nhà phát tri?n / Studio**: `Game Science`, `A-1 Pictures`, `FromSoftware`, `MAPPA`.
  - **Nhà phát hành & N?n t?ng**: `PlayStation 5`, `PC (Steam)`, `Nintendo Switch 2`.
  - **M?c th?i gian phát hành**: Tháng, quý ho?c nam c? th? (`Tháng 10/2026`, `Mùa Thu 2026`).
- Tránh thông tin mo h?, luôn d?nh lu?ng thông s? (giá bán, dung lu?ng t?i, th?i lu?ng gameplay, di?m dánh giá).

### B. Kh?i Tóm T?t Tr?c Ti?p (Answer Capsule / Highlight Box)
- LLM luôn uu tiên quét và trích d?n các do?n tóm lu?c có c?u trúc ? d?u bài vi?t:
  - S? d?ng kh?i `.highlight-box` v?i class `.hb-label` và `.hb-text`.
  - Li?t kê t? 3–5 g?ch d?u dòng cô d?ng câu tr? l?i tr?c ti?p cho câu h?i ngu?i dùng tìm ki?m (Ai? Cái gì? Khi nào? ? dâu? Có gì m?i?).

### C. D? Li?u B?ng & Danh Sách Có C?u Trúc
- Chuy?n các thông s? k? thu?t ph?c t?p thành b?ng `.info-table`:
  ```html
  <table class="info-table">
    <tr><th>Thông S?</th><th>Chi Ti?t</th></tr>
    <tr><td>T?a Game</td><td>Black Myth: Wukong DLC</td></tr>
    <tr><td>Ngày Ra M?t</td><td>Q3/2026</td></tr>
  </table>
  ```

---

## 2. Tiêu Chu?n Song Ng? VI / EN (International SEO)
- M?i bài vi?t ti?ng Vi?t d?u có th? `hreflang`:
  ```html
  <link rel="alternate" hreflang="vi" href="https://otahub.asia/[slug]">
  <link rel="alternate" hreflang="en" href="https://otahub.asia/en/[slug]">
  <link rel="alternate" hreflang="x-default" href="https://otahub.asia/[slug]">
  ```
- Ð?m b?o th? `canonical` luôn tr? chính xác v? URL tuy?t d?i c?a chính trang dó.
- C?p nh?t c? `llms.txt` và `en/llms.txt` d? AI crawler phân lu?ng ngôn ng? chính xác.

---

## 3. Quy Trình Ki?m Ð?nh GEO
1. Ki?m tra tiêu d? có ch?a t? khóa th?c th? chính.
2. Ki?m tra có kh?i tóm t?t di?m nh?n `.highlight-box`.
3. Ki?m tra các liên k?t n?i b? liên quan (`/tag?q=...` ho?c bài vi?t cùng ch? d?).
4. Ki?m tra JSON-LD schema NewsArticle có d?y d? th?c th? tác gi? và t? ch?c.
