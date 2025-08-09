import { supabase } from './supabase'
import { Database, Profile, Report, Activity } from './database.types'

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
export async function uploadPhoto(file: File, bucket: 'reports' | 'avatars', fileName?: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const finalFileName = fileName || `${Math.random()}.${fileExt}`
  const filePath = `${finalFileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    logError('Error uploading file', error, { bucket, fileName })
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deletePhoto(bucket: 'reports' | 'avatars', filePath: string): Promise<boolean> {
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
