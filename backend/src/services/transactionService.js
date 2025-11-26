import prisma from '../config/prisma.js';
import AppError from '../utils/appError.js';

const toNumber = (value) => Number(value ?? 0);

const buildDateFilter = (query) => {
  const filter = {};
  if (query.startDate) {
    filter.gte = new Date(query.startDate);
  }
  if (query.endDate) {
    filter.lte = new Date(query.endDate);
  }
  return Object.keys(filter).length ? filter : undefined;
};

export const listTransactions = async (userId, query = {}) => {
  const dateFilter = buildDateFilter(query);
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(dateFilter ? { date: dateFilter } : {}),
    },
    include: {
      category: {
        select: { id: true, name: true, type: true },
      },
    },
    orderBy: { date: 'desc' },
  });
};

export const createTransaction = async (userId, payload) => {
  const category = await prisma.category.findFirst({ where: { id: payload.categoryId, userId } });
  if (!category) {
    throw new AppError(404, 'Category not found.');
  }

  const amount = toNumber(payload.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    throw new AppError(400, 'Amount must be a positive number.');
  }

  return prisma.transaction.create({
    data: {
      amount,
      date: new Date(payload.date),
      description: payload.description?.trim() || null,
      categoryId: payload.categoryId,
      userId,
    },
    include: {
      category: {
        select: { id: true, name: true, type: true },
      },
    },
  });
};

export const removeTransaction = async (userId, transactionId) => {
  const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!transaction) {
    throw new AppError(404, 'Transaction not found.');
  }

  await prisma.transaction.delete({ where: { id: transactionId } });
  return true;
};

export const removeTransactions = async (userId, transactionIds) => {
  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    throw new AppError(400, 'No transaction IDs provided.');
  }

  // Verify all transactions belong to the user (optional but safer)
  // For bulk delete, we can just deleteMany with userId filter
  const result = await prisma.transaction.deleteMany({
    where: {
      id: { in: transactionIds },
      userId,
    },
  });

  return result.count;
};
