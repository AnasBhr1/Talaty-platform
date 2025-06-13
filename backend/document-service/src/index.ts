import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

import { 
  corsOptions, 
  requestLogger, 
  errorHandler, 
  generalRateLimit,
  securityHeaders,
  healthCheck,
  logger 
} from '../../shared/middleware';
import documentRoutes from './routes/document.routes';

const app = express();
const PORT = process.env.PORT || 3003;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Talaty Document Service API',
      version: '1.0.0',
      description: 'Document upload and management service for Talaty platform',
      contact: {
        name: 'Talaty Support',
        email: 'support@talaty.app',
        url: 'https://talaty.app'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.talaty.app/documents' 
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Invalid or expired token' },
                  error: { type: 'string', example: 'INVALID_TOKEN' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Documents',
        description: 'Document upload and management operations'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

const specs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(requestLogger);
app.use(securityHeaders);
app.use(generalRateLimit);

// Health check
app.get('/health', healthCheck('document-service'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Talaty Document Service API',
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Routes
app.use('/api/documents', documentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Talaty Document Service',
    version: '1.0.0',
    status: 'running',
    documentation: '/api-docs',
    health: '/health',
    timestamp: new Date().toISOString(),
    endpoints: {
      upload: '/api/documents/upload',
      list: '/api/documents',
      stats: '/api/documents/stats'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    error: 'ROUTE_NOT_FOUND',
    service: 'document-service',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Document Service running on port ${PORT}`);
  logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Document service terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Document service terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;