import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateToken);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'User profile endpoint - implementation coming soon',
  });
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Update profile endpoint - implementation coming soon',
  });
});

export default router;