// frontend/src/app/dashboard/scoring/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, Award,
  Target, CheckCircle, AlertCircle, ArrowUp, ArrowDown,
  Calendar, Download, RefreshCw, Info
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock scoring data
const mockScoringData = {
  currentScore: 850,
  maxScore: 1000,
  previousScore: 780,
  scoreChange: 70,
  percentile: 85,
  grade: 'A',
  breakdown: {
    personalInfo: { score: 95, maxScore: 100, weight: 20 },
    businessInfo: { score: 88, maxScore: 100, weight: 25 },
    documents: { score: 82, maxScore: 100, weight: 30 },
    verification: { score: 90, maxScore: 100, weight: 25 }
  },
  history: [
    { date: '2024-01-01', score: 650 },
    { date: '2024-01-15', score: 720 },
    { date: '2024-02-01', score: 780 },
    { date: '2024-02-15', score: 820 },
    { date: '2024-03-01', score: 850 }
  ],
  recommendations: [
    {
      category: 'Documents',
      title: 'Upload missing bank statement',
      impact: '+25 points',
      priority: 'high'
    },
    {
      category: 'Verification',
      title: 'Complete phone verification',
      impact: '+15 points',
      priority: 'medium'
    },
    {
      category: 'Business Info',
      title: 'Add business registration details',
      impact: '+10 points',
      priority: 'low'
    }
  ],
  factors: [
    { name: 'Document Quality', impact: 'positive', score: 92 },
    { name: 'Verification Speed', impact: 'positive', score: 88 },
    { name: 'Information Completeness', impact: 'neutral', score: 75 },
    { name: 'Business History', impact: 'positive', score: 85 }
  ]
}

export default function ScoringPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Animate score counter
    if (!isLoading) {
      const duration = 2000
      const steps = 60
      const increment = mockScoringData.currentScore / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= mockScoringData.currentScore) {
          setAnimatedScore(mockScoringData.currentScore)
          clearInterval(timer)
        } else {
          setAnimatedScore(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isLoading])

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600'
    if (score >= 600) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 800) return 'from-green-500 to-emerald-600'
    if (score >= 600) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-rose-600'
  }

  const getGradeBadge = (grade: string) => {
    const gradeConfig = {
      'A': { variant: 'success' as const, bg: 'bg-green-100', text: 'text-green-800' },
      'B': { variant: 'warning' as const, bg: 'bg-blue-100', text: 'text-blue-800' },
      'C': { variant: 'secondary' as const, bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'D': { variant: 'destructive' as const, bg: 'bg-red-100', text: 'text-red-800' }
    }
    return gradeConfig[grade as keyof typeof gradeConfig] || gradeConfig['D']
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>
      case 'medium':
        return <Badge variant="warning">Medium Priority</Badge>
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Scoring">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Credit Score">
      <div className="space-y-8">
        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Score Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-white via-blue-50 to-purple-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className={`text-8xl font-bold ${getScoreColor(mockScoringData.currentScore)} mb-2`}>
                    {animatedScore}
                  </div>
                  <div className="text-gray-500 text-lg">
                    out of {mockScoringData.maxScore}
                  </div>
                  <div className="absolute -top-4 -right-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getScoreGradient(mockScoringData.currentScore)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                      {mockScoringData.grade}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      {mockScoringData.scoreChange > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`font-semibold ${
                        mockScoringData.scoreChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(mockScoringData.scoreChange)} points
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">This month</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-blue-600 mb-1">
                      {mockScoringData.percentile}th percentile
                    </div>
                    <div className="text-sm text-gray-500">Better than most</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1" variant="premium">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Score
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(mockScoringData.breakdown).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {data.score}/{data.maxScore}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={(data.score / data.maxScore) * 100} className="h-2" />
                    <span className="absolute right-0 -top-6 text-xs text-gray-500">
                      {data.weight}% weight
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Score History and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Score History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockScoringData.history.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{entry.score}</span>
                        {index > 0 && (
                          <span className={`text-xs ${
                            entry.score > mockScoringData.history[index - 1].score
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {entry.score > mockScoringData.history[index - 1].score ? '+' : ''}
                            {entry.score - mockScoringData.history[index - 1].score}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Upward Trend</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your score has improved by {mockScoringData.scoreChange} points over the last 3 months. 
                    Great progress!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Improvement Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockScoringData.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              {rec.category}
                            </span>
                            {getPriorityBadge(rec.priority)}
                          </div>
                          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-green-600">
                            {rec.impact}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Take Action
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="premium" className="w-full">
                    <Award className="w-4 h-4 mr-2" />
                    View All Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Scoring Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Scoring Factors Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockScoringData.factors.map((factor, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{factor.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{factor.score}</span>
                        {factor.impact === 'positive' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : factor.impact === 'negative' ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <Info className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${
                        factor.impact === 'positive' 
                          ? 'text-green-600' 
                          : factor.impact === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}>
                        {factor.impact === 'positive' ? 'Positive Impact' : 
                         factor.impact === 'negative' ? 'Negative Impact' : 'Neutral'}
                      </span>
                      <span className="text-gray-500">{factor.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Understanding Your Score
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h5 className="font-semibold mb-2">Score Ranges:</h5>
                    <ul className="space-y-1">
                      <li>• 850-1000: Excellent (A)</li>
                      <li>• 700-849: Good (B)</li>
                      <li>• 550-699: Fair (C)</li>
                      <li>• Below 550: Poor (D)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Key Factors:</h5>
                    <ul className="space-y-1">
                      <li>• Document verification (30%)</li>
                      <li>• Business information (25%)</li>
                      <li>• Personal information (20%)</li>
                      <li>• Verification speed (25%)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}