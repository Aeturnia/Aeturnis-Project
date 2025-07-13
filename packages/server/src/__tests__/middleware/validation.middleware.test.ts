import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate, validateMultiple, strictSchema } from '../../middleware/validation.middleware';
import { HTTP_STATUS } from '../../utils/constants';

describe('Validation Middleware', () => {
  const mockRequest = (body = {}, query = {}, params = {}) =>
    ({
      body,
      query,
      params,
    }) as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      const req = mockRequest({ email: 'test@example.com', age: 25 });
      const res = mockResponse();

      validate(schema)(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid data', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      const req = mockRequest({ email: 'invalid-email', age: 15 });
      const res = mockResponse();

      validate(schema)(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNPROCESSABLE_ENTITY);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Validation error',
          details: expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              message: 'Invalid email',
            }),
            expect.objectContaining({
              field: 'age',
              message: 'Number must be greater than or equal to 18',
            }),
          ]),
        })
      );
    });

    it('should validate query parameters', () => {
      const schema = z.object({
        page: z.coerce.number().positive(),
        limit: z.coerce.number().positive().max(100),
      });

      const req = mockRequest({}, { page: '2', limit: '50' });
      const res = mockResponse();

      validate(schema, 'query')(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.query).toEqual({ page: 2, limit: 50 });
    });
  });

  describe('validateMultiple', () => {
    it('should validate multiple targets', () => {
      const schemas = {
        body: z.object({ name: z.string() }),
        params: z.object({ id: z.string().uuid() }),
      };

      const req = mockRequest({ name: 'Test' }, {}, { id: '123e4567-e89b-12d3-a456-426614174000' });
      const res = mockResponse();

      validateMultiple(schemas)(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should collect errors from multiple targets', () => {
      const schemas = {
        body: z.object({ name: z.string().min(5) }),
        params: z.object({ id: z.string().uuid() }),
      };

      const req = mockRequest({ name: 'Hi' }, {}, { id: 'invalid-uuid' });
      const res = mockResponse();

      validateMultiple(schemas)(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNPROCESSABLE_ENTITY);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          details: expect.arrayContaining([
            expect.objectContaining({
              field: expect.stringContaining('body.name'),
            }),
            expect.objectContaining({
              field: expect.stringContaining('params.id'),
            }),
          ]),
        })
      );
    });
  });

  describe('strictSchema', () => {
    it('should create a strict schema that rejects extra properties', () => {
      const schema = strictSchema({
        name: z.string(),
        age: z.number(),
      });

      expect(() => {
        schema.parse({ name: 'Test', age: 25, extra: 'field' });
      }).toThrow();

      expect(() => {
        schema.parse({ name: 'Test', age: 25 });
      }).not.toThrow();
    });
  });
});
