/**
 * Base repository interface for all repositories
 * Provides standard CRUD operations
 */
export interface IBaseRepository<T> {
  /**
   * Create a new entity
   * @param data - The data to create the entity with
   * @returns The created entity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(data: any): Promise<T>;

  /**
   * Find an entity by its ID
   * @param id - The ID of the entity to find
   * @returns The entity if found, null otherwise
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find multiple entities based on filters
   * @param where - Optional filter conditions
   * @returns Array of entities matching the criteria
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findMany(where?: any): Promise<T[]>;

  /**
   * Update an entity by its ID
   * @param id - The ID of the entity to update
   * @param data - The data to update the entity with
   * @returns The updated entity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(id: string, data: any): Promise<T>;

  /**
   * Delete an entity by its ID
   * @param id - The ID of the entity to delete
   * @returns True if deleted, false otherwise
   */
  delete(id: string): Promise<boolean>;
}

/**
 * Abstract base repository class with common functionality
 * Implements the IBaseRepository interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract model: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any): Promise<T> {
    return await this.model.create({ data });
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({ where: { id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findMany(where?: any): Promise<T[]> {
    return await this.model.findMany({ where });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: any): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
