const crypto = require('crypto');

console.log('=== PRODUCTION SECRETS ===');
console.log('Copy these into your .env.production file:');
console.log('');

// Generate JWT Secret (256 bits)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(`JWT_SECRET=${jwtSecret}`);

// Generate Refresh Secret (256 bits)
const refreshSecret = crypto.randomBytes(32).toString('hex');
console.log(`JWT_REFRESH_SECRET=${refreshSecret}`);

// Generate Encryption Key (32 bytes)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);

// Generate Session Secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log(`SESSION_SECRET=${sessionSecret}`);

console.log('');
console.log('⚠️  IMPORTANT: Save these secrets securely!');
console.log('⚠️  Never share these or commit them to version control!');
console.log('⚠️  You will need these to decrypt existing data!');

// Generate a sample strong password
const samplePassword = crypto.randomBytes(16).toString('base64');
console.log('');
console.log(`Sample strong password: ${samplePassword}`);
console.log('Use this pattern for database passwords, etc.');

// Generate API keys format
console.log('');
console.log('=== API KEY FORMATS ===');
const apiKeyFormat = 'prod_' + crypto.randomBytes(24).toString('hex');
console.log(`Sample API key format: ${apiKeyFormat}`);