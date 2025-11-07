import { db } from '../client';
import * as schema from '../schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Create users
    console.log('Creating users...');
    const [user1] = await db
      .insert(schema.users)
      .values([
        {
          email: 'rich@richdeane.dev',
          name: 'Rich Deane',
        },
      ])
      .returning();

    console.log(`✅ Created ${2} users`);

    // 2. Create metric types
    console.log('Creating metric types...');
    const metricTypesData = [
      {
        name: 'weight',
        unit: 'kg',
        description: 'Body weight in kilograms',
      },
      {
        name: 'steps',
        unit: 'count',
        description: 'Daily step count',
      },
    ];

    const metricTypes = await db
      .insert(schema.metricTypes)
      .values(metricTypesData)
      .returning();

    console.log(`✅ Created ${metricTypes.length} metric types`);

    // 3. Create measurements for the past 30 days
    console.log('Creating measurements...');
    const measurements = [];
    const now = new Date();

    // Helper to get random value in range
    const random = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Create measurements for each user
    for (const user of [user1]) {
      for (let day = 0; day < 30; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() - day);

        // Weight measurement
        measurements.push({
          userId: user.id,
          metricTypeId: metricTypes[0].id, // weight
          value: (70 + random(-5, 5) + Math.random()).toFixed(2),
          measuredAt: date,
          source: 'apple_health',
        });

        // Steps
        measurements.push({
          userId: user.id,
          metricTypeId: metricTypes[1].id, // steps
          value: random(5000, 15000).toString(),
          measuredAt: date,
          source: 'apple_health',
        });
      }
    }

    const insertedMeasurements = await db
      .insert(schema.measurements)
      .values(measurements)
      .returning();

    console.log(`✅ Created ${insertedMeasurements.length} measurements`);

    // 4. Create goals
    console.log('Creating goals...');
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90); // 3 months from now

    const goals = await db
      .insert(schema.goals)
      .values([
        // Long-term goal: weight loss
        {
          userId: user1.id,
          metricTypeId: metricTypes[0].id, // weight
          type: 'long_term',
          targetValue: '65.00',
          startDate: today.toISOString().split('T')[0],
          targetDate: futureDate.toISOString().split('T')[0],
          active: true,
        },
        // Daily goal: steps
        {
          userId: user1.id,
          metricTypeId: metricTypes[1].id, // steps
          type: 'daily',
          targetValue: '10000',
          startDate: today.toISOString().split('T')[0],
          targetDate: null, // daily goals don't have end dates
          active: true,
        },
      ])
      .returning();

    console.log(`✅ Created ${goals.length} goals`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Users: 1`);
    console.log(`- Metric Types: ${metricTypes.length}`);
    console.log(`- Measurements: ${insertedMeasurements.length}`);
    console.log(`- Goals: ${goals.length}`);
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
