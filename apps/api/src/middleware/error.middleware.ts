import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import type { ApiResponse } from '@brainify/shared';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: ApiResponse['errors'],
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: ApiResponse['errors']) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, message, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_ERROR');
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    logger.warn(`[${err.code}] ${err.message}`, {
      statusCode: err.statusCode,
      code: err.code,
    });

    const response: ApiResponse = {
      success: false,
      message: err.message,
      errors: err.details,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
  });

  const response: ApiResponse = {
    success: false,
    message: 'Internal server error',
  };
  res.status(500).json(response);
}