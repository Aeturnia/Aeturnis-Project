# Database Setup Guide

**Version:** 1.0.0  
**Date:** 2025-07-13  
**Status:** Active

## Overview

Aeturnis Online uses PostgreSQL as its primary database. This guide covers both
local development and production database setup.

## Production Database (Neon)

The production database is hosted on Neon (PostgreSQL-compatible serverless
database).

### Connection Details

- **Provider**: Neon
- **Region**: US East 2 (AWS)
- **SSL**: Required
- **Connection Pooling**: Enabled

### Security Configuration

**IMPORTANT**: Never commit database credentials to the repository!

1. **GitHub Secrets Setup**:

   ```
   Go to: Settings → Secrets and variables → Actions
   Add secret: DATABASE_URL
   Value: [Your Neon connection string]
   ```

2. **Local Development**:
   - Copy `.env.example` to `.env`
   - Update DATABASE_URL with your connection string
   - Never commit `.env` file

## Local Development Database

For local development, use PostgreSQL 16:

### Docker Setup (Recommended)

```bash
# Start PostgreSQL container
docker run --name aeturnis-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aeturnis_dev \
  -p 5432:5432 \
  -d postgres:16-alpine

# Connection string for local development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aeturnis_dev?schema=public"
```

### Direct Installation

1. Install PostgreSQL 16 from https://www.postgresql.org/download/
2. Create database:
   ```sql
   CREATE DATABASE aeturnis_dev;
   ```

## Database Migrations

Using Prisma for database management:

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations (development)
pnpm prisma:migrate dev

# Run migrations (production)
pnpm prisma:migrate deploy

# Seed database with test data
pnpm prisma:seed

# Open Prisma Studio (GUI)
pnpm prisma:studio
```

## CI/CD Database

The CI pipeline uses a PostgreSQL service container:

- Automatically provisioned during GitHub Actions runs
- Uses test database: `aeturnis_test`
- No manual configuration needed

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=[mode]
```

Parameters:

- `sslmode=require` - Required for Neon
- `sslmode=disable` - For local development without SSL
- `schema=public` - Default schema

## Troubleshooting

### SSL Connection Issues

If you get SSL errors with Neon:

1. Ensure `?sslmode=require` is in the connection string
2. Check that your client supports SSL connections

### Connection Timeout

For Neon databases:

1. Database may sleep after inactivity
2. First connection after sleep may take 1-2 seconds
3. Consider implementing connection retry logic

### Permission Errors

Ensure the database user has necessary permissions:

```sql
GRANT ALL PRIVILEGES ON DATABASE aeturnis_dev TO your_user;
```

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Rotate credentials regularly** - Update in GitHub Secrets
3. **Use connection pooling** - Prevents connection exhaustion
4. **Enable SSL in production** - Always use `sslmode=require`
5. **Limit database access** - Use IP allowlists when possible

## Database Backup

For production data:

1. Neon provides automatic backups
2. Configure point-in-time recovery in Neon dashboard
3. Test restore procedures regularly

---

**Note**: This guide contains general setup instructions. Actual database
credentials should only be stored in secure environment variables or GitHub
Secrets.
