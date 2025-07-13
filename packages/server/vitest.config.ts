import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Enforce serial execution to prevent race conditions
    fileParallelism: false,
    // Increase timeout for database operations
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'prisma/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**',
        '**/index.ts', // Exclude entry point as it's mostly imports
      ],
      thresholds: {
        statements: 10,
        branches: 10,
        functions: 0,
        lines: 10,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@aeturnis/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
});
