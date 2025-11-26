import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import SpendingDonutChart from '../components/SpendingDonutChart';
import IncomeExpenseTrend from '../components/IncomeExpenseTrend';
import useDashboardData from '../hooks/useDashboardData';
import { formatCurrency } from '../utils/format';

const ReportsPage = () => {
  const { summary, categories, transactions, loading } = useDashboardData('month');

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Veri görselleştirmeleri</p>
          <h1 className="text-3xl font-bold text-slate-900">Raporlar</h1>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: TrendingUp, label: 'Net Bilanço', value: formatCurrency(summary.balance) },
          { icon: BarChart3, label: 'Toplam Gelir', value: formatCurrency(summary.totalIncome) },
          { icon: PieChart, label: 'Toplam Gider', value: formatCurrency(summary.totalExpense) },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-400">
              <card.icon size={20} />
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Gelir &amp; Gider Eğrisi</h2>
          <IncomeExpenseTrend transactions={transactions} loading={loading} />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Kategori Dağılımı</h2>
          <SpendingDonutChart categories={categories} transactions={transactions} loading={loading} />
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
