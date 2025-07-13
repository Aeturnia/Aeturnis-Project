# Aeturnis Online Development Roadmap

**Current Version**: v1.1.0-dev "Jörmun"  
**Last Updated**: 2025-07-13  
**Implementation Speed**: ~3 systems/day (based on current progress: 6 systems
in 2 days)

## Development Phase Overview

### Phase Timeline Summary

- **Phase 1 (MVP)**: July 2025 - August 2025 (1.5 months)
- **Phase 2 (Alpha)**: September 2025 - October 2025 (2 months)
- **Phase 3 (Beta)**: November 2025 - January 2026 (3 months)
- **Phase 4 (Release)**: February 2026

---

## Phase 1: MVP - Core Game Loop

**Target**: 32 systems | **Status**: 6/32 complete (18.8%)  
**Estimated Completion**: August 2025

### ✅ Completed Systems (July 8-13, 2025)

| Catalog Tag | System Name                    | Version    | Features                                                               |
| ----------- | ------------------------------ | ---------- | ---------------------------------------------------------------------- |
| [P1-S1-C]   | Package Management Setup       | v1.0.0     | pnpm monorepo, workspace configuration                                 |
| [P1-S1-A]   | GitHub Actions CI              | v1.0.0     | CI/CD pipeline, PostgreSQL services, coverage reporting                |
| [P1-S1-B]   | Initial DB Schema & Migrations | v1.0.0     | 6 Prisma models, migration system, Neon database                       |
| [Coverage]  | Test Coverage Enhancement      | v1.0.0     | 91.66% coverage, 48 CRUD tests, test isolation                         |
| [P1-S1-1]   | Core Architecture              | v1.0.0     | DI container, services, repositories, event bus                        |
| [P1-S1-2]   | Security & Auth                | v1.1.0-dev | JWT auth, argon2 passwords, rate limiting, Helmet security, 180+ tests |

### 🔄 Current Sprint (July 15-21, 2025)

| Catalog Tag | System Name        | Priority    | Justification                           |
| ----------- | ------------------ | ----------- | --------------------------------------- |
| [P1-S7-1]   | Banking Service    | 🔴 Critical | Required for death penalty system       |
| [P1-S7-2]   | Death & Respawn    | 🔴 Critical | Core game mechanic (lose unbanked gold) |
| [P1-S2-1]   | Account Management | 🟡 High     | Player profiles, character slots        |

### 📅 Development Schedule

#### July 2025 (Foundation & Core Systems)

| Week                | Systems to Implement                    | Count | Key Features                                        |
| ------------------- | --------------------------------------- | ----- | --------------------------------------------------- |
| Week 3 (July 15-21) | Banking, Death, Account Management      | 3     | Gold storage, death penalties, character management |
| Week 4 (July 22-28) | Monitoring, Logging, Character Creation | 3     | Performance tracking, character customization       |

#### August 2025 (Combat, Economy & Social)

| Week                   | Systems to Implement         | Count | Key Features                     |
| ---------------------- | ---------------------------- | ----- | -------------------------------- |
| Week 1 (July 29-Aug 4) | Stats, Combat Engine, Skills | 3     | Battle system, class abilities   |
| Week 2 (Aug 5-11)      | Items, Equipment, Inventory  | 3     | Item management, equipment slots |
| Week 3 (Aug 12-18)     | NPCs, AI, Loot, Shop         | 4     | Vendors, combat AI, drop tables  |
| Week 4 (Aug 19-25)     | Zones, Travel, Chat, Friends | 4     | World navigation, communication  |

#### Final Sprint

| Week               | Systems to Implement             | Count | Key Features                    |
| ------------------ | -------------------------------- | ----- | ------------------------------- |
| Week 5 (Aug 26-30) | Tutorial, Settings, Leaderboards | 3     | New player experience, rankings |

### 📊 Complete Phase 1 System List (32 Total)

#### Infrastructure (6 systems - ✅ ALL COMPLETE)

1. [P1-S1-C] Package Management Setup ✅
2. [P1-S1-A] GitHub Actions CI ✅
3. [P1-S1-B] Initial DB Schema & Migrations ✅
4. [Coverage] Test Coverage Enhancement ✅
5. [P1-S1-1] Core Architecture ✅
6. [P1-S1-2] Security & Auth ✅

#### Core Systems (26 remaining)

7. [P1-S1-3] Monitoring & Logging
8. [P1-S1-4] Cache & Performance
9. [P1-S2-1] Account Management
10. [P1-S2-2] Character Creation & Customization
11. [P1-S2-3] Stats & Progression
12. [P1-S3-1] Item System
13. [P1-S3-2] Equipment Service
14. [P1-S3-3] Inventory Management
15. [P1-S4-1] Core Combat Engine
16. [P1-S4-2] Skill System
17. [P1-S4-3] Buffs & Debuffs
18. [P1-S5-1] NPC System
19. [P1-S5-2] Basic AI Service
20. [P1-S6-1] Loot System
21. [P1-S6-2] Shop System
22. [P1-S6-3] Consumables
23. [P1-S7-1] Banking Service (CRITICAL)
24. [P1-S7-2] Death & Respawn System
25. [P1-S8-1] Zone Service
26. [P1-S8-2] Travel System
27. [P1-S9-1] Complete Chat System
28. [P1-S9-2] Emote System
29. [P1-S10-1] Friend System
30. [P1-S10-2] Player Search & Inspection
31. [P1-S11-1] Tutorial System
32. [P1-S12-1] Settings Management
33. [P1-S15-1] Leaderboard Service

### Version Milestones

| Version | Codename   | Systems Included                                    | Target Date   |
| ------- | ---------- | --------------------------------------------------- | ------------- |
| v1.0.0  | "Jörmun"   | Foundation & Infrastructure (6 systems)             | ✅ Released   |
| v1.1.0  | "Fenrir"   | Banking, Death, Account (3 systems)                 | July 21, 2025 |
| v1.2.0  | "Týr"      | Monitoring, Logging, Character Creation (3 systems) | July 28, 2025 |
| v1.3.0  | "Odin"     | Stats, Combat, Skills (3 systems)                   | Aug 4, 2025   |
| v1.4.0  | "Thor"     | Items, Equipment, Inventory (3 systems)             | Aug 11, 2025  |
| v1.5.0  | "Loki"     | NPCs, AI, Loot, Shop (4 systems)                    | Aug 18, 2025  |
| v1.6.0  | "Freya"    | Zones, Travel, Chat, Friends (4 systems)            | Aug 25, 2025  |
| v1.7.0  | "Heimdall" | Tutorial, Settings, Leaderboards (3 systems)        | Aug 30, 2025  |
| v2.0.0  | "Ragnarök" | MVP Complete (All 32 systems)                       | Aug 30, 2025  |

---

## Phase 2: Alpha - Advanced Systems

**Target**: 18 systems | **Timeline**: September - October 2025  
**Focus**: Group content, PvP, economy

### September 2025 Schedule

| Week   | Catalog Tags         | Systems                       | Key Features                      |
| ------ | -------------------- | ----------------------------- | --------------------------------- |
| Week 1 | [P2-S1-1], [P2-S2-1] | Party System, Quest System    | Group mechanics, quest chains     |
| Week 2 | [P2-S3-1], [P2-S3-2] | PvP Service, Alignment System | PK mechanics, good/evil alignment |
| Week 3 | [P2-S4-1], [P2-S4-2] | Trading, Auction House        | Player economy                    |
| Week 4 | [P2-S5-1], [P2-S6-1] | Mail System, Reincarnation    | Communication, character rebirth  |

### October 2025 Schedule

| Week   | Systems                          | Key Features                |
| ------ | -------------------------------- | --------------------------- |
| Week 1 | Daily Activities, Advanced Zones | Login rewards, world events |
| Week 2 | Dungeon System, World Bosses     | Group content               |
| Week 3 | Guild System (placeholder)       | Basic guild features        |
| Week 4 | Alpha Polish & Testing           | Stress tests                |

**Alpha Milestones**:

- Closed Alpha Start: September 1, 2025
- Stress Test Weekend: September 25-27, 2025
- Open Alpha: October 15, 2025

---

## Phase 3: Beta - Advanced Features

**Target**: 25+ systems | **Timeline**: November 2025 - January 2026  
**Focus**: Endgame content, crafting, advanced systems

### November 2025 (Endgame Systems)

- Achievement System
- Gem System & Enchanting
- Crafting Professions
- Instance/Dungeon System

### December 2025 (Social & Economy)

- Clan System (full implementation)
- Kingdom System
- Advanced Trading
- Housing System

### January 2026 (Polish & Launch Prep)

- AI Integration (Ollama)
- Marriage System
- Pet System
- Final optimization

**Beta Milestones**:

- Closed Beta: November 1, 2025
- Open Beta: December 15, 2025
- Release Candidate: January 20, 2026

---

## Phase 4: Release

**Target Date**: February 1, 2026  
**Launch Features**:

- 100+ hours of content
- 6 races (+ 4 special reincarnation races)
- 8 classes with full skill trees
- 20+ zones with level progression
- Complete PvP and PvE systems
- Full social features and economy

---

## Critical Path Dependencies

1. **Banking MUST come before Death System** (death penalty requires banking)
2. **Account Management before Character Creation** (characters need accounts)
3. **Combat Engine before NPCs/AI** (AI needs combat system)
4. **Items before Equipment/Inventory** (foundation for item management)
5. **Zones before Travel System** (need places to travel between)

## Risk Factors & Velocity

### Current Velocity

- **Achieved**: 6 systems in 2 days = 3 systems/day
- **Required**: 26 systems in 48 days = 0.54 systems/day
- **Buffer**: 5.5x faster than required

### Adjusted Timeline (Conservative)

If velocity drops to 1 system/day:

- MVP Complete: August 5, 2025 (3 weeks early)
- Alpha Complete: September 20, 2025 (1 week early)
- Beta Complete: December 25, 2025 (4 weeks early)

### Risk Mitigation

- Front-load critical systems (Banking, Death, Combat)
- Implement MVP systems before nice-to-haves
- Keep 20% time buffer for testing/polish
- Prioritize systems that block others

---

## Success Metrics

### Phase 1 (MVP)

- ✅ All 32 core systems operational
- ✅ 90%+ test coverage maintained
- ✅ <200ms API response times
- ✅ Support 1,000 concurrent players

### Phase 2 (Alpha)

- ✅ Group content functional
- ✅ PvP system balanced
- ✅ Economy stable (no inflation)
- ✅ Support 5,000 concurrent players

### Phase 3 (Beta)

- ✅ All content complete
- ✅ <1% crash rate
- ✅ Endgame progression working
- ✅ Support 10,000 concurrent players

### Phase 4 (Release)

- ✅ 99.9% uptime
- ✅ All monetization systems operational
- ✅ Support 50,000+ concurrent players
- ✅ Positive player reviews

---

**Updated by**: Claude Code  
**Based on**: aeturnis-prompt-tracker.md (32 systems)  
**Next Update**: After Banking Service implementation
