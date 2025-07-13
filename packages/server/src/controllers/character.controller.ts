import { Request, Response } from 'express';
import { CharacterService } from '../services/character.service';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

export class CharacterController {
  private characterService: CharacterService;

  constructor() {
    this.characterService = new CharacterService();
  }

  // GET /api/characters
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Extract accountId from JWT token
      const accountId = 'placeholder';

      const characters = await this.characterService.getAccountCharacters(accountId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: characters,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  // POST /api/characters
  async create(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Extract accountId from JWT token
      // TODO(claude): Validate request body with Zod
      const accountId = 'placeholder';
      const { name } = req.body;

      const character = await this.characterService.createCharacter(accountId, name);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.CHARACTER.CREATED,
        data: character,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.CHARACTER.NAME_TAKEN,
      });
    }
  }

  // GET /api/characters/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

      const character = await this.characterService.getCharacter(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: character,
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.CHARACTER.NOT_FOUND,
      });
    }
  }

  // PUT /api/characters/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Verify character ownership
      // TODO(claude): Validate request body with Zod
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

      const character = await this.characterService.updateCharacter(id, updates);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.GENERAL.SUCCESS,
        data: character,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }

  // DELETE /api/characters/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      // TODO(claude): Verify character ownership
      const { id } = req.params;

      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Character ID is required',
        });
        return;
      }

      await this.characterService.deleteCharacter(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.CHARACTER.DELETED,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error instanceof Error ? error.message : MESSAGES.GENERAL.ERROR,
      });
    }
  }
}
