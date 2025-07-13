import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, MESSAGES, PVP_LIMITS } from '../utils/constants';
import { logger } from '../utils/logger';
import { securityConfig } from '../config/security.config';

// Environment variable configuration with defaults from security config
const RATE_LIMIT_CONFIG = {
  GLOBAL_WINDOW_MINUTES: securityConfig.rateLimit.windowMs / (60 * 1000),
  GLOBAL_MAX_REQUESTS: securityConfig.rateLimit.max,
  AUTH_WINDOW_MINUTES: parseInt(process.env['RATE_LIMIT_AUTH_WINDOW_MINUTES'] || '15'),
  AUTH_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_AUTH_MAX_REQUESTS'] || '5'),
  ENABLE_RATE_LIMIT_HEADERS: securityConfig.rateLimit.standardHeaders,
  TRUST_PROXY: process.env['RATE_LIMIT_TRUST_PROXY'] === 'true',
} as const;

/**
 * Standard error response for rate limit exceeded
 */
const createRateLimitErrorResponse = (
  message: string,
  retryAfter?: number
) => {
  const response: any = {
    success: false,
    error: message,
    type: 'RATE_LIMIT_EXCEEDED',
  };

  if (retryAfter) {
    response.retryAfter = retryAfter;
  }

  return response;
};

/**
 * Custom rate limit handler with logging
 */
const createRateLimitHandler = (limitType: string, customMessage?: string) => {
  return (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const retryAfter = res.getHeader('Retry-After') as number;
    
    logger.warn('Rate limit exceeded', {
      type: limitType,
      ip,
      userAgent,
      path: req.path,
      method: req.method,
      retryAfter,
    });

    const message = customMessage || 'Too many requests, please try again later.';
    
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(
      createRateLimitErrorResponse(message, retryAfter)
    );
  };
};

/**
 * Global rate limiter for general API endpoints using security config
 */
export const generalRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.max,
  message: securityConfig.rateLimit.message,
  standardHeaders: securityConfig.rateLimit.standardHeaders,
  legacyHeaders: securityConfig.rateLimit.legacyHeaders,
  handler: createRateLimitHandler('GENERAL', securityConfig.rateLimit.message.error),
  keyGenerator: (req: Request): string => req.ip || 'unknown',
  // TODO(claude): Add Redis store for distributed rate limiting
  // store: new RedisStore({ client: redisClient }),
});

/**
 * Stricter rate limiter for authentication endpoints (5 req/15min/IP)
 */
export const authRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.AUTH_WINDOW_MINUTES * 60 * 1000,
  max: RATE_LIMIT_CONFIG.AUTH_MAX_REQUESTS,
  message: createRateLimitErrorResponse(
    'Too many authentication attempts from this IP, please try again later.',
  ),
  standardHeaders: RATE_LIMIT_CONFIG.ENABLE_RATE_LIMIT_HEADERS,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful auth attempts
  handler: createRateLimitHandler('AUTH', MESSAGES.AUTH.ACCOUNT_LOCKED),
  keyGenerator: (req: Request): string => {
    // Use IP address for auth rate limiting
    return req.ip || 'unknown';
  },
});

/**
 * Create custom rate limiter with specific configuration
 */
export const createCustomRateLimit = (options: {
  windowMinutes: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  limitType?: string;
}): RateLimitRequestHandler => {
  const {
    windowMinutes,
    maxRequests,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req: Request) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    limitType = 'CUSTOM',
  } = options;

  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: createRateLimitErrorResponse(message),
    standardHeaders: RATE_LIMIT_CONFIG.ENABLE_RATE_LIMIT_HEADERS,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: createRateLimitHandler(limitType, message),
    keyGenerator,
  });
};

/**
 * Legacy default rate limiter (deprecated - use generalRateLimit instead)
 * @deprecated Use generalRateLimit instead
 */
export const defaultRateLimiter = generalRateLimit;

// Auth rate limiter is now defined above as authRateLimit

/**
 * PvP action rate limiter
 * Enforces cooldown between kills and hourly kill limit
 */
export const pvpRateLimiter: RateLimitRequestHandler = createCustomRateLimit({
  windowMinutes: 60, // 1 hour window
  maxRequests: PVP_LIMITS.MAX_KILLS_PER_HOUR,
  message: MESSAGES.PVP.HOURLY_LIMIT_REACHED,
  keyGenerator: (req: Request): string => {
    // Use character ID if available
    return req.user?.accountId || req.ip || 'unknown';
  },
  limitType: 'PVP',
});

/**
 * Banking transaction rate limiter
 * Prevents spam of banking operations
 */
export const bankingRateLimiter: RateLimitRequestHandler = createCustomRateLimit({
  windowMinutes: 1, // 1 minute window
  maxRequests: parseInt(process.env['RATE_LIMIT_BANKING_MAX_REQUESTS'] || '10'),
  message: 'Too many banking operations, please wait before trying again.',
  keyGenerator: (req: Request): string => {
    return req.user?.accountId || req.ip || 'unknown';
  },
  limitType: 'BANKING',
});

/**
 * Chat message rate limiter
 * Prevents chat spam
 */
export const chatRateLimiter: RateLimitRequestHandler = createCustomRateLimit({
  windowMinutes: 1, // 1 minute window
  maxRequests: parseInt(process.env['RATE_LIMIT_CHAT_MAX_REQUESTS'] || '20'),
  message: 'You are sending messages too quickly. Please slow down.',
  keyGenerator: (req: Request): string => {
    return req.user?.accountId || req.ip || 'unknown';
  },
  limitType: 'CHAT',
  // TODO(claude): Implement progressive delays for repeat offenders
});

/**
 * Custom PvP cooldown middleware
 * Enforces the PK_COOLDOWN_MINUTES between kills
 * TODO(claude): This needs to be implemented with proper state management
 */
export const pvpCooldownMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO(claude): Implement cooldown check
    // 1. Check last kill timestamp from database or cache
    // 2. Calculate if cooldown period has passed
    // 3. Return error if still on cooldown

    // Placeholder implementation
    const characterId = req.params['characterId'] || req.body?.characterId;

    if (!characterId) {
      next();
      return;
    }

    // TODO(claude): Query last PK timestamp from database
    // const lastKill = await pkKillLogRepository.getLastKillByAttacker(characterId);
    // const cooldownExpiry = new Date(lastKill.timestamp.getTime() + PVP_LIMITS.PK_COOLDOWN_MINUTES * 60 * 1000);
    // if (new Date() < cooldownExpiry) {
    //   const cooldownRemaining = Math.ceil((cooldownExpiry.getTime() - Date.now()) / 1000);
    //   logger.warn('PvP cooldown violation', {
    //     characterId,
    //     cooldownRemaining,
    //     ip: req.ip,
    //   });
    //   res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(
    //     createRateLimitErrorResponse(MESSAGES.PVP.ON_COOLDOWN, cooldownRemaining)
    //   );
    //   return;
    // }

    next();
  } catch (error) {
    logger.error('Error in PvP cooldown middleware', {
      error: error instanceof Error ? error.message : 'Unknown error',
      characterId: req.params['characterId'] || req.body?.characterId,
      ip: req.ip,
    });
    next(error);
  }
};

/**
 * Legacy create rate limiter function (deprecated - use createCustomRateLimit instead)
 * @deprecated Use createCustomRateLimit instead for more comprehensive options
 */
export const createRateLimiter = (
  windowMinutes: number,
  maxRequests: number,
  message?: string
): RateLimitRequestHandler => {
  return createCustomRateLimit({
    windowMinutes,
    maxRequests,
    message: message || 'Too many requests, please try again later.',
    limitType: 'LEGACY',
  });
};

/**
 * Utility function to get rate limit info from headers
 */
export const getRateLimitInfo = (res: Response) => {
  return {
    limit: res.getHeader('RateLimit-Limit'),
    remaining: res.getHeader('RateLimit-Remaining'),
    reset: res.getHeader('RateLimit-Reset'),
    retryAfter: res.getHeader('Retry-After'),
  };
};

/**
 * Middleware to add rate limit configuration info to response
 */
export const addRateLimitInfo = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Add custom headers for rate limit configuration
  res.setHeader('X-RateLimit-Policy', 'Global: 100/15min, Auth: 5/15min');
  res.setHeader('X-RateLimit-Configured', 'true');
  next();
};
