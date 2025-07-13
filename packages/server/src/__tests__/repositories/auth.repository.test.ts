import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient, Account, Prisma } from '@prisma/client';
import { AuthRepository } from '../../repositories/auth.repository';
import * as argon2 from 'argon2';

// Mock argon2
vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
  verify: vi.fn().mockResolvedValue(true),
  argon2id: 2,
}));

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let mockPrisma: PrismaClient;
  let mockAccountModel: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Create mock account model
    mockAccountModel = {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    // Create mock Prisma client
    mockPrisma = {
      account: mockAccountModel,
    } as unknown as PrismaClient;

    // Create repository instance
    repository = new AuthRepository(mockPrisma);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find an account by email', async () => {
      const mockAccount: Account = {
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        isActive: true,
      };

      mockAccountModel.findUnique.mockResolvedValue(mockAccount);

      const result = await repository.findByEmail('TEST@EXAMPLE.COM');

      expect(mockAccountModel.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockAccount);
    });

    it('should return null when account not found', async () => {
      mockAccountModel.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });

    it('should handle errors during find', async () => {
      mockAccountModel.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(repository.findByEmail('test@example.com')).rejects.toThrow(
        'Failed to find account by email: Database error'
      );
    });
  });

  describe('createAccount', () => {
    it('should create a new account with hashed password', async () => {
      const mockAccount: Account = {
        id: '123',
        email: 'new@example.com',
        hashedPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        isActive: true,
      };

      mockAccountModel.create.mockResolvedValue(mockAccount);

      const result = await repository.createAccount({
        email: 'NEW@EXAMPLE.COM',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(argon2.hash).toHaveBeenCalledWith('password123', {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      expect(mockAccountModel.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          hashedPassword: 'hashedPassword',
        },
      });

      expect(result).toEqual(mockAccount);
    });

    it('should handle duplicate email errors', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '2.0.0',
        }
      );

      mockAccountModel.create.mockRejectedValue(prismaError);

      await expect(
        repository.createAccount({
          email: 'duplicate@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).rejects.toThrow('An account with this email already exists');
    });

    it('should handle other creation errors', async () => {
      mockAccountModel.create.mockRejectedValue(new Error('Database error'));

      await expect(
        repository.createAccount({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).rejects.toThrow('Failed to create account: Database error');
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const account: Account = {
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        isActive: true,
      };

      vi.mocked(argon2.verify).mockResolvedValue(true);

      const result = await repository.verifyPassword(account, 'password123');

      expect(argon2.verify).toHaveBeenCalledWith('hashedPassword', 'password123');
      expect(result).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const account: Account = {
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        isActive: true,
      };

      vi.mocked(argon2.verify).mockResolvedValue(false);

      const result = await repository.verifyPassword(account, 'wrongpassword');

      expect(result).toBe(false);
    });

    it('should handle errors during verification', async () => {
      const account: Account = {
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        isActive: true,
      };

      vi.mocked(argon2.verify).mockRejectedValue(new Error('Verification error'));

      await expect(
        repository.verifyPassword(account, 'password123')
      ).rejects.toThrow('Failed to verify password: Verification error');
    });
  });

  describe('updateLastLogin', () => {
    it('should update the last login timestamp', async () => {
      const updatedAccount: Account = {
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
      };

      mockAccountModel.update.mockResolvedValue(updatedAccount);

      const result = await repository.updateLastLogin('123');

      expect(mockAccountModel.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { lastLoginAt: expect.any(Date) },
      });
      expect(result).toEqual(updatedAccount);
    });

    it('should handle errors during update', async () => {
      mockAccountModel.update.mockRejectedValue(new Error('Update error'));

      await expect(repository.updateLastLogin('123')).rejects.toThrow(
        'Failed to update last login: Update error'
      );
    });
  });

  describe('updatePassword', () => {
    it('should update the password hash', async () => {
      const updatedAccount: Account = {
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'newHashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        isActive: true,
      };

      mockAccountModel.update.mockResolvedValue(updatedAccount);

      const result = await repository.updatePassword('123', 'newHashedPassword');

      expect(mockAccountModel.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { hashedPassword: 'newHashedPassword' },
      });
      expect(result).toEqual(updatedAccount);
    });

    it('should handle errors during password update', async () => {
      mockAccountModel.update.mockRejectedValue(new Error('Update error'));

      await expect(
        repository.updatePassword('123', 'newHashedPassword')
      ).rejects.toThrow('Failed to update password: Update error');
    });
  });
});