import type { Response } from 'express';
import type { ApiResponse } from '@brainify/shared';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: ApiResponse['errors'],
): void {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success',
): void {
  const response: ApiResponse = {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
  res.status(200).json(response);
}