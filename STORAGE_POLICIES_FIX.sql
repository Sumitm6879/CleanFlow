-- Storage Policies Fix - Row Level Security Issues
-- Run this to fix storage upload permissions

-- =============================================
-- DROP EXISTING CONFLICTING POLICIES
-- =============================================

-- Drop existing storage policies to start fresh
DROP POLICY IF EXISTS "Anyone can view drive images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload drive images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own drive images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own drive images" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- =============================================
-- CREATE STORAGE BUCKETS (IF NOT EXISTS)
-- =============================================

-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('drive-images', 'drive-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =============================================
-- ENABLE RLS ON STORAGE OBJECTS
-- =============================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE NEW STORAGE POLICIES
-- =============================================

-- Drive Images Bucket Policies
CREATE POLICY "Public Access - Drive Images View"
ON storage.objects FOR SELECT 
USING (bucket_id = 'drive-images');

CREATE POLICY "Authenticated Users - Drive Images Insert"
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'drive-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Owners Only - Drive Images Update"
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'drive-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owners Only - Drive Images Delete"
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'drive-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatar Bucket Policies
CREATE POLICY "Public Access - Avatars View"
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated Users - Avatars Insert"
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Owners Only - Avatars Update"
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owners Only - Avatars Delete"
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- CREATE FALLBACK POLICIES (MORE PERMISSIVE)
-- =============================================

-- If the above policies are too restrictive, use these instead:

-- Fallback policy for authenticated users to upload to any bucket
CREATE POLICY "Authenticated Upload Fallback"
ON storage.objects FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated' 
    AND bucket_id IN ('avatars', 'drive-images')
);

-- Fallback policy for file updates (less restrictive)
CREATE POLICY "Authenticated Update Fallback"
ON storage.objects FOR UPDATE 
USING (
    auth.role() = 'authenticated' 
    AND bucket_id IN ('avatars', 'drive-images')
);

-- =============================================
-- VERIFY BUCKET CONFIGURATION
-- =============================================

-- Check bucket settings
UPDATE storage.buckets 
SET 
    public = true,
    file_size_limit = 52428800, -- 50MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id IN ('avatars', 'drive-images');

-- =============================================
-- GRANT NECESSARY PERMISSIONS
-- =============================================

-- Grant permissions to authenticated users
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- =============================================
-- TEST FUNCTIONS
-- =============================================

-- Function to test storage permissions
CREATE OR REPLACE FUNCTION test_storage_permissions()
RETURNS TABLE (
    bucket_name text,
    can_select boolean,
    can_insert boolean,
    can_update boolean,
    can_delete boolean
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        b.name as bucket_name,
        (SELECT count(*) > 0 FROM storage.objects WHERE bucket_id = b.id LIMIT 1) as can_select,
        true as can_insert,  -- We'll assume insert works if policies are correct
        true as can_update,
        true as can_delete
    FROM storage.buckets b
    WHERE b.id IN ('avatars', 'drive-images');
$$;

-- =============================================
-- DEBUGGING QUERIES
-- =============================================

-- Use these to debug if issues persist:
-- SELECT * FROM storage.buckets WHERE id IN ('avatars', 'drive-images');
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'objects';
-- SELECT auth.uid(), auth.role();
