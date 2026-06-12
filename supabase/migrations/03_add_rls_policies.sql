-- Enable RLS on users and reserved_usernames tables and add necessary policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserved_usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users table policies:
-- Allow public read for users
DROP POLICY IF EXISTS "users: public read" ON users;
CREATE POLICY "users: public read"
  ON users FOR SELECT
  USING (true);

-- Allow authenticated users (admins) to write to users
DROP POLICY IF EXISTS "users: authenticated write" ON users;
CREATE POLICY "users: authenticated write"
  ON users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reserved usernames policies:
-- Allow public read (for checking usernames)
DROP POLICY IF EXISTS "reserved_usernames: public read" ON reserved_usernames;
CREATE POLICY "reserved_usernames: public read"
  ON reserved_usernames FOR SELECT
  USING (true);

-- Allow authenticated users (admins) to write to reserved_usernames
DROP POLICY IF EXISTS "reserved_usernames: authenticated write" ON reserved_usernames;
CREATE POLICY "reserved_usernames: authenticated write"
  ON reserved_usernames FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Analytics events policies:
-- Allow authenticated users to insert
DROP POLICY IF EXISTS "analytics_events: authenticated insert" ON analytics_events;
CREATE POLICY "analytics_events: authenticated insert"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users (admins) to read analytics
DROP POLICY IF EXISTS "analytics_events: authenticated read" ON analytics_events;
CREATE POLICY "analytics_events: authenticated read"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (true);

