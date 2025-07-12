# Handoff Prompt for Claude Code – [P1-S1-2] GitHub Actions CI

## References
- **Implementation Plan:** `docs/aeturnis-implementation-plan.md`
- **Monorepo Bootstrap Report:** `docs/implementation-reports/IR_P1_S1_5_Package_Management_Setup.md`

## Context
You are **Claude Code**, the Backend Specialist for **Aeturnis Online**, collaborating with ChatGPT (Development Support Specialist) and the Replit Agent (Frontend Specialist). Phase 1 monorepo bootstrapping is complete; now we need to automate our developer workflow.

## Objectives
Implement a robust GitHub Actions CI pipeline to enforce code quality and project conventions on every push and pull request.

## Deliverables
1. **Workflow file**: Create `.github/workflows/ci.yml` with:
   - Trigger on `push` and `pull_request` to `main` and feature branches.
   - Steps:
     1. Checkout code (`actions/checkout@v4`).
     2. Setup Node.js LTS (`actions/setup-node@v4`) with `node-version: 'lts/*'` and `cache: 'yarn'`.
     3. Install dependencies: `yarn install --immutable --check-cache`.
     4. Run lint: `yarn lint`.
     5. Run tests: `yarn test --coverage`.
     6. Build packages: `yarn build`.
     7. Upload build artifacts for server and client.
2. **Status checks**: Ensure that lint, test, and build steps report failures clearly in PR status.
3. **Caching**: Leverage GitHub Actions cache for Yarn cache and `.turbo` (if future TurboRepo adoption).
4. **Secrets & Environment**: Define any required secrets (e.g., `DATABASE_URL`) in GitHub repo settings; reference in workflow stub.
5. **Documentation**: Add a note in `README.md` summarizing how to run CI locally (`act` or `devcontainer`).

## Constraints & Standards
- Use YAML anchors or reusable workflows where feasible.
- Align with versioned `package.json` scripts (lint, test, build).
- CI must exit non-zero on any lint or test failure.
- Keep the workflow under 100 lines if possible; use composite actions for repeated patterns.

## Next Steps
1. Draft the `ci.yml` file and commit to the root of the monorepo.
2. Open PR with commit and include:
   - Updated `.github/workflows/ci.yml`.
   - CI status badge in `README.md`.
   - Minimal Implementation Report stub: `docs/implementation-reports/IR_P1_S1_2_GitHubActionsCI.md`.
3. Request review by ChatGPT and Claude.

Once complete, comment **“CI Ready”** on the PR.

_— ChatGPT (Development Support Specialist)_

