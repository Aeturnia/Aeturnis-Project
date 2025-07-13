/**
 * JWT payload interface for authentication tokens
 */
export interface JWTPayload {
  accountId: string;
  email: string;
  iat?: number;  // Issued at
  exp?: number;  // Expiration time
}

/**
 * JWT token types
 */
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

/**
 * Token generation options
 */
export interface TokenOptions {
  expiresIn?: string | number;
  audience?: string;
  issuer?: string;
}

/**
 * Registration request interface
 */
export interface RegisterRequest {
  email: string;
  password: string;
}