import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { TestTransactionWrapper } from './helpers/testTransaction';

// Load .env file from root directory
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();
export const testTransactionWrapper = new TestTransactionWrapper(prisma);

beforeAll(async () => {
  // Ensure we have a database URL
  if (!process.env.DATABASE_URL) {
    // Set test database URL if not provided
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/aeturnis_test';
  }

  // Log which database we're using (helpful for debugging)
  // eslint-disable-next-line no-console
  console.log('Using database:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
});

afterEach(async () => {
  // Clean up any active transactions first
  await testTransactionWrapper.cleanup();

  // Then clean up test data after each test
  // Order matters due to foreign key constraints
  await prisma.pkKillLog.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.character.deleteMany();
  await prisma.account.deleteMany();
});

afterAll(async () => {
  // Clean up any remaining transactions
  await testTransactionWrapper.cleanup();
  await prisma.$disconnect();
});
