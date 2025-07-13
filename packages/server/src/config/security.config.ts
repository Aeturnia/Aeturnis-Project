import { HelmetOptions } from 'helmet';
import { CorsOptions } from 'cors';

/**
 * Security configuration for the Aeturnis Online server
 * 
 * This module exports helmet configuration with environment-specific settings
 * for Content Security Policy, HSTS, and other security headers.
 */

// Environment variables with defaults
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const FRONTEND_URL = process.env['FRONTEND_URL'] || 'http://localhost:3001';
const WEBSOCKET_URL = process.env['WEBSOCKET_URL'] || 'ws://localhost:3000';

// Parse frontend URL to get origin
const getFrontendOrigin = (url: string): string => {
  try {
    return new URL(url).origin;
  } catch {
    return 'http://localhost:3001';
  }
};

// Parse WebSocket URL to get origin
const getWebSocketOrigin = (url: string): string => {
  try {
    const wsUrl = new URL(url);
    return `${wsUrl.protocol === 'wss:' ? 'https:' : 'http:'}//${wsUrl.host}`;
  } catch {
    return 'http://localhost:3000';
  }
};

const frontendOrigin = getFrontendOrigin(FRONTEND_URL);
const wsOrigin = getWebSocketOrigin(WEBSOCKET_URL);

/**
 * Content Security Policy configuration
 * Tuned for a game API that serves JSON and allows WebSocket connections
 */
const getContentSecurityPolicy = (): Record<string, string[]> => {
  const isDevelopment = NODE_ENV === 'development';
  
  const basePolicy = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"], // Allow inline styles for API documentation
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", frontendOrigin, wsOrigin],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };

  // In development, allow additional sources for hot reloading and debugging
  if (isDevelopment) {
    basePolicy['script-src'].push("'unsafe-eval'"); // For development tools
    basePolicy['connect-src'].push('ws://localhost:*', 'http://localhost:*');
  }

  return basePolicy;
};

/**
 * Helmet configuration for the Aeturnis Online server
 */
export const helmetConfig: HelmetOptions = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: getContentSecurityPolicy(),
    reportOnly: NODE_ENV === 'development',
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: {
    policy: 'require-corp',
  },

  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: {
    policy: 'same-origin',
  },

  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: {
    policy: 'cross-origin', // Allow cross-origin requests for API
  },

  // DNS Prefetch Control
  dnsPrefetchControl: {
    allow: false,
  },

  // Note: expectCt has been removed from helmet v7+ as it's deprecated

  // Frameguard
  frameguard: {
    action: 'deny',
  },

  // Hide Powered-By header
  hidePoweredBy: true,

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open
  ieNoOpen: true,

  // No Sniff
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },

  // Referrer Policy
  referrerPolicy: {
    policy: 'no-referrer',
  },

  // X-XSS-Protection
  xssFilter: true,
};

/**
 * CORS configuration type
 */
interface SecurityCorsConfig extends CorsOptions {
  origin: string[];
  credentials: boolean;
  optionsSuccessStatus: number;
  methods: string[];
  allowedHeaders: string[];
}

/**
 * Rate limit configuration type
 */
interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: {
    error: string;
    retryAfter: string;
  };
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

/**
 * Security configuration object with additional settings
 */
export const securityConfig: {
  helmet: HelmetOptions;
  cors: SecurityCorsConfig;
  rateLimit: RateLimitConfig;
} = {
  helmet: helmetConfig,
  cors: {
    origin: [frontendOrigin],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
    ],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: NODE_ENV === 'development' ? 1000 : 100, // Higher limit in development
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
  },
};

/**
 * Environment-specific security settings
 */
export const getSecurityLevel = (): 'development' | 'staging' | 'production' => {
  switch (NODE_ENV) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    default:
      return 'development';
  }
};

/**
 * Security headers for API responses
 */
export const apiSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'X-Permitted-Cross-Domain-Policies': 'none',
} as const;

/**
 * Development-only security overrides
 */
export const developmentOverrides = {
  hsts: false, // Disable HSTS in development (HTTP)
  contentSecurityPolicy: {
    reportOnly: true, // Only report CSP violations in development
  },
} as const;