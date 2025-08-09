-- QUICK STORAGE FIX - Temporary solution for RLS issues
-- Run this immediately to fix upload issues

-- Step 1: Ensure buckets exist and are public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('drive-images', 'drive-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Temporarily disable RLS on storage.objects (for immediate fix)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS and create simple policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any conflicting policies
DO $$ 
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON storage.objects';
    END LOOP;
END $$;

-- Step 5: Create simple, permissive policies
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated insert"
ON storage.objects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE 
USING (auth.role() = 'authenticated');

-- Step 6: Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Verification queries (run these to check if it worked):
-- SELECT * FROM storage.buckets WHERE id IN ('avatars', 'drive-images');
-- SELECT count(*) FROM pg_policies WHERE tablename = 'objects';
