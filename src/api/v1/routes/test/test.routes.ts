import { Router } from 'express';
import { getTest } from '@/api/v1/controllers';

const router = Router();

router.get('/test/:testId', getTest);

export { router as testRouter };
