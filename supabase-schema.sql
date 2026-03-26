-- =============================================
-- FooDash — Supabase Database Schema v2
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  address       TEXT,
  role          TEXT DEFAULT 'user' CHECK (role IN ('user','admin')),
  loyalty_points INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── CATEGORIES ──────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  icon       TEXT,
  color      TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MENU ITEMS ──────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  image_url    TEXT,
  category_id  UUID REFERENCES categories(id),
  rating       DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  prep_time    INTEGER DEFAULT 15,
  is_available BOOLEAN DEFAULT true,
  is_featured  BOOLEAN DEFAULT false,
  tags         TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status                   TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','preparing','ready','picked_up','delivered','cancelled')),
  payment_status           TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  stripe_payment_intent_id TEXT,
  total_price              DECIMAL(10,2) NOT NULL,
  delivery_fee             DECIMAL(10,2) DEFAULT 5.00,
  discount                 DECIMAL(10,2) DEFAULT 0,
  delivery_address         TEXT NOT NULL,
  payment_method           TEXT DEFAULT 'card',
  notes                    TEXT,
  estimated_delivery       TIMESTAMPTZ,
  rider_name               TEXT,
  rider_phone              TEXT,
  rider_rating             DECIMAL(3,2),
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDER ITEMS ─────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id         UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id     UUID REFERENCES menu_items(id),
  menu_item_name   TEXT NOT NULL,
  menu_item_image  TEXT,
  quantity         INTEGER NOT NULL DEFAULT 1,
  price            DECIMAL(10,2) NOT NULL,
  customizations   JSONB DEFAULT '[]',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAVORITES ───────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own"            ON profiles    USING (auth.uid() = id);
CREATE POLICY "categories_public_read"  ON categories  FOR SELECT USING (true);
CREATE POLICY "menu_items_public_read"  ON menu_items  FOR SELECT USING (is_available = true);
CREATE POLICY "menu_items_admin_all"    ON menu_items  USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "orders_own_read"         ON orders      FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_own_insert"       ON orders      FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_own_update"       ON orders      FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "order_items_own"         ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "order_items_insert"      ON order_items FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "favorites_own"           ON favorites   USING (auth.uid() = user_id);

-- ─── LOYALTY POINTS RPC ──────────────────────
CREATE OR REPLACE FUNCTION increment_loyalty_points(user_id UUID, points INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET loyalty_points = loyalty_points + points,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── REALTIME ────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ─── SEED: CATEGORIES ────────────────────────
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('Burgers',     'burgers',     '🍔', '#FF6B35', 1),
  ('Pizza',       'pizza',       '🍕', '#E55520', 2),
  ('Sushi',       'sushi',       '🍱', '#06D6A0', 3),
  ('Pasta',       'pasta',       '🍝', '#FFD166', 4),
  ('Salads',      'salads',      '🥗', '#4CAF50', 5),
  ('Desserts',    'desserts',    '🍰', '#FF69B4', 6),
  ('Drinks',      'drinks',      '🥤', '#2196F3', 7),
  ('Chicken',     'chicken',     '🍗', '#FF9800', 8),
  ('Seafood',     'seafood',     '🦞', '#00BCD4', 9),
  ('Tacos',       'tacos',       '🌮', '#9C27B0', 10),
  ('Sandwiches',  'sandwiches',  '🥪', '#795548', 11),
  ('Breakfast',   'breakfast',   '🍳', '#FFC107', 12)
ON CONFLICT (slug) DO NOTHING;
