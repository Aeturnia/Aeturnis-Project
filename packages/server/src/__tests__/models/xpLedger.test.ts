import { describe, it, expect, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { createAccountWithCharacter, cleanupTestData } from '../helpers/factories';

const prisma = new PrismaClient();

describe('XpLedger Model CRUD', () => {
  afterEach(async () => {
    await cleanupTestData();
  });

  it('should create an XP gain entry', async () => {
    const { character } = await createAccountWithCharacter();

    const xpEntry = await prisma.xpLedger.create({
      data: {
        characterId: character.id,
        xpChange: 500,
        reason: 'Quest completed: Save the Village',
      },
    });

    expect(xpEntry).toBeDefined();
    expect(xpEntry.id).toBeDefined();
    expect(xpEntry.xpChange).toBe(500);
    expect(xpEntry.reason).toBe('Quest completed: Save the Village');
    expect(xpEntry.timestamp).toBeInstanceOf(Date);
  });

  it('should create an XP loss entry (death penalty)', async () => {
    const { character } = await createAccountWithCharacter();

    const xpEntry = await prisma.xpLedger.create({
      data: {
        characterId: character.id,
        xpChange: -1000,
        reason: 'Death penalty (20% XP loss)',
      },
    });

    expect(xpEntry.xpChange).toBe(-1000);
    expect(xpEntry.xpChange).toBeLessThan(0);
  });

  it('should read XP entries with character', async () => {
    const { character } = await createAccountWithCharacter();

    const xpEntry = await prisma.xpLedger.create({
      data: {
        characterId: character.id,
        xpChange: 250,
        reason: 'Monster kill: Dragon',
      },
    });

    const found = await prisma.xpLedger.findUnique({
      where: { id: xpEntry.id },
      include: {
        character: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.character.id).toBe(character.id);
  });

  it('should find all XP entries for a character', async () => {
    const { character } = await createAccountWithCharacter();

    await prisma.xpLedger.createMany({
      data: [
        {
          characterId: character.id,
          xpChange: 100,
          reason: 'Monster kill: Goblin',
        },
        {
          characterId: character.id,
          xpChange: 200,
          reason: 'Monster kill: Orc',
        },
        {
          characterId: character.id,
          xpChange: -500,
          reason: 'Death penalty',
        },
        {
          characterId: character.id,
          xpChange: 1000,
          reason: 'Quest completed',
        },
      ],
    });

    const entries = await prisma.xpLedger.findMany({
      where: { characterId: character.id },
      orderBy: { timestamp: 'desc' },
    });

    expect(entries).toHaveLength(4);
    expect(entries.some((e) => e.xpChange < 0)).toBe(true);
    expect(entries.some((e) => e.xpChange > 0)).toBe(true);
  });

  it('should calculate total XP changes', async () => {
    const { character } = await createAccountWithCharacter();

    await prisma.xpLedger.createMany({
      data: [
        {
          characterId: character.id,
          xpChange: 1000,
          reason: 'Quest 1',
        },
        {
          characterId: character.id,
          xpChange: 500,
          reason: 'Quest 2',
        },
        {
          characterId: character.id,
          xpChange: -300,
          reason: 'Death penalty',
        },
      ],
    });

    const total = await prisma.xpLedger.aggregate({
      where: { characterId: character.id },
      _sum: {
        xpChange: true,
      },
    });

    expect(total._sum.xpChange).toBe(1200); // 1000 + 500 - 300
  });

  it('should find XP losses only', async () => {
    const { character } = await createAccountWithCharacter();

    await prisma.xpLedger.createMany({
      data: [
        {
          characterId: character.id,
          xpChange: 100,
          reason: 'Gain',
        },
        {
          characterId: character.id,
          xpChange: -200,
          reason: 'Loss 1',
        },
        {
          characterId: character.id,
          xpChange: -300,
          reason: 'Loss 2',
        },
      ],
    });

    const losses = await prisma.xpLedger.findMany({
      where: {
        characterId: character.id,
        xpChange: { lt: 0 },
      },
    });

    expect(losses).toHaveLength(2);
    expect(losses.every((l) => l.xpChange < 0)).toBe(true);
  });

  it('should order entries by timestamp', async () => {
    const { character } = await createAccountWithCharacter();

    const entry1 = await prisma.xpLedger.create({
      data: {
        characterId: character.id,
        xpChange: 100,
        reason: 'First',
        timestamp: new Date('2025-01-01'),
      },
    });

    const entry2 = await prisma.xpLedger.create({
      data: {
        characterId: character.id,
        xpChange: 200,
        reason: 'Second',
        timestamp: new Date('2025-01-02'),
      },
    });

    const entries = await prisma.xpLedger.findMany({
      where: { characterId: character.id },
      orderBy: { timestamp: 'asc' },
    });

    expect(entries[0].id).toBe(entry1.id);
    expect(entries[1].id).toBe(entry2.id);
  });
});
