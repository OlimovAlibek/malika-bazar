-- ================================================================
-- Schema o'zgarishlari — Supabase SQL Editor ga tashlang (bir marta)
-- ================================================================

-- 0. auth_tokens — OTP kirish uchun vaqtinchalik tokenlar
CREATE TABLE IF NOT EXISTS auth_tokens (
  token        text        PRIMARY KEY,
  telegram_id  bigint,         -- foydalanuvchi telegram_id
  role         text,           -- 'seller' | 'buyer' — tasdiqlanganda
  user_id      uuid,           -- sellers.id yoki buyers.id — tasdiqlanganda
  otp          text,           -- 6 xonali OTP kod
  phone        text,           -- kiritilgan telefon raqami
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Mavjud jadvalga ustun qo'shish (agar allaqachon yaratilgan bo'lsa)
ALTER TABLE auth_tokens ADD COLUMN IF NOT EXISTS otp   text;
ALTER TABLE auth_tokens ADD COLUMN IF NOT EXISTS phone text;

-- 0b. Xaridorga avatar maydon qo'shish
ALTER TABLE buyers ADD COLUMN IF NOT EXISTS avatar_url text;

-- 1. Sotuvchiga telegram_username va parol maydoni qo'shish
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS telegram_username text;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS password_hash    text;

-- 2. v_sellers — sotuvchilar + do'kon + mahsulotlar soni
DROP VIEW IF EXISTS v_sellers;
CREATE VIEW v_sellers AS
SELECT
  sel.id,
  sel.full_name,
  sel.phone,
  sel.telegram_id,
  sel.telegram_username,
  sel.is_blocked,
  sel.created_at,
  sel.last_active_at,
  sh.id            AS shop_id,
  sh.name          AS shop_name,
  sh.slug          AS shop_slug,
  sh.is_active     AS shop_is_active,
  sh.room_code,
  sh.phone         AS shop_phone,
  sh.banner_url,
  sh.avatar_url,
  COUNT(p.id)      AS products_count
FROM       sellers  sel
LEFT JOIN  shops    sh ON sh.seller_id  = sel.id
LEFT JOIN  products p  ON p.shop_id    = sh.id AND p.is_active = true
GROUP BY sel.id, sh.id;

-- 3. v_buyers — xaridorlar + sevimlilar soni
CREATE OR REPLACE VIEW v_buyers AS
SELECT
  b.id,
  b.telegram_id::text AS telegram_id,
  b.first_name,
  b.last_name,
  b.username,
  b.phone,
  b.is_blocked,
  b.joined_at,
  b.last_active_at,
  COUNT(f.product_id) AS favorites_count
FROM buyers b
LEFT JOIN favorites f ON f.buyer_id = b.id
GROUP BY b.id;

-- 4. v_admin_products — admin uchun barcha mahsulotlar (faol + nofaol)
CREATE OR REPLACE VIEW v_admin_products AS
SELECT
  p.id,
  p.slug,
  p.brand,
  p.model,
  p.storage_gb,
  p.color,
  p.condition,
  p.price_uzs,
  p.is_active,
  p.created_at,
  p.updated_at,
  s.id        AS shop_id,
  s.name      AS shop_name,
  s.slug      AS shop_slug,
  s.room_code,
  img.url     AS primary_image_url
FROM      products       p
JOIN      shops          s   ON s.id = p.shop_id
LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = true;
