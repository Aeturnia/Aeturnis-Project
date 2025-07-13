import { describe, it, expect } from 'vitest';
import { TransactionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createAccountWithCharacter } from '../helpers/factories';

describe('Transaction Model CRUD', () => {
  it('should create a deposit transaction', async () => {
    const { character } = await createAccountWithCharacter();

    const transaction = await prisma.transaction.create({
      data: {
        characterId: character.id,
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
    const { character } = await createAccountWithCharacter();

    const transaction = await prisma.transaction.create({
      data: {
        characterId: character.id,
        amount: 500,
        type: TransactionType.WITHDRAWAL,
        description: 'Test withdrawal',
      },
    });

    expect(transaction.type).toBe('WITHDRAWAL');
    expect(transaction.amount).toBe(500);
  });

  it('should create a death penalty transaction', async () => {
    const { character } = await createAccountWithCharacter();

    const transaction = await prisma.transaction.create({
      data: {
        characterId: character.id,
        amount: 2000,
        type: TransactionType.DEATH_PENALTY,
        description: 'Lost all unbanked gold on death',
      },
    });

    expect(transaction.type).toBe('DEATH_PENALTY');
    expect(transaction.amount).toBe(2000);
  });

  it('should read transactions with character', async () => {
    const { character } = await createAccountWithCharacter();

    const transaction = await prisma.transaction.create({
      data: {
        characterId: character.id,
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
    expect(found?.character.id).toBe(character.id);
  });

  it('should find all transactions for a character', async () => {
    const { character } = await createAccountWithCharacter();

    await prisma.transaction.createMany({
      data: [
        {
          characterId: character.id,
          amount: 100,
          type: TransactionType.DEPOSIT,
          description: 'Deposit 1',
        },
        {
          characterId: character.id,
          amount: 50,
          type: TransactionType.WITHDRAWAL,
          description: 'Withdrawal 1',
        },
        {
          characterId: character.id,
          amount: 25,
          type: TransactionType.FEE,
          description: 'Bank fee',
        },
      ],
    });

    const transactions = await prisma.transaction.findMany({
      where: { characterId: character.id },
      orderBy: { timestamp: 'desc' },
    });

    expect(transactions).toHaveLength(3);
    expect(transactions.map((t) => t.type)).toContain('DEPOSIT');
    expect(transactions.map((t) => t.type)).toContain('WITHDRAWAL');
    expect(transactions.map((t) => t.type)).toContain('FEE');
  });

  it('should calculate transaction totals', async () => {
    const { character } = await createAccountWithCharacter();

    await prisma.transaction.createMany({
      data: [
        {
          characterId: character.id,
          amount: 1000,
          type: TransactionType.DEPOSIT,
        },
        {
          characterId: character.id,
          amount: 300,
          type: TransactionType.WITHDRAWAL,
        },
        {
          characterId: character.id,
          amount: 50,
          type: TransactionType.INTEREST,
        },
      ],
    });

    const deposits = await prisma.transaction.aggregate({
      where: {
        characterId: character.id,
        type: TransactionType.DEPOSIT,
      },
      _sum: {
        amount: true,
      },
    });

    const withdrawals = await prisma.transaction.aggregate({
      where: {
        characterId: character.id,
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
    const { character } = await createAccountWithCharacter();

    const tx1 = await prisma.transaction.create({
      data: {
        characterId: character.id,
        amount: 100,
        type: TransactionType.DEPOSIT,
        timestamp: new Date('2025-01-01'),
      },
    });

    const tx2 = await prisma.transaction.create({
      data: {
        characterId: character.id,
        amount: 200,
        type: TransactionType.DEPOSIT,
        timestamp: new Date('2025-01-02'),
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { characterId: character.id },
      orderBy: { timestamp: 'asc' },
    });

    expect(transactions[0].id).toBe(tx1.id);
    expect(transactions[1].id).toBe(tx2.id);
  });
});
