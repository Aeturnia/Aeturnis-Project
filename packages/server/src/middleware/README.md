# Security Middleware Documentation

This directory contains security middleware implementations for the Aeturnis
Online server.

## Available Middleware

### 1. Authentication Middleware (`auth.middleware.ts`)

**Purpose**: Verify JWT tokens and protect routes that require authentication.

**Usage**:

```typescript
import { authenticateToken, optionalAuth } from '../middleware';

// Protect route - requires valid JWT
router.get('/protected', authenticateToken, handler);

// Optional auth - attaches user if token present
router.get('/public', optionalAuth, handler);
```

**Features**:

- Extracts JWT from Authorization header (Bearer token)
- Attaches user data to `req.user`
- Returns 401 for invalid/missing tokens

### 2. Rate Limiting Middleware (`rateLimit.middleware.ts`)

**Purpose**: Comprehensive rate limiting to prevent abuse and ensure fair usage.

**Core Features**:
- Global rate limiting (100 req/15min/IP)
- Stricter auth rate limiting (5 req/15min/IP)
- Environment variable configuration
- Comprehensive logging of violations
- Standard error responses with retry information
- Rate limit headers for client feedback

**Available Rate Limiters**:

#### Primary Limiters
- `generalRateLimit`: 100 requests per 15 minutes per IP (replaces defaultRateLimiter)
- `authRateLimit`: 5 requests per 15 minutes per IP (authentication endpoints)

#### Specialized Limiters
- `pvpRateLimiter`: 6 kills per hour (PvP actions)
- `bankingRateLimiter`: 10 operations per minute (banking transactions)
- `chatRateLimiter`: 20 messages per minute (chat messages)

#### Helper Functions
- `createCustomRateLimit`: Create custom rate limiters with specific configuration
- `getRateLimitInfo`: Extract rate limit information from response headers
- `addRateLimitInfo`: Add rate limit policy headers to responses

**Usage Examples**:

```typescript
import { 
  generalRateLimit, 
  authRateLimit, 
  createCustomRateLimit,
  bankingRateLimiter 
} from '../middleware';

// Apply global rate limiting
app.use('/api', generalRateLimit);

// Apply strict auth limiting
router.post('/login', authRateLimit, handler);
router.post('/register', authRateLimit, handler);

// Apply banking rate limiting
router.use('/banking', bankingRateLimiter);

// Create custom rate limiter
const uploadLimiter = createCustomRateLimit({
  windowMinutes: 60,
  maxRequests: 5,
  message: 'Too many uploads, try again later',
  keyGenerator: (req) => req.user?.accountId || req.ip,
  limitType: 'UPLOAD'
});
router.post('/upload', uploadLimiter, handler);
```

**Environment Configuration**:

```bash
# Global limits
RATE_LIMIT_GLOBAL_WINDOW_MINUTES=15
RATE_LIMIT_GLOBAL_MAX_REQUESTS=100

# Auth limits
RATE_LIMIT_AUTH_WINDOW_MINUTES=15
RATE_LIMIT_AUTH_MAX_REQUESTS=5

# Feature-specific limits
RATE_LIMIT_BANKING_MAX_REQUESTS=10
RATE_LIMIT_CHAT_MAX_REQUESTS=20

# Headers and proxy settings
RATE_LIMIT_ENABLE_HEADERS=true
RATE_LIMIT_TRUST_PROXY=false
```

**Error Response Format**:

Rate limit violations return standardized error responses:

```json
{
  "success": false,
  "error": "Too many requests, please try again later.",
  "type": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

**Rate Limit Headers**:

Responses include rate limit information:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in window
- `RateLimit-Reset`: Unix timestamp when window resets
- `Retry-After`: Seconds to wait (on rate limit exceeded)

### 3. Validation Middleware (`validation.middleware.ts`)

**Purpose**: Validate request data using Zod schemas.

**Usage**:

```typescript
import { validate } from '../middleware';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/register', validate(schema), handler);
```

**Features**:

- Validates body, query, or params
- Returns detailed validation errors
- Supports async custom validation

### 4. Error Handling Middleware (`error.middleware.ts`)

**Purpose**: Global error handling and consistent error responses.

**Usage**:

```typescript
// In main server file
import { errorHandler, errorLogger, notFoundHandler } from '../middleware';

// Apply at the end of middleware stack
app.use(errorLogger); // Development logging
app.use(errorHandler); // Global error handler
app.use(notFoundHandler); // 404 handler
```

**Custom Error Classes**:

```typescript
import { createError } from '../middleware';

// Throw custom errors
throw createError.notFound('User');
throw createError.validation('Invalid input', details);
throw createError.unauthorized();
```

## Implementation Status

Current status of middleware implementations:

1. **Auth**: ✅ Core functionality complete, needs JWT refresh logic enhancement
2. **Rate Limiting**: ✅ **COMPLETE** - Full implementation with environment config, logging, and tests
3. **Validation**: ✅ Core functionality complete, may need custom validators
4. **Error Handling**: Needs integration with logging service

### Rate Limiting - Recently Updated
The rate limiting middleware has been **fully implemented** with:
- ✅ Global and auth-specific rate limiters (100/15min, 5/15min)
- ✅ Environment variable configuration
- ✅ Comprehensive error handling and logging
- ✅ Standard error response format
- ✅ Rate limit headers for client feedback
- ✅ Helper functions for custom rate limiters
- ✅ Complete unit test coverage (13 tests)
- ✅ Game-specific limiters (banking, chat, PvP)
- ✅ Documentation and usage examples

## Security Constants

All security-related constants are defined in `/utils/constants.ts`:

- JWT expiration times
- Rate limit windows and thresholds
- Password requirements
- PvP cooldowns and limits

## Next Steps

1. ✅ ~~Set up comprehensive rate limiting~~ **COMPLETED**
2. Set up Redis for distributed rate limiting (future enhancement)
3. Implement JWT refresh token logic
4. Add request logging and monitoring
5. Create custom validators for game-specific rules
6. Set up proper error tracking service

### Rate Limiting Future Enhancements
While the current implementation is production-ready, potential future improvements include:
- Redis store for distributed deployments
- Progressive delays for repeat offenders
- IP whitelisting for trusted sources
- User-specific rate limiting beyond IP-based
- Advanced analytics and monitoring
