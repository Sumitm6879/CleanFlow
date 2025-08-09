# Storage RLS Policy Fix - Complete Solution

## ❌ Problem
**Error**: "new row violates row-level security policy" when uploading files (avatars, drive images)

**Cause**: Supabase storage buckets have Row Level Security enabled but policies are misconfigured or missing.

## 🚀 Quick Fix (Immediate Solution)

### Step 1: Run Quick Fix SQL
Copy and run `QUICK_STORAGE_FIX.sql` in your Supabase SQL editor. This will:
- Create necessary storage buckets
- Set up permissive storage policies
- Grant proper permissions

### Step 2: Test the Fix
Open browser console and run:
```javascript
// Test storage upload
await window.debugStorage()

// Or run complete test
await window.testStorage()
```

## 🔧 Comprehensive Fix (Recommended)

### Option A: Full Schema Setup
1. Run the complete `SUPABASE_SCHEMA.sql` file
2. If you get conflicts, run `STORAGE_POLICIES_FIX.sql` first

### Option B: Manual Policy Creation
Run `STORAGE_POLICIES_FIX.sql` which includes:
- Cleanup of conflicting policies
- Creation of proper RLS policies
- Bucket configuration
- Permission grants

## 🧪 Testing & Debugging

### Browser Console Tests
```javascript
// Check storage health
window.checkStorageHealth()

// Test upload permissions
window.testStorageUpload('avatars')

// Complete diagnostic
window.debugStorage()
```

### Manual Upload Test
1. Go to Edit Profile page
2. Try uploading a profile picture
3. Check browser console for detailed error messages

## 📋 Common Error Messages & Solutions

### "Bucket not found"
**Solution**: Run the bucket creation part of the SQL:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);
```

### "JWT expired" / "Unauthorized"
**Solution**: User needs to log out and log back in

### "Policy violation"
**Solution**: Run the storage policies fix SQL

### "File already exists"
**Solution**: This is now handled automatically with `upsert: true`

## 🎯 What Each File Does

- **`QUICK_STORAGE_FIX.sql`**: Immediate fix, very permissive policies
- **`STORAGE_POLICIES_FIX.sql`**: Comprehensive fix with proper security
- **`SUPABASE_SCHEMA.sql`**: Complete database setup including storage
- **`storage-test.js`**: Browser testing utilities

## �� Verification Steps

After running the fix:

1. **Check buckets exist**:
   ```sql
   SELECT * FROM storage.buckets WHERE id IN ('avatars', 'drive-images');
   ```

2. **Check policies exist**:
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'objects';
   ```

3. **Test upload in app**:
   - Go to Edit Profile
   - Upload an avatar
   - Should work without errors

4. **Check avatar appears**:
   - Profile picture should show in header
   - Avatar should appear on drives you create
   - Comments should show your avatar

## 🔄 Still Having Issues?

### Debug Mode
Add this to your browser console:
```javascript
// Enable detailed storage logging
localStorage.setItem('debug-storage', 'true');
```

### Reset Everything
If nothing works, run this nuclear option:
```sql
-- Disable RLS temporarily
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Delete all policies
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'objects'
    LOOP
        EXECUTE 'DROP POLICY "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Re-enable with simple policy
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated users" ON storage.objects 
USING (auth.role() = 'authenticated');
```

## 📞 Need Help?

1. Run `window.debugStorage()` in browser console
2. Copy the output
3. Check the Supabase dashboard under Storage > Policies
4. Verify your user is authenticated in Supabase Auth

The storage system should work perfectly after applying these fixes!
