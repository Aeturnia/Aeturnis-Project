// TODO(claude): Implement PK routes
// [P1-S1-1] Core Architecture - PK route placeholders

export const pkRoutes = {
  // POST /api/pk/kill
  recordKill: '/api/pk/kill',

  // GET /api/pk/history/:characterId
  getHistory: '/api/pk/history/:characterId',

  // GET /api/pk/cooldown/:characterId
  getCooldown: '/api/pk/cooldown/:characterId',
} as const;
