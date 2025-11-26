import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests per 15 minutes in development, 100 in production
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
  skip: (req) => req.path === '/health' // Skip rate limiting for health checks
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to the Finance Tracker API' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
