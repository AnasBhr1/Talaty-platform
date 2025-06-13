import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticateToken, generalRateLimit, uploadRateLimit } from '../../../shared/middleware';
import multer from 'multer';

const router = Router();
const documentController = new DocumentController();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               documentType:
 *                 type: string
 *                 enum: [ID_CARD, BUSINESS_LICENSE, TAX_CERTIFICATE, BANK_STATEMENT]
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Invalid file or missing data
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', 
  authenticateToken, 
  uploadRateLimit, 
  upload.single('file'), 
  documentController.uploadDocument.bind(documentController)
);

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get user documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *         description: Filter by document type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', 
  authenticateToken, 
  generalRateLimit, 
  documentController.getUserDocuments.bind(documentController)
);

/**
 * @swagger
 * /api/documents/{documentId}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.get('/:documentId', 
  authenticateToken, 
  generalRateLimit, 
  documentController.getDocumentById.bind(documentController)
);

/**
 * @swagger
 * /api/documents/{documentId}/download:
 *   get:
 *     summary: Get download URL for document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download URL generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.get('/:documentId/download', 
  authenticateToken, 
  generalRateLimit, 
  documentController.getDownloadUrl.bind(documentController)
);

/**
 * @swagger
 * /api/documents/{documentId}:
 *   delete:
 *     summary: Delete document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.delete('/:documentId', 
  authenticateToken, 
  generalRateLimit, 
  documentController.deleteDocument.bind(documentController)
);

/**
 * @swagger
 * /api/documents/upload-url:
 *   post:
 *     summary: Get pre-signed upload URL
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *               documentType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/upload-url', 
  authenticateToken, 
  generalRateLimit, 
  documentController.getUploadUrl.bind(documentController)
);

/**
 * @swagger
 * /api/documents/confirm-upload:
 *   post:
 *     summary: Confirm direct S3 upload
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               s3Key:
 *                 type: string
 *               originalName:
 *                 type: string
 *               documentType:
 *                 type: string
 *               fileSize:
 *                 type: number
 *     responses:
 *       201:
 *         description: Upload confirmed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/confirm-upload', 
  authenticateToken, 
  generalRateLimit, 
  documentController.confirmUpload.bind(documentController)
);

/**
 * @swagger
 * /api/documents/stats:
 *   get:
 *     summary: Get document statistics
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Document statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', 
  authenticateToken, 
  generalRateLimit, 
  documentController.getDocumentStats.bind(documentController)
);

export default router;