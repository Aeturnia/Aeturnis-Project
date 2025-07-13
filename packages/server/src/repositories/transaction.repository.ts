import { PrismaClient, Transaction, Prisma, TransactionType } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface ITransactionRepository {
  create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByCharacterId(characterId: string, limit?: number): Promise<Transaction[]>;
  findByType(type: TransactionType, where?: Prisma.TransactionWhereInput): Promise<Transaction[]>;
  findMany(where?: Prisma.TransactionWhereInput): Promise<Transaction[]>;
  update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
  delete(id: string): Promise<boolean>;
  getRecentTransactions(characterId: string, days?: number): Promise<Transaction[]>;
}

export class TransactionRepository
  extends BaseRepository<Transaction>
  implements ITransactionRepository
{
  protected model;

  constructor(private prisma: PrismaClient) {
    super();
    this.model = this.prisma.transaction;
  }

  /**
   * Find all transactions for a character
   * @param characterId - The character ID
   * @param limit - Optional limit on results
   * @returns Array of transactions
   */
  async findByCharacterId(characterId: string, limit?: number): Promise<Transaction[]> {
    const options: Prisma.TransactionFindManyArgs = {
      where: { characterId },
      orderBy: { timestamp: 'desc' },
    };
    if (limit !== undefined) {
      options.take = limit;
    }
    return await this.model.findMany(options);
  }

  /**
   * Find transactions by type
   * @param type - The transaction type
   * @param where - Additional filter conditions
   * @returns Array of transactions
   */
  async findByType(
    type: TransactionType,
    where?: Prisma.TransactionWhereInput
  ): Promise<Transaction[]> {
    return await this.model.findMany({
      where: {
        type,
        ...where,
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Get recent transactions for a character
   * @param characterId - The character ID
   * @param days - Number of days to look back (default: 30)
   * @returns Array of recent transactions
   */
  async getRecentTransactions(characterId: string, days: number = 30): Promise<Transaction[]> {
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
  override async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return await this.model.create({ data });
  }

  /**
   * Override findMany to ensure proper typing
   */
  override async findMany(where?: Prisma.TransactionWhereInput): Promise<Transaction[]> {
    const options: Prisma.TransactionFindManyArgs = { orderBy: { timestamp: 'desc' } };
    if (where) {
      options.where = where;
    }
    return await this.model.findMany(options);
  }

  /**
   * Override update to ensure proper typing
   */
  override async update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
}
