'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  ShieldCheck, FileText, TrendingUp, Users, ArrowRight, CheckCircle,
  Star, Globe, Zap, Lock, Sparkles, Award, Building, Eye, Clock,
  BarChart3, Cpu, Shield, Rocket, ChevronDown, Play, ArrowUpRight,
  MessageSquare, Verified, Layers3, Brain, Database, Fingerprint,
  Timer, Target, Trophy, Network, Gauge, HeartHandshake, Crown,
  CreditCard, Smartphone, Camera, Monitor, BookOpen, FileSearch,
  Banknote, Heart, UserCheck, AlertTriangle, Search, Filter,
  Download, Mail, Phone, MapPin, Calendar, Briefcase, Users2,
  LineChart, PieChart, BarChart, TrendingDown, Activity,
  Headphones, MessageCircle, Github, Twitter, Linkedin,
  Menu, X, ChevronRight, Plus, Minus, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary-400/20 to-secondary-400/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Platform features
const platformFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Advanced machine learning algorithms with 99.97% accuracy in document verification and fraud detection.',
    stats: '99.97% Accuracy',
    color: 'from-purple-500 to-blue-600'
  },
  {
    icon: Fingerprint,
    title: 'Biometric Authentication',
    description: 'Multi-factor biometric verification including facial recognition, liveness detection, and voice analysis.',
    stats: '3-Factor Auth',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Database,
    title: 'Global Data Sources',
    description: 'Real-time verification against 500+ databases, sanctions lists, and regulatory bodies worldwide.',
    stats: '500+ Sources',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: Network,
    title: 'Enterprise API',
    description: 'Lightning-fast API with 99.99% uptime, webhooks, and seamless integration into your existing workflow.',
    stats: '99.99% Uptime',
    color: 'from-violet-500 to-purple-600'
  }
]

// Solutions data
const solutions = [
  {
    icon: CreditCard,
    title: 'Financial Services',
    description: 'Complete KYC/AML compliance solution for banks, fintech, and payment providers.',
    features: ['Anti-Money Laundering', 'PEP Screening', 'Sanctions Checking', 'Risk Assessment'],
    badge: 'Most Popular',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Patient verification and medical compliance for healthcare providers and telemedicine.',
    features: ['Patient Identity Verification', 'Insurance Verification', 'HIPAA Compliance', 'Medical Records'],
    badge: 'Regulated',
    color: 'from-red-500 to-pink-600'
  },
  {
    icon: Smartphone,
    title: 'Gaming & iGaming',
    description: 'Age verification and responsible gaming compliance for online gaming platforms.',
    features: ['Age Verification', 'Self-Exclusion', 'Geolocation', 'Responsible Gaming'],
    badge: 'High Volume',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Users2,
    title: 'Marketplaces',
    description: 'Seller and buyer verification for e-commerce and marketplace platforms.',
    features: ['Seller Onboarding', 'Buyer Protection', 'Trust & Safety', 'Fraud Prevention'],
    badge: 'Scalable',
    color: 'from-purple-500 to-violet-600'
  }
]

// Enterprise features
const enterpriseFeatures = [
  {
    icon: Crown,
    title: 'White Label Solution',
    description: 'Fully customizable platform with your branding and domain.',
    features: ['Custom Branding', 'Dedicated Infrastructure', 'API Customization']
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with SOC 2 Type II and ISO 27001 certification.',
    features: ['End-to-End Encryption', 'Zero-Trust Architecture', 'Audit Trails']
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: '24/7 dedicated customer success team and technical support.',
    features: ['24/7 Support', 'CSM Assignment', 'Priority Response']
  },
  {
    icon: Network,
    title: 'Custom Integration',
    description: 'Tailored solutions and custom integrations for enterprise needs.',
    features: ['Custom Workflows', 'Legacy System Integration', 'Dedicated Dev Team']
  }
]

// Resources data
const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Comprehensive API documentation and integration guides.',
    link: '/docs'
  },
  {
    icon: FileSearch,
    title: 'Case Studies',
    description: 'Real-world success stories from our customers.',
    link: '/case-studies'
  },
  {
    icon: Globe,
    title: 'Compliance Hub',
    description: 'Regulatory guides and compliance resources.',
    link: '/compliance'
  },
  {
    icon: Rocket,
    title: 'Developer Tools',
    description: 'SDKs, webhooks, and testing environments.',
    link: '/developer-tools'
  },
  {
    icon: MessageCircle,
    title: 'Community',
    description: 'Connect with other developers and get support.',
    link: '/community'
  },
  {
    icon: Award,
    title: 'Certifications',
    description: 'Industry certifications and security standards.',
    link: '/certifications'
  }
]

// Pricing plans
const pricingPlans = [
  {
    name: "Startup",
    price: "$99",
    period: "/month",
    originalPrice: "$149",
    description: "Perfect for growing startups",
    popular: false,
    features: [
      "500 verifications/month",
      "Basic AI document processing",
      "Email & chat support",
      "Standard API access",
      "Basic fraud detection",
      "Mobile SDK"
    ],
    color: "from-gray-500 to-gray-700",
    badge: "Great for Startups"
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    originalPrice: "$399",
    description: "Advanced features for scaling businesses",
    popular: true,
    features: [
      "5,000 verifications/month",
      "Advanced AI + ML processing",
      "Priority support + CSM",
      "Premium API + webhooks",
      "Advanced fraud detection",
      "Biometric authentication",
      "Custom compliance rules",
      "Real-time monitoring"
    ],
    color: "from-primary-500 to-secondary-500",
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    originalPrice: "",
    description: "White-glove service for enterprises",
    popular: false,
    features: [
      "Unlimited verifications",
      "AI + Biometric + Blockchain",
      "24/7 dedicated support",
      "Custom API development",
      "Advanced threat detection",
      "Multi-region deployment",
      "Custom compliance frameworks",
      "SLA guarantees",
      "On-premise deployment"
    ],
    color: "from-purple-500 to-pink-500",
    badge: "White Glove Service"
  }
]

// Stats data
const animatedStats = [
  { number: '250K+', label: 'Verified Businesses', icon: Building, suffix: '', color: 'text-blue-600' },
  { number: '99.99', label: 'Uptime SLA', icon: Shield, suffix: '%', color: 'text-green-600' },
  { number: '45', label: 'Average Verification', icon: Timer, suffix: 's', color: 'text-purple-600' },
  { number: '150', label: 'Countries Supported', icon: Globe, suffix: '+', color: 'text-orange-600' }
]

// FAQ data
const faqs = [
  {
    question: "How accurate is Talaty's AI verification?",
    answer: "Our AI-powered verification system achieves 99.97% accuracy through advanced machine learning algorithms and continuous model training on diverse datasets."
  },
  {
    question: "How long does the verification process take?",
    answer: "Most verifications are completed within 45 seconds. Complex cases requiring manual review typically take 1-2 business days."
  },
  {
    question: "Is Talaty compliant with international regulations?",
    answer: "Yes, we're fully compliant with GDPR, CCPA, KYC, AML regulations, and hold SOC 2 Type II and ISO 27001 certifications."
  },
  {
    question: "What types of documents can be verified?",
    answer: "We support 500+ document types including passports, driver's licenses, national IDs, utility bills, bank statements, and business documents across 150+ countries."
  },
  {
    question: "Do you offer API integration?",
    answer: "Yes, our RESTful API offers seamless integration with 99.99% uptime, comprehensive webhooks, and SDKs for popular programming languages."
  },
  {
    question: "What security measures are in place?",
    answer: "We implement bank-grade encryption, zero-trust architecture, and store data in SOC 2 certified data centers with regular security audits."
  }
]

export default function CompletePage() {
  const [activeSection, setActiveSection] = useState('hero')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  // Navigation items
  const navItems = [
    { name: 'Platform', href: '#platform' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Enterprise', href: '#enterprise' },
    { name: 'Resources', href: '#resources' },
    { name: 'Pricing', href: '#pricing' }
  ]

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Premium Cursor */}
      <motion.div
        className="fixed w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full pointer-events-none z-50 mix-blend-multiply opacity-70"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-white/20 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4"
            >
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl opacity-30 blur-lg animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">Talaty</span>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Enterprise eKYC
                </div>
              </div>
            </motion.div>
            
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.href.slice(1) 
                      ? 'text-primary-600' 
                      : 'text-neutral-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button variant="premium" size="sm">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200/50"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">Sign In</Button>
                  <Button variant="premium" className="w-full">Start Free Trial</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        id="hero"
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center"
      >
        <FloatingParticles />
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-100 via-secondary-100 to-accent-100 border border-primary-200 mb-8"
            >
              <Verified className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">
                Now with GPT-4 Enhanced AI • 99.97% Accuracy
              </span>
              <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs">
                NEW
              </Badge>
            </motion.div>
            
            {/* Hero Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-none"
            >
              <span className="block text-neutral-900">The Future of</span>
              <span className="block text-gradient">Identity Verification</span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Advanced AI-powered eKYC platform with biometric authentication, 
              real-time fraud detection, and enterprise-grade security. 
              <span className="text-primary-600 font-semibold">Verify identities in 45 seconds</span> 
              with 99.97% accuracy.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Button 
                variant="premium" 
                size="xl" 
                className="group shadow-primary-lg hover:shadow-primary"
              >
                <span className="relative z-10">Start Free Enterprise Trial</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
              
              <Button 
                variant="glass" 
                size="xl" 
                className="group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
                Watch Live Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
            >
              {[
                { icon: CheckCircle, text: "SOC 2 Type II Certified" },
                { icon: Shield, text: "GDPR & CCPA Compliant" },
                { icon: Award, text: "ISO 27001 Certified" },
                { icon: Zap, text: "Enterprise SLA Available" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20"
                >
                  <item.icon className="w-4 h-4 text-success-600" />
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {animatedStats.map((stat, index) => {
              const ref = useRef(null)
              const isInView = useInView(ref, { once: true })
              
              return (
                <motion.div
                  key={stat.label}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-white to-neutral-50 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-all duration-300 border border-neutral-100">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}
                  >
                    {stat.number}{stat.suffix}
                  </motion.div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Powerful Platform Features
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Advanced AI, biometric authentication, and enterprise-grade security 
              built for modern businesses and compliance requirements.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="h-full group hover:shadow-soft-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="badge-primary">{feature.stats}</Badge>
                          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                            Learn more <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="section-padding bg-gradient-to-br from-neutral-50 to-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Industry Solutions
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Tailored verification solutions for every industry, 
              built to meet specific compliance requirements and business needs.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="interactive" className="h-full group">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <solution.icon className="w-7 h-7 text-white" />
                      </div>
                      {solution.badge && (
                        <Badge className="badge-primary">{solution.badge}</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{solution.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      {solution.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                          <span className="text-sm text-neutral-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full group-hover:bg-primary-50 group-hover:border-primary-300 transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Enterprise Solutions
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              White-glove service and enterprise-grade features for 
              large organizations with complex requirements.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="h-full group hover:shadow-soft-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <div className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                              <span className="text-sm text-neutral-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card variant="gradient" className="text-center">
              <CardContent className="p-12">
                <Crown className="w-16 h-16 mx-auto mb-6 text-primary-600" />
                <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                  Ready for Enterprise?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Get dedicated support, custom integrations, and enterprise-grade 
                  security for your organization's specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="premium" size="lg">
                    Contact Sales
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="section-padding bg-gradient-to-br from-neutral-50 to-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Resources & Support
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Everything you need to get started, integrate successfully, 
              and scale your verification processes.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="interactive" className="h-full group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <resource.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">{resource.title}</h3>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 p-0">
                      Access Resource <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Choose the perfect plan for your business. 
              All plans include our core verification features with no hidden fees.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  variant={plan.popular ? "gradient" : "elevated"} 
                  className={`h-full relative ${plan.popular ? 'ring-2 ring-primary-500 ring-offset-4' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground mb-4">{plan.description}</p>
                      
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        {plan.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                        {plan.period && (
                          <span className="text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                      
                      {!plan.popular && plan.badge && (
                        <Badge className="badge-secondary">{plan.badge}</Badge>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant={plan.popular ? "premium" : "outline"} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pricing FAQ */}
          <div className="mt-20">
            <motion.h3 
              className="text-2xl font-bold text-center text-neutral-900 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h3>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card variant="elevated">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <span className="font-semibold text-neutral-900">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: openFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 text-muted-foreground">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <FloatingParticles />
        
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Verification Process?
            </h2>
            <p className="text-xl opacity-90 mb-12 leading-relaxed">
              Join thousands of businesses using Talaty for secure, fast, and reliable 
              identity verification. Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button variant="glass" size="xl" className="bg-white/20 hover:bg-white/30 border-white/30">
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button variant="outline" size="xl" className="border-white/50 text-white hover:bg-white/10">
                Book a Demo
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Setup in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white">
        <div className="container-wide py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Talaty</span>
                  <div className="text-xs text-neutral-400">Enterprise eKYC</div>
                </div>
              </div>
              <p className="text-neutral-300 mb-6 max-w-md">
                The leading AI-powered identity verification platform trusted by thousands 
                of businesses worldwide for secure and compliant eKYC solutions.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                  <Github className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-3 text-sm text-neutral-300">
                <a href="#" className="block hover:text-white transition-colors">AI Verification</a>
                <a href="#" className="block hover:text-white transition-colors">Biometric Auth</a>
                <a href="#" className="block hover:text-white transition-colors">API Platform</a>
                <a href="#" className="block hover:text-white transition-colors">Risk Scoring</a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-3 text-sm text-neutral-300">
                <a href="#" className="block hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block hover:text-white transition-colors">Contact Sales</a>
                <a href="#" className="block hover:text-white transition-colors">System Status</a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-neutral-400">
              © 2024 Talaty. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-neutral-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}