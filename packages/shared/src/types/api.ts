export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
  database?: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
}