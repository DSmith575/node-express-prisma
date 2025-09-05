import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Seed Data', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should have seed data in the Test table', async () => {
    const testData = await prisma.test.findMany();
    expect(testData.length).toBeGreaterThan(0);
  });
});

// Finish getTest integration tests
