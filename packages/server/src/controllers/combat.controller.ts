import { Request, Response } from 'express';
import { CombatService } from '../services/combat.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';
import { Container } from '../container';

export class CombatController {
  private combatService: CombatService;

  constructor() {
    const container = Container.getInstance();
    this.combatService = container.getCombatService();
  }

  // POST /api/combat/death/:characterId
  async processDeath(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      // TODO(claude): Validate request body with Zod
      const { killerId } = req.body;

      if (!characterId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

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

      if (!characterId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

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

      if (!characterId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

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
