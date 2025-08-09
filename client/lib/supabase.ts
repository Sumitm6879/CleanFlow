import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vmjicjqqgxpnoxzqwolz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtamljanFxZ3hwbm94enF3b2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODIxMDYsImV4cCI6MjA3MDI1ODEwNn0.T5cfq69cbTdf9Wfzn2FYvyoRtvdT3qMo7w2kIb1gLeM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}
