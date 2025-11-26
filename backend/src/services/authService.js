import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../config/prisma.js';
import AppError from '../utils/appError.js';

const TOKEN_EXPIRES_IN = '7d';

const DEFAULT_CATEGORIES = [
  { name: 'Maaş', type: 'INCOME' },
  { name: 'Freelance', type: 'INCOME' },
  { name: 'Market', type: 'EXPENSE' },
  { name: 'Ulaşım', type: 'EXPENSE' },
  { name: 'Faturalar', type: 'EXPENSE' },
  { name: 'Eğlence', type: 'EXPENSE' },
  { name: 'Diğer', type: 'EXPENSE' },
];

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(500, 'JWT_SECRET is not set in the environment.');
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async (email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(409, 'Email is already registered.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({ ...category, userId: user.id })),
  });
  const token = createToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const token = createToken(user.id);
  return {
    token,
    user: sanitizeUser(user),
  };
};
