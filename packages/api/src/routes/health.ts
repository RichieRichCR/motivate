import { OpenAPIHono, z } from '@hono/zod-openapi';

// Create the app with OpenAPI support
const app = new OpenAPIHono();

// Define route with handler inline
app.openapi(
  {
    method: 'get',
    path: '/',
    tags: ['Health'],
    summary: 'Health check endpoint',
    description: 'Returns the health status of the API',
    responses: {
      200: {
        description: 'Successful health check',
        content: {
          'application/json': {
            schema: z.object({
              status: z.string().openapi({ example: 'ok' }),
            }),
          },
        },
      },
    },
  },
  (c) => {
    return c.json({ status: 'ok' }, 200);
  }
);

export { app };
export default app;
