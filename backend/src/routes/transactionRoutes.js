import { Router } from 'express';
import { body, param, query } from 'express-validator';

import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  deleteTransactions,
} from '../controllers/transactionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { handleValidation } from '../utils/validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [
    query('startDate').optional().isISO8601().withMessage('startDate must be in ISO format (YYYY-MM-DD).'),
    query('endDate').optional().isISO8601().withMessage('endDate must be in ISO format (YYYY-MM-DD).'),
    query('categoryId').optional().isUUID().withMessage('categoryId must be a valid UUID.'),
    handleValidation,
  ],
  getTransactions,
);

router.post(
  '/',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
    body('date').isISO8601().withMessage('Date must be provided in ISO format (YYYY-MM-DD).'),
    body('categoryId').isUUID().withMessage('Category id must be a valid UUID.'),
    body('description').optional().isLength({ max: 255 }).withMessage('Description is too long.'),
    handleValidation,
  ],
  createTransaction,
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Transaction id must be a valid UUID.'), handleValidation],
  deleteTransaction,
);

router.delete(
  '/bulk',
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array of UUIDs.'),
    body('ids.*').isUUID().withMessage('Each id must be a valid UUID.'),
    handleValidation,
  ],
  deleteTransactions,
);

export default router;
