import { env } from '@/env';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { db, eq, desc, asc } from '@repo/db';
import { measurements, users } from '@repo/db/schema';

// Define the response schema
const HealthResponseSchema = z.object({
  status: z.string().openapi({ example: 'ok' }),
  version: z.string().openapi({ example: 'v1' }),
});

// Create the app with OpenAPI support
const app = new OpenAPIHono();

// Define route and handler together
app
  .openapi(
    {
      method: 'get',
      path: '/',
      tags: ['API v1'],
      summary: 'Health Data from DB',
      description: 'Returns the data from the database for user',
      request: {
        headers: z.object({
          'x-api-key': z
            .string()
            .min(1)
            .openapi({ description: 'API key for authentication' }),
        }),
      },
      responses: {
        200: {
          description: 'Successful health check',
          content: {
            'application/json': {
              schema: HealthResponseSchema,
            },
          },
        },
        401: {
          description: 'Unauthorized - Missing API key',
        },
        403: {
          description: 'Forbidden - Invalid API key',
        },
      },
    },
    async (c) => {
      const apiKey = c.req.header('x-api-key');
      if (!apiKey) return c.json({ error: 'Unauthorized' }, 401);

      if (apiKey !== env.API_KEY) return c.json({ error: 'Forbidden' }, 403);

      // Method 1: Using query builder with relations (gets user and all measurements)
      const user = await db.query.users.findFirst({
        where: eq(users.email, 'rich@richdeane.dev'),
        with: {
          measurements: {
            orderBy: [
              desc(measurements.measuredAt),
              asc(measurements.metricTypeId),
            ],
            limit: 2, // Get recent measurements
            with: {
              metricType: true,
            },
          },
        },
      });

      return c.json(
        {
          status: 'ok',
          data: {
            user: user,
          },
        },
        200,
      );
    },
  )
  .openapi(
    {
      method: 'post',
      path: '/',
      tags: ['API v1'],
      summary: 'Post User Measurement Data',
      description: 'Posts new user measurement data to the database',
      request: {
        headers: z.object({
          'x-api-key': z
            .string()
            .min(1)
            .openapi({ description: 'API key for authentication' }),
        }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                userId: z.string().uuid().openapi({ description: 'User ID' }),
                metricTypeId: z
                  .number()
                  .openapi({ description: 'Metric Type ID' }),
                value: z
                  .number()
                  .transform((val) => val.toString())
                  .openapi({ description: 'Measurement Value' }),
                measuredAt: z
                  .string()
                  .datetime()
                  .transform((str) => new Date(str))
                  .openapi({ description: 'Measurement Timestamp' }),
                source: z
                  .string()
                  .openapi({ description: 'Source of the measurement data' }),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.string().openapi({ example: 'ok' }),
              }),
            },
          },
        },
        400: {
          description: 'Bad Request - Invalid input',
        },
        401: {
          description: 'Unauthorized - Missing API key',
        },
        403: {
          description: 'Forbidden - Invalid API key',
        },
      },
    },
    async (c) => {
      const apiKey = c.req.header('x-api-key');
      if (!apiKey) return c.json({ error: 'Unauthorized' }, 401);

      if (apiKey !== env.API_KEY) return c.json({ error: 'Forbidden' }, 403);

      const validatedBody = c.req.valid('json');
      const { userId, metricTypeId, value, measuredAt, source } = validatedBody;

      await db.insert(measurements).values({
        userId,
        metricTypeId,
        value,
        source,
        measuredAt,
        recordedAt: new Date(),
      });

      return c.json(
        {
          status: 'ok',
        },
        200,
      );
    },
  );

export { app };
export default app;
