// @aeturnis/server - Main server entry point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { GAME_VERSION } from '@aeturnis/shared';
import { HTTP_STATUS } from './utils/constants';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-console
console.log(`Aeturnis Online Server v${GAME_VERSION}`);

// Global middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
app.use(morgan('combined')); // Request logging

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

// TODO(claude): Set up API route routers
// TODO(claude): Initialize WebSocket server for real-time updates
// TODO(claude): Set up Prisma database connection

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Global error handler:', err);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
