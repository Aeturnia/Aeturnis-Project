# Shimlar Reimagined: Revised Design Document v3.1
*Critical Features Restored & Properly Phased*

After careful review, I've identified several critical oversights and misplaced features. Here's the corrected design:

## CRITICAL DESIGN DECISIONS

### Server Rounds/Resets
Based on the original: "The rounds there last less than a month, then the premium items must be bought again" and "Round 4 playtime: 5 weeks"

**Options:**
1. **Traditional Rounds** (4-12 weeks): Full server resets, everyone starts fresh
2. **Eternal Server**: No resets, true infinite progression
3. **Hybrid**: Seasonal events with partial resets (keep certain achievements)

**Recommendation**: Start with **Eternal Server** for MVP, add optional seasonal servers in Beta.

---

## PHASE 1: MVP - CORRECTED
*Target: 2-3 months*

### 1.1 Core Systems

#### Account & Character Management
- **Multiple Characters**: "Can I have more than one character? A: Yes, as many as you like. However, low level characters are deleted from time to time."
- Character slots: 3 per account
- Auto-deletion: Characters under level 10 after 30 days inactive

#### Banking System *(MOVED TO MVP)*
- **Critical for gameplay**: "You lose all UNBANKED gold and 20% of exp needed to next level"
- Simple bank with deposit/withdraw
- No interest or fees in MVP

#### Death Penalties
```javascript
class DeathSystem {
  applyDeathPenalty(player) {
    // Lose all unbanked gold
    player.goldOnHand = 0;
    
    // Lose 20% XP to next level
    const xpToNext = this.calculateXPRequired(player.level + 1) - player.experience;
    player.experience -= Math.floor(xpToNext * 0.2);
    
    // Can't go below current level
    const minXP = this.calculateXPRequired(player.level);
    player.experience = Math.max(player.experience, minXP);
  }
}
```

### 1.2 Chat System *(EXPANDED FOR MVP)*
**Four Channels from Start**:
1. **General Chat**: Main social channel
2. **Trade Chat**: "The Sales Room is for selling your items. You are not allowed to sell your items anywhere else."
3. **Help Chat**: New player questions
4. **Race Chat**: "The fourth chat channel is special, as the messages in there can only be seen by people of either same clan or race as you."

### 1.3 Zone System
- **Outworld Access**: "You can go to Outworld from 0,0 once you reach level 15"
- Starting zones + 3 leveling zones
- Clear level requirements displayed

### 1.4 Basic Social
#### Buddy System *(MOVED TO MVP)*
```javascript
// Basic friend list functionality
commands = {
  '/buddya': addBuddy,
  '/buddyr': removeBuddy,
  '/mbuddy': messageAllBuddies
}
```

### 1.5 Admin/Moderation *(ENHANCED)*

#### Role Hierarchy
```javascript
const roles = {
  PLAYER: 0,
  MODERATOR: 1,
  ARCHMODERATOR: 2,
  ARCHWIZARD: 3,  // "People with bold names"
  ADMIN: 4
};
```

#### Basic Moderation Tools
- "Moderator, or MOD is a person with the power to mute and curse others."
- `/mute player hours` - Mute for specified hours
- `/jail player reason` - Remove from game temporarily
- Chat monitoring dashboard
- Report queue system

---

## PHASE 2: ALPHA - CORRECTED
*Target: 3-4 months*

### 2.1 PvP & Alignment *(KEPT IN ALPHA)*
Essential for the alignment system to work properly:

#### PK System
- "After the reset a new feature was added to stop people PK'ing more than 6 people per hour, after you PK someone there is a 10min or 600seconds time limit until your next Kill."
- PKTag system: "/pktag $text = adds/updates your pk tag must include :pk: that will be replaced by your opponent name"
- Alignment consequences for kills

#### Alignment System
```javascript
class AlignmentSystem {
  // -1000 (evil) to +1000 (good)
  adjustAlignment(killer, victim) {
    if (victim.alignment > 0) {
      killer.alignment -= 1; // Killed good player
    } else if (victim.alignment < 0) {
      killer.alignment += 1; // Killed evil player
    }
    
    // Visual indicators
    this.updatePlayerColor(killer); // Red for evil, Blue for good
  }
}
```

### 2.2 Reincarnation System *(NEW)*
- "Go to Royal University 14,21 Wilderness, enter and then go to 1,2 Royal University with 100k, then you can reincarnate."
- Allow race/class changes
- Keep equipment and gold
- Reset stats for redistribution

### 2.3 Expanded Content
- **Race-locked content**: "those who wish to reincarnate as another Race with Level restrictions (For example: Balrog, Flame Demon, Genie)"
- Temples for alignment adjustment
- Zone-based alignment shifts

### 2.4 Player-to-Player Transfers *(MOVED FROM BETA)*
The original had a Transfers table, indicating direct player trades were important early:
- Direct gold transfers
- Item trading window
- Trade history logging

---

## PHASE 3: BETA - CORRECTED
*Target: 4-6 months*

### 3.1 Clans & Kingdoms
Now properly structured with all dependencies:

#### Clan Requirements
- "To create a clan you need to be level 300 or higher and to join a clan you need to be level 100 or higher."
- 10M gold to create, 2M to join (1M player, 1M clan)

#### Kingdom Mechanics
- "Only a clan leader can settle a kingdom. Kingdoms have 3 types of structures: a defence, which serves as protection against possible attackers, a mine which sometimes makes you get specific extra gems, and a miscellaneous type which has different effects that affect combat."
- "For clan mines to drop gems, there is a minimum 5% tax level needed."

### 3.2 Advanced Features
- Marriage system
- Housing (personal instances)
- Gem fusion system
- Quest chains

### 3.3 AI Integration
Full Ollama implementation for:
- Dynamic NPCs
- Quest generation
- World events
- Combat narration

### 3.4 Advanced Admin Tools

#### Automated Detection
```javascript
class AutomatedEnforcement {
  async detectBotting(player) {
    const patterns = {
      clickInterval: this.analyzeClickTiming(player),
      movementPattern: this.analyzeMovement(player),
      chatActivity: this.analyzeChatPattern(player),
      tradingBehavior: this.analyzeTrades(player)
    };
    
    if (patterns.clickInterval.variance < 0.1) {
      return { suspected: true, reason: 'Automated clicking detected' };
    }
  }
}
```

#### Economy Management
```javascript
class EconomyController {
  // Monitor and adjust economy health
  async analyzeEconomy() {
    const metrics = {
      totalGold: await this.getTotalGold(),
      activeTraders: await this.getActiveTradersCount(),
      inflation: await this.calculateInflation(),
      wealthGap: await this.calculateGiniCoefficient()
    };
    
    // Suggest adjustments
    if (metrics.inflation > 0.1) {
      return { suggestion: 'Increase gold sinks', urgency: 'high' };
    }
  }
}
```

---

## PHASE 4: FULL RELEASE
*Target: 2-3 months*

### 4.1 Optional Features
- **Seasonal Servers**: If desired, add round-based servers alongside eternal
- **Conquest System**: Server-wide achievements
- **Mastery System**: Advanced progression for weapons/spells
- **Dimensional Rifts**: Endgame content

### 4.2 Complete Admin Suite

#### Server Management Dashboard
```typescript
interface ServerControls {
  // Live server management
  rounds: {
    schedule: (duration: number) => void;
    reset: (options: ResetOptions) => void;
    announce: (message: string) => void;
  };
  
  // Player management
  players: {
    broadcast: (message: string) => void;
    findMultiAccounts: () => PlayerGroup[];
    resetInactiveCharacters: (daysInactive: number) => void;
  };
  
  // Event management
  events: {
    spawn: (event: WorldEvent) => void;
    schedule: (event: WorldEvent, time: Date) => void;
    modify: (eventId: string, changes: any) => void;
  };
}
```

---

## Key Corrections Made

1. **Banking in MVP** - Essential due to death penalty mechanics
2. **Four chat channels in MVP** - Core social structure
3. **Buddy system in MVP** - Basic social functionality
4. **Death penalties in MVP** - Core risk/reward mechanic
5. **PK cooldown system** - Important balance feature
6. **Reincarnation in Alpha** - Character flexibility feature
7. **Player transfers in Alpha** - Direct trading was in original
8. **Proper clan/kingdom costs** - Accurate to original
9. **Admin hierarchy** - Archwizards were distinct from mods
10. **Server round decision** - Made explicit as design choice

This revised design maintains the core Shimlar experience while properly phasing features based on dependencies and importance.