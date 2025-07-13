import { PrismaClient, Account, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface IAccountRepository {
  create(data: Prisma.AccountCreateInput): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  findMany(where?: Prisma.AccountWhereInput): Promise<Account[]>;
  update(id: string, data: Prisma.AccountUpdateInput): Promise<Account>;
  delete(id: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<Account>;
}

export class AccountRepository extends BaseRepository<Account> implements IAccountRepository {
  protected model;

  constructor(private prisma: PrismaClient) {
    super();
    this.model = this.prisma.account;
  }

  /**
   * Find account by email address
   * @param email - The email address to search for
   * @returns The account if found, null otherwise
   */
  async findByEmail(email: string): Promise<Account | null> {
    return await this.model.findUnique({ where: { email } });
  }

  /**
   * Update last login timestamp for an account
   * @param id - The account ID
   * @returns The updated account
   */
  async updateLastLogin(id: string): Promise<Account> {
    return await this.model.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Override create to ensure proper typing
   */
  override async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return await this.model.create({ data });
  }

  /**
   * Override findMany to ensure proper typing
   */
  override async findMany(where?: Prisma.AccountWhereInput): Promise<Account[]> {
    return await this.model.findMany(where ? { where } : undefined);
  }

  /**
   * Override update to ensure proper typing
   */
  override async update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
}
