import Joi from 'joi';

// Phone validation regex: international format
const phoneRegex = /^\+?[\d\s\-()]{10,}$/;

export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
    
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
    
  phone: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    
  businessName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Business name must be at least 2 characters long',
      'string.max': 'Business name cannot exceed 100 characters'
    }),
    
  businessType: Joi.string()
    .trim()
    .valid(
      'SOLE_PROPRIETORSHIP',
      'PARTNERSHIP',
      'CORPORATION',
      'LLC',
      'NONPROFIT',
      'COOPERATIVE',
      'OTHER'
    )
    .optional()
    .allow('')
    .messages({
      'any.only': 'Please select a valid business type'
    }),
    
  registrationNumber: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Registration number must be at least 3 characters long',
      'string.max': 'Registration number cannot exceed 50 characters'
    }),
    
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 200 characters'
    }),
    
  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City cannot exceed 100 characters'
    }),
    
  state: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State cannot exceed 100 characters'
    }),
    
  country: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country cannot exceed 100 characters'
    }),
    
  postalCode: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Postal code must be at least 3 characters long',
      'string.max': 'Postal code cannot exceed 20 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const updateEKycStatusSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'SUSPENDED')
    .required()
    .messages({
      'any.only': 'Status must be one of: PENDING, IN_PROGRESS, UNDER_REVIEW, COMPLETED, REJECTED, SUSPENDED',
      'any.required': 'Status is required'
    }),
    
  reason: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Reason cannot exceed 500 characters'
    })
});

export const deleteAccountSchema = Joi.object({
  confirmPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Password confirmation is required to delete account'
    }),
    
  confirmation: Joi.string()
    .valid('DELETE')
    .required()
    .messages({
      'any.only': 'Please type "DELETE" to confirm account deletion',
      'any.required': 'Confirmation is required'
    })
});

export const activityLogQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
    
  action: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Action filter must be a string'
    }),
    
  resource: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Resource filter must be a string'
    }),
    
  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),
    
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    })
});

export const businessVerificationSchema = Joi.object({
  businessName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Business name must be at least 2 characters long',
      'string.max': 'Business name cannot exceed 100 characters',
      'any.required': 'Business name is required'
    }),
    
  registrationNumber: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Registration number must be at least 3 characters long',
      'string.max': 'Registration number cannot exceed 50 characters',
      'any.required': 'Registration number is required'
    }),
    
  businessType: Joi.string()
    .valid(
      'SOLE_PROPRIETORSHIP',
      'PARTNERSHIP',
      'CORPORATION',
      'LLC',
      'NONPROFIT',
      'COOPERATIVE',
      'OTHER'
    )
    .optional()
    .messages({
      'any.only': 'Please select a valid business type'
    })
});

export const addressValidationSchema = Joi.object({
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 200 characters',
      'any.required': 'Address is required'
    }),
    
  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City cannot exceed 100 characters',
      'any.required': 'City is required'
    }),
    
  state: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State cannot exceed 100 characters'
    }),
    
  country: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country cannot exceed 100 characters',
      'any.required': 'Country is required'
    }),
    
  postalCode: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Postal code must be at least 3 characters long',
      'string.max': 'Postal code cannot exceed 20 characters'
    })
});

export const emergencyContactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Emergency contact name must be at least 2 characters long',
      'string.max': 'Emergency contact name cannot exceed 100 characters',
      'any.required': 'Emergency contact name is required'
    }),
    
  relationship: Joi.string()
    .trim()
    .valid('SPOUSE', 'PARENT', 'SIBLING', 'CHILD', 'FRIEND', 'COLLEAGUE', 'OTHER')
    .required()
    .messages({
      'any.only': 'Please select a valid relationship',
      'any.required': 'Relationship is required'
    }),
    
  phone: Joi.string()
    .pattern(phoneRegex)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Emergency contact phone is required'
    }),
    
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    })
});

export const preferencesSchema = Joi.object({
  language: Joi.string()
    .valid('en', 'es', 'fr', 'de', 'it', 'pt', 'ar')
    .default('en')
    .messages({
      'any.only': 'Please select a supported language'
    }),
    
  timezone: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Timezone must be a string'
    }),
    
  currency: Joi.string()
    .valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR')
    .default('USD')
    .messages({
      'any.only': 'Please select a supported currency'
    }),
    
  notifications: Joi.object({
    email: Joi.boolean().default(true),
    sms: Joi.boolean().default(false),
    push: Joi.boolean().default(true),
    marketing: Joi.boolean().default(false)
  }).default({
    email: true,
    sms: false,
    push: true,
    marketing: false
  }),
    
  privacy: Joi.object({
    profileVisibility: Joi.string()
      .valid('PUBLIC', 'PRIVATE', 'CONTACTS_ONLY')
      .default('PRIVATE'),
    dataSharing: Joi.boolean().default(false),
    analyticsOptOut: Joi.boolean().default(false)
  }).default({
    profileVisibility: 'PRIVATE',
    dataSharing: false,
    analyticsOptOut: false
  })
});