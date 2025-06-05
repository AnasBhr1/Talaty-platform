// backend/user-service/src/routes/user.routes.ts

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken, validateRequest, generalRateLimit } from '../../../shared/middleware';
import { 
  updateProfileSchema, 
  updateEKycStatusSchema,
  deleteAccountSchema 
} from '../validation/user.validation';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         businessName:
 *           type: string
 *         businessType:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         eKycStatus:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *         isVerified:
 *           type: boolean
 *         score:
 *           type: number
 *         completionPercentage:
 *           type: number
 *         emailVerifiedAt:
 *           type: string
 *           format: date-time
 *         phoneVerifiedAt:
 *           type: string
 *           format: date-time
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 *     
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fileName:
 *           type: string
 *         documentType:
 *           type: string
 *           enum: [ID_CARD, BUSINESS_LICENSE, TAX_CERTIFICATE, BANK_STATEMENT, UTILITY_BILL, OTHER]
 *         status:
 *           type: string
 *           enum: [UPLOADED, PROCESSING, VERIFIED, REJECTED]
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *         verifiedAt:
 *           type: string
 *           format: date-time
 *     
 *     EKycStatus:
 *       type: object
 *       properties:
 *         eKycStatus:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *         isVerified:
 *           type: boolean
 *         completionPercentage:
 *           type: number
 *         completionSteps:
 *           type: object
 *           properties:
 *             personalInfo:
 *               type: boolean
 *             businessInfo:
 *               type: boolean
 *             addressInfo:
 *               type: boolean
 *             phoneVerification:
 *               type: boolean
 *             businessRegistration:
 *               type: boolean
 *             documentsUploaded:
 *               type: boolean
 *             documentsVerified:
 *               type: boolean
 *         documentStatus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               documentType:
 *                 type: string
 *               status:
 *                 type: string
 *               uploadedAt:
 *                 type: string
 *                 format: date-time
 *               verifiedAt:
 *                 type: string
 *                 format: date-time
 *         nextSteps:
 *           type: array
 *           items:
 *             type: string
 *         requiredDocuments:
 *           type: array
 *           items:
 *             type: string
 *     
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         action:
 *           type: string
 *         resource:
 *           type: string
 *         details:
 *           type: object
 *         ipAddress:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     UserStats:
 *       type: object
 *       properties:
 *         memberSince:
 *           type: string
 *           format: date-time
 *         daysSinceRegistration:
 *           type: number
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         currentScore:
 *           type: number
 *         eKycStatus:
 *           type: string
 *         documentsUploaded:
 *           type: number
 *         totalActivities:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: User Profile
 *   description: User profile management endpoints
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserProfile'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found
 */
router.get('/profile', authenticateToken, userController.getProfile.bind(userController));

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               phone:
 *                 type: string
 *               businessName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               businessType:
 *                 type: string
 *                 enum: [SOLE_PROPRIETORSHIP, PARTNERSHIP, CORPORATION, LLC, NONPROFIT, COOPERATIVE, OTHER]
 *               registrationNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserProfile'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), userController.updateProfile.bind(userController));

/**
 * @swagger
 * /api/user/ekyc/status:
 *   get:
 *     summary: Get eKYC status and requirements
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: eKYC status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/EKycStatus'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found
 */
router.get('/ekyc/status', authenticateToken, userController.getEKycStatus.bind(userController));

/**
 * @swagger
 * /api/user/ekyc/status:
 *   put:
 *     summary: Update eKYC status (admin only)
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: eKYC status updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/ekyc/status', authenticateToken, validateRequest(updateEKycStatusSchema), userController.updateEKycStatus.bind(userController));

/**
 * @swagger
 * /api/user/activity:
 *   get:
 *     summary: Get user activity log
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Activity log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         activities:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ActivityLog'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             currentPage:
 *                               type: number
 *                             totalPages:
 *                               type: number
 *                             totalItems:
 *                               type: number
 *                             hasNext:
 *                               type: boolean
 *                             hasPrev:
 *                               type: boolean
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/activity', authenticateToken, userController.getActivityLog.bind(userController));

/**
 * @swagger
 * /api/user/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserStats'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found
 */
router.get('/stats', authenticateToken, userController.getUserStats.bind(userController));

/**
 * @swagger
 * /api/user/business/verify:
 *   post:
 *     summary: Verify business information
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business verification completed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         isVerified:
 *                           type: boolean
 *                         businessName:
 *                           type: string
 *                         registrationNumber:
 *                           type: string
 *       400:
 *         description: Business information incomplete
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/business/verify', authenticateToken, userController.verifyBusinessInfo.bind(userController));

/**
 * @swagger
 * /api/user/account:
 *   delete:
 *     summary: Delete user account
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - confirmPassword
 *             properties:
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deletion request received
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/account', authenticateToken, validateRequest(deleteAccountSchema), userController.deleteAccount.bind(userController));

export default router;