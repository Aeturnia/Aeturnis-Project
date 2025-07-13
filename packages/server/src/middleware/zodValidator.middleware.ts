import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * HTTP status code for unprocessable entity (validation error)
 */
const UNPROCESSABLE_ENTITY = 422;

/**
 * Validation target types for different parts of the request
 */
export type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validation error response format
 */
export interface ValidationErrorResponse {
  success: false;
  error: string;
  code: 'VALIDATION_ERROR';
  details: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Options for the Zod validator middleware
 */
export interface ZodValidatorOptions {
  /**
   * Whether to strip unknown properties from the validated data
   * @default true
   */
  stripUnknown?: boolean;

  /**
   * Custom error message for validation errors
   */
  errorMessage?: string;

  /**
   * Whether to include the error code in the error details
   * @default true
   */
  includeErrorCode?: boolean;
}

/**
 * Creates a validation middleware using a Zod schema
 * 
 * @param schema - The Zod schema to validate against
 * @param target - Which part of the request to validate (body, query, or params)
 * @param options - Additional options for validation
 * @returns Express middleware function
 * 
 * @example
 * ```typescript
 * app.post('/users', 
 *   zodValidator(createUserSchema, 'body'),
 *   createUserController
 * );
 * ```
 */
export const zodValidator = <T extends ZodSchema>(
  schema: T,
  target: ValidationTarget = 'body',
  options: ZodValidatorOptions = {}
) => {
  const {
    stripUnknown = true,
    errorMessage = 'Validation failed',
    includeErrorCode = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get data based on target
      const dataToValidate = req[target];

      // Parse and validate the data
      const validatedData = stripUnknown
        ? schema.parse(dataToValidate)
        : schema.parse(dataToValidate);

      // Replace the original data with validated/transformed data
      req[target] = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ValidationErrorResponse = {
          success: false,
          error: errorMessage,
          code: 'VALIDATION_ERROR',
          details: error.errors.map((err) => {
            const detail: ValidationErrorResponse['details'][0] = {
              field: err.path.join('.'),
              message: err.message,
            };

            if (includeErrorCode && err.code) {
              detail.code = err.code;
            }

            return detail;
          }),
        };

        res.status(UNPROCESSABLE_ENTITY).json(errorResponse);
        return;
      }

      // Non-validation errors (shouldn't happen with Zod, but just in case)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  };
};

/**
 * Configuration for validating multiple targets
 */
export interface MultiTargetValidation {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Creates a validation middleware that validates multiple request targets
 * 
 * @param schemas - Object containing schemas for different request targets
 * @param options - Additional options for validation
 * @returns Express middleware function
 * 
 * @example
 * ```typescript
 * app.put('/users/:id', 
 *   zodValidatorMultiple({
 *     params: userIdSchema,
 *     body: updateUserSchema,
 *     query: paginationSchema
 *   }),
 *   updateUserController
 * );
 * ```
 */
export const zodValidatorMultiple = (
  schemas: MultiTargetValidation,
  options: ZodValidatorOptions = {}
) => {
  const {
    stripUnknown = true,
    errorMessage = 'Validation failed',
    includeErrorCode = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationErrorResponse['details'] = [];

    // Validate each target if schema is provided
    for (const [target, schema] of Object.entries(schemas)) {
      if (schema) {
        try {
          const dataToValidate = req[target as ValidationTarget];
          
          // Parse and validate
          const validatedData = stripUnknown
            ? schema.parse(dataToValidate)
            : schema.parse(dataToValidate);
          
          // Replace with validated data
          req[target as ValidationTarget] = validatedData;
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.errors.map((err) => {
                const detail: ValidationErrorResponse['details'][0] = {
                  field: `${target}.${err.path.join('.')}`,
                  message: err.message,
                };

                if (includeErrorCode && err.code) {
                  detail.code = err.code;
                }

                return detail;
              })
            );
          }
        }
      }
    }

    if (errors.length > 0) {
      const errorResponse: ValidationErrorResponse = {
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR',
        details: errors,
      };

      res.status(UNPROCESSABLE_ENTITY).json(errorResponse);
      return;
    }

    next();
  };
};

/**
 * Creates an async validation middleware for complex validations
 * 
 * @param schema - The Zod schema to validate against
 * @param target - Which part of the request to validate
 * @param customValidator - Optional async custom validation function
 * @param options - Additional options for validation
 * @returns Async Express middleware function
 * 
 * @example
 * ```typescript
 * app.post('/users', 
 *   zodValidatorAsync(
 *     createUserSchema, 
 *     'body',
 *     async (data) => {
 *       const exists = await userService.checkEmailExists(data.email);
 *       return exists ? { error: 'Email already exists' } : true;
 *     }
 *   ),
 *   createUserController
 * );
 * ```
 */
export const zodValidatorAsync = <T extends ZodSchema>(
  schema: T,
  target: ValidationTarget = 'body',
  customValidator?: (data: z.infer<T>) => Promise<true | { error: string; code?: string }>,
  options: ZodValidatorOptions = {}
) => {
  const {
    stripUnknown = true,
    errorMessage = 'Validation failed',
    includeErrorCode = true,
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get data based on target
      const dataToValidate = req[target];

      // Parse and validate with Zod
      const validatedData = stripUnknown
        ? schema.parse(dataToValidate)
        : schema.parse(dataToValidate);

      // Run custom async validation if provided
      if (customValidator) {
        const result = await customValidator(validatedData);
        
        if (result !== true) {
          res.status(UNPROCESSABLE_ENTITY).json({
            success: false,
            error: result.error,
            code: result.code || 'CUSTOM_VALIDATION_ERROR',
          });
          return;
        }
      }

      // Replace with validated data
      req[target] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ValidationErrorResponse = {
          success: false,
          error: errorMessage,
          code: 'VALIDATION_ERROR',
          details: error.errors.map((err) => {
            const detail: ValidationErrorResponse['details'][0] = {
              field: err.path.join('.'),
              message: err.message,
            };

            if (includeErrorCode && err.code) {
              detail.code = err.code;
            }

            return detail;
          }),
        };

        res.status(UNPROCESSABLE_ENTITY).json(errorResponse);
        return;
      }

      // Non-validation errors
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  };
};