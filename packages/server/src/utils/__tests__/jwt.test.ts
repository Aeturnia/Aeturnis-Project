import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  extractBearerToken,
  decodeToken,
  isTokenExpired,
} from '../jwt';
import { TokenType } from '../../types/auth.types';

describe('JWT Utilities', () => {
  const mockAccountId = 'test-account-123';
  const mockEmail = 'test@example.com';
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Set up test environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ISSUER = 'test-issuer';
    process.env.JWT_AUDIENCE = 'test-audience';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(mockAccountId, mockEmail);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
    });

    it('should include correct payload in token', () => {
      const token = generateAccessToken(mockAccountId, mockEmail);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      
      expect(decoded.accountId).toBe(mockAccountId);
      expect(decoded.email).toBe(mockEmail);
      // Note: issuer and audience are not included in simplified implementation
    });

    it('should set expiration time', () => {
      const token = generateAccessToken(mockAccountId, mockEmail);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp > decoded.iat).toBe(true);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(mockAccountId, mockEmail);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should use refresh token secret', () => {
      const token = generateRefreshToken(mockAccountId, mockEmail);
      
      // Verify it uses the refresh secret
      expect(() => {
        jwt.verify(token, 'test-refresh-secret');
      }).not.toThrow();
      
      expect(() => {
        jwt.verify(token, 'test-secret'); // Wrong secret
      }).toThrow();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid access token', async () => {
      const token = generateAccessToken(mockAccountId, mockEmail);
      const payload = await verifyToken(token);
      
      expect(payload.accountId).toBe(mockAccountId);
      expect(payload.email).toBe(mockEmail);
    });

    it('should verify a valid refresh token', async () => {
      const token = generateRefreshToken(mockAccountId, mockEmail);
      const payload = await verifyToken(token, TokenType.REFRESH);
      
      expect(payload.accountId).toBe(mockAccountId);
      expect(payload.email).toBe(mockEmail);
    });

    it('should reject invalid token', async () => {
      await expect(verifyToken('invalid-token')).rejects.toThrow();
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { accountId: mockAccountId, email: mockEmail },
        'test-secret',
        { expiresIn: '-1h' }
      );
      
      await expect(verifyToken(expiredToken)).rejects.toThrow();
    });

    it('should reject token with wrong secret', async () => {
      const token = jwt.sign(
        { accountId: mockAccountId, email: mockEmail },
        'wrong-secret'
      );
      
      await expect(verifyToken(token)).rejects.toThrow();
    });
  });

  describe('extractBearerToken', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const authHeader = `Bearer ${token}`;
      
      expect(extractBearerToken(authHeader)).toBe(token);
    });

    it('should return null for missing header', () => {
      expect(extractBearerToken(undefined)).toBeNull();
      expect(extractBearerToken('')).toBeNull();
    });

    it('should return null for non-Bearer header', () => {
      expect(extractBearerToken('Basic dXNlcjpwYXNz')).toBeNull();
      expect(extractBearerToken('Token abc123')).toBeNull();
    });

    it('should return null for malformed Bearer header', () => {
      expect(extractBearerToken('Bearer')).toBeNull();
      expect(extractBearerToken('Bearer token extra')).toBeNull();
    });

    it('should handle case-insensitive Bearer prefix', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      expect(extractBearerToken(`bearer ${token}`)).toBe(token);
      expect(extractBearerToken(`BEARER ${token}`)).toBe(token);
    });
  });

  describe('decodeToken', () => {
    it('should decode valid token without verification', () => {
      const token = generateAccessToken(mockAccountId, mockEmail);
      const decoded = decodeToken(token);
      
      expect(decoded).not.toBeNull();
      expect(decoded?.accountId).toBe(mockAccountId);
      expect(decoded?.email).toBe(mockEmail);
    });

    it('should return null for invalid token', () => {
      expect(decodeToken('invalid-token')).toBeNull();
      expect(decodeToken('')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      const token = generateAccessToken(mockAccountId, mockEmail);
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const expiredToken = jwt.sign(
        { accountId: mockAccountId, email: mockEmail },
        'test-secret',
        { expiresIn: '-1h' }
      );
      
      expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
      expect(isTokenExpired('')).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const tokenWithoutExp = jwt.sign(
        { accountId: mockAccountId, email: mockEmail },
        'test-secret'
      );
      
      expect(isTokenExpired(tokenWithoutExp)).toBe(true);
    });
  });

  describe('environment variable handling', () => {
    it('should use default values when env vars are not set', () => {
      delete process.env.JWT_SECRET;
      delete process.env.JWT_REFRESH_SECRET;
      delete process.env.JWT_ISSUER;
      delete process.env.JWT_AUDIENCE;
      
      // Should not throw
      expect(() => generateAccessToken(mockAccountId, mockEmail)).not.toThrow();
      expect(() => generateRefreshToken(mockAccountId, mockEmail)).not.toThrow();
    });
  });
});