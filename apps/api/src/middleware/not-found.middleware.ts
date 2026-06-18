import type { Request, Response } from 'express';
import { sendError } from '../utils/response.js';

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 'Endpoint not found', 404);
}