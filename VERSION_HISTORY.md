# Version History

## v1.0.0 "Jörmun" - 2025-07-13

### Server Changes

- Initial monorepo bootstrap with pnpm workspaces
- Complete Prisma schema with 6 models (Account, Character, BankAccount,
  Transaction, XpLedger, PkKillLog)
- Production database migration committed: `20250713024743_init`
- Core architecture implementation with:
  - Complete service layer (Auth, Banking, Character, Combat, PK, XP)
  - Repository pattern with base abstractions
  - Dependency injection container (IoC)
  - Type-safe event system with audit capabilities
  - Express server with middleware stack
  - RESTful API controllers for all services
- 258 comprehensive tests with 48.63% coverage
- GitHub Actions CI/CD pipeline with PostgreSQL services (fully green)
- Neon production database configuration

### Client Changes

- Initial React + TypeScript setup
- Basic component structure
- Vite build configuration
- 100% test coverage on entry point

### Infrastructure

- pnpm workspace monorepo structure
- ESLint + Prettier configuration with pre-commit hooks
- Vitest testing framework with coverage thresholds
- TypeScript configuration for all packages with strict mode
- Production-ready CI/CD pipeline
- Test infrastructure with factory helpers and FK handling
- Comprehensive error handling and security middleware

### Breaking Changes

- None (initial release)

### Migration Notes

- Run `pnpm prisma migrate deploy` to set up database
- Run `pnpm prisma db seed` for test data (optional)

## Planned v1.1.0 "Fenrir" - TBD

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
