/*
# Kiyaso Restaurant - Core Schema

## Overview
Creates the complete database schema for the Kiyaso premium restaurant website including:
- Categories, menu items, branches, gallery, offers, testimonials, careers
- Orders and reservations for customer-facing functionality
- Admin settings and analytics support

## New Tables

1. **categories** - Menu categories (Fried Rice, Kottu, Burgers, Subs, Noodles, Seafood, Desserts)
   - id, name, slug, description, image_url, sort_order, is_active

2. **menu_items** - Individual dishes
   - id, category_id (FK), name, slug, description, price, image_url, gallery (array), is_popular, is_spicy, is_available, ingredients (array), sort_order, created_at

3. **branches** - Restaurant locations (Akurana, Matale, unlimited)
   - id, name, address, phone, map_url, latitude, longitude, opening_hours (jsonb), delivery_available, is_active, sort_order

4. **gallery_items** - Gallery photos
   - id, title, image_url, category, sort_order, created_at

5. **offers** - Promotions and seasonal campaigns
   - id, title, description, image_url, badge_text, is_active, sort_order, valid_until

6. **testimonials** - Customer reviews
   - id, name, rating, text, source (google/website), avatar_url, is_active, sort_order, created_at

7. **orders** - Customer online orders
   - id, order_number, branch_id (FK), customer_name, customer_phone, customer_email, delivery_type (pickup/delivery), address, items (jsonb), subtotal, delivery_fee, total, status, notes, created_at

8. **reservations** - Table booking requests
   - id, branch_id (FK), name, phone, email, guests, date, time, special_requests, status, created_at

9. **catering_inquiries** - Catering inquiry form submissions
   - id, name, phone, email, event_type, event_date, guest_count, message, status, created_at

10. **career_applications** - Job applications
    - id, name, phone, email, position, message, resume_url, status, created_at

11. **contact_messages** - Contact form submissions
    - id, name, phone, email, subject, message, status, created_at

12. **settings** - Restaurant-wide settings (singleton)
    - id, restaurant_name, tagline, logo_url, primary_color, phone, email, address, social_links (jsonb), opening_hours (jsonb), delivery_fee, delivery_min_order, delivery_est_time, seo_title, seo_description

## Security
- RLS enabled on ALL tables
- All tables use `TO anon, authenticated` policies (no-auth app - the frontend uses anon key)
- Full CRUD access for anon + authenticated on all tables (single-tenant public restaurant site)
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
  social_links jsonb DEFAULT '{"facebook":"https://facebook.com/kiyaso","instagram":"https://instagram.com/kiyaso","whatsapp":"https://wa.me/94812345678"}'::jsonb,
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
