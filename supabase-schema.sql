-- Supabase Schema for Brass Home Atelier
-- Run this SQL in your Supabase project's SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKUs Table
CREATE TABLE IF NOT EXISTS skus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT NOT NULL DEFAULT '',
  price_per_kg_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_order_kg INTEGER NOT NULL DEFAULT 0,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  finish_options TEXT[] DEFAULT '{}',
  material VARCHAR(255) DEFAULT 'Brass',
  image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  specs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Requests Table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  sku_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  quantity_kg INTEGER NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings Table (for app-wide settings like show_pricing)
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'app_settings',
  show_pricing BOOLEAN DEFAULT true,
  materials TEXT[] DEFAULT '{"Brass", "Bronze", "Stainless Steel", "Copper", "Zinc Alloy", "Iron", "Aluminum"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id, show_pricing, materials)
VALUES ('app_settings', true, '{"Brass", "Bronze", "Stainless Steel", "Copper", "Zinc Alloy", "Iron", "Aluminum"}')
ON CONFLICT (id) DO NOTHING;

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skus_category_id ON skus(category_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and SKUs (anyone can view products)
CREATE POLICY "Public read access for categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for skus" ON skus
  FOR SELECT USING (true);

-- Anyone can create quote requests (customers submitting quotes)
CREATE POLICY "Anyone can create quote requests" ON quote_requests
  FOR INSERT WITH CHECK (true);

-- Allow public to read quote requests (for admin dashboard - in production use service key)
CREATE POLICY "Public read access for quote_requests" ON quote_requests
  FOR SELECT USING (true);

-- Allow public to update quote requests (for admin dashboard - in production use service key)
CREATE POLICY "Public update for quote_requests" ON quote_requests
  FOR UPDATE USING (true);

-- Allow public to delete quote requests (for admin dashboard - in production use service key)
CREATE POLICY "Public delete for quote_requests" ON quote_requests
  FOR DELETE USING (true);

-- Allow public to manage categories (for admin dashboard - in production use service key)
CREATE POLICY "Public insert for categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update for categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Public delete for categories" ON categories
  FOR DELETE USING (true);

-- Allow public to manage SKUs (for admin dashboard - in production use service key)
CREATE POLICY "Public insert for skus" ON skus
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update for skus" ON skus
  FOR UPDATE USING (true);

CREATE POLICY "Public delete for skus" ON skus
  FOR DELETE USING (true);

-- Settings table policies (read for public, full access for admin)
CREATE POLICY "Public read access for settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Public insert for settings" ON settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update for settings" ON settings
  FOR UPDATE USING (true);

-- ============================================
-- STORAGE SETUP (Run this after creating tables)
-- ============================================
-- Note: You need to create the storage bucket manually in Supabase Dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name it "products" and check "Public bucket"
-- 4. Then run these policies:

-- Storage policies for the 'products' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public read access for products bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Allow anyone to upload (for admin dashboard)
CREATE POLICY "Allow uploads to products bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

-- Allow anyone to update (for admin dashboard)
CREATE POLICY "Allow updates to products bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'products');

-- Allow anyone to delete (for admin dashboard)
CREATE POLICY "Allow deletes from products bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');
