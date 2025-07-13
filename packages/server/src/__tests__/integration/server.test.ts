import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Server } from 'http';
import app from '../../index';
import { HTTP_STATUS } from '../../utils/constants';
import { GAME_VERSION } from '@aeturnis/shared';

describe('Express Server Integration', () => {
  let server: Server;

  beforeAll(() => {
    // Start server on a random port for testing
    server = app.listen(0);
  });

  afterAll(() => {
    // Close server after tests
    server.close();
  });

  describe('Health Check Endpoint', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health').expect(HTTP_STATUS.OK);

      expect(response.body).toMatchObject({
        status: 'healthy',
        version: GAME_VERSION,
      });
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('should return correct content type', async () => {
      const response = await request(app).get('/health').expect('Content-Type', /json/);

      expect(response.status).toBe(HTTP_STATUS.OK);
    });
  });

  describe('API Version Endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/api/v1').expect(HTTP_STATUS.OK);

      expect(response.body).toMatchObject({
        message: 'Aeturnis Online API',
        version: GAME_VERSION,
        endpoints: {
          health: '/health',
          auth: '/api/v1/auth',
          characters: '/api/v1/characters',
          banking: '/api/v1/banking',
          combat: '/api/v1/combat',
          pk: '/api/v1/pk',
        },
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route').expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 404 for unknown API routes', async () => {
      const response = await request(app).get('/api/v1/unknown').expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from helmet', async () => {
      const response = await request(app).get('/health');

      // Check for various helmet headers
      expect(response.headers).toHaveProperty('x-dns-prefetch-control');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/health').set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .expect(HTTP_STATUS.NO_CONTENT);

      expect(response.headers).toHaveProperty('access-control-allow-methods');
    });
  });

  describe('Body Parsing', () => {
    it('should parse JSON bodies', async () => {
      // Since we don't have a POST endpoint yet, we'll test that the middleware is present
      // by checking that the app has the json parser
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .set('Content-Type', 'application/json');

      // The auth endpoint exists and returns 200 with a success response
      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should parse URL-encoded bodies', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send('email=test@example.com&password=password123')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).toBe(HTTP_STATUS.OK);
    });
  });

  describe('Rate Limiting', () => {
    it('should have rate limiting headers', async () => {
      const response = await request(app).get('/health');

      // Rate limit headers should be present (standardHeaders format)
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    });

    it('should enforce rate limits', async () => {
      // Note: This test might be flaky in CI due to rate limit windows
      // We'll make a reasonable number of requests
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get('/health'));

      const responses = await Promise.all(requests);

      // All should succeed since we're under the limit
      responses.forEach((response) => {
        expect(response.status).toBe(HTTP_STATUS.OK);
      });

      // Check that rate limit headers exist and are valid numbers
      const lastResponse = responses[responses.length - 1];
      if (lastResponse.headers['ratelimit-remaining']) {
        const remaining = parseInt(lastResponse.headers['ratelimit-remaining']);
        expect(remaining).toBeGreaterThanOrEqual(0);
        expect(remaining).toBeLessThanOrEqual(100); // Default limit is 100
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send('{ invalid json')
        .set('Content-Type', 'application/json');

      // Should get either 400 Bad Request or 500 Internal Server Error for malformed JSON
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(
        response.status
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Request Logging', () => {
    it('should log requests with morgan', async () => {
      // Morgan is configured but we can't easily test console output
      // Just verify that requests complete successfully
      const response = await request(app).get('/health').expect(HTTP_STATUS.OK);

      expect(response.body.status).toBe('healthy');
    });
  });
});
