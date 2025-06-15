'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/useToast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const email = watch('email', '')

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Please check your credentials and try again.',
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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
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
                Welcome back
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Sign in to your account to access your business verification dashboard
              </p>
            </motion.div>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card variant="premium" className="shadow-2xl backdrop-blur-xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center gradient-text">
                  Sign In
                </CardTitle>
                <p className="text-sm text-gray-500 text-center">
                  Enter your credentials to continue
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        className={`w-full h-12 pl-10 pr-10 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500 ${
                          email && !errors.email ? 'border-green-300 focus:border-green-400' : ''
                        } ${errors.email ? 'border-red-300 focus:border-red-400' : ''}`}
                        {...register('email')}
                      />
                      {email && !errors.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
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

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`w-full h-12 pl-10 pr-12 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300 focus:outline-none text-gray-900 placeholder-gray-500 ${
                          errors.password ? 'border-red-300 focus:border-red-400' : ''
                        }`}
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
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-gray-300 transition-all duration-200 bg-gradient-to-br from-white to-gray-50 checked:border-purple-500 checked:bg-gradient-to-br checked:from-purple-500 checked:to-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                      />
                      <label htmlFor="remember" className="text-sm text-gray-700 font-medium">
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Forgot password?
                    </Link>
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
                      {isSubmitting || isLoading ? 'Signing In...' : 'Sign In'}
                      {!isSubmitting && !isLoading && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </span>
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="glass"
                      className="h-12 bg-white/50 hover:bg-white/70 border border-gray-200 text-gray-700"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="glass"
                      className="h-12 bg-white/50 hover:bg-white/70 border border-gray-200 text-gray-700"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.291 3.442 9.78 8.206 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112.017 6c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386C24.004 5.367 18.638.001 12.017.001z"/>
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-purple-600 hover:text-purple-500 transition-colors"
              >
                Create account for free
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
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
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-white/50"></div>
                    <div className="absolute inset-4 rounded-full bg-white/90 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-purple-600" />
                    </div>
                  </motion.div>
                </div>

                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  Secure Business Verification Platform
                </h2>
                <p className="text-xl opacity-90 leading-relaxed mb-8">
                  Join thousands of businesses using Talaty for fast, secure, and reliable 
                  identity verification and document processing with AI-powered technology.
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
                    { icon: CheckCircle, text: "Enterprise-grade security & encryption" },
                    { icon: Sparkles, text: "AI-powered document verification" },
                    { icon: Star, text: "99.9% uptime with 24/7 support" }
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

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="pt-6 border-t border-white/20"
                >
                  <p className="text-sm text-white/70 mb-4">Trusted by leading companies</p>
                  <div className="flex justify-center items-center space-x-6 opacity-60">
                    {/* Company logos placeholder */}
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-12 h-8 bg-white/20 rounded"></div>
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
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
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
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-10 right-10 w-40 h-40 border border-white/20 rounded-full"
          ></motion.div>
          
          {/* Floating elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/30 rounded-full"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}