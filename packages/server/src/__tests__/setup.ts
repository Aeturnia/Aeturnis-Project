import { beforeAll, afterAll, afterEach } from 'vitest';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { prisma } from '@/lib/prisma';
import { TestTransactionWrapper } from './helpers/testTransaction';
import { cleanupTestData } from './helpers/factories';

// Load .env file from root directory
dotenv.config({ path: resolve(__dirname, '../../../.env') });

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

  // Use the centralized cleanup function with retry logic
  await cleanupTestData(3);
});

afterAll(async () => {
  // Clean up any remaining transactions
  await testTransactionWrapper.cleanup();
  await prisma.$disconnect();
});
