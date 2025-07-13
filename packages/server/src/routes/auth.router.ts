import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  authenticateToken,
  authRateLimit,
  generalRateLimit,
  zodValidator,
  asyncHandler,
} from '../middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  passwordRecoverySchema,
} from '../types/auth.schemas';

// Create router instance
const router = Router();

// Initialize controller
const authController = new AuthController();

/**
 * POST /api/v1/auth/register
 * Register a new user account
 * Rate limited to prevent spam registration
 */
router.post(
  '/register',
  authRateLimit, // Strict rate limiting for auth endpoints
  zodValidator(registerSchema, 'body'), // Validate registration data
  asyncHandler(async (req, res) => {
    await authController.register(req, res);
  })
);

/**
 * POST /api/v1/auth/login
 * Authenticate user login
 * Rate limited to prevent brute force attacks
 */
router.post(
  '/login',
  authRateLimit, // Strict rate limiting for auth endpoints
  zodValidator(loginSchema, 'body'), // Validate login credentials
  asyncHandler(async (req, res) => {
    await authController.login(req, res);
  })
);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 * Rate limited but less strict than login
 */
router.post(
  '/refresh',
  generalRateLimit, // General rate limiting
  zodValidator(refreshTokenSchema, 'body'), // Validate refresh token
  asyncHandler(async (req, res) => {
    await authController.refreshToken(req, res);
  })
);

/**
 * POST /api/v1/auth/logout
 * Logout current session
 * Requires authentication
 */
router.post(
  '/logout',
  authenticateToken, // Require valid JWT token
  asyncHandler(async (req, res) => {
    await authController.logout(req, res);
  })
);

/**
 * GET /api/v1/auth/profile
 * Get current user profile
 * Requires authentication
 */
router.get(
  '/profile',
  authenticateToken, // Require valid JWT token
  asyncHandler(async (req, res) => {
    await authController.getProfile(req, res);
  })
);

/**
 * PUT /api/v1/auth/profile
 * Update user profile
 * Requires authentication and validation
 */
router.put(
  '/profile',
  authenticateToken, // Require valid JWT token
  zodValidator(updateProfileSchema, 'body'), // Validate profile updates
  asyncHandler(async (req, res) => {
    await authController.updateProfile(req, res);
  })
);

/**
 * POST /api/v1/auth/recover
 * Request password recovery
 * Rate limited to prevent abuse
 */
router.post(
  '/recover',
  authRateLimit, // Strict rate limiting
  zodValidator(passwordRecoverySchema, 'body'), // Validate email
  asyncHandler(async (req, res) => {
    await authController.recoverPassword(req, res);
  })
);

export default router;
