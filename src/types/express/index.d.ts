import 'express';

declare module 'express-serve-static-core' {
  interface Response {
    jsonResponse<T>(status: number, data: T): this;

    // CRUD
    jsonCreated<T>(data: T): this; // 201
    jsonRead<T>(data: T): this; // 200
    jsonUpdated<T>(data: T): this; // 200
    jsonDeleted(message?: string): this; // 200 (default message: 'Deleted successfully')
    jsonList<T>(data: T[]): this; // 200

    // Error / status-specific
    jsonError(message?: string): this;
    jsonUnauthorized(message?: string): this;
    jsonForbidden(message?: string): this;
    jsonNotFound(message?: string): this;
  }
}
