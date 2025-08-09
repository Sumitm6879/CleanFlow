import { supabase } from './supabase'
import { Database, Profile, Report, Activity, Drive, DriveParticipant } from './database.types'

// Utility function to properly log errors
function logError(context: string, error: any, additionalInfo?: any) {
  console.group(`🚨 ${context}`);
  console.error('Error Message:', error?.message || 'Unknown error');
  console.error('Error Code:', error?.code || 'No code');
  console.error('Error Details:', error?.details || 'No details');
  console.error('Error Hint:', error?.hint || 'No hint');
  if (additionalInfo) {
    console.error('Additional Info:', additionalInfo);
  }
  console.error('Full Error Object:', error);
  console.error('Error Type:', typeof error);
  console.error('Error Constructor:', error?.constructor?.name);
  console.groupEnd();
}

// Version check - helps confirm new code is loaded
const timestamp = new Date().toISOString();
console.log(`🔥 DATABASE MODULE LOADED - VERSION 3.12 (${timestamp}) - BULLETPROOF ERROR HANDLING 🔥`);

// Test function to verify error logging is working
(window as any).testErrorLogging = () => {
  console.log('🧪 Testing error logging...');
  logError('TEST ERROR', {
    message: 'This is a test error',
    code: 'TEST123',
    details: 'Testing error logging functionality'
  }, { test: true });
  console.log('✅ Test complete - check above for detailed error output');
};

// Add storage debugging functions to window for easy testing
(window as any).checkStorageHealth = checkStorageHealth;
(window as any).testStorageUpload = testStorageUpload;
(window as any).debugStorage = async () => {
  console.log('🔧 Running complete storage diagnostics...');

  const health = await checkStorageHealth();
  console.log('Storage Health:', health);

  if (health.working) {
    const uploadTest = await testStorageUpload('avatars');
    console.log('Upload Test Result:', uploadTest);
  }

  console.log('✅ Storage diagnostics complete');
};

// Storage health check
export async function checkStorageHealth(): Promise<{ buckets: string[], working: boolean, details: any }> {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.warn('Storage check failed:', error.message);
      return { buckets: [], working: false, details: { error: error.message } };
    }

    const bucketNames = buckets?.map(b => b.name) || [];
    console.log('Available storage buckets:', bucketNames);

    // Check authentication status
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    const details = {
      bucketsFound: bucketNames,
      userAuthenticated: !!user,
      userId: user?.id,
      userRole: user?.role,
      userError: userError?.message
    };

    console.log('Storage health details:', details);

    return {
      buckets: bucketNames,
      working: true,
      details
    };
  } catch (err) {
    console.warn('Storage health check error:', err);
    return {
      buckets: [],
      working: false,
      details: {
        error: err.message,
        type: 'unexpected_error'
      }
    };
  }
}

// Test storage upload permissions
export async function testStorageUpload(bucket: 'avatars' | 'drive-images' = 'avatars'): Promise<boolean> {
  try {
    console.log('Testing storage upload permissions for bucket:', bucket);

    // Create a small test file
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });

    // Try to upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`test-${Date.now()}.txt`, testFile, { upsert: true });

    if (error) {
      console.error('Storage test upload failed:', error);
      return false;
    }

    // Clean up test file
    if (data?.path) {
      await supabase.storage.from(bucket).remove([data.path]);
    }

    console.log('Storage upload test successful');
    return true;
  } catch (err) {
    console.error('Storage test error:', err);
    return false;
  }
}

// Database health check with enhanced connectivity handling
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    console.log('🔍 Checking database connectivity...');

    // Test basic connection with a simple count query
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })

    if (error) {
      // Specific error codes we can handle
      if (error.code === '42P01') {
        console.warn('Database tables not found - setup required');
        return false;
      }

      // Network connectivity issues
      if (error.message?.includes('Failed to fetch') ||
          error.message?.includes('fetch')) {
        console.warn('🚨 Supabase connectivity issue - may be offline or network problem');
        console.warn('This is normal in development - using mock data instead');
        return false;
      }

      console.error('Database health check failed:', {
        message: error.message,
        code: error.code
      });
      return false;
    }

    console.log('Database health check passed');
    return true;
  } catch (err: any) {
    if (err?.message?.includes('Failed to fetch') ||
        err?.message?.includes('fetch') ||
        err?.name === 'TypeError') {
      console.warn('🚨 Network connectivity issue with Supabase');
      console.warn('Using offline mode with mock data');
    } else {
      console.error('Database health check error:', err);
    }
    return false;
  }
}

export type Tables = Database['public']['Tables']
export type ProfileInsert = Tables['profiles']['Insert']
export type ProfileUpdate = Tables['profiles']['Update']
export type ReportInsert = Tables['reports']['Insert']
export type ActivityInsert = Tables['activities']['Insert']

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        // Row not found - this is expected for new users
        console.log('Profile not found for user:', userId)
        return null
      } else if (error.code === '42P01') {
        // Table doesn't exist
        console.error('Profiles table does not exist. Please run the database migration.')
        return null
      } else {
        console.error('Error fetching profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          userId
        })
      }
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error in getProfile:', err)
    return null
  }
}

export async function createProfile(profile: ProfileInsert): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        profileData: profile
      })
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error in createProfile:', err)
    return null
  }
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    logError('Error updating profile', error, { userId, updates })
    return null
  }

  return data
}

// Report functions
export async function getReports(type?: 'pollution' | 'cleanup'): Promise<Report[]> {
  try {
    let query = supabase
      .from('reports')
      .select(`
        *,
        profiles!reports_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .in('status', ['pending', 'approved'])
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      if (error.code === '42P01') {
        console.warn('Reports table does not exist yet. Using static data only.')
        return []
      } else {
        logError('Error fetching reports', error, {
          type: type || 'all',
          timestamp: new Date().toISOString(),
          function: 'getReports'
        })
      }
      return []
    }

    console.log('Successfully fetched', data?.length || 0, 'reports from database')
    return data || []
  } catch (err) {
    logError('Unexpected error in getReports', err, { type: type || 'all' })
    return []
  }
}

export async function getUserReports(userId: string): Promise<Report[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      logError('Error fetching user reports', error, { userId })
      return []
    }

    return data || []
  } catch (err) {
    logError('Unexpected error in getUserReports', err, { userId })
    return []
  }
}

export async function createReport(report: ReportInsert): Promise<Report | null> {
  try {
    console.log('📝 Creating report:', {
      title: report.title,
      location: report.location_name,
      type: report.type,
      severity: report.severity,
      status: report.status || 'pending'
    });

    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single()

    if (error) {
      logError('Error creating report', error, report)
      return null
    }

    console.log('✅ Report created successfully:', {
      id: data.id,
      title: data.title,
      status: data.status,
      type: data.type
    });

    // Calculate points based on severity
    const points = report.severity === 'severe' ? 20 : report.severity === 'moderate' ? 15 : 10

    // Create activity for report submission
    console.log('🎯 Creating activity for report submission...');
    const activity = await createActivity({
      user_id: report.user_id,
      type: 'report_submitted',
      title: 'Pollution Report Submitted',
      description: `Submitted a ${report.severity} pollution report: ${report.title}`,
      points_earned: points,
      related_report_id: data.id,
      metadata: {
        severity: report.severity,
        location: report.location_name,
        report_title: report.title
      }
    });

    if (activity) {
      console.log('✅ Activity created successfully, user earned:', points, 'points');
    }

    return data
  } catch (err) {
    logError('Unexpected error in createReport', err, report)
    return null
  }
}

// Activity functions
export async function getUserActivities(userId: string, limit = 10): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        reports!activities_related_report_id_fkey (
          title,
          location_name,
          photos
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      if (error.code === '42P01') {
        console.warn('Activities table does not exist yet. Using mock data.')
        return []
      } else {
        logError('Error fetching user activities', error, { userId })
      }
      return []
    }

    return data || []
  } catch (err) {
    logError('Unexpected error in getUserActivities', err, { userId })
    return []
  }
}

export async function createActivity(activity: ActivityInsert): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single()

  if (error) {
    logError('Error creating activity', error, activity)
    return null
  }

  return data
}

// File upload functions
export async function uploadPhoto(file: File, bucket: 'reports' | 'avatars' | 'drive-images', fileName?: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `${finalFileName}`

    // If a specific filename is provided (like for avatars), try to remove existing file first
    if (fileName) {
      await supabase.storage
        .from(bucket)
        .remove([filePath])
      // Don't worry if removal fails - the file might not exist
    }

    // Upload the file with upsert option
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true // This allows overwriting existing files
      })

    if (error) {
      // Handle specific error types
      if (error.message?.includes('row-level security policy') || error.message?.includes('policy')) {
        console.warn(`🚨 STORAGE SETUP NEEDED:`);
        console.warn(`1. Go to Supabase Dashboard → Storage`);
        console.warn(`2. Create buckets: 'avatars' and 'drive-images' (make them public)`);
        console.warn(`3. Set policies to allow authenticated users`);

        // Show user-friendly error message
        if (typeof window !== 'undefined') {
          alert('Storage not configured. Go to Supabase Dashboard → Storage → Create buckets: "avatars" and "drive-images" (make them public)');
        }

        logError('Storage RLS policy violation', error, {
          bucket,
          fileName,
          filePath,
          helpMessage: 'Create storage buckets via Supabase Dashboard'
        });
      } else if (error.message?.includes('Bucket not found') || error.message?.includes('bucket does not exist')) {
        console.warn(`Storage bucket '${bucket}' not found. Please run the Supabase setup SQL to create storage buckets.`);
        logError('Storage bucket not found', error, {
          bucket,
          fileName,
          filePath,
          helpMessage: 'Run MINIMAL_STORAGE_FIX.sql to create storage buckets'
        });
      } else if (error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
        console.warn('User authentication issue during upload');
        logError('Authentication error during upload', error, {
          bucket,
          fileName,
          filePath,
          helpMessage: 'User may need to re-authenticate'
        });
      } else {
        logError('Error uploading file', error, { bucket, fileName, filePath })
      }
      return null
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (err) {
    logError('Unexpected error in uploadPhoto', err, { bucket, fileName })
    return null
  }
}

export async function uploadDriveImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadPhoto(file, 'drive-images'));
  const results = await Promise.all(uploadPromises);
  return results.filter(url => url !== null) as string[];
}

export async function deletePhoto(bucket: 'reports' | 'avatars' | 'drive-images', filePath: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    logError('Error deleting file', error, { bucket, filePath })
    return false
  }

  return true
}

// Geocoding function for location search
export async function searchLocations(query: string): Promise<Array<{
  name: string
  fullName: string
  lat: number
  lon: number
}>> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Mumbai Maharashtra India')}&limit=5&addressdetails=1`
    )
    const data = await response.json()

    return data.map((item: any) => ({
      name: item.display_name.split(',')[0],
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }))
  } catch (error) {
    logError('Location search error', error, { query })
    return []
  }
}

// Leaderboard functions
export async function getLeaderboard(limit = 50): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('impact_score', { ascending: false })
      .limit(limit)

    if (error) {
      if (error.code === '42P01') {
        console.warn('Profiles table does not exist yet. Using mock data.')
        return []
      } else {
        console.error('Error fetching leaderboard:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
      }
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error in getLeaderboard:', err)
    return []
  }
}

export async function updateUserRanking(): Promise<void> {
  try {
    // This would typically be run as a scheduled function
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, impact_score')
      .order('impact_score', { ascending: false })

    if (profiles) {
      for (let i = 0; i < profiles.length; i++) {
        await supabase
          .from('profiles')
          .update({ rank_position: i + 1 })
          .eq('id', profiles[i].id)
      }
    }
  } catch (error) {
    logError('Error updating rankings', error)
  }
}

// Drive functions
export async function getDrives(): Promise<Drive[]> {
  try {
    const { data, error } = await supabase
      .from('drives')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      if (error.code === '42P01') {
        console.warn('Drives table does not exist yet.')
        return []
      }
      logError('Error fetching drives', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error in getDrives:', err)
    return []
  }
}

export async function getDriveById(id: string): Promise<Drive | null> {
  try {
    const { data, error } = await supabase
      .from('drives')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('Drive not found:', id)
        return null
      }
      if (error.code === '42P01') {
        console.warn('Drives table does not exist yet.')
        return null
      }
      logError('Error fetching drive', error, { id })
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error in getDriveById:', err)
    return null
  }
}

export async function createDrive(driveData: Database['public']['Tables']['drives']['Insert']): Promise<Drive | null> {
  try {
    const { data, error } = await supabase
      .from('drives')
      .insert({
        ...driveData,
        registered_volunteers: 0,
        status: 'upcoming',
        verified: driveData.organizer_type === 'NGO', // Auto-verify NGOs
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      logError('Error creating drive', error, driveData)
      return null
    }

    console.log('Drive created successfully:', data.id)
    return data
  } catch (err) {
    console.error('Unexpected error in createDrive:', err)
    return null
  }
}

export async function joinCleanupDrive(driveId: string, userId: string): Promise<boolean> {
  try {
    // Check if user is already registered
    const { data: existingParticipation } = await supabase
      .from('drive_participants')
      .select('id')
      .eq('drive_id', driveId)
      .eq('user_id', userId)
      .eq('status', 'registered')
      .single()

    if (existingParticipation) {
      console.log('User already registered for this drive')
      return true
    }

    // Add user to participants
    const { error: participationError } = await supabase
      .from('drive_participants')
      .insert({
        drive_id: driveId,
        user_id: userId,
        status: 'registered'
      })

    if (participationError) {
      logError('Error joining drive - participation', participationError, { driveId, userId })
      return false
    }

    // Update drive registered volunteer count
    const { error: updateError } = await supabase.rpc('increment_drive_volunteers', {
      drive_id: driveId
    })

    if (updateError) {
      // If RPC doesn't exist, try manual update
      const { data: drive } = await supabase
        .from('drives')
        .select('registered_volunteers')
        .eq('id', driveId)
        .single()

      if (drive) {
        await supabase
          .from('drives')
          .update({ registered_volunteers: drive.registered_volunteers + 1 })
          .eq('id', driveId)
      }
    }

    // Update user profile cleanup drives count
    const { error: profileError } = await supabase.rpc('increment_user_drives', {
      user_id: userId
    })

    if (profileError) {
      // If RPC doesn't exist, try manual update
      const { data: profile } = await supabase
        .from('profiles')
        .select('cleanup_drives_joined')
        .eq('id', userId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            cleanup_drives_joined: profile.cleanup_drives_joined + 1,
            impact_score: (profile as any).impact_score + 10 // Add points for joining
          })
          .eq('id', userId)
      }
    }

    // Add activity record
    await createActivity({
      user_id: userId,
      type: 'cleanup_joined',
      title: 'Joined Cleanup Drive',
      description: `Registered for cleanup drive`,
      points_earned: 10,
      metadata: { drive_id: driveId }
    })

    return true
  } catch (err) {
    console.error('Unexpected error in joinCleanupDrive:', err)
    return false
  }
}

export async function leaveCleanupDrive(driveId: string, userId: string): Promise<boolean> {
  try {
    // Remove user from participants
    const { error: deleteError } = await supabase
      .from('drive_participants')
      .delete()
      .eq('drive_id', driveId)
      .eq('user_id', userId)

    if (deleteError) {
      logError('Error leaving drive - participation', deleteError, { driveId, userId })
      return false
    }

    // Update drive registered volunteer count
    const { data: drive } = await supabase
      .from('drives')
      .select('registered_volunteers')
      .eq('id', driveId)
      .single()

    if (drive && drive.registered_volunteers > 0) {
      await supabase
        .from('drives')
        .update({ registered_volunteers: drive.registered_volunteers - 1 })
        .eq('id', driveId)
    }

    // Update user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('cleanup_drives_joined')
      .eq('id', userId)
      .single()

    if (profile && profile.cleanup_drives_joined > 0) {
      await supabase
        .from('profiles')
        .update({ cleanup_drives_joined: profile.cleanup_drives_joined - 1 })
        .eq('id', userId)
    }

    return true
  } catch (err) {
    console.error('Unexpected error in leaveCleanupDrive:', err)
    return false
  }
}

export async function getUserDriveParticipation(userId: string): Promise<DriveParticipant[]> {
  try {
    const { data, error } = await supabase
      .from('drive_participants')
      .select(`
        *,
        drives (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'registered')

    if (error) {
      if (error.code === '42P01') {
        console.warn('Drive participants table does not exist yet.')
        return []
      }
      logError('Error fetching user drive participation', error, { userId })
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error in getUserDriveParticipation:', err)
    return []
  }
}

export async function isUserJoinedDrive(driveId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('drive_participants')
      .select('id')
      .eq('drive_id', driveId)
      .eq('user_id', userId)
      .eq('status', 'registered')
      .single()

    if (error && error.code !== 'PGRST116') {
      logError('Error checking drive participation', error, { driveId, userId })
      return false
    }

    return !!data
  } catch (err) {
    console.error('Unexpected error in isUserJoinedDrive:', err)
    return false
  }
}
