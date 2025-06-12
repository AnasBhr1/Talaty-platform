import { logger } from '../../../shared/middleware';

interface ProcessedFile {
  buffer: Buffer;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  processingApplied: string[];
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class DocumentProcessor {
  private readonly maxFileSize: number;
  private readonly allowedTypes: string[];

  constructor() {
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
    this.allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf').split(',');
  }

  /**
   * Validate uploaded file
   */
  async validateFile(file: Express.Multer.File): Promise<ValidationResult> {
    try {
      // Check file size
      if (file.size > this.maxFileSize) {
        return {
          isValid: false,
          error: `File size exceeds maximum allowed size of ${this.maxFileSize} bytes`
        };
      }

      // Check file type
      if (!this.allowedTypes.includes(file.mimetype)) {
        return {
          isValid: false,
          error: `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`
        };
      }

      // Check if file has content
      if (file.size === 0) {
        return {
          isValid: false,
          error: 'File is empty'
        };
      }

      // Validate file header (basic check)
      const isValidHeader = this.validateFileHeader(file.buffer, file.mimetype);
      if (!isValidHeader) {
        return {
          isValid: false,
          error: 'File appears to be corrupted or invalid'
        };
      }

      return { isValid: true };
    } catch (error) {
      logger.error('File validation error:', error);
      return {
        isValid: false,
        error: 'File validation failed'
      };
    }
  }

  /**
   * Process uploaded file (resize, optimize, etc.)
   */
  async processFile(file: Express.Multer.File, documentType: string): Promise<ProcessedFile> {
    try {
      let processedBuffer = file.buffer;
      let processingApplied: string[] = [];
      let dimensions: { width: number; height: number } | undefined;

      // For images, we might want to resize or optimize
      if (file.mimetype.startsWith('image/')) {
        // Mock image processing - in production, use Sharp or similar
        logger.info(`Processing image file: ${file.originalname}`);
        processingApplied.push('image_optimization');
        
        // Mock dimensions
        dimensions = {
          width: 1920,
          height: 1080
        };
      }

      // For PDFs, we might want to compress
      if (file.mimetype === 'application/pdf') {
        logger.info(`Processing PDF file: ${file.originalname}`);
        processingApplied.push('pdf_optimization');
      }

      return {
        buffer: processedBuffer,
        size: processedBuffer.length,
        dimensions,
        processingApplied
      };
    } catch (error) {
      logger.error('File processing error:', error);
      // Return original file if processing fails
      return {
        buffer: file.buffer,
        size: file.size,
        processingApplied: []
      };
    }
  }

  /**
   * Validate file header to ensure it matches the claimed MIME type
   */
  private validateFileHeader(buffer: Buffer, mimeType: string): boolean {
    try {
      if (buffer.length < 4) {
        return false;
      }

      const header = buffer.toString('hex', 0, 4).toLowerCase();

      switch (mimeType) {
        case 'image/jpeg':
          return header.startsWith('ffd8');
        case 'image/png':
          return header === '89504e47';
        case 'application/pdf':
          return buffer.toString('ascii', 0, 4) === '%PDF';
        default:
          return true; // Allow unknown types to pass
      }
    } catch (error) {
      logger.error('File header validation error:', error);
      return false;
    }
  }

  /**
   * Extract metadata from file
   */
  async extractMetadata(file: Express.Multer.File): Promise<Record<string, any>> {
    try {
      const metadata: Record<string, any> = {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      // Extract additional metadata based on file type
      if (file.mimetype.startsWith('image/')) {
        metadata.type = 'image';
        // In production, use exif-reader or similar for actual metadata extraction
        metadata.exif = {
          make: 'Unknown',
          model: 'Unknown',
          dateTime: new Date().toISOString()
        };
      }

      if (file.mimetype === 'application/pdf') {
        metadata.type = 'document';
        metadata.pageCount = 1; // Mock page count
      }

      return metadata;
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      return {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      };
    }
  }

  /**
   * Generate file checksum
   */
  generateChecksum(buffer: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Check if file processing is supported
   */
  isProcessingSupported(mimeType: string): boolean {
    const supportedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf'
    ];
    return supportedTypes.includes(mimeType);
  }

  /**
   * Get file format info
   */
  getFileFormatInfo(mimeType: string): { category: string; description: string } {
    const formatInfo: Record<string, { category: string; description: string }> = {
      'image/jpeg': { category: 'image', description: 'JPEG Image' },
      'image/png': { category: 'image', description: 'PNG Image' },
      'image/jpg': { category: 'image', description: 'JPG Image' },
      'application/pdf': { category: 'document', description: 'PDF Document' },
      'application/msword': { category: 'document', description: 'Microsoft Word Document' },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
        category: 'document', 
        description: 'Microsoft Word Document (DOCX)' 
      }
    };

    return formatInfo[mimeType] || { category: 'unknown', description: 'Unknown File Type' };
  }

  /**
   * Sanitize filename
   */
  sanitizeFilename(filename: string): string {
    // Remove potentially dangerous characters
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255); // Limit length
  }
}