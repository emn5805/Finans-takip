import { Router } from 'express';
import { body, param } from 'express-validator';

import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { handleValidation } from '../utils/validation.js';

const router = Router();

router.use(authenticate);

router.get('/', getCategories);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Category name is required.'),
    body('type')
      .trim()
      .isIn(['income', 'INCOME', 'expense', 'EXPENSE'])
      .withMessage('Type must be income or expense.'),
    handleValidation,
  ],
  createCategory,
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Category id must be a valid UUID.'), handleValidation],
  deleteCategory,
);

export default router;
