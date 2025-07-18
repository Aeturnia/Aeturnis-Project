# Aeturnis Online - Complete CAFE Implementation Plan v5.0
*Comprehensive MMORPG Implementation with All Systems*

## Technical Stack Note
**Runtime**: Node.js (LTS version)  
**Package Manager**: Yarn (NOT npm)  
All commands should use `yarn` instead of `npm`:
- `yarn install` instead of `npm install`
- `yarn add` instead of `npm install`
- `yarn test` instead of `npm test`
- `yarn build` instead of `npm run build`

## Executive Summary

This final implementation plan includes ALL systems required for a complete MMORPG. Every component has been evaluated for dependencies and placed in the appropriate phase.

**Cataloging Format**: [P{phase}-S{step}-{substep}]  
**Total Development Time**: 12-15 months

---

## Phase 1: MVP - Core Game Loop (3-4 months)

### [P1-S1] Foundation & Infrastructure
**Duration**: 2 weeks  
**Lead Agent**: Claude Code  
**Dependencies**: None

#### [P1-S1-1] Core Architecture
```typescript
// Time & Scheduling
interface TimeService {
  getCurrentServerTime(): Date;
  scheduleEvent(event: ScheduledEvent): Promise<void>;
  trackCooldown(entityId: string, type: string, duration: number): Promise<void>;
  checkCooldown(entityId: string, type: string): Promise<CooldownStatus>;
  registerCronJob(name: string, schedule: string, handler: () => Promise<void>): void;
}

// Feature Flags
interface FeatureFlagService {
  isEnabled(flag: string, userId?: string): boolean;
  getVariant(experiment: string, userId: string): string;
  getAllFlags(): Promise<FeatureFlag[]>;
  toggleFlag(flag: string, enabled: boolean): Promise<void>;
}

// Database Infrastructure
interface DatabaseService {
  runMigrations(): Promise<void>;
  createBackup(): Promise<BackupResult>;
  optimizeQueries(): Promise<void>;
  getConnectionPool(): ConnectionPool;
}
```

#### [P1-S1-2] Security & Auth
```typescript
interface SecurityService {
  // Authentication
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
  
  // Account security
  enable2FA(accountId: string): Promise<TwoFactorSecret>;
  verify2FA(accountId: string, code: string): Promise<boolean>;
  generateRecoveryCodes(accountId: string): Promise<string[]>;
  
  // Rate limiting
  checkRateLimit(identifier: string, action: string): Promise<RateLimitResult>;
  
  // Anti-bot
  generateCaptcha(): Promise<Captcha>;
  verifyCaptcha(id: string, response: string): Promise<boolean>;
}
```

#### [P1-S1-3] Monitoring & Logging
```typescript
interface MonitoringService {
  // Performance metrics
  trackMetric(name: string, value: number, tags?: Record<string, string>): void;
  trackLatency(operation: string, duration: number): void;
  
  // Error tracking
  captureException(error: Error, context?: ErrorContext): void;
  captureMessage(message: string, level: LogLevel): void;
  
  // Player analytics
  trackEvent(event: AnalyticsEvent): void;
  trackPlayerSession(playerId: string, sessionData: SessionData): void;
  
  // System health
  checkHealth(): Promise<HealthStatus>;
  getSystemMetrics(): Promise<SystemMetrics>;
}
```

#### [P1-S1-4] Cache & Performance
```typescript
interface CacheService {
  // Multi-tier caching
  setL1(key: string, value: any, ttl?: number): void;
  setL2(key: string, value: any, ttl?: number): Promise<void>;
  
  // Cache invalidation
  invalidate(pattern: string): Promise<void>;
  invalidateTag(tag: string): Promise<void>;
  
  // Preloading
  preloadStaticData(): Promise<void>;
  warmCache(keys: string[]): Promise<void>;
}
```

#### [P1-S1-5] Package Management Setup
```yaml
# package.json setup for Yarn
{
  "name": "aeturnis-online",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0",
    "yarn": ">=1.22.0"
  },
  "scripts": {
    "dev": "yarn workspace server dev & yarn workspace client dev",
    "build": "yarn workspaces run build",
    "test": "yarn workspaces run test",
    "lint": "yarn workspaces run lint"
  }
}
```

---

### [P1-S2] Account & Character System
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S1]

#### [P1-S2-1] Account Management
```typescript
interface Account {
  id: string;
  email: string;
  username: string;
  status: AccountStatus;
  characters: Character[];
  maxCharacterSlots: number; // 3 base, can increase
  premiumUntil?: Date;
  createdAt: Date;
  lastLogin: Date;
  settings: AccountSettings;
}

interface AccountService {
  create(data: CreateAccountDTO): Promise<Account>;
  verify(token: string): Promise<void>;
  recover(email: string): Promise<void>;
  changePassword(accountId: string, oldPass: string, newPass: string): Promise<void>;
  updateEmail(accountId: string, newEmail: string): Promise<void>;
  delete(accountId: string): Promise<void>; // GDPR compliance
}
```

#### [P1-S2-2] Character Creation & Customization
```typescript
interface Character {
  // Identity
  id: string;
  accountId: string;
  name: string;
  title?: string;
  
  // Appearance
  appearance: CharacterAppearance;
  
  // Stats
  level: number;
  experience: number;
  stats: CharacterStats;
  derivedStats: DerivedStats;
  
  // Resources
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  
  // Currency
  goldOnHand: number;
  goldBanked: number;
  
  // Character data
  race: Race;
  class: Class;
  alignment: number;
  position: Position;
  
  // Equipment & Inventory
  equipment: EquipmentSlots;
  inventory: Inventory;
  
  // Metadata
  playTime: number;
  lastActive: Date;
  createdAt: Date;
}

interface CharacterAppearance {
  gender: 'male' | 'female' | 'other';
  height: number;
  bodyType: number;
  skinColor: string;
  hairStyle: number;
  hairColor: string;
  faceType: number;
  facialHair?: number;
  scars?: number[];
  tattoos?: number[];
  accessories?: number[];
  displayMode: 'equipment' | 'costume' | 'mixed';
}
```

#### [P1-S2-3] Stats & Progression
```typescript
interface CharacterStats {
  // Primary
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  wisdom: number;
  luck: number;
  
  // Points to allocate
  unallocatedPoints: number;
}

interface DerivedStats {
  // Combat
  attackPower: number;
  magicPower: number;
  defense: number;
  magicDefense: number;
  accuracy: number;
  evasion: number;
  criticalChance: number;
  criticalDamage: number;
  attackSpeed: number;
  castSpeed: number;
  
  // Resistances
  resistances: ElementalResistances;
  
  // Resource regen
  healthRegen: number;
  manaRegen: number;
  staminaRegen: number;
  
  // Other
  movementSpeed: number;
  carryCapacity: number;
  goldFind: number;
  magicFind: number;
}
```

---

### [P1-S3] Items, Equipment & Inventory
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S2]

#### [P1-S3-1] Item System
```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ItemType;
  subType?: string;
  rarity: ItemRarity;
  level: number;
  requirements: ItemRequirements;
  
  // Stats
  baseStats?: ItemStats;
  randomStats?: RandomStatRange[];
  
  // Properties
  stackable: boolean;
  maxStack: number;
  bindType: 'none' | 'pickup' | 'equip' | 'account';
  
  // Durability
  maxDurability?: number;
  currentDurability?: number;
  repairCost?: number;
  
  // Economy
  vendorPrice: number;
  disenchantable: boolean;
  
  // Sockets
  sockets?: Socket[];
  maxSockets?: number;
}

interface Socket {
  id: number;
  type: 'red' | 'blue' | 'yellow' | 'prismatic';
  gem?: Gem;
}
```

#### [P1-S3-2] Equipment Service
```typescript
interface EquipmentService {
  equip(characterId: string, itemId: string, slot?: EquipmentSlot): Promise<EquipResult>;
  unequip(characterId: string, slot: EquipmentSlot): Promise<void>;
  
  // Set bonuses
  checkSetBonuses(character: Character): SetBonus[];
  
  // Durability
  damageEquipment(characterId: string, damagePercent: number): Promise<void>;
  repairItem(characterId: string, itemId: string): Promise<RepairResult>;
  repairAll(characterId: string): Promise<RepairResult>;
  
  // Comparison
  compareItems(item1: Item, item2: Item, character: Character): ItemComparison;
}

enum EquipmentSlot {
  HEAD = 'head',
  SHOULDERS = 'shoulders',
  CHEST = 'chest',
  HANDS = 'hands',
  WAIST = 'waist',
  LEGS = 'legs',
  FEET = 'feet',
  MAIN_HAND = 'mainHand',
  OFF_HAND = 'offHand',
  NECK = 'neck',
  RING_1 = 'ring1',
  RING_2 = 'ring2',
  TRINKET_1 = 'trinket1',
  TRINKET_2 = 'trinket2',
  BACK = 'back'
}
```

#### [P1-S3-3] Inventory Management
```typescript
interface InventoryService {
  // Basic operations
  addItem(characterId: string, item: Item, quantity?: number): Promise<AddItemResult>;
  removeItem(characterId: string, itemId: string, quantity?: number): Promise<void>;
  moveItem(characterId: string, fromSlot: number, toSlot: number): Promise<void>;
  
  // Inventory expansion
  expandInventory(characterId: string, slots: number): Promise<void>;
  
  // Special operations
  splitStack(characterId: string, itemId: string, amount: number): Promise<void>;
  sortInventory(characterId: string, sortType: SortType): Promise<void>;
  quickDeposit(characterId: string, category: ItemCategory): Promise<void>;
  
  // Filters
  searchInventory(characterId: string, query: string): Promise<Item[]>;
  filterInventory(characterId: string, filters: InventoryFilter): Promise<Item[]>;
}
```

---

### [P1-S4] Combat System & Mechanics
**Duration**: 2.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S3]

#### [P1-S4-1] Core Combat Engine
```typescript
interface CombatService {
  // Combat initiation
  startCombat(participants: CombatParticipant[]): Promise<CombatSession>;
  
  // Actions
  performAttack(sessionId: string, attackerId: string, targetId: string): Promise<AttackResult>;
  useSkill(sessionId: string, casterId: string, skillId: string, targets: string[]): Promise<SkillResult>;
  defend(sessionId: string, defenderId: string): Promise<void>;
  flee(sessionId: string, fleerId: string): Promise<FleeResult>;
  
  // Calculations
  calculateDamage(attacker: CombatEntity, defender: CombatEntity, skill?: Skill): DamageCalculation;
  calculateHitChance(accuracy: number, evasion: number, level: number): number;
  calculateCritical(critChance: number, critResist: number): CriticalResult;
  calculateMitigation(damage: number, defense: number, damageType: DamageType): number;
  
  // Advanced mechanics
  checkDodge(defender: CombatEntity): boolean;
  checkBlock(defender: CombatEntity): BlockResult;
  checkParry(defender: CombatEntity): boolean;
  applyResistances(damage: number, damageType: DamageType, resistances: Resistances): number;
}

interface DamageCalculation {
  baseDamage: number;
  damageType: DamageType;
  criticalMultiplier?: number;
  resistanceReduction: number;
  armorReduction: number;
  finalDamage: number;
  overkill?: number;
}
```

#### [P1-S4-2] Skill System
```typescript
interface SkillService {
  // Learning & progression
  learnSkill(characterId: string, skillId: string): Promise<void>;
  upgradeSkill(characterId: string, skillId: string): Promise<void>;
  
  // Skill usage
  canUseSkill(character: Character, skill: Skill, target?: CombatEntity): SkillCheck;
  consumeResources(character: Character, skill: Skill): Promise<void>;
  applyCooldown(characterId: string, skillId: string): Promise<void>;
  
  // Skill trees
  getSkillTree(classId: string): SkillTree;
  resetSkills(characterId: string): Promise<ResetResult>;
  saveSkillBuild(characterId: string, name: string): Promise<void>;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  type: 'active' | 'passive' | 'toggle';
  school: SkillSchool;
  
  // Requirements
  levelRequired: number;
  classRequired?: Class;
  prerequisiteSkills?: string[];
  
  // Costs
  manaCost?: number;
  staminaCost?: number;
  healthCost?: number;
  cooldown: number;
  globalCooldown: boolean;
  
  // Effects
  damageType?: DamageType;
  effects: SkillEffect[];
  
  // Targeting
  targetType: TargetType;
  range: number;
  areaOfEffect?: AreaOfEffect;
  maxTargets?: number;
}
```

#### [P1-S4-3] Buffs & Debuffs
```typescript
interface BuffDebuffService {
  apply(targetId: string, effect: StatusEffect, sourceId?: string): Promise<void>;
  remove(targetId: string, effectId: string): Promise<void>;
  removeAll(targetId: string, type?: 'buff' | 'debuff'): Promise<void>;
  
  // Dispels
  dispel(targetId: string, dispelType: DispelType, count: number): Promise<void>;
  
  // Stacking
  handleStacking(existing: StatusEffect, new: StatusEffect): StackResult;
  
  // Immunity
  applyImmunity(targetId: string, immunityType: string, duration: number): Promise<void>;
  
  // Periodic effects
  processTicks(): Promise<void>; // Called every server tick
}

interface StatusEffect {
  id: string;
  name: string;
  icon: string;
  type: 'buff' | 'debuff';
  
  // Duration
  duration: number; // -1 for permanent
  remaining: number;
  
  // Stacking
  stackable: boolean;
  currentStacks: number;
  maxStacks: number;
  
  // Effects
  statModifiers?: StatModifier[];
  periodicDamage?: PeriodicEffect;
  periodicHeal?: PeriodicEffect;
  
  // Special
  dispelType?: DispelType;
  immunities?: string[];
  breakOnDamage?: boolean;
}
```

---

### [P1-S5] NPCs & Basic AI
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S4]

#### [P1-S5-1] NPC System
```typescript
interface NPC {
  id: string;
  templateId: string;
  name: string;
  title?: string;
  level: number;
  
  // Combat stats
  stats: NPCStats;
  skills: NPCSkill[];
  
  // Behavior
  aiType: AIType;
  aggroRange: number;
  leashRange: number;
  behavior: NPCBehavior;
  
  // Loot
  lootTable: LootTable;
  experience: number;
  
  // Respawn
  respawnTime: number;
  spawnPoint: Position;
  
  // Interaction
  dialogues?: Dialogue[];
  quests?: string[];
  vendor?: VendorInventory;
}

interface NPCBehavior {
  aggressive: boolean;
  assistAllies: boolean;
  fleeAtHealth?: number;
  patrolPath?: Position[];
  preferredTargets?: TargetPreference[];
  specialMechanics?: Mechanic[];
}
```

#### [P1-S5-2] Basic AI Service
```typescript
interface AIService {
  // Decision making
  selectAction(npc: NPC, combatState: CombatState): NPCAction;
  selectTarget(npc: NPC, availableTargets: CombatEntity[]): CombatEntity;
  
  // Movement
  calculatePath(from: Position, to: Position, obstacles: Obstacle[]): Position[];
  handlePatrol(npc: NPC): Position;
  
  // Aggro system
  addThreat(npcId: string, targetId: string, threat: number): Promise<void>;
  getThreatList(npcId: string): Promise<ThreatEntry[]>;
  dropAggro(npcId: string, targetId?: string): Promise<void>;
  
  // Group coordination
  coordinateGroup(npcs: NPC[], target: CombatEntity): GroupStrategy;
}
```

---

### [P1-S6] Loot & Economy Foundation
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S5]

#### [P1-S6-1] Loot System
```typescript
interface LootService {
  // Generation
  generateLoot(source: LootSource, player: Character): Promise<LootResult>;
  rollItemRarity(magicFind: number): ItemRarity;
  generateRandomStats(item: Item, itemLevel: number): ItemStats;
  
  // Distribution
  distributeLoot(loot: LootResult, recipients: Character[]): Promise<void>;
  
  // Special loot
  rollBonusLoot(player: Character): Promise<Item[]>;
  generateQuestItem(questId: string): Promise<Item>;
}

interface LootTable {
  id: string;
  entries: LootEntry[];
  goldMin: number;
  goldMax: number;
  guaranteedDrops?: GuaranteedDrop[];
}

interface LootEntry {
  itemId?: string;
  itemCategory?: ItemCategory;
  dropChance: number;
  quantityMin: number;
  quantityMax: number;
  conditions?: LootCondition[];
}
```

#### [P1-S6-2] Shop System
```typescript
interface ShopService {
  // Basic vendors
  getShopInventory(shopId: string): Promise<ShopInventory>;
  buyItem(characterId: string, shopId: string, itemId: string, quantity: number): Promise<void>;
  sellItem(characterId: string, shopId: string, itemId: string, quantity: number): Promise<void>;
  buyback(characterId: string, buybackSlot: number): Promise<void>;
  
  // Dynamic pricing
  calculateBuyPrice(item: Item, shop: Shop, reputation?: number): number;
  calculateSellPrice(item: Item, shop: Shop): number;
  
  // Special vendors
  refreshLimitedStock(shopId: string): Promise<void>;
  checkReputation(characterId: string, faction: string): Promise<number>;
}

interface Shop {
  id: string;
  name: string;
  type: ShopType;
  location: Position;
  faction?: string;
  
  // Inventory
  items: ShopItem[];
  buybackSlots: BuybackSlot[];
  
  // Economics
  buyPriceModifier: number;
  sellPriceModifier: number;
  repairAvailable: boolean;
  
  // Restrictions
  levelRequired?: number;
  reputationRequired?: number;
}
```

#### [P1-S6-3] Consumables
```typescript
interface ConsumableService {
  useConsumable(characterId: string, itemId: string, targetId?: string): Promise<ConsumableResult>;
  checkCooldown(characterId: string, cooldownGroup: string): Promise<boolean>;
  
  // Potion types
  useHealthPotion(character: Character, potion: Potion): Promise<void>;
  useManaPotion(character: Character, potion: Potion): Promise<void>;
  useBuffPotion(character: Character, potion: Potion): Promise<void>;
  
  // Food & drink
  consumeFood(character: Character, food: Food): Promise<void>;
  applyWellFed(character: Character, bonus: WellFedBonus): Promise<void>;
}

interface Potion extends ConsumableItem {
  potionType: 'health' | 'mana' | 'stamina' | 'hybrid';
  instantValue?: number;
  overTimeValue?: number;
  overTimeDuration?: number;
  cooldownGroup: string;
}
```

---

### [P1-S7] Banking & Death System
**Duration**: 1 week  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S6]

#### [P1-S7-1] Banking Service
```typescript
interface BankingService {
  // Account operations
  getBalance(characterId: string): Promise<BankAccount>;
  deposit(characterId: string, amount: number): Promise<Transaction>;
  withdraw(characterId: string, amount: number): Promise<Transaction>;
  
  // Quick operations
  depositAll(characterId: string): Promise<Transaction>;
  withdrawAmount(characterId: string, amount: number): Promise<Transaction>;
  
  // Bank storage
  getBankSlots(characterId: string): Promise<BankSlot[]>;
  expandBankSlots(characterId: string, tabs: number): Promise<void>;
  depositItem(characterId: string, itemId: string, tab: number): Promise<void>;
  withdrawItem(characterId: string, slotId: string): Promise<void>;
  
  // Shared bank (account-wide)
  getSharedBank(accountId: string): Promise<SharedBank>;
}

interface BankAccount {
  characterId: string;
  gold: number;
  tabs: BankTab[];
  lastAccess: Date;
}
```

#### [P1-S7-2] Death & Respawn System
```typescript
interface DeathService {
  processDeath(victim: Character, killer?: CombatEntity): Promise<DeathResult>;
  
  calculatePenalty(character: Character): DeathPenalty {
    const penalty: DeathPenalty = {
      // Gold loss (unbanked only)
      goldLost: character.goldOnHand,
      
      // Experience loss (20% to next level)
      experienceLost: this.calculateExpLoss(character),
      
      // Durability damage
      durabilityLoss: 0.1, // 10% durability loss
      
      // Resurrection sickness
      debuff: this.getResurrectionSickness(character.level)
    };
    
    return penalty;
  }
  
  // Respawn options
  getRespawnOptions(character: Character): Promise<RespawnOption[]>;
  respawn(characterId: string, option: RespawnOption): Promise<void>;
  
  // Corpse system
  createCorpse(character: Character, location: Position): Promise<Corpse>;
  lootCorpse(characterId: string, corpseId: string): Promise<void>;
}
```

---

### [P1-S8] Zone System & World
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S5], [P1-S7]

#### [P1-S8-1] Zone Service
```typescript
interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  coordinates: ZoneCoordinates;
  
  // Access
  levelRequirement: number;
  levelRange: { min: number; max: number };
  requiredQuests?: string[];
  requiredItems?: string[];
  
  // Properties
  pvpEnabled: boolean;
  safeZone: boolean;
  instanceType?: InstanceType;
  
  // Content
  subZones: SubZone[];
  npcs: ZoneNPC[];
  resources: ResourceNode[];
  questGivers: QuestGiver[];
  vendors: Vendor[];
  
  // Travel
  flightPaths: FlightPath[];
  teleporters: Teleporter[];
  graveyards: Graveyard[];
  
  // Environment
  weather?: WeatherType;
  timeOfDay?: TimeOfDay;
  music?: string;
  ambientSounds?: string[];
}

interface ZoneService {
  // Movement
  enterZone(characterId: string, zoneId: string): Promise<ZoneTransition>;
  moveInZone(characterId: string, position: Position): Promise<MoveResult>;
  
  // Discovery
  discoverArea(characterId: string, areaId: string): Promise<DiscoveryReward>;
  exploreZone(characterId: string, zoneId: string): Promise<ExplorationProgress>;
  
  // Special zones
  enterOutworld(characterId: string): Promise<void>; // Level 15+
  enterInstance(characterId: string, instanceId: string): Promise<void>;
}
```

#### [P1-S8-2] Travel System
```typescript
interface TravelService {
  // Waypoints
  unlockWaypoint(characterId: string, waypointId: string): Promise<void>;
  getUnlockedWaypoints(characterId: string): Promise<Waypoint[]>;
  
  // Fast travel
  teleportToWaypoint(characterId: string, waypointId: string): Promise<void>;
  calculateTravelCost(from: Position, to: Position): number;
  
  // Flight paths
  startFlightPath(characterId: string, pathId: string): Promise<void>;
  skipFlightAnimation(characterId: string): Promise<void>;
  
  // Mounts (basic for Phase 1)
  summonMount(characterId: string, mountId: string): Promise<void>;
  dismissMount(characterId: string): Promise<void>;
  getMountSpeed(mount: Mount): number;
}
```

---

### [P1-S9] Chat & Communication
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S2]

#### [P1-S9-1] Complete Chat System
```typescript
interface ChatService {
  // Channel management
  joinChannel(characterId: string, channel: ChatChannel): Promise<void>;
  leaveChannel(characterId: string, channel: ChatChannel): Promise<void>;
  
  // Messages
  sendMessage(message: ChatMessage): Promise<void>;
  sendWhisper(from: string, to: string, message: string): Promise<void>;
  sendSystemMessage(message: SystemMessage): Promise<void>;
  
  // Channel types with rules
  validateMessage(channel: ChatChannel, message: string): ValidationResult;
  enforceTradeChannel(message: string): boolean;
  filterRaceChannel(sender: Character, recipients: Character[]): Character[];
  
  // History
  getMessageHistory(channel: ChatChannel, limit: number): Promise<ChatMessage[]>;
  getWhisperHistory(characterId: string, partnerId: string): Promise<WhisperMessage[]>;
  
  // Moderation
  reportMessage(reporterId: string, messageId: string, reason: string): Promise<void>;
  mutePlayer(modId: string, playerId: string, duration: number): Promise<void>;
  
  // Social features
  addIgnore(characterId: string, targetName: string): Promise<void>;
  removeIgnore(characterId: string, targetName: string): Promise<void>;
}

enum ChatChannel {
  GENERAL = 'general',
  TRADE = 'trade',      // Enforced trade only
  HELP = 'help',        // Newbie friendly
  RACE = 'race',        // Race/clan restricted
  ZONE = 'zone',        // Current zone only
  PARTY = 'party',      // Party members
  CLAN = 'clan',        // Clan members
  SYSTEM = 'system'     // System messages
}
```

#### [P1-S9-2] Emote System
```typescript
interface EmoteService {
  performEmote(characterId: string, emote: string, targetId?: string): Promise<void>;
  getAvailableEmotes(characterId: string): Promise<Emote[]>;
  unlockEmote(characterId: string, emoteId: string): Promise<void>;
  
  // Custom emotes
  createCustomEmote(characterId: string, text: string): Promise<void>;
  
  // Animated emotes
  playEmoteAnimation(characterId: string, animation: string): Promise<void>;
}
```

---

### [P1-S10] Social Systems
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S9]

#### [P1-S10-1] Friend System
```typescript
interface FriendService {
  // Friend management
  sendFriendRequest(fromId: string, toName: string): Promise<void>;
  acceptFriendRequest(characterId: string, requestId: string): Promise<void>;
  declineFriendRequest(characterId: string, requestId: string): Promise<void>;
  removeFriend(characterId: string, friendId: string): Promise<void>;
  
  // Friend list
  getFriendList(characterId: string): Promise<Friend[]>;
  getFriendStatus(friendId: string): Promise<FriendStatus>;
  
  // Notifications
  notifyFriendOnline(friendId: string): Promise<void>;
  notifyFriendOffline(friendId: string): Promise<void>;
}

interface Friend {
  characterId: string;
  name: string;
  level: number;
  class: Class;
  online: boolean;
  location?: string;
  lastSeen?: Date;
  note?: string;
}
```

#### [P1-S10-2] Player Search & Inspection
```typescript
interface PlayerSearchService {
  searchPlayers(query: string, filters?: SearchFilters): Promise<PlayerSearchResult[]>;
  inspectCharacter(characterId: string): Promise<CharacterInspection>;
  compareCharacters(char1: string, char2: string): Promise<Comparison>;
  
  // Who list
  getOnlinePlayers(filters?: WhoFilters): Promise<WhoListEntry[]>;
  
  // Profiles
  getPlayerProfile(characterId: string): Promise<PlayerProfile>;
  updateProfile(characterId: string, profile: ProfileUpdate): Promise<void>;
}

interface CharacterInspection {
  character: Character;
  equipment: EquipmentSlots;
  achievements: Achievement[];
  titles: Title[];
  pvpStats: PvPStats;
  guildInfo?: GuildInfo;
}
```

---

### [P1-S11] Tutorial & Help
**Duration**: 1 week  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S10]

#### [P1-S11-1] Tutorial System
```typescript
interface TutorialService {
  // Tutorial flow
  startTutorial(characterId: string): Promise<void>;
  nextStep(characterId: string): Promise<TutorialStep>;
  completeStep(characterId: string, stepId: string): Promise<StepReward>;
  skipTutorial(characterId: string): Promise<void>;
  
  // Contextual hints
  showHint(characterId: string, context: string): Promise<void>;
  dismissHint(characterId: string, hintId: string): Promise<void>;
  
  // Progress tracking
  getTutorialProgress(characterId: string): Promise<TutorialProgress>;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  objectives: TutorialObjective[];
  highlightElements?: string[];
  restrictedActions?: string[];
  reward?: StepReward;
}
```

#### [P1-S11-2] Help System
```typescript
interface HelpService {
  // Help articles
  searchHelp(query: string): Promise<HelpArticle[]>;
  getArticle(articleId: string): Promise<HelpArticle>;
  getContextualHelp(context: string): Promise<HelpArticle[]>;
  
  // Interactive help
  startGuidedHelp(topic: string): Promise<GuidedHelp>;
  
  // FAQ
  getFAQ(category?: string): Promise<FAQ[]>;
  
  // Video tutorials
  getVideoTutorials(topic?: string): Promise<VideoTutorial[]>;
}
```

---

### [P1-S12] Settings & UI
**Duration**: 1 week  
**Lead Agent**: Replit Agent  
**Dependencies**: [P1-S2]

#### [P1-S12-1] Settings Management
```typescript
interface SettingsService {
  // Character settings
  saveCharacterSettings(characterId: string, settings: CharacterSettings): Promise<void>;
  loadCharacterSettings(characterId: string): Promise<CharacterSettings>;
  
  // Account settings
  saveAccountSettings(accountId: string, settings: AccountSettings): Promise<void>;
  loadAccountSettings(accountId: string): Promise<AccountSettings>;
  
  // Presets
  saveSettingsPreset(name: string, settings: Settings): Promise<void>;
  loadSettingsPreset(name: string): Promise<Settings>;
}

interface CharacterSettings {
  // Gameplay
  autoLoot: boolean;
  autoLootFilters: LootFilter[];
  showHelm: boolean;
  showCloak: boolean;
  acceptResurrection: 'always' | 'party' | 'friends' | 'prompt';
  
  // Combat
  showDamageNumbers: boolean;
  showHealing: boolean;
  targetOfTarget: boolean;
  autoAttack: boolean;
  
  // UI
  actionBars: ActionBarSetup[];
  minimapSettings: MinimapSettings;
  chatSettings: ChatSettings;
  nameplateSettings: NameplateSettings;
  
  // Keybindings
  keybindings: Record<string, Keybind>;
  
  // Notifications
  notifications: NotificationSettings;
}
```

---

### [P1-S13] Admin & Moderation
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → ChatGPT  
**Dependencies**: [P1-S9], [P1-S10]

#### [P1-S13-1] Moderation Tools
```typescript
interface ModerationService {
  // Player actions
  warnPlayer(modId: string, playerId: string, reason: string): Promise<void>;
  mutePlayer(modId: string, playerId: string, duration: number, reason: string): Promise<void>;
  kickPlayer(modId: string, playerId: string, reason: string): Promise<void>;
  banPlayer(modId: string, playerId: string, duration: number, reason: string): Promise<void>;
  
  // Investigation
  getPlayerHistory(playerId: string): Promise<PlayerHistory>;
  getChatLogs(filters: LogFilters): Promise<ChatLog[]>;
  getTradeHistory(playerId: string): Promise<TradeLog[]>;
  
  // Reports
  getReportQueue(): Promise<Report[]>;
  investigateReport(modId: string, reportId: string): Promise<Investigation>;
  resolveReport(modId: string, reportId: string, action: ReportAction): Promise<void>;
  
  // Monitoring
  watchPlayer(modId: string, playerId: string): Promise<void>;
  flagSuspiciousActivity(activity: SuspiciousActivity): Promise<void>;
}

interface ModeratorRoles {
  HELPER = 1,        // Can answer questions
  MODERATOR = 2,     // Can mute/kick
  SENIOR_MOD = 3,    // Can temp ban
  ADMIN = 4,         // Full access
  DEVELOPER = 5      // System access
}
```

#### [P1-S13-2] Customer Support Tools
```typescript
interface SupportService {
  // Ticket system
  createTicket(playerId: string, issue: SupportTicket): Promise<string>;
  respondToTicket(supportId: string, ticketId: string, response: string): Promise<void>;
  escalateTicket(ticketId: string, reason: string): Promise<void>;
  
  // Account recovery
  verifyAccountOwnership(request: RecoveryRequest): Promise<boolean>;
  resetAccountAccess(accountId: string): Promise<void>;
  
  // Compensation
  compensatePlayer(playerId: string, compensation: Compensation): Promise<void>;
  restoreDeletedItem(playerId: string, itemId: string): Promise<void>;
  
  // Tools
  teleportToPlayer(supportId: string, playerId: string): Promise<void>;
  viewPlayerScreen(supportId: string, playerId: string): Promise<void>;
}
```

---

### [P1-S14] Infrastructure & Anti-Cheat
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → ChatGPT  
**Dependencies**: [P1-S13]

#### [P1-S14-1] Anti-Cheat System
```typescript
interface AntiCheatService {
  // Movement validation
  validateMovement(before: Position, after: Position, timeDelta: number, stats: MovementStats): ValidationResult;
  detectSpeedHacks(playerId: string, movements: Movement[]): boolean;
  detectTeleportHacks(playerId: string, position: Position): boolean;
  
  // Combat validation
  validateDamage(damage: DamageEvent): boolean;
  validateAttackSpeed(playerId: string, attacks: Attack[]): boolean;
  detectAimbots(playerId: string, accuracy: number): boolean;
  
  // Economy validation
  validateTransaction(transaction: Transaction): boolean;
  detectDuplication(itemId: string): boolean;
  trackWealthGrowth(playerId: string): WealthAnalysis;
  
  // Pattern detection
  analyzePlayerBehavior(playerId: string): BehaviorAnalysis;
  detectBottingPatterns(playerId: string): BottingScore;
  detectMultiboxing(accounts: string[]): MultiboxAnalysis;
  
  // Actions
  flagPlayer(playerId: string, reason: string, severity: number): Promise<void>;
  quarantineItems(playerId: string, itemIds: string[]): Promise<void>;
  shadowBan(playerId: string): Promise<void>;
}
```

#### [P1-S14-2] Performance Monitoring
```typescript
interface PerformanceService {
  // Server metrics
  trackServerLoad(): ServerMetrics;
  trackDatabasePerformance(): DatabaseMetrics;
  trackAPILatency(endpoint: string, latency: number): void;
  
  // Player metrics
  trackClientPerformance(playerId: string, metrics: ClientMetrics): void;
  detectLagSpikes(playerId: string): LagAnalysis;
  
  // Optimization
  identifyBottlenecks(): Bottleneck[];
  suggestOptimizations(): Optimization[];
  
  // Alerts
  setPerformanceAlert(metric: string, threshold: number): void;
  getActiveAlerts(): Alert[];
}
```

---

### [P1-S15] Leaderboards & Rankings
**Duration**: 1 week  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P1-S2]

#### [P1-S15-1] Leaderboard Service
```typescript
interface LeaderboardService {
  // Updates
  updateLeaderboard(type: LeaderboardType, entry: LeaderboardEntry): Promise<void>;
  recalculateLeaderboards(): Promise<void>;
  
  // Queries
  getLeaderboard(type: LeaderboardType, page: number, filters?: LeaderboardFilters): Promise<LeaderboardPage>;
  getPlayerRank(playerId: string, type: LeaderboardType): Promise<RankInfo>;
  getPlayerRankings(playerId: string): Promise<PlayerRankings>;
  
  // Historical
  getSeasonLeaderboard(season: number, type: LeaderboardType): Promise<LeaderboardPage>;
  archiveLeaderboards(season: number): Promise<void>;
}

enum LeaderboardType {
  // Character
  LEVEL = 'level',
  TOTAL_XP = 'total_xp',
  ACHIEVEMENT_POINTS = 'achievement_points',
  
  // PvP
  PVP_KILLS = 'pvp_kills',
  PVP_RATING = 'pvp_rating',
  ARENA_RATING = 'arena_rating',
  
  // PvE
  BOSS_KILLS = 'boss_kills',
  DUNGEON_CLEARS = 'dungeon_clears',
  SPEED_RUNS = 'speed_runs',
  
  // Economy
  WEALTH = 'wealth',
  ITEMS_CRAFTED = 'items_crafted',
  AUCTIONS_WON = 'auctions_won',
  
  // Social
  GUILD_POWER = 'guild_power',
  REPUTATION = 'reputation',
  PLAYTIME = 'playtime'
}
```

---

## Phase 2: Alpha - Advanced Systems (3-4 months)

### [P2-S1] Party System
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: Phase 1 Complete

#### [P2-S1-1] Party Management
```typescript
interface PartyService {
  // Formation
  createParty(leaderId: string, type: PartyType): Promise<Party>;
  inviteToParty(leaderId: string, targetId: string): Promise<void>;
  acceptInvite(playerId: string, inviteId: string): Promise<void>;
  leaveParty(playerId: string): Promise<void>;
  disbandParty(leaderId: string): Promise<void>;
  
  // Leadership
  promoteToLeader(currentLeaderId: string, newLeaderId: string): Promise<void>;
  setLootMaster(leaderId: string, masterId: string): Promise<void>;
  
  // Settings
  setLootRules(leaderId: string, rules: LootRules): Promise<void>;
  setDifficulty(leaderId: string, difficulty: Difficulty): Promise<void>;
  
  // Coordination
  setReadyCheck(leaderId: string): Promise<ReadyCheckResult>;
  markTarget(memberId: string, targetId: string, mark: RaidMark): Promise<void>;
  
  // Conversion
  convertToRaid(leaderId: string): Promise<Raid>;
}

interface Party {
  id: string;
  type: 'party' | 'raid';
  leaderId: string;
  members: PartyMember[];
  maxSize: number; // 5 for party, 20 for raid
  
  // Settings
  lootRules: LootRules;
  difficulty: Difficulty;
  
  // State
  inCombat: boolean;
  location: Zone;
  objective?: string;
}
```

---

### [P2-S2] Quest System
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S1]

#### [P2-S2-1] Quest Service
```typescript
interface QuestService {
  // Quest management
  getAvailableQuests(character: Character): Promise<Quest[]>;
  acceptQuest(characterId: string, questId: string): Promise<void>;
  abandonQuest(characterId: string, questId: string): Promise<void>;
  
  // Progress tracking
  updateQuestProgress(characterId: string, event: QuestEvent): Promise<QuestProgress[]>;
  completeObjective(characterId: string, questId: string, objectiveId: string): Promise<void>;
  
  // Turn in
  canCompleteQuest(characterId: string, questId: string): Promise<boolean>;
  completeQuest(characterId: string, questId: string, rewardChoice?: number): Promise<QuestReward>;
  
  // Quest chains
  getQuestChain(questId: string): Promise<QuestChain>;
  unlockNextQuest(characterId: string, chainId: string): Promise<Quest>;
  
  // Daily/Weekly
  getDailyQuests(characterId: string): Promise<Quest[]>;
  getWeeklyQuests(characterId: string): Promise<Quest[]>;
  resetDailyQuests(): Promise<void>;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  level: number;
  
  // Requirements
  prerequisites: QuestPrerequisite[];
  levelRequired: number;
  classRestrictions?: Class[];
  raceRestrictions?: Race[];
  
  // Objectives
  objectives: QuestObjective[];
  bonusObjectives?: QuestObjective[];
  
  // Rewards
  experience: number;
  gold: number;
  items?: QuestItemReward[];
  reputation?: ReputationReward[];
  
  // Metadata
  category: QuestCategory;
  repeatable: boolean;
  shareable: boolean;
  timeLimit?: number;
}
```

---

### [P2-S3] PvP & Combat Systems
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S1]

#### [P2-S3-1] PvP Service
```typescript
interface PvPService {
  // Combat
  initiatePvP(attackerId: string, targetId: string): Promise<PvPSession>;
  
  // Kill tracking
  recordKill(killerId: string, victimId: string, context: KillContext): Promise<void>;
  
  // PK restrictions
  checkPKCooldown(playerId: string): Promise<PKStatus>;
  enforcePKLimit(playerId: string): Promise<void>; // 6 kills/hour max
  
  // Honor system
  calculateHonor(killer: Character, victim: Character): number;
  awardHonor(playerId: string, honor: number): Promise<void>;
  
  // Bounties
  placeBounty(placerId: string, targetId: string, amount: number): Promise<void>;
  claimBounty(hunterId: string, targetId: string): Promise<number>;
  
  // PK Tags
  setPKTag(playerId: string, tag: string): Promise<void>; // :pk: replacement
  
  // War mode
  toggleWarMode(playerId: string): Promise<void>;
}

interface PKStatus {
  canAttack: boolean;
  cooldownRemaining: number; // 10 min between kills
  killsThisHour: number;     // Max 6
  nextKillAvailable: Date;
}
```

#### [P2-S3-2] Alignment System
```typescript
interface AlignmentService {
  // Core alignment
  adjustAlignment(characterId: string, change: number, reason: string): Promise<number>;
  calculateAlignmentChange(killer: Character, victim: Character): number;
  
  // Consequences
  getAlignmentPenalties(alignment: number): AlignmentPenalties;
  getAlignmentBonuses(alignment: number): AlignmentBonuses;
  
  // Visual indicators
  getAlignmentColor(alignment: number): string; // Red for evil, blue for good
  getAlignmentTitle(alignment: number): string;
  
  // Redemption/Corruption
  visitTemple(characterId: string, templeType: TempleType): Promise<AlignmentChange>;
  performRitual(characterId: string, ritual: AlignmentRitual): Promise<void>;
}

const ALIGNMENT_RANGES = {
  PURE_EVIL: { min: -1000, max: -667 },
  EVIL: { min: -666, max: -334 },
  NEUTRAL: { min: -333, max: 333 },
  GOOD: { min: 334, max: 666 },
  PURE_GOOD: { min: 667, max: 1000 }
};
```

---

### [P2-S4] Trading & Auction House
**Duration**: 2.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S3]

#### [P2-S4-1] Direct Trading
```typescript
interface TradingService {
  // Trade initiation
  initiateTrade(fromId: string, toId: string): Promise<TradeSession>;
  cancelTrade(sessionId: string, playerId: string): Promise<void>;
  
  // Trade contents
  addGold(sessionId: string, playerId: string, amount: number): Promise<void>;
  addItem(sessionId: string, playerId: string, itemId: string): Promise<void>;
  removeGold(sessionId: string, playerId: string): Promise<void>;
  removeItem(sessionId: string, playerId: string, itemId: string): Promise<void>;
  
  // Confirmation
  lockTrade(sessionId: string, playerId: string): Promise<void>;
  unlockTrade(sessionId: string, playerId: string): Promise<void>;
  confirmTrade(sessionId: string, playerId: string): Promise<void>;
  
  // Completion
  executeTrade(sessionId: string): Promise<TradeResult>;
  
  // History
  getTradeHistory(playerId: string, days: number): Promise<Trade[]>;
  getTradeDetails(tradeId: string): Promise<TradeDetails>;
}
```

#### [P2-S4-2] Auction House
```typescript
interface AuctionHouseService {
  // Listing items
  createAuction(auction: CreateAuctionDTO): Promise<Auction>;
  cancelAuction(sellerId: string, auctionId: string): Promise<void>;
  
  // Bidding
  placeBid(bidderId: string, auctionId: string, amount: number): Promise<void>;
  buyout(buyerId: string, auctionId: string): Promise<void>;
  
  // Searching
  searchAuctions(filters: AuctionFilters): Promise<AuctionSearchResult>;
  getAuctionDetails(auctionId: string): Promise<AuctionDetails>;
  getMyAuctions(playerId: string): Promise<Auction[]>;
  getMyBids(playerId: string): Promise<Bid[]>;
  
  // Completion
  processExpiredAuctions(): Promise<void>;
  collectMail(playerId: string, mailId: string): Promise<void>;
  
  // Market data
  getPriceHistory(itemId: string, days: number): Promise<PriceHistory>;
  getMarketTrends(): Promise<MarketTrends>;
  
  // Fees (gold sink)
  calculateListingFee(price: number, duration: number): number;
  calculateCommission(salePrice: number): number;
}

interface Auction {
  id: string;
  sellerId: string;
  item: Item;
  quantity: number;
  
  // Pricing
  startingBid: number;
  currentBid?: number;
  buyoutPrice?: number;
  
  // Bidding
  bidderId?: string;
  bidHistory: Bid[];
  
  // Time
  duration: number; // 12, 24, 48 hours
  expiresAt: Date;
}
```

---

### [P2-S5] Mail System
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S4]

#### [P2-S5-1] Mail Service
```typescript
interface MailService {
  // Sending
  sendMail(mail: SendMailDTO): Promise<void>;
  sendSystemMail(recipientId: string, template: MailTemplate, data: any): Promise<void>;
  
  // Receiving
  getInbox(characterId: string): Promise<Mail[]>;
  getMail(mailId: string): Promise<MailDetails>;
  markAsRead(mailId: string): Promise<void>;
  
  // Attachments
  takeAttachments(mailId: string): Promise<void>;
  returnMail(mailId: string): Promise<void>;
  
  // Management
  deleteMail(mailId: string): Promise<void>;
  deleteAllMail(characterId: string, filter?: MailFilter): Promise<void>;
  
  // COD (Cash on Delivery)
  payCOD(mailId: string): Promise<void>;
  
  // Expiration
  processExpiredMail(): Promise<void>;
}

interface Mail {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  
  // Content
  subject: string;
  body: string;
  
  // Attachments
  attachedGold?: number;
  attachedItems?: MailItem[];
  cod?: number; // Cash on delivery
  
  // Status
  read: boolean;
  attachmentsTaken: boolean;
  sentAt: Date;
  expiresAt: Date; // 30 days
}
```

---

### [P2-S6] Reincarnation System
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S3]

#### [P2-S6-1] Reincarnation Service
```typescript
interface ReincarnationService {
  // Requirements check
  canReincarnate(character: Character): Promise<ReincarnationCheck>;
  getAvailableRaces(character: Character): Promise<Race[]>;
  getAvailableClasses(character: Character): Promise<Class[]>;
  
  // Process
  startReincarnation(characterId: string): Promise<ReincarnationSession>;
  selectNewRace(sessionId: string, race: Race): Promise<void>;
  selectNewClass(sessionId: string, class: Class): Promise<void>;
  confirmReincarnation(sessionId: string): Promise<Character>;
  
  // Special races
  unlockSpecialRace(characterId: string, race: Race): Promise<void>;
  
  // History
  getReincarnationHistory(characterId: string): Promise<Reincarnation[]>;
}

interface ReincarnationRequirements {
  location: 'Royal University (1,2)';
  goldCost: 100000;
  keepItems: true;
  keepGold: true;
  resetStats: true;
  resetSkills: true;
  
  // Special race requirements
  specialRaces: {
    'Balrog': { level: 500, alignment: 'evil' },
    'Flame Demon': { level: 400, alignment: 'evil' },
    'Genie': { level: 450, alignment: 'neutral' },
    'Angel': { level: 500, alignment: 'good' }
  };
}
```

---

### [P2-S7] Daily Activities & Rewards
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S2]

#### [P2-S7-1] Daily System
```typescript
interface DailyActivityService {
  // Login rewards
  claimDailyReward(characterId: string): Promise<DailyReward>;
  getDailyStreak(characterId: string): Promise<number>;
  
  // Daily quests
  getDailyQuests(characterId: string): Promise<Quest[]>;
  refreshDailyQuests(characterId: string): Promise<void>;
  
  // Weekly activities
  getWeeklyActivities(characterId: string): Promise<WeeklyActivity[]>;
  completeActivity(characterId: string, activityId: string): Promise<void>;
  
  // Bonus events
  getActiveEvents(): Promise<BonusEvent[]>;
  getEventProgress(characterId: string, eventId: string): Promise<EventProgress>;
  
  // Reset timers
  getDailyReset(): Date;
  getWeeklyReset(): Date;
}

interface DailyReward {
  day: number;
  gold: number;
  items?: Item[];
  experience?: number;
  specialReward?: SpecialReward;
}
```

---

### [P2-S8] Expanded Zones & Content
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P2-S6]

#### [P2-S8-1] Advanced Zones
```typescript
interface AdvancedZoneService {
  // Temple system
  enterTemple(characterId: string, templeId: string): Promise<void>;
  makeOffering(characterId: string, offering: Offering): Promise<AlignmentChange>;
  receiveBlessing(characterId: string, blessing: Blessing): Promise<void>;
  
  // Race-specific zones
  checkRaceAccess(character: Character, zone: Zone): boolean;
  getRaceQuests(race: Race, zone: Zone): Promise<Quest[]>;
  
  // Dynamic events
  triggerZoneEvent(zoneId: string, event: ZoneEvent): Promise<void>;
  participateInEvent(characterId: string, eventId: string): Promise<void>;
  
  // World bosses
  spawnWorldBoss(bossId: string, location: Position): Promise<void>;
  getWorldBossStatus(bossId: string): Promise<WorldBossStatus>;
}

interface Temple {
  id: string;
  name: string;
  deity: string;
  alignment: 'good' | 'evil' | 'neutral';
  location: Zone;
  
  // Services
  blessings: Blessing[];
  rituals: Ritual[];
  quests: Quest[];
  
  // Requirements
  minOffering: number;
  reputationRequired?: number;
}
```

---

## Phase 3: Beta - Advanced Features (4-6 months)

### [P3-S1] Achievement System
**Duration**: 1.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: Phase 2 Complete

#### [P3-S1-1] Achievement Service
```typescript
interface AchievementService {
  // Progress tracking
  trackProgress(playerId: string, event: AchievementEvent): Promise<void>;
  checkCompletion(playerId: string, achievementId: string): Promise<boolean>;
  
  // Rewards
  unlockAchievement(playerId: string, achievementId: string): Promise<AchievementReward>;
  claimReward(playerId: string, achievementId: string): Promise<void>;
  
  // Categories
  getCategories(): Promise<AchievementCategory[]>;
  getCategoryProgress(playerId: string, categoryId: string): Promise<CategoryProgress>;
  
  // Leaderboards
  getAchievementLeaderboard(): Promise<AchievementLeader[]>;
  compareAchievements(player1: string, player2: string): Promise<Comparison>;
  
  // Meta achievements
  checkMetaAchievements(playerId: string): Promise<Achievement[]>;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Requirements
  criteria: AchievementCriteria[];
  
  // Rewards
  points: number;
  title?: string;
  items?: Item[];
  
  // Properties
  hidden: boolean;
  accountWide: boolean;
  
  // Progress tracking
  progressBar?: boolean;
  showProgress?: boolean;
}
```

---

### [P3-S2] Gems & Enchanting
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P3-S1]

#### [P3-S2-1] Gem System
```typescript
interface GemService {
  // Socket management
  socketGem(itemId: string, gem: Gem, socketIndex: number): Promise<void>;
  removeGem(itemId: string, socketIndex: number): Promise<Gem>;
  addSocket(itemId: string): Promise<void>; // Special item required
  
  // Gem creation
  createGem(type: GemType, quality: number): Gem;
  findGem(source: GemSource): Promise<Gem[]>;
  
  // Basic fusion
  fuseGems(gems: Gem[]): Promise<Gem>;
  
  // Properties
  getGemBonus(gem: Gem, itemType: ItemType): StatBonus;
  getSocketBonus(item: Item): StatBonus;
}

interface Gem {
  id: string;
  name: string;
  type: GemType;
  quality: number; // 1-5
  
  // Bonuses
  primaryBonus: StatBonus;
  secondaryBonus?: StatBonus;
  
  // Restrictions
  uniqueEquipped?: boolean;
  itemTypeRestriction?: ItemType[];
}
```

#### [P3-S2-2] Enchanting System
```typescript
interface EnchantingService {
  // Enchanting
  enchantItem(itemId: string, enchant: Enchant): Promise<EnchantResult>;
  removeEnchant(itemId: string): Promise<void>;
  
  // Learning
  learnEnchant(characterId: string, enchantId: string): Promise<void>;
  getKnownEnchants(characterId: string): Promise<Enchant[]>;
  
  // Materials
  disenchantItem(itemId: string): Promise<EnchantMaterial[]>;
  getMaterialRequirements(enchant: Enchant): Material[];
  
  // Special enchants
  applyRuneforge(itemId: string, rune: Rune): Promise<void>;
  imbueWeapon(itemId: string, imbue: Imbue): Promise<void>;
}
```

---

### [P3-S3] Crafting System
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P3-S2]

#### [P3-S3-1] Crafting Service
```typescript
interface CraftingService {
  // Professions
  learnProfession(characterId: string, profession: Profession): Promise<void>;
  abandonProfession(characterId: string, profession: Profession): Promise<void>;
  
  // Recipes
  learnRecipe(characterId: string, recipeId: string): Promise<void>;
  getKnownRecipes(characterId: string, profession: Profession): Promise<Recipe[]>;
  
  // Crafting
  craftItem(characterId: string, recipeId: string, quantity: number): Promise<CraftResult>;
  getCraftingQueue(characterId: string): Promise<CraftingQueue>;
  
  // Skill progression
  gainSkillPoint(characterId: string, profession: Profession): Promise<void>;
  getSkillLevel(characterId: string, profession: Profession): Promise<number>;
  
  // Specializations
  chooseSpecialization(characterId: string, spec: Specialization): Promise<void>;
  
  // Gathering
  gatherResource(characterId: string, nodeId: string): Promise<GatherResult>;
}

interface Profession {
  id: string;
  name: string;
  type: 'crafting' | 'gathering';
  maxSkill: number;
  
  // Recipes
  recipes: Recipe[];
  
  // Specializations
  specializations?: Specialization[];
  
  // Tools required
  requiredTools?: Item[];
}
```

---

### [P3-S4] Clan System
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P3-S3]

#### [P3-S4-1] Clan Service
```typescript
interface ClanService {
  // Creation
  createClan(leaderId: string, name: string, tag: string): Promise<Clan>;
  disbandClan(leaderId: string): Promise<void>;
  
  // Membership
  invitePlayer(officerId: string, playerName: string): Promise<void>;
  acceptInvite(playerId: string, clanId: string): Promise<void>;
  leaveClan(playerId: string): Promise<void>;
  kickMember(officerId: string, memberId: string): Promise<void>;
  
  // Hierarchy
  promoteMember(leaderId: string, memberId: string, rank: ClanRank): Promise<void>;
  demoteMember(leaderId: string, memberId: string): Promise<void>;
  transferLeadership(leaderId: string, newLeaderId: string): Promise<void>;
  
  // Features
  depositToBank(memberId: string, amount: number): Promise<void>;
  withdrawFromBank(officerId: string, amount: number): Promise<void>;
  
  // Progression
  earnClanXP(clanId: string, amount: number): Promise<void>;
  levelUpClan(clanId: string): Promise<ClanLevel>;
  
  // Perks
  purchasePerk(leaderId: string, perkId: string): Promise<void>;
  activatePerk(officerId: string, perkId: string): Promise<void>;
}

interface Clan {
  id: string;
  name: string;
  tag: string; // 2-5 characters
  leaderId: string;
  
  // Requirements
  creationCost: 10000000; // 10M gold
  leaderLevelRequired: 300;
  memberLevelRequired: 100;
  joinCost: 2000000; // 2M (1M to player, 1M to clan)
  
  // Members
  members: ClanMember[];
  maxMembers: number;
  
  // Resources
  treasury: number;
  bank: ClanBank;
  
  // Progression
  level: number;
  experience: number;
  perks: ClanPerk[];
  
  // Politics
  allies: string[];
  enemies: string[];
}
```

---

### [P3-S5] Kingdom System
**Duration**: 4 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P3-S4]

#### [P3-S5-1] Kingdom Service
```typescript
interface KingdomService {
  // Settlement
  settleKingdom(clanId: string, location: KingdomLocation): Promise<Kingdom>;
  relocateKingdom(leaderId: string, newLocation: KingdomLocation): Promise<void>;
  abandonKingdom(leaderId: string): Promise<void>;
  
  // Construction
  buildStructure(kingdomId: string, structure: Structure): Promise<void>;
  upgradeStructure(structureId: string): Promise<void>;
  demolishStructure(leaderId: string, structureId: string): Promise<void>;
  
  // Management
  setTaxRate(leaderId: string, rate: number): Promise<void>; // Min 5% for mines
  collectTaxes(kingdomId: string): Promise<TaxCollection>;
  assignWorkers(leaderId: string, structureId: string, workers: number): Promise<void>;
  
  // Defense
  buildDefenses(kingdomId: string, defense: Defense): Promise<void>;
  stationGuards(kingdomId: string, guards: Guard[]): Promise<void>;
  activateShield(leaderId: string): Promise<void>; // Temporary protection
  
  // Resources
  harvestResources(kingdomId: string): Promise<ResourceHarvest>;
  processGems(kingdomId: string): Promise<Gem[]>; // From mines
  
  // Warfare
  declareWar(attackerId: string, defenderId: string): Promise<War>;
  siegeKingdom(warId: string, attackers: Character[]): Promise<SiegeResult>;
  defendKingdom(warId: string, defenders: Character[]): Promise<DefenseResult>;
}

interface Kingdom {
  id: string;
  clanId: string;
  name: string;
  location: KingdomLocation;
  
  // Structures
  structures: Structure[];
  maxStructures: number;
  
  // Resources
  treasury: number;
  resources: ResourceStorage;
  
  // Defense
  walls: WallLevel;
  defenses: Defense[];
  garrison: Garrison;
  
  // Production
  taxRate: number; // 5-25%
  mineProduction: GemProduction;
  
  // Politics
  allies: string[];
  vassals: string[];
  wars: War[];
}

enum StructureType {
  CASTLE = 'castle',      // Main building
  MINE = 'mine',         // Gem production (needs 5% tax)
  BARRACKS = 'barracks', // Train guards
  WORKSHOP = 'workshop', // Siege weapons
  MARKET = 'market',     // Trade bonuses
  TEMPLE = 'temple',     // Buffs
  TOWER = 'tower',       // Defense
  WALL = 'wall'         // Defense
}
```

---

### [P3-S6] Instances & Dungeons
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P3-S5]

#### [P3-S6-1] Instance Service
```typescript
interface InstanceService {
  // Instance creation
  createInstance(dungeonId: string, difficulty: Difficulty, party: Party): Promise<Instance>;
  enterInstance(characterId: string, instanceId: string): Promise<void>;
  leaveInstance(characterId: string): Promise<void>;
  
  // Progress
  getInstanceProgress(instanceId: string): Promise<InstanceProgress>;
  completeObjective(instanceId: string, objectiveId: string): Promise<void>;
  
  // Bosses
  engageBoss(instanceId: string, bossId: string): Promise<BossEncounter>;
  getBossStrategy(bossId: string): Promise<BossStrategy>;
  
  // Lockouts
  checkLockout(characterId: string, dungeonId: string): Promise<Lockout>;
  resetLockout(characterId: string, dungeonId: string): Promise<void>;
  
  // Rewards
  rollLoot(instanceId: string, bossId: string): Promise<BossLoot>;
  bonusRoll(characterId: string, bossId: string): Promise<Item>;
}

interface Dungeon {
  id: string;
  name: string;
  levelRange: { min: number; max: number };
  
  // Content
  bosses: Boss[];
  trash: TrashPack[];
  objectives: DungeonObjective[];
  
  // Difficulty
  difficulties: Difficulty[];
  mechanics: Mechanic[];
  
  // Rewards
  lootTables: LootTable[];
  achievements: Achievement[];
  
  // Restrictions
  minPartySize: number;
  maxPartySize: number;
  lockoutDuration: number; // hours
}
```

---

### [P3-S7] AI Integration (Ollama)
**Duration**: 4 weeks  
**Lead Agent**: Claude Code → ChatGPT  
**Dependencies**: [P3-S6]

#### [P3-S7-1] Dynamic AI System
```typescript
interface DynamicAIService {
  // NPC conversations
  generateDialogue(npc: NPC, context: DialogueContext): Promise<string>;
  processPlayerResponse(npcId: string, playerId: string, response: string): Promise<NPCReaction>;
  rememberConversation(npcId: string, playerId: string, summary: string): Promise<void>;
  
  // Quest generation
  generateQuest(parameters: QuestParameters): Promise<Quest>;
  adaptQuestDifficulty(quest: Quest, party: Party): Promise<Quest>;
  createPersonalStory(character: Character): Promise<QuestChain>;
  
  // World events
  generateWorldEvent(context: WorldContext): Promise<WorldEvent>;
  narrateEvent(event: WorldEvent, participants: Character[]): Promise<string>;
  determineOutcome(event: WorldEvent, actions: PlayerAction[]): Promise<EventOutcome>;
  
  // Combat narration
  narrateCombat(combat: CombatLog): Promise<string[]>;
  generateBossTaunts(boss: Boss, phase: number): Promise<string[]>;
  createDeathMessage(killer: Entity, victim: Entity): Promise<string>;
  
  // Dynamic lore
  generateLore(topic: string, style?: NarrativeStyle): Promise<string>;
  createRumor(context: RumorContext): Promise<Rumor>;
  expandWorldHistory(event: HistoricalEvent): Promise<string>;
}

interface AIConfiguration {
  model: 'llama2' | 'mistral' | 'custom';
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  
  // Personality settings
  personality: NPCPersonality;
  knowledge: KnowledgeBase;
  restrictions: ContentRestrictions;
}
```

---

### [P3-S8] Advanced Features Bundle
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P3-S7]

#### [P3-S8-1] Marriage System
```typescript
interface MarriageService {
  // Proposals
  proposeMarriage(proposerId: string, targetId: string, ring?: Item): Promise<Proposal>;
  acceptProposal(proposalId: string): Promise<Marriage>;
  declineProposal(proposalId: string): Promise<void>;
  
  // Benefits
  shareBank(marriage: Marriage): Promise<void>;
  teleportToSpouse(playerId: string): Promise<void>;
  combineInventory(marriage: Marriage): Promise<void>;
  
  // Management
  divorce(playerId: string): Promise<void>;
  celebrateAnniversary(marriage: Marriage): Promise<AnniversaryReward>;
  
  // Ceremony
  planWedding(marriage: Marriage, details: WeddingDetails): Promise<void>;
  inviteGuests(marriage: Marriage, guests: string[]): Promise<void>;
}
```

#### [P3-S8-2] Housing System
```typescript
interface HousingService {
  // Property
  purchaseHouse(playerId: string, plot: HousePlot): Promise<House>;
  sellHouse(houseId: string): Promise<number>;
  
  // Customization
  placeDecoration(houseId: string, item: Decoration, position: Position): Promise<void>;
  moveDecoration(houseId: string, decorationId: string, position: Position): Promise<void>;
  
  // Features
  installUpgrade(houseId: string, upgrade: HouseUpgrade): Promise<void>;
  setPermissions(houseId: string, permissions: HousePermissions): Promise<void>;
  
  // Neighborhoods
  getNeighborhood(houseId: string): Promise<Neighborhood>;
  visitHouse(visitorId: string, houseId: string): Promise<void>;
}
```

#### [P3-S8-3] Advanced Gem Fusion
```typescript
interface AdvancedGemService {
  // Complex fusion
  fuseWithRecipe(gems: Gem[], recipe: FusionRecipe): Promise<Gem>;
  experimentalFusion(gems: Gem[]): Promise<FusionResult>;
  
  // Gem cutting
  cutGem(gem: Gem, pattern: CutPattern): Promise<CutGem>;
  polishGem(gem: CutGem): Promise<void>;
  
  // Set bonuses
  createGemSet(gems: Gem[]): Promise<GemSet>;
  activateSetBonus(character: Character): Promise<void>;
  
  // Transmutation
  transmuteGems(gems: Gem[], catalyst: Catalyst): Promise<Gem>;
}
```

---

### [P3-S9] Advanced Admin Tools
**Duration**: 2 weeks  
**Lead Agent**: Claude Code → ChatGPT  
**Dependencies**: [P3-S8]

#### [P3-S9-1] Economy Management
```typescript
interface EconomyManagementService {
  // Monitoring
  getEconomySnapshot(): Promise<EconomySnapshot>;
  trackInflation(period: TimePeriod): Promise<InflationReport>;
  identifyGoldSources(): Promise<GoldSourceAnalysis>;
  identifyGoldSinks(): Promise<GoldSinkAnalysis>;
  
  // Analysis
  calculateGiniCoefficient(): Promise<number>;
  findWealthConcentration(): Promise<WealthDistribution>;
  predictEconomicTrends(days: number): Promise<EconomicForecast>;
  
  // Intervention
  adjustDropRates(adjustment: DropRateAdjustment): Promise<void>;
  createGoldSink(sink: GoldSink): Promise<void>;
  injectStimulus(amount: number, method: StimulusMethod): Promise<void>;
  
  // Market manipulation
  seedAuctionHouse(items: MarketSeed[]): Promise<void>;
  adjustVendorPrices(modifier: number): Promise<void>;
}
```

#### [P3-S9-2] Automated Detection
```typescript
interface AutomatedDetectionService {
  // Bot detection
  analyzeClickPatterns(playerId: string): Promise<ClickPatternAnalysis>;
  detectMacros(playerId: string): Promise<MacroDetection>;
  identifyBotNetworks(): Promise<BotNetwork[]>;
  
  // Exploit detection
  detectDuplication(timeframe: number): Promise<DuplicationIncident[]>;
  findExploitPatterns(): Promise<ExploitPattern[]>;
  trackAnomalousWealth(threshold: number): Promise<WealthAnomaly[]>;
  
  // Multi-account detection
  linkAccounts(criteria: LinkingCriteria): Promise<AccountCluster[]>;
  detectAccountSharing(accountId: string): Promise<SharingEvidence>;
  
  // Real money trading
  detectRMT(days: number): Promise<RMTIncident[]>;
  flagSuspiciousTrades(): Promise<Trade[]>;
  
  // Actions
  quarantineAccount(accountId: string, reason: string): Promise<void>;
  rollbackExploit(exploitId: string): Promise<RollbackResult>;
}
```

---

## Phase 4: Release - Polish & Endgame (2-3 months)

### [P4-S1] Seasonal Content System
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: Phase 3 Complete

#### [P4-S1-1] Season Management
```typescript
interface SeasonService {
  // Season control
  startSeason(config: SeasonConfig): Promise<Season>;
  endSeason(seasonId: string): Promise<void>;
  
  // Seasonal servers
  createSeasonalServer(duration: number, rules: SeasonRules): Promise<Server>;
  migrateCharacters(fromSeason: string, toCore: boolean): Promise<void>;
  
  // Rewards
  calculateSeasonRewards(playerId: string): Promise<SeasonReward[]>;
  distributeRewards(): Promise<void>;
  
  // Leaderboards
  getSeasonLeaderboard(category: string): Promise<Leaderboard>;
  archiveSeasonData(seasonId: string): Promise<void>;
  
  // Special rules
  applySeasonModifiers(modifiers: SeasonModifier[]): Promise<void>;
}

interface Season {
  id: string;
  name: string;
  theme: string;
  duration: number; // weeks
  
  // Rules
  experienceMultiplier: number;
  lootMultiplier: number;
  specialMechanics: Mechanic[];
  
  // Content
  exclusiveItems: Item[];
  seasonQuests: Quest[];
  challenges: Challenge[];
  
  // Rewards
  rewardTrack: RewardTrack;
  leaderboardPrizes: Prize[];
}
```

---

### [P4-S2] Conquest & Server Events
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P4-S1]

#### [P4-S2-1] Conquest System
```typescript
interface ConquestService {
  // Conquest creation
  createConquest(conquest: Conquest): Promise<void>;
  registerForConquest(clanId: string, conquestId: string): Promise<void>;
  
  // Objectives
  captureObjective(clanId: string, objectiveId: string): Promise<void>;
  defendObjective(clanId: string, objectiveId: string): Promise<void>;
  
  // Progress
  getConquestStatus(conquestId: string): Promise<ConquestStatus>;
  updateConquestScore(clanId: string, points: number): Promise<void>;
  
  // Completion
  endConquest(conquestId: string): Promise<ConquestResult>;
  distributeConquestRewards(result: ConquestResult): Promise<void>;
}

interface Conquest {
  id: string;
  name: string;
  type: 'territory' | 'resources' | 'elimination';
  
  // Participants
  minClans: number;
  maxClans: number;
  
  // Objectives
  objectives: ConquestObjective[];
  winConditions: WinCondition[];
  
  // Duration
  phases: ConquestPhase[];
  totalDuration: number;
  
  // Rewards
  rewards: ConquestRewards;
}
```

---

### [P4-S3] Mastery & Prestige Systems
**Duration**: 2.5 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P4-S2]

#### [P4-S3-1] Mastery System
```typescript
interface MasteryService {
  // Weapon mastery
  trackWeaponKill(characterId: string, weaponType: string): Promise<void>;
  calculateMasteryProgress(characterId: string, weaponType: string): Promise<MasteryProgress>;
  unlockMasteryTalent(characterId: string, talentId: string): Promise<void>;
  
  // Spell mastery
  trackSpellCast(characterId: string, spellId: string): Promise<void>;
  evolveSpell(characterId: string, spellId: string): Promise<EvolvedSpell>;
  
  // Class mastery
  completeClassChallenge(characterId: string, challengeId: string): Promise<void>;
  unlockPrestigeClass(characterId: string, prestigeClass: string): Promise<void>;
  
  // Mastery points
  allocateMasteryPoint(characterId: string, tree: string, node: string): Promise<void>;
  resetMasteryTree(characterId: string, tree: string): Promise<void>;
}

interface MasteryTree {
  id: string;
  name: string;
  type: 'weapon' | 'spell' | 'class';
  
  // Nodes
  nodes: MasteryNode[];
  connections: NodeConnection[];
  
  // Requirements
  unlockRequirements: Requirement[];
  maxPoints: number;
}
```

---

### [P4-S4] Endgame Content
**Duration**: 3 weeks  
**Lead Agent**: Claude Code → Replit Agent  
**Dependencies**: [P4-S3]

#### [P4-S4-1] Dimensional Rifts
```typescript
interface DimensionalRiftService {
  // Rift management
  openRift(level: number, modifiers?: RiftModifier[]): Promise<Rift>;
  enterRift(partyId: string, riftId: string): Promise<void>;
  
  // Progression
  completeFloor(riftId: string, floor: number): Promise<FloorReward>;
  advanceToNextFloor(riftId: string): Promise<void>;
  
  // Challenges
  activateChallenge(riftId: string, challenge: RiftChallenge): Promise<void>;
  
  // Leaderboards
  submitRiftClear(riftId: string, clearTime: number): Promise<void>;
  getRiftLeaderboard(level: number): Promise<RiftLeaderboard>;
  
  // Rewards
  calculateRiftRewards(rift: Rift): Promise<RiftRewards>;
}

interface Rift {
  id: string;
  level: number;
  floors: RiftFloor[];
  
  // Modifiers
  modifiers: RiftModifier[];
  difficulty: number;
  
  // Timing
  timeLimit?: number;
  currentTime: number;
  
  // Party
  partyId: string;
  scaling: DifficultyScaling;
}
```

#### [P4-S4-2] Mythic+ System
```typescript
interface MythicPlusService {
  // Keystone system
  generateKeystone(dungeonId: string, level: number): Promise<Keystone>;
  insertKeystone(instanceId: string, keystone: Keystone): Promise<void>;
  
  // Affixes
  getWeeklyAffixes(): Promise<Affix[]>;
  applyAffixes(instanceId: string, affixes: Affix[]): Promise<void>;
  
  // Completion
  completeInTime(instanceId: string): Promise<MythicReward>;
  depleteKey(keystoneId: string): Promise<void>;
  
  // Great Vault
  updateVaultProgress(characterId: string, level: number): Promise<void>;
  openGreatVault(characterId: string): Promise<VaultReward[]>;
}
```

---

### [P4-S5] Server Management Suite
**Duration**: 2.5 weeks  
**Lead Agent**: Claude Code → ChatGPT  
**Dependencies**: [P4-S4]

#### [P4-S5-1] Live Operations
```typescript
interface LiveOpsService {
  // Server management
  scheduleMaintenace(window: MaintenanceWindow): Promise<void>;
  executeEmergencyRestart(reason: string): Promise<void>;
  
  // Event management
  scheduleEvent(event: GameEvent): Promise<void>;
  modifyActiveEvent(eventId: string, changes: EventModification): Promise<void>;
  
  // Hot fixes
  deployHotfix(patch: Hotfix): Promise<void>;
  rollbackHotfix(patchId: string): Promise<void>;
  
  // Population management
  openFreeTransfers(from: Server, to: Server[]): Promise<void>;
  mergeServers(source: Server, target: Server): Promise<void>;
  
  // Communication
  broadcastMessage(message: string, priority: MessagePriority): Promise<void>;
  scheduleAnnouncement(announcement: Announcement): Promise<void>;
}
```

#### [P4-S5-2] Analytics Dashboard
```typescript
interface AnalyticsService {
  // Real-time metrics
  getActiveUsers(): Promise<number>;
  getConcurrentByZone(): Promise<ZonePopulation[]>;
  getServerLoad(): Promise<ServerMetrics>;
  
  // Player analytics
  getRetentionMetrics(cohort: Date): Promise<RetentionData>;
  getChurnPrediction(): Promise<ChurnAnalysis>;
  getPlayerSegmentation(): Promise<PlayerSegment[]>;
  
  // Content analytics
  getContentEngagement(): Promise<ContentMetrics>;
  getProgressionFunnels(): Promise<FunnelAnalysis>;
  
  // Revenue analytics
  getRevenueMetrics(): Promise<RevenueData>;
  getLTVPrediction(segment: string): Promise<number>;
  
  // Automated reports
  generateDailyReport(): Promise<Report>;
  generateExecutiveSummary(): Promise<ExecutiveSummary>;
}
```

---

### [P4-S6] Final Polish & Optimization
**Duration**: 1.5 weeks  
**Lead Agent**: All Agents  
**Dependencies**: [P4-S5]

#### [P4-S6-1] Performance Optimization
```typescript
interface OptimizationService {
  // Database optimization
  analyzeQueries(): Promise<QueryAnalysis[]>;
  optimizeIndexes(): Promise<IndexOptimization[]>;
  
  // Caching strategies
  analyzeCacheHitRates(): Promise<CacheMetrics>;
  optimizeCacheKeys(): Promise<void>;
  
  // Network optimization
  compressAssets(): Promise<CompressionResult>;
  optimizeProtocol(): Promise<void>;
  
  // Client optimization
  reduceDrawCalls(): Promise<void>;
  optimizeAssetLoading(): Promise<void>;
}
```

#### [P4-S6-2] Polish Tasks
- Tutorial flow refinement
- Tooltip consistency pass
- Animation smoothing
- Sound effect timing
- UI responsiveness audit
- Mobile gesture optimization
- Localization preparation
- Achievement icon creation
- Loading screen tips
- Credits implementation

---

## Final System Architecture

### Core Services Architecture
```
├── Foundation Layer
│   ├── Database (PostgreSQL + Redis)
│   ├── Authentication & Security
│   ├── Monitoring & Logging
│   └── Feature Flags
│
├── Game Services
│   ├── Character Management
│   ├── Combat System
│   ├── Item & Inventory
│   ├── Quest & Achievement
│   ├── Social Systems
│   └── Economy & Trading
│
├── Advanced Services
│   ├── Clan & Kingdom
│   ├── PvP & Alignment
│   ├── Instances & Raids
│   ├── AI Integration
│   └── Seasonal Content
│
├── Support Services
│   ├── Admin Tools
│   ├── Anti-Cheat
│   ├── Analytics
│   └── Customer Support
│
└── API Gateway
    ├── REST API
    ├── WebSocket Server
    └── CDN Integration
```

### Data Flow
1. **Client** → API Gateway → Load Balancer → Game Server
2. **Game Server** → Service Layer → Cache → Database
3. **Real-time** → WebSocket → Message Queue → Subscribers
4. **Analytics** → Event Stream → Processing → Data Warehouse

---

## Success Metrics

### Technical Metrics
- API Response: <200ms p95
- Database Query: <50ms p95
- WebSocket Latency: <100ms
- Uptime: 99.9%
- Crash Rate: <0.1%

### Game Metrics
- Tutorial Completion: >80%
- D1 Retention: >60%
- D7 Retention: >40%
- D30 Retention: >25%
- Session Length: >45 min average

### Business Metrics
- MAU Growth: 20% MoM
- Server Capacity: 10k CCU per server
- Support Ticket Rate: <5%
- Positive Reviews: >85%

---

## Risk Register

### High Priority Risks
1. **Database Scaling**: Implement sharding by Phase 2
2. **DDoS Protection**: CloudFlare integration required
3. **Economy Inflation**: Daily monitoring from Phase 1
4. **Exploit Prevention**: Anti-cheat from Day 1
5. **Content Drought**: 3-month content pipeline

### Mitigation Strategies
- Horizontal scaling preparation
- Automated rollback systems
- Economic circuit breakers
- Exploit detection algorithms
- Content scheduling calendar

---

## Development Commands (Yarn)

```bash
# Initial setup
yarn install
yarn workspace server build
yarn workspace client build

# Development
yarn dev
yarn test
yarn lint

# Production
yarn build
yarn start
yarn migrate

# Testing
yarn test:unit
yarn test:integration
yarn test:e2e

# Code quality
yarn lint
yarn typecheck
yarn format
```

---

This comprehensive implementation plan includes every system required for a complete MMORPG. Each phase builds logically on previous work, ensuring a stable foundation before adding complexity.

**Total Components**: 150+ distinct systems  
**Development Time**: 12-15 months  
**Team Size Required**: 15-20 developers minimum  
**Package Manager**: Yarn (NOT npm)