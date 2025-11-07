import { Context, Next } from 'hono';
import { env } from '../env';

export async function authMiddleware(c: Context, next: Next) {
  const apiKey = c.req.header('x-api-key');

  if (!apiKey) {
    return c.json({ error: 'Unauthorized - Missing API key' }, 401);
  }

  if (apiKey !== env.API_KEY) {
    return c.json({ error: 'Forbidden - Invalid API key' }, 403);
  }

  await next();
}
