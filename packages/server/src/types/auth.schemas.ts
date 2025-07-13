import { z } from 'zod';
import { SECURITY } from '../utils/constants';

/**
 * Registration request schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(SECURITY.PASSWORD_MIN_LENGTH, `Password must be at least ${SECURITY.PASSWORD_MIN_LENGTH} characters long`)
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * Token refresh request schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required'),
});

/**
 * Update profile request schema
 */
export const updateProfileSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
    .optional(),
  currentPassword: z
    .string()
    .min(1, 'Current password is required when updating profile')
    .optional(),
  newPassword: z
    .string()
    .min(SECURITY.PASSWORD_MIN_LENGTH, `New password must be at least ${SECURITY.PASSWORD_MIN_LENGTH} characters long`)
    .max(128, 'New password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password must contain at least one lowercase letter, one uppercase letter, and one number')
    .optional(),
}).refine(
  (data) => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Current password is required when changing password',
    path: ['currentPassword'],
  }
);

/**
 * Password recovery request schema
 */
export const passwordRecoverySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
});

/**
 * Response schemas for type safety
 */
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    account: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      createdAt: z.date(),
      lastLoginAt: z.date().nullable(),
    }),
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
  }),
});

export const loginResponseSchema = authResponseSchema;
export const registerResponseSchema = authResponseSchema;

export const refreshResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
  }),
});

export const profileResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    account: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      createdAt: z.date(),
      lastLoginAt: z.date().nullable(),
    }),
  }),
});

/**
 * Type exports for use in other modules
 */
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
export type PasswordRecoveryRequest = z.infer<typeof passwordRecoverySchema>;

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;