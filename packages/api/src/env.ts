import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  POSTGRES_URL: z.string().min(1).optional(), // Make optional for now
  API_KEY: z.string().min(1),
});
export type Env = z.infer<typeof envSchema>;

function parseEnv<T>(schema: z.ZodType<T, any, any>): T {
  // // Check if we're in a Node.js environment (has process.env)
  // const hasProcessEnv = typeof process !== 'undefined' && process.env;

  // if (!hasProcessEnv) {
  //   // In Cloudflare Workers, return defaults
  //   return schema.parse({
  //     NODE_ENV: 'production',
  //   });
  // }

  try {
    return schema.parse(process.env);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      e.issues.forEach((err) => {
        const path = err.path.join('.');
        console.log(`${path}: ${err.message}`);
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
