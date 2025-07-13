import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';
import { verifyToken, extractBearerToken } from '../utils/jwt';

// Extend Express Request to include user data
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      accountId: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  }
}

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens from Authorization header and attaches user data to request
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: MESSAGES.GENERAL.UNAUTHORIZED,
        details: 'No token provided',
      });
      return;
    }

    // Verify token
    try {
      const payload = await verifyToken(token);
      
      // Attach user data to request
      req.user = {
        accountId: payload.accountId,
        email: payload.email,
        ...(payload.iat !== undefined && { iat: payload.iat }),
        ...(payload.exp !== undefined && { exp: payload.exp }),
      };

      next();
    } catch (error: unknown) {
      // Handle specific JWT errors
      const errorMessage = MESSAGES.GENERAL.UNAUTHORIZED;
      let details = 'Invalid token';

      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          details = 'Please login again to get a new token';
        } else if (error.name === 'JsonWebTokenError') {
          details = error.message;
        }
      }

      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: errorMessage,
        details,
      });
      return;
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: MESSAGES.GENERAL.INTERNAL_ERROR,
    });
  }
};

/**
 * Optional authentication middleware
 * Allows requests to proceed even without a valid token
 * but still attaches user data if token is valid
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      next();
      return;
    }

    try {
      const payload = await verifyToken(token);
      
      // Attach user data to request if token is valid
      req.user = {
        accountId: payload.accountId,
        email: payload.email,
        ...(payload.iat !== undefined && { iat: payload.iat }),
        ...(payload.exp !== undefined && { exp: payload.exp }),
      };
    } catch {
      // Silently ignore invalid tokens for optional auth
      // User data will simply not be attached
    }

    // Continue regardless of token validity
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Continue on errors for optional auth
    next();
  }
};
