CREATE TABLE users (
  uid TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  background_url TEXT,
  theme TEXT DEFAULT 'midnight',
  color_palette TEXT DEFAULT 'violet',
  plan TEXT DEFAULT 'free',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reserved_usernames (
  username TEXT PRIMARY KEY,
  reason TEXT,
  added_by TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  uid TEXT REFERENCES users(uid),
  block_id TEXT,
  event_type TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site config
INSERT INTO site_settings (key, value) VALUES
('hero_images', '[]'),
('announcement_banner', '{"text": "", "active": false}'),
('maintenance_mode', '{"active": false, "message": ""}'),
('featured_walls', '[]'),
('landing_page', '{"videoUrl": "", "title": "Walls", "subtitle": "Your personal link-in-bio canvas"}');
