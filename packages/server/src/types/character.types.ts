export interface CharacterCreateRequest {
  accountId: string;
  name: string;
}

export interface CharacterInfo {
  id: string;
  accountId: string;
  name: string;
  level: number;
  experience: number;
  gold: number;
  alignment: number;
  createdAt: Date;
  updatedAt: Date;
  lastPlayedAt?: Date;
  isDeleted: boolean;
}

export interface CharacterUpdateRequest {
  name?: string;
  lastPlayedAt?: Date;
}

export interface CharacterStats {
  level: number;
  experience: number;
  experienceToNext: number;
  gold: number;
  bankedGold: number;
  alignment: number;
  alignmentLabel: AlignmentLabel;
}

export type AlignmentLabel = 'Pure Evil' | 'Evil' | 'Neutral' | 'Good' | 'Pure Good';

export interface CharacterSlotInfo {
  used: number;
  available: number;
  total: number;
  characters: CharacterInfo[];
}

export const ALIGNMENT_RANGES = {
  PURE_EVIL: { min: -1000, max: -667, label: 'Pure Evil' as AlignmentLabel },
  EVIL: { min: -666, max: -334, label: 'Evil' as AlignmentLabel },
  NEUTRAL: { min: -333, max: 333, label: 'Neutral' as AlignmentLabel },
  GOOD: { min: 334, max: 666, label: 'Good' as AlignmentLabel },
  PURE_GOOD: { min: 667, max: 1000, label: 'Pure Good' as AlignmentLabel },
} as const;
