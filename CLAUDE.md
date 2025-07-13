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

### Architecture Decisions

- **Versions**: Server v1.0.0, Client v1.0.0
- **Monorepo**: pnpm workspaces with packages/server, packages/client,
  packages/shared
- **CI**: GitHub Actions with Codecov integration (pnpm lint, test, build)
- **Database**: Prisma for DB layer & migrations (PostgreSQL)
- **Testing**: Vitest for unit tests (90%+ coverage mandatory)
- **Code Quality**: ESLint + Prettier (repo-local preset)
- **Package Manager**: pnpm (migrated from Yarn 4)

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
│   └── aeturnis-prompt-tracker.md  # Tracks all prompts
├── qa-reports/             # QA testing reports
└── sop/                    # Standard operating procedures
```

### Key Files

- **Implementation Plan**: docs/phases/aeturnis-implementation-plan.md (v5.0)
- **Game Design**: docs/misc/aeturnis-game-design-v4.md (aligned version)
- **Prompt Tracker**: docs/prompts/aeturnis-prompt-tracker.md
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
   - Git commits: `fee192a` (initial), `1b3d3a9` (coverage), `626b29c` (fixes)
   - CI/CD pipeline fully functional

2. **GitHub Actions CI** ([P1-S1-2])
   - Complete pipeline with PostgreSQL service
   - Codecov integration added
   - All checks passing

3. **Initial DB Schema** ([P1-S1-3])
   - Prisma schema with 6 models implemented
   - Seed script created
   - 91.66% test coverage achieved

4. **Test Coverage Enhancement**
   - Vitest configured with 90%+ thresholds
   - All packages meet coverage requirements
   - Mandatory testing policy established

#### 📋 Next Steps

5. Banking service implementation
6. PK cooldown helper (Redis + Postgres)
7. Authentication service
8. Character creation endpoints

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
repository, keeping code and documentation separate. NEVER push the entire
repository to the documentation repo!
