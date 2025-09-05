import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/constants';
import { ApiResponse, ApiErrorResponse } from '@/interfaces';

export const jsonResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const send = <T>(status: number, data: T): Response => {
    const response: ApiResponse<T> = { statusCode: status, data };
    return res.status(status).json(response);
  };

  const sendError = (status: number, message: string): Response => {
    const response: ApiErrorResponse = { statusCode: status, message };
    return res.status(status).json(response);
  };

  // Core response
  res.jsonResponse = <T>(status: number, data: T) => send(status, data);

  // CRUD helpers
  res.jsonCreated = <T>(data: T) => send(HTTP_STATUS.CREATED, data);
  res.jsonRead = <T>(data: T) => send(HTTP_STATUS.OK, data);
  res.jsonUpdated = <T>(data: T) => send(HTTP_STATUS.OK, data);
  res.jsonDeleted = (message = 'Deleted successfully') =>
    send(HTTP_STATUS.OK, { message });
  res.jsonList = <T>(data: T[]) => send(HTTP_STATUS.OK, data);

  // Error / status helpers
  res.jsonError = () => sendError(HTTP_STATUS.BAD_REQUEST, 'Bad Request');
  res.jsonUnauthorized = () =>
    sendError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized');
  res.jsonForbidden = () => sendError(HTTP_STATUS.FORBIDDEN, 'Forbidden');
  res.jsonNotFound = () => sendError(HTTP_STATUS.NOT_FOUND, 'Not Found');

  next();
};
