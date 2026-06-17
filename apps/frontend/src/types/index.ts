export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  isPremium: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  slug: string;
  subject: string;
  class?: string;
  tags: string[];
  description?: string;
  contentHtml?: string;
  contentText?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  license?: string;
  version: number;
  downloads: number;
  views: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    annotations: number;
    aiQueries: number;
  };
}

export interface Annotation {
  id: string;
  noteId: string;
  userId: string;
  rangeStart: number;
  rangeEnd: number;
  text: string;
  color?: string;
  createdAt: string;
  note?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface AIQuery {
  id: string;
  userId: string;
  noteId?: string;
  question: string;
  response?: string;
  context?: string;
  tokensUsed?: number;
  cached: boolean;
  error?: string;
  createdAt: string;
  note?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface SearchFilters {
  query?: string;
  subject?: string;
  tags?: string[];
  visibility?: 'PUBLIC' | 'PRIVATE';
  ownerId?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

export interface UploadSession {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  processed: boolean;
  noteId?: string;
  createdAt: string;
  expiresAt: string;
  expired: boolean;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  sessionId: string;
  expiresAt: string;
}

export interface AIUsage {
  today: number;
  month: number;
  totalTokens: number;
  dailyLimit: number;
  remaining: number;
  isPremium: boolean;
}

export interface AdSlot {
  id: string;
  name: string;
  page: string;
  position: string;
  code?: string;
  enabled: boolean;
}

export interface Report {
  id: string;
  noteId: string;
  reporterId: string;
  reason: string;
  details?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  resolvedBy?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
  note?: {
    id: string;
    title: string;
    slug: string;
  };
  reporter?: {
    id: string;
    name: string;
    email: string;
  };
}