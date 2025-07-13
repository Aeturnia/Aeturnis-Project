import { PrismaClient, Character, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface ICharacterRepository {
  create(data: Prisma.CharacterCreateInput): Promise<Character>;
  findById(id: string): Promise<Character | null>;
  findByName(name: string): Promise<Character | null>;
  findByAccountId(accountId: string): Promise<Character[]>;
  findMany(where?: Prisma.CharacterWhereInput): Promise<Character[]>;
  update(id: string, data: Prisma.CharacterUpdateInput): Promise<Character>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<Character>;
  updateLastPlayed(id: string): Promise<Character>;
}

export class CharacterRepository extends BaseRepository<Character> implements ICharacterRepository {
  protected model;

  constructor(private prisma: PrismaClient) {
    super();
    this.model = this.prisma.character;
  }

  /**
   * Find character by unique name
   * @param name - The character name to search for
   * @returns The character if found, null otherwise
   */
  async findByName(name: string): Promise<Character | null> {
    return await this.model.findUnique({ where: { name } });
  }

  /**
   * Find all characters belonging to an account
   * @param accountId - The account ID
   * @returns Array of characters for the account
   */
  async findByAccountId(accountId: string): Promise<Character[]> {
    return await this.model.findMany({
      where: {
        accountId,
        isDeleted: false,
      },
      orderBy: { lastPlayedAt: 'desc' },
    });
  }

  /**
   * Soft delete a character (mark as deleted)
   * @param id - The character ID
   * @returns The updated character
   */
  async softDelete(id: string): Promise<Character> {
    return await this.model.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /**
   * Update last played timestamp
   * @param id - The character ID
   * @returns The updated character
   */
  async updateLastPlayed(id: string): Promise<Character> {
    return await this.model.update({
      where: { id },
      data: { lastPlayedAt: new Date() },
    });
  }

  /**
   * Override create to ensure proper typing
   */
  override async create(data: Prisma.CharacterCreateInput): Promise<Character> {
    return await this.model.create({ data });
  }

  /**
   * Override findMany to ensure proper typing
   */
  override async findMany(where?: Prisma.CharacterWhereInput): Promise<Character[]> {
    return await this.model.findMany(where ? { where } : undefined);
  }

  /**
   * Override update to ensure proper typing
   */
  override async update(id: string, data: Prisma.CharacterUpdateInput): Promise<Character> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
}
