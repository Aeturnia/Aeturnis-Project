import jwt from 'jsonwebtoken';
import { SECURITY } from './constants';
import { JWTPayload, TokenType } from '../types/auth.types';

/**
 * Get JWT secret from environment or use default for development
 */
const getJWTSecret = (): string => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    console.warn('JWT_SECRET not set in environment, using default for development');
    return 'development-secret-key-change-in-production';
  }
  return secret;
};

/**
 * Get refresh token secret from environment
 */
const getRefreshTokenSecret = (): string => {
  const secret = process.env['JWT_REFRESH_SECRET'] || process.env['JWT_SECRET'];
  if (!secret) {
    console.warn('JWT_REFRESH_SECRET not set in environment, using default for development');
    return 'development-refresh-secret-key-change-in-production';
  }
  return secret;
};

/**
 * Generate JWT access token for authenticated user
 * @param accountId - The unique account identifier
 * @param email - The user's email address
 * @returns Signed JWT access token
 */
export const generateAccessToken = (accountId: string, email: string): string => {
  const payload: JWTPayload = {
    accountId,
    email,
  };

  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: SECURITY.JWT_EXPIRES_IN,
  });
};

/**
 * Generate JWT refresh token for authenticated user
 * @param accountId - The unique account identifier
 * @param email - The user's email address
 * @returns Signed JWT refresh token
 */
export const generateRefreshToken = (accountId: string, email: string): string => {
  const payload: JWTPayload = {
    accountId,
    email,
  };

  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn: SECURITY.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify and decode JWT token
 * @param token - The JWT token to verify
 * @param tokenType - Type of token (access or refresh)
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = async (
  token: string,
  tokenType: TokenType = TokenType.ACCESS
): Promise<JWTPayload> => {
  const secret = tokenType === TokenType.ACCESS ? getJWTSecret() : getRefreshTokenSecret();

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JWTPayload);
      }
    });
  });
};

/**
 * Extract bearer token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns Extracted token or null if not found
 */
export const extractBearerToken = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }

  // Check if it's a Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1] || null;
};

/**
 * Decode JWT token without verification (useful for extracting expiry time)
 * @param token - The JWT token to decode
 * @returns Decoded JWT payload or null if invalid
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token);
    return decoded as JWTPayload | null;
  } catch {
    return null;
  }
};

/**
 * Check if a token is expired
 * @param token - The JWT token to check
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};