# Extension Prompt – Increase Vitest Coverage

## Context

We’ve implemented initial DB schema and Vitest tests, but Codecov reports only
\~14% coverage. To meet our coverage thresholds, we need to augment existing
tests.

## Objectives

1. **Identify untested modules**: Scan `packages/server/src/` to list all `.ts`
   files lacking corresponding tests under `__tests__/`.
2. **Write additional Vitest specs**:
   - For each service/controller/model:
     - Test key methods, including success and failure scenarios.
     - Mock Prisma client to isolate DB operations.
   - Cover edge cases (e.g., invalid inputs, missing records).
3. **Ensure coverage thresholds**:
   - Final coverage >= 80% lines, >= 85% functions.
4. **Update CI config**:
   - Confirm `--coverage` flag in `vitest.config.ts` and `ci.yml`.
5. **Report coverage improvements**: Include summary of coverage percentage
   increase in the Implementation Report.

## Deliverables

- New Vitest spec files in `packages/server/src/__tests__/`.
- Updated `vitest.config.ts` with coverage thresholds:
  ```js
  export default defineConfig({
    test: {
      coverage: {
        provider: 'c8',
        reporter: ['text', 'lcov'],
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90,
      },
    },
  });
  ```
- Updated CI workflow snippet in `.github/workflows/ci.yml` to upload coverage
  to Codecov.
- Implementation Report update:
  `docs/implementation-reports/IR_P1_S1_3_DB_Schema_Migrations.md` with coverage
  stats.

> **Reminder:** Adhere to SOPs in `/docs/sop` for test file naming, fixture
> setup, and DDERF logging.
