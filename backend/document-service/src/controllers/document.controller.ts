// backend/document-service/src/controllers/document.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  createSuccessResponse, 
  createErrorResponse 
} from '../../../shared/utils';
import { logger } from '../../../shared/middleware';
import { S3Service } from '../services/s3.service';
import { DocumentProcessor } from '../services/documentProcessor.service';
import { DocumentVerificationService } from '../services/documentVerification.service';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const s3Service = new S3Service();
const documentProcessor = new DocumentProcessor();
const documentVerification = new DocumentVerificationService();

export class DocumentController {
  /**
   * Upload document
   */
  async uploadDocument(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { documentType } = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      if (!req.file) {
        return res.status(400).json(
          createErrorResponse('No file uploaded', 'NO_FILE')
        );
      }

      // Validate file
      const validationResult = await documentProcessor.validateFile(req.file);
      if (!validationResult.isValid) {
        return res.status(400).json(
          createErrorResponse(validationResult.error || 'Invalid file', 'FILE_VALIDATION_ERROR')
        );
      }

      // Generate unique file name
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${userId}/${documentType}/${uuidv4()}.${fileExtension}`;

      // Process file (resize images, optimize, etc.)
      const processedFile = await documentProcessor.processFile(req.file, documentType);

      // Upload to S3
      const uploadResult = await s3Service.uploadFile(processedFile, fileName);

      // Save document metadata to database
      const document = await prisma.document.create({
        data: {
          userId,
          fileName: fileName,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: processedFile.size || req.file.size,
          s3Key: uploadResult.key,
          s3Url: uploadResult.location,
          documentType,
          status: 'UPLOADED',
          metadata: {
            originalSize: req.file.size,
            processedSize: processedFile.size,
            dimensions: processedFile.dimensions,
            processingApplied: processedFile.processingApplied
          }
        }
      });

      // Log document upload
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DOCUMENT_UPLOAD',
          resource: 'document',
          resourceId: document.id,
          details: {
            documentType,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            s3Key: uploadResult.key
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      // Start background verification if enabled
      if (process.env.ENABLE_DOCUMENT_VERIFICATION === 'true') {
        this.startDocumentVerification(document.id, uploadResult.location).catch(error => {
          logger.error('Background document verification failed:', error);
        });
      }

      logger.info(`Document uploaded successfully`, {
        documentId: document.id,
        userId,
        documentType,
        fileName: req.file.originalname
      });

      res.status(201).json(
        createSuccessResponse('Document uploaded successfully', {
          id: document.id,
          fileName: document.fileName,
          originalName: document.originalName,
          documentType: document.documentType,
          status: document.status,
          size: document.size,
          uploadedAt: document.uploadedAt
        })
      );
    } catch (error) {
      logger.error('Document upload error:', error);
      res.status(500).json(
        createErrorResponse('Failed to upload document', 'UPLOAD_ERROR')
      );
    }
  }

  /**
   * Get user documents
   */
  async getUserDocuments(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { documentType, status } = req.query;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const whereClause: any = { userId };
      if (documentType) whereClause.documentType = documentType;
      if (status) whereClause.status = status;

      const documents = await prisma.document.findMany({
        where: whereClause,
        select: {
          id: true,
          fileName: true,
          originalName: true,
          documentType: true,
          status: true,
          size: true,
          uploadedAt: true,
          verifiedAt: true,
          rejectedAt: true,
          rejectionReason: true,
          metadata: true
        },
        orderBy: { uploadedAt: 'desc' }
      });

      res.json(
        createSuccessResponse('Documents retrieved successfully', documents)
      );
    } catch (error) {
      logger.error('Get user documents error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve documents', 'RETRIEVAL_ERROR')
      );
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { documentId } = req.params;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId // Ensure user can only access their own documents
        },
        select: {
          id: true,
          fileName: true,
          originalName: true,
          documentType: true,
          status: true,
          size: true,
          mimeType: true,
          uploadedAt: true,
          verifiedAt: true,
          rejectedAt: true,
          rejectionReason: true,
          metadata: true
        }
      });

      if (!document) {
        return res.status(404).json(
          createErrorResponse('Document not found', 'DOCUMENT_NOT_FOUND')
        );
      }

      res.json(
        createSuccessResponse('Document retrieved successfully', document)
      );
    } catch (error) {
      logger.error('Get document by ID error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve document', 'RETRIEVAL_ERROR')
      );
    }
  }

  /**
   * Get pre-signed URL for document download
   */
  async getDownloadUrl(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { documentId } = req.params;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId
        }
      });

      if (!document) {
        return res.status(404).json(
          createErrorResponse('Document not found', 'DOCUMENT_NOT_FOUND')
        );
      }

      // Generate pre-signed URL for download
      const downloadUrl = await s3Service.getPresignedDownloadUrl(
        document.s3Key,
        parseInt(process.env.PRESIGNED_URL_EXPIRY || '3600')
      );

      // Log document access
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DOCUMENT_ACCESS',
          resource: 'document',
          resourceId: documentId,
          details: {
            documentType: document.documentType,
            fileName: document.fileName
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json(
        createSuccessResponse('Download URL generated successfully', {
          downloadUrl,
          expiresAt: new Date(Date.now() + parseInt(process.env.PRESIGNED_URL_EXPIRY || '3600') * 1000),
          document: {
            id: document.id,
            originalName: document.originalName,
            mimeType: document.mimeType,
            size: document.size
          }
        })
      );
    } catch (error) {
      logger.error('Get download URL error:', error);
      res.status(500).json(
        createErrorResponse('Failed to generate download URL', 'DOWNLOAD_URL_ERROR')
      );
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { documentId } = req.params;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId
        }
      });

      if (!document) {
        return res.status(404).json(
          createErrorResponse('Document not found', 'DOCUMENT_NOT_FOUND')
        );
      }

      // Delete from S3
      await s3Service.deleteFile(document.s3Key);

      // Delete from database
      await prisma.document.delete({
        where: { id: documentId }
      });

      // Log document deletion
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DOCUMENT_DELETE',
          resource: 'document',
          resourceId: documentId,
          details: {
            documentType: document.documentType,
            fileName: document.fileName,
            s3Key: document.s3Key
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      logger.info(`Document deleted successfully`, {
        documentId,
        userId,
        documentType: document.documentType
      });

      res.json(
        createSuccessResponse('Document deleted successfully')
      );
    } catch (error) {
      logger.error('Delete document error:', error);
      res.status(500).json(
        createErrorResponse('Failed to delete document', 'DELETE_ERROR')
      );
    }
  }

  /**
   * Update document status (admin only)
   */
  async updateDocumentStatus(req: Request, res: Response) {
    try {
      const { documentId } = req.params;
      const { status, rejectionReason } = req.body;

      const document = await prisma.document.findUnique({
        where: { id: documentId }
      });

      if (!document) {
        return res.status(404).json(
          createErrorResponse('Document not found', 'DOCUMENT_NOT_FOUND')
        );
      }

      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'VERIFIED') {
        updateData.verifiedAt = new Date();
      } else if (status === 'REJECTED') {
        updateData.rejectedAt = new Date();
        updateData.rejectionReason = rejectionReason;
      }

      const updatedDocument = await prisma.document.update({
        where: { id: documentId },
        data: updateData
      });

      // Log status update
      await prisma.auditLog.create({
        data: {
          userId: document.userId,
          action: 'DOCUMENT_STATUS_UPDATE',
          resource: 'document',
          resourceId: documentId,
          details: {
            oldStatus: document.status,
            newStatus: status,
            rejectionReason
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      logger.info(`Document status updated`, {
        documentId,
        oldStatus: document.status,
        newStatus: status
      });

      res.json(
        createSuccessResponse('Document status updated successfully', {
          id: updatedDocument.id,
          status: updatedDocument.status,
          verifiedAt: updatedDocument.verifiedAt,
          rejectedAt: updatedDocument.rejectedAt,
          rejectionReason: updatedDocument.rejectionReason
        })
      );
    } catch (error) {
      logger.error('Update document status error:', error);
      res.status(500).json(
        createErrorResponse('Failed to update document status', 'STATUS_UPDATE_ERROR')
      );
    }
  }

  /**
   * Get upload URL for direct S3 upload
   */
  async getUploadUrl(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { fileName, fileType, documentType } = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      // Validate file type
      const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [];
      if (!allowedTypes.includes(fileType)) {
        return res.status(400).json(
          createErrorResponse('File type not allowed', 'INVALID_FILE_TYPE')
        );
      }

      // Generate unique file name
      const fileExtension = fileName.split('.').pop();
      const s3Key = `${userId}/${documentType}/${uuidv4()}.${fileExtension}`;

      // Generate pre-signed upload URL
      const uploadUrl = await s3Service.getPresignedUploadUrl(s3Key, fileType);

      res.json(
        createSuccessResponse('Upload URL generated successfully', {
          uploadUrl,
          s3Key,
          expiresAt: new Date(Date.now() + 3600000), // 1 hour
          fields: {
            key: s3Key,
            'Content-Type': fileType
          }
        })
      );
    } catch (error) {
      logger.error('Get upload URL error:', error);
      res.status(500).json(
        createErrorResponse('Failed to generate upload URL', 'UPLOAD_URL_ERROR')
      );
    }
  }

  /**
   * Confirm upload after direct S3 upload
   */
  async confirmUpload(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { s3Key, originalName, documentType, fileSize } = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      // Verify file exists in S3
      const fileExists = await s3Service.fileExists(s3Key);
      if (!fileExists) {
        return res.status(400).json(
          createErrorResponse('File not found in S3', 'FILE_NOT_FOUND')
        );
      }

      // Get file metadata from S3
      const fileMetadata = await s3Service.getFileMetadata(s3Key);

      // Save document metadata to database
      const document = await prisma.document.create({
        data: {
          userId,
          fileName: s3Key,
          originalName,
          mimeType: fileMetadata.contentType || 'application/octet-stream',
          size: fileMetadata.contentLength || fileSize,
          s3Key,
          s3Url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
          documentType,
          status: 'UPLOADED'
        }
      });

      res.status(201).json(
        createSuccessResponse('Upload confirmed successfully', {
          id: document.id,
          fileName: document.fileName,
          originalName: document.originalName,
          documentType: document.documentType,
          status: document.status,
          uploadedAt: document.uploadedAt
        })
      );
    } catch (error) {
      logger.error('Confirm upload error:', error);
      res.status(500).json(
        createErrorResponse('Failed to confirm upload', 'CONFIRM_UPLOAD_ERROR')
      );
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const stats = await prisma.document.groupBy({
        by: ['status', 'documentType'],
        where: { userId },
        _count: true
      });

      const totalSize = await prisma.document.aggregate({
        where: { userId },
        _sum: { size: true }
      });

      const recentUploads = await prisma.document.count({
        where: {
          userId,
          uploadedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      });

      const formattedStats = {
        byStatus: stats.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + item._count;
          return acc;
        }, {} as Record<string, number>),
        byType: stats.reduce((acc, item) => {
          acc[item.documentType] = (acc[item.documentType] || 0) + item._count;
          return acc;
        }, {} as Record<string, number>),
        totalSize: totalSize._sum.size || 0,
        recentUploads
      };

      res.json(
        createSuccessResponse('Document statistics retrieved successfully', formattedStats)
      );
    } catch (error) {
      logger.error('Get document stats error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve document statistics', 'STATS_ERROR')
      );
    }
  }

  /**
   * Start background document verification
   */
  private async startDocumentVerification(documentId: string, s3Url: string): Promise<void> {
    try {
      // Update status to processing
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'PROCESSING' }
      });

      // Start verification process
      const verificationResult = await documentVerification.verifyDocument(s3Url);

      // Update document based on verification result
      const updateData: any = {
        status: verificationResult.isValid ? 'VERIFIED' : 'REJECTED'
      };

      if (verificationResult.isValid) {
        updateData.verifiedAt = new Date();
      } else {
        updateData.rejectedAt = new Date();
        updateData.rejectionReason = verificationResult.reason || 'Document verification failed';
      }

      await prisma.document.update({
        where: { id: documentId },
        data: updateData
      });

      logger.info(`Document verification completed`, {
        documentId,
        isValid: verificationResult.isValid,
        confidence: verificationResult.confidence
      });
    } catch (error) {
      logger.error('Document verification error:', error);
      
      // Mark as failed
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectionReason: 'Verification process failed'
        }
      });
    }
  }
}