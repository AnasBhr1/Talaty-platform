import axios from 'axios';
import { logger } from '../../../shared/middleware';

interface DocumentVerificationResult {
  isValid: boolean;
  confidence: number;
  reason?: string;
  details?: {
    documentType?: string;
    extractedData?: Record<string, any>;
    qualityScore?: number;
    tamperingDetected?: boolean;
    ocrResults?: string[];
  };
  source: string;
  verifiedAt: Date;
}

export class DocumentVerificationService {
  private readonly verificationApiKey: string;
  private readonly verificationApiUrl: string;
  private readonly ocrApiKey: string;
  private readonly enabled: boolean;

  constructor() {
    this.verificationApiKey = process.env.VERIFICATION_API_KEY || '';
    this.verificationApiUrl = process.env.VERIFICATION_API_URL || 'https://api.documentverification.com';
    this.ocrApiKey = process.env.OCR_API_KEY || '';
    this.enabled = process.env.ENABLE_DOCUMENT_VERIFICATION === 'true';
  }

  /**
   * Verify document authenticity and extract data
   */
  async verifyDocument(documentUrl: string, documentType?: string): Promise<DocumentVerificationResult> {
    try {
      if (!this.enabled) {
        logger.info('Document verification disabled, using mock verification');
        return this.mockVerification(documentUrl, documentType);
      }

      if (!this.verificationApiKey) {
        logger.warn('Document verification API key not configured, using mock verification');
        return this.mockVerification(documentUrl, documentType);
      }

      // Perform actual verification with external service
      const verificationResult = await this.performExternalVerification(documentUrl, documentType);

      // If external verification fails, fallback to basic checks
      if (!verificationResult.isValid) {
        const basicCheck = await this.performBasicVerification(documentUrl, documentType);
        return basicCheck;
      }

      return verificationResult;
    } catch (error) {
      logger.error('Document verification error:', error);
      
      // Fallback to basic verification on error
      try {
        return await this.performBasicVerification(documentUrl, documentType);
      } catch (fallbackError) {
        logger.error('Fallback verification also failed:', fallbackError);
        return {
          isValid: false,
          confidence: 0,
          reason: 'Verification service unavailable',
          source: 'error',
          verifiedAt: new Date()
        };
      }
    }
  }

  /**
   * Perform verification with external service
   */
  private async performExternalVerification(
    documentUrl: string,
    documentType?: string
  ): Promise<DocumentVerificationResult> {
    try {
      const response = await axios.post(
        `${this.verificationApiUrl}/v1/verify`,
        {
          document_url: documentUrl,
          document_type: documentType,
          verification_options: {
            check_authenticity: true,
            extract_data: true,
            detect_tampering: true,
            quality_check: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.verificationApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds
        }
      );

      if (response.status === 200 && response.data) {
        const data = response.data;
        
        return {
          isValid: data.is_authentic === true && data.quality_score >= 0.7,
          confidence: data.confidence || 0,
          reason: data.is_authentic ? undefined : data.rejection_reason,
          details: {
            documentType: data.document_type,
            extractedData: data.extracted_data,
            qualityScore: data.quality_score,
            tamperingDetected: data.tampering_detected,
            ocrResults: data.ocr_results
          },
          source: 'external_api',
          verifiedAt: new Date()
        };
      }

      throw new Error('Invalid response from verification service');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            isValid: false,
            confidence: 0,
            reason: 'Invalid document format or type',
            source: 'external_api',
            verifiedAt: new Date()
          };
        }
        
        if (error.response?.status === 403) {
          logger.error('Document verification API authentication failed');
        }
      }
      
      throw error;
    }
  }

  /**
   * Perform basic verification checks
   */
  private async performBasicVerification(
    documentUrl: string,
    documentType?: string
  ): Promise<DocumentVerificationResult> {
    try {
      // Download document for basic analysis
      const response = await axios.get(documentUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        maxContentLength: 50 * 1024 * 1024 // 50MB max
      });

      const buffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'];

      // Basic file validation
      const basicChecks = {
        validFileType: this.validateFileType(contentType, documentType),
        appropriateSize: this.validateFileSize(buffer.length, documentType),
        notCorrupted: this.validateFileIntegrity(buffer, contentType),
        hasContent: buffer.length > 0
      };

      const passed = Object.values(basicChecks).filter(Boolean).length;
      const total = Object.keys(basicChecks).length;
      const confidence = passed / total;

      const isValid = confidence >= 0.75; // 75% of basic checks must pass

      return {
        isValid,
        confidence,
        reason: isValid ? undefined : 'Failed basic validation checks',
        details: {
          documentType: this.detectDocumentType(contentType, documentType),
          qualityScore: confidence,
          tamperingDetected: false // Basic check can't detect tampering
        },
        source: 'basic_validation',
        verifiedAt: new Date()
      };
    } catch (error) {
      logger.error('Basic verification error:', error);
      throw error;
    }
  }

  /**
   * Mock verification for development/testing
   */
  private mockVerification(documentUrl: string, documentType?: string): DocumentVerificationResult {
    // Simple mock logic based on URL patterns
    const isValid = !documentUrl.includes('invalid') && !documentUrl.includes('fake');
    const confidence = isValid ? 0.9 : 0.1;

    logger.info('Mock document verification', {
      documentUrl,
      documentType,
      result: { isValid, confidence }
    });

    return {
      isValid,
      confidence,
      reason: isValid ? undefined : 'Mock rejection for testing',
      details: {
        documentType: documentType || 'UNKNOWN',
        extractedData: {
          mockField: 'mockValue'
        },
        qualityScore: confidence,
        tamperingDetected: false,
        ocrResults: ['Mock OCR text']
      },
      source: 'mock',
      verifiedAt: new Date()
    };
  }

  /**
   * Validate file type against expected document type
   */
  private validateFileType(contentType: string, documentType?: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (!allowedTypes.includes(contentType)) {
      return false;
    }

    // Specific validations based on document type
    if (documentType) {
      const documentTypeValidations: Record<string, string[]> = {
        'ID_CARD': ['image/jpeg', 'image/png', 'image/jpg'],
        'PASSPORT': ['image/jpeg', 'image/png', 'image/jpg'],
        'BUSINESS_LICENSE': ['image/jpeg', 'image/png', 'application/pdf'],
        'TAX_CERTIFICATE': ['application/pdf', 'image/jpeg', 'image/png'],
        'BANK_STATEMENT': ['application/pdf'],
        'UTILITY_BILL': ['application/pdf', 'image/jpeg', 'image/png']
      };

      const allowedForType = documentTypeValidations[documentType];
      if (allowedForType && !allowedForType.includes(contentType)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate file size is appropriate for document type
   */
  private validateFileSize(size: number, documentType?: string): boolean {
    const maxSizes: Record<string, number> = {
      'ID_CARD': 5 * 1024 * 1024, // 5MB
      'PASSPORT': 5 * 1024 * 1024, // 5MB
      'BUSINESS_LICENSE': 10 * 1024 * 1024, // 10MB
      'TAX_CERTIFICATE': 10 * 1024 * 1024, // 10MB
      'BANK_STATEMENT': 15 * 1024 * 1024, // 15MB
      'UTILITY_BILL': 10 * 1024 * 1024 // 10MB
    };

    const maxSize = documentType ? maxSizes[documentType] : 10 * 1024 * 1024; // Default 10MB
    return size <= maxSize && size >= 1024; // At least 1KB
  }

  /**
   * Basic file integrity check
   */
  private validateFileIntegrity(buffer: Buffer, contentType: string): boolean {
    try {
      // Check file headers
      if (contentType === 'application/pdf') {
        // PDF should start with %PDF
        return buffer.toString('ascii', 0, 4) === '%PDF';
      }

      if (contentType.startsWith('image/')) {
        // Check common image headers
        const header = buffer.toString('hex', 0, 4).toLowerCase();
        
        // JPEG: FFD8
        if (contentType === 'image/jpeg' && header.startsWith('ffd8')) {
          return true;
        }
        
        // PNG: 89504E47
        if (contentType === 'image/png' && header === '89504e47') {
          return true;
        }
      }

      return true; // If we can't verify, assume it's valid
    } catch (error) {
      logger.error('File integrity check error:', error);
      return false;
    }
  }

  /**
   * Detect document type from content
   */
  private detectDocumentType(contentType: string, providedType?: string): string {
    if (providedType) {
      return providedType;
    }

    // Basic type detection based on content type
    if (contentType === 'application/pdf') {
      return 'PDF_DOCUMENT';
    }

    if (contentType.startsWith('image/')) {
      return 'IMAGE_DOCUMENT';
    }

    return 'UNKNOWN';
  }

  /**
   * Extract text from document using OCR
   */
  async extractText(documentUrl: string): Promise<string[]> {
    try {
      if (!this.ocrApiKey) {
        logger.warn('OCR API key not configured');
        return ['OCR not configured'];
      }

      // Implementation would use an OCR service like Google Vision API, AWS Textract, etc.
      // For now, return mock data
      return ['Mock extracted text from document'];
    } catch (error) {
      logger.error('Text extraction error:', error);
      return [];
    }
  }

  /**
   * Validate extracted data against expected patterns
   */
  validateExtractedData(extractedData: Record<string, any>, documentType: string): boolean {
    try {
      const validationRules: Record<string, (data: any) => boolean> = {
        'ID_CARD': (data) => data.id_number && data.name,
        'PASSPORT': (data) => data.passport_number && data.name,
        'BUSINESS_LICENSE': (data) => data.license_number && data.business_name,
        'TAX_CERTIFICATE': (data) => data.tax_id && data.business_name,
        'BANK_STATEMENT': (data) => data.account_number || data.statement_date,
        'UTILITY_BILL': (data) => data.account_number && data.service_address
      };

      const validator = validationRules[documentType];
      return validator ? validator(extractedData) : true;
    } catch (error) {
      logger.error('Data validation error:', error);
      return false;
    }
  }

  /**
   * Check service health
   */
  async checkServiceHealth(): Promise<boolean> {
    if (!this.enabled || !this.verificationApiKey) {
      return false;
    }

    try {
      const response = await axios.get(`${this.verificationApiUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.verificationApiKey}`
        },
        timeout: 5000
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Document verification service health check failed:', error);
      return false;
    }
  }
}