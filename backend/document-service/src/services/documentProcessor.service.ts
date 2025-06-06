// backend/document-service/src/services/documentProcessor.service.ts

import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { logger } from '../../../shared/middleware';

interface ProcessedFile {
  data: Buffer;
  size: number;
  dimensions?: { width: number; height: number };
  processingApplied: string[];
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
}

export class DocumentProcessor {
  private readonly maxFileSize: number;
  private readonly allowedTypes: string[];
  private readonly imageOptimizationEnabled: boolean;

  constructor() {
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
    this.allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',').filter(Boolean);
    this.imageOptimizationEnabled = process.env.ENABLE_IMAGE_OPTIMIZATION === 'true';
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
          error: `File size exceeds maximum allowed size of ${this.formatFileSize(this.maxFileSize)}`
        };
      }

      // Check if file has content
      if (file.size === 0) {
        return {
          isValid: false,
          error: 'File is empty'
        };
      }

      // Detect actual file type from buffer
      const detectedType = await this.detectFileType(file.buffer);
      if (!detectedType) {
        return {
          isValid: false,
          error: 'Unable to determine file type'
        };
      }

      // Check if detected type matches allowed types
      if (this.allowedTypes.length > 0 && !this.allowedTypes.includes(detectedType)) {
        return {
          isValid: false,
          error: `File type ${detectedType} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
          detectedType
        };
      }

      // Validate file integrity
      const integrityCheck = await this.validateFileIntegrity(file.buffer, detectedType);
      if (!integrityCheck.isValid) {
        return {
          isValid: false,
          error: integrityCheck.error,
          detectedType
        };
      }

      // Additional security checks
      const securityCheck = await this.performSecurityChecks(file.buffer, detectedType);
      if (!securityCheck.isValid) {
        return {
          isValid: false,
          error: securityCheck.error,
          detectedType
        };
      }

      return {
        isValid: true,
        detectedType
      };
    } catch (error) {
      logger.error('File validation error:', error);
      return {
        isValid: false,
        error: 'File validation failed due to internal error'
      };
    }
  }

  /**
   * Process file based on type and requirements
   */
  async processFile(file: Express.Multer.File, documentType: string): Promise<ProcessedFile> {
    try {
      const detectedType = await this.detectFileType(file.buffer);
      const processingApplied: string[] = [];

      let processedBuffer = file.buffer;
      let dimensions: { width: number; height: number } | undefined;

      // Process images
      if (detectedType?.startsWith('image/') && this.imageOptimizationEnabled) {
        const imageResult = await this.processImage(file.buffer, documentType);
        processedBuffer = imageResult.buffer;
        dimensions = imageResult.dimensions;
        processingApplied.push(...imageResult.processingApplied);
      }

      // Process PDFs
      if (detectedType === 'application/pdf') {
        const pdfResult = await this.processPDF(processedBuffer);
        processedBuffer = pdfResult.buffer;
        processingApplied.push(...pdfResult.processingApplied);
      }

      // Apply compression if needed
      if (processedBuffer.length > this.maxFileSize * 0.8) { // If > 80% of max size
        const compressionResult = await this.applyCompression(processedBuffer, detectedType || '');
        if (compressionResult.success) {
          processedBuffer = compressionResult.buffer;
          processingApplied.push('compression');
        }
      }

      logger.info('File processed successfully', {
        originalSize: file.size,
        processedSize: processedBuffer.length,
        processingApplied,
        documentType
      });

      return {
        data: processedBuffer,
        size: processedBuffer.length,
        dimensions,
        processingApplied
      };
    } catch (error) {
      logger.error('File processing error:', error);
      // Return original file if processing fails
      return {
        data: file.buffer,
        size: file.size,
        processingApplied: ['processing_failed']
      };
    }
  }

  /**
   * Detect file type from buffer
   */
  private async detectFileType(buffer: Buffer): Promise<string | undefined> {
    try {
      const fileType = await fileTypeFromBuffer(buffer);
      return fileType?.mime;
    } catch (error) {
      logger.error('File type detection error:', error);
      return undefined;
    }
  }

  /**
   * Process image files
   */
  private async processImage(buffer: Buffer, documentType: string): Promise<{
    buffer: Buffer;
    dimensions: { width: number; height: number };
    processingApplied: string[];
  }> {
    try {
      const processingApplied: string[] = [];
      let image = sharp(buffer);

      // Get original dimensions
      const metadata = await image.metadata();
      let { width = 0, height = 0 } = metadata;

      // Resize if too large
      const maxDimension = this.getMaxDimensionForDocumentType(documentType);
      if (width > maxDimension || height > maxDimension) {
        image = image.resize(maxDimension, maxDimension, {
          fit: 'inside',
          withoutEnlargement: true
        });
        processingApplied.push('resize');

        // Update dimensions
        const newMetadata = await image.metadata();
        width = newMetadata.width || width;
        height = newMetadata.height || height;
      }

      // Auto-rotate based on EXIF
      image = image.rotate();
      processingApplied.push('auto_rotate');

      // Normalize orientation
      image = image.normalise();
      processingApplied.push('normalize');

      // Convert to JPEG for smaller file size (except for PNG with transparency)
      if (metadata.format !== 'png' || !metadata.hasAlpha) {
        image = image.jpeg({ quality: 85, progressive: true });
        processingApplied.push('jpeg_conversion');
      } else {
        image = image.png({ compressionLevel: 8 });
        processingApplied.push('png_optimization');
      }

      const processedBuffer = await image.toBuffer();

      return {
        buffer: processedBuffer,
        dimensions: { width, height },
        processingApplied
      };
    } catch (error) {
      logger.error('Image processing error:', error);
      throw error;
    }
  }

  /**
   * Process PDF files
   */
  private async processPDF(buffer: Buffer): Promise<{
    buffer: Buffer;
    processingApplied: string[];
  }> {
    try {
      const processingApplied: string[] = [];

      // For now, return as-is since PDF processing requires additional libraries
      // In production, you might want to:
      // 1. Validate PDF structure
      // 2. Remove metadata
      // 3. Optimize for web viewing
      // 4. Extract text for indexing

      processingApplied.push('pdf_validation');

      return {
        buffer,
        processingApplied
      };
    } catch (error) {
      logger.error('PDF processing error:', error);
      throw error;
    }
  }

  /**
   * Apply compression to files
   */
  private async applyCompression(buffer: Buffer, mimeType: string): Promise<{
    success: boolean;
    buffer: Buffer;
  }> {
    try {
      // For images, apply additional compression
      if (mimeType.startsWith('image/')) {
        const compressed = await sharp(buffer)
          .jpeg({ quality: 70 })
          .toBuffer();

        // Only use compressed version if it's actually smaller
        if (compressed.length < buffer.length) {
          return { success: true, buffer: compressed };
        }
      }

      // For other file types, we could implement specific compression strategies
      // For now, return original
      return { success: false, buffer };
    } catch (error) {
      logger.error('Compression error:', error);
      return { success: false, buffer };
    }
  }

  /**
   * Validate file integrity
   */
  private async validateFileIntegrity(buffer: Buffer, mimeType: string): Promise<ValidationResult> {
    try {
      // Validate image files
      if (mimeType.startsWith('image/')) {
        try {
          await sharp(buffer).metadata();
          return { isValid: true };
        } catch (error) {
          return {
            isValid: false,
            error: 'Corrupted or invalid image file'
          };
        }
      }

      // Validate PDF files
      if (mimeType === 'application/pdf') {
        // Basic PDF validation - check for PDF header
        const header = buffer.slice(0, 4).toString();
        if (header !== '%PDF') {
          return {
            isValid: false,
            error: 'Invalid PDF file format'
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      logger.error('File integrity validation error:', error);
      return {
        isValid: false,
        error: 'File integrity validation failed'
      };
    }
  }

  /**
   * Perform security checks on file
   */
  private async performSecurityChecks(buffer: Buffer, mimeType: string): Promise<ValidationResult> {
    try {
      // Check for suspicious patterns in the beginning of the file
      const header = buffer.slice(0, 1024).toString('hex');

      // Look for embedded executables or scripts
      const suspiciousPatterns = [
        '4d5a', // MZ (executable header)
        '504b0304', // ZIP file that might contain executables
        '3c73637269707420', // <script
        '3c696672616d65', // <iframe
        '6a61766173637269707428' // javascript(
      ];

      for (const pattern of suspiciousPatterns) {
        if (header.includes(pattern)) {
          return {
            isValid: false,
            error: 'File contains potentially malicious content'
          };
        }
      }

      // Check file size against detected type
      if (mimeType.startsWith('image/') && buffer.length < 100) {
        return {
          isValid: false,
          error: 'Image file is too small to be valid'
        };
      }

      // Additional checks based on file type
      if (mimeType === 'application/pdf') {
        // Check for PDF-specific security issues
        const content = buffer.toString('ascii', 0, Math.min(buffer.length, 10000));
        if (content.includes('/JavaScript') || content.includes('/JS')) {
          return {
            isValid: false,
            error: 'PDF contains JavaScript which is not allowed'
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      logger.error('Security check error:', error);
      return {
        isValid: false,
        error: 'Security validation failed'
      };
    }
  }

  /**
   * Get maximum dimension for document type
   */
  private getMaxDimensionForDocumentType(documentType: string): number {
    const dimensionLimits: Record<string, number> = {
      'ID_CARD': 2048,
      'BUSINESS_LICENSE': 3072,
      'TAX_CERTIFICATE': 3072,
      'BANK_STATEMENT': 2048,
      'UTILITY_BILL': 2048,
      'OTHER': 2048
    };

    return dimensionLimits[documentType] || 2048;
  }

  /**
   * Format file size for human reading
   */
  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Extract metadata from file
   */
  async extractMetadata(buffer: Buffer, mimeType: string): Promise<Record<string, any>> {
    try {
      const metadata: Record<string, any> = {
        size: buffer.length,
        mimeType,
        processedAt: new Date().toISOString()
      };

      if (mimeType.startsWith('image/')) {
        try {
          const imageMetadata = await sharp(buffer).metadata();
          metadata.image = {
            width: imageMetadata.width,
            height: imageMetadata.height,
            format: imageMetadata.format,
            hasAlpha: imageMetadata.hasAlpha,
            channels: imageMetadata.channels,
            density: imageMetadata.density
          };
        } catch (error) {
          logger.warn('Failed to extract image metadata:', error);
        }
      }

      return metadata;
    } catch (error) {
      logger.error('Metadata extraction error:', error);
      return {
        size: buffer.length,
        mimeType,
        processedAt: new Date().toISOString(),
        extractionError: true
      };
    }
  }

  /**
   * Check if file type is supported
   */
  isFileTypeSupported(mimeType: string): boolean {
    return this.allowedTypes.length === 0 || this.allowedTypes.includes(mimeType);
  }

  /**
   * Get processing recommendations for document type
   */
  getProcessingRecommendations(documentType: string): {
    shouldOptimize: boolean;
    targetQuality: number;
    maxDimension: number;
  } {
    const recommendations: Record<string, any> = {
      'ID_CARD': {
        shouldOptimize: true,
        targetQuality: 90,
        maxDimension: 2048
      },
      'BUSINESS_LICENSE': {
        shouldOptimize: true,
        targetQuality: 85,
        maxDimension: 3072
      },
      'TAX_CERTIFICATE': {
        shouldOptimize: true,
        targetQuality: 85,
        maxDimension: 3072
      },
      'BANK_STATEMENT': {
        shouldOptimize: true,
        targetQuality: 80,
        maxDimension: 2048
      },
      'UTILITY_BILL': {
        shouldOptimize: true,
        targetQuality: 80,
        maxDimension: 2048
      },
      'OTHER': {
        shouldOptimize: false,
        targetQuality: 85,
        maxDimension: 2048
      }
    };

    return recommendations[documentType] || recommendations['OTHER'];
  }
}