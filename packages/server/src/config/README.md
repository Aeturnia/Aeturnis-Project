# Security Configuration

This directory contains the security configuration for the Aeturnis Online server, implementing comprehensive security headers and policies using Helmet.js.

## Overview

The security configuration provides:

- **Content Security Policy (CSP)** - Prevents XSS attacks and data injection
- **HTTP Strict Transport Security (HSTS)** - Forces HTTPS connections
- **X-Frame-Options** - Prevents clickjacking attacks
- **X-Content-Type-Options** - Prevents MIME type sniffing
- **Referrer Policy** - Controls referrer information sharing
- **CORS Configuration** - Manages cross-origin resource sharing
- **Rate Limiting** - Prevents abuse and DoS attacks

## Files

### `security.config.ts`

The main security configuration file that exports:

- `helmetConfig` - Helmet middleware configuration
- `securityConfig` - Complete security configuration including CORS and rate limiting
- `apiSecurityHeaders` - Additional headers for API responses
- `getSecurityLevel()` - Environment-based security level detection

## Configuration

### Environment Variables

The security configuration responds to these environment variables:

```bash
# Frontend URL for CORS configuration
FRONTEND_URL="http://localhost:3001"

# WebSocket URL for CSP connect-src
WEBSOCKET_URL="ws://localhost:3000"

# Environment determines security strictness
NODE_ENV="development|staging|production"
```

### Development vs Production

**Development Mode (`NODE_ENV=development`):**
- CSP in report-only mode
- Higher rate limits (1000 requests/15min)
- Allows `unsafe-eval` for development tools
- Permits localhost connections for hot reloading

**Production Mode (`NODE_ENV=production`):**
- Strict CSP enforcement
- Lower rate limits (100 requests/15min)
- HSTS enabled with preload
- Strict security policies

## Security Headers Applied

### Helmet Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Enables XSS filtering |
| `Referrer-Policy` | `no-referrer` | Prevents referrer leakage |
| `X-Permitted-Cross-Domain-Policies` | `none` | Blocks cross-domain policies |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS (production) |

### Content Security Policy

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' [frontend-origin] [websocket-origin];
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
```

### CORS Policy

- **Allowed Origins**: Frontend URL from environment
- **Credentials**: Enabled for authentication
- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Authorization, Content-Type, X-API-Key, etc.

## Rate Limiting

### Global Rate Limits

- **Window**: 15 minutes
- **Development**: 1000 requests per IP
- **Production**: 100 requests per IP

### Endpoint-Specific Limits

- **Authentication**: 5 requests per 15 minutes
- **Banking**: 10 requests per minute
- **Chat**: 20 messages per minute
- **PvP**: 6 kills per hour with 10-minute cooldown

## Usage

### Basic Setup

```typescript
import { securityConfig } from './config/security.config';

// Apply Helmet security headers
app.use(helmet(securityConfig.helmet));

// Configure CORS
app.use(cors(securityConfig.cors));

// Apply rate limiting
app.use(rateLimit(securityConfig.rateLimit));
```

### Custom Security Headers

```typescript
import { apiSecurityHeaders } from './config/security.config';

app.use((req, res, next) => {
  Object.entries(apiSecurityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  next();
});
```

## Testing

### Unit Tests

```bash
npm test -- src/__tests__/config/security.config.test.ts
```

### Integration Tests

```bash
npm test -- src/__tests__/integration/security.integration.test.ts
```

### Manual Validation

```bash
# Start the server
npm run dev

# Run security header validation script
tsx scripts/test-security-headers.ts
```

## Security Considerations

### Production Deployment

1. **HTTPS Required**: Set `FRONTEND_URL` and `WEBSOCKET_URL` to use HTTPS/WSS
2. **Environment Variables**: Ensure `NODE_ENV=production` for strict policies
3. **Proxy Setup**: Set `RATE_LIMIT_TRUST_PROXY=true` if behind a load balancer
4. **JWT Secrets**: Use strong, randomly generated JWT secrets
5. **Database Security**: Use encrypted connections and strong credentials

### Common Issues

1. **CSP Violations**: Check browser console for CSP errors in development
2. **CORS Errors**: Ensure frontend URL matches exactly (no trailing slash)
3. **Rate Limiting**: Monitor rate limit headers in responses
4. **WebSocket Connections**: Verify WSS protocol in production

### Monitoring

Monitor these metrics in production:

- CSP violation reports
- Rate limit hit counts
- CORS preflight success rates
- Security header compliance
- SSL certificate status

## Future Enhancements

- [ ] Redis-based distributed rate limiting
- [ ] CSP violation reporting endpoint
- [ ] Security header monitoring dashboard
- [ ] Automated security scanning integration
- [ ] IP-based geolocation blocking
- [ ] Advanced bot detection