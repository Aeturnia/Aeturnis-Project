import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

/**
 * Validation target types
 */
export type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validation error response format
 */
export interface ValidationErrorResponse {
  success: false;
  error: string;
  details: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Generic validation middleware factory
 * Creates middleware that validates request data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate (body, query, or params)
 * @returns Express middleware function
 */
export const validate = <T extends ZodSchema>(schema: T, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get data based on target
      const dataToValidate = req[target];

      // Parse and validate the data
      const validatedData = schema.parse(dataToValidate);

      // Replace the original data with validated/transformed data
      req[target] = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ValidationErrorResponse = {
          success: false,
          error: MESSAGES.GENERAL.VALIDATION_ERROR,
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };

        res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(errorResponse);
        return;
      }

      // Non-validation errors
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: MESSAGES.GENERAL.INTERNAL_ERROR,
      });
    }
  };
};

/**
 * Validate multiple targets at once
 */
export interface MultiValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateMultiple = (schemas: MultiValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const errors: Array<{ field: string; message: string }> = [];

      // Validate each target if schema is provided
      for (const [target, schema] of Object.entries(schemas)) {
        if (schema) {
          try {
            const validatedData = schema.parse(req[target as ValidationTarget]);
            req[target as ValidationTarget] = validatedData;
          } catch (error) {
            if (error instanceof ZodError) {
              errors.push(
                ...error.errors.map((err) => ({
                  field: `${target}.${err.path.join('.')}`,
                  message: err.message,
                }))
              );
            }
          }
        }
      }

      if (errors.length > 0) {
        const errorResponse: ValidationErrorResponse = {
          success: false,
          error: MESSAGES.GENERAL.VALIDATION_ERROR,
          details: errors,
        };

        res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(errorResponse);
        return;
      }

      next();
    } catch {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: MESSAGES.GENERAL.INTERNAL_ERROR,
      });
    }
  };
};

/**
 * Common validation schemas
 * TODO(claude): Move these to their respective feature modules
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),

  // ID parameter
  idParam: z.object({
    id: z.string().uuid(),
  }),

  // Character ID parameter
  characterIdParam: z.object({
    characterId: z.string().uuid(),
  }),

  // Account ID parameter
  accountIdParam: z.object({
    accountId: z.string().uuid(),
  }),
};

/**
 * Helper to create strict schemas that don't allow extra properties
 */
export const strictSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape).strict();
};

/**
 * Async validation middleware for complex validations
 * TODO(claude): Implement when needed for database validations
 */
export const validateAsync = <T extends ZodSchema>(
  schema: T,
  target: ValidationTarget = 'body',
  customValidation?: (data: z.infer<T>) => Promise<boolean | { error: string }>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Basic Zod validation
      const dataToValidate = req[target];
      const validatedData = schema.parse(dataToValidate);

      // Custom async validation if provided
      if (customValidation) {
        const result = await customValidation(validatedData);

        if (result !== true) {
          const error = typeof result === 'object' ? result.error : 'Validation failed';
          res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
            success: false,
            error,
          });
          return;
        }
      }

      req[target] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ValidationErrorResponse = {
          success: false,
          error: MESSAGES.GENERAL.VALIDATION_ERROR,
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };

        res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(errorResponse);
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: MESSAGES.GENERAL.INTERNAL_ERROR,
      });
    }
  };
};
