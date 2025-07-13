import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('XpLedger Model CRUD', () => {
  let characterId: string;

  beforeEach(async () => {
    // Clean up and create test data
    await prisma.xpLedger.deleteMany();
    await prisma.character.deleteMany();
    await prisma.account.deleteMany();

    const account = await prisma.account.create({
      data: {
        email: `xp-test-${Date.now()}@example.com`,
        hashedPassword: 'hash',
      },
    });

    const character = await prisma.character.create({
      data: {
        accountId: account.id,
        name: `XpTestHero-${Date.now()}`,
        level: 5,
        experience: 5000,
      },
    });

    characterId = character.id;
  });

  it('should create an XP gain entry', async () => {
    const xpEntry = await prisma.xpLedger.create({
      data: {
        characterId,
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
    const xpEntry = await prisma.xpLedger.create({
      data: {
        characterId,
        xpChange: -1000,
        reason: 'Death penalty (20% XP loss)',
      },
    });

    expect(xpEntry.xpChange).toBe(-1000);
    expect(xpEntry.xpChange).toBeLessThan(0);
  });

  it('should read XP entries with character', async () => {
    const xpEntry = await prisma.xpLedger.create({
      data: {
        characterId,
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
    expect(found?.character.name).toContain('XpTestHero-');
  });

  it('should find all XP entries for a character', async () => {
    await prisma.xpLedger.createMany({
      data: [
        {
          characterId,
          xpChange: 100,
          reason: 'Monster kill: Goblin',
        },
        {
          characterId,
          xpChange: 200,
          reason: 'Monster kill: Orc',
        },
        {
          characterId,
          xpChange: -500,
          reason: 'Death penalty',
        },
        {
          characterId,
          xpChange: 1000,
          reason: 'Quest completed',
        },
      ],
    });

    const entries = await prisma.xpLedger.findMany({
      where: { characterId },
      orderBy: { timestamp: 'desc' },
    });

    expect(entries).toHaveLength(4);
    expect(entries.some((e) => e.xpChange < 0)).toBe(true);
    expect(entries.some((e) => e.xpChange > 0)).toBe(true);
  });

  it('should calculate total XP changes', async () => {
    await prisma.xpLedger.createMany({
      data: [
        {
          characterId,
          xpChange: 1000,
          reason: 'Quest 1',
        },
        {
          characterId,
          xpChange: 500,
          reason: 'Quest 2',
        },
        {
          characterId,
          xpChange: -300,
          reason: 'Death penalty',
        },
      ],
    });

    const total = await prisma.xpLedger.aggregate({
      where: { characterId },
      _sum: {
        xpChange: true,
      },
    });

    expect(total._sum.xpChange).toBe(1200); // 1000 + 500 - 300
  });

  it('should find XP losses only', async () => {
    await prisma.xpLedger.createMany({
      data: [
        {
          characterId,
          xpChange: 100,
          reason: 'Gain',
        },
        {
          characterId,
          xpChange: -200,
          reason: 'Loss 1',
        },
        {
          characterId,
          xpChange: -300,
          reason: 'Loss 2',
        },
      ],
    });

    const losses = await prisma.xpLedger.findMany({
      where: {
        characterId,
        xpChange: { lt: 0 },
      },
    });

    expect(losses).toHaveLength(2);
    expect(losses.every((l) => l.xpChange < 0)).toBe(true);
  });

  it('should order entries by timestamp', async () => {
    const entry1 = await prisma.xpLedger.create({
      data: {
        characterId,
        xpChange: 100,
        reason: 'First',
        timestamp: new Date('2025-01-01'),
      },
    });

    const entry2 = await prisma.xpLedger.create({
      data: {
        characterId,
        xpChange: 200,
        reason: 'Second',
        timestamp: new Date('2025-01-02'),
      },
    });

    const entries = await prisma.xpLedger.findMany({
      where: { characterId },
      orderBy: { timestamp: 'asc' },
    });

    expect(entries[0].id).toBe(entry1.id);
    expect(entries[1].id).toBe(entry2.id);
  });
});
