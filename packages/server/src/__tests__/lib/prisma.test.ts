import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Prisma Client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should export prisma client', async () => {
    const module = await import('../../lib/prisma');
    expect(module.prisma).toBeDefined();
  });

  it('should create singleton in development', async () => {
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';

    // Clear global instance
    if (global.prisma) {
      delete global.prisma;
    }

    await import('../../lib/prisma');
    expect(global.prisma).toBeDefined();

    // Second import should use global instance
    vi.resetModules();
    const module2 = await import('../../lib/prisma');
    expect(module2.prisma).toBe(global.prisma);

    // Cleanup
    process.env['NODE_ENV'] = originalEnv;
    delete global.prisma;
  });

  it('should not create global instance in production', async () => {
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';

    // Clear global instance
    if (global.prisma) {
      delete global.prisma;
    }

    vi.resetModules();
    await import('../../lib/prisma');
    expect(global.prisma).toBeUndefined();

    // Cleanup
    process.env['NODE_ENV'] = originalEnv;
  });
});
