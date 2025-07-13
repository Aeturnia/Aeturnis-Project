import { PrismaClient, Account, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import * as argon2 from 'argon2';
import { RegisterRequest } from '../types/auth.types';

export interface IAuthRepository {
  findByEmail(email: string): Promise<Account | null>;
  createAccount(data: RegisterRequest): Promise<Account>;
  verifyPassword(account: Account, password: string): Promise<boolean>;
  updateLastLogin(accountId: string): Promise<Account>;
  updatePassword(accountId: string, hashedPassword: string): Promise<Account>;
  // Base repository methods
  findById(id: string): Promise<Account | null>;
  update(id: string, data: Partial<Account>): Promise<Account>;
  findMany(where?: Record<string, unknown>): Promise<Account[]>;
  create(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account>;
  delete(id: string): Promise<boolean>;
}

export class AuthRepository extends BaseRepository<Account> implements IAuthRepository {
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
    try {
      return await this.model.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (error) {
      throw new Error(
        `Failed to find account by email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create a new account with hashed password
   * @param data - Registration data including email and password
   * @returns The created account
   */
  async createAccount(data: RegisterRequest): Promise<Account> {
    try {
      // Hash the password with secure defaults
      const hashedPassword = await argon2.hash(data.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
      });

      // Create the account with the hashed password
      const accountData: Prisma.AccountCreateInput = {
        email: data.email.toLowerCase(),
        hashedPassword,
      };

      return await this.model.create({ data: accountData });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('An account with this email already exists');
        }
      }
      throw new Error(
        `Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verify a password against the stored hash
   * @param account - The account to verify against
   * @param password - The plain text password to verify
   * @returns True if password matches, false otherwise
   */
  async verifyPassword(account: Account, password: string): Promise<boolean> {
    try {
      return await argon2.verify(account.hashedPassword, password);
    } catch (error) {
      throw new Error(
        `Failed to verify password: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update the last login timestamp for an account
   * @param accountId - The account ID to update
   * @returns The updated account
   */
  async updateLastLogin(accountId: string): Promise<Account> {
    try {
      return await this.model.update({
        where: { id: accountId },
        data: { lastLoginAt: new Date() },
      });
    } catch (error) {
      throw new Error(
        `Failed to update last login: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update the password for an account
   * @param accountId - The account ID to update
   * @param hashedPassword - The new hashed password
   * @returns The updated account
   */
  async updatePassword(accountId: string, hashedPassword: string): Promise<Account> {
    try {
      return await this.model.update({
        where: { id: accountId },
        data: { hashedPassword },
      });
    } catch (error) {
      throw new Error(
        `Failed to update password: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
