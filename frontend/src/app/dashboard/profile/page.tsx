// frontend/src/app/dashboard/profile/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, Mail, Phone, Building, MapPin, Calendar, 
  Edit3, Save, X, CheckCircle, AlertCircle, Shield
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

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

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    <DashboardLayout title="Profile">
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
    </DashboardLayout>
  )
}