// TODO(claude): Implement combat routes
// [P1-S1-1] Core Architecture - Combat route placeholders

export const combatRoutes = {
  // POST /api/combat/death/:characterId
  processDeath: '/api/combat/death/:characterId',

  // POST /api/combat/respawn/:characterId
  respawn: '/api/combat/respawn/:characterId',

  // GET /api/combat/status/:characterId
  getStatus: '/api/combat/status/:characterId',
} as const;
