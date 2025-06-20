'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, FileText, TrendingUp, Users, ArrowRight, CheckCircle,
  Star, Globe, Zap, Lock, Sparkles, Award, Building, Eye, Clock,
  BarChart3, Cpu, Shield, Rocket, Upload, AlertCircle, ChevronRight,
  Download, Refresh, Bell, Settings, LogOut, Menu, X, Search,
  Calendar, Activity, DollarSign, Target, Percent, Plus, Filter,
  MoreHorizontal, ChevronDown, Mail, Phone, MapPin, ExternalLink,
  CreditCard, Briefcase, UserCheck, FileCheck, AlertTriangle,
  TrendingDown, PieChart, LineChart, Package, Layers, Play,
  Home, Users2, BarChart, FileStack, Cog, HelpCircle, User
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Mock data - replace with real API calls
const mockStats = {
  totalVerifications: 1247,
  pendingVerifications: 23,
  completedToday: 45,
  successRate: 94.2,
  monthlyGrowth: 12.5,
  activeBusinesses: 89,
  completionPercentage: 75,
  totalDocuments: 8,
  verifiedDocuments: 6,
  pendingDocuments: 2,
  currentScore: 850,
  maxScore: 1000,
}

const mockRecentVerifications = [
  {
    id: '1',
    businessName: 'TechStart Inc.',
    submittedAt: '2024-06-14T10:30:00Z',
    status: 'COMPLETED',
    score: 92,
    documents: ['business_license', 'tax_id', 'bank_statement']
  },
  {
    id: '2',
    businessName: 'GlobalTrade LLC',
    submittedAt: '2024-06-14T09:15:00Z',
    status: 'PENDING',
    score: null,
    documents: ['articles_of_incorporation', 'ownership_docs']
  },
  {
    id: '3',
    businessName: 'FinanceHub Corp',
    submittedAt: '2024-06-14T08:45:00Z',
    status: 'COMPLETED',
    score: 88,
    documents: ['business_license', 'financial_statements']
  },
  {
    id: '4',
    businessName: 'InnovateLab',
    submittedAt: '2024-06-13T16:20:00Z',
    status: 'UNDER_REVIEW',
    score: null,
    documents: ['partnership_agreement', 'tax_docs']
  }
]

const mockActivities = [
  {
    id: '1',
    type: 'verification_completed',
    message: 'TechStart Inc. verification completed with score 92',
    timestamp: '2024-06-14T10:30:00Z',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: '2',
    type: 'document_uploaded',
    message: 'New documents uploaded by GlobalTrade LLC',
    timestamp: '2024-06-14T09:15:00Z',
    icon: Upload,
    color: 'text-blue-600'
  },
  {
    id: '3',
    type: 'verification_started',
    message: 'FinanceHub Corp started new verification process',
    timestamp: '2024-06-14T08:45:00Z',
    icon: Play,
    color: 'text-purple-600'
  }
]

const quickActions = [
  {
    title: 'Start New Verification',
    description: 'Begin the eKYC process for a new business',
    icon: Plus,
    gradient: 'from-blue-500 to-purple-600',
    href: '/verification/new'
  },
  {
    title: 'Upload Documents',
    description: 'Add required documents for verification',
    icon: Upload,
    gradient: 'from-green-500 to-teal-600',
    href: '/documents/upload'
  },
  {
    title: 'View Reports',
    description: 'Access detailed analytics and reports',
    icon: BarChart3,
    gradient: 'from-purple-500 to-pink-600',
    href: '/reports'
  },
  {
    title: 'Manage Team',
    description: 'Add or manage team member access',
    icon: Users,
    gradient: 'from-orange-500 to-red-600',
    href: '/team'
  }
]

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
  { name: 'Profile', href: '/dashboard/profile', icon: User, current: false },
  { name: 'Documents', href: '/dashboard/documents', icon: FileStack, current: false },
  { name: 'Scoring', href: '/dashboard/scoring', icon: BarChart, current: false },
  { name: 'Settings', href: '/settings', icon: Cog, current: false },
  { name: 'Support', href: '/support', icon: HelpCircle, current: false },
]

interface StatsCardProps {
  title: string
  value: string
  icon: any
  trend?: string
  trendUp?: boolean
  subtitle?: string
  color?: string
}

// Modern Clean Stats Card Component
function StatsCard({ title, value, icon: Icon, trend, trendUp, subtitle, color = "blue" }: StatsCardProps) {
  const colorClasses = {
    blue: "border-blue-100 bg-blue-50",
    green: "border-emerald-100 bg-emerald-50", 
    purple: "border-purple-100 bg-purple-50",
    orange: "border-orange-100 bg-orange-50",
    red: "border-red-100 bg-red-50",
    teal: "border-teal-100 bg-teal-50"
  }

  const iconColors = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    purple: "text-purple-600", 
    orange: "text-orange-600",
    red: "text-red-600",
    teal: "text-teal-600"
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={`inline-flex items-center text-sm ${
              trendUp ? 'text-emerald-600' : 'text-red-600'
            }`}>
              <span className="mr-1">{trendUp ? '↗' : '↘'}</span>
              {trend}
            </div>
          )}
        </div>

        {/* Simple Icon */}
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${iconColors[color as keyof typeof iconColors]}`} />
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth()
  
  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-white" />
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

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600'
    if (score >= 600) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 800) return { label: 'Excellent', variant: 'success' as const }
    if (score >= 600) return { label: 'Good', variant: 'warning' as const }
    return { label: 'Needs Improvement', variant: 'destructive' as const }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <LoadingSpinner size="lg" variant="gradient" />
      </div>
    )
  }

  const statsData = [
    {
      title: "Verification Score",
      value: mockStats.currentScore.toString(),
      icon: TrendingUp,
      trend: "+50 points",
      trendUp: true,
      subtitle: `out of ${mockStats.maxScore}`,
      color: "blue"
    },
    {
      title: "Documents",
      value: `${mockStats.verifiedDocuments}/${mockStats.totalDocuments}`,
      icon: FileText,
      trend: "+2 this week",
      trendUp: true,
      subtitle: "verified",
      color: "green"
    },
    {
      title: "Completion Rate", 
      value: `${mockStats.completionPercentage}%`,
      icon: Target,
      trend: "+15%",
      trendUp: true,
      color: "purple"
    },
    {
      title: "Success Rate",
      value: `${mockStats.successRate}%`,
      icon: Award,
      trend: "+2.4%", 
      trendUp: true,
      color: "orange"
    },
    {
      title: "Monthly Growth",
      value: `${mockStats.monthlyGrowth}%`,
      icon: Activity,
      trend: "+5.7%",
      trendUp: true,
      color: "teal"
    },
    {
      title: "Active Status",
      value: user?.eKycStatus || 'PENDING',
      icon: Shield,
      color: user?.eKycStatus === 'VERIFIED' ? "green" : "red"
    }
  ]

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
                  <h1 className="text-2xl font-bold gradient-text">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Current eKYC Status Banner */}
          {user.eKycStatus !== 'VERIFIED' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card variant="premium" className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Complete Your Verification</h3>
                        <p className="text-gray-600">Your eKYC verification is {user.eKycStatus === 'PENDING' ? 'pending review' : 'incomplete'}. Complete it to unlock all features.</p>
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                              <div 
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${mockStats.completionPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{mockStats.completionPercentage}% complete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="premium">
                      {user.eKycStatus === 'PENDING' ? 'Check Status' : 'Continue Verification'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Overview - Updated with Clean Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
          >
            {statsData.map((stat, index) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                trendUp={stat.trendUp}
                subtitle={stat.subtitle}
                color={stat.color}
              />
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card variant="premium" className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50">
                <CardTitle className="text-xl gradient-text flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link href={action.href}>
                        <Card 
                          variant="minimal" 
                          className="h-full group cursor-pointer border-2 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* eKYC Status Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card variant="premium">
                <CardHeader>
                  <CardTitle className="text-xl gradient-text flex items-center gap-2">
                    <User className="w-5 h-5" />
                    eKYC Status Overview
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Your verification progress and score</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score Display */}
                  <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <div className="mb-4">
                      <div className={`text-6xl font-bold ${getScoreColor(mockStats.currentScore)}`}>
                        {mockStats.currentScore}
                      </div>
                      <div className="text-gray-500">out of {mockStats.maxScore}</div>
                    </div>
                    <Badge variant={getScoreBadge(mockStats.currentScore).variant}>
                      {getScoreBadge(mockStats.currentScore).label}
                    </Badge>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Profile Completion</span>
                        <span>{mockStats.completionPercentage}%</span>
                      </div>
                      <Progress value={mockStats.completionPercentage} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Document Verification</span>
                        <span>{Math.round((mockStats.verifiedDocuments / mockStats.totalDocuments) * 100)}%</span>
                      </div>
                      <Progress value={(mockStats.verifiedDocuments / mockStats.totalDocuments) * 100} className="h-3" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Link href="/dashboard/documents" className="flex-1">
                      <Button className="w-full" variant="premium">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card variant="premium">
                <CardHeader>
                  <CardTitle className="text-lg gradient-text flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4 p-4">
                    {mockActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Help & Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card variant="premium" className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold gradient-text mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-6">
                    Our support team is here to help you with any questions about the verification process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="premium">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}