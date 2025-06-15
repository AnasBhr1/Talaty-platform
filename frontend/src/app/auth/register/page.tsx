'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { 
  Eye, EyeOff, ShieldCheck, Mail, Lock, User, Building, 
  ArrowRight, Sparkles, CheckCircle, Star, Award, Users 
} from 'lucide-react'
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
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

const businessTypes = [
  'SOLE_PROPRIETORSHIP',
  'PARTNERSHIP', 
  'CORPORATION',
  'LLC',
  'NONPROFIT',
  'COOPERATIVE',
  'OTHER'
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { register: registerUser, isLoading } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const email = watch('email', '')

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/(?=.*[a-z])/.test(password)) strength++
    if (/(?=.*[A-Z])/.test(password)) strength++
    if (/(?=.*\d)/.test(password)) strength++
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['red', 'orange', 'yellow', 'blue', 'green']

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, agreeToTerms, ...registrationData } = data
      await registerUser(registrationData)
      toast({
        title: 'Account Created Successfully!',
        description: 'Welcome to Talaty. Your verification journey begins now.',
        variant: 'success',
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold gradient-text">Talaty</span>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    eKYC Platform
                  </div>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Start your journey
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Create your account and join thousands of businesses using Talaty
              </p>
            </motion.div>
          </div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card variant="premium" className="shadow-2xl backdrop-blur-xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center gradient-text">
                  Create Account
                </CardTitle>
                <p className="text-sm text-gray-500 text-center">
                  Fill in your details to get started
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500"
                          {...register('firstName')}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500"
                          {...register('lastName')}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        className={`w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500 ${
                          email && !errors.email ? 'border-green-300 focus:border-green-400' : ''
                        } ${errors.email ? 'border-red-300 focus:border-red-400' : ''}`}
                        {...register('email')}
                      />
                      {email && !errors.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-sm font-semibold text-gray-700">
                        Business Name <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          id="businessName"
                          type="text"
                          placeholder="Your Business LLC"
                          className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500"
                          {...register('businessName')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-sm font-semibold text-gray-700">
                        Business Type <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <select
                        id="businessType"
                        className="w-full h-12 px-4 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900"
                        {...register('businessType')}
                      >
                        <option value="" className="text-gray-500">Select business type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type} className="text-gray-900">
                            {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          className="w-full h-12 pl-10 pr-12 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500"
                          {...register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="space-y-2">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  i < passwordStrength
                                    ? `bg-${strengthColors[Math.min(passwordStrength - 1, 4)]}-500`
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs text-${strengthColors[Math.min(passwordStrength - 1, 4)]}-600`}>
                            Password strength: {strengthLabels[Math.min(passwordStrength - 1, 4)] || 'Too weak'}
                          </p>
                        </div>
                      )}
                      
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          className="w-full h-12 pl-10 pr-12 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500"
                          {...register('confirmPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-gray-300 transition-all duration-200 bg-gradient-to-br from-white to-gray-50 checked:border-purple-500 checked:bg-gradient-to-br checked:from-purple-500 checked:to-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none mt-0.5"
                        {...register('agreeToTerms')}
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{' '}
                        <Link href="/terms" className="text-purple-600 hover:text-purple-500 font-semibold">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-purple-600 hover:text-purple-500 font-semibold">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    variant="premium"
                    size="lg"
                    className="w-full group"
                    loading={isSubmitting || isLoading}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
                      {!isSubmitting && !isLoading && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-purple-600 hover:text-purple-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Hero Content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="max-w-lg text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-white/50"></div>
                    <div className="absolute inset-4 rounded-full bg-white/90 flex items-center justify-center">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                  </motion.div>
                </div>

                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  Join the Future of Business Verification
                </h2>
                <p className="text-xl opacity-90 leading-relaxed mb-8">
                  Start your eKYC journey today and get verified in minutes. 
                  Trusted by thousands of businesses worldwide for secure and reliable verification.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-6"
              >
                {/* Feature highlights */}
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Complete verification in under 5 minutes" },
                    { icon: ShieldCheck, text: "Bank-grade security and encryption" },
                    { icon: Users, text: "Join 50,000+ verified businesses" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      className="flex items-center text-white/90 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="pt-6 border-t border-white/20"
                >
                  <p className="text-sm text-white/70 mb-4">Trusted by industry leaders</p>
                  <div className="flex justify-center items-center space-x-6 opacity-60">
                    {/* Company logos placeholder */}
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                        <Building className="w-6 h-4" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 35, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"
          ></motion.div>
          
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-10 right-10 w-40 h-40 border border-white/20 rounded-full"
          ></motion.div>
          
          {/* Floating elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/30 rounded-full"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4
              }}
              style={{
                top: `${15 + i * 8}%`,
                left: `${5 + i * 12}%`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}