# Version History

## v1.1.0-dev "Fenrir" - In Development

**Theme**: The Wolf That Devours - Banking & Death Systems

### 🔄 In Progress

- Banking Service implementation
- Death & Respawn system
- Account Management enhancements

### Planned Changes

- Gold deposit/withdraw functionality
- Bank storage tabs with expansion
- Death penalty system (lose unbanked gold + 20% XP)
- Graveyard respawn points
- Character slot management (3 per account)
- Account profiles and settings

---

## v1.0.0 "Jörmun" - 2025-07-13

**Theme**: The Foundation Serpent - Core Infrastructure

### Server Changes

#### Infrastructure & Architecture

- ✅ pnpm monorepo bootstrap with workspace configuration
- ✅ GitHub Actions CI/CD pipeline with PostgreSQL services
- ✅ Complete Prisma schema with 6 core models:
  - Account (user authentication)
  - Character (player avatars)
  - BankAccount (gold storage)
  - Transaction (banking history)
  - XpLedger (experience tracking)
  - PkKillLog (PvP history)
- ✅ Production database migration: `20250713024743_init`
- ✅ Neon PostgreSQL configuration with SSL

#### Core Systems

- ✅ Dependency Injection container with service registration
- ✅ Repository pattern with base abstractions
- ✅ Service layer for all game systems (Auth, Banking, Character, Combat, PK,
  XP)
- ✅ Event-driven architecture with type-safe event bus
- ✅ RESTful API controllers with Express
- ✅ Comprehensive middleware stack

#### Security & Auth (v1.1.0-dev preview)

- ✅ JWT authentication system (access & refresh tokens)
- ✅ Argon2 password hashing (argon2id, 64MB, 3 iterations)
- ✅ Rate limiting (100 req/15min global, 5 req/15min auth)
- ✅ Zod validation schemas for all endpoints
- ✅ Helmet security headers with CSP

### Client Changes

- ✅ React + TypeScript + Vite setup
- ✅ Basic project structure
- ✅ 100% test coverage on entry point

### Testing & Quality

- ✅ 258 comprehensive tests (server)
- ✅ 91.66% test coverage initially
- ✅ Test isolation with transaction wrappers
- ✅ Factory helpers for test data
- ✅ Integration tests for all endpoints

### DevOps & Tooling

- ✅ ESLint + Prettier with pre-commit hooks
- ✅ Vitest testing framework
- ✅ TypeScript strict mode across all packages
- ✅ Codecov integration for coverage reporting
- ✅ Automated dependency updates

### Documentation

- ✅ Comprehensive implementation reports
- ✅ Architecture documentation
- ✅ API documentation structure
- ✅ Database setup guides

### Performance

- Build time: <30 seconds
- Test suite: <2 minutes
- CI pipeline: <5 minutes
- Memory usage: <512MB

### Breaking Changes

- None (initial release)

### Migration Notes

For new installations:

```bash
# Install dependencies
pnpm install

# Set up database
pnpm prisma migrate deploy

# Seed database (optional)
pnpm prisma db seed

# Start development
pnpm dev
```

### Contributors

- Claude Code (Backend Specialist)
- System architecture and implementation

---

## Version Naming Convention

Our versions follow Norse mythology, representing the epic journey of building
Aeturnis Online:

### Phase 1 (MVP) - The Nine Realms

- v1.0 **Jörmun** - The foundation that encircles all
- v1.1 **Fenrir** - The wolf that devours (wealth system)
- v1.2 **Týr** - Justice and order (monitoring)
- v1.3 **Odin** - The creator (characters)
- v1.4 **Thor** - The warrior (combat)
- v1.5 **Loki** - The transformer (items)
- v1.6 **Freya** - The provider (economy)
- v1.7 **Heimdall** - The watchman (world)
- v1.8 **Baldur** - The beloved (social)
- v2.0 **Ragnarök** - The completion

### Phase 2 (Alpha) - The Heroic Age

- v2.x versions will use hero and saga names

### Phase 3 (Beta) - The Golden Halls

- v3.x versions will use location names from Norse mythology

### Phase 4 (Release) - The New World

- v4.0 **Gimle** - The shining place that survives Ragnarök
