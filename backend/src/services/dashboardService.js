import prisma from '../config/prisma.js';

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

export const getSummary = async (userId, query = {}) => {
  const dateFilter = buildDateFilter(query);

  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        category: { type: 'INCOME' },
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        category: { type: 'EXPENSE' },
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpense = Number(expense._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};
