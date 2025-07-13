// @aeturnis/server - Main server entry point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { GAME_VERSION } from '@aeturnis/shared';
import { HTTP_STATUS } from './utils/constants';
import { errorHandler, errorLogger, notFoundHandler, defaultRateLimiter } from './middleware';
import { securityConfig, apiSecurityHeaders } from './config/security.config';

// Create Express application
const app = express();
const PORT = process.env['PORT'] || 3000;

// eslint-disable-next-line no-console
console.log(`Aeturnis Online Server v${GAME_VERSION}`);

// Security middleware (must be first)
app.use(helmet(securityConfig.helmet)); // Security headers with custom config
app.use(cors(securityConfig.cors)); // CORS with frontend origin

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // JSON body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL-encoded parser

// Logging middleware
app.use(morgan('combined')); // Request logging

// Custom security headers for API responses
app.use((_req, res, next) => {
  Object.entries(apiSecurityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  next();
});

// Apply default rate limiting to all routes
app.use(defaultRateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'healthy',
    version: GAME_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// API version endpoint
app.get('/api/v1', (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
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

// Import routers
import authRouter from './routes/auth.router';

// Mount API routers
app.use('/api/v1/auth', authRouter);

// TODO(claude): Mount additional routers (character, banking, combat, pk)
// TODO(claude): Initialize WebSocket server for real-time updates
// TODO(claude): Set up Prisma database connection

// Error logging middleware (development only)
app.use(errorLogger);

// Global error handler
app.use(errorHandler);

// 404 handler (must be last)
app.use(notFoundHandler);

// Start server
if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
