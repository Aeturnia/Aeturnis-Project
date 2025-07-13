export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type DatabaseOperation = 'create' | 'read' | 'update' | 'delete';

export interface AuditLog {
  operation: DatabaseOperation;
  tableName: string;
  recordId: string;
  userId?: string;
  timestamp: Date;
  changes?: Record<string, unknown>;
}
