import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getProfile, createProfile, checkDatabaseHealth, Profile } from '@/lib/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error?: any }>
  resetPassword: (email: string) => Promise<{ error?: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await getProfile(userId)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setProfile(null)
    }
  }

  // Function to refresh profile (useful after profile updates)
  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (mounted) {
          if (error) {
            console.error('Error getting session:', error)
          }

          setSession(session)
          setUser(session?.user ?? null)

          // Load profile if user exists
          if (session?.user) {
            await loadUserProfile(session.user.id)
          } else {
            setProfile(null)
          }

          setLoading(false)

        }
      } catch (error) {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return


      // Handle different auth events
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setProfile(null)
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          loadUserProfile(session.user.id).catch(() => {})
        }
      } else if (event === 'SIGNED_IN') {
        setSession(session)
        setUser(session?.user ?? null)

        // Create profile for new users and load profile
        if (session?.user) {
          createUserProfile(session.user).catch(() => {})
          loadUserProfile(session.user.id).catch(() => {})
        }
      } else {
        // For other events, update state
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          loadUserProfile(session.user.id).catch(() => {})
        } else {
          setProfile(null)
        }
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Background profile creation function
  const createUserProfile = async (user: User) => {
    try {
      const existingProfile = await getProfile(user.id)
      if (!existingProfile) {
        const newProfile = await createProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          location: 'Mumbai'
        })
        if (newProfile) {
          // Profile created successfully
        }
      } else {
        // Existing profile found
      }
    } catch (error) {
      // Error in profile management
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      // Immediately clear local state for instant UI feedback
      setUser(null)
      setSession(null)
      setProfile(null)

      // Then actually sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        // Sign out error - but local state is cleared
      }
    } catch (error) {
      // Unexpected sign out error - but local state is cleared
      // Still clear local state even on error
      setUser(null)
      setSession(null)
      setProfile(null)
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
