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
          status: 'pending' | 'approved' | 'rejected' | 'resolved'
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
          status?: 'pending' | 'approved' | 'rejected' | 'resolved'
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
          status?: 'pending' | 'approved' | 'rejected' | 'resolved'
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
      drives: {
        Row: {
          id: string
          title: string
          description: string
          full_description: string
          organizer_id: string
          organizer_name: string
          organizer_type: 'NGO' | 'Community' | 'Individual'
          organizer_avatar: string | null
          organizer_bio: string | null
          contact_email: string
          contact_phone: string | null
          location: string
          area: string
          latitude: number | null
          longitude: number | null
          date: string
          time: string
          duration: string
          max_volunteers: number
          registered_volunteers: number
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tags: string[]
          images: string[]
          verified: boolean
          requirements: string[]
          safety_measures: string[]
          expected_impact: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          full_description: string
          organizer_id: string
          organizer_name: string
          organizer_type: 'NGO' | 'Community' | 'Individual'
          organizer_avatar?: string | null
          organizer_bio?: string | null
          contact_email: string
          contact_phone?: string | null
          location: string
          area: string
          latitude?: number | null
          longitude?: number | null
          date: string
          time: string
          duration: string
          max_volunteers: number
          registered_volunteers?: number
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tags?: string[]
          images?: string[]
          verified?: boolean
          requirements?: string[]
          safety_measures?: string[]
          expected_impact?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          full_description?: string
          organizer_name?: string
          organizer_type?: 'NGO' | 'Community' | 'Individual'
          organizer_avatar?: string | null
          organizer_bio?: string | null
          contact_email?: string
          contact_phone?: string | null
          location?: string
          area?: string
          latitude?: number | null
          longitude?: number | null
          date?: string
          time?: string
          duration?: string
          max_volunteers?: number
          registered_volunteers?: number
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          tags?: string[]
          images?: string[]
          verified?: boolean
          requirements?: string[]
          safety_measures?: string[]
          expected_impact?: any
          updated_at?: string
        }
      }
      drive_participants: {
        Row: {
          id: string
          drive_id: string
          user_id: string
          joined_at: string
          status: 'registered' | 'attended' | 'cancelled'
          notes: string | null
        }
        Insert: {
          id?: string
          drive_id: string
          user_id: string
          joined_at?: string
          status?: 'registered' | 'attended' | 'cancelled'
          notes?: string | null
        }
        Update: {
          status?: 'registered' | 'attended' | 'cancelled'
          notes?: string | null
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
export type Drive = Database['public']['Tables']['drives']['Row']
export type DriveParticipant = Database['public']['Tables']['drive_participants']['Row']
