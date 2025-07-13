import { IAuthRepository } from '../repositories';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { TokenType } from '../types/auth.types';
import { SECURITY, MESSAGES } from '../utils/constants';
import {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  AuthResponse,
  RefreshResponse,
  ProfileResponse,
} from '../types/auth.schemas';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../middleware/error.middleware';
import * as argon2 from 'argon2';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Register a new user account
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if account already exists
      const existingAccount = await this.authRepository.findByEmail(data.email);
      if (existingAccount) {
        throw new ConflictError(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
      }

      // Create new account (password hashing is handled in repository)
      const account = await this.authRepository.createAccount(data);

      // Update last login timestamp
      await this.authRepository.updateLastLogin(account.id);

      // Generate tokens
      const tokens = this.generateTokens(account.id, account.email);

      return {
        success: true,
        message: MESSAGES.AUTH.REGISTER_SUCCESS,
        data: {
          account: {
            id: account.id,
            email: account.email,
            createdAt: account.createdAt,
            lastLoginAt: account.lastLoginAt,
          },
          ...tokens,
        },
      };
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Authenticate user login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find account by email
      const account = await this.authRepository.findByEmail(data.email);
      if (!account) {
        throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
      }

      // Verify password
      const isPasswordValid = await this.authRepository.verifyPassword(account, data.password);
      if (!isPasswordValid) {
        throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
      }

      // Update last login timestamp
      const updatedAccount = await this.authRepository.updateLastLogin(account.id);

      // Generate tokens
      const tokens = this.generateTokens(account.id, account.email);

      return {
        success: true,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        data: {
          account: {
            id: updatedAccount.id,
            email: updatedAccount.email,
            createdAt: updatedAccount.createdAt,
            lastLoginAt: updatedAccount.lastLoginAt,
          },
          ...tokens,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      // Verify refresh token
      const payload = await verifyToken(refreshToken, TokenType.REFRESH);

      // Verify account still exists
      const account = await this.authRepository.findByEmail(payload.email);
      if (!account) {
        throw new AuthenticationError('Account no longer exists');
      }

      // Generate new tokens
      const tokens = this.generateTokens(account.id, account.email);

      return {
        success: true,
        message: MESSAGES.AUTH.REFRESH_SUCCESS,
        data: tokens,
      };
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user (placeholder for token blacklisting)
   */
  async logout(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // TODO(claude): Implement token blacklisting if needed
      // For JWT stateless approach, logout is handled client-side
      // This endpoint can be used for logging or cleanup if needed

      // Verify user exists
      const account = await this.authRepository.findById(userId);

      if (!account) {
        throw new NotFoundError('Account');
      }

      return {
        success: true,
        message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user profile information
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const account = await this.authRepository.findById(userId);

      if (!account) {
        throw new NotFoundError('Account');
      }

      return {
        success: true,
        data: {
          account: {
            id: account.id,
            email: account.email,
            createdAt: account.createdAt,
            lastLoginAt: account.lastLoginAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<ProfileResponse> {
    try {
      // Find existing account
      const account = await this.authRepository.findById(userId);

      if (!account) {
        throw new NotFoundError('Account');
      }

      // If updating password, verify current password
      if (updates.newPassword && updates.currentPassword) {
        const isCurrentPasswordValid = await this.authRepository.verifyPassword(
          account,
          updates.currentPassword
        );
        if (!isCurrentPasswordValid) {
          throw new AuthenticationError('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await argon2.hash(updates.newPassword, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16, // 64 MB
          timeCost: 3,
          parallelism: 1,
        });

        // Update password
        await this.authRepository.updatePassword(userId, hashedPassword);
      }

      // Update email if provided
      if (updates.email && updates.email !== account.email) {
        // Check if new email is already taken
        const existingAccount = await this.authRepository.findByEmail(updates.email);
        if (existingAccount) {
          throw new ConflictError('Email address is already in use');
        }

        // Update email
        await this.authRepository.update(userId, { email: updates.email });
      }

      // Fetch final updated account
      const finalAccount = await this.authRepository.findById(userId);

      if (!finalAccount) {
        throw new NotFoundError('Account');
      }

      return {
        success: true,
        data: {
          account: {
            id: finalAccount.id,
            email: finalAccount.email,
            createdAt: finalAccount.createdAt,
            lastLoginAt: finalAccount.lastLoginAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Password recovery (placeholder implementation)
   */
  async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find account by email
      const account = await this.authRepository.findByEmail(email);
      
      // Always return success to prevent email enumeration
      // Even if account doesn't exist, we don't reveal this information
      if (!account) {
        return {
          success: true,
          message: 'If an account with this email exists, a password recovery email has been sent',
        };
      }

      // TODO(claude): Implement actual password recovery logic
      // 1. Generate recovery token
      // 2. Store token with expiration
      // 3. Send recovery email
      // 4. Provide endpoint to reset password with token

      return {
        success: true,
        message: 'Password recovery email has been sent',
      };
    } catch (error) {
      throw new Error(`Password recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private generateTokens(accountId: string, email: string): AuthTokens {
    const accessToken = generateAccessToken(accountId, email);
    const refreshToken = generateRefreshToken(accountId, email);
    
    // Parse expiration time from JWT_EXPIRES_IN (e.g., '24h' -> 24 * 60 * 60 = 86400 seconds)
    const expiresIn = this.parseExpirationTime(SECURITY.JWT_EXPIRES_IN);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Parse JWT expiration time string to seconds
   */
  private parseExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 86400; // Default to 24 hours
    }

    const value = parseInt(match[1] || '24', 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 86400;
    }
  }
}
