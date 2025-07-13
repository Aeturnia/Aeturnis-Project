import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS, MESSAGES, SECURITY } from '../utils/constants';

// Extend Express Request to include user data
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      accountId: string;
      email: string;
      // TODO(claude): Add more user properties as needed
    };
  }
}

export interface JwtPayload {
  accountId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens from Authorization header and attaches user data to request
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: MESSAGES.GENERAL.UNAUTHORIZED,
      });
      return;
    }

    // TODO(claude): Move JWT_SECRET to environment variable
    const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

    // Verify token
    jwt.verify(token, JWT_SECRET, (_err, decoded) => {
      if (_err) {
        // TODO(claude): Add more specific error handling (expired, invalid, etc.)
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: MESSAGES.GENERAL.UNAUTHORIZED,
        });
        return;
      }

      // Attach user data to request
      const payload = decoded as JwtPayload;
      req.user = {
        accountId: payload.accountId,
        email: payload.email,
      };

      next();
    });
  } catch {
    // TODO(claude): Add proper error logging
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
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

    jwt.verify(token, JWT_SECRET, (_err, decoded) => {
      if (!_err && decoded) {
        const payload = decoded as JwtPayload;
        req.user = {
          accountId: payload.accountId,
          email: payload.email,
        };
      }
      // Continue regardless of token validity
      next();
    });
  } catch {
    // TODO(claude): Add proper error logging
    next();
  }
};

/**
 * Generate JWT token for authenticated user
 * TODO(claude): Move this to auth service
 */
export const generateToken = (accountId: string, email: string): string => {
  const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

  const payload: JwtPayload = {
    accountId,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: SECURITY.JWT_EXPIRES_IN,
  });
};
