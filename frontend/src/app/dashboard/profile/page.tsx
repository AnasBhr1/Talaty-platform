'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, Mail, Phone, Building, MapPin, Calendar, 
  Edit3, Save, X, CheckCircle, AlertCircle, Shield,
  Bell, Search, Menu, LogOut, ChevronRight, Sparkles,
  Settings, FileText, BarChart, Cog, HelpCircle, Home
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { AnimatePresence } from 'framer-motion'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

const businessTypes = [
  'SOLE_PROPRIETORSHIP',
  'PARTNERSHIP',
  'CORPORATION',
  'LLC',
  'NONPROFIT',
  'COOPERATIVE',
  'OTHER'
]

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
  { name: 'Profile', href: '/dashboard/profile', icon: User, current: true },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText, current: false },
  { name: 'Scoring', href: '/dashboard/scoring', icon: BarChart, current: false },
  { name: 'Settings', href: '/settings', icon: Cog, current: false },
  { name: 'Support', href: '/support', icon: HelpCircle, current: false },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth()
  
  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
          </div>
          <div>
            <span className="text-xl font-bold gradient-text">Talaty</span>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              eKYC Platform
            </div>
          </div>
        </Link>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {user?.eKycStatus === 'VERIFIED' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
              item.current
                ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <item.icon
              className={`mr-3 w-5 h-5 ${
                item.current ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
              }`}
            />
            {item.name}
            {item.current && (
              <ChevronRight className="ml-auto w-4 h-4 text-purple-600" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      businessName: user?.businessName || '',
      businessType: '',
      address: '',
      city: '',
      country: ''
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true)
    try {
      // Here you would call your API to update the profile
      // await updateProfile(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Verified</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="warning">In Progress</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="destructive">Not Started</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-80 lg:flex">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="text-sm text-gray-500">
                    Welcome back, {user?.firstName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-64"
                      variant="premium"
                    />
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white border-0">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-2">
                          {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-lg opacity-90 mb-3">
                          {user?.businessName || 'Business Owner'}
                        </p>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(user?.eKycStatus || 'PENDING')}
                          <div className="flex items-center text-sm opacity-80">
                            <Calendar className="w-4 h-4 mr-1" />
                            Member since {new Date().getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-right">
                        <div className="text-4xl font-bold mb-2">
                          {user?.score || '750'}
                        </div>
                        <div className="text-sm opacity-80">Verification Score</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* eKYC Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Verified</h3>
                  <p className="text-sm text-gray-600">Your email has been verified</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone Pending</h3>
                  <p className="text-sm text-gray-600">Phone verification required</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">KYC Status</h3>
                  <p className="text-sm text-gray-600">{user?.eKycStatus || 'In Progress'}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Profile Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          loading={isLoading}
                          variant="premium"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          {isEditing ? (
                            <Input
                              id="firstName"
                              {...register('firstName')}
                              error={errors.firstName?.message}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {user?.firstName || 'Not provided'}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          {isEditing ? (
                            <Input
                              id="lastName"
                              {...register('lastName')}
                              error={errors.lastName?.message}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {user?.lastName || 'Not provided'}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              {...register('email')}
                              error={errors.email?.message}
                              icon={<Mail className="w-4 h-4" />}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-500" />
                              {user?.email || 'Not provided'}
                              {user?.email && (
                                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              {...register('phone')}
                              error={errors.phone?.message}
                              icon={<Phone className="w-4 h-4" />}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-500" />
                              +1 (555) 123-4567
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        Business Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          {isEditing ? (
                            <Input
                              id="businessName"
                              {...register('businessName')}
                              error={errors.businessName?.message}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {user?.businessName || 'Not provided'}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type</Label>
                          {isEditing ? (
                            <select
                              id="businessType"
                              {...register('businessType')}
                              className="w-full h-12 px-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                            >
                              <option value="">Select business type</option>
                              {businessTypes.map(type => (
                                <option key={type} value={type}>
                                  {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              LLC
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Address Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Street Address</Label>
                          {isEditing ? (
                            <Input
                              id="address"
                              {...register('address')}
                              error={errors.address?.message}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              123 Business Street
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          {isEditing ? (
                            <Input
                              id="city"
                              {...register('city')}
                              error={errors.city?.message}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              New York
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          {isEditing ? (
                            <Input
                              id="country"
                              {...register('country')}
                              error={errors.country?.message}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              United States
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}