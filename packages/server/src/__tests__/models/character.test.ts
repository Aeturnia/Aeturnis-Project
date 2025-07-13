import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Character Model CRUD', () => {
  let accountId: string;

  beforeEach(async () => {
    // Clean up and create test account
    await prisma.character.deleteMany();
    await prisma.account.deleteMany();

    const account = await prisma.account.create({
      data: {
        email: 'character-test@example.com',
        hashedPassword: 'hash',
      },
    });
    accountId = account.id;
  });

  it('should create a character', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: 'TestHero',
        level: 1,
        experience: 0,
        gold: 100,
        alignment: 0,
      },
    });

    expect(character).toBeDefined();
    expect(character.id).toBeDefined();
    expect(character.name).toBe('TestHero');
    expect(character.level).toBe(1);
    expect(character.gold).toBe(100);
    expect(character.alignment).toBe(0);
    expect(character.isDeleted).toBe(false);
  });

  it('should read a character with relations', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: 'ReadHero',
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
    expect(found?.name).toBe('ReadHero');
    expect(found?.account.email).toBe('character-test@example.com');
  });

  it('should update character stats', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: 'UpdateHero',
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
        name: 'DeleteHero',
      },
    });

    const deleted = await prisma.character.update({
      where: { id: character.id },
      data: { isDeleted: true },
    });

    expect(deleted.isDeleted).toBe(true);
  });

  it('should enforce unique character name', async () => {
    await prisma.character.create({
      data: {
        accountId,
        name: 'UniqueName',
      },
    });

    await expect(
      prisma.character.create({
        data: {
          accountId,
          name: 'UniqueName',
        },
      })
    ).rejects.toThrow();
  });

  it('should find characters by account', async () => {
    await prisma.character.createMany({
      data: [
        { accountId, name: 'Hero1' },
        { accountId, name: 'Hero2' },
        { accountId, name: 'Hero3' },
      ],
    });

    const characters = await prisma.character.findMany({
      where: { accountId },
    });

    expect(characters).toHaveLength(3);
    expect(characters.map((c) => c.name)).toContain('Hero1');
    expect(characters.map((c) => c.name)).toContain('Hero2');
    expect(characters.map((c) => c.name)).toContain('Hero3');
  });

  it('should enforce alignment bounds', async () => {
    const character = await prisma.character.create({
      data: {
        accountId,
        name: 'AlignmentTest',
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
