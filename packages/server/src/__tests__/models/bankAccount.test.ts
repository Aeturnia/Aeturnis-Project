import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('BankAccount Model CRUD', () => {
  let characterId: string;

  beforeEach(async () => {
    // Clean up and create test data
    await prisma.transaction.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.character.deleteMany();
    await prisma.account.deleteMany();

    const account = await prisma.account.create({
      data: {
        email: `bank-test-${Date.now()}@example.com`,
        hashedPassword: 'hash',
      },
    });

    const character = await prisma.character.create({
      data: {
        accountId: account.id,
        name: `BankTestHero-${Date.now()}`,
        gold: 1000,
      },
    });

    characterId = character.id;
  });

  it('should create a bank account', async () => {
    const bankAccount = await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 5000,
      },
    });

    expect(bankAccount).toBeDefined();
    expect(bankAccount.id).toBeDefined();
    expect(bankAccount.balance).toBe(5000);
    expect(bankAccount.createdAt).toBeInstanceOf(Date);
  });

  it('should read bank account with character', async () => {
    const bankAccount = await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 10000,
      },
    });

    const found = await prisma.bankAccount.findUnique({
      where: { id: bankAccount.id },
      include: {
        character: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.balance).toBe(10000);
    expect(found?.character.name).toContain('BankTestHero-');
  });

  it('should update bank balance', async () => {
    const bankAccount = await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 1000,
      },
    });

    const updated = await prisma.bankAccount.update({
      where: { id: bankAccount.id },
      data: {
        balance: 2000,
        lastBankedAt: new Date(),
      },
    });

    expect(updated.balance).toBe(2000);
    expect(updated.lastBankedAt).toBeInstanceOf(Date);
  });

  it('should enforce one bank account per character', async () => {
    await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 1000,
      },
    });

    await expect(
      prisma.bankAccount.create({
        data: {
          characterId,
          balance: 2000,
        },
      })
    ).rejects.toThrow();
  });

  it('should delete bank account', async () => {
    const bankAccount = await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 1000,
      },
    });

    await prisma.bankAccount.delete({
      where: { id: bankAccount.id },
    });

    const found = await prisma.bankAccount.findUnique({
      where: { id: bankAccount.id },
    });

    expect(found).toBeNull();
  });

  it('should find bank account by character', async () => {
    await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 7500,
      },
    });

    const found = await prisma.bankAccount.findUnique({
      where: { characterId },
    });

    expect(found).toBeDefined();
    expect(found?.balance).toBe(7500);
  });

  it('should handle large balances', async () => {
    const bankAccount = await prisma.bankAccount.create({
      data: {
        characterId,
        balance: 999999999,
      },
    });

    expect(bankAccount.balance).toBe(999999999);
  });
});
