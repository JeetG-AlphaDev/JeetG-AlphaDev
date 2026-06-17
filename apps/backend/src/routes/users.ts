import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { prisma } from '../db/client';

const router = Router();

// Get current user profile
router.get('/profile',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isPremium: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              notes: true,
              annotations: true,
              aiQueries: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user profile
router.put('/profile',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const { name, avatar } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (avatar) updateData.avatar = avatar;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isPremium: true,
          emailVerified: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user's notes
router.get('/notes',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      const [notes, total] = await Promise.all([
        prisma.note.findMany({
          where: { ownerId: userId },
          include: {
            _count: {
              select: {
                annotations: true,
                aiQueries: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.note.count({
          where: { ownerId: userId },
        }),
      ]);

      res.json({
        success: true,
        data: {
          notes,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user's annotations
router.get('/annotations',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      const [annotations, total] = await Promise.all([
        prisma.annotation.findMany({
          where: { userId },
          include: {
            note: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.annotation.count({
          where: { userId },
        }),
      ]);

      res.json({
        success: true,
        data: {
          annotations,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete user account
router.delete('/account',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;

      // This would typically require additional confirmation
      // For now, we'll just mark the account for deletion
      await prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${Date.now()}@deleted.com`,
          name: 'Deleted User',
          passwordHash: null,
          googleId: null,
        },
      });

      res.json({
        success: true,
        message: 'Account marked for deletion',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;