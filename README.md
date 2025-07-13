# Aeturnis Online

[![CI](https://github.com/Aeturnia/Aeturnis-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Aeturnia/Aeturnis-Project/actions/workflows/ci.yml)

A multiplayer online RPG game built with Node.js and modern web technologies.

## Project Structure

This is a monorepo using pnpm workspaces:

- `packages/server/` - Game server backend
- `packages/client/` - Web client frontend
- `packages/shared/` - Shared utilities and types

## Development

### Prerequisites

- Node.js (LTS version)
- pnpm 8.x
- PostgreSQL

### Setup

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint

# Build all packages
pnpm build
```

### Running CI Locally

You can run the CI pipeline locally using:

- **act**: `act -j ci` (requires Docker)
- **devcontainer**: Use VS Code dev containers for consistent environment

### Database

The project uses Prisma for database management. See `packages/server/prisma/`
for schema and migrations.

#### Database Setup

1. **Configure Environment Variables**:

   ```bash
   # Copy example environment file
   cp packages/server/.env.example packages/server/.env

   # Edit DATABASE_URL in .env file
   ```

2. **Run Migrations**:

   ```bash
   # Apply migrations to database
   cd packages/server
   pnpm prisma migrate deploy
   ```

3. **Seed Database** (Optional):

   ```bash
   # Populate database with test data
   cd packages/server
   pnpm prisma db seed
   ```

4. **Reset Database** (Development):
   ```bash
   # Reset and reseed database
   cd packages/server
   pnpm prisma migrate reset
   ```

## Architecture

- **Backend**: Node.js with TypeScript
- **Frontend**: React with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting locally
4. Submit a pull request

All code must pass CI checks before merging.
