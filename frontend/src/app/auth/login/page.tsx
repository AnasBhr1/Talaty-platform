'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { 
  Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, 
  CheckCircle, Star, Fingerprint, Shield, Zap, Globe, Award,
  ChevronRight, Users, BarChart3, Crown, Verified
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

// Floating elements for background animation
const FloatingElements = () => {
  const elements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-400/10 to-blue-400/10 backdrop-blur-sm"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        />
      ))}
    </div>
  )
}

// Premium trust indicators
const trustIndicators = [
  { icon: Shield, text: "Bank-grade Security", color: "text-green-600" },
  { icon: Verified, text: "SOC 2 Certified", color: "text-blue-600" },
  { icon: Crown, text: "Enterprise Ready", color: "text-purple-600" },
  { icon: Award, text: "ISO 27001", color: "text-orange-600" }
]

// Success metrics for social proof
const successMetrics = [
  { value: "250K+", label: "Verified Users", icon: Users },
  { value: "99.97%", label: "Accuracy Rate", icon: BarChart3 },
  { value: "45s", label: "Avg. Verification", icon: Zap },
  { value: "150+", label: "Countries", icon: Globe }
]

export default function PremiumLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { login } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const email = watch('email', '')
  const password = watch('password', '')

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast({
        title: 'Welcome back to Talaty!',
        description: 'You have been successfully authenticated.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: error instanceof Error ? error.message : 'Please verify your credentials and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Interactive cursor */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full pointer-events-none z-50 mix-blend-multiply"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <FloatingElements />
        
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg space-y-8 relative z-10"
        >
          {/* Premium Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <Link href="/" className="inline-flex items-center space-x-4 group">
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <ShieldCheck className="w-9 h-9 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl opacity-20 blur-xl animate-pulse"></div>
                </div>
                <div className="text-left">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Talaty
                  </span>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Enterprise eKYC Platform
                  </div>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <Badge className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                Secure Login Portal
              </Badge>
              
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Welcome back to
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Talaty Platform
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto">
                Access your enterprise verification dashboard with advanced security features
              </p>
            </motion.div>
          </div>

          {/* Premium Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="shadow-2xl backdrop-blur-xl border-0 bg-gradient-to-br from-white/90 via-white/80 to-white/70 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5" />
              
              <CardHeader className="space-y-1 pb-8 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Sign In
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Fingerprint className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-500">Secure Access</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Enter your credentials to access your enterprise dashboard
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8 relative">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field with Enhanced Design */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white focus:shadow-lg focus:shadow-purple-200/50 group-hover:border-gray-300"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      {email && !errors.email && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Password Field with Enhanced Design */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-600" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your secure password"
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white focus:shadow-lg focus:shadow-purple-200/50 group-hover:border-gray-300 pr-12"
                        error={errors.password?.message}
                        {...register('password')}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <motion.label 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 transition-all duration-300"
                      />
                      <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                        Keep me signed in
                      </span>
                    </motion.label>
                    
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-500 transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Premium Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      variant="premium"
                      size="xl"
                      className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform transition-all duration-300 group relative overflow-hidden"
                      loading={isSubmitting || isLoading}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSubmitting || isLoading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            Sign In to Dashboard
                            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-14 border-2 border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm transition-all duration-300 group"
                      >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span className="font-medium">Google</span>
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-14 border-2 border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm transition-all duration-300 group"
                      >
                        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.291 3.442 9.78 8.206 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112.017 6c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386C24.004 5.367 18.638.001 12.017.001z"/>
                        </svg>
                        <span className="font-medium">GitHub</span>
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600 text-lg">
              New to Talaty?{' '}
              <Link
                href="/auth/register"
                className="font-bold text-purple-600 hover:text-purple-500 transition-colors hover:underline"
              >
                Start your free enterprise trial
              </Link>
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300"
              >
                <indicator.icon className={`w-5 h-5 ${indicator.color}`} />
                <span className="text-sm font-medium text-gray-700">{indicator.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Premium Hero Content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -100]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '100%',
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-black/10" />
          
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="max-w-2xl text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {/* Animated Logo */}
                <div className="relative mb-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 mx-auto mb-8 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-white/40"></div>
                    <div className="absolute inset-8 rounded-full bg-white/90 flex items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-purple-600" />
                    </div>
                  </motion.div>
                </div>

                <Badge className="mb-8 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-white/30">
                  <Crown className="w-5 h-5 mr-2" />
                  Enterprise Security Platform
                </Badge>

                <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                  Secure Access to Your
                  <span className="block text-yellow-300">Enterprise Dashboard</span>
                </h2>
                
                <p className="text-2xl opacity-90 leading-relaxed mb-12">
                  Join 250,000+ professionals using Talaty's advanced AI-powered verification platform 
                  with enterprise-grade security and compliance.
                </p>
              </motion.div>
              
              {/* Success Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-2 gap-8 mb-12"
              >
                {successMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                      <metric.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                    <div className="text-white/80 text-sm font-medium">{metric.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="space-y-6"
              >
                {[
                  { icon: Fingerprint, text: "Multi-factor biometric authentication" },
                  { icon: Shield, text: "Advanced threat detection & prevention" },
                  { icon: Globe, text: "Global compliance & regulatory support" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.2 }}
                    className="flex items-center text-white/90 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mr-6 group-hover:bg-white/30 transition-colors">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium group-hover:text-white transition-colors">{feature.text}</span>
                    <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mt-12 pt-8 border-t border-white/20"
              >
                <p className="text-white/70 mb-6">New to Talaty Enterprise?</p>
                <Link href="/auth/register">
                  <Button 
                    variant="glass" 
                    size="lg" 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 group"
                  >
                    Start Free Enterprise Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
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
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-10 left-10 w-40 h-40 border border-white/20 rounded-full"
          />
          
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 35, repeat: Infinity, ease: "linear" },
              scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full"
          />
          
          {/* Floating icons */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/30 rounded-full"
              animate={{
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7
              }}
              style={{
                top: `${15 + i * 10}%`,
                left: `${10 + i * 10}%`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}