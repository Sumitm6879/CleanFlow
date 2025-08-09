import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, session } = useAuth()
  const location = useLocation()
  const [timeoutReached, setTimeoutReached] = useState(false)

  // Set a longer timeout and only if truly needed
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true)
    }, 15000) // 15 seconds timeout - much longer

    return () => clearTimeout(timer)
  }, [])

  // If we have a session but no user yet, keep loading
  if (loading || (session && !user && !timeoutReached)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12B5ED] mx-auto mb-4"></div>
          <p className="text-[#61808A]">Loading...</p>
        </div>
      </div>
    )
  }

  // Only redirect if truly no user and no session
  if (!user && !session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
