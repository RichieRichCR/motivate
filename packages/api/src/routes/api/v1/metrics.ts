import { OpenAPIHono, z } from '@hono/zod-openapi';
import { Context } from 'hono';
import { db } from '@repo/db/client';
import { measurements, metricTypes, users } from '@repo/db/schema';
import { desc, eq } from '@repo/db';

const BaseMetricSchema = z.object({
  id: z.number().openapi({ description: 'Metric Type ID' }),
  name: z.string().openapi({ description: 'Name of the Metric Type' }),
  unit: z.string().openapi({ description: 'Unit of Measurement' }),
  description: z
    .string()
    .nullable()
    .optional()
    .openapi({ description: 'Description of the Metric Type' }),
  createdAt: z.date().openapi({ description: 'Creation Timestamp' }),
});

const SingleMetricTypeSchema = z.object({ data: BaseMetricSchema });
const MetricTypeSchema = z.object({ data: z.array(BaseMetricSchema) });

const CreateMetricResponseSchema = z.object({
  status: z.string().openapi({ example: 'ok' }),
  data: z.number().openapi({
    example: 12345,
    description: 'ID of the created measurement',
  }),
});

export type CreateMetricResponse = z.infer<typeof CreateMetricResponseSchema>;
export type SingleMetricSchemaResponse = z.infer<typeof SingleMetricTypeSchema>;
export type MetricSchemaResponse = z.infer<typeof MetricTypeSchema>;

// Create the app with OpenAPI support
const app = new OpenAPIHono();

// Define route and handler together
app
  .openapi(
    {
      method: 'get',
      path: '/',
      tags: ['Metric Routes'],
      summary: 'Metric Types Endpoint',
      description: 'Gets All Metric Types from the database',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Successful Data check',
          content: {
            'application/json': {
              schema: z.object({
                status: z.string().openapi({ example: 'ok' }),
              }),
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
    async (c: Context) => {
      try {
        const metrics = await db.select().from(metricTypes);

        const parsedMetrics = MetricTypeSchema.parse({ data: metrics });

        return c.json(parsedMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  )

  .openapi(
    {
      method: 'get',
      path: '/{id}',
      tags: ['Metric Routes'],
      summary: 'Data Endpoint',
      description: 'Returns the data from the database for a given metric ID',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      request: {
        params: z.object({
          id: z
            .string()
            .transform((val) => Number(val))
            .openapi({ description: 'Metric ID' }),
        }),
      },
      responses: {
        200: {
          description: 'Successful Data check',
          content: {
            'application/json': {
              schema: MetricTypeSchema,
            },
          },
        },
        400: {
          description: 'Bad Request - Missing Metric ID',
        },
        401: {
          description: 'Unauthorized - Missing API key',
        },
        403: {
          description: 'Forbidden - Invalid API key',
        },
      },
    },
    async (c: Context) => {
      try {
        const metric = await db
          .select()
          .from(metricTypes)
          .where(eq(metricTypes.id, Number(c.req.param('id'))));

        const parsedMetric = MetricTypeSchema.parse({ data: metric });

        return c.json({ parsedMetric });
      } catch (error) {
        console.error('Error fetching metrics:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  )

  .openapi(
    {
      method: 'post',
      path: '/',
      tags: ['Metric Routes'],
      summary: 'Post User Measurement Data',
      description: 'Posts new user measurement data to the database',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({
                name: z
                  .string()
                  .max(20)
                  .min(1)
                  .openapi({ description: 'Matric Name' }),
                unit: z
                  .string()
                  .max(20)
                  .min(1)
                  .openapi({ description: 'Unit of Measurement' }),
                description: z
                  .string()
                  .openapi({ description: 'Description of the metric' }),
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
              schema: CreateMetricResponseSchema,
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
    async (c: Context) => {
      try {
        const body = await c.req.json();
        const { name, unit, description } = body;

        const newId = await db
          .insert(metricTypes)
          .values({
            name,
            unit,
            description,
            createdAt: new Date(),
          })
          .returning();

        const parseData = CreateMetricResponseSchema.safeParse({
          status: 'ok',
          data: newId,
        });

        return c.json(parseData, 200);
      } catch (error) {
        console.error('Error creating measurement:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  );

export { app };
export default app;
