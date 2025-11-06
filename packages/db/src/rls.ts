import { sql } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import { getTableName } from 'drizzle-orm';

/**
 * Helper to generate SQL for enabling RLS on a table
 */
export function enableRLS(table: PgTable) {
  const tableName = getTableName(table);
  return sql.raw(`ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`);
}

/**
 * Helper to create a policy for a table
 */
export function createPolicy(
  policyName: string,
  table: PgTable,
  options: {
    for?: 'ALL' | 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
    to?: string;
    using?: string;
    withCheck?: string;
  },
) {
  const tableName = getTableName(table);
  const forClause = options.for ? `FOR ${options.for}` : 'FOR ALL';
  const toClause = options.to ? `TO ${options.to}` : 'TO authenticated';
  const usingClause = options.using ? `USING (${options.using})` : '';
  const withCheckClause = options.withCheck
    ? `WITH CHECK (${options.withCheck})`
    : '';

  return sql.raw(`
    CREATE POLICY ${policyName} ON ${tableName}
    ${forClause}
    ${toClause}
    ${usingClause}
    ${withCheckClause};
  `);
}

/**
 * Helper to drop a policy
 */
export function dropPolicy(policyName: string, table: PgTable) {
  const tableName = getTableName(table);
  return sql.raw(`DROP POLICY IF EXISTS ${policyName} ON ${tableName};`);
}

/**
 * Helper to disable RLS on a table
 */
export function disableRLS(table: PgTable) {
  const tableName = getTableName(table);
  return sql.raw(`ALTER TABLE ${tableName} DISABLE ROW LEVEL SECURITY;`);
}
