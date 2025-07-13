import { EventEmitter } from 'events';
import { GameEvent, EventListeners } from './events.types';

class GameEventBus extends EventEmitter {
  private static instance: GameEventBus;

  private constructor() {
    super();
    this.setMaxListeners(100); // Increase default max listeners for game events
  }

  public static getInstance(): GameEventBus {
    if (!GameEventBus.instance) {
      GameEventBus.instance = new GameEventBus();
    }
    return GameEventBus.instance;
  }

  // Type-safe event emission
  public async emitGameEvent<T extends GameEvent>(event: T): Promise<void> {
    try {
      this.emit(event.type, event);

      // Emit to audit system if needed
      if (this.shouldAudit(event.type)) {
        this.emit('system.audit', {
          id: `audit_${event.id}`,
          timestamp: new Date(),
          source: 'event_bus',
          type: 'system.audit',
          operation: 'event_emitted',
          resource: event.type,
          resourceId: event.id,
          changes: event,
        });
      }
    } catch (error) {
      // Emit error event for failed event emission
      this.emit('system.error', {
        id: `error_${Date.now()}`,
        timestamp: new Date(),
        source: 'event_bus',
        type: 'system.error',
        errorType: 'event_emission_failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  // Type-safe event listener registration
  public onGameEvent<K extends keyof EventListeners>(
    eventType: K,
    handler: EventListeners[K][0]
  ): void {
    this.on(eventType, handler);
  }

  // Type-safe one-time event listener registration
  public onceGameEvent<K extends keyof EventListeners>(
    eventType: K,
    handler: EventListeners[K][0]
  ): void {
    this.once(eventType, handler);
  }

  // Remove specific event listener
  public offGameEvent<K extends keyof EventListeners>(
    eventType: K,
    handler: EventListeners[K][0]
  ): void {
    this.off(eventType, handler);
  }

  // Remove all listeners for an event type
  public removeAllGameListeners<K extends keyof EventListeners>(eventType?: K): void {
    if (eventType) {
      this.removeAllListeners(eventType);
    } else {
      this.removeAllListeners();
    }
  }

  // Get listener count for an event type
  public getListenerCount<K extends keyof EventListeners>(eventType: K): number {
    return this.listenerCount(eventType);
  }

  // Check if we should audit this event type
  private shouldAudit(eventType: string): boolean {
    const auditableEvents = [
      'user.login',
      'user.logout',
      'user.registered',
      'character.created',
      'character.deleted',
      'bank.deposit',
      'bank.withdrawal',
      'character.death',
      'pvp.kill',
      'character.alignment_changed',
    ];

    return auditableEvents.includes(eventType);
  }

  // Graceful shutdown - wait for pending events
  public async shutdown(): Promise<void> {
    return new Promise((resolve) => {
      // Give existing events time to process
      setTimeout(() => {
        this.removeAllListeners();
        resolve();
      }, 1000);
    });
  }

  // Health check - verify event bus is responsive
  public async healthCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      const testEvent = {
        id: `health_check_${Date.now()}`,
        timestamp: new Date(),
        source: 'health_check',
        type: 'system.audit' as const,
        operation: 'health_check',
        resource: 'event_bus',
        resourceId: 'health_check',
      };

      const timeout = setTimeout(() => {
        this.off('system.audit', handler);
        resolve(false);
      }, 1000);

      const handler = (event: GameEvent) => {
        if (event.id === testEvent.id) {
          clearTimeout(timeout);
          this.off('system.audit', handler);
          resolve(true);
        }
      };

      this.once('system.audit', handler);
      this.emit('system.audit', testEvent);
    });
  }
}

// Export singleton instance
export const eventBus = GameEventBus.getInstance();

// Utility function to create event IDs
export function createEventId(prefix: string = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Utility function to create base event properties
export function createBaseEvent(source: string): Pick<GameEvent, 'id' | 'timestamp' | 'source'> {
  return {
    id: createEventId(),
    timestamp: new Date(),
    source,
  };
}
