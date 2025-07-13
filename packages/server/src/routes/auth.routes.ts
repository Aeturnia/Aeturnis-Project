// TODO(claude): Implement auth routes
// [P1-S1-1] Core Architecture - Auth route placeholders

export const authRoutes = {
  // POST /api/auth/register
  register: '/api/auth/register',

  // POST /api/auth/login
  login: '/api/auth/login',

  // POST /api/auth/logout
  logout: '/api/auth/logout',

  // GET /api/auth/profile
  profile: '/api/auth/profile',

  // PUT /api/auth/profile
  updateProfile: '/api/auth/profile',

  // POST /api/auth/recover
  recover: '/api/auth/recover',
} as const;
