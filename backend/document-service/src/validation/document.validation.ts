import Joi from 'joi';

export const uploadDocumentSchema = Joi.object({
  documentType: Joi.string()
    .valid(
      'ID_CARD',
      'PASSPORT',
      'DRIVERS_LICENSE',
      'BUSINESS_LICENSE',
      'TAX_CERTIFICATE',
      'BANK_STATEMENT',
      'UTILITY_BILL',
      'PROOF_OF_ADDRESS',
      'REGISTRATION_CERTIFICATE',
      'FINANCIAL_STATEMENT',
      'MEMORANDUM_OF_ASSOCIATION',
      'ARTICLES_OF_INCORPORATION',
      'BOARD_RESOLUTION',
      'POWER_OF_ATTORNEY',
      'OTHER'
    )
    .required()
    .messages({
      'any.only': 'Please select a valid document type',
      'any.required': 'Document type is required'
    })
});

export const getUploadUrlSchema = Joi.object({
  fileName: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'File name is required',
      'string.max': 'File name cannot exceed 255 characters',
      'any.required': 'File name is required'
    }),
    
  fileType: Joi.string()
    .valid(
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    .required()
    .messages({
      'any.only': 'File type not supported',
      'any.required': 'File type is required'
    }),
    
  documentType: Joi.string()
    .valid(
      'ID_CARD',
      'PASSPORT',
      'DRIVERS_LICENSE',
      'BUSINESS_LICENSE',
      'TAX_CERTIFICATE',
      'BANK_STATEMENT',
      'UTILITY_BILL',
      'PROOF_OF_ADDRESS',
      'REGISTRATION_CERTIFICATE',
      'FINANCIAL_STATEMENT',
      'OTHER'
    )
    .required()
    .messages({
      'any.only': 'Please select a valid document type',
      'any.required': 'Document type is required'
    })
});

export const confirmUploadSchema = Joi.object({
  s3Key: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.min': 'S3 key is required',
      'any.required': 'S3 key is required'
    }),
    
  originalName: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Original file name is required',
      'string.max': 'File name cannot exceed 255 characters',
      'any.required': 'Original file name is required'
    }),
    
  documentType: Joi.string()
    .valid(
      'ID_CARD',
      'PASSPORT',
      'DRIVERS_LICENSE',
      'BUSINESS_LICENSE',
      'TAX_CERTIFICATE',
      'BANK_STATEMENT',
      'UTILITY_BILL',
      'PROOF_OF_ADDRESS',
      'REGISTRATION_CERTIFICATE',
      'FINANCIAL_STATEMENT',
      'OTHER'
    )
    .required()
    .messages({
      'any.only': 'Please select a valid document type',
      'any.required': 'Document type is required'
    }),
    
  fileSize: Joi.number()
    .positive()
    .max(parseInt(process.env.MAX_FILE_SIZE || '10485760'))
    .required()
    .messages({
      'number.positive': 'File size must be positive',
      'number.max': 'File size exceeds maximum allowed size',
      'any.required': 'File size is required'
    })
});

export const updateDocumentStatusSchema = Joi.object({
  status: Joi.string()
    .valid('UPLOADED', 'PROCESSING', 'VERIFIED', 'REJECTED', 'EXPIRED', 'PENDING_REVIEW', 'REQUIRES_ACTION')
    .required()
    .messages({
      'any.only': 'Invalid document status',
      'any.required': 'Status is required'
    }),
    
  rejectionReason: Joi.string()
    .trim()
    .max(500)
    .when('status', {
      is: 'REJECTED',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'string.max': 'Rejection reason cannot exceed 500 characters',
      'any.required': 'Rejection reason is required when status is REJECTED'
    })
});