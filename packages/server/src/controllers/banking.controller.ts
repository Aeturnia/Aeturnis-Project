import { Request, Response } from 'express';
import { BankingService } from '../services/banking.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

export class BankingController {
  private bankingService: BankingService;

  constructor() {
    this.bankingService = new BankingService();
  }

  // GET /api/banking/balance/:characterId
  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;

      if (!characterId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

      const balance = await this.bankingService.getBalance(characterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: balance,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }

  // POST /api/banking/deposit
  async deposit(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Validate request body with Zod
      const { characterId, amount } = req.body;

      const result = await this.bankingService.deposit(characterId, amount);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.BANKING.DEPOSIT_SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.BANKING.INVALID_AMOUNT,
      });
    }
  }

  // POST /api/banking/withdraw
  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Validate request body with Zod
      const { characterId, amount } = req.body;

      const result = await this.bankingService.withdraw(characterId, amount);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.BANKING.WITHDRAWAL_SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.BANKING.INSUFFICIENT_BANK_BALANCE,
      });
    }
  }

  // GET /api/banking/transactions/:characterId
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      // TODO(claude): Add pagination support

      if (!characterId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

      const transactions = await this.bankingService.getTransactions(characterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }
}
