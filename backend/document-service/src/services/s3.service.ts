// backend/document-service/src/services/s3.service.ts

import AWS from 'aws-sdk';
import { logger } from '../../../shared/middleware';

interface UploadResult {
  location: string;
  key: string;
  bucket: string;
  etag: string;
}

interface FileMetadata {
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  etag?: string;
}

export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: 'v4'
    });
    
    this.bucketName = process.env.S3_BUCKET_NAME || 'talaty-documents';
  }

  /**
   * Upload file to S3
   */
  async uploadFile(file: Express.Multer.File | any, key: string): Promise<UploadResult> {
    try {
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer || file.data,
        ContentType: file.mimetype,
        ContentLength: file.size,
        ServerSideEncryption: 'AES256',
        Metadata: {
          'original-name': file.originalname || file.name || '',
          'uploaded-at': new Date().toISOString(),
          'user-agent': 'talaty-document-service'
        }
      };

      const result = await this.s3.upload(uploadParams).promise();

      logger.info('File uploaded to S3 successfully', {
        key,
        bucket: this.bucketName,
        size: file.size,
        contentType: file.mimetype
      });

      return {
        location: result.Location,
        key: result.Key,
        bucket: result.Bucket,
        etag: result.ETag
      };
    } catch (error) {
      logger.error('S3 upload error:', error);
      throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate pre-signed URL for file upload
   */
  async getPresignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
    try {
      const params: AWS.S3.PresignedPost.Params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn,
        Conditions: [
          ['content-length-range', 0, parseInt(process.env.MAX_FILE_SIZE || '10485760')], // 10MB default
          ['eq', '$Content-Type', contentType]
        ]
      };

      const url = await this.s3.getSignedUrlPromise('putObject', {
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        Expires: expiresIn,
        ServerSideEncryption: 'AES256'
      });

      logger.info('Pre-signed upload URL generated', {
        key,
        contentType,
        expiresIn
      });

      return url;
    } catch (error) {
      logger.error('Generate pre-signed upload URL error:', error);
      throw new Error(`Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate pre-signed URL for file download
   */
  async getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn,
        ResponseContentDisposition: 'attachment' // Force download
      });

      logger.info('Pre-signed download URL generated', {
        key,
        expiresIn
      });

      return url;
    } catch (error) {
      logger.error('Generate pre-signed download URL error:', error);
      throw new Error(`Failed to generate download URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      logger.info('File deleted from S3 successfully', { key });
    } catch (error) {
      logger.error('S3 delete error:', error);
      throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3.headObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'NotFound') {
        return false;
      }
      logger.error('S3 file exists check error:', error);
      throw error;
    }
  }

  /**
   * Get file metadata from S3
   */
  async getFileMetadata(key: string): Promise<FileMetadata> {
    try {
      const result = await this.s3.headObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        lastModified: result.LastModified,
        etag: result.ETag
      };
    } catch (error) {
      logger.error('Get file metadata error:', error);
      throw new Error(`Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Copy file within S3
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      await this.s3.copyObject({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceKey}`,
        Key: destinationKey,
        ServerSideEncryption: 'AES256'
      }).promise();

      logger.info('File copied in S3 successfully', {
        sourceKey,
        destinationKey
      });
    } catch (error) {
      logger.error('S3 copy error:', error);
      throw new Error(`Failed to copy file in S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List files with prefix
   */
  async listFiles(prefix: string, maxKeys: number = 1000): Promise<AWS.S3.Object[]> {
    try {
      const result = await this.s3.listObjectsV2({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys
      }).promise();

      return result.Contents || [];
    } catch (error) {
      logger.error('S3 list files error:', error);
      throw new Error(`Failed to list files from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file content as buffer
   */
  async getFileContent(key: string): Promise<Buffer> {
    try {
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      if (!result.Body) {
        throw new Error('File content is empty');
      }

      return result.Body as Buffer;
    } catch (error) {
      logger.error('Get file content error:', error);
      throw new Error(`Failed to get file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate pre-signed POST data for direct browser upload
   */
  async getPresignedPost(key: string, contentType: string, expiresIn: number = 3600): Promise<AWS.S3.PresignedPost> {
    try {
      const params: AWS.S3.PresignedPost.Params = {
        Bucket: this.bucketName,
        Fields: {
          key,
          'Content-Type': contentType,
          'x-amz-server-side-encryption': 'AES256'
        },
        Expires: expiresIn,
        Conditions: [
          ['content-length-range', 0, parseInt(process.env.MAX_FILE_SIZE || '10485760')],
          ['eq', '$Content-Type', contentType],
          ['eq', '$x-amz-server-side-encryption', 'AES256']
        ]
      };

      return new Promise((resolve, reject) => {
        this.s3.createPresignedPost(params, (err, data) => {
          if (err) {
            logger.error('Generate pre-signed POST error:', err);
            reject(new Error(`Failed to generate pre-signed POST: ${err.message}`));
          } else {
            logger.info('Pre-signed POST data generated', { key, contentType });
            resolve(data);
          }
        });
      });
    } catch (error) {
      logger.error('Generate pre-signed POST error:', error);
      throw new Error(`Failed to generate pre-signed POST: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set file permissions (make public/private)
   */
  async setFilePermissions(key: string, acl: 'private' | 'public-read' = 'private'): Promise<void> {
    try {
      await this.s3.putObjectAcl({
        Bucket: this.bucketName,
        Key: key,
        ACL: acl
      }).promise();

      logger.info('File permissions updated', { key, acl });
    } catch (error) {
      logger.error('Set file permissions error:', error);
      throw new Error(`Failed to set file permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create backup of file
   */
  async createBackup(key: string): Promise<string> {
    try {
      const backupKey = `backups/${key}-${Date.now()}`;
      await this.copyFile(key, backupKey);
      
      logger.info('File backup created', { originalKey: key, backupKey });
      return backupKey;
    } catch (error) {
      logger.error('Create backup error:', error);
      throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get bucket statistics
   */
  async getBucketStats(): Promise<{ totalObjects: number; totalSize: number }> {
    try {
      // This is a simplified version - for production, you might want to use CloudWatch metrics
      const objects = await this.listFiles('', 1000);
      
      const totalObjects = objects.length;
      const totalSize = objects.reduce((sum, obj) => sum + (obj.Size || 0), 0);

      return { totalObjects, totalSize };
    } catch (error) {
      logger.error('Get bucket stats error:', error);
      throw new Error(`Failed to get bucket statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check S3 service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      return true;
    } catch (error) {
      logger.error('S3 health check failed:', error);
      return false;
    }
  }

  /**
   * Setup bucket CORS configuration
   */
  async setupCORS(): Promise<void> {
    try {
      const corsConfiguration = {
        CORSRules: [
          {
            AllowedOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedHeaders: ['*'],
            MaxAgeSeconds: 3600,
            ExposeHeaders: ['ETag']
          }
        ]
      };

      await this.s3.putBucketCors({
        Bucket: this.bucketName,
        CORSConfiguration: corsConfiguration
      }).promise();

      logger.info('S3 CORS configuration updated');
    } catch (error) {
      logger.error('Setup CORS error:', error);
      throw new Error(`Failed to setup CORS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Setup bucket lifecycle configuration
   */
  async setupLifecycle(): Promise<void> {
    try {
      const lifecycleConfiguration = {
        Rules: [
          {
            ID: 'DeleteOldBackups',
            Status: 'Enabled',
            Filter: { Prefix: 'backups/' },
            Expiration: { Days: 90 } // Delete backups after 90 days
          },
          {
            ID: 'TransitionToIA',
            Status: 'Enabled',
            Filter: { Prefix: 'documents/' },
            Transitions: [
              {
                Days: 30,
                StorageClass: 'STANDARD_IA' // Move to Infrequent Access after 30 days
              },
              {
                Days: 90,
                StorageClass: 'GLACIER' // Move to Glacier after 90 days
              }
            ]
          }
        ]
      };

      await this.s3.putBucketLifecycleConfiguration({
        Bucket: this.bucketName,
        LifecycleConfiguration: lifecycleConfiguration
      }).promise();

      logger.info('S3 lifecycle configuration updated');
    } catch (error) {
      logger.error('Setup lifecycle error:', error);
      throw new Error(`Failed to setup lifecycle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}