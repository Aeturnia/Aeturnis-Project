// Test factory helpers for creating related entities with proper foreign key relationships
import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';

/**
 * Creates an Account with default test data
 */
export async function createAccount(
  overrides?: Partial<{ email: string; hashedPassword: string }>
) {
  return await prisma.account.create({
    data: {
      email: overrides?.email ?? faker.internet.email(),
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

  const character = await prisma.character.create({
    data: {
      accountId: account.id,
      name: overrides?.character?.name ?? faker.person.firstName(),
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
  bankAccount?: Partial<{ goldBalance: number }>;
}) {
  const { account, character } = await createAccountWithCharacter({
    character: overrides?.character,
  });

  const bankAccount = await prisma.bankAccount.create({
    data: {
      characterId: character.id,
      goldBalance: overrides?.bankAccount?.goldBalance ?? 0,
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
      bankAccountId: bankAccount.id,
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
  xpLedger?: Partial<{ amount: number; reason: string }>;
}) {
  const { account, character } = await createAccountWithCharacter();

  const xpLedger = await prisma.xpLedger.create({
    data: {
      characterId: character.id,
      amount: overrides?.xpLedger?.amount ?? 100,
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
      attackerId: attackerData.character.id,
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
 */
export async function cleanupTestData() {
  // Delete in reverse order of dependencies
  await prisma.pkKillLog.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.character.deleteMany();
  await prisma.account.deleteMany();
}
