import { Router } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { NotesService } from '../services/notes.service';
import { StorageService } from '../services/storage.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';

const router = Router();
const notesService = new NotesService();
const storageService = new StorageService();

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

// Get popular notes (public)
router.get('/popular',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const notes = await notesService.getPopularNotes(limit);

      res.json({
        success: true,
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get recent notes (public)
router.get('/recent',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const notes = await notesService.getRecentNotes(limit);

      res.json({
        success: true,
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Search notes (public/private based on auth)
router.get('/search',
  [
    query('query').optional().isString().isLength({ max: 200 }).withMessage('Query too long'),
    query('subject').optional().isString().isLength({ max: 100 }).withMessage('Subject too long'),
    query('tags').optional().isString().withMessage('Tags must be a string'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'views', 'downloads', 'title']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const filters = {
        query: req.query.query as string,
        subject: req.query.subject as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        visibility: req.query.visibility as 'PUBLIC' | 'PRIVATE',
        ownerId: req.query.ownerId as string,
      };

      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        sortBy: req.query.sortBy as any || 'createdAt',
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc',
      };

      const result = await notesService.searchNotes(filters, pagination, req.user?.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create note (authenticated)
router.post('/',
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be under 200 characters'),
    body('subject').trim().isLength({ min: 1, max: 100 }).withMessage('Subject is required and must be under 100 characters'),
    body('class').optional().trim().isLength({ max: 100 }).withMessage('Class must be under 100 characters'),
    body('tags').isArray().withMessage('Tags must be an array'),
    body('tags.*').isString().isLength({ max: 50 }).withMessage('Each tag must be under 50 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be under 1000 characters'),
    body('license').optional().isString().isLength({ max: 100 }).withMessage('License must be under 100 characters'),
    body('visibility').isIn(['PUBLIC', 'PRIVATE']).withMessage('Visibility must be PUBLIC or PRIVATE'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const noteData = {
        ...req.body,
        ownerId: req.user!.id,
      };

      const note = await notesService.createNote(noteData);

      res.status(201).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get note by slug (public/private based on visibility and auth)
router.get('/slug/:slug',
  [
    param('slug').isString().isLength({ min: 1 }).withMessage('Slug is required'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { slug } = req.params;
      const note = await notesService.getNoteBySlug(slug, req.user?.id);

      res.json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get note by ID (public/private based on visibility and auth)
router.get('/:id',
  [
    param('id').isString().isLength({ min: 1 }).withMessage('Note ID is required'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const note = await notesService.getNoteById(id, req.user?.id);

      res.json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update note (authenticated, owner only)
router.put('/:id',
  [
    param('id').isString().isLength({ min: 1 }).withMessage('Note ID is required'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be under 200 characters'),
    body('subject').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Subject must be under 100 characters'),
    body('class').optional().trim().isLength({ max: 100 }).withMessage('Class must be under 100 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').optional().isString().isLength({ max: 50 }).withMessage('Each tag must be under 50 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be under 1000 characters'),
    body('license').optional().isString().isLength({ max: 100 }).withMessage('License must be under 100 characters'),
    body('visibility').optional().isIn(['PUBLIC', 'PRIVATE']).withMessage('Visibility must be PUBLIC or PRIVATE'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const note = await notesService.updateNote(id, req.body, req.user!.id);

      res.json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete note (authenticated, owner only)
router.delete('/:id',
  [
    param('id').isString().isLength({ min: 1 }).withMessage('Note ID is required'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      await notesService.deleteNote(id, req.user!.id);

      res.json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Download note file
router.get('/:id/download',
  [
    param('id').isString().isLength({ min: 1 }).withMessage('Note ID is required'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const note = await notesService.getNoteById(id, req.user?.id);

      if (!note.fileUrl) {
        throw new AppError('No file available for download', 404);
      }

      // Increment download count
      await notesService.incrementDownloadCount(id);

      // Get file stream from storage
      const fileKey = note.fileUrl.split('/').pop();
      if (!fileKey) {
        throw new AppError('Invalid file URL', 400);
      }

      const stream = await storageService.getFileStream(`uploads/${fileKey}`);

      // Set headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${note.title}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;