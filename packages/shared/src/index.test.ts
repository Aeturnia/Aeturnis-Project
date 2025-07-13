import { describe, it, expect } from 'vitest';
import { GAME_VERSION } from './index';

describe('Shared Package', () => {
  describe('Constants', () => {
    it('should export GAME_VERSION', () => {
      expect(GAME_VERSION).toBe('1.0.0');
    });

    it('should have valid version format', () => {
      expect(GAME_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
});
