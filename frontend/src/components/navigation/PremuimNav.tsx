'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ShieldCheck, Sparkles, Menu, X, ChevronDown, ArrowRight, 
  Users, Building, CreditCard, FileText, BarChart3, Settings,
  Globe, Award, Lock, Zap, Crown, Star, Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface NavigationItem {
  name: string
  href: string
  icon?: any
  description?: string
  badge?: string
  items?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  {
    name: 'Platform',
    href: '/platform',
    items: [
      {
        name: 'AI Verification',
        href: '/platform/ai-verification',
        icon: Sparkles,
        description: 'Advanced AI-powered document and identity verification',
        badge: 'Popular'
      },
      {
        name: 'Biometric Auth',
        href: '/platform/biometric',
        icon: Lock,
        description: 'Multi-factor biometric authentication system',
        badge: 'New'
      },
      {
        name: 'Risk Scoring',
        href: '/platform/risk-scoring',
        icon: BarChart3,
        description: 'Real-time risk assessment and credit scoring'
      },
      {
        name: 'API Platform',
        href: '/platform/api',
        icon: Zap,
        description: 'Enterprise API with 99.99% uptime guarantee'
      }
    ]
  },
  {
    name: 'Solutions',
    href: '/solutions',
    items: [
      {
        name: 'Financial Services',
        href: '/solutions/financial',
        icon: CreditCard,
        description: 'KYC/AML compliance for banks and fintech',
        badge: 'Enterprise'
      },
      {
        name: 'Healthcare',
        href: '/solutions/healthcare',
        icon: FileText,
        description: 'Patient verification and medical compliance'
      },
      {
        name: 'Gaming & iGaming',
        href: '/solutions/gaming',
        icon: Star,
        description: 'Age verification and responsible gaming'
      },
      {
        name: 'Marketplaces',
        href: '/solutions/marketplaces',
        icon: Users,
        description: 'Seller and buyer verification for platforms'
      }
    ]
  },
  {
    name: 'Enterprise',
    href: '/enterprise',
    items: [
      {
        name: 'White Label',
        href: '/enterprise/white-label',
        icon: Crown,
        description: 'Fully customizable verification platform',
        badge: 'Premium'
      },
      {
        name: 'Custom Integration',
        href: '/enterprise/integration',
        icon: Building,
        description: 'Tailored solutions for enterprise needs'
      },
      {
        name: 'Dedicated Support',
        href: '/enterprise/support',
        icon: Award,
        description: '24/7 dedicated customer success team'
      }
    ]
  },
  {
    name: 'Resources',
    href: '/resources',
    items: [
      {
        name: 'Documentation',
        href: '/docs',
        icon: FileText,
        description: 'Complete API docs and integration guides'
      },
      {
        name: 'Case Studies',
        href: '/case-studies',
        icon: BarChart3,
        description: 'Success stories from our customers'
      },
      {
        name: 'Compliance Hub',
        href: '/compliance',
        icon: Globe,
        description: 'Regulatory guides and compliance resources'
      },
      {
        name: 'Developer Tools',
        href: '/developer-tools',
        icon: Rocket,
        description: 'SDKs, webhooks, and testing environments'
      }
    ]
  }
]

export default function PremiumNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg' 
          : 'bg-white/80 backdrop-blur-md border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-4"
          >
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className={`w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    scrolled ? 'shadow-xl shadow-purple-500/20' : 'shadow-lg'
                  }`}
                >
                  <ShieldCheck className="w-7 h-7 text-white" />
                </motion.div>
                <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Talaty
                </span>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Enterprise eKYC
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDropdownToggle(item.name)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeDropdown === item.name 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50/50'
                  }`}
                >
                  {item.name}
                  <ChevronDown 
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.name && item.items && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {item.items.map((subItem, index) => (
                          <motion.div
                            key={subItem.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={subItem.href}
                              className="flex items-start p-4 rounded-xl hover:bg-purple-50 transition-all duration-300 group"
                            >
                              {subItem.icon && (
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                  <subItem.icon className="w-5 h-5 text-purple-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                    {subItem.name}
                                  </span>
                                  {subItem.badge && (
                                    <Badge 
                                      className={`text-xs px-2 py-0.5 ${
                                        subItem.badge === 'New' 
                                          ? 'bg-green-100 text-green-700' 
                                          : subItem.badge === 'Popular'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-purple-100 text-purple-700'
                                      }`}
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {subItem.description}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Dropdown Footer */}
                      <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                        <Link href={item.href} className="flex items-center justify-between text-sm font-semibold text-purple-700 hover:text-purple-800 transition-colors">
                          View all {item.name.toLowerCase()} features
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <Link href="/pricing">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button 
                  variant="ghost" 
                  className="text-sm font-semibold text-gray-700 hover:text-purple-700 hover:bg-purple-50/50"
                >
                  Pricing
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth/login">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="ghost" size="sm" className="text-sm font-semibold">
                  Sign In
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/auth/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="premium" 
                  size="sm" 
                  className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl group"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
              {/* Mobile Navigation Items */}
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleDropdownToggle(item.name)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.name && item.items && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 space-y-2 overflow-hidden"
                      >
                        {item.items.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            <Link
                              href={subItem.href}
                              className="flex items-center p-4 ml-4 rounded-xl bg-white hover:bg-purple-50 transition-colors group"
                            >
                              {subItem.icon && (
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                                  <subItem.icon className="w-4 h-4 text-purple-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{subItem.name}</span>
                                  {subItem.badge && (
                                    <Badge className="text-xs bg-purple-100 text-purple-700">
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{subItem.description}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Mobile Pricing Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.1 }}
              >
                <Link
                  href="/pricing"
                  className="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Pricing</span>
                </Link>
              </motion.div>

              {/* Mobile CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navigation.length + 1) * 0.1 }}
                className="space-y-4 pt-4 border-t border-gray-200"
              >
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="w-full h-12 text-base font-semibold">
                    Sign In
                  </Button>
                </Link>
                
                <Link href="/auth/register" className="block">
                  <Button 
                    variant="premium" 
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {(isOpen || activeDropdown) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false)
              setActiveDropdown(null)
            }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}