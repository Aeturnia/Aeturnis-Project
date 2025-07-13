import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createPkKillLog, createPkKillLogSetup } from '../helpers/factories';

describe('PkKillLog Model CRUD', () => {
  it('should create a PK kill log', async () => {
    const { attacker, victim } = await createPkKillLogSetup();

    const pkLog = await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'wilderness',
      },
    });

    expect(pkLog).toBeDefined();
    expect(pkLog.id).toBeDefined();
    expect(pkLog.killerId).toBe(attacker.character.id);
    expect(pkLog.victimId).toBe(victim.character.id);
    expect(pkLog.zoneId).toBe('wilderness');
    expect(pkLog.timestamp).toBeInstanceOf(Date);
  });

  it('should read PK log with killer and victim', async () => {
    const { pkKillLog } = await createPkKillLog();

    const found = await prisma.pkKillLog.findUnique({
      where: { id: pkKillLog.id },
      include: {
        killer: true,
        victim: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.killer).toBeDefined();
    expect(found?.victim).toBeDefined();
  });

  it('should find kills by killer', async () => {
    const { attacker, victim } = await createPkKillLogSetup();
    const { victim: victim2 } = await createPkKillLogSetup();

    // Create first kill
    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone1',
      },
    });

    // Create second kill
    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim2.character.id,
        zoneId: 'zone2',
      },
    });

    const kills = await prisma.pkKillLog.findMany({
      where: { killerId: attacker.character.id },
    });

    expect(kills).toHaveLength(2);
  });

  it('should find deaths by victim', async () => {
    const { attacker, victim } = await createPkKillLogSetup();
    const { attacker: killer2 } = await createPkKillLogSetup();

    // Create first death
    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone1',
      },
    });

    // Create second death
    await prisma.pkKillLog.create({
      data: {
        killerId: killer2.character.id,
        victimId: victim.character.id,
        zoneId: 'zone2',
      },
    });

    const deaths = await prisma.pkKillLog.findMany({
      where: { victimId: victim.character.id },
    });

    expect(deaths).toHaveLength(2);
  });

  it('should find recent kills for cooldown check', async () => {
    const { attacker, victim } = await createPkKillLogSetup();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Create kills at different timestamps
    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone1',
        timestamp: new Date(), // Now
      },
    });

    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      },
    });

    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone3',
        timestamp: oneHourAgo, // 1 hour ago
      },
    });

    // Find kills within last 10 minutes
    const recentKills = await prisma.pkKillLog.findMany({
      where: {
        killerId: attacker.character.id,
        timestamp: {
          gte: tenMinutesAgo,
        },
      },
    });

    expect(recentKills).toHaveLength(2); // The two recent kills

    // Find kills within last hour (for 6 kills/hour limit)
    const hourlyKills = await prisma.pkKillLog.findMany({
      where: {
        killerId: attacker.character.id,
        timestamp: {
          gte: oneHourAgo,
        },
      },
    });

    expect(hourlyKills).toHaveLength(3); // All three kills
  });

  it('should track kills by zone', async () => {
    const { attacker, victim } = await createPkKillLogSetup();

    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'wilderness',
      },
    });

    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'wilderness',
      },
    });

    await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'pvp_arena',
      },
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
    const { attacker, victim } = await createPkKillLogSetup();

    const log1 = await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone1',
        timestamp: new Date('2025-01-01'),
      },
    });

    const log2 = await prisma.pkKillLog.create({
      data: {
        killerId: attacker.character.id,
        victimId: victim.character.id,
        zoneId: 'zone2',
        timestamp: new Date('2025-01-02'),
      },
    });

    const logs = await prisma.pkKillLog.findMany({
      where: { killerId: attacker.character.id },
      orderBy: { timestamp: 'desc' },
    });

    // The first log should be the most recent one
    expect(logs.find((l) => l.zoneId === 'zone2')?.id).toBe(log2.id);
    expect(logs.find((l) => l.zoneId === 'zone1')?.id).toBe(log1.id);
  });
});
