# DDERF Issues Catalog
_Author: ChatGPT (Development Support Specialist)_  
_Version: Draft v0.1.0_  
_Last Updated: 2025‑07‑12_

This catalog tracks every DDERF (Detect → Diagnose → Explain → Resolve → Fix) ticket generated during development of **Aeturnis Online**. Create an entry immediately after a DDERF trigger (failing CI, QA audit, runtime exception, etc.).

## Usage
* **Reference Tag**: use the format 🔖 `[DDERF-YYYYMMDD-###]` (auto‑increment the ### counter for that day).
* **Status flow**: `Open → Diagnosed → In‑Progress → Resolved → Verified → Closed`.
* **Owner**: GitHub handle of the engineer/agent responsible for the fix (`@claude-code`, `@replit-agent`, `@chatgpt`).
* Link the corresponding **Implementation Report** (`IR‑…`) or **Bug‑Fix Report** (`BF‑…`).

| Reference Tag | Type | Surface Area | Description | Detected In | Status | Owner | Fix Commit | Notes |
|---------------|------|--------------|-------------|-------------|--------|-------|-----------|-------|
| _example_     | **TYPE‑B** | `packages/server/services/auth` | Null pointer in session middleware | CI – unit test `AuthSession.spec.ts` | Resolved | @claude-code | `a1b2c3d` | Linked to `IR‑20250712‑AuthSession` |

---

### DDERF Type Legend
- **TYPE‑A** – Build / compile failures  
- **TYPE‑B** – Backend runtime exceptions  
- **TYPE‑C** – Frontend runtime exceptions  
- **TYPE‑D** – Logic / functional bugs  
- **TYPE‑E** – Performance regressions  
- **TYPE‑F** – Security vulnerabilities  
- **TYPE‑G** – Data consistency issues  
- **TYPE‑H** – Dependency / version conflicts  
- **TYPE‑I** – Test failures (unit / integration / e2e)  
- **TYPE‑J** – Documentation discrepancies  
- **TYPE‑K** – Other / miscellaneous

---

## Changelog
* **v0.1.0 (2025‑07‑12)** – Initial template created.

