import prisma from '../config/prisma.js';
import AppError from '../utils/appError.js';

const normalizeType = (type) => type?.toUpperCase();
const ALLOWED_TYPES = ['INCOME', 'EXPENSE'];

export const listCategories = async (userId) =>
  prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });

export const createCategory = async (userId, payload) => {
  const normalizedType = normalizeType(payload.type);
  if (!ALLOWED_TYPES.includes(normalizedType)) {
    throw new AppError(400, 'Category type must be income or expense.');
  }

  return prisma.category.create({
    data: {
      name: payload.name.trim(),
      type: normalizedType,
      userId,
    },
  });
};

export const removeCategory = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw new AppError(404, 'Category not found.');
  }

  const linkedTransactions = await prisma.transaction.count({ where: { userId, categoryId } });
  if (linkedTransactions > 0) {
    throw new AppError(400, 'Remove transactions linked to this category before deleting it.');
  }

  await prisma.category.delete({ where: { id: categoryId } });

  return true;
};
