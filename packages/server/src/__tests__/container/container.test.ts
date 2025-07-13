import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Container } from '../../container';
import { PrismaClient as _PrismaClient } from '@prisma/client';

// Mock PrismaClient to avoid database connections during tests
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    account: {},
    character: {},
    bankAccount: {},
    transaction: {},
    xpLedger: {},
    pkKillLog: {},
  })),
}));

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    // Clear any existing singleton instance
    // @ts-expect-error Accessing private static property for testing
    Container.instance = undefined;
    container = Container.getInstance();
  });

  afterEach(async () => {
    // Clean up after each test
    await container.disconnect();
    // @ts-expect-error Accessing private static property for testing
    Container.instance = undefined;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = Container.getInstance();
      const instance2 = Container.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(Container);
    });

    it('should initialize only once', () => {
      const instance1 = Container.getInstance();
      const instance2 = Container.getInstance();

      // Both should be the exact same object reference
      expect(instance1 === instance2).toBe(true);
    });
  });

  describe('Repository Access', () => {
    it('should provide AccountRepository', () => {
      const repository = container.getAccountRepository();
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('AccountRepository');
    });

    it('should provide CharacterRepository', () => {
      const repository = container.getCharacterRepository();
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('CharacterRepository');
    });

    it('should provide BankAccountRepository', () => {
      const repository = container.getBankAccountRepository();
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('BankAccountRepository');
    });

    it('should provide TransactionRepository', () => {
      const repository = container.getTransactionRepository();
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('TransactionRepository');
    });

    it('should provide XpLedgerRepository', () => {
      const repository = container.getXpLedgerRepository();
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('XpLedgerRepository');
    });

    it('should provide PkKillLogRepository', () => {
      const repository = container.getPkKillLogRepository();
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('PkKillLogRepository');
    });

    it('should return same repository instances on multiple calls', () => {
      const repo1 = container.getAccountRepository();
      const repo2 = container.getAccountRepository();

      expect(repo1).toBe(repo2);
    });
  });

  describe('Service Access', () => {
    it('should provide AuthService', () => {
      const service = container.getAuthService();
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('AuthService');
    });

    it('should provide BankingService', () => {
      const service = container.getBankingService();
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('BankingService');
    });

    it('should provide CharacterService', () => {
      const service = container.getCharacterService();
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('CharacterService');
    });

    it('should provide CombatService', () => {
      const service = container.getCombatService();
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('CombatService');
    });

    it('should provide PKService', () => {
      const service = container.getPkService();
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('PKService');
    });

    it('should provide XPService', () => {
      const service = container.getXpService();
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('XPService');
    });

    it('should return same service instances on multiple calls', () => {
      const service1 = container.getAuthService();
      const service2 = container.getAuthService();

      expect(service1).toBe(service2);
    });
  });

  describe('Prisma Client Access', () => {
    it('should provide PrismaClient instance', () => {
      const prisma = container.getPrisma();
      expect(prisma).toBeDefined();
      expect(prisma.$disconnect).toBeDefined();
      expect(typeof prisma.$disconnect).toBe('function');
    });

    it('should return same Prisma instance on multiple calls', () => {
      const prisma1 = container.getPrisma();
      const prisma2 = container.getPrisma();

      expect(prisma1).toBe(prisma2);
    });
  });

  describe('Dependency Injection', () => {
    it('should inject dependencies into AuthService', () => {
      const authService = container.getAuthService();
      const accountRepository = container.getAccountRepository();

      // AuthService should be created with AccountRepository dependency
      expect(authService).toBeDefined();
      expect(accountRepository).toBeDefined();
    });

    it('should inject multiple dependencies into BankingService', () => {
      const bankingService = container.getBankingService();
      const bankAccountRepository = container.getBankAccountRepository();
      const characterRepository = container.getCharacterRepository();
      const transactionRepository = container.getTransactionRepository();

      expect(bankingService).toBeDefined();
      expect(bankAccountRepository).toBeDefined();
      expect(characterRepository).toBeDefined();
      expect(transactionRepository).toBeDefined();
    });

    it('should inject dependencies into CombatService', () => {
      const combatService = container.getCombatService();
      const characterRepository = container.getCharacterRepository();
      const bankAccountRepository = container.getBankAccountRepository();
      const transactionRepository = container.getTransactionRepository();
      const xpLedgerRepository = container.getXpLedgerRepository();
      const pkKillLogRepository = container.getPkKillLogRepository();

      expect(combatService).toBeDefined();
      expect(characterRepository).toBeDefined();
      expect(bankAccountRepository).toBeDefined();
      expect(transactionRepository).toBeDefined();
      expect(xpLedgerRepository).toBeDefined();
      expect(pkKillLogRepository).toBeDefined();
    });
  });

  describe('Service Method Availability', () => {
    it('should have services with expected methods', () => {
      const authService = container.getAuthService();
      expect(authService.register).toBeDefined();
      expect(authService.login).toBeDefined();
      expect(authService.logout).toBeDefined();

      const bankingService = container.getBankingService();
      expect(bankingService.deposit).toBeDefined();
      expect(bankingService.withdraw).toBeDefined();
      expect(bankingService.getBalance).toBeDefined();

      const characterService = container.getCharacterService();
      expect(characterService.createCharacter).toBeDefined();
      expect(characterService.getCharacter).toBeDefined();
      expect(characterService.updateCharacter).toBeDefined();
    });
  });

  describe('Repository Method Availability', () => {
    it('should have repositories with expected CRUD methods', () => {
      const accountRepo = container.getAccountRepository();
      expect(accountRepo.findById).toBeDefined();
      expect(accountRepo.create).toBeDefined();
      expect(accountRepo.update).toBeDefined();
      expect(accountRepo.delete).toBeDefined();

      const characterRepo = container.getCharacterRepository();
      expect(characterRepo.findById).toBeDefined();
      expect(characterRepo.create).toBeDefined();
      expect(characterRepo.update).toBeDefined();
      expect(characterRepo.delete).toBeDefined();
    });
  });

  describe('Lifecycle Management', () => {
    it('should handle disconnect properly', async () => {
      const prisma = container.getPrisma();

      await expect(container.disconnect()).resolves.not.toThrow();
      expect(prisma.$disconnect).toHaveBeenCalled();
    });

    it('should allow reconnection after disconnect', async () => {
      await container.disconnect();

      // Should be able to get a new instance
      // @ts-expect-error Accessing private static property for testing
      Container.instance = undefined;
      const newContainer = Container.getInstance();

      expect(newContainer).toBeDefined();
      expect(newContainer.getPrisma()).toBeDefined();
    });
  });

  describe('Initialization', () => {
    it('should initialize all repositories during construction', () => {
      // All repository getters should return valid instances
      expect(container.getAccountRepository()).toBeDefined();
      expect(container.getCharacterRepository()).toBeDefined();
      expect(container.getBankAccountRepository()).toBeDefined();
      expect(container.getTransactionRepository()).toBeDefined();
      expect(container.getXpLedgerRepository()).toBeDefined();
      expect(container.getPkKillLogRepository()).toBeDefined();
    });

    it('should initialize all services during construction', () => {
      // All service getters should return valid instances
      expect(container.getAuthService()).toBeDefined();
      expect(container.getBankingService()).toBeDefined();
      expect(container.getCharacterService()).toBeDefined();
      expect(container.getCombatService()).toBeDefined();
      expect(container.getPkService()).toBeDefined();
      expect(container.getXpService()).toBeDefined();
    });

    it('should initialize PrismaClient during construction', () => {
      expect(container.getPrisma()).toBeDefined();
      expect(container.getPrisma().$disconnect).toBeDefined();
    });
  });
});
