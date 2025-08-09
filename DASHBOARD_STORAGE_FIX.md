# Fix Storage Issues via Supabase Dashboard

## ❌ Error
"ERROR: 42501: must be owner of table objects" - You don't have SQL permissions to modify storage directly.

## ✅ Dashboard Fix (2 minutes)

### Step 1: Create Storage Buckets
1. **Go to Supabase Dashboard**
2. **Click "Storage" in left sidebar**
3. **Click "Create a new bucket"**
4. **Create bucket named**: `avatars`
   - Make it **Public**
   - Click "Save"
5. **Create another bucket named**: `drive-images`
   - Make it **Public** 
   - Click "Save"

### Step 2: Configure Policies (Optional)
1. **Still in Storage section**
2. **Click on "Policies" tab**
3. **For each bucket, add policies**:
   - **SELECT**: `true` (allows reading)
   - **INSERT**: `auth.role() = 'authenticated'` (allows uploads for logged in users)
   - **UPDATE**: `auth.role() = 'authenticated'`
   - **DELETE**: `auth.role() = 'authenticated'`

### Step 3: Test Upload
1. **Go back to your app**
2. **Try uploading a profile picture**
3. **Should work now!**

## 🚀 Alternative: Quick SQL Fix (if you have permissions)

If the dashboard doesn't work, try this minimal SQL in the SQL Editor:

```sql
-- Only create buckets (this should work for most users)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('drive-images', 'drive-images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;
```

## ✅ That's it!

The dashboard approach is the safest and works for all Supabase users, regardless of permission level.
