import express from 'express';
import { getBudget, setBudget } from '../controllers/budgetController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getBudget);
router.post('/', setBudget);

export default router;
