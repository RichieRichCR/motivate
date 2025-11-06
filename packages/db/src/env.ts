import { z } from "zod";

export const envSchema = z.object({
  POSTGRES_URL: z.string().min(1),
});
export type Env = z.infer<typeof envSchema>;

function parseEnv<T>(schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(process.env);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      e.issues.forEach((err) => {
        const path = err.path.join(".");
        console.log(`${path}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const env = parseEnv<Env>(envSchema);
