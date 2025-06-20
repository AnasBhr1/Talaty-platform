'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, TrendingUp, TrendingDown, Target, Award, AlertCircle,
  CheckCircle, Clock, Search, Menu, Bell, LogOut, ChevronRight, 
  Sparkles, Shield, Home, User, FileText, Cog, HelpCircle, X,
  Star, ArrowUp, ArrowDown, Info, Calendar, Zap, ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
  { name: 'Profile', href: '/dashboard/profile', icon: User, current: false },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText, current: false },
  { name: 'Scoring', href: '/dashboard/scoring', icon: BarChart3, current: true },
  { name: 'Settings', href: '/settings', icon: Cog, current: false },
  { name: 'Support', href: '/support', icon: HelpCircle, current: false },
]

const mockScoreData = {
  currentScore: 750,
  maxScore: 1000,
  previousScore: 700,
  scoreChange: 50,
  grade: 'B+',
  percentile: 85,
  lastUpdated: '2024-06-14T10:30:00Z',
  trend: 'increasing'
}

const scoreFactors = [
  {
    category: 'Document Verification',
    score: 180,
    maxScore: 200,
    percentage: 90,
    status: 'good',
    description: 'Business license, tax documents, and bank statements verified',
    impact: 'high',
    suggestions: ['Upload financial statements for additional points']
  },
  {
    category: 'Business Information',
    score: 160,
    maxScore: 200,
    percentage: 80,
    status: 'good',
    description: 'Complete business profile with verified contact information',
    impact: 'high',
    suggestions: ['Add business description', 'Verify phone number']
  },
  {
    category: 'Financial Health',
    score: 140,
    maxScore: 200,
    percentage: 70,
    status: 'moderate',
    description: 'Bank statements show steady cash flow and good account standing',
    impact: 'high',
    suggestions: ['Upload recent financial statements', 'Provide profit & loss statements']
  },
  {
    category: 'Compliance Records',
    score: 120,
    maxScore: 150,
    percentage: 80,
    status: 'good',
    description: 'All regulatory requirements met with current documentation',
    impact: 'medium',
    suggestions: ['Keep documents up to date', 'Monitor expiration dates']
  },
  {
    category: 'Business History',
    score: 100,
    maxScore: 150,
    percentage: 67,
    status: 'moderate',
    description: 'Established business with 2+ years of operation history',
    impact: 'medium',
    suggestions: ['Provide longer business history documentation']
  },
  {
    category: 'Risk Assessment',
    score: 50,
    maxScore: 100,
    percentage: 50,
    status: 'needs_improvement',
    description: 'Moderate risk profile based on industry and business model',
    impact: 'low',
    suggestions: ['Improve documentation quality', 'Provide additional references']
  }
]

const scoreHistory = [
  { date: '2024-06-01', score: 650 },
  { date: '2024-06-05', score: 680 },
  { date: '2024-06-10', score: 700 },
  { date: '2024-06-14', score: 750 },
]

const improvementSuggestions = [
  {
    title: 'Upload Financial Statements',
    description: 'Add your latest profit & loss statements to boost your financial health score',
    impact: '+30 points',
    priority: 'high',
    category: 'Financial Health'
  },
  {
    title: 'Complete Business Profile',
    description: 'Fill in missing business information fields in your profile',
    impact: '+15 points',
    priority: 'medium',
    category: 'Business Information'
  },
  {
    title: 'Verify Phone Number',
    description: 'Complete phone verification to improve your contact information score',
    impact: '+10 points',
    priority: 'medium',
    category: 'Business Information'
  },
  {
    title: 'Add Business References',
    description: 'Provide business references to reduce your risk assessment score',
    impact: '+25 points',
    priority: 'low',
    category: 'Risk Assessment'
  }
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

function ScoreFactorCard({ factor }: { factor: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100'
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100'
      case 'needs_improvement':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{factor.category}</h3>
            <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{factor.score}</div>
            <div className="text-sm text-gray-500">/ {factor.maxScore}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{factor.percentage}%</span>
          </div>
          <Progress value={factor.percentage} className="h-2" />
          
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(factor.status)}>
              {factor.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <span className={`text-xs font-medium ${getImpactColor(factor.impact)}`}>
              {factor.impact.toUpperCase()} IMPACT
            </span>
          </div>

          {factor.suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700 mb-2">SUGGESTIONS</h4>
              <ul className="space-y-1">
                {factor.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ScoringPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getScoreGrade = (score: number) => {
    if (score >= 900) return { grade: 'A+', color: 'text-green-600' }
    if (score >= 800) return { grade: 'A', color: 'text-green-600' }
    if (score >= 700) return { grade: 'B+', color: 'text-blue-600' }
    if (score >= 600) return { grade: 'B', color: 'text-blue-600' }
    if (score >= 500) return { grade: 'C+', color: 'text-yellow-600' }
    if (score >= 400) return { grade: 'C', color: 'text-orange-600' }
    return { grade: 'D', color: 'text-red-600' }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const scoreGrade = getScoreGrade(mockScoreData.currentScore)

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
                  <h1 className="text-2xl font-bold text-gray-900">Scoring</h1>
                  <p className="text-sm text-gray-500">
                    Your verification score breakdown and improvement suggestions
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Score Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white border-0">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Score */}
                    <div className="text-center lg:text-left">
                      <div className="text-6xl font-bold mb-2">{mockScoreData.currentScore}</div>
                      <div className="text-xl opacity-90 mb-2">out of {mockScoreData.maxScore}</div>
                      <div className={`text-2xl font-bold ${scoreGrade.color.replace('text-', 'text-white')}`}>
                        Grade: {scoreGrade.grade}
                      </div>
                    </div>

                    {/* Score Change */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {mockScoreData.scoreChange > 0 ? (
                          <ArrowUp className="w-8 h-8 mr-2" />
                        ) : (
                          <ArrowDown className="w-8 h-8 mr-2" />
                        )}
                        <span className="text-3xl font-bold">
                          {mockScoreData.scoreChange > 0 ? '+' : ''}{mockScoreData.scoreChange}
                        </span>
                      </div>
                      <div className="text-lg opacity-90">points this month</div>
                      <div className="text-sm opacity-80">
                        Previous: {mockScoreData.previousScore}
                      </div>
                    </div>

                    {/* Percentile */}
                    <div className="text-center lg:text-right">
                      <div className="text-4xl font-bold mb-2">{mockScoreData.percentile}th</div>
                      <div className="text-lg opacity-90 mb-2">percentile</div>
                      <div className="text-sm opacity-80">
                        Better than {mockScoreData.percentile}% of businesses
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-80">
                        Last updated: {formatDate(mockScoreData.lastUpdated)}
                      </span>
                      <div className="flex items-center">
                        {mockScoreData.trend === 'increasing' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm">
                          {mockScoreData.trend === 'increasing' ? 'Trending up' : 'Trending down'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Score Factors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {scoreFactors.map((factor, index) => (
                      <motion.div
                        key={factor.category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ScoreFactorCard factor={factor} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Improvement Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {improvementSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                            <Badge 
                              variant={suggestion.priority === 'high' ? 'destructive' : 
                                     suggestion.priority === 'medium' ? 'warning' : 'secondary'}
                              className="text-xs"
                            >
                              {suggestion.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {suggestion.category}</span>
                            <span className="text-green-600 font-medium">{suggestion.impact}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Score History Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Score History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Score history chart would go here</p>
                      <p className="text-sm text-gray-500">Integration with charting library needed</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {scoreHistory.map((entry, index) => (
                      <div key={entry.date} className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{entry.score}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}