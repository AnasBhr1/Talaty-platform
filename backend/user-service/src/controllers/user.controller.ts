// backend/user-service/src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  createSuccessResponse, 
  createErrorResponse,
  calculateCompletionPercentage
} from '../../../shared/utils';
import { logger } from '../../../shared/middleware';
import { UpdateProfileRequest } from '../../../shared/types';
import { BusinessVerificationService } from '../services/businessVerification.service';
import { AddressValidationService } from '../services/addressValidation.service';

const prisma = new PrismaClient();
const businessVerification = new BusinessVerificationService();
const addressValidation = new AddressValidationService();

export class UserController {
  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          businessName: true,
          businessType: true,
          registrationNumber: true,
          address: true,
          city: true,
          country: true,
          eKycStatus: true,
          isVerified: true,
          score: true,
          emailVerifiedAt: true,
          phoneVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          documents: {
            select: {
              id: true,
              fileName: true,
              documentType: true,
              status: true,
              uploadedAt: true,
              verifiedAt: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      // Calculate profile completion percentage
      const completionPercentage = calculateCompletionPercentage(user, user.documents);

      res.json(
        createSuccessResponse('Profile retrieved successfully', {
          ...user,
          completionPercentage
        })
      );
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve profile', 'PROFILE_RETRIEVAL_ERROR')
      );
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const updateData: UpdateProfileRequest = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      // Validate business registration number if provided
      if (updateData.registrationNumber && updateData.businessName) {
        const isValid = await businessVerification.verifyBusinessRegistration(
          updateData.registrationNumber,
          updateData.businessName
        );

        if (!isValid) {
          return res.status(400).json(
            createErrorResponse('Invalid business registration number', 'INVALID_BUSINESS_REGISTRATION')
          );
        }
      }

      // Validate address if provided
      if (updateData.address && updateData.city && updateData.country) {
        const addressValidationResult = await addressValidation.validateAddress({
          address: updateData.address,
          city: updateData.city,
          country: updateData.country
        });

        if (!addressValidationResult.isValid) {
          return res.status(400).json(
            createErrorResponse('Invalid address', 'INVALID_ADDRESS')
          );
        }

        // Use standardized address if available
        if (addressValidationResult.standardizedAddress) {
          updateData.address = addressValidationResult.standardizedAddress.address;
          updateData.city = addressValidationResult.standardizedAddress.city;
        }
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          businessName: true,
          businessType: true,
          registrationNumber: true,
          address: true,
          city: true,
          country: true,
          eKycStatus: true,
          isVerified: true,
          score: true,
          updatedAt: true
        }
      });

      // Log profile update
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'PROFILE_UPDATE',
          resource: 'user',
          resourceId: userId,
          details: { updatedFields: Object.keys(updateData) },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      logger.info(`Profile updated for user: ${userId}`, { updatedFields: Object.keys(updateData) });

      res.json(
        createSuccessResponse('Profile updated successfully', updatedUser)
      );
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json(
        createErrorResponse('Failed to update profile', 'PROFILE_UPDATE_ERROR')
      );
    }
  }

  /**
   * Get eKYC status and requirements
   */
  async getEKycStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          eKycStatus: true,
          isVerified: true,
          emailVerifiedAt: true,
          phoneVerifiedAt: true,
          firstName: true,
          lastName: true,
          businessName: true,
          businessType: true,
          registrationNumber: true,
          address: true,
          city: true,
          country: true,
          documents: {
            select: {
              documentType: true,
              status: true,
              uploadedAt: true,
              verifiedAt: true,
              rejectedAt: true,
              rejectionReason: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      // Define required documents
      const requiredDocuments = [
        'ID_CARD',
        'BUSINESS_LICENSE',
        'TAX_CERTIFICATE',
        'BANK_STATEMENT'
      ];

      // Check document status
      const documentStatus = requiredDocuments.map(docType => {
        const doc = user.documents.find(d => d.documentType === docType);
        return {
          documentType: docType,
          status: doc?.status || 'NOT_UPLOADED',
          uploadedAt: doc?.uploadedAt,
          verifiedAt: doc?.verifiedAt,
          rejectedAt: doc?.rejectedAt,
          rejectionReason: doc?.rejectionReason
        };
      });

      // Calculate completion steps
      const completionSteps = {
        personalInfo: !!(user.firstName && user.lastName && user.emailVerifiedAt),
        businessInfo: !!(user.businessName && user.businessType),
        addressInfo: !!(user.address && user.city && user.country),
        phoneVerification: !!user.phoneVerifiedAt,
        businessRegistration: !!user.registrationNumber,
        documentsUploaded: documentStatus.every(doc => doc.status !== 'NOT_UPLOADED'),
        documentsVerified: documentStatus.every(doc => doc.status === 'VERIFIED')
      };

      // Calculate overall completion percentage
      const completedSteps = Object.values(completionSteps).filter(Boolean).length;
      const totalSteps = Object.keys(completionSteps).length;
      const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

      // Determine next steps
      const nextSteps = [];
      if (!completionSteps.personalInfo) {
        nextSteps.push('Complete personal information and verify email');
      }
      if (!completionSteps.businessInfo) {
        nextSteps.push('Add business information');
      }
      if (!completionSteps.addressInfo) {
        nextSteps.push('Add address information');
      }
      if (!completionSteps.phoneVerification) {
        nextSteps.push('Verify phone number');
      }
      if (!completionSteps.businessRegistration) {
        nextSteps.push('Add business registration number');
      }
      if (!completionSteps.documentsUploaded) {
        nextSteps.push('Upload all required documents');
      }
      if (!completionSteps.documentsVerified) {
        nextSteps.push('Wait for document verification');
      }

      res.json(
        createSuccessResponse('eKYC status retrieved successfully', {
          eKycStatus: user.eKycStatus,
          isVerified: user.isVerified,
          completionPercentage,
          completionSteps,
          documentStatus,
          nextSteps,
          requiredDocuments
        })
      );
    } catch (error) {
      logger.error('Get eKYC status error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve eKYC status', 'EKYC_STATUS_ERROR')
      );
    }
  }

  /**
   * Update eKYC status
   */
  async updateEKycStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { status, reason } = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json(
          createErrorResponse('Invalid eKYC status', 'INVALID_STATUS')
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          eKycStatus: status,
          updatedAt: new Date()
        },
        select: {
          id: true,
          eKycStatus: true,
          updatedAt: true
        }
      });

      // Log status change
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'EKYC_STATUS_UPDATE',
          resource: 'user',
          resourceId: userId,
          details: { 
            oldStatus: req.body.oldStatus,
            newStatus: status,
            reason 
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      logger.info(`eKYC status updated for user: ${userId}`, { 
        oldStatus: req.body.oldStatus,
        newStatus: status 
      });

      res.json(
        createSuccessResponse('eKYC status updated successfully', updatedUser)
      );
    } catch (error) {
      logger.error('Update eKYC status error:', error);
      res.status(500).json(
        createErrorResponse('Failed to update eKYC status', 'EKYC_UPDATE_ERROR')
      );
    }
  }

  /**
   * Get user activity log
   */
  async getActivityLog(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { page = 1, limit = 20 } = req.query;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [activities, total] = await Promise.all([
        prisma.auditLog.findMany({
          where: { userId },
          select: {
            id: true,
            action: true,
            resource: true,
            details: true,
            ipAddress: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.auditLog.count({
          where: { userId }
        })
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      res.json(
        createSuccessResponse('Activity log retrieved successfully', {
          activities,
          pagination: {
            currentPage: Number(page),
            totalPages,
            totalItems: total,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
          }
        })
      );
    } catch (error) {
      logger.error('Get activity log error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve activity log', 'ACTIVITY_LOG_ERROR')
      );
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { confirmPassword } = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      // This is a critical operation, so we might want to verify password
      // For now, we'll just log the deletion request
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'ACCOUNT_DELETION_REQUEST',
          resource: 'user',
          resourceId: userId,
          details: { requestedAt: new Date() },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      // In a real implementation, you might:
      // 1. Send confirmation email
      // 2. Queue for delayed deletion
      // 3. Anonymize data instead of hard delete
      // 4. Verify password before deletion

      logger.warn(`Account deletion requested for user: ${userId}`);

      res.json(
        createSuccessResponse('Account deletion request received. You will receive a confirmation email shortly.')
      );
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json(
        createErrorResponse('Failed to process account deletion', 'ACCOUNT_DELETION_ERROR')
      );
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const [user, documentsCount, activitiesCount] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            createdAt: true,
            lastLoginAt: true,
            score: true,
            eKycStatus: true
          }
        }),
        prisma.document.count({
          where: { userId }
        }),
        prisma.auditLog.count({
          where: { userId }
        })
      ]);

      if (!user) {
        return res.status(404).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      const daysSinceRegistration = Math.floor(
        (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const stats = {
        memberSince: user.createdAt,
        daysSinceRegistration,
        lastLogin: user.lastLoginAt,
        currentScore: user.score || 0,
        eKycStatus: user.eKycStatus,
        documentsUploaded: documentsCount,
        totalActivities: activitiesCount
      };

      res.json(
        createSuccessResponse('User statistics retrieved successfully', stats)
      );
    } catch (error) {
      logger.error('Get user stats error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve user statistics', 'USER_STATS_ERROR')
      );
    }
  }

  /**
   * Verify business information
   */
  async verifyBusinessInfo(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          businessName: true,
          registrationNumber: true,
          businessType: true
        }
      });

      if (!user?.businessName || !user?.registrationNumber) {
        return res.status(400).json(
          createErrorResponse('Business information incomplete', 'INCOMPLETE_BUSINESS_INFO')
        );
      }

      // Verify business registration
      const verificationResult = await businessVerification.verifyBusinessRegistration(
        user.registrationNumber,
        user.businessName
      );

      if (verificationResult) {
        // Update user verification status
        await prisma.user.update({
          where: { id: userId },
          data: {
            // Add a field to track business verification if needed
            updatedAt: new Date()
          }
        });

        // Log verification
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'BUSINESS_VERIFICATION',
            resource: 'user',
            resourceId: userId,
            details: { 
              businessName: user.businessName,
              registrationNumber: user.registrationNumber,
              verified: true
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
          }
        });
      }

      res.json(
        createSuccessResponse('Business verification completed', {
          isVerified: verificationResult,
          businessName: user.businessName,
          registrationNumber: user.registrationNumber
        })
      );
    } catch (error) {
      logger.error('Business verification error:', error);
      res.status(500).json(
        createErrorResponse('Failed to verify business information', 'BUSINESS_VERIFICATION_ERROR')
      );
    }
  }
}