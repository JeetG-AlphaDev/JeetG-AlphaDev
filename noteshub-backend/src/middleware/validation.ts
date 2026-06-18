import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './error';

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
};

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    email: commonSchemas.email,
    username: commonSchemas.username,
    password: commonSchemas.password,
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    avatar: Joi.string().uri().optional(),
    theme: Joi.string().valid('light', 'dark').optional(),
    language: Joi.string().length(2).optional(),
    timezone: Joi.string().optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password,
  }),
};

// Note validation schemas
export const noteSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().max(100000).optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
    isPublic: Joi.boolean().default(false),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    content: Joi.string().max(100000).optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
    isPublic: Joi.boolean().optional(),
    isPinned: Joi.boolean().optional(),
    isArchived: Joi.boolean().optional(),
    isFavorite: Joi.boolean().optional(),
  }),

  search: Joi.object({
    q: Joi.string().max(200).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPublic: Joi.boolean().optional(),
    isPinned: Joi.boolean().optional(),
    isArchived: Joi.boolean().optional(),
    isFavorite: Joi.boolean().optional(),
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title').default('updatedAt'),
    sortOrder: commonSchemas.sortOrder,
  }),
};

// File validation schemas
export const fileSchemas = {
  upload: Joi.object({
    noteId: Joi.string().optional(),
  }),
};

// Chat validation schemas
export const chatSchemas = {
  createSession: Joi.object({
    title: Joi.string().max(100).optional(),
  }),

  sendMessage: Joi.object({
    content: Joi.string().min(1).max(4000).required(),
    sessionId: commonSchemas.id,
  }),
};

// Admin validation schemas
export const adminSchemas = {
  create: Joi.object({
    email: commonSchemas.email,
    username: commonSchemas.username,
    password: commonSchemas.password,
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'MODERATOR').default('MODERATOR'),
    permissions: Joi.array().items(Joi.string()).optional(),
  }),

  update: Joi.object({
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'MODERATOR').optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
  }),
};

// Validation middleware factory
export function validate(schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      throw new ValidationError('Validation failed', details);
    }

    // Replace the original data with validated and sanitized data
    req[source] = value;
    next();
  };
}

// Common validation middleware
export const validateId = validate(Joi.object({ id: commonSchemas.id }), 'params');
export const validatePagination = validate(
  Joi.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
  }),
  'query'
);

// File validation
export function validateFileType(allowedTypes: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file;
    
    if (!file) {
      next();
      return;
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new ValidationError(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      );
    }

    next();
  };
}

export function validateFileSize(maxSize: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file;
    
    if (!file) {
      next();
      return;
    }

    if (file.size > maxSize) {
      throw new ValidationError(
        `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
      );
    }

    next();
  };
}