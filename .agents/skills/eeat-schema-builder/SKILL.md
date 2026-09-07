---
name: eeat-schema-builder
description: Build, validate, and audit advanced Schema.org JSON-LD structured data (Organization, Person, NewsArticle, BreadcrumbList, Review) for maximum Google E-E-A-T and rich results.
---

# ??? E-E-A-T & Advanced Schema.org Builder Skill

## M?c dích
Ð?m b?o 100% d? li?u có c?u trúc (Schema.org JSON-LD) trên OtaHub dáp ?ng tiêu chu?n E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) cao nh?t theo d?nh hu?ng c?a Google Search Central và Schema Validator 2026.

---

## 1. C?u Trúc Schema NewsArticle Chu?n E-E-A-T

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Tiêu d? bài vi?t chu?n",
  "description": "Mô t? bài vi?t 120-160 ký t?",
  "image": "https://otahub.asia/assets/img/ten-anh.jpg",
  "datePublished": "2026-09-06T08:30:00+07:00",
  "dateModified": "2026-09-06T08:30:00+07:00",
  "inLanguage": "vi",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://otahub.asia/[slug]"
  },
  "author": {
    "@type": "Person",
    "name": "OtaHub Editorial",
    "url": "https://otahub.asia/about",
    "jobTitle": "Ban Biên T?p",
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
```

---

## 2. C?u Trúc Schema Review Ðánh Giá (Dành cho Trang Reviews)

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "VideoGame",
    "name": "Tên Game / Anime",
    "applicationCategory": "Game"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "9.0",
    "bestRating": "10",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": "OtaHub Editorial",
    "url": "https://otahub.asia/about"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://otahub.asia/#organization",
    "name": "OtaHub"
  }
}
```

---

## 3. Công C? Ki?m Tra & Nâng C?p T? Ð?ng
- Ch?y phân tích schema toàn site: `node scripts/analyze-schemas.mjs`
- Ch?y nâng c?p schema t? d?ng: `node scripts/upgrade-schemas-eeat.mjs`
- Ki?m tra toàn di?n schema: `node scripts/site-audit.mjs`
