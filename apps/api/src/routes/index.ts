import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// GET /api — API root, version info
router.get('/', (_req, res) => {
  sendSuccess(res, {
    name: 'Brainify API',
    version: '2.0.0',
    status: 'operational',
  });
});

// GET /health — Health check
router.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// GET /api — API info (aliased)
router.get('/api', (_req, res) => {
  res.redirect('/');
});

export default router;