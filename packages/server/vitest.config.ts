import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
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
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90,
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
