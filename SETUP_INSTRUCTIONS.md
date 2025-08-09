# Setup Instructions for Drive Organization System

## What's Been Implemented

✅ **Complete Supabase Database Schema** - Tables, triggers, storage, and policies for drives system
✅ **Interactive Organize Drive Form** - Form with optional map for location selection
✅ **Image Upload Support** - Users can upload up to 5 images for drives
✅ **Drive Management** - Create, join, leave, and view drives
✅ **Real-time Data Integration** - Cleanup drives page fetches from Supabase
✅ **User Profile Integration** - Shows user's joined drives and participation

## Required Setup Steps

### 1. Run the Supabase Schema

Copy and run the entire contents of `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor. This will:

- Create all necessary tables (`drives`, `drive_participants`, `drive_images`, `drive_reviews`)
- Set up storage buckets for drive images
- Create triggers for automatic counting and data integrity
- Configure Row Level Security (RLS) policies
- Add helpful database functions and views

### 2. Configure Environment Variables

Make sure these environment variables are set:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON=your_supabase_anon_key
```

### 3. Test the System

1. **Create a Drive**: Go to `/organize-drive` to create a new cleanup drive
2. **View Drives**: Visit `/cleanup-drives` to see all drives
3. **Join a Drive**: Click on any drive to view details and join
4. **Check Profile**: Your joined drives will appear in your user profile

## Key Features

### Drive Creation Form
- **Basic Information**: Title, descriptions, organizer details
- **Location & Timing**: Address, area selection, date/time, duration
- **Interactive Map**: Optional location picker with coordinates
- **Event Details**: Volunteer capacity, tags, requirements, safety measures
- **Image Upload**: Up to 5 images to showcase the drive
- **Verification**: Optional NGO verification checkbox

### Drive Management
- **Real-time Volunteer Count**: Automatic updates when users join/leave
- **Status Tracking**: Upcoming, ongoing, completed, cancelled
- **Advanced Filtering**: By area, organizer type, status, and search
- **Image Gallery**: Multiple images per drive with primary image selection

### Database Features
- **Geographic Search**: Find drives near specific coordinates
- **Automatic Triggers**: Update volunteer counts, maintain data integrity
- **Reviews System**: Post-drive ratings and feedback
- **Activity Tracking**: User engagement and impact scoring

### Security & Permissions
- **Row Level Security**: Users can only edit their own drives
- **Public Viewing**: Anyone can view and search drives
- **Authenticated Actions**: Only logged-in users can create/join drives
- **Storage Policies**: Secure image upload and access

## Database Schema Overview

### Main Tables
- `drives` - Main drive information with location coordinates
- `drive_participants` - Track who joined which drives
- `drive_images` - Multiple images per drive with primary designation
- `drive_reviews` - Post-event feedback and ratings

### Key Fields Added
- `latitude/longitude` - Optional GPS coordinates for precise location
- `images[]` - Array of image URLs
- `requirements[]` - What volunteers should bring
- `safety_measures[]` - Safety protocols and equipment
- `expected_impact` - JSON field for impact projections

### Storage Buckets
- `drive-images` - Public bucket for drive photos
- `avatars` - User profile images
- Automatic cleanup and access policies

## API Integration

All drive operations are available through the database functions:

```typescript
// Drive operations
getDrives() - Get all drives
getDriveById(id) - Get specific drive
createDrive(data) - Create new drive
joinCleanupDrive(driveId, userId) - Join a drive
leaveCleanupDrive(driveId, userId) - Leave a drive

// User operations
getUserDriveParticipation(userId) - Get user's joined drives
isUserJoinedDrive(driveId, userId) - Check participation status

// Image operations
uploadDriveImages(files) - Upload multiple images
uploadPhoto(file, bucket) - Upload single image
```

## Next Steps

1. Run the SQL schema in Supabase
2. Test drive creation with different organizer types
3. Upload test images to verify storage is working
4. Try joining/leaving drives to test volunteer counting
5. Check that drives appear correctly in user profiles

The system is now fully functional with production-ready features including location mapping, image management, and comprehensive user interaction tracking.
