import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import { AppError } from '../middleware/error';

export interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  publicUrl: string;
}

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

export class StorageService {
  private s3: AWS.S3;
  private config: S3Config;

  constructor() {
    this.config = {
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      bucket: process.env.S3_BUCKET || 'noteshub-files',
      region: process.env.S3_REGION || 'us-east-1',
      publicUrl: process.env.S3_PUBLIC_URL || 'http://localhost:9000/noteshub-files',
    };

    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
      region: this.config.region,
    });

    this.s3 = new AWS.S3({
      endpoint: this.config.endpoint,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });

    this.ensureBucketExists();
  }

  async generateSignedUploadUrl(request: UploadUrlRequest): Promise<UploadUrlResponse> {
    const { filename, contentType, fileSize } = request;

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (fileSize > maxSize) {
      throw new AppError('File size exceeds 50MB limit', 400);
    }

    // Validate content type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(contentType)) {
      throw new AppError('File type not supported', 400);
    }

    // Generate unique file key
    const fileExtension = filename.split('.').pop();
    const fileKey = `uploads/${uuidv4()}.${fileExtension}`;

    try {
      const uploadUrl = await this.s3.getSignedUrlPromise('putObject', {
        Bucket: this.config.bucket,
        Key: fileKey,
        ContentType: contentType,
        Expires: 3600, // 1 hour
        ContentLength: fileSize,
      });

      const publicUrl = `${this.config.publicUrl}/${fileKey}`;

      logger.info(`Generated signed upload URL for file: ${filename}`);

      return {
        uploadUrl,
        fileKey,
        publicUrl,
      };
    } catch (error) {
      logger.error('Failed to generate signed upload URL:', error);
      throw new AppError('Failed to generate upload URL', 500);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      await this.s3.deleteObject({
        Bucket: this.config.bucket,
        Key: fileKey,
      }).promise();

      logger.info(`Deleted file: ${fileKey}`);
    } catch (error) {
      logger.error(`Failed to delete file ${fileKey}:`, error);
      throw new AppError('Failed to delete file', 500);
    }
  }

  async getFileStream(fileKey: string) {
    try {
      const stream = this.s3.getObject({
        Bucket: this.config.bucket,
        Key: fileKey,
      }).createReadStream();

      return stream;
    } catch (error) {
      logger.error(`Failed to get file stream for ${fileKey}:`, error);
      throw new AppError('File not found', 404);
    }
  }

  async copyFile(sourceKey: string, destinationKey: string): Promise<string> {
    try {
      await this.s3.copyObject({
        Bucket: this.config.bucket,
        CopySource: `${this.config.bucket}/${sourceKey}`,
        Key: destinationKey,
      }).promise();

      const publicUrl = `${this.config.publicUrl}/${destinationKey}`;
      logger.info(`Copied file from ${sourceKey} to ${destinationKey}`);

      return publicUrl;
    } catch (error) {
      logger.error(`Failed to copy file from ${sourceKey} to ${destinationKey}:`, error);
      throw new AppError('Failed to copy file', 500);
    }
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3.headBucket({ Bucket: this.config.bucket }).promise();
      logger.info(`S3 bucket ${this.config.bucket} exists`);
    } catch (error) {
      if ((error as AWS.AWSError).statusCode === 404) {
        try {
          await this.s3.createBucket({ Bucket: this.config.bucket }).promise();
          
          // Set bucket policy for public read access to files
          const bucketPolicy = {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicReadGetObject',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: `arn:aws:s3:::${this.config.bucket}/*`,
              },
            ],
          };

          await this.s3.putBucketPolicy({
            Bucket: this.config.bucket,
            Policy: JSON.stringify(bucketPolicy),
          }).promise();

          logger.info(`Created S3 bucket: ${this.config.bucket}`);
        } catch (createError) {
          logger.error('Failed to create S3 bucket:', createError);
        }
      } else {
        logger.error('Failed to check S3 bucket:', error);
      }
    }
  }

  getPublicUrl(fileKey: string): string {
    return `${this.config.publicUrl}/${fileKey}`;
  }
}