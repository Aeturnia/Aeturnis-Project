# Aeturnis Online: Core Architecture Overview

**Catalog Tag:** [P1-S1-1]  
**Version:** 1.0.0  
**Date:** 2025-07-13  
**Agent:** Claude Code (Backend Specialist)

## Executive Summary

This document defines the core backend architecture for Aeturnis Online Phase 1
MVP. The architecture follows a service-oriented design with clear separation of
concerns, built on our existing pnpm monorepo foundation with Prisma ORM and
comprehensive testing requirements.

## Phase 1 Core Services Breakdown

### 1. AuthService

**Responsibility:** User authentication, session management, account lifecycle

- Account registration/login
- JWT token management
- Password hashing (bcrypt)
- Session validation middleware
- Account recovery flows

### 2. BankingService

**Responsibility:** Banking operations, critical for death penalty system

- Gold deposit/withdrawal operations
- Bank balance tracking
- Transaction logging
- Shared account bank features
- Bank expansion functionality

### 3. CharacterService

**Responsibility:** Character management, progression, lifecycle

- Character creation/deletion
- Level and XP management
- Character stats and metadata
- Character slot management (3 per account)
- Auto-deletion policy (level <10, 30 days inactive)

### 4. CombatService

**Responsibility:** Combat mechanics, damage calculation, death handling

- Death penalty processing (lose unbanked gold + 20% XP)
- Respawn system coordination
- Combat state management
- Durability damage on death
- Integration with BankingService for death penalties

### 5. PKService (Player Kill)

**Responsibility:** PvP system, alignment tracking, cooldowns

- PK kill logging and validation
- 10-minute cooldown enforcement
- 6 kills/hour limit tracking
- Alignment system (-1000 to +1000)
- PK tag system functionality

### 6. XPService

**Responsibility:** Experience point management, leveling mechanics

- XP gain/loss calculations
- Level progression tracking
- XP ledger logging
- Death penalty XP loss (20% to next level)
- Integration with combat and death systems

## Architecture Patterns & Communication

### Service Communication Model

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Controllers │───▶│  Services   │───▶│ Repositories│
│  (HTTP/WS)  │    │  (Business  │    │ (Data Layer)│
│             │    │   Logic)    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Routes    │    │ Event Bus   │    │   Prisma    │
│ (Express)   │    │ (EventEmitter)    │   Client    │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Synchronous vs Asynchronous Flows

**Synchronous Operations:**

- User authentication requests
- Banking operations (deposits/withdrawals)
- Character data retrieval
- Combat damage calculations

**Asynchronous Operations:**

- XP ledger logging
- Transaction history updates
- PK kill logging
- Death penalty processing
- Event notifications

### Data Consistency Boundaries

**Transactional Boundaries:**

1. **Death Processing**: Character gold → bank transfer + XP loss + transaction
   log
2. **Banking Operations**: Balance updates + transaction logging
3. **Character Creation**: Account validation + character slot check + creation
4. **PK Kill Processing**: Kill logging + alignment updates + cooldown tracking

## Directory Structure

```
packages/server/src/
├── controllers/          # HTTP route handlers
│   ├── auth.controller.ts
│   ├── banking.controller.ts
│   ├── character.controller.ts
│   ├── combat.controller.ts
│   ├── pk.controller.ts
│   └── xp.controller.ts
├── services/            # Business logic layer
│   ├── auth.service.ts
│   ├── banking.service.ts
│   ├── character.service.ts
│   ├── combat.service.ts
│   ├── pk.service.ts
│   └── xp.service.ts
├── repositories/        # Data access layer
│   ├── account.repository.ts
│   ├── character.repository.ts
│   ├── bankAccount.repository.ts
│   ├── transaction.repository.ts
│   ├── xpLedger.repository.ts
│   └── pkKillLog.repository.ts
├── types/              # Shared TypeScript interfaces
│   ├── auth.types.ts
│   ├── banking.types.ts
│   ├── character.types.ts
│   ├── combat.types.ts
│   └── common.types.ts
├── middleware/         # Express middleware
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── logging.middleware.ts
├── routes/             # Express route definitions
│   ├── auth.routes.ts
│   ├── banking.routes.ts
│   ├── character.routes.ts
│   ├── combat.routes.ts
│   └── pk.routes.ts
├── events/             # Event system
│   ├── eventBus.ts
│   └── events.types.ts
├── utils/              # Utility functions
│   ├── validation.ts
│   ├── crypto.ts
│   └── constants.ts
├── lib/                # External integrations
│   └── prisma.ts
└── index.ts            # Express app initialization
```

## Service to Database Model Mapping

### AuthService ↔ Account Model

- User registration/login operations
- Account metadata management
- Session tracking via lastLoginAt

### BankingService ↔ BankAccount + Transaction Models

- Bank balance operations
- Transaction history logging
- Banking-related character gold management

### CharacterService ↔ Character Model

- Character CRUD operations
- Character progression tracking
- Multi-character account management

### CombatService ↔ Character + Transaction + XpLedger Models

- Death penalty processing
- Combat state management
- Cross-service coordination for death consequences

### PKService ↔ PkKillLog + Character Models

- PvP kill tracking
- Alignment management via Character.alignment
- Cooldown and limit enforcement

### XPService ↔ XpLedger + Character Models

- XP gain/loss processing
- Level progression calculations
- XP transaction logging

## Technology Stack Decisions

### Core Libraries

- **Express.js**: HTTP server framework
- **Prisma**: Database ORM and migrations
- **Zod**: Runtime type validation and schema definition
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **Winston**: Structured logging
- **ioredis**: Redis client for caching

### Development Tools

- **Vitest**: Unit and integration testing
- **ESLint + Prettier**: Code quality and formatting
- **TypeScript**: Static type checking
- **pnpm**: Package management

### Validation Strategy

- **Zod schemas** for all API inputs/outputs
- **Middleware-based validation** for route protection
- **Repository-level validation** for data integrity

### Event System

- **Node.js EventEmitter** for inter-service communication
- **Async event handlers** for non-critical operations
- **Error boundaries** for event handler failures

### Error Handling

- **Custom error classes** for different error types
- **Global error middleware** for Express
- **Structured error logging** with Winston
- **Error propagation** through service layers

## API Contract Definitions

### Authentication Routes

```typescript
POST / api / auth / register;
POST / api / auth / login;
POST / api / auth / logout;
GET / api / auth / profile;
PUT / api / auth / profile;
POST / api / auth / recover;
```

### Banking Routes

```typescript
GET    /api/banking/balance/:characterId
POST   /api/banking/deposit
POST   /api/banking/withdraw
GET    /api/banking/transactions/:characterId
```

### Character Routes

```typescript
GET    /api/characters
POST   /api/characters
GET    /api/characters/:id
PUT    /api/characters/:id
DELETE /api/characters/:id
```

### Combat Routes

```typescript
POST   /api/combat/death/:characterId
POST   /api/combat/respawn/:characterId
GET    /api/combat/status/:characterId
```

### PK Routes

```typescript
POST   /api/pk/kill
GET    /api/pk/history/:characterId
GET    /api/pk/cooldown/:characterId
```

## Testing Strategy

### Unit Tests (90%+ coverage required)

- Service layer business logic testing
- Repository layer data access testing
- Utility function testing
- Error handling validation

### Integration Tests

- End-to-end API route testing
- Database transaction testing
- Service integration testing
- Event system testing

### Test Data Management

- Isolated test databases
- Data seeding utilities
- Test cleanup procedures
- Mock external dependencies

## Implementation Roadmap

### Phase 1a: Foundation Services

1. **AuthService** - Authentication infrastructure
2. **CharacterService** - Basic character management
3. **BankingService** - Critical for death penalties

### Phase 1b: Core Game Mechanics

1. **CombatService** - Death and respawn system
2. **XPService** - Experience management
3. **PKService** - PvP functionality

### Phase 1c: Integration & Polish

1. Event system implementation
2. Comprehensive error handling
3. Performance optimization
4. Security hardening

## Security Considerations

- **Input validation** on all API endpoints
- **SQL injection prevention** via Prisma
- **Rate limiting** on sensitive endpoints
- **JWT token expiration** and refresh mechanisms
- **Password strength enforcement**
- **Account lockout** after failed attempts

## Performance Considerations

- **Database indexing** on frequently queried fields
- **Connection pooling** for database efficiency
- **Caching strategy** for read-heavy operations
- **Async processing** for non-critical operations
- **Query optimization** for complex joins

## Error Recovery & Monitoring

- **Health check endpoints** for service monitoring
- **Graceful degradation** during service failures
- **Transaction rollback** on operation failures
- **Dead letter queues** for failed async operations
- **Alerting integration** for critical errors

---

This architecture provides a solid foundation for Phase 1 MVP development while
maintaining scalability for future phases. Each service maintains clear
boundaries and responsibilities, enabling parallel development and easier
testing.
