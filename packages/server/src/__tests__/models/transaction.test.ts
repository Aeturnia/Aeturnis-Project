import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

describe('Transaction Model CRUD', () => {
  let characterId: string;

  beforeEach(async () => {
    // Clean up and create test data
    await prisma.transaction.deleteMany();
    await prisma.character.deleteMany();
    await prisma.account.deleteMany();

    const account = await prisma.account.create({
      data: {
        email: 'transaction-test@example.com',
        hashedPassword: 'hash',
      },
    });

    const character = await prisma.character.create({
      data: {
        accountId: account.id,
        name: 'TransactionTestHero',
      },
    });

    characterId = character.id;
  });

  it('should create a deposit transaction', async () => {
    const transaction = await prisma.transaction.create({
      data: {
        characterId,
        amount: 1000,
        type: TransactionType.DEPOSIT,
        description: 'Test deposit',
      },
    });

    expect(transaction).toBeDefined();
    expect(transaction.id).toBeDefined();
    expect(transaction.amount).toBe(1000);
    expect(transaction.type).toBe('DEPOSIT');
    expect(transaction.description).toBe('Test deposit');
    expect(transaction.timestamp).toBeInstanceOf(Date);
  });

  it('should create a withdrawal transaction', async () => {
    const transaction = await prisma.transaction.create({
      data: {
        characterId,
        amount: 500,
        type: TransactionType.WITHDRAWAL,
        description: 'Test withdrawal',
      },
    });

    expect(transaction.type).toBe('WITHDRAWAL');
    expect(transaction.amount).toBe(500);
  });

  it('should create a death penalty transaction', async () => {
    const transaction = await prisma.transaction.create({
      data: {
        characterId,
        amount: 2000,
        type: TransactionType.DEATH_PENALTY,
        description: 'Lost all unbanked gold on death',
      },
    });

    expect(transaction.type).toBe('DEATH_PENALTY');
    expect(transaction.amount).toBe(2000);
  });

  it('should read transactions with character', async () => {
    const transaction = await prisma.transaction.create({
      data: {
        characterId,
        amount: 750,
        type: TransactionType.INTEREST,
        description: 'Daily interest',
      },
    });

    const found = await prisma.transaction.findUnique({
      where: { id: transaction.id },
      include: {
        character: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.character.name).toBe('TransactionTestHero');
  });

  it('should find all transactions for a character', async () => {
    await prisma.transaction.createMany({
      data: [
        {
          characterId,
          amount: 100,
          type: TransactionType.DEPOSIT,
          description: 'Deposit 1',
        },
        {
          characterId,
          amount: 50,
          type: TransactionType.WITHDRAWAL,
          description: 'Withdrawal 1',
        },
        {
          characterId,
          amount: 25,
          type: TransactionType.FEE,
          description: 'Bank fee',
        },
      ],
    });

    const transactions = await prisma.transaction.findMany({
      where: { characterId },
      orderBy: { timestamp: 'desc' },
    });

    expect(transactions).toHaveLength(3);
    expect(transactions.map((t) => t.type)).toContain('DEPOSIT');
    expect(transactions.map((t) => t.type)).toContain('WITHDRAWAL');
    expect(transactions.map((t) => t.type)).toContain('FEE');
  });

  it('should calculate transaction totals', async () => {
    await prisma.transaction.createMany({
      data: [
        {
          characterId,
          amount: 1000,
          type: TransactionType.DEPOSIT,
        },
        {
          characterId,
          amount: 300,
          type: TransactionType.WITHDRAWAL,
        },
        {
          characterId,
          amount: 50,
          type: TransactionType.INTEREST,
        },
      ],
    });

    const deposits = await prisma.transaction.aggregate({
      where: {
        characterId,
        type: TransactionType.DEPOSIT,
      },
      _sum: {
        amount: true,
      },
    });

    const withdrawals = await prisma.transaction.aggregate({
      where: {
        characterId,
        type: TransactionType.WITHDRAWAL,
      },
      _sum: {
        amount: true,
      },
    });

    expect(deposits._sum.amount).toBe(1000);
    expect(withdrawals._sum.amount).toBe(300);
  });

  it('should order transactions by timestamp', async () => {
    const tx1 = await prisma.transaction.create({
      data: {
        characterId,
        amount: 100,
        type: TransactionType.DEPOSIT,
        timestamp: new Date('2025-01-01'),
      },
    });

    const tx2 = await prisma.transaction.create({
      data: {
        characterId,
        amount: 200,
        type: TransactionType.DEPOSIT,
        timestamp: new Date('2025-01-02'),
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { characterId },
      orderBy: { timestamp: 'asc' },
    });

    expect(transactions[0].id).toBe(tx1.id);
    expect(transactions[1].id).toBe(tx2.id);
  });
});
