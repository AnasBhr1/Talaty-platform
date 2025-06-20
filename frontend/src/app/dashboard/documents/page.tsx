'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Upload, Download, Eye, Trash2, CheckCircle, AlertCircle,
  Clock, X, Search, Menu, Bell, LogOut, ChevronRight, Sparkles,
  Shield, Home, User, BarChart, Cog, HelpCircle, Plus, Filter,
  FileCheck, FilePlus, Calendar, AlertTriangle, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
  { name: 'Profile', href: '/dashboard/profile', icon: User, current: false },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText, current: true },
  { name: 'Scoring', href: '/dashboard/scoring', icon: BarChart, current: false },
  { name: 'Settings', href: '/settings', icon: Cog, current: false },
  { name: 'Support', href: '/support', icon: HelpCircle, current: false },
]

const mockDocuments = [
  {
    id: '1',
    name: 'Business License',
    type: 'business_license',
    status: 'VERIFIED',
    uploadedAt: '2024-06-10T10:30:00Z',
    size: '2.4 MB',
    format: 'PDF',
    required: true,
    expiryDate: '2025-06-10',
    verifiedAt: '2024-06-11T09:15:00Z'
  },
  {
    id: '2',
    name: 'Tax Identification Document',
    type: 'tax_id',
    status: 'VERIFIED',
    uploadedAt: '2024-06-09T14:20:00Z',
    size: '1.8 MB',
    format: 'PDF',
    required: true,
    expiryDate: null,
    verifiedAt: '2024-06-10T11:30:00Z'
  },
  {
    id: '3',
    name: 'Bank Statement',
    type: 'bank_statement',
    status: 'PENDING',
    uploadedAt: '2024-06-12T16:45:00Z',
    size: '3.2 MB',
    format: 'PDF',
    required: true,
    expiryDate: null,
    verifiedAt: null
  },
  {
    id: '4',
    name: 'Articles of Incorporation',
    type: 'articles_incorporation',
    status: 'REJECTED',
    uploadedAt: '2024-06-08T11:10:00Z',
    size: '1.5 MB',
    format: 'PDF',
    required: true,
    expiryDate: null,
    verifiedAt: null,
    rejectionReason: 'Document quality is poor. Please upload a clearer version.'
  },
  {
    id: '5',
    name: 'Ownership Structure',
    type: 'ownership_structure',
    status: 'NOT_UPLOADED',
    uploadedAt: null,
    size: null,
    format: null,
    required: true,
    expiryDate: null,
    verifiedAt: null
  },
  {
    id: '6',
    name: 'Financial Statements',
    type: 'financial_statements',
    status: 'NOT_UPLOADED',
    uploadedAt: null,
    size: null,
    format: null,
    required: false,
    expiryDate: null,
    verifiedAt: null
  }
]

const documentCategories = [
  { id: 'all', name: 'All Documents', count: 6 },
  { id: 'required', name: 'Required', count: 5 },
  { id: 'verified', name: 'Verified', count: 2 },
  { id: 'pending', name: 'Pending', count: 1 },
  { id: 'rejected', name: 'Rejected', count: 1 },
  { id: 'missing', name: 'Missing', count: 2 }
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

function DocumentCard({ document, onView, onDownload, onDelete, onReupload }: {
  document: any
  onView: (doc: any) => void
  onDownload: (doc: any) => void
  onDelete: (doc: any) => void
  onReupload: (doc: any) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'NOT_UPLOADED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4" />
      case 'NOT_UPLOADED':
        return <Upload className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{document.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getStatusColor(document.status)}>
                  {getStatusIcon(document.status)}
                  <span className="ml-1">{document.status.replace('_', ' ')}</span>
                </Badge>
                {document.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              {document.uploadedAt && (
                <p className="text-xs text-gray-500">
                  Uploaded: {formatDate(document.uploadedAt)}
                </p>
              )}
              {document.size && (
                <p className="text-xs text-gray-500">
                  Size: {document.size} • Format: {document.format}
                </p>
              )}
              {document.expiryDate && (
                <p className="text-xs text-orange-600">
                  Expires: {formatDate(document.expiryDate)}
                </p>
              )}
              {document.rejectionReason && (
                <p className="text-xs text-red-600 mt-2">
                  Rejection reason: {document.rejectionReason}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {document.status !== 'NOT_UPLOADED' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(document)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(document)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </>
            )}
            {(document.status === 'REJECTED' || document.status === 'NOT_UPLOADED') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReupload(document)}
              >
                <Upload className="w-4 h-4 mr-1" />
                {document.status === 'NOT_UPLOADED' ? 'Upload' : 'Re-upload'}
              </Button>
            )}
          </div>
          {document.status !== 'NOT_UPLOADED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(document)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'required' && doc.required) ||
      (selectedCategory === 'verified' && doc.status === 'VERIFIED') ||
      (selectedCategory === 'pending' && doc.status === 'PENDING') ||
      (selectedCategory === 'rejected' && doc.status === 'REJECTED') ||
      (selectedCategory === 'missing' && doc.status === 'NOT_UPLOADED')
    
    return matchesSearch && matchesCategory
  })

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Upload Successful',
        description: `${files.length} document(s) uploaded successfully.`,
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleView = (document: any) => {
    // Open document viewer
    toast({
      title: 'Opening Document',
      description: `Opening ${document.name}...`,
    })
  }

  const handleDownload = (document: any) => {
    // Download document
    toast({
      title: 'Download Started',
      description: `Downloading ${document.name}...`,
    })
  }

  const handleDelete = (document: any) => {
    // Delete document
    toast({
      title: 'Document Deleted',
      description: `${document.name} has been deleted.`,
      variant: 'destructive',
    })
  }

  const handleReupload = (document: any) => {
    fileInputRef.current?.click()
  }

  const completionPercentage = Math.round((mockDocuments.filter(doc => doc.status === 'VERIFIED').length / mockDocuments.filter(doc => doc.required).length) * 100)

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
                  <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                  <p className="text-sm text-gray-500">
                    Manage your verification documents
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white border-0">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Document Verification Progress</h2>
                      <p className="text-lg opacity-90 mb-4">
                        {mockDocuments.filter(doc => doc.status === 'VERIFIED').length} of {mockDocuments.filter(doc => doc.required).length} required documents verified
                      </p>
                      <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                        <div 
                          className="bg-white h-3 rounded-full transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm opacity-80">{completionPercentage}% Complete</p>
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-right">
                        <div className="text-4xl font-bold mb-2">
                          {mockDocuments.filter(doc => doc.status === 'VERIFIED').length}
                        </div>
                        <div className="text-sm opacity-80">Verified Documents</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                    Upload Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isUploading ? (
                        <RefreshCw className="w-8 h-8 text-gray-600 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Supported formats: PDF, JPG, PNG • Max size: 10MB
                    </p>
                    <Button disabled={isUploading}>
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {documentCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </motion.div>

            {/* Documents Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <DocumentCard
                    document={document}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onReupload={handleReupload}
                  />
                </motion.div>
              ))}
            </motion.div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'Start by uploading your first document'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}