import { PrismaClient } from '@prisma/client';
import testSeed from './seeds/testSeed/testSeed.json';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  try {
    for (const item of testSeed.data) {
      await prisma.test.create({
        data: {
          text: item.text,
        },
      });
      console.log(`Created: ${item.text}`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
