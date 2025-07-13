// Game constants for Aeturnis Online

// Character limits
export const CHARACTER_LIMITS = {
  MAX_CHARACTERS_PER_ACCOUNT: 3,
  MIN_LEVEL_FOR_DELETION_IMMUNITY: 10,
  INACTIVE_DELETION_DAYS: 30,
} as const;

// PvP/PK system constants
export const PVP_LIMITS = {
  PK_COOLDOWN_MINUTES: 10,
  MAX_KILLS_PER_HOUR: 6,
  PK_TAG_DURATION_MINUTES: 30,
} as const;

// Banking constants
export const BANKING = {
  MIN_DEPOSIT_AMOUNT: 1,
  MIN_WITHDRAWAL_AMOUNT: 1,
  TRANSACTION_FEE_PERCENT: 0, // No fees for now
} as const;

// Experience/Leveling constants
export const EXPERIENCE = {
  BASE_XP_PER_LEVEL: 1000,
  XP_SCALING_FACTOR: 1.2,
  MAX_LEVEL: 1000,
} as const;

// Death penalty constants
export const DEATH_PENALTIES = {
  XP_LOSS_PERCENT: 20,
  GOLD_LOSS_PERCENT: 100, // Lose ALL unbanked gold
  DURABILITY_DAMAGE_PERCENT: 10,
} as const;

// Alignment system
export const ALIGNMENT = {
  MIN_VALUE: -1000,
  MAX_VALUE: 1000,
  NEUTRAL_RANGE: { min: -333, max: 333 },
  PK_ALIGNMENT_CHANGE: {
    KILL_GOOD_PLAYER: -50,
    KILL_EVIL_PLAYER: 25,
    KILL_NEUTRAL_PLAYER: -10,
  },
} as const;

// Chat system
export const CHAT = {
  MANDATORY_CHANNELS: ['general', 'trade', 'help', 'race'],
  MAX_MESSAGE_LENGTH: 500,
  ANTI_SPAM_COOLDOWN_SECONDS: 2,
} as const;

// Security constants
export const SECURITY = {
  JWT_EXPIRES_IN: '24h',
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  RATE_LIMIT: {
    WINDOW_MINUTES: 15,
    MAX_REQUESTS: 100,
  },
} as const;

// Database constants
export const DATABASE = {
  CONNECTION_POOL_SIZE: 10,
  QUERY_TIMEOUT_SECONDS: 30,
  TRANSACTION_TIMEOUT_SECONDS: 10,
} as const;

// API Response messages
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Account created successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account temporarily locked due to too many failed attempts',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
  },
  CHARACTER: {
    CREATED: 'Character created successfully',
    DELETED: 'Character deleted successfully',
    NOT_FOUND: 'Character not found',
    NAME_TAKEN: 'Character name already taken',
    MAX_CHARACTERS: 'Maximum characters per account reached',
    LEVEL_TOO_LOW_FOR_DELETION: 'Character level too low for auto-deletion',
  },
  BANKING: {
    DEPOSIT_SUCCESS: 'Gold deposited successfully',
    WITHDRAWAL_SUCCESS: 'Gold withdrawn successfully',
    INSUFFICIENT_FUNDS: 'Insufficient funds',
    INSUFFICIENT_BANK_BALANCE: 'Insufficient bank balance',
    INVALID_AMOUNT: 'Invalid amount specified',
  },
  COMBAT: {
    DEATH_PROCESSED: 'Death processed successfully',
    RESPAWN_SUCCESS: 'Character respawned successfully',
    ALREADY_DEAD: 'Character is already dead',
    NOT_DEAD: 'Character is not dead',
    RESPAWN_COOLDOWN: 'Respawn cooldown active',
  },
  PVP: {
    KILL_RECORDED: 'PvP kill recorded successfully',
    ON_COOLDOWN: 'PvP kill cooldown active',
    HOURLY_LIMIT_REACHED: 'Hourly PvP kill limit reached',
    INVALID_TARGET: 'Invalid PvP target',
  },
  GENERAL: {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
  },
} as const;

// HTTP Status codes for consistency
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
