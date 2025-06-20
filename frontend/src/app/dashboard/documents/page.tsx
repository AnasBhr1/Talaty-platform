'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, FileText, CheckCircle, AlertCircle, Clock, Eye, 
  Download, Trash2, Plus, Search, Filter, MoreHorizontal,
  Building, CreditCard, Briefcase, User, Shield, Calendar
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'

const documentTypes = [
  {
    id: 'business_license',
    name: 'Business License',
    description: 'Official business registration or license',
    icon: Building,
    required: true,
    category: 'Business'
  },
  {
    id: 'tax_certificate',
    name: 'Tax Certificate',
    description: 'Tax identification certificate or EIN letter',
    icon: FileText,
    required: true,
    category: 'Tax'
  },
  {
    id: 'bank_statement',
    name: 'Bank Statement',
    description: 'Recent bank statement (last 3 months)',
    icon: CreditCard,
    required: true,
    category: 'Financial'
  },
  {
    id: 'articles_incorporation',
    name: 'Articles of Incorporation',
    description: 'Corporate formation documents',
    icon: Briefcase,
    required: false,
    category: 'Legal'
  },
  {
    id: 'ownership_docs',
    name: 'Ownership Documents',
    description: 'Proof of ownership or partnership agreements',
    icon: User,
    required: false,
    category: 'Legal'
  },
  {
    id: 'insurance_certificate',
    name: 'Insurance Certificate',
    description: 'Business insurance documentation',
    icon: Shield,
    required: false,
    category: 'Insurance'
  }
]

const mockDocuments = [
  {
    id: '1',
    type: 'business_license',
    name: 'business-license-2024.pdf',
    uploadedAt: '2024-06-14T10:30:00Z',
    status: 'VERIFIED',
    size: 2.5,
    verifiedAt: '2024-06-14T11:00:00Z'
  },
  {
    id: '2',
    type: 'tax_certificate',
    name: 'tax-certificate.pdf',
    uploadedAt: '2024-06-14T09:15:00Z',
    status: 'PENDING',
    size: 1.8,
    verifiedAt: null
  },
  {
    id: '3',
    type: 'bank_statement',
    name: 'bank-statement-march-2024.pdf',
    uploadedAt: '2024-06-13T16:20:00Z',
    status: 'VERIFIED',
    size: 3.2,
    verifiedAt: '2024-06-14T08:45:00Z'
  }
]

export default function DocumentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { toast } = useToast()

  const categories = ['All', 'Business', 'Tax', 'Financial', 'Legal', 'Insurance']

  const handleFileUpload = (documentType: string, file: File) => {
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

    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: file
    }))

    toast({
      title: 'File Uploaded Successfully!',
      description: `${file.name} has been uploaded and is ready for verification`,
      variant: 'success'
    })
  }

  const removeFile = (documentType: string) => {
    const fileName = uploadedFiles[documentType]?.name
    setUploadedFiles(prev => {
      const updated = { ...prev }
      delete updated[documentType]
      return updated
    })
    
    toast({
      title: 'File Removed',
      description: `${fileName} has been removed`,
      variant: 'success'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'REJECTED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return CheckCircle
      case 'PENDING':
        return Clock
      case 'REJECTED':
        return AlertCircle
      default:
        return Clock
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredDocumentTypes = documentTypes.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDocumentForType = (typeId: string) => {
    return mockDocuments.find(doc => doc.type === typeId)
  }

  const requiredDocsCount = documentTypes.filter(doc => doc.required).length
  const uploadedRequiredDocs = documentTypes.filter(doc => 
    doc.required && (getDocumentForType(doc.id) || uploadedFiles[doc.id])
  ).length
  const completionPercentage = (uploadedRequiredDocs / requiredDocsCount) * 100

  return (
    <DashboardLayout title="Documents">
      <div className="space-y-8">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{mockDocuments.length + Object.keys(uploadedFiles).length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockDocuments.filter(doc => doc.status === 'VERIFIED').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockDocuments.filter(doc => doc.status === 'PENDING').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completion</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(completionPercentage)}%</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Requirements Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Document Upload Requirements</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Files must be in PDF, JPG, or PNG format</li>
                      <li>• Maximum file size: 10MB per document</li>
                      <li>• Documents must be clear and readable</li>
                      <li>• All required documents must be uploaded for verification</li>
                    </ul>
                  </div>
                </div>
                <Badge variant="info" className="text-xs">
                  {uploadedRequiredDocs}/{requiredDocsCount} Required
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-6"
        >
          {filteredDocumentTypes.map((docType, index) => {
            const existingDoc = getDocumentForType(docType.id)
            const uploadedFile = uploadedFiles[docType.id]
            const hasDocument = existingDoc || uploadedFile

            return (
              <motion.div
                key={docType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-300 ${hasDocument ? 'border-green-200 bg-green-50/30' : 'hover:shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          hasDocument 
                            ? 'bg-green-100' 
                            : 'bg-gradient-to-br from-purple-100 to-blue-100'
                        }`}>
                          <docType.icon className={`w-6 h-6 ${
                            hasDocument ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{docType.name}</h3>
                            {docType.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{docType.category}</Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{docType.description}</p>
                          
                          {/* Document Status */}
                          {existingDoc && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{existingDoc.name}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span>{formatFileSize(existingDoc.size * 1024 * 1024)}</span>
                                      <span>•</span>
                                      <span>Uploaded {formatDate(existingDoc.uploadedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <Badge variant={getStatusColor(existingDoc.status)}>
                                    {existingDoc.status}
                                  </Badge>
                                  
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              {existingDoc.verifiedAt && (
                                <div className="flex items-center text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verified on {formatDate(existingDoc.verifiedAt)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Uploaded File Preview */}
                          {uploadedFile && !existingDoc && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                                    <p className="text-sm text-blue-600">
                                      {formatFileSize(uploadedFile.size)} • Ready for submission
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(docType.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Upload Section */}
                      {!hasDocument && (
                        <div className="ml-4">
                          <input
                            type="file"
                            id={`upload-${docType.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(docType.id, file)
                              }
                            }}
                            className="hidden"
                          />
                          <label htmlFor={`upload-${docType.id}`}>
                            <Button
                              variant="default"
                              className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                              asChild
                            >
                              <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </span>
                            </Button>
                          </label>
                        </div>
                      )}
                      
                      {/* Replace Document */}
                      {hasDocument && (
                        <div className="ml-4">
                          <input
                            type="file"
                            id={`replace-${docType.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(docType.id, file)
                              }
                            }}
                            className="hidden"
                          />
                          <label htmlFor={`replace-${docType.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              asChild
                            >
                              <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Replace
                              </span>
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bulk Actions */}
        {Object.keys(uploadedFiles).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        {Object.keys(uploadedFiles).length} document(s) ready for submission
                      </h3>
                      <p className="text-green-700">
                        Your documents will be processed for verification once submitted.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setUploadedFiles({})}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
                    >
                      Submit for Verification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Need Help with Documents?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our support team can help you understand what documents are needed 
                  and assist with any upload issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Contact Support
                  </Button>
                  <Button variant="outline">
                    View Upload Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}