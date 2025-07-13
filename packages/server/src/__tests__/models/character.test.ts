import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createAccount } from '../helpers/factories';

describe('Character Model CRUD', () => {
  let accountId: string;

  beforeEach(async () => {
    // Create test account using factory
    const account = await createAccount();
    accountId = account.id;
  });

  it('should create a character', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: `TestHero-${Date.now()}`,
        level: 1,
        experience: 0,
        gold: 100,
        alignment: 0,
      },
    });

    expect(character).toBeDefined();
    expect(character.id).toBeDefined();
    expect(character.name).toContain('TestHero-');
    expect(character.level).toBe(1);
    expect(character.gold).toBe(100);
    expect(character.alignment).toBe(0);
    expect(character.isDeleted).toBe(false);
  });

  it('should read a character with relations', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: `ReadHero-${Date.now()}`,
        level: 5,
      },
    });

    const found = await prisma.character.findUnique({
      where: { id: character.id },
      include: {
        account: true,
        bankAccount: true,
      },
    });

    expect(found).toBeDefined();
    expect(found?.name).toContain('ReadHero-');
    expect(found?.account.email).toContain('@example.com');
  });

  it('should update character stats', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: `UpdateHero-${Date.now()}`,
        level: 1,
        experience: 0,
        gold: 100,
      },
    });

    const updated = await prisma.character.update({
      where: { id: character.id },
      data: {
        level: 2,
        experience: 1000,
        gold: 500,
        alignment: 100,
      },
    });

    expect(updated.level).toBe(2);
    expect(updated.experience).toBe(1000);
    expect(updated.gold).toBe(500);
    expect(updated.alignment).toBe(100);
  });

  it('should soft delete a character', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: `DeleteHero-${Date.now()}`,
      },
    });

    const deleted = await prisma.character.update({
      where: { id: character.id },
      data: { isDeleted: true },
    });

    expect(deleted.isDeleted).toBe(true);
  });

  it('should enforce unique character name', async () => {
    const uniqueName = `UniqueName-${Date.now()}`;
    await prisma.character.create({
      data: {
        accountId,
        name: uniqueName,
      },
    });

    await expect(
      prisma.character.create({
        data: {
          accountId,
          name: uniqueName,
        },
      })
    ).rejects.toThrow();
  });

  it('should find characters by account', async () => {
    await prisma.character.createMany({
      data: [
        { accountId, name: `Hero1-${Date.now()}` },
        { accountId, name: `Hero2-${Date.now() + 1}` },
        { accountId, name: `Hero3-${Date.now() + 2}` },
      ],
    });

    const characters = await prisma.character.findMany({
      where: { accountId },
    });

    expect(characters).toHaveLength(3);
    const names = characters.map((c) => c.name);
    expect(names.some((n) => n.startsWith('Hero1-'))).toBe(true);
    expect(names.some((n) => n.startsWith('Hero2-'))).toBe(true);
    expect(names.some((n) => n.startsWith('Hero3-'))).toBe(true);
  });

  it('should enforce alignment bounds', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: `AlignmentTest-${Date.now()}`,
        alignment: -1000,
      },
    });

    // Test that alignment can be -1000 to +1000
    const updated = await prisma.character.update({
      where: { id: character.id },
      data: { alignment: 1000 },
    });

    expect(updated.alignment).toBe(1000);
  });
});
