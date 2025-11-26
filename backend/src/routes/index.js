import { Router } from 'express';

import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import budgetRoutes from './budgetRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/budgets', budgetRoutes);

export default router;
