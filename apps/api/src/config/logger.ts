import winston from 'winston';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logDir = path.join(__dirname, '..', '..', 'logs');

const transports: winston.transport[] = [
  new winston.transports.Console({
    format:
      env.NODE_ENV === 'development'
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            }),
          )
        : winston.format.combine(winston.format.timestamp(), winston.format.json()),
  }),
];

if (env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 5,
    }),
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
});