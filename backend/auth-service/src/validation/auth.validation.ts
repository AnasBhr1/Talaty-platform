import Joi from 'joi';

// Password validation regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Phone validation regex: international format
const phoneRegex = /^\+?[\d\s\-()]{10,}$/;

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      'any.required': 'Password is required'
    }),
    
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    
  phone: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    
  businessName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
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
    .messages({
      'any.only': 'Please select a valid business type'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

export const verifyEmailSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required'
    })
});

export const passwordResetSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

export const passwordResetConfirmSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),
    
  newPassword: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      'any.required': 'New password is required'
    })
});