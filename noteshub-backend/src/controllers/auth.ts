import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/crypto';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { 
  CreateUserRequest, 
  LoginRequest, 
  ApiResponse, 
  AuthTokens,
  AuthenticatedRequest 
} from '../types';
import { 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError,
  asyncHandler 
} from '../middleware/error';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, firstName, lastName } = req.body as CreateUserRequest;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError('Email is already registered');
    }
    if (existingUser.username === username) {
      throw new ConflictError('Username is already taken');
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokens = generateTokenPair(user.id, user.email, user.username);

  const response: ApiResponse<{ user: typeof user; tokens: AuthTokens }> = {
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      tokens,
    },
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequest;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      firstName: true,
      lastName: true,
      avatar: true,
      isEmailVerified: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password!);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokens = generateTokenPair(user.id, user.email, user.username);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  const response: ApiResponse<{ user: typeof userWithoutPassword; tokens: AuthTokens }> = {
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      tokens,
    },
  };

  res.json(response);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      username: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // Generate new tokens
  const tokens = generateTokenPair(user.id, user.email, user.username);

  const response: ApiResponse<AuthTokens> = {
    success: true,
    message: 'Tokens refreshed successfully',
    data: tokens,
  };

  res.json(response);
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // In a production app, you might want to blacklist the token
  // For now, we'll just return success
  
  const response: ApiResponse = {
    success: true,
    message: 'Logged out successfully',
  };

  res.json(response);
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      theme: true,
      language: true,
      timezone: true,
      isEmailVerified: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          notes: true,
          files: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const response: ApiResponse<typeof user> = {
    success: true,
    data: user,
  };

  res.json(response);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  // Always return success to prevent email enumeration
  const response: ApiResponse = {
    success: true,
    message: 'If the email exists, a password reset link has been sent',
  };

  if (user) {
    // In a real app, you would:
    // 1. Generate a reset token
    // 2. Save it to the database with expiry
    // 3. Send an email with the reset link
    // For now, we'll just log it
    console.log(`Password reset requested for ${email}`);
  }

  res.json(response);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  // In a real app, you would verify the reset token
  // For now, we'll just return an error
  throw new UnauthorizedError('Password reset functionality not implemented');
});