import { OpenAPIHono, z } from '@hono/zod-openapi';

import { Context } from 'hono';
import { db } from '@repo/db/client';
import { measurements, metricTypes, users } from '@repo/db/schema';
import { desc, eq, gte, lte } from '@repo/db';
import { customLogger } from '../../../index';
import { Measurement } from '../../../../../db/src/schema';

// Define the response schema
const UserDataResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().uuid().openapi({ description: 'Measurement ID' }),
      metricTypeId: z.number().openapi({ description: 'Metric Type ID' }),
      metricName: z.string().openapi({ description: 'Metric Name' }),
      metricUnit: z.string().openapi({ description: 'Metric Unit' }),
      value: z.string().openapi({ description: 'Measurement Value' }),
      measuredAt: z.date().openapi({ description: 'Measured At' }),
      source: z.string().openapi({ description: 'Source' }),
    }),
  ),
});

const MeasurementsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().uuid().openapi({ description: 'Measurement ID' }),
      metricTypeId: z.number().openapi({ description: 'Metric Type ID' }),
      metricName: z.string().openapi({ description: 'Metric Name' }),
      metricUnit: z.string().openapi({ description: 'Metric Unit' }),
      value: z.string().openapi({ description: 'Measurement Value' }),
      measuredAt: z.date().openapi({ description: 'Measured At' }),
      source: z.string().openapi({ description: 'Source' }),
      notes: z
        .string()
        .max(500)
        .optional()
        .nullable()
        .openapi({ description: 'Notes' }),
    }),
  ),
});

const UserGoalsResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().uuid().openapi({ description: 'Goal ID' }),
      metricTypeId: z.number().openapi({ description: 'Metric Type ID' }),
      type: z.string().openapi({ description: 'Goal Type' }),
      targetValue: z.string().openapi({ description: 'Target Value' }),
      startDate: z.string().date().openapi({ description: 'Start Date' }),
      targetDate: z
        .string()
        .date()
        .nullable()
        .openapi({ description: 'End Date' }),
      active: z.boolean().openapi({ description: 'Is Goal Active' }),
      achieved: z.boolean().openapi({ description: 'Is Goal Achieved' }),
      createdAt: z.date().openapi({ description: 'Created At' }),
      updatedAt: z.date().openapi({ description: 'Updated At' }),
      metricType: z
        .object({
          id: z.number().openapi({ description: 'Metric Type ID' }),
          name: z.string().openapi({ description: 'Metric Name' }),
          unit: z.string().openapi({ description: 'Metric Unit' }),
          description: z
            .string()
            .openapi({ description: 'Metric Description' }),
          createdAt: z.date().openapi({ description: 'Created At' }),
        })
        .openapi({ description: 'Associated Metric Type' }),
    }),
  ),
});

const DataPostResponse = z.object({
  status: z.string().openapi({ example: 'ok' }),
});

export type UserDataResponse = z.infer<typeof UserDataResponseSchema>;
export type MeasurementResponse = z.infer<typeof MeasurementsSchema>;
export type UserDataPostResponse = z.infer<typeof DataPostResponse>;
export type UserGoalsResponse = z.infer<typeof UserGoalsResponseSchema>;

// Create the app with OpenAPI support
const app = new OpenAPIHono();

// Define route and handler together
app
  .openapi(
    {
      method: 'get',
      path: '/',
      tags: ['User Routes'],
      summary: 'User Entry Data Endpoint',
      description: 'Returns nothing, just a test endpoint for user routes',
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
        return c.json({ status: 'ok' });
      } catch (error) {
        console.error('Error fetching measurements:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  )
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      tags: ['User Routes'],
      summary: 'Data Endpoint',
      description: 'Returns the data from the database for user',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({ description: 'User ID' }),
        }),
      },
      responses: {
        200: {
          description: 'Successful Data check',
          content: {
            'application/json': {
              schema: UserDataResponseSchema,
            },
          },
        },
        400: {
          description: 'Bad Request - Missing user ID',
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
        const userId = c.req.param('id');

        if (!userId) {
          return c.json({ error: 'Bad Request - Missing user ID' }, 400);
        }

        const latestMeasurements = await db
          .selectDistinctOn([measurements.metricTypeId], {
            id: measurements.id,
            userId: measurements.userId,
            metricTypeId: measurements.metricTypeId,
            metricName: metricTypes.name,
            metricUnit: metricTypes.unit,
            value: measurements.value,
            measuredAt: measurements.measuredAt,
            source: measurements.source,
          })
          .from(measurements)
          .innerJoin(users, eq(measurements.userId, users.id))
          .innerJoin(metricTypes, eq(measurements.metricTypeId, metricTypes.id))
          .where(eq(users.id, userId))
          .orderBy(measurements.metricTypeId, desc(measurements.measuredAt));

        const userData = latestMeasurements[0].userId;

        const payload = UserDataResponseSchema.parse({
          data: latestMeasurements,
        });

        return c.json(payload);
      } catch (error) {
        console.error('Error fetching measurements:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  )
  .openapi(
    {
      method: 'get',
      path: '/{id}/goals',
      tags: ['User Routes'],
      summary: 'Gets the goals for the user',
      description: 'Returns the data from the database for user',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({ description: 'User ID' }),
        }),
      },
      responses: {
        200: {
          description: 'Successful Data check',
          content: {
            'application/json': {
              schema: UserGoalsResponseSchema,
            },
          },
        },
        400: {
          description: 'Bad Request - Missing user ID',
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
        const userId = c.req.param('id');

        if (!userId) {
          return c.json({ error: 'Bad Request - Missing user ID' }, 400);
        }

        const goals = await db.query.goals.findMany({
          where: (goals, { eq, and }) =>
            and(eq(goals.userId, userId), eq(goals.active, true)),
          orderBy: (goals, { asc }) => [
            asc(goals.metricTypeId),
            asc(goals.startDate),
          ],
          with: { metricType: true },
        });

        const payload = UserGoalsResponseSchema.parse({
          status: 'ok',
          data: goals,
        });

        return c.json(payload);
      } catch (error) {
        console.error('Error fetching measurements:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  )
  .openapi(
    {
      method: 'get',
      path: '/{id}/measurements/{metricTypeId}',
      tags: ['User Routes'],
      summary: 'Gets the measurements for the user and metric type',
      description:
        'Returns the data from the database for user and metric type',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({ description: 'User ID' }),
          metricTypeId: z.string().openapi({ description: 'Metric Type ID' }),
        }),
        query: z.object({
          startDate: z
            .string()
            .date()
            .optional()
            .openapi({ description: 'Start Date for filtering' }),
          endDate: z
            .string()
            .date()
            .optional()
            .openapi({ description: 'End Date for filtering' }),
        }),
      },
      responses: {
        200: {
          description: 'Successful Data check',
          content: {
            'application/json': {
              schema: MeasurementsSchema,
            },
          },
        },
        400: {
          description: 'Bad Request - Missing user ID',
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
      const { logger } = c.var;
      try {
        const userId = c.req.param('id');
        const metricTypeId = c.req.param('metricTypeId');

        const startDate = c.req.query('startDate');
        const endDate = c.req.query('endDate');

        if (!userId) {
          return c.json({ error: 'Bad Request - Missing user ID' }, 400);
        }

        const databaseMeasurements = await db.query.measurements.findMany({
          where: (measurement, { eq, and }) => {
            const conditions = [
              eq(measurement.userId, userId),
              eq(measurement.metricTypeId, Number(metricTypeId)),
            ];

            if (startDate) {
              conditions.push(gte(measurement.measuredAt, new Date(startDate)));
            }

            if (endDate) {
              // Add one day to endDate to include all measurements from that day
              const endDateTime = new Date(endDate);
              endDateTime.setDate(endDateTime.getDate() + 1);
              conditions.push(lte(measurement.measuredAt, endDateTime));
            }

            return and(...conditions);
          },
          orderBy: (measurement, { asc }) => [asc(measurement.measuredAt)],
          with: { metricType: true },
        });

        // Group measurements by date and keep only the latest measurement per date
        const measurementsByDate = new Map<
          string,
          (typeof databaseMeasurements)[0]
        >();

        databaseMeasurements.forEach((m) => {
          // Extract just the date part (YYYY-MM-DD) in local timezone
          const dateKey = m.measuredAt.toISOString().split('T')[0];

          // If we haven't seen this date yet, or this measurement is later in the day
          const existing = measurementsByDate.get(dateKey);
          if (!existing || m.measuredAt > existing.measuredAt) {
            measurementsByDate.set(dateKey, m);
          }
        });

        // Convert map back to array and sort by date
        const measurements = Array.from(measurementsByDate.values())
          .sort((a, b) => a.measuredAt.getTime() - b.measuredAt.getTime())
          .map((m) => ({
            id: m.id,
            metricTypeId: m.metricTypeId,
            metricName: m.metricType.name,
            metricUnit: m.metricType.unit,
            value: m.value,
            measuredAt: m.measuredAt,
            source: m.source,
            notes: m.notes,
          }));

        const payload = MeasurementsSchema.parse({
          status: 'ok',
          data: measurements,
        });

        return c.json(payload);
      } catch (error) {
        if (error instanceof Error) customLogger(error.message.toString());
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  )
  .openapi(
    {
      method: 'post',
      path: '/',
      tags: ['User Routes'],
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
              schema: DataPostResponse,
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
        const { userId, metricTypeId, value, measuredAt, source } = body;

        await db.insert(measurements).values({
          userId: userId.toString(),
          metricTypeId,
          value: typeof value === 'number' ? value.toString() : value,
          source,
          measuredAt:
            typeof measuredAt === 'string' ? new Date(measuredAt) : measuredAt,
          recordedAt: new Date(),
        });

        return c.json({ status: 'ok' }, 201);
      } catch (error) {
        console.error('Error creating measurement:', error);
        return c.json({ error: 'Internal Server Error', message: error }, 500);
      }
    },
  );

export { app };
export default app;
