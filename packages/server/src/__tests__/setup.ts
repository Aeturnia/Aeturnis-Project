import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  // Clean up test data after each test
  // Order matters due to foreign key constraints
  await prisma.pkKillLog.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.character.deleteMany();
  await prisma.account.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
