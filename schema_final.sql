-- ================================================================
-- Tezku Marketplace — Final Production Schema
-- Supabase (PostgreSQL 15+)
-- Ushbu faylni yangi DB da bir marta ishlatish kifoya.
-- ================================================================

-- ----------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------
-- Helper: updated_at avtomatik yangilash
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------
-- Helper: URL-safe slug
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_slugify(input text)
RETURNS text LANGUAGE sql IMMUTABLE STRICT AS $$
  SELECT lower(
    regexp_replace(
      regexp_replace(
        unaccent(trim(input)),
        '[^a-zA-Z0-9\s\-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
$$;

-- ================================================================
-- 1. SELLERS
-- ================================================================
CREATE TABLE sellers (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      text        NOT NULL    CHECK (length(trim(full_name)) >= 2),
  phone          text        NOT NULL    UNIQUE CHECK (phone ~ '^\+\d{9,15}$'),
  telegram_id    bigint      UNIQUE,
  telegram_username text,
  password_hash  text,
  is_blocked     boolean     NOT NULL    DEFAULT false,
  created_at     timestamptz NOT NULL    DEFAULT now(),
  last_active_at timestamptz
);

CREATE INDEX idx_sellers_phone         ON sellers (phone);
CREATE INDEX idx_sellers_telegram_id   ON sellers (telegram_id);
CREATE INDEX idx_sellers_created_at    ON sellers (created_at DESC);
CREATE INDEX idx_sellers_active        ON sellers (created_at DESC)
  WHERE is_blocked = false;

-- ================================================================
-- 2. SHOPS
-- ================================================================
CREATE TABLE shops (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id         uuid        NOT NULL UNIQUE REFERENCES sellers(id) ON DELETE CASCADE,
  room_code         text,
  name              text        NOT NULL DEFAULT '',
  slug              text        NOT NULL UNIQUE  DEFAULT '',
  description       text,
  phone             text,
  telegram_username text,
  banner_url        text,
  avatar_url        text,
  is_active         boolean     NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_slug_format CHECK (slug = '' OR slug ~ '^[a-z0-9\-]+$')
) WITH (fillfactor = 85);

CREATE TRIGGER trg_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_shops_seller_id   ON shops (seller_id);
CREATE INDEX idx_shops_slug        ON shops (slug);
CREATE INDEX idx_shops_is_active   ON shops (is_active, created_at DESC);
CREATE INDEX idx_shops_active_slug ON shops (slug)
  WHERE is_active = true AND slug != '';
CREATE INDEX idx_shops_room_code   ON shops (room_code)
  WHERE room_code IS NOT NULL;

-- ================================================================
-- 3. PRODUCTS
-- ================================================================
CREATE TABLE products (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       uuid        NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  brand         text        NOT NULL,
  model         text        NOT NULL,
  slug          text        NOT NULL UNIQUE,
  storage_gb    int         CHECK (storage_gb IS NULL OR storage_gb > 0),
  ram_gb        int         CHECK (ram_gb IS NULL OR ram_gb > 0),
  color         text,
  condition     text        NOT NULL CHECK (condition IN ('new', 'used')),
  price_uzs     bigint      NOT NULL CHECK (price_uzs > 0),
  description   text,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector    NOT NULL DEFAULT ''
) WITH (fillfactor = 80);

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE FUNCTION fn_products_update_search()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.brand, '')),  'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.model, '')),  'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.color, '')),  'C') ||
    setweight(to_tsvector('simple',
      coalesce(NEW.storage_gb::text || 'gb', '')), 'B') ||
    setweight(to_tsvector('simple',
      coalesce(NEW.description, '')), 'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_search_vector
  BEFORE INSERT OR UPDATE OF brand, model, color, storage_gb, description
  ON products
  FOR EACH ROW EXECUTE FUNCTION fn_products_update_search();

CREATE INDEX idx_products_fts
  ON products USING GIN (search_vector);
CREATE INDEX idx_products_brand_trgm
  ON products USING GIN (brand gin_trgm_ops);
CREATE INDEX idx_products_model_trgm
  ON products USING GIN (model gin_trgm_ops);
CREATE INDEX idx_products_active_newest
  ON products (updated_at DESC, id DESC)
  WHERE is_active = true;
CREATE INDEX idx_products_active_price_asc
  ON products (price_uzs ASC, id ASC)
  WHERE is_active = true;
CREATE INDEX idx_products_active_price_desc
  ON products (price_uzs DESC, id DESC)
  WHERE is_active = true;
CREATE INDEX idx_products_active_brand
  ON products (brand, updated_at DESC)
  WHERE is_active = true;
CREATE INDEX idx_products_active_condition
  ON products (condition, updated_at DESC)
  WHERE is_active = true;
CREATE INDEX idx_products_brand_condition
  ON products (brand, condition, price_uzs)
  WHERE is_active = true;
CREATE INDEX idx_products_shop_active
  ON products (shop_id, updated_at DESC)
  WHERE is_active = true;

-- ================================================================
-- 4. PRODUCT_IMAGES
-- ================================================================
CREATE TABLE product_images (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        text        NOT NULL,
  public_id  text,
  is_primary boolean     NOT NULL DEFAULT false,
  position   int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_product_images_primary_unique
  ON product_images (product_id)
  WHERE is_primary = true;
CREATE INDEX idx_product_images_product_id
  ON product_images (product_id, position);

-- ================================================================
-- 5. BUYERS
-- ================================================================
CREATE TABLE buyers (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id    bigint      NOT NULL UNIQUE,
  first_name     text        NOT NULL,
  last_name      text,
  username       text,
  phone          text,
  avatar_url     text,
  is_blocked     boolean     NOT NULL DEFAULT false,
  joined_at      timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz
);

CREATE INDEX idx_buyers_telegram_id  ON buyers (telegram_id);
CREATE INDEX idx_buyers_joined_at    ON buyers (joined_at DESC);
CREATE INDEX idx_buyers_active       ON buyers (joined_at DESC)
  WHERE is_blocked = false;

-- ================================================================
-- 6. FAVORITES
-- ================================================================
CREATE TABLE favorites (
  buyer_id   uuid        NOT NULL REFERENCES buyers(id)   ON DELETE CASCADE,
  product_id uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (buyer_id, product_id)
);

CREATE INDEX idx_favorites_buyer   ON favorites (buyer_id,   created_at DESC);
CREATE INDEX idx_favorites_product ON favorites (product_id, created_at DESC);

-- ================================================================
-- 7. EVENTS
-- ================================================================
CREATE TABLE events (
  id         bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type       text        NOT NULL CHECK (type IN ('view', 'call', 'telegram', 'favorite')),
  product_id uuid        REFERENCES products(id) ON DELETE SET NULL,
  shop_id    uuid        REFERENCES shops(id)    ON DELETE SET NULL,
  buyer_id   uuid        REFERENCES buyers(id)   ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
) WITH (fillfactor = 100);

CREATE INDEX idx_events_created_at_brin
  ON events USING BRIN (created_at) WITH (pages_per_range = 32);
CREATE INDEX idx_events_product_type
  ON events (product_id, type, created_at DESC)
  WHERE product_id IS NOT NULL;
CREATE INDEX idx_events_shop_type
  ON events (shop_id, type, created_at DESC)
  WHERE shop_id IS NOT NULL;

ALTER TABLE events SET (
  autovacuum_vacuum_scale_factor  = 0.01,
  autovacuum_analyze_scale_factor = 0.005,
  autovacuum_vacuum_cost_delay    = 2
);

-- ================================================================
-- 8. AUTH_TOKENS — OTP kirish uchun vaqtinchalik tokenlar
-- ================================================================
CREATE TABLE IF NOT EXISTS auth_tokens (
  token        text        PRIMARY KEY,
  telegram_id  bigint,
  role         text,
  user_id      uuid,
  otp          text,
  phone        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Muddati o'tgan tokenlarni avtomatik tozalash (cron yoki DB scheduler)
-- DELETE FROM auth_tokens WHERE created_at < now() - interval '10 minutes';

-- ================================================================
-- VIEWS
-- ================================================================

-- Ommaviy katalog
CREATE OR REPLACE VIEW v_products AS
SELECT
  p.id,
  p.slug,
  p.brand,
  p.model,
  p.storage_gb,
  p.ram_gb,
  p.color,
  p.condition,
  p.price_uzs,
  p.description,
  p.updated_at,
  p.created_at,
  s.id                AS shop_id,
  s.name              AS shop_name,
  s.slug              AS shop_slug,
  s.phone             AS shop_phone,
  s.telegram_username AS shop_telegram,
  s.room_code,
  sel.id              AS seller_id,
  img.url             AS primary_image_url,
  img.public_id       AS primary_image_public_id
FROM      products       p
JOIN      shops          s   ON s.id = p.shop_id
JOIN      sellers        sel ON sel.id = s.seller_id
LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = true
WHERE p.is_active    = true
  AND s.is_active    = true
  AND sel.is_blocked = false;

-- Admin: sotuvchi + do'kon + mahsulot soni
CREATE OR REPLACE VIEW v_sellers AS
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
LEFT JOIN  shops    sh ON sh.seller_id = sel.id
LEFT JOIN  products p  ON p.shop_id   = sh.id AND p.is_active = true
GROUP BY sel.id, sh.id;

-- Do'kon sahifasi
CREATE OR REPLACE VIEW v_shops AS
SELECT
  sh.id,
  sh.name,
  sh.slug,
  sh.description,
  sh.phone,
  sh.telegram_username,
  sh.room_code,
  sh.banner_url,
  sh.avatar_url,
  sh.is_active,
  sh.created_at,
  sh.updated_at,
  sel.full_name       AS seller_name,
  sel.phone           AS seller_phone,
  sel.is_blocked      AS seller_is_blocked,
  COUNT(p.id)         AS products_count,
  COUNT(p.id) FILTER (WHERE p.condition = 'new')  AS new_count,
  COUNT(p.id) FILTER (WHERE p.condition = 'used') AS used_count,
  MIN(p.price_uzs)    AS min_price,
  MAX(p.price_uzs)    AS max_price
FROM      shops    sh
JOIN      sellers  sel ON sel.id    = sh.seller_id
LEFT JOIN products p   ON p.shop_id = sh.id AND p.is_active = true
GROUP BY sh.id, sel.id;

-- Admin: barcha mahsulotlar (faol + nofaol)
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

-- Admin: xaridorlar + sevimlilar soni
CREATE OR REPLACE VIEW v_buyers AS
SELECT
  b.id,
  b.telegram_id::text AS telegram_id,
  b.first_name,
  b.last_name,
  b.username,
  b.phone,
  b.avatar_url,
  b.is_blocked,
  b.joined_at,
  b.last_active_at,
  COUNT(f.product_id) AS favorites_count
FROM buyers b
LEFT JOIN favorites f ON f.buyer_id = b.id
GROUP BY b.id;

-- ================================================================
-- KEYSET PAGINATION FUNCTIONS
-- ================================================================

CREATE OR REPLACE FUNCTION fn_products_page_newest(
  p_limit       int         DEFAULT 20,
  p_cursor_at   timestamptz DEFAULT NULL,
  p_cursor_id   uuid        DEFAULT NULL,
  p_shop_id     uuid        DEFAULT NULL,
  p_brand       text        DEFAULT NULL,
  p_condition   text        DEFAULT NULL,
  p_min_price   bigint      DEFAULT NULL,
  p_max_price   bigint      DEFAULT NULL,
  p_search      text        DEFAULT NULL
)
RETURNS TABLE (
  id uuid, slug text, brand text, model text, storage_gb int,
  color text, condition text, price_uzs bigint, updated_at timestamptz,
  shop_id uuid, shop_name text, shop_slug text, room_code text,
  primary_image_url text, has_more boolean
)
LANGUAGE sql STABLE AS $$
  WITH filtered AS (
    SELECT
      p.id, p.slug, p.brand, p.model, p.storage_gb,
      p.color, p.condition, p.price_uzs, p.updated_at,
      s.id           AS shop_id,
      s.name         AS shop_name,
      s.slug         AS shop_slug,
      s.room_code,
      img.url        AS primary_image_url
    FROM      products       p
    JOIN      shops          s   ON s.id = p.shop_id AND s.is_active = true
    LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = true
    WHERE p.is_active = true
      AND (p_shop_id   IS NULL OR p.shop_id   = p_shop_id)
      AND (p_brand     IS NULL OR p.brand     ILIKE p_brand)
      AND (p_condition IS NULL OR p.condition = p_condition)
      AND (p_min_price IS NULL OR p.price_uzs >= p_min_price)
      AND (p_max_price IS NULL OR p.price_uzs <= p_max_price)
      AND (p_search    IS NULL OR p.search_vector @@ plainto_tsquery('simple', p_search))
      AND (
        p_cursor_at IS NULL OR
        (p.updated_at, p.id) < (p_cursor_at, p_cursor_id)
      )
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT p_limit + 1
  )
  SELECT
    id, slug, brand, model, storage_gb, color, condition, price_uzs, updated_at,
    shop_id, shop_name, shop_slug, room_code, primary_image_url,
    (count(*) OVER () > p_limit) AS has_more
  FROM filtered
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION fn_products_page_price_asc(
  p_limit        int    DEFAULT 20,
  p_cursor_price bigint DEFAULT NULL,
  p_cursor_id    uuid   DEFAULT NULL,
  p_shop_id      uuid   DEFAULT NULL,
  p_brand        text   DEFAULT NULL,
  p_condition    text   DEFAULT NULL,
  p_min_price    bigint DEFAULT NULL,
  p_max_price    bigint DEFAULT NULL,
  p_search       text   DEFAULT NULL
)
RETURNS TABLE (
  id uuid, slug text, brand text, model text, storage_gb int,
  color text, condition text, price_uzs bigint, updated_at timestamptz,
  shop_id uuid, shop_name text, shop_slug text, room_code text,
  primary_image_url text, has_more boolean
)
LANGUAGE sql STABLE AS $$
  WITH filtered AS (
    SELECT
      p.id, p.slug, p.brand, p.model, p.storage_gb,
      p.color, p.condition, p.price_uzs, p.updated_at,
      s.id   AS shop_id, s.name AS shop_name,
      s.slug AS shop_slug, s.room_code,
      img.url AS primary_image_url
    FROM      products       p
    JOIN      shops          s   ON s.id = p.shop_id AND s.is_active = true
    LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = true
    WHERE p.is_active = true
      AND (p_shop_id   IS NULL OR p.shop_id   = p_shop_id)
      AND (p_brand     IS NULL OR p.brand     ILIKE p_brand)
      AND (p_condition IS NULL OR p.condition = p_condition)
      AND (p_min_price IS NULL OR p.price_uzs >= p_min_price)
      AND (p_max_price IS NULL OR p.price_uzs <= p_max_price)
      AND (p_search    IS NULL OR p.search_vector @@ plainto_tsquery('simple', p_search))
      AND (
        p_cursor_price IS NULL OR
        (p.price_uzs, p.id::text) > (p_cursor_price, p_cursor_id::text)
      )
    ORDER BY p.price_uzs ASC, p.id ASC
    LIMIT p_limit + 1
  )
  SELECT
    id, slug, brand, model, storage_gb, color, condition, price_uzs, updated_at,
    shop_id, shop_name, shop_slug, room_code, primary_image_url,
    (count(*) OVER () > p_limit) AS has_more
  FROM filtered
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION fn_products_page_price_desc(
  p_limit        int    DEFAULT 20,
  p_cursor_price bigint DEFAULT NULL,
  p_cursor_id    uuid   DEFAULT NULL,
  p_shop_id      uuid   DEFAULT NULL,
  p_brand        text   DEFAULT NULL,
  p_condition    text   DEFAULT NULL,
  p_min_price    bigint DEFAULT NULL,
  p_max_price    bigint DEFAULT NULL,
  p_search       text   DEFAULT NULL
)
RETURNS TABLE (
  id uuid, slug text, brand text, model text, storage_gb int,
  color text, condition text, price_uzs bigint, updated_at timestamptz,
  shop_id uuid, shop_name text, shop_slug text, room_code text,
  primary_image_url text, has_more boolean
)
LANGUAGE sql STABLE AS $$
  WITH filtered AS (
    SELECT
      p.id, p.slug, p.brand, p.model, p.storage_gb,
      p.color, p.condition, p.price_uzs, p.updated_at,
      s.id   AS shop_id, s.name AS shop_name,
      s.slug AS shop_slug, s.room_code,
      img.url AS primary_image_url
    FROM      products       p
    JOIN      shops          s   ON s.id = p.shop_id AND s.is_active = true
    LEFT JOIN product_images img ON img.product_id = p.id AND img.is_primary = true
    WHERE p.is_active = true
      AND (p_shop_id   IS NULL OR p.shop_id   = p_shop_id)
      AND (p_brand     IS NULL OR p.brand     ILIKE p_brand)
      AND (p_condition IS NULL OR p.condition = p_condition)
      AND (p_min_price IS NULL OR p.price_uzs >= p_min_price)
      AND (p_max_price IS NULL OR p.price_uzs <= p_max_price)
      AND (p_search    IS NULL OR p.search_vector @@ plainto_tsquery('simple', p_search))
      AND (
        p_cursor_price IS NULL OR
        (p.price_uzs, p.id::text) < (p_cursor_price, p_cursor_id::text)
      )
    ORDER BY p.price_uzs DESC, p.id DESC
    LIMIT p_limit + 1
  )
  SELECT
    id, slug, brand, model, storage_gb, color, condition, price_uzs, updated_at,
    shop_id, shop_name, shop_slug, room_code, primary_image_url,
    (count(*) OVER () > p_limit) AS has_more
  FROM filtered
  LIMIT p_limit;
$$;

-- ================================================================
-- UTILITY FUNCTIONS
-- ================================================================

CREATE OR REPLACE FUNCTION fn_product_slug(
  p_brand      text,
  p_model      text,
  p_storage_gb int DEFAULT NULL
)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  base_slug text;
  try_slug  text;
  counter   int := 0;
BEGIN
  base_slug := fn_slugify(
    p_brand || '-' || p_model ||
    COALESCE('-' || p_storage_gb::text || 'gb', '')
  );
  try_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM products WHERE slug = try_slug) LOOP
    counter  := counter + 1;
    try_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN try_slug;
END;
$$;

CREATE OR REPLACE FUNCTION fn_shop_slug(p_name text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  base_slug text;
  try_slug  text;
  counter   int := 0;
BEGIN
  base_slug := fn_slugify(p_name);
  try_slug  := base_slug;
  WHILE EXISTS (SELECT 1 FROM shops WHERE slug = try_slug AND slug != '') LOOP
    counter  := counter + 1;
    try_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN try_slug;
END;
$$;

CREATE OR REPLACE FUNCTION fn_create_seller(
  p_full_name text,
  p_phone     text
)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  new_seller_id uuid;
BEGIN
  INSERT INTO sellers (full_name, phone)
  VALUES (p_full_name, p_phone)
  RETURNING id INTO new_seller_id;

  INSERT INTO shops (seller_id, name, slug)
  VALUES (new_seller_id, '', gen_random_uuid()::text);

  RETURN new_seller_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_product_stats(p_product_id uuid)
RETURNS TABLE (
  views_count     bigint,
  calls_count     bigint,
  telegram_count  bigint,
  favorites_count bigint
) LANGUAGE sql STABLE AS $$
  SELECT
    COUNT(*) FILTER (WHERE type = 'view')     AS views_count,
    COUNT(*) FILTER (WHERE type = 'call')     AS calls_count,
    COUNT(*) FILTER (WHERE type = 'telegram') AS telegram_count,
    (SELECT COUNT(*) FROM favorites WHERE product_id = p_product_id) AS favorites_count
  FROM events
  WHERE product_id = p_product_id;
$$;

CREATE OR REPLACE FUNCTION fn_shop_stats(p_shop_id uuid)
RETURNS TABLE (
  views_30d       bigint,
  calls_30d       bigint,
  telegram_30d    bigint,
  products_total  bigint,
  favorites_total bigint
) LANGUAGE sql STABLE AS $$
  SELECT
    COUNT(*) FILTER (WHERE type = 'view'     AND created_at > now() - interval '30 days') AS views_30d,
    COUNT(*) FILTER (WHERE type = 'call'     AND created_at > now() - interval '30 days') AS calls_30d,
    COUNT(*) FILTER (WHERE type = 'telegram' AND created_at > now() - interval '30 days') AS telegram_30d,
    (SELECT COUNT(*) FROM products  WHERE shop_id  = p_shop_id AND is_active = true)      AS products_total,
    (SELECT COUNT(*) FROM favorites f
       JOIN products p ON p.id = f.product_id
      WHERE p.shop_id = p_shop_id)                                                         AS favorites_total
  FROM events
  WHERE shop_id = p_shop_id;
$$;

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE sellers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites      ENABLE ROW LEVEL SECURITY;
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shops: public read"
  ON shops FOR SELECT USING (is_active = true);

CREATE POLICY "products: public read"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "product_images: public read"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "events: public insert"
  ON events FOR INSERT WITH CHECK (true);

-- Barcha write operatsiyalar service role orqali (RLS bypass)

-- ================================================================
-- NOTES
-- ================================================================
--
-- Yangi sotuvchi:   SELECT fn_create_seller('Ism Familiya', '+998901234567');
-- Mahsulot slug:    SELECT fn_product_slug('Apple', 'iPhone 16 Pro', 256);
-- Sahifa (1):       SELECT * FROM fn_products_page_newest(p_limit := 24);
-- Sahifa (keyingi): SELECT * FROM fn_products_page_newest(
--                     p_limit     := 24,
--                     p_cursor_at := '2025-05-17T08:30:00Z',
--                     p_cursor_id := 'uuid-here'
--                   );
-- ================================================================
