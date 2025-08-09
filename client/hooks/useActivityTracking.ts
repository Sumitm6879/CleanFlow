import { useAuth } from '@/contexts/AuthContext'
import { createActivity } from '@/lib/database'
import { Database } from '@/lib/database.types'

type ActivityInsert = Database['public']['Tables']['activities']['Insert']

export function useActivityTracking() {
  const { user } = useAuth()

  const trackActivity = async (activity: Omit<ActivityInsert, 'user_id'>) => {
    if (!user) return null

    try {
      const activityData: ActivityInsert = {
        ...activity,
        user_id: user.id
      }

      return await createActivity(activityData)
    } catch (error) {
      console.error('Error tracking activity:', error)
      return null
    }
  }

  const trackReportSubmission = async (reportId: string, reportTitle: string, location: string, severity: string) => {
    return trackActivity({
      type: 'report_submitted',
      title: 'Pollution Report Submitted',
      description: `Submitted a ${severity} pollution report: ${reportTitle}`,
      points_earned: severity === 'severe' ? 20 : severity === 'moderate' ? 15 : 10,
      related_report_id: reportId,
      metadata: {
        report_title: reportTitle,
        location,
        severity
      }
    })
  }

  const trackCleanupJoined = async (cleanupTitle: string, location: string, hours: number) => {
    return trackActivity({
      type: 'cleanup_joined',
      title: 'Cleanup Drive Joined',
      description: `Participated in cleanup drive: ${cleanupTitle}`,
      points_earned: hours * 5, // 5 points per hour
      metadata: {
        cleanup_title: cleanupTitle,
        location,
        hours
      }
    })
  }

  const trackVolunteerHours = async (hours: number, activity: string, location: string) => {
    return trackActivity({
      type: 'volunteer_hours',
      title: 'Volunteer Hours Logged',
      description: `Volunteered ${hours} hours for ${activity}`,
      points_earned: hours * 3, // 3 points per hour
      metadata: {
        hours,
        activity,
        location
      }
    })
  }

  const trackAchievement = async (achievementTitle: string, description: string, points: number) => {
    return trackActivity({
      type: 'achievement',
      title: achievementTitle,
      description,
      points_earned: points,
      metadata: {
        achievement_type: achievementTitle
      }
    })
  }

  return {
    trackActivity,
    trackReportSubmission,
    trackCleanupJoined,
    trackVolunteerHours,
    trackAchievement
  }
}
