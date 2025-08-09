# Quick Fix for Storage Upload Error

## ❌ Error
"new row violates row-level security policy" when uploading images

## ✅ Quick Fix (30 seconds)

1. **Go to your Supabase dashboard**
2. **Click on "SQL Editor"** 
3. **Copy and paste this SQL**:
   ```sql
   INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
   INSERT INTO storage.buckets (id, name, public) VALUES ('drive-images', 'drive-images', true) ON CONFLICT DO NOTHING;
   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
   ```
4. **Click "Run"**
5. **Try uploading an avatar again**

## ✅ That's it!

Your file uploads should now work. This temporarily disables security policies to allow uploads.

## 🔒 Optional: Re-enable Security Later

If you want to re-enable proper security policies later, run:
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated uploads" ON storage.objects 
FOR ALL USING (auth.role() = 'authenticated');
```

But for now, the first fix is enough to get uploads working immediately.
