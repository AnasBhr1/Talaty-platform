'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Building, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/useToast'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, isLoading } = useAuth()
  const { toast } = useToast()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...registrationData } = data
      await register(registrationData)
      toast({
        title: 'Success',
        description: 'Account created successfully! Welcome to Talaty.',
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Please check your information and try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Talaty
              </span>
            </Link>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create your account
            </h1>
            <p className="text-slate-600">
              Join thousands of businesses using Talaty
            </p>
          </div>

          {/* Registration Form */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        {...registerField('firstName')}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        {...registerField('lastName')}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      {...registerField('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Business Information */}
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-slate-700">
                    Business Name (Optional)
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="businessName"
                      placeholder="Your Business LLC"
                      className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      {...registerField('businessName')}
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      {...registerField('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      {...registerField('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {isSubmitting || isLoading ? (
                    <LoadingSpinner className="w-5 h-5" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="max-w-md text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ShieldCheck className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl font-bold mb-4">
                  Join the Future of Business Verification
                </h2>
                <p className="text-lg opacity-90 leading-relaxed mb-8">
                  Start your eKYC journey today and get verified in minutes. Trusted by thousands of businesses worldwide.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Complete verification in under 5 minutes</span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Bank-grade security and encryption</span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Real-time scoring and feedback</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full"></div>
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-white/30 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  )
}