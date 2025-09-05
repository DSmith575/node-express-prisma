import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

export const getTest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { testId } = req.params;

    if (!testId) {
      return res.jsonError();
    }

    const testData = await prisma.test.findUnique({
      where: { id: String(testId) },
    });

    if (!testData) {
      return res.jsonNotFound(`Test with ID ${testId} not found`);
    }

    res.jsonRead(testData);
  } catch (error) {
    next(error);
  }
};
