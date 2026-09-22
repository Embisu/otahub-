-- ════════════════════════════════════════════════════════════════════════
-- OTAHUB ASIA — HARDENING SAU AUDIT BAO MAT (chay 1 lan trong Supabase
-- Dashboard → SQL Editor, KHONG can mat khau database, chi can dang nhap
-- Supabase bang tai khoan cua ban).
-- ════════════════════════════════════════════════════════════════════════

-- 1. Thu hoi quyen upload cong khai vao Storage.
--    Tinh nang nay (otahubSupabaseStorageUpload trong admin.html) da bi go bo
--    vi khong con duoc su dung — truoc do policy nay cho phep BAT KY AI, khong
--    can dang nhap, upload file bat ky (khong gioi han loai/kich thuoc) vao
--    bucket otahub-media.
DROP POLICY IF EXISTS "Public Upload Storage" ON storage.objects;

-- 2. Xac nhan khong co policy UPDATE/DELETE cong khai nao tren bang comments.
--    Viec duyet/danh dau spam/xoa binh luan gio di qua Cloudflare Worker
--    (dung SUPABASE_SERVICE_ROLE_KEY luu server-side, co xac thuc session +
--    phan quyen admin/editor), KHONG con goi truc tiep tu trinh duyet bang
--    anon/publishable key nhu truoc. Cau lenh duoi day chi la don dep phong
--    truong hop co policy cu ton tai — an toan de chay du policy co ton tai
--    hay khong.
DROP POLICY IF EXISTS "Public Update Comments" ON public.comments;
DROP POLICY IF EXISTS "Public Delete Comments" ON public.comments;

-- 3. QUAN TRONG — kiem tra thu cong sau khi chay script nay:
--    Vao Authentication → Policies → bang "comments" va "storage.objects"
--    trong Supabase Dashboard, xac nhan KHONG con policy nao khac cho phep
--    UPDATE/DELETE tren comments hoac INSERT tren storage.objects voi role
--    "public"/"anon" ngoai nhung gi liet ke trong supabase_schema.sql (SELECT
--    va INSERT tren comments/ratings/subscribers, SELECT tren storage). Neu
--    co script/nguoi khac da tao them policy truoc day khong nam trong file
--    schema goc, script DROP IF EXISTS o tren se khong bat duoc vi khac ten.
