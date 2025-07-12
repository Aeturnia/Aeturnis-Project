# 🧠 Aeturnis Online – AI Team Charter v2.1  
*Aligned with CAFE 2.1 “Division Protocol”, POAD loop, and DDERF system*  

---

## 🎯 Purpose  
This charter defines how human leaders and specialized AI agents collaborate to build **Aeturnis Online**.  
It replaces earlier versions fileciteturn2file0 and incorporates the latest methodological stack:  

* **CAFE 2.1** – Contract‑First, AI‑Facilitated Engineering (see `FINAL‑CAFE‑METHODOLOGY.md`)  
* **Division Protocol** – Formal backend / frontend split fileciteturn2file4  
* **POAD** – Prompt‑Orchestrated AI Development control loop fileciteturn2file2  
* **DDERF** – Domain‑Driven Error Resolution Framework for QA fileciteturn2file3  
* **Working SOP Guidelines v1** – Day‑to‑day rules of engagement fileciteturn2file1  

The charter ensures every task flows through a **contract‑first pipeline**, is executed by the right AI agent, and passes through rigorous QA before merge.

---

## 👤 Human Role – Creative Director / Orchestrator  
* Sets product vision, priorities, and acceptance criteria  
* Kicks off each CAFE cycle by drafting or approving the **Contract** artifact  
* Routes prompts through the POAD loop and signs off DDERF units  
* Maintains this charter and core reference docs  

---

## 🤖 AI Roles & Responsibilities (Division Protocol)  

| AI Agent | Primary Domain | Key Responsibilities |
|----------|----------------|----------------------|
| **Claude Code – “Planner & Backend Engineer”** | System architecture, schemas, APIs | *Draft* contracts (OpenAPI, types) → *Implement* backend logic, DB migrations, business rules |
| **Replit Agent – “UI Engineer”** | React components, styling, local tests | Scaffold UI shells from contracts → Implement touch‑safe, responsive components → Run Jest/Vitest, Lighthouse |
| **ChatGPT – “Architect & QA Lead”** | Integration, QA, documentation | Validate contracts for clarity → Review code for security & style → Run DDERF loop → Patch or refactor as required |

> **Specialization means no duplicated effort.** Each agent touches code **only in its lane** unless explicitly assisting.

---

## 🔄 CAFE‑Aligned Collaboration Flow  

1. **Concept & Contract** *(Human + Claude)*  
   * User story → Claude drafts interface / schema → Human approves  
2. **Architecture** *(Claude + ChatGPT)*  
   * Claude outlines service design → ChatGPT sanity‑checks scalability & security  
3. **Fabrication**  
   * **Backend:** Claude codes services, tests, migrations  
   * **Frontend:** Replit builds UI & hooks using mock endpoints until backend ready  
4. **Evaluation** *(ChatGPT)*  
   * Runs unit/integration tests, performance checks, accessibility scan  
   * If failures → DDERF ticket → assigned to responsible agent  
5. **Merge & Record** *(Human)*  
   * On success, PR merged; implementation report and prompt log updated  

All prompt exchanges are recorded in **`prompt_tracker.md`** for auditability.

---

## 🧩 Handoff Standards  

```ts
// TODO(claude): implement EquipmentService.getBonusStats()
// TODO(replit): connect EquipmentPanel to EquipmentService
```

* Handoff comments include agent tag and expected interface.  
* Every handoff must ship with **passing stub tests** so the next agent can proceed offline.

---

## 📐 Quality, Security & Performance Gates  

| Gate | Threshold | Enforced By |
|------|-----------|-------------|
| TypeScript errors | **0** | CI / ChatGPT |
| ESLint errors | **0** | Replit Agent |
| Test coverage | **≥ 80 %** | All agents |
| API p95 latency | **< 500 ms** | Claude Code |
| UI tap zone | **≥ 44 × 44 px** | Replit Agent |
| Production Readiness Score | **≥ 9 / 10** | ChatGPT |

Failing any gate triggers a **DDERF loop**; work cannot merge until the unit passes.

---

## 📚 Living Reference Documents  

| File | Owner | Description |
|------|-------|-------------|
| `FINAL‑CAFE‑METHODOLOGY.md` | Human | Canonical CAFE spec |
| `CAFE_Methodology_v2_Division_Protocol.md` | Human | Role matrix & handoff rules |
| `Working_SOP_Guidelinesv1.md` | ChatGPT | Daily checklists |
| `POAD_Method.md` | Claude | Prompt orchestration loop |
| `DDERF-SYSTEM.md` | ChatGPT | Error‑resolution SOP |
| `prompt_tracker.md` | All | Immutable prompt ledger |
| Implementation Reports | Replit / Claude | Per‑step changelogs |

Agents must update these docs when their tasks modify rules, interfaces, or insights.

---

## 🔐 Security Duties  

* **Claude Code** – Parameterized queries, auth guards, secrets isolation  
* **Replit Agent** – XSS‑safe rendering, a11y compliance, input sanitization  
* **ChatGPT** – Pen‑test mindset in reviews; ensures no sensitive data leaks  

---

## 🚀 Success Criteria  

* Feature passes all gates and delivers player value  
* Code integrates without breaking established contracts  
* Documentation & prompt logs are current  
* Human orchestrator approves readiness

---

## 🗓️ Charter Revision Policy  

* Minor clarifications: any agent may submit PRs for review  
* Methodology or role changes: require human approval + version bump  
* Supersedes previous charter versions; maintains backward compatibility for ongoing tasks  

---

*Last updated: 12 Jul 2025*  
