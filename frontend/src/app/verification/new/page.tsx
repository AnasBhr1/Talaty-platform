'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { 
  ArrowLeft, CheckCircle, Building, User, FileText, Upload, 
  ChevronRight, ShieldCheck, Sparkles, Clock, Award, Target,
  Globe, Phone, Mail, MapPin, Calendar, CreditCard, Briefcase,
  AlertCircle, Check, X, Plus, Trash2, Eye, Download, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/useToast'

// Form schemas for each step
const businessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(1, 'Please select business type'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  industry: z.string().min(1, 'Please select industry'),
  foundedDate: z.string().min(1, 'Founded date is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Please provide a brief description (minimum 10 characters)')
})

const contactInfoSchema = z.object({
  contactFirstName: z.string().min(2, 'First name is required'),
  contactLastName: z.string().min(2, 'Last name is required'),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
  businessAddress: z.string().min(5, 'Business address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  country: z.string().min(2, 'Country is required')
})

const documentsSchema = z.object({
  businessLicense: z.any().optional(),
  taxCertificate: z.any().optional(),
  bankStatement: z.any().optional(),
  articlesOfIncorporation: z.any().optional(),
  ownershipDocuments: z.any().optional()
})

type BusinessInfoForm = z.infer<typeof businessInfoSchema>
type ContactInfoForm = z.infer<typeof contactInfoSchema>
type DocumentsForm = z.infer<typeof documentsSchema>

const businessTypes = [
  'Sole Proprietorship',
  'Partnership', 
  'Corporation',
  'LLC',
  'Nonprofit',
  'Cooperative',
  'Other'
]

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Education',
  'Entertainment',
  'Agriculture',
  'Transportation',
  'Other'
]

const requiredDocuments = [
  {
    id: 'businessLicense',
    name: 'Business License',
    description: 'Official business registration or license',
    required: true,
    icon: Building
  },
  {
    id: 'taxCertificate',
    name: 'Tax Certificate',
    description: 'Tax identification certificate or EIN letter',
    required: true,
    icon: FileText
  },
  {
    id: 'bankStatement',
    name: 'Bank Statement',
    description: 'Recent bank statement (last 3 months)',
    required: true,
    icon: CreditCard
  },
  {
    id: 'articlesOfIncorporation',
    name: 'Articles of Incorporation',
    description: 'Corporate formation documents',
    required: false,
    icon: Briefcase
  },
  {
    id: 'ownershipDocuments',
    name: 'Ownership Documents',
    description: 'Proof of ownership or partnership agreements',
    required: false,
    icon: User
  }
]

export default function NewVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const businessForm = useForm<BusinessInfoForm>({
    resolver: zodResolver(businessInfoSchema)
  })

  const contactForm = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema)
  })

  const documentsForm = useForm<DocumentsForm>({
    resolver: zodResolver(documentsSchema)
  })

  const steps = [
    { number: 1, title: 'Business Information', icon: Building, description: 'Basic business details' },
    { number: 2, title: 'Contact Information', icon: User, description: 'Contact and address details' },
    { number: 3, title: 'Documents Upload', icon: FileText, description: 'Required business documents' },
    { number: 4, title: 'Review & Submit', icon: CheckCircle, description: 'Review and submit verification' }
  ]

  const handleNext = async () => {
    let isValid = false
    
    if (currentStep === 1) {
      isValid = await businessForm.trigger()
    } else if (currentStep === 2) {
      isValid = await contactForm.trigger()
    } else if (currentStep === 3) {
      // Check if required documents are uploaded
      const requiredDocs = requiredDocuments.filter(doc => doc.required)
      const missingDocs = requiredDocs.filter(doc => !uploadedFiles[doc.id])
      
      if (missingDocs.length > 0) {
        toast({
          title: 'Missing Required Documents',
          description: `Please upload: ${missingDocs.map(doc => doc.name).join(', ')}`,
          variant: 'destructive'
        })
        return
      }
      isValid = true
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFileUpload = (documentId: string, file: File) => {
    console.log('Uploading file:', file.name, 'for document:', documentId)
    
    // File size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload files smaller than 10MB',
        variant: 'destructive'
      })
      return
    }

    // File type validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload PDF, JPG, or PNG files only',
        variant: 'destructive'
      })
      return
    }

    // Store the file
    setUploadedFiles(prev => ({
      ...prev,
      [documentId]: file
    }))

    toast({
      title: 'File Uploaded Successfully!',
      description: `${file.name} has been uploaded and is ready for verification`,
      variant: 'success'
    })
    
    console.log('File uploaded successfully:', file.name)
  }

  const removeFile = (documentId: string) => {
    const fileName = uploadedFiles[documentId]?.name
    setUploadedFiles(prev => {
      const updated = { ...prev }
      delete updated[documentId]
      return updated
    })
    
    toast({
      title: 'File Removed',
      description: `${fileName} has been removed`,
      variant: 'success'
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: 'Verification Submitted Successfully!',
        description: 'Your business verification has been submitted for review. You will receive an email confirmation shortly.',
        variant: 'success'
      })
      
      // Redirect to dashboard after success
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
      
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your verification. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepProgress = () => {
    return (currentStep / 4) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    Start New Verification
                  </h1>
                  <p className="text-xs text-gray-500">Step {currentStep} of 4</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {Math.round(getStepProgress())}% Complete
              </div>
              <div className="w-32">
                <Progress value={getStepProgress()} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep > step.number 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.number
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <div className={`text-sm font-semibold ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-24 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card variant="premium" className="shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl gradient-text">
                    <Building className="w-6 h-6" />
                    Business Information
                  </CardTitle>
                  <p className="text-gray-600">Tell us about your business</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="businessName"
                              placeholder="Your Company LLC"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...businessForm.register('businessName')}
                            />
                          </div>
                          {businessForm.formState.errors.businessName && (
                            <p className="text-sm text-red-600">{businessForm.formState.errors.businessName.message}</p>
                          )}
                        </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
                        <select
                          id="businessType"
                          className="w-full h-12 px-4 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900"
                          {...businessForm.register('businessType')}
                        >
                          <option value="">Select business type</option>
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {businessForm.formState.errors.businessType && (
                          <p className="text-sm text-red-600">{businessForm.formState.errors.businessType.message}</p>
                        )}
                      </div>

                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Registration Number *</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="registrationNumber"
                              placeholder="123456789"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...businessForm.register('registrationNumber')}
                            />
                          </div>
                          {businessForm.formState.errors.registrationNumber && (
                            <p className="text-sm text-red-600">{businessForm.formState.errors.registrationNumber.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID / EIN *</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="taxId"
                              placeholder="12-3456789"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...businessForm.register('taxId')}
                            />
                          </div>
                          {businessForm.formState.errors.taxId && (
                            <p className="text-sm text-red-600">{businessForm.formState.errors.taxId.message}</p>
                          )}
                        </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <select
                          id="industry"
                          className="w-full h-12 px-4 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900"
                          {...businessForm.register('industry')}
                        >
                          <option value="">Select industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                        {businessForm.formState.errors.industry && (
                          <p className="text-sm text-red-600">{businessForm.formState.errors.industry.message}</p>
                        )}
                      </div>

                        <div className="space-y-2">
                          <Label htmlFor="foundedDate">Founded Date *</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="foundedDate"
                              type="date"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...businessForm.register('foundedDate')}
                            />
                          </div>
                          {businessForm.formState.errors.foundedDate && (
                            <p className="text-sm text-red-600">{businessForm.formState.errors.foundedDate.message}</p>
                          )}
                        </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                        <input
                          id="website"
                          placeholder="https://yourcompany.com"
                          className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                          {...businessForm.register('website')}
                        />
                      </div>
                      {businessForm.formState.errors.website && (
                        <p className="text-sm text-red-600">{businessForm.formState.errors.website.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description *</Label>
                      <textarea
                        id="description"
                        rows={4}
                        placeholder="Describe your business activities, products, or services..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none text-gray-900 placeholder-gray-500"
                        {...businessForm.register('description')}
                      />
                      {businessForm.formState.errors.description && (
                        <p className="text-sm text-red-600">{businessForm.formState.errors.description.message}</p>
                      )}
                    </div>
                  </form>
                </CardContent>
              </motion.div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl gradient-text">
                    <User className="w-6 h-6" />
                    Contact Information
                  </CardTitle>
                  <p className="text-gray-600">Primary contact and business address</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contactFirstName">First Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="contactFirstName"
                              placeholder="John"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('contactFirstName')}
                            />
                          </div>
                          {contactForm.formState.errors.contactFirstName && (
                            <p className="text-sm text-red-600">{contactForm.formState.errors.contactFirstName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactLastName">Last Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="contactLastName"
                              placeholder="Doe"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('contactLastName')}
                            />
                          </div>
                          {contactForm.formState.errors.contactLastName && (
                            <p className="text-sm text-red-600">{contactForm.formState.errors.contactLastName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="contactEmail"
                              type="email"
                              placeholder="john@company.com"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('contactEmail')}
                            />
                          </div>
                          {contactForm.formState.errors.contactEmail && (
                            <p className="text-sm text-red-600">{contactForm.formState.errors.contactEmail.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="contactPhone"
                              placeholder="+1 (555) 123-4567"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('contactPhone')}
                            />
                          </div>
                          {contactForm.formState.errors.contactPhone && (
                            <p className="text-sm text-red-600">{contactForm.formState.errors.contactPhone.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessAddress">Street Address *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="businessAddress"
                              placeholder="123 Business Street"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('businessAddress')}
                            />
                          </div>
                          {contactForm.formState.errors.businessAddress && (
                            <p className="text-sm text-red-600">{contactForm.formState.errors.businessAddress.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <input
                              id="city"
                              placeholder="New York"
                              className="w-full h-12 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('city')}
                            />
                            {contactForm.formState.errors.city && (
                              <p className="text-sm text-red-600">{contactForm.formState.errors.city.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <input
                              id="state"
                              placeholder="NY"
                              className="w-full h-12 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('state')}
                            />
                            {contactForm.formState.errors.state && (
                              <p className="text-sm text-red-600">{contactForm.formState.errors.state.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code *</Label>
                            <input
                              id="zipCode"
                              placeholder="10001"
                              className="w-full h-12 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('zipCode')}
                            />
                            {contactForm.formState.errors.zipCode && (
                              <p className="text-sm text-red-600">{contactForm.formState.errors.zipCode.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              id="country"
                              placeholder="United States"
                              className="w-full h-12 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-500"
                              {...contactForm.register('country')}
                            />
                          </div>
                          {contactForm.formState.errors.country && (
                            <p className="text-sm text-red-600">{contactForm.formState.errors.country.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </motion.div>
            )}

            {/* Step 3: Documents Upload */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl gradient-text">
                    <FileText className="w-6 h-6" />
                    Upload Documents
                  </CardTitle>
                  <p className="text-gray-600">Upload required business documents for verification</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Document Requirements</h4>
                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                          <li>• Files must be in PDF, JPG, or PNG format</li>
                          <li>• Maximum file size: 10MB per document</li>
                          <li>• Documents must be clear and readable</li>
                          <li>• All required documents marked with * must be uploaded</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {requiredDocuments.map((doc) => (
                      <div key={doc.id} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start space-x-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                            uploadedFiles[doc.id] 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-br from-purple-500 to-blue-600'
                          }`}>
                            <doc.icon className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                              {doc.required && (
                                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-semibold">
                                  Required
                                </Badge>
                              )}
                              {uploadedFiles[doc.id] && (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                                  ✓ Uploaded
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">{doc.description}</p>
                            
                            {uploadedFiles[doc.id] ? (
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                      <CheckCircle className="w-7 h-7 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-lg font-semibold text-green-900">{uploadedFiles[doc.id].name}</p>
                                      <p className="text-sm text-green-600">
                                        {(uploadedFiles[doc.id].size / 1024 / 1024).toFixed(2)} MB • Upload completed
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        const fileUrl = URL.createObjectURL(uploadedFiles[doc.id])
                                        window.open(fileUrl, '_blank')
                                      }}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-100 h-10 px-4"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Preview
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeFile(doc.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-100 h-10 px-4"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Premium Upload Area */}
                                <input
                                  type="file"
                                  id={doc.id}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      handleFileUpload(doc.id, file)
                                    }
                                  }}
                                  className="hidden"
                                />
                                <label htmlFor={doc.id} className="cursor-pointer block">
                                  <div className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 border-3 border-dashed border-gray-300 rounded-2xl p-12 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:via-blue-50 hover:to-indigo-50 transition-all duration-300 group overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                      <div className="absolute inset-0" style={{
                                        backgroundImage: `radial-gradient(circle at 20px 20px, #8B5CF6 2px, transparent 0)`,
                                        backgroundSize: '40px 40px'
                                      }} />
                                    </div>
                                    
                                    <div className="relative text-center">
                                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-10 h-10 text-white" />
                                      </div>
                                      
                                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                                        Upload {doc.name}
                                      </h4>
                                      <p className="text-gray-600 mb-4 group-hover:text-purple-600 transition-colors">
                                        Click here or drag and drop your file
                                      </p>
                                      
                                      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-red-600" />
                                          </div>
                                          <span>PDF</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                          </div>
                                          <span>JPG</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-green-600" />
                                          </div>
                                          <span>PNG</span>
                                        </div>
                                      </div>
                                      
                                      <p className="text-xs text-gray-400 mt-4">
                                        Maximum file size: 10MB
                                      </p>
                                    </div>
                                    
                                    {/* Animated Border */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-20"></div>
                                    </div>
                                  </div>
                                </label>
                                
                                {/* Alternative Upload Button */}
                                <div className="text-center">
                                  <label htmlFor={doc.id}>
                                    <Button 
                                      variant="premium"
                                      size="lg"
                                      className="cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                                      type="button"
                                    >
                                      <Upload className="w-5 h-5 mr-3" />
                                      Choose {doc.name} File
                                      <ArrowRight className="w-5 h-5 ml-3" />
                                    </Button>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl gradient-text">
                    <CheckCircle className="w-6 h-6" />
                    Review & Submit
                  </CardTitle>
                  <p className="text-gray-600">Review your information before submitting</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Business Info Summary */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Business Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Business Name</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {businessForm.getValues('businessName') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Business Type</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {businessForm.getValues('businessType') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Industry</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {businessForm.getValues('industry') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Registration Number</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {businessForm.getValues('registrationNumber') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Tax ID</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {businessForm.getValues('taxId') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Founded Date</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {businessForm.getValues('foundedDate') || 'Not provided'}
                        </p>
                      </div>
                      {businessForm.getValues('website') && (
                        <div className="bg-white rounded-lg p-3 md:col-span-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Website</span>
                          <p className="font-semibold text-gray-900 mt-1">
                            {businessForm.getValues('website')}
                          </p>
                        </div>
                      )}
                      {businessForm.getValues('description') && (
                        <div className="bg-white rounded-lg p-3 md:col-span-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Business Description</span>
                          <p className="font-semibold text-gray-900 mt-1">
                            {businessForm.getValues('description')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info Summary */}
                  <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Contact Name</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {`${contactForm.getValues('contactFirstName') || ''} ${contactForm.getValues('contactLastName') || ''}`.trim() || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Email</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {contactForm.getValues('contactEmail') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Phone</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {contactForm.getValues('contactPhone') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Country</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {contactForm.getValues('country') || 'Not provided'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 md:col-span-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Address</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {[
                            contactForm.getValues('businessAddress'),
                            contactForm.getValues('city'),
                            contactForm.getValues('state'),
                            contactForm.getValues('zipCode')
                          ].filter(Boolean).join(', ') || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Summary */}
                  <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Uploaded Documents
                    </h3>
                    <div className="space-y-3">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              uploadedFiles[doc.id] ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <doc.icon className={`w-5 h-5 ${
                                uploadedFiles[doc.id] ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{doc.name}</span>
                                {doc.required && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Required</Badge>
                                )}
                              </div>
                              {uploadedFiles[doc.id] && (
                                <p className="text-sm text-gray-600">
                                  {uploadedFiles[doc.id].name} • {(uploadedFiles[doc.id].size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {uploadedFiles[doc.id] ? (
                              <>
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-sm font-semibold">
                                  ✓ Uploaded
                                </Badge>
                              </>
                            ) : (
                              <>
                                <X className="w-6 h-6 text-red-600" />
                                <Badge className="bg-red-100 text-red-700 border-red-200 text-sm">
                                  Missing
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-5 h-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-200 mt-0.5"
                        required
                      />
                      <div className="flex-1">
                        <label htmlFor="terms" className="text-sm text-blue-900">
                          I confirm that all information provided is accurate and complete. I understand that providing false information may result in the rejection of this verification request. I agree to the{' '}
                          <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                          </Link>
                          .
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* What Happens Next */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      What Happens Next?
                    </h4>
                    <div className="space-y-3 text-sm text-purple-800">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-700 mt-0.5">1</div>
                        <div>
                          <p className="font-medium">Instant Acknowledgment</p>
                          <p className="text-purple-700">You'll receive an email confirmation immediately after submission</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-700 mt-0.5">2</div>
                        <div>
                          <p className="font-medium">Document Review (1-2 business days)</p>
                          <p className="text-purple-700">Our compliance team will review your submitted documents</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-700 mt-0.5">3</div>
                        <div>
                          <p className="font-medium">Verification Complete</p>
                          <p className="text-purple-700">You'll be notified via email and can access your verification status in the dashboard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {currentStep < 4 ? (
                  <Button 
                    variant="premium" 
                    onClick={handleNext}
                    className="min-w-[120px]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    variant="premium" 
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    className="min-w-[160px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                    {!isSubmitting && <CheckCircle className="w-4 h-4 ml-2" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}