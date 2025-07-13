import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { zodValidator, zodValidatorMultiple, zodValidatorAsync } from './zodValidator.middleware';

describe('Zod Validator Middleware', () => {
  const mockNext = vi.fn() as NextFunction;
  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('zodValidator', () => {
    const testSchema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });

    it('should validate valid request body', () => {
      const req = {
        body: {
          email: 'test@example.com',
          age: 25,
        },
      } as Request;
      const res = mockResponse();

      zodValidator(testSchema)(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(req.body).toEqual({
        email: 'test@example.com',
        age: 25,
      });
    });

    it('should return 422 with validation errors', () => {
      const req = {
        body: {
          email: 'invalid-email',
          age: 15,
        },
      } as Request;
      const res = mockResponse();

      zodValidator(testSchema)(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Invalid email',
            code: 'invalid_string',
          }),
          expect.objectContaining({
            field: 'age',
            message: 'Number must be greater than or equal to 18',
            code: 'too_small',
          }),
        ]),
      });
    });

    it('should validate query parameters', () => {
      const req = {
        query: {
          email: 'test@example.com',
          age: '25', // Will be coerced
        },
      } as unknown as Request;
      const res = mockResponse();

      const querySchema = z.object({
        email: z.string().email(),
        age: z.coerce.number().min(18),
      });

      zodValidator(querySchema, 'query')(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(req.query).toEqual({
        email: 'test@example.com',
        age: 25,
      });
    });

    it('should validate params', () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      } as unknown as Request;
      const res = mockResponse();

      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      zodValidator(paramsSchema, 'params')(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
    });

    it('should use custom error message', () => {
      const req = {
        body: {},
      } as Request;
      const res = mockResponse();

      zodValidator(testSchema, 'body', { errorMessage: 'Custom error' })(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Custom error',
        })
      );
    });

    it('should handle stripUnknown option', () => {
      const req = {
        body: {
          email: 'test@example.com',
          age: 25,
          extraField: 'should be stripped',
        },
      } as Request;
      const res = mockResponse();

      zodValidator(testSchema, 'body', { stripUnknown: true })(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(req.body).toEqual({
        email: 'test@example.com',
        age: 25,
      });
    });
  });

  describe('zodValidatorMultiple', () => {
    it('should validate multiple targets', () => {
      const req = {
        params: { id: '123e4567-e89b-12d3-a456-426614174000' },
        body: { name: 'Test' },
        query: { page: '1', limit: '10' },
      } as unknown as Request;
      const res = mockResponse();

      const schemas = {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ name: z.string().min(2) }),
        query: z.object({
          page: z.coerce.number().positive(),
          limit: z.coerce.number().positive(),
        }),
      };

      zodValidatorMultiple(schemas)(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(req.query).toEqual({ page: 1, limit: 10 });
    });

    it('should collect errors from all targets', () => {
      const req = {
        params: { id: 'invalid-uuid' },
        body: { name: 'a' },
        query: { page: '-1' },
      } as unknown as Request;
      const res = mockResponse();

      const schemas = {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ name: z.string().min(2) }),
        query: z.object({ page: z.coerce.number().positive() }),
      };

      zodValidatorMultiple(schemas)(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: expect.arrayContaining([
          expect.objectContaining({ field: 'params.id' }),
          expect.objectContaining({ field: 'body.name' }),
          expect.objectContaining({ field: 'query.page' }),
        ]),
      });
    });
  });

  describe('zodValidatorAsync', () => {
    it('should validate with async custom validator', async () => {
      const req = {
        body: { email: 'test@example.com' },
      } as Request;
      const res = mockResponse();

      const schema = z.object({ email: z.string().email() });
      const customValidator = vi.fn().mockResolvedValue(true);

      await zodValidatorAsync(schema, 'body', customValidator)(req, res, mockNext);

      expect(customValidator).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockNext).toHaveBeenCalledOnce();
    });

    it('should fail with custom validator error', async () => {
      const req = {
        body: { email: 'test@example.com' },
      } as Request;
      const res = mockResponse();

      const schema = z.object({ email: z.string().email() });
      const customValidator = vi.fn().mockResolvedValue({
        error: 'Email already exists',
        code: 'EMAIL_EXISTS',
      });

      await zodValidatorAsync(schema, 'body', customValidator)(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already exists',
        code: 'EMAIL_EXISTS',
      });
    });

    it('should handle schema validation errors before custom validation', async () => {
      const req = {
        body: { email: 'invalid-email' },
      } as Request;
      const res = mockResponse();

      const schema = z.object({ email: z.string().email() });
      const customValidator = vi.fn();

      await zodValidatorAsync(schema, 'body', customValidator)(req, res, mockNext);

      expect(customValidator).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
    });
  });
});