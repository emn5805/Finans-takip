import { useEffect, useMemo, useState } from 'react';
import { Wallet, Target, Edit2, X, Check } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import useDashboardData from '../hooks/useDashboardData';
import api from '../lib/api';
import CurrencyInput from '../components/CurrencyInput';

const BudgetsPage = () => {
  const { categories, transactions, loading: dashboardLoading } = useDashboardData('month');
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [loadingBudget, setLoadingBudget] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newLimit, setNewLimit] = useState<string>('');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await api.get('/budgets', { params: { month: currentMonth, year: currentYear } });
        setBudgetLimit(Number(res.data.data.amount) || 0);
      } catch (err) {
        console.warn('Failed to fetch budget', err);
        // Fallback or just 0
      } finally {
        setLoadingBudget(false);
      }
    };
    fetchBudget();
  }, [currentMonth, currentYear]);

  const handleSaveBudget = async () => {
    try {
      const amount = parseFloat(newLimit);
      if (isNaN(amount) || amount < 0) return;

      const res = await api.post('/budgets', {
        amount,
        month: currentMonth,
        year: currentYear,
      });
      setBudgetLimit(Number(res.data.data.amount));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save budget', err);
      alert('Bütçe kaydedilemedi.');
    }
  };

  const COLORS = [
    { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100' },
    { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
    { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-100' },
    { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-100' },
    { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-100' },
    { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-100' },
    { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-100' },
    { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600', light: 'bg-fuchsia-100' },
  ];

  const totalSpent = useMemo(() => {
    return transactions
      .filter(tx => tx.category.type === 'EXPENSE')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions]);

  const budgetData = useMemo(() => {
    return categories
      .filter((cat) => cat.type === 'EXPENSE')
      .map((category, index) => {
        const spent = transactions
          .filter((tx) => tx.categoryId === category.id)
          .reduce((sum, tx) => sum + Number(tx.amount), 0);
        // Distribute total budget proportionally or just keep dummy limits for categories for now?
        // User asked for "Total Budget". Category budgets might be a future feature or calculated differently.
        // For now, let's keep the dummy logic for category limits but maybe scale them?
        // Or just leave them as static examples since the user only asked for "Total Budget".
        // Let's keep existing logic for category limits to avoid breaking UI, but maybe we can improve it later.
        const limit = 2000 + index * 500;
        const color = COLORS[index % COLORS.length];
        return { category: category.name, spent, limit, color };
      });
  }, [categories, transactions]);

  const progress = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  const isOverBudget = totalSpent > budgetLimit;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Bütçe kontrolü</p>
        <h1 className="text-3xl font-bold text-slate-900">Bütçeler</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {/* Total Budget Card */}
        <div className="relative rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-3">
              <Wallet size={20} />
              <p className="text-sm font-medium">Toplam Bütçe</p>
            </div>
            <button
              onClick={() => {
                setNewLimit(budgetLimit.toString());
                setIsEditing(true);
              }}
              className="rounded-full p-2 hover:bg-slate-100 transition-colors"
            >
              <Edit2 size={16} className="text-slate-400" />
            </button>
          </div>





          {isEditing ? (
            <div className="mt-2 flex items-center gap-2">
              <CurrencyInput
                value={newLimit}
                onChange={(val) => setNewLimit(val)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-lg font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <button onClick={handleSaveBudget} className="rounded-lg bg-emerald-500 p-2 text-white hover:bg-emerald-600">
                <Check size={20} />
              </button>
              <button onClick={() => setIsEditing(false)} className="rounded-lg bg-slate-200 p-2 text-slate-600 hover:bg-slate-300">
                <X size={20} />
              </button>
            </div>
          ) : (
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loadingBudget ? '...' : formatCurrency(budgetLimit)}
            </p>
          )}

          <p className="text-sm text-slate-500 mt-1">Bu ay için planlanan harcama limiti.</p>
        </div>

        {/* Spending Status Card */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Target size={20} />
            <p className="text-sm font-medium">Harcama Durumu</p>
          </div>
          <p className={`mt-3 text-3xl font-bold ${isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
            %{progress.toFixed(1)} <span className="text-lg font-normal text-slate-400">tamamlandı</span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {formatCurrency(totalSpent)} harcandı. {budgetLimit > totalSpent ? `${formatCurrency(budgetLimit - totalSpent)} kaldı.` : `${formatCurrency(totalSpent - budgetLimit)} aşıldı.`}
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Kategori Bazlı Bütçeler</h2>
        <div className="space-y-6">
          {budgetData.map((budget) => (
            <div key={budget.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className={budget.color.text}>{budget.category}</span>
                <span className="text-slate-600">
                  {dashboardLoading ? '...' : `${formatCurrency(budget.spent)} / ${formatCurrency(budget.limit)}`}
                </span>
              </div>
              <div className={`h-3 rounded-full ${budget.color.light}`}>
                <div
                  className={`h-full rounded-full ${budget.color.bg} transition-all duration-500`}
                  style={{ width: `${Math.min(100, (budget.spent / budget.limit) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BudgetsPage;
