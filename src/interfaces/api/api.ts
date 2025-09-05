export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}
