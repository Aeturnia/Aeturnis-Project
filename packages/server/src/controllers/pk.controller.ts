import { Request, Response } from 'express';
import { PKService } from '../services/pk.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

export class PKController {
  private pkService: PKService;

  constructor() {
    this.pkService = new PKService();
  }

  // POST /api/pk/kill
  async recordKill(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Validate request body with Zod
      const { killerId, victimId } = req.body;

      const result = await this.pkService.recordKill(killerId, victimId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.PVP.KILL_RECORDED,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.PVP.ON_COOLDOWN,
      });
    }
  }

  // GET /api/pk/history/:characterId
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      // TODO(claude): Add pagination support

      const history = await this.pkService.getKillHistory(characterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }

  // GET /api/pk/cooldown/:characterId
  async getCooldown(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;

      const cooldown = await this.pkService.checkCooldown(characterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: cooldown,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }
}
