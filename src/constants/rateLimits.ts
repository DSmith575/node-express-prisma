export interface ApiRateLimits {
  windowMs: number;
  limit: number;
  standardHeaders: boolean;
}

export const API_RATE_LIMITS: ApiRateLimits = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: true,
};
