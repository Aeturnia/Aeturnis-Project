/**
 * Example of how to use JWT authentication middleware
 * This file demonstrates proper usage patterns for the auth middleware
 */

import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

const app = express();

// Example: Login endpoint that generates tokens
app.post('/auth/login', async (_req, res) => {
  // ... validate credentials ...
  
  const accountId = 'user-123';
  const email = 'user@example.com';
  
  // Generate tokens
  const accessToken = generateAccessToken(accountId, email);
  const refreshToken = generateRefreshToken(accountId, email);
  
  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      expiresIn: '24h',
    },
  });
});

// Example: Protected route requiring authentication
app.get('/profile', authenticateToken, (req, res) => {
  // req.user is automatically populated by the middleware
  res.json({
    success: true,
    data: {
      accountId: req.user?.accountId,
      email: req.user?.email,
    },
  });
});

// Example: Optional authentication for public content
app.get('/posts', optionalAuth, (req, res) => {
  // req.user will be populated if valid token is provided
  // but route works even without authentication
  
  const isAuthenticated = !!req.user;
  
  res.json({
    success: true,
    data: {
      posts: ['post1', 'post2'],
      userSpecificData: isAuthenticated ? 'premium content' : null,
    },
  });
});

// Example: Refresh token endpoint
app.post('/auth/refresh', authenticateToken, (req, res) => {
  // Use the refresh token to generate a new access token
  const accountId = req.user!.accountId;
  const email = req.user!.email;
  
  const newAccessToken = generateAccessToken(accountId, email);
  
  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      expiresIn: '24h',
    },
  });
});

export default app;