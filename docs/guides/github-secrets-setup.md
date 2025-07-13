# GitHub Secrets Setup Guide

**Version:** 1.0.0  
**Date:** 2025-07-13  
**For:** Aeturnis-Project Repository

## Required Secrets

Configure these secrets in your GitHub repository for CI/CD to work properly:

### 1. DATABASE_URL (Required)

**Purpose**: Production database connection string  
**Format**: PostgreSQL connection URL with SSL

**Setup Steps**:

1. Go to https://github.com/Aeturnia/Aeturnis-Project/settings/secrets/actions
2. Click "New repository secret"
3. Name: `DATABASE_URL`
4. Value: Your Neon database connection string
5. Click "Add secret"

**Security Note**: This secret is only accessible during GitHub Actions runs and
cannot be viewed after creation.

### 2. CODECOV_TOKEN (Required)

**Purpose**: Code coverage reporting  
**Obtained from**: https://codecov.io/gh/Aeturnia/Aeturnis-Project

**Setup Steps**:

1. Login to Codecov with GitHub
2. Navigate to Aeturnis-Project
3. Copy the repository token
4. Add as GitHub secret named `CODECOV_TOKEN`

### 3. JWT_SECRET (Future)

**Purpose**: JWT token signing key  
**Format**: 32-byte hex string

**Generation**:

```bash
openssl rand -hex 32
```

### 4. REDIS_URL (Future)

**Purpose**: Redis connection for caching and PK cooldowns  
**Format**: `redis://user:password@host:port`

## Verifying Secrets

To verify secrets are properly configured:

1. **Check CI Status**:
   - Push a commit to trigger CI
   - Check Actions tab for successful runs

2. **Database Connection**:
   - CI should successfully run Prisma migrations
   - No database connection errors in logs

3. **Coverage Upload**:
   - Codecov comment should appear on PRs
   - Coverage badge should update

## Environment-Specific Configuration

### Development

- Use `.env` file locally (never commit)
- Copy from `.env.example`

### CI/CD

- Uses GitHub Secrets
- Falls back to test database if DATABASE_URL not set

### Production

- Uses GitHub Secrets for deployments
- Separate secrets per environment recommended

## Security Best Practices

1. **Regular Rotation**: Rotate secrets every 90 days
2. **Minimal Access**: Only add team members who need access
3. **Audit Trail**: Review secret access in Security logs
4. **No Hardcoding**: Never put secrets in code
5. **Environment Separation**: Use different credentials per environment

## Troubleshooting

### Secret Not Found

```
Error: Error: Input required and not supplied: token
```

**Solution**: Ensure secret name matches exactly (case-sensitive)

### Database Connection Failed

```
Error: P1001: Can't reach database server
```

**Solution**:

- Verify DATABASE_URL format
- Check SSL mode is set correctly
- Ensure database is accessible

### Permission Denied

```
Error: HttpError: Resource not accessible by integration
```

**Solution**: Check repository settings allow Actions to access secrets

## Adding New Secrets

When adding new secrets:

1. Document in this guide
2. Update `.env.example`
3. Add to CI workflow if needed
4. Test in feature branch first

---

**Important**: This guide references secret names only. Never document actual
secret values anywhere in the repository.
