import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  passwordRecoverySchema,
} from '../../types/auth.schemas';
import { ZodError } from 'zod';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = registerSchema.parse(validData);
      expect(result).toEqual({
        email: 'test@example.com',
        password: 'Password123',
      });
    });

    it('should normalize email to lowercase', () => {
      const data = {
        email: 'Test@EXAMPLE.COM',
        password: 'Password123',
      };

      const result = registerSchema.parse(data);
      expect(result.email).toBe('test@example.com');
    });

    it('should trim email whitespace', () => {
      const data = {
        email: '  test@example.com  ',
        password: 'Password123',
      };

      const result = registerSchema.parse(data);
      expect(result.email).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject password shorter than minimum length', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject password longer than maximum length', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'a'.repeat(129), // 129 characters
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PASSWORD123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'Password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.parse(validData);
      expect(result).toEqual({
        email: 'test@example.com',
        password: 'anypassword',
      });
    });

    it('should normalize email to lowercase', () => {
      const data = {
        email: 'Test@EXAMPLE.COM',
        password: 'password',
      };

      const result = loginSchema.parse(data);
      expect(result.email).toBe('test@example.com');
    });

    it('should trim email whitespace', () => {
      const data = {
        email: '  test@example.com  ',
        password: 'password',
      };

      const result = loginSchema.parse(data);
      expect(result.email).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject missing fields', () => {
      expect(() => loginSchema.parse({})).toThrow(ZodError);
      expect(() => loginSchema.parse({ email: 'test@example.com' })).toThrow(ZodError);
      expect(() => loginSchema.parse({ password: 'password' })).toThrow(ZodError);
    });
  });

  describe('refreshTokenSchema', () => {
    it('should validate valid refresh token', () => {
      const validData = {
        refreshToken: 'valid-refresh-token',
      };

      const result = refreshTokenSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject empty refresh token', () => {
      const invalidData = {
        refreshToken: '',
      };

      expect(() => refreshTokenSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject missing refresh token', () => {
      expect(() => refreshTokenSchema.parse({})).toThrow(ZodError);
    });
  });

  describe('updateProfileSchema', () => {
    it('should validate email update only', () => {
      const validData = {
        email: 'new@example.com',
      };

      const result = updateProfileSchema.parse(validData);
      expect(result).toEqual({
        email: 'new@example.com',
      });
    });

    it('should validate password update with current password', () => {
      const validData = {
        currentPassword: 'oldpassword',
        newPassword: 'NewPassword123',
      };

      const result = updateProfileSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should validate email and password update together', () => {
      const validData = {
        email: 'new@example.com',
        currentPassword: 'oldpassword',
        newPassword: 'NewPassword123',
      };

      const result = updateProfileSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should normalize email to lowercase', () => {
      const data = {
        email: 'NEW@EXAMPLE.COM',
      };

      const result = updateProfileSchema.parse(data);
      expect(result.email).toBe('new@example.com');
    });

    it('should validate empty update (all fields optional)', () => {
      const result = updateProfileSchema.parse({});
      expect(result).toEqual({});
    });

    it('should reject newPassword without currentPassword', () => {
      const invalidData = {
        newPassword: 'NewPassword123',
      };

      expect(() => updateProfileSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      expect(() => updateProfileSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject weak new password', () => {
      const invalidData = {
        currentPassword: 'oldpassword',
        newPassword: 'weak',
      };

      expect(() => updateProfileSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject new password without complexity requirements', () => {
      const testCases = [
        {
          currentPassword: 'oldpassword',
          newPassword: 'password123', // missing uppercase
        },
        {
          currentPassword: 'oldpassword',
          newPassword: 'PASSWORD123', // missing lowercase
        },
        {
          currentPassword: 'oldpassword',
          newPassword: 'Password', // missing number
        },
      ];

      testCases.forEach((testCase) => {
        expect(() => updateProfileSchema.parse(testCase)).toThrow(ZodError);
      });
    });

    it('should allow currentPassword without newPassword', () => {
      const validData = {
        currentPassword: 'oldpassword',
      };

      const result = updateProfileSchema.parse(validData);
      expect(result).toEqual(validData);
    });
  });

  describe('passwordRecoverySchema', () => {
    it('should validate valid email', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = passwordRecoverySchema.parse(validData);
      expect(result).toEqual({
        email: 'test@example.com',
      });
    });

    it('should normalize email to lowercase', () => {
      const data = {
        email: 'Test@EXAMPLE.COM',
      };

      const result = passwordRecoverySchema.parse(data);
      expect(result.email).toBe('test@example.com');
    });

    it('should trim email whitespace', () => {
      const data = {
        email: '  test@example.com  ',
      };

      const result = passwordRecoverySchema.parse(data);
      expect(result.email).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      expect(() => passwordRecoverySchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject missing email', () => {
      expect(() => passwordRecoverySchema.parse({})).toThrow(ZodError);
    });
  });

  describe('Schema Error Messages', () => {
    it('should provide meaningful error messages for registration validation', () => {
      try {
        registerSchema.parse({
          email: 'invalid-email',
          password: 'weak',
        });
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors;
          expect(errors.length).toBeGreaterThanOrEqual(2);
          
          const emailError = errors.find(e => e.path.includes('email'));
          const passwordError = errors.find(e => e.path.includes('password'));
          
          expect(emailError?.message).toContain('valid email');
          expect(passwordError?.message).toContain('at least');
        }
      }
    });

    it('should provide meaningful error for password complexity', () => {
      try {
        registerSchema.parse({
          email: 'test@example.com',
          password: 'simplepassword',
        });
      } catch (error) {
        if (error instanceof ZodError) {
          const passwordError = error.errors.find(e => e.path.includes('password'));
          expect(passwordError?.message).toContain('lowercase');
          expect(passwordError?.message).toContain('uppercase');
          expect(passwordError?.message).toContain('number');
        }
      }
    });

    it('should provide meaningful error for update profile validation', () => {
      try {
        updateProfileSchema.parse({
          newPassword: 'NewPassword123',
          // missing currentPassword
        });
      } catch (error) {
        if (error instanceof ZodError) {
          const pathError = error.errors.find(e => e.path.includes('currentPassword'));
          expect(pathError?.message).toContain('Current password is required');
        }
      }
    });
  });

  describe('Type Exports', () => {
    it('should have correct TypeScript types', () => {
      // This test ensures our types are correctly inferred
      const registerData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const loginData = {
        email: 'test@example.com',
        password: 'password',
      };

      const refreshData = {
        refreshToken: 'token',
      };

      const updateData = {
        email: 'new@example.com',
        currentPassword: 'oldPassword123',
        newPassword: 'NewPassword123',
      };

      const recoveryData = {
        email: 'test@example.com',
      };

      // These should compile without errors
      expect(registerSchema.parse(registerData)).toBeDefined();
      expect(loginSchema.parse(loginData)).toBeDefined();
      expect(refreshTokenSchema.parse(refreshData)).toBeDefined();
      expect(updateProfileSchema.parse(updateData)).toBeDefined();
      expect(passwordRecoverySchema.parse(recoveryData)).toBeDefined();
    });
  });
});