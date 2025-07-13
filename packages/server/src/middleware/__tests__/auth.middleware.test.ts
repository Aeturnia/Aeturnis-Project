import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticateToken, optionalAuth } from '../auth.middleware';
import * as jwtUtils from '../../utils/jwt';
import { HTTP_STATUS, MESSAGES } from '../../utils/constants';

// Mock the jwt utils
vi.mock('../../utils/jwt');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup request mock
    mockReq = {
      headers: {},
      user: undefined,
    };

    // Setup response mock
    jsonMock = vi.fn().mockReturnThis();
    statusMock = vi.fn().mockReturnThis();
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    // Setup next mock
    mockNext = vi.fn();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and attach user to request', async () => {
      const mockToken = 'valid-token';
      const mockPayload = {
        accountId: 'test-123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(mockToken);
      vi.mocked(jwtUtils.verifyToken).mockResolvedValue(mockPayload);

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(jwtUtils.extractBearerToken).toHaveBeenCalledWith(`Bearer ${mockToken}`);
      expect(jwtUtils.verifyToken).toHaveBeenCalledWith(mockToken);
      expect(mockReq.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', async () => {
      mockReq.headers = {};
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(null);

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: MESSAGES.GENERAL.UNAUTHORIZED,
        details: 'No token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for expired token', async () => {
      const mockToken = 'expired-token';
      const expiredError = new Error('Token expired');
      expiredError.name = 'TokenExpiredError';

      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(mockToken);
      vi.mocked(jwtUtils.verifyToken).mockRejectedValue(expiredError);

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: MESSAGES.GENERAL.UNAUTHORIZED,
        details: 'Please login again to get a new token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      const mockToken = 'invalid-token';
      const invalidError = new Error('Invalid token');
      invalidError.name = 'JsonWebTokenError';

      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(mockToken);
      vi.mocked(jwtUtils.verifyToken).mockRejectedValue(invalidError);

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: MESSAGES.GENERAL.UNAUTHORIZED,
        details: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle internal errors', async () => {
      const mockToken = 'token';
      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      vi.mocked(jwtUtils.extractBearerToken).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: MESSAGES.GENERAL.INTERNAL_ERROR,
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('optionalAuth', () => {
    it('should proceed without token', async () => {
      mockReq.headers = {};
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(null);

      await optionalAuth(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should attach user for valid token', async () => {
      const mockToken = 'valid-token';
      const mockPayload = {
        accountId: 'test-123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(mockToken);
      vi.mocked(jwtUtils.verifyToken).mockResolvedValue(mockPayload);

      await optionalAuth(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should proceed even with invalid token', async () => {
      const mockToken = 'invalid-token';
      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      vi.mocked(jwtUtils.extractBearerToken).mockReturnValue(mockToken);
      vi.mocked(jwtUtils.verifyToken).mockRejectedValue(new Error('Invalid token'));

      await optionalAuth(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockReq.headers = { authorization: 'Bearer token' };
      vi.mocked(jwtUtils.extractBearerToken).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await optionalAuth(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});