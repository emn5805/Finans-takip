import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

import api from '../lib/api';
import { Category, DateFilter, SummaryResponse, Transaction } from '../types';
import { demoCategories, demoSummary, demoTransactions } from '../data/demo';

const emptySummary: SummaryResponse = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
};

export type Timeframe = 'week' | 'month' | 'year';

export const timeframeToDates = (timeframe: Timeframe, referenceDate: Date = new Date()): DateFilter => {
  const today = referenceDate;
  switch (timeframe) {
    case 'week':
      return {
        startDate: startOfWeek(today, { weekStartsOn: 1 }).toISOString(),
        endDate: endOfWeek(today, { weekStartsOn: 1 }).toISOString(),
      };
    case 'year':
      return {
        startDate: startOfYear(today).toISOString(),
        endDate: endOfYear(today).toISOString(),
      };
    case 'month':
    default:
      return {
        startDate: startOfMonth(today).toISOString(),
        endDate: endOfMonth(today).toISOString(),
      };
  }
};

interface DashboardState {
  summary: SummaryResponse;
  categories: Category[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactions: (ids: string[]) => Promise<void>;
  monthlyStats: { name: string; income: number; expense: number }[];
}

const useDashboardData = (timeframe: Timeframe, referenceDate?: Date): DashboardState => {
  const [summary, setSummary] = useState<SummaryResponse>(emptySummary);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => timeframeToDates(timeframe, referenceDate || new Date()), [timeframe, referenceDate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, categoryRes, transactionRes] = await Promise.all([
        api.get<{ data: SummaryResponse }>('/dashboard/summary', { params: filters }),
        api.get<{ data: Category[] }>('/categories'),
        api.get<{ data: Transaction[] }>('/transactions', { params: filters }),
      ]);

      setSummary(summaryRes.data.data);
      setCategories(categoryRes.data.data);
      setTransactions(transactionRes.data.data);
    } catch (err) {
      console.warn('API unreachable, falling back to demo data.', err);
      setSummary(demoSummary);
      setCategories(demoCategories);
      setTransactions(demoTransactions);
      setError('Sunucuya bağlanılamadı, demo verileri gösteriliyor.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      throw err;
    }
  };

  const deleteTransactions = async (ids: string[]) => {
    try {
      await api.delete('/transactions/bulk', { data: { ids } });
      await fetchData();
    } catch (err) {
      console.error('Failed to delete transactions:', err);
      throw err;
    }
  };

  // Trend stats state (Dynamic: Daily for month view, Monthly for year view)
  const [trendStats, setTrendStats] = useState<{ name: string; income: number; expense: number }[]>([]);

  useEffect(() => {
    const fetchTrendStats = async () => {
      try {
        // If timeframe is 'year', we fetch yearly data and group by month
        if (timeframe === 'year') {
          const yearDates = timeframeToDates('year', referenceDate || new Date());
          const res = await api.get<{ data: Transaction[] }>('/transactions', { params: yearDates });
          const txs = res.data.data;

          const stats = new Map<string, { income: number; expense: number }>();
          const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
          months.forEach(month => stats.set(month, { income: 0, expense: 0 }));

          txs.forEach(tx => {
            const date = new Date(tx.date);
            const monthIndex = date.getMonth();
            const monthName = months[monthIndex];
            const current = stats.get(monthName) || { income: 0, expense: 0 };
            if (tx.category.type === 'INCOME') current.income += Number(tx.amount);
            else current.expense += Number(tx.amount);
            stats.set(monthName, current);
          });
          setTrendStats(Array.from(stats.entries()).map(([name, values]) => ({ name, ...values })));
        }
        // If timeframe is 'month', we use the ALREADY FETCHED transactions (which are for that month) and group by day
        else if (timeframe === 'month') {
          const daysInMonth = new Date(referenceDate?.getFullYear() || new Date().getFullYear(), (referenceDate?.getMonth() || new Date().getMonth()) + 1, 0).getDate();
          const stats = new Map<string, { income: number; expense: number }>();
          const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

          for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(referenceDate?.getFullYear() || new Date().getFullYear(), referenceDate?.getMonth() || new Date().getMonth(), i);
            const dayLabel = `${i} ${dayNames[date.getDay()]}`;
            stats.set(dayLabel, { income: 0, expense: 0 });
          }

          transactions.forEach(tx => {
            const date = new Date(tx.date);
            const day = date.getDate();
            const dayLabel = `${day} ${dayNames[date.getDay()]}`;
            // Note: If the transaction date doesn't match the generated days (e.g. different month/year due to some error), this might fail to match.
            // But since transactions are filtered by the same month, it should be fine.
            // We need to ensure the key matches exactly what we initialized.
            // The loop above initializes keys based on the referenceDate's month.
            // The transactions should belong to that month.

            const current = stats.get(dayLabel);
            if (current) {
              if (tx.category.type === 'INCOME') current.income += Number(tx.amount);
              else current.expense += Number(tx.amount);
              stats.set(dayLabel, current);
            }
          });
          setTrendStats(Array.from(stats.entries()).map(([name, values]) => ({ name, ...values })));
        }
        // For 'week'
        else if (timeframe === 'week') {
          const stats = new Map<string, { income: number; expense: number }>();
          // Initialize all days of the week (Monday to Sunday)
          const daysMap = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
          // Note: getDay() returns 0 for Sunday, 1 for Monday, etc.
          // We need to map 0 -> Pazar, 1 -> Pazartesi... which matches our array if we handle index correctly.
          // But to ensure order in the chart (Mon -> Sun), we should insert them in order.

          const orderedDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
          orderedDays.forEach(day => stats.set(day, { income: 0, expense: 0 }));

          const dayIndexMap = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

          transactions.forEach(tx => {
            const date = new Date(tx.date);
            const dayName = dayIndexMap[date.getDay()];
            const current = stats.get(dayName);
            if (current) {
              if (tx.category.type === 'INCOME') current.income += Number(tx.amount);
              else current.expense += Number(tx.amount);
              stats.set(dayName, current);
            }
          });
          setTrendStats(Array.from(stats.entries()).map(([name, values]) => ({ name, ...values })));
        }

      } catch (err) {
        console.warn('Failed to fetch trend stats, using demo data fallback', err);
        // Demo fallback logic
        if (timeframe === 'year') {
          const stats = new Map<string, { income: number; expense: number }>();
          const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
          months.forEach(month => stats.set(month, { income: 0, expense: 0 }));
          demoTransactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthName = months[date.getMonth()];
            const current = stats.get(monthName) || { income: 0, expense: 0 };
            if (tx.category.type === 'INCOME') current.income += Number(tx.amount);
            else current.expense += Number(tx.amount);
            stats.set(monthName, current);
          });
          setTrendStats(Array.from(stats.entries()).map(([name, values]) => ({ name, ...values })));
        } else {
          const stats = new Map<string, { income: number; expense: number }>();
          const currentMonth = referenceDate?.getMonth() || new Date().getMonth();
          const currentYear = referenceDate?.getFullYear() || new Date().getFullYear();
          const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

          if (timeframe === 'month') {
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
              const date = new Date(currentYear, currentMonth, i);
              const dayLabel = `${i} ${dayNames[date.getDay()]}`;
              stats.set(dayLabel, { income: 0, expense: 0 });
            }
          }

          demoTransactions.forEach(tx => {
            const date = new Date(tx.date);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              const day = date.getDate();
              const dayLabel = `${day} ${dayNames[date.getDay()]}`;
              const current = stats.get(dayLabel);
              if (current) {
                if (tx.category.type === 'INCOME') current.income += Number(tx.amount);
                else current.expense += Number(tx.amount);
                stats.set(dayLabel, current);
              }
            }
          });
          setTrendStats(Array.from(stats.entries()).map(([name, values]) => ({ name, ...values })));
        }
      }
    };
    fetchTrendStats();
  }, [timeframe, referenceDate, transactions]);

  return { summary, categories, transactions, loading, error, refresh: fetchData, deleteTransaction, deleteTransactions, monthlyStats: trendStats };
};

export const extendTransactions = (transactions: Transaction[]) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }
  if (transactions.length >= 6) return transactions;
  const extended = [...transactions];
  while (extended.length < 6) {
    const base = transactions[extended.length % transactions.length];
    extended.push({
      ...base,
      id: `${base.id}-${extended.length}`,
      date: addDays(new Date(base.date), extended.length).toISOString(),
    });
  }
  return extended;
};

export default useDashboardData;
