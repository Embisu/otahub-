"""Ảnh bìa ghép 3 khung xiên cho bài viết.

Mỗi khung là một ảnh gốc; ranh giới giữa hai khung là một đường xiên. Khe tối và vạch màu
(hồng ở khe 1, xanh ở khe 2) được vẽ đúng trên đường ranh giới đó, nên không đè lên nội dung khung.

Chạy:  python scripts/build-collage.py            (tạo các ảnh trong COLLAGES)
Ảnh cache "immutable": khi sửa một ảnh đã đăng, đặt tên file mới rồi đổi đường dẫn trong bài.
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(__file__), '..')
IMG = os.path.join(ROOT, 'assets', 'img')
W, H = 1920, 1080
SLANT = 70          # độ xiên: đỉnh khe lệch phải SLANT px, đáy lệch trái SLANT px so với tâm khe
GAP = 12            # bề rộng khe tối
LINE = 4            # bề rộng vạch màu (nằm giữa khe)
COLORS = [(255, 33, 119), (0, 242, 255)]

COLLAGES = {
    'gears-of-war-e-day-review-hero-v2.jpg': [
        # (file, vùng cắt theo tỉ lệ trái, trên, phải, dưới): bỏ dải phụ đề trong game ở mép dưới
        ('gears-of-war-e-day-review-kalona-street.jpg', (0, 0, 1, 0.84)),
        'gears-of-war-e-day-review-marcus-fenix.jpg',
        ('gears-of-war-e-day-review-gunship-explosion.jpg', (0, 0, 1, 0.84)),
    ],
    'top-game-mobile-cay-cuoc-hero-v2.jpg': [
        'top-game-mobile-cay-cuoc-where-winds-meet-1.jpg',
        'top-game-mobile-cay-cuoc-aion-2-1.jpg',
        'top-game-mobile-cay-cuoc-aniimo-2.jpg',
    ],
}


def cover(im):
    """Phóng ảnh phủ kín khung W x H, cắt phần thừa ở giữa."""
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((x, y, x + W, y + H))


def seam_x(c, y):
    """Toạ độ x của khe có tâm c tại độ cao y (đường thẳng từ (c+SLANT, 0) tới (c-SLANT, H))."""
    return c + SLANT - 2 * SLANT * y / H


def build(out, sources):
    n = len(sources)
    centers = [W * (i + 1) / n for i in range(n - 1)]          # tâm các khe
    edges = [-10 * W] + centers + [10 * W]
    canvas = Image.new('RGB', (W, H), (11, 4, 24))
    for i, src in enumerate(sources):
        src, box = src if isinstance(src, tuple) else (src, (0, 0, 1, 1))
        im = Image.open(os.path.join(IMG, src)).convert('RGB')
        im = cover(im.crop((round(box[0] * im.width), round(box[1] * im.height), round(box[2] * im.width), round(box[3] * im.height))))
        # dời ảnh để tâm ảnh nằm giữa khung của nó
        mid = (max(edges[i], 0) + min(edges[i + 1], W)) / 2
        shifted = Image.new('RGB', (W, H), (11, 4, 24))
        shifted.paste(im, (round(mid - W / 2), 0))
        mask = Image.new('L', (W, H), 0)
        left, right = edges[i], edges[i + 1]
        poly = [(seam_x(left, 0) if i else -1, 0), (seam_x(right, 0) if i < n - 1 else W + 1, 0),
                (seam_x(right, H) if i < n - 1 else W + 1, H), (seam_x(left, H) if i else -1, H)]
        ImageDraw.Draw(mask).polygon(poly, fill=255)
        canvas.paste(shifted, (0, 0), mask)
    d = ImageDraw.Draw(canvas)
    for k, c in enumerate(centers):
        top, bot = (seam_x(c, 0), 0), (seam_x(c, H), H)
        d.line([top, bot], fill=(11, 4, 24), width=GAP)
        d.line([top, bot], fill=COLORS[k % len(COLORS)], width=LINE)
    canvas.save(os.path.join(IMG, out), quality=88)
    print('ok', out)


if __name__ == '__main__':
    for out, sources in COLLAGES.items():
        build(out, sources)
