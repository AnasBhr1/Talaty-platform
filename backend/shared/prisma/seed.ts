import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create test users
  const hashedPassword = await bcrypt.hash('Test123!@#', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      businessName: 'Test Business LLC',
      businessType: 'LLC',
      phone: '+1234567890',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      postalCode: '12345',
      isVerified: true,
      emailVerifiedAt: new Date(),
    }
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@talaty.app' },
    update: {},
    create: {
      email: 'admin@talaty.app',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      businessName: 'Talaty Platform',
      businessType: 'CORPORATION',
      isVerified: true,
      emailVerifiedAt: new Date(),
      eKycStatus: 'COMPLETED',
      score: 95
    }
  })

  // Create system settings
  const settings = [
    { key: 'maintenance_mode', value: 'false', type: 'boolean', description: 'Enable maintenance mode' },
    { key: 'max_upload_size', value: '10485760', type: 'number', description: 'Maximum file upload size in bytes' },
    { key: 'allowed_file_types', value: 'image/jpeg,image/png,application/pdf', type: 'string', description: 'Allowed file types for upload' },
    { key: 'email_verification_required', value: 'true', type: 'boolean', description: 'Require email verification for new users' },
    { key: 'default_score_threshold', value: '70', type: 'number', description: 'Default score threshold for approval' }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('📝 Test user created: test@example.com (password: Test123!@#)')
  console.log('👤 Admin user created: admin@talaty.app (password: Test123!@#)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })