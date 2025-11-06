import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

import health from './routes/health';
import dataRoutes from './routes/api/v1/data';
import { env } from './env';

const app = new OpenAPIHono();

if (env.NODE_ENV !== 'test') {
  app.use('*', (c, next) => {
    if (c.req.path === '/api/health') return next();
    return logger()(c, next);
  });
}

app
  .use(cors())
  .get('/', (c) => {
    return c.text('RR API!');
  })
  .route('/health', health)
  .route('/api/v1/health', dataRoutes)

  .onError((err, c) => {
    console.error(err);
    if (err instanceof HTTPException) return err.getResponse();
    return c.json({ error: 'Internal Server Error' }, 500);
  });

// OpenAPI documentation
app.doc('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'RR Health API',
    version: 'v0.1.0',
  },
  servers: [
    // Add production URL when deployed
    ...(env.NODE_ENV === 'production'
      ? [
          {
            url: 'https://api.rd-studios.workers.dev',
            description: 'Production Server',
          },
        ]
      : []),
    // Always include local dev server in non-production
    ...(env.NODE_ENV !== 'production'
      ? [
          {
            url: 'http://localhost:8787',
            description: 'Local development server',
          },
        ]
      : []),
  ],
});

// Swagger UI endpoint
app.get('/ui', swaggerUI({ url: '/doc' }));

export default app;

export { app };

export type AppType = typeof app;
