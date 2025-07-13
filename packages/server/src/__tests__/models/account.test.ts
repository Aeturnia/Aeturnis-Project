import { describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Account Model CRUD', () => {
  beforeEach(async () => {
    // Clean up before each test
    await prisma.account.deleteMany();
  });

  it('should create an account', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const account = await prisma.account.create({
      data: {
        email: 'test@example.com',
        hashedPassword,
      },
    });

    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.email).toBe('test@example.com');
    expect(account.isActive).toBe(true);
    expect(account.createdAt).toBeInstanceOf(Date);
  });

  it('should read an account by id', async () => {
    const created = await prisma.account.create({
      data: {
        email: 'read@example.com',
        hashedPassword: 'hash',
      },
    });

    const found = await prisma.account.findUnique({
      where: { id: created.id },
    });

    expect(found).toBeDefined();
    expect(found?.email).toBe('read@example.com');
  });

  it('should update an account', async () => {
    const account = await prisma.account.create({
      data: {
        email: 'update@example.com',
        hashedPassword: 'hash',
      },
    });

    const updated = await prisma.account.update({
      where: { id: account.id },
      data: {
        lastLoginAt: new Date(),
        isActive: false,
      },
    });

    expect(updated.lastLoginAt).toBeInstanceOf(Date);
    expect(updated.isActive).toBe(false);
  });

  it('should delete an account', async () => {
    const account = await prisma.account.create({
      data: {
        email: 'delete@example.com',
        hashedPassword: 'hash',
      },
    });

    await prisma.account.delete({
      where: { id: account.id },
    });

    const found = await prisma.account.findUnique({
      where: { id: account.id },
    });

    expect(found).toBeNull();
  });

  it('should enforce unique email constraint', async () => {
    await prisma.account.create({
      data: {
        email: 'unique@example.com',
        hashedPassword: 'hash',
      },
    });

    await expect(
      prisma.account.create({
        data: {
          email: 'unique@example.com',
          hashedPassword: 'hash2',
        },
      })
    ).rejects.toThrow();
  });

  it('should find accounts by email', async () => {
    await prisma.account.create({
      data: {
        email: 'find@example.com',
        hashedPassword: 'hash',
      },
    });

    const found = await prisma.account.findUnique({
      where: { email: 'find@example.com' },
    });

    expect(found).toBeDefined();
    expect(found?.email).toBe('find@example.com');
  });
});
