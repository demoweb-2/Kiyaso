/*
# Initialize Kiyaso Restaurant Schema (from scratch)

## Overview
Database is empty. This migration creates the complete schema for the Kiyaso restaurant app:
all tables, columns, constraints, indexes, RLS policies, storage bucket, realtime publication,
and realistic seed demo data.

## New Tables (12 total)
1. categories — Menu categories with image, slug, sort order
2. menu_items — Dishes with category FK, gallery array, ingredients array, price, flags
3. branches — Restaurant locations with opening hours JSON, delivery flag
4. gallery_items — Gallery photos with category label
5. offers — Promotions with badge text, validity date
6. testimonials — Customer reviews with rating, source, avatar
7. orders — Customer online orders with items JSON, delivery type, status
8. reservations — Table bookings with guest count, date, time, status
9. catering_inquiries — Catering form submissions
10. career_applications — Job applications with resume URL
11. contact_messages — Contact form submissions
12. settings — Singleton restaurant settings: logo, social links, delivery config, SEO

## Security
- RLS enabled on ALL tables
- Policies use TO anon, authenticated (single-tenant app, admin auth is separate)
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE)
- Storage bucket kiyaso-images: public read + anon/authenticated write

## Storage
- Creates kiyaso-images bucket (public)
- Policies for read, insert, update, delete on storage.objects

## Realtime
- Adds all 12 tables to supabase_realtime publication

## Seed Data
- 7 categories, 12 menu items, 2 branches, 8 gallery items, 3 offers, 4 testimonials, 1 settings row
*/

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_categories_sel" ON categories;
CREATE POLICY "anon_crud_categories_sel" ON categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_categories_ins" ON categories;
CREATE POLICY "anon_crud_categories_ins" ON categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_categories_upd" ON categories;
CREATE POLICY "anon_crud_categories_upd" ON categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_categories_del" ON categories;
CREATE POLICY "anon_crud_categories_del" ON categories FOR DELETE TO anon, authenticated USING (true);

-- ============ MENU ITEMS ============
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  gallery text[] DEFAULT '{}',
  ingredients text[] DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  is_spicy boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_menu_sel" ON menu_items;
CREATE POLICY "anon_crud_menu_sel" ON menu_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_menu_ins" ON menu_items;
CREATE POLICY "anon_crud_menu_ins" ON menu_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_menu_upd" ON menu_items;
CREATE POLICY "anon_crud_menu_upd" ON menu_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_menu_del" ON menu_items;
CREATE POLICY "anon_crud_menu_del" ON menu_items FOR DELETE TO anon, authenticated USING (true);

-- ============ BRANCHES ============
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  map_url text,
  latitude text,
  longitude text,
  opening_hours jsonb DEFAULT '{"mon":"11:00-22:00","tue":"11:00-22:00","wed":"11:00-22:00","thu":"11:00-22:00","fri":"11:00-23:00","sat":"11:00-23:00","sun":"11:00-22:00"}'::jsonb,
  delivery_available boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_branches_sel" ON branches;
CREATE POLICY "anon_crud_branches_sel" ON branches FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_branches_ins" ON branches;
CREATE POLICY "anon_crud_branches_ins" ON branches FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_branches_upd" ON branches;
CREATE POLICY "anon_crud_branches_upd" ON branches FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_branches_del" ON branches;
CREATE POLICY "anon_crud_branches_del" ON branches FOR DELETE TO anon, authenticated USING (true);

-- ============ GALLERY ============
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  category text DEFAULT 'Food',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_gallery_sel" ON gallery_items;
CREATE POLICY "anon_crud_gallery_sel" ON gallery_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_gallery_ins" ON gallery_items;
CREATE POLICY "anon_crud_gallery_ins" ON gallery_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_gallery_upd" ON gallery_items;
CREATE POLICY "anon_crud_gallery_upd" ON gallery_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_gallery_del" ON gallery_items;
CREATE POLICY "anon_crud_gallery_del" ON gallery_items FOR DELETE TO anon, authenticated USING (true);

-- ============ OFFERS ============
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  badge_text text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  valid_until date
);
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_offers_sel" ON offers;
CREATE POLICY "anon_crud_offers_sel" ON offers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_offers_ins" ON offers;
CREATE POLICY "anon_crud_offers_ins" ON offers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_offers_upd" ON offers;
CREATE POLICY "anon_crud_offers_upd" ON offers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_offers_del" ON offers;
CREATE POLICY "anon_crud_offers_del" ON offers FOR DELETE TO anon, authenticated USING (true);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  text text NOT NULL,
  source text DEFAULT 'website',
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_testimonials_sel" ON testimonials;
CREATE POLICY "anon_crud_testimonials_sel" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_testimonials_ins" ON testimonials;
CREATE POLICY "anon_crud_testimonials_ins" ON testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_testimonials_upd" ON testimonials;
CREATE POLICY "anon_crud_testimonials_upd" ON testimonials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_testimonials_del" ON testimonials;
CREATE POLICY "anon_crud_testimonials_del" ON testimonials FOR DELETE TO anon, authenticated USING (true);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_type text NOT NULL DEFAULT 'pickup',
  address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_orders_sel" ON orders;
CREATE POLICY "anon_crud_orders_sel" ON orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_orders_ins" ON orders;
CREATE POLICY "anon_crud_orders_ins" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_orders_upd" ON orders;
CREATE POLICY "anon_crud_orders_upd" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_orders_del" ON orders;
CREATE POLICY "anon_crud_orders_del" ON orders FOR DELETE TO anon, authenticated USING (true);

-- ============ RESERVATIONS ============
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  guests int NOT NULL DEFAULT 2,
  date date NOT NULL,
  time text NOT NULL,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_reservations_sel" ON reservations;
CREATE POLICY "anon_crud_reservations_sel" ON reservations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_reservations_ins" ON reservations;
CREATE POLICY "anon_crud_reservations_ins" ON reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_reservations_upd" ON reservations;
CREATE POLICY "anon_crud_reservations_upd" ON reservations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_reservations_del" ON reservations;
CREATE POLICY "anon_crud_reservations_del" ON reservations FOR DELETE TO anon, authenticated USING (true);

-- ============ CATERING INQUIRIES ============
CREATE TABLE IF NOT EXISTS catering_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  event_type text,
  event_date date,
  guest_count int,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE catering_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_catering_sel" ON catering_inquiries;
CREATE POLICY "anon_crud_catering_sel" ON catering_inquiries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_catering_ins" ON catering_inquiries;
CREATE POLICY "anon_crud_catering_ins" ON catering_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_catering_upd" ON catering_inquiries;
CREATE POLICY "anon_crud_catering_upd" ON catering_inquiries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_catering_del" ON catering_inquiries;
CREATE POLICY "anon_crud_catering_del" ON catering_inquiries FOR DELETE TO anon, authenticated USING (true);

-- ============ CAREER APPLICATIONS ============
CREATE TABLE IF NOT EXISTS career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  position text NOT NULL,
  message text,
  resume_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_careers_sel" ON career_applications;
CREATE POLICY "anon_crud_careers_sel" ON career_applications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_careers_ins" ON career_applications;
CREATE POLICY "anon_crud_careers_ins" ON career_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_careers_upd" ON career_applications;
CREATE POLICY "anon_crud_careers_upd" ON career_applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_careers_del" ON career_applications;
CREATE POLICY "anon_crud_careers_del" ON career_applications FOR DELETE TO anon, authenticated USING (true);

-- ============ CONTACT MESSAGES ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_contact_sel" ON contact_messages;
CREATE POLICY "anon_crud_contact_sel" ON contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_contact_ins" ON contact_messages;
CREATE POLICY "anon_crud_contact_ins" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_contact_upd" ON contact_messages;
CREATE POLICY "anon_crud_contact_upd" ON contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_contact_del" ON contact_messages;
CREATE POLICY "anon_crud_contact_del" ON contact_messages FOR DELETE TO anon, authenticated USING (true);

-- ============ SETTINGS ============
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name text NOT NULL DEFAULT 'Kiyaso',
  tagline text NOT NULL DEFAULT 'The Taste',
  logo_url text,
  primary_color text NOT NULL DEFAULT '#C8102E',
  phone text NOT NULL DEFAULT '+94 81 234 5678',
  email text NOT NULL DEFAULT 'hello@kiyaso.lk',
  address text NOT NULL DEFAULT 'Akurana & Matale, Sri Lanka',
  social_links jsonb DEFAULT '{"facebook":"https://facebook.com/kiyaso","instagram":"https://instagram.com/kiyaso","tiktok":"","youtube":"","whatsapp":"https://wa.me/94812345678"}'::jsonb,
  opening_hours jsonb DEFAULT '{"mon":"11:00-22:00","tue":"11:00-22:00","wed":"11:00-22:00","thu":"11:00-22:00","fri":"11:00-23:00","sat":"11:00-23:00","sun":"11:00-22:00"}'::jsonb,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 150.00,
  delivery_min_order numeric(10,2) NOT NULL DEFAULT 1000.00,
  delivery_est_time text NOT NULL DEFAULT '30-45 min',
  seo_title text NOT NULL DEFAULT 'Kiyaso - The Taste | Premium Casual Dining in Sri Lanka',
  seo_description text NOT NULL DEFAULT 'Experience premium casual dining at Kiyaso. Order online, reserve a table, or visit our branches in Akurana and Matale.'
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_settings_sel" ON settings;
CREATE POLICY "anon_crud_settings_sel" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_crud_settings_ins" ON settings;
CREATE POLICY "anon_crud_settings_ins" ON settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_settings_upd" ON settings;
CREATE POLICY "anon_crud_settings_upd" ON settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_crud_settings_del" ON settings;
CREATE POLICY "anon_crud_settings_del" ON settings FOR DELETE TO anon, authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_slug ON menu_items(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_branches_sort ON branches(sort_order);

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('kiyaso-images', 'kiyaso-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_read_images" ON storage.objects;
CREATE POLICY "anon_read_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'kiyaso-images');

DROP POLICY IF EXISTS "anon_insert_images" ON storage.objects;
CREATE POLICY "anon_insert_images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'kiyaso-images');

DROP POLICY IF EXISTS "anon_update_images" ON storage.objects;
CREATE POLICY "anon_update_images" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'kiyaso-images') WITH CHECK (bucket_id = 'kiyaso-images');

DROP POLICY IF EXISTS "anon_delete_images" ON storage.objects;
CREATE POLICY "anon_delete_images" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'kiyaso-images');

-- ============ REALTIME PUBLICATION ============
DO $$
BEGIN
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
  ALTER PUBLICATION supabase_realtime ADD TABLE categories, menu_items, branches, gallery_items, offers, testimonials, orders, reservations, catering_inquiries, career_applications, contact_messages, settings;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Realtime setup: %', SQLERRM;
END $$;

-- ============ SEED DATA ============

-- Categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
('Fried Rice', 'fried-rice', 'Authentic Sri Lankan fried rice dishes', 'https://images.pexels.com/photos/7235043/pexels-photo-7235043.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 1, true),
('Kottu', 'kottu', 'Sri Lankan kottu roti', 'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 2, true),
('Burgers', 'burgers', 'Gourmet burgers', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 3, true),
('Subs', 'subs', 'Submarine sandwiches', 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 4, true),
('Noodles', 'noodles', 'Asian noodle dishes', 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 5, true),
('Seafood', 'seafood', 'Fresh seafood specialties', 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 6, true),
('Desserts', 'desserts', 'Sweet treats', 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Menu Items
INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Chicken Fried Rice', 'chicken-fried-rice', 'Wok-fried rice with tender chicken, egg and vegetables', 850, 'https://images.pexels.com/photos/7235043/pexels-photo-7235043.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, false, true, 1, ARRAY['Chicken', 'Rice', 'Egg', 'Carrot', 'Leek', 'Garlic']
FROM categories WHERE slug = 'fried-rice'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Special Fried Rice', 'special-fried-rice', 'Our signature fried rice with mixed seafood and chicken', 1200, 'https://images.pexels.com/photos/7235043/pexels-photo-7235043.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, true, true, 2, ARRAY['Chicken', 'Prawns', 'Rice', 'Egg', 'Squid', 'Garlic']
FROM categories WHERE slug = 'fried-rice'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Prawn Fried Rice', 'prawn-fried-rice', 'Fried rice with fresh prawns and spices', 1100, 'https://images.pexels.com/photos/7235043/pexels-photo-7235043.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', false, false, true, 3, ARRAY['Prawns', 'Rice', 'Egg', 'Carrot', 'Leek', 'Garlic']
FROM categories WHERE slug = 'fried-rice'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Chicken Kottu', 'chicken-kottu', 'Classic Sri Lankan kottu with chicken, curry and roti', 900, 'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, false, true, 1, ARRAY['Chicken', 'Roti', 'Carrot', 'Leek', 'Onion', 'Curry']
FROM categories WHERE slug = 'kottu'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Spicy Cheese Kottu', 'spicy-cheese-kottu', 'Extra spicy kottu with double cheese', 1100, 'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, true, true, 2, ARRAY['Chicken', 'Roti', 'Cheese', 'Chili', 'Onion', 'Curry']
FROM categories WHERE slug = 'kottu'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Vegetable Kottu', 'vegetable-kottu', 'Vegetarian kottu with fresh vegetables', 700, 'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', false, false, true, 3, ARRAY['Roti', 'Carrot', 'Leek', 'Onion', 'Curry']
FROM categories WHERE slug = 'kottu'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Classic Beef Burger', 'classic-beef-burger', 'Juicy beef patty with cheese, lettuce and tomato', 950, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, false, true, 1, ARRAY['Beef', 'Cheese', 'Lettuce', 'Tomato', 'Onion', 'Bun']
FROM categories WHERE slug = 'burgers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Double Chicken Burger', 'double-chicken-burger', 'Two crispy chicken patties with special sauce', 1300, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, false, true, 2, ARRAY['Chicken', 'Cheese', 'Lettuce', 'Sauce', 'Bun']
FROM categories WHERE slug = 'burgers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Chicken Sub', 'chicken-sub', 'Grilled chicken sub with fresh vegetables', 800, 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', false, false, true, 1, ARRAY['Chicken', 'Lettuce', 'Tomato', 'Onion', 'Sauce', 'Bread']
FROM categories WHERE slug = 'subs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Spicy Noodles', 'spicy-noodles', 'Stir-fried noodles with chili and vegetables', 750, 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', false, true, true, 1, ARRAY['Noodles', 'Chili', 'Carrot', 'Leek', 'Garlic', 'Soy']
FROM categories WHERE slug = 'noodles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Garlic Prawns', 'garlic-prawns', 'Fresh prawns in garlic butter sauce', 1500, 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, false, true, 1, ARRAY['Prawns', 'Garlic', 'Butter', 'Lemon', 'Herbs']
FROM categories WHERE slug = 'seafood'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_popular, is_spicy, is_available, sort_order, ingredients)
SELECT id, 'Chocolate Lava Cake', 'chocolate-lava-cake', 'Warm chocolate cake with molten center', 500, 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', true, false, true, 1, ARRAY['Chocolate', 'Flour', 'Egg', 'Butter', 'Sugar']
FROM categories WHERE slug = 'desserts'
ON CONFLICT (slug) DO NOTHING;

-- Branches
INSERT INTO branches (name, address, phone, map_url, latitude, longitude, delivery_available, is_active, sort_order) VALUES
('Kiyaso Akurana', 'Main Street, Akurana, Kandy, Sri Lanka', '+94 81 234 5678', 'https://maps.google.com/?q=Akurana', '7.3557', '80.6356', true, true, 1),
('Kiyaso Matale', 'Trinity Road, Matale, Sri Lanka', '+94 66 345 6789', 'https://maps.google.com/?q=Matale', '7.4675', '80.6216', true, true, 2)
ON CONFLICT DO NOTHING;

-- Gallery
INSERT INTO gallery_items (title, image_url, category, sort_order) VALUES
('Signature Dish', 'https://images.pexels.com/photos/5176006/pexels-photo-5176006.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Food', 1),
('Kitchen Action', 'https://images.pexels.com/photos/5779781/pexels-photo-5779781.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Kitchen', 2),
('Plated Perfection', 'https://images.pexels.com/photos/12653336/pexels-photo-12653336.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Food', 3),
('Fresh Ingredients', 'https://images.pexels.com/photos/6617983/pexels-photo-6617983.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Kitchen', 4),
('Burger Special', 'https://images.pexels.com/photos/10692546/pexels-photo-10692546.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Food', 5),
('Restaurant Interior', 'https://images.pexels.com/photos/38550576/pexels-photo-38550576.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Interior', 6),
('Chef at Work', 'https://images.pexels.com/photos/8753672/pexels-photo-8753672.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Kitchen', 7),
('Sri Lankan Flavors', 'https://images.pexels.com/photos/34683317/pexels-photo-34683317.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', 'Food', 8)
ON CONFLICT DO NOTHING;

-- Offers
INSERT INTO offers (title, description, image_url, badge_text, is_active, sort_order, valid_until) VALUES
('Family Combo Deal', 'Get 20% off on all family combo meals every weekend!', 'https://images.pexels.com/photos/5176006/pexels-photo-5176006.jpeg?auto=compress&cs=tinysrgb&h=600&w=800', '20% OFF', true, 1, '2026-12-31'),
('Free Delivery', 'Free delivery on orders above Rs. 2,000 within Akurana and Matale', 'https://images.pexels.com/photos/4393252/pexels-photo-4393252.jpeg?auto=compress&cs=tinysrgb&h=600&w=800', 'FREE DELIVERY', true, 2, '2026-12-31'),
('Student Special', 'Show your student ID and get 15% off on all menu items', 'https://images.pexels.com/photos/10692546/pexels-photo-10692546.jpeg?auto=compress&cs=tinysrgb&h=600&w=800', '15% OFF', true, 3, '2026-12-31')
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, rating, text, source, avatar_url, is_active, sort_order) VALUES
('Nimal Perera', 5, 'The best kottu in town! Fresh, flavorful and generously portioned. The delivery is always on time.', 'Google', null, true, 1),
('Sarah Johnson', 5, 'Amazing food and great service. The spicy cheese kottu is a must-try! Will definitely come back.', 'Website', null, true, 2),
('Ahmed Rifath', 4, 'Good food at reasonable prices. The burgers are juicy and the buns are always fresh. Highly recommend!', 'Google', null, true, 3),
('Tharushi Silva', 5, 'Kiyaso never disappoints. From fried rice to desserts, everything is made to perfection. My go-to place!', 'Website', null, true, 4)
ON CONFLICT DO NOTHING;

-- Settings (singleton)
INSERT INTO settings DEFAULT VALUES
ON CONFLICT DO NOTHING;
