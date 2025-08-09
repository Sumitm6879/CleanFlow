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

-- Create function to update profile stats
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update reports count and impact score
    UPDATE public.profiles 
    SET 
        reports_submitted = (
            SELECT COUNT(*) 
            FROM public.reports 
            WHERE user_id = NEW.user_id AND status = 'approved'
        ),
        impact_score = (
            SELECT COALESCE(SUM(points_earned), 0)
            FROM public.activities 
            WHERE user_id = NEW.user_id
        )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update profile stats
CREATE TRIGGER update_stats_on_report_status_change
    AFTER UPDATE ON public.reports
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_profile_stats();

CREATE TRIGGER update_stats_on_activity_insert
    AFTER INSERT ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profile_stats();

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

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view report photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'reports');

CREATE POLICY "Authenticated users can upload report photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
