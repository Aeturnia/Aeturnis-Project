// Event types for the Aeturnis event system

export interface BaseEvent {
  id: string;
  timestamp: Date;
  source: string;
}

// Authentication events
export interface UserLoginEvent extends BaseEvent {
  type: 'user.login';
  userId: string;
  email: string;
  ipAddress?: string;
}

export interface UserLogoutEvent extends BaseEvent {
  type: 'user.logout';
  userId: string;
  sessionDuration: number;
}

export interface UserRegisteredEvent extends BaseEvent {
  type: 'user.registered';
  userId: string;
  email: string;
}

// Character events
export interface CharacterCreatedEvent extends BaseEvent {
  type: 'character.created';
  characterId: string;
  accountId: string;
  characterName: string;
}

export interface CharacterDeletedEvent extends BaseEvent {
  type: 'character.deleted';
  characterId: string;
  accountId: string;
  characterName: string;
  level: number;
  reason: 'user_request' | 'auto_deletion' | 'admin_action';
}

export interface CharacterLevelUpEvent extends BaseEvent {
  type: 'character.level_up';
  characterId: string;
  oldLevel: number;
  newLevel: number;
  totalExperience: number;
}

// Banking events
export interface BankDepositEvent extends BaseEvent {
  type: 'bank.deposit';
  characterId: string;
  amount: number;
  newBalance: number;
  transactionId: string;
}

export interface BankWithdrawalEvent extends BaseEvent {
  type: 'bank.withdrawal';
  characterId: string;
  amount: number;
  newBalance: number;
  transactionId: string;
}

// Combat events
export interface CharacterDeathEvent extends BaseEvent {
  type: 'character.death';
  characterId: string;
  killerId?: string;
  deathReason: 'pve' | 'pvp' | 'environmental' | 'admin';
  goldLost: number;
  xpLost: number;
  location?: string;
}

export interface CharacterRespawnEvent extends BaseEvent {
  type: 'character.respawn';
  characterId: string;
  respawnLocation: string;
  resurrectionSickness: boolean;
}

// PvP events
export interface PvPKillEvent extends BaseEvent {
  type: 'pvp.kill';
  killerId: string;
  victimId: string;
  killerAlignment: number;
  victimAlignment: number;
  alignmentChange: number;
  location?: string;
}

export interface AlignmentChangedEvent extends BaseEvent {
  type: 'character.alignment_changed';
  characterId: string;
  oldAlignment: number;
  newAlignment: number;
  reason: string;
}

// Experience events
export interface ExperienceGainedEvent extends BaseEvent {
  type: 'character.xp_gained';
  characterId: string;
  xpAmount: number;
  totalExperience: number;
  source: string;
  levelUp?: boolean;
}

export interface ExperienceLostEvent extends BaseEvent {
  type: 'character.xp_lost';
  characterId: string;
  xpAmount: number;
  totalExperience: number;
  reason: string;
}

// System events
export interface ErrorEvent extends BaseEvent {
  type: 'system.error';
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  userId?: string;
  characterId?: string;
}

export interface AuditEvent extends BaseEvent {
  type: 'system.audit';
  operation: string;
  resource: string;
  resourceId: string;
  userId?: string;
  changes?: Record<string, unknown>;
}

// Union type of all events
export type GameEvent =
  | UserLoginEvent
  | UserLogoutEvent
  | UserRegisteredEvent
  | CharacterCreatedEvent
  | CharacterDeletedEvent
  | CharacterLevelUpEvent
  | BankDepositEvent
  | BankWithdrawalEvent
  | CharacterDeathEvent
  | CharacterRespawnEvent
  | PvPKillEvent
  | AlignmentChangedEvent
  | ExperienceGainedEvent
  | ExperienceLostEvent
  | ErrorEvent
  | AuditEvent;

// Event handler type
export type EventHandler<T extends GameEvent = GameEvent> = (event: T) => Promise<void> | void;

// Event listener map
export interface EventListeners {
  'user.login': EventHandler<UserLoginEvent>[];
  'user.logout': EventHandler<UserLogoutEvent>[];
  'user.registered': EventHandler<UserRegisteredEvent>[];
  'character.created': EventHandler<CharacterCreatedEvent>[];
  'character.deleted': EventHandler<CharacterDeletedEvent>[];
  'character.level_up': EventHandler<CharacterLevelUpEvent>[];
  'bank.deposit': EventHandler<BankDepositEvent>[];
  'bank.withdrawal': EventHandler<BankWithdrawalEvent>[];
  'character.death': EventHandler<CharacterDeathEvent>[];
  'character.respawn': EventHandler<CharacterRespawnEvent>[];
  'pvp.kill': EventHandler<PvPKillEvent>[];
  'character.alignment_changed': EventHandler<AlignmentChangedEvent>[];
  'character.xp_gained': EventHandler<ExperienceGainedEvent>[];
  'character.xp_lost': EventHandler<ExperienceLostEvent>[];
  'system.error': EventHandler<ErrorEvent>[];
  'system.audit': EventHandler<AuditEvent>[];
}
