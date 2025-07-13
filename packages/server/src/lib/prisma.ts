import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
// This ensures we don't create multiple instances in development

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'test'
        ? ['error']
        : process.env['NODE_ENV'] === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
