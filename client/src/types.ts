export type CategoryType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description?: string | null;
  categoryId: string;
  userId: string;
  createdAt: string;
  category: Category;
  recurring?: 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export interface SummaryResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface DateFilter {
  startDate?: string;
  endDate?: string;
}
