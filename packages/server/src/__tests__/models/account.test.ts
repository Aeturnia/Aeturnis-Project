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
        email: `test-${Date.now()}@example.com`,
        hashedPassword,
      },
    });

    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.email).toContain('test-');
    expect(account.email).toContain('@example.com');
    expect(account.isActive).toBe(true);
    expect(account.createdAt).toBeInstanceOf(Date);
  });

  it('should read an account by id', async () => {
    const email = `read-${Date.now()}@example.com`;
    const created = await prisma.account.create({
      data: {
        email,
        hashedPassword: 'hash',
      },
    });

    const found = await prisma.account.findUnique({
      where: { id: created.id },
    });

    expect(found).toBeDefined();
    expect(found?.email).toBe(email);
  });

  it('should update an account', async () => {
    const account = await prisma.account.create({
      data: {
        email: `update-${Date.now()}@example.com`,
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
        email: `delete-${Date.now()}@example.com`,
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
    const uniqueEmail = `unique-${Date.now()}@example.com`;
    await prisma.account.create({
      data: {
        email: uniqueEmail,
        hashedPassword: 'hash',
      },
    });

    await expect(
      prisma.account.create({
        data: {
          email: uniqueEmail,
          hashedPassword: 'hash2',
        },
      })
    ).rejects.toThrow();
  });

  it('should find accounts by email', async () => {
    const email = `find-${Date.now()}@example.com`;
    await prisma.account.create({
      data: {
        email,
        hashedPassword: 'hash',
      },
    });

    const found = await prisma.account.findUnique({
      where: { email },
    });

    expect(found).toBeDefined();
    expect(found?.email).toBe(email);
  });
});
