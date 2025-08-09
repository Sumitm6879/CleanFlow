import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getProfile, createProfile, checkDatabaseHealth } from '@/lib/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error?: any }>
  resetPassword: (email: string) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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
          setLoading(false)

          console.log('Initial session loaded:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userEmail: session?.user?.email,
            expiresAt: session?.expires_at
          })
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
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

      console.log('Auth state change:', event, !!session, session?.user?.email)

      // Handle different auth events
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        console.log('User signed out')
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
        console.log('Session token refreshed')
      } else if (event === 'SIGNED_IN') {
        setSession(session)
        setUser(session?.user ?? null)
        console.log('User signed in:', session?.user?.email)

        // Create profile for new users (but don't block the auth flow)
        if (session?.user) {
          createUserProfile(session.user).catch(error => {
            console.error('Background profile creation failed:', error)
          })
        }
      } else {
        // For other events, update state
        setSession(session)
        setUser(session?.user ?? null)
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
        console.log('Creating new profile for user:', user.id)
        const newProfile = await createProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          location: 'Mumbai'
        })
        if (newProfile) {
          console.log('Profile created successfully:', newProfile.id)
        } else {
          console.warn('Profile creation failed for user:', user.id)
        }
      } else {
        console.log('Existing profile found for user:', user.id)
      }
    } catch (error) {
      console.error('Error in profile management:', error)
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

      // Then actually sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
        // Even if there's an error, we've cleared local state
      } else {
        console.log('Successfully signed out')
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      // Still clear local state even on error
      setUser(null)
      setSession(null)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
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
