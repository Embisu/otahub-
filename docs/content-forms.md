# OtaHub content forms

Three fixed forms. Every new article uses one of them. Voice: natural editorial prose (like a good entertainment desk), no meta talk about how the article was researched, no invented hands-on experience. Facts must come from at least one verified source; unverified numbers are left out.

Voice, signature blocks (Nắm nhanh, Góc OtaHub, FAQ, Nguồn), banned phrases and the pre-publish checklist: see `docs/GIONG-VAN-OTAHUB.md`.

## Common rules
- Title: 40-55 characters, name of the work first, one key fact (date, platform, number). No "review chuyên sâu" style fillers.
- Sapo / description (also `art-hero-excerpt`, meta description, search excerpt): 1-2 sentences containing who, what, when, where.
- Headings are descriptive sentences or noun phrases ("Câu chuyện ve...", "Đội ngũ thực hiện"), never labels like "Điều đã biết".
- Dates in text: `d/m/yyyy`. Names in original spelling. Japanese title in parentheses on first mention.
- Tags: 6-8, real entities that appear in the text (work, studio, publisher, platform, format, year).
- Images: cover 16:9 (>= 1200 px wide) + at least one inline image per 400 words, each with a `figcaption` naming the source. Never reuse an image across articles.
- Closing line states what is still unannounced. Sources line at the end: "Nguồn tham khảo: ...".

## Form A - News (announcement)
1. Paragraph 1: the announcement in full (work, original title, date, platform, who announced it and when).
2. Paragraph 2: distribution details and what is not yet announced.
3. Paragraph 3: what the trailer/visual shows.
4. `H2 Dàn diễn viên lồng tiếng` (leads first, newcomers second, one line of context on notable earlier roles).
5. `H2 Câu chuyện về ...` (premise in 2 paragraphs, no ending spoilers).
6. `H2 Đội ngũ thực hiện` (studio + previous works, director, character design, script, music).
7. `H2 Sức hút của nguyên tác` (author, publisher, volumes, copies, awards).
8. Closing paragraph (premiere window, platforms, pending info) + sources line.

## Form B - Feature / list ("anime đáng xem ...")
1. Sapo paragraph framing the theme and who it is for.
2. 2-3 `H2` groups, each with 1-2 `H3` entries named `English title (Japanese romaji)`.
3. Each entry, 2 paragraphs: (a) setting/era, protagonist, premise; (b) what makes it distinct + production and reception facts (creator, dates, awards, platform). One inline image per entry.
4. `H2 Nên bắt đầu từ đâu?` short recommendation per entry + one internal link.
5. Sources line.

## Form C - Review
Reference page: `/girls-frontline-2-exilium-danh-gia-chuyen-sau` (and its EN pair).
1. Sapo + `highlight-box` "Kết luận nhanh" (who it is for, main trade-off, score + band).
2. `H2 Thông tin nhanh`: `art-table` (developer/studio, release dates incl. Vietnam if any, platforms, model/price, **Chơi/Xem ở đâu** with official links, critic or user scores with date, Điểm OtaHub X/10 + band).
3. Body sections (`Câu chuyện`, `Bối cảnh sản xuất`, `Trải nghiệm` with `H3`s, or topic-specific H2s), one inline image per ~400 words, official screenshots with source in `figcaption`.
4. `H2 Điểm mạnh và điểm yếu`: `review-pros-cons` (two `review-panel`s).
5. `H2 Giới phê bình nói gì`: named outlets and scores, user scores with the date taken.
6. `H2 Điểm OtaHub`: one `review-verdict` block (`<span class="score-num">` is what `build-rankings.mjs` reads; `<small>` = band from the review standards; `score-verdict` = one-line verdict; `score-sub` = 1-2 sentence verdict) followed by `review-score-grid` with the **4 standard criteria and weights** (Cốt truyện & Nội dung 25%, Trải nghiệm 30%, Hình ảnh & Âm thanh 25%, Giá trị lâu dài 20%; weighted average within ±0.2 of the score) and the link to `/tieu-chuan-danh-gia`. Never a second score box.
7. `Dành cho ai` / `Kết luận`, then `Câu hỏi thường gặp` as `review-faq` `<details>` (3-5 Q&A, mirrored in FAQPage JSON-LD).
8. `p.source-note` with linked sources. JSON-LD: NewsArticle + FAQPage + **Review** (itemReviewed VideoGame / TVSeries / Movie / Book / Product, reviewRating 0-10).
Builder used for the conversion: `review_upgrade.py` / `convert_reviews.py` (working scripts); after any review change run `npm run scores`.
