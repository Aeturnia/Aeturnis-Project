import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { Container } from '../../container';
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  PasswordRecoveryRequest,
  AuthResponse,
  RefreshResponse,
  ProfileResponse,
} from '../../types/auth.schemas';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../../middleware/error.middleware';
import { HTTP_STATUS } from '../../utils/constants';

// Mock Container
vi.mock('../../container', () => ({
  Container: {
    getInstance: vi.fn(() => ({
      getAuthService: vi.fn(),
    })),
  },
}));

// Mock AuthService
vi.mock('../../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: vi.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: vi.MockedFunction<(value: unknown) => Response>;
  let mockStatus: vi.MockedFunction<(code: number) => { json: typeof mockJson }>;

  beforeEach(() => {
    // Create mocked response methods
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });

    // Setup mock response
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    // Setup mock request
    mockRequest = {
      body: {},
      user: {
        accountId: 'test-account-id',
        email: 'test@example.com',
      },
    };

    // Create mock service
    mockAuthService = {
      register: vi.fn(),
      login: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
      recoverPassword: vi.fn(),
    } as vi.Mocked<AuthService>;

    // Mock container to return our mock service
    (Container.getInstance as vi.MockedFunction<typeof Container.getInstance>).mockReturnValue({
      getAuthService: () => mockAuthService,
    });

    authController = new AuthController();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create AuthController instance', () => {
      expect(authController).toBeInstanceOf(AuthController);
    });

    it('should get AuthService from container', () => {
      expect(Container.getInstance).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerData: RegisterRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAuthResponse: AuthResponse = {
      success: true,
      message: 'Registration successful',
      data: {
        account: {
          id: 'test-account-id',
          email: 'test@example.com',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 86400,
      },
    };

    it('should successfully register a new user', async () => {
      mockRequest.body = registerData;
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockJson).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should handle ConflictError for existing email', async () => {
      mockRequest.body = registerData;
      const conflictError = new ConflictError('Email already exists');
      mockAuthService.register.mockRejectedValue(conflictError);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(conflictError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: conflictError.message,
      });
    });

    it('should handle general errors', async () => {
      mockRequest.body = registerData;
      mockAuthService.register.mockRejectedValue(new Error('General error'));

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'General error',
      });
    });
  });

  describe('login', () => {
    const loginData: LoginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAuthResponse: AuthResponse = {
      success: true,
      message: 'Login successful',
      data: {
        account: {
          id: 'test-account-id',
          email: 'test@example.com',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 86400,
      },
    };

    it('should successfully login user', async () => {
      mockRequest.body = loginData;
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockJson).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should handle AuthenticationError for invalid credentials', async () => {
      mockRequest.body = loginData;
      const authError = new AuthenticationError('Invalid credentials');
      mockAuthService.login.mockRejectedValue(authError);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(authError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: authError.message,
      });
    });

    it('should handle general errors', async () => {
      mockRequest.body = loginData;
      mockAuthService.login.mockRejectedValue(new Error('Service error'));

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Service error',
      });
    });
  });

  describe('refreshToken', () => {
    const refreshTokenData: RefreshTokenRequest = {
      refreshToken: 'valid-refresh-token',
    };

    const mockRefreshResponse: RefreshResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 86400,
      },
    };

    it('should successfully refresh token', async () => {
      mockRequest.body = refreshTokenData;
      mockAuthService.refreshToken.mockResolvedValue(mockRefreshResponse);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenData.refreshToken);
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockJson).toHaveBeenCalledWith(mockRefreshResponse);
    });

    it('should handle AuthenticationError for invalid token', async () => {
      mockRequest.body = refreshTokenData;
      const authError = new AuthenticationError('Invalid refresh token');
      mockAuthService.refreshToken.mockRejectedValue(authError);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(authError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: authError.message,
      });
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const mockLogoutResponse = {
        success: true,
        message: 'Logout successful',
      };
      mockAuthService.logout.mockResolvedValue(mockLogoutResponse);

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.logout).toHaveBeenCalledWith('test-account-id');
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockJson).toHaveBeenCalledWith(mockLogoutResponse);
    });

    it('should handle missing user token', async () => {
      mockRequest.user = undefined;

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('token required'),
      });
    });

    it('should handle NotFoundError', async () => {
      const notFoundError = new NotFoundError('Account');
      mockAuthService.logout.mockRejectedValue(notFoundError);

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(notFoundError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: notFoundError.message,
      });
    });
  });

  describe('getProfile', () => {
    const mockProfileResponse: ProfileResponse = {
      success: true,
      data: {
        account: {
          id: 'test-account-id',
          email: 'test@example.com',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
      },
    };

    it('should successfully get user profile', async () => {
      mockAuthService.getProfile.mockResolvedValue(mockProfileResponse);

      await authController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.getProfile).toHaveBeenCalledWith('test-account-id');
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockJson).toHaveBeenCalledWith(mockProfileResponse);
    });

    it('should handle missing user token', async () => {
      mockRequest.user = undefined;

      await authController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('token required'),
      });
    });

    it('should handle NotFoundError', async () => {
      const notFoundError = new NotFoundError('Account');
      mockAuthService.getProfile.mockRejectedValue(notFoundError);

      await authController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(notFoundError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: notFoundError.message,
      });
    });
  });

  describe('updateProfile', () => {
    const updateData: UpdateProfileRequest = {
      email: 'new@example.com',
    };

    const mockProfileResponse: ProfileResponse = {
      success: true,
      data: {
        account: {
          id: 'test-account-id',
          email: 'new@example.com',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
      },
    };

    it('should successfully update user profile', async () => {
      mockRequest.body = updateData;
      mockAuthService.updateProfile.mockResolvedValue(mockProfileResponse);

      await authController.updateProfile(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.updateProfile).toHaveBeenCalledWith('test-account-id', updateData);
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockJson).toHaveBeenCalledWith({
        ...mockProfileResponse,
        message: expect.any(String),
      });
    });

    it('should handle missing user token', async () => {
      mockRequest.user = undefined;
      mockRequest.body = updateData;

      await authController.updateProfile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('token required'),
      });
    });

    it('should handle ConflictError for duplicate email', async () => {
      mockRequest.body = updateData;
      const conflictError = new ConflictError('Email already in use');
      mockAuthService.updateProfile.mockRejectedValue(conflictError);

      await authController.updateProfile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(conflictError.statusCode);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: conflictError.message,
      });
    });
  });

  describe('recoverPassword', () => {
    const recoveryData: PasswordRecoveryRequest = {
      email: 'test@example.com',
    };

    it('should successfully request password recovery', async () => {
      mockRequest.body = recoveryData;
      const mockRecoveryResponse = {
        success: true,
        message: 'Password recovery email sent',
      };
      mockAuthService.recoverPassword.mockResolvedValue(mockRecoveryResponse);

      await authController.recoverPassword(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.recoverPassword).toHaveBeenCalledWith(recoveryData.email);
      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockJson).toHaveBeenCalledWith(mockRecoveryResponse);
    });

    it('should handle service errors', async () => {
      mockRequest.body = recoveryData;
      mockAuthService.recoverPassword.mockRejectedValue(new Error('Email service error'));

      await authController.recoverPassword(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Email service error',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined error objects', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      mockAuthService.register.mockRejectedValue(undefined);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('error occurred'),
      });
    });

    it('should handle non-Error objects', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      mockAuthService.register.mockRejectedValue('String error');

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('error occurred'),
      });
    });
  });

  describe('Request Validation', () => {
    it('should process valid request bodies correctly', async () => {
      const validRegisterData = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockRequest.body = validRegisterData;

      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: expect.any(Object) as Record<string, unknown>,
      };
      mockAuthService.register.mockResolvedValue(mockResponse);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.register).toHaveBeenCalledWith(validRegisterData);
    });

    it('should pass through request body data without modification', async () => {
      const requestData = {
        email: 'test@example.com',
        password: 'password123',
        extraField: 'should-be-ignored', // This should be filtered by validation middleware
      };
      mockRequest.body = requestData;

      mockAuthService.register.mockResolvedValue({
        success: true,
        message: 'Success',
        data: expect.any(Object) as Record<string, unknown>,
      });

      await authController.register(mockRequest as Request, mockResponse as Response);

      // Controller should pass the entire body - validation middleware handles filtering
      expect(mockAuthService.register).toHaveBeenCalledWith(requestData);
    });
  });
});
