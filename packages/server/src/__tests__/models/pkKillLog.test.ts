import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('PkKillLog Model CRUD', () => {
  let killerId: string;
  let victimId: string;

  beforeEach(async () => {
    // Clean up and create test data
    await prisma.pkKillLog.deleteMany();
    await prisma.character.deleteMany();
    await prisma.account.deleteMany();

    const account = await prisma.account.create({
      data: {
        email: `pk-test-${Date.now()}@example.com`,
        hashedPassword: 'hash',
      },
    });

    const killer = await prisma.character.create({
      data: {
        accountId: account.id,
        name: `PKKiller-${Date.now()}`,
        level: 10,
        alignment: -500,
      },
    });

    const victim = await prisma.character.create({
      data: {
        accountId: account.id,
        name: `PKVictim-${Date.now() + 1}`,
        level: 8,
        alignment: 300,
      },
    });

    killerId = killer.id;
    victimId = victim.id;
  });

  it('should create a PK kill log', async () => {
    const pkLog = await prisma.pkKillLog.create({
      data: {
        killerId,
        victimId,
        zoneId: 'wilderness',
      },
    });

    expect(pkLog).toBeDefined();
    expect(pkLog.id).toBeDefined();
    expect(pkLog.killerId).toBe(killerId);
    expect(pkLog.victimId).toBe(victimId);
    expect(pkLog.zoneId).toBe('wilderness');
    expect(pkLog.timestamp).toBeInstanceOf(Date);
  });

  it('should read PK log with killer and victim', async () => {
    const pkLog = await prisma.pkKillLog.create({
      data: {
        killerId,
        victimId,
        zoneId: 'pvp_arena',
      },
    });

    const found = await prisma.pkKillLog.findUnique({
      where: { id: pkLog.id },
      include: {
        killer: true,
        victim: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.killer.name).toContain('PKKiller-');
    expect(found?.victim.name).toContain('PKVictim-');
  });

  it('should find kills by killer', async () => {
    // Create another victim
    const victim2 = await prisma.character.create({
      data: {
        accountId: (await prisma.account.findFirst())!.id,
        name: `PKVictim2-${Date.now()}`,
      },
    });

    await prisma.pkKillLog.createMany({
      data: [
        {
          killerId,
          victimId,
          zoneId: 'zone1',
        },
        {
          killerId,
          victimId: victim2.id,
          zoneId: 'zone2',
        },
      ],
    });

    const kills = await prisma.pkKillLog.findMany({
      where: { killerId },
    });

    expect(kills).toHaveLength(2);
  });

  it('should find deaths by victim', async () => {
    // Create another killer
    const killer2 = await prisma.character.create({
      data: {
        accountId: (await prisma.account.findFirst())!.id,
        name: `PKKiller2-${Date.now()}`,
      },
    });

    await prisma.pkKillLog.createMany({
      data: [
        {
          killerId,
          victimId,
          zoneId: 'zone1',
        },
        {
          killerId: killer2.id,
          victimId,
          zoneId: 'zone2',
        },
      ],
    });

    const deaths = await prisma.pkKillLog.findMany({
      where: { victimId },
    });

    expect(deaths).toHaveLength(2);
  });

  it('should find recent kills for cooldown check', async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    await prisma.pkKillLog.createMany({
      data: [
        {
          killerId,
          victimId,
          zoneId: 'zone1',
          timestamp: new Date(), // Now
        },
        {
          killerId,
          victimId,
          zoneId: 'zone2',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        },
        {
          killerId,
          victimId,
          zoneId: 'zone3',
          timestamp: oneHourAgo, // 1 hour ago
        },
      ],
    });

    // Find kills within last 10 minutes
    const recentKills = await prisma.pkKillLog.findMany({
      where: {
        killerId,
        timestamp: {
          gte: tenMinutesAgo,
        },
      },
    });

    expect(recentKills).toHaveLength(2);

    // Find kills within last hour (for 6 kills/hour limit)
    const hourlyKills = await prisma.pkKillLog.findMany({
      where: {
        killerId,
        timestamp: {
          gte: oneHourAgo,
        },
      },
    });

    expect(hourlyKills).toHaveLength(3);
  });

  it('should track kills by zone', async () => {
    await prisma.pkKillLog.createMany({
      data: [
        {
          killerId,
          victimId,
          zoneId: 'wilderness',
        },
        {
          killerId,
          victimId,
          zoneId: 'wilderness',
        },
        {
          killerId,
          victimId,
          zoneId: 'pvp_arena',
        },
      ],
    });

    const wildernessKills = await prisma.pkKillLog.findMany({
      where: {
        zoneId: 'wilderness',
      },
    });

    const arenaKills = await prisma.pkKillLog.findMany({
      where: {
        zoneId: 'pvp_arena',
      },
    });

    expect(wildernessKills).toHaveLength(2);
    expect(arenaKills).toHaveLength(1);
  });

  it('should order kills by timestamp', async () => {
    const log1 = await prisma.pkKillLog.create({
      data: {
        killerId,
        victimId,
        zoneId: 'zone1',
        timestamp: new Date('2025-01-01'),
      },
    });

    const log2 = await prisma.pkKillLog.create({
      data: {
        killerId,
        victimId,
        zoneId: 'zone2',
        timestamp: new Date('2025-01-02'),
      },
    });

    const logs = await prisma.pkKillLog.findMany({
      where: { killerId },
      orderBy: { timestamp: 'desc' },
    });

    expect(logs[0].id).toBe(log2.id);
    expect(logs[1].id).toBe(log1.id);
  });
});
