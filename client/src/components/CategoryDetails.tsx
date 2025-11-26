import { Category, Transaction } from '../types';
import { formatCurrency, formatPercentage } from '../utils/format';

interface Props {
  categories: Category[];
  transactions: Transaction[];
  loading?: boolean;
}

const CategoryDetails = ({ categories, transactions, loading }: Props) => {
  const toNumber = (value: number | string): number => (typeof value === 'number' ? value : Number(value));

  const expenseCategories = categories.filter((category) => category.type === 'EXPENSE');

  const totals = expenseCategories.map((category) => {
    const total = transactions
      .filter((tx) => tx.categoryId === category.id)
      .reduce((sum, tx) => sum + toNumber(tx.amount), 0);
    return { category, total };
  });

  const totalExpenses = totals.reduce((sum, item) => sum + item.total, 0);
  const safeTotalExpenses = totalExpenses > 0 ? totalExpenses : 1;

  return (
    <div className="space-y-4">
      {totals.map(({ category, total }) => (
        <div key={category.id} className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
              <span>{category.name}</span>
              <span>{loading ? '...' : formatCurrency(total)}</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-primary transition-all"
                style={{ width: `${Math.min(100, (total / safeTotalExpenses) * 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-slate-500">
            {loading ? '-' : formatPercentage((total / safeTotalExpenses) * 100)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryDetails;
