# Project Repository Management

## Repository Structure
This project uses two separate repositories:
1. **Documentation Repository**: https://github.com/Aeturnia/aeturnis-master-docs
   - Contains only the `/docs` folder
   - Used for all documentation, guides, SOPs, and reports
   - Previous repo: https://github.com/Aeturnia/aeturnis-alpha-sop (deprecated)
   - Current branch: new-docs (pending merge)

2. **Game Code Repository**: https://github.com/Aeturnia/Aeturnis-Project
   - Contains the actual game implementation code ONLY
   - No documentation files
   - Separate from documentation for cleaner organization
   - Will use monorepo structure with Yarn workspaces

## Current Project Status (July 12, 2025)

### Architecture Decisions
- **Versions**: Server v1.0.0, Client v1.0.0
- **Monorepo**: Yarn workspaces with packages/server, packages/client, packages/shared
- **CI**: GitHub Actions (yarn lint, test, build)
- **Database**: Prisma for DB layer & migrations
- **Testing**: Vitest for unit tests
- **Code Quality**: ESLint + Prettier (repo-local preset)
- **Package Manager**: Yarn (NEVER npm)

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

### Next Steps (Approved)
1. Monorepo bootstrap with Yarn workspaces
2. GitHub Actions CI setup
3. Initial DB schema (Prisma)
4. Banking service stub
5. PK cooldown helper (Redis + Postgres)
6. Pre-commit doc hooks

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

This ensures only the `/docs` folder is tracked and pushed to the documentation repository, keeping code and documentation separate.