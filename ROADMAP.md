# Aeturnis Online Development Roadmap

**Current Version**: v1.0.0 "Jörmun"  
**Last Updated**: 2025-07-13  
**Implementation Speed**: ~2.5 systems/day (based on current progress)

## Development Phase Overview

### Phase Timeline Summary

- **Development (MVP)**: July 2025 - September 2025 (2.5 months)
- **Alpha**: October 2025 - November 2025 (2 months)
- **Beta**: December 2025 - February 2026 (3 months)
- **Release**: March 2026

---

## Phase 1: Development (MVP) - Core Game Loop

**Target**: 32 systems | **Status**: 5/32 complete (15.6%)  
**Estimated Completion**: September 2025

### July 2025 (Foundation & Combat)

| Week                | Systems                        | Status      | Features                             |
| ------------------- | ------------------------------ | ----------- | ------------------------------------ |
| Week 2 (July 8-14)  | [P1-S1-A/B/C] Infrastructure   | ✅ Complete | CI/CD, Database, Package Management  |
|                     | [P1-S1-1] Core Architecture    | ✅ Complete | Services, Repositories, DI Container |
| Week 3 (July 15-21) | [P1-S7-1] Banking Service      | 🔄 Next     | Critical for death penalties         |
|                     | [P1-S2-1] Account Management   | ⏳ Planned  | Authentication, JWT                  |
|                     | [P1-S7-2] Death & Respawn      | ⏳ Planned  | Core mechanic                        |
| Week 4 (July 22-28) | [P1-S4-1] Core Combat Engine   | ⏳ Planned  | Damage calculation                   |
|                     | [P1-S4-2] Skill System         | ⏳ Planned  | Class abilities                      |
|                     | [P1-S9-1] Complete Chat System | ⏳ Planned  | 4 mandatory channels                 |

### August 2025 (Characters & Items)

| Week                   | Systems                        | Status     | Features               |
| ---------------------- | ------------------------------ | ---------- | ---------------------- |
| Week 1 (July 29-Aug 4) | [P1-S2-2] Character Creation   | ⏳ Planned | 6 races, 8 classes     |
|                        | [P1-S2-3] Stats & Progression  | ⏳ Planned | XP, levels, attributes |
|                        | [P1-S3-1] Item System          | ⏳ Planned | Rarities, stats        |
| Week 2 (Aug 5-11)      | [P1-S3-2] Equipment Service    | ⏳ Planned | 15 equipment slots     |
|                        | [P1-S3-3] Inventory Management | ⏳ Planned | Bags, sorting          |
|                        | [P1-S6-1] Loot System          | ⏳ Planned | Drop tables            |
| Week 3 (Aug 12-18)     | [P1-S5-1] NPC System           | ⏳ Planned | Vendors, quest givers  |
|                        | [P1-S5-2] Basic AI Service     | ⏳ Planned | Combat AI              |
|                        | [P1-S6-2] Shop System          | ⏳ Planned | Buy/sell mechanics     |
| Week 4 (Aug 19-25)     | [P1-S8-1] Zone Service         | ⏳ Planned | Area management        |
|                        | [P1-S8-2] Travel System        | ⏳ Planned | Movement, recalls      |
|                        | [P1-S6-3] Consumables          | ⏳ Planned | Potions, food          |

### September 2025 (Polish & Core Features)

| Week                  | Systems                        | Status     | Features              |
| --------------------- | ------------------------------ | ---------- | --------------------- |
| Week 1 (Aug 26-Sep 1) | [P1-S10-1] Friend System       | ⏳ Planned | Social features       |
|                       | [P1-S10-2] Player Search       | ⏳ Planned | /who, inspection      |
|                       | [P1-S9-2] Emote System         | ⏳ Planned | Social expressions    |
| Week 2 (Sep 2-8)      | [P1-S11-1] Tutorial System     | ⏳ Planned | New player experience |
|                       | [P1-S11-2] Help System         | ⏳ Planned | Documentation         |
|                       | [P1-S12-1] Settings Management | ⏳ Planned | Player preferences    |
| Week 3 (Sep 9-15)     | [P1-S1-2] Security & Auth      | ⏳ Planned | 2FA, rate limiting    |
|                       | [P1-S1-3] Monitoring & Logging | ⏳ Planned | Analytics, metrics    |
|                       | [P1-S1-4] Cache & Performance  | ⏳ Planned | Redis, optimization   |
| Week 4 (Sep 16-22)    | [P1-S13-1] Moderation Tools    | ⏳ Planned | Admin features        |
|                       | [P1-S14-1] Anti-Cheat System   | ⏳ Planned | Security measures     |
|                       | [P1-S15-1] Leaderboard Service | ⏳ Planned | Rankings              |

**Version Milestones**:

- v1.1.0 "Fenrir": Banking & Account Systems (July Week 3)
- v1.2.0 "Sleipnir": Combat & Skills (July Week 4)
- v1.3.0 "Huginn": Characters & Items (August Week 2)
- v1.4.0 "Muninn": NPCs & Economy (August Week 3)
- v1.5.0 "Níðhöggr": Social & Polish (September Week 2)

---

## Phase 2: Alpha - Advanced Systems

**Target**: 35+ systems | **Timeline**: October - November 2025  
**Focus**: Content expansion, advanced features, stress testing

### October 2025 (Content Systems)

| Week   | Major Features | Description                        |
| ------ | -------------- | ---------------------------------- |
| Week 1 | Quest System   | Quest chains, objectives, rewards  |
| Week 2 | Party System   | Group mechanics, loot distribution |
| Week 3 | PvP Zones      | Wilderness areas, PK mechanics     |
| Week 4 | Dungeon System | Instanced content, boss mechanics  |

### November 2025 (Advanced Features)

| Week   | Major Features     | Description                     |
| ------ | ------------------ | ------------------------------- |
| Week 1 | Guild System       | Guild management, ranks, banks  |
| Week 2 | Trade System       | Player-to-player trading, mail  |
| Week 3 | Crafting System    | Professions, recipes, gathering |
| Week 4 | Achievement System | Titles, rewards, statistics     |

**Alpha Milestones**:

- Closed Alpha Start: October 1, 2025
- Stress Test Weekend: October 25-27, 2025
- Open Alpha: November 15, 2025

---

## Phase 3: Beta - Polish & Endgame

**Target**: 40+ systems | **Timeline**: December 2025 - February 2026  
**Focus**: Endgame content, balance, polish

### December 2025 (Endgame Systems)

| Week   | Major Features | Description                      |
| ------ | -------------- | -------------------------------- |
| Week 1 | Raid System    | Large group content, raid bosses |
| Week 2 | Arena System   | Structured PvP, rankings         |
| Week 3 | Housing System | Player homes, decoration         |
| Week 4 | Holiday Events | Seasonal content                 |

### January 2026 (Economy & Polish)

| Week   | Major Features | Description             |
| ------ | -------------- | ----------------------- |
| Week 1 | Auction House  | Player marketplace      |
| Week 2 | Mount System   | Travel enhancements     |
| Week 3 | Pet System     | Companions, pet battles |
| Week 4 | Cosmetic Shop  | Monetization features   |

### February 2026 (Final Polish)

| Week   | Major Features     | Description               |
| ------ | ------------------ | ------------------------- |
| Week 1 | Voice Chat         | Integrated communication  |
| Week 2 | Controller Support | Gamepad compatibility     |
| Week 3 | Performance Pass   | Optimization, bug fixes   |
| Week 4 | Launch Preparation | Marketing, server scaling |

**Beta Milestones**:

- Closed Beta: December 1, 2025
- Open Beta: January 15, 2026
- Release Candidate: February 20, 2026

---

## Phase 4: Release

**Target Date**: March 1, 2026  
**Launch Features**:

- 100+ hours of content
- 6 races, 8 classes
- 20+ zones
- 5 dungeons, 2 raids
- Comprehensive PvP system
- Full social features
- Mobile companion app

---

## Risk Factors & Adjustments

### Optimistic Scenario (2x speed)

- MVP Complete: August 2025
- Alpha: September 2025
- Beta: October-November 2025
- Release: December 2025

### Pessimistic Scenario (0.5x speed)

- MVP Complete: December 2025
- Alpha: January-March 2026
- Beta: April-July 2026
- Release: August 2026

### Current Velocity Metrics

- **Systems per day**: 2.5 (based on 5 systems in 2 days)
- **Test coverage**: 48.63% (258 tests)
- **CI success rate**: 100%
- **Audit resolution**: 100%

---

## Public Communication

This roadmap will be updated weekly with:

- ✅ Completed systems
- 🔄 In-progress work
- ⏳ Upcoming features
- 📊 Velocity metrics
- 🎯 Milestone progress

Follow development at: [GitHub Repository]
