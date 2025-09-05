import rateLimit from 'express-rate-limit';
import { API_RATE_LIMITS } from '@/constants';

export const limiter = rateLimit({
  windowMs: API_RATE_LIMITS.windowMs,
  max: API_RATE_LIMITS.limit,
  standardHeaders: API_RATE_LIMITS.standardHeaders,
});
