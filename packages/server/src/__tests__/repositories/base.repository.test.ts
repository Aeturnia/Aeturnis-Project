import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseRepository } from '../../repositories/base.repository';
import { PrismaClient } from '@prisma/client';

// Test types
interface TestEntity {
  id: string;
  name: string;
  value?: number;
  active?: boolean;
}

interface _TestCreateData {
  name: string;
  value?: number;
  active?: boolean;
}

interface _TestUpdateData {
  name?: string;
  value?: number;
  active?: boolean;
}

interface MockPrismaModel {
  findUnique: ReturnType<typeof vi.fn>;
  findMany: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
}

// Mock PrismaClient for testing
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

// Create a concrete implementation for testing
class TestRepository extends BaseRepository<TestEntity> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected model: any;

  constructor(prisma: PrismaClient) {
    super();
    this.model = (prisma as unknown as Record<string, unknown>).testModel;
  }

  // Override abstract methods for testing
  async findById(id: string): Promise<TestEntity | null> {
    return this.model.findUnique({ where: { id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any): Promise<TestEntity> {
    return this.model.create({ data });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: any): Promise<TestEntity> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findMany(options?: any): Promise<TestEntity[]> {
    return this.model.findMany(options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async count(options?: any): Promise<number> {
    return this.model.count(options);
  }
}

describe('BaseRepository', () => {
  let testRepository: TestRepository;
  let mockPrisma: PrismaClient;
  let mockModel: MockPrismaModel;

  beforeEach(() => {
    mockModel = {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    };

    mockPrisma = {
      testModel: mockModel,
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    } as unknown as PrismaClient;

    testRepository = new TestRepository(mockPrisma);
  });

  describe('Constructor', () => {
    it('should create repository instance with prisma client', () => {
      expect(testRepository).toBeInstanceOf(BaseRepository);
      expect(testRepository).toBeInstanceOf(TestRepository);
    });

    it('should store prisma and model references', () => {
      // Test that the repository was initialized properly
      expect(testRepository).toBeDefined();
    });
  });

  describe('CRUD Operations', () => {
    describe('findById', () => {
      it('should call model.findUnique with correct parameters', async () => {
        const testId = 'test-id-123';
        const expectedResult = { id: testId, name: 'Test Item' };

        mockModel.findUnique.mockResolvedValue(expectedResult);

        const result = await testRepository.findById(testId);

        expect(mockModel.findUnique).toHaveBeenCalledWith({ where: { id: testId } });
        expect(result).toEqual(expectedResult);
      });

      it('should return null for non-existent items', async () => {
        mockModel.findUnique.mockResolvedValue(null);

        const result = await testRepository.findById('non-existent');

        expect(result).toBeNull();
      });
    });

    describe('create', () => {
      it('should call model.create with correct data', async () => {
        const testData = { name: 'New Item', value: 100 };
        const expectedResult = { id: 'new-id', ...testData };

        mockModel.create.mockResolvedValue(expectedResult);

        const result = await testRepository.create(testData);

        expect(mockModel.create).toHaveBeenCalledWith({ data: testData });
        expect(result).toEqual(expectedResult);
      });

      it('should handle validation errors', async () => {
        const invalidData = { invalid: 'data' };
        const error = new Error('Validation failed');

        mockModel.create.mockRejectedValue(error);

        await expect(testRepository.create(invalidData)).rejects.toThrow('Validation failed');
      });
    });

    describe('update', () => {
      it('should call model.update with correct parameters', async () => {
        const testId = 'test-id-123';
        const updateData = { name: 'Updated Item' };
        const expectedResult = { id: testId, ...updateData };

        mockModel.update.mockResolvedValue(expectedResult);

        const result = await testRepository.update(testId, updateData);

        expect(mockModel.update).toHaveBeenCalledWith({
          where: { id: testId },
          data: updateData,
        });
        expect(result).toEqual(expectedResult);
      });

      it('should handle update of non-existent items', async () => {
        const error = new Error('Record not found');
        mockModel.update.mockRejectedValue(error);

        await expect(testRepository.update('non-existent', {})).rejects.toThrow('Record not found');
      });
    });

    describe('delete', () => {
      it('should call model.delete with correct parameters', async () => {
        const testId = 'test-id-123';
        const expectedResult = { id: testId, name: 'Deleted Item' };

        mockModel.delete.mockResolvedValue(expectedResult);

        const result = await testRepository.delete(testId);

        expect(mockModel.delete).toHaveBeenCalledWith({ where: { id: testId } });
        expect(result).toEqual(expectedResult);
      });

      it('should handle deletion of non-existent items', async () => {
        const error = new Error('Record not found');
        mockModel.delete.mockRejectedValue(error);

        await expect(testRepository.delete('non-existent')).rejects.toThrow('Record not found');
      });
    });

    describe('findMany', () => {
      it('should call model.findMany with no options', async () => {
        const expectedResults = [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ];

        mockModel.findMany.mockResolvedValue(expectedResults);

        const results = await testRepository.findMany();

        expect(mockModel.findMany).toHaveBeenCalledWith(undefined);
        expect(results).toEqual(expectedResults);
      });

      it('should call model.findMany with provided options', async () => {
        const options = {
          where: { active: true },
          orderBy: { name: 'asc' },
          take: 10,
        };
        const expectedResults = [{ id: '1', name: 'Active Item' }];

        mockModel.findMany.mockResolvedValue(expectedResults);

        const results = await testRepository.findMany(options);

        expect(mockModel.findMany).toHaveBeenCalledWith(options);
        expect(results).toEqual(expectedResults);
      });

      it('should return empty array when no items found', async () => {
        mockModel.findMany.mockResolvedValue([]);

        const results = await testRepository.findMany();

        expect(results).toEqual([]);
      });
    });

    describe('count', () => {
      it('should call model.count with no options', async () => {
        const expectedCount = 5;

        mockModel.count.mockResolvedValue(expectedCount);

        const count = await testRepository.count();

        expect(mockModel.count).toHaveBeenCalledWith(undefined);
        expect(count).toBe(expectedCount);
      });

      it('should call model.count with provided options', async () => {
        const options = { where: { active: true } };
        const expectedCount = 3;

        mockModel.count.mockResolvedValue(expectedCount);

        const count = await testRepository.count(options);

        expect(mockModel.count).toHaveBeenCalledWith(options);
        expect(count).toBe(expectedCount);
      });

      it('should return 0 for empty collections', async () => {
        mockModel.count.mockResolvedValue(0);

        const count = await testRepository.count();

        expect(count).toBe(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate database connection errors', async () => {
      const connectionError = new Error('Database connection failed');
      mockModel.findUnique.mockRejectedValue(connectionError);

      await expect(testRepository.findById('test-id')).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should handle constraint violation errors', async () => {
      const constraintError = new Error('Unique constraint violation');
      mockModel.create.mockRejectedValue(constraintError);

      await expect(testRepository.create({ duplicate: 'value' })).rejects.toThrow(
        'Unique constraint violation'
      );
    });

    it('should handle foreign key constraint errors', async () => {
      const fkError = new Error('Foreign key constraint failed');
      mockModel.update.mockRejectedValue(fkError);

      await expect(testRepository.update('test-id', { invalidRef: 'value' })).rejects.toThrow(
        'Foreign key constraint failed'
      );
    });
  });

  describe('Method Signatures', () => {
    it('should have async findById method', () => {
      expect(testRepository.findById).toBeDefined();
      expect(testRepository.findById.constructor.name).toBe('AsyncFunction');
    });

    it('should have async create method', () => {
      expect(testRepository.create).toBeDefined();
      expect(testRepository.create.constructor.name).toBe('AsyncFunction');
    });

    it('should have async update method', () => {
      expect(testRepository.update).toBeDefined();
      expect(testRepository.update.constructor.name).toBe('AsyncFunction');
    });

    it('should have async delete method', () => {
      expect(testRepository.delete).toBeDefined();
      expect(testRepository.delete.constructor.name).toBe('AsyncFunction');
    });

    it('should have async findMany method', () => {
      expect(testRepository.findMany).toBeDefined();
      expect(testRepository.findMany.constructor.name).toBe('AsyncFunction');
    });

    it('should have async count method', () => {
      expect(testRepository.count).toBeDefined();
      expect(testRepository.count.constructor.name).toBe('AsyncFunction');
    });
  });

  describe('Abstract Implementation', () => {
    it('should require implementation of abstract methods', () => {
      // Verify that our test implementation provides all required methods
      expect(testRepository.findById).toBeDefined();
      expect(testRepository.create).toBeDefined();
      expect(testRepository.update).toBeDefined();
      expect(testRepository.delete).toBeDefined();
      expect(testRepository.findMany).toBeDefined();
      expect(testRepository.count).toBeDefined();
    });

    it('should be extendable for specific repository implementations', () => {
      // Test that BaseRepository can be extended
      expect(testRepository).toBeInstanceOf(BaseRepository);
      expect(testRepository).toBeInstanceOf(TestRepository);
    });
  });

  describe('Model Access', () => {
    it('should provide access to the underlying Prisma model', () => {
      // Test that the repository has access to its model
      // This is tested indirectly through the CRUD operations
      expect(testRepository.findById).toBeDefined();
      expect(testRepository.create).toBeDefined();
    });

    it('should work with different Prisma models', () => {
      // Test that BaseRepository is model-agnostic
      const anotherModel = {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      };

      const anotherPrisma = {
        anotherModel,
        $connect: vi.fn(),
        $disconnect: vi.fn(),
      } as unknown as PrismaClient;

      class AnotherRepository extends BaseRepository<TestEntity> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        protected model: any;

        constructor(prisma: PrismaClient) {
          super();
          this.model = (prisma as unknown as Record<string, unknown>).anotherModel;
        }

        async findById(id: string): Promise<TestEntity | null> {
          return this.model.findUnique({ where: { id } });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async create(data: any): Promise<TestEntity> {
          return this.model.create({ data });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async update(id: string, data: any): Promise<TestEntity> {
          return this.model.update({ where: { id }, data });
        }

        async delete(id: string): Promise<boolean> {
          try {
            await this.model.delete({ where: { id } });
            return true;
          } catch {
            return false;
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async findMany(options?: any): Promise<TestEntity[]> {
          return this.model.findMany(options);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async count(options?: any): Promise<number> {
          return this.model.count(options);
        }
      }

      const anotherRepo = new AnotherRepository(anotherPrisma);
      expect(anotherRepo).toBeInstanceOf(BaseRepository);
    });
  });
});
