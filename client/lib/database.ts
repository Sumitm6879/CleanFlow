import { supabase } from './supabase'
import { Database, Profile, Report, Activity, Drive, DriveParticipant } from './database.types'

// Storage health check
export async function checkStorageHealth(): Promise<{ buckets: string[], working: boolean, details: any }> {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      return { buckets: [], working: false, details: { error: error.message } };
    }

    const bucketNames = buckets?.map(b => b.name) || [];

    // Check authentication status
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    const details = {
      bucketsFound: bucketNames,
      userAuthenticated: !!user,
      userId: user?.id,
      userRole: user?.role,
      userError: userError?.message
    };

    return {
      buckets: bucketNames,
      working: true,
      details
    };
  } catch (err) {
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
    // Create a small test file
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });

    // Try to upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`test-${Date.now()}.txt`, testFile, { upsert: true });

    if (error) {
      return false;
    }

    // Clean up test file
    if (data?.path) {
      await supabase.storage.from(bucket).remove([data.path]);
    }

    return true;
  } catch (err) {
    return false;
  }
}

// Database health check with enhanced connectivity handling
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Test basic connection with a simple count query
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })

    if (error) {
      // Specific error codes we can handle
      if (error.code === '42P01') {
        return false;
      }

      // Network connectivity issues
      if (error.message?.includes('Failed to fetch') ||
          error.message?.includes('fetch')) {
        return false;
      }

      return false;
    }

    return true;
  } catch (err: any) {
    // Network connectivity issue - using offline mode
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
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return null
      }
      return null
    }

    return data
  } catch (err) {
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
      return null
    }

    return data
  } catch (err) {
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
      .in('status', ['pending', 'approved', 'resolved'])
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      if (error.code === '42P01') {
        return []
      }
      return []
    }

    return data || []
  } catch (err) {
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
      return []
    }

    return data || []
  } catch (err) {
    return []
  }
}

export async function markReportAsResolved(reportId: string, userId: string): Promise<boolean> {
  try {
    // First verify that the user owns this report
    const { data: existingReport, error: fetchError } = await supabase
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (fetchError) {
      return false;
    }

    if (existingReport?.user_id !== userId) {
      return false;
    }

    // Update the report status to resolved
    const { error: updateError } = await supabase
      .from('reports')
      .update({
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);

    if (updateError) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export async function createReport(report: ReportInsert): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single()

    if (error) {
      return null
    }

    // Calculate points based on severity
    const points = report.severity === 'severe' ? 20 : report.severity === 'moderate' ? 15 : 10

    // Create activity for report submission
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

    return data
  } catch (err) {
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
        return []
      }
      return []
    }

    return data || []
  } catch (err) {
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
      return null
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (err) {
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
        return []
      }
      return []
    }

    return data || []
  } catch (err) {
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
    // Silent error handling for scheduled functions
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
        return []
      }
      return []
    }

    return data || []
  } catch (err) {
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
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return null
      }
      return null
    }

    return data
  } catch (err) {
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
      return null
    }

    return data
  } catch (err) {
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
        return []
      }
      return []
    }

    return data || []
  } catch (err) {
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
      return false
    }

    return !!data
  } catch (err) {
    return false
  }
}
