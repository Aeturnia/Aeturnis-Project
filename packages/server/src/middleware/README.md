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

**Purpose**: Prevent abuse by limiting request frequency.

**Available Limiters**:

- `defaultRateLimiter`: 100 requests per 15 minutes (general API)
- `authRateLimiter`: 5 requests per 15 minutes (auth endpoints)
- `pvpRateLimiter`: 6 kills per hour (PvP actions)
- `bankingRateLimiter`: 10 operations per minute
- `chatRateLimiter`: 20 messages per minute

**Usage**:

```typescript
import { authRateLimiter, pvpRateLimiter } from '../middleware';

// Apply to specific routes
router.post('/login', authRateLimiter, handler);
router.post('/pk/kill', pvpRateLimiter, handler);
```

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

All middleware are currently **skeleton implementations** with TODO comments
marking areas that need full implementation:

1. **Auth**: Needs proper JWT secret management, token refresh logic
2. **Rate Limiting**: Needs Redis store for distributed systems
3. **Validation**: Core functionality complete, may need custom validators
4. **Error Handling**: Needs integration with logging service

## Security Constants

All security-related constants are defined in `/utils/constants.ts`:

- JWT expiration times
- Rate limit windows and thresholds
- Password requirements
- PvP cooldowns and limits

## Next Steps

1. Set up Redis for distributed rate limiting
2. Implement JWT refresh token logic
3. Add request logging and monitoring
4. Create custom validators for game-specific rules
5. Set up proper error tracking service
