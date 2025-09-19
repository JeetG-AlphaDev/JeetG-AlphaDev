import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { prisma } from '../config/database';
import { UserPayload, AuthenticatedRequest, JWTPayload } from '../types';

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    if (decoded.type !== 'access') {
      res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
      return;
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: 'user',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
      });
      return;
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export async function authenticateOptional(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    if (decoded.type === 'access') {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          isEmailVerified: true,
        },
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: 'user',
        };
      }
    }

    next();
  } catch (error) {
    // Silently fail for optional authentication
    next();
  }
}

export async function authenticateAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Check if this is an admin token (you might want to use a different secret or payload)
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        permissions: true,
      },
    });

    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        error: 'Admin not found or inactive',
      });
      return;
    }

    req.user = {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: 'admin',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
      });
      return;
    }

    console.error('Admin authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Admin privileges required',
      });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { permissions: true, role: true },
    });

    if (!admin) {
      res.status(403).json({
        success: false,
        error: 'Admin not found',
      });
      return;
    }

    // Super admin has all permissions
    if (admin.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    // Check if admin has the required permission
    if (!admin.permissions.includes(permission)) {
      res.status(403).json({
        success: false,
        error: `Permission required: ${permission}`,
      });
      return;
    }

    next();
  };
}