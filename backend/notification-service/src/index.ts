import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'notification-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Talaty Notification Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    capabilities: ['email', 'sms', 'push-notifications']
  });
});

// Basic notification endpoints
app.post('/api/notifications/email', (req, res) => {
  console.log('Email notification request:', req.body);
  res.json({
    success: true,
    message: 'Email notification queued',
    notificationId: 'email_' + Date.now()
  });
});

app.post('/api/notifications/sms', (req, res) => {
  console.log('SMS notification request:', req.body);
  res.json({
    success: true,
    message: 'SMS notification queued',
    notificationId: 'sms_' + Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
  console.log(`📧 Email API: http://localhost:${PORT}/api/notifications/email`);
  console.log(`📱 SMS API: http://localhost:${PORT}/api/notifications/sms`);
});

export default app;
