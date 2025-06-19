'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-6">
          <LoadingSpinner size="xl" variant="gradient" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold gradient-text">Talaty Dashboard</h3>
            <p className="text-gray-600">Loading your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated, show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-6">
          <LoadingSpinner size="xl" variant="gradient" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold gradient-text">Redirecting to Login</h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show dashboard for authenticated users
  return <>{children}</>
}