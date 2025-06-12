export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Talaty Auth Service API',
      version: '1.0.0',
      description: 'Authentication and authorization microservice for the Talaty platform',
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
          ? 'https://api.talaty.app' 
          : `http://localhost:${process.env.PORT || 3001}`,
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
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid or expired token'
                  },
                  error: {
                    type: 'string',
                    example: 'INVALID_TOKEN'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  message: {
                    type: 'string',
                    example: 'Validation failed'
                  },
                  error: {
                    type: 'string',
                    example: 'Email is required'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        RateLimitError: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  message: {
                    type: 'string',
                    example: 'Too many requests, please try again later'
                  },
                  error: {
                    type: 'string',
                    example: 'RATE_LIMIT_EXCEEDED'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  message: {
                    type: 'string',
                    example: 'Internal server error'
                  },
                  error: {
                    type: 'string',
                    example: 'INTERNAL_ERROR'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization operations'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};