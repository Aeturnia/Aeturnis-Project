import { z } from 'zod';

/**
 * Password validation rules
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Username validation rules
 * - 3-20 characters long
 * - Only alphanumeric characters and underscores
 * - Cannot start or end with underscore
 */
const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9_]{1,18}[a-zA-Z0-9])?$/;

/**
 * Schema for user registration
 * Validates email, password strength, and username format
 */
export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(
      usernameRegex,
      'Username can only contain letters, numbers, and underscores (cannot start or end with underscore)'
    ),
});

/**
 * Schema for user login
 * Validates email and password presence (not strength for login)
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password must not exceed 128 characters'),
});

/**
 * Schema for refresh token requests
 * Validates the refresh token format
 */
export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required')
    .regex(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      'Invalid refresh token format'
    ),
});

/**
 * Schema for password reset request
 * Only requires email
 */
export const PasswordResetRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),
});

/**
 * Schema for password reset confirmation
 * Requires reset token and new password
 */
export const PasswordResetConfirmSchema = z.object({
  resetToken: z
    .string()
    .min(32, 'Invalid reset token')
    .max(64, 'Invalid reset token'),
  
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

/**
 * Schema for changing password (when already logged in)
 * Requires current password and new password
 */
export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required')
    .max(128, 'Password must not exceed 128 characters'),
  
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
}).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }
);

/**
 * Schema for email verification
 * Requires verification token
 */
export const EmailVerificationSchema = z.object({
  verificationToken: z
    .string()
    .min(32, 'Invalid verification token')
    .max(64, 'Invalid verification token'),
});

/**
 * Type exports for use in services and controllers
 */
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetConfirmInput = z.infer<typeof PasswordResetConfirmSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type EmailVerificationInput = z.infer<typeof EmailVerificationSchema>;