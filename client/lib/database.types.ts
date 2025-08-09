export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          location: string | null
          member_since: string
          impact_score: number
          eco_hero_level: string
          reports_submitted: number
          cleanup_drives_joined: number
          volunteer_hours: number
          rank_position: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          member_since?: string
          impact_score?: number
          eco_hero_level?: string
          reports_submitted?: number
          cleanup_drives_joined?: number
          volunteer_hours?: number
          rank_position?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          member_since?: string
          impact_score?: number
          eco_hero_level?: string
          reports_submitted?: number
          cleanup_drives_joined?: number
          volunteer_hours?: number
          rank_position?: number | null
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          location_name: string
          latitude: number
          longitude: number
          severity: 'low' | 'moderate' | 'severe'
          status: 'pending' | 'approved' | 'rejected'
          type: 'pollution' | 'cleanup'
          photos: string[]
          created_at: string
          updated_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          location_name: string
          latitude: number
          longitude: number
          severity: 'low' | 'moderate' | 'severe'
          status?: 'pending' | 'approved' | 'rejected'
          type?: 'pollution' | 'cleanup'
          photos?: string[]
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          user_id?: string
          title?: string
          description?: string
          location_name?: string
          latitude?: number
          longitude?: number
          severity?: 'low' | 'moderate' | 'severe'
          status?: 'pending' | 'approved' | 'rejected'
          type?: 'pollution' | 'cleanup'
          photos?: string[]
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          type: 'report_submitted' | 'cleanup_joined' | 'volunteer_hours' | 'achievement'
          title: string
          description: string
          points_earned: number
          related_report_id: string | null
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'report_submitted' | 'cleanup_joined' | 'volunteer_hours' | 'achievement'
          title: string
          description: string
          points_earned?: number
          related_report_id?: string | null
          metadata?: any | null
          created_at?: string
        }
        Update: {
          user_id?: string
          type?: 'report_submitted' | 'cleanup_joined' | 'volunteer_hours' | 'achievement'
          title?: string
          description?: string
          points_earned?: number
          related_report_id?: string | null
          metadata?: any | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
