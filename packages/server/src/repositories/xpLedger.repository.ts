import { PrismaClient, XpLedger, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface IXpLedgerRepository {
  create(data: Prisma.XpLedgerCreateInput): Promise<XpLedger>;
  findById(id: string): Promise<XpLedger | null>;
  findByCharacterId(characterId: string, limit?: number): Promise<XpLedger[]>;
  findMany(where?: Prisma.XpLedgerWhereInput): Promise<XpLedger[]>;
  update(id: string, data: Prisma.XpLedgerUpdateInput): Promise<XpLedger>;
  delete(id: string): Promise<boolean>;
  getTotalXpGained(characterId: string): Promise<number>;
  getTotalXpLost(characterId: string): Promise<number>;
  getRecentEntries(characterId: string, days?: number): Promise<XpLedger[]>;
}

export class XpLedgerRepository extends BaseRepository<XpLedger> implements IXpLedgerRepository {
  protected model;

  constructor(private prisma: PrismaClient) {
    super();
    this.model = this.prisma.xpLedger;
  }

  /**
   * Find XP ledger entries for a character
   * @param characterId - The character ID
   * @param limit - Optional limit on results
   * @returns Array of XP ledger entries
   */
  async findByCharacterId(characterId: string, limit?: number): Promise<XpLedger[]> {
    const options: Prisma.XpLedgerFindManyArgs = {
      where: { characterId },
      orderBy: { timestamp: 'desc' },
    };
    if (limit !== undefined) {
      options.take = limit;
    }
    return await this.model.findMany(options);
  }

  /**
   * Calculate total XP gained by a character
   * @param characterId - The character ID
   * @returns Total XP gained
   */
  async getTotalXpGained(characterId: string): Promise<number> {
    const result = await this.model.aggregate({
      where: {
        characterId,
        xpChange: { gt: 0 },
      },
      _sum: {
        xpChange: true,
      },
    });
    return result._sum.xpChange || 0;
  }

  /**
   * Calculate total XP lost by a character
   * @param characterId - The character ID
   * @returns Total XP lost (as positive number)
   */
  async getTotalXpLost(characterId: string): Promise<number> {
    const result = await this.model.aggregate({
      where: {
        characterId,
        xpChange: { lt: 0 },
      },
      _sum: {
        xpChange: true,
      },
    });
    return Math.abs(result._sum.xpChange || 0);
  }

  /**
   * Get recent XP ledger entries
   * @param characterId - The character ID
   * @param days - Number of days to look back (default: 7)
   * @returns Array of recent entries
   */
  async getRecentEntries(characterId: string, days: number = 7): Promise<XpLedger[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.model.findMany({
      where: {
        characterId,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Override create to ensure proper typing
   */
  override async create(data: Prisma.XpLedgerCreateInput): Promise<XpLedger> {
    return await this.model.create({ data });
  }

  /**
   * Override findMany to ensure proper typing
   */
  override async findMany(where?: Prisma.XpLedgerWhereInput): Promise<XpLedger[]> {
    const options: Prisma.XpLedgerFindManyArgs = { orderBy: { timestamp: 'desc' } };
    if (where) {
      options.where = where;
    }
    return await this.model.findMany(options);
  }

  /**
   * Override update to ensure proper typing
   */
  override async update(id: string, data: Prisma.XpLedgerUpdateInput): Promise<XpLedger> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
}
