// Database transaction wrapper for test isolation
import { PrismaClient } from '@prisma/client';

/**
 * Provides database transaction isolation for tests to prevent race conditions
 * and ensure each test runs in a clean, isolated environment.
 */
export class TestTransactionWrapper {
  private prisma: PrismaClient;
  private transactions: Map<string, unknown> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Creates a new transaction context for a test
   * @param testId - Unique identifier for the test
   * @returns Transaction-wrapped Prisma client
   */
  async createTestTransaction(testId: string) {
    if (this.transactions.has(testId)) {
      throw new Error(`Transaction for test ${testId} already exists`);
    }

    const _transaction = await this.prisma
      .$transaction(async (tx) => {
        // Store the transaction for cleanup
        this.transactions.set(testId, tx);

        // Return a promise that will be resolved by rollbackTransaction
        return new Promise((resolve, reject) => {
          // Store resolve/reject for later use
          this.transactions.set(`${testId}_resolve`, resolve);
          this.transactions.set(`${testId}_reject`, reject);
        });
      })
      .catch((error) => {
        // If transaction is rolled back, clean up
        this.transactions.delete(testId);
        this.transactions.delete(`${testId}_resolve`);
        this.transactions.delete(`${testId}_reject`);

        // Don't throw the rollback error - it's expected
        if (!error.message.includes('Transaction aborted')) {
          throw error;
        }
      });

    return this.transactions.get(testId);
  }

  /**
   * Gets the transaction client for a test
   * @param testId - Unique identifier for the test
   * @returns Transaction-wrapped Prisma client
   */
  getTransactionClient(testId: string) {
    const tx = this.transactions.get(testId);
    if (!tx) {
      throw new Error(`No transaction found for test ${testId}`);
    }
    return tx;
  }

  /**
   * Rolls back the transaction to clean up test data
   * @param testId - Unique identifier for the test
   */
  async rollbackTransaction(testId: string) {
    const reject = this.transactions.get(`${testId}_reject`);
    if (reject) {
      // Reject the transaction promise to trigger rollback
      reject(new Error('Transaction aborted'));

      // Clean up
      this.transactions.delete(testId);
      this.transactions.delete(`${testId}_resolve`);
      this.transactions.delete(`${testId}_reject`);
    }
  }

  /**
   * Commits the transaction (for successful test cleanup)
   * @param testId - Unique identifier for the test
   */
  async commitTransaction(testId: string) {
    const resolve = this.transactions.get(`${testId}_resolve`);
    if (resolve) {
      resolve();

      // Clean up
      this.transactions.delete(testId);
      this.transactions.delete(`${testId}_resolve`);
      this.transactions.delete(`${testId}_reject`);
    }
  }

  /**
   * Cleans up all active transactions
   */
  async cleanup() {
    const testIds = Array.from(this.transactions.keys()).filter(
      (key) => !key.includes('_resolve') && !key.includes('_reject')
    );

    for (const testId of testIds) {
      await this.rollbackTransaction(testId);
    }
  }
}

/**
 * Factory helpers using transaction isolation
 */
export class TransactionalFactoryHelpers {
  private tx: unknown;
  private uniqueSuffix: string;

  constructor(transactionClient: unknown) {
    this.tx = transactionClient;
    this.uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Creates an Account with transaction isolation
   */
  async createAccount(overrides?: Partial<{ email: string; hashedPassword: string }>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (this.tx as any).account.create({
      data: {
        email: overrides?.email ?? `test-${this.uniqueSuffix}@example.com`,
        hashedPassword: overrides?.hashedPassword ?? 'test-password-hash',
      },
    });
  }

  /**
   * Creates an Account and Character pair with transaction isolation
   */
  async createAccountWithCharacter(overrides?: {
    account?: Partial<{ email: string; hashedPassword: string }>;
    character?: Partial<{
      name: string;
      level: number;
      experience: number;
      gold: number;
      alignment: number;
    }>;
  }) {
    const account = await this.createAccount(overrides?.account);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const character = await (this.tx as any).character.create({
      data: {
        accountId: account.id,
        name: overrides?.character?.name ?? `TestChar-${this.uniqueSuffix}`,
        level: overrides?.character?.level ?? 1,
        experience: overrides?.character?.experience ?? 0,
        gold: overrides?.character?.gold ?? 0,
        alignment: overrides?.character?.alignment ?? 0,
      },
    });

    return { account, character };
  }

  /**
   * Creates a Character with Bank Account using transaction isolation
   */
  async createCharacterWithBankAccount(overrides?: {
    character?: Partial<{ name: string; level: number }>;
    bankAccount?: Partial<{ balance: number }>;
  }) {
    const { account, character } = await this.createAccountWithCharacter({
      character: overrides?.character,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bankAccount = await (this.tx as any).bankAccount.create({
      data: {
        characterId: character.id,
        balance: overrides?.bankAccount?.balance ?? 0,
      },
    });

    return { account, character, bankAccount };
  }

  /**
   * Creates a full banking transaction setup using transaction isolation
   */
  async createBankingTransaction(overrides?: {
    transaction?: Partial<{ amount: number; type: 'DEPOSIT' | 'WITHDRAWAL' }>;
  }) {
    const { account, character, bankAccount } = await this.createCharacterWithBankAccount();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = await (this.tx as any).transaction.create({
      data: {
        characterId: character.id,
        amount: overrides?.transaction?.amount ?? 100,
        type: overrides?.transaction?.type ?? 'DEPOSIT',
        timestamp: new Date(),
      },
    });

    return { account, character, bankAccount, transaction };
  }

  /**
   * Creates an XP ledger entry using transaction isolation
   */
  async createXpLedgerEntry(overrides?: {
    xpLedger?: Partial<{ xpChange: number; reason: string }>;
  }) {
    const { account, character } = await this.createAccountWithCharacter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xpLedger = await (this.tx as any).xpLedger.create({
      data: {
        characterId: character.id,
        xpChange: overrides?.xpLedger?.xpChange ?? 100,
        reason: overrides?.xpLedger?.reason ?? 'Quest completion',
        timestamp: new Date(),
      },
    });

    return { account, character, xpLedger };
  }

  /**
   * Creates a PK kill log with attacker and victim using transaction isolation
   */
  async createPkKillLog(overrides?: {
    attacker?: Partial<{ name: string; level: number }>;
    victim?: Partial<{ name: string; level: number }>;
  }) {
    // Create attacker
    const attackerData = await this.createAccountWithCharacter({
      character: {
        name: `Attacker-${this.uniqueSuffix}`,
        ...overrides?.attacker,
      },
    });

    // Create victim
    const victimData = await this.createAccountWithCharacter({
      character: {
        name: `Victim-${this.uniqueSuffix}`,
        ...overrides?.victim,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkKillLog = await (this.tx as any).pkKillLog.create({
      data: {
        killerId: attackerData.character.id,
        victimId: victimData.character.id,
        timestamp: new Date(),
      },
    });

    return {
      attacker: attackerData,
      victim: victimData,
      pkKillLog,
    };
  }
}
