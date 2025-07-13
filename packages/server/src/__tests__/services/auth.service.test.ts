import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AuthService } from '../../services/auth.service';
import type { IAuthRepository } from '../../repositories';
import { Account } from '@prisma/client';
import { RegisterRequest, LoginRequest, UpdateProfileRequest } from '../../types/auth.schemas';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../../middleware/error.middleware';
import * as jwtUtils from '../../utils/jwt';
import * as argon2 from 'argon2';

// Mock JWT utilities
vi.mock('../../utils/jwt', () => ({
  generateAccessToken: vi.fn(() => 'mock-access-token'),
  generateRefreshToken: vi.fn(() => 'mock-refresh-token'),
  verifyToken: vi.fn(),
}));

// Mock argon2
vi.mock('argon2', () => ({
  hash: vi.fn(() => Promise.resolve('hashed-password')),
  verify: vi.fn(() => Promise.resolve(true)),
  argon2id: 'argon2id',
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: IAuthRepository;
  let mockAccount: Account;

  beforeEach(() => {
    // Create mock account
    mockAccount = {
      id: 'test-account-id',
      email: 'test@example.com',
      hashedPassword: 'hashed-password',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastLoginAt: new Date('2024-01-01'),
    };

    // Create mock repository
    mockAuthRepository = {
      findByEmail: vi.fn(),
      createAccount: vi.fn(),
      verifyPassword: vi.fn(),
      updateLastLogin: vi.fn(),
      updatePassword: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    };

    authService = new AuthService(mockAuthRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create AuthService instance with repository', () => {
      expect(authService).toBeInstanceOf(AuthService);
    });

    it('should inject repository dependency', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('register', () => {
    const registerData: RegisterRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      // Setup mocks
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);
      (
        mockAuthRepository.createAccount as vi.MockedFunction<
          typeof mockAuthRepository.createAccount
        >
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.updateLastLogin as vi.MockedFunction<
          typeof mockAuthRepository.updateLastLogin
        >
      ).mockResolvedValue({
        ...mockAccount,
        lastLoginAt: new Date(),
      });

      const result = await authService.register(registerData);

      expect(result).toEqual({
        success: true,
        message: expect.any(String),
        data: {
          account: {
            id: mockAccount.id,
            email: mockAccount.email,
            createdAt: mockAccount.createdAt,
            lastLoginAt: mockAccount.lastLoginAt,
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: expect.any(Number),
        },
      });

      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(mockAuthRepository.createAccount).toHaveBeenCalledWith(registerData);
      expect(mockAuthRepository.updateLastLogin).toHaveBeenCalledWith(mockAccount.id);
    });

    it('should throw ConflictError if email already exists', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(mockAccount);

      await expect(authService.register(registerData)).rejects.toThrow(ConflictError);
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(mockAuthRepository.createAccount).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);
      (
        mockAuthRepository.createAccount as vi.MockedFunction<
          typeof mockAuthRepository.createAccount
        >
      ).mockRejectedValue(new Error('Database error'));

      await expect(authService.register(registerData)).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    const loginData: LoginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Setup mocks
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.verifyPassword as vi.MockedFunction<
          typeof mockAuthRepository.verifyPassword
        >
      ).mockResolvedValue(true);
      (
        mockAuthRepository.updateLastLogin as vi.MockedFunction<
          typeof mockAuthRepository.updateLastLogin
        >
      ).mockResolvedValue({
        ...mockAccount,
        lastLoginAt: new Date(),
      });

      const result = await authService.login(loginData);

      expect(result).toEqual({
        success: true,
        message: expect.any(String),
        data: {
          account: {
            id: mockAccount.id,
            email: mockAccount.email,
            createdAt: mockAccount.createdAt,
            lastLoginAt: expect.any(Date),
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: expect.any(Number),
        },
      });

      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(
        mockAccount,
        loginData.password
      );
      expect(mockAuthRepository.updateLastLogin).toHaveBeenCalledWith(mockAccount.id);
    });

    it('should throw AuthenticationError if account not found', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockAuthRepository.verifyPassword).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError if password is invalid', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.verifyPassword as vi.MockedFunction<
          typeof mockAuthRepository.verifyPassword
        >
      ).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
      expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(
        mockAccount,
        loginData.password
      );
      expect(mockAuthRepository.updateLastLogin).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(mockAccount);

      const result = await authService.logout(mockAccount.id);

      expect(result).toEqual({
        success: true,
        message: expect.any(String),
      });

      expect(mockAuthRepository.findById).toHaveBeenCalledWith(mockAccount.id);
    });

    it('should throw NotFoundError if account not found', async () => {
      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(null);

      await expect(authService.logout('invalid-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(mockAccount);

      const result = await authService.getProfile(mockAccount.id);

      expect(result).toEqual({
        success: true,
        data: {
          account: {
            id: mockAccount.id,
            email: mockAccount.email,
            createdAt: mockAccount.createdAt,
            lastLoginAt: mockAccount.lastLoginAt,
          },
        },
      });

      expect(mockAuthRepository.findById).toHaveBeenCalledWith(mockAccount.id);
    });

    it('should throw NotFoundError if account not found', async () => {
      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(null);

      await expect(authService.getProfile('invalid-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('should update email successfully', async () => {
      const updates: UpdateProfileRequest = { email: 'new@example.com' };
      const updatedAccount = { ...mockAccount, email: 'new@example.com' };

      (mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>)
        .mockResolvedValueOnce(mockAccount) // First call
        .mockResolvedValueOnce(updatedAccount); // Final call
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);
      (
        mockAuthRepository.update as vi.MockedFunction<typeof mockAuthRepository.update>
      ).mockResolvedValue(updatedAccount);

      const result = await authService.updateProfile(mockAccount.id, updates);

      expect(result.success).toBe(true);
      expect(result.data.account.email).toBe('new@example.com');
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith('new@example.com');
    });

    it('should update password successfully', async () => {
      const updates: UpdateProfileRequest = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      };

      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.verifyPassword as vi.MockedFunction<
          typeof mockAuthRepository.verifyPassword
        >
      ).mockResolvedValue(true);
      (
        mockAuthRepository.updatePassword as vi.MockedFunction<
          typeof mockAuthRepository.updatePassword
        >
      ).mockResolvedValue(mockAccount);
      (argon2.hash as vi.MockedFunction<typeof argon2.hash>).mockResolvedValue(
        'new-hashed-password'
      );

      const result = await authService.updateProfile(mockAccount.id, updates);

      expect(result.success).toBe(true);
      expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(mockAccount, 'oldpassword');
      expect(mockAuthRepository.updatePassword).toHaveBeenCalledWith(
        mockAccount.id,
        'new-hashed-password'
      );
    });

    it('should throw AuthenticationError for incorrect current password', async () => {
      const updates: UpdateProfileRequest = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword',
      };

      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.verifyPassword as vi.MockedFunction<
          typeof mockAuthRepository.verifyPassword
        >
      ).mockResolvedValue(false);

      await expect(authService.updateProfile(mockAccount.id, updates)).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should throw ConflictError for duplicate email', async () => {
      const updates: UpdateProfileRequest = { email: 'existing@example.com' };
      const existingAccount = { ...mockAccount, id: 'different-id' };

      (
        mockAuthRepository.findById as vi.MockedFunction<typeof mockAuthRepository.findById>
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(existingAccount);

      await expect(authService.updateProfile(mockAccount.id, updates)).rejects.toThrow(
        ConflictError
      );
    });
  });

  describe('recoverPassword', () => {
    it('should return success for existing account', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(mockAccount);

      const result = await authService.recoverPassword('test@example.com');

      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('Password recovery email has been sent'),
      });
    });

    it('should return success for non-existing account to prevent enumeration', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);

      const result = await authService.recoverPassword('nonexistent@example.com');

      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('If an account with this email exists'),
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { accountId: mockAccount.id, email: mockAccount.email };

      (jwtUtils.verifyToken as vi.MockedFunction<typeof jwtUtils.verifyToken>).mockResolvedValue(
        mockPayload
      );
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(mockAccount);

      const result = await authService.refreshToken(refreshToken);

      expect(result).toEqual({
        success: true,
        message: expect.any(String),
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: expect.any(Number),
        },
      });

      expect(jwtUtils.verifyToken).toHaveBeenCalledWith(refreshToken, 'refresh');
    });

    it('should throw AuthenticationError for invalid token', async () => {
      (jwtUtils.verifyToken as vi.MockedFunction<typeof jwtUtils.verifyToken>).mockRejectedValue(
        new Error('Invalid token')
      );

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError if account no longer exists', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { accountId: 'deleted-account', email: 'deleted@example.com' };

      (jwtUtils.verifyToken as vi.MockedFunction<typeof jwtUtils.verifyToken>).mockResolvedValue(
        mockPayload
      );
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('generateTokens', () => {
    it('should generate tokens with correct expiration time', async () => {
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);
      (
        mockAuthRepository.createAccount as vi.MockedFunction<
          typeof mockAuthRepository.createAccount
        >
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.updateLastLogin as vi.MockedFunction<
          typeof mockAuthRepository.updateLastLogin
        >
      ).mockResolvedValue(mockAccount);

      const registerData: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.register(registerData);

      // Should generate valid tokens with proper expiration
      expect(result.data.accessToken).toBe('mock-access-token');
      expect(result.data.refreshToken).toBe('mock-refresh-token');
      expect(result.data.expiresIn).toBeGreaterThan(0);
      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith(mockAccount.id, mockAccount.email);
      expect(jwtUtils.generateRefreshToken).toHaveBeenCalledWith(mockAccount.id, mockAccount.email);
    });
  });

  describe('parseExpirationTime', () => {
    it('should parse different time formats correctly', async () => {
      // Test that the service can handle different expiration formats
      // This is tested indirectly through the register method
      (
        mockAuthRepository.findByEmail as vi.MockedFunction<typeof mockAuthRepository.findByEmail>
      ).mockResolvedValue(null);
      (
        mockAuthRepository.createAccount as vi.MockedFunction<
          typeof mockAuthRepository.createAccount
        >
      ).mockResolvedValue(mockAccount);
      (
        mockAuthRepository.updateLastLogin as vi.MockedFunction<
          typeof mockAuthRepository.updateLastLogin
        >
      ).mockResolvedValue(mockAccount);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      // Should return a valid expiration time in seconds
      expect(typeof result.data.expiresIn).toBe('number');
      expect(result.data.expiresIn).toBeGreaterThan(0);
    });
  });
});
