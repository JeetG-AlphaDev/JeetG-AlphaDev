import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { JWTPayload, AuthTokens } from '../types';

export function generateAccessToken(userId: string, email: string, username: string): string {
  const payload: JWTPayload = {
    userId,
    email,
    username,
    type: 'access',
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'noteshub-api',
    audience: 'noteshub-client',
  } as jwt.SignOptions);
}

export function generateRefreshToken(userId: string, email: string, username: string): string {
  const payload: JWTPayload = {
    userId,
    email,
    username,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'noteshub-api',
    audience: 'noteshub-client',
  } as jwt.SignOptions);
}

export function generateTokenPair(userId: string, email: string, username: string): AuthTokens {
  return {
    accessToken: generateAccessToken(userId, email, username),
    refreshToken: generateRefreshToken(userId, email, username),
  };
}

export function verifyAccessToken(token: string): JWTPayload {
  const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;
  
  if (payload.type !== 'access') {
    throw new Error('Invalid token type');
  }
  
  return payload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  const payload = jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
  
  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  
  return payload;
}

export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  return expiration ? expiration < new Date() : true;
}