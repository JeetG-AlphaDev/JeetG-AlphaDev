import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiting';

const router = Router();

// Apply admin authentication and rate limiting
router.use(authenticateAdmin);
router.use(adminLimiter);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 */
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard endpoint - implementation coming soon',
  });
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', (req, res) => {
  res.json({
    success: true,
    message: 'Admin users endpoint - implementation coming soon',
  });
});

/**
 * @swagger
 * /api/admin/notes:
 *   get:
 *     summary: Get all notes (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 */
router.get('/notes', (req, res) => {
  res.json({
    success: true,
    message: 'Admin notes endpoint - implementation coming soon',
  });
});

export default router;