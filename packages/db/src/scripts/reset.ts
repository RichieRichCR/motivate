import { db } from '../client';
import { sql } from 'drizzle-orm';

async function reset() {
  console.log('🔄 Resetting database...');
  console.log('⚠️  This will delete ALL data from ALL tables!');

  try {
    // Drop all tables in the correct order (respecting foreign key constraints)
    console.log('Dropping tables...');

    await db.execute(sql`DROP TABLE IF EXISTS milestones CASCADE`);
    console.log('✅ Dropped milestones table');

    await db.execute(sql`DROP TABLE IF EXISTS goals CASCADE`);
    console.log('✅ Dropped goals table');

    await db.execute(sql`DROP TABLE IF EXISTS measurements CASCADE`);
    console.log('✅ Dropped measurements table');

    await db.execute(sql`DROP TABLE IF EXISTS metric_types CASCADE`);
    console.log('✅ Dropped metric_types table');

    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    console.log('✅ Dropped users table');

    console.log('\n🎉 Database reset completed successfully!');
    console.log('💡 Run migrations to recreate the schema:');
    console.log('   pnpm --filter db migrate');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

// Run the reset
reset()
  .then(() => {
    console.log('✅ Reset script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Reset script failed:', error);
    process.exit(1);
  });
