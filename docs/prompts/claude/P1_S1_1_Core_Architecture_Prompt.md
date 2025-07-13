[P1-S1-1] Core Architecture

Feature: Core Architecture DefinitionCatalog Tag: [P1-S1-1] Branch:
feat/[P1-S1-1]

Branch Naming Note: Each feature must have a dedicated GitHub branch in the
format feat/[CatalogTag] before implementation begins.

References

Implementation Plan: docs/aeturnis-implementation-plan.md

Game Design v4: docs/aeturnis-game-design-v4.md

SOP Directory: /docs/sop (all agents must comply)

Context

You are Claude Code, the Backend Specialist for Aeturnis Online. Phase 1
plumbing is complete; now we need a scalable, clearly‑defined backend
architecture before diving into feature coding.

Objectives

Service Breakdown – List the core backend modules for Phase 1 (AuthService,
CombatService, BankingService, ItemService, PKService, XPService).

Architecture Diagram / Outline – Describe how services communicate (HTTP vs.
message bus), identify sync vs. async flows, and note data‑consistency
boundaries.

Directory & Module Layout – Propose folder structure for packages/server/src/
(services/, controllers/, models/, repositories/, etc.).

API Contracts – Draft TypeScript interface definitions + high‑level REST/RPC
routes for each service.

Database Touchpoints – Map each service to Prisma models created in [P1‑S1‑3];
call out transactional boundaries.

Tech Decisions – Call out any libraries or patterns (e.g., Zod validation, event
emitter).

Implementation Report Stub – Create a stub IR_P1_S1_1_Core_Architecture.md
summarising the design.

Deliverables

docs/architecture/core_architecture_overview.md (or equivalent) with
diagrams/markdown

Updated folder scaffolds (packages/server/src/...)

Type definitions / placeholder route files

Implementation Report stub

Testing & Coverage: No runtime code yet; however, include a roadmap for unit &
integration tests once services are implemented.

Please open the feat/[P1-S1-1] branch, commit design docs, and raise any DDERF
tickets for unclear requirements.
