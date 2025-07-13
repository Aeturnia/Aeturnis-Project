// TODO(claude): Implement banking routes
// [P1-S1-1] Core Architecture - Banking route placeholders

export const bankingRoutes = {
  // GET /api/banking/balance/:characterId
  getBalance: '/api/banking/balance/:characterId',

  // POST /api/banking/deposit
  deposit: '/api/banking/deposit',

  // POST /api/banking/withdraw
  withdraw: '/api/banking/withdraw',

  // GET /api/banking/transactions/:characterId
  getTransactions: '/api/banking/transactions/:characterId',
} as const;
