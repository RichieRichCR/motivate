import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

// Define your routes here
const app = new Hono()
  .get('/health', (c) => {
    return c.json({ status: 'ok' });
  })
  .post(
    '/posts',
    zValidator(
      'form',
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    ),
    (c) => {
      const { title, body } = c.req.valid('form');
      return c.json(
        {
          ok: true,
          message: 'Created!',
          data: { title, body },
        },
        201,
      );
    },
  );

// Export the app for the server to use
export { app };

// Export the type for RPC clients
export type AppType = typeof app;
