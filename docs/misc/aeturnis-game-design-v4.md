Looking at the Game Design document against the comprehensive implementation plan, there are significant gaps and ordering issues. Let me create a properly aligned version that includes all systems with their catalog tags:

# Aeturnis Online: Complete Game Design Document v4.0
*Aligned with Implementation Plan v5.0*

## Executive Summary

Aeturnis Online is a comprehensive MMORPG featuring:
- **150+ distinct systems** organized across 4 phases
- **12-15 month development timeline**
- **Catalog Format**: [P{phase}-S{step}-{substep}] for cross-referencing
- **Package Manager**: Yarn (NOT npm)

---

## Phase 1: MVP - Core Game Loop (3-4 months)

### [P1-S1] Foundation & Infrastructure
*The critical backend systems that everything depends on*

#### [P1-S1-1] Core Architecture
- Time & scheduling service
- Feature flag system for gradual rollouts
- Database infrastructure with migrations
- Connection pooling and query optimization

#### [P1-S1-2] Security & Auth
- Password hashing and JWT tokens
- Two-factor authentication
- Account recovery system
- Rate limiting and captcha
- GDPR compliance features

#### [P1-S1-3] Monitoring & Logging
- Performance metrics tracking
- Error tracking and alerting
- Player analytics pipeline
- System health monitoring

#### [P1-S1-4] Cache & Performance
- Multi-tier caching (L1/L2)
- Cache invalidation strategies
- Static data preloading
- Cache warming system

#### [P1-S1-5] Package Management Setup
- Yarn workspace configuration
- Monorepo structure
- Build pipeline setup

### [P1-S2] Account & Character System

#### [P1-S2-1] Account Management
- **Multiple Characters**: 3 slots per account (expandable)
- Character auto-deletion: Level <10 after 30 days inactive
- Premium account features
- Email verification and account recovery

#### [P1-S2-2] Character Creation & Customization
- 6 base races, 8 classes
- Detailed appearance customization
- Starting stats allocation
- Name validation and reservation

#### [P1-S2-3] Stats & Progression
- Primary stats: STR, DEX, INT, VIT, WIS, LUK
- Derived stats calculation
- Level progression curve
- Stat points allocation system

### [P1-S3] Items, Equipment & Inventory

#### [P1-S3-1] Item System
- Item rarities: Common to Legendary
- Random stat generation
- Socket system foundation
- Bind on pickup/equip mechanics
- Durability system

#### [P1-S3-2] Equipment Service
- 15 equipment slots
- Set bonus detection
- Item comparison tooltips
- Quick equip/unequip
- Repair costs and durability loss

#### [P1-S3-3] Inventory Management
- Expandable bag slots
- Auto-sort functionality
- Stack splitting
- Quick deposit features
- Search and filter system

### [P1-S4] Combat System & Mechanics

#### [P1-S4-1] Core Combat Engine
- Real-time combat with cooldowns
- Damage calculation formulas
- Hit/miss/crit/block mechanics
- Threat/aggro system
- Resistance calculations

#### [P1-S4-2] Skill System
- Class-specific skill trees
- Active/passive/toggle skills
- Skill point allocation
- Cooldown management
- Resource consumption (mana/stamina)

#### [P1-S4-3] Buffs & Debuffs
- Status effect system
- Buff/debuff stacking rules
- Dispel mechanics
- Immunity systems
- Periodic damage/healing

### [P1-S5] NPCs & Basic AI

#### [P1-S5-1] NPC System
- NPC templates and spawning
- Basic vendor NPCs
- Quest giver NPCs
- Patrol paths
- Aggro ranges

#### [P1-S5-2] Basic AI Service
- Target selection logic
- Basic combat AI
- Threat table management
- Group coordination
- Leash mechanics

### [P1-S6] Loot & Economy Foundation

#### [P1-S6-1] Loot System
- Loot table generation
- Magic find calculations
- Quest item generation
- Gold drops
- Loot distribution rules

#### [P1-S6-2] Shop System
- Basic NPC vendors
- Buy/sell mechanics
- Buyback slots
- Dynamic pricing based on level
- Repair services

#### [P1-S6-3] Consumables
- Health/mana potions
- Food and drink buffs
- Cooldown groups
- Well-fed bonuses
- Potion sickness

### [P1-S7] Banking & Death System
*Critical for MVP due to death penalties*

#### [P1-S7-1] Banking Service
- Gold deposit/withdraw
- Bank storage tabs
- Shared account bank
- Quick deposit all
- Bank expansion costs

#### [P1-S7-2] Death & Respawn System
```
Death Penalties:
- Lose ALL unbanked gold
- Lose 20% XP to next level
- 10% durability damage
- Resurrection sickness debuff
```
- Graveyard respawn points
- Corpse run mechanics
- Spirit healer system

### [P1-S8] Zone System & World

#### [P1-S8-1] Zone Service
- Starting zones (level 1-15)
- Zone level requirements
- **Outworld access**: Level 15+ from coordinates 0,0
- Safe zones vs PvP zones
- Discovery rewards

#### [P1-S8-2] Travel System
- Waypoint unlocking
- Flight path system
- Basic mount system
- Travel costs
- Zone transitions

### [P1-S9] Chat & Communication

#### [P1-S9-1] Complete Chat System
**Four mandatory channels**:
1. **General**: Main social channel
2. **Trade**: Enforced trading only ("You are not allowed to sell your items anywhere else")
3. **Help**: Newbie assistance
4. **Race**: Race/clan restricted visibility

Additional features:
- Whisper system
- Chat history
- Ignore list
- Profanity filter
- Chat commands

#### [P1-S9-2] Emote System
- Basic emotes (/wave, /dance, etc.)
- Targeted emotes
- Custom emote text
- Emote animations

### [P1-S10] Social Systems

#### [P1-S10-1] Friend System
**Buddy commands from original**:
- `/buddya` - Add buddy
- `/buddyr` - Remove buddy  
- `/mbuddy` - Message all buddies
- Online/offline notifications
- Friend notes

#### [P1-S10-2] Player Search & Inspection
- /who command
- Character inspection
- Achievement viewing
- Equipment comparison
- Profile system

### [P1-S11] Tutorial & Help

#### [P1-S11-1] Tutorial System
- Guided new player experience
- Skippable tutorial option
- Contextual hints
- Tutorial rewards
- Progress tracking

#### [P1-S11-2] Help System
- Searchable help database
- Context-sensitive help
- FAQ system
- Video tutorial links
- Beginner tips

### [P1-S12] Settings & UI

#### [P1-S12-1] Settings Management
- Graphics settings
- Audio settings
- Gameplay preferences
- Keybind customization
- UI layout saving

### [P1-S13] Admin & Moderation

#### [P1-S13-1] Moderation Tools
**Role Hierarchy**:
```
MODERATOR: Can mute and curse
ARCHMODERATOR: Extended mod powers
ARCHWIZARD: Bold names, special powers
ADMIN: Full system access
```

Core tools:
- `/mute player hours`
- `/jail player reason`
- Chat monitoring
- Report queue
- Player investigation tools

#### [P1-S13-2] Customer Support Tools
- Ticket system
- Account recovery
- Item restoration
- Compensation tools
- Remote assistance

### [P1-S14] Infrastructure & Anti-Cheat

#### [P1-S14-1] Anti-Cheat System
- Movement validation
- Combat validation
- Economy monitoring
- Pattern detection
- Automated flagging

#### [P1-S14-2] Performance Monitoring
- Server metrics
- Database performance
- API latency tracking
- Client performance data
- Bottleneck identification

### [P1-S15] Leaderboards & Rankings

#### [P1-S15-1] Leaderboard Service
- Level rankings
- PvP rankings
- Wealth rankings
- Achievement points
- Guild rankings

---

## Phase 2: Alpha - Advanced Systems (3-4 months)

### [P2-S1] Party System

#### [P2-S1-1] Party Management
- 5-player parties
- Party leader controls
- Loot distribution rules
- Ready checks
- Raid conversion (20 players)

### [P2-S2] Quest System

#### [P2-S2-1] Quest Service
- Quest chains
- Daily/weekly quests
- Class-specific quests
- Race-specific quests
- Shared quest progress
- Quest item management

### [P2-S3] PvP & Combat Systems

#### [P2-S3-1] PvP Service
**PK System Rules**:
- 10-minute cooldown between kills
- Maximum 6 kills per hour
- PK tag system: `/pktag :pk: was here`
- Bounty system
- Honor points

#### [P2-S3-2] Alignment System
```
Alignment Ranges:
-1000 to -667: Pure Evil (Red)
-666 to -334: Evil
-333 to +333: Neutral
+334 to +666: Good  
+667 to +1000: Pure Good (Blue)
```
- Killing good players → evil alignment
- Killing evil players → good alignment
- Temple visits for alignment adjustment

### [P2-S4] Trading & Auction House

#### [P2-S4-1] Direct Trading
- Secure trade windows
- Trade confirmation
- Trade history logging
- Gold transfer limits

#### [P2-S4-2] Auction House
- Item listings (12/24/48 hour)
- Bidding system
- Buyout options
- Listing fees (gold sink)
- Market history

### [P2-S5] Mail System

#### [P2-S5-1] Mail Service
- 30-day mail expiration
- Attachments (gold/items)
- Cash on Delivery (COD)
- System mail
- Mail forwarding

### [P2-S6] Reincarnation System

#### [P2-S6-1] Reincarnation Service
**Requirements**:
- Location: Royal University (1,2)
- Cost: 100,000 gold
- Keep equipment and gold
- Reset stats for redistribution

**Special Races** (level requirements):
- Balrog: Level 500, evil alignment
- Flame Demon: Level 400, evil alignment
- Genie: Level 450, neutral alignment
- Angel: Level 500, good alignment

### [P2-S7] Daily Activities & Rewards

#### [P2-S7-1] Daily System
- Login streak rewards
- Daily quest refresh
- Weekly activities
- Event calendar
- Bonus weekends

### [P2-S8] Expanded Zones & Content

#### [P2-S8-1] Advanced Zones
- Temple system for alignment
- Race-locked zones
- Dynamic world events
- World boss spawns
- Hidden areas

---

## Phase 3: Beta - Advanced Features (4-6 months)

### [P3-S1] Achievement System

#### [P3-S1-1] Achievement Service
- Account-wide achievements
- Character-specific achievements
- Hidden achievements
- Achievement rewards
- Meta achievements

### [P3-S2] Gems & Enchanting

#### [P3-S2-1] Gem System
- Socket types: Red, Blue, Yellow, Prismatic
- Gem qualities (1-5)
- Basic gem fusion
- Socket bonuses

#### [P3-S2-2] Enchanting System
- Weapon/armor enchants
- Enchanting materials
- Disenchanting items
- Runeforging

### [P3-S3] Crafting System

#### [P3-S3-1] Crafting Service
- Multiple professions
- Gathering skills
- Recipe discovery
- Specializations
- Crafting queues

### [P3-S4] Clan System

#### [P3-S4-1] Clan Service
**Requirements**:
- Creation: Level 300+, 10M gold
- Joining: Level 100+, 2M gold (1M to player, 1M to clan)
- Clan ranks and permissions
- Clan bank
- Clan perks

### [P3-S5] Kingdom System

#### [P3-S5-1] Kingdom Service
**Structures**:
- Defense buildings
- Mines (5% minimum tax for gem drops)
- Miscellaneous buildings with combat effects

Features:
- Kingdom warfare
- Resource management
- Tax collection
- Siege mechanics

### [P3-S6] Instances & Dungeons

#### [P3-S6-1] Instance Service
- Instanced dungeons
- Multiple difficulties
- Boss mechanics
- Lockout timers
- Bonus rolls

### [P3-S7] AI Integration (Ollama)

#### [P3-S7-1] Dynamic AI System
- Dynamic NPC conversations
- Quest generation
- World event narration
- Combat narration
- Dynamic lore generation

### [P3-S8] Advanced Features Bundle

#### [P3-S8-1] Marriage System
- Marriage proposals
- Shared benefits
- Wedding ceremonies
- Anniversary rewards

#### [P3-S8-2] Housing System
- Personal houses
- Decoration system
- Neighborhoods
- House upgrades

#### [P3-S8-3] Advanced Gem Fusion
- Complex fusion recipes
- Gem cutting
- Set bonuses
- Transmutation

### [P3-S9] Advanced Admin Tools

#### [P3-S9-1] Economy Management
- Inflation tracking
- Wealth distribution analysis
- Gold sink creation
- Market manipulation tools

#### [P3-S9-2] Automated Detection
- Bot detection algorithms
- Exploit detection
- Multi-account detection
- RMT detection

---

## Phase 4: Release - Polish & Endgame (2-3 months)

### [P4-S1] Seasonal Content System

#### [P4-S1-1] Season Management
- Optional seasonal servers
- Season-specific rules
- Reward tracks
- Character migration

### [P4-S2] Conquest & Server Events

#### [P4-S2-1] Conquest System
- Large-scale clan warfare
- Territory control
- Resource battles
- Server-wide events

### [P4-S3] Mastery & Prestige Systems

#### [P4-S3-1] Mastery System
- Weapon mastery
- Spell evolution
- Prestige classes
- Mastery trees

### [P4-S4] Endgame Content

#### [P4-S4-1] Dimensional Rifts
- Infinite scaling content
- Timed challenges
- Leaderboards
- Exclusive rewards

#### [P4-S4-2] Mythic+ System
- Keystone dungeons
- Weekly affixes
- Great Vault rewards
- Scaling difficulty

### [P4-S5] Server Management Suite

#### [P4-S5-1] Live Operations
- Maintenance scheduling
- Emergency tools
- Event management
- Population management

#### [P4-S5-2] Analytics Dashboard
- Real-time metrics
- Player retention analysis
- Revenue tracking
- Automated reporting

### [P4-S6] Final Polish & Optimization

#### [P4-S6-1] Performance Optimization
- Database optimization
- Caching improvements
- Network optimization
- Client optimization

#### [P4-S6-2] Polish Tasks
- UI/UX refinement
- Tutorial improvements
- Animation polish
- Sound design
- Localization prep

---

## Critical Design Decisions

### Server Architecture
- **Eternal Server**: No resets, continuous progression
- **Optional Seasonal Servers**: Added in Phase 4 for variety
- **Server Capacity**: 10,000 concurrent users per server

### Core Mechanics Summary
1. **Death Penalty**: Lose unbanked gold + 20% XP to next level
2. **Banking**: Essential from day 1 due to death penalties
3. **PvP Limits**: 6 kills/hour, 10-minute cooldowns
4. **Alignment**: Visual color coding (red=evil, blue=good)
5. **Chat Channels**: 4 mandatory channels with enforced trade chat
6. **Multiple Characters**: 3 per account, auto-delete if <level 10
7. **Reincarnation**: Keep items/gold, change race/class

### Success Metrics
- API Response: <200ms p95
- Session Length: >45 min average
- D30 Retention: >25%
- Tutorial Completion: >80%

This design document now properly aligns with the implementation plan, includes all 150+ systems, and uses the catalog tag system for easy cross-referencing between design and implementation phases.