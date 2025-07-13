// TODO(claude): Implement character routes
// [P1-S1-1] Core Architecture - Character route placeholders

export const characterRoutes = {
  // GET /api/characters
  getAll: '/api/characters',

  // POST /api/characters
  create: '/api/characters',

  // GET /api/characters/:id
  getById: '/api/characters/:id',

  // PUT /api/characters/:id
  update: '/api/characters/:id',

  // DELETE /api/characters/:id
  delete: '/api/characters/:id',
} as const;
