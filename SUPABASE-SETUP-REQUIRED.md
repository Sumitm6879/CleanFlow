# 🚨 SUPABASE SETUP REQUIRED

Your CleanFlow Mumbai app needs the Supabase database to be set up. Follow these exact steps:

## Step 1: Open Your Supabase Dashboard

1. Go to https://supabase.com
2. Sign in to your account
3. Open your CleanFlow Mumbai project
4. You should see your project dashboard

## Step 2: Create Database Tables

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button
3. **COPY AND PASTE** the following SQL code:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    location TEXT DEFAULT 'Mumbai',
    member_since TIMESTAMPTZ DEFAULT NOW(),
    impact_score INTEGER DEFAULT 0,
    eco_hero_level TEXT DEFAULT 'Bronze',
    reports_submitted INTEGER DEFAULT 0,
    cleanup_drives_joined INTEGER DEFAULT 0,
    volunteer_hours INTEGER DEFAULT 0,
    rank_position INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'moderate', 'severe')) DEFAULT 'moderate',
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    type TEXT CHECK (type IN ('pollution', 'cleanup')) DEFAULT 'pollution',
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('report_submitted', 'cleanup_joined', 'volunteer_hours', 'achievement')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    related_report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reports
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Reports: Users can read all approved reports, but only manage their own
CREATE POLICY "Anyone can view approved reports" ON public.reports
    FOR SELECT USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.reports
    FOR UPDATE USING (auth.uid() = user_id);

-- Activities: Users can only see their own activities
CREATE POLICY "Users can view own activities" ON public.activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

4. Click **"RUN"** button to execute the SQL
5. You should see "Success. No rows returned" message

## Step 3: Create Storage Buckets

1. In your Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Create these two buckets:

### Bucket 1: reports
- Name: `reports`
- Public bucket: ✅ **YES** (check this box)
- Click "Create bucket"

### Bucket 2: avatars  
- Name: `avatars`
- Public bucket: ✅ **YES** (check this box)
- Click "Create bucket"

## Step 4: Set Storage Policies

1. In Storage, click on the **"reports"** bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"** and create these policies:

### For reports bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'reports');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');
```

### For avatars bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload/update
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## Step 5: Verify Setup

1. Go to **"Table Editor"** in your Supabase dashboard
2. You should see these tables:
   - ✅ profiles
   - ✅ reports  
   - ✅ activities

3. Go to **"Storage"** and verify these buckets exist:
   - ✅ reports (public)
   - ✅ avatars (public)

## Step 6: Test Your App

1. Refresh your CleanFlow Mumbai app
2. The yellow database warning should disappear
3. Try signing up for a new account
4. Your profile should load with data
5. Try submitting a test pollution report

## ⚠️ If You Still See Issues

### Check Your Environment Variables:
Make sure your `.env` file has:
```
VITE_SUPABASE_URL="https://vmjicjqqgxpnoxzqwolz.supabase.co"
VITE_SUPABASE_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtamljanFxZ3hwbm94enF3b2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODIxMDYsImV4cCI6MjA3MDI1ODEwNn0.T5cfq69cbTdf9Wfzn2FYvyoRtvdT3qMo7w2kIb1gLeM"
```

### Check Authentication:
1. Go to **"Authentication"** → **"Settings"** in Supabase
2. Make sure **"Enable email confirmations"** is OFF for testing
3. Make sure your site URL is set correctly

## 🎉 Once Setup is Complete

- ✅ User profiles will be created automatically
- ✅ Pollution reports will be saved to database  
- ✅ Activity tracking and points will work
- ✅ Maps will show both static and user-submitted reports
- ✅ All features will be fully functional

## Need Help?

If you encounter any errors:
1. Check the browser console for specific error messages
2. Verify all SQL commands ran successfully in Supabase
3. Make sure RLS policies are created correctly
4. Ensure storage buckets are public

The setup should take about 5-10 minutes total.
