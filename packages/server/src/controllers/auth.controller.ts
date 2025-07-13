import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';
import { Container } from '../container';

export class AuthController {
  private authService: AuthService;

  constructor() {
    const container = Container.getInstance();
    this.authService = container.getAuthService();
  }

  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Validate request body with Zod
      const { email, password } = req.body;

      const result = await this.authService.register(email, password);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.AUTH.REGISTER_SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Validate request body with Zod
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.AUTH.INVALID_CREDENTIALS,
      });
    }
  }

  // POST /api/auth/logout
  async logout(_req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Extract userId from JWT token
      const userId = 'placeholder';

      await this.authService.logout(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  // GET /api/auth/profile
  async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Extract userId from JWT token
      const userId = 'placeholder';

      const profile = await this.authService.getProfile(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }

  // PUT /api/auth/profile
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Extract userId from JWT token
      // TODO(claude): Validate request body with Zod
      const userId = 'placeholder';
      const updates = req.body;

      const result = await this.authService.updateProfile(userId, updates);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.GENERAL.SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  // POST /api/auth/recover
  async recoverPassword(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Validate request body with Zod
      const { email } = req.body;

      await this.authService.recoverPassword(email);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Password recovery email sent',
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }
}
