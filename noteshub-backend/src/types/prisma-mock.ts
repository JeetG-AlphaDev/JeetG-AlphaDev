// Mock Prisma Client types for development when Prisma is not available
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

// Mock PrismaClient
export const PrismaClient = class {
  user = {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({} as User),
    update: () => Promise.resolve({} as User),
    delete: () => Promise.resolve({} as User),
    count: () => Promise.resolve(0),
  };

  note = {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({} as Note),
    update: () => Promise.resolve({} as Note),
    delete: () => Promise.resolve({} as Note),
    count: () => Promise.resolve(0),
  };

  file = {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({} as File),
    update: () => Promise.resolve({} as File),
    delete: () => Promise.resolve({} as File),
    count: () => Promise.resolve(0),
  };

  chatSession = {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({} as ChatSession),
    update: () => Promise.resolve({} as ChatSession),
    delete: () => Promise.resolve({} as ChatSession),
    count: () => Promise.resolve(0),
  };

  admin = {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({} as Admin),
    update: () => Promise.resolve({} as Admin),
    delete: () => Promise.resolve({} as Admin),
    count: () => Promise.resolve(0),
  };

  $connect = () => Promise.resolve();
  $disconnect = () => Promise.resolve();
  $queryRaw = () => Promise.resolve([]);
  $executeRaw = () => Promise.resolve(0);
  $transaction = (fn: any) => fn(this);
};