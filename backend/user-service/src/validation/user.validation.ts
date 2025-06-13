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