import { describe, it, expect } from 'vitest';
import {
  CHARACTER_LIMITS,
  PVP_LIMITS,
  BANKING,
  EXPERIENCE,
  DEATH_PENALTIES,
  ALIGNMENT,
  CHAT,
  SECURITY,
  DATABASE,
  MESSAGES,
  HTTP_STATUS,
} from '../../utils/constants';

describe('Game Constants', () => {
  describe('CHARACTER_LIMITS', () => {
    it('should have correct character limit values', () => {
      expect(CHARACTER_LIMITS.MAX_CHARACTERS_PER_ACCOUNT).toBe(3);
      expect(CHARACTER_LIMITS.MIN_LEVEL_FOR_DELETION_IMMUNITY).toBe(10);
      expect(CHARACTER_LIMITS.INACTIVE_DELETION_DAYS).toBe(30);
    });

    it('should be immutable', () => {
      expect(() => {
        // @ts-expect-error Testing immutability
        CHARACTER_LIMITS.MAX_CHARACTERS_PER_ACCOUNT = 5;
      }).toThrow();
    });
  });

  describe('PVP_LIMITS', () => {
    it('should have correct PvP limit values', () => {
      expect(PVP_LIMITS.PK_COOLDOWN_MINUTES).toBe(10);
      expect(PVP_LIMITS.MAX_KILLS_PER_HOUR).toBe(6);
      expect(PVP_LIMITS.PK_TAG_DURATION_MINUTES).toBe(30);
    });
  });

  describe('BANKING', () => {
    it('should have correct banking values', () => {
      expect(BANKING.MIN_DEPOSIT_AMOUNT).toBe(1);
      expect(BANKING.MIN_WITHDRAWAL_AMOUNT).toBe(1);
      expect(BANKING.TRANSACTION_FEE_PERCENT).toBe(0);
    });
  });

  describe('EXPERIENCE', () => {
    it('should have correct experience values', () => {
      expect(EXPERIENCE.BASE_XP_PER_LEVEL).toBe(1000);
      expect(EXPERIENCE.XP_SCALING_FACTOR).toBe(1.2);
      expect(EXPERIENCE.MAX_LEVEL).toBe(1000);
    });
  });

  describe('DEATH_PENALTIES', () => {
    it('should have correct death penalty values', () => {
      expect(DEATH_PENALTIES.XP_LOSS_PERCENT).toBe(20);
      expect(DEATH_PENALTIES.GOLD_LOSS_PERCENT).toBe(100);
      expect(DEATH_PENALTIES.DURABILITY_DAMAGE_PERCENT).toBe(10);
    });
  });

  describe('ALIGNMENT', () => {
    it('should have correct alignment values', () => {
      expect(ALIGNMENT.MIN_VALUE).toBe(-1000);
      expect(ALIGNMENT.MAX_VALUE).toBe(1000);
      expect(ALIGNMENT.NEUTRAL_RANGE.min).toBe(-333);
      expect(ALIGNMENT.NEUTRAL_RANGE.max).toBe(333);
    });

    it('should have correct PK alignment changes', () => {
      expect(ALIGNMENT.PK_ALIGNMENT_CHANGE.KILL_GOOD_PLAYER).toBe(-50);
      expect(ALIGNMENT.PK_ALIGNMENT_CHANGE.KILL_EVIL_PLAYER).toBe(25);
      expect(ALIGNMENT.PK_ALIGNMENT_CHANGE.KILL_NEUTRAL_PLAYER).toBe(-10);
    });
  });

  describe('CHAT', () => {
    it('should have correct chat values', () => {
      expect(CHAT.MANDATORY_CHANNELS).toEqual(['general', 'trade', 'help', 'race']);
      expect(CHAT.MAX_MESSAGE_LENGTH).toBe(500);
      expect(CHAT.ANTI_SPAM_COOLDOWN_SECONDS).toBe(2);
    });
  });

  describe('SECURITY', () => {
    it('should have correct security values', () => {
      expect(SECURITY.JWT_EXPIRES_IN).toBe('24h');
      expect(SECURITY.PASSWORD_MIN_LENGTH).toBe(8);
      expect(SECURITY.MAX_LOGIN_ATTEMPTS).toBe(5);
      expect(SECURITY.LOCKOUT_DURATION_MINUTES).toBe(15);
    });

    it('should have correct rate limit values', () => {
      expect(SECURITY.RATE_LIMIT.WINDOW_MINUTES).toBe(15);
      expect(SECURITY.RATE_LIMIT.MAX_REQUESTS).toBe(100);
    });
  });

  describe('DATABASE', () => {
    it('should have correct database values', () => {
      expect(DATABASE.CONNECTION_POOL_SIZE).toBe(10);
      expect(DATABASE.QUERY_TIMEOUT_SECONDS).toBe(30);
      expect(DATABASE.TRANSACTION_TIMEOUT_SECONDS).toBe(10);
    });
  });

  describe('MESSAGES', () => {
    it('should have auth messages', () => {
      expect(MESSAGES.AUTH.LOGIN_SUCCESS).toBe('Login successful');
      expect(MESSAGES.AUTH.LOGOUT_SUCCESS).toBe('Logout successful');
      expect(MESSAGES.AUTH.REGISTER_SUCCESS).toBe('Account created successfully');
      expect(MESSAGES.AUTH.INVALID_CREDENTIALS).toBe('Invalid email or password');
      expect(MESSAGES.AUTH.ACCOUNT_LOCKED).toBe(
        'Account temporarily locked due to too many failed attempts'
      );
      expect(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS).toBe('Email already registered');
    });

    it('should have character messages', () => {
      expect(MESSAGES.CHARACTER.CREATED).toBe('Character created successfully');
      expect(MESSAGES.CHARACTER.DELETED).toBe('Character deleted successfully');
      expect(MESSAGES.CHARACTER.NOT_FOUND).toBe('Character not found');
      expect(MESSAGES.CHARACTER.NAME_TAKEN).toBe('Character name already taken');
      expect(MESSAGES.CHARACTER.MAX_CHARACTERS).toBe('Maximum characters per account reached');
      expect(MESSAGES.CHARACTER.LEVEL_TOO_LOW_FOR_DELETION).toBe(
        'Character level too low for auto-deletion'
      );
    });

    it('should have banking messages', () => {
      expect(MESSAGES.BANKING.DEPOSIT_SUCCESS).toBe('Gold deposited successfully');
      expect(MESSAGES.BANKING.WITHDRAWAL_SUCCESS).toBe('Gold withdrawn successfully');
      expect(MESSAGES.BANKING.INSUFFICIENT_FUNDS).toBe('Insufficient funds');
      expect(MESSAGES.BANKING.INSUFFICIENT_BANK_BALANCE).toBe('Insufficient bank balance');
      expect(MESSAGES.BANKING.INVALID_AMOUNT).toBe('Invalid amount specified');
    });

    it('should have combat messages', () => {
      expect(MESSAGES.COMBAT.DEATH_PROCESSED).toBe('Death processed successfully');
      expect(MESSAGES.COMBAT.RESPAWN_SUCCESS).toBe('Character respawned successfully');
      expect(MESSAGES.COMBAT.ALREADY_DEAD).toBe('Character is already dead');
      expect(MESSAGES.COMBAT.NOT_DEAD).toBe('Character is not dead');
      expect(MESSAGES.COMBAT.RESPAWN_COOLDOWN).toBe('Respawn cooldown active');
    });

    it('should have PvP messages', () => {
      expect(MESSAGES.PVP.KILL_RECORDED).toBe('PvP kill recorded successfully');
      expect(MESSAGES.PVP.ON_COOLDOWN).toBe('PvP kill cooldown active');
      expect(MESSAGES.PVP.HOURLY_LIMIT_REACHED).toBe('Hourly PvP kill limit reached');
      expect(MESSAGES.PVP.INVALID_TARGET).toBe('Invalid PvP target');
    });

    it('should have general messages', () => {
      expect(MESSAGES.GENERAL.SUCCESS).toBe('Operation completed successfully');
      expect(MESSAGES.GENERAL.ERROR).toBe('An error occurred');
      expect(MESSAGES.GENERAL.NOT_FOUND).toBe('Resource not found');
      expect(MESSAGES.GENERAL.UNAUTHORIZED).toBe('Unauthorized access');
      expect(MESSAGES.GENERAL.FORBIDDEN).toBe('Access forbidden');
      expect(MESSAGES.GENERAL.VALIDATION_ERROR).toBe('Validation error');
      expect(MESSAGES.GENERAL.INTERNAL_ERROR).toBe('Internal server error');
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have correct HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });
});
