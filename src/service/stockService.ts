import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveStockData = async (stocks) => {
  try {
    await prisma.stock.createMany({
      data: stocks,
      skipDuplicates: true, // Prevents duplicate entries
    });
    console.log('✅ Stock data saved successfully!');
  } catch (error) {
    console.error('❌ Error saving stock data:', error);
  }
};
