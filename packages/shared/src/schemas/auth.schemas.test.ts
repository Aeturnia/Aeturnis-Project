import { describe, it, expect } from 'vitest';
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  PasswordResetRequestSchema,
  PasswordResetConfirmSchema,
  ChangePasswordSchema,
  EmailVerificationSchema,
} from './auth.schemas';

describe('Auth Schemas', () => {
  describe('RegisterSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser123',
      };

      const result = RegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should fail with invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123!',
        username: 'testuser123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        username: 'testuser123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with invalid username', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        username: '_invalid_',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should convert email to lowercase', () => {
      const data = {
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123!',
        username: 'testuser123',
      };

      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });
  });

  describe('LoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = LoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'anypassword',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('RefreshTokenSchema', () => {
    it('should validate correct JWT format', () => {
      const validData = {
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      };

      const result = RefreshTokenSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid token format', () => {
      const invalidData = {
        refreshToken: 'not-a-jwt-token',
      };

      const result = RefreshTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with empty token', () => {
      const invalidData = {
        refreshToken: '',
      };

      const result = RefreshTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('PasswordResetRequestSchema', () => {
    it('should validate correct email', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = PasswordResetRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
      };

      const result = PasswordResetRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('PasswordResetConfirmSchema', () => {
    it('should validate correct reset data', () => {
      const validData = {
        resetToken: '12345678901234567890123456789012',
        newPassword: 'NewPassword123!',
      };

      const result = PasswordResetConfirmSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with short reset token', () => {
      const invalidData = {
        resetToken: 'too-short',
        newPassword: 'NewPassword123!',
      };

      const result = PasswordResetConfirmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with weak password', () => {
      const invalidData = {
        resetToken: '12345678901234567890123456789012',
        newPassword: 'weak',
      };

      const result = PasswordResetConfirmSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ChangePasswordSchema', () => {
    it('should validate correct password change data', () => {
      const validData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      const result = ChangePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail when passwords are the same', () => {
      const invalidData = {
        currentPassword: 'SamePassword123!',
        newPassword: 'SamePassword123!',
      };

      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with weak new password', () => {
      const invalidData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'weak',
      };

      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('EmailVerificationSchema', () => {
    it('should validate correct verification token', () => {
      const validData = {
        verificationToken: '12345678901234567890123456789012',
      };

      const result = EmailVerificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with short verification token', () => {
      const invalidData = {
        verificationToken: 'too-short',
      };

      const result = EmailVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with long verification token', () => {
      const invalidData = {
        verificationToken: '1'.repeat(65),
      };

      const result = EmailVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});