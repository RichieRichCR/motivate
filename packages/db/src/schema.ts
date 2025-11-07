import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  serial,
  numeric,
  integer,
  boolean,
  date,
  unique,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const goalTypeEnum = pgEnum('goal_type', ['daily', 'long_term']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const metricTypes = pgTable('metric_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  unit: varchar('unit', { length: 20 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const measurements = pgTable(
  'measurements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    metricTypeId: integer('metric_type_id')
      .notNull()
      .references(() => metricTypes.id),
    value: numeric('value', { precision: 10, scale: 2 }).notNull(),
    measuredAt: timestamp('measured_at', { withTimezone: true }).notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    source: varchar('source', { length: 50 }).default('apple_health'),
    notes: text('notes'),
  },
  (table) => [
    unique().on(table.userId, table.metricTypeId, table.measuredAt),
    index('idx_measurements_user_metric').on(table.userId, table.metricTypeId),
    index('idx_measurements_measured_at').on(table.measuredAt.desc()),
    index('idx_measurements_user_metric_date').on(
      table.userId,
      table.metricTypeId,
      table.measuredAt.desc(),
    ),
  ],
);

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  metricTypeId: integer('metric_type_id')
    .notNull()
    .references(() => metricTypes.id),
  type: goalTypeEnum('type').notNull(),
  targetValue: numeric('target_value', { precision: 10, scale: 2 }).notNull(),
  startDate: date('start_date').notNull(),
  targetDate: date('target_date'), // null for daily goals, set for long-term goals
  active: boolean('active').default(true).notNull(),
  achieved: boolean('achieved').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  measurements: many(measurements),
  goals: many(goals),
}));

export const metricTypesRelations = relations(metricTypes, ({ many }) => ({
  measurements: many(measurements),
  goals: many(goals),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
  user: one(users, {
    fields: [measurements.userId],
    references: [users.id],
  }),
  metricType: one(metricTypes, {
    fields: [measurements.metricTypeId],
    references: [metricTypes.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
  metricType: one(metricTypes, {
    fields: [goals.metricTypeId],
    references: [metricTypes.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type MetricType = typeof metricTypes.$inferSelect;
export type NewMetricType = typeof metricTypes.$inferInsert;

export type Measurement = typeof measurements.$inferSelect;
export type NewMeasurement = typeof measurements.$inferInsert;

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
