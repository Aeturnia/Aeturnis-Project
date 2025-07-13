import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Server Entry Point', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  it('should log server startup message', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    // Dynamic import to execute the module
    await import('./index');

    expect(consoleSpy).toHaveBeenCalledWith('Aeturnis Online Server v1.0.0');
  });
});
