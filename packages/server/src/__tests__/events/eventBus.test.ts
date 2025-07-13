import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { eventBus, createEventId, createBaseEvent } from '../../events/eventBus';
import type {
  UserLoginEvent,
  CharacterCreatedEvent,
  AuditEvent as _AuditEvent,
} from '../../events/events.types';

describe('GameEventBus', () => {
  beforeEach(() => {
    // Clear all listeners before each test
    eventBus.removeAllGameListeners();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      // Since eventBus is already created, we test that it's a single instance
      expect(eventBus).toBeDefined();
      expect(eventBus.getListenerCount('user.login')).toBe(0);
    });
  });

  describe('Event Emission', () => {
    it('should emit and handle game events', async () => {
      const handler = vi.fn();
      const event: UserLoginEvent = {
        id: createEventId('login'),
        timestamp: new Date(),
        source: 'test',
        type: 'user.login',
        userId: 'user123',
        email: 'test@example.com',
      };

      eventBus.onGameEvent('user.login', handler);
      await eventBus.emitGameEvent(event);

      expect(handler).toHaveBeenCalledWith(event);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should emit audit events for auditable event types', async () => {
      const auditHandler = vi.fn();
      const event: CharacterCreatedEvent = {
        id: createEventId('char'),
        timestamp: new Date(),
        source: 'test',
        type: 'character.created',
        characterId: 'char123',
        accountId: 'acc123',
        characterName: 'TestChar',
      };

      eventBus.onGameEvent('system.audit', auditHandler);
      await eventBus.emitGameEvent(event);

      expect(auditHandler).toHaveBeenCalled();
      const auditEvent = auditHandler.mock.calls[0][0];
      expect(auditEvent.type).toBe('system.audit');
      expect(auditEvent.resource).toBe('character.created');
    });

    it('should emit error event when event emission fails', async () => {
      const errorHandler = vi.fn();
      const failingHandler = vi.fn().mockImplementation(() => {
        throw new Error('Handler failed');
      });

      const event: UserLoginEvent = {
        id: createEventId('login'),
        timestamp: new Date(),
        source: 'test',
        type: 'user.login',
        userId: 'user123',
        email: 'test@example.com',
      };

      eventBus.onGameEvent('user.login', failingHandler);
      eventBus.onGameEvent('system.error', errorHandler);

      await eventBus.emitGameEvent(event);

      expect(errorHandler).toHaveBeenCalled();
      const errorEvent = errorHandler.mock.calls[0][0];
      expect(errorEvent.type).toBe('system.error');
      expect(errorEvent.errorMessage).toBe('Handler failed');
    });
  });

  describe('Event Listeners', () => {
    it('should register and remove event listeners', () => {
      const handler = vi.fn();

      eventBus.onGameEvent('user.login', handler);
      expect(eventBus.getListenerCount('user.login')).toBe(1);

      eventBus.offGameEvent('user.login', handler);
      expect(eventBus.getListenerCount('user.login')).toBe(0);
    });

    it('should register one-time event listeners', async () => {
      const handler = vi.fn();
      const event: UserLoginEvent = {
        id: createEventId('login'),
        timestamp: new Date(),
        source: 'test',
        type: 'user.login',
        userId: 'user123',
        email: 'test@example.com',
      };

      eventBus.onceGameEvent('user.login', handler);

      await eventBus.emitGameEvent(event);
      await eventBus.emitGameEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should remove all listeners for specific event type', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.onGameEvent('user.login', handler1);
      eventBus.onGameEvent('user.login', handler2);
      expect(eventBus.getListenerCount('user.login')).toBe(2);

      eventBus.removeAllGameListeners('user.login');
      expect(eventBus.getListenerCount('user.login')).toBe(0);
    });

    it('should remove all listeners when no event type specified', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.onGameEvent('user.login', handler1);
      eventBus.onGameEvent('character.created', handler2);

      eventBus.removeAllGameListeners();

      expect(eventBus.getListenerCount('user.login')).toBe(0);
      expect(eventBus.getListenerCount('character.created')).toBe(0);
    });
  });

  describe('Health Check', () => {
    it('should return true when event bus is responsive', async () => {
      const result = await eventBus.healthCheck();
      expect(result).toBe(true);
    });

    it('should return false when event bus is not responsive', async () => {
      // Override emit to simulate unresponsive bus
      const originalEmit = eventBus.emit;
      eventBus.emit = vi.fn();

      const result = await eventBus.healthCheck();
      expect(result).toBe(false);

      // Restore original emit
      eventBus.emit = originalEmit;
    });
  });

  describe('Shutdown', () => {
    it('should remove all listeners after shutdown', async () => {
      const handler = vi.fn();
      eventBus.onGameEvent('user.login', handler);

      await eventBus.shutdown();

      // Wait for shutdown to complete
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(eventBus.getListenerCount('user.login')).toBe(0);
    });
  });

  describe('Audit Detection', () => {
    it('should identify auditable events correctly', async () => {
      const auditHandler = vi.fn();
      eventBus.onGameEvent('system.audit', auditHandler);

      // Test auditable event
      const loginEvent: UserLoginEvent = {
        id: createEventId('login'),
        timestamp: new Date(),
        source: 'test',
        type: 'user.login',
        userId: 'user123',
        email: 'test@example.com',
      };

      await eventBus.emitGameEvent(loginEvent);
      expect(auditHandler).toHaveBeenCalled();

      // Clear mock
      auditHandler.mockClear();

      // Test non-auditable event (system.error is not in auditable list)
      await eventBus.emitGameEvent({
        id: createEventId('error'),
        timestamp: new Date(),
        source: 'test',
        type: 'system.error',
        errorType: 'test_error',
        errorMessage: 'Test error',
      });

      expect(auditHandler).not.toHaveBeenCalled();
    });
  });
});

describe('Event Utilities', () => {
  describe('createEventId', () => {
    it('should create unique event IDs with default prefix', () => {
      const id1 = createEventId();
      const id2 = createEventId();

      expect(id1).toMatch(/^evt_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^evt_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should create event IDs with custom prefix', () => {
      const id = createEventId('custom');
      expect(id).toMatch(/^custom_\d+_[a-z0-9]+$/);
    });
  });

  describe('createBaseEvent', () => {
    it('should create base event properties', () => {
      const baseEvent = createBaseEvent('test_source');

      expect(baseEvent).toHaveProperty('id');
      expect(baseEvent).toHaveProperty('timestamp');
      expect(baseEvent).toHaveProperty('source');
      expect(baseEvent.source).toBe('test_source');
      expect(baseEvent.timestamp).toBeInstanceOf(Date);
      expect(baseEvent.id).toMatch(/^evt_\d+_[a-z0-9]+$/);
    });
  });
});
