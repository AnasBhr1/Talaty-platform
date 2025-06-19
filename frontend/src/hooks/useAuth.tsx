'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  businessName?: string
  eKycStatus: string
  isVerified: boolean
  score?: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
  refreshToken: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  businessName?: string
  businessType?: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${window.location.protocol === 'https:'}`
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Use environment variable or fallback to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    checkAuth()
  }, [])

  const getStoredToken = (): string | null => {
    // Try to get token from cookies first, then localStorage as fallback
    return getCookie('accessToken') || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null)
  }

  const storeTokens = (accessToken: string, refreshToken: string) => {
    // Store in both cookies and localStorage for compatibility
    setCookie('accessToken', accessToken, 7)
    setCookie('refreshToken', refreshToken, 30)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  const clearTokens = () => {
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  // Helper function to validate response is JSON
  const validateJsonResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Expected JSON but received:', text.substring(0, 200))
      throw new Error('Server returned non-JSON response. Please check if the API server is running.')
    }
    return response.json()
  }

  const checkAuth = async () => {
    try {
      const token = getStoredToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await validateJsonResponse(response)
        if (data.success && data.data) {
          setUser(data.data)
        }
      } else if (response.status === 401) {
        // Token is invalid, try to refresh
        await attemptTokenRefresh()
      } else {
        clearTokens()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      clearTokens()
    } finally {
      setIsLoading(false)
    }
  }

  const attemptTokenRefresh = async () => {
    try {
      const refreshToken = getCookie('refreshToken') || (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null)
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const response = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await validateJsonResponse(response)

      if (data.success && data.data) {
        storeTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken)
        // Try to get user info again
        await checkAuth()
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearTokens()
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('Attempting login to:', `${apiUrl}/api/auth/login`)
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      console.log('Login response status:', response.status)
      
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Please check if the API server is running.')
        }
        // Try to parse error response
        try {
          const errorData = await validateJsonResponse(response)
          throw new Error(errorData.message || 'Login failed')
        } catch (parseError) {
          throw new Error(`Login failed with status ${response.status}`)
        }
      }

      const data = await validateJsonResponse(response)
      console.log('Login response data:', data)

      if (data.success && data.data) {
        storeTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken)
        setUser(data.data.user)
        
        // Get the callback URL from query params or default to dashboard
        const urlParams = new URLSearchParams(window.location.search)
        const callbackUrl = urlParams.get('callbackUrl') || '/dashboard'
        
        router.push(callbackUrl)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      console.log('Attempting registration to:', `${apiUrl}/api/auth/register`)
      console.log('Registration data:', data)
      
      // First, let's check if the server is accessible
      try {
        const healthCheck = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!healthCheck.ok) {
          throw new Error('API server is not responding. Please ensure the backend server is running on port 3001.')
        }
      } catch (healthError) {
        console.error('Health check failed:', healthError)
        throw new Error('Cannot connect to API server. Please ensure the backend server is running on http://localhost:3001')
      }
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      console.log('Registration response status:', response.status)
      console.log('Registration response headers:', response.headers.get('content-type'))
      
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Please check if the API server is running properly.')
        }
        // Try to parse error response
        try {
          const errorData = await validateJsonResponse(response)
          throw new Error(errorData.message || 'Registration failed')
        } catch (parseError) {
          const responseText = await response.text()
          console.error('Non-JSON response received:', responseText.substring(0, 200))
          throw new Error(`Registration failed. Server returned: ${response.status} ${response.statusText}`)
        }
      }

      const result = await validateJsonResponse(response)
      console.log('Registration response data:', result)

      if (result.success && result.data) {
        storeTokens(result.data.tokens.accessToken, result.data.tokens.refreshToken)
        setUser(result.data.user)
        router.push('/dashboard')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTokens = async () => {
    await attemptTokenRefresh()
  }

  const logout = () => {
    clearTokens()
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      register,
      refreshToken: refreshTokens
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}