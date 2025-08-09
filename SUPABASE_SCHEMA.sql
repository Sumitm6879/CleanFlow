-- CleanFlow Mumbai - Supabase Database Schema
-- This SQL file creates all necessary tables, triggers, storage buckets, and policies for the cleanup drives system

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage bucket for drive images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('drive-images', 'drive-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- TABLES
-- =============================================

-- Drives table (main table for cleanup drives)
CREATE TABLE IF NOT EXISTS public.drives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    organizer_name TEXT NOT NULL,
    organizer_type TEXT CHECK (organizer_type IN ('NGO', 'Community', 'Individual')) NOT NULL,
    organizer_avatar TEXT,
    organizer_bio TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    location TEXT NOT NULL,
    area TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration TEXT NOT NULL,
    max_volunteers INTEGER NOT NULL CHECK (max_volunteers > 0),
    registered_volunteers INTEGER DEFAULT 0 CHECK (registered_volunteers >= 0),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT false,
    requirements TEXT[] DEFAULT '{}',
    safety_measures TEXT[] DEFAULT '{}',
    expected_impact JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drive participants table (for tracking who joined which drives)
CREATE TABLE IF NOT EXISTS public.drive_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drive_id UUID REFERENCES public.drives(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    notes TEXT,
    UNIQUE(drive_id, user_id)
);

-- Drive images table (for managing multiple images per drive)
CREATE TABLE IF NOT EXISTS public.drive_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drive_id UUID REFERENCES public.drives(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drive reviews/ratings table (for post-drive feedback)
CREATE TABLE IF NOT EXISTS public.drive_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drive_id UUID REFERENCES public.drives(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(drive_id, user_id)
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_drives_organizer_id ON public.drives(organizer_id);
CREATE INDEX IF NOT EXISTS idx_drives_date ON public.drives(date);
CREATE INDEX IF NOT EXISTS idx_drives_area ON public.drives(area);
CREATE INDEX IF NOT EXISTS idx_drives_status ON public.drives(status);
CREATE INDEX IF NOT EXISTS idx_drives_tags ON public.drives USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_drives_location ON public.drives(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_drive_participants_drive_id ON public.drive_participants(drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_participants_user_id ON public.drive_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_drive_participants_status ON public.drive_participants(status);

CREATE INDEX IF NOT EXISTS idx_drive_images_drive_id ON public.drive_images(drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_images_primary ON public.drive_images(drive_id, is_primary) WHERE is_primary = true;

CREATE INDEX IF NOT EXISTS idx_drive_reviews_drive_id ON public.drive_reviews(drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_reviews_user_id ON public.drive_reviews(user_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to drives table
DROP TRIGGER IF EXISTS update_drives_updated_at ON public.drives;
CREATE TRIGGER update_drives_updated_at
    BEFORE UPDATE ON public.drives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update registered_volunteers count
CREATE OR REPLACE FUNCTION update_drive_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increase count when someone joins
        UPDATE public.drives 
        SET registered_volunteers = registered_volunteers + 1
        WHERE id = NEW.drive_id AND NEW.status = 'registered';
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Adjust count based on status change
        IF OLD.status = 'registered' AND NEW.status != 'registered' THEN
            UPDATE public.drives 
            SET registered_volunteers = registered_volunteers - 1
            WHERE id = NEW.drive_id;
        ELSIF OLD.status != 'registered' AND NEW.status = 'registered' THEN
            UPDATE public.drives 
            SET registered_volunteers = registered_volunteers + 1
            WHERE id = NEW.drive_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrease count when someone leaves
        IF OLD.status = 'registered' THEN
            UPDATE public.drives 
            SET registered_volunteers = registered_volunteers - 1
            WHERE id = OLD.drive_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply participant count trigger
DROP TRIGGER IF EXISTS trigger_update_drive_participant_count ON public.drive_participants;
CREATE TRIGGER trigger_update_drive_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON public.drive_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_drive_participant_count();

-- Trigger to ensure only one primary image per drive
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = true THEN
        -- Remove primary flag from other images of the same drive
        UPDATE public.drive_images 
        SET is_primary = false 
        WHERE drive_id = NEW.drive_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply primary image trigger
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_image ON public.drive_images;
CREATE TRIGGER trigger_ensure_single_primary_image
    BEFORE INSERT OR UPDATE ON public.drive_images
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_image();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_reviews ENABLE ROW LEVEL SECURITY;

-- Drives policies
-- Anyone can view drives
CREATE POLICY "Anyone can view drives" ON public.drives
    FOR SELECT USING (true);

-- Only authenticated users can insert drives
CREATE POLICY "Authenticated users can insert drives" ON public.drives
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only drive organizers can update their drives
CREATE POLICY "Organizers can update their drives" ON public.drives
    FOR UPDATE USING (auth.uid() = organizer_id);

-- Only drive organizers can delete their drives
CREATE POLICY "Organizers can delete their drives" ON public.drives
    FOR DELETE USING (auth.uid() = organizer_id);

-- Drive participants policies
-- Anyone can view drive participants
CREATE POLICY "Anyone can view drive participants" ON public.drive_participants
    FOR SELECT USING (true);

-- Authenticated users can join drives
CREATE POLICY "Authenticated users can join drives" ON public.drive_participants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can update their own participation
CREATE POLICY "Users can update their own participation" ON public.drive_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can cancel their own participation
CREATE POLICY "Users can delete their own participation" ON public.drive_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Drive images policies
-- Anyone can view drive images
CREATE POLICY "Anyone can view drive images" ON public.drive_images
    FOR SELECT USING (true);

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images" ON public.drive_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update images they uploaded
CREATE POLICY "Users can update their images" ON public.drive_images
    FOR UPDATE USING (auth.uid() = uploaded_by);

-- Users can delete images they uploaded
CREATE POLICY "Users can delete their images" ON public.drive_images
    FOR DELETE USING (auth.uid() = uploaded_by);

-- Drive reviews policies
-- Anyone can view drive reviews
CREATE POLICY "Anyone can view drive reviews" ON public.drive_reviews
    FOR SELECT USING (true);

-- Authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON public.drive_reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON public.drive_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON public.drive_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Drive images storage policies
CREATE POLICY "Anyone can view drive images" ON storage.objects
    FOR SELECT USING (bucket_id = 'drive-images');

CREATE POLICY "Authenticated users can upload drive images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'drive-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own drive images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'drive-images' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own drive images" ON storage.objects
    FOR DELETE USING (bucket_id = 'drive-images' AND auth.uid() = owner);

-- Avatar storage policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatars" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- =============================================
-- VIEWS FOR EASIER QUERYING
-- =============================================

-- View for drives with additional computed fields
CREATE OR REPLACE VIEW public.drives_with_stats AS
SELECT 
    d.*,
    COALESCE(
        (SELECT image_url FROM public.drive_images WHERE drive_id = d.id AND is_primary = true LIMIT 1),
        (SELECT image_url FROM public.drive_images WHERE drive_id = d.id ORDER BY created_at LIMIT 1)
    ) as primary_image,
    (SELECT COUNT(*) FROM public.drive_images WHERE drive_id = d.id) as image_count,
    (SELECT AVG(rating) FROM public.drive_reviews WHERE drive_id = d.id) as average_rating,
    (SELECT COUNT(*) FROM public.drive_reviews WHERE drive_id = d.id) as review_count,
    CASE 
        WHEN d.date < CURRENT_DATE THEN 'past'
        WHEN d.date = CURRENT_DATE THEN 'today'
        ELSE 'future'
    END as date_category,
    CASE
        WHEN d.registered_volunteers >= d.max_volunteers THEN 'full'
        WHEN d.registered_volunteers >= (d.max_volunteers * 0.8) THEN 'filling_up'
        ELSE 'available'
    END as capacity_status
FROM public.drives d;

-- View for user's drive participation history
CREATE OR REPLACE VIEW public.user_drive_history AS
SELECT 
    dp.*,
    d.title as drive_title,
    d.date as drive_date,
    d.area as drive_area,
    d.organizer_name,
    d.status as drive_status
FROM public.drive_participants dp
JOIN public.drives d ON dp.drive_id = d.id;

-- =============================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =============================================

-- Function to join a drive
CREATE OR REPLACE FUNCTION join_drive(p_drive_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_max_volunteers INTEGER;
    v_current_count INTEGER;
BEGIN
    -- Get max volunteers and current count
    SELECT max_volunteers, registered_volunteers 
    INTO v_max_volunteers, v_current_count
    FROM public.drives 
    WHERE id = p_drive_id;
    
    -- Check if drive exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Drive not found';
    END IF;
    
    -- Check if drive is full
    IF v_current_count >= v_max_volunteers THEN
        RAISE EXCEPTION 'Drive is full';
    END IF;
    
    -- Insert participation record
    INSERT INTO public.drive_participants (drive_id, user_id, status)
    VALUES (p_drive_id, p_user_id, 'registered')
    ON CONFLICT (drive_id, user_id) DO UPDATE SET
        status = 'registered',
        joined_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to leave a drive
CREATE OR REPLACE FUNCTION leave_drive(p_drive_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.drive_participants 
    SET status = 'cancelled'
    WHERE drive_id = p_drive_id AND user_id = p_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get nearby drives (requires latitude/longitude)
CREATE OR REPLACE FUNCTION get_nearby_drives(
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION,
    p_radius_km DOUBLE PRECISION DEFAULT 10
)
RETURNS SETOF public.drives AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.drives
    WHERE latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND (
        6371 * acos(
          cos(radians(p_latitude)) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(p_longitude)) + 
          sin(radians(p_latitude)) * 
          sin(radians(latitude))
        )
      ) <= p_radius_km
    ORDER BY (
        6371 * acos(
          cos(radians(p_latitude)) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(p_longitude)) + 
          sin(radians(p_latitude)) * 
          sin(radians(latitude))
        )
      );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =============================================

-- Insert sample drives (uncomment to add sample data)
/*
INSERT INTO public.drives (
    title, description, full_description, organizer_id, organizer_name, organizer_type,
    contact_email, location, area, date, time, duration, max_volunteers, tags
) VALUES 
(
    'Versova Beach Mega Cleanup',
    'Join us for a large-scale beach cleanup initiative to remove plastic waste.',
    'A comprehensive beach cleanup drive focusing on removing plastic waste, educating volunteers about marine conservation, and creating awareness about environmental protection. We will provide all necessary equipment including gloves, bags, and safety gear.',
    (SELECT id FROM auth.users LIMIT 1),
    'Ocean Guardians NGO',
    'NGO',
    'contact@oceanguardians.org',
    'Versova Beach, Andheri West',
    'Andheri',
    CURRENT_DATE + INTERVAL '7 days',
    '07:00',
    '4 hours',
    200,
    ARRAY['Beach Cleanup', 'Plastic Waste', 'Marine Conservation']
),
(
    'Mithi River Restoration Drive',
    'Community-driven initiative to clean the Mithi River banks.',
    'Join our community effort to restore the Mithi River ecosystem. We will focus on removing debris, planting native vegetation, and creating awareness about water conservation. This is a family-friendly event suitable for all ages.',
    (SELECT id FROM auth.users LIMIT 1),
    'Clean Mumbai Initiative',
    'Community',
    'info@cleanmumbai.org',
    'Mithi River, Kurla',
    'Kurla',
    CURRENT_DATE + INTERVAL '10 days',
    '08:30',
    '3 hours',
    100,
    ARRAY['River Cleanup', 'Plantation', 'Water Conservation']
);
*/

-- Note: Run this SQL in your Supabase SQL Editor to create all the necessary tables and policies
