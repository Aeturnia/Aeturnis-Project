export interface DeathPenalty {
  characterId: string;
  goldLost: number;
  xpLost: number;
  durabilityDamage: number;
  timestamp: Date;
}

export interface DeathRequest {
  characterId: string;
  killerId?: string; // For PvP deaths
  reason: DeathReason;
}

export type DeathReason = 'pve' | 'pvp' | 'environmental' | 'admin';

export interface RespawnRequest {
  characterId: string;
  location?: RespawnLocation;
}

export type RespawnLocation = 'graveyard' | 'spirit_healer' | 'bind_point';

export interface CombatStatus {
  characterId: string;
  isDead: boolean;
  deathTimestamp?: Date;
  canRespawn: boolean;
  respawnCooldown?: number; // seconds remaining
  resurrectionSickness?: {
    remainingTime: number; // seconds
    debuffPercent: number;
  };
}

export interface DeathResult {
  success: boolean;
  penalty: DeathPenalty;
  newCharacterState: {
    gold: number;
    experience: number;
    level: number;
  };
  transactions: string[]; // Transaction IDs created
}

export const DEATH_PENALTY_CONFIG = {
  XP_LOSS_PERCENT: 20, // 20% XP to next level
  DURABILITY_DAMAGE_PERCENT: 10, // 10% durability damage
  RESURRECTION_SICKNESS_DURATION: 300, // 5 minutes in seconds
  RESURRECTION_SICKNESS_DEBUFF: 25, // 25% stat reduction
} as const;
