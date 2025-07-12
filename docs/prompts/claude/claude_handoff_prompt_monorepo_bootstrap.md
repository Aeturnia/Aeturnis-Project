# Handoff Prompt for Claude Code – Monorepo Bootstrap Complete (July 12 2025)

## Context & Current Status
You’re joining the **Aeturnis Online** MMORPG project alongside ChatGPT (Development Support Specialist) and the Replit Agent (frontend).  
ChatGPT has just **finished implementing Priority #1 – Monorepo Bootstrap**. No other code has been added yet.

The following artefacts have been committed to the repository (PR pending review):

1. **Root files**
   - `package.json` (Yarn 4 workspaces, repo‑wide scripts)
   - `tsconfig.base.json`
   - `eslint.config.js`
   - `.prettierrc.json`
   - `.gitignore`
2. **Workspace skeleton**
   ```
   packages/
     ├─ server/
     ├─ client/
     └─ shared/
   ```
   Each workspace contains its own `package.json` and `tsconfig.json`.
3. **Implementation Report**  
   `docs/implementation-reports/IR_P1_S1_5_Package_Management_Setup.md`
4. **Prompt‑tracker update**  
   Added entry under **[P1‑S1‑5] Package Management Setup** noting implementation status.
5. **DDERF Issues Catalog**  
   `docs/DDERF-Issues.md` (draft v0.1.0; no tickets yet)

## Key Confirmations (unchanged)
| Area | Decision |
|------|----------|
| Versions | Server v1.0.0, Client v1.0.0 |
| Monorepo | Yarn workspaces (`server`, `client`, `shared`) |
| CI | GitHub Actions (next deliverable) |
| Tech choices | Prisma, Vitest, ESLint + Prettier |
| Docs & Reports | Implementation Reports under `/docs/implementation-reports`, prompt tracker in `/docs/prompts` |
| TODO pattern | `// TODO(claude)` / `// TODO(replit)` |
| DDERF logging | Centralised `DDERF-Issues.md` |
| Gameplay rules (Phase 1) | Banking stub for tests; PK cooldown persisted in Postgres |

## What I need from you
1. **Review** the bootstrap PR:
   - Root **package.json** scripts & dependencies
   - **TS config** inheritance chain
   - **ESLint/Prettier** baseline rules
   - Workspace scaffold (`packages/server`, etc.)
2. **Confirm** that the structure aligns with your backend roadmap.
3. **Suggest**:
   - Any additional dev‑tooling you want baked in now (e.g., ts‑node for scripts, database client libs).
   - Preferred naming conventions or folder layouts inside `packages/server`.
4. **Flag** any issues to log in `DDERF-Issues.md`.

Once you’re happy, comment **“Approved”** on the PR so we can proceed to **Priority #2 – GitHub Actions CI**.

---

### Reference Links
- Implementation Report: `/docs/implementation-reports/IR_P1_S1_5_Package_Management_Setup.md`
- Prompt tracker entry: `/docs/prompts/prompt_tracker.md`
- DDERF Catalog: `/docs/DDERF-Issues.md`

_Thanks!_  
_— ChatGPT (Development Support Specialist)_