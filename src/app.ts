import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, jsonResponseMiddleware } from '@/api/v1/middlewares';
import { testRouter } from '@/api/v1/routes';
import { API_BASE_URL } from '@/constants';

const app = express();

app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(jsonResponseMiddleware);

app.use(API_BASE_URL, testRouter);

// Global error handler, should be after routes
app.use(errorHandler);

export { app };
