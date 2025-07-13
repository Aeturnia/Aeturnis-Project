# Prompt – [P1-S1-2] Security & Auth

\*Catalog Tag: **security-auth\***  
_Phase 1 • Step 1 • Task 2_  
_Generated 2025-07-13 • For Claude Code (Backend Specialist)_

---

## 📑 Objective

Implement the **core security and authentication layer** for Aeturnis Online so
that every protected API route requires a valid JWT and incoming requests are
validated and rate‑limited. This completes the infrastructure foundation for all
subsequent gameplay services.

> **GitHub branch for this feature:** `feat/P1-S1-2`

---

## 🗂 Scope of Work

1. **Authentication middleware**
   - Stateless JWT bearer tokens (HS256) issued at login & refreshed via
     `/auth/refresh`.
   - Password hashing with argon2id (scrypt alternative acceptable).
2. **Validation middleware**
   - Zod schemas for every request/response pair in this step.
   - Central `zodValidator.middleware.ts` that returns 422 on failure.
3. **Rate limiting**
   - Global limiter (100 req / 15 min / IP) plus stricter `/auth/login` limiter
     (5 req / 15 min).
4. **Security headers**
   - Apply `helmet()` with CSP tuned for the current front‑end origin.
5. **Auth controller & routes**
   - `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`,
     `POST /auth/logout`
   - Wire into `api/v1` router; public `/health` remains open.
6. **Repository updates**
   - Add `AuthRepository` with `createUser`, `verifyPassword`, `issueToken`
     helpers.
7. **Environment & config**
   - `.env.example` additions: `JWT_SECRET`, `JWT_EXPIRES_IN`,
     `RATE_LIMIT_WINDOW_MS`.
8. **Documentation**
   - Update `docs/architecture/security_overview.md`.
   - Include sequence diagrams for login & token refresh.

---

## ✅ Acceptance Criteria

| ID   | Requirement                                                       | Test method            |
| ---- | ----------------------------------------------------------------- | ---------------------- |
| AC‑1 | All new routes require a valid JWT (except register/login/health) | Supertest integration  |
| AC‑2 | Passwords stored with argon2id hash + salt                        | Unit test hash/verify  |
| AC‑3 | Invalid JWT returns 401 with standard error schema                | Integration            |
| AC‑4 | Validation middleware rejects malformed payloads with 422         | Unit & integration     |
| AC‑5 | Rate limiter blocks over‑quota requests with 429                  | Integration            |
| AC‑6 | CI coverage ≥ **60 %** global and **80 %** for changed files      | Vitest + coverage gate |
| AC‑7 | No high‑severity vulnerabilities in `npm audit --production`      | CI job                 |
| AC‑8 | Implementation Report `IR_P1_S1_2_Security_Auth.md` committed     | Manual review          |

---

## 🔬 Testing & QA

- Use **TestTransactionWrapper** for DB isolation.
- Add factories for `Account` creation used in auth specs.
- Provide at least **12 integration tests** (login success/fail, token refresh,
  rate‑limit, etc.).
- Update GitHub Actions to run security tests and enforce the new coverage
  thresholds.

---

## 🛠 Deliverables

1. Source code across `controllers/`, `middleware/`, `repositories/`,
   `services/`.
2. New/updated Zod schemas in `packages/shared`.
3. Updated CI workflow (`ci.yml`) with coverage gate at 60 %.
4. Updated docs (`security_overview.md`, sequence diagrams).
5. **Implementation Report** summarising task details, decisions, and next
   steps.

---

## 🧩 Constraints & Guidelines

- Follow the **CAFE v2.0 Division Protocol** – Claude handles backend; Replit
  Agent will integrate UI stubs later.
- Adhere to existing lint rules and naming conventions.
- Use dependency injection container (`src/container`) for middleware &
  controllers.
- Do **NOT** expose secrets or private keys in the repo.
- Maintain commit hygiene: atomic commits with Conventional Commits
  (`feat(auth): …`).

---

## 🚀 What’s Next

Upon successful merge and audit, move to **[P1‑S1‑3] Database
Schema & Migrations (expansion)** for new gameplay tables (BankAccount,
Character, etc.).

---

_End of Prompt_
