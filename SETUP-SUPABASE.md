# Supabase Setup Instructions

This guide will help you set up the Supabase database for your CleanFlow Mumbai application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Your existing Supabase project credentials (already in your .env file)

## Database Setup

### Step 1: Run the SQL Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Run the query

This will create all necessary tables, policies, triggers, and storage buckets.

### Step 2: Verify Table Creation

After running the schema, verify that the following tables were created:

- `profiles` - User profile information
- `reports` - Pollution reports and cleanup activities
- `activities` - User activity tracking and points

### Step 3: Storage Buckets

Verify that two storage buckets were created:

- `reports` - For report photos
- `avatars` - For user profile pictures

Both buckets should be set to public access.

## Features Overview

### Authentication & Profiles

- **Auto Profile Creation**: When users sign up, a profile is automatically created
- **Profile Management**: Users can edit their name, location, and upload profile pictures
- **Data Tracking**: Reports, cleanup drives, volunteer hours, and impact scores are automatically tracked

### Reports System

- **Dynamic Maps**: Combines static demo data with user-submitted reports
- **Photo Uploads**: Users can upload up to 5 photos per report
- **Location Selection**: Interactive map or current location for precise reporting
- **Severity Levels**: Low, Moderate, Severe with different point values

### Activity Tracking

- **Points System**:
  - Low severity reports: 10 points
  - Moderate severity reports: 15 points
  - Severe severity reports: 20 points
  - Cleanup participation: 5 points per hour
  - Volunteer hours: 3 points per hour

- **Eco Hero Levels**: Bronze, Silver, Gold, Platinum based on points
- **Leaderboard**: Ranked by impact score

### Profile Features

- **Activity Summary**: Reports submitted, cleanups joined, volunteer hours
- **Recent Activities**: Timeline of user actions with points earned
- **Impact Score**: Total points accumulated
- **Rank Display**: User position in city-wide leaderboard

## Protected vs Public Routes

### Public Routes (No Authentication Required)
- `/` - Landing page
- `/maps` - View pollution reports and cleanup drives
- `/about` - About page
- `/contact` - Contact page
- `/login` & `/signup` - Authentication pages

### Protected Routes (Authentication Required)
- `/profile` - User profile page
- `/edit-profile` - Edit profile information
- `/report` - Submit pollution reports
- `/organize` - Organize cleanup drives
- `/leaderboard` - View full leaderboard
- `/participation` - Track participation
- All drive-specific pages

## Database Policies (Row Level Security)

- **Profiles**: Users can view all profiles but only edit their own
- **Reports**: Users can view approved reports and manage their own submissions
- **Activities**: Users can only view their own activity history
- **Storage**: Public read access, authenticated upload with user-specific paths

## Testing the Integration

1. **Sign Up**: Create a new account - profile should auto-create
2. **Report Submission**: Submit a pollution report with photos and location
3. **Profile Update**: Edit profile information and upload avatar
4. **Activity Tracking**: Verify points are awarded and activities are logged
5. **Maps Integration**: Check that new reports appear on the maps

## Troubleshooting

### Common Issues

1. **Profile Not Creating**: Check RLS policies and ensure auth user has proper permissions
2. **File Upload Fails**: Verify storage buckets exist and have proper policies
3. **Reports Not Appearing**: Check report status (should be 'approved' for public viewing)
4. **Points Not Updating**: Verify triggers are working for profile stats updates

### Debug Queries

```sql
-- Check if profile exists for user
SELECT * FROM profiles WHERE id = 'user-uuid-here';

-- Check recent activities
SELECT * FROM activities WHERE user_id = 'user-uuid-here' ORDER BY created_at DESC LIMIT 10;

-- Check report status
SELECT id, title, status, created_at FROM reports WHERE user_id = 'user-uuid-here';

-- Manually update report status for testing
UPDATE reports SET status = 'approved' WHERE id = 'report-id-here';
```

## Production Considerations

1. **Moderate Reports**: Set up admin panel to review and approve reports
2. **Image Optimization**: Consider adding image resizing/compression
3. **Rate Limiting**: Implement submission limits to prevent spam
4. **Backup Strategy**: Set up automated backups for user data
5. **Analytics**: Track usage patterns and popular reporting locations

## Support

If you encounter issues with the Supabase integration:

1. Check the Supabase dashboard for error logs
2. Verify environment variables in your .env file
3. Ensure your Supabase project has sufficient quota
4. Check the browser network tab for API errors

The application gracefully falls back to static data if database operations fail, ensuring a smooth user experience even during temporary outages.
