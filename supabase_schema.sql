-- ════════════════════════════════════════════════════════════════════════
-- OTAHUB ASIA - SUPABASE COMPLETE DATABASE SCHEMA & REALTIME SETUP
-- ════════════════════════════════════════════════════════════════════════

-- 1. BẢNG ĐẾM LƯỢT XEM THỜI GIAN THỰC (PAGE VIEWS & TRENDING)
CREATE TABLE IF NOT EXISTS public.article_views (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_slug TEXT NOT NULL UNIQUE,
    article_title TEXT,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index tìm kiếm slug siêu tốc
CREATE INDEX IF NOT EXISTS idx_article_views_slug ON public.article_views(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_views_count ON public.article_views(view_count DESC);

-- Hàm RPC tăng lượt xem an toàn, không bị race condition
CREATE OR REPLACE FUNCTION public.increment_page_view(p_slug TEXT, p_title TEXT DEFAULT '')
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_views BIGINT;
BEGIN
    INSERT INTO public.article_views (article_slug, article_title, view_count, updated_at)
    VALUES (p_slug, p_title, 1, NOW())
    ON CONFLICT (article_slug)
    DO UPDATE SET 
        view_count = public.article_views.view_count + 1,
        article_title = COALESCE(NULLIF(p_title, ''), public.article_views.article_title),
        updated_at = NOW()
    RETURNING view_count INTO v_views;
    
    RETURN v_views;
END;
$$;

-- 2. BẢNG BÌNH LUẬN & THẢO LUẬN REALTIME (COMMENTS)
CREATE TABLE IF NOT EXISTS public.comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_slug TEXT NOT NULL,
    parent_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT DEFAULT 'https://otahub.asia/assets/img/avatar-default.png',
    author_email TEXT,
    content TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'approved', -- 'approved', 'pending', 'hidden'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_slug ON public.comments(article_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);

-- 3. BẢNG THẢ REACTION (EMOJI INTERACTIONS)
CREATE TABLE IF NOT EXISTS public.article_reactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_slug TEXT NOT NULL,
    reaction_type TEXT NOT NULL, -- 'fire', 'love', 'clap', 'mindblown', 'insight'
    count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_article_reaction UNIQUE (article_slug, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_reactions_slug ON public.article_reactions(article_slug);

-- Hàm RPC tăng reaction
CREATE OR REPLACE FUNCTION public.increment_reaction(p_slug TEXT, p_reaction TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count BIGINT;
BEGIN
    INSERT INTO public.article_reactions (article_slug, reaction_type, count, updated_at)
    VALUES (p_slug, p_reaction, 1, NOW())
    ON CONFLICT (article_slug, reaction_type)
    DO UPDATE SET 
        count = public.article_reactions.count + 1,
        updated_at = NOW()
    RETURNING count INTO v_count;
    
    RETURN v_count;
END;
$$;

-- 4. BẢNG ĐÁNH GIÁ ĐIỂM CỘNG ĐỒNG (COMMUNITY RATINGS)
CREATE TABLE IF NOT EXISTS public.article_ratings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_slug TEXT NOT NULL,
    score NUMERIC(3,1) NOT NULL CHECK (score >= 1.0 AND score <= 10.0),
    user_fingerprint TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_article_rating UNIQUE (article_slug, user_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_ratings_slug ON public.article_ratings(article_slug);

-- 5. BẢNG ĐĂNG KÝ BẢN TIN (NEWSLETTER SUBSCRIBERS)
CREATE TABLE IF NOT EXISTS public.subscribers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'homepage',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════════
-- PHÂN QUYỀN BẢO MẬT (ROW LEVEL SECURITY - RLS POLICIES)
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc views, reactions, ratings, comments đã duyệt
CREATE POLICY "Public Read Views" ON public.article_views FOR SELECT USING (true);
CREATE POLICY "Public Read Reactions" ON public.article_reactions FOR SELECT USING (true);
CREATE POLICY "Public Read Ratings" ON public.article_ratings FOR SELECT USING (true);
CREATE POLICY "Public Read Approved Comments" ON public.comments FOR SELECT USING (status = 'approved');

-- Cho phép gửi bình luận, ratings, newsletter
CREATE POLICY "Public Insert Comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Ratings" ON public.article_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);

-- Bật Realtime cho bảng comments và reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.article_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.article_views;

-- 6. TẠO STORAGE BUCKET CHO KHO ẢNH (MEDIA UPLOADS)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('otahub-media', 'otahub-media', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép đọc ảnh công khai từ bucket otahub-media
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'otahub-media');
-- Cho phép upload ảnh
CREATE POLICY "Public Upload Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'otahub-media');
