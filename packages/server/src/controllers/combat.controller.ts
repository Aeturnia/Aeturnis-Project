import { Request, Response } from 'express';
import { CombatService } from '../services/combat.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

export class CombatController {
  private combatService: CombatService;

  constructor() {
    this.combatService = new CombatService();
  }

  // POST /api/combat/death/:characterId
  async processDeath(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      // TODO(claude): Validate request body with Zod
      const { killerId } = req.body;

      const result = await this.combatService.processDeath(characterId, killerId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.COMBAT.DEATH_PROCESSED,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.COMBAT.ALREADY_DEAD,
      });
    }
  }

  // POST /api/combat/respawn/:characterId
  async respawn(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;

      const result = await this.combatService.respawn(characterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.COMBAT.RESPAWN_SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.COMBAT.NOT_DEAD,
      });
    }
  }

  // GET /api/combat/status/:characterId
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;

      const status = await this.combatService.getCombatStatus(characterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: status,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.NOT_FOUND,
      });
    }
  }
}
