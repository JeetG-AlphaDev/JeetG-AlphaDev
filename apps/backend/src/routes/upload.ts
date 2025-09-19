import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { StorageService } from '../services/storage.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { prisma } from '../db/client';

const router = Router();
const storageService = new StorageService();

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

// Generate signed upload URL
router.post('/url',
  [
    body('filename').trim().isLength({ min: 1, max: 255 }).withMessage('Filename is required and must be under 255 characters'),
    body('contentType').isIn([
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]).withMessage('Unsupported file type'),
    body('fileSize').isInt({ min: 1, max: 52428800 }).withMessage('File size must be between 1 byte and 50MB'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { filename, contentType, fileSize } = req.body;
      const userId = req.user!.id;

      // Generate signed URL
      const uploadInfo = await storageService.generateSignedUploadUrl({
        filename,
        contentType,
        fileSize,
      });

      // Create upload session
      const uploadSession = await prisma.uploadSession.create({
        data: {
          userId,
          filename,
          fileSize,
          mimeType: contentType,
          uploadUrl: uploadInfo.uploadUrl,
          expiresAt: new Date(Date.now() + 3600000), // 1 hour
        },
      });

      res.json({
        success: true,
        data: {
          uploadUrl: uploadInfo.uploadUrl,
          fileKey: uploadInfo.fileKey,
          publicUrl: uploadInfo.publicUrl,
          sessionId: uploadSession.id,
          expiresAt: uploadSession.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Confirm upload completion and process file
router.post('/callback',
  [
    body('sessionId').isString().withMessage('Session ID is required'),
    body('noteId').isString().withMessage('Note ID is required'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { sessionId, noteId } = req.body;
      const userId = req.user!.id;

      // Get upload session
      const uploadSession = await prisma.uploadSession.findUnique({
        where: { id: sessionId },
      });

      if (!uploadSession) {
        throw new AppError('Upload session not found', 404);
      }

      if (uploadSession.userId !== userId) {
        throw new AppError('Unauthorized access to upload session', 403);
      }

      if (uploadSession.processed) {
        throw new AppError('Upload already processed', 400);
      }

      if (new Date() > uploadSession.expiresAt) {
        throw new AppError('Upload session expired', 400);
      }

      // Get note
      const note = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new AppError('Note not found', 404);
      }

      if (note.ownerId !== userId) {
        throw new AppError('You can only upload files to your own notes', 403);
      }

      // Extract file key from upload URL
      const fileKey = uploadSession.uploadUrl.split('?')[0].split('/').pop();
      if (!fileKey) {
        throw new AppError('Invalid upload URL', 400);
      }

      const publicUrl = storageService.getPublicUrl(`uploads/${fileKey}`);

      // Update note with file URL
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: {
          fileUrl: publicUrl,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Mark upload session as processed
      await prisma.uploadSession.update({
        where: { id: sessionId },
        data: {
          processed: true,
          noteId,
        },
      });

      // Queue file processing (for now, we'll just mark it as complete)
      // In a real implementation, you'd queue this for background processing
      // to extract text content, generate thumbnails, etc.

      res.json({
        success: true,
        data: {
          note: updatedNote,
          message: 'File uploaded successfully. Processing will begin shortly.',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get upload session status
router.get('/session/:sessionId',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.id;

      const uploadSession = await prisma.uploadSession.findUnique({
        where: { id: sessionId },
      });

      if (!uploadSession) {
        throw new AppError('Upload session not found', 404);
      }

      if (uploadSession.userId !== userId) {
        throw new AppError('Unauthorized access to upload session', 403);
      }

      res.json({
        success: true,
        data: {
          id: uploadSession.id,
          filename: uploadSession.filename,
          fileSize: uploadSession.fileSize,
          mimeType: uploadSession.mimeType,
          processed: uploadSession.processed,
          noteId: uploadSession.noteId,
          createdAt: uploadSession.createdAt,
          expiresAt: uploadSession.expiresAt,
          expired: new Date() > uploadSession.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;