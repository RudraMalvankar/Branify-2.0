import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import router from './routes/index.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400,
  }),
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookie parsing
app.use(cookieParser());

// HTTP request logging
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};

app.use(
  morgan(':method :url :status :response-time ms - :remote-addr', {
    stream: morganStream,
  }),
);

// Routes
app.use('/', router);
app.use('/health', router);
app.use('/api', router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;