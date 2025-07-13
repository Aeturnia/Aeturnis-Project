import { PrismaClient, BankAccount, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface IBankAccountRepository {
  create(data: Prisma.BankAccountCreateInput): Promise<BankAccount>;
  findById(id: string): Promise<BankAccount | null>;
  findByCharacterId(characterId: string): Promise<BankAccount | null>;
  findMany(where?: Prisma.BankAccountWhereInput): Promise<BankAccount[]>;
  update(id: string, data: Prisma.BankAccountUpdateInput): Promise<BankAccount>;
  updateBalance(id: string, amount: number): Promise<BankAccount>;
  delete(id: string): Promise<boolean>;
}

export class BankAccountRepository
  extends BaseRepository<BankAccount>
  implements IBankAccountRepository
{
  protected model;

  constructor(private prisma: PrismaClient) {
    super();
    this.model = this.prisma.bankAccount;
  }

  /**
   * Find bank account by character ID
   * @param characterId - The character ID
   * @returns The bank account if found, null otherwise
   */
  async findByCharacterId(characterId: string): Promise<BankAccount | null> {
    return await this.model.findUnique({ where: { characterId } });
  }

  /**
   * Update bank balance and last banked timestamp
   * @param id - The bank account ID
   * @param amount - The new balance amount
   * @returns The updated bank account
   */
  async updateBalance(id: string, amount: number): Promise<BankAccount> {
    return await this.model.update({
      where: { id },
      data: {
        balance: amount,
        lastBankedAt: new Date(),
      },
    });
  }

  /**
   * Override create to ensure proper typing
   */
  override async create(data: Prisma.BankAccountCreateInput): Promise<BankAccount> {
    return await this.model.create({ data });
  }

  /**
   * Override findMany to ensure proper typing
   */
  override async findMany(where?: Prisma.BankAccountWhereInput): Promise<BankAccount[]> {
    return await this.model.findMany(where ? { where } : undefined);
  }

  /**
   * Override update to ensure proper typing
   */
  override async update(id: string, data: Prisma.BankAccountUpdateInput): Promise<BankAccount> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
}
