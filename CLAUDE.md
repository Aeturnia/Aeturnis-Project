# Project Repository Management

## Repository Structure

This project uses two separate repositories:

1. **Documentation Repository**:
   https://github.com/Aeturnia/aeturnis-master-docs
   - Contains only the `/docs` folder
   - Used for all documentation, guides, SOPs, and reports
   - Previous repo: https://github.com/Aeturnia/aeturnis-alpha-sop (deprecated)
   - Current branch: new-docs (pending merge)

2. **Game Code Repository**: https://github.com/Aeturnia/Aeturnis-Project
   - Contains the actual game implementation code ONLY
   - No documentation files
   - Separate from documentation for cleaner organization
   - Will use monorepo structure with Yarn workspaces

## Current Project Status (July 13, 2025)

### Repository States

- **Documentation Repo**: `new-docs` branch has all docs, pending merge to main
- **Game Code Repo**: `main` branch has monorepo structure, ready for
  development
- **Sparse Checkout**: Currently disabled after code commit

### Architecture Decisions

- **Versions**: Server v1.0.0, Client v1.0.0
- **Monorepo**: pnpm workspaces with packages/server, packages/client,
  packages/shared
- **CI**: GitHub Actions (pnpm lint, test, build)
- **Database**: Prisma for DB layer & migrations
- **Testing**: Vitest for unit tests
- **Code Quality**: ESLint + Prettier (repo-local preset)
- **Package Manager**: pnpm (NEVER npm)

### Documentation Structure

```
docs/
├── api/                    # API documentation
├── audit-reports/          # Code audit reports
├── bugfix-reports/         # Bug fix documentation
├── guides/                 # Templates and guides
├── implementation-reports/ # Feature implementation reports
├── legal/                  # Charter and legal docs
├── methodology/            # CAFE, DDERF, POAD methods
│   └── DDERF-Issues.md    # Issue tracking (v0.1.0)
├── misc/                   # Game design documents
├── phase-completions/      # Phase completion reports
├── phases/                 # Implementation plans
├── prompts/                # AI agent prompts
│   └── aeturnis-prompt-tracker.md  # Tracks all prompts (TABLE FORMAT)
├── qa-reports/             # QA testing reports
└── sop/                    # Standard operating procedures
```

### Key Files

- **Implementation Plan**: docs/phases/aeturnis-implementation-plan.md (v5.0)
- **Game Design**: docs/misc/aeturnis-game-design-v4.md (aligned version)
- **Prompt Tracker**: docs/prompts/aeturnis-prompt-tracker.md (REORGANIZED TO
  TABLES)
- **DDERF Issues**: docs/methodology/DDERF-Issues.md (v0.1.0)

### Agent Roles (CAFE v2.0 Division Protocol)

- **Claude Code**: Backend Specialist (DB, APIs, services, security)
- **Replit Agent**: Frontend Specialist (UI/UX, React, client state)
- **ChatGPT**: Dev Support (architecture, code review, documentation)

### Development Workflow

1. Use catalog tags: [P{phase}-S{step}-{substep}]
2. TODO comments: // TODO(claude), // TODO(replit), // TODO(chatgpt)
3. All features need Implementation Reports
4. Track issues in DDERF-Issues.md
5. Update prompt tracker for each feature
6. **MANDATORY TESTING**: Vitest with 90%+ coverage after every implementation

### Critical Game Mechanics

- **Death Penalty**: Lose ALL unbanked gold + 20% XP
- **Banking**: Essential from day 1 (stub for testing)
- **PK System**: 10-min cooldown, 6 kills/hour max
- **Chat**: 4 mandatory channels with trade enforcement
- **Alignment**: -1000 to +1000 (visual colors)

### Implementation Progress

#### ✅ Completed (2025-07-13)

1. **Monorepo Bootstrap** ([P1-S1-5])
   - pnpm workspace configuration implemented
   - TypeScript, ESLint, Prettier configured
   - Packages created: server, client, shared
   - Git commits: `fee192a` (code), `97732e5` (docs)
   - Both repositories updated successfully

2. **GitHub Actions CI** ([P1-S1-2])
   - Complete CI pipeline with PostgreSQL service
   - pnpm build, lint, test, coverage reporting
   - Codecov integration
   - **Status**: ✅ Audited & Resolved
   - Git commit: Multiple commits, final audit resolution

3. **Initial DB Schema & Migrations** ([P1-S1-3])
   - 6 complete Prisma models (Account, Character, BankAccount, Transaction,
     XpLedger, PkKillLog)
   - Migration committed: `20250713024743_init`
   - Production Neon database configured
   - **Status**: ✅ Audited & Resolved
   - Git commits: `a10a8c7`, `f0feebf`, `8c132bf`

4. **Test Coverage Enhancement** ([Coverage])
   - 48 comprehensive CRUD tests for all 6 models
   - 91.66% line coverage (exceeds 90% threshold)
   - Test isolation with unique data generation
   - **Status**: ✅ Audited & Resolved
   - Git commits: `c1e5452`, `a10a8c7`

5. **Prompt Tracker Reorganization** (2025-07-13)
   - Converted from list to comprehensive table structure
   - Quality metrics tracking (CI, Audit, Coverage)
   - Status: 4/32 systems implemented (12.5%)
   - Git commit: `12e8eb4`

#### 📋 Next Steps (Priority Order)

1. **[P1-S7-1] Banking Service** - CRITICAL for death penalties
2. **[P1-S2-1] Account Management** - Authentication foundation
3. **[P1-S7-2] Death & Respawn System** - Core game mechanic
4. **[P1-S9-1] Complete Chat System** - 4 mandatory channels

### Database Configuration

- **Provider**: Neon PostgreSQL (serverless)
- **Migration Hash**: `20250713024743_init`
- **Connection**: Production database with SSL
- **Status**: ✅ Fully configured and tested

### Test Coverage Status

- **Server**: 91.66% lines, 48 CRUD tests, serial execution
- **Client**: 100% coverage
- **Shared**: 100% coverage
- **Policy**: 90% minimum coverage MANDATORY for all implementations

### Quality Assurance

- **CI Status**: 100% pass rate (4/4 implemented systems)
- **Audit Status**: 75% audited & resolved (3/4 systems)
- **Build Status**: All packages build successfully
- **Lint Status**: Zero errors across all packages

### Prisma Directory Structure

```
packages/server/
├── src/
│   ├── db/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── services/
│   └── utils/
│       └── logging/
```

## Workflow for Pushing Only Docs Folder

**IMPORTANT: Always use sparse checkout for the documentation repository to
avoid pushing the entire codebase!**

When pushing documentation updates to the docs repository:

1. **Add remote if not exists**:

   ```bash
   git remote add master-docs https://github.com/Aeturnia/aeturnis-master-docs.git
   ```

2. **Enable sparse checkout**:

   ```bash
   git config core.sparseCheckout true
   echo "docs/*" > .git/info/sparse-checkout
   ```

3. **Stage and commit docs**:

   ```bash
   git add docs/
   git commit -m "Update documentation"
   ```

4. **Push to branch**:
   ```bash
   git push master-docs new-docs
   ```

**Alternative method (recommended for docs-only pushes):**

```bash
# Create temporary branch with only docs
git checkout -b docs-only-temp
git rm -r --cached .
git add docs/
git commit -m "Documentation update"
git push master-docs docs-only-temp:new-docs --force
git checkout main
git branch -D docs-only-temp
```

This ensures only the `/docs` folder is tracked and pushed to the documentation
repository, keeping code and documentation separate.

## Recent Accomplishments Summary (2025-07-13)

### Database & Testing Foundation Complete

- ✅ Production-ready Prisma schema with 6 models
- ✅ Committed migration for CI/CD deployment
- ✅ 48 comprehensive CRUD tests (91.66% coverage)
- ✅ Database connected to Neon production instance
- ✅ All audit recommendations resolved

### Infrastructure Fully Operational

- ✅ pnpm monorepo with CI/CD pipeline
- ✅ GitHub Actions with PostgreSQL services
- ✅ Comprehensive test coverage enforcement
- ✅ Production database setup and seeding documentation

### Project Management Enhanced

- ✅ Prompt tracker reorganized into table format
- ✅ Quality metrics tracking implemented
- ✅ Implementation reports updated with latest status
- ✅ Audit findings addressed and documented

### Ready for Next Phase

- Banking service implementation (critical path)
- Account management system
- Death penalty mechanics
- Chat system foundation

The project now has a solid foundation with production-ready database,
comprehensive testing, and full CI/CD automation.
