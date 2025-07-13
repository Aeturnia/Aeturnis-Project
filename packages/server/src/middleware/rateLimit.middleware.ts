import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, MESSAGES, SECURITY, PVP_LIMITS } from '../utils/constants';

/**
 * Default rate limiter for general API endpoints
 */
export const defaultRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: SECURITY.RATE_LIMIT.WINDOW_MINUTES * 60 * 1000, // Convert to milliseconds
  max: SECURITY.RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // TODO(claude): Add Redis store for distributed rate limiting
  // store: new RedisStore({ client: redisClient }),
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
  message: {
    success: false,
    error: MESSAGES.AUTH.ACCOUNT_LOCKED,
  },
  skipSuccessfulRequests: true, // Don't count successful auth attempts
  // TODO(claude): Implement custom key generator based on email/IP combination
  keyGenerator: (req: Request): string => {
    // For now, use IP address
    return req.ip || 'unknown';
  },
});

/**
 * PvP action rate limiter
 * Enforces cooldown between kills and hourly kill limit
 */
export const pvpRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: PVP_LIMITS.MAX_KILLS_PER_HOUR,
  message: {
    success: false,
    error: MESSAGES.PVP.HOURLY_LIMIT_REACHED,
  },
  // TODO(claude): Add custom store that tracks cooldown between individual kills
  // This requires more complex logic than simple rate limiting
  keyGenerator: (req: Request): string => {
    // Use character ID if available
    return req.user?.accountId || req.ip || 'unknown';
  },
  handler: (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: MESSAGES.PVP.HOURLY_LIMIT_REACHED,
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Banking transaction rate limiter
 * Prevents spam of banking operations
 */
export const bankingRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10, // Max 10 banking operations per minute
  message: {
    success: false,
    error: 'Too many banking operations, please wait before trying again.',
  },
  keyGenerator: (req: Request): string => {
    return req.user?.accountId || req.ip || 'unknown';
  },
});

/**
 * Chat message rate limiter
 * Prevents chat spam
 */
export const chatRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // Max 20 messages per minute
  message: {
    success: false,
    error: 'You are sending messages too quickly. Please slow down.',
  },
  // TODO(claude): Implement progressive delays for repeat offenders
  keyGenerator: (req: Request): string => {
    return req.user?.accountId || req.ip || 'unknown';
  },
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
    //   res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
    //     success: false,
    //     error: MESSAGES.PVP.ON_COOLDOWN,
    //     cooldownRemaining: Math.ceil((cooldownExpiry.getTime() - Date.now()) / 1000),
    //   });
    //   return;
    // }

    next();
  } catch (error) {
    // TODO(claude): Add proper error logging
    next(error);
  }
};

/**
 * Create custom rate limiter with specific configuration
 */
export const createRateLimiter = (
  windowMinutes: number,
  maxRequests: number,
  message?: string
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: {
      success: false,
      error: message || 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
