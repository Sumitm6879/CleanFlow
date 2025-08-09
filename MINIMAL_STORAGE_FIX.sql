-- MINIMAL STORAGE FIX - Run this immediately in Supabase SQL Editor

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('drive-images', 'drive-images', true) ON CONFLICT DO NOTHING;

-- Temporarily disable RLS to fix immediate issue
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Alternative: If you prefer to keep RLS enabled, run this instead:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "temp_allow_all" ON storage.objects USING (true) WITH CHECK (true);
