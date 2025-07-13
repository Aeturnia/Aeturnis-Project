import { z } from 'zod';
import { 
  zodValidator, 
  zodValidatorMultiple, 
  zodValidatorAsync,
  type ValidationTarget,
  type MultiTargetValidation,
  type ValidationErrorResponse
} from './zodValidator.middleware';

/**
 * Re-export the new Zod validator functions as the primary validation methods
 */
export const validate = zodValidator;
export const validateMultiple = zodValidatorMultiple;
export const validateAsync = zodValidatorAsync;

/**
 * Re-export types for backward compatibility
 */
export type { ValidationTarget, ValidationErrorResponse };

/**
 * Legacy interface for backward compatibility
 * @deprecated Use MultiTargetValidation from zodValidator.middleware instead
 */
export interface MultiValidationSchema extends MultiTargetValidation {}

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
