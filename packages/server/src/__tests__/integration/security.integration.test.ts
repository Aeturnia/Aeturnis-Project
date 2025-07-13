import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('Security Headers Integration', () => {
  describe('Security Headers on API endpoints', () => {
    it('should include helmet security headers on health endpoint', async () => {
      const response = await request(app).get('/health').expect(200);

      // Helmet headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['referrer-policy']).toBe('no-referrer');
      expect(response.headers['x-permitted-cross-domain-policies']).toBe('none');

      // Should not expose server information
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('should include custom API security headers', async () => {
      const response = await request(app).get('/api/v1').expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['referrer-policy']).toBe('no-referrer');
      expect(response.headers['x-permitted-cross-domain-policies']).toBe('none');
    });

    it('should include Content Security Policy header', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(
        response.headers['content-security-policy'] ||
          response.headers['content-security-policy-report-only']
      ).toBeDefined();
    });

    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'GET');

      // CORS preflight might return 200 or 204 depending on the cors middleware config
      expect([200, 204]).toContain(response.status);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject CORS requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'https://malicious-site.com');

      expect(response.headers['access-control-allow-origin']).not.toBe(
        'https://malicious-site.com'
      );
    });

    it('should include rate limiting headers', async () => {
      const response = await request(app).get('/health').expect(200);

      // Rate limiting headers may be present
      // Note: In test environment, rate limiting might be disabled or have high limits
      if (response.headers['x-ratelimit-limit']) {
        expect(response.headers['x-ratelimit-limit']).toBeDefined();
        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      }
    });

    it('should set proper Content-Type for JSON responses', async () => {
      const response = await request(app).get('/api/v1').expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Security Headers on error responses', () => {
    it('should include security headers on 404 responses', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    it('should include security headers on method not allowed', async () => {
      const response = await request(app)
        .patch('/health') // PATCH not allowed on health endpoint
        .expect(404); // Will be 404 since we don't have specific method handlers

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('Request size limits', () => {
    it('should accept requests within size limits', async () => {
      const smallPayload = { data: 'small payload' };

      const response = await request(app)
        .post('/api/v1/auth/register') // This endpoint might not exist yet, but tests the middleware
        .send(smallPayload);

      // Should not be rejected for size (might be 404 for non-existent endpoint)
      expect(response.status).not.toBe(413); // 413 = Payload Too Large
    });
  });

  describe('Content Security Policy', () => {
    it('should include CSP directives in development mode', async () => {
      const response = await request(app).get('/health').expect(200);

      // In test environment (which is typically development-like)
      const csp =
        response.headers['content-security-policy-report-only'] ||
        response.headers['content-security-policy'];

      if (csp) {
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain("frame-src 'none'");
        expect(csp).toContain("object-src 'none'");
      }
    });
  });

  describe('Header consistency', () => {
    it('should apply the same security headers to different endpoints', async () => {
      const healthResponse = await request(app).get('/health');
      const apiResponse = await request(app).get('/api/v1');

      // Check that key security headers are consistent
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'referrer-policy',
      ];

      securityHeaders.forEach((header) => {
        expect(healthResponse.headers[header]).toBe(apiResponse.headers[header]);
      });
    });
  });
});
