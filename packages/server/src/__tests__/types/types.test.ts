import { describe, it, expect } from 'vitest';
import type {
  AuthRequest as _AuthRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  JWTPayload,
} from '../../types/auth.types';
import type {
  DepositRequest,
  WithdrawRequest,
  BankingTransaction,
  TransactionType,
} from '../../types/banking.types';
import type {
  CharacterRequest,
  CharacterResponse,
  CharacterStats,
  CharacterUpdate,
} from '../../types/character.types';
import type {
  CombatAction,
  DeathEvent,
  RespawnRequest,
  DeathReason,
} from '../../types/combat.types';
import type {
  ApiResponse,
  PaginatedResponse,
  ErrorDetails,
  ValidationError,
} from '../../types/common.types';
import type {
  BaseEvent,
  UserLoginEvent,
  CharacterCreatedEvent,
  GameEvent,
  EventHandler,
} from '../../events/events.types';

describe('Type Definitions', () => {
  describe('Auth Types', () => {
    it('should define valid auth request types', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const registerRequest: RegisterRequest = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      expect(loginRequest.email).toBe('test@example.com');
      expect(registerRequest.email).toBe('new@example.com');
    });

    it('should define valid auth response types', () => {
      const authResponse: AuthResponse = {
        success: true,
        token: 'jwt-token-here',
        user: {
          id: 'user123',
          email: 'test@example.com',
          createdAt: new Date(),
        },
      };

      expect(authResponse.success).toBe(true);
      expect(authResponse.token).toBe('jwt-token-here');
    });

    it('should define JWT payload type', () => {
      const payload: JWTPayload = {
        userId: 'user123',
        email: 'test@example.com',
        iat: Date.now(),
        exp: Date.now() + 3600000,
      };

      expect(payload.userId).toBe('user123');
      expect(typeof payload.iat).toBe('number');
    });
  });

  describe('Banking Types', () => {
    it('should define banking request types', () => {
      const depositRequest: DepositRequest = {
        characterId: 'char123',
        amount: 1000,
      };

      const withdrawRequest: WithdrawRequest = {
        characterId: 'char123',
        amount: 500,
      };

      expect(depositRequest.amount).toBe(1000);
      expect(withdrawRequest.amount).toBe(500);
    });

    it('should define transaction types', () => {
      const transaction: BankingTransaction = {
        id: 'trans123',
        characterId: 'char123',
        type: 'deposit' as TransactionType,
        amount: 1000,
        timestamp: new Date(),
        balanceAfter: 5000,
      };

      expect(transaction.type).toBe('deposit');
      expect(transaction.amount).toBe(1000);
    });
  });

  describe('Character Types', () => {
    it('should define character request types', () => {
      const characterRequest: CharacterRequest = {
        name: 'TestCharacter',
        race: 'human',
        class: 'warrior',
      };

      expect(characterRequest.name).toBe('TestCharacter');
      expect(characterRequest.race).toBe('human');
    });

    it('should define character response types', () => {
      const characterResponse: CharacterResponse = {
        id: 'char123',
        accountId: 'acc123',
        name: 'TestCharacter',
        level: 1,
        experience: 0,
        gold: 100,
        alignment: 0,
        isAlive: true,
        location: 'newbie_town',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(characterResponse.name).toBe('TestCharacter');
      expect(characterResponse.level).toBe(1);
    });

    it('should define character stats type', () => {
      const stats: CharacterStats = {
        level: 10,
        experience: 10000,
        gold: 5000,
        bankGold: 2000,
        alignment: 150,
        pkKills: 2,
        pkDeaths: 1,
      };

      expect(stats.level).toBe(10);
      expect(stats.pkKills).toBe(2);
    });
  });

  describe('Combat Types', () => {
    it('should define combat action types', () => {
      const combatAction: CombatAction = {
        actionType: 'attack',
        targetId: 'target123',
        damage: 100,
        timestamp: new Date(),
      };

      expect(combatAction.actionType).toBe('attack');
      expect(combatAction.damage).toBe(100);
    });

    it('should define death event types', () => {
      const deathEvent: DeathEvent = {
        characterId: 'char123',
        killerId: 'killer123',
        reason: 'pvp' as DeathReason,
        goldLost: 1000,
        xpLost: 500,
        timestamp: new Date(),
      };

      expect(deathEvent.reason).toBe('pvp');
      expect(deathEvent.goldLost).toBe(1000);
    });

    it('should define respawn request type', () => {
      const respawnRequest: RespawnRequest = {
        characterId: 'char123',
        location: 'temple',
      };

      expect(respawnRequest.location).toBe('temple');
    });
  });

  describe('Common Types', () => {
    it('should define API response types', () => {
      const successResponse: ApiResponse<string> = {
        success: true,
        data: 'Test data',
        message: 'Operation successful',
      };

      const errorResponse: ApiResponse<null> = {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: {},
        },
      };

      expect(successResponse.success).toBe(true);
      expect(errorResponse.success).toBe(false);
    });

    it('should define paginated response types', () => {
      const paginatedResponse: PaginatedResponse<{ id: string; name: string }> = {
        success: true,
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      expect(paginatedResponse.data).toHaveLength(2);
      expect(paginatedResponse.pagination.total).toBe(2);
    });

    it('should define error types', () => {
      const errorDetails: ErrorDetails = {
        code: 'INVALID_INPUT',
        message: 'Invalid input provided',
        details: {
          field: 'email',
          reason: 'Invalid format',
        },
      };

      const validationError: ValidationError = {
        field: 'password',
        message: 'Password too short',
        value: 'abc',
      };

      expect(errorDetails.code).toBe('INVALID_INPUT');
      expect(validationError.field).toBe('password');
    });
  });

  describe('Event Types', () => {
    it('should define base event type', () => {
      const baseEvent: BaseEvent = {
        id: 'evt123',
        timestamp: new Date(),
        source: 'test',
      };

      expect(baseEvent.id).toBe('evt123');
      expect(baseEvent.source).toBe('test');
    });

    it('should define specific event types', () => {
      const loginEvent: UserLoginEvent = {
        id: 'login123',
        timestamp: new Date(),
        source: 'auth_service',
        type: 'user.login',
        userId: 'user123',
        email: 'test@example.com',
        ipAddress: '192.168.1.1',
      };

      const charEvent: CharacterCreatedEvent = {
        id: 'char123',
        timestamp: new Date(),
        source: 'character_service',
        type: 'character.created',
        characterId: 'char123',
        accountId: 'acc123',
        characterName: 'TestChar',
      };

      expect(loginEvent.type).toBe('user.login');
      expect(charEvent.type).toBe('character.created');
    });

    it('should define event handler type', () => {
      const syncHandler: EventHandler<UserLoginEvent> = (event) => {
        expect(event.type).toBe('user.login');
      };

      const asyncHandler: EventHandler<UserLoginEvent> = async (event) => {
        expect(event.type).toBe('user.login');
        return Promise.resolve();
      };

      // Test that handlers are callable
      const testEvent: UserLoginEvent = {
        id: 'test123',
        timestamp: new Date(),
        source: 'test',
        type: 'user.login',
        userId: 'user123',
        email: 'test@example.com',
      };

      syncHandler(testEvent);
      asyncHandler(testEvent);
    });

    it('should define union game event type', () => {
      const events: GameEvent[] = [
        {
          id: 'login123',
          timestamp: new Date(),
          source: 'auth',
          type: 'user.login',
          userId: 'user123',
          email: 'test@example.com',
        },
        {
          id: 'char123',
          timestamp: new Date(),
          source: 'character',
          type: 'character.created',
          characterId: 'char123',
          accountId: 'acc123',
          characterName: 'TestChar',
        },
      ];

      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('user.login');
      expect(events[1].type).toBe('character.created');
    });
  });

  describe('Type Guards and Utilities', () => {
    it('should work with type assertions', () => {
      const unknownData: unknown = {
        id: 'test123',
        name: 'Test Character',
        level: 1,
      };

      // Type assertion example
      const character = unknownData as Pick<CharacterResponse, 'id' | 'name' | 'level'>;
      expect(character.id).toBe('test123');
      expect(character.name).toBe('Test Character');
    });

    it('should work with partial types', () => {
      const partialUpdate: Partial<CharacterUpdate> = {
        location: 'new_location',
      };

      expect(partialUpdate.location).toBe('new_location');
    });

    it('should work with required types', () => {
      const requiredFields: Required<Pick<CharacterRequest, 'name' | 'race'>> = {
        name: 'TestChar',
        race: 'elf',
      };

      expect(requiredFields.name).toBe('TestChar');
      expect(requiredFields.race).toBe('elf');
    });
  });
});
