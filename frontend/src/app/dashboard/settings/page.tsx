'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, User, Bell, Shield, CreditCard, Globe, 
  Mail, Phone, Lock, Eye, EyeOff, Save, Trash2,
  Key, Smartphone, Monitor, Download, Upload
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your personal information and preferences',
    icon: User,
    color: 'text-blue-600'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Password, two-factor authentication, and privacy settings',
    icon: Shield,
    color: 'text-green-600'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email and push notification preferences',
    icon: Bell,
    color: 'text-yellow-600'
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    description: 'Manage your subscription and payment methods',
    icon: CreditCard,
    color: 'text-purple-600'
  },
  {
    id: 'api',
    title: 'API & Integrations',
    description: 'API keys and third-party integrations',
    icon: Globe,
    color: 'text-indigo-600'
  }
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'en'
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true
  })

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    verificationUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New passwords do not match.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
        variant: 'success',
      })
      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      toast({
        title: 'Password Change Failed',
        description: 'Failed to change password. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter your first name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="flex space-x-2">
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            icon={<Mail className="w-4 h-4" />}
          />
          <Badge variant="success" className="self-center">Verified</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex space-x-2">
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your phone number"
            icon={<Phone className="w-4 h-4" />}
          />
          <Badge variant="warning" className="self-center">Unverified</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <select
            id="timezone"
            value={profileData.timezone}
            onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={profileData.language}
            onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          loading={isLoading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            loading={isLoading}
            variant="outline"
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={securityData.twoFactorEnabled ? 'success' : 'secondary'}>
                {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSecurityData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
              >
                {securityData.twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { device: 'Chrome on MacBook Pro', location: 'New York, NY', current: true, lastActive: '2 minutes ago' },
              { device: 'Safari on iPhone 15', location: 'New York, NY', current: false, lastActive: '2 hours ago' },
              { device: 'Chrome on Windows PC', location: 'Los Angeles, CA', current: false, lastActive: '1 day ago' }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{session.device} {session.current && <Badge variant="success" className="ml-2">Current</Badge>}</p>
                    <p className="text-sm text-gray-600">{session.location} • {session.lastActive}</p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email notifications', description: 'Receive notifications via email' },
            { key: 'verificationUpdates', label: 'Verification updates', description: 'Updates about your verification status' },
            { key: 'securityAlerts', label: 'Security alerts', description: 'Important security notifications' },
            { key: 'marketingEmails', label: 'Marketing emails', description: 'Product updates and promotional content' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationData[setting.key as keyof typeof notificationData]}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push & SMS Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'pushNotifications', label: 'Push notifications', description: 'Receive push notifications on your devices' },
            { key: 'smsNotifications', label: 'SMS notifications', description: 'Receive important updates via SMS' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationData[setting.key as keyof typeof notificationData]}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">Professional Plan</h3>
              <p className="text-gray-600">$299/month • 5,000 verifications included</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="mt-4 flex space-x-3">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">View Usage</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="success">Default</Badge>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Jun 1, 2024', amount: '$299.00', status: 'Paid', invoice: 'INV-001' },
              { date: 'May 1, 2024', amount: '$299.00', status: 'Paid', invoice: 'INV-002' },
              { date: 'Apr 1, 2024', amount: '$299.00', status: 'Paid', invoice: 'INV-003' }
            ].map((bill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{bill.invoice}</p>
                  <p className="text-sm text-gray-600">{bill.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{bill.amount}</span>
                  <Badge variant="success">{bill.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAPISettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Keep your API keys secure and never share them publicly.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Test API Key</p>
                  <p className="text-sm text-gray-600 font-mono">pk_test_••••••••••••••••••••</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline">
              <Key className="w-4 h-4 mr-2" />
              Create New API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Configure webhook endpoints to receive real-time notifications about verification events.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">https://api.yourapp.com/webhooks/talaty</p>
                  <p className="text-sm text-gray-600">verification.completed, verification.failed</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="success">Active</Badge>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Add Webhook Endpoint
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Access comprehensive API documentation and code examples to integrate Talaty into your application.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline">
                View Documentation
              </Button>
              <Button variant="outline">
                Download SDK
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'billing':
        return renderBillingSettings()
      case 'api':
        return renderAPISettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <DashboardLayout title="Settings">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-r-2 border-purple-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <section.icon className={`w-5 h-5 ${
                      activeSection === section.id ? 'text-purple-600' : section.color
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{section.title}</p>
                      <p className="text-xs text-gray-500 truncate">{section.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settingsSections.find(s => s.id === activeSection)?.icon && (
                  <settingsSections.find(s => s.id === activeSection)!.icon 
                    className={`w-5 h-5 ${settingsSections.find(s => s.id === activeSection)!.color}`} 
                  />
                )}
                {settingsSections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {settingsSections.find(s => s.id === activeSection)?.description}
              </p>
            </CardHeader>
            <CardContent>
              {renderActiveSection()}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">Delete Account</p>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: 'Account Deletion',
                      description: 'Account deletion is not available in demo mode.',
                      variant: 'info',
                    })
                  }}
                >
                  Delete Account
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">Export Data</p>
                  <p className="text-sm text-red-600">
                    Download a copy of all your data before deleting your account.
                  </p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}
                <div>
                  <p className="font-medium">Production API Key</p>
                  <p className="text-sm text-gray-600 font-mono">pk_live_••••••••••••••••••••</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg"></div>