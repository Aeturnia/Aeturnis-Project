import { PrismaClient, PkKillLog, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface IPkKillLogRepository {
  create(data: Prisma.PkKillLogCreateInput): Promise<PkKillLog>;
  findById(id: string): Promise<PkKillLog | null>;
  findByKillerId(killerId: string, limit?: number): Promise<PkKillLog[]>;
  findByVictimId(victimId: string, limit?: number): Promise<PkKillLog[]>;
  findMany(where?: Prisma.PkKillLogWhereInput): Promise<PkKillLog[]>;
  update(id: string, data: Prisma.PkKillLogUpdateInput): Promise<PkKillLog>;
  delete(id: string): Promise<boolean>;
  getKillsInTimeWindow(killerId: string, minutes: number): Promise<PkKillLog[]>;
  getKillCount(killerId: string): Promise<number>;
  getDeathCount(victimId: string): Promise<number>;
  getRecentKills(limit?: number): Promise<PkKillLog[]>;
}

export class PkKillLogRepository extends BaseRepository<PkKillLog> implements IPkKillLogRepository {
  protected model;

  constructor(private prisma: PrismaClient) {
    super();
    this.model = this.prisma.pkKillLog;
  }

  /**
   * Find kills by killer ID
   * @param killerId - The killer character ID
   * @param limit - Optional limit on results
   * @returns Array of kill logs
   */
  async findByKillerId(killerId: string, limit?: number): Promise<PkKillLog[]> {
    const options: Prisma.PkKillLogFindManyArgs = {
      where: { killerId },
      orderBy: { timestamp: 'desc' },
    };
    if (limit !== undefined) {
      options.take = limit;
    }
    return await this.model.findMany(options);
  }

  /**
   * Find deaths by victim ID
   * @param victimId - The victim character ID
   * @param limit - Optional limit on results
   * @returns Array of kill logs
   */
  async findByVictimId(victimId: string, limit?: number): Promise<PkKillLog[]> {
    const options: Prisma.PkKillLogFindManyArgs = {
      where: { victimId },
      orderBy: { timestamp: 'desc' },
    };
    if (limit !== undefined) {
      options.take = limit;
    }
    return await this.model.findMany(options);
  }

  /**
   * Get kills within a time window (for cooldown checking)
   * @param killerId - The killer character ID
   * @param minutes - Time window in minutes
   * @returns Array of recent kills
   */
  async getKillsInTimeWindow(killerId: string, minutes: number): Promise<PkKillLog[]> {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - minutes);

    return await this.model.findMany({
      where: {
        killerId,
        timestamp: {
          gte: startTime,
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Get total kill count for a character
   * @param killerId - The killer character ID
   * @returns Total number of kills
   */
  async getKillCount(killerId: string): Promise<number> {
    return await this.model.count({
      where: { killerId },
    });
  }

  /**
   * Get total death count for a character
   * @param victimId - The victim character ID
   * @returns Total number of deaths
   */
  async getDeathCount(victimId: string): Promise<number> {
    return await this.model.count({
      where: { victimId },
    });
  }

  /**
   * Get recent kills server-wide
   * @param limit - Number of kills to return (default: 10)
   * @returns Array of recent kills
   */
  async getRecentKills(limit: number = 10): Promise<PkKillLog[]> {
    return await this.model.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  /**
   * Override create to ensure proper typing
   */
  override async create(data: Prisma.PkKillLogCreateInput): Promise<PkKillLog> {
    return await this.model.create({ data });
  }

  /**
   * Override findMany to ensure proper typing
   */
  override async findMany(where?: Prisma.PkKillLogWhereInput): Promise<PkKillLog[]> {
    const options: Prisma.PkKillLogFindManyArgs = { orderBy: { timestamp: 'desc' } };
    if (where) {
      options.where = where;
    }
    return await this.model.findMany(options);
  }

  /**
   * Override update to ensure proper typing
   */
  override async update(id: string, data: Prisma.PkKillLogUpdateInput): Promise<PkKillLog> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
}
