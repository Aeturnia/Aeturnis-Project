# FINAL CAFE METHODOLOGY  
*Contract‑First, AI‑Agent Facilitated Engineering*  
**Version 2.1 – “Division Protocol” Refresh**  

---

## 1  Purpose & Scope  
This document is the canonical reference for the **CAFE methodology** as applied to the Aeturnis project.  
It consolidates previous specs, SOPs, and refinements—most notably:  

* **CAFE Definition** (core acronym & principles)  
* **CAFE v2 Division Protocol** (formal backend / frontend split)  
* **Working SOP Guidelines v1** (day‑to‑day rules of engagement)  
* **POAD Method** (prompt‑orchestrated control loop)  
* **DDERF System** (quality‑assurance & error‑resolution loop)  

The goal is to provide a single, authoritative source that guides humans **and** AI agents through every
phase of planning, building, and shipping new features.

---

## 2  Acronym Breakdown  

| Letter | Meaning | Summary |
|--------|---------|---------|
| **C** | **Contract‑First** | Start every feature by writing the explicit interface (OpenAPI spec, TypeScript types, DB schema, or state machine). |
| **A** | **AI‑Agent** | Delegate well‑defined roles to multiple specialized AI agents (Planner, Engineer, QA). |
| **F** | **Facilitated** | Keep a human in the loop to orchestrate prompts, approve contracts, and ensure alignment with business goals. |
| **E** | **Engineering** | Deliver production‑grade code with CI/CD, tests ≥ 80 %, strict typing, and observability from day 1. |

> **One‑Sentence Definition**  
> *CAFE is a contract‑first, AI‑specialized workflow that lets small teams build large systems quickly—without sacrificing quality or traceability.*

---

## 3  Core Principles  

1. **Interface‑First Development** – Always mock the API before writing logic.  
2. **Prompt‑Orchestrated Loops** – Use POAD to cycle tasks through Planner → Engineer → QA.  
3. **Tight Division of Labor** – Claude Code owns backend & architecture; Replit Agent owns UI & styling.  
4. **Continuous QA** – Invoke DDERF on every failure: *Detect → Diagnose → Explain → Resolve → Fix*.  
5. **Immutable Audit Trail** – Log all prompts, reports, and metrics in `prompt_tracker.md`.  
6. **Mobile‑First UX** – Front‑end work defaults to touch‑safe layouts and PWA standards.

---

## 4  Role Matrix (Division Protocol v2.0)

| Task | **Claude Code** (Backend) | **Replit Agent** (Frontend) |
|------|---------------------------|-----------------------------|
| System Architecture            | ✅ | ❌ |
| DB Schema & Migrations         | ✅ | ❌ |
| API Routes & Services          | ✅ | ❌ |
| Complex Business Logic         | ✅ | ❌ |
| React Components & Styling     | ❌ | ✅ |
| Basic CRUD / Mock Data         | ⚠️ assist | ✅ |
| Unit & Integration Tests       | ✅ | ✅ |
| Performance Tuning             | ✅ | ⚠️ assist |
| Accessibility & Responsiveness | ❌ | ✅ |

**Handoff Ritual**  
> Code boundaries are marked with `// TODO: <agent>` comments.  
> Each hand‑off must include working tests or stubs so the next agent can proceed in isolation.

---

## 5  Lifecycle Stages & Artefacts  

| Stage | CAFE Focus | POAD Phase | Primary Artefacts |
|-------|------------|------------|-------------------|
| **Plan → Contract** | *Contract‑First* | *Prompt Creation* | User story, Type/interface spec |
| **Design** | Architecture diagrams | *Prompt Generation* | Sequence diagram, DB ERD |
| **Implement** | Fabrication | *Execution* | Code, migrations, UI comps, tests |
| **Audit** | Evaluation & QA | *QA Review* | Test results, lint report |
| **Patch / Merge** | Fix & Refactor | *Patch / Retry* | Pull‑request, DDERF ticket (if needed) |
| **Record** | Traceability | *Commit & Advance* | Implementation report, prompt log |

---

## 6  DDERF Integration  

When any stage fails a quality gate, trigger the **DDERF** loop:  

1. **Detect** – Automated tests or CI flags a failure.  
2. **Diagnose** – QA agent categorizes the error (TYPE‑A … TYPE‑M).  
3. **Explain** – Root cause and recommended fix documented in the unit ticket.  
4. **Resolve** – Assigned agent implements fix within a scoped *unit*.  
5. **Fix** – Unit passes validation; metrics updated; regression tests added.

DDERF enforces **zero‑regression** and keeps the build green.

---

## 7  Working SOP Highlights  

* Follow strict Git discipline: feature branches ≤ 150 LOC, CI green before PR.  
* TypeScript: `strict`, `noImplicitAny`, `exactOptionalPropertyTypes`.  
* Tests: Vitest or Jest, coverage ≥ 80 %.  
* UI tap‑zones ≥ 44 × 44 px; use semantic HTML for accessibility.  
* Backend endpoint SLA: < 500 ms p95.  
* All artefacts and reports live under `/docs` or `/Implementation Reports`.

---

## 8  Quality Gates & Metrics  

| Category | Threshold |
|----------|-----------|
| TypeScript Errors | **0** |
| ESLint Errors | **0** |
| Test Coverage | **≥ 80 %** |
| API Latency (p95) | **< 500 ms** |
| Mobile Interaction Delay | **< 100 ms** |
| Production Readiness Score | **≥ 9 / 10** |

Each gate is validated automatically in CI; failing any gate triggers a DDERF unit.

---

## 9  Governance & Living Documents  

| File | Responsibility |
|------|----------------|
| `FINAL-CAFE-METHODOLOGY.md` | This master reference |
| `Working_SOP_Guidelinesv1.md` | Day‑to‑day checklists |
| `POAD_Method.md` | Prompt orchestration spec |
| `DDERF-SYSTEM.md` | Error‑resolution framework |
| `CAFE_Methodology_v2_Division_Protocol.md` | Role matrix & handoff rules |
| `prompt_tracker.md` | Immutable prompt ledger |
| Implementation Reports | Historical change log |

All agents must keep these documents current when their stage completes.

---

## 10  Glossary  

* **Agent** – An AI model acting under a defined role.  
* **Contract** – The authoritative interface definition (API, type, or schema).  
* **Prompt** – Instruction set guiding an agent’s next action.  
* **Unit** – The smallest DDERF work package (≤ 20 errors).  
* **Readiness Score** – Composite metric (security, tests, perf, docs).

---

### End of Document  
*Compiled automatically on build; supersedes all previous CAFE specs.*  
