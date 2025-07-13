// Test factory helpers for creating related entities with proper foreign key relationships
import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';

/**
 * Creates unique identifiers for test data to prevent collisions
 */
export function createUniqueTestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates an Account with default test data
 */
export async function createAccount(
  overrides?: Partial<{ email: string; hashedPassword: string }>
) {
  // Generate unique email to prevent collisions
  const uniqueEmail = overrides?.email ?? `test-${createUniqueTestId()}@example.com`;

  return await prisma.account.create({
    data: {
      email: uniqueEmail,
      hashedPassword: overrides?.hashedPassword ?? faker.internet.password(),
    },
  });
}

/**
 * Creates an Account and Character pair with proper FK relationship
 */
export async function createAccountWithCharacter(overrides?: {
  account?: Partial<{ email: string; hashedPassword: string }>;
  character?: Partial<{
    name: string;
    level: number;
    experience: number;
    gold: number;
    alignment: number;
  }>;
}) {
  const account = await createAccount(overrides?.account);

  // Generate unique character name with timestamp and random suffix to avoid collisions
  const uniqueName =
    overrides?.character?.name ?? `${faker.person.firstName()}-${createUniqueTestId()}`;

  const character = await prisma.character.create({
    data: {
      accountId: account.id,
      name: uniqueName,
      level: overrides?.character?.level ?? 1,
      experience: overrides?.character?.experience ?? 0,
      gold: overrides?.character?.gold ?? 0,
      alignment: overrides?.character?.alignment ?? 0,
    },
  });

  return { account, character };
}

/**
 * Creates a Character with Bank Account
 */
export async function createCharacterWithBankAccount(overrides?: {
  character?: Partial<{ name: string; level: number }>;
  bankAccount?: Partial<{ balance: number }>;
}) {
  const { account, character } = await createAccountWithCharacter({
    character: overrides?.character,
  });

  const bankAccount = await prisma.bankAccount.create({
    data: {
      characterId: character.id,
      balance: overrides?.bankAccount?.balance ?? 0,
    },
  });

  return { account, character, bankAccount };
}

/**
 * Creates a full banking transaction setup
 */
export async function createBankingTransaction(overrides?: {
  transaction?: Partial<{ amount: number; type: 'DEPOSIT' | 'WITHDRAWAL' }>;
}) {
  const { account, character, bankAccount } = await createCharacterWithBankAccount();

  const transaction = await prisma.transaction.create({
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
 * Creates an XP ledger entry with proper character
 */
export async function createXpLedgerEntry(overrides?: {
  xpLedger?: Partial<{ xpChange: number; reason: string }>;
}) {
  const { account, character } = await createAccountWithCharacter();

  const xpLedger = await prisma.xpLedger.create({
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
 * Creates a PK kill log with attacker and victim
 */
export async function createPkKillLog(overrides?: {
  attacker?: Partial<{ name: string; level: number }>;
  victim?: Partial<{ name: string; level: number }>;
}) {
  // Create attacker
  const attackerData = await createAccountWithCharacter({
    character: overrides?.attacker,
  });

  // Create victim
  const victimData = await createAccountWithCharacter({
    character: overrides?.victim,
  });

  const pkKillLog = await prisma.pkKillLog.create({
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

/**
 * Cleans up all test data (use in afterEach)
 * Enhanced with retry logic to handle race conditions
 */
export async function cleanupTestData(retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      // Delete in reverse order of dependencies with explicit error handling
      const deletePromises = [
        prisma.pkKillLog
          .deleteMany()
          .catch((e) => console.warn('PkKillLog cleanup warning:', e.message)),
        prisma.xpLedger
          .deleteMany()
          .catch((e) => console.warn('XpLedger cleanup warning:', e.message)),
        prisma.transaction
          .deleteMany()
          .catch((e) => console.warn('Transaction cleanup warning:', e.message)),
      ];

      await Promise.all(deletePromises);

      // Then clean bank accounts and characters
      await prisma.bankAccount
        .deleteMany()
        .catch((e) => console.warn('BankAccount cleanup warning:', e.message));
      await prisma.character
        .deleteMany()
        .catch((e) => console.warn('Character cleanup warning:', e.message));
      await prisma.account
        .deleteMany()
        .catch((e) => console.warn('Account cleanup warning:', e.message));

      break; // Success, exit retry loop
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        console.error('Failed to cleanup test data after', retries, 'attempts:', error);
        throw error;
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
}
