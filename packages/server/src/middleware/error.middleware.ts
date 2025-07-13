import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

/**
 * Custom error classes for different error types
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public isOperational = true,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = MESSAGES.GENERAL.UNAUTHORIZED) {
    super(HTTP_STATUS.UNAUTHORIZED, message, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = MESSAGES.GENERAL.FORBIDDEN) {
    super(HTTP_STATUS.FORBIDDEN, message, true);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(HTTP_STATUS.NOT_FOUND, `${resource} not found`, true);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(HTTP_STATUS.CONFLICT, message, true);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, message, true);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  stack?: string;
}

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging
  // TODO(claude): Replace with proper logging service
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    user: req.user?.accountId,
  });

  // Default error values
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message: string = MESSAGES.GENERAL.INTERNAL_ERROR;
  let details: unknown;

  // Handle known error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    // Zod validation errors
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = MESSAGES.GENERAL.VALIDATION_ERROR;
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma errors
    switch (err.code) {
      case 'P2002':
        statusCode = HTTP_STATUS.CONFLICT;
        message = 'Unique constraint violation';
        details = { field: err.meta?.['target'] };
        break;
      case 'P2025':
        statusCode = HTTP_STATUS.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Foreign key constraint violation';
        break;
      default:
        message = 'Database operation failed';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid database query';
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: message,
  };

  // Add details in development
  if (process.env['NODE_ENV'] !== 'production') {
    if (details) {
      errorResponse.details = details;
    }
    if (err.stack) {
      errorResponse.stack = err.stack;
    }
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper for route handlers
 * Catches async errors and passes them to error handler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 * Should be placed after all routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
};

/**
 * Development error logger middleware
 * TODO(claude): Replace with proper logging in production
 */
export const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction): void => {
  if (process.env['NODE_ENV'] !== 'production') {
    console.error('\n=== Error Details ===');
    console.error('Time:', new Date().toISOString());
    console.error('Request:', `${req.method} ${req.originalUrl}`);
    console.error('Body:', req.body);
    console.error('Params:', req.params);
    console.error('Query:', req.query);
    console.error('User:', req.user);
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    console.error('===================\n');
  }
  next(err);
};

/**
 * Create error for common scenarios
 */
export const createError = {
  badRequest: (message: string) => new BadRequestError(message),
  unauthorized: (message?: string) => new AuthenticationError(message),
  forbidden: (message?: string) => new AuthorizationError(message),
  notFound: (resource: string) => new NotFoundError(resource),
  conflict: (message: string) => new ConflictError(message),
  validation: (message: string, details?: unknown) => new ValidationError(message, details),
  internal: (message: string = MESSAGES.GENERAL.INTERNAL_ERROR) =>
    new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, false),
};
