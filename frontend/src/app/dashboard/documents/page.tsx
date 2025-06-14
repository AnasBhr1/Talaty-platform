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
  Home, Users2, BarChart, FileStack, Cog, HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Mock data - replace with real API calls
const mockStats = {
  totalVerifications: 1247,
  pendingVerifications: 23,
  completedToday: 45,
  successRate: 94.2,
  monthlyGrowth: 12.5,
  activeBusinesses: 89
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
  { name: 'Verifications', href: '/verifications', icon: Shield, current: false },
  { name: 'Documents', href: '/documents', icon: FileStack, current: false },
  { name: 'Analytics', href: '/analytics', icon: BarChart, current: false },
  { name: 'Team', href: '/team', icon: Users2, current: false },
  { name: 'Settings', href: '/settings', icon: Cog, current: false },
  { name: 'Support', href: '/support', icon: HelpCircle, current: false },
]

interface StatsCardProps {
  title: string
  value: string
  icon: any
  gradient: string
  trend?: string
  trendUp?: boolean
}

function StatsCard({ title, value, icon: Icon, gradient, trend, trendUp }: StatsCardProps) {
  return (
    <Card variant="premium" hoverable className="group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trendUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {trend}
              </div>
            )}
          </div>
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <LoadingSpinner size="lg" variant="gradient" />
      </div>
    )
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
                                style={{ width: `${user.eKycStatus === 'PENDING' ? 75 : 25}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{user.eKycStatus === 'PENDING' ? '75%' : '25%'} complete</span>
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

          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
          >
            <StatsCard
              title="Total Verifications"
              value={mockStats.totalVerifications.toLocaleString()}
              icon={Shield}
              gradient="from-blue-500 to-purple-600"
              trend="+12.5%"
              trendUp={true}
            />
            <StatsCard
              title="Pending Review"
              value={mockStats.pendingVerifications.toString()}
              icon={Clock}
              gradient="from-yellow-500 to-orange-600"
              trend="-3.2%"
              trendUp={false}
            />
            <StatsCard
              title="Completed Today"
              value={mockStats.completedToday.toString()}
              icon={CheckCircle}
              gradient="from-green-500 to-teal-600"
              trend="+8.1%"
              trendUp={true}
            />
            <StatsCard
              title="Success Rate"
              value={`${mockStats.successRate}%`}
              icon={Target}
              gradient="from-purple-500 to-pink-600"
              trend="+2.4%"
              trendUp={true}
            />
            <StatsCard
              title="Monthly Growth"
              value={`${mockStats.monthlyGrowth}%`}
              icon={TrendingUp}
              gradient="from-teal-500 to-cyan-600"
              trend="+5.7%"
              trendUp={true}
            />
            <StatsCard
              title="Active Businesses"
              value={mockStats.activeBusinesses.toString()}
              icon={Building}
              gradient="from-indigo-500 to-blue-600"
              trend="+15.3%"
              trendUp={true}
            />
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
                          hoverable 
                          className="h-full group cursor-pointer border-2 hover:border-purple-200"
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
            {/* Recent Verifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card variant="premium">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl gradient-text flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      Recent Verifications
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Latest business verification submissions</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {mockRecentVerifications.map((verification, index) => (
                      <motion.div
                        key={verification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                {verification.businessName}
                              </h4>
                              <Badge className={`${getStatusColor(verification.status)} border text-xs`}>
                                {verification.status.replace('_', ' ')}
                              </Badge>
                              {verification.score && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-medium text-gray-700">{verification.score}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(verification.submittedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {verification.documents.length} documents
                                </span>
                              </div>
                              
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <Button variant="outline" className="w-full">
                      View All Verifications
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Feed & Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Activity Feed */}
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

              {/* Business Profile Summary */}
              <Card variant="premium">
                <CardHeader>
                  <CardTitle className="text-lg gradient-text flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Business Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.businessName || 'Business Name Not Set'}</p>
                      <p className="text-xs text-gray-500">Business Name</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verification Score</span>
                      <div className="flex items-center gap-2">
                        {user.score ? (
                          <>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${user.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.score}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Not available</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={`${getStatusColor(user.eKycStatus)} text-xs`}>
                        {user.eKycStatus.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="text-sm text-gray-900">June 2024</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Dashboard Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Document Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card variant="premium">
                <CardHeader>
                  <CardTitle className="text-lg gradient-text flex items-center gap-2">
                    <FileStack className="w-5 h-5" />
                    Document Status
                  </CardTitle>
                  <p className="text-sm text-gray-600">Track your uploaded documents</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Business License', status: 'VERIFIED', icon: CheckCircle, color: 'text-green-600' },
                      { name: 'Tax ID Certificate', status: 'PENDING', icon: Clock, color: 'text-yellow-600' },
                      { name: 'Bank Statement', status: 'VERIFIED', icon: CheckCircle, color: 'text-green-600' },
                      { name: 'Articles of Incorporation', status: 'MISSING', icon: AlertCircle, color: 'text-red-600' },
                    ].map((doc, index) => (
                      <motion.div
                        key={doc.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <doc.icon className={`w-5 h-5 ${doc.color}`} />
                          <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                        </div>
                        <Badge className={`${getStatusColor(doc.status)} text-xs`}>
                          {doc.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="premium" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Missing Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Overview Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card variant="premium">
                <CardHeader>
                  <CardTitle className="text-lg gradient-text flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Monthly Overview
                  </CardTitle>
                  <p className="text-sm text-gray-600">Verification trends this month</p>
                </CardHeader>
                <CardContent>
                  {/* Simple chart placeholder - you can integrate with a chart library */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="text-2xl font-bold text-gray-900">127</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">94</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">33</p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">vs Last Month</span>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">+12.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Help & Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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