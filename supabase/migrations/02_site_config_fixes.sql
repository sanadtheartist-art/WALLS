-- Seed landing_page config (admin hero settings)
INSERT INTO site_settings (key, value) VALUES
('landing_page', '{"videoUrl": "", "title": "Walls", "subtitle": "Your personal link-in-bio canvas"}')
ON CONFLICT (key) DO NOTHING;

-- Allow public reads and admin writes from the Supabase-authenticated client
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings: public read" ON site_settings;
CREATE POLICY "site_settings: public read"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_settings: public write" ON site_settings;
CREATE POLICY "site_settings: public write"
  ON site_settings FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
