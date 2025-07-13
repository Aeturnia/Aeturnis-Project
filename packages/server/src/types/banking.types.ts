export interface BankingRequest {
  characterId: string;
  amount: number;
}

export type DepositRequest = BankingRequest;

export type WithdrawRequest = BankingRequest;

export interface BankBalance {
  characterId: string;
  balance: number;
  lastBankedAt?: Date;
}

export interface TransactionHistory {
  id: string;
  characterId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST' | 'FEE' | 'DEATH_PENALTY';
  description?: string;
  timestamp: Date;
}

export interface BankingResult {
  success: boolean;
  newBalance?: number;
  transaction?: TransactionHistory;
  error?: string;
}

export interface BankAccountInfo {
  balance: number;
  lastBankedAt?: Date;
  recentTransactions: TransactionHistory[];
}
