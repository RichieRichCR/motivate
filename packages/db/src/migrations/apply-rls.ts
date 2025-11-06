/**
 * RLS Migration Helper
 *
 * Use this in a custom migration script to enable RLS on your tables.
 *
 * Example usage:
 *
 * ```ts
 * import { db } from './client';
 * import { users, measurements, goals, milestones, metricTypes } from './schema';
 * import { enableRLS, createPolicy } from './rls';
 *
 * async function applyRLS() {
 *   // Enable RLS on users
 *   await db.execute(enableRLS(users));
 *   await db.execute(createPolicy('users_select_own', users, {
 *     for: 'SELECT',
 *     using: 'id = auth.uid()'
 *   }));
 *
 *   // Enable RLS on measurements
 *   await db.execute(enableRLS(measurements));
 *   await db.execute(createPolicy('measurements_select_own', measurements, {
 *     for: 'SELECT',
 *     using: 'user_id = auth.uid()'
 *   }));
 * }
 * ```
 */

import { db } from '../client';
import { users, measurements, goals, milestones, metricTypes } from '../schema';
import { enableRLS, createPolicy } from '../rls';

export async function applyRLSPolicies() {
  console.log('Applying RLS policies...');

  // Enable RLS on users table
  await db.execute(enableRLS(users));
  await db.execute(
    createPolicy('users_select_own', users, {
      for: 'SELECT',
      using: 'id = auth.uid()',
    }),
  );
  await db.execute(
    createPolicy('users_update_own', users, {
      for: 'UPDATE',
      using: 'id = auth.uid()',
      withCheck: 'id = auth.uid()',
    }),
  );

  // Enable RLS on measurements table
  await db.execute(enableRLS(measurements));
  await db.execute(
    createPolicy('measurements_select_own', measurements, {
      for: 'SELECT',
      using: 'user_id = auth.uid()',
    }),
  );
  await db.execute(
    createPolicy('measurements_insert_own', measurements, {
      for: 'INSERT',
      withCheck: 'user_id = auth.uid()',
    }),
  );
  await db.execute(
    createPolicy('measurements_update_own', measurements, {
      for: 'UPDATE',
      using: 'user_id = auth.uid()',
      withCheck: 'user_id = auth.uid()',
    }),
  );
  await db.execute(
    createPolicy('measurements_delete_own', measurements, {
      for: 'DELETE',
      using: 'user_id = auth.uid()',
    }),
  );

  // Enable RLS on goals table
  await db.execute(enableRLS(goals));
  await db.execute(
    createPolicy('goals_all_own', goals, {
      for: 'ALL',
      using: 'user_id = auth.uid()',
      withCheck: 'user_id = auth.uid()',
    }),
  );

  // Enable RLS on milestones table
  await db.execute(enableRLS(milestones));
  await db.execute(
    createPolicy('milestones_all_own', milestones, {
      for: 'ALL',
      using: 'user_id = auth.uid()',
      withCheck: 'user_id = auth.uid()',
    }),
  );

  // Enable RLS on metric_types (public read-only)
  await db.execute(enableRLS(metricTypes));
  await db.execute(
    createPolicy('metric_types_select_all', metricTypes, {
      for: 'SELECT',
      using: 'true',
    }),
  );

  console.log('RLS policies applied successfully!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  applyRLSPolicies()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error applying RLS policies:', error);
      process.exit(1);
    });
}
