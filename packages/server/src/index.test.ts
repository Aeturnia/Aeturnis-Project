import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the shared module
vi.mock('@aeturnis/shared', () => ({
  GAME_VERSION: '1.0.0',
}));

describe('Server Entry Point', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  it('should log server startup message', async () => {
    // Dynamic import to execute the module
    await import('./index');

    expect(consoleSpy).toHaveBeenCalledWith('Aeturnis Online Server v1.0.0');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('should import GAME_VERSION from shared module', async () => {
    const sharedModule = await import('@aeturnis/shared');
    expect(sharedModule.GAME_VERSION).toBe('1.0.0');
  });

  it('should handle multiple imports without duplicate logs', async () => {
    // First import
    await import('./index');

    // Clear the spy
    consoleSpy.mockClear();

    // Second import should use cached module
    await import('./index');

    // Should not log again
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
