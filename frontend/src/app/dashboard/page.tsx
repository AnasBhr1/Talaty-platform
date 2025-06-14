// frontend/src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, FileText, TrendingUp, AlertCircle, CheckCircle, 
  Clock, Upload, Award, Target, ArrowUpRight, Eye,
  BarChart3, PieChart, Activity, Zap
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

// Mock data - in real app, this would come from your APIs
const mockData = {
  completionPercentage: 75,
  totalDocuments: 8,
  verifiedDocuments: 6,
  pendingDocuments: 2,
  currentScore: 850,
  maxScore: 1000,
  recentActivities: [
    {
      id: 1,
      type: 'document_upload',
      title: 'Business License uploaded',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'verification',
      title: 'Tax Certificate verified',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'profile_update',
      title: 'Business information updated',
      time: '2 days ago',
      status: 'info'
    }
  ],
  nextSteps: [
    'Upload Bank Statement',
    'Verify phone number',
    'Complete address verification'
  ]
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendValue 
}: {
  title: string
  value: string | number
  icon: any
  color: string
  trend?: 'up' | 'down'
  trendValue?: string
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-2 ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowUpRight className={`w-4 h-4 mr-1 ${
                  trend === 'down' ? 'rotate-90' : ''
                }`} />
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

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

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName}!
                  </h2>
                  <p className="text-lg opacity-90">
                    Your eKYC verification is {mockData.completionPercentage}% complete
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm opacity-80">Progress</span>
                      <span className="text-sm font-bold">{mockData.completionPercentage}%</span>
                    </div>
                    <Progress 
                      value={mockData.completionPercentage} 
                      className="w-80 h-2 bg-white/20"
                    />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                    <Award className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Documents"
            value={`${mockData.verifiedDocuments}/${mockData.totalDocuments}`}
            icon={FileText}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="up"
            trendValue="+2 this week"
          />
          
          <StatCard
            title="Verification Score"
            value={mockData.currentScore}
            icon={TrendingUp}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend="up"
            trendValue="+50 points"
          />
          
          <StatCard
            title="Completion Rate"
            value={`${mockData.completionPercentage}%`}
            icon={Target}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend="up"
            trendValue="+15%"
          />
          
          <StatCard
            title="Status"
            value={user?.eKycStatus || 'In Progress'}
            icon={Activity}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* eKYC Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  eKYC Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                  <div className="mb-4">
                    <div className={`text-6xl font-bold ${getScoreColor(mockData.currentScore)}`}>
                      {mockData.currentScore}
                    </div>
                    <div className="text-gray-500">out of {mockData.maxScore}</div>
                  </div>
                  <Badge variant={getScoreBadge(mockData.currentScore).variant}>
                    {getScoreBadge(mockData.currentScore).label}
                  </Badge>
                </div>

                {/* Next Steps */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Next Steps to Improve</h4>
                  <div className="space-y-2">
                    {mockData.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-500 mr-3" />
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.status === 'success' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button variant="ghost" className="w-full">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/documents">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Upload Document
                  </Button>
                </Link>
                
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <User className="w-6 h-6 mb-2" />
                    Update Profile
                  </Button>
                </Link>
                
                <Link href="/dashboard/scoring">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    View Score
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-20 flex-col">
                  <PieChart className="w-6 h-6 mb-2" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}