// Generic API response wrapper (if backend uses consistent envelope)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  page_size?: number;
  offset?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Common status types used across entities
export type Status = 'En cours' | 'Validé' | 'Concluant' | 'Non concluant' | 'Refusé';

// Sort options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Common filter base
export interface BaseFilters {
  search?: string;
  ordering?: string;
}
