import { Response, Request, NextFunction } from 'express';
import { jsonResponseMiddleware } from '@/api/v1/middlewares';
import { HTTP_STATUS } from '@/constants';

describe('jsonResponse middleware', () => {
  // Partial: res may have some of the properties of Response, not necessarily all of them.
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should add jsonResponse and helper methods to res', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    expect(typeof res.jsonResponse).toBe('function');
    expect(typeof res.jsonCreated).toBe('function');
    expect(typeof res.jsonRead).toBe('function');
    expect(typeof res.jsonUpdated).toBe('function');
    expect(typeof res.jsonDeleted).toBe('function');
    expect(typeof res.jsonList).toBe('function');
    expect(typeof res.jsonError).toBe('function');
    expect(typeof res.jsonUnauthorized).toBe('function');
    expect(typeof res.jsonForbidden).toBe('function');
    expect(typeof res.jsonNotFound).toBe('function');

    expect(next).toHaveBeenCalled();
  });

  it('should return a 404 status for jsonNotFound', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    res.jsonNotFound!();

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.NOT_FOUND,
      message: 'Not Found',
    });
  });

  it('should call res.status and res.json when using jsonResponse', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    const data = { foo: 'bar' };
    res.jsonResponse!(HTTP_STATUS.OK, data);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.OK,
      data,
    });
  });

  it('should contain data foo: bar in jsonResponse response', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    const data = { foo: 'bar' };
    res.jsonResponse!(HTTP_STATUS.OK, data);

    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.OK,
      data: { foo: 'bar' },
    });
  });

  it('should use correct status codes in create method', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    const data = { id: '1', name: 'Test' };
    res.jsonCreated!(data);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.CREATED,
      data,
    });
  });

  it('should use correct status codes in read method', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    const data = { id: 1, name: 'Test' };
    res.jsonRead!(data);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.OK,
      data,
    });
  });

  it('should use correct status codes in update method', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    const data = { id: 1, name: 'Updated Test' };
    res.jsonUpdated!(data);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.OK,
      data,
    });
  });

  it('should use correct status codes in delete method', () => {
    jsonResponseMiddleware(req as Request, res as Response, next);

    res.jsonDeleted!();

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HTTP_STATUS.OK,
      data: { message: 'Deleted successfully' }, // <- include data wrapper
    });
  });
});
