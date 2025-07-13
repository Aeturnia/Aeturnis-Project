import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';
import { Container } from '../container';
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  PasswordRecoveryRequest,
} from '../types/auth.schemas';
import {
  AppError,
  AuthenticationError,
  ConflictError,
} from '../middleware/error.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    const container = Container.getInstance();
    this.authService = container.getAuthService();
  }

  /**
   * POST /api/auth/register
   * Register a new user account
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as RegisterRequest;
      const result = await this.authService.register(data);

      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as LoginRequest;
      const result = await this.authService.login(data);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.AUTH.INVALID_CREDENTIALS,
      });
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body as RefreshTokenRequest;
      const result = await this.authService.refreshToken(refreshToken);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.AUTH.TOKEN_INVALID,
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout current session
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.accountId;
      if (!userId) {
        throw new AuthenticationError(MESSAGES.AUTH.TOKEN_REQUIRED);
      }

      const result = await this.authService.logout(userId);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  /**
   * GET /api/auth/profile
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.accountId;
      if (!userId) {
        throw new AuthenticationError(MESSAGES.AUTH.TOKEN_REQUIRED);
      }

      const profile = await this.authService.getProfile(userId);

      res.status(HTTP_STATUS.OK).json(profile);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.accountId;
      if (!userId) {
        throw new AuthenticationError(MESSAGES.AUTH.TOKEN_REQUIRED);
      }

      const updates = req.body as UpdateProfileRequest;
      const result = await this.authService.updateProfile(userId, updates);

      res.status(HTTP_STATUS.OK).json({
        ...result,
        message: MESSAGES.GENERAL.SUCCESS,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  /**
   * POST /api/auth/recover
   * Request password recovery
   */
  async recoverPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as PasswordRecoveryRequest;
      const result = await this.authService.recoverPassword(email);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }
}
