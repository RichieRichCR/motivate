import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { env } from './env';
import * as schema from './schema';

console.log('Database URL:', env.POSTGRES_URL);
const sql = neon(env.POSTGRES_URL);

export const db = drizzle({ client: sql, schema });
