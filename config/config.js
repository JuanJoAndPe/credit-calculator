require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.NODE_PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD || '',
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbUrl: process.env.DATABASE_URL || '',
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtRecoverySecret: process.env.JWT_RECOVERY_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASS,
  emailPort: process.env.EMAIL_PORT,
  emailHost: process.env.EMAIL_HOST,
};

module.exports = { config };
