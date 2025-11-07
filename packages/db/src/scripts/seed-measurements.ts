import { db } from '../client';
import * as schema from '../schema';

async function seed() {
  console.log('🌱 Seeding database...');

  const user1 = '2c8badfe-77ae-43bb-a06b-51d29ea76e54';

  const types = {
    weight: 1,
    steps: 2,
    exerciseTime: 3,
    waterIntake: 4,
    distance: 5,
    standing: 6,
  };

  try {
    // 3. Create measurements for the past 30 days
    console.log('Creating measurements...');
    const measurements = [];
    const now = new Date();

    // Helper to get random value in range
    const random = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Create measurements for each user

    for (let day = 0; day < 90; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);

      measurements.push({
        userId: user1,
        metricTypeId: types.weight,
        value: (130 + random(-10, 10) + Math.random()).toFixed(2),
        measuredAt: date,
        source: 'apple_health',
      });

      measurements.push({
        userId: user1,
        metricTypeId: types.steps,
        value: random(5000, 15000).toString(),
        measuredAt: date,
        source: 'apple_health',
      });
    }

    const insertedMeasurements = await db
      .insert(schema.measurements)
      .values(measurements)
      .returning();

    console.log(`✅ Created ${insertedMeasurements.length} measurements`);
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Users: 1`);
    console.log(`- Measurements: ${insertedMeasurements.length}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed
seed()
  .then(() => {
    console.log('✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
