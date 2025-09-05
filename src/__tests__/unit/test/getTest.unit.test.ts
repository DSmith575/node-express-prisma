import { Request, Response, NextFunction } from 'express';
import { getTest } from '@/api/v1/controllers';
import { HTTP_STATUS } from '@/constants';
import { PrismaClient } from '@prisma/client';

interface PrismaMock {
  test: { findUnique: jest.Mock };
  $disconnect: jest.Mock;
}

// ----- Prisma Mock -----
jest.mock('@prisma/client', () => {
  const mockTestSingle = {
    statusCode: 200,
    data: {
      id: 'uuid-123',
      text: 'Hello World',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockPrisma = {
    test: { findUnique: jest.fn().mockResolvedValue(mockTestSingle) },
    $disconnect: jest.fn(),
  };

  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// ----- Mock JSON Response Middleware -----
const mockJsonMethods = () => ({
  jsonResponse: jest.fn(),
  jsonCreated: jest.fn(),
  jsonRead: jest.fn(),
  jsonUpdated: jest.fn(),
  jsonDeleted: jest.fn(),
  jsonList: jest.fn(),
  jsonError: jest.fn(),
  jsonUnauthorized: jest.fn(),
  jsonForbidden: jest.fn(),
  jsonNotFound: jest.fn(),
});

describe('getTest controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response> & ReturnType<typeof mockJsonMethods>;
  let next: NextFunction;
  let prismaMock: PrismaMock;

  beforeAll(() => {
    prismaMock = new PrismaClient() as unknown as PrismaMock;
  });

  beforeEach(() => {
    req = { params: { testId: 'uuid-123' } };
    res = {
      ...mockJsonMethods(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response> & ReturnType<typeof mockJsonMethods>;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the test object when found', async () => {
    await getTest(req as Request, res as Response, next);

    expect(prismaMock.test.findUnique).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
    });

    expect(res.jsonRead).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.OK,
      data: {
        id: 'uuid-123',
        text: 'Hello World',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if testId is missing', async () => {
    req.params = {};
    await getTest(req as Request, res as Response, next);

    expect(res.jsonError).toHaveBeenCalled();
    expect(prismaMock.test.findUnique).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if test not found', async () => {
    prismaMock.test.findUnique.mockResolvedValueOnce(null);

    await getTest(req as Request, res as Response, next);

    expect(prismaMock.test.findUnique).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
    });

    expect(res.jsonNotFound).toHaveBeenCalledWith(
      'Test with ID uuid-123 not found',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if an exception occurs', async () => {
    const error = new Error('Database error');
    prismaMock.test.findUnique.mockRejectedValueOnce(error);

    await getTest(req as Request, res as Response, next);

    expect(prismaMock.test.findUnique).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
    });

    expect(next).toHaveBeenCalledWith(error);
    expect(res.jsonRead).not.toHaveBeenCalled();
  });
});
