# Aeturnis Online Development Roadmap

**Current Version**: v1.1.0-dev "Jörmun"  
**Last Updated**: 2025-07-13  
**Implementation Speed**: ~3 systems/day (based on current progress: 6 systems
in 2 days)

## Development Phase Overview

### Phase Timeline Summary

- **Phase 1 (MVP)**: July 2025 - September 2025 (2.5 months)
- **Phase 2 (Alpha)**: October 2025 - November 2025 (2 months)
- **Phase 3 (Beta)**: December 2025 - February 2026 (3 months)
- **Phase 4 (Release)**: March 2026

---

## Phase 1: MVP - Core Game Loop

**Target**: 32 systems | **Status**: 6/32 complete (18.8%)  
**Estimated Completion**: September 2025

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

| Catalog Tag | System Name          | Priority     | Justification                           |
| ----------- | -------------------- | ------------ | --------------------------------------- |
| [P1-S1-3]   | Monitoring & Logging | 🟢 Next      | Foundation system, no dependencies      |
| [P1-S1-4]   | Cache & Performance  | 🟢 Next      | Foundation system, improves all systems |
| [P1-S2-1]   | Account Management   | 🟡 Following | Required for character/banking systems  |

### 📅 Development Schedule (Following Implementation Plan v5.0)

#### July 2025 (Foundation & Infrastructure)

| Week                | Systems to Implement                   | Count | Key Features                                    |
| ------------------- | -------------------------------------- | ----- | ----------------------------------------------- |
| Week 3 (July 15-21) | Monitoring, Cache, Account Management  | 3     | Metrics, caching, account system                |
| Week 4 (July 22-28) | Character Creation, Stats, Item System | 3     | Character customization, stat allocation, items |

#### August 2025 (Core Systems)

| Week                   | Systems to Implement                  | Count | Key Features                                  |
| ---------------------- | ------------------------------------- | ----- | --------------------------------------------- |
| Week 1 (July 29-Aug 4) | Equipment, Inventory, Combat Engine   | 3     | Equipment slots, inventory management, combat |
| Week 2 (Aug 5-11)      | Skills, Buffs/Debuffs, NPCs           | 3     | Skill system, status effects, NPC templates   |
| Week 3 (Aug 12-18)     | AI, Loot, Shop, Consumables           | 4     | AI behavior, loot tables, vendors, potions    |
| Week 4 (Aug 19-25)     | Banking, Death/Respawn, Zones, Travel | 4     | Banking system, death penalties, world zones  |

#### September 2025 (Communication & Social)

| Week               | Systems to Implement                        | Count | Key Features                                  |
| ------------------ | ------------------------------------------- | ----- | --------------------------------------------- |
| Week 1 (Sep 1-8)   | Chat, Emotes, Friends, Player Search        | 4     | Communication channels, social features       |
| Week 2 (Sep 9-15)  | Tutorial, Help, Settings, Moderation        | 4     | New player experience, UI settings, mod tools |
| Week 3 (Sep 16-22) | Support Tools, Anti-Cheat, Performance Mon. | 3     | Admin tools, security, monitoring             |
| Week 4 (Sep 23-30) | Leaderboards, Testing, Polish               | 1     | Rankings, final MVP polish                    |

### 📊 Complete Phase 1 System List (32 Total)

#### Infrastructure (6 systems - ✅ 4 COMPLETE, ⏳ 2 REMAINING)

1. [P1-S1-C] Package Management Setup ✅
2. [P1-S1-A] GitHub Actions CI ✅
3. [P1-S1-B] Initial DB Schema & Migrations ✅
4. [P1-S1-1] Core Architecture ✅
5. [P1-S1-2] Security & Auth ✅
6. [P1-S1-3] Monitoring & Logging ⏳
7. [P1-S1-4] Cache & Performance ⏳
8. [Coverage] Test Coverage Enhancement ✅

#### Account & Character (3 systems)

9. [P1-S2-1] Account Management
10. [P1-S2-2] Character Creation & Customization
11. [P1-S2-3] Stats & Progression

#### Items & Equipment (3 systems)

12. [P1-S3-1] Item System
13. [P1-S3-2] Equipment Service
14. [P1-S3-3] Inventory Management

#### Combat (3 systems)

15. [P1-S4-1] Core Combat Engine
16. [P1-S4-2] Skill System
17. [P1-S4-3] Buffs & Debuffs

#### NPCs & AI (2 systems)

18. [P1-S5-1] NPC System
19. [P1-S5-2] Basic AI Service

#### Loot & Economy (3 systems)

20. [P1-S6-1] Loot System
21. [P1-S6-2] Shop System
22. [P1-S6-3] Consumables

#### Banking & Death (2 systems) - Depends on [P1-S6]

23. [P1-S7-1] Banking Service
24. [P1-S7-2] Death & Respawn System

#### Zone & World (2 systems)

25. [P1-S8-1] Zone Service
26. [P1-S8-2] Travel System

#### Communication (2 systems)

27. [P1-S9-1] Complete Chat System
28. [P1-S9-2] Emote System

#### Social (2 systems)

29. [P1-S10-1] Friend System
30. [P1-S10-2] Player Search & Inspection

#### Tutorial & Support (2 systems)

31. [P1-S11-1] Tutorial System
32. [P1-S11-2] Help System
33. [P1-S12-1] Settings Management

#### Administration (3 systems)

34. [P1-S13-1] Moderation Tools
35. [P1-S13-2] Customer Support Tools
36. [P1-S14-1] Anti-Cheat System
37. [P1-S14-2] Performance Monitoring

#### Competitive (1 system)

38. [P1-S15-1] Leaderboard Service

### Version Milestones

| Version | Codename   | Systems Included                                  | Target Date   |
| ------- | ---------- | ------------------------------------------------- | ------------- |
| v1.0.0  | "Jörmun"   | Foundation & Infrastructure (6 systems)           | ✅ Released   |
| v1.1.0  | "Fenrir"   | Monitoring, Cache, Account Management (3 systems) | July 21, 2025 |
| v1.2.0  | "Týr"      | Character Systems (3 systems)                     | July 28, 2025 |
| v1.3.0  | "Odin"     | Items & Equipment (3 systems)                     | Aug 4, 2025   |
| v1.4.0  | "Thor"     | Combat & Skills (3 systems)                       | Aug 11, 2025  |
| v1.5.0  | "Loki"     | NPCs, AI, Loot, Shop (4 systems)                  | Aug 18, 2025  |
| v1.6.0  | "Freya"    | Banking, Death, Zones (4 systems)                 | Aug 25, 2025  |
| v1.7.0  | "Heimdall" | Chat & Social (4 systems)                         | Sep 8, 2025   |
| v1.8.0  | "Baldur"   | Tutorial, Admin, Anti-Cheat (6 systems)           | Sep 22, 2025  |
| v2.0.0  | "Ragnarök" | MVP Complete (All systems tested and integrated)  | Sep 30, 2025  |

---

## Phase 2: Alpha - Advanced Systems

**Target**: 18 systems | **Timeline**: October - November 2025  
**Focus**: Group content, PvP, economy

### October 2025 Schedule

| Week   | Catalog Tags         | Systems                       | Key Features                      |
| ------ | -------------------- | ----------------------------- | --------------------------------- |
| Week 1 | [P2-S1-1], [P2-S2-1] | Party System, Quest System    | Group mechanics, quest chains     |
| Week 2 | [P2-S3-1], [P2-S3-2] | PvP Service, Alignment System | PK mechanics, good/evil alignment |
| Week 3 | [P2-S4-1], [P2-S4-2] | Trading, Auction House        | Player economy                    |
| Week 4 | [P2-S5-1], [P2-S6-1] | Mail System, Reincarnation    | Communication, character rebirth  |

### November 2025 Schedule

| Week   | Systems                          | Key Features                |
| ------ | -------------------------------- | --------------------------- |
| Week 1 | Daily Activities, Advanced Zones | Login rewards, world events |
| Week 2 | Dungeon System, World Bosses     | Group content               |
| Week 3 | Guild System (placeholder)       | Basic guild features        |
| Week 4 | Alpha Polish & Testing           | Stress tests                |

**Alpha Milestones**:

- Closed Alpha Start: October 1, 2025
- Stress Test Weekend: October 25-27, 2025
- Open Alpha: November 15, 2025

---

## Phase 3: Beta - Advanced Features

**Target**: 25+ systems | **Timeline**: December 2025 - February 2026  
**Focus**: Endgame content, crafting, advanced systems

### December 2025 (Endgame Systems)

- Achievement System
- Gem System & Enchanting
- Crafting Professions
- Instance/Dungeon System

### January 2026 (Social & Economy)

- Clan System (full implementation)
- Kingdom System
- Advanced Trading
- Housing System

### February 2026 (Polish & Launch Prep)

- AI Integration (Ollama)
- Marriage System
- Pet System
- Final optimization

**Beta Milestones**:

- Closed Beta: December 1, 2025
- Open Beta: January 15, 2026
- Release Candidate: February 20, 2026

---

## Phase 4: Release

**Target Date**: March 1, 2026  
**Launch Features**:

- 100+ hours of content
- 6 races (+ 4 special reincarnation races)
- 8 classes with full skill trees
- 20+ zones with level progression
- Complete PvP and PvE systems
- Full social features and economy

---

## Critical Path Dependencies (Per Implementation Plan v5.0)

```
[P1-S1] Foundation & Infrastructure
    ↓
[P1-S2] Account & Character System
    ↓
[P1-S3] Items, Equipment & Inventory
    ↓
[P1-S4] Combat System & Mechanics
    ↓
[P1-S5] NPCs & Basic AI
    ↓
[P1-S6] Loot & Economy Foundation
    ↓
[P1-S7] Banking & Death System (depends on loot/economy)
    ↓
[P1-S8] Zone System & World (depends on NPCs and Death)
```

**Note**: Banking is NOT a critical early system. It depends on having:

- Loot system (to generate gold to bank)
- Economy foundation (to understand currency)
- Items (to allow item banking)

## Risk Factors & Velocity

### Current Velocity

- **Achieved**: 6 systems in 2 days = 3 systems/day
- **Required**: 26 systems in 79 days = 0.33 systems/day
- **Buffer**: 9x faster than required

### Adjusted Timeline (Conservative)

If velocity drops to 1 system/day:

- MVP Complete: August 20, 2025 (5 weeks early)
- Alpha Complete: October 15, 2025 (2 weeks early)
- Beta Complete: January 15, 2026 (6 weeks early)

### Risk Mitigation

- Follow Implementation Plan v5.0 dependency order
- Complete foundation systems before features
- Maintain 90%+ test coverage
- Keep 20% time buffer for testing/polish

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
**Based on**: aeturnis-implementation-plan.md v5.0  
**Next Update**: After Monitoring & Logging implementation

**IMPORTANT**: This roadmap now follows the Implementation Plan v5.0 dependency
order. Banking is no longer prioritized early as it depends on having Loot &
Economy systems first.
