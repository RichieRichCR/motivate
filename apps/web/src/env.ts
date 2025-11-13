import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  API_KEY: z.string().min(1),
  USER_ID: z.string().min(1),
  REVALIDATE_SECRET: z.string().min(1),
});
export type Env = z.infer<typeof envSchema>;

function parseEnv<T>(schema: z.ZodType): T {
  try {
    return schema.parse(process.env);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      const zodError = e as z.ZodError;
      zodError.issues.forEach((err) => {
        const path = err.path.join('.');
        console.error(`${path}: ${err.message}`);
      });
    }
    // Don't exit in test environment, throw instead
    if (process.env.NODE_ENV === 'test') {
      throw new Error('Invalid environment variables');
    }
    process.exit(1);
  }
}

export const env = parseEnv<Env>(envSchema);
