import { Request } from 'express';

// Define interfaces directly instead of importing from Prisma
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  githubId?: string;
  theme: string;
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  tags: string[];
  isPublic: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  wordCount: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface File {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
  s3Key?: string;
  s3Bucket?: string;
  isImage: boolean;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  noteId?: string;
}

export interface ChatSession {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Admin {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// User related types
export interface UserPayload {
  id: string;
  email: string;
  username: string;
  role?: 'user' | 'admin';
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  theme?: string;
  language?: string;
  timezone?: string;
}

// Note related types
export interface CreateNoteRequest {
  title: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
}

export interface NoteSearchQuery {
  q?: string;
  tags?: string[];
  isPublic?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// File related types
export interface FileUploadRequest {
  noteId?: string;
}

export interface FileMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
  s3Key?: string;
  s3Bucket?: string;
}

// Chat related types
export interface CreateChatSessionRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
  sessionId: string;
}

export interface ChatMessageResponse {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  createdAt: Date;
  tokens?: number;
  model?: string;
}

// Admin related types
export interface CreateAdminRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  permissions?: string[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalNotes: number;
  totalFiles: number;
  totalStorage: number;
  activeUsers: number;
  newUsersToday: number;
  notesCreatedToday: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface OAuthProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: 'google' | 'github';
}

// Middleware types
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface AdminAuthenticatedRequest extends Request {
  admin?: Admin;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Search types
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NotesSearchResult extends SearchResult<Note> {
  facets?: {
    tags: Array<{ tag: string; count: number }>;
    authors: Array<{ authorId: string; authorName: string; count: number }>;
  };
}

// File storage types
export interface S3UploadResult {
  key: string;
  bucket: string;
  location: string;
  etag: string;
}

export interface FileProcessingJob {
  fileId: string;
  type: 'thumbnail' | 'metadata' | 'virus-scan';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

// Rate limiting types
export interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: Date;
}

// Audit log types
export interface AuditLogEntry {
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  adminId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// Database types
export type UserWithNotes = User & {
  notes: Note[];
  _count?: {
    notes: number;
    files: number;
  };
};

export type NoteWithUser = Note & {
  user: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'avatar'>;
  files?: File[];
};

export type ChatSessionWithMessages = ChatSession & {
  messages: ChatMessageResponse[];
  _count?: {
    messages: number;
  };
};

// Utility types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Environment specific types
export type NodeEnv = 'development' | 'production' | 'test';

// Health check types
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
    };
    redis?: {
      status: 'up' | 'down';
      responseTime?: number;
    };
    s3?: {
      status: 'up' | 'down';
      responseTime?: number;
    };
  };
}