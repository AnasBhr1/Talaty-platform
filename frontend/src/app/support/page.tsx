'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, MessageCircle, Mail, Phone, Search, 
  ChevronDown, ChevronRight, Clock, CheckCircle,
  FileText, Video, Book, Users, Zap, Globe,
  ArrowRight, Star, ThumbsUp, ThumbsDown
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'

const faqCategories = [
  { id: 'getting-started', name: 'Getting Started', icon: Zap },
  { id: 'verification', name: 'Verification Process', icon: CheckCircle },
  { id: 'documents', name: 'Document Upload', icon: FileText },
  { id: 'api', name: 'API & Integration', icon: Globe },
  { id: 'billing', name: 'Billing & Pricing', icon: Star },
  { id: 'account', name: 'Account Management', icon: Users }
]

const faqs = [
  {
    id: 1,
    category: 'getting-started',
    question: 'How do I get started with Talaty?',
    answer: 'Getting started is simple! Sign up for an account, complete your business profile, upload your required documents, and you\'ll be ready to start verifying identities within minutes.',
    helpful: 42,
    rating: 4.8
  },
  {
    id: 2,
    category: 'getting-started',
    question: 'What documents do I need to get verified?',
    answer: 'You\'ll need: Business License, Tax ID Certificate, Bank Statement (last 3 months), and Articles of Incorporation. Additional documents may be required based on your business type.',
    helpful: 38,
    rating: 4.6
  },
  {
    id: 3,
    category: 'verification',
    question: 'How long does the verification process take?',
    answer: 'Most verifications are completed within 45 seconds using our AI system. Complex cases requiring manual review typically take 1-2 business days.',
    helpful: 56,
    rating: 4.9
  },
  {
    id: 4,
    category: 'verification',
    question: 'What is the accuracy rate of Talaty\'s verification?',
    answer: 'Our AI-powered verification system achieves 99.97% accuracy through advanced machine learning algorithms and continuous model training.',
    helpful: 34,
    rating: 4.7
  },
  {
    id: 5,
    category: 'documents',
    question: 'What file formats are supported?',
    answer: 'We support PDF, JPG, PNG, and JPEG files. Maximum file size is 10MB per document. Documents must be clear and readable.',
    helpful: 29,
    rating: 4.5
  },
  {
    id: 6,
    category: 'api',
    question: 'How do I integrate Talaty API?',
    answer: 'Check our comprehensive API documentation with code examples and SDKs for popular programming languages. Our support team can also help with custom integrations.',
    helpful: 45,
    rating: 4.8
  },
  {
    id: 7,
    category: 'billing',
    question: 'Can I change my subscription plan?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately, and you\'ll be billed proratedly.',
    helpful: 31,
    rating: 4.6
  },
  {
    id: 8,
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset link within minutes. If you don\'t see it, check your spam folder.',
    helpful: 22,
    rating: 4.4
  }
]

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: 'Available 24/7',
    color: 'from-blue-500 to-cyan-500',
    action: 'Start Chat'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message',
    availability: 'Response within 2 hours',
    color: 'from-purple-500 to-pink-500',
    action: 'Send Email'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Talk directly with our experts',
    availability: 'Mon-Fri 9AM-6PM EST',
    color: 'from-green-500 to-teal-500',
    action: 'Call Now'
  },
  {
    icon: Video,
    title: 'Screen Share',
    description: 'Get guided assistance',
    availability: 'By appointment',
    color: 'from-orange-500 to-red-500',
    action: 'Schedule'
  }
]

const resources = [
  {
    icon: Book,
    title: 'Documentation',
    description: 'Complete guides and API references',
    link: '/docs'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    link: '/tutorials'
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Connect with other developers',
    link: '/community'
  },
  {
    icon: FileText,
    title: 'Best Practices',
    description: 'Learn from our experts',
    link: '/best-practices'
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const { toast } = useToast()

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFaqVote = (faqId: number, helpful: boolean) => {
    toast({
      title: 'Thank you!',
      description: `Your feedback helps us improve our support content.`,
      variant: 'success',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Find answers to your questions, get in touch with our support team, 
              or explore our comprehensive documentation.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  placeholder="Search for help articles, guides, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Support Channels */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Support</h2>
            <p className="text-xl text-gray-600">Choose the best way to reach us</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <channel.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                    <p className="text-gray-600 mb-3">{channel.description}</p>
                    <Badge variant="outline" className="mb-4">{channel.availability}</Badge>
                    <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find quick answers to common questions</p>
          </div>

          {/* FAQ Categories */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
            >
              All
            </Button>
            {faqCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {faq.helpful} helpful
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {faq.rating}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Was this helpful?</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFaqVote(faq.id, true)}
                              >
                                <ThumbsUp className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFaqVote(faq.id, false)}
                              >
                                <ThumbsDown className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                            <Button variant="outline" size="sm">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or browse our categories</p>
            </div>
          )}
        </motion.section>

        {/* Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Resources</h2>
            <p className="text-xl text-gray-600">Explore our comprehensive help resources</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={resource.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <resource.icon className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                      <div className="flex items-center justify-center text-purple-600 group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Status Page */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-green-900">All Systems Operational</h3>
              </div>
              <p className="text-green-700 mb-6">
                All Talaty services are running smoothly. Check our status page for real-time updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  <Globe className="w-4 h-4 mr-2" />
                  View Status Page
                </Button>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  <Clock className="w-4 h-4 mr-2" />
                  Incident History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}