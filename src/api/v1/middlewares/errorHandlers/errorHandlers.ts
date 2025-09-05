import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '@/interfaces';
export interface AppError extends Error {
  status?: number;
  details?: unknown;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error(err);

  const status = err.status || 500;

  const response: ApiErrorResponse = {
    statusCode: status,
    message: err.message || 'Internal Server Error',
  };

  res.status(status).json(response);
};
