import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

import health from './routes/health';
import userRoutes from './routes/api/v1/user';
import metricsRoutes from './routes/api/v1/metrics';
import { authMiddleware } from './middleware/auth';

import { env } from './env';

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

const app = new OpenAPIHono();

// Register security scheme
app.openAPIRegistry.registerComponent('securitySchemes', 'ApiKeyAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'x-api-key',
});

if (env.NODE_ENV !== 'test') {
  app.use(logger(customLogger));
}

app
  .use(cors())
  .get('/', (c) => {
    return c.text('RR API!');
  })
  .route('/health', health)
  // Apply auth middleware to all /api/* routes
  .use('/api/*', authMiddleware)
  .route('/api/v1/user', userRoutes)
  .route('/api/v1/metrics', metricsRoutes)

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
    {
      url: 'https://api.rd-studios.workers.dev',
      description: 'Production Server',
    },
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
