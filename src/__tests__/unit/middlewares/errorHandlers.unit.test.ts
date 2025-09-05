import { errorHandler, AppError } from '@/api/v1/middlewares';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/constants';

describe('errorHandler middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle AppError with custom status', () => {
    const err: AppError = {
      name: 'AppError',
      message: 'Custom error',
      status: HTTP_STATUS.BAD_REQUEST,
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: 'Custom error',
    });
  });

  it('should handle generic Error (no status)', () => {
    const err = new Error('Something went wrong');

    errorHandler(err as AppError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  });

  it('should use default message if error has no message', () => {
    const err = {} as AppError;

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  });
});
