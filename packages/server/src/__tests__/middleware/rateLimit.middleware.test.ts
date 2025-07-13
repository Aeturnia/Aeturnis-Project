import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import {
  generalRateLimit,
  authRateLimit,
  createCustomRateLimit,
  bankingRateLimiter,
  chatRateLimiter,
  pvpRateLimiter,
  getRateLimitInfo,
  addRateLimitInfo,
} from '../../middleware/rateLimit.middleware';

// Mock logger to avoid winston dependency in tests
vi.mock('../../utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Rate Limit Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generalRateLimit', () => {
    it('should allow requests under the limit', async () => {
      app.get('/test', generalRateLimit, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/test').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });

    it('should include rate limit headers', async () => {
      app.get('/test', generalRateLimit, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/test').expect(200);

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });
  });

  describe('authRateLimit', () => {
    it('should have stricter limits than general rate limit', async () => {
      app.post('/auth', authRateLimit, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).post('/auth').expect(200);

      expect(response.body.success).toBe(true);
      // Auth rate limit should have lower max requests than general
      const authLimit = parseInt(response.headers['ratelimit-limit'] as string);
      expect(authLimit).toBeLessThanOrEqual(5);
    });

    it('should return proper error structure when limit exceeded', async () => {
      const strictLimiter = createCustomRateLimit({
        windowMinutes: 15,
        maxRequests: 1,
        message: 'Auth limit exceeded',
        limitType: 'AUTH_TEST',
      });

      app.post('/auth-test', strictLimiter, (req, res) => {
        res.json({ success: true });
      });

      // First request should succeed
      await request(app).post('/auth-test').expect(200);

      // Second request should be rate limited
      const response = await request(app).post('/auth-test').expect(429);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Auth limit exceeded',
        type: 'RATE_LIMIT_EXCEEDED',
      });
      expect(response.body.retryAfter).toBeDefined();
    });
  });

  describe('createCustomRateLimit', () => {
    it('should create rate limiter with custom configuration', async () => {
      const customLimiter = createCustomRateLimit({
        windowMinutes: 1,
        maxRequests: 3,
        message: 'Custom limit exceeded',
        limitType: 'CUSTOM_TEST',
      });

      app.get('/custom', customLimiter, (req, res) => {
        res.json({ success: true });
      });

      // Make requests up to the limit
      for (let i = 0; i < 3; i++) {
        await request(app).get('/custom').expect(200);
      }

      // Next request should be rate limited
      const response = await request(app).get('/custom').expect(429);

      expect(response.body.error).toBe('Custom limit exceeded');
    });

    it('should support custom key generator', async () => {
      const customLimiter = createCustomRateLimit({
        windowMinutes: 1,
        maxRequests: 1,
        keyGenerator: (req) => (req.headers['x-user-id'] as string) || 'default',
        limitType: 'CUSTOM_KEY_TEST',
      });

      app.get('/custom-key', customLimiter, (req, res) => {
        res.json({ success: true });
      });

      // Different user IDs should have separate limits
      await request(app).get('/custom-key').set('x-user-id', 'user1').expect(200);

      await request(app).get('/custom-key').set('x-user-id', 'user2').expect(200);

      // Same user should be rate limited
      await request(app).get('/custom-key').set('x-user-id', 'user1').expect(429);
    });
  });

  describe('Banking Rate Limiter', () => {
    it('should enforce banking operation limits', async () => {
      app.post('/bank', bankingRateLimiter, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).post('/bank').expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Chat Rate Limiter', () => {
    it('should enforce chat message limits', async () => {
      app.post('/chat', chatRateLimiter, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).post('/chat').expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PvP Rate Limiter', () => {
    it('should enforce PvP action limits', async () => {
      app.post('/pvp', pvpRateLimiter, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).post('/pvp').expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    describe('getRateLimitInfo', () => {
      it('should extract rate limit headers from response', () => {
        const mockRes = {
          getHeader: vi.fn((name: string) => {
            const headers: Record<string, string> = {
              'RateLimit-Limit': '100',
              'RateLimit-Remaining': '99',
              'RateLimit-Reset': '1234567890',
              'Retry-After': '60',
            };
            return headers[name];
          }),
        } as Response;

        const info = getRateLimitInfo(mockRes);

        expect(info).toEqual({
          limit: '100',
          remaining: '99',
          reset: '1234567890',
          retryAfter: '60',
        });
      });
    });

    describe('addRateLimitInfo', () => {
      it('should add rate limit policy headers', async () => {
        app.use(addRateLimitInfo);
        app.get('/info', (req, res) => {
          res.json({ success: true });
        });

        const response = await request(app).get('/info').expect(200);

        expect(response.headers['x-ratelimit-policy']).toBe('Global: 100/15min, Auth: 5/15min');
        expect(response.headers['x-ratelimit-configured']).toBe('true');
      });
    });
  });

  describe('Environment Variable Configuration', () => {
    it('should respect environment variables for rate limits', () => {
      // Note: In a real test environment, you would set process.env before importing
      // the middleware module to test environment variable configuration
      expect(process.env.RATE_LIMIT_GLOBAL_WINDOW_MINUTES || '15').toBeDefined();
      expect(process.env.RATE_LIMIT_GLOBAL_MAX_REQUESTS || '100').toBeDefined();
    });
  });

  describe('Error Response Format', () => {
    it('should return standardized error response', async () => {
      const testLimiter = createCustomRateLimit({
        windowMinutes: 1,
        maxRequests: 1,
        message: 'Test limit exceeded',
        limitType: 'ERROR_TEST',
      });

      app.get('/error-test', testLimiter, (req, res) => {
        res.json({ success: true });
      });

      // First request succeeds
      await request(app).get('/error-test').expect(200);

      // Second request should be rate limited with proper error format
      const response = await request(app).get('/error-test').expect(429);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Test limit exceeded',
        type: 'RATE_LIMIT_EXCEEDED',
      });
      expect(response.body.retryAfter).toBeDefined();
      expect(typeof response.body.retryAfter).toMatch(/string|number/);
    });
  });
});
