# Walls Project Setup Guide

This guide will help you set up Firebase, Supabase, and Cloudinary for the Walls project.

## Step 1: Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Email/Password** and **Google** sign-in in Authentication → Sign-in method.
3. Create a Firestore database in **Test Mode** (we'll update security rules later).
4. Register a web app in Project Settings → General → Your apps → Add app → Web.
5. Copy the Firebase config values into your `.env` file (copy `.env.example` to `.env` first).

## Step 2: Set Up Supabase

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once your project is ready, go to Project Settings → API and copy your Project URL and anon public key into `.env`.
3. Now let's create the required tables! Run these SQL queries in the Supabase SQL Editor:

```sql
-- Create users table (mirrors Firebase Auth users)
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

-- Create reserved_usernames table
CREATE TABLE reserved_usernames (
  username TEXT PRIMARY KEY,
  reason TEXT,
  added_by TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_config table
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  uid TEXT REFERENCES users(uid),
  block_id TEXT,
  event_type TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site config
INSERT INTO site_config (key, value) VALUES
('hero_images', '[]'),
('announcement_banner', '{"text": "", "active": false}'),
('maintenance_mode', '{"active": false, "message": ""}'),
('featured_walls', '[]'),
('landing_page', '{"videoUrl": "", "title": "Walls", "subtitle": "Your personal link-in-bio canvas"}');
```

4. If you already created the tables earlier, also run `supabase/migrations/02_site_config_fixes.sql` in the SQL Editor. It seeds `landing_page` and adds the RLS policies needed for admin saves.

## Step 3: Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/) and create an account.
2. In your Cloudinary Dashboard, copy your **Cloud Name** into `.env`.
3. Go to Settings → Upload → Upload presets and create a new unsigned upload preset.
4. Copy the preset name into your `.env` as `VITE_CLOUDINARY_UPLOAD_PRESET`.

## Step 4: Final Setup

1. Copy `.env.example` to `.env` and fill in all the values from the steps above.
2. Run `npm install` to install all dependencies.
3. Run `npm run dev` to start the development server!
