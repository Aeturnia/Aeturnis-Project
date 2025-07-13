import { describe, it, expect, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { createCharacterWithBankAccount, cleanupTestData } from '../helpers/factories';

const prisma = new PrismaClient();

describe('BankAccount Model CRUD', () => {
  afterEach(async () => {
    await cleanupTestData();
  });

  it('should create a bank account', async () => {
    const { character } = await createCharacterWithBankAccount({
      bankAccount: { balance: 5000 },
    });

    const bankAccount = await prisma.bankAccount.findUnique({
      where: { characterId: character.id },
    });

    expect(bankAccount).toBeDefined();
    expect(bankAccount?.id).toBeDefined();
    expect(bankAccount?.balance).toBe(5000);
    expect(bankAccount?.createdAt).toBeInstanceOf(Date);
  });

  it('should read bank account with character', async () => {
    const { character, bankAccount } = await createCharacterWithBankAccount({
      bankAccount: { balance: 10000 },
    });

    const found = await prisma.bankAccount.findUnique({
      where: { id: bankAccount.id },
      include: {
        character: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.balance).toBe(10000);
    expect(found?.character.id).toBe(character.id);
  });

  it('should update bank balance', async () => {
    const { bankAccount } = await createCharacterWithBankAccount({
      bankAccount: { balance: 1000 },
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
    const { character } = await createCharacterWithBankAccount({
      bankAccount: { balance: 1000 },
    });

    await expect(
      prisma.bankAccount.create({
        data: {
          characterId: character.id,
          balance: 2000,
        },
      })
    ).rejects.toThrow();
  });

  it('should delete bank account', async () => {
    const { bankAccount } = await createCharacterWithBankAccount({
      bankAccount: { balance: 1000 },
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
    const { character } = await createCharacterWithBankAccount({
      bankAccount: { balance: 7500 },
    });

    const found = await prisma.bankAccount.findUnique({
      where: { characterId: character.id },
    });

    expect(found).toBeDefined();
    expect(found?.balance).toBe(7500);
  });

  it('should handle large balances', async () => {
    const { character } = await createCharacterWithBankAccount({
      bankAccount: { balance: 999999999 },
    });

    const bankAccount = await prisma.bankAccount.findUnique({
      where: { characterId: character.id },
    });

    expect(bankAccount?.balance).toBe(999999999);
  });
});
