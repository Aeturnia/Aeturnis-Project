# Version History

## v1.0.0 - 2025-07-13

### Server Changes

- Initial monorepo bootstrap with pnpm workspaces
- Complete Prisma schema with 6 models (Account, Character, BankAccount,
  Transaction, XpLedger, PkKillLog)
- Production database migration committed: `20250713024743_init`
- 48 comprehensive CRUD tests with 91.66% coverage
- GitHub Actions CI/CD pipeline with PostgreSQL services
- Neon production database configuration

### Client Changes

- Initial React + TypeScript setup
- Basic component structure
- Vite build configuration
- 100% test coverage on entry point

### Infrastructure

- pnpm workspace monorepo structure
- ESLint + Prettier configuration
- Vitest testing framework with coverage thresholds
- TypeScript configuration for all packages
- Production-ready CI/CD pipeline

### Breaking Changes

- None (initial release)

### Migration Notes

- Run `pnpm prisma migrate deploy` to set up database
- Run `pnpm prisma db seed` for test data (optional)

## Planned v1.1.0 - TBD

### Planned Server Changes

- Banking Service implementation [P1-S7-1]
- Account Management system [P1-S2-1]
- Authentication endpoints
- Character creation APIs

### Planned Client Changes

- Login/registration UI
- Character creation interface
- Basic game UI framework
- Banking interface components

### Breaking Changes

- None planned (backward compatible)
