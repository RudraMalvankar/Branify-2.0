import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),

  // Database
  DATABASE_URL: z.string().optional(),

  // Auth
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),

  // AI
  GEMINI_API_KEY: z.string().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;