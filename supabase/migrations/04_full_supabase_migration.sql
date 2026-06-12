
-- ===============================================
-- FULL WALLS APP SUPABASE SCHEMA (REPLACES FIREBASE)
-- Includes COMPLETE ROW LEVEL SECURITY
-- ===============================================

-- DROP OLD TABLES (NO IMPORTANT DATA - FRESH START!)
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.blocks CASCADE;
DROP TABLE IF EXISTS public.usernames CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.reserved_usernames CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. AUTH: We use Supabase Auth (users table is auto-managed by Supabase)

-- 2. CORE USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  background_url TEXT,
  theme TEXT DEFAULT 'midnight',
  color_palette TEXT DEFAULT 'violet',
  custom_accent_color TEXT,
  font TEXT DEFAULT 'inter',
  animation_style TEXT DEFAULT 'fade-up',
  default_block_style TEXT DEFAULT 'default',
  bg_type TEXT DEFAULT 'default',
  bg_solid TEXT,
  bg_grad_from TEXT,
  bg_grad_to TEXT,
  bg_grad_dir TEXT,
  bg_blur INTEGER DEFAULT 0,
  image_url TEXT,
  video_url TEXT,
  seo_title TEXT,
  seo_desc TEXT,
  loading_text TEXT,
  loading_bg_color TEXT,
  loading_text_color TEXT,
  loading_text_size TEXT,
  loading_animation TEXT,
  ambient_effect TEXT DEFAULT 'none',
  plan TEXT DEFAULT 'free',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles (replaces Firestore users collection)';

-- 3. USERNAMES INDEX TABLE
CREATE TABLE IF NOT EXISTS public.usernames (
  username TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WALL BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  position INTEGER NOT NULL,
  visible BOOLEAN DEFAULT true,
  style TEXT DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.blocks IS 'Wall blocks (replaces Firestore /users/{uid}/blocks collection)';

-- 5. RESERVED USERNAMES (as before)
CREATE TABLE IF NOT EXISTS public.reserved_usernames (
  username TEXT PRIMARY KEY,
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS (as before)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ANALYTICS EVENTS (as before)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.blocks(id),
  event_type TEXT NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- ENABLE RLS FOR EVERYTHING
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserved_usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- --------------------------
-- DROP OLD EXISTING POLICIES FIRST
-- --------------------------
DROP POLICY IF EXISTS "profiles: public read public profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles: users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "usernames: public read for validation" ON public.usernames;
DROP POLICY IF EXISTS "usernames: users can insert own username" ON public.usernames;
DROP POLICY IF EXISTS "usernames: users can delete own old username" ON public.usernames;

DROP POLICY IF EXISTS "blocks: public read public user blocks" ON public.blocks;
DROP POLICY IF EXISTS "blocks: users can read own blocks" ON public.blocks;
DROP POLICY IF EXISTS "blocks: users can insert own blocks" ON public.blocks;
DROP POLICY IF EXISTS "blocks: users can update own blocks" ON public.blocks;
DROP POLICY IF EXISTS "blocks: users can delete own blocks" ON public.blocks;

DROP POLICY IF EXISTS "reserved_usernames: public read" ON public.reserved_usernames;
DROP POLICY IF EXISTS "reserved_usernames: authenticated users can manage" ON public.reserved_usernames;
DROP POLICY IF EXISTS "site_settings: public read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings: authenticated can write" ON public.site_settings;
DROP POLICY IF EXISTS "analytics_events: public insert" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_events: users read own analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_events: authenticated read all" ON public.analytics_events;

-- --------------------------
-- PROFILES POLICIES
-- --------------------------
-- Anyone can read public profiles
CREATE POLICY "profiles: public read public profiles"
  ON public.profiles
  FOR SELECT
  USING (is_public = true);

-- Users can read their own full profile
CREATE POLICY "profiles: users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles: users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- NEW users can create their own profile ON SIGNUP (via trigger or directly)
CREATE POLICY "profiles: users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- --------------------------
-- USERNAMES POLICIES
-- --------------------------
-- Anyone can check if a username exists
CREATE POLICY "usernames: public read for validation"
  ON public.usernames
  FOR SELECT
  USING (true);

-- Users can insert their own username (when signing up)
CREATE POLICY "usernames: users can insert own username"
  ON public.usernames
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their old username (when changing username)
CREATE POLICY "usernames: users can delete own old username"
  ON public.usernames
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------
-- BLOCKS POLICIES
-- --------------------------
-- Anyone can read blocks from public profiles
CREATE POLICY "blocks: public read public user blocks"
  ON public.blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.blocks.user_id
      AND public.profiles.is_public = true
    )
  );

-- Users can read their own blocks
CREATE POLICY "blocks: users can read own blocks"
  ON public.blocks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own blocks
CREATE POLICY "blocks: users can insert own blocks"
  ON public.blocks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own blocks
CREATE POLICY "blocks: users can update own blocks"
  ON public.blocks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own blocks
CREATE POLICY "blocks: users can delete own blocks"
  ON public.blocks
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------
-- RESERVED USERNAMES POLICIES
-- --------------------------
-- Anyone can read reserved usernames (to check if a username is available)
CREATE POLICY "reserved_usernames: public read"
  ON public.reserved_usernames
  FOR SELECT
  USING (true);

-- Only authenticated admins can manage reserved usernames
-- (We'll use a "role" column or just let auth.users = true for now, expandable)
CREATE POLICY "reserved_usernames: authenticated users can manage"
  ON public.reserved_usernames
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------
-- SITE SETTINGS POLICIES
-- --------------------------
-- Anyone can read site settings (for landing page)
CREATE POLICY "site_settings: public read"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Only authenticated users can update site settings (admin use)
CREATE POLICY "site_settings: authenticated can write"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------
-- ANALYTICS EVENTS POLICIES
-- --------------------------
-- Anyone can insert analytics events (to track public views/clicks)
CREATE POLICY "analytics_events: public insert"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Users can read their own analytics
CREATE POLICY "analytics_events: users read own analytics"
  ON public.analytics_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can read all analytics (admin use)
CREATE POLICY "analytics_events: authenticated read all"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (true);

-- ===============================================
-- TRIGGERS TO AUTO-UPDATE timestamps
-- ===============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_blocks_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ===============================================
-- INSERT DEFAULT SITE SETTINGS
-- ===============================================
INSERT INTO public.site_settings (key, value) VALUES
('hero_images', '[]'),
('announcement_banner', '{"text": "", "active": false}'),
('maintenance_mode', '{"active": false, "message": ""}'),
('featured_walls', '[]'),
('landing_page', '{"videoUrl": "", "title": "Walls", "subtitle": "Your personal link-in-bio canvas"}')
ON CONFLICT (key) DO NOTHING;

