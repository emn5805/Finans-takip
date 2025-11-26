import { Router } from 'express';
import { query } from 'express-validator';

import { getSummary } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { handleValidation } from '../utils/validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/summary',
  [
    query('startDate').optional().isISO8601().withMessage('startDate must be in ISO format (YYYY-MM-DD).'),
    query('endDate').optional().isISO8601().withMessage('endDate must be in ISO format (YYYY-MM-DD).'),
    handleValidation,
  ],
  getSummary,
);

export default router;
