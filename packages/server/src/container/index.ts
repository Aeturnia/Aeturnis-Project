import { PrismaClient } from '@prisma/client';
import {
  AccountRepository,
  CharacterRepository,
  BankAccountRepository,
  TransactionRepository,
  XpLedgerRepository,
  PkKillLogRepository,
} from '../repositories';
import {
  AuthService,
  BankingService,
  CharacterService,
  CombatService,
  PKService,
  XPService,
} from '../services';

/**
 * Dependency injection container
 * Manages creation and lifecycle of services and repositories
 */
export class Container {
  private static instance: Container;
  private prisma: PrismaClient;

  // Repositories
  private accountRepository!: AccountRepository;
  private characterRepository!: CharacterRepository;
  private bankAccountRepository!: BankAccountRepository;
  private transactionRepository!: TransactionRepository;
  private xpLedgerRepository!: XpLedgerRepository;
  private pkKillLogRepository!: PkKillLogRepository;

  // Services
  private authService!: AuthService;
  private bankingService!: BankingService;
  private characterService!: CharacterService;
  private combatService!: CombatService;
  private pkService!: PKService;
  private xpService!: XPService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.initializeRepositories();
    this.initializeServices();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Initialize all repositories
   */
  private initializeRepositories(): void {
    this.accountRepository = new AccountRepository(this.prisma);
    this.characterRepository = new CharacterRepository(this.prisma);
    this.bankAccountRepository = new BankAccountRepository(this.prisma);
    this.transactionRepository = new TransactionRepository(this.prisma);
    this.xpLedgerRepository = new XpLedgerRepository(this.prisma);
    this.pkKillLogRepository = new PkKillLogRepository(this.prisma);
  }

  /**
   * Initialize all services with their dependencies
   */
  private initializeServices(): void {
    this.authService = new AuthService(this.accountRepository);

    this.bankingService = new BankingService(
      this.bankAccountRepository,
      this.characterRepository,
      this.transactionRepository
    );

    this.characterService = new CharacterService(this.characterRepository);

    this.combatService = new CombatService(
      this.characterRepository,
      this.bankAccountRepository,
      this.transactionRepository,
      this.xpLedgerRepository,
      this.pkKillLogRepository
    );

    this.pkService = new PKService(this.characterRepository, this.pkKillLogRepository);

    this.xpService = new XPService(this.characterRepository, this.xpLedgerRepository);
  }

  // Repository getters
  getAccountRepository(): AccountRepository {
    return this.accountRepository;
  }

  getCharacterRepository(): CharacterRepository {
    return this.characterRepository;
  }

  getBankAccountRepository(): BankAccountRepository {
    return this.bankAccountRepository;
  }

  getTransactionRepository(): TransactionRepository {
    return this.transactionRepository;
  }

  getXpLedgerRepository(): XpLedgerRepository {
    return this.xpLedgerRepository;
  }

  getPkKillLogRepository(): PkKillLogRepository {
    return this.pkKillLogRepository;
  }

  // Service getters
  getAuthService(): AuthService {
    return this.authService;
  }

  getBankingService(): BankingService {
    return this.bankingService;
  }

  getCharacterService(): CharacterService {
    return this.characterService;
  }

  getCombatService(): CombatService {
    return this.combatService;
  }

  getPkService(): PKService {
    return this.pkService;
  }

  getXpService(): XPService {
    return this.xpService;
  }

  /**
   * Get the Prisma client instance
   */
  getPrisma(): PrismaClient {
    return this.prisma;
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
