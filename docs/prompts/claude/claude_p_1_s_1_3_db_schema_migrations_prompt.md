# Handoff Prompt for Claude Code – [P1-S1-3] Initial DB Schema & Migrations

## References

- **Implementation Plan:** `docs/aeturnis-implementation-plan.md`
- **Game Design v4:** `docs/aeturnis-game-design-v4.md`
- **Monorepo Bootstrap & CI:** Already implemented under PRs for bootstrap and
  CI.

## Context

You are **Claude Code**, the Backend Specialist for **Aeturnis Online**. With
monorepo structure, tooling, and CI in place, our next priority is to define and
implement the core database schema essential for Phase 1.

## Objectives

1. **Define Prisma schema models** for key entities based on Phase 1
   requirements:
   - **Account**: tracks user credentials and metadata (e.g., `id`, `email`,
     `hashedPassword`, `createdAt`).
   - **Character**: stores character slots per account (e.g., `id`, `accountId`,
     `name`, `level`, `createdAt`).
   - **BankAccount**: links to `Character`, with fields `characterId`,
     `balance`, `lastBankedAt`.
   - **Transaction**: records banking operations (`id`, `characterId`, `amount`,
     `type`, `timestamp`).
   - **XpLedger**: logs XP gains and losses (`id`, `characterId`, `xpChange`,
     `reason`, `timestamp`).
   - **PkKillLog**: logs PvP kills (`id`, `killerId`, `victimId`, `timestamp`).

2. **Generate and commit migration files**:
   - Use `prisma migrate dev --name init_phase1` to create initial migrations.
   - Review SQL output for correctness (e.g., foreign keys, indexes).

3. **Type-safe client**:
   - Ensure generated Prisma Client is imported and available in
     `packages/server/src/lib/prisma.ts`.

4. **Seed script**:
   - Create `prisma/seed.ts` to populate dev DB with sample Account & Character
     entries for testing.

5. **Implementation Report**:
   - Draft `docs/implementation-reports/IR_P1_S1_3_DB_Schema_Migrations.md`
     summarizing models, migrations, and seed.

## Deliverable Checklist

- [ ] `packages/server/prisma/schema.prisma` with models
- [ ] `prisma/migrations/{timestamp}_init_phase1` folder with SQL
- [ ] `packages/server/src/lib/prisma.ts` exporting PrismaClient
- [ ] `prisma/seed.ts` script and README entry
- [ ] Implementation report in docs repo

Please draft the schema and migrations accordingly, then report back with any
DDERF tickets for inconsistencies or missing constraints.
